/*global ko*/
ko.doTEngine = function () { };

ko.doTEngine.prototype = ko.utils.extend(new ko.templateEngine(), {
	renderTemplateSource: function (templateSource, bindingContext, options) {
		var precompiled = templateSource.data('precompiled');
		if (!precompiled) {
			precompiled = doT.template("{{ with(it) { with({it: it.$data}) { }}" + templateSource.text() + "{{ } } }}");
			templateSource.data('precompiled', precompiled);
		}

		var renderedMarkup = precompiled(bindingContext);
		return ko.utils.parseHtmlFragment(renderedMarkup);
	},
	createJavaScriptEvaluatorBlock: function(script) {
		return "{{=" + script + "}}";
	}
});

ko.setTemplateEngine(new ko.doTEngine());

ko.bindingHandlers.tap = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		function isTouchDevice() {
			var el = document.createElement('div');
			el.setAttribute('ongesturestart', 'return;');
			return typeof el.ongesturestart === "function";
		}

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
			})
			$touchArea.on('touchend', function(e) {
				endX = e.originalEvent.changedTouches[0].pageX
				endY = e.originalEvent.changedTouches[0].pageY
				if ( Math.abs(startX - endX) < 10 &&
					Math.abs(startY - endY) < 10 ) {
					callback.call(viewModel, viewModel, e) 
				}
			})
		}else{
			$touchArea.on('click', function(e) {
				callback.call(viewModel, viewModel, e)
				return false
			});
		}
	}
	, update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {}
}