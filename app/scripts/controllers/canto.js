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
        $scope.notes = JSON.parse(localStorage.getItem("comedyNotes"));

        $scope.selectedBookIndex = "";
        $scope.selectedWords = "";
        $scope.addNote = function (bookind, brief, content) {
            var item = {
                book: bookind,
                key: brief,
                text: content,

            };
            $scope.notes.push(item);
            localStorage.setItem("comedyNotes", JSON.stringify($scope.notes));
        }
        $scope.showSelectedWords = function (canto) {
            $scope.selectedBookIndex = $scope.opt + ", " + canto.name + "," + canto.line;
            $scope.selectedWords = $scope.getWordsSelected();
        };
        $scope.getWordsSelected = function () {
            var text = "";
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }
            return text;
        };




        $scope.lines = [];
        $scope.selectedWord = "";
        $scope.selectedText = "";




        $scope.myQuery =  localStorage.getItem("myQuery");
        if ($scope.myQuery == null) {
            $scope.myQuery = "1:1,12";
            localStorage.setItem("myQuery", $scope.myQuery);
        }

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


        var step = 3;
        $scope.move = function () {
            $scope.selectedWord = "";
            $scope.selectedText = "";
            $scope.selectedWords = "";

            var query = $scope.myQuery;
            if (query == "") {
                return;
            }
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

           var cmdylines = JSON.parse(localStorage.getItem("comedyLines" + $scope.opt));
           if (cmdylines != null) {
              $scope.lines = cmdylines;
          }
          else {
            comedyService.feedme().then(function success(rsp) {
                $scope.lines = comedyService.lines;
            });
          }

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
        $scope.hoverIn = function (note) {
            $scope.selectedWord = note.key;
            $scope.selectedText = note.text;
            console.log("hover: " + $scope.selectedWord);
        };

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

    .filter('noteFilter', function () {
        return function (comments, query) {
            var filtered = [];
            if (query == "") return filtered;
            var que = query.split(/[,:]/);
            var conto = que[0];
            var start = que[1];
            var end = que[2];
            angular.forEach(comments, function (item) {
                var item_book = item.book;
                var item_que = item_book.split(/[,:]/)
                var name = item_que[0].toLowerCase();
                var canto_ind = parseInt(item_que[1]);
                var canto_pos = parseInt(item_que[2]);
                if (name == "inferno" && canto_ind == conto && (canto_pos >= start && canto_pos <= end)) {
                    filtered.push(item);
                    console.log("book: " + item.book + "\nkey:" + item.key + "\ntext:" + item.text);
                }
            });

            //then we return the filtered items array
            return filtered;
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

