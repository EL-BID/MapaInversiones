/*global define, window */
(function () {
	'use strict';

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
                    subscriptionKey: '' // aqui va la key
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
												var url = p.url ;
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
            var elementId = opts.elementId || 'map-div'; // ID del elemento HTML donde se mostrará el mapa	
            var key = opts.subscriptionKey || '';  // aqui se pone la clave de Azure Maps
			var center = opts.center || { latitude: 3.4516, longitude: -76.5320 }; // Se usa como coordenada “representativa” de Cali en bases de datos, GPS y APIs de mapas.
            var zoom = typeof opts.zoom === 'number' ? opts.zoom : 12; // Zoom por defecto

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

	/* === AUTO-INIT (Opcin B) ===
	   Si existe #map-div o #map y RequireJS est presente, inicializa el mapa
	   con los valores por defecto definidos arriba (Cali + zoom 12). */
	(function () {
		try {
			if (typeof window === 'undefined' || !window.atlas) return;
			var el = document.getElementById('map-div') || document.getElementById('map');
			if (!el || window.__azureMap__ !== undefined) return;

			if (typeof require === 'function') {
				require(['app/map/init'], function (initAzureMap) {
					initAzureMap({ elementId: el.id });
				});
			}
		} catch (e) { /* silenciar */ }
	})();

})();
