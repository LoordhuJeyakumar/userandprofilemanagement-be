const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const userRouter = require("express").Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/getAllUsers", userController.getAllUsers);
userRouter.get("/getUser", authMiddleware, userController.getUserDetails);
userRouter.put("/updateUser", authMiddleware, userController.updateUser);
userRouter.delete("/deleteUser/:id", userController.deleteUser);

//Verify User
userRouter.get("/verify/:id/:token", userController.verifyUser);

//Protected Route token
userRouter.get("/protected-route", authMiddleware, (req, res) => {
  res.status(200).json({ message: "This is a protected route" });
});

//Change Password
userRouter.put(
  "/changePassword",
  authMiddleware,
  userController.changePassword
);

module.exports = userRouter;
