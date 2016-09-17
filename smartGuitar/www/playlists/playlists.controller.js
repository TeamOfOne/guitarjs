(function () {
    'use strict';

    angular.module('app')
        .controller('PlaylistsCtrl', PlaylistsCtrl);

    PlaylistsCtrl.$inject = ["_", "$rootScope", "$scope", "$timeout", "$ionicModal"];
    
    function PlaylistsCtrl(_, $rootScope, $scope, $timeout, $ionicModal) {
                
        $scope.playlists = [
            //{ title: 'Reggae', id: 1 },
            //{ title: 'Chill', id: 2 },
            //{ title: 'Dubstep', id: 3 },
            //{ title: 'Indie', id: 4 },
            //{ title: 'Rap', id: 5 },
            //{ title: 'Cowbell', id: 6 }
        ];

        $scope.addSong = function () {
            console.log("adding a song, please fill title, and artist");
        }

        // Form data for the login modal
        $scope.songData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('playlists/playlist-add.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeAddSong = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.addSong = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doAdd = function() {
            console.log('Adding a song', $scope.songData);

            var songdata = angular.copy($scope.songData);
            var songobj = { title: songdata.title, id : $scope.playlists.length + 1 };
            
            $scope.playlists.push(songobj);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeAddSong();
                $scope.songData = {};

                window.location = "#/app/playlists/" + songobj.id + "/" + songobj.title;
                
            }, 100);
        };
    }
})();
