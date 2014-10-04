'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:myfeedsitem
 * @description
 * # myfeedsitem
 */
angular.module('podcaddyApp')
  .directive('myfeedsitem', function ($http) {
        return {
            templateUrl: '/views/myfeedsitem.html',
            restrict: 'AE',
            scope: {
                feed: '='   
            },
            replace: true,
            link: function postLink(scope, element) {

                var $e = $(element);
                var loaded = false;
                scope.$watch('feed.w', function(w){
                  if(!w) {
                    return; 
                  }
                  loaded = LazyLoad.checkScroll(w, $e, scope.feed.data.image, scope.feed.id, loaded);
                }, true);
                
                scope.toggle = function(){
                    scope.toggling = true;
                    $http.post('/api/subs/toggle', {
                        feedid: scope.feed.id
                    }).success(function(data){
                        scope.toggling = false;
                        scope.feed.subscribed = data.subscribed ? [true] : [];
                    });
                };
            }
        };
    });