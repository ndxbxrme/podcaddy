'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:audioitem
 * @description
 * # audioitem
 */
angular.module('podcaddyApp')
    .directive('audioitem', function () {
        return {
            templateUrl: '/views/audioitem.html',
            restrict: 'E',
            replace: true,
            scope: {
                item: '='  
            },
            link: function postLink(scope, element) {
                $('<img/>').attr('src', scope.item.data.image).load(function(){
                    element.find('.thumbnail').css('background-image', 'url(' + scope.item.data.image + ')'); 
                }).error(function(){
                    $(this).remove();
                    element.find('.thumbnail').css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.item.feedid +')');
                });
                if(!scope.item.data.image) {
                    element.find('.thumbnail').css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.item.feedid +')');   
                }
                //console.log(scope.item.data.description[0]);
                scope.item.data.description[0] = S(scope.item.data.description[0]).stripTags().decodeHTMLEntities().s;
            }
        };
    });
