'use strict';

/**
 * @ngdoc service
 * @name myApp.Auth
 * @description
 * # Auth
 * Factory in the myApp.
 */
angular.module('myApp')
.factory('Auth', function($q, $location, $timeout, User) {
  return function(promise) {
    return promise.then(
      function(response) {
        return response;
      },
      function(response) {
        if(response.status === 401) {
          User.user = undefined;
          if(response.data.length>0) {
            User.message = response.data[0]; 
          }
          else {
            User.message = undefined; 
          }
          $location.url('/login'); 
        }
        return $q.reject(response);
      }
    );
  };
})
.config(function($httpProvider) {
  $httpProvider.responseInterceptors.push('Auth');
});