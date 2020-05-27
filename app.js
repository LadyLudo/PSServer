const express = require('express');
const morgan = require('morgan')
const app = express();
const appList = require("./appList")

app.use(morgan('dev'))

app.get("/apps", (req, res) => {
    
    const {sort, genre = ""} = req.query;
    
    if (sort) {
        if (!['rating', 'app'].includes(sort)) {
            return res
              .status(400)
              .send('Sort must be either rating or app');
          }
    }

    if (genre) {
        if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genre)) {
            return res
                .status(400)
                .send("Genre must be one of Action, Puzzle, Strategy, Casusal, Arcade, or Card")
        }
    }

    let results = appList
        .filter(app =>
            app
              .Genres
              .toLowerCase()
              .includes(genre.toLowerCase()));

    if (sort) {
        results
        .sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
    }

    res.json(results)
})

app.listen(8000, () => {
    console.log("PSServer is listening at http://localhost:8000")
})