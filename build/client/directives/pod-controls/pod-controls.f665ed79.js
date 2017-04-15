(function() {
  'use strict';
  angular.module('pod').directive('podControls', function(player) {
    return {
      restrict: 'E',
      templateUrl: 'directives/pod-controls/pod-controls.html',
      replace: true,
      link: function(scope, elem) {
        return scope.controlsClick = function(e) {
          console.log(e.layerX, $('.statusbar', elem).width());
          e.preventDefault();
          e.cancelBubble = true;
          player.setPosition(e.layerX / $('.statusbar', elem).width());
          return console.log('controls click');
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=pod-controls.f665ed79.js.map
