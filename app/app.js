'use strict';

angular.module('galleryApp', [
    'ngRoute',
    'ngAnimate',
    'cfp.loadingBarInterceptor'
]);

angular.module('galleryApp').config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
}]);

angular.module('galleryApp').directive('loading', ['$http', function($http) {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            scope.isLoading = function() {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function(v) {
                if (v) {
                    attrs.$addClass('main-loading');
                } else {
                    attrs.$removeClass('main-loading');
                }
            });
        }
    };

}]);

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
