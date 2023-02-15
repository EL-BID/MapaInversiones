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
  ***REMOVED***
    "data": true,
    "depth": null,
    "max": 10,
    "nesting": {
        "cip": [0, 1, 2],
        "naics": [0, 1, 2],
        "soc": [0, 1, 2, 3],
        "geo": ["040", "050", "310", "160", "860", "795", "140"]
  ***REMOVED***
    "parents": [],
    "stem_only": null,
    "term": "",
    "type": "",
    "children": {
        "geo": {
            "040": ["050", "310", ""]
    ***REMOVED***
  ***REMOVED***
    "zip": false
***REMOVED***;

/*!
    localForage -- Offline Storage, Improved
    Version 1.4.0
    https://mozilla.github.io/localForage
    (c) 2013-2015 Mozilla, Apache License 2.0
*/
!function () { var a, b, c, d; !function () { var e = {***REMOVED***, f = {***REMOVED***; a = function (a, b, c) { e[a] = { deps: b, callback: c ***REMOVED*** ***REMOVED***, d = c = b = function (a) { function c(b) { if ("." !== b.charAt(0)) return b; for (var c = b.split("/"), d = a.split("/").slice(0, -1), e = 0, f = c.length; f > e; e++) { var g = c[e]; if (".." === g) d.pop(); else { if ("." === g) continue; d.push(g) ***REMOVED*** ***REMOVED*** return d.join("/") ***REMOVED*** if (d._eak_seen = e, f[a]) return f[a]; if (f[a] = {***REMOVED***, !e[a]) throw new Error("Could not find module " + a); for (var g, h = e[a], i = h.deps, j = h.callback, k = [], l = 0, m = i.length; m > l; l++) "exports" === i[l] ? k.push(g = {***REMOVED***) : k.push(b(c(i[l]))); var n = j.apply(this, k); return f[a] = g || n ***REMOVED*** ***REMOVED***(), a("promise/all", ["./utils", "exports"], function (a, b) { "use strict"; function c(a) { var b = this; if (!d(a)) throw new TypeError("You must pass an array to all."); return new b(function (b, c) { function d(a) { return function (b) { f(a, b) ***REMOVED*** ***REMOVED*** function f(a, c) { h[a] = c, 0 === --i && b(h) ***REMOVED*** var g, h = [], i = a.length; 0 === i && b([]); for (var j = 0; j < a.length; j++) g = a[j], g && e(g.then) ? g.then(d(j), c) : f(j, g) ***REMOVED***) ***REMOVED*** var d = a.isArray, e = a.isFunction; b.all = c ***REMOVED***), a("promise/asap", ["exports"], function (a) { "use strict"; function b() { return function () { process.nextTick(e) ***REMOVED*** ***REMOVED*** function c() { var a = 0, b = new i(e), c = document.createTextNode(""); return b.observe(c, { characterData: !0 ***REMOVED***), function () { c.data = a = ++a % 2 ***REMOVED*** ***REMOVED*** function d() { return function () { j.setTimeout(e, 1) ***REMOVED*** ***REMOVED*** function e() { for (var a = 0; a < k.length; a++) { var b = k[a], c = b[0], d = b[1]; c(d) ***REMOVED*** k = [] ***REMOVED*** function f(a, b) { var c = k.push([a, b]); 1 === c && g() ***REMOVED*** var g, h = "undefined" != typeof window ? window : {***REMOVED***, i = h.MutationObserver || h.WebKitMutationObserver, j = "undefined" != typeof global ? global : void 0 === this ? window : this, k = []; g = "undefined" != typeof process && "[object process]" === {***REMOVED***.toString.call(process) ? b() : i ? c() : d(), a.asap = f ***REMOVED***), a("promise/config", ["exports"], function (a) { "use strict"; function b(a, b) { return 2 !== arguments.length ? c[a] : void (c[a] = b) ***REMOVED*** var c = { instrument: !1 ***REMOVED***; a.config = c, a.configure = b ***REMOVED***), a("promise/polyfill", ["./promise", "./utils", "exports"], function (a, b, c) { "use strict"; function d() { var a; a = "undefined" != typeof global ? global : "undefined" != typeof window && window.document ? window : self; var b = "Promise" in a && "resolve" in a.Promise && "reject" in a.Promise && "all" in a.Promise && "race" in a.Promise && function () { var b; return new a.Promise(function (a) { b = a ***REMOVED***), f(b) ***REMOVED***(); b || (a.Promise = e) ***REMOVED*** var e = a.Promise, f = b.isFunction; c.polyfill = d ***REMOVED***), a("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function (a, b, c, d, e, f, g, h) { "use strict"; function i(a) { if (!v(a)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor"); if (!(this instanceof i)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."); this._subscribers = [], j(a, this) ***REMOVED*** function j(a, b) { function c(a) { o(b, a) ***REMOVED*** function d(a) { q(b, a) ***REMOVED*** try { a(c, d) ***REMOVED*** catch (e) { d(e) ***REMOVED*** ***REMOVED*** function k(a, b, c, d) { var e, f, g, h, i = v(c); if (i) try { e = c(d), g = !0 ***REMOVED*** catch (j) { h = !0, f = j ***REMOVED*** else e = d, g = !0; n(b, e) || (i && g ? o(b, e) : h ? q(b, f) : a === D ? o(b, e) : a === E && q(b, e)) ***REMOVED*** function l(a, b, c, d) { var e = a._subscribers, f = e.length; e[f] = b, e[f + D] = c, e[f + E] = d ***REMOVED*** function m(a, b) { for (var c, d, e = a._subscribers, f = a._detail, g = 0; g < e.length; g += 3) c = e[g], d = e[g + b], k(b, c, d, f); a._subscribers = null ***REMOVED*** function n(a, b) { var c, d = null; try { if (a === b) throw new TypeError("A promises callback cannot return that same promise."); if (u(b) && (d = b.then, v(d))) return d.call(b, function (d) { return c ? !0 : (c = !0, void (b !== d ? o(a, d) : p(a, d))) ***REMOVED***, function (b) { return c ? !0 : (c = !0, void q(a, b)) ***REMOVED***), !0 ***REMOVED*** catch (e) { return c ? !0 : (q(a, e), !0) ***REMOVED*** return !1 ***REMOVED*** function o(a, b) { a === b ? p(a, b) : n(a, b) || p(a, b) ***REMOVED*** function p(a, b) { a._state === B && (a._state = C, a._detail = b, t.async(r, a)) ***REMOVED*** function q(a, b) { a._state === B && (a._state = C, a._detail = b, t.async(s, a)) ***REMOVED*** function r(a) { m(a, a._state = D) ***REMOVED*** function s(a) { m(a, a._state = E) ***REMOVED*** var t = a.config, u = (a.configure, b.objectOrFunction), v = b.isFunction, w = (b.now, c.all), x = d.race, y = e.resolve, z = f.reject, A = g.asap; t.async = A; var B = void 0, C = 0, D = 1, E = 2; i.prototype = { constructor: i, _state: void 0, _detail: void 0, _subscribers: void 0, then: function (a, b) { var c = this, d = new this.constructor(function () { ***REMOVED***); if (this._state) { var e = arguments; t.async(function () { k(c._state, d, e[c._state - 1], c._detail) ***REMOVED***) ***REMOVED*** else l(this, d, a, b); return d ***REMOVED***, "catch": function (a) { return this.then(null, a) ***REMOVED*** ***REMOVED***, i.all = w, i.race = x, i.resolve = y, i.reject = z, h.Promise = i ***REMOVED***), a("promise/race", ["./utils", "exports"], function (a, b) { "use strict"; function c(a) { var b = this; if (!d(a)) throw new TypeError("You must pass an array to race."); return new b(function (b, c) { for (var d, e = 0; e < a.length; e++) d = a[e], d && "function" == typeof d.then ? d.then(b, c) : b(d) ***REMOVED***) ***REMOVED*** var d = a.isArray; b.race = c ***REMOVED***), a("promise/reject", ["exports"], function (a) { "use strict"; function b(a) { var b = this; return new b(function (b, c) { c(a) ***REMOVED***) ***REMOVED*** a.reject = b ***REMOVED***), a("promise/resolve", ["exports"], function (a) { "use strict"; function b(a) { if (a && "object" == typeof a && a.constructor === this) return a; var b = this; return new b(function (b) { b(a) ***REMOVED***) ***REMOVED*** a.resolve = b ***REMOVED***), a("promise/utils", ["exports"], function (a) { "use strict"; function b(a) { return c(a) || "object" == typeof a && null !== a ***REMOVED*** function c(a) { return "function" == typeof a ***REMOVED*** function d(a) { return "[object Array]" === Object.prototype.toString.call(a) ***REMOVED*** var e = Date.now || function () { return (new Date).getTime() ***REMOVED***; a.objectOrFunction = b, a.isFunction = c, a.isArray = d, a.now = e ***REMOVED***), b("promise/polyfill").polyfill() ***REMOVED***(), function (a, b) { "object" == typeof exports && "object" == typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? exports.localforage = b() : a.localforage = b() ***REMOVED***(this, function () { return function (a) { function b(d) { if (c[d]) return c[d].exports; var e = c[d] = { exports: {***REMOVED***, id: d, loaded: !1 ***REMOVED***; return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports ***REMOVED*** var c = {***REMOVED***; return b.m = a, b.c = c, b.p = "", b(0) ***REMOVED***([function (a, b, c) { "use strict"; function d(a, b) { if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function") ***REMOVED*** b.__esModule = !0; var e = function (a) { function b(a, b) { a[b] = function () { var c = arguments; return a.ready().then(function () { return a[b].apply(a, c) ***REMOVED***) ***REMOVED*** ***REMOVED*** function e() { for (var a = 1; a < arguments.length; a++) { var b = arguments[a]; if (b) for (var c in b) b.hasOwnProperty(c) && (m(b[c]) ? arguments[0][c] = b[c].slice() : arguments[0][c] = b[c]) ***REMOVED*** return arguments[0] ***REMOVED*** function f(a) { for (var b in h) if (h.hasOwnProperty(b) && h[b] === a) return !0; return !1 ***REMOVED*** var g = {***REMOVED***, h = { INDEXEDDB: "asyncStorage", LOCALSTORAGE: "localStorageWrapper", WEBSQL: "webSQLStorage" ***REMOVED***, i = [h.INDEXEDDB, h.WEBSQL, h.LOCALSTORAGE], j = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"], k = { description: "", driver: i.slice(), name: "localforage", size: 4980736, storeName: "keyvaluepairs", version: 1 ***REMOVED***, l = function (a) { var b = {***REMOVED***; return b[h.INDEXEDDB] = !!function () { try { var b = b || a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB || a.OIndexedDB || a.msIndexedDB; return "undefined" != typeof a.openDatabase && a.navigator && a.navigator.userAgent && /Safari/.test(a.navigator.userAgent) && !/Chrome/.test(a.navigator.userAgent) ? !1 : b && "function" == typeof b.open && "undefined" != typeof a.IDBKeyRange ***REMOVED*** catch (c) { return !1 ***REMOVED*** ***REMOVED***(), b[h.WEBSQL] = !!function () { try { return a.openDatabase ***REMOVED*** catch (b) { return !1 ***REMOVED*** ***REMOVED***(), b[h.LOCALSTORAGE] = !!function () { try { return a.localStorage && "setItem" in a.localStorage && a.localStorage.setItem ***REMOVED*** catch (b) { return !1 ***REMOVED*** ***REMOVED***(), b ***REMOVED***(a), m = Array.isArray || function (a) { return "[object Array]" === Object.prototype.toString.call(a) ***REMOVED***, n = function () { function a(b) { d(this, a), this.INDEXEDDB = h.INDEXEDDB, this.LOCALSTORAGE = h.LOCALSTORAGE, this.WEBSQL = h.WEBSQL, this._defaultConfig = e({***REMOVED***, k), this._config = e({***REMOVED***, this._defaultConfig, b), this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver) ***REMOVED*** return a.prototype.config = function (a) { if ("object" == typeof a) { if (this._ready) return new Error("Can't call config() after localforage has been used."); for (var b in a) "storeName" === b && (a[b] = a[b].replace(/\W/g, "_")), this._config[b] = a[b]; return "driver" in a && a.driver && this.setDriver(this._config.driver), !0 ***REMOVED*** return "string" == typeof a ? this._config[a] : this._config ***REMOVED***, a.prototype.defineDriver = function (a, b, c) { var d = new Promise(function (b, c) { try { var d = a._driver, e = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver"), h = new Error("Custom driver name already in use: " + a._driver); if (!a._driver) return void c(e); if (f(a._driver)) return void c(h); for (var i = j.concat("_initStorage"), k = 0; k < i.length; k++) { var m = i[k]; if (!m || !a[m] || "function" != typeof a[m]) return void c(e) ***REMOVED*** var n = Promise.resolve(!0); "_support" in a && (n = a._support && "function" == typeof a._support ? a._support() : Promise.resolve(!!a._support)), n.then(function (c) { l[d] = c, g[d] = a, b() ***REMOVED***, c) ***REMOVED*** catch (o) { c(o) ***REMOVED*** ***REMOVED***); return d.then(b, c), d ***REMOVED***, a.prototype.driver = function () { return this._driver || null ***REMOVED***, a.prototype.getDriver = function (a, b, d) { var e = this, h = function () { if (f(a)) switch (a) { case e.INDEXEDDB: return new Promise(function (a, b) { a(c(1)) ***REMOVED***); case e.LOCALSTORAGE: return new Promise(function (a, b) { a(c(2)) ***REMOVED***); case e.WEBSQL: return new Promise(function (a, b) { a(c(4)) ***REMOVED***) ***REMOVED*** else if (g[a]) return Promise.resolve(g[a]); return Promise.reject(new Error("Driver not found.")) ***REMOVED***(); return h.then(b, d), h ***REMOVED***, a.prototype.getSerializer = function (a) { var b = new Promise(function (a, b) { a(c(3)) ***REMOVED***); return a && "function" == typeof a && b.then(function (b) { a(b) ***REMOVED***), b ***REMOVED***, a.prototype.ready = function (a) { var b = this, c = b._driverSet.then(function () { return null === b._ready && (b._ready = b._initDriver()), b._ready ***REMOVED***); return c.then(a, a), c ***REMOVED***, a.prototype.setDriver = function (a, b, c) { function d() { f._config.driver = f.driver() ***REMOVED*** function e(a) { return function () { function b() { for (; c < a.length;) { var e = a[c]; return c++, f._dbInfo = null, f._ready = null, f.getDriver(e).then(function (a) { return f._extend(a), d(), f._ready = f._initStorage(f._config), f._ready ***REMOVED***)["catch"](b) ***REMOVED*** d(); var g = new Error("No available storage method found."); return f._driverSet = Promise.reject(g), f._driverSet ***REMOVED*** var c = 0; return b() ***REMOVED*** ***REMOVED*** var f = this; m(a) || (a = [a]); var g = this._getSupportedDrivers(a), h = null !== this._driverSet ? this._driverSet["catch"](function () { return Promise.resolve() ***REMOVED***) : Promise.resolve(); return this._driverSet = h.then(function () { var a = g[0]; return f._dbInfo = null, f._ready = null, f.getDriver(a).then(function (a) { f._driver = a._driver, d(), f._wrapLibraryMethodsWithReady(), f._initDriver = e(g) ***REMOVED***) ***REMOVED***)["catch"](function () { d(); var a = new Error("No available storage method found."); return f._driverSet = Promise.reject(a), f._driverSet ***REMOVED***), this._driverSet.then(b, c), this._driverSet ***REMOVED***, a.prototype.supports = function (a) { return !!l[a] ***REMOVED***, a.prototype._extend = function (a) { e(this, a) ***REMOVED***, a.prototype._getSupportedDrivers = function (a) { for (var b = [], c = 0, d = a.length; d > c; c++) { var e = a[c]; this.supports(e) && b.push(e) ***REMOVED*** return b ***REMOVED***, a.prototype._wrapLibraryMethodsWithReady = function () { for (var a = 0; a < j.length; a++) b(this, j[a]) ***REMOVED***, a.prototype.createInstance = function (b) { return new a(b) ***REMOVED***, a ***REMOVED***(); return new n ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = e, a.exports = b["default"] ***REMOVED***, function (a, b) { "use strict"; b.__esModule = !0; var c = function (a) { function b(b, c) { b = b || [], c = c || {***REMOVED***; try { return new Blob(b, c) ***REMOVED*** catch (d) { if ("TypeError" !== d.name) throw d; for (var e = a.BlobBuilder || a.MSBlobBuilder || a.MozBlobBuilder || a.WebKitBlobBuilder, f = new e, g = 0; g < b.length; g += 1) f.append(b[g]); return f.getBlob(c.type) ***REMOVED*** ***REMOVED*** function c(a) { for (var b = a.length, c = new ArrayBuffer(b), d = new Uint8Array(c), e = 0; b > e; e++) d[e] = a.charCodeAt(e); return c ***REMOVED*** function d(a) { return new Promise(function (b, c) { var d = new XMLHttpRequest; d.open("GET", a), d.withCredentials = !0, d.responseType = "arraybuffer", d.onreadystatechange = function () { return 4 === d.readyState ? 200 === d.status ? b({ response: d.response, type: d.getResponseHeader("Content-Type") ***REMOVED***) : void c({ status: d.status, response: d.response ***REMOVED***) : void 0 ***REMOVED***, d.send() ***REMOVED***) ***REMOVED*** function e(a) { return new Promise(function (c, e) { var f = b([""], { type: "image/png" ***REMOVED***), g = a.transaction([D], "readwrite"); g.objectStore(D).put(f, "key"), g.oncomplete = function () { var b = a.transaction([D], "readwrite"), f = b.objectStore(D).get("key"); f.onerror = e, f.onsuccess = function (a) { var b = a.target.result, e = URL.createObjectURL(b); d(e).then(function (a) { c(!(!a || "image/png" !== a.type)) ***REMOVED***, function () { c(!1) ***REMOVED***).then(function () { URL.revokeObjectURL(e) ***REMOVED***) ***REMOVED*** ***REMOVED***, g.onerror = g.onabort = e ***REMOVED***)["catch"](function () { return !1 ***REMOVED***) ***REMOVED*** function f(a) { return "boolean" == typeof B ? Promise.resolve(B) : e(a).then(function (a) { return B = a ***REMOVED***) ***REMOVED*** function g(a) { return new Promise(function (b, c) { var d = new FileReader; d.onerror = c, d.onloadend = function (c) { var d = btoa(c.target.result || ""); b({ __local_forage_encoded_blob: !0, data: d, type: a.type ***REMOVED***) ***REMOVED***, d.readAsBinaryString(a) ***REMOVED***) ***REMOVED*** function h(a) { var d = c(atob(a.data)); return b([d], { type: a.type ***REMOVED***) ***REMOVED*** function i(a) { return a && a.__local_forage_encoded_blob ***REMOVED*** function j(a) { var b = this, c = b._initReady().then(function () { var a = C[b._dbInfo.name]; return a && a.dbReady ? a.dbReady : void 0 ***REMOVED***); return c.then(a, a), c ***REMOVED*** function k(a) { var b = C[a.name], c = {***REMOVED***; c.promise = new Promise(function (a) { c.resolve = a ***REMOVED***), b.deferredOperations.push(c), b.dbReady ? b.dbReady = b.dbReady.then(function () { return c.promise ***REMOVED***) : b.dbReady = c.promise ***REMOVED*** function l(a) { var b = C[a.name], c = b.deferredOperations.pop(); c && c.resolve() ***REMOVED*** function m(a) { function b() { return Promise.resolve() ***REMOVED*** var c = this, d = { db: null ***REMOVED***; if (a) for (var e in a) d[e] = a[e]; C || (C = {***REMOVED***); var f = C[d.name]; f || (f = { forages: [], db: null, dbReady: null, deferredOperations: [] ***REMOVED***, C[d.name] = f), f.forages.push(c), c._initReady || (c._initReady = c.ready, c.ready = j); for (var g = [], h = 0; h < f.forages.length; h++) { var i = f.forages[h]; i !== c && g.push(i._initReady()["catch"](b)) ***REMOVED*** var k = f.forages.slice(0); return Promise.all(g).then(function () { return d.db = f.db, n(d) ***REMOVED***).then(function (a) { return d.db = a, q(d, c._defaultConfig.version) ? o(d) : a ***REMOVED***).then(function (a) { d.db = f.db = a, c._dbInfo = d; for (var b = 0; b < k.length; b++) { var e = k[b]; e !== c && (e._dbInfo.db = d.db, e._dbInfo.version = d.version) ***REMOVED*** ***REMOVED***) ***REMOVED*** function n(a) { return p(a, !1) ***REMOVED*** function o(a) { return p(a, !0) ***REMOVED*** function p(b, c) { return new Promise(function (d, e) { if (b.db) { if (!c) return d(b.db); k(b), b.db.close() ***REMOVED*** var f = [b.name]; c && f.push(b.version); var g = A.open.apply(A, f); c && (g.onupgradeneeded = function (c) { var d = g.result; try { d.createObjectStore(b.storeName), c.oldVersion <= 1 && d.createObjectStore(D) ***REMOVED*** catch (e) { if ("ConstraintError" !== e.name) throw e; a.console.warn('The database "' + b.name + '" has been upgraded from version ' + c.oldVersion + " to version " + c.newVersion + ', but the storage "' + b.storeName + '" already exists.') ***REMOVED*** ***REMOVED***), g.onerror = function () { e(g.error) ***REMOVED***, g.onsuccess = function () { d(g.result), l(b) ***REMOVED*** ***REMOVED***) ***REMOVED*** function q(b, c) { if (!b.db) return !0; var d = !b.db.objectStoreNames.contains(b.storeName), e = b.version < b.db.version, f = b.version > b.db.version; if (e && (b.version !== c && a.console.warn('The database "' + b.name + "\" can't be downgraded from version " + b.db.version + " to version " + b.version + "."), b.version = b.db.version), f || d) { if (d) { var g = b.db.version + 1; g > b.version && (b.version = g) ***REMOVED*** return !0 ***REMOVED*** return !1 ***REMOVED*** function r(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = new Promise(function (a, c) { d.ready().then(function () { var e = d._dbInfo, f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName), g = f.get(b); g.onsuccess = function () { var b = g.result; void 0 === b && (b = null), i(b) && (b = h(b)), a(b) ***REMOVED***, g.onerror = function () { c(g.error) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(e, c), e ***REMOVED*** function s(a, b) { var c = this, d = new Promise(function (b, d) { c.ready().then(function () { var e = c._dbInfo, f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName), g = f.openCursor(), j = 1; g.onsuccess = function () { var c = g.result; if (c) { var d = c.value; i(d) && (d = h(d)); var e = a(d, c.key, j++); void 0 !== e ? b(e) : c["continue"]() ***REMOVED*** else b() ***REMOVED***, g.onerror = function () { d(g.error) ***REMOVED*** ***REMOVED***)["catch"](d) ***REMOVED***); return z(d, b), d ***REMOVED*** function t(b, c, d) { var e = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var h = new Promise(function (a, d) { var h; e.ready().then(function () { return h = e._dbInfo, c instanceof Blob ? f(h.db).then(function (a) { return a ? c : g(c) ***REMOVED***) : c ***REMOVED***).then(function (c) { var e = h.db.transaction(h.storeName, "readwrite"), f = e.objectStore(h.storeName); null === c && (c = void 0), e.oncomplete = function () { void 0 === c && (c = null), a(c) ***REMOVED***, e.onabort = e.onerror = function () { var a = g.error ? g.error : g.transaction.error; d(a) ***REMOVED***; var g = f.put(c, b) ***REMOVED***)["catch"](d) ***REMOVED***); return z(h, d), h ***REMOVED*** function u(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = new Promise(function (a, c) { d.ready().then(function () { var e = d._dbInfo, f = e.db.transaction(e.storeName, "readwrite"), g = f.objectStore(e.storeName), h = g["delete"](b); f.oncomplete = function () { a() ***REMOVED***, f.onerror = function () { c(h.error) ***REMOVED***, f.onabort = function () { var a = h.error ? h.error : h.transaction.error; c(a) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(e, c), e ***REMOVED*** function v(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo, e = d.db.transaction(d.storeName, "readwrite"), f = e.objectStore(d.storeName), g = f.clear(); e.oncomplete = function () { a() ***REMOVED***, e.onabort = e.onerror = function () { var a = g.error ? g.error : g.transaction.error; c(a) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(c, a), c ***REMOVED*** function w(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo, e = d.db.transaction(d.storeName, "readonly").objectStore(d.storeName), f = e.count(); f.onsuccess = function () { a(f.result) ***REMOVED***, f.onerror = function () { c(f.error) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(c, a), c ***REMOVED*** function x(a, b) { var c = this, d = new Promise(function (b, d) { return 0 > a ? void b(null) : void c.ready().then(function () { var e = c._dbInfo, f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName), g = !1, h = f.openCursor(); h.onsuccess = function () { var c = h.result; return c ? void (0 === a ? b(c.key) : g ? b(c.key) : (g = !0, c.advance(a))) : void b(null) ***REMOVED***, h.onerror = function () { d(h.error) ***REMOVED*** ***REMOVED***)["catch"](d) ***REMOVED***); return z(d, b), d ***REMOVED*** function y(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo, e = d.db.transaction(d.storeName, "readonly").objectStore(d.storeName), f = e.openCursor(), g = []; f.onsuccess = function () { var b = f.result; return b ? (g.push(b.key), void b["continue"]()) : void a(g) ***REMOVED***, f.onerror = function () { c(f.error) ***REMOVED*** ***REMOVED***)["catch"](c) ***REMOVED***); return z(c, a), c ***REMOVED*** function z(a, b) { b && a.then(function (a) { b(null, a) ***REMOVED***, function (a) { b(a) ***REMOVED***) ***REMOVED*** var A = A || a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB || a.OIndexedDB || a.msIndexedDB; if (A) { var B, C, D = "local-forage-detect-blob-support", E = { _driver: "asyncStorage", _initStorage: m, iterate: s, getItem: r, setItem: t, removeItem: u, clear: v, length: w, key: x, keys: y ***REMOVED***; return E ***REMOVED*** ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = c, a.exports = b["default"] ***REMOVED***, function (a, b, c) { "use strict"; b.__esModule = !0; var d = function (a) { function b(a) { var b = this, d = {***REMOVED***; if (a) for (var e in a) d[e] = a[e]; return d.keyPrefix = d.name + "/", d.storeName !== b._defaultConfig.storeName && (d.keyPrefix += d.storeName + "/"), b._dbInfo = d, new Promise(function (a, b) { a(c(3)) ***REMOVED***).then(function (a) { return d.serializer = a, Promise.resolve() ***REMOVED***) ***REMOVED*** function d(a) { var b = this, c = b.ready().then(function () { for (var a = b._dbInfo.keyPrefix, c = m.length - 1; c >= 0; c--) { var d = m.key(c); 0 === d.indexOf(a) && m.removeItem(d) ***REMOVED*** ***REMOVED***); return l(c, a), c ***REMOVED*** function e(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = d.ready().then(function () { var a = d._dbInfo, c = m.getItem(a.keyPrefix + b); return c && (c = a.serializer.deserialize(c)), c ***REMOVED***); return l(e, c), e ***REMOVED*** function f(a, b) { var c = this, d = c.ready().then(function () { for (var b = c._dbInfo, d = b.keyPrefix, e = d.length, f = m.length, g = 1, h = 0; f > h; h++) { var i = m.key(h); if (0 === i.indexOf(d)) { var j = m.getItem(i); if (j && (j = b.serializer.deserialize(j)), j = a(j, i.substring(e), g++), void 0 !== j) return j ***REMOVED*** ***REMOVED*** ***REMOVED***); return l(d, b), d ***REMOVED*** function g(a, b) { var c = this, d = c.ready().then(function () { var b, d = c._dbInfo; try { b = m.key(a) ***REMOVED*** catch (e) { b = null ***REMOVED*** return b && (b = b.substring(d.keyPrefix.length)), b ***REMOVED***); return l(d, b), d ***REMOVED*** function h(a) { var b = this, c = b.ready().then(function () { for (var a = b._dbInfo, c = m.length, d = [], e = 0; c > e; e++) 0 === m.key(e).indexOf(a.keyPrefix) && d.push(m.key(e).substring(a.keyPrefix.length)); return d ***REMOVED***); return l(c, a), c ***REMOVED*** function i(a) { var b = this, c = b.keys().then(function (a) { return a.length ***REMOVED***); return l(c, a), c ***REMOVED*** function j(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = d.ready().then(function () { var a = d._dbInfo; m.removeItem(a.keyPrefix + b) ***REMOVED***); return l(e, c), e ***REMOVED*** function k(b, c, d) { var e = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var f = e.ready().then(function () { void 0 === c && (c = null); var a = c; return new Promise(function (d, f) { var g = e._dbInfo; g.serializer.serialize(c, function (c, e) { if (e) f(e); else try { m.setItem(g.keyPrefix + b, c), d(a) ***REMOVED*** catch (h) { ("QuotaExceededError" === h.name || "NS_ERROR_DOM_QUOTA_REACHED" === h.name) && f(h), f(h) ***REMOVED*** ***REMOVED***) ***REMOVED***) ***REMOVED***); return l(f, d), f ***REMOVED*** function l(a, b) { b && a.then(function (a) { b(null, a) ***REMOVED***, function (a) { b(a) ***REMOVED***) ***REMOVED*** var m = null; try { if (!(a.localStorage && "setItem" in a.localStorage)) return; m = a.localStorage ***REMOVED*** catch (n) { return ***REMOVED*** var o = { _driver: "localStorageWrapper", _initStorage: b, iterate: f, getItem: e, setItem: k, removeItem: j, clear: d, length: i, key: g, keys: h ***REMOVED***; return o ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = d, a.exports = b["default"] ***REMOVED***, function (a, b) { "use strict"; b.__esModule = !0; var c = function (a) { function b(b, c) { b = b || [], c = c || {***REMOVED***; try { return new Blob(b, c) ***REMOVED*** catch (d) { if ("TypeError" !== d.name) throw d; for (var e = a.BlobBuilder || a.MSBlobBuilder || a.MozBlobBuilder || a.WebKitBlobBuilder, f = new e, g = 0; g < b.length; g += 1) f.append(b[g]); return f.getBlob(c.type) ***REMOVED*** ***REMOVED*** function c(a, b) { var c = ""; if (a && (c = a.toString()), a && ("[object ArrayBuffer]" === a.toString() || a.buffer && "[object ArrayBuffer]" === a.buffer.toString())) { var d, e = j; a instanceof ArrayBuffer ? (d = a, e += l) : (d = a.buffer, "[object Int8Array]" === c ? e += n : "[object Uint8Array]" === c ? e += o : "[object Uint8ClampedArray]" === c ? e += p : "[object Int16Array]" === c ? e += q : "[object Uint16Array]" === c ? e += s : "[object Int32Array]" === c ? e += r : "[object Uint32Array]" === c ? e += t : "[object Float32Array]" === c ? e += u : "[object Float64Array]" === c ? e += v : b(new Error("Failed to get type for BinaryArray"))), b(e + f(d)) ***REMOVED*** else if ("[object Blob]" === c) { var g = new FileReader; g.onload = function () { var c = h + a.type + "~" + f(this.result); b(j + m + c) ***REMOVED***, g.readAsArrayBuffer(a) ***REMOVED*** else try { b(JSON.stringify(a)) ***REMOVED*** catch (i) { console.error("Couldn't convert value into a JSON string: ", a), b(null, i) ***REMOVED*** ***REMOVED*** function d(a) { if (a.substring(0, k) !== j) return JSON.parse(a); var c, d = a.substring(w), f = a.substring(k, w); if (f === m && i.test(d)) { var g = d.match(i); c = g[1], d = d.substring(g[0].length) ***REMOVED*** var h = e(d); switch (f) { case l: return h; case m: return b([h], { type: c ***REMOVED***); case n: return new Int8Array(h); case o: return new Uint8Array(h); case p: return new Uint8ClampedArray(h); case q: return new Int16Array(h); case s: return new Uint16Array(h); case r: return new Int32Array(h); case t: return new Uint32Array(h); case u: return new Float32Array(h); case v: return new Float64Array(h); default: throw new Error("Unkown type: " + f) ***REMOVED*** ***REMOVED*** function e(a) { var b, c, d, e, f, h = .75 * a.length, i = a.length, j = 0; "=" === a[a.length - 1] && (h--, "=" === a[a.length - 2] && h--); var k = new ArrayBuffer(h), l = new Uint8Array(k); for (b = 0; i > b; b += 4) c = g.indexOf(a[b]), d = g.indexOf(a[b + 1]), e = g.indexOf(a[b + 2]), f = g.indexOf(a[b + 3]), l[j++] = c << 2 | d >> 4, l[j++] = (15 & d) << 4 | e >> 2, l[j++] = (3 & e) << 6 | 63 & f; return k ***REMOVED*** function f(a) { var b, c = new Uint8Array(a), d = ""; for (b = 0; b < c.length; b += 3) d += g[c[b] >> 2], d += g[(3 & c[b]) << 4 | c[b + 1] >> 4], d += g[(15 & c[b + 1]) << 2 | c[b + 2] >> 6], d += g[63 & c[b + 2]]; return c.length % 3 === 2 ? d = d.substring(0, d.length - 1) + "=" : c.length % 3 === 1 && (d = d.substring(0, d.length - 2) + "=="), d ***REMOVED*** var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", h = "~~local_forage_type~", i = /^~~local_forage_type~([^~]+)~/, j = "__lfsc__:", k = j.length, l = "arbf", m = "blob", n = "si08", o = "ui08", p = "uic8", q = "si16", r = "si32", s = "ur16", t = "ui32", u = "fl32", v = "fl64", w = k + l.length, x = { serialize: c, deserialize: d, stringToBuffer: e, bufferToString: f ***REMOVED***; return x ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = c, a.exports = b["default"] ***REMOVED***, function (a, b, c) { "use strict"; b.__esModule = !0; var d = function (a) { function b(a) { var b = this, d = { db: null ***REMOVED***; if (a) for (var e in a) d[e] = "string" != typeof a[e] ? a[e].toString() : a[e]; var f = new Promise(function (a, c) { try { d.db = m(d.name, String(d.version), d.description, d.size) ***REMOVED*** catch (e) { return c(e) ***REMOVED*** d.db.transaction(function (e) { e.executeSql("CREATE TABLE IF NOT EXISTS " + d.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], function () { b._dbInfo = d, a() ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***); return new Promise(function (a, b) { a(c(3)) ***REMOVED***).then(function (a) { return d.serializer = a, f ***REMOVED***) ***REMOVED*** function d(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = new Promise(function (a, c) { d.ready().then(function () { var e = d._dbInfo; e.db.transaction(function (d) { d.executeSql("SELECT * FROM " + e.storeName + " WHERE key = ? LIMIT 1", [b], function (b, c) { var d = c.rows.length ? c.rows.item(0).value : null; d && (d = e.serializer.deserialize(d)), a(d) ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(e, c), e ***REMOVED*** function e(a, b) { var c = this, d = new Promise(function (b, d) { c.ready().then(function () { var e = c._dbInfo; e.db.transaction(function (c) { c.executeSql("SELECT * FROM " + e.storeName, [], function (c, d) { for (var f = d.rows, g = f.length, h = 0; g > h; h++) { var i = f.item(h), j = i.value; if (j && (j = e.serializer.deserialize(j)), j = a(j, i.key, h + 1), void 0 !== j) return void b(j) ***REMOVED*** b() ***REMOVED***, function (a, b) { d(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](d) ***REMOVED***); return l(d, b), d ***REMOVED*** function f(b, c, d) { var e = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var f = new Promise(function (a, d) { e.ready().then(function () { void 0 === c && (c = null); var f = c, g = e._dbInfo; g.serializer.serialize(c, function (c, e) { e ? d(e) : g.db.transaction(function (e) { e.executeSql("INSERT OR REPLACE INTO " + g.storeName + " (key, value) VALUES (?, ?)", [b, c], function () { a(f) ***REMOVED***, function (a, b) { d(b) ***REMOVED***) ***REMOVED***, function (a) { a.code === a.QUOTA_ERR && d(a) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](d) ***REMOVED***); return l(f, d), f ***REMOVED*** function g(b, c) { var d = this; "string" != typeof b && (a.console.warn(b + " used as a key, but it is not a string."), b = String(b)); var e = new Promise(function (a, c) { d.ready().then(function () { var e = d._dbInfo; e.db.transaction(function (d) { d.executeSql("DELETE FROM " + e.storeName + " WHERE key = ?", [b], function () { a() ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(e, c), e ***REMOVED*** function h(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo; d.db.transaction(function (b) { b.executeSql("DELETE FROM " + d.storeName, [], function () { a() ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(c, a), c ***REMOVED*** function i(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo; d.db.transaction(function (b) { b.executeSql("SELECT COUNT(key) as c FROM " + d.storeName, [], function (b, c) { var d = c.rows.item(0).c; a(d) ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(c, a), c ***REMOVED*** function j(a, b) { var c = this, d = new Promise(function (b, d) { c.ready().then(function () { var e = c._dbInfo; e.db.transaction(function (c) { c.executeSql("SELECT key FROM " + e.storeName + " WHERE id = ? LIMIT 1", [a + 1], function (a, c) { var d = c.rows.length ? c.rows.item(0).key : null; b(d) ***REMOVED***, function (a, b) { d(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](d) ***REMOVED***); return l(d, b), d ***REMOVED*** function k(a) { var b = this, c = new Promise(function (a, c) { b.ready().then(function () { var d = b._dbInfo; d.db.transaction(function (b) { b.executeSql("SELECT key FROM " + d.storeName, [], function (b, c) { for (var d = [], e = 0; e < c.rows.length; e++) d.push(c.rows.item(e).key); a(d) ***REMOVED***, function (a, b) { c(b) ***REMOVED***) ***REMOVED***) ***REMOVED***)["catch"](c) ***REMOVED***); return l(c, a), c ***REMOVED*** function l(a, b) { b && a.then(function (a) { b(null, a) ***REMOVED***, function (a) { b(a) ***REMOVED***) ***REMOVED*** var m = a.openDatabase; if (m) { var n = { _driver: "webSQLStorage", _initStorage: b, iterate: e, getItem: d, setItem: f, removeItem: g, clear: h, length: i, key: j, keys: k ***REMOVED***; return n ***REMOVED*** ***REMOVED***("undefined" != typeof window ? window : self); b["default"] = d, a.exports = b["default"] ***REMOVED***]) ***REMOVED***);

var LZString = function () { function o(o, r) { if (!t[o]) { t[o] = {***REMOVED***; for (var n = 0; n < o.length; n++) t[o][o.charAt(n)] = n ***REMOVED*** return t[o][r] ***REMOVED*** var r = String.fromCharCode, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", t = {***REMOVED***, i = { compressToBase64: function (o) { if (null == o) return ""; var r = i._compress(o, 6, function (o) { return n.charAt(o) ***REMOVED***); switch (r.length % 4) { default: case 0: return r; case 1: return r + "==="; case 2: return r + "=="; case 3: return r + "=" ***REMOVED*** ***REMOVED***, decompressFromBase64: function (r) { return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function (e) { return o(n, r.charAt(e)) ***REMOVED***) ***REMOVED***, compressToUTF16: function (o) { return null == o ? "" : i._compress(o, 15, function (o) { return r(o + 32) ***REMOVED***) + " " ***REMOVED***, decompressFromUTF16: function (o) { return null == o ? "" : "" == o ? null : i._decompress(o.length, 16384, function (r) { return o.charCodeAt(r) - 32 ***REMOVED***) ***REMOVED***, compressToUint8Array: function (o) { for (var r = i.compress(o), n = new Uint8Array(2 * r.length), e = 0, t = r.length; t > e; e++) { var s = r.charCodeAt(e); n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256 ***REMOVED*** return n ***REMOVED***, decompressFromUint8Array: function (o) { if (null === o || void 0 === o) return i.decompress(o); for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++) n[e] = 256 * o[2 * e] + o[2 * e + 1]; var s = []; return n.forEach(function (o) { s.push(r(o)) ***REMOVED***), i.decompress(s.join("")) ***REMOVED***, compressToEncodedURIComponent: function (o) { return null == o ? "" : i._compress(o, 6, function (o) { return e.charAt(o) ***REMOVED***) ***REMOVED***, decompressFromEncodedURIComponent: function (r) { return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function (n) { return o(e, r.charAt(n)) ***REMOVED***)) ***REMOVED***, compress: function (o) { return i._compress(o, 16, function (o) { return r(o) ***REMOVED***) ***REMOVED***, _compress: function (o, r, n) { if (null == o) return ""; var e, t, i, s = {***REMOVED***, p = {***REMOVED***, u = "", c = "", a = "", l = 2, f = 3, h = 2, d = [], m = 0, v = 0; for (i = 0; i < o.length; i += 1) if (u = o.charAt(i), Object.prototype.hasOwnProperty.call(s, u) || (s[u] = f++, p[u] = !0), c = a + u, Object.prototype.hasOwnProperty.call(s, c)) a = c; else { if (Object.prototype.hasOwnProperty.call(p, a)) { if (a.charCodeAt(0) < 256) { for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++; for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 ***REMOVED*** else { for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0; for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 ***REMOVED*** l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a] ***REMOVED*** else for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; l--, 0 == l && (l = Math.pow(2, h), h++), s[c] = f++, a = String(u) ***REMOVED*** if ("" !== a) { if (Object.prototype.hasOwnProperty.call(p, a)) { if (a.charCodeAt(0) < 256) { for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++; for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 ***REMOVED*** else { for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0; for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 ***REMOVED*** l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a] ***REMOVED*** else for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; l--, 0 == l && (l = Math.pow(2, h), h++) ***REMOVED*** for (t = 2, e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; for (; ;) { if (m <<= 1, v == r - 1) { d.push(n(m)); break ***REMOVED*** v++ ***REMOVED*** return d.join("") ***REMOVED***, decompress: function (o) { return null == o ? "" : "" == o ? null : i._decompress(o.length, 32768, function (r) { return o.charCodeAt(r) ***REMOVED***) ***REMOVED***, _decompress: function (o, n, e) { var t, i, s, p, u, c, a, l, f = [], h = 4, d = 4, m = 3, v = "", w = [], A = { val: e(0), position: n, index: 1 ***REMOVED***; for (i = 0; 3 > i; i += 1) f[i] = i; for (p = 0, c = Math.pow(2, 2), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; switch (t = p) { case 0: for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; l = r(p); break; case 1: for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; l = r(p); break; case 2: return "" ***REMOVED*** for (f[3] = l, s = l, w.push(l) ; ;) { if (A.index > o) return ""; for (p = 0, c = Math.pow(2, m), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; switch (l = p) { case 0: for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; f[d++] = r(p), l = d - 1, h--; break; case 1: for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; f[d++] = r(p), l = d - 1, h--; break; case 2: return w.join("") ***REMOVED*** if (0 == h && (h = Math.pow(2, m), m++), f[l]) v = f[l]; else { if (l !== d) return null; v = s + s.charAt(0) ***REMOVED*** w.push(v), f[d++] = s + v.charAt(0), h--, s = v, 0 == h && (h = Math.pow(2, m), m++) ***REMOVED*** ***REMOVED*** ***REMOVED***; return i ***REMOVED***(); "function" == typeof define && define.amd ? define(function () { return LZString ***REMOVED***) : "undefined" != typeof module && null != module && (module.exports = LZString);

!function (t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else { var n; n = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, n.ss = t() ***REMOVED*** ***REMOVED***(function () { return function t(n, r, e) { function i(u, s) { if (!r[u]) { if (!n[u]) { var a = "function" == typeof require && require; if (!s && a) return a(u, !0); if (o) return o(u, !0); var f = new Error("Cannot find module '" + u + "'"); throw f.code = "MODULE_NOT_FOUND", f ***REMOVED*** var l = r[u] = { exports: {***REMOVED*** ***REMOVED***; n[u][0].call(l.exports, function (t) { var r = n[u][1][t]; return i(r ? r : t) ***REMOVED***, l, l.exports, t, n, r, e) ***REMOVED*** return r[u].exports ***REMOVED*** for (var o = "function" == typeof require && require, u = 0; u < e.length; u++) i(e[u]); return i ***REMOVED***({ 1: [function (t, n, r) { "use strict"; var e = n.exports = {***REMOVED***; e.linearRegression = t(17), e.linearRegressionLine = t(18), e.standardDeviation = t(43), e.rSquared = t(32), e.mode = t(25), e.min = t(23), e.max = t(20), e.sum = t(45), e.quantile = t(30), e.quantileSorted = t(31), e.iqr = e.interquartileRange = t(15), e.medianAbsoluteDeviation = e.mad = t(19), e.chunk = t(7), e.shuffle = t(40), e.shuffleInPlace = t(41), e.sample = t(34), e.ckmeans = t(8), e.sortedUniqueCount = t(42), e.sumNthPowerDeviations = t(46), e.sampleCovariance = t(36), e.sampleCorrelation = t(35), e.sampleVariance = t(39), e.sampleStandardDeviation = t(38), e.sampleSkewness = t(37), e.geometricMean = t(13), e.harmonicMean = t(14), e.mean = e.average = t(21), e.median = t(22), e.rootMeanSquare = e.rms = t(33), e.variance = t(49), e.tTest = t(47), e.tTestTwoSample = t(48), e.bayesian = t(2), e.perceptron = t(27), e.epsilon = t(10), e.factorial = t(12), e.bernoulliDistribution = t(3), e.binomialDistribution = t(4), e.poissonDistribution = t(28), e.chiSquaredGoodnessOfFit = t(6), e.zScore = t(50), e.cumulativeStdNormalProbability = t(9), e.standardNormalTable = t(44), e.errorFunction = e.erf = t(11), e.inverseErrorFunction = t(16), e.probit = t(29), e.mixin = t(24) ***REMOVED***, { 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 2: 2, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 27: 27, 28: 28, 29: 29, 3: 3, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 4: 4, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 6: 6, 7: 7, 8: 8, 9: 9 ***REMOVED***], 2: [function (t, n, r) { "use strict"; function e() { this.totalCount = 0, this.data = {***REMOVED*** ***REMOVED*** e.prototype.train = function (t, n) { this.data[n] || (this.data[n] = {***REMOVED***); for (var r in t) { var e = t[r]; void 0 === this.data[n][r] && (this.data[n][r] = {***REMOVED***), void 0 === this.data[n][r][e] && (this.data[n][r][e] = 0), this.data[n][r][t[r]]++ ***REMOVED*** this.totalCount++ ***REMOVED***, e.prototype.score = function (t) { var n, r = {***REMOVED***; for (var e in t) { var i = t[e]; for (n in this.data) void 0 === r[n] && (r[n] = {***REMOVED***), this.data[n][e] ? r[n][e + "_" + i] = (this.data[n][e][i] || 0) / this.totalCount : r[n][e + "_" + i] = 0 ***REMOVED*** var o = {***REMOVED***; for (n in r) for (var u in r[n]) void 0 === o[n] && (o[n] = 0), o[n] += r[n][u]; return o ***REMOVED***, n.exports = e ***REMOVED***, {***REMOVED***], 3: [function (t, n, r) { "use strict"; function e(t) { return 0 > t || t > 1 ? null : i(1, t) ***REMOVED*** var i = t(4); n.exports = e ***REMOVED***, { 4: 4 ***REMOVED***], 4: [function (t, n, r) { "use strict"; function e(t, n) { if (0 > n || n > 1 || 0 >= t || t % 1 !== 0) return null; var r = 0, e = 0, u = {***REMOVED***; do u[r] = o(t) / (o(r) * o(t - r)) * (Math.pow(n, r) * Math.pow(1 - n, t - r)), e += u[r], r++; while (1 - i > e); return u ***REMOVED*** var i = t(10), o = t(12); n.exports = e ***REMOVED***, { 10: 10, 12: 12 ***REMOVED***], 5: [function (t, n, r) { "use strict"; var e = { 1: { .995: 0, .99: 0, .975: 0, .95: 0, .9: .02, .5: .45, .1: 2.71, .05: 3.84, .025: 5.02, .01: 6.63, .005: 7.88 ***REMOVED***, 2: { .995: .01, .99: .02, .975: .05, .95: .1, .9: .21, .5: 1.39, .1: 4.61, .05: 5.99, .025: 7.38, .01: 9.21, .005: 10.6 ***REMOVED***, 3: { .995: .07, .99: .11, .975: .22, .95: .35, .9: .58, .5: 2.37, .1: 6.25, .05: 7.81, .025: 9.35, .01: 11.34, .005: 12.84 ***REMOVED***, 4: { .995: .21, .99: .3, .975: .48, .95: .71, .9: 1.06, .5: 3.36, .1: 7.78, .05: 9.49, .025: 11.14, .01: 13.28, .005: 14.86 ***REMOVED***, 5: { .995: .41, .99: .55, .975: .83, .95: 1.15, .9: 1.61, .5: 4.35, .1: 9.24, .05: 11.07, .025: 12.83, .01: 15.09, .005: 16.75 ***REMOVED***, 6: { .995: .68, .99: .87, .975: 1.24, .95: 1.64, .9: 2.2, .5: 5.35, .1: 10.65, .05: 12.59, .025: 14.45, .01: 16.81, .005: 18.55 ***REMOVED***, 7: { .995: .99, .99: 1.25, .975: 1.69, .95: 2.17, .9: 2.83, .5: 6.35, .1: 12.02, .05: 14.07, .025: 16.01, .01: 18.48, .005: 20.28 ***REMOVED***, 8: { .995: 1.34, .99: 1.65, .975: 2.18, .95: 2.73, .9: 3.49, .5: 7.34, .1: 13.36, .05: 15.51, .025: 17.53, .01: 20.09, .005: 21.96 ***REMOVED***, 9: { .995: 1.73, .99: 2.09, .975: 2.7, .95: 3.33, .9: 4.17, .5: 8.34, .1: 14.68, .05: 16.92, .025: 19.02, .01: 21.67, .005: 23.59 ***REMOVED***, 10: { .995: 2.16, .99: 2.56, .975: 3.25, .95: 3.94, .9: 4.87, .5: 9.34, .1: 15.99, .05: 18.31, .025: 20.48, .01: 23.21, .005: 25.19 ***REMOVED***, 11: { .995: 2.6, .99: 3.05, .975: 3.82, .95: 4.57, .9: 5.58, .5: 10.34, .1: 17.28, .05: 19.68, .025: 21.92, .01: 24.72, .005: 26.76 ***REMOVED***, 12: { .995: 3.07, .99: 3.57, .975: 4.4, .95: 5.23, .9: 6.3, .5: 11.34, .1: 18.55, .05: 21.03, .025: 23.34, .01: 26.22, .005: 28.3 ***REMOVED***, 13: { .995: 3.57, .99: 4.11, .975: 5.01, .95: 5.89, .9: 7.04, .5: 12.34, .1: 19.81, .05: 22.36, .025: 24.74, .01: 27.69, .005: 29.82 ***REMOVED***, 14: { .995: 4.07, .99: 4.66, .975: 5.63, .95: 6.57, .9: 7.79, .5: 13.34, .1: 21.06, .05: 23.68, .025: 26.12, .01: 29.14, .005: 31.32 ***REMOVED***, 15: { .995: 4.6, .99: 5.23, .975: 6.27, .95: 7.26, .9: 8.55, .5: 14.34, .1: 22.31, .05: 25, .025: 27.49, .01: 30.58, .005: 32.8 ***REMOVED***, 16: { .995: 5.14, .99: 5.81, .975: 6.91, .95: 7.96, .9: 9.31, .5: 15.34, .1: 23.54, .05: 26.3, .025: 28.85, .01: 32, .005: 34.27 ***REMOVED***, 17: { .995: 5.7, .99: 6.41, .975: 7.56, .95: 8.67, .9: 10.09, .5: 16.34, .1: 24.77, .05: 27.59, .025: 30.19, .01: 33.41, .005: 35.72 ***REMOVED***, 18: { .995: 6.26, .99: 7.01, .975: 8.23, .95: 9.39, .9: 10.87, .5: 17.34, .1: 25.99, .05: 28.87, .025: 31.53, .01: 34.81, .005: 37.16 ***REMOVED***, 19: { .995: 6.84, .99: 7.63, .975: 8.91, .95: 10.12, .9: 11.65, .5: 18.34, .1: 27.2, .05: 30.14, .025: 32.85, .01: 36.19, .005: 38.58 ***REMOVED***, 20: { .995: 7.43, .99: 8.26, .975: 9.59, .95: 10.85, .9: 12.44, .5: 19.34, .1: 28.41, .05: 31.41, .025: 34.17, .01: 37.57, .005: 40 ***REMOVED***, 21: { .995: 8.03, .99: 8.9, .975: 10.28, .95: 11.59, .9: 13.24, .5: 20.34, .1: 29.62, .05: 32.67, .025: 35.48, .01: 38.93, .005: 41.4 ***REMOVED***, 22: { .995: 8.64, .99: 9.54, .975: 10.98, .95: 12.34, .9: 14.04, .5: 21.34, .1: 30.81, .05: 33.92, .025: 36.78, .01: 40.29, .005: 42.8 ***REMOVED***, 23: { .995: 9.26, .99: 10.2, .975: 11.69, .95: 13.09, .9: 14.85, .5: 22.34, .1: 32.01, .05: 35.17, .025: 38.08, .01: 41.64, .005: 44.18 ***REMOVED***, 24: { .995: 9.89, .99: 10.86, .975: 12.4, .95: 13.85, .9: 15.66, .5: 23.34, .1: 33.2, .05: 36.42, .025: 39.36, .01: 42.98, .005: 45.56 ***REMOVED***, 25: { .995: 10.52, .99: 11.52, .975: 13.12, .95: 14.61, .9: 16.47, .5: 24.34, .1: 34.28, .05: 37.65, .025: 40.65, .01: 44.31, .005: 46.93 ***REMOVED***, 26: { .995: 11.16, .99: 12.2, .975: 13.84, .95: 15.38, .9: 17.29, .5: 25.34, .1: 35.56, .05: 38.89, .025: 41.92, .01: 45.64, .005: 48.29 ***REMOVED***, 27: { .995: 11.81, .99: 12.88, .975: 14.57, .95: 16.15, .9: 18.11, .5: 26.34, .1: 36.74, .05: 40.11, .025: 43.19, .01: 46.96, .005: 49.65 ***REMOVED***, 28: { .995: 12.46, .99: 13.57, .975: 15.31, .95: 16.93, .9: 18.94, .5: 27.34, .1: 37.92, .05: 41.34, .025: 44.46, .01: 48.28, .005: 50.99 ***REMOVED***, 29: { .995: 13.12, .99: 14.26, .975: 16.05, .95: 17.71, .9: 19.77, .5: 28.34, .1: 39.09, .05: 42.56, .025: 45.72, .01: 49.59, .005: 52.34 ***REMOVED***, 30: { .995: 13.79, .99: 14.95, .975: 16.79, .95: 18.49, .9: 20.6, .5: 29.34, .1: 40.26, .05: 43.77, .025: 46.98, .01: 50.89, .005: 53.67 ***REMOVED***, 40: { .995: 20.71, .99: 22.16, .975: 24.43, .95: 26.51, .9: 29.05, .5: 39.34, .1: 51.81, .05: 55.76, .025: 59.34, .01: 63.69, .005: 66.77 ***REMOVED***, 50: { .995: 27.99, .99: 29.71, .975: 32.36, .95: 34.76, .9: 37.69, .5: 49.33, .1: 63.17, .05: 67.5, .025: 71.42, .01: 76.15, .005: 79.49 ***REMOVED***, 60: { .995: 35.53, .99: 37.48, .975: 40.48, .95: 43.19, .9: 46.46, .5: 59.33, .1: 74.4, .05: 79.08, .025: 83.3, .01: 88.38, .005: 91.95 ***REMOVED***, 70: { .995: 43.28, .99: 45.44, .975: 48.76, .95: 51.74, .9: 55.33, .5: 69.33, .1: 85.53, .05: 90.53, .025: 95.02, .01: 100.42, .005: 104.22 ***REMOVED***, 80: { .995: 51.17, .99: 53.54, .975: 57.15, .95: 60.39, .9: 64.28, .5: 79.33, .1: 96.58, .05: 101.88, .025: 106.63, .01: 112.33, .005: 116.32 ***REMOVED***, 90: { .995: 59.2, .99: 61.75, .975: 65.65, .95: 69.13, .9: 73.29, .5: 89.33, .1: 107.57, .05: 113.14, .025: 118.14, .01: 124.12, .005: 128.3 ***REMOVED***, 100: { .995: 67.33, .99: 70.06, .975: 74.22, .95: 77.93, .9: 82.36, .5: 99.33, .1: 118.5, .05: 124.34, .025: 129.56, .01: 135.81, .005: 140.17 ***REMOVED*** ***REMOVED***; n.exports = e ***REMOVED***, {***REMOVED***], 6: [function (t, n, r) { "use strict"; function e(t, n, r) { for (var e, u, s = i(t), a = 0, f = 1, l = n(s), c = [], h = [], p = 0; p < t.length; p++) void 0 === c[t[p]] && (c[t[p]] = 0), c[t[p]]++; for (p = 0; p < c.length; p++) void 0 === c[p] && (c[p] = 0); for (u in l) u in c && (h[u] = l[u] * t.length); for (u = h.length - 1; u >= 0; u--) h[u] < 3 && (h[u - 1] += h[u], h.pop(), c[u - 1] += c[u], c.pop()); for (u = 0; u < c.length; u++) a += Math.pow(c[u] - h[u], 2) / h[u]; return e = c.length - f - 1, o[e][r] < a ***REMOVED*** var i = t(21), o = t(5); n.exports = e ***REMOVED***, { 21: 21, 5: 5 ***REMOVED***], 7: [function (t, n, r) { "use strict"; function e(t, n) { var r = []; if (0 >= n) return null; for (var e = 0; e < t.length; e += n) r.push(t.slice(e, e + n)); return r ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 8: [function (t, n, r) { "use strict"; function e(t, n) { for (var r = [], e = 0; t > e; e++) { for (var i = [], o = 0; n > o; o++) i.push(0); r.push(i) ***REMOVED*** return r ***REMOVED*** function i(t, n) { if (n > t.length) throw new Error("Cannot generate more classes than there are data values"); var r = u(t), i = o(r); if (1 === i) return [r]; for (var s = e(n, r.length), a = e(n, r.length), f = 0; n > f; f++) for (var l = r[0], c = Math.max(f, 1) ; c < r.length; c++) if (0 === f) { var h = Math.pow(r[c] - l, 2); s[f][c] = s[f][c - 1] + c / (c + 1) * h; var p = c * l + r[c]; l = p / (c + 1) ***REMOVED*** else for (var v = 0, g = 0, d = c; d >= f; d--) v += (c - d) / (c - d + 1) * Math.pow(r[d] - g, 2), g = (r[d] + (c - d) * g) / (c - d + 1), d === c ? (s[f][c] = v, a[f][c] = d, d > 0 && (s[f][c] += s[f - 1][d - 1])) : 0 === d ? v <= s[f][c] && (s[f][c] = v, a[f][c] = d) : v + s[f - 1][d - 1] < s[f][c] && (s[f][c] = v + s[f - 1][d - 1], a[f][c] = d); var x = [], M = a[0].length - 1; for (f = a.length - 1; f >= 0; f--) { var w = a[f][M]; x[f] = r.slice(w, M + 1), f > 0 && (M = w - 1) ***REMOVED*** return x ***REMOVED*** var o = t(42), u = t(26); n.exports = i ***REMOVED***, { 26: 26, 42: 42 ***REMOVED***], 9: [function (t, n, r) { "use strict"; function e(t) { var n = Math.abs(t), r = Math.min(Math.round(100 * n), i.length - 1); return t >= 0 ? i[r] : +(1 - i[r]).toFixed(4) ***REMOVED*** var i = t(44); n.exports = e ***REMOVED***, { 44: 44 ***REMOVED***], 10: [function (t, n, r) { "use strict"; var e = 1e-4; n.exports = e ***REMOVED***, {***REMOVED***], 11: [function (t, n, r) { "use strict"; function e(t) { var n = 1 / (1 + .5 * Math.abs(t)), r = n * Math.exp(-Math.pow(t, 2) - 1.26551223 + 1.00002368 * n + .37409196 * Math.pow(n, 2) + .09678418 * Math.pow(n, 3) - .18628806 * Math.pow(n, 4) + .27886807 * Math.pow(n, 5) - 1.13520398 * Math.pow(n, 6) + 1.48851587 * Math.pow(n, 7) - .82215223 * Math.pow(n, 8) + .17087277 * Math.pow(n, 9)); return t >= 0 ? 1 - r : r - 1 ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 12: [function (t, n, r) { "use strict"; function e(t) { if (0 > t) return null; for (var n = 1, r = 2; t >= r; r++) n *= r; return n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 13: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; for (var n = 1, r = 0; r < t.length; r++) { if (t[r] <= 0) return null; n *= t[r] ***REMOVED*** return Math.pow(n, 1 / t.length) ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 14: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; for (var n = 0, r = 0; r < t.length; r++) { if (t[r] <= 0) return null; n += 1 / t[r] ***REMOVED*** return t.length / n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 15: [function (t, n, r) { "use strict"; function e(t) { return 0 === t.length ? null : i(t, .75) - i(t, .25) ***REMOVED*** var i = t(30); n.exports = e ***REMOVED***, { 30: 30 ***REMOVED***], 16: [function (t, n, r) { "use strict"; function e(t) { var n = 8 * (Math.PI - 3) / (3 * Math.PI * (4 - Math.PI)), r = Math.sqrt(Math.sqrt(Math.pow(2 / (Math.PI * n) + Math.log(1 - t * t) / 2, 2) - Math.log(1 - t * t) / n) - (2 / (Math.PI * n) + Math.log(1 - t * t) / 2)); return t >= 0 ? r : -r ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 17: [function (t, n, r) { "use strict"; function e(t) { var n, r, e = t.length; if (1 === e) n = 0, r = t[0][1]; else { for (var i, o, u, s = 0, a = 0, f = 0, l = 0, c = 0; e > c; c++) i = t[c], o = i[0], u = i[1], s += o, a += u, f += o * o, l += o * u; n = (e * l - s * a) / (e * f - s * s), r = a / e - n * s / e ***REMOVED*** return { m: n, b: r ***REMOVED*** ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 18: [function (t, n, r) { "use strict"; function e(t) { return function (n) { return t.b + t.m * n ***REMOVED*** ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 19: [function (t, n, r) { "use strict"; function e(t) { if (!t || 0 === t.length) return null; for (var n = i(t), r = [], e = 0; e < t.length; e++) r.push(Math.abs(t[e] - n)); return i(r) ***REMOVED*** var i = t(22); n.exports = e ***REMOVED***, { 22: 22 ***REMOVED***], 20: [function (t, n, r) { "use strict"; function e(t) { for (var n, r = 0; r < t.length; r++) (t[r] > n || void 0 === n) && (n = t[r]); return n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 21: [function (t, n, r) { "use strict"; function e(t) { return 0 === t.length ? null : i(t) / t.length ***REMOVED*** var i = t(45); n.exports = e ***REMOVED***, { 45: 45 ***REMOVED***], 22: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; var n = i(t); if (n.length % 2 === 1) return n[(n.length - 1) / 2]; var r = n[n.length / 2 - 1], e = n[n.length / 2]; return (r + e) / 2 ***REMOVED*** var i = t(26); n.exports = e ***REMOVED***, { 26: 26 ***REMOVED***], 23: [function (t, n, r) { "use strict"; function e(t) { for (var n, r = 0; r < t.length; r++) (t[r] < n || void 0 === n) && (n = t[r]); return n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 24: [function (t, n, r) { "use strict"; function e(t, n) { function r(n) { return function () { var r = Array.prototype.slice.apply(arguments); return r.unshift(this), t[n].apply(t, r) ***REMOVED*** ***REMOVED*** var e = !(!Object.defineProperty || !Object.defineProperties); if (!e) throw new Error("without defineProperty, simple-statistics cannot be mixed in"); var i, o = ["median", "standardDeviation", "sum", "sampleSkewness", "mean", "min", "max", "quantile", "geometricMean", "harmonicMean", "root_mean_square"]; i = n ? n.slice() : Array.prototype; for (var u = 0; u < o.length; u++) Object.defineProperty(i, o[u], { value: r(o[u]), configurable: !0, enumerable: !1, writable: !0 ***REMOVED***); return i ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 25: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; if (1 === t.length) return t[0]; for (var n, r = i(t), e = r[0], o = 0, u = 1, s = 1; s < r.length + 1; s++) r[s] !== e ? (u > o && (o = u, n = e), u = 1, e = r[s]) : u++; return n ***REMOVED*** var i = t(26); n.exports = e ***REMOVED***, { 26: 26 ***REMOVED***], 26: [function (t, n, r) { "use strict"; function e(t) { return t.slice().sort(function (t, n) { return t - n ***REMOVED***) ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 27: [function (t, n, r) { "use strict"; function e() { this.weights = [], this.bias = 0 ***REMOVED*** e.prototype.predict = function (t) { if (t.length !== this.weights.length) return null; for (var n = 0, r = 0; r < this.weights.length; r++) n += this.weights[r] * t[r]; return n += this.bias, n > 0 ? 1 : 0 ***REMOVED***, e.prototype.train = function (t, n) { if (0 !== n && 1 !== n) return null; t.length !== this.weights.length && (this.weights = t, this.bias = 1); var r = this.predict(t); if (r !== n) { for (var e = n - r, i = 0; i < this.weights.length; i++) this.weights[i] += e * t[i]; this.bias += e ***REMOVED*** return this ***REMOVED***, n.exports = e ***REMOVED***, {***REMOVED***], 28: [function (t, n, r) { "use strict"; function e(t) { if (0 >= t) return null; var n = 0, r = 0, e = {***REMOVED***; do e[n] = Math.pow(Math.E, -t) * Math.pow(t, n) / o(n), r += e[n], n++; while (1 - i > r); return e ***REMOVED*** var i = t(10), o = t(12); n.exports = e ***REMOVED***, { 10: 10, 12: 12 ***REMOVED***], 29: [function (t, n, r) { "use strict"; function e(t) { return 0 === t ? t = i : t >= 1 && (t = 1 - i), Math.sqrt(2) * o(2 * t - 1) ***REMOVED*** var i = t(10), o = t(16); n.exports = e ***REMOVED***, { 10: 10, 16: 16 ***REMOVED***], 30: [function (t, n, r) { "use strict"; function e(t, n) { if (0 === t.length) return null; var r = o(t); if (n.length) { for (var e = [], u = 0; u < n.length; u++) e[u] = i(r, n[u]); return e ***REMOVED*** return i(r, n) ***REMOVED*** var i = t(31), o = t(26); n.exports = e ***REMOVED***, { 26: 26, 31: 31 ***REMOVED***], 31: [function (t, n, r) { "use strict"; function e(t, n) { var r = t.length * n; return 0 > n || n > 1 ? null : 1 === n ? t[t.length - 1] : 0 === n ? t[0] : r % 1 !== 0 ? t[Math.ceil(r) - 1] : t.length % 2 === 0 ? (t[r - 1] + t[r]) / 2 : t[r] ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 32: [function (t, n, r) { "use strict"; function e(t, n) { if (t.length < 2) return 1; for (var r, e = 0, i = 0; i < t.length; i++) e += t[i][1]; r = e / t.length; for (var o = 0, u = 0; u < t.length; u++) o += Math.pow(r - t[u][1], 2); for (var s = 0, a = 0; a < t.length; a++) s += Math.pow(t[a][1] - n(t[a][0]), 2); return 1 - s / o ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 33: [function (t, n, r) { "use strict"; function e(t) { if (0 === t.length) return null; for (var n = 0, r = 0; r < t.length; r++) n += Math.pow(t[r], 2); return Math.sqrt(n / t.length) ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 34: [function (t, n, r) { "use strict"; function e(t, n, r) { var e = i(t, r); return e.slice(0, n) ***REMOVED*** var i = t(40); n.exports = e ***REMOVED***, { 40: 40 ***REMOVED***], 35: [function (t, n, r) { "use strict"; function e(t, n) { var r = i(t, n), e = o(t), u = o(n); return null === r || null === e || null === u ? null : r / e / u ***REMOVED*** var i = t(36), o = t(38); n.exports = e ***REMOVED***, { 36: 36, 38: 38 ***REMOVED***], 36: [function (t, n, r) { "use strict"; function e(t, n) { if (t.length <= 1 || t.length !== n.length) return null; for (var r = i(t), e = i(n), o = 0, u = 0; u < t.length; u++) o += (t[u] - r) * (n[u] - e); var s = t.length - 1; return o / s ***REMOVED*** var i = t(21); n.exports = e ***REMOVED***, { 21: 21 ***REMOVED***], 37: [function (t, n, r) { "use strict"; function e(t) { if (t.length < 3) return null; var n = t.length, r = Math.pow(o(t), 3), e = i(t, 3); return n * e / ((n - 1) * (n - 2) * r) ***REMOVED*** var i = t(46), o = t(38); n.exports = e ***REMOVED***, { 38: 38, 46: 46 ***REMOVED***], 38: [function (t, n, r) { "use strict"; function e(t) { return t.length <= 1 ? null : Math.sqrt(i(t)) ***REMOVED*** var i = t(39); n.exports = e ***REMOVED***, { 39: 39 ***REMOVED***], 39: [function (t, n, r) { "use strict"; function e(t) { if (t.length <= 1) return null; var n = i(t, 2), r = t.length - 1; return n / r ***REMOVED*** var i = t(46); n.exports = e ***REMOVED***, { 46: 46 ***REMOVED***], 40: [function (t, n, r) { "use strict"; function e(t, n) { return t = t.slice(), i(t.slice(), n) ***REMOVED*** var i = t(41); n.exports = e ***REMOVED***, { 41: 41 ***REMOVED***], 41: [function (t, n, r) { "use strict"; function e(t, n) { n = n || Math.random; for (var r, e, i = t.length; i > 0;) e = Math.floor(n() * i--), r = t[i], t[i] = t[e], t[e] = r; return t ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 42: [function (t, n, r) { "use strict"; function e(t) { for (var n, r = 0, e = 0; e < t.length; e++) (0 === e || t[e] !== n) && (n = t[e], r++); return r ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 43: [function (t, n, r) { "use strict"; function e(t) { return 0 === t.length ? null : Math.sqrt(i(t)) ***REMOVED*** var i = t(49); n.exports = e ***REMOVED***, { 49: 49 ***REMOVED***], 44: [function (t, n, r) { "use strict"; function e(t) { for (var n = t, r = t, e = 1; 15 > e; e++) r *= t * t / (2 * e + 1), n += r; return Math.round(1e4 * (.5 + n / i * Math.exp(-t * t / 2))) / 1e4 ***REMOVED*** for (var i = Math.sqrt(2 * Math.PI), o = [], u = 0; 3.09 >= u; u += .01) o.push(e(u)); n.exports = o ***REMOVED***, {***REMOVED***], 45: [function (t, n, r) { "use strict"; function e(t) { for (var n = 0, r = 0; r < t.length; r++) n += t[r]; return n ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***], 46: [function (t, n, r) { "use strict"; function e(t, n) { for (var r = i(t), e = 0, o = 0; o < t.length; o++) e += Math.pow(t[o] - r, n); return e ***REMOVED*** var i = t(21); n.exports = e ***REMOVED***, { 21: 21 ***REMOVED***], 47: [function (t, n, r) { "use strict"; function e(t, n) { var r = o(t), e = i(t), u = Math.sqrt(t.length); return (r - n) / (e / u) ***REMOVED*** var i = t(43), o = t(21); n.exports = e ***REMOVED***, { 21: 21, 43: 43 ***REMOVED***], 48: [function (t, n, r) { "use strict"; function e(t, n, r) { var e = t.length, u = n.length; if (!e || !u) return null; r || (r = 0); var s = i(t), a = i(n), f = ((e - 1) * o(t) + (u - 1) * o(n)) / (e + u - 2); return (s - a - r) / Math.sqrt(f * (1 / e + 1 / u)) ***REMOVED*** var i = t(21), o = t(39); n.exports = e ***REMOVED***, { 21: 21, 39: 39 ***REMOVED***], 49: [function (t, n, r) { "use strict"; function e(t) { return 0 === t.length ? null : i(t, 2) / t.length ***REMOVED*** var i = t(46); n.exports = e ***REMOVED***, { 46: 46 ***REMOVED***], 50: [function (t, n, r) { "use strict"; function e(t, n, r) { return (t - n) / r ***REMOVED*** n.exports = e ***REMOVED***, {***REMOVED***] ***REMOVED***, {***REMOVED***, [1])(1) ***REMOVED***);


var load = function (url, callback) {

    localforage.getItem("cache_version", function (error, c) {

        //if (parseInt(c) !== parseInt(cache_version) + 1) {
        //    localforage.clear();
        //    localforage.setItem("cache_version", parseInt(cache_version) + 1, loadUrl);
        //***REMOVED***
        //else {
        //    loadUrl();
        ////***REMOVED***

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
                  ***REMOVED*** "?")

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
                        // if (var_raw.subs && var_raw.subs[a]) {
                        //   var sub_ids = var_raw.subs[a].split(",");
                        // ***REMOVED***
                        // else var sub_ids = false;
                        if (var_data instanceof Array) {
                            v.loaded = var_data.reduce(function (obj, vd) {
                                // obj[sub_ids ? ids[sub_ids.indexOf(vd[a])] : vd[a]] = vd;
                                obj[vd[a]] = vd;
                                return obj;
                          ***REMOVED*** {***REMOVED***);
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

        // click first item
        // items.selectAll("a.expand").on("click", search.open_details);
        // var first_item = items.filter(function(d, i){ return i===0 ***REMOVED***);
        // if(!first_item.empty()){
        //   first_item.on("click")(first_item.datum());
        // ***REMOVED***
        // else{
        //   this.clear_details();
        // ***REMOVED***

        items.exit().remove();

        search.render();

***REMOVED***.bind(this));

***REMOVED***


//$("#home-search-input").on("keydown", function (event) {
//    if (event.keyCode == 9 || event.keyCode == 13) {
//        event.preventDefault();
//***REMOVED*** else {
//        if (event.keyCode == 8) {
//            if ((this).val().length <= 1) {
//                $(this).next().val("");
//                //$("#divResultados").html("");
//                $("#divResultados").children().remove();
//                $("#divResultados").addClass("objHidden");
//        ***REMOVED***
//    ***REMOVED***
//***REMOVED***
//***REMOVED***);

$("#home-search-input").on("keypress", function (event) {
    if (event.keyCode == 39 || event.keyCode == 123 || event.keyCode == 125 || event.keyCode == 13) {
        event.preventDefault();
***REMOVED***
***REMOVED***);

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
                
                if (data == null || data.length<=0) {
                    $("#divResultados").children().remove();
                    $("#divResultados").addClass("objHidden");
                    $("#divNoEncontrados").show();
            ***REMOVED*** else {
                    $("#divResultados").removeClass("objHidden");
                    response($.map(data, function (item) {
                        var iconocategoria = '';
                        var completo = item.Nombre+"";
                        var dividir = completo.split("-*-");
                        var divcontr = completo.split("|");
                        var nomproy = dividir[0];
                        var finan = dividir[1];
                        var contrato = divcontr[0];
                        var gasto = '';
                        var contratista = '';
                        var proceso = '';
                        if (divcontr[1] == undefined || divcontr[1] == null) {
                    ***REMOVED*** else {
                            gasto = divcontr[1].split("-*-");
                            contratista = gasto[0];
                            proceso = "Proceso: " + gasto[0];
                    ***REMOVED***

                         var financ_aux = "";

                        if (finan == undefined || finan==null) {
                            finan = '';
                    ***REMOVED***
                        else {
                            var dividir2 = finan.split("|");
                            finan = dividir2[0];
                            finan = finan.substring(0, finan.length - 2);
                    ***REMOVED***
                        if (finan != " SIN INFORMACI") {
                            if (finan != "") {
                                financ_aux = "Financiado por: " + finan;
                        ***REMOVED***
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
                            case 'CONTRATO':
                                iconocategoria = '../content/img/covid/icon-contratos.svg';
                                $("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_contratos\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + contrato + "</a><div class=\"xmalFFF\"> <a class=\"xmalFFF enlace_contratos\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">" + proceso + "</a></div><div class=\"xmalFFF\"></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_contratos\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
                                break;
                            default:
                                iconocategoria = '../content/img/icons/icon-proyectos-color.svg';
                                $("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_proyecto\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + nomproy + "</a><div class=\"xmalFFF\"> <a class=\"xmalFFF enlace_proyecto\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">" + financ_aux + "</a></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_proyecto\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");

                    ***REMOVED***
                        
                        
                ***REMOVED***));
                    
            ***REMOVED***
          ***REMOVED***
            error: function (response) {
                alert(response.responseText);
          ***REMOVED***
            failure: function (response) {
                alert(response.responseText);
        ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
        delay: 750,
        minLength: 3,
    select: function (event, ui) {
       //$(this).val(ui.item.Nombre).next().val(ui.item.Id);
       //$("#divResultados").html("");
       //return false;
***REMOVED***
***REMOVED***).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).next().val("");
        //$("#divResultados").html("");
        $("#divResultados").children().remove();
        $("#divResultados").addClass("objHidden");
***REMOVED***
***REMOVED***);


$("#covid-search-input").on("keypress", function (event) {
    if (event.keyCode == 39 || event.keyCode == 123 || event.keyCode == 125 || event.keyCode == 13) {
        event.preventDefault();
***REMOVED*** 
***REMOVED***);
$("#covid-search-input").on("keyup", function (event) {
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
            url: "../Covid/PostData",
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
                        var divcontr = completo.split("|");
                        var nomproy = dividir[0];
                        var finan = dividir[1];
                        var contrato = divcontr[0];
                        var gasto = '';
                        var contratista = '';
                        var proceso = '';
                        if (divcontr[1] == undefined || divcontr[1] == null) {
                    ***REMOVED*** else
                        {
                            gasto = divcontr[1].split("-*-");
                            contratista = gasto[0];
                            proceso = "Proceso: " + gasto[0];
                    ***REMOVED***
                        var financ_aux = "";
                        var encargado_aux = "";
                        

                        if (finan == undefined || finan == null) {
                            finan = '';
                            encargado_aux = '';
                    ***REMOVED***
                        else {
                            encargado_aux = finan;
                            var dividir2 = finan.split("|");
                            finan = dividir2[0];
                            finan = finan.substring(0, finan.length - 2);
                    ***REMOVED***
                        if (encargado_aux != "") {
                            encargado_aux = "Entidad Responsable: " + encargado_aux;
                    ***REMOVED***
                        if (finan != "") {
                            financ_aux = "Financiado por: " + finan;
                    ***REMOVED***

                        switch (item.Categoria) {
                            case 'DEPARTAMENTO':
                                iconocategoria = '../content/img/covid/icon-departamentos-color.svg';
                                $("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_covid_location\" role=\"button\" location_id= '" + item.Id + "' tipo= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + item.Nombre + "</a><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_covid_location \" role=\"button\" location_id= '" + item.Id + "' tipo= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
                                break;
                            case 'PROGRAMA':
                                iconocategoria = '../content/img/covid/icon-programa.svg';
                                $("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_programa\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + nomproy + "</a><div class=\"xmalFFF\"> <a class=\"xmalFFF enlace_proyecto\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">" + encargado_aux + "</a></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_programa\" role=\"button\" data-parameter= '" + item.Id + "' tipo= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
                                break;
                            case 'CONTRATISTA':
                                iconocategoria = '../content/img/covid/icon-contratista.svg';
                                $("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_contratista\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + contratista + "</a><div class=\"xmalFFF\"></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_contratista\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
                                break;
                            case 'CONTRATO':
                                iconocategoria = '../content/img/covid/icon-contratos.svg';
                                $("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_contratos\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + contrato + "</a><div class=\"xmalFFF\"> <a class=\"xmalFFF enlace_contratos\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">" + proceso + "</a></div><div class=\"xmalFFF\"></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_contratos\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
                                break;
                            case 'SUBSIDIO':
                                iconocategoria = '../content/img/covid/icon-subsidios.svg';
                                $("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_subsidios\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + nomproy + "</a><div class=\"xmalFFF\"> <a class=\"xmalFFF enlace_subsidios\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">" + encargado_aux + "</a></div><div class=\"xmalFFF\"></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_subsidios\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
                                break;
                            default:
                                iconocategoria = '../content/img/covid/icon-proyectos-color.svg';
                                $("#divResultados").append("<div class=\"search-item-t\"> <a class=\"enlace_resultados enlace_proyecto\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\"> <img src=\"" + iconocategoria + "\" /> " + nomproy + "</a><div class=\"xmalFFF\"> <a class=\"xmalFFF enlace_proyecto\"  role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">" + financ_aux + "</a></div><div class=\"clearfix\"><a class=\"pull-left orangeLink enlace_proyecto\" role=\"button\" data-parameter= '" + item.Id + "' data-type= '" + item.Categoria + "'\">Ver Perfil <span class=\"glyphicon glyphicon-chevron-right\"</span></a></div></div>");
                    ***REMOVED***
                ***REMOVED***));

            ***REMOVED***
          ***REMOVED***
            error: function (response) {
                alert(response.responseText);
          ***REMOVED***
            failure: function (response) {
                alert(response.responseText);
        ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
    delay: 750,
    minLength: 3,
    select: function (event, ui) {
        //$(this).val(ui.item.Nombre).next().val(ui.item.Id);
        //$("#divResultados").html("");
        //return false;
***REMOVED***
***REMOVED***).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).next().val("");
        //$("#divResultados").html("");
        $("#divResultados").children().remove();
        $("#divResultados").addClass("objHidden");
***REMOVED***
***REMOVED***);


$("#entidad").on("keyup", function (event) {
    if (event.keyCode == 9 || event.keyCode == 13) {
        event.preventDefault();
***REMOVED*** else {
        if (event.keyCode == 8) {
            if ($(this).val().length <= 1) {
                $(this).val("");

        ***REMOVED***
    ***REMOVED***
***REMOVED***
***REMOVED***).autocomplete({
    source: function (request, response) {
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/serviciosContratistas/GetEntidadRPPorNombre",
            cache: false,
            data: '{"NombreEntidad":"' + request.term + '"***REMOVED***',
            success: function (data) {
                var datos = data;
                
                if (datos == null || datos.Nombre.length <= 0) {
                    $("#divNoEncontrado").show();
                    $("#ui-id-1").hide();
            ***REMOVED*** else {
                    $("#divNoEncontrado").hide();
                    response($.map(datos.Nombre, function (item) {
                       //x alert(item);
                        return {
                            label: item,
                            value: item
                    ***REMOVED***;

                ***REMOVED***
                    ));

            ***REMOVED***
          ***REMOVED***
            error: function (response) {
                alert(response.responseText);
          ***REMOVED***
            failure: function (response) {
                alert(response.responseText);
        ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
    delay: 300,
    minLength: 1,
    select: function (event, ui) {
        //$(this).val(ui.item.Nombre).next().val(ui.item.Id);
        //$("#divResultados").html("");
        //return false;
***REMOVED***
***REMOVED***).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).val("");
        $("#divNoEncontrado").hide();
***REMOVED***

***REMOVED***);


$("#distribuc_beneficiario").on("keyup", function (event) {
        if (event.keyCode == 9 || event.keyCode == 13) {
            event.preventDefault();
    ***REMOVED*** else {
            if (event.keyCode == 8) {
                if ($(this).val().length <= 1) {
                    $(this).val("");

            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***).autocomplete({
        source: function (request, response) {
            var id_donacion = $("#numDonacion").text().trim();
            var consulta = {
                id: id_donacion, texto: request.term 
        ***REMOVED***;

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/GetEntidadBenByNombre",
                cache: false,
                data: JSON.stringify(consulta),
                success: function (data) {
                    var datos = data;

                    if (datos == null || datos.Nombre.length <= 0) {
                        $("#divNoEncontrado").show();
                        $("#ui-id-1").hide();
                ***REMOVED*** else {
                        $("#divNoEncontrado").hide();
                        response($.map(datos.Nombre, function (item) {
                            return {
                                label: item.nombre,
                                value: item.nombre
                        ***REMOVED***;

                    ***REMOVED***
                        ));

                ***REMOVED***
              ***REMOVED***
                error: function (response) {
                    alert(response.responseText);
              ***REMOVED***
                failure: function (response) {
                    alert(response.responseText);
            ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
        delay: 300,
        minLength: 1,
        select: function (event, ui) {
            //$(this).val(ui.item.Nombre).next().val(ui.item.Id);
            //$("#divResultados").html("");
            //return false;
    ***REMOVED***
***REMOVED***).bind('blur onblur', function () {
        if ($(this).val() == "") {
            $(this).val("");
            $("#divNoEncontrado").hide();
    ***REMOVED***

***REMOVED***);



