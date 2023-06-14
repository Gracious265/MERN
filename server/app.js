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

const customer = new Customer({
  name: "Gracious",
  industry: "IT",
});

app.get("/", (req, res) => {
  res.send("Welcome");
});

//endpoint to list all customers
app.get("/api/customers", async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  try {
    const result = await Customer.find();
    res.json({ customers: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// getting data by ID
app.get("/api/customers/:id", async (req, res) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query,
  });
  try {
    const { id: customerId } = req.params;
    console.log(customerId);
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
    } else {
      res.json({ customer });
    }
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// endpoint for updating customer
app.put("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.replaceOne({ _id: customerId }, req.body);
    console.log(result);
    res.json({ updatedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ err: "something went wrong" });
  }
});

//endpoint for deleting a customer by ID
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ err: "something went wrong" });
  }
});

//endpoint for adding new customer
app.post("/api/customers", async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (err) {
    res.status(404).json({ error: err.message });
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
