(function () {
    'use strict';

    angular.module('common', [
        'ngRoute'
    ])
    .controller('SiteHeaderController', ['$scope', '$route', 'UserService', function ($scope, $route, UserService) {
        $scope.UserService = UserService;

        $scope.display = true;
    }])
    .controller('LeftMenuController', ['$scope', '$route', function ($scope, $route) {

        $scope.display = true;
    }])
    .controller('SiteFooterController', ['$scope', '$route', function ($scope, $route) {

        $scope.display = true;
    }])
    ;
})();