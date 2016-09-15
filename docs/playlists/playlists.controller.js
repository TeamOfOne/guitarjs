(function () {
    'use strict';

    angular.module('app')
        .controller('PlaylistsCtrl', PlaylistsCtrl);

    PlaylistsCtrl.$inject = ["_", "$rootScope", "$scope"];
    
    function PlaylistsCtrl(_, $rootScope, $scope) {
                
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    }
})();
