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
            template: '<li ng-click="toggle()" class="item" ng-class="{subscribed:feed.subscribed}"><h2>{{feed.data.title}}</h2></li>',
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
                    $http.post('/api/subs/toggle', {
                        feedid: scope.feed.id
                    }).success(function(data){
                        scope.feed.subscribed = data.subscribed;
                    });
                };
            }
        };
    });