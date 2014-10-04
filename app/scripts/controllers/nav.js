'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
.controller('NavCtrl', function ($scope, NavService, $location, $http, $rootScope, $timeout) {
    $scope.filters = NavService.filters;
    $scope.pageList = [
      {value:'/', html:'Home'},
      {value:'/myfeeds', html:'My feeds'},
      {value:'/allfeeds', html:'Directory'}
    ];
    $scope.periodList = [
      {value:'day',html:'Day'},
      {value:'week',html:'Week'},
      {value:'month',html:'Month'},
      {value:'year',html:'Year'},
      {value:'alltime',html:'All Time'}
    ];
    $scope.visitedList = [
      {value:'unvisited',html:'New'},
      {value:'visited', html:'Old'},
      {value:'all', html:'All'}
    ];
    $scope.dirList = [
        {value:'desc',html:'Newest first'},
        {value:'asc', html:'Oldest first'}
    ];
    $scope.submit = function(){
      if($scope.search.url === 'http://addall'){
        return addAll(); 
      }
      $http.post('/api/feeds/add', {url:$scope.search.url})
      .success(function(feed){
        $scope.search.url = '';
        $timeout(function(){
          if(!feed.error) {
            feed.message = 'You have added a podcast!';
            $rootScope.modalFeed = feed;
          } else {
            $rootScope.modalFeed = {
              message:'There was an error',
              error: true,
              description:'We couldn\'t read that feed, it was too funky'
            };
          }
            $('.md-modal').addClass('md-show');
        });
      });
    };
    function addAll(){
      $http.post('/api/subs/all')
      .success(function(data){
        console.log(data);
      });
    }
});

