var express = require("express");
var app = express();
require("dotenv").config();
var path = require("path");
const logger = require("tracer").colorConsole();
const bodyParser = require("body-parser");
const GameController = require("./controller/GameController");
const mongoose = require("mongoose");

const db = process.env.MONGO_URI;
mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err) return logger.log(err);
    logger.trace("Connecté à la base de donnée");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// viewed at http://localhost:8080
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/get-final-info", function(req, res) {
    GameController.GetData(req.query)
        .then(results => {
            console.log(req.query);

            return res.status(200).json(results);
        })
        .catch(err => {
            return res.status(400).json(err);
        });
});
app.get("/get-teams", function(req, res) {
    GameController.GetAllTeams()
        .then(teams => {
            return res.status(200).json(teams);
        })
        .catch(err => {
            return res.status(400).json(err);
        });
});

app.get("/finale-2020", function(req, res) {
    GameController.GetAllTeams()
        .then(teams => {
            console.log(teams);

            return res.render("test", { teams });
        })
        .catch(err => {
            return res.status(400).json(err);
        });
});

app.post("/save-score", function(req, res) {
    GameController.SaveData(req.body)
        .then(saveData => {
            return res.status(200).json(saveData);
        })
        .catch(err => {
            return res.status(400).json(err);
        });
});

app.post("/create-team", function(req, res) {
    GameController.Create(req.body)
        .then(saveData => {
            return res.send("Enregistrement réussi");
        })
        .catch(err => {
            return res.send(err);
        });
});
app.post("/create-teams", function(req, res) {
    GameController.CreateMany(req.body)
        .then(saveData => {
            console.log(saveData);

            return res.send("Enregistrement réussi");
        })
        .catch(err => {
            console.log(err);

            return res.send(err);
        });
});

app.delete("/delete-teams", function(req, res) {
    GameController.DeleteMany(req.query)
        .then(saveData => {
            console.log(saveData);

            return res.send("Enregistrement réussi");
        })
        .catch(err => {
            console.log(err);

            return res.send(err);
        });
});
app.delete("/all", function(req, res) {
    GameController.DeleteMany(req.query)
        .then(saveData => {
            console.log(saveData);

            return res.send("Enregistrement réussi");
        })
        .catch(err => {
            console.log(err);

            return res.send(err);
        });
});

//404 page catch all
app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});
app.listen(process.env.PORT);
