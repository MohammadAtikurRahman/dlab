const express = require('express');
const CommonController = require('../controllers/CommonController'); // Adjust the path as needed

const router = express.Router();

router.get('/histogram', CommonController.histogram);
router.get('/export/csv/:collectionName/:eiin', CommonController.schoolWiseData);
router.get("/schools", CommonController.uniqueSchools);

module.exports = router;
