const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');



/* -------------------------------------------------------
Connect to database
------------------------------------------------------- */
mongoose.connect(process.env.MONGO_URI);
console.log('Connection established');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: Number
});

let movie = mongoose.model('Movie', movieSchema);



/* -------------------------------------------------------
Add movie to database
------------------------------------------------------- */
async function addMovie(title, year) {
    let newMovie = new movie({title, year});
    await newMovie.save();
    console.log(`Movie added: ${title} - ${year}`);
};



/* -------------------------------------------------------
Find movie by title
------------------------------------------------------- */
async function findMoviesByTitle(pattern) {
    let regExPattern = new RegExp(pattern, "i")
    let movies = await movie.find( { title : { $regex : regExPattern } } );
    return movies;
}



/* -------------------------------------------------------
Get list of all movies
------------------------------------------------------- */
async function getAllMovies() {
    let movies = await movie.find();
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
module.exports = { addMovie, findMoviesByTitle, getAllMovies, logMoviesToFile, logMoviesToFile2 };