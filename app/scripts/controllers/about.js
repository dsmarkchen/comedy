'use strict';

/**
 * @ngdoc function
 * @name chargeApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the chargeApp
 */
angular.module('comedyApp')
  .controller('AboutCtrl', function ($scope, ivService, fileReader) {

   $scope.users = ["joseph", "james", "joseph 22 ","joseph"]; 
   $scope.comments = ["comment 1", "comment2", "", ""]; 


   $scope.isNullOrEmpty = function (value) {
        return value == null || value === "";
   }
   $scope.calcCP = function () {
        var name = $scope.name
        var atk = $scope.attack;
        var def = $scope.defense;
        var hp = $scope.hp;
        var statProm = ivService.getStat(name);
        
        var level = parseInt($scope.level); 
        var iv = {
            Atk: parseInt(atk),
            Def: parseInt(def),
            Hp: parseInt(hp)
        }
        var stat = {
            Atk: 112,
            Def: 152,
            Hp: 225
        }
        $scope.cp = ivService.calculateCP(level, iv, stat);
   }

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