const {Request, Response} = require('express');
const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');

class ExportController {
  async exportAndZip(req, res) {
    const fields = "dayid,starttime,totaltime,lasttime,pcname,eiin,schoolname,labnum,pcnum";
    const csvFilePath = path.join(__dirname, '..', 'alltimes.csv');
    const zipFilePath = path.join(__dirname, '..', 'alltimes.zip');

    try {
      // Step 1: Export the collection to a CSV file
      await this.execCommand(`mongoexport --collection=alltimes --db=dlab --type=csv --fields=${fields} --out=${csvFilePath}`);
      console.log(`Exported data to ${csvFilePath}`);

      // Step 2: Zip the CSV file
      await this.execCommand(`zip ${zipFilePath} ${csvFilePath}`);
      console.log(`Zipped data to ${zipFilePath}`);

      // Send the zip file
      res.download(zipFilePath, (err) => {
        if (err) {
          console.error(`Error sending file: ${err.message}`);
          res.status(500).send('Error sending file');
        }

        // Optionally, delete the CSV file after download
        fs.unlink(csvFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting CSV file: ${unlinkErr.message}`);
          }
        });
      });
    } catch (error) {
      console.error(`Error during export and zip process: ${error.message}`);
      res.status(500).send('Error exporting and zipping data');
    }
  }

  execCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Error executing command: ${error.message}`));
        } else if (stderr) {
          reject(new Error(`Command stderr: ${stderr}`));
        } else {
          console.log(`Command stdout: ${stdout}`);
          resolve();
        }
      });
    });
  }
}

module.exports = new ExportController();
