/*global define*/
/**
 * Simple Observable Patter
 */
define(function(){
	
	var Observable = function(){
		this._events = {}
	}

	/**
	 * Add
	 * @param  {String}   evt      Event name
	 * @param  {Function} callback Callback function
	 */
	Observable.prototype.on = function(evt, callback){
		if(!this._events[evt])
			this._events[evt] = []
		this._events[evt].push(callback)
	}

	/**
	 * Removes an observer (callback) from
	 * the specified event list
	 * @param  {String}   evt      event name
	 * @param  {Function} callback
	 */
	Observable.prototype.off = function(evt, callback){
		var index
		if(this._events[evt] &&
			~(index = this._events[evt].indexOf(callback)))
			this._events[evt].splice(index, 1)
	}

	/**
	 * Fires the event. Callable with any numer of arguments,
	 * but first the event name
	 * @param  {String} evt the event name
	 */
	Observable.prototype.fireEvent = function(evt){
		if(!this._events[evt])
			return
		for(var i=0; i<this._events[evt].length; i++)
			this._events[evt][i].apply(null, [].slice.call(arguments, 1))
	}

	return Observable
})