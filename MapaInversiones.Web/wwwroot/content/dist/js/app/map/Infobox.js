/*global define, doT, Microsoft, Event*/
define(['app/network/Services',
		'app/utils/territories'
		],
		function(Services, territoriesCache){
	
	// Tooltip templates
	var ttTempl = {
			info: doT.compile($('#template-infobox-info')[0].innerHTML),
			project: doT.compile($('#template-infobox-project')[0].innerHTML),
			group: doT.compile($('#template-infobox-group')[0].innerHTML)
			//resource: doT.compile($('#template-infobox-resource')[0].innerHTML),
			//production: doT.compile($('#template-infobox-production')[0].innerHTML),
			//fiscalization: doT.compile($('#template-infobox-fiscalization')[0].innerHTML)
		}, lastMousePoint,
		// isIE8 = jQuery.browser.msie && jQuery.browser.version.match(/^8/),
		isIE9 = jQuery.browser.msie && jQuery.browser.version.match(/^9/),
		isIE10 = jQuery.browser.msie && jQuery.browser.version.match(/^10/),
		desCache = {},
		mapElem = $('#map-div'),
		mapWidth = mapElem[0].offsetWidth,
		mapHeight = mapElem[0].offsetHeight,
		mapTop = mapElem.offset().top

	//console.log('dot fis', fiscalization)

	$(window).on('resize', function(){
		mapWidth = mapElem[0].offsetWidth
		mapTop = mapElem.offset().top
	})

	function mouseDownHandler( evt ) {
		lastMousePoint = new Microsoft.Maps.Point(evt.getX(), evt.getY());
	}

	function pluralize( type ){
		if( type.indexOf('region') != -1 ) return 'regions'
		else if( type.indexOf('depart') != -1 ) return 'departments'
		else if( type.indexOf('municip') != -1 ) return 'municipalities'
		return type
	}

	function Infobox(type, map, entity, content){
		this._type = type
		this._map = map
		this._entity = entity
		this.name = content.name

		//debugger;

		if( !this.name ){
			if( territoriesCache[content.type] && territoriesCache[content.type][content.id]){
				this.name = territoriesCache[content.type][content.id].name
			}
		}

		
		content.name = this.name
		this._content = $.extend(null, content)

		Microsoft.Maps.Events.addThrottledHandler(entity._polygon || entity, 'click', this.clickHandler.bind(this), 200)
		// Microsoft.Maps.Events.addThrottledHandler(entity._polygon || entity, 'touchend', this.clickHandler.bind(this), 200)
		// Microsoft.Maps.Events.addThrottledHandler(entity._polygon || entity, 'touchstart', this.clickHandler.bind(this), 200)
		// Microsoft.Maps.Events.addThrottledHandler(entity._polygon || entity, 'tap', this.clickHandler.bind(this), 200)
		Microsoft.Maps.Events.addHandler(map, 'mousedown', mouseDownHandler);
		Microsoft.Maps.Events.addHandler(map, 'viewchange', this.hide.bind(this))


		if( content.image ){
			document.createElement('img').src = content.image
		}
	}

	function isGoingToExceedWidth(left, width, margin){
		margin = margin || 15
		return (left + width + margin) > mapWidth
	}

	function isGoingToExceedHeight(top, height, margin){
		margin = margin || -20
		// To not allow invisible parts
		if( top - height < mapTop ) return false
		return (top + height + margin) > (mapHeight + mapTop)
	}

	Infobox.prototype.show = function(e){
		// TODO no agregar el infobox por defecto
		// es no agregar los infobox sino hasta
		// mostrarlos
		var menuHeight = $('#header')[0].offsetHeight,
			location,
			pinLocation,
			deltaYResource = 0,
			deltaXResourceRight = 0,
			deltaYResourceBottom = 0,
			deltaXResourceLeft = 0

		if(this._map.visibleInfobox) this._map.visibleInfobox.hide()

		this.createElement()
		this._elem.appendTo(document.body)

		//debugger;
		
		if( !this._content.isResource &&
			!this._content.isProduction &&
			!this._content.isFiscalization &&
			this._type !== 'project' ){
			this._elem.find('.button').on('click', this.viewMoreHandler.bind(this))
		}
		this._elem.find('.help').on('click', this.viewHelpHandler.bind(this))
		this._elem.find('.close-help').on('click', this.hideHelpHandler.bind(this))
		
		//----------------------------------------
		// Polygons Infoboxes
		//----------------------------------------



		if( this._type == 'info' ||
			(this._type == 'resource' && !this._entity.getLocation) ||
			(this._type == 'production' && !this._entity.getLocation) ||
			(this._type == 'fiscalization' && !this._entity.getLocation) ){
			if(typeof e.pageX != 'number' || isNaN(e.pageX)){
				e.pageX = e.originalEvent.x
				e.pageY = e.originalEvent.y
			}
			if(isIE10 || isIE9){
				e.pageY = e.pageY + window.pageYOffset
			}

			//debugger;

			this._elem.css({
					display: 'block',
					// left: pinLocation.x,
					// top: pinLocation.y
					left: e.pageX,
					top: e.pageY
				})
				.removeClass('to-the-left')
				.removeClass('to-the-top')
				.addClass('polygon-type')
			
			if( isGoingToExceedWidth( e.pageX, this._elem[0].offsetWidth ) ){
				this._elem.css({
					left: e.pageX - this._elem[0].offsetWidth
				}).addClass('to-the-left to-the-left-2')
			}
			if( isGoingToExceedHeight( e.pageY, this._elem[0].offsetHeight ) ){
					this._elem.css({
						top: e.pageY - this._elem[0].offsetHeight
					}).addClass('to-the-top to-the-top-2')
			}
		}
		//----------------------------------------
		// Pushpins of Projects, Resources and Fiscalization
		//----------------------------------------
		else if(this._type == 'project' ||
			(this._type == 'resource' && this._entity.getLocation) ||
			(this._type == 'production' && this._entity.getLocation) ||
			(this._type == 'fiscalization' && this._entity.getLocation)){
			location = this._entity.getLocation(),
			pinLocation = this._map.tryLocationToPixel(location, Microsoft.Maps.PixelReference.control)

			if( this._type == 'resource' ){
				deltaYResource = 60
				deltaYResourceBottom = 35
				deltaXResourceRight = 0
				deltaXResourceLeft = 5
			}

			

			this._elem.css({
					display: 'block',
					left: pinLocation.x + deltaXResourceLeft + this._entity.radius,
					top: pinLocation.y + this._entity.radius
				})
				.removeClass('to-the-left')
				.removeClass('to-the-top')

			if( isGoingToExceedWidth( pinLocation.x + this._entity.radius, this._elem[0].offsetWidth ) ){
				this._elem.css({
					left: pinLocation.x - this._elem[0].offsetWidth - this._entity.radius
				}).addClass('to-the-left')
			}
			if( isGoingToExceedHeight( pinLocation.y, this._elem[0].offsetHeight, 40 ) ){
				this._elem.css({
					top: pinLocation.y - this._elem[0].offsetHeight
				}).addClass('to-the-top')
			}
			// if(window.outerWidth - pinLocation.x - this._elem[0].offsetWidth < 0){
			// }
			// if(window.outerHeight - pinLocation.y - this._elem[0].offsetHeight + menuHeight < 0){
			// }
		}
		//----------------------------------------
		// Pushpins of Groups
		//----------------------------------------
		else if(this._type == 'group'){
			location = this._entity.getLocation(),
			pinLocation = this._map.tryLocationToPixel(location, Microsoft.Maps.PixelReference.control)

			this._elem.css({
					display: 'block',
					left: pinLocation.x + this._entity.radius,
					top: pinLocation.y
				})
				.removeClass('to-the-left')
				.removeClass('to-the-top')
			// if(window.outerWidth - pinLocation.x - this._elem[0].offsetWidth < 0){
			if( isGoingToExceedWidth( pinLocation.x + this._entity.radius, this._elem[0].offsetWidth ) ){
				this._elem.css({
					left: pinLocation.x - this._elem[0].offsetWidth - this._entity.radius
				}).addClass('to-the-left')
			}
			// if(window.outerHeight - pinLocation.y - this._elem[0].offsetHeight + menuHeight < 0){
			// 		this._elem.css({
			// 			top: pinLocation.y - this._elem[0].offsetHeight + this._entity.radius
			// 		}).addClass('to-the-top')
			// }
		}
		
		//debugger;

		this._map.visibleInfobox = this
		this.visible = true


		if(e instanceof Event){
			if(e.stopPropagation){
				e.stopPropagation()
			}else{
				window.event.cancelBubble = true
			}
		}
	}

	Infobox.prototype.hide = function(){
		if( this._elem && this.visible ){
			this._elem.css({display: 'none'})
			this.visible = false
			this._elem.remove()
		}
	}


	Infobox.prototype.clickHandler = function( evt ){
		var point = new Microsoft.Maps.Point(evt.getX(), evt.getY()),
			dist = Math.sqrt(Math.pow(point.x-lastMousePoint.x,2), Math.pow(point.y-lastMousePoint.y,2))

		if(dist > 5) {
			return;
		}
		this.toggle(evt)

		if(evt instanceof Event){
			if(evt.stopPropagation){
				evt.stopPropagation()
			}else{
				window.event.cancelBubble = true
			}
		}
	}

	Infobox.prototype.viewMoreHandler = function( evt ){
		if( this._type == 'group' ){
			this._entity.viewGroupList({
				latitude: this._content.latitude,
				longitude: this._content.longitude
			})
			this.hide()
		}else{
			if(this._entity.panIntoView){
				evt = evt.originalEvent
				this._entity.panIntoView()
				if (evt.preventDefault) {
					evt.preventDefault()
				} else {
					evt.returnValue = false
				}
			}
			if(this._entity.select){
				this._entity.select()
			}
		}
		return false
	}

	Infobox.prototype.viewHelpHandler = function(evt){
		var helpCont = this._elem.find('.help-container'),
			that = $(evt.target),
			word = that.attr('data-type'),
			name = that.attr('data-name'),
			wCont = helpCont.find('.word'),
			dCont = helpCont.find('.description'),
			close = helpCont.find('.close-help'),
			self = this,
			bothWidth = 450

		if( wCont.html() ===  name && helpCont.is(':visible') ){
			this.hideHelpHandler()
			return false
		}

		function updateContent(){
			wCont.html( name )
			if( self._elem.offset().left + bothWidth - $(window).width() > 0 ){
				helpCont.addClass('to-the-left')
			}else{
				helpCont.removeClass('to-the-left')
			}
			if( desCache[ word ] ){
				setTimeout(function(){
					dCont.html( desCache[ word ] )
					helpCont
						.css({
							// width: 'auto',
							height: 'auto'
						})
						.find('.inner').css({
							position: 'static'
						})
					helpCont
						.css({
							width: helpCont.width(),
							height: helpCont.height()
						})
						.find('.inner').css({
							position: 'absolute'
						})
				});
			}else{
				dCont.html( 'cargando...' )
				Services.texts( word ).done(function( data ){
					desCache[ word ] = data.TextoParametrico
					dCont.html( data.TextoParametrico )
					helpCont
						.css({
							// width: 'auto',
							height: 'auto'
						})
						.find('.inner').css({
							position: 'static'
						})
					helpCont
						.css({
							width: helpCont.width(),
							height: helpCont.height()
						})
						.find('.inner').css({
							position: 'absolute'
						})
				})
			}
			helpCont.css({
					width: helpCont.width(),
					height: helpCont.height()
				})
				.find('.inner').css({
					position: 'absolute'
				})
			helpCont.animate({width: 'show'})
			close.delay(600).fadeIn()
		}
		if( helpCont.is(':visible') ){
			this.hideHelpHandler( updateContent )
		}else{
			updateContent()
		}

		return false
	}

	Infobox.prototype.hideHelpHandler = function( callback ){
		var helpCont = this._elem.find('.help-container'),
			close = helpCont.find('.close-help'),
			promise
		
		close.fadeOut(200)
		promise = helpCont.animate({width: 'hide'}).promise()
		if( typeof callback == 'function' ){
			promise.then( callback )
		}
	}

	Infobox.prototype.toggle = function(e){
		if(this.visible) this.hide(e)
		else this.show(e)
	}

	Infobox.prototype.updateContent = function(content, type){
		this._type = type || this._type
		content.name = this.name
		this._content = $.extend(null, content)
		if( this._elem ) this.hide()
	}

	Infobox.prototype.createElement = function(){
		var //type = "fiscalization",
			type = this._type,
			content = this._content,
			htmlContent = ttTempl[type] ?
				ttTempl[type](content) :
				content,
			tempElem = document.createElement('div')

		
		//console.log('this--------------------->', htmlContent, this._type)


		tempElem.innerHTML = htmlContent
		this._elem = tempElem.children[0]
		this._elem.style.display = 'none'
		this._elem = $(this._elem)
	}


	return Infobox

})