const path = require('path');
const fs = require('fs');
const process = require("child_process")

class ExportController {
  getFilePath(collectionName) {
    return path.join(__dirname, '../static', `${collectionName}.zip`);
  }
  async exportColletion(req, res) {
    let collectionName = req.params.collectionName
    const filePath = this.getFilePath(collectionName)
    return res.download(filePath); // Set disposition and send it.
  }
}

module.exports = new ExportController();
