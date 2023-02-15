/*global define, Class*/
define(['lib/mvc/Observable', 'app/network/Services'],
	function(Observable, Services){


	//YOUUUUUU YOU SHOULD HANDLE THE LIST VIEW!!!
	var MapState = new Class(Observable, {
		zoom: null, // 1,..,n
		corners: null, // [[4.667292,-74.059508], [4.667292,-74.059508]]
		filters: null, //"departamento=1,2&estado=1"
		query: '',
		timeout: null,
		firstTime: true,
		// the lust can be a group
		// {group: true***REMOVED***
		listMode: null,
		projectsReq: null,
		cornersBackup: null,

		initialize: function(){
		***REMOVED***,

		setZoom: function( zoom ){
			if( this.listMode ){
				this.setListMode( false )
			***REMOVED***
			this.zoom = zoom
			this.updateQueryTimed()
		***REMOVED***,

		setCorners: function( corners, isGroupList ){
			if( isGroupList ){
				this.corners = corners
				this.setListMode( true, isGroupList )

			***REMOVED***else{
				this.cornersBackup = corners
				this.corners = corners
				this.setListMode( false )
			***REMOVED***
		***REMOVED***,

		setFiltersString: function( filters ){
			this.setListMode( false )
			this.filters = filters
			this.updateQueryTimed()
		***REMOVED***,

		setQuery: function( query ){
			this.setListMode( false )
			this.query = query || ''
			this.updateQueryTimed()
		***REMOVED***,

		setPage: function( page ){
			this.page = page
			this.updateQueryTimed()
		***REMOVED***,

		updateQuery: function( groupException ){
			var query = ''

			if(this.firstTime){
				this.firstTime = false
				return
			***REMOVED***

			if( this.query){
				query += 'query=' + this.query
			***REMOVED***
			if( this.page){
				query += '&page=' + this.page
			***REMOVED***
			if( this.zoom && !this.listMode ){
				query += '&zoom=' + this.zoom
			***REMOVED***
			if( this.corners && (!this.listMode || this.listMode.isGroup) ){
				query += '&topLeft=' + this.corners[0][0] + ',' + this.corners[0][1]
				query += '&bottomRight=' + this.corners[1][0] + ',' + this.corners[1][1]
			***REMOVED***
			if( this.filters ){
				query += '&' + this.filters
			***REMOVED***

			query = query.replace(/(?:^&)|(?:&$)/g,'')

			if( !this.listMode ){
				// Check if there is a running ajax anc cancel it
				if( this.projectsReq && this.projectsReq.readystate != 4){
					this.projectsReq.abort && this.projectsReq.abort()
					//Notify the Map to remove one loading
					this.fireEvent('load-projects-aborded', query)
				***REMOVED***

				this.projectsReq = Services.search.projects(query)

				this.projectsReq.done(this.projectsLoaded.bind(this))
				this.fireEvent('loading-projects', query)
			***REMOVED***else{
				Services.search.projectsList(query)
					.done(this.projectsListLoaded.bind(this))
			***REMOVED***
			
		***REMOVED***,

		updateQueryTimed: function(){
			clearTimeout(this.timeout)
			this.timeout = setTimeout(this.updateQuery.bind(this), 0)
		***REMOVED***,

		projectsLoaded: function( data ){
			this.fireEvent('projects-loaded', data)
		***REMOVED***,

		projectsListLoaded: function( data ){
			this.fireEvent('projects-list-loaded', data)
		***REMOVED***,

		setListMode: function( bool, groupException ){
			if( !bool ){
				this.listMode = null
				this.page = 0
				$('#projects-list-view').hide()
				$('#map-view').show()
				$('#controls').removeClass('list-mode')
				this.corners = this.cornersBackup
			***REMOVED***else{
				if( groupException ){
					this.listMode = { isGroup: true ***REMOVED***
				***REMOVED***else{
					this.listMode = {***REMOVED***
				***REMOVED***
				$('#map-view').hide()
				$('#projects-list-view').show()
				$('#controls')
					.addClass('list-mode')
					.animate({ marginLeft: 0, left: 0 ***REMOVED***)
			***REMOVED***

			this.updateQueryTimed( groupException )


		***REMOVED***
	***REMOVED***),
	mapState = new MapState()

	return mapState
***REMOVED***)