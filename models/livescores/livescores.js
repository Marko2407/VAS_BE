const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const liveScoresSchema = new Schema({
  leagueName: {
    type: String,
    required: true,
  },
  matches: [
    {
      type: Schema.Types.ObjectId,
      ref: "MatchDetails",
    },
  ],
});

module.exports = mongoose.model("LiveScores", liveScoresSchema);
