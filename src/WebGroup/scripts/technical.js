(function () {
    'use strict';

    angular.module('technical', [
        'ngRoute'        
    ])
    .constant("appVersion", "v1.0a")
    .factory('SiteHttpInterceptor', ['$q', 'appVersion', '$rootScope', function ($q, appVersion, $rootScope) {
        return {
            'request': function (config) {

                $rootScope.connection.count++;

                // Add app version in the request to bypass the cache for static assets
                if (config.url.search(/^(\.?\/)?(css|app|views|scripts)\//) === 0) {
                    var char = (config.url.indexOf("?") > -1) ? "&" : "?";
                    config.url = config.url + char + appVersion;
                } else if (config.url.search(/^(\.?\/)?(service)\//) === 0) {
                    var char = (config.url.indexOf("?") > -1) ? "&" : "?";
                    config.url = config.url + char + new Date().getTime();
                }

                return config || $q.when(config);
            },
            'response': function (response) {
                $rootScope.connection.count--;
                return response || $q.when(response);
            },
            'responseError': function (response) {
                $rootScope.connection.count--;
                return response || $q.when(response);
            }
        };
    }])
    ;
})();