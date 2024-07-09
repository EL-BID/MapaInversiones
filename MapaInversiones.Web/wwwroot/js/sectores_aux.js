﻿var projectsPerEstado = JSON.parse(document.body.getAttribute('data-projectsPerEstado'));
var ProjectsPerSectorGroup = JSON.parse(document.body.getAttribute('data-projectsPerSectorGroup'));
var proyectos_eje = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));

var cantXPagina = 5;
var findata = 0;
var inidata = 0;
var proyectos = [];
var paginaActual = 1;

GetAnio()
loadProyectosEjecucion(proyectos_eje);
loadConsolidaEstados();
loadProyectosPorDepartamento();
function datosInicial(annio, estado) {


    
    GetRecursosPorNivelYAnio(annio, estado);

***REMOVED***
function formatMoney(number, c, d, t) {
    var n = number,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
***REMOVED***

function GetAnio() {
    proyectos = [];
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosSectores/GetAniosProyectos",
        type: "GET",
        data: {
            idSector: $("#idSector").val(),
            idDepto: $("#idDepto").val()
    ***REMOVED***
***REMOVED***).done(function (data) {
        if (data.anios) { 
            var j = 0;
            var annioinicial = "";
            var select = "";
            for (var i = 0; i < data.anios.length; i++) {

                if (i == j) {
                    select = select + '<option selected value="' + data.anios[i].toString() + '">' + data.anios[i].toString() + '</option>';
                    annioinicial = data.anios[i].toString();
            ***REMOVED*** else {
                    select = select + '<option value="' + data.anios[i].toString() + '">' + data.anios[i].toString() + '</option>';
            ***REMOVED***

        ***REMOVED***

            $('#anioProyecto').html(select).fadeIn();

            datosInicial(annioinicial, $("#estadoProyecto").val());
    ***REMOVED***
***REMOVED***
    ).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);

***REMOVED***
function loadConsolidaEstados() {
    var txt_aux = "";

    for (var i = 0; i < projectsPerEstado.length; i++) {
        txt_aux += "<div class='box'>"
            + "<div class='h3'>" + projectsPerEstado[i].rawValue.toString() + "</div>"
            + "<div style='margin-top:-15px;'>Proyectos en</div>"
            + "<div style='margin-top:-5px;'>" + projectsPerEstado[i].label + "</div>"
            + "</div>";
***REMOVED***

    $("#divTxtTodosProy").html(txt_aux);



***REMOVED***


function loadProyectosPorDepartamento() {

    for (var i = 0; i < ProjectsPerSectorGroup.length; i++) {
        ProjectsPerSectorGroup[i].value = parseFloat(ProjectsPerSectorGroup[i].value);
        ProjectsPerSectorGroup[i].rawValue = parseFloat(ProjectsPerSectorGroup[i].rawValue);
***REMOVED***
    var visualization = d3plus.viz()
        .container("#divGraphProySector")
        .data(ProjectsPerSectorGroup)
        .type({ "value": "tree_map", "mode": "sqarify" ***REMOVED***)
        .id({ "value": ["labelGroup"], "grouping": true ***REMOVED***)
        .depth(1)
        .size("rawValue")
        .font({ "family": "inherit" ***REMOVED***)
        .format({
            "text": function (text, params) {
                if (text == "rawValue") {
                    return "Proyectos";
            ***REMOVED*** else if (text == "label") {
                    return "Estado";
            ***REMOVED*** else if (text == "labelGroup") {
                    return "Provincia";
            ***REMOVED*** else if (text == "share") {
                    return "Participación";
            ***REMOVED***
                else if (text == "including") {
                    return "Incluye";
            ***REMOVED***
                else {
                    return d3plus.string.title(text, params);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***)
        .background("rgba(255,255,255,0)")
        .labels({ "align": "left", "valign": "top", "font": { "family": "inherit", "size": 14, "weight": "bold" ***REMOVED***, "resize": true ***REMOVED***)
        .tooltip(["labelGroup"])   // list the keys to show in tooltip
        //.color("labelGroup")
        .color({
            "scale": ["#779d5c", "#e6d6c5", "#79a5d7", "#c16a19", , "#3e76c2", "#264c7f", "#4f7a33", "#99a294", "#fcc71b", "#f6b25f", "#345ca4", "#b6babf", "#cc9c04", "#c1dcc2", "#be9767", "#7a390e", "#fcdc64"],
    ***REMOVED***)
        .height({ "max": 419, "small": 200, "secondary": 100, "value": 419 ***REMOVED***)
        .legend({
            "align": "middle",
            "size": [50, 80],
            "labels": true,
            "value": true,
            "filters": false,
            "data": true
            , "order": {
                "sort": "desc",
                "value": "size"
        ***REMOVED***
    ***REMOVED***)
        .resize(true)
        .mouse({
            "move": true,
            "click": function (node, viz) {
                $("#idDepto").val(node.alias);
                //alert(node.alias);
                $("#estadoProyecto").val("");
                $("#deptoproyecto").text("Proyectos en " + node.labelGroup)
                GetAnio();
                
        ***REMOVED***
    ***REMOVED***).draw();

***REMOVED***






function GetRecursosPorNivelYAnio(annio, estado) {
    proyectos = [];
    $("#divListadoInstituciones").html("");
    $("#divPagFichas").html("");
    $("#divListadoInstituciones").html("<div id='search-loading'><p><i class='fa fa-spinner fa-spin'></i> Buscando...</p></div>");
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosSectores/ConsolidadoProyectosAnioEstado",
        type: "GET",
        data: {
            anio: annio,
            estado: estado,
            idSector: $("#idSector").val(),
            idDepto: $("#idDepto").val() 
    ***REMOVED***
***REMOVED***).done(function (data) {
        $("#divListadoInstituciones").html("");
        proyectos = data.proyectosAprobados;
        inidata = ((paginaActual - 1) * cantXPagina);
        findata = (paginaActual * cantXPagina) - 1;
        var institucionesPorPagina = jQuery.grep(proyectos, function (n, i) {
            return (i >= inidata && i <= findata);
    ***REMOVED***);
        if (institucionesPorPagina.length > 1) {
            institucionesPorPagina = institucionesPorPagina.sort((a, b) => {
                if (a.vlrTotalProyectoFuenteRegalias > b.vlrTotalProyectoFuenteRegalias) return -1;
                if (a.vlrTotalProyectoFuenteRegalias < b.vlrTotalProyectoFuenteRegalias) return 1;
                return 0;
        ***REMOVED***);
    ***REMOVED***
        GetListadoProyectos(institucionesPorPagina);
        dibujarPagNumeradas(paginaActual);
***REMOVED***).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);

***REMOVED***


function GetListadoProyectos(institucionesPorPagina) {

    $("#divListadoInstituciones").html("");

    var html_list = '<div class="card-entidades-group">';
    for (var i = 0; i < institucionesPorPagina.length; i++) {

        html_list += '<div id="institucion_' + i.toString() + '" class="card d-flex">';
        html_list += '<div class="headEnt">';
        html_list += '<div class="data1 mainDataEntidad" style="min-width: 60% !important;max-width:60% !important;"><span class="labelTit">Código SNIP: <strong>' + institucionesPorPagina[i]['codigoSnip'] +'</strong></span>';
        html_list += '<span class="td1">' + institucionesPorPagina[i]['nombreProyecto'] + ' </span>';
        html_list += '</div>';
        html_list += '<div class="data1"><span class="labelTit">Valor inicial estimado</span><span class="td1">$ ' + institucionesPorPagina[i]['vlrTotalProyectoFuenteRegalias'].formatMoney(2, '.', ',').toString() + ' </span ></div > ';
        html_list += '<div class="data1"><span class="labelTit">Valor ejecutado</span><span class="td1">$ ' + institucionesPorPagina[i]['vlrTotalProyectoTodasLasFuentes'].formatMoney(2, '.', ',').toString() + ' </span></div>';
        html_list += '</div>';
        html_list += '<div class="btn-action">';
        html_list += '<div class="btnPerfil">';
        html_list += '<a target="_blank" href="/perfilProyecto/' + institucionesPorPagina[i]['idProyecto'] + '" class="text-small"><i class="material-icons md-18">arrow_forward</i><br /> <span>VER PROYECTO</span></a>';
        html_list += '</div>';
        html_list += '</div>';
        html_list += '</div>';

***REMOVED***
    html_list += '</div>';
    $("#divListadoInstituciones").html(html_list);
    dibujarPagNumeradas(1);
***REMOVED***

//paginador

function dibujarPagNumeradas(paginaActual) {
    var totalNumber = proyectos.length;

    if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
        totalPages = totalPages + 1;
***REMOVED***
    var pagActual = parseInt(paginaActual);

    var totalNumerosPaginador = 10;
    $("#divPagFichas").html("");

    var pagEnlace = "";

    var cociente = Math.floor(pagActual / totalNumerosPaginador);
    var residuo = pagActual % totalNumerosPaginador;
    var inicio = 1;
    if (residuo == 0) {
        inicio = (pagActual - totalNumerosPaginador) + 1;
***REMOVED*** else {
        inicio = (cociente * totalNumerosPaginador) + 1;
***REMOVED***

    var fin = inicio + (totalNumerosPaginador - 1);
    if (totalPages < totalNumerosPaginador) {
        fin = totalPages;
***REMOVED***
    if (fin > totalPages) {
        fin = totalPages;
***REMOVED***
    if (pagActual > totalNumerosPaginador && totalPages >= totalNumerosPaginador) {
        pagEnlace += '<a id="page_left" role="button" class="material-icons md-24" data-page="' + (inicio - totalNumerosPaginador) + '"><span class="">chevron_left</span></a>';
***REMOVED***


    for (var i = inicio; i <= fin; i++) {
        if (i == pagActual) {
            pagEnlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
    ***REMOVED*** else {
            pagEnlace += '<a class="page_left" role="button" data-page="' + i + '">';
            pagEnlace += '<span class="glyphicon"></span>';
            pagEnlace += '<text class="paginacion">' + i + '</text>';
            pagEnlace += '</a>';
    ***REMOVED***

***REMOVED***

    if (pagActual < totalPages) {
        if (fin < totalPages) {
            pagEnlace += '<a id="page_right" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
    ***REMOVED***
***REMOVED***

    $("#divPagFichas").html(pagEnlace);

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
        paginaActual = $(this).attr("data-page");
        $("#divListadoInstituciones").empty();
        inidata = ((paginaActual - 1) * cantXPagina);
        findata = (paginaActual * cantXPagina) - 1;
        var institucionesPorPagina = jQuery.grep(proyectos, function (n, i) {
            return (i >= inidata && i <= findata);
    ***REMOVED***);
        if (institucionesPorPagina.length > 1) {
            institucionesPorPagina = institucionesPorPagina.sort((a, b) => {
                if (a.vlrTotalProyectoFuenteRegalias > b.vlrTotalProyectoFuenteRegalias) return -1;
                if (a.vlrTotalProyectoFuenteRegalias < b.vlrTotalProyectoFuenteRegalias) return 1;
                return 0;
        ***REMOVED***);
    ***REMOVED***
        GetListadoProyectos(institucionesPorPagina);
        dibujarPagNumeradas(paginaActual);
***REMOVED***);

***REMOVED***

function loadProyectosEjecucion(resultados) {
    var limite = 60;
    $("#divNoEncontradoEjec").hide();
    $("#divNoExistenEjec").hide();
    if (resultados.length > 0) {
        for (var i = 0; i < resultados.length; i++) {
            var valor_aux = parseFloat(resultados[i].approvedTotalMoney);
            var nombre_aux = resultados[i].NombreProyecto.toString();
            if (nombre_aux.length > limite) {
                nombre_aux = nombre_aux.substr(0, limite) + "...";
        ***REMOVED***

            var div_proy = d3.select("#divContenedorFichas")
            var div_ficha = div_proy.append("div")
            div_ficha.attr("class", "project-col project-col-carusel")
            var div_card = div_ficha.append("div").attr("class", "project-card")
            var div_borde = div_card.append("div").attr("class", "card h-100 shadow border-0")
            div_borde.append("div").attr("class", "img-card").attr("style", "background: url('/img/TTpic_01_MD.jpg')")
            div_borde.append("div").attr("class", "labelCategory").text(resultados[i].NombreSector)
            var div_caption = div_borde.append("div").attr("class", "caption")
            var div_enlace = div_caption.append("a").attr("href", "../../perfilProyecto/" + resultados[i].IdProyecto).attr("target", "_blank");
            //var div_enlace = div_caption.append("a").attr("target", "_blank")
            div_enlace.append("h3").text(nombre_aux)
            if (resultados[i].approvedTotalMoney > 1000000) {
                div_enlace.append("div").attr("class", "amount").append("span").attr("class", "bigNumber").text('$ ' + formatMoney(valor_aux / 1000000, 2, ".", ",").toString() + ' Millones');
        ***REMOVED*** else {
                div_enlace.append("div").attr("class", "amount").append("span").attr("class", "bigNumber").text('$ ' + formatMoney(valor_aux / 1, 2, ".", ",").toString() + ' Millones');

        ***REMOVED***

            div_card.append("div").attr("class", "clearfix")
            var div_porcentaje = div_card.append("div").attr("class", "percentage")
            div_porcentaje.append("div").attr("class", "completed").attr("style", "width:" + resultados[i].porcentajeGastado + "%")
            var div_indicador = div_porcentaje.append("div").attr("class", "indicatorValues")
            div_indicador.append("span").attr("class", "startPoint").html(resultados[i].MesInicioProyecto + "<br/>" + resultados[i].AnioInicioProyecto)
            div_indicador.append("span").attr("class", "endPoint").html(resultados[i].MesFinProyecto + "<br/>" + resultados[i].AnioFinProyecto)
            div_indicador.append("span").attr("class", "middlePoint text-center").html(resultados[i].porcentajeGastado + " %" + "<br/>" + "gastado")
            div_card.append("div").attr("class", "clearfix")

            var div_detalles = div_card.append("div").attr("class", "row detailedLinks")

            var div_photo = div_detalles.append("div").attr("class", "col-6")
            var enlace_photo = div_photo.append("a").attr("href", "../projectprofile/" + resultados[i].IdProyecto)
            enlace_photo.append("span").attr("class", "material-icons").text("photo_library")
            enlace_photo.append("span").attr("class", "text-ic").text("(" + resultados[i].cantidadFotos + ")")

            var div_question = div_detalles.append("div").attr("class", "col-6")
            var enlace_question = div_question.append("a").attr("href", "../projectprofile/" + resultados[i].IdProyecto)
            enlace_question.append("span").attr("class", "material-icons").text("question_answer")
            enlace_question.append("span").attr("class", "text-ic").text("(" + resultados[i].Comentarios + ")")

    ***REMOVED***
***REMOVED***
    else {
        //no existen proyectos en ejecucion
        $("#divNoExistenEjec").show();

***REMOVED***


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

function quitardecimal(num) {
    if (num != undefined) {
        if (isNaN(num)) {
            var num = num.toString().split(',');
            return num[0]
    ***REMOVED***
        else {
            //var num = num.toFixed(0);
            return num;
    ***REMOVED***
***REMOVED***

***REMOVED***

$('#anioProyecto').on('change', function () {
    datosInicial(this.value, $("#estadoProyecto").val());
***REMOVED***);


$('#estadoProyecto').on('change', function () {
    datosInicial($("#anioProyecto").val() ,this.value);
***REMOVED***);