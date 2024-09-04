;(function(global){
	'use strict';
	
	function cloneObject( obj ){
		var hasOwn = Object.hasOwnProperty,
			key,
			newObj,
			prop,
			arr,
			i

		if( obj instanceof Function ){
			newObj = obj
		}else if( obj instanceof Array ){
			arr = []
			for(i=0;i<obj.length; i++){
				arr[i] = obj[i]
			}
			newObj = arr
		}else if( obj instanceof Number ){
			newObj = new Number(prop)
		}else if( obj instanceof String ){
			newObj = new String(prop)
		}else if( obj instanceof Object ){
			newObj = {}
			for(key in obj){
				if(hasOwn.call( obj, key )){
					prop = obj[key]
					if( prop instanceof Object ){
						newObj[key] = cloneObject( prop )
					}
				}
			}
		}else{
			newObj = obj
		}

		return newObj
	}
	/**
	 * Defines a new Class
	 * This is based in daClass https://github.com/jseros/daClass
	 * Mixed with http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain
	 *
	 * Pros:
	 *	- you can define an initialization function
	 *  - the prototype chain is respected
	 *  - the new class will be instanceof base and older bases
	 *  - you can define the properties of the class
	 *
	 * @param {Object} [base]  Constructor of the class to extend
	 * @param {Object} [properties]	Attributes of the class
	 */
	global['Class'] = function(base, properties){
		var prop

		// base is optional
		if( base && !properties ){
			properties = base
			base = null
		}

		function extend(Base, Class) {
			// Copy the prototype from the base to setup inheritance
			Class.prototype = new Base()
			// Remember the constructor property was set wrong, let's fix it
			Class.prototype.constructor = Class
		}

		function Clss(){
			if(base){
				base.call(this)
				// Assign the super prototype for convenient
				// invocation
			}
			
			if(properties){
				for( prop in properties ){
					if( properties.hasOwnProperty(prop) &&
						!( properties[prop] instanceof Function ) ) {
						
						if( !( properties[prop] instanceof Object ) ){
							this[prop] = properties[prop]
						}
						else{
							this[prop] = cloneObject( properties[prop] )
						}
					}
				}
			}

			if(Clss.prototype.initialize) Clss.prototype.initialize.apply(this, arguments)
		}

		//Extend the prototype and set the constructor right
		if(base) extend(base, Clss)
		
		if(properties){
			for( prop in properties ){
				if( properties.hasOwnProperty(prop) &&
					( properties[prop] instanceof Function ) ) {
					Clss.prototype[prop] = properties[prop]
					Clss._super_ = base.prototype
				}
			}
		}

		return Clss
	}


})(window);