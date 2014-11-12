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
