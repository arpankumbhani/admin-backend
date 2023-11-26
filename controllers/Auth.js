const bcrypt = require("bcrypt");

const User = require("../models/User");
const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//signup route handler

exports.signup = async (req, res) => {
  try {
    //get data
    const { username, email, password, role } = req.body;
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
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(err);
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

    //validation on email and password
    if (!email || !password) {
      return res.status(400)({
        success: false,
        message: "please Fill all the details carefully",
      });
    }

    //check for the registered users
    let user = await User.findOne({ email });
    //if not a registered user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not a registered ",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    //varify password and generate a JWT token
    if (await bcrypt.compare(password, user.password)) {
      //password match
      // let token = jwt.sign(payload, process.env.JWT_SECRET, {
      //   expiresIn: "2h",
      // });

      const token = jwt.sign(
        {
          _id: user.id,
          role: user.role,
        },
        "AdminAccess",
        {
          expiresIn: "1d",
        }
      );
      console.log(user);
      const oldUser = { ...user, token };
      console.log(oldUser);

      user.password = undefined;
      console.log(user);

      res.status(200).json({
        success: true,
        token,
        message: "user login successful ",
      });
      // const option = {
      //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      //   httpOnly: true,
      // };
      // res.cookie = ("token", token, option).status(200).json({
      //   success: true,
      //   token,
      //   user,
      //   message: "user login successful ",
      // });
    } else {
      // passworld not match
      return (
        res.status(403),
        json({
          success: false,
          message: "Passworld not match , plase try Again ",
        })
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
