const multer = require("multer");
const profileController = require("../controllers/profileController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const profileRouter = require("express").Router();

profileRouter.get("/getProfile", authMiddleware, profileController.getProfile);
profileRouter.put(
  "/updateProfile",
  authMiddleware,
  profileController.updateProfile
);
profileRouter.delete(
  "/deleteProfile",
  authMiddleware,
  profileController.deleteProfile
);
profileRouter.put(
  "/updateProfilePicture",
  authMiddleware,
  upload.single("profilePicture"),
  profileController.updateProfilePicture
);

module.exports = profileRouter;
