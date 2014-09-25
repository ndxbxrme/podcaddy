'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
.controller('NavCtrl', function ($scope, NavService, $location) {
    $scope.filters = NavService.filters;
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
    $scope.$watch('filters', function(n){
      if(!n) return;
      $location.path('/' + $scope.filters.period + '/' + $scope.filters.visited + '/' + $scope.filters.direction);
    }, true);
    $scope.submit = function(){
      $http.post('/api/feeds/init', $scope.search)
      .success(function(json){
        console.log(json);
      });
    };
});
