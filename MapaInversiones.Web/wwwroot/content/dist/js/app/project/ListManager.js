/*global define, ko, doT*/
define(['../network/Services'], function( Services ){
	
	function ListView(){
		var self = this

		this.root = $('#projects-list-view')
		this.root.find('.close').on('click', this.hide.bind(this))
		this.root.on('click', '.back', this.hide.bind(this))
		this.root.find('.projects-list-view-inner').on('click', function( evt ){
			if( evt.target.tagName !== 'A' )
				return false
		***REMOVED***)
		this.projects = ko.observableArray([])

		// AppState.on('projects-list-loaded', this.projectsListLoaded.bind(this))
		this.root.find('.pagination').on('click', 'a', loadPage)
		this.root.find('.back').on('click', this.toMapMode)
		this.pages = ko.observableArray([])
		this.actual = 1

		this.loading = ko.observable(false)

		$(document).on('click', '[data-projects-list]', this.getProjectsList.bind(this))

		function loadPage(){
			// AppState.setPage( this.getAttribute('data-page') )
			self.actual = this.getAttribute('data-page')
			self.requestProyectsList()
			return false
		***REMOVED***
	***REMOVED***

	ListView.prototype.pageNumberTempl = doT.compile('<a href="#" class="{{? it.active***REMOVED******REMOVED***active{{?***REMOVED******REMOVED***" data-page="{{=it.page***REMOVED******REMOVED***">{{=it.page***REMOVED******REMOVED***</a>')


	ListView.prototype.getProjectsList = function( evt ){
		this.url = evt.target.getAttribute('data-projects-list')
		this.actual = 1
		this.root.find('.pagination').html('')
		this.requestProyectsList()
		this.show()
		return false
	***REMOVED***

	ListView.prototype.requestProyectsList = function( ){
		this.loading(true)
		this.projects( [] )
		Services.projectsList( this.url + '&Pagina=' + this.actual )
			.done(this.projectsListLoaded.bind(this))
	***REMOVED***

	ListView.prototype.projectsListLoaded = function( data ){
		this.projects( data.Proyectos )
		this.loading(false)
		//data.page_number
		//data.total_pages
		this.pages([])
		this.drawPages(+ data['Pagina'], + data['TotalPagina'])
		// $('html, body').animate({
		// 	scrollTop: this.root.offset().top
		// ***REMOVED***, 300);
	***REMOVED***

	ListView.prototype.toMapMode = function(){
		// AppState.setListMode( false )
		// return false
	***REMOVED***

	ListView.prototype.drawPages = function( actual, total ){
		var pagesHTML = '',
			i,
			SOMA1 = 15,
			SOMA2 = 5

		this.actual = actual

		if( actual > 1 ){
			pagesHTML += '<a class="prev" href="#" data-page="' +
				(actual-1) + '">&lt;</a>'
		***REMOVED***
		if( total < SOMA1 ){
			for( i = 1; i<=total; i++ ){
				pagesHTML += this.pageNumberTempl({page: i, active: i==actual***REMOVED***)
			***REMOVED***
		***REMOVED***else{
			for( i = 1; i < SOMA2; i++ ){
				pagesHTML += this.pageNumberTempl({page: i, active: i==actual***REMOVED***)
			***REMOVED***
			if( actual > SOMA2 + 1 && actual < total - SOMA2 ){
				pagesHTML += '...'
				pagesHTML += this.pageNumberTempl({page: actual - 1, active: i==actual***REMOVED***)
				pagesHTML += this.pageNumberTempl({page: actual, active: true***REMOVED***)
				pagesHTML += this.pageNumberTempl({page: actual + 1, active: i==actual***REMOVED***)
				pagesHTML += '...'
			***REMOVED***else{
				if( actual < total - SOMA2 ){
					for( i = SOMA2; i<=SOMA2 + 2; i++ ){
						pagesHTML += this.pageNumberTempl({page: i, active: i==actual***REMOVED***)
					***REMOVED***
					pagesHTML += '...'
				***REMOVED***else{
					pagesHTML += '...'
					for( i = total-7; i<=total-SOMA2+1; i++ ){
						pagesHTML += this.pageNumberTempl({page: i, active: i==actual***REMOVED***)
					***REMOVED***

				***REMOVED***
			***REMOVED***
			for( i = total - SOMA2 + 2; i<=total; i++ ){
				pagesHTML += this.pageNumberTempl({page: i, active: i==actual***REMOVED***)
			***REMOVED***
		***REMOVED***

		if( actual < total ){
			pagesHTML += '<a class="next" href="#" data-page="' +
				(actual+1) + '">&gt;</a>'
		***REMOVED***

		this.root.find('.pagination').html(pagesHTML)
	***REMOVED***
	ListView.prototype.show = function(){
		$('html').css('overflow', 'hidden')
		// document.body.appendChild(this.modal)
		// this.root.style.display = 'block'
		this.root.fadeIn()
	***REMOVED***
	ListView.prototype.hide = function(event){
		var target = event.target,
			href = target.getAttribute('href')
		$('html').css('overflow', 'visible')
		this.root.fadeOut()
		// document.body.removeChild(this.modal)
		if( href && 
			href.length < 10 ) 
				return false
	***REMOVED***
	ListView.prototype.load = function(){

	***REMOVED***

	var lv = new ListView()
	ko.applyBindings(lv, lv.root[0])
***REMOVED***)