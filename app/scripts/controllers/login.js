'use strict';
/*jshint bitwise:false*/
angular.module('podcaddyApp')
.controller('LoginCtrl', function($scope, $http, $window, $rootScope, $location) {
    $rootScope.hasNav = false;
    $scope.message = '';  
  
    var doHash = function(str){
        var hash = 0;
        for(var i=0; i<str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
        }
        return hash;
    };
  
    $scope.submit = function() {
        $http.post('/authenticate', angular.extend($scope.user, {password:doHash($scope.user.password)}))
        .success(function(data) {
            $window.sessionStorage.token = data.token;
            $location.path('/');
        })
        .error(function(error){
            delete $window.sessionStorage.token;
            $scope.message = error;
        });
    };
  
    $scope.signup = function() {
        $scope.signingUp = true;
        if($scope.myForm.$valid)
        {
          $http.post('/signup', angular.extend($scope.user, {password:doHash($scope.user.password)}))
          .success(function(data) {
              $window.sessionStorage.token = data.token;
              $location.path('/allfeeds');
          })
          .error(function(error){
              delete $window.sessionStorage.token;
              $scope.message = error;
          });   
        }
    };

});