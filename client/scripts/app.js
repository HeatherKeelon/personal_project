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



myApp.controller('ActsController', ['$scope', '$http', 'TeamAndGame', '$location', function($scope, $http, TeamAndGame, $location){

    $scope.user;
    $scope.cookie;
    $scope.teamAndGame = TeamAndGame;


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
    console.log("This is game cookie", $scope.cookie);


    $scope.getTeam = function(){
        if ($scope.teamAndGame.gameData() == undefined){
            console.log("You are in the if statement");
            $http.get('/acts/getTeam').then(function(response){
                console.log("This is response from database", response.data);
                $scope.teamAndGame.retrieveData(response.data);
                $scope.user = $scope.teamAndGame.gameData();
            });

        }else{
            $scope.user = $scope.teamAndGame.gameData();
        }

    };



    $scope.getTeam();


    //$scope.getUser = function (cname) {
    //    var name = cname + "=";
    //    var ca = document.cookie.split(';');
    //    for(var i=0; i<ca.length; i++) {
    //        var c = ca[i];
    //        while (c.charAt(0)==' ') c = c.substring(1);
    //        if (c.indexOf(name) == 0){
    //            $scope.user=c.substring(name.length,c.length);
    //            return $scope.user;
    //        }
    //
    //    }
    //    return "";
    //};
    //
    //$scope.getUser('user');

    console.log("games", $scope.cookie);
    console.log("user at end of controller", $scope.user);

}]);


myApp.controller('MainCharacterController', ['$scope', 'TeamAndGame', '$http', 'EquipFactory', '$timeout', '$location', function($scope, TeamAndGame, $http, EquipFactory, $timeout, $location){
    //set up variables
    $scope.user;
    $scope.character = 'Syndrael';
    $scope.game;
    $scope.teamAndGame = TeamAndGame;
    $scope.equipFactory = EquipFactory;

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
    $scope.requestedUnequip = {};




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

    $scope.getUser = function () {
        if ($scope.teamAndGame.gameData() == undefined){
            console.log("You are in the if statement");
            $http.get('/acts/getTeam').then(function(response){
                $scope.teamAndGame.retrieveData(response.data);
                $scope.user = $scope.teamAndGame.gameData();
            });

        }else{
            $scope.user = $scope.teamAndGame.gameData();
        }
    };

    $scope.getUser();



    $scope.getUnequip = function(){
        $http.get('/main/getUnequip', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character}}).then(function(response){
            $scope.syndraelunequip = response.data;
            console.log("This is unequip in call", $scope.syndraelunequip);
        });
    };

    $scope.getBankequip = function(){
        $http.get('/main/getBankequip', {params: {"team": $scope.user, "game": $scope.game}}).then(function(response){
            $scope.bankequip = response.data;
            console.log("This is bank equip in call", $scope.bankequip);
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
                $scope.requestedUnequip.name = $scope.syndraelunequip[i].name;
                $scope.requestedUnequip.description = $scope.syndraelunequip[i].description;
                $scope.requestedUnequip.gold = $scope.syndraelunequip[i].cost;
                $scope.requestedUnequip.sale_cost = $scope.syndraelunequip[i].sale_cost;
                $scope.requestedUnequip.id = $scope.syndraelunequip[i].equip_id;
                if($scope.syndraelunequip[i].type == 1){
                    $scope.requestedUnequip.hand = "Single-Handed";
                }else if ($scope.syndraelunequip[i].type == 2){
                    $scope.requestedUnequip.hand = "Two-Handed";
                }else {
                    $scope.requestedUnequip.hand=$scope.syndraelunequip[i].type;
                }
            }

        }
        $scope.equipFactory.retrieveData($scope.requestedUnequip);
        console.log("Selected Name", $scope.equip);
        console.log("Selected Description", $scope.description);
        console.log("Selected Type", $scope.hand);
        $location.url('/equip');
    };


    //Starting page calls
    $scope.syndraelStartingStamina();
    $scope.syndraelStartingFatigue();
    //$timeout($scope.getUnequip);
    $scope.getUnequip();
    console.log("getUnequip called");
    //$timeout($scope.getBankequip);
    $scope.getBankequip();
    console.log("getBankequip called");


}]);


myApp.controller('EquipmentController', ['$scope', '$http', 'TeamAndGame', 'EquipFactory', 'GoldFactory', '$location', function($scope, $http, TeamAndGame, EquipFactory, GoldFactory, $location){
    $scope.teamAndGame = TeamAndGame;
    $scope.equipFactory = EquipFactory;
    $scope.goldFactory = GoldFactory;
    $scope.selectedEquip = {};
    $scope.character = 'Syndrael';
    $scope.game;
    $scope.user;
    $scope.description;
    $scope.hand;
    $scope.name;
    $scope.gold;
    $scope.sell_gold;
    $scope.character_gold;
    $scope.equipid;



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

    $scope.getUser = function () {
        if ($scope.teamAndGame.gameData() == undefined){
            console.log("You are in the if statement");
            $http.get('/acts/getTeam').then(function(response){
                $scope.teamAndGame.retrieveData(response.data);
                $scope.user = $scope.teamAndGame.gameData();
            });

        }else{
            $scope.user = $scope.teamAndGame.gameData();
        }
    };

    $scope.getUser();

    $scope.loadEquip = function(){
        $scope.selectedEquip=$scope.equipFactory.gameData();
        console.log($scope.selectedEquip);
        $scope.description = $scope.selectedEquip.description;
        $scope.name = $scope.selectedEquip.name;
        $scope.hand = $scope.selectedEquip.hand;
        $scope.gold = $scope.selectedEquip.gold;
        $scope.sell_gold = $scope.selectedEquip.sale_cost;
        $scope.equipid = $scope.selectedEquip.id;
    };

    $scope.sellEquip = function(sell_gold){
        console.log("This is goldData", $scope.goldFactory.goldData($scope.user, $scope.game, $scope.character));
        //var gold=parseInt(sell_gold);
        //var currentgold = $scope.goldFactory.goldData($scope.user, $scope.game, $scope.character);
        //console.log("This is sell_gold", gold);
        //$scope.character_gold = currentgold;
        //console.log("This is character gold (aka factory)", $scope.character_gold);
        //    $scope.character_gold= $scope.character_gold + gold;
        //    console.log("This is character_gold after sale", $scope.character_gold);
        //    $scope.goldFactory.postGold($scope.user, $scope.game, $scope.character, $scope.character_gold);
        //
        //$http.post('/equip/removeEquip', {params:{"team": $scope.user, "game": $scope.game, "character": $scope.character, "Equip": $scope.equipid}}).then(function(response){
        //    console.log("Equip updated");
        //    $location.url('/main');
        //});

    };

    $scope.loadEquip();
    $scope.goldFactory.goldData($scope.user, $scope.game, $scope.character);


}]);

myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.
        when('/login', {
            templateUrl: "/assets/views/login.html",
            css: "/assets/styles/login_styles.css"
        }).

        when('/failure', {
            templateUrl: "/assets/views/failure.html"
        }).

        when('/usertaken', {
            templateUrl: "/assets/views/usertaken.html"
        }).

        when('/register', {
            templateUrl: "/assets/views/register.html",
            css: "/assets/views/register_styles.css"
        }).

        when('/games', {
            templateUrl: "/assets/views/games.html",
            controler: "GamesController",
            css: "/assets/styles/games_styles.css"
        }).

        when('/acts', {
            templateUrl: "/assets/views/acts.html",
            controller: "ActsController",
            css: "/assets/styles/acts_styles.css"
        }).

        when('/main', {
            templateUrl: "/assets/views/main_syndrael.html",
            controller: "MainCharacterController",
            css: "/assets/styles/main_syndrael_styles.css"
        }).
        when('/equip', {
            templateUrl: "/assets/views/equip.html",
            controller: "EquipmentController",
            css: "/assets/styles/equip_styles.css"
        }).
        otherwise({
            redirectTo: 'login'
        })
}]);

myApp.directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
        return {
            restrict: 'E',
            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if(current && current.$$route && current.$$route.css){
                        if(!angular.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if(next && next.$$route && next.$$route.css){
                        if(!angular.isArray(next.$$route.css)){
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);
