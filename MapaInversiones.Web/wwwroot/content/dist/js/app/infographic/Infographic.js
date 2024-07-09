/*global doT, define*/
define([
	'app/controller/AppState',
	'app/controller/appStates',
	'app/grapher/Grapher',
	'app/network/Services'
	],
	function(
		AppState,
		appStates,
		Grapher,
		Services
	){

	function byId( id ){
		return document.getElementById( id )
	}

	var // Zones
		topZone = byId('top-graphs'),
		bottomZone = byId('bottom-graphs'),
		factsElem = $('.facts'),
		// Body Data
		dataResourcesPerSector = JSON.parse(document.body.getAttribute('data-resourcesPerSector')),
		dataResourcesPerRegion = JSON.parse(document.body.getAttribute('data-resourcesPerRegion')),
		dataProjectsPerSector = JSON.parse(document.body.getAttribute('data-projectsPerSector')),
		dataResourcesPerDepartment = JSON.parse(document.body.getAttribute('data-resourcesPerDepartment')),
		//dataFacts = factsElem[0].getAttribute('data-facts').split('||'),
		// Templates
		tmplDepto = doT.compile($('#template-graph-resdepto')[0].innerHTML),
		tmplResources = doT.compile($('#template-graph-prod-res')[0].innerHTML),
		factsTempl = doT.compile($('#template-facts')[0].innerHTML),

		// Static Templates
		templateTopProjects = byId('top-graphs-projects').innerHTML,
		templateBottomProjects = byId('bottom-graphs-projects').innerHTML,
		//templateTopResources = byId('top-graphs-resources').innerHTML,
		//templateBottomResources = byId('bottom-graphs-resources').innerHTML,
		//templateTopProduction = byId('top-graphs-production').innerHTML,
		//templateBottomProduction = byId('bottom-graphs-production').innerHTML,
		//templateTopFiscalization = byId('top-graphs-fiscalization').innerHTML,
		//templateBottomFiscalization = byId('bottom-graphs-fiscalization').innerHTML,
		templateFacsResources,
		templateFacsProyects,
		templateFacsProduction,
		templateFacsFiscalizacion,
		// Stuff
		root = $('#infographic'),
		firstTime = true,
		parsedFacts = {
			'Recursos': [],
			'Proyectos': [],
			'Produccion': [],
			'Fiscalizacion': []
		},
		fact,
		emptyHTMLBox = '<div class="empty">No hay datos para este periodo.</div>',
		pendingRequest,
		resToumeout1,
		resToumeout2,
		resToumeout3,
		resToumeout4,
		prodToumeout1,
		prodToumeout2,
		prodToumeout3,
		prodToumeout4,
		proyToumeout1,
		proyToumeout2,
		proyToumeout3,
		proyToumeout4,
		fisToumeout1,
		fisToumeout2,
		fisToumeout3,
		fisToumeout4,
		fisToumeout5,
		timingRedraw = 200


	document.body.removeAttribute('data-resourcesPerSector')
	document.body.removeAttribute('data-resourcesPerRegion')
	document.body.removeAttribute('data-projectsPerSector')
	document.body.removeAttribute('data-resourcesPerDepartment')
	//factsElem[0].removeAttribute('data-facts')

	//for(var i=0; i < dataFacts.length - 1; i++){
	//	fact = JSON.parse(dataFacts[i])
	//	parsedFacts[fact.type].push(fact)
	//}

	//templateFacsResources = factsTempl({facts: parsedFacts['Recursos']})
	//templateFacsProyects = factsTempl({facts: parsedFacts['Proyectos']})
	//templateFacsProduction = factsTempl({facts: parsedFacts['Produccion']})
	//templateFacsFiscalizacion = factsTempl({facts: parsedFacts['Fiscalizacion']})

	function Infographic(){
		AppState.on( 'state-change', this.changeState.bind( this ) )
		AppState.on( 'params-change', this.checkPeriodChange.bind( this ) )
		this.changeState.apply(this, AppState.getStateArray())
	}

	Infographic.prototype.checkPeriodChange = function( state, hash, params ){
		params = params || ''

		var periodsParams = params.match(/period[^=]*=([^&]+)/)
		periodsParams = periodsParams ? periodsParams[0] : ''
		
		if( !this.periodsParams || periodsParams != this.periodsParams ){
			this.changeState.apply(this, [].slice.call(arguments))
			this.periodsParams = periodsParams
		}
	}

	Infographic.prototype.changeState = function( state, hash, params ){
		var undef

		this.setupGraph( state )
		
		if( pendingRequest ){
			if( pendingRequest.abort ) pendingRequest.abort()
		}

		if( !state ){
			initialize( undef, 'Proyectos' )
		}else if( state == 'Proyectos' ){
			pendingRequest = Services.infograph.consolidated(params).done(initializeContructor(state))
		}else if( state == 'Recursos' ){
			pendingRequest = Services.infograph.resources(params).done(initializeContructor(state))
		}else if( state == 'Produccion' ){
			pendingRequest = Services.infograph.production(params).done(initializeContructor(state))
		}else if( state == 'Fiscalizacion' ){
			pendingRequest = Services.infograph.fiscalizacion(params).done(initializeContructor(state))
		}
	}

	Infographic.prototype.setupGraph = function( state ){
		this.state = state

		if( state == 'Proyectos' || !state ){
			topZone.innerHTML = templateTopProjects
			bottomZone.innerHTML = templateBottomProjects
		}else if( state == 'Recursos' ){
			topZone.innerHTML = templateTopResources
			bottomZone.innerHTML = templateBottomResources
		}else if( state == 'Produccion' ){
			topZone.innerHTML = templateTopProduction
			bottomZone.innerHTML = templateBottomProduction
		}else if( state == 'Fiscalizacion' ){
			topZone.innerHTML = templateTopFiscalization
			bottomZone.innerHTML = templateBottomFiscalization
		}
	}

	function initializeContructor( state ){
		return function( data ){
			initialize( data, state )
		}
	}

	function initialize( data, state ){
		// debugger;
		// console.log(data,state)
		if( !data || state == 'Proyectos' ){
			drawProyectsGraphs( data )
			factsElem.html( templateFacsProyects )
		}else if( state == 'Recursos' ){
			factsElem.html( templateFacsResources )
			drawResourcesGraphs( data )
		}else if( state == 'Produccion' ){
			factsElem.html( templateFacsProduction )
			drawProductionGraphs( data )
		}else if( state == 'Fiscalizacion' ){
			factsElem.html( templateFacsFiscalizacion )
			drawFiscalizationGraphs( data )
		}

		// if( data && data.facts ){
		// 	tempFacs = $('.facts').html()
		// 	$('.facts').empty().html( factsTempl( data ) )
		// }else{
		// 	$('.facts').empty().html( tempFacs )
		// }
		


		firstTime = false
	}

	function drawProyectsGraphs( data ){
		var // Proyects Variables
			rootSectorPie,
			rootRegionPie,
			rootProyBar,
			rootResDepto,
			grapResSec,
			// Shared
			max = 0, i,
			seriesData

		rootSectorPie = root.find('#res-sector').empty()[0]
		rootRegionPie = root.find('#res-region').empty()[0]
		rootProyBar = root.find('#proy-sector').empty()[0]
		rootResDepto = root.find('#res-depto').empty()

		dataResourcesPerSector = data ? data.resourcesPerSector : dataResourcesPerSector
		dataResourcesPerRegion = data ? data.resourcesPerRegion : dataResourcesPerRegion
		dataProjectsPerSector = data ? data.projectsPerSector : dataProjectsPerSector
		dataResourcesPerDepartment = data ? data.resourcesPerDepartment : dataResourcesPerDepartment
		
		if( !dataResourcesPerSector || !dataResourcesPerSector.length ){
			rootSectorPie[0].innerHTML = emptyHTMLBox
		}else{
			clearTimeout( proyToumeout1 )
			proyToumeout1 = setTimeout(function(){
				grapResSec = Grapher.drawSemiPie(rootSectorPie, 135, dataResourcesPerSector)
			}, timingRedraw)
		}
		if( !dataResourcesPerRegion || !dataResourcesPerRegion.length ){
			rootRegionPie[0].innerHTML = emptyHTMLBox
		}else{
			clearTimeout( proyToumeout2 )
			proyToumeout2 = setTimeout(function(){
				Grapher.drawSemiPie(rootRegionPie, 180, dataResourcesPerRegion, true)
			}, timingRedraw)
		}
		if( !dataProjectsPerSector || !dataProjectsPerSector.length ){
			rootProyBar[0].innerHTML = emptyHTMLBox
		}else{
			clearTimeout( proyToumeout3 )
			proyToumeout3 = setTimeout(function(){
				Grapher.drawBars(rootProyBar, dataProjectsPerSector, ['Sectores', 'Número de Proyectos'])
			}, timingRedraw)
		}
		if( !dataResourcesPerDepartment || !dataResourcesPerDepartment.length ){
			rootResDepto[0].innerHTML = emptyHTMLBox
		}else{
			clearTimeout( proyToumeout4 )
			proyToumeout4 = setTimeout(function(){
				for(i=0; i<dataResourcesPerDepartment.length; i++){
					max = Math.max(dataResourcesPerDepartment[i].rawValue, max)
				}

				for(i=0; i<dataResourcesPerDepartment.length; i++){
					dataResourcesPerDepartment[i].valuePercent = ~~( 100 * ( dataResourcesPerDepartment[i].rawValue / max )) + '%'
				}

				rootResDepto[0].innerHTML = tmplDepto({array: dataResourcesPerDepartment})
			}, timingRedraw)
		}
		
	}

	function drawResourcesGraphs( data ){

		if( !data || !data.graficasConsolidadas ) return
		
		var i,
			seriesData,
			presupuestoData = [],
			departmentsData = [],
			regionsData = [],
			departmentsList = [],
			regionsList = [],
			girado,
			dataTemp,
			presupuestoGraphData = []

		for( i = 0; i < data.graficasConsolidadas.length; i++ ){
			dataTemp = data.graficasConsolidadas[i]
			if( dataTemp.Nombre == 'Presupuesto' ){
				presupuestoData = dataTemp.ItemsGrafica
			}else if( dataTemp.Nombre == 'RecursosAprobadosXRegion' ){
				regionsData = dataTemp.ItemsGrafica
			}else{
				departmentsData = dataTemp.ItemsGrafica
			}
		}


		//-----------------------------
		// DEPARTMENTS GRAPH
		//-----------------------------


		if( !departmentsData || !departmentsData.length ){
			root.find('#res-resources-depto')[0].innerHTML = emptyHTMLBox
		}else{
			clearTimeout( resToumeout1 )
			resToumeout1 = setTimeout(function(){
				var seriesData = [{
						name: 'Recursos Aprobados',
						type: 'column',
						data: [],
						color: '#00b5c6'
					},{
						name: 'Recursos Girados',
						type: 'column',
						data: [],
						color: {
							pattern: '/content/img/chart-pattern.jpg',
							width: 24,
							height: 24,
							color1: '#009dac'
						}
					}]
				for (i = 0; i < departmentsData.length ; i++) {
					girado = departmentsData[i].Items[0] ? departmentsData[i].Items[0].Valor : 0
					seriesData[0].data[i] = departmentsData[i].Valor// - girado
					seriesData[1].data[i] = girado
					departmentsList[i] = departmentsData[i].Label
					// debugger;
				}
				root.find('#res-resources-depto').highcharts({
					chart: {
						marginBottom: 210
					},
					credits : {
						enabled : false
					},
					exporting: {
						buttons: {
							contextButton: {
								enabled: false
							}
						}
					},
					title: null,
					xAxis: {
						categories: departmentsList,
						labels: {
							formatter: function(){
								return this.value//.substr(0,3)
							},
							rotation: -45,
							align: 'right',
							style: {
								'font-size': '9px'
							}
						},
						title: {
							text: 'DEPARTAMENTOS',
							style: {
								color: '#555',
								'font-size': '1.2em'
							},
							margin: 30
						}
					},
					yAxis: {
						min: 0,
						title: {
							text: 'RECURSOS APROBADOS<br>Y GIRADOS',
							style: {
								color: '#555',
								'font-size': '1.2em',
								marginRight: 20
							},
							margin: 30
						},
						labels: {
							formatter: function(){
								var max = this.axis.max
								// console.log(max)
								/*if( max > 1000000000000){
									return parseFloat((this.value / 1000000000000).toFixed()).toCurrency().replace('$','') + ' Billones'
								}else*/ if( max > 1000000000){
									return parseFloat((this.value / 1000000000).toFixed()).toCurrency().replace('$','') + ' MMillones'
								}else if( max > 1000000){
									return parseFloat((this.value / 1000000).toFixed()).toCurrency().replace('$','') + ' Millones'
								}else if( max > 1000){
									return parseFloat((this.value / 1000).toFixed()).toCurrency().replace('$','') + ' miles'
								}else{
									return this.value
								}
								// return Highcharts.numberFormat(this.value, -3)
							}
						}
					},
					tooltip: {
						formatter: function(){
							var itemData = this.points,
								girado = itemData[1] ? (itemData[1].y ? itemData[1].y : 0) : 0,
								aprobado = itemData[0] ? (itemData[0].y ? itemData[0].y : 0) : 0

							return '<div class="inner-stacked-tooltip">'+
								'<h4 class="title">'+ this.x +'</h4 class="title">'+
								'<p class="number">'+ aprobado.toCurrency() +'</p>'+
								'<p class="name">Recursos Aprobados</p>'+
								'<p class="number">'+ girado.toCurrency()+'</p>'+
								'<p class="name">Recursos Girados</p>'+
								'</div>';
						},
						backgroundColor: '#f9f9f9',
						borderRadius: 0,
						borderColor: '#f9f9f9',
						borderWidth: 0,
						useHTML: true,
						shared: true
					},
					legend: {
						borderColor: '#ddd',
						padding: 18,
						borderRadius: 0/*,
						itemWidth: 200*/
					},
					plotOptions: {
						column: {
							// stacking: 'normal',
							pointPadding: 0.02,
							groupPadding: 0.02
						}
					},
					series: seriesData
				})
			}, timingRedraw)
		}

		//-----------------------------
		// REGIONS GRAPH
		//-----------------------------

		if( !regionsData || !regionsData.length ){
			root.find('#res-resources-region')[0].innerHTML = emptyHTMLBox
		}else{
			clearTimeout( resToumeout2 )
			resToumeout2 = setTimeout(function(){
				var seriesData = [{
						name: 'Recursos Aprobados',
						type: 'column',
						data: [],
						color: '#00b5c6'
					},{
						name: 'Recursos Girados',
						type: 'column',
						data: [],
						color: {
							pattern: '/content/img/chart-pattern.jpg',
							width: 24,
							height: 24,
							color1: '#009dac'
						}
					}]
				for (i = 0; i < regionsData.length ; i++) {
					girado = regionsData[i].Items[0] ? regionsData[i].Items[0].Valor : 0
					seriesData[0].data[i] = regionsData[i].Valor
					seriesData[1].data[i] = girado
					regionsList[i] = regionsData[i].Label
				}
				root.find('#res-resources-region').highcharts({
					chart: {
						marginBottom: 190
					},
					credits : {
						enabled : false
					},
					exporting: {
						buttons: {
							contextButton: {
								enabled: false
							}
						}
					},
					title: null,
					xAxis: {
						categories: regionsList,
						labels: {
							formatter: function(){
								return this.value
							},
							style: {
								'font-size': '9px'
							}
						},
						title: {
							text: 'REGIONES',
							style: {
								color: '#555',
								'font-size': '1.2em'
							},
							margin: 30
						}
					},
					yAxis: {
						min: 0,
						title: {
							text: 'RECURSOS APROBADOS<br>Y GIRADOS',
							style: {
								color: '#555',
								'font-size': '1.2em',
								marginRight: 20
							},
							margin: 30
						},
						labels: {
							formatter: function(){
								var max = this.axis.max
								// console.log(max)
								/*if( max > 1000000000000){
									return parseFloat((this.value / 1000000000000).toFixed()).toCurrency().replace('$','') + ' Billones'
								}else*/ if( max > 1000000000){
									return parseFloat((this.value / 1000000000).toFixed()).toCurrency().replace('$','') + ' MMillones'
								}else if( max > 1000000){
									return parseFloat((this.value / 1000000).toFixed()).toCurrency().replace('$','') + ' Millones'
								}else if( max > 1000){
									return parseFloat((this.value / 1000).toFixed()).toCurrency().replace('$','') + ' miles'
								}else{
									return this.value
								}
								// return Highcharts.numberFormat(this.value, -3)
							}
						}
					},
					tooltip: {
						formatter: function(){
							var itemData = this.points,
								girado = itemData[1] ? (itemData[1].y ? itemData[1].y : 0) : 0,
								aprobado = itemData[0] ? (itemData[0].y ? itemData[0].y : 0) : 0
							
							return '<div class="inner-stacked-tooltip">'+
								'<h4 class="title">'+ this.x +'</h4 class="title">'+
								'<p class="number">'+ aprobado.toCurrency() +'</p>'+
								'<p class="name">Recursos Aprobados</p>'+
								'<p class="number">'+ girado.toCurrency()+'</p>'+
								'<p class="name">Recursos Girados</p>'+
								'</div>';
						},
						backgroundColor: '#f9f9f9',
						borderRadius: 0,
						borderColor: '#f9f9f9',
						borderWidth: 0,
						useHTML: true,
						shared: true
					},
					legend: {
						borderColor: '#ddd',
						padding: 18,
						borderRadius: 0/*,
						itemWidth: 200*/
					},
					plotOptions: {
						column: {
							// stacking: 'normal',
							pointPadding: 0.02,
							groupPadding: 0.02
						}
					},
					series: seriesData
				})
			}, timingRedraw)
		}

		

		//----------------------
		// PRESUPUESTO
		//----------------------
		for( i = 0; i < presupuestoData.length; i++ ){
			presupuestoGraphData[i] = {
				label: presupuestoData[i].Label,
				value: presupuestoData[i].Porcentaje.toFixed(2),
				rawValue: presupuestoData[i].Valor,
				valuePercent: presupuestoData[i].Porcentaje
			}
		}
		if( !presupuestoGraphData || !presupuestoGraphData.length ){
			root.find('#res-fuente')[0].innerHTML = emptyHTMLBox
		}else{
			clearTimeout( resToumeout3 )
			resToumeout3 = setTimeout(function(){
				Grapher.drawSemiPie( $('#res-fuente').empty()[0], 180, presupuestoGraphData, true )
			}, timingRedraw)
		}
	}


	function drawProductionGraphs( data ){
		var typeResRoot = root.find('#prod-reg-res').empty()[0],
			resNoRenovableRoot = root.find('#prod-res-no').empty()[0],
			liquidationDepRoot = root.find('#prod-depto').empty()[0],
			resNatRoot = root.find('#prod-res').empty()[0],
			i, dataTemp, prodData = {},
			scales

		for( i = 0; i < data.graficasConsolidadas.length; i++ ){
			dataTemp = data.graficasConsolidadas[i]
			if( dataTemp.Nombre == 'ProduccionPorRecursos' ){
				prodData.resNat = dataTemp.ItemsGrafica
			}else if( dataTemp.Nombre == 'LiquidadoPorTipoRecurso' ){
				prodData.typeRes = dataTemp.ItemsGrafica
			}else if( dataTemp.Nombre == 'LiquidadoPorRecurso' ){
				prodData.resNoRenovable = dataTemp.ItemsGrafica
			}else{ //LiquidadoPorDepartamento
				prodData.liquidationDep = dataTemp.ItemsGrafica
			}
		}

		//-------------------------
		// PIE REGALIAS LIQUIDADAS
		//-------------------------
		if( !prodData.typeRes || !prodData.typeRes.length ){
			typeResRoot.innerHTML = emptyHTMLBox
		}else{
			clearTimeout( prodToumeout1 )
			prodToumeout1 = setTimeout(function(){
				var i
				for( i = 0; i < prodData.typeRes.length; i++ ){
					prodData.typeRes[i] = {
						label: prodData.typeRes[i].Label,
						value: prodData.typeRes[i].Porcentaje.toFixed(2),
						rawValue: prodData.typeRes[i].Valor,
						valuePercent: prodData.typeRes[i].Porcentaje
					}
				}
				Grapher.drawSemiPie(typeResRoot, 135, prodData.typeRes, true)
			}, timingRedraw)
		}

		//-------------------------
		// BARS NO RENOVABLE
		//-------------------------
		if( !prodData.resNoRenovable || !prodData.resNoRenovable.length ){
			resNoRenovableRoot.innerHTML = emptyHTMLBox
		}else{
			clearTimeout( prodToumeout2 )
			prodToumeout2 = setTimeout(function(){
				var i, percent, noPercent = false,
					total = 0, max
				for( i = 0; i < prodData.resNoRenovable.length; i++ ){
					percent = prodData.resNoRenovable[i].Porcentaje
					noPercent = ( typeof percent == 'undefine' || percent === null )
					prodData.resNoRenovable[i] = {
						label: prodData.resNoRenovable[i].Label,
						value: percent ? +(percent.toFixed(2)) : null,
						rawValue: prodData.resNoRenovable[i].Valor,
						valuePercent: percent
					}
					total = total + prodData.resNoRenovable[i].rawValue
					max = Math.max(0, prodData.resNoRenovable[i].rawValue)
				}
				if( noPercent ){
					for( i = 0; i < prodData.resNoRenovable.length; i++ ){
						prodData.resNoRenovable[i].valuePercent = 100 * prodData.resNoRenovable[i].rawValue / total 
						prodData.resNoRenovable[i].value = (100 * prodData.resNoRenovable[i].rawValue / total).toFixed(2) + '%'
					}
				}
				scales = scalesFor(max , 0, 11)
				Grapher.drawBars(resNoRenovableRoot, prodData.resNoRenovable, ['Recurso Natural No Renovable', 'Liquidado ('+scales.units+')'], {height: 350})
				// Grapher.drawBars(rootProyBar, dataProjectsPerSector)
			}, timingRedraw)
		}
		
		//-------------------------
		// BARS LIQUIDATION DEP
		//-------------------------
		if( !prodData.liquidationDep || !prodData.liquidationDep.length ){
			resNoRenovableRoot.innerHTML = emptyHTMLBox
		}else{
			clearTimeout( prodToumeout3 )
			prodToumeout3 = setTimeout(function(){
				var max = prodData.liquidationDep[0].Valor,
					total = 0

				for(i=0; i<prodData.liquidationDep.length; i++){
					max = Math.max(prodData.liquidationDep[i].Valor, max)
					total += prodData.liquidationDep[i].Valor
				}

				for(i=0; i<prodData.liquidationDep.length; i++){
					prodData.liquidationDep[i].rawValue = prodData.liquidationDep[i].Valor
					prodData.liquidationDep[i].value = prodData.liquidationDep[i].Porcentaje || ( 100 * ( prodData.liquidationDep[i].rawValue / total )).toFixed(2) + '%'
					prodData.liquidationDep[i].label = prodData.liquidationDep[i].Label
					prodData.liquidationDep[i].valuePercent = prodData.liquidationDep[i].Porcentaje || ~~( 100 * ( prodData.liquidationDep[i].rawValue / max )) + '%'
				}

				liquidationDepRoot.innerHTML = tmplDepto({array: prodData.liquidationDep})
			}, timingRedraw)
		}
		
		//-------------------------
		// INFO PROD RES
		//-------------------------
		if( !prodData.resNat || !prodData.resNat.length ){
			resNatRoot.innerHTML = emptyHTMLBox
		}else{
			clearTimeout( prodToumeout4 )
			prodToumeout4 = setTimeout(function(){
				resNatRoot.innerHTML = tmplResources({array: prodData.resNat})
			}, timingRedraw)
		}
	}

	function scalesFor(max, min, numScales){
		var s, len, hidnDigs, i,
			units, scales = []

		len = max.toString().length
		hidnDigs = len - (len % 3 || 3)

		if( len - hidnDigs == 1) hidnDigs -= 3

		// if( hidnDigs == 1 ) hidnDigs = 4
		
		for(i=0; i<=numScales; i++){
			s = min + ((max - min)/
				numScales * i)
			s = Math.round( s / Math.pow(10, hidnDigs) )
			scales.push(s.toString().replace(/(\d)(\d{3})/,'$1.$2'))
		}

		if(hidnDigs == 3){
			units = 'Miles'
		}else if(hidnDigs == 6){
			units = 'Millones'
		}else if(hidnDigs == 9){
			units = 'Miles de Millones'
		}else if(hidnDigs == 12){
			units = 'Billones'
		}else if(hidnDigs == 15){
			units = 'Miles de Billones'
		}else if(hidnDigs == 18){
			units = 'Millones de Billones'
		}else if(hidnDigs == 18){
			units = 'Trillones'
		}

		return {units: units, scales: scales}
	}


	function drawFiscalizationGraphs( data ){
		var fiscHidroAct = root.find('#fisc-hidro-type').empty()[0],
			fiscMinAct = root.find('#fisc-min-act').empty()[0],
			fiscCamposType = root.find('#fisc-camp-type').empty()[0],
			fiscCamposTypeDep = root.find('#fisc-camp-type-dep').empty()[0],
			i, dataTemp = {}, departmentsData = {},
			scales,
			// DATA
			fiscCamposTypeDepData,
			fiscHidroActData,
			fiscMinActData,
			fiscCamposResData,
			label


		data = data.graficasConsolidadas

		if($('body').attr('data-debug')){

			//data = [{"Nombre":"FiscalizacionPorHidrocarburo","ItemsGrafica":[{"Valor":298.0,"Label":"Campos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null},{"Valor":298.0,"Label":"Campos fiscalizados","LabelExtendido":null,"Porcentaje":100.0,"Items":null}],"Tipo":"H"},{"Nombre":"FiscalizacionPorMIieral","ItemsGrafica":[{"Valor":10159.0,"Label":"Títulos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null},{"Valor":9124.0,"Label":"Títulos fiscalizados","LabelExtendido":null,"Porcentaje":89.0,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionHidrocarburosPorActividad","ItemsGrafica":[{"Valor":32.0,"Label":"Informe de Taponamiento y Abandono","LabelExtendido":null,"Porcentaje":10.0,"Items":null},{"Valor":36.0,"Label":"Informe Sobre trabajos Posteriores a la terminación Oficial","LabelExtendido":null,"Porcentaje":12.0,"Items":null},{"Valor":2.0,"Label":"Permiso de mantenimiento de presión","LabelExtendido":null,"Porcentaje":0.0,"Items":null},{"Valor":1.0,"Label":"Permiso de Inyección de Agua","LabelExtendido":null,"Porcentaje":0.0,"Items":null},{"Valor":5.0,"Label":"Informe mensual de Inyección de Vapor y producción adicional de petróleo","LabelExtendido":null,"Porcentaje":1.0,"Items":null},{"Valor":214.0,"Label":"Informe mensual sobre ensayos de potencial de pozos de petróleo","LabelExtendido":null,"Porcentaje":71.0,"Items":null},{"Valor":14.0,"Label":"Informe mensual de producción de pozos de gas","LabelExtendido":null,"Porcentaje":4.0,"Items":null},{"Valor":15.0,"Label":"Informe mensual sobre inyección de agua y producción","LabelExtendido":null,"Porcentaje":5.0,"Items":null},{"Valor":3.0,"Label":"Informe mensual sobre mantenimiento de presión (Inyección a gas)","LabelExtendido":null,"Porcentaje":1.0,"Items":null},{"Valor":12.0,"Label":"Informe anual sobre mantenimiento de presión","LabelExtendido":null,"Porcentaje":4.0,"Items":null},{"Valor":1.0,"Label":"Informe mensual sobre desplazamiento miscible","LabelExtendido":null,"Porcentaje":0.0,"Items":null},{"Valor":160.0,"Label":"Informe mensual sobre producción, plantas y consumos de gas natural y procesado","LabelExtendido":null,"Porcentaje":53.0,"Items":null},{"Valor":3.0,"Label":"Intención de Perforar  (Pozos de Desarrollo)","LabelExtendido":null,"Porcentaje":1.0,"Items":null},{"Valor":59.0,"Label":"Informe Quincenal","LabelExtendido":null,"Porcentaje":19.0,"Items":null},{"Valor":77.0,"Label":"Informe de Terminación Oficial","LabelExtendido":null,"Porcentaje":25.0,"Items":null},{"Valor":92.0,"Label":"Permisos para Trabajos Posteriores a la terminación Oficial","LabelExtendido":null,"Porcentaje":30.0,"Items":null},{"Valor":20.0,"Label":"Informes sobre prueba de Presión","LabelExtendido":null,"Porcentaje":6.0,"Items":null},{"Valor":239.0,"Label":"Informe Mensual de Producción de pozos de petróleo y gas","LabelExtendido":null,"Porcentaje":80.0,"Items":null},{"Valor":30.0,"Label":"Movimiento de tanques y correcciones","LabelExtendido":null,"Porcentaje":10.0,"Items":null},{"Valor":256.0,"Label":"Resumen Mensual sobre producción y movimiento de petróleo","LabelExtendido":null,"Porcentaje":85.0,"Items":null},{"Valor":164.0,"Label":"Especificacion de  produccion por pozo mensual","LabelExtendido":null,"Porcentaje":55.0,"Items":null},{"Valor":69.0,"Label":"Otra actividad en el desarrollo de sus funciones","LabelExtendido":null,"Porcentaje":23.0,"Items":null},{"Valor":2.0,"Label":"Autorización de Quemas","LabelExtendido":null,"Porcentaje":0.0,"Items":null},{"Valor":7.0,"Label":"Autorización de Suspensiones","LabelExtendido":null,"Porcentaje":2.0,"Items":null},{"Valor":11.0,"Label":"Visita a Campo o Pozos","LabelExtendido":null,"Porcentaje":3.0,"Items":null}],"Tipo":"H"},{"Nombre":"FiscalizacionMineralesPorActividad","ItemsGrafica":[{"Valor":8616.0,"Label":"Evaluación Documental","LabelExtendido":null,"Porcentaje":84.0,"Items":null},{"Valor":8143.0,"Label":"Visita de Campo","LabelExtendido":null,"Porcentaje":80.0,"Items":null},{"Valor":8494.0,"Label":"Informe Integral de Fiscalización","LabelExtendido":null,"Porcentaje":83.0,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":1467.0,"Label":"ANTIOQUIA","LabelExtendido":"Títulos mineros","Porcentaje":85.9,"Items":null},{"Valor":24.0,"Label":"ARAUCA","LabelExtendido":"Títulos mineros","Porcentaje":70.6,"Items":null},{"Valor":106.0,"Label":"ATLANTICO","LabelExtendido":"Títulos mineros","Porcentaje":97.2,"Items":null},{"Valor":36.0,"Label":"BOGOTA","LabelExtendido":"Títulos mineros","Porcentaje":94.7,"Items":null},{"Valor":312.0,"Label":"BOLIVAR","LabelExtendido":"Títulos mineros","Porcentaje":66.2,"Items":null},{"Valor":1514.0,"Label":"BOYACA","LabelExtendido":"Títulos mineros","Porcentaje":98.3,"Items":null},{"Valor":387.0,"Label":"CALDAS","LabelExtendido":"Títulos mineros","Porcentaje":97.7,"Items":null},{"Valor":34.0,"Label":"CAQUETA","LabelExtendido":"Títulos mineros","Porcentaje":66.7,"Items":null},{"Valor":116.0,"Label":"CASANARE","LabelExtendido":"Títulos mineros","Porcentaje":77.3,"Items":null},{"Valor":238.0,"Label":"CAUCA","LabelExtendido":"Títulos mineros","Porcentaje":91.9,"Items":null},{"Valor":374.0,"Label":"CESAR","LabelExtendido":"Títulos mineros","Porcentaje":94.0,"Items":null},{"Valor":160.0,"Label":"CHOCO","LabelExtendido":"Títulos mineros","Porcentaje":79.6,"Items":null},{"Valor":101.0,"Label":"CORDOBA","LabelExtendido":"Títulos mineros","Porcentaje":87.8,"Items":null},{"Valor":1012.0,"Label":"CUNDINAMARCA","LabelExtendido":"Títulos mineros","Porcentaje":91.7,"Items":null},{"Valor":34.0,"Label":"GUAINIA","LabelExtendido":"Títulos mineros","Porcentaje":89.5,"Items":null},{"Valor":5.0,"Label":"GUAVIARE","LabelExtendido":"Títulos mineros","Porcentaje":100.0,"Items":null},{"Valor":178.0,"Label":"HUILA","LabelExtendido":"Títulos mineros","Porcentaje":82.0,"Items":null},{"Valor":60.0,"Label":"LA GUAJIRA","LabelExtendido":"Títulos mineros","Porcentaje":83.3,"Items":null},{"Valor":88.0,"Label":"MAGDALENA","LabelExtendido":"Títulos mineros","Porcentaje":91.7,"Items":null},{"Valor":188.0,"Label":"META","LabelExtendido":"Títulos mineros","Porcentaje":66.9,"Items":null},{"Valor":199.0,"Label":"NARIÑO","LabelExtendido":"Títulos mineros","Porcentaje":93.9,"Items":null},{"Valor":763.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":96.3,"Items":null},{"Valor":43.0,"Label":"PUTUMAYO","LabelExtendido":"Títulos mineros","Porcentaje":91.5,"Items":null},{"Valor":56.0,"Label":"QUINDIO","LabelExtendido":"Títulos mineros","Porcentaje":80.0,"Items":null},{"Valor":59.0,"Label":"RISARALDA","LabelExtendido":"Títulos mineros","Porcentaje":79.7,"Items":null},{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":699.0,"Label":"SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":98.6,"Items":null},{"Valor":48.0,"Label":"SUCRE","LabelExtendido":"Títulos mineros","Porcentaje":80.0,"Items":null},{"Valor":543.0,"Label":"TOLIMA","LabelExtendido":"Títulos mineros","Porcentaje":88.0,"Items":null},{"Valor":269.0,"Label":"VALLE","LabelExtendido":"Títulos mineros","Porcentaje":95.7,"Items":null},{"Valor":5.0,"Label":"VAUPES","LabelExtendido":"Títulos mineros","Porcentaje":83.3,"Items":null},{"Valor":6.0,"Label":"VICHADA","LabelExtendido":"Títulos mineros","Porcentaje":66.7,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"ANTIOQUIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":15.0,"Label":"ARAUCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"ATLANTICO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"BOGOTA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":2.0,"Label":"BOLIVAR","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":6.0,"Label":"BOYACA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"CALDAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CAQUETA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":111.0,"Label":"CASANARE","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":2.0,"Label":"CAUCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":14.0,"Label":"CESAR","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"CHOCO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CORDOBA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":2.0,"Label":"CUNDINAMARCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"GUAINIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"GUAVIARE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":25.0,"Label":"HUILA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":3.0,"Label":"LA GUAJIRA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"MAGDALENA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":49.0,"Label":"META","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":1.0,"Label":"NARIÑO","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":8.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":19.0,"Label":"PUTUMAYO","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"QUINDIO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"RISARALDA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":25.0,"Label":"SANTANDER","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":1.0,"Label":"SUCRE","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":14.0,"Label":"TOLIMA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"VALLE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"VAUPES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":1.0,"Label":"VICHADA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null}],"Tipo":"H"}]
			//data = [{"Nombre":"FiscalizacionPorHidrocarburo","ItemsGrafica":[{"Valor":487.0,"Label":"Campos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null},{"Valor":487.0,"Label":"Campos fiscalizados","LabelExtendido":null,"Porcentaje":100.0,"Items":null}],"Tipo":"H"},{"Nombre":"FiscalizacionPorMIieral","ItemsGrafica":[{"Valor":10159.0,"Label":"Títulos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null},{"Valor":8653.0,"Label":"Títulos fiscalizados","LabelExtendido":null,"Porcentaje":85.0,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionHidrocarburosPorActividad","ItemsGrafica":[{"Valor":487.0,"Label":"Producción","LabelExtendido":null,"Porcentaje":100.0,"Items":null}],"Tipo":"H"},{"Nombre":"FiscalizacionMineralesPorActividad","ItemsGrafica":[{"Valor":7955.0,"Label":"Evaluación Documental","LabelExtendido":null,"Porcentaje":78.0,"Items":null},{"Valor":8025.0,"Label":"Visita de Campo","LabelExtendido":null,"Porcentaje":78.0,"Items":null},{"Valor":5412.0,"Label":"Informe Integral de Fiscalización","LabelExtendido":null,"Porcentaje":53.0,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":1469.0,"Label":"ANTIOQUIA","LabelExtendido":"Títulos mineros","Porcentaje":86.0,"Items":null},{"Valor":25.0,"Label":"ARAUCA","LabelExtendido":"Títulos mineros","Porcentaje":73.5,"Items":null},{"Valor":89.0,"Label":"ATLANTICO","LabelExtendido":"Títulos mineros","Porcentaje":81.7,"Items":null},{"Valor":35.0,"Label":"BOGOTA","LabelExtendido":"Títulos mineros","Porcentaje":92.1,"Items":null},{"Valor":334.0,"Label":"BOLIVAR","LabelExtendido":"Títulos mineros","Porcentaje":70.9,"Items":null},{"Valor":1372.0,"Label":"BOYACA","LabelExtendido":"Títulos mineros","Porcentaje":89.1,"Items":null},{"Valor":297.0,"Label":"CALDAS","LabelExtendido":"Títulos mineros","Porcentaje":75.0,"Items":null},{"Valor":43.0,"Label":"CAQUETA","LabelExtendido":"Títulos mineros","Porcentaje":84.3,"Items":null},{"Valor":146.0,"Label":"CASANARE","LabelExtendido":"Títulos mineros","Porcentaje":97.3,"Items":null},{"Valor":210.0,"Label":"CAUCA","LabelExtendido":"Títulos mineros","Porcentaje":81.1,"Items":null},{"Valor":352.0,"Label":"CESAR","LabelExtendido":"Títulos mineros","Porcentaje":88.4,"Items":null},{"Valor":151.0,"Label":"CHOCO","LabelExtendido":"Títulos mineros","Porcentaje":75.1,"Items":null},{"Valor":100.0,"Label":"CORDOBA","LabelExtendido":"Títulos mineros","Porcentaje":87.0,"Items":null},{"Valor":987.0,"Label":"CUNDINAMARCA","LabelExtendido":"Títulos mineros","Porcentaje":89.5,"Items":null},{"Valor":19.0,"Label":"GUAINIA","LabelExtendido":"Títulos mineros","Porcentaje":50.0,"Items":null},{"Valor":3.0,"Label":"GUAVIARE","LabelExtendido":"Títulos mineros","Porcentaje":60.0,"Items":null},{"Valor":185.0,"Label":"HUILA","LabelExtendido":"Títulos mineros","Porcentaje":85.3,"Items":null},{"Valor":41.0,"Label":"LA GUAJIRA","LabelExtendido":"Títulos mineros","Porcentaje":56.9,"Items":null},{"Valor":87.0,"Label":"MAGDALENA","LabelExtendido":"Títulos mineros","Porcentaje":90.6,"Items":null},{"Valor":250.0,"Label":"META","LabelExtendido":"Títulos mineros","Porcentaje":89.0,"Items":null},{"Valor":179.0,"Label":"NARIÑO","LabelExtendido":"Títulos mineros","Porcentaje":84.4,"Items":null},{"Valor":699.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":88.3,"Items":null},{"Valor":36.0,"Label":"PUTUMAYO","LabelExtendido":"Títulos mineros","Porcentaje":76.6,"Items":null},{"Valor":52.0,"Label":"QUINDIO","LabelExtendido":"Títulos mineros","Porcentaje":74.3,"Items":null},{"Valor":61.0,"Label":"RISARALDA","LabelExtendido":"Títulos mineros","Porcentaje":82.4,"Items":null},{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":633.0,"Label":"SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":89.3,"Items":null},{"Valor":38.0,"Label":"SUCRE","LabelExtendido":"Títulos mineros","Porcentaje":63.3,"Items":null},{"Valor":502.0,"Label":"TOLIMA","LabelExtendido":"Títulos mineros","Porcentaje":81.4,"Items":null},{"Valor":249.0,"Label":"VALLE","LabelExtendido":"Títulos mineros","Porcentaje":88.6,"Items":null},{"Valor":3.0,"Label":"VAUPES","LabelExtendido":"Títulos mineros","Porcentaje":50.0,"Items":null},{"Valor":6.0,"Label":"VICHADA","LabelExtendido":"Títulos mineros","Porcentaje":66.7,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"ANTIOQUIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":16.0,"Label":"ARAUCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"ATLANTICO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"BOGOTA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":6.0,"Label":"BOLIVAR","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":16.0,"Label":"BOYACA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"CALDAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":1.0,"Label":"CAQUETA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":186.0,"Label":"CASANARE","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":3.0,"Label":"CAUCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":23.0,"Label":"CESAR","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"CHOCO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CORDOBA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":3.0,"Label":"CUNDINAMARCA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"GUAINIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"GUAVIARE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":28.0,"Label":"HUILA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":2.0,"Label":"LA GUAJIRA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":1.0,"Label":"MAGDALENA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":88.0,"Label":"META","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":1.0,"Label":"NARIÑO","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":10.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":30.0,"Label":"PUTUMAYO","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"QUINDIO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"RISARALDA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":45.0,"Label":"SANTANDER","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":6.0,"Label":"SUCRE","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":24.0,"Label":"TOLIMA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"VALLE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"VAUPES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":1.0,"Label":"VICHADA","LabelExtendido":"Campos","Porcentaje":100.0,"Items":null}],"Tipo":"H"}]
			// 2012
			data = [{"Nombre":"FiscalizacionPorHidrocarburo","ItemsGrafica":[{"Valor":0.0,"Label":"Campos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null},{"Valor":0.0,"Label":"Campos fiscalizados","LabelExtendido":null,"Porcentaje":0.0,"Items":null}],"Tipo":"H"},{"Nombre":"FiscalizacionPorMIieral","ItemsGrafica":[{"Valor":9729.0,"Label":"Títulos vigentes","LabelExtendido":null,"Porcentaje":100.0,"Items":null},{"Valor":131.0,"Label":"Títulos fiscalizados","LabelExtendido":null,"Porcentaje":1.0,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionHidrocarburosPorActividad","ItemsGrafica":[],"Tipo":"H"},{"Nombre":"FiscalizacionMineralesPorActividad","ItemsGrafica":[{"Valor":131.0,"Label":"Evaluación Documental","LabelExtendido":null,"Porcentaje":1.0,"Items":null},{"Valor":1.0,"Label":"Visita de Campo","LabelExtendido":null,"Porcentaje":0.0,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":38.0,"Label":"ANTIOQUIA","LabelExtendido":"Títulos mineros","Porcentaje":2.3,"Items":null},{"Valor":0.0,"Label":"ARAUCA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"ATLANTICO","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"BOGOTA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"BOLIVAR","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"BOYACA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CALDAS","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CAQUETA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":9.0,"Label":"CASANARE","LabelExtendido":"Títulos mineros","Porcentaje":6.1,"Items":null},{"Valor":0.0,"Label":"CAUCA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CESAR","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CHOCO","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CORDOBA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":35.0,"Label":"CUNDINAMARCA","LabelExtendido":"Títulos mineros","Porcentaje":3.2,"Items":null},{"Valor":0.0,"Label":"GUAINIA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"GUAVIARE","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":10.0,"Label":"HUILA","LabelExtendido":"Títulos mineros","Porcentaje":4.8,"Items":null},{"Valor":1.0,"Label":"LA GUAJIRA","LabelExtendido":"Títulos mineros","Porcentaje":1.4,"Items":null},{"Valor":0.0,"Label":"MAGDALENA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"META","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"NARIÑO","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"PUTUMAYO","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"QUINDIO","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":13.0,"Label":"RISARALDA","LabelExtendido":"Títulos mineros","Porcentaje":17.8,"Items":null},{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":1.0,"Label":"SANTANDER","LabelExtendido":"Títulos mineros","Porcentaje":0.1,"Items":null},{"Valor":0.0,"Label":"SUCRE","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":24.0,"Label":"TOLIMA","LabelExtendido":"Títulos mineros","Porcentaje":4.1,"Items":null},{"Valor":0.0,"Label":"VALLE","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"VAUPES","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"VICHADA","LabelExtendido":"Títulos mineros","Porcentaje":0.0,"Items":null}],"Tipo":"M"},{"Nombre":"FiscalizacionPorTipoRecursoPorDepartamento","ItemsGrafica":[{"Valor":0.0,"Label":"AMAZONAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"ANTIOQUIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"ARAUCA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"ATLANTICO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"BOGOTA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"BOLIVAR","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"BOYACA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CALDAS","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CAQUETA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CASANARE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CAUCA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CESAR","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CHOCO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CORDOBA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"CUNDINAMARCA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"GUAINIA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"GUAVIARE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"HUILA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"LA GUAJIRA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"MAGDALENA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"META","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"NARIÑO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"NORTE DE SANTANDER","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"PUTUMAYO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"QUINDIO","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"RISARALDA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"SAN ANDRES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"SANTANDER","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"SUCRE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"TOLIMA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"VALLE","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"VAUPES","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null},{"Valor":0.0,"Label":"VICHADA","LabelExtendido":"Campos","Porcentaje":0.0,"Items":null}],"Tipo":"H"}]
		}

		

		for(i=0; i<data.length; i++){

			dataTemp[ data[i].Nombre+data[i].Tipo ] = {}
			dataTemp[ data[i].Nombre+data[i].Tipo ].ItemsGrafica = data[i].ItemsGrafica
			dataTemp[ data[i].Nombre+data[i].Tipo ].categories = []
			dataTemp[ data[i].Nombre+data[i].Tipo ].series = []
			dataTemp[ data[i].Nombre+data[i].Tipo ].valor = []
			dataTemp[ data[i].Nombre+data[i].Tipo ].obj = []
			dataTemp[ data[i].Nombre+data[i].Tipo ].Tipo = data[i].Tipo
			dataTemp[ data[i].Nombre+data[i].Tipo ].showNoData = false

			var showNoData = 0

			$.each(dataTemp[ data[i].Nombre+data[i].Tipo ].ItemsGrafica, function(k, v){
				
				var temObj = {}


				temObj.y = v.Porcentaje
				temObj.valor = v.Valor
				temObj.vigentes = Math.round((v.Valor * 100) / v.Porcentaje )
				if(isNaN(temObj.vigentes)){
					temObj.vigentes = 0
				}

				showNoData = ( showNoData + v.Porcentaje )

			


				//console.log(k, v.Label)
		   		dataTemp[ data[i].Nombre+data[i].Tipo ].categories.push(v.Label);
		   		dataTemp[ data[i].Nombre+data[i].Tipo ].series.push(v.Porcentaje);
		   		dataTemp[ data[i].Nombre+data[i].Tipo ].obj.push(temObj);
		   		dataTemp[ data[i].Nombre+data[i].Tipo ].showNoData = showNoData

		   		
			})

		   	//console.log(dataTemp[ data[i].Nombre+data[i].Tipo ], dataTemp[ data[i].Nombre+data[i].Tipo ].showNoData)

			
		}

		fiscHidrocarburoData = dataTemp.FiscalizacionPorHidrocarburoH.ItemsGrafica
		fiscMineralData = dataTemp.FiscalizacionPorMIieralM.ItemsGrafica
		fiscHidroActData = dataTemp.FiscalizacionHidrocarburosPorActividadH.ItemsGrafica
		fiscMinActData = dataTemp.FiscalizacionMineralesPorActividadM.ItemsGrafica
		fiscTipoRecursoDepDataM = dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.ItemsGrafica
		fiscTipoRecursoDepDataH = dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.ItemsGrafica
		//fiscCamposResData = dataTemp.FiscalizacionPorTipoRecurso.ItemsGrafica

		//debugger;

		var typeHA = {};
			typeHA.type = 'column';
			typeHA.height = 400;
			typeHA.align = 'center';
			

		if(dataTemp.FiscalizacionHidrocarburosPorActividadH.obj.length >= 3){
			$('.graph-fiscalization-hidrocarburos').addClass('lay-large')

			typeHA.type = 'bar';
			typeHA.height = 900;
			typeHA.align = 'right';
		}

		$('#FiscalizacionPorHidrocarburo').highcharts({
            chart: {
                type: 'column'
            },
            title: {
				text: null,
				style: {
					color: '#555',
					'font-size': '1.2em'
				},
				margin: 30
			},
            subtitle: {
                text: null
            },
            xAxis: {

                categories: dataTemp.FiscalizacionPorHidrocarburoH.categories,
                labels: {
					
					rotation: 0,
					align: 'center',
					style: {
						'font-size': '9px'
					}
				}
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: null
                }
            },
            tooltip: {
            	/*formatter: function(){
							var series, data

							debugger;

							return '<div class="inner-stacked-tooltip">'+
								'<h4 class="title">'+ this.x +'</h4 class="title">'+
								'<p class="number">'+ aprobado.toCurrency() +'</p>'+
								'<p class="name">Recursos Aprobados</p>'+
								'<p class="number">'+ girado.toCurrency()+'</p>'+
								'<p class="name">Recursos Girados</p>'+
								'</div>';
						},*/
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">Campos: {point.valor} </b></b></td>' +
                    '</tr>'+
                    '<tr>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                backgroundColor: '#ffffff'
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                }
            },
	        credits: { enabled: false },
			exporting: { enabled: false },
            series: [{
                name: ' ',
            	color: '#f2733c',
                data: dataTemp.FiscalizacionPorHidrocarburoH.obj,

            }]
        });

		
		/*$.each(dataTemp.FiscalizacionPorHidrocarburoH.series, function(k, v){

			var html,
				valor = dataTemp.FiscalizacionPorHidrocarburoH.valor[k];
				cat = dataTemp.FiscalizacionPorHidrocarburoH.categories[k];
				

			html = '<div class="box-label"><span class="category">'+cat+'</span><span class="valor"><p>'+valor+'</p></span><span class="percent">'+v+'%</span></div>'

			$('.FiscalizacionPorHidrocarburo .graph-extra-lables').append(html);

		})
		$('.FiscalizacionPorHidrocarburo .graph-extra-lables').addClass('boxes-by-'+dataTemp.FiscalizacionPorHidrocarburoH.series.length)*/

		$('.FiscalizacionPorHidrocarburo').addClass('data-bars-'+dataTemp.FiscalizacionPorHidrocarburoH.obj.length + ' data-bars-'+ dataTemp.FiscalizacionPorHidrocarburoH.showNoData)

		

		$('#FiscalizacionHidrocarburosPorActividad').highcharts({
            chart: {
                type: typeHA.type,
                height: typeHA.height
            },
            title: {
				text: null,
				style: {
					color: '#555',
					'font-size': '1.2em'
				},
				margin: 30
			},
            subtitle: {
                text: null
            },
            xAxis: {
                categories: dataTemp.FiscalizacionHidrocarburosPorActividadH.categories,
                labels: {
					
					rotation: 0,
					align: typeHA.align,
					style: {
						'font-size': '9px'
					}
				}
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: null
                },

            },
            tooltip: {
               headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">Campos: {point.valor} </b></b></td>' +
                    '</tr>'+
                    '<tr>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                backgroundColor: '#ffffff'
            },
            plotOptions: {

                column: {
                    pointPadding: 0,
                    borderWidth: 0
                }
            },
            credits: { enabled: false },
			exporting: { enabled: false },
            series: [{
                name: ' ',
                color: '#f2733c',
                data: dataTemp.FiscalizacionHidrocarburosPorActividadH.obj
    
            }]
        });

		/*$.each(dataTemp.FiscalizacionHidrocarburosPorActividadH.series, function(k, v){
			var html,
				valor = dataTemp.FiscalizacionHidrocarburosPorActividadH.valor[k];
				cat = dataTemp.FiscalizacionHidrocarburosPorActividadH.categories[k];

			html = '<div class="box-label"><span class="category">'+cat+'</span><span class="valor"><p>'+valor+'</p></span><span class="percent">'+v+'%</span></div>'

			$('.FiscalizacionHidrocarburosPorActividad .graph-extra-lables').append(html);

		})
		$('.FiscalizacionHidrocarburosPorActividad .graph-extra-lables').addClass('boxes-by-'+dataTemp.FiscalizacionHidrocarburosPorActividadH.series.length)
		*/

		
		$('.FiscalizacionHidrocarburosPorActividad').addClass('data-bars-'+dataTemp.FiscalizacionHidrocarburosPorActividadH.obj.length + ' data-bars-'+ dataTemp.FiscalizacionHidrocarburosPorActividadH.showNoData)


		$('#FiscalizacionPorMIieral').highcharts({
            chart: {
                type: 'column'
            },
            title: {
				text: null,
				style: {
					color: '#555',
					'font-size': '1.2em'
				},
				margin: 30
			},
            subtitle: {
                text: null
            },
            xAxis: {
                categories: dataTemp.FiscalizacionPorMIieralM.categories,
                labels: {
					
					rotation: 0,
					align: 'right',
					style: {
						'font-size': '0'
					}
				}
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: null
                }
            },
            tooltip: {
               headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">Títulos: {point.valor} </b></b></td>' +
                    '</tr>'+
                    '<tr>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                backgroundColor: '#ffffff'
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                }
            },
            credits: { enabled: false },
			exporting: { enabled: false },
            series: [{
                name: ' ',
                color: '#f2361d',
                data: dataTemp.FiscalizacionPorMIieralM.obj,
    
            }]
        });
		$.each(dataTemp.FiscalizacionPorMIieralM.series, function(k, v){
			var html,
				valor = dataTemp.FiscalizacionPorMIieralM.valor[k];
				cat = dataTemp.FiscalizacionPorMIieralM.categories[k];

			html = '<div class="box-label"><span class="category">'+cat+'</span><span class="valor"><p>'+valor+'</p></span><span class="percent">'+v+'%</span></div>'

			$('.FiscalizacionPorMIieral .graph-extra-lables').append(html);

		})
		$('.FiscalizacionPorMIieral .graph-extra-lables').addClass('boxes-by-'+dataTemp.FiscalizacionPorMIieralM.series.length)
		$('.FiscalizacionPorMIieral').addClass('data-bars-'+dataTemp.FiscalizacionPorMIieralM.obj.length + ' data-bars-'+ dataTemp.FiscalizacionPorMIieralM.showNoData)
		



		$('#FiscalizacionMineralesPorActividad').highcharts({
            chart: {
                type: 'column'
            },
            title: {
				text: null,
				style: {
					color: '#555',
					'font-size': '1.2em'
				},
				margin: 30
			},
            subtitle: {
                text: null
            },
            xAxis: {
                categories: dataTemp.FiscalizacionMineralesPorActividadM.categories,
                labels: {
					
					rotation: 0,
					align: 'right',
					style: {
						'font-size': '0'
					}
				}
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: null
                }
            },
            tooltip: {
               headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">Títulos: {point.valor} </b></b></td>' +
                    '</tr>'+
                    '<tr>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                backgroundColor: '#ffffff'
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                }
            },
            credits: { enabled: false },
			exporting: { enabled: false },
            series: [{
                name: ' ',
                color: '#f2361d',
                data: dataTemp.FiscalizacionMineralesPorActividadM.obj
    
            }]
        });
		$.each(dataTemp.FiscalizacionMineralesPorActividadM.series, function(k, v){
			var html,
				valor = dataTemp.FiscalizacionMineralesPorActividadM.valor[k];
				cat = dataTemp.FiscalizacionMineralesPorActividadM.categories[k];

			html = '<div class="box-label"><span class="category">'+cat+'</span><span class="valor"><p>'+valor+'</p></span><span class="percent">'+v+'%</span></div>'

			$('.FiscalizacionMineralesPorActividad .graph-extra-lables').append(html);

		})
		$('.FiscalizacionMineralesPorActividad .graph-extra-lables').addClass('boxes-by-'+dataTemp.FiscalizacionMineralesPorActividadM.series.length)
		$('.FiscalizacionMineralesPorActividad').addClass('data-bars-'+dataTemp.FiscalizacionMineralesPorActividadM.obj.length + ' data-bars-'+ dataTemp.FiscalizacionMineralesPorActividadM.showNoData)
		




		$('#FiscalizacionPorTipoRecursoPorDepartamentoM').highcharts({
            chart: {
                type: 'column'
            },
            title: {
				text: null,
				style: {
					color: '#555',
					'font-size': '1.2em'
				},
				margin: 30
			},
            subtitle: {
                text: null
            },
            xAxis: {
                categories: dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.categories,
                type: 'category',
                labels: {
                    rotation: -90,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: null
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">Títulos Fiscalizados: {point.valor} </b></b></td>' +
                    '</tr>'+
                     '<tr><td style="padding:0">Títulos Vigentes: {point.vigentes} </b></b></td>' +
                    '</tr>'+
                    '<tr>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                backgroundColor: '#ffffff'
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                }
            },
            credits: { enabled: false },
			exporting: { enabled: false },
            series: [{
                name: ' ',
                color: '#f2361d',
                data: dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.obj,
                dataLabels: {
                   
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif',
                        textShadow: '0 0 3px black'
                    }
                }

    
            }]
        });
	
	$('.fisc-camp-type-dep[data-subtipo="M"]').addClass('data-bars-'+dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.obj.length + ' data-bars-'+ dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoM.showNoData)

	$('#FiscalizacionPorTipoRecursoPorDepartamentoH').highcharts({
            chart: {
                type: 'column'
            },
            title: {
				text: null,
				style: {
					color: '#555',
					'font-size': '1.2em'
				},
				margin: 30
			},
            subtitle: {
                text: null
            },
            xAxis: {
                categories: dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.categories,
                type: 'category',
                labels: {
                    rotation: -90,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: null
                }
            },
            tooltip: {
               headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">Campos Fiscalizados: {point.valor} </b></b></td>' +
                    '</tr>'+
                    '<tr><td style="color:padding:0">Campos Vigentes: {point.vigentes} </b></b></td>' +
                    '</tr>'+
                    '<tr>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                backgroundColor: '#ffffff'
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                }
            },
            credits: { enabled: false },
			exporting: { enabled: false },
            series: [{
                name: ' ',
                color: '#f2733c',
                data: dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.obj,
                dataLabels: {
                   
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif',
                        textShadow: '0 0 3px black'
                    }
                }
    
            }]
        });
		
		$('.fisc-camp-type-dep[data-subtipo="H"]').addClass('data-bars-'+dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.obj.length + ' data-bars-'+ dataTemp.FiscalizacionPorTipoRecursoPorDepartamentoH.showNoData)
	}
	
	return new Infographic()
})