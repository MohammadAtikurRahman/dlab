// Load environment variables
require("dotenv").config();

// Import required libraries
const express = require("express");
const app = express();
const cors = require("cors");
const moment = require('moment');
const expressJwt = require('express-jwt');
const os = require('os');
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const csv = require('csv-parser');
const fs = require('fs');
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { AllTime, VideoInfo,IntervalInfo } = require("./model/user.js");

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}' from ${req.ip}`);
    next();
});




app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});





app.post('/pc-info', async (req, res) => {
  // Expect req.body to be an array of objects
  if (!Array.isArray(req.body)) {
      return res.status(400).send("Expected an array of objects");
  }

  try {
      const savedTimes = await AllTime.insertMany(req.body); // Bulk insert the array of objects
      res.status(201).send(savedTimes); // Return the array of saved documents
  } catch (error) {
      res.status(400).send(error.message); // If an error occurs, send the error message
  }
});


app.post('/inter-info', async (req, res) => {
  // Expect req.body to be an array of objects
  if (!Array.isArray(req.body)) {
      return res.status(400).send("Expected an array of objects");
  }

  try {
      const savedTimes = await IntervalInfo.insertMany(req.body); // Bulk insert the array of objects
      res.status(201).send(savedTimes); // Return the array of saved documents
  } catch (error) {
      res.status(400).send(error.message); // If an error occurs, send the error message
  }
});






app.post('/video-info', async (req, res) => {
  console.log("Received for VideoInfo:", req.body);
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Expected an array of objects");
  }

  try {
    const savedVideos = await VideoInfo.insertMany(req.body);
    res.status(201).send(savedVideos);
  } catch (error) {
    console.error("Insertion error in VideoInfo:", error);
    res.status(500).send(error.message);
  }
});






app.get('/get-pc', async (req, res) => {
  try {
    const pcData = await AllTime.find({});
    res.json(pcData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define the 'get-video' endpoint
app.get('/get-video', async (req, res) => {
  try {
    const videoData = await VideoInfo.find({});
    res.json(videoData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/get-interval', async (req, res) => {
  try {
    const videoData = await IntervalInfo.find({});
    res.json(videoData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

















app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
