const mongoose = require('mongoose');
const moment = require("moment")
const {AllTime, IntervalInfo} = require("../model/user.js");

class DateFormattingController {
  convertToISO(timeString) {
    if (moment(timeString, moment.ISO_8601, true).isValid()) {
      return timeString;
    }
    const parsedDate = moment(timeString, "DD/MM/YYYY, hh:mm:ss a");
    return parsedDate.toISOString();
  }
  async formatDate(req, res) {
    try {
      const alltimes = await AllTime.find({}, {starttime: 1, lasttime: 1}).exec();
      const intervals = await IntervalInfo.find({}, {starttime: 1, lasttime: 1}).exec();

      let bulkOps = alltimes.map((time) => ({
        updateOne: {
          filter: {
            _id: time._id
          },
          update: {
            $set: {
              starttime: this.convertToISO(time.starttime),
              lasttime: this.convertToISO(time.lasttime),
            }
          },
        }
      }))

      let savedTimes = await AllTime.bulkWrite(bulkOps);
      let alltimesUpdated = savedTimes.length;

      bulkOps = intervals.map((time) => ({
        updateOne: {
          filter: {
            _id: time._id
          },
          update: {
            $set: {
              starttime: this.convertToISO(time.starttime),
              lasttime: this.convertToISO(time.lasttime),
            }
          }
        }
      }))

      savedTimes = await IntervalInfo.bulkWrite(bulkOps);
      let intervalUpdated = savedTimes.length;

      return res.status(200).json({
        alltimesUpdated,
        intervalUpdated
      });
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
}

module.exports = new DateFormattingController();

