/*global define, require, doT*/
/**
 * Services Module
 * Abastracts the API and facilitates the connectivity
 * and multi async communications (using promises)
 * The API is defined at: http://goo.gl/Vr8A1
 */
define(['./urlsMap',
		'../storage/Storage', 
		'app/utils/Modal',
		'lib/jquery/mockjax'
	],
	function(
		urls,
		Storage,
		Modal
	){
	var DEBUG_MODE = !!$(document.body).attr('data-debug'),
		_factoryCacheObj = {},
		ready = !DEBUG_MODE,
		queuedDebugQueries = [],
		appVersion = {},
		// global ajax promise for projects
		projectsSearching,
		isIE = /*@cc_on!@*/false || testCSS('msTransform'),
		root = DEBUG_MODE ? '' : window.location.protocol+'//'+window.location.host
		// root = 'http://172.16.78.69:29579'
	
	window.appVersion = {Name: 'Mapa Regalias', Version: '0.3.2'};

	//console.info(window.appVersion)

	if(DEBUG_MODE){

		//For testing purposes ;)
		//Filtros de búsqueda
		require(['app/network/debugQueries'], function(){
			ready = true
			if(queuedDebugQueries.length){
				for(var i=0; i< queuedDebugQueries.length; i++){
					var promise = _get(queuedDebugQueries[i].url, queuedDebugQueries[i].data, queuedDebugQueries[i].callback, queuedDebugQueries[i].errorCb)
					if(queuedDebugQueries[i].cb)
						promise.done(queuedDebugQueries[i].cb)
				}
			}
		})
	}


	function testCSS(prop) {
		return prop in document.documentElement.style;
	}


	/**
	 * Proxy function for easy comms
	 * @param  {String}		url
	 * @param  {Object}		data
	 * @param  {Function}	callback
	 * @param  {Function}	errorCb
	 * @return {jQuery.ajax}
	 */
	function _get(url, data, callback, errorCb){
		errorCb = errorCb || defaultErrorCb
		
		// if( typeof data == 'string' && !DEBUG_MODE) data = encodeURIComponent( data )
		//console.log('Ready---->', ready)
		
		//
		if(ready){
			//console.log('URL Request---> ', root+url)

			var request = $.ajax({
					url: root + url,
					data: data,
					settings: {
						cache: _factoryCache(
								url,
								data
							)
					}
				})

			//jQuery deffer success and error filters
			request.pipe(
					function(response, status){
						var modal
						// console.log( response, status )
						if(!response.status && status != 'abort'){
							modal = Modal.error(response.message)
							modal.show()
							if('console' in window){
								//window.console.log(response.message)
							}
						}else if(status != 'abort' && ('console' in window)){
							//window.console.log('Harmless Warning: Request Aborted')
						}
						if(response.status && response.message){
								modal = Modal.info(response.message)
								modal.show()
						}
						return response.status
					},
					function(response, status){
						var modal
						if(!response.status && status != 'abort'){
							if('console' in window){
								//window.console.log(response.message)
							}
						}else if(status != 'abort' && ('console' in window)){
							//window.console.log('Harmless Warning: Request Aborted')
						}
						if(response.message && status != 'abort'){
							var modal = Modal.error(response.message)
							modal.show()
						}
						return !response.status
					}
				)

			request.fail(errorCb)
				.error(errorCb)

			if(callback) request.done(callback)

			return request
		}else{
			queuedDebugQueries.push({
				url: url,
				data: data,
				callback: callback,
				errorCb: errorCb,
				done: function(callback){
					this.cb = this.cb || []
					this.cb.push(callback)
				}
			})
			return queuedDebugQueries[queuedDebugQueries.length-1]
		}

		
	}

	function _factoryCache(url, data){
		//Warning: IE7- has no JSON Object defined
		var key = url + '::' + JSON.stringify(data)
		
		if(_factoryCacheObj[key]){
			return true
		}
			
		_factoryCacheObj[key] = true
		return false
	}

	function defaultErrorCb(){
		//TODO error handling
	}

	$(document).on('click', '.submenu a', function(e){
		e.preventDefault()
		e.stopPropagation()

		var thishref = $(this).attr('href'),
			dataValue = $(this).attr('data-value')

		window.location.href = thishref

		$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo-'+dataValue)

		$('.buttons-filter-fiscalization a[data-value="'+dataValue+'"]').trigger('click')

	})

	$(document).on('click', '.buttons-filter-fiscalization a', function(e){
		e.preventDefault()
		var $this = $(this),
			dataValue = $this.attr('data-value'),
			$searchCampo = $('.filter-group[data-parameter=campoProyectoFiscalizacion] .filter-list input[type="text"]'),
			$buttonCampo = $('.filter-group[data-parameter=campoProyectoFiscalizacion] .filter-list .filter button'),
			$optionSelected = $('.filter-group[data-parameter=campoProyectoFiscalizacion] .filter-list .options .option.selected'),
			dataTextFilter = $this.attr('data-text-filter');

		$('.buttons-filter-fiscalization a').removeClass('active')
		$this.addClass('active')

		
		$('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text(dataTextFilter)


		if($searchCampo.val() != ""){
			//$searchCampo.val('')
			$optionSelected.trigger('click')
		}

		$('.filter-group[data-parameter=tipoRecursoNaturalFiscalizacion] .option[data-value="'+dataValue+'"]').trigger('click')

		
	})

	/*$(document).on('click', '.submenu li a', function(e){
		e.preventDefault()
		e.stopPropagation()
		
		$('#header .menu-item-fiscalizacion').trigger('click')
		$('.filter-group[data-parameter="tipoRecursoNaturalFiscalizacion"] .option[data-value="-1"]').trigger('click')
		$('#header .menu-item-fiscalizacion').trigger('click')

	})*/



	//////////////////////////////////////////////////////////////////
	// POLYGONS SERVICES
	//////////////////////////////////////////////////////////////////
	/**
	 * Le history:
	 * La idea es mantener el cache de los polígonos del localstorage,
	 * entonces la jugada es simplemente:
	 *	1. sacar
	 *		1.1 si no hay, pedir al servidor
	 *			1.1.1 guardar respuesta en localstorage
	 *		1.2 si hay, pedir al servidor con la fecha
	 *			1.2.1 si viene vacío, responder con LS
	 *			1.2.2 si no viene vacío, guardar respuesta en LS y responder
	 */

	/**
	 * Makes the request and handle the
	 * @param  {String}   type        whether is departments,regions,municipalities
	 * @param  {Function} callback
	 * @param  {Number}   lastUpdated the last date of modification
	 */
	function polygonsRequester(type, callback, polygonsData){
		var data = polygonsData && polygonsData.lastUpdated ?
			{lastUpdated: polygonsData.lastUpdated} : {}

		//console.log(urls[type])
		_get(urls[type], data, function(responseJSON){
			if( responseJSON.geojson &&
				responseJSON.geojson.features /*&&
				responseJSON.geojson.features.length*/ ){
				try{
					if(!isIE){
						Storage.storeDataList(responseJSON)
						callback(Storage.getDataList(type))
					}else{
						callback(responseJSON.geojson)
					}
				}catch(e){
					if('console' in window){
						//window.console.log('Harmless Warning: Quota Exceded!')
						//window.console.log('Harmless Warning: Quota exceded storing: ' + responseJSON )
					}
					if('localStorage' in window)
						window.localStorage.clear()
					callback(responseJSON.geojson)
				}
			}else{
				callback(polygonsData)
			}
		})
				// callback(polygonsData)
	}

	/**
	 * Interface for common actions to handling the data request
	 *
	 * @param  {String}   type     flag for data type
	 * @param  {Function} callback
	 */
	function loadInterface(type, callback){
		var polygonsData = Storage.getDataList(type)
		if(!polygonsData.features.length){
			polygonsRequester(type, callback)
		}else{
			polygonsRequester(type, callback, polygonsData)
		}
	}

	/**
	 * Loads the departments polygons data
	 *
	 * @param  {Function} callback [description]
	 */
	function loadDepartments(callback){
		loadInterface('departments', callback)
	}

	/**
	 * Loads the regions polygons data
	 *
	 * @param  {Function} callback [description]
	 */
	function loadRegions(callback){
		loadInterface('regions', callback)
	}

	/**
	 * Loads the municipalities polygons data
	 *
	 * @param  {Function} callback [description]
	 */
	function loadMunicipalities(callback){
		loadInterface('municipalities', callback)
	}

	function loadProjectFilters(){
		return _get(urls.filtersProjects)
	}

	function search( type, query, options ){
		var json
		options = options || {}
		//console.warn(type, query, options)
		if( type === 'Proyectos' ){
			if( options.isList ){
				return _get(urls['searchProjectsList'], query );
			}
			else{
				return _get(urls['searchProjects'], query );
			}
		}else if( type === 'Recursos' ){
			if( options.pushpins ){
				return _get(urls['infoboxesResources'], query );
			}
			else{
				return _get(urls['searchResources'], query );
			}
		}else if( type === 'Produccion' ){
			if( options.pushpins ){
				return _get(urls['infoboxesProduction'], query );
			}
			else{
				return _get(urls['searchProduction'], query );
			}
		}else if( type === 'Fiscalizacion' ){
			if( options.pushpins ){
				return _get(urls['infoboxesFiscalizacion'], query );
			}
			else{
				return _get(urls['searchFiscalizacion'], query );
			}
		}
	}

	function searchText( key ){
		return _get(urls.texts, {id: key})
	}

	function getConsolidated(paramsString){
		return _get(urls.consolidated, paramsString)
	}

	function getBudgetList(params){
		return _get(urls.getBudget, params)
	}
	function getDistributionList(params){
		return _get(urls.getDistribution, params)
	}
	function getOutlayList(params){
		return _get(urls.getOutlay, params)
	}
	function getAprovedList(params){
		return _get(urls.getAprovedProyects, params)
	}
	function getExecutedList(params){
		return _get(urls.getExecuted, params)
	}
	function getRegaliasList(params){
		return _get(urls.getRegalias, params)
	}
	function getValueAproved(params){
		return _get(urls.getValueAproved, params)
	}
	function getPerformance(params){
		return _get(urls.getPerformance, params)
	}

	function getConsolidatedResources(paramsString){
		return _get(urls.consolidatedResources, paramsString)
	}

	function getConsolidatedProduction(paramsString){
		return _get(urls.consolidatedProduction, paramsString)
	}

	function getConsolidatedFiscalizacion(paramsString){
		return _get(urls.consolidatedFiscalizacion, paramsString)
	}

	function getProductionInfo(paramsString){
		return _get(urls.getProductionInfo, paramsString)
	}
	function getFieldInfo(url, paramsString){
		return _get(url, paramsString)
	}

	function getProjectList(url){
		var split = url.split('?')
		return _get(split[0], split[1])
	}

	function sendByEmail( params ){
		return _get(urls.sendByEmail, params)
	}

	function getContratos(params) {
	    return _get(urls.getContratosContratista, params);
	}

	function getAnnioContratos(params) {
	    return _get(urls.getValorAnnioContratos, params)
	}
	function getGraficaContratos(params) {
	    return _get(urls.getContratosPerAnyo, params)
	}
	function getGraficaValorContratos(params) {
	    return _get(urls.getValorContratosPerAnyo, params)
	}
	function getGraficaContratosTipo(params) {
	    return _get(urls.getContratosPerTipo, params)
	}

	function getAnnioContratosProyecto(params) {
	    return _get(urls.getAnnioContratosProyecto, params)
	}

	return {
		polygons: {
			getDepartments: loadDepartments,
			getRegions: loadRegions,
			getMunicipalities: loadMunicipalities
		},
		
		filters: {
			forProjects: loadProjectFilters
		},

		search: search,

		resources: {
			presupuesto: getBudgetList,
			distribuido: getDistributionList,
			giros: getOutlayList,
			aprobado: getAprovedList,
			ejecutado: getExecutedList,
			regalias: getRegaliasList,
			valorAprobado: getValueAproved,
			rendimiento: getPerformance
		},

		production: {
			productionInfo: getProductionInfo,
			fieldInfo: getFieldInfo,
			aproved: getAprovedList
		},

		infograph: {
			consolidated: getConsolidated,
			resources: getConsolidatedResources,
			production: getConsolidatedProduction,
			fiscalizacion: getConsolidatedFiscalizacion
		},

		contratista: {
		    getGraficaContratos: getGraficaContratos,
		    getGraficaValorContratos: getGraficaValorContratos,
		    getGraficaContratosTipo: getGraficaContratosTipo,
		    getAnnioContratos: getAnnioContratos,
		    getContratos: getContratos,
		    getAnnioContratosProyecto: getAnnioContratosProyecto
		},

		projectsList: getProjectList,

		sendByEmail: sendByEmail,

		texts: searchText
	}
})