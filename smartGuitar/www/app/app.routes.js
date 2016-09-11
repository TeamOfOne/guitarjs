(function () {
    'use strict';

    angular.module('app')
        .config(defineRoutes);

    defineRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];

    function defineRoutes ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.search', {
                url: '/search',
                views: {
                'menuContent': {
                    templateUrl: 'templates/search.html'
                }
                }
            })
            .state('app.browse', {
                url: '/browse',
                views: {
                    'menuContent': {
                    templateUrl: 'templates/browse.html'
                    }
                }
                })
            .state('app.playlists', {
                url: '/playlists',
                views: {
                    'menuContent': {
                    templateUrl: 'playlists/playlists.html',
                    controller: 'PlaylistsCtrl'
                    }
                }
                })

            .state('app.single', {
                url: '/playlists/:playlistId',
                views: {
                'menuContent': {
                    templateUrl: 'playlist/playlist.html',
                    controller: 'PlaylistCtrl'
                }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/playlists');
    }
})();