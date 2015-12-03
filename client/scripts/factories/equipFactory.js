myApp.factory('EquipFactory', ["$http", function($http){

    var unequip = {};
    var bankequip = {};



    var getData = function(name){
        //var promise = $http.get('/games/teamandgame').then(function(response){
        //    console.log("this is response.data", response.data.chosen_game);
        //    game = response.data.chosen_game;

        bankequip = name;
        console.log("This is team from factory", bankequip);
        return bankequip;
    };

    var publicApi= {
        retrieveData: function(name){
            console.log("In retrieveData");
            return getData(name);
        },

        gameData: function(){
            return bankequip;
        }


    };

    return publicApi;
}]);