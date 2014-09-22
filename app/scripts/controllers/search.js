'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('SearchCtrl', function ($scope, $http) {
    $scope.submit = function(){
      $http.post('/api/feeds/init', $scope.search)
      .success(function(json){
        console.log(json);
      });
    };
  });
