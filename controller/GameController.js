const GameData = require("../models/GameData");
const logger = require("tracer").colorConsole();
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
    const { gameId, team_number, score, team_pwd } = gameInfos;
    return GameData.find({ gameId, team_number })
        .select("+team_pwd")
        .then(res => {
            if (res.length === 0) {
                throw { type: "NO_USER_FOUND", msg: "L'équipe n'existe pas" };
            }

            if (res[0].team_pwd !== team_pwd) {
                throw { type: "WRONG_PWD", msg: "Mot de passe invalide" };
            }
            if (res[0].attempts <= 0) {
                throw { type: "NO_MORE_ATTEMPTS", msg: "Vous avez utilisés tous vos essais" };
            }

            res[0].score = score;
            res[0].attempts = res[0].attempts - 1;
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
controller.CreateMany = async gameInfos => {
    const tab = gameInfos.gameInfos.map(g => {
        return new Promise((resolve, reject) => {
            const newGameInfos = new GameData(g);
            return newGameInfos
                .save()
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    });

    return await Promise.all(tab)
        .then(resTab => {
            console.log(resTab);

            return resTab;
        })
        .catch(err => {
            console.log(err);

            return err;
        });
};

module.exports = controller;
