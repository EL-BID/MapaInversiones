/*global ko*/
ko.doTEngine = function () { ***REMOVED***;

ko.doTEngine.prototype = ko.utils.extend(new ko.templateEngine(), {
	renderTemplateSource: function (templateSource, bindingContext, options) {
		var precompiled = templateSource.data('precompiled');
		if (!precompiled) {
			precompiled = doT.template("{{ with(it) { with({it: it.$data***REMOVED***) { ***REMOVED******REMOVED***" + templateSource.text() + "{{ ***REMOVED*** ***REMOVED*** ***REMOVED******REMOVED***");
			templateSource.data('precompiled', precompiled);
		***REMOVED***

		var renderedMarkup = precompiled(bindingContext);
		return ko.utils.parseHtmlFragment(renderedMarkup);
	***REMOVED***,
	createJavaScriptEvaluatorBlock: function(script) {
		return "{{=" + script + "***REMOVED******REMOVED***";
	***REMOVED***
***REMOVED***);

ko.setTemplateEngine(new ko.doTEngine());

ko.bindingHandlers.tap = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		function isTouchDevice() {
			var el = document.createElement('div');
			el.setAttribute('ongesturestart', 'return;');
			return typeof el.ongesturestart === "function";
		***REMOVED***

		var callback = valueAccessor(),
			isTouch = isTouchDevice(),
			$touchArea = $(element),
			touchStarted = false, // detect if a touch event is sarted
			startX = 0,
			startY = 0,
			endX = 0,
			endY = 0

		if( isTouch ){
			$touchArea.on('touchstart',function (e){
				e.preventDefault()
				startX = e.originalEvent.changedTouches[0].pageX
				startY = e.originalEvent.changedTouches[0].pageY
			***REMOVED***)
			$touchArea.on('touchend', function(e) {
				endX = e.originalEvent.changedTouches[0].pageX
				endY = e.originalEvent.changedTouches[0].pageY
				if ( Math.abs(startX - endX) < 10 &&
					Math.abs(startY - endY) < 10 ) {
					callback.call(viewModel, viewModel, e) 
				***REMOVED***
			***REMOVED***)
		***REMOVED***else{
			$touchArea.on('click', function(e) {
				callback.call(viewModel, viewModel, e)
				return false
			***REMOVED***);
		***REMOVED***
	***REMOVED***
	, update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {***REMOVED***
***REMOVED***