/*global define*/
/*jshint multistr: true */
define([
		'./urlsMap',
		'./debugMunicipalities',
		'./debugDepartments',
		'./debugRegions',
		'./debugFiscalizacion',
		'./debugFilters',
		'./debugFiscConsol'
	], function(
		urls,
		municipalities,
		departments,
		regions,
		debugFiscalizacion,
		debugFilters,
		debugFiscConsol
	){
	'use strict';
	var FROMLOCAL = false,
		testCount = 0,
		cachedDetailMonth = [
				{
					'Mes':'Enero',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Febrero',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Marzo',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Abril',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Mayo',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Junio',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Julio',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Agosto',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Septiembre',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Octubre',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Noviembre',
					'ValorTotalPorMes':'321.123.456'
				},
				{
					'Mes':'Diciembre',
					'ValorTotalPorMes':'321.123.456'
				}
			]

	$.mockjaxSettings.responseTime = 0
	$.mockjax(function(settings){
		console.log(settings.url)
		var urlMatch = settings.url.match(/\/poligonos\/([^\/]+)/),
			suffix = '',
			duration = 0,
			data

		if(FROMLOCAL) suffix = 'Empty'
		if(settings.url.indexOf('municip') != -1) duration = 0
		if(urlMatch){
			return {
				contentType: 'application/json',
				proxy: '../content/js/data/' + urlMatch[1] + suffix + '.json',
				responseTime: duration
			}
		}
	})

	$.mockjax({
		url: urls.filtersProjects,
		responseTime: 0,
		response: function () {
			this.responseText = {
				'status': true,
				'filters': debugFilters
			}
		}
	})

	//Búsqueda proyectos mapa
	$.mockjax({
		url: urls.searchProjects,
		// responseTime: responseDuration,
		response: function (params) {
			var zoom, objects = [], nw, se
			if(params.data){
				zoom = params.data.match(/zoom=(\d+)/)
				nw = params.data.match(/topLeft=([\d\.\-\,]+)/) ? 
					params.data.match(/topLeft=([\d\.\-\,]+)/)[1].split(','):''
				se = params.data.match(/bottomRight=([\d\.\-\,]+)/) ?
					params.data.match(/bottomRight=([\d\.\-\,]+)/)[1].split(','):''
				if( true ){// zoom && zoom[1]){
					if(zoom[1] >= 8 && zoom[1] < 12){ // municipalities
						
						var mod = Math.round(8 * Math.random())
						var municipalities2 = municipalities.map(function(entity){
							var obj = $.extend(null, entity)
							obj.projectNumber = Math.round(Math.random()*60)
							obj.approvedMoney = Math.round(Math.random()*909999909)
							return obj
						})
						municipalities2 = municipalities2.filter(function(entity, index){
							return index % 9 == mod
						})
						objects = objects.concat(municipalities2)
					}else if(zoom[1] < 8){ // departamentos
						var departments2 = departments.map(function(entity){
							var obj = $.extend(null, entity)
							obj.projectNumber = Math.round(Math.random()*60)
							obj.approvedMoney = Math.round(Math.random()*909999909)
							return obj
						})
						objects = objects.concat(departments2)

						var regions2 = regions.map(function(entity){
							var obj = $.extend(null, entity)
							obj.projectNumber = Math.round(Math.random()*60)
							obj.approvedMoney = Math.round(Math.random()*909999909)
							return obj
						})
						objects = objects.concat(regions2)
						// console.warn('yeah'+testCount)

					}
					if(true || zoom[1] >= 7){
						var width = + se[0] - nw [0],
							height = + se[1] - nw [1],
							groups = Math.random() * 4,
							projects = 10,
							i, obj

						for(i=0; i<groups; i++){
							obj = {
								'type': 'group',
								'count': Math.round(140 * Math.random()),
								'totalValue': Math.round(9900000000 * Math.random()),
								'latitude': + nw[0] + Math.random() * width,
								'longitude': + nw[1] + Math.random() * height,
								'location': 'Bogotá D.C.' + Math.round(Math.random() * 20)
							}
							if( obj.count > 5 ){
								// yeah back misspelling
								obj.UsanMismaGeorefenciacion = true
								// obj.IdPrimerProyectoUsanMismaGeoreferenciacion = true
							}
							objects.push( obj )
						}
						for(i=0; i<projects; i++){
							objects.push({
								'type': 'project',
								'name': 'Construcción adecuacion y obras\
									complementarias fase final del puente\
									Francisco J Peñaloza sobre Rio Magdalena\
									via Suarez Espinal en Departamento del\
									Tolima.',
								'value': Math.round(500000000 * Math.random()),
								'state': 'VIABILIDAD DNP',
								'url': 'projects.html',
								'location': 'Rio Magdalena via Suarez Espinal en\
									Departamento del Tolima',
								'latitude': + nw[0] + width * Math.random(),
								'longitude': + nw[1] + height * Math.random(),
								'image': 'http://www.escapefromamerica.com/wp-\
									content/uploads/2012/07/7_colombiamining.jpg'
							})
						}
					}
				}
			}

			this.responseText = {
				'status': true,
				'objects': objects,
				'collectedMoney': Math.round(Math.random()*1000000000),
				'approvedMoney': Math.round(Math.random()*943072838885024),
				'approvedProjects': Math.round(Math.random()*1000),
				'approvedMoneyTotal': Math.round(Math.random()*943072838885024),
				'totalProjectsNumber': Math.round(300 * Math.random())
			}

			if( testCount++ < 3 ) return
			console.log('NOOOOOO')
			// FIXME
			this.responseText = {
				"objects": [
					{
						"id": "02",
						"approvedMoney": 456415786377,
						"projectNumber": 314,
						"approvedTotalMoney": 588368929901,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "region",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "01",
						"approvedMoney": 1239718640948,
						"projectNumber": 327,
						"approvedTotalMoney": 1426008205814,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "region",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "06",
						"approvedMoney": 812913763961,
						"projectNumber": 303,
						"approvedTotalMoney": 1516975648841,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "region",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "03",
						"approvedMoney": 2594576594707,
						"projectNumber": 770,
						"approvedTotalMoney": 3557828268711,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "region",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "04",
						"approvedMoney": 757125093173,
						"projectNumber": 383,
						"approvedTotalMoney": 1319399122501,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "region",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "05",
						"approvedMoney": 904481647189,
						"projectNumber": 229,
						"approvedTotalMoney": 1308637850191,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "region",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "18",
						"approvedMoney": 81968682942,
						"projectNumber": 21,
						"approvedTotalMoney": 106204406328,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "85",
						"approvedMoney": 399310842760,
						"projectNumber": 97,
						"approvedTotalMoney": 426520330717,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "52",
						"approvedMoney": 224211099128,
						"projectNumber": 164,
						"approvedTotalMoney": 664242303684,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "08",
						"approvedMoney": 93311897778,
						"projectNumber": 16,
						"approvedTotalMoney": 128002780594,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "15",
						"approvedMoney": 230090779001,
						"projectNumber": 95,
						"approvedTotalMoney": 321343218527,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "54",
						"approvedMoney": 62413866543,
						"projectNumber": 45,
						"approvedTotalMoney": 221119771701,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "76",
						"approvedMoney": 129461117284,
						"projectNumber": 31,
						"approvedTotalMoney": 168621422115,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "73",
						"approvedMoney": 108965576797,
						"projectNumber": 115,
						"approvedTotalMoney": 120052863981,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "50",
						"approvedMoney": 445278368950,
						"projectNumber": 77,
						"approvedTotalMoney": 504989714727,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "25",
						"approvedMoney": 242195776629,
						"projectNumber": 103,
						"approvedTotalMoney": 400457462326,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "68",
						"approvedMoney": 222818525998,
						"projectNumber": 141,
						"approvedTotalMoney": 376872524945,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "20",
						"approvedMoney": 573612175696,
						"projectNumber": 163,
						"approvedTotalMoney": 797892940745,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "23",
						"approvedMoney": 377845863368,
						"projectNumber": 176,
						"approvedTotalMoney": 451819915414,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "70",
						"approvedMoney": 237602274346,
						"projectNumber": 142,
						"approvedTotalMoney": 266460081471,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "44",
						"approvedMoney": 610901337765,
						"projectNumber": 123,
						"approvedTotalMoney": 645048641233,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "05",
						"approvedMoney": 638148319223,
						"projectNumber": 163,
						"approvedTotalMoney": 817911825922,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "19",
						"approvedMoney": 294335855732,
						"projectNumber": 69,
						"approvedTotalMoney": 477189443167,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "99",
						"approvedMoney": 50279216777,
						"projectNumber": 6,
						"approvedTotalMoney": 50844219330,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "86",
						"approvedMoney": 90781011144,
						"projectNumber": 93,
						"approvedTotalMoney": 98392074295,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "81",
						"approvedMoney": 303653702351,
						"projectNumber": 126,
						"approvedTotalMoney": 370357532084,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "41",
						"approvedMoney": 174420837662,
						"projectNumber": 77,
						"approvedTotalMoney": 263868442467,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "27",
						"approvedMoney": 164905691817,
						"projectNumber": 39,
						"approvedTotalMoney": 206922479873,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "13",
						"approvedMoney": 182944634808,
						"projectNumber": 78,
						"approvedTotalMoney": 215854342783,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "88",
						"approvedMoney": 57779374131,
						"projectNumber": 7,
						"approvedTotalMoney": 57779374131,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "17",
						"approvedMoney": 198530951999,
						"projectNumber": 37,
						"approvedTotalMoney": 403475639412,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "63",
						"approvedMoney": 11606605463,
						"projectNumber": 11,
						"approvedTotalMoney": 30726770078,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "66",
						"approvedMoney": 56195770507,
						"projectNumber": 20,
						"approvedTotalMoney": 94763944012,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "47",
						"approvedMoney": 499944426817,
						"projectNumber": 69,
						"approvedTotalMoney": 1044736862269,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "97",
						"approvedMoney": 10054886350,
						"projectNumber": 6,
						"approvedTotalMoney": 12054886350,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "95",
						"approvedMoney": 20406277633,
						"projectNumber": 12,
						"approvedTotalMoney": 50506176481,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "91",
						"approvedMoney": 4001189829,
						"projectNumber": 9,
						"approvedTotalMoney": 4134474829,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					},
					{
						"id": "94",
						"approvedMoney": 10735346126,
						"projectNumber": 3,
						"approvedTotalMoney": 10735346126,
						"latitude": 0,
						"longitude": 0,
						"location": null,
						"type": "departamento",
						"UsanMismaGeorefenciacion": false
					}
				],
				"collectedMoney": 0,
				"approvedMoney": 6629815190289,
				"approvedProjects": 2319,
				"approvedMoneyTotal": 9385510309292,
				"totalProjectsNumber": 2319,
				"status": true,
				"message": null
			}
		}
	})

	$.mockjax({
		url: urls.infoboxesResources,
		// responseTime: responseDuration,
		response: function(params){
			console.log( JSON.stringify(params.data) )
			params.data = params.data || 'zoom=6&topLeft=11.726509410167694,-91.7140625&bottomRight=-5.5404989748491715,-60.0734375'
			var nw = params.data.match(/topLeft=([\d\.\-\,]+)/) ? 
					params.data.match(/topLeft=([\d\.\-\,]+)/)[1].split(','):'',
				se = params.data.match(/bottomRight=([\d\.\-\,]+)/) ?
					params.data.match(/bottomRight=([\d\.\-\,]+)/)[1].split(','):'',
				width = + se[0] - nw [0],
				height = + se[1] - nw [1],
				res = Math.random() * 40,
				i, obj, k, j,
				fuente, pfuente, periodos,
				fuentes = [null],
				entity,
				objects = [],
				allFuentes = [
					'Fondo de ciencia, tecnología e innovación',
					'Asignaciones Directas',
					'Propios',
					'Fondo  de compensación regional',
					'Nación',
					'Fondo  de desarrollo regional'
				],
				periodosRand = !!Math.round(Math.random()),
				objsArray

			pfuente = params.data.match(/fuentes=([-\d]+)/)
			fuente = pfuente && pfuente[1]
			periodos = periodosRand ? ['2012'] : ['2012','2013-2014']
			if(fuente == '-1'){
				fuentes = allFuentes
			}else if(fuente || fuente === 0){
				fuentes = [
					allFuentes[Math.floor(Math.random()*allFuentes.length)]
				]
			}
			for(k=0; k<res; k++){
				objsArray = Math.random() > 0.5 ? departments : municipalities
				entity = objsArray[~~(objsArray.length * Math.random())]
				obj = {}
				obj.IdEntidad = entity.id
				obj.TipoEntidad = entity.type
				obj.TipoInfografico = 'G'
				obj.latitud = + nw[0] + Math.random() * width,
				obj.longitud = + nw[1] + Math.random() * height,
				obj.infograficosRecursos = []
				obj.Url = 'http://google.com'
				for( i=0; i<periodos.length; i++){
					obj.infograficosRecursos[i] = {
						Periodo: periodos[i],
						PeriodoPresupuestal: '(' + periodos[i] + ')',
						DetalleInfograficoRecursos: []
					}
					for( j=0; j<fuentes.length; j++){
						obj.infograficosRecursos[i]
							.DetalleInfograficoRecursos[j] = {
								FuenteFinanciacion: fuentes[j],
								'detalleTipoRecurso': {
									'TotalPresupuesto':(999999999999 * Math.random()).toFixed(2),
									'TotalAprobado':(999999999999 * Math.random()).toFixed(2),
									'CantidadProyectosAprobados': Math.random().toFixed(1)
								}
							}
					}
				}
				objects[k] = obj
			}
			this.responseText = {
				'status': true,
				'pushPinsRecursos': objects
			}
		}
	})



	//Búsqueda recursos polígonos
	$.mockjax({
		url: urls.searchResources,
		// responseTime: responseDuration,
		response: function (params) {
			var fuentes = [null],
				pfuente, fuente, periodos,
				objects = [],
				allFuentes = [
					'Fondo de ciencia, tecnología e innovación',
					'Asignaciones Directas',
					'Propios',
					'Fondo  de compensación regional',
					'Nación',
					'Fondo  de desarrollo regional'
				],
				periodosRand = !!Math.round(Math.random()),
				i, j,
				municipalities2,
				regions2,
				departments2,
				mod, zoom, nw, se

			function terrytoryMaping(entity){
				var obj = {}
				obj.IdEntidad = entity.id
				obj.TipoEntidad = entity.type
				obj.TipoInfografico = 'G'
				obj.infograficosRecursos = []
				obj.Url = 'http://google.com'

				for( i=0; i<periodos.length; i++){
					obj.infograficosRecursos[i] = {
						Periodo: periodos[i],
						PeriodoPresupuestal: '(' + periodos[i] + ')',
						DetalleInfograficoRecursos: []
					}
					for( j=0; j<fuentes.length; j++){
						obj .infograficosRecursos[i]
							.DetalleInfograficoRecursos[j] = {
								FuenteFinanciacion: fuentes[j],
								'detalleTipoRecurso': {
									'TotalPresupuesto': (999999999999 * Math.random()).toFixed(2),
									'TotalAprobado': (999999999999 * Math.random()).toFixed(2),
									'CantidadProyectosAprobados': Math.random().toFixed(1)
								}
							}
					}
				}
				return obj
			}

			// if(params.data){
				zoom = params.data.match(/zoom=(\d+)/)
				pfuente = params.data.match(/fuentes=([-\d]+)/)
				fuente = pfuente && pfuente[1]
				periodos = periodosRand ? ['2012'] : ['2012','2013-2014']
				if(fuente == '-1'){
					fuentes = allFuentes
				}else if(fuente || fuente === 0){
					fuentes = [
						allFuentes[Math.floor(Math.random()*allFuentes.length)]
					]
				}else{
					fuentes = allFuentes
				}
				// if(zoom && zoom[1]){
					if(zoom && (zoom[1] >= 8) && (zoom[1] < 12)){ // municipalities
						mod = Math.round(8 * Math.random())
						municipalities2 = municipalities.map( terrytoryMaping )
						municipalities2 = municipalities2.filter(function(entity, index){
							return index % 9 == mod
						})
						objects = objects.concat(municipalities2)
					}else if(!zoom || zoom[1] < 8){ // departamentos
						departments2 = departments.map( terrytoryMaping )
						objects = objects.concat(departments2)

						regions2 = regions.map( terrytoryMaping )
						objects = objects.concat(regions2)

					}
				// }
			// }

			this.responseText = {
				status: true,
				detalleRecursos: objects
			}
		}
	})

	$.mockjax({
		url: urls.consolidated,
		// responseTime: responseDuration,
		response: function () {
			var projectsPerSector = [
					{'label':'Agropecuario','value':'7%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Minero','value':'2%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Tecnología','value':'0%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Agropecuario','value':'5%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Minero','value':'4%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Tecnología','value':'0%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Agropecuario','value':'7%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Minero','value':'4%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Tecnología','value':'8%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Agropecuario','value':'6%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Minero','value':'6%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Tecnología','value':'3%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Agropecuario','value':'3%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Minero','value':'2%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Tecnología','value':'1%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Agropecuario','value':'5%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Minero','value':'7%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Tecnología','value':'6%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Agropecuario','value':'0%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Minero','value':'0%','rawValue':Math.round(Math.random()*99999)},
					{'label':'Tecnología','value':'4%','rawValue':Math.round(Math.random()*99999)}
				],
				total = 0

			for(var i=0; i<projectsPerSector.length; i++){
				total += projectsPerSector[i].rawValue
			}
			for(i=0; i<projectsPerSector.length; i++){
				projectsPerSector[i].value  = Math.round(projectsPerSector[i].rawValue/total*100) + '%'
			}

			var resourcesPerSector = [
					{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Agropecuario', 'value': '5%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*99999999)},
					{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*99999999)}
				]
			
			total = 0

			for(i=0; i<resourcesPerSector.length; i++){
				total += resourcesPerSector[i].rawValue
			}
			for(i=0; i<resourcesPerSector.length; i++){
				resourcesPerSector[i].value  = Math.round(resourcesPerSector[i].rawValue/total*100) + '%'
			}

			var resourcesPerRegion = [
				{'label':'Amazonas', 'value': '10%', 'rawValue': Math.round(Math.random()*999999999)},
				{'label':'Pacífico', 'value': '5%', 'rawValue': Math.round(Math.random()*999999999)},
				{'label':'Occidental', 'value': '16%', 'rawValue': Math.round(Math.random()*999999999)},
				{'label':'Oriental', 'value': '14%', 'rawValue': Math.round(Math.random()*999999999)},
				{'label':'Caribe', 'value': '25%', 'rawValue': Math.round(Math.random()*999999999)},
				{'label':'Andina', 'value': '35%', 'rawValue': Math.round(Math.random()*999999999)}
			]

			total = 0

			for(i=0; i<resourcesPerRegion.length; i++){
				total += resourcesPerRegion[i].rawValue
			}
			for(i=0; i<resourcesPerRegion.length; i++){
				resourcesPerRegion[i].value  = Math.round(resourcesPerRegion[i].rawValue/total*100) + '%'
			}

			var resourcesPerDepartment = [
				{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'San Andrés y Providencia', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '5%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '10%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Agropecuario', 'value': '5%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Minero', 'value': '2%', 'rawValue': Math.round(Math.random()*9999999)},
				{'label':'Tecnología', 'value': '3%', 'rawValue': Math.round(Math.random()*9999999)}
			]
			total = 0
			for(i=0; i<resourcesPerDepartment.length; i++){
				total += resourcesPerDepartment[i].rawValue
			}
			for(i=0; i<resourcesPerDepartment.length; i++){
				resourcesPerDepartment[i].value  = Math.round(resourcesPerDepartment[i].rawValue/total*100) + '%'
			}

			this.responseText = {
				'status': true,
				'projectsPerSector': projectsPerSector,
				'resourcesPerSector': resourcesPerSector,
				'facts': [
				],
				'resourcesPerRegion': resourcesPerRegion,
				'resourcesPerDepartment': resourcesPerDepartment
			}

			this.responseText = {
				'projectsPerSector':[
					{'label':'Agricultura - Adquisición y Adjudicación de Tierras','value':'0,80%','rawValue':5.0},
					{'label':'Agricultura - Asistencia Técnica','value':'0,16%','rawValue':1.0},
					{'label':'Agricultura - Proyectos de Desarrollo Rural','value':'0,32%','rawValue':2.0},
					{'label':'Ciencia y Tecnología - Innovación','value':'0,16%','rawValue':1.0},
					{'label':'Ciencia y Tecnología - Investigación y Desarrollo','value':'0,48%','rawValue':3.0},
					{'label':'Comercio, Industria y Turismo - Fondos de capital emprendedores','value':'0,16%','rawValue':1.0},
					{'label':'Cultura - Formación artística y creación cultural','value':'0,16%','rawValue':1.0},
					{'label':'Cultura - Lectura y escritura','value':'0,16%','rawValue':1.0},
					{'label':'Deporte  - Fomento a la recreación, actividad fisica y deporte','value':'0,32%','rawValue':2.0},
					{'label':'Deporte  - Infraestructura deportiva','value':'0,16%','rawValue':1.0},
					{'label':'Desarrollo Social - Familia, primera infancia, niñez, adolescencia','value':'0,32%','rawValue':2.0},
					{'label':'Desarrollo Social - Infraestructura social y comunitaria','value':'0,16%','rawValue':1.0},
					{'label':'Educación - Formación para el trabajo y el desarrollo humano','value':'0,16%','rawValue':1.0},
					{'label':'Educación - Preescolar y Básica y Media','value':'1,28%','rawValue':8.0},
					{'label':'Medio Ambiente y Riesgo  - Control de la contaminación y manejo de residuos','value':'0,32%','rawValue':2.0},
					{'label':'Medio Ambiente y Riesgo  - Prevención y adaptación al cambio climático','value':'0,16%','rawValue':1.0},
					{'label':'Minas y Energía - Minería - Apoyo a pequeña minería','value':'0,16%','rawValue':1.0},
					{'label':'Planificación','value':'0,16%','rawValue':1.0},
					{'label':'Transporte - Red urbana','value':'0,64%','rawValue':4.0},
					{'label':'Transporte - Vial Red Secundaria','value':'0,16%','rawValue':1.0},
					{'label':'Transporte - Vial Red Terciaria','value':'0,80%','rawValue':5.0},
					{'label':'Vivienda y Desarrollo Urbano - Agua potable y saneamiento básico','value':'0,80%','rawValue':5.0},
					{'label':'Vivienda y Desarrollo Urbano - Vivienda rural','value':'0,48%','rawValue':3.0},
					{'label':'Vivienda y Desarrollo Urbano - Vivienda urbana','value':'1,44%','rawValue':9.0}
				],
				'resourcesPerSector':
				[
					{'label':'Agricultura - Adquisición y Adjudicación de Tierras','value':'0,06%','rawValue':3190682199.0},
					{'label':'Agricultura - Asistencia Técnica','value':'0,00%','rawValue':0.0},
					{'label':'Agricultura - Proyectos de Desarrollo Rural','value':'0,01%','rawValue':606008580.0},
					{'label':'Ciencia y Tecnología - Innovación','value':'0,25%','rawValue':12520765607.0},
					{'label':'Ciencia y Tecnología - Investigación y Desarrollo','value':'0,11%','rawValue':5477524544.0},
					{'label':'Comercio, Industria y Turismo - Fondo del Turismo','value':'0,00%','rawValue':100000000.0},
					{'label':'Comercio, Industria y Turismo - Fondos de capital emprendedores','value':'0,00%','rawValue':4800000.0},
					{'label':'Cultura - Formación artística y creación cultural','value':'0,00%','rawValue':17580000.0},
					{'label':'Cultura - Lectura y escritura','value':'0,02%','rawValue':920000000.0},
					{'label':'Deporte  - Fomento a la recreación, actividad fisica y deporte','value':'0,01%','rawValue':550153319.0},
					{'label':'Deporte  - Infraestructura deportiva','value':'0,04%','rawValue':2189914231.0},
					{'label':'Desarrollo Social - Familia, primera infancia, niñez, adolescencia','value':'0,41%','rawValue':20547051285.0},
					{'label':'Desarrollo Social - Infraestructura social y comunitaria','value':'0,00%','rawValue':129250507.0},
					{'label':'Desarrollo Social - población vulnerable y excluída','value':'0,21%','rawValue':10742849797.0},
					{'label':'Educación - Formación para el trabajo y el desarrollo humano','value':'0,00%','rawValue':50000000.0},
					{'label':'Educación - Preescolar y Básica y Media','value':'1,25%','rawValue':63355089767.0},
					{'label':'Medio Ambiente y Riesgo  - Control de la contaminación y manejo de residuos','value':'0,08%','rawValue':4092116449.0},
					{'label':'Medio Ambiente y Riesgo  - Prevención y adaptación al cambio climático','value':'0,40%','rawValue':20180076750.0},
					{'label':'Minas y Energía - Energía Eléctrica - Distribución (< 220 KV)','value':'0,01%','rawValue':454216047.0},
					{'label':'Minas y Energía - Minería - Apoyo a pequeña minería','value':'0,01%','rawValue':479257074.0},
					{'label':'Planificación','value':'0,01%','rawValue':325606101.0},
					{'label':'Salud -  Prestación de servicios de salud','value':'0,01%','rawValue':300000000.0},
					{'label':'Salud - Régimen subsidiado','value':'0,20%','rawValue':10126214871.0},
					{'label':'Transporte - Red urbana ','value':'0,18%','rawValue':8990706841.0},
					{'label':'Transporte - Vial Red Primaria','value':'0,03%','rawValue':1618285590.0},
					{'label':'Transporte - Vial Red Secundaria','value':'0,05%','rawValue':2503993610.0},
					{'label':'Transporte - Vial Red Terciaria','value':'0,04%','rawValue':2145223145.0},
					{'label':'Vivienda y Desarrollo Urbano - Agua potable y saneamiento básico','value':'0,09%','rawValue':4339425960.0},
					{'label':'Vivienda y Desarrollo Urbano - Vivienda rural','value':'0,13%','rawValue':6800594696.0},
					{'label':'Vivienda y Desarrollo Urbano - Vivienda urbana','value':'1,24%','rawValue':62435172021.0}
				],
				'facts':
				[
					{'phrase':'Vivienda y Desarrollo Urbano - Vivienda urbanaVivienda y Desarrollo Urbano - Vivienda urbana','icon':'/content/img/example/fact1.png','title':null},
					{'phrase':'Vivienda y Desarrollo Urbano - Vivienda urbanaVivienda y Desarrollo Urbano - Vivienda urbana','icon':'/content/img/example/fact1.png','title':null},
					{'phrase':'HoVivienda y Desarrollo Urbano - Vivienda urbanaVivienda y Desarrollo Urbano - Vivienda urbanala','icon':'/content/img/example/fact1.png','title':null}
				],
				'resourcesPerRegion':
				[
					{'label':'Region 1','value':'53,22%','rawValue':3285384699858.0},
					{'label':'Region 2','value':'46,78%','rawValue':2887505446147.0}
				],
				'resourcesPerDepartment':
				[
					{'label':'Bogotá, D.C.','value':'1,01%','rawValue':50821498398.0},
					{'label':'Cauca','value':'4.817,06%','rawValue':243223802672955.0},
					{'label':'Tolima','value':'752,04%','rawValue':37971942565059.0},
					{'label':'Valle del Cauca','value':'896,98%','rawValue':45290438140438.0},
					{'label':'Risaralda','value':'127,47%','rawValue':6436015911360.0},
					{'label':'Meta','value':'1.377,02%','rawValue':69528613605000.0},
					{'label':'Santander','value':'3.744,38%','rawValue':189061632545896.0},
					{'label':'Antioquia','value':'1.560,11%','rawValue':78773393709000.0},
					{'label':'Caquetá','value':'313,17%','rawValue':15812594625984.0},
					{'label':'Casanare','value':'1.695,22%','rawValue':85595120236900.0},
					{'label':'Nariño','value':'1.610,10%','rawValue':81297622750680.0},
					{'label':'Atlántico','value':'140,81%','rawValue':7109674521504.0},
					{'label':'Sucre','value':'557,69%','rawValue':28158831594175.0},
					{'label':'Cundinamarca','value':'6.519,15%','rawValue':329165894136260.0},
					{'label':'Córdoba','value':'290,68%','rawValue':14676994336167.0},
					{'label':'Putumayo','value':'123,69%','rawValue':6245301379837.0},
					{'label':'Boyacá','value':'4.909,51%','rawValue':247891386110960.0},
					{'label':'Caldas','value':'1.054,99%','rawValue':53268719443420.0},
					{'label':'Magdalena','value':'301,76%','rawValue':15236316673620.0},
					{'label':'Guaviare','value':'26,74%','rawValue':1350077666530.0},
					{'label':'La Guajira','value':'384,70%','rawValue':19424516957395.0},
					{'label':'Vichada','value':'12,59%','rawValue':635586060860.0},
					{'label':'Norte de Santander','value':'1.572,99%','rawValue':79423408913893.0},
					{'label':'Amazonas','value':'34,60%','rawValue':1746903211083.0},
					{'label':'Arauca','value':'32,14%','rawValue':1622582018880.0},
					{'label':'Cesar','value':'203,15%','rawValue':10257247388925.0},
					{'label':'Bolívar','value':'129,44%','rawValue':6535742383776.0},
					{'label':'Huila','value':'1.919,97%','rawValue':96943368656302.0},
					{'label':'Guainía','value':'55,98%','rawValue':2826474595352.0},
					{'label':'San Andrés y Providencia','value':'2,20%','rawValue':110862649620.0},
					{'label':'Chocó','value':'61,08%','rawValue':3084090682266.0},
					{'label':'Vaupés','value':'2,53%','rawValue':127579857237.0},
					{'label':'Quindío','value':'9,08%','rawValue':458319057430.0}
				],
				'status':true,
				'message':null
			}
		}
	})

	$.mockjax({
		url: urls.consolidatedResources,
		// responseTime: responseDuration,
		response: function () {
			if( Math.random() < 0.5 ){
				this.responseText = {
					"graficasConsolidadas": [
						{
							"Nombre": "Presupuesto",
							"ItemsGrafica": []
						},
						{
							"Nombre": "RecursosAprobadosXRegion",
							"ItemsGrafica": []
						},
						{
							"Nombre": "RecursosAprobadosXDepartamento",
							"ItemsGrafica": []
						}
					],
					"status": true,
					"message": null
				}
			}else{
				this.responseText = {
					"graficasConsolidadas": [
						{
							"Nombre": "Presupuesto",
							"ItemsGrafica": [
								{
									"Valor": 1282975640372,
									"Label": "Asignaciones Directas",
									"LabelExtendido": null,
									"Porcentaje": 51.895393,
									"Items": null
								},
								{
									"Valor": 1158307177241,
									"Label": "Fondo  de compensación regional",
									"LabelExtendido": null,
									"Porcentaje": 46.852648,
									"Items": null
								},
								{
									"Valor": 16265747761,
									"Label": "Fondo  de desarrollo regional",
									"LabelExtendido": null,
									"Porcentaje": 0.657937,
									"Items": null
								},
								{
									"Valor": 13941606259,
									"Label": "Fondo de ciencia, tecnología e innovación",
									"LabelExtendido": null,
									"Porcentaje": 0.563927,
									"Items": null
								},
								{
									"Valor": 743978756,
									"Label": "Nación",
									"LabelExtendido": null,
									"Porcentaje": 0.030093,
									"Items": null
								}
							]
						},
						{
							"Nombre": "RecursosAprobadosXRegion",
							"ItemsGrafica": [
								{
									"Valor": 257588988649,
									"Label": "REGION CARIBE",
									"LabelExtendido": null,
									"Porcentaje": 27.51,
									"Items": [
										{
											"Valor": 77401701592,
											"Label": "REGION CARIBE",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								},
								{
									"Valor": 83767777310,
									"Label": "REGION CENTRO ORIENTE",
									"LabelExtendido": null,
									"Porcentaje": 8.95,
									"Items": [
										null
									]
								},
								{
									"Valor": 94593999116,
									"Label": "REGION CENTRO SUR AMAZONIA",
									"LabelExtendido": null,
									"Porcentaje": 10.1,
									"Items": [
										null
									]
								},
								{
									"Valor": 28013197672,
									"Label": "REGION DEL LLANO",
									"LabelExtendido": null,
									"Porcentaje": 2.99,
									"Items": [
										null
									]
								},
								{
									"Valor": 408655497649,
									"Label": "REGION EJE CAFETERO",
									"LabelExtendido": null,
									"Porcentaje": 43.65,
									"Items": [
										null
									]
								},
								{
									"Valor": 63633425775,
									"Label": "REGION PACIFICO",
									"LabelExtendido": null,
									"Porcentaje": 6.8,
									"Items": [
										{
											"Valor": 7000000000,
											"Label": "REGION PACIFICO",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								}
							]
						},
						{
							"Nombre": "RecursosAprobadosXDepartamento",
							"ItemsGrafica": [
								{
									"Valor": 835639000,
									"Label": "AMAZONAS",
									"LabelExtendido": null,
									"Porcentaje": 0.26,
									"Items": [
										null
									]
								},
								{
									"Valor": 103811224298,
									"Label": "ANTIOQUIA",
									"LabelExtendido": null,
									"Porcentaje": 32.71,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "ARAUCA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 9367364660,
									"Label": "ATLANTICO",
									"LabelExtendido": null,
									"Porcentaje": 2.95,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "BOGOTA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 8638674998,
									"Label": "BOLIVAR",
									"LabelExtendido": null,
									"Porcentaje": 2.72,
									"Items": [
										{
											"Valor": 22712653327,
											"Label": "BOLIVAR",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								},
								{
									"Valor": null,
									"Label": "BOYACA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 20994031616,
									"Label": "CALDAS",
									"LabelExtendido": null,
									"Porcentaje": 6.61,
									"Items": [
										null
									]
								},
								{
									"Valor": 2538140050,
									"Label": "CAQUETA",
									"LabelExtendido": null,
									"Porcentaje": 0.8,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "CASANARE",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "CAUCA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "CESAR",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 1827740000,
									"Label": "CHOCO",
									"LabelExtendido": null,
									"Porcentaje": 0.58,
									"Items": [
										null
									]
								},
								{
									"Valor": 31160944331,
									"Label": "CORDOBA",
									"LabelExtendido": null,
									"Porcentaje": 9.82,
									"Items": [
										null
									]
								},
								{
									"Valor": 51240205060,
									"Label": "CUNDINAMARCA",
									"LabelExtendido": null,
									"Porcentaje": 16.14,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "GUAINIA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "GUAVIARE",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 27294800595,
									"Label": "HUILA",
									"LabelExtendido": null,
									"Porcentaje": 8.6,
									"Items": [
										null
									]
								},
								{
									"Valor": 14600472578,
									"Label": "LA GUAJIRA",
									"LabelExtendido": null,
									"Porcentaje": 4.6,
									"Items": [
										{
											"Valor": 54689048265,
											"Label": "LA GUAJIRA",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								},
								{
									"Valor": null,
									"Label": "MAGDALENA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "META",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 777285000,
									"Label": "NARIÑO",
									"LabelExtendido": null,
									"Porcentaje": 0.24,
									"Items": [
										{
											"Valor": 7000000000,
											"Label": "NARIÑO",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								},
								{
									"Valor": null,
									"Label": "NORTE DE SANTANDER",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "PUTUMAYO",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "QUINDIO",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 11830894643,
									"Label": "RISARALDA",
									"LabelExtendido": null,
									"Porcentaje": 3.73,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "SAN ANDRES",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 4999969283,
									"Label": "SANTANDER",
									"LabelExtendido": null,
									"Porcentaje": 1.58,
									"Items": [
										null
									]
								},
								{
									"Valor": 8638674998,
									"Label": "SUCRE",
									"LabelExtendido": null,
									"Porcentaje": 2.72,
									"Items": [
										null
									]
								},
								{
									"Valor": 15800894003,
									"Label": "TOLIMA",
									"LabelExtendido": null,
									"Porcentaje": 4.98,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "VALLE",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 2004844747,
									"Label": "VAUPES",
									"LabelExtendido": null,
									"Porcentaje": 0.63,
									"Items": [
										null
									]
								},
								{
									"Valor": 1030000000,
									"Label": "VICHADA",
									"LabelExtendido": null,
									"Porcentaje": 0.32,
									"Items": [
										null
									]
								}
							]
						}
					],
					"status": true,
					"message": null
				}
			}
		}
	})

	$.mockjax({
		url: urls.consolidatedProduction,
		// responseTime: responseDuration,
		response: function () {
			if( Math.random() < 0.5 ){
				this.responseText = {
					"graficasConsolidadas": [
						{
							"Nombre": "Presupuesto",
							"ItemsGrafica": []
						},
						{
							"Nombre": "RecursosAprobadosXRegion",
							"ItemsGrafica": []
						},
						{
							"Nombre": "RecursosAprobadosXDepartamento",
							"ItemsGrafica": []
						}
					],
					"status": true,
					"message": null
				}
			}else{
				this.responseText = {
					"graficasConsolidadas": [
						{
							"Nombre": "Presupuesto",
							"ItemsGrafica": [
								{
									"Valor": 1282975640372,
									"Label": "Asignaciones Directas",
									"LabelExtendido": null,
									"Porcentaje": 51.895393,
									"Items": null
								},
								{
									"Valor": 1158307177241,
									"Label": "Fondo  de compensación regional",
									"LabelExtendido": null,
									"Porcentaje": 46.852648,
									"Items": null
								},
								{
									"Valor": 16265747761,
									"Label": "Fondo  de desarrollo regional",
									"LabelExtendido": null,
									"Porcentaje": 0.657937,
									"Items": null
								},
								{
									"Valor": 13941606259,
									"Label": "Fondo de ciencia, tecnología e innovación",
									"LabelExtendido": null,
									"Porcentaje": 0.563927,
									"Items": null
								},
								{
									"Valor": 743978756,
									"Label": "Nación",
									"LabelExtendido": null,
									"Porcentaje": 0.030093,
									"Items": null
								}
							]
						},
						{
							"Nombre": "RecursosAprobadosXRegion",
							"ItemsGrafica": [
								{
									"Valor": 257588988649,
									"Label": "REGION CARIBE",
									"LabelExtendido": null,
									"Porcentaje": 27.51,
									"Items": [
										{
											"Valor": 77401701592,
											"Label": "REGION CARIBE",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								},
								{
									"Valor": 83767777310,
									"Label": "REGION CENTRO ORIENTE",
									"LabelExtendido": null,
									"Porcentaje": 8.95,
									"Items": [
										null
									]
								},
								{
									"Valor": 94593999116,
									"Label": "REGION CENTRO SUR AMAZONIA",
									"LabelExtendido": null,
									"Porcentaje": 10.1,
									"Items": [
										null
									]
								},
								{
									"Valor": 28013197672,
									"Label": "REGION DEL LLANO",
									"LabelExtendido": null,
									"Porcentaje": 2.99,
									"Items": [
										null
									]
								},
								{
									"Valor": 408655497649,
									"Label": "REGION EJE CAFETERO",
									"LabelExtendido": null,
									"Porcentaje": 43.65,
									"Items": [
										null
									]
								},
								{
									"Valor": 63633425775,
									"Label": "REGION PACIFICO",
									"LabelExtendido": null,
									"Porcentaje": 6.8,
									"Items": [
										{
											"Valor": 7000000000,
											"Label": "REGION PACIFICO",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								}
							]
						},
						{
							"Nombre": "RecursosAprobadosXDepartamento",
							"ItemsGrafica": [
								{
									"Valor": 835639000,
									"Label": "AMAZONAS",
									"LabelExtendido": null,
									"Porcentaje": 0.26,
									"Items": [
										null
									]
								},
								{
									"Valor": 103811224298,
									"Label": "ANTIOQUIA",
									"LabelExtendido": null,
									"Porcentaje": 32.71,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "ARAUCA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 9367364660,
									"Label": "ATLANTICO",
									"LabelExtendido": null,
									"Porcentaje": 2.95,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "BOGOTA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 8638674998,
									"Label": "BOLIVAR",
									"LabelExtendido": null,
									"Porcentaje": 2.72,
									"Items": [
										{
											"Valor": 22712653327,
											"Label": "BOLIVAR",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								},
								{
									"Valor": null,
									"Label": "BOYACA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 20994031616,
									"Label": "CALDAS",
									"LabelExtendido": null,
									"Porcentaje": 6.61,
									"Items": [
										null
									]
								},
								{
									"Valor": 2538140050,
									"Label": "CAQUETA",
									"LabelExtendido": null,
									"Porcentaje": 0.8,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "CASANARE",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "CAUCA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "CESAR",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 1827740000,
									"Label": "CHOCO",
									"LabelExtendido": null,
									"Porcentaje": 0.58,
									"Items": [
										null
									]
								},
								{
									"Valor": 31160944331,
									"Label": "CORDOBA",
									"LabelExtendido": null,
									"Porcentaje": 9.82,
									"Items": [
										null
									]
								},
								{
									"Valor": 51240205060,
									"Label": "CUNDINAMARCA",
									"LabelExtendido": null,
									"Porcentaje": 16.14,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "GUAINIA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "GUAVIARE",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 27294800595,
									"Label": "HUILA",
									"LabelExtendido": null,
									"Porcentaje": 8.6,
									"Items": [
										null
									]
								},
								{
									"Valor": 14600472578,
									"Label": "LA GUAJIRA",
									"LabelExtendido": null,
									"Porcentaje": 4.6,
									"Items": [
										{
											"Valor": 54689048265,
											"Label": "LA GUAJIRA",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								},
								{
									"Valor": null,
									"Label": "MAGDALENA",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "META",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 777285000,
									"Label": "NARIÑO",
									"LabelExtendido": null,
									"Porcentaje": 0.24,
									"Items": [
										{
											"Valor": 7000000000,
											"Label": "NARIÑO",
											"LabelExtendido": null,
											"Porcentaje": null,
											"Items": null
										}
									]
								},
								{
									"Valor": null,
									"Label": "NORTE DE SANTANDER",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "PUTUMAYO",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "QUINDIO",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 11830894643,
									"Label": "RISARALDA",
									"LabelExtendido": null,
									"Porcentaje": 3.73,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "SAN ANDRES",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 4999969283,
									"Label": "SANTANDER",
									"LabelExtendido": null,
									"Porcentaje": 1.58,
									"Items": [
										null
									]
								},
								{
									"Valor": 8638674998,
									"Label": "SUCRE",
									"LabelExtendido": null,
									"Porcentaje": 2.72,
									"Items": [
										null
									]
								},
								{
									"Valor": 15800894003,
									"Label": "TOLIMA",
									"LabelExtendido": null,
									"Porcentaje": 4.98,
									"Items": [
										null
									]
								},
								{
									"Valor": null,
									"Label": "VALLE",
									"LabelExtendido": null,
									"Porcentaje": null,
									"Items": [
										null
									]
								},
								{
									"Valor": 2004844747,
									"Label": "VAUPES",
									"LabelExtendido": null,
									"Porcentaje": 0.63,
									"Items": [
										null
									]
								},
								{
									"Valor": 1030000000,
									"Label": "VICHADA",
									"LabelExtendido": null,
									"Porcentaje": 0.32,
									"Items": [
										null
									]
								}
							]
						}
					],
					"status": true,
					"message": null
				}
			}
		}
	})

	
	$.mockjax({
		url: urls.searchProjectsList,
		// responseTime: responseDuration,
		response: function ( params ) {
			var objects = [], length = 8,
				page = ( params.data.match(/page=(\d+)/) || [] )[1] || 1,
				total = Math.round(1+50*Math.random())
			
			total = total < page ? + page + 2 : length

			// if( Math.random() > 0.5 )
			for(var i=0; i<length; i++){
				objects.push({
						'name': 'Desarrollo carretera Via Bogota-Cali'+i,
						'value': Math.round(5400000099*Math.random()),
						'state': Math.random() > 0.5 ? 'Aprobado' : 'Rechazado',
						'Ejecutor': 'Departamental '+i,
						'url': 'templates/projects.html',
						'latitude': 4.667292,
						'longitude': -74.059508,
						'location': 'Cajicá, Cundinamarca',
						'image': 'http://www.escapefromamerica.com/wp-content/uploads/2012/07/7_colombiamining.jpg'
					})
			}

			this.responseText = {
				'status': true,
				'totalNumber': Math.round(900*Math.random()),
				'totalPages': 30,
				'pageNumber': page,
				'objects': objects
			}
		}
	})

	
	$.mockjax({
		url: urls.texts,
		responseTime: 2000,
		response: function ( params ) {
			var dictionary = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus velit consequuntur porro deleniti ullam nam aliquid eligendi voluptatem mollitia quo quae eius magni molestias modi ut esse ipsum vitae possimus'.split(' '),
				times = ~~( Math.random() * 50 ),
				text = ''
			for(var i = 0; i<times; i++){
				text += dictionary[ i % dictionary.length ] + ' '
			}
			this.responseText = {
				TextoParametrico: text,
				status: true
			}
		}
	})

	$.mockjax({
		url: urls.getBudget,
		responseTime: 1000,
		response: function( params ) {
			var detalleMes = cachedDetailMonth,
			allFuentes = [
				'Fondo de ciencia, tecnología e innovación',
				'Asignaciones Directas',
				'Propios',
				'Fondo  de compensación regional',
				'Nación',
				'Fondo  de desarrollo regional'
			],
			tempDetalle = []

			for(var i=0; i<allFuentes.length; i++){
				tempDetalle[i]={
					Fuente: allFuentes[i],
					DetallePorMes: detalleMes.slice(),
					ValorTotalPorFuente: Math.round(Math.random() * 999999999)
				}
			}

			// if( Math.random() > 0.7 ) tempDetalle = []
			// if( Math.random() > 0.5 ) tempDetalle = null

			this.responseText = {
				status: true,
				message: '',
				latitud: 4.667292,
				longitud: -74.059508,
				ResumenRecursos: [{
					Periodo: '2012',
					ValorTotalPeriodo: 8987876876542299,
					DetallePorFuente: tempDetalle
				}]
			}
		}
	})

	$.mockjax({
		url: urls.getDistribution,
		responseTime: 1000,
		response: function( params ){
		var detalleMes = cachedDetailMonth,
			allFuentes = [
				"Fondo de ciencia, tecnología e innovación",
				"Asignaciones Directas",
				"Propios",
				"Fondo  de compensación regional",
				"Nación",
				"Fondo  de desarrollo regional"
			],
			tempDetalle = []

			for(var i=0; i<allFuentes.length; i++){
				tempDetalle[i]={
					Fuente: allFuentes[i],
					DetallePorMes: detalleMes.slice(),
					ValorTotalPorFuente: Math.round(Math.random() * 999999999)
				}
			}

			// if( Math.random() > 0.7 ) tempDetalle = []
			// if( Math.random() > 0.5 ) tempDetalle = null
				
			this.responseText ={
				status: true,
				message: '',
				latitud: 4.667292,
				longitud: -74.059508,
				ResumenRecursos: [{
					periodo: '2012',
					ValorTotalPeriodo: Math.round(Math.random() * 999999999),
					DetallePorFuente: tempDetalle
				}]
			}
		}
	})
	
	$.mockjax({
		url: urls.getOutlay,
		responseTime: 1000,
		response: function(params){
			var detalleMes = cachedDetailMonth,
			allFuentes = [
				"Fondo de ciencia, tecnología e innovación",
				"Asignaciones Directas",
				"Propios",
				"Fondo  de compensación regional",
				"Nación",
				"Fondo  de desarrollo regional"
			],
			tempDetalle = []

			for(var i=0; i<allFuentes.length; i++){
				tempDetalle[i]={
					Fuente: allFuentes[i],
					DetallePorMes: detalleMes.slice(),
					ValorTotalPorFuente: Math.round(Math.random() * 999999999)
				}
			}

			// if( Math.random() > 0.7 ) tempDetalle = []
			// if( Math.random() > 0.5 ) tempDetalle = null
				
			this.responseText ={
				status: true,
				message: '',
				latitud: 4.667292,
				longitud: -74.059508,
				ResumenRecursos: [{
					periodo: '2012',
					ValorTotalPeriodo: Math.round(Math.random() * 999999999),
					DetallePorFuente: tempDetalle
				}]
			}
		}
	})

	$.mockjax({
		url: urls.getAprovedProyects,
		responseTime: 1000,
		response: function(params){
			console.log(params.data)
			var pagina = params.data.match(/pagina=(\d+)/),
				isList = params.data.match(/query=Todos/) || pagina
			this.responseText ={
				status: true,
				message: '',
				Proyectos: [
					{
						Id: '001',
						URLFicha: 'http://monoku.com',
						Nombre: 'Nombre del proyecto como se llame va acá',
						Region: 'Cundinamarca, Bogotá',
						Departamento: 'Cunadunamarca',
						Municipio: 'Bogotá',
						Estado: 'Aprovado',
						Valor: Math.round(Math.random() * 9999999999)
					},
					{
						Id: '002',
						URLFicha: 'http://monoku.com',
						Nombre: 'Nombre del proyecto como se llame va acá',
						Region: 'Cundinamarca, Bogotá',
						Departamento: 'Cunadunamarca',
						Municipio: 'Bogotá',
						Estado: 'Aprovado',
						Valor: Math.round(Math.random() * 9999999999)
					},
					{
						Id: '003',
						URLFicha: 'http://monoku.com',
						Nombre: 'Nombre del proyecto como se llame va acá',
						Region: 'Cundinamarca, Bogotá',
						Departamento: 'Cunadunamarca',
						Municipio: 'Bogotá',
						Estado: 'Aprovado',
						Valor: Math.round(Math.random() * 9999999999)
					},
					{
						Id: '004',
						URLFicha: 'http://monoku.com',
						Nombre: 'Nombre del proyecto como se llame va acá',
						Region: 'Cundinamarca, Bogotá',
						Departamento: 'Cunadunamarca',
						Municipio: 'Bogotá',
						Estado: 'Aprovado',
						Valor: Math.round(Math.random() * 9999999999)
					}
				]
			}
			if( isList ){
				pagina = pagina ? pagina[1] : 1
				this.responseText.TotalProyectos = 140
				this.responseText.TotalPagina = 14
				this.responseText.NumeroPagina = pagina
				this.responseText.status = true
				this.responseText.message = null			
			}
		}	
	})

	$.mockjax({
		url: urls.getValueAproved,
		responseTime: 1000,
		response: function(params){
			var allFuentes = [
				"Fondo de ciencia, tecnología e innovación",
				"Asignaciones Directas",
				"Propios",
				"Fondo  de compensación regional",
				"Nación",
				"Fondo  de desarrollo regional"
			],
			tempDetalle = []

			for(var i=0; i<allFuentes.length; i++){
				tempDetalle[i]={
					Fuente: allFuentes[i],
					ValorTotalPorFuente: Math.round(Math.random() * 999999999),
					URLProyectos: '/api/Proyectos/GetOtrosProyectosAprobados?periodosRecursos=2012&fuentes=2874&departamento=05&query=Aprobados'
				}

			}
			this.responseText = {
				status: true,
				message: '',
				ResumenRecursos: [{
					periodo: '2012',
					ValorTotalPeriodo: 898787687654555,
					DetallePorFuente: tempDetalle
				}]
			}
		}	
	})

	$.mockjax({
		url: urls.getExecuted,
		responseTime: 1000,
		response: function(params){
			var detalleMes = cachedDetailMonth,
			allFuentes = [
				"Fondo de ciencia, tecnología e innovación",
				"Asignaciones Directas",
				"Propios",
				"Fondo  de compensación regional",
				"Nación",
				"Fondo  de desarrollo regional"
			],
			tempDetalle = []

			for(var i=0; i<allFuentes.length; i++){
				tempDetalle[i]={
					Fuente: allFuentes[i],
					DetallePorMes: detalleMes.slice(),
					ValorTotalPorFuente: Math.round(Math.random() * 999999999),
					URLProyectos: '/api/Proyectos/GetOtrosProyectosAprobados?periodosRecursos=2012&fuentes=2874&departamento=05&query=Aprobados'
				}
			}

			// if( Math.random() > 0.7 ) tempDetalle = []
			// if( Math.random() > 0.5 ) tempDetalle = null
				
			this.responseText ={
				status: true,
				message: '',
				latitud: 4.667292,
				longitud: -74.059508,
				ResumenRecursos: [{
					periodo: '2012',
					ValorTotalPeriodo: Math.round(Math.random() * 999999999),
					DetallePorFuente: tempDetalle
				}]
			}
		}
	})

	$.mockjax({
		url: urls.getRegalias,
		responseTime: 1000,
		response: function(params){
			var detalleMes = cachedDetailMonth,
			allFuentes = [
				"Fondo de ciencia, tecnología e innovación",
				"Asignaciones Directas",
				"Propios",
				"Fondo  de compensación regional",
				"Nación",
				"Fondo  de desarrollo regional"
			],
			tempDetalle = []

			for(var i=0; i<allFuentes.length; i++){
				tempDetalle[i]={
					Fuente: allFuentes[i],
					DetallePorMes: detalleMes.slice(),
					ValorTotalPorFuente: Math.round(Math.random() * 999999999)
				}
			}

			// if( Math.random() > 0.7 ) tempDetalle = []
			// if( Math.random() > 0.5 ) tempDetalle = null
				
			this.responseText = {"ResumenLiquidacion":[{"Periodo":"2012","ValorTotalPeriodo":2522614.00000000,"DetallePorMes":[{"Mes":"Enero","ValorTotalPorMes":0.0},{"Mes":"Febrero","ValorTotalPorMes":0.0},{"Mes":"Marzo","ValorTotalPorMes":0.0},{"Mes":"Abril","ValorTotalPorMes":0.0},{"Mes":"Mayo","ValorTotalPorMes":0.0},{"Mes":"Junio","ValorTotalPorMes":0.0},{"Mes":"Julio","ValorTotalPorMes":0.0},{"Mes":"Agosto","ValorTotalPorMes":0.0},{"Mes":"Septiembre","ValorTotalPorMes":0.0},{"Mes":"Octubre","ValorTotalPorMes":0.0},{"Mes":"Noviembre","ValorTotalPorMes":0.0},{"Mes":"Diciembre","ValorTotalPorMes":2522614.00000000}]}],"status":true,"message":null}
		}
	})

	$.mockjax({
		url: urls.getPerformance,
		responseTime: 1000,
		response: function( params ) {
			var detalleMes = cachedDetailMonth,
			allFuentes = [
				'Fondo de ciencia, tecnología e innovación',
				'Asignaciones Directas',
				'Propios',
				'Fondo  de compensación regional',
				'Nación',
				'Fondo  de desarrollo regional'
			],
			tempDetalle = []

			for(var i=0; i<allFuentes.length; i++){
				tempDetalle[i]={
					Fuente: allFuentes[i],
					DetallePorMes: detalleMes.slice(),
					ValorTotalPorFuente: Math.round(Math.random() * 999999999)
				}
			}

			// if( Math.random() > 0.7 ) tempDetalle = []
			// if( Math.random() > 0.5 ) tempDetalle = null

			this.responseText = {
				status: true,
				message: '',
				latitud: 4.667292,
				longitud: -74.059508,
				ResumenRecursos: [{
					Periodo: '2012',
					ValorTotalPeriodo: 8987876876542299,
					DetallePorFuente: tempDetalle
				}]
			}
		}
	})

	//---------------------------------
	// PRODUCTION QUERIES
	//---------------------------------
	$.mockjax({
		url: urls.infoboxesProduction,
		// responseTime: responseDuration,
		response: function(params){
			params.data = params.data || 'zoom=6&topLeft=11.726509410167694,-91.7140625&bottomRight=-5.5404989748491715,-60.0734375'
			var nw = params.data.match(/topLeft=([\d\.\-\,]+)/)[1].split(','),
				se = params.data.match(/bottomRight=([\d\.\-\,]+)/)[1].split(','),
				width = + se[0] - nw [0],
				height = + se[1] - nw [1],
				res = Math.random() * 40,
				i, obj, k, j,
				fuente, pfuente, periodos,
				fuentes = [],
				entity,
				objects = [],
				allResources = [
					'CARBON',
					'GAS',
					'CRUDO'
				],
				zoom = params.data.match(/zoom=(\d+)/),
				periodosRand = !!Math.round(Math.random()),
				objsArray

			pfuente = params.data.match(/fuentes=([-\d]+)/)
			fuente = pfuente && pfuente[1]
			periodos = periodosRand ? ['2012'] : ['2012','2013-2014']
			if(!fuente || fuente == '-1'){
				fuentes = allResources
			}else{
				fuentes = [
					allResources[Math.floor(Math.random()*allResources.length)]
				]
			}
			if(zoom && zoom[1]){
				if(zoom[1] >= 8 && zoom[1] < 12){ // municipalities
					var mod = Math.round(8 * Math.random())
					var municipalities2 = municipalities.map(function(entity){
						var obj = {}
						obj.IdEntidad = entity.id
						obj.NombreEntidad = 'N/A'
						obj.TipoEntidad = 'municipio'
						obj.TipoInfografico = 'G'
						obj.Url = '/Produccion/FichaProduccion?periodosRecursos=2012,2013,2014,2015&departamento=47'
						obj['DetalleA\u00f1o'] = []
						for(var i = 0; i < periodos.length; i++){
							obj['DetalleA\u00f1o'][i] = { Periodo: periodos[i] }
							obj['DetalleA\u00f1o'][i].Detalles = []
							for(var j = 0; j < fuentes.length; j++){
								obj['DetalleA\u00f1o'][i].Detalles[j] = {
									"Cantidad": Math.round(Math.random()*90999), 
									"NombreRecurso": fuentes[j], 
									"UnidadDeMedida": "Barriles (Barriles Mes)"
								}
							}
						}
						return obj
					})
					municipalities2 = municipalities2.filter(function(entity, index){
						return index % 9 == mod
					})
					objects = objects.concat(municipalities2)
				}else if(zoom[1] < 8){ // departamentos
					var departments2 = departments.map(function(entity){
						var obj = {}
						obj.IdEntidad = entity.id
						obj.NombreEntidad = ''
						obj.TipoEntidad = 'departamento'
						obj.TipoInfografico = 'G'
						obj.Url = '/Produccion/FichaProduccion?periodosRecursos=2012,2013,2014,2015&departamento=47'
						obj['DetalleA\u00f1o'] = []
						for(var i = 0; i < periodos.length; i++){
							obj['DetalleA\u00f1o'][i] = { Periodo: periodos[i] }
							obj['DetalleA\u00f1o'][i].Detalles = []
							for(var j = 0; j < fuentes.length; j++){
								obj['DetalleA\u00f1o'][i].Detalles[j] = {
									"Cantidad": Math.round(Math.random()*90999), 
									"NombreRecurso": fuentes[j], 
									"UnidadDeMedida": "Barriles (Barriles Mes)"
								}
							}
						}
						return obj
					})
					objects = objects.concat(departments2)

					var regions2 = regions.map(function(entity){
						var obj = {}
						obj.IdEntidad = entity.id
						obj.NombreEntidad = 'N/A'
						obj.TipoEntidad = 'region'
						obj.TipoInfografico = 'G'
						obj.Url = '/Produccion/FichaProduccion?periodosRecursos=2012,2013,2014,2015&departamento=47'
						obj['DetalleA\u00f1o'] = []
						for(var i = 0; i < periodos.length; i++){
							obj['DetalleA\u00f1o'][i] = { Periodo: periodos[i] }
							obj['DetalleA\u00f1o'][i].Detalles = []
							for(var j = 0; j < fuentes.length; j++){
								obj['DetalleA\u00f1o'][i].Detalles[j] = {
									"Cantidad": Math.round(Math.random()*90999), 
									"NombreRecurso": fuentes[j], 
									"UnidadDeMedida": "Barriles (Barriles Mes)"
								}
							}
						}
						return obj
					})
					objects = objects.concat(regions2)

				}
			}
			// console.log(objects)
			this.responseText = {
				'status': true,
				'Detalles': objects
			}
		}
	})

	$.mockjax({
		url: urls.searchProduction,
		response: function(params){
			params.data = params.data || 'zoom=6&topLeft=11.726509410167694,-91.7140625&bottomRight=-5.5404989748491715,-60.0734375'
			var nw = params.data.match(/topLeft=([\d\.\-\,]+)/)[1].split(','),
				se = params.data.match(/bottomRight=([\d\.\-\,]+)/)[1].split(','),
				width = + se[0] - nw [0],
				height = + se[1] - nw [1],
				res = Math.random() * 40,
				i, obj, k, j,
				fuente, pfuente, periodos,
				fuentes = [],
				entity,
				objects = [],
				allResources = [
					'CARBON',
					'GAS',
					'CRUDO'
				],
				periodosRand = !!Math.round(Math.random()),
				objsArray

			pfuente = params.data.match(/fuentes=([-\d]+)/)
			fuente = pfuente && pfuente[1]
			periodos = periodosRand ? ['2012'] : ['2012','2013-2014']

			if(! fuente || fuente == '-1'){
				fuentes = allResources
			}else{
				fuentes = [
					allResources[Math.floor(Math.random()*allResources.length)]
				]
			}
			for(k=0; k<res; k++){
				objsArray = Math.random() > 0.5 ? departments : municipalities
				entity = objsArray[~~(objsArray.length * Math.random())]
				obj = {}
				var obj = {}
				obj.IdEntidad = entity.id
				obj.NombreEntidad = ''
				obj.TipoEntidad = entity.type
				obj.TipoInfografico = 'CoM'
				obj.Tipo = 'CoM'
				obj.Latitud = + nw[0] + Math.random() * width,
				obj.Longitud = + nw[1] + Math.random() * height,
				obj.Url = '/Produccion/FichaProduccion?periodosRecursos=2012,2013,2014,2015&departamento=47'
				obj['DetalleA\u00f1o'] = []
				for(var i = 0; i < periodos.length; i++){
					obj['DetalleA\u00f1o'][i] = { Periodo: periodos[i] }
					obj['DetalleA\u00f1o'][i].Detalles = []
					for(var j = 0; j < fuentes.length; j++){
						obj['DetalleA\u00f1o'][i].Detalles[j] = {
							"Cantidad": Math.round(Math.random()*90999), 
							"NombreRecurso": fuentes[j], 
							"UnidadDeMedida": "Barriles (Barriles Mes)"
						}
					}
				}
				objects[k] = obj
			}
			console.log( objects )
			this.responseText = {
				'status': true,
				'Detalles': objects
			}

			this.responseText = {
				"Detalles": [
					{
						"IdEntidad": "15",
						"NombreEntidad": "BOLIVAR",
						"TipoEntidad": "departamento",
						"Latitud": 5.542827259,
						"Longitud": -73.35635173,
						"Url": "/Produccion/FichaProduccion/?periodosRecursos=2012,2013,2014,2015&departamento=15",
						"Tipo": "CoM",
						"DetalleAño": [
							{
								"Periodo": "2012,2013,2014,2015",
								"Detalles": [
									{
										"NombreRecurso": "CRUDO",
										"Cantidad": 13040,
										"UnidadDeMedida": "Barriles (Barriles Mes)"
									}
								]
							}
						]
					}
				],
				"status": true,
				"message": null//Math.random() > 0.7 ? null : "Yeah Baby!!"
			}
		}
	})

	$.mockjax({
		url: urls.consolidatedProduction,
		// responseTime: responseDuration,
		response: function () {
			this.responseText = {"graficasConsolidadas":[{"Nombre":"Producción por recurso Natural","ItemsGrafica":[{"Valor":87370399.00,"Label":"CRUDO","LabelExtendido":"Barriles (Barriles Mes)","Porcentaje":null,"Items":null},{"Valor":96060841.00,"Label":"GAS","LabelExtendido":"Kilo Pies Cúbicos","Porcentaje":null,"Items":null},{"Valor":1014643.83,"Label":"CARBON","LabelExtendido":"Toneladas","Porcentaje":null,"Items":null}]},{"Nombre":"LiquidadoPorTipoRecurso","ItemsGrafica":[{"Valor":10030142121.62000000,"Label":"CARBON","LabelExtendido":null,"Porcentaje":0.4738220308762289720206624922,"Items":null},{"Valor":1950757561723.00000000,"Label":"CRUDO","LabelExtendido":null,"Porcentaje":92.15342100192134751496081181,"Items":null},{"Valor":156070835441.00000000,"Label":"GAS","LabelExtendido":null,"Porcentaje":7.3727569672024235130185257014,"Items":null}]},{"Nombre":"LiquidadoPorRecurso","ItemsGrafica":[{"Valor":10030142121.62000000,"Label":"CARBON","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":1950757561723.00000000,"Label":"CRUDO","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":156070835441.00000000,"Label":"GAS","LabelExtendido":null,"Porcentaje":null,"Items":null}]},{"Nombre":"LiquidadoPorDepartamento","ItemsGrafica":[{"Valor":48944934641.30000000,"Label":"ANTIOQUIA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":170290843225.00000000,"Label":"ARAUCA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":60390925678.96000000,"Label":"BOYACA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":439057307557.00000000,"Label":"CASANARE","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":2158718477.80000000,"Label":"CAUCA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":14826464219.00000000,"Label":"CESAR","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":977851706.60000000,"Label":"CORDOBA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":6275623842.08000000,"Label":"CUNDINAMARCA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":101942953443.00000000,"Label":"HUILA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":93417298738.00000000,"Label":"LA GUAJIRA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":9472226.00000000,"Label":"MAGDALENA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":918985275402.00000000,"Label":"META","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":962517956.00000000,"Label":"NARIÑO","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":11229332678.04000000,"Label":"NORTE DE SANTANDER","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":58163418851.00000000,"Label":"PUTUMAYO","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":130604261083.84000000,"Label":"SANTANDER","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":58421068495.00000000,"Label":"TOLIMA","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":37024336.00000000,"Label":"VALLE","LabelExtendido":null,"Porcentaje":null,"Items":null},{"Valor":163246729.00000000,"Label":"VICHADA","LabelExtendido":null,"Porcentaje":null,"Items":null}]}],"status":true,"message":null}
		}
	})

	//----------------------------------------
	// Ficha Producto
	//----------------------------------------
	$.mockjax({
		url: urls.getProductionInfo,
		response: function(){
			this.responseText = {"Detalles":[{"TipoDeRecurso":"HIDROCARBURO","ValorTotal":194207376512,"Detalles":[{"NombreRecurso":"CRUDO","Cantidad":9652028,"UnidadDeMedida":"Barriles (Barriles Mes)","ValorLiquidado":193339844796,"Detalles":[{"Cantidad":556516,"UnidadDeMedida":"Barriles (Barriles Mes)","ValorLiquidado":29582275016,"Detalles":[],"IdCampo":"Y","NombreCampo":"AREA TECA-COCORNA"},{"Cantidad":7241804,"UnidadDeMedida":"Barriles (Barriles Mes)","ValorLiquidado":137311717696,"Detalles":[],"IdCampo":"Q","NombreCampo":"CASABE"},{"Cantidad":1346248,"UnidadDeMedida":"Barriles (Barriles Mes)","ValorLiquidado":18221011068,"Detalles":[],"IdCampo":"T","NombreCampo":"CASABE SUR"},{"Cantidad":92980,"UnidadDeMedida":"Barriles (Barriles Mes)","ValorLiquidado":3091390460,"Detalles":[],"IdCampo":"W","NombreCampo":"NARE"},{"Cantidad":72924,"UnidadDeMedida":"Barriles (Barriles Mes)","ValorLiquidado":1726643848,"Detalles":[],"IdCampo":"Y","NombreCampo":"PEÑAS BLANCAS"},{"Cantidad":341556,"UnidadDeMedida":"Barriles (Barriles Mes)","ValorLiquidado":3406806708,"Detalles":[],"IdCampo":"Q","NombreCampo":"UNDERRIVER"}],"IdRecurso":56},{"NombreRecurso":"GAS","Cantidad":570076,"UnidadDeMedida":"Kilo Pies Cúbicos","ValorLiquidado":867531716,"Detalles":[{"Cantidad":570076,"UnidadDeMedida":"Kilo Pies Cúbicos","ValorLiquidado":867531716,"Detalles":[],"IdCampo":"W","NombreCampo":"CASABE"}],"IdRecurso":38}]},{"TipoDeRecurso":"MINERAL","ValorTotal":1549791065,"Detalles":[{"NombreRecurso":"CARBON","Cantidad":294077.57,"UnidadDeMedida":"Toneladas","ValorLiquidado":1549791065,"Detalles":[{"Cantidad":294077.57,"UnidadDeMedida":"Toneladas","ValorLiquidado":1549791065,"Detalles":[],"IdCampo":"Y","NombreCampo":"OTROS"}],"IdRecurso":1}]}],"status":true,"message":null}
		}
	})
	$.mockjax({
		url: urls.getFieldInfo,
		response: function(){
			if( Math.random()>0.5 ){
				this.responseText = {
					"Detalles": [
						{
							"Mes": "Enero",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Febrero",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Marzo",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Abril",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Mayo",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Junio",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Julio",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Agosto",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Septiembre",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Octubre",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Noviembre",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						},
						{
							"Mes": "Diciembre",
							"Cantidad": 0,
							"UnidadDeMedida": null,
							"ValorLiquidado": 0
						}
					],
					"status": true,
					"message": null
				}
			}else{
				this.responseText = {
					"Detalles": [
						{
							"Mes": "Enero",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Febrero",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Marzo",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Abril",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Mayo",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Junio",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Julio",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Agosto",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Septiembre",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Octubre",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Noviembre",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						},
						{
							"Mes": "Diciembre",
							"Cantidad": Math.round(Math.random()*99999),
							"UnidadDeMedida": 'Barriles (Barriles Mes)',
							"ValorLiquidado": Math.round(Math.random()*99999999999999)
						}
					],
					"status": true,
					"message": null
				}
			}
		}
	})

	$.mockjax({
		url: urls.infoboxesFiscalizacion,
		response: function(params){
			this.responseText = debugFiscalizacion.infoboxes(params)
		}
	})

	$.mockjax({
		url: urls.consolidatedFiscalizacion,
		response: function(params){
			this.responseText = debugFiscConsol
		}
	})

	$.mockjax({
		url: urls.searchFiscalizacion,
		response: function(params){
			this.responseText = debugFiscalizacion.search(params)
		}
	})

	$.mockjax({
		url: '/api/Fiscalizacion/GetCampoOMinasPorNombre/',
		response: function(params){
			this.responseText = debugFiscalizacion.campoMina(params)
		}
	})

})