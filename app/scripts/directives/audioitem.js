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
                var imgsrc;
                if(scope.item.data['itunes:image']) {
                    imgsrc = scope.item.data['itunes:image'][0].$.href;   
                }
                else {
                    imgsrc = scope.item.feedimage;   
                }
                if(!imgsrc) {
                    imgsrc = scope.item.data['media:thumbnail'][0].$.url; 
                }
                $('<img/>').attr('src', imgsrc).load(function(){
                    element.find('.thumbnail').css('background-image', 'url(' + imgsrc + ')'); 
                }).error(function(){
                    $(this).remove();
                    element.find('.thumbnail').css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.item.feedid +')');
                });
                if(!imgsrc) {
                    element.find('.thumbnail').css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.item.feedid +')');   
                }
                scope.item.data.description[0] = S(scope.item.data.description[0]).stripTags().decodeHTMLEntities().s;
            }
        };
    });
