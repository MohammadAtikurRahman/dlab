const {AllTime, VideoInfo} = require("../model/user.js");

class CommonController {
  async histogram(req, res) {
    try {
      let result = await AllTime.aggregate([
        {
          $group: {
            _id: null,
            distinctSchoolNames: {$addToSet: "$schoolname"},
            distinctPcNames: {$addToSet: "$pcname"},
            uniqueSchoolnameLabnumPairs: {$addToSet: {schoolname: "$schoolname", labnum: "$labnum"}},
            totalPcUsedTime: {$sum: "$totaltime"}
          }
        },
        {
          $project: {
            _id: 0,
            distinctSchoolCount: {$size: "$distinctSchoolNames"},
            distinctPcCount: {$size: "$distinctPcNames"},
            distinctLabCount: {$size: "$uniqueSchoolnameLabnumPairs"},
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

      result  = await VideoInfo.aggregate([
        {
          $group: {
            _id: null,
            videoUsage: {$sum: "$duration"}
          }
        }
      ])

      const {videoUsage} = result;

      return res.status(200).json({
        distinctSchoolCount,
        distinctPcCount,
        distinctLabCount,
        totalTimeSum,
        videoUsage,
      });
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
}

module.exports = new CommonController();
