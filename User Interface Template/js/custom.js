(function() {

	"use strict";
  
	var app = {
		
		init: function() {

			//=== Main visible ===\\
			this.mainVisible();

			//=== lazy loading effect ===\\
			this.lazyLoading();

			//=== Cookie ===\\
			this.cookieCheck();

			this.setUpListeners();

			//=== Custom scripts ===\\
			this.btnHover();
			this.appendMfBg();
			this.appendBtnTop();
			this.formingHrefTel();
			this.contentTable();
			this.clockCountDown();
			this.detectIE();

			//=== Plugins ===\\
			this.autoSizeTextarea();
			this.device();
			this.popUp();
			this.lightGallery();
			this.scrollToFixed();
			this.carusels();
			this.forms();
			this.isotopeProjects();
			this.isotopeGallery();
			this.isotopeGalleryMasonry();
			this.spincrement();

		***REMOVED***,
 
		setUpListeners: function() {

			//=== Cookie ===\\
			$(".mc-btn").on("click", this.cookieSet);

			//=== Ripple effect for buttons ===\\
			$(".ripple").on("click", this.btnRipple);

			//=== Header search ===\\
			// Header search open
			$(".header-search-ico-search").on("click", this.headerSearchOpen);
			// Header search close \\
			$(".header-search-ico-close").on("click", this.headerSearchClose);
			// Header search close not on this element \\
			$(document).on("click", this.headerSearchCloseNotEl);

			//=== Header lang ===\\
			// Header lang open
			$(".header-lang-current").on("click", this.headerLangOpen);
			// Header lang select \\
			$(".header-lang-list a").on("click", this.headerLangSelect);
			// Header lang close not on this element \\
			$(document).on("click", this.headerLangCloseNotEl);

			//=== Header mobile/tablet navbar ===\\
			// Header navbar toggle \\
			$(".header-navbar-btn").on("click", this.headerNavbarToggle);
			// Header navbar close not on this element \\
			$(document).on("click", this.headerNavbarNotEl);

			//=== Mobile/tablet main menu ===\\
			// Main menu toogle \\
			$(".main-mnu-btn").on("click", this.MainMenuToggle);
			// Main menu submenu toogle \\
			$(".mmm-btn").on("click", this.MainMenuSubmenuToggle);
			// Main menu close not on this element \\
			$(document).on("click", this.MainMenuCloseNotEl);

			//=== Side toggle ===\\
			$(".side-open").on("click", this.sideOpen);
			$(document).on("click", ".side-close, .side-visible", this.sideClose);

			//=== Tab ===\\
			$(".tabs-nav li").on("click", this.tab);

			//=== Accordion ===\\
			$(".accordion-trigger").on("click", this.accordion);

			//=== Sidebar category item ===\\
			$(".sidebar-cat-item-has-child > a").on("click", this.sidebarCatItemToggle);

			//=== UI elements ===\\
			$(".ui-nav li").on("click", this.ui);
			
			//=== Form field ===\\
			$(".form-field").each(this.inputEach);
			$(".form-field-input")
				.on("focus", this.inputFocus)
				.on("keyup change", this.inputKeyup)
				.on("blur", this.inputBlur);

			//=== Button top ===\\
			$(document).on("click", '.btn-top', this.btnTop);
			$(window).on("scroll", this.btnTopScroll);
			
		***REMOVED***,

		//=== Body visible ===\\
		mainVisible: function() {

			$(".main").addClass("main-visible");

		***REMOVED***,

		//=== Cookie ===\\
		COOKIENAME: 'pathsoft-cookie',
		COOKIEDURATION: 1000,
		COOKIEEXDAYS: 30,
		cookieCheck: function() {

			var cookieMessage = $(".cookie-message");

			if(!this.getCookie(this.COOKIENAME)) {
				setTimeout(function() {
					console.log("111");
					cookieMessage.addClass("open");
				***REMOVED***, this.COOKIEDURATION);
			***REMOVED***

		***REMOVED***,
		cookieSet: function() {

			app.setCookie(app.COOKIENAME, 'enabled', app.COOKIEEXDAYS);
			$(this).closest(".cookie-message").removeClass('open');

		***REMOVED***,
		setCookie: function(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			var expires = "expires=" + d.toUTCString();
			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		***REMOVED***,
		getCookie: function(name) {
			var matches = document.cookie.match(new RegExp(
				"(?:^|; )" + name.replace(/([\.$?*|{***REMOVED***\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
			));
			return matches ? decodeURIComponent(matches[1]) : undefined;
		***REMOVED***,

		appendMfBg: function() {

			$("body").append('<div class="mf-bg"></div>');

		***REMOVED***,

		appendBtnTop: function() {

			$("body").append('<div class="btn-top"><svg class="btn-icon-right" viewBox="0 0 13 9" width="13" height="9"><use xlink:href="assets/img/sprite.svg#arrow-right"></use></svg></div>');

		***REMOVED***,

		btnTop: function() {
			
			$('html, body').animate({scrollTop: 0***REMOVED***,1000, function() {
				$(this).removeClass("active");
			***REMOVED***);

		***REMOVED***,

		btnTopScroll: function() {
			
			var btnTop = $('.btn-top');
			
			if ($(this).scrollTop() > 700) {

				btnTop.addClass("active");

			***REMOVED*** else {

				btnTop.removeClass("active");
				
			***REMOVED***

		***REMOVED***,

		ui: function() {

			var _this = $(this),
				index = _this.index(),
				nav = _this.parent(),
				tabs = _this.closest(".ui"),
				items = tabs.find(".ui-item");

			if (!_this.hasClass("active")) {

				items
					.eq(index)
					.add(_this)
					.addClass("active")
					.siblings()
					.removeClass("active");

				nav
					.trigger("detach.ScrollToFixed")
					.scrollToFixed({
						marginTop: $(".header-fixed").outerHeight() + 20,
						zIndex: 2,
						limit: $(".footer").offset().top - nav.outerHeight() - 40,
						preAbsolute: function() { $(this).css({"opacity": 0, "visability": "hidden"***REMOVED***); ***REMOVED***,
						postUnfixed: function() { $(this).css({"opacity": 1, "visability": "visible"***REMOVED***); ***REMOVED***,
						postAbsolute: function() { $(this).css({"opacity": 1, "visability": "visible"***REMOVED***); ***REMOVED***,
					***REMOVED***);

				if ($(document).scrollTop() > 0) {
					$("html, body").animate({ scrollTop: 0 ***REMOVED***, 500);
				***REMOVED***
			
			***REMOVED***

		***REMOVED***,

		//=== Tab ===\\
		tab: function() {

			var _this = $(this),
				index = _this.index(),
				list = _this.parent(),
				tabs = _this.closest(".tabs"),
				items = tabs.find(".tabs-item");

			if (!_this.hasClass("active")) {

				items
					.eq(index)
					.add(_this)
					.addClass("active")
					.siblings()
					.removeClass("active");
			
			***REMOVED***

		***REMOVED***,

		//=== Accordion ===\\
		accordion: function(e) {

			e.originalEvent.preventDefault();

			var _this = $(this),
				item = _this.closest(".accordion-item"),
				container = _this.closest(".accordion"),
				items = container.find(".accordion-item"),
				content = item.find(".accordion-content"),
				otherContents = container.find(".accordion-content"),
				duration = 300;

			if (!item.hasClass("active")) {
				items.removeClass("active");
				item.addClass("active");
				otherContents.stop(true, true).slideUp(duration);
				content.stop(true, true).slideDown(duration);
			***REMOVED*** else {
				content.stop(true, true).slideUp(duration);
				item.removeClass("active");
			***REMOVED***

		***REMOVED***,

		//=== Header search ===\\
		headerSearchOpen: function() {

			$(this).closest(".header-search").addClass("open");

		***REMOVED***,
		headerSearchClose: function() {

			$(this).closest(".header-search").removeClass("open");

		***REMOVED***,
		headerSearchCloseNotEl: function(e) {

			if($(".header-search").hasClass("open")) {
				if ($(e.originalEvent.target).closest(".header-search").length) return;
				$(".header-search").removeClass("open");
				e.originalEvent.stopPropagation();
			***REMOVED***

		***REMOVED***,
		
		//=== Header lang ===\\
		headerLangOpen: function() {

			$(this).parent().toggleClass("open");

		***REMOVED***,
		headerLangSelect: function() {

			var _this = $(this),
				lang = _this.attr("data-lang"),
				container = _this.closest(".header-lang"),
				current = container.find(".header-lang-current");
		
			container.removeClass("open");
			current.children().text(lang);
			current.attr("data-title", lang);

		***REMOVED***,
		headerLangCloseNotEl: function(e) {
			
			if($(".header-lang").hasClass("open")) {
				if ($(e.originalEvent.target).closest(".header-lang").length) return;
				$(".header-lang").removeClass("open");
				e.originalEvent.stopPropagation();
			***REMOVED***

		***REMOVED***,

		//=== Mobile/tablet main menu ===\\
		MainMenuToggle: function() {

			var _this = $(this),
				_body = $("body"),
				headerH = _this.closest(".header").outerHeight(),
				mnu = $(".mob-main-mnu"),
				offsetTop = $(".header-fixed").offset().top;
				
			mnu.css("padding-top", headerH);
			$(this).toggleClass("active");

			_body.toggleClass("mob-main-mnu-open").scrollTop(offsetTop);
				
			if(_body.hasClass("mob-main-mnu-open")) {
				$(".mf-bg").addClass("visible mm");
			***REMOVED*** else {
				$(".mf-bg").removeClass("visible mm");
			***REMOVED***

		***REMOVED***,
		MainMenuSubmenuToggle: function() {

			var _this = $(this),
				item = _this.parent(),
				content = item.find(".mob-main-submnu");

			item.toggleClass("open");
			content.slideToggle();

		***REMOVED***,
		MainMenuCloseNotEl: function(e) {

			if($("body").hasClass("mob-main-mnu-open")) {
				if ($(e.originalEvent.target).closest(".mob-main-mnu, .main-mnu-btn").length) return;
				$("body").removeClass("mob-main-mnu-open");
				$(".main-mnu-btn").removeClass("active");
				$(".mf-bg").removeClass("visible mm");
				e.originalEvent.stopPropagation();
			***REMOVED***

		***REMOVED***,

		//=== Header mobile/tablet navbar ===\\
		headerNavbarToggle: function() {

			$(this).parent().toggleClass("open");

		***REMOVED***,
		headerNavbarNotEl: function(e) {

			if ($(e.originalEvent.target).closest(".header-navbar").length) return;
			$(".header-navbar").removeClass("open");
			e.originalEvent.stopPropagation();

		***REMOVED***,

		//=== Side toggle ===\\
		sideOpen: function(e) {

			e.originalEvent.preventDefault();

			var side = $($(this).attr("data-side"));

			if(side.length) {

				side.toggleClass("open");
				if(!e.currentTarget.classList.contains("panel-settings-btn")) {
					$(".mf-bg").toggleClass("visible side-visible");
				***REMOVED***

			***REMOVED***

		***REMOVED***,
		sideClose: function() {

			$(".side, .sidebar-filters").removeClass("open");
			$(".mf-bg").removeClass("visible side-visible");

		***REMOVED***,

		//=== Form input ===\\
		inputEach: function() {

			var _this = $(this),
				val = _this.find(".form-field-input").val();

			if (val === "") {
				_this.removeClass("focus");
			***REMOVED*** else {
				_this.addClass("focus");
			***REMOVED***

		***REMOVED***,
		inputFocus: function() {

			var _this = $(this),
				wrappInput = _this.parent();

			wrappInput.addClass("focus");

		***REMOVED***,
		inputKeyup: function() {

			var _this = $(this),
				val = _this.val(),
				wrappInput = _this.parent();

			if (val === "" && !_this.is(":focus")) {
				wrappInput.removeClass("focus");
			***REMOVED*** else {
				wrappInput.addClass("focus");
			***REMOVED***

		***REMOVED***,
		inputBlur: function() {

			var _this = $(this),
				val = _this.val(),
				wrappInput = _this.parent();

			if(val === "") {
				wrappInput.removeClass("focus"); 
			***REMOVED***

		***REMOVED***,

		//=== Ripple effect for buttons ===\\
		btnRipple: function(e) {
			
			var _this = $(this),
				offset = $(this).offset(),
				positionX = e.originalEvent.pageX - offset.left,
				positionY = e.originalEvent.pageY - offset.top;
			_this.append("<div class='ripple-effect'>");
			_this
				.find(".ripple-effect")
				.css({
					left: positionX,
					top: positionY
				***REMOVED***)
				.animate({
					opacity: 0
				***REMOVED***, 1500, function() {
					$(this).remove();
				***REMOVED***);

		***REMOVED***,

		btnHover: function() {

			var btns = document.querySelectorAll(".btn, .el-ripple"),
				btn = [];

			btns.forEach(function(element, index) {

				var span = document.createElement("span"); 
				span.className = "el-ripple-circle";
				element.appendChild(span);

				// If The span element for this element does not exist in the array, add it.
				if (!btn[index])
				btn[index] = element.querySelector(".el-ripple-circle");

				element.addEventListener("mouseenter", function(e) {	
					btnHandler(element, index, e);			
				***REMOVED***);

				element.addEventListener("mouseleave", function(e) {
					btnHandler(element, index, e);
				***REMOVED***);
				
			***REMOVED***);

			const btnHandler = function(element, index, e) {

				let offset = element.getBoundingClientRect(),
					left = e.pageX - offset.left - window.scrollX,
					top = e.pageY - offset.top - window.scrollY;

				btn[index].style.left = left + "px";
				btn[index].style.top = top + "px";

			***REMOVED***

		***REMOVED***,

		//=== Forming href for phone ===\\
		formingHrefTel: function() {

			var linkAll = $('.formingHrefTel'),
				joinNumbToStringTel = 'tel:';

			$.each(linkAll, function () {
				var _this = $(this),
					linkValue = _this.text(),
					arrayString = linkValue.split("");

				for (var i = 0; i < arrayString.length; i++) {
					var thisNunb = app.isNumber(arrayString[i]);
					if (thisNunb === true || (arrayString[i] === "+" && i === 0)) {
						joinNumbToStringTel += arrayString[i];
					***REMOVED***
				***REMOVED***

				_this.attr("href", function () {
					return joinNumbToStringTel;
				***REMOVED***);
				joinNumbToStringTel = 'tel:'

			***REMOVED***);

		***REMOVED***,

		isNumber: function(n) {

			return !isNaN(parseFloat(n)) && isFinite(n);

		***REMOVED***,

		//=== Sidebar category item ===\\
		sidebarCatItemToggle: function(e) {

			e.originalEvent.preventDefault();

			var item = $(this).parent(),
				ul = item.find("> ul");

			item.toggleClass("open");
			ul.slideToggle();

		***REMOVED***,
		
		//=== Content table responsive ===\\
		contentTable: function() {

			var contentTable = $(".content");
			if(contentTable.length) {
				
				$.each(contentTable.find("table"), function() {
					$(this).wrap("<div class='table-responsive-outer'></div>").wrap("<div class='table-responsive'></div>");
				***REMOVED***);
				
			***REMOVED***

		***REMOVED***,

		//=== Clock count down ===\\
		clockCountDown: function() {

			if($("#countdown").length) {
				this.clock("countdown", $("#countdown").attr("data-dedline"));
			***REMOVED***

		***REMOVED***,
		getTimeRemaining: function(endtime) {

			var t = Date.parse(endtime) - Date.parse(new Date()),
				seconds = Math.floor((t / 1000) % 60),
				minutes = Math.floor((t / 1000 / 60) % 60),
				hours = Math.floor((t / (1000 * 60 * 60)) % 24),
				days = Math.floor(t / (1000 * 60 * 60 * 24));

			return {
				total: t,
				days: days,
				hours: hours,
				minutes: minutes,
				seconds: seconds
			***REMOVED***;

		***REMOVED***,
		clock: function(id, endtime) {

			var clock = document.getElementById(id),
				daysSpan = clock.querySelector(".days"),
				hoursSpan = clock.querySelector(".hours"),
				minutesSpan = clock.querySelector(".minutes"),
				secondsSpan = clock.querySelector(".seconds");

			function updateClock() {
				var t = app.getTimeRemaining(endtime);

				if (t.total <= 0) {
					document.getElementById("countdown").classList.add("hidden");
					document.getElementById("deadline-message").classList.add("visible");
					clearInterval(timeinterval);
					return true;
				***REMOVED***

				daysSpan.innerHTML = t.days;
				hoursSpan.innerHTML = ("0" + t.hours).slice(-2);
				minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
				secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
			***REMOVED***

			updateClock();
			var timeinterval = setInterval(updateClock, 1000);

		***REMOVED***,

		//=== Custom alert ===\\
		customAlert: function(text, duration, alertInfo) {

			var alerts = $(".alerts"),
				body = $("body"),
				alertClass = "",
				alertIco = "info";
			
			if (!alerts.length) {
				body.append('<div class="alerts"></div>');
			***REMOVED***
			$(".alert").remove();

			if (alertInfo === "success") {
				alertClass = "alert-success";
				alertIco = "check";
			***REMOVED*** else if (alertInfo === "danger") {
				alertClass = "alert-danger";
				alertIco = "error";
			***REMOVED*** else if (alertInfo === "warning") {
				alertClass = "alert-warning";
				alertIco = "warning";
			***REMOVED*** else if (alertInfo == "default") {
				alertClass = "alert-default";
				alertIco = "info";
			***REMOVED***

			if (!$("." + alertClass + "").length) {
				$(".alerts").append(
				'<div class="alert ' +
					alertClass +
					'" data-duration-hide="' +
					duration +
					'"> <div class="alert-ico"> <i class="material-icons md-22">' +
					alertIco +
					'</i> </div> <div class="alert-text">' +
					text +
					"</div> </div>"
				);

				setTimeout(function() {
					$("." + alertClass + "").remove();
				***REMOVED***, duration);
			***REMOVED***

			$(document).on("click", ".alert-close", function() {
				$(this)
				.closest(".alert")
				.remove();
			***REMOVED***);

		***REMOVED***,

		//=== Plugins ===\\

		lazyLoading: function() {

			var observer = lozad('.lazy');
			observer.observe();

		***REMOVED***,

		autoSizeTextarea: function() {

			autosize(document.querySelectorAll('textarea'));

		***REMOVED***,

		device: function() {

			if( (device.mobile() || device.tablet()) && device.ios() ) {
				var tempCSS = $('a').css('-webkit-tap-highlight-color');
				$('main, .main-inner').css('cursor', 'pointer')
						 .css('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)');
				$('a').css('-webkit-tap-highlight-color', tempCSS);
			***REMOVED***

		***REMOVED***,

		popUp: function() {

			$('.open_popup').popup({
				transition: 'all 0.4s',
				color: '#000000',
				opacity: 0.8
			***REMOVED***);
			$('.popup_autoopen').popup({
				transition: 'all 0.4s',
				color: '#000000',
				autoopen: true,
				opacity: 0.8
			***REMOVED***);

		***REMOVED***,

		lightGallery: function() {

			$(".gallery-container").lightGallery({
				selector: '.gallery-item'
			***REMOVED***);

		***REMOVED***,

		scrollToFixed: function() {

			if($('.header-fixed').length) {

				$('.header-fixed').scrollToFixed({
					preFixed: function() { $(this).addClass("fixed"); ***REMOVED***,
					postFixed: function() { $(this).removeClass("fixed"); ***REMOVED***
				***REMOVED***);
	
				$('#ui-nav').scrollToFixed({
					marginTop: $('.header-fixed').outerHeight() + 20,
					zIndex: 2,
					limit: $('.footer').offset().top - $('#ui-nav').outerHeight() - 40,
					preAbsolute: function() { $(this).css({"opacity": 0, "visability": "hidden"***REMOVED***); ***REMOVED***,
					postUnfixed: function() { $(this).css({"opacity": 1, "visability": "visible"***REMOVED***); ***REMOVED***,
					postAbsolute: function() { $(this).css({"opacity": 1, "visability": "visible"***REMOVED***); ***REMOVED***,
				***REMOVED***);

			***REMOVED***
			
		***REMOVED***,

		carusels: function() {
			
			var reviewsCaruselTh = $('.reviews-carusel-th');
			reviewsCaruselTh.flickity({
				imagesLoaded: true,
				lazyLoad: true,
				pageDots: false,
				adaptiveHeight: true,
				fade: true,
				prevNextButtons: false
			***REMOVED***);

			$('.reviews-thumb-item').on('click', function() {
				var _this = $(this),
					index = _this.index();
				reviewsCaruselTh.flickity( 'select', index );
				_this.addClass("active").siblings().removeClass("active");
			***REMOVED***);


			$('.project-carusel-main').flickity({
				pageDots: false,
				imagesLoaded: true,
				lazyLoad: 1,
				prevNextButtons: true
			***REMOVED***);
			$('.project-carusel-thumb').flickity({
				asNavFor: '.project-carusel-main',
				imagesLoaded: true,
				lazyLoad: 5,
				prevNextButtons: true,
				contain: true,
				pageDots: false
			***REMOVED***);

		***REMOVED***,

		forms: function() {

			var ajaxurl = "/mail.php";

			$.validator.addMethod("customemail", function (value, element) {
				return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
			***REMOVED***,
				"The email is not a valid email."
			);
			
			$(".сallback_popup_form").validate({
				rules: {
					NameCallBack: {
					required: true,
					minlength: 2
					***REMOVED***,
					PhoneCallBack: {
					required: true
					***REMOVED***
				***REMOVED***,
				messages: {
					NameCallBack: {
					required: "The name field is required.",
					***REMOVED***,
					PhoneCallBack: {
					required: "The phone field is required.",
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form),
						popup = th.closest(".popup_style"),
						close = popup.find(".popup_close");
					close.click();

					$.ajax({
						type: "POST",
						url: ajaxurl,
						data: th.serialize()
					***REMOVED***).done(function() {

						//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
						app.customAlert("Successfully sent!", 4000, "success");

						setTimeout(function() {
							th.trigger("reset");
							$(".form-field").removeClass("focus");
						***REMOVED***, 1000);
					***REMOVED***);

				***REMOVED***
			***REMOVED***);
			

			$(".contact-form").validate({
				rules: {
					ContactName: {
					required: true,
					minlength: 2
					***REMOVED***,
					ContactPhone: {
					required: true
					***REMOVED***,
					ContactEmail: {
						required: true,
						email: true,
						customemail: true
					***REMOVED***,
				***REMOVED***,
				messages: {
					ContactName: {
					required: "The name field is required.",
					***REMOVED***,
					ContactPhone: {
					required: "The phone field is required.",
					***REMOVED***,
					ContactEmail: {
						required: "The email field is required.",
						email: "The email field is required.",
						customemail: "The email is not a valid email."
					***REMOVED***,
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);

					$.ajax({
						type: "POST",
						url: ajaxurl,
						data: th.serialize()
					***REMOVED***).done(function() {

						//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
						app.customAlert("Successfully sent!", 4000, "success");

						setTimeout(function() {
							th.trigger("reset");
							$(".form-field").removeClass("focus");
						***REMOVED***, 1000);
					***REMOVED***);

				***REMOVED***
			***REMOVED***);
			
			$(".footer-subscribe").validate({
				rules: {
					ContactEmail: {
						required: true,
						email: true,
						customemail: true
					***REMOVED***,
				***REMOVED***,
				messages: {
					ContactEmail: {
						required: "The email field is required.",
						email: "The email field is required.",
						customemail: "The email is not a valid email."
					***REMOVED***,
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);
			
					//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
					app.customAlert("Successfully sent!", 4000, "success");
			
					setTimeout(function() {
						th.trigger("reset");
						$(".form-field").removeClass("focus");
					***REMOVED***, 1000);
		
				***REMOVED***
			***REMOVED***);

			$(".login-form").validate({
				rules: {
					LoginName: {
						required: true
					***REMOVED***,
					loginPassword: {
						required: true,
						minlength : 6
					***REMOVED***
				***REMOVED***,
				messages: {
					LoginName: {
						required: "The login field is required.",
					***REMOVED***,
					loginPassword: {
						required: "The password field is required.",
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);
			
					//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
					app.customAlert("Successfully sent!", 4000, "success");
			
					setTimeout(function() {
						th.trigger("reset");
						$(".form-field").removeClass("focus");
					***REMOVED***, 1000);
		
				***REMOVED***
			***REMOVED***);

			$(".order-form").validate({
				rules: {
					orderName: {
					required: true,
					minlength: 2
					***REMOVED***,
					orderPhone: {
					required: true
					***REMOVED***
				***REMOVED***,
				messages: {
					orderName: {
					required: "The name field is required.",
					***REMOVED***,
					orderPhone: {
					required: "The phone field is required.",
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);

					$.ajax({
						type: "POST",
						url: ajaxurl,
						data: th.serialize()
					***REMOVED***).done(function() {
						
						//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
						app.customAlert("Successfully sent!", 4000, "success");

						setTimeout(function() {
							th.trigger("reset");
							$(".form-field").removeClass("focus");
						***REMOVED***, 1000);
					***REMOVED***);

				***REMOVED***
			***REMOVED***);

			$(".subscribe-bg-form").validate({
				rules: {
					subscribeBgEmail: {
						required: true,
						email: true,
						customemail: true
					***REMOVED***
				***REMOVED***,
				messages: {
					subscribeBgEmail: {
						required: "The email field is required.",
						email: "The email field is required.",
						customemail: "The email is not a valid email."
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);

					//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
					app.customAlert("Successfully sent!", 4000, "success");

					setTimeout(function() {
						th.trigger("reset");
						$(".form-field").removeClass("focus");
					***REMOVED***, 1000);
				***REMOVED***
			***REMOVED***);

			$(".mailchimp-form").validate({
				rules: {
					mailchimpEmail: {
						required: true,
						email: true,
						customemail: true
					***REMOVED***
				***REMOVED***,
				messages: {
					mailchimpEmail: {
						required: "The email field is required.",
						email: "The email field is required.",
						customemail: "The email is not a valid email."
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);

					//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
					app.customAlert("Successfully sent!", 4000, "success");

					setTimeout(function() {
						th.trigger("reset");
						$(".form-field").removeClass("focus");
					***REMOVED***, 1000);
				***REMOVED***
			***REMOVED***);

			$(".cm-form").validate({
				rules: {
					cmEmail: {
						required: true,
						email: true,
						customemail: true
					***REMOVED***
				***REMOVED***,
				messages: {
					cmEmail: {
						required: "The email field is required.",
						email: "The email field is required.",
						customemail: "The email is not a valid email."
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);

					//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
					app.customAlert("Successfully sent!", 4000, "success");

					setTimeout(function() {
						th.trigger("reset");
						$(".form-field").removeClass("focus");
					***REMOVED***, 1000);
				***REMOVED***
			***REMOVED***);

			$(".comming-soon-form").validate({
				rules: {
					commingSoonEmail: {
						required: true,
						email: true,
						customemail: true
					***REMOVED***
				***REMOVED***,
				messages: {
					commingSoonEmail: {
						required: "The email field is required.",
						email: "The email field is required.",
						customemail: "The email is not a valid email."
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);

					//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
					app.customAlert("Successfully sent!", 4000, "success");

					setTimeout(function() {
						th.trigger("reset");
						$(".form-field").removeClass("focus");
					***REMOVED***, 1000);
				***REMOVED***
			***REMOVED***);

			$(".comments-form").validate({
				rules: {
					CommentsName: {
						required: true,
						minlength: 2
					***REMOVED***,
					CommentsEmail: {
						required: true,
						email: true,
						customemail: true
					***REMOVED***,
					CommentsMessage: {
						required: true,
						minlength: 15
					***REMOVED***,
				***REMOVED***,
				messages: {
					CommentsName: {
						required: "The name field is required."
					***REMOVED***,
					CommentsEmail: {
						required: "The email field is required.",
						email: "The email field is required.",
						customemail: "The email is not a valid email."
					***REMOVED***,
					CommentsMessage: {
						required: "The message field is required."
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);

					//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
					app.customAlert("Successfully sent!", 4000, "success");

					setTimeout(function() {
						th.trigger("reset");
						$(".form-field").removeClass("focus");
					***REMOVED***, 1000);
				***REMOVED***
			***REMOVED***);

			$(".subscribe-news-form").validate({
				rules: {
					CommentsEmail: {
						required: true,
						email: true,
						customemail: true
					***REMOVED***
				***REMOVED***,
				messages: {
					CommentsEmail: {
						required: "The email field is required.",
						email: "The email field is required.",
						customemail: "The email is not a valid email."
					***REMOVED***
				***REMOVED***,
				submitHandler: function(form) {
					var th = $(form);

					//customAlert(text, duration, alertInfo) info = "success" || "danger" || "warning" || "default"
					app.customAlert("Successfully sent!", 4000, "success");

					setTimeout(function() {
						th.trigger("reset");
						$(".form-field").removeClass("focus");
					***REMOVED***, 1000);
				***REMOVED***
			***REMOVED***);

		***REMOVED***,

		isotopeProjects: function() {

			var container = $("#projects-container");

			container.isotope({
				itemSelector: '.project-col'
			***REMOVED***);

			$('.project-nav-list li').on('click', function() {
				var _this = $(this),
					selector = _this.data('filter');
				
				_this.addClass("active").siblings().removeClass("active");
				container.isotope({
					filter: selector
				***REMOVED***);
			***REMOVED***);

		***REMOVED***,

		isotopeGallery: function() {

			var container = $("#gallery-container");

			container.isotope({
				itemSelector: '.gallery-col'
			***REMOVED***);

			$('.gallery-nav-list li').on('click', function() {
				var _this = $(this),
					selector = _this.data('filter');
				
				_this.addClass("active").siblings().removeClass("active");
				container.isotope({
					filter: selector,
				***REMOVED***);
			***REMOVED***);

		***REMOVED***,

		isotopeGalleryMasonry: function() {

			var container = $("#gallery-masonry-container");

			container.isotope({
				itemSelector: '.gallery-col',
				percentPosition: true,
				masonry: {
					columnWidth: '.gallery-col-sizer'
				***REMOVED***
			***REMOVED***);

			$('.gallery-masonry-nav-list li').on('click', function() {
				var _this = $(this),
					selector = _this.data('filter');
				
				_this.addClass("active").siblings().removeClass("active");
				container.isotope({
					filter: selector,
				***REMOVED***);
			***REMOVED***);

		***REMOVED***,

		spincrement: function() {

			var show = true;
			var countbox = ".spincrement-container";

			if($(countbox).length) {
			
				$(window).on("scroll load resize", function () {
					if (!show) return false;
					var w_top = $(window).scrollTop();
					var e_top = $(countbox).offset().top;
					var w_height = $(window).height();
					var d_height = $(document).height();
					var e_height = $(countbox).outerHeight();
					if (w_top + 500 >= e_top || w_height + w_top == d_height || e_height + e_top < w_height) {
						$('.spincrement').spincrement({
							duration: 1500,
							leeway: 10
						***REMOVED***);
					show = false;
					***REMOVED***
				***REMOVED***);
			***REMOVED***

		***REMOVED***,

		//=== detect IE ===\\
		detectIE: function() {

			if(this.detectIECheck()) {
				var body = document.querySelector("body"),
					msg = 'Unfortunately, the browser Internet Explorer you use is outdated and cannot display the site normally. <br> Please open the site in another browser';
				body.classList.add("overflow-hidden");
				body.innerHTML = '<div class="ie-browser"><div class="ie-browser-tr"><div class="ie-browser-td">'+ msg +'</div></div></div>';
			***REMOVED***

		***REMOVED***,
		detectIECheck: function() {

			var ua = window.navigator.userAgent;
			  
			var msie = ua.indexOf('MSIE ');
			if (msie > 0) {
				// IE 10 or older => return version number
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			***REMOVED***
			  
			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				// IE 11 => return version number
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			***REMOVED***
			  
			// other browser
			return false;

		***REMOVED***
		
	***REMOVED***
 
	app.init();
 
***REMOVED***());

function initMap() {
    var geocoder, map,
        mapInfo = $('#map_address'),
        markerUrl = mapInfo.data("marker"),
        address = mapInfo.val();
    function initialize() {
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions = {
            zoom: 15,
            center: latlng,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
          ***REMOVED***
            styles: [ { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#e9e9e9" ***REMOVED***, { "lightness": 17 ***REMOVED*** ] ***REMOVED***, { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" ***REMOVED***, { "lightness": 20 ***REMOVED*** ] ***REMOVED***, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#ffffff" ***REMOVED***, { "lightness": 17 ***REMOVED*** ] ***REMOVED***, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#ffffff" ***REMOVED***, { "lightness": 29 ***REMOVED***, { "weight": 0.2 ***REMOVED*** ] ***REMOVED***, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#ffffff" ***REMOVED***, { "lightness": 18 ***REMOVED*** ] ***REMOVED***, { "featureType": "road.local", "elementType": "geometry", "stylers": [ { "color": "#ffffff" ***REMOVED***, { "lightness": 16 ***REMOVED*** ] ***REMOVED***, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" ***REMOVED***, { "lightness": 21 ***REMOVED*** ] ***REMOVED***, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#dedede" ***REMOVED***, { "lightness": 21 ***REMOVED*** ] ***REMOVED***, { "elementType": "labels.text.stroke", "stylers": [ { "visibility": "on" ***REMOVED***, { "color": "#ffffff" ***REMOVED***, { "lightness": 16 ***REMOVED*** ] ***REMOVED***, { "elementType": "labels.text.fill", "stylers": [ { "saturation": 36 ***REMOVED***, { "color": "#333333" ***REMOVED***, { "lightness": 40 ***REMOVED*** ] ***REMOVED***, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" ***REMOVED*** ] ***REMOVED***, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#f2f2f2" ***REMOVED***, { "lightness": 19 ***REMOVED*** ] ***REMOVED***, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [ { "color": "#fefefe" ***REMOVED***, { "lightness": 20 ***REMOVED*** ] ***REMOVED***, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "color": "#fefefe" ***REMOVED***, { "lightness": 17 ***REMOVED***, { "weight": 1.2 ***REMOVED*** ] ***REMOVED*** ],
            navigationControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
    ***REMOVED***;
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        if (geocoder) {
            geocoder.geocode({
                'address': address
          ***REMOVED*** function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                        map.setCenter(results[0].geometry.location);

                        var infowindow = new google.maps.InfoWindow({
                            content: '<b>' + address + '</b>',
                            size: new google.maps.Size(150, 50)
                    ***REMOVED***);

                        var marker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            title: address,
                            icon: {
                              url: markerUrl,
                              scaledSize: new google.maps.Size(47, 71)
                        ***REMOVED***
                    ***REMOVED***);
                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.open(map, marker);
                    ***REMOVED***);

                ***REMOVED*** else {
                        console.log("+++");
                ***REMOVED***
            ***REMOVED*** else {
                  console.log("Status: " + status);
                    
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
***REMOVED***
    google.maps.event.addDomListener(window, 'load', initialize);
***REMOVED***