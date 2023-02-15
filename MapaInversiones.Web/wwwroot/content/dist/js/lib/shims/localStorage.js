;(function(){
	_keys = {}
	if('Storage' in window){
		Storage.prototype.setObject = function(key, value){
			if(typeof value ==='object')
				this.setItem(key, JSON.stringify(value))
			else 
				this.setItem(key, value)
		}
		Storage.prototype.getObject = function(key){
			var val = this.getItem(key)
			try{
				val = JSON.parse(val)
			}catch(e){}
			return val
		}
		Storage.prototype.removeValue = Storage.prototype.removeItem
	}
	else{
		//just to make the others think that there is ls
		window.localStorage = {
			setValue: function(key, value){
				if(typeof value ==='object')
					_keys[key] = JSON.stringify(value)
				else 
					_keys[key] = value
			},
			getValue: function(key){
				var val = _keys[key]
				try{
					val = JSON.parse(val)
				}catch(e){}
				return val
			},
			removeValue: function(key){
				delete _keys[key]
			}
		}
	}
})();