/*global ko, define, Class, Event*/
define(['lib/mvc/Observable', 'app/network/Services', './FilterGroup',
		'../map/MapState', 'app/utils/Utils', 'app/infographic/Infographic'],
	function( Observable, Services, FilterGroup, MapState, Utils, Infographic ){

	/**
	 * Timer to constructuct the query
	 * (spcially when is activated a related group)
	 */
	var queryContructTimeout,
		weirdPeriodFirstTimeChecked,

	Filter = new Class(Observable, {
		project: '/proyectos',
		resources: '/recursos',
		supervision: '/fiscalizacion',

		initialize: function(){
			var self = this

			// Flags
			this.activated = false
			this.mode = null

			// Elements
			this.elems = {***REMOVED***
			this.elems.root = $('#controls')
			this.elems.search = $('#search')
			this.elems.filtersProjects = $('#filters-projects')
			this.elems.filtersResources = $('#filters-resources')
			this.elems.filterResults = $('#filter-results')
			this.elems.resetFiltersWrapper = $('#reset-filters-wrapper')
			this.elems.resetFilters = $('#reset-filters')
			this.elems.initLink = $('#header .logo, #header .inicio, #footer .inicio')
			this.elems.share = $('#share')

			setTimeout(function(){
				//debugger;
				Services.filters.forProjects().done( self.initializeModels.bind( self ) )
			***REMOVED***, 0)
			
			// get the filters
			setTimeout(function(){
				self.fireEvent('loading-filters')
			***REMOVED***, 20)
			
			MapState.on('projects-loaded', this.updateStatistics.bind(this))
			
			function viewMode(){
				this.visible = ko.observable(true)
				this.toggleVisible = function( bool ){
					if( typeof bool == 'boolean' && bool === this.visible())
						return

					if( typeof bool == 'boolean' )
						this.visible( bool )
					else
						this.visible(!this.visible())

					self.toggleControl(this.visible())

					if(bool instanceof Event){
						if(bool.stopPropagation){
							bool.stopPropagation()
						***REMOVED***else if(typeof bool != 'boolean'){
							window.event.cancelBubble = true
						***REMOVED***
					***REMOVED***

					return false
				***REMOVED***
				return false
			***REMOVED***
			
			function searchQuery(){
				function notifyChange(){
					self.notifyNewSearch()
				***REMOVED***
				this.query = ko.observable('')
				this.query.subscribe(notifyChange)
				this.search = notifyChange
			***REMOVED***

			this.searchQuery = new searchQuery()
			this.viewMode = new viewMode()
			
			this.resetFilters = ko.observable(false)

			ko.applyBindings( this.viewMode, $('#toggle-controls')[0] )
			ko.applyBindings( this.searchQuery, $('#search')[0] )

			this.elems.initLink.on( 'click', this.unselectAll.bind(this) )
		***REMOVED***,
		
		activate: function( type, enforce ){
			var root = this.elems.root,
				actions = root.find('.actions'),
				activated = []

			if( this.filtersProjects ){
				//debugger;
				activated = this.filtersProjects().filter(function( fg ){
					return fg.active()
				***REMOVED***)
			***REMOVED***

			if( !enforce && ( type === this.project ) && ( activated.length === 1  &&
				activated[0].parameter === 'periods' ) ){
				// weirdPeriodFirstTimeChecked = true
				return
			***REMOVED***

			// Applies to all elements
			if(type === this.project || type === this.resources){
				root.addClass('tabs-mode')
				root.find('.statistics').addClass('small')
				root.find('.intro').hide()
				$('#filter-results').show()
				this.elems.search.show()
				this.elems.share.show()
			***REMOVED***else{
				root.removeClass('tabs-mode')
				root.find('.statistics').removeClass('small')
				root.find('.intro').show()
				$('#filter-results').hide()
				this.elems.search.hide()
				this.elems.share.hide()
			***REMOVED***

			//if(type === this.supervision)
			
			$('#projects-list-view').hide()
			$('#map-view').show()
			$('#controls').removeClass('list-mode')

			//console.log(type, this)

			if(type === this.project){
				this.mode = this.project
				this.elems.filtersResources.hide()
				this.elems.filtersProjects.show()
				actions.find('.search-resources')
					.addClass('inactive')
					.siblings().removeClass('inactive')
			***REMOVED***
			else if(type === this.resources){
				this.mode = this.resources
				this.elems.filtersProjects.hide()
				this.elems.filtersResources.show()
				actions.find('.search-projects')
					.addClass('inactive')
					.siblings().removeClass('inactive')
			***REMOVED***else{
				this.mode = null
				this.elems.filtersResources.hide()
				this.elems.filtersProjects.hide()
				actions.find('a').removeClass('inactive')
			***REMOVED***
			
		***REMOVED***,

		toggleControl: function(bool){
			this.activated = true

			if(bool){
				this.elems.root.animate({ marginLeft: 0, left: 0 ***REMOVED***)
			***REMOVED***
			else {
				this.elems.root.animate({ marginLeft: 0, left: -350 ***REMOVED***)
				this.hideAllFilters()
				
				if(MapState.listMode)
					MapState.setListMode(false)
			***REMOVED***

			return false
		***REMOVED***,

		initializeModels: function(response){
			var rawData = response.filters,
				tempArray = [],
				self = this
				
			if(rawData){
				setTimeout(function(){
					var length = rawData.length,
						i = 0,
						filterGroup

					function reloadGraphsCallback( periodFilter ){
						Infographic.reloadGraphs( periodFilter.getQuery() )
					***REMOVED***
					
					for(; i<length; i++){
						filterGroup = new FilterGroup( rawData[i] )
						tempArray.push(filterGroup)
						filterGroup.on('activate-options-related', self.activateOptionsRelated.bind(self))
						if(filterGroup.parameter.match(/(region)|(departamento)|(municipio)/))
							filterGroup.on('activated-by-user', self.activatedByUser.bind(self))
						filterGroup.on('option-activated', self.notifyNewSearch.bind(self))
						filterGroup.on('filters-gonna-show', self.checkActivated.bind(self))
						
						// Period has special handlers
						if( filterGroup.parameter == 'periods' || filterGroup.parameter == 'periodos' ){
							ko.applyBindings( filterGroup, $('#map-select-period')[0] )
							ko.applyBindings( filterGroup, $('#info-select-period')[0] )
							ko.applyBindings( filterGroup, $('#filters-stats-info')[0] )
							// When period changes... we have to load new graphics
							filterGroup.on('option-activated', reloadGraphsCallback)
						***REMOVED***

						if( filterGroup.parameter == 'tipoRecursoNaturalFiscalizacion'){
							ko.applyBindings( filterGroup, $('#map-select-period')[0] )
							ko.applyBindings( filterGroup, $('#info-select-period')[0] )
							ko.applyBindings( filterGroup, $('#filters-stats-info')[0] )
							// When period changes... we have to load new graphics
							filterGroup.on('option-activated', reloadGraphsCallback)
						***REMOVED***
					***REMOVED***
					self.filtersProjects = ko.observableArray( tempArray )
					
					setTimeout(function(){
						ko.applyBindings(self, self.elems.filtersProjects[0])
						ko.applyBindings(self, self.elems.resetFilters[0])
						self.fireEvent('filters-loaded')
					***REMOVED***, 0)
				***REMOVED***, 0)
			***REMOVED***


			//At the end

		***REMOVED***,

		activateOptionsRelated: function( opts ){
			var filters = this.filtersProjects(),
				option, filter,
				i, j

			for( i = 0; i<opts.length; i++ ){
				option = opts[i]
				for( j = 0; j<filters.length; j++ ){
					filter = filters[j]
					if( filter.parameter == option.type ){
						filter.selectOption( option.id )
						break;
					***REMOVED***
				***REMOVED***
			***REMOVED***
		***REMOVED***,

		activatedByUser: function( parameter, opts ){
			this.fireEvent('territory-activated', parameter, opts)
		***REMOVED***,

		notifyNewSearch: function(){
			//Recorrer filtros y armar nuevo query
			var self = this

			clearTimeout(queryContructTimeout)
			queryContructTimeout = setTimeout( function(){
				var filtersString = '',
					filters = self.filtersProjects(),
					i = 0,
					activated = []

				// if(self.searchQuery.query()){
				MapState.setQuery( encodeURIComponent( self.searchQuery.query() ) )
				// ***REMOVED***

				self.resetFilters(false)

				for(; i<filters.length; i++){
					if(filters[i].active()){
						activated.push( filters[i] )
						filtersString += filters[i].getQuery() + '&'
						self.resetFilters(true)
					***REMOVED***
				***REMOVED***

				// Hide or show clear filters
				if( activated.length || self.searchQuery.query()){
					self.elems.resetFiltersWrapper.show()
				***REMOVED***else{
					self.elems.resetFiltersWrapper.hide()
				***REMOVED***

				filtersString = filtersString.replace(/&$/, '')
				MapState.setFiltersString(filtersString)
			***REMOVED***, 0 )

		***REMOVED***,

		unselectAll: function( noNotify ){
			if( !this.filtersProjects ) return

			if( noNotify !== true ) this.fireEvent('filters-reseted')
			
			var filters = this.filtersProjects()

			for(var i = filters.length; i--;){
				filters[i].disActive()
			***REMOVED***

			$('html, body').animate({ scrollTop: 0 ***REMOVED***, 200);
			this.searchQuery.query('')
			this.hideAllFilters()
		***REMOVED***,

		updateStatistics: function( data ){
			var root = this.elems.root

			this.fireEvent('loaded-filters')

			if(!this.activated){
				root.animate({
					marginLeft: 0,
					left: 0
				***REMOVED***)
				this.activated = true
			***REMOVED***
			root.find('#collected-money').html( parseInt( data.collectedMoney ).toCurrency() )
			root.find('#approved-money').html( parseInt( data.approvedMoney ).toCurrency() )
			root.find('#approved-projects').html( data.approvedProjects )
			root.find('#total-sources').html( parseInt( data.approvedMoneyTotal ).toCurrency() )
			//TODO update search results
		***REMOVED***,

		hideAllFilters: function(){
			if( !this.filtersProjects ) return
			var filters = this.filtersProjects(),
				filter
			for(var i = filters.length; i--;){
				filter = filters[i]
				if(filter.visible()){
					filter.hide()
				***REMOVED***
			***REMOVED***
		***REMOVED***,

		checkActivated: function( filterGroup ){
			var filters = this.filtersProjects(),
				filter,
				activated = []

			this.fireEvent('filters-gonna-show', filterGroup)

			for(var i = filters.length; i--;){
				filter = filters[i]
				if( filter.active() ){
					activated.push( filter )
				***REMOVED*** 
				// Hide other filters
				if( filter.visible() &&
					filter.parameter != filterGroup.parameter ){
					filter.hide()
				***REMOVED***
			***REMOVED***

			filterGroup.sortOptionsBy( activated )
		***REMOVED***,

		select: function( type, id ){
			var historyPush = !!(window.history && window.history.pushState),
				filters,
				filter,
				activated,
				i, j

			if( type == 'query' ){
				this.searchQuery.query( id )
			***REMOVED***else{
				filters = this.filtersProjects()
				for(i = filters.length; i--;){
					filter = filters[i]
					if( filter.parameter === type ) {
						if( id instanceof Array ){
							for(j=id.length; j--;){
								filter.selectOption( id[j] )
							***REMOVED***
						***REMOVED***else{
							filter.selectOption( id )
						***REMOVED***
					***REMOVED***
				***REMOVED***
			***REMOVED***
		***REMOVED***
	***REMOVED***)

	return Filter
***REMOVED***)