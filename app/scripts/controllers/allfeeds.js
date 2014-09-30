'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:AllfeedsCtrl
 * @description
 * # AllfeedsCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('AllfeedsCtrl', function ($scope, $http, $location, $timeout, $window) {
    console.log('check me out');
    $http.post('/api/feeds/all')
    .success(function(feeds){
      $scope.feeds = feeds;
      doScroll();
    });
  
    $scope.initFeeds = function() {
      $scope.fetchingFeeds = true;
      $http.post('api/feeds/init')
      .success(function(data){
        //$location.path('/allfeeds');
      });
    };
    var $w = $($window);
    $w.scroll(doScroll);
    $w.resize(doScroll);
    function doScroll(){
       $timeout(function(){
        _.each($scope.feeds, function(feed){
          feed.w = {
            scrollTop:$w.scrollTop(),
            height:$w.height()
          };
        });
      });     
    }
  });
