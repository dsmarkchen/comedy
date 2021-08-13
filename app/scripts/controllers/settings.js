'use strict';

/**
 * @ngdoc function
 * @name chargeApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the chargeApp
 */
angular.module('comedyApp')
    .controller('SettingsCtrl', function ($scope, comedyService, fileReader) {
        $scope.comedyService = comedyService;
        $scope.verbose = comedyService.getVerbose();
        $scope.chk_verbose = $scope.verbose;
        
        $scope.changeVerbose = function () {
            $scope.verbose = $scope.chk_verbose;
            comedyService.setVerbose($scope.verbose);
            
        }
        $scope.opt = comedyService.getBook();
        $scope.input_opt = $scope.opt;
        
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
            comedyService.opt($scope.input_opt);
            $scope.opt = comedyService.getBook();
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
            
            localStorage.removeItem("comedyNotes");

            comedyService.opt($scope.opt);
            comedyService.rawlines([]);
            comedyService.feedme();
            comedyService.makelines();
            
        }
        $scope.$on("fileProgress", function (e, progress) {
            $scope.progress = progress.loaded / progress.total;
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
