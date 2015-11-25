var myApp = angular.module("myApp", []);

myApp.controller('GameController', ['$scope', '$http',  function($scope, $http){

    $scope.user = {};
    $scope.currentGame=[];


    $scope.getTeam = function(){
        console.log("you are in getTeam");
        $http.post('/games/retrieveteam').then(function(response){
            $scope.user = response.data;
            console.log($scope.user);
        });
    };


    $scope.getTeam();


}]);