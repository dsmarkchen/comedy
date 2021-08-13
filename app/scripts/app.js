'use strict';

angular
    .module('comedyApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .service('comedyService', function ($http, $log) {
        var _verbose = false;
        var _opt = "";
        var _initVerbose = function () {
            _verbose = localStorage.getItem("comedyVerbose");
            if (_verbose == null || _verbose == undefined) {
                _verbose = false;
            }
            else {
                _verbose = JSON.parse(_verbose);
            }
        };
        var _initBook = function () {
            var cmdyOpt = localStorage.getItem("comedyOpt");
            if (cmdyOpt == null || cmdyOpt == undefined) {
                _opt = "inferno";
            }
            else {
                _opt = cmdyOpt;
            }
        }
        _initVerbose();
        _initBook();
        $log.log("comedyService.opt: " + _opt);
        var lines = [];
        var rawlines = [];

        var temp = [];
        var counter = 0;
        
        var cmdyRaws = localStorage.getItem("comedyRawlines" + _opt);
        if (cmdyRaws != null) {
            rawlines = cmdyRaws;
        }
        var cmdyLines = localStorage.getItem("comedyLines" + _opt);
        if (cmdyLines != null && cmdyLines != "") {
            lines = cmdyLines;
        }

        var _build = function (item) {
            var withBreaker = '<br>';
            if (item.trim().length > 0) {
                var exp = /^##/;
                if (exp.test(item)) {
                    if (temp.length > 0) {
                        lines.push({
                            name: name,
                            line: counter,
                            text: temp.join(withBreaker),
                            visible: true
                        });
                        temp = [];
                    }
                    name = item.replace(/^## /, "");
                    counter = 0;
                    return;
                }
                var res = item.replace(/--/g, "&#x2012;");
                temp.push(res.trim());
                counter++;
                if (temp.length == 3) {
                    lines.push({
                        name: name,
                        line: counter - 2,
                        text: temp.join(withBreaker),
                        visible: true
                    });
                    temp = [];
                }
            }
        };
        var _makelines = function () {
            lines = [];
            for (var i = 0; i < rawlines.length; i++) {
                _build(rawlines[i], true);
            }
            if (lines.length > 0) {
                lines.push({ line: counter - 1, text: rawlines.join('<br>') });
            }
            localStorage.setItem("comedyLines" + _opt, JSON.stringify(lines));
            localStorage.setItem("comedyLinesCount" + _opt, lines.length * 3);
            $log.log("comedyService.linesCountInferno: " + lines.length * 3);

        };
        var _feedme = function (opt) {
            var base = 'https://dsmarkchen.github.io/comedy/';
            var url = base + 'data/' + opt + '.txt';

            var promise = $http.get(url).then(function (rsp) {
                rawlines = rsp.data.split(/\r?\n/);
                localStorage.setItem("comedyRawlines" + opt, JSON.stringify(rawlines));
                _makelines();
            });
            return promise;
        };

        return {
            opt: function (newopt) {
                if (_opt != newopt) {
                    _opt = newopt;
                    localStorage.setItem("comedyOpt", _opt);
                }                
            },
            getBook: function () {
                if (_opt == null || _opt == undefined) {
                    _initBook();
                }
                return _opt;
            },

            initBook: function () {
                _initBook();
            },
            initVerbose: function () {
                _initVerbose();
            },

            getVerbose: function () {
                return _verbose;
            },
            setVerbose: function (newVal) {
                if (_verbose != newVal) {
                    _verbose = newVal;
                    localStorage.setItem("comedyVerbose", _verbose);
                }
            },

            lines: function (newLines) {
                if (lines != newLines) {
                    lines = newLines;
                }
                return lines;
            },
            makelines: function () {
                _makelines();
            },
            feedme: function () {
                return _feedme(_opt);
            },
            rawlines: function (newLines) {
                if (rawlines != newLines) {
                    rawlines = newLines;
                }
                return rawlines;
            },
            feed: function (opt) {
                return _feedme(opt);
            },
        };





    })
    .filter('highlight', function () {
        return function (text, selectedWord) {
            if (selectedWord) {
                var pattern = new RegExp(selectedWord, "g");
                return text.replace(pattern, '<span class="highlighted">' + selectedWord + '</span>');
            }
            else {
                return text;
            }
        };
    })
    .directive('xwindow', ['$window', function ($window) {
        function link(scope) {
            scope.width = $window.innerWidth;
            scope.height = $window.innerHeight;

            function onResize() {
                console.log("xwindow:" + $window.innerWidth);
                // uncomment for only fire when $window.innerWidth change   
                if (scope.width !== $window.innerWidth) {
                    scope.width = $window.innerWidth;
                    scope.$digest();
                }
                if (scope.height !== $window.innerHeight) {
                    scope.height = $window.innerHeight;
                    scope.$digest();
                }
            }

            function cleanUp() {
                angular.element($window).off('resize', onResize);
            }

            angular.element($window).on('resize', onResize);
            scope.$on('$destroy', cleanUp);
        }
        return {
            link: link,
            restrict: 'A'
        };
        
    }])
    .directive('countUp', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                countTo: "=countTo",
                start: "=start",
                step: "=step",
                interval: '=interval'
            },
            controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
                $scope.millis = $scope.start;
                if ($element.html().trim().length === 0) {
                    $element.append($compile('<span>{{millis}}</span>')($scope));
                } else {
                    $element.append($compile($element.contents())($scope));
                }
                function timeloop() {
                    $timeout(function () {
                        $scope.millis += $scope.step;
                        $scope.$digest();
                        if ($scope.millis < $scope.countTo) {
                            timeloop();
                        }
                    }, $scope.interval);
                }
                timeloop();
            }]
        }
    }])

    .directive('tooltip', function ($compile, $sce) {
        return {
            restrict: 'A',
            scope: {
                content: '=tooltipContent'
            },
            link: function (scope, element, attrs) {

                /* Attributes */

                scope.displayTooltip = false;

                /* Methods */
                scope.updateTooltipOpacity = function (opacity) {
                    tooltip.css({
                        opacity: opacity,
                        'max-width': 340
                    });
                };
                scope.updateTooltipPosition = function (top, left) {
                    var target = $(this);

                    tooltip.css({
                        top: top + 'px',
                        left: left + 'px',
                    });
                };

                scope.getSafeContent = function (content) {
                    return $sce.trustAsHtml(content);
                };

                /* Bootstrap */

                var tooltip = angular.element(
                    '<div ng-show="displayTooltip" id="tooltip">\
        	<span ng-bind-html="getSafeContent(content)"></span>\
        </div>'
                );
                var tooltipold = angular.element(
                    '<div ng-show="displayTooltip" class="tooltip">\
        	<span ng-bind-html="getSafeContent(content)"></span>\
        </div>'
                );


                angular.element(document.querySelector('body')).append(tooltip);

                /* Bindings */

                element.on('mouseenter', function (event) {
                    scope.displayTooltip = true;
                    scope.$digest();
                });

                element.on('mousemove', function (event) {
                    scope.updateTooltipOpacity(.9);
                    scope.updateTooltipPosition(event.clientY - 20, event.clientX + 5);
                    //        scope.updateTooltipPosition(event.clientY -5, event.clientX + 5);
                });

                element.on('mouseleave', function () {
                    scope.displayTooltip = false;
                    scope.$digest();
                });

                /* Compile */

                $compile(tooltip)(scope);
            }
        };
    })
    .directive('xtooltip', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.hover(function () {
                    // on mouseenter

                    element.tooltip({ html: 'true', container: 'body' });
                    element.tooltip('show');
                }, function () {
                    // on mouseleave
                    element.tooltip('hide');
                });
            }
        };
    })
    .directive('bs-tooltip', function () {
        return function (scope, element, attrs) {
            attrs.$observe('title', function (title) {
                // Destroy any existing tooltips (otherwise new ones won't get initialized)
                element.tooltip('destroy');
                // Only initialize the tooltip if there's text (prevents empty tooltips)
                if (jQuery.trim(title)) element.tooltip();
            });
            element.on('$destroy', function () {
                element.tooltip('destroy');
                delete attrs.$$observers['title'];
            });
        };
    })
    .directive("owlCarousel", function () {
        return {
            restrict: 'E',
            transclude: false,
            link: function (scope) {
                scope.initCarousel = function (element) {
                    // provide any default options you want
                    var defaultOptions = {
                    };
                    var customOptions = scope.$eval($(element).attr('data-options'));
                    // combine the two options objects
                    for (var key in customOptions) {
                        defaultOptions[key] = customOptions[key];
                    }
                    // init carousel
                    $(element).owlCarousel(defaultOptions);
                };
            }
        };
    })
    .directive('owlCarouselItem', function () {
        return {
            restrict: 'A',
            transclude: false,
            link: function (scope, element) {
                // wait for the last item in the ng-repeat then call init
                if (scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
    })
    .config(['$routeProvider', function ($routeProvider, $routeParams) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/comedy/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/main', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/comedy/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/comedy/voyage', {
                templateUrl: 'views/voyage.html',
                controller: 'VoyageCtrl',
                controllerAs: 'voyage'
            })
            .when('/voyage', {
                templateUrl: 'views/voyage.html',
                controller: 'VoyageCtrl',
                controllerAs: 'voyage'
            })
            .when('/settings', {
                templateUrl: 'views/settings.html',
                controller: 'SettingsCtrl',
                controllerAs: 'settings'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/notes', {
                templateUrl: 'views/notes.html',
                controller: 'NotesCtrl',
                controllerAs: 'notes'
            })
            .when('/canto', {
                templateUrl: 'views/canto.html',
                controller: 'CantoCtrl',
                controllerAs: 'canto'
            })
            .otherwise({
                redirectTo: '/'
            });
        // $locationProvider.html5Mode(true);

    }]);
