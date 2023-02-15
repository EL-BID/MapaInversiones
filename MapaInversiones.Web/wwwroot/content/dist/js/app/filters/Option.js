define(['lib/mvc/Observable'], function(Observable){
	var Option = new Class(Observable, {

		initialize: function(data){
			$.extend(this, data)
			this.active = ko.observable(false)
			this.visible = ko.observable(true)
			this.important = ko.observable(false)
		},

		toggleActive: function(){
			// debugger;
			this.active(!this.active())
			if(this.active() && this.dependsOn){
				this.fireEvent('require-activate', this.dependsOn)
			}

			//debugger;
			//
			// if(this.active()){
				// this.fireEvent('activated-by-user', this.value)
			// }
			this.fireEvent('options-changed', this)
		},

		setActive: function( bool, ignoreNotification ){

			//debugger;
			this.active( typeof bool == 'boolean' ? bool : true)
			if( !ignoreNotification ){
				this.fireEvent('options-changed', this, true)
			}
			if(this.dependsOn && this.active()){
				this.fireEvent('require-activate', this.dependsOn)
			}



		},

		setVisibility: function(bool){
			this.visible(bool)
		},

		getName: function(){
			return this.name //+ (this.dependsOn ? this.dependsOn[0].id : '')
		},
		getSubTipo: function(){
			//console.log(this);
			
			if(this.subTipo){
				return this.subTipo	
			}else{
				return 'none'
			}
			//return this.subTipo //+ (this.dependsOn ? this.dependsOn[0].id : '')
		},
		getValue: function(){
			//console.log(this);
			
			if(this.value){
				return this.value	
			}else{
				return 'none'
			}
			//return this.subTipo //+ (this.dependsOn ? this.dependsOn[0].id : '')
		}

	})

	return Option
})