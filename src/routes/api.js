const express = require('express')
const router = express.Router();

const fs = require('fs');
const path = require('path');

/**
 * Liefert alle möglichen Spiele zurück: Spiel Id (id) + Spiel Name (name)
 */
router.get('/games', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/games.json'), 'utf8', (err, json) => {
        if (err) console.log(err);

        try {
            const obj = JSON.parse(json);
            const games = obj.map(game => ({ id: game.id, name: game.name, endModalImgPath: game.endModalImgPath }));

            res.json(games);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

/**
 * Liefert alle möglichen Spielekategorien zurück: Kategorie Id (gameCategoryId), Kategorie Name (gameCategoryName),
 * Farbe (color), Banner Bild (img), Hintergrundbild 1 (imgbg1), Hintergrundbild 2 (imgbg2)
 */
router.get('/gamecategories', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/gameCategories.json'), 'utf8', (err, json) => {
        if (err) console.log(err);
        
        try {
            const obj = JSON.parse(json);
            const gameGategories = obj.map(gameCategory => ({ gameCategoryId: gameCategory.gameCategoryId, gameCategoryName: gameCategory.gameCategoryName, color: gameCategory.color, img: gameCategory.img , imgbg1: gameCategory.imgbg1, imgbg2: gameCategory.imgbg2}));

            res.json(gameGategories);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

/**
 * Liefert alle Spiele von einer bestimmten Kategorie zurück: Spiel Id (id), Spiel Name (name), Beschreibung des Spiels (description)
 */
router.get('/category', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/games.json'), 'utf8', (err, json) => {
        if (err) console.log(err);

        try {
            const obj = JSON.parse(json);
            const games = obj.filter(game => game.gameCategoryId == req.query.gameCategoryId).map(game => ({ id: game.id, name: game.name, description: game.description }));

            res.json(games);

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

/**
 * Liefert nur den Namen eines Spiels zurück: Spiel Name (name)
 */
router.get('/name', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/games.json'), 'utf8', (err, json) => {
        if (err) console.log(err);
        
        try {
            const obj = JSON.parse(json);
            const game = obj.find(game => game.id == req.query.id);

            res.json({ name: game.name });

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})


/**
 * Liefert nur die Regeln eines Spiels zurück: Spiel Regeln (rules)
 */
router.get('/rules', (req, res) => {
    fs.readFile(path.join(__dirname + '/../data/games.json'), 'utf8', (err, json) => {
        if (err) console.log(err);
        
        try {
            const obj = JSON.parse(json);
            const game = obj.find(game => game.id == req.query.id);

            res.json({ rules: game.rules });

        } catch(err) {
            res.json({ "error": "Ein Fehler ist aufgetreten" });
        }
    });
})

// Export the Router
module.exports = router