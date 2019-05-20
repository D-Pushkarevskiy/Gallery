'use strict';

angular.module('galleryApp').controller('mainController', [
    '$scope',
    '$location',
    'localstorageService',
    function mainController($scope, $location, localstorageService) {

        function init() {
            $scope.favoritesIds = localstorageService.getObject('favIds');

            $scope.isFavorite = function (id) {
                if ($scope.favoritesIds.indexOf(id) != -1) {
                    return 'color-red favorited';
                }
            };

            $scope.zoomImage = function (event, FullSizePhotoUrl) {

                var currentSrc = event.target.getAttribute('src');

                if (!event.target.classList.contains('zoomed-img')) {
                    // Zoom img
                    event.target.setAttribute('prev_src', currentSrc);
                    event.target.setAttribute('src', FullSizePhotoUrl);
                    $scope.zoomImageOverlayShow();
                    setTimeout(function () {
                        event.target.classList.add('zoomed-img');
                        event.target.classList.remove('allow-transition');
                    }, 500);
                } else {
                    // Unzoom img
                    var prevSrc = event.target.getAttribute('prev_src');
                    event.target.setAttribute('src', prevSrc);
                    event.target.removeAttribute('prev_src');
                    event.target.classList.remove('zoomed-img');
                    $scope.zoomImageOverlayHide();
                    setTimeout(function () {
                        event.target.classList.add('allow-transition');
                    }, 100);
                }
            };

            $scope.toggleFavorite = function (event, id) {
                if (!event.target.classList.contains('favorited')) {
                    event.target.classList.add('color-red,favorited');
                    $scope.favoritesIds.push(id);
                } else {
                    event.target.classList.remove('color-red,favorited');
                    $scope.favoritesIds.splice($scope.favoritesIds.indexOf(id), 1);
                }
                localstorageService.setObject('favIds', $scope.favoritesIds);
            };

            $scope.closeOverlay = function () {
                document.querySelector('.zoomed-img').click();
            };

            $scope.isActiveRoute = function (routeName) {
                if ($location.path() === routeName) {
                    return 'active-route';
                } else {
                    return '';
                }
            };

        }

        init();

        $scope.zoomImageOverlayShow = function () {
            $scope.overlay = true;
            document.querySelector('body').classList.add('stop-scroll');
        };

        $scope.zoomImageOverlayHide = function () {
            $scope.overlay = false;
            document.querySelector('body').classList.remove('stop-scroll');
        };

    }
]);