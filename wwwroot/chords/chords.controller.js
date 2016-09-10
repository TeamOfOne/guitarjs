/**
 * Created by fjsnogueira on 01/07/2016.
 */
(function () {
    'use strict';

    angular.module('app')
        .controller('ChordsController', ChordsController);

    ChordsController.$inject = ["_", "$rootScope", 'GuitarPlayer'];
    function ChordsController(_, $rootScope, GuitarPlayer) {
        var vm                  = this;

        //instance variables                             
        vm.showSvg              = true;               
        vm.gap                  = 20;    

        //
        vm.stringGap            = 20;
        vm.numberOfStrings      = 6;     
        vm.numberOfFrets        = 5;         

        //strings setup
        vm.line_stroke          = 'black';
        vm.line_stroke_width    = 2;

        //circles setup                                 
        vm.circle_l_r           = 6;                    
        vm.circle_l_stroke      = 'black';              
        vm.circle_l_stroke_width = 2;                   
        vm.circle_l_fill        = 'red';                
        vm.circle_r_r           = 3;                    
        vm.circle_r_stroke      = 'black';              
        vm.circle_r_stroke_width = 1;                   
        vm.circle_r_fill        = 'red';                


        vm.score = [];
        vm.scoreText = [];

        // Controller api
        vm.clickCircle          = clickCircle;
        vm.playChord = function() {
            console.log('Score:', vm.score);
            GuitarPlayer.playChord;
        }



        
        function testIfNotAlreadyFourFingers(chord, scoreIdx, fretIdx, stringIdx) {

            //you can add if you are de-selcting
            if(vm.score[scoreIdx][fretIdx][stringIdx].show) {
                return true;
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
        }

        function addChord (position) {

            var frets = [];

            for(var j = 0; j < vm.numberOfFrets; j++) {
                var mappings = [];

                for(var i = 0; i < vm.numberOfStrings; i++) {
                    mappings.push({
                        source: '' + i,
                        source_idx: 0,
                        target :  '' + i,
                        target_idx: 0,
                        x1: 0,
                        y1: (i * vm.stringGap),
                        x2: vm.gap,
                        y2: (i * vm.stringGap),
                        show: false
                    });    
                }

                frets.push(mappings);
            }


            if(!position) {
                vm.score.push(frets);
                vm.scoreText.push(" ");
            }
            else {
                //TODO: insert at a specific position instead of appending to array
            }
        }

        function toggleCirclesForClick(chord, scoreIdx, fretIdx, stringIdx) {
            for(var j = 0; j < vm.score[scoreIdx][fretIdx].length; j++) {
                if(j == stringIdx) {
                    vm.score[scoreIdx][fretIdx][stringIdx].show = !vm.score[scoreIdx][fretIdx][stringIdx].show;
                }
                else {
                    vm.score[scoreIdx][fretIdx][j].show = false;
                }
            }
        }

        function changeScoreText (scoreIdx) {
            
            var scoreLine = "";

            for(var fretIdx = 0; fretIdx < vm.score[scoreIdx].length; fretIdx++) {
                for(var stringIdx = 0 ; stringIdx < vm.score[scoreIdx][fretIdx].length; stringIdx++) {
                    if(vm.score[scoreIdx][fretIdx][stringIdx].show) {
                        scoreLine = scoreLine + "f" + fretIdx  + "s" + stringIdx + " ";
                    }
                }
            }

            vm.scoreText[scoreIdx] = scoreLine;
        }

        function checkIfFirstClickOnChordAndActAcordingly(scoreIdx) {
            var isAny = false;

             for(var fretIdx = 0; fretIdx < vm.score[scoreIdx].length; fretIdx++) {
                for(var stringIdx = 0 ; stringIdx < vm.score[scoreIdx][fretIdx].length; stringIdx++) {
                    if(vm.score[scoreIdx][fretIdx][stringIdx].show) {
                        isAny = true;
                    }
                }
            }

            if(!isAny) {
                addChord();
            }
        }

        function clickCircle (chord, scoreIdx, fretIdx, stringIdx) {

            checkIfFirstClickOnChordAndActAcordingly(scoreIdx);

            var canAdd = testIfNotAlreadyFourFingers(chord, scoreIdx, fretIdx, stringIdx);
 
            if(canAdd) {
                toggleCirclesForClick(chord, scoreIdx, fretIdx, stringIdx);
                changeScoreText(scoreIdx);
            }
            else {
                console.log('cant add more than four fingers!!!')
            }

        }

        function ngOnInit() {
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
            img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))) );

            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                var imgsrc = canvas.toDataURL("image/png");

                var a = document.createElement("a");
                a.download = container+".png";
                a.href = imgsrc;
                a.click();
            };
        }

        ngOnInit();
    }
})();
