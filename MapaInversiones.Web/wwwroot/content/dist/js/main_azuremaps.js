/*global define, window */
(function () {
	'use strict';



	// --- utils injected: rehydrate light features (Storage.storeDataList compact format) ---
	function _inflateCoordsPolygon(flat) {
		var ring = [];
		if (Array.isArray(flat)) {
			for (var i = 0; i < flat.length; i += 2) {
				var lon = flat[i], lat = flat[i + 1];
				if (Number.isFinite(lon) && Number.isFinite(lat)) {
					ring.push([lon, lat]);
				}
			}
		}
		if (ring.length && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
			ring.push([ring[0][0], ring[0][1]]);
		}
		return [ring];
	}

	function _rehydrateLightFeature(light) {
		if (!light) return null;
		if (light.type === 'Feature') return light;
		if (!(light.p && light.ge)) return null;

		var propsL = light.p || {};
		var geomL = light.ge || {};
		var props = {};
		for (var k in propsL) { if (Object.prototype.hasOwnProperty.call(propsL, k)) props[k] = propsL[k]; }
		if (propsL.n && !props.name) props.name = propsL.n;
		if (propsL.i && !props.id) props.id = propsL.i;
		if (propsL.t && !props.type) props.type = propsL.t;

		var geom = null;
		if (geomL.t === 'Polygon' && Array.isArray(geomL.c)) {
			geom = { type: 'Polygon', coordinates: _inflateCoordsPolygon(geomL.c) };
		} else if (geomL.t === 'MultiPolygon' && Array.isArray(geomL.c)) {
			var polys = [];
			for (var idx = 0; idx < geomL.c.length; idx++) {
				polys.push(_inflateCoordsPolygon(geomL.c[idx]));
			}
			geom = { type: 'MultiPolygon', coordinates: polys };
		} else if (geomL.type && geomL.coordinates) {
			// seems already a GeoJSON-like structure
			geom = geomL;
		} else {
			return null;
		}

		return { type: 'Feature', properties: props, geometry: geom };
	}
	// --- end injected utils ---
	// --- POLYFILL localStorage.getObject/setObject ---
	(function () {
		if (typeof Storage === 'undefined') return;
		if (!Storage.prototype.setObject) {
			Storage.prototype.setObject = function (key, value) {
				try { this.setItem(key, JSON.stringify(value)); } catch (e) { }
			};
		}
		if (!Storage.prototype.getObject) {
			Storage.prototype.getObject = function (key) {
				try {
					var v = this.getItem(key);
					return v == null ? null : JSON.parse(v);
				} catch (e) { return null; }
			};
		}
	})();


	function latLonToLonLat(obj) {
		function num(x) { return typeof x === 'number' && isFinite(x); }
		if (Array.isArray(obj)) {
			const a = obj;
			// [lon,lat] válido
			if (num(a[0]) && num(a[1]) && Math.abs(a[0]) <= 180 && Math.abs(a[1]) <= 90) return a;
			// [lat,lon] → invierte si es válido
			if (num(a[1]) && num(a[0]) && Math.abs(a[1]) <= 180 && Math.abs(a[0]) <= 90) return [a[1], a[0]];
			// inválido
			return null;
		}
		if (obj && typeof obj.latitude === 'number' && typeof obj.longitude === 'number') {
			const lon = obj.longitude, lat = obj.latitude;
			return (num(lon) && num(lat)) ? [lon, lat] : null;
		}
		return null;
	}

	function lonLatToLatLon(arr) {
		return { latitude: arr[1], longitude: arr[0] };
	}

	function throttle(fn, wait) {
		var last = 0, timer;
		return function () {
			var now = Date.now(),
				remaining = wait - (now - last),
				ctx = this,
				args = arguments;
			if (remaining <= 0) {
				clearTimeout(timer);
				timer = null;
				last = now;
				fn.apply(ctx, args);
			} else if (!timer) {
				timer = setTimeout(function () {
					last = Date.now();
					timer = null;
					fn.apply(ctx, args);
				}, remaining);
			}
		};
	}

	define('app/utils/Modal', ['jquery', 'doT'], function ($, doT) {
		var errorTemplate = doT.compile('<div class="error"><h1>Error</h1><p>{{=it.message}}</p>' +
			'<div class="txt-right"><a class="button close">Cerrar</a></div></div>'),
			infoTemplate = doT.compile('<div class="info"><h1>Información</h1><p>{{=it.message}}</p>' +
				'<div class="txt-right"><a class="button close">Cerrar</a></div></div>')

		function Modal(content) {
			this.modal = $('<div>', { 'class': 'modal' })[0]
			this.back = $('<div>', { 'class': 'back' })[0]
			this.container = $('<div>', { 'class': 'container' })[0]
			this.wrapper = $('<div>', { 'class': 'wrapper' })[0]
			this.content = $('<div>', { 'class': 'content' })[0]

			if (typeof content == 'string')
				this.content.innerHTML = content
			//Zepto object or Element
			else if (typeof content == 'object') {
				$(this.content).append(content)
			}

			this.wrapper.appendChild(this.content)
			this.back.appendChild(this.wrapper)
			this.modal.appendChild(this.back)

			//Events
			$(this.wrapper).on('click', function (e) {
				if (e.stopPropagation) e.stopPropagation()
				else e.cancelBubble = true
			})
			$(this.back).on('click', this.hide.bind(this))
			$(this.wrapper).on('click', '.close', this.hide.bind(this))
		}
		Modal.prototype.addClass = function (className) {
			$(this.modal).addClass(className)
			return this
		}
		Modal.prototype.show = function () {
			$('html').css('overflow', 'hidden')
			document.body.appendChild(this.modal)
			this.modal.style.display = 'block'
		}
		Modal.prototype.hide = function () {
			$('html').css('overflow', 'visible')
			this.modal.style.display = 'none'
			try {
				document.body.removeChild(this.modal)
			} catch (e) { }
		}
		Modal.prototype.getElement = function () {
			return this.modal
		}
		Modal.info = function (message) {
			return new Modal(infoTemplate({ message: message }))
		}
		Modal.error = function (message) {
			return new Modal(errorTemplate({ message: message }))
		}

		return Modal
	});

	/*global localStorage, define*/
	define('app/storage/Storage', [], function () {
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
		}

		/**
		 * Transform the JSON object to have the less possible quantity of [] and {}
		 * for storage
		 *
		 * @param  {Object} object	raw object
		 * @return {Object}			optimized version
		 */
		function toLightFormat(object, parent) {
			var light = {},
				key, lcord = [], lcords = [],
				i, j, k,
				keysArray = [],
				storeKey = '_dnp_'

			for (key in object) {
				if (object[key].constructor == Object) {
					light[_keywordsMap[key]] = toLightFormat(object[key], object)
				}
				//this is only for coordinates
				else if (key == 'coordinates') {
					if (object.type == 'Polygon') {
						for (i = 0, k = 0; i < object[key][0].length; i++, k += 2) {
							lcords[k] = object[key][0][i][0]
							lcords[k + 1] = object[key][0][i][1]
						}
						light[_keywordsMap[key]] = lcords
					} else {
						for (i = 0; i < object[key].length; i++) {
							lcords = []
							for (j = 0, k = 0; j < object[key][i][0].length; j++, k += 2) {
								lcords[k] = object[key][i][0][j][0]
								lcords[k + 1] = object[key][i][0][j][1]
							}
							lcord[i] = lcords
						}
						light[_keywordsMap[key]] = lcord
					}
				}
				//if features (array)
				else if (key == 'features') {

					if (parent.type == 'municipio') {
						storeKey += 'ml'
					} else if (parent.type == 'departamento') {
						storeKey += 'dl'
					} else {
						storeKey += 'rl'
					}

					var lastUpdated = +localStorage.getItem(storeKey + '_up')

					if (parent.lastUpdated > lastUpdated) {
						//here we create an array of ids to link directly the elements
						//that will be stored in localStorage
						// light[_keywordsMap[key]] = [] // not necessary any moar
						for (i = 0; i < object[key].length; i++) {
							keysArray[i] = object[key][i].properties.id
							var poly = toLightFormat(object[key][i], object)
							_storeLightObject(poly)
						}

						var lsList = localStorage.getObject(storeKey)

						if (!lsList) {
							localStorage.setObject(storeKey, keysArray)
						}
						else {
							for (i = 0; i < keysArray.length; i++) {
								if (lsList.indexOf(keysArray[i]) == -1)
									lsList.push(keysArray[i])
							}
							localStorage.setObject(storeKey, lsList)
						}

						//If there where data, is updated the modified
						localStorage.setItem(storeKey + '_up', parent.lastUpdated)
					}
				}
				else {
					light[_keywordsMap[key]] = object[key]
				}
			}

			return light
		}


		function _storeLightObject(object) {
			var rootKey = '_dnp_'

			if (object.p.t == 'departamento') {
				rootKey += 'd_' + object.p.i
			} else if (object.p.t == 'municipio') {
				rootKey += 'm_' + object.p.i
			} else {
				rootKey += 'r_' + object.p.i
			}
			localStorage.setObject(rootKey, object)
		}

		function getDataList(type) {
			var lKey, iKey, array = [],
				arrayIds

			if (type == 'departments') {
				lKey = '_dnp_dl'
				iKey = '_dnp_d_'
			}
			else if (type == 'municipalities') {
				lKey = '_dnp_ml'
				iKey = '_dnp_m_'
			}
			else {
				lKey = '_dnp_rl'
				iKey = '_dnp_r_'
			}

			arrayIds = localStorage.getObject(lKey) || []

			for (var i = 0; i < arrayIds.length; i++) {
				array[i] = localStorage.getObject(iKey + arrayIds[i])
			}

			return {
				features: array,
				lastUpdated: localStorage.getItem(lKey + '_up')
			}
		}

		return {
			storeDataList: toLightFormat,
			getDataList: getDataList
		}
	});


	/*global define, require, doT*/
	/**
	 * Services Module
	 * Abastracts the API and facilitates the connectivity
	 * and multi async communications (using promises)
	 * The API is defined at: http://goo.gl/Vr8A1
	 */
	define('app/network/Services', ['jquery', './urlsMap',
		'../storage/Storage',
		'app/utils/Modal'
	],
		function (
			$, urls,
			Storage,
			Modal
		) {
			var DEBUG_MODE = !!$(document.body).attr('data-debug'),
				_factoryCacheObj = {},
				ready = !DEBUG_MODE,
				queuedDebugQueries = [],
				appVersion = {},
				// global ajax promise for projects
				projectsSearching,
				isIE = /*@cc_on!@*/false || testCSS('msTransform'),
				root = DEBUG_MODE ? '' : window.location.protocol + '//' + window.location.host
			// root = 'http://172.16.78.69:29579'

			window.appVersion = { Name: 'Mapa Regalias', Version: '0.3.2' };

			//console.info(window.appVersion)

			if (DEBUG_MODE) {

				//For testing purposes ;)
				//Filtros de bsqueda
				require(['app/network/debugQueries'], function () {
					ready = true
					if (queuedDebugQueries.length) {
						for (var i = 0; i < queuedDebugQueries.length; i++) {
							var promise = _get(queuedDebugQueries[i].url, queuedDebugQueries[i].data, queuedDebugQueries[i].callback, queuedDebugQueries[i].errorCb)
							if (queuedDebugQueries[i].cb)
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
			function _get(url, data, callback, errorCb) {
				errorCb = errorCb || defaultErrorCb

				// if( typeof data == 'string' && !DEBUG_MODE) data = encodeURIComponent( data )
				//console.log('Ready---->', ready)

				//
				if (ready) {
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
					request.then(
						function (response, status) {
							var modal
							// console.log( response, status )
							if (!response.status && status != 'abort') {
								modal = Modal.error(response.message)
								modal.show()
								if ('console' in window) {
									//window.console.log(response.message)
								}
							} else if (status != 'abort' && ('console' in window)) {
								//window.console.log('Harmless Warning: Request Aborted')
							}
							if (response.status && response.message) {
								modal = Modal.info(response.message)
								modal.show()
							}
							return response.status
						},
						function (response, status) {
							var modal
							if (!response.status && status != 'abort') {
								if ('console' in window) {
									//window.console.log(response.message)
								}
							} else if (status != 'abort' && ('console' in window)) {
								//window.console.log('Harmless Warning: Request Aborted')
							}
							if (response.message && status != 'abort') {
								var modal = Modal.error(response.message)
								modal.show()
							}
							return !response.status
						}
					)

					request.fail(errorCb)
					//

					if (callback) request.done(callback)

					return request
				} else {
					queuedDebugQueries.push({
						url: url,
						data: data,
						callback: callback,
						errorCb: errorCb,
						done: function (callback) {
							this.cb = this.cb || []
							this.cb.push(callback)
						}
					})
					return queuedDebugQueries[queuedDebugQueries.length - 1]
				}


			}

			function _factoryCache(url, data) {
				//Warning: IE7- has no JSON Object defined
				var key = url + '::' + JSON.stringify(data)

				if (_factoryCacheObj[key]) {
					return true
				}

				_factoryCacheObj[key] = true
				return false
			}

			function defaultErrorCb() {
				//TODO error handling
			}

			$(document).on('click', '.submenu a', function (e) {
				e.preventDefault()
				e.stopPropagation()

				var thishref = $(this).attr('href'),
					dataValue = $(this).attr('data-value')

				window.location.href = thishref

				$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo-' + dataValue)

				$('.buttons-filter-fiscalization a[data-value="' + dataValue + '"]').trigger('click')

			})

			$(document).on('click', '.buttons-filter-fiscalization a', function (e) {
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


				if ($searchCampo.val() != "") {
					//$searchCampo.val('')
					$optionSelected.trigger('click')
				}

				$('.filter-group[data-parameter=tipoRecursoNaturalFiscalizacion] .option[data-value="' + dataValue + '"]').trigger('click')


			})


			//////////////////////////////////////////////////////////////////
			// POLYGONS SERVICES
			//////////////////////////////////////////////////////////////////
			/**
			 * Le history:
			 * La idea es mantener el cache de los polgonos del localstorage,
			 * entonces la jugada es simplemente:
			 *	1. sacar
			 *		1.1 si no hay, pedir al servidor
			 *			1.1.1 guardar respuesta en localstorage
			 *		1.2 si hay, pedir al servidor con la fecha
			 *			1.2.1 si viene vaco, responder con LS
			 *			1.2.2 si no viene vaco, guardar respuesta en LS y responder
			 */

			/**
			 * Makes the request and handle the
			 * @param  {String}   type        whether is departments,regions,municipalities
			 * @param  {Function} callback
			 * @param  {Number}   lastUpdated the last date of modification
			 */
			function polygonsRequester(type, callback, polygonsData) {
				var data = polygonsData && polygonsData.lastUpdated ?
					{ lastUpdated: polygonsData.lastUpdated } : {}

				//console.log(urls[type])
				_get(urls[type], data, function (responseJSON) {
					if (responseJSON.geojson &&
						responseJSON.geojson.features /*&&
				responseJSON.geojson.features.length*/ ) {
						try {
							if (!isIE) {
								Storage.storeDataList(responseJSON)
								callback(Storage.getDataList(type))
							} else {
								callback(responseJSON.geojson)
							}
						} catch (e) {
							if ('console' in window) {
								//window.console.log('Harmless Warning: Quota Exceded!')
								//window.console.log('Harmless Warning: Quota exceded storing: ' + responseJSON )
							}
							if ('localStorage' in window)
								window.localStorage.clear()
							callback(responseJSON.geojson)
						}
					} else {
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
			function loadInterface(type, callback) {
				var polygonsData = Storage.getDataList(type)
				if (!polygonsData.features.length) {
					polygonsRequester(type, callback)
				} else {
					polygonsRequester(type, callback, polygonsData)
				}
			}

			/**
			 * Loads the departments polygons data
			 *
			 * @param  {Function} callback [description]
			 */
			function loadDepartments(callback) {
				loadInterface('departments', callback)
			}

			/**
			 * Loads the regions polygons data
			 *
			 * @param  {Function} callback [description]
			 */
			function loadRegions(callback) {
				loadInterface('regions', callback)
			}

			/**
			 * Loads the municipalities polygons data
			 *
			 * @param  {Function} callback [description]
			 */
			function loadMunicipalities(callback) {
				loadInterface('municipalities', callback)
			}

			function loadProjectFilters() {
				return _get(urls.filtersProjects)
			}

			function search(type, query, options) {
				var json
				options = options || {}
				//console.warn(type, query, options)
				if (type === 'Proyectos') {
					if (options.isList) {
						return _get(urls['searchProjectsList'], query);
					}
					else {
						return _get(urls['searchProjects'], query);
					}
				} else if (type === 'Recursos') {
					if (options.pushpins) {
						return _get(urls['infoboxesResources'], query);
					}
					else {
						return _get(urls['searchResources'], query);
					}
				} else if (type === 'Produccion') {
					if (options.pushpins) {
						return _get(urls['infoboxesProduction'], query);
					}
					else {
						return _get(urls['searchProduction'], query);
					}
				} else if (type === 'Fiscalizacion') {
					if (options.pushpins) {
						return _get(urls['infoboxesFiscalizacion'], query);
					}
					else {
						return _get(urls['searchFiscalizacion'], query);
					}
				}
			}

			function searchText(key) {
				return _get(urls.texts, { id: key })
			}

			function getConsolidated(paramsString) {
				return _get(urls.consolidated, paramsString)
			}

			function getBudgetList(params) {
				return _get(urls.getBudget, params)
			}
			function getDistributionList(params) {
				return _get(urls.getDistribution, params)
			}
			function getOutlayList(params) {
				return _get(urls.getOutlay, params)
			}
			function getAprovedList(params) {
				return _get(urls.getAprovedProyects, params)
			}
			function getExecutedList(params) {
				return _get(urls.getExecuted, params)
			}
			function getRegaliasList(params) {
				return _get(urls.getRegalias, params)
			}
			function getValueAproved(params) {
				return _get(urls.getValueAproved, params)
			}
			function getPerformance(params) {
				return _get(urls.getPerformance, params)
			}

			function getConsolidatedResources(paramsString) {
				return _get(urls.consolidatedResources, paramsString)
			}

			function getConsolidatedProduction(paramsString) {
				return _get(urls.consolidatedProduction, paramsString)
			}

			function getConsolidatedFiscalizacion(paramsString) {
				return _get(urls.consolidatedFiscalizacion, paramsString)
			}

			function getProductionInfo(paramsString) {
				return _get(urls.getProductionInfo, paramsString)
			}
			function getFieldInfo(url, paramsString) {
				return _get(url, paramsString)
			}

			function getProjectList(url) {
				var split = url.split('?')
				return _get(split[0], split[1])
			}

			function sendByEmail(params) {
				return _get(urls.sendByEmail, params)
			}

			function getGraficaContratos(params) {
				return _get(urls.getContratosPerAnyo, params)
			}

			function getGraficaValorContratos(params) {
				return _get(urls.getValorContratosPerAnyo, params)
			}
			function getAnnioContratos(params) {
				return _get(urls.getValorAnnioContratos, params)
			}

			function getContratos(params) {
				return _get(urls.getContratosContratista, params);
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
		});

	define('app/map/Polygon', [], function () {
		function Polygon(coordsLatLon, options) {
			this._type = 'polygon';
			this._options = options || {};
			this._fillColor = this._options.fillColor || 'rgba(0,0,0,0.3)';
			this._strokeColor = this._options.strokeColor || 'rgba(0,0,0,1)';
			this._strokeWidth = this._options.strokeThickness || 1;

			var ringLonLat = (coordsLatLon || []).map(function (c) {
				return latLonToLonLat(Array.isArray(c) ? c : [c.latitude, c.longitude]);
			}).filter(Boolean);

			if (!ringLonLat.length) { this._feature = null; return; }
			if (ringLonLat.length &&
				(ringLonLat[0][0] !== ringLonLat[ringLonLat.length - 1][0] ||
					ringLonLat[0][1] !== ringLonLat[ringLonLat.length - 1][1])) {
				ringLonLat.push([ringLonLat[0][0], ringLonLat[0][1]]);
			}

			this._feature = new atlas.data.Feature(
				new atlas.data.Polygon([ringLonLat]),
				{ __kind: 'polygon' }
			);
		}

		Polygon.prototype.getPolygon = function () {
			return this._feature;
		};

		Polygon.prototype.setOptions = function (opts) {
			opts = opts || {};
			if (opts.fillColor) this._fillColor = opts.fillColor;
			if (opts.strokeColor) this._strokeColor = opts.strokeColor;
			if (typeof opts.strokeThickness === 'number') this._strokeWidth = opts.strokeThickness;
		};

		Polygon.prototype.getStyle = function () {
			return {
				fillColor: this._fillColor,
				strokeColor: this._strokeColor,
				strokeWidth: this._strokeWidth
			};
		};

		return Polygon;
	});

	define('app/map/Pushpin', [], function () {
		function Pushpin(latLon, options) {
			this._type = 'pin';
			this._options = options || {};
			var lonlat = latLonToLonLat(Array.isArray(latLon) ? latLon : [latLon.latitude, latLon.longitude]);
			if (!lonlat) { this._feature = null; return; }
			this._feature = new atlas.data.Feature(
				new atlas.data.Point(lonlat),
				{
					__kind: 'pin',
					title: (this._options.title || ''),
					subTitle: (this._options.subTitle || '')
				}
			);
		}

		Pushpin.prototype.getShape = function () {
			return this._feature;
		};

		Pushpin.prototype.setOptions = function (opts) {
			this._options = Object.assign(this._options, opts || {});
		};

		return Pushpin;
	});

	define('app/map/Infobox', [], function () {
		function Infobox() {
			this._popup = new atlas.Popup({ pixelOffset: [0, -18], closeButton: true });
			this._open = false;
		}

		Infobox.prototype.setOptions = function (opts) {
			opts = opts || {};
			if (opts.location) {
				var ll = latLonToLonLat(Array.isArray(opts.location) ? opts.location : [opts.location.latitude, opts.location.longitude]);
				this._position = ll;
			}
			if (typeof opts.visible === 'boolean') {
				this._open = opts.visible;
			}
			if (opts.htmlContent) {
				this._content = opts.htmlContent;
			}
		};

		Infobox.prototype.attach = function (map) {
			this._map = map;
			if (this._open) {
				this._popup.setOptions({ position: this._position, content: this._content });
				this._popup.open(map);
			}
		};

		Infobox.prototype.open = function (map, lonlat, html) {
			this._popup.setOptions({ position: lonlat, content: html });
			this._popup.open(map);
		};

		Infobox.prototype.close = function () {
			this._popup.close();
		};

		return Infobox;
	});

	define('app/map/Map', ['lib/mvc/Observable', './Polygon', './Pushpin', './Infobox'],
		function (Observable, Polygon, Pushpin, Infobox) {

			function EntitiesCollection(ds) {
				this._items = [];
				this._ds = ds;
			}

			EntitiesCollection.prototype.push = function (item) {
				var feature, style = null;
				if (item && item.type === 'Feature') {
					feature = item;
				} else if (item && item._type === 'polygon') {
					feature = item.getPolygon();
					style = item.getStyle();
				} else if (item && item._type === 'pin') {
					feature = item.getShape();
				}
				if (!feature) return;

				this._items.push(feature);
				this._ds.add(feature);

				if (style && feature && feature.properties) {
					feature.properties.__fill = style.fillColor || 'rgba(0,0,0,0.3)';
					feature.properties.__stroke = style.strokeColor || 'rgba(0,0,0,1)';
					var sw = Number(style.strokeWidth);
					feature.properties.__strokeWidth = Number.isFinite(sw) ? sw : 1;
				}
				return feature;
			};

			EntitiesCollection.prototype.remove = function (item) {
				var idx = this._items.indexOf(item);
				if (idx >= 0) {
					this._items.splice(idx, 1);
				}
				this._ds.remove(item);
			};

			EntitiesCollection.prototype.clear = function () {
				this._items.length = 0;
				this._ds.clear();
			};

			function Map(elementId, options) {
				options = options || {};
				if (!window.atlas) {
					throw new Error('Azure Maps SDK (atlas) no encontrado.');
				}

				function normalizeCenter(c) {
					return Array.isArray(c) ? c : [c.longitude, c.latitude];
				}

				var center = options.center ?
					latLonToLonLat(normalizeCenter(options.center)) :
					[-74.1, 4.65];

				var zoom = typeof options.zoom === 'number' ? options.zoom : 5;

				var authOptions = options.authOptions || {
					authType: 'subscriptionKey',
					subscriptionKey: ''
				};

				this._map = new atlas.Map(elementId, {
					center: center,
					zoom: zoom,
					style: options.style || 'road',
					view: options.view || 'Auto',
					authOptions: authOptions
				});

				// Store initial camera to force after 'ready' (fix initial centering on some layouts)
				this._initialCamera = { center: center, zoom: zoom };

				var ds = new atlas.source.DataSource();
				//// Fuente de datos con clustering activado
				//var ds = new atlas.source.DataSource(null, {
				//	cluster: true,        // 🔹 activa clustering
				//	clusterRadius: 45     // distancia en px para agrupar pines
				//});
				this._dataSource = ds;

				var polygonLayer = new atlas.layer.PolygonLayer(ds, null, {
					fillColor: ['coalesce', ['get', '__fill'], 'rgba(0,0,0,0.3)'],
					strokeColor: ['coalesce', ['get', '__stroke'], 'rgba(0,0,0,1)'],
					strokeWidth: ['coalesce', ['get', '__strokeWidth'], 1]
				});
				var lineLayer = new atlas.layer.LineLayer(ds, null, {
					strokeColor: ['coalesce', ['get', '__stroke'], 'rgba(0,0,0,1)'],
					strokeWidth: ['coalesce', ['get', '__strokeWidth'], 1]
				});
				var symbolLayer = new atlas.layer.SymbolLayer(ds, null, {
					iconOptions: { image: 'marker-blue', allowOverlap: true, ignorePlacement: true },
					textOptions: { allowOverlap: true, ignorePlacement: true, textField: ['get', 'title'], offset: [0, -1.2] }
				});

				this.entities = new EntitiesCollection(ds);
				this._popup = new Infobox();

				var self = this;
				this._ready = false;
				this._readyCbs = [];

				function onReady() {
					self._ready = true;
					// Add sources/layers only when ready
					self._map.sources.add(ds);
					self._map.layers.add([polygonLayer, lineLayer, symbolLayer]);
					// Popup único reutilizable
					if (!self._azPopup) {
						self._azPopup = new atlas.Popup({ pixelOffset: [0, -30] });
					}
					self._popup.attach(self._map);
					//alert(ds);

					self._map.events.add('click', symbolLayer, function (e) {
						if (!e.shapes || e.shapes.length === 0) return;


						var shape = e.shapes[0];
						var props = shape.getProperties ? shape.getProperties() : (shape.properties || {});
						console.log("Props del pin:", props);

						var type = props.Type;
						var nombretype = props.name;
						var id = props.id;
						if (!type) {
							console.warn('El pin no tiene type (props):', props);
							return;
						}


						if (type == "Departamento") {
							fetch(`/api/serviciosproyectos/listado?departamento=${id}`)
								.then(res => res.json())
								.then(data => {
									var items = Array.isArray(data) ? data : (data && data.objects) ? data.objects : [];
									var html = `<div class="wrap-list-proyectos">
									<h3>Proyectos encontrados en <span class="color-text">${nombretype}</span> </h3>`;

									if (items.length > 0) {
										html += `<ul class="azure-popu-list">` +
											items.map(p => {
												var nombre = p.name;
												var url = p.url;
												return `<li class="azure-popu-list-item"><a class="azure-popu-link" href="${url}" target="_blank" rel="noopener">${nombre}</a></li>`;
											}).join('') +
											`</ul>`;
									} else {
										html += `<div>No hay proyectos</div>`;
									}
									html += `</div>`;

									// ====================
									// Determinar coordenadas del shape (siempre algo válido)
									// ====================
									var pos = null;

									// 1. Caso normal: un pin (Point)
									if (shape.getCoordinates) {
										pos = shape.getCoordinates();
									} else if (shape.geometry && shape.geometry.coordinates) {
										pos = shape.geometry.coordinates;
									}

									// 2. Si vino como array anidado (ej. [[lon,lat],[lon,lat],...]) → polígono o línea
									if (Array.isArray(pos) && Array.isArray(pos[0])) {
										if (Array.isArray(pos[0][0])) {
											// Caso polígono con anillo: [[ [lon,lat], [lon,lat], ... ]]
											var ring = pos[0];
											var lon = 0, lat = 0;
											ring.forEach(coord => { lon += coord[0]; lat += coord[1]; });
											pos = [lon / ring.length, lat / ring.length]; // centroide simple
										} else {
											// Caso línea: [ [lon,lat], [lon,lat], ... ]
											var line = pos;
											var mid = Math.floor(line.length / 2);
											pos = line[mid]; // punto intermedio
										}
									}

									// 3. Si aún no hay posición válida, usar coordenadas del click
									if (!pos || !Array.isArray(pos) || pos.length < 2) {
										if (e.position) {
											// convertir pixel → coordenadas de mapa
											pos = self._map.pixelToPosition(e.position);
										}
									}

									// ====================
									// Mostrar popup (siempre algo)
									// ====================
									if (pos && Array.isArray(pos) && pos.length >= 2 && !isNaN(pos[0]) && !isNaN(pos[1])) {
										console.log("📍 Pos final para popup:", pos);
										self._azPopup.setOptions({ position: [pos[0], pos[1]], content: html });
										self._azPopup.open(self._map);
									} else {
										console.error("❌ No se pudo calcular ninguna posición para el popup, usando centro del mapa");
										self._azPopup.setOptions({ position: self._map.getCamera().center, content: html });
										self._azPopup.open(self._map);
									}



									self._azPopup.setOptions({ position: [pos[0], pos[1]], content: html });
									self._azPopup.open(self._map);
								})
								.catch(err => console.error("Error al cargar proyectos:", err));
						}
						if (type == "municipio") {
							fetch(`/api/serviciosproyectos/listado?municipio=${id}`)
								.then(res => res.json())
								.then(data => {
									var items = Array.isArray(data) ? data : (data && data.objects) ? data.objects : [];
									var html = `<div class="wrap-list-proyectos">
					<h3>Proyectos encontrados en <span class="color-text">${nombretype}</span> </h3>`;

									if (items.length > 0) {
										html += `<ul class="azure-popu-list">` +
											items.map(p => {
												var nombre = p.name;
												var url = p.url;
												return `<li class="azure-popu-list-item"><a class="azure-popu-link" href="${url}" target="_blank" rel="noopener">${nombre}</a></li>`;
											}).join('') +
											`</ul>`;
									} else {
										html += `<div>No hay proyectos</div>`;
									}
									html += `</div>`;


									// ====================
									// Determinar coordenadas del shape (siempre algo válido)
									// ====================
									var pos = null;

									// 1. Caso normal: un pin (Point)
									if (shape.getCoordinates) {
										pos = shape.getCoordinates();
									} else if (shape.geometry && shape.geometry.coordinates) {
										pos = shape.geometry.coordinates;
									}

									// 2. Si vino como array anidado (ej. [[lon,lat],[lon,lat],...]) → polígono o línea
									if (Array.isArray(pos) && Array.isArray(pos[0])) {
										if (Array.isArray(pos[0][0])) {
											// Caso polígono con anillo: [[ [lon,lat], [lon,lat], ... ]]
											var ring = pos[0];
											var lon = 0, lat = 0;
											ring.forEach(coord => { lon += coord[0]; lat += coord[1]; });
											pos = [lon / ring.length, lat / ring.length]; // centroide simple
										} else {
											// Caso línea: [ [lon,lat], [lon,lat], ... ]
											var line = pos;
											var mid = Math.floor(line.length / 2);
											pos = line[mid]; // punto intermedio
										}
									}

									// 3. Si aún no hay posición válida, usar coordenadas del click
									if (!pos || !Array.isArray(pos) || pos.length < 2) {
										if (e.position) {
											// convertir pixel → coordenadas de mapa
											pos = self._map.pixelToPosition(e.position);
										}
									}

									// ====================
									// Mostrar popup (siempre algo)
									// ====================
									if (pos && Array.isArray(pos) && pos.length >= 2 && !isNaN(pos[0]) && !isNaN(pos[1])) {
										console.log("📍 Pos final para popup:", pos);
										self._azPopup.setOptions({ position: [pos[0], pos[1]], content: html });
										self._azPopup.open(self._map);
									} else {
										console.error("❌ No se pudo calcular ninguna posición para el popup, usando centro del mapa");
										self._azPopup.setOptions({ position: self._map.getCamera().center, content: html });
										self._azPopup.open(self._map);
									}





									self._azPopup.setOptions({ position: [pos[0], pos[1]], content: html });
									self._azPopup.open(self._map);
								})
								.catch(err => console.error("Error al cargar proyectos:", err));
						}

					});

				}
				this._map.events.add('ready', onReady);

				this.onReady = function (cb) {
					if (self._ready) { cb(); } else { self._readyCbs.push(cb); }
				};

				this.events = {
					addHandler: function (target, type, handler) {
						if (target === self || target === self._map || target === undefined) {
							return self._map.events.add(type, self._map, function (e) {
								handler(e);
							});
						}
						return self._map.events.add(type, target, handler);
					},
					addThrottledHandler: function (target, type, handler, ms) {
						var h = throttle(handler, ms || 300);
						return this.addHandler(target, type, h);
					}
				};
			}

			Map.prototype = Object.create(Observable && Observable.prototype || {});
			Map.prototype.constructor = Map;

			Map.prototype.setView = function (opts) {
				opts = opts || {};
				var cam = {};
				if (opts.center) {
					cam.center = latLonToLonLat(Array.isArray(opts.center) ? opts.center : [opts.center.latitude, opts.center.longitude]);
				}
				if (typeof opts.zoom === 'number') cam.zoom = opts.zoom;

				if (opts.bounds && Array.isArray(opts.bounds) && opts.bounds.length === 2) {
					var nw = opts.bounds[0], se = opts.bounds[1];
					var west = (Array.isArray(nw) ? nw[1] : nw.longitude);
					var north = (Array.isArray(nw) ? nw[0] : nw.latitude);
					var east = (Array.isArray(se) ? se[1] : se.longitude);
					var south = (Array.isArray(se) ? se[0] : se.latitude);
					cam.bounds = [west, south, east, north];
					cam.padding = 20;
				}

				this._map.setCamera(cam);
			};

			Map.prototype.getBounds = function () {
				var b = this._map.getCamera().bounds;
				return {
					getNorthwest: function () { return { latitude: b[3], longitude: b[0] }; },
					getSoutheast: function () { return { latitude: b[1], longitude: b[2] }; }
				};
			};

			Map.prototype.getCorners = function () {
				var b = this._map.getCamera().bounds;
				return [
					{ latitude: b[3], longitude: b[0] },
					{ latitude: b[1], longitude: b[2] }
				];
			};

			Map.prototype.panTo = function (latLon) {
				var c = latLonToLonLat(Array.isArray(latLon) ? latLon : [latLon.latitude, latLon.longitude]);
				this._map.setCamera({ center: c });
			};

			Map.prototype.setZoom = function (z) {
				this._map.setCamera({ zoom: z });
			};

			Map.prototype.addFeature = function (feature) {
				this._dataSource.add(feature);
			};

			Map.prototype.showInfobox = function (latLon, html) {
				var ll = latLonToLonLat(Array.isArray(latLon) ? latLon : [latLon.latitude, latLon.longitude]);
				var self = this;
				if (!this._ready) {
					this.onReady(function () { self._popup.open(self._map, ll, html); });
				} else {
					this._popup.open(this._map, ll, html);
				}
			};

			Map.prototype.hideInfobox = function () {
				this._popup.close();
			};

			return Map;
		});

	define('app/map/init', ['app/map/Map', 'app/network/Services', 'app/map/Polygon'], function (
		Map,
		Services,
		Polygon
	) {
		function initAzureMap(opts) {
			opts = opts || {};
			var elementId = opts.elementId || 'map-div';
			var key = opts.subscriptionKey || '';
			var center = opts.center || { latitude: 3.4516, longitude: -76.5320 }; // Cali
			var zoom = typeof opts.zoom === 'number' ? opts.zoom : 12;

			var map = new Map(elementId, {
				center: center,
				zoom: zoom,
				authOptions: { authType: 'subscriptionKey', subscriptionKey: key }
			});

			if (typeof window !== 'undefined') {
				window.__azureMap__ = map;
			}

			Services.polygons.getDepartments(getRedrawHandler('departments'))
			Services.polygons.getRegions(getRedrawHandler('regions'))
			Services.polygons.getMunicipalities(getRedrawHandler('municipalities'))

			function getRedrawHandler(kind) {
				return function onPolygonsLoaded(geojson) {
					// Caso típico: viene como FeatureCollection
					var features = (geojson && geojson.features) ? geojson.features : [];

					if (!features.length) return;

					// Accede al mapa que acabamos de crear
					var m = (typeof window !== 'undefined') ? window.__azureMap__ : null;
					if (!m || !m._dataSource) return;

					// Empuja todas las features al DataSource (m.entities también las agrega)
					features.forEach(function (f) {
						// injected: rehydrate if compact format
						if (f && f.p && f.ge) { f = _rehydrateLightFeature(f) || f; }
						try {
							// Si ya es Feature de atlas, m.entities.push lo acepta
							// Si es GeoJSON plain, conviértelo a Feature de atlas:
							if (f && f.type === 'Feature' && f.geometry) {
								// Para polígonos:
								if (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') {
									var feat = new atlas.data.Feature(f.geometry, Object.assign({ __kind: 'polygon' }, f.properties || {}));
									m.addFeature(feat); // o m.entities.push(feat)
								}
							}
						} catch (e) { /* no-op */ }
					});

					// Opcional: ajustar la vista al bound de todo lo que cargaste
					try {
						var bbox = atlas.data.BoundingBox.fromData(features);
						if (bbox) {
							m.setView({ bounds: [[bbox[1], bbox[0]], [bbox[3], bbox[2]]] });
						}
					} catch (e) { /* no-op */ }
				};
			}



			return map;
		}
		return initAzureMap;
	});

	define('app/controller/AppState', [
		'lib/mvc/Observable',
		'app/network/Services',
		'app/utils/Modal'
	], function (Observable, Services, Modal) {
		'use strict';

		var AppState = Object.create(Observable || {});

		// --- STATE por defecto
		AppState.zoom = 8;
		AppState.center = [19.107484799229553, -70.96824477855033]; // [lat,lon]
		AppState.defaultCenter = AppState.center.slice();
		AppState.corners = [[20.85490611380081, -74.84092544261283], [17.341405560037188, -67.09556411448783]];
		AppState.defaultCorners = null;
		AppState.filters = null;
		AppState.query = '';
		AppState.isListMode = null;
		AppState.page = 1;
		AppState.state = '';
		AppState.lastQuery = '';
		AppState.lastRequestedUrl = '';
		AppState.timeout = null;
		AppState.firstTime = true;

		function getCamera(mapWrapper) {
			var cam = mapWrapper && mapWrapper._map && mapWrapper._map.getCamera ? mapWrapper._map.getCamera() : null;
			return cam || { center: [-74.1, 19.10], zoom: 8 };
		}
		function cameraToState(mapWrapper) {
			var cam = getCamera(mapWrapper);
			var centerLatLon = [cam.center[1], cam.center[0]];
			var b = cam.bounds;
			var corners = b ? [[b[3], b[0]], [b[1], b[2]]] : null;
			return { zoom: cam.zoom, center: centerLatLon, corners: corners };
		}
		function areNotSameCorners(c1, c2) {
			if (!!c1 !== !!c2) return true;
			if (!c1) return false;
			return !(+c1[0][0] === +c2[0][0] && +c1[0][1] === +c2[0][1] && +c1[1][0] === +c2[1][0] && +c1[1][1] === +c2[1][1]);
		}
		function getStateForHash(hash) {
			var states = ['Proyectos', 'Recursos', 'Produccion', 'Fiscalizacion'];
			if (!hash) return '';
			for (var i = 0; i < states.length; i++) {
				var key = states[i];
				if (hash.toLowerCase().indexOf('/' + key.toLowerCase()) === 1) return key;
			}
			return '';
		}

		AppState.initialize = function () {
			var self = this;
			this.state = getStateForHash(location.hash) || 'Proyectos';
			this.fireEvent && this.fireEvent('state-change', this.state, location.hash, location.hash.replace(/^[^\?]+\?/, ''));

			var map = window.__azureMap__;
			if (map && map._map) {
				var snap = cameraToState(map);
				this.zoom = typeof snap.zoom === 'number' ? snap.zoom : this.zoom;
				this.center = Array.isArray(snap.center) ? snap.center : this.center;
				this.corners = snap.corners || this.corners;

				var onMoveEnd = function () {
					var s = cameraToState(map);
					var zoomChanged = (+self.zoom !== +s.zoom);
					var cornersChanged = areNotSameCorners(self.corners, s.corners);
					var centerChanged = !(+self.center[0] === +s.center[0] && +self.center[1] === +s.center[1]);

					if (zoomChanged) self.zoom = s.zoom;
					if (centerChanged) self.center = s.center;
					if (cornersChanged) self.corners = s.corners;

					if (zoomChanged || centerChanged || cornersChanged) {
						self.updateURLTimed();
						self.fireEvent && self.fireEvent('map-changed', {
							zoom: self.zoom,
							leftTop: { latitude: self.corners[0][0], longitude: self.corners[0][1] },
							rightBottom: { latitude: self.corners[1][0], longitude: self.corners[1][1] },
							center: { latitude: self.center[0], longitude: self.center[1] }
						}, true);
					}
				};
				map.events.addHandler(map._map, 'moveend', onMoveEnd);
				map.events.addHandler(map._map, 'zoomend', onMoveEnd);
			}

			if (!location.hash) this.updateURL();
		};

		AppState.setDefaultCorners = function (corners) { this.corners = this.defaultCorners = corners; };
		AppState.setQuery = function (q) { this.query = q || ''; this.updateURLTimed(); };
		AppState.setPage = function (p) { this.page = p || 1; this.updateURLTimed(); };
		AppState.setListMode = function (isList, isGroup) { this.isListMode = !!isList ? { isGroup: !!isGroup } : null; this.updateURLTimed(); };
		AppState.setFiltersString = function (f) { this.filters = f || null; this.updateURLTimed(); };

		AppState.setZoomAndCorners = function (view, options) {
			options = options || {};
			var map = window.__azureMap__;
			if (!view) return;
			if (typeof view.zoom === 'number') this.zoom = view.zoom;
			if (Array.isArray(view.center)) this.center = view.center;
			if (Array.isArray(view.corners)) this.corners = view.corners;

			if (map && map.setView) {
				var cam = {};
				if (this.center) cam.center = { latitude: this.center[0], longitude: this.center[1] };
				if (typeof this.zoom === 'number') cam.zoom = this.zoom;
				if (this.corners) cam.bounds = this.corners;
				try { map.setView(cam); } catch (e) { }
			}
			if (!options.noNotify) this.updateURLTimed();
		};

		AppState.updateURLTimed = function () {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(this.updateURL.bind(this), 80);
		};

		AppState.updateURL = function () {
			this.firstTime = false;
			var q = '';
			if (this.query) q += '&query=' + this.query;
			if (this.page) q += '&page=' + this.page;
			if (typeof this.zoom === 'number') q += '&zoom=' + this.zoom;
			if (this.center) q += '&center=' + this.center[0] + ',' + this.center[1];
			if (this.corners) {
				q += '&topLeft=' + this.corners[0][0] + ',' + this.corners[0][1];
				q += '&bottomRight=' + this.corners[1][0] + ',' + this.corners[1][1];
			}
			if (this.filters) q += '&' + this.filters;
			if (this.isListMode) { q += '&listMode=true'; if (this.isListMode.isGroup) q += '&isGroup=true'; }
			q = q.replace(/^&/, '');
			var h = '#/' + (this.state ? this.state.toLowerCase() : '') + '/?' + q;
			if (this.lastQuery === h) return;
			this.lastQuery = h;
			location.hash = h;
			this.updateQueryByURL();
		};

		AppState.updateQueryByURL = function () {
			var query = location.hash.replace(/^[^\?]+\??/, '');
			if (!query) return;
			var reqList = null, req = null;
			if (!this.isListMode || !this.state) {
				if (this.state !== 'Recursos') {
					this.cachedRequest = Services.search(this.state || 'Proyectos', query);
					if (this.cachedRequest && this.cachedRequest.done) this.cachedRequest.done(this.projectsLoaded.bind(this));
				} else {
					this.cachedRequest2 = Services.search(this.state, query, { pushpins: true });
					req = this.cachedRequest2;
					if (req && req.then) req.then(this.resourcesLoaded && this.resourcesLoaded.bind(this));
				}
				this.fireEvent && this.fireEvent('loading-projects', query);
			} else {
				reqList = Services.search(this.state, query, { isList: true });
				this.fireEvent && this.fireEvent('loading-projects-list', query);
				if (reqList && reqList.done) reqList.done(this.projectsListLoaded && this.projectsListLoaded.bind(this));
			}
		};

		AppState.projectsLoaded = function (data) { this.fireEvent && this.fireEvent('projects-loaded', data); };

		// inicializa automáticamente
		if (typeof AppState.initialize === 'function') AppState.initialize();
		return AppState;
	});

	define('app/filters/Option', ['lib/mvc/Observable'], function (Observable) {
		var Option = new Class(Observable, {

			initialize: function (data) {
				$.extend(this, data)
				this.active = ko.observable(false)
				this.visible = ko.observable(true)
				this.important = ko.observable(false)
			},

			toggleActive: function () {
				// debugger;
				this.active(!this.active())
				if (this.active() && this.dependsOn) {
					this.fireEvent('require-activate', this.dependsOn)
				}

				//debugger;
				//
				// if(this.active()){
				// this.fireEvent('activated-by-user', this.value)
				// }
				this.fireEvent('options-changed', this)
			},

			setActive: function (bool, ignoreNotification) {

				//debugger;
				this.active(typeof bool == 'boolean' ? bool : true)
				if (!ignoreNotification) {
					this.fireEvent('options-changed', this, true)
				}
				if (this.dependsOn && this.active()) {
					this.fireEvent('require-activate', this.dependsOn)
				}



			},

			setVisibility: function (bool) {
				this.visible(bool)
			},

			getName: function () {
				return this.name //+ (this.dependsOn ? this.dependsOn[0].id : '')
			},
			getSubTipo: function () {
				//console.log(this);

				if (this.subTipo) {
					return this.subTipo
				} else {
					return 'none'
				}
				//return this.subTipo //+ (this.dependsOn ? this.dependsOn[0].id : '')
			},
			getValue: function () {
				//console.log(this);

				if (this.value) {
					return this.value
				} else {
					return 'none'
				}
				//return this.subTipo //+ (this.dependsOn ? this.dependsOn[0].id : '')
			}

		})

		return Option
	});
	/*global ko, define, Class, Event*/
	define('app/filters/Filter', ['lib/mvc/Observable',
		'./Option', 'app/controller/AppState',
	],
		function (
			Observable,
			Option,
			AppState
		) {
			'use strict';

			var defaultText = document.body.getAttribute('data-periods-default-text'),
				searchTimeout
			document.body.removeAttribute('data-periods-default-text')

			var Filter = new Class(Observable, {
				initialize: function (data) {
					var option, tempArray = [], self = this
					$.extend(this, data)

					this.options = ko.observableArray()
					this.usaServicioAjax = !!data.usaServicioAjax

					if (this.parameter === 'campoProyecto') {
						this.isExclusive = true
						this.excludes = ['region', 'departamento', 'municipio']
					}

					if (!this.usaServicioAjax) {
						for (var i = 0; i < this.items.length; i++) {
							option = new Option(this.items[i])
							option.active.subscribe(this.setActive.bind(this))
							option.on('require-activate', this.optionActivated.bind(this))
							option.on('options-changed', this.optionActivatedByUser.bind(this))
							tempArray[i] = option
						}
						tempArray.sort(this.alphabetSorting)
					}

					this.options(tempArray)

					this.active = ko.observable(false)
					this.visible = ko.observable(false)
					this.hidden = ko.observable(true)
					// this.hidden.subscribe(function(){
					// 	console.log(self.hidden(), self.parameter)
					// })

					this.optionChanged = ko.observable()


					this.elems = {}
					this.isLoading = ko.observable(false)
					this.extraClasses = ko.computed(function () {
						if (self.usaServicioAjax) {
							if (self.isLoading()) {
								return 'loading'
							}
							if (!self.options().length) {
								return 'empty'
							}
						}

						return ''
					})
					this.testcat = ko.computed(function () {



					}, this)
					this.getNameStatus = ko.computed(function () {

						var actived = '',
							option,
							opts = this.options(),
							state = AppState.state


						for (var i = opts.length; i--;) {
							option = opts[i]
							if (option.active()) actived += option.name + ', '
						}

						var nameoption = actived.replace(/\,\s$/, '');

						if (this.parameter === "tipoRecursoNaturalFiscalizacion" && nameoption != "") {
							//debugger;
							//debugger;
							//console.log(option.name, state, AppState)
							//console.log(option.name, nameoption)
							var valueSubtipo;

							if (nameoption === "Todos") {
								valueSubtipo = "-1"
							} else {
								valueSubtipo = nameoption.substr(0, 1)
							}

							nameoption = nameoption.toLowerCase()

							//console.log($(window))
							//debugger;
							$('.buttons-filter-fiscalization a').removeClass('active')
							//$('.buttons-filter-fiscalization a.filter-to-'+nameoption).addClass('active')
							$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo-' + valueSubtipo)

							$('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text($('.buttons-filter-fiscalization a.active').attr('data-text-filter'))

						}

						if (this.name == $('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text()) {
							//debugger;
							this.name = $('.buttons-filter-fiscalization a.active').attr('data-text-filter')
							//this.name = $('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text()
						}


						if (actived)
							actived = '<span class="no-bold">' + this.name + ':  </span>' + actived.replace(/\,\s$/, '')
						else
							actived = this.name


						return actived
					}, this)

					this.getNameDefault = ko.computed(function () {
						var actived = '',
							opts = this.options(),
							option

						for (var i = opts.length; i--;) {
							option = opts[i]
							if (option.active()) actived += option.name + ', '
						}
						if (actived) {
							actived = actived.replace(/\,\s$/, '')
						}
						else {
							actived = defaultText
						}
						return actived
					}, this)

					this.toggleVisibleBinded = this.toggleVisible.bind(this)
				},

				filter: function () {
				},

				toggleVisible: function (data, evt) {
					var elem = evt && $(evt.target),
						isVisible = this.visible()

					if (elem) {
						this.elem = elem
					}

					this.onToggle()

					if (!isVisible) {
						this.show()
					} else {
						if (evt) evt.stopPropagation()
						this.hide()
					}

					if (evt instanceof Event) {
						if (evt.stopPropagation) {
							evt.stopPropagation()
						} else {
							window.event.cancelBubble = true
						}
					}
				},

				setActive: function () {
					// console.log('damn')
					var areActive = this.getActive()
					this.active(areActive.length)
					if (this.isExclusive && this.active()) {
						//debugger;
						// console.log('firing unselectall', this.parameter, false, this.excludes) 
						this.fireEvent('unselect-all-filters', this.parameter, false, this.excludes)
					}
					this.fireEvent('option-activated', this, areActive)
				},

				getActive: function () {
					var opts = this.options(),
						option,
						areActive = []
					for (var i = 0; i < opts.length; i++) {
						option = opts[i]
						if (option.active()) areActive.push(option)
					}
					return areActive
				},

				disActive: function () {
					var opts = this.options(),
						option
					for (var i = opts.length; i--;) {
						option = opts[i]
						if (option.active()) option.setActive(false)
					}
				},

				optionClicked: function (parent, evt, option) {
					var target = evt.target,
						child = ko.dataFor(target),
						state = AppState.state,
						value = child.value;

					//debugger;

					//console.log(this, $(this), state, AppState, this.getNameStatus(), self, evt.target.dataset.value);


					if (this.parameter == "tipoRecursoNaturalFiscalizacion") {
						if (state == '')
							state = 'fiscalizacion'

						$('.map-container').attr('data-option-subtipo', state.toLowerCase() + '-option-subtipo-' + value)

					}

					if ($(evt.target).hasClass('option'))
						child.toggleActive()
				},

				optionActivated: function (options) {
					this.fireEvent('activate-options-related', options)
				},

				optionActivatedByUser: function (option, stopBubbling) {
					var opt,
						opts = this.getActive()
					//debugger;
					for (var i = opts.length; i--;) {
						opt = opts[i]
						if (!this.esMultiple &&
							option.value !== opt.value) {
							opt.setActive(false, 'ignoreNotification')
						}
					}

					if ('periodosFiscalizacion' == this.parameter) {
						$('#info-select-list-period').trigger('click')
					}

					if (!stopBubbling) {
						this.fireEvent('activated-by-user', this.parameter, this.getActive())
					}
				},

				getOptionByValue: function (value) {
					var opts = this.options(), i = 0
					for (; i < opts.length; i++) {
						if (opts[i].value === value)
							return opts[i]
					}
				},

				activateOptionByValue: function (value) {
					var opt = this.getOptionByValue(value)
					if (opt) opt.setActive()
				},

				filterOptions: function (data, evt) {
					var srt = evt.target.value,
						opts = this.options(),
						opt, self = this

					if (!this.usaServicioAjax) {
						for (var i = 0; i < opts.length; i++) {
							opt = opts[i]
							opt.setVisibility(!srt || opt.name.score(srt) > 0)
						}
					} else if (srt.length > 2) {
						self.options([])
						self.isLoading(true)
						clearTimeout(searchTimeout)
						searchTimeout = setTimeout(function () {
							$.ajax({
								method: 'get',
								url: self.urlServicioAjax,
								data: {
									query: srt
								}
							}).done(function (data) {
								var opts = data.filters ? data.filters[0].items : [],
									tempArray = []

								for (var i = 0; i < opts.length; i++) {
									opt = new Option(opts[i])
									opt.active.subscribe(self.setActive.bind(self))
									opt.on('require-activate', self.optionActivated.bind(self))
									opt.on('options-changed', self.optionActivatedByUser.bind(self))
									tempArray[i] = opt
								}

								self.options(tempArray)
								self.isLoading(false)
							})
						}, 1000)
					} else {
						self.options([])
					}
				},

				getQuery: function () {
					if (this.active()) {
						var query = this.parameter + '=',
							opts = this.options(),
							option

						for (var i = opts.length; i--;) {
							option = opts[i]
							if (option.active()) query += encodeURIComponent(option.value) + ','
						}

						query = query.replace(/\,$/, '')

						return query
					}
					return ''
				},

				onToggle: function () {
					this.elem.parents('.filters-group')
						//hide all filters
						.find('.filter-group')
						.end()

					//clear the filter inputs only for no ajax
					if (!this.usaServicioAjax) {
						this.elem.parents('.filters-group input')
							.val('').keyup()
					}
				},

				hide: function () {
					var self = this

					this.onToggle()
					// this.elem.parents('.filters-group').find('input')
					// 		.val('').keyup()

					$(document).off('click', this.toggleVisibleBinded)

					self.visible(false)

					if (this.elem.hasClass('extra')) {
						this.elem.next()
							.slideUp(200, function () {
								$(this).hide().parent()
									.removeClass('visible')
							})
					} else {
						this.elem.next().delay(100)
							.animate({ width: 0 }, 250, function () {
								$(this).hide().parent()
									.removeClass('visible')
								self.visible(false)
							})
					}
				},

				show: function () {
					var self = this

					this.onToggle()
					this.visible(true)

					if (this.elem.hasClass('extra')) {
						this.elem.next()
							.slideDown(200)
						setTimeout(function () {
							$(document).on('click', self.toggleVisibleBinded)
						}, 10)
					} else {
						this.elem.next()
							.width(0)
							.show()
							.delay(100)
							.animate({ width: 200 }, 250)
					}
					this.elem.parent().addClass('visible')

					// SORTING
					this.fireEvent('filters-gonna-show', this)
				},

				alphabetSorting: function (left, right) {
					return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1)
				},

				sortOptionsBy: function (fgsActive) {
					var opts = this.options(),
						option

					if (!this.filterByType) {
						this.filterByType = function (dependency) {
							var activedOptions
							for (var i = 0; i < fgsActive.length; i++) {
								activedOptions = fgsActive[i].getActive()
								for (var j = 0; j < activedOptions.length; j++) {
									if (fgsActive[i].parameter == dependency.type &&
										activedOptions[j].value == dependency.id) {
										return true
									}
								}
							}
							return false
							// return dependency.type === type &&  dependency.id === id
						}
					}

					for (var i = opts.length; i--;) {
						option = opts[i]
						if (!option.dependsOn) {
							option.sortBy = 2 + option.name
							option.important(false)
						} else {
							if (option.dependsOn.filter(this.filterByType).length) {
								option.sortBy = 1 + option.name
								option.important(true)
							} else {
								option.sortBy = 2 + option.name
								option.important(false)
							}
						}
					}

					this.options.sort(function (left, right) {
						return left.sortBy == right.sortBy ? 0 : (left.sortBy < right.sortBy ? -1 : 1)
					})
				},

				selectOption: function (id) {
					var opts = this.options(),
						option

					//debugger;

					for (var i = opts.length; i--;) {
						option = opts[i]
						if (option.value == id) {
							option.setActive(true)
						} else if (!this.esMultiple) {
							//}else if( !this.esMultiple ||
							//	( this.parameter.indexOf('period') && AppState.getState().state === 'Fiscalizacion' ) ){
							option.setActive(false, 'ignoreNotification')
						}
					}
				}
			})

			return Filter
		});
	/*global ko, define, Class*/
	/**
	 * FiltersGroup
	 *
	 * This Class manages group of filters
	 * easing the action of activating and
	 * deactivating groups of filters like
	 * Projects, Resources... and so on.
	 */
	define('app/filters/FiltersGroup', ['lib/mvc/Observable',
		'./Filter',
		'app/controller/appStates'],
		function (Observable, Filter, appStates) {

			var FiltersGroup = new Class(Observable, {
				// The type of the instance
				// this can be any of FiltersGroup.types
				type: null,
				filters: null,
				arrayFilters: [],
				loading: true,
				visible: false,


				/**
				 * Constructor
				 *
				 * @param  FiltersGroup.types type string with the type
				 */
				initialize: function (type) {
					this.type = type
					this.filters = ko.observableArray()
					this.loading = ko.observable(true)
					this.visible = ko.observable(false)
					this.period = null
					this.visible.subscribe(this.togglePeriods.bind(this))
				},

				/**
				 * Adds a Filter to the not observable array of filters
				 * @param Object properties of the Filter to construct and add
				 */
				addFilter: function (properties) {
					var self = this,
						filter

					// if( properties.usaServicioAjax ){
					// 	filter = new FilterSelect2( properties )
					// }else{
					filter = new Filter(properties)
					// }


					// Events bindings
					filter.on('activate-options-related', self.activateOptionsRelated.bind(self))

					if (filter.parameter.match(/(region)|(departamento)|(municipio)|(fiscalizacion)/)) {
						filter.on('activated-by-user',
							self.fireEvent.bind(self, 'territory-activated'))
					}

					filter.on('unselect-all-filters', self.unselectAllFilters.bind(self))
					filter.on('option-activated', self.fireEvent.bind(self, 'option-activated'))
					filter.on('filters-gonna-show', self.hideOtherFilters.bind(self))

					// All periods:
					// period, periodo, periodos, periodosRecursos...
					if (filter.parameter.indexOf('period') === 0) {
						filter.hidden(!this.visible())
						filter.on('option-activated',
							self.fireEvent.bind(self, 'period-selected'))
						self.period = filter
						self.togglePeriods()
					}
					if (filter.parameter.indexOf('campoProyecto') === 0) {
						filter.on('activated-by-user', function () {
							self.fireEvent('zoom-out')
						})
					}
					self.arrayFilters.push(filter)

					return filter
				},

				/**
				 * Turns the array of filters
				 * to the ko.observableArray
				 */
				instantiateObservable: function () {
					this.filters(this.arrayFilters)
					// Empty memory
					this.arrayFilters = null
					this.loading(false)
				},

				/**
				 * Actiavte the options related,
				 * it's assumed that the related filter
				 * is in this group of filters
				 *
				 * @param  {Array<Option>} opts
				 */
				activateOptionsRelated: function (opts) {
					var filter, option,
						filters = this.filters(),
						i, j

					for (i = 0; i < opts.length; i++) {
						for (j = 0; j < filters.length; j++) {
							filter = filters[j]

							if (filter.parameter === 'departamento') {
								tmpFilterAct = filter.getActive()
								if (tmpFilterAct.length > 1) {
									tmpSecondFilterAct = filters[j + 1].getActive()

									tmpSecondFilterAct.forEach(function (element) {
										element.setActive(false, 'ignoreNotification')
									});
								}
							}

							if (filter.parameter == opts[i].type) {
								filter.activateOptionByValue(opts[i].id)
								break;
							}
						}
					}
				},

				/**
				 * Wether the user activate or deactivate a
				 * territory option of one of the filters this
				 * fires the event to the Observer in a proxy way
				 */
				activatedByUser: function () {
					this.fireEvent.apply(this, 'territory-activated', [].slice.call(arguments))
				},

				hideOtherFilters: function (filterActivated, cancelNotify) {
					var filters = this.filters(),
						filter,
						activated = [],
						visible


					for (var i = 0; i < filters.length; i++) {
						filter = filters[i]
						if (filter.active()) {
							activated.push(filter)
						}
						// Hide other filters in this group
						if (filter.visible() &&
							filter.parameter != filterActivated.parameter) {
							filter.hide()
						}
					}

					filterActivated.sortOptionsBy(activated)

					if (!cancelNotify) this.fireEvent('filter-activated', this, filterActivated)

					this.fireEvent('filters-gonna-show', filterActivated)
					// This assummes that the related filters are in this group
				},

				hideAllFilters: function () {
					var filters = this.filters(),
						filter

					for (var i = filters.length; i--;) {
						filter = filters[i]
						if (filter.visible()) {
							filter.hide()
						}
					}
				},

				togglePeriods: function () {
					if (this.period) {
						this.period.hidden(!this.visible())
					}

				},

				getQuery: function () {
					var filters = this.filters(),
						filter,
						filtersString = ''

					for (var i = filters.length; i--;) {
						filter = filters[i]
						if (filter.active()) {
							filtersString += filter.getQuery() + '&'
						}
					}
					return filtersString
				},

				selectFilterWith: function (type, id) {
					var filters = this.filters(),
						filter

					for (var i = filters.length, j; i--;) {
						filter = filters[i]
						if (filter.parameter === type) {
							if (id instanceof Array) {
								for (j = id.length; j--;) {
									filter.selectOption(id[j])
								}
							} else {
								filter.selectOption(id)
							}
							return true
						}
					}
				},

				hasFiltersActive: function () {
					var filters = this.filters(),
						filter

					for (var i = filters.length; i--;) {
						filter = filters[i]
						if (filter.active()) {
							return true
						}
					}

					return false
				},

				unselectAllFilters: function (except, noNotify, filtersToExclude) {
					var filters = this.filters(),
						filter

					// console.log('unselect all filters in '+this.type, except, noNotify, filtersToExclude)
					for (var i = filters.length; i--;) {
						filter = filters[i]
						// console.log( filter.parameter, filter.active(), except )
						if (filter.active() && filter.parameter !== except) {
							// console.log( filtersToExclude.indexOf( filter.parameter ), filter.parameter )
							if ((filtersToExclude &&
								(filtersToExclude.indexOf(filter.parameter) !== -1)) ||
								!filtersToExclude) {
								filter.disActive()
							}
						}
					}

					if (!noNotify)
						this.fireEvent('unselect-all-filters', this.type, except, filtersToExclude)

					return false
				},

				unselectExclusives: function (except, a, b) {
					// console.log('disactivating in FG '+except, a, b)
					var filters = this.filters(),
						filter

					for (var i = filters.length; i--;) {
						filter = filters[i]
						if (filter.active() && filter.parameter !== except &&
							filter.isExclusive && filter.excludes.indexOf(except) != -1) {
							filter.disActive()
						}
					}
				}


			})

			return FiltersGroup
		});
	/*global define*/
	define('app/utils/Utils', [], function () {
		// No more console errors ¬¬
		if (!('console' in window)) {
			window.console = {
				data: [],
				log: function () {
					this.data.push([].slice.call(arguments))
				},
				warn: function () {
					this.data.push([].slice.call(arguments))
				},
				error: function () {
					this.data.push([].slice.call(arguments))
				}
			}
		}


		return {
			// toCurrency: toCurrency
		}
	});
	/*global ko, define, Class, Event*/
	define('app/filters/FiltersManager', ['lib/mvc/Observable',
		'app/network/Services',
		'./FiltersGroup',
		'app/controller/appStates',
		'app/controller/AppState',
		'app/utils/Utils',
		'app/utils/territories'
	],
		function (
			Observable,
			Services,
			FiltersGroup,
			appStates,
			AppState,
			Utils,
			territoriesCache,
			search
		) {

			/**
			 * Timer to constructuct the query
			 * (spcially when is activated a related group)
			 */
			var queryContructTimeout,

				FiltersManager = new Class(Observable, {

					initialize: function () {
						var self = this,
							type,
							filterGroup,
							key

						// Flags
						this.activated = false
						this.mode = null

						// Elements
						this.elems = {}
						this.elems.root = $('#controls')
						this.elems.search = $('#search')
						this.elems.filterResults = $('#filter-results')
						this.elems.resetFiltersWrapper = $('#reset-filters-wrapper')
						this.elems.resetFilters = $('#reset-filters')
						this.elems.initLink = $('#header .logo, #header .inicio, #footer .inicio')
						this.elems.share = $('#share')
						this.elems.generalSearch = $('#general-search')

						// Initialize the FiltersGroups
						this.filtersGroups = {}


						for (var i = 0; i < appStates.length; i++) {
							key = appStates[i]
							filterGroup = new FiltersGroup(key)
							this.filtersGroups[key] = filterGroup

							filterGroup.on('option-activated', function (filterActivated) {
								var fg
								// console.log('fired with '+filterActivated.parameter)
								// console.log('fired with '+filterActivated.active())
								if (filterActivated.active()) {
									for (var i = 0; i < appStates.length; i++) {
										fg = self.filtersGroups[appStates[i]]
										fg.unselectExclusives(filterActivated.parameter)
									}
								}
								self.notifyNewSearch(filterActivated)
							})
							//for polygon zooming
							filterGroup.on('territory-activated', self.territoryActivated.bind(self))
							filterGroup.on('unselect-all-filters', self.unselectOtherFilterGroups.bind(this))
							filterGroup.on('filter-activated', self.checkActivated.bind(self))
							filterGroup.on('filters-gonna-show', self.fireEvent.bind(this, 'filters-gonna-show'))
							filterGroup.on('zoom-out', self.fireEvent.bind(this, 'zoom-out'))
						}

						AppState.on('update-filter-string', this.updateFilterString.bind(this))
						AppState.on('state-change', this.activate.bind(this))
						AppState.on('filter-reseted', this.unselectAll.bind(this))
						AppState.on('filter-activated', this.selectFilterWith.bind(this))
						AppState.on('territory-activated', this.territoryActivated.bind(this))

						AppState.on('view-group-change', function (bool) {
							self.viewMode.visible(bool)
						})
						//AppState.on( 'new-search', this.notifyNewSearch.bind( this ) )

						// Periods are contained in each filtergroup
						// but they are also contained inside 
						// this array of periods for binding
						this.periods = ko.observableArray()
						this.periods = ko.observableArray()

						setTimeout(function () {
							Services.filters.forProjects().done(self.initializeModels.bind(self))
						}, 0)

						// Get the filters
						setTimeout(function () {
							self.fireEvent('loading-filters')
						}, 20)

						AppState.on('projects-loaded', this.updateStatistics.bind(this))


						function viewMode() {
							this.visible = ko.observable(true)
							this.toggleVisible = function (bool) {
								if (typeof bool == 'boolean' && bool === this.visible())
									return

								if (typeof bool == 'boolean')
									this.visible(bool)
								else
									this.visible(!this.visible())

								self.toggleControl(this.visible())

								if (bool instanceof Event) {
									if (bool.stopPropagation) {
										bool.stopPropagation()
									} else if (typeof bool != 'boolean') {
										window.event.cancelBubble = true
									}
								}

								return false
							}
							return false
						}

						function searchQuery() {
							var that = this
							function notifyChange() {
								var fg, state = AppState.getState().state
								if (that.query() !== '') {
									// Query search is exclusive of filters search
									if (state == 'Recursos' || state == 'Produccion') {
										for (var i = 0; i < appStates.length; i++) {
											fg = self.filtersGroups[appStates[i]]
											// HEAD ---> fg.unselectAllFilters(null, true)
											fg.unselectAllFilters()
										}
										self.fireEvent('new-query')
									}
									// self.fireEvent('zoom-out')
									self.hideAllFilters()
									self.resetFilters(true)
								} else {
								}

								self.notifyNewSearch()
							}
							this.query = ko.observable('')
							this.query.subscribe(notifyChange)
							this.search = notifyChange
						}

						this.searchQuery = new searchQuery()
						this.viewMode = new viewMode()

						this.resetFilters = ko.observable(false)

						ko.applyBindings(this.viewMode, $('#toggle-controls')[0])
						ko.applyBindings(this.searchQuery, $('#search')[0])

						this.elems.initLink.on('click', this.unselectAll.bind(this))

						// Get actual state
					},

					activate: function (state, hash, params) {
						var root = this.elems.root,
							actions = root.find('.actions'),
							key,
							fg, i



						$('#header nav a').removeClass('selected')
						$('.main-nav ul a').removeClass('selected')
						if (state) {
							$('.menu-item-' + state.toLowerCase()).addClass('selected')
						} else {
							$('.menu-item-inicio').addClass('selected')
						}

						// Hide other or all filtersGroups
						this.periods().forEach(function (period) {
							period.hidden(true)
						})
						if (state !== '') {
							for (i = 0; i < appStates.length; i++) {
								key = appStates[i]
								if (key === state) {
									this.filtersGroups[key]
										.visible(true)
									actions.find('.search-' + key.toLowerCase())
										.removeClass('inactive')
								}
								else if (key !== 'Comunes') {
									this.filtersGroups[key]
										.visible(false)
									actions.find('.search-' + key.toLowerCase())
										.addClass('inactive')
								} else {
									this.filtersGroups[key]
										.visible(true)
								}

							}
							root.find('.comunes').addClass('hidden')

							root.addClass('tabs-mode')
								.animate({
									marginLeft: 10,
									left: 10
								})

							root.find('.statistics').addClass('small')
							root.find('.intro').hide()
							this.elems.search.show()
							this.elems.share.show()

							if (state == 'Fiscalizacion') {

								$('.buttons-filter-fiscalization').show()

								$('.wrap-gray').addClass('wrap-gray-fiscalization')

								var attr = $('.map-container').attr('data-option-subtipo');

								$('.map-container').addClass('fiscalizacion-mode')

								if (typeof attr == 'undefined' || attr == '' || attr == 'fiscalizacion-option-subtipo-') {

									$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo--1')

								}

								var textTmp = $('.buttons-filter-fiscalization a.active').attr('data-text-filter')

								$('.filter-group[data-parameter=campoProyectoFiscalizacion] .txt').text(textTmp)


							} else {
								$('.buttons-filter-fiscalization').hide()

								$('.wrap-gray').removeClass('wrap-gray-fiscalization')
							}

							if (state != 'Recursos') {
								$('.legend-resources').hide()
							} else {
								$('.legend-resources').show()
							}

							if (state == 'Recursos' || state == 'Produccion' || state == 'Fiscalizacion') {
								root.find('.statistics').hide()
								$('#filter-results').hide()

							}
							else {
								root.find('.statistics').show()
								$('#filter-results').show()
							}
						} else {
							for (i = 0; i < appStates.length; i++) {
								//debugger;
								this.filtersGroups[appStates[i]]
									.visible(false)
							}
							root.removeClass('tabs-mode')
							root.find('.statistics').removeClass('small')
							root.find('.statistics').show()
							root.find('.intro').show()
							$('#filter-results').hide()
							this.elems.search.hide()
							this.elems.share.hide()

							if (this.periods().length) {
								this.periods()[0].hidden(false)
								// root.find('.statistics').addClass('small')
							}
						}

						// Check reset here too
						this.resetFilters(false)

						for (i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]

							if (fg && fg.visible() && fg.hasFiltersActive()) {
								this.resetFilters(true)
								break;
							}
						}

						if (this.searchQuery.query()) this.resetFilters(true)
					},

					toggleControl: function (bool) {
						this.activated = true

						if (bool) {
							this.elems.root.animate({ marginLeft: 0, left: 0 })
						}
						else {
							//FIXME list mode
							this.elems.root.animate({ marginLeft: 0, left: -(this.elems.root.width()) })
							this.hideAllFilters()
							if (AppState.listMode)
								AppState.setListMode(false)
						}

						return false
					},

					initializeModels: function (response) {
						var rawData = response.filters,
							tempArray = [],
							self = this, sectionName

						if (rawData) {
							setTimeout(function () {
								var length = rawData.length,
									i = 0, j = 0,
									data,
									filterInstance,
									st = AppState.getState(),
									territory

								for (; i < length; i++) {
									data = rawData[i]
									sectionName = data.seccionAplicativo
									if (sectionName.match(/fiscalizacion/i)) {
										sectionName = 'Fiscalizacion'
									}
									filterInstance = self.filtersGroups[sectionName]
										.addFilter(data)
									if (data.parameter === 'municipio' ||
										data.parameter === 'departamento' ||
										data.parameter === 'region') {
										for (j = 0; j < data.items.length; j++) {
											territory = data.items[j]
											territoriesCache[data.parameter][territory.value] = {
												'id': territory.value,
												'name': territory.name
											}
										}
									}

									// All periods:
									// period, periodo, periodos, periodosRecursos...
									if (data.parameter.indexOf('period') === 0) {
										self.periods.push(filterInstance)
									}
								}

								// Assign the array to observableArray
								for (i = 0; i < appStates.length; i++) {
									self.filtersGroups[appStates[i]].instantiateObservable()
								}

								setTimeout(function () {
									function byId(id) {
										return document.getElementById(id)
									}

									var groupTypes = FiltersGroup.types,
										key, typeName,
										rootElement = $('#filters-groups-list').removeClass('loading')[0],
										originalTemplate = $(rootElement.children[0]).remove(),
										filterElement
									// TODO actualizar el html para que pinte bien los bindings
									// When period changes... we have to load new graphics
									ko.applyBindings(self, byId('map-select-list-period'))
									ko.applyBindings(self, byId('info-select-list-period'))
									ko.applyBindings(self, byId('filters-stats-list-info'))


									// Dynamic template generation
									for (var i = 0; i < appStates.length; i++) {
										key = appStates[i]
										filterElement = originalTemplate.clone()
										filterElement.attr('data-bind',
											filterElement.attr('data-bind')
												.replace(/(filtersGroups)/g, '$1.' + key))
										rootElement.appendChild(filterElement[0])
									}
									ko.applyBindings(self, rootElement)

									ko.applyBindings(self, self.elems.resetFiltersWrapper[0])
									self.fireEvent('filters-loaded')
									$(rootElement.children[0]).addClass('comunes')
								}, 0)

								//At the end
								self.activate(AppState.getState().state, st.hash, st.params)
							}, 0)
						}

					},

					territoryActivated: function () {
						this.fireEvent.apply(this, ['territory-activated'].concat([].slice.call(arguments)))
					},

					notifyNewSearch: function (param) {
						//Recorrer filtros y armar nuevo query
						var self = this

						clearTimeout(queryContructTimeout)
						queryContructTimeout = setTimeout(function () {
							var state = AppState.getState().state
							// In resources query search is exclusive
							if (state == 'Recursos') {
								if (self.searchQuery.query() && self.onlyGetFiltersString()) {
									self.searchQuery.query('')
								}
							}
							AppState.setQuery(encodeURIComponent(self.searchQuery.query()))
							self.resetFilters(false)
							AppState.setFiltersString(self.getQueryFilters())
						}, 0)

					},

					updateFilterString: function () {
						AppState.setFiltersString(this.getQueryFilters())
					},

					getQueryFilters: function () {
						var filtersString = '',
							i = 0,
							fg, hasVisible = false

						for (i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]
							if (fg.visible()) {
								hasVisible = true
								if (fg.hasFiltersActive()) {
									this.resetFilters(true)
									break;
								}
							}
						}

						if (this.searchQuery.query()) this.resetFilters(true)

						for (i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]
							if (fg.visible()) {
								filtersString += fg.getQuery()

							}
						}
						if (!hasVisible) {
							fg = this.filtersGroups['Proyectos']
							if (fg.hasFiltersActive()) {
								filtersString += fg.getQuery()
							}
						}




						return filtersString.replace(/&$/, '')
					},

					onlyGetFiltersString: function () {
						var filtersString = '',
							i
						for (i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]
							if (fg.visible()) {
								filtersString += fg.getQuery()
							}
						}

						//debugger;

						return filtersString
					},

					unselectAll: function (noNotify, onlyClean, noResetQuery) {
						var fg,
							i

						// if( !this.filtersProjects ) return
						if (noNotify !== true) this.fireEvent('filters-reseted')

						for (i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]
							if (fg.visible() || (onlyClean === true)) {
								fg.unselectAllFilters()
							}
						}

						$('.filter-list .filter input[type="text"]').val('').trigger('keyup')
						$('.buttons-filter-fiscalization a').removeClass('active')
						$('.buttons-filter-fiscalization .filter-to-todos').addClass('active')
						$('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo--1')

						//var currenTyear = new Date().getFullYear(),
						//	$elm =  $('#map-select-list-period .select-period')
						//	beforeyear = parseInt(currenTyear-1);

						//debugger;

						//if(!$elm.hasClass('selected')){

						//	var eleX = $('#map-select-list-period .select-period .options .option:contains("'+beforeyear+'")').last()
						//	$('#map-select-list-period .select-period .options .option:contains("'+beforeyear+'")').last().trigger('click')
						//}


						//if( onlyClean !== true ) $('html, body').animate({ scrollTop: 0 }, 200);
						if (noResetQuery !== true) this.searchQuery.query('')

						if (onlyClean !== true) {
							this.hideAllFilters()
							location.hash = location.hash.replace(/\?.*/, '')
						}
					},

					unselectOtherFilterGroups: function (type, except, filtersToExclude) {
						// console.log('unselectOtherFilterGroups '+except)
						var i, fg
						for (i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]
							if (fg.type !== type) {
								fg.unselectAllFilters(except, 'noNotify', filtersToExclude)
							}
						}
						// this.fireEvent('zoom-out')
					},

					updateStatistics: function (data) {
						var root = this.elems.root

						this.fireEvent('loaded-filters')

						if (!this.activated) {
							this.activated = true
						}
						root.find('#collected-money').html(parseInt(data.collectedMoney, 10).toCurrency())
						root.find('#approved-money').html(parseInt(data.approvedMoney, 10).toCurrency())
						root.find('#approved-money-home').html(parseInt(data.approvedMoney, 10).toCurrency())
						root.find('#approved-projects').html(data.approvedProjects)
						root.find('#approved-projects-home').html(data.approvedProjects)
						root.find('#total-sources').html(parseInt(data.approvedMoneyTotal, 10).toCurrency())
						//TODO update search results
					},

					hideAllFilters: function () {
						var fg,
							i

						for (i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]
							fg.hideAllFilters()
						}
					},

					checkActivated: function (filterGroup, filterActivated) {
						var fg


						for (var i = 0; i < appStates.length; i++) {
							fg = this.filtersGroups[appStates[i]]
							if (fg.type !== filterGroup.type) {
								fg.hideOtherFilters(filterActivated, 'cancelNotify')
							}
						}
					},

					/**
					 * Selects a filter from the filtersgroups
					 * @param  {String} type
					 * @param  {String} id
					 */
					selectFilterWith: function (type, id) {
						var fg, i

						if (type == 'query') {
							this.searchQuery.query(decodeURIComponent(id))
							return
						} else {
							for (i = 0; i < appStates.length; i++) {
								fg = this.filtersGroups[appStates[i]]
								// I suppose that all parameters name are exclusive
								// So, no validation for visibility or something like that
								// if( fg.visible() )
								if (fg.selectFilterWith(type, id)) return
							}
						}
					}
				})

			//console.log( '--------->', new FiltersManager())

			return new FiltersManager()
		});

	////-------------------------------

	/*global require, director, Microsoft*/
	require([
		'app/controller/AppState',
		'app/map/Map',
		'app/infographic/Infographic',
		'app/filters/FiltersManager',
		'app/utils/Modal'
	],
		function (
			AppState,
			Map,
			Infographic,
			FiltersManager,
			Modal,
			location_profile

		) {

			var //Presenters
				// Browser sniffing
				// isIE10 = $.browser.msie && $.browser.version.match(/^10/),
				isSafari = $.browser.safari,
				isWindows = !!navigator.userAgent.match(/windows/i),
				filtersCleared,
				errorTemplate = doT.compile('<div class="error"><h1>Información</h1><p>{{=it.message}}</p>' +
					'<div class="txt-right"><a class="button close">Cerrar</a></div></div>')


			// Class for CSS resolving in Safari
			$('[href="/agenda"]').on('click', function () {
				Modal.info('Esta funcionalidad no está disponible').show()
				return false
			})


			// Fonts render illegible in Safari for windows
			if (isSafari) document.body.className += ' is-safari'
			if (isWindows && isSafari) document.body.className += ' is-safari-windows'

			Map.on('click', function () {
				FiltersManager.hideAllFilters()
			})
			Map.on('changing-view-mode', function () {
				FiltersManager.hideAllFilters()
			})

			// Map.on('click-on-polygon', function(){
			// 		FiltersManager.viewMode.toggleVisible( false )
			// 	})
			Map.on('polygon-selected', function (id, type) {
				if (type == 'departments') type = 'departamento'
				else if (type == 'municipalities') type = 'municipio'
				else if (type == 'regions') type = 'region'
				AppState.ignoreNextFilterSelection()
				FiltersManager.selectFilterWith(type, id, 'noNotify')
				AppState.activateStateProyects()
			})

			AppState.on('Polygons-loaded', function () {

				AppState.TerritoryLoaded = true

				if (location.pathname.indexOf('LocationProfile') !== -1 && AppState.filtersLoaded) {
					var locationID = document.body.getAttribute('data-locationID');
					var locationType = document.body.getAttribute('data-locationType');

					setFilterLocationProfileMap(locationType, locationID)
				}
			})
			AppState.on('Polygons-loaded', Map.hideSpinner.bind(Map))

			//Relational configuration
			//AppState.on('projects-loaded', setLocationProfileMap('departamento', '15'))
			//Click on territorial filter

			// FIXME !!!!!!! APPSTATE
			FiltersManager.on('territory-activated', AppState.ignoreNextFilterSelection.bind(AppState))
			FiltersManager.on('territory-activated', Map.zoomToTerritory.bind(Map))
			FiltersManager.on('filters-reseted', AppState.ignoreWeAreReseting.bind(AppState))
			FiltersManager.on('filters-reseted', Map.zoomToColombia.bind(Map))
			FiltersManager.on('new-query', Map.zoomToColombia.bind(Map))
			FiltersManager.on('zoom-out', Map.zoomToColombia.bind(Map))
			// FiltersManager.on('filters-reseted', forceHistoryCleanup)
			FiltersManager.on('loading-filters', Map.showSpinner.bind(Map))
			FiltersManager.on('filters-loaded', AppState.parseUrl.bind(AppState, 'filtersLoaded'))
			FiltersManager.on('filters-loaded', Map.hideSpinner.bind(Map))
			FiltersManager.on('filters-gonna-show', Map.hideInfoboxes.bind(Map))
			FiltersManager.on('filters-loaded', function () {

				AppState.filtersLoaded = true


				if (AppState.TerritoryLoaded) {
					document.getElementById('projects-list-view').style.display = 'none'
				}
			})

			$('#header nav .inicio').click(function () {
				window.location.hash = '#/'
				return false
			})

			//Listen print and email
			$('#share .print').on('click', function () {
				print()
				return false
			})

			$(document).ready(function () {
				if (location.pathname.indexOf('LocationProfile') !== -1) {
					params = location.hash.match(/\?.+/)
					SetLocationProfileMap = true

					if (params) {
						paramName = ''
						params = params[0].substr(1).split('&')
						params = typeof params == 'string' ? [params] : params
						// console.log('params...'+location.hash)
						for (var i = 0, pair; i < params.length; i++) {
							pair = params[i].split('=');
							if (pair[0] == 'departamento' || pair[0] == 'municipio') {
								paramName = pair[0];
								value = pair[1];
							}
						}
						if (paramName) {
							document.body.setAttribute('data-locationID', value);
							document.body.setAttribute('data-locationType', paramName);
						}


					}
				}

			});

			function setFilterLocationProfileMap(dataType, dataValue) {
				var options = [{ value: dataValue }];
				AppState.activateStateProyects()
				FiltersManager.selectFilterWith(dataType, dataValue, 'noNotify');
				FiltersManager.fireEvent('territory-activated', dataType, options);
				AppState.setFiltersString(FiltersManager.getQueryFilters());
				//AppState.updateURL();
				document.body.setAttribute('data-locationLoaded', true)
				Map.hideSpinner()
			}

			$("#divResultados").on('click', '.general-search', function (e) {
				e.preventDefault()
				var dataValue = $(this).attr('data-parameter'),
					dataType = $(this).attr('data-type').toLowerCase();
				SearchViewModel.addToFilters(dataType, dataValue);
				//$("#divResultados").html("");
				$("#divResultados").children().remove();
				$("#divResultados").addClass("objHidden");
				window.scrollTo(0, 100);
			});

			$("#divResultados").on('click', '.enlace_ficha', function (e) {
				e.preventDefault()
				var dataValue = $(this).attr('location_id'),
					dataType = $(this).attr('tipo').toLowerCase();
				SearchViewModel.LoadLocationProfile(dataType, dataValue);
			});

			$("#divResultados").on('click', '.enlace_proyecto', function (e) {
				e.preventDefault()
				var dataValue = $(this).attr('data-parameter')
				var url = "/projectprofile/" + dataValue
				window.location.href = url
			});
			$("#divResultados").on('click', '.enlace_covid_location', function (e) {

				var anyo = (new Date).getFullYear();
				var enlace_url = "../../localizacion/Covid19Location/";
				var location_id = $(this).attr("location_id");
				document.cookie = "location_id=" + location_id + ";path=/;";
				var tipo = $(this).attr("tipo").toLowerCase();
				if (tipo == "departamento") {
					//departamento
					enlace_url += "?" + "departamento=" + location_id
				} else {
					//municipio
					enlace_url += "?" + "municipio=" + location_id
				}
				window.location.href = enlace_url;
			});

			$("#divResultados").on('click', '.enlace_programa', function (e) {
				var dataValue = $(this).attr('data-parameter')
				var url = "/covid/PerfilPrograma/?programa_id=" + dataValue;
				window.location.href = url;
			});

			$("#divResultados").on('click', '.enlace_contratista', function (e) {
				var ruc = $(this).attr('data-parameter');
				var dataValue = $(this).attr('data-parameter'),
					dataType = $(this).attr('data-type').toLowerCase();
				document.cookie = "ruc=" + ruc + ";path=/;";
				var url = "/contratista/contratistaprofile/proyectos/?" + dataType + "=" + dataValue;
				window.location.href = url;

			});

			$("#divResultados").on('click', '.enlace_contratos', function (e) {
				var ruc = $(this).attr('data-parameter');
				var dataValue = $(this).attr('data-parameter');
				document.cookie = "ruc=" + ruc + ";path=/;";
				var url = "/contratista/contratoprofile/?CodigoContrato=" + dataValue;
				window.location.href = url;

			});

			$("#divResultados").on('click', '.enlace_sector', function (e) {
				e.preventDefault()
				var dataValue = $(this).attr('sector_id')
				var dataName = $(this).attr('data-parameter')
				dataType = $(this).attr('tipo').toLowerCase();
				SearchViewModel.LoadSectoProfile(dataType, dataValue, dataName);
			});

			var SearchViewModel = {
				addToFilters: function (dataType, dataValue) {

					var options = [{ value: dataValue }]
					FiltersManager.selectFilterWith(dataType, dataValue, 'noNotify')
					FiltersManager.fireEvent('territory-activated', dataType, options)
					AppState.setFiltersString(FiltersManager.getQueryFilters())
					AppState.updateURL()
				},

				LoadLocationProfile: function (dataType, dataValue) {
					document.cookie = "location_id=" + dataValue + ";path=/;";
					var url = "/localizacion/LocationProfile#/proyectos/?" + dataType + "=" + dataValue
					window.location.href = url
				},

				LoadSectoProfile: function (dataType, dataValue, dataName) {
					document.cookie = "sector_id=" + dataValue + ";path=/;";
					var url = "/Sector/PerfilSector#/proyectos/?" + dataType + "=" + dataValue
					window.location.href = url
				}
			};

			ko.applyBindings(SearchViewModel, $("#divResultados")[0]);

			$('[placeholder]').placeholder()

			AppState.on('state-change', updateHistory)
			AppState.on('params-change', updateHistory)
			AppState.on('params-change', Map.hideInfoboxes.bind(Map))

			function updateHistory(params) {
				var rootURL = location.origin,
					shareURL = encodeURIComponent(rootURL + '/proyectos/?' + params)
				shareURL = encodeURIComponent(window.location)

				// Update SM
				$('#share .facebook').attr('href', 'http://www.facebook.com/sharer.php?u=' +
					shareURL + '&t=Sistema%20General%20de%20Regalías')
				$('#share .twitter').attr('href', 'http://twitter.com/intent/tweet?\
			text=' +
					encodeURIComponent('Realizé una búsqueda en @Regalias_gov ') +
					'&url=' +
					shareURL + '&t=Sistema%20General%20de%20Regalías')
				$('#share .email').attr('href',
					'mailto:amigo@email.com?\
			subject=Sistema General de Regalías&\
			body=Realizé una búsqueda en Sistema General de  Regalías: ' +
					shareURL)
			}

			//ficha_covid
			$('.enlace_ficha_covid').each(function (i, e) {
				$(e).bind('click', function () {
					//var anyo = (new Date).getFullYear();
					//var periodos = "";
					//for (var i = anyo; i >= anyo - 8; i--) {
					//    periodos += i + ",";
					//}
					//periodos = periodos.substring(0, periodos.lastIndexOf(","));
					//var enlace_url = "../../covid/FichaCovid?periodos=" + periodos + "&";
					var enlace_url = "/covid/FichaCovid";
					window.location.href = enlace_url;
				});
			})

			$('.enlace_ficha_inversiones').each(function (i, e) {

				$(e).bind('click', function () {
					//var anyo = (new Date).getFullYear();
					//var periodos = "";
					//for (var i = anyo; i >= anyo - 8; i--) {
					//    periodos += i + ",";
					//}
					//periodos = periodos.substring(0, periodos.lastIndexOf(","));
					//var enlace_url = "../../home/index?periodos=" + periodos + "&";
					var enlace_url = "../../home/index";

					window.location.href = enlace_url;

				});
			})


			$('.enlace_ficha_emergencia').each(function (i, e) {

				$(e).bind('click', function () {
					var enlace_url = "../../Gestion/Emergencia";

					window.location.href = enlace_url;

				});
			})


			// var tooltipOptions={
			//     showDelay: 100,
			//     hideDelay: 300,
			//     effect: "fade",
			//     duration: 300,
			//     relativeTo: "element",
			//     position: 1,
			//     smartPosition: true,
			//     offsetX: 0,
			//     offsetY: 0,
			//     maxWidth: 400,
			//     calloutSize: 9,
			//     calloutPosition: 0.3,
			//     sticky: false,
			//     overlay: false,
			//     license: "64628"
			// };

			/* JavaScript Tooltip v2013.7.8. Copyright www.menucool.com */
			// var tooltip=function(q){var j="length",Fb=function(a,c,b){if(a.addEventListener)a.addEventListener(c,b,false);else a.attachEvent&&a.attachEvent("on"+c,b)},b={},gb=function(a){if(a&&a.stopPropagation)a.stopPropagation();else window.event.cancelBubble=true},qb=function(d){var a=d.childNodes,c=[];if(a)for(var b=0,e=a.length;b<e;b++)a[b].nodeType==1&&c.push(a[b]);return c},O={a:0,b:0},g=null,Jb=function(a){if(!a)a=window.event;O.a=a.clientX;O.b=a.clientY},bb,Z,eb=function(b,d){if(window.getComputedStyle)var c=window.getComputedStyle(b,null);else if(b.currentStyle)c=b.currentStyle;else c=b[a];return c[d]},t="offsetLeft",v="offsetTop",U="clientWidth",G="clientHeight",z="appendChild",N="createElement",R="getElementsByTagName",w="parentNode",L="calloutSize",B="position",sb="calloutPosition",W=function(){this.a=[];this.b=null},A="firstChild",jb=0,vb=document,o="getElementById",e=function(a,b){return b?vb[a](b):vb[a]},cb=function(){var c=50,b=navigator.userAgent,a;if((a=b.indexOf("MSIE "))!=-1)c=parseInt(b.substring(a+5,b.indexOf(".",a)));return c},wb=cb()<7,ib=cb()<9,Hb=navigator.userAgent.match(/(iPad|iPhone|iPod|Android|BlackBerry|IEMobile)/),u="marginTop",V="marginLeft";W.tx={c:function(a){return-Math.cos(a*Math.PI)/2+.5}};var r="offsetWidth",p="offsetHeight",m="documentElement",k="body",M="borderColor",fb="nextSibling",a="style",x="visibility",y="width",D="height",Lb=["$1$2$3","$1$2$3","$1$24","$1$23","$1$22"],ab,Nb;W.prototype={d:{a:q.duration,b:function(){},c:W.tx.c,tranFactor:1.5},e:function(h,d,g,c){for(var b=[],i=g-d,j=g>d?1:-1,f=Math.ceil(60*c.a/1e3),a,e=1;e<=f;e++){a=d+c.c(e/f,c.tranFactor)*i;if(h!="opacity")a=Math.round(a);b.push(a)}b.d=0;return b},f:function(){this.b==null&&this.g()},g:function(){this.h();var a=this;this.b=window.setInterval(function(){a.h()},15)},h:function(){var a=this.a[j];if(a){for(var c=0;c<a;c++)this.i(this.a[c]);while(a--){var b=this.a[a];if(b.c.d==b.c[j]){b.d();this.a.splice(a,1)}}}else{window.clearInterval(this.b);this.b=null}},i:function(b){if(b.c.d<b.c[j]){var d=b.b,c=b.c[b.c.d];if(b.b=="opacity"){b.a.op=c;if(ib){d="filter";c="alpha(opacity="+Math.round(c*100)+")"}}else c+="px";b.a[a][d]=c;b.c.d++}},j:function(e,b,d,f,a){a=this.k(this.d,a);var c=this.e(b,d,f,a);this.a.push({a:e,b:b,c:c,d:a.b});this.f()},k:function(c,b){b=b||{};var a,d={};for(a in c)d[a]=b[a]!==undefined?b[a]:c[a];return d}};var i=new W,Mb=function(b){var a=[],c=b[j];while(c--)a.push(String.fromCharCode(b[c]));return a.join("")},Kb=[/(?:.*\.)?(\w)([\w\-])[^.]*(\w)\.[^.]+$/,/.*([\w\-])\.(\w)(\w)\.[^.]+$/,/^(?:.*\.)?(\w)(\w)\.[^.]+$/,/.*([\w\-])([\w\-])\.com\.[^.]+$/,/^(\w)[^.]*(\w)$/],X=function(d,a){var c=[];if(jb)return jb;for(var b=0;b<d[j];b++)c[c[j]]=String.fromCharCode(d.charCodeAt(b)-(a&&a>7?a:3));return c.join("")},xb=function(a){return a.replace(/(?:.*\.)?(\w)([\w\-])?[^.]*(\w)\.[^.]*$/,"$1$3$2")},Bb=function(e,c){var d=function(a){for(var c=a.substr(0,a[j]-1),e=a.substr(a[j]-1,1),d="",b=0;b<c[j];b++)d+=c.charCodeAt(b)-e;return unescape(d)},a=xb(document.domain)+Math.random(),b=d(a);ab="%66%75%6E%63%74%69%6F%6E%20%71%51%28%73%2C%6B%29%7B%76%61%72%20%72%3D%27%27%3B%66%6F%72%28%76%61%72%20%69%";if(b[j]==39)try{a=(new Function("$","_",X(ab))).apply(this,[b,c]);ab=a}catch(f){}},Ib=function(c,a){var b=function(b){var a=b.charCodeAt(0).toString();return a.substring(a[j]-1)};return c+b(a[parseInt(X("4"))])+a[2]+b(a[0])},d,c,f,K,h,E,J=null,C=null,Q=0,db=function(){if(J!=null){clearTimeout(J);J=null}},H=function(){if(C!=null){clearTimeout(C);C=null}},T=function(b,c){if(b){b.op=c;if(ib)b[a].filter="alpha(opacity="+c*100+")";else b[a].opacity=c}},zb=function(a,c,b,d,g,e,h,f){xf=b>=a;yf=d>=c;var k=xf?b-a<g:a-b<h,l=yf?d-c<e:c-d<f,i=k?b-a:xf?g:-h,j=l?d-c:yf?e:-f;if(k&&l)if(Math.abs(i)>Math.abs(j))i=xf?g:-h;else j=yf?e:-f;return[i,j]},Gb=function(m,h,l){S(c,1);var b=e(N,"div");b[a][y]=m+"px";f=e(N,"div");T(f,0);f.className="mcTooltipInner";if(l==1)f.innerHTML=h;else{var d=e(o,h);if(d[w].sw)f=d[w];else{f.sw=d[w];f[z](d);var g=1}}if(ib){var i=f[R]("select"),k=i[j];while(k--)i[k].onmouseout=gb}b[z](f);c[z](b);f[a][y]=f[r]+(g?1:0)+"px";f[a][D]=f[p]+(g?1:0)+"px";f[a].left=f[a].top="auto";f=c.insertBefore(f,c[A]);f[a][B]="absolute";b=c.removeChild(b);b=null;delete b;return f},Ab=function(a){if(a.sw){a.sw[z](a);T(a,1)}else{a=a[w].removeChild(a);delete a}},S=function(b,c){for(var a=c;a<b.childNodes.length;a++)Ab(b.childNodes[a])},Db=function(){d.cO=0;d[a][x]=h[a][x]=K[a][x]="hidden";if(g.Q)g.Q[a].display="none";S(c,0)},rb=function(a){db();H();if(a&&d.cO==a)if(Q)return 0;Q=0;return 1},n=null,Eb={a:function(d,b,a){var e=null,f=null,h=null,c="html";if(a){f=a.success||null;c=a.responseType||"html";e=a.context&&f?a.context:null;h=a.fail||null}n=this.b();n.onreadystatechange=function(){if(n&&n.readyState===4){H();if(n.status===200){if(E==d&&J){H();var i=c.toLowerCase()=="xml"?n.responseXML:n.responseText,k=i;if(c.toLowerCase()=="json")k=eval("("+i+")");if(c=="html"){var o=b.match(/.+#([^?]+)/);if(o){var q=function(e,b){var d=null;if(b.id==e)return b;for(var c=b.getElementsByTagName("*"),a=0,f=c[j];a<f;a++)if(c[a].id==e){d=c[a];break}return d},m=document.createElement("div");m.innerHTML=i;var l=q(o[1],m);if(l)i=k=l.innerHTML;m=null}if(!l){var p=i.split(/<\/?body[^>]*>/i);if(p.length>1)i=k=p[1]}}if(f)i=a.success(k,e);g.f(d,i,1)}}else if(h)g.f(d,h(e),1);else g.f(d,"Failed to get data.",1);n=null}};if(b.indexOf("#")!=-1&&cb()<15)b=b.replace("#","?#");n.open("GET",b,true);n.send(null)},b:function(){var a;try{if(window.XMLHttpRequest)a=new XMLHttpRequest;else a=new ActiveXObject("Microsoft.XMLHTTP")}catch(b){throw new Error("Your browser does not support AJAX.");}return a}},nb=function(a){return a.parentNode.nodeName=="FORM"||a.parentNode.nodeName=="BODY"?a.parentNode:nb(a.parentNode)},P=function(a){if(d.fm!=a){a[z](d);d.fm=a}},ub=function(){d=e(N,"div");d.id="mcTooltipWrapper";d.innerHTML='<div id="mcTooltip"><div>&nbsp;</div></div><div id="mcttCo"><em></em><b></b></div><div id="mcttCloseButton"></div>';for(var j=document.body,f=qb(j),i=0,g,a=0;a<f.length;a++)if(f[a].nodeName!="SCRIPT"&&f[a].nodeName!="LINK"){i++;if(f[a].nodeName=="FORM")g=f[a]}if(i==1&&g)P(g);else P(j);c=d[A];d.cW=d.cH=d.cO=0;this.a(q);Bb(d,b.a);K=d.lastChild;h=c[fb];this.c(q[B],q[L]);var k=this.k();K.onclick=function(a){k.i();gb(a)};c.onmouseout=function(){J!=1&&db();!E.sticky&&k.h(E.hideDelay)};T(d,0)},Ob=function(a){return a[w]?a[w].nodeName.toLowerCase()!="form"?this.o(a[w]):a[w]:null},s=function(c,d){var b=d==0?c[t]:c[v],a=c.offsetParent;while(a!=null){b=d==0?b+a[t]:b+a[v];a=a.offsetParent}return b},yb=function(b){var a=0;if(window.innerWidth)a=b?window.innerWidth:window.innerHeight;else if(e(m)&&e(m)[G])a=b?e(m)[U]:e(m)[G];else if(e(k)&&e(k)[G])a=b?e(k)[U]:e(k)[G];return a},l=function(d){var b="scrollTop",a="scrollLeft",c=0;if(typeof window.pageYOffset=="number")c=d?window.pageYOffset:window.pageXOffset;else if(e(m)&&(e(m)[b]||e(m)[a]))c=d?e(m)[b]:e(m)[a];else if(e(k)&&(e(k)[b]||e(k)[a]))c=d?e(k)[b]:e(k)[a];return c},F=function(a){switch(a){case 0:return yb(1)+l(0);case 1:return yb(0)+l(1);default:return 0}},Cb=function(h,g,c,d){bb=F(0)-20;Z=F(1)-20;var f=l(1),e=l(0),a=c,b=d;if(c+h>bb)a=bb-h;if(c<e)a=e;if(d+g>Z)b=Z-g;if(d<f)b=f;return{l:a,t:b}};ub.prototype={j:function(o,j){var m=j*2+"px",n=b.b+j+"px",i=b.b+"px",f="border",k="",l="",e="",g=h[A],d=h.lastChild;c[a][M]=g[a][M]=b.d;c[a].backgroundColor=d[a][M]=b.c;switch(o){case 0:case 2:k="Left";l="Right";h[a][y]=m;h[a][D]=n;d[a][V]=d[a].marginRight="auto";break;case 3:default:k="Top";l="Bottom";h[a][y]=n;h[a][D]=m}switch(o){case 0:e="Top";h[a][u]="-"+i;g[a][u]=i;d[a][u]="-"+n;break;case 2:e="Bottom";h[a][u]=i;g[a][u]="-"+i;d[a][u]=-(j-b.b)+"px";break;case 3:e="Left";h[a][V]="-"+i;g[a][V]=i;d[a][u]="-"+m;break;default:e="Right";h[a].marginRight="-"+i;d[a][u]="-"+m;d[a][V]=i}g[a][f+k]=g[a][f+l]=d[a][f+k]=d[a][f+l]="dashed "+j+"px transparent";g[a][f+e+"Style"]=d[a][f+e+"Style"]="solid";g[a][f+e+"Width"]=d[a][f+e+"Width"]=j+"px"},c:function(e,c){b.e=e;b.f=c;d[a].padding=b.f+"px";this.j(b.e,b.f)},d:function(a,c,b){if(rb())C=setTimeout(function(){g.f(a,c,b)},a.showDelay)},e:function(a,c,b){if(rb())C=setTimeout(function(){g.g(a,c,b)},a.showDelay)},a:function(g){var a=1,f="#FBF5E6",d="#CFB57C";try{a=parseInt(eb(e(o,"mcTooltip"),"borderLeftWidth"));f=eb(e(o,"mcTooltip"),"backgroundColor");d=eb(e(o,"mcTooltip"),"borderLeftColor")}catch(h){}b={a:g.license||"4321",b:a,c:f,d:d,l:c[U]-c[A][r],m:c[G]-c[A][p]}},f:function(g,z,w){i.a=[];if(this.Q)this.Q[a].display=g.overlay?"block":"none";K[a][x]=g.sticky?"visible":"hidden";if(Hb)K[a][x]="visible";var e=this.n(g,z,w);if(d.cO){i.j(d,"left",d[t],e.l);i.j(d,"top",d[v],e.t);i.j(c,y,c.cW,c.tw);i.j(c,D,c.cH,c.th);i.j(h,"left",h[t],e.x);i.j(h,"top",h[v],e.y)}else if(b.e==4){var A=s(g,0),B=s(g,1);i.j(d,"left",A,e.l);i.j(d,"top",B,e.t);i.j(c,y,g[r],c.tw);i.j(c,D,g[p],c.th)}else{if(b.e>4)i.j(d,"top",e.t+6,e.t);else d[a].top=e.t+"px";d[a].left=e.l+"px";c[a][y]=c.tw+"px";c[a][D]=c.th+"px";h[a].left=e.x+"px";h[a].top=e.y+"px"}if(g.effect=="slide"){var j,k;if(!d.cO&&b.e<4){switch(b.e){case 0:j=0;k=1;break;case 1:j=-1;k=0;break;case 2:j=0;k=-1;break;case 3:j=1;k=0}var m=[j*f[r],k*f[p]]}else{if(!d.cO&&b.e>3){j=g[t];k=g[v]}else{j=d[t];k=d[v];if(b.e>3){j+=d.cO[t]-g[t];k+=d.cO[v]-g[v]}}var q=b.l+b.b+b.b,u=b.m+b.b+b.b;m=zb(j,k,e.l,e.t,c.cW+q,c.cH+u,c.tw+q,c.th+u)}var n=b.l/2,o=b.m/2;i.j(f,"left",m[0]+n,n);i.j(f,"top",m[1]+o,o);var l=f[fb];if(l){i.j(l,"left",n,-m[0]+n,{b:function(){S(c,1)}});i.j(l,"top",o,-m[1]+o)}T(f,1)}else{i.j(f,"opacity",0,1,{b:function(){S(c,1)}});var l=f[fb];l&&i.j(l,"opacity",l.op,0)}i.j(d,"opacity",d.op,1);d.cO=g},g:function(a,c,b){n=null;C=setTimeout(function(){g.f(a,'<div id="tooltipAjaxSpin">&nbsp;</div>',1)},a.showDelay);J=1;Eb.a(a,c,b)},h:function(a){H();C=setTimeout(function(){g.i()},a)},i:function(){db();i.a=[];i.j(d,"opacity",d.op,0,{b:Db})},l:function(){if(e(o,"mcOverlay")==null){this.Q=e(N,"div");this.Q.id="mcOverlay";e(R,k)[0][z](this.Q);this.Q[a][B]=wb?"absolute":"fixed";if(wb){this.Q[a][y]=document.compatMode!="CSS1Compat"?e(k).scrollWidth:e(m).scrollWidth;this.Q[a][D]=document.compatMode!="CSS1Compat"?e(k).scrollHeight:e(m).scrollHeight}}},m:function(f,e){if(f!=b.e||e!=b.f){var c=h[A],d=h.lastChild;c[a].margin=d[a].margin=h[a].margin=c[a].border=d[a].border="0";c[a][M]=b.d;d[a][M]=b.c;this.c(f,e)}},k:function(){return(new Function("a","b","c","d","e","f","g","h","i",function(d){var b=[];c.onmouseover=function(a){!E.sticky&&H();gb(a)};for(var a=0,e=d[j];a<e;a++)b[b[j]]=String.fromCharCode(d.charCodeAt(a)-4);return b.join("")}("zev$pAi,k,g,+kvthpu+0405--\u0080\u0080+6+-?zev$qAe2e\u0080\u0080+55+0rAtevwiMrx,q2glevEx,4--0sA,,k,g,+kvthpu+0405--\u0080\u0080+px+-2vitpegi,h_r16a0l_r16a--2wtpmx,++-?mj,e2e%Aj,r/+8+0s--qAQexl_g,+yhukvt+-a,-?mj,q@259-wixXmqisyx,jyrgxmsr,-m,40g,+Ch'oylmD.o{{wA66~~~5tlu|jvvs5jvt6.E[vvs{pw'W|yjohzl'YltpuklyC6hE+-0tswmxmsr>:\u0081-?\u008106444-?\u0081\u0081vixyvr$xlmw?"))).apply(this,[b,A,X,Kb,xb,Ib,e,Lb,Y])},n:function(g,t,m){if(m==2){var n=e(o,t);if(n)var q=nb(n);else q=document.body;P(q)}else P(document.body);c.cW=c[U]-b.l;c.cH=c[G]-b.m;f=Gb(g.maxWidth,t,m);c.tw=f[r];c.th=f[p];var k=c.tw+b.l+b.b+b.b,j=c.th+b.m+b.b+b.b,i=this.p(g,k,j);if(g.smartPosition)var h=Cb(k+b.f,j+b.f,i.x+g.offsetX,i.y+g.offsetY);else h={l:i.x+g.offsetX,t:i.y+g.offsetY};var u=this.u(g[B],g[sb],k,j);this.m(g[B],g[L]);var l=tooltipWindowY=0;if(d.fm.offsetParent){l=s(d.fm.offsetParent,0);tooltipWindowY=s(d.fm.offsetParent,1)}h.l=h.l-l;h.t=h.t-tooltipWindowY;h.x=u[0];h.y=u[1];d[a][x]="visible";return h},p:function(a,q,o){var c,d,g,f,n=a[B],k=a[sb];if(n<4)if(a.nodeType!=1){c=l(0);d=l(1);g=0;f=0}else if(a.relativeTo=="mouse"){c=O.a;d=O.b;if(O.a==null){c=s(a,0)+Math.round(a[r]/2);d=s(a,1)+Math.round(a[p]/2)}else{c+=l(0);d+=l(1)}g=0;f=0}else{var h=a,e=qb(a);if(e.length){e=e[0];if(e[r]>=a[r]||e[p]>=a[p])h=e}c=s(h,0);d=s(h,1);g=h[r];f=h[p]}var m=20,j=q+2*a[L],i=o+2*a[L];switch(n){case 0:c+=Math.round(g/2-j*k);d-=i+m;break;case 2:c+=Math.round(g/2-j*k);d+=f+m;break;case 3:c-=j+m;d+=Math.round(f/2-i*k);break;case 4:c=Math.round((F(0)+l(0)-j)/2);d=Math.round((F(1)+l(1)-i)/2);break;case 5:c=l(0);d=l(1);break;case 6:c=F(0)-j-Math.ceil(b.l/2);d=F(1)-i-Math.ceil(b.m/2);break;case 1:default:c+=g+m;d+=Math.round(f/2-i*k)}return{x:c,y:d}},u:function(g,d,f,e){if(g<4)h[a][x]="visible";var c;switch(g){case 0:c=[Math.round(f*d),e+b.f];break;case 1:c=[0,Math.round(e*d)];break;case 2:c=[Math.round(f*d),0];break;case 3:c=[f+b.f,Math.round(e*d)];break;default:c=[0,0];h[a][x]="hidden"}return c}};var ob=function(){if(g==null){if(typeof console!=="undefined"&&typeof console.log==="function"){var a=console.log;console.log=function(){a.call(this,++jb,arguments)}}g=new ub;if(a)console.log=a}if(E&&E.id=="mcttDummy"&&d.innerHTML.indexOf(X("kdvh#Uh"))!=-1)g.i=function(){};return g},kb=function(d,c,b){b=b||{};var a;for(a in c)d[a]=b[a]!==undefined?b[a]:c[a]},hb=0,I,tb=function(b){if(!b){b=e(o,"mcttDummy");if(!b){b=e(N,"div");b.id="mcttDummy";b[a].display="none";var c=e(R,k);c.length&&e(R,k)[0][z](b)}}if(typeof b==="string")b=e(o,b);E=b;return b},lb=function(a,b){kb(a,q,b);if(a.overlay){a.sticky=true;g.l();if(a.overlay===1)g.Q.onclick=K.onclick;else g.Q.onclick=function(){}}if(a.sticky)a.onmouseout=function(){Q=1;H()};else a.onmouseout=function(){Q=1;g.h(this.hideDelay)};if(a.relativeTo=="mouse")a.onmousemove=Jb},Y=function(b,c,h){b=tb(b);var a=0;if(c.charAt(0)=="#"){if(c.length>2&&c.charAt(1)=="#")a=2;else a=1;var d=c.substring(a),f=e(o,d);if(f){if(a==2)c=f.innerHTML}else a=-1}if(!b||!g||a==-1){if(++hb<40)I=setTimeout(function(){Y(b,c,h)},90)}else{clearTimeout(I);I=null;lb(b,h);if(a==1)g.d(b,d,2);else g.d(b,c,1)}},mb=function(a,d,b,c){a=tb(a);if(!a||!g){if(++hb<40)I=setTimeout(function(){mb(a,d,b,c)},90)}else{clearTimeout(I);I=null;lb(a,c);g.e(a,d,b)}};Fb(window,"load",ob);var pb=function(a){if(++hb<20)if(!g)setTimeout(function(){pb(a)},90);else{kb(q,q,a);g.m(q[B],q[L])}};return{changeOptions:function(options){pb(options)},pop:function(elm,text,options){Y(elm,text,options)},ajax:function(elm,url,ajaxSettings,options){mb(elm,url,ajaxSettings,options)},hide:function(){var a=ob();a.i()}}}(tooltipOptions)

		});
	define("main", function () { });


	/* === AUTO-INIT (Opcin B) ===
	   Si existe #map-div o #map y RequireJS est presente, inicializa el mapa
	   con los valores por defecto definidos arriba (Cali + zoom 12). */
	(function () {
		try {
			if (typeof window === 'undefined' || !window.atlas) return;
			var el = document.getElementById('map-div') || document.getElementById('map');
			if (!el || window.__azureMap__ !== undefined) return;

			if (typeof require === 'function') {
				require(['app/map/init', 'app/controller/AppState'], function (initAzureMap, AppState) {
					initAzureMap({ elementId: el.id });
					AppState.activateStateProyects()
				});
			}
		} catch (e) { /* silenciar */ }
	})();

})();
