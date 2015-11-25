myApp.directive('gameProfile',
    function(){
        return{
            restrict: "E",
            scope: {
                info: "="
            },
            templateUrl: "templates/gameProfile.html"
        }
    });