const express = require('express');
const DateFormattingController = require('../controllers/DateFormattingController');

const router = express.Router();

router.get('/format-date', (req, res) => {
  return DateFormattingController.formatDate(req, res);
});

module.exports = router;
