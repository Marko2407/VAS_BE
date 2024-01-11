const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchPreviewSchema = new Schema({
  previewContent: [
    {
      type: Schema.Types.ObjectId,
      ref: "PreviewContent",
    },
  ],
});

module.exports = mongoose.model("MatchPreview", matchPreviewSchema);
