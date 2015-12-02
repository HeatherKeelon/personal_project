myApp.directive('gameProfile',
    function(){
        return{
            controller: 'GameController',
            restrict: "E",
            scope: {
                info: "="
            },
            templateUrl: "assets/views/templates/gameProfile.html"
        }
    });