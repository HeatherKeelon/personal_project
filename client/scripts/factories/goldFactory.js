myApp.factory('GoldFactory', ["$http", function($http){

    var gold=undefined;



    var getGold = function(team, game, character){
        var promise = $http.get('/acts/getGold', {params:{"team": team, "game": game, "character": character}}).then(function(response) {
            console.log("this is response.data", response.data);
            gold = response.data;
            console.log("This is gold in the factory", gold);

        });
        return promise;
    };

    var updateGold = function(team, game, character, newgold){
        var promise = $http.get('/acts/updateGold', {params:{"team": team, "game": game, "character": character, "gold": newgold}}).then(function(response){
            gold = newgold;
        });
        return promise;
    };


    var publicApi= {
        postGold: function(team, game, character, gold){
            console.log("In retrieveData");
            return updateGold(team, game, character, gold);
        },

        goldData: function(team, game, character){
            return getGold(team, game, character);
        }


    };

    return publicApi;
}]);