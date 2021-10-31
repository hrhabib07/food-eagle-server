// import pack
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

//call app and make port
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqoy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("FoodEagle");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const customersCollection = database.collection("customer");

    // get data from db
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // get order info from db
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await productsCollection.findOne(query);
      console.log(result);
    });
    // add new order
    app.post("/newOrder", async (req, res) => {
      // console.log(req.body);
      const doc = req.body;
      const result = await ordersCollection.insertOne(doc);
      res.json(result);
    });
    // add new order
    app.post("/newServices", async (req, res) => {
      const doc = req.body;
      const result = await productsCollection.insertOne(doc);
      res.json(result);
    });
    // add new order
    app.post("/customer", async (req, res) => {
      // console.log(req.body);
      const doc = req.body;
      const result = await customersCollection.insertOne(doc);
      res.json(result);
    });
    // get order list from db
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // get customer information from db
    app.get("/myOrder", async (req, res) => {
      const cursor = customersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete order
    app.delete("/orders/:id", async (req, res) => {
      const uid = req.params.id;
      const query = { _id: ObjectId(uid) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });
    // delete order
    app.delete("/products/:id", async (req, res) => {
      const uid = req.params.id;
      const query = { _id: ObjectId(uid) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
    // delete order
    app.delete("/customersOrder/:id", async (req, res) => {
      const uid = req.params.id;
      const query = { _id: ObjectId(uid) };
      const result = await customersCollection.deleteOne(query);
      res.send(result);
    });
    // delete order
    app.delete("/clearOrders", async (req, res) => {
      const result = await ordersCollection.deleteMany({});
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
// api related works
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log("Listening from port ", port);
});
