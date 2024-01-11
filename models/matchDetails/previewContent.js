const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const previewContentSchema = new Schema({
  content: {
    type: String,
  },
  name: {
    type: String,
  },
});

module.exports = mongoose.model("PreviewContent", previewContentSchema);
