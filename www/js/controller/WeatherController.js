var app = angular.module('app', ['ngRoute']);

     app.controller('WeatherController', ['$scope', function($scope) {

         $scope.city = "allo";

         $scope.search = function(){

             var url = "http://api.openweathermap.org/data/2.5/weather?q=" + $scope.city + "&appid=b1b15e88fa797225412429c1c50c122a";

             $http.get(url).success(httpSuccess).error(function() {
                 alert("Impossible d'accéder aux informations");
             });
         };

         httpSuccess = function(response){
             $scope.weather = response;
         }
     }]);