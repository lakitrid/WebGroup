(function () {
    'use strict';

    angular.module('socket', [
        'ngRoute',
        'ngWebSocket'
    ])
    .factory('SocketService', ['$websocket', function ($websocket) {
        var dataStream = $websocket('ws://localhost:54699/socket/chat');

        var collection = [];

        var callbacks = [];

        dataStream.onMessage(function (message) {
            var data = JSON.parse(message.data);

            callbacks.forEach(function (callback) {
                callback.callback(data);
            });
        });

        var methods = {
            get: function () {
                dataStream.send(JSON.stringify({ action: 'get' }));
            },
            sendMessage: function (message) {
                var data = {
                    Action: 'sendMessage',
                    Id: new Date().getTime(),
                    Text: message
                };

                dataStream.send(JSON.stringify(data));

                return data.id;
            },
            register: function (key, callback) {
                callbacks.push({ key: key, callback: callback });
            },
            unregistered: function (key) {

            }
        };

        return methods;
    }])
    ;
})();