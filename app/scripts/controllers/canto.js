'use strict';

/**
 * @ngdoc function
 * @name chargeApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the chargeApp
 */
angular.module('comedyApp')
    .controller('CantoCtrl', function ($scope, $http, fileReader) {
      $scope.myQuery = "1:1,25";

        $scope.opt = localStorage.getItem("myCantoOpt");
        if ($scope.opt == null) {
            $scope.opt = "inferno";
            localStorage.setItem("myCantoOpt", $scope.opt);
        }


      $scope.items2 = [
        {name: "Inferno", 
         text: "the misery of the spirit bound to the prides and actions of the flash"}, 
        {name: "Purgatorio",
         text: "the process of transmuting fleshly into spiritual experience"}, 
        {name: "Paradiso",
           text: "the degrees of spiritual realization"
       },];
        $scope.lines = [];
        var temp = [];
        var counter = 0;
      $scope.buildone = function (item, useBreaker) {
          var withBreaker = ' ';
          if (useBreaker) {
              withBreaker = '<br>';
          }
          if (item.trim().length > 0) {
              var exp = /^##/;
              if (exp.test(item)) {
                  if (temp.length > 0) {
                      $scope.lines.push({
                          name: name,
                          line: counter,
                          text: temp.join(withBreaker),
                          visible: true
                      });
                      temp = [];
                  }
                  name = item.replace(/^## /, "");
                  counter = 0;
                  return;
              }
              var res = item.replace(/--/g, "&#x2012;");
              temp.push(res.trim());
              counter++;
              if (temp.length == 3) {
                  $scope.lines.push({
                      name: name,
                      line: counter - 2,
                      text: temp.join(withBreaker),
                      visible: true
                  });
                  temp = [];
              }
          }
      }


        $scope.feed = function () {
            var base = 'http:/dsmarkchen.github.io/comedy/'; 
            var url = base + '/data/' + $scope.opt + '.txt';

            
            
            $http.get(url).then(function (rsp) {
                var lines = rsp.data.split(/\r?\n/);
                for (var i = 0; i < lines.length; i++) {
                    $scope.buildone(lines[i], true);
                }
                if (lines.length > 0) {
                    $scope.lines.push({ line: counter - 1, text: lines.join('<br>') });
                }
            });
        }
        $scope.feed();


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
            localStorage.setItem("myCantoOpt", $scope.opt);
        }


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

