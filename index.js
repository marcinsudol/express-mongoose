const express = require('express');
const path = require('path');
const db = require('./database');
require('dotenv').config();



const PORT = process.env.PORT;



const app = express();
console.log('Express app created');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});



app.route('/add').get((req, res) => {
    res.render("addmovie");
}).post((req, res) => {
    db.addMovie(req.body.title, req.body.year).then(
        () => { res.render("addmovie", { message: "The movie was added!" }); }
    ).catch(
        (error) => { res.render("addmovie", { message: "Movie was not added because of the error: "+ error.message }); }
    );
});



app.route('/find').get((req, res) => {
    res.render("findmovie");
}).post((req,res) => {
    db.findMoviesByTitle(req.body.title).then(
        (movies) => {
            res.render("findmovie", { searchResult: movies });
        }
    );
});



app.route('/movie/:id').get((req, res) => {
    db.findMovieById(req.params.id).then((movie) => {
        res.render("movie", { movie });
    }).catch(() => {
        // TODO: add here not found page
        console.log("Movie not found");
    });
});



app.listen(PORT);

console.log(`Server listening at port ${PORT}`);
