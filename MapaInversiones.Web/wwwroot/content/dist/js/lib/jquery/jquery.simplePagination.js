/**
* simplePagination.js v1.4
* A simple jQuery pagination plugin.
* http://flaviusmatis.github.com/simplePagination.js/
*
* Copyright 2012, Flavius Matis
* Released under the MIT license.
* http://flaviusmatis.github.com/license.html
*/

(function($){

	var methods = {
		init: function(options) {
			var o = $.extend({
				items: 1,
				itemsOnPage: 1,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 1,
				hrefTextPrefix: '#page-',
				hrefTextSuffix: '',
				prevText: 'Prev',
				nextText: 'Next',
				ellipseText: '&hellip;',
				cssStyle: 'light-theme',
				selectOnClick: true,
				onPageClick: function(pageNumber) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				***REMOVED***,
				onInit: function() {
					// Callback triggered immediately after initialization
				***REMOVED***
			***REMOVED***, options || {***REMOVED***);

			var self = this;

			o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
			o.currentPage = o.currentPage - 1;
			o.halfDisplayed = o.displayedPages / 2;

			this.each(function() {
				self.addClass(o.cssStyle).data('pagination', o);
				methods._draw.call(self);
			***REMOVED***);

			o.onInit();

			return this;
		***REMOVED***,

		selectPage: function(page) {
			methods._selectPage.call(this, page - 1);
			return this;
		***REMOVED***,

		prevPage: function() {
			var o = this.data('pagination');
			if (o.currentPage > 0) {
				methods._selectPage.call(this, o.currentPage - 1);
			***REMOVED***
			return this;
		***REMOVED***,

		nextPage: function() {
			var o = this.data('pagination');
			if (o.currentPage < o.pages - 1) {
				methods._selectPage.call(this, o.currentPage + 1);
			***REMOVED***
			return this;
		***REMOVED***,

		destroy: function(){
			this.empty();
			return this;
		***REMOVED***,

		redraw: function(){
			methods._draw.call(this);
			return this;
		***REMOVED***,

		disable: function(){
			var o = this.data('pagination');
			o.disabled = true;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		***REMOVED***,

		enable: function(){
			var o = this.data('pagination');
			o.disabled = false;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		***REMOVED***,

		_draw: function() {
			var $panel = this,
				o = $panel.data('pagination'),
				interval = methods._getInterval(o),
				i;

			methods.destroy.call(this);

			// Generate Prev link
			if (o.prevText) {
				methods._appendItem.call(this, o.currentPage - 1, {text: o.prevText, classes: 'prev'***REMOVED***);
			***REMOVED***

			// Generate start edges
			if (interval.start > 0 && o.edges > 0) {
				var end = Math.min(o.edges, interval.start);
				for (i = 0; i < end; i++) {
					methods._appendItem.call(this, i);
				***REMOVED***
				if (o.edges < interval.start && (interval.start - o.edges != 1)) {
					$panel.append('<span class="ellipse">' + o.ellipseText + '</span>');
				***REMOVED*** else if (interval.start - o.edges == 1) {
					methods._appendItem.call(this, o.edges);
				***REMOVED***
			***REMOVED***

			// Generate interval links
			for (i = interval.start; i < interval.end; i++) {
				methods._appendItem.call(this, i);
			***REMOVED***

			// Generate end edges
			if (interval.end < o.pages && o.edges > 0) {
				if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
					$panel.append('<span class="ellipse">' + o.ellipseText + '</span>');
				***REMOVED*** else if (o.pages - o.edges - interval.end == 1) {
					methods._appendItem.call(this, interval.end++);
				***REMOVED***
				var begin = Math.max(o.pages - o.edges, interval.end);
				for (i = begin; i < o.pages; i++) {
					methods._appendItem.call(this, i);
				***REMOVED***
			***REMOVED***

			// Generate Next link
			if (o.nextText) {
				methods._appendItem.call(this, o.currentPage + 1, {text: o.nextText, classes: 'next'***REMOVED***);
			***REMOVED***
		***REMOVED***,

		_getInterval: function(o) {
			return {
				start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
				end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
			***REMOVED***;
		***REMOVED***,

		_appendItem: function(pageIndex, opts) {
			var self = this, options, $link, o = self.data('pagination');

			pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

			options = $.extend({
				text: pageIndex + 1,
				classes: ''
			***REMOVED***, opts || {***REMOVED***);

			if (pageIndex == o.currentPage || o.disabled) {
				$link = $('<span class="current">' + (options.text) + '</span>');
			***REMOVED*** else {
				$link = $('<a href="' + o.hrefTextPrefix + (pageIndex + 1) + o.hrefTextSuffix + '" class="page-link">' + (options.text) + '</a>');
				$link.click(function(){
					return methods._selectPage.call(self, pageIndex);
				***REMOVED***);
			***REMOVED***

			if (options.classes) {
				$link.addClass(options.classes);
			***REMOVED***

			self.append($link);
		***REMOVED***,

		_selectPage: function(pageIndex) {
			var o = this.data('pagination');
			o.currentPage = pageIndex;
			if (o.selectOnClick) {
				methods._draw.call(this);
			***REMOVED***
			return o.onPageClick(pageIndex + 1);
		***REMOVED***

	***REMOVED***;
	
	$.fn.pagination = function(method) {

		// Method calling logic
		if (methods[method] && method.charAt(0) != '_') {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		***REMOVED*** else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		***REMOVED*** else {
			$.error('Method ' +  method + ' does not exist on jQuery.pagination');
		***REMOVED***

	***REMOVED***;

***REMOVED***)(jQuery);