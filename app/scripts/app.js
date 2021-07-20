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
.service('ivService', function($http) {

  this._modifier = [
         0.094,0.135137432,0.16639787, 0.192650919,0.21573247,
                0.236572661,0.25572005,0.273530381,0.29024988,0.306057378,
                0.3210876,0.335445036,0.34921268,0.362457751,0.3752356,
                0.387592416,0.39956728,0.411193551,0.4225,0.432926409,

                0.44310755,0.453059959,0.4627984,0.472336093,0.48168495,
                0.4908558,0.49985844,0.508701765,0.51739395,0.525942511,
                0.5343543,0.542635738,0.5507927,0.558830586,0.5667545,
                0.574569133,0.5822789,0.589887907,0.5974,0.604823665,

                0.6121573,0.619404122,0.6265671,0.633649143,0.64065295,
                0.647580967,0.65443563,0.661219252,0.667934,0.674581896,
                0.6811649,0.687684904,0.69414365,0.70054287,0.7068842,
                0.713169109,0.7193991,0.725575614,0.7317,0.734741009,

                0.7377695,0.740785594,0.74378943,0.746781211,0.74976104,
                0.752729087,0.7556855,0.758630368,0.76156384,0.764486065,
                0.76739717,0.770297266,0.7731865,0.776064962,0.77893275,
                0.781790055,0.784637,0.787473608,0.7903,
                
                0.792803968, 0.79530001, 0.797800015, 	
                0.8003, 0.802799995, 0.8053, 0.8078,
                0.81029999, 0.812799985, 0.81529999,0.81779999,
                0.82029999, 0.82279999, 0.82529999, 0.82779999,

                0.83029999, 0.83279999, 0.83529999, 0.83779999, 
                0.84029999, 0.84279999,	0.84529999 
                 
    ];
    this.getCpm = function (level)  {
           var cpm =  this._modifier[(level-1)*2];
           return cpm;
    };
    this.calculateCP= function (level, iv, stat) {
        var cpm = this.getCpm(level);
        var atk = cpm * (iv.Atk + stat.Atk);
        var def = cpm * (iv.Def + stat.Def);
        var hp = cpm * (iv.Hp + stat.Hp);
        var cp = Math.floor((iv.Atk + stat.Atk) * Math.pow(iv.Def + stat.Def, 0.5) * Math.pow(iv.Hp + stat.Hp, 0.5) * Math.pow(cpm, 2) /10);
        return cp;   
    }

    this.getStat = function (name) {
        var file = '/stats.txt';
        $http.get(file) .then(function(rsp) {

                        var rawteam = rsp.split(/\r?\n/) ;

                        console.log("getTeam " +rawteam);
 
           });
    };


 })
.directive('xwindow', ['$window', function ($window) {
     return {
        link: link,
        restrict: 'A'           
     };
     function link(scope, element, attrs){
        scope.width = $window.innerWidth;
        scope.height = $window.innerHeight;

            function onResize(){
                console.log($window.innerWidth);
                // uncomment for only fire when $window.innerWidth change   
                if (scope.width !== $window.innerWidth)
                {
                    scope.width = $window.innerWidth;
                    scope.$digest();
                }
                if (scope.height!== $window.innerHeight)
                {
                    scope.height= $window.innerHeight;
                    scope.$digest();
                }
             };

            function cleanUp() {
                angular.element($window).off('resize', onResize);
            }

            angular.element($window).on('resize', onResize);
            scope.$on('$destroy', cleanUp);
     }    
 }])
.directive('tooltip', function($compile, $sce) {
  return {
    restrict: 'A',
    scope: {
      content: '=tooltipContent'
    },
    link: function(scope, element, attrs) {
	
  		/* Attributes */
    
      scope.displayTooltip = false;
      
      /* Methods */
      scope.updateTooltipOpacity = function(opacity) {
          tooltip.css({
            opacity: opacity,
            'max-width':340
          });
      };
      scope.updateTooltipPosition = function(top, left) {
         var target  = $( this );
/*         var pos_left = target.offset().left + (target.outerWidth()/2); */

/*         if( $( window ).width() < tooltip.outerWidth() * 1.5 )
                tooltip.css( 'max-width', $( window ).width() / 2 );
         else
                tooltip.css( 'max-width', 340 );
 
        var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;
 
            if( pos_left < 0 )
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass( 'left' );
            }
            else
                tooltip.removeClass( 'left' );
 
            if( pos_left + tooltip.outerWidth() > $( window ).width() )
            {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass( 'right' );
            }
            else
                tooltip.removeClass( 'right' );
 
            if( pos_top < 0 )
            {
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass( 'top' );
            }
            else
                tooltip.removeClass( 'top' );
 
            tooltip.css( { left: pos_left, top: pos_top } )
                   .animate( { top: '+=10', opacity: 1 }, 50 );
*/
        tooltip.css({
            top: top + 'px',
            left: left + 'px',
          });
      };
      
      scope.getSafeContent = function(content) {
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
      
      element.on('mouseenter', function(event) {
        scope.displayTooltip = true;
        scope.$digest();
      });
      
      element.on('mousemove', function(event) {
        scope.updateTooltipOpacity(.9);
        scope.updateTooltipPosition(event.clientY - 20, event.clientX + 5);
//        scope.updateTooltipPosition(event.clientY -5, event.clientX + 5);
      });
      
      element.on('mouseleave', function() {
        scope.displayTooltip = false;
        scope.$digest();
      });
      
      /* Compile */
      
      $compile(tooltip)(scope);
    }
  };
  })
 .directive('xtooltip', function(){
    return {
            restrict: 'A',
            link: function(scope, element, attrs){
                element.hover(function(){
                    // on mouseenter
                    
                    element.tooltip({html: 'true', container:'body'});
                    element.tooltip('show');
                }, function(){
                    // on mouseleave
                    element.tooltip('hide');
                });
            }
    };
 }) 
.directive('bs-tooltip', function() {
  return function(scope, element, attrs) {
    attrs.$observe('title',function(title){
      // Destroy any existing tooltips (otherwise new ones won't get initialized)
      element.tooltip('destroy');
      // Only initialize the tooltip if there's text (prevents empty tooltips)
      if (jQuery.trim(title)) element.tooltip();
    });
    element.on('$destroy', function() {
      element.tooltip('destroy');
      delete attrs.$$observers['title'];
    });
  };
})
 .config(['$routeProvider', function ($routeProvider, $routeParams) {
    $routeProvider
       .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/charge/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/charge/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
       .when('/charge/charge', {
        templateUrl: 'views/charge.html',
        controller: 'ChargeCtrl',
        controllerAs: 'charge'
      })
      .when('/charge', {
        templateUrl: 'views/charge.html',
        controller: 'ChargeCtrl',
        controllerAs: 'charge'
      })

      .when('/charge/rx', {
        templateUrl: 'views/rx.html',
        controller: 'RxCtrl',
        controllerAs: 'rx'
      })
      .when('/rx', {
        templateUrl: 'views/rx.html',
        controller: 'RxCtrl',
        controllerAs: 'rx'
      })
       .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
     // $locationProvider.html5Mode(true);

  }]);
