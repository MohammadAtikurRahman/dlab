const express = require('express');
const CommonController = require('../controllers/CommonController'); // Adjust the path as needed

const router = express.Router();

router.get('/histogram', (req, res) => {
  return CommonController.histogram(req, res);
});

module.exports = router;
