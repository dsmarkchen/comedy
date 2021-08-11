'use strict';

/**
 * @ngdoc function
 * @name comedyApp.controller:VoyageCtrl
 * @description
 * # VoyageCtrl
 * Controller of the comedyApp
 */
angular.module('comedyApp')
    .controller('NotesCtrl', function ($scope, fileReader) {
        function move(arr, old_index, new_index) {
            while (old_index < 0) {
                old_index += arr.length;
            }
            while (new_index < 0) {
                new_index += arr.length;
            }
            if (new_index >= arr.length) {
                var k = new_index - arr.length;
                while ((k--) + 1) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr;
        }


        $scope.clear = function () {
            $scope.book_name = "";
            $scope.key = "";
            $scope.input = "";
            $scope.ind = -1;
        };

        $scope.clear();
        
        var items = JSON.parse(localStorage.getItem("comedyNotes"));
        if (items == null) {
            $scope.items = [
                {
                    book: "Inferno,1,31",
                    key: "Beasts",
                    text: "- leopard (envy) \n\n- lion (wrath, or pride) \n\n- she-wolf (avarice)\r\n</p>"
                },
                {
                    book: "Inferno,1,79",
                    key: "Virgil",
                    text: "Roman Poet, Aeneid"
                },
                {
                    book: "Inferno,1,133",
                    key: "Saint Peter",
                    text: "Simon Peter"
                },];
            localStorage.setItem("comedyNotes", JSON.stringify($scope.items));
        }
        else {
            $scope.items = items;
        }

        $scope.select = function (ind) {
            var note = $scope.items[ind];
            $scope.ind = ind;
            $scope.book_name = note.book;
            $scope.key = note.key;
            $scope.input = note.text;
        };

        $scope.moveItem = function (step) {
            var newPos = $scope.ind + step;
            $scope.items = move($scope.items, $scope.ind, newPos);
            localStorage.setItem("comedyNotes", JSON.stringify($scope.items));
            $scope.clear();
        };

        $scope.addItem = function (bookind, brief, content) {
            var item = {
                book: bookind,
                key: brief,
                text: content,

            };
            $scope.items.push(item);
            localStorage.setItem("comedyNotes", JSON.stringify($scope.items));
            $scope.clear();
        };

        $scope.updateItem = function (bookind, brief, content) {
            if ($scope.ind == -1) {
                $scope.addItem(bookind, brief, content);
                return;
            }
            var item = {
                book: bookind,
                key: brief,
                text: content,

            };
            $scope.items[$scope.ind] = item;

            localStorage.setItem("comedyNotes", JSON.stringify($scope.items));
            $scope.clear();
        };

        $scope.deleteItem = function () {
            if ($scope.ind == -1) {
                return;
            }
            $scope.items.splice($scope.ind, 1);

            localStorage.setItem("comedyNotes", JSON.stringify($scope.items));
            $scope.clear();
        };

        $scope.saveJSON = function (json) {
            var jsonse = JSON.stringify(json);
            var blob = new Blob([jsonse], {
                type: "application/json"
            });
            $scope.filename = $scope.filename || "my_json";
            saveAs(blob, $scope.filename + ".json");
        };

        $scope.getFile = function () {

            fileReader.readAsText($scope.file, $scope)
                .then(function (rsp) {

                    $scope.items = JSON.parse(rsp) || [];
                    localStorage.setItem("comedyNotes", JSON.stringify($scope.items));

                    console.log("getTeam " + $scope.items.length);

                });
        };

        $scope.$on("fileProgress", function (e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });
    })
    .filter('markdown', function () {
        var converter = new Showdown.converter();
        return converter.makeHtml;
    });

