'use strict';

/**
 * @ngdoc service
 * @name myApp.User
 * @description
 * # User
 * Factory in the myApp.
 */
angular.module('myApp')
  .factory('User', function () {

    var isLoggedIn = false;
    var user;
    var message;
    var setUser = function(data) {
      user = data;
    };

    return {
      isLoggedIn:isLoggedIn,
      setUser:setUser,
      user:user,
      message:message
    };
  });
