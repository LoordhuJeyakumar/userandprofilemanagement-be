//Import express framework for creating server
//Import cors for handling cross origin resource sharing
const express = require("express");
const cors = require("cors");
const appRouter = require("./routes");

// Create an instance of Express
const app = express();

//Enable CORS middleware (Cross-Origin Resource Sharing) for all requests
app.use(cors());

//Middleware for parsing application/json
app.use(express.json());

// Define a simple route for the root URL
app.get("/", (req, res) => {
  res.status(200).send(`
        <h1></h1>
        <h1>Welcome to User & Profile Management API</h1>
        <b style="color:white; background-color:green; padding:5">Connected to MongoDB Application Health is Good</b>`);
});

// Use the application routes defined in appRouter
app.use("/api/v1", appRouter);

//Define middleware function to handle unknown routes
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" });
};

//Use the unknownEndpoint middleware for all unknown routes
app.use(unknownEndpoint);

// Define a simple route for the root URL to check server status
module.exports = app;
