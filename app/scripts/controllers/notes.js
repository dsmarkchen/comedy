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
        $scope.clear = function () {
            $scope.book_name = "";
            $scope.key= "";
            $scope.input = "";
            $scope.ind = -1;
        }
        $scope.clear();
        
        var items = JSON.parse(localStorage.getItem("comedyNotes"));
        if (items == null) {
            $scope.items = [
                {
                    book: "Inferno,1,31",
                    key: "Beasts",
                    text: "- ###leopard\n\n- ###lion\n\n- ###she-wolf\r\n<p> envy, wrath, avarice </p>"
                },
                {
                    book: "Inferno,1,79",
                    key: "Virgil",
                    text: "Roman Poet, Aeneid"
                },
                {
                    book: "Inferno,1,133",
                    key: "Saint Peter",
                    text: "Cristrian Figure"
                },];
            localStorage.setItem("comedyNotes", JSON.stringify($scope.items));
        }
        else
            $scope.items = items;

        $scope.select = function (ind) {
            var note = $scope.items[ind];
            $scope.ind = ind;
            $scope.book_name = note.book;
            $scope.key = note.key;
            $scope.input = note.text;
        }

        $scope.addItem = function (bookind, brief, content) {
            var item = {
                book: bookind,
                key: brief,
                text: content,

            };
            $scope.items.push(item);
            localStorage.setItem("comedyNotes", JSON.stringify($scope.items));
            $scope.clear();
        }
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
        }

        $scope.saveJSON = function (json) {
            var jsonse = JSON.stringify(json);
            var blob = new Blob([jsonse], {
                type: "application/json"
            });
            $scope.filename = $scope.filename || "my_json";
            saveAs(blob, $scope.filename + ".json");
        }

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

