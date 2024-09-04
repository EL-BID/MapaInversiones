/*global ko, define, Class, Event*/
define(['lib/mvc/Observable',
		'app/network/Services',
		'./FiltersGroup',
		'app/controller/appStates',
		'app/controller/AppState',
		'app/utils/Utils',
		'app/utils/territories'
	],
	function(
		Observable,
		Services,
		FiltersGroup,
		appStates,
		AppState,
		Utils,
		territoriesCache
	){

	/**
	 * Timer to constructuct the query
	 * (spcially when is activated a related group)
	 */
	var queryContructTimeout,

	FiltersManager = new Class(Observable, {

		initialize: function(){
			var self = this,
				type,
				filterGroup,
				key

			// Flags
			this.activated = false
			this.mode = null

			// Elements
			this.elems = {}
			this.elems.root = $('#controls')
			this.elems.search = $('#search')
			this.elems.filterResults = $('#filter-results')
			this.elems.resetFiltersWrapper = $('#reset-filters-wrapper')
			this.elems.resetFilters = $('#reset-filters')
			this.elems.initLink = $('#header .logo, #header .inicio, #footer .inicio')
			this.elems.share = $('#share')

			// Initialize the FiltersGroups
			this.filtersGroups = {}


			for(var i = 0; i < appStates.length; i++){
					key = appStates[i]
					filterGroup = new FiltersGroup( key )
					this.filtersGroups[ key ] = filterGroup
				
					filterGroup.on('option-activated', function( filterActivated ){
						var fg 
						// console.log('fired with '+filterActivated.parameter)
						// console.log('fired with '+filterActivated.active())
						if( filterActivated.active() ){
							for(var i=0; i<appStates.length; i++){
								fg = self.filtersGroups[ appStates[i] ]
								fg.unselectExclusives( filterActivated.parameter )
							}
						}
						self.notifyNewSearch( filterActivated )
					})
					//for polygon zooming
					filterGroup.on('territory-activated', self.territoryActivated.bind(self))
					filterGroup.on('unselect-all-filters', self.unselectOtherFilterGroups.bind(this))
					filterGroup.on('filter-activated', self.checkActivated.bind(self))
					filterGroup.on('filters-gonna-show', self.fireEvent.bind(this, 'filters-gonna-show'))
					filterGroup.on('zoom-out', self.fireEvent.bind(this, 'zoom-out'))
			}

			AppState.on( 'state-change', this.activate.bind( this ) )
			AppState.on( 'filter-reseted', this.unselectAll.bind( this ) )
			AppState.on( 'filter-activated', this.selectFilterWith.bind( this ) )
			AppState.on('view-group-change', function( bool ){
				self.viewMode.visible( bool )
			})
			AppState.on( 'new-search', this.notifyNewSearch.bind( this ) )

			// Periods are contained in each filtergroup
			// but they are also contained inside 
			// this array of periods for binding
			this.periods = ko.observableArray()
			this.periods = ko.observableArray()

			setTimeout(function(){
				Services.filters.forProjects().done( self.initializeModels.bind( self ) )
			}, 0)
			
			// Get the filters
			setTimeout(function(){
				self.fireEvent('loading-filters')
			}, 20)
			 
			AppState.on('projects-loaded', this.updateStatistics.bind(this))
			
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
						}else if(typeof bool != 'boolean'){
							window.event.cancelBubble = true
						}
					}

					return false
				}
				return false
			}
			
			function searchQuery(){
				var that = this
				function notifyChange(){
					var fg, state = AppState.getState().state
					if( that.query() !== '' ){
						// Query search is exclusive of filters search
						if( state == 'Recursos' || state == 'Produccion' ){
							for(var i=0; i<appStates.length; i++){
								fg = self.filtersGroups[ appStates[i] ]
								// HEAD ---> fg.unselectAllFilters(null, true)
								fg.unselectAllFilters()
							}
							self.fireEvent('new-query')
						}
						// self.fireEvent('zoom-out')
						self.hideAllFilters()
						self.resetFilters( true )
					}else{
					}

					self.notifyNewSearch()
				}
				this.query = ko.observable('')
				this.query.subscribe(notifyChange)
				this.search = notifyChange
			}

			this.searchQuery = new searchQuery()
			this.viewMode = new viewMode()
			
			this.resetFilters = ko.observable(false)

			ko.applyBindings( this.viewMode, $('#toggle-controls')[0] )
			ko.applyBindings( this.searchQuery, $('#search')[0] )

			this.elems.initLink.on( 'click', this.unselectAll.bind(this) )

			// Get actual state
		},
		
		activate: function( state, hash, params ){
			var root = this.elems.root,
				actions = root.find('.actions'),
				key,
				fg, i

			

			$('#header nav a').removeClass('selected')
			if( state ){
				$('.menu-item-' + state.toLowerCase() ).addClass('selected')
			}else{
				$('.menu-item-inicio').addClass('selected')
			}

			// Hide other or all filtersGroups
			this.periods().forEach(function( period ){
				period.hidden( true )
			})
			if( state !== '' ){
				for(i=0; i<appStates.length; i++){
					key = appStates[i]
					if( key === state ){
						this.filtersGroups[ key ]
							.visible( true )
						actions.find('.search-'+key.toLowerCase())
							.removeClass('inactive')
					}
					else if( key !== 'Comunes' ){
						this.filtersGroups[ key ]
							.visible( false )
						actions.find('.search-'+key.toLowerCase())
							.addClass('inactive')
					}else{
						this.filtersGroups[ key ]
							.visible( true )
					}
				}

				
				root.addClass('tabs-mode')
					.animate({
						marginLeft: 0,
						left: 0
					})

				root.find('.statistics').addClass('small')
				root.find('.intro').hide()
				this.elems.search.show()
				this.elems.share.show()


				if(state == 'Fiscalizacion' ){

					$('.buttons-filter-fiscalization').show()

					$('.wrap-gray').addClass('wrap-gray-fiscalization')

					var attr = $('.map-container').attr('data-option-subtipo');

					$('.map-container').addClass('fiscalizacion-mode')

					if (typeof attr == 'undefined' || attr == '' || attr == 'fiscalizacion-option-subtipo-') {

						$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo--1')

					}

					var textTmp = $('.buttons-filter-fiscalization a.active').attr('data-text-filter')

					$('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text(textTmp)


				}else{
					$('.buttons-filter-fiscalization').hide()

					$('.wrap-gray').removeClass('wrap-gray-fiscalization')
				}


				
				if(state != 'Recursos'){
					$('.legend-resources').hide()
				}else{
					$('.legend-resources').show()
				}
				
				if( state == 'Recursos' || state == 'Produccion' || state =='Fiscalizacion'){
					root.find('.statistics').hide()
					$('#filter-results').hide()

				}
				else{
					root.find('.statistics').show()
					$('#filter-results').show()
				}
			}else{
				for(i=0; i<appStates.length; i++){
					//debugger;
					this.filtersGroups[ appStates[i] ]
						.visible( false )
				}
				root.removeClass('tabs-mode')
				root.find('.statistics').removeClass('small')
				root.find('.statistics').show()
				root.find('.intro').show()
				$('#filter-results').hide()
				this.elems.search.hide()
				this.elems.share.hide()
				
				if(	this.periods().length ){
					this.periods()[0].hidden( false )
					// root.find('.statistics').addClass('small')
				}
			}

			// Check reset here too
			this.resetFilters(false)

			for(i=0; i<appStates.length; i++){
				fg = this.filtersGroups[ appStates[i] ]

				if(fg && fg.visible() && fg.hasFiltersActive()){
					this.resetFilters(true)
					break;
				}
			}

			if( this.searchQuery.query() ) this.resetFilters( true )
		},

		toggleControl: function(bool){
			this.activated = true

			if(bool){
				this.elems.root.animate({ marginLeft: 0, left: 0 })
			}
			else {
				//FIXME list mode
				this.elems.root.animate({ marginLeft: 0, left: -(this.elems.root.width()) })
				this.hideAllFilters()
				if(AppState.listMode)
					AppState.setListMode(false)
			}

			return false
		},

		initializeModels: function(response){
			var rawData = response.filters,
				tempArray = [],
				self = this, sectionName

			if(rawData){
				setTimeout(function(){
					var length = rawData.length,
						i = 0, j = 0,
						data,
						filterInstance,
						st = AppState.getState(),
						territory

					for(; i<length; i++){
						data = rawData[i]
						sectionName = data.seccionAplicativo
						if( sectionName.match(/fiscalizacion/i) ){
							sectionName = 'Fiscalizacion'
						}
						filterInstance = self.filtersGroups[ sectionName ]
							.addFilter( data )
						if( data.parameter === 'municipio' ||
							data.parameter === 'departamento' ||
							data.parameter === 'region' ){
							for( j=0; j<data.items.length; j++ ){
								territory = data.items[j]
								territoriesCache[data.parameter][territory.value] = {
									'id': territory.value,
									'name': territory.name
								}
							}
						}

						// All periods:
						// period, periodo, periodos, periodosRecursos...
						if( data.parameter.indexOf('period') === 0 ){
							self.periods.push( filterInstance )
						}
					}

					// Assign the array to observableArray
					for(i=0; i<appStates.length; i++){
						self.filtersGroups[ appStates[i] ].instantiateObservable()
					}
					
					setTimeout(function(){
						function byId( id ){
							return document.getElementById( id )
						}
						
						var groupTypes = FiltersGroup.types,
							key, typeName,
							rootElement = $('#filters-groups-list').removeClass('loading')[0],
							originalTemplate = $(rootElement.children[0]).remove(),
							filterElement
						// TODO actualizar el html para que pinte bien los bindings
						// When period changes... we have to load new graphics
						ko.applyBindings( self, byId('map-select-list-period') )
						ko.applyBindings( self, byId('info-select-list-period') )
						ko.applyBindings( self, byId('filters-stats-list-info') )
						

						// Dynamic template generation
						for(var i=0; i<appStates.length; i++){
							key = appStates[i]
							filterElement = originalTemplate.clone()
							filterElement.attr('data-bind',
								filterElement.attr('data-bind')
									.replace(/(filtersGroups)/g, '$1.' + key))
							rootElement.appendChild( filterElement[0] )
						}
						ko.applyBindings(self, rootElement)
						
						ko.applyBindings(self, self.elems.resetFiltersWrapper[0])
						self.fireEvent('filters-loaded')
					}, 0)

					//At the end
					self.activate(AppState.getState().state, st.hash, st.params)
				}, 0)
			}

		},

		territoryActivated: function(){
			this.fireEvent.apply(this, ['territory-activated'].concat([].slice.call( arguments )))
		},

		notifyNewSearch: function(param){
			//Recorrer filtros y armar nuevo query
			var self = this

			clearTimeout(queryContructTimeout)
			queryContructTimeout = setTimeout( function(){
				var state = AppState.getState().state
				// In resources query search is exclusive
				if( state == 'Recursos' ){
					if( self.searchQuery.query() && self.onlyGetFiltersString() ){
						self.searchQuery.query('')
					}
				}
				AppState.setQuery( encodeURIComponent( self.searchQuery.query() ) )
				self.resetFilters( false )
				AppState.setFiltersString( self.getQueryFilters() )
			}, 0 )

		},

		getQueryFilters: function(){
			var filtersString = '',
					i = 0,
					fg, hasVisible = false

			for(i=0; i<appStates.length; i++){
				fg = this.filtersGroups[ appStates[i] ]
				if(fg.visible()){
					hasVisible = true
					if(fg.hasFiltersActive()){
						this.resetFilters( true )
						break;
					}
				}
			}

			if( this.searchQuery.query() ) this.resetFilters( true )

			for(i=0; i<appStates.length; i++){
				fg = this.filtersGroups[ appStates[i] ]
				if( fg.visible() ){
					filtersString += fg.getQuery()

				}
			}
			if(!hasVisible){
				fg = this.filtersGroups['Proyectos']
				if(fg.hasFiltersActive()){
					filtersString += fg.getQuery()
				}
			}




			return filtersString.replace(/&$/, '')
		},

		onlyGetFiltersString: function(){
			var filtersString = '',
				i
			for(i=0; i<appStates.length; i++){
				fg = this.filtersGroups[ appStates[i] ]
				if( fg.visible() ){
					filtersString += fg.getQuery()
				}
			}

			//debugger;

			return filtersString
		},

		unselectAll: function( noNotify, onlyClean, noResetQuery ){
			var fg,
				i

			// if( !this.filtersProjects ) return
			if( noNotify !== true ) this.fireEvent('filters-reseted')
			
			for(i=0; i<appStates.length; i++){
				fg = this.filtersGroups[ appStates[i] ]
				if( fg.visible() || ( onlyClean === true ) ){
					fg.unselectAllFilters()
				}
			}

			$('.filter-list .filter input[type="text"]').val('').trigger('keyup')
			$('.buttons-filter-fiscalization a').removeClass('active')
			$('.buttons-filter-fiscalization .filter-to-todos').addClass('active')
			$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo--1')

			var currenTyear = new Date().getFullYear(),
				$elm =  $('#map-select-list-period .select-period')
				beforeyear = parseInt(currenTyear-1);

			//debugger;
			
			if(!$elm.hasClass('selected')){

				var eleX = $('#map-select-list-period .select-period .options .option:contains("'+beforeyear+'")').last()
				$('#map-select-list-period .select-period .options .option:contains("'+beforeyear+'")').last().trigger('click')
			}


			if( onlyClean !== true ) $('html, body').animate({ scrollTop: 0 }, 200);
			if( noResetQuery!== true) this.searchQuery.query('')
			
			if( onlyClean !== true ){
				this.hideAllFilters()
				location.hash = location.hash.replace(/\?.*/,'')
			}
		},

		unselectOtherFilterGroups: function( type, except, filtersToExclude){
			// console.log('unselectOtherFilterGroups '+except)
			var i, fg
			for(i=0; i<appStates.length; i++){
				fg = this.filtersGroups[ appStates[i] ]
				if( fg.type !== type ){
					fg.unselectAllFilters( except, 'noNotify', filtersToExclude )
				}
			}
			// this.fireEvent('zoom-out')
		},

		updateStatistics: function( data ){
			var root = this.elems.root

			this.fireEvent('loaded-filters')

			if(!this.activated){
				this.activated = true
			}
			root.find('#collected-money').html( parseInt( data.collectedMoney , 10 ).toCurrency() )
			root.find('#approved-money').html( parseInt( data.approvedMoney , 10 ).toCurrency() )
			root.find('#approved-money-home').html( parseInt( data.approvedMoney , 10 ).toCurrency() )
			root.find('#approved-projects').html( data.approvedProjects )
			root.find('#approved-projects-home').html( data.approvedProjects )
			root.find('#total-sources').html( parseInt( data.approvedMoneyTotal , 10 ).toCurrency() )
			//TODO update search results
		},

		hideAllFilters: function(){
			var fg,
				i

			for(i=0; i<appStates.length; i++){
				fg = this.filtersGroups[ appStates[i] ]
				fg.hideAllFilters()
			}
		},

		checkActivated: function( filterGroup, filterActivated ){
			var fg


			for(var i=0; i<appStates.length; i++){
				fg = this.filtersGroups[ appStates[i] ]
				if( fg.type !== filterGroup.type ){
					fg.hideOtherFilters( filterActivated, 'cancelNotify' )
				}
			}
		},

		/**
		 * Selects a filter from the filtersgroups
		 * @param  {String} type
		 * @param  {String} id
		 */
		selectFilterWith: function( type, id ){
			var fg, i
			
			if( type == 'query' ){
				this.searchQuery.query( decodeURIComponent( id ) )
				return
			}else{
				for(i=0; i<appStates.length; i++){
					fg = this.filtersGroups[ appStates[i] ]
					// I suppose that all parameters name are exclusive
					// So, no validation for visibility or something like that
					// if( fg.visible() )
					if( fg.selectFilterWith( type, id ) ) return
				}
			}
		}
	})

	//console.log( '--------->', new FiltersManager())

	return new FiltersManager()
})