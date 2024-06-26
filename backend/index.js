// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose").set("debug", true);
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// app.use(express.static("uploads"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const { AllTime, VideoInfo, IntervalInfo } = require("./model/user.js");

// app.use((req, res, next) => {
//   console.log(`${req.method} request for '${req.url}' from ${req.ip}`);
//   res.header("Access-Control-Allow-Origin", "*"); // Be more specific in production
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to the Home Page!");
// });

// const parseCustomDate = (dateStr) => {
//   const customDatePattern =
//     /^(\d+\.\d+) (\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) ([AP]M)$/;
//   const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

//   if (isoDatePattern.test(dateStr)) {
//     return dateStr; // Return the date as is if it is already in ISO format
//   }

//   const match = dateStr.match(customDatePattern);
//   if (match) {
//     const [_, fraction, day, month, year, hour, minute, second, period] = match;
//     let hours = parseInt(hour, 10);
//     const minutes = parseInt(minute, 10);
//     const seconds = parseInt(second, 10);

//     if (period === "PM" && hours < 12) {
//       hours += 12;
//     } else if (period === "AM" && hours === 12) {
//       hours = 0;
//     }

//     const date = new Date(
//       Date.UTC(year, month - 1, day, hours, minutes, seconds)
//     );
//     return date.toISOString();
//   }

//   return dateStr; // Return the original string if it doesn't match the pattern
// };

// const convertToISO = (lasttime) => {
//   if (!lasttime) return null;

//   const parts = lasttime.split(/[\s,]+/);
//   if (parts.length < 3) return null;

//   const [datePart, timePart, period] = parts;
//   const [day, month, year] = datePart.split("/");
//   if (!day || !month || !year) return null;

//   let [hours, minutes, seconds] = timePart.split(":");
//   if (!hours || !minutes || !seconds) return null;

//   if (period.toLowerCase() === "pm" && hours !== "12") {
//     hours = String(parseInt(hours, 10) + 12);
//   } else if (period.toLowerCase() === "am" && hours === "12") {
//     hours = "00";
//   }

//   return new Date(
//     `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
//   );
// };

// app.post("/pc-info", async (req, res) => {
//   // Expect req.body to be an array of objects
//   if (!Array.isArray(req.body)) {
//     return res.status(400).send("Expected an array of objects");
//   }

//   try {
//     const savedTimes = await AllTime.insertMany(req.body); // Bulk insert the array of objects
//     res.status(201).send(savedTimes); // Return the array of saved documents
//   } catch (error) {
//     res.status(400).send(error.message); // If an error occurs, send the error message
//   }
// });

// app.post("/inter-info", async (req, res) => {
//   // Expect req.body to be an array of objects
//   if (!Array.isArray(req.body)) {
//     return res.status(400).send("Expected an array of objects");
//   }

//   try {
//     const savedTimes = await IntervalInfo.insertMany(req.body); // Bulk insert the array of objects
//     res.status(201).send(savedTimes); // Return the array of saved documents
//   } catch (error) {
//     res.status(400).send(error.message); // If an error occurs, send the error message
//   }
// });

// app.post("/video-info", async (req, res) => {
//   console.log("Received for VideoInfo:", req.body);
//   if (!Array.isArray(req.body)) {
//     return res.status(400).send("Expected an array of objects");
//   }

//   try {
//     const savedVideos = await VideoInfo.insertMany(req.body);
//     res.status(201).send(savedVideos);
//   } catch (error) {
//     console.error("Insertion error in VideoInfo:", error);
//     res.status(500).send(error.message);
//   }
// });

// app.get("/get-pc", async (req, res) => {
//   try {
//     const pcData = await AllTime.find({});
//     const groupedData = {};

//     pcData.forEach((doc) => {
//       const data = doc._doc; // Access the actual document data
//       const isoDate = convertToISO(data.lasttime);
//       if (!isoDate) return; // Skip if conversion fails

//       const day = isoDate.toISOString().split("T")[0];
//       const key = `${data.eiin}-${data.labnum}-${data.pcnum}-${day}`;

//       if (
//         !groupedData[key] ||
//         isoDate > convertToISO(groupedData[key].lasttime)
//       ) {
//         groupedData[key] = { ...data, isoLastTime: isoDate };
//       }
//     });

//     let result = Object.values(groupedData);

//     // Sort the results by isoLastTime in descending order
//     result.sort((a, b) => b.isoLastTime - a.isoLastTime);

//     // Remove the temporary isoLastTime field
//     result = result.map((doc) => {
//       const { isoLastTime, ...rest } = doc;
//       return rest;
//     });

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.get("/get-video", async (req, res) => {
//   try {
//     const videoData = await VideoInfo.find({});

//     // Preprocess date fields to ensure consistent formatting
//     const processedData = videoData.map((doc) => {
//       if (
//         doc.video_start_date_time &&
//         doc.video_start_date_time.match(
//           /^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/
//         )
//       ) {
//         doc.video_start_date_time = parseCustomDate(doc.video_start_date_time);
//       }
//       if (
//         doc.video_end_date_time &&
//         doc.video_end_date_time.match(
//           /^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/
//         )
//       ) {
//         doc.video_end_date_time = parseCustomDate(doc.video_end_date_time);
//       }
//       return doc;
//     });

//     // Create a temporary collection with processed data
//     await mongoose.connection.db
//       .collection("TempVideoInfo")
//       .insertMany(processedData);

//     // Aggregate the data to remove duplicates and sort by video_end_date_time
//     const aggregatedData = await mongoose.connection.db
//       .collection("TempVideoInfo")
//       .aggregate([
//         {
//           $group: {
//             _id: {
//               schoolname: "$schoolname",
//               video_name: "$video_name",
//               video_start: "$video_start",
//               video_end: "$video_end",
//               video_start_date_time: "$video_start_date_time",
//               video_end_date_time: "$video_end_date_time",
//               labnum: "$labnum",
//               pcnum: "$pcnum",
//             },
//             doc: { $first: "$$ROOT" },
//           },
//         },
//         {
//           $replaceRoot: { newRoot: "$doc" },
//         },
//         {
//           $sort: { video_end_date_time: -1 },
//         },
//       ])
//       .toArray();

//     // Clean up temporary collection
//     await mongoose.connection.db.collection("TempVideoInfo").drop();

//     res.json(aggregatedData);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.get("/get-interval", async (req, res) => {
//   try {
//     const intervalData = await IntervalInfo.find({});
//     const enrichedData = intervalData
//       .map((doc) => {
//         const data = doc._doc; // Access the actual document data
//         const isoDate = convertToISO(data.lasttime);
//         return { ...data, isoLastTime: isoDate };
//       })
//       .filter((doc) => doc.isoLastTime !== null);

//     // Sort the results by isoLastTime in descending order
//     enrichedData.sort((a, b) => b.isoLastTime - a.isoLastTime);

//     // Filter out entries with duplicate totaltime values
//     const uniqueTotaltimeData = [];
//     const seenTotaltime = new Set();

//     enrichedData.forEach((doc) => {
//       if (!seenTotaltime.has(doc.totaltime)) {
//         uniqueTotaltimeData.push(doc);
//         seenTotaltime.add(doc.totaltime);
//       }
//     });

//     // Remove the temporary isoLastTime field
//     const result = uniqueTotaltimeData.map((doc) => {
//       const { isoLastTime, ...rest } = doc;
//       return rest;
//     });

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose').set('debug', true);
const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { AllTime, VideoInfo, IntervalInfo } = require('./model/user.js');

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}' from ${req.ip}`);
  res.header('Access-Control-Allow-Origin', '*'); // Be more specific in production
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Redis caching middleware
// const cacheMiddleware = (key) => async (req, res, next) => {
//   try {
//     const cachedData = await redisClient.get(key);
//     if (cachedData) {
//       return res.json(JSON.parse(cachedData));
//     }
//     res.sendResponse = res.json;
//     res.json = (body) => {
//       redisClient.set(key, JSON.stringify(body), 'EX', 3600); // Cache for 1 hour
//       res.sendResponse(body);
//     };
//     next();
//   } catch (error) {
//     console.error('Redis error:', error);
//     next();
//   }
// };



const cacheMiddleware = (key) => async (req, res, next) => {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log('Serving from cache');
      return res.json(JSON.parse(cachedData));
    }
    res.sendResponse = res.json;
    res.json = (body) => {
      redisClient.set(key, JSON.stringify(body), 'EX', 3600); // Cache for 1 hour
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    console.error('Redis error:', error);
    next();
  }
};





// Example endpoint to test Redis connection
app.get('/redis-test', async (req, res) => {
  try {
    await redisClient.set('test-key', 'test-value');
    const value = await redisClient.get('test-key');
    res.send(`Redis is working! Retrieved value: ${value}`);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Helper functions for date parsing and conversion
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

    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
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
  const [day, month, year] = datePart.split('/');
  if (!day || !month || !year) return null;

  let [hours, minutes, seconds] = timePart.split(':');
  if (!hours || !minutes || !seconds) return null;

  if (period.toLowerCase() === 'pm' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  } else if (period.toLowerCase() === 'am' && hours === '12') {
    hours = '00';
  }

  return new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
  );
};

// Updated endpoints to use Redis caching
app.get('/get-pc', cacheMiddleware('get-pc'), async (req, res) => {
  try {
    const pcData = await AllTime.find({}).lean().exec(); // Use lean() to improve performance
    const groupedData = {};

    pcData.forEach((doc) => {
      const data = doc; // Access the actual document data
      const isoDate = convertToISO(data.lasttime);
      if (!isoDate) return; // Skip if conversion fails

      const day = isoDate.toISOString().split('T')[0];
      const key = `${data.eiin}-${data.labnum}-${data.pcnum}-${day}`;

      if (
        !groupedData[key] ||
        isoDate > convertToISO(groupedData[key].lasttime)
      ) {
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

// app.get('/get-video', cacheMiddleware('get-video'), async (req, res) => {
//   try {
//     const videoData = await VideoInfo.find({}).lean().exec(); // Use lean() to improve performance

//     // Preprocess date fields to ensure consistent formatting
//     const processedData = videoData.map((doc) => {
//       if (
//         doc.video_start_date_time &&
//         doc.video_start_date_time.match(
//           /^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/
//         )
//       ) {
//         doc.video_start_date_time = parseCustomDate(doc.video_start_date_time);
//       }
//       if (
//         doc.video_end_date_time &&
//         doc.video_end_date_time.match(
//           /^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/
//         )
//       ) {
//         doc.video_end_date_time = parseCustomDate(doc.video_end_date_time);
//       }
//       return doc;
//     });

//     // Create a temporary collection with processed data
//     await mongoose.connection.db
//       .collection('TempVideoInfo')
//       .insertMany(processedData);

//     // Aggregate the data to remove duplicates and sort by video_end_date_time
//     const aggregatedData = await mongoose.connection.db
//       .collection('TempVideoInfo')
//       .aggregate([
//         {
//           $group: {
//             _id: {
//               schoolname: '$schoolname',
//               video_name: '$video_name',
//               video_start: '$video_start',
//               video_end: '$video_end',
//               video_start_date_time: '$video_start_date_time',
//               video_end_date_time: '$video_end_date_time',
//               labnum: '$labnum',
//               pcnum: '$pcnum',
//             },
//             doc: { $first: '$$ROOT' },
//           },
//         },
//         {
//           $replaceRoot: { newRoot: '$doc' },
//         },
//         {
//           $sort: { video_end_date_time: -1 },
//         },
//       ])
//       .toArray();

//     // Clean up temporary collection
//     await mongoose.connection.db.collection('TempVideoInfo').drop();

//     res.json(aggregatedData);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


app.get('/get-video', cacheMiddleware('get-video'), async (req, res) => {
  try {
    const videoData = await VideoInfo.aggregate([
      {
        $addFields: {
          video_start_date_time: {
            $cond: {
              if: {
                $regexMatch: {
                  input: "$video_start_date_time",
                  regex: /^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/
                }
              },
              then: {
                $dateFromString: {
                  dateString: "$video_start_date_time",
                  format: "%m/%d/%Y, %I:%M:%S %p"
                }
              },
              else: "$video_start_date_time"
            }
          },
          video_end_date_time: {
            $cond: {
              if: {
                $regexMatch: {
                  input: "$video_end_date_time",
                  regex: /^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/
                }
              },
              then: {
                $dateFromString: {
                  dateString: "$video_end_date_time",
                  format: "%m/%d/%Y, %I:%M:%S %p"
                }
              },
              else: "$video_end_date_time"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            schoolname: "$schoolname",
            video_name: "$video_name",
            video_start: "$video_start",
            video_end: "$video_end",
            video_start_date_time: "$video_start_date_time",
            video_end_date_time: "$video_end_date_time",
            labnum: "$labnum",
            pcnum: "$pcnum"
          },
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      },
      {
        $sort: { video_end_date_time: -1 }
      }
    ]).exec();

    res.json(videoData);
  } catch (err) {
    console.error('Error fetching video data:', err.message);
    res.status(500).json({ message: err.message });
  }
});


app.get('/get-interval', cacheMiddleware('get-interval'), async (req, res) => {
  try {
    const intervalData = await IntervalInfo.find({}).lean().exec(); // Use lean() to improve performance
    const enrichedData = intervalData
      .map((doc) => {
        const data = doc; // Access the actual document data
        const isoDate = convertToISO(data.lasttime);
        return { ...data, isoLastTime: isoDate };
      })
      .filter((doc) => doc.isoLastTime !== null);

    // Sort the results by isoLastTime in descending order
    enrichedData.sort((a, b) => b.isoLastTime - a.isoLastTime);

    // Filter out entries with duplicate totaltime values
    const uniqueTotaltimeData = [];
    const seenTotaltime = new Set();

    enrichedData.forEach((doc) => {
      if (!seenTotaltime.has(doc.totaltime)) {
        uniqueTotaltimeData.push(doc);
        seenTotaltime.add(doc.totaltime);
      }
    });

    // Remove the temporary isoLastTime field
    const result = uniqueTotaltimeData.map((doc) => {
      const { isoLastTime, ...rest } = doc;
      return rest;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
