'use strict';
/*jshint bitwise:false*/
angular.module('podcaddyApp')
.controller('LoginCtrl', function($scope, $http, $window, $rootScope, $location, Timer) {
    Timer.stop();
    $rootScope.cssPage = 'loginPage';
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
            $rootScope.loggedIn = true;
            $window.sessionStorage.token = data.token;
            $location.path('/');
        })
        .error(function(error){
            $rootScope.loggedIn = false;
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
              if(!data.error) {
                $rootScope.loggedIn = true;
                $window.sessionStorage.token = data.token;
                $location.path('/allfeeds');
              } else {
                $rootScope.loggedIn = false;
                $scope.message = data.message; 
                $scope.user.password = '';
              }
          })
          .error(function(error){
              $rootScope.loggedIn = false;
              delete $window.sessionStorage.token;
              $scope.message = error;
          });   
        }
    };

});