'use strict'

angular.module 'pod'
.directive 'login', (auth) ->
  restrict: 'AE'
  templateUrl: 'directives/login/login.html'
  replace: true
  scope: {}
  link: (scope, elem) ->
    scope.getUser = auth.getUser
    
    scope.login = ->
      scope.submitted = true
      if scope.loginForm.$valid
        $http.post '/api/login',
          email: scope.email
          password: scope.password
        .success ->
          $location.path '/'
        .error ->
          scope.submitted = false
    scope.signup = ->
      scope.submitted = true
      if scope.loginForm.$valid
        $http.post '/api/signup',
          email: scope.email
          password: scope.password
        .success ->
          $location.path '/'
        .error ->
          scope.submitted = false