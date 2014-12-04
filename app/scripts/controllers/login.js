'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the myApp
 */
angular.module('myApp')
.controller('LoginCtrl', function ($scope, $rootScope, $http, $timeout, LazyLoad) {
  $rootScope.cssPage = 'loginPage';
  var switchImg = function(){
    var imgs = $('.popular img');
    if(imgs && imgs.length > 0) {
      var rnd = Math.floor(Math.random() * imgs.length);
      var rnd2 = Math.floor(Math.random() * $scope.lazyLoad.items.length);
      imgs[rnd].src = $scope.lazyLoad.items[rnd2].cloudinary.secure_url;
    }
    $timeout(switchImg, 1000);
  };
  $http.get('/api/pods/all')
  .success(function(feeds){
    $rootScope.loading = false;
    $scope.lazyLoad = new LazyLoad(feeds);
    switchImg();
  });
});
