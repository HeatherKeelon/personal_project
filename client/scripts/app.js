var myApp = angular.module("myApp", []);

myApp.controller('GameController', ['$scope', '$http', '$location', 'TeamAndGame', function($scope, $http, $location, TeamAndGame){

    $scope.user = {};
    $scope.team_id;
    $scope.username = {};
    $scope.currentGame=[];
    $scope.numberGames=$scope.currentGame.length;
    $scope.teamAndGame = TeamAndGame;

    $scope.teamAndGame.retrieveData();

    //Functions for games.html

    $scope.gameFactory = function(number){
        console.log("You are in gameFactory, here number", number);


        $http.post('/games/assignGame', {params: {"chosen_game": number, "team_name": $scope.user}}).then(function(){
            console.log("Game Posted");
            if($scope.teamAndGame.gameData() == undefined){
                $scope.teamAndGame.retrieveData().then(function(){
                    $scope.game=$scope.teamAndGame.gameData().then(function(){
                        $scope.teamAndGame.gameNumber = number;
                        window.location = '/assets/views/acts.html';
                    });

                });
            }else {
                $scope.game=$scope.teamAndGame.gameData();
                window.location = '/assets/views/acts.html';
            }
            console.log("async", $scope.teamAndGame.gameData());
            console.log("game", $scope.game);

        });
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



myApp.controller('ActsController', ['$scope', '$http', '$location', 'TeamAndGame', function($scope, $http, $location, TeamAndGame){
    $scope.teamAndGame = TeamAndGame;
    $scope.user;

    console.log("This is from factory:", $scope.teamAndGame);

    //
    //if($scope.teamAndGame.gameData() == undefined){
    //    $scope.teamAndGame.retrieveData().then(function(){
    //        $scope.game=$scope.teamAndGame.gameData();
    //    });
    //}else {
    //    $scope.game=$scope.teamAndGame.gameData();
    //}

    //
    //$scope.getTeam = function(){
    //    $http.get('/acts/getTeam').then(function(response){
    //        $scope.user = response['data'];
    //        console.log("This is response", response['data']);
    //    });
    //};
    //
    //
    //
    //$scope.getTeam();
    //console.log("Scope.game", $scope.game);

}]);


myApp.controller('MainCharacterController', ['$scope', '$http', '$location', 'TeamAndGame', function($scope, $http, $location, TeamAndGame){
    $scope.teamAndGame = TeamAndGame;
    $scope.user;
    $scope.character = 'Syndrael';
    $scope.syndraelstamina = 12;
    $scope.syndraelstaminamax = 12;
    $scope.syndraelfatigue = 4;
    $scope.syndraelfatiguemax = 4;
    $scope.syndraelunequip = [];


    if($scope.teamAndGame.gameData() == undefined){
        $scope.teamAndGame.retrieveData();
    }
    $scope.game=$scope.teamAndGame.gameData();
    console.log("This is $scope.game", $scope.game);
    $scope.getTeam = function(){
        $http.get('/acts/getTeam').then(function(response){
            $scope.user = response['data'];
            console.log("This is response", response['data']);
        });
    };



    $scope.getUnequip = function(){
        $http.get('/acts/getUnequip', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character}}).then(function(response){
            $scope.syndraelunequip = response.data;
            console.log("This is syndrael unequip", $scope.syndraelunequip);
            console.log("This is $scope.user", $scope.user);
            console.log("This is $scope.game", $scope.game);
        });
    };

    $scope.getTeam();
    $scope.getUnequip();


}]);


