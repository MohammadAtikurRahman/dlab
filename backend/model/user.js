// const mongoose = require("mongoose");

// const allTimeSchema = new mongoose.Schema({
//   dayid: Number,
 
//   starttime: String,
//   totaltime: Number,
//   lasttime: String,
//   pcname: String,
//   eiin: Number,
//   schoolname: String,
//   labnum: Number,
//   pcnum: Number,
// });

// const allVideoSchema = new mongoose.Schema({
//   dayid: Number,
 
//   pcname: String,
//   eiin: Number,
//   schoolname: String,
//   labnum: Number,
//   pcnum: Number,
//   video_name: String,
//   video_start: String,
//   video_start_date_time: String,
//   video_end: String,
//   video_end_date_time: String,
//   duration: Number,
// });


// const interValSchema = new mongoose.Schema({
//   dayid: Number,
 
//   starttime: String,
//   totaltime: Number,
//   lasttime: String,
//   pcname: String,
//   eiin: Number,
//   schoolname: String,
//   labnum: Number,
//   pcnum: Number,
// });


// module.exports = {
//   AllTime: mongoose.model("AllTime", allTimeSchema),
//   VideoInfo: mongoose.model("VideoInfo", allVideoSchema),
//   IntervalInfo: mongoose.model("Intervalinfo",interValSchema)
// };
const mongoose = require("mongoose");

const allTimeSchema = new mongoose.Schema({
  dayid: Number,
  starttime: String,
  totaltime: Number,
  lasttime: String,
  pcname: String,
  eiin: Number,
  schoolname: String,
  labnum: Number,
  pcnum: Number,
});
allTimeSchema.index({ dayid: 1 });
allTimeSchema.index({ eiin: 1, labnum: 1, pcnum: 1 });

const allVideoSchema = new mongoose.Schema({
  dayid: Number,
  pcname: String,
  eiin: Number,
  schoolname: String,
  labnum: Number,
  pcnum: Number,
  video_name: String,
  video_start: String,
  video_start_date_time: String,
  video_end: String,
  video_end_date_time: String,
  duration: Number,
});
allVideoSchema.index({ eiin: 1, labnum: 1, pcnum: 1 });
allVideoSchema.index({ video_name: 1 });

const interValSchema = new mongoose.Schema({
  dayid: Number,
  starttime: String,
  totaltime: Number,
  lasttime: String,
  pcname: String,
  eiin: Number,
  schoolname: String,
  labnum: Number,
  pcnum: Number,
});
interValSchema.index({ dayid: 1 });
interValSchema.index({ eiin: 1, labnum: 1, pcnum: 1 });

module.exports = {
  AllTime: mongoose.model("AllTime", allTimeSchema),
  VideoInfo: mongoose.model("VideoInfo", allVideoSchema),
  IntervalInfo: mongoose.model("Intervalinfo", interValSchema),
};
