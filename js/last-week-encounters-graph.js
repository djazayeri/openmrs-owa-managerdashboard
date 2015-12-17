angular.module("managerdashboard")

    .factory("GraphGenerator", [ "EvaluateCohort", "QueryConstants", "$q", function(EvaluateCohort, QueryConstants, $q) {
        return {
            generateFor: function(fromDate, toDate, step, formatDateRangeFromIsoDate) {
                var thisYear = moment().year();
                var dateRanges = [];
                var promises = [];
                var results = {};
                var encountersData = {
                    "key" : "Patients with encounters",
                    "bar" : true,
                    "values" : []
                };
                var genderData = [];
                EvaluateCohort.save({
                    serializedXml: QueryConstants.malesWithEncounterDuringPeriod,
                    startDate: fromDate.toISOString(),
                    endDate: toDate.toISOString()
                }).$promise.then(function(response) {
                    genderData.push({ label: "Male", value: response.members.length });
                });
                EvaluateCohort.save({
                    serializedXml: QueryConstants.femalesWithEncounterDuringPeriod,
                    startDate: fromDate.toISOString(),
                    endDate: toDate.toISOString()
                }).$promise.then(function(response) {
                    genderData.push({ label: "Female", value: response.members.length });
                });

                function handleDate(date, step) {
                    var startOfPeriod = date.clone();
                    var endOfPeriod = moment(startOfPeriod).add(step - 1, 'day').endOf("day");
                    dateRanges.push({
                        start: startOfPeriod,
                        end: step > 1 ? endOfPeriod : null
                    });
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
                    encountersData.values = _.map(dateRanges, function(dr) {
                        return {
                            start: dr.start.toISOString(),
                            value: results[dr.start.toISOString()]
                        };
                    });
                });

                return {
                    genders: {
                        options: {
                            chart: {
                                type: 'pieChart',
                                height: 350,
                                x: function(d){return d.label;},
                                y: function(d){return d.value;},
                                //showLabels: true,
                                //legend: {
                                //    margin: {
                                //        top: 5,
                                //        right: 35,
                                //        bottom: 5,
                                //        left: 0
                                //    }
                                //}
                            }
                        },
                        data: genderData
                    },
                    encounters: {
                        options: {
                            chart: {
                                type: 'discreteBarChart',
                                height: 500,
                                x: function (d) {
                                    return d.start;
                                },
                                y: function (d) {
                                    return d.value;
                                },
                                showValues: true,
                                valueFormat: function (d) {
                                    return Math.round(d);
                                },
                                xAxis: {
                                    tickFormat: formatDateRangeFromIsoDate,
                                    staggerLabels: dateRanges.length > 10
                                },
                                yAxis: {
                                    axisLabel: "Patients with Encounters",
                                    "axisLabelDistance": -10
                                },
                                //tooltip: {
                                //    keyFormatter: formatDateRangeLong
                                //}
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
            $scope.step = step;
            $scope.setEndDate = moment().endOf('day').toDate();
            $scope.setStartDate = moment().startOf('day').add(-(numDays-1), 'day').toDate();
        }

        $scope.fromToday(30, 1);

        $scope.$watchGroup(['setStartDate', 'setEndDate', 'step'], function() {
            $scope.startDate = moment($scope.setStartDate);
            $scope.endDate = moment($scope.setEndDate);
            if ($scope.endDate.isBefore($scope.startDate)) {
                $scope.setStartDate = $scope.setEndDate;
            }

            var formatDateRangeFromIsoDate = function(iso) {
                var format = $scope.startDate.year() == moment().year() ? "D/MMM" : "D/MMM/YY";
                var start = moment(iso);
                if ($scope.step == 1) {
                    return start.format(format);
                }
                else {
                    var end = start.clone().add($scope.step - 1, 'day');
                    return start.format(format) + "-" + end.format(format);
                }
            }

            $scope.graph = GraphGenerator.generateFor($scope.startDate, $scope.endDate, $scope.step, formatDateRangeFromIsoDate);
        });

        $scope.popupStatus = {};

        $scope.disabledStart = function(date, mode) {
            return moment(date).isAfter($scope.endDate);
        }

        $scope.disabledEnd = function(date, mode) {
            return moment(date).isBefore($scope.startDate) || moment(date).startOf('day').isAfter(moment());
        }
    }]);