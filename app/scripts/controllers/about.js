'use strict';

/**
 * @ngdoc function
 * @name chargeApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the chargeApp
 */
angular.module('comedyApp')
    .controller('AboutCtrl', function ($scope, comedyService, fileReader) {

        $scope.opt = localStorage.getItem("comedyOpt");
        if ($scope.opt == null) {
            $scope.opt = "inferno";
            localStorage.setItem("comedyOpt", $scope.opt);
        }
        
        $scope.items2 = [
            {
                name: "Inferno",
                text: "the misery of the spirit bound to the prides and actions of the flash"
            },
            {
                name: "Purgatorio",
                text: "the process of transmuting fleshly into spiritual experience"
            },
            {
                name: "Paradiso",
                text: "the degrees of spiritual realization"
            },];
        $scope.users = ["joseph", "james", "joseph 22 ", "joseph"];
        $scope.comments = ["comment 1", "comment2", "", ""]; 

        $scope.change = function () {
            comedyService.opt($scope.opt);
            comedyService.lines([]);
        }

        $scope.isNullOrEmpty = function (value) {
            return value == null || value === "";
        }
       

        $scope.getFile = function () {

            fileReader.readAsText($scope.file, $scope)
                .then(function (rsp) {

                    $scope.raw = rsp.split(/\r?\n/);
                    localStorage.setItem("comedyRawlines", JSON.stringify($scope.raw));

                    comedyService.rawlines($scope.raw);
                    comedyService.makelines();
                    console.log("getRaw " + $scope.raw);

                });
        };

       $scope.$on("fileProgress", function (e, progress) {
            $scope.progress = progress.loaded / progress.total;
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
;
