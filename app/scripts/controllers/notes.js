'use strict';

/**
 * @ngdoc function
 * @name comedyApp.controller:VoyageCtrl
 * @description
 * # VoyageCtrl
 * Controller of the comedyApp
 */
angular.module('comedyApp')
    .controller('NotesCtrl', function ($scope) {

        $scope.items = [
            {
                book: "Inferno,1,31",
                keyword: "Beasts",
                text: "- ###leopard\n\n- ###lion\n\n- ###she-wolf\r\n<p> envy, wrath, avarice </p>"
            },
            {
                book: "Purgatorio",
                keyword: "Beasts",
                text: "the process of transmuting fleshly into spiritual experience"
            },
            {
                book: "Paradiso",
                keyword: "Beasts",
                text: "the degrees of spiritual realization"
            },];



    })
    .filter('markdown', function () {
        var converter = new Showdown.converter();
        return converter.makeHtml;
    });

