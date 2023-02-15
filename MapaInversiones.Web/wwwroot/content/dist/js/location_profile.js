define([
    'app/network/Services',
    'app/network/urlsMap',
    'comunes'
],
	function (
        Services,
        urlsMap,
        comunes
	) {

        var periodos = JSON.parse(document.body.getAttribute('data-periods'));
        var proyectos_eje = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));
        var filtros_aux = JSON.parse(document.body.getAttribute('data-filters'));
        var projectsPerEstado = JSON.parse(document.body.getAttribute('data-projectsPerEstado'));
        var ProjectsPerSectorGroup = JSON.parse(document.body.getAttribute('data-projectsPerSectorGroup'));
        var locationData = JSON.parse(document.body.getAttribute('data-location'));

        var searchProjectsList = '/api/serviciosproyectos/listado';

        //si se quiere usar bindings para el html
	    //this.root = $('#projects-list-view');
	    inicializaDatos();

	    pagina_actual=1;

	    AgregarFiltros();
        comunes.load_filtro_orden("divFiltrosFichaOrdena", "filterByEjecucion");
	    ////---listado proyectos superior
	    cargarProyectos(1);
	    
        ///seccion todos los proyectos
	    loadConsolidaEstados();

	    loadProyectosPorSector();

        ///---listado proyectos ejecucion
	    loadProyectosEjecucion(proyectos_eje);
	    
	    function inicializaDatos() {
	        $("#divNoExistenEjec").hide();
	***REMOVED***

	        
	    function loadProyectosPorSector() {
	        for (var i = 0; i < ProjectsPerSectorGroup.length; i++) {
	            ProjectsPerSectorGroup[i].value = parseFloat(ProjectsPerSectorGroup[i].value);
	            ProjectsPerSectorGroup[i].rawValue = parseFloat(ProjectsPerSectorGroup[i].rawValue);
	    ***REMOVED***
	        var visualization = d3plus.viz()
           .container("#divGraphProySector")
           .data(ProjectsPerSectorGroup)
           .type({
               "value": "tree_map",
               "mode": "sqarify"
       ***REMOVED***)
            .id({
                "value": ["labelGroup","label"],
                "grouping": true            // grouping set to false ungroups parent nesting
        ***REMOVED***)
           .depth(1)
           .size("rawValue")
           .format({
               "text": function (text, params) {
                   if (text === "rawValue") {
                       return "No. Proyectos";
               ***REMOVED*** else if (text == "label") {
                       return "Estado";
               ***REMOVED*** else if (text == "labelGroup") {
                       return "Sector";
               ***REMOVED***
                   else {
                       return d3plus.string.title(text, params);
               ***REMOVED***

           ***REMOVED***
       ***REMOVED***)
            .background("#E3E3E3")
            .labels({ "align": "left", "valign": "top" ***REMOVED***)
            .tooltip(["labelGroup", "label"])   // list the keys to show in tooltip
            .color("labelGroup")  
            .color({
                "scale": ["#2F4556","#FF3637", "#31655E", "#00C9B1", "#DD1A8B", "#DD4E29", "#D3A034", "#FFB886", "#FFF190", "#80AFE6", "#73323D", "##5B73DD"],
        ***REMOVED***)
            .legend(true)
            .draw()

	***REMOVED***

	    function loadConsolidaEstados() {
	        var txtConsolidado = "";
	        var txt_aux = "";
	        //grafica d3
            var hexa_colores = ["#A31D36", "#E51C3C", "#B1DAAE", "#255955"];
            for (var i = 0; i < projectsPerEstado.length; i++) {
                if (i == 0) {
                    txt_aux = "Hay " + projectsPerEstado[i].rawValue.toString() + " proyectos ";
            ***REMOVED*** else {
                    if (i == projectsPerEstado.length - 1) {
                        txt_aux = " y " + projectsPerEstado[i].rawValue.toString();
                ***REMOVED*** else {
                        txt_aux= " " + projectsPerEstado[i].rawValue.toString();
                ***REMOVED***
                   
            ***REMOVED***
                projectsPerEstado[i].value = parseFloat(projectsPerEstado[i].value);
                projectsPerEstado[i].rawValue = parseFloat(projectsPerEstado[i].rawValue);
                if (projectsPerEstado[i].label.toUpperCase() == "EN ESTUDIO") {
                    txtConsolidado += txt_aux + " que se encuentran en estudio,"
            ***REMOVED*** else if (projectsPerEstado[i].label.toUpperCase() == "RECHAZADO") {
                    txtConsolidado += txt_aux + " " + " fueron rechazados"
            ***REMOVED*** else if (projectsPerEstado[i].label.toUpperCase() == "EN EJECUCIÓN" || projectsPerEstado[i].label.toUpperCase() == "EN EJECUCION") {
                    txtConsolidado += txt_aux + " " + " en ejecución,"
            ***REMOVED*** else {
                    //finalizado
                    txtConsolidado += txt_aux + " han sido ejecutados,"
            ***REMOVED***

        ***REMOVED***

            var txtDescriptivo = "Asunción es la capital y la ciudad más poblada de la República del Paraguay. El área metropolitana, llamada Gran Asunción, incluye las ciudades de San Lorenzo, Fernando de la Mora, Lambaré, Luque, Mariano Roque Alonso, Ñemby, San Antonio, Limpio, Capiatá y Villa Elisa, que forman parte del Departamento Central. El área metropolitana de Asunción tiene más de 2 millones de habitantes.";
            var div_txtPadre = d3.select("#divTxtTodosProy")
            div_txtPadre.append("h2")
            .text("Todos los proyectos")
            div_txtPadre.append("p")
            .text(txtDescriptivo)
            div_txtPadre.append("p")
            .text(txtConsolidado);
            make_viz();
            


	***REMOVED***
	    function make_viz() {
	        var sample_data = [
            { "rawValue": 12, "label": "En ejecución", "color": 1 ***REMOVED***,
            { "rawValue": 23, "label": "Ejecutados", "color": 1***REMOVED***,
            { "rawValue": 45, "label": "Viables", "color": 1 ***REMOVED***

	        ]
	    // instantiate d3plus
	    var visualization = d3plus.viz()
        .container("#divGraphTodosProy")
        .data(projectsPerEstado)
            .type({
                "value": "tree_map",
                "mode": "slice"
                //"mode" : "sqarify"
        ***REMOVED***)
        .id("label")
        .size("rawValue")
        .text("label")
	    .format({
	        "text": function (text, params) {
	            if (text === "rawValue") {
	                return "No. Proyectos";
	        ***REMOVED*** 
	            else {
	                return d3plus.string.title(text, params);
	        ***REMOVED***

	    ***REMOVED***
	***REMOVED***)
         //.id(["group","label"]) agrupar por dos items
         .background("#E3E3E3")
         .labels({ "align": "left", "valign": "top" ***REMOVED***)
         .tooltip({
                "share": false,
                "font": { size: "auto" ***REMOVED***,
        ***REMOVED***)
         .width({ "small": 400 ***REMOVED***)
         //.color("label")  
         .color({
                 "scale": ["#A31D36", "#E51C3C", "#B1DAAE", "#255955"],
     ***REMOVED***)
         .legend(false)
         .draw()             
	***REMOVED***

	    function loadProyectosEjecucion(resultados) {
	        if (resultados.length > 0) {
	            $("#divNoExistenEjec").hide();
	            var div_proy = d3.select("#divContenedorFichas")
	            div_proy.append("div")
                .attr("class", "row")
                .append("div")
                .attr("class", "col-md-12")
                .append("div")
                .attr("id", "Carousel")
                .attr("class", "carousel slide")
                .append("div")
                 .attr("id", "divContenidoFichas")
                .attr("class", "carousel-inner")

	            if ($("#divContenedorFichas").length > 0) {
	                var cont_aux = 0;
	                var nom_fila = "divFilaProy_" + cont_aux.toString()
	                var clase_active = "item";
	                for (var i = 0; i < resultados.length; i++) {
	                    if (i == 0) {
	                        clase_active = "item active";
	                ***REMOVED*** else {
	                        clase_active = "item";
	                ***REMOVED***
	                    var modulo = (i % 4);
	                    if (modulo == 0) {
	                        nom_fila = "divFilaProy_" + cont_aux.toString()
	                        var nom_col = "ficha_" + i.toString();
	                        var div_proy_item = d3.select("#divContenidoFichas")
                           .append("div")
                           .attr("class", clase_active)
	                        var div_fila = div_proy_item.append("div")
                            .attr("id", nom_fila)
                            .attr("class", "row-fluid")
	                        div_fila.append("div")
                            .attr("id", nom_col)
                            .attr("class", "col-md-3")
	                        comunes.load_ficha_unica(resultados[i], nom_col, nom_fila, prueba);
	                        cont_aux += 1;
	                ***REMOVED*** else {
	                        var nom_col = "ficha_" + i.toString();
	                        if ($("#" + nom_fila).length > 0) {
	                            d3.select("#" + nom_fila)
                                .append("div")
                                .attr("class", "col-md-3")
                                .attr("id", nom_col)
	                            comunes.load_ficha_unica(resultados[i], nom_col, nom_fila, prueba);
	                    ***REMOVED***
	                ***REMOVED***

	            ***REMOVED***
	        ***REMOVED***

	            //add data-slide
	            var divSlide = d3.select("#Carousel")
	            divSlide.append("a")
               .attr("data-slide", "prev")
               .attr("href", "#Carousel")
               .attr("class", "left carousel-control")
               .append("span")
               .attr("class", "glyphicon glyphicon-chevron-left")
	            divSlide.append("a")
                 .attr("data-slide", "next")
                .attr("href", "#Carousel")
                .attr("class", "right carousel-control")
                .append("span")
                .attr("class", "glyphicon glyphicon-chevron-right")
	    ***REMOVED*** else {
	            //no existen proyectos en ejecucion
	            $("#divNoExistenEjec").show();

	    ***REMOVED***

	        //configuraFiltroSector();
	        configuraFiltrosEje();
	***REMOVED***

	    function configuraFiltrosEje() {
	        if ($("#filterByEjecucion").length > 0) {
	            $('#filterByEjecucion li').bind('click onclick', function () {
	                var objJson = proyectos_eje;
	                var sorted = objJson;
	                var val_Sel = $(this).text().toUpperCase();
	                if (val_Sel != "") {
	                    if (val_Sel == "MONTO") {
	                        sorted = $(objJson).sort(ordenaMontoDesc);
	                        if ($("#proyContenedor").length > 0) {
	                            var div_proyectos = d3.select("#divContenidoFichas");
	                            div_proyectos.html("");
	                            loadProyectosEjecucion(sorted);
	                    ***REMOVED***
	                ***REMOVED***
	                    else if (val_Sel == "PROGRESO") {
	                        sorted = $(objJson).sort(ordenaProgresoDesc);
	                        var div_proyectos = d3.select("#divContenidoFichas");
	                        div_proyectos.html("");
	                        loadProyectosEjecucion(sorted);

	                ***REMOVED*** else {
	                        //fecha
	                        sorted = $(objJson).sort(ordenaFechaIniDesc);
	                        var div_proyectos = d3.select("#divContenidoFichas");
	                        div_proyectos.html("");
	                        loadProyectosEjecucion(sorted);
	                ***REMOVED***

	            ***REMOVED*** else {
	                    //opcion vacia
	                    loadProyectosEjecucion(sorted);
	            ***REMOVED***

	        ***REMOVED***);
	    ***REMOVED***
	***REMOVED***

	    

	    function prueba() {

	***REMOVED***

        ///si se quiere realizar carga directa desde el controlador, sin web api
	    function AgregarFiltros_proy() {
	        var items_result = filtros_aux;
	            for (var i = 0; i < items_result.length; i++) {
	                if (items_result[i].parameter == "estado") {
	                    addFiltro("filters_groups_etapa", "filterByEtapa", items_result[i].item_name, items_result[i].item_value);

	            ***REMOVED*** else if (items_result[i].parameter == "sector") {
	                        addFiltro("filters_groups_sector", "filterBySector", items_result[i].item_name, items_result[i].item_value);
	                        addFiltro("divFiltrosFichaSector", "filterEjecSector", items_result[i].item_name, items_result[i].item_value);
                ***REMOVED***
                    else if (items_result[i].parameter == "departamento") {
                        for (var j = 0; j < items_result[i].items.length; j++) {
                            addFiltro("filters_groups_departamento", "filterByDepartamento", items_result[i].items[j].name, items_result[i].items[j].value);
                            addFiltro("divFiltrosFichaDepartamento", "filterEjecDepartamento", items_result[i].items[j].name, items_result[i].items[j].value);
                            addFiltro("divFiltrosFichaDepartamentoSector", "filterEjecDepartamentoSector", items_result[i].items[j].name, items_result[i].items[j].value);
                    ***REMOVED***
                ***REMOVED***
	        ***REMOVED***
                $('#filterByEtapa li,#filterBySector li,#filterByDepartamento li').bind('click onclick', function (e) {
	                var val_Sel = $(this).attr("id");
	                if (val_Sel != "" && val_Sel != "0") {
	                    var target = $(e.target);
	                    target.addClass("selected").siblings().removeClass("selected");
	                    cargarProyectos(pagina_actual);
	            ***REMOVED***
	        ***REMOVED***);
	        
***REMOVED***


	    function AgregarFiltros() {
	            var filters = Services.filters.forProjects().done(function (result) {
	                var items_result = result.filters;

	                for (var i = 0; i < items_result.length; i++) {
	                    if (items_result[i].parameter == "estado") {
	                        for (var j = 0; j < items_result[i].items.length; j++) {
	                            addFiltro("filters_groups_etapa", "filterByEtapa", items_result[i].items[j].name, items_result[i].items[j].value);
	                    ***REMOVED***
                    ***REMOVED***
                        else if (items_result[i].parameter == "sector")
                        {
	                        for (var j = 0; j < items_result[i].items.length; j++) {
	                            addFiltro("filters_groups_sector", "filterBySector", items_result[i].items[j].name, items_result[i].items[j].value);
                                addFiltro("divFiltrosFichaSector", "filterEjecSector", items_result[i].items[j].name, items_result[i].items[j].value);
	                    ***REMOVED***
                    ***REMOVED***
                        else if (items_result[i].parameter == "departamento") {
                            for (var j = 0; j < items_result[i].items.length; j++) {
                                addFiltro("filters_groups_departamento", "filterByDepartamento", items_result[i].items[j].name, items_result[i].items[j].value);
                                addFiltro("divFiltrosFichaDepartamento", "filterEjecDepartamento", items_result[i].items[j].name, items_result[i].items[j].value);
                                addFiltro("divFiltrosFichaDepartamentoSector", "filterEjecDepartamentoSector", items_result[i].items[j].name, items_result[i].items[j].value);
                        ***REMOVED***
                    ***REMOVED***
	            ***REMOVED***


                    $('#filterByEtapa li,#filterBySector li,#filterByDepartamento li').bind('click onclick', function (e) {
	                    var val_Sel = $(this).attr("id");
	                    if (val_Sel != "" && val_Sel != "0") {
	                        var target = $(e.target);
	                        target.addClass("selected").siblings().removeClass("selected");
	                        cargarProyectos(pagina_actual);
	                ***REMOVED***
	            ***REMOVED***);

	                $('#filterEjecSector li').bind('click onclick', function () {
	                    $("#divNoEncontradoEjec").hide();
	                        var val_Sel = $(this).attr("id");
	                        if (val_Sel != "") {
	                            var objJson = proyectos_eje;
	                            var objFiltered = $.grep(objJson, function (h) {
	                                return h.IdSector == val_Sel
	                        ***REMOVED***);
	                            var div_proyectos = d3.select("#divContenidoFichas");
	                            div_proyectos.html("");
	                            if (objFiltered.length > 0) {
	                                loadProyectosEjecucion(objFiltered);
	                        ***REMOVED***
	                            else {
	                                $("#divNoEncontradoEjec").show();
	                        ***REMOVED***
	                    ***REMOVED***
                ***REMOVED***);

                    $('#filterEjecDepartamento li').bind('click onclick', function () {
                        $("#divNoEncontradoEjec").hide();
                        var val_Sel = $(this).attr("id");
                        if (val_Sel != "") {
                            var objJson = proyectos_eje;
                            var objFiltered = $.grep(objJson, function (h) {
                                return h.IdSector == val_Sel
                        ***REMOVED***);
                            var div_proyectos = d3.select("#divContenidoFichas");
                            div_proyectos.html("");
                            if (objFiltered.length > 0) {
                                loadProyectosEjecucion(objFiltered);
                        ***REMOVED***
                            else {
                                $("#divNoEncontradoEjec").show();
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***);

                    $('#filterEjecDepartamentoSector li').bind('click onclick', function () {
                        $("#divNoEncontradoEjec").hide();
                        var val_Sel = $(this).attr("id");
                        if (val_Sel != "") {
                            var objJson = proyectos_eje;
                            var objFiltered = $.grep(objJson, function (h) {
                                return h.IdSector == val_Sel
                        ***REMOVED***);
                            var div_proyectos = d3.select("#divContenidoFichas");
                            div_proyectos.html("");
                            if (objFiltered.length > 0) {
                                loadProyectosEjecucionSectores(objFiltered);
                        ***REMOVED***
                            else {
                                $("#divNoEncontradoEjec").show();
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***);

	        ***REMOVED***);

	***REMOVED***
        

	        function cargarProyectos(pagina) {
	            //loading(true);
	            var objJson = locationData;
	            var url = urlsMap.searchProjectsList;
	            var sector_id = $("#filterBySector li.selected").attr("id");
                var estado_id = $('#filterByEtapa li.selected').attr('id');
                var departamento_id = $('#filterByDepartamento li.selected').attr('id');
	            var param = "page=" + pagina;
	            if (sector_id != "" && sector_id != undefined) {
	                param += "&sector=" + sector_id;
	        ***REMOVED***
	            if (estado_id != "" && estado_id != undefined) {
	                param += "&estado=" + estado_id;
            ***REMOVED***
                if (departamento_id != "" && departamento_id != undefined) {
                    param += "&departamento=" + departamento_id;
            ***REMOVED***
	            if (objJson.length > 0) {
                    if (objJson[0].location_type == "MUNICIPIO") {
	                        param += "&municipio=" + objJson[0].location_id;
	                ***REMOVED***
	                    if(objJson[0].location_type == "DEPARTAMENTO") {
	                        param += "&departamento=" + objJson[0].location_id;
	                ***REMOVED***
	        ***REMOVED***
	            Services.projectsList(url + "?"+ param)
                .done(function (data) {
                    var div_proy = d3.select("#divListadoProyectos")
                    div_proy.selectAll("a").remove()
                    if (data.objects.length > 0) {
                        $("#divMensaje").hide();
                        for (var k = 0; k < data.objects.length; k++) {
                            div_proy.append("a")
                           .attr("class", "list-group-item")
                           .attr("href", "../projectprofile/" + data.objects[k].location)
                           .text(data.objects[k].name)
                    ***REMOVED***
                        //loading(false);
                        //construir paginacion
                        dibujaPaginacion(pagina, data.totalProjectsNumber, data.totalPages);

                ***REMOVED*** else {
                        //No hay datos
                        //falta ocultar paginacion
                        d3.select("#divPaginacion").html("");
                        $("#divMensaje").show();
                ***REMOVED***
                    
   
            ***REMOVED***);

	           
	    ***REMOVED***

	        function addFiltro(obj_div, obj_etiqueta, opc, valor) {
	            if ($("#" + obj_etiqueta).length == 0) {

	                if (obj_etiqueta == "filterByEtapa") {
	                    var div_col = d3.select("#" + obj_div)
	                    div_col.append("label")
                        .text("Etapa")
	                    var afilter = div_col.append("a")
                        .attr("class", "btn btn-select btn-select-light mivCustom")
	                    afilter.append("input")
                        .attr("type", "hidden")
                        .attr("class", "btn-select-input")
	                    afilter.append("span")
                        .attr("class", "btn-select-value")
                        .text("Todas")
	                    afilter.append("span")
                        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
	                    var ul_select = afilter.append("ul")
                        .attr("id", obj_etiqueta)
	                    ul_select.append("li").text(opc)
                        .attr("id", valor)

	            ***REMOVED*** else if (obj_etiqueta == "filterBySector") {
	                    var div_col = d3.select("#" + obj_div)
	                    div_col.append("label")
                        .text("Sector")
	                    var afilter = div_col.append("a")
                        .attr("class", "btn btn-select btn-select-light mivCustom")
	                    afilter.append("input")
                        .attr("type", "hidden")
                        .attr("class", "btn-select-input")
	                    afilter.append("span")
                        .attr("class", "btn-select-value")
                        .text("Todos")
	                    afilter.append("span")
                        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
	                    var ul_select = afilter.append("ul")
                        .attr("id", obj_etiqueta)
	                    ul_select.append("li").text(opc)
                        .attr("id", valor)
                ***REMOVED*** else if (obj_etiqueta == "filterByDepartamento") {
                        var div_col = d3.select("#" + obj_div)
                        div_col.append("label")
                            .text("Departamento")
                        var afilter = div_col.append("a")
                            .attr("class", "btn btn-select btn-select-light mivCustom")
                        afilter.append("input")
                            .attr("type", "hidden")
                            .attr("class", "btn-select-input")
                        afilter.append("span")
                            .attr("class", "btn-select-value")
                            .text("Todos")
                        afilter.append("span")
                            .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
                        var ul_select = afilter.append("ul")
                            .attr("id", obj_etiqueta)
                        ul_select.append("li").text(opc)
                            .attr("id", valor)
                ***REMOVED***else if (obj_etiqueta == "filterEjecSector") {
	                    var div_col = d3.select("#" + obj_div)
	                    div_col.append("label")
                        .text("Sector")
	                    var afilter = div_col.append("a")
                        .attr("class", "btn btn-select btn-select-light mivCustom")
	                    afilter.append("input")
                        .attr("type", "hidden")
                        .attr("class", "btn-select-input")
	                    afilter.append("span")
                        .attr("class", "btn-select-value")
                        .text("Todos")
	                    afilter.append("span")
                        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
	                    var ul_select = afilter.append("ul")
                        .attr("id", obj_etiqueta)
		                    ul_select.append("li").text(opc)
                        .attr("id", valor)
                ***REMOVED***
                    else if (obj_etiqueta == "filterEjecDepartamento") {
                        var div_col = d3.select("#" + obj_div)
                        div_col.append("label")
                            .text("Departamento")
                        var afilter = div_col.append("a")
                            .attr("class", "btn btn-select btn-select-light mivCustom")
                        afilter.append("input")
                            .attr("type", "hidden")
                            .attr("class", "btn-select-input")
                        afilter.append("span")
                            .attr("class", "btn-select-value")
                            .text("Todos")
                        afilter.append("span")
                            .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
                        var ul_select = afilter.append("ul")
                            .attr("id", obj_etiqueta)
                        ul_select.append("li").text(opc)
                            .attr("id", valor)
                ***REMOVED***
                    else if (obj_etiqueta == "filterEjecDepartamentoSector") {
                        var div_col = d3.select("#" + obj_div)
                        div_col.append("label")
                            .text("Departamento")
                        var afilter = div_col.append("a")
                            .attr("class", "btn btn-select btn-select-light mivCustom")
                        afilter.append("input")
                            .attr("type", "hidden")
                            .attr("class", "btn-select-input")
                        afilter.append("span")
                            .attr("class", "btn-select-value")
                            .text("Todos")
                        afilter.append("span")
                            .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
                        var ul_select = afilter.append("ul")
                            .attr("id", obj_etiqueta)
                        ul_select.append("li").text(opc)
                            .attr("id", valor)
                ***REMOVED***

	        ***REMOVED*** else {
	                var ul_select = d3.select("#" + obj_etiqueta)
	                ul_select.append("li").text(opc)
                    .attr("id", valor)
	        ***REMOVED***

	    ***REMOVED***

	        function dibujaPaginacion(actual, total, totalPag) {
	            var pag_actual = parseInt(actual);
	            pagina_actual=pag_actual;
	            var pagesHTML = '';
	            var cant_por_pag = 10;
	            $("#divPaginacion").html("");
	            var divPag = d3.select("#divPaginacion")
	            if (pag_actual > 1 && total >= cant_por_pag) {
	                var pag_enlace=divPag.append("a")
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
	                    var pag_enlace_der=divPag.append("a")
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
	                d3.select("#divListadoProyectos").selectAll("a").remove()
	                pagina_actual = $(this).attr("data-page");
	                cargarProyectos(pagina_actual);
	        ***REMOVED***);


	    ***REMOVED***

	        function dibujarFichasProyecto() {
	            comunes.loadFicha(projects, "proyContenedor", "divFiltrosFichaOrdena")
	    ***REMOVED***


	        jQuery.fn.sort = function () {
	            return this.pushStack([].sort.apply(this, arguments), []);
	    ***REMOVED***;

	        function ordenaMonto(a, b) {
	            if (parseFloat(a.valor_presupuesto) == parseFloat(b.valor_presupuesto)) {
	                return 0;
	        ***REMOVED***
	            return parseFloat(a.valor_presupuesto) > parseFloat(b.valor_presupuesto) ? 1 : -1;
	    ***REMOVED***;
	        function ordenaMontoDesc(a, b) {
	            return ordenaMonto(a, b) * -1;
	    ***REMOVED***;

	        function ordenaProgreso(a, b) {
	            if (parseFloat(a.porcentaje_gastado) == parseFloat(b.porcentaje_gastado)) {
	                return 0;
	        ***REMOVED***
	            return parseFloat(a.porcentaje_gastado) > parseFloat(b.porcentaje_gastado) ? 1 : -1;
	    ***REMOVED***;

	        function ordenaProgresoDesc(a, b) {
	            return ordenaProgreso(a, b) * -1;

	    ***REMOVED***;

	        function ordenaFechaIni(a, b) {
	            return a.FechaInicioProyecto > b.FechaInicioProyecto ? 1 : -1;
	    ***REMOVED***

	        function ordenaFechaIniDesc(a, b) {
	            return ordenaFechaIni(a, b) * -1;
	    ***REMOVED***

        //para aplicar binding agregar function location(){***REMOVED*** al inicio
	    //ko.applyBindings(new location(), $('#projects-list-view')[0]);

	        return {
	            load_filtro_sector: AgregarFiltros

	        ***REMOVED***;

***REMOVED***)
