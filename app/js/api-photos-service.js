galleryApp.factory('apiPhotosService', function ($http) {
    let factory = {};

    factory.getPhotos = function (page, limit) {
        return $http.get('https://picsum.photos/v2/list?page=' + page + '&limit=' + limit);
    };

    return factory;
});