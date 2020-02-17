const express = require("express");
const router = express.Router();

//IMPORT MODELS
const GameData = require("../models/GameData");

//UTILS
const logger = require("tracer").colorConsole();
const isEmpty = require("../validation/isEmpty");

//***********************/
//GET REQUESTS
GameData.get("/", (req, res) => {
    return Region.find({})
        .sort({ name: 1 })
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            return res.status(400).json(err);
        });
});
