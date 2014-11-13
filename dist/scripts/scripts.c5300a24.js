"use strict";angular.module("myApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider","$locationProvider",function(a,b){var c=["$q","$location","$http","User","$timeout",function(a,b,c,d,e){var f=a.defer();c.get("/api/user").success(function(a){a?(e(function(){d.user=a}),f.resolve(a)):(f.reject(),b.url("/login"))})}],d=["$q","$http","User","$timeout",function(a,b,c,d){var e=a.defer();b.get("/api/user").success(function(a){d(function(){c.user=a}),e.resolve(a)})}];a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{loggedIn:d}}).when("/login",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{loggedIn:d}}).when("/profile",{templateUrl:"views/profile.html",controller:"ProfileCtrl",resolve:{loggedIn:c}}).when("/allfeeds",{templateUrl:"views/allfeeds.html",controller:"AllfeedsCtrl",resolve:{loggedIn:c}}).when("/myfeeds",{templateUrl:"views/myfeeds.html",controller:"MyfeedsCtrl",resolve:{loggedIn:c}}).when("/addabunchoffeeds",{templateUrl:"views/addabunchoffeeds.html",controller:"AddabunchoffeedsCtrl",resolve:{loggedIn:c}}).when("/:arg1?/:arg2?/:arg3?/:arg4",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{loggedIn:c}}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]),soundManager.setup({flashVersion:9,preferFlash:!0,url:"swf/"}),angular.module("myApp").controller("MainCtrl",["$scope","$http","$location",function(a,b,c){a.login=function(){a.submitted=!0,a.loginForm.$valid&&b.post("/api/login",a.userform).success(function(){c.path("/"),a.submitted=!1})},a.signup=function(){a.submitted=!0,a.loginForm.$valid&&b.post("/api/signup",a.userform).success(function(){c.path("/")})},a.logout=function(){b.get("/api/logout")}}]),angular.module("myApp").factory("User",function(){var a,b,c=!1,d=function(b){a=b};return{isLoggedIn:c,setUser:d,user:a,message:b}}),angular.module("myApp").controller("NavCtrl",["$scope","NavService","$location","$http","$rootScope","$timeout","User",function(a,b,c,d,e,f,g){function h(){d.post("/api/subs/all").success(function(a){console.log(a)})}a.nav=b,a.go=b.go,a.filter=b.filter,a.user=g,a.addfeed=function(){return 0===a.search.url.indexOf("http")?"http://addall"===a.search.url?h():void d.post("/api/pods/add",{url:a.search.url}).success(function(b){a.search.url="",f(function(){b.error?e.modalFeed={message:"There was an error",error:!0,description:"We couldn't read that feed, it was too funky"}:(b.message="You have added a podcast!",e.modalFeed=b),$(".md-modal").addClass("md-show")})}):void 0},a.icons=[];for(var i=0;200>i;i++)a.icons.push(i)}]),angular.module("myApp").controller("ProfileCtrl",["$scope",function(a){a.data="homm"}]),angular.module("myApp").factory("Auth",["$q","$location","$timeout","User",function(a,b,c,d){return function(c){return c.then(function(a){return a},function(c){return 401===c.status&&(d.user=void 0,d.message=c.data.length>0?c.data[0]:void 0,b.url("/login")),a.reject(c)})}}]).config(["$httpProvider",function(a){a.responseInterceptors.push("Auth")}]),angular.module("myApp").controller("PageplayerCtrl",["$route","$rootScope","Timer","NavService","PagePlayer",function(a,b,c,d,e){if(a&&a.current){d.filters.feed="all",d.filters.playlist="none",d.filters.period="week",d.filters.direction="desc",d.filters.visited="unvisited";for(var f=1;5>f;f++)d.parseArg(a.current.params["arg"+f]);"MainCtrl"===a.current.$$route.controller?(d.filters.page="/",e.changePage()):"AllfeedsCtrl"===a.current.$$route.controller?d.filters.page="/allfeeds":"MyfeedsCtrl"===a.current.$$route.controller&&(d.filters.page="/myfeeds")}b.cssPage="mainPage",c.start(),angular.isDefined(b.lazyLoad)&&b.lazyLoad.doScroll()}]),angular.module("myApp").factory("NavService",["$route","$rootScope","$location",function(a,b,c){function d(a){if(a)switch(0===a.indexOf("feed-")&&(e.feed=a.replace(/feed-/,"")),0===a.indexOf("playlist-")&&(e.playlist=a.replace(/playlist-/,"")),a){case"day":e.period="day";break;case"week":e.period="week";break;case"month":e.period="month";break;case"year":e.period="year";break;case"alltime":e.period="alltime";break;case"visited":e.visited="visited";break;case"unvisited":e.visited="unvisited";break;case"all":e.visited="all";break;case"desc":e.direction="desc";break;case"asc":e.direction="asc"}}var e={page:"/",period:"week",visited:"unvisited",direction:"desc",feed:"all",playlist:"none"};return{pageList:[{value:"/",text:"Home",action:"go()"},{value:"/myfeeds",text:"My feeds",action:"go()"},{value:"/allfeeds",text:"Directory",action:"go()"}],periodList:[{value:"day",text:"Day",action:"filter()"},{value:"week",text:"Week",action:"filter()"},{value:"month",text:"Month",action:"filter()"},{value:"year",text:"Year",action:"filter()"},{value:"alltime",text:"All Time",action:"filter()"}],visitedList:[{value:"unvisited",text:"New",action:"filter()"},{value:"visited",text:"Old",action:"filter()"},{value:"all",text:"All",action:"filter()"}],dirList:[{value:"desc",text:"Newest first",action:"filter()"},{value:"asc",text:"Oldest first",action:"filter()"}],filters:e,filter:function(){var a=("all"===e.feed?"":"/feed-"+e.feed)+("none"===e.playlist?"":"/playlist-"+e.playlist)+("week"===e.period?"":"/"+e.period)+("unvisited"===e.visited?"":"/"+e.visited)+("desc"===e.direction?"":"/"+e.direction);c.path(a)},go:function(){c.path(e.page)},parseArg:d}}]),angular.module("myApp").factory("PagePlayer",["NavService","$http","$timeout","$rootScope","$window","LazyLoad",function(a,b,c,d,e,f){function g(){var e=soundManager,g=navigator.userAgent,h=g.match(/ipad|ipod|iphone/i);this.init=function(){e.useFlashBlock=!0},this.getTime=function(a,b){var c=Math.floor(a/1e3),d=Math.floor(c/60),e=c-60*d;return b?d+":"+(10>e?"0"+e:e):{min:d,sec:e}},this.setPosition=function(a){var b=i.lastSound,c=Math.floor(a*i.getDurationEstimate(b));isNaN(c)||(c=Math.min(c,b.duration)),isNaN(c)||b.setPosition(c),b.resume()},this.events={play:function(){$(".playing, .paused").removeClass("playing").removeClass("paused"),$("#"+i.lastSound.id+", .now-playing").addClass("playing")},stop:function(){$(".playing, .paused").removeClass("playing").removeClass("paused")},pause:function(){$(".playing").removeClass("playing").addClass("paused")},resume:function(){$(".playing").removeClass("playing"),$(".paused").removeClass("paused").addClass("playing")},finish:function(){$(".playing, .paused").removeClass("playing").removeClass("paused"),i.skip(i.lastSound.id)},whileloading:function(){$(".playing .loading, .paused .loading").css("width",this.bytesLoaded/this.bytesTotal*100+"%")},onload:function(){},whileplaying:function(){i.updateTime(),i.updatePosition(),j()},error:function(a){console.log(a)}},this.updateTime=function(){$(".playing .sm2_position").text(i.getTime(i.lastSound.position,!0)),$(".playing .sm2_total").text(i.getTime(i.getDurationEstimate(i.lastSound),!0))},this.updatePosition=function(){$(".playing .position").css("width",i.lastSound.position/i.getDurationEstimate(i.lastSound)*100+"%")},this.getDurationEstimate=function(a){return a.instanceOptions.isMovieStar?a.duration:a.durationEstimate||0},this.skip=function(a){c(function(){$("#"+a).next().find(".podimg").click()})},this.togglePlay=function(a){if(i.lastSound&&i.lastSound.id==="item_"+a._id)2!==i.lastSound.readyState&&(1!==i.lastSound.playState?i.lastSound.play():i.lastSound.togglePause());else{i.lastSound&&(e.stop(i.lastSound.id),h||e.unload(i.lastSound.id));var b=e.createSound({id:"item_"+a._id,url:decodeURI(a.url),onplay:i.events.play,onstop:i.events.stop,onpause:i.events.pause,onresume:i.events.resume,onfinish:i.events.finish,whileplaying:i.events.whileplaying,whileloading:i.events.whileloading,onerror:i.events.error});i.lastSound=b,b.play(),d.currentitem=a}},d.lazyLoad=new f([]),this.fetchData=function(){b.get("/api/subscribed/"+a.filters.feed+"/"+a.filters.playlist+"/"+a.filters.period+"/"+a.filters.visited+"/"+a.filters.direction).success(function(a,b){if(200===b){var e=!1;if(a.items.length!==d.lazyLoad.items.length)e=!0;else for(var f=0;f<a.items.length;f++)if(a.items[f].id!==d.lazyLoad.items[f].id){e=!0;break}console.log(!i.lastSound||i.lastSound.id+", "+i.lastSound.playState),e&&(d.lazyLoad.reinit(a.items),i.lastSound&&c(function(){$(".playing, .paused").removeClass("playing").removeClass("paused"),$("#"+i.lastSound.id+", .now-playing").addClass(1===i.lastSound.playState?"playing":"paused"),i.updateTime(),i.updatePosition()}))}})};var i=this}function h(a){return a.target||(e.event?e.event.srcElement:null)}var i,j=_.throttle(function(){b.post("/api/position",{itemid:i.lastSound.id.replace(/[a-z_]+/,""),position:i.lastSound.position,history:i.lastSound.position>i.lastSound.duration/10})},3e4);return e.addEventListener("mousedown",function(a){var b=$(h(a));b.is(".statusbar, .position, .loading")&&i.setPosition(a)}),soundManager.useFlashBlock=!0,soundManager.onready(function(){i=new g,i.init(),i.fetchData()}),{changePage:function(){i&&i.fetchData()},fetchData:function(){i.fetchData()},togglePlay:function(a){i.togglePlay(a)},skip:function(a){i.skip("item_"+a._id)},setPosition:function(a){i.setPosition(a)}}}]),angular.module("myApp").factory("Timer",["$interval","PagePlayer",function(a,b){var c,d=function(){c=a(function(){b.fetchData()},3e5)},e=function(){angular.isDefined(c)&&a.cancel(c)};return{start:d,stop:e}}]),angular.module("myApp").directive("allfeedsitem",["$http","LazyLoad",function(a,b){return{templateUrl:"/views/allfeedsitem.html",restrict:"AE",scope:{feed:"="},replace:!0,link:function(c,d){var e=$("img",d),f=!1;c.$watch("feed.w",function(a){a&&(f=b.checkScroll(a,e,c.feed.cloudinary.url,c.feed._id,f))},!0),c.toggle=function(){c.toggling=!0,a.post("/api/subs/toggle",{podid:c.feed._id}).success(function(a){c.toggling=!1,c.feed.subscribed=a.subscribed?[!0]:[]})}}}}]),angular.module("myApp").directive("audioitem",["PagePlayer","$http","$timeout","LazyLoad",function(a,b,c,d){return{restrict:"AE",templateUrl:"/views/audioitem.html",replace:!0,scope:{item:"="},link:function(e,f){var g=function(a){var b=0;if(a.offsetParent)for(;a.offsetParent;)b+=a.offsetLeft,a=a.offsetParent;else a.x&&(b+=a.x);return b};f.bind("click",function(b){if(-1!==["position","loading","statusbar"].indexOf(b.target.className)){for(var c=b.target;"statusbar"!==c.className;)c=c.parentNode;a.setPosition((b.clientX-g(c))/c.offsetWidth)}else"A"===b.target.tagName||"A"===b.target.parentNode.tagName||a.togglePlay(e.item)}),f.bind("mouseover",function(a){-1===["position","loading","statusbar"].indexOf(a.target.className)&&"A"!==a.target.tagName&&"A"!==a.target.parentNode.tagName&&f.addClass("hover")}),f.bind("mouseout",function(){f.removeClass("hover")}),a.lastSound&&a.lastSound.id==="item_"+e.item.id&&(f.addClass(1===a.lastSound.playState?"playing":"paused"),a.updatePosition());var h=$(f.find(".thumbnail")),i=!1;e.$watch("item.w",function(a){a&&(i=d.checkScroll(a,h,e.item.cloudinary.url,e.item.feedId,i))},!0),e.skip=function(c){b.post("/api/skip",{id:c.id}).success(function(){a.fetchData()})},e.toggleSub=function(d){b.post("/api/subs/toggle",{feedid:d}).success(function(){e.toggling=!1,c(function(){a.fetchData()},100)})}}}}]),angular.module("myApp").directive("dropdown",function(){return{restrict:"A",require:"ngModel",scope:{list:"=dropdown",ngModel:"="},template:'<div class="dropdown" ng-click="open=!open" ng-class="{open:open}"><div ng-repeat="thing in list" style="top: {{($index + 1) * height}}px; -webkit-transition-delay: {{(list.length - $index) * 0.03}}s; z-index: {{list.length - $index}}" ng-hide="!open" ng-click="update(thing)" ng-class="{selected:selected===thing}"><span ng-bind-html="thing.text" class="item"></span></div><span class="title" style="top: 0px; z-index: {{list.length + 1}}"><span ng-bind-html="selected.text" class="item"></span></span><span class="clickscreen" ng-hide="!open">&nbsp;</span></div>',replace:!0,link:function(a,b,c,d){a.height=b[0].offsetHeight,a.$watch("ngModel",function(){angular.forEach(a.list,function(b){d.$modelValue===b.value&&(a.selected=b)})}),a.update=function(b){d.$setViewValue(b.value),d.$render(),b.action&&a.$parent.$eval(b.action)}}}}),angular.module("myApp").directive("ensureUnique",["$http",function(a){return{require:"ngModel",link:function(b,c,d,e){b.$watch(d.ngModel,function(b){b!==d.original&&b?a({method:"POST",url:"/check/"+d.ensureUnique,data:{field:b}}).success(function(a){e.$setValidity("unique",!a.isUnique)}).error(function(){e.$setValidity("unique",!1)}):e.$setValidity("unique",!0)})}}}]),angular.module("myApp").directive("modalAddFeed",["$http","$rootScope",function(a,b){return{templateUrl:"/views/modaladdfeed.html",restrict:"E",scope:{feed:"="},link:function(c,d){c.close=function(){d.find(".md-modal").removeClass("md-show")},c.toggle=function(){c.toggling=!0,a.post("/api/subs/toggle",{feedid:c.feed.id}).success(function(){c.toggling=!1,c.close(),b.pagePlayer.fetchData()})}}}}]),angular.module("myApp").directive("myfeedsitem",["$http","LazyLoad",function(a,b){return{templateUrl:"/views/myfeedsitem.html",restrict:"AE",scope:{feed:"="},replace:!0,link:function(c,d){var e=$(d),f=!1;c.$watch("feed.w",function(a){a&&(f=b.checkScroll(a,e,c.feed.data.image,c.feed.id,f))},!0),c.toggle=function(){c.toggling=!0,a.post("/api/subs/toggle",{feedid:c.feed.id}).success(function(a){c.toggling=!1,c.feed.subscribed=a.subscribed?[!0]:[]})}}}}]),angular.module("myApp").directive("nowPlaying",["PagePlayer",function(a){return{templateUrl:"/views/nowplaying.html",restrict:"E",replace:!0,link:function(b){b.togglePlay=function(b){a.togglePlay(b)},b.skip=function(b){a.skip(b)}}}}]),angular.module("myApp").filter("widow",function(){return function(a){return a.replace(/\s(\S+)$/,"&nbsp;$1")}}),angular.module("myApp").factory("LazyLoad",["$window","$timeout",function(a,b){var c=function(c){var d=this;this.items=c;var e=$(a);this.doScroll=function(){b(function(){_.each(d.items,function(a){a.w={scrollTop:e.scrollTop(),height:e.height(),rnd:Math.random()}})})},this.reinit=function(a){b(function(){d.items=a,d.doScroll()})},d.doScroll(),e.scroll(d.doScroll),e.resize(d.doScroll)};return c.checkScroll=function(a,b,c,d,e){var f=100,g=a.scrollTop,h=g+a.height,i=b.offset().top,j=i+b.height();return j>=g-f&&h+f>=i?(b.hasClass("hidden")&&b.removeClass("hidden"),e||(b.attr("src",c),e=!0)):b.addClass("hidden"),e},c}]),angular.module("myApp").controller("AllfeedsCtrl",["$scope","$rootScope","$http","$location","LazyLoad","Timer",function(a,b,c,d,e,f){b.cssPage="allfeedsPage",f.stop(),c.post("/api/pods/all").success(function(b){a.lazyLoad=new e(b)}),a.initFeeds=function(){a.fetchingFeeds=!0,c.post("api/pods/init").success(function(){})}}]),angular.module("myApp").controller("MyfeedsCtrl",["$scope","$http","Timer",function(a,b,c){c.stop(),b.post("/api/feeds/subs").success(function(b){a.feeds=b})}]),angular.module("myApp").controller("AddabunchoffeedsCtrl",["$scope","$timeout","$http",function(a,b,c){a.submit=function(){function d(){b(function(){c.post("/api/pods/add",{url:e[a.count++]}).success(function(b){a.message=b,a.count<e.length-1&&d()}),a.message=a.count+"/"+e.length+", "+e[a.count-1]},12e3)}var e=a.txtFeeds.split(/\n/g);a.count=0,d()}}]);