const path = require('path');
const fs = require('fs');

class ExportController {
  async serveZipFile(req, res) {
    const file = path.join(__dirname, 'static', 'alltimes.zip');
    return res.download(file); // Set disposition and send it.
  }
}

module.exports = new ExportController();
