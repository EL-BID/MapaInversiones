/*
 * Scroll effect
 */
define(['../utils/beta'], function() {
	var $root = $('html, body')
	$('.menu a').click(function() {
		var href = $(this).attr('href')
		$(this).parents('ul').find('.active').removeClass('active')
		$(this.parentNode).addClass('active')
		if( $(href).offset() ){
			$root.animate({
				scrollTop: $(href).offset().top - 63
			}, 600, function () {
				window.location.hash = href
			})
		}
		return false
	})
})