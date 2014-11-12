'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:AddabunchoffeedsCtrl
 * @description
 * # AddabunchoffeedsCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('AddabunchoffeedsCtrl', function ($scope, $timeout, $http) {
    $scope.submit = function() {
      var urls = $scope.txtFeeds.split(/\n/g);
      $scope.count = 0;
      function addPod(){
        $timeout(function(){
          $http.post('/api/pods/add', {url:urls[$scope.count++]})
          .success(function(data){
            $scope.message = data;
            if($scope.count<urls.length-1) {
              addPod(); 
            }
          });
          $scope.message = $scope.count + '/' + urls.length + ', ' + urls[$scope.count-1];       
        },12000);
      }
      addPod();
    };
  });
