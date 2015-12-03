myApp.factory('EquipFactory', ["$http", function($http){

    var unequip = {};
    var bankequip = {};
    var currentequip = {};
    var total;

    //Current equipment on character from the main page.
    var getCurrentEquip = function (){
        return currentequip;
    };

    //Sets up current equipment.
    var currentEquip = function(team, game, character){
        currentequip.syndraelaccessory1;
        currentequip.syndraelaccessory2;
        currentequip.syndraelarmor;
        currentequip.syndraellh;
        currentequip.syndraelrh;
        currentequip.syndraelbh;
        $http.get('/main/syndraelEquip', {params: {"team": team, "game": game, "character": character}}).then(function(response){
            //console.log("This is response.data equip", response.data);

                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].acc1 == null) {
                        currentequip.syndraelaccessory1 = 'none';
                    } else {
                        currentequip.syndraelaccessory1 = response.data[i].acc1;
                    }

                    if (response.data[i].acc2 == null) {
                        currentequip.syndraelaccessory2 = 'none';
                    } else {
                        currentequip.syndraelaccessory2 = response.data[i].acc2;
                    }

                    if (response.data[i].armor == null) {
                        currentequip.syndraelarmor = 'none';
                    } else {
                        currentequip.syndraelarmor = response.data[i].armor;
                    }

                    if (response.data[i].left_hand == null) {
                        currentequip.syndraellh = 'none';
                    } else {
                        currentequip.syndraellh = response.data[i].left_hand;
                    }

                    if (response.data[i].right_hand == null) {
                        currentequip.syndraelrh = 'none';
                    } else {
                        currentequip.syndraelrh = response.data[i].right_hand;
                    }

                    if (response.data[i].two_hand == null) {
                        currentequip.syndraelbh = 'none';
                    } else {
                        currentequip.syndraelbh = response.data[i].two_hand;
                    }
                }
        });
        return currentequip;
    };

    //Handles pulling the type for weapons so that they can be compared to prevent users equipping too many weapons
    var equipJoin = function(team, game, character){

        var item=[];

        $http.get('/equip/equipJoin', {params: {"team": team, "game": game, "character": character}}).then(function(response){
            //console.log("This is response.data equip", response.data);


            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].name == response.data[i].right_hand){
                    item.push(parseInt(response.data[i].type));
                }else if(response.data[i].name == response.data[i].left_hand){
                    item.push(parseInt(response.data[i].type));
                }else if(response.data[i].name == responsde.data[i].two_hand){
                    item.push(parseInt(response.data[i].type));
                }

            }
            total = item[0] + item[1];
            //console.log(item);
            //console.log(total);
        });
        return item;
    };

    //The post that posts new equipment to the database, and on main page on refresh.
    var newEquip = function(team, game, character, name, id, hand){
        $http.post('/equip/newEquip', {params: {"team": team, "game": game, "character": character, "name": name, "id": id, "hand": hand}}).then(function(){
            console.log("New equipment posted");
        });
    };

    var getData = function(name){
        //var promise = $http.get('/games/teamandgame').then(function(response){
        //    console.log("this is response.data", response.data.chosen_game);
        //    game = response.data.chosen_game;

        bankequip = name;
        //console.log("This is equip from factory", bankequip);
        return bankequip;
    };

    var publicApi= {
        retrieveData: function(name){
            //console.log("In retrieveData");
            return getData(name);
        },

        gameData: function(){
            return bankequip;
        },

        allEquip: function(team, game, character){
            return currentEquip(team, game, character);
        },

        getEquip: function(){
            return getCurrentEquip();
        },

        getTotalWeapon: function(){
            //console.log("Made it into getTotalWeapon");
            return total;
        },

        allWeapon: function(team, game, character){
            return equipJoin(team, game, character);
        },

        updateEquip: function(team, game, character, name, id, hand){
            console.log("In updateEquip", team, game, character, name, id, hand);
            return newEquip(team, game, character, name, id, hand);
        }


    };

    return publicApi;
}]);