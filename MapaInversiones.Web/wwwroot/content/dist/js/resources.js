/*global PERIODS_LIST, define, doT*/
define([
		'app/network/Services', 
		'app/utils/Modal',
		'app/project/ListManager',
		'app/utils/MailSharer',
		'utils/beta'
	], function(
		Services, 
		Modal,
		ListManager
	){
	var	budgetarticle = $('.budget-article'),
		main = $('.main-budget'),
		years = $('.years'),
		templates = {
			presupuesto: doT.compile(document.getElementById('template-presupuesto').innerHTML),
			generic: doT.compile(document.getElementById('template-general').innerHTML),
			aproved: doT.compile(document.getElementById('template-aproved').innerHTML),
			regalias: doT.compile(document.getElementById('template-regalias').innerHTML)
		},
		periodIndex = ( PERIODS_LIST.indexOf((new Date()).getFullYear()+'') ) == -1 ?
			0 : PERIODS_LIST.indexOf((new Date()).getFullYear()+''),//PERIODS_LIST.length - 1,
		maxPeriod = PERIODS_LIST.length - 1,
		minPeriod = 0,
		titlesCache = {},
		textsCache = {},
		periodTitle = $('.title-bidget .period'),
		periodsElements = $('.top-resources .period'),
		topResources = $('.top-resources'),
		modal = Modal.info('No hay más periodos disponibles'),
		requestPending = 0,
		paramsReq = location.href.split(/\?/)[1] || '',
		paramReqRegexp = paramsReq.match(/period[^=]+/),
		periodParamName = paramReqRegexp ? paramReqRegexp[0] : 'periodosRecursos',
		extraParams = location.href.replace(/[^?#]+/, '')
			.replace(/[#?]|(&?period[^=]+=(\d+\,?)+)/g, '')

	$('[href="/agenda"]').on('click', function(){
		Modal.info('Esta funcionalidad no está disponible').show()
		return false
	})
	
	String.prototype.toCurrency = Number.prototype.toCurrency

	// Social Share
	$('.social-share .fb').on('click', function(){
		openWindow('http://www.facebook.com/sharer.php?u=' +
			encodeURIComponent(window.location.href)+ '&t=' +
			encodeURIComponent(document.title) )
		return false
	})
	$('.social-share .tweet').on('click', function(){
		openWindow('https://twitter.com/intent/tweet?url=' +
			encodeURIComponent(window.location.href)+ '&text=' +
			encodeURIComponent(document.title) )
		return false
	})
	$('.social-share .print').on('click', function(){
		print()
		return false
	})

	/*jshint multistr: true */
	// $('.social-share .email').attr('href',
	// 	'mailto:amigo@email.com?\
	// 	subject=Sistema General de Regalías&\
	// 	body=Mira la ficha de recursos de ' + $('.project-info h2').html() + ' en '+
	// 	encodeURIComponent(window.location))

	function openWindow( url ){
		var leftPosition,
			topPosition,
			width = 400,
			height = 300,
			windowFeatures = 'status=no,height=' + height + ',width=' + width +
				',resizable=yes,left=' + leftPosition + ',top=' + topPosition +
				',screenX=' + leftPosition + ',screenY=' + topPosition +
				',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no'

		leftPosition = (window.screen.width / 2) - ((width / 2) + 10)
		topPosition = (window.screen.height / 2) - ((height / 2) + 50)
		window.open( url ,'sharer', windowFeatures )
	}
	
	budgetarticle.on('click', '.details a, .less-details a', function(evt){
		var that = $(this),
			next = that.parent().next().next();
			next.slideToggle();
			that.toggleClass('details');
			that.toggleClass('less-details');
			if( that.hasClass('less-details') ){
				that.html('Ocultar');
			}else{
				that.html('Ver mas');
			}
		return false
	});

	main.on('click', '.more, .less', function(evt){
		var that = $(this),
			next = that
					.parent()
					.parent()
					.next();
		next.slideToggle();
		that.toggleClass('more');
		that.toggleClass('less');
		if( that.hasClass('less') ){
			that.text('Ver menos');
		}else{
			that.text('Ver por mes');
		}
		return false
	});
	
	main.on( 'click', '.font-source' ,function(){
		setTimeout(function(){
			$('.info').css('background-color','#FAF5C3')
		}, 700)
		$('html, body').animate({scrollTop: $('.info').offset().top - 80
			}, 400, function(){
				setTimeout(function(){
				$('.info').css('background-color','#FFFFFF')
			}, 1200)
		})
	});

	years.on('click', function(){
		var isNext = this.getAttribute('data-direction') === 'next'
		if(isNext && periodIndex < maxPeriod){
			++periodIndex
			requestAll()
			scrollToBar()
		}else if(!isNext && periodIndex > minPeriod){
			--periodIndex
			requestAll()
			scrollToBar()
		}else{
			modal.show()
		}
		return false
	})

	periodsElements.on('click', function(){
		var thisIndex = this.getAttribute('data-period-index')
		
		if( thisIndex == periodIndex ) return false
		periodIndex = thisIndex

		requestAll()
		scrollToBar()
		return false
	})

	budgetarticle.each(function( index, elem ){
		var $elem = $(elem),
			type = elem.getAttribute('data-type')
		textsCache[ type ] = $elem.find('.text').html()
		titlesCache[ type ] = $elem.find('.name-type').html()
	})

	requestAll()

	function scrollToBar(){
		// $('html, body').animate({
		// 	scrollTop: topResources.offset().top
		// })
	}
	function requestAll(){
		var period = PERIODS_LIST[ periodIndex ]
		periodsElements.removeClass('selected')
		periodsElements[ periodIndex ].className += ' selected'
		periodTitle.html( period )
		maskPosition(topResources, true)
		for( var url in Services.resources ){
			requestPending++
			requester( url, period )
		}
	}

	function requester(id, year){
		var element = $('#budget-article-'+id);
		maskPosition(element);
		Services.resources[id]( periodParamName + '=' + year + extraParams )
			.done(function(data){
				templatedata(data, id)
			})
	}

	function templatedata(data, id){
		data.description = textsCache[id]
		data.type = titlesCache[id]

		if(id == 'presupuesto' || id == 'rendimiento'){
			data.isBold = true
			$('#budget-article-'+id).html(templates.presupuesto(data));
			$('#presupuesto-total').html(data.ResumenRecursos[0].ValorTotalPeriodo.toCurrency())
		}else if(id == 'aprobado'){
			$('#budget-article-'+id).html(templates['aproved'](data));
		}else if(id == 'ejecutado'){
			$('#budget-article-'+id).html(templates['presupuesto'](data));
		}else if(id == 'valorAprobado'){
			$('#budget-article-valorAprobado').html(templates['presupuesto'](data));
			$('#presupuesto-aprobado').html(data.ResumenRecursos[0].ValorTotalPeriodo.toCurrency())
		}else if(id == 'regalias'){
			data.ResumenRecursos = data.ResumenLiquidacion
			$('#budget-article-regalias').html(templates['regalias'](data))

		}else{
			$('#budget-article-'+id).html(templates['generic'](data));
		}
		
		if( $('#budget-article-'+id).data('mask') )
			$('#budget-article-'+id).data('mask').fadeOut(function(){
				$(this).remove()
			})

		requestPending--
		if( !requestPending ){
			topResources.data('mask').fadeOut(function(){
				$(this).remove()
			})
		}
	}

	function maskPosition(element, noLoader){
		if( !element.length ) return
		var maskElem = $('<div class="mask"><div class="bg"></div>' +
				( !noLoader ? '<div class="icon"></div>' : '' ) +'<div>'),
			position = element.offset(),
			Wmask = element[0].offsetWidth,
			Hmask = element[0].offsetHeight;

		maskElem.appendTo(document.body)
		maskElem.css({'width': Wmask, 'height': Hmask, 'left': position.left, 'top': position.top})
		element.data('mask', maskElem)
	}

	// Template Functions
	window.calculatePercent = function( total, val ){
		var percent = ( val/total ) * 100
		return percent.toFixed(2)
	}
	window.calculateFill = function( total, val ){
		var percent = calculatePercent( total, val )
		percent = percent > 100 ? 100 : percent
		return percent
	}
})
