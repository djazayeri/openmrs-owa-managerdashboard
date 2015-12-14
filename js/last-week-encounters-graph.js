angular.module("managerdashboard")

    .factory("GraphGenerator", [ "EvaluateCohort", "$q", function(EvaluateCohort, $q) {
        return {
            generateFor: function(fromDate, toDate, step) {
                var dates = [];
                var promises = [];
                var results = {};
                var encountersData = {
                    "key" : "Patients with encounters",
                    "bar" : true,
                    "values" : []
                };

                var genderData = [];
                // reportingrest does not yet give us a way to do a compound query, so we can't combine gender with encounter during period

                function handleDate(date, step) {
                    var startOfPeriod = date.clone();
                    dates.push(startOfPeriod);
                    var endOfPeriod = moment(startOfPeriod).add(step - 1, 'day').endOf("day");
                    var query = EvaluateCohort.query({
                        key: "anyEncounterDuringPeriod",
                        startDate: startOfPeriod.toISOString(),
                        endDate: endOfPeriod.toISOString()
                    });
                    query.$promise.then(function(response) {
                        results[startOfPeriod.toISOString()] = response.members.length;
                    });
                    promises.push(query.$promise);
                }

                for (var date = fromDate.clone(); date.isBefore(toDate); date.add(step, 'day')) {
                    handleDate(date, step);
                }

                $q.all(promises).then(function() {
                    encountersData.values = _.map(dates, function(d) {
                        var showMonth = d === dates[0] || d.date() === 1;
                        return {
                            date: d, // d.format(showMonth ? "D MMM" : "D"),
                            value: results[d.toISOString()]
                        };
                    });
                });

                function formatDateShort(d) {
                    return moment(d).format("D MMM");
                }

                function formatDateLong(d) {
                    return moment(d).format("DD-MMM-YYYY");
                }

                return {
                    dates: dates,
                    genders: {
                        options: {
                            chart: {
                                type: 'pieChart',
                                height: 250,
                                x: function(d){return d.key;},
                                y: function(d){return d.y;},
                                showLabels: true,
                                labelSunbeamLayout: true,
                                legend: {
                                    margin: {
                                        top: 5,
                                        right: 35,
                                        bottom: 5,
                                        left: 0
                                    }
                                }
                            }
                        },
                        data: genderData
                    },
                    encounters: {
                        options: {
                            chart: {
                                type: 'historicalBarChart',
                                height: 500,
                                x: function (d) {
                                    return d.date.valueOf();
                                },
                                y: function (d) {
                                    return d.value;
                                },
                                showValues: true,
                                valueFormat: function (d) {
                                    return Math.round(d);
                                },
                                xAxis: {
                                    tickFormat: formatDateShort
                                },
                                yAxis: {
                                    axisLabel: "Patients with Encounters",
                                    "axisLabelDistance": -10
                                },
                                tooltip: {
                                    keyFormatter: formatDateLong
                                }
                            }
                        },
                        data: [
                            encountersData
                        ]
                    }
                }
            }
        }
    }])

    .controller("LastWeekEncountersGraphController", ["$scope", "GraphGenerator", function ($scope, GraphGenerator) {

        $scope.fromToday = function(numDays, step) {
            $scope.setEndDate = moment().endOf('day').toDate();
            $scope.setStartDate = moment().startOf('day').add(-numDays, 'day').toDate();
            $scope.step = step;
        }

        $scope.fromToday(30, 1);

        $scope.$watchGroup(['setStartDate', 'setEndDate', 'step'], function() {
            $scope.startDate = moment($scope.setStartDate);
            $scope.endDate = moment($scope.setEndDate);
            if ($scope.endDate.isBefore($scope.startDate)) {
                $scope.setStartDate = $scope.setEndDate;
            }
            $scope.graph = GraphGenerator.generateFor($scope.startDate, $scope.endDate, $scope.step);
        });

        $scope.popupStatus = {};

        $scope.disabledStart = function(date, mode) {
            return moment(date).isAfter($scope.endDate);
        }

        $scope.disabledEnd = function(date, mode) {
            return moment(date).isBefore($scope.startDate) || moment(date).startOf('day').isAfter(moment());
        }
    }]);