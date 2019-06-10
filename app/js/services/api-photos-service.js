'use strict';

angular.module('galleryApp').factory('apiPhotosService', ['$http', function ($http) {
    var factory = {};

    factory.getPhotos = function (page, limit) {
        return $http.get('https://picsum.photos/v2/list?page=' + page + '&limit=' + limit);
    };

    return factory;
}]);
