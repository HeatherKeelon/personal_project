var express=require('express');
var router=express.Router();
var pg = require('pg');
var passport = require('passport');
var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.get('/getTeam', function(req, res) {
    pg.connect(connectionString, function (err, client, next) {
        var teamname;
        //console.log("are you here?");
        client.query("SELECT team_name FROM users WHERE id='" + req.user + "'",
            function (err, response) {
                if (err) console.log(err);

                teamname = (response.rows[0].team_name);
                console.log(teamname);
                res.send(teamname);
            });

    });

});

router.get('/getUnequip', function(req, res){
  console.log("This is req.query", req.query);
    res.send("Hello");
});



module.exports=router;