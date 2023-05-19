const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pgeg54g.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollection = client
      .db("toyMarketPlace")
      .collection("toySuperHero");
    const newToyCollection = client
      .db("toyMarketPlace")
      .collection("newToySuperHero");

    app.get("/toySuperHero", async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/newToySuperHero", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await newToyCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/newToySuperHero/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          toyName: 1,
          imageURL: 1,
          price: 1,
          ratings: 1,
          sellerName: 1,
          email: 1,
          details: 1,
          quantity: 1,
        },
      };
      const result = await  newToyCollection.findOne(query);
      res.send(result);
      console.log(result)
    });
    app.post("/newToySuperHero", async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await newToyCollection.insertOne(newToy);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The toy marketplace server is running");
});
app.listen(port, () => {
  console.log(`The toy marketplace server is running on port: ${port}`);
});
