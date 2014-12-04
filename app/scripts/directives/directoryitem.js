'use strict';
/*global angular:false, $:false*/
/**
 * @ngdoc directive
 * @name myApp.directive:directoryitem
 * @description
 * # directoryitem
 */
angular.module('myApp')
  .directive('directoryitem', function ($timeout, $http) {
      return {
          templateUrl: '/views/directoryitem.html',
          restrict: 'AE',
          scope: {
              feed: '='   
          },
          replace: true,
          link: function(scope) {
              scope.feed.timeago = $.timeago(scope.feed.pubDate);
              /*var $e = $('img', element);
              var loaded = false;
              scope.$watch('feed.w', function(w){
                if(!w) {
                  return; 
                }
                loaded = LazyLoad.checkScroll(w, $e, scope.feed.cloudinary.secure_url, scope.feed._id, loaded);
              }, true);*/


              scope.toggle = function(){
                  scope.toggling = true;
                  $http.post('/api/subs/toggle', {
                      podid: scope.feed._id
                  }).success(function(data){
                      $timeout(function(){
                          scope.toggling = false;
                          scope.feed.subscribed = data.subscribed ? [true] : [];
                      });
                  });
              };
          }
      };
  });
