(function () {
    'use strict';

    angular.module('webGroup', [
        'chat',
        'socket',
        'user',
        'panel',
        'technical',
        'common',
        'ngRoute',
        'pascalprecht.translate',
        'ngSanitize'
    ])
    .config(['$routeProvider', '$translateProvider', '$translatePartialLoaderProvider', '$httpProvider',
        function ($routeProvider, $translateProvider, $translatePartialLoaderProvider, $httpProvider) {
            $routeProvider.
              when('/chat', {
                  templateUrl: 'views/chat.html',
                  controller: 'ChatController',
                  areas: { header: 'simple', leftMenu: 'channels', footer: 'simple' }
              }).
              when('/panel', {
                  templateUrl: 'views/panel.html',
                  controller: 'PanelController',
                  areas: { header: 'simple', leftMenu: 'channels', footer: 'simple' }
              }).
              when('/login', {
                  templateUrl: 'views/login.html',
                  controller: 'LoginController',
                  areas: { header: 'logo', leftMenu: 'none', footer: 'simple' }
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
    .run(['$rootScope', '$route', 'UserService', '$location',
        function ($rootScope, $route, UserService, $location) {
            $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
                $rootScope.areas = $route.current.areas;

                UserService.checkAuth().then(function (isAuth) {
                    if ($route.current.$$route.originalPath !== '/login' && isAuth == false) {
                        $location.path('/login');
                    } else if ($route.current.$$route.originalPath === '/login' && isAuth == true) {
                        $location.path('/panel');
                    }
                });
            });

            $rootScope.connection = { count: 0 };
        }])
    .directive('siteHeader', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/views/siteHeader.html',
            controller: 'SiteHeaderController'
        };
    }])
    .directive('leftMenu', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/views/leftMenu.html',
            controller: 'LeftMenuController'
        };
    }])
    .directive('siteFooter', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/views/siteFooter.html',
            controller: 'SiteFooterController'
        };
    }])
    ;
})();