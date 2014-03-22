/**
 * Displays the validity of a form.  Currently, it only displays an exclamation sign if the form is
 * invalid.
 */
angular.module('directives.user', []).directive('user', [function () {
    return {
        restrict: 'A',
        templateUrl: 'js/directives/user.tpl.html',
        scope: true,
        link: function ($scope, element, attr) {
            $scope.$watch(attr.user, function (user) {
                $scope.user = user;
            });
        }

    };
}]);