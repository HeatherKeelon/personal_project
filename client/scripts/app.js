var myApp = angular.module("myApp", ['ngRoute']);

myApp.controller('GameController', ['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.user = {};
    $scope.team_id;
    $scope.username = {};
    $scope.currentGame=[];
    $scope.numberGames=$scope.currentGame.length;



    //Functions for games.html

    $scope.setGame = function(cname, number){
        document.cookie = cname + "=" + number + ";";
        console.log(document.cookie);
    };


    $scope.getTeam = function(){
        //console.log("you are in getTeam");
        $http.post('/games/retrieveteam').then(function(response){
            //console.log(response.data['team_name']);
            $scope.user = response.data['team_name'];
            $scope.username = response.data['username'];
            //console.log($scope.user);
            //console.log("This is username", $scope.username);
        });
    };


    $scope.refreshGames = function(){
        $http.get('/games/refreshGames').then(function(response){
            var currentGameCount=parseInt(response['data'].game_number);
            //console.log("Game count from database at refresh: ", currentGameCount);
            if (currentGameCount == 0){
                console.log("No Games for This Team Yet");
            }else {
                for (var i=1; i<=currentGameCount; i++){
                    $scope.currentGame.push(i);
                    //console.log("This is currentGameCount going into numberGames ", currentGameCount);
                };
                $scope.numberGames=$scope.currentGame.length;
                //console.log("currentGame at page fresh", $scope.currentGame);
            }

            //console.log($scope.numberGames);
        });
    };

    $scope.addGameToCurrent = function() {
        $http.get('/games/refreshGames').then(function (response) {
            var currentGameCount = parseInt(response['data'].game_number);
            $scope.currentGame.push(currentGameCount);
            $scope.numberGames=$scope.currentGame.length;
        });
    };

    //Note that this area is having issues on page reload. When the page reloads, it seems to be wanting to insert a 1 as last value of currentGame.

    $scope.newGame = function(){
        $scope.numberGames= $scope.currentGame.length + 1;
        //console.log("This is new number games", $scope.numberGames);
        //console.log("This us user ", $scope.user);
        $http.post('/games/newGame', {params: {"numberGames": $scope.numberGames, "team_name": $scope.user}}).then(function(){
            //console.log("New Game Complete");
            $scope.addGameToCurrent();
            $scope.makeTables();

        });
    };

    $scope.makeTables = function(){
        //console.log("You are in makeTables");
        $http.post('/games/makeTables', {params: {"team_name": $scope.user, "game_number": $scope.numberGames}}).then(function(){
            console.log("Tables created");
        });
    };


    $scope.getTeam();
    $scope.refreshGames();
    //console.log("This is numberGames at page load", $scope.numberGames);


}]);



myApp.controller('ActsController', ['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.user;
    $scope.cookie;


    $scope.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0){
                $scope.cookie=c.substring(name.length,c.length);
                console.log("Cookie inside getCookie", $scope.cookie);
                return $scope.cookie;
            }

        }
        return "";
    };
    $scope.getCookie('game');
    console.log("Cookie outside getcookie", $scope.cookie);


    $scope.getTeam = function(){
        console.log("get team has been called");
        $http.get('/acts/getTeam').then(function(response){
            document.cookie = "user" + "=" + response['data'] + ";";
        });
    };



    $scope.getTeam();


    $scope.getUser = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0){
                $scope.user=c.substring(name.length,c.length);
                return $scope.user;
            }

        }
        return "";
    };

    $scope.getUser('user');

    console.log("games", $scope.cookie);
    console.log("user", $scope.user);

}]);


myApp.controller('MainCharacterController', ['$scope', '$http', '$location', function($scope, $http, $location){
    //set up variables
    $scope.user;
    $scope.character = 'Syndrael';
    $scope.game;

    //Status variables
    $scope.syndraelstamina;
    $scope.syndraelstaminamax = 12;
    $scope.syndraelfatigue = 4;
    $scope.syndraelfatiguemax = 4;
    $scope.syndraelmight = 4;
    $scope.syndraelknowledge = 3;
    $scope.syndraelwillpower = 2;
    $scope.syndraelawareness = 2;
    $scope.checkboxModel = {
        poison: false,
        immobalize: false,
        stun: false,
        disease: false
    };

    //Equipment/Skills/Items variables
    $scope.syndraelunequip = [];
    $scope.bankequip = [];
    $scope.syndraelrh = 'none';
    $scope.syndraellh = 'none';
    $scope.syndraelbh = 'none';
    $scope.syndraelaccessory1 = 'none';
    $scope.syndraelaccessory2 = 'none';
    $scope.equip = 'none';
    $scope.description;
    $scope.hand;
    $scope.gold;






    //Page set-up functions

    $scope.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0){
                $scope.game=c.substring(name.length,c.length);
                return $scope.game;
            }

        }
        return "";
    };
    $scope.getCookie('game');

    $scope.getUser = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0){
                $scope.user=c.substring(name.length,c.length);
                return $scope.user;
            }

        }
        return "";
    };

    $scope.getUser('user');


    $scope.getUnequip = function(){
        $http.get('/main/getUnequip', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character}}).then(function(response){
            $scope.syndraelunequip = response.data;
        });
    };

    $scope.getBankequip = function(){
        $http.get('/main/getBankequip', {params: {"team": $scope.user, "game": $scope.game}}).then(function(response){
            $scope.bankequip = response.data;
            console.log($scope.bankequip);
        });
    };

    $scope.syndraelHeroicFeat = function(){
        alert("Use during your turn to choose a hero within 3 spaces of you. You and that hero may each immediately perform a move action. This is in addition to the 2 actions each hero receives on his turn.");;
    };

    $scope.syndraelHeroicAbility = function(){
        alert("If you have not moved during this turn, you recover 2 stamina at the end of your turn.");
    };

    $scope.syndraelStartingStamina = function(){
        $http.get('/main/startStats', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character, "stat": 'stamina'}}).then(function(response){
            $scope.syndraelstamina=response.data['stamina'];
        });
    };

    $scope.syndraelStartingFatigue = function(){
        $http.get('/main/startStats', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character, "stat": 'fatigue'}}).then(function(response){
            $scope.syndraelfatigue=response.data['fatigue'];
        });
    };



    //User interactions functions
    $scope.staminaPlus = function(){
        if($scope.syndraelstamina < $scope.syndraelstaminamax){
            $scope.syndraelstamina++;
            $http.post('/main/staminafatigue', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character, "stat": $scope.syndraelstamina, "type": 'stamina'}}).then(function(){
                console.log("stamina post");
            });
        }
    };

    $scope.staminaMinus = function(){
        if($scope.syndraelstamina > 0){
            $scope.syndraelstamina--;
            $http.post('/main/staminafatigue', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character, "stat": $scope.syndraelstamina, "type": 'stamina'}}).then(function(){
                console.log("stamina post");
            });
        }

    };

    $scope.fatiguePlus = function(){
        if($scope.syndraelfatigue < $scope.syndraelfatiguemax){
            $scope.syndraelfatigue++;
            $http.post('/main/staminafatigue', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character, "stat": $scope.syndraelfatigue, "type": 'fatigue'}}).then(function(){
                console.log("fatigue post");
            });
        }
    };

    $scope.fatigueMinus = function(){
        if($scope.syndraelfatigue > 0){
            $scope.syndraelfatigue--;
            $http.post('/main/staminafatigue', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character, "stat": $scope.syndraelfatigue, "type": 'fatigue'}}).then(function(){
                console.log("fatigue post");
            });
        }
    };

    $scope.resetStats = function(){
        $scope.syndraelstamina = $scope.syndraelstaminamax;
        $scope.syndraelfatigue = $scope.syndraelfatiguemax;
        $http.post('/main/resetStats', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character, "stamina": $scope.syndraelstaminamax, "fatigue": $scope.syndraelfatiguemax}}).then(function(){
            console.log("stats reset");
        });
    };

    $scope.selectEquip = function(equipname){
        console.log("This is equipname", equipname.name);
        for (var i= 0; i<$scope.syndraelunequip.length; i++){
            console.log("Scope.unequip[i]", $scope.syndraelunequip);
            console.log("This is scope.name", $scope.syndraelunequip[i].name);
            console.log($scope.syndraelunequip[i].description);
            if ($scope.syndraelunequip[i].name == equipname.name) {
                console.log("you are in if statement");
                $scope.equip = $scope.syndraelunequip[i].name;
                $scope.description = $scope.syndraelunequip[i].description;
                if($scope.syndraelunequip[i].type == 1){
                    $scope.hand = "Single-Handed";
                }else if ($scope.syndraelunequip[i].type == 2){
                    $scope.hand = "Two-Handed";
                }else {
                    $scope.hand=$scope.syndraelunequip[i].type;
                }
            }
        };
        window.location='/assets/views/equip.html';
        console.log("Selected Name", $scope.equip);
        console.log("Selected Description", $scope.description);
        console.log("Selected Type", $scope.hand);
    };


    //Starting page calls
    $scope.syndraelStartingStamina();
    $scope.syndraelStartingFatigue();
    $scope.getUnequip();
    $scope.getBankequip();


}]);



