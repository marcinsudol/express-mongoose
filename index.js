const express = require('express');
const path = require('path');
const database = require('./database');






const app = express();
console.log('Express created');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});



app.route('/add').get((req, res) => {
    res.render("addmovie");
}).post((req, res) => {
    database.addMovie(req.body.title, req.body.year).then(
        () => { res.render("addmovie", { message: "The movie was added!" }); }
    );
});



app.route('/find').get((req, res) => {
    res.render("findmovie");
}).post((req,res) => {
    database.findMoviesByTitle(req.body.title).then(
        (movies) => { res.render("findmovie", { searchResult: movies }); }
    );
});



app.listen(process.env.PORT);