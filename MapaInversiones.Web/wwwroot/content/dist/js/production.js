/*global PERIODS_LIST, define, doT*/
define([
		'app/network/urlsMap',
		'app/network/Services',
		'app/utils/Modal',
		'app/project/ListManager',
		'app/utils/MailSharer',
		'utils/beta'
	], function(
		urlsMap,
		Services,
		Modal,
		ListManager
	){
	var	main = $('.main-production'),
		years = $('.years'),
		templates = {
			productionInfo: doT.compile(document.getElementById('template-productionInfo').innerHTML),
			fieldInfo: doT.compile(document.getElementById('template-montlyRes').innerHTML),
			aproved: doT.compile(document.getElementById('template-aproved').innerHTML),
			resume: doT.compile(document.getElementById('template-production-resume').innerHTML)
		***REMOVED***,
		actualYear = typeof PERIODS_LIST[0] == 'string' ?
			(new Date()).getFullYear() + '' :
			(new Date()).getFullYear()
		periodIndex = ( PERIODS_LIST.indexOf( actualYear ) ) == -1 ?
			0 : PERIODS_LIST.indexOf( actualYear ),//PERIODS_LIST.length - 1,
		maxPeriod = PERIODS_LIST.length - 1,
		minPeriod = 0,
		titlesCache = {***REMOVED***,
		textsCache = {***REMOVED***,
		periodTitle = $('.main-title .period'),
		periodsElements = $('.top-production .period'),
		topResources = $('.top-production'),
		modal = Modal.info('No hay más periodos disponibles'),
		requestPending = 0,
		paramsReq = location.href.split(/\?/)[1] || '',
		paramReqRegexp = paramsReq.match(/period[^=]+/),
		periodParamName = paramReqRegexp ? paramReqRegexp[0] : 'periodosProduccion',
		extraParams = location.href.replace(/[^?#]+/, '')
			.replace(/[#?]|(&?period[^=]+=(\d+\,?)+)/g, ''),
		productionCopys = document.body.getAttribute('data-copys') || ''

	$('[href="/agenda"]').on('click', function(){
		Modal.info('Esta funcionalidad no está disponible').show()
		return false
	***REMOVED***)
	
	productionCopys = productionCopys.replace(/,$/,'')
	window.productionCopys = JSON.parse('{' + productionCopys + '***REMOVED***')

	String.prototype.toCurrency = Number.prototype.toCurrency

	// Social Share
	$('.social-share .fb').on('click', function(){
		openWindow('http://www.facebook.com/sharer.php?u=' +
			encodeURIComponent(window.location.href)+ '&t=' +
			encodeURIComponent(document.title) )
		return false
	***REMOVED***)
	$('.social-share .tweet').on('click', function(){
		openWindow('https://twitter.com/intent/tweet?url=' +
			encodeURIComponent(window.location.href)+ '&text=' +
			encodeURIComponent(document.title) )
		return false
	***REMOVED***)
	$('.social-share .print').on('click', function(){
		print()
		return false
	***REMOVED***)

	/*jshint multistr: true */
	$('.social-share .email').attr('href',
		'mailto:amigo@email.com?\
		subject=Sistema General de Regalías&\
		body=Mira la ficha de recursos de ' + $('.project-info h2').html() + ' en '+
		encodeURIComponent(window.location))

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
	***REMOVED***
	
	main.on('click', '.view-more', function(evt){
		var that = $(this),
			next = that.parent().next(),
			name = this.getAttribute('data-name'),
			id = this.getAttribute('data-id'),
			resname = this.getAttribute('data-name-res'),
			resid = this.getAttribute('data-id-res'),
			unit = this.getAttribute('data-unit')
		next.slideToggle()
		that.toggleClass('less-details')
		if( that.hasClass('less-details') ){
			that.html(this.getAttribute('data-off'));
		***REMOVED***else{
			that.html(this.getAttribute('data-on'));
		***REMOVED***

		if( !this.getAttribute('data-loaded') && id){
			this.setAttribute('data-loaded', 'loaded')
			loadMonthlyDataFor($(this).parent().next(), name, id, unit, resname, resid)
		***REMOVED***

		return false
	***REMOVED***);
	
	main.on( 'click', '.font-source' ,function(){
		setTimeout(function(){
			$('.info').css('background-color','#FAF5C3')
		***REMOVED***, 700)
		$('html, body').animate({scrollTop: $('.info').offset().top - 80
			***REMOVED***, 400, function(){
				setTimeout(function(){
				$('.info').css('background-color','#FFFFFF')
			***REMOVED***, 1200)
		***REMOVED***)
	***REMOVED***);

	years.on('click', function(){
		var isNext = this.getAttribute('data-direction') === 'next'
		if(isNext && periodIndex < maxPeriod){
			++periodIndex
			requestAll()
			scrollToBar()
		***REMOVED***else if(!isNext && periodIndex > minPeriod){
			--periodIndex
			requestAll()
			scrollToBar()
		***REMOVED***else{
			modal.show()
		***REMOVED***
		return false
	***REMOVED***)

	periodsElements.on('click', function(){
		var thisIndex = this.getAttribute('data-period-index')
		
		if( thisIndex == periodIndex ) return false
		periodIndex = thisIndex

		requestAll()
		scrollToBar()
		return false
	***REMOVED***)

	main.each(function( index, elem ){
		var $elem = $(elem),
			type = elem.getAttribute('data-type')
		textsCache[ type ] = $elem.find('.text').html()
		titlesCache[ type ] = $elem.find('.name-type').html()
	***REMOVED***)

	requestAll()

	function scrollToBar(){
		// $('html, body').animate({
		// 	scrollTop: topResources.offset().top
		// ***REMOVED***)
	***REMOVED***
	function requestAll(){
		var period = PERIODS_LIST[ periodIndex ]
		periodsElements.removeClass('selected')
		periodsElements[ periodIndex ].className += ' selected'
		periodTitle.html( period )
		maskPosition(topResources, true)
		for( var url in Services.production ){
			if( url != 'fieldInfo' ){
				requestPending++
				requester( url, period )
			***REMOVED***
		***REMOVED***
	***REMOVED***

	function requester(id, year){
		var element = $('#production-article-'+id);
		maskPosition(element);
		Services.production[id]( periodParamName + '=' + year + extraParams )
			.done(function(data){
				templatedata(data, id)
		***REMOVED***)
	***REMOVED***
	function templatedata(data, id){
		requestPending--
		data.description = textsCache[id]
		data.type = titlesCache[id]
		$('#production-article-'+id).html(templates[id](data))
		// if(id == 'presupuesto'){
		// 	data.isBold = true
		// 	$('#budget-article-'+id).html(templates[id](data));
		// 	$('#presupuesto-total').html(data.ResumenRecursos[0].ValorTotalPeriodo.toCurrency())
		// ***REMOVED***else if(id == 'aproved'){
		// 	$('#budget-article-'+id).html(templates['aproved'](data));
		// ***REMOVED***else if(id == 'valorAprobado'){
		// 	$('#budget-article-valorAprobado').html(templates['presupuesto'](data));
		// 	$('#presupuesto-aprobado').html(data.ResumenRecursos[0].ValorTotalPeriodo.toCurrency())
		// ***REMOVED***else if(id == 'regalias'){
		// 	data.ResumenRecursos = data.ResumenLiquidacion
		// 	$('#budget-article-regalias').html(templates['regalias'](data))

		// ***REMOVED***else{
		// 	$('#budget-article-'+id).html(templates['generic'](data));
		// ***REMOVED***
		if( id == 'productionInfo' ){
			$('#production-resume').html(templates.resume(data))
		***REMOVED***
		if( $('#production-article-'+id).data('mask') )
			$('#production-article-'+id).data('mask').fadeOut(function(){
				$(this).remove()
			***REMOVED***)

		if( !requestPending ){
			topResources.data('mask').fadeOut(function(){
				$(this).remove()
			***REMOVED***)
		***REMOVED***
	***REMOVED***

	function maskPosition(element, noLoader){
		if( !element.length ) return
		var maskElem = $('<div class="mask"><div class="bg"></div>' +
				( !noLoader ? '<div class="icon"></div>' : '' ) +'<div>'),
			position = element.offset(),
			Wmask = element[0].offsetWidth,
			Hmask = element[0].offsetHeight;

		maskElem.appendTo(document.body)
		maskElem.css({'width': Wmask, 'height': Hmask, 'left': position.left, 'top': position.top***REMOVED***)
		element.data('mask', maskElem)
	***REMOVED***

	function loadMonthlyDataFor(element, name, id, unit, resname, resid){
		var period = PERIODS_LIST[ periodIndex ],
			query = periodParamName + '=' + period + extraParams + '&' + name + '=' + id + '&' + resname + '=' + resid
		Services.production.fieldInfo( urlsMap.getFieldInfo, query )
			.done(function( data ){
				var quants = data.Detalles.map(function(it){return it.Cantidad***REMOVED***),
					values = data.Detalles.map(function(it){return it.ValorLiquidado***REMOVED***)
				data.maxQuantity = Math.max.apply(Math, quants) || 1
				data.maxValue = Math.max.apply(Math, values) || 1
				data.unit = unit
				element.html( templates.fieldInfo( data ) )
			***REMOVED***)
	***REMOVED***

	// Template Functions
	window.calculatePercent = function( total, val ){
		var percent = ( val/total ) * 100
		return percent.toFixed(2)
	***REMOVED***
	window.calculateFill = function( total, val ){
		var percent = calculatePercent( total, val )
		percent = percent > 100 ? 100 : percent
		return percent
	***REMOVED***
***REMOVED***)
