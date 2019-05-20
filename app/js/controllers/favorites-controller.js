'use strict';

angular.module('galleryApp').controller('favoritesController', [
    '$scope',
    function favoritesController($scope) {
        function init() {
            $scope.ids = $scope.favoritesIds;
            $scope.photosUrl = getPhotosUrl($scope.ids);
            $scope.zoomImageOverlayHide();
        }

        init();

        function getPhotosUrl(ids) {
            var photosUrl = [];
            for (var index = 0; index < ids.length; index++) {
                var id = ids[index];
                photosUrl.push('https://picsum.photos/id/' + id + '/1200/1200');
            }
            return photosUrl.reverse();
        }
    }
]);