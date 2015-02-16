/**
 * angular-performance-stats - Angular performance Stats displays your app performance activity
 * @version v1.0.0-rc4
 * @author shprink <contact@julienrenaux.fr>
 * @link https://github.com/livingobjects/angular-memory-stats
 * @license MIT
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var MemoryStats, RequestAnimationFrame, Stats, module;

	MemoryStats = __webpack_require__(1);

	Stats = __webpack_require__(2);

	RequestAnimationFrame = __webpack_require__(3);

	module.exports = module = angular.module('angular-performance-stats', []);

	module.provider('angularPerformanceStats', function() {
	  var $get, enable, isEnabled, mode, position;
	  isEnabled = true;
	  mode = 'row';
	  position = 'bottom right';
	  enable = function(enable) {
	    if (enable == null) {
	      enable = true;
	    }
	    return isEnabled = enable;
	  };
	  mode = function(mode) {
	    if (mode == null) {
	      mode = null;
	    }
	    if (mode) {
	      return mode = mode;
	    }
	  };
	  position = function(position) {
	    if (position == null) {
	      position = null;
	    }
	    if (position) {
	      return position = position;
	    }
	  };
	  $get = function() {
	    return {
	      isEnabled: function() {
	        return isEnabled;
	      },
	      getMode: function() {
	        return mode;
	      },
	      getPosition: function() {
	        return position;
	      }
	    };
	  };
	  return {
	    enable: enable,
	    position: position,
	    mode: mode,
	    $get: $get
	  };
	});

	module.directive('angularPerformanceStats', function() {
	  return {
	    restrict: 'E',
	    scope: false,
	    controller: ["$scope", "$element", "angularPerformanceStats", function($scope, $element, angularPerformanceStats) {
	      var memoryStats, stats, statsFPS, update;
	      if (!angularPerformanceStats.isEnabled()) {
	        return;
	      }
	      memoryStats = new MemoryStats();
	      stats = new Stats();
	      statsFPS = new Stats();
	      statsFPS.setMode(0);
	      stats.setMode(1);
	      $element.css({
	        'zIndex': 999999,
	        'position': 'fixed',
	        'right': '5px',
	        'bottom': '5px'
	      });
	      $element.append(memoryStats.domElement);
	      $element.append(statsFPS.domElement);
	      $element.append(stats.domElement);
	      update = function() {
	        memoryStats.update();
	        stats.update();
	        statsFPS.update();
	        return RequestAnimationFrame(update);
	      };
	      return RequestAnimationFrame(update);
	    }]
	  };
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author jetienne / http://jetienne.com/
	 * @author paulirish / http://paulirish.com/
	 */
	module.exports = function () {

	    var msMin = 100;
	    var msMax = 0;

	    var container = document.createElement('div');
	    container.id = 'stats';
	    container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	    var msDiv = document.createElement('div');
	    msDiv.id = 'ms';
	    msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
	    container.appendChild(msDiv);

	    var msText = document.createElement('div');
	    msText.id = 'msText';
	    msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	    msText.innerHTML = 'Memory';
	    msDiv.appendChild(msText);

	    var msGraph = document.createElement('div');
	    msGraph.id = 'msGraph';
	    msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	    msDiv.appendChild(msGraph);

	    while (msGraph.children.length < 74) {

	        var bar = document.createElement('span');
	        bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
	        msGraph.appendChild(bar);

	    }

	    var updateGraph = function (dom, height, color) {

	        var child = dom.appendChild(dom.firstChild);
	        child.style.height = height + 'px';
	        if (color) child.style.backgroundColor = color;

	    }

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

	    // TODO, add a sanity check to see if values are bucketed.
	    // If so, reminde user to adopt the --enable-precise-memory-info flag.
	    // open -a "/Applications/Google Chrome.app" --args --enable-precise-memory-info

	    var lastTime = Date.now();
	    var lastUsedHeap = performance.memory.usedJSHeapSize;
	    return {
	        domElement: container,

	        update: function () {

	            // refresh only 30time per second
	            if (Date.now() - lastTime < 1000 / 30) return;
	            lastTime = Date.now()

	            var delta = performance.memory.usedJSHeapSize - lastUsedHeap;
	            lastUsedHeap = performance.memory.usedJSHeapSize;
	            var color = delta < 0 ? '#830' : '#131';

	            var ms = performance.memory.usedJSHeapSize;
	            msMin = Math.min(msMin, ms);
	            msMax = Math.max(msMax, ms);
	            msText.textContent = "Mem: " + bytesToSize(ms, 2);

	            var normValue = ms / (30 * 1024 * 1024);
	            var height = Math.min(30, 30 - normValue * 30);
	            updateGraph(msGraph, height, color);

	            function bytesToSize(bytes, nFractDigit) {
	                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	                if (bytes == 0) return 'n/a';
	                nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
	                var precision = Math.pow(10, nFractDigit);
	                var i = Math.floor(Math.log(bytes) / Math.log(1024));
	                return Math.round(bytes * precision / Math.pow(1024, i)) / precision + ' ' + sizes[i];
	            };
	        }

	    }

	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	var Stats = function() {

	    var startTime = Date.now(),
	        prevTime = startTime;
	    var ms = 0,
	        msMin = Infinity,
	        msMax = 0;
	    var fps = 0,
	        fpsMin = Infinity,
	        fpsMax = 0;
	    var frames = 0,
	        mode = 0;

	    var container = document.createElement('div');
	    container.id = 'stats';
	    // container.addEventListener('mousedown', function(event) {
	    //     event.preventDefault();
	    //     setMode(++mode % 2)
	    // }, false);
	    container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	    var fpsDiv = document.createElement('div');
	    fpsDiv.id = 'fps';
	    fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
	    container.appendChild(fpsDiv);

	    var fpsText = document.createElement('div');
	    fpsText.id = 'fpsText';
	    fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	    fpsText.innerHTML = 'FPS';
	    fpsDiv.appendChild(fpsText);

	    var fpsGraph = document.createElement('div');
	    fpsGraph.id = 'fpsGraph';
	    fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
	    fpsDiv.appendChild(fpsGraph);

	    while (fpsGraph.children.length < 74) {

	        var bar = document.createElement('span');
	        bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
	        fpsGraph.appendChild(bar);

	    }

	    var msDiv = document.createElement('div');
	    msDiv.id = 'ms';
	    msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
	    container.appendChild(msDiv);

	    var msText = document.createElement('div');
	    msText.id = 'msText';
	    msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	    msText.innerHTML = 'MS';
	    msDiv.appendChild(msText);

	    var msGraph = document.createElement('div');
	    msGraph.id = 'msGraph';
	    msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	    msDiv.appendChild(msGraph);

	    while (msGraph.children.length < 74) {

	        var bar = document.createElement('span');
	        bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
	        msGraph.appendChild(bar);

	    }

	    var setMode = function(value) {

	        mode = value;

	        switch (mode) {

	            case 0:
	                fpsDiv.style.display = 'block';
	                msDiv.style.display = 'none';
	                break;
	            case 1:
	                fpsDiv.style.display = 'none';
	                msDiv.style.display = 'block';
	                break;
	        }

	    };

	    var updateGraph = function(dom, value) {

	        var child = dom.appendChild(dom.firstChild);
	        child.style.height = value + 'px';

	    };

	    return {

	        REVISION: 12,

	        domElement: container,

	        setMode: setMode,

	        begin: function() {

	            startTime = Date.now();

	        },

	        end: function() {

	            var time = Date.now();

	            ms = time - startTime;
	            msMin = Math.min(msMin, ms);
	            msMax = Math.max(msMax, ms);

	            msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
	            updateGraph(msGraph, Math.min(30, 30 - (ms / 200) * 30));

	            frames++;

	            if (time > prevTime + 1000) {

	                fps = Math.round((frames * 1000) / (time - prevTime));
	                fpsMin = Math.min(fpsMin, fps);
	                fpsMax = Math.max(fpsMax, fps);

	                fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
	                updateGraph(fpsGraph, Math.min(30, 30 - (fps / 100) * 30));

	                prevTime = time;
	                frames = 0;

	            }

	            return time;

	        },

	        update: function() {

	            startTime = this.end();

	        }

	    }

	};

	if (true) {

	    module.exports = Stats;

	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * requestAnimationFrame version: "0.0.17" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
	 * Available via the MIT license.
	 * see: http://github.com/cagosta/requestAnimationFrame for details
	 *
	 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	 * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	 * MIT license
	 *
	 */


	( function( global ) {


	    ( function() {


	        if ( global.requestAnimationFrame ) {

	            return;

	        }

	        if ( global.webkitRequestAnimationFrame ) { // Chrome <= 23, Safari <= 6.1, Blackberry 10

	            global.requestAnimationFrame = global[ 'webkitRequestAnimationFrame' ];
	            global.cancelAnimationFrame = global[ 'webkitCancelAnimationFrame' ] || global[ 'webkitCancelRequestAnimationFrame' ];

	        }

	        // IE <= 9, Android <= 4.3, very old/rare browsers

	        var lastTime = 0;

	        global.requestAnimationFrame = function( callback ) {

	            var currTime = new Date().getTime();

	            var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );

	            var id = global.setTimeout( function() {

	                callback( currTime + timeToCall );

	            }, timeToCall );

	            lastTime = currTime + timeToCall;

	            return id; // return the id for cancellation capabilities

	        };

	        global.cancelAnimationFrame = function( id ) {

	            clearTimeout( id );

	        };

	    } )();

	    if ( true ) {

	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

	            return global.requestAnimationFrame;

	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	    }

	} )( window );

/***/ }
/******/ ])