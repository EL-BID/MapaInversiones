/*global define*/
/**
 * Simple Observable Patter
 */
define(function(){
	
	var Observable = function(){
		this._events = {***REMOVED***
	***REMOVED***

	/**
	 * Add
	 * @param  {String***REMOVED***   evt      Event name
	 * @param  {Function***REMOVED*** callback Callback function
	 */
	Observable.prototype.on = function(evt, callback){
		if(!this._events[evt])
			this._events[evt] = []
		this._events[evt].push(callback)
	***REMOVED***

	/**
	 * Removes an observer (callback) from
	 * the specified event list
	 * @param  {String***REMOVED***   evt      event name
	 * @param  {Function***REMOVED*** callback
	 */
	Observable.prototype.off = function(evt, callback){
		var index
		if(this._events[evt] &&
			~(index = this._events[evt].indexOf(callback)))
			this._events[evt].splice(index, 1)
	***REMOVED***

	/**
	 * Fires the event. Callable with any numer of arguments,
	 * but first the event name
	 * @param  {String***REMOVED*** evt the event name
	 */
	Observable.prototype.fireEvent = function(evt){
		if(!this._events[evt])
			return
		for(var i=0; i<this._events[evt].length; i++)
			this._events[evt][i].apply(null, [].slice.call(arguments, 1))
	***REMOVED***

	return Observable
***REMOVED***)