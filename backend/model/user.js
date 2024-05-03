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


module.exports = {
  AllTime: mongoose.model("AllTime", allTimeSchema),
  VideoInfo: mongoose.model("VideoInfo", allVideoSchema),
  IntervalInfo: mongoose.model("Intervalinfo",interValSchema)
};
