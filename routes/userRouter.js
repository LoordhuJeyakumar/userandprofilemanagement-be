const userController = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/getAllUsers", userController.getAllUsers);
userRouter.get("/getUserById/:id", userController.getUserById);
userRouter.put("/updateUser/:id", userController.updateUser);
userRouter.delete("/deleteUser/:id", userController.deleteUser);

//Verify User
userRouter.get("/verify/:id/:token", userController.verifyUser);

module.exports = userRouter;
