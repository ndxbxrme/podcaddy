'use strict';

/**
 * @ngdoc service
 * @name podcaddyApp.Timer
 * @description
 * # Timer
 * Factory in the podcaddyApp.
 */
angular.module('podcaddyApp')
  .factory('Timer', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
