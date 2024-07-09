var objPresupuestoGeneralPerAnio = JSON.parse(document.body.getAttribute('data-presupuestoGeneralPerAnio'));
var objPresupuestoEjecutadoPorEmergencias = JSON.parse(document.body.getAttribute('data-presupuestoEjecutadoPorEmergencias'));


var cantXPagina = 10;
var findata = 0;
var inidata = 0;
var paginaActual = 1;
var presupuestoEjecutado = 0;
inicializaDatos();

function anioChanged() {

    obtenerPresupuestoGeneralPerAnio($("#filtro_anio_pres_general").val());
    obtenerPresupuestoEjecutadoPorEmergencia($("#filtro_anio_pres_general").val());
    obtenerPresupuestoAsignadoPorEntidadYAnio($("#filtro_anio_pres_general").val());
***REMOVED***
function inicializaDatos() {

    anioChanged();
    obtenerGraficoSankey();
***REMOVED***
function loadData(cb, datos) {
    cb(datos)
***REMOVED***
function graphSankey(contenedor, datos) {
    var height_aux = 0;
    var width_aux = 1100;
    var units = "millones";
    var cant_elementos = 10;
    let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;
    if ($(window).innerWidth() <= width_aux || isMobile) {
        width_aux = 1100;
***REMOVED*** else {
        width_aux = $(".container").innerWidth();
***REMOVED***
    var margin = { top: 10, right: 10, bottom: 10, left: 10 ***REMOVED***,
        width = width_aux - 20 - margin.left - margin.right,
        height = ((cant_elementos) * 50) - margin.top - margin.bottom;
    var format = function (d) {
        return "RD $ " + (d).formatMoney(0, '.', ',') + " " + units;
  ***REMOVED***
        color = d3.scale.category20();

    // append the svg canvas to the page
    var svg = d3.select("#" + contenedor).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(30)
        .nodePadding(20)
        .size([width, height]);
    var path = sankey.link();
    loadData(function (graph) {

        // contents of the function passed to d3.json
        var nodeMap = {***REMOVED***;
        graph.nodes.forEach(function (x) { nodeMap[x.name] = x; ***REMOVED***);
        graph.links = graph.links.map(function (x) {
            return {
                source: nodeMap[x.source],
                target: nodeMap[x.target],
                value: x.value
        ***REMOVED***;
    ***REMOVED***);

        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);

        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
                //return 10;
        ***REMOVED***)
            .sort(function (a, b) { return b.dy - a.dy; ***REMOVED***);

        // add the link titles
        link.append("title")
            .text(function (d) {
                var destino_aux = d.target.name;
                var origen_aux = d.source.name;
                var vec_destino = d.target.name.split("_");
                var vec_origen = d.source.name.split("_");
                if (vec_destino.length > 0) {
                    destino_aux = vec_destino[1];
            ***REMOVED***
                if (vec_origen.length > 0) {
                    origen_aux = vec_origen[1];
            ***REMOVED***

                return origen_aux + " → " +
                    destino_aux + "\n" + format(d.value);
        ***REMOVED***);

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
        ***REMOVED***)
            .call(d3.behavior.drag()
                .origin(function (d) { return d; ***REMOVED***)
                .on("dragstart", function () {
                    this.parentNode.appendChild(this);
            ***REMOVED***)
                .on("drag", dragmove));

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) { return d.dy; ***REMOVED***)
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
        ***REMOVED***)
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);

        ***REMOVED***)
            .append("title")
            .text(function (d) {
                var nombre = d.name;
                var vec_aux = nombre.split("_");
                if (vec_aux.length > 0) {
                    nombre = vec_aux[1];
            ***REMOVED***
                return nombre + "\n" + format(d.value);
        ***REMOVED***);

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; ***REMOVED***)
            .attr("dy", ".2em")
            .style("font-size", "10px")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) {
                var nombre = d.name;
                var vec_aux = nombre.split("_");
                if (vec_aux.length > 0) {
                    nombre = vec_aux[1];
            ***REMOVED***

                return nombre;
        ***REMOVED***)
            .filter(function (d) { return d.x < width / 2; ***REMOVED***)
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + (
                    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                ) + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);
    ***REMOVED***
  ***REMOVED*** datos);
***REMOVED***


function recalcularSize(datos) {
    var height_aux = 0;
    var width_aux = 1050;
    var units = "millones";
    var cant_elementos = 8;
    var factor_multiplicador = 25;
    if (datos != undefined && datos != null) {
        var cant_aux = datos.cant_nodos;
        if (cant_aux != undefined) {
            if (parseInt(cant_aux) < cant_elementos) {
                factor_multiplicador = 20;
        ***REMOVED*** else {
                cant_elementos = cant_aux;
        ***REMOVED***
    ***REMOVED*** else {
            cant_elementos = (datos.nodes.length / 1);

    ***REMOVED***
***REMOVED***

    let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;

    if ($(window).innerWidth() <= width || isMobile) {
        width_aux = 1050;

***REMOVED*** else {
        width_aux = $(".container").innerWidth();
***REMOVED***

    var margin = { top: 10, right: 10, bottom: 10, left: 10 ***REMOVED***,
        width = width_aux - 20 - margin.left - margin.right,
        height = ((cant_elementos) * factor_multiplicador) - margin.top - margin.bottom;

    return alturas = { "margin": margin, width: width, height: height ***REMOVED***;
***REMOVED***


function obtenerPresupuestoEjecutadoPorEmergencia(anio) {

    var $carousel = $('.carouselData').flickity({
        initialIndex: 1,
        pageDots: false,
        groupCells: true,
        contain: true,
        prevNextButtons: true,
        freeScroll: true,
        wrapAround: false
***REMOVED***);
    var $cellElements = $carousel.flickity('getCellElements');
    $carousel.flickity('remove', $cellElements)


    var presupuestoEjecutadoPorEmergencia = objPresupuestoEjecutadoPorEmergencias.filter(x => x.anio == anio);

       

    if (presupuestoEjecutadoPorEmergencia != undefined && presupuestoEjecutadoPorEmergencia.length > 0) {

        for (var i = 0; i < presupuestoEjecutadoPorEmergencia.length; i++) {
            var item = presupuestoEjecutadoPorEmergencia[i];
            emergenciaCarrusel = "<div class='carousel-cell col-lg-3' style='height:200px;'><div class='card'><div class='card-header'>";//
            emergenciaCarrusel = emergenciaCarrusel + item.nombre + "</div><div class='card-body d-flex'><span class='bigNumber'>";
            emergenciaCarrusel = emergenciaCarrusel + "$ " + parseFloat(item.presupuestoEjecutado).toLocaleString('es-DO') + " millones </span><span class='label'>Monto total ejecutado</span></div>";
            if (item.enlace == "") {
                emergenciaCarrusel = emergenciaCarrusel + "</div></div>";
        ***REMOVED***
            else {
                let footerEmergencia = "<div class='card-footer'><a class='btn btn-outlined' href=" + item.enlace + ">Más información <span class='glyphicon glyphicon-arrow-right'></span></a></div>";
                emergenciaCarrusel = emergenciaCarrusel + footerEmergencia + "</div></div>";
        ***REMOVED***
         

            var $cellElems = $(emergenciaCarrusel);
            $carousel.flickity('append', $cellElems);
            $carousel.flickity('resize');

    ***REMOVED***

***REMOVED*** else {

       
        if (presupuestoEjecutado == undefined || presupuestoEjecutado == 0) {
            
            let emergenciaOtrosCarrusel = "<div class='carousel-cell' style='height:200px;'>Sin datos de ejecución para el año seleccionado</div>";

            var $cellElems = $(emergenciaOtrosCarrusel);
            $carousel.flickity('append', $cellElems);
            $carousel.flickity('resize');   
   
    ***REMOVED*** 
        else {

            let emergenciaOtrosCarrusel = "<div class='carousel-cell col-lg-3'><div class='card'><div class='card-header'>";//
            emergenciaOtrosCarrusel += "Otras</div><div class='card-body d-flex'><span class='bigNumber'>";
            emergenciaOtrosCarrusel += "$ " + parseFloat(presupuestoEjecutado).toLocaleString('es-DO') + " millones </span><span class='label'>Monto total ejecutado</span></div>";
            emergenciaOtrosCarrusel += "</div></div>";

            var $cellElems = $(emergenciaOtrosCarrusel);
            $carousel.flickity('append', $cellElems);
            $carousel.flickity('resize');   
    ***REMOVED***

***REMOVED***

***REMOVED***
function obtenerPresupuestoGeneralPerAnio(anio) {
    let presupuestoAnio = objPresupuestoGeneralPerAnio.filter(x => x.anio == anio);
    if (presupuestoAnio != undefined && presupuestoAnio.length > 0) {

        presupuestoEjecutado = presupuestoAnio[0].presupuestoEjecutado;
        $("#presupuestoAsignadoPorAnio").text("$ " + parseFloat(presupuestoAnio[0].presupuestoAsignado).toLocaleString('es-DO') + " millones");
        $("#presupuestoEjecutadoPorAnio").text("$ " + parseFloat(presupuestoEjecutado).toLocaleString('es-DO') + " millones");
        $("#porcentajeEjecutadoPorAnio").text(presupuestoAnio[0].porcentajeAvance);
***REMOVED***
***REMOVED***
function obtMatrizData(data) {
    var cant_nodos_1 = 0;
    var cant_nodos_2 = 0;
    var cant_nodos_3 = 0;
    var cant_nodos_fin = 0;
    var obj_nodos = [];
    var obj_links = [];
    $.each(data, function (key, value) {
        cant_nodos_1 += 1;
        var test = false;
        var obj_aux = { name: value.nombre ***REMOVED***;
        var nomFuente = value.nombre;
        obj_nodos.push(obj_aux);
        $.each(value.detalles, function (key, value) {
            cant_nodos_2 += 1;
            var nomOrganismo = value.nombre;
            var valor_organismo = (value.avance / 1000000);

            //NomOrganismo
            test = obj_nodos.some(item => item.name === value.nombre);
            if (test == false) {
                obj_aux = { name: value.nombre ***REMOVED***;
                obj_nodos.push(obj_aux);
        ***REMOVED***

            var objIndex = obj_links.findIndex((obj => obj.target == nomOrganismo && obj.source == nomFuente));
            if (objIndex > -1) {
                obj_links[objIndex].value = obj_links[objIndex].value + valor_organismo;
        ***REMOVED*** else {
                var obj_links_aux = { source: nomFuente, target: nomOrganismo, value: valor_organismo ***REMOVED***
                obj_links.push(obj_links_aux);
        ***REMOVED***

            $.each(value.detalles, function (key, value) {
                //NomPrograma
                cant_nodos_3 += 1;
                var nomPrograma = value.nombre;
                var valor_programa = (value.avance / 1000000);
                test = obj_nodos.some(item => item.name === value.nombre);
                if (test == false) {
                    obj_aux = { name: value.nombre ***REMOVED***;
                    obj_nodos.push(obj_aux);
            ***REMOVED***

                var objIndex = obj_links.findIndex((obj => obj.target == nomPrograma && obj.source == nomOrganismo));
                if (objIndex > -1) {
                    obj_links[objIndex].value = obj_links[objIndex].value + valor_programa;
            ***REMOVED*** else {
                    var obj_links_aux = { source: nomOrganismo, target: nomPrograma, value: valor_programa ***REMOVED***
                    obj_links.push(obj_links_aux);
            ***REMOVED***

        ***REMOVED***);


    ***REMOVED***);
***REMOVED***);

    cant_nodos_fin = cant_nodos_1;
    if (cant_nodos_2 > cant_nodos_1) {
        cant_nodos_fin = cant_nodos_2;
***REMOVED***
    if (cant_nodos_3 > cant_nodos_2) {
        cant_nodos_fin = cant_nodos_3;
***REMOVED***

    var datos_final =
    {
        "links": obj_links,
        "nodes": obj_nodos,
        "cant_nodos_fin": {
            cant: cant_nodos_fin
    ***REMOVED***
***REMOVED***;

    return datos_final;

***REMOVED***
function obtenerGraficoSankey() {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosEmergencias/ObtDistribucionPresupuestalGeneralPorTipoEmergencia",
        cache: false,
        success: function (result) {
            if (result.status == true) {
                var data = result.distribucionItem;
                if (data.length > 0) {
                    var datos = obtMatrizData(data);
                    $("#sankey_presupuesto_general").html("");
                    graphSankey("sankey_presupuesto_general", datos);
            ***REMOVED***

        ***REMOVED*** else {
                alert("Error: " + result.message, function () {

            ***REMOVED***);
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


//FUNCION PARA PINTAR PRESUPUESTO ASIGNADO POR ENTIDAD DEPENDIENDO DEL AÑO
function obtenerPresupuestoAsignadoPorEntidadYAnio(anio) {
    $("#anioPresupuestoEjecutadoEmergencias").text(anio);
    $("#anioPresupuestoEntidad").text(anio);
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosEmergencias/GetConsolidadoPresuAsignadoPorEntidadAnio",

        cache: false,
        success: function (data) {
            var data = data.filter(x => x.anio.toString() == $("#filtro_anio_pres_general").val());
            var i_aux = 0;
            var j_aux = 0;
            var k_aux = 0;
            var total_avance = 0;
            var total_presupuesto = 0;
            var html_str = '<div class="panel-group accordion" role="tablist" aria-multiselectable="true">';
            for (var i = 0; i < data.length; i++) {
                var nomCollapse = "collapseOne_" + i_aux.toString() + "_" + j_aux.toString();
                var nomHeading = "headingOne_" + i_aux.toString() + "_" + j_aux.toString();
                total_avance += data[i].total_avance;
                total_presupuesto += data[i].total_presupuesto;
                html_str += '<div class="panel panel-default">';
                html_str += '<div class="panel-heading" role="tab" id="' + nomHeading + '">';
                html_str += '<div class="panel-title">';
                html_str += '<a role="button" id="a_' + data[i].idItem + '" class="prueba_enlace" item="' + data[i].idItem + '" data-toggle="collapse" data-parent="#accordion" href="#' + nomCollapse + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                html_str += '<div class="head">';
                html_str += '<div class="mainData">';
                html_str += '<span class="labelTit">Institución</span>';
                html_str += '<span class="td1">' + data[i].nombre + '</span>';
                html_str += '</div>';
                html_str += '<div class="data2">';
                html_str += '<span class="labelTit">Presupuestado</span>';
                html_str += '<span class="td1">RD $ ' + (data[i].total_presupuesto / 1000000).formatMoney(2, '.', ',').toString() + ' Millones</span>';
                html_str += '</div>';
                html_str += '<div class="data2">';
                html_str += '<span class="labelTit">Ejecutado</span>';
                html_str += '<span class="td1">RD $ ' + (data[i].total_avance / 1000000).formatMoney(2, '.', ',').toString() + ' Millones</span>';
                html_str += '</div>';
                html_str += '<div class="data2">';
                html_str += '<span class="labelTit">Cumplimiento</span>';
                html_str += '<span class="td1">' + (data[i].porcentajeCumplimiento).formatMoney(2, '.', ',').toString() + ' %</span>';
                html_str += '</div>';
                html_str += '</div>';
                html_str += '</a>';
                html_str += '</div>';
                html_str += '</div>';
                //nivel 2
                html_str += '<div id="' + nomCollapse + '" class="panel-collapse collapse nivel1" role="tabpanel" aria-labelTitledby="' + nomHeading + '" item="' + data[i].nombre.toUpperCase() + '">';

                html_str += '<div class="panel-body">';
                for (var j = 0; j < data[i].detalles.length; j++) {

                    var nomNivel2 = "accordion_l2_" + i_aux.toString() + "_" + j_aux.toString();
                    var headNivel2 = "headLevel2_" + i_aux.toString() + "_" + j_aux.toString();
                    var panelHijo2 = "c2_" + j_aux.toString() + "_" + k_aux.toString();
                    var nomHeadLevel3 = "headLevel3_" + j_aux.toString() + "_" + k_aux.toString();
                    html_str += '<div class="panel-group nivel22" id="' + nomNivel2 + '" role="tablist" aria-multiselectable="true">';
                    html_str += '<div class="panel panel-default">';
                    html_str += '<div class="panel-heading" role="tab" id="' + headNivel2 + '">';
                    html_str += '<div class="panel-title">';
                    html_str += '<a role="button" data-toggle="collapse" data-parent="#' + nomNivel2 + '" href="#' + panelHijo2 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                    html_str += '<div class="head">';
                    html_str += '<div class="data2 mainData">';
                    html_str += '<span class="labelTit">Unidad ejecutora</span>';
                    html_str += '<span class="td1p">' + data[i].detalles[j]['nomCapitulo'] + '</span>';

                    html_str += '</div>';
                    html_str += '<div class="data2">';
                    html_str += '<span class="labelTit">Presupuestado</span>';
                    html_str += '<span class="td1p">RD $ ' + (data[i].detalles[j]['presupuesto'] / 1000000).formatMoney(2, '.', ',').toString() + ' Millones</span>';
                    html_str += '</div>';
                    html_str += '<div class="data2">';
                    html_str += '<span class="labelTit">Ejecutado</span>';
                    html_str += '<span class="td1p">RD $ ' + (data[i].detalles[j]['avance'] / 1000000).formatMoney(2, '.', ',').toString() + ' Millones</span>';
                    html_str += '</div>';
                    html_str += '<div class="data2">';
                    html_str += '<span class="labelTit">Cumplimiento</span>';
                    html_str += '<span class="td1p">' + (data[i].detalles[j]['porcentajeCumplimiento']).formatMoney(2, '.', ',').toString() + ' %</span>';
                    html_str += '</div>';
                    html_str += '</div>';
                    html_str += '</a>';
                    html_str += '</div>';
                    html_str += '</div>';
                    //nivel 3
                    html_str += ' <div id="' + panelHijo2 + '" class="panel-collapse collapse level3 nivel2" role="tabpanel" aria-labelledby="' + nomHeadLevel3 + '" entidad="' + data[i].detalles[j]['nomCapitulo'].toUpperCase() + '">';
                    html_str += '<div class="panel-body">';

                    for (var k = 0; k < data[i].detalles[j].detalles.length; k++) {
                        var nomNivel3 = "accordion_l3_" + j_aux.toString() + "_" + k_aux.toString();

                        html_str += '<div class="panel-group nivel33" id="' + nomNivel3 + '" role="tablist" aria-multiselectable="true">';
                        html_str += '<div class="panel panel-default">';
                        html_str += '<div class="panel-heading" role="tab" id="' + nomHeadLevel3 + '">';
                        html_str += '<div class="panel-title">';
                        html_str += '<a role="button" data-toggle="collapse" data-parent="#' + nomNivel3 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                        html_str += '<div class="head">';
                        html_str += '<div class="data2 mainData">';
                        html_str += '<span class="labelTit">Programa</span>';
                        html_str += '<span class="td1p">' + data[i].detalles[j].detalles[k]['nomConcepto'] + '</span>';
                        html_str += '</div>';
                        html_str += '<div class="data2">';
                        html_str += '<span class="labelTit">Presupuestado</span>';
                        html_str += '<span class="td1p">$ ' + (data[i].detalles[j].detalles[k]['presupuesto'] / 1000000).formatMoney(2, '.', ',').toString() + ' Millones</span>';
                        html_str += '</div>';
                        html_str += '<div class="data2">';
                        html_str += '<span class="labelTit">Ejecutado</span>';
                        html_str += '<span class="td1p">$ ' + (data[i].detalles[j].detalles[k]['avance'] / 1000000).formatMoney(2, '.', ',').toString() + ' Millones</span>';
                        html_str += '</div>';
                        html_str += '<div class="data2">';
                        html_str += '<span class="labelTit">Cumplimiento</span>';
                        html_str += '<span class="td1p">$ ' + (data[i].detalles[j].detalles[k]['porcentajeCumplimiento']).formatMoney(2, '.', ',').toString() + ' %</span>';
                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</a>';
                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</div>';
                        k_aux++;
                ***REMOVED***
                    html_str += '</div>';
                    html_str += '</div>';
                    html_str += '</div>';
                    html_str += '</div>';
                    j_aux++;
            ***REMOVED***
                html_str += '</div>';
                html_str += '</div>';
                html_str += '</div>';
                i_aux++;
        ***REMOVED***
            html_str += '<div id="divTotales" class="summUp">';
            html_str += '<div class="panel-title">';
            html_str += '<div class="head">';
            html_str += '<div class="mainData">';
            html_str += '<span class="labelTit">&nbsp;</span>';
            html_str += '<span class="td1">Totales</span>';
            html_str += '</div>';
            html_str += '<div class="data2">';
            html_str += '<span class="labelTit">Presupuestado</span>';
            html_str += '<span class="td1">RD $' + (total_presupuesto / 1000000).formatMoney(2, '.', ',').toString() + ' Millones</span>';
            html_str += '</div>';
            html_str += '<div class="data2">';
            html_str += '<span class="labelTit">Ejecutado</span>';
            html_str += '<span class="td1">RD $' + (total_avance / 1000000).formatMoney(2, '.', ',').toString() + ' Millones</span>';
            html_str += '</div>';

            html_str += '<div class="data2">';
            html_str += '<span class="labelTit">Cumplimiento</span>';
            if (total_presupuesto == 0) html_str += '<span class="td1">' + 0.00 + ' %</span>';
            else html_str += '<span class="td1">' + (total_avance * 100 / total_presupuesto).formatMoney(2, '.', ',').toString() + ' %</span>';
            html_str += '</div>';
            html_str += '</div>';
            html_str += '</div>';
            html_str += '</div>';
            html_str += '<div id="divPagFichas">';
            html_str += '</div>';
            html_str += "</div>";
            $("#divPresupuestoGeneralAsignadoPorEntidad").html(html_str);
      ***REMOVED***
        error: function (response) {
            alert(response.responseText);
      ***REMOVED***
        failure: function (response) {
            alert(response.responseText);
    ***REMOVED***
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