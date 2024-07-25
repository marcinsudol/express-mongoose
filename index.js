const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');



mongoose.connect(process.env.MONGO_URI);



const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: Number
});

let movie = mongoose.model('Movie', movieSchema);



async function addMovie(title, year) {
    let newMovie = new movie({title, year});
    await newMovie.save();
    console.log(`Added movie: ${title} - ${year}`);
};

/*
addMovie("Batman returns", 1991);
addMovie("Superman", 1992);
*/



async function getMovies() {
    let movies = await movie.find();
    return movies;
}



/* log movies into file with async await */
async function logMoviesToFile(filename) {
    let movies = await getMovies();
    fs.writeFile(filename, movies.toString(), (err) => {
        if (err) console.log(err.message);
    });
}



/* log movies into file with promises */
function logMoviesToFile2(filename) {
getMovies().then(
    (movies) => {
        fs.writeFile(filename, movies.toString(), (err) => {
            if (err) console.log(err.message);
        });
    }).catch(
        (err) => { console.log(err.message); }
    );
}



//logMoviesToFile("./movies.txt");
//logMoviesToFile2("./movies2.txt");



const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addmovie.html"));
});

app.post('/add', (req, res) => {
    addMovie(req.body.title, req.body.year);
    res.end("Movie added");
});

app.listen(process.env.PORT);