const express = require("express");
const mongoose = require("mongoose");
const Customer = require("./models/Customer");

const app = express();
mongoose.set("strictQuery", false);

// reading from environment

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const customers = [
//   {
//     name: "Gracious",
//     industry: "IT",
//   },
//   {
//     name: "Rejoice",
//     industry: "Health",
//   },
//   {
//     name: "Joshua",
//     industry: "IT",
//   },
//   {
//     name: "Priscilla",
//     industry: "Social Work",
//   },
// ];

const customer = new Customer({
  name: "Gracious",
  industry: "IT",
});

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/api/customers", async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  try {
    const result = await Customer.find();
    res.json({ customers: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:id', async(req, res) => {
  res.json({
    requestParams: req.params,
    requestQuery: req.query
  })
});

app.post("/api/customers", async(req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({customer});
  } catch(err) {
    res.status(400).json({error: err.message});
  }
  
});

const start = async () => {
  // getting errors
  try {
    await mongoose.connect(CONNECTION);
    app.listen(PORT, () => {
      console.log("listening on port " + PORT);
    });
  } catch (err) {
    console.log(err.message);
  }
};

start();
