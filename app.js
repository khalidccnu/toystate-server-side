const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("ToyState is running...");
});

app.listen(port, (_) => {
  console.log(`ToyState API is running on port: ${port}`);
});
