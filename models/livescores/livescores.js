const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const liveScoresSchema = new Schema({
  date: {
    type: Date,
    required: false,
    default: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },
  },
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
