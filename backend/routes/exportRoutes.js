const express = require('express');
const ExportController = require('../controllers/ExportController'); // Adjust the path as needed

const router = express.Router();

router.get('/export/alltimes', (req, res) => {
  return ExportController.serveZipFile(req, res);
});

module.exports = router;
