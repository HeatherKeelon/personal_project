var express=require('express');
var router=express.Router();
var pg = require('pg');
var passport = require('passport');
var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.post('/removeEquip', function(req, res){
    var team=req.body['params']['team'];
    var character = req.body['params']['team'];
    var game = req.body['params']['game'];
    var equip = req.body['params']['equip'];

    pg.connect(connectionString, function(err, client){
        client.query("UPDATE " + team + game + "_equip SET character='none' WHERE equip_id=$1",
        [equip],
        function(err){
            if (err) console.log(err);
            client.end();
        });
    });
});


module.exports=router;