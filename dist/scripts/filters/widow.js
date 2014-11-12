'use strict';

/**
 * @ngdoc filter
 * @name myApp.filter:widow
 * @function
 * @description
 * # widow
 * Filter in the myApp.
 */
angular.module('myApp')
.filter('widow', function(){
    return function(input) {
        return input.replace(/\s(\S+)$/,'&nbsp;$1');  
    };
});
