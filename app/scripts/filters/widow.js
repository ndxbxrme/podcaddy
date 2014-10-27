'use strict';

/**
 * @ngdoc filter
 * @name podcaddyApp.filter:widow
 * @function
 * @description
 * # widow
 * Filter in the podcaddyApp.
 */
angular.module('podcaddyApp')
.filter('widow', function(){
    return function(input) {
        return input.replace(/\s(\S+)$/,'&nbsp;$1');  
    };
});
