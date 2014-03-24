'use strict';

angular.module('ChatApp')
    .controller('RosterController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.userClicked = function (user) {
            // set selected thread
            $rootScope.selectedThread = $rootScope.getThreadForUser(user);

            // clear read count
            $rootScope.selectedThread.unreadCount = 0;

            // clear search
            $scope.nameFilter = '';
        };

        $scope.nameFilter = '';

        // return true if any of the group members are online
        $scope.showGroup = function (group) {
            console.log("digesting?");
            return group.users.some(function (user) {
                return user.state != 'offline';
            });
        };

        // clear search on window blur
        global.gui.Window.get().on('blur', function () {
            if ($scope.nameFilter) {
                $scope.$apply(function () {
                    $scope.nameFilter = ''
                });
            }
        });

        $scope.closeThread = function (thread) {
            if ($rootScope.selectedThread === thread) {
                delete $rootScope.selectedThread;
            }
            delete $rootScope.threadMap[thread.user.jid];
        };
    }
]);