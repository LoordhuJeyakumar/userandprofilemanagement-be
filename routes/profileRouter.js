const profileController = require("../controllers/profileController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const profileRouter = require("express").Router();

profileRouter.get("/getProfile", authMiddleware, profileController.getProfile);

module.exports = profileRouter;
