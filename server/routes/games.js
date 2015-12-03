/**
 * Created by user on 11/25/15.
 */
var express=require('express');
var router=express.Router();
var pg = require('pg');
var passport = require('passport');
var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/descentbase';

router.post('/retrieveteam', function(req, res) {
    console.log("YOU ARE IN RETRIEVE TEAM, GAMES");

    pg.connect(connectionString, function(err, client, next){
        var team= [];
        var teamname;
        //console.log("are you here?");
        client.query("SELECT username, team_name FROM users WHERE id='" + req.user + "'",
        function(err, response){
            team=(response.rows[0]);
            teamname=(response.rows[0].team_name);
            //console.log("team", response.rows[0]);
            //console.log("This is teamname", teamname);
                 //if (response.rows[0].team_name == undefined){
                 //   console.log("This is teamname again", teamname);
                 //   console.log("Team added");
                    client.query("INSERT INTO teams (team_name) VALUES ($1)",
                        [teamname],
                    function(err){
                        if (err) console.log(err);
                        client.end();
                    });
                //};
                res.send(team);
            }
        );

    });

});

router.get('/refreshGames', function(req, res){
    console.log("YOU ARE IN REFRESH GAMES, GAMES");
    var gameNumber;
    //console.log("You're in refreshGames");
    //console.log(req.user);
    pg.connect(connectionString, function(err, client, next) {
        var query = client.query("SELECT teams.game_number " +
            "FROM users " +
            "JOIN teams " +
            "ON teams.team_name = users.team_name " +
            "WHERE users.id = '" + req.user + "'");

            query.on('row', function(row){
                gameNumber = row;
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

router.get('/teamandgame', function(req, res){
    console.log("YOU ARE IN TEAMANDGAME, GAMES");
    var response;

    pg.connect(connectionString, function(err, client, next) {
        var query = client.query("SELECT teams.team_name, teams.chosen_game " +
            "FROM users " +
            "JOIN teams " +
            "ON teams.team_name = users.team_name " +
            "WHERE users.id = '" + req.user + "'");

        query.on('row', function(row){
            response = row;
        });

        query.on('end', function(){
            client.end();
            return res.json(response);
        });

        if (err){
            console.log("Error getting gameNumber", err);
        }
    });
    //pg.connect(connectionString, function(err, client){
    //    var query = client.query("SELECT teams.team_name, teams.chosen_game " +
    //        "FROM users " +
    //        "JOIN teams " +
    //        "ON teams.team_name = users.team_name " +
    //        "WHERE users.id = '" + req.user + "'");
    //});
    //
    //query.on('row', function(){
    //    response = row;
    //    console.log("This is response to query", response);
    //});
    //
    //query.on('end', function(){
    //    client.end();
    //    return res.json(response);
    //});
});


router.post('/newGame', function(req, res){
    console.log("YOU ARE IN NEW GAME, GAMES");
  pg.connect(connectionString, function(err, client){
      var gameUpdate = req.body['params'];
      //console.log("This is gameUpdate", gameUpdate);
      //console.log("This is what you are updating ", gameUpdate.numberGames);
      //console.log("This is the team you are updating ", gameUpdate.team_name);
      client.query("UPDATE teams SET game_number = '" + gameUpdate.numberGames + "' WHERE team_name='" + gameUpdate.team_name + "'",
          function(err){
              if (err) console.log(err);
              client.end();
          });
  });
    res.send("Game Count Updated");
});

router.post('/assignGame', function(req, res){
    console.log("YOU ARE IN ASSIGNGAME, GAMES");
    var game = req.body['params']['chosen_game'];
    var team = req.body['params']['team_name'];


    pg.connect(connectionString, function(err, client){
        client.query("UPDATE teams SET chosen_game = '" + game + "' WHERE team_name= '" + team +"'",
        function(err){
            if (err) console.log(err);
            client.end();
        });
    });

    res.send("Hello");
});

router.post('/makeTables', function(req, res){
    console.log("YOU ARE IN MAKE TABLES, GAMES");
    var team = req.body['params']['team_name'];
    var gamenumber = req.body['params']['game_number'];

    pg.connect(connectionString, function(err, client){
        client.query("CREATE TABLE " + team + gamenumber + "_characters AS SELECT * FROM main_characters",
        function(err){
            if (err) console.log(err);

        });

        client.query("ALTER TABLE " + team + gamenumber + "_characters ADD CONSTRAINT " + team + gamenumber + "_characters_pkey PRIMARY KEY (characters_id)",
        function(err){
            if(err) console.log(err);

        });

        client.query("CREATE TABLE " + team + gamenumber + "_equip AS SELECT * FROM main_equip",
        function(err){
            if (err) console.log(err);

        });

        client.query("ALTER TABLE " + team + gamenumber + "_equip ADD CONSTRAINT " + team + gamenumber + "_equip_pkey PRIMARY KEY (equip_id)",
        function(err){
            if (err) console.log(err);

        });

        client.query("CREATE TABLE " + team + gamenumber + "_items AS SELECT * FROM main_items",
        function(err){
            if (err) console.log(err);

        });

        client.query("ALTER TABLE " + team + gamenumber + "_items ADD CONSTRAINT " + team + gamenumber + "_items_pkey PRIMARY KEY (items_id)",
        function(err){
            if (err) console.log(err);

        });

        client.query("CREATE TABLE " + team + gamenumber + "_syndrael_skills AS SELECT * FROM main_syndrael_skills",
        function(err){
            if (err) console.log(err);

            });

        client.query("ALTER TABLE " + team + gamenumber + "_syndrael_skills ADD CONSTRAINT " + team + gamenumber + "_syndrael_skills_pkey PRIMARY KEY (skills_id)",
            function(err){
                if (err) console.log(err);

            });

        client.query("CREATE TABLE " + team + gamenumber + "_campaigns AS SELECT * FROM main_campaigns",
        function(err){
            if (err) console.log(err);

        });

        client.query("ALTER TABLE " + team + gamenumber + "_campaigns ADD CONSTRAINT " + team + gamenumber + "_campaigns_pkey PRIMARY KEY (campaigns_id)",
            function(err){
                if (err) console.log(err);
                client.end();
            });

    });
    res.send("Tables Created");
});


module.exports = router;