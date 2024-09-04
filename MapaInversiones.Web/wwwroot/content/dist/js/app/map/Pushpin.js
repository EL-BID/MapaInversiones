/*global define, Microsoft, Raphael*/
define(['./Infobox'/*, 'app/utils/allColors'*/], function( Infobox ){
	
	var colorsAssignation = {},
		indexAssignation = 0,
		isIE8 = jQuery.browser.msie && jQuery.browser.version.match(/^8/)
		// isIE10 = jQuery.browser.msie && jQuery.browser.version.match(/^10/),
		// isSafari = jQuery.browser.safari
		, resourcesColors = {
			municipio: '#F8921C',
			departamento: '#29ADEE',
			region: '#EC008E'
		}

	function panIntoView(){
		var coords =  this.getLocation()
		if( this._map ) this._map.setView({center: coords, zoom: 20})
	}

	function testCSS(prop) {
		return prop in document.documentElement.style;
	}

	function Pushpin( properties, bingMap, MapView ){
		var rootElem = document.createElement('div'),
			paper,
			width,
			x, y,
			htmlContent, radius,
			number = properties.count || 1,
			pushpin,
			textPosY,
			color

		rootElem.className = 'pushpin-container'
		rootElem.setAttribute('latLon', properties.latitude +','+ properties.longitude)

		// if( isIE10 || isSafari ){
		// 	rootElem.style.background = 'rgba(0,0,0,0)'
		// }

		if(number > 100) radius = 24
		else if(number > 10) radius = 18
		else radius = 14

		x = radius + 1
		y = radius + 1

		textPosY = number < 100 ? Math.round(radius * 0.68) : Math.round(radius * 0.62)

		// Firefox and IE8 draw the text upper
		if( navigator.userAgent.match(/firefox/ig) ){
			textPosY = Math.round(textPosY * 2)
		}
		if( isIE8 ){
			textPosY = Math.round(textPosY * 1.6)
		}

		width = radius * 2
		rootElem.style.width = width+2 + 'px'
		rootElem.style.height = width+2 + 'px'
		// rootElem.style.marginLeft = -radius + 'px'
		// rootElem.style.marginTop = -radius + 'px'

		paper = Raphael(rootElem, width+2, width+2)

		if( properties.isResource ){
			color = resourcesColors[ properties.type ]

			paper.circle(x, y, Math.round(radius * 1) ).attr({
				fill: color,
				stroke: color
			})
			paper.circle(x, y, Math.round(radius * 0.75)).attr({
				fill: color,
				stroke: '#fff',
				'stroke-width': 2
			})
		}else if( properties.isProduction || properties.isFiscalization ){
			color = (properties.Tipo == "NoCoM") ? '#E2E22F': '#29ADEC'
			paper.circle(x, y, Math.round(radius * 1) ).attr({
				fill: color,
				stroke: color
			})
			paper.circle(x, y, Math.round(radius * 0.75)).attr({
				fill: color,
				stroke: '#fff',
				'stroke-width': 2
			})
		}else{
			paper.circle(x, y, Math.round(radius * 1) ).attr({
			    fill: '#dd2400',
			    stroke: '#dd2400'
			})
			paper.circle(x, y, radius * 0.75).attr({
			    fill: '#dd2400',
				stroke: '#fff',
				'stroke-width': 2
			})
			paper.text(x, textPosY, number).attr({
			    stroke: '#dd2400',
				'stroke-width': 0,
				fill: '#fff',
				'text-anchor': 'middle',
				'font-size': '15px'
			})
		}

		htmlContent = rootElem.outerHTML

		pushpin = new Microsoft.Maps.Pushpin( properties, {
			htmlContent: htmlContent,
			zIndex: 99,
			anchor: new Microsoft.Maps.Point(x, y)
		})

		pushpin.map = bingMap

		if( properties.isResource ){
			pushpin._infobox = new Infobox('resource', bingMap, pushpin, properties)
		}else if( properties.isProduction ){
			pushpin._infobox = new Infobox('production', bingMap, pushpin, properties)
		}else if( properties.isFiscalization ){
			pushpin._infobox = new Infobox('fiscalization', bingMap, pushpin, properties)
		}else if(properties.type == 'project'){
			pushpin._infobox = new Infobox(properties.type, bingMap, pushpin, properties)
		}else{
			// If group in same place
			// Back misspelling ¬¬
			if( properties.UsanMismaGeorefenciacion ){
				pushpin._infobox = new Infobox(properties.type, bingMap, pushpin, properties)
			}else{
				//or simply a group to zoom
				Microsoft.Maps.Events.addHandler(pushpin, 'click', function(){
					bingMap.setView({
						zoom: bingMap.getZoom()+2,
						center: pushpin.getLocation()
					})
				})
			}
		}

		if( properties.url ){
			pushpin.panIntoView = panIntoView
		}

		pushpin.radius = radius

		pushpin.viewGroupList = function( dataGroup ){
			MapView.viewGroupList( dataGroup )
		}

		return pushpin
	}

	return Pushpin
})