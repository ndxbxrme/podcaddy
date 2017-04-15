(function() {
  'use strict';
  angular.module('pod').directive('login', function(auth, $http, $location) {
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
              return $location.path('/feeds');
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

//# sourceMappingURL=login.bdaae14e.js.map
