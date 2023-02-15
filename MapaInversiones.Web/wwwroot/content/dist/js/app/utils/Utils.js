/*global define*/
define(function(){
	// No more console errors ¬¬
	if(!('console' in window)){
		window.console = {
			data: [],
			log: function(){
				this.data.push([].slice.call(arguments))
			***REMOVED***,
			warn: function(){
				this.data.push([].slice.call(arguments))
			***REMOVED***,
			error: function(){
				this.data.push([].slice.call(arguments))
			***REMOVED***
		***REMOVED***
	***REMOVED***


	return {
		// toCurrency: toCurrency
	***REMOVED***
***REMOVED***)