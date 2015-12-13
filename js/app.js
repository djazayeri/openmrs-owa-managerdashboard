angular.module("managerdashboard", ["ngResource", "ui.router", "ui.bootstrap", "nvd3"])

    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("last-week-encounters-graph");

        $stateProvider
            .state("last-week-encounters-graph", {
                url: "/last-week-encounters-graph",
                templateUrl: "html/last-week-encounters-graph.html",
                controller: "LastWeekEncountersGraphController"
            });
    })

    .factory("AppConfig", ["$http", function ($http) {
        var data = {};
        var promise = $http.get("manifest.webapp");
        promise.then(function (response) {
            data.manifest = response.data;
            data.openmrsBaseUrl = response.data.activities.openmrs.href;
        });
        data.$promise = promise;
        return data;
    }])

    .controller("DashboardController", ["$scope", "Visit", function ($scope, Visit) {
        $scope.activeVisits = {loading: true};
        Visit.query({
            includeInactive: false,
            v: "default"
        }).$promise.then(function (response) {
            $scope.activeVisits = response.results;
        });
    }]);