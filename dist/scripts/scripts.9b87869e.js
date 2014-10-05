"use strict";angular.module("podcaddyApp",["ngAnimate","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/allfeeds",{templateUrl:"views/allfeeds.html",controller:"AllfeedsCtrl"}).when("/myfeeds",{templateUrl:"views/myfeeds.html",controller:"MyfeedsCtrl"}).when("/:arg1?/:arg2?/:arg3?/:arg4",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).run(["$rootScope","PagePlayer","$http",function(a,b,c){a.items=[],a.$on("$routeChangeSuccess",function(){b.changePage()}),c.post("/api")}]),soundManager.setup({flashVersion:9,preferFlash:!0,url:"swf/"}),angular.module("podcaddyApp").factory("authInterceptor",["$rootScope","$q","$window","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.sessionStorage.token&&(a.headers.Authorization="Bearer "+c.sessionStorage.token),a},response:function(a){return 401===a.status&&d.path("/login"),a||b.when(a)},responseError:function(a){return 401===a.status&&d.path("/login"),a||b.when(a)}}}]).config(["$httpProvider",function(a){a.interceptors.push("authInterceptor")}]),angular.module("podcaddyApp").controller("MainCtrl",["$rootScope","$http","Timer",function(a,b,c){a.cssPage="mainPage",c.start(),angular.isDefined(a.lazyLoad)&&a.lazyLoad.doScroll()}]),angular.module("podcaddyApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("podcaddyApp").controller("LoginCtrl",["$scope","$http","$window","$rootScope","$location","Timer",function(a,b,c,d,e,f){f.stop(),d.cssPage="loginPage",a.message="";var g=function(a){for(var b=0,c=0;c<a.length;c++){var d=a.charCodeAt(c);b=(b<<5)-b+d}return b};a.submit=function(){b.post("/authenticate",angular.extend(a.user,{password:g(a.user.password)})).success(function(a){c.sessionStorage.token=a.token,e.path("/")}).error(function(b){delete c.sessionStorage.token,a.message=b})},a.signup=function(){a.signingUp=!0,a.myForm.$valid&&b.post("/signup",angular.extend(a.user,{password:g(a.user.password)})).success(function(b){b.error?(a.message=b.message,a.user.password=""):(c.sessionStorage.token=b.token,e.path("/allfeeds"))}).error(function(b){delete c.sessionStorage.token,a.message=b})}}]),angular.module("podcaddyApp").directive("ensureUnique",["$http",function(a){return{require:"ngModel",link:function(b,c,d,e){b.$watch(d.ngModel,function(b){b!==d.original&&b?a({method:"POST",url:"/check/"+d.ensureUnique,data:{field:b}}).success(function(a){e.$setValidity("unique",!a.isUnique)}).error(function(){e.$setValidity("unique",!1)}):e.$setValidity("unique",!0)})}}}]),angular.module("podcaddyApp").controller("SearchCtrl",["$scope","$http",function(a,b){a.submit=function(){b.post("/api/feeds/init",a.search).success(function(a){console.log(a)})}}]),angular.module("podcaddyApp").controller("AllfeedsCtrl",["$scope","$rootScope","$http","$location","LazyLoad","Timer",function(a,b,c,d,e,f){b.cssPage="allfeedsPage",f.stop(),c.post("/api/feeds/all").success(function(b){a.lazyLoad=new e(b)}),a.initFeeds=function(){a.fetchingFeeds=!0,c.post("api/feeds/init").success(function(){})}}]),angular.module("podcaddyApp").directive("allfeedsitem",["$http","LazyLoad",function(a,b){return{templateUrl:"/views/allfeedsitem.html",restrict:"AE",scope:{feed:"="},replace:!0,link:function(c,d){var e=$(d),f=!1;c.$watch("feed.w",function(a){a&&(f=b.checkScroll(a,e,c.feed.data.image,c.feed.id,f))},!0),c.toggle=function(){c.toggling=!0,a.post("/api/subs/toggle",{feedid:c.feed.id}).success(function(a){c.toggling=!1,c.feed.subscribed=a.subscribed?[!0]:[]})}}}}]),angular.module("podcaddyApp").directive("audioitem",["PagePlayer","$http","$timeout","LazyLoad",function(a,b,c,d){return{templateUrl:"/views/audioitem.html",restrict:"E",replace:!0,scope:{item:"="},link:function(e,f){a.lastSound&&a.lastSound.id==="item_"+e.item.id&&(f.addClass(1===a.lastSound.playState?"playing":"paused"),a.updatePosition());var g=$(f.find(".thumbnail")),h=!1;e.$watch("item.w",function(a){a&&(h=d.checkScroll(a,g,e.item.data.image,e.item.feedId,h))},!0),e.togglePlay=function(b){a.togglePlay(b)},e.skip=function(c){b.post("/api/skip",{id:c.id}).success(function(){a.fetchData()})},e.toggleSub=function(d){b.post("/api/subs/toggle",{feedid:d}).success(function(){e.toggling=!1,c(function(){a.fetchData()},100)})}}}}]),angular.module("podcaddyApp").controller("NavCtrl",["$scope","NavService","$location","$http","$rootScope","$timeout",function(a,b,c,d,e,f){function g(){d.post("/api/subs/all").success(function(a){console.log(a)})}a.filters=b.filters,a.pageList=[{value:"/",html:"Home"},{value:"/myfeeds",html:"My feeds"},{value:"/allfeeds",html:"Directory"}],a.periodList=[{value:"day",html:"Day"},{value:"week",html:"Week"},{value:"month",html:"Month"},{value:"year",html:"Year"},{value:"alltime",html:"All Time"}],a.visitedList=[{value:"unvisited",html:"New"},{value:"visited",html:"Old"},{value:"all",html:"All"}],a.dirList=[{value:"desc",html:"Newest first"},{value:"asc",html:"Oldest first"}],a.submit=function(){return"http://addall"===a.search.url?g():void d.post("/api/feeds/add",{url:a.search.url}).success(function(b){a.search.url="",f(function(){b.error?e.modalFeed={message:"There was an error",error:!0,description:"We couldn't read that feed, it was too funky"}:(b.message="You have added a podcast!",e.modalFeed=b),$(".md-modal").addClass("md-show")})})}}]),angular.module("podcaddyApp").factory("NavService",["$route","$location",function(a,b){var c={period:"week",visited:"unvisited",direction:"desc",feed:"all",playlist:"none"},d=function(){function b(a){switch(0===a.indexOf("feed-")&&(c.feed=a.replace(/feed-/,"")),0===a.indexOf("playlist-")&&(c.playlist=a.replace(/playlist-/,"")),console.log(a),a){case"day":c.period="day";break;case"week":c.period="week";break;case"month":c.period="month";break;case"year":c.period="year";break;case"alltime":c.period="alltime";break;case"visited":c.visited="visited";break;case"unvisited":c.visited="unvisited";break;case"all":c.visited="all";break;case"desc":c.direction="desc";break;case"asc":c.direction="asc"}}a&&a.current&&(c.feed="all",c.playlist="none",a.current.params.arg1&&b(a.current.params.arg1),a.current.params.arg2&&b(a.current.params.arg2),a.current.params.arg3&&b(a.current.params.arg3),a.current.params.arg4&&b(a.current.params.arg4),"MainCtrl"===a.current.$$route.controller?c.page="/":"AllfeedsCtrl"===a.current.$$route.controller?c.page="/allfeeds":"MyfeedsCtrl"===a.current.$$route.controller&&(c.page="/myfeeds"))},e=function(a){"/"===a&&(c.feed="all",c.playlist="none",c.period="week",c.visited="unvisited",c.direction="desc");var d=("all"===c.feed?"":"/feed-"+c.feed)+("none"===c.playlist?"":"/playlist-"+c.playlist)+("week"===c.period?"":"/"+c.period)+("unvisited"===c.visited?"":"/"+c.visited)+("desc"===c.direction?"":"/"+c.direction);"/allfeeds"===c.page?d="/allfeeds":"/myfeeds"===c.page&&(d="/myfeeds"),b.path(d)},f=function(){c={period:"week",visited:"unvisited",direction:"desc",feed:"all",playlist:"none"}};return{parseArgs:d,filters:c,redirect:e,goHome:f}}]),angular.module("podcaddyApp").directive("onRepeatDone",function(){return{restrict:"A",link:function(a,b,c){a.$emit(c.onRepeatDone||"repeat_done",b)}}}).directive("dropDown",["$timeout","NavService",function(a,b){return{template:'<div class="cd-dropdown cd-active"><span ng-bind-html="title" ng-click="toggleOpen()"></span><ul><li on-repeat-done="rptDone" ng-repeat="item in data" ng-click="change(item)"><span ng-bind-html="item.html"></span></li></ul></div>',restrict:"E",require:"ngModel",replace:!0,scope:{data:"=",ngModel:"="},link:function(c,d,e,f){c.title="My Title";var g=1e3,h=!1;c.$watch("ngModel",function(a){a&&angular.forEach(c.data,function(b){return b.value===a?void(c.title=b.html):void 0})}),c.$on("rptDone",function(){var e=d.find("span")[0],i=d.find("ul")[0],j=d.find("li"),k=j.length;k<c.data.length||a(function(){function l(){i.style.height=(k+1)*n.height+"px",angular.forEach(j,function(a,b){a.style.top=(b+1)*n.height+"px"}),h=!0}function m(){angular.forEach(j,function(a){a.style.top="0px"}),i.style.height="auto",h=!1}var n={width:d.width(),height:d.height()};e.style.zIndex=g+k,i.style.height="auto",angular.forEach(j,function(a,b){a.style.zIndex=g+k-1-b,a.style.top="0px"}),c.change=function(c){a(function(){f.$setViewValue(c.value),b.redirect(c.value)}),m()},c.toggleOpen=function(){h?m():l()}})})}}}]),angular.module("podcaddyApp").factory("PagePlayer",["NavService","$http","$timeout","$rootScope","$window","LazyLoad",function(a,b,c,d,e,f){function g(){var e=soundManager;this.init=function(){e.useFlashBlock=!0},this.hasClass=function(a,b){return"undefined"!=typeof a.className?new RegExp("(^|\\s)"+b+"(\\s|$)").test(a.className):!1},this.getOffX=function(a){var b=0;if(a.offsetParent)for(;a.offsetParent;)b+=a.offsetLeft,a=a.offsetParent;else a.x&&(b+=a.x);return b},this.getTime=function(a,b){var c=Math.floor(a/1e3),d=Math.floor(c/60),e=c-60*d;return b?d+":"+(10>e?"0"+e:e):{min:d,sec:e}},this.setPosition=function(a){var b,c,d,e,f=h(a);if(!f)return!0;for(c=f;!g.hasClass(c,"statusbar")&&c.parentNode;)c=c.parentNode;d=g.lastSound,b=parseInt(a.clientX,10),e=Math.floor((b-g.getOffX(c)-4)/c.offsetWidth*g.getDurationEstimate(d)),isNaN(e)||(e=Math.min(e,d.duration)),isNaN(e)||d.setPosition(e),d.resume()},this.events={play:function(){$(".playing").removeClass("playing"),$("#"+g.lastSound.id+", .now-playing").addClass("playing")},stop:function(){$(".playing").removeClass("playing")},pause:function(){$(".playing").removeClass("playing").addClass("paused")},resume:function(){$(".playing").removeClass("playing"),$(".paused").removeClass("paused").addClass("playing")},finish:function(){$(".playing").removeClass("playing"),g.skip(g.lastSound.id)},whileloading:function(){$(".playing .loading, .paused .loading").css("width",this.bytesLoaded/this.bytesTotal*100+"%")},onload:function(){},whileplaying:function(){g.updateTime(),g.updatePosition(),j()},error:function(a){console.log(a)}},this.updateTime=function(){$(".playing .sm2_position").text(g.getTime(g.lastSound.position,!0)),$(".playing .sm2_total").text(g.getTime(g.getDurationEstimate(g.lastSound),!0))},this.updatePosition=function(){$(".playing .position").css("width",g.lastSound.position/g.getDurationEstimate(g.lastSound)*100+"%")},this.getDurationEstimate=function(a){return a.instanceOptions.isMovieStar?a.duration:a.durationEstimate||0},this.skip=function(a){c(function(){$("#"+a).next().find(".podimg").click()})},this.togglePlay=function(a){if(g.lastSound&&g.lastSound.id==="item_"+a.id)2!==g.lastSound.readyState&&(1!==g.lastSound.playState?g.lastSound.play():g.lastSound.togglePause());else{g.lastSound&&(e.stop(g.lastSound.id),e.unload(g.lastSound.id));var b=e.createSound({id:"item_"+a.id,url:decodeURI(a.url),onplay:g.events.play,onstop:g.events.stop,onpause:g.events.pause,onresume:g.events.resume,onfinish:g.events.finish,whileplaying:g.events.whileplaying,whileloading:g.events.whileloading,onerror:g.events.error});g.lastSound=b,b.play(),d.currentitem=a}},d.lazyLoad=new f([]),this.fetchData=function(){b.get("/api/subscribed/"+a.filters.feed+"/"+a.filters.playlist+"/"+a.filters.period+"/"+a.filters.visited+"/"+a.filters.direction).success(function(a,b){if(200===b){var e=!1;if(a.items.length!==d.lazyLoad.items.length)e=!0;else for(var f=0;f<a.items.length;f++)if(a.items[f].id!==d.lazyLoad.items[f].id){e=!0;break}e&&(d.lazyLoad.reinit(a.items),g.lastSound&&c(function(){$("#"+g.lastSound.id).addClass("playing")}))}})};var g=this}function h(a){return a.target||(e.event?e.event.srcElement:null)}var i,j=_.throttle(function(){b.post("/api/position",{itemid:i.lastSound.id.replace(/[a-z_]+/,""),position:i.lastSound.position,history:i.lastSound.position>i.lastSound.duration/10})},3e4);return e.addEventListener("mousedown",function(a){var b=$(h(a));b.is(".statusbar, .position, .loading")&&i.setPosition(a)}),soundManager.useFlashBlock=!0,soundManager.onready(function(){console.log("this is me"),i=new g,i.init(),i.fetchData()}),{changePage:function(){a.parseArgs(),i&&i.fetchData()},fetchData:function(){i.fetchData()},togglePlay:function(a){i.togglePlay(a)},skip:function(a){console.log(a.id),i.skip("item_"+a.id)}}}]),angular.module("podcaddyApp").controller("MyfeedsCtrl",["$scope","$http","Timer",function(a,b,c){c.stop(),b.post("/api/feeds/subs").success(function(b){a.feeds=b})}]),angular.module("podcaddyApp").directive("myfeedsitem",["$http","LazyLoad",function(a,b){return{templateUrl:"/views/myfeedsitem.html",restrict:"AE",scope:{feed:"="},replace:!0,link:function(c,d){var e=$(d),f=!1;c.$watch("feed.w",function(a){a&&(f=b.checkScroll(a,e,c.feed.data.image,c.feed.id,f))},!0),c.toggle=function(){c.toggling=!0,a.post("/api/subs/toggle",{feedid:c.feed.id}).success(function(a){c.toggling=!1,c.feed.subscribed=a.subscribed?[!0]:[]})}}}}]),angular.module("podcaddyApp").factory("LazyLoad",["$window","$timeout",function(a,b){var c=function(c){var d=this;this.items=c;var e=$(a);this.doScroll=function(){b(function(){_.each(d.items,function(a){a.w={scrollTop:e.scrollTop(),height:e.height(),rnd:Math.random()}})})},this.reinit=function(a){b(function(){d.items=a,d.doScroll()})},d.doScroll(),e.scroll(d.doScroll),e.resize(d.doScroll)};return c.checkScroll=function(a,b,c,d,e){var f=100,g=a.scrollTop,h=g+a.height,i=b.offset().top,j=i+b.height();return j>=g-f&&h+f>=i?(b.hasClass("hidden")&&b.removeClass("hidden"),e||($("<img/>").attr("src",c).load(function(){b.css("background-image","url("+c+")")}).error(function(){$(this).remove(),b.css("background-image","url(http://unsplash.it/200/200?image="+d+")")}),c||b.css("background-image","url(http://unsplash.it/200/200?image="+d+")"),e=!0)):b.addClass("hidden"),e},c}]),angular.module("podcaddyApp").factory("Timer",["$interval","PagePlayer",function(a,b){var c,d=function(){c=a(function(){b.fetchData()},3e5)},e=function(){angular.isDefined(c)&&a.cancel(c)};return{start:d,stop:e}}]),angular.module("podcaddyApp").directive("modalAddFeed",["$http",function(a){return{templateUrl:"/views/modaladdfeed.html",restrict:"E",scope:{feed:"="},link:function(b,c){b.close=function(){c.find(".md-modal").removeClass("md-show")},b.toggle=function(){b.toggling=!0,a.post("/api/subs/toggle",{feedid:b.feed.id}).success(function(){b.toggling=!1,b.close()})}}}}]),angular.module("podcaddyApp").directive("nowPlaying",["PagePlayer",function(a){return{templateUrl:"/views/nowplaying.html",restrict:"E",replace:!0,link:function(b){b.togglePlay=function(b){a.togglePlay(b)},b.skip=function(b){a.skip(b)}}}}]);