var express=require('express');
var router=express.Router();
var pg = require('pg');
var passport = require('passport');
var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.post('/removeEquip', function(req, res){
    console.log("You are in removeEquip");
    var team=req.body['params']['team'];
    console.log("This is your team", team);
    var character = req.body['params']['character'];
    console.log("This is your character", character);
    var game = req.body['params']['game'];
    console.log("This is your game", game);
    var equip = req.body['params']['equip'];
    console.log("This is the equipid you are trying to remove", equip);

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_equip SET character='none' WHERE equip_id=$1",
        [equip],
        function(err){
            if (err) console.log(err);
            client.end();
        });
    });
    res.send("equip removed");
});

router.post('/newEquip', function(req, res){
    var team=req.body['params']['team'];
    var character = req.body['params']['character'];
    var game = req.body['params']['game'];
    var name = req.body['params']['name'];
    var hand = req.body['params']['hand'];
    console.log("This is hand", hand);
    var id = req.body['params']['id'];

    pg.connect(connectionString, function(err, client){
        console.log("Looking into the weapon post in character");
        client.query("UPDATE " + team + game + "_characters SET " + hand + "=$1 WHERE character_name=$2",
        [name, character],
        function(err){
            console.log(err);
            client.end();
        });
    });

    pg.connect(connectionString, function(err, client){
        console.log("Looking into the weapon post in equip");
        client.query("UPDATE " + team + game + "_equip SET equipped='true' WHERE equip_id=$1",
        [id],
        function(err){
            if (err) console.log(err);
            client.end();
        });
    });
    res.send("Equipment updated");
});

router.post('/findEquip', function(req, res){
    console.log("YOU ARE IN FINDEQUIP");
    var team=req.body['params']['team'];
    console.log("this is the team you are looking for", team);
    var character = req.body['params']['character'];
    console.log("This is the character you are looking for", character);
    var game = req.body['params']['game'];
    console.log("This is the game you are looking for", game);
    var id = req.body['params']['id'];
    console.log("This is the id you are looking for", id);

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_equip SET character=$1 WHERE equip_id=$2",
        [character, id],
        function(err){
            if(err) console.log(err);
            console.log("findEquip connection complete");
            client.end();
        });
    });
    res.send("Equipment found");
});

router.post('/unequip', function(req, res){
    var team = req.body['params']['team'];
    console.log("This is team", team);
    var character = req.body['params']['character'];
    console.log("This is character", character);
    var game = req.body['params']['game'];
    console.log("This is game", game);
    var id = req.body['params']['id'];
    console.log("This is id", id);
    var name = req.body['params']['name'];
    console.log("This is name", name);
    var hand = req.body['params']['hand'];
    console.log("This is hand", hand);

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_characters SET " + hand + "='none' WHERE character_name=$1",
        [character],
        function(err){
            if(err)console.log(err);
            client.end();
        });
    });

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_equip SET equipped='false' WHERE equip_id=$1",
        [id],
        function(err){
            if(err) console.log(err);
            client.end();
        });
    });
    res.send("Unequip complete");
});

router.get('/equipJoin', function(req, res){
    var game = req.query.game;
    var character = req.query.character;
    var team = req.query.team;
    var equip = [];

    pg.connect(connectionString, function(err, client){
        var query = client.query("SELECT " + team + game + "_equip.type, " + team + game + "_equip.name, " + team + game + "_characters.right_hand, " + team + game + "_characters.left_hand, " + team + game + "_characters.two_hand " +
        "FROM " + team + game + "_equip, " + team + game + "_characters " +
        "WHERE " + team + game + "_characters.character_name=$1 " +
        "AND " + team + game + "_equip.name = " + team + game + "_characters.left_hand " +
        "OR " + team + game + "_equip.name = " + team + game + "_characters.right_hand " +
        "OR " + team + game + "_equip.name = " + team + game + "_characters.two_hand;",
            [character]);

        query.on('row', function(row){
            equip.push(row);
        });

        query.on('end', function(){
            client.end();
            return res.json(equip);
        });
    });
});


module.exports=router;