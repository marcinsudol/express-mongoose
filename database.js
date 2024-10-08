const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');



/* -------------------------------------------------------
Connect to database
------------------------------------------------------- */
mongoose.connect(process.env.MONGO_URI);
console.log('Connected to database');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: Number
});

let movie = mongoose.model('Movie', movieSchema);



/* -------------------------------------------------------
Add movie to database
------------------------------------------------------- */
function addMovie(title, year) {
    return new Promise((resolve, reject) => {
        let newMovie = new movie({title, year});
        newMovie.save().then(
            () => { resolve(`Movie added: ${title} (${year})`); }
        ).catch(
            (error) => { reject(error); }
        );
    });
};



/* -------------------------------------------------------
Find movie by title
------------------------------------------------------- */
async function findMovieById(id) {
    let result = await movie.findById(id);
    return result;
}



/* -------------------------------------------------------
Find movie by title
------------------------------------------------------- */
async function findMoviesByTitle(pattern) {
    let regExPattern = new RegExp(pattern, "i")
    let movies = await movie.find({ title : { $regex : regExPattern } }).sort({ title : 1 });
    return movies;
}



/* -------------------------------------------------------
Get list of all movies
------------------------------------------------------- */
async function getAllMovies() {
    let movies = await movie.find().sort({ title : 1 });
    return movies;
}



/* -------------------------------------------------------
Log movies into file with async await
------------------------------------------------------- */
async function logMoviesToFile(filename) {
    let movies = await getAllMovies();
    fs.writeFile(filename, movies.toString(), (err) => {
        if (err) console.log(err.message);
    });
}



/* -------------------------------------------------------
Log movies into file with promises
------------------------------------------------------- */
function logMoviesToFile2(filename) {
getAllMovies().then(
    (movies) => {
        fs.writeFile(filename, movies.toString(), (err) => {
            if (err) console.log(err.message);
        });
    }).catch(
        (err) => { console.log(err.message); }
    );
}



/* -------------------------------------------------------
Export
------------------------------------------------------- */
module.exports = { addMovie, findMovieById, findMoviesByTitle, getAllMovies, logMoviesToFile, logMoviesToFile2 };