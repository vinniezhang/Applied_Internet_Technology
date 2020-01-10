const mongoose = require('mongoose');

// this is never used
const User = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    libraries: Array
})

const Book = new mongoose.Schema({
    title: String,
    author: String,
    rating: Number,
    review: String, 
    favorite: String
});

const Favorite = new mongoose.Schema({
    title: String,
})

const Bookmarked = new mongoose.Schema({
    title: String,
    author: String
})

mongoose.model('User', User);
mongoose.model('Book', Book);
mongoose.model('Favorite', Favorite);
mongoose.model('Bookmarked', Bookmarked);

// not sure if this is necessary but included it from last hw assignment
// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, '../config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // connection string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/library';
}

// this connects to the database
mongoose.connect(dbconf, {useUnifiedTopology: true, useNewUrlParser: true});
