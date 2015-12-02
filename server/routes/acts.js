var express=require('express');
var router=express.Router();
var pg = require('pg');
var passport = require('passport');
var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.get('/getTeam', function(req, res) {
    console.log("YOU ARE IN GETTEAM");
    pg.connect(connectionString, function (err, client, next) {
        console.log("This is req.user", req.user);
        var teamname;
        //console.log("are you here?");
        client.query("SELECT team_name FROM users WHERE id='" + req.user + "'",
            function (err, response) {
                if (err) console.log(err);
                console.log("THIS IS RESPONSE");
                teamname = (response.rows[0].team_name);
                console.log("This is teamname", teamname);
                res.send(teamname);
            });

    });

});





module.exports=router;