'use strict';

/**
* @ngdoc service
* @name podcaddyApp.MonkeyPatch
* @description
* # MonkeyPatch
* Factory in the podcaddyApp.
*/
angular.module('podcaddyApp')
  .factory('MonkeyPatch', function($rootScope,$timeout,$http){
    return {
      patchSoundManager: function() {
        var throttled = _.throttle(function(){
          $timeout(function(){
            var time = pagePlayer.getTime(pagePlayer.lastSound.position);
            $rootScope.position = time.min+':'+time.sec;
          });
        }, 1000);
        var reportPosition = _.throttle(function(){
          $http.post('/api/position', {
            itemid:pagePlayer.lastSound.id,
            position:pagePlayer.lastSound.position,
            history:(pagePlayer.lastSound.position > pagePlayer.lastSound.duration/10)
          });
        }, 30000);
        soundManager.onready(function(){
          function override(object, methodName, callback) {
            object[methodName] = callback(object[methodName]);
          }

          function after(extraBehavior) {
            return function(original) {
              return function() {
                var returnValue = original.apply(this, arguments);
                extraBehavior.apply(this, arguments);
                return returnValue;
              };
            };
          }

          override(pagePlayer.events, 'play', after(function() {
            $timeout(function(){
              $rootScope.playing = true;
            });
          }));
          override(pagePlayer.events, 'resume', after(function() {
            $timeout(function(){
              $rootScope.playing = true;
              $rootScope.paused = false;
            });
          }));
          override(pagePlayer.events, 'pause', after(function() {
            $timeout(function(){
              $rootScope.playing = false;
              $rootScope.paused = true;
            });
          }));
          override(pagePlayer.events, 'stop', after(function() {
            $timeout(function(){
              $rootScope.playing = false;
            });
          }));
          override(pagePlayer.events, 'whileplaying', after(function() {
            throttled();
            reportPosition();
          }));
        });       
      }
    };
  });
