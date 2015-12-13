angular.module("managerdashboard")

    .controller("LastWeekEncountersGraphController", ["$scope", "$q", "EvaluateCohort", function ($scope, $q, EvaluateCohort) {
        var results = {};
        var dates = [];
        var promises = [];
        var date = moment().startOf('day');
        _.times(30, function() {
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
            date.subtract(1, 'days');
        });
        dates.reverse();
        $scope.dates = dates;
        $scope.results = results;

        $scope.chartOptions = {
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
        };
        $scope.chartData = [
            {
                "key" : "Patients with encounters" ,
                "values" : []
            }
        ];

        $q.all(promises).then(function() {
            $scope.chartData[0].values = _.map(dates, function(d) {
                var showMonth = d === dates[0] || d.date() === 1;
                return {
                    label: d.format(showMonth ? "D MMM" : "D"),
                    value: results[d.toISOString()]
                };
            });
        });
    }]);