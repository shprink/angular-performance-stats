/**
 * angular-performance-stats - Angular performance Stats displays your AngularJS app performance activity
 * @version v0.1.1
 * @author shprink <contact@julienrenaux.fr>
 * @link https://github.com/shprink/angular-performance-stats
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

	var RequestAnimationFrame, libStats, module;

	libStats = __webpack_require__(1);

	RequestAnimationFrame = __webpack_require__(2);

	module.exports = module = angular.module('angular-performance-stats', []);

	module.provider('angularPerformanceStats', function() {
	  var $get, enable, isEnabled, isInjected;
	  isEnabled = true;
	  isInjected = false;
	  enable = function(enable) {
	    if (enable == null) {
	      enable = true;
	    }
	    return isEnabled = enable;
	  };
	  $get = function($log, $document) {
	    return {
	      run: function() {
	        var body, el, update;
	        if (isInjected) {
	          return;
	        }
	        if (!isEnabled) {
	          $log.info('angular-performance-stats disabled');
	          return;
	        }
	        __webpack_require__(4);
	        body = $document.find('body');
	        el = angular.element(__webpack_require__(3));
	        body.prepend(el);
	        libStats = new libStats();
	        update = function() {
	          el.find('memory-stats').text(libStats.getMemory());
	          el.find('fps-stats').text(libStats.getFps().fps);
	          el.find('ms-stats').text(libStats.getFps().ms);
	          el.find('watchers-count').text(libStats.getWatcherCount() + ' Watchers');
	          return RequestAnimationFrame(update);
	        };
	        RequestAnimationFrame(update);
	        isInjected = true;
	        return $log.info('angular-performance-stats enabled');
	      },
	      isEnabled: function() {
	        return isEnabled;
	      }
	    };
	  };
	  return {
	    enable: enable,
	    $get: $get
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


/***/ },
/* 2 */
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<nav id=\"angular-performance-stats\">\n    <ul>\n        <li class=\"divider-vertical\"></li>\n        <li>\n            <memory-stats></memory-stats>\n        </li>\n        <li class=\"divider-vertical\"></li>\n        <li>\n            <fps-stats></fps-stats>\n        </li>\n        <li class=\"divider-vertical\"></li>\n        <li>\n            <ms-stats></ms-stats>\n        </li>\n        <li class=\"divider-vertical\"></li>\n        <li>\n            <watchers-count></watchers-count>\n        </li>\n    </ul>\n</nav>\n";

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/sass-loader/index.js!./angular-performance-stats.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/sass-loader/index.js!./angular-performance-stats.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	exports.push([module.id, "nav#angular-performance-stats {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -webkit-flex-wrap: wrap;\n      -ms-flex-wrap: wrap;\n          flex-wrap: wrap;\n  color: white;\n  background-color: #607d8b; }\n  nav#angular-performance-stats ul {\n    list-style: none;\n    margin: 0;\n    padding: 0; }\n    nav#angular-performance-stats ul li {\n      padding: .5em;\n      color: #FFF;\n      text-transform: uppercase;\n      font-weight: 600;\n      display: inline-block;\n      padding-right: 5px;\n      padding-left: 5px;\n      line-height: 20px; }\n      nav#angular-performance-stats ul li.divider-vertical {\n        padding: 0;\n        margin: 0 9px;\n        border-right: 1px solid #fff;\n        border-left: 1px solid #f2f2f2; }\n", ""]);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }
/******/ ])