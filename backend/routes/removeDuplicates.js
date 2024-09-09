const express = require('express');
const DuplicateRemovalController = require('../controllers/DuplicateRemovalController'); // Adjust the path as needed

const router = express.Router();

router.get('/remove-duplicates/:collectionName', (req, res) => {
  return DuplicateRemovalController.removeDuplicates(req, res);
});

module.exports = router;
