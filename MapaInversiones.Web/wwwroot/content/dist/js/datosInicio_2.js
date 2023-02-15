var departamentos_ini = JSON.parse(document.body.getAttribute('data-deparmentProjectData'));
var municipios_ini = JSON.parse(document.body.getAttribute('data-municipioProjectData'));
var proyectos_ini = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));
var anyo = (new Date).getFullYear() - 1;
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
total_number = 0;
var total_pages = 0;
var lbl_filtros = ["Sector", "Monto", "Fecha"];
require([
    'comunes',
    'app/network/Services',
],
	function (
        comunes,
        Services
	) {
        inicializaDatos();
        var orden_inicial = lbl_filtros[0].toUpperCase();

        pintarProyectoByPagina(1, orden_inicial, 0);
	    loadDepartamentos(departamentos_ini);
	    loadMunicipios(municipios_ini, configurarEnlaceLocation);
	    //pintarProyecto(proyectos_ini, "");
        AgregarFiltrosNac();

        function inicializaDatos() {
            //comportamiento resultados buscador
          $(".container,.reset-filters,.filter-results").click(function (event) {
	            var obj_focus_clase = event.target.className.toString();
	            if (obj_focus_clase.indexOf("search-results") < 0 && obj_focus_clase.indexOf("search-item-t") < 0 && obj_focus_clase.indexOf("search-input") < 0 && obj_focus_clase.indexOf("general-search") < 0) {
	                $("#divResultados").children().remove();
	                $("#divResultados").addClass("objHidden");
	        ***REMOVED***
      ***REMOVED***);

            //add filtros ficha proyectos
            if ($("#col_filtros").length > 0) {
                if ($("#col_filtros").children().length <= 0) {
                    comunes.load_filtro_orden("col_filtros", "filterBy", false, lbl_filtros);
            ***REMOVED***
        ***REMOVED***

	***REMOVED***

	    function AgregarFiltrosNac() {
	        var filters = Services.filters.forProjects().done(function (result) {
	            var items_result = result.filters;

	            for (var i = 0; i < items_result.length; i++) {
	                if (items_result[i].parameter == "sector") {
	                    for (var j = 0; j < items_result[i].items.length; j++) {
	                        addFiltroNac("divFiltroSectorNac", "filterNacSector", items_result[i].items[j].name, items_result[i].items[j].value);
	                ***REMOVED***
	            ***REMOVED***
	        ***REMOVED***

	            $('.enlace_nac_sector').bind('click onclick', function () {
	                if ($("#divDetNacionales a").length > 0) {
	                    $("#divDetNacionales").html("");
	                    $("#divPaginacion").html("");
	            ***REMOVED***
	               
	        ***REMOVED***);

	            $('#filterNacSector li').bind('click onclick', function () {
	                $("#divNoEncontradoNac").hide();
	                var val_Sel = $(this).attr("id");
	                if (val_Sel != "") {
	                    cargarProyectosNacionales(1, val_Sel);
	            ***REMOVED***
	        ***REMOVED***);

	    ***REMOVED***);

	***REMOVED***

	    function addFiltroNac(obj_div, obj_etiqueta, opc, valor) {
	        if ($("#" + obj_etiqueta).length == 0) {
	            if (obj_etiqueta == "filterNacSector") {
	                var div_col = d3.select("#" + obj_div)
	                div_col.append("label")
                    .text("Sector")
	                var afilter = div_col.append("a")
                    .attr("class", "btn btn-select btn-select-light mivCustom enlace_nac_sector")
	                afilter.append("input")
                    .attr("type", "hidden")
                    .attr("class", "btn-select-input")
                    .attr("id","enlace_filtro_sector")
	                afilter.append("span")
                    .attr("class", "btn-select-value")
                    .text("Todos")
	                afilter.append("span")
                    .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")

	                var ul_select = afilter.append("ul")
                    .attr("id", obj_etiqueta)
	                ul_select.append("li").text("Todos")
                    .attr("id", "0")
	                ul_select.append("li").text(opc)
                    .attr("id", valor)
	        ***REMOVED***

	    ***REMOVED*** else {
	            var ul_select = d3.select("#" + obj_etiqueta)
	            ul_select.append("li").text(opc)
                .attr("id", valor)
	    ***REMOVED***

	***REMOVED***



	    function loadDepartamentos(obj_departamentos, func_fin) {
	        var arrayDepartments = { length: 0 ***REMOVED***;
	        //DIBUJANDO DEPARTAMENTOS
	        var aux_div_pre = d3.select("#divDepartamentos")
	        var aux_div_fila = aux_div_pre.append("div")
                .attr("class", "row")
	            aux_div_fila.append("div")
                .attr("class", "col-md-12")
                .append("h2")
                .attr("class", "headSection")
                .append("a")
                .attr("role", "button")
                 .append("span")
                 .text("DEPARTAMENTOS")
	             aux_div_pre.append("div")
                .attr("class", "linkBoxContainer ontent mCustomScrollbar")
                .attr("id", "content-1")
	        for (i = 0; i < obj_departamentos.length; i++) {
	            var aux_div = d3.select("#content-1")
                .append("div")
                .attr("class", "thumbnail")
	            aux_div.append("img")
                .attr("class", "img-responsive")
                .attr("src", obj_departamentos[i].url_imag_peq)
                .attr("alt", obj_departamentos[i].nombre)
	            var aux_div_2 = aux_div.append("div")
                .attr("class", "caption")
                .append("a")
                 .attr("href", "")
                 .attr("role", "button")
                 .attr("location_id", obj_departamentos[i].id)
                 .attr("tipo", "departamento")
                 .attr("class","enlace_ficha")
                .append("h3")
                .attr("class", "text-center")
                .text(obj_departamentos[i].nombre)
	    ***REMOVED***

	        if ($.isFunction(func_fin)) {
	            func_fin();
	    ***REMOVED***
	***REMOVED***

	    function loadMunicipios(obj_municipios, func_fin) {
	        var url_location = "../Localizacion/LocationProfile?LocationId=111";
	        //DIBUJANDO MUNICIPIOS
	        var aux_div_pre = d3.select("#divMunicipios")
	            var aux_div_fila=aux_div_pre.append("div")
                .attr("class", "row")
                aux_div_fila.append("div")
                .attr("class","col-md-12")
                .append("h2")
                .attr("class", "headSection")
                .append("a")
                .attr("role", "button")
                .append("span")
                .text("MUNICIPIOS ")
	             aux_div_pre.append("div")  
                .attr("class", "linkBoxContainer ontent mCustomScrollbar")
                .attr("id", "content-2")
	        for (i = 0; i < obj_municipios.length; i++) {
	            var aux_div = d3.select("#content-2")
                .append("div")
                .attr("class", "thumbnail")
	            aux_div.append("img")
                .attr("class", "img-responsive")
	            .attr("src", obj_municipios[i].url_imag_peq)
                .attr("alt", obj_municipios[i].nombre)
	            var aux_div_2 = aux_div.append("div")
                .attr("class", "caption")
                .append("a")
                 .attr("href","")    
                 .attr("role", "button")
                 .attr("location_id", obj_municipios[i].id)
                 .attr("tipo", "municipio")
                 .attr("class", "enlace_ficha")
                .append("h3")
                .attr("class", "text-center")
                .text(obj_municipios[i].nombre)
	    ***REMOVED***

	        if ($.isFunction(func_fin)) {
	            func_fin();
	    ***REMOVED***
	***REMOVED***

	    function configurarEnlaceLocation() {
	      
	        $('.enlace_ficha').each(function (i, e) {
	            $(e).bind('click', function () {
	                var cad_aux = "prueba";
	                var enlace_url = "../localizacion/LocationProfile#/";
	                var anyo = (new Date).getFullYear() - 1;
	                var location_id = $(this).attr("location_id");
	                document.cookie = "location_id=" + location_id + ";path=/;";
	                var tipo = $(this).attr("tipo");
								//&municipio=0000&departamento=00&periods=2016&sector=2
								if (tipo == "departamento" || tipo.toUpperCase() == "REGION") {
	                    //departamento
	                    enlace_url += "?" + "id=" + location_id + "&type=region"
                ***REMOVED***
                    else if (tipo == "sector") {
                        //sector
                        enlace_url += "?" + "sector=" + location_id
                ***REMOVED***
                    else {
	                    //municipio
											enlace_url += "?" + "id=" + location_id + "&type=county"
	            ***REMOVED***
	                enlace_url += "&aux=" + Math.random();
	                //forma-david------------------------
	                //enlace_url = "../localizacion/EnlaceLocation?dataType=" + tipo + "&dataValue=" + location_id + "&aux=" + Math.random();
	                //-----------------------------------
	                $(this).attr('href', enlace_url);
	                //location.href = enlace_url;
	        ***REMOVED***);
	    ***REMOVED***);
	***REMOVED***


	    function pintarProyecto(resultados, opcion) {
	        //DIBUJANDO PROYECTOS
	        comunes.load_ficha(resultados, "proyContenedor", "divProyectos");
            configuraFiltros();

	***REMOVED***

        function pintarProyectoByPagina(pagina, orden, sector) {
            $("#proyContenedor").empty();
            $("#divPagFichas").empty();
            $("#proyContenedor").html(loader_proy);
            var url = '/api/serviciosproyectos/GetProyectosByPag';
            var param = "page=" + pagina + "&opc_orden=" + orden + "&sector=" + sector;
            Services.projectsList(url + "?" + param)
                .done(function (data) {
                    $("#proyContenedor").attr("orden", orden);
                    $("#proyContenedor").attr("sector", sector);
                    $("#proyContenedor").empty();
                    var div_proy = d3.select("#divProyectos")
                    if (data.proyNacionales.length > 0) {

                        proyectos_ini = data.proyNacionalesAll;
                        $("#proyContenedor").attr("total_pages", data.totalPages);
                        $("#proyContenedor").attr("total_number", data.totalNumber);
                        $("#proyContenedor").attr("pag_actual", pagina)
                        pintarProyecto(data.proyNacionales, "");
                        //construir paginacion
                        dibujarPagNumeradas(pagina, data.totalNumber, data.totalPages);


                ***REMOVED*** else {
                        //No hay datos
                        $("#proyContenedor").attr("orden", orden);
                        $("#proyContenedor").attr("sector", sector);
                        d3.select("#divPagFichas").empty();
                        $("#proyContenedor").attr("orden", orden);
                        $("#proyContenedor").attr("sector", sector);
                ***REMOVED***
            ***REMOVED***);
	        

	***REMOVED***


	    function dibujarPagNumeradas(actual, total, totalPag) {
	        var pag_actual = parseInt(actual);
	        var pagina_actual = pag_actual;
	        var pagesHTML = '';
	        var cant_por_pag = 6;
	        var cant_por_linea = 10;
	        $("#divPagFichas").html("");
	        var divPag = d3.select("#divPagFichas")
	        //divPag.append("text")
	        //.text("Pág: ")

	        var cociente = Math.floor(pag_actual / cant_por_linea);
	        var residuo = pag_actual % cant_por_linea;
	        var inicio = 1;
	        if (residuo == 0) {
	            inicio = (pag_actual - cant_por_linea) + 1;
	    ***REMOVED*** else {
                inicio=(cociente*cant_por_linea)+1;
	    ***REMOVED***

	        var fin = inicio + (cant_por_linea - 1);
	        if (totalPag < cant_por_linea) {
	            fin = totalPag;
	    ***REMOVED***


	        if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
	            var pag_enlace = divPag.append("a")
                .attr("id", "page_left")
                .attr("class", "pull-left")
                .attr("data-page", inicio-cant_por_linea)
	            pag_enlace.append("span")
                .attr("class", "glyphicon glyphicon-arrow-left")
	            pag_enlace.append("text")
                .text(" Anterior")
	    ***REMOVED***



	        for (var i = inicio; i <= fin; i++) {
             
	            if (i == pag_actual) {
	                var pag_enlace = divPag.append("span")
                    .attr("class", "pag_actual")
                    .attr("data-page", i)
	                pag_enlace.append("text")
                   .text(i)
	        ***REMOVED*** else {
	                var pag_enlace = divPag.append("a")
                    //.attr("id", "page_left")
                    .attr("class", "page_left")
                    .attr("role", "button")
                    .attr("data-page", i)
	                pag_enlace.append("span")
                    .attr("class", "glyphicon")
	                pag_enlace.append("text")
                    .attr("class", "paginacion")
                    .text(i)

	        ***REMOVED***


	    ***REMOVED***

	        if (pag_actual < totalPag) {
	            if ((totalPag - pag_actual) > cant_por_linea) {
	                var pag_enlace_der = divPag.append("a")
                    .attr("id", "page_right")
                    .attr("class", "")
                    .attr("data-page", fin + 1 )
                    .text("Próximo ")
	                pag_enlace_der.append("span")
                    .attr("class", "glyphicon glyphicon-arrow-right")

	        ***REMOVED***
	    ***REMOVED***

            $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
                //d3.select("#divProyectos").empty();
                pagina_actual = $(this).attr("data-page");
                var orden_opc = $("#proyContenedor").attr("orden");
                var sector_opc = $("#proyContenedor").attr("sector");
                pintarProyectoByPagina(pagina_actual, orden_opc, sector_opc);
	    ***REMOVED***);

	***REMOVED***



	    function dibujaPaginacionFichas(actual, total, totalPag) {
	        var pag_actual = parseInt(actual);
	        pagina_actual = pag_actual;
	        var pagesHTML = '';
	        var cant_por_pag = 6;
	        $("#divPagFichas").empty();
	        var divPag = d3.select("#divPagFichas")
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
	            pintarProyectoByPagina(pagina_actual);
	    ***REMOVED***);

	***REMOVED***

	    function cargarProyectosNacionales(pagina, sector) {
	        $("#divDetNacionales").html("");
	        $("#divDetNacionales").html(loader_proy);
	        var url = '/api/serviciosproyectos/GetProyNacionales';
	        var param = "page=" + pagina + "&sector=" + sector;
	        Services.projectsList(url + "?" + param)
            .done(function (data) {
                var div_proy = d3.select("#divDetNacionales")
                $("#divDetNacionales").html("");
                div_proy.selectAll("a").remove();
                if (data.proyNacionales.length > 0) {
                    $("#divNoEncontradoNac").hide();
                    for (var k = 0; k < data.proyNacionales.length; k++) {
                        div_proy.append("a")
                       .attr("class", "list-group-item")
                       .attr("href", "../projectprofile/" + data.proyNacionales[k].IdProyecto)
                       .text(data.proyNacionales[k].NombreProyecto)
                ***REMOVED***
                    //construir paginacion
                    dibujaPaginacion(pagina, data.totalNumber, data.totalPages,sector);

            ***REMOVED*** else {
                    //No hay datos
                    d3.select("#divPaginacion").html("");
                    $("#divNoEncontradoNac").show();
            ***REMOVED***
        ***REMOVED***);
	***REMOVED***

	    function dibujaPaginacion(actual, total, totalPag,sector) {
	        var pag_actual = parseInt(actual);
	        pagina_actual = pag_actual;
	        var pagesHTML = '';
	        var cant_por_pag = 5;
	        $("#divPaginacion").html("");
	        var divPag = d3.select("#divPaginacion")
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
	            //$("#divListadoProyectos").html("");
	            d3.select("#divDetNacionales").selectAll("a").remove();
	            pagina_actual = $(this).attr("data-page");
	            cargarProyectosNacionales(pagina_actual,sector);
	    ***REMOVED***);


	***REMOVED***


	    jQuery.fn.sort = function () {
	        return this.pushStack([].sort.apply(this, arguments), []);
	***REMOVED***

	    function ordenaMonto(a, b) {
	        if (parseFloat(a.approvedTotalMoney) == parseFloat(b.approvedTotalMoney)) {
	            return 0;
	    ***REMOVED***
	        return parseFloat(a.approvedTotalMoney) > parseFloat(b.approvedTotalMoney) ? 1 : -1;
	***REMOVED***
	    function ordenaMontoDesc(a, b) {
	        return ordenaMonto(a, b) * -1;
	***REMOVED***

	    function ordenaProgreso(a, b) {
	        if (parseFloat(a.porcentajeGastado) == parseFloat(b.porcentajeGastado)) {
	            return 0;
	    ***REMOVED***
	        return parseFloat(a.porcentajeGastado) > parseFloat(b.porcentajeGastado) ? 1 : -1;
	***REMOVED***

	    function ordenaProgresoDesc(a, b) {
	        return ordenaProgreso(a, b) * -1;

	***REMOVED***

	    function ordenaFechaIni(a, b) {
	        return a.FechaInicioProyecto > b.FechaInicioProyecto ? 1 : -1;
	***REMOVED***

	    function ordenaFechaIniDesc(a, b) {
	        return ordenaFechaIni(a, b) * -1;
	***REMOVED***

	    function ordenaSector(a, b) {
	        if ((a.NombreSector) == (b.NombreSector)) {
	            return 0;
	    ***REMOVED***
	        return (a.NombreSector) > (b.NombreSector) ? 1 : -1;
	***REMOVED***
	    function ordenaSectorDesc(a, b) {
	        return ordenaSector(a, b) * -1;
	***REMOVED***

	    function configuraFiltros() {
            $('#filterBy li').bind('click onclick', function () {
                //var objJson = proyectos_ini;
                //var sorted = objJson;
                var val_Sel = $(this).text().toUpperCase();
                var old_Sel = $("#proyContenedor").attr("orden");
                if (old_Sel != val_Sel) {
                    $("#proyContenedor").attr("orden", val_Sel);
                    var sector = $("#proyContenedor").attr("sector");
                    if (val_Sel != "") {
                        pintarProyectoByPagina(1, val_Sel, sector);
                ***REMOVED*** else {
                        //opcion vacia
                        pintarProyectoByPagina(1, "", sector);
                ***REMOVED***
            ***REMOVED***


        ***REMOVED***);
	***REMOVED***
	***REMOVED***)
