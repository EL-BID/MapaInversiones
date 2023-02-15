/*global ko, define, Class*/
/**
 * FiltersGroup
 *
 * This Class manages group of filters
 * easing the action of activating and
 * deactivating groups of filters like
 * Projects, Resources... and so on.
 */
define(['lib/mvc/Observable',
		'./Filter',
		'app/controller/appStates'],
		function( Observable, Filter, appStates ){
			
			var FiltersGroup = new Class( Observable, {
			// The type of the instance
			// this can be any of FiltersGroup.types
			type: null,
			filters: null,
			arrayFilters: [],
			loading: true,
			visible: false,


		/**
		 * Constructor
		 *
		 * @param  FiltersGroup.types type string with the type
		 */
		initialize: function(type){
			this.type = type
			this.filters = ko.observableArray()
			this.loading = ko.observable( true )
			this.visible = ko.observable( false )
			this.period = null
			this.visible.subscribe(this.togglePeriods.bind(this))
		***REMOVED***,

		/**
		 * Adds a Filter to the not observable array of filters
		 * @param Object properties of the Filter to construct and add
		 */
		addFilter: function( properties ){
			var self = this,
				filter
			
			// if( properties.usaServicioAjax ){
			// 	filter = new FilterSelect2( properties )
			// ***REMOVED***else{
				filter = new Filter( properties )
			// ***REMOVED***


			// Events bindings
			filter.on('activate-options-related', self.activateOptionsRelated.bind(self))

			if(filter.parameter.match(/(region)|(departamento)|(municipio)|(fiscalizacion)/)){
				filter.on('activated-by-user',
					self.fireEvent.bind(self, 'territory-activated'))
			***REMOVED***

			filter.on('unselect-all-filters', self.unselectAllFilters.bind(self))
			filter.on('option-activated', self.fireEvent.bind(self,'option-activated'))
			filter.on('filters-gonna-show', self.hideOtherFilters.bind(self))
	
			// All periods:
			// period, periodo, periodos, periodosRecursos...
			if( filter.parameter.indexOf('period') === 0 ){
				filter.hidden( !this.visible() )
				filter.on('option-activated',
					self.fireEvent.bind(self, 'period-selected'))
				self.period = filter
				self.togglePeriods()
			***REMOVED***
			if( filter.parameter.indexOf('campoProyecto') === 0 ){
				filter.on('activated-by-user', function(){
					self.fireEvent('zoom-out')
				***REMOVED***)
			***REMOVED***
			self.arrayFilters.push(filter)

			return filter
		***REMOVED***,

		/**
		 * Turns the array of filters
		 * to the ko.observableArray
		 */
		instantiateObservable: function(){
			this.filters( this.arrayFilters )
			// Empty memory
			this.arrayFilters = null
			this.loading( false )
		***REMOVED***,

		/**
		 * Actiavte the options related,
		 * it's assumed that the related filter
		 * is in this group of filters
		 *
		 * @param  {Array<Option>***REMOVED*** opts
		 */
		activateOptionsRelated: function( opts ){
			var filter, option,
				filters = this.filters(),
				i, j

			for( i=0; i<opts.length; i++ ){
				for( j=0; j<filters.length; j++ ){
					filter = filters[j]
					if( filter.parameter == opts[i].type ){
						filter.activateOptionByValue( opts[i].id )
						break;
					***REMOVED***
				***REMOVED***
			***REMOVED***
		***REMOVED***,

		/**
		 * Wether the user activate or deactivate a
		 * territory option of one of the filters this
		 * fires the event to the Observer in a proxy way
		 */
		activatedByUser: function(){
			this.fireEvent.apply(this, 'territory-activated', [].slice.call( arguments ))
		***REMOVED***,

		hideOtherFilters: function( filterActivated, cancelNotify ){
			var filters = this.filters(),
				filter,
				activated = [],
				visible


			for(var i = 0; i < filters.length; i++){
				filter = filters[i]
				if( filter.active() ){
					activated.push( filter )
				***REMOVED***
				// Hide other filters in this group
				if( filter.visible() &&
					filter.parameter != filterActivated.parameter ){
					filter.hide()
				***REMOVED***
			***REMOVED***

			filterActivated.sortOptionsBy( activated )

			if( !cancelNotify ) this.fireEvent('filter-activated', this, filterActivated)

			this.fireEvent('filters-gonna-show', filterActivated)
			// This assummes that the related filters are in this group
		***REMOVED***,

		hideAllFilters: function(){
			var filters = this.filters(),
				filter

			for(var i = filters.length; i--;){
				filter = filters[i]
				if( filter.visible() ){
					filter.hide()
				***REMOVED***
			***REMOVED***
		***REMOVED***,

		togglePeriods: function(){
			if( this.period ){
				this.period.hidden(!this.visible())
			***REMOVED***

		***REMOVED***,

		getQuery: function(){
			var filters = this.filters(),
				filter,
				filtersString = ''

			for(var i = filters.length; i--;){
				filter = filters[i]
				if( filter.active() ){
					filtersString += filter.getQuery() + '&'
				***REMOVED***
			***REMOVED***
			return filtersString
		***REMOVED***,

		selectFilterWith: function( type, id ){
			var filters = this.filters(),
				filter
			
			for(var i = filters.length, j; i--;){
				filter = filters[i]
				if( filter.parameter === type ) {
					if( id instanceof Array ){
						for(j=id.length; j--;){
							filter.selectOption( id[j] )
						***REMOVED***
					***REMOVED***else{
						filter.selectOption( id )
					***REMOVED***
					return true
				***REMOVED***
			***REMOVED***
		***REMOVED***,

		hasFiltersActive: function(){
			var filters = this.filters(),
				filter

			for(var i = filters.length; i--;){
				filter = filters[i]
				if( filter.active() ) {
					return true
				***REMOVED***
			***REMOVED***

			return false
		***REMOVED***,

		unselectAllFilters: function( except, noNotify, filtersToExclude ){
			var filters = this.filters(),
				filter

			// console.log('unselect all filters in '+this.type, except, noNotify, filtersToExclude)
			for(var i = filters.length; i--;){
				filter = filters[i]
				// console.log( filter.parameter, filter.active(), except )
				if( filter.active() && filter.parameter !== except){
					// console.log( filtersToExclude.indexOf( filter.parameter ), filter.parameter )
					if(	( filtersToExclude &&
						( filtersToExclude.indexOf( filter.parameter ) !== -1 ) ) ||
						!filtersToExclude ) {
						filter.disActive()
					***REMOVED***
				***REMOVED***
			***REMOVED***

			if(!noNotify)
				this.fireEvent('unselect-all-filters', this.type, except, filtersToExclude)

			return false
		***REMOVED***,

		unselectExclusives: function( except, a, b ){
			// console.log('disactivating in FG '+except, a, b)
			var filters = this.filters(),
				filter

			for(var i = filters.length; i--;){
				filter = filters[i]
				if( filter.active() && filter.parameter !== except &&
					filter.isExclusive && filter.excludes.indexOf(except) != -1 ) {
					filter.disActive()
				***REMOVED***
			***REMOVED***
		***REMOVED***


	***REMOVED*** )

	return FiltersGroup
***REMOVED***)