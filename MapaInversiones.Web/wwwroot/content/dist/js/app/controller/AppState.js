/*global define, Class, Router, doT, Microsoft*/
/**
 * App State
 * This Class handles all the state syncronization between
 * all the entities of the application, and the services
 * negotiation
 */
define([
	'lib/mvc/Observable',
	'app/network/Services',
	// Available application states
	'./appStates',
	'app/utils/Modal'
	], function(
		Observable,
		Services,
		appStates,
		Modal
	){

	var filtersCleared = false,
		ignoreHash = false,
		// , historyPush = !!(window.history && window.history.pushState),
		infoTemplate = doT.compile('<div class="info"><h1>Información</h1><p>{{=it.message***REMOVED******REMOVED***</p>'+
			'<div class="txt-right"><a class="button close">Cerrar</a></div></div>'),
		// This is for the selection of a territory
		// Bing Animation is not cancelable so I had to set this
		// ugly flag
		ignoreNextFilter = false,
		skipNextZoom,
		skipNextCorners,
		// Another ugly flag to ignore url overwriting when setting filter
		resentlyChangedState,
		lastRequestedQuery,
		filtersSettedByString = false,
		ignoreWeAreReseting = false,
		DEBUG_MODE = !!$(document.body).attr('data-debug')

	// UPDATE URL
	// PARSE URL
	// NOTIFY


	/**
	 * Returns the state from a hash
	 * @param  {String***REMOVED*** hash from history
	 * @return {Atring***REMOVED***      valid state
	 */
	function getStateForHash( hash ){
		var i = appStates.length,
			key,
			index
		for(; i--;){
			key = appStates[i]
			index = hash.indexOf( key.toLowerCase() )
			if( index == 2 ){
				return key
			***REMOVED***
		***REMOVED***

		return ''//appStates[0]
	***REMOVED***
	

	function areNotSameCorners( corners, corners2 ){
		if( corners === null && corners2 !== null ||
			corners2 === null && corners !== null ){
			return true
		***REMOVED***
		return !( corners[0][0] == corners2 [0][0] &&
				corners[0][1] == corners2 [0][1] &&
				corners[1][0] == corners2 [1][0] &&
				corners[1][1] == corners2 [1][1] )
	***REMOVED***


	$('#share p').on('click', function(){
		///hideShow()
		$('#share .container-share').add($(this)).toggleClass('show')
	***REMOVED***)

	var AppState = new Class( Observable, {
		// Request params
		zoom: 7, // 1,..,n
		//corners: [[12.907166580077373,-90.494580078125],[4.336511704028766,-64.852490234375]], // [[4.667292,-74.059508], [4.667292,-74.059508]]
		center: [-23.629767732421044,-61.01276855468749],
		defaultCenter: [-23.629767732421044,-61.01276855468749],
		filters: null, //"departamento=1,2&estado=1"
		query: '',
		// Whether the request is directed to the list mode
		isListMode: null,
		// Request flags
		timeout: null,
		firstTime: true,
		cachedRequest: null,
		cachedRequest2: null,
		cachedCorners: null,
		state: '',
		defaultState: '',
		//-----------------------------------
		// TODO ALL LOGIC
		//-----------------------------------
		lastHash: '',

		initialize: function(){
			var router = new Router(),
				self = this,
				// hash = window.location.hash,
				lambda = function() {***REMOVED***

			// router.historyList = []


			
			if(!location.hash) location.hash = '#/'

			router.configure({
				// Detects all history changes
				// and decides what to do
				on: function on(){
					// console.log( 'herreee+++++++++++++++++++++++++' )
					// Ignores the first call
					if(self.firstTime){
						self.firstTime = false
						return
					***REMOVED***
					// If the location is different is
					// because it was fired by history
					// and needs to be interpreted into filters
					if( self.lastRequestedUrl !== location.hash ){
						self.parseUrl()
					***REMOVED***
				***REMOVED***
			***REMOVED***)

			router.on(/\/(proyectos|recursos|produccion|fiscalizacion|(\?.+)?)/, function(){
				if(location.hash.match(/\?.+/)){
				***REMOVED***else{
					self.setListMode( false, false, false )
					self.ignoreWeAreReseting()
				***REMOVED***

				// self.fireEvent('redraw-all')
				// self.state = ''
				// self.fireEvent('filter-reseted')
			***REMOVED***)

			//debugger;

			router.on(/proyectos.*/, lambda)
			router.on(/recursos.*/, lambda)
			// if( DEBUG_MODE ) 
			router.on(/produccion.*/, lambda)
			router.on(/fiscalizacion.*/, lambda)
			// else router.on(/produccion.*/, function(){
			// 	if( history in window) history.back()
			// 	else window.location.hash = '/proyectos'
			// 	var modal = new Modal(infoTemplate({ message:
			// 			'Esta funcionalidad se encuentra en construcción <br /><br />'
			// 		***REMOVED***))
			// 	modal.show()
			// ***REMOVED***)

			this.on('state-change', updateStateMode)

			function updateStateMode( state ){
				var $stateName = $('#state-name'),
					name = state
				if( state == 'Fiscalizacion' ){
					name = 'Fiscalización'
				***REMOVED***else if( state == 'Produccion' ){
					name = 'Producción'
				***REMOVED***
				if( state ){
					// quitar landing mode
					$('.map-container').removeClass('home-mode')
					$stateName
						.text( name )
						.next()
						.text($stateName.attr('data-tooltip-' +
							state.toLowerCase()))
						.parent().show()

				***REMOVED***else{
					// agregar landing mode
					$stateName.parent().hide()
					$('.map-container').addClass('home-mode')
				***REMOVED***
			***REMOVED***

			this.state = getStateForHash( location.hash )
			updateStateMode( this.state )

			router.init()
			// console.log('after')

		***REMOVED***,

		ignoreWeAreReseting: function(){
			ignoreWeAreReseting = true
			setTimeout(function(){
				ignoreWeAreReseting = false
			***REMOVED***, 1500)
		***REMOVED***,

		parseUrl: function( event ){
			var params,
				paramName,
				value,
				zoomValue,
				tl, br,
				tlArr, brArr,
				zoomChanged,
				cornersChanged,
				newState = getStateForHash( location.hash ),
				view = {***REMOVED***,
				appStateView = {***REMOVED***,
				isGroup = false,
				isList = false,
				center = this.center

			
			// Read the url for params
			params = location.hash.match(/\?.+/)
			this.lastRequestedUrl = location.hash

			if( event == 'filtersLoaded' && !newState && !location.hash.match(/\?.+/) ) return

			if( !filtersSettedByString ) this.fireEvent('filter-reseted', true, true)
			if( params ){
				params = params[0].substr(1).split('&')
				params = typeof params == 'string' ? [params] : params
				// console.log('params...'+location.hash)
				for(var i=0, pair; i<params.length; i++){
					pair = params[i].split('=')
					paramName = pair[0]
					value = pair[1]
					// console.log(paramName)
					// console.log(value)
					// console.log(filtersSettedByString)
					// urlObj[paramName] = value
					if(paramName == 'zoom'){
						zoomValue = value
					***REMOVED***else if(paramName == 'center'){
						center = value.split(',')
						tlArr = params[i+1].split('=')[1].split(',')
						brArr = params[i+2].split('=')[1].split(',')
						tl = new Microsoft.Maps.Location(
							tlArr[0],
							tlArr[1]),
						br = new Microsoft.Maps.Location(
							brArr[0],
							brArr[1])
						i+=2
					***REMOVED***else if(paramName == 'topLeft'){
						// I suppose it will always come in this order
						tlArr = value.split(',')
						brArr = params[i+1].split('=')[1].split(',')
						tl = new Microsoft.Maps.Location(
							tlArr[0],
							tlArr[1]),
						br = new Microsoft.Maps.Location(
							brArr[0],
							brArr[1])
						//Captured the next, so go on
						i++
					***REMOVED***else if( paramName == 'listMode' ){
						isList = true
					***REMOVED***else if( paramName == 'isGroup' ){
						isGroup = true
					***REMOVED***
					else if( value && !filtersSettedByString ){
						this.fireEvent('filter-activated', paramName, value.split(','))
					***REMOVED***
				***REMOVED***

				this.setListMode( isList, isGroup, false )
				filtersSettedByString = false

				// console.log(JSON.stringify(center), JSON.stringify(this.center))
				// Override filters localization and use the parameters values
				zoomChanged = ( this.zoom != zoomValue )
				cornersChanged = ( center[0] != this.center[0] || center[1] != this.center[1] ) ||
					tlArr && brArr && areNotSameCorners( this.corners, [ tlArr, brArr ] )

				if( zoomChanged ){
					view.zoom = appStateView.zoom = zoomValue
				***REMOVED***
				if( cornersChanged ){
					if( center !== this.center ){
						this.center = view.center = center
						appStateView.center = center
					***REMOVED***else{
						view.leftTop = tl
						view.rightBottom = br
						appStateView.corners = [ tlArr, brArr ]
					***REMOVED***
				***REMOVED***
				// console.log(view.zoom, appStateView.zoom, zoomChanged, this.zoom, zoomValue)
				if( zoomChanged || cornersChanged ){
					this.setZoomAndCorners( appStateView, { noNotify: true ***REMOVED*** )
					// Group list view is in one point
					// console.log('--->',view.zoom, appStateView.zoom)
					if( br != tl ) this.fireEvent('map-changed', view, true)
				***REMOVED***

			***REMOVED***else{
				this.fireEvent('filter-reseted')
			***REMOVED***
			// console.log('parseURL ')
			// console.log('this.state '+this.state)
			// console.log('newState '+newState)
			// State changed?
			if( this.state != newState ){
				this.state = newState


				this.fireEvent('state-change', newState, location.hash,
					location.hash.replace(/^[^\?]+\?/, '') )

			***REMOVED***else{
				this.fireEvent('params-change', newState, location.hash,
					location.hash.replace(/^[^\?]+\?/, '') )
			***REMOVED***
			this.updateQueryByURL()
		***REMOVED***,

		getState: function(){
			return {
				state: this.state,
				hash: this.hash,
				params: this.params
			***REMOVED***

		***REMOVED***,

		getStateArray: function(){
			return [
				this.state,
				this.hash,
				this.params
			]
		***REMOVED***,

		setZoomAndCorners: function( view, options ){
			options = options || {***REMOVED***

			// this.setListMode( false )
			ignoreNextFilter = false

			// console.log(JSON.stringify(view))
			// There is no difference to the present state?
			if( ( view.zoom && this.zoom == view.zoom ) &&
				( view.corners && !areNotSameCorners(this.corners, view.corners) ) ){
				return
			***REMOVED***
			

			if( view.zoom ) this.zoom = view.zoom
			
			// console.log(this.zoom, view.zoom)

			//CORNERS

			this.center = view.center;
			if( options.isGroupList ){
				this.center[0] = view.center[0] //|| this.defaultCenter
				this.center[1] = view.center[1] //|| this.defaultCenter
				this.corners = view.corners || this.defaultCorners
				this.page = 1
				this.setListMode( true, options.isGroupList )

			***REMOVED***else{
				this.center[0] = view.center[0] //|| this.defaultCenter
				this.center[1] = view.center[1] //|| this.defaultCenter
				this.cachedCorners = view.corners
				this.corners = view.corners || this.defaultCorners
				this.setListMode( this.isListMode, options.isGroupList )
			***REMOVED***
			// console.log(view.center[0], view.center[1],'==', this.center[0], this.center[1])
			// console.log('------------------------')

			if( !options.noNotify )	this.updateURLTimed()

			this.activateStateProyects()
		***REMOVED***,

		setDefaultCorners: function( corners ){
			this.corners = this.defaultCorners = corners
		***REMOVED***,

		setFiltersString: function( filters ){
			//console.log('FILTERS STRING ======> '+ ignoreNextFilter)
			this.filters = filters
			this.setListMode( this.isListMode )

			filtersSettedByString = true

			if(!ignoreNextFilter){
				this.updateURLTimed()
				//console.log(filters)
			***REMOVED***
		***REMOVED***,

		ignoreNextFilterSelection: function(){
			ignoreNextFilter = true
		***REMOVED***,

		activateStateProyects: function(){
			if(!this.state && !ignoreWeAreReseting){
				this.state = 'Proyectos'
				this.fireEvent('state-change', this.state, location.hash,
					location.hash.replace(/^[^\?]+\?/, '') )
				this.updateURLTimed()
			***REMOVED***

		***REMOVED***,

		setQuery: function( query ){
			//console.log('QUERY '+query)
			this.query = query || ''
			// this.setListMode( false )

			if(!ignoreNextFilter){
				this.updateURLTimed()
			***REMOVED***
		***REMOVED***,

		setPage: function( page ){
			//console.log('PAGE '+page)
			this.page = page
			this.updateURLTimed()
		***REMOVED***,

		updateQueryByURL: function(){
			var query = location.hash.replace(/^[^\?]+\??/,''),
				req
			// console.log('>>>>>>>>>>>>>>>>>>>>>>')
			// If not query
			if( !query ){
				query = 'zoom=8' +
						'&center=' + this.center[0] + ',' + this.center[1]
						'&topLeft=' + this.defaultCorners[0].join(',') +
						'&bottomRight=' + this.defaultCorners[1].join(',')
				this.corners = this.defaultCorners
				this.zoom = 6
			***REMOVED***else{
				if( lastRequestedQuery == this.state + query ) return
			***REMOVED***

			lastRequestedQuery = this.state + query
			// console.log('requesting with '+this.state, this.isListMode)
			if( !this.isListMode || !this.state ){
				// Check if there is a running ajax anc cancel it
				if( this.cachedRequest && this.cachedRequest.readystate != 4){
					if( this.cachedRequest.abort ) this.cachedRequest.abort()
					//Notify the Map to remove one loading
					this.fireEvent('load-projects-aborded', query)
				***REMOVED***
				// Check if there is a running ajax anc cancel it
				if( this.cachedRequest2 && this.cachedRequest2.readystate != 4){
					if( this.cachedRequest2.abort ) this.cachedRequest2.abort()
					//Notify the Map to remove one loading
					this.fireEvent('load-projects-aborded', query)
				***REMOVED***

				this.cachedRequest = Services.search( this.state || 'Proyectos', query )
				
				if( this.state !== 'Recursos' &&
					this.state !== 'Produccion' &&
					this.state !== 'Fiscalizacion' &&
					this.cachedRequest ){
					this.cachedRequest.done(this.projectsLoaded.bind(this))
				***REMOVED***else if( this.state == 'Recursos' ){
					this.cachedRequest2 = Services.search( this.state, query, {pushpins: true***REMOVED*** )
					$.when(this.cachedRequest2, this.cachedRequest)
							.done(this.resourcesLoaded.bind(this))
				***REMOVED***else if( this.state == 'Produccion' ){
					this.cachedRequest2 = Services.search( this.state, query, {pushpins: true***REMOVED*** )
					$.when(this.cachedRequest2, this.cachedRequest)
							.done(this.productionLoaded.bind(this))
				***REMOVED***else if( this.state == 'Fiscalizacion' ){
					this.cachedRequest2 = Services.search( this.state, query, {pushpins: true***REMOVED*** )
					$.when(this.cachedRequest2, this.cachedRequest)
							.done(this.fiscalizacionLoaded.bind(this))
				***REMOVED***

				this.fireEvent('loading-projects', query)
				//console.log('FIREEEEEEEE '+ query)
				// this.filtersChanged( query )
			***REMOVED***else{
				req = Services.search( this.state, query, {isList: true***REMOVED*** )
				this.fireEvent('loading-projects-list', query)
				if( req ){
					req.done(this.projectsListLoaded.bind(this))
						//console.log('FIREEEEEEEE '+ query)
					// this.filtersChanged( query )
				***REMOVED***
			***REMOVED***
			
		***REMOVED***,

		updateURLTimed: function(){
			//console.log('TIMED ')
			clearTimeout(this.timeout)
			this.timeout = setTimeout(this.updateURL.bind(this), 100)
		***REMOVED***,

		updateURL: function(){
			var query = '',
				posibleHash

			//debugger;

			// console.log('=======================================')
			if( this.firstTime ){
				this.firstTime = false
				return
			***REMOVED***

			if( this.query){
				query += 'query=' + this.query
			***REMOVED***
			if( this.page){
				query += '&page=' + this.page
			***REMOVED***
			if( this.zoom /*&& !this.isListMode && this.corners*/ ){
				query += '&zoom=' + this.zoom
			***REMOVED***
			// console.log(JSON.stringify(this.center))
			if( this.center ){
				query += '&center=' + this.center[0] + ',' + this.center[1]
			***REMOVED***
			if( this.corners /*&& (!this.isListMode || this.isListMode.isGroup)*/ ){
				query += '&topLeft=' + this.corners[0][0] + ',' + this.corners[0][1]
				query += '&bottomRight=' + this.corners[1][0] + ',' + this.corners[1][1]
			***REMOVED***
			if( this.filters ){
				query += '&' + this.filters
			***REMOVED***
			if( this.isListMode ){
				query += '&listMode=true'
				if( this.isListMode.isGroup ){
					query += '&isGroup=true'
				***REMOVED***
			***REMOVED***

			query = query.replace(/(?:^&)|(?:&$)/g,'')

			//console.log(this.lastQuery)
			//console.log(query)
			// //console.log(window.location)

			posibleHash = '#/' + this.state.toLowerCase() + '/?' + query

			if( !this.state ){
				posibleHash = '#/?' + query
			***REMOVED***
			// console.log('======================================='+this.lastQuery)
			// console.log('======================================='+posibleHash)
			if( this.lastQuery && ( this.lastQuery === posibleHash )/* || !this.state*/ ){
				return
			***REMOVED***
			// console.log('=======================================PAST')
			this.lastQuery =  posibleHash

			location.hash = posibleHash
		***REMOVED***,

		projectsLoaded: function( data ){
			this.fireEvent('projects-loaded', data)
		***REMOVED***,

		resourcesLoaded: function( data, data2 ){
			if( data2 instanceof Array ){
				data = data[0]
				data2 = data2[0]
				this.fireEvent('resources-loaded', data, data2)
			***REMOVED***else{
				this.fireEvent('resources-loaded', data)
			***REMOVED***
		***REMOVED***,

		productionLoaded: function( data, data2 ){
			if( data2 instanceof Array ){
				data = data[0]
				data2 = data2[0]
				this.fireEvent('production-loaded', data, data2)
			***REMOVED***else{
				this.fireEvent('production-loaded', data)
			***REMOVED***
		***REMOVED***,

		fiscalizacionLoaded: function( data, data2 ){

			//debugger;

			if( data2 instanceof Array ){
				data = data[0]
				data2 = data2[0]
				this.fireEvent('fiscalization-loaded', data, data2)
			***REMOVED***else{
				this.fireEvent('fiscalization-loaded', data)
			***REMOVED***


		***REMOVED***,

		projectsListLoaded: function( data ){
			this.fireEvent('projects-list-loaded', data)
		***REMOVED***,

		setListMode: function( bool, groupException, noForce ){
			if( bool && $('#controls').css('left') != 0 ){
				$('#controls')
					.addClass('list-mode')
					.animate({ marginLeft: 0, left: 0 ***REMOVED***)
				this.fireEvent('view-group-change', bool)
			***REMOVED***

			if( bool === !!this.isListMode ) return

			if( !bool ){
				this.isListMode = null
				$('#projects-list-view').hide()
				$('#map-view').show()
				$('#controls').removeClass('list-mode')
				// this.center = this.cachedCenter || this.defaultCenter
				this.corners = this.cachedCorners || this.defaultCorners
				// if( !this.getState().state ){
				// 	this.fireEvent('filter-reseted')
				// 	this.fireEvent('redraw-all')
				// ***REMOVED*** 
			***REMOVED***else{
				if( groupException ){
					this.isListMode = { isGroup: true ***REMOVED***
				***REMOVED***else{
					this.isListMode = {***REMOVED***
				***REMOVED***
				$('#map-view').hide()
				$('#projects-list-view').show()
				// $('#controls')
				// 	.addClass('list-mode')
				// 	.animate({ marginLeft: 0, left: 0 ***REMOVED***)
			***REMOVED***


			if( !noForce ){
				this.updateURLTimed( groupException )
			***REMOVED***
		***REMOVED***
	***REMOVED***)

	return new AppState()
***REMOVED***)