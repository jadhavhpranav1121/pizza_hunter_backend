const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const uri = "mongodb+srv://pizzaclient:KakashiHatake123@cluster0.udup1.mongodb.net/pizzaclient?retryWrites=true&w=majority&ssl=true";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false, useCreateIndex: true}).then(()=>{
    console.log("connection sucessful");
  }).catch((err)=>{
    console.log(err);
  }); 