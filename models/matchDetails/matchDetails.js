const mongoose = require("mongoose");
const { status } = require("../../helpers/enums");
const Schema = mongoose.Schema;

const matchDetailsSchema = new Schema({
  startTime: {
    type: String,
    required: true,
  },
  league: {
    type: String,
  },
  homeTeam: {
    type: String,
  },
  awayTeam: {
    type: String,
  },
  status: { type: String, enum: status, default: status.UNKNOWN },
  minute: {
    type: Number,
    required: true,
  },
  winner: {
    type: String,
    default: "Unknown",
  },
  events: {
    type: Schema.Types.ObjectId,
    ref: "Events",
  },

  goals: {
    type: String,
    default: 0,
  },
  excitementRating: {
    type: String,
    default: "0.0",
  },
  oddsHome: {
    type: Number,
    default: 0,
  },
  oddsAway: {
    type: Number,
    default: 0,
  },
  oddsDraw: {
    type: Number,
    default: 0,
  },
  matchPreview: {
    type: Schema.Types.ObjectId,
    ref: "MatchPreview",
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("MatchDetails", matchDetailsSchema);
