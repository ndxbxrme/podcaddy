'use strict';
/*global angular:false*/
/**
 * @ngdoc directive
 * @name myApp.directive:modaladdfeed
 * @description
 * # modaladdfeed
 */
angular.module('myApp')
  .directive('modalAddFeed', function ($http, $rootScope) {
    return {
      templateUrl: '/views/modaladdfeed.html',
      restrict: 'E',
      scope: {
        feed: '=' 
      },
      link:function(scope, element) {
        scope.close = function(){
          element.find('.md-modal').removeClass('md-show'); 
        };
        scope.toggle = function(){
            scope.toggling = true;
            $http.post('/api/subs/toggle', {
                podid: scope.feed.id
            }).success(function(data){
                scope.toggling = false;
                scope.feed.subscribed = data.subscribed ? [true] : [];
                scope.close();
                $rootScope.pagePlayer.fetchData();
            });
        };
      }
    };
  });
