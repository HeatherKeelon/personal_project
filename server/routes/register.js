var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');
var pg  = require('pg');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var SALT_WORK_FACTOR = 10;


var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.get('/', function (req, res, next){
    res.sendFile(path.resolve(__dirname, '../public/views/register.html'));
});

router.post('/', function(req, res, next){
    var user = req.body;

    pg.connect(connectionString, function (err, client) {
        console.log(req.body.username);
        client.query("SELECT team_name, username FROM users WHERE team_name = '" + req.body.team_name +"'",
        function(err, response){
            if (err) console.log(err);
            if (response.rows[0]==undefined){
                next();
            }else{
                var teammates=[];
                console.log(response['rows']);
                for (var i=0; i<response.rows.length; i++){
                    teammates.push(response['rows'][i].username);
                }
                console.log("This is teammates", teammates);
                client.end();
            }
        });


        client.query("SELECT username FROM users WHERE username = '" + req.body.username +"'",
        function(err, response){

            if (response.rows[0]==undefined){
                console.log("no user of that name");
                bcrypt.genSaltAsync(SALT_WORK_FACTOR).then(function(salt){
                    //  if(err) return next(err);
                    client.end();
                    return bcrypt.hashAsync(user.password, salt);
                })
                    .then(function(hash){
                        user.password = hash;
                        //next();
                        pg.connect(connectionString, function (err, client) {
                            if (err) console.log("This is error: ", err);

                            client.query('insert into users (username, email, team_name, password) VALUES ($1, $2, $3, $4)',
                                [req.body.username, req.body.email, req.body.team_name, req.body.password],
                                function (err, res) {
                                    client.end();
                                    if (err) {console.log("This is second err ", err);
                                        //need to tell user that the username has been taken.
                                    }

                                });

                        });

                    });
                res.redirect('/');

            }else{
                console.log("user name exists");
                res.redirect('/assets/views/usertaken.html');
            }
        });

        });




});


module.exports = router;
