const { UserModel, ProfileModel } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const envProcessConfig = require("../config/config");
const { validateEmail } = require("../utils/helper");

const userController = {
  registerUser: async (req, res) => {
    try {
      let { username, email, password } = req.body;

      // Validate input data
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Please provide username, email, and password" });
      }

      email = email.toLowerCase();

      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ where: { email } });

      if (existingUser) {
        let isVerified = existingUser.isVerified;

        return isVerified
          ? res
              .status(400)
              .json({ error: `User with ${existingUser.email} already exists` })
          : res
              .status(400)
              .json({ error: "User already exists but not verified" });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const verificationToken = jwt.sign(
        { email, username },
        envProcessConfig.jwtSecret,
        {
          expiresIn: "24h",
        }
      );

      // Create new user
      const newUser = await UserModel.create({
        username,
        email,
        password: hashPassword,
        verificationToken,
      });

      // Create an associated profile
      const newProfile = await ProfileModel.create({
        userId: newUser.id,
        firstName: newUser.username,
        lastName: "",
        address: "",
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  loginUser: async (req, res) => {
    try {
      let { email, password } = req.body;
      // Validate input data
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Please provide email and password" });
      }

      email = email.toLowerCase();

      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if user exists
      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.isVerified) {
        return res
          .status(403)
          .json({ error: "User not verified, please verify your email!" });
      }

      // Check if password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        envProcessConfig.jwtSecret,
        {
          expiresIn: "24h",
        }
      );
      return res.status(200).json({
        message: "Login successful",
        token,
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        expiresIn: 24 * 60 * 60,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.findAll({
        attributes: {
          exclude: ["password", "verificationToken", "resetPasswordToken"],
        },
      });
      return res.status(200).json({
        message: "Users fetched successfully",
        users,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findByPk(id, {
        attributes: {
          exclude: ["password", "verificationToken", "resetPasswordToken"],
        },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
      const user = await UserModel.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.username = username || user.username;
      user.email = email || user.email;
      await user.save();
      return res.status(200).json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await user.destroy();
      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { token, id } = req.params;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      const decoded = jwt.verify(token, envProcessConfig.jwtSecret);
      const user = await UserModel.findOne({ where: { email: decoded.email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.id != id) {
        return res.status(400).json({ error: "Invalid token" });
      }

      user.isVerified = true;
      user.isActive = true;
      user.verificationToken = null;

      await user.save();
      return res.status(200).json({
        message: "User verified successfully",
      });
    } catch (error) {
      console.error(error);

      //JsonWebTokenError: jwt malformed
      if (error.name === "JsonWebTokenError") {
        return res.status(400).json({ error: "Invalid token" });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userController;
