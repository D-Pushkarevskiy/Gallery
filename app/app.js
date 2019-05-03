let galleryApp = angular.module('galleryApp', ['ngRoute', 'ngAnimate'])
    .config(function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'galleryPhotosController'
        });
        $routeProvider.when('/favorites', {
            templateUrl: 'views/favorites.html',
            controller: 'favoritesController'
        });
        $routeProvider.when('/random', {
            templateUrl: 'views/random.html',
            controller: 'randomPhotoController'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    });

galleryApp.config(function ($httpProvider, $routeProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    $routeProvider
        .when('/404/', {
            templateUrl: 'views/404.html'
        });
});

galleryApp.controller('mainController', function mainController($scope, $location, localstorageService) {

    init();

    function init() {
        $scope.favoritesIds = localstorageService.getObject('favIds');

        $scope.isFavorite = function (id) {
            if ($scope.favoritesIds.indexOf(id) != -1) {
                return 'color-red favorited';
            };
        }

        $scope.zoomImage = function (event, FullSizePhotoUrl) {

            let currentSrc = event.target.getAttribute('src');

            if (!event.target.classList.contains('zoomed-img')) {
                // Zoom img
                event.target.setAttribute('prev_src', currentSrc);
                event.target.setAttribute('src', FullSizePhotoUrl);
                $scope.zoomImageOverlay(allow = true);
                setTimeout(function () {
                    event.target.classList.add('zoomed-img');
                    event.target.classList.remove('allow-transition');
                }, 500);
            } else {
                // Unzoom img
                let prevSrc = event.target.getAttribute('prev_src');
                event.target.setAttribute('src', prevSrc);
                event.target.removeAttribute('prev_src');
                event.target.classList.remove('zoomed-img');
                $scope.zoomImageOverlay(allow = false);
                setTimeout(function () {
                    event.target.classList.add('allow-transition');
                }, 100);
            }
        }

        $scope.toggleFavorite = function (event, id) {
            if (!event.target.classList.contains('favorited')) {
                event.target.classList.add('color-red,favorited');
                $scope.favoritesIds.push(id);
            } else {
                event.target.classList.remove('color-red,favorited');
                $scope.favoritesIds.splice($scope.favoritesIds.indexOf(id), 1);
            }
            localstorageService.setObject('favIds', $scope.favoritesIds);
        }

        $scope.closeOverlay = function () {
            document.querySelector('.zoomed-img').click();
        }

        $scope.isActiveRoute = function (routeName) {
            if($location.path() === routeName){
                return 'activeRoute';
            } else {
                return '';
            }
        }

    }

    $scope.zoomImageOverlay = function (state) {
        if (state) {
            $scope.overlay = true;
            document.querySelector('body').classList.add('stop-scroll');
        } else {
            $scope.overlay = false;
            document.querySelector('body').classList.remove('stop-scroll');
        }
    }
});

galleryApp.controller('randomPhotoController',
    function favoritesController($scope, apiPhotosService) {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        $scope.init = function () {
            // For loading
            $scope.randPhoto = 0;
            apiPhotosService.getPhotos(getRandomInt(1, 10), 100)
                .then(function (response) {
                    $scope.randPhoto = response.data[getRandomInt(1, 100)];
                });
            $scope.zoomImageOverlay(allow = false);
        }

        $scope.init();
    });

galleryApp.controller('favoritesController',
    function favoritesController($scope) {

        init();

        function init() {
            $scope.ids = $scope.favoritesIds;
            $scope.photosUrl = getPhotosUrl($scope.ids);
            $scope.zoomImageOverlay(allow = false);
        }

        function getPhotosUrl(ids) {
            let photosUrl = [];
            for (let index = 0; index < ids.length; index++) {
                const id = ids[index];
                photosUrl.push('https://picsum.photos/id/' + id + '/1200/1200');
            }
            return photosUrl.reverse();
        }
    });

galleryApp.controller('galleryPhotosController',
    function galleryPhotosController($scope, apiPhotosService, localstorageService) {

        // Default params
        $scope.toggleSize = 2;
        $scope.viewSize = 'ico-more';
        $scope.favoritesIds = [];

        init();

        function init() {
            $scope.currentPage = localstorageService.get('currentPage', 1);
            $scope.currentLimit = localstorageService.get('currentLimit', 30);
            apiPhotosService.getPhotos($scope.currentPage, $scope.currentLimit)
                .then(function (response) {
                    $scope.photos = response.data;
                });
            $scope.favoritesIds = localstorageService.getObject('favIds');
            $scope.zoomImageOverlay(allow = false);
        };

        $scope.toggleView = function () {
            if ($scope.toggleSize === 3) {
                $scope.toggleSize--;
                $scope.viewSize = 'ico-more';
            } else {
                $scope.toggleSize++;
                $scope.viewSize = 'ico-less';
            }
        }

        $scope.setActiveCount = function (event, amount) {
            if (!event.target.classList.contains('active')) {
                document.querySelector('.active').classList.remove('active');
                event.target.classList.add('active');
                $scope.changeAmount(amount);
            }
        }

        $scope.changeAmount = function (amount) {
            $scope.currentLimit = amount;
            localstorageService.set('currentLimit', $scope.currentLimit);
            init();
        }

        $scope.isActiveCount = function (amount) {
            if (amount === +$scope.currentLimit) {
                return 'active';
            }
        }

        $scope.changePage = function (increment) {
            increment ? $scope.currentPage++ : $scope.currentPage--;
            localstorageService.set('currentPage', $scope.currentPage);
            init();
            $scope.jumpToAnchor();
        }

        $scope.jumpToAnchor = function () {
            const top = document.getElementById('pagination-anchor').offsetTop;
            window.scrollTo(0, top);
        }

    });

function deletePhotoUrlSize(url) {
    if (!url) {
        return false;
    }
    let changedInp = url.split('/');
    changedInp.splice(-2, 2);
    url = changedInp.join('/');
    return url;
}

galleryApp.filter('minimizeSize', function () {
    return function (url) {
        url = deletePhotoUrlSize(url);
        return url + '/300/300';
    }
});

galleryApp.filter('mediumSize', function () {
    return function (url) {
        url = deletePhotoUrlSize(url);
        return url + '/500/500';
    }
});

// Not used, but for future
galleryApp.filter('largeSize', function () {
    return function (url) {
        url = deletePhotoUrlSize(url);
        return url + '/800/800';
    }
});