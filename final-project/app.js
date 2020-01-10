const path = require('path');
const express = require('express');
const app = express();
require('./db');
const PORT = 29440;
const session = require('express-session');

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// activating express.urlencoded to parse http request bodies
app.use(express.urlencoded({extended: false}));

// configuring hbs as the templating agent
app.set('view engine', 'hbs');

const mongoose = require('mongoose');
const Book = mongoose.model('Book');
const Favorite = mongoose.model('Favorite');
const Bookmarked = mongoose.model('Bookmarked');

const sessionOptions = { 
    secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};

app.use(session(sessionOptions));

const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// homepage where all books are displayed
app.get('/', function(req, res){

    Book.find({}, function(err, library){
		
        if (err){
            console.log(err);
        } else {
			// console.log("library: ", library); // on server, the db is "books"

			const userTitle = req.query.title;
			const userAuthor = req.query.author;
			const userRating = req.query.rating;
			
			if (userTitle === undefined && userAuthor === undefined){ // user isn't using search bar
				
				Book.find({title: userTitle, author: userAuthor, rating: userRating}, function(err){
					if (err){
						console.log(err);
					} else {

						let bookArray = [];

						library.map(n => {
							bookArray.push(n);
						});

						res.render('home', {layout: 'layout', library: bookArray});
					}
				});

			} else {

				Book.find({title: userTitle, author: userAuthor}, function(err, filtered){
					if (err){
						console.log(err);
					} else {
						res.render('home', {layout: 'layout', filtered: filtered});
					}
				});
			}
        }
    });
});

// should add to the general library --> db collection is called "books"
app.post('/add', function(req, res){

	const addUserTitle = req.body.title;
	const addUserAuthor = req.body.author;
	const addUserRating = req.body.rating;
	const addUserReview = req.body.review;
	const addUserFavorite = req.body.favorite;

	const newB = new Book({
		title: addUserTitle,
		author: addUserAuthor,
		rating: addUserRating,
		review: addUserReview,
		favorite: addUserFavorite
	});

	newB.save((err, newBook) => {
		
		if (err) {
			console.log(err);
		} else {

			if (req.session.myBooks){
				req.session.myBooks.push(newBook);
			} else {
				req.session.myBooks = [];
				req.session.myBooks.push(newBook);
			}

		}

		res.redirect('/');

	});
});

// form where a user can add a book to the overall library
app.get('/add', function(req, res){
	res.render('add', {layout: 'layout'});
});

// displays user's library
app.get('/myLibrary', function(req, res){
	res.render('myLibrary', {layout: 'layout'});
	// res.render('myLibrary', {layout: 'layout', library: library});
});

app.get('/myLibrary', function(req, res){
	res.render('myLibrary', {layout: 'layout'});
	// res.render('myLibrary', {layout: 'layout', myBooks: req.session.myBooks});
})

// displays user's favorite books
app.get('/favorites', function(req, res){

	// might need to delete
	Book.find({}, function(err, library){
		if (err) {
			console.log(err);
		} else {

			Favorite.find({}, function(err, favorites){
		
				if (err){
					console.log(err);
				} else {
					Favorite.find({title: req.query.title}, function(err){
						if (err){
							console.log(err);
						} else {
							let favArray = [];

							favorites.map(n => {
								favArray.push(n);
							});

							res.render('favorites', {layout: 'layout', favorites: favArray, library: library});
						}
					});
		
				}
			});
		}
	})
	
});

app.post('/favorites', function(req, res){

	const favoriteTitle = req.body.favTitle;

	const newF = new Favorite({
		title: favoriteTitle,
	});

	newF.save((err, newFav) => {
		if (err) {
			console.log(err);
		} else {

			if (req.session.myFavorites){
				req.session.myFavorites.push(newFav);
			} else {
				req.session.myFavorites = [];
				req.session.myFavorites.push(newFav);
			}

		}

		res.redirect('/favorites');

	});

})

// displays user's bookmarked future reads
app.get('/bookmarked', function(req, res){

	Book.find({}, function(err, library){

		if (err) {
			console.log(err);
		} else {

			Bookmarked.find({}, function(err, bookmarkeds){
				if (err){
					console.log(err);
				} else {

					Bookmarked.find({title: req.query.BMtitle}, function(err){
						if (err){
							console.log(err);
						} else {

							let bmArray = [];

							bookmarkeds.map(n => {
								bmArray.push(n);
							});

							console.log("bookmarked: ", bmArray);

							res.render('bookmarked', {layout: 'layout', bookmarkeds: bmArray, library: library});
						}
					});
				}
			});
		}
	});

});


app.post('/bookmarked', function(req, res){

	const bookmarkedTitle = req.body.BMtitle;
	const bookmarkedAuthor = req.body.BMauthor;
	
	const newBM = new Bookmarked({
		title: bookmarkedTitle,
		author: bookmarkedAuthor
	});

	newBM.save((err, newBookmarked) => {

		if (err) {
			console.log(err);
		} else {

			if (req.session.myBookmarked){
				req.session.myBookmarked.push(newBookmarked);
			} else {
				req.session.myBookmarked = [];
				req.session.myBookmarked.push(newBookmarked);
			}

		}

		res.redirect('/bookmarked');

	});

})

app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT);
});
