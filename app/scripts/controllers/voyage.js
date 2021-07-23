'use strict';

/**
 * @ngdoc function
 * @name comedyApp.controller:VoyageCtrl
 * @description
 * # VoyageCtrl
 * Controller of the comedyApp
 */
angular.module('comedyApp')
    .controller('VoyageCtrl', function ($scope) {

        $scope.selectedIndex = -1;
        $scope.current = 0;
        $scope.setCurrent = function (index) {
            $scope.current = index;
        }


        $scope.selectedItem = [];
        $scope.items2 = [
            {
                name: "Francesca",
                text: "Love, that releases no beloved from loving took hold of me so strongly through his beauty that, as you see, it has not left me yet."
            },
            {
                name: "Purgatorio",
                text: "the process of transmuting fleshly into spiritual experience"
            },
            {
                name: "Picarda",
                text: "And in His will there is our peace: that sea to which all beings move—the beings He creates or nature makes—such is His will."
            },
        ];

        $scope.users = ["joseph", "james", "joseph 22 ", "joseph"];
        $scope.comments = ["comment 1", "comment2", "", ""];


        $scope.selectItem = function (index) {
            $scope.selectedItem = $scope.items2[index];
            $scope.selectedIndex = index;

        }

  });

