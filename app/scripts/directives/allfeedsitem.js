'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:allfeedsitem
 * @description
 * # allfeedsitem
 */
angular.module('myApp')
    .directive('allfeedsitem', function ($http, LazyLoad) {
        return {
            templateUrl: '/views/allfeedsitem.html',
            restrict: 'AE',
            scope: {
                feed: '='   
            },
            replace: true,
            link: function postLink(scope, element) {
                
                var $e = $('img', element);
                var loaded = false;
                scope.$watch('feed.w', function(w){
                  if(!w) {
                    return; 
                  }
                  loaded = LazyLoad.checkScroll(w, $e, scope.feed.cloudinary.secure_url, scope.feed._id, loaded);
                }, true);

                
                scope.toggle = function(){
                    scope.toggling = true;
                    $http.post('/api/subs/toggle', {
                        podid: scope.feed._id
                    }).success(function(data){
                        scope.toggling = false;
                        scope.feed.subscribed = data.subscribed ? [true] : [];
                    });
                };
            }
        };
    });
