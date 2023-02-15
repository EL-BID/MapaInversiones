define(function(){

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
	(function($) {
		var _ajax = $.ajax,
			mockHandlers = [],
			CALLBACK_REGEX = /=\?(&|$)/, 
			jsc = (new Date()).getTime();

		
		// Parse the given XML string. 
		function parseXML(xml) {
			if ( window['DOMParser'] == undefined && window.ActiveXObject ) {
				DOMParser = function() { ***REMOVED***;
				DOMParser.prototype.parseFromString = function( xmlString ) {
					var doc = new ActiveXObject('Microsoft.XMLDOM');
					doc.async = 'false';
					doc.loadXML( xmlString );
					return doc;
				***REMOVED***;
			***REMOVED***

			try {
				var xmlDoc 	= ( new DOMParser() ).parseFromString( xml, 'text/xml' );
				if ( $.isXMLDoc( xmlDoc ) ) {
					var err = $('parsererror', xmlDoc);
					if ( err.length == 1 ) {
						throw('Error: ' + $(xmlDoc).text() );
					***REMOVED***
				***REMOVED*** else {
					throw('Unable to parse XML');
				***REMOVED***
			***REMOVED*** catch( e ) {
				var msg = ( e.name == undefined ? e : e.name + ': ' + e.message );
				$(document).trigger('xmlParseError', [ msg ]);
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
		function isMockDataEqual( mock, live ) {
			var identical = false;
			// Test for situations where the data is a querystring (not an object)
			if (typeof live === 'string') {
				// Querystring may be a regex
				return $.isFunction( mock.test ) ? mock.test(live) : mock == live;
			***REMOVED***
			$.each(mock, function(k, v) {
				if ( live[k] === undefined ) {
					identical = false;
					return identical;
				***REMOVED*** else {
					identical = true;
					if ( typeof live[k] == 'object' ) {
						return isMockDataEqual(mock[k], live[k]);
					***REMOVED*** else {
						if ( $.isFunction( mock[k].test ) ) {
							identical = mock[k].test(live[k]);
						***REMOVED*** else {
							identical = ( mock[k] == live[k] );
						***REMOVED***
						return identical;
					***REMOVED***
				***REMOVED***
			***REMOVED***);

			return identical;
		***REMOVED***

		// Check the given handler should mock the given request
		function getMockForRequest( handler, requestSettings ) {
			// If the mock was registered with a function, let the function decide if we
			// want to mock this request
			if ( $.isFunction(handler) ) {
				return handler( requestSettings );
			***REMOVED***

			// Inspect the URL of the request and check if the mock handler's url
			// matches the url for this ajax request
			if ( $.isFunction(handler.url.test) ) {
				// The user provided a regex for the url, test it
				if ( !handler.url.test( requestSettings.url ) ) {
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
			if ( handler.data && requestSettings.data ) {
				if ( !isMockDataEqual(handler.data, requestSettings.data) ) {
					// They're not identical, do not mock this request
					return null;
				***REMOVED***
			***REMOVED***
			// Inspect the request type
			if ( handler && handler.type && 
					 handler.type.toLowerCase() != requestSettings.type.toLowerCase() ) {
				// The request type doesn't match (GET vs. POST)
				return null;
			***REMOVED***

			return handler;
		***REMOVED***

		// If logging is enabled, log the mock to the console
		function logMock( mockHandler, requestSettings ) {
			if ( window.console && console.log ) {
				var message = 'MOCK ' + requestSettings.type.toUpperCase() + ': ' + requestSettings.url;
				var request = $.extend({***REMOVED***, requestSettings);
				
				if (typeof console.log === 'function') {
					console.log(message, request);
				***REMOVED*** else {
					try {
						console.log( message + ' ' + JSON.stringify(request) );
					***REMOVED*** catch (e) {
						console.log(message);
					***REMOVED***
				***REMOVED***
			***REMOVED***
		***REMOVED***

		// Process the xhr objects send operation
		function _xhrSend(mockHandler, requestSettings, origSettings) {

			// This is a substitute for < 1.4 which lacks $.proxy
			var process = (function(that) {
				return function() {
					return (function() {
						// The request has returned
						this.status 		= mockHandler.status;
						this.statusText		= mockHandler.statusText;
						this.readyState 	= 4;

						// We have an executable function, call it to give
						// the mock handler a chance to update it's data
						if ( $.isFunction(mockHandler.response) ) {
							mockHandler.response(origSettings);
						***REMOVED***
						// Copy over our mock to our xhr object before passing control back to
						// jQuery's onreadystatechange callback
						if ( requestSettings.dataType == 'json' && ( typeof mockHandler.responseText == 'object' ) ) {
							this.responseText = JSON.stringify(mockHandler.responseText);
						***REMOVED*** else if ( requestSettings.dataType == 'xml' ) {
							if ( typeof mockHandler.responseXML == 'string' ) {
								this.responseXML = parseXML(mockHandler.responseXML);
							***REMOVED*** else {
								this.responseXML = mockHandler.responseXML;
							***REMOVED***
						***REMOVED*** else {
							this.responseText = mockHandler.responseText;
						***REMOVED***
						if( typeof mockHandler.status == 'number' || typeof mockHandler.status == 'string' ) {
							this.status = mockHandler.status;
						***REMOVED***
						if( typeof mockHandler.statusText === "string") {
							this.statusText = mockHandler.statusText;
						***REMOVED***
						// jQuery < 1.4 doesn't have onreadystate change for xhr
						if ( $.isFunction(this.onreadystatechange) ) {
							if( mockHandler.isTimeout) {
								this.status = -1;
							***REMOVED***
							this.onreadystatechange( mockHandler.isTimeout ? 'timeout' : undefined );
						***REMOVED*** else if ( mockHandler.isTimeout ) {
							// Fix for 1.3.2 timeout to keep success from firing.
							this.status = -1;
						***REMOVED***
					***REMOVED***).apply(that);
				***REMOVED***;
			***REMOVED***)(this);

			if ( mockHandler.proxy ) {
				// We're proxying this request and loading in an external file instead
				_ajax({
					global: false,
					url: mockHandler.proxy,
					type: mockHandler.proxyType,
					data: mockHandler.data,
					dataType: requestSettings.dataType === "script" ? "text/plain" : requestSettings.dataType,
					complete: function(xhr, txt) {
						mockHandler.responseXML = xhr.responseXML;
						mockHandler.responseText = xhr.responseText;
						mockHandler.status = xhr.status;
						mockHandler.statusText = xhr.statusText;
						this.responseTimer = setTimeout(process, mockHandler.responseTime || 0);
					***REMOVED***
				***REMOVED***);
			***REMOVED*** else {
				// type == 'POST' || 'GET' || 'DELETE'
				if ( requestSettings.async === false ) {
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
			if ( mockHandler.contentType ) {
				mockHandler.headers['content-type'] = mockHandler.contentType;
			***REMOVED***

			return {
				status: mockHandler.status,
				statusText: mockHandler.statusText,
				readyState: 1,
				open: function() { ***REMOVED***,
				send: function() {
					origHandler.fired = true;
					_xhrSend.call(this, mockHandler, requestSettings, origSettings);
				***REMOVED***,
				abort: function() {
					clearTimeout(this.responseTimer);
				***REMOVED***,
				setRequestHeader: function(header, value) {
					mockHandler.headers[header] = value;
				***REMOVED***,
				getResponseHeader: function(header) {
					// 'Last-modified', 'Etag', 'content-type' are all checked by jQuery
					if ( mockHandler.headers && mockHandler.headers[header] ) {
						// Return arbitrary headers
						return mockHandler.headers[header];
					***REMOVED*** else if ( header.toLowerCase() == 'last-modified' ) {
						return mockHandler.lastModified || (new Date()).toString();
					***REMOVED*** else if ( header.toLowerCase() == 'etag' ) {
						return mockHandler.etag || '';
					***REMOVED*** else if ( header.toLowerCase() == 'content-type' ) {
						return mockHandler.contentType || 'text/plain';
					***REMOVED***
				***REMOVED***,
				getAllResponseHeaders: function() {
					var headers = '';
					$.each(mockHandler.headers, function(k, v) {
						headers += k + ': ' + v + "\n";
					***REMOVED***);
					return headers;
				***REMOVED***
			***REMOVED***;
		***REMOVED***

		// Process a JSONP mock request.
		function processJsonpMock( requestSettings, mockHandler, origSettings ) {
			// Handle JSONP Parameter Callbacks, we need to replicate some of the jQuery core here
			// because there isn't an easy hook for the cross domain script tag of jsonp

			processJsonpUrl( requestSettings );

			requestSettings.dataType = "json";
			if(requestSettings.data && CALLBACK_REGEX.test(requestSettings.data) || CALLBACK_REGEX.test(requestSettings.url)) {
				createJsonpCallback(requestSettings, mockHandler);

				// We need to make sure
				// that a JSONP style response is executed properly

				var rurl = /^(\w+:)?\/\/([^\/?#]+)/,
					parts = rurl.exec( requestSettings.url ),
					remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

				requestSettings.dataType = "script";
				if(requestSettings.type.toUpperCase() === "GET" && remote ) {
					var newMockReturn = processJsonpRequest( requestSettings, mockHandler, origSettings );

					// Check if we are supposed to return a Deferred back to the mock call, or just 
					// signal success
					if(newMockReturn) {
						return newMockReturn;
					***REMOVED*** else {
						return true;
					***REMOVED***
				***REMOVED***
			***REMOVED***
			return null;
		***REMOVED***

		// Append the required callback parameter to the end of the request URL, for a JSONP request
		function processJsonpUrl( requestSettings ) {
			if ( requestSettings.type.toUpperCase() === "GET" ) {
				if ( !CALLBACK_REGEX.test( requestSettings.url ) ) {
					requestSettings.url += (/\?/.test( requestSettings.url ) ? "&" : "?") + 
						(requestSettings.jsonp || "callback") + "=?";
				***REMOVED***
			***REMOVED*** else if ( !requestSettings.data || !CALLBACK_REGEX.test(requestSettings.data) ) {
				requestSettings.data = (requestSettings.data ? requestSettings.data + "&" : "") + (requestSettings.jsonp || "callback") + "=?";
			***REMOVED***
		***REMOVED***
		
		// Process a JSONP request by evaluating the mocked response text
		function processJsonpRequest( requestSettings, mockHandler, origSettings ) {
			// Synthesize the mock request for adding a script tag
			var callbackContext = origSettings && origSettings.context || requestSettings,
				newMock = null;


			// If the response handler on the moock is a function, call it
			if ( mockHandler.response && $.isFunction(mockHandler.response) ) {
				mockHandler.response(origSettings);
			***REMOVED*** else {

				// Evaluate the responseText javascript in a global context
				if( typeof mockHandler.responseText === 'object' ) {
					$.globalEval( '(' + JSON.stringify( mockHandler.responseText ) + ')');
				***REMOVED*** else {
					$.globalEval( '(' + mockHandler.responseText + ')');
				***REMOVED***
			***REMOVED***

			// Successful response
			jsonpSuccess( requestSettings, mockHandler );
			jsonpComplete( requestSettings, mockHandler );

			// If we are running under jQuery 1.5+, return a deferred object
			if($.Deferred){
				newMock = new $.Deferred();
				if(typeof mockHandler.responseText == "object"){
					newMock.resolveWith( callbackContext, [mockHandler.responseText] );
				***REMOVED***
				else{
					newMock.resolveWith( callbackContext, [$.parseJSON( mockHandler.responseText )] );
				***REMOVED***
			***REMOVED***
			return newMock;
		***REMOVED***


		// Create the required JSONP callback function for the request
		function createJsonpCallback( requestSettings, mockHandler ) {
			jsonp = requestSettings.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and the data
			if ( requestSettings.data ) {
				requestSettings.data = (requestSettings.data + "").replace(CALLBACK_REGEX, "=" + jsonp + "$1");
			***REMOVED***

			requestSettings.url = requestSettings.url.replace(CALLBACK_REGEX, "=" + jsonp + "$1");


			// Handle JSONP-style loading
			window[ jsonp ] = window[ jsonp ] || function( tmp ) {
				data = tmp;
				jsonpSuccess( requestSettings, mockHandler );
				jsonpComplete( requestSettings, mockHandler );
				// Garbage collect
				window[ jsonp ] = undefined;

				try {
					delete window[ jsonp ];
				***REMOVED*** catch(e) {***REMOVED***

				if ( head ) {
					head.removeChild( script );
				***REMOVED***
			***REMOVED***;
		***REMOVED***

		// The JSONP request was successful
		function jsonpSuccess(requestSettings, mockHandler) {
			// If a local callback was specified, fire it and pass it the data
			if ( requestSettings.success ) {
				requestSettings.success.call( callbackContext, ( mockHandler.response ? mockHandler.response.toString() : mockHandler.responseText || ''), status, {***REMOVED*** );
			***REMOVED***

			// Fire the global callback
			if ( requestSettings.global ) {
				trigger(requestSettings, "ajaxSuccess", [{***REMOVED***, requestSettings] );
			***REMOVED***
		***REMOVED***

		// The JSONP request was completed
		function jsonpComplete(requestSettings, mockHandler) {
			// Process result
			if ( requestSettings.complete ) {
				requestSettings.complete.call( callbackContext, {***REMOVED*** , status );
			***REMOVED***

			// The request was completed
			if ( requestSettings.global ) {
				trigger( "ajaxComplete", [{***REMOVED***, requestSettings] );
			***REMOVED***

			// Handle the global AJAX counter
			if ( requestSettings.global && ! --$.active ) {
				$.event.trigger( "ajaxStop" );
			***REMOVED***
		***REMOVED***


		// The core $.ajax replacement.  
		function handleAjax( url, origSettings ) {
			var mockRequest, requestSettings, mockHandler;

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
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
			for(var k = 0; k < mockHandlers.length; k++) {
				if ( !mockHandlers[k] ) {
					continue;
				***REMOVED***
				
				mockHandler = getMockForRequest( mockHandlers[k], requestSettings );
				if(!mockHandler) {
					// No valid mock found for this request
					continue;
				***REMOVED***

				// Handle console logging
				logMock( mockHandler, requestSettings );


				if ( requestSettings.dataType === "jsonp" ) {
					if ((mockRequest = processJsonpMock( requestSettings, mockHandler, origSettings ))) {
						// This mock will handle the JSONP request
						return mockRequest;
					***REMOVED***
				***REMOVED***


				// Removed to fix #54 - keep the mocking data object intact
				//mockHandler.data = requestSettings.data;

				mockHandler.cache = requestSettings.cache;
				mockHandler.timeout = requestSettings.timeout;
				mockHandler.global = requestSettings.global;

		  copyUrlParameters(mockHandler, origSettings);

				(function(mockHandler, requestSettings, origSettings, origHandler) {
					mockRequest = _ajax.call($, $.extend(true, {***REMOVED***, origSettings, {
						// Mock the XHR object
						xhr: function() { return xhr( mockHandler, requestSettings, origSettings, origHandler ) ***REMOVED***
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
			log:          function( msg ) {
				if (window['console'] && window.console.log) {
					var log = Function.prototype.bind.call(console.log, console);
					log.apply(console, arguments);
				***REMOVED***
			***REMOVED***,
			status:       200,
			statusText:   "OK",
			responseTime: 500,
			isTimeout:    false,
			contentType:  'text/plain',
			response:     '',
			responseText: '',
			responseXML:  '',
			proxy:        '',
			proxyType:    'GET',

			lastModified: null,
			etag:         '',
			headers: {
				etag: 'IJF@H#@923uf8023hFO@I#H#',
				'content-type' : 'text/plain'
			***REMOVED***
		***REMOVED***;

		$.mockjax = function(settings) {
			var i = mockHandlers.length;
			mockHandlers[i] = settings;
			return i;
		***REMOVED***;
		$.mockjaxClear = function(i) {
			if ( arguments.length == 1 ) {
				mockHandlers[i] = null;
			***REMOVED*** else {
				mockHandlers = [];
			***REMOVED***
		***REMOVED***;
		$.mockjax.handler = function(i) {
		  if ( arguments.length == 1 ) {
				return mockHandlers[i];
			***REMOVED***
		***REMOVED***;
	***REMOVED***)(window.jQuery);
***REMOVED***)