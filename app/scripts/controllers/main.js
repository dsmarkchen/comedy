'use strict';

/**
 * @ngdoc function
 * @name chargeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chargeApp
 */
angular.module('comedyApp')
 .filter('split', function() {
   return function(input) {
  var delimiter = /([!,.;?-])/g;
  var line_index = 0;
  var res = input.split(delimiter);
  var temp = "";
  var sum = "";
  var sum2 = "";
  res.forEach(split_commas);

  console.log("line_index:" + line_index);
  return sum;

  function split_that(item) {
    if(item == "that" || item == "where" || item == "when" || item == "who" || item == "which") { 
        sum2 +="\n "
        sum2 += item;
        return;
    }
    sum2 += item;
  }

  function split_commas(item) {
    temp += item;
    if(item.length > 52) {
        /* sum+='##NEED_SPLIT##'; */
        var delimiter2 = /(that|where|which|when|who)/g;
        var res2 = temp.split(delimiter2);
        res2.forEach(split_that);
        sum += sum2;
        temp = "";
        return;
    }

    sum += item; 
    if(sum.endsWith('--') && item== "-" || item== "?" || item== ";" || item== "." || item=="!" || item==",") {
        sum += "\n";
        temp = "";
    }


  }  
}}) 
  .controller('MainCtrl', ['$window', '$scope', '$location', function ($window, $scope, $location) {

    var mainCtrl = this;
	mainCtrl.test = 'testing mainController';

    $scope.txTotalSymbols = localStorage.getItem("totalSymbols");
    $scope.txTotalLHs = localStorage.getItem("totalLHs");
    $scope.rxTotalSymbols = localStorage.getItem("rxTotalSymbols");
    $scope.rxTotalLHs = localStorage.getItem("rxTotalLHs");


    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };


    function getIEVersion() {
      var sAgent = window.navigator.userAgent;
      var Idx = sAgent.indexOf("MSIE");

      // If IE, return version number.
      if (Idx > 0) {
        return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
      }
      // If IE 11 then look for Updated user agent string.
      else if (!!navigator.userAgent.match(/Trident\/7\./))  {
        return 11;
      }
      else {
        return 0; //It is not IE
      }
    }
    $scope.ie = getIEVersion(); 
    
  }]);
