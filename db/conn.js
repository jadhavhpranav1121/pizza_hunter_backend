const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pizzaclient:KakashiHatake123@cluster0.udup1.mongodb.net/pizzaclient?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('Connected');
  client.close();
});
