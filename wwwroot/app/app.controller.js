(function () {
    'use strict';

    angular.module('app')
        .controller('AppController', AppController);

    AppController.$inject = ["_", "$rootScope"];
    
    function AppController(_, $rootScope) {
        var vm = this;
    }
})();