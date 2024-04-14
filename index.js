const express = require("express");
const mongoose = require("mongoose");
const userApi = require("./routes/user");
const productsApi = require("./routes/products");
const cartApi = require("./routes/cart");
const OrderApi = require("./routes/orders");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const url =
  "mongodb+srv://tabraiz:tabraiz@cluster0.76smate.mongodb.net/mern_e-commerce?retryWrites=true&w=majority";
mongoose.connect(url).then(console.log("connected to db"));
app.use("/users", userApi);
app.use("/api", productsApi);
app.use("/api", cartApi);
app.use("/api", OrderApi);

app.listen(5000, () => console.log("connection successfull at port 5000"));
