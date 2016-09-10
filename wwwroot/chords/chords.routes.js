(function () {
    'use strict';

    angular.module('app')
        .config(chordsRouteConfig);

    chordsRouteConfig.$inject = ["$stateProvider"];

    function chordsRouteConfig ($stateProvider) {
        $stateProvider
            .state('chords', {
                url: '/chords',
                views: {
                    "centerView@": {
                        templateUrl : 'chords/chords.html',
                        controller  : 'ChordsController',
                        controllerAs: 'chordsCtrl'
                    }
                }
            });
    }

})();
