(function () {
    'use strict';

    angular.module('app')
        .config(defineRoutes);

    defineRoutes.$inject = ["$stateProvider"];

    function defineRoutes ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    "centerView@": {
                        templateUrl : 'app/app.html',
                        controller  : 'AppController',
                        controllerAs: 'appCtrl'
                    }
                }
            });
    }

})();