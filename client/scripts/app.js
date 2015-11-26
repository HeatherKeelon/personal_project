var myApp = angular.module("myApp", []);

myApp.controller('GameController', ['$scope', '$http',  function($scope, $http){

    $scope.user = {};
    $scope.currentGame=["no current games"];
    $scope.numberGames = currentGame.length;


    $scope.getTeam = function(){
        console.log("you are in getTeam");
        $http.post('/games/retrieveteam').then(function(response){
            $scope.user = response.data;
            console.log($scope.user);
        });
    };

    //$scope.refreshGames = function(){
    //    $http.get('/games/refreshGames').then(function(response){
    //        console.log(response);
    //        console.log($scope.numberGames);
    //    });
    //};


    $scope.getTeam();


}]);