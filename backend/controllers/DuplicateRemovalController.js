const mongoose = require('mongoose');

class DuplicateRemovalController {
  generateKey(doc) {
    const excludedFields = ["_id"];
    const filteredFields = Object.keys(doc).reduce((result, key) => {
      if (!excludedFields.includes(key)) {
        result[key] = doc[key];
      }
      return result;
    }, {});
    return filteredFields;
  }

  async removeDuplicates(req, res) {
    try {
      const {collectionName} = req.params;
      const collection = mongoose.connection.collection(collectionName);
      const batchSize = 100000;
      let hasMore = true;
      let totalRemoved = 0;

      while (hasMore) {
        const cursor = collection.find().batchSize(batchSize);
        const processedKeys = new Set();
        let duplicateIds = [];

        while (await cursor.hasNext()) {
          const doc = await cursor.next();
          const key = JSON.stringify(this.generateKey(doc));
          if (processedKeys.has(key)) {
            duplicateIds.push(doc._id);
            if (duplicateIds.length > batchSize) {
              const result = await collection.deleteMany({_id: {$in: duplicateIds}})
              duplicateIds = [];
              totalRemoved += result.deletedCount;
              console.log("totalRemoved = ", totalRemoved)
            }
          } else {
            processedKeys.add(key);
          }
        }
        hasMore = (await cursor.count() > 0);
      }

      return res.status(200).json({
        removedRecords: totalRemoved,
        uniqueRecords: processedKeys.length
      });
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
}

module.exports = new DuplicateRemovalController();

