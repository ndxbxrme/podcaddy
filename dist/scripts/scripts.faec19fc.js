"use strict";angular.module("myApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider","$locationProvider",function(a,b){var c=["$q","$location","$http","User",function(a,b,c,d){var e=a.defer();return c.get("/api/user").success(function(a){a?(d.user=a,e.resolve(a)):(e.reject(),b.url("/login"))}),e.promise}],d=["$q","$http","User",function(a,b,c){var d=a.defer();return b.get("/api/user").success(function(a){c.user=a,d.resolve(a)}),d.promise}];a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{loggedIn:d}}).when("/login",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{loggedIn:d}}).when("/profile",{templateUrl:"views/profile.html",controller:"ProfileCtrl",resolve:{loggedIn:c}}).when("/allfeeds",{templateUrl:"views/allfeeds.html",controller:"AllfeedsCtrl",resolve:{loggedIn:c}}).when("/myfeeds",{templateUrl:"views/myfeeds.html",controller:"MyfeedsCtrl",resolve:{loggedIn:c}}).when("/addabunchoffeeds",{templateUrl:"views/addabunchoffeeds.html",controller:"AddabunchoffeedsCtrl",resolve:{loggedIn:c}}).when("/:arg1?/:arg2?/:arg3?/:arg4",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{loggedIn:c}}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).run(["$rootScope","PagePlayer","NavService","$route",function(a,b,c,d){a.loading=!1,a.$on("$routeChangeSuccess",function(){if(d&&d.current){c.filters.feed="all",c.filters.playlist="none",c.filters.period="week",c.filters.direction="desc",c.filters.visited="unvisited";for(var a=1;5>a;a++)c.parseArg(d.current.params["arg"+a]);"MainCtrl"===d.current.$$route.controller?(c.filters.page="/",b.changePage()):"AllfeedsCtrl"===d.current.$$route.controller?c.filters.page="/allfeeds":"MyfeedsCtrl"===d.current.$$route.controller?c.filters.page="/myfeeds":"ProfileCtrl"===d.current.$$route.controller&&(c.filters.page="/profile"),$.scrollTo(0,600,{axis:"y"})}})}]),soundManager.setup({flashVersion:9,preferFlash:!0,url:"swf/"}),angular.module("myApp").controller("MainCtrl",["$rootScope",function(a){a.cssPage="noPage"}]),angular.module("myApp").factory("User",function(){var a,b,c=!1,d=function(b){a=b};return{isLoggedIn:c,setUser:d,user:a,message:b}}),angular.module("myApp").controller("NavCtrl",["$scope","NavService","$location","$http","$rootScope","$timeout","User",function(a,b,c,d,e,f,g){a.nav=b,a.go=b.go,a.filter=b.filter,a.user=g,a.addfeed=function(){0===a.search.url.indexOf("http")&&d.post("/api/pods/add",{url:a.search.url}).success(function(b){a.search.url="",f(function(){b.error?e.modalFeed={message:"There was an error",error:!0,description:"We couldn't read that feed, it was too funky"}:(b.feed.message="You have added a podcast!",b.feed.subscribed=b.subscribed,e.modalFeed=b.feed),$(".md-modal").addClass("md-show")})})},a.logout=function(){d.get("/api/logout")}}]),angular.module("myApp").controller("ProfileCtrl",["$scope","$rootScope",function(a,b){b.cssPage="profilePage"}]),angular.module("myApp").factory("Auth",["$q","$location","$timeout","User",function(a,b,c,d){return function(c){return c.then(function(a){return a},function(c){return 401===c.status&&(d.user=void 0,d.message=c.data.length>0?c.data[0]:void 0,b.url("/login")),a.reject(c)})}}]).config(["$httpProvider",function(a){a.responseInterceptors.push("Auth")}]),angular.module("myApp").controller("PageplayerCtrl",["$route","$rootScope","Timer",function(a,b,c){b.cssPage="mainPage",c.start(),angular.isDefined(b.lazyLoad)&&b.lazyLoad.doScroll()}]),angular.module("myApp").factory("NavService",["$route","$rootScope","$location","$http",function(a,b,c,d){function e(a){if(a)switch(0===a.indexOf("feed-")&&(f.feed=a.replace(/feed-/,"")),0===a.indexOf("playlist-")&&(f.playlist=a.replace(/playlist-/,"")),a){case"day":f.period="day";break;case"week":f.period="week";break;case"month":f.period="month";break;case"year":f.period="year";break;case"alltime":f.period="alltime";break;case"visited":f.visited="visited";break;case"unvisited":f.visited="unvisited";break;case"all":f.visited="all";break;case"desc":f.direction="desc";break;case"asc":f.direction="asc"}}var f={page:"/",period:"week",visited:"unvisited",direction:"desc",feed:"all",playlist:"none"};return{pageList:[{value:"/",text:"Home",action:"go()"},{value:"/myfeeds",text:"My feeds",action:"go()"},{value:"/allfeeds",text:"Directory",action:"go()"},{value:"/profile",text:"Profile",action:"go()"},{value:"/logout",text:"Log out",action:"logout()"}],periodList:[{value:"day",text:"Day",action:"filter()"},{value:"week",text:"Week",action:"filter()"},{value:"month",text:"Month",action:"filter()"},{value:"year",text:"Year",action:"filter()"},{value:"alltime",text:"All Time",action:"filter()"}],visitedList:[{value:"unvisited",text:"New",action:"filter()"},{value:"visited",text:"Old",action:"filter()"},{value:"all",text:"All",action:"filter()"}],dirList:[{value:"desc",text:"Newest first",action:"filter()"},{value:"asc",text:"Oldest first",action:"filter()"}],filters:f,filter:function(){var a=("all"===f.feed?"":"/feed-"+f.feed)+("none"===f.playlist?"":"/playlist-"+f.playlist)+("week"===f.period?"":"/"+f.period)+("unvisited"===f.visited?"":"/"+f.visited)+("desc"===f.direction?"":"/"+f.direction);c.path(a)},go:function(){b.lazyLoad=void 0,c.path(f.page)},logout:function(){d.get("/api/logout")},parseArg:e}}]),angular.module("myApp").factory("PagePlayer",["NavService","$http","$timeout","$rootScope","$window","LazyLoad",function(a,b,c,d,e,f){function g(){var e=soundManager,g=navigator.userAgent,h=g.match(/ipad|ipod|iphone/i);this.init=function(){e.useFlashBlock=!0},this.getTime=function(a,b){var c=Math.floor(a/1e3),d=Math.floor(c/60),e=c-60*d;return b?d+":"+(10>e?"0"+e:e):{min:d,sec:e}},this.setPosition=function(a){var b=i.lastSound,c=Math.floor(a*i.getDurationEstimate(b));isNaN(c)||(c=Math.min(c,b.duration)),isNaN(c)||b.setPosition(c),b.resume()},this.events={play:function(){$(".playing, .paused").removeClass("playing").removeClass("paused"),$("#"+i.lastSound.id+", .now-playing").addClass("playing")},stop:function(){$(".playing, .paused").removeClass("playing").removeClass("paused")},pause:function(){$(".playing").removeClass("playing").addClass("paused")},resume:function(){$(".playing").removeClass("playing"),$(".paused").removeClass("paused").addClass("playing")},finish:function(){$(".playing, .paused").removeClass("playing").removeClass("paused"),i.skip(i.lastSound.id)},whileloading:function(){$(".playing .loading, .paused .loading").css("width",this.bytesLoaded/this.bytesTotal*100+"%")},onload:function(){},whileplaying:function(){i.updateTime(),i.updatePosition(),j()},error:function(a){console.log(a)}},this.updateTime=function(){$(".playing .sm2_position").text(i.getTime(i.lastSound.position,!0)),$(".playing .sm2_total").text(i.getTime(i.getDurationEstimate(i.lastSound),!0))},this.updatePosition=function(){$(".playing .position").css("width",i.lastSound.position/i.getDurationEstimate(i.lastSound)*100+"%")},this.getDurationEstimate=function(a){return a.instanceOptions.isMovieStar?a.duration:a.durationEstimate||0},this.skip=function(a){c(function(){_.each(d.lazyLoad.items,function(b){b._id===a&&(b.listened=!0)});var b=$("#"+a).next();b.find(".podimg").click(),$.scrollTo("#"+b.id,600,{axit:"y",offset:{top:-100}})})},this.togglePlay=function(a){if(i.lastSound&&i.lastSound.id===a._id)2!==i.lastSound.readyState&&(1!==i.lastSound.playState?i.lastSound.play():i.lastSound.togglePause());else{i.lastSound&&(e.stop(i.lastSound.id),h||e.unload(i.lastSound.id));var b=e.createSound({id:a._id,url:decodeURI(a.url),onplay:i.events.play,onstop:i.events.stop,onpause:i.events.pause,onresume:i.events.resume,onfinish:i.events.finish,whileplaying:i.events.whileplaying,whileloading:i.events.whileloading,onerror:i.events.error});i.lastSound=b,b.play(),d.currentitem=a,flare.emit({category:"Play",action:"click",label:a.url,value:4}),console.log("emitted flare")}},d.lazyLoad=new f([]),this.fetchData=function(){d.loading=!0,b.get("/api/subscribed/"+a.filters.feed+"/"+a.filters.playlist+"/"+a.filters.period+"/"+a.filters.visited+"/"+a.filters.direction).success(function(a,b){if(d.loading=!1,200===b){var e=!1;if(d.noSubs=a.noSubs,d.lazyLoad&&a.items.length===d.lazyLoad.items.length){for(var g=0;g<a.items.length;g++)if(a.items[g].id!==d.lazyLoad.items[g].id){e=!0;break}}else e=!0;e&&(d.lazyLoad?d.lazyLoad.reinit(a.items):d.lazyLoad=new f(a.items),i.lastSound&&c(function(){$(".playing, .paused").removeClass("playing").removeClass("paused"),$("#"+i.lastSound.id+", .now-playing").addClass(1===i.lastSound.playState?"playing":"paused"),i.updateTime(),i.updatePosition()}))}})};var i=this}function h(a){return a.target||(e.event?e.event.srcElement:null)}var i,j=_.throttle(function(){b.post("/api/position",{itemid:i.lastSound.id,position:i.lastSound.position,history:i.lastSound.position>i.lastSound.duration/10})},3e4);return e.addEventListener("mousedown",function(a){var b=$(h(a));b.is(".statusbar, .position, .loading")&&i.setPosition(a)}),soundManager.useFlashBlock=!0,soundManager.onready(function(){i=new g,i.init(),i.fetchData()}),{changePage:function(){i&&i.fetchData()},fetchData:function(){i.fetchData()},togglePlay:function(a){i.togglePlay(a)},skip:function(a){i.skip(a._id)},setPosition:function(a){i.setPosition(a)},lastSoundId:function(){return i.lastSound?i.lastSound.id:""}}}]),angular.module("myApp").factory("Timer",["$interval","PagePlayer",function(a,b){var c,d=function(){c=a(function(){b.fetchData()},3e5)},e=function(){angular.isDefined(c)&&a.cancel(c)};return{start:d,stop:e}}]),angular.module("myApp").directive("allfeedsitem",["$http","LazyLoad",function(a,b){return{templateUrl:"/views/allfeedsitem.html",restrict:"AE",scope:{feed:"="},replace:!0,link:function(c,d){var e=$("img",d),f=!1;c.$watch("feed.w",function(a){a&&(f=b.checkScroll(a,e,c.feed.cloudinary.secure_url,c.feed._id,f))},!0),c.toggle=function(){c.toggling=!0,a.post("/api/subs/toggle",{podid:c.feed._id}).success(function(a){c.toggling=!1,c.feed.subscribed=a.subscribed?[!0]:[]})}}}}]),angular.module("myApp").directive("audioitem",["PagePlayer","$http","$timeout","LazyLoad",function(a,b,c,d){return{restrict:"AE",templateUrl:"/views/audioitem.html",replace:!0,scope:{item:"="},link:function(e,f){e.item.timeago=$.timeago(e.item.pubDate);var g=function(a){var b=0;if(a.offsetParent)for(;a.offsetParent;)b+=a.offsetLeft,a=a.offsetParent;else a.x&&(b+=a.x);return b};f.bind("click",function(b){if(-1!==["position","loading","statusbar"].indexOf(b.target.className)){for(var c=b.target;"statusbar"!==c.className;)c=c.parentNode;a.setPosition((b.clientX-g(c))/c.offsetWidth)}else"A"===b.target.tagName||"A"===b.target.parentNode.tagName||a.togglePlay(e.item)}),f.bind("mouseover",function(a){-1===["position","loading","statusbar"].indexOf(a.target.className)&&"A"!==a.target.tagName&&"A"!==a.target.parentNode.tagName&&f.addClass("hover")}),f.bind("mouseout",function(){f.removeClass("hover")}),a.lastSoundId()===e.item.id&&(f.addClass(1===a.lastSound.playState?"playing":"paused"),a.updatePosition());var h=$(f.find(".thumbnail")),i=!1;e.$watch("item.w",function(a){a&&(e.item.timeago=$.timeago(e.item.pubDate),i=d.checkScroll(a,h,e.item.cloudinary.secure_url,e.item.feedId,i))},!0),e.skip=function(c){b.post("/api/skip",{id:c.id}).success(function(){a.fetchData()})},e.toggleSub=function(d){b.post("/api/subs/toggle",{feedid:d}).success(function(){e.toggling=!1,c(function(){a.fetchData()},100)})}}}}]),angular.module("myApp").directive("dropdown",function(){return{restrict:"A",require:"ngModel",scope:{list:"=dropdown",ngModel:"="},template:'<div class="dropdown" ng-click="open=!open" ng-class="{open:open}"><div ng-repeat="thing in list" style="top: {{($index + 1) * height}}px; -webkit-transition-delay: {{(list.length - $index) * 0.02}}s; z-index: {{list.length - $index}}" ng-hide="!open" ng-click="update(thing)" ng-class="{selected:selected===thing}"><span ng-bind-html="thing.text" class="item"></span></div><span class="title" style="top: 0px; z-index: {{list.length + 1}}"><span ng-bind-html="selected.text" class="item"></span></span><span class="clickscreen" ng-hide="!open">&nbsp;</span></div>',replace:!0,link:function(a,b,c,d){a.height=b[0].offsetHeight,a.$watch("ngModel",function(){angular.forEach(a.list,function(b){d.$modelValue===b.value&&(a.selected=b)})}),a.update=function(b){d.$setViewValue(b.value),d.$render(),b.action&&a.$parent.$eval(b.action)}}}}),angular.module("myApp").directive("ensureUnique",["$http",function(a){return{require:"ngModel",link:function(b,c,d,e){b.$watch(d.ngModel,function(b){b!==d.original&&b?a({method:"POST",url:"/check/"+d.ensureUnique,data:{field:b}}).success(function(a){e.$setValidity("unique",!a.isUnique)}).error(function(){e.$setValidity("unique",!1)}):e.$setValidity("unique",!0)})}}}]),angular.module("myApp").directive("modalAddFeed",["$http","$rootScope",function(a,b){return{templateUrl:"/views/modaladdfeed.html",restrict:"E",scope:{feed:"="},link:function(c,d){c.close=function(){d.find(".md-modal").removeClass("md-show")},c.toggle=function(){c.toggling=!0,a.post("/api/subs/toggle",{podid:c.feed._id}).success(function(a){c.toggling=!1,c.feed.subscribed=a.subscribed?[!0]:[],c.close(),b.pagePlayer.fetchData()})}}}}]),angular.module("myApp").directive("myfeedsitem",["$http","LazyLoad",function(a,b){return{templateUrl:"/views/myfeedsitem.html",restrict:"AE",scope:{feed:"="},replace:!0,link:function(c,d){var e=$(d),f=!1;c.$watch("feed.w",function(a){a&&(f=b.checkScroll(a,e,c.feed.cloudinary.secure_url,c.feed.id,f))},!0),c.toggle=function(){c.toggling=!0,a.post("/api/subs/toggle",{feedid:c.feed.id}).success(function(a){c.toggling=!1,c.feed.subscribed=a.subscribed?[!0]:[]})}}}}]),angular.module("myApp").directive("nowPlaying",["PagePlayer",function(a){return{templateUrl:"/views/nowplaying.html",restrict:"E",replace:!0,link:function(b){b.togglePlay=function(b){a.togglePlay(b)},b.skip=function(b){a.skip(b)}}}}]),angular.module("myApp").filter("widow",function(){return function(a){return a.replace(/\s(\S+)$/,"&nbsp;$1")}}),angular.module("myApp").factory("LazyLoad",["$window","$timeout",function(a,b){var c=function(c){var d=this;this.items=c;var e=$(a);this.doScroll=function(){b(function(){_.each(d.items,function(a){a.w={scrollTop:e.scrollTop(),height:e.height(),rnd:Math.random()}})})},this.reinit=function(a){b(function(){d.items=a,d.doScroll()})},d.doScroll(),e.scroll(d.doScroll),e.resize(d.doScroll)};return c.checkScroll=function(a,b,c,d,e){var f=100,g=a.scrollTop,h=g+a.height,i=b.offset().top,j=i+b.height();return j>=g-f&&h+f>=i?(b.hasClass("hidden")&&b.removeClass("hidden"),e||(b.attr("src",c),e=!0)):b.addClass("hidden"),e},c}]),angular.module("myApp").controller("AllfeedsCtrl",["$scope","$rootScope","$http","$location","LazyLoad","Timer",function(a,b,c,d,e,f){b.cssPage="allfeedsPage",f.stop(),b.loading=!0,c.post("/api/pods/all").success(function(c){b.loading=!1,a.lazyLoad=new e(c)}),a.initFeeds=function(){a.fetchingFeeds=!0,c.post("api/pods/init").success(function(){})}}]),angular.module("myApp").controller("MyfeedsCtrl",["$scope","$rootScope","$http","Timer","LazyLoad",function(a,b,c,d,e){b.cssPage="allfeedsPage",d.stop(),b.loading=!0,c.post("/api/pods/subs").success(function(c){b.loading=!1,a.lazyLoad=new e(c)})}]),angular.module("myApp").controller("AddabunchoffeedsCtrl",["$scope","$timeout","$http",function(a,b,c){a.submit=function(){function d(){b(function(){c.post("/api/pods/add",{url:e[a.count++]}).success(function(b){a.message=b,a.count<e.length&&d()}),a.message=a.count+"/"+e.length+", "+e[a.count-1]},2e3)}var e=a.txtFeeds.split(/\n/g);a.count=0,d()}}]),angular.module("myApp").filter("listened",["NavService","PagePlayer",function(a,b){return function(c){var d=[];return angular.forEach(c,function(c){b.lastSoundId()===c._id?d.push(c):"unvisited"===a.filters.visited?c.listened||d.push(c):"visited"===a.filters.visited?c.listened&&d.push(c):d.push(c)}),d}}]),angular.module("myApp").directive("directoryitem",["$timeout","$http",function(a,b){return{templateUrl:"/views/directoryitem.html",restrict:"AE",scope:{feed:"="},replace:!0,link:function(c){c.feed.timeago=$.timeago(c.feed.pubDate),c.toggle=function(){c.toggling=!0,b.post("/api/subs/toggle",{podid:c.feed._id}).success(function(b){a(function(){c.toggling=!1,c.feed.subscribed=b.subscribed?[!0]:[]})})}}}}]),angular.module("myApp").filter("unambiguate",function(){return function(a){return a.replace(/less than |more than |about /gi,"").replace("a minute ago","Now")}}),angular.module("myApp").controller("LoginCtrl",["$scope","$rootScope","$http","$timeout","$location","LazyLoad",function(a,b,c,d,e,f){b.cssPage="loginPage";var g=function(){var b=$(".popular img");if(b&&b.length>0){var c=Math.floor(Math.random()*b.length),e=Math.floor(Math.random()*a.lazyLoad.items.length);b[c].src=a.lazyLoad.items[e].cloudinary.secure_url}d(g,1e3)};c.get("/api/pods/all").success(function(c){b.loading=!1,a.lazyLoad=new f(c),g()}),a.login=function(){a.submitted=!0,a.loginForm.$valid&&c.post("/api/login",a.userform).success(function(){e.path("/"),a.submitted=!1})},a.signup=function(){a.submitted=!0,a.loginForm.$valid&&c.post("/api/signup",a.userform).success(function(){e.path("/")})}}]);