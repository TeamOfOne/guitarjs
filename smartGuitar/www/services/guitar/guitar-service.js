(function() {
    'use strict';

    angular.module('app')
        .factory('GuitarPlayer', GuitarService);


    GuitarService.$inject = [];

    function GuitarService() {
        var guitar2 = new Guitar2();

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

        // internal
        var audioContext = getAudioContext();




        // external api
        var service = {
            strings: strings,
            playChord: playChord,
            strumChord: strumChord,
            getSingleNote: getSingleNote,
            getChord: getChord,
            getPositionsForChord: getPositionsForChord
        };

        // internal
        var audioContext = getAudioContext();

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


        function getSingleNote(score)
        {
          var extracted_note = guitar2.noteOnPos(score);
          if(extracted_note != null)
          {
            return extracted_note.simple();
          }
          else
          {
            return ""
          }
        }

        function getChord(score)
        {
          var ex_chord = guitar2.chordFromFingerPos(score);
          if(ex_chord != null)
          {
            return ex_chord.notation(0);
          }
          else
          {
            return ""
          }
        }

        function getPositionsForChord(chord)
        {
            var ch = GuitarJS.ChordJS.create(chord);
            if (ch.notes != undefined ) {
                while(ch.has_next()) {
                  var positions = ch.next();
                  var fretl5= true;
                  for (var fret_pos in positions) {
                    if (positions[fret_pos]>5){
                        fretl5=false;
                        break;
                    }
                  }
                  if (fretl5)
                    return positions;
                  else
                    continue;
                }
                return null
            }
            else {
                return null
            }
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