/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 * @author paulirish / http://paulirish.com/
 */
module.exports = function() {

    // polyfill usedJSHeapSize
    if (window.performance && !performance.memory) {
        performance.memory = {
            usedJSHeapSize: 0
        };
    }

    // support of the API?
    if (performance.memory.totalJSHeapSize === 0) {
        console.warn('totalJSHeapSize === 0... performance.memory is only available in Chrome .')
    }

    var lastTime = Date.now();
    var frames = 0;
    var ms = 0,
        msMin = Infinity,
        msMax = 0,
        msTime = Date.now();
    var fps = 0,
        fpsMin = Infinity,
        fpsMax = 0,
        fpsPrevTime = Date.now();
    return {
        getFps: function() {
            var time = Date.now();

            ms = time - msTime;
            msMin = Math.min(msMin, ms);
            msMax = Math.max(msMax, ms);

            frames++;

            if (time > fpsPrevTime + 1000) {
                fps = Math.round((frames * 1000) / (time - fpsPrevTime));
                fpsMin = Math.min(fpsMin, fps);
                fpsMax = Math.max(fpsMax, fps);
                fpsPrevTime = time;
                frames = 0;
            }
            msTime = time;
            return {
                'ms': ms + ' MS (' + msMin + '-' + msMax + ')',
                'fps': fps + ' FPS (' + fpsMin + '-' + fpsMax + ')'
            }
        },
        getMemory: function() {
            if (Date.now() - lastTime < 1000 / 30) return;
            lastTime = Date.now()
            return bytesToSize(performance.memory.usedJSHeapSize, 2);

            function bytesToSize(bytes, nFractDigit) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return 'n/a';
                nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
                var precision = Math.pow(10, nFractDigit);
                var i = Math.floor(Math.log(bytes) / Math.log(1024));
                return Math.round(bytes * precision / Math.pow(1024, i)) / precision + ' ' + sizes[i];
            };
        },
        getWatcherCount: function() {
            var items = document.getElementsByTagName('*');
            var len = items.length;
            var i = 0;
            var watchers = 0;
            for (; i < len; i++) {
                var el = angular.element(items[i]);
                if (el.data() && el.data().hasOwnProperty('$scope') && el.data().$scope.$$watchers) {
                    watchers += el.data().$scope.$$watchers.length;
                }
            }
            return watchers;
        }
    }
};
