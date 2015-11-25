var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var pg = require('pg');
var passport = require('./strategies/user');
var session = require('express-session');

var register = require('./routes/register');
var user = require('./routes/user');
var index = require('./routes/index');
var games = require('./routes/games');


// App Set //
app.set("port", (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

// Passport Session Configuration //
app.use(session({
    secret: 'secret',
    key: 'user',
    resave: 'true',
    saveUninitialized: false,
    cookie: {maxage: 600000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/games', games);
app.use('/register', register);
app.use('/user', user);
app.use('/', index);

// Mongo Connection //
//var mongoURI = "mongodb://localhost:27017/user_passport_session";

var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/church';

// Listen //
app.listen(app.get("port"), function(){
    console.log("Listening on port: " + app.get("port"));
});