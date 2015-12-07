myApp.factory('ExperienceFactory', ["$http", function($http){

    var experience=0;



    var getExperience = function(team, game, character){
        console.log("You have entered getGold function");
        $http.get('/acts/getExperience', {params:{"team": team, "game": game, "character": character}}).then(function(response) {
            experience = response.data;
            console.log("This is experience in the factory", experience);

        });
        console.log("This is gold outside promise variable", gold);
        return gold;
    };

    var updateExperience = function(team, game, character, newexp){
        console.log("You have entered updateExp function.");
        console.log("This is exp coming in", newexp);
        var updateexp = parseInt(experience) + parseInt(newexp);
        experience=updateexp;
        console.log("This is updated exp", updateexp);
        $http.post('/acts/updateExperience', {params:{"team": team, "game": game, "character": character, "exp": updateexp}}).then(function(){
            //console.log("You are in the callback function of update Exp");
            //experience = parseInt(experience) + parseInt(newexp);
            console.log("This is exp in factory after update", experience);
        });
        return experience;
    };


    var publicApi= {
        postExp: function(team, game, character, exp){
            console.log("In postExp");
            return updateExperience(team, game, character, exp);
        },

        expData: function(team, game, character){
            return getExperience(team, game, character);
        },

        giveExp: function(){
            return experience;
        }


    };

    return publicApi;
}]);