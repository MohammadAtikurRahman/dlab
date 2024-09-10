require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose").set("debug", true);
const moment = require("moment");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { AllTime, VideoInfo, IntervalInfo } = require("./model/user.js");

const exportRoutes = require('./routes/exportRoutes');
const duplicateRemovalRoutes = require("./routes/removeDuplicates");
const dateFormattingRoutes = require("./routes/dateFormattingRoutes")
const generalRoutes = require("./routes/generalRoutes")

app.use(exportRoutes);
app.use(generalRoutes);
app.use(duplicateRemovalRoutes);
app.use(dateFormattingRoutes)
app.use(generalRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}' from ${req.ip}`);
  res.header("Access-Control-Allow-Origin", "*"); // Be more specific in production
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

function convertToISO(timeString) {
  if (moment(timeString, moment.ISO_8601, true).isValid()) {
    return timeString;
  }
  const parsedDate = moment(timeString, "DD/MM/YYYY, hh:mm:ss a");
  return parsedDate.toISOString();
}

app.post("/pc-info", async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Expected an array of objects");
  }
  try {
    let updates = req.body;
    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: {
          dayid: update.dayid,
          starttime: convertToISO(update.starttime),
          lasttime: convertToISO(update.lasttime),
          totaltime: update.totaltime,
          pcname: update.pcname,
          eiin: update.eiin,
          schoolname: update.schoolname,
          labnum: update.labnum,
          pcnum: update.pcnum,
        },
        update: {
          $set: {
            dayid: update.dayid,
            starttime: convertToISO(update.starttime),
            lasttime: convertToISO(update.lasttime),
            totaltime: update.totaltime,
            pcname: update.pcname,
            eiin: update.eiin,
            schoolname: update.schoolname,
            labnum: update.labnum,
            pcnum: update.pcnum,
          }
        },
        upsert: true
      }
    }))

    const savedTimes = await AllTime.bulkWrite(bulkOps);
    return res.status(201).json(savedTimes);
  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }
})

app.post("/inter-info", async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Expected an array of objects");
  }
  try {
    let updates = req.body;
    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: {
          dayid: update.dayid,
          starttime: convertToISO(update.starttime),
          lasttime: convertToISO(update.lasttime),
          totaltime: update.totaltime,
          pcname: update.pcname,
          eiin: update.eiin,
          schoolname: update.schoolname,
          labnum: update.labnum,
          pcnum: update.pcnum,
        },
        update: {
          $set: {
            dayid: update.dayid,
            starttime: convertToISO(update.starttime),
            lasttime: convertToISO(update.lasttime),
            totaltime: update.totaltime,
            pcname: update.pcname,
            eiin: update.eiin,
            schoolname: update.schoolname,
            labnum: update.labnum,
            pcnum: update.pcnum,
          }
        },
        upsert: true
      }
    }))
    const savedTimes = await IntervalInfo.bulkWrite(bulkOps);
    return res.status(201).json(savedTimes);
  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }
});

app.post("/video-info", async (req, res) => {
  console.log("Received for VideoInfo:", req.body);
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Expected an array of objects");
  }
  try {
    const updates = req.body;
    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: {
          dayid: update.dayid,
          pcname: update.pcname,
          eiin: update.eiin,
          schoolname: update.schoolname,
          labnum: update.labnum,
          pcnum: update.pcnum,
          video_name: update.video_name,
          video_start: update.video_start,
          video_start_date_time: update.video_start_date_time,
          video_end: update.video_end,
          video_end_date_time: update.video_end_date_time,
          duration: update.duration,
        },
        update: {
          dayid: update.dayid,
          pcname: update.pcname,
          eiin: update.eiin,
          schoolname: update.schoolname,
          labnum: update.labnum,
          pcnum: update.pcnum,
          video_name: update.video_name,
          video_start: update.video_start,
          video_start_date_time: update.video_start_date_time,
          video_end: update.video_end,
          video_end_date_time: update.video_end_date_time,
          duration: update.duration,
        },
        upsert: true
      }
    }))

    const savedVideos = await VideoInfo.bulkWrite(bulkOps);
    return res.status(201).send(savedVideos);
  } catch (error) {
    console.error("Insertion error in VideoInfo:", error);
    return res.status(500).send(error.message);
  }
});

app.get("/get-pc", async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 200;
    const skip = (page - 1) * limit;

    const pcData = await AllTime.find({}).sort({ lasttime: -1 }).skip(skip).limit(limit).exec();

    return res.json({ result: pcData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/chart-pc", async (req, res) => {
  try {
    let sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo = sevenDaysAgo.toISOString();

    const pcData = await AllTime.find({
      lasttime: {
        $gte: sevenDaysAgo,
      }
    });

    return res.json({ result: pcData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get("/get-video", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 200;
    const page = parseInt(req.params.page) || 1;
    const skip = (page - 1) * limit;

    const videoData = await VideoInfo.find({}).sort({ video_end_date_time: -1 }).skip(skip).limit(limit);

    return res.json({ aggregatedData: videoData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get("/chart-video", async (req, res) => {
  try {
    let sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo = sevenDaysAgo.toISOString();

    const videoData = await VideoInfo.find({
      video_end_date_time: {
        $gte: sevenDaysAgo,
      }
    });
    return res.json({ aggregatedData: videoData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get("/get-interval", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 200;
    const page = parseInt(req.params.page) || 1;
    const skip = (page - 1) * limit;

    const intervalData = await IntervalInfo.find({}).sort({ lasttime: -1 }).skip(skip).limit(limit);

    return res.json({ result: intervalData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
