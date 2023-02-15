/*global Microsoft, $, define, ko*/
define(['lib/mvc/Observable',
		'./Polygon',
		'./Pushpin',
		'app/network/Services',
		'app/controller/AppState',
		'./ListView'
	],
	function(
		Observable,
		Polygon,
		Pushpin,
		Services,
		AppState
	){
	'use strict';

	function Map(){
		var map, // Bing Map
			polygons = {
				regions: null,
				departments: null,
				municipalities: null
			***REMOVED***,
			polygonsMap = {***REMOVED***,
			polygonsInfoData = {
				departments: JSON.parse(document.body.getAttribute('data-deparmentProjectData')),
				regions: JSON.parse(document.body.getAttribute('data-regionProjectData'))
			***REMOVED***,
			infoboxes = {
				regions: null,
				departments: null,
				municipalities: null
			***REMOVED***,
			// Center of Colombia
			center = new Microsoft.Maps.Location(-24.266015239534894, -58.59577636718749),
			// zoom to show plygons
			// departments and regions zoom
			defaultZoom = 7,
			// Maps view mode
			viewMode,
			// Actual map zoom
			actualZoom = 7,
			// Actual map center
			actualCenter,
			// Rendered Mode flag
			renderedMode,
			// Pushpins
			pushpins = [],
			// PushpinsWrapper
			pushpinsContainer,
			// ko this
			self = this,
			// Never redraw polygons until end of zooming
			timeoutPolygonsRedraw,
			// loading spinner
			loader = $('<div>', {'class': 'loader'***REMOVED***).appendTo($('#map-div')[0]),
			loaderQueries = [],
			firstTime = true,
			// Flag to know when we are pending of loading a response
			// callResourcesInProgress = false,
			// Async Flag for Drawing Pending States When no Polygons Where Available
			pendingStateChange = {***REMOVED***

		document.body.removeAttribute('data-deparmentProjectData')
		document.body.removeAttribute('data-regionProjectData')

		// Fix for Chrome
		scrollTo(0,0);
		window.onload = function() {
			scrollTo(0,0);
		***REMOVED***


		// Actual vizualization mode [Region,Department,Municipality]
		self.actualVisualization = ko.observable('Department')
		viewMode = self.actualVisualization()

		//::: Bing Maps Notifications :::
		
		self.showSpinner = function( cancel ){
			if( cancel !== false ){
				loaderQueries.push(1)
			***REMOVED***
			if( cancel === false && loaderQueries.length < 2){
				loader.fadeOut()
				loaderQueries = []
			***REMOVED***else if( cancel === false ){
				loaderQueries.pop()
			***REMOVED***else{
				loader.fadeIn()
			***REMOVED***
		***REMOVED***

		self.hideSpinner = function( ){
			if(loaderQueries.length < 2){
				loader.fadeOut()
					// .spin(false)
				loaderQueries = []
			***REMOVED***else{
				loaderQueries.pop()
			***REMOVED***
		***REMOVED***

		self.getCorners = function(){
			var nw, se,
				bounds = map.getBounds()

				nw = bounds.getNorthwest()
				se = bounds.getSoutheast()

			return [
					[nw.latitude, nw.longitude],
					[se.latitude, se.longitude]
				]
		***REMOVED***

		self.zoomToColombia = function(){
			// console.log('ZOOMING TO COLOMBIA')
			// console.log('setview'+defaultZoom)
			map.setView({
				center: center,
				zoom: defaultZoom,
				animate: false
			***REMOVED***)

			var targetBounds = map.getTargetBounds()
			
			AppState.setZoomAndCorners({
				zoom: map.getTargetZoom(),
				corners: [
					[targetBounds.getNorth(),targetBounds.getWest()],
					[targetBounds.getSouth(),targetBounds.getEast()]
				],
				center: [targetBounds.center.latitude,targetBounds.center.longitude]
			***REMOVED***)
		***REMOVED***

		AppState.on('projects-loaded', stateChange.bind(self))
		AppState.on('projects-loaded', self.hideSpinner.bind(self))
		AppState.on('resources-loaded', stateChangeRes.bind(self))
		AppState.on('production-loaded', stateChangeProd.bind(self))
		AppState.on('fiscalization-loaded', stateChangeFisc.bind(self))
		AppState.on('loading-projects', self.showSpinner.bind(self))
		AppState.on('load-projects-aborded', self.hideSpinner.bind(self))
		AppState.on('map-changed', panTo )
		AppState.on('redraw-all', redrawPolygons )
		AppState.on('state-change', function( state ){
			//debugger;
			$('.map-container')
				.removeClass('proyectos-mode')
				.removeClass('recursos-mode')
				.removeClass('produccion-mode')
				.removeClass('fiscalizacion-mode')
				.addClass( state.toLowerCase() + '-mode' )
		***REMOVED*** )
		// AppState.on('state-change', self.zoomToColombia.bind(self))
		
		$('#filter-results button').click( changeToListMode )

		/**
		 * Callback for when the Themes Module is loaded
		 */
		function themesModuleLoaded(){
			var targetBounds

			scrollTo(0,0);

			map = new Microsoft.Maps.Map(
				document.getElementById('map-div'),
				{
					credentials: 'Apwt9Qe5hfw-HjZ-yMqofEVWtwyAdIfAvFg6B-pmoa_7zI08a0EAx5vwjT5miN0M',
					zoom: defaultZoom,
					showMapTypeSelector: false,
					center: center,
					enableSearchLogo: false,
					enableClickableLogo: false,
					mapTypeId : Microsoft.Maps.MapTypeId.road,
					useInertia: false
					// mapTypeId : Microsoft.Maps.MapTypeId.auto
					// mapTypeId : Microsoft.Maps.MapTypeId.birdseye
					// mapTypeId : Microsoft.Maps.MapTypeId.aerial
					// mapTypeId : Microsoft.Maps.MapTypeId.collinsBart
					// mapTypeId : Microsoft.Maps.MapTypeId.mercator
				***REMOVED***)

			scrollTo(0,0);
			
			map.MapView = self
			//Map initialization
			//Blocks mousewheel events
			Microsoft.Maps.Events.addHandler(map, 'mousewheel', function(e) {
				e.handled = true;
				return true;
			***REMOVED***);
			// Microsoft.Maps.Events.addHandler(map, 'mousemove', function(e) {
			// 	var point = new Microsoft.Maps.Point(e.getX(), e.getY());
			// 	var loc = map.tryPixelToLocation(point);
			// 	if('console' in window && 'log' in window.console) //console.log(loc)
			// ***REMOVED***);
			Microsoft.Maps.Events.addHandler(map, 'click', function(){
				self.fireEvent('click', map)
			***REMOVED***)
			Microsoft.Maps.Events.addThrottledHandler(map, 'viewchangeend', checkZoomChange, 600)
			// Microsoft.Maps.Events.addHandler(map, 'viewchangeend', function(){
			// 	console.log('view changes without throttled')
			// ***REMOVED***, 600)
			// Microsoft.Maps.Events.addThrottledHandler(map, 'viewchangeend', function(){
			// 	console.log('view changes with throttled')
			// ***REMOVED***, 600)
			Microsoft.Maps.Events.addThrottledHandler(map, 'targetviewchanged', function(){
				redrawPolygons()
			***REMOVED***, 600)
			// Microsoft.Maps.Events.addHandler(map, 'targetviewchanged', function(){
			// 	console.log('targetview changes without throttled')
			// ***REMOVED***, 600)
			// Microsoft.Maps.Events.addThrottledHandler(map, 'targetviewchanged', function(){
			// 	console.log('targetview changes with throttled')
			// ***REMOVED***, 600)

			
			//Deffer loading of all the plygons
			Services.polygons.getDepartments(getRedrawHandler('departments'))
			self.showSpinner()
			Services.polygons.getRegions(getRedrawHandler('regions'))
			self.showSpinner()
			Services.polygons.getMunicipalities(getRedrawHandler('municipalities'))

			// checkZoomChange()

			self.ready = true
			// self.fireEvent('ready', self)
			
			targetBounds = map.getTargetBounds()
			
			AppState.setDefaultCorners([
				[targetBounds.getNorth(),targetBounds.getWest()],
				[targetBounds.getSouth(),targetBounds.getEast()]
			])
			
			pushpinsContainer = new Microsoft.Maps.EntityCollection()
			scrollTo(0,0);
			
		***REMOVED***

		/**
		 * Callback for when the GeoJSON Polygons of the
		 * departments are loaded.
		 * With the data, draws the polygon for every
		 * department.
		 *
		 * @param  {GeoJSON***REMOVED*** data list of polygons
		 */
		function parseGeoJSON(data, polygonsType, isLight){
			var territory, coords,
				polygon, i, j,
				// Accessing strings
				geometry = isLight ? 'ge' : 'geometry',
				coordinates = isLight ? 'c' : 'coordinates',
				type = isLight ? 't' : 'type',
				properties = isLight ? 'p' : 'properties',
				id = isLight ? 'i' : 'id',
				name = isLight ? 'n' : 'name',
				// max = 0, min = 0,
				isRegion = polygonsType == 'regions',
				polygonsFromMulti

			polygonsMap[polygonsType] = polygonsMap[polygonsType] || {***REMOVED***
			polygons[polygonsType] = new Microsoft.Maps.EntityCollection()
			infoboxes[polygonsType] = new Microsoft.Maps.EntityCollection()

			polygons[polygonsType].setOptions({
				zIndex: 1
			***REMOVED***)
			infoboxes[polygonsType].setOptions({
				zIndex: 2
			***REMOVED***)
			pushpinsContainer.setOptions({
				zIndex: 9
			***REMOVED***)
			
			for(i = 0; i < data.features.length; i++){
				territory = data.features[i]
				coords = territory[geometry][coordinates]

				if( territory[geometry][type] == 'MultiPolygon'){
					polygonsFromMulti = []
					for(j=0; j < coords.length; j++){
						polygon = createPolygon(
							coords[j],
							territory[properties],
							isLight,
							territory[properties][id],
							polygonsType
						)
						
						if( polygon._leftTopPoint ){
							polygonsFromMulti[j] = polygon

							if( j === 0 ){
								polygonsFromMulti.leftTopPoint = polygon._leftTopPoint
								polygonsFromMulti.rightBottomPoint = polygon._rightBottomPoint
							***REMOVED***else{
								polygonsFromMulti.leftTopPoint = [
										Math.min(polygonsFromMulti.leftTopPoint[0], polygon._leftTopPoint[0]),
										Math.min(polygonsFromMulti.leftTopPoint[1], polygon._leftTopPoint[1])
									]
								polygonsFromMulti.rightBottomPoint = [
										Math.max(polygonsFromMulti.rightBottomPoint[0], polygon._rightBottomPoint[0]),
										Math.max(polygonsFromMulti.rightBottomPoint[1], polygon._rightBottomPoint[1])
									]
							***REMOVED***
						***REMOVED***

						if( isRegion ){ // Regions colors... ¬¬
							polygon.updateColor('rgba(' + Polygon.baseRGB + ',' +
								calculateOpacity( i / data.features.length ) + ')')
						***REMOVED***
						//TODO Update Polygons and Infoboxes
						polygonsMap[polygonsType][territory[properties][id]] =
							polygonsMap[polygonsType][territory[properties][id]] || []
						polygonsMap[polygonsType][territory[properties][id]].push( polygon )
						// Municipalities polygons are avoer 1100, so they are not
						// asigned to the departments EntityCollection until the
						// very end
						if( polygonsType !== 'municipalities' ){
							polygons[polygonsType].push(polygon.getPolygon())
						***REMOVED***
						infoboxes[polygonsType].push(polygon.getInfobox())
					***REMOVED***
					for(j=0; j < polygonsFromMulti.length; j++){
						polygonsFromMulti[j].setCoordinates(polygonsFromMulti.leftTopPoint, polygonsFromMulti.rightBottomPoint)
					***REMOVED***
					// reassign limits
				***REMOVED***
				else{
					polygon = createPolygon(
						coords,
						territory[properties],
						isLight,
						territory[properties][id],
						polygonsType
					)
					if( isRegion ){ // Regions colors... ¬¬
						polygon.updateColor('rgba(' + Polygon.baseRGB + ',' +
							( i/data.features.length ) + ')')
					***REMOVED***
					//TODO Update Polygons and Infoboxes
					polygonsMap[polygonsType][territory[properties][id]] = polygon
					// Municipalities polygons are avoer 1100, so they are not
					// asigned to the departments EntityCollection until the
					// very end
					if( polygonsType !== 'municipalities' ){
						polygons[polygonsType].push(polygon.getPolygon())
					***REMOVED***
					infoboxes[polygonsType].push(polygon.getInfobox())
				***REMOVED***
			***REMOVED***

			self.fireEvent('polygons-initialized', polygonsType)

			// Async Manage of Lazzy Polygons Loading
			if( pendingStateChange[polygonsType] ){
				pendingStateChange[polygonsType]()
			***REMOVED***
		***REMOVED***


		//::: Normal Funtions :::
		/**
		 * Adds a polygon and attach the listening to events
		 */
		function createPolygon(coords, content, isLight, id, type){
			var dataGroup = generateInfoDataAndColor(content),
				polygon = new Polygon(map, {
					coords: coords,
					content: dataGroup.data
				***REMOVED***, isLight, id, type)

			Microsoft.Maps.Events.addHandler(polygon.getPolygon(), 'click', function(polygon){
				self.fireEvent('click-on-polygon', polygon)
			***REMOVED***)

			polygon.on( 'selected', function( polygonId, type ){
				self.fireEvent( 'polygon-selected', polygonId, type )
			***REMOVED***)

			return polygon
		***REMOVED***

		/**
		 * Generates all teh polygon Infobox data
		 * and color with opacity
		 * @param  {Object***REMOVED*** content object data con generate from
		 * @return {Object***REMOVED***         Object with data and color
		 */
		function generateInfoDataAndColor(content, sourceArrayData){
			var item, i,// max = 0, min,
				data = {
					name: content.name || content.n,
					projectNumber: 0,
					approvedMoney: 0,
					id: content.id || content.i
				***REMOVED***,
				// deltaColor = parseInt(Math.random()*255,10),
				color

			if((content.type || content.t) == 'departamento'){
				sourceArrayData = sourceArrayData || polygonsInfoData.departments
				// console.log(content.type, item.id, item, data)
				// max  = min = sourceArrayData[0].approvedMoney
				for(i=0; i<sourceArrayData.length; i++){
					item = sourceArrayData[i]
					if(item.id === (('id' in content) ? content.id : content.i)){
						data.approvedMoney = item.approvedMoney
						data.projectNumber = item.projectNumber
						break;
					***REMOVED***
				***REMOVED***
			***REMOVED***
			else if((content.type || content.t) == 'region'){
				sourceArrayData = sourceArrayData || polygonsInfoData.regions

				for(i=0; i<sourceArrayData.length; i++){
					item = sourceArrayData[i]
					if(item.id === (('id' in content) ? content.id : content.i)){
						data.approvedMoney = item.approvedMoney
						data.projectNumber = item.projectNumber
						break;
					***REMOVED***
				***REMOVED***
			***REMOVED***
			else if(sourceArrayData){
				if(sourceArrayData[0]) for(i=sourceArrayData.length; i--;){
					item = sourceArrayData[i]
					if(item.id === (('id' in content) ? content.id : content.i)){
						data.approvedMoney = item.approvedMoney
						data.projectNumber = item.projectNumber
						break;
					***REMOVED***
				***REMOVED***
			***REMOVED***

			return {
				data: data,
				color: color
			***REMOVED***
		***REMOVED***


		/**
		 * Center the map into the corners
		 *
		 * @param  {Object***REMOVED***		view options as Bing Maps
		 *                      may receives
		 */
		function panTo( view ){
			var targetBounds

			if( self.ready ){
				if( view.center ){
					view.center = new Microsoft.Maps.Location(view.center[0], view.center[1])
				***REMOVED***else{
					view.bounds = Microsoft.Maps.LocationRect.fromCorners(view.leftTop, view.rightBottom)
				***REMOVED***
				
				// console.log(JSON.stringify(view))
				
				if( view.zoom ){
					view.zoom = +view.zoom || 6
				***REMOVED***

				map.setView(view)
				
				targetBounds = map.getTargetBounds()
				
				// console.log('setview', map.getTargetZoom())
				AppState.setZoomAndCorners({
					zoom: map.getTargetZoom(),
					corners: [
						[targetBounds.getNorth(),targetBounds.getWest()],
						[targetBounds.getSouth(),targetBounds.getEast()]
					],
					center: [targetBounds.center.latitude,targetBounds.center.longitude]
				***REMOVED***)
			***REMOVED***else{
				// console.log('gonna... setview',map.getTargetZoom())
				self.on('ready', function(){
					panTo( view )
				***REMOVED***)
			***REMOVED***
		***REMOVED***

		/**
		 * Function listenning to the map changes
		 * and checking zoom changes to redraw actions
		 */
		function checkZoomChange(){
			var center = map.getCenter(),
				centerStr = center.latitude +' '+ center.longitude,
				corners = self.getCorners(),
				zoom = map.getZoom()

			// console.log('ZOOOOOOOOOOOOOOOOOOM000000')
			// Bing calls viewChange on start

			if(	( zoom % 1 === 0 &&
				actualZoom != zoom ) ||
				actualCenter !== centerStr
				){
				actualZoom = zoom
				actualCenter = centerStr
				// console.log('ZOOOOOOOOOOOOOOOOOOM')
				// console.log('checkZoomChange')
				AppState.setZoomAndCorners( {
					zoom: zoom,
					corners: corners,
					center: [center.latitude,center.longitude]
				***REMOVED*** )
				redrawPolygons()
			***REMOVED***
		***REMOVED***

		/**
		 * Returns a dynamic function loader for the
		 * specific polygon type
		 * @param  {String***REMOVED*** polygonsType key from array in the polygons object
		 *                               to populate
		 * @return {Function***REMOVED***              callback function generated
		 */
		function getRedrawHandler(polygonsType){
			return function(geoJSON){
				//TODO extend the array data
				parseGeoJSON(geoJSON, polygonsType, !geoJSON.type)
				redrawPolygons()
				
				// if( !polygonsType.match('municip') )
				self.showSpinner(false)
			***REMOVED***
		***REMOVED***

		function normalizeResourceObject( obj ){
			var nObj,
				i, key,
				rObj,
				iRec

			

			nObj = {***REMOVED***
			nObj.id = obj.IdEntidad
			nObj.type = obj.TipoEntidad
			nObj.name = obj.NombreEntidad || obj.name
			nObj.typeRes = obj.TipoInfografico || obj.tipo
			nObj.url = obj.Url
			//nObj.TotalFiscalizaciones = obj.TotalFiscalizaciones
			nObj.Tipo = obj.TipoInfografico

			if( obj.latitud ){
				nObj.latitude = obj.latitud
				nObj.longitude = obj.longitud
			***REMOVED***
			if( obj.Latitud ){
				nObj.latitude = obj.Latitud
				nObj.longitude = obj.Longitud
			***REMOVED***
			if( obj.infograficosRecursos ){
				nObj.infoRecursos = obj.infograficosRecursos
				nObj.isResource = true
			***REMOVED***
			if( obj.DetalleAño ){
				nObj.detailYear = obj.DetalleAño
				nObj.isProduction = true
			***REMOVED***

			if(obj.TipoFis){
				if(obj.TipoFis == "-1"){nObj.TipoFisName = 'Todos'***REMOVED***
				if(obj.TipoFis == "M"){nObj.TipoFisName = 'Mineral'***REMOVED***
				if(obj.TipoFis == "H"){nObj.TipoFisName = 'Hidrocarburo'***REMOVED***
			***REMOVED***else{
				nObj.TipoFisName = 'false'
			***REMOVED***

			if( obj.Tipo == "F" ){

				//console.log('objobjobjobj------------->', obj)

				//nObj.Fiscalizaciones = obj.Fiscalizaciones
				//nObj.FiscalizacionesPorPeriodo = obj.FiscalizacionesPorPeriodo
				//nObj.TotalFiscalizaciones = obj.TotalFiscalizaciones
				//nObj.Periodos = obj.Periodos[0]
				//nObj.type = "fiscalization"
				//nObj.Tipo = obj.TipoInfografico
				
				nObj.TipoFis = obj.TipoFis
				nObj.Total = obj.Total
				nObj.Url = obj.Url
				nObj.detalles = obj.detalles
				nObj.isFiscalization = true
			***REMOVED***
			if( obj.TipoInfografico == "NoCoM"){

				
				//nObj.Fiscalizaciones = obj.TotalFiscalizaciones
				//nObj.FiscalizacionesPorPeriodo = obj.InfoboxPin.DetallesPorAño
				//nObj.TotalFiscalizaciones = obj.TotalFiscalizaciones
				//nObj.Periodos = obj.InfoboxPin.Periodo
				//nObj.type = "fiscalization"
				//nObj.Tipo = obj.Tipo
				nObj.Tipo = "NoCoM"
				nObj.TipoFis = obj.TipoFis
				nObj.Total = obj.Total
				nObj.Url = obj.Url
				nObj.detalles = obj.detalles
				nObj.isFiscalization = true
			***REMOVED***

			//debugger;

			//console.log('--->nObj', nObj, '--->obj', obj )
			return nObj
		***REMOVED***


		function stateChangeRes( data, data2 ){
			// if( callResourcesInProgress ){
			self.hideSpinner()
			// ***REMOVED***
			$.extend(data, data2)
			stateChange( data )
			// callResourcesInProgress = !callResourcesInProgress
		***REMOVED***


		function stateChangeProd( data, data2 ){
			// if( callResourcesInProgress ){
			self.hideSpinner()
			// ***REMOVED***
			data.Detalles = data.Detalles || []
			data2.Detalles = data2.Detalles || []
			data.Detalles = data.Detalles.concat( data2.Detalles )
			stateChange( data )
			// callResourcesInProgress = !callResourcesInProgress
		***REMOVED***


		function stateChangeFisc( data, data2 ){
			// if( callResourcesInProgress ){
			self.hideSpinner()
			// ***REMOVED***
			data.Detalles = data.Detalles || data.Pines || []
			data2.Detalles = data2.Detalles || data2.Pines || []
			data.detalleFiscalizacion = data.Detalles.concat( data2.Detalles )
			stateChange( data )
			// callResourcesInProgress = !callResourcesInProgress
		***REMOVED***

		/**
		 * Recieves the notification when the map data model
		 * changes, this could bring visualizacion changes,
		 * and pin data changes
		 * @param  {Object***REMOVED*** data JSON reponse from the server
		 */
		function stateChange( data ){
			var obj,
				noPolygonFlag = true,
				type = 'info'

				//debugger;
				
			function _applyToPolygon(polygon, array, type){
				if( !polygon ) return
				
				var id = polygon.id,
					obj = array[ id ]

				// if( obj.isResource ){
				// 	type = 'resource'
				// ***REMOVED***else if( obj.isProduction ){
				// 	type = 'production'
				// ***REMOVED***else{
				// 	type = 'info'
				// ***REMOVED***
				

				//debugger;
				
				if( obj ){
					// If the object is from resources
					// I transform it
					if( obj.IdEntidad ){
						obj = normalizeResourceObject( obj )
					***REMOVED***
					if(polygon instanceof Polygon){
						polygon.updateInfobox(obj, type)
					***REMOVED***else{
						for(j=polygon.length; j--;){
							polygon[j].updateInfobox(obj, type)
						***REMOVED***
					***REMOVED***
				***REMOVED***else{
					if(polygon instanceof Polygon){
						polygon.updateInfobox(objEmpty, type)
					***REMOVED***else{
						for(j=polygon.length; j--;){
							polygon[j].updateInfobox(objEmpty, type)
						***REMOVED***
					***REMOVED***
				***REMOVED***
			***REMOVED***

			// NEW VERSION
			// 1. Read all the objects and calculate the max, mins and group
			
			var arrayMunicipalities = { length: 0 ***REMOVED***,
				arrayDepartments = { length: 0 ***REMOVED***,
				arrayRegions = { length: 0 ***REMOVED***,
				id,
				polygon,
				j, i,
				// Empty stuff
				// colorEmpty = 'rgba(' + Polygon.baseRGB + ',' + calculateOpacity(0) + ')',
				objEmpty = {
						projectNumber: 0,
						approvedMoney: 0
					***REMOVED***,
				territoryKey,
				// cache hasOwnProperty
				hasProperty = Object.prototype.hasOwnProperty,
				type

			// data.objects = ( data && data.objects ) || [];
			
			// New strategy: load the polygon list, then
			// the redrawPolygons draw the pins if there
			// are pushpins to draw.
			
			pushpins = []

			//Projects
			if( data.objects ){
				type = 'info'
				for(i = data.objects.length; i--;){
					obj = data.objects[i]
					if(obj.type == 'municipio'){
						arrayMunicipalities[obj.id] = obj
						arrayMunicipalities.length += 1
					***REMOVED***
					else if(obj.type == 'departamento'){
						arrayDepartments[obj.id] = obj
						arrayDepartments.length += 1
					***REMOVED***
					else if(obj.type == 'region'){
						arrayRegions[obj.id] = obj
						arrayRegions.length += 1
					***REMOVED***else{
						// Stored for future draw
						pushpins.push(new Pushpin(obj, map, self))
					***REMOVED***
				***REMOVED***
			***REMOVED***

			// Clear infoboxes in polygons


			// Resources
			if( data.detalleRecursos ){
				type = 'resource'
				for(i = data.detalleRecursos.length; i--;){
					obj = data.detalleRecursos[i]
					if(obj.TipoEntidad == 'municipio'){
						arrayMunicipalities[obj.IdEntidad] = obj
						arrayMunicipalities.length += 1
					***REMOVED***
					else if(obj.TipoEntidad == 'departamento'){
						arrayDepartments[obj.IdEntidad] = obj
						arrayDepartments.length += 1
					***REMOVED***
					else if(obj.TipoEntidad == 'region'){
						arrayRegions[obj.IdEntidad] = obj
						arrayRegions.length += 1
					***REMOVED***
				***REMOVED***
				if( !data.detalleRecursos.length ){
					// Clean all infoboxes
					// Regions
					for( territoryKey in polygonsMap.regions ) {
						if( hasProperty.call( polygonsMap.regions, territoryKey ) ){
							polygon = polygonsMap.regions[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
					// Departments
					for( territoryKey in polygonsMap.departments ) {
						if( hasProperty.call( polygonsMap.departments, territoryKey ) ){
							polygon = polygonsMap.departments[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
					// Municipalities
					for( territoryKey in polygonsMap.municipalities ) {
						if( hasProperty.call( polygonsMap.municipalities, territoryKey ) ){
							polygon = polygonsMap.municipalities[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
				***REMOVED***
				viewMode = self.actualVisualization()
				noPolygonFlag = false
			***REMOVED***

			// Resources Pushpins
			if( data.pushPinsRecursos ){
				for(i = data.pushPinsRecursos.length; i--;){
					obj = data.pushPinsRecursos[i]
					obj = normalizeResourceObject( obj )
					// Stored for future draw
					pushpins.push(new Pushpin(obj, map, self))
				***REMOVED***
				// noPolygonFlag = false
				// viewMode = self.actualVisualization()
			***REMOVED***

			// Production
			if( data.Detalles ){
				type = 'production'
				// debugger;
				for(i = data.Detalles.length; i--;){
					obj = data.Detalles[i]
					if( obj.TipoInfografico == 'G' ){
						if(obj.TipoEntidad == 'municipio'){
							arrayMunicipalities[obj.IdEntidad] = obj
							arrayMunicipalities.length += 1
						***REMOVED***
						else if(obj.TipoEntidad == 'departamento'){
							arrayDepartments[obj.IdEntidad] = obj
							arrayDepartments.length += 1
						***REMOVED***
						else if(obj.TipoEntidad == 'region'){
							arrayRegions[obj.IdEntidad] = obj
							arrayRegions.length += 1
						***REMOVED***
					***REMOVED***else{
						obj = data.Detalles[i]
						obj = normalizeResourceObject( obj )
						// Stored for future draw
						pushpins.push(new Pushpin(obj, map, self))
					***REMOVED***
				***REMOVED***
				if( !data.Detalles.length ){
					// Clean all infoboxes
					// Regions
					for( territoryKey in polygonsMap.regions ) {
						if( hasProperty.call( polygonsMap.regions, territoryKey ) ){
							polygon = polygonsMap.regions[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
					// Departments
					for( territoryKey in polygonsMap.departments ) {
						if( hasProperty.call( polygonsMap.departments, territoryKey ) ){
							polygon = polygonsMap.departments[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
					// Municipalities
					for( territoryKey in polygonsMap.municipalities ) {
						if( hasProperty.call( polygonsMap.municipalities, territoryKey ) ){
							polygon = polygonsMap.municipalities[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
				***REMOVED***
				viewMode = self.actualVisualization()
				noPolygonFlag = false
			***REMOVED***
			
			// Fiscalizacion Pushpins
			if( data.detalleFiscalizacion ){
				type = 'fiscalization'
				//debugger;
				for(i = data.detalleFiscalizacion.length; i--;){
					obj = data.detalleFiscalizacion[i]

					if( obj.TipoInfografico == 'G' ){
						if(obj.TipoEntidad == 'municipio'){
							arrayMunicipalities[obj.IdEntidad] = obj
							arrayMunicipalities.length += 1
						***REMOVED***
						else if(obj.TipoEntidad == 'departamento'){
							arrayDepartments[obj.IdEntidad] = obj
							arrayDepartments.length += 1
						***REMOVED***
						else if(obj.TipoEntidad == 'region'){
							arrayRegions[obj.IdEntidad] = obj
							arrayRegions.length += 1
						***REMOVED***
					***REMOVED***else{
						obj = data.detalleFiscalizacion[i]
						obj = normalizeResourceObject( obj )
						// Stored for future draw
						pushpins.push(new Pushpin(obj, map, self))
					***REMOVED***
				***REMOVED***
				if( !data.detalleFiscalizacion.length ){
					// Clean all infoboxes
					// Regions
					for( territoryKey in polygonsMap.regions ) {
						if( hasProperty.call( polygonsMap.regions, territoryKey ) ){
							polygon = polygonsMap.regions[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
					// Departments
					for( territoryKey in polygonsMap.departments ) {
						if( hasProperty.call( polygonsMap.departments, territoryKey ) ){
							polygon = polygonsMap.departments[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
					// Municipalities
					for( territoryKey in polygonsMap.municipalities ) {
						if( hasProperty.call( polygonsMap.municipalities, territoryKey ) ){
							polygon = polygonsMap.municipalities[ territoryKey ]
							_applyToPolygon(polygon, [], type)
						***REMOVED***
					***REMOVED***
				***REMOVED***
				viewMode = self.actualVisualization()
				noPolygonFlag = false
			***REMOVED***

			// Manage Async Loading of Polygons
			if( arrayDepartments.length || arrayRegions.length ){
				// Departments
				if( polygonsMap.departments && arrayDepartments.length ){
					for( territoryKey in polygonsMap.departments ) {
						if( hasProperty.call( polygonsMap.departments, territoryKey ) ){
							polygon = polygonsMap.departments[ territoryKey ]
							if( polygon instanceof Polygon ){
								_applyToPolygon(polygon, arrayDepartments, type)
							***REMOVED***else{
								for(j=0; j<polygon.length; j++){
									_applyToPolygon(polygon[j], arrayDepartments, type)
								***REMOVED***
							***REMOVED***
						***REMOVED***
					***REMOVED***
				***REMOVED***else if( arrayDepartments.length ){
					// If no polygons... manage flag to call this funcion again!!!
					pendingStateChange = { departments: function(){
							stateChange( data )
						***REMOVED*** ***REMOVED***
				***REMOVED***
				// Regions
				if( polygonsMap.regions && arrayRegions.length ){
					for( territoryKey in polygonsMap.regions ) {
						if( hasProperty.call( polygonsMap.regions, territoryKey ) ){
							polygon = polygonsMap.regions[ territoryKey ]
							id = polygon.id
							obj = arrayRegions[ id ]
							
							if( polygon instanceof Polygon ){
								_applyToPolygon(polygon, arrayRegions, type)
							***REMOVED***else{
								for(j=0; j<polygon.length; j++){
									_applyToPolygon(polygon[j], arrayRegions, type)
								***REMOVED***
							***REMOVED***
						***REMOVED***
					***REMOVED***
				***REMOVED***else if( arrayRegions.length ){
					// If no polygons... manage flag to call this funcion again!!!
					pendingStateChange = { regions: function(){
							stateChange( data )
						***REMOVED*** ***REMOVED***
				***REMOVED***
				viewMode = self.actualVisualization()
				noPolygonFlag = false
			***REMOVED***

			// Municipalities
			if( arrayMunicipalities.length && polygons.municipalities ){
				// Tricky now I have to paint only the municipalities that are
				// passed in the response
				polygons.municipalities.clear()
				if( polygonsMap.municipalities && arrayMunicipalities.length ){
					for( territoryKey in arrayMunicipalities ){
						if( hasProperty.call( arrayMunicipalities, territoryKey ) ){
							polygon = polygonsMap.municipalities[ territoryKey ]
							if( polygon instanceof Polygon ){
								polygon.generatePolygon()
								polygons.municipalities.push(polygon.getPolygon())
								_applyToPolygon(polygon, arrayMunicipalities, type)
							***REMOVED***else if( polygon instanceof Array ){ // length is own property :/
								for(j=0; j<polygon.length; j++){
									polygon[j].generatePolygon()
									polygons.municipalities.push(polygon[j].getPolygon())
									_applyToPolygon(polygon[j], arrayMunicipalities, type)
								***REMOVED***
							***REMOVED***
						***REMOVED***
					***REMOVED***
				***REMOVED***

				viewMode = 'Municipality'
				noPolygonFlag = false

			***REMOVED***else if( arrayMunicipalities.length ){
				// If no polygons... manage flag to call this funcion again!!!
				pendingStateChange = { municipalities: function(){
						stateChange( data )
					***REMOVED*** ***REMOVED***
			***REMOVED***

			$('#filter-results .value').html(data.totalProjectsNumber)

			if(noPolygonFlag) viewMode = ''
			
			redrawPolygons()
		***REMOVED***

		/**
		 * This function manages the logic of
		 * the zooming
		 */
		function redrawPolygons(){
			var i

			clearTimeout( timeoutPolygonsRedraw )
			timeoutPolygonsRedraw = setTimeout( function() {

				var cleared
				if( viewMode == 'Department' || viewMode == 'Region' ){
					//Check if the region polygons are already on the map
					if( ( renderedMode != 'Region' && renderedMode != 'Department') ||
						self.actualVisualization() != renderedMode ){
						//Then check if we already have the regions polygons
						//they are being loading by defer loading and
						//will be drawed later
						// debugger;
						if( self.actualVisualization() == 'Region' &&
							polygons.regions ){
							renderedMode = self.actualVisualization()
							map.entities.clear()
							cleared = true
							map.entities.push(polygons.regions)
							map.entities.push(infoboxes.regions)
						***REMOVED***
						if( self.actualVisualization() == 'Department' &&
							polygons.departments ){
							renderedMode = self.actualVisualization()
							map.entities.clear()
							cleared = true
							map.entities.push(polygons.departments)
							map.entities.push(infoboxes.departments)
						***REMOVED***
					***REMOVED***
				***REMOVED***
				//At the end municipalities
				else if( viewMode == 'Municipality' ){
					if( renderedMode != 'Municipality' &&
						polygons.municipalities ){
						renderedMode = 'Municipality'
						map.entities.clear()
						cleared = true
						map.entities.push(polygons.municipalities)
						map.entities.push(infoboxes.municipalities)
					***REMOVED***
				***REMOVED***
				//No polygons in these levels of zoom
				else{
					renderedMode = ''
				***REMOVED***

				//Draw PushPins
				// map.entities.remove( pushpinsContainer )
				pushpinsContainer.clear()
				// debugger;
				var info
				for(i = pushpins.length; i--;){
					info = pushpins[i]._infobox && pushpins[i]._infobox._content
					// Maybe this doesn't go any more
					if( info && (info.isProduction || info.isFiscalization) ){
						if( info.type == 'departamento' ||
							info.type == 'region'){
							if( info.type == 'departamento' &&
								self.actualVisualization() == 'Department' ){
								pushpinsContainer.push( pushpins[i] )
							***REMOVED***else if( info.type == 'region' &&
								self.actualVisualization() == 'Region' ){
								pushpinsContainer.push( pushpins[i] )
							***REMOVED***
						***REMOVED***else{
							pushpinsContainer.push( pushpins[i] )
						***REMOVED***
					***REMOVED***else{
						pushpinsContainer.push( pushpins[i] )
					***REMOVED***
					// if( ( info.type &&
					// 	( info.type.toLowerCase() ==
					// 	self.actualVisualization().toLowerCase() ) ) ||
					// 	!info.type ){
					// 	pushpinsContainer.push( pushpins[i] )
					// ***REMOVED***
				***REMOVED***

				if( !firstTime ){
					map.entities.remove( pushpinsContainer )
				***REMOVED***
				map.entities.push( pushpinsContainer )

				firstTime = false
			***REMOVED***, 100)
		***REMOVED***

		function changeToListMode(){
			AppState.setListMode( true )
		***REMOVED***
		
		//::: Initialization :::
		
		// Not necessary ¬¬
		// Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', { callback: themesModuleLoaded ***REMOVED***);
		themesModuleLoaded()

		//::: Legend :::
		;(function initLegend(){
			function drawCircle( color, selector ){
				var paper = Raphael($(selector)[0], 12, 12)
				paper.circle(6, 6, Math.round(5)).attr({
					fill: color,
					stroke: color
				***REMOVED***)
				paper.circle(6, 6, Math.round(4)).attr({
					fill: color,
					stroke: '#fff',
					'stroke-width': 1
				***REMOVED***)
			***REMOVED***
			// drawCircle('#EC008E', '.legend-resources_type-region')
			drawCircle('#29ADEE', '.legend-resources_type-department')
			drawCircle('#F8921C', '.legend-resources_type-municipality')
		***REMOVED***());

		// Knockout Bindings And Observables
		self.isRegion = ko.computed( function () {
			return self.actualVisualization() == 'Region'
		***REMOVED***, self.actualVisualization)

		self.toggleMode = function (data, evt) {
			var array, max = 0, min = 0, i, territory

			self.fireEvent('changing-view-mode')
			self.hideInfoboxes()
			self.actualVisualization(
				self.actualVisualization() == 'Region' ?
				'Department' : 'Region'
				)

			self.hideInfoboxes()
			redrawPolygons()

			if(self.actualVisualization() == 'Department'){
				array = polygonsInfoData.departments
			***REMOVED***else{
				array = polygonsInfoData.regions
			***REMOVED***
			for(i=0; i<array.length; i++){
				territory = array[i]
				max = Math.max(max, territory.approvedMoney)
				// min = Math.min(min, territory.approvedMoney)
			***REMOVED***
		***REMOVED***
		ko.applyBindings(self, $('#map-view-options .change-view-mode')[0])
		// ko.applyBindings(self, $('#map-legend')[0])

		this.zoomToTerritory = function(type, options){
			var polygons,
				leftTopPoint, rightBottomPoint, groupPoints,
				locationRect,
				firstPolygon,
				polygonGroup,
				corners,
				targetBounds
			
			if( type instanceof Polygon ){
				firstPolygon = type
			***REMOVED***else{
				if( !options.length ) return;

				if(type == 'municipio') polygons = polygonsMap.municipalities
				else if(type == 'departamento') polygons = polygonsMap.departments
				else polygons = polygonsMap.regions

				//NOTE zoom to territory must be call when all polygons are loaded!!!
				if( !polygons ){
					this.on('polygons-initialized', function( typeLoaded ){
						if( typeLoaded == type ){
							self.zoomToTerritory( type, options )
						***REMOVED***
					***REMOVED***)
					return
				***REMOVED***
				firstPolygon = polygons[ options[0].value ]
				
				if( !firstPolygon ) return

				if( firstPolygon instanceof Array ){
					firstPolygon = firstPolygon[0]
				***REMOVED***
			***REMOVED***


			groupPoints = firstPolygon.getCoordinates()

			if( options ){
				for(var i=1; i<options.length; i++){
					firstPolygon = polygons[ options[i].value ]
					corners = firstPolygon.getCoordinates()

					if( firstPolygon instanceof Array ){
						firstPolygon = firstPolygon[0]
					***REMOVED***

					groupPoints = [
						{
							latitude: Math.min(corners[0].latitude, groupPoints[0].latitude),
							longitude: Math.min(corners[0].longitude, groupPoints[0].longitude)
						***REMOVED***,
						{
							latitude: Math.max(corners[1].latitude, groupPoints[1].latitude),
							longitude: Math.max(corners[1].longitude, groupPoints[1].longitude)
						***REMOVED***
					]
				***REMOVED***
			***REMOVED***

			locationRect = new Microsoft.Maps.LocationRect.fromCorners(
				new Microsoft.Maps.Location( groupPoints[0].latitude, groupPoints[0].longitude),
				new Microsoft.Maps.Location( groupPoints[1].latitude, groupPoints[1].longitude) )

			// console.log(zoomLevel)
			if(groupPoints[0].latitude && groupPoints[0].longitude && groupPoints[1].latitude && groupPoints[1].longitude){
				// console.log('setview',locationRect)
				
				map.setView({bounds: locationRect***REMOVED***)

				targetBounds = map.getTargetBounds()
				// console.log('setview',map.getTargetZoom())
				AppState.setZoomAndCorners({
					zoom: map.getTargetZoom(),
					corners: [
						[targetBounds.getNorth(),targetBounds.getWest()],
						[targetBounds.getSouth(),targetBounds.getEast()]
					],
					center: [targetBounds.center.latitude,targetBounds.center.longitude]
				***REMOVED***)
			***REMOVED***else{
				if( console && console.error && typeof console.error == 'function'){
					console.error('Territory without bounds', [groupPoints[0].latitude,groupPoints[0].latitude],[groupPoints[1][0],groupPoints[1].longitude])
				***REMOVED***
			***REMOVED***

			// Show Infobox for Municipalities
			if( type == 'municipio' ){

				setTimeout(function(){
					var dummyEvent = {***REMOVED***
					dummyEvent.originalEvent = {***REMOVED***
					dummyEvent.pageX =
						dummyEvent.originalEvent.x =
							$(window).width()/2
					dummyEvent.pageY =
						dummyEvent.originalEvent.y =
							$('#map-div').height()/2 + $('#header').height()
					firstPolygon.getInfobox().show( dummyEvent )
				***REMOVED***, 2000)
			***REMOVED***
			// AppState.setCorners()
			//console.log(2)
		***REMOVED***

		this.hideInfoboxes = function(){
			var set, key, i, info 

			for( key in infoboxes ){
				if( infoboxes.hasOwnProperty( key ) ){
					set = infoboxes[ key ]
					if( set ){
						for(i = set.getLength(); i--; ){
							set.get(i).hide()
						***REMOVED***
					***REMOVED***
				***REMOVED***
			***REMOVED***

			for(i=0 ; i < pushpins.length; i++){
				info = pushpins[i]._infobox
				if( info ){
					info.hide()
				***REMOVED***
			***REMOVED***
		***REMOVED***

		this.panTo = panTo

		this.viewGroupList = function( dataGroup ){
			AppState.setZoomAndCorners(
					{	corners: [
							[dataGroup.latitude, dataGroup.longitude],
							[dataGroup.latitude, dataGroup.longitude]
						],
						center: [dataGroup.latitude, dataGroup.longitude]
					***REMOVED***,
					{
						isGroupList: true
					***REMOVED***
				)
		***REMOVED***

		// Post-definition listeners
		AppState.on('projects-list-loaded', this.hideInfoboxes.bind(this))
	***REMOVED***

	Map.prototype = new Observable()


	function calculateOpacity(centimal){
		return ( 0.15 + 0.5 * centimal ).toFixed(2)
	***REMOVED***

	return new Map()
***REMOVED***)