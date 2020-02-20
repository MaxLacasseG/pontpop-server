const GameData = require("../models/GameData");
const logger = require("tracer").colorConsole();
const moment = require("moment");
const controller = {};

controller.GetAllTeams = () => {
    return GameData.find({})
        .select("-team_pwd")
        .sort("-score")
        .then(res => {
            logger.info(res);

            return res;
        })
        .catch(err => {
            logger.trace(err);
            throw err;
        });
};

controller.GetData = dataInfos => {
    const { team_number, finalId } = dataInfos;
    return GameData.find({ team_number, finalId })
        .then(res => {
            console.log(res);

            return res;
        })
        .catch(err => {
            throw err;
        });
};

controller.SaveData = gameInfos => {
    const isFinalEnded = moment().isAfter(moment("2020-02-20 13:30:00"));

    const { gameId, team_number, score, team_pwd } = gameInfos;
    return GameData.find({ gameId, team_number })
        .select("+team_pwd")
        .then(res => {
            if (res.length === 0) {
                throw { type: "NO_USER_FOUND", msg: "L'équipe n'existe pas" };
            }
            if (isFinalEnded) {
                throw { type: "FINAL_ENDED", msg: "La concours est terminé. Impossible d'enregistrer un score." };
            }

            if (res[0].team_pwd !== team_pwd) {
                throw { type: "WRONG_PWD", msg: "Mot de passe invalide" };
            }
            if (res[0].attempts <= 0) {
                throw { type: "NO_MORE_ATTEMPTS", msg: "Vous avez utilisés tous vos essais" };
            }

            res[0].score = score;
            res[0].attempts = res[0].attempts - 1;
            res[0].datetime = moment().format("YYYY-MM-DD HH:mm:ss");
            return res[0].save();
        })
        .then(res => {
            return res;
        })
        .catch(err => {
            throw err;
        });
};

controller.Create = gameInfos => {
    const newGameInfos = new GameData(gameInfos);
    return newGameInfos
        .save()
        .then(res => {
            return res;
        })
        .catch(err => {
            throw err;
        });
};
controller.DeleteMany = ids => {
    return GameData.deleteMany({ _id: ids })
        .then(res => {
            logger.info(res);

            return res;
        })
        .catch(err => {
            logger.trace(err);
            throw err;
        });
};
controller.DeleteAll = () => {
    return GameData.deleteMany({})
        .then(res => {
            logger.info(res);

            return res;
        })
        .catch(err => {
            logger.trace(err);
            throw err;
        });
};

module.exports = controller;
