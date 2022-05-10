const express = require("express");
require("../db/conn");
const cors = require("cors");
const items = require("../models/items");
const app = express();
const router = new express.Router();
router.post("/items", async(req, res) => {
    try {
        const newitems = await new items(req.body)
        console.log("Data" + newitems);
        newitems.save().then(() => {
            res.status(201).send(newitems);
            console.log('catched');
        }).catch((e) => {
            console.log(e);
            res.status(404).send(e);
        })
    } catch (e) {
        console.log(e);
    }
})
router.get("/items", async(req, res) => {
    const newdata = await items.find();
    // console.log(newdata);
    res.send(newdata);
})
router.get("/items/:id", async(req, res) => {
    const id = req.params.id;
    console.log(id);
    const newdata = await items.findById({ "_id": id });
    console.log(newdata);
    res.send(newdata);
})
router.patch("/items/:id", async(req, res) => {
    const id = req.params.id;
    const newdata = await items.updateOne({ "_id": id }, { $set: { "name": req.body.name, "images": req.body.images, "Pass": req.body.Pass, "price": req.body.price, "count": req.body.count } });
    res.send(newdata);
})
router.delete("/items/:id", async(req, res) => {
    const id = req.params.id;
    const name = await items.findByIdAndDelete(id);
    res.send(name);
})
app.use(router);
module.exports = router;