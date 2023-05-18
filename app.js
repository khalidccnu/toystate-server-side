const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();
app.use(cors());

const mdbClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async (_) => {
  try {
    const categories = mdbClient.db("toystate").collection("categories");
    const toys = mdbClient.db("toystate").collection("toys");

    app.get("/categories", async (req, res) => {
      let result;

      if (req.query.id) {
        const query = { _id: new ObjectId(req.query.id) };
        result = await categories.findOne(query);
      } else {
        const cursor = categories.find();
        result = await cursor.toArray();
      }

      res.send(result);
    });

    app.get("/toys", async (req, res) => {
      let result;

      if (req.query.id) {
        const query = { _id: new ObjectId(req.query.id) };
        result = await toys.findOne(query);
      } else if (req.query.cid) {
        const query = { category_id: req.query.cid };
        const cursor = toys.find(query);
        result = await cursor.toArray();
      } else {
        const cursor = toys.find();
        result = await cursor.toArray();
      }

      res.send(result);
    });

    app.get("/toys/discount", async (req, res) => {
      const query = { discount: true };
      const cursor = toys.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    mdbClient
      .db("admin")
      .command({ ping: 1 })
      .then((_) => console.log("Successfully connected to MongoDB!"));
  } catch (err) {
    console.log("Did not connect to MongoDB! " + err.message);
  } finally {
    await mdbClient.close();
  }
})();

app.get("/", (req, res) => {
  res.send("ToyState is running...");
});

app.listen(port, (_) => {
  console.log(`ToyState API is running on port: ${port}`);
});
