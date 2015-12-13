angular.module("managerdashboard", ["ngResource"])
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
    .factory("Visit", ["$resource", function ($resource) {
        return $resource("../../ws/rest/v1/visit/:uuid", {
            uuid: '@uuid'
        }, {
            query: {method: 'GET', isArray: false} // OpenMRS RESTWS returns { "results": [] }
        });
    }])
    //.factory("Resources", ["$resource", "AppConfig", function($resource, AppConfig) {
    //    var resources = {};
    //    AppConfig.$promise.then(function() {
    //        resources.Visit = $resource(AppConfig.openmrsBaseUrl + "/ws/rest/v1/visit/:uuid", {
    //            uuid: '@uuid'
    //        },{
    //            query: { method:'GET', isArray:false } // OpenMRS RESTWS returns { "results": [] }
    //        });
    //    });
    //    return resources;
    //}])
    .controller("DashboardController", ["$scope", "Visit", function ($scope, Visit) {
        $scope.activeVisits = {loading: true};
        Visit.query({
            includeInactive: false,
            v: "default"
        }).$promise.then(function (response) {
            $scope.activeVisits = response.results;
        });
    }]);