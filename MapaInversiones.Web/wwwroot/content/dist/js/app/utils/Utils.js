/*global define*/
define(function(){
	// No more console errors ¬¬
	if(!('console' in window)){
		window.console = {
			data: [],
			log: function(){
				this.data.push([].slice.call(arguments))
			},
			warn: function(){
				this.data.push([].slice.call(arguments))
			},
			error: function(){
				this.data.push([].slice.call(arguments))
			}
		}
	}


	return {
		// toCurrency: toCurrency
	}
})