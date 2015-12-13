angular.module("managerdashboard")

    .factory("Visit", ["$resource", function ($resource) {
        return $resource("../../ws/rest/v1/visit/:uuid", {
            uuid: '@uuid'
        }, {
            query: {method: 'GET', isArray: false} // OpenMRS RESTWS returns { "results": [] }
        });
    }])

    .factory("EvaluateCohort", ["$resource", function ($resource) {
        return $resource("../../ws/rest/v1/reportingrest/cohort/:key", {
            uuid: '@key'
        }, {
            query: {method: 'GET', isArray: false} // OpenMRS RESTWS returns { "results": [] }
        });
    }]);