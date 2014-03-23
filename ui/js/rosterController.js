'use strict';

angular.module('ChatApp')
    .controller('RosterController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.userClicked = function (user) {
            $rootScope.selectedThread = $rootScope.getThreadForUser(user);
        };

        $scope.closeThread = function (thread) {
            if ($rootScope.selectedThread === thread) {
                delete $rootScope.selectedThread;
            }
            delete $rootScope.threadMap[thread.user.jid];
        };
    }
]);