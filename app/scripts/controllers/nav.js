'use strict';
/*global angular:false, $:false*/
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
      $http.post('/api/pods/add', {url:$scope.search.url})
      .success(function(data){
        $scope.search.url = '';
        $timeout(function(){
          if(!data.error) {
            data.feed.message = 'You have added a podcast!';
            data.feed.subscribed = data.subscribed;
            $rootScope.modalFeed = data.feed;
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
    $scope.logout = function(){
        $http.get('/api/logout');
    };
});