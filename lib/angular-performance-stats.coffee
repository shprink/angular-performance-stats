libStats = require './lib.js'

RequestAnimationFrame = require 'requestanimationframe'

module.exports = module = angular.module 'angular-performance-stats', []

module.provider 'angularPerformanceStats', ->
    isEnabled = true
    isInjected = false

    enable = (enable = true) ->
        isEnabled = enable

    $get = ($log, $document) ->
        run: ->
            return if isInjected
            if !isEnabled
                $log.info 'angular-performance-stats disabled'
                return
            require './angular-performance-stats.scss'
            body = $document.find('body')
            el = angular.element require './angular-performance-stats.html'
            body.prepend el
            libStats = new libStats()
            update = ->
                el.find('memory-stats').text libStats.getMemory()
                el.find('fps-stats').text libStats.getFps().fps
                el.find('ms-stats').text libStats.getFps().ms
                el.find('watchers-count').text libStats.getWatcherCount() + ' Watchers'
                RequestAnimationFrame update
            RequestAnimationFrame update
            isInjected = true
            $log.info 'angular-performance-stats enabled'
        isEnabled: ->
            isEnabled

    enable: enable
    $get: $get
