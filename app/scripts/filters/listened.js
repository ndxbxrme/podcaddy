'use strict';

/**
 * @ngdoc filter
 * @name myApp.filter:listened
 * @function
 * @description
 * # listened
 * Filter in the myApp.
 */
angular.module('myApp')
  .filter('listened', function (NavService, PagePlayer) {
    return function (input) {
      var filteredItems = [];
      angular.forEach(input, function(item){
        if(PagePlayer.lastSoundId()===item._id) {
          filteredItems.push(item);
        }
        else {
          if(NavService.filters.visited==='unvisited') {
            if(!item.listened) {
              filteredItems.push(item); 
            }
          }
          else if(NavService.filters.visited==='visited') {
            if(item.listened) {
              filteredItems.push(item); 
            }
          }
          else {
            filteredItems.push(item);
          }
        }
      });
      return filteredItems;
    };
  });
