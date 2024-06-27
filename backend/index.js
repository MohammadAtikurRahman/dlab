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


require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose").set("debug", true);
const redis = require("redis");
const NodeCache = require("node-cache");
const memjs = require('memjs');

// Create a Redis client
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

// Create a NodeCache instance
const nodeCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Create a Memcached client
const memcachedClient = memjs.Client.create(process.env.MEMCACHED_SERVER || '127.0.0.1:11211');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { AllTime, VideoInfo, IntervalInfo } = require("./model/user.js");

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

// Redis caching middleware
const redisCacheMiddleware = (key) => async (req, res, next) => {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return res.json(JSON.parse(cachedData));
    }
    console.log(`Cache miss for key: ${key}`);
    res.sendResponse = res.json;
    res.json = (body) => {
      redisClient.set(key, JSON.stringify(body), {
        EX: 3600, // Cache for 1 hour
      });
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    console.error("Redis error:", error);
    next();
  }
};

// Node-cache middleware for get-video
const nodeCacheMiddleware = (key) => (req, res, next) => {
  const cachedData = nodeCache.get(key);
  if (cachedData) {
    console.log(`Node-cache hit for key: ${key}`);
    return res.json(cachedData);
  }
  console.log(`Node-cache miss for key: ${key}`);
  res.sendResponse = res.json;
  res.json = (body) => {
    nodeCache.set(key, body);
    res.sendResponse(body);
  };
  next();
};

// Memcached middleware for get-interval
const memcachedMiddleware = (key) => async (req, res, next) => {
  try {
    const { value } = await memcachedClient.get(key);
    if (value) {
      console.log(`Memcached hit for key: ${key}`);
      return res.json(JSON.parse(value.toString()));
    }
    console.log(`Memcached miss for key: ${key}`);
    res.sendResponse = res.json;
    res.json = (body) => {
      memcachedClient.set(key, JSON.stringify(body), { expires: 3600 }); // Cache for 1 hour
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    console.error("Memcached error:", error);
    next();
  }
};

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

app.post("/pc-info", async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Expected an array of objects");
  }

  try {
    const savedTimes = await AllTime.insertMany(req.body);
    res.status(201).send(savedTimes);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/inter-info", async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Expected an array of objects");
  }

  try {
    const savedTimes = await IntervalInfo.insertMany(req.body);
    res.status(201).send(savedTimes);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/video-info", async (req, res) => {
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

app.get("/get-pc", redisCacheMiddleware('get-pc'), async (req, res) => {
  try {
    const pcData = await AllTime.find({});
    const groupedData = {};

    pcData.forEach((doc) => {
      const data = doc._doc; // Access the actual document data
      const isoDate = convertToISO(data.lasttime);
      if (!isoDate) return; // Skip if conversion fails

      const day = isoDate.toISOString().split("T")[0];
      const key = `${data.eiin}-${data.labnum}-${data.pcnum}-${day}`;

      if (
        !groupedData[key] ||
        isoDate > convertToISO(groupedData[key].lasttime)
      ) {
        groupedData[key] = { ...data, isoLastTime: isoDate };
      }
    });

    let result = Object.values(groupedData);

    result.sort((a, b) => b.isoLastTime - a.isoLastTime);

    result = result.map((doc) => {
      const { isoLastTime, ...rest } = doc;
      return rest;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/get-video", nodeCacheMiddleware('get-video'), async (req, res) => {
  try {
    const videoData = await VideoInfo.find({});

    const processedData = videoData.map((doc) => {
      if (
        doc.video_start_date_time &&
        doc.video_start_date_time.match(
          /^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/
        )
      ) {
        doc.video_start_date_time = parseCustomDate(doc.video_start_date_time);
      }
      if (
        doc.video_end_date_time &&
        doc.video_end_date_time.match(
          /^\d+\.\d+ \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M$/
        )
      ) {
        doc.video_end_date_time = parseCustomDate(doc.video_end_date_time);
      }
      return doc;
    });

    const uniqueVideos = {};
    processedData.forEach((doc) => {
      const key = `${doc.schoolname}-${doc.video_name}-${doc.labnum}-${doc.pcnum}`;
      if (!uniqueVideos[key] || new Date(doc.video_end_date_time) > new Date(uniqueVideos[key].video_end_date_time)) {
        uniqueVideos[key] = doc;
      }
    });

    const result = Object.values(uniqueVideos).sort((a, b) => new Date(b.video_end_date_time) - new Date(a.video_end_date_time));
    console.log('Processed video data:', result.length);

    res.json(result);
  } catch (err) {
    console.error('Error fetching video data:', err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/get-interval", memcachedMiddleware('get-interval'), async (req, res) => {
  try {
    const intervalData = await IntervalInfo.find({});
    console.log('Fetched interval data:', intervalData.length);
    const enrichedData = intervalData
      .map((doc) => {
        const data = doc._doc; // Access the actual document data
        const isoDate = convertToISO(data.lasttime);
        return { ...data, isoLastTime: isoDate };
      })
      .filter((doc) => doc.isoLastTime !== null);

    enrichedData.sort((a, b) => b.isoLastTime - a.isoLastTime);

    const uniqueTotaltimeData = [];
    const seenTotaltime = new Set();

    enrichedData.forEach((doc) => {
      if (!seenTotaltime.has(doc.totaltime)) {
        uniqueTotaltimeData.push(doc);
        seenTotaltime.add(doc.totaltime);
      }
    });

    const result = uniqueTotaltimeData.map((doc) => {
      const { isoLastTime, ...rest } = doc;
      return rest;
    });

    console.log('Processed interval data:', result.length);
    res.json(result);
  } catch (err) {
    console.error('Error fetching interval data:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// New endpoint to trigger three API calls simultaneously
app.get("/trigger-three-calls", async (req, res) => {
  try {
    const [pcData, videoData, intervalData] = await Promise.all([
      fetch(`http://localhost:${PORT}/get-pc`).then((res) => res.json()),
      fetch(`http://localhost:${PORT}/get-video`).then((res) => res.json()),
      fetch(`http://localhost:${PORT}/get-interval`).then((res) => res.json()),
    ]);

    res.json({
      pcData,
      videoData,
      intervalData,
    });
  } catch (error) {
    console.error("Error triggering three API calls:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3600;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


