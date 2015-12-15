(function () {
    'use strict';

    angular.module('chat', [
        'ngRoute'        
    ])
    .controller('ChatController', ['$scope', 'SocketService', function ($scope, SocketService) {
        $scope.messages = [];
        $scope.toSend = {};

        var messageCallback = function (message) {
            if (message.Action === 'confirmMessage') {
                $scope.toSend.Text = "";
            } else if (message.Action === 'sendMessage') {
                $scope.messages.push(message);
            }
        };

        SocketService.register("chat", messageCallback);

        $scope.Send = function () {
            SocketService.sendMessage($scope.toSend.Text);
        };
    }])
    ;
})();