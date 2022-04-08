/*!
 * jQuery Popup Overlay
 *
 * @version 1.7.13
 * @requires jQuery v1.7.1+
 * @link http://vast-engineering.github.com/jquery-popup-overlay/
 */
;(function ($) {

    var $window = $(window);
    var options = {***REMOVED***;
    var zindexvalues = [];
    var lastclicked = [];
    var scrollbarwidth;
    var bodymarginright = null;
    var opensuffix = '_open';
    var closesuffix = '_close';
    var visiblePopupsArray = [];
    var transitionsupport = null;
    var opentimer;
    var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

    var methods = {

        _init: function (el) {
            var $el = $(el);
            var options = $el.data('popupoptions');
            lastclicked[el.id] = false;
            zindexvalues[el.id] = 0;

            if (!$el.data('popup-initialized')) {
                $el.attr('data-popup-initialized', 'true');
                methods._initonce(el);
        ***REMOVED***

            if (options.autoopen) {
                setTimeout(function() {
                    methods.show(el, 0);
              ***REMOVED*** 0);
        ***REMOVED***
      ***REMOVED***

        _initonce: function (el) {
            var $el = $(el);
            var $body = $('body');
            var $wrapper;
            var options = $el.data('popupoptions');
            var css;

            bodymarginright = parseInt($body.css('margin-right'), 10);
            transitionsupport = document.body.style.webkitTransition !== undefined ||
                                document.body.style.MozTransition !== undefined ||
                                document.body.style.msTransition !== undefined ||
                                document.body.style.OTransition !== undefined ||
                                document.body.style.transition !== undefined;

            if (options.type == 'tooltip') {
                options.background = false;
                options.scrolllock = false;
        ***REMOVED***

            if (options.backgroundactive) {
                options.background = false;
                options.blur = false;
                options.scrolllock = false;
        ***REMOVED***

            if (options.scrolllock) {
                // Calculate the browser's scrollbar width dynamically
                var parent;
                var child;
                if (typeof scrollbarwidth === 'undefined') {
                    parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
                    child = parent.children();
                    scrollbarwidth = child.innerWidth() - child.height(99).innerWidth();
                    parent.remove();
            ***REMOVED***
        ***REMOVED***

            if (!$el.attr('id')) {
                $el.attr('id', 'j-popup-' + parseInt((Math.random() * 100000000), 10));
        ***REMOVED***

            $el.addClass('popup_content');

            if ((options.background) && (!$('#' + el.id + '_background').length)) {

                $body.append('<div id="' + el.id + '_background" class="popup_background"></div>');

                var $background = $('#' + el.id + '_background');

                $background.css({
                    opacity: 0,
                    visibility: 'hidden',
                    backgroundColor: options.color,
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
            ***REMOVED***);

                if (options.setzindex && !options.autozindex) {
                    $background.css('z-index', '100000');
            ***REMOVED***

                if (options.transition) {
                    $background.css('transition', options.transition);
            ***REMOVED***
        ***REMOVED***

            $body.append(el);

            $el.wrap('<div id="' + el.id + '_wrapper" class="popup_wrapper" />');

            $wrapper = $('#' + el.id + '_wrapper');

            $wrapper.css({
                opacity: 0,
                visibility: 'hidden',
                position: 'absolute'
        ***REMOVED***);

            // Make div clickable in iOS
            if (iOS) {
                $wrapper.css('cursor', 'pointer');
        ***REMOVED***

            if (options.type == 'overlay') {
                $wrapper.css('overflow','auto');
        ***REMOVED***

            $el.css({
                opacity: 0,
                visibility: 'hidden',
                display: 'inline-block'
        ***REMOVED***);

            if (options.setzindex && !options.autozindex) {
                $wrapper.css('z-index', '100001');
        ***REMOVED***

            if (!options.outline) {
                $el.css('outline', 'none');
        ***REMOVED***

            if (options.transition) {
                $el.css('transition', options.transition);
                $wrapper.css('transition', options.transition);
        ***REMOVED***

            // Hide popup content from screen readers initially
            $el.attr('aria-hidden', true);

            if (options.type == 'overlay') {
                $el.css({
                    textAlign: 'left',
                    position: 'relative',
                    verticalAlign: 'middle'
            ***REMOVED***);

                css = {
                    position: 'fixed',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    textAlign: 'center'
            ***REMOVED***;

                if(options.backgroundactive){
                    css.position = 'absolute';
                    css.height = '0';
                    css.overflow = 'visible';
            ***REMOVED***

                $wrapper.css(css);

                // CSS vertical align helper
                $wrapper.append('<div class="popup_align" />');

                $('.popup_align').css({
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    height: '100%'
            ***REMOVED***);
        ***REMOVED***

            // Add WAI ARIA role to announce dialog to screen readers
            $el.attr('role', 'dialog');

            var openelement =  (options.openelement) ? options.openelement : ('.' + el.id + opensuffix);

            $(openelement).each(function (i, item) {
                $(item).attr('data-popup-ordinal', i);

                if (!item.id) {
                    $(item).attr('id', 'open_' + parseInt((Math.random() * 100000000), 10));
            ***REMOVED***
        ***REMOVED***);

            // Set aria-labelledby (if aria-label or aria-labelledby is not set in html)
            if (!($el.attr('aria-labelledby') || $el.attr('aria-label'))) {
                $el.attr('aria-labelledby', $(openelement).attr('id'));
        ***REMOVED***

            // Show and hide tooltips on hover
            if(options.action == 'hover'){
                options.keepfocus = false;

                // Handler: mouseenter, focusin
                $(openelement).on('mouseenter', function (event) {
                    methods.show(el, $(this).data('popup-ordinal'));
            ***REMOVED***);

                // Handler: mouseleave, focusout
                $(openelement).on('mouseleave', function (event) {
                    methods.hide(el);
            ***REMOVED***);

        ***REMOVED*** else {

                // Handler: Show popup when clicked on `open` element
                $(document).on('click', openelement, function (event) {
                    event.preventDefault();

                    var ord = $(this).data('popup-ordinal');
                    setTimeout(function() { // setTimeout is to allow `close` method to finish (for issues with multiple tooltips)
                        methods.show(el, ord);
                  ***REMOVED*** 0);
            ***REMOVED***);
        ***REMOVED***

            if (options.closebutton) {
                methods.addclosebutton(el);
        ***REMOVED***

            if (options.detach) {
                $el.hide().detach();
        ***REMOVED*** else {
                $wrapper.hide();
        ***REMOVED***
      ***REMOVED***

        /**
         * Show method
         *
         * @param {object***REMOVED*** el - popup instance DOM node
         * @param {number***REMOVED*** ordinal - order number of an `open` element
         */
        show: function (el, ordinal) {
            var $el = $(el);

            if ($el.data('popup-visible')) return;

            // Initialize if not initialized. Required for: $('#popup').popup('show')
            if (!$el.data('popup-initialized')) {
                methods._init(el);
        ***REMOVED***
            $el.attr('data-popup-initialized', 'true');

            var $body = $('body');
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            // `beforeopen` callback event
            callback(el, ordinal, options.beforeopen);

            // Remember last clicked place
            lastclicked[el.id] = ordinal;

            // Add popup id to visiblePopupsArray
            setTimeout(function() {
                visiblePopupsArray.push(el.id);
          ***REMOVED*** 0);

            // Calculating maximum z-index
            if (options.autozindex) {

                var elements = document.getElementsByTagName('*');
                var len = elements.length;
                var maxzindex = 0;

                for(var i=0; i<len; i++){

                    var elementzindex = $(elements[i]).css('z-index');

                    if(elementzindex !== 'auto'){

                      elementzindex = parseInt(elementzindex, 10);

                      if(maxzindex < elementzindex){
                        maxzindex = elementzindex;
                  ***REMOVED***
                ***REMOVED***
            ***REMOVED***

                zindexvalues[el.id] = maxzindex;

                // Add z-index to the background
                if (options.background) {
                    if (zindexvalues[el.id] > 0) {
                        $('#' + el.id + '_background').css({
                            zIndex: (zindexvalues[el.id] + 1)
                    ***REMOVED***);
                ***REMOVED***
            ***REMOVED***

                // Add z-index to the wrapper
                if (zindexvalues[el.id] > 0) {
                    $wrapper.css({
                        zIndex: (zindexvalues[el.id] + 2)
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***

            if (options.detach) {
                $wrapper.prepend(el);
                $el.show();
        ***REMOVED*** else {
                $wrapper.show();
        ***REMOVED***

            opentimer = setTimeout(function() {
                $wrapper.css({
                    visibility: 'visible',
                    opacity: 1
            ***REMOVED***);

                $('html').addClass('popup_visible').addClass('popup_visible_' + el.id);
                $wrapper.addClass('popup_wrapper_visible');
          ***REMOVED*** 20); // 20ms required for opening animation to occur in FF

            // Disable background layer scrolling when popup is opened
            if (options.scrolllock) {
                $body.css('overflow', 'hidden');
                if ($body.height() > $window.height()) {
                    $body.css('margin-right', bodymarginright + scrollbarwidth);
            ***REMOVED***
        ***REMOVED***

            if(options.backgroundactive){
                //calculates the vertical align
                $el.css({
                    top:(
                        $window.height() - (
                            $el.get(0).offsetHeight +
                            parseInt($el.css('margin-top'), 10) +
                            parseInt($el.css('margin-bottom'), 10)
                        )
                    )/2 +'px'
            ***REMOVED***);
        ***REMOVED***

            $el.css({
                'visibility': 'visible',
                'opacity': 1
        ***REMOVED***);

            // Show background
            if (options.background) {
                $background.css({
                    'visibility': 'visible',
                    'opacity': options.opacity
            ***REMOVED***);

                // Fix IE8 issue with background not appearing
                setTimeout(function() {
                    $background.css({
                        'opacity': options.opacity
                ***REMOVED***);
              ***REMOVED*** 0);
        ***REMOVED***

            $el.data('popup-visible', true);

            // Position popup
            methods.reposition(el, ordinal);

            // Remember which element had focus before opening a popup
            $el.data('focusedelementbeforepopup', document.activeElement);

            // Handler: Keep focus inside dialog box
            if (options.keepfocus) {
                // Make holder div focusable
                $el.attr('tabindex', -1);

                // Focus popup or user specified element.
                // Initial timeout of 50ms is set to give some time to popup to show after clicking on
                // `open` element, and after animation is complete to prevent background scrolling.
                setTimeout(function() {
                    if (options.focuselement === 'closebutton') {
                        $('#' + el.id + ' .' + el.id + closesuffix + ':first').focus();
                ***REMOVED*** else if (options.focuselement) {
                        $(options.focuselement).focus();
                ***REMOVED*** else {
                        $el.focus();
                ***REMOVED***
              ***REMOVED*** options.focusdelay);

        ***REMOVED***

            // Hide main content from screen readers
            $(options.pagecontainer).attr('aria-hidden', true);

            // Reveal popup content to screen readers
            $el.attr('aria-hidden', false);

            callback(el, ordinal, options.onopen);

            if (transitionsupport) {
                $wrapper.one('transitionend', function() {
                    callback(el, ordinal, options.opentransitionend);
            ***REMOVED***);
        ***REMOVED*** else {
                callback(el, ordinal, options.opentransitionend);
        ***REMOVED***

            // Handler: Reposition tooltip when window is resized
            if (options.type == 'tooltip') {
                $(window).on('resize.' + el.id, function () {
                    methods.reposition(el, ordinal);
            ***REMOVED***);
        ***REMOVED***
      ***REMOVED***

        /**
         * Hide method
         *
         * @param object el - popup instance DOM node
         * @param boolean outerClick - click on the outer content below popup
         */
        hide: function (el, outerClick) {
            // Get index of popup ID inside of visiblePopupsArray
            var popupIdIndex = $.inArray(el.id, visiblePopupsArray);

            // If popup is not opened, ignore the rest of the function
            if (popupIdIndex === -1) {
                return;
        ***REMOVED***

            if(opentimer) clearTimeout(opentimer);

            var $body = $('body');
            var $el = $(el);
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            $el.data('popup-visible', false);

            if (visiblePopupsArray.length === 1) {
                $('html').removeClass('popup_visible').removeClass('popup_visible_' + el.id);
        ***REMOVED*** else {
                if($('html').hasClass('popup_visible_' + el.id)) {
                    $('html').removeClass('popup_visible_' + el.id);
            ***REMOVED***
        ***REMOVED***

            // Remove popup from the visiblePopupsArray
            visiblePopupsArray.splice(popupIdIndex, 1);

            if($wrapper.hasClass('popup_wrapper_visible')) {
                $wrapper.removeClass('popup_wrapper_visible');
        ***REMOVED***

            // Focus back on saved element
            if (options.keepfocus && !outerClick) {
                setTimeout(function() {
                    if ($($el.data('focusedelementbeforepopup')).is(':visible')) {
                        $el.data('focusedelementbeforepopup').focus();
                ***REMOVED***
              ***REMOVED*** 0);
        ***REMOVED***

            // Hide popup
            $wrapper.css({
                'visibility': 'hidden',
                'opacity': 0
        ***REMOVED***);
            $el.css({
                'visibility': 'hidden',
                'opacity': 0
        ***REMOVED***);

            // Hide background
            if (options.background) {
                $background.css({
                    'visibility': 'hidden',
                    'opacity': 0
            ***REMOVED***);
        ***REMOVED***

            // Reveal main content to screen readers
            $(options.pagecontainer).attr('aria-hidden', false);

            // Hide popup content from screen readers
            $el.attr('aria-hidden', true);

            // `onclose` callback event
            callback(el, lastclicked[el.id], options.onclose);

            if (transitionsupport && $el.css('transition-duration') !== '0s') {
                $el.one('transitionend', function(e) {

                    if (!($el.data('popup-visible'))) {
                        if (options.detach) {
                            $el.hide().detach();
                    ***REMOVED*** else {
                            $wrapper.hide();
                    ***REMOVED***
                ***REMOVED***

                    // Re-enable scrolling of background layer
                    if (options.scrolllock) {
                        setTimeout(function() {
                            $body.css({
                                overflow: 'visible',
                                'margin-right': bodymarginright
                        ***REMOVED***);
                      ***REMOVED*** 10); // 10ms added for CSS transition in Firefox which doesn't like overflow:auto
                ***REMOVED***

                    callback(el, lastclicked[el.id], options.closetransitionend);
            ***REMOVED***);
        ***REMOVED*** else {
                if (options.detach) {
                    $el.hide().detach();
            ***REMOVED*** else {
                    $wrapper.hide();
            ***REMOVED***

                // Re-enable scrolling of background layer
                if (options.scrolllock) {
                    setTimeout(function() {
                        $body.css({
                            overflow: 'visible',
                            'margin-right': bodymarginright
                    ***REMOVED***);
                  ***REMOVED*** 10); // 10ms added for CSS transition in Firefox which doesn't like overflow:auto
            ***REMOVED***

                callback(el, lastclicked[el.id], options.closetransitionend);
        ***REMOVED***

            if (options.type == 'tooltip') {
                $(window).off('resize.' + el.id);
        ***REMOVED***
      ***REMOVED***

        /**
         * Toggle method
         *
         * @param {object***REMOVED*** el - popup instance DOM node
         * @param {number***REMOVED*** ordinal - order number of an `open` element
         */
        toggle: function (el, ordinal) {
            if ($(el).data('popup-visible')) {
                methods.hide(el);
        ***REMOVED*** else {
                setTimeout(function() {
                    methods.show(el, ordinal);
              ***REMOVED*** 0);
        ***REMOVED***
      ***REMOVED***

        /**
         * Reposition method
         *
         * @param {object***REMOVED*** el - popup instance DOM node
         * @param {number***REMOVED*** ordinal - order number of an `open` element
         */
        reposition: function (el, ordinal) {
            var $el = $(el);
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            ordinal = ordinal || 0;

            // Tooltip type
            if (options.type == 'tooltip') {
                $wrapper.css({
                    'position': 'absolute'
            ***REMOVED***);

                var $tooltipanchor;
                if (options.tooltipanchor) {
                    $tooltipanchor = $(options.tooltipanchor);
            ***REMOVED*** else if (options.openelement) {
                    $tooltipanchor = $(options.openelement).filter('[data-popup-ordinal="' + ordinal + '"]');
            ***REMOVED*** else {
                    $tooltipanchor = $('.' + el.id + opensuffix + '[data-popup-ordinal="' + ordinal + '"]');
            ***REMOVED***

                var linkOffset = $tooltipanchor.offset();

                // Horizontal position for tooltip
                if (options.horizontal == 'right') {
                    $wrapper.css('left', linkOffset.left + $tooltipanchor.outerWidth() + options.offsetleft);
            ***REMOVED*** else if (options.horizontal == 'leftedge') {
                    $wrapper.css('left', linkOffset.left + $tooltipanchor.outerWidth() - $tooltipanchor.outerWidth() +  options.offsetleft);
            ***REMOVED*** else if (options.horizontal == 'left') {
                    $wrapper.css('right', $window.width() - linkOffset.left  - options.offsetleft);
            ***REMOVED*** else if (options.horizontal == 'rightedge') {
                    $wrapper.css('right', $window.width()  - linkOffset.left - $tooltipanchor.outerWidth() - options.offsetleft);
            ***REMOVED*** else {
                    $wrapper.css('left', linkOffset.left + ($tooltipanchor.outerWidth() / 2) - ($el.outerWidth() / 2) - parseFloat($el.css('marginLeft')) + options.offsetleft);
            ***REMOVED***

                // Vertical position for tooltip
                if (options.vertical == 'bottom') {
                    $wrapper.css('top', linkOffset.top + $tooltipanchor.outerHeight() + options.offsettop);
            ***REMOVED*** else if (options.vertical == 'bottomedge') {
                    $wrapper.css('top', linkOffset.top + $tooltipanchor.outerHeight() - $el.outerHeight() + options.offsettop);
            ***REMOVED*** else if (options.vertical == 'top') {
                    $wrapper.css('bottom', $window.height() - linkOffset.top - options.offsettop);
            ***REMOVED*** else if (options.vertical == 'topedge') {
                    $wrapper.css('bottom', $window.height() - linkOffset.top - $el.outerHeight() - options.offsettop);
            ***REMOVED*** else {
                    $wrapper.css('top', linkOffset.top + ($tooltipanchor.outerHeight() / 2) - ($el.outerHeight() / 2) - parseFloat($el.css('marginTop')) + options.offsettop);
            ***REMOVED***

            // Overlay type
        ***REMOVED*** else if (options.type == 'overlay') {

                // Horizontal position for overlay
                if (options.horizontal) {
                    $wrapper.css('text-align', options.horizontal);
            ***REMOVED*** else {
                    $wrapper.css('text-align', 'center');
            ***REMOVED***

                // Vertical position for overlay
                if (options.vertical) {
                    $el.css('vertical-align', options.vertical);
            ***REMOVED*** else {
                    $el.css('vertical-align', 'middle');
            ***REMOVED***
        ***REMOVED***
      ***REMOVED***

        /**
         * Add-close-button method
         *
         * @param {object***REMOVED*** el - popup instance DOM node
         */
        addclosebutton: function (el) {
            var genericCloseButton;

            if ($(el).data('popupoptions').closebuttonmarkup) {
                genericCloseButton = $(options.closebuttonmarkup).addClass(el.id + '_close');
        ***REMOVED*** else {
                genericCloseButton = '<button class="popup_close ' + el.id + '_close" title="Close" aria-label="Close"><span aria-hidden="true">×</span></button>';
        ***REMOVED***

            if ($(el).data('popup-initialized')){
                $(el).append(genericCloseButton);
        ***REMOVED***

    ***REMOVED***

***REMOVED***;

    /**
     * Callback event calls
     *
     * @param {object***REMOVED*** el - popup instance DOM node
     * @param {number***REMOVED*** ordinal - order number of an `open` element
     * @param {function***REMOVED*** func - callback function
     */
    var callback = function (el, ordinal, func) {
        var options = $(el).data('popupoptions');
        var openelement;
        var elementclicked;
        if (typeof options === 'undefined') return;
        openelement =  options.openelement ? options.openelement : ('.' + el.id + opensuffix);
        elementclicked = $(openelement + '[data-popup-ordinal="' + ordinal + '"]');
        if (typeof func == 'function') {
            func.call($(el), el, elementclicked);
    ***REMOVED***
***REMOVED***;

    // Hide popup if ESC key is pressed
    $(document).on('keydown', function (event) {
        if(visiblePopupsArray.length) {
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);

            if ($(el).data('popupoptions').escape && event.keyCode == 27) {
                methods.hide(el);
        ***REMOVED***
    ***REMOVED***
***REMOVED***);

    // Hide popup on click
    $(document).on('click', function (event) {
        if(visiblePopupsArray.length) {
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);
            var closeButton = ($(el).data('popupoptions').closeelement) ? $(el).data('popupoptions').closeelement : ('.' + el.id + closesuffix);

            // If Close button clicked
            if ($(event.target).closest(closeButton).length) {
                event.preventDefault();
                methods.hide(el);
        ***REMOVED***

            // If clicked outside of popup
            if ($(el).data('popupoptions') && $(el).data('popupoptions').blur && !$(event.target).closest('#' + elementId).length && event.which !== 2 && $(event.target).is(':visible')) {

                if ($(el).data('popupoptions').background) {
                    // If clicked on popup cover
                    methods.hide(el);

                    // Older iOS/Safari will trigger a click on the elements below the cover,
                    // when tapping on the cover, so the default action needs to be prevented.
                    event.preventDefault();

            ***REMOVED*** else {
                    // If clicked on outer content
                    methods.hide(el, true);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***);

    // Keep keyboard focus inside of popup
    $(document).on('keydown', function(event) {
        if(visiblePopupsArray.length && event.which == 9) {

            // If tab or shift-tab pressed
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);

            // Get list of all children elements in given object
            var popupItems = $(el).find('*');

            // Get list of focusable items
            var focusableItems = popupItems.filter(focusableElementsString).filter(':visible');

            // Get currently focused item
            var focusedItem = $(':focus');

            // Get the number of focusable items
            var numberOfFocusableItems = focusableItems.length;

            // Get the index of the currently focused item
            var focusedItemIndex = focusableItems.index(focusedItem);

            // If popup doesn't contain focusable elements, focus popup itself
            if (numberOfFocusableItems === 0) {
                $(el).focus();
                event.preventDefault();
        ***REMOVED*** else {
                if (event.shiftKey) {
                    // Back tab
                    // If focused on first item and user preses back-tab, go to the last focusable item
                    if (focusedItemIndex === 0) {
                        focusableItems.get(numberOfFocusableItems - 1).focus();
                        event.preventDefault();
                ***REMOVED***

            ***REMOVED*** else {
                    // Forward tab
                    // If focused on the last item and user preses tab, go to the first focusable item
                    if (focusedItemIndex == numberOfFocusableItems - 1) {
                        focusableItems.get(0).focus();
                        event.preventDefault();
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***);

    /**
     * Plugin API
     */
    $.fn.popup = function (customoptions) {
        return this.each(function () {

            var $el = $(this);

            if (typeof customoptions === 'object') {  // e.g. $('#popup').popup({'color':'blue'***REMOVED***)
                var opt = $.extend({***REMOVED***, $.fn.popup.defaults, $el.data('popupoptions'), customoptions);
                $el.data('popupoptions', opt);
                options = $el.data('popupoptions');

                methods._init(this);

        ***REMOVED*** else if (typeof customoptions === 'string') { // e.g. $('#popup').popup('hide')
                if (!($el.data('popupoptions'))) {
                    $el.data('popupoptions', $.fn.popup.defaults);
                    options = $el.data('popupoptions');
            ***REMOVED***

                methods[customoptions].call(this, this);

        ***REMOVED*** else { // e.g. $('#popup').popup()
                if (!($el.data('popupoptions'))) {
                    $el.data('popupoptions', $.fn.popup.defaults);
                    options = $el.data('popupoptions');
            ***REMOVED***

                methods._init(this);

        ***REMOVED***

    ***REMOVED***);
***REMOVED***;

    $.fn.popup.defaults = {
        type: 'overlay',
        autoopen: false,
        background: true,
        backgroundactive: false,
        color: 'black',
        opacity: '0.5',
        horizontal: 'center',
        vertical: 'middle',
        offsettop: 0,
        offsetleft: 0,
        escape: true,
        blur: true,
        setzindex: true,
        autozindex: false,
        scrolllock: false,
        closebutton: false,
        closebuttonmarkup: null,
        keepfocus: true,
        focuselement: null,
        focusdelay: 50,
        outline: false,
        pagecontainer: null,
        detach: false,
        openelement: null,
        closeelement: null,
        transition: null,
        tooltipanchor: null,
        beforeopen: null,
        onclose: null,
        onopen: null,
        opentransitionend: null,
        closetransitionend: null
***REMOVED***;

***REMOVED***)(jQuery);
