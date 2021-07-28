'use strict';

/**
 * @ngdoc function
 * @name chargeApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the chargeApp
 */
angular.module('comedyApp')
    .controller('CantoCtrl', function ($scope, $http, comedyService, fileReader) {
        $scope.lines = [];
        
      $scope.myQuery = "1:1,25";
        

        $scope.opt = localStorage.getItem("comedyOpt");
        if ($scope.opt == null) {
            $scope.opt = "inferno";
            localStorage.setItem("comedyOpt", $scope.opt);
        }
        comedyService.opt($scope.opt);

        var cmdylines = JSON.parse(localStorage.getItem("comedyLines" + $scope.opt));
        if (cmdylines != null) {
            $scope.lines = cmdylines;
        }
        else {
            comedyService.feedme().then(function success(rsp) {
                $scope.lines = comedyService.lines;
            });
        }
        

        

      $scope.items2 = [
        {name: "Inferno", 
         text: "the misery of the spirit bound to the prides and actions of the flash"}, 
        {name: "Purgatorio",
         text: "the process of transmuting fleshly into spiritual experience"}, 
        {name: "Paradiso",
           text: "the degrees of spiritual realization"
       },];
        

        var step = 3;
        $scope.move = function () {
            var query = $scope.myQuery;
            if (query == "") return;
            var que = query.split(/[,:]/);
            var sec = que[0].trim();
            var start = parseInt(que[1].trim(), 10);
            var end = parseInt(que[2].trim(), 10);

            var len = end - start;
            if (step > 0) {
                start = start + len + 1;
                end = end + len + 1;
                var x = start % 3;
                if (x == 0) {
                    start += 1;
                    end += 1;
                }
                if (x == 2) {
                    start -= 1;
                    end -= 1;
                }
            }
            if (step < 0) {

                start = start - len - 1;
                end = end - len - 1;

                if (x == 0) {
                    start += 1;
                    end += 1;
                }
                if (x == 2) {
                    start -= 1;
                    end -= 1;
                }
            }


            if (start < 0) start = 1;

            $scope.myQuery = sec + ":" + start.toString() + "," + end.toString();
            localStorage.setItem("myQuery", $scope.myQuery);
        }

        $scope.prev = function () {
            step = -3;
            $scope.move();
        }
        $scope.next = function () {
            step = 3;
            $scope.move();

        }    
        $scope.change = function () {
            comedyService.opt($scope.opt);
            localStorage.setItem("myCantoOpt", $scope.opt);
        }
        $scope.getComedylines = function () {
            return comedyService.lines;
        }
        $scope.$watch('comedyService.rawlines', function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.rawlines = newValue;                
                localStorage.setItem("myRawlines", $scope.rawlines);
            }
        });


        $scope.$watch('comedyService.lines', function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.lines = newValue;
            }            
        });
        $scope.$watch('comedyService.opt', function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.opt = newValue;
            }
        });

  })
    .filter('myCantoFilter', function () {
        return function (items, query) {
            var filtered = [];
            if (query == "") return items;
            var que = query.split(/[,:]/);
            var sec = que[0];
            var start = que[1];
            var end = que[2];
            angular.forEach(items, function (item) {
                if ((item.name != null) && item.name.trim() == sec.trim() && (item.line >= start && item.line < end)) {
                    filtered.push(item);
                }
            });
            return filtered;
        }
    })
;

