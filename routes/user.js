const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/userModel");
const verifyToken = require("../middleware/verifyToken");
const secret_key = "ABC";

router.post("/register", async (req, res) => {
  console.log(req.body.data);
  const { name, email, password, phoneNumber, isAdmin, sellerId } =
    req.body.data;

  try {
    const userExist = await Users.findOne({ email });
    // const sellerIdExist = await Users.findOne({ sellerId });
    console.log(sellerIdExist);
    if (userExist) {
      res.status(400).json({ message: "email is already registered" });
    }
    // else if (sellerIdExist) {
    //   res.status(400).json({ message: "seller id is already exist" });
    // }
    else {
      const securePassword = await bcrypt.hash(password, 10);
      const user = await Users.create({
        name,
        email,
        password: securePassword,
        phoneNumber,
        address: req.body.address,
        isAdmin,
        sellerId,
      });
      const data = { user: user.id };
      const token = jwt.sign(data, secret_key);
      res.status(200).json({
        message: "Registration successful.Please Sign in now",
        token,
      });
    }
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password, phoneNumber } = req.body;
  console.log(req.body);
  try {
    const userExist = phoneNumber
      ? await Users.findOne({ phoneNumber })
      : await Users.findOne({ email });

    if (!userExist) {
      res.status(400).json({ message: "credentials invalid" });
    } else {
      const comparePassword = await bcrypt.compare(
        password,
        userExist.password
      );

      if (!comparePassword) {
        res.status(400).json({ message: "invalid password" });
      } else {
        const data = { user: userExist.id };
        const token = jwt.sign(data, secret_key);
        res.status(200).json({ message: "login successfull", token });
      }
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

router.put("/newaddress", verifyToken, async (req, res) => {
  try {
    const { newAddress } = req.body;
    console.log(newAddress);
    const user = await Users.findByIdAndUpdate(
      { _id: req.user },
      { newAddress }
    );
    res.status(200).json({ message: "new address added sucessfully", user });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

router.get("/fetchaddress", verifyToken, async (req, res) => {
  try {
    const address = await Users.findOne({ _id: req.user }, "-password");
    res.status(200).json(address);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
