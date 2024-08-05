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



/*
Add movie to database
*/
async function addMovie(title, year) {
    let newMovie = new movie({title, year});
    await newMovie.save();
    console.log(`Added movie: ${title} - ${year}`);
};



/*
Find movie by title
*/
async function findMoviesByTitle(pattern) {
    let regExPattern = new RegExp(pattern, "i")
    let movies = await movie.find( { title : { $regex : regExPattern } } );
    return movies;
}



/*
Get list of all movies
*/
async function getAllMovies() {
    let movies = await movie.find();
    return movies;
}



/*
Log movies into file with async await
*/
async function logMoviesToFile(filename) {
    let movies = await getAllMovies();
    fs.writeFile(filename, movies.toString(), (err) => {
        if (err) console.log(err.message);
    });
}



/*
Log movies into file with promises
*/
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



const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});



app.route('/add').get((req, res) => {
    res.render("addmovie");
}).post((req, res) => {
    addMovie(req.body.title, req.body.year).then(
        () => { res.render("addmovie", { message: "The movie was added!" }); }
    );
});



app.route('/find').get((req, res) => {
    res.render("findmovie");
}).post((req,res) => {
    findMoviesByTitle(req.body.title).then(
        (movies) => { res.render("findmovie", { searchResult: movies }); }
    );
});



app.listen(process.env.PORT);