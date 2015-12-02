myApp.factory('TeamAndGame', ["$http", function($http){

var team = undefined;
var gameNumber = 0;


    var getData = function(name){
        //var promise = $http.get('/games/teamandgame').then(function(response){
        //    console.log("this is response.data", response.data.chosen_game);
        //    game = response.data.chosen_game;

           team = name;
        console.log("This is team from factory", team);
        return team;
    };

    var publicApi= {
        retrieveData: function(name){
            console.log("In retrieveData");
            return getData(name);
        },

        gameData: function(){
            return team;
        },

        gameNumber: team
    };

    return publicApi;
}]);