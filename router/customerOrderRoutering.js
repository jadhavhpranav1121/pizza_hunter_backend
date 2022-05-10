const express = require("express");
require("../db/conn");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const admin = require("../models/customerOrder.js");
const app = express();
const router = new express.Router();

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request 1');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request 2');
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
        return res.status(401).send('Unauthorized request 3');
    }
    req.userId = payload.subject
    next();
}
router.post("/orders", async(req, res) => {
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
router.get("/orders", async(req, res) => {
    const newdata = await admin.find();
    res.send(newdata);
})
router.patch("/orders/:name", async(req, res) => {
    const email = req.params.name;
    const newdata = await admin.updateOne({ email }, { $push: { "orders": req.body } });
    res.send(newdata);
})
router.patch("/orders/changingStatus/:id", async(req, res) => {
    const id = req.params.id;
    const newdata = await admin.updateOne({ "_id": id }, { $set: { "orders": req.body } });
    res.send(newdata);
})


router.patch("/orders/:email/orders", async(req, res) => {
        const email = req.params.email;
        // const order_number = req.params.order_number;
        console.log(req.body);
        const newdata = await admin.updateOne({ "email": email }, { $pull: { "orders": req.body } });
        res.send(newdata);
    })
    // router.patch("/orders/:id/orders", async(req, res) => {
    //     const id = req.params.id;
    //     console.log("243");

//     res.send(newdata);
// })
router.put("/orders/:customer_id/orders/:product_id", async(req, res) => {
    const customer_id = req.params.customer_id;
    const product_id = req.params.product_id;
    console.log(customer_id + " " + product_id);
    // const newdata = await admin.updateOne({ _id: customer_id }, {{ $set: { "orders.$[i].0.1.status": req.body.status } },{arrayFilters: [{ "i._id": product_id }]});

})
router.delete("/orders/:email", async(req, res) => {
    const email = req.params.email;
    const name = await admin.deleteOne({ "email": email });
    console.log(name);
    res.send(name);
})
app.use(router);
module.exports = router;