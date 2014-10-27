'use strict';

/**
 * @ngdoc service
 * @name podcaddyApp.NavService
 * @description
 * # NavService
 * Factory in the podcaddyApp.
 */
angular.module('podcaddyApp')
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
