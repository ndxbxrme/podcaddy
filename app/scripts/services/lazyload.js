'use strict';

/**
 * @ngdoc service
 * @name podcaddyApp.LazyLoad
 * @description
 * # LazyLoad
 * Factory in the podcaddyApp.
 */
angular.module('podcaddyApp')
  .factory('LazyLoad', function ($window, $timeout) {
    var LazyLoad = function(items) {
      var self = this;
      this.items = items;
      var $w = $($window);
      this.doScroll = function(){
         $timeout(function(){
          _.each(self.items, function(item){
            item.w = {
              scrollTop:$w.scrollTop(),
              height:$w.height(),
              rnd:Math.random()
            };
          });
        });     
      };
      this.reinit = function(items){
        $timeout(function(){
          self.items = items;
          self.doScroll();
        });
      };
      self.doScroll();
      $w.scroll(self.doScroll);
      $w.resize(self.doScroll);
    };
    LazyLoad.checkScroll = function(w, $e, image, feedid, loaded){
      //https://github.com/luis-almeida/unveil/
      var th = 100;
      var wt = w.scrollTop,
          wb = wt + w.height,
          et = $e.offset().top,
          eb = et + $e.height();
      if(eb >= wt - th && et <= wb + th) {
        if($e.hasClass('hidden')) {
          $e.removeClass('hidden'); 
        }
        if(!loaded)
        {
          $('<img/>').attr('src', image).load(function(){
              $e.css('background-image', 'url(' + image + ')'); 
          }).error(function(){
              $(this).remove();
              $e.css('background-image', 'url(http://unsplash.it/200/200?image=' + feedid +')');
          });
          if(!image) {
              $e.css('background-image', 'url(http://unsplash.it/200/200?image=' + feedid +')');   
          }  
          loaded = true;
        }
      } else {
        $e.addClass('hidden'); 
      }
      return loaded;
    };
    return (LazyLoad);
  });
