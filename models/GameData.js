const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const GameDataSchema = new Schema({
    gameId: { type: String, required: true },
    datetime: { type: String },
    team_number: { type: String, required: true },
    team_name: { type: String },
    team_pwd: { type: String, required: true, select: false },
    score: { type: Number, default: null },
    attempts: { type: Number, default: 3 }
});

GameDataSchema.pre("save", function(next) {
    this.datetime = moment(this.datetime).format("YYYY-MM-DD HH:mm:ss");
    console.log("SAVE", this);
    next();
});

module.exports = mongoose.model("GameData", GameDataSchema);
