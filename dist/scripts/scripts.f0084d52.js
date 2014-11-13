'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * # myApp
 *
 * Main module of the application.
 */
angular
  .module('myApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
  
    var checkLogin = function($q, $location, $http, User, $timeout) {
      var deferred = $q.defer();
      $http.get('/api/user')
      .success(function(user){
        if(user) {
          $timeout(function(){
            User.user = user;
          });
          deferred.resolve(user);
        }
        else {
          deferred.reject();
          $location.url('/login');
        }
      });
    };
  
    var softLogin = function($q, $http, User, $timeout) {
      var deferred = $q.defer();
      $http.get('/api/user')
      .success(function(user) {
        $timeout(function(){
          User.user = user;
        });
        deferred.resolve(user);
      });
    };
  
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {loggedIn:softLogin}
      })
      .when('/login', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {loggedIn:softLogin}
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/allfeeds', {
        templateUrl: 'views/allfeeds.html',
        controller: 'AllfeedsCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/myfeeds', {
        templateUrl: 'views/myfeeds.html',
        controller: 'MyfeedsCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/addabunchoffeeds', {
        templateUrl: 'views/addabunchoffeeds.html',
        controller: 'AddabunchoffeedsCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .when('/:arg1?/:arg2?/:arg3?/:arg4', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {loggedIn:checkLogin}
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  });

soundManager.setup({
  flashVersion: 9,
  preferFlash: true,
  url: 'swf/'
});
'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myApp
 */
angular.module('myApp')
.controller('MainCtrl', function ($scope, $http, $location) {
  $scope.login = function(){
    $scope.submitted = true;
    if($scope.loginForm.$valid) {
      $http.post('/api/login', $scope.userform)
      .success(function(){
        $location.path('/');
        $scope.submitted = false;
      });
    }
  };
  $scope.signup = function(){
    $scope.submitted = true;
    if($scope.loginForm.$valid) {
      $http.post('/api/signup', $scope.userform)
      .success(function(){
        $location.path('/');
      });
    }
  };
  $scope.logout = function(){
    $http.get('/api/logout');
  };
});

'use strict';

/**
 * @ngdoc service
 * @name myApp.User
 * @description
 * # User
 * Factory in the myApp.
 */
angular.module('myApp')
  .factory('User', function () {

    var isLoggedIn = false;
    var user;
    var message;
    var setUser = function(data) {
      user = data;
    };

    return {
      isLoggedIn:isLoggedIn,
      setUser:setUser,
      user:user,
      message:message
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the myApp
 */
angular.module('myApp')
.controller('NavCtrl', function ($scope, NavService, $location, $http, $rootScope, $timeout, User) {
    $scope.nav = NavService;
    $scope.go = NavService.go;
    $scope.filter = NavService.filter;
    $scope.user = User;
  
    $scope.addfeed = function(){
      if($scope.search.url.indexOf('http')!==0) {
        return; 
      }
      if($scope.search.url === 'http://addall'){
        return addAll(); 
      }
      $http.post('/api/pods/add', {url:$scope.search.url})
      .success(function(feed){
        $scope.search.url = '';
        $timeout(function(){
          if(!feed.error) {
            feed.message = 'You have added a podcast!';
            $rootScope.modalFeed = feed;
          } else {
            $rootScope.modalFeed = {
              message:'There was an error',
              error: true,
              description:'We couldn\'t read that feed, it was too funky'
            };
          }
            $('.md-modal').addClass('md-show');
        });
      });
    };
    function addAll(){
      $http.post('/api/subs/all')
      .success(function(data){
        console.log(data);
      });
    }
    $scope.icons = [];
    for(var f=0; f<200; f++) {
      $scope.icons.push(f); 
    }
});
'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('ProfileCtrl', function ($scope) {
    $scope.data = 'homm';
    /*$http.get('/api')
    .success(function(data){
      $scope.data = data;
    });*/
  });

'use strict';

/**
 * @ngdoc service
 * @name myApp.Auth
 * @description
 * # Auth
 * Factory in the myApp.
 */
angular.module('myApp')
.factory('Auth', function($q, $location, $timeout, User) {
  return function(promise) {
    return promise.then(
      function(response) {
        return response;
      },
      function(response) {
        if(response.status === 401) {
          User.user = undefined;
          if(response.data.length>0) {
            User.message = response.data[0]; 
          }
          else {
            User.message = undefined; 
          }
          $location.url('/login'); 
        }
        return $q.reject(response);
      }
    );
  };
})
.config(function($httpProvider) {
  $httpProvider.responseInterceptors.push('Auth');
});
'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:PageplayerCtrl
 * @description
 * # PageplayerCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('PageplayerCtrl', function ($route, $rootScope, Timer, NavService, PagePlayer) {
    if($route && $route.current) {
        NavService.filters.feed = 'all';
        NavService.filters.playlist = 'none';
        NavService.filters.period = 'week';
        NavService.filters.direction = 'desc';
        NavService.filters.visited = 'unvisited';
        for(var f=1; f<5; f++) {
            NavService.parseArg($route.current.params['arg' + f]);   
        }
        if($route.current.$$route.controller==='MainCtrl') {
          NavService.filters.page = '/';
          PagePlayer.changePage();
        }
        else if($route.current.$$route.controller==='AllfeedsCtrl') {
          NavService.filters.page = '/allfeeds';          
        }
        else if($route.current.$$route.controller==='MyfeedsCtrl') {
          NavService.filters.page = '/myfeeds';          
        }
    }
    $rootScope.cssPage = 'mainPage';
    Timer.start();
    if(angular.isDefined($rootScope.lazyLoad)) {
      $rootScope.lazyLoad.doScroll();
    } 
  });

'use strict';

/**
 * @ngdoc service
 * @name myApp.NavService
 * @description
 * # NavService
 * Factory in the myApp.
 */
angular.module('myApp')
.factory('NavService', function($route, $rootScope, $location){
    var filters = {
        page: '/',
        period : 'week',
        visited : 'unvisited',
        direction : 'desc',
        feed : 'all',
        playlist : 'none'
    };
    function parseArg(arg){
        if(!arg) {
            return;
        }
        if(arg.indexOf('feed-')===0) {
            filters.feed = arg.replace(/feed-/,''); 
        }
        if(arg.indexOf('playlist-')===0) {
            filters.playlist = arg.replace(/playlist-/,''); 
        }
        switch(arg) {
            case 'day':
                filters.period = 'day';
                break;
            case 'week':
                filters.period = 'week';
                break;
            case 'month':
                filters.period = 'month';
                break;
            case 'year':
                filters.period = 'year';
                break;
            case 'alltime':
                filters.period = 'alltime';
                break;
            case 'visited':
                filters.visited = 'visited';
                break;
            case 'unvisited':
                filters.visited = 'unvisited';
                break;
            case 'all':
                filters.visited = 'all';
                break;
            case 'desc':
                filters.direction = 'desc';
                break;
            case 'asc':
                filters.direction = 'asc';
                break;
        }
    }
    return {
        pageList: [
            {value:'/', text:'Home', action:'go()'},
            {value:'/myfeeds', text:'My feeds', action:'go()'},
            {value:'/allfeeds', text:'Directory', action:'go()'}
        ],
        periodList: [
            {value:'day',text:'Day', action:'filter()'},
            {value:'week',text:'Week', action:'filter()'},
            {value:'month',text:'Month', action:'filter()'},
            {value:'year',text:'Year', action:'filter()'},
            {value:'alltime',text:'All Time', action:'filter()'}
        ],
        visitedList: [
            {value:'unvisited',text:'New', action:'filter()'},
            {value:'visited', text:'Old', action:'filter()'},
            {value:'all', text:'All', action:'filter()'}
        ],
        dirList: [
            {value:'desc',text:'Newest first', action:'filter()'},
            {value:'asc', text:'Oldest first', action:'filter()'}
        ],
        filters: filters,
        filter: function(){
            var url = (filters.feed==='all'?'':'/feed-'+filters.feed) +
                (filters.playlist==='none'?'':'/playlist-'+filters.playlist) + 
                (filters.period==='week'?'':'/'+filters.period) +
                (filters.visited==='unvisited'?'':'/'+filters.visited) + 
                (filters.direction==='desc'?'':'/'+filters.direction);
            $location.path(url);
        },
        go: function(){
            $location.path(filters.page);
        },
        parseArg: parseArg
        
    };
});

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

'use strict';

/**
 * @ngdoc service
 * @name myApp.Timer
 * @description
 * # Timer
 * Factory in the myApp.
 */
angular.module('myApp')
  .factory('Timer', function ($interval, PagePlayer) {
    var int;
    var start = function(){
      int = $interval(function(){
        PagePlayer.fetchData();
      }, 1000 * 60 * 5);
    };
    var stop = function(){
      if(angular.isDefined(int)) {
        $interval.cancel(int); 
      }
    };
    return {
      start: start,
      stop: stop
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:allfeedsitem
 * @description
 * # allfeedsitem
 */
angular.module('myApp')
    .directive('allfeedsitem', function ($http, LazyLoad) {
        return {
            templateUrl: '/views/allfeedsitem.html',
            restrict: 'AE',
            scope: {
                feed: '='   
            },
            replace: true,
            link: function postLink(scope, element) {
                /*console.log(scope.feed);
                var $e = $('img', element);
                var loaded = false;
                scope.$watch('feed.w', function(w){
                  if(!w) {
                    return; 
                  }
                  loaded = LazyLoad.checkScroll(w, $e, scope.feed.cloudinary.url, scope.feed._id, loaded);
                }, true);*/

                
                scope.toggle = function(){
                    scope.toggling = true;
                    $http.post('/api/subs/toggle', {
                        podid: scope.feed._id
                    }).success(function(data){
                        scope.toggling = false;
                        scope.feed.subscribed = data.subscribed ? [true] : [];
                    });
                };
            }
        };
    });

'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:audioitem
 * @description
 * # audioitem
 */
angular.module('myApp')
.directive('audioitem', function(PagePlayer, $http, $timeout, LazyLoad){
    return {
        restrict: 'AE',
        templateUrl: '/views/audioitem.html',
        replace: true,
        scope: {
            item: '='  
        },
        link: function(scope, elem) {
            var getOffX = function(o) {
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
            elem.bind('click', function(e){
                if(['position','loading','statusbar'].indexOf(e.target.className)!==-1) {
                    var oControl = e.target;
                    while(oControl.className !== 'statusbar') {
                        oControl = oControl.parentNode;   
                    }
                    PagePlayer.setPosition((e.clientX - getOffX(oControl))/oControl.offsetWidth);
                }
                else if(e.target.tagName==='A' || e.target.parentNode.tagName==='A') {
                    //do nothing
                }
                else {
                    PagePlayer.togglePlay(scope.item);   
                }
            });
            elem.bind('mouseover', function(e) {
                if(['position','loading','statusbar'].indexOf(e.target.className)===-1 && e.target.tagName!=='A' && e.target.parentNode.tagName!=='A') {
                    elem.addClass('hover');
                }
            });
            elem.bind('mouseout', function() {
                elem.removeClass('hover');
                
            });
          
          
            if(PagePlayer.lastSound && PagePlayer.lastSound.id==='item_' + scope.item.id) {
              if(PagePlayer.lastSound.playState===1) {
                elem.addClass('playing'); 
              } else {
                elem.addClass('paused');
              } 
              PagePlayer.updatePosition();
            }
            var $e = $(elem.find('.thumbnail'));
            var loaded = false;
            scope.$watch('item.w', function(w){
              if(!w) {
                return; 
              }
              loaded = LazyLoad.checkScroll(w, $e, scope.item.cloudinary.url, scope.item.feedId, loaded);
            }, true);
            scope.skip = function(item) {
              $http.post('/api/skip', {id:item.id})
              .success(function(){
                PagePlayer.fetchData();
              });
            };
            scope.toggleSub = function(feedId){
                $http.post('/api/subs/toggle', {
                    feedid: feedId
                }).success(function(){
                    scope.toggling = false;
                    $timeout(function(){
                      PagePlayer.fetchData();
                    },100);
                });
            };
        }
    };
});
'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:dropdown
 * @description
 * # dropdown
 */
angular.module('myApp')
.directive('dropdown', function(){
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            list: '=dropdown',
            ngModel: '='
        },
        template: '<div class="dropdown" ng-click="open=!open" ng-class="{open:open}"><div ng-repeat="thing in list" style="top: {{($index + 1) * height}}px; -webkit-transition-delay: {{(list.length - $index) * 0.03}}s; z-index: {{list.length - $index}}" ng-hide="!open" ng-click="update(thing)" ng-class="{selected:selected===thing}"><span ng-bind-html="thing.text" class="item"></span></div><span class="title" style="top: 0px; z-index: {{list.length + 1}}"><span ng-bind-html="selected.text" class="item"></span></span><span class="clickscreen" ng-hide="!open">&nbsp;</span></div>',
        replace: true,
        link: function(scope, elem, attrs, ngModel) {
            scope.height = elem[0].offsetHeight;
            scope.$watch('ngModel',function(){
                angular.forEach(scope.list, function(item){
                    if(ngModel.$modelValue===item.value){
                       scope.selected = item;
                    }
                });
            });
            scope.update = function(thing) {
                ngModel.$setViewValue(thing.value);
                ngModel.$render(); 
                if(thing.action) {
                    scope.$parent.$eval(thing.action);   
                }
            };
        }
    };
});


'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:ensureUnique
 * @description
 * # ensureUnique
 */
angular.module('myApp')
    .directive('ensureUnique', ['$http', function ($http) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                scope.$watch(attrs.ngModel, function (n) {
                    if (n === attrs.original || !n) {
                        c.$setValidity('unique', true);
                    } else {
                        $http({
                            method: 'POST',
                            url: '/check/' + attrs.ensureUnique,
                            data: { 'field': n }
                        }).success(function (data) {
                            c.$setValidity('unique', !data.isUnique);
                        }).error(function () {
                            c.$setValidity('unique', false);
                        });
                    }
                });
            }
        };
    }]);

'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:modaladdfeed
 * @description
 * # modaladdfeed
 */
angular.module('myApp')
  .directive('modalAddFeed', function ($http, $rootScope) {
    return {
      templateUrl: '/views/modaladdfeed.html',
      restrict: 'E',
      scope: {
        feed: '=' 
      },
      link:function(scope, element) {
        scope.close = function(){
          element.find('.md-modal').removeClass('md-show'); 
        };
        scope.toggle = function(){
            scope.toggling = true;
            $http.post('/api/subs/toggle', {
                feedid: scope.feed.id
            }).success(function(){
                scope.toggling = false;
                scope.close();
                $rootScope.pagePlayer.fetchData();
            });
        };
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:myfeedsitem
 * @description
 * # myfeedsitem
 */
angular.module('myApp')
  .directive('myfeedsitem', function ($http, LazyLoad) {
        return {
            templateUrl: '/views/myfeedsitem.html',
            restrict: 'AE',
            scope: {
                feed: '='   
            },
            replace: true,
            link: function postLink(scope, element) {

                var $e = $(element);
                var loaded = false;
                scope.$watch('feed.w', function(w){
                  if(!w) {
                    return; 
                  }
                  loaded = LazyLoad.checkScroll(w, $e, scope.feed.data.image, scope.feed.id, loaded);
                }, true);
                
                scope.toggle = function(){
                    scope.toggling = true;
                    $http.post('/api/subs/toggle', {
                        feedid: scope.feed.id
                    }).success(function(data){
                        scope.toggling = false;
                        scope.feed.subscribed = data.subscribed ? [true] : [];
                    });
                };
            }
        };
    });

'use strict';

/**
 * @ngdoc directive
 * @name myApp.directive:nowplaying
 * @description
 * # nowplaying
 */
angular.module('myApp')
  .directive('nowPlaying', function (PagePlayer) {
    return {
      templateUrl: '/views/nowplaying.html',
      restrict: 'E',
      replace: true,
      link: function(scope) {
        scope.togglePlay = function(item){
          PagePlayer.togglePlay(item);
        };
        scope.skip = function(item){
          PagePlayer.skip(item);
        };
      }
    };
  });

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

'use strict';

/**
 * @ngdoc service
 * @name myApp.LazyLoad
 * @description
 * # LazyLoad
 * Factory in the myApp.
 */
angular.module('myApp')
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
          $e.attr('src', image); 
          loaded = true;
        }
      } else {
        $e.addClass('hidden'); 
      }
      return loaded;
    };
    return (LazyLoad);
  });

'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:AllfeedsCtrl
 * @description
 * # AllfeedsCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('AllfeedsCtrl', function ($scope, $rootScope, $http, $location, LazyLoad, Timer) {
    $rootScope.cssPage = 'allfeedsPage';
    Timer.stop();
    $http.post('/api/pods/all')
    .success(function(feeds){
      $scope.lazyLoad = new LazyLoad(feeds);
      //doScroll();
    });
  
    $scope.initFeeds = function() {
      $scope.fetchingFeeds = true;
      $http.post('api/pods/init')
      .success(function(){
        //$location.path('/allfeeds');
      });
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:MyfeedsCtrl
 * @description
 * # MyfeedsCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('MyfeedsCtrl', function ($scope, $http, Timer) {
    Timer.stop();
    $http.post('/api/feeds/subs')
    .success(function(feeds){
      $scope.feeds = feeds;
    });
  });

'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:AddabunchoffeedsCtrl
 * @description
 * # AddabunchoffeedsCtrl
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('AddabunchoffeedsCtrl', function ($scope, $timeout, $http) {
    $scope.submit = function() {
      var urls = $scope.txtFeeds.split(/\n/g);
      $scope.count = 0;
      function addPod(){
        $timeout(function(){
          $http.post('/api/pods/add', {url:urls[$scope.count++]})
          .success(function(data){
            $scope.message = data;
            if($scope.count<urls.length-1) {
              addPod(); 
            }
          });
          $scope.message = $scope.count + '/' + urls.length + ', ' + urls[$scope.count-1];       
        },12000);
      }
      addPod();
    };
  });
