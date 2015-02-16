MemoryStats = require './memory-stats.js'
Stats = require './stats.js'
RequestAnimationFrame = require 'requestanimationframe'

module.exports = module = angular.module 'angular-performance-stats', []

module.provider 'angularPerformanceStats', ->
    isEnabled = true
    mode = 'row'
    position = 'bottom right'

    enable = (enable = true) ->
        isEnabled = enable

    mode = (mode = null) ->
        mode = mode if mode

    position = (position = null) ->
        position = position if position

    $get = ->
        isEnabled: ->
            isEnabled
        getMode: ->
            mode
        getPosition: ->
            position

    enable: enable
    position: position
    mode: mode
    $get: $get

module.directive 'angularPerformanceStats' , ->
    restrict: 'E'
    scope: false
    controller: ($scope, $element, angularPerformanceStats) ->
        if !angularPerformanceStats.isEnabled()
            return
        memoryStats = new MemoryStats()
        stats = new Stats()
        statsFPS = new Stats()
        statsFPS.setMode 0
        stats.setMode 1
        $element.css
            'zIndex': 999999
            'position': 'fixed'
            'right': '5px'
            'bottom': '5px'
        $element.append memoryStats.domElement
        $element.append statsFPS.domElement
        $element.append stats.domElement
        update = ->
            memoryStats.update()
            stats.update()
            statsFPS.update()
            RequestAnimationFrame update
        RequestAnimationFrame update
