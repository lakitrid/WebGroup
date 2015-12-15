(function () {
    'use strict';

    angular.module('user', [
        'ngRoute',
        'pascalprecht.translate'
    ])
    .config(['$translatePartialLoaderProvider', function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('user');
    }])
    .controller("LoginController", ['$scope', function ($scope) {
        $scope.user = {};

        $scope.Login = function () {

        };
    }])
    ;
})();