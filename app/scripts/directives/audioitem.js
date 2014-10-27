'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:audioitem
 * @description
 * # audioitem
 */
angular.module('podcaddyApp')
.directive('audioitem', function(PagePlayer, $http, $timeout, LazyLoad){
    return {
        restrict: 'AE',
        templateUrl: '/views/audioitem.html',
        replace: true,
        scope: {
            item: '='  
        },
        link: function(scope, elem) {
            var getOffX = function(o) {
                var curleft = 0;
                if (o.offsetParent) {
                    while (o.offsetParent) {
                        curleft += o.offsetLeft;
                        o = o.offsetParent;
                    }
                }
                else if (o.x) {
                    curleft += o.x;
                }
                return curleft;
            };
            elem.bind('click', function(e){
                if(['position','loading','statusbar'].indexOf(e.target.className)!==-1) {
                    var oControl = e.target;
                    while(oControl.className !== 'statusbar') {
                        oControl = oControl.parentNode;   
                    }
                    PagePlayer.setPosition((e.clientX - getOffX(oControl))/oControl.offsetWidth);
                }
                else if(e.target.tagName==='A' || e.target.parentNode.tagName==='A') {
                    //do nothing
                }
                else {
                    PagePlayer.togglePlay(scope.item);   
                }
            });
            elem.bind('mouseover', function(e) {
                if(['position','loading','statusbar'].indexOf(e.target.className)===-1 && e.target.tagName!=='A' && e.target.parentNode.tagName!=='A') {
                    elem.addClass('hover');
                }
            });
            elem.bind('mouseout', function() {
                elem.removeClass('hover');
                
            });
          
          
            if(PagePlayer.lastSound && PagePlayer.lastSound.id==='item_' + scope.item.id) {
              if(PagePlayer.lastSound.playState===1) {
                elem.addClass('playing'); 
              } else {
                elem.addClass('paused');
              } 
              PagePlayer.updatePosition();
            }
            var $e = $(elem.find('.thumbnail'));
            var loaded = false;
            scope.$watch('item.w', function(w){
              if(!w) {
                return; 
              }
              loaded = LazyLoad.checkScroll(w, $e, scope.item.data.image, scope.item.feedId, loaded);
            }, true);
            scope.skip = function(item) {
              $http.post('/api/skip', {id:item.id})
              .success(function(){
                PagePlayer.fetchData();
              });
            };
            scope.toggleSub = function(feedId){
                $http.post('/api/subs/toggle', {
                    feedid: feedId
                }).success(function(){
                    scope.toggling = false;
                    $timeout(function(){
                      PagePlayer.fetchData();
                    },100);
                });
            };
        }
    };
});