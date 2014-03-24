'use strict';

angular.module('ChatApp')
    .controller('MessagesController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
        $scope.onEnterPressed = function (event, from, text) {
            if (!event.shiftKey) {
                $scope.text = "";
                event.preventDefault();
                $rootScope.send(from, text)
            }
        }       
    }
]);