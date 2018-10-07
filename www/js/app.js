document.addEventListener('deviceready', function () {
    // Code au lancement de l'appli
    navigator.splashscreen.hide();
}, false);

var app = angular.module('app', ['ngRoute']);

// $window pour acces au navigateur | $rootScope = root utilisé lors du lancement du service (service = factory)
app.factory('GeolocationService', function ($window, $q, $rootScope) {

    var geolocation = $window.navigator.geolocation;

    //  retourne un objet avec methode getCurrentPosition
    return {
        getCurrentPosition: function () {

            var defer = $q.defer();

            geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function () {
                    defer.resolve(position);
                });
            }, function () {
                $rootScope.$apply(function () {
                    defer.reject();
                });
            });
            return defer.promise;
        }
    };
});

// Config routes
app.config(function ($routeProvider) {
    $routeProvider
            .when('/home', {templateUrl: 'partials/home.html'})
            .when('/about', {templateUrl: 'partials/about.html'})
            .otherwise({redirectTo: '/home'});
});

// Controller de navigation
app.controller("PanelController", function () {

    this.tab = 'home';

    this.selectTab = function (setTab) {
        this.tab = setTab;
    };
    this.isSelected = function (checkTab) {
        return this.tab === checkTab;
    };

});

/*Weather Controller*/
app.controller('WeatherController', ['$scope', '$http', 'GeolocationService', function ($scope, $http, GeolocationService) {

        $scope.panel = 0;

        $scope.search = function () {
            /*url appellée lors de la soumission du formulaire*/
            /*$scope.city = ville renseignée par l'utilisateur*/
            var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + $scope.city + "&cnt=7&mode=json&units=metric&lang=fr&APPID=049f9edd42bc42e8cd637065d7fa5cf7";
            $scope.loader = true;

            /*$http = objet angular pr faire requetes http*/
            $http.get(url).success(httpSuccess).error(httpError());
        };

        $scope.expand = function (e) {
//	$elem est un element jquery
            $elem = $(e.currentTarget);
            $elem.addClass('row_active').siblings().removeClass('row_active');
        };

//  Geolocalisation - Il faut au préalable charger en ligne de commandes l'api dans le dossier du projet
        $scope.geolocate = function () {
            $scope.loader = true;
            GeolocationService.getCurrentPosition().then(function (position) {
                $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&mode=json&units=metric&cnt=7&APPID=049f9edd42bc42e8cd637065d7fa5cf7").success(httpSuccess).error(httpError);
            }, function () {
                alert('Acquisition de la position impossible');
            });
        };

        httpSuccess = function (response) {
            $scope.panel = 1;
            $scope.loader = false;
            $scope.weather = response;
        };

        httpError = function () {
            $scope.loader = false;
            alert('Impossible de récupérer les infos');
        };

        //$scope.city = "Strasbourg"; //Ville par défault
        // Faut passer la fonction globale Math au scope pour pouvoir l'utiliser dans la vue
        $scope.Math = Math;
        //$scope.search();

    }]);

