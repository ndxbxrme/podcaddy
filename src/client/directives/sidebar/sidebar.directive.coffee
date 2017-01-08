'use strict'

angular.module 'pod'
.directive 'sidebar', ->
  restrict: 'AE'
  templateUrl: 'directives/sidebar/sidebar.html'
  replace: true
  link: (scope, elem) ->
    console.log 'sidebar'