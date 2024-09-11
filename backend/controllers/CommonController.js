const {AllTime, VideoInfo} = require("../model/user.js");
const {Parser} = require('json2csv');
const mongoose = require("mongoose")

class CommonController {
  async uniqueSchools(req, res) {
    const schools = await AllTime.aggregate([
      {
        $group: {
          _id: "$eiin",
          schoolNames: {$addToSet: "$schoolname"}
        },
      },
      {
        $project: {
          eiin: "$_id",
          schoolNames: 1,
          _id: 0
        }
      }
    ])
    return res.status(200).json({schools})
  }
  async schoolWiseData(req, res) {
    try {
      const {collectionName, eiin} = req.params
      const collection = mongoose.connection.collection(collectionName);
      console.log(collectionName, eiin)
      const schoolWiseData = await collection.find({eiin: parseInt(eiin)}).toArray();
      if (!schoolWiseData.length) {
        return res.status(404).json({error: 'No data found for the specified eiin.'});
      }
      const fields = Object.keys(schoolWiseData[0])
      const parser = new Parser({fields})
      const csv = parser.parse(schoolWiseData)
      res.header('Content-Type', 'text/csv')
      res.attachment(`${eiin}_schooldata_${collectionName}.csv`)
      return res.status(200).send(csv)
    }
    catch (error) {
      console.log(error.message)
      return res.status(500).json({error: 'An error occurred while exporting the data to CSV.' + error.message});
    }
  }
  async histogram(req, res) {
    try {
      let result = await AllTime.aggregate([
        {
          $group: {
            _id: null,
            distinctSchoolEiin: {$addToSet: "$eiin"},
            distinctPcNames: {$addToSet: "$pcname"},
            uniqueSchooEiinLabnumPairs: {$addToSet: {eiin: "$eiin", labnum: "$labnum"}},
            totalPcUsedTime: {$sum: "$totaltime"}
          }
        },
        {
          $project: {
            _id: 0,
            distinctSchoolCount: {$size: "$distinctSchoolEiin"},
            distinctPcCount: {$size: "$distinctPcNames"},
            distinctLabCount: {$size: "$uniqueSchooEiinLabnumPairs"},
            totalPcUsedTime: 1
          }
        }
      ]).exec();

      const {
        distinctSchoolCount,
        distinctPcCount,
        distinctLabCount,
        totalPcUsedTime,
      } = result[0];

      result = await VideoInfo.aggregate([
        {
          $group: {
            _id: null,
            videoUsage: {$sum: "$duration"}
          }
        }
      ])

      const {videoUsage} = result[0];

      return res.status(200).json({
        distinctSchoolCount,
        distinctPcCount,
        distinctLabCount,
        totalPcUsedTime,
        videoUsage,
      });
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
}

module.exports = new CommonController();
