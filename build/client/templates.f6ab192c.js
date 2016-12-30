angular.module('pod').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/addfeed.html',
    "<div ng-show=\"getAddFeedOut()\" class=\"addfeed\"><div class=\"popout\"><div class=\"title\"> <div class=\"left\">Add a Podcast<i class=\"icon-rss\"></i></div><div class=\"right\"><i ng-click=\"hideAddFeed()\" class=\"icon-cancel-circle\"></i></div></div><div ng-show=\"!error &amp;&amp; !success\" class=\"body\"><form name=\"addFeedForm\" ng-submit=\"addFeed()\"><input type=\"text\" ng-model=\"feedUrl\" required=\"required\" placeholder=\"RSS Url\"/><input type=\"submit\" value=\"Add Podcast\" class=\"button\"/></form></div><div ng-show=\"success\" class=\"addfeed-success\"><div class=\"feed-title\">{{feed.t}}</div><img src=\"{{feed.iu}}\"/><div ng-click=\"ok()\" class=\"button\">OK</div></div><div ng-show=\"error\" class=\"addfeed-error\"><div class=\"error-title\">There was an error</div><div class=\"error-body\">{{error}}</div><div ng-click=\"ok()\" class=\"button\">OK</div></div></div><div class=\"clickscreen\"></div></div>"
  );


  $templateCache.put('views/feed.html',
    "<div class=\"feed\"><div ng-click=\"goTo()\" class=\"feed-body\"><div class=\"feed-title\">{{feed.feedTitle}}</div><div afkl-lazy-image=\"{{feed.imageUrl}}\" class=\"img\"><div class=\"feed-description\">{{feed.feedDescription}}</div></div></div><div class=\"feed-controls\"><div ng-hide=\"feed.subscribed\" ng-click=\"subscribe()\" class=\"button subscribe\">Subscribe</div><div ng-show=\"feed.subscribed\" ng-click=\"unsubscribe()\" class=\"button unsubscribe\">Unsubscribe</div></div></div>"
  );


  $templateCache.put('views/feeds.html',
    "<input type=\"text\" ng-model=\"search\" ng-change=\"triggerScroll()\" class=\"search\"/><div class=\"feeds\"><feed ng-repeat=\"feed in feeds | filter:search\"></feed></div>"
  );


  $templateCache.put('views/header.html',
    "<div class=\"header\"><h1 class=\"logo\">Podcaddy</h1><h6 class=\"logo\">Back From The Dead, Baby</h6></div>"
  );


  $templateCache.put('views/login.html',
    "<div ng-hide=\"getUser()\" class=\"login-holder\"><div class=\"login-form\"><p>Login or Sign Up</p><form name=\"loginForm\" novalidate=\"novalidate\" ng-submit=\"login()\"><div><input type=\"email\" name=\"email\" required=\"required\" ng-model=\"email\" placeholder=\"Email address\"/><span ng-show=\"submitted &amp;&amp; loginForm.email.$error.email\" class=\"error\">Please use a valid looking email address</span><span ng-show=\"submitted &amp;&amp; loginForm.email.$error.required\" class=\"error\">Please use a valid looking email address</span><br/><input type=\"password\" name=\"password\" required=\"required\" ng-model=\"password\" placeholder=\"Password\"/><small ng-show=\"submitted &amp;&amp; loginForm.password.$error.required\" class=\"error\">A password is required</small></div><div><input type=\"submit\" value=\"Login\" class=\"button\"/>&nbsp;<input type=\"button\" ng-click=\"signup()\" value=\"Sign Up\" class=\"button white\"/></div><div><p>or use one of these...</p></div><div class=\"social\"><a href=\"/api/twitter\" target=\"_self\" class=\"button\"><i class=\"icomoon-twitter\"></i>&nbsp;Twitter</a>&nbsp;<a href=\"/api/facebook\" target=\"_self\" class=\"button\"><i class=\"icomoon-facebook\"></i>&nbsp;Facebook</a>&nbsp;<a href=\"/api/github\" target=\"_self\" class=\"button\"><i class=\"icomoon-github\"></i>&nbsp;Github</a></div></form></div></div>"
  );


  $templateCache.put('views/main.html',
    "<input type=\"text\" ng-model=\"name\" ng-change=\"triggerScroll()\" placeholder=\"Search Pods\" class=\"search\"/><pod ng-repeat=\"pod in getPods() | listened:getFilter() | filter:name\"></pod>"
  );


  $templateCache.put('views/menu.html',
    "<div class=\"menu-holder\"><div ng-click=\"hideMenu()\" ng-class=\"{enabled:getMenuOut()}\" class=\"clickscreen\"></div><div ng-show=\"getMenuOut()\" class=\"popout\"><div ng-click=\"goTo('/')\" class=\"link\"><i class=\"icon-play2\"></i>Home</div><div ng-click=\"goTo('/feeds')\" class=\"link\"><i class=\"icon-book\"></i>Podcast Directory</div><div ng-show=\"getUser()\"><div ng-click=\"addFeed()\" class=\"link\"><i class=\"icon-rss\"></i>Add a Podcast</div><div ng-click=\"setDirection('DESC')\" ng-class=\"{disabled:getDirection()==='DESC'}\" class=\"link\"><i class=\"icon-arrow-down\"></i>Show Newest First</div><div ng-click=\"setDirection('ASC')\" ng-class=\"{disabled:getDirection()==='ASC'}\" class=\"link\"><i class=\"icon-arrow-up\"></i>Show Oldest First</div><div ng-click=\"setFilter('unlistened')\" ng-class=\"{disabled:getFilter()==='unlistened'}\" class=\"link\"><i class=\"icon-rss\"></i>Show Unlistened</div><div ng-click=\"setFilter('listened')\" ng-class=\"{disabled:getFilter()==='listened'}\" class=\"link\"><i class=\"icon-volume-high\"></i>Show Listened</div><div ng-click=\"setFilter('all')\" ng-class=\"{disabled:getFilter()==='all'}\" class=\"link\"><i class=\"icon-volume-low\"></i>Show All</div></div></div></div>"
  );


  $templateCache.put('views/pod-controls.html',
    "<div ng-click=\"controlsClick($event)\" class=\"controls\"><div class=\"timing\"><pre class=\"position\">{{pod.position}}</pre></div><div class=\"statusbar\"><div style=\"width: {{pod.loadPercent}}%\" class=\"loading\"></div><div style=\"width: {{pod.playPercent}}%\" class=\"position\"></div></div></div>"
  );


  $templateCache.put('views/pod.html',
    "<div ng-class=\"{playing:pod.playing}\" ng-click=\"podClick($event)\" class=\"pod\"><div afkl-lazy-image=\"{{pod.imageUrl}}\" class=\"img\"></div><div class=\"pod-body\"><div class=\"pod-header\"><div class=\"pod-title\"><h4>{{pod.title}}</h4><h6> <a href=\"/{{pod.feedSlug}}\">{{pod.feedTitle}}</a></h6></div><div class=\"pod-date\"><pre>{{pod.pubDate | date}} {{pod.pubDate | date:'shortTime'}}</pre></div></div><p>{{pod.description}}</p><pod-controls></pod-controls></div></div>"
  );


  $templateCache.put('views/sidebar.html',
    "<div><div class=\"sidebar\"><h4>hello</h4></div><div class=\"sidebar-spacer\"></div></div>"
  );


  $templateCache.put('views/toolbar.html',
    "<div><div class=\"toolbar rows\"><div ng-show=\"getPod().url\" class=\"details-row\"><div class=\"podcast-details\"><div class=\"feed-name\">{{ getPod().feedTitle }}</div><div class=\"feed-title\">{{ getPod().title }}</div><div class=\"position\"></div></div></div><div class=\"controls-row\"><div class=\"menu\"><div ng-click=\"showMenu()\" class=\"button\">Menu<div class=\"menu-anchor\"></div></div></div><div class=\"controls\"><i class=\"icon-previous\"></i><i class=\"icon-backward\"></i><i ng-hide=\"getPod().playing &amp;&amp; !getPod().paused\" ng-click=\"togglePlay()\" class=\"icon-play2 big\"></i><i ng-show=\"getPod().playing &amp;&amp; !getPod().paused\" ng-click=\"togglePlay()\" class=\"icon-stop big\"></i><i class=\"icon-forward2\"></i><i class=\"icon-next\"></i></div><div class=\"volume\"><i ng-show=\"getVolume()===100\" ng-click=\"setVolume(0)\" class=\"icon-volume-high\"></i><i ng-show=\"getVolume()===0\" ng-click=\"setVolume(33)\" class=\"icon-volume-mute2\"></i><i ng-show=\"getVolume()===33\" ng-click=\"setVolume(66)\" class=\"icon-volume-low\"></i><i ng-show=\"getVolume()===66\" ng-click=\"setVolume(100)\" class=\"icon-volume-medium\"></i></div></div></div><div ng-show=\"getPod().url\" class=\"toolbar-spacer\"></div></div>"
  );

}]);
