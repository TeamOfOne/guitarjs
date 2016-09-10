/**
 * Created by fjsnogueira on 01/07/2016.
 */
(function () {
    'use strict';

    angular.module('app')
        .controller('ChordsController', ChordsController);

    ChordsController.$inject = ["_"];
    function ChordsController(_) {
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

        vm.clickCircle          = clickCircle;

        vm.score = [];
        
        function testIfNotAlreadyFourFingers(scoreIdx, fretIdx, stringIdx) {

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

        function clickCircle (chord, scoreIdx, fretIdx, stringIdx) {
            console.log(chord);
            console.log(fretIdx);
            console.log(stringIdx);

            var canAdd = testIfNotAlreadyFourFingers(scoreIdx, fretIdx, stringIdx);

            if(canAdd) {
                vm.score[scoreIdx][fretIdx][stringIdx].show = !vm.score[scoreIdx][fretIdx][stringIdx].show;
            }
            else {
                console.log('cant add more than four fingers!!!')
            }
        }

        function ngOnInit() {
            
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

            vm.score.push(frets);
            vm.score.push(frets);
        }

        ngOnInit();
    }
})();
