const profileRouter = require("./profileRouter");
const userRouter = require("./userRouter");

const appRouter = require("express").Router();

appRouter.use("/user", userRouter);
appRouter.use("/profile", profileRouter);

module.exports = appRouter;
