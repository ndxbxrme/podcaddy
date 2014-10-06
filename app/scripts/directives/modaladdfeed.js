'use strict';

/**
 * @ngdoc directive
 * @name podcaddyApp.directive:modalAddFeed
 * @description
 * # modalAddFeed
 */
angular.module('podcaddyApp')
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
                feedid: scope.feed.id
            }).success(function(){
                scope.toggling = false;
                scope.close();
                $rootScope.pagePlayer.fetchData();
            });
        };
      }
    };
  });
