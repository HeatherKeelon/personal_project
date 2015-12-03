var express=require('express');
var router=express.Router();
var pg = require('pg');
var passport = require('passport');
var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.get('/startStats', function(req, res){
    var character=req.query.character;
    var game = req.query.game;
    var team = req.query.team;
    var stat = req.query.stat;
    var newstat;

    pg.connect(connectionString, function(err, client){
        var query = client.query("SELECT " + stat +  " FROM " + team + game + "_characters WHERE character_name=$1",
        [character]);

        query.on('row', function(row){
            newstat=row;
        });

        query.on('end', function(){
            client.end();
            return res.json(newstat);
        });
    });
});


router.get('/getUnequip', function(req, res){
    var character=req.query.character;
    var game=req.query.game;
    var team=req.query.team;
    var equipment=[];
    pg.connect(connectionString, function(err, client){
        var query = client.query("SELECT * FROM " + team + game + "_equip WHERE character=$1 AND equipped='false'",
        [character]);
            query.on('row', function(row){
                equipment.push(row);
                console.log(equipment);
            });

        query.on('end', function(){
            client.end();
            return res.json(equipment);
        });

    });

});

router.get('/getBankequip', function(req, res){
    var game=req.query.game;
    var team=req.query.team;
    var bank=[];
    pg.connect(connectionString, function(err, client){
        var query = client.query("SELECT * FROM " + team + game + "_equip WHERE character='none'");
        query.on('row', function(row){
            bank.push(row);
        });

        query.on('end', function(){
            client.end();
            return res.json(bank);
        });

    });

});

router.post('/staminafatigue', function(req, res){
    var team = req.body['params']['team'];
    var game = req.body['params']['game'];
    var character = req.body['params']['character'];
    var stat = req.body['params']['stat'];
    var type = req.body['params']['type']

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_characters SET " + type + "=$1 WHERE character_name=$2",
        [stat, character],
        function(err){
            client.end();
            if (err) console.log(err);
        });
    });
});

router.post('/resetStats', function(req, res){
    var team = req.body['params']['team'];
    var game = req.body['params']['game'];
    var character = req.body['params']['character'];
    var stamina = req.body['params']['stamina'];
    var fatigue = req.body['params']['fatigue'];

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_characters SET stamina=$1, fatigue=$2 WHERE character_name=$3",
            [stamina, fatigue, character],
        function(err){
            client.end();
            if (err) console.log(err);
        });
    });
});

module.exports=router;