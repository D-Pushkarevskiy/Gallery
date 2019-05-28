'use strict';

angular.module('galleryApp').controller('galleryPhotosController', [
    '$scope',
    'apiPhotosService',
    'localstorageService',
    function galleryPhotosController($scope, apiPhotosService, localstorageService) {

        // Default params
        // Direction of displayViewSize array
        var direct = '';
        // Default display view size value
        var defaultDVSize = 300;

        // Display view sizes array
        $scope.displayViewSizes = [300, 900];
        // Current display view size, default is first element of array or a default value
        $scope.currentSize = $scope.displayViewSizes[0] ? $scope.displayViewSizes[0] : defaultDVSize;
        $scope.favoritesIds = [];

        function init() {
            $scope.currentPage = localstorageService.get('currentPage', 1);
            $scope.currentLimit = localstorageService.get('currentLimit', 30);
            apiPhotosService.getPhotos($scope.currentPage, $scope.currentLimit)
                .then(function(response) {
                    $scope.photos = response.data;
                });
            $scope.favoritesIds = localstorageService.getObject('favIds');
            $scope.zoomImageOverlayHide();
        }

        init();

        // Toggle display view state
        $scope.toggleView = function() {
            // Index of current display size
            var currentIndex = $scope.displayViewSizes.indexOf($scope.currentSize);
            // Last index of sizes array
            var lastIndex = $scope.displayViewSizes.length - 1;

            // If first view state, direction is 'up' [0->, 1, 2]
            if (currentIndex === 0) {
                direct = 'up';
            }
            // If last view state, direction is 'down' [0, 1, <-2]
            else if (currentIndex === lastIndex) {
                direct = 'down';
            }

            // If direction is 'up', increase index, switch to next view state
            if (direct === 'up') {
                currentIndex++;
            }
            // If direction is 'down', decrease index, back to previous view state
            else if (direct === 'down') {
                currentIndex--;
            }

            // Set currentSize to the changed value
            $scope.currentSize = $scope.displayViewSizes[currentIndex];
        };

        $scope.setActiveCount = function(event, amount) {
            if (!event.target.classList.contains('active')) {
                document.querySelector('.active').classList.remove('active');
                event.target.classList.add('active');
                $scope.changeAmount(amount);
            }
        };

        $scope.changeAmount = function(amount) {
            $scope.currentLimit = amount;
            localstorageService.set('currentLimit', $scope.currentLimit);
            init();
        };

        $scope.isActiveCount = function(amount) {
            if (amount === +$scope.currentLimit) {
                return 'active';
            }
        };

        $scope.changePage = function(increment) {
            if (increment) {
                $scope.currentPage++;
            } else {
                $scope.currentPage--;
            }
            localstorageService.set('currentPage', $scope.currentPage);
            init();
            $scope.jumpToAnchor();
        };

        $scope.jumpToAnchor = function() {
            var top = document.getElementById('pagination-anchor').offsetTop;

            window.scrollTo(0, top);
        };

    }
]);
