'use strict';

angular.module('galleryApp').controller('favoritesController', [
    '$scope',
    function favoritesController($scope) {

        function getPhotosUrl(ids) {
            var photosUrl = [];
            var index;
            var id;

            for (index = 0; index < ids.length; index++) {
                id = ids[index];
                photosUrl.push('https://picsum.photos/id/' + id + '/1200/1200');
            }

            return photosUrl.reverse();
        }

        function init() {
            $scope.ids = $scope.favoritesIds;
            $scope.photosUrl = getPhotosUrl($scope.ids);
            $scope.zoomImageOverlayHide();
        }

        init();
    }
]);
