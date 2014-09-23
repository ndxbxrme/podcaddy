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
            template: '<li ng-click="toggle()" class="item" ng-class="{subscribed:feed.subscribed.length>0}" data-title="{{feed.data.title}}" data-description="{{feed.data.description.substring(0,140)}}"><span class="icon-svg482 toggle" ng-show="toggling"></span></li>',
            restrict: 'AE',
            scope: {
                feed: '='   
            },
            link: function postLink(scope, element) {

                $('<img/>').attr('src', scope.feed.data.image).load(function(){
                    element.find('li').css('background-image', 'url(' + scope.feed.data.image + ')'); 
                }).error(function(){
                    $(this).remove();
                    element.find('li').css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.feed.id +')');
                });
                if(!scope.feed.data.image) {
                    console.log('yo');
                    element.find('li').css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.feed.id +')');   
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