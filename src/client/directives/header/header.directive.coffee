'use strict'

angular.module 'pod'
.directive 'header', () ->
  restrict: 'AE'
  templateUrl: 'directives/header/header.html'
  replace: true
  scope: {}
  link: (scope, elem) ->