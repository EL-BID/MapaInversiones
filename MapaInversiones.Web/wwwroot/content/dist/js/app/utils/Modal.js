/*global define*/
define(function(){
	var errorTemplate = doT.compile('<div class="error"><h1>Error</h1><p>{{=it.message***REMOVED******REMOVED***</p>'+
			'<div class="txt-right"><a class="button close">Cerrar</a></div></div>'),
		infoTemplate = doT.compile('<div class="info"><h1>Información</h1><p>{{=it.message***REMOVED******REMOVED***</p>'+
			'<div class="txt-right"><a class="button close">Cerrar</a></div></div>')
	
	function Modal(content){
		this.modal = $('<div>', {'class': 'modal'***REMOVED***)[0]
		this.back = $('<div>', {'class': 'back'***REMOVED***)[0]
		this.container = $('<div>', {'class': 'container'***REMOVED***)[0]
		this.wrapper = $('<div>', {'class': 'wrapper'***REMOVED***)[0]
		this.content = $('<div>', {'class': 'content'***REMOVED***)[0]

		if(typeof content == 'string')
			this.content.innerHTML = content
		//Zepto object or Element
		else if(typeof content == 'object'){
			$(this.content).append(content)
		***REMOVED***

		this.wrapper.appendChild(this.content)
		this.back.appendChild(this.wrapper)
		this.modal.appendChild(this.back)

		//Events
		$(this.wrapper).on('click', function(e){
			if (e.stopPropagation) e.stopPropagation()
			else e.cancelBubble = true
		***REMOVED***)
		$(this.back).on('click', this.hide.bind(this))
		$(this.wrapper).on('click', '.close', this.hide.bind(this))
	***REMOVED***
	Modal.prototype.addClass = function( className ){
		$(this.modal).addClass( className )
		return this
	***REMOVED***
	Modal.prototype.show = function(){
		$('html').css('overflow', 'hidden')
		document.body.appendChild(this.modal)
		this.modal.style.display = 'block'
	***REMOVED***
	Modal.prototype.hide = function(){
		$('html').css('overflow', 'visible')
		this.modal.style.display = 'none'
		try{
			document.body.removeChild(this.modal)
		***REMOVED***catch(e){***REMOVED***
	***REMOVED***
	Modal.prototype.getElement = function(){
		return this.modal
	***REMOVED***
	Modal.info = function( message ){
		return new Modal(infoTemplate({message: message***REMOVED***))
	***REMOVED***
	Modal.error = function( message ){
		return new Modal(errorTemplate({message: message***REMOVED***))
	***REMOVED***

	return Modal
***REMOVED***)