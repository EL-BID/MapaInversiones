define(['app/network/Services','app/utils/Modal'], function( Services, Modal ){
	var mailButtons = $('[data-share-by-email]'),
		sharerContainer = $('<form class="mail-sharer">' +
			'<h3 class="title">Comparte por Correo Electrónico</h3>' +
			'<div class="field">' +
				'<label for="field-email">Correo electrónico:</label>' +
				'<input type="email" id="field-email" name="to">' +
			'</div>' +
			'<div class="field">' +
				'<label for="field-message">Mensaje:</label>' +
				'<textarea id="field-message" name="subject"></textarea>' +
			'</div>' +
			'<div class="txt-right"><button type="submit">Enviar</button></div>' +
			'<div class="loader"></div>' +
			'</form>')
	
	mailButtons.on('click', reveal )
	sharerContainer.on('submit', send )
	
	function reveal(){
		var $this = $(this)
		sharerContainer
			.appendTo(document.body)
			.css({
				left: $this.offset().left,
				top: $this.offset().top
			})
			.show()
		$(document).on('click', hide)
		return false
	}
	function send(evt){
		var pre = location.href + '\n\n'
		sharerContainer.addClass('loading')
		Services.sendByEmail(
				'to=' +
				encodeURIComponent( sharerContainer.find('#field-email').val() ) +
				'&body=' +
				encodeURIComponent( pre + sharerContainer.find('#field-message').val() )
			)
			.done( updateUserOk )
			.fail( updateUserError )

		if( evt.preventDefault ) evt.preventDefault()
		else evt.returnValue = false
		return false
	}
	function hide( evt ){
		if(!evt || $(evt.target).parents('.mail-sharer').length == 0 ){
			sharerContainer
				.hide()
				.detach()
			$(document).off('click', hide)
		}
	}

	function updateUserOk( response ){
		sharerContainer.removeClass('loading')
		
		if( !response.status ) return
		
		sharerContainer.find('#field-email').val('')
		sharerContainer.find('#field-message').val('')

		var message = response.message ||
			( 'Esta página ha sido compartida con éxito al correo: ' +
			sharerContainer.find('#field-email').val() + '.' )

		hide()
		Modal.info( message ).show()
	}
	function updateUserError(){
		sharerContainer.removeClass('loading')
		// hide()
	}
})