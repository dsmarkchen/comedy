'use strict';

/**
 * @ngdoc function
 * @name chargeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chargeApp
 */
angular.module('comedyApp')
    .filter('split', function () {
        return function (input) {
            function split_that(item) {
                if (item == "that" || item == "where" || item == "when" || item == "who" || item == "which") {
                    sum2 += "\n "
                    sum2 += item;
                    return;
                }
                sum2 += item;
            }

            function split_commas(item) {
                temp += item;
                if (item.length > 52) {
                    /* sum+='##NEED_SPLIT##'; */
                    var delimiter2 = /(that|where|which|when|who)/g;
                    var res2 = temp.split(delimiter2);
                    res2.forEach(split_that);
                    sum += sum2;
                    temp = "";
                    return;
                }

                sum += item;
                if (sum.endsWith('--') && item == "-" || item == "?" || item == ";" || item == "." || item == "!" || item == ",") {
                    sum += "\n";
                    temp = "";
                }


            }



            var delimiter = /([!,.;?-])/g;
            var line_index = 0;
            var res = input.split(delimiter);
            var temp = "";
            var sum = "";
            var sum2 = "";
            res.forEach(split_commas);

            console.log("line_index:" + line_index);
            return sum;

           
        }
    })
    .controller('MainCtrl', ['$window', '$scope', '$location', function ($window, $scope, $location) {
        var inferno_sss = [
            136, 142, 136, 151, 142, 115, 130, 130, 133, 136,
            115, 139, 151, 142, 124, 136, 136, 136, 133, 130,
            139, 151, 148, 151, 151, 142, 136, 142, 139, 148,
            145, 139, 157, 139
        ];
        var purgatorio_sss = [
            136, 133, 145, 139, 136,  142, 148, 148, 142, 148,
            139, 145, 142, 139, 148, 154, 142, 136, 148, 148,
            142, 154, 139, 154, 139, 142, 148, 139, 145, 148,
            145, 160, 145,
        ];
        var paradiso_sss = [
            142, 148, 130, 142, 139, 142, 148, 148, 142, 148,
            139, 145, 142, 139, 148, 154, 142, 136, 148, 148,
            142, 154, 139, 154, 139, 142, 148, 139, 145, 148,
            142, 151, 145,
        ];

        var mainCtrl = this;
        mainCtrl.test = 'testing mainController';

        $scope.txTotalSymbols = localStorage.getItem("totalSymbols");
        $scope.txTotalLHs = localStorage.getItem("totalLHs");
        $scope.rxTotalSymbols = localStorage.getItem("rxTotalSymbols");
        $scope.rxTotalLHs = localStorage.getItem("rxTotalLHs");

        $scope.linesCountInferno = localStorage.getItem("comedyLinesCountinferno");
        $scope.linesCountPurgatorio = localStorage.getItem("comedyLinesCountpurgatorio");
        $scope.linesCountParadiso = localStorage.getItem("comedyLinesCountparadiso");
        if ($scope.linesCountParadiso == null)
            $scope.linesCountParadiso = 0;
        if ($scope.linesCountPurgatorio == null)
            $scope.linesCountPurgatorio = 0;
        
        var sum = 0;
        for (var s in inferno_sss) {
            sum = sum + inferno_sss[s];
        }
        $scope.linesTotalInferno = sum;
        $scope.progressInferno = $scope.linesCountInferno / $scope.linesTotalInferno * 100;

        sum = 0;
        for (var s2 in purgatorio_sss) {
            sum = sum + purgatorio_sss[s2];
        }
        $scope.linesTotalPurgatorio = sum;

        sum = 0;
        for (var s3 in paradiso_sss) {
            sum = sum + paradiso_sss[s3];
        }
        $scope.linesTotalParadiso = sum;
        

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };


        function getIEVersion() {
            var sAgent = window.navigator.userAgent;
            var Idx = sAgent.indexOf("MSIE");

            // If IE, return version number.
            if (Idx > 0) {
                return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
            }
            // If IE 11 then look for Updated user agent string.
            else if (!!navigator.userAgent.match(/Trident\/7\./)) {
                return 11;
            }
            else {
                return 0; //It is not IE
            }
        }
        $scope.ie = getIEVersion();

    }]);
