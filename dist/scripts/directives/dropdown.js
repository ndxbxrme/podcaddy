'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:dropdown
 * @description
 * # dropdown
 */
angular.module('myApp')
.directive('dropdown', function(){
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            list: '=dropdown',
            ngModel: '='
        },
        template: '<div class="dropdown" ng-click="open=!open" ng-class="{open:open}"><div ng-repeat="thing in list" style="top: {{($index + 1) * height}}px; -webkit-transition-delay: {{(list.length - $index) * 0.03}}s; z-index: {{list.length - $index}}" ng-hide="!open" ng-click="update(thing)" ng-class="{selected:selected===thing}"><span ng-bind-html="thing.text" class="item"></span></div><span class="title" style="top: 0px; z-index: {{list.length + 1}}"><span ng-bind-html="selected.text" class="item"></span></span><span class="clickscreen" ng-hide="!open">&nbsp;</span></div>',
        replace: true,
        link: function(scope, elem, attrs, ngModel) {
            scope.height = elem[0].offsetHeight;
            scope.$watch('ngModel',function(){
                angular.forEach(scope.list, function(item){
                    if(ngModel.$modelValue===item.value){
                       scope.selected = item;
                    }
                });
            });
            scope.update = function(thing) {
                ngModel.$setViewValue(thing.value);
                ngModel.$render(); 
                if(thing.action) {
                    scope.$parent.$eval(thing.action);   
                }
            };
        }
    };
});

