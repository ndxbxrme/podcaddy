'use strict';

/**
 * @ngdoc service
 * @name myApp.PagePlayer
 * @description
 * # PagePlayer
 * Factory in the myApp.
 */
angular.module('myApp')
  .factory('PagePlayer', function (NavService, $http, $timeout, $rootScope, $window, LazyLoad) {
    var reportPosition = _.throttle(function(){
      $http.post('/api/position', {
        itemid:pagePlayer.lastSound.id.replace(/[a-z_]+/,''),
        position:pagePlayer.lastSound.position,
        history:(pagePlayer.lastSound.position > pagePlayer.lastSound.duration/10)
      });
    }, 30000);
    var pagePlayer;
    function PagePlayer() {
      var sm = soundManager,
          ua = navigator.userAgent,
          isTouchDevice = (ua.match(/ipad|ipod|iphone/i));
      this.init = function(){
        sm.useFlashBlock = true;
      };
      this.getTime = function(nMSec, bAsString) {
        // convert milliseconds to mm:ss, return as object literal or string
        var nSec = Math.floor(nMSec/1000),
            min = Math.floor(nSec/60),
            sec = nSec-(min*60);
        // if (min === 0 && sec === 0) return null; // return 0:00 as null
        return (bAsString?(min+':'+(sec<10?'0'+sec:sec)):{'min':min,'sec':sec});
      };
      this.setPosition = function(pos) {

        var oSound = self.lastSound;

        var nMsecOffset = Math.floor(pos*self.getDurationEstimate(oSound));
        if (!isNaN(nMsecOffset)) {
          nMsecOffset = Math.min(nMsecOffset,oSound.duration);
        }
        if (!isNaN(nMsecOffset)) {
          oSound.setPosition(nMsecOffset);
        }
        oSound.resume();
      };
      this.events = {
        play: function() {
          $('.playing, .paused').removeClass('playing').removeClass('paused');
          $('#' + self.lastSound.id + ', .now-playing').addClass('playing');
        },
        stop: function() {
          $('.playing, .paused').removeClass('playing').removeClass('paused');
        },
        pause: function() {
          $('.playing').removeClass('playing').addClass('paused');
        },
        resume: function() {
          $('.playing').removeClass('playing');
          $('.paused').removeClass('paused').addClass('playing');
        },
        finish: function() {
          $('.playing, .paused').removeClass('playing').removeClass('paused');
          self.skip(self.lastSound.id);
        },
        whileloading: function() {
          $('.playing .loading, .paused .loading').css('width', (((this.bytesLoaded/this.bytesTotal)*100)+'%'));
        },
        onload: function() {
          
        },
        whileplaying: function() {
          self.updateTime();
          self.updatePosition();
          reportPosition();
        },
        error: function(err) {
          console.log(err); 
        }
      };
      this.updateTime = function(){
        $('.playing .sm2_position').text(self.getTime(self.lastSound.position, true));
        $('.playing .sm2_total').text(self.getTime(self.getDurationEstimate(self.lastSound),true));
      };
      this.updatePosition = function(){
        $('.playing .position').css('width', (((self.lastSound.position/self.getDurationEstimate(self.lastSound))*100)+'%'));
      };
      this.getDurationEstimate = function(oSound) {
        if (oSound.instanceOptions.isMovieStar) {
          return (oSound.duration);
        } else {
          return (oSound.durationEstimate||0);
        }
      };
      this.skip = function(itemId){
        $timeout(function(){
          $('#' + itemId).next().find('.podimg').click();
        });
      };
      this.togglePlay = function(item){
        if(self.lastSound && self.lastSound.id==='item_' + item._id) {
          if(self.lastSound.readyState !== 2) {
            if(self.lastSound.playState !== 1) {
              self.lastSound.play();
            } else {
              self.lastSound.togglePause(); 
            }
          } else {
            //error, couldn't load 
          }
        } else {
          if(self.lastSound) {
            sm.stop(self.lastSound.id);
            if(!isTouchDevice) {
              sm.unload(self.lastSound.id);
            }
          }
          var thisSound = sm.createSound({
            id:'item_' + item._id,
            url:decodeURI(item.url),
            onplay: self.events.play,
            onstop: self.events.stop,
            onpause: self.events.pause,
            onresume: self.events.resume,
            onfinish: self.events.finish,
            whileplaying: self.events.whileplaying,
            whileloading: self.events.whileloading,
            onerror: self.events.error
          });
          self.lastSound = thisSound;
          thisSound.play();
          $rootScope.currentitem = item;
         
        }
      };
      $rootScope.lazyLoad = new LazyLoad([]);
      this.fetchData = function(){
        $http.get('/api/subscribed/' + 
          NavService.filters.feed + '/' + 
          NavService.filters.playlist + '/' + 
          NavService.filters.period + '/' + 
          NavService.filters.visited + '/' + 
          NavService.filters.direction
        )
        .success(function(data, status){
          if(status===200) {
            var needsUpdate = false;
            if(data.items.length!==$rootScope.lazyLoad.items.length) {
              needsUpdate = true; 
            }
            else {
              for(var f=0; f<data.items.length; f++) {
                if(data.items[f].id!==$rootScope.lazyLoad.items[f].id) {
                  needsUpdate = true;
                  break;
                }
              }
            }
            console.log(!self.lastSound || (self.lastSound.id + ', ' + self.lastSound.playState));
            if(needsUpdate) {
              $rootScope.lazyLoad.reinit(data.items);
              if(self.lastSound) {
                $timeout(function(){
                  $('.playing, .paused').removeClass('playing').removeClass('paused');
                  if(self.lastSound.playState===1) {
                    $('#' + self.lastSound.id + ', .now-playing').addClass('playing'); 
                  }
                  else {
                    $('#' + self.lastSound.id + ', .now-playing').addClass('paused'); 
                  }
                  self.updateTime();
                  self.updatePosition();
                });
              }
            }
          }
        });
      };
      var self = this;
    }
    function getTheDamnTarget(e) {
      return (e.target||($window.event?$window.event.srcElement:null));
    }
    $window.addEventListener('mousedown', function(e){
      var o = $(getTheDamnTarget(e));
      if(o.is('.statusbar, .position, .loading')){
        pagePlayer.setPosition(e);
      }
    });

  
    soundManager.useFlashBlock = true;

    soundManager.onready(function() {
      pagePlayer = new PagePlayer();
      pagePlayer.init();
      pagePlayer.fetchData();
    });

    // Public API here
    return {
      changePage: function(){
        if(pagePlayer) {
          pagePlayer.fetchData();
        }
      },
      fetchData: function(){
        pagePlayer.fetchData();
      },
      togglePlay: function(item){
        pagePlayer.togglePlay(item);
      },
      skip: function(item){
        pagePlayer.skip('item_' + item._id); 
      },
      setPosition: function(pos){
        pagePlayer.setPosition(pos); 
      }
    };
  });
