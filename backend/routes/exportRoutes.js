const express = require('express');
const ExportController = require('../controllers/ExportController'); // Adjust the path as needed

const router = express.Router();

router.get('/export/:collectionName', (req, res) => {
  return ExportController.exportColletion(req, res);
});

module.exports = router;
