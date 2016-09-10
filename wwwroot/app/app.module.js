(function () {
    'use strict';

    angular.module('app', ['ui.router' ])
           
           .constant('_', window._)
           
           //use in views, ng-repeat="x in _.range(3)"
           
           .run(function ($rootScope) {
                $rootScope._ = window._;
           });;
})();

