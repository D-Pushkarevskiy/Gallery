'use strict';

angular.module('galleryApp', [
    'ngRoute',
    'ngAnimate'
]);

angular.module('galleryApp').config([
    '$routeProvider',
    '$httpProvider',
    function($routeProvider, $httpProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html.tmpl',
            controller: 'galleryPhotosController'
        });
        $routeProvider.when('/favorites', {
            templateUrl: 'views/favorites.html.tmpl',
            controller: 'favoritesController'
        });
        $routeProvider.when('/random', {
            templateUrl: 'views/random.html.tmpl',
            controller: 'randomPhotoController'
        });
        $routeProvider.when('/404/', {
            templateUrl: 'views/404.html.tmpl'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });

        $httpProvider.interceptors.push('httpRequestInterceptor');
    }
]);

angular.module('galleryApp').filter('setSize', function() {
    // https://picsum.photos/id/integer
    var reg = /https:\/\/picsum\.photos\/id\/[0-9]+\/*/i;

    return function(url, size) {
        // if url is not a - https://picsum.photos/id/integer
        if (!reg.test(url)) {
            return url;
        }

        return url.match(reg) + size;
    };
});
