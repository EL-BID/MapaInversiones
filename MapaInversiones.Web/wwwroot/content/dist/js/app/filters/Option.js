define(['lib/mvc/Observable'], function(Observable){
	var Option = new Class(Observable, {

		initialize: function(data){
			$.extend(this, data)
			this.active = ko.observable(false)
			this.visible = ko.observable(true)
			this.important = ko.observable(false)
		***REMOVED***,

		toggleActive: function(){
			// debugger;
			this.active(!this.active())
			if(this.active() && this.dependsOn){
				this.fireEvent('require-activate', this.dependsOn)
			***REMOVED***

			//debugger;
			//
			// if(this.active()){
				// this.fireEvent('activated-by-user', this.value)
			// ***REMOVED***
			this.fireEvent('options-changed', this)
		***REMOVED***,

		setActive: function( bool, ignoreNotification ){

			//debugger;
			this.active( typeof bool == 'boolean' ? bool : true)
			if( !ignoreNotification ){
				this.fireEvent('options-changed', this, true)
			***REMOVED***
			if(this.dependsOn && this.active()){
				this.fireEvent('require-activate', this.dependsOn)
			***REMOVED***



		***REMOVED***,

		setVisibility: function(bool){
			this.visible(bool)
		***REMOVED***,

		getName: function(){
			return this.name //+ (this.dependsOn ? this.dependsOn[0].id : '')
		***REMOVED***,
		getSubTipo: function(){
			//console.log(this);
			
			if(this.subTipo){
				return this.subTipo	
			***REMOVED***else{
				return 'none'
			***REMOVED***
			//return this.subTipo //+ (this.dependsOn ? this.dependsOn[0].id : '')
		***REMOVED***,
		getValue: function(){
			//console.log(this);
			
			if(this.value){
				return this.value	
			***REMOVED***else{
				return 'none'
			***REMOVED***
			//return this.subTipo //+ (this.dependsOn ? this.dependsOn[0].id : '')
		***REMOVED***

	***REMOVED***)

	return Option
***REMOVED***)