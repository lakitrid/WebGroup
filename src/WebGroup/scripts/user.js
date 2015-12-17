(function () {
    'use strict';

    angular.module('user', [
        'ngRoute',
        'pascalprecht.translate'
    ])
    .config(['$translatePartialLoaderProvider', function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('user');
    }])
    .controller("LoginController", ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.user = {};

        $scope.hasError = false;

        $scope.Login = function () {
            $scope.hasError = false;

            if ($scope.loginForm.$valid) {
                $http.post('services/user/login', $scope.user).then(function (success) {
                    if (success.status == 200) {
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
    ;
})();