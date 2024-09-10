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
const duplicateRemovalRoutes = require("./routes/removeDuplicates.js");
const dateFormattingRoutes = require("./routes/dateFormattingRoutes")
app.use(exportRoutes);
app.use(duplicateRemovalRoutes);
app.use(dateFormattingRoutes)

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

const parseCustomDate = (dateStr) => {
  const customDatePattern =
    /^(\d+\.\d+) (\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) ([AP]M)$/;
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  if (isoDatePattern.test(dateStr)) {
    return dateStr; // Return the date as is if it is already in ISO format
  }

  const match = dateStr.match(customDatePattern);
  if (match) {
    const [_, fraction, day, month, year, hour, minute, second, period] = match;
    let hours = parseInt(hour, 10);
    const minutes = parseInt(minute, 10);
    const seconds = parseInt(second, 10);

    if (period === "PM" && hours < 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    );
    return date.toISOString();
  }

  return dateStr; // Return the original string if it doesn't match the pattern
};

const convertToISO = (lasttime) => {
  if (!lasttime) return null;

  const parts = lasttime.split(/[\s,]+/);
  if (parts.length < 3) return null;

  const [datePart, timePart, period] = parts;
  const [day, month, year] = datePart.split("/");
  if (!day || !month || !year) return null;

  let [hours, minutes, seconds] = timePart.split(":");
  if (!hours || !minutes || !seconds) return null;

  if (period.toLowerCase() === "pm" && hours !== "12") {
    hours = String(parseInt(hours, 10) + 12);
  } else if (period.toLowerCase() === "am" && hours === "12") {
    hours = "00";
  }

  return new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
  );
};

function convertToISO(timeString) {
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

    const pcData = await AllTime.find({}).skip(skip).limit(limit).exec();
    const groupedData = {};

    pcData.forEach((doc) => {
      const data = doc._doc; // Access the actual document data
      const isoDate = convertToISO(data.lasttime);
      if (!isoDate) return; // Skip if conversion fails

      const day = isoDate.toISOString().split("T")[0];
      const key = `${data.eiin}-${data.labnum}-${data.pcnum}-${day}`;

      if (!groupedData[key] || isoDate > convertToISO(groupedData[key].lasttime)) {
        groupedData[key] = { ...data, isoLastTime: isoDate };
      }
    });

    let result = Object.values(groupedData);

    // Sort the results by isoLastTime in descending order
    result.sort((a, b) => b.isoLastTime - a.isoLastTime);

    // Remove the temporary isoLastTime field
    result = result.map((doc) => {
      const { isoLastTime, ...rest } = doc;
      return rest;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/get-video", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 200;
    const page = parseInt(req.params.page) || 1;
    const skip = (page - 1) * limit;

    const videoData = await VideoInfo.find({}).skip(skip).limit(limit);

    // Preprocess date fields to ensure consistent formatting
    const processedData = videoData.map((doc) => {
      if (doc.video_start_date_time &&
        doc.video_start_date_time.match(/^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/)) {
        doc.video_start_date_time = parseCustomDate(doc.video_start_date_time);
      }
      if (doc.video_end_date_time &&
        doc.video_end_date_time.match(/^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/)) {
        doc.video_end_date_time = parseCustomDate(doc.video_end_date_time);
      }
      return doc;
    });

    return res.json({ aggregatedData: processedData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get("/get-interval", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 200;
    const page = parseInt(req.params.page) || 1;
    const skip = (page - 1) * limit;

    const intervalData = await IntervalInfo.find({}).skip(skip).limit(limit);
    const enrichedData = intervalData
      .map((doc) => {
        const data = doc._doc; // Access the actual document data
        const isoDate = convertToISO(data.lasttime);
        return { ...data, isoLastTime: isoDate };
      })
      .filter((doc) => doc.isoLastTime !== null);

    // Sort the results by isoLastTime in descending order
    enrichedData.sort((a, b) => b.isoLastTime - a.isoLastTime);
    return res.json({ result: enrichedData });
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

