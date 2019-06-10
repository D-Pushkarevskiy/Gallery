'use strict';

angular.module('galleryApp').factory('httpRequestInterceptor', ['$q', '$location', function($q, $location) {
    return {
        'responseError': function(rejection) {
            // do something on error
            if (rejection.status === 404) {
                $location.path('/404/');
            }

            return $q.reject(rejection);
        }
    };
}]);
