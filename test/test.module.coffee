require 'angular'
require '../dist/angular-performance-stats'

module.exports = module = angular.module 'test', [
    'angular-performance-stats'
]
module.config (angularPerformanceStatsProvider) ->
    # angularPerformanceStatsProvider.enable false

module.run ($log) ->
    $log.info 'test running'
