const express = require("express");
require("../db/conn");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const customer = require("../models/customer");
const orders = require("../models/customerOrder")
const { consoleTestResultHandler } = require("tslint/lib/test");
const app = express();
app.use(cookieParser());
const router = new express.Router();
require("dotenv").config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const smsKey = process.env.SMS_SECRET_KEY;
let refreshTokens = [];

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject
    next();
}
router.post('/sendOTP', (req, res) => {
    const phone = req.body.phone;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const ttl = 2 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    const fullhash = `${hash}.${expires}`;
    client.messages.create({
        body: `Your one Time Login Password For pizza hunter is ${otp}`,
        from: +15305573486,
        to: "+91" + phone
    }).then((messages) => console.log(messages)).catch((error) => {
        console.error(error);
    })
    res.status(200).send({ phone, hash: fullhash, otp });
})

router.post('/verifyOTP', (req, res) => {
    const phone = req.body.phone;
    const hash = req.body.hash;
    const otp = req.body.otp;
    let [hashValue, expires] = hash.split('.');
    let now = Date.now();
    if (now > parseInt(expires)) {
        return res.status(504).send({ msg: 'Timeout pls Try again' });
    }
    const data = `${phone}.${otp}.${expires}`;
    const newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    console.log(newCalculatedHash + "-------" + hashValue);
    if (newCalculatedHash === hashValue) {

        const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' })
        const refreshToken = jwt.sign({ data: phone }, JWT_REFRESH_TOKEN, { expiresIn: '30s' })
        refreshTokens.push(refreshToken);

        res.status(202).cookie('accessToken', accessToken, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict', httpOnly: true })
            .cookie('refreshToken', refreshToken, { expires: new Date(new Date().getTime() + 35557600000), sameSite: 'strict', httpOnly: true })
            .cookie('authSession', true, { expires: new Date(new Date().getTime() + 30 * 1000) })
            .cookie('refreshTokenID', true, { expires: new Date(new Date().getTime() + 35557600000) }).send({ error: { verification: true, msg: 'Device Verified' } });

    } else {
        return res.status(400).send({ verification: false, msg: `Incorrect OTP` });
    }
    // console.log(req.cookie.accessToken);
});
async function authenticateUser(req, res, next) {
    const accessToken = req.cookies.accessToken;
    jwt.verify(accessToken, JWT_AUTH_TOKEN, async(err, phone) => {
        if (phone) {
            req.phone = phone;
            next()
        } else if (err.message === 'Token Expire Error') {
            return res.status(401).send({ success: false, msg: 'Access Token Expired' });
        } else {
            console.error(err);
            res.status(403).send({ err, msg: 'User Not Authenicated' })
        }
    })

}
router.post('/refresh', (req, res) => {
    const refreshToken = req.cookie.refreshToken;
    if (!refreshToken) return res.status(403).send({ msg: 'Refresh Token not found,Please Login Again' });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).send({ msg: "Refresh Token Blocked,login Again" });
    jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, phone) => {
        if (!err) {
            const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' })
            res.status(202).cookie('accessToken', accessToken, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict', httpOnly: true })
                .cookie('authSession', true, { expires: new Date(new Date().getTime() + 30 * 1000) }).send({ msg: 'Device Verified' }).send({ previouseSessionExpiry: true, success: true });
        } else {
            return res.status(403).send({ success: false, msg: 'Invalid Refresh Token' });
        }
    })
})
router.get('/logout', (req, res) => {
    res.clearCookie('refreshToken').clearCookie('accessToken').clearCookie('authSession').clearCookie('refreshTokenID').send('User logged Out');
})
router.post("/customer", async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.Pass, salt);
        req.body.Pass = hashedPassword;
        const newcustomer = await new customer(req.body)
        newcustomer.save((error, registeredUser) => {
            if (error) {
                console.log(error);
            } else {
                let payload = { subject: registeredUser._id };
                let token = jwt.sign(payload, 'secretKey');
                console.log(token);
                res.status(200).send({ token });
                console.log('catched');
            }
        });
    } catch (e) {
        console.log(e);
    }
})


router.post("/customer/auth", async(req, res) => {
    let userData = req.body;
    console.log(userData.email);
    customer.findOne({ email: userData.email }, async(error, user) => {
        console.log(user);
        if (error) {
            console.log(error);
        } else {

            if (!user) {
                res.status(401).send('invalid email');
            } else {
                console.log(userData.password, user.Pass);
                const isMatch = await bcrypt.compare(userData.password, user.Pass);
                if (isMatch == false) {
                    res.status(401).send('Invalid Password')
                } else {
                    let payload = { subject: user._id };
                    let token = jwt.sign(payload, 'secretKey');
                    res.status(200).send({ token });
                }
            }
        }
    });

    // res.send({ token });
})
router.get("/customer", async(req, res) => {
    const newdata = await customer.find();
    // console.log(newdata);
    res.send(newdata);
})
router.patch("/customer/:email", verifyToken, async(req, res) => {
    const email = req.params.email;
    const newdata = await customer.updateOne({ email }, req.body);
    res.send(newdata);
})
router.delete("/customer/:id", verifyToken, async(req, res) => {
    const id = req.params.id;
    const name = await customer.findByIdAndDelete(id);
    res.send(name);
})
app.use(router);
module.exports = router;