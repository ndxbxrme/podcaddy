'use strict';

/**
 * @ngdoc function
 * @name podcaddyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the podcaddyApp
 */
angular.module('podcaddyApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    $http.get('/api/subscribed')
    .success(function(items){
      $scope.items = items;
      if(pagePlayer) {
          pagePlayer.init();
      }
      console.log(items);
    });
  });
