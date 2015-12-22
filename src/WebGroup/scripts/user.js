(function () {
    'use strict';

    angular.module('user', [
        'ngRoute',
        'pascalprecht.translate'
    ])
    .config(['$translatePartialLoaderProvider', function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('user');
    }])
    .controller("LoginController", ['$scope', '$http', '$location', 'UserService',
        function ($scope, $http, $location, UserService) {
        $scope.user = {};

        $scope.hasError = false;

        $scope.Login = function () {
            $scope.hasError = false;

            if ($scope.loginForm.$valid) {
                $http.post('services/user/login', $scope.user).then(function (success) {
                    if (success.status == 200) {
                        UserService.loadUser();
                        $location.path('/panel');
                    } else {
                        $scope.hasError = true;
                    }
                },
                function (error) {
                    $scope.hasError = true;
                });
            }
        };
    }])
    .factory('UserService', ['$http', '$q', '$location', function ($http, $q, $location) {
        var isAuth = false;

        var user = {}

        return {
            isAuth: isAuth,
            user: user,
            checkAuth: function () {
                var deferred = $q.defer();

                $http.get('/services/user/isAuth').then(function (success) {
                    if (success.status == 200) {
                        isAuth = true;
                    } else {
                        isAuth = false;
                    }
                    deferred.resolve(isAuth);
                }, function (error) {
                    isAuth = false;
                    deferred.resolve(isAuth);
                });

                return deferred.promise;
            },
            logout: function () {
                $http.get('/services/user/logout').then(function () {
                    isAuth = false;
                    user = {};
                    $location.path('/Login');
                });
            },
            loadUser: function () {
                $http.get('services/user').then(function (success) {
                    user = success.data;
                });
            }
        }
    }])
    ;
})();