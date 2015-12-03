myApp.factory('GoldFactory', ["$http", function($http){

    var gold=undefined;



    var getGold = function(team, game, character){
        console.log("You have entered getGold function");
        $http.get('/acts/getGold', {params:{"team": team, "game": game, "character": character}}).then(function(response) {
            gold = response.data;
            console.log("This is gold in the factory", gold);

        });
        console.log("This is gold outside promise variable", gold);
        return gold;
    };

    var updateGold = function(team, game, character, newgold){
        console.log("You have entered updateGold function.");
        console.log("This is newgold to post", newgold);
        $http.post('/acts/updateGold', {params:{"team": team, "game": game, "character": character, "gold": newgold}}).then(function(){
            gold = newgold;
            console.log("This is gold in factory after update", gold);
        });
        return gold;
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