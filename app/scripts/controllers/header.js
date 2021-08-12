'use strict';

/**
 * @ngdoc function
 * @name chargeApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the chargeApp
 * navbar button: expand (no button) or collapse (has button)
 * navbar menu: open or close
 */
angular.module('comedyApp')
    .controller('HeaderCtrl', function ($scope, $location) {
        $scope.nav_open = true;
        $scope.isNavCollapsed = true; /* button is on*/

        $scope.toggle_navbar = function () {
            $scope.isNavCollapsed = !$scope.isNavCollapsed;

            console.log("toggle_navbar:  nav_open:" + $scope.nav_open);
        }

        $scope.isCollapsed = false;


        $scope.getClass = function (path) {
            if (path === '/') {
                if ($location.path() === '/') {
                    return "active";
                } else {
                    return "";
                }
            }

            if ($location.path().substr(0, path.length) === path) {
                return "active";
            } else {
                return "";
            }
        };
        $scope.callapse_navbar = function () {
        };

        $scope.callapse_navbar2 = function () {
            console.log("collapse navbar!!!");
            if ($(".navbar-collapse").hasClass("in")) {
                console.log("collapse in click!!!");
                $('[data-toggle="collapse"]').click();
            }


        }
        $scope.opt = localStorage.getItem("comedyOpt");
        if ($scope.opt == null) {
            $scope.opt = "inferno";
            localStorage.setItem("comedyOpt", $scope.opt);
        }



        $scope.$on('$routeChangeSuccess', function () {
            console.log("routechangeSuccuss:  isCollapsed:" + $scope.isCollapsed);

        });
        /*
        $scope.on('show.bs.collapse hide.bs.collapse', function (e) {
            console.log(e.type + " collapse");
        });
        */




    })
    .directive("collapseListener", function ($rootScope, $parse, $document) /* AngularJS Directive */ {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $('#navbarSupportedContent').on('shown.bs.collapse', function() {
                    console.log("shown supportedContent");
                    scope.nav_open = true;
                    $rootScope.$on('$routeChangeSuccess', function () {
                        console.log("!hide!");
                        $('#navbarSupportedContent').collapse('hide')
                    })
                });
                $('#navbarSupportedContent').on('hide.bs.collapse', function () {
                    console.log("hide supportedContent");
                    scope.nav_open = false;
                    $rootScope.$on('$routeChangeSuccess', function () {
                        console.log("!hide!");
                        $('#navbarSupportedContent').collapse('hide')
                    })
                });
                /*$('.navbar-collapse').on('hide.bs.collapse', function () { 
                    console.log("hide");                    
                })*/
            }
        }
    })
    .directive('navDropdown', function ($parse, $document) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var fn = $parse(attr.navDropdown);
                $document.bind('click', clickOutsideHandler);
                element.bind('remove', function () {
                    $document.unbind('click', clickOutsideHandler);
                });
                function clickOutsideHandler(event) {
                    var clickover = $(event.target);
                    var _opened = $(".navbar-collapse").hasClass("navbar-collapse in");
                    if (_opened === true && !clickover.hasClass("navbar-toggle")) {
                        // $("button.navbar-toggle").click();
                        $(".navbar .navbar-collapse").removeClass("in");
                        scope.navCollapsed = false;
                    }
                }
            }
        };
    });
;
