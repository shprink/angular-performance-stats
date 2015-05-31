require 'angular'
require '../dist/angular-performance-stats'

module.exports = module = angular.module 'test', [
    'angular-performance-stats'
]

module.controller 'MainController', ($scope) ->
    $scope.first = 'test'

module.config (angularPerformanceStatsProvider) ->
    # angularPerformanceStatsProvider.enable false

module.run ($log, angularPerformanceStats) ->
    angularPerformanceStats.run()
    $log.info 'test running'
