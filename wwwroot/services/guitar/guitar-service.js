(function() {
    'use strict';

    angular.module('app')
        .factory('GuitarPlayer', GuitarPlayer);


    GuitarPlayer.$inject = [];


    function GuitarPlayer() {
        var audioContext = getAudioContext();


        console.log('Audio context grabbed:', audioContext);

        var service = {
            playChord: playChord
        };


        function playChord() {
            guitar.strumChord(0, true, 1, Guitar.C_MAJOR);
        }


        // Internal methods
        var errorText = document.getElementById("guitarErrorText");

        if (audioCtx === null) {
          //  errorText.innerHTML =
          //      "Error obtaining audio context. Does your browser support Web Audio?";
        } else {
           // errorText.style.display = "none";
           // var guitarControls = document.getElementById("guitarControls");
           // guitarControls.style.display = "block";

            guitar = new Guitar(audioCtx, audioCtx.destination);
        }



        return service;
    };



    function getAudioContext() {
        if ('localAudioContext' in window) {
            return window.localAudioContext;
        }

        var constructor;
        var error;
        if ('AudioContext' in window) {
            // Firefox, Chrome
            constructor = window.AudioContext;
        } else if ('webkitAudioContext' in window) {
            // Safari
            constructor = window.webkitAudioContext;
        } else {
            return null;
        }

        var audioContext = new constructor();
        window.localAudioContext = audioContext;
        return audioContext;
    }


}());