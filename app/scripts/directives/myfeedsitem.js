'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:myfeedsitem
 * @description
 * # myfeedsitem
 */
angular.module('podcaddyApp')
  .directive('myfeedsitem', function () {
        return {
            templateUrl: '/views/myfeedsitem.html',
            restrict: 'AE',
            scope: {
                feed: '='   
            },
            replace: true,
            link: function postLink(scope, element) {

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
