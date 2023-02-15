define('app/network/Services', ['./urlsMap',
		'../storage/Storage',
		'app/utils/Modal',
		'lib/jquery/mockjax'
],
	function (
		urls,
		Storage,
		Modal
	) {
	    var DEBUG_MODE = !!$(document.body).attr('data-debug'),
            _factoryCacheObj = {***REMOVED***,
            ready = !DEBUG_MODE,
            queuedDebugQueries = [],
            appVersion = {***REMOVED***,
            // global ajax promise for projects
            projectsSearching,
            isIE = /*@cc_on!@*/false || testCSS('msTransform'),
            root = DEBUG_MODE ? '' : window.location.protocol + '//' + window.location.host
	    // root = 'http://172.16.78.69:29579'

	    window.appVersion = { Name: 'Mapa Regalias', Version: '0.3.2' ***REMOVED***;

	    //console.info(window.appVersion)

	    if (DEBUG_MODE) {

	        //For testing purposes ;)
	        //Filtros de búsqueda
	        require(['app/network/debugQueries'], function () {
	            ready = true
	            if (queuedDebugQueries.length) {
	                for (var i = 0; i < queuedDebugQueries.length; i++) {
	                    var promise = _get(queuedDebugQueries[i].url, queuedDebugQueries[i].data, queuedDebugQueries[i].callback, queuedDebugQueries[i].errorCb)
	                    if (queuedDebugQueries[i].cb)
	                        promise.done(queuedDebugQueries[i].cb)
	            ***REMOVED***
	        ***REMOVED***
	    ***REMOVED***)
	***REMOVED***


	    function testCSS(prop) {
	        return prop in document.documentElement.style;
	***REMOVED***


	    /**
         * Proxy function for easy comms
         * @param  {String***REMOVED***		url
         * @param  {Object***REMOVED***		data
         * @param  {Function***REMOVED***	callback
         * @param  {Function***REMOVED***	errorCb
         * @return {jQuery.ajax***REMOVED***
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
	            ***REMOVED***
	        ***REMOVED***)

	            //jQuery deffer success and error filters
	            request.pipe(
                        function (response, status) {
                            var modal
                            // console.log( response, status )
                            if (!response.status && status != 'abort') {
                                modal = Modal.error(response.message)
                                modal.show()
                                if ('console' in window) {
                                    //window.console.log(response.message)
                            ***REMOVED***
                        ***REMOVED*** else if (status != 'abort' && ('console' in window)) {
                                //window.console.log('Harmless Warning: Request Aborted')
                        ***REMOVED***
                            if (response.status && response.message) {
                                modal = Modal.info(response.message)
                                modal.show()
                        ***REMOVED***
                            return response.status
                      ***REMOVED***
                        function (response, status) {
                            var modal
                            if (!response.status && status != 'abort') {
                                if ('console' in window) {
                                    //window.console.log(response.message)
                            ***REMOVED***
                        ***REMOVED*** else if (status != 'abort' && ('console' in window)) {
                                //window.console.log('Harmless Warning: Request Aborted')
                        ***REMOVED***
                            if (response.message && status != 'abort') {
                                var modal = Modal.error(response.message)
                                modal.show()
                        ***REMOVED***
                            return !response.status
                    ***REMOVED***
                    )

	            request.fail(errorCb)
                    .error(errorCb)

	            if (callback) request.done(callback)

	            return request
	    ***REMOVED*** else {
	            queuedDebugQueries.push({
	                url: url,
	                data: data,
	                callback: callback,
	                errorCb: errorCb,
	                done: function (callback) {
	                    this.cb = this.cb || []
	                    this.cb.push(callback)
	            ***REMOVED***
	        ***REMOVED***)
	            return queuedDebugQueries[queuedDebugQueries.length - 1]
	    ***REMOVED***


	***REMOVED***

	    function _factoryCache(url, data) {
	        //Warning: IE7- has no JSON Object defined
	        var key = url + '::' + JSON.stringify(data)

	        if (_factoryCacheObj[key]) {
	            return true
	    ***REMOVED***

	        _factoryCacheObj[key] = true
	        return false
	***REMOVED***

	    function defaultErrorCb() {
	        //TODO error handling
	***REMOVED***

	    $(document).on('click', '.submenu a', function (e) {
	        e.preventDefault()
	        e.stopPropagation()

	        var thishref = $(this).attr('href'),
                dataValue = $(this).attr('data-value')

	        window.location.href = thishref

	        $('.map-container').attr('data-option-subtipo', 'fiscalizacion-option-subtipo-' + dataValue)

	        $('.buttons-filter-fiscalization a[data-value="' + dataValue + '"]').trigger('click')

	***REMOVED***)

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
	    ***REMOVED***

	        $('.filter-group[data-parameter=tipoRecursoNaturalFiscalizacion] .option[data-value="' + dataValue + '"]').trigger('click')


	***REMOVED***)

	    /*$(document).on('click', '.submenu li a', function(e){
            e.preventDefault()
            e.stopPropagation()
            
            $('#header .menu-item-fiscalizacion').trigger('click')
            $('.filter-group[data-parameter="tipoRecursoNaturalFiscalizacion"] .option[data-value="-1"]').trigger('click')
            $('#header .menu-item-fiscalizacion').trigger('click')
    
    ***REMOVED***)*/



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
         * @param  {String***REMOVED***   type        whether is departments,regions,municipalities
         * @param  {Function***REMOVED*** callback
         * @param  {Number***REMOVED***   lastUpdated the last date of modification
         */
	    function polygonsRequester(type, callback, polygonsData) {
	        var data = polygonsData && polygonsData.lastUpdated ?
			{ lastUpdated: polygonsData.lastUpdated ***REMOVED*** : {***REMOVED***

	        //console.log(urls[type])
	        _get(urls[type], data, function (responseJSON) {
	            if (responseJSON.geojson &&
                    responseJSON.geojson.features /*&&
				responseJSON.geojson.features.length*/ ) {
	                try {
	                    if (!isIE) {
	                        Storage.storeDataList(responseJSON)
	                        callback(Storage.getDataList(type))
	                ***REMOVED*** else {
	                        callback(responseJSON.geojson)
	                ***REMOVED***
	            ***REMOVED*** catch (e) {
	                    if ('console' in window) {
	                        //window.console.log('Harmless Warning: Quota Exceded!')
	                        //window.console.log('Harmless Warning: Quota exceded storing: ' + responseJSON )
	                ***REMOVED***
	                    if ('localStorage' in window)
	                        window.localStorage.clear()
	                    callback(responseJSON.geojson)
	            ***REMOVED***
	        ***REMOVED*** else {
	                callback(polygonsData)
	        ***REMOVED***
	    ***REMOVED***)
	        // callback(polygonsData)
	***REMOVED***

	    /**
         * Interface for common actions to handling the data request
         *
         * @param  {String***REMOVED***   type     flag for data type
         * @param  {Function***REMOVED*** callback
         */
	    function loadInterface(type, callback) {
	        var polygonsData = Storage.getDataList(type)
	        if (!polygonsData.features.length) {
	            polygonsRequester(type, callback)
	    ***REMOVED*** else {
	            polygonsRequester(type, callback, polygonsData)
	    ***REMOVED***
	***REMOVED***

	    /**
         * Loads the departments polygons data
         *
         * @param  {Function***REMOVED*** callback [description]
         */
	    function loadDepartments(callback) {
	        loadInterface('departments', callback)
	***REMOVED***

	    /**
         * Loads the regions polygons data
         *
         * @param  {Function***REMOVED*** callback [description]
         */
	    function loadRegions(callback) {
	        loadInterface('regions', callback)
	***REMOVED***

	    /**
         * Loads the municipalities polygons data
         *
         * @param  {Function***REMOVED*** callback [description]
         */
	    function loadMunicipalities(callback) {
	        loadInterface('municipalities', callback)
	***REMOVED***

	    function loadProjectFilters() {
	        return _get(urls.filtersProjects)
	***REMOVED***

	    function search(type, query, options) {
	        var json
	        options = options || {***REMOVED***
	        //console.warn(type, query, options)
	        if (type === 'Proyectos') {
	            if (options.isList) {
	                return _get(urls['searchProjectsList'], query);
	        ***REMOVED***
	            else {
	                return _get(urls['searchProjects'], query);
	        ***REMOVED***
	    ***REMOVED*** else if (type === 'Recursos') {
	            if (options.pushpins) {
	                return _get(urls['infoboxesResources'], query);
	        ***REMOVED***
	            else {
	                return _get(urls['searchResources'], query);
	        ***REMOVED***
	    ***REMOVED*** else if (type === 'Produccion') {
	            if (options.pushpins) {
	                return _get(urls['infoboxesProduction'], query);
	        ***REMOVED***
	            else {
	                return _get(urls['searchProduction'], query);
	        ***REMOVED***
	    ***REMOVED*** else if (type === 'Fiscalizacion') {
	            if (options.pushpins) {
	                return _get(urls['infoboxesFiscalizacion'], query);
	        ***REMOVED***
	            else {
	                return _get(urls['searchFiscalizacion'], query);
	        ***REMOVED***
	    ***REMOVED***
	***REMOVED***

	    function searchText(key) {
	        return _get(urls.texts, { id: key ***REMOVED***)
	***REMOVED***

	    function getConsolidated(paramsString) {
	        return _get(urls.consolidated, paramsString)
	***REMOVED***

	    function getBudgetList(params) {
	        return _get(urls.getBudget, params)
	***REMOVED***
	    function getDistributionList(params) {
	        return _get(urls.getDistribution, params)
	***REMOVED***
	    function getOutlayList(params) {
	        return _get(urls.getOutlay, params)
	***REMOVED***
	    function getAprovedList(params) {
	        return _get(urls.getAprovedProyects, params)
	***REMOVED***
	    function getExecutedList(params) {
	        return _get(urls.getExecuted, params)
	***REMOVED***
	    function getRegaliasList(params) {
	        return _get(urls.getRegalias, params)
	***REMOVED***
	    function getValueAproved(params) {
	        return _get(urls.getValueAproved, params)
	***REMOVED***
	    function getPerformance(params) {
	        return _get(urls.getPerformance, params)
	***REMOVED***

	    function getConsolidatedResources(paramsString) {
	        return _get(urls.consolidatedResources, paramsString)
	***REMOVED***

	    function getConsolidatedProduction(paramsString) {
	        return _get(urls.consolidatedProduction, paramsString)
	***REMOVED***

	    function getConsolidatedFiscalizacion(paramsString) {
	        return _get(urls.consolidatedFiscalizacion, paramsString)
	***REMOVED***

	    function getProductionInfo(paramsString) {
	        return _get(urls.getProductionInfo, paramsString)
	***REMOVED***
	    function getFieldInfo(url, paramsString) {
	        return _get(url, paramsString)
	***REMOVED***

	    function getProjectList(url) {
	        var split = url.split('?')
	        return _get(split[0], split[1])
	***REMOVED***

	    function sendByEmail(params) {
	        return _get(urls.sendByEmail, params)
	***REMOVED***

	    function getGraficaContratos(params) {
	        return _get(urls.getContratosPerAnyo, params)
	***REMOVED***

	    function getGraficaValorContratos(params) {
	        return _get(urls.getValorContratosPerAnyo, params)
	***REMOVED***
	    function getAnnioContratos(params) {
	        return _get(urls.getValorAnnioContratos, params)
	***REMOVED***

	    function getContratos(params) {
	        return _get(urls.getContratosContratista, params);
	***REMOVED***

	    function getGraficaContratosTipo(params) {
	        return _get(urls.getContratosPerTipo, params)
	***REMOVED***

	    function getAnnioContratosProyecto(params) {
	        return _get(urls.getAnnioContratosProyecto, params)
	***REMOVED***

	    return {
	        polygons: {
	            getDepartments: loadDepartments,
	            getRegions: loadRegions,
	            getMunicipalities: loadMunicipalities
	      ***REMOVED***

	        filters: {
	            forProjects: loadProjectFilters
	      ***REMOVED***

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
	      ***REMOVED***

	        production: {
	            productionInfo: getProductionInfo,
	            fieldInfo: getFieldInfo,
	            aproved: getAprovedList
	      ***REMOVED***

	        infograph: {
	            consolidated: getConsolidated,
	            resources: getConsolidatedResources,
	            production: getConsolidatedProduction,
	            fiscalizacion: getConsolidatedFiscalizacion
	      ***REMOVED***

	        contratista: {
	            getGraficaContratos: getGraficaContratos,
	            getGraficaValorContratos: getGraficaValorContratos,
	            getGraficaContratosTipo: getGraficaContratosTipo,
	            getAnnioContratos: getAnnioContratos,
	            getContratos: getContratos,
	            getAnnioContratosProyecto: getAnnioContratosProyecto
	      ***REMOVED***
	        projectsList: getProjectList,

	        sendByEmail: sendByEmail,

	        texts: searchText

	***REMOVED***
	***REMOVED***);
require([
    'comunes',
    'app/network/Services',
    'app/network/urlsMap'
],
    function (
        comunes,
        Services,
        urlsMap
    ) {

        var contratos_anyo_data = undefined;
        var contratos_valor_data = undefined;
        var contratos_tipo_local = undefined;
        var contratos_tipo_regional = undefined;
        var contratos_tipo_all = undefined;

        var contratistaData = JSON.parse(document.body.getAttribute('data-contratista'));
        var ruc_contratista = null;

        if (contratistaData != null && contratistaData != undefined && contratistaData.length > 0) {
            ruc_contratista = contratistaData[0].contratista_id;
    ***REMOVED***

        var done_graficas = 0;
        var cant_graficas = 5;
        var cant_contratos = 5;
        var scrol = 0;


        inicializaDatos();

        function inicializaDatos() {


            getAnnio();


    ***REMOVED***


        function getGraficasAll() {
            if (ruc_contratista != undefined && ruc_contratista != null && ruc_contratista != "") {
                getInfoGraficaContratosPerAnyo("ruc=" + ruc_contratista);
                getInfoGraficaValorContratosPerAnyo("ruc=" + ruc_contratista);
                getGraficaContratosTipoLocal("GOBIERNO LOCAL");
                getGraficaContratosTipoRegional("GOBIERNO REGIONAL");
                getGraficaContratosTipoRegionalLocal("NIVEL LOCAL Y REGIONAL");
        ***REMOVED***



    ***REMOVED***

        function configuraEnlaceContratista() {
            $(".enlace_contratista").click(function () {
                var ruc = $(this).attr('data-parameter');
                var dataValue = $(this).attr('data-parameter'),
                    dataType = $(this).attr('data-type').toLowerCase();
                document.cookie = "ruc=" + ruc + ";path=/;";
                var url = "/contratista/contratistaprofile?" + dataType + "=" + dataValue;
                window.location.href = url;

        ***REMOVED***);


    ***REMOVED***

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    ***REMOVED***

        function getInfoGraficaContratosPerAnyo(param) {
            $("#divGraphContratosCantidad").html("");
            $("#divContenedorContratosCantidad").css("display", "none");

            $("#divGraphContratosCantidadCa").css("display", "");

            Services.contratista.getGraficaContratos(param)
                .done(function (data) {
                    $("#divGraphContratosCantidad").html("");
                    $("#divGraphContratosCantidadCa").css("display", "none");

                    contratos_anyo_data = data.ContratosPerAnyo;

                    if (contratos_anyo_data != undefined && contratos_anyo_data.length > 0) {
                        $("#secCantidadContrato").css("display", "");
                        $("#divContenedorContratosCantidad").css("display", "");
                        $("#divGraphContratosCantidad").css("display", "");
                        barra_vertical("divGraphContratosCantidad", contratos_anyo_data, "CANTIDAD DE CONTRATOS POR AÑO", "#0382B9", "Contratos");
                ***REMOVED*** else {
                        $("#secCantidadContrato").css("display", "none");
                        $("#divContenedorContratosCantidad").css("display", "none");
                ***REMOVED***
            ***REMOVED***);

    ***REMOVED***

        function getInfoGraficaValorContratosPerAnyo(param) {
            $("#divGraphContratosValor").html("");
            $("#divContenedorContratosValor").css("display", "none");

            $("#divGraphContratosValorCa").css("display", "");


            $("#secValorContrato").css("display", "");
            $("#divContenedorContratosValor").css("display", "");

            Services.contratista.getGraficaValorContratos(param)
                .done(function (data) {
                    $("#divGraphContratosValor").html("");
                    $("#divGraphContratosValorCa").css("display", "none");

                    contratos_valor_data = data.ContratosPerAnyo;

                    if (contratos_valor_data != undefined && contratos_valor_data.length > 0) {
                        $("#secValorContrato").css("display", "");
                        $("#divContenedorContratosValor").css("display", "");
                        $("#divGraphContratosValor").css("display", "");
                        barra_vertical("divGraphContratosValor", contratos_valor_data, "VALOR DE CONTRATOS POR AÑO", "#C51B4C", "Monto");
                ***REMOVED*** else {
                        $("#secValorContrato").css("display", "none");
                        $("#divContenedorContratosValor").css("display", "none");

                ***REMOVED***
                   
            ***REMOVED***);

    ***REMOVED***

        function getGraficaContratosTipoLocal() {
            $("#divGraphTipoLocal").html("");
            $("#divGraphTipoLocalCa").css("display", "");
            $("#divGraphTipoLocalNo").css("display", "none");

            var tipo = "GOBIERNO LOCAL";
            var current_period = $("#top_contratista_periodos").val();
            var filtros = {
                ruc: ruc_contratista,
                periodo: current_period,
                tipo: tipo
        ***REMOVED***;
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: urlsMap.getContratosPerTipo,
                cache: false,
                data: JSON.stringify(filtros),
                success: function (result) {
                    if (result.status == true) {
                        $("#divGraphTipoLocal").html("");
                        done_graficas += 1;

                        var contratos_tipo_local = result.ContratosPerAnyo;
                        $("#divGraphTipoLocalCa").css("display", "none");
                        if (contratos_tipo_local != undefined && contratos_tipo_local.length > 0) {
                            donut_percent("divGraphTipoLocal", contratos_tipo_local, "porc", tipo);
                    ***REMOVED*** else {
                            $("#divGraphTipoLocalNo").css("display", "");
                    ***REMOVED***

                ***REMOVED*** else {
                        alert(result.message);
                ***REMOVED***

              ***REMOVED***
                error: function (response) {
                    alert(response.responseText);
              ***REMOVED***
                failure: function (response) {
                    alert(response.responseText);
            ***REMOVED***
        ***REMOVED***);

    ***REMOVED***

        function getGraficaContratosTipoRegional() {
            $("#divGraphTipoRegional").html("");
            $("#divGraphTipoRegionalCa").css("display", "");
            $("#divGraphTipoRegionalNo").css("display", "none");

            var tipo = "GOBIERNO REGIONAL";
            var current_period = $("#top_contratista_periodos").val();
            var filtros = {
                ruc: ruc_contratista,
                periodo: current_period,
                tipo: tipo
        ***REMOVED***;
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: urlsMap.getContratosPerTipo,
                cache: false,
                data: JSON.stringify(filtros),
                success: function (result) {
                    if (result.status == true) {
                        $("#divGraphTipoRegional").html("");
                        done_graficas += 1;

                        var contratos_tipo_regional = result.ContratosPerAnyo;
                        $("#divGraphTipoRegionalCa").css("display", "none");
                        if (contratos_tipo_regional != undefined && contratos_tipo_regional.length > 0) {
                            donut_percent("divGraphTipoRegional", contratos_tipo_regional, "porc", tipo);
                    ***REMOVED*** else {
                            $("#divGraphTipoRegionalNo").css("display", "");
                    ***REMOVED***

                ***REMOVED*** else {
                        alert(result.message);
                ***REMOVED***

              ***REMOVED***
                error: function (response) {
                    alert(response.responseText);
              ***REMOVED***
                failure: function (response) {
                    alert(response.responseText);
            ***REMOVED***
        ***REMOVED***);

    ***REMOVED***

        function getGraficaContratosTipoRegionalLocal() {
            $("#divGraphTipoLocalReg").html("");
            $("#divGraphTipoLocalRegCa").css("display", "");
            $("#divGraphTipoLocalRegNo").css("display", "none");

            var tipo = "NIVEL LOCAL Y REGIONAL"
            var current_period = $("#top_contratista_periodos").val();
            var filtros = {
                ruc: ruc_contratista,
                periodo: current_period,
                tipo: tipo
        ***REMOVED***;
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: urlsMap.getContratosPerTipo,
                cache: false,
                data: JSON.stringify(filtros),
                success: function (result) {
                    if (result.status == true) {
                        $("#divGraphTipoLocalReg").html("");
                        done_graficas += 1;

                        var contratos_tipo_all = result.ContratosPerAnyo;
                        $("#divGraphTipoLocalRegCa").css("display", "none");
                        if (contratos_tipo_all != undefined && contratos_tipo_all.length > 0) {
                            donut_percent("divGraphTipoLocalReg", contratos_tipo_all, "porc", "GOBIERNO REGIONAL + LOCAL");
                    ***REMOVED*** else {
                            $("#divGraphTipoLocalRegNo").css("display", "");
                    ***REMOVED***

                ***REMOVED*** else {
                        alert(result.message);
                ***REMOVED***

              ***REMOVED***
                error: function (response) {
                    alert(response.responseText);
              ***REMOVED***
                failure: function (response) {
                    alert(response.responseText);
            ***REMOVED***
        ***REMOVED***);

    ***REMOVED***

        function barra_vertical(div_contenedor, data_contenido, titulo, color, etiqueta) {
            var peso_pais = "";
            if (etiqueta == "" || etiqueta == null) {
                etiqueta = "Contratos";
        ***REMOVED*** else {
                if (etiqueta.toUpperCase() == "MONTO") {
                    peso_pais = "L";
            ***REMOVED***
        ***REMOVED***

            var current_period = $("#top_contratista_periodos").val();
            var myData = data_contenido;

            var minimo = 0;
            var maximo = 0;

            if (myData.length > 0) {
                maximo = d3.max(myData, function (d) { return d.rawValue; ***REMOVED***);
                minimo = d3.min(myData, function (d) { return d.rawValue; ***REMOVED***);
        ***REMOVED***

            var svg = d3.select("#" + div_contenedor),
                margin = { top: 20, right: 20, bottom: 30, left: 75 ***REMOVED***;

            var bounds = svg.node().getBoundingClientRect(),
                width = bounds.width - margin.left - margin.right,
                height = bounds.height - margin.top - margin.bottom;

            var x_legend = true;
            var x_pos_texto = 15;


            let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;

            if (isMobile) {
                x_legend = false;
        ***REMOVED***


            var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("display", "none")
                .style("background", "#FFF")
                .style("border", "1px solid #6F257F")
                .style("width", "auto")
                .style("padding", "5px")
            //.text("Monto Autorizado");

            var x = d3.scaleBand().rangeRound([0, width]).padding(0.4),
                y = d3.scaleLinear().rangeRound([height, 0], 0.1);

            var colours = d3.scaleOrdinal()
                .range(["#6F257F", "#CA0D59"]);

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(myData.map(function (d) { return d.label; ***REMOVED***));
            y.domain([0, d3.max(myData, function (d) { return d.rawValue; ***REMOVED***)]);


            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

           


            g.append("g")
                .attr("class", "axis axis--y")
                .attr("class", "ejeGris")
                .call(d3.axisLeft(y).ticks(5).tickFormat(function (d) {
                    if (minimo > 1000000) {
                        return parseFloat(d / 1000000) + " M";
                ***REMOVED***
                    else {
                        return d;
                ***REMOVED***

            ***REMOVED***).tickSizeInner([-width]))



            g.selectAll(".bar")
                .data(myData)
                .enter().append("rect")
                .attr("x", function (d) { return x(d.label); ***REMOVED***)
                .attr("y", function (d) { return y(d.rawValue); ***REMOVED***)
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.rawValue); ***REMOVED***)
                .attr("fill", function (d) {
                    return d.label.toString() == current_period ? color : "#CCCCCC";
            ***REMOVED***)
                .on("mouseover", function (d) {
                    var valor = d.rawValue;
                    if (d.rawValue != undefined) {
                        valor = (d.rawValue).formatMoney(2, '.', ',');
                ***REMOVED***

                    tooltip.html(etiqueta + "<br> " + peso_pais + " " + valor.toString()); return tooltip.style("display", "");
            ***REMOVED***)
                .on("mousemove", function () {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            ***REMOVED***)
                .on("mouseout", function () {
                    return tooltip.style("display", "none");
            ***REMOVED***);



    ***REMOVED***



        Number.prototype.formatMoney = function (c, d, t) {
            var n = this,
                c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d == undefined ? "." : d,
                t = t == undefined ? "," : t,
                s = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    ***REMOVED***;


        function donut_percent(div_contenedor, data_contenido, tipo_dato, etiqueta) {

            //grafica porcentajes empleo
            //tipo_dato: porc o value
            //tipo_etiq: lateral, bottom 
            var data = data_contenido;
            var text = "";
            var donutWidth = 20;
            var width = 260;
            var height = 200;
            var duration = 750;


            var radius = Math.min(width, height) / 2;
            var color = d3.scaleOrdinal(['#07C08E', '#FFBB01', '#049EDF']);
            if (div_contenedor == "divGraphTipoLocal") {
                color = d3.scaleOrdinal(['#07C08E']);
        ***REMOVED***
            if (div_contenedor == "divGraphTipoRegional") {
                color = d3.scaleOrdinal(['#FFBB01']);
        ***REMOVED***
            if (div_contenedor == "divGraphTipoLocalReg") {
                color = d3.scaleOrdinal(['#049EDF']);
        ***REMOVED***

            var svg = d3.select("#" + div_contenedor)
                .append('svg')
                .attr('class', 'pie')
                .attr('width', width)
                .attr('height', 230);

            var g = svg.append('g')
                .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

            var arc = d3.arc()
                .innerRadius(radius - donutWidth)
                .outerRadius(radius);

            var smallarc = d3.arc()
                .innerRadius(radius - 8)
                .outerRadius(radius);



            var pie = d3.pie()
                .value(function (d) { return d.rawValue; ***REMOVED***)
                .sort(null);

            var path = g.selectAll('path')
                .data(pie(data))
                .enter()
                .append("g")
                .append('path')
                .attr('d', arc)
                .style("opacity", function (d, i) { return i == 1 ? 0.5 : 1; ***REMOVED***)
                .attr('fill', function (d, i) {
                    if (d.data.label == "9999") {
                        return "#D6D6D6";
                ***REMOVED*** else {
                        return color(cambiarTipoTexto(d.data.label));
                ***REMOVED***

            ***REMOVED***)
                .each(function (d, i) {
                    this._current = i;
            ***REMOVED***);

            path.transition()
                .duration(1000)
                .attrTween('d', function (d) {
                    var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 ***REMOVED***, d);
                    return function (t) {
                        if (d.data.label == "9999") {
                            return smallarc(interpolate(t));
                    ***REMOVED*** else {
                            return arc(interpolate(t));
                    ***REMOVED***

                ***REMOVED***;
            ***REMOVED***);



            var restOfTheData = function () {
                var text = g.selectAll('text')
                    .data(pie(data))
                    .enter()
                    .append("text")
                    .attr("font-size", "2em")
                    .attr("fill", "#049EDF")
                    .transition()
                    .duration(200)
                    .attr("transform", function (d) {
                        return "translate(" + 0 + ")";
                ***REMOVED***)
                    .attr("dy", ".4em")
                    .attr("text-anchor", "middle")
                    .text(function (d, i) {
                        if (i == 0) {
                            if (tipo_dato == "porc") {
                                return (d.data.value * 1).toFixed(2) + "%";
                        ***REMOVED*** else {
                                return (d.data.value);
                        ***REMOVED***
                    ***REMOVED***

                ***REMOVED***)
        ***REMOVED***;

            setTimeout(restOfTheData, 1000);
            //habilitaPeriodo();
    ***REMOVED***


        function cambiarTipoTexto(cadena) {
            return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
    ***REMOVED***


        function getAnnio() {
            //debugger;
            var params_usu = { "ruc": ruc_contratista ***REMOVED***;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/serviciosContratistas/GetAnniosContratosByRUC",
                cache: false,
                data: params_usu,
                success: function (data) {
                    deshabilita(true);
                    //alert(JSON.stringify(data));

                    var items_result = data.Detalles;
                    var annios = [];
                    var select = "";
                    for (var i = 0; i < items_result.length; i++) {

                        if (!annios.includes(items_result[i].valor.toString())) {
                            annios.push(items_result[i].valor.toString());
                            select = select + '<option value="' + items_result[i].valor.toString() + '">' + items_result[i].valor.toString() + '</option>';
                    ***REMOVED***

                ***REMOVED***

                    $('#top_contratista_periodos').html(select).fadeIn();
                    if (items_result.length > 0) {
                        $("#top_contratista_periodos").val(items_result[items_result.length - 1].valor.toString());
                        $("#top_contratista_periodos").attr("default", items_result[items_result.length - 1].valor.toString());
                        getContratos($("#top_contratista_periodos option:selected").text(), ruc_contratista, 1, cant_contratos);
                        getGraficasAll();
                ***REMOVED*** else {
                        $("#srcContratos").html("");
                        var fila = '<div class="contractBox" >'
                          + '<div class="contractNumber"><span class="text-bold">No se encuentran resultados con los filtros solicitados</span></div>'
                          + '</div>';

                        $("#srcContratos").html(fila);
                ***REMOVED***
              ***REMOVED***
                error: function (response) {
                    //alert(response.responseText);
              ***REMOVED***
                failure: function (response) {
                    //alert(response.responseText);
            ***REMOVED***
        ***REMOVED***);

    ***REMOVED***

        var disableClick = false;
        function deshabilita(des) {
            disableClick = des;
            if (des) {
                $("#btn-buscar").prop("disabled", des);
                $('#btnLimpiar').attr("disabled", "disabled")
        ***REMOVED*** else {
                $("#btn-buscar").prop("disabled", des);
                $('#btnLimpiar').removeAttr("disabled")
        ***REMOVED***
    ***REMOVED***

        $("#btnLimpiar").click(function () {
            if (!disableClick) {
                $("#top_contratista_periodos").val($("#top_contratista_periodos").attr("default"));
                deshabilita(true);
                getContratos($("#top_contratista_periodos option:selected").text(), ruc_contratista, 1, cant_contratos);
        ***REMOVED***
    ***REMOVED***);

        $("#btn-buscar").click(function () {
            if (!disableClick) {
                deshabilita(true);
                getContratos($("#top_contratista_periodos option:selected").text(), ruc_contratista, 1, cant_contratos);
                getGraficasAll();
        ***REMOVED***

    ***REMOVED***);


        function dibujaPaginacionContrato(actual, total, totalPag, cant_por_pag) {
            var pag_actual = parseInt(actual);
            pagina_actual = pag_actual;
            var pagesHTML = '';
            $("#divPagContratos").empty();
            var divPag = d3.select("#divPagContratos")
            if (pag_actual > 1 && total >= cant_por_pag) {
                var pag_enlace = divPag.append("a")
                .attr("id", "page_left")
                .attr("class", "pull-left")
                .attr("data-page", pag_actual - 1)
                pag_enlace.append("span")
                .attr("class", "glyphicon glyphicon-arrow-left")
                pag_enlace.append("text")
                .text(" Anterior")
        ***REMOVED***
            divPag.append("span")
           .attr("class", "totalpages")
           .text("Página " + actual + " de " + totalPag)

            if (pag_actual < totalPag) {
                if ((total - (pag_actual * cant_por_pag)) > 0) {
                    var pag_enlace_der = divPag.append("a")
                    .attr("id", "page_right")
                    .attr("class", "pull-right")
                    .attr("data-page", pag_actual + 1)
                    .text("Próximo ")
                    pag_enlace_der.append("span")
                    .attr("class", "glyphicon glyphicon-arrow-right")
            ***REMOVED***
        ***REMOVED***

            $('#page_right,#page_left').bind('click', function () {
                d3.select("#divProyectos").empty();
                pagina_actual = $(this).attr("data-page");
                getContratos($("#top_contratista_periodos option:selected").text(), ruc_contratista, pagina_actual, cant_por_pag);
        ***REMOVED***);

    ***REMOVED***

        function getContratos(annio, ruc, pagina, registros) {


            var filtros = {
                Annio: annio,
                RUC: ruc,
                NumeroPagina: pagina,
                RegistrosPorPagina: registros,
                IdProyecto: null,
                NombreContratista: null,
                IdPrograma: null,
                COVID19: null

        ***REMOVED***;
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: '/api/serviciosContratistas/GetInformacionContratosPorFiltros',
                cache: false,
                data: JSON.stringify(filtros),
                success: function (result) {
                    if (result.status == true) {
                        if (result.CantidadTotalRegistros > 0) {
                            var info = result.listInformacion;
                            var proceso = "";
                            var referencia = "";
                            var adjudicacion = "";
                            var invitados = "";
                            var data = "";
                            var fila = "";
                            var inicioLuis = '<div class="contractBox">';
                            var finLuis = '</div>';
                            var inicio = "";
                            var fin = "";
                            $("#srcContratos").html("");
                            for (var i = 0; i < info.length; i++) {
                                if (proceso != info[i].CodigoProceso.toString()) {
                                    if (i > 0) //Cambio de proceso
                                    {
                                        //fin = '<div class="row text-center">'
                                        //    + '<div class="col-xs-12 col-md-12"><a href="' + referencia + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                        //    + '</div></div>';
                                        data += inicioLuis + inicio + fila + finLuis + fin + '</div></div>' + finLuis;
                                        fila = "";
                                        inicio = "";
                                        fin = "";
                                ***REMOVED***
                                   // referencia = info[i].DocURL.toString();
                                    adjudicacion = info[i].UrlResumenAdjudicacion;
                                    invitados = info[i].UrlInvitados;
                                    inicio = '<div class="contractNumber"><span class="">Código proceso: </span> <span class="text-bold">' + info[i].CodigoProceso.toString() + '</span></div>'
                                        + ' <div class="wrap-head-process">'
                                        + '     <div class="cotractName">'
                                        + '         <div class="row">'
                                        + '             <div class="col-xs-12 col-md-12">'
                                        + '                 <span class="small">PROCESO</span><div class="clearfix"></div>'
                                        + '                 <span class="h4">' + info[i].DescripcionProceso.toString() + '</span>'
                                        + '             </div>'
                                        + '         </div>'
                                        + '     </div>'
                                        + '     <div class="cotractName">'
                                        + '         <div class="row">'
                                        + '             <div class="col-xs-8 col-md-8">'
                                        + '                 <span class="small"> INSTITUCIÓN</span><div class="clearfix"></div>'
                                        + '                 <span class="h4">' + info[i].UnidadCompra.toString() + '</span>'
                                        + '             </div>'
                                        + '         </div>'
                                        + '     </div>';
                                        inicio += '<div class="contractData">';
                                        if (info[i].CategoriaContratacion || info[i].MetodoContratacion) {
                                            inicio += ''
                                            + '		<div class="row border-b">'
                                            + '			<div class="col-xs-6 col-md-8">';
                                            if (info[i].CategoriaContratacion) {
                                                inicio += '	<span class="txt_small">Categoria</span>'
                                                     + '	<span class="amount_adj">' + info[i].CategoriaContratacion.toString() + '</span>';
                                        ***REMOVED***
                                            inicio += '</div>	<div class="col-xs-6 col-md-4">';
                                            if (info[i].MetodoContratacion) {
                                                clasece = "";
                                                imgg = "";
                                                if (info[i].MetodoContratacion.toString() === "Contratación por Excepción") { clasece = "cemark"; imgg = '<img src="/content/img/covid/ic_CEorange.svg"  alt="CAUSAL EXCEPCIÓN">'; ***REMOVED***
                                                inicio += '				   <span class="txt_small">Tipo de Procedimiento</span>'
                                                + '				   <span class="amount_adj ' + clasece + '">' + imgg + ' ' + info[i].MetodoContratacion.toString() + ' </span>';
                                        ***REMOVED***
                                            inicio += '</div></div>'
                                            + '';
                                    ***REMOVED***



                                        inicio += ''
                                        + '         <div class="row border-b">'
                                        + '             <div class="col-xs-12 col-md-4"><span class="txt_small">Estado</span><span class="amount_adj">';
                                         if (info[i].EstadoProceso) { inicio += info[i].EstadoProceso.toString(); ***REMOVED***
                                         inicio += '</span></div>'
                                        + '             <div class="col-xs-6 col-md-4"><span class="txt_small"></span><span class="amount_adj"></span></div>' //Monto Estimado ' + (info[i].MontoEstimadoProceso * 1).formatMoney(2, '.', ',').toString() + '
                                        + '             <div class="col-xs-6 col-md-2"><span class="txt_small"></span><span class="amount_adj"></span></div>' //Moneda L
                                        + '         </div>';
                                       

                                        if (adjudicacion && invitados) {
                                            inicio += ''
                                                 + '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-2"><div class="btn btn-outlined"><a href="' + info[i].UrlResumenAdjudicacion.toString() + '" target="_blank"> Ver adjudicación <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><div class="btn btn-outlined"><a href="' + info[i].UrlInvitados.toString() + '" target="_blank"> Ver invitados <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-12 col-md-5"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        if (!adjudicacion && invitados) {
                                            inicio += ''
                                                 + '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-2"><div class="btn btn-outlined"><a href="' + info[i].UrlInvitados.toString() + '" target="_blank"> Ver invitados <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '             <div class="col-xs-12 col-md-5"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        if (adjudicacion && !invitados) {
                                            inicio += ''
                                                 + '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-2"><div class="btn btn-outlined"><a href="' + info[i].UrlResumenAdjudicacion.toString() + '" target="_blank"> Ver adjudicación <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '             <div class="col-xs-12 col-md-5"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        inicio += '     </div>'
                                        + ' </div>'
                                        + ' <div class="related-contracts">'
                                        + '     <span class="h4">Contratos asociados a este proceso:</span>'
                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                                    proceso = info[i].CodigoProceso.toString();
                            ***REMOVED***
                               // if (info[i].CodigoContrato){
                                fila += '<div class="panel panel-default">'
                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                    + '                <h4 class="panel-title">'
                                    + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';
                                if (info[i].COVID19 === 1 || info[i].COVID19 === 2) { fila += '                        <span class="badge"><img src="../../../content/img/covid/ic_mini.png" alt="iconoCOVID"> Covid-19</span>'; ***REMOVED***
                                if (info[i].CodigoContrato) { fila += '                        Código de contratación:  ' + info[i].CodigoContrato.toString() + ''; ***REMOVED*** else { fila += '                      Pendiente emisión código contratación  ' ***REMOVED***
                                    fila += '                    </a>'
                                   + '                </h4>'
                                   + '            </div>'
                                   + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                                   + '                <div class="panel-body">'
                                   + '                    <div class="row border-b">'
                                   + '                        <div class="col-md-6">'
                                   + '                            <span class="small"> RAZON SOCIAL</span>'
                                   + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].numerodocumento.toString() + '"><span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span>' + info[i].Contratista.toString() + '</span></a>'
                                   + '                        </div>'
                                   + '                        <div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipodocumento.toString() + '</span></div>'
                                   + '                        <div class="col-md-3"><span class="small"> Número de documento</span><span class="amount_adj">' + info[i].numerodocumento.toString() + '</span></div>'
                                   + '                    </div>'
                                   + '                    <div class="row border-b">'
                                   + '                        <div class="col-xs-8 col-md-3"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj">' + ((info[i].ValorContrato * 1)/1000000).formatMoney(0, ',', '.').toString() + ' Millones</span></div>' //RD ' + (info[i].MontoContratadoTotalContrato * 1).formatMoney(2, '.', ',').toString() + ' 
                                   + '                        <div class="col-xs-4 col-md-3"><span class="small"> MONEDA</span><span class="amount_adj">L</span></div>' //DOP 
                                   + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                                    if (info[i].FechaInicioContrato) { fila += ' Fecha de INICIO CONTRATO'; ***REMOVED***
                                    fila += '</span><span class="amount_adj">';
                                    if (info[i].FechaInicioContrato) { fila += info[i].FechaInicioContrato.toString().substr(0, 10); ***REMOVED***

                                    fila += ' </span></div>'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                                    if (info[i].FechaFinContrato) { fila += 'Fecha de FIN CONTRATO'; ***REMOVED***
                                    fila += '</span><span class="amount_adj"> ';
                                    if (info[i].FechaFinContrato) { fila += info[i].FechaFinContrato.toString().substr(0, 10); ***REMOVED***

                                    fila += ' </span></div>'
                                   + '                    </div>';

                                   
                                    if (info[i].OfertaPeriodoDuracion || info[i].FechaPublicacion) {
                                        fila += '                    <div class="row border-b">'
                                        + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                                        if (info[i].OfertaPeriodoDuracion) { fila += info[i].OfertaPeriodoDuracion.toString(); ***REMOVED***

                                        fila += '                   Días</span></div>';

                                        fila += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                                        if (info[i].FechaPublicacion !== null && info[i].FechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                            fila += info[i].FechaPublicacion.toString().substr(0, 10) + '</span></div>';
                                    ***REMOVED***
                                        else {
                                            fila += '</span></div>';
                                    ***REMOVED***

                                        fila += '                    </div>';

                                ***REMOVED***

                                fila += '                    '
                                    + '                </div>'
                                    + '               <div class="panel-footer" style="align:center">';
                                    if (info[i].DocURL) {
                                        fila += '                    <div class="btn btn-outlined"><a href="' + info[i].DocURL.toString() + '" target="_blank"> Ver más de este contrato <span class="glyphicon glyphicon-arrow-right"></span></a></div>';
                                ***REMOVED***
                                    if (info[i].CodigoContrato) {
                                        fila += '                    <a href="../../../contratista/contratoprofile/?CodigoContrato=' + info[i].CodigoContrato.toString() + '" class="btn btn-primary btn-primary btn-participe"><span class="glyphicon glyphicon-comment"></span> Hacer comentario al contrato</a>';
                                ***REMOVED***
                                    fila += '       </div>'
                                    + '            </div>'
                                    + '        </div>';
                                //+ '  </div>';
                        ***REMOVED***
                            data += inicioLuis + inicio + fila + '</div></div>' + finLuis;
                            //data += '<div class="row text-center">'
                            //    + '<div class="col-xs-12 col-md-12"><a href="' + referencia + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                            //    + '</div></div>' + finLuis;

                            $("#srcContratos").html(data);
                             if (scrol >= 1) {
                                 $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top ***REMOVED***, 2000);
                         ***REMOVED*** else { scrol = scrol + 1; ***REMOVED***
                            dibujaPaginacionContrato(pagina, result.CantidadTotalRegistros, Math.ceil(result.CantidadTotalRegistros / registros), registros);
                            configuraEnlaceContratista();
                    ***REMOVED***
                        else {
                            $("#srcContratos").html("");
                            var fila = '<div class="contractBox" >'
                                + '<div class="contractNumber"><span class="text-bold">No se encuentran resultados con los filtros solicitados</span></div>'
                                + '</div>';
                            $("#srcContratos").html(fila);
                    ***REMOVED***
                ***REMOVED*** else {
                        alert("Message: " + result.message);
                ***REMOVED***
                    deshabilita(false);
             ***REMOVED***
                error: function (response) {
                    deshabilita(false);
                    alert(response.responseText);
              ***REMOVED***
                failure: function (response) {
                    deshabilita(false);
                    alert(response.responseText);
            ***REMOVED***
        ***REMOVED***);

    ***REMOVED***

        function timeLine(div, data) {
            var widthW = 0;
            var radio = 5;
            widthW = $('#' + div).innerWidth();

            // Create a color scale
            var color = d3.scaleOrdinal()
              .domain(["V", "I", "D", "F"])
              .range(["#CC6600", "#00AA00", "#404040", "#aa0000"])


            var margin = { top: 10, right: 50, bottom: 0, left: 50 ***REMOVED***,
                width = widthW - margin.left - margin.right,
                height = 40 - margin.top - margin.bottom;

            // parse the date / time
            var parseTime = d3.timeParse("%Y-%m-%d");

            // set the ranges
            var x = d3.scaleTime().range([0, width - 5]).domain(data.map(function (d) { return d.date ***REMOVED***));


            // append the svg obgect to the body of the page
            var svg = d3.select('#' + div).append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom + 30)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            // format the data
            data.forEach(function (d) {
                d.date = parseTime(d.date);
        ***REMOVED***);

            // Scale the range of the data
            x.domain(d3.extent(data, function (d) { return d.date; ***REMOVED***));


            // Add the X Axis
            svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + (height + 5) + ")")
                .call(d3.axisBottom(x).tickValues(TickFunc(data)).tickFormat(d3.timeFormat("%d/%m/%y")))
                .selectAll("text")
                .attr("transform", "rotate(0)");



            var chart1 = svg.selectAll('.axis .axis--x .tick')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', function (d) { return radio + 1.5 ***REMOVED***) // visit duration
                .attr('cy', 20) // centers circle
                .attr('cx', function (d) { return x(d.date); ***REMOVED***) // not final. Should be aligned to x axis time
                .style("fill", function (d) { return color(d.group) ***REMOVED***)
            ;

            var chart2 = svg.selectAll('.axis .axis--x .tick')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', function (d) { return radio ***REMOVED***)
                .attr('cy', 20)
                .attr('cx', function (d) { return x(d.date); ***REMOVED***)
                .style("fill", function (d) { return color(d.group) ***REMOVED***)
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .attr("fill-opacity", .4);


            var value = svg.selectAll('.axis .axis--x .tick')
                         .data(data)
                         .enter()
                         .append("text")
                         .attr("font-size", "0.6em")
                         .attr("fill", function (d) { return color(d.group) ***REMOVED***)
                          .attr('y', 0)
                         .attr('x', function (d) { return x(d.date); ***REMOVED***)
                         .attr("text-anchor", "middle")
                         .text(function (d) { return d.value; ***REMOVED***);

            var textUp = svg.selectAll('.axis .axis--x .tick')
                        .data(data)
                        .enter()
                        .append("text")
                        .attr("font-size", "0.6em")
                        .attr("fill", "#404040")
                         .attr('y', 10)
                        .attr('x', function (d) { return x(d.date); ***REMOVED***)
                        .attr("text-anchor", "middle")
                        .text(function (d) { return d.textUp; ***REMOVED***);

            var textDown = svg.selectAll('.axis .axis--x .tick')
                        .data(data)
                        .enter()
                        .append("text")
                        .attr("font-size", "0.6em")
                        .attr("fill", "#404040")
                         .attr('y', 37)
                        .attr('x', function (d) { return x(d.date); ***REMOVED***)
                        .attr("text-anchor", "middle")
                        .text(function (d) { return d.textDown; ***REMOVED***);

            function TickFunc(d) {
                var times = [];
                for (var i = 0; i < d.length; i++) {
                    times.push(new Date(d[i].date));
            ***REMOVED***
                return times;
        ***REMOVED***

            function TitleFunc(d) {
                var title = [];
                for (var i = 0; i < d.length; i++) {
                    title.push(d[i].title);
            ***REMOVED***
                return title;
        ***REMOVED***

    ***REMOVED***




        return {

            getInfoGraficaContratosPerAnyo: getInfoGraficaContratosPerAnyo,
            getInfoGraficaValorContratosPerAnyo: getInfoGraficaValorContratosPerAnyo,
            getGraficaContratosTipoLocal: getGraficaContratosTipoLocal,
            getGraficaContratosTipoRegional: getGraficaContratosTipoRegional,
            getGraficaContratosTipoRegionalLocal: getGraficaContratosTipoRegionalLocal




    ***REMOVED***;
***REMOVED***
);
define("contratista_aux", function () { ***REMOVED***);