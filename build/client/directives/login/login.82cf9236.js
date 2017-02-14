(function() {
  'use strict';
  angular.module('pod').directive('login', function(auth) {
    return {
      restrict: 'AE',
      templateUrl: 'directives/login/login.html',
      replace: true,
      scope: {},
      link: function(scope, elem) {
        scope.getUser = auth.getUser;
        scope.login = function() {
          scope.submitted = true;
          if (scope.loginForm.$valid) {
            return $http.post('/api/login', {
              email: scope.email,
              password: scope.password
            }).then(function() {
              return $location.path('/');
            }, function(err) {
              scope.message = err.data;
              return scope.submitted = false;
            });
          }
        };
        return scope.signup = function() {
          scope.submitted = true;
          if (scope.loginForm.$valid) {
            return $http.post('/api/signup', {
              email: scope.email,
              password: scope.password
            }).then(function() {
              return $location.path('/');
            }, function() {
              scope.message = err.data;
              return scope.submitted = false;
            });
          }
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=login.82cf9236.js.map