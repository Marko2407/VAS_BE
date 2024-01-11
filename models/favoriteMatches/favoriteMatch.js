const mongoose = require("mongoose");
const { status } = require("../../helpers/enums");
const Schema = mongoose.Schema;

const favoriteMatchSchema = new Schema({
  username: {
    type: String,
  },
  match: [
    {
      type: Schema.Types.ObjectId,
      ref: "MatchDetails",
    },
  ],
});

module.exports = mongoose.model("FavoriteMatch", favoriteMatchSchema);
