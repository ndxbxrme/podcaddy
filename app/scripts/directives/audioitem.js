'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:audioitem
 * @description
 * # audioitem
 */
angular.module('podcaddyApp')
    .directive('audioitem', function (PagePlayer, $http) {
        return {
            templateUrl: '/views/audioitem.html',
            restrict: 'E',
            replace: true,
            scope: {
                item: '='  
            },
            link: function postLink(scope, element) {
                if(PagePlayer.lastSound && PagePlayer.lastSound.id==='item_' + scope.item.id) {
                  if(PagePlayer.lastSound.playState===1) {
                    element.addClass('playing'); 
                  } else {
                    element.addClass('paused');
                  } 
                  PagePlayer.updatePosition();
                }
                $('<img/>').attr('src', scope.item.data.image).load(function(){
                    element.find('.thumbnail').css('background-image', 'url(' + scope.item.data.image + ')'); 
                }).error(function(){
                    $(this).remove();
                    element.find('.thumbnail').css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.item.FeedId +')');
                });
                if(!scope.item.data.image) {
                    element.find('.thumbnail').css('background-image', 'url(http://unsplash.it/200/200?image=' + scope.item.FeedId +')');   
                }
                //console.log(scope.item.data.description[0]);
                var d = S(scope.item.data.description[0]).stripTags().decodeHTMLEntities().s;
                if(d.length>255) {
                    d = d.substring(0,255);
                    d = d.replace(/\s+^/, '');
                    d = d + '...';
                }
                scope.item.data.description[0] = d;
              
                scope.togglePlay = function(item) {
                  PagePlayer.togglePlay(item);
                };
                scope.skip = function(item) {
                  $http.post('/api/skip', {id:item.id})
                  .success(function(){
                    PagePlayer.fetchData();
                  });
                };
            }
        };
    });
