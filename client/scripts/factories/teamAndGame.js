myApp.factory('TeamAndGame', ["$http", function($http){

var game = undefined;
var gameNumber = 0;


    var getData = function(){
        var promise = $http.get('/games/teamandgame').then(function(response){
            console.log("this is response.data", response.data.chosen_game);
            game = response.data.chosen_game;

        });
        return promise;
    };

    var publicApi= {
        retrieveData: function(){
            console.log("In retrieveData");
            return getData();
        },

        gameData: function(){
            return game;
        },

        gameNumber: gameNumber
    };

    return publicApi;
}]);