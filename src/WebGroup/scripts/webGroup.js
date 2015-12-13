(function () {
    'use strict';

    angular.module('webGroup', [
        'ngRoute',
        'ngWebSocket'
    ])
    .controller('MainController', ['$scope', 'SocketService', function ($scope, SocketService) {
        $scope.Send = function () {
            SocketService.get();
        };
    }])
    .factory('SocketService', ['$websocket', function ($websocket) {
        var dataStream = $websocket('ws://localhost:54699/websocket');

        var collection = [];

        dataStream.onMessage(function (message) {
            collection.push(JSON.parse(message.data));
        });

        var methods = {
            collection: collection,
            get: function () {
                dataStream.send(JSON.stringify({ action: 'get' }));
            }
        };

        return methods;
    }])
    ;
})();