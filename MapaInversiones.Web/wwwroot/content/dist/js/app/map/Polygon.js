/*global Microsoft, define, Class*/
define(['lib/mvc/Observable', './Infobox'], function(Observable, Infobox){
	
	/**
	 * Polygon Class
	 *
	 * @param  {Microsoft.Maps.Map}	map parent map
	 * @param  {Object}	 			config
	 * @param  {Boolean} 			isLight is a light representaion of coords
	 * @param  {String}  			id
	 * @param  {String}  			type    of polygon: municipalities, dep...
	 */
	var Polygon = new Class( Observable, {
		
		initialize: function( map, config, isLight, id, type ){
			var // default colors
				defaultFillColor = rgbaToMSColor('rgba('+Polygon.baseRGB+',0.55)'),
				defaultStrokeColor = rgbaToMSColor('rgba('+Polygon.strokeRGB+',1)'),
				// color loading
				strokeThickness = config.strokeThickness || 1,
				locations = [],
				// Bing Polygon Options
				options

			this._highlightColor = rgbaToMSColor('rgba('+Polygon.baseRGB+',0)')
			this._fillColor = config.fillColor ?
					rgbaToMSColor(config.fillColor) :
					defaultFillColor,
			this._strokeColor = config.strokeColor ?
					rgbaToMSColor(config.strokeColor) :
					defaultStrokeColor


			options = {
				fillColor: this._fillColor,
				strokeColor: this._strokeColor,
				strokeThickness: strokeThickness
			}


			if( type != 'municipalities' ){
				//debugger;
				locations = this.generatePolygon( config.coords, isLight )
			}else{
				this.coords = config.coords
				this.isLight = isLight
			}


			this._polygon = new Microsoft.Maps.Polygon(
					locations,
					options
				)

			this._polygon.Polygon = this

			Microsoft.Maps.Events.addHandler(this._polygon, 'mouseover', this.highlightPolygon.bind(this))
			Microsoft.Maps.Events.addHandler(this._polygon, 'mouseout', this.restorePolygon.bind(this))
			// Microsoft.Maps.Events.addHandler(this._polygon, 'dblclick', this.panIntoView.bind(this))

			this.config = config
			this.id = id
			this.type = type
			this._map = map

			//debugger;
			this.createInfobox()
		},

		generatePolygon: function(coords, isLight){
			var joinedCoordinates,
				setLocations = ( typeof coords == 'undefined' )
			
			if( this.generated ) return;

			coords = coords || this.coords
			isLight = isLight || this.isLight

			joinedCoordinates = joinCoordinates(coords, isLight)
				
			// Extreme left top coordinate
			this._leftTopPoint = joinedCoordinates.leftTopPoint
			// Extreme right bottom coordinate
			this._rightBottomPoint = joinedCoordinates.rightBottomPoint
			
			// Fix to place the polygon always away from the filters box
			// (x0,y0)(x1,y1) -> (x0,y0-(y1-y0)/2)(x1,y1)
			this._leftTopPoint = [
				this._leftTopPoint[0]/* - (this._rightBottomPoint[0] - this._leftTopPoint[0]) / 2*/,
				this._leftTopPoint[1]/* - (this._rightBottomPoint[1] - this._leftTopPoint[1]) / 2*/
			]

			this._center = new Microsoft.Maps.Location(
				( this._leftTopPoint[0] + this._rightBottomPoint[0] ) / 2,
				( this._leftTopPoint[1] + this._rightBottomPoint[1] ) / 2)
			
			// Garbage collection
			this.coords = void(0);
			this.isLight = void(0);
			this.generated = true

			if( setLocations ){
				this._polygon.setLocations( joinedCoordinates.locations )
			}else{
				return joinedCoordinates.locations
			}
		},

		highlightPolygon: function(){
			this._polygon.setOptions({
				fillColor: this._highlightColor,
				strokeThickness: 2
				// zIndex: 1
				// strokeColor: new Microsoft.Maps.Color(255,255,255,255)
			})
		},

		restorePolygon: function(){
			this._polygon.setOptions({
				fillColor: this._fillColor,
				strokeThickness: 1
				// zIndex: 1
				// strokeColor: this._strokeColor
			})
		},

		getCoordinates: function(){
			// Fix to place the polygon always away from the filters box
			// (x0,y0)(x1,y1) -> (x0,y0-(y1-y0)/2)(x1,y1)
			if( !this.generated ) this.generatePolygon( this.coords, this.isLight )
				
			return [
				new Microsoft.Maps.Location(
					this._leftTopPoint[0],
					this._leftTopPoint[1] - (this._rightBottomPoint[1] - this._leftTopPoint[1]) / 2
				),
				new Microsoft.Maps.Location(this._rightBottomPoint[0],this._rightBottomPoint[1])
				]
		},

		setCoordinates: function(leftTopPoint, rightBottomPoint){
			this._leftTopPoint = leftTopPoint
			this._rightBottomPoint = rightBottomPoint
		},

		hide: function(){
			this._polygon.setOptions({
				visible: false
			})
			this._infobox.hide()
		},

		show: function(){
			this._polygon.setOptions({
				visible: true
			})
		},

		getPolygon: function(){
			this.generatePolygon()
			return this._polygon
		},

		getInfobox: function(){
			return this._infobox
		},

		createInfobox: function(){

			this._infobox = new Infobox('info', this._map, this, this.config.content)
			this._polygon.setOptions({
				infobox: this._infobox
			})
			return this._infobox
		},

		updateInfobox: function( obj, type ){
			//console.error(type)
			//debugger;
			//updateInfobox
			this._infobox.updateContent( obj, type )
			return this._infobox
		},

		panIntoView: function(){
			this._map.MapView.zoomToTerritory(this)
		},

		updateColor: function( color ){
			this._fillColor = this._strokeColor = rgbaToMSColor(color)
			this._polygon.setOptions({
				fillColor: this._fillColor/*,
				strokeColor: this._strokeColor*/
			})
		},

		select: function(){
			this.fireEvent('selected', this.id, this.type)
		}
	})

	Polygon.baseRGB = '200, 187, 137'
	Polygon.strokeRGB = '180, 160, 125'


	//::: Utilities :::
	
	/**
	 * Joins a group of coordinates in Bing Maps
	 * format
	 *
	 * @param  {Array}	coords		in JSON format
	 * @param  {Array}	[leftTopPoint]
	 * @param  {Array}	[rightBottomPoint]
	 * @return {Object}
	 *         {Array}	locations	coords in Microsoft.Maps.Location format
	 *         {Array}	leftTopPoint
	 *         {Arrya}	rightBottomPoint
	 */
	function joinCoordinates(coords, isLight){
		var i, j,
			locations = [],
			leftTopPoint, rightBottomPoint,
			max

		if(!isLight){
			leftTopPoint = [coords[0][0][1], coords[0][0][0]]
			rightBottomPoint = leftTopPoint
			max = Math.min(coords[0].length) // testing to limit polygons size
			for(i=0; i < max ; i++){
				locations[i] = new Microsoft.Maps.Location(coords[0][i][1], coords[0][i][0])
				leftTopPoint = [Math.min(leftTopPoint[0], coords[0][i][1]), Math.min(leftTopPoint[1], coords[0][i][0])]
				rightBottomPoint = [Math.max(rightBottomPoint[0], coords[0][i][1]), Math.max(rightBottomPoint[1], coords[0][i][0])]
			}
		}else{
			leftTopPoint = [coords[1], coords[0]]
			rightBottomPoint = leftTopPoint
			max = Math.min(coords.length) // testing to limit polygons size

			for(i=0, j=0; i < max; i+=2, j++){
				locations[j] = new Microsoft.Maps.Location(coords[i+1], coords[i])
				leftTopPoint = [Math.min(leftTopPoint[0], coords[i+1]), Math.min(leftTopPoint[1], coords[i])]
				rightBottomPoint = [Math.max(rightBottomPoint[0], coords[i+1]), Math.max(rightBottomPoint[1], coords[i])]
			}
		}

		return {
			locations: locations,
			leftTopPoint: leftTopPoint,
			rightBottomPoint: rightBottomPoint
		}
	}

	/**
	 * Turns an rgba color string into a MS Color
	 *
	 * @param  {String} color			rgba color
	 * @return {Microsoft.Maps.Color}   Microsoft Bing Maps Color
	 */
	function rgbaToMSColor(color){
		var colorArray = color.match(/\d+(?:\.\d+)?/g)
		return new Microsoft.Maps.Color( ~~(colorArray[3] * 255), colorArray[0], colorArray[1], colorArray[2] )
	}

	return Polygon
})