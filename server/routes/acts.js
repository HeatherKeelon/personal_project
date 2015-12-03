var express=require('express');
var router=express.Router();
var pg = require('pg');
var passport = require('passport');
var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.get('/getTeam', function(req, res) {
    console.log("YOU ARE IN GETTEAM, ACTS");
    pg.connect(connectionString, function (err, client, next) {
        var teamname;
        //console.log("are you here?");
        client.query("SELECT team_name FROM users WHERE id='" + req.user + "'",
            function (err, response) {
                if (err) console.log(err);
                teamname = (response.rows[0].team_name);
                client.end();
                res.send(teamname);
            });

    });

});

router.get('/getGold', function(req, res){
    var team= req.query.team;
    var game= req.query.game;
    var character = req.query.character;
    pg.connect(connectionString, function(err, client){
        var gold;
        client.query("SELECT gold FROM " + team + game + "_characters WHERE character_name=$1",
        [character],
        function(err, response){
            gold=(response.rows[0].gold);
            client.end();
            res.send(gold);
        });

    });

});

router.post('/updateGold', function(req, res){
    var team = req.body['params']['team'];
    var character = req.body['params']['character'];
    var game = req.body['params']['game'];
    var gold = req.body['params']['gold'];

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_characters SET gold=$1 WHERE character_name=$2",
        [gold, character],
        function(err){
            if (err) console.log(err);
            client.end();
        });
    });
    res.send(gold);
});





module.exports=router;