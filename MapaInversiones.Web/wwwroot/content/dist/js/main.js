/*global define*/
/**
 * Simple Observable Patter
 */
define('lib/mvc/Observable', [], function () {

	var Observable = function () {
		this._events = {***REMOVED***
	***REMOVED***

	/**
	 * Add
	 * @param  {String***REMOVED***   evt      Event name
	 * @param  {Function***REMOVED*** callback Callback function
	 */
	Observable.prototype.on = function (evt, callback) {
		if (!this._events[evt])
			this._events[evt] = []
		this._events[evt].push(callback)
	***REMOVED***

	/**
	 * Removes an observer (callback) from
	 * the specified event list
	 * @param  {String***REMOVED***   evt      event name
	 * @param  {Function***REMOVED*** callback
	 */
	Observable.prototype.off = function (evt, callback) {
		var index
		if (this._events[evt] &&
			~(index = this._events[evt].indexOf(callback)))
			this._events[evt].splice(index, 1)
	***REMOVED***

	/**
	 * Fires the event. Callable with any numer of arguments,
	 * but first the event name
	 * @param  {String***REMOVED*** evt the event name
	 */
	Observable.prototype.fireEvent = function (evt) {
		if (!this._events[evt])
			return
		for (var i = 0; i < this._events[evt].length; i++)
			this._events[evt][i].apply(null, [].slice.call(arguments, 1))
	***REMOVED***

	return Observable
***REMOVED***);
/*global localStorage, define*/
define('app/storage/Storage', [], function () {
	'use strict';
	var _keywordsMap = {
		status: 's',
		lastUpdated: 'l',
		type: 't',
		geojson: 'g',
		features: 'f',
		properties: 'p',
		LAT: 'LA',
		LON: 'LO',
		name: 'n',
		id: 'i',
		geometry: 'ge',
		coordinates: 'c'
	***REMOVED***

	/**
	 * Transform the JSON object to have the less possible quantity of [] and {***REMOVED***
	 * for storage
	 *
	 * @param  {Object***REMOVED*** object	raw object
	 * @return {Object***REMOVED***			optimized version
	 */
	function toLightFormat(object, parent) {
		var light = {***REMOVED***,
			key, lcord = [], lcords = [],
			i, j, k,
			keysArray = [],
			storeKey = '_dnp_'

		for (key in object) {
			if (object[key].constructor == Object) {
				light[_keywordsMap[key]] = toLightFormat(object[key], object)
			***REMOVED***
			//this is only for coordinates
			else if (key == 'coordinates') {
				if (object.type == 'Polygon') {
					for (i = 0, k = 0; i < object[key][0].length; i++, k += 2) {
						lcords[k] = object[key][0][i][0]
						lcords[k + 1] = object[key][0][i][1]
					***REMOVED***
					light[_keywordsMap[key]] = lcords
				***REMOVED*** else {
					for (i = 0; i < object[key].length; i++) {
						lcords = []
						for (j = 0, k = 0; j < object[key][i][0].length; j++, k += 2) {
							lcords[k] = object[key][i][0][j][0]
							lcords[k + 1] = object[key][i][0][j][1]
						***REMOVED***
						lcord[i] = lcords
					***REMOVED***
					light[_keywordsMap[key]] = lcord
				***REMOVED***
			***REMOVED***
			//if features (array)
			else if (key == 'features') {

				if (parent.type == 'municipio') {
					storeKey += 'ml'
				***REMOVED*** else if (parent.type == 'departamento') {
					storeKey += 'dl'
				***REMOVED*** else {
					storeKey += 'rl'
				***REMOVED***

				var lastUpdated = +localStorage.getItem(storeKey + '_up')

				if (parent.lastUpdated > lastUpdated) {
					//here we create an array of ids to link directly the elements
					//that will be stored in localStorage
					// light[_keywordsMap[key]] = [] // not necessary any moar
					for (i = 0; i < object[key].length; i++) {
						keysArray[i] = object[key][i].properties.id
						var poly = toLightFormat(object[key][i], object)
						_storeLightObject(poly)
					***REMOVED***

					var lsList = localStorage.getObject(storeKey)

					if (!lsList) {
						localStorage.setObject(storeKey, keysArray)
					***REMOVED***
					else {
						for (i = 0; i < keysArray.length; i++) {
							if (lsList.indexOf(keysArray[i]) == -1)
								lsList.push(keysArray[i])
						***REMOVED***
						localStorage.setObject(storeKey, lsList)
					***REMOVED***

					//If there where data, is updated the modified
					localStorage.setItem(storeKey + '_up', parent.lastUpdated)
				***REMOVED***
			***REMOVED***
			else {
				light[_keywordsMap[key]] = object[key]
			***REMOVED***
		***REMOVED***

		return light
	***REMOVED***


	function _storeLightObject(object) {
		var rootKey = '_dnp_'

		if (object.p.t == 'departamento') {
			rootKey += 'd_' + object.p.i
		***REMOVED*** else if (object.p.t == 'municipio') {
			rootKey += 'm_' + object.p.i
		***REMOVED*** else {
			rootKey += 'r_' + object.p.i
		***REMOVED***
		localStorage.setObject(rootKey, object)
	***REMOVED***

	function getDataList(type) {
		var lKey, iKey, array = [],
			arrayIds

		if (type == 'departments') {
			lKey = '_dnp_dl'
			iKey = '_dnp_d_'
		***REMOVED***
		else if (type == 'municipalities') {
			lKey = '_dnp_ml'
			iKey = '_dnp_m_'
		***REMOVED***
		else {
			lKey = '_dnp_rl'
			iKey = '_dnp_r_'
		***REMOVED***

		arrayIds = localStorage.getObject(lKey) || []

		for (var i = 0; i < arrayIds.length; i++) {
			array[i] = localStorage.getObject(iKey + arrayIds[i])
		***REMOVED***

		return {
			features: array,
			lastUpdated: localStorage.getItem(lKey + '_up')
		***REMOVED***
	***REMOVED***

	return {
		storeDataList: toLightFormat,
		getDataList: getDataList
	***REMOVED***
***REMOVED***);
/* Search*/

define('app/search/search', [], function () {

	var search = {
		"advanced": false,
		"anchors": {***REMOVED***,
		"click": false,
		"container": false,
		"current_depth": {
			"cip": null,
			"soc": null,
			"naics": null,
			"geo": null
		***REMOVED***,
		"data": true,
		"depth": null,
		"max": 10,
		"nesting": {
			"cip": [0, 1, 2],
			"naics": [0, 1, 2],
			"soc": [0, 1, 2, 3],
			"geo": ["040", "050", "310", "160", "860", "795", "140"]
		***REMOVED***,
		"parents": [],
		"stem_only": null,
		"term": "",
		"type": "",
		"children": {
			"geo": {
				"040": ["050", "310", ""]
			***REMOVED***
		***REMOVED***,
		"zip": false
	***REMOVED***;

	/*!
		localForage -- Offline Storage, Improved
		Version 1.4.0
		https://mozilla.github.io/localForage
		(c) 2013-2015 Mozilla, Apache License 2.0
	*/
	!function () { var a, b, c, d; !function () { var e = {***REMOVED***, f = {***REMOVED***; a = function (a, b, c) { e[a] = { deps: b, callback: c ***REMOVED*** ***REMOVED***, d = c = b = function (a) { function c(b) { if ("." !== b.charAt(0)) return b; for (var c = b.split("/"), d = a.split("/").slice(0, -1), e = 0, f = c.length; f > e; e++) { var g = c[e]; if (".." === g) d.pop(); else { if ("." === g) continue; d.push(g) ***REMOVED*** ***REMOVED*** return d.join("/") ***REMOVED*** if (d._eak_seen = e, f[a]) return f[a]; if (f[a] = {***REMOVED***, !e[a]) throw new Error("Could not find module " + a); for (var g, h = e[a], i = h.deps, j = h.callback, k = [], l = 0, m = i.length; m > l; l++) "exports" === i[l] ? k.push(g = {***REMOVED***) : k.push(b(c(i[l]))); var n = j.apply(this, k); return f[a] = g || n ***REMOVED*** ***REMOVED***(), a("promise/all", ["./utils", "exports"], function (a, b) { "use strict"; function c(a) { var b = this; if (!d(a)) throw new TypeError("You must pass an array to all."); return new b(function (b, c) { function d(a) { return function (b) { f(a, b) ***REMOVED*** ***REMOVED*** function f(a, c) { h[a] = c, 0 === --i && b(h) ***REMOVED*** var g, h = [], i = a.length; 0 === i && b([]); for (var j = 0; j < a.length; j++) g = a[j], g && e(g.then) ? g.then(d(j), c) : f(j, g) ***REMOVED***) ***REMOVED*** var d = a.isArray, e = a.isFunction; b.all = c ***REMOVED***), a("promise/asap", ["exports"], function (a) { "use strict"; function b() { return function () { process.nextTick(e) ***REMOVED*** ***REMOVED*** function c() { var a = 0, b = new i(e), c = document.createTextNode(""); return b.observe(c, { characterData: !0 ***REMOVED***), function () { c.data = a = ++a % 2 ***REMOVED*** ***REMOVED*** function d() { return function () { j.setTimeout(e, 1) ***REMOVED*** ***REMOVED*** function e() { for (var a = 0; a < k.length; a++) { var b = k[a], c = b[0], d = b[1]; c(d) ***REMOVED*** k = [] ***REMOVED*** function f(a, b) { var c = k.push([a, b]); 1 === c && g() ***REMOVED*** var g, h = "undefined" != typeof window ? window : {***REMOVED***, i = h.MutationObserver || h.WebKitMutationObserver, j = "undefined" != typeof global ? global : void 0 === this ? window : this, k = []; g = "undefined" != typeof process && "[object process]" === {***REMOVED***.toString.call(process) ? b() : i ? c() : d(), a.asap = f ***REMOVED***), a("promise/config", ["exports"], function (a) { "use strict"; function b(a, b) { return 2 !== arguments.length ? c[a] : void (c[a] = b) ***REMOVED*** var c = { instrument: !1 ***REMOVED***; a.config = c, a.configure = b ***REMOVED***), a("promise/polyfill", ["./promise", "./utils", "exports"], function (a, b, c) { "use strict"; function d() { var a; a = "undefined" != typeof global ? global : "undefined" != typeof window && window.document ? window : self; var b = "Promise" in a && "resolve" in a.Promise && "reject" in a.Promise && "all" in a.Promise && "race" in a.Promise && function () { var b; return new a.Promise(function (a) { b = a ***REMOVED***), f(b) ***REMOVED***(); b || (a.Promise = e) ***REMOVED*** var e = a.Promise, f = b.isFunction; c.polyfill = d ***REMOVED***), a("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function (a, b, c, d, e, f, g, h) { "use strict"; function i(a) { if (!v(a)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor"); if (!(this instanceof i)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."); this._subscribers = [], j(a, this) ***REMOVED*** function j(a, b) { function c(a) { o(b, a) ***REMOVED*** function d(a) { q(b, a) ***REMOVED*** try { a(c, d) ***REMOVED*** catch (e) { d(e) ***REMOVED*** ***REMOVED*** function k(a, b, c, d) { var e, f, g, h, i = v(c); if (i) try { e = c(d), g = !0 ***REMOVED*** catch (j) { h = !0, f = j ***REMOVED*** else e = d, g = !0; n(b, e) || (i && g ? o(b, e) : h ? q(b, f) : a === D ? o(b, e) : a === E && q(b, e)) ***REMOVED*** function l(a, b, c, d) { var e = a._subscribers, f = e.length; e[f] = b, e[f + D] = c, e[f + E] = d ***REMOVED*** function m(a, b) { for (var c, d, e = a._subscribers, f = a._detail, g = 0; g < e.length; g += 3) c = e[g], d = e[g + b], k(b, c, d, f); a._subscribers = null ***REMOVED*** function n(a, b) { var c, d = null; try { if (a === b) throw new TypeError("A promises callback cannot return that same promise."); if (u(b) && (d = b.then, v(d))) return d.call(b, function (d) { return c ? !0 : (c = !0, void (b !== d ? o(a, d) : p(a, d))) ***REMOVED***, function (b) { return c ? !0 : (c = !0, void q(a, b)) ***REMOVED***), !0 ***REMOVED*** catch (e) { return c ? !0 : (q(a, e), !0) ***REMOVED*** return !1 ***REMOVED*** function o(a, b) { a === b ? p(a, b) : n(a, b) || p(a, b) ***REMOVED*** function p(a, b) { a._state === B && (a._state = C, a._detail = b, t.async(r, a)) ***REMOVED*** function q(a, b) { a._state === B && (a._state = C, a._detail = b, t.async(s, a)) ***REMOVED*** function r(a) { m(a, a._state = D) ***REMOVED*** function s(a) { m(a, a._state = E) ***REMOVED*** var t = a.config, u = (a.configure, b.objectOrFunction), v = b.isFunction, w = (b.now, c.all), x = d.race, y = e.resolve, z = f.reject, A = g.asap; t.async = A; var B = void 0, C = 0, D = 1, E = 2; i.prototype = { constructor: i, _state: void 0, _detail: void 0, _subscribers: void 0, then: function (a, b) { var c = this, d = new this.constructor(function () { ***REMOVED***); if (this._state) { var e = arguments; t.async(function () { k(c._state, d, e[c._state - 1], c._detail) ***REMOVED***) ***REMOVED*** else l(this, d, a, b); return d ***REMOVED***, "catch": function (a) { return this.then(null, a) ***REMOVED*** ***REMOVED***, i.all = w, i.race = x, i.resolve = y, i.reject = z, h.Promise = i ***REMOVED***), a("promise/race", ["./utils", "exports"], function (a, b) { "use strict"; function c(a) { var b = this; if (!d(a)) throw new TypeError("You must pass an array to race."); return new b(function (b, c) { for (var d, e = 0; e < a.length; e++) d = a[e], d && "function" == typeof d.then ? d.then(b, c) : b(d) ***REMOVED***) ***REMOVED*** var d = a.isArray; b.race = c ***REMOVED***), a("promise/reject", ["exports"], function (a) { "use strict"; function b(a) { var b = this; return new b(function (b, c) { c(a) ***REMOVED***) ***REMOVED*** a.reject = b ***REMOVED***), a("promise/resolve", ["exports"], function (a) { "use strict"; function b(a) { if (a && "object" == typeof a && a.constructor === this) return a; var b = this; return new b(function (b) { b(a) ***REMOVED***) ***REMOVED*** a.resolve = b ***REMOVED***), a("promise/utils", ["exports"], function (a) { "use strict"; function b(a) { return c(a) || "object" == typeof a && null !== a ***REMOVED*** function c(a) { return "function" == typeof a ***REMOVED*** function d(a) { return "[object Array]" === Object.prototype.toString.call(a) ***REMOVED*** var e = Date.now || function () { return (new Date).getTime() ***REMOVED***; a.objectOrFunction = b, a.isFunction = c, a.isArray = d, a.now = e ***REMOVED***), b("promise/polyfill").polyfill() ***REMOVED***(), function (a, b) { "object" == typeof exports && "object" == typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? exports.localforage = b() : a.localforage = b() ***REMOVED***(this, function () { return function (a) { function b(d) { if (c[d]) return c[d].exports; var e = c[d] = { exports: {***REMOVED***, id: d, loaded: !1 ***REMOVED***; return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports ***REMOVED*** var c = {***REMOVED***; return b.m = a, b.c = c, b.p = "", b(0) ***REMOVED***([function (a, b, c) { "use strict"; function d(a, b) { if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function") ***REMOVED*** b.__esModule = !0; var e = function (a) { function b(a, b) { a[b] = function () { var c = arguments; return a.ready().then(function () { return a[b].apply(a, c) ***REMOVED***) ***REMOVED*** ***REMOVED*** function e() { for (var a = 1; a < arguments.length; a++) { var b = arguments[a]; if (b) for (var c in b) b.hasOwnProperty(c) && (m(b[c]) ? arguments[0][c] = b[c].slice() : arguments[0][c] = b[c]) ***REMOVED*** return arguments[0] ***REMOVED*** function f(a) { for (var b in h) if (h.hasOwnProperty(b) && h[b] === a) return !0; return !1 ***REMOVED*** var g = {***REMOVED***, h = { INDEXEDDB: "asyncStorage", LOCALSTORAGE: "localStorageWrapper", WEBSQL: "webSQLStorage" ***REMOVED***, i = [h.INDEXEDDB, h.WEBSQL, h.LOCALSTORAGE], j = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"], k = { description: "", driver: i.slice(), name: "localforage", size: 4980736, storeName: "keyvaluepairs", version: 1 ***REMOVED***, l = function (a) { var b = {***REMOVED***; return b[h.INDEXEDDB] = !!function () { try { var b = b || a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB || a.OIndexedDB || a.msIndexedDB; return "undefined" != typeof a.openDatabase && a.navigator && a.navigator.userAgent && /Safari/.test(a.navigator.userAgent) && !/Chrome/.test(a.navigator.userAgent) ? !1 : b && "function" == typeof b.open && "undefined" != typeof a.IDBKeyRange ***REMOVED*** catch (c) { return !1 ***REMOVED*** ***REMOVED***(), b[h.WEBSQL] = !!function () { try { return a.openDatabase ***REMOVED*** catch (b) { return !1 ***REMOVED*** ***REMOVED***(), b[h.LOCALSTORAGE] = !!function () { try { return a.localStorage && "setItem" in a.localStorage && a.localStorage.setItem ***REMOVED*** catch (b) { return !1 ***REMOVED*** ***REMOVED***(), b ***REMOVED***(a), m = Array.isArray || function (a) { return "[object Array]" === Object.prototype.toString.call(a) ***REMOVED***, n = function () { function a(b) { d(this, a), this.INDEXEDDB = h.INDEXEDDB, this.LOCALSTORAGE = h.LOCALSTORAGE, this.WEBSQL = h.WEBSQL, this._defaultConfig = e({***REMOVED***, k), this._config = e({***REMOVED***, this._defaultConfig, b), this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver) ***REMOVED*** return a.prototype.config = function (a) { if ("object" == typeof a) { if (this._ready) return new Error("Can't call config() after localforage has been used."); for (var b in a) "storeName" === b && (a[b] = a[b].replace(/\W/g, "_")), this._config[b] = a[b]; return "driver" in a && a.driver && this.setDriver(this._config.driver), !0 ***REMOVED*** return "string" == typeof a ? this._config[a] : this._config ***REMOVED***, a.prototype.defineDriver = function (a, b, c) { var d = new Promise(function (b, c) { try { var d = a._driver, e = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver"), h = new Error("Custom driver name already in use: " + a._driver); if (!a._driver) return void c(e); if (f(a._driver)) return void c(h); for (var i = j.concat("_initStorage"), k = 0; k < i.length; k++) { var m = i[k]; if (!m || !a[m] || "function" != typeof a[m]) return void c(e) ***REMOVED*** var n = Promise.resolve(!0); "_support" in a && (n = a._support && "function" == typeof a._support ? a._support() : Promise.resolve(!!a._support)), n.then(function (c) { l[d] = c, g[d] = a, b() ***REMOVED***, c) ***REMOVED*** catch (o) { c(o) ***REMOVED*** ***REMOVED***); return d.then(b, c), d ***REMOVED***, a.prototype.driver = function () { return this._driver || null ***REMOVED***, a.prototype.getDriver = function (a, b, d) { var e = this, h = function () { if (f(a)) switch (a) { case e.INDEXEDDB: return new Promise(function (a, b) { a(c(1)) ***REMOVED***); case e.LOCALSTORAGE: return new Promise(function (a, b) { a(c(2)) ***REMOVED***); case e.WEBSQL: return new Promise(function (a, b) { a(c(4)) ***REMOVED***) ***REMOVED*** else if (g[a]) return Promise.resolve(g[a]); return Promise.reject(new Error("Driver not found.")) ***REMOVED***(); return h.then(b, d), h ***REMOVED***, a.prototype.getSerializer = function (a) { var b = new Promise(function (a, b) { a(c(3)) ***REMOVED***); return a && "function" == typeof a && b.then(function (b) { a(b) ***REMOVED***), b ***REMOVED***, a.prototype.ready = function (a) { var b = this, c = b._driverSet.then(function () { return null === b._ready && (b._ready = b._initDriver()), b._ready ***REMOVED***); return c.then(a, a), c ***REMOVED***, a.prototype.setDriver = function (a, b, c) { function d() { f._config.driver = f.driver() ***REMOVED*** function e(a) { return function () { function b() { for (; c < a.length;) { var e = a[c]; return c++, f._dbInfo = null, f._ready = null, f.getDriver(e).then(function (a) { return f._extend(a), d(), f._ready = f._initStorage(f._config), f._ready ***REMOVED***)["catch"](b) ***REMOVED*** d(); var g = new Error("No available storage method found."); return f._driverSet = Promise.reject(g), f._driverSet ***REMOVED*** var c = 0; return b() ***REMOVED*** ***REMOVED*** var f = this; m(a) || (a = [a]); var g = this._getSupportedDrivers(a), h = null !== this._driverSet ? this._driverSet["catch"](function () { return Promise.resolve() ***REMOVED***) : Promise.resolve(); return this._driverSet = h.then(function () { var a = g[0]; return f._dbInfo = null, f._ready = null, f.getDriver(a).then(function (a) { f._driver = a._driver, d(), f._wrapLibraryMethodsWithReady(), f._initDriver = e(g) ***REMOVED***) ***REMOVED***)["catch"](function () { d(); var a = new Error("No available storage method found."); return f._driverSet = Promise.reject(a), f._driverSet ***REMOVED***), this._driverSet.then(b, c), this._driverSet ***REMOVED***, a.prototype.supports = function (a) { return !!l[a] ***REMOVED***, a.prototype._extend = function (a) { e(this, a) ***REMOVED***, a.prototype._getSupportedDrivers = function (a) { for (var b = [], c = 0, d = a.length; d > c; c++) { var e = a[c]; this.supports(e) && b.push(e) ***REMOVED*** return b ***REMOVED***, a.prototype._wrapLibraryMethodsWithReady = function () { for (var a = 0; a < j.length; a++) b(this, j[a]) ***REMOVED***, a.prototype.createInstance = function (b) { return new a(b) ***REMOVED***, a ***REMOVED***(); return new n ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = e, a.exports = b["default"] ***REMOVED***, function (a, b) { "use strict"; b.__esModule = !0; var c = function (a) { function b(b, c) { b = b || [], c = c || {***REMOVED***; try { return new Blob(b, c) ***REMOVED*** catch (d) { if ("TypeError" !== d.name) throw d; for (var e = a.BlobBuilder || a.MSBlobBuilder || a.MozBlobBuilder || a.WebKitBlobBuilder, f = new e, g = 0; g < b.length; g += 1) f.append(b[g]); return f.getBlob(c.type) ***REMOVED*** ***REMOVED*** function c(a) { for (var b = a.length, c = new ArrayBuffer(b), d = new Uint8Array(c), e = 0; b > e; e++) d[e] = a.charCodeAt(e); return c ***REMOVED*** function d(a) { return new Promise(function (b, c) { var d = new XMLHttpRequest; d.open("GET", a), d.withCredentials = !0, d.responseType = "arraybuffer", d.onreadystatechange = function () { return 4 === d.readyState ? 200 === d.status ? b({ response: d.response, type: d.getResponseHeader("Content-Type") ***REMOVED***) : void c({ status: d.status, response: d.response ***REMOVED***) : void 0 ***REMOVED***, d.send() ***REMOVED***) ***REMOVED*** function e(a) { return new Promise(function (c, e) { var f = b([""], { type: "image/png" ***REMOVED***), g = a.transaction([D], "readwrite"); g.objectStore(D).put(f, "key"), g.oncomplete = function () { var b = a.transaction([D], "readwrite"), f = b.objectStore(D).get("key"); f.onerror = e, f.onsuccess = function (a) { var b = a.target.result, e = URL.createObjectURL(b); d(e).then(function (a) { c(!(!a || "image/png" !== a.type)) ***REMOVED***, function () { c(!1) ***REMOVED***).then(function () { URL.revokeObjectURL(e) ***REMOVED***) ***REMOVED*** ***REMOVED***, g.onerror = g.onabort = e ***REMOVED***)["catch"](function () { return !1 ***REMOVED***) ***REMOVED*** function f(a) { return "boolean" == typeof B ? Promise.resolve(B) : e(a).then(function (a) { return B = a ***REMOVED***) ***REMOVED*** function g(a) { return new Promise(function (b, c) { var d = new FileReader; d.onerror = c, d.onloadend = function (c) { var d = btoa(c.target.result || ""); b({ __local_forage_encoded_blob: !0, data: d, type: a.type ***REMOVED***) ***REMOVED***, d.readAsBinaryString(a) ***REMOVED***) ***REMOVED*** function h(a) { var d = c(atob(a.data)); return b([d], { type: a.type ***REMOVED***) ***REMOVED*** function i(a) { return a && a.__local_forage_encoded_blob ***REMOVED*** function j(a) { var b = this, c = b._initReady().then(function () { var a = C[b._dbInfo.name]; return a && a.dbReady ? a.dbReady : void 0 ***REMOVED***); return c.then(a, a), c ***REMOVED*** function k(a) { var b = C[a.name], c = {***REMOVED***; c.promise = new Promise(function (a) { c.resolve = a ***REMOVED***), b.deferredOperations.push(c), b.dbReady ? b.dbReady = b.dbReady.then(function () { return c.promise ***REMOVED***) : b.dbReady = c.promise ***REMOVED*** function l(a) { var b = C[a.name], c = b.deferredOperations.pop(); c && c.resolve() ***REMOVED*** function m(a) { function b() { return Promise.resolve() ***REMOVED*** var c = this, d = { db: null ***REMOVED***; if (a) for (var e in a) d[e] = a[e]; C || (C = {***REMOVED***); var f = C[d.name]; f || (f = { forages: [], db: null, dbReady: null, deferredOperations: [] ***REMOVED***, C[d.name] = f), f.forages.push(c), c._initReady || (c._initReady = c.ready, c.ready = j); for (var g = [], h = 0; h < f.forages.length; h++) { var i = f.forages[h]; i !== c && g.push(i._initReady()["catch"](b)) ***REMOVED*** var k = f.forages.slice(0); return Promise.all(g).then(function () { return d.db = f.db, n(d) ***REMOVED***).then(function (a) { return d.db = a, q(d, c._defaultConfig.version) ? o(d) : a ***REMOVED***).then(function (a) { d.db = f.db = a, c._dbInfo = d; for (var b = 0; b < k.length; b++) { var e = k[b]; e !== c && (e._dbInfo.db = d.db, e._dbInfo.version = d.version) ***REMOVED*** ***REMOVED***) ***REMOVED*** function n(a) { return p(a, !1) ***REMOVED*** function o(a) { return p(a, !0) ***REMOVED*** function p(b, c) { return new Promise(function (d, e) { if (b.db) { if (!c) return d(b.db); k(b), b.db.close() ***REMOVED*** var f = [b.name]; c && f.push(b.version); var g = A.open.apply(A, f); c && (g.onupgradeneeded = function (c) { var d = g.result; try { d.createObjectStore(b.storeName), c.oldVersion <= 1 && d.createObjectStore(D) ***REMOVED*** catch (e) { if ("ConstraintError" !== e.name) throw e; a.console.warn('The database "' + b.name + '" has been upgraded from version ' + c.oldVersion + " to version " + c.newVersion + ', but the storage "' + b.storeName + '" already exists.') ***REMOVED*** ***REMOVED***), g.onerror = function () { e(g.error) ***REMOVED***, g.onsuccess = function () { d(g.result), l(b) ***REMOVED*** ***REMOVED***) ***REMOVED*** function q(b, c) { if (!b.db) return !0; var d = !b.db.objectStoreNames.contains(b.storeName), e = b.version < b.db.version, f = b.version > b.db.version; if (e && (b.version !== c && a.console.warn('The database "' + b.name + "\" can't be downgraded from version " + b.db.version + " to version " + b.version + "."), b.version = b.db.version), f || d) { if (d) { var g = b.db.version + 1; g > b.version && (b.version = g) ***REMOVED*** return !0 ***REMOVED*** return !1 ***REMOVED*** function r(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = new Promise(function (a, c) { d.ready().then(function () { var e = d._dbInfo, f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName), g = f.get(b); g.onsuccess = function () { var b = g.result; void 0 === b && (b = null), i(b) && (b = h(b)), a(b) ***REMOVED***, g.onerror = function () { c(g.error) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(e, c), e ***REMOVED*** function s(a, b) { var c = this, d = new Promise(function (b, d) { c.ready().then(function () { var e = c._dbInfo, f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName), g = f.openCursor(), j = 1; g.onsuccess = function () { var c = g.result; if (c) { var d = c.value; i(d) && (d = h(d)); var e = a(d, c.key, j++); void 0 !== e ? b(e) : c["continue"]() ***REMOVED*** else b() ***REMOVED***, g.onerror = function () { d(g.error) ***REMOVED*** ***REMOVED***)["catch"](d) ***REMOVED***); return z(d, b), d ***REMOVED*** function t(b, c, d) { var e = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var h = new Promise(function (a, d) { var h; e.ready().then(function () { return h = e._dbInfo, c instanceof Blob ? f(h.db).then(function (a) { return a ? c : g(c) ***REMOVED***) : c ***REMOVED***).then(function (c) { var e = h.db.transaction(h.storeName, "readwrite"), f = e.objectStore(h.storeName); null === c && (c = void 0), e.oncomplete = function () { void 0 === c && (c = null), a(c) ***REMOVED***, e.onabort = e.onerror = function () { var a = g.error ? g.error : g.transaction.error; d(a) ***REMOVED***; var g = f.put(c, b) ***REMOVED***)["catch"](d) ***REMOVED***); return z(h, d), h ***REMOVED*** function u(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = new Promise(function (a, c) { d.ready().then(function () { var e = d._dbInfo, f = e.db.transaction(e.storeName, "readwrite"), g = f.objectStore(e.storeName), h = g["delete"](b); f.oncomplete = function () { a() ***REMOVED***, f.onerror = function () { c(h.error) ***REMOVED***, f.onabort = function () { var a = h.error ? h.error : h.transaction.error; c(a) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(e, c), e ***REMOVED*** function v(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo, e = d.db.transaction(d.storeName, "readwrite"), f = e.objectStore(d.storeName), g = f.clear(); e.oncomplete = function () { a() ***REMOVED***, e.onabort = e.onerror = function () { var a = g.error ? g.error : g.transaction.error; c(a) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(c, a), c ***REMOVED*** function w(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo, e = d.db.transaction(d.storeName, "readonly").objectStore(d.storeName), f = e.count(); f.onsuccess = function () { a(f.result) ***REMOVED***, f.onerror = function () { c(f.error) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(c, a), c ***REMOVED*** function x(a, b) { var c = this, d = new Promise(function (b, d) { return 0 > a ? void b(null) : void c.ready().then(function () { var e = c._dbInfo, f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName), g = !1, h = f.openCursor(); h.onsuccess = function () { var c = h.result; return c ? void (0 === a ? b(c.key) : g ? b(c.key) : (g = !0, c.advance(a))) : void b(null) ***REMOVED***, h.onerror = function () { d(h.error) ***REMOVED*** ***REMOVED***)["catch"](d) ***REMOVED***); return z(d, b), d ***REMOVED*** function y(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo, e = d.db.transaction(d.storeName, "readonly").objectStore(d.storeName), f = e.openCursor(), g = []; f.onsuccess = function () { var b = f.result; return b ? (g.push(b.key), void b["continue"]()) : void a(g) ***REMOVED***, f.onerror = function () { c(f.error) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(c, a), c ***REMOVED*** function z(a, b) { b && a.then(function (a) { b(null, a) ***REMOVED***, function (a) { b(a) ***REMOVED***) ***REMOVED*** var A = A || a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB || a.OIndexedDB || a.msIndexedDB; if (A) { var B, C, D = "local-forage-detect-blob-support", E = { _driver: "asyncStorage", _initStorage: m, iterate: s, getItem: r, setItem: t, removeItem: u, clear: v, length: w, key: x, keys: y ***REMOVED***; return E ***REMOVED*** ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = c, a.exports = b["default"] ***REMOVED***, function (a, b, c) { "use strict"; b.__esModule = !0; var d = function (a) { function b(a) { var b = this, d = {***REMOVED***; if (a) for (var e in a) d[e] = a[e]; return d.keyPrefix = d.name + "/", d.storeName !== b._defaultConfig.storeName && (d.keyPrefix += d.storeName + "/"), b._dbInfo = d, new Promise(function (a, b) { a(c(3)) ***REMOVED***).then(function (a) { return d.serializer = a, Promise.resolve() ***REMOVED***) ***REMOVED*** function d(a) { var b = this, c = b.ready().then(function () { for (var a = b._dbInfo.keyPrefix, c = m.length - 1; c >= 0; c--) { var d = m.key(c); 0 === d.indexOf(a) && m.removeItem(d) ***REMOVED*** ***REMOVED***); return l(c, a), c ***REMOVED*** function e(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = d.ready().then(function () { var a = d._dbInfo, c = m.getItem(a.keyPrefix + b); return c && (c = a.serializer.deserialize(c)), c ***REMOVED***); return l(e, c), e ***REMOVED*** function f(a, b) { var c = this, d = c.ready().then(function () { for (var b = c._dbInfo, d = b.keyPrefix, e = d.length, f = m.length, g = 1, h = 0; f > h; h++) { var i = m.key(h); if (0 === i.indexOf(d)) { var j = m.getItem(i); if (j && (j = b.serializer.deserialize(j)), j = a(j, i.substring(e), g++), void 0 !== j) return j ***REMOVED*** ***REMOVED*** ***REMOVED***); return l(d, b), d ***REMOVED*** function g(a, b) { var c = this, d = c.ready().then(function () { var b, d = c._dbInfo; try { b = m.key(a) ***REMOVED*** catch (e) { b = null ***REMOVED*** return b && (b = b.substring(d.keyPrefix.length)), b ***REMOVED***); return l(d, b), d ***REMOVED*** function h(a) { var b = this, c = b.ready().then(function () { for (var a = b._dbInfo, c = m.length, d = [], e = 0; c > e; e++) 0 === m.key(e).indexOf(a.keyPrefix) && d.push(m.key(e).substring(a.keyPrefix.length)); return d ***REMOVED***); return l(c, a), c ***REMOVED*** function i(a) { var b = this, c = b.keys().then(function (a) { return a.length ***REMOVED***); return l(c, a), c ***REMOVED*** function j(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = d.ready().then(function () { var a = d._dbInfo; m.removeItem(a.keyPrefix + b) ***REMOVED***); return l(e, c), e ***REMOVED*** function k(b, c, d) { var e = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var f = e.ready().then(function () { void 0 === c && (c = null); var a = c; return new Promise(function (d, f) { var g = e._dbInfo; g.serializer.serialize(c, function (c, e) { if (e) f(e); else try { m.setItem(g.keyPrefix + b, c), d(a) ***REMOVED*** catch (h) { ("QuotaExceededError" === h.name || "NS_ERROR_DOM_QUOTA_REACHED" === h.name) && f(h), f(h) ***REMOVED*** ***REMOVED***) ***REMOVED***) ***REMOVED***); return l(f, d), f ***REMOVED*** function l(a, b) { b && a.then(function (a) { b(null, a) ***REMOVED***, function (a) { b(a) ***REMOVED***) ***REMOVED*** var m = null; try { if (!(a.localStorage && "setItem" in a.localStorage)) return; m = a.localStorage ***REMOVED*** catch (n) { return ***REMOVED*** var o = { _driver: "localStorageWrapper", _initStorage: b, iterate: f, getItem: e, setItem: k, removeItem: j, clear: d, length: i, key: g, keys: h ***REMOVED***; return o ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = d, a.exports = b["default"] ***REMOVED***, function (a, b) { "use strict"; b.__esModule = !0; var c = function (a) { function b(b, c) { b = b || [], c = c || {***REMOVED***; try { return new Blob(b, c) ***REMOVED*** catch (d) { if ("TypeError" !== d.name) throw d; for (var e = a.BlobBuilder || a.MSBlobBuilder || a.MozBlobBuilder || a.WebKitBlobBuilder, f = new e, g = 0; g < b.length; g += 1) f.append(b[g]); return f.getBlob(c.type) ***REMOVED*** ***REMOVED*** function c(a, b) { var c = ""; if (a && (c = a.toString()), a && ("[object ArrayBuffer]" === a.toString() || a.buffer && "[object ArrayBuffer]" === a.buffer.toString())) { var d, e = j; a instanceof ArrayBuffer ? (d = a, e += l) : (d = a.buffer, "[object Int8Array]" === c ? e += n : "[object Uint8Array]" === c ? e += o : "[object Uint8ClampedArray]" === c ? e += p : "[object Int16Array]" === c ? e += q : "[object Uint16Array]" === c ? e += s : "[object Int32Array]" === c ? e += r : "[object Uint32Array]" === c ? e += t : "[object Float32Array]" === c ? e += u : "[object Float64Array]" === c ? e += v : b(new Error("Failed to get type for BinaryArray"))), b(e + f(d)) ***REMOVED*** else if ("[object Blob]" === c) { var g = new FileReader; g.onload = function () { var c = h + a.type + "~" + f(this.result); b(j + m + c) ***REMOVED***, g.readAsArrayBuffer(a) ***REMOVED*** else try { b(JSON.stringify(a)) ***REMOVED*** catch (i) { console.error("Couldn't convert value into a JSON string: ", a), b(null, i) ***REMOVED*** ***REMOVED*** function d(a) { if (a.substring(0, k) !== j) return JSON.parse(a); var c, d = a.substring(w), f = a.substring(k, w); if (f === m && i.test(d)) { var g = d.match(i); c = g[1], d = d.substring(g[0].length) ***REMOVED*** var h = e(d); switch (f) { case l: return h; case m: return b([h], { type: c ***REMOVED***); case n: return new Int8Array(h); case o: return new Uint8Array(h); case p: return new Uint8ClampedArray(h); case q: return new Int16Array(h); case s: return new Uint16Array(h); case r: return new Int32Array(h); case t: return new Uint32Array(h); case u: return new Float32Array(h); case v: return new Float64Array(h); default: throw new Error("Unkown type: " + f) ***REMOVED*** ***REMOVED*** function e(a) { var b, c, d, e, f, h = .75 * a.length, i = a.length, j = 0; "=" === a[a.length - 1] && (h--, "=" === a[a.length - 2] && h--); var k = new ArrayBuffer(h), l = new Uint8Array(k); for (b = 0; i > b; b += 4) c = g.indexOf(a[b]), d = g.indexOf(a[b + 1]), e = g.indexOf(a[b + 2]), f = g.indexOf(a[b + 3]), l[j++] = c << 2 | d >> 4, l[j++] = (15 & d) << 4 | e >> 2, l[j++] = (3 & e) << 6 | 63 & f; return k ***REMOVED*** function f(a) { var b, c = new Uint8Array(a), d = ""; for (b = 0; b < c.length; b += 3) d += g[c[b] >> 2], d += g[(3 & c[b]) << 4 | c[b + 1] >> 4], d += g[(15 & c[b + 1]) << 2 | c[b + 2] >> 6], d += g[63 & c[b + 2]]; return c.length % 3 === 2 ? d = d.substring(0, d.length - 1) + "=" : c.length % 3 === 1 && (d = d.substring(0, d.length - 2) + "=="), d ***REMOVED*** var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", h = "~~local_forage_type~", i = /^~~local_forage_type~([^~]+)~/, j = "__lfsc__:", k = j.length, l = "arbf", m = "blob", n = "si08", o = "ui08", p = "uic8", q = "si16", r = "si32", s = "ur16", t = "ui32", u = "fl32", v = "fl64", w = k + l.length, x = { serialize: c, deserialize: d, stringToBuffer: e, bufferToString: f ***REMOVED***; return x ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = c, a.exports = b["default"] ***REMOVED***, function (a, b, c) { "use strict"; b.__esModule = !0; var d = function (a) { function b(a) { var b = this, d = { db: null ***REMOVED***; if (a) for (var e in a) d[e] = "string" != typeof a[e] ? a[e].toString() : a[e]; var f = new Promise(function (a, c) { try { d.db = m(d.name, String(d.version), d.description, d.size) ***REMOVED*** catch (e) { return c(e) ***REMOVED*** d.db.transaction(function (e) { e.executeSql("CREATE TABLE IF NOT EXISTS " + d.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], function () { b._dbInfo = d, a() ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***); return new Promise(function (a, b) { a(c(3)) ***REMOVED***).then(function (a) { return d.serializer = a, f ***REMOVED***) ***REMOVED*** function d(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = new Promise(function (a, c) { d.ready().then(function () { var e = d._dbInfo; e.db.transaction(function (d) { d.executeSql("SELECT * FROM " + e.storeName + " WHERE key = ? LIMIT 1", [b], function (b, c) { var d = c.rows.length ? c.rows.item(0).value : null; d && (d = e.serializer.deserialize(d)), a(d) ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(e, c), e ***REMOVED*** function e(a, b) { var c = this, d = new Promise(function (b, d) { c.ready().then(function () { var e = c._dbInfo; e.db.transaction(function (c) { c.executeSql("SELECT * FROM " + e.storeName, [], function (c, d) { for (var f = d.rows, g = f.length, h = 0; g > h; h++) { var i = f.item(h), j = i.value; if (j && (j = e.serializer.deserialize(j)), j = a(j, i.key, h + 1), void 0 !== j) return void b(j) ***REMOVED*** b() ***REMOVED***, function (a, b) { d(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](d) ***REMOVED***); return l(d, b), d ***REMOVED*** function f(b, c, d) { var e = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var f = new Promise(function (a, d) { e.ready().then(function () { void 0 === c && (c = null); var f = c, g = e._dbInfo; g.serializer.serialize(c, function (c, e) { e ? d(e) : g.db.transaction(function (e) { e.executeSql("INSERT OR REPLACE INTO " + g.storeName + " (key, value) VALUES (?, ?)", [b, c], function () { a(f) ***REMOVED***, function (a, b) { d(b) ***REMOVED***) ***REMOVED***, function (a) { a.code === a.QUOTA_ERR && d(a) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](d) ***REMOVED***); return l(f, d), f ***REMOVED*** function g(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = new Promise(function (a, c) { d.ready().then(function () { var e = d._dbInfo; e.db.transaction(function (d) { d.executeSql("DELETE FROM " + e.storeName + " WHERE key = ?", [b], function () { a() ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(e, c), e ***REMOVED*** function h(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo; d.db.transaction(function (b) { b.executeSql("DELETE FROM " + d.storeName, [], function () { a() ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(c, a), c ***REMOVED*** function i(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo; d.db.transaction(function (b) { b.executeSql("SELECT COUNT(key) as c FROM " + d.storeName, [], function (b, c) { var d = c.rows.item(0).c; a(d) ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(c, a), c ***REMOVED*** function j(a, b) { var c = this, d = new Promise(function (b, d) { c.ready().then(function () { var e = c._dbInfo; e.db.transaction(function (c) { c.executeSql("SELECT key FROM " + e.storeName + " WHERE id = ? LIMIT 1", [a + 1], function (a, c) { var d = c.rows.length ? c.rows.item(0).key : null; b(d) ***REMOVED***, function (a, b) { d(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](d) ***REMOVED***); return l(d, b), d ***REMOVED*** function k(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo; d.db.transaction(function (b) { b.executeSql("SELECT key FROM " + d.storeName, [], function (b, c) { for (var d = [], e = 0; e < c.rows.length; e++) d.push(c.rows.item(e).key); a(d) ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(c, a), c ***REMOVED*** function l(a, b) { b && a.then(function (a) { b(null, a) ***REMOVED***, function (a) { b(a) ***REMOVED***) ***REMOVED*** var m = a.openDatabase; if (m) { var n = { _driver: "webSQLStorage", _initStorage: b, iterate: e, getItem: d, setItem: f, removeItem: g, clear: h, length: i, key: j, keys: k ***REMOVED***; return n ***REMOVED*** ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = d, a.exports = b["default"] ***REMOVED***]) ***REMOVED***);

	var LZString = function () { function o(o, r) { if (!t[o]) { t[o] = {***REMOVED***; for (var n = 0; n < o.length; n++) t[o][o.charAt(n)] = n ***REMOVED*** return t[o][r] ***REMOVED*** var r = String.fromCharCode, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", t = {***REMOVED***, i = { compressToBase64: function (o) { if (null == o) return ""; var r = i._compress(o, 6, function (o) { return n.charAt(o) ***REMOVED***); switch (r.length % 4) { default: case 0: return r; case 1: return r + "==="; case 2: return r + "=="; case 3: return r + "=" ***REMOVED*** ***REMOVED***, decompressFromBase64: function (r) { return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function (e) { return o(n, r.charAt(e)) ***REMOVED***) ***REMOVED***, compressToUTF16: function (o) { return null == o ? "" : i._compress(o, 15, function (o) { return r(o + 32) ***REMOVED***) + " " ***REMOVED***, decompressFromUTF16: function (o) { return null == o ? "" : "" == o ? null : i._decompress(o.length, 16384, function (r) { return o.charCodeAt(r) - 32 ***REMOVED***) ***REMOVED***, compressToUint8Array: function (o) { for (var r = i.compress(o), n = new Uint8Array(2 * r.length), e = 0, t = r.length; t > e; e++) { var s = r.charCodeAt(e); n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256 ***REMOVED*** return n ***REMOVED***, decompressFromUint8Array: function (o) { if (null === o || void 0 === o) return i.decompress(o); for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++) n[e] = 256 * o[2 * e] + o[2 * e + 1]; var s = []; return n.forEach(function (o) { s.push(r(o)) ***REMOVED***), i.decompress(s.join("")) ***REMOVED***, compressToEncodedURIComponent: function (o) { return null == o ? "" : i._compress(o, 6, function (o) { return e.charAt(o) ***REMOVED***) ***REMOVED***, decompressFromEncodedURIComponent: function (r) { return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function (n) { return o(e, r.charAt(n)) ***REMOVED***)) ***REMOVED***, compress: function (o) { return i._compress(o, 16, function (o) { return r(o) ***REMOVED***) ***REMOVED***, _compress: function (o, r, n) { if (null == o) return ""; var e, t, i, s = {***REMOVED***, p = {***REMOVED***, u = "", c = "", a = "", l = 2, f = 3, h = 2, d = [], m = 0, v = 0; for (i = 0; i < o.length; i += 1) if (u = o.charAt(i), Object.prototype.hasOwnProperty.call(s, u) || (s[u] = f++, p[u] = !0), c = a + u, Object.prototype.hasOwnProperty.call(s, c)) a = c; else { if (Object.prototype.hasOwnProperty.call(p, a)) { if (a.charCodeAt(0) < 256) { for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++; for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 ***REMOVED*** else { for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0; for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 ***REMOVED*** l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a] ***REMOVED*** else for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; l--, 0 == l && (l = Math.pow(2, h), h++), s[c] = f++, a = String(u) ***REMOVED*** if ("" !== a) { if (Object.prototype.hasOwnProperty.call(p, a)) { if (a.charCodeAt(0) < 256) { for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++; for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 ***REMOVED*** else { for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0; for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 ***REMOVED*** l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a] ***REMOVED*** else for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; l--, 0 == l && (l = Math.pow(2, h), h++) ***REMOVED*** for (t = 2, e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; for (; ;) { if (m <<= 1, v == r - 1) { d.push(n(m)); break ***REMOVED*** v++ ***REMOVED*** return d.join("") ***REMOVED***, decompress: function (o) { return null == o ? "" : "" == o ? null : i._decompress(o.length, 32768, function (r) { return o.charCodeAt(r) ***REMOVED***) ***REMOVED***, _decompress: function (o, n, e) { var t, i, s, p, u, c, a, l, f = [], h = 4, d = 4, m = 3, v = "", w = [], A = { val: e(0), position: n, index: 1 ***REMOVED***; for (i = 0; 3 > i; i += 1) f[i] = i; for (p = 0, c = Math.pow(2, 2), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; switch (t = p) { case 0: for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; l = r(p); break; case 1: for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; l = r(p); break; case 2: return "" ***REMOVED*** for (f[3] = l, s = l, w.push(l); ;) { if (A.index > o) return ""; for (p = 0, c = Math.pow(2, m), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; switch (l = p) { case 0: for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; f[d++] = r(p), l = d - 1, h--; break; case 1: for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; f[d++] = r(p), l = d - 1, h--; break; case 2: return w.join("") ***REMOVED*** if (0 == h && (h = Math.pow(2, m), m++), f[l]) v = f[l]; else { if (l !== d) return null; v = s + s.charAt(0) ***REMOVED*** w.push(v), f[d++] = s + v.charAt(0), h--, s = v, 0 == h && (h = Math.pow(2, m), m++) ***REMOVED*** ***REMOVED*** ***REMOVED***; return i ***REMOVED***(); "function" == typeof define && define.amd ? define(function () { return LZString ***REMOVED***) : "undefined" != typeof module && null != module && (module.exports = LZString);

	!function (t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else { var n; n = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, n.ss = t() ***REMOVED*** ***REMOVED***(function () { return function t(n, r, e) { function i(u, s) { if (!r[u]) { if (!n[u]) { var a = "function" == typeof require && require; if (!s && a) return a(u, !0); if (o) return o(u, !0); var f = new Error("Cannot find module '" + u + "'"); throw f.code = "MODULE_NOT_FOUND", f ***REMOVED*** var l = r[u] = { exports: {***REMOVED*** ***REMOVED***; n[u][0].call(l.exports, function (t) { var r = n[u][1][t]; return i(r ? r : t) ***REMOVED***, l, l.exports, t, n, r, e) ***REMOVED*** return r[u].exports ***REMOVED*** for (var o = "function" == typeof require && require, u = 0; u < e.length; u++) i(e[u]); return i ***REMOVED***({ 1: [function (t, n, r) { "use strict"; var e = n.exports = {***REMOVED***; e.linearRegression = t(17), e.linearRegressionLine = t(18), e.standardDeviation = t(43), e.rSquared = t(32), e.mode = t(25), e.min = t(23), e.max = t(20), e.sum = t(45), e.quantile = t(30), e.quantileSorted = t(31), e.iqr = e.interquartileRange = t(15), e.medianAbsoluteDeviation = e.mad = t(19), e.chunk = t(7), e.shuffle = t(40), e.shuffleInPlace = t(41), e.sample = t(34), e.ckmeans = t(8), e.sortedUniqueCount = t(42), e.sumNthPowerDeviations = t(46), e.sampleCovariance = t(36), e.sampleCorrelation = t(35), e.sampleVariance = t(39), e.sampleStandardDeviation = t(38), e.sampleSkewness = t(37), e.geometricMean = t(13), e.harmonicMean = t(14), e.mean = e.average = t(21), e.median = t(22), e.rootMeanSquare = e.rms = t(33), e.variance = t(49), e.tTest = t(47), e.tTestTwoSample = t(48), e.bayesian = t(2), e.perceptron = t(27), e.epsilon = t(10), e.factorial = t(12), e.bernoulliDistribution = t(3), e.binomialDistribution = t(4), e.poissonDistribution = t(28), e.chiSquaredGoodnessOfFit = t(6), e.zScore = t(50), e.cumulativeStdNormalProbability = t(9), e.standardNormalTable = t(44), e.errorFunction = e.erf = t(11), e.inverseErrorFunction = t(16), e.probit = t(29), e.mixin = t(24) ***REMOVED***, { 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 2: 2, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 27: 27, 28: 28, 29: 29, 3: 3, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 4: 4, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 6: 6, 7: 7, 8: 8, 9: 9 ***REMOVED***], 2: [function (t, n, r) { "use strict"; function e() { this.totalCount = 0, this.data = {***REMOVED*** ***REMOVED*** e.prototype.train = function (t, n) { this.data[n] || (this.data[n] = {***REMOVED***); for (var r in t) { var e = t[r]; void 0 === this.data[n][r] && (this.data[n][r] = {***REMOVED***), void 0 === this.data[n][r][e] && (this.data[n][r][e] = 0), this.data[n][r][t[r]]++ ***REMOVED*** this.totalCount++ ***REMOVED***, e.prototype.score = function (t) { var n, r = {***REMOVED***; for (var e in t) { var i = t[e]; for (n in this.data) void 0 === r[n] && (r[n] = {***REMOVED***), this.data[n][e] ? r[n][e + "_" + i] = (this.data[n][e][i] || 0) / this.totalCount : r[n][e + "_" + i] = 0 ***REMOVED*** var o = {***REMOVED***; for (n in r) for (var u in r[n]) void 0 === o[n] && (o[n] = 0), o[n] += r[n][u]; return o ***REMOVED***, n.exports = e ***REMOVED***, {***REMOVED***], 3: [function (t, n, r) { "use strict"; function e(t) { return 0 > t || t > 1 ? null : i(1, t) ***REMOVED*** var i = t(4); n.exports = e ***REMOVED***, { 4: 4 ***REMOVED***], 4: [function (t, n, r) { "use strict"; function e(t, n) { if (0 > n || n > 1 || 0 >= t || t % 1 !== 0) return null; var r = 0, e = 0, u = {***REMOVED***; do u[r] = o(t) / (o(r) * o(t - r)) * (Math.pow(n, r) * Math.pow(1 - n, t - r)), e += u[r], r++; while (1 - i > e); return u ***REMOVED*** var i = t(10), o = t(12); n.exports = e ***REMOVED***, { 10: 10, 12: 12 ***REMOVED***], 5: [function (t, n, r) { "use strict"; var e = { 1: { .995: 0, .99: 0, .975: 0, .95: 0, .9: .02, .5: .45, .1: 2.71, .05: 3.84, .025: 5.02, .01: 6.63, .005: 7.88 ***REMOVED***, 2: { .995: .01, .99: .02, .975: .05, .95: .1, .9: .21, .5: 1.39, .1: 4.61, .05: 5.99, .025: 7.38, .01: 9.21, .005: 10.6 ***REMOVED***, 3: { .995: .07, .99: .11, .975: .22, .95: .35, .9: .58, .5: 2.37, .1: 6.25, .05: 7.81, .025: 9.35, .01: 11.34, .005: 12.84 ***REMOVED***, 4: { .995: .21, .99: .3, .975: .48, .95: .71, .9: 1.06, .5: 3.36, .1: 7.78, .05: 9.49, .025: 11.14, .01: 13.28, .005: 14.86 ***REMOVED***, 5: { .995: .41, .99: .55, .975: .83, .95: 1.15, .9: 1.61, .5: 4.35, .1: 9.24, .05: 11.07, .025: 12.83, .01: 15.09, .005: 16.75 ***REMOVED***, 6: { .995: .68, .99: .87, .975: 1.24, .95: 1.64, .9: 2.2, .5: 5.35, .1: 10.65, .05: 12.59, .025: 14.45, .01: 16.81, .005: 18.55 ***REMOVED***, 7: { .995: .99, .99: 1.25, .975: 1.69, .95: 2.17, .9: 2.83, .5: 6.35, .1: 12.02, .05: 14.07, .025: 16.01, .01: 18.48, .005: 20.28 ***REMOVED***, 8: { .995: 1.34, .99: 1.65, .975: 2.18, .95: 2.73, .9: 3.49, .5: 7.34, .1: 13.36, .05: 15.51, .025: 17.53, .01: 20.09, .005: 21.96 ***REMOVED***, 9: { .995: 1.73, .99: 2.09, .975: 2.7, .95: 3.33, .9: 4.17, .5: 8.34, .1: 14.68, .05: 16.92, .025: 19.02, .01: 21.67, .005: 23.59 ***REMOVED***, 10: { .995: 2.16, .99: 2.56, .975: 3.25, .95: 3.94, .9: 4.87, .5: 9.34, .1: 15.99, .05: 18.31, .025: 20.48, .01: 23.21, .005: 25.19 ***REMOVED***, 11: { .995: 2.6, .99: 3.05, .975: 3.82, .95: 4.57, .9: 5.58, .5: 10.34, .1: 17.28, .05: 19.68, .025: 21.92, .01: 24.72, .005: 26.76 ***REMOVED***, 12: { .995: 3.07, .99: 3.57, .975: 4.4, .95: 5.23, .9: 6.3, .5: 11.34, .1: 18.55, .05: 21.03, .025: 23.34, .01: 26.22, .005: 28.3 ***REMOVED***, 13: { .995: 3.57, .99: 4.11, .975: 5.01, .95: 5.89, .9: 7.04, .5: 12.34, .1: 19.81, .05: 22.36, .025: 24.74, .01: 27.69, .005: 29.82 ***REMOVED***, 14: { .995: 4.07, .99: 4.66, .975: 5.63, .95: 6.57, .9: 7.79, .5: 13.34, .1: 21.06, .05: 23.68, .025: 26.12, .01: 29.14, .005: 31.32 ***REMOVED***, 15: { .995: 4.6, .99: 5.23, .975: 6.27, .95: 7.26, .9: 8.55, .5: 14.34, .1: 22.31, .05: 25, .025: 27.49, .01: 30.58, .005: 32.8 ***REMOVED***, 16: { .995: 5.14, .99: 5.81, .975: 6.91, .95: 7.96, .9: 9.31, .5: 15.34, .1: 23.54, .05: 26.3, .025: 28.85, .01: 32, .005: 34.27 ***REMOVED***, 17: { .995: 5.7, .99: 6.41, .975: 7.56, .95: 8.67, .9: 10.09, .5: 16.34, .1: 24.77, .05: 27.59, .025: 30.19, .01: 33.41, .005: 35.72 ***REMOVED***, 18: { .995: 6.26, .99: 7.01, .975: 8.23, .95: 9.39, .9: 10.87, .5: 17.34, .1: 25.99, .05: 28.87, .025: 31.53, .01: 34.81, .005: 37.16 ***REMOVED***, 19: { .995: 6.84, .99: 7.63, .975: 8.91, .95: 10.12, .9: 11.65, .5: 18.34, .1: 27.2, .05: 30.14, .025: 32.85, .01: 36.19, .005: 38.58 ***REMOVED***, 20: { .995: 7.43, .99: 8.26, .975: 9.59, .95: 10.85, .9: 12.44, .5: 19.34, .1: 28.41, .05: 31.41, .025: 34.17, .01: 37.57, .005: 40 ***REMOVED***, 21: { .995: 8.03, .99: 8.9, .975: 10.28, .95: 11.59, .9: 13.24, .5: 20.34, .1: 29.62, .05: 32.67, .025: 35.48, .01: 38.93, .005: 41.4 ***REMOVED***, 22: { .995: 8.64, .99: 9.54, .975: 10.98, .95: 12.34, .9: 14.04, .5: 21.34, .1: 30.81, .05: 33.92, .025: 36.78, .01: 40.29, .005: 42.8 ***REMOVED***, 23: { .995: 9.26, .99: 10.2, .975: 11.69, .95: 13.09, .9: 14.85, .5: 22.34, .1: 32.01, .05: 35.17, .025: 38.08, .01: 41.64, .005: 44.18 ***REMOVED***, 24: { .995: 9.89, .99: 10.86, .975: 12.4, .95: 13.85, .9: 15.66, .5: 23.34, .1: 33.2, .05: 36.42, .025: 39.36, .01: 42.98, .005: 45.56 ***REMOVED***, 25: { .995: 10.52, .99: 11.52, .975: 13.12, .95: 14.61, .9: 16.47, .5: 24.34, .1: 34.28, .05: 37.65, .025: 40.65, .01: 44.31, .005: 46.93 ***REMOVED***, 26: { .995: 11.16, .99: 12.2, .975: 13.84, .95: 15.38, .9: 17.29, .5: 25.34, .1: 35.56, .05: 38.89, .025: 41.92, .01: 45.64, .005: 48.29 ***REMOVED***, 27: { .995: 11.81, .99: 12.88, .975: 14.57, .95: 16.15, .9: 18.11, .5: 26.34, .1: 36.74, .05: 40.11, .025: 43.19, .01: 46.96, .005: 49.65 ***REMOVED***, 28: { .995: 12.46, .99: 13.57, .975: 15.31, .95: 16.93, .9: 18.94, .5: 27.34, .1: 37.92, .05: 41.34, .025: 44.46, .01: 48.28, .005: 50.99 ***REMOVED***, 29: { .995: 13.12, .99: 14.26, .975: 16.05, .95: 17.71, .9: 19.77, .5: 28.34, .1: 39.09, .05: 42.56, .025: 45.72, .01: 49.59, .005: 52.34 ***REMOVED***, 30: { .995: 13.79, .99: 14.95, .975: 16.79, .95: 18.49, .9: 20.6, .5: 29.34, .1: 40.26, .05: 43.77, .025: 46.98, .01: 50.89, .005: 53.67 ***REMOVED***, 40: { .995: 20.71, .99: 22.16, .975: 24.43, .95: 26.51, .9: 29.05, .5: 39.34, .1: 51.81, .05: 55.76, .025: 59.34, .01: 63.69, .005: 66.77 ***REMOVED***, 50: { .995: 27.99, .99: 29.71, .975: 32.36, .95: 34.76, .9: 37.69, .5: 49.33, .1: 63.17, .05: 67.5, .025: 71.42, .01: 76.15, .005: 79.49 ***REMOVED***, 60: { .995: 35.53, .99: 37.48, .975: 40.48, .95: 43.19, .9: 46.46, .5: 59.33, .1: 74.4, .05: 79.08, .025: 83.3, .01: 88.38, .005: 91.95 ***REMOVED***, 70: { .995: 43.28, .99: 45.44, .975: 48.76, .95: 51.74, .9: 55.33, .5: 69.33, .1: 85.53, .05: 90.53, .025: 95.02, .01: 100.42, .005: 104.22 ***REMOVED***, 80: { .995: 51.17, .99: 53.54, .975: 57.15, .95: 60.39, .9: 64.28, .5: 79.33, .1: 96.58, .05: 101.88, .025: 106.63, .01: 112.33, .005: 116.32 ***REMOVED***, 90: { .995: 59.2, .99: 61.75, .975: 65.65, .95: 69.13, .9: 73.29, .5: 89.33, .1: 107.57, .05: 113.14, .025: 118.14, .01: 124.12, .005: 128.3 ***REMOVED***, 100: { .995: 67.33, .99: 70.06, .975: 74.22, .95: 77.93, .9: 82.36, .5: 99.33, .1: 118.5, .05: 124.34, .025: 129.56, .01: 135.81, .005: 140.17 ***REMOVED*** ***REMOVED***; n.exports = e ***REMOVED***, {***REMOVED***], 6: [function (t, n, r) { "use strict"; function e(t, n, r) { for (var e, u, s = i(t), a = 0, f = 1, l = n(s), c = [], h = [], p = 0; p < t.length; p++) void 0 === c[t[p]] && (c[t[p]] = 0), c[t[p]]++; for (p = 0; p < c.length; p++) void 0 === c[p] && (c[p] = 0); for (u in l) u in c && (h[u] = l[u] * t.length); for (u = h.length - 1; u >= 0; u--) h[u] < 3 && (h[u - 1] += h[u], h.pop(), c[u - 1] += c[u], c.pop()); for (u = 0; u < c.length; u++) a += Math.pow(c[u] - h[u], 2) / h[u]; return e = c.length - f - 1, o[e][r] < a ***REMOVED*** var i = t(21), o = t(5); n.exports = e ***REMOVED***, { 21: 21, 5: 5 ***REMOVED***], 7: [function (t, n, r) { "use strict"; function e(t, n) { var r = []; if (0 >= n) return null; for (var e = 0; e < t.length; e += n) r.push(t.slice(e, e + n)); return r ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 8: [function (t, n, r) { "use strict"; function e(t, n) { for (var r = [], e = 0; t > e; e++) { for (var i = [], o = 0; n > o; o++) i.push(0); r.push(i) ***REMOVED*** return r ***REMOVED*** function i(t, n) { if (n > t.length) throw new Error("Cannot generate more classes than there are data values"); var r = u(t), i = o(r); if (1 === i) return [r]; for (var s = e(n, r.length), a = e(n, r.length), f = 0; n > f; f++) for (var l = r[0], c = Math.max(f, 1); c < r.length; c++) if (0 === f) { var h = Math.pow(r[c] - l, 2); s[f][c] = s[f][c - 1] + c / (c + 1) * h; var p = c * l + r[c]; l = p / (c + 1) ***REMOVED*** else for (var v = 0, g = 0, d = c; d >= f; d--) v += (c - d) / (c - d + 1) * Math.pow(r[d] - g, 2), g = (r[d] + (c - d) * g) / (c - d + 1), d === c ? (s[f][c] = v, a[f][c] = d, d > 0 && (s[f][c] += s[f - 1][d - 1])) : 0 === d ? v <= s[f][c] && (s[f][c] = v, a[f][c] = d) : v + s[f - 1][d - 1] < s[f][c] && (s[f][c] = v + s[f - 1][d - 1], a[f][c] = d); var x = [], M = a[0].length - 1; for (f = a.length - 1; f >= 0; f--) { var w = a[f][M]; x[f] = r.slice(w, M + 1), f > 0 && (M = w - 1) ***REMOVED*** return x ***REMOVED*** var o = t(42), u = t(26); n.exports = i ***REMOVED***, { 26: 26, 42: 42 ***REMOVED***], 9: [function (t, n, r) { "use strict"; function e(t) { var n = Math.abs(t), r = Math.min(Math.round(100 * n), i.length - 1); return t >= 0 ? i[r] : +(1 - i[r]).toFixed(4) ***REMOVED*** var i = t(44); n.exports = e ***REMOVED***, { 44: 44 ***REMOVED***], 10: [function (t, n, r) { "use strict"; var e = 1e-4; n.exports = e ***REMOVED***, {***REMOVED***], 11: [function (t, n, r) { "use strict"; function e(t) { var n = 1 / (1 + .5 * Math.abs(t)), r = n * Math.exp(-Math.pow(t, 2) - 1.26551223 + 1.00002368 * n + .37409196 * Math.pow(n, 2) + .09678418 * Math.pow(n, 3) - .18628806 * Math.pow(n, 4) + .27886807 * Math.pow(n, 5) - 1.13520398 * Math.pow(n, 6) + 1.48851587 * Math.pow(n, 7) - .82215223 * Math.pow(n, 8) + .17087277 * Math.pow(n, 9)); return t >= 0 ? 1 - r : r - 1 ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 12: [function (t, n, r) { "use strict"; function e(t) { if (0 > t) return null; for (var n = 1, r = 2; t >= r; r++) n *= r; return n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 13: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; for (var n = 1, r = 0; r < t.length; r++) { if (t[r] <= 0) return null; n *= t[r] ***REMOVED*** return Math.pow(n, 1 / t.length) ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 14: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; for (var n = 0, r = 0; r < t.length; r++) { if (t[r] <= 0) return null; n += 1 / t[r] ***REMOVED*** return t.length / n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 15: [function (t, n, r) { "use strict"; function e(t) { return 0 === t.length ? null : i(t, .75) - i(t, .25) ***REMOVED*** var i = t(30); n.exports = e ***REMOVED***, { 30: 30 ***REMOVED***], 16: [function (t, n, r) { "use strict"; function e(t) { var n = 8 * (Math.PI - 3) / (3 * Math.PI * (4 - Math.PI)), r = Math.sqrt(Math.sqrt(Math.pow(2 / (Math.PI * n) + Math.log(1 - t * t) / 2, 2) - Math.log(1 - t * t) / n) - (2 / (Math.PI * n) + Math.log(1 - t * t) / 2)); return t >= 0 ? r : -r ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 17: [function (t, n, r) { "use strict"; function e(t) { var n, r, e = t.length; if (1 === e) n = 0, r = t[0][1]; else { for (var i, o, u, s = 0, a = 0, f = 0, l = 0, c = 0; e > c; c++) i = t[c], o = i[0], u = i[1], s += o, a += u, f += o * o, l += o * u; n = (e * l - s * a) / (e * f - s * s), r = a / e - n * s / e ***REMOVED*** return { m: n, b: r ***REMOVED*** ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 18: [function (t, n, r) { "use strict"; function e(t) { return function (n) { return t.b + t.m * n ***REMOVED*** ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 19: [function (t, n, r) { "use strict"; function e(t) { if (!t || 0 === t.length) return null; for (var n = i(t), r = [], e = 0; e < t.length; e++) r.push(Math.abs(t[e] - n)); return i(r) ***REMOVED*** var i = t(22); n.exports = e ***REMOVED***, { 22: 22 ***REMOVED***], 20: [function (t, n, r) { "use strict"; function e(t) { for (var n, r = 0; r < t.length; r++) (t[r] > n || void 0 === n) && (n = t[r]); return n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 21: [function (t, n, r) { "use strict"; function e(t) { return 0 === t.length ? null : i(t) / t.length ***REMOVED*** var i = t(45); n.exports = e ***REMOVED***, { 45: 45 ***REMOVED***], 22: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; var n = i(t); if (n.length % 2 === 1) return n[(n.length - 1) / 2]; var r = n[n.length / 2 - 1], e = n[n.length / 2]; return (r + e) / 2 ***REMOVED*** var i = t(26); n.exports = e ***REMOVED***, { 26: 26 ***REMOVED***], 23: [function (t, n, r) { "use strict"; function e(t) { for (var n, r = 0; r < t.length; r++) (t[r] < n || void 0 === n) && (n = t[r]); return n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 24: [function (t, n, r) { "use strict"; function e(t, n) { function r(n) { return function () { var r = Array.prototype.slice.apply(arguments); return r.unshift(this), t[n].apply(t, r) ***REMOVED*** ***REMOVED*** var e = !(!Object.defineProperty || !Object.defineProperties); if (!e) throw new Error("without defineProperty, simple-statistics cannot be mixed in"); var i, o = ["median", "standardDeviation", "sum", "sampleSkewness", "mean", "min", "max", "quantile", "geometricMean", "harmonicMean", "root_mean_square"]; i = n ? n.slice() : Array.prototype; for (var u = 0; u < o.length; u++) Object.defineProperty(i, o[u], { value: r(o[u]), configurable: !0, enumerable: !1, writable: !0 ***REMOVED***); return i ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 25: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; if (1 === t.length) return t[0]; for (var n, r = i(t), e = r[0], o = 0, u = 1, s = 1; s < r.length + 1; s++) r[s] !== e ? (u > o && (o = u, n = e), u = 1, e = r[s]) : u++; return n ***REMOVED*** var i = t(26); n.exports = e ***REMOVED***, { 26: 26 ***REMOVED***], 26: [function (t, n, r) { "use strict"; function e(t) { return t.slice().sort(function (t, n) { return t - n ***REMOVED***) ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 27: [function (t, n, r) { "use strict"; function e() { this.weights = [], this.bias = 0 ***REMOVED*** e.prototype.predict = function (t) { if (t.length !== this.weights.length) return null; for (var n = 0, r = 0; r < this.weights.length; r++) n += this.weights[r] * t[r]; return n += this.bias, n > 0 ? 1 : 0 ***REMOVED***, e.prototype.train = function (t, n) { if (0 !== n && 1 !== n) return null; t.length !== this.weights.length && (this.weights = t, this.bias = 1); var r = this.predict(t); if (r !== n) { for (var e = n - r, i = 0; i < this.weights.length; i++) this.weights[i] += e * t[i]; this.bias += e ***REMOVED*** return this ***REMOVED***, n.exports = e ***REMOVED***, {***REMOVED***], 28: [function (t, n, r) { "use strict"; function e(t) { if (0 >= t) return null; var n = 0, r = 0, e = {***REMOVED***; do e[n] = Math.pow(Math.E, -t) * Math.pow(t, n) / o(n), r += e[n], n++; while (1 - i > r); return e ***REMOVED*** var i = t(10), o = t(12); n.exports = e ***REMOVED***, { 10: 10, 12: 12 ***REMOVED***], 29: [function (t, n, r) { "use strict"; function e(t) { return 0 === t ? t = i : t >= 1 && (t = 1 - i), Math.sqrt(2) * o(2 * t - 1) ***REMOVED*** var i = t(10), o = t(16); n.exports = e ***REMOVED***, { 10: 10, 16: 16 ***REMOVED***], 30: [function (t, n, r) { "use strict"; function e(t, n) { if (0 === t.length) return null; var r = o(t); if (n.length) { for (var e = [], u = 0; u < n.length; u++) e[u] = i(r, n[u]); return e ***REMOVED*** return i(r, n) ***REMOVED*** var i = t(31), o = t(26); n.exports = e ***REMOVED***, { 26: 26, 31: 31 ***REMOVED***], 31: [function (t, n, r) { "use strict"; function e(t, n) { var r = t.length * n; return 0 > n || n > 1 ? null : 1 === n ? t[t.length - 1] : 0 === n ? t[0] : r % 1 !== 0 ? t[Math.ceil(r) - 1] : t.length % 2 === 0 ? (t[r - 1] + t[r]) / 2 : t[r] ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 32: [function (t, n, r) { "use strict"; function e(t, n) { if (t.length < 2) return 1; for (var r, e = 0, i = 0; i < t.length; i++) e += t[i][1]; r = e / t.length; for (var o = 0, u = 0; u < t.length; u++) o += Math.pow(r - t[u][1], 2); for (var s = 0, a = 0; a < t.length; a++) s += Math.pow(t[a][1] - n(t[a][0]), 2); return 1 - s / o ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 33: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; for (var n = 0, r = 0; r < t.length; r++) n += Math.pow(t[r], 2); return Math.sqrt(n / t.length) ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 34: [function (t, n, r) { "use strict"; function e(t, n, r) { var e = i(t, r); return e.slice(0, n) ***REMOVED*** var i = t(40); n.exports = e ***REMOVED***, { 40: 40 ***REMOVED***], 35: [function (t, n, r) { "use strict"; function e(t, n) { var r = i(t, n), e = o(t), u = o(n); return null === r || null === e || null === u ? null : r / e / u ***REMOVED*** var i = t(36), o = t(38); n.exports = e ***REMOVED***, { 36: 36, 38: 38 ***REMOVED***], 36: [function (t, n, r) { "use strict"; function e(t, n) { if (t.length <= 1 || t.length !== n.length) return null; for (var r = i(t), e = i(n), o = 0, u = 0; u < t.length; u++) o += (t[u] - r) * (n[u] - e); var s = t.length - 1; return o / s ***REMOVED*** var i = t(21); n.exports = e ***REMOVED***, { 21: 21 ***REMOVED***], 37: [function (t, n, r) { "use strict"; function e(t) { if (t.length < 3) return null; var n = t.length, r = Math.pow(o(t), 3), e = i(t, 3); return n * e / ((n - 1) * (n - 2) * r) ***REMOVED*** var i = t(46), o = t(38); n.exports = e ***REMOVED***, { 38: 38, 46: 46 ***REMOVED***], 38: [function (t, n, r) { "use strict"; function e(t) { return t.length <= 1 ? null : Math.sqrt(i(t)) ***REMOVED*** var i = t(39); n.exports = e ***REMOVED***, { 39: 39 ***REMOVED***], 39: [function (t, n, r) { "use strict"; function e(t) { if (t.length <= 1) return null; var n = i(t, 2), r = t.length - 1; return n / r ***REMOVED*** var i = t(46); n.exports = e ***REMOVED***, { 46: 46 ***REMOVED***], 40: [function (t, n, r) { "use strict"; function e(t, n) { return t = t.slice(), i(t.slice(), n) ***REMOVED*** var i = t(41); n.exports = e ***REMOVED***, { 41: 41 ***REMOVED***], 41: [function (t, n, r) { "use strict"; function e(t, n) { n = n || Math.random; for (var r, e, i = t.length; i > 0;) e = Math.floor(n() * i--), r = t[i], t[i] = t[e], t[e] = r; return t ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 42: [function (t, n, r) { "use strict"; function e(t) { for (var n, r = 0, e = 0; e < t.length; e++) (0 === e || t[e] !== n) && (n = t[e], r++); return r ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 43: [function (t, n, r) { "use strict"; function e(t) { return 0 === t.length ? null : Math.sqrt(i(t)) ***REMOVED*** var i = t(49); n.exports = e ***REMOVED***, { 49: 49 ***REMOVED***], 44: [function (t, n, r) { "use strict"; function e(t) { for (var n = t, r = t, e = 1; 15 > e; e++) r *= t * t / (2 * e + 1), n += r; return Math.round(1e4 * (.5 + n / i * Math.exp(-t * t / 2))) / 1e4 ***REMOVED*** for (var i = Math.sqrt(2 * Math.PI), o = [], u = 0; 3.09 >= u; u += .01) o.push(e(u)); n.exports = o ***REMOVED***, {***REMOVED***], 45: [function (t, n, r) { "use strict"; function e(t) { for (var n = 0, r = 0; r < t.length; r++) n += t[r]; return n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 46: [function (t, n, r) { "use strict"; function e(t, n) { for (var r = i(t), e = 0, o = 0; o < t.length; o++) e += Math.pow(t[o] - r, n); return e ***REMOVED*** var i = t(21); n.exports = e ***REMOVED***, { 21: 21 ***REMOVED***], 47: [function (t, n, r) { "use strict"; function e(t, n) { var r = o(t), e = i(t), u = Math.sqrt(t.length); return (r - n) / (e / u) ***REMOVED*** var i = t(43), o = t(21); n.exports = e ***REMOVED***, { 21: 21, 43: 43 ***REMOVED***], 48: [function (t, n, r) { "use strict"; function e(t, n, r) { var e = t.length, u = n.length; if (!e || !u) return null; r || (r = 0); var s = i(t), a = i(n), f = ((e - 1) * o(t) + (u - 1) * o(n)) / (e + u - 2); return (s - a - r) / Math.sqrt(f * (1 / e + 1 / u)) ***REMOVED*** var i = t(21), o = t(39); n.exports = e ***REMOVED***, { 21: 21, 39: 39 ***REMOVED***], 49: [function (t, n, r) { "use strict"; function e(t) { return 0 === t.length ? null : i(t, 2) / t.length ***REMOVED*** var i = t(46); n.exports = e ***REMOVED***, { 46: 46 ***REMOVED***], 50: [function (t, n, r) { "use strict"; function e(t, n, r) { return (t - n) / r ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***] ***REMOVED***, {***REMOVED***, [1])(1) ***REMOVED***);


	var load = function (url, callback) {

		localforage.getItem("cache_version", function (error, c) {

			//function loadUrl() {

			if (load.cache[url]) {
				var data = load.cache[url];
				callback(load.datafold(data), url, data);
			***REMOVED***
			else {

				if (url in load.queue) {
					load.queue[url].push(callback);
				***REMOVED***
				else {
					load.queue[url] = [callback];

					if (load.storeLocal(url)) {

						localforage.getItem(url, function (error, data) {

							if (data) {
								data = JSON.parse(LZString.decompressFromUTF16(data));
								load.callbacks(url, data);
							***REMOVED***
							else {
								d3.json(url, function (error, json) {
									load.rawData(error, json, url);
								***REMOVED***);
							***REMOVED***

						***REMOVED***);

					***REMOVED***
					else {
						d3.json(url, function (error, data) {
							load.rawData(error, data, url);
						***REMOVED***);
					***REMOVED***

				***REMOVED***

			***REMOVED***

			//***REMOVED***

		***REMOVED***);

	***REMOVED***


	search.reload = function () {
		this.container.select(".search-results").html("<div id='search-loading'><p><i class='fa fa-spinner fa-spin'></i> Buscando...</p></div>");

	***REMOVED***

	search.reload2 = function () {

		this.container.select(".search-results").html("<div id='search-loading'><p><i class='fa fa-spinner fa-spin'></i> Buscando...</p></div>");

		this.type = this.type || "";
		// var sumlevel = (this.type && this.current_depth[this.type]) ? this.nesting[this.type][this.current_depth[this.type]] : ""
		// var q_params = [['q', this.term], ['kind', this.type], ['sumlevel', sumlevel]]
		var q_params = [['q', this.term], ['kind', this.type], ['stem_only', this.stem_only]]
			.filter(function (q) { return q[1] || q[1] === 0; ***REMOVED***)
			.reduce(function (a, b, i) {
				var sep = i ? "&" : "";
				return a + sep + b[0] + "=" + encodeURIComponent(b[1]);
			***REMOVED***, "?")

		// set URL query parameter to search query
		if (this.advanced) {
			window.history.replaceState({***REMOVED***, "", "/search/" + q_params);
		***REMOVED***
		else {
			d3.selectAll(".results-show-all a").attr("href", "/search/" + q_params).classed("pri-link", true);
		***REMOVED***

		// if contrained, show "clear refinements"
		if (this.type) {
			d3.select(".clear").style("display", "inline-block")
		***REMOVED***

		var query_sumlevel = !this.term && this.depth ? "&sumlevel=" + this.depth : "";
		var query_is_stem = this.stem_only ? "&is_stem=2" : "";
		load("https://robin-api.datausa.io" + "/attrs/search?limit=100&q=" + this.term + "&kind=" + this.type + query_is_stem + query_sumlevel, function (data, url, raw) {

			// console.log(data, url, raw);

			this.zip = raw.zip_search;

			d3.select(".search-suggestions").style("display", "inline-block").text('');

			if (this.advanced) {
				this.max = null;
				if (raw.suggestions) {
					var search_suggestions = raw.suggestions.slice();
					if (raw.autocorrected) {
						d3.select(".search-autocorrected").style("display", "block")
						d3.select(".search-autocorrected span.result").text(search_suggestions.shift())
					***REMOVED***
					else {
						d3.select(".search-autocorrected").style("display", "none")
					***REMOVED***
					if (search_suggestions.length) {
						var suggestions_span = d3.select(".search-suggestions")
							.style("display", "inline-block")
							.text("Did you mean: ")
						var search_suggestions_a = search_suggestions.map(function (s, i) {
							return "<a class='suggestion-link' href='/search/?q=" + s + "'>" + s + "</a>"
						***REMOVED***)
						suggestions_span.append("span").html(search_suggestions_a.join(", "))
						suggestions_span.append("span").text("?")
					***REMOVED***
				***REMOVED***
				this.update_refine(data);
			***REMOVED***

			// set cutoff
			if (this.max) {
				if (data.length > this.max) {
					var left_over = data.length - this.max;
					d3.selectAll(".results-show-all a span.more").text("(" + left_over + " more)")
				***REMOVED***
				else {
					d3.selectAll(".results-show-all a span.more").text("")
				***REMOVED***
				data = data.slice(0, this.max);
			***REMOVED***


			search.vars = raw.related_vars || [];
			if (search.data) {

				search.vars.forEach(function (v) {
					v.related_attrs.forEach(function (a) {

						var results = data.filter(function (d) { return d.kind === a; ***REMOVED***);
						var ids = results.map(function (d) { return d.id; ***REMOVED***);
						var extra_url = api + "/api/?show=" + a + "&" + a + "=" + ids.join(",") + "&required=" + v.related_vars.join(",");
						if (v.params) {
							for (var p in v.params) {
								extra_url += "&" + p + "=" + v.params[p];
							***REMOVED***
						***REMOVED***
						if (extra_url.indexOf("sumlevel") < 0) {
							extra_url += "&sumlevel=all";
						***REMOVED***
						load(extra_url, function (var_data, var_url, var_raw) {

							if (var_data instanceof Array) {
								v.loaded = var_data.reduce(function (obj, vd) {
									// obj[sub_ids ? ids[sub_ids.indexOf(vd[a])] : vd[a]] = vd;
									obj[vd[a]] = vd;
									return obj;
								***REMOVED***, {***REMOVED***);
							***REMOVED***
							else v.loaded = { error: true ***REMOVED***;
							search.render();
						***REMOVED***);

					***REMOVED***);
				***REMOVED***);

			***REMOVED***

			var items = this.container.select(".search-results").html("")
				.selectAll(".search-item")
				.data(this.filter(data), function (d) { return d.id; ***REMOVED***);

			items.enter().append(this.advanced ? "div" : "a")
				.attr("class", function (d) {
					return "search-item " + d.kind;
				***REMOVED***);

			d3.selectAll(".no-search-results")
				.style("display", items.empty() ? "block" : "none");

			items.exit().remove();

			search.render();

		***REMOVED***.bind(this));

	***REMOVED***




	$("#home-search-input").on("keyup", function (event) {
		if (event.keyCode == 9 || event.keyCode == 13) {
			event.preventDefault();
		***REMOVED*** else {
			if (event.keyCode == 8) {
				if ($(this).val().length <= 1) {
					$(this).next().val("");
					//$("#divResultados").html("");
					$("#divResultados").children().remove();
					$("#divResultados").addClass("objHidden");
				***REMOVED***
			***REMOVED***
		***REMOVED***
	***REMOVED***).autocomplete({
		source: function (request, response) {
			$.ajax({
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				url: "../Home/PostData",
				cache: false,
				data: "{ 'texto': '" + request.term + "'***REMOVED***",
				success: function (data) {
					//$("#divResultados").html("");
					if ($("#divResultados").children().length > 0) {
						$("#divResultados").children().remove();
						//$("#divResultados").addClass("objHidden");
					***REMOVED***

					if (data == null || data.length <= 0) {
						$("#divResultados").children().remove();
						$("#divResultados").addClass("objHidden");
						$("#divNoEncontrados").show();
					***REMOVED*** else {
						$("#divResultados").removeClass("objHidden");
						response($.map(data, function (item) {
							var iconocategoria = '';
							var completo = item.Nombre + "";
							var dividir = completo.split("-*-");
							var nomproy = dividir[0];
							var finan = dividir[1];
							var contratista = dividir[1];
							var codigounico = dividir[2];

							var financ_aux = "";

							if (finan == undefined || finan == null) {
								finan = '';
							***REMOVED***
							else {
								var dividir2 = finan.split("|");
								finan = dividir2[0];
								finan = finan.substring(0, finan.length - 2);
							***REMOVED***
							if (finan != "") {
								financ_aux = "Financiado por: " + finan;
							***REMOVED***

							switch (item.Categoria) {
								case 'DEPARTAMENTO':
									iconocategoria = '../content/img/icons/icon-departamentos-color.svg';
									$("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_ficha\" role=\"button\" location_id= '" + item.Id + "' tipo= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + item.Nombre + "</a><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_ficha \" role=\"button\" location_id= '" + item.Id + "' tipo= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a><a  class=\"pull-right orangeLink page-scroll general-search\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> Ver Mapa <span class=\"glyphicon glyphicon-chevron-right\"></span></a></div></div>");
									break;
								case 'MUNICIPIO':
									iconocategoria = '../content/img/icons/icon-municipios-color.svg';
									$("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_ficha\" role=\"button\" location_id= '" + item.Id + "' tipo= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + item.Nombre + "</a><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_ficha\" role=\"button\" location_id= '" + item.Id + "' tipo= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a><a  class=\"pull-right orangeLink page-scroll general-search\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> Ver Mapa <span class=\"glyphicon glyphicon-chevron-right\"></span></a></div></div>");
									break;
								case 'SECTOR':
									iconocategoria = '../content/img/icons/icon-sectores-color.svg';
									$("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_sector\" role=\"button\" data-parameter= '" + item.Nombre + "' sector_id= '" + item.Id + "' tipo= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + item.Nombre + "</a><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_sector\" role=\"button\"  data-parameter= '" + item.Nombre + "' sector_id= '" + item.Id + "' tipo= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
									break;
								case 'CONTRATISTA':
									iconocategoria = '../content/img/icons/icon-contratista.svg';
									$("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_contratista\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + contratista + "</a><div class=\"xmalFFF\"></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_contratista\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
									break;
								default:
									iconocategoria = '../content/img/icons/icon-proyectos-color.svg';
									$("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_proyecto\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + nomproy + "</a><div class=\"xmalFFF\"> <a class=\"xmalFFF enlace_proyecto\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">" + financ_aux + "</a></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_proyecto\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");

							***REMOVED***


						***REMOVED***));

					***REMOVED***
				***REMOVED***,
				error: function (response) {
					//alert(response.responseText);
				***REMOVED***,
				failure: function (response) {
					//alert(response.responseText);
				***REMOVED***
			***REMOVED***);
		***REMOVED***,
		delay: 50,
		minLength: 3,
		select: function (event, ui) {
		***REMOVED***
	***REMOVED***).bind('blur onblur', function () {
		$(this).next().val("");
		$("#divResultados").children().remove();
		$("#divResultados").addClass("objHidden");
		//***REMOVED***
	***REMOVED***);


	function ocultarDiv(nombre, id) {
		$("#home-search-input").val(nombre).next().val(id);
		$("#divResultados").children().remove();
		$("#divResultados").addClass("objHidden");
	***REMOVED***



***REMOVED***);

; (function () {
	function toCurrency(nStr) {
		nStr = typeof nStr == 'number' ? nStr : this
		nStr += ''
		var x = nStr.split('.'),
			x1 = x[0],
			x2 = x.length > 1 ? '.' + x[1] : '',
			rgx = /(\d+)(\d{3***REMOVED***)/,
			index = 1,
			separator;
		while (rgx.test(x1)) {
			separator = index % 2 === 0 ? ',' : ','
			x1 = x1.replace(rgx, '$1' + separator + '$2')
			index++
		***REMOVED***
		return 'L ' + x1 + x2;
	***REMOVED***
	// Assigning this to Number prototype for letting use it inside templates
	Number.prototype.toCurrency = toCurrency
***REMOVED***)();

/*global define*/
define('app/utils/Modal', [], function () {
	var errorTemplate = doT.compile('<div class="error"><h1>Error</h1><p>{{=it.message***REMOVED******REMOVED***</p>' +
		'<div class="txt-right"><a class="button close">Cerrar</a></div></div>'),
		infoTemplate = doT.compile('<div class="info"><h1>Información</h1><p>{{=it.message***REMOVED******REMOVED***</p>' +
			'<div class="txt-right"><a class="button close">Cerrar</a></div></div>')

	function Modal(content) {
		this.modal = $('<div>', { 'class': 'modal' ***REMOVED***)[0]
		this.back = $('<div>', { 'class': 'back' ***REMOVED***)[0]
		this.container = $('<div>', { 'class': 'container' ***REMOVED***)[0]
		this.wrapper = $('<div>', { 'class': 'wrapper' ***REMOVED***)[0]
		this.content = $('<div>', { 'class': 'content' ***REMOVED***)[0]

		if (typeof content == 'string')
			this.content.innerHTML = content
		//Zepto object or Element
		else if (typeof content == 'object') {
			$(this.content).append(content)
		***REMOVED***

		this.wrapper.appendChild(this.content)
		this.back.appendChild(this.wrapper)
		this.modal.appendChild(this.back)

		//Events
		$(this.wrapper).on('click', function (e) {
			if (e.stopPropagation) e.stopPropagation()
			else e.cancelBubble = true
		***REMOVED***)
		$(this.back).on('click', this.hide.bind(this))
		$(this.wrapper).on('click', '.close', this.hide.bind(this))
	***REMOVED***
	Modal.prototype.addClass = function (className) {
		$(this.modal).addClass(className)
		return this
	***REMOVED***
	Modal.prototype.show = function () {
		$('html').css('overflow', 'hidden')
		document.body.appendChild(this.modal)
		this.modal.style.display = 'block'
	***REMOVED***
	Modal.prototype.hide = function () {
		$('html').css('overflow', 'visible')
		this.modal.style.display = 'none'
		try {
			document.body.removeChild(this.modal)
		***REMOVED*** catch (e) { ***REMOVED***
	***REMOVED***
	Modal.prototype.getElement = function () {
		return this.modal
	***REMOVED***
	Modal.info = function (message) {
		return new Modal(infoTemplate({ message: message ***REMOVED***))
	***REMOVED***
	Modal.error = function (message) {
		return new Modal(errorTemplate({ message: message ***REMOVED***))
	***REMOVED***

	return Modal
***REMOVED***);
define('lib/jquery/mockjax', [], function () {

	/*!
	 * MockJax - jQuery Plugin to Mock Ajax requests
	 *
	 * Version:  1.5.1
	 * Released:
	 * Home:   http://github.com/appendto/jquery-mockjax
	 * Author:   Jonathan Sharp (http://jdsharp.com)
	 * License:  MIT,GPL
	 *
	 * Copyright (c) 2011 appendTo LLC.
	 * Dual licensed under the MIT or GPL licenses.
	 * http://appendto.com/open-source-licenses
	 */
	(function ($) {
		var _ajax = $.ajax,
			mockHandlers = [],
			CALLBACK_REGEX = /=\?(&|$)/,
			jsc = (new Date()).getTime();


		// Parse the given XML string. 
		function parseXML(xml) {
			if (window['DOMParser'] == undefined && window.ActiveXObject) {
				DOMParser = function () { ***REMOVED***;
				DOMParser.prototype.parseFromString = function (xmlString) {
					var doc = new ActiveXObject('Microsoft.XMLDOM');
					doc.async = 'false';
					doc.loadXML(xmlString);
					return doc;
				***REMOVED***;
			***REMOVED***

			try {
				var xmlDoc = (new DOMParser()).parseFromString(xml, 'text/xml');
				if ($.isXMLDoc(xmlDoc)) {
					var err = $('parsererror', xmlDoc);
					if (err.length == 1) {
						throw ('Error: ' + $(xmlDoc).text());
					***REMOVED***
				***REMOVED*** else {
					throw ('Unable to parse XML');
				***REMOVED***
			***REMOVED*** catch (e) {
				var msg = (e.name == undefined ? e : e.name + ': ' + e.message);
				$(document).trigger('xmlParseError', [msg]);
				return undefined;
			***REMOVED***
			return xmlDoc;
		***REMOVED***

		// Trigger a jQuery event
		function trigger(s, type, args) {
			(s.context ? $(s.context) : $.event).trigger(type, args);
		***REMOVED***

		// Check if the data field on the mock handler and the request match. This 
		// can be used to restrict a mock handler to being used only when a certain
		// set of data is passed to it.
		function isMockDataEqual(mock, live) {
			var identical = false;
			// Test for situations where the data is a querystring (not an object)
			if (typeof live === 'string') {
				// Querystring may be a regex
				return $.isFunction(mock.test) ? mock.test(live) : mock == live;
			***REMOVED***
			$.each(mock, function (k, v) {
				if (live[k] === undefined) {
					identical = false;
					return identical;
				***REMOVED*** else {
					identical = true;
					if (typeof live[k] == 'object') {
						return isMockDataEqual(mock[k], live[k]);
					***REMOVED*** else {
						if ($.isFunction(mock[k].test)) {
							identical = mock[k].test(live[k]);
						***REMOVED*** else {
							identical = (mock[k] == live[k]);
						***REMOVED***
						return identical;
					***REMOVED***
				***REMOVED***
			***REMOVED***);

			return identical;
		***REMOVED***

		// Check the given handler should mock the given request
		function getMockForRequest(handler, requestSettings) {
			// If the mock was registered with a function, let the function decide if we
			// want to mock this request
			if ($.isFunction(handler)) {
				return handler(requestSettings);
			***REMOVED***

			// Inspect the URL of the request and check if the mock handler's url
			// matches the url for this ajax request
			if ($.isFunction(handler.url.test)) {
				// The user provided a regex for the url, test it
				if (!handler.url.test(requestSettings.url)) {
					return null;
				***REMOVED***
			***REMOVED*** else {
				// Look for a simple wildcard '*' or a direct URL match
				var star = handler.url.indexOf('*');
				if (handler.url !== requestSettings.url && star === -1 ||
					!new RegExp(handler.url.replace(/[-[\]{***REMOVED***()+?.,\\^$|#\s]/g, "\\$&").replace('*', '.+')).test(requestSettings.url)) {
					return null;
				***REMOVED***
			***REMOVED***

			// Inspect the data submitted in the request (either POST body or GET query string)
			if (handler.data && requestSettings.data) {
				if (!isMockDataEqual(handler.data, requestSettings.data)) {
					// They're not identical, do not mock this request
					return null;
				***REMOVED***
			***REMOVED***
			// Inspect the request type
			if (handler && handler.type &&
				handler.type.toLowerCase() != requestSettings.type.toLowerCase()) {
				// The request type doesn't match (GET vs. POST)
				return null;
			***REMOVED***

			return handler;
		***REMOVED***

		// If logging is enabled, log the mock to the console
		function logMock(mockHandler, requestSettings) {
			if (window.console && console.log) {
				var message = 'MOCK ' + requestSettings.type.toUpperCase() + ': ' + requestSettings.url;
				var request = $.extend({***REMOVED***, requestSettings);

				if (typeof console.log === 'function') {
					console.log(message, request);
				***REMOVED*** else {
					try {
						console.log(message + ' ' + JSON.stringify(request));
					***REMOVED*** catch (e) {
						console.log(message);
					***REMOVED***
				***REMOVED***
			***REMOVED***
		***REMOVED***

		// Process the xhr objects send operation
		function _xhrSend(mockHandler, requestSettings, origSettings) {

			// This is a substitute for < 1.4 which lacks $.proxy
			var process = (function (that) {
				return function () {
					return (function () {
						// The request has returned
						this.status = mockHandler.status;
						this.statusText = mockHandler.statusText;
						this.readyState = 4;

						// We have an executable function, call it to give
						// the mock handler a chance to update it's data
						if ($.isFunction(mockHandler.response)) {
							mockHandler.response(origSettings);
						***REMOVED***
						// Copy over our mock to our xhr object before passing control back to
						// jQuery's onreadystatechange callback
						if (requestSettings.dataType == 'json' && (typeof mockHandler.responseText == 'object')) {
							this.responseText = JSON.stringify(mockHandler.responseText);
						***REMOVED*** else if (requestSettings.dataType == 'xml') {
							if (typeof mockHandler.responseXML == 'string') {
								this.responseXML = parseXML(mockHandler.responseXML);
							***REMOVED*** else {
								this.responseXML = mockHandler.responseXML;
							***REMOVED***
						***REMOVED*** else {
							this.responseText = mockHandler.responseText;
						***REMOVED***
						if (typeof mockHandler.status == 'number' || typeof mockHandler.status == 'string') {
							this.status = mockHandler.status;
						***REMOVED***
						if (typeof mockHandler.statusText === "string") {
							this.statusText = mockHandler.statusText;
						***REMOVED***
						// jQuery < 1.4 doesn't have onreadystate change for xhr
						if ($.isFunction(this.onreadystatechange)) {
							if (mockHandler.isTimeout) {
								this.status = -1;
							***REMOVED***
							this.onreadystatechange(mockHandler.isTimeout ? 'timeout' : undefined);
						***REMOVED*** else if (mockHandler.isTimeout) {
							// Fix for 1.3.2 timeout to keep success from firing.
							this.status = -1;
						***REMOVED***
					***REMOVED***).apply(that);
				***REMOVED***;
			***REMOVED***)(this);

			if (mockHandler.proxy) {
				// We're proxying this request and loading in an external file instead
				_ajax({
					global: false,
					url: mockHandler.proxy,
					type: mockHandler.proxyType,
					data: mockHandler.data,
					dataType: requestSettings.dataType === "script" ? "text/plain" : requestSettings.dataType,
					complete: function (xhr, txt) {
						mockHandler.responseXML = xhr.responseXML;
						mockHandler.responseText = xhr.responseText;
						mockHandler.status = xhr.status;
						mockHandler.statusText = xhr.statusText;
						this.responseTimer = setTimeout(process, mockHandler.responseTime || 0);
					***REMOVED***
				***REMOVED***);
			***REMOVED*** else {
				// type == 'POST' || 'GET' || 'DELETE'
				if (requestSettings.async === false) {
					// TODO: Blocking delay
					process();
				***REMOVED*** else {
					this.responseTimer = setTimeout(process, mockHandler.responseTime || 50);
				***REMOVED***
			***REMOVED***
		***REMOVED***

		// Construct a mocked XHR Object
		function xhr(mockHandler, requestSettings, origSettings, origHandler) {
			// Extend with our default mockjax settings
			mockHandler = $.extend(true, {***REMOVED***, $.mockjaxSettings, mockHandler);

			if (typeof mockHandler.headers === 'undefined') {
				mockHandler.headers = {***REMOVED***;
			***REMOVED***
			if (mockHandler.contentType) {
				mockHandler.headers['content-type'] = mockHandler.contentType;
			***REMOVED***

			return {
				status: mockHandler.status,
				statusText: mockHandler.statusText,
				readyState: 1,
				open: function () { ***REMOVED***,
				send: function () {
					origHandler.fired = true;
					_xhrSend.call(this, mockHandler, requestSettings, origSettings);
				***REMOVED***,
				abort: function () {
					clearTimeout(this.responseTimer);
				***REMOVED***,
				setRequestHeader: function (header, value) {
					mockHandler.headers[header] = value;
				***REMOVED***,
				getResponseHeader: function (header) {
					// 'Last-modified', 'Etag', 'content-type' are all checked by jQuery
					if (mockHandler.headers && mockHandler.headers[header]) {
						// Return arbitrary headers
						return mockHandler.headers[header];
					***REMOVED*** else if (header.toLowerCase() == 'last-modified') {
						return mockHandler.lastModified || (new Date()).toString();
					***REMOVED*** else if (header.toLowerCase() == 'etag') {
						return mockHandler.etag || '';
					***REMOVED*** else if (header.toLowerCase() == 'content-type') {
						return mockHandler.contentType || 'text/plain';
					***REMOVED***
				***REMOVED***,
				getAllResponseHeaders: function () {
					var headers = '';
					$.each(mockHandler.headers, function (k, v) {
						headers += k + ': ' + v + "\n";
					***REMOVED***);
					return headers;
				***REMOVED***
			***REMOVED***;
		***REMOVED***

		// Process a JSONP mock request.
		function processJsonpMock(requestSettings, mockHandler, origSettings) {
			// Handle JSONP Parameter Callbacks, we need to replicate some of the jQuery core here
			// because there isn't an easy hook for the cross domain script tag of jsonp

			processJsonpUrl(requestSettings);

			requestSettings.dataType = "json";
			if (requestSettings.data && CALLBACK_REGEX.test(requestSettings.data) || CALLBACK_REGEX.test(requestSettings.url)) {
				createJsonpCallback(requestSettings, mockHandler);

				// We need to make sure
				// that a JSONP style response is executed properly

				var rurl = /^(\w+:)?\/\/([^\/?#]+)/,
					parts = rurl.exec(requestSettings.url),
					remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

				requestSettings.dataType = "script";
				if (requestSettings.type.toUpperCase() === "GET" && remote) {
					var newMockReturn = processJsonpRequest(requestSettings, mockHandler, origSettings);

					// Check if we are supposed to return a Deferred back to the mock call, or just 
					// signal success
					if (newMockReturn) {
						return newMockReturn;
					***REMOVED*** else {
						return true;
					***REMOVED***
				***REMOVED***
			***REMOVED***
			return null;
		***REMOVED***

		// Append the required callback parameter to the end of the request URL, for a JSONP request
		function processJsonpUrl(requestSettings) {
			if (requestSettings.type.toUpperCase() === "GET") {
				if (!CALLBACK_REGEX.test(requestSettings.url)) {
					requestSettings.url += (/\?/.test(requestSettings.url) ? "&" : "?") +
						(requestSettings.jsonp || "callback") + "=?";
				***REMOVED***
			***REMOVED*** else if (!requestSettings.data || !CALLBACK_REGEX.test(requestSettings.data)) {
				requestSettings.data = (requestSettings.data ? requestSettings.data + "&" : "") + (requestSettings.jsonp || "callback") + "=?";
			***REMOVED***
		***REMOVED***

		// Process a JSONP request by evaluating the mocked response text
		function processJsonpRequest(requestSettings, mockHandler, origSettings) {
			// Synthesize the mock request for adding a script tag
			var callbackContext = origSettings && origSettings.context || requestSettings,
				newMock = null;


			// If the response handler on the moock is a function, call it
			if (mockHandler.response && $.isFunction(mockHandler.response)) {
				mockHandler.response(origSettings);
			***REMOVED*** else {

				// Evaluate the responseText javascript in a global context
				if (typeof mockHandler.responseText === 'object') {
					$.globalEval('(' + JSON.stringify(mockHandler.responseText) + ')');
				***REMOVED*** else {
					$.globalEval('(' + mockHandler.responseText + ')');
				***REMOVED***
			***REMOVED***

			// Successful response
			jsonpSuccess(requestSettings, mockHandler);
			jsonpComplete(requestSettings, mockHandler);

			// If we are running under jQuery 1.5+, return a deferred object
			if ($.Deferred) {
				newMock = new $.Deferred();
				if (typeof mockHandler.responseText == "object") {
					newMock.resolveWith(callbackContext, [mockHandler.responseText]);
				***REMOVED***
				else {
					newMock.resolveWith(callbackContext, [$.parseJSON(mockHandler.responseText)]);
				***REMOVED***
			***REMOVED***
			return newMock;
		***REMOVED***


		// Create the required JSONP callback function for the request
		function createJsonpCallback(requestSettings, mockHandler) {
			jsonp = requestSettings.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and the data
			if (requestSettings.data) {
				requestSettings.data = (requestSettings.data + "").replace(CALLBACK_REGEX, "=" + jsonp + "$1");
			***REMOVED***

			requestSettings.url = requestSettings.url.replace(CALLBACK_REGEX, "=" + jsonp + "$1");


			// Handle JSONP-style loading
			window[jsonp] = window[jsonp] || function (tmp) {
				data = tmp;
				jsonpSuccess(requestSettings, mockHandler);
				jsonpComplete(requestSettings, mockHandler);
				// Garbage collect
				window[jsonp] = undefined;

				try {
					delete window[jsonp];
				***REMOVED*** catch (e) { ***REMOVED***

				if (head) {
					head.removeChild(script);
				***REMOVED***
			***REMOVED***;
		***REMOVED***

		// The JSONP request was successful
		function jsonpSuccess(requestSettings, mockHandler) {
			// If a local callback was specified, fire it and pass it the data
			if (requestSettings.success) {
				requestSettings.success.call(callbackContext, (mockHandler.response ? mockHandler.response.toString() : mockHandler.responseText || ''), status, {***REMOVED***);
			***REMOVED***

			// Fire the global callback
			if (requestSettings.global) {
				trigger(requestSettings, "ajaxSuccess", [{***REMOVED***, requestSettings]);
			***REMOVED***
		***REMOVED***

		// The JSONP request was completed
		function jsonpComplete(requestSettings, mockHandler) {
			// Process result
			if (requestSettings.complete) {
				requestSettings.complete.call(callbackContext, {***REMOVED***, status);
			***REMOVED***

			// The request was completed
			if (requestSettings.global) {
				trigger("ajaxComplete", [{***REMOVED***, requestSettings]);
			***REMOVED***

			// Handle the global AJAX counter
			if (requestSettings.global && ! --$.active) {
				$.event.trigger("ajaxStop");
			***REMOVED***
		***REMOVED***


		// The core $.ajax replacement.  
		function handleAjax(url, origSettings) {
			var mockRequest, requestSettings, mockHandler;

			// If url is an object, simulate pre-1.5 signature
			if (typeof url === "object") {
				origSettings = url;
				url = undefined;
			***REMOVED*** else {
				// work around to support 1.5 signature
				origSettings.url = url;
			***REMOVED***

			// Extend the original settings for the request
			requestSettings = $.extend(true, {***REMOVED***, $.ajaxSettings, origSettings);

			// Iterate over our mock handlers (in registration order) until we find
			// one that is willing to intercept the request
			for (var k = 0; k < mockHandlers.length; k++) {
				if (!mockHandlers[k]) {
					continue;
				***REMOVED***

				mockHandler = getMockForRequest(mockHandlers[k], requestSettings);
				if (!mockHandler) {
					// No valid mock found for this request
					continue;
				***REMOVED***

				// Handle console logging
				logMock(mockHandler, requestSettings);


				if (requestSettings.dataType === "jsonp") {
					if ((mockRequest = processJsonpMock(requestSettings, mockHandler, origSettings))) {
						// This mock will handle the JSONP request
						return mockRequest;
					***REMOVED***
				***REMOVED***

				mockHandler.cache = requestSettings.cache;
				mockHandler.timeout = requestSettings.timeout;
				mockHandler.global = requestSettings.global;

				copyUrlParameters(mockHandler, origSettings);

				(function (mockHandler, requestSettings, origSettings, origHandler) {
					mockRequest = _ajax.call($, $.extend(true, {***REMOVED***, origSettings, {
						// Mock the XHR object
						xhr: function () { return xhr(mockHandler, requestSettings, origSettings, origHandler) ***REMOVED***
					***REMOVED***));
				***REMOVED***)(mockHandler, requestSettings, origSettings, mockHandlers[k]);

				return mockRequest;
			***REMOVED***

			// We don't have a mock request, trigger a normal request
			return _ajax.apply($, [origSettings]);
		***REMOVED***

		/**
		* Copies URL parameter values if they were captured by a regular expression
		* @param {Object***REMOVED*** mockHandler
		* @param {Object***REMOVED*** origSettings
		*/
		function copyUrlParameters(mockHandler, origSettings) {
			//parameters aren't captured if the URL isn't a RegExp
			if (!mockHandler.url instanceof RegExp) {
				return;
			***REMOVED***
			//if no URL params were defined on the handler, don't attempt a capture
			if (!mockHandler.hasOwnProperty('urlParams')) {
				return;
			***REMOVED***
			var captures = mockHandler.url.exec(origSettings.url);
			//the whole RegExp match is always the first value in the capture results
			if (captures.length === 1) {
				return;
			***REMOVED***
			captures.shift();
			//use handler params as keys and capture resuts as values
			var i = 0,
				capturesLength = captures.length,
				paramsLength = mockHandler.urlParams.length,
				//in case the number of params specified is less than actual captures
				maxIterations = Math.min(capturesLength, paramsLength),
				paramValues = {***REMOVED***;
			for (i; i < maxIterations; i++) {
				var key = mockHandler.urlParams[i];
				paramValues[key] = captures[i];
			***REMOVED***
			origSettings.urlParams = paramValues;
		***REMOVED***


		// Public

		$.extend({
			ajax: handleAjax
		***REMOVED***);

		$.mockjaxSettings = {
			//url:        null,
			//type:       'GET',
			log: function (msg) {
				if (window['console'] && window.console.log) {
					var log = Function.prototype.bind.call(console.log, console);
					log.apply(console, arguments);
				***REMOVED***
			***REMOVED***,
			status: 200,
			statusText: "OK",
			responseTime: 500,
			isTimeout: false,
			contentType: 'text/plain',
			response: '',
			responseText: '',
			responseXML: '',
			proxy: '',
			proxyType: 'GET',

			lastModified: null,
			etag: '',
			headers: {
				etag: 'IJF@H#@923uf8023hFO@I#H#',
				'content-type': 'text/plain'
			***REMOVED***
		***REMOVED***;

		$.mockjax = function (settings) {
			var i = mockHandlers.length;
			mockHandlers[i] = settings;
			return i;
		***REMOVED***;
		$.mockjaxClear = function (i) {
			if (arguments.length == 1) {
				mockHandlers[i] = null;
			***REMOVED*** else {
				mockHandlers = [];
			***REMOVED***
		***REMOVED***;
		$.mockjax.handler = function (i) {
			if (arguments.length == 1) {
				return mockHandlers[i];
			***REMOVED***
		***REMOVED***;
	***REMOVED***)(window.jQuery);
***REMOVED***);
/*global define, require, doT*/
/**
 * Services Module
 * Abastracts the API and facilitates the connectivity
 * and multi async communications (using promises)
 * The API is defined at: http://goo.gl/Vr8A1
 */
define('app/network/Services', ['./urlsMap',
	'../storage/Storage',
	'app/utils/Modal',
	'lib/jquery/mockjax'
],
	function (
		urls,
		Storage,
		Modal
	) {
		var DEBUG_MODE = !!$(document.body).attr('data-debug'),
			_factoryCacheObj = {***REMOVED***,
			ready = !DEBUG_MODE,
			queuedDebugQueries = [],
			appVersion = {***REMOVED***,
			// global ajax promise for projects
			projectsSearching,
			isIE = /*@cc_on!@*/false || testCSS('msTransform'),
			root = DEBUG_MODE ? '' : window.location.protocol + '//' + window.location.host
		// root = 'http://172.16.78.69:29579'

		window.appVersion = { Name: 'Mapa Regalias', Version: '0.3.2' ***REMOVED***;

		//console.info(window.appVersion)

		if (DEBUG_MODE) {

			//For testing purposes ;)
			//Filtros de búsqueda
			require(['app/network/debugQueries'], function () {
				ready = true
				if (queuedDebugQueries.length) {
					for (var i = 0; i < queuedDebugQueries.length; i++) {
						var promise = _get(queuedDebugQueries[i].url, queuedDebugQueries[i].data, queuedDebugQueries[i].callback, queuedDebugQueries[i].errorCb)
						if (queuedDebugQueries[i].cb)
							promise.done(queuedDebugQueries[i].cb)
					***REMOVED***
				***REMOVED***
			***REMOVED***)
		***REMOVED***


		function testCSS(prop) {
			return prop in document.documentElement.style;
		***REMOVED***


		/**
		 * Proxy function for easy comms
		 * @param  {String***REMOVED***		url
		 * @param  {Object***REMOVED***		data
		 * @param  {Function***REMOVED***	callback
		 * @param  {Function***REMOVED***	errorCb
		 * @return {jQuery.ajax***REMOVED***
		 */
		function _get(url, data, callback, errorCb) {
			errorCb = errorCb || defaultErrorCb

			if (ready) {

				var request = $.ajax({
					url: root + url,
					data: data,
					settings: {
						cache: _factoryCache(
							url,
							data
						)
					***REMOVED***
				***REMOVED***)

				//jQuery deffer success and error filters
				request.pipe(
					function (response, status) {
						var modal
						if (!response.status && status != 'abort') {
							modal = Modal.error(response.message)
							modal.show()
							if ('console' in window) {
							***REMOVED***
						***REMOVED*** else if (status != 'abort' && ('console' in window)) {
						***REMOVED***
						if (response.status && response.message) {
							modal = Modal.info(response.message)
							modal.show()
						***REMOVED***
						return response.status
					***REMOVED***,
					function (response, status) {
						var modal
						if (!response.status && status != 'abort') {
							if ('console' in window) {
							***REMOVED***
						***REMOVED*** else if (status != 'abort' && ('console' in window)) {
							//window.console.log('Harmless Warning: Request Aborted')
						***REMOVED***
						if (response.message && status != 'abort') {
							var modal = Modal.error(response.message)
							modal.show()
						***REMOVED***
						return !response.status
					***REMOVED***
				)

				request.fail(errorCb)
					.error(errorCb)

				if (callback) request.done(callback)

				return request
			***REMOVED*** else {
				queuedDebugQueries.push({
					url: url,
					data: data,
					callback: callback,
					errorCb: errorCb,
					done: function (callback) {
						this.cb = this.cb || []
						this.cb.push(callback)
					***REMOVED***
				***REMOVED***)
				return queuedDebugQueries[queuedDebugQueries.length - 1]
			***REMOVED***


		***REMOVED***

		function _factoryCache(url, data) {
			//Warning: IE7- has no JSON Object defined
			var key = url + '::' + JSON.stringify(data)

			if (_factoryCacheObj[key]) {
				return true
			***REMOVED***

			_factoryCacheObj[key] = true
			return false
		***REMOVED***

		function defaultErrorCb() {
			//TODO error handling
		***REMOVED***

		$(document).on('click', '.submenu a', function (e) {
			e.preventDefault()
			e.stopPropagation()

			var thishref = $(this).attr('href'),
				dataValue = $(this).attr('data-value')

			window.location.href = thishref

			$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo-' + dataValue)

			$('.buttons-filter-fiscalization a[data-value="' + dataValue + '"]').trigger('click')

		***REMOVED***)

		$(document).on('click', '.buttons-filter-fiscalization a', function (e) {
			e.preventDefault()
			var $this = $(this),
				dataValue = $this.attr('data-value'),
				$searchCampo = $('.filter-group[data-parameter=campoProyectoFiscalizacion] .filter-list input[type="text"]'),
				$buttonCampo = $('.filter-group[data-parameter=campoProyectoFiscalizacion] .filter-list .filter button'),
				$optionSelected = $('.filter-group[data-parameter=campoProyectoFiscalizacion] .filter-list .options .option.selected'),
				dataTextFilter = $this.attr('data-text-filter');

			$('.buttons-filter-fiscalization a').removeClass('active')
			$this.addClass('active')


			$('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text(dataTextFilter)


			if ($searchCampo.val() != "") {
				//$searchCampo.val('')
				$optionSelected.trigger('click')
			***REMOVED***

			$('.filter-group[data-parameter=tipoRecursoNaturalFiscalizacion] .option[data-value="' + dataValue + '"]').trigger('click')


		***REMOVED***)


		//////////////////////////////////////////////////////////////////
		// POLYGONS SERVICES
		//////////////////////////////////////////////////////////////////
		/**
		 * Le history:
		 * La idea es mantener el cache de los polígonos del localstorage,
		 * entonces la jugada es simplemente:
		 *	1. sacar
		 *		1.1 si no hay, pedir al servidor
		 *			1.1.1 guardar respuesta en localstorage
		 *		1.2 si hay, pedir al servidor con la fecha
		 *			1.2.1 si viene vacío, responder con LS
		 *			1.2.2 si no viene vacío, guardar respuesta en LS y responder
		 */

		/**
		 * Makes the request and handle the
		 * @param  {String***REMOVED***   type        whether is departments,regions,municipalities
		 * @param  {Function***REMOVED*** callback
		 * @param  {Number***REMOVED***   lastUpdated the last date of modification
		 */
		function polygonsRequester(type, callback, polygonsData) {
			var data = polygonsData && polygonsData.lastUpdated ?
				{ lastUpdated: polygonsData.lastUpdated ***REMOVED*** : {***REMOVED***

			//console.log(urls[type])
			_get(urls[type], data, function (responseJSON) {
				if (responseJSON.geojson &&
					responseJSON.geojson.features /*&&
				responseJSON.geojson.features.length*/ ) {
					try {
						if (!isIE) {
							Storage.storeDataList(responseJSON)
							callback(Storage.getDataList(type))
						***REMOVED*** else {
							callback(responseJSON.geojson)
						***REMOVED***
					***REMOVED*** catch (e) {
						if ('console' in window) {
							//window.console.log('Harmless Warning: Quota Exceded!')
							//window.console.log('Harmless Warning: Quota exceded storing: ' + responseJSON )
						***REMOVED***
						if ('localStorage' in window)
							window.localStorage.clear()
						callback(responseJSON.geojson)
					***REMOVED***
				***REMOVED*** else {
					callback(polygonsData)
				***REMOVED***
			***REMOVED***)
			// callback(polygonsData)
		***REMOVED***

		/**
		 * Interface for common actions to handling the data request
		 *
		 * @param  {String***REMOVED***   type     flag for data type
		 * @param  {Function***REMOVED*** callback
		 */
		function loadInterface(type, callback) {
			var polygonsData = Storage.getDataList(type)
			if (!polygonsData.features.length) {
				polygonsRequester(type, callback)
			***REMOVED*** else {
				polygonsRequester(type, callback, polygonsData)
			***REMOVED***
		***REMOVED***

		/**
		 * Loads the departments polygons data
		 *
		 * @param  {Function***REMOVED*** callback [description]
		 */
		function loadDepartments(callback) {
			loadInterface('departments', callback)
		***REMOVED***

		/**
		 * Loads the regions polygons data
		 *
		 * @param  {Function***REMOVED*** callback [description]
		 */
		function loadRegions(callback) {
			loadInterface('regions', callback)
		***REMOVED***

		/**
		 * Loads the municipalities polygons data
		 *
		 * @param  {Function***REMOVED*** callback [description]
		 */
		function loadMunicipalities(callback) {
			loadInterface('municipalities', callback)
		***REMOVED***

		function loadProjectFilters() {
			return _get(urls.filtersProjects)
		***REMOVED***

		function search(type, query, options) {
			var json
			options = options || {***REMOVED***
			//console.warn(type, query, options)
			if (type === 'Proyectos') {
				if (options.isList) {
					return _get(urls['searchProjectsList'], query);
				***REMOVED***
				else {
					return _get(urls['searchProjects'], query);
				***REMOVED***
			***REMOVED*** else if (type === 'Recursos') {
				if (options.pushpins) {
					return _get(urls['infoboxesResources'], query);
				***REMOVED***
				else {
					return _get(urls['searchResources'], query);
				***REMOVED***
			***REMOVED*** else if (type === 'Produccion') {
				if (options.pushpins) {
					return _get(urls['infoboxesProduction'], query);
				***REMOVED***
				else {
					return _get(urls['searchProduction'], query);
				***REMOVED***
			***REMOVED*** else if (type === 'Fiscalizacion') {
				if (options.pushpins) {
					return _get(urls['infoboxesFiscalizacion'], query);
				***REMOVED***
				else {
					return _get(urls['searchFiscalizacion'], query);
				***REMOVED***
			***REMOVED***
		***REMOVED***

		function searchText(key) {
			return _get(urls.texts, { id: key ***REMOVED***)
		***REMOVED***

		function getConsolidated(paramsString) {
			return _get(urls.consolidated, paramsString)
		***REMOVED***

		function getBudgetList(params) {
			return _get(urls.getBudget, params)
		***REMOVED***
		function getDistributionList(params) {
			return _get(urls.getDistribution, params)
		***REMOVED***
		function getOutlayList(params) {
			return _get(urls.getOutlay, params)
		***REMOVED***
		function getAprovedList(params) {
			return _get(urls.getAprovedProyects, params)
		***REMOVED***
		function getExecutedList(params) {
			return _get(urls.getExecuted, params)
		***REMOVED***
		function getRegaliasList(params) {
			return _get(urls.getRegalias, params)
		***REMOVED***
		function getValueAproved(params) {
			return _get(urls.getValueAproved, params)
		***REMOVED***
		function getPerformance(params) {
			return _get(urls.getPerformance, params)
		***REMOVED***

		function getConsolidatedResources(paramsString) {
			return _get(urls.consolidatedResources, paramsString)
		***REMOVED***

		function getConsolidatedProduction(paramsString) {
			return _get(urls.consolidatedProduction, paramsString)
		***REMOVED***

		function getConsolidatedFiscalizacion(paramsString) {
			return _get(urls.consolidatedFiscalizacion, paramsString)
		***REMOVED***

		function getProductionInfo(paramsString) {
			return _get(urls.getProductionInfo, paramsString)
		***REMOVED***
		function getFieldInfo(url, paramsString) {
			return _get(url, paramsString)
		***REMOVED***

		function getProjectList(url) {
			var split = url.split('?')
			return _get(split[0], split[1])
		***REMOVED***

		function sendByEmail(params) {
			return _get(urls.sendByEmail, params)
		***REMOVED***

		function getGraficaContratos(params) {
			return _get(urls.getContratosPerAnyo, params)
		***REMOVED***

		function getGraficaValorContratos(params) {
			return _get(urls.getValorContratosPerAnyo, params)
		***REMOVED***
		function getAnnioContratos(params) {
			return _get(urls.getValorAnnioContratos, params)
		***REMOVED***

		function getContratos(params) {
			return _get(urls.getContratosContratista, params);
		***REMOVED***

		function getGraficaContratosTipo(params) {
			return _get(urls.getContratosPerTipo, params)
		***REMOVED***

		function getAnnioContratosProyecto(params) {
			return _get(urls.getAnnioContratosProyecto, params)
		***REMOVED***

		return {
			polygons: {
				getDepartments: loadDepartments,
				getRegions: loadRegions,
				getMunicipalities: loadMunicipalities
			***REMOVED***,

			filters: {
				forProjects: loadProjectFilters
			***REMOVED***,

			search: search,

			resources: {
				presupuesto: getBudgetList,
				distribuido: getDistributionList,
				giros: getOutlayList,
				aprobado: getAprovedList,
				ejecutado: getExecutedList,
				regalias: getRegaliasList,
				valorAprobado: getValueAproved,
				rendimiento: getPerformance
			***REMOVED***,

			production: {
				productionInfo: getProductionInfo,
				fieldInfo: getFieldInfo,
				aproved: getAprovedList
			***REMOVED***,

			infograph: {
				consolidated: getConsolidated,
				resources: getConsolidatedResources,
				production: getConsolidatedProduction,
				fiscalizacion: getConsolidatedFiscalizacion
			***REMOVED***,

			contratista: {
				getGraficaContratos: getGraficaContratos,
				getGraficaValorContratos: getGraficaValorContratos,
				getGraficaContratosTipo: getGraficaContratosTipo,
				getAnnioContratos: getAnnioContratos,
				getContratos: getContratos,
				getAnnioContratosProyecto: getAnnioContratosProyecto
			***REMOVED***,
			projectsList: getProjectList,

			sendByEmail: sendByEmail,

			texts: searchText

		***REMOVED***
	***REMOVED***);
define('app/controller/appStates', [], function () {
	return [
		'Comunes',
		'Proyectos',
		'Recursos',
		'Produccion',
		'Fiscalizacion'
	]
***REMOVED***);
/*global define, Class, Router, doT, Microsoft*/
/**
 * App State
 * This Class handles all the state syncronization between
 * all the entities of the application, and the services
 * negotiation
 */
define('app/controller/AppState', [
	'lib/mvc/Observable',
	'app/network/Services',
	// Available application states
	'./appStates',
	'app/utils/Modal'
], function (
	Observable,
	Services,
	appStates,
	Modal
) {

	var filtersCleared = false,
		ignoreHash = false,
		// , historyPush = !!(window.history && window.history.pushState),
		infoTemplate = doT.compile('<div class="info"><h1>Información</h1><p>{{=it.message***REMOVED******REMOVED***</p>' +
			'<div class="txt-right"><a class="button close">Cerrar</a></div></div>'),
		// This is for the selection of a territory
		// Bing Animation is not cancelable so I had to set this
		// ugly flag
		ignoreNextFilter = false,
		skipNextZoom,
		skipNextCorners,
		// Another ugly flag to ignore url overwriting when setting filter
		resentlyChangedState,
		lastRequestedQuery,
		filtersSettedByString = false,
		ignoreWeAreReseting = false,
		filtersLoaded = false,
		TerritoryLoaded = false,
		SetLocationProfileMap = false,
		DEBUG_MODE = !!$(document.body).attr('data-debug')

	// UPDATE URL
	// PARSE URL
	// NOTIFY


	/**
	 * Returns the state from a hash
	 * @param  {String***REMOVED*** hash from history
	 * @return {Atring***REMOVED***      valid state
	 */
	function getStateForHash(hash) {
		var i = appStates.length,
			key,
			index
		for (; i--;) {
			key = appStates[i]
			index = hash.indexOf(key.toLowerCase())
			if (index == 2) {
				return key
			***REMOVED***
		***REMOVED***

		return ''//appStates[0]
	***REMOVED***


	function areNotSameCorners(corners, corners2) {
		if (corners === null && corners2 !== null ||
			corners2 === null && corners !== null) {
			return true
		***REMOVED***
		return !(corners[0][0] == corners2[0][0] &&
			corners[0][1] == corners2[0][1] &&
			corners[1][0] == corners2[1][0] &&
			corners[1][1] == corners2[1][1])
	***REMOVED***


	$('#share p').on('click', function () {
		///hideShow()
		$('#share .container-share').add($(this)).toggleClass('show')
	***REMOVED***)

	var AppState = new Class(Observable, {
		// Request params
		zoom: 8, // 1,..,n
		corners: [[16.54945114921138, -90.2471612288278], [12.937769543323796, -83.2708428694528]], // [[4.667292,-74.059508], [4.667292,-74.059508]]
		center: [14.75110258191421, -86.7590020491403],
		defaultCenter: [14.75110258191421, -86.7590020491403],
		filters: null, //"departamento=1,2&estado=1"
		query: '',
		// Whether the request is directed to the list mode
		isListMode: null,
		// Request flags
		timeout: null,
		firstTime: true,
		cachedRequest: null,
		cachedRequest2: null,
		cachedCorners: null,
		state: '',
		defaultState: '',
		//-----------------------------------
		// TODO ALL LOGIC
		//-----------------------------------
		lastHash: '',

		initialize: function () {
			var router = new Router(),
				self = this,
				// hash = window.location.hash,
				lambda = function () { ***REMOVED***

			// router.historyList = []


			//debugger;
			if (!location.hash) location.hash = '#/proyectos'

			router.configure({
				// Detects all history changes
				// and decides what to do
				on: function on() {
					//console.log( 'herreee+++++++++++++++++++++++++' )
					// Ignores the first call
					if (self.firstTime) {
						self.firstTime = false
						return
					***REMOVED***
					// If the location is different is
					// because it was fired by history
					// and needs to be interpreted into filters
					if (self.lastRequestedUrl !== location.hash) {

						if (location.pathname.indexOf('LocationProfile') !== -1) {
							params = location.hash.match(/\?.+/)

							if (params) {
								paramName = ''

								params = params[0].substr(1).split('&')
								params = typeof params == 'string' ? [params] : params
								// console.log('params...'+location.hash)
								for (var i = 0, pair; i < params.length; i++) {
									pair = params[i].split('=');
									if (pair[0] == 'departamento' || pair[0] == 'municipio') {
										paramName = pair[0];
										value = pair[1];

										if (paramName == 'municipio') break;
									***REMOVED***
								***REMOVED***

								if (paramName) {
									var locationID = document.body.getAttribute('data-locationID');
									var locationType = document.body.getAttribute('data-locationType');

									if (locationID != value) {
										document.body.setAttribute('data-locationID', value);
										document.body.setAttribute('data-locationType', paramName);
										SetLocationProfileMap = true
									***REMOVED***
								***REMOVED***

								if (typeof value != undefined && SetLocationProfileMap) {
									var options = [{ value: value ***REMOVED***];
									self.activateStateProyects()
									self.fireEvent('filter-activated', paramName, value.split(','), 'noNotify')
									self.fireEvent('territory-activated', paramName, options)
									//self.fireEvent('update-filter-string');
									self.updateURL()
								***REMOVED***

							***REMOVED***
						***REMOVED***


						if (location.pathname.indexOf('LocationProfile') !== -1 || location.pathname.indexOf('FichaCovid') !== -1) {
							params = location.hash.match(/\?.+/)

							if (params) {
								paramName = ''
								value = null
								params = params[0].substr(1).split('&')
								params = typeof params == 'string' ? [params] : params
								// console.log('params...'+location.hash)
								for (var i = 0, pair; i < params.length; i++) {
									pair = params[i].split('=');
									if (pair[0] == 'departamento' || pair[0] == 'municipio') {
										paramName = pair[0];
										value = pair[1];

										if (paramName == 'municipio') break;
									***REMOVED***
								***REMOVED***

								if (paramName) {
									var locationID = document.body.getAttribute('data-locationID');
									var locationType = document.body.getAttribute('data-locationType');

									if (locationID != value) {
										document.body.setAttribute('data-locationID', value);
										document.body.setAttribute('data-locationType', paramName);
										SetLocationProfileMap = true
									***REMOVED***
								***REMOVED***

								if (value != undefined && value != null && SetLocationProfileMap) {
									var options = [{ value: value ***REMOVED***];
									self.activateStateProyects()
									self.fireEvent('filter-activated', paramName, value.split(','), 'noNotify')
									self.fireEvent('territory-activated', paramName, options)
									//self.fireEvent('update-filter-string');
									self.updateURL()
								***REMOVED***

							***REMOVED***
						***REMOVED***

						self.parseUrl()
					***REMOVED***
				***REMOVED***
			***REMOVED***)

			router.on(/\/(proyectos|recursos|produccion|fiscalizacion|(\?.+)?)/, function () {
				if (location.hash.match(/\?.+/)) {
				***REMOVED*** else {
					self.setListMode(false, false, false)
					self.ignoreWeAreReseting()
				***REMOVED***

				// self.fireEvent('redraw-all')
				// self.state = ''
				// self.fireEvent('filter-reseted')
			***REMOVED***)

			//debugger;

			router.on(/proyectos.*/, lambda)

			this.on('state-change', updateStateMode)

			function updateStateMode(state) {
				var $stateName = $('#state-name'),
					name = state
				if (state == 'Fiscalizacion') {
					name = 'Fiscalización'
				***REMOVED*** else if (state == 'Produccion') {
					name = 'Producción'
				***REMOVED***
				if (state) {
					// quitar landing mode
					$('.map-container').removeClass('home-mode')
					$stateName
						.text(name)
						.next()
						.text($stateName.attr('data-tooltip-' +
							state.toLowerCase()))
						.parent().show()

				***REMOVED*** else {
					// agregar landing mode
					$stateName.parent().hide()
					$('.map-container').addClass('home-mode')
				***REMOVED***
			***REMOVED***

			this.state = getStateForHash(location.hash)
			updateStateMode(this.state)

			router.init()
			// console.log('after')

		***REMOVED***,

		ignoreWeAreReseting: function () {
			ignoreWeAreReseting = true
			setTimeout(function () {
				ignoreWeAreReseting = false
			***REMOVED***, 1500)
		***REMOVED***,

		parseUrl: function (event) {
			var params,
				paramName,
				value,
				zoomValue,
				tl, br,
				tlArr, brArr,
				zoomChanged,
				cornersChanged,
				newState = getStateForHash(location.hash),
				view = {***REMOVED***,
				appStateView = {***REMOVED***,
				isGroup = false,
				isList = false,
				center = this.center


			// Read the url for params
			params = location.hash.match(/\?.+/)
			this.lastRequestedUrl = location.hash

			if (event == 'filtersLoaded' && !newState && !location.hash.match(/\?.+/)) return

			if (!filtersSettedByString) this.fireEvent('filter-reseted', true, true)
			if (params) {
				params = params[0].substr(1).split('&')
				params = typeof params == 'string' ? [params] : params
				// console.log('params...'+location.hash)
				for (var i = 0, pair; i < params.length; i++) {
					pair = params[i].split('=')
					paramName = pair[0]
					value = pair[1]
					// console.log(paramName)
					// console.log(value)
					// console.log(filtersSettedByString)
					// urlObj[paramName] = value
					if (paramName == 'zoom') {
						zoomValue = value
					***REMOVED*** else if (paramName == 'center') {
						center = value.split(',')
						if (i + 2 < params.length) {
							tlArr = params[i + 1].split('=')[1].split(',')
							brArr = params[i + 2].split('=')[1].split(',')
							tl = new Microsoft.Maps.Location(
								tlArr[0],
								tlArr[1]),
								br = new Microsoft.Maps.Location(
									brArr[0],
									brArr[1])
							i += 2
						***REMOVED***
					***REMOVED*** else if (paramName == 'topLeft') {
						// I suppose it will always come in this order
						tlArr = value.split(',')
						brArr = params[i + 1].split('=')[1].split(',')
						tl = new Microsoft.Maps.Location(
							tlArr[0],
							tlArr[1]),
							br = new Microsoft.Maps.Location(
								brArr[0],
								brArr[1])
						//Captured the next, so go on
						i++
					***REMOVED*** else if (paramName == 'listMode') {
						isList = true
					***REMOVED*** else if (paramName == 'isGroup') {
						isGroup = true
					***REMOVED***
					else if (value && !filtersSettedByString) {
						this.fireEvent('filter-activated', paramName, value.split(','))
					***REMOVED***
				***REMOVED***

				this.setListMode(isList, isGroup, false)
				filtersSettedByString = false

				// Override filters localization and use the parameters values
				zoomChanged = (this.zoom != zoomValue)

				if (this.center) {
					cornersChanged = (center[0] != this.center[0] || center[1] != this.center[1]) ||
						tlArr && brArr && areNotSameCorners(this.corners, [tlArr, brArr])
				***REMOVED***

				if (zoomChanged && zoomValue) {
					view.zoom = appStateView.zoom = zoomValue
				***REMOVED***
				if (cornersChanged) {
					if (center !== this.center) {
						this.center = view.center = center
						appStateView.center = center
					***REMOVED*** else {
						view.leftTop = tl
						view.rightBottom = br
						appStateView.corners = [tlArr, brArr]
					***REMOVED***
				***REMOVED***
				//console.log(view.zoom, appStateView.zoom, zoomChanged, this.zoom, zoomValue)
				if (zoomChanged || cornersChanged) {
					this.setZoomAndCorners(appStateView, { noNotify: true ***REMOVED***)
					// Group list view is in one point
					//console.log('--->',view.zoom, appStateView.zoom)
					if (br != tl) this.fireEvent('map-changed', view, true)
				***REMOVED***

			***REMOVED*** else {
				this.fireEvent('filter-reseted')
			***REMOVED***
			// State changed?
			if (this.state != newState) {
				this.state = newState


				this.fireEvent('state-change', newState, location.hash,
					location.hash.replace(/^[^\?]+\?/, ''))

			***REMOVED*** else {
				this.fireEvent('params-change', newState, location.hash,
					location.hash.replace(/^[^\?]+\?/, ''))
			***REMOVED***
			this.updateQueryByURL()
		***REMOVED***,

		getState: function () {
			return {
				state: this.state,
				hash: this.hash,
				params: this.params
			***REMOVED***

		***REMOVED***,

		getStateArray: function () {
			return [
				this.state,
				this.hash,
				this.params
			]
		***REMOVED***,

		setZoomAndCorners: function (view, options) {
			options = options || {***REMOVED***

			// this.setListMode( false )
			ignoreNextFilter = false

			if (!this.corners) {
				this.corners = null
			***REMOVED***

			// There is no difference to the present state?
			if ((view.zoom && this.zoom == view.zoom) &&
				(view.corners && !areNotSameCorners(this.corners, view.corners))) {
				return
			***REMOVED***


			if (view.zoom) this.zoom = view.zoom

			// console.log(this.zoom, view.zoom)

			//CORNERS

			this.center = view.center;
			if (options.isGroupList) {
				this.center[0] = view.center[0] //|| this.defaultCenter
				this.center[1] = view.center[1] //|| this.defaultCenter
				this.corners = view.corners || this.defaultCorners
				this.page = 1
				this.setListMode(true, options.isGroupList)

			***REMOVED*** else {
				if (view.center) {
					this.center[0] = view.center[0] //|| this.defaultCenter
					this.center[1] = view.center[1] //|| this.defaultCenter
				***REMOVED***
				this.cachedCorners = view.corners
				this.corners = view.corners || this.defaultCorners
				this.setListMode(this.isListMode, options.isGroupList)
			***REMOVED***

			if (!options.noNotify) this.updateURLTimed()

			this.activateStateProyects()
		***REMOVED***,

		setDefaultCorners: function (corners) {
			this.corners = this.defaultCorners = corners
		***REMOVED***,

		setFiltersString: function (filters) {
			//console.log('FILTERS STRING ======> '+ ignoreNextFilter)
			this.filters = filters
			this.setListMode(this.isListMode)

			filtersSettedByString = true

			if (!ignoreNextFilter) {
				this.updateURLTimed()
				//console.log(filters)
			***REMOVED***
		***REMOVED***,

		ignoreNextFilterSelection: function () {
			ignoreNextFilter = true
		***REMOVED***,

		activateStateProyects: function () {
			if (!this.state && !ignoreWeAreReseting) {
				this.state = 'Proyectos'
				this.fireEvent('state-change', this.state, location.hash,
					location.hash.replace(/^[^\?]+\?/, ''))
				this.updateURLTimed()
			***REMOVED***

		***REMOVED***,

		setQuery: function (query) {
			//console.log('QUERY '+query)
			this.query = query || ''
			// this.setListMode( false )

			if (!ignoreNextFilter) {
				this.updateURLTimed()
			***REMOVED***
		***REMOVED***,

		setPage: function (page) {
			//console.log('PAGE '+page)
			this.page = page
			this.updateURLTimed()
		***REMOVED***,

		updateQueryByURL: function () {
			var query = location.hash.replace(/^[^\?]+\??/, ''),
				req
			//console.log('>>>>>>>>>>>>>>>>>>>>>>')
			// If not query
			if (!query) {
				query = 'zoom=8'

				if (!this.center) {
					this.center = [14.75110258191421, -86.7590020491403]
				***REMOVED***

				query = query + '&center=' + this.center[0] + ',' + this.center[1]
				if (this.defaultCorners) {
					query = query + '&topLeft=' + this.defaultCorners[0].join(',') +
						'&bottomRight=' + this.defaultCorners[1].join(',')
					this.corners = this.defaultCorners
				***REMOVED***
				this.zoom = 8
			***REMOVED*** else {
				if (lastRequestedQuery == this.state + query) return
			***REMOVED***

			lastRequestedQuery = this.state + query
			// console.log('requesting with '+this.state, this.isListMode)
			if (!this.isListMode || !this.state) {
				// Check if there is a running ajax anc cancel it
				if (this.cachedRequest && this.cachedRequest.readystate != 4) {
					if (this.cachedRequest.abort) this.cachedRequest.abort()
					//Notify the Map to remove one loading
					this.fireEvent('load-projects-aborded', query)
				***REMOVED***
				// Check if there is a running ajax anc cancel it
				if (this.cachedRequest2 && this.cachedRequest2.readystate != 4) {
					if (this.cachedRequest2.abort) this.cachedRequest2.abort()
					//Notify the Map to remove one loading
					this.fireEvent('load-projects-aborded', query)
				***REMOVED***
				console.log('requesting query ', query)

				if (query.indexOf("center") != -1 && (query.indexOf("bottomRight") == -1 || query.indexOf("topLeft") == -1)) {
					query += '&topLeft=16.54945114921138,-90.2471612288278'
					query += '&bottomRight=12.937769543323796,-83.2708428694528'
				***REMOVED***

				if (query.indexOf("center") != -1 && query.indexOf("bottomRight") != -1 && query.indexOf("topLeft") != -1) {
					console.log('Service request query -> ', query)
					//debugger;
					this.cachedRequest = Services.search(this.state || 'Proyectos', query)
				***REMOVED***



				if (this.state !== 'Recursos' &&
					this.state !== 'Produccion' &&
					this.state !== 'Fiscalizacion' &&
					this.cachedRequest) {
					this.cachedRequest.done(this.projectsLoaded.bind(this))
				***REMOVED*** else if (this.state == 'Recursos') {
					this.cachedRequest2 = Services.search(this.state, query, { pushpins: true ***REMOVED***)
					$.when(this.cachedRequest2, this.cachedRequest)
						.done(this.resourcesLoaded.bind(this))
				***REMOVED*** else if (this.state == 'Produccion') {
					this.cachedRequest2 = Services.search(this.state, query, { pushpins: true ***REMOVED***)
					$.when(this.cachedRequest2, this.cachedRequest)
						.done(this.productionLoaded.bind(this))
				***REMOVED*** else if (this.state == 'Fiscalizacion') {
					this.cachedRequest2 = Services.search(this.state, query, { pushpins: true ***REMOVED***)
					$.when(this.cachedRequest2, this.cachedRequest)
						.done(this.fiscalizacionLoaded.bind(this))
				***REMOVED***

				this.fireEvent('loading-projects', query)
			***REMOVED*** else {
				req = Services.search(this.state, query, { isList: true ***REMOVED***)
				this.fireEvent('loading-projects-list', query)
				if (req) {
					req.done(this.projectsListLoaded.bind(this))
				***REMOVED***
			***REMOVED***

		***REMOVED***,

		updateURLTimed: function () {
			clearTimeout(this.timeout)
			this.timeout = setTimeout(this.updateURL.bind(this), 100)
		***REMOVED***,

		updateURL: function () {
			var query = '',
				posibleHash

			//debugger;

			if (this.firstTime) {
				this.firstTime = false
				return
			***REMOVED***

			if (this.query) {
				query += 'query=' + this.query
			***REMOVED***
			if (this.page) {
				query += '&page=' + this.page
			***REMOVED***
			if (this.zoom /*&& !this.isListMode && this.corners*/) {
				query += '&zoom=' + this.zoom
			***REMOVED***
			// console.log(JSON.stringify(this.center))
			if (this.center) {
				query += '&center=' + this.center[0] + ',' + this.center[1]
			***REMOVED***
			if (this.corners /*&& (!this.isListMode || this.isListMode.isGroup)*/) {
				query += '&topLeft=' + this.corners[0][0] + ',' + this.corners[0][1]
				query += '&bottomRight=' + this.corners[1][0] + ',' + this.corners[1][1]
			***REMOVED***
			if (this.filters) {
				query += '&' + this.filters
			***REMOVED***
			//debugger;
			if (this.isListMode) {
				query += '&listMode=true'
				if (this.isListMode.isGroup) {
					query += '&isGroup=true'
				***REMOVED***
			***REMOVED***

			query = query.replace(/(?:^&)|(?:&$)/g, '')

			posibleHash = '#/' + this.state.toLowerCase() + '/?' + query

			if (!this.state) {
				posibleHash = '#/?' + query
			***REMOVED***
			if (this.lastQuery && (this.lastQuery === posibleHash)/* || !this.state*/) {
				return
			***REMOVED***
			this.lastQuery = posibleHash

			location.hash = posibleHash
		***REMOVED***,

		projectsLoaded: function (data) {
			this.fireEvent('projects-loaded', data)
		***REMOVED***,

		resourcesLoaded: function (data, data2) {
			if (data2 instanceof Array) {
				data = data[0]
				data2 = data2[0]
				this.fireEvent('resources-loaded', data, data2)
			***REMOVED*** else {
				this.fireEvent('resources-loaded', data)
			***REMOVED***
		***REMOVED***,

		productionLoaded: function (data, data2) {
			if (data2 instanceof Array) {
				data = data[0]
				data2 = data2[0]
				this.fireEvent('production-loaded', data, data2)
			***REMOVED*** else {
				this.fireEvent('production-loaded', data)
			***REMOVED***
		***REMOVED***,

		fiscalizacionLoaded: function (data, data2) {

			//debugger;

			if (data2 instanceof Array) {
				data = data[0]
				data2 = data2[0]
				this.fireEvent('fiscalization-loaded', data, data2)
			***REMOVED*** else {
				this.fireEvent('fiscalization-loaded', data)
			***REMOVED***


		***REMOVED***,

		projectsListLoaded: function (data) {
			this.fireEvent('projects-list-loaded', data)
		***REMOVED***,

		setListMode: function (bool, groupException, noForce) {

			if (bool && $('#controls').css('left') != 0) {
				$('#controls')
					.addClass('list-mode')
					.animate({ marginLeft: 10, left: 10 ***REMOVED***)
				this.fireEvent('view-group-change', bool)
			***REMOVED***

			if (bool === !!this.isListMode) return

			if (!bool) {

				this.isListMode = null
				$('#projects-list-view').hide()
				$('#map-view').show()
				$('#controls').removeClass('list-mode')
				// this.center = this.cachedCenter || this.defaultCenter
				this.corners = this.cachedCorners || this.defaultCorners

				$(".enlace_filtro_mapa").click(function (event) {
					var obj_focus_clase = event.target.className.toString();
					if (obj_focus_clase.indexOf("search-results") < 0 && obj_focus_clase.indexOf("search-item-t") < 0 && obj_focus_clase.indexOf("search-input") < 0 && obj_focus_clase.indexOf("general-search") < 0) {
						$("#divResultados").children().remove();
						$("#divResultados").addClass("objHidden");
					***REMOVED***

				***REMOVED***);
			***REMOVED*** else {

				if (groupException) {
					this.isListMode = { isGroup: true ***REMOVED***
				***REMOVED*** else {
					this.isListMode = {***REMOVED***
				***REMOVED***
				$('#map-view').hide()
				$('#projects-list-view').show()
			***REMOVED***


			if (!noForce) {
				this.updateURLTimed(groupException)
			***REMOVED***
		***REMOVED***
	***REMOVED***)

	return new AppState()
***REMOVED***);
/*global define*/
define('app/utils/territories', [], function () {
	var territories = {
		departamento: {***REMOVED***,
		region: {***REMOVED***,
		municipio: {***REMOVED***
	***REMOVED***

	return territories
***REMOVED***);
/*global define, doT, Microsoft, Event*/
define('app/map/Infobox', ['app/network/Services',
	'app/utils/territories'
],
	function (Services, territoriesCache) {

		// Tooltip templates
		var ttTempl = {
			info: doT.compile($('#template-infobox-info')[0].innerHTML),
			project: doT.compile($('#template-infobox-project')[0].innerHTML),
			group: doT.compile($('#template-infobox-group')[0].innerHTML)
		***REMOVED***, lastMousePoint,
			// isIE8 = jQuery.browser.msie && jQuery.browser.version.match(/^8/),
			isIE9 = jQuery.browser.msie && jQuery.browser.version.match(/^9/),
			isIE10 = jQuery.browser.msie && jQuery.browser.version.match(/^10/),
			desCache = {***REMOVED***,
			mapElem = $('#map-div'),
			offset = mapElem.offset(),
			mapWidth = mapElem[0].offsetWidth + offset.left,
			mapHeight = mapElem[0].offsetHeight + offset.top,
			mapTop = mapElem.offset().top


		$(window).on('resize', function () {
			mapWidth = mapElem[0].offsetWidth
			mapTop = mapElem.offset().top
		***REMOVED***)

		function mouseDownHandler(evt) {
			lastMousePoint = new Microsoft.Maps.Point(evt.getX(), evt.getY());
		***REMOVED***

		function pluralize(type) {
			if (type.indexOf('region') != -1) return 'regions'
			else if (type.indexOf('depart') != -1) return 'departments'
			else if (type.indexOf('municip') != -1) return 'municipalities'
			return type
		***REMOVED***

		function Infobox(type, map, entity, content) {
			this._type = type
			this._map = map
			this._entity = entity
			this.name = content.name

			//debugger;

			if (!this.name) {
				if (territoriesCache[content.type] && territoriesCache[content.type][content.id]) {
					this.name = territoriesCache[content.type][content.id].name
				***REMOVED***
			***REMOVED***


			content.name = this.name
			this._content = $.extend(null, content)

			Microsoft.Maps.Events.addThrottledHandler(entity._polygon || entity, 'click', this.clickHandler.bind(this), 200)
			Microsoft.Maps.Events.addHandler(map, 'mousedown', mouseDownHandler);
			Microsoft.Maps.Events.addHandler(map, 'viewchange', this.hide.bind(this))


			if (content.image) {
				document.createElement('img').src = content.image
			***REMOVED***
		***REMOVED***

		function isGoingToExceedWidth(left, width, margin) {
			margin = margin || 15
			return (left + width + margin) > mapWidth
		***REMOVED***

		function isGoingToExceedHeight(top, height, margin) {
			margin = margin || -20
			// To not allow invisible parts
			if (top - height < mapTop) return false
			return (top + height + margin) > (mapHeight + mapTop)
		***REMOVED***

		Infobox.prototype.show = function (e) {
			// TODO no agregar el infobox por defecto
			// es no agregar los infobox sino hasta
			// mostrarlos
			var menuHeight = $('#header')[0].offsetHeight,
				location,
				pinLocation,
				deltaYResource = 0,
				deltaXResourceRight = 0,
				deltaYResourceBottom = 0,
				deltaXResourceLeft = 0

			if (this._map.visibleInfobox) this._map.visibleInfobox.hide()

			this.createElement()
			this._elem.appendTo(document.body)

			//debugger;

			if (!this._content.isResource &&
				!this._content.isProduction &&
				!this._content.isFiscalization &&
				this._type !== 'project') {
				this._elem.find('.button').on('click', this.viewMoreHandler.bind(this))
			***REMOVED***
			this._elem.find('.help').on('click', this.viewHelpHandler.bind(this))
			this._elem.find('.close-help').on('click', this.hideHelpHandler.bind(this))

			//----------------------------------------
			// Polygons Infoboxes
			//----------------------------------------

			var topMargin = 0
			var LeftMargin = 0

			if (this._type == 'info' ||
				(this._type == 'resource' && !this._entity.getLocation) ||
				(this._type == 'production' && !this._entity.getLocation) ||
				(this._type == 'fiscalization' && !this._entity.getLocation)) {

				if (typeof e.pageX != 'number' || isNaN(e.pageX)) {
					e.pageX = e.originalEvent.x //+ offset.left
					e.pageY = e.originalEvent.y //+ offset.top
				***REMOVED***
				if (isIE10 || isIE9) {
					e.pageY = e.pageY + window.pageYOffset
				***REMOVED***

				//debugger;

				this._elem.css({
					display: 'block',
					// left: pinLocation.x,
					// top: pinLocation.y
					left: e.pageX, //+ offset.left,
					top: e.pageY //+ offset.top
				***REMOVED***)
					.removeClass('to-the-left')
					.removeClass('to-the-top')
					.addClass('polygon-type')

				if (isGoingToExceedWidth(e.pageX + offset.left, this._elem[0].offsetWidth)) {
					this._elem.css({
						left: e.pageX - this._elem[0].offsetWidth
					***REMOVED***).addClass('to-the-left to-the-left-2')
				***REMOVED***
				if (isGoingToExceedHeight(e.pageY + offset.top, this._elem[0].offsetHeight)) {
					this._elem.css({
						top: e.pageY - this._elem[0].offsetHeight
					***REMOVED***).addClass('to-the-top to-the-top-2')
				***REMOVED***

				if (e.pageY < offset.top) {
					this._elem.css({
						top: e.pageY + offset.top - this._elem[0].offsetHeight
					***REMOVED***).addClass('to-the-top to-the-top-2')
				***REMOVED***
			***REMOVED***
			//----------------------------------------
			// Pushpins of Projects, Resources and Fiscalization
			//----------------------------------------
			else if (this._type == 'project' ||
				(this._type == 'resource' && this._entity.getLocation) ||
				(this._type == 'production' && this._entity.getLocation) ||
				(this._type == 'fiscalization' && this._entity.getLocation)) {
				location = this._entity.getLocation(),
					pinLocation = this._map.tryLocationToPixel(location, Microsoft.Maps.PixelReference.control)

				if (this._type == 'resource') {
					deltaYResource = 60
					deltaYResourceBottom = 35
					deltaXResourceRight = 0
					deltaXResourceLeft = 5
				***REMOVED***



				this._elem.css({
					display: 'block',
					//left: pinLocation.x + deltaXResourceLeft + this._entity.radius,
					//top: pinLocation.y + this._entity.radius
					left: e.pageX,
					top: e.pageY
				***REMOVED***)
					.removeClass('to-the-left')
					.removeClass('to-the-top')

				if (isGoingToExceedWidth(pinLocation.x + this._entity.radius, this._elem[0].offsetWidth)) {
					this._elem.css({
						left: pinLocation.x - this._elem[0].offsetWidth - this._entity.radius
					***REMOVED***).addClass('to-the-left')
				***REMOVED***
				if (isGoingToExceedHeight(pinLocation.y, this._elem[0].offsetHeight, 40)) {
					this._elem.css({
						top: pinLocation.y - this._elem[0].offsetHeight
					***REMOVED***).addClass('to-the-top')
				***REMOVED***
			***REMOVED***
			//----------------------------------------
			// Pushpins of Groups
			//----------------------------------------
			else if (this._type == 'group') {
				location = this._entity.getLocation(),
					pinLocation = this._map.tryLocationToPixel(location, Microsoft.Maps.PixelReference.control)

				this._elem.css({
					display: 'block',
					//left: pinLocation.x + this._entity.radius,
					//top: pinLocation.y
					left: e.pageX,
					top: e.pageY
				***REMOVED***)
					.removeClass('to-the-left')
					.removeClass('to-the-top')
				// if(window.outerWidth - pinLocation.x - this._elem[0].offsetWidth < 0){
				if (isGoingToExceedWidth(pinLocation.x + this._entity.radius, this._elem[0].offsetWidth)) {
					this._elem.css({
						left: pinLocation.x - this._elem[0].offsetWidth - this._entity.radius
					***REMOVED***).addClass('to-the-left')
				***REMOVED***
			***REMOVED***

			//debugger;

			this._map.visibleInfobox = this
			this.visible = true


			if (e instanceof Event) {
				if (e.stopPropagation) {
					e.stopPropagation()
				***REMOVED*** else {
					window.event.cancelBubble = true
				***REMOVED***
			***REMOVED***
		***REMOVED***

		Infobox.prototype.hide = function () {
			if (this._elem && this.visible) {
				this._elem.css({ display: 'none' ***REMOVED***)
				this.visible = false
				this._elem.remove()
			***REMOVED***
		***REMOVED***


		Infobox.prototype.clickHandler = function (evt) {
			var point = new Microsoft.Maps.Point(evt.getX(), evt.getY()),
				dist = Math.sqrt(Math.pow(point.x - lastMousePoint.x, 2), Math.pow(point.y - lastMousePoint.y, 2))

			if (dist > 5) {
				return;
			***REMOVED***
			this.toggle(evt)

			if (evt instanceof Event) {
				if (evt.stopPropagation) {
					evt.stopPropagation()
				***REMOVED*** else {
					window.event.cancelBubble = true
				***REMOVED***
			***REMOVED***
		***REMOVED***

		Infobox.prototype.viewMoreHandler = function (evt) {
			if (this._type == 'group') {
				this._entity.viewGroupList({
					latitude: this._content.latitude,
					longitude: this._content.longitude
				***REMOVED***)
				this.hide()
			***REMOVED*** else {
				if (this._entity.panIntoView) {
					evt = evt.originalEvent
					this._entity.panIntoView()
					if (evt.preventDefault) {
						evt.preventDefault()
					***REMOVED*** else {
						evt.returnValue = false
					***REMOVED***
				***REMOVED***
				if (this._entity.select) {
					this._entity.select()
				***REMOVED***
			***REMOVED***
			return false
		***REMOVED***

		Infobox.prototype.viewHelpHandler = function (evt) {
			var helpCont = this._elem.find('.help-container'),
				that = $(evt.target),
				word = that.attr('data-type'),
				name = that.attr('data-name'),
				wCont = helpCont.find('.word'),
				dCont = helpCont.find('.description'),
				close = helpCont.find('.close-help'),
				self = this,
				bothWidth = 450

			if (wCont.html() === name && helpCont.is(':visible')) {
				this.hideHelpHandler()
				return false
			***REMOVED***

			function updateContent() {
				wCont.html(name)
				if (self._elem.offset().left + bothWidth - $(window).width() > 0) {
					helpCont.addClass('to-the-left')
				***REMOVED*** else {
					helpCont.removeClass('to-the-left')
				***REMOVED***
				if (desCache[word]) {
					setTimeout(function () {
						dCont.html(desCache[word])
						helpCont
							.css({
								// width: 'auto',
								height: 'auto'
							***REMOVED***)
							.find('.inner').css({
								position: 'static'
							***REMOVED***)
						helpCont
							.css({
								width: helpCont.width(),
								height: helpCont.height()
							***REMOVED***)
							.find('.inner').css({
								position: 'absolute'
							***REMOVED***)
					***REMOVED***);
				***REMOVED*** else {
					dCont.html('cargando...')
					Services.texts(word).done(function (data) {
						desCache[word] = data.TextoParametrico
						dCont.html(data.TextoParametrico)
						helpCont
							.css({
								// width: 'auto',
								height: 'auto'
							***REMOVED***)
							.find('.inner').css({
								position: 'static'
							***REMOVED***)
						helpCont
							.css({
								width: helpCont.width(),
								height: helpCont.height()
							***REMOVED***)
							.find('.inner').css({
								position: 'absolute'
							***REMOVED***)
					***REMOVED***)
				***REMOVED***
				helpCont.css({
					width: helpCont.width(),
					height: helpCont.height()
				***REMOVED***)
					.find('.inner').css({
						position: 'absolute'
					***REMOVED***)
				helpCont.animate({ width: 'show' ***REMOVED***)
				close.delay(600).fadeIn()
			***REMOVED***
			if (helpCont.is(':visible')) {
				this.hideHelpHandler(updateContent)
			***REMOVED*** else {
				updateContent()
			***REMOVED***

			return false
		***REMOVED***

		Infobox.prototype.hideHelpHandler = function (callback) {
			var helpCont = this._elem.find('.help-container'),
				close = helpCont.find('.close-help'),
				promise

			close.fadeOut(200)
			promise = helpCont.animate({ width: 'hide' ***REMOVED***).promise()
			if (typeof callback == 'function') {
				promise.then(callback)
			***REMOVED***
		***REMOVED***

		Infobox.prototype.toggle = function (e) {
			if (this.visible) this.hide(e)
			else this.show(e)
		***REMOVED***

		Infobox.prototype.updateContent = function (content, type) {
			this._type = type || this._type
			content.name = this.name
			this._content = $.extend(null, content)
			if (this._elem) this.hide()
		***REMOVED***

		Infobox.prototype.createElement = function () {
			var //type = "fiscalization",
				type = this._type,
				content = this._content,
				htmlContent = ttTempl[type] ?
					ttTempl[type](content) :
					content,
				tempElem = document.createElement('div')


			tempElem.innerHTML = htmlContent
			this._elem = tempElem.children[0]
			this._elem.style.display = 'none'
			this._elem = $(this._elem)
		***REMOVED***


		return Infobox

	***REMOVED***);
/*global Microsoft, define, Class*/
define('app/map/Polygon', ['lib/mvc/Observable', './Infobox'], function (Observable, Infobox) {

	/**
	 * Polygon Class
	 *
	 * @param  {Microsoft.Maps.Map***REMOVED***	map parent map
	 * @param  {Object***REMOVED***	 			config
	 * @param  {Boolean***REMOVED*** 			isLight is a light representaion of coords
	 * @param  {String***REMOVED***  			id
	 * @param  {String***REMOVED***  			type    of polygon: municipalities, dep...
	 */
	var Polygon = new Class(Observable, {

		initialize: function (map, config, isLight, id, type) {
			var // default colors
				defaultFillColor = rgbaToMSColor('rgba(' + Polygon.baseRGB + ',0.55)'),
				defaultStrokeColor = rgbaToMSColor('rgba(' + Polygon.strokeRGB + ',1)'),
				// color loading
				strokeThickness = config.strokeThickness || 1,
				locations = [],
				// Bing Polygon Options
				options

			this._highlightColor = rgbaToMSColor('rgba(' + Polygon.baseRGB + ',0)')
			this._fillColor = config.fillColor ?
				rgbaToMSColor(config.fillColor) :
				defaultFillColor,
				this._strokeColor = config.strokeColor ?
					rgbaToMSColor(config.strokeColor) :
					defaultStrokeColor


			options = {
				fillColor: this._fillColor,
				strokeColor: this._strokeColor,
				strokeThickness: strokeThickness
			***REMOVED***


			if (type != 'municipalities') {
				//debugger;
				locations = this.generatePolygon(config.coords, isLight)
			***REMOVED*** else {
				this.coords = config.coords
				this.isLight = isLight
			***REMOVED***


			this._polygon = new Microsoft.Maps.Polygon(
				locations,
				options
			)

			this._polygon.Polygon = this

			Microsoft.Maps.Events.addHandler(this._polygon, 'mouseover', this.highlightPolygon.bind(this))
			Microsoft.Maps.Events.addHandler(this._polygon, 'mouseout', this.restorePolygon.bind(this))

			this.config = config
			this.id = id
			this.type = type
			this._map = map

			//debugger;
			this.createInfobox()
		***REMOVED***,

		generatePolygon: function (coords, isLight) {
			var joinedCoordinates,
				setLocations = (typeof coords == 'undefined')

			if (this.generated) return;

			coords = coords || this.coords
			isLight = isLight || this.isLight

			joinedCoordinates = joinCoordinates(coords, isLight)

			// Extreme left top coordinate
			this._leftTopPoint = joinedCoordinates.leftTopPoint
			// Extreme right bottom coordinate
			this._rightBottomPoint = joinedCoordinates.rightBottomPoint

			// Fix to place the polygon always away from the filters box
			// (x0,y0)(x1,y1) -> (x0,y0-(y1-y0)/2)(x1,y1)
			this._leftTopPoint = [
				this._leftTopPoint[0]/* - (this._rightBottomPoint[0] - this._leftTopPoint[0]) / 2*/,
				this._leftTopPoint[1]/* - (this._rightBottomPoint[1] - this._leftTopPoint[1]) / 2*/
			]

			this._center = new Microsoft.Maps.Location(
				(this._leftTopPoint[0] + this._rightBottomPoint[0]) / 2,
				(this._leftTopPoint[1] + this._rightBottomPoint[1]) / 2)

			// Garbage collection
			this.coords = void (0);
			this.isLight = void (0);
			this.generated = true

			if (setLocations) {
				this._polygon.setLocations(joinedCoordinates.locations)
			***REMOVED*** else {
				return joinedCoordinates.locations
			***REMOVED***
		***REMOVED***,

		highlightPolygon: function () {
			this._polygon.setOptions({
				fillColor: this._highlightColor,
				strokeThickness: 2
				// zIndex: 1
				// strokeColor: new Microsoft.Maps.Color(255,255,255,255)
			***REMOVED***)
		***REMOVED***,

		restorePolygon: function () {
			this._polygon.setOptions({
				fillColor: this._fillColor,
				strokeThickness: 1
				// zIndex: 1
				// strokeColor: this._strokeColor
			***REMOVED***)
		***REMOVED***,

		getCoordinates: function () {
			// Fix to place the polygon always away from the filters box
			// (x0,y0)(x1,y1) -> (x0,y0-(y1-y0)/2)(x1,y1)
			if (!this.generated) this.generatePolygon(this.coords, this.isLight)

			return [
				new Microsoft.Maps.Location(
					this._leftTopPoint[0],
					this._leftTopPoint[1] - (this._rightBottomPoint[1] - this._leftTopPoint[1]) / 2
				),
				new Microsoft.Maps.Location(this._rightBottomPoint[0], this._rightBottomPoint[1])
			]
		***REMOVED***,

		setCoordinates: function (leftTopPoint, rightBottomPoint) {
			this._leftTopPoint = leftTopPoint
			this._rightBottomPoint = rightBottomPoint
		***REMOVED***,

		hide: function () {
			this._polygon.setOptions({
				visible: false
			***REMOVED***)
			this._infobox.hide()
		***REMOVED***,

		show: function () {
			this._polygon.setOptions({
				visible: true
			***REMOVED***)
		***REMOVED***,

		getPolygon: function () {
			this.generatePolygon()
			return this._polygon
		***REMOVED***,

		getInfobox: function () {
			return this._infobox
		***REMOVED***,

		createInfobox: function () {

			this._infobox = new Infobox('info', this._map, this, this.config.content)
			this._polygon.setOptions({
				infobox: this._infobox
			***REMOVED***)
			return this._infobox
		***REMOVED***,

		updateInfobox: function (obj, type) {
			//console.error(type)
			//debugger;
			//updateInfobox
			this._infobox.updateContent(obj, type)
			return this._infobox
		***REMOVED***,

		panIntoView: function () {
			this._map.MapView.zoomToTerritory(this)
		***REMOVED***,

		updateColor: function (color) {
			this._fillColor = this._strokeColor = rgbaToMSColor(color)
			this._polygon.setOptions({
				fillColor: this._fillColor/*,
				strokeColor: this._strokeColor*/
			***REMOVED***)
		***REMOVED***,

		select: function () {
			this.fireEvent('selected', this.id, this.type)
		***REMOVED***
	***REMOVED***)

	Polygon.baseRGB = '200, 187, 137'
	Polygon.strokeRGB = '180, 160, 125'


	//::: Utilities :::

	/**
	 * Joins a group of coordinates in Bing Maps
	 * format
	 *
	 * @param  {Array***REMOVED***	coords		in JSON format
	 * @param  {Array***REMOVED***	[leftTopPoint]
	 * @param  {Array***REMOVED***	[rightBottomPoint]
	 * @return {Object***REMOVED***
	 *         {Array***REMOVED***	locations	coords in Microsoft.Maps.Location format
	 *         {Array***REMOVED***	leftTopPoint
	 *         {Arrya***REMOVED***	rightBottomPoint
	 */
	function joinCoordinates(coords, isLight) {
		var i, j,
			locations = [],
			leftTopPoint, rightBottomPoint,
			max

		if (!isLight) {
			leftTopPoint = [coords[0][0][1], coords[0][0][0]]
			rightBottomPoint = leftTopPoint
			max = Math.min(coords[0].length) // testing to limit polygons size
			for (i = 0; i < max; i++) {
				locations[i] = new Microsoft.Maps.Location(coords[0][i][1], coords[0][i][0])
				leftTopPoint = [Math.min(leftTopPoint[0], coords[0][i][1]), Math.min(leftTopPoint[1], coords[0][i][0])]
				rightBottomPoint = [Math.max(rightBottomPoint[0], coords[0][i][1]), Math.max(rightBottomPoint[1], coords[0][i][0])]
			***REMOVED***
		***REMOVED*** else {
			leftTopPoint = [coords[1], coords[0]]
			rightBottomPoint = leftTopPoint
			max = Math.min(coords.length) // testing to limit polygons size

			for (i = 0, j = 0; i < max; i += 2, j++) {
				locations[j] = new Microsoft.Maps.Location(coords[i + 1], coords[i])
				leftTopPoint = [Math.min(leftTopPoint[0], coords[i + 1]), Math.min(leftTopPoint[1], coords[i])]
				rightBottomPoint = [Math.max(rightBottomPoint[0], coords[i + 1]), Math.max(rightBottomPoint[1], coords[i])]
			***REMOVED***
		***REMOVED***

		return {
			locations: locations,
			leftTopPoint: leftTopPoint,
			rightBottomPoint: rightBottomPoint
		***REMOVED***
	***REMOVED***

	/**
	 * Turns an rgba color string into a MS Color
	 *
	 * @param  {String***REMOVED*** color			rgba color
	 * @return {Microsoft.Maps.Color***REMOVED***   Microsoft Bing Maps Color
	 */
	function rgbaToMSColor(color) {
		var colorArray = color.match(/\d+(?:\.\d+)?/g)
		return new Microsoft.Maps.Color(~~(colorArray[3] * 255), colorArray[0], colorArray[1], colorArray[2])
	***REMOVED***

	return Polygon
***REMOVED***);
/*global define, Microsoft, Raphael*/
define('app/map/Pushpin', ['./Infobox'/*, 'app/utils/allColors'*/], function (Infobox) {

	var colorsAssignation = {***REMOVED***,
		indexAssignation = 0,
		isIE8 = jQuery.browser.msie && jQuery.browser.version.match(/^8/)
		// isIE10 = jQuery.browser.msie && jQuery.browser.version.match(/^10/),
		// isSafari = jQuery.browser.safari
		, resourcesColors = {
			municipio: '#F8921C',
			departamento: '#29ADEE',
			region: '#EC008E'
		***REMOVED***

	function panIntoView() {
		var coords = this.getLocation()
		if (this._map) this._map.setView({ center: coords, zoom: 20 ***REMOVED***)
	***REMOVED***

	function testCSS(prop) {
		return prop in document.documentElement.style;
	***REMOVED***

	function PushpinTimed(properties, bingMap, MapView) {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(this.Pushpin.bind(this), 100)
	***REMOVED***

	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds) {
				break;
			***REMOVED***
		***REMOVED***
	***REMOVED***

	//sleep(13000);
	function Pushpin(properties, bingMap, MapView) {
		var rootElem = document.createElement('div'),
			paper,
			width,
			x, y,
			htmlContent, radius,
			number = properties.count || 1,
			pushpin,
			textPosY,
			color

		sleep(50)
		pushpin = new Microsoft.Maps.Pushpin(properties, {
			//htmlContent: htmlContent,
			color: '#E14C21',
			zIndex: 99,
			anchor: new Microsoft.Maps.Point(x, y)
		***REMOVED***)

		pushpin.map = bingMap

		if (properties.isResource) {
			pushpin._infobox = new Infobox('resource', bingMap, pushpin, properties)
		***REMOVED*** else if (properties.isProduction) {
			pushpin._infobox = new Infobox('production', bingMap, pushpin, properties)
		***REMOVED*** else if (properties.isFiscalization) {
			pushpin._infobox = new Infobox('fiscalization', bingMap, pushpin, properties)
		***REMOVED*** else if (properties.type == 'project') {
			pushpin._infobox = new Infobox(properties.type, bingMap, pushpin, properties)
		***REMOVED*** else {
			// If group in same place
			// Back misspelling ¬¬
			if (properties.usanMismaGeorefenciacion) {
				pushpin._infobox = new Infobox(properties.type, bingMap, pushpin, properties)
			***REMOVED*** else {
				//or simply a group to zoom
				Microsoft.Maps.Events.addHandler(pushpin, 'click', function () {
					bingMap.setView({
						zoom: bingMap.getZoom() + 2,
						center: pushpin.getLocation()
					***REMOVED***)
				***REMOVED***)
			***REMOVED***
		***REMOVED***

		if (properties.url) {
			pushpin.panIntoView = panIntoView
		***REMOVED***

		pushpin.radius = radius

		pushpin.viewGroupList = function (dataGroup) {
			MapView.viewGroupList(dataGroup)
		***REMOVED***

		return pushpin
	***REMOVED***

	return Pushpin
***REMOVED***);
/*global define, ko, doT*/
define('app/map/ListView', ['app/controller/AppState'], function (AppState) {

	function ListView() {
		this.root = $('#projects-list-view')
		this.projects = ko.observableArray([])

		AppState.on('projects-list-loaded', this.projectsListLoaded.bind(this))
		AppState.on('loading-projects-list', this.onLoading.bind(this))
		this.root.find('.pagination').on('click', 'a', this.loadPage.bind(this))
		this.root.find('.back').on('click', this.toMapMode)
		this.pages = ko.observableArray([])
		this.actual = 0
		this.loading = ko.observable(true)
	***REMOVED***


	ListView.prototype.onLoading = function () {
		this.loading(true)
		this.projects([])
		this.root.find('.pagination').html('')
		//$('html, body').animate({ scrollTop: 0 ***REMOVED***, 200)
	***REMOVED***

	ListView.prototype.pageNumberTempl = doT.compile('<a href="#" class="{{? it.active***REMOVED******REMOVED***active{{?***REMOVED******REMOVED***" data-page="{{=it.page***REMOVED******REMOVED***">{{=it.page***REMOVED******REMOVED***</a>')

	ListView.prototype.projectsListLoaded = function (data) {
		data.objects = data.objects || []

		$.each(data.objects, function (e, k) {
			var items = ["Regional", "Departamental", "Municipal"],
				item = items[Math.floor(Math.random() * items.length)];
			k.finalization = item;
		***REMOVED***)


		this.projects(data.objects)
		//data.page_number
		//data.total_pages
		this.pages([])
		this.drawPages(+ data['pageNumber'], + data['totalPages'])
		//$('html, body').animate({
		//	scrollTop: $('#controls').offset().top
		//***REMOVED***, 300);
		this.loading(false)
	***REMOVED***

	ListView.prototype.loadPage = function (e) {
		this.loading(true)
		AppState.setPage(e.target.getAttribute('data-page'))
		return false
	***REMOVED***

	ListView.prototype.toMapMode = function () {
		AppState.setListMode(false)
		return false
	***REMOVED***

	ListView.prototype.drawPages = function (actual, total) {
		var pagesHTML = '',
			i,
			SOMA1 = 15,
			SOMA2 = 5

		this.actual = actual

		if (actual > 1) {
			pagesHTML += '<a class="prev" href="#" data-page="' +
				(actual - 1) + '">&lt;</a>'
		***REMOVED***
		if (total < SOMA1) {
			for (i = 1; i <= total; i++) {
				pagesHTML += this.pageNumberTempl({ page: i, active: i == actual ***REMOVED***)
			***REMOVED***
		***REMOVED*** else {
			for (i = 1; i < SOMA2; i++) {
				pagesHTML += this.pageNumberTempl({ page: i, active: i == actual ***REMOVED***)
			***REMOVED***
			if (actual > SOMA2 + 1 && actual < total - SOMA2) {
				pagesHTML += '...'
				pagesHTML += this.pageNumberTempl({ page: actual - 1, active: i == actual ***REMOVED***)
				pagesHTML += this.pageNumberTempl({ page: actual, active: true ***REMOVED***)
				pagesHTML += this.pageNumberTempl({ page: actual + 1, active: i == actual ***REMOVED***)
				pagesHTML += '...'
			***REMOVED*** else {
				if (actual < total - SOMA2) {
					for (i = SOMA2; i <= SOMA2 + 2; i++) {
						pagesHTML += this.pageNumberTempl({ page: i, active: i == actual ***REMOVED***)
					***REMOVED***
					pagesHTML += '...'
				***REMOVED*** else {
					pagesHTML += '...'
					for (i = total - 7; i <= total - SOMA2 + 1; i++) {
						pagesHTML += this.pageNumberTempl({ page: i, active: i == actual ***REMOVED***)
					***REMOVED***

				***REMOVED***
			***REMOVED***
			for (i = total - SOMA2 + 2; i <= total; i++) {
				pagesHTML += this.pageNumberTempl({ page: i, active: i == actual ***REMOVED***)
			***REMOVED***
		***REMOVED***

		if (actual < total) {
			pagesHTML += '<a class="next" href="#" data-page="' +
				(actual + 1) + '">&gt;</a>'
		***REMOVED***

		this.root.find('.pagination').html(pagesHTML)
	***REMOVED***

	var lv = new ListView()
	ko.applyBindings(lv, lv.root[0])
***REMOVED***);
/*global Microsoft, $, define, ko*/

//require(['http://www.bing.com/api/maps/mapcontrol']);
define('app/map/Map', ['lib/mvc/Observable',
	'./Polygon',
	'./Pushpin',
	'app/network/Services',
	'app/controller/AppState',
	'./ListView'
],
	function (
		Observable,
		Polygon,
		Pushpin,
		Services,
		AppState
	) {
		'use strict';

		function Map() {

			window.loadMap = function () {
				createMap();
			***REMOVED***

			function createMap() {

				var mapDiv = document.getElementById('map-div');
				if (mapDiv) {
					themesModuleLoaded();
				***REMOVED***
			***REMOVED***


			var map, // Bing Map
				polygons = {
					regions: null,
					departments: null,
					municipalities: null
				***REMOVED***,
				polygonsMap = {***REMOVED***,
				polygonsInfoData = {
					departments: JSON.parse(document.body.getAttribute('data-deparmentProjectData')),
					regions: JSON.parse(document.body.getAttribute('data-regionProjectData'))
				***REMOVED***,
				infoboxes = {
					regions: null,
					departments: null,
					municipalities: null
				***REMOVED***,
				// Center of Colombia
				//center = new Microsoft.Maps.Location(14.75110258191421,-86.7590020491403),
				// zoom to show plygons
				// departments and regions zoom
				defaultZoom = 8,
				// Maps view mode
				viewMode,
				// Actual map zoom
				actualZoom = 5,
				// Actual map center
				actualCenter,
				// Rendered Mode flag
				renderedMode,
				// Pushpins
				pushpins = [],
				// PushpinsWrapper
				pushpinsContainer,
				// ko this
				self = this,
				// Never redraw polygons until end of zooming
				timeoutPolygonsRedraw,
				// loading spinner
				loader = $('<div>', { 'class': 'loader' ***REMOVED***).appendTo($('#map-div')[0]),
				loaderQueries = [],
				firstTime = true,
				// Flag to know when we are pending of loading a response
				// callResourcesInProgress = false,
				// Async Flag for Drawing Pending States When no Polygons Where Available
				pendingStateChange = {***REMOVED***

			document.body.removeAttribute('data-deparmentProjectData')
			document.body.removeAttribute('data-regionProjectData')

			// Fix for Chrome
			scrollTo(0, 0);
			window.onload = function () {
				scrollTo(0, 0);
			***REMOVED***


			// Actual vizualization mode [Region,Department,Municipality]
			self.actualVisualization = ko.observable('Department')
			viewMode = self.actualVisualization()

			//::: Bing Maps Notifications :::

			self.showSpinner = function (cancel) {
				if (cancel !== false) {
					loaderQueries.push(1)
				***REMOVED***
				if (cancel === false && loaderQueries.length < 2) {
					loader.fadeOut()
					loaderQueries = []
				***REMOVED*** else if (cancel === false) {
					loaderQueries.pop()
				***REMOVED*** else {
					loader.fadeIn()
				***REMOVED***
			***REMOVED***

			self.hideSpinner = function () {
				if (loaderQueries.length < 2) {
					loader.fadeOut()
					// .spin(false)
					loaderQueries = []
				***REMOVED*** else {
					loaderQueries.pop()
				***REMOVED***
			***REMOVED***

			self.getCorners = function () {
				var nw, se,
					bounds = map.getBounds()

				nw = bounds.getNorthwest()
				se = bounds.getSoutheast()

				return [
					[nw.latitude, nw.longitude],
					[se.latitude, se.longitude]
				]
			***REMOVED***

			self.zoomToColombia = function () {
				if (map) {
					map.setView({ center: new Microsoft.Maps.Location(14.75110258191421, -86.7590020491403), zoom: defaultZoom ***REMOVED***);

				***REMOVED***
			***REMOVED***

			AppState.on('projects-loaded', stateChange.bind(self))
			AppState.on('projects-loaded', self.hideSpinner.bind(self))
			AppState.on('resources-loaded', stateChangeRes.bind(self))
			AppState.on('production-loaded', stateChangeProd.bind(self))
			AppState.on('fiscalization-loaded', stateChangeFisc.bind(self))
			AppState.on('loading-projects', self.showSpinner.bind(self))
			AppState.on('load-projects-aborded', self.hideSpinner.bind(self))
			AppState.on('map-changed', panTo)
			AppState.on('redraw-all', redrawPolygons)
			AppState.on('state-change', function (state) {
				//debugger;
				$('.map-container')
					.removeClass('proyectos-mode')
					.removeClass('recursos-mode')
					.removeClass('produccion-mode')
					.removeClass('fiscalizacion-mode')
					.addClass(state.toLowerCase() + '-mode')
			***REMOVED***)
			// AppState.on('state-change', self.zoomToColombia.bind(self))

			$('#filter-results button').click(function () {
				changeToListMode();
				$("#map-view").removeClass('d-none d-sm-block');
			***REMOVED***)

			$('#btnTabVerListado').click(function () {
				changeToListMode();
				$(".projects-list-view-inner .back").hide();
				$('#map-view').hide()
				$('#projects-list-view').show()
			***REMOVED***)

			$('#btnTabFiltrosMobile').click(function () {
				$("#map-view").removeClass('d-none d-sm-block');
				$(".back").trigger("click");
				$('#map-view').show();

			***REMOVED***)

			$('#btnCerrarListado,#btnCerrarListadoAux').click(function () {
				$(".back").trigger("click");
				$("#map-view").hide();

			***REMOVED***)

			$('#btnCerrarFiltros,#btnAplicarFiltroMobile').click(function () {
				$('#map-view').hide();

			***REMOVED***)

			/**
			 * Callback for when the Themes Module is loaded
			 */
			function isLoaded() {
				return typeof (Microsoft) != 'undefined'
					&& typeof (Microsoft.Maps) != 'undefined'
					&& typeof (Microsoft.Maps.Map) != 'undefined'
			***REMOVED***

			function themesModuleLoaded() {
				var targetBounds
				scrollTo(0, 0);

				if (isLoaded) {
					map = new Microsoft.Maps.Map(
						document.getElementById('map-div'),
						{
							credentials: 'Apwt9Qe5hfw-HjZ-yMqofEVWtwyAdIfAvFg6B-pmoa_7zI08a0EAx5vwjT5miN0M',
							zoom: defaultZoom,
							showMapTypeSelector: false,
							showLocateMeButton: false,
							disableScrollWheelZoom: true,
							center: new Microsoft.Maps.Location(14.75110258191421, -86.7590020491403),
							enableSearchLogo: false,
							enableClickableLogo: false,
							mapTypeId: Microsoft.Maps.MapTypeId.road,
							useInertia: false
						***REMOVED***)

					scrollTo(0, 0);

					map.MapView = self
					//Map initialization
					//Blocks mousewheel events
					Microsoft.Maps.Events.addHandler(map, 'mousewheel', function (e) {
						e.handled = true;
						return true;
					***REMOVED***);
					Microsoft.Maps.Events.addHandler(map, 'click', function () {
						self.fireEvent('click', map)
					***REMOVED***)
					Microsoft.Maps.Events.addThrottledHandler(map, 'viewchangeend', checkZoomChange, 600)

					//Deffer loading of all the plygons
					Services.polygons.getDepartments(getRedrawHandler('departments'))
					self.showSpinner()
					Services.polygons.getRegions(getRedrawHandler('regions'))
					self.showSpinner()
					Services.polygons.getMunicipalities(getRedrawHandler('municipalities'))

					// checkZoomChange()

					self.ready = true

					pushpinsContainer = new Microsoft.Maps.EntityCollection()
					//scrollTo(0, 0);
				***REMOVED*** else { alert("Falla de carga") ***REMOVED***
			***REMOVED***

			/**
			 * Callback for when the GeoJSON Polygons of the
			 * departments are loaded.
			 * With the data, draws the polygon for every
			 * department.
			 *
			 * @param  {GeoJSON***REMOVED*** data list of polygons
			 */
			function parseGeoJSON(data, polygonsType, isLight) {
				var territory, coords,
					polygon, i, j,
					// Accessing strings
					geometry = isLight ? 'ge' : 'geometry',
					coordinates = isLight ? 'c' : 'coordinates',
					type = isLight ? 't' : 'type',
					properties = isLight ? 'p' : 'properties',
					id = isLight ? 'i' : 'id',
					name = isLight ? 'n' : 'name',
					// max = 0, min = 0,
					isRegion = polygonsType == 'regions',
					polygonsFromMulti

				polygonsMap[polygonsType] = polygonsMap[polygonsType] || {***REMOVED***
				polygons[polygonsType] = new Microsoft.Maps.EntityCollection()
				//infoboxes[polygonsType] = new Microsoft.Maps.EntityCollection()

				polygons[polygonsType].setOptions({
					zIndex: 1
				***REMOVED***)
				//infoboxes[polygonsType].setOptions({
				//	zIndex: 2
				//***REMOVED***)
				pushpinsContainer.setOptions({
					zIndex: 9
				***REMOVED***)

				for (i = 0; i < data.features.length; i++) {
					territory = data.features[i]
					coords = territory[geometry][coordinates]

					if (territory[geometry][type] == 'MultiPolygon') {
						polygonsFromMulti = []
						for (j = 0; j < coords.length; j++) {
							polygon = createPolygon(
								coords[j],
								territory[properties],
								isLight,
								territory[properties][id],
								polygonsType
							)

							if (polygon._leftTopPoint) {
								polygonsFromMulti[j] = polygon

								if (j === 0) {
									polygonsFromMulti.leftTopPoint = polygon._leftTopPoint
									polygonsFromMulti.rightBottomPoint = polygon._rightBottomPoint
								***REMOVED*** else {
									polygonsFromMulti.leftTopPoint = [
										Math.min(polygonsFromMulti.leftTopPoint[0], polygon._leftTopPoint[0]),
										Math.min(polygonsFromMulti.leftTopPoint[1], polygon._leftTopPoint[1])
									]
									polygonsFromMulti.rightBottomPoint = [
										Math.max(polygonsFromMulti.rightBottomPoint[0], polygon._rightBottomPoint[0]),
										Math.max(polygonsFromMulti.rightBottomPoint[1], polygon._rightBottomPoint[1])
									]
								***REMOVED***
							***REMOVED***

							if (isRegion) { // Regions colors... ¬¬
								polygon.updateColor('rgba(' + Polygon.baseRGB + ',' +
									calculateOpacity(i / data.features.length) + ')')
							***REMOVED***
							//TODO Update Polygons and Infoboxes
							polygonsMap[polygonsType][territory[properties][id]] =
								polygonsMap[polygonsType][territory[properties][id]] || []
							polygonsMap[polygonsType][territory[properties][id]].push(polygon)
							// Municipalities polygons are avoer 1100, so they are not
							// asigned to the departments EntityCollection until the
							// very end
							if (polygonsType !== 'municipalities') {
								polygons[polygonsType].push(polygon.getPolygon())
							***REMOVED***
							//infoboxes[polygonsType].push(polygon.getInfobox())
						***REMOVED***
						for (j = 0; j < polygonsFromMulti.length; j++) {
							polygonsFromMulti[j].setCoordinates(polygonsFromMulti.leftTopPoint, polygonsFromMulti.rightBottomPoint)
						***REMOVED***
						// reassign limits
					***REMOVED***
					else {
						polygon = createPolygon(
							coords,
							territory[properties],
							isLight,
							territory[properties][id],
							polygonsType
						)
						if (isRegion) { // Regions colors... ¬¬
							polygon.updateColor('rgba(' + Polygon.baseRGB + ',' +
								(i / data.features.length) + ')')
						***REMOVED***
						//TODO Update Polygons and Infoboxes
						polygonsMap[polygonsType][territory[properties][id]] = polygon
						// Municipalities polygons are avoer 1100, so they are not
						// asigned to the departments EntityCollection until the
						// very end
						if (polygonsType !== 'municipalities') {
							polygons[polygonsType].push(polygon.getPolygon())
						***REMOVED***
						//infoboxes[polygonsType].push(polygon.getInfobox())
					***REMOVED***
				***REMOVED***

				self.fireEvent('polygons-initialized', polygonsType)

				// Async Manage of Lazzy Polygons Loading
				if (pendingStateChange[polygonsType]) {
					pendingStateChange[polygonsType]()
				***REMOVED***
			***REMOVED***


			//::: Normal Funtions :::
			/**
			 * Adds a polygon and attach the listening to events
			 */
			function createPolygon(coords, content, isLight, id, type) {
				var dataGroup = generateInfoDataAndColor(content),
					polygon = new Polygon(map, {
						coords: coords,
						content: dataGroup.data
					***REMOVED***, isLight, id, type)

				Microsoft.Maps.Events.addHandler(polygon.getPolygon(), 'click', function (polygon) {
					self.fireEvent('click-on-polygon', polygon)
				***REMOVED***)

				polygon.on('selected', function (polygonId, type) {
					self.fireEvent('polygon-selected', polygonId, type)
				***REMOVED***)

				return polygon
			***REMOVED***

			/**
			 * Generates all teh polygon Infobox data
			 * and color with opacity
			 * @param  {Object***REMOVED*** content object data con generate from
			 * @return {Object***REMOVED***         Object with data and color
			 */
			function generateInfoDataAndColor(content, sourceArrayData) {
				var item, i,// max = 0, min,
					data = {
						name: content.name || content.n,
						projectNumber: 0,
						approvedMoney: 0,
						id: content.id || content.i
					***REMOVED***,
					// deltaColor = parseInt(Math.random()*255,10),
					color

				if ((content.type || content.t) == 'departamento') {
					sourceArrayData = sourceArrayData || polygonsInfoData.departments
					// console.log(content.type, item.id, item, data)
					// max  = min = sourceArrayData[0].approvedMoney
					for (i = 0; i < sourceArrayData.length; i++) {
						item = sourceArrayData[i]
						if (item.id === (('id' in content) ? content.id : content.i)) {
							data.approvedMoney = item.approvedMoney
							data.projectNumber = item.projectNumber
							break;
						***REMOVED***
					***REMOVED***
				***REMOVED***
				else if ((content.type || content.t) == 'region') {
					sourceArrayData = sourceArrayData || polygonsInfoData.regions

					for (i = 0; i < sourceArrayData.length; i++) {
						item = sourceArrayData[i]
						if (item.id === (('id' in content) ? content.id : content.i)) {
							data.approvedMoney = item.approvedMoney
							data.projectNumber = item.projectNumber
							break;
						***REMOVED***
					***REMOVED***
				***REMOVED***
				else if (sourceArrayData) {
					if (sourceArrayData[0]) for (i = sourceArrayData.length; i--;) {
						item = sourceArrayData[i]
						if (item.id === (('id' in content) ? content.id : content.i)) {
							data.approvedMoney = item.approvedMoney
							data.projectNumber = item.projectNumber
							break;
						***REMOVED***
					***REMOVED***
				***REMOVED***

				return {
					data: data,
					color: color
				***REMOVED***
			***REMOVED***


			/**
			 * Center the map into the corners
			 *
			 * @param  {Object***REMOVED***		view options as Bing Maps
			 *                      may receives
			 */
			function panTo(view) {
				var targetBounds

				if (self.ready) {
					if (view.center) {
						view.center = new Microsoft.Maps.Location(view.center[0], view.center[1])
					***REMOVED*** else {
						view.bounds = Microsoft.Maps.LocationRect.fromCorners(view.leftTop, view.rightBottom)
					***REMOVED***

					// console.log(JSON.stringify(view))

					if (view.zoom) {
						view.zoom = +view.zoom || 9
					***REMOVED***

					if (map) {
						map.setView(view)
					***REMOVED***
				***REMOVED*** else {
					self.on('ready', function () {
						panTo(view)
					***REMOVED***)
				***REMOVED***
			***REMOVED***

			/**
			 * Function listenning to the map changes
			 * and checking zoom changes to redraw actions
			 */
			function checkZoomChange() {
				var center = map.getCenter(),
					centerStr = center.latitude + ' ' + center.longitude,
					corners = self.getCorners(),
					zoom = map.getZoom()

				// Bing calls viewChange on start

				if ((zoom % 1 === 0 &&
					actualZoom != zoom) ||
					actualCenter !== centerStr
				) {
					actualZoom = zoom
					actualCenter = centerStr
					AppState.setZoomAndCorners({
						zoom: zoom,
						corners: corners,
						center: [center.latitude, center.longitude]
					***REMOVED***)
					redrawPolygons()
				***REMOVED***
			***REMOVED***

			/**
			 * Returns a dynamic function loader for the
			 * specific polygon type
			 * @param  {String***REMOVED*** polygonsType key from array in the polygons object
			 *                               to populate
			 * @return {Function***REMOVED***              callback function generated
			 */
			function getRedrawHandler(polygonsType) {
				return function (geoJSON) {
					//TODO extend the array data
					parseGeoJSON(geoJSON, polygonsType, !geoJSON.type)
					redrawPolygons()

					// if( !polygonsType.match('municip') )
					self.showSpinner(false)
				***REMOVED***
			***REMOVED***

			function normalizeResourceObject(obj) {
				var nObj,
					i, key,
					rObj,
					iRec



				nObj = {***REMOVED***
				nObj.id = obj.IdEntidad
				nObj.type = obj.TipoEntidad
				nObj.name = obj.NombreEntidad || obj.name
				nObj.typeRes = obj.TipoInfografico || obj.tipo
				nObj.url = obj.Url
				//nObj.TotalFiscalizaciones = obj.TotalFiscalizaciones
				nObj.Tipo = obj.TipoInfografico

				if (obj.latitud) {
					nObj.latitude = obj.latitud
					nObj.longitude = obj.longitud
				***REMOVED***
				if (obj.Latitud) {
					nObj.latitude = obj.Latitud
					nObj.longitude = obj.Longitud
				***REMOVED***
				if (obj.infograficosRecursos) {
					nObj.infoRecursos = obj.infograficosRecursos
					nObj.isResource = true
				***REMOVED***
				if (obj.DetalleAño) {
					nObj.detailYear = obj.DetalleAño
					nObj.isProduction = true
				***REMOVED***

				if (obj.TipoFis) {
					if (obj.TipoFis == "-1") { nObj.TipoFisName = 'Todos' ***REMOVED***
					if (obj.TipoFis == "M") { nObj.TipoFisName = 'Mineral' ***REMOVED***
					if (obj.TipoFis == "H") { nObj.TipoFisName = 'Hidrocarburo' ***REMOVED***
				***REMOVED*** else {
					nObj.TipoFisName = 'false'
				***REMOVED***

				if (obj.Tipo == "F") {


					nObj.TipoFis = obj.TipoFis
					nObj.Total = obj.Total
					nObj.Url = obj.Url
					nObj.detalles = obj.detalles
					nObj.isFiscalization = true
				***REMOVED***
				if (obj.TipoInfografico == "NoCoM") {


					nObj.Tipo = "NoCoM"
					nObj.TipoFis = obj.TipoFis
					nObj.Total = obj.Total
					nObj.Url = obj.Url
					nObj.detalles = obj.detalles
					nObj.isFiscalization = true
				***REMOVED***

				//debugger;

				//console.log('--->nObj', nObj, '--->obj', obj )
				return nObj
			***REMOVED***


			function stateChangeRes(data, data2) {
				// if( callResourcesInProgress ){
				self.hideSpinner()
				// ***REMOVED***
				$.extend(data, data2)
				stateChange(data)
				// callResourcesInProgress = !callResourcesInProgress
			***REMOVED***


			function stateChangeProd(data, data2) {
				// if( callResourcesInProgress ){
				self.hideSpinner()
				// ***REMOVED***
				data.Detalles = data.Detalles || []
				data2.Detalles = data2.Detalles || []
				data.Detalles = data.Detalles.concat(data2.Detalles)
				stateChange(data)
				// callResourcesInProgress = !callResourcesInProgress
			***REMOVED***


			function stateChangeFisc(data, data2) {
				// if( callResourcesInProgress ){
				self.hideSpinner()
				// ***REMOVED***
				data.Detalles = data.Detalles || data.Pines || []
				data2.Detalles = data2.Detalles || data2.Pines || []
				data.detalleFiscalizacion = data.Detalles.concat(data2.Detalles)
				stateChange(data)
				// callResourcesInProgress = !callResourcesInProgress
			***REMOVED***

			/**
			 * Recieves the notification when the map data model
			 * changes, this could bring visualizacion changes,
			 * and pin data changes
			 * @param  {Object***REMOVED*** data JSON reponse from the server
			 */
			function stateChange(data) {
				var obj,
					noPolygonFlag = true,
					type = 'info'

				//debugger;

				function _applyToPolygon(polygon, array, type) {
					if (!polygon) return

					var id = polygon.id,
						obj = array[id]

					//debugger;

					if (obj) {
						// If the object is from resources
						// I transform it
						if (obj.IdEntidad) {
							obj = normalizeResourceObject(obj)
						***REMOVED***
						if (polygon instanceof Polygon) {
							polygon.updateInfobox(obj, type)
						***REMOVED*** else {
							for (j = polygon.length; j--;) {
								polygon[j].updateInfobox(obj, type)
							***REMOVED***
						***REMOVED***
					***REMOVED*** else {
						if (polygon instanceof Polygon) {
							polygon.updateInfobox(objEmpty, type)
						***REMOVED*** else {
							for (j = polygon.length; j--;) {
								polygon[j].updateInfobox(objEmpty, type)
							***REMOVED***
						***REMOVED***
					***REMOVED***
				***REMOVED***

				// NEW VERSION
				// 1. Read all the objects and calculate the max, mins and group

				var arrayMunicipalities = { length: 0 ***REMOVED***,
					arrayDepartments = { length: 0 ***REMOVED***,
					arrayRegions = { length: 0 ***REMOVED***,
					id,
					polygon,
					j, i,
					// Empty stuff
					objEmpty = {
						projectNumber: 0,
						approvedMoney: 0
					***REMOVED***,
					territoryKey,
					// cache hasOwnProperty
					hasProperty = Object.prototype.hasOwnProperty,
					type

				// New strategy: load the polygon list, then
				// the redrawPolygons draw the pins if there
				// are pushpins to draw.

				pushpins = []

				//Projects
				if (data.objects) {
					type = 'info'
					for (i = data.objects.length; i--;) {
						obj = data.objects[i]
						if (obj.type == 'municipio') {
							arrayMunicipalities[obj.id] = obj
							arrayMunicipalities.length += 1
						***REMOVED***
						else if (obj.type == 'departamento') {
							arrayDepartments[obj.id] = obj
							arrayDepartments.length += 1
						***REMOVED***
						else if (obj.type == 'region') {
							arrayRegions[obj.id] = obj
							arrayRegions.length += 1
						***REMOVED*** else {
							// Stored for future draw
							pushpins.push(new Pushpin(obj, map, self))
						***REMOVED***
					***REMOVED***
				***REMOVED***

				// Clear infoboxes in polygons


				// Resources
				if (data.detalleRecursos) {
					type = 'resource'
					for (i = data.detalleRecursos.length; i--;) {
						obj = data.detalleRecursos[i]
						if (obj.TipoEntidad == 'municipio') {
							arrayMunicipalities[obj.IdEntidad] = obj
							arrayMunicipalities.length += 1
						***REMOVED***
						else if (obj.TipoEntidad == 'departamento') {
							arrayDepartments[obj.IdEntidad] = obj
							arrayDepartments.length += 1
						***REMOVED***
						else if (obj.TipoEntidad == 'region') {
							arrayRegions[obj.IdEntidad] = obj
							arrayRegions.length += 1
						***REMOVED***
					***REMOVED***
					if (!data.detalleRecursos.length) {
						// Clean all infoboxes
						// Regions
						for (territoryKey in polygonsMap.regions) {
							if (hasProperty.call(polygonsMap.regions, territoryKey)) {
								polygon = polygonsMap.regions[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
						// Departments
						for (territoryKey in polygonsMap.departments) {
							if (hasProperty.call(polygonsMap.departments, territoryKey)) {
								polygon = polygonsMap.departments[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
						// Municipalities
						for (territoryKey in polygonsMap.municipalities) {
							if (hasProperty.call(polygonsMap.municipalities, territoryKey)) {
								polygon = polygonsMap.municipalities[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
					***REMOVED***
					viewMode = self.actualVisualization()
					noPolygonFlag = false
				***REMOVED***

				// Resources Pushpins
				if (data.pushPinsRecursos) {
					for (i = data.pushPinsRecursos.length; i--;) {
						obj = data.pushPinsRecursos[i]
						obj = normalizeResourceObject(obj)
						// Stored for future draw
						pushpins.push(new Pushpin(obj, map, self))
					***REMOVED***
					// noPolygonFlag = false
					// viewMode = self.actualVisualization()
				***REMOVED***

				// Production
				if (data.Detalles) {
					type = 'production'
					// debugger;
					for (i = data.Detalles.length; i--;) {
						obj = data.Detalles[i]
						if (obj.TipoInfografico == 'G') {
							if (obj.TipoEntidad == 'municipio') {
								arrayMunicipalities[obj.IdEntidad] = obj
								arrayMunicipalities.length += 1
							***REMOVED***
							else if (obj.TipoEntidad == 'departamento') {
								arrayDepartments[obj.IdEntidad] = obj
								arrayDepartments.length += 1
							***REMOVED***
							else if (obj.TipoEntidad == 'region') {
								arrayRegions[obj.IdEntidad] = obj
								arrayRegions.length += 1
							***REMOVED***
						***REMOVED*** else {
							obj = data.Detalles[i]
							obj = normalizeResourceObject(obj)
							// Stored for future draw
							pushpins.push(new Pushpin(obj, map, self))
						***REMOVED***
					***REMOVED***
					if (!data.Detalles.length) {
						// Clean all infoboxes
						// Regions
						for (territoryKey in polygonsMap.regions) {
							if (hasProperty.call(polygonsMap.regions, territoryKey)) {
								polygon = polygonsMap.regions[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
						// Departments
						for (territoryKey in polygonsMap.departments) {
							if (hasProperty.call(polygonsMap.departments, territoryKey)) {
								polygon = polygonsMap.departments[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
						// Municipalities
						for (territoryKey in polygonsMap.municipalities) {
							if (hasProperty.call(polygonsMap.municipalities, territoryKey)) {
								polygon = polygonsMap.municipalities[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
					***REMOVED***
					viewMode = self.actualVisualization()
					noPolygonFlag = false
				***REMOVED***

				// Fiscalizacion Pushpins
				if (data.detalleFiscalizacion) {
					type = 'fiscalization'
					//debugger;
					for (i = data.detalleFiscalizacion.length; i--;) {
						obj = data.detalleFiscalizacion[i]

						if (obj.TipoInfografico == 'G') {
							if (obj.TipoEntidad == 'municipio') {
								arrayMunicipalities[obj.IdEntidad] = obj
								arrayMunicipalities.length += 1
							***REMOVED***
							else if (obj.TipoEntidad == 'departamento') {
								arrayDepartments[obj.IdEntidad] = obj
								arrayDepartments.length += 1
							***REMOVED***
							else if (obj.TipoEntidad == 'region') {
								arrayRegions[obj.IdEntidad] = obj
								arrayRegions.length += 1
							***REMOVED***
						***REMOVED*** else {
							obj = data.detalleFiscalizacion[i]
							obj = normalizeResourceObject(obj)
							// Stored for future draw
							pushpins.push(new Pushpin(obj, map, self))
						***REMOVED***
					***REMOVED***
					if (!data.detalleFiscalizacion.length) {
						// Clean all infoboxes
						// Regions
						for (territoryKey in polygonsMap.regions) {
							if (hasProperty.call(polygonsMap.regions, territoryKey)) {
								polygon = polygonsMap.regions[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
						// Departments
						for (territoryKey in polygonsMap.departments) {
							if (hasProperty.call(polygonsMap.departments, territoryKey)) {
								polygon = polygonsMap.departments[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
						// Municipalities
						for (territoryKey in polygonsMap.municipalities) {
							if (hasProperty.call(polygonsMap.municipalities, territoryKey)) {
								polygon = polygonsMap.municipalities[territoryKey]
								_applyToPolygon(polygon, [], type)
							***REMOVED***
						***REMOVED***
					***REMOVED***
					viewMode = self.actualVisualization()
					noPolygonFlag = false
				***REMOVED***

				// Manage Async Loading of Polygons
				if (arrayDepartments.length || arrayRegions.length) {
					// Departments
					if (polygonsMap.departments && arrayDepartments.length) {
						for (territoryKey in polygonsMap.departments) {
							if (hasProperty.call(polygonsMap.departments, territoryKey)) {
								polygon = polygonsMap.departments[territoryKey]
								if (polygon instanceof Polygon) {
									_applyToPolygon(polygon, arrayDepartments, type)
								***REMOVED*** else {
									for (j = 0; j < polygon.length; j++) {
										_applyToPolygon(polygon[j], arrayDepartments, type)
									***REMOVED***
								***REMOVED***
							***REMOVED***
						***REMOVED***
					***REMOVED*** else if (arrayDepartments.length) {
						// If no polygons... manage flag to call this funcion again!!!
						pendingStateChange = {
							departments: function () {
								stateChange(data)
							***REMOVED***
						***REMOVED***
					***REMOVED***
					// Regions
					if (polygonsMap.regions && arrayRegions.length) {
						for (territoryKey in polygonsMap.regions) {
							if (hasProperty.call(polygonsMap.regions, territoryKey)) {
								polygon = polygonsMap.regions[territoryKey]
								id = polygon.id
								obj = arrayRegions[id]

								if (polygon instanceof Polygon) {
									_applyToPolygon(polygon, arrayRegions, type)
								***REMOVED*** else {
									for (j = 0; j < polygon.length; j++) {
										_applyToPolygon(polygon[j], arrayRegions, type)
									***REMOVED***
								***REMOVED***
							***REMOVED***
						***REMOVED***
					***REMOVED*** else if (arrayRegions.length) {
						// If no polygons... manage flag to call this funcion again!!!
						pendingStateChange = {
							regions: function () {
								stateChange(data)
							***REMOVED***
						***REMOVED***
					***REMOVED***
					viewMode = self.actualVisualization()
					noPolygonFlag = false
				***REMOVED***

				// Municipalities
				if (arrayMunicipalities.length && polygons.municipalities) {
					// Tricky now I have to paint only the municipalities that are
					// passed in the response
					polygons.municipalities.clear()
					if (polygonsMap.municipalities && arrayMunicipalities.length) {
						for (territoryKey in arrayMunicipalities) {
							if (hasProperty.call(arrayMunicipalities, territoryKey)) {
								polygon = polygonsMap.municipalities[territoryKey]
								if (polygon instanceof Polygon) {
									polygon.generatePolygon()
									polygons.municipalities.push(polygon.getPolygon())
									_applyToPolygon(polygon, arrayMunicipalities, type)
								***REMOVED*** else if (polygon instanceof Array) { // length is own property :/
									for (j = 0; j < polygon.length; j++) {
										polygon[j].generatePolygon()
										polygons.municipalities.push(polygon[j].getPolygon())
										_applyToPolygon(polygon[j], arrayMunicipalities, type)
									***REMOVED***
								***REMOVED***
							***REMOVED***
						***REMOVED***
					***REMOVED***

					viewMode = 'Municipality'
					noPolygonFlag = false

				***REMOVED*** else if (arrayMunicipalities.length) {
					// If no polygons... manage flag to call this funcion again!!!
					pendingStateChange = {
						municipalities: function () {
							stateChange(data)
						***REMOVED***
					***REMOVED***
				***REMOVED***

				$('#filter-results .value').html(data.totalProjectsNumber)
				$("#tabCantProyList").html("(" + data.totalProjectsNumber + ")")

				if (noPolygonFlag) viewMode = ''

				redrawPolygons()
			***REMOVED***

			/**
			 * This function manages the logic of
			 * the zooming
			 */
			function redrawPolygons() {
				var i

				clearTimeout(timeoutPolygonsRedraw)
				timeoutPolygonsRedraw = setTimeout(function () {

					var cleared
					if (viewMode == 'Department' || viewMode == 'Region') {
						//Check if the region polygons are already on the map
						if ((renderedMode != 'Region' && renderedMode != 'Department') ||
							self.actualVisualization() != renderedMode) {
							//Then check if we already have the regions polygons
							//they are being loading by defer loading and
							//will be drawed later
							// debugger;
							if (self.actualVisualization() == 'Region' &&
								polygons.regions) {
								renderedMode = self.actualVisualization()
								map.entities.clear()
								cleared = true
								map.entities.push(polygons.regions)
								//map.entities.push(infoboxes.regions)
							***REMOVED***
							if (self.actualVisualization() == 'Department' &&
								polygons.departments) {
								renderedMode = self.actualVisualization()
								map.entities.clear()
								cleared = true
								map.entities.push(polygons.departments)
								//map.entities.push(infoboxes.departments)
							***REMOVED***
						***REMOVED***
					***REMOVED***
					//At the end municipalities
					else if (viewMode == 'Municipality') {
						if (renderedMode != 'Municipality' &&
							polygons.municipalities) {
							renderedMode = 'Municipality'
							map.entities.clear()
							cleared = true
							map.entities.push(polygons.municipalities)
							//map.entities.push(infoboxes.municipalities)
						***REMOVED***
					***REMOVED***
					//No polygons in these levels of zoom
					else {
						renderedMode = ''
					***REMOVED***

					AppState.fireEvent('Polygons-loaded')


					if (pushpinsContainer) {
						pushpinsContainer.clear()
					***REMOVED***

					// debugger;
					var info
					for (i = pushpins.length; i--;) {
						info = pushpins[i]._infobox && pushpins[i]._infobox._content
						// Maybe this doesn't go any more
						if (info && (info.isProduction || info.isFiscalization)) {
							if (info.type == 'departamento' ||
								info.type == 'region') {
								if (info.type == 'departamento' &&
									self.actualVisualization() == 'Department') {
									pushpinsContainer.push(pushpins[i])
								***REMOVED*** else if (info.type == 'region' &&
									self.actualVisualization() == 'Region') {
									pushpinsContainer.push(pushpins[i])
								***REMOVED***
							***REMOVED*** else {
								pushpinsContainer.push(pushpins[i])
							***REMOVED***
						***REMOVED*** else {
							pushpinsContainer.push(pushpins[i])
						***REMOVED***
					***REMOVED***

					if (!firstTime) {
						map.entities.remove(pushpinsContainer)
					***REMOVED***

					if (map) {
						map.entities.push(pushpinsContainer)
					***REMOVED***
					firstTime = false
				***REMOVED***, 100)
			***REMOVED***

			function changeToListMode() {

				AppState.setListMode(true)
			***REMOVED***

			//::: Initialization :::

			// Not necessary ¬¬
			// Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', { callback: themesModuleLoaded ***REMOVED***);
			//themesModuleLoaded()

			//::: Legend :::
			; (function initLegend() {
				function drawCircle(color, selector) {
					var paper = Raphael($(selector)[0], 12, 12)
					paper.circle(6, 6, Math.round(5)).attr({
						fill: color,
						stroke: color
					***REMOVED***)
					paper.circle(6, 6, Math.round(4)).attr({
						fill: color,
						stroke: '#fff',
						'stroke-width': 1
					***REMOVED***)
				***REMOVED***
				// drawCircle('#EC008E', '.legend-resources_type-region')
				drawCircle('#29ADEE', '.legend-resources_type-department')
				drawCircle('#F8921C', '.legend-resources_type-municipality')
			***REMOVED***());

			// Knockout Bindings And Observables
			self.isRegion = ko.computed(function () {
				return self.actualVisualization() == 'Region'
			***REMOVED***, self.actualVisualization)

			self.toggleMode = function (data, evt) {
				var array, max = 0, min = 0, i, territory

				self.fireEvent('changing-view-mode')
				self.hideInfoboxes()
				self.actualVisualization(
					self.actualVisualization() == 'Region' ?
						'Department' : 'Region'
				)

				self.hideInfoboxes()
				redrawPolygons()

				if (self.actualVisualization() == 'Department') {
					array = polygonsInfoData.departments
				***REMOVED*** else {
					array = polygonsInfoData.regions
				***REMOVED***
				for (i = 0; i < array.length; i++) {
					territory = array[i]
					max = Math.max(max, territory.approvedMoney)
					// min = Math.min(min, territory.approvedMoney)
				***REMOVED***
			***REMOVED***
			//ko.applyBindings(self, $('#map-view-options .change-view-mode')[0])
			// ko.applyBindings(self, $('#map-legend')[0])

			this.zoomToTerritory = function (type, options) {
				var polygons,
					leftTopPoint, rightBottomPoint, groupPoints,
					locationRect,
					firstPolygon,
					polygonGroup,
					corners,
					targetBounds
				if (type instanceof Polygon) {
					firstPolygon = type
				***REMOVED*** else {
					if (!options.length) return;
					if (type == 'municipio') polygons = polygonsMap.municipalities
					else if (type == 'departamento') polygons = polygonsMap.departments
					else polygons = polygonsMap.regions

					//NOTE zoom to territory must be call when all polygons are loaded!!!
					if (!polygons) {
						this.on('polygons-initialized', function (typeLoaded) {
							if (typeLoaded == type) {
								self.zoomToTerritory(type, options)
							***REMOVED***
						***REMOVED***)
						return
					***REMOVED***
					firstPolygon = polygons[options[0].value]

					if (!firstPolygon) return

					if (firstPolygon instanceof Array) {
						firstPolygon = firstPolygon[0]
					***REMOVED***
				***REMOVED***


				groupPoints = firstPolygon.getCoordinates()

				if (options) {
					for (var i = 1; i < options.length; i++) {
						firstPolygon = polygons[options[i].value]
						corners = firstPolygon.getCoordinates()

						if (firstPolygon instanceof Array) {
							firstPolygon = firstPolygon[0]
						***REMOVED***

						groupPoints = [
							{
								latitude: Math.min(corners[0].latitude, groupPoints[0].latitude),
								longitude: Math.min(corners[0].longitude, groupPoints[0].longitude)
							***REMOVED***,
							{
								latitude: Math.max(corners[1].latitude, groupPoints[1].latitude),
								longitude: Math.max(corners[1].longitude, groupPoints[1].longitude)
							***REMOVED***
						]
					***REMOVED***
				***REMOVED***

				locationRect = new Microsoft.Maps.LocationRect.fromCorners(
					new Microsoft.Maps.Location(groupPoints[0].latitude, groupPoints[0].longitude),
					new Microsoft.Maps.Location(groupPoints[1].latitude, groupPoints[1].longitude))

				// console.log(zoomLevel)
				if (groupPoints[0].latitude && groupPoints[0].longitude && groupPoints[1].latitude && groupPoints[1].longitude) {
					// console.log('setview',locationRect)
					if (map) {
						map.setView({ bounds: locationRect ***REMOVED***)
					***REMOVED***
				***REMOVED*** else {
					if (console && console.error && typeof console.error == 'function') {
						console.error('Territory without bounds', [groupPoints[0].latitude, groupPoints[0].latitude], [groupPoints[1][0], groupPoints[1].longitude])
					***REMOVED***
				***REMOVED***

				// Show Infobox for Municipalities
				//if( type == 'municipio' ){

				//	setTimeout(function(){
				//		var dummyEvent = {***REMOVED***
				//		dummyEvent.originalEvent = {***REMOVED***
				//		dummyEvent.pageX =
				//			dummyEvent.originalEvent.x =
				//				$(window).width()/2
				//		dummyEvent.pageY =
				//			dummyEvent.originalEvent.y =
				//				$('#map-div').height()/2 + $('#header').height()
				//		firstPolygon.getInfobox().show( dummyEvent )
				//	***REMOVED***, 2000)
				//***REMOVED***
				// AppState.setCorners()
				//console.log(2)
			***REMOVED***

			this.hideInfoboxes = function () {

				$(".bingmap-infobox-info").css('display', 'none');
				var set, key, i, info

				for (key in infoboxes) {
					if (infoboxes.hasOwnProperty(key)) {
						set = infoboxes[key]
						if (set) {
							for (i = set.getLength(); i--;) {
								set.get(i).hide()
							***REMOVED***
						***REMOVED***
					***REMOVED***
				***REMOVED***

				for (i = 0; i < pushpins.length; i++) {
					info = pushpins[i]._infobox
					if (info) {
						info.hide()
					***REMOVED***
				***REMOVED***
			***REMOVED***

			this.panTo = panTo

			this.viewGroupList = function (dataGroup) {
				AppState.setZoomAndCorners(
					{
						corners: [
							[dataGroup.latitude, dataGroup.longitude],
							[dataGroup.latitude, dataGroup.longitude]
						],
						center: [dataGroup.latitude, dataGroup.longitude]
					***REMOVED***,
					{
						isGroupList: true
					***REMOVED***
				)
			***REMOVED***

			// Post-definition listeners
			AppState.on('projects-list-loaded', this.hideInfoboxes.bind(this))
		***REMOVED***

		Map.prototype = new Observable()


		function calculateOpacity(centimal) {
			return (0.15 + 0.5 * centimal).toFixed(2)
		***REMOVED***

		return new Map()
	***REMOVED***);
/*global define*/
define('app/utils/allColors', [], function () {
	return [
		'#6dcff6',
		'#00bff3',
		'#00adef',
		'#0077a2',
		'#00746b',
		'#01a89e',
		'#1cbcb4',
		'#7accc8',
		'#82ca9c',
		'#3cb879',
		'#00a652',
		'#197b30',
		'#598526',
		'#8ec63f',
		'#c4df9c',
		'#fff568',
		'#fef200',
		'#aca000',
		'#f7941d',
		'#fbae5c',
		'#f36523',
		'#f25103',
		'#f2361d',
		'#f24257',
		'#ee1475',
		'#a72c7d',
		'#662e91',
		'#2e3192',
		'#014a81',
		'#458ccc',
		'#014a81',
		'#2e3192',
		'#662e91',
		'#a72c7d',
		'#ee1475',
		'#f24257',
		'#f2361d',
		'#f25103',
		'#f36523',
		'#fbae5c',
		'#f7941d',
		'#aca000',
		'#fef200',
		'#fff568',
		'#c4df9c',
		'#8ec63f',
		'#598526',
		'#197b30',
		'#00a652',
		'#3cb879',
		'#82ca9c',
		'#7accc8',
		'#1cbcb4',
		'#01a89e',
		'#00746b',
		'#0077a2',
		'#00adef',
		'#00bff3',
		'#6dcff6'
	]
***REMOVED***);
/*global Raphael, define*/
define('app/grapher/Grapher', ['app/utils/allColors'], function (allColors) {
	var sectorColors = allColors,
		regionsColors = [
			'#FBA74D',
			'#2280A2',
			'#3BB778',
			'#1CC1B3',
			'#8EC63F',
			'#fff568',
			'#f36523'
		]

	function drawSemiPie(elem, radius, data, labels, colors, noCurrency) {
		var r = Raphael(elem, radius * 2.2, radius * 2.2),
			pie, dataNumber = [], i,
			dataLabel = [],
			opts = {
				startFromFixedAngle: 90,
				labels: labels,
				minPercent: 0.00001
			***REMOVED***

		if (!data)
			return

		if (colors) {
			opts.colors = colors,
				opts.stroke = colors
		***REMOVED*** else {
			if (data.length > regionsColors.length) {
				opts.colors = sectorColors
				opts.stroke = sectorColors
			***REMOVED*** else {
				opts.colors = regionsColors
				opts.stroke = regionsColors
			***REMOVED***
		***REMOVED***

		for (i = 0; i < data.length; i++) {
			dataNumber[i] = data[i].rawValue
			if (typeof data[i].value == 'Number' ||
				data[i].value.indexOf('%') == -1) {
				data[i].value += '%'
			***REMOVED***
			dataLabel[i] = data[i].value
		***REMOVED***

		pie = r.semiPiechart(radius * 1.1, radius * 1.1, radius, dataNumber, opts, dataLabel)

		pie.hover(function () {
			this.sector.stop();
			this.sector.animate({ transform: 's1.1 1.1 ' + this.cx + ' ' + this.cy ***REMOVED***, 100/*, 'bounce'*/);
			// if(!this.pop)
			this.pop = createPopup(
				this.sector, data[this.sector.value.order].label + ' - ' +
				data[this.sector.value.order].value + '<br />' +
			(noCurrency ? data[this.sector.value.order].rawValue : data[this.sector.value.order].rawValue.toCurrency()),
				labels ? 19 : 44)
			this.pop.show()
		***REMOVED***, function () {
			this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy ***REMOVED***, 200/*, 'bounce'*/);
			this.pop.remove()
		***REMOVED***);

		return pie
	***REMOVED***

	function drawBars(elem, data, labels, opts) {
		var barGraph,
			width = elem.offsetWidth,
			height,
			r = Raphael(elem, width, height)

		opts = opts || {***REMOVED***

		height = opts.height || width * 0.577

		if (!data)
			return

		opts.colors = opts.colors || sectorColors

		if (width < 150 || height < 100) return

		barGraph = r.barchart(50, 10, width - 100, height - 50, data, opts)

		barGraph.hover(function () {
			var raw = data[this.bar.value.order].rawValue
			this.bar.stop();
			this.bar.animate({ transform: 's1.1 1 ' + this.cx + ' ' + this.cy ***REMOVED***, 100/*, 'bounce'*/);
			// if(!this.pop)
			if (!opts.invertedData) {
				this.pop = createPopup(this.bar, data[this.bar.value.order].label +
					' - ' + data[this.bar.value.order].value +
					'<br>' + raw.toCurrency().replace(/\$\s*/, ''), 0, -20)
			***REMOVED*** else {
				this.pop = createPopup(this.bar, data[this.bar.value.order].label.replace(/(HIDROCARBURO|MINERAL)_FISCALIZADOS$/i, '$1').replace(/_/g, ' ') +
					'<br>' + raw +
					'%<br>(' + data[this.bar.value.order].value.toCurrency().replace(/\$\s*/, '') + ')', 0, -20)
			***REMOVED***
			this.pop.show()
		***REMOVED***, function () {
			this.bar.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy ***REMOVED***, 200/*, 'bounce'*/);
			this.pop.remove()
		***REMOVED***)

		if (labels) {
			//Labels
			r.text(width / 2, height - 45, labels[0]).attr({
				'text-anchor': 'middle',
				'fill': '#777',
				'font-size': '11px'
			***REMOVED***)
			r.text(8, height / 2, labels[1]).attr({
				'text-anchor': 'middle',
				'fill': '#777',
				'font-size': '11px'
			***REMOVED***).rotate(-90)
		***REMOVED***
	***REMOVED***

	function createPopup(node, htmlContent, hMargin, vMargin) {
		var popUp = $('<div>', { 'class': 'graph-tooltip' ***REMOVED***).html(htmlContent)

		vMargin = vMargin || 0
		hMargin = hMargin || 0

		popUp.appendTo(document.body)
		// debugger;
		popUp.css({
			top: $(node.paper.canvas).offset().top + node.getBBox().y - popUp[0].offsetHeight + vMargin,
			left: $(node.paper.canvas).offset().left + node.getBBox().x + node.getBBox().width / 2 + hMargin,
			display: 'none'
		***REMOVED***)

		return popUp
	***REMOVED***

	return {
		drawSemiPie: drawSemiPie,
		drawBars: drawBars
	***REMOVED***
***REMOVED***);
/*global doT, define*/
define('app/infographic/Infographic', [
	'app/controller/AppState',
	'app/controller/appStates',
	'app/grapher/Grapher',
	'app/network/Services'
],
	function (
		AppState,
		appStates,
		Grapher,
		Services
	) {

		function byId(id) {
			return document.getElementById(id)
		***REMOVED***

		var // Zones
			topZone = byId('top-graphs'),
			bottomZone = byId('bottom-graphs'),
			factsElem = $('.facts'),
			// Body Data
			dataResourcesPerSector = JSON.parse(document.body.getAttribute('data-resourcesPerSector')),
			dataResourcesPerRegion = JSON.parse(document.body.getAttribute('data-resourcesPerRegion')),
			dataProjectsPerSector = JSON.parse(document.body.getAttribute('data-projectsPerSector')),
			dataResourcesPerDepartment = JSON.parse(document.body.getAttribute('data-resourcesPerDepartment')),
			//dataFacts = factsElem[0].getAttribute('data-facts').split('||'),
			// Templates
			tmplDepto = doT.compile($('#template-graph-resdepto')[0].innerHTML),
			tmplResources = doT.compile($('#template-graph-prod-res')[0].innerHTML),
			factsTempl = doT.compile($('#template-facts')[0].innerHTML),

			// Static Templates
			templateTopProjects = byId('top-graphs-projects').innerHTML,
			templateBottomProjects = byId('bottom-graphs-projects').innerHTML,
			templateFacsResources,
			templateFacsProyects,
			templateFacsProduction,
			templateFacsFiscalizacion,
			// Stuff
			root = $('#infographic'),
			firstTime = true,
			parsedFacts = {
				'Recursos': [],
				'Proyectos': [],
				'Produccion': [],
				'Fiscalizacion': []
			***REMOVED***,
			fact,
			emptyHTMLBox = '<div class="empty">No hay datos para este periodo.</div>',
			pendingRequest,
			resToumeout1,
			resToumeout2,
			resToumeout3,
			resToumeout4,
			prodToumeout1,
			prodToumeout2,
			prodToumeout3,
			prodToumeout4,
			proyToumeout1,
			proyToumeout2,
			proyToumeout3,
			proyToumeout4,
			fisToumeout1,
			fisToumeout2,
			fisToumeout3,
			fisToumeout4,
			fisToumeout5,
			timingRedraw = 200


		document.body.removeAttribute('data-resourcesPerSector')
		document.body.removeAttribute('data-resourcesPerRegion')
		document.body.removeAttribute('data-projectsPerSector')
		document.body.removeAttribute('data-resourcesPerDepartment')

		function Infographic() {
			AppState.on('state-change', this.changeState.bind(this))
			AppState.on('params-change', this.checkPeriodChange.bind(this))
			this.changeState.apply(this, AppState.getStateArray())
		***REMOVED***

		Infographic.prototype.checkPeriodChange = function (state, hash, params) {
			params = params || ''

			var periodsParams = params.match(/period[^=]*=([^&]+)/)
			periodsParams = periodsParams ? periodsParams[0] : ''

			if (!this.periodsParams || periodsParams != this.periodsParams) {
				this.changeState.apply(this, [].slice.call(arguments))
				this.periodsParams = periodsParams
			***REMOVED***
		***REMOVED***

		Infographic.prototype.changeState = function (state, hash, params) {
			var undef

			this.setupGraph(state)

			if (pendingRequest) {
				if (pendingRequest.abort) pendingRequest.abort()
			***REMOVED***

			if (!state) {
				initialize(undef, 'Proyectos')
			***REMOVED*** else if (state == 'Proyectos') {
				//pendingRequest = Services.infograph.consolidated(params).done(initializeContructor(state))
			***REMOVED*** else if (state == 'Recursos') {
				pendingRequest = Services.infograph.resources(params).done(initializeContructor(state))
			***REMOVED*** else if (state == 'Produccion') {
				pendingRequest = Services.infograph.production(params).done(initializeContructor(state))
			***REMOVED*** else if (state == 'Fiscalizacion') {
				pendingRequest = Services.infograph.fiscalizacion(params).done(initializeContructor(state))
			***REMOVED***
		***REMOVED***

		Infographic.prototype.setupGraph = function (state) {
			this.state = state

			if (state == 'Proyectos' || !state) {
				topZone.innerHTML = templateTopProjects
				bottomZone.innerHTML = templateBottomProjects
			***REMOVED*** else if (state == 'Recursos') {
				topZone.innerHTML = templateTopResources
				bottomZone.innerHTML = templateBottomResources
			***REMOVED*** else if (state == 'Produccion') {
				topZone.innerHTML = templateTopProduction
				bottomZone.innerHTML = templateBottomProduction
			***REMOVED*** else if (state == 'Fiscalizacion') {
				topZone.innerHTML = templateTopFiscalization
				bottomZone.innerHTML = templateBottomFiscalization
			***REMOVED***
		***REMOVED***

		function initializeContructor(state) {
			return function (data) {
				initialize(data, state)
			***REMOVED***
		***REMOVED***

		function initialize(data, state) {
			// debugger;
			// console.log(data,state)
			if (!data || state == 'Proyectos') {
				//drawProyectsGraphs( data )
				factsElem.html(templateFacsProyects)
			***REMOVED*** else if (state == 'Recursos') {
				factsElem.html(templateFacsResources)
				drawResourcesGraphs(data)
			***REMOVED*** else if (state == 'Produccion') {
				factsElem.html(templateFacsProduction)
				drawProductionGraphs(data)
			***REMOVED*** else if (state == 'Fiscalizacion') {
				factsElem.html(templateFacsFiscalizacion)
				drawFiscalizationGraphs(data)
			***REMOVED***

			firstTime = false
		***REMOVED***

		function drawProyectsGraphs(data) {
			var // Proyects Variables
				rootSectorPie,
				rootRegionPie,
				rootProyBar,
				rootResDepto,
				grapResSec,
				// Shared
				max = 0, i,
				seriesData

			rootSectorPie = root.find('#res-sector').empty()[0]
			rootRegionPie = root.find('#res-region').empty()[0]
			rootProyBar = root.find('#proy-sector').empty()[0]
			rootResDepto = root.find('#res-depto').empty()

			dataResourcesPerSector = data ? data.resourcesPerSector : dataResourcesPerSector
			dataResourcesPerRegion = data ? data.resourcesPerRegion : dataResourcesPerRegion
			dataProjectsPerSector = data ? data.projectsPerSector : dataProjectsPerSector
			dataResourcesPerDepartment = data ? data.resourcesPerDepartment : dataResourcesPerDepartment

			if (!dataResourcesPerSector || !dataResourcesPerSector.length) {
				rootSectorPie[0].innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(proyToumeout1)
				proyToumeout1 = setTimeout(function () {
					grapResSec = Grapher.drawSemiPie(rootSectorPie, 135, dataResourcesPerSector)
				***REMOVED***, timingRedraw)
			***REMOVED***
			if (!dataResourcesPerRegion || !dataResourcesPerRegion.length) {
				rootRegionPie[0].innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(proyToumeout2)
				proyToumeout2 = setTimeout(function () {
					Grapher.drawSemiPie(rootRegionPie, 180, dataResourcesPerRegion, true)
				***REMOVED***, timingRedraw)
			***REMOVED***
			if (!dataProjectsPerSector || !dataProjectsPerSector.length) {
				rootProyBar[0].innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(proyToumeout3)
				proyToumeout3 = setTimeout(function () {
					Grapher.drawBars(rootProyBar, dataProjectsPerSector, ['Sectores', 'Número de Proyectos'])
				***REMOVED***, timingRedraw)
			***REMOVED***
			if (!dataResourcesPerDepartment || !dataResourcesPerDepartment.length) {
				rootResDepto[0].innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(proyToumeout4)
				proyToumeout4 = setTimeout(function () {
					for (i = 0; i < dataResourcesPerDepartment.length; i++) {
						max = Math.max(dataResourcesPerDepartment[i].rawValue, max)
					***REMOVED***

					for (i = 0; i < dataResourcesPerDepartment.length; i++) {
						dataResourcesPerDepartment[i].valuePercent = ~~(100 * (dataResourcesPerDepartment[i].rawValue / max)) + '%'
					***REMOVED***

					rootResDepto[0].innerHTML = tmplDepto({ array: dataResourcesPerDepartment ***REMOVED***)
				***REMOVED***, timingRedraw)
			***REMOVED***

		***REMOVED***

		function drawResourcesGraphs(data) {

			if (!data || !data.graficasConsolidadas) return

			var i,
				seriesData,
				presupuestoData = [],
				departmentsData = [],
				regionsData = [],
				departmentsList = [],
				regionsList = [],
				girado,
				dataTemp,
				presupuestoGraphData = []

			for (i = 0; i < data.graficasConsolidadas.length; i++) {
				dataTemp = data.graficasConsolidadas[i]
				if (dataTemp.Nombre == 'Presupuesto') {
					presupuestoData = dataTemp.ItemsGrafica
				***REMOVED*** else if (dataTemp.Nombre == 'RecursosAprobadosXRegion') {
					regionsData = dataTemp.ItemsGrafica
				***REMOVED*** else {
					departmentsData = dataTemp.ItemsGrafica
				***REMOVED***
			***REMOVED***


			//-----------------------------
			// DEPARTMENTS GRAPH
			//-----------------------------


			if (!departmentsData || !departmentsData.length) {
				root.find('#res-resources-depto')[0].innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(resToumeout1)
				resToumeout1 = setTimeout(function () {
					var seriesData = [{
						name: 'Recursos Aprobados',
						type: 'column',
						data: [],
						color: '#00b5c6'
					***REMOVED***, {
						name: 'Recursos Girados',
						type: 'column',
						data: [],
						color: {
							pattern: '/content/img/chart-pattern.jpg',
							width: 24,
							height: 24,
							color1: '#009dac'
						***REMOVED***
					***REMOVED***]
					for (i = 0; i < departmentsData.length; i++) {
						girado = departmentsData[i].Items[0] ? departmentsData[i].Items[0].Valor : 0
						seriesData[0].data[i] = departmentsData[i].Valor// - girado
						seriesData[1].data[i] = girado
						departmentsList[i] = departmentsData[i].Label
						// debugger;
					***REMOVED***
					root.find('#res-resources-depto').highcharts({
						chart: {
							marginBottom: 210
						***REMOVED***,
						credits: {
							enabled: false
						***REMOVED***,
						exporting: {
							buttons: {
								contextButton: {
									enabled: false
								***REMOVED***
							***REMOVED***
						***REMOVED***,
						title: null,
						xAxis: {
							categories: departmentsList,
							labels: {
								formatter: function () {
									return this.value//.substr(0,3)
								***REMOVED***,
								rotation: -45,
								align: 'right',
								style: {
									'font-size': '9px'
								***REMOVED***
							***REMOVED***,
							title: {
								text: 'DEPARTAMENTOS',
								style: {
									color: '#555',
									'font-size': '1.2em'
								***REMOVED***,
								margin: 30
							***REMOVED***
						***REMOVED***,
						yAxis: {
							min: 0,
							title: {
								text: 'RECURSOS APROBADOS<br>Y GIRADOS',
								style: {
									color: '#555',
									'font-size': '1.2em',
									marginRight: 20
								***REMOVED***,
								margin: 30
							***REMOVED***,
							labels: {
								formatter: function () {
									var max = this.axis.max
								// console.log(max)
								/*if( max > 1000000000000){
									return parseFloat((this.value / 1000000000000).toFixed()).toCurrency().replace('$','') + ' Billones'
								***REMOVED***else*/ if (max > 1000000000) {
										return parseFloat((this.value / 1000000000).toFixed()).toCurrency().replace('$', '') + ' MMillones'
									***REMOVED*** else if (max > 1000000) {
										return parseFloat((this.value / 1000000).toFixed()).toCurrency().replace('$', '') + ' Millones'
									***REMOVED*** else if (max > 1000) {
										return parseFloat((this.value / 1000).toFixed()).toCurrency().replace('$', '') + ' miles'
									***REMOVED*** else {
										return this.value
									***REMOVED***
									// return Highcharts.numberFormat(this.value, -3)
								***REMOVED***
							***REMOVED***
						***REMOVED***,
						tooltip: {
							formatter: function () {
								var itemData = this.points,
									girado = itemData[1] ? (itemData[1].y ? itemData[1].y : 0) : 0,
									aprobado = itemData[0] ? (itemData[0].y ? itemData[0].y : 0) : 0

								return '<div class="inner-stacked-tooltip">' +
									'<h4 class="title">' + this.x + '</h4 class="title">' +
									'<p class="number">' + aprobado.toCurrency() + '</p>' +
									'<p class="name">Recursos Aprobados</p>' +
									'<p class="number">' + girado.toCurrency() + '</p>' +
									'<p class="name">Recursos Girados</p>' +
									'</div>';
							***REMOVED***,
							backgroundColor: '#f9f9f9',
							borderRadius: 0,
							borderColor: '#f9f9f9',
							borderWidth: 0,
							useHTML: true,
							shared: true
						***REMOVED***,
						legend: {
							borderColor: '#ddd',
							padding: 18,
							borderRadius: 0/*,
						itemWidth: 200*/
						***REMOVED***,
						plotOptions: {
							column: {
								// stacking: 'normal',
								pointPadding: 0.02,
								groupPadding: 0.02
							***REMOVED***
						***REMOVED***,
						series: seriesData
					***REMOVED***)
				***REMOVED***, timingRedraw)
			***REMOVED***

			//-----------------------------
			// REGIONS GRAPH
			//-----------------------------

			if (!regionsData || !regionsData.length) {
				root.find('#res-resources-region')[0].innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(resToumeout2)
				resToumeout2 = setTimeout(function () {
					var seriesData = [{
						name: 'Recursos Aprobados',
						type: 'column',
						data: [],
						color: '#00b5c6'
					***REMOVED***, {
						name: 'Recursos Girados',
						type: 'column',
						data: [],
						color: {
							pattern: '/content/img/chart-pattern.jpg',
							width: 24,
							height: 24,
							color1: '#009dac'
						***REMOVED***
					***REMOVED***]
					for (i = 0; i < regionsData.length; i++) {
						girado = regionsData[i].Items[0] ? regionsData[i].Items[0].Valor : 0
						seriesData[0].data[i] = regionsData[i].Valor
						seriesData[1].data[i] = girado
						regionsList[i] = regionsData[i].Label
					***REMOVED***
					root.find('#res-resources-region').highcharts({
						chart: {
							marginBottom: 190
						***REMOVED***,
						credits: {
							enabled: false
						***REMOVED***,
						exporting: {
							buttons: {
								contextButton: {
									enabled: false
								***REMOVED***
							***REMOVED***
						***REMOVED***,
						title: null,
						xAxis: {
							categories: regionsList,
							labels: {
								formatter: function () {
									return this.value
								***REMOVED***,
								style: {
									'font-size': '9px'
								***REMOVED***
							***REMOVED***,
							title: {
								text: 'REGIONES',
								style: {
									color: '#555',
									'font-size': '1.2em'
								***REMOVED***,
								margin: 30
							***REMOVED***
						***REMOVED***,
						yAxis: {
							min: 0,
							title: {
								text: 'RECURSOS APROBADOS<br>Y GIRADOS',
								style: {
									color: '#555',
									'font-size': '1.2em',
									marginRight: 20
								***REMOVED***,
								margin: 30
							***REMOVED***,
							labels: {
								formatter: function () {
									var max = this.axis.max
								// console.log(max)
								/*if( max > 1000000000000){
									return parseFloat((this.value / 1000000000000).toFixed()).toCurrency().replace('$','') + ' Billones'
								***REMOVED***else*/ if (max > 1000000000) {
										return parseFloat((this.value / 1000000000).toFixed()).toCurrency().replace('$', '') + ' MMillones'
									***REMOVED*** else if (max > 1000000) {
										return parseFloat((this.value / 1000000).toFixed()).toCurrency().replace('$', '') + ' Millones'
									***REMOVED*** else if (max > 1000) {
										return parseFloat((this.value / 1000).toFixed()).toCurrency().replace('$', '') + ' miles'
									***REMOVED*** else {
										return this.value
									***REMOVED***
									// return Highcharts.numberFormat(this.value, -3)
								***REMOVED***
							***REMOVED***
						***REMOVED***,
						tooltip: {
							formatter: function () {
								var itemData = this.points,
									girado = itemData[1] ? (itemData[1].y ? itemData[1].y : 0) : 0,
									aprobado = itemData[0] ? (itemData[0].y ? itemData[0].y : 0) : 0

								return '<div class="inner-stacked-tooltip">' +
									'<h4 class="title">' + this.x + '</h4 class="title">' +
									'<p class="number">' + aprobado.toCurrency() + '</p>' +
									'<p class="name">Recursos Aprobados</p>' +
									'<p class="number">' + girado.toCurrency() + '</p>' +
									'<p class="name">Recursos Girados</p>' +
									'</div>';
							***REMOVED***,
							backgroundColor: '#f9f9f9',
							borderRadius: 0,
							borderColor: '#f9f9f9',
							borderWidth: 0,
							useHTML: true,
							shared: true
						***REMOVED***,
						legend: {
							borderColor: '#ddd',
							padding: 18,
							borderRadius: 0/*,
						itemWidth: 200*/
						***REMOVED***,
						plotOptions: {
							column: {
								// stacking: 'normal',
								pointPadding: 0.02,
								groupPadding: 0.02
							***REMOVED***
						***REMOVED***,
						series: seriesData
					***REMOVED***)
				***REMOVED***, timingRedraw)
			***REMOVED***



			//----------------------
			// PRESUPUESTO
			//----------------------
			for (i = 0; i < presupuestoData.length; i++) {
				presupuestoGraphData[i] = {
					label: presupuestoData[i].Label,
					value: presupuestoData[i].Porcentaje.toFixed(2),
					rawValue: presupuestoData[i].Valor,
					valuePercent: presupuestoData[i].Porcentaje
				***REMOVED***
			***REMOVED***
			if (!presupuestoGraphData || !presupuestoGraphData.length) {
				root.find('#res-fuente')[0].innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(resToumeout3)
				resToumeout3 = setTimeout(function () {
					Grapher.drawSemiPie($('#res-fuente').empty()[0], 180, presupuestoGraphData, true)
				***REMOVED***, timingRedraw)
			***REMOVED***
		***REMOVED***


		function drawProductionGraphs(data) {
			var typeResRoot = root.find('#prod-reg-res').empty()[0],
				resNoRenovableRoot = root.find('#prod-res-no').empty()[0],
				liquidationDepRoot = root.find('#prod-depto').empty()[0],
				resNatRoot = root.find('#prod-res').empty()[0],
				i, dataTemp, prodData = {***REMOVED***,
				scales

			for (i = 0; i < data.graficasConsolidadas.length; i++) {
				dataTemp = data.graficasConsolidadas[i]
				if (dataTemp.Nombre == 'ProduccionPorRecursos') {
					prodData.resNat = dataTemp.ItemsGrafica
				***REMOVED*** else if (dataTemp.Nombre == 'LiquidadoPorTipoRecurso') {
					prodData.typeRes = dataTemp.ItemsGrafica
				***REMOVED*** else if (dataTemp.Nombre == 'LiquidadoPorRecurso') {
					prodData.resNoRenovable = dataTemp.ItemsGrafica
				***REMOVED*** else { //LiquidadoPorDepartamento
					prodData.liquidationDep = dataTemp.ItemsGrafica
				***REMOVED***
			***REMOVED***

			//-------------------------
			// PIE REGALIAS LIQUIDADAS
			//-------------------------
			if (!prodData.typeRes || !prodData.typeRes.length) {
				typeResRoot.innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(prodToumeout1)
				prodToumeout1 = setTimeout(function () {
					var i
					for (i = 0; i < prodData.typeRes.length; i++) {
						prodData.typeRes[i] = {
							label: prodData.typeRes[i].Label,
							value: prodData.typeRes[i].Porcentaje.toFixed(2),
							rawValue: prodData.typeRes[i].Valor,
							valuePercent: prodData.typeRes[i].Porcentaje
						***REMOVED***
					***REMOVED***
					Grapher.drawSemiPie(typeResRoot, 135, prodData.typeRes, true)
				***REMOVED***, timingRedraw)
			***REMOVED***

			//-------------------------
			// BARS NO RENOVABLE
			//-------------------------
			if (!prodData.resNoRenovable || !prodData.resNoRenovable.length) {
				resNoRenovableRoot.innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(prodToumeout2)
				prodToumeout2 = setTimeout(function () {
					var i, percent, noPercent = false,
						total = 0, max
					for (i = 0; i < prodData.resNoRenovable.length; i++) {
						percent = prodData.resNoRenovable[i].Porcentaje
						noPercent = (typeof percent == 'undefine' || percent === null)
						prodData.resNoRenovable[i] = {
							label: prodData.resNoRenovable[i].Label,
							value: percent ? +(percent.toFixed(2)) : null,
							rawValue: prodData.resNoRenovable[i].Valor,
							valuePercent: percent
						***REMOVED***
						total = total + prodData.resNoRenovable[i].rawValue
						max = Math.max(0, prodData.resNoRenovable[i].rawValue)
					***REMOVED***
					if (noPercent) {
						for (i = 0; i < prodData.resNoRenovable.length; i++) {
							prodData.resNoRenovable[i].valuePercent = 100 * prodData.resNoRenovable[i].rawValue / total
							prodData.resNoRenovable[i].value = (100 * prodData.resNoRenovable[i].rawValue / total).toFixed(2) + '%'
						***REMOVED***
					***REMOVED***
					scales = scalesFor(max, 0, 11)
					Grapher.drawBars(resNoRenovableRoot, prodData.resNoRenovable, ['Recurso Natural No Renovable', 'Liquidado (' + scales.units + ')'], { height: 350 ***REMOVED***)
					// Grapher.drawBars(rootProyBar, dataProjectsPerSector)
				***REMOVED***, timingRedraw)
			***REMOVED***

			//-------------------------
			// BARS LIQUIDATION DEP
			//-------------------------
			if (!prodData.liquidationDep || !prodData.liquidationDep.length) {
				resNoRenovableRoot.innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(prodToumeout3)
				prodToumeout3 = setTimeout(function () {
					var max = prodData.liquidationDep[0].Valor,
						total = 0

					for (i = 0; i < prodData.liquidationDep.length; i++) {
						max = Math.max(prodData.liquidationDep[i].Valor, max)
						total += prodData.liquidationDep[i].Valor
					***REMOVED***

					for (i = 0; i < prodData.liquidationDep.length; i++) {
						prodData.liquidationDep[i].rawValue = prodData.liquidationDep[i].Valor
						prodData.liquidationDep[i].value = prodData.liquidationDep[i].Porcentaje || (100 * (prodData.liquidationDep[i].rawValue / total)).toFixed(2) + '%'
						prodData.liquidationDep[i].label = prodData.liquidationDep[i].Label
						prodData.liquidationDep[i].valuePercent = prodData.liquidationDep[i].Porcentaje || ~~(100 * (prodData.liquidationDep[i].rawValue / max)) + '%'
					***REMOVED***

					liquidationDepRoot.innerHTML = tmplDepto({ array: prodData.liquidationDep ***REMOVED***)
				***REMOVED***, timingRedraw)
			***REMOVED***

			//-------------------------
			// INFO PROD RES
			//-------------------------
			if (!prodData.resNat || !prodData.resNat.length) {
				resNatRoot.innerHTML = emptyHTMLBox
			***REMOVED*** else {
				clearTimeout(prodToumeout4)
				prodToumeout4 = setTimeout(function () {
					resNatRoot.innerHTML = tmplResources({ array: prodData.resNat ***REMOVED***)
				***REMOVED***, timingRedraw)
			***REMOVED***
		***REMOVED***

		function scalesFor(max, min, numScales) {
			var s, len, hidnDigs, i,
				units, scales = []

			len = max.toString().length
			hidnDigs = len - (len % 3 || 3)

			if (len - hidnDigs == 1) hidnDigs -= 3

			// if( hidnDigs == 1 ) hidnDigs = 4

			for (i = 0; i <= numScales; i++) {
				s = min + ((max - min) /
					numScales * i)
				s = Math.round(s / Math.pow(10, hidnDigs))
				scales.push(s.toString().replace(/(\d)(\d{3***REMOVED***)/, '$1.$2'))
			***REMOVED***

			if (hidnDigs == 3) {
				units = 'Miles'
			***REMOVED*** else if (hidnDigs == 6) {
				units = 'Millones'
			***REMOVED*** else if (hidnDigs == 9) {
				units = 'Miles de Millones'
			***REMOVED*** else if (hidnDigs == 12) {
				units = 'Billones'
			***REMOVED*** else if (hidnDigs == 15) {
				units = 'Miles de Billones'
			***REMOVED*** else if (hidnDigs == 18) {
				units = 'Millones de Billones'
			***REMOVED*** else if (hidnDigs == 18) {
				units = 'Trillones'
			***REMOVED***

			return { units: units, scales: scales ***REMOVED***
		***REMOVED***


		function drawFiscalizationGraphs(data) {
			var fiscHidroAct = root.find('#fisc-hidro-type').empty()[0],
				fiscMinAct = root.find('#fisc-min-act').empty()[0],
				fiscCamposType = root.find('#fisc-camp-type').empty()[0],
				fiscCamposTypeDep = root.find('#fisc-camp-type-dep').empty()[0],
				i, dataTemp = {***REMOVED***, departmentsData = {***REMOVED***,
				scales,
				// DATA
				fiscCamposTypeDepData,
				fiscHidroActData,
				fiscMinActData,
				fiscCamposResData,
				label


			data = data.graficasConsolidadas

			if ($('body').attr('data-debug')) {

				//data = [{"Nombre":"FiscalizacionPorHidrocarburo","ItemsGrafica":[{"Valor":298.0,"Label":"Campos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":298.0,"Label":"Campos fiscalizados","LabelExtendido":null,"Porcentaje":100.0,"Items":null***REMOVED***],"Tipo":"H"***REMOVED***,{"Nombre":"FiscalizacionPorMIieral","ItemsGrafica":[{"Valor":10159.0,"Label":"Títulos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":9124.0,"Label":"Títulos fiscalizados","LabelExtendido":null,"Porcentaje":89.0,"Items":null***REMOVED***],"Tipo":"M"***REMOVED***,{"Nombre":"FiscalizacionHidrocarburosPorActividad","ItemsGrafica":[{"Valor":32.0,"Label":"Informe de Taponamiento y Abandono","LabelExtendido":null,"Porcentaje":10.0,"Items":null***REMOVED***,{"Valor":36.0,"Label":"Informe Sobre trabajos Posteriores a la terminación Oficial","LabelExtendido":null,"Porcentaje":12.0,"Items":null***REMOVED***,{"Valor":2.0,"Label":"Permiso de mantenimiento de presión","LabelExtendido":null,"Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"Permiso de Inyección de Agua","LabelExtendido":null,"Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":5.0,"Label":"Informe mensual de Inyección de Vapor y producción adicional de petróleo","LabelExtendido":null,"Porcentaje":1.0,"Items":null***REMOVED***,{"Valor":214.0,"Label":"Informe mensual sobre ensayos de potencial de pozos de petróleo","LabelExtendido":null,"Porcentaje":71.0,"Items":null***REMOVED***,{"Valor":14.0,"Label":"Informe mensual de producción de pozos de gas","LabelExtendido":null,"Porcentaje":4.0,"Items":null***REMOVED***,{"Valor":15.0,"Label":"Informe mensual sobre inyección de agua y producción","LabelExtendido":null,"Porcentaje":5.0,"Items":null***REMOVED***,{"Valor":3.0,"Label":"Informe mensual sobre mantenimiento de presión (Inyección a gas)","LabelExtendido":null,"Porcentaje":1.0,"Items":null***REMOVED***,{"Valor":12.0,"Label":"Informe anual sobre mantenimiento de presión","LabelExtendido":null,"Porcentaje":4.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"Informe mensual sobre desplazamiento miscible","LabelExtendido":null,"Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":160.0,"Label":"Informe mensual sobre producción, plantas y consumos de gas natural y procesado","LabelExtendido":null,"Porcentaje":53.0,"Items":null***REMOVED***,{"Valor":3.0,"Label":"Intención de Perforar  (Pozos de Desarrollo)","LabelExtendido":null,"Porcentaje":1.0,"Items":null***REMOVED***,{"Valor":59.0,"Label":"Informe Quincenal","LabelExtendido":null,"Porcentaje":19.0,"Items":null***REMOVED***,{"Valor":77.0,"Label":"Informe de Terminación Oficial","LabelExtendido":null,"Porcentaje":25.0,"Items":null***REMOVED***,{"Valor":92.0,"Label":"Permisos para Trabajos Posteriores a la terminación Oficial","LabelExtendido":null,"Porcentaje":30.0,"Items":null***REMOVED***,{"Valor":20.0,"Label":"Informes sobre prueba de Presión","LabelExtendido":null,"Porcentaje":6.0,"Items":null***REMOVED***,{"Valor":239.0,"Label":"Informe Mensual de Producción de pozos de petróleo y gas","LabelExtendido":null,"Porcentaje":80.0,"Items":null***REMOVED***,{"Valor":30.0,"Label":"Movimiento de tanques y correcciones","LabelExtendido":null,"Porcentaje":10.0,"Items":null***REMOVED***,{"Valor":256.0,"Label":"Resumen Mensual sobre producción y movimiento de petróleo","LabelExtendido":null,"Porcentaje":85.0,"Items":null***REMOVED***,{"Valor":164.0,"Label":"Especificacion de  produccion por pozo mensual","LabelExtendido":null,"Porcentaje":55.0,"Items":null***REMOVED***,{"Valor":69.0,"Label":"Otra actividad en el desarrollo de sus funciones","LabelExtendido":null,"Porcentaje":23.0,"Items":null***REMOVED***,{"Valor":2.0,"Label":"Autorización de Quemas","LabelExtendido":null,"Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":7.0,"Label":"Autorización de Suspensiones","LabelExtendido":null,"Porcentaje":2.0,"Items":null***REMOVED***,{"Valor":11.0,"Label":"Visita a Campo o Pozos","LabelExtendido":null,"Porcentaje":3.0,"Items":null***REMOVED***],"Tipo":"H"***REMOVED***,{"Nombre":"FiscalizacionMineralesPorActividad","ItemsGrafica":[{"Valor":8616.0,"Label":"Evaluación Documental","LabelExtendido":null,"Porcentaje":84.0,"Items":null***REMOVED***,{"Valor":8143.0,"Label":"Visita de Campo","LabelExtendido":null,"Porcentaje":80.0,"Items":null***REMOVED***,{"Valor":8494.0,"Label":"Informe Integral de Fiscalización","LabelExtendido":null,"Porcentaje":83.0,"Items":null***REMOVED***],"Tipo":"M"***REMOVED***,{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":1467.0,"Label":"ANTIOQUIA","LabelExtendido":"Títulos mineros","Porcentaje":85.9,"Items":null***REMOVED***,{"Valor":24.0,"Label":"ARAUCA","LabelExtendido":"Títulos mineros","Porcentaje":70.6,"Items":null***REMOVED***,{"Valor":106.0,"Label":"ATLANTICO","LabelExtendido":"Títulos mineros","Porcentaje":97.2,"Items":null***REMOVED***,{"Valor":36.0,"Label":"BOGOTA","LabelExtendido":"Títulos mineros","Porcentaje":94.7,"Items":null***REMOVED***,{"Valor":312.0,"Label":"BOLIVAR","LabelExtendido":"Títulos mineros","Porcentaje":66.2,"Items":null***REMOVED***,{"Valor":1514.0,"Label":"BOYACA","LabelExtendido":"Títulos mineros","Porcentaje":98.3,"Items":null***REMOVED***,{"Valor":387.0,"Label":"CALDAS","LabelExtendido":"Títulos mineros","Porcentaje":97.7,"Items":null***REMOVED***,{"Valor":34.0,"Label":"CAQUETA","LabelExtendido":"Títulos mineros","Porcentaje":66.7,"Items":null***REMOVED***,{"Valor":116.0,"Label":"CASANARE","LabelExtendido":"Títulos mineros","Porcentaje":77.3,"Items":null***REMOVED***,{"Valor":238.0,"Label":"CAUCA","LabelExtendido":"Títulos mineros","Porcentaje":91.9,"Items":null***REMOVED***,{"Valor":374.0,"Label":"CESAR","LabelExtendido":"Títulos mineros","Porcentaje":94.0,"Items":null***REMOVED***,{"Valor":160.0,"Label":"CHOCO","LabelExtendido":"Títulos mineros","Porcentaje":79.6,"Items":null***REMOVED***,{"Valor":101.0,"Label":"CORDOBA","LabelExtendido":"Títulos mineros","Porcentaje":87.8,"Items":null***REMOVED***,{"Valor":1012.0,"Label":"CUNDINAMARCA","LabelExtendido":"Títulos mineros","Porcentaje":91.7,"Items":null***REMOVED***,{"Valor":34.0,"Label":"GUAINIA","LabelExtendido":"Títulos mineros","Porcentaje":89.5,"Items":null***REMOVED***,{"Valor":5.0,"Label":"GUAVIARE","LabelExtendido":"Títulos mineros","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":178.0,"Label":"HUILA","LabelExtendido":"Títulos mineros","Porcentaje":82.0,"Items":null***REMOVED***,{"Valor":60.0,"Label":"LA GUAJIRA","LabelExtendido":"Títulos mineros","Porcentaje":83.3,"Items":null***REMOVED***,{"Valor":88.0,"Label":"MAGDALENA","LabelExtendido":"Títulos mineros","Porcentaje":91.7,"Items":null***REMOVED***,{"Valor":188.0,"Label":"META","LabelExtendido":"Títulos mineros","Porcentaje":66.9,"Items":null***REMOVED***,{"Valor":199.0,"Label":"NARIÑO","LabelExtendido":"Títulos mineros","Porcentaje":93.9,"Items":null***REMOVED***,{"Valor":763.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":96.3,"Items":null***REMOVED***,{"Valor":43.0,"Label":"PUTUMAYO","LabelExtendido":"Títulos mineros","Porcentaje":91.5,"Items":null***REMOVED***,{"Valor":56.0,"Label":"QUINDIO","LabelExtendido":"Títulos mineros","Porcentaje":80.0,"Items":null***REMOVED***,{"Valor":59.0,"Label":"RISARALDA","LabelExtendido":"Títulos mineros","Porcentaje":79.7,"Items":null***REMOVED***,{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":699.0,"Label":"SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":98.6,"Items":null***REMOVED***,{"Valor":48.0,"Label":"SUCRE","LabelExtendido":"Títulos mineros","Porcentaje":80.0,"Items":null***REMOVED***,{"Valor":543.0,"Label":"TOLIMA","LabelExtendido":"Títulos mineros","Porcentaje":88.0,"Items":null***REMOVED***,{"Valor":269.0,"Label":"VALLE","LabelExtendido":"Títulos mineros","Porcentaje":95.7,"Items":null***REMOVED***,{"Valor":5.0,"Label":"VAUPES","LabelExtendido":"Títulos mineros","Porcentaje":83.3,"Items":null***REMOVED***,{"Valor":6.0,"Label":"VICHADA","LabelExtendido":"Títulos mineros","Porcentaje":66.7,"Items":null***REMOVED***],"Tipo":"M"***REMOVED***,{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"ANTIOQUIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":15.0,"Label":"ARAUCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"ATLANTICO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"BOGOTA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":2.0,"Label":"BOLIVAR","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":6.0,"Label":"BOYACA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"CALDAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"CAQUETA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":111.0,"Label":"CASANARE","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":2.0,"Label":"CAUCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":14.0,"Label":"CESAR","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"CHOCO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"CORDOBA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":2.0,"Label":"CUNDINAMARCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"GUAINIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"GUAVIARE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":25.0,"Label":"HUILA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":3.0,"Label":"LA GUAJIRA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"MAGDALENA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":49.0,"Label":"META","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"NARIÑO","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":8.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":19.0,"Label":"PUTUMAYO","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"QUINDIO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"RISARALDA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":25.0,"Label":"SANTANDER","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"SUCRE","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":14.0,"Label":"TOLIMA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"VALLE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"VAUPES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"VICHADA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***],"Tipo":"H"***REMOVED***]
				//data = [{"Nombre":"FiscalizacionPorHidrocarburo","ItemsGrafica":[{"Valor":487.0,"Label":"Campos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":487.0,"Label":"Campos fiscalizados","LabelExtendido":null,"Porcentaje":100.0,"Items":null***REMOVED***],"Tipo":"H"***REMOVED***,{"Nombre":"FiscalizacionPorMIieral","ItemsGrafica":[{"Valor":10159.0,"Label":"Títulos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":8653.0,"Label":"Títulos fiscalizados","LabelExtendido":null,"Porcentaje":85.0,"Items":null***REMOVED***],"Tipo":"M"***REMOVED***,{"Nombre":"FiscalizacionHidrocarburosPorActividad","ItemsGrafica":[{"Valor":487.0,"Label":"Producción","LabelExtendido":null,"Porcentaje":100.0,"Items":null***REMOVED***],"Tipo":"H"***REMOVED***,{"Nombre":"FiscalizacionMineralesPorActividad","ItemsGrafica":[{"Valor":7955.0,"Label":"Evaluación Documental","LabelExtendido":null,"Porcentaje":78.0,"Items":null***REMOVED***,{"Valor":8025.0,"Label":"Visita de Campo","LabelExtendido":null,"Porcentaje":78.0,"Items":null***REMOVED***,{"Valor":5412.0,"Label":"Informe Integral de Fiscalización","LabelExtendido":null,"Porcentaje":53.0,"Items":null***REMOVED***],"Tipo":"M"***REMOVED***,{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":1469.0,"Label":"ANTIOQUIA","LabelExtendido":"Títulos mineros","Porcentaje":86.0,"Items":null***REMOVED***,{"Valor":25.0,"Label":"ARAUCA","LabelExtendido":"Títulos mineros","Porcentaje":73.5,"Items":null***REMOVED***,{"Valor":89.0,"Label":"ATLANTICO","LabelExtendido":"Títulos mineros","Porcentaje":81.7,"Items":null***REMOVED***,{"Valor":35.0,"Label":"BOGOTA","LabelExtendido":"Títulos mineros","Porcentaje":92.1,"Items":null***REMOVED***,{"Valor":334.0,"Label":"BOLIVAR","LabelExtendido":"Títulos mineros","Porcentaje":70.9,"Items":null***REMOVED***,{"Valor":1372.0,"Label":"BOYACA","LabelExtendido":"Títulos mineros","Porcentaje":89.1,"Items":null***REMOVED***,{"Valor":297.0,"Label":"CALDAS","LabelExtendido":"Títulos mineros","Porcentaje":75.0,"Items":null***REMOVED***,{"Valor":43.0,"Label":"CAQUETA","LabelExtendido":"Títulos mineros","Porcentaje":84.3,"Items":null***REMOVED***,{"Valor":146.0,"Label":"CASANARE","LabelExtendido":"Títulos mineros","Porcentaje":97.3,"Items":null***REMOVED***,{"Valor":210.0,"Label":"CAUCA","LabelExtendido":"Títulos mineros","Porcentaje":81.1,"Items":null***REMOVED***,{"Valor":352.0,"Label":"CESAR","LabelExtendido":"Títulos mineros","Porcentaje":88.4,"Items":null***REMOVED***,{"Valor":151.0,"Label":"CHOCO","LabelExtendido":"Títulos mineros","Porcentaje":75.1,"Items":null***REMOVED***,{"Valor":100.0,"Label":"CORDOBA","LabelExtendido":"Títulos mineros","Porcentaje":87.0,"Items":null***REMOVED***,{"Valor":987.0,"Label":"CUNDINAMARCA","LabelExtendido":"Títulos mineros","Porcentaje":89.5,"Items":null***REMOVED***,{"Valor":19.0,"Label":"GUAINIA","LabelExtendido":"Títulos mineros","Porcentaje":50.0,"Items":null***REMOVED***,{"Valor":3.0,"Label":"GUAVIARE","LabelExtendido":"Títulos mineros","Porcentaje":60.0,"Items":null***REMOVED***,{"Valor":185.0,"Label":"HUILA","LabelExtendido":"Títulos mineros","Porcentaje":85.3,"Items":null***REMOVED***,{"Valor":41.0,"Label":"LA GUAJIRA","LabelExtendido":"Títulos mineros","Porcentaje":56.9,"Items":null***REMOVED***,{"Valor":87.0,"Label":"MAGDALENA","LabelExtendido":"Títulos mineros","Porcentaje":90.6,"Items":null***REMOVED***,{"Valor":250.0,"Label":"META","LabelExtendido":"Títulos mineros","Porcentaje":89.0,"Items":null***REMOVED***,{"Valor":179.0,"Label":"NARIÑO","LabelExtendido":"Títulos mineros","Porcentaje":84.4,"Items":null***REMOVED***,{"Valor":699.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":88.3,"Items":null***REMOVED***,{"Valor":36.0,"Label":"PUTUMAYO","LabelExtendido":"Títulos mineros","Porcentaje":76.6,"Items":null***REMOVED***,{"Valor":52.0,"Label":"QUINDIO","LabelExtendido":"Títulos mineros","Porcentaje":74.3,"Items":null***REMOVED***,{"Valor":61.0,"Label":"RISARALDA","LabelExtendido":"Títulos mineros","Porcentaje":82.4,"Items":null***REMOVED***,{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":633.0,"Label":"SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":89.3,"Items":null***REMOVED***,{"Valor":38.0,"Label":"SUCRE","LabelExtendido":"Títulos mineros","Porcentaje":63.3,"Items":null***REMOVED***,{"Valor":502.0,"Label":"TOLIMA","LabelExtendido":"Títulos mineros","Porcentaje":81.4,"Items":null***REMOVED***,{"Valor":249.0,"Label":"VALLE","LabelExtendido":"Títulos mineros","Porcentaje":88.6,"Items":null***REMOVED***,{"Valor":3.0,"Label":"VAUPES","LabelExtendido":"Títulos mineros","Porcentaje":50.0,"Items":null***REMOVED***,{"Valor":6.0,"Label":"VICHADA","LabelExtendido":"Títulos mineros","Porcentaje":66.7,"Items":null***REMOVED***],"Tipo":"M"***REMOVED***,{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"ANTIOQUIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":16.0,"Label":"ARAUCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"ATLANTICO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"BOGOTA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":6.0,"Label":"BOLIVAR","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":16.0,"Label":"BOYACA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"CALDAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"CAQUETA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":186.0,"Label":"CASANARE","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":3.0,"Label":"CAUCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":23.0,"Label":"CESAR","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"CHOCO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"CORDOBA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":3.0,"Label":"CUNDINAMARCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"GUAINIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"GUAVIARE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":28.0,"Label":"HUILA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":2.0,"Label":"LA GUAJIRA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"MAGDALENA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":88.0,"Label":"META","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"NARIÑO","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":10.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":30.0,"Label":"PUTUMAYO","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"QUINDIO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"RISARALDA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":45.0,"Label":"SANTANDER","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":6.0,"Label":"SUCRE","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":24.0,"Label":"TOLIMA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"VALLE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":0.0,"Label":"VAUPES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null***REMOVED***,{"Valor":1.0,"Label":"VICHADA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null***REMOVED***],"Tipo":"H"***REMOVED***]
				// 2012
				data = [{ "Nombre": "FiscalizacionPorHidrocarburo", "ItemsGrafica": [{ "Valor": 0.0, "Label": "Campos vigentes", "LabelExtendido": null, "Porcentaje": 100.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "Campos fiscalizados", "LabelExtendido": null, "Porcentaje": 0.0, "Items": null ***REMOVED***], "Tipo": "H" ***REMOVED***, { "Nombre": "FiscalizacionPorMIieral", "ItemsGrafica": [{ "Valor": 9729.0, "Label": "Títulos vigentes", "LabelExtendido": null, "Porcentaje": 100.0, "Items": null ***REMOVED***, { "Valor": 131.0, "Label": "Títulos fiscalizados", "LabelExtendido": null, "Porcentaje": 1.0, "Items": null ***REMOVED***], "Tipo": "M" ***REMOVED***, { "Nombre": "FiscalizacionHidrocarburosPorActividad", "ItemsGrafica": [], "Tipo": "H" ***REMOVED***, { "Nombre": "FiscalizacionMineralesPorActividad", "ItemsGrafica": [{ "Valor": 131.0, "Label": "Evaluación Documental", "LabelExtendido": null, "Porcentaje": 1.0, "Items": null ***REMOVED***, { "Valor": 1.0, "Label": "Visita de Campo", "LabelExtendido": null, "Porcentaje": 0.0, "Items": null ***REMOVED***], "Tipo": "M" ***REMOVED***, { "Nombre": "FiscalizacionPorTipoRecursoPorDepartamento", "ItemsGrafica": [{ "Valor": 0.0, "Label": "AMAZONAS", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 38.0, "Label": "ANTIOQUIA", "LabelExtendido": "Títulos mineros", "Porcentaje": 2.3, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "ARAUCA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "ATLANTICO", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "BOGOTA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "BOLIVAR", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "BOYACA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CALDAS", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CAQUETA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 9.0, "Label": "CASANARE", "LabelExtendido": "Títulos mineros", "Porcentaje": 6.1, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CAUCA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CESAR", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CHOCO", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CORDOBA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 35.0, "Label": "CUNDINAMARCA", "LabelExtendido": "Títulos mineros", "Porcentaje": 3.2, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "GUAINIA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "GUAVIARE", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 10.0, "Label": "HUILA", "LabelExtendido": "Títulos mineros", "Porcentaje": 4.8, "Items": null ***REMOVED***, { "Valor": 1.0, "Label": "LA GUAJIRA", "LabelExtendido": "Títulos mineros", "Porcentaje": 1.4, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "MAGDALENA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "META", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "NARIÑO", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "NORTE DE SANTANDER", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "PUTUMAYO", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "QUINDIO", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 13.0, "Label": "RISARALDA", "LabelExtendido": "Títulos mineros", "Porcentaje": 17.8, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "SAN ANDRES", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 1.0, "Label": "SANTANDER", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.1, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "SUCRE", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 24.0, "Label": "TOLIMA", "LabelExtendido": "Títulos mineros", "Porcentaje": 4.1, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "VALLE", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "VAUPES", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "VICHADA", "LabelExtendido": "Títulos mineros", "Porcentaje": 0.0, "Items": null ***REMOVED***], "Tipo": "M" ***REMOVED***, { "Nombre": "FiscalizacionPorTipoRecursoPorDepartamento", "ItemsGrafica": [{ "Valor": 0.0, "Label": "AMAZONAS", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "ANTIOQUIA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "ARAUCA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "ATLANTICO", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "BOGOTA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "BOLIVAR", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "BOYACA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CALDAS", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CAQUETA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CASANARE", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CAUCA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CESAR", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CHOCO", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CORDOBA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "CUNDINAMARCA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "GUAINIA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "GUAVIARE", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "HUILA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "LA GUAJIRA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "MAGDALENA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "META", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "NARIÑO", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "NORTE DE SANTANDER", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "PUTUMAYO", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "QUINDIO", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "RISARALDA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "SAN ANDRES", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "SANTANDER", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "SUCRE", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "TOLIMA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "VALLE", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "VAUPES", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***, { "Valor": 0.0, "Label": "VICHADA", "LabelExtendido": "Campos", "Porcentaje": 0.0, "Items": null ***REMOVED***], "Tipo": "H" ***REMOVED***]
			***REMOVED***



			for (i = 0; i < data.length; i++) {

				dataTemp[data[i].Nombre + data[i].Tipo] = {***REMOVED***
				dataTemp[data[i].Nombre + data[i].Tipo].ItemsGrafica = data[i].ItemsGrafica
				dataTemp[data[i].Nombre + data[i].Tipo].categories = []
				dataTemp[data[i].Nombre + data[i].Tipo].series = []
				dataTemp[data[i].Nombre + data[i].Tipo].valor = []
				dataTemp[data[i].Nombre + data[i].Tipo].obj = []
				dataTemp[data[i].Nombre + data[i].Tipo].Tipo = data[i].Tipo
				dataTemp[data[i].Nombre + data[i].Tipo].showNoData = false

				var showNoData = 0

				$.each(dataTemp[data[i].Nombre + data[i].Tipo].ItemsGrafica, function (k, v) {

					var temObj = {***REMOVED***


					temObj.y = v.Porcentaje
					temObj.valor = v.Valor
					temObj.vigentes = Math.round((v.Valor * 100) / v.Porcentaje)
					if (isNaN(temObj.vigentes)) {
						temObj.vigentes = 0
					***REMOVED***

					showNoData = (showNoData + v.Porcentaje)




					//console.log(k, v.Label)
					dataTemp[data[i].Nombre + data[i].Tipo].categories.push(v.Label);
					dataTemp[data[i].Nombre + data[i].Tipo].series.push(v.Porcentaje);
					dataTemp[data[i].Nombre + data[i].Tipo].obj.push(temObj);
					dataTemp[data[i].Nombre + data[i].Tipo].showNoData = showNoData


				***REMOVED***)

				//console.log(dataTemp[ data[i].Nombre+data[i].Tipo ], dataTemp[ data[i].Nombre+data[i].Tipo ].showNoData)


			***REMOVED***

			fiscHidrocarburoData = dataTemp.FiscalizacionPorHidrocarburoH.ItemsGrafica
			fiscMineralData = dataTemp.FiscalizacionPorMIieralM.ItemsGrafica
			fiscHidroActData = dataTemp.FiscalizacionHidrocarburosPorActividadH.ItemsGrafica
			fiscMinActData = dataTemp.FiscalizacionMineralesPorActividadM.ItemsGrafica
			fiscTipoRecursoDepDataM = dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.ItemsGrafica
			fiscTipoRecursoDepDataH = dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.ItemsGrafica
			//fiscCamposResData = dataTemp.FiscalizacionPorTipoRecurso.ItemsGrafica

			//debugger;

			var typeHA = {***REMOVED***;
			typeHA.type = 'column';
			typeHA.height = 400;
			typeHA.align = 'center';


			if (dataTemp.FiscalizacionHidrocarburosPorActividadH.obj.length >= 3) {
				$('.graph-fiscalization-hidrocarburos').addClass('lay-large')

				typeHA.type = 'bar';
				typeHA.height = 900;
				typeHA.align = 'right';
			***REMOVED***

			$('#FiscalizacionPorHidrocarburo').highcharts({
				chart: {
					type: 'column'
				***REMOVED***,
				title: {
					text: null,
					style: {
						color: '#555',
						'font-size': '1.2em'
					***REMOVED***,
					margin: 30
				***REMOVED***,
				subtitle: {
					text: null
				***REMOVED***,
				xAxis: {

					categories: dataTemp.FiscalizacionPorHidrocarburoH.categories,
					labels: {

						rotation: 0,
						align: 'center',
						style: {
							'font-size': '9px'
						***REMOVED***
					***REMOVED***
				***REMOVED***,
				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: null
					***REMOVED***
				***REMOVED***,
				tooltip: {
					/*formatter: function(){
								var series, data
	
								debugger;
	
								return '<div class="inner-stacked-tooltip">'+
									'<h4 class="title">'+ this.x +'</h4 class="title">'+
									'<p class="number">'+ aprobado.toCurrency() +'</p>'+
									'<p class="name">Recursos Aprobados</p>'+
									'<p class="number">'+ girado.toCurrency()+'</p>'+
									'<p class="name">Recursos Girados</p>'+
									'</div>';
							***REMOVED***,*/
					headerFormat: '<span style="font-size:10px">{point.key***REMOVED***</span><table>',
					pointFormat: '<tr><td style="color:{series.color***REMOVED***;padding:0">Campos: {point.valor***REMOVED*** </b></b></td>' +
						'</tr>' +
						'<tr>' +
						'<td style="padding:0"><b>{point.y:.1f***REMOVED*** %</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true,
					backgroundColor: '#ffffff'
				***REMOVED***,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0
					***REMOVED***
				***REMOVED***,
				credits: { enabled: false ***REMOVED***,
				exporting: { enabled: false ***REMOVED***,
				series: [{
					name: ' ',
					color: '#f2733c',
					data: dataTemp.FiscalizacionPorHidrocarburoH.obj,

				***REMOVED***]
			***REMOVED***);


			$('.FiscalizacionPorHidrocarburo').addClass('data-bars-' + dataTemp.FiscalizacionPorHidrocarburoH.obj.length + ' data-bars-' + dataTemp.FiscalizacionPorHidrocarburoH.showNoData)



			$('#FiscalizacionHidrocarburosPorActividad').highcharts({
				chart: {
					type: typeHA.type,
					height: typeHA.height
				***REMOVED***,
				title: {
					text: null,
					style: {
						color: '#555',
						'font-size': '1.2em'
					***REMOVED***,
					margin: 30
				***REMOVED***,
				subtitle: {
					text: null
				***REMOVED***,
				xAxis: {
					categories: dataTemp.FiscalizacionHidrocarburosPorActividadH.categories,
					labels: {

						rotation: 0,
						align: typeHA.align,
						style: {
							'font-size': '9px'
						***REMOVED***
					***REMOVED***
				***REMOVED***,
				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: null
					***REMOVED***,

				***REMOVED***,
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key***REMOVED***</span><table>',
					pointFormat: '<tr><td style="color:{series.color***REMOVED***;padding:0">Campos: {point.valor***REMOVED*** </b></b></td>' +
						'</tr>' +
						'<tr>' +
						'<td style="padding:0"><b>{point.y:.1f***REMOVED*** %</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true,
					backgroundColor: '#ffffff'
				***REMOVED***,
				plotOptions: {

					column: {
						pointPadding: 0,
						borderWidth: 0
					***REMOVED***
				***REMOVED***,
				credits: { enabled: false ***REMOVED***,
				exporting: { enabled: false ***REMOVED***,
				series: [{
					name: ' ',
					color: '#f2733c',
					data: dataTemp.FiscalizacionHidrocarburosPorActividadH.obj

				***REMOVED***]
			***REMOVED***);


			$('.FiscalizacionHidrocarburosPorActividad').addClass('data-bars-' + dataTemp.FiscalizacionHidrocarburosPorActividadH.obj.length + ' data-bars-' + dataTemp.FiscalizacionHidrocarburosPorActividadH.showNoData)


			$('#FiscalizacionPorMIieral').highcharts({
				chart: {
					type: 'column'
				***REMOVED***,
				title: {
					text: null,
					style: {
						color: '#555',
						'font-size': '1.2em'
					***REMOVED***,
					margin: 30
				***REMOVED***,
				subtitle: {
					text: null
				***REMOVED***,
				xAxis: {
					categories: dataTemp.FiscalizacionPorMIieralM.categories,
					labels: {

						rotation: 0,
						align: 'right',
						style: {
							'font-size': '0'
						***REMOVED***
					***REMOVED***
				***REMOVED***,
				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: null
					***REMOVED***
				***REMOVED***,
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key***REMOVED***</span><table>',
					pointFormat: '<tr><td style="color:{series.color***REMOVED***;padding:0">Títulos: {point.valor***REMOVED*** </b></b></td>' +
						'</tr>' +
						'<tr>' +
						'<td style="padding:0"><b>{point.y:.1f***REMOVED*** %</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true,
					backgroundColor: '#ffffff'
				***REMOVED***,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0
					***REMOVED***
				***REMOVED***,
				credits: { enabled: false ***REMOVED***,
				exporting: { enabled: false ***REMOVED***,
				series: [{
					name: ' ',
					color: '#f2361d',
					data: dataTemp.FiscalizacionPorMIieralM.obj,

				***REMOVED***]
			***REMOVED***);
			$.each(dataTemp.FiscalizacionPorMIieralM.series, function (k, v) {
				var html,
					valor = dataTemp.FiscalizacionPorMIieralM.valor[k];
				cat = dataTemp.FiscalizacionPorMIieralM.categories[k];

				html = '<div class="box-label"><span class="category">' + cat + '</span><span class="valor"><p>' + valor + '</p></span><span class="percent">' + v + '%</span></div>'

				$('.FiscalizacionPorMIieral .graph-extra-lables').append(html);

			***REMOVED***)
			$('.FiscalizacionPorMIieral .graph-extra-lables').addClass('boxes-by-' + dataTemp.FiscalizacionPorMIieralM.series.length)
			$('.FiscalizacionPorMIieral').addClass('data-bars-' + dataTemp.FiscalizacionPorMIieralM.obj.length + ' data-bars-' + dataTemp.FiscalizacionPorMIieralM.showNoData)




			$('#FiscalizacionMineralesPorActividad').highcharts({
				chart: {
					type: 'column'
				***REMOVED***,
				title: {
					text: null,
					style: {
						color: '#555',
						'font-size': '1.2em'
					***REMOVED***,
					margin: 30
				***REMOVED***,
				subtitle: {
					text: null
				***REMOVED***,
				xAxis: {
					categories: dataTemp.FiscalizacionMineralesPorActividadM.categories,
					labels: {

						rotation: 0,
						align: 'right',
						style: {
							'font-size': '0'
						***REMOVED***
					***REMOVED***
				***REMOVED***,
				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: null
					***REMOVED***
				***REMOVED***,
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key***REMOVED***</span><table>',
					pointFormat: '<tr><td style="color:{series.color***REMOVED***;padding:0">Títulos: {point.valor***REMOVED*** </b></b></td>' +
						'</tr>' +
						'<tr>' +
						'<td style="padding:0"><b>{point.y:.1f***REMOVED*** %</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true,
					backgroundColor: '#ffffff'
				***REMOVED***,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0
					***REMOVED***
				***REMOVED***,
				credits: { enabled: false ***REMOVED***,
				exporting: { enabled: false ***REMOVED***,
				series: [{
					name: ' ',
					color: '#f2361d',
					data: dataTemp.FiscalizacionMineralesPorActividadM.obj

				***REMOVED***]
			***REMOVED***);
			$.each(dataTemp.FiscalizacionMineralesPorActividadM.series, function (k, v) {
				var html,
					valor = dataTemp.FiscalizacionMineralesPorActividadM.valor[k];
				cat = dataTemp.FiscalizacionMineralesPorActividadM.categories[k];

				html = '<div class="box-label"><span class="category">' + cat + '</span><span class="valor"><p>' + valor + '</p></span><span class="percent">' + v + '%</span></div>'

				$('.FiscalizacionMineralesPorActividad .graph-extra-lables').append(html);

			***REMOVED***)
			$('.FiscalizacionMineralesPorActividad .graph-extra-lables').addClass('boxes-by-' + dataTemp.FiscalizacionMineralesPorActividadM.series.length)
			$('.FiscalizacionMineralesPorActividad').addClass('data-bars-' + dataTemp.FiscalizacionMineralesPorActividadM.obj.length + ' data-bars-' + dataTemp.FiscalizacionMineralesPorActividadM.showNoData)





			$('#FiscalizacionPorTipoRecursoPorDepartamentoM').highcharts({
				chart: {
					type: 'column'
				***REMOVED***,
				title: {
					text: null,
					style: {
						color: '#555',
						'font-size': '1.2em'
					***REMOVED***,
					margin: 30
				***REMOVED***,
				subtitle: {
					text: null
				***REMOVED***,
				xAxis: {
					categories: dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.categories,
					type: 'category',
					labels: {
						rotation: -90,
						align: 'right',
						style: {
							fontSize: '13px',
							fontFamily: 'Verdana, sans-serif'
						***REMOVED***
					***REMOVED***
				***REMOVED***,
				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: null
					***REMOVED***
				***REMOVED***,
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key***REMOVED***</span><table>',
					pointFormat: '<tr><td style="color:{series.color***REMOVED***;padding:0">Títulos Fiscalizados: {point.valor***REMOVED*** </b></b></td>' +
						'</tr>' +
						'<tr><td style="padding:0">Títulos Vigentes: {point.vigentes***REMOVED*** </b></b></td>' +
						'</tr>' +
						'<tr>' +
						'<td style="padding:0"><b>{point.y:.1f***REMOVED*** %</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true,
					backgroundColor: '#ffffff'
				***REMOVED***,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0
					***REMOVED***
				***REMOVED***,
				credits: { enabled: false ***REMOVED***,
				exporting: { enabled: false ***REMOVED***,
				series: [{
					name: ' ',
					color: '#f2361d',
					data: dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.obj,
					dataLabels: {

						style: {
							fontSize: '13px',
							fontFamily: 'Verdana, sans-serif',
							textShadow: '0 0 3px black'
						***REMOVED***
					***REMOVED***


				***REMOVED***]
			***REMOVED***);

			$('.fisc-camp-type-dep[data-subtipo="M"]').addClass('data-bars-' + dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.obj.length + ' data-bars-' + dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.showNoData)

			$('#FiscalizacionPorTipoRecursoPorDepartamentoH').highcharts({
				chart: {
					type: 'column'
				***REMOVED***,
				title: {
					text: null,
					style: {
						color: '#555',
						'font-size': '1.2em'
					***REMOVED***,
					margin: 30
				***REMOVED***,
				subtitle: {
					text: null
				***REMOVED***,
				xAxis: {
					categories: dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.categories,
					type: 'category',
					labels: {
						rotation: -90,
						align: 'right',
						style: {
							fontSize: '13px',
							fontFamily: 'Verdana, sans-serif'
						***REMOVED***
					***REMOVED***
				***REMOVED***,
				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: null
					***REMOVED***
				***REMOVED***,
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key***REMOVED***</span><table>',
					pointFormat: '<tr><td style="color:{series.color***REMOVED***;padding:0">Campos Fiscalizados: {point.valor***REMOVED*** </b></b></td>' +
						'</tr>' +
						'<tr><td style="color:padding:0">Campos Vigentes: {point.vigentes***REMOVED*** </b></b></td>' +
						'</tr>' +
						'<tr>' +
						'<td style="padding:0"><b>{point.y:.1f***REMOVED*** %</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true,
					backgroundColor: '#ffffff'
				***REMOVED***,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0
					***REMOVED***
				***REMOVED***,
				credits: { enabled: false ***REMOVED***,
				exporting: { enabled: false ***REMOVED***,
				series: [{
					name: ' ',
					color: '#f2733c',
					data: dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.obj,
					dataLabels: {

						style: {
							fontSize: '13px',
							fontFamily: 'Verdana, sans-serif',
							textShadow: '0 0 3px black'
						***REMOVED***
					***REMOVED***

				***REMOVED***]
			***REMOVED***);

			$('.fisc-camp-type-dep[data-subtipo="H"]').addClass('data-bars-' + dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.obj.length + ' data-bars-' + dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.showNoData)
		***REMOVED***

		return new Infographic()
	***REMOVED***);
define('app/filters/Option', ['lib/mvc/Observable'], function (Observable) {
	var Option = new Class(Observable, {

		initialize: function (data) {
			$.extend(this, data)
			this.active = ko.observable(false)
			this.visible = ko.observable(true)
			this.important = ko.observable(false)
		***REMOVED***,

		toggleActive: function () {
			// debugger;
			this.active(!this.active())
			if (this.active() && this.dependsOn) {
				this.fireEvent('require-activate', this.dependsOn)
			***REMOVED***

			//debugger;
			//
			// if(this.active()){
			// this.fireEvent('activated-by-user', this.value)
			// ***REMOVED***
			this.fireEvent('options-changed', this)
		***REMOVED***,

		setActive: function (bool, ignoreNotification) {

			//debugger;
			this.active(typeof bool == 'boolean' ? bool : true)
			if (!ignoreNotification) {
				this.fireEvent('options-changed', this, true)
			***REMOVED***
			if (this.dependsOn && this.active()) {
				this.fireEvent('require-activate', this.dependsOn)
			***REMOVED***



		***REMOVED***,

		setVisibility: function (bool) {
			this.visible(bool)
		***REMOVED***,

		getName: function () {
			return this.name //+ (this.dependsOn ? this.dependsOn[0].id : '')
		***REMOVED***,
		getSubTipo: function () {
			//console.log(this);

			if (this.subTipo) {
				return this.subTipo
			***REMOVED*** else {
				return 'none'
			***REMOVED***
			//return this.subTipo //+ (this.dependsOn ? this.dependsOn[0].id : '')
		***REMOVED***,
		getValue: function () {
			//console.log(this);

			if (this.value) {
				return this.value
			***REMOVED*** else {
				return 'none'
			***REMOVED***
			//return this.subTipo //+ (this.dependsOn ? this.dependsOn[0].id : '')
		***REMOVED***

	***REMOVED***)

	return Option
***REMOVED***);
/*global ko, define, Class, Event*/
define('app/filters/Filter', ['lib/mvc/Observable',
	'./Option', 'app/controller/AppState',
],
	function (
		Observable,
		Option,
		AppState
	) {
		'use strict';

		var defaultText = document.body.getAttribute('data-periods-default-text'),
			searchTimeout
		document.body.removeAttribute('data-periods-default-text')

		var Filter = new Class(Observable, {
			initialize: function (data) {
				var option, tempArray = [], self = this
				$.extend(this, data)

				this.options = ko.observableArray()
				this.usaServicioAjax = !!data.usaServicioAjax

				if (this.parameter === 'campoProyecto') {
					this.isExclusive = true
					this.excludes = ['region', 'departamento', 'municipio']
				***REMOVED***

				if (!this.usaServicioAjax) {
					for (var i = 0; i < this.items.length; i++) {
						option = new Option(this.items[i])
						option.active.subscribe(this.setActive.bind(this))
						option.on('require-activate', this.optionActivated.bind(this))
						option.on('options-changed', this.optionActivatedByUser.bind(this))
						tempArray[i] = option
					***REMOVED***
					tempArray.sort(this.alphabetSorting)
				***REMOVED***

				this.options(tempArray)

				this.active = ko.observable(false)
				this.visible = ko.observable(false)
				this.hidden = ko.observable(true)
				// this.hidden.subscribe(function(){
				// 	console.log(self.hidden(), self.parameter)
				// ***REMOVED***)

				this.optionChanged = ko.observable()


				this.elems = {***REMOVED***
				this.isLoading = ko.observable(false)
				this.extraClasses = ko.computed(function () {
					if (self.usaServicioAjax) {
						if (self.isLoading()) {
							return 'loading'
						***REMOVED***
						if (!self.options().length) {
							return 'empty'
						***REMOVED***
					***REMOVED***

					return ''
				***REMOVED***)
				this.testcat = ko.computed(function () {



				***REMOVED***, this)
				this.getNameStatus = ko.computed(function () {

					var actived = '',
						option,
						opts = this.options(),
						state = AppState.state


					for (var i = opts.length; i--;) {
						option = opts[i]
						if (option.active()) actived += option.name + ', '
					***REMOVED***

					var nameoption = actived.replace(/\,\s$/, '');

					if (this.parameter === "tipoRecursoNaturalFiscalizacion" && nameoption != "") {
						//debugger;
						//debugger;
						//console.log(option.name, state, AppState)
						//console.log(option.name, nameoption)
						var valueSubtipo;

						if (nameoption === "Todos") {
							valueSubtipo = "-1"
						***REMOVED*** else {
							valueSubtipo = nameoption.substr(0, 1)
						***REMOVED***

						nameoption = nameoption.toLowerCase()

						//console.log($(window))
						//debugger;
						$('.buttons-filter-fiscalization a').removeClass('active')
						//$('.buttons-filter-fiscalization a.filter-to-'+nameoption).addClass('active')
						$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo-' + valueSubtipo)

						$('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text($('.buttons-filter-fiscalization a.active').attr('data-text-filter'))

					***REMOVED***

					if (this.name == $('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text()) {
						//debugger;
						this.name = $('.buttons-filter-fiscalization a.active').attr('data-text-filter')
						//this.name = $('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text()
					***REMOVED***


					if (actived)
						actived = '<span class="no-bold">' + this.name + ':  </span>' + actived.replace(/\,\s$/, '')
					else
						actived = this.name


					return actived
				***REMOVED***, this)

				this.getNameDefault = ko.computed(function () {
					var actived = '',
						opts = this.options(),
						option

					for (var i = opts.length; i--;) {
						option = opts[i]
						if (option.active()) actived += option.name + ', '
					***REMOVED***
					if (actived) {
						actived = actived.replace(/\,\s$/, '')
					***REMOVED***
					else {
						actived = defaultText
					***REMOVED***
					return actived
				***REMOVED***, this)

				this.toggleVisibleBinded = this.toggleVisible.bind(this)
			***REMOVED***,

			filter: function () {
			***REMOVED***,

			toggleVisible: function (data, evt) {
				var elem = evt && $(evt.target),
					isVisible = this.visible()

				if (elem) {
					this.elem = elem
				***REMOVED***

				this.onToggle()

				if (!isVisible) {
					this.show()
				***REMOVED*** else {
					if (evt) evt.stopPropagation()
					this.hide()
				***REMOVED***

				if (evt instanceof Event) {
					if (evt.stopPropagation) {
						evt.stopPropagation()
					***REMOVED*** else {
						window.event.cancelBubble = true
					***REMOVED***
				***REMOVED***
			***REMOVED***,

			setActive: function () {
				// console.log('damn')
				var areActive = this.getActive()
				this.active(areActive.length)
				if (this.isExclusive && this.active()) {
					//debugger;
					// console.log('firing unselectall', this.parameter, false, this.excludes) 
					this.fireEvent('unselect-all-filters', this.parameter, false, this.excludes)
				***REMOVED***
				this.fireEvent('option-activated', this, areActive)
			***REMOVED***,

			getActive: function () {
				var opts = this.options(),
					option,
					areActive = []
				for (var i = 0; i < opts.length; i++) {
					option = opts[i]
					if (option.active()) areActive.push(option)
				***REMOVED***
				return areActive
			***REMOVED***,

			disActive: function () {
				var opts = this.options(),
					option
				for (var i = opts.length; i--;) {
					option = opts[i]
					if (option.active()) option.setActive(false)
				***REMOVED***
			***REMOVED***,

			optionClicked: function (parent, evt, option) {
				var target = evt.target,
					child = ko.dataFor(target),
					state = AppState.state,
					value = child.value;

				//debugger;

				//console.log(this, $(this), state, AppState, this.getNameStatus(), self, evt.target.dataset.value);


				if (this.parameter == "tipoRecursoNaturalFiscalizacion") {
					if (state == '')
						state = 'fiscalizacion'

					$('.map-container').attr('data-option-subtipo', state.toLowerCase() + '-option-subtipo-' + value)

				***REMOVED***

				if ($(evt.target).hasClass('option'))
					child.toggleActive()
			***REMOVED***,

			optionActivated: function (options) {
				this.fireEvent('activate-options-related', options)
			***REMOVED***,

			optionActivatedByUser: function (option, stopBubbling) {
				var opt,
					opts = this.getActive()
				//debugger;
				for (var i = opts.length; i--;) {
					opt = opts[i]
					if (!this.esMultiple &&
						option.value !== opt.value) {
						opt.setActive(false, 'ignoreNotification')
					***REMOVED***
				***REMOVED***

				if ('periodosFiscalizacion' == this.parameter) {
					$('#info-select-list-period').trigger('click')
				***REMOVED***

				if (!stopBubbling) {
					this.fireEvent('activated-by-user', this.parameter, this.getActive())
				***REMOVED***
			***REMOVED***,

			getOptionByValue: function (value) {
				var opts = this.options(), i = 0
				for (; i < opts.length; i++) {
					if (opts[i].value === value)
						return opts[i]
				***REMOVED***
			***REMOVED***,

			activateOptionByValue: function (value) {
				var opt = this.getOptionByValue(value)
				if (opt) opt.setActive()
			***REMOVED***,

			filterOptions: function (data, evt) {
				var srt = evt.target.value,
					opts = this.options(),
					opt, self = this

				if (!this.usaServicioAjax) {
					for (var i = 0; i < opts.length; i++) {
						opt = opts[i]
						opt.setVisibility(!srt || opt.name.score(srt) > 0)
					***REMOVED***
				***REMOVED*** else if (srt.length > 2) {
					self.options([])
					self.isLoading(true)
					clearTimeout(searchTimeout)
					searchTimeout = setTimeout(function () {
						$.ajax({
							method: 'get',
							url: self.urlServicioAjax,
							data: {
								query: srt
							***REMOVED***
						***REMOVED***).done(function (data) {
							var opts = data.filters ? data.filters[0].items : [],
								tempArray = []

							for (var i = 0; i < opts.length; i++) {
								opt = new Option(opts[i])
								opt.active.subscribe(self.setActive.bind(self))
								opt.on('require-activate', self.optionActivated.bind(self))
								opt.on('options-changed', self.optionActivatedByUser.bind(self))
								tempArray[i] = opt
							***REMOVED***

							self.options(tempArray)
							self.isLoading(false)
						***REMOVED***)
					***REMOVED***, 1000)
				***REMOVED*** else {
					self.options([])
				***REMOVED***
			***REMOVED***,

			getQuery: function () {
				if (this.active()) {
					var query = this.parameter + '=',
						opts = this.options(),
						option

					for (var i = opts.length; i--;) {
						option = opts[i]
						if (option.active()) query += encodeURIComponent(option.value) + ','
					***REMOVED***

					query = query.replace(/\,$/, '')

					return query
				***REMOVED***
				return ''
			***REMOVED***,

			onToggle: function () {
				this.elem.parents('.filters-group')
					//hide all filters
					.find('.filter-group')
					.end()

				//clear the filter inputs only for no ajax
				if (!this.usaServicioAjax) {
					this.elem.parents('.filters-group input')
						.val('').keyup()
				***REMOVED***
			***REMOVED***,

			hide: function () {
				var self = this

				this.onToggle()
				// this.elem.parents('.filters-group').find('input')
				// 		.val('').keyup()

				$(document).off('click', this.toggleVisibleBinded)

				self.visible(false)

				if (this.elem.hasClass('extra')) {
					this.elem.next()
						.slideUp(200, function () {
							$(this).hide().parent()
								.removeClass('visible')
						***REMOVED***)
				***REMOVED*** else {
					this.elem.next().delay(100)
						.animate({ width: 0 ***REMOVED***, 250, function () {
							$(this).hide().parent()
								.removeClass('visible')
							self.visible(false)
						***REMOVED***)
				***REMOVED***
			***REMOVED***,

			show: function () {
				var self = this

				this.onToggle()
				this.visible(true)

				if (this.elem.hasClass('extra')) {
					this.elem.next()
						.slideDown(200)
					setTimeout(function () {
						$(document).on('click', self.toggleVisibleBinded)
					***REMOVED***, 10)
				***REMOVED*** else {
					this.elem.next()
						.width(0)
						.show()
						.delay(100)
						.animate({ width: 200 ***REMOVED***, 250)
				***REMOVED***
				this.elem.parent().addClass('visible')

				// SORTING
				this.fireEvent('filters-gonna-show', this)
			***REMOVED***,

			alphabetSorting: function (left, right) {
				return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1)
			***REMOVED***,

			sortOptionsBy: function (fgsActive) {
				var opts = this.options(),
					option

				if (!this.filterByType) {
					this.filterByType = function (dependency) {
						var activedOptions
						for (var i = 0; i < fgsActive.length; i++) {
							activedOptions = fgsActive[i].getActive()
							for (var j = 0; j < activedOptions.length; j++) {
								if (fgsActive[i].parameter == dependency.type &&
									activedOptions[j].value == dependency.id) {
									return true
								***REMOVED***
							***REMOVED***
						***REMOVED***
						return false
						// return dependency.type === type &&  dependency.id === id
					***REMOVED***
				***REMOVED***

				for (var i = opts.length; i--;) {
					option = opts[i]
					if (!option.dependsOn) {
						option.sortBy = 2 + option.name
						option.important(false)
					***REMOVED*** else {
						if (option.dependsOn.filter(this.filterByType).length) {
							option.sortBy = 1 + option.name
							option.important(true)
						***REMOVED*** else {
							option.sortBy = 2 + option.name
							option.important(false)
						***REMOVED***
					***REMOVED***
				***REMOVED***

				this.options.sort(function (left, right) {
					return left.sortBy == right.sortBy ? 0 : (left.sortBy < right.sortBy ? -1 : 1)
				***REMOVED***)
			***REMOVED***,

			selectOption: function (id) {
				var opts = this.options(),
					option

				//debugger;

				for (var i = opts.length; i--;) {
					option = opts[i]
					if (option.value == id) {
						option.setActive(true)
					***REMOVED*** else if (!this.esMultiple) {
						//***REMOVED***else if( !this.esMultiple ||
						//	( this.parameter.indexOf('period') && AppState.getState().state === 'Fiscalizacion' ) ){
						option.setActive(false, 'ignoreNotification')
					***REMOVED***
				***REMOVED***
			***REMOVED***
		***REMOVED***)

		return Filter
	***REMOVED***);
/*global ko, define, Class*/
/**
 * FiltersGroup
 *
 * This Class manages group of filters
 * easing the action of activating and
 * deactivating groups of filters like
 * Projects, Resources... and so on.
 */
define('app/filters/FiltersGroup', ['lib/mvc/Observable',
	'./Filter',
	'app/controller/appStates'],
	function (Observable, Filter, appStates) {

		var FiltersGroup = new Class(Observable, {
			// The type of the instance
			// this can be any of FiltersGroup.types
			type: null,
			filters: null,
			arrayFilters: [],
			loading: true,
			visible: false,


			/**
			 * Constructor
			 *
			 * @param  FiltersGroup.types type string with the type
			 */
			initialize: function (type) {
				this.type = type
				this.filters = ko.observableArray()
				this.loading = ko.observable(true)
				this.visible = ko.observable(false)
				this.period = null
				this.visible.subscribe(this.togglePeriods.bind(this))
			***REMOVED***,

			/**
			 * Adds a Filter to the not observable array of filters
			 * @param Object properties of the Filter to construct and add
			 */
			addFilter: function (properties) {
				var self = this,
					filter

				// if( properties.usaServicioAjax ){
				// 	filter = new FilterSelect2( properties )
				// ***REMOVED***else{
				filter = new Filter(properties)
				// ***REMOVED***


				// Events bindings
				filter.on('activate-options-related', self.activateOptionsRelated.bind(self))

				if (filter.parameter.match(/(region)|(departamento)|(municipio)|(fiscalizacion)/)) {
					filter.on('activated-by-user',
						self.fireEvent.bind(self, 'territory-activated'))
				***REMOVED***

				filter.on('unselect-all-filters', self.unselectAllFilters.bind(self))
				filter.on('option-activated', self.fireEvent.bind(self, 'option-activated'))
				filter.on('filters-gonna-show', self.hideOtherFilters.bind(self))

				// All periods:
				// period, periodo, periodos, periodosRecursos...
				if (filter.parameter.indexOf('period') === 0) {
					filter.hidden(!this.visible())
					filter.on('option-activated',
						self.fireEvent.bind(self, 'period-selected'))
					self.period = filter
					self.togglePeriods()
				***REMOVED***
				if (filter.parameter.indexOf('campoProyecto') === 0) {
					filter.on('activated-by-user', function () {
						self.fireEvent('zoom-out')
					***REMOVED***)
				***REMOVED***
				self.arrayFilters.push(filter)

				return filter
			***REMOVED***,

			/**
			 * Turns the array of filters
			 * to the ko.observableArray
			 */
			instantiateObservable: function () {
				this.filters(this.arrayFilters)
				// Empty memory
				this.arrayFilters = null
				this.loading(false)
			***REMOVED***,

			/**
			 * Actiavte the options related,
			 * it's assumed that the related filter
			 * is in this group of filters
			 *
			 * @param  {Array<Option>***REMOVED*** opts
			 */
			activateOptionsRelated: function (opts) {
				var filter, option,
					filters = this.filters(),
					i, j

				for (i = 0; i < opts.length; i++) {
					for (j = 0; j < filters.length; j++) {
						filter = filters[j]

						if (filter.parameter === 'departamento') {
							tmpFilterAct = filter.getActive()
							if (tmpFilterAct.length > 1) {
								tmpSecondFilterAct = filters[j + 1].getActive()

								tmpSecondFilterAct.forEach(function (element) {
									element.setActive(false, 'ignoreNotification')
								***REMOVED***);
							***REMOVED***
						***REMOVED***

						if (filter.parameter == opts[i].type) {
							filter.activateOptionByValue(opts[i].id)
							break;
						***REMOVED***
					***REMOVED***
				***REMOVED***
			***REMOVED***,

			/**
			 * Wether the user activate or deactivate a
			 * territory option of one of the filters this
			 * fires the event to the Observer in a proxy way
			 */
			activatedByUser: function () {
				this.fireEvent.apply(this, 'territory-activated', [].slice.call(arguments))
			***REMOVED***,

			hideOtherFilters: function (filterActivated, cancelNotify) {
				var filters = this.filters(),
					filter,
					activated = [],
					visible


				for (var i = 0; i < filters.length; i++) {
					filter = filters[i]
					if (filter.active()) {
						activated.push(filter)
					***REMOVED***
					// Hide other filters in this group
					if (filter.visible() &&
						filter.parameter != filterActivated.parameter) {
						filter.hide()
					***REMOVED***
				***REMOVED***

				filterActivated.sortOptionsBy(activated)

				if (!cancelNotify) this.fireEvent('filter-activated', this, filterActivated)

				this.fireEvent('filters-gonna-show', filterActivated)
				// This assummes that the related filters are in this group
			***REMOVED***,

			hideAllFilters: function () {
				var filters = this.filters(),
					filter

				for (var i = filters.length; i--;) {
					filter = filters[i]
					if (filter.visible()) {
						filter.hide()
					***REMOVED***
				***REMOVED***
			***REMOVED***,

			togglePeriods: function () {
				if (this.period) {
					this.period.hidden(!this.visible())
				***REMOVED***

			***REMOVED***,

			getQuery: function () {
				var filters = this.filters(),
					filter,
					filtersString = ''

				for (var i = filters.length; i--;) {
					filter = filters[i]
					if (filter.active()) {
						filtersString += filter.getQuery() + '&'
					***REMOVED***
				***REMOVED***
				return filtersString
			***REMOVED***,

			selectFilterWith: function (type, id) {
				var filters = this.filters(),
					filter

				for (var i = filters.length, j; i--;) {
					filter = filters[i]
					if (filter.parameter === type) {
						if (id instanceof Array) {
							for (j = id.length; j--;) {
								filter.selectOption(id[j])
							***REMOVED***
						***REMOVED*** else {
							filter.selectOption(id)
						***REMOVED***
						return true
					***REMOVED***
				***REMOVED***
			***REMOVED***,

			hasFiltersActive: function () {
				var filters = this.filters(),
					filter

				for (var i = filters.length; i--;) {
					filter = filters[i]
					if (filter.active()) {
						return true
					***REMOVED***
				***REMOVED***

				return false
			***REMOVED***,

			unselectAllFilters: function (except, noNotify, filtersToExclude) {
				var filters = this.filters(),
					filter

				// console.log('unselect all filters in '+this.type, except, noNotify, filtersToExclude)
				for (var i = filters.length; i--;) {
					filter = filters[i]
					// console.log( filter.parameter, filter.active(), except )
					if (filter.active() && filter.parameter !== except) {
						// console.log( filtersToExclude.indexOf( filter.parameter ), filter.parameter )
						if ((filtersToExclude &&
							(filtersToExclude.indexOf(filter.parameter) !== -1)) ||
							!filtersToExclude) {
							filter.disActive()
						***REMOVED***
					***REMOVED***
				***REMOVED***

				if (!noNotify)
					this.fireEvent('unselect-all-filters', this.type, except, filtersToExclude)

				return false
			***REMOVED***,

			unselectExclusives: function (except, a, b) {
				// console.log('disactivating in FG '+except, a, b)
				var filters = this.filters(),
					filter

				for (var i = filters.length; i--;) {
					filter = filters[i]
					if (filter.active() && filter.parameter !== except &&
						filter.isExclusive && filter.excludes.indexOf(except) != -1) {
						filter.disActive()
					***REMOVED***
				***REMOVED***
			***REMOVED***


		***REMOVED***)

		return FiltersGroup
	***REMOVED***);
/*global define*/
define('app/utils/Utils', [], function () {
	// No more console errors ¬¬
	if (!('console' in window)) {
		window.console = {
			data: [],
			log: function () {
				this.data.push([].slice.call(arguments))
			***REMOVED***,
			warn: function () {
				this.data.push([].slice.call(arguments))
			***REMOVED***,
			error: function () {
				this.data.push([].slice.call(arguments))
			***REMOVED***
		***REMOVED***
	***REMOVED***


	return {
		// toCurrency: toCurrency
	***REMOVED***
***REMOVED***);
/*global ko, define, Class, Event*/
define('app/filters/FiltersManager', ['lib/mvc/Observable',
	'app/network/Services',
	'./FiltersGroup',
	'app/controller/appStates',
	'app/controller/AppState',
	'app/utils/Utils',
	'app/utils/territories'
],
	function (
		Observable,
		Services,
		FiltersGroup,
		appStates,
		AppState,
		Utils,
		territoriesCache,
		search
	) {

		/**
		 * Timer to constructuct the query
		 * (spcially when is activated a related group)
		 */
		var queryContructTimeout,

			FiltersManager = new Class(Observable, {

				initialize: function () {
					var self = this,
						type,
						filterGroup,
						key

					// Flags
					this.activated = false
					this.mode = null

					// Elements
					this.elems = {***REMOVED***
					this.elems.root = $('#controls')
					this.elems.search = $('#search')
					this.elems.filterResults = $('#filter-results')
					this.elems.resetFiltersWrapper = $('#reset-filters-wrapper')
					this.elems.resetFilters = $('#reset-filters')
					this.elems.initLink = $('#header .logo, #header .inicio, #footer .inicio')
					this.elems.share = $('#share')
					this.elems.generalSearch = $('#general-search')

					// Initialize the FiltersGroups
					this.filtersGroups = {***REMOVED***


					for (var i = 0; i < appStates.length; i++) {
						key = appStates[i]
						filterGroup = new FiltersGroup(key)
						this.filtersGroups[key] = filterGroup

						filterGroup.on('option-activated', function (filterActivated) {
							var fg
							// console.log('fired with '+filterActivated.parameter)
							// console.log('fired with '+filterActivated.active())
							if (filterActivated.active()) {
								for (var i = 0; i < appStates.length; i++) {
									fg = self.filtersGroups[appStates[i]]
									fg.unselectExclusives(filterActivated.parameter)
								***REMOVED***
							***REMOVED***
							self.notifyNewSearch(filterActivated)
						***REMOVED***)
						//for polygon zooming
						filterGroup.on('territory-activated', self.territoryActivated.bind(self))
						filterGroup.on('unselect-all-filters', self.unselectOtherFilterGroups.bind(this))
						filterGroup.on('filter-activated', self.checkActivated.bind(self))
						filterGroup.on('filters-gonna-show', self.fireEvent.bind(this, 'filters-gonna-show'))
						filterGroup.on('zoom-out', self.fireEvent.bind(this, 'zoom-out'))
					***REMOVED***

					AppState.on('update-filter-string', this.updateFilterString.bind(this))
					AppState.on('state-change', this.activate.bind(this))
					AppState.on('filter-reseted', this.unselectAll.bind(this))
					AppState.on('filter-activated', this.selectFilterWith.bind(this))
					AppState.on('territory-activated', this.territoryActivated.bind(this))

					AppState.on('view-group-change', function (bool) {
						self.viewMode.visible(bool)
					***REMOVED***)
					//AppState.on( 'new-search', this.notifyNewSearch.bind( this ) )

					// Periods are contained in each filtergroup
					// but they are also contained inside 
					// this array of periods for binding
					this.periods = ko.observableArray()
					this.periods = ko.observableArray()

					setTimeout(function () {
						Services.filters.forProjects().done(self.initializeModels.bind(self))
					***REMOVED***, 0)

					// Get the filters
					setTimeout(function () {
						self.fireEvent('loading-filters')
					***REMOVED***, 20)

					AppState.on('projects-loaded', this.updateStatistics.bind(this))


					function viewMode() {
						this.visible = ko.observable(true)
						this.toggleVisible = function (bool) {
							if (typeof bool == 'boolean' && bool === this.visible())
								return

							if (typeof bool == 'boolean')
								this.visible(bool)
							else
								this.visible(!this.visible())

							self.toggleControl(this.visible())

							if (bool instanceof Event) {
								if (bool.stopPropagation) {
									bool.stopPropagation()
								***REMOVED*** else if (typeof bool != 'boolean') {
									window.event.cancelBubble = true
								***REMOVED***
							***REMOVED***

							return false
						***REMOVED***
						return false
					***REMOVED***

					function searchQuery() {
						var that = this
						function notifyChange() {
							var fg, state = AppState.getState().state
							if (that.query() !== '') {
								// Query search is exclusive of filters search
								if (state == 'Recursos' || state == 'Produccion') {
									for (var i = 0; i < appStates.length; i++) {
										fg = self.filtersGroups[appStates[i]]
										// HEAD ---> fg.unselectAllFilters(null, true)
										fg.unselectAllFilters()
									***REMOVED***
									self.fireEvent('new-query')
								***REMOVED***
								// self.fireEvent('zoom-out')
								self.hideAllFilters()
								self.resetFilters(true)
							***REMOVED*** else {
							***REMOVED***

							self.notifyNewSearch()
						***REMOVED***
						this.query = ko.observable('')
						this.query.subscribe(notifyChange)
						this.search = notifyChange
					***REMOVED***

					this.searchQuery = new searchQuery()
					this.viewMode = new viewMode()

					this.resetFilters = ko.observable(false)

					ko.applyBindings(this.viewMode, $('#toggle-controls')[0])
					ko.applyBindings(this.searchQuery, $('#search')[0])

					this.elems.initLink.on('click', this.unselectAll.bind(this))

					// Get actual state
				***REMOVED***,

				activate: function (state, hash, params) {
					var root = this.elems.root,
						actions = root.find('.actions'),
						key,
						fg, i



					$('#header nav a').removeClass('selected')
					$('.main-nav ul a').removeClass('selected')
					if (state) {
						$('.menu-item-' + state.toLowerCase()).addClass('selected')
					***REMOVED*** else {
						$('.menu-item-inicio').addClass('selected')
					***REMOVED***

					// Hide other or all filtersGroups
					this.periods().forEach(function (period) {
						period.hidden(true)
					***REMOVED***)
					if (state !== '') {
						for (i = 0; i < appStates.length; i++) {
							key = appStates[i]
							if (key === state) {
								this.filtersGroups[key]
									.visible(true)
								actions.find('.search-' + key.toLowerCase())
									.removeClass('inactive')
							***REMOVED***
							else if (key !== 'Comunes') {
								this.filtersGroups[key]
									.visible(false)
								actions.find('.search-' + key.toLowerCase())
									.addClass('inactive')
							***REMOVED*** else {
								this.filtersGroups[key]
									.visible(true)
							***REMOVED***

						***REMOVED***
						root.find('.comunes').addClass('hidden')

						root.addClass('tabs-mode')
							.animate({
								marginLeft: 10,
								left: 10
							***REMOVED***)

						root.find('.statistics').addClass('small')
						root.find('.intro').hide()
						this.elems.search.show()
						this.elems.share.show()

						if (state == 'Fiscalizacion') {

							$('.buttons-filter-fiscalization').show()

							$('.wrap-gray').addClass('wrap-gray-fiscalization')

							var attr = $('.map-container').attr('data-option-subtipo');

							$('.map-container').addClass('fiscalizacion-mode')

							if (typeof attr == 'undefined' || attr == '' || attr == 'fiscalizacion-option-subtipo-') {

								$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo--1')

							***REMOVED***

							var textTmp = $('.buttons-filter-fiscalization a.active').attr('data-text-filter')

							$('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text(textTmp)


						***REMOVED*** else {
							$('.buttons-filter-fiscalization').hide()

							$('.wrap-gray').removeClass('wrap-gray-fiscalization')
						***REMOVED***

						if (state != 'Recursos') {
							$('.legend-resources').hide()
						***REMOVED*** else {
							$('.legend-resources').show()
						***REMOVED***

						if (state == 'Recursos' || state == 'Produccion' || state == 'Fiscalizacion') {
							root.find('.statistics').hide()
							$('#filter-results').hide()

						***REMOVED***
						else {
							root.find('.statistics').show()
							$('#filter-results').show()
						***REMOVED***
					***REMOVED*** else {
						for (i = 0; i < appStates.length; i++) {
							//debugger;
							this.filtersGroups[appStates[i]]
								.visible(false)
						***REMOVED***
						root.removeClass('tabs-mode')
						root.find('.statistics').removeClass('small')
						root.find('.statistics').show()
						root.find('.intro').show()
						$('#filter-results').hide()
						this.elems.search.hide()
						this.elems.share.hide()

						if (this.periods().length) {
							this.periods()[0].hidden(false)
							// root.find('.statistics').addClass('small')
						***REMOVED***
					***REMOVED***

					// Check reset here too
					this.resetFilters(false)

					for (i = 0; i < appStates.length; i++) {
						fg = this.filtersGroups[appStates[i]]

						if (fg && fg.visible() && fg.hasFiltersActive()) {
							this.resetFilters(true)
							break;
						***REMOVED***
					***REMOVED***

					if (this.searchQuery.query()) this.resetFilters(true)
				***REMOVED***,

				toggleControl: function (bool) {
					this.activated = true

					if (bool) {
						this.elems.root.animate({ marginLeft: 0, left: 0 ***REMOVED***)
					***REMOVED***
					else {
						//FIXME list mode
						this.elems.root.animate({ marginLeft: 0, left: -(this.elems.root.width()) ***REMOVED***)
						this.hideAllFilters()
						if (AppState.listMode)
							AppState.setListMode(false)
					***REMOVED***

					return false
				***REMOVED***,

				initializeModels: function (response) {
					var rawData = response.filters,
						tempArray = [],
						self = this, sectionName

					if (rawData) {
						setTimeout(function () {
							var length = rawData.length,
								i = 0, j = 0,
								data,
								filterInstance,
								st = AppState.getState(),
								territory

							for (; i < length; i++) {
								data = rawData[i]
								sectionName = data.seccionAplicativo
								if (sectionName.match(/fiscalizacion/i)) {
									sectionName = 'Fiscalizacion'
								***REMOVED***
								filterInstance = self.filtersGroups[sectionName]
									.addFilter(data)
								if (data.parameter === 'municipio' ||
									data.parameter === 'departamento' ||
									data.parameter === 'region') {
									for (j = 0; j < data.items.length; j++) {
										territory = data.items[j]
										territoriesCache[data.parameter][territory.value] = {
											'id': territory.value,
											'name': territory.name
										***REMOVED***
									***REMOVED***
								***REMOVED***

								// All periods:
								// period, periodo, periodos, periodosRecursos...
								if (data.parameter.indexOf('period') === 0) {
									self.periods.push(filterInstance)
								***REMOVED***
							***REMOVED***

							// Assign the array to observableArray
							for (i = 0; i < appStates.length; i++) {
								self.filtersGroups[appStates[i]].instantiateObservable()
							***REMOVED***

							setTimeout(function () {
								function byId(id) {
									return document.getElementById(id)
								***REMOVED***

								var groupTypes = FiltersGroup.types,
									key, typeName,
									rootElement = $('#filters-groups-list').removeClass('loading')[0],
									originalTemplate = $(rootElement.children[0]).remove(),
									filterElement
								// TODO actualizar el html para que pinte bien los bindings
								// When period changes... we have to load new graphics
								ko.applyBindings(self, byId('map-select-list-period'))
								ko.applyBindings(self, byId('info-select-list-period'))
								ko.applyBindings(self, byId('filters-stats-list-info'))


								// Dynamic template generation
								for (var i = 0; i < appStates.length; i++) {
									key = appStates[i]
									filterElement = originalTemplate.clone()
									filterElement.attr('data-bind',
										filterElement.attr('data-bind')
											.replace(/(filtersGroups)/g, '$1.' + key))
									rootElement.appendChild(filterElement[0])
								***REMOVED***
								ko.applyBindings(self, rootElement)

								ko.applyBindings(self, self.elems.resetFiltersWrapper[0])
								self.fireEvent('filters-loaded')
								$(rootElement.children[0]).addClass('comunes')
							***REMOVED***, 0)

							//At the end
							self.activate(AppState.getState().state, st.hash, st.params)
						***REMOVED***, 0)
					***REMOVED***

				***REMOVED***,

				territoryActivated: function () {
					this.fireEvent.apply(this, ['territory-activated'].concat([].slice.call(arguments)))
				***REMOVED***,

				notifyNewSearch: function (param) {
					//Recorrer filtros y armar nuevo query
					var self = this

					clearTimeout(queryContructTimeout)
					queryContructTimeout = setTimeout(function () {
						var state = AppState.getState().state
						// In resources query search is exclusive
						if (state == 'Recursos') {
							if (self.searchQuery.query() && self.onlyGetFiltersString()) {
								self.searchQuery.query('')
							***REMOVED***
						***REMOVED***
						AppState.setQuery(encodeURIComponent(self.searchQuery.query()))
						self.resetFilters(false)
						AppState.setFiltersString(self.getQueryFilters())
					***REMOVED***, 0)

				***REMOVED***,

				updateFilterString: function () {
					AppState.setFiltersString(this.getQueryFilters())
				***REMOVED***,

				getQueryFilters: function () {
					var filtersString = '',
						i = 0,
						fg, hasVisible = false

					for (i = 0; i < appStates.length; i++) {
						fg = this.filtersGroups[appStates[i]]
						if (fg.visible()) {
							hasVisible = true
							if (fg.hasFiltersActive()) {
								this.resetFilters(true)
								break;
							***REMOVED***
						***REMOVED***
					***REMOVED***

					if (this.searchQuery.query()) this.resetFilters(true)

					for (i = 0; i < appStates.length; i++) {
						fg = this.filtersGroups[appStates[i]]
						if (fg.visible()) {
							filtersString += fg.getQuery()

						***REMOVED***
					***REMOVED***
					if (!hasVisible) {
						fg = this.filtersGroups['Proyectos']
						if (fg.hasFiltersActive()) {
							filtersString += fg.getQuery()
						***REMOVED***
					***REMOVED***




					return filtersString.replace(/&$/, '')
				***REMOVED***,

				onlyGetFiltersString: function () {
					var filtersString = '',
						i
					for (i = 0; i < appStates.length; i++) {
						fg = this.filtersGroups[appStates[i]]
						if (fg.visible()) {
							filtersString += fg.getQuery()
						***REMOVED***
					***REMOVED***

					//debugger;

					return filtersString
				***REMOVED***,

				unselectAll: function (noNotify, onlyClean, noResetQuery) {
					var fg,
						i

					// if( !this.filtersProjects ) return
					if (noNotify !== true) this.fireEvent('filters-reseted')

					for (i = 0; i < appStates.length; i++) {
						fg = this.filtersGroups[appStates[i]]
						if (fg.visible() || (onlyClean === true)) {
							fg.unselectAllFilters()
						***REMOVED***
					***REMOVED***

					$('.filter-list .filter input[type="text"]').val('').trigger('keyup')
					$('.buttons-filter-fiscalization a').removeClass('active')
					$('.buttons-filter-fiscalization .filter-to-todos').addClass('active')
					$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo--1')



					//if( onlyClean !== true ) $('html, body').animate({ scrollTop: 0 ***REMOVED***, 200);
					if (noResetQuery !== true) this.searchQuery.query('')

					if (onlyClean !== true) {
						this.hideAllFilters()
						location.hash = location.hash.replace(/\?.*/, '')
					***REMOVED***
				***REMOVED***,

				unselectOtherFilterGroups: function (type, except, filtersToExclude) {
					// console.log('unselectOtherFilterGroups '+except)
					var i, fg
					for (i = 0; i < appStates.length; i++) {
						fg = this.filtersGroups[appStates[i]]
						if (fg.type !== type) {
							fg.unselectAllFilters(except, 'noNotify', filtersToExclude)
						***REMOVED***
					***REMOVED***
					// this.fireEvent('zoom-out')
				***REMOVED***,

				updateStatistics: function (data) {
					var root = this.elems.root

					this.fireEvent('loaded-filters')

					if (!this.activated) {
						this.activated = true
					***REMOVED***
					root.find('#collected-money').html(parseInt(data.collectedMoney, 10).toCurrency())
					root.find('#approved-money').html(parseInt(data.approvedMoney, 10).toCurrency())
					root.find('#approved-money-home').html(parseInt(data.approvedMoney, 10).toCurrency())
					root.find('#approved-projects').html(data.approvedProjects)
					root.find('#approved-projects-home').html(data.approvedProjects)
					root.find('#total-sources').html(parseInt(data.approvedMoneyTotal, 10).toCurrency())
					//TODO update search results
				***REMOVED***,

				hideAllFilters: function () {
					var fg,
						i

					for (i = 0; i < appStates.length; i++) {
						fg = this.filtersGroups[appStates[i]]
						fg.hideAllFilters()
					***REMOVED***
				***REMOVED***,

				checkActivated: function (filterGroup, filterActivated) {
					var fg


					for (var i = 0; i < appStates.length; i++) {
						fg = this.filtersGroups[appStates[i]]
						if (fg.type !== filterGroup.type) {
							fg.hideOtherFilters(filterActivated, 'cancelNotify')
						***REMOVED***
					***REMOVED***
				***REMOVED***,

				/**
				 * Selects a filter from the filtersgroups
				 * @param  {String***REMOVED*** type
				 * @param  {String***REMOVED*** id
				 */
				selectFilterWith: function (type, id) {
					var fg, i

					if (type == 'query') {
						this.searchQuery.query(decodeURIComponent(id))
						return
					***REMOVED*** else {
						for (i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]
							// I suppose that all parameters name are exclusive
							// So, no validation for visibility or something like that
							// if( fg.visible() )
							if (fg.selectFilterWith(type, id)) return
						***REMOVED***
					***REMOVED***
				***REMOVED***
			***REMOVED***)

		//console.log( '--------->', new FiltersManager())

		return new FiltersManager()
	***REMOVED***);
define('app/utils/MailSharer', ['app/network/Services', 'app/utils/Modal'], function (Services, Modal) {
	var mailButtons = $('[data-share-by-email]'),
		sharerContainer = $('<form class="mail-sharer">' +
			'<h3 class="title">Comparte por Correo Electrónico</h3>' +
			'<div class="field">' +
			'<label for="field-email">Correo electrónico:</label>' +
			'<input type="email" id="field-email" name="to">' +
			'</div>' +
			'<div class="field">' +
			'<label for="field-message">Mensaje:</label>' +
			'<textarea id="field-message" name="subject"></textarea>' +
			'</div>' +
			'<div class="txt-right"><button type="submit">Enviar</button></div>' +
			'<div class="loader"></div>' +
			'</form>')

	mailButtons.on('click', reveal)
	sharerContainer.on('submit', send)

	function reveal() {
		var $this = $(this)
		sharerContainer
			.appendTo(document.body)
			.css({
				left: $this.offset().left,
				top: $this.offset().top
			***REMOVED***)
			.show()
		$(document).on('click', hide)
		return false
	***REMOVED***
	function send(evt) {
		var pre = location.href + '\n\n'
		sharerContainer.addClass('loading')
		Services.sendByEmail(
			'to=' +
			encodeURIComponent(sharerContainer.find('#field-email').val()) +
			'&body=' +
			encodeURIComponent(pre + sharerContainer.find('#field-message').val())
		)
			.done(updateUserOk)
			.fail(updateUserError)

		if (evt.preventDefault) evt.preventDefault()
		else evt.returnValue = false
		return false
	***REMOVED***
	function hide(evt) {
		if (!evt || $(evt.target).parents('.mail-sharer').length == 0) {
			sharerContainer
				.hide()
				.detach()
			$(document).off('click', hide)
		***REMOVED***
	***REMOVED***

	function updateUserOk(response) {
		sharerContainer.removeClass('loading')

		if (!response.status) return

		sharerContainer.find('#field-email').val('')
		sharerContainer.find('#field-message').val('')

		var message = response.message ||
			('Esta página ha sido compartida con éxito al correo: ' +
				sharerContainer.find('#field-email').val() + '.')

		hide()
		Modal.info(message).show()
	***REMOVED***
	function updateUserError() {
		sharerContainer.removeClass('loading')
		// hide()
	***REMOVED***
***REMOVED***);
define('utils/beta', [
	'app/utils/Modal'
],
	function (Modal) {
		var notif = $('.beta-notification'),
			header = notif.find('.beta-notification__header'),
			close = notif.find('.close-notification'),
			desc = notif.find('.beta-notification__description')

		header.on('click', toggleDescription)
		close.on('click', toggleDescription)

		function toggleDescription() {
			desc.slideToggle()
			header.toggleClass('open')
		***REMOVED***

		$(document)
			.on('mouseenter', '.tooltip', function () {
				$('.info-tool', this).fadeIn('fast')
			***REMOVED***)
			.on('mouseleave', '.tooltip', function () {
				$('.info-tool', this).fadeOut('fast')
			***REMOVED***)

		var modal = new Modal('<iframe src="//player.vimeo.com/video/98644859?portrait=0&amp;badge=0" width="700" height="410" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>');
		//style = modal.getElement().style

		//style.width = 700
		//style.height = 410

		$('.get-video-regalias').on('click', function () {
			modal.show()
			$('.modal .wrapper').css('width', 700)
		***REMOVED***)


		var $tabbed = $('.main-content__consolidated-tabbed'),
			$getTab = $('.main-content__type-filters__link')


		$getTab.click(function () {

			var $this = $(this),
				href = $(this).attr('href');

			if (href == "#/fiscalizacion") {
				$tabbed.fadeIn()//.addClass('show-tabbed')

			***REMOVED*** else {
				$tabbed.fadeOut()//.addClass('show-tabbed')

			***REMOVED***

			return false;

		***REMOVED***);


	***REMOVED***);

//---------------------------------
define('location_profile', [
	'app/network/Services',
	'app/network/urlsMap',
	'comunes'
],
	function (
		Services,
		urlsMap,
		comunes
	) {

		if (location.pathname.indexOf('LocationProfile') !== -1) {
			var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
			var periodos = JSON.parse(document.body.getAttribute('data-periods'));
			var proyectos_eje = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));
			var filtros_aux = JSON.parse(document.body.getAttribute('data-filters'));
			var projectsPerEstado = JSON.parse(document.body.getAttribute('data-projectsPerEstado'));
			var ProjectsPerSectorGroup = JSON.parse(document.body.getAttribute('data-projectsPerSectorGroup'));
			var locationData = JSON.parse(document.body.getAttribute('data-location'));

			var searchProjectsList = '/api/serviciosproyectos/listado';

			//si se quiere usar bindings para el html
			//this.root = $('#projects-list-view');
			inicializaDatos();

			pagina_actual = 1;

			AgregarFiltros();
			comunes.load_filtro_orden("divFiltrosFichaOrdena", "filterByEjecucion", true);
			////---listado proyectos superior
			cargarProyectos(1);

			///seccion todos los proyectos
			loadConsolidaEstados();

			loadProyectosPorSector();

			///---listado proyectos ejecucion
			loadProyectosEjecucion(proyectos_eje);
			configuraFiltrosEje();
			configurarEnlaceLocation();


		***REMOVED***
		if (location.pathname.indexOf('PerfilSector') !== -1) {
			var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
			var periodos = JSON.parse(document.body.getAttribute('data-periods'));
			var proyectos_eje = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));
			var filtros_aux = JSON.parse(document.body.getAttribute('data-filters'));
			var projectsPerEstado = JSON.parse(document.body.getAttribute('data-projectsPerEstado'));
			var ProjectsPerSectorGroup = JSON.parse(document.body.getAttribute('data-projectsPerSectorGroup'));
			var locationData = JSON.parse(document.body.getAttribute('data-location'));

			var searchProjectsList = '/api/serviciosproyectos/listado';

			//si se quiere usar bindings para el html
			//this.root = $('#projects-list-view');
			inicializaDatos();

			pagina_actual = 1;

			AgregarFiltros();
			comunes.load_filtro_orden("divFiltrosFichaOrdena", "filterByEjecucion", true);
			////---listado proyectos superior
			cargarProyectos(1);

			///seccion todos los proyectos
			loadConsolidaEstados();

			loadProyectosPorDepartamento();

			///---listado proyectos ejecucion
			loadProyectosEjecucionSectores(proyectos_eje);
			configuraFiltrosEje();
			configurarEnlaceLocation();


		***REMOVED***

		function inicializaDatos() {
			$("#divNoExistenEjec").hide();
			//imagen background
			var imageURL = locationData[0].imageXL;
			//imageURL = "../../content/img/location/prueba_location_4.jpg";
			if (imageURL != "") {
				$(".s0-section").css("background", "url('" + imageURL + "') no-repeat top left");
				$(".s0-section").css("color", "#FFF");
			***REMOVED*** else {
				$(".s0-section").css("background", "url('" + "../../content/img/location/location-image.jpg" + "') no-repeat top left");
				$(".s0-section").css("color", "#FFF");

			***REMOVED***


		***REMOVED***

		function configurarEnlaceLocation() {


			$('.enlace_ficha_parent').each(function (i, e) {
				$(e).bind('click', function () {
					var cad_aux = "prueba";
					var enlace_url = "../../localizacion/LocationProfile#/";
					var anyo = (new Date).getFullYear() - 1;
					var location_id = $(this).attr("location_id");
					document.cookie = "location_id=" + location_id + ";path=/;";
					var tipo = $(this).attr("tipo").toLowerCase();
					//&municipio=0000&departamento=00&periods=2016&sector=2
					if (tipo == "departamento") {
						//departamento
						enlace_url += "?" + "departamento=" + location_id
					***REMOVED*** else {
						//municipio
						enlace_url += "?" + "municipio=" + location_id
					***REMOVED***

					location.href = enlace_url;
					window.location.reload(true);

				***REMOVED***);
			***REMOVED***)
			$('.enlace_covid_location').each(function (i, e) {
				$(e).bind('click', function () {
					var anyo = (new Date).getFullYear();
					var enlace_url = "../../localizacion/Covid19Location/";
					var location_id = $(this).attr("location_id");
					document.cookie = "location_id=" + location_id + ";path=/;";
					var tipo = $(this).attr("tipo").toLowerCase();
					if (tipo == "departamento") {
						//departamento
						enlace_url += "?" + "departamento=" + location_id
					***REMOVED*** else {
						//municipio
						enlace_url += "?" + "municipio=" + location_id
					***REMOVED***
					window.location.href = enlace_url;
				***REMOVED***);
			***REMOVED***)


		***REMOVED***
		function loadProyectosPorSector() {

			for (var i = 0; i < ProjectsPerSectorGroup.length; i++) {
				ProjectsPerSectorGroup[i].value = parseFloat(ProjectsPerSectorGroup[i].value);
				ProjectsPerSectorGroup[i].rawValue = parseFloat(ProjectsPerSectorGroup[i].rawValue);
			***REMOVED***
			var visualization = d3plus.viz()
				.container("#divGraphProySector")
				.data(ProjectsPerSectorGroup)
				.type({ "value": "tree_map", "mode": "sqarify" ***REMOVED***)
				.id({ "value": ["labelGroup", "label"], "grouping": true ***REMOVED***)
				.depth(1)
				.size("rawValue")
				.font({ "family": "inherit" ***REMOVED***)
				.format({
					"text": function (text, params) {
						if (text == "rawValue") {
							return "Proyectos";
						***REMOVED*** else if (text == "label") {
							return "Estado";
						***REMOVED*** else if (text == "labelGroup") {
							return "Sector";
						***REMOVED*** else if (text == "share") {
							return "Participación";
						***REMOVED***
						else if (text == "including") {
							return "Incluye";
						***REMOVED***
						else {
							return d3plus.string.title(text, params);
						***REMOVED***
					***REMOVED***
				***REMOVED***)
				.background("rgba(255,255,255,0)")
				.labels({ "align": "left", "valign": "top", "font": { "family": "inherit", "size": 14, "weight": "bold" ***REMOVED***, "resize": true ***REMOVED***)
				.tooltip(["labelGroup", "label"])   // list the keys to show in tooltip
				.color("labelGroup")
				.color({
					"scale": ["#2F4556", "#FF3637", "#31655E", "#00C9B1", "#DD1A8B", "#DD4E29", "#D3A034", "#FFB886", "#FFF190", "#80AFE6", "#73323D", "##5B73DD"],
				***REMOVED***)
				.height({ "max": 419, "small": 200, "secondary": 100, "value": 419 ***REMOVED***)
				.legend({
					"align": "middle",
					"size": [50, 80],
					"labels": true,
					"value": true,
					"filters": false,
					"data": true
					, "order": {
						"sort": "desc",
						"value": "size"
					***REMOVED***
				***REMOVED***)
				.resize(true)
				.draw()

		***REMOVED***

		function loadProyectosPorDepartamento() {

			for (var i = 0; i < ProjectsPerSectorGroup.length; i++) {
				ProjectsPerSectorGroup[i].value = parseFloat(ProjectsPerSectorGroup[i].value);
				ProjectsPerSectorGroup[i].rawValue = parseFloat(ProjectsPerSectorGroup[i].rawValue);
			***REMOVED***
			var visualization = d3plus.viz()
				.container("#divGraphProySector")
				.data(ProjectsPerSectorGroup)
				.type({ "value": "tree_map", "mode": "sqarify" ***REMOVED***)
				.id({ "value": ["labelGroup", "label"], "grouping": true ***REMOVED***)
				.depth(1)
				.size("rawValue")
				.font({ "family": "inherit" ***REMOVED***)
				.format({
					"text": function (text, params) {
						if (text == "rawValue") {
							return "Proyectos";
						***REMOVED*** else if (text == "label") {
							return "Estado";
						***REMOVED*** else if (text == "labelGroup") {
							return "Departamento";
						***REMOVED*** else if (text == "share") {
							return "Participación";
						***REMOVED***
						else if (text == "including") {
							return "Incluye";
						***REMOVED***
						else {
							return d3plus.string.title(text, params);
						***REMOVED***
					***REMOVED***
				***REMOVED***)
				.background("rgba(255,255,255,0)")
				.labels({ "align": "left", "valign": "top", "font": { "family": "inherit", "size": 14, "weight": "bold" ***REMOVED***, "resize": true ***REMOVED***)
				.tooltip(["labelGroup", "label"])   // list the keys to show in tooltip
				.color("labelGroup")
				.color({
					"scale": ["#2F4556", "#FF3637", "#31655E", "#00C9B1", "#DD1A8B", "#DD4E29", "#D3A034", "#FFB886", "#FFF190", "#80AFE6", "#73323D", "##5B73DD"],
				***REMOVED***)
				.height({ "max": 419, "small": 200, "secondary": 100, "value": 419 ***REMOVED***)
				.legend({
					"align": "middle",
					"size": [50, 80],
					"labels": true,
					"value": true,
					"filters": false,
					"data": true
					, "order": {
						"sort": "desc",
						"value": "size"
					***REMOVED***
				***REMOVED***)
				.resize(true)
				.draw()

		***REMOVED***

		function loadConsolidaEstados() {
			var txtConsolidado = "";
			var txt_aux = "";
			//grafica d3
			for (var i = 0; i < projectsPerEstado.length; i++) {
				if (i == 0) {
					txt_aux += "There are " + projectsPerEstado[i].rawValue.toString() + " projects";
				***REMOVED*** else {
					if (i == projectsPerEstado.length - 1) {
						txt_aux += " and " + projectsPerEstado[i].rawValue.toString();
					***REMOVED*** else {
						txt_aux += " " + projectsPerEstado[i].rawValue.toString();
					***REMOVED***
				***REMOVED***
				projectsPerEstado[i].value = parseFloat(projectsPerEstado[i].value);
				projectsPerEstado[i].rawValue = parseFloat(projectsPerEstado[i].rawValue);
				if (projectsPerEstado[i].label.toUpperCase() == "EN ESTUDIO") {
					txtConsolidado += txt_aux + " que se encuentran en estudio";
				***REMOVED*** else if (projectsPerEstado[i].label.toUpperCase() == "RECHAZADO") {
					txtConsolidado += txt_aux + " " + " fueron rechazados";
				***REMOVED***
				else if (projectsPerEstado[i].label.toUpperCase() == "APROBADO") {
					txtConsolidado += txt_aux + " " + " que fueron aprobados";
				***REMOVED*** else if (projectsPerEstado[i].label.toUpperCase() == "EN EJECUCIÓN" || projectsPerEstado[i].label.toUpperCase() == "EN EJECUCION") {
					txtConsolidado += txt_aux + " " + " en ejecución";
				***REMOVED*** else {
					//finalizado
					txtConsolidado += txt_aux + " han sido ejecutados.";
				***REMOVED***
			***REMOVED***
			var consolidadoPunto = txtConsolidado.split('.');
			if (txtConsolidado != "" && consolidadoPunto.length == 1) txtConsolidado = txtConsolidado.trim() + ".";

			var txtDescriptivo_aux = $("#nomLocation").text() + " es la capital y la ciudad más poblada de la República del Paraguay. El área metropolitana, llamada Gran Asunción, incluye las ciudades de San Lorenzo, Fernando de la Mora, Lambaré, Luque, Mariano Roque Alonso, Ñemby, San Antonio, Limpio, Capiatá y Villa Elisa, que forman parte del Departamento Central. El área metropolitana tiene más de 2 millones de habitantes.";
			var txtDescriptivo = "";
			var div_txtPadre = d3.select("#divTxtTodosProy")
			div_txtPadre.append("h2")
				.text("All Projects")
			div_txtPadre.append("p")
				.text(txtDescriptivo)
			div_txtPadre.append("p")
				.text(txtConsolidado);
			make_viz();



		***REMOVED***
		function make_viz() {

			var visualization = d3plus.viz()
				.container("#divGraphTodosProy")
				.data(projectsPerEstado)
				.type({
					"value": "tree_map",
					"mode": "slice"

				***REMOVED***)
				.id("label")
				.size("rawValue")
				.text("label")
				.font({ "family": "inherit" ***REMOVED***)
				.format({
					"text": function (text, params) {
						if (text === "rawValue") {
							return "Proyectos";
						***REMOVED***
						else {
							return d3plus.string.title(text, params);
						***REMOVED***

					***REMOVED***
				***REMOVED***)
				//.id(["group","label"]) agrupar por dos items
				.background("#E3E3E3")
				.labels({
					"align": "left", "valign": "top", "font": {
						"family": "inherit"
					***REMOVED***
				***REMOVED***)
				.tooltip({
					"share": false,
					"font": {
						size: "auto"
					***REMOVED***,
				***REMOVED***)
				//.height({"smal":250 ***REMOVED***)
				.height({ "max": 280, "small": 200, "secondary": 100, "value": 280 ***REMOVED***)
				.color({
					"scale": ["#2F4556", "#E51C3C", "#B1DAAE", "#255955"],
				***REMOVED***)
				.legend(false)
				.resize(true)
				.draw()
		***REMOVED***

		function loadProyectosEjecucion(resultados) {
			$("#divNoEncontradoEjec").hide();
			$("#divNoExistenEjec").hide();
			if (resultados.length > 0) {
				var div_proy = d3.select("#divContenedorFichas")
				div_proy.append("div")
					.attr("class", "row")
					.append("div")
					.attr("class", "col-md-12")
					.append("div")
					.attr("id", "Carousel")
					.attr("class", "carousel slide")
					.append("div")
					.attr("id", "divContenidoFichas")
					.attr("class", "carousel-inner")

				if ($("#divContenedorFichas").length > 0) {
					var cont_aux = 0;
					var nom_fila = "divFilaProy_" + cont_aux.toString()
					var clase_active = "item";
					for (var i = 0; i < resultados.length; i++) {
						if (i == 0) {
							clase_active = "item active";
						***REMOVED*** else {
							clase_active = "item";
						***REMOVED***
						var modulo = (i % 4);
						if (modulo == 0) {
							nom_fila = "divFilaProy_" + cont_aux.toString()
							var nom_col = "ficha_" + i.toString();
							var div_proy_item = d3.select("#divContenidoFichas")
								.append("div")
								.attr("class", clase_active)
							var div_fila = div_proy_item.append("div")
								.attr("id", nom_fila)
								.attr("class", "row-fluid")
							div_fila.append("div")
								.attr("id", nom_col)
								.attr("class", "col-md-3")
							comunes.load_ficha_unica(resultados[i], nom_col, nom_fila);
							cont_aux += 1;
						***REMOVED*** else {
							var nom_col = "ficha_" + i.toString();
							if ($("#" + nom_fila).length > 0) {
								d3.select("#" + nom_fila)
									.append("div")
									.attr("class", "col-md-3")
									.attr("id", nom_col)
								comunes.load_ficha_unica(resultados[i], nom_col, nom_fila);
							***REMOVED***
						***REMOVED***

					***REMOVED***
				***REMOVED***

				//add data-slide
				var divSlide = d3.select("#Carousel")
				divSlide.append("a")
					.attr("data-slide", "prev")
					.attr("href", "#Carousel")
					.attr("class", "left carousel-control")
					.append("span")
					.attr("class", "glyphicon glyphicon-chevron-left")
				divSlide.append("a")
					.attr("data-slide", "next")
					.attr("href", "#Carousel")
					.attr("class", "right carousel-control")
					.append("span")
					.attr("class", "glyphicon glyphicon-chevron-right")
			***REMOVED*** else {
				//no existen proyectos en ejecucion
				$("#divNoExistenEjec").show();
			***REMOVED***
		***REMOVED***

		function loadProyectosEjecucionSectores(resultados) {
			if (resultados.length > 0) {
				$("#divNoExistenEjec").hide();
				var div_proy = d3.select("#divContenedorFichas")
				div_proy.append("div")
					.attr("class", "row")
					.append("div")
					.attr("class", "col-md-12")
					.append("div")
					.attr("id", "Carousel")
					.attr("class", "carousel slide")
					.append("div")
					.attr("id", "divContenidoFichas")
					.attr("class", "carousel-inner")

				if ($("#divContenedorFichas").length > 0) {
					var cont_aux = 0;
					var nom_fila = "divFilaProy_" + cont_aux.toString()
					var clase_active = "item";
					for (var i = 0; i < resultados.length; i++) {
						if (i == 0) {
							clase_active = "item active";
						***REMOVED*** else {
							clase_active = "item";
						***REMOVED***
						var modulo = (i % 4);
						if (modulo == 0) {
							nom_fila = "divFilaProy_" + cont_aux.toString()
							var nom_col = "ficha_" + i.toString();
							var div_proy_item = d3.select("#divContenidoFichas")
								.append("div")
								.attr("class", clase_active)
							var div_fila = div_proy_item.append("div")
								.attr("id", nom_fila)
								.attr("class", "row-fluid")
							div_fila.append("div")
								.attr("id", nom_col)
								.attr("class", "col-md-3")
							comunes.load_ficha_unica_sector(resultados[i], nom_col, nom_fila);
							cont_aux += 1;
						***REMOVED*** else {
							var nom_col = "ficha_" + i.toString();
							if ($("#" + nom_fila).length > 0) {
								d3.select("#" + nom_fila)
									.append("div")
									.attr("class", "col-md-3")
									.attr("id", nom_col)
								comunes.load_ficha_unica_sector(resultados[i], nom_col, nom_fila);
							***REMOVED***
						***REMOVED***

					***REMOVED***
				***REMOVED***

				//add data-slide
				var divSlide = d3.select("#Carousel")
				divSlide.append("a")
					.attr("data-slide", "prev")
					.attr("href", "#Carousel")
					.attr("class", "left carousel-control")
					.append("span")
					.attr("class", "glyphicon glyphicon-chevron-left")
				divSlide.append("a")
					.attr("data-slide", "next")
					.attr("href", "#Carousel")
					.attr("class", "right carousel-control")
					.append("span")
					.attr("class", "glyphicon glyphicon-chevron-right")
			***REMOVED*** else {
				//no existen proyectos en ejecucion
				$("#divNoExistenEjec").show();
			***REMOVED***
		***REMOVED***

		function configuraFiltrosEje() {
			if ($("#filterByEjecucion").length > 0) {
				$('#filterByEjecucion li').bind('click onclick', function () {
					var objJson = proyectos_eje;
					var sorted = objJson;
					var val_Sel = $(this).text().toUpperCase();
					var opc_sector = $("#filterEjecSector").find("li.selected").attr("id");
					var objFiltered = objJson;

					if (opc_sector > 0) {
						objFiltered = $.grep(objJson, function (h) {
							return h.IdSector == opc_sector
						***REMOVED***);
					***REMOVED***


					if (val_Sel != "") {
						if (val_Sel == "AMOUNT") {
							sorted = $(objFiltered).sort(ordenaMontoDesc);
							var div_proyectos = d3.select("#divContenidoFichas");
							div_proyectos.html("");
							loadProyectosEjecucion(sorted);
						***REMOVED***
						else if (val_Sel == "PROGRESS") {
							sorted = $(objFiltered).sort(ordenaProgresoDesc);
							var div_proyectos = d3.select("#divContenidoFichas");
							div_proyectos.html("");
							loadProyectosEjecucion(sorted);

						***REMOVED*** else {
							//fecha
							sorted = $(objFiltered).sort(ordenaFechaIniDesc);
							var div_proyectos = d3.select("#divContenidoFichas");
							div_proyectos.html("");
							loadProyectosEjecucion(sorted);
						***REMOVED***

					***REMOVED*** else {
						//opcion vacia
						loadProyectosEjecucion(sorted);
					***REMOVED***

				***REMOVED***);
			***REMOVED***
		***REMOVED***




		///si se quiere realizar carga directa desde el controlador, sin web api
		function AgregarFiltros_proy() {
			var items_result = filtros_aux;
			for (var i = 0; i < items_result.length; i++) {
				if (items_result[i].parameter == "estado") {
					addFiltro("filters_groups_etapa", "filterByEtapa", items_result[i].item_name, items_result[i].item_value);

				***REMOVED***
				else if (items_result[i].parameter == "sector") {
					addFiltro("filters_groups_sector", "filterBySector", items_result[i].item_name, items_result[i].item_value);
					addFiltro("divFiltrosFichaSector", "filterEjecSector", items_result[i].item_name, items_result[i].item_value);
				***REMOVED***
				else if (items_result[i].parameter == "departamento") {
					addFiltro("filters_groups_departamento", "filterByDepartamento", items_result[i].item_name, items_result[i].item_value);
					addFiltro("divFiltrosFichaDepartamento", "filterEjecDepartamento", items_result[i].item_name, items_result[i].item_value);
					addFiltro("divFiltrosFichaDepartamentoSector", "filterEjecDepartamentoSector", items_result[i].items[j].name, items_result[i].items[j].value);
				***REMOVED***
			***REMOVED***
			$('#filterByEtapa li,#filterBySector li,#filterByDepartamento li').bind('click onclick', function (e) {
				var val_Sel = $(this).attr("id");
				if (val_Sel != "" && val_Sel != "0") {
					var target = $(e.target);
					target.addClass("selected").siblings().removeClass("selected");
				***REMOVED***
			***REMOVED***);

		***REMOVED***




		function AgregarFiltros() {
			var filters = Services.filters.forProjects().done(function (result) {
				var items_result = result.filters;

				for (var i = 0; i < items_result.length; i++) {
					if (items_result[i].parameter == "estado") {
						for (var j = 0; j < items_result[i].items.length; j++) {
							addFiltro("filters_groups_etapa", "filterByEtapa", items_result[i].items[j].name, items_result[i].items[j].value);
						***REMOVED***
					***REMOVED***
					else if (items_result[i].parameter == "sector") {
						for (var j = 0; j < items_result[i].items.length; j++) {
							addFiltro("filters_groups_sector", "filterBySector", items_result[i].items[j].name, items_result[i].items[j].value);
							addFiltro("divFiltrosFichaSector", "filterEjecSector", items_result[i].items[j].name, items_result[i].items[j].value);
						***REMOVED***
					***REMOVED***
					else if (items_result[i].parameter == "departamento") {
						for (var j = 0; j < items_result[i].items.length; j++) {
							addFiltro("filters_groups_departamento", "filterByDepartamento", items_result[i].items[j].name, items_result[i].items[j].value);
							addFiltro("divFiltrosFichaDepartamento", "filterEjecDepartamento", items_result[i].items[j].name, items_result[i].items[j].value);
							addFiltro("divFiltrosFichaDepartamentoSector", "filterEjecDepartamentoSector", items_result[i].items[j].name, items_result[i].items[j].value);
						***REMOVED***
					***REMOVED***
				***REMOVED***
				$('#filterByEtapa li,#filterBySector li,#filterByDepartamento li').bind('click onclick', function (e) {
					var val_Sel = $(this).attr("id");
					if (val_Sel != "" && val_Sel != "0") {
						var target = $(e.target);
						target.addClass("selected").siblings().removeClass("selected");
					***REMOVED***
				***REMOVED***);

				$('#filterEjecSector li').bind('click onclick', function () {
					$("#divNoEncontradoEjec").hide();
					var val_Sel = $(this).attr("id");
					var objFiltered = [];
					if (val_Sel != "") {
						var objJson = proyectos_eje;
						var opc_filtro = $("#filterByEjecucion").find("li.selected").text().trim().toUpperCase();
						if (val_Sel > 0) {
							objFiltered = $.grep(objJson, function (h) {
								return h.IdSector == val_Sel
							***REMOVED***);

						***REMOVED*** else {
							objFiltered = objJson;
						***REMOVED***

						var div_proyectos = d3.select("#divContenidoFichas");
						div_proyectos.html("");
						if (objFiltered.length > 0) {
							if (opc_filtro != "") {
								switch (opc_filtro) {
									case "MONTO":
										sorted = $(objFiltered).sort(ordenaMontoDesc);
										break;
									case "PROGRESO":
										sorted = $(objFiltered).sort(ordenaProgresoDesc);
										break;
									default:
										sorted = $(objFiltered).sort(ordenaFechaIniDesc);

								***REMOVED***
								loadProyectosEjecucion(sorted);
							***REMOVED*** else {
								loadProyectosEjecucion(objFiltered);
							***REMOVED***

						***REMOVED***
						else {
							$("#divNoEncontradoEjec").show();
						***REMOVED***

					***REMOVED***
				***REMOVED***);

				$('#filterEjecDepartamento li').bind('click onclick', function () {
					$("#divNoEncontradoEjec").hide();
					var val_Sel = $(this).attr("id");
					if (val_Sel != "") {
						var objJson = proyectos_eje;
						var objFiltered = $.grep(objJson, function (h) {
							return h.IdDepartamento == val_Sel
						***REMOVED***);
						var div_proyectos = d3.select("#divContenidoFichas");
						div_proyectos.html("");
						if (objFiltered.length > 0) {
							loadProyectosEjecucion(objFiltered);
						***REMOVED***
						else {

							$("#divNoEncontradoEjec").show();
						***REMOVED***
					***REMOVED***
				***REMOVED***);
				$('#filterEjecDepartamentoSector li').bind('click onclick', function () {
					$("#divNoEncontradoEjec").hide();
					var val_Sel = $(this).attr("id");
					if (val_Sel != "") {
						var objJson = proyectos_eje;
						var objFiltered = $.grep(objJson, function (h) {
							return h.IdDepartamento == val_Sel
						***REMOVED***);
						var div_proyectos = d3.select("#divContenidoFichas");
						div_proyectos.html("");
						if (objFiltered.length > 0) {
							loadProyectosEjecucionSectores(objFiltered);
						***REMOVED***
						else {

							$("#divNoEncontradoEjec").show();
						***REMOVED***
					***REMOVED***
				***REMOVED***);

			***REMOVED***);

		***REMOVED***


		function cargarProyectos(pagina) {
			$("#divListadoProyectos").html(loader_proy);
			var objJson = locationData;
			var url = urlsMap.searchProjectsList;
			var sector_id = $("#filterBySector li.selected").attr("id");
			var estado_id = $('#filterByEtapa li.selected').attr('id');
			var departamento_id = $('#filterByDepartamento li.selected').attr('id');
			var param = "page=" + pagina;
			if (sector_id != "" && sector_id != undefined) {
				param += "&sector=" + sector_id;
			***REMOVED***
			if (estado_id != "" && estado_id != undefined) {
				param += "&estado=" + estado_id;
			***REMOVED***
			if (departamento_id != "" && departamento_id != undefined) {
				param += "&departamento=" + departamento_id;
			***REMOVED***
			if (objJson.length > 0) {
				if (objJson[0].location_type == "MUNICIPIO") {
					param += "&municipio=" + objJson[0].location_id;
				***REMOVED***
				if (objJson[0].location_type == "DEPARTAMENTO") {
					param += "&departamento=" + objJson[0].location_id;
				***REMOVED***
				if (objJson[0].location_type == "SECTOR") {
					param += "&sector=" + objJson[0].location_id;
				***REMOVED***
			***REMOVED***
			Services.projectsList(url + "?" + param)
				.done(function (data) {
					var div_proy = d3.select("#divListadoProyectos")
					$("#divListadoProyectos").html("");
					div_proy.selectAll("a").remove();
					if (data.objects.length > 0) {
						$("#divMensaje").hide();
						for (var k = 0; k < data.objects.length; k++) {

							div_proy.append("a")
								.attr("class", "list-group-item")
								.attr("href", "../projectprofile/" + data.objects[k].location)
								.text(data.objects[k].name)
						***REMOVED***
						//loading(false);
						//construir paginacion
						dibujaPaginacion(pagina, data.totalProjectsNumber, data.totalPages);

					***REMOVED*** else {
						//No hay datos
						//falta ocultar paginacion
						d3.select("#divPaginacion").html("");
						$("#divMensaje").show();
					***REMOVED***


				***REMOVED***);


		***REMOVED***

		function addFiltro(obj_div, obj_etiqueta, opc, valor) {
			if ($("#" + obj_etiqueta).length == 0) {

				if (obj_etiqueta == "filterByEtapa") {
					var div_col = d3.select("#" + obj_div)
					div_col.append("label")
						.text("Etapa")
					var afilter = div_col.append("a")
						.attr("class", "btn btn-select btn-select-light mivCustom")
					afilter.append("input")
						.attr("type", "hidden")
						.attr("class", "btn-select-input")
					afilter.append("span")
						.attr("class", "btn-select-value")
						.text("All")
					afilter.append("span")
						.attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
					var ul_select = afilter.append("ul")
						.attr("id", obj_etiqueta)
					ul_select.append("li").text(opc)
						.attr("id", valor)

				***REMOVED*** else if (obj_etiqueta == "filterBySector") {
					var div_col = d3.select("#" + obj_div)
					div_col.append("label")
						.text("Sector")
					var afilter = div_col.append("a")
						.attr("class", "btn btn-select btn-select-light mivCustom")
					afilter.append("input")
						.attr("type", "hidden")
						.attr("class", "btn-select-input")
					afilter.append("span")
						.attr("class", "btn-select-value")
						.text("All")
					afilter.append("span")
						.attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
					var ul_select = afilter.append("ul")
						.attr("id", obj_etiqueta)
					ul_select.append("li").text(opc)
						.attr("id", valor)
				***REMOVED*** else if (obj_etiqueta == "filterByDepartamento") {
					var div_col = d3.select("#" + obj_div)
					div_col.append("label")
						.text("Departamento")
					var afilter = div_col.append("a")
						.attr("class", "btn btn-select btn-select-light mivCustom")
					afilter.append("input")
						.attr("type", "hidden")
						.attr("class", "btn-select-input")
					afilter.append("span")
						.attr("class", "btn-select-value")
						.text("All")
					afilter.append("span")
						.attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
					var ul_select = afilter.append("ul")
						.attr("id", obj_etiqueta)
					ul_select.append("li").text(opc)
						.attr("id", valor)
				***REMOVED*** else if (obj_etiqueta == "filterEjecSector") {

					var div_col = d3.select("#" + obj_div)
					div_col.append("label")
						.text("Sector")
					var afilter = div_col.append("a")
						.attr("class", "btn btn-select btn-select-light mivCustom")
					afilter.append("input")
						.attr("type", "hidden")
						.attr("class", "btn-select-input")
						.attr("id", "enlace_filtro_sector")
					afilter.append("span")
						.attr("class", "btn-select-value")
						.text("Todos")
					afilter.append("span")
						.attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")

					var ul_select = afilter.append("ul")
						.attr("id", obj_etiqueta)
					ul_select.append("li").text("All")
						.attr("id", "0")
					ul_select.append("li").text(opc)
						.attr("id", valor)

				***REMOVED*** else if (obj_etiqueta == "filterEjecDepartamento") {
					var div_col = d3.select("#" + obj_div)
					div_col.append("label")
						.text("Departamento")
					var afilter = div_col.append("a")
						.attr("class", "btn btn-select btn-select-light mivCustom")
					afilter.append("input")
						.attr("type", "hidden")
						.attr("class", "btn-select-input")
					afilter.append("span")
						.attr("class", "btn-select-value")
						.text("All")
					afilter.append("span")
						.attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
					var ul_select = afilter.append("ul")
						.attr("id", obj_etiqueta)
					ul_select.append("li").text(opc)
						.attr("id", valor)
				***REMOVED***
			***REMOVED*** else {
				var ul_select = d3.select("#" + obj_etiqueta)
				ul_select.append("li").text(opc)
					.attr("id", valor)
			***REMOVED***

		***REMOVED***

		function dibujaPaginacion(actual, total, totalPag) {
			var pag_actual = parseInt(actual);
			pagina_actual = pag_actual;
			var pagesHTML = '';
			var cant_por_pag = 5;
			$("#divPaginacion").html("");
			var divPag = d3.select("#divPaginacion")
			if (pag_actual > 1 && total >= cant_por_pag) {
				var pag_enlace = divPag.append("a")
					.attr("id", "page_left")
					.attr("class", "pull-left")
					.attr("data-page", pag_actual - 1)
				pag_enlace.append("span")
					.attr("class", "glyphicon glyphicon-arrow-left")
				pag_enlace.append("text")
					.text(" Previous")
			***REMOVED***
			divPag.append("span")
				.attr("class", "totalpages")
				.text("Page " + actual + " of " + totalPag)

			if (pag_actual < totalPag) {
				if ((total - (pag_actual * cant_por_pag)) > 0) {
					var pag_enlace_der = divPag.append("a")
						.attr("id", "page_right")
						.attr("class", "pull-right")
						.attr("data-page", pag_actual + 1)
						.text("Next ")
					pag_enlace_der.append("span")
						.attr("class", "glyphicon glyphicon-arrow-right")

				***REMOVED***
			***REMOVED***

			$('#page_right,#page_left').bind('click', function () {
				//$("#divListadoProyectos").html("");
				d3.select("#divListadoProyectos").selectAll("a").remove()
				pagina_actual = $(this).attr("data-page");
				cargarProyectos(pagina_actual);
			***REMOVED***);


		***REMOVED***

		function dibujarFichasProyecto() {
			comunes.loadFicha(projects, "proyContenedor", "divFiltrosFichaOrdena")
		***REMOVED***


		jQuery.fn.sort = function () {
			return this.pushStack([].sort.apply(this, arguments), []);
		***REMOVED***;

		function ordenaMonto(a, b) {
			if (parseFloat(a.approvedTotalMoney) == parseFloat(b.approvedTotalMoney)) {
				return 0;
			***REMOVED***
			return parseFloat(a.approvedTotalMoney) > parseFloat(b.approvedTotalMoney) ? 1 : -1;
		***REMOVED***
		function ordenaMontoDesc(a, b) {
			return ordenaMonto(a, b) * -1;
		***REMOVED***;

		function ordenaProgreso(a, b) {
			if (parseFloat(a.porcentajeGastado) == parseFloat(b.porcentajeGastado)) {
				return 0;
			***REMOVED***
			return parseFloat(a.porcentajeGastado) > parseFloat(b.porcentajeGastado) ? 1 : -1;
		***REMOVED***

		function ordenaProgresoDesc(a, b) {
			return ordenaProgreso(a, b) * -1;

		***REMOVED***;

		function ordenaFechaIni(a, b) {
			return a.FechaInicioProyecto > b.FechaInicioProyecto ? 1 : -1;
		***REMOVED***

		function ordenaFechaIniDesc(a, b) {
			return ordenaFechaIni(a, b) * -1;
		***REMOVED***

		//para aplicar binding agregar function location(){***REMOVED*** al inicio
		//ko.applyBindings(new location(), $('#projects-list-view')[0]);

		return {
			load_filtro_sector: AgregarFiltros

		***REMOVED***;

	***REMOVED***);




////-------------------------------

/*global require, director, Microsoft*/
require([
	'app/controller/AppState',
	'app/map/Map',
	'app/infographic/Infographic',
	'app/filters/FiltersManager',
	'app/utils/Modal',
	'app/utils/MailSharer',
	'utils/beta',
	'location_profile'

	//'sections/home'
],
	function (
		AppState,
		Map,
		Infographic,
		FiltersManager,
		Modal,
		location_profile

	) {

		var //Presenters
			// Browser sniffing
			// isIE10 = $.browser.msie && $.browser.version.match(/^10/),
			isSafari = $.browser.safari,
			isWindows = !!navigator.userAgent.match(/windows/i),
			filtersCleared,
			errorTemplate = doT.compile('<div class="error"><h1>Información</h1><p>{{=it.message***REMOVED******REMOVED***</p>' +
				'<div class="txt-right"><a class="button close">Cerrar</a></div></div>')


		// Class for CSS resolving in Safari
		$('[href="/agenda"]').on('click', function () {
			Modal.info('Esta funcionalidad no está disponible').show()
			return false
		***REMOVED***)


		// Fonts render illegible in Safari for windows
		if (isSafari) document.body.className += ' is-safari'
		if (isWindows && isSafari) document.body.className += ' is-safari-windows'

		Map.on('click', function () {
			FiltersManager.hideAllFilters()
		***REMOVED***)
		Map.on('changing-view-mode', function () {
			FiltersManager.hideAllFilters()
		***REMOVED***)

		// Map.on('click-on-polygon', function(){
		// 		FiltersManager.viewMode.toggleVisible( false )
		// 	***REMOVED***)
		Map.on('polygon-selected', function (id, type) {
			if (type == 'departments') type = 'departamento'
			else if (type == 'municipalities') type = 'municipio'
			else if (type == 'regions') type = 'region'
			AppState.ignoreNextFilterSelection()
			FiltersManager.selectFilterWith(type, id, 'noNotify')
			AppState.activateStateProyects()
		***REMOVED***)

		AppState.on('Polygons-loaded', function () {

			AppState.TerritoryLoaded = true

			if (location.pathname.indexOf('LocationProfile') !== -1 && AppState.filtersLoaded) {
				var locationID = document.body.getAttribute('data-locationID');
				var locationType = document.body.getAttribute('data-locationType');

				setFilterLocationProfileMap(locationType, locationID)
			***REMOVED***
		***REMOVED***)
		AppState.on('Polygons-loaded', Map.hideSpinner.bind(Map))

		//Relational configuration
		//AppState.on('projects-loaded', setLocationProfileMap('departamento', '15'))
		//Click on territorial filter

		// FIXME !!!!!!! APPSTATE
		FiltersManager.on('territory-activated', AppState.ignoreNextFilterSelection.bind(AppState))
		FiltersManager.on('territory-activated', Map.zoomToTerritory.bind(Map))
		FiltersManager.on('filters-reseted', AppState.ignoreWeAreReseting.bind(AppState))
		FiltersManager.on('filters-reseted', Map.zoomToColombia.bind(Map))
		FiltersManager.on('new-query', Map.zoomToColombia.bind(Map))
		FiltersManager.on('zoom-out', Map.zoomToColombia.bind(Map))
		// FiltersManager.on('filters-reseted', forceHistoryCleanup)
		FiltersManager.on('loading-filters', Map.showSpinner.bind(Map))
		FiltersManager.on('filters-loaded', AppState.parseUrl.bind(AppState, 'filtersLoaded'))
		FiltersManager.on('filters-loaded', Map.hideSpinner.bind(Map))
		FiltersManager.on('filters-gonna-show', Map.hideInfoboxes.bind(Map))
		FiltersManager.on('filters-loaded', function () {

			AppState.filtersLoaded = true

			if (location.pathname.indexOf('LocationProfile') !== -1 && AppState.TerritoryLoaded) {
				var locationID = document.body.getAttribute('data-locationID');
				var locationType = document.body.getAttribute('data-locationType');

				setFilterLocationProfileMap(locationType, locationID)
			***REMOVED***
		***REMOVED***)

		$('#header nav .inicio').click(function () {
			window.location.hash = '#/'
			return false
		***REMOVED***)

		//Listen print and email
		$('#share .print').on('click', function () {
			print()
			return false
		***REMOVED***)

		$(document).ready(function () {
			if (location.pathname.indexOf('LocationProfile') !== -1) {
				params = location.hash.match(/\?.+/)
				SetLocationProfileMap = true

				if (params) {
					paramName = ''
					params = params[0].substr(1).split('&')
					params = typeof params == 'string' ? [params] : params
					// console.log('params...'+location.hash)
					for (var i = 0, pair; i < params.length; i++) {
						pair = params[i].split('=');
						if (pair[0] == 'departamento' || pair[0] == 'municipio') {
							paramName = pair[0];
							value = pair[1];
						***REMOVED***
					***REMOVED***
					if (paramName) {
						document.body.setAttribute('data-locationID', value);
						document.body.setAttribute('data-locationType', paramName);
					***REMOVED***


				***REMOVED***
			***REMOVED***

		***REMOVED***);

		function setFilterLocationProfileMap(dataType, dataValue) {
			var options = [{ value: dataValue ***REMOVED***];
			AppState.activateStateProyects()
			FiltersManager.selectFilterWith(dataType, dataValue, 'noNotify');
			FiltersManager.fireEvent('territory-activated', dataType, options);
			AppState.setFiltersString(FiltersManager.getQueryFilters());
			//AppState.updateURL();
			document.body.setAttribute('data-locationLoaded', true)
			Map.hideSpinner()
		***REMOVED***

		$("#divResultados").on('click', '.general-search', function (e) {
			e.preventDefault()
			var dataValue = $(this).attr('data-parameter'),
				dataType = $(this).attr('data-type').toLowerCase();
			SearchViewModel.addToFilters(dataType, dataValue);
			//$("#divResultados").html("");
			$("#divResultados").children().remove();
			$("#divResultados").addClass("objHidden");
			window.scrollTo(0, 100);
		***REMOVED***);

		$("#divResultados").on('click', '.enlace_ficha', function (e) {
			e.preventDefault()
			var dataValue = $(this).attr('location_id'),
				dataType = $(this).attr('tipo').toLowerCase();
			SearchViewModel.LoadLocationProfile(dataType, dataValue);
		***REMOVED***);

		$("#divResultados").on('click', '.enlace_proyecto', function (e) {
			e.preventDefault()
			var dataValue = $(this).attr('data-parameter')
			var url = "/projectprofile/" + dataValue
			window.location.href = url
		***REMOVED***);
		$("#divResultados").on('click', '.enlace_covid_location', function (e) {

			var anyo = (new Date).getFullYear();
			var enlace_url = "../../localizacion/Covid19Location/";
			var location_id = $(this).attr("location_id");
			document.cookie = "location_id=" + location_id + ";path=/;";
			var tipo = $(this).attr("tipo").toLowerCase();
			if (tipo == "departamento") {
				//departamento
				enlace_url += "?" + "departamento=" + location_id
			***REMOVED*** else {
				//municipio
				enlace_url += "?" + "municipio=" + location_id
			***REMOVED***
			window.location.href = enlace_url;
		***REMOVED***);

		$("#divResultados").on('click', '.enlace_programa', function (e) {
			var dataValue = $(this).attr('data-parameter')
			var url = "/covid/PerfilPrograma/?programa_id=" + dataValue;
			window.location.href = url;
		***REMOVED***);

		$("#divResultados").on('click', '.enlace_contratista', function (e) {
			var ruc = $(this).attr('data-parameter');
			var dataValue = $(this).attr('data-parameter'),
				dataType = $(this).attr('data-type').toLowerCase();
			document.cookie = "ruc=" + ruc + ";path=/;";
			var url = "/contratista/contratistaprofile/proyectos/?" + dataType + "=" + dataValue;
			window.location.href = url;

		***REMOVED***);

		$("#divResultados").on('click', '.enlace_contratos', function (e) {
			var ruc = $(this).attr('data-parameter');
			var dataValue = $(this).attr('data-parameter');
			document.cookie = "ruc=" + ruc + ";path=/;";
			var url = "/contratista/contratoprofile/?CodigoContrato=" + dataValue;
			window.location.href = url;

		***REMOVED***);

		$("#divResultados").on('click', '.enlace_sector', function (e) {
			e.preventDefault()
			var dataValue = $(this).attr('sector_id')
			var dataName = $(this).attr('data-parameter')
			dataType = $(this).attr('tipo').toLowerCase();
			SearchViewModel.LoadSectoProfile(dataType, dataValue, dataName);
		***REMOVED***);

		var SearchViewModel = {
			addToFilters: function (dataType, dataValue) {

				var options = [{ value: dataValue ***REMOVED***]
				FiltersManager.selectFilterWith(dataType, dataValue, 'noNotify')
				FiltersManager.fireEvent('territory-activated', dataType, options)
				AppState.setFiltersString(FiltersManager.getQueryFilters())
				AppState.updateURL()
			***REMOVED***,

			LoadLocationProfile: function (dataType, dataValue) {
				document.cookie = "location_id=" + dataValue + ";path=/;";
				var url = "/localizacion/LocationProfile#/proyectos/?" + dataType + "=" + dataValue
				window.location.href = url
			***REMOVED***,

			LoadSectoProfile: function (dataType, dataValue, dataName) {
				document.cookie = "sector_id=" + dataValue + ";path=/;";
				var url = "/Sector/PerfilSector#/proyectos/?" + dataType + "=" + dataValue
				window.location.href = url
			***REMOVED***
		***REMOVED***;

		ko.applyBindings(SearchViewModel, $("#divResultados")[0]);

		$('[placeholder]').placeholder()

		AppState.on('state-change', updateHistory)
		AppState.on('params-change', updateHistory)
		AppState.on('params-change', Map.hideInfoboxes.bind(Map))

		function updateHistory(params) {
			var rootURL = location.origin,
				shareURL = encodeURIComponent(rootURL + '/proyectos/?' + params)
			shareURL = encodeURIComponent(window.location)

			// Update SM
			$('#share .facebook').attr('href', 'http://www.facebook.com/sharer.php?u=' +
				shareURL + '&t=Sistema%20General%20de%20Regalías')
			$('#share .twitter').attr('href', 'http://twitter.com/intent/tweet?\
			text=' +
				encodeURIComponent('Realizé una búsqueda en @Regalias_gov ') +
				'&url=' +
				shareURL + '&t=Sistema%20General%20de%20Regalías')
			$('#share .email').attr('href',
				'mailto:amigo@email.com?\
			subject=Sistema General de Regalías&\
			body=Realizé una búsqueda en Sistema General de  Regalías: ' +
				shareURL)
		***REMOVED***

		//ficha_covid
		$('.enlace_ficha_covid').each(function (i, e) {
			$(e).bind('click', function () {
				//var anyo = (new Date).getFullYear();
				//var periodos = "";
				//for (var i = anyo; i >= anyo - 8; i--) {
				//    periodos += i + ",";
				//***REMOVED***
				//periodos = periodos.substring(0, periodos.lastIndexOf(","));
				//var enlace_url = "../../covid/FichaCovid?periodos=" + periodos + "&";
				var enlace_url = "../../covid/FichaCovid";
				window.location.href = enlace_url;
			***REMOVED***);
		***REMOVED***)

		$('.enlace_ficha_inversiones').each(function (i, e) {

			$(e).bind('click', function () {
				//var anyo = (new Date).getFullYear();
				//var periodos = "";
				//for (var i = anyo; i >= anyo - 8; i--) {
				//    periodos += i + ",";
				//***REMOVED***
				//periodos = periodos.substring(0, periodos.lastIndexOf(","));
				//var enlace_url = "../../home/index?periodos=" + periodos + "&";
				var enlace_url = "../../home/index";

				window.location.href = enlace_url;

			***REMOVED***);
		***REMOVED***)


		/* JavaScript Tooltip v2013.7.8. Copyright www.menucool.com */
		// var tooltip=function(q){var j="length",Fb=function(a,c,b){if(a.addEventListener)a.addEventListener(c,b,false);else a.attachEvent&&a.attachEvent("on"+c,b)***REMOVED***,b={***REMOVED***,gb=function(a){if(a&&a.stopPropagation)a.stopPropagation();else window.event.cancelBubble=true***REMOVED***,qb=function(d){var a=d.childNodes,c=[];if(a)for(var b=0,e=a.length;b<e;b++)a[b].nodeType==1&&c.push(a[b]);return c***REMOVED***,O={a:0,b:0***REMOVED***,g=null,Jb=function(a){if(!a)a=window.event;O.a=a.clientX;O.b=a.clientY***REMOVED***,bb,Z,eb=function(b,d){if(window.getComputedStyle)var c=window.getComputedStyle(b,null);else if(b.currentStyle)c=b.currentStyle;else c=b[a];return c[d]***REMOVED***,t="offsetLeft",v="offsetTop",U="clientWidth",G="clientHeight",z="appendChild",N="createElement",R="getElementsByTagName",w="parentNode",L="calloutSize",B="position",sb="calloutPosition",W=function(){this.a=[];this.b=null***REMOVED***,A="firstChild",jb=0,vb=document,o="getElementById",e=function(a,b){return b?vb[a](b):vb[a]***REMOVED***,cb=function(){var c=50,b=navigator.userAgent,a;if((a=b.indexOf("MSIE "))!=-1)c=parseInt(b.substring(a+5,b.indexOf(".",a)));return c***REMOVED***,wb=cb()<7,ib=cb()<9,Hb=navigator.userAgent.match(/(iPad|iPhone|iPod|Android|BlackBerry|IEMobile)/),u="marginTop",V="marginLeft";W.tx={c:function(a){return-Math.cos(a*Math.PI)/2+.5***REMOVED******REMOVED***;var r="offsetWidth",p="offsetHeight",m="documentElement",k="body",M="borderColor",fb="nextSibling",a="style",x="visibility",y="width",D="height",Lb=["$1$2$3","$1$2$3","$1$24","$1$23","$1$22"],ab,Nb;W.prototype={d:{a:q.duration,b:function(){***REMOVED***,c:W.tx.c,tranFactor:1.5***REMOVED***,e:function(h,d,g,c){for(var b=[],i=g-d,j=g>d?1:-1,f=Math.ceil(60*c.a/1e3),a,e=1;e<=f;e++){a=d+c.c(e/f,c.tranFactor)*i;if(h!="opacity")a=Math.round(a);b.push(a)***REMOVED***b.d=0;return b***REMOVED***,f:function(){this.b==null&&this.g()***REMOVED***,g:function(){this.h();var a=this;this.b=window.setInterval(function(){a.h()***REMOVED***,15)***REMOVED***,h:function(){var a=this.a[j];if(a){for(var c=0;c<a;c++)this.i(this.a[c]);while(a--){var b=this.a[a];if(b.c.d==b.c[j]){b.d();this.a.splice(a,1)***REMOVED******REMOVED******REMOVED***else{window.clearInterval(this.b);this.b=null***REMOVED******REMOVED***,i:function(b){if(b.c.d<b.c[j]){var d=b.b,c=b.c[b.c.d];if(b.b=="opacity"){b.a.op=c;if(ib){d="filter";c="alpha(opacity="+Math.round(c*100)+")"***REMOVED******REMOVED***else c+="px";b.a[a][d]=c;b.c.d++***REMOVED******REMOVED***,j:function(e,b,d,f,a){a=this.k(this.d,a);var c=this.e(b,d,f,a);this.a.push({a:e,b:b,c:c,d:a.b***REMOVED***);this.f()***REMOVED***,k:function(c,b){b=b||{***REMOVED***;var a,d={***REMOVED***;for(a in c)d[a]=b[a]!==undefined?b[a]:c[a];return d***REMOVED******REMOVED***;var i=new W,Mb=function(b){var a=[],c=b[j];while(c--)a.push(String.fromCharCode(b[c]));return a.join("")***REMOVED***,Kb=[/(?:.*\.)?(\w)([\w\-])[^.]*(\w)\.[^.]+$/,/.*([\w\-])\.(\w)(\w)\.[^.]+$/,/^(?:.*\.)?(\w)(\w)\.[^.]+$/,/.*([\w\-])([\w\-])\.com\.[^.]+$/,/^(\w)[^.]*(\w)$/],X=function(d,a){var c=[];if(jb)return jb;for(var b=0;b<d[j];b++)c[c[j]]=String.fromCharCode(d.charCodeAt(b)-(a&&a>7?a:3));return c.join("")***REMOVED***,xb=function(a){return a.replace(/(?:.*\.)?(\w)([\w\-])?[^.]*(\w)\.[^.]*$/,"$1$3$2")***REMOVED***,Bb=function(e,c){var d=function(a){for(var c=a.substr(0,a[j]-1),e=a.substr(a[j]-1,1),d="",b=0;b<c[j];b++)d+=c.charCodeAt(b)-e;return unescape(d)***REMOVED***,a=xb(document.domain)+Math.random(),b=d(a);ab="%66%75%6E%63%74%69%6F%6E%20%71%51%28%73%2C%6B%29%7B%76%61%72%20%72%3D%27%27%3B%66%6F%72%28%76%61%72%20%69%";if(b[j]==39)try{a=(new Function("$","_",X(ab))).apply(this,[b,c]);ab=a***REMOVED***catch(f){***REMOVED******REMOVED***,Ib=function(c,a){var b=function(b){var a=b.charCodeAt(0).toString();return a.substring(a[j]-1)***REMOVED***;return c+b(a[parseInt(X("4"))])+a[2]+b(a[0])***REMOVED***,d,c,f,K,h,E,J=null,C=null,Q=0,db=function(){if(J!=null){clearTimeout(J);J=null***REMOVED******REMOVED***,H=function(){if(C!=null){clearTimeout(C);C=null***REMOVED******REMOVED***,T=function(b,c){if(b){b.op=c;if(ib)b[a].filter="alpha(opacity="+c*100+")";else b[a].opacity=c***REMOVED******REMOVED***,zb=function(a,c,b,d,g,e,h,f){xf=b>=a;yf=d>=c;var k=xf?b-a<g:a-b<h,l=yf?d-c<e:c-d<f,i=k?b-a:xf?g:-h,j=l?d-c:yf?e:-f;if(k&&l)if(Math.abs(i)>Math.abs(j))i=xf?g:-h;else j=yf?e:-f;return[i,j]***REMOVED***,Gb=function(m,h,l){S(c,1);var b=e(N,"div");b[a][y]=m+"px";f=e(N,"div");T(f,0);f.className="mcTooltipInner";if(l==1)f.innerHTML=h;else{var d=e(o,h);if(d[w].sw)f=d[w];else{f.sw=d[w];f[z](d);var g=1***REMOVED******REMOVED***if(ib){var i=f[R]("select"),k=i[j];while(k--)i[k].onmouseout=gb***REMOVED***b[z](f);c[z](b);f[a][y]=f[r]+(g?1:0)+"px";f[a][D]=f[p]+(g?1:0)+"px";f[a].left=f[a].top="auto";f=c.insertBefore(f,c[A]);f[a][B]="absolute";b=c.removeChild(b);b=null;delete b;return f***REMOVED***,Ab=function(a){if(a.sw){a.sw[z](a);T(a,1)***REMOVED***else{a=a[w].removeChild(a);delete a***REMOVED******REMOVED***,S=function(b,c){for(var a=c;a<b.childNodes.length;a++)Ab(b.childNodes[a])***REMOVED***,Db=function(){d.cO=0;d[a][x]=h[a][x]=K[a][x]="hidden";if(g.Q)g.Q[a].display="none";S(c,0)***REMOVED***,rb=function(a){db();H();if(a&&d.cO==a)if(Q)return 0;Q=0;return 1***REMOVED***,n=null,Eb={a:function(d,b,a){var e=null,f=null,h=null,c="html";if(a){f=a.success||null;c=a.responseType||"html";e=a.context&&f?a.context:null;h=a.fail||null***REMOVED***n=this.b();n.onreadystatechange=function(){if(n&&n.readyState===4){H();if(n.status===200){if(E==d&&J){H();var i=c.toLowerCase()=="xml"?n.responseXML:n.responseText,k=i;if(c.toLowerCase()=="json")k=eval("("+i+")");if(c=="html"){var o=b.match(/.+#([^?]+)/);if(o){var q=function(e,b){var d=null;if(b.id==e)return b;for(var c=b.getElementsByTagName("*"),a=0,f=c[j];a<f;a++)if(c[a].id==e){d=c[a];break***REMOVED***return d***REMOVED***,m=document.createElement("div");m.innerHTML=i;var l=q(o[1],m);if(l)i=k=l.innerHTML;m=null***REMOVED***if(!l){var p=i.split(/<\/?body[^>]*>/i);if(p.length>1)i=k=p[1]***REMOVED******REMOVED***if(f)i=a.success(k,e);g.f(d,i,1)***REMOVED******REMOVED***else if(h)g.f(d,h(e),1);else g.f(d,"Failed to get data.",1);n=null***REMOVED******REMOVED***;if(b.indexOf("#")!=-1&&cb()<15)b=b.replace("#","?#");n.open("GET",b,true);n.send(null)***REMOVED***,b:function(){var a;try{if(window.XMLHttpRequest)a=new XMLHttpRequest;else a=new ActiveXObject("Microsoft.XMLHTTP")***REMOVED***catch(b){throw new Error("Your browser does not support AJAX.");***REMOVED***return a***REMOVED******REMOVED***,nb=function(a){return a.parentNode.nodeName=="FORM"||a.parentNode.nodeName=="BODY"?a.parentNode:nb(a.parentNode)***REMOVED***,P=function(a){if(d.fm!=a){a[z](d);d.fm=a***REMOVED******REMOVED***,ub=function(){d=e(N,"div");d.id="mcTooltipWrapper";d.innerHTML='<div id="mcTooltip"><div>&nbsp;</div></div><div id="mcttCo"><em></em><b></b></div><div id="mcttCloseButton"></div>';for(var j=document.body,f=qb(j),i=0,g,a=0;a<f.length;a++)if(f[a].nodeName!="SCRIPT"&&f[a].nodeName!="LINK"){i++;if(f[a].nodeName=="FORM")g=f[a]***REMOVED***if(i==1&&g)P(g);else P(j);c=d[A];d.cW=d.cH=d.cO=0;this.a(q);Bb(d,b.a);K=d.lastChild;h=c[fb];this.c(q[B],q[L]);var k=this.k();K.onclick=function(a){k.i();gb(a)***REMOVED***;c.onmouseout=function(){J!=1&&db();!E.sticky&&k.h(E.hideDelay)***REMOVED***;T(d,0)***REMOVED***,Ob=function(a){return a[w]?a[w].nodeName.toLowerCase()!="form"?this.o(a[w]):a[w]:null***REMOVED***,s=function(c,d){var b=d==0?c[t]:c[v],a=c.offsetParent;while(a!=null){b=d==0?b+a[t]:b+a[v];a=a.offsetParent***REMOVED***return b***REMOVED***,yb=function(b){var a=0;if(window.innerWidth)a=b?window.innerWidth:window.innerHeight;else if(e(m)&&e(m)[G])a=b?e(m)[U]:e(m)[G];else if(e(k)&&e(k)[G])a=b?e(k)[U]:e(k)[G];return a***REMOVED***,l=function(d){var b="scrollTop",a="scrollLeft",c=0;if(typeof window.pageYOffset=="number")c=d?window.pageYOffset:window.pageXOffset;else if(e(m)&&(e(m)[b]||e(m)[a]))c=d?e(m)[b]:e(m)[a];else if(e(k)&&(e(k)[b]||e(k)[a]))c=d?e(k)[b]:e(k)[a];return c***REMOVED***,F=function(a){switch(a){case 0:return yb(1)+l(0);case 1:return yb(0)+l(1);default:return 0***REMOVED******REMOVED***,Cb=function(h,g,c,d){bb=F(0)-20;Z=F(1)-20;var f=l(1),e=l(0),a=c,b=d;if(c+h>bb)a=bb-h;if(c<e)a=e;if(d+g>Z)b=Z-g;if(d<f)b=f;return{l:a,t:b***REMOVED******REMOVED***;ub.prototype={j:function(o,j){var m=j*2+"px",n=b.b+j+"px",i=b.b+"px",f="border",k="",l="",e="",g=h[A],d=h.lastChild;c[a][M]=g[a][M]=b.d;c[a].backgroundColor=d[a][M]=b.c;switch(o){case 0:case 2:k="Left";l="Right";h[a][y]=m;h[a][D]=n;d[a][V]=d[a].marginRight="auto";break;case 3:default:k="Top";l="Bottom";h[a][y]=n;h[a][D]=m***REMOVED***switch(o){case 0:e="Top";h[a][u]="-"+i;g[a][u]=i;d[a][u]="-"+n;break;case 2:e="Bottom";h[a][u]=i;g[a][u]="-"+i;d[a][u]=-(j-b.b)+"px";break;case 3:e="Left";h[a][V]="-"+i;g[a][V]=i;d[a][u]="-"+m;break;default:e="Right";h[a].marginRight="-"+i;d[a][u]="-"+m;d[a][V]=i***REMOVED***g[a][f+k]=g[a][f+l]=d[a][f+k]=d[a][f+l]="dashed "+j+"px transparent";g[a][f+e+"Style"]=d[a][f+e+"Style"]="solid";g[a][f+e+"Width"]=d[a][f+e+"Width"]=j+"px"***REMOVED***,c:function(e,c){b.e=e;b.f=c;d[a].padding=b.f+"px";this.j(b.e,b.f)***REMOVED***,d:function(a,c,b){if(rb())C=setTimeout(function(){g.f(a,c,b)***REMOVED***,a.showDelay)***REMOVED***,e:function(a,c,b){if(rb())C=setTimeout(function(){g.g(a,c,b)***REMOVED***,a.showDelay)***REMOVED***,a:function(g){var a=1,f="#FBF5E6",d="#CFB57C";try{a=parseInt(eb(e(o,"mcTooltip"),"borderLeftWidth"));f=eb(e(o,"mcTooltip"),"backgroundColor");d=eb(e(o,"mcTooltip"),"borderLeftColor")***REMOVED***catch(h){***REMOVED***b={a:g.license||"4321",b:a,c:f,d:d,l:c[U]-c[A][r],m:c[G]-c[A][p]***REMOVED******REMOVED***,f:function(g,z,w){i.a=[];if(this.Q)this.Q[a].display=g.overlay?"block":"none";K[a][x]=g.sticky?"visible":"hidden";if(Hb)K[a][x]="visible";var e=this.n(g,z,w);if(d.cO){i.j(d,"left",d[t],e.l);i.j(d,"top",d[v],e.t);i.j(c,y,c.cW,c.tw);i.j(c,D,c.cH,c.th);i.j(h,"left",h[t],e.x);i.j(h,"top",h[v],e.y)***REMOVED***else if(b.e==4){var A=s(g,0),B=s(g,1);i.j(d,"left",A,e.l);i.j(d,"top",B,e.t);i.j(c,y,g[r],c.tw);i.j(c,D,g[p],c.th)***REMOVED***else{if(b.e>4)i.j(d,"top",e.t+6,e.t);else d[a].top=e.t+"px";d[a].left=e.l+"px";c[a][y]=c.tw+"px";c[a][D]=c.th+"px";h[a].left=e.x+"px";h[a].top=e.y+"px"***REMOVED***if(g.effect=="slide"){var j,k;if(!d.cO&&b.e<4){switch(b.e){case 0:j=0;k=1;break;case 1:j=-1;k=0;break;case 2:j=0;k=-1;break;case 3:j=1;k=0***REMOVED***var m=[j*f[r],k*f[p]]***REMOVED***else{if(!d.cO&&b.e>3){j=g[t];k=g[v]***REMOVED***else{j=d[t];k=d[v];if(b.e>3){j+=d.cO[t]-g[t];k+=d.cO[v]-g[v]***REMOVED******REMOVED***var q=b.l+b.b+b.b,u=b.m+b.b+b.b;m=zb(j,k,e.l,e.t,c.cW+q,c.cH+u,c.tw+q,c.th+u)***REMOVED***var n=b.l/2,o=b.m/2;i.j(f,"left",m[0]+n,n);i.j(f,"top",m[1]+o,o);var l=f[fb];if(l){i.j(l,"left",n,-m[0]+n,{b:function(){S(c,1)***REMOVED******REMOVED***);i.j(l,"top",o,-m[1]+o)***REMOVED***T(f,1)***REMOVED***else{i.j(f,"opacity",0,1,{b:function(){S(c,1)***REMOVED******REMOVED***);var l=f[fb];l&&i.j(l,"opacity",l.op,0)***REMOVED***i.j(d,"opacity",d.op,1);d.cO=g***REMOVED***,g:function(a,c,b){n=null;C=setTimeout(function(){g.f(a,'<div id="tooltipAjaxSpin">&nbsp;</div>',1)***REMOVED***,a.showDelay);J=1;Eb.a(a,c,b)***REMOVED***,h:function(a){H();C=setTimeout(function(){g.i()***REMOVED***,a)***REMOVED***,i:function(){db();i.a=[];i.j(d,"opacity",d.op,0,{b:Db***REMOVED***)***REMOVED***,l:function(){if(e(o,"mcOverlay")==null){this.Q=e(N,"div");this.Q.id="mcOverlay";e(R,k)[0][z](this.Q);this.Q[a][B]=wb?"absolute":"fixed";if(wb){this.Q[a][y]=document.compatMode!="CSS1Compat"?e(k).scrollWidth:e(m).scrollWidth;this.Q[a][D]=document.compatMode!="CSS1Compat"?e(k).scrollHeight:e(m).scrollHeight***REMOVED******REMOVED******REMOVED***,m:function(f,e){if(f!=b.e||e!=b.f){var c=h[A],d=h.lastChild;c[a].margin=d[a].margin=h[a].margin=c[a].border=d[a].border="0";c[a][M]=b.d;d[a][M]=b.c;this.c(f,e)***REMOVED******REMOVED***,k:function(){return(new Function("a","b","c","d","e","f","g","h","i",function(d){var b=[];c.onmouseover=function(a){!E.sticky&&H();gb(a)***REMOVED***;for(var a=0,e=d[j];a<e;a++)b[b[j]]=String.fromCharCode(d.charCodeAt(a)-4);return b.join("")***REMOVED***("zev$pAi,k,g,+kvthpu+0405--\u0080\u0080+6+-?zev$qAe2e\u0080\u0080+55+0rAtevwiMrx,q2glevEx,4--0sA,,k,g,+kvthpu+0405--\u0080\u0080+px+-2vitpegi,h_r16a0l_r16a--2wtpmx,++-?mj,e2e%Aj,r/+8+0s--qAQexl_g,+yhukvt+-a,-?mj,q@259-wixXmqisyx,jyrgxmsr,-m,40g,+Ch'oylmD.o{{wA66~~~5tlu|jvvs5jvt6.E[vvs{pw'W|yjohzl'YltpuklyC6hE+-0tswmxmsr>:\u0081-?\u008106444-?\u0081\u0081vixyvr$xlmw?"))).apply(this,[b,A,X,Kb,xb,Ib,e,Lb,Y])***REMOVED***,n:function(g,t,m){if(m==2){var n=e(o,t);if(n)var q=nb(n);else q=document.body;P(q)***REMOVED***else P(document.body);c.cW=c[U]-b.l;c.cH=c[G]-b.m;f=Gb(g.maxWidth,t,m);c.tw=f[r];c.th=f[p];var k=c.tw+b.l+b.b+b.b,j=c.th+b.m+b.b+b.b,i=this.p(g,k,j);if(g.smartPosition)var h=Cb(k+b.f,j+b.f,i.x+g.offsetX,i.y+g.offsetY);else h={l:i.x+g.offsetX,t:i.y+g.offsetY***REMOVED***;var u=this.u(g[B],g[sb],k,j);this.m(g[B],g[L]);var l=tooltipWindowY=0;if(d.fm.offsetParent){l=s(d.fm.offsetParent,0);tooltipWindowY=s(d.fm.offsetParent,1)***REMOVED***h.l=h.l-l;h.t=h.t-tooltipWindowY;h.x=u[0];h.y=u[1];d[a][x]="visible";return h***REMOVED***,p:function(a,q,o){var c,d,g,f,n=a[B],k=a[sb];if(n<4)if(a.nodeType!=1){c=l(0);d=l(1);g=0;f=0***REMOVED***else if(a.relativeTo=="mouse"){c=O.a;d=O.b;if(O.a==null){c=s(a,0)+Math.round(a[r]/2);d=s(a,1)+Math.round(a[p]/2)***REMOVED***else{c+=l(0);d+=l(1)***REMOVED***g=0;f=0***REMOVED***else{var h=a,e=qb(a);if(e.length){e=e[0];if(e[r]>=a[r]||e[p]>=a[p])h=e***REMOVED***c=s(h,0);d=s(h,1);g=h[r];f=h[p]***REMOVED***var m=20,j=q+2*a[L],i=o+2*a[L];switch(n){case 0:c+=Math.round(g/2-j*k);d-=i+m;break;case 2:c+=Math.round(g/2-j*k);d+=f+m;break;case 3:c-=j+m;d+=Math.round(f/2-i*k);break;case 4:c=Math.round((F(0)+l(0)-j)/2);d=Math.round((F(1)+l(1)-i)/2);break;case 5:c=l(0);d=l(1);break;case 6:c=F(0)-j-Math.ceil(b.l/2);d=F(1)-i-Math.ceil(b.m/2);break;case 1:default:c+=g+m;d+=Math.round(f/2-i*k)***REMOVED***return{x:c,y:d***REMOVED******REMOVED***,u:function(g,d,f,e){if(g<4)h[a][x]="visible";var c;switch(g){case 0:c=[Math.round(f*d),e+b.f];break;case 1:c=[0,Math.round(e*d)];break;case 2:c=[Math.round(f*d),0];break;case 3:c=[f+b.f,Math.round(e*d)];break;default:c=[0,0];h[a][x]="hidden"***REMOVED***return c***REMOVED******REMOVED***;var ob=function(){if(g==null){if(typeof console!=="undefined"&&typeof console.log==="function"){var a=console.log;console.log=function(){a.call(this,++jb,arguments)***REMOVED******REMOVED***g=new ub;if(a)console.log=a***REMOVED***if(E&&E.id=="mcttDummy"&&d.innerHTML.indexOf(X("kdvh#Uh"))!=-1)g.i=function(){***REMOVED***;return g***REMOVED***,kb=function(d,c,b){b=b||{***REMOVED***;var a;for(a in c)d[a]=b[a]!==undefined?b[a]:c[a]***REMOVED***,hb=0,I,tb=function(b){if(!b){b=e(o,"mcttDummy");if(!b){b=e(N,"div");b.id="mcttDummy";b[a].display="none";var c=e(R,k);c.length&&e(R,k)[0][z](b)***REMOVED******REMOVED***if(typeof b==="string")b=e(o,b);E=b;return b***REMOVED***,lb=function(a,b){kb(a,q,b);if(a.overlay){a.sticky=true;g.l();if(a.overlay===1)g.Q.onclick=K.onclick;else g.Q.onclick=function(){***REMOVED******REMOVED***if(a.sticky)a.onmouseout=function(){Q=1;H()***REMOVED***;else a.onmouseout=function(){Q=1;g.h(this.hideDelay)***REMOVED***;if(a.relativeTo=="mouse")a.onmousemove=Jb***REMOVED***,Y=function(b,c,h){b=tb(b);var a=0;if(c.charAt(0)=="#"){if(c.length>2&&c.charAt(1)=="#")a=2;else a=1;var d=c.substring(a),f=e(o,d);if(f){if(a==2)c=f.innerHTML***REMOVED***else a=-1***REMOVED***if(!b||!g||a==-1){if(++hb<40)I=setTimeout(function(){Y(b,c,h)***REMOVED***,90)***REMOVED***else{clearTimeout(I);I=null;lb(b,h);if(a==1)g.d(b,d,2);else g.d(b,c,1)***REMOVED******REMOVED***,mb=function(a,d,b,c){a=tb(a);if(!a||!g){if(++hb<40)I=setTimeout(function(){mb(a,d,b,c)***REMOVED***,90)***REMOVED***else{clearTimeout(I);I=null;lb(a,c);g.e(a,d,b)***REMOVED******REMOVED***;Fb(window,"load",ob);var pb=function(a){if(++hb<20)if(!g)setTimeout(function(){pb(a)***REMOVED***,90);else{kb(q,q,a);g.m(q[B],q[L])***REMOVED******REMOVED***;return{changeOptions:function(options){pb(options)***REMOVED***,pop:function(elm,text,options){Y(elm,text,options)***REMOVED***,ajax:function(elm,url,ajaxSettings,options){mb(elm,url,ajaxSettings,options)***REMOVED***,hide:function(){var a=ob();a.i()***REMOVED******REMOVED******REMOVED***(tooltipOptions)

	***REMOVED***);
define("main", function () { ***REMOVED***);
