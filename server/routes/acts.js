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
    console.log("This is the team database is pulling", team);
    var game= req.query.game;
    console.log("This is game database is pulling", game);
    var character = req.query.character;
    console.log("This is character database is pullsing", character);
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

router.get('/getExperience', function(req, res){
    var team= req.query.team;
    var game= req.query.game;
    var character = req.query.character;
    pg.connect(connectionString, function(err, client){
        var experience;
        client.query("SELECT exp FROM " + team + game + "_characters WHERE character_name=$1",
            [character],
            function(err, response){
                experience=(response.rows[0].exp);
                client.end();
                res.send(experience);
            });

    });

});

//router.get('/actStatus', function(req, res){
//    var team=req.query.team;
//    console.log("team", team);
//    var game=req.query.game;
//    console.log("game", game);
//    var act=req.query.act;
//    console.log("act", act);
//    var complete;
//
//    pg.connect(connectionString, function(err, client){
//        client.query("SELECT " + act + "FROM " + team + game + "_campaigns",
//        function(err, response){
//            complete=(response.rows[0].act);
//            client.end();
//            res.send(complete);
//        });
//    });
//});

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

router.post('/postNewEquip', function(req, res){
    var team = req.body['params']['team'];
    console.log("This is team", team);
    var game = req.body['params']['game'];
    console.log("This is game", game);
    var equip = req.body['params']['equip'];
    console.log("This is equip", equip);
    var type = req.body['params']['type'];
    console.log("This is type", type);
    var description = req.body['params']['description'];
    console.log("This is description", description);
    var cost = req.body['params']['cost'];
    console.log("This is cost", cost);
    var sale_cost = req.body['params']['sale_cost'];
    console.log("This is sale_cost", sale_cost);
    var dice = req.body['params']['dice'];
    console.log("This is dice", dice);
    var exhaust = req.body['params']['exhaust'];
    var equipped = req.body['params']['equipped'];
    console.log("This is equipped", equipped);
    console.log("This is exhaust", exhaust);
    var category = req.body['params']['category'];
    console.log("This is category", category);

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO " + team + game + "_equip " +
        "(name, type, description, character, cost, sale_cost, dice, exhaust, equipped, category) " +
        "VALUES ($1, $2, $3, 'none', $4, $5, $6, $7, $8, $9)",
            [equip, type, description, cost, sale_cost, dice, exhaust, equipped, category],
        function(err){
            if (err) console.log(err);
            client.end();
        });
    });
});

router.post('/updateExperience', function(req, res){
    var team = req.body['params']['team'];
    var character = req.body['params']['character'];
    var game = req.body['params']['game'];
    var exp = req.body['params']['exp'];

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_characters SET exp=$1 WHERE character_name=$2",
            [exp, character],
            function(err){
                if (err) console.log(err);
                client.end();
            });
    });
    res.send(exp);
});





module.exports=router;