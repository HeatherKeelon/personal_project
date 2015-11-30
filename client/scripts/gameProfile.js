myApp.directive('gameProfile',
    function(){
        return{
            controller: 'GameController',
            restrict: "E",
            scope: {
                info: "="
            },
            templateUrl: "templates/gameProfile.html"
        }
    });