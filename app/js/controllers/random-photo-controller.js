'use strict';

angular.module('galleryApp').controller('randomPhotoController', [
    '$scope',
    'apiPhotosService',
    function favoritesController($scope, apiPhotosService) {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        $scope.init = function() {
            // For loading
            $scope.randPhoto = 0;
            apiPhotosService.getPhotos(getRandomInt(1, 10), 100)
                .then(function(response) {
                    $scope.randPhoto = response.data[getRandomInt(1, 100)];
                });
            $scope.zoomImageOverlayHide();
        };

        $scope.init();
    }
]);
