'use strict';

angular.module('ChatApp')
    .controller('RosterController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.userClicked = function (user) {
            $rootScope.selectedThread = $rootScope.getThreadForUser(user);
        };
    }
]);