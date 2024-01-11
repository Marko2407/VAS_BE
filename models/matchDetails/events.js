const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventsSchema = new Schema({
  homeEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Eventi",
    },
  ],
  awayEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Eventi",
    },
  ],
});

module.exports = mongoose.model("Events", eventsSchema);
