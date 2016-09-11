/**
 * Created by fjsnogueira on 01/07/2016.
 */
(function () {
    'use strict';

    angular.module('app')
        .controller('ChordsController', ChordsController);

    ChordsController.$inject = ["_", "$rootScope", '$timeout', 'GuitarPlayer'];
    function ChordsController(_, $rootScope, $timeout,  GuitarPlayer) {
        var vm = this;

        //instance variables                             
        vm.showSvg = true;
        vm.gap = 20;

        //
        vm.stringGap = 20;
        vm.numberOfStrings = 6;
        vm.numberOfFrets = 5;

        //strings setup
        vm.line_stroke = 'black';
        vm.line_stroke_width = 2;

        //circles setup
        vm.circle_l_r            = 5;
        vm.circle_l_stroke       = 'transparent';
        vm.circle_l_stroke_width = 3;
        vm.circle_l_fill         = 'black';


        // Controller api
        vm.clickCircle = clickCircle;
        vm.playChord = playChord;
        vm.playSong = startGuitarPlaying;

        vm.playing = false;
        vm.delta = 1;

        var timeUnit = 0.12;

// Create sound samples for the current part of the strum sequence,
// and queue generation of sound samples of the following part.
// The rhythms parts have as fine a granularity as possible to enable
// adjustment of guitar parameters with real-time feedback.
// (The higher strumGenerationsPerRun, the longer the delay between
//  parameter adjustments and samples created with the new parameters.)
        function queueStrums(sequenceN, blockStartTime, chordIndex, precacheTime) {
            var chords = _.map(vm.score, function (s) {
                return s.strings
            });

             if (!vm.playing) {
                return;
             }


            var curStrumStartTime;

            var chord = chords[chordIndex];

            function highlighChord(i, delta) {
                _.each(vm.score, function (strings, index) {
                    var playing = index == i;
                    _.each(strings, function (string) {
                        _.each(string, function (c) {
                            c.playing = playing;
                        });
                    });
                });



                console.log('[Delta:'  + delta + ', Playing #chord:', i);
            }


            switch (sequenceN % 13) {
                case 0:
                    curStrumStartTime = blockStartTime + timeUnit * 0;


                    GuitarPlayer.strumChord(curStrumStartTime, true, 1.0, chord);
                    break;
                case 1:
                    curStrumStartTime = blockStartTime + timeUnit * 4;
                    GuitarPlayer.strumChord(curStrumStartTime, true, 1.0, chord);
                    break;
                case 2:
                    curStrumStartTime = blockStartTime + timeUnit * 6;
                    GuitarPlayer.strumChord(curStrumStartTime, false, 0.8, chord);
                    break;
                case 3:
                    curStrumStartTime = blockStartTime + timeUnit * 10;
                    GuitarPlayer.strumChord(curStrumStartTime, false, 0.8, chord);
                    break;
                case 4:
                    curStrumStartTime = blockStartTime + timeUnit * 12;
                    GuitarPlayer.strumChord(curStrumStartTime, true, 1.0, chord);
                    break;
                case 5:
                    curStrumStartTime = blockStartTime + timeUnit * 14;
                    GuitarPlayer.strumChord(curStrumStartTime, false, 0.8, chord);
                    break;
                case 6:
                    curStrumStartTime = blockStartTime + timeUnit * 16;
                    GuitarPlayer.strumChord(curStrumStartTime, true, 1.0, chord);
                    break;
                case 7:
                    curStrumStartTime = blockStartTime + timeUnit * 20;
                    GuitarPlayer.strumChord(curStrumStartTime, true, 1.0, chord);
                    break;
                case 8:
                    curStrumStartTime = blockStartTime + timeUnit * 22;
                    GuitarPlayer.strumChord(curStrumStartTime, false, 0.8, chord);
                    break;
                case 9:
                    curStrumStartTime = blockStartTime + timeUnit * 26;
                    GuitarPlayer.strumChord(curStrumStartTime, false, 0.8, chord);
                    break;
                case 10:
                    curStrumStartTime = blockStartTime + timeUnit * 28;
                    GuitarPlayer.strumChord(curStrumStartTime, true, 1.0, chord);
                    break;
                case 11:
                    curStrumStartTime = blockStartTime + timeUnit * 30;
                    GuitarPlayer.strumChord(curStrumStartTime, false, 0.8, chord);
                    break;
                case 12:

                    curStrumStartTime = blockStartTime + timeUnit * 31;
                    GuitarPlayer.strings[2].pluck(curStrumStartTime, 0.7, chord[2]);

                    curStrumStartTime = blockStartTime + timeUnit * 31.5;
                    GuitarPlayer.strings[1].pluck(curStrumStartTime, 0.7, chord[1]);

                    chordIndex = (chordIndex + 1) % (chords.length - 1);
                    blockStartTime += timeUnit * 32;
                    break;
            }

            $timeout(curStrumStartTime, highlighChord(chordIndex, vm.delta));

            sequenceN++;

            // if we're only generating the next strum 200 ms ahead of the current time,
            // we might be falling behind, so increase the precache time
            if (curStrumStartTime - audioCtx.currentTime < 0.2) {
                precacheTime += 0.1;
            }
            // document.getElementById("precacheTime").innerHTML =
            //     precacheTime.toFixed(1) + " seconds";

            // we try to main a constant time between when the strum
            // has finished generated and when it actually plays
            // the next strum will be played at curStrumStartTime; so start
            // generating the one after the next strum at precacheTime before
            var generateIn = curStrumStartTime - audioCtx.currentTime - precacheTime;
            if (generateIn < 0)
                generateIn = 0;

            var nextGenerationCall = function () {
                queueStrums(sequenceN, blockStartTime, chordIndex, precacheTime);
            };

            setTimeout(nextGenerationCall, generateIn * 1000);
        }

        function startGuitarPlaying() {

            vm.playing = !vm.playing;

            var startSequenceN = 0;
            var blockStartTime = audioCtx.currentTime;
            var startChordIndex = 0;
            var precacheTime = 0.0;
            queueStrums(startSequenceN, blockStartTime, startChordIndex, precacheTime);
        }


        function playSong() {

            vm.playing = !vm.playing;

            if(vm.playing) {
                return;
            }

            var delay = 1000; //  1 second delay between chords
            var totalDelay = 0;
            var chordRepetitions = 2; // number of times to repeat each chord
            var strum = 1;

            // length - 1 to exclude last auto added empty chord
            for (var i = 0; i < (vm.score.length - 1); i++) {
                for (var r = 0; r < chordRepetitions; r++) {
                    setTimeout(
                        function (strings, strum) {
                            GuitarPlayer.playChord(strum, strings)
                        }, totalDelay, vm.score[i].strings, strum);

                    totalDelay += delay;

                    strum = !strum;
                }
            }
        }

        function playChord(index) {
            console.log('Score:', vm.score);
            GuitarPlayer.playChord(1, vm.score[index].strings);
        }

        function testIfNotAlreadyFourFingers(chord, scoreIdx, fretIdx, stringIdx) {

            return true;

            /*
             //you can add if you are de-selcting
             if(vm.score[scoreIdx][fretIdx][stringIdx].show) {
             return true;
             }

             for(var sidx = 0; sidx < vm.numberOfStrings; sidx++) {
             if(vm.score[scoreIdx][fretIdx][sidx].show) {
             return true;
             }
             }

             //or if still fingers left
             var totalFingers = 0;

             for(var i = 0; i < vm.score[scoreIdx].length; i++) {
             for(var j = 0; j < vm.score[scoreIdx][i].length; j++) {
             if(vm.score[scoreIdx][i][j].show) {
             totalFingers++;
             }
             }
             }

             return totalFingers < 4;
             */

        }

        function getMappingForString(stringIdx, show) {
            var mapping = {
                source: '' + stringIdx,
                source_idx: 0,
                target: '' + stringIdx,
                target_idx: 0,
                x1: 0,
                y1: (stringIdx * vm.stringGap),
                x2: vm.gap,
                y2: (stringIdx * vm.stringGap),
                show: show
            };

            return mapping;
        }

        function addChord(position, strings) {

            var frets = [];

            //array com 6 posições contendo valores inteiros
            //com o indice do fret selecionado
            //sendo que -1 significa que a string está muted
            //i.e. indica o fret de cada string (corda da guitarra)
            //var strings = [-1, 3, 2, 0, 0, 0];

            //significa que vair ter show == true
            //no na string 2 no fret 3
            //s0f-1 s1f3 s2f2 s3f0 s4f0 s5f0 
            //[-1  , 3  ,  2 , 0  , 0  , 0  ];


            for (var j = 0; j < vm.numberOfFrets; j++) {
                var mappings = [];

                for (var i = 0; i < vm.numberOfStrings; i++) {

                    //TODO: make show to act acoording to strings arg passed
                    var show = false;

                    mappings.push(getMappingForString(i, show));
                }

                frets.push(mappings);
            }

            if (!position) {
                if (!strings) {
                    strings = [];

                    for (var i = 0; i < vm.numberOfStrings; i++) {
                        strings.push(0);
                    }
                }

                var stringsTxt = "[";

                for (var i = 0; i < vm.numberOfStrings - 1; i++) {
                    stringsTxt = stringsTxt + strings[i] + ", "
                }

                stringsTxt = stringsTxt + strings[vm.numberOfStrings - 1] + "]"

                vm.score.push(frets);
                vm.score[vm.score.length - 1].strings = strings;
                vm.score[vm.score.length - 1].stringsTxt = stringsTxt;
                $rootScope.scoreText.push(" ");
            }
            else {
                //TODO: insert at a specific position instead of appending to array
            }
        }

        function fillChordsFromScoreText(text) {

            vm.score = [];
            var mappings = [];

            for (var i = 0; i < text.length; i++) {

                var chords = text[i].split(" ");

                for (var j = 0; j < chords.length; j++) {
                    var chordText = chords[j];
                }

                var x1 = chordText.slice(1, chordText.indexOf("s"));
                var x2 = chordText.slice(chordText.indexOf("s"), chordText.length);

                mappings.push({x: x1, y: x2});
            }

            return mappings
        }

        function notAlreadyAFingerInThisString(scoreIdx, fretIdx, stringIdx) {

            var result = true;

            for (var j = 0; j < vm.numberOfFrets; j++) {
                if (vm.score[scoreIdx][j][stringIdx].show) {
                    result = false;
                }
            }

            return result;
        }

        function toggleCirclesForClick(chord, scoreIdx, fretIdx, stringIdx) {

            /*
             if(notAlreadyAFingerInThisString(scoreIdx, fretIdx, stringIdx)) {

             }
             */

            for (var j = 0; j < vm.numberOfFrets; j++) {
                if (j == fretIdx) {
                    vm.score[scoreIdx][fretIdx][stringIdx].show = !vm.score[scoreIdx][fretIdx][stringIdx].show;
                }
                else {
                    vm.score[scoreIdx][j][stringIdx].show = false;
                }
            }
            /*
             for(var j = 0; j < vm.score[scoreIdx][fretIdx].length; j++) {
             if(j == stringIdx) {
             vm.score[scoreIdx][fretIdx][stringIdx].show = !vm.score[scoreIdx][fretIdx][stringIdx].show;
             }
             else {
             vm.score[scoreIdx][fretIdx][j].show = false;
             }
             }
             */
        }

        function updateString(scoreIdx, fretIdx, stringIdx) {

            if (vm.score[scoreIdx].strings[vm.numberOfStrings - stringIdx - 1] != fretIdx + 1) {
                vm.score[scoreIdx].strings[vm.numberOfStrings - stringIdx - 1] = fretIdx + 1;
            }
            else {
                vm.score[scoreIdx].strings[vm.numberOfStrings - stringIdx - 1] = 0;
            }

            var strings = vm.score[scoreIdx].strings;
            var stringsTxt = "[";

            for (var i = 0; i < vm.numberOfStrings - 1; i++) {
                stringsTxt = stringsTxt + strings[i] + ", "
            }

            /*

             for(var i = vm.numberOfStrings - 1; i > 0; i--) {
             stringsTxt = stringsTxt + strings[i] + ", "
             }

             */

            stringsTxt = stringsTxt + strings[vm.numberOfStrings - 1] + "]"

            vm.score[scoreIdx].stringsTxt = stringsTxt;
        }

        function changeScoreText(scoreIdx) {

            var scoreLine = "";
            var frets = [0, 0, 0, 0, 0, 0];

            for (var fretIdx = 0; fretIdx < vm.score[scoreIdx].length; fretIdx++) {
                for (var stringIdx = 0; stringIdx < vm.score[scoreIdx][fretIdx].length; stringIdx++) {
                    if (vm.score[scoreIdx][fretIdx][vm.numberOfStrings - stringIdx - 1].show) {
                        scoreLine = scoreLine + "s" + (stringIdx + 1) + "f" + fretIdx + " ";
                        frets[stringIdx] = fretIdx;
                    }
                }

            }

            var extracted_chord = GuitarPlayer.getChord(frets);
            $rootScope.scoreText[scoreIdx] = extracted_chord;
        }


        function checkIfFirstClickOnChordAndActAcordingly(scoreIdx) {
            var isAny = false;

            if (scoreIdx < vm.score.length - 1) {
                return;
            }

            for (var fretIdx = 0; fretIdx < vm.score[scoreIdx].length; fretIdx++) {
                for (var stringIdx = 0; stringIdx < vm.score[scoreIdx][fretIdx].length; stringIdx++) {
                    if (vm.score[scoreIdx][fretIdx][stringIdx].show) {
                        isAny = true;
                    }
                }
            }

            if (!isAny) {
                addChord();
            }
        }

        function clickCircle(chord, scoreIdx, fretIdx, stringIdx) {

            checkIfFirstClickOnChordAndActAcordingly(scoreIdx);

            var canAdd = testIfNotAlreadyFourFingers(chord, scoreIdx, fretIdx, stringIdx);

            if (canAdd) {
                toggleCirclesForClick(chord, scoreIdx, fretIdx, stringIdx);
                updateString(scoreIdx, fretIdx, stringIdx);
                changeScoreText(scoreIdx);
            }
            else {
                console.log('cant add more than four fingers!!!')
            }

        }

        function getIndexFromText() {
            //TODO:
        }

        function ngOnInit() {
            if (!$rootScope.scoreText) {
                vm.score = [];
                $rootScope.scoreText = [];
            } else {
                fillChordsFromScoreText($rootScope.scoreText);
            }

            addChord();
        }

        vm.exportToPng = exportToPng;

        function exportToPng(idx) {
            var target = "chord_" + idx;

            svg_to_png(target);
        }

        //from: https://gist.github.com/gustavohenke/9073132
        function svg_to_png(container) {

            console.log(container);

            var svg = document.getElementById(container);

            if (typeof window.XMLSerializer != "undefined") {
                var svgData = (new XMLSerializer()).serializeToString(svg);
            } else if (typeof svg.xml != "undefined") {
                var svgData = svg.xml;
            }

            var canvas = document.createElement("canvas");
            var svgSize = svg.getBoundingClientRect();
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            var ctx = canvas.getContext("2d");

            var img = document.createElement("img");
            img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));

            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                var imgsrc = canvas.toDataURL("image/png");

                var a = document.createElement("a");
                a.download = container + ".png";
                a.href = imgsrc;
                a.click();
            };

        }

        ngOnInit();
    }
})();
