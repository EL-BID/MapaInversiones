/*
 * Scroll effect
 */
define([], function() {

	var $tabbed = $('.main-content__consolidated-tabbed'),
		$getTab = $('.main-content__type-filters__link')


	$getTab.click(function() {

		var $this = $(this),
			$target = $(this).attr('href');

		$tabbed.addClass('.show-tabbed')
		$('.main-content__consolidated-data').css({opacity: 1 zIndex: 10})//.addClass('show-tabbed')
			
		return false
	});


})