'use strict';

/**
 * @ngdoc service
 * @name podcaddyApp.PagePlayer
 * @description
 * # PagePlayer
 * Factory in the podcaddyApp.
 */
angular.module('podcaddyApp')
  .factory('PagePlayer', function (NavService, $http, $timeout, $rootScope, $window) {
    var reportPosition = _.throttle(function(){
      $http.post('/api/position', {
        itemid:pagePlayer.lastSound.id.replace(/[a-z_]+/,''),
        position:pagePlayer.lastSound.position,
        history:(pagePlayer.lastSound.position > pagePlayer.lastSound.duration/10)
      });
    }, 30000);
    var pagePlayer;
    function PagePlayer() {
      var sm = soundManager;
      this.init = function(){
        sm.useFlashBlock = true;
      };
      this.hasClass = function(o, cStr) {
        return (typeof(o.className)!=='undefined'?new RegExp('(^|\\s)'+cStr+'(\\s|$)').test(o.className):false);
      };
      this.getOffX = function(o) {
        // http://www.xs4all.nl/~ppk/js/findpos.html
        var curleft = 0;
        if (o.offsetParent) {
          while (o.offsetParent) {
            curleft += o.offsetLeft;
            o = o.offsetParent;
          }
        }
        else if (o.x) {
          curleft += o.x;
        }
        return curleft;
      };

      this.getTime = function(nMSec, bAsString) {
        // convert milliseconds to mm:ss, return as object literal or string
        var nSec = Math.floor(nMSec/1000),
            min = Math.floor(nSec/60),
            sec = nSec-(min*60);
        // if (min === 0 && sec === 0) return null; // return 0:00 as null
        return (bAsString?(min+':'+(sec<10?'0'+sec:sec)):{'min':min,'sec':sec});
      };
      this.setPosition = function(e) {
        // called from slider control
        var oThis = getTheDamnTarget(e),
            x, oControl, oSound, nMsecOffset;
        if (!oThis) {
          return true;
        }
        oControl = oThis;
        while (!self.hasClass(oControl,'statusbar') && oControl.parentNode) {
          oControl = oControl.parentNode;
        }
        oSound = self.lastSound;
        x = parseInt(e.clientX,10);
        // play sound at this position
        nMsecOffset = Math.floor((x-self.getOffX(oControl)-4)/(oControl.offsetWidth)*self.getDurationEstimate(oSound));
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
          $('.playing').removeClass('playing');
          $('#' + self.lastSound.id).addClass('playing');
        },
        stop: function() {
          $('#' + self.lastSound.id).removeClass('playing');
        },
        pause: function() {
          $('#' + self.lastSound.id).removeClass('playing').addClass('paused');
        },
        resume: function() {
          $('.playing').removeClass('playing');
          $('#' + self.lastSound.id).removeClass('paused').addClass('playing');
        },
        finish: function() {
          $('#' + self.lastSound.id).removeClass('playing'); 
          $('#' + self.lastSound.id).next().find('.podimg').click();
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
      this.togglePlay = function(item){
        if(self.lastSound && self.lastSound.id==='item_' + item.id) {
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
            sm.unload(self.lastSound.id);//might have to do something here for IOS
          }
          var thisSound = sm.createSound({
            id:'item_' + item.id,
            url:decodeURI(item.data.enclosure[0].$.url),
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
        }
      };
      this.fetchData = function(){
        $http.get('/api/subscribed/' + 
                  NavService.filters.feed + '/' + 
                  NavService.filters.playlist + '/' + 
                  NavService.filters.period + '/' + 
                  NavService.filters.visited + '/' + 
                  NavService.filters.direction)
        .success(function(items, status){
          if(status===200) {
            $timeout(function(){
              $rootScope.items = items;
            });
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
      console.log('this is me');
      pagePlayer = new PagePlayer();
      pagePlayer.init();
      pagePlayer.fetchData();
    });

    // Public API here
    return {
      changePage: function(){
        NavService.parseArgs();
        if(pagePlayer) {
          pagePlayer.fetchData();
        }
      },
      fetchData: function(){
        pagePlayer.fetchData();
      },
      togglePlay: function(item){
        pagePlayer.togglePlay(item);
      }
    };
  });
