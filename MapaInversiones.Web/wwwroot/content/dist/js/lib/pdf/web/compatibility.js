/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* globals VBArray, PDFJS */

'use strict';

// Initializing PDFJS global object here, it case if we need to change/disable
// some PDF.js features, e.g. range requests
if (typeof PDFJS === 'undefined') {
  (typeof window !== 'undefined' ? window : this).PDFJS = {***REMOVED***;
***REMOVED***

// Checking if the typed arrays are supported
// Support: iOS<6.0 (subarray), IE<10, Android<4.0
(function checkTypedArrayCompatibility() {
  if (typeof Uint8Array !== 'undefined') {
    // Support: iOS<6.0
    if (typeof Uint8Array.prototype.subarray === 'undefined') {
        Uint8Array.prototype.subarray = function subarray(start, end) {
          return new Uint8Array(this.slice(start, end));
    ***REMOVED***;
        Float32Array.prototype.subarray = function subarray(start, end) {
          return new Float32Array(this.slice(start, end));
    ***REMOVED***;
***REMOVED***

    // Support: Android<4.1
    if (typeof Float64Array === 'undefined') {
      window.Float64Array = Float32Array;
***REMOVED***
    return;
  ***REMOVED***

  function subarray(start, end) {
    return new TypedArray(this.slice(start, end));
  ***REMOVED***

  function setArrayOffset(array, offset) {
    if (arguments.length < 2) {
      offset = 0;
***REMOVED***
    for (var i = 0, n = array.length; i < n; ++i, ++offset) {
      this[offset] = array[i] & 0xFF;
***REMOVED***
  ***REMOVED***

  function TypedArray(arg1) {
    var result, i, n;
    if (typeof arg1 === 'number') {
      result = [];
      for (i = 0; i < arg1; ++i) {
        result[i] = 0;
  ***REMOVED***
***REMOVED*** else if ('slice' in arg1) {
      result = arg1.slice(0);
***REMOVED*** else {
      result = [];
      for (i = 0, n = arg1.length; i < n; ++i) {
        result[i] = arg1[i];
  ***REMOVED***
***REMOVED***

    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = setArrayOffset;

    if (typeof arg1 === 'object' && arg1.buffer) {
      result.buffer = arg1.buffer;
***REMOVED***
    return result;
  ***REMOVED***

  window.Uint8Array = TypedArray;
  window.Int8Array = TypedArray;

  // we don't need support for set, byteLength for 32-bit array
  // so we can use the TypedArray as well
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
  window.Uint16Array = TypedArray;
  window.Float32Array = TypedArray;
  window.Float64Array = TypedArray;
***REMOVED***)();

// URL = URL || webkitURL
// Support: Safari<7, Android 4.2+
(function normalizeURLObject() {
  if (!window.URL) {
    window.URL = window.webkitURL;
  ***REMOVED***
***REMOVED***)();

// Object.defineProperty()?
// Support: Android<4.0, Safari<5.1
(function checkObjectDefinePropertyCompatibility() {
  if (typeof Object.defineProperty !== 'undefined') {
    var definePropertyPossible = true;
    try {
      // some browsers (e.g. safari) cannot use defineProperty() on DOM objects
      // and thus the native version is not sufficient
      Object.defineProperty(new Image(), 'id', { value: 'test' ***REMOVED***);
      // ... another test for android gb browser for non-DOM objects
      var Test = function Test() {***REMOVED***;
      Test.prototype = { get id() { ***REMOVED*** ***REMOVED***;
      Object.defineProperty(new Test(), 'id',
        { value: '', configurable: true, enumerable: true, writable: false ***REMOVED***);
***REMOVED*** catch (e) {
      definePropertyPossible = false;
***REMOVED***
    if (definePropertyPossible) {
      return;
***REMOVED***
  ***REMOVED***

  Object.defineProperty = function objectDefineProperty(obj, name, def) {
    delete obj[name];
    if ('get' in def) {
      obj.__defineGetter__(name, def['get']);
***REMOVED***
    if ('set' in def) {
      obj.__defineSetter__(name, def['set']);
***REMOVED***
    if ('value' in def) {
      obj.__defineSetter__(name, function objectDefinePropertySetter(value) {
        this.__defineGetter__(name, function objectDefinePropertyGetter() {
          return value;
    ***REMOVED***);
        return value;
  ***REMOVED***);
      obj[name] = def.value;
***REMOVED***
  ***REMOVED***;
***REMOVED***)();


// No XMLHttpRequest#response?
// Support: IE<11, Android <4.0
(function checkXMLHttpRequestResponseCompatibility() {
  var xhrPrototype = XMLHttpRequest.prototype;
  var xhr = new XMLHttpRequest();
  if (!('overrideMimeType' in xhr)) {
    // IE10 might have response, but not overrideMimeType
    // Support: IE10
    Object.defineProperty(xhrPrototype, 'overrideMimeType', {
      value: function xmlHttpRequestOverrideMimeType(mimeType) {***REMOVED***
***REMOVED***);
  ***REMOVED***
  if ('responseType' in xhr) {
    return;
  ***REMOVED***

  // The worker will be using XHR, so we can save time and disable worker.
  PDFJS.disableWorker = true;

  // Support: IE9
  if (typeof VBArray !== 'undefined') {
    Object.defineProperty(xhrPrototype, 'response', {
      get: function xmlHttpRequestResponseGet() {
        if (this.responseType === 'arraybuffer') {
          return new Uint8Array(new VBArray(this.responseBody).toArray());
    ***REMOVED*** else {
          return this.responseText;
    ***REMOVED***
  ***REMOVED***
***REMOVED***);
    return;
  ***REMOVED***

  // other browsers
  function responseTypeSetter() {
    // will be only called to set "arraybuffer"
    this.overrideMimeType('text/plain; charset=x-user-defined');
  ***REMOVED***
  if (typeof xhr.overrideMimeType === 'function') {
    Object.defineProperty(xhrPrototype, 'responseType',
                          { set: responseTypeSetter ***REMOVED***);
  ***REMOVED***
  function responseGetter() {
    var text = this.responseText;
    var i, n = text.length;
    var result = new Uint8Array(n);
    for (i = 0; i < n; ++i) {
      result[i] = text.charCodeAt(i) & 0xFF;
***REMOVED***
    return result.buffer;
  ***REMOVED***
  Object.defineProperty(xhrPrototype, 'response', { get: responseGetter ***REMOVED***);
***REMOVED***)();

// window.btoa (base64 encode function) ?
// Support: IE<10
(function checkWindowBtoaCompatibility() {
  if ('btoa' in window) {
    return;
  ***REMOVED***

  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  window.btoa = function windowBtoa(chars) {
    var buffer = '';
    var i, n;
    for (i = 0, n = chars.length; i < n; i += 3) {
      var b1 = chars.charCodeAt(i) & 0xFF;
      var b2 = chars.charCodeAt(i + 1) & 0xFF;
      var b3 = chars.charCodeAt(i + 2) & 0xFF;
      var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
      var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
      var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
      buffer += (digits.charAt(d1) + digits.charAt(d2) +
                 digits.charAt(d3) + digits.charAt(d4));
***REMOVED***
    return buffer;
  ***REMOVED***;
***REMOVED***)();

// window.atob (base64 encode function)?
// Support: IE<10
(function checkWindowAtobCompatibility() {
  if ('atob' in window) {
    return;
  ***REMOVED***

  // https://github.com/davidchambers/Base64.js
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  window.atob = function (input) {
    input = input.replace(/=+$/, '');
    if (input.length % 4 === 1) {
      throw new Error('bad atob input');
***REMOVED***
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table?
      // initialize bit storage and add its ascii value
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = digits.indexOf(buffer);
***REMOVED***
    return output;
  ***REMOVED***;
***REMOVED***)();

// Function.prototype.bind?
// Support: Android<4.0, iOS<6.0
(function checkFunctionPrototypeBindCompatibility() {
  if (typeof Function.prototype.bind !== 'undefined') {
    return;
  ***REMOVED***

  Function.prototype.bind = function functionPrototypeBind(obj) {
    var fn = this, headArgs = Array.prototype.slice.call(arguments, 1);
    var bound = function functionPrototypeBindBound() {
      var args = headArgs.concat(Array.prototype.slice.call(arguments));
      return fn.apply(obj, args);
***REMOVED***;
    return bound;
  ***REMOVED***;
***REMOVED***)();

// HTMLElement dataset property
// Support: IE<11, Safari<5.1, Android<4.0
(function checkDatasetProperty() {
  var div = document.createElement('div');
  if ('dataset' in div) {
    return; // dataset property exists
  ***REMOVED***

  Object.defineProperty(HTMLElement.prototype, 'dataset', {
    get: function() {
      if (this._dataset) {
        return this._dataset;
  ***REMOVED***

      var dataset = {***REMOVED***;
      for (var j = 0, jj = this.attributes.length; j < jj; j++) {
        var attribute = this.attributes[j];
        if (attribute.name.substring(0, 5) !== 'data-') {
          continue;
    ***REMOVED***
        var key = attribute.name.substring(5).replace(/\-([a-z])/g,
          function(all, ch) {
            return ch.toUpperCase();
      ***REMOVED***);
        dataset[key] = attribute.value;
  ***REMOVED***

      Object.defineProperty(this, '_dataset', {
        value: dataset,
        writable: false,
        enumerable: false
  ***REMOVED***);
      return dataset;
  ***REMOVED***
    enumerable: true
  ***REMOVED***);
***REMOVED***)();

// HTMLElement classList property
// Support: IE<10, Android<4.0, iOS<5.0
(function checkClassListProperty() {
  var div = document.createElement('div');
  if ('classList' in div) {
    return; // classList property exists
  ***REMOVED***

  function changeList(element, itemName, add, remove) {
    var s = element.className || '';
    var list = s.split(/\s+/g);
    if (list[0] === '') {
      list.shift();
***REMOVED***
    var index = list.indexOf(itemName);
    if (index < 0 && add) {
      list.push(itemName);
***REMOVED***
    if (index >= 0 && remove) {
      list.splice(index, 1);
***REMOVED***
    element.className = list.join(' ');
    return (index >= 0);
  ***REMOVED***

  var classListPrototype = {
    add: function(name) {
      changeList(this.element, name, true, false);
  ***REMOVED***
    contains: function(name) {
      return changeList(this.element, name, false, false);
  ***REMOVED***
    remove: function(name) {
      changeList(this.element, name, false, true);
  ***REMOVED***
    toggle: function(name) {
      changeList(this.element, name, true, true);
***REMOVED***
  ***REMOVED***;

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function() {
      if (this._classList) {
        return this._classList;
  ***REMOVED***

      var classList = Object.create(classListPrototype, {
        element: {
          value: this,
          writable: false,
          enumerable: true
    ***REMOVED***
  ***REMOVED***);
      Object.defineProperty(this, '_classList', {
        value: classList,
        writable: false,
        enumerable: false
  ***REMOVED***);
      return classList;
  ***REMOVED***
    enumerable: true
  ***REMOVED***);
***REMOVED***)();

// Check console compatibility
// In older IE versions the console object is not available
// unless console is open.
// Support: IE<10
(function checkConsoleCompatibility() {
  if (!('console' in window)) {
    window.console = {
      log: function() {***REMOVED***,
      error: function() {***REMOVED***,
      warn: function() {***REMOVED***
***REMOVED***;
  ***REMOVED*** else if (!('bind' in console.log)) {
    // native functions in IE9 might not have bind
    console.log = (function(fn) {
      return function(msg) { return fn(msg); ***REMOVED***;
***REMOVED***)(console.log);
    console.error = (function(fn) {
      return function(msg) { return fn(msg); ***REMOVED***;
***REMOVED***)(console.error);
    console.warn = (function(fn) {
      return function(msg) { return fn(msg); ***REMOVED***;
***REMOVED***)(console.warn);
  ***REMOVED***
***REMOVED***)();

// Check onclick compatibility in Opera
// Support: Opera<15
(function checkOnClickCompatibility() {
  // workaround for reported Opera bug DSK-354448:
  // onclick fires on disabled buttons with opaque content
  function ignoreIfTargetDisabled(event) {
    if (isDisabled(event.target)) {
      event.stopPropagation();
***REMOVED***
  ***REMOVED***
  function isDisabled(node) {
    return node.disabled || (node.parentNode && isDisabled(node.parentNode));
  ***REMOVED***
  if (navigator.userAgent.indexOf('Opera') !== -1) {
    // use browser detection since we cannot feature-check this bug
    document.addEventListener('click', ignoreIfTargetDisabled, true);
  ***REMOVED***
***REMOVED***)();

// Checks if possible to use URL.createObjectURL()
// Support: IE
(function checkOnBlobSupport() {
  // sometimes IE loosing the data created with createObjectURL(), see #3977
  if (navigator.userAgent.indexOf('Trident') >= 0) {
    PDFJS.disableCreateObjectURL = true;
  ***REMOVED***
***REMOVED***)();

// Checks if navigator.language is supported
(function checkNavigatorLanguage() {
  if ('language' in navigator &&
      /^[a-z]+(-[A-Z]+)?$/.test(navigator.language)) {
    return;
  ***REMOVED***
  function formatLocale(locale) {
    var split = locale.split(/[-_]/);
    split[0] = split[0].toLowerCase();
    if (split.length > 1) {
      split[1] = split[1].toUpperCase();
***REMOVED***
    return split.join('-');
  ***REMOVED***
  var language = navigator.language || navigator.userLanguage || 'en-US';
  PDFJS.locale = formatLocale(language);
***REMOVED***)();

(function checkRangeRequests() {
  // Safari has issues with cached range requests see:
  // https://github.com/mozilla/pdf.js/issues/3260
  // Last tested with version 6.0.4.
  // Support: Safari 6.0+
  var isSafari = Object.prototype.toString.call(
                  window.HTMLElement).indexOf('Constructor') > 0;

  // Older versions of Android (pre 3.0) has issues with range requests, see:
  // https://github.com/mozilla/pdf.js/issues/3381.
  // Make sure that we only match webkit-based Android browsers,
  // since Firefox/Fennec works as expected.
  // Support: Android<3.0
  var regex = /Android\s[0-2][^\d]/;
  var isOldAndroid = regex.test(navigator.userAgent);

  if (isSafari || isOldAndroid) {
    PDFJS.disableRange = true;
  ***REMOVED***
***REMOVED***)();

// Check if the browser supports manipulation of the history.
// Support: IE<10, Android<4.2
(function checkHistoryManipulation() {
  // Android 2.x has so buggy pushState support that it was removed in
  // Android 3.0 and restored as late as in Android 4.2.
  // Support: Android 2.x
  if (!history.pushState || navigator.userAgent.indexOf('Android 2.') >= 0) {
    PDFJS.disableHistory = true;
  ***REMOVED***
***REMOVED***)();

// Support: IE<11, Chrome<21, Android<4.4, Safari<6
(function checkSetPresenceInImageData() {
  // IE < 11 will use window.CanvasPixelArray which lacks set function.
  if (window.CanvasPixelArray) {
    if (typeof window.CanvasPixelArray.prototype.set !== 'function') {
      window.CanvasPixelArray.prototype.set = function(arr) {
        for (var i = 0, ii = this.length; i < ii; i++) {
          this[i] = arr[i];
    ***REMOVED***
  ***REMOVED***;
***REMOVED***
  ***REMOVED*** else {
    // Old Chrome and Android use an inaccessible CanvasPixelArray prototype.
    // Because we cannot feature detect it, we rely on user agent parsing.
    var polyfill = false, versionMatch;
    if (navigator.userAgent.indexOf('Chrom') >= 0) {
      versionMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      // Chrome < 21 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[2]) < 21;
***REMOVED*** else if (navigator.userAgent.indexOf('Android') >= 0) {
      // Android < 4.4 lacks the set function.
      // Android >= 4.4 will contain Chrome in the user agent,
      // thus pass the Chrome check above and not reach this block.
      polyfill = /Android\s[0-4][^\d]/g.test(navigator.userAgent);
***REMOVED*** else if (navigator.userAgent.indexOf('Safari') >= 0) {
      versionMatch = navigator.userAgent.
        match(/Version\/([0-9]+)\.([0-9]+)\.([0-9]+) Safari\//);
      // Safari < 6 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[1]) < 6;
***REMOVED***

    if (polyfill) {
      var contextPrototype = window.CanvasRenderingContext2D.prototype;
      contextPrototype._createImageData = contextPrototype.createImageData;
      contextPrototype.createImageData = function(w, h) {
        var imageData = this._createImageData(w, h);
        imageData.data.set = function(arr) {
          for (var i = 0, ii = this.length; i < ii; i++) {
            this[i] = arr[i];
      ***REMOVED***
    ***REMOVED***;
        return imageData;
  ***REMOVED***;
***REMOVED***
  ***REMOVED***
***REMOVED***)();

// Support: IE<10, Android<4.0, iOS
(function checkRequestAnimationFrame() {
  function fakeRequestAnimationFrame(callback) {
    window.setTimeout(callback, 20);
  ***REMOVED***

  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  if (isIOS) {
    // requestAnimationFrame on iOS is broken, replacing with fake one.
    window.requestAnimationFrame = fakeRequestAnimationFrame;
    return;
  ***REMOVED***
  if ('requestAnimationFrame' in window) {
    return;
  ***REMOVED***
  window.requestAnimationFrame =
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    fakeRequestAnimationFrame;
***REMOVED***)();

(function checkCanvasSizeLimitation() {
  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  var isAndroid = /Android/g.test(navigator.userAgent);
  if (isIOS || isAndroid) {
    // 5MP
    PDFJS.maxCanvasPixels = 5242880;
  ***REMOVED***
***REMOVED***)();
