/*global PERIODS_LIST, define, doT*/
define([
		'app/network/Services', 
		'app/network/UrlsMap', 
		'app/utils/Modal',
		'app/project/ListManager',
		'app/utils/MailSharer',
		'utils/beta'
	], function(
		Services, 
		Urls,
		Modal,
		ListManager

	){
		'use strict';

		var details = $('.more-details').children(),
		tables = $('.table'),
		months = $('option-month'),
		root = Urls.root,
		$containerYears = $('.container-years'),
		$yearPrev = $('.years[data-direction="prev"]'),
		$yearNext = $('.years[data-direction="next"]'),
		totalPeriodo = $('.container-years .period').length,
		$areaIinfoPeriods = $(".area-info-periods"),
		$navPag = $(".nav-pag"),
		GetActividadesFiscalizacion = Urls.actividadesFiscalizacion,
		left = 0,
		infoLeft = 0,
		periodWidth = 485,
		infoPeriodWidth = 494,
		parameters = '',
		tipoRecursoNaturalFiscalizacion= getQueryVariable('tipoRecursoNaturalFiscalizacion'),
		campoProyectoFiscalizacion= getQueryVariable('campoProyectoFiscalizacion'),
		//parameters_tet = '?municipio=05002&departamento=05&region=05&periodosFiscalizacion=2012&recursoNaturalFiscalizacion=39&tipoFiscalizacion=1&query=A',
		dataFicha,
		tmpFiscalizacionFicha,
		tmpFiscalizacionFichaPag;

	$('.main-nav ul a').removeClass('selected')
	$('.main-nav ul a.fiscalizacion').addClass('selected')


	debugger;


	$containerYears.css('left', (-(totalPeriodo-2)*periodWidth))
	$areaIinfoPeriods.css('left', (-(totalPeriodo-2)*infoPeriodWidth))

	left = parseInt($containerYears.css('left'))
	infoLeft = parseInt($areaIinfoPeriods.css('left'))

	$yearNext.on('click',function(e){
		e.preventDefault()


		if(-((totalPeriodo-3)*periodWidth) <= left) {
			$yearNext.show()
			$yearPrev.show()

			left -= periodWidth,
			infoLeft -= infoPeriodWidth,

			$containerYears.animate({
				left: left
			***REMOVED***)
			$areaIinfoPeriods.animate({
				left: infoLeft
			***REMOVED***)


		***REMOVED***else{
			$yearNext.hide()
		***REMOVED***

	***REMOVED***)

	$yearPrev.on('click',function(e){
		e.preventDefault()

		if(left < 0 ) {
			$yearNext.show()

			left += periodWidth,
			infoLeft += infoPeriodWidth,

			$containerYears.animate({
				left: left
			***REMOVED***)
			$areaIinfoPeriods.animate({
				left: infoLeft
			***REMOVED***)

		***REMOVED***else{
			$yearPrev.hide()
		***REMOVED***

	***REMOVED***)

	
	tables.toggle(function(){
		$(this).addClass('table-hide')
	***REMOVED***)


	$(document).on('click', '.more-details', function(){
		var that = $(this),
			actual = that.parent(),
			table = that.siblings('.table')

		if(actual.hasClass('no-fiscalizada')){return***REMOVED***

		if(actual.hasClass('show-specific')){
			table.slideToggle(function(){
				actual.removeClass('show-specific')
				actual.addClass('hide-specific')
				that.removeClass('hide')
				that.addClass('show')
				that.children().text('mostrar')
			***REMOVED***)
		***REMOVED***else{
			actual.removeClass('hide-specific')
			actual.addClass('show-specific')

			table.slideToggle(function(){
				that.removeClass('show')
				that.addClass('hide')
				that.children().text('ocultar')
			***REMOVED***)
		***REMOVED***
	***REMOVED***)


	$(document).on('click', '.option-month', function(){
		var elemShow = '.'+$(this).attr('data-months'),
			elemSelected = '.'+$(this).attr('data-level')

		$(this).parent().siblings(".selected").removeClass('selected')
		$(this).parent().addClass('selected')
		$(this).parent().removeClass('unselected')

		$(elemSelected).fadeOut(1,function(){
			$(elemSelected).removeClass('selected')
			$(elemSelected).addClass('unselected')
		***REMOVED***)
		$(elemShow).fadeIn(900, function(){
			$(elemShow).removeClass('unselected')
			$(elemShow).addClass('selected')
		***REMOVED***)
		return false
	***REMOVED***)

	
	$('.show-oversight li a[data-value="-1"]').addClass('active selected')

	 $(document).on('click', '.show-oversight li a', function(e){
	 	e.preventDefault();

	 	$('.show-oversight li a').removeClass('active selected')
	 	$(this).addClass('active selected')
	 	typefilters()

	 ***REMOVED***)


	// Periodos Years
	$(document).on('click', '.top-production .period', function(e){
		e.preventDefault();

		var years = $(this).text().replace(/\s/g, ''); 

		$('.top-production .period').removeClass('active selected')
		$(this).addClass('active selected')
		$('.oversight-data-years .years').removeClass('active selected')
		$('.oversight-data-years .years[data-perido="'+years+'"]').addClass('active selected')

		$('.group-categories').removeClass('active selected')
		$('.group-categories[data-period="'+years+'"]').addClass('active selected')


		typefilters()

	***REMOVED***)


	// Tipos Fiscalizacion
	$('.type-oversight h2').on('click', function(e){
		e.preventDefault();

		var text = $(this).text()

		if($(this).hasClass('active')){
			$(this).removeClass('active selected')
			$(this).next('ul').removeClass('active selected')
			$('.categories ul:not(".selected")').slideUp()

		***REMOVED***else{

			$('.type-oversight h2').removeClass('active selected')
			$(this).addClass('active selected')

			//console.log($(this))

			//$(this).toggleClass('active selected')
			//$(this).next('ul').slideToggle()

			$('.categories ul, .categories ul li').removeClass('active selected')
			$('.categories ul').removeClass('active selected')
			$(this).next('ul').addClass('active selected')
			$(this).next('ul li').first().addClass('active selected')

			$('.categories ul.selected').slideDown()
			$('.categories ul:not(".selected")').slideUp()
		***REMOVED***

		/*if(!$('.categories ul').hasClass('selected')){
		***REMOVED****/

		//$('.categories ul.categories-'+text).toggleClass('active selected')
		//$('.categories ul.categories-'+text+' li').first().toggleClass('active selected')
		
		//typefilters()
	***REMOVED***)

	// categorias
	$(document).on('click', '.categories ul li', function(){

		$('.categories ul li').removeClass('active selected')
		$('.search .a-z ul li a').removeClass('active selected')
		$(this).addClass('active selected')

		typefilters()

	***REMOVED***)




	//  A-Z
	$(document).on('click', '.search .a-z ul li a', function(e){
		e.preventDefault();
		var search = $('.search-box input[type="text"]');

		search.attr('value', '')
		$('.search .a-z ul li a').removeClass('active selected')
		$('.type-oversight .group-categories ul li').removeClass('active selected')
		$(this).addClass('active selected')
		typefilters()
	***REMOVED***)

	//Search 
	$(document).on('click', '.search-box .search-button', function(e){
		e.preventDefault();
		
		$('.search .a-z ul li a').removeClass('active selected')
		$('.type-oversight .group-categories ul li').removeClass('active selected')
	
	
		typefilters()
	***REMOVED***)



	// paginator
	$(document).on('click', '#paginator a.page', function(e){
		e.preventDefault()

		var $this = $(this),
			thisPag = $this.attr('data-pag');

		$('#paginator a.page').removeClass('active selected')

		//console.log('this-->', $this)
		$(this).addClass('active selected')

		typefilters($this)

	***REMOVED***)

	// tipoRecursoNaturalFiscalizacion

	$('.nav-optional-fis a[data-tiporecursonaturalfiscalizacion='+tipoRecursoNaturalFiscalizacion+']').addClass('active')

	$(document).on('click', '.nav-optional-fis a', function(e){
		e.preventDefault()

		var $this = $(this),
			thisTipo = $this.attr('data-tiporecursonaturalfiscalizacion');

		$('.nav-optional-fis a').removeClass('active selected')

		//console.log('this-->', $this)
		$(this).addClass('active selected')

		//window.location.search = window.location.search.replace('tipoRecursoNaturalFiscalizacion=-1', 'tipoRecursoNaturalFiscalizacion='+thisTipo)
		typefilters($this)

	***REMOVED***)


	var leftPag = 0, widthPag = 40;

	$(document).on('click', '.nav-pag', function(e){
		e.preventDefault()

		paginator($(this))
	
	***REMOVED***)

	function paginator(that) {
			var $this = that || $('.nav-pag .previous'),
			$pagsLink = $('.container-pags li');

			if($pagsLink.length <= 10){
				$('.nav-pag').hide()
				$('.container-pags').css('width', (widthPag*($pagsLink.length)))
			***REMOVED***else{
				$('.nav-pag').show()
			***REMOVED***

			//console.log($this)

			leftPag = parseInt($('.container-pags ul').css('left'))

			if($('.container-pags ul').is(':animated')) return false

			if($this.hasClass('previous')){

				leftPag += widthPag;

				if(leftPag > 1){
					leftPag = 0
					$this.hide()
				***REMOVED***else{
					$('.container-pags ul').animate({
						left: leftPag
					***REMOVED***)
				***REMOVED***

			***REMOVED***

			if($this.hasClass('next')){
				leftPag -= widthPag;

				if(leftPag < -(widthPag*($pagsLink.length-10))){
					$this.hide()
				***REMOVED***else{

					$('.container-pags ul').animate({
						left: leftPag
					***REMOVED***)
				***REMOVED***
				
			***REMOVED***

		***REMOVED***

	//$('.type-oversight h2').first().addClass('active selected')
	//$('.categories ul').first().addClass('active selected')
	$('.search-box input[type="text"]').val(getQueryVariable('query'))

	if(campoProyectoFiscalizacion){
		//debugger;
		$('.search-box input[type="text"]').val(campoProyectoFiscalizacion)
	***REMOVED***




	//debugger;
	var lengthPeriod = $('.top-production .period').length,
		recursoNaturalFiscalizacion = getQueryVariable('recursoNaturalFiscalizacion'),
		period; 

	if(getQueryVariable('periodosFiscalizacion')){
		period = getQueryVariable('periodosFiscalizacion');
	***REMOVED***else{
		period = $('.top-production .period').eq(lengthPeriod-2).text();
		
	***REMOVED***

	if(recursoNaturalFiscalizacion){

		$('.top-production .period').removeClass('active selected')

		$('.top-production .period[data-period-index="'+period+'"]').addClass('active selected')
		$('.group-categories[data-period="'+period+'"]').addClass('active selected')

		$('.type-oversight .group-categories.active h2').trigger('click')
		$('.type-oversight .group-categories.selected ul li[data-codigo="'+recursoNaturalFiscalizacion+'"]').trigger('click')

	***REMOVED***else{

		$('.top-production .period[data-period-index="'+period+'"]').trigger('click')//.addClass('active selected')
	***REMOVED***

	//$('.top-production .period').removeClass('active selected')
	//$('.nav-pag .previous').trigger('click')


	//debugger;

	function getfilterFichaFiscalizacion( url, data, dot ){

		var request = {***REMOVED***,
		requestTest,
		searchDot = dot;

		var request = $.ajax({
		url: url,
		//data: data,
		settings: {/*cache: _factoryCache(url,data)*/***REMOVED***

		***REMOVED***).done(
			function(data){
				//console.log('url--->', url, 'request -->', data.Detalles)
				dataFicha = data;
				//dataFicha = {   "Detalles": [ {  "NombreMina": "006-85M",  "TotalFiscalizaciones": 1, "Fiscalizaciones": []  ***REMOVED***  ],  "TotalPaginas": 1,   "status": true,    "message": null***REMOVED***

				tmpFiscalizacionFicha = doT.compile($('#template-ficha-fiscalization')[0].innerHTML);
				tmpFiscalizacionFichaPag = doT.compile($('#template-ficha-fiscalization-pag')[0].innerHTML);

				var resumenConsulta = data.ResumenConsulta

				var cantidadMinasFiscalizadas = resumenConsulta.CantidadMinasFiscalizadas;
				var cantidadMinasHidrocarburos = resumenConsulta.CantidadMinasHidrocarburos;
				var cantidadMinasMinerales = resumenConsulta.CantidadMinasMinerales;
				var cantidadMinasNoFiscalizadas = resumenConsulta.CantidadMinasNoFiscalizadas;
				var cantidadTotalMinas = resumenConsulta.CantidadTotalMinas;

				var percentNoFiscalizadas = Math.round((cantidadMinasNoFiscalizadas / cantidadTotalMinas ) *100) || 0;
				var percentFiscalizadas = Math.round((cantidadMinasFiscalizadas / cantidadTotalMinas ) *100) || 0;

				$('.type-oversight h2 a[data-codigo="H"] .count-minas b').text(cantidadMinasHidrocarburos)
				$('.type-oversight h2 a[data-codigo="M"] .count-minas b').text(cantidadMinasMinerales)

				$('.response-info-totalminas .total-no-fiscalizados .reponse-minas i').text(percentNoFiscalizadas)
				$('.response-info-totalminas .total-fiscalizados .reponse-minas i').text(percentFiscalizadas)

				$('.response-info-totalminas .total-resultados .reponse-minas b').text(cantidadTotalMinas)
				$('.response-info-totalminas .total-no-fiscalizados .reponse-minas b').text(cantidadMinasNoFiscalizadas)
				$('.response-info-totalminas .total-fiscalizados .reponse-minas b').text(cantidadMinasFiscalizadas)

				if(dataFicha.Detalles == 0 ){
					if(dataFicha.message == null) dataFicha.message = 'Cero Registros Encontrados';
					document.getElementById('paginator').innerHTML = ''
					return document.getElementById('make-info-table').innerHTML = "<h1 class='request-message'>"+ dataFicha.message +"</h1>"

				***REMOVED***

				if(!searchDot){
					document.getElementById('paginator').innerHTML = tmpFiscalizacionFichaPag(dataFicha);
					document.getElementById('make-info-table').innerHTML = tmpFiscalizacionFicha(dataFicha);
					$('#paginator a.page').first().addClass('active selected')
					paginator($('.nav-pag .previous'))
				***REMOVED***else{

					document.getElementById('make-info-table').innerHTML = tmpFiscalizacionFicha(dataFicha);

				***REMOVED***

			***REMOVED***
		)

		//if(callback) request.done(callback)

		return request

	***REMOVED***

        
	function typefilters(that){
		var querystring ='?',
		$search =  $('.search-box input[type="text"]'),
		$this = $(that),
		//recursoNaturalFiscalizacion = getQueryVariable('recursoNaturalFiscalizacion'),


		parameters = {
			municipio : getQueryVariable('municipio') ,
			departamento : getQueryVariable('departamento'),
			region : getQueryVariable('region'),
			//tipoRecursoNaturalFiscalizacion : getQueryVariable('tipoRecursoNaturalFiscalizacion'),
			tipoRecursoNaturalFiscalizacion : $('.nav-optional-fis a.active').attr('data-tiporecursonaturalfiscalizacion'),
			periodosFiscalizacion : $('.top-production .period.selected').text(),
			//tipoRecursoNaturalFiscalizacion : $('.type-oversight h2.selected a').attr('data-codigo'),
			recursoNaturalFiscalizacion : getQueryVariable('recursoNaturalFiscalizacion'),
			//recursoNaturalFiscalizacion : $('.type-oversight .group-categories.selected ul li.active').attr('data-codigo'),
			tipoFiscalizacion : $('.show-oversight li a.active').attr('data-value'),
			query:  getQueryVariable('query'),
			etapaCampo:  getQueryVariable('etapaCampo'),
			page: $('#paginator a.active').attr('data-pag'),
		***REMOVED***;

		if($('.search .a-z ul li a').hasClass('active')){
			parameters.query = $('.search .a-z ul li a.active').attr('data-find')
			parameters.recursoNaturalFiscalizacion = ''
		***REMOVED***

		if($search.val() != ''){
			parameters.query = $search.val()
			parameters.recursoNaturalFiscalizacion = ''
		***REMOVED***
		if(!$this.attr('data-pag')){
			parameters.page = 1
		***REMOVED***
		if(!parameters.tipoRecursoNaturalFiscalizacion){
			debugger;
		***REMOVED***

		if( $('.type-oversight .group-categories.selected ul li').hasClass('active')){
			parameters.recursoNaturalFiscalizacion = $('.type-oversight .group-categories.selected ul li.active').attr('data-codigo')
		***REMOVED***

		//console.log(parameters)

		//debugger;
		
		$.each(parameters, function(key, val){

			if(val != undefined && val != ''){
				querystring += key + '=' + val + '&'
			***REMOVED***
			
		***REMOVED***)

		$('.wrap-content-ficha').attr('data-modo-subtipo', parameters.tipoRecursoNaturalFiscalizacion)

		//console.log(querystring);

		if($this.attr('data-pag')){
			getfilterFichaFiscalizacion( root+GetActividadesFiscalizacion+querystring,  null, 'no-dot-search');
		***REMOVED***else{

			getfilterFichaFiscalizacion( root+GetActividadesFiscalizacion+querystring);
		***REMOVED***

		//console.log(parameters, querystring /*municipio, departamento, region, periodosFiscalizacion, recursoNaturalFiscalizacion, tipoFiscalizacion, query*/)

	***REMOVED***


	function getQueryVariable(variable) {

	    var query = window.location.search.substring(1);
	    var vars = query.split('&');
	    for (var i = 0; i < vars.length; i++) {
	        var pair = vars[i].split('=');
	        if (decodeURIComponent(pair[0]) == variable) {
	        	//console.log(decodeURIComponent(pair[1]));
	            return decodeURIComponent(pair[1]);
	    ***REMOVED***
	***REMOVED***

	***REMOVED***

	//getQueryVariable('departamentos');


	/*var periodos_ficha = $('body').attr('data-periodos-ficha');
	var resumenporperiodo_ficha = $('body').attr('data-resumenporperiodo-ficha');
	var recursosfiscalizacion_ficha = $('body').attr('data-recursosfiscalizacion-ficha');
	var tiposdefiscalizacion_ficha = $('body').attr('data-tiposDeFiscalizacion-ficha');*/

***REMOVED***)
