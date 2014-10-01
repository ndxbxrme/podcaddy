'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
.controller('NavCtrl', function ($scope, NavService, $location, $http) {
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
      $http.post('/api/feeds/add', $scope.search)
      .success(function(feed){
        console.log(feed);
      });
    };
});

