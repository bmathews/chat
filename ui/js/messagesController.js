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

        $scope.handleClick = function (event) {
            var href;
            var isExternal = false;
            var element = event.target;

            if (element.nodeName.toLowerCase() === 'a') {
                href = element.getAttribute('href');
            }

            isExternal = href.match(/^(((ftp|https?):\/\/)|mailto:)/gi);
            
            if (href && isExternal) {
                global.gui.Shell.openExternal(href);
                event.preventDefault();
            }
        };
    }
]);