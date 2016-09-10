(function () {
    'use strict';

    angular.module('app')
        .controller('AppController', AppController);

    AppController.$inject = ["_"];
    
    function AppController(_) {
        var vm = this;
    }
})();