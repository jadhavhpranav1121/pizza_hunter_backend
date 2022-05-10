const express = require("express");
const bcrypt = require("bcryptjs");
require("./db/conn");
const cors = require("cors");
const cookieParser = require('cookie-parser');
require("./router/adminRoutering");
const admin = require("./models/admin");
const customer = require("./models/customer");
const items = require("./models/items");
const adminRouter = require("./router/adminRoutering");
const customerRouter = require("./router/customerRoutering");
const itemsRouter = require("./router/itemsRoutering");
const customerOrder = require("./router/customerOrderRoutering");
const bodyParser = require('body-parser');
const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "300mb" }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(cors({ origin: 'http://localhost:4200' }))
app.use(adminRouter);
app.use(customerRouter);
app.use(itemsRouter);
app.use(customerOrder);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("success");
})