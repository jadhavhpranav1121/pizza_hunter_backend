const express = require("express");
require("../db/conn");
const cors = require("cors");
const admin = require("../models/admin");
const app = express();
const router = new express.Router();
router.post("/admin", async(req, res) => {
    try {
        const newadmin = await new admin(req.body)
        console.log("Data" + newadmin);
        newadmin.save().then(() => {
            res.status(201).send(newadmin);
            console.log('catched');
        }).catch((e) => {
            console.log(e);
            res.status(404).send(e);
        })
    } catch (e) {
        console.log(e);
    }
})
router.post('/admin/auth', async(req, res) => {
    let userData = req.body;
    console.log(userData);
    
    admin.findOne({ email: userData.email }, async(error, user) => {
        console.log(user);
        if (error) {
            console.log(error);
        } else {

            if (!user) {
                res.status(401).send('invalid email');
            } else {
                // console.log(userData.password, user.Pass);
                // const isMatch = await bcrypt.compare(userData.password, user.Pass);
                // if (isMatch == false) {
                //     res.status(401).send('Invalid Password')
                // } else {
                //     let payload = { subject: user._id };
                //     let token = jwt.sign(payload, 'secretKey');
                //     res.status(200).send({ token });
                // }
            }
        }
    });
})
router.get("/admin", async(req, res) => {
    const newdata = await admin.find();
    // console.log(newdata);
    res.send(newdata);
})
router.get("/admin/auth/:email", async(req, res) => {
    const email = req.params.email;
    const newdata = await admin.findOne({ "email": email });
    res.send(newdata);
})
router.patch("/admin/:email", async(req, res) => {
    const email = req.params.email;
    const newdata = await admin.updateOne({ email }, req.body);
    res.send(newdata);
})
router.delete("/admin/:id", async(req, res) => {
    const id = req.params.id;
    const name = await admin.findByIdAndDelete(id);
    res.send(name);
})
app.use(router);
module.exports = router;