(function() {
    'use strict';

    angular.module('app')
        .factory('GuitarPlayer', GuitarPlayer);


    GuitarPlayer.$inject = [];


    function GuitarPlayer() {

        // external api
        var service = {
            playChord: playChord
        };

        // internal
        var audioContext = getAudioContext();
        var strings = [
            // arguments are:
            // - audio context
            // - string number
            // - octave
            // - semitone
            new GuitarString(audioCtx, audioCtx.destination, 0, 2, 4),   // E2
            new GuitarString(audioCtx, audioCtx.destination, 1, 2, 9),   // A2
            new GuitarString(audioCtx, audioCtx.destination, 2, 3, 2),   // D3
            new GuitarString(audioCtx, audioCtx.destination, 3, 3, 7),   // G3
            new GuitarString(audioCtx, audioCtx.destination, 4, 3, 11),  // B3
            new GuitarString(audioCtx, audioCtx.destination, 5, 4, 4)    // E4
        ];

        function strumChord(time, downstroke, velocity, chord) {
            var pluckOrder;
            if (downstroke === true) {
                pluckOrder = [0, 1, 2, 3, 4, 5];
            } else {
                pluckOrder = [5, 4, 3, 2, 1, 0];
            }

            for (var i = 0; i < 6; i++) {
                var stringNumber = pluckOrder[i];
                if (chord[stringNumber] != -1) {
                    strings[stringNumber].pluck(time, velocity, chord[stringNumber]);
                }
                time += Math.random() / 128;
            }
        }

        function playChord(downstroke, chord) {
            strumChord(0, downstroke, 1, chord);
        }

        return service;
    }



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