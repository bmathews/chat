'use strict';

angular.module('ChatApp')
    .controller('MessagesController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

        // send msg on enter (but not shift+enter)
        $scope.handleEnterPressed = function (event, from, text) {
            if (!event.shiftKey) {
                $scope.text = "";
                event.preventDefault();
                $rootScope.send(from, text)
            }
        }       

        // open ftp://, http://, https://, and mailto: hrefs outside of node-webkit
        $scope.handleMessageClick = function (event) {
            var href;
            if (event.target.nodeName.toLowerCase() === 'a') {
                href = event.target.getAttribute('href');
                if (href && href.match) { 
                    if(href.match(/^(((ftp|https?):\/\/)|mailto:)/gi)) {
                        global.gui.Shell.openExternal(href);
                        event.preventDefault();
                    }
                }
            }
        };
    }
]);