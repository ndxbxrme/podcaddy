'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:allfeedsitem
 * @description
 * # allfeedsitem
 */
angular.module('podcaddyApp')
    .directive('allfeedsitem', function ($http) {
        return {
            templateUrl: '/views/allfeedsitem.html',
            restrict: 'AE',
            scope: {
                feed: '='   
            },
            replace: true,
            link: function postLink(scope, element) {
                var $e = $(element);
                var th = 0;
                scope.$watch('feed.w', function(w){
                  if(!w) {
                    return; 
                  }
                  //https://github.com/luis-almeida/unveil/
                  var wt = w.scrollTop,
                      wb = wt + w.height,
                      et = $e.offset().top,
                      eb = et + $e.height();
                  if(eb >= wt - th && et <= wb + th) {
                    $('<img/>').attr('src', scope.feed.data.image).load(function(){
                        element.css('background-image', 'url(' + scope.feed.data.image + ')'); 
                    }).error(function(){
                        $(this).remove();
                        element.css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.feed.id +')');
                    });
                    if(!scope.feed.data.image) {
                        console.log('yo');
                        element.css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.feed.id +')');   
                    }                
                  }
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
