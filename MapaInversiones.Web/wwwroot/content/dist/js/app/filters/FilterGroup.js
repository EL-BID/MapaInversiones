/*global ko, define, Class*/
define(['lib/mvc/Observable', './Option'], function( Observable, Option ){
	"use strict";

	var defaultText = document.body.getAttribute('data-periods-default-text')

	var FilterGroup = new Class(Observable, {
		initialize: function( data ){
			var option, tempArray = []
			$.extend(this, data)

			this.options = ko.observableArray()

			for(var i=0; i<this.items.length; i++){
				option = new Option(this.items[i])
				option.active.subscribe(this.setActive.bind(this))
				option.on('require-activate', this.optionActivated.bind(this))
				option.on('options-changed', this.optionActivatedByUser.bind(this))
				tempArray[i] = option
			}
			tempArray.sort( this.alphabetSorting )
			
			this.options( tempArray )
			

			this.active = ko.observable(false)
			this.visible = ko.observable(false)

			this.optionChanged = ko.observable()


			this.elems = {}
			this.getNameStatus =  ko.computed(function(){
				var actived = '',
					option, 
					opts = this.options() 
			
				for(var i = opts.length; i--;){
					option = opts[i]
					if(option.active()) actived +=  option.name + ', '
				}

				if(actived)
					actived = '<span class="no-bold">' + this.name + ':  </span>' + actived.replace(/\,\s$/, '')
				else
					actived = this.name
				return actived
			}, this)

			this.getNameDefault =  ko.computed(function(){
				var actived = '',
					opts = this.options(),
					option

				for(var i = opts.length; i--;){
					option = opts[i]
					if(option.active()) actived +=  option.name + ', '
				}
				if(actived){
					actived = actived.replace(/\,\s$/, '')
				}
				else{
					actived = defaultText
				}
				return actived
			}, this)

			this.toggleVisibleBinded = this.toggleVisible.bind(this)
		},

		filter: function(){
		},

		toggleVisible: function(data, evt){
			var elem = evt && $(evt.target),
				isVisible = this.visible()

			if( elem ){
				this.elem = elem
			}
			
			this.onToggle()

			if(!isVisible){
				this.show()
			}else{
				if( evt ) evt.stopPropagation()
				this.hide()
			}

			if(evt instanceof Event){
				if(evt.stopPropagation){
					evt.stopPropagation()
				}else{
					window.event.cancelBubble = true
				}
			}
		},

		setActive: function(){
			var areActive = this.getActive()
			this.active(areActive.length)
			this.fireEvent('option-activated', this, areActive)
		},

		getActive: function(){
			var opts = this.options(),
				option,
				areActive = []
			for(var i = 0; i < opts.length; i++){
				option = opts[i]
				if(option.active()) areActive.push( option )
			}
			return areActive
		},

		disActive: function(){
			var opts = this.options(),
				option
			for(var i = opts.length; i--;){
				option = opts[i]
				if(option.active()) option.setActive(false)
			}
		},

		optionClicked: function(parent, evt){
			var target = evt.target,
				child = ko.dataFor(target)

			if($(evt.target).hasClass('option'))
				child.toggleActive()
		},

		optionActivated: function(options){
			this.fireEvent('activate-options-related', options)
		},

		optionActivatedByUser: function(option, stopBubbling){
			var opt,
				opts = this.getActive()

			for(var i = opts.length; i--;){
				opt = opts[i]
				if( this.parameter.indexOf('period') == -1 &&
					option.value !== opt.value ){
					opt.setActive( false, 'ignoreNotification' )
				}
			}
			
			if( !stopBubbling ){
				this.fireEvent('activated-by-user', this.parameter, this.getActive())
			}
		},

		getOptionByValue: function(value){
			var opts = this.options(), i = 0
			for(; i<opts.length; i++){
				if(opts[i].value === value)
					return opts[i]
			}
		},

		filterOptions: function(data, evt){
			var srt = evt.target.value,
				opts = this.options(),
				opt
			for(var i=0; i<opts.length; i++){
				opt = opts[i]
				opt.setVisibility(!srt || opt.name.score(srt) > 0)
			}
		},

		getQuery: function(){
			if(this.active()){
				var query = this.parameter + '=',
					opts = this.options(),
					option
				
				for(var i = opts.length; i--;){
					option = opts[i]
					if(option.active()) query +=  encodeURIComponent( option.value ) + ','
				}

				query = query.replace(/\,$/, '')

				return query
			}
			return ''
		},

		onToggle: function(){
			this.elem.parents('.filters-group')
				//hide all filters
				.find('.filter-group')
				.end()
				//clear the filter inputs
				.find('input')
					.val('').keyup()
		},

		hide: function(){
			var self = this

			this.onToggle()
			// this.elem.parents('.filters-group').find('input')
			// 		.val('').keyup()
			
			$(document).off('click', this.toggleVisibleBinded)
			
			self.visible( false )

			if(this.elem.hasClass('extra')){
				this.elem.next()
					.slideUp(200, function(){
						$(this).hide().parent()
							.removeClass('visible')
					})
			}else{
				this.elem.next().delay(100)
					.animate({width: 0}, 250, function(){
						$(this).hide().parent()
							.removeClass('visible')
						self.visible(false)
					})
			}
		},

		show: function(){
			var self = this

			this.onToggle()
			this.visible( true )

			if(this.elem.hasClass('extra')){
				this.elem.next()
					.slideDown(200)
				setTimeout(function(){
					$(document).on('click', self.toggleVisibleBinded)
				}, 10)
			}else{
				this.elem.next()
					.width(0)
					.show()
					.delay(100)
					.animate({width: 200}, 250)
			}
			this.elem.parent().addClass('visible')

			// SORTING
			this.fireEvent('filters-gonna-show', this)
		},

		alphabetSorting: function(left, right){
			return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1)
		},

		sortOptionsBy: function( fgsActive ){
			var opts = this.options(),
				option
			
			if( !this.filterByType ){
				this.filterByType = function( dependency ){
					var activedOptions
					for(var i=0; i<fgsActive.length; i++){
						activedOptions = fgsActive[i].getActive()
						for(var j=0; j<activedOptions.length; j++){
							if(	fgsActive[i].parameter == dependency.type &&
								activedOptions[j].value == dependency.id ){
								return true
							}
						}
					}
					return false
					// return dependency.type === type &&  dependency.id === id
				}
			}

			for(var i = opts.length; i--;){
				option = opts[i]
				if(!option.dependsOn){
					option.sortBy = 2+option.name
					option.important(false)
				}else{
					if( option.dependsOn.filter( this.filterByType ).length ){
						option.sortBy = 1+option.name
						option.important(true)
					}else{
						option.sortBy = 2+option.name
						option.important(false)
					}
				}
			}

			this.options.sort( function( left, right ) {
				return left.sortBy == right.sortBy ? 0 : (left.sortBy < right.sortBy ? -1 : 1)
			})
		},

		selectOption: function( id ) {
			var opts = this.options(),
				option
			
			for(var i = opts.length; i--;){
				option = opts[i]
				if( option.value == id ){
					option.setActive( true )
				}else if( this.parameter.indexOf('period') == -1 ){
					option.setActive( false, 'ignoreNotification' )
				}
			}
		}
	})

	return FilterGroup
})