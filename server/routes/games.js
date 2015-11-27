/**
 * Created by user on 11/25/15.
 */
var express=require('express');
var router=express.Router();
var pg = require('pg');
var passport = require('passport');
var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.post('/retrieveteam', function(req, res) {

    pg.connect(connectionString, function(err, client, next){
        var teamname;
        console.log("are you here?");
        client.query("SELECT team_name FROM users WHERE id='" + req.user + "'",
        function(err, response){
            teamname=(response.rows[0].team_name);
            console.log("Response.rows 2", response.rows[0].team_name);
            console.log("This is teamname", teamname);
                 //if (response.rows[0].team_name == undefined){
                 //   console.log("This is teamname again", teamname);
                 //   console.log("Team added");
                    client.query("INSERT INTO teams (team_name) VALUES ($1)",
                        [teamname],
                    function(err){
                        if (err) console.log(err);
                    });
                //};
                res.send(teamname);
            }
        );

    });

});

router.get('/refreshGames', function(req, res){
    var gameNumber;
    console.log("You're in refreshGames");
    console.log(req.user);
    pg.connect(connectionString, function(err, client, next) {
        var query = client.query("SELECT teams.game_number " +
            "FROM users " +
            "JOIN teams " +
            "ON teams.team_name = users.team_name " +
            "WHERE users.id = '" + req.user + "'");

            query.on('row', function(row){
                gameNumber = row;
                console.log(gameNumber);
            });

        query.on('end', function(){
            client.end();
            return res.json(gameNumber);
        });

        if (err){
            console.log("Error getting gameNumber", err);
        }
    });


});
module.exports = router;