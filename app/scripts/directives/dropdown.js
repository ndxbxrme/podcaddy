'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:dropDown
 * @description
 * # dropDown
 */
angular.module('podcaddyApp')
  .directive('onRepeatDone', function() {
      return {
          restrict: 'A',
          link: function(scope, element, attributes ) {
              scope.$emit(attributes.onRepeatDone || 'repeat_done', element);
          }
      };
  })
  .directive('dropDown', function ($timeout, NavService) {
    return {
      template: '<div class="cd-dropdown cd-active"><span ng-bind-html="title" ng-click="toggleOpen()"></span><ul><li on-repeat-done="rptDone" ng-repeat="item in data" ng-click="change(item)"><span ng-bind-html="item.html"></span></li></ul></div>',
      restrict: 'E',
      require: 'ngModel',
      replace: true,
      scope: {
        data: '=',
        ngModel: '='
      },
      link:  function(scope, iElem, attr, ngModel){
            scope.title = 'My Title';
            var minZIndex = 1000;
            var opened = false;
            scope.$watch('ngModel', function(n){
              if(!n) {
                return; 
              }
              angular.forEach(scope.data, function(item){
                if(item.value===n) {
                  scope.title = item.html;
                  return;
                }
              });
            });
            scope.$on('rptDone', function(){
              var selectLabel = iElem.find('span')[0];
              var listopts = iElem.find('ul')[0];
              var opts = iElem.find('li');
              var optsCount = opts.length;
              if(optsCount<scope.data.length) {
                return; 
              }
              $timeout(function(){
                var size = { width: iElem.width(), height: iElem.height()};
                selectLabel.style.zIndex = minZIndex + optsCount;
                listopts.style.height = 'auto';
                angular.forEach(opts, function(opt, i){
                  opt.style.zIndex = minZIndex + optsCount - 1 - i;
                  opt.style.top = '0px';
                }); 
                scope.change = function(item) {
                  $timeout(function(){
                    ngModel.$setViewValue(item.value);
                    NavService.redirect();
                  });
                  close();
                };
                function open(){
                  listopts.style.height = ((optsCount + 1) * (size.height)) + 'px';
                  angular.forEach(opts, function(opt, i){
                    opt.style.top = ((i + 1) * (size.height)) + 'px';
                  });
                  opened = true;
                }
                function close(){
                  //listopts.style.height = 'auto';
                  angular.forEach(opts, function(opt) {
                    opt.style.top = '0px';
                  });
                  opened = false;
                }
                scope.toggleOpen = function() {
                  if(opened) {
                    close();
                  } else {
                    open();
                  }
                };
              });
            });
        


        }

        
      };
  });

