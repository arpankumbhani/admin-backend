const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//signup route handler

exports.signup = async (req, res) => {
  try {
    //get data

    const { username, email, phone, password, role } = req.body;
    //if user already exists

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error i hashing password",
      });
    }

    //create new user
    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    // console.log(user);
    return res.status(200).json({
      success: user,
      message: "User registered successfully",
    });
  } catch (error) {
    // console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error cannot be registered",
    });
  }
};

//login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the details carefully",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          _id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Send email upon successful login
      const subject = "Successful Login";
      const text = `Hello ${user.username},\n\nYou have successfully logged in.`;

      // sendEmail(user.email, subject, text);

      // Remove sensitive information before sending the response
      user.password = undefined;

      res.status(200).json({
        success: true,
        token,
        message: "User login successful",
      });
    } else {
      // Password not match
      return res.status(403).json({
        success: false,
        message: "Password does not match, please try again",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const role = req.role;
    let user;
    if (role === "1") {
      user = await User.find();
    } else {
      user = await User.find({
        _id: req.userId,
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
      message: " ",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId, username, email, phone, role } = req.body;

    const user_Id = req.userId;
    const userRole = req.role;
    if (user_Id !== userId && userRole !== "1") {
      return res.status(404).json({ error: "You can not edit this user " });
    }
    // console.log(userId);
    const updateUser = await User.findOne({ _id: userId });
    // console.log(updateUser);
    // console.log(userId);
    if (!updateUser) {
      return res.status(404).json({ error: "user not found " });
    }

    updateUser.username = username;
    updateUser.email = email;
    updateUser.phone = phone;
    updateUser.role = role;

    await updateUser.save();

    res.json({ message: "user updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    // console.log(userId, "userId");

    // const user_Id = req.userId;
    // // const userRole = req.role;
    // console.log(user_Id, "user_Id");

    // if (user_Id !== userId) {
    //   return res
    //     .status(403)
    //     .json({ error: "You do not have permission to delete this user" });
    // }

    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
