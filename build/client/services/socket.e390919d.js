(function() {
  'use strict';
  angular.module('pod').factory('socket', function(player, auth) {
    var socket;
    socket = io();
    socket.on('connect', function() {
      var user;
      user = auth.getUser();
      if (user) {
        return socket.emit('user', user._id);
      }
    });
    socket.on('disconnect', function() {});
    socket.on('feeds', function() {
      return player.fetchPods();
    });
    return {
      emit: function(message, data) {
        return socket.emit(message, data);
      }
    };
  });

}).call(this);

//# sourceMappingURL=socket.js.map
