const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { events } = require("../../helpers/enums");

const eventSchema = new Schema({
  name: { type: String, enum: events, default: events.UNKNOWN },
  number: {
    type: String,
  },
});

module.exports = mongoose.model("Eventi", eventSchema);
