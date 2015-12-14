angular.module("managerdashboard")

    .factory("GraphGenerator", [ "EvaluateCohort", "$q", function(EvaluateCohort, $q) {
        return {
            generateFor: function(fromDate, toDate) {
                var dates = [];
                var promises = [];
                var results = {};
                var data = {
                    "key" : "Patients with encounters",
                    "values" : []
                };

                function handleDate(date) {
                    var startOfDay = date.clone();
                    dates.push(startOfDay);
                    var query = EvaluateCohort.query({
                        key: "anyEncounterDuringPeriod",
                        startDate: startOfDay.toISOString(),
                        endDate: moment(startOfDay).endOf("day").toISOString()
                    });
                    query.$promise.then(function(response) {
                        results[startOfDay.toISOString()] = response.members.length;
                    });
                    promises.push(query.$promise);
                }

                for (var date = fromDate.clone(); date.isBefore(toDate); date.add(1, 'day')) {
                    handleDate(date);
                }

                $q.all(promises).then(function() {
                    data.values = _.map(dates, function(d) {
                        var showMonth = d === dates[0] || d.date() === 1;
                        return {
                            label: d.format(showMonth ? "D MMM" : "D"),
                            value: results[d.toISOString()]
                        };
                    });
                });

                return {
                    dates: dates,
                    options: {
                        chart: {
                            type: 'discreteBarChart',
                            height: 500,
                            x: function (d) {
                                return d.label;
                            },
                            y: function (d) {
                                return d.value;
                            },
                            showValues: true,
                            valueFormat: function(d) {
                                return Math.round(d);
                            },
                            yAxis: {
                                axisLabel: "Patients with Encounters",
                                "axisLabelDistance": -10
                            }
                        }
                    },
                    data: [
                        data
                    ]
                }
            }
        }
    }])

    .controller("LastWeekEncountersGraphController", ["$scope", "GraphGenerator", function ($scope, GraphGenerator) {

        $scope.fromToday = function(numDays) {
            $scope.setEndDate = moment().endOf('day').toDate();
            $scope.setStartDate = moment().startOf('day').add(-numDays, 'day').toDate();
        }

        $scope.fromToday(30);

        $scope.$watchGroup(['setStartDate', 'setEndDate'], function() {
            $scope.startDate = moment($scope.setStartDate);
            $scope.endDate = moment($scope.setEndDate);
            $scope.graph = GraphGenerator.generateFor($scope.startDate, $scope.endDate);
        });

        $scope.popupStatus = {};
    }]);