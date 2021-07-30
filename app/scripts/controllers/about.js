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

        $scope.reset = function () {
            var items = [{
                book: "Inferno,1,31",
                keyword: "Beasts",
                text: "- ###leopard\n\n- ###lion\n\n- ###she-wolf\r\n<p> envy, wrath, avarice </p>"
            }]
            localStorage.setItem("comedyNotes", JSON.stringify(items));

            comedyService.opt($scope.opt);
            comedyService.rawlines([]);
            comedyService.feedme();
            comedyService.makelines();
            
        }
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
    .directive("ngFileSelect", function () {

        return {
            link: function ($scope, el) {

                el.bind("change", function (e) {

                    $scope.file = (e.srcElement || e.target).files[0];
                    $scope.getFile();

                });

            }

        };
    })

 .factory("fileReader", function ($q, $log) {

        $log.log("fileReader"); 

        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsText = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsText(file);
             
            return deferred.promise;
        };
 
        return {
            readAsText: readAsText  
        };
    }
)
;
