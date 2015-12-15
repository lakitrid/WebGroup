(function () {
    'use strict';

    angular.module('webGroup', [
        'chat',
        'socket',
        'user',
        'technical',
        'ngRoute',
        'pascalprecht.translate',
        'ngSanitize'
    ])
    .config(['$routeProvider', '$translateProvider', '$translatePartialLoaderProvider', '$httpProvider',
        function ($routeProvider, $translateProvider, $translatePartialLoaderProvider, $httpProvider) {
            $routeProvider.
              when('/chat', {
                  templateUrl: 'views/chat.html',
                  controller: 'ChatController'
              }).
              when('/login', {
                  templateUrl: 'views/login.html',
                  controller: 'LoginController'
              }).
              otherwise({
                  redirectTo: '/login'
              });

            $httpProvider.interceptors.push('SiteHttpInterceptor');

            $translateProvider.useSanitizeValueStrategy('sanitize');

            $translatePartialLoaderProvider.addPart('common');
            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: '/localize/{part}-{lang}.json'
            });

            $translateProvider.preferredLanguage('en');
        }])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.connection = { count: 0 };
    }])
    ;
})();