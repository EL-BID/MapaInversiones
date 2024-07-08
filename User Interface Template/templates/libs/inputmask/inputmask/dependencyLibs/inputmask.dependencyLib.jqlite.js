/*!
* dependencyLibs/inputmask.dependencyLib.jqlite.js
* https://github.com/RobinHerbots/Inputmask
* Copyright (c) 2010 - 2019 Robin Herbots
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
* Version: 4.0.9
*/

(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([ "jqlite", "../global/window" ], factory);
***REMOVED*** else if (typeof exports === "object") {
        module.exports = factory(require("jqlite"), require("../global/window"));
***REMOVED*** else {
        window.dependencyLib = factory(jqlite, window);
***REMOVED***
***REMOVED***)(function($, window) {
    var document = window.document;
    function indexOf(list, elem) {
        var i = 0, len = list.length;
        for (;i < len; i++) {
            if (list[i] === elem) {
                return i;
        ***REMOVED***
    ***REMOVED***
        return -1;
***REMOVED***
    function isWindow(obj) {
        return obj != null && obj === obj.window;
***REMOVED***
    function isArraylike(obj) {
        var length = "length" in obj && obj.length, ltype = typeof obj;
        if (ltype === "function" || isWindow(obj)) {
            return false;
    ***REMOVED***
        if (obj.nodeType === 1 && length) {
            return true;
    ***REMOVED***
        return ltype === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
***REMOVED***
    $.inArray = function(elem, arr, i) {
        return arr == null ? -1 : indexOf(arr, elem, i);
***REMOVED***;
    $.isFunction = function(obj) {
        return typeof obj === "function";
***REMOVED***;
    $.isArray = Array.isArray;
    $.isPlainObject = function(obj) {
        if (typeof obj !== "object" || obj.nodeType || isWindow(obj)) {
            return false;
    ***REMOVED***
        if (obj.constructor && !Object.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
    ***REMOVED***
        return true;
***REMOVED***;
    $.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {***REMOVED***, i = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {***REMOVED***;
            i++;
    ***REMOVED***
        if (typeof target !== "object" && !$.isFunction(target)) {
            target = {***REMOVED***;
    ***REMOVED***
        if (i === length) {
            target = this;
            i--;
    ***REMOVED***
        for (;i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                ***REMOVED***
                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];
                    ***REMOVED*** else {
                            clone = src && $.isPlainObject(src) ? src : {***REMOVED***;
                    ***REMOVED***
                        target[name] = $.extend(deep, clone, copy);
                ***REMOVED*** else if (copy !== undefined) {
                        target[name] = copy;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        return target;
***REMOVED***;
    $.each = function(obj, callback) {
        var value, i = 0;
        if (isArraylike(obj)) {
            for (var length = obj.length; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED*** else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        return obj;
***REMOVED***;
    $.data = function(elem, name, data) {
        return $(elem).data(name, data);
***REMOVED***;
    $.Event = $.Event || function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
    ***REMOVED***;
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
***REMOVED***;
    $.Event.prototype = window.Event.prototype;
    return $;
***REMOVED***);