'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:audioitem
 * @description
 * # audioitem
 */
angular.module('podcaddyApp')
    .directive('audioitem', function (PagePlayer, $http, $timeout, LazyLoad) {
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
                var $e = $(element.find('.thumbnail'));
                var loaded = false;
                scope.$watch('item.w', function(w){
                  if(!w) {
                    return; 
                  }
                  loaded = LazyLoad.checkScroll(w, $e, scope.item.data.image, scope.item.feedId, loaded);
                }, true);
                var d = S(scope.item.data.description[0])
                .stripTags()
                .decodeHTMLEntities().s;
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
                scope.toggleSub = function(feedId){
                    $http.post('/api/subs/toggle', {
                        feedid: feedId
                    }).success(function(data){
                        scope.toggling = false;
                        $timeout(function(data){
                          PagePlayer.fetchData();
                        },100);
                    });
                };
            }
        };
    });
