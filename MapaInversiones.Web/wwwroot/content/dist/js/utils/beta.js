define([
		'app/utils/Modal'
	],
	function( Modal ){
	var notif = $('.beta-notification'),
		header = notif.find('.beta-notification__header'),
		close = notif.find('.close-notification'),
		desc = notif.find('.beta-notification__description')

	header.on('click', toggleDescription)
	close.on('click', toggleDescription)

	function toggleDescription(){
		desc.slideToggle()
		header.toggleClass('open')
	}

	$(document)
		.on('mouseenter', '.tooltip', function(){
			$('.info-tool', this).fadeIn('fast')
		})
		.on('mouseleave', '.tooltip', function(){
			$('.info-tool', this).fadeOut('fast')
		})

	var modal = new Modal('<iframe src="//player.vimeo.com/video/98644859?portrait=0&amp;badge=0" width="700" height="410" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>');
	//style = modal.getElement().style

	//style.width = 700
	//style.height = 410

	$('.get-video-regalias').on('click', function(){
		modal.show()	
		$('.modal .wrapper').css('width', 700)
	})


	var $tabbed = $('.main-content__consolidated-tabbed'),
		$getTab = $('.main-content__type-filters__link')


	$getTab.click(function() {

		var $this = $(this),
			href = $(this).attr('href');

	if(href == "#/fiscalizacion"){
		$tabbed.fadeIn()//.addClass('show-tabbed')

	}else{
		$tabbed.fadeOut()//.addClass('show-tabbed')

	}
			
		return false;
		
	});


})