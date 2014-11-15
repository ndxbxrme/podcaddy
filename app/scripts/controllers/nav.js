'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the myApp
 */
angular.module('myApp')
.controller('NavCtrl', function ($scope, NavService, $location, $http, $rootScope, $timeout, User) {

    $scope.nav = NavService;
    $scope.go = NavService.go;
    $scope.filter = NavService.filter;
    $scope.user = User;
  
    $scope.addfeed = function(){
      if($scope.search.url.indexOf('http')!==0) {
        return; 
      }
      if($scope.search.url === 'http://addall'){
        return addAll(); 
      }
      $http.post('/api/pods/add', {url:$scope.search.url})
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
    $scope.icons = [];
    for(var f=0; f<200; f++) {
      $scope.icons.push(f); 
    }
});