/*global localStorage, define*/
define(function(){
	'use strict';
	var _keywordsMap = {
			status: 's',
			lastUpdated: 'l',
			type: 't',
			geojson: 'g',
			features: 'f',
			properties: 'p',
			LAT: 'LA',
			LON: 'LO',
			name: 'n',
			id: 'i',
			geometry: 'ge',
			coordinates: 'c'
		***REMOVED***

	/**
	 * Transform the JSON object to have the less possible quantity of [] and {***REMOVED***
	 * for storage
	 *
	 * @param  {Object***REMOVED*** object	raw object
	 * @return {Object***REMOVED***			optimized version
	 */
	function toLightFormat(object, parent){
		var light = {***REMOVED***,
			key, lcord = [], lcords = [],
			i, j, k,
			keysArray = [],
			storeKey = '_dnp_'

		for(key in object){
			if(object[key].constructor == Object){
				light[_keywordsMap[key]] = toLightFormat(object[key], object)
			***REMOVED***
			//this is only for coordinates
			else if(key == 'coordinates'){
				if(object.type == 'Polygon'){
					for(i=0, k=0; i < object[key][0].length; i++, k+=2){
						lcords[k] = object[key][0][i][0]
						lcords[k+1] = object[key][0][i][1]
					***REMOVED***
					light[_keywordsMap[key]] = lcords
				***REMOVED***else{
					for(i=0; i < object[key].length; i++){
						lcords = []
						for(j=0, k=0; j < object[key][i][0].length; j++, k+=2){
							lcords[k] = object[key][i][0][j][0]
							lcords[k+1] = object[key][i][0][j][1]
						***REMOVED***
						lcord[i] = lcords
					***REMOVED***
					light[_keywordsMap[key]] = lcord
				***REMOVED***
			***REMOVED***
			//if features (array)
			else if(key == 'features'){

				if(parent.type == 'municipio'){
					storeKey+='ml'
				***REMOVED***else if(parent.type == 'departamento'){
					storeKey+='dl'
				***REMOVED***else{
					storeKey+='rl'
				***REMOVED***

				var lastUpdated = +localStorage.getItem(storeKey+'_up')

				if(parent.lastUpdated > lastUpdated){
					//here we create an array of ids to link directly the elements
					//that will be stored in localStorage
					// light[_keywordsMap[key]] = [] // not necessary any moar
					for(i=0; i<object[key].length; i++){
						keysArray[i] = object[key][i].properties.id
						var poly = toLightFormat(object[key][i], object)
						_storeLightObject(poly)
					***REMOVED***

					var lsList = localStorage.getObject(storeKey)

					if(!lsList){
						localStorage.setObject(storeKey, keysArray)
					***REMOVED***
					else{
						for(i=0; i<keysArray.length; i++){
							if(lsList.indexOf(keysArray[i]) == -1)
								lsList.push(keysArray[i])
						***REMOVED***
						localStorage.setObject(storeKey, lsList)
					***REMOVED***

					//If there where data, is updated the modified
					localStorage.setItem(storeKey + '_up', parent.lastUpdated)
				***REMOVED***
			***REMOVED***
			else{
				light[_keywordsMap[key]] = object[key]
			***REMOVED***
		***REMOVED***

		return light
	***REMOVED***


	function _storeLightObject(object){
		var rootKey = '_dnp_'

		if(object.p.t == 'departamento'){
			rootKey += 'd_'+object.p.i
		***REMOVED***else if (object.p.t == 'municipio'){
			rootKey += 'm_'+object.p.i
		***REMOVED***else{
			rootKey += 'r_'+object.p.i
		***REMOVED***
		localStorage.setObject(rootKey, object)
	***REMOVED***

	function getDataList(type){
		var lKey, iKey, array = [],
			arrayIds

		if(type == 'departments'){
			lKey = '_dnp_dl'
			iKey = '_dnp_d_'
		***REMOVED***
		else if(type == 'municipalities'){
			lKey = '_dnp_ml'
			iKey = '_dnp_m_'
		***REMOVED***
		else{
			lKey = '_dnp_rl'
			iKey = '_dnp_r_'
		***REMOVED***

		arrayIds = localStorage.getObject(lKey) || []

		for(var i=0; i<arrayIds.length; i++){
			array[i] = localStorage.getObject(iKey + arrayIds[i])
		***REMOVED***

		return {
			features: array,
			lastUpdated: localStorage.getItem(lKey+'_up')
		***REMOVED***
	***REMOVED***

	return{
		storeDataList: toLightFormat,
		getDataList: getDataList
	***REMOVED***
***REMOVED***)