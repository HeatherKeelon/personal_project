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
    $scope.equippeddata = [];
    $scope.syndraelcurrent;
    $scope.syndraelrh = 'none';
    $scope.syndraellh = 'none';
    $scope.syndraelbh = 'none';
    $scope.syndraelarmor = 'none';
    $scope.syndraelaccessory1 = 'none';
    $scope.syndraelaccessory2 = 'none';
    $scope.requestedUnequip = {};
    $scope.equipment = {
        name: 'none',
        description: 'none'
    };
    $scope.currentequipment = {};




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

    $scope.getEquippedData = function(){
        $http.get('/main/getEquippedData', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character}}).then(function(response){
            $scope.equippeddata = response.data;
            console.log("This is equippeddata", $scope.equippeddata);
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

    $scope.syndraelEquip = function(){
        $http.get('/main/syndraelEquip', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character}}).then(function(response){
            console.log("This is response.data equip", response.data);
            for (var i=0; i<response.data.length; i++){
                if (response.data[i].acc1==null){
                    $scope.syndraelaccessory1 = 'none';
                }else {
                    $scope.syndraelaccessory1=response.data[i].acc1;
                }

                if(response.data[i].acc2==null){
                    $scope.syndraelaccessory2 = 'none';
                }else{
                    $scope.syndraelaccessory2 = response.data[i].acc2;
                }

                if(response.data[i].armor == null){
                    $scope.syndraelarmor = 'none';
                }else{
                    $scope.syndraelarmor = response.data[i].armor;
                }

                if(response.data[i].left_hand == null){
                    $scope.syndraellh = 'none';
                }else{
                    $scope.syndraellh = response.data[i].left_hand;
                }

                if(response.data[i].right_hand ==null){
                    $scope.syndraelrh = 'none';
                }else {
                    $scope.syndraelrh = response.data[i].right_hand;
                }

                if (response.data[i].two_hand==null){
                    $scope.syndraelbh = 'none';
                }else {
                    $scope.syndraelbh = response.data[i].two_hand;
                }
            }
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
                $scope.requestedUnequip.category = $scope.syndraelunequip[i].category;
                $scope.requestedUnequip.type = $scope.syndraelunequip[i].type;
                $scope.requestedUnequip.dice = $scope.syndraelunequip[i].dice;
                $scope.requestedUnequip.exhaust = $scope.syndraelunequip[i].exhaust;
            }

        }
        $scope.equipFactory.retrieveData($scope.requestedUnequip);
        console.log("Selected Name", $scope.equip);
        console.log("Selected Description", $scope.description);
        console.log("Selected Type", $scope.hand);
        $location.url('/equip');
    };

    $scope.selectBankEquip = function(equipname){
        console.log("This is equipname", equipname.name);
        for (var i= 0; i<$scope.bankequip.length; i++){
            console.log("Scope.unequip[i]", $scope.bankequip);
            console.log("This is scope.name", $scope.bankequip[i].name);
            console.log($scope.bankequip[i].description);
            if ($scope.bankequip[i].name == equipname.name) {
                console.log("you are in if statement");
                $scope.equipment.name = $scope.bankequip[i].name;
                $scope.equipment.description = $scope.bankequip[i].description;
                $scope.equipment.gold = $scope.bankequip[i].cost;
                $scope.equipment.sale_cost = $scope.bankequip[i].sale_cost;
                $scope.equipment.id = $scope.bankequip[i].equip_id;
                $scope.equipment.category = $scope.bankequip[i].category;
                $scope.equipment.type = $scope.bankequip[i].type;
                $scope.equipment.dice = $scope.bankequip[i].dice;
                $scope.equipment.exhaust = $scope.bankequip[i].exhaust;
            }

        }
        $scope.equipFactory.retrieveBank($scope.equipment);
        console.log("Selected Name", $scope.equipment.name);
        console.log("Selected Description", $scope.equipment.description);
        console.log("Selected Type", $scope.equipment.hand);
        $location.url('/bankequip');
    };

    //Put selectedCurrentEquip() here!
    $scope.selectedCurrentEquip = function(equipname){
        console.log("This is equipname", equipname);
        console.log("This is equippeddata", $scope.equippeddata);
        for (var i= 0; i<$scope.equippeddata.length; i++){

        //you stopped at if statement
            if ($scope.equippeddata[i].name == equipname) {
                console.log("you are in if statement");
                $scope.currentequipment.name = $scope.equippeddata[i].name;
                $scope.currentequipment.description = $scope.equippeddata[i].description;
                $scope.currentequipment.gold = $scope.equippeddata[i].cost;
                $scope.currentequipment.sale_cost = $scope.equippeddata[i].sale_cost;
                $scope.currentequipment.id = $scope.equippeddata[i].equip_id;
                $scope.currentequipment.category = $scope.equippeddata[i].category;
                $scope.currentequipment.type = $scope.equippeddata[i].type;
                $scope.currentequipment.dice = $scope.equippeddata[i].dice;
                $scope.currentequipment.exhaust = $scope.equippeddata[i].exhaust;
            }

        }
        console.log("This is scope.currentequipment", $scope.currentequipment);
        $scope.equipFactory.retrieveCurrent($scope.currentequipment);
        $location.url('/carryequip');
    };


    //Starting page calls
    $scope.syndraelStartingStamina();
    $scope.syndraelStartingFatigue();
    $scope.syndraelEquip();
    $scope.getEquippedData();
    $scope.equipFactory.allEquip($scope.user, $scope.game, $scope.character);
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
    $scope.category;
    $scope.type;
    $scope.dice;

//Set up functions

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
            //console.log("You are in the if statement");
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
        //console.log("This is selected equip", $scope.selectedEquip);
        $scope.description = $scope.selectedEquip.description;
        $scope.name = $scope.selectedEquip.name;
        $scope.hand = $scope.selectedEquip.hand;
        $scope.gold = $scope.selectedEquip.gold;
        $scope.sell_gold = $scope.selectedEquip.sale_cost;
        $scope.equipid = $scope.selectedEquip.id;
        $scope.category = $scope.selectedEquip.category;
        console.log("This is category", $scope.category);
        $scope.type = $scope.selectedEquip.type;
        $scope.dice = $scope.selectedEquip.dice;

        if($scope.selectedEquip.exhaust==true){
            $scope.exhaust = 'Yes';
        }else {
            $scope.exhaust = 'No';
        }
    };


    //User interactive functions

    $scope.sellEquip = function(sell_gold){
        var gold=parseInt(sell_gold);
        $scope.character_gold = parseInt($scope.goldFactory.goldData($scope.user, $scope.game, $scope.character));
        //console.log("This is sell_gold", gold);
        //console.log("This is character gold with parseInt(aka factory)", $scope.character_gold);
            $scope.character_gold= $scope.character_gold + gold;
            //console.log("This is character_gold after sale", $scope.character_gold);
            $scope.goldFactory.postGold($scope.user, $scope.game, $scope.character, $scope.character_gold);

        $http.post('/equip/removeEquip', {params:{"team": $scope.user, "game": $scope.game, "character": $scope.character, "equip": $scope.equipid}}).then(function(response){
            //console.log("Equip updated");
            $location.url('/main');
        });

    };

    $scope.equipItem = function(){
        console.log("You are in equipItem");
        console.log("This is weapon total client", $scope.equipFactory.getTotalWeapon());
        var type = $scope.type;
        console.log("this is type", type);
        //console.log("this is scope type", $scope.type);
        var weapontotal = $scope.equipFactory.getTotalWeapon();
        console.log("this is weapon total", weapontotal);

        switch (type) {
            case (type='1'):
                console.log("Your type is 1");
                type=parseInt($scope.type);
                console.log("This is type", type);

                if(type + weapontotal >2) {
                    alert("You cannot carry another weapon. Unequip one of your current weapons.");
                } else{
                        if ($scope.equipFactory.getEquip().syndraellh == 'none') {
                            $scope.equipFactory.updateEquip($scope.user, $scope.game, $scope.character, $scope.name, $scope.equipid, 'left_hand');
                        }else if ($scope.equipFactory.getEquip().syndraelrh == 'none'){
                            $scope.equipFactory.updateEquip($scope.user, $scope.game, $scope.character, $scope.name, $scope.equipid, 'right_hand');
                        }
                    }

                break;

            case (type='2'):
                type=parseInt($scope.type);
                console.log("Your type is 2");
                if(type + weapontotal >2) {
                    alert("You cannot carry another weapon. Unequip one of your current weapons.");
                } else{
                    $scope.equipFactory.updateEquip($scope.user, $scope.game, $scope.character, $scope.name, $scope.equipid, 'two_hand');
                }

                break;

            case (type='accessory'):
                console.log("Your type is accessory");
                if ($scope.equipFactory.getEquip().syndraelaccessory1 == 'none'){
                    console.log("This is accessory from equipfac", $scope.equipFactory.getEquip().syndraelaccessory1);
                    $scope.equipFactory.updateEquip($scope.user, $scope.game, $scope.character, $scope.name, $scope.equipid, 'acc1');
                }else if ($scope.equipFactory.getEquip().syndraelaccessor2 == 'none'){
                    $scope.equipFactory.updateEquip($scope.user, $scope.game, $scope.character, $scope.name, $scope.equipid, 'acc2');
                }else {
                    alert("You already have an accessory equipped. Check your current equipment.");
                }

                break;

            case (type ='armor'):
                if($scope.equipFactory.getEquip().syndraelarmor == 'none'){
                    $scope.equipFactory.updateEquip($scope.user, $scope.game, $scope.character, $scope.name, $scope.equipid, 'armor');
                }else {
                    alert("It looks like you already have armor equipped. Check your equipment.");
                }

                break;

            default:
                console.log("Something went wrong in switch");
        }

        $location.url('/main');
    };


    //set up function calls

    $scope.loadEquip();
    $scope.goldFactory.goldData($scope.user, $scope.game, $scope.character);
    $scope.equipFactory.allEquip($scope.user, $scope.game, $scope.character);
    $scope.equipFactory.allWeapon($scope.user, $scope.game, $scope.character);

}]);


myApp.controller('BankEquipmentController', ['$scope', '$http', 'TeamAndGame', 'EquipFactory', 'GoldFactory', '$location', function($scope, $http, TeamAndGame, EquipFactory, GoldFactory, $location){
    $scope.teamAndGame = TeamAndGame;
    $scope.equipFactory = EquipFactory;
    $scope.goldFactory = GoldFactory;
    $scope.selectedBankEquip = {};
    $scope.character = 'Syndrael';
    $scope.game;
    $scope.user;
    $scope.equipdescription;
    $scope.equiphand;
    $scope.equipname;
    $scope.equipgold;
    $scope.equipsell_gold;
    $scope.equipcharacter_gold;
    $scope.equipequipid;
    $scope.equipcategory;
    $scope.equiptype;
    $scope.equipexhaust;
    $scope.equipdice;

//Set up functions

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
            //console.log("You are in the if statement");
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
        $scope.selectedBankEquip=$scope.equipFactory.bankData();
        console.log("This is selected equip", $scope.selectedEquip);
        $scope.equipdescription = $scope.selectedBankEquip.description;
        console.log("Scope.description", $scope.equipdescription);
        $scope.equipname = $scope.selectedBankEquip.name;
        console.log("equipname", $scope.equipname);
        $scope.equiphand = $scope.selectedBankEquip.hand;
        $scope.equipgold = $scope.selectedBankEquip.gold;
        console.log("equipgold", $scope.equipgold);
        $scope.equipsell_gold = $scope.selectedBankEquip.sale_cost;
        $scope.equipid = $scope.selectedBankEquip.id;
        $scope.equipcategory = $scope.selectedBankEquip.category;
        console.log("equipcategory", $scope.equipcategory);
        $scope.equiptype = $scope.selectedBankEquip.type;
        $scope.equipdice = $scope.selectedBankEquip.dice;
        console.log("This is equipdice", $scope.equipdice);

        if($scope.selectedBankEquip.exhaust == true){
            $scope.equipexhaust = 'Yes';
        }else {
            $scope.equipexhaust = 'No';
        }

        console.log("This is exhaust", $scope.equipexhaust);
    };


    //User interactive functions


    $scope.findEquip = function(){
        $http.post('/equip/findEquip', {params: {"team": $scope.user, "game": $scope.game, "character": $scope.character, "id": $scope.equipid}}).then(function(){
            console.log("Item added to character's collection.");
            $location.url('/main');
        });
    };

    $scope.buyEquip = function(gold){
        var gold=parseInt(gold);
        $scope.equipcharacter_gold = parseInt($scope.goldFactory.goldData($scope.user, $scope.game, $scope.character));
        console.log("This is gold", gold);
        console.log("This is character gold with parseInt(aka factory)", $scope.equipcharacter_gold);
        $scope.equipcharacter_gold= $scope.equipcharacter_gold - gold;
        console.log("This is character_gold after sale", $scope.equipcharacter_gold);
        $scope.goldFactory.postGold($scope.user, $scope.game, $scope.character, $scope.equipcharacter_gold);

        $scope.findEquip();

    };

    //set up function calls

    $scope.loadEquip();
    $scope.goldFactory.goldData($scope.user, $scope.game, $scope.character);
    $scope.equipFactory.allEquip($scope.user, $scope.game, $scope.character);
    $scope.equipFactory.allWeapon($scope.user, $scope.game, $scope.character);

}]);

myApp.controller('CarryEquipmentController', ['$scope', '$http', 'TeamAndGame', 'EquipFactory', 'GoldFactory', '$location', function($scope, $http, TeamAndGame, EquipFactory, GoldFactory, $location){
    $scope.teamAndGame = TeamAndGame;
    $scope.equipFactory = EquipFactory;
    $scope.goldFactory = GoldFactory;
    $scope.carryEquip = {};
    $scope.character = 'Syndrael';
    $scope.game;
    $scope.user;
    $scope.carrydescription;
    $scope.carryhand;
    $scope.carryname;
    $scope.carrygold;
    $scope.carrysell_gold;
    $scope.carryid;
    $scope.carrycategory;
    $scope.carrytype;
    $scope.carryexhaust;
    $scope.carrydice;

//Set up functions

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
            //console.log("You are in the if statement");
            $http.get('/acts/getTeam').then(function(response){
                $scope.teamAndGame.retrieveData(response.data);
                $scope.user = $scope.teamAndGame.gameData();
            });

        }else{
            $scope.user = $scope.teamAndGame.gameData();
        }
    };

    $scope.getUser();

    $scope.loadCarryEquip = function(){
        $scope.carryEquip=$scope.equipFactory.currentData();
        console.log("THIS IS SELECTED EQUIP", $scope.carryEquip);
        $scope.carrydescription = $scope.carryEquip.description;
        $scope.carryname = $scope.carryEquip.name;
        $scope.carryhand = $scope.carryEquip.hand;
        $scope.carrygold = $scope.carryEquip.gold;
        $scope.carrysell_gold = $scope.carryEquip.sale_cost;
        $scope.carryid = $scope.carryEquip.id;
        $scope.carrycategory = $scope.carryEquip.category;
        $scope.carrytype = $scope.carryEquip.type;
        $scope.carrydice = $scope.carryEquip.dice;

        if($scope.carryEquip.exhaust == true){
            $scope.carryexhaust = 'Yes';
        }else {
            $scope.carryexhaust = 'No';
        }

    };


    //User interactive functions
    $scope.unequip = function(){
        console.log("Unequip function");
        var call = $scope.equipFactory.allEquip($scope.user, $scope.game, $scope.character);
        console.log("call", call);

        switch ($scope.carryname) {
            case ($scope.carryname=call.syndraelrh):
                $scope.carryhand='right_hand';
                break;

            case ($scope.carryname = call.syndraellh):
                $scope.carryhand='left_hand';
                break;

            case ($scope.carryname = call.syndraelbh):
                $scope.carryhand='two_hand';
                break;

            case ($scope.carryname = call.syndraelaccessory1):
                $scope.carryhand='acc1';
                break;

            case ($scope.carryname = call.syndraelaccessory2):
                $scope.carryhand='acc2';
                break;

            case ($scope.carryname = call.syndraelarmor):
               $scope.carryhand='armor';
                break;

            default:
                console.log("Switch error");
        }


        console.log("This is $scope.carryhand", $scope.carryhand);

        $http.post('/equip/unequip', {params:{"team": $scope.user, "game": $scope.game, "character": $scope.character, "id": $scope.carryid, "name": $scope.carryname, "hand": $scope.carryhand}}).then(function(){
            console.log("Equipment Removed");
        });
        $location.url('/main');
    };


    //set up function calls
    $scope.loadCarryEquip();
    $scope.goldFactory.goldData($scope.user, $scope.game, $scope.character);
    $scope.equipFactory.allEquip($scope.user, $scope.game, $scope.character);
    console.log("allEquip", $scope.equipFactory.allEquip($scope.user, $scope.game, $scope.character));
    $scope.equipFactory.allWeapon($scope.user, $scope.game, $scope.character);console.log("AllWeaon", $scope.equipFactory.allWeapon($scope.user, $scope.game, $scope.character));

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

        when('/bankequip', {
            templateUrl: "/assets/views/bankequip.html",
            controller: "BankEquipmentController",
            css: "/assets/styles/equip_styles.css"
        }).

        when('/carryequip', {
            templateUrl: "/assets/views/carryequip.html",
            controller: "CarryEquipmentController",
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
