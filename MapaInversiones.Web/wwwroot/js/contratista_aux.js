﻿var contratos_anyo_data = undefined;
var contratos_valor_data = undefined;
var contratos_tipo_local = undefined;
var contratos_tipo_regional = undefined;
var contratos_tipo_all = undefined;

var contratistaData = JSON.parse($('#secInfoContratos').attr('data-contratista'));
var ruc_contratista = null;

if (contratistaData != null && contratistaData != undefined && contratistaData.length > 0) {
    ruc_contratista = contratistaData[0].contratista_id;
***REMOVED***

var done_graficas = 0;
var cant_graficas = 5;
var cant_contratos = 20;
var scrol = 0;


inicializaDatos();

function inicializaDatos() {


    getAnnio();


***REMOVED***


function getGraficasAll() {
    if (ruc_contratista != undefined && ruc_contratista != null && ruc_contratista != "") {
        getInfoGraficaContratosPerAnyo();
        getInfoGraficaValorContratosPerAnyo();
***REMOVED***

***REMOVED***

function configuraEnlaceContratista() {
    //$(".enlace_contratista").click(function () {
    //    var ruc = $(this).attr('data-parameter');
    //    var dataValue = $(this).attr('data-parameter'),
    //        dataType = $(this).attr('data-type').toLowerCase();
    //    document.cookie = "ruc=" + ruc + ";path=/;";
    //    var url = "/contratista?" + dataType + "=" + dataValue;
    //    window.location.href = url;

    //***REMOVED***);


***REMOVED***

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
***REMOVED***

function getInfoGraficaContratosPerAnyo() {
    var params_usu = { "Contratista": ruc_contratista***REMOVED***;
    $("#divGraphContratosCantidad").html("");
    $("#divContenedorContratosCantidad").css("display", "none");

    $("#divGraphContratosCantidadCa").css("display", "");

    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosContratos/DataContratosAnios",
        cache: false,
        data: params_usu,
        success: function (data) {
            $("#divGraphContratosCantidad").html("");
            $("#divGraphContratosCantidadCa").css("display", "none");

            contratos_anyo_data = data.contratosPerAnyo;

            if (contratos_anyo_data != undefined && contratos_anyo_data.length > 0) {
                $("#secCantidadContrato").css("display", "");
                $("#divContenedorContratosCantidad").css("display", "");
                $("#divGraphContratosCantidad").css("display", "");
                //barra_vertical("divGraphContratosCantidad", contratos_anyo_data, "CANTIDAD DE CONTRATOS POR AÑO", "#0382B9", "Contratos");
                loadBarChartUnidades(contratos_anyo_data,"divGraphContratosCantidad");
        ***REMOVED*** else {
                $("#secCantidadContrato").css("display", "none");
                $("#divContenedorContratosCantidad").css("display", "none");
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

function getInfoGraficaValorContratosPerAnyo() {
    var params_usu = { "Contratista": ruc_contratista ***REMOVED***;
    $("#divGraphContratosValor").html("");
    $("#divContenedorContratosValor").css("display", "none");

    $("#divGraphContratosValorCa").css("display", "");

    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosContratos/DataValorContratosAnios",
        cache: false,
        data: params_usu,
        success: function (data) {
            $("#divGraphContratosValor").html("");
            $("#divGraphContratosValorCa").css("display", "none");

            contratos_valor_data = data.contratosPerAnyo;

            if (contratos_valor_data != undefined && contratos_valor_data.length > 0) {
                $("#secValorContrato").css("display", "");
                $("#divContenedorContratosValor").css("display", "");
                $("#divGraphContratosValor").css("display", "");
                //barra_vertical("divGraphContratosValor", contratos_valor_data, "VALOR DE CONTRATOS POR AÑO", "#C51B4C", "Monto");
                loadBarChartDinero(contratos_valor_data, "divGraphContratosValor");
        ***REMOVED*** else {
                $("#secValorContrato").css("display", "none");
                $("#divContenedorContratosValor").css("display", "none");
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



function loadBarChartUnidades(objData, divContenedor) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.BarChart()
            .select("#" + divContenedor)
            .translate(function (d) {
                var traduc_aux = (d.toString());
                //alert(d);
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
            ***REMOVED*** else if (d === "Click to Expand") {
                    traduc_aux = "Clic para Expandir";
            ***REMOVED*** else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
            ***REMOVED***
                else if (d === "Click to Hide") {
                        traduc_aux = "Clic para Ocultar";
            ***REMOVED***
                else if (d === "Shift+Click to Highlight") {
                    traduc_aux = "Mayús + clic para resaltar";
            ***REMOVED***
                else {
                    traduc_aux = d;
            ***REMOVED***
                return traduc_aux;
        ***REMOVED***)
            .config({
                data: objData,
                groupBy: "labelGroup",
                x: "label",
                y: "rawValue",
                shapeConfig: {
                    label: false,

              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"];
                  ***REMOVED***
                    tbody: [
                        [function (d) { return d["rawValue"].formatMoney(0, '.', ',').toString()+" contratos"***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: " ",
                    scale: "pow",
              ***REMOVED***
                xConfig: {
                    fontsize: "2px",
                    size: "2px"
              ***REMOVED***
               // legend: false
        ***REMOVED***)
            .barPadding(0)
            .groupPadding(50)
            .colorScale(["#4DE0E3", "#3899CD"])
            .height(400)
            .render();
***REMOVED***
***REMOVED***

function loadBarChartDinero(objData, divContenedor) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.BarChart()
            .select("#" + divContenedor)
            .translate(function (d) {
                var traduc_aux = (d.toString());
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
            ***REMOVED*** else if (d === "Click to Expand") {
                    traduc_aux = "Clic para Expandir";
            ***REMOVED*** else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
            ***REMOVED***
                else if (d === "Click to Hide") {
                    traduc_aux = "Clic para Ocultar";
            ***REMOVED***
                else if (d === "Shift+Click to Highlight") {
                    traduc_aux = "Mayús + clic para resaltar";
            ***REMOVED***
                else {
                    traduc_aux = d;
            ***REMOVED***
                return traduc_aux;
        ***REMOVED***)
            .config({
                data: objData,
                groupBy: "labelGroup",
                x: "label",
                y: "rawValue",
                shapeConfig: {
                    label: false,
              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"];
                  ***REMOVED***
                    tbody: [
                        [function (d) { return "L " + (d["rawValue"]).formatMoney(2, '.', ',').toString() + " " ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    maxSize: "100px",
                    title: [],
                    scale: "pow",
                    tickFormat: function (d) {
                        return (d.formatMoney(0, '.', ',').toString()) + " ";
                ***REMOVED***
              ***REMOVED***
                xConfig: {
                    fontsize: "2px",
                    size: "2px"
              ***REMOVED***
                // legend: false
        ***REMOVED***)
            .barPadding(0)
            .groupPadding(50)
            // .stacked(true)
            .colorScale(["#4DE0E3", "#3899CD"])
            .height(400)
            .render();
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



function cambiarTipoTexto(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
***REMOVED***


function getAnnio() {
    //debugger;
    var params_usu = { "Contratista": ruc_contratista ***REMOVED***;
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosContratos/GetAnniosContratistas",
        cache: false,
        data: params_usu,
        success: function (data) {
            deshabilita(true);
            //alert(JSON.stringify(data));

            var items_result = data.detalles;
            var annios = [];
            var select = "";
            select = select + '<option value="0">Todos</option>';
            for (var i = 0; i < items_result.length; i++) {

                if (!annios.includes(items_result[i].valor.toString())) {
                    annios.push(items_result[i].valor.toString());
                    select = select + '<option value="' + items_result[i].valor.toString() + '">' + items_result[i].valor.toString() + '</option>';
            ***REMOVED***

        ***REMOVED***

            $('#top_contratos_periodos').html(select).fadeIn();
            if (items_result.length > 0) {
                //$("#top_contratos_periodos").val(items_result[items_result.length - 1].valor.toString());
                //$("#top_contratos_periodos").attr("default", items_result[items_result.length - 1].valor.toString());
                getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(), 1, cant_contratos);
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
            alert(response.responseText);
      ***REMOVED***
        failure: function (response) {
            alert(response.responseText);
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
        $("#top_contratos_periodos").val(0);
        $("#top_origen_informacion").val("");
        deshabilita(true);
        getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(), 1, cant_contratos);
***REMOVED***
***REMOVED***);

$("#btn-buscar").click(function () {
    if (!disableClick) {
        deshabilita(true);
        getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(), 1, cant_contratos);
        //getGraficasAll();
***REMOVED***

***REMOVED***);

function dibujaPaginacionContrato(actual, total, totalPag, cant_por_pag) {
    var pag_actual = parseInt(actual);
    pagina_actual = pag_actual;
    var pagesHTML = '';
    var cant_por_linea = 10;

    deshabilita(false);
    $("#divPagContratos").empty();

    var divPag = d3.select("#divPagContratos");

    var cociente = Math.floor(pag_actual / cant_por_linea);
    var residuo = pag_actual % cant_por_linea;
    var inicio = 1;
    if (residuo == 0) {
        inicio = (pag_actual - cant_por_linea) + 1;
***REMOVED*** else {
        inicio = (cociente * cant_por_linea) + 1;
***REMOVED***

    var fin = inicio + (cant_por_linea - 1);
    if (totalPag < cant_por_linea) {
        fin = totalPag;
***REMOVED***
    if (fin > totalPag) {
        fin = totalPag;
***REMOVED***


    if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
        var pag_enlace = divPag.append("a")
            .attr("id", "page_left")
            .attr("role", "button")
            .attr("class", "material-icons md-24")
            .attr("data-page", inicio - cant_por_linea)
        pag_enlace.append("span")
            .attr("class", "")
            .text("chevron_left ")
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
        //(totalPag - pag_actual) > cant_por_linea
        if (fin < totalPag) {
            var pag_enlace_der = divPag.append("a")
                .attr("id", "page_right")
                .attr("role", "button")
                .attr("class", "material-icons md-24")
                .attr("data-page", fin + 1)
            pag_enlace_der.append("span")
                .attr("class", "")
                .text("chevron_right")

    ***REMOVED***
***REMOVED***

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {

        deshabilita(true);
        //$('#divPagContratos').attr('disabled', 'disabled');
        d3.select("#divProyectos").empty();
        pagina_actual = $(this).attr("data-page");

        getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(), pagina_actual, cant_por_pag);
***REMOVED***);

***REMOVED***
//function dibujaPaginacionContrato(actual, total, totalPag, cant_por_pag) {
//    var pag_actual = parseInt(actual);
//    pagina_actual = pag_actual;
//    var pagesHTML = '';
//    $("#divPagContratos").empty();
//    var divPag = d3.select("#divPagContratos")
//    if (pag_actual > 1 && total >= cant_por_pag) {
//        var pag_enlace = divPag.append("a")
//            .attr("id", "page_left")
//            .attr("class", "pull-left")
//            .attr("data-page", pag_actual - 1)
//        pag_enlace.append("span")
//            .attr("class", "glyphicon glyphicon-arrow-left")
//        pag_enlace.append("text")
//            .text(" Anterior")
//***REMOVED***
//    divPag.append("span")
//        .attr("class", "totalpages")
//        .text("Página " + actual + " de " + totalPag)

//    if (pag_actual < totalPag) {
//        if ((total - (pag_actual * cant_por_pag)) > 0) {
//            var pag_enlace_der = divPag.append("a")
//                .attr("id", "page_right")
//                .attr("class", "pull-right")
//                .attr("data-page", pag_actual + 1)
//                .text("Próximo ")
//            pag_enlace_der.append("span")
//                .attr("class", "glyphicon glyphicon-arrow-right")
//    ***REMOVED***
//***REMOVED***

//    $('#page_right,#page_left').bind('click', function () {
//        d3.select("#divProyectos").empty();
//        pagina_actual = $(this).attr("data-page");
//        getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(),pagina_actual, cant_por_pag);
//***REMOVED***);

//***REMOVED***

function getContratos(annio, ruc, origen, pagina, registros) {


    var filtros = {
        Annio: annio,
        NumeroPagina: pagina,
        RegistrosPorPagina: registros,
        NombreEntidad: null,
        NombreProceso: null,
        Estado: null,
        Moneda: null,
        NombreContratista: null,
        CodigoProveedor: ruc,
        OrigenInformacion: origen
       
***REMOVED***;
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'api/ServiciosContratos/Contratista/',
        cache: false,
        data: filtros,
        success: function (result) {
            if (result.status == true) {
                if (result.cantidadTotalRegistros > 0) {
                    var info = result.data;
                    var proceso = "";
                    var data = "";
                    var fila = "";
                    var inicioLuis = '<div class="contractBox">';
                    var finLuis = '</div>';
                    var inicio = "";
                    var fin = "";
                    var origen = "";
                    var stilo = "";
                    $("#srcContratos").html("");
                    for (var i = 0; i < info.length; i++) {
                        if (proceso != info[i].codigoProceso.toString() || origen!= info[i].origenInformacion.toString()) {
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
                            // referencia = info[i].DocURL.toString();
                            //adjudicacion = info[i].urlResumenAdjudicacion;
                            //invitados = info[i].urlInvitados;
                           
                            if (info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")) { stilo = "contractONCAE" ***REMOVED*** else { stilo = "contractSEFIN" ***REMOVED***
                            inicio = '<div class="contractNumber"><span class="">Código proceso: </span> <span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>'
                                + ' <div class="wrap-head-process">'
                                + '     <div class="cotractName '+stilo+'">'
                                + '         <div class="row">'
                                + '             <div class="col-xs-8 col-md-8">'
                                + '                 <span class="small"> INSTITUCIÓN</span><div class="clearfix"></div>'
                                + '                 <span class="h4">' + info[i].comprador.toString() + '</span>'
                                + '             </div>'
                                + '         </div>'
                                + '     </div>';
                            inicio += '<div class="contractData">';


                            if (info[i].descripcionProceso) {
                                inicio += ''
                                    + '         <div class="row border-b">'
                                    + '             <div class="col-xs-12 col-md-12"><span class="txt_small">Descripción del proceso</span><span class="amount_adj">';
                                inicio += info[i].descripcionProceso.toString();
                                inicio += '</span></div>'
                                    + '         </div>';
                        ***REMOVED***

                            if (info[i].origenInformacion) {
                                inicio += ''
                                    + '         <div class="row border-b">'
                                    + '             <div class="col-xs-12 col-md-12"><span class="txt_small">Fuente de Datos</span><span class="amount_adj">';
                                inicio += info[i].origenInformacion.toString().toUpperCase().replace("ONCAE - CATALOGO ELECTRÓNICO", "ONCAE - CATÁLOGO ELECTRÓNICO");
                                inicio += '</span></div>'
                                    + '         </div>';
                        ***REMOVED***


                            if (info[i].estadoProceso) {
                                inicio += ''
                                    + '         <div class="row border-b">'
                                    + '             <div class="col-xs-12 col-md-4"><span class="txt_small">Estado del proceso</span><span class="amount_adj">';
                                inicio += info[i].estadoProceso.toString();
                                inicio += '</span></div>'
                                    + '             <div class="col-xs-6 col-md-4"><span class="txt_small"></span><span class="amount_adj"></span></div>' //Monto Estimado ' + (info[i].MontoEstimadoProceso * 1).formatMoney(2, '.', ',').toString() + '
                                    + '             <div class="col-xs-6 col-md-2"><span class="txt_small"></span><span class="amount_adj"></span></div>' //Moneda L
                                    + '         </div>';
                        ***REMOVED***

                            


                            inicio += '     </div>'
                                + ' </div>'
                                + ' <div class="related-contracts">'
                                + '     <span class="h4">Órdenes de pago y Contratos según ' + info[i].origenInformacion.toString().toUpperCase().split(' ')[info[i].origenInformacion.toString().toUpperCase().split(' ').length-1] + ' asociados a este proceso:</span>'
                                + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                            proceso = info[i].codigoProceso.toString();
                            origen = info[i].origenInformacion.toString();
                           
                    ***REMOVED***
                        // if (info[i].CodigoContrato){
                        fila += '<div class="panel panel-default">'
                            + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                            + '                <h4 class="panel-title">'
                            + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';
                       // if (info[i].COVID19 === 1 || info[i].COVID19 === 2) { fila += '                        <span class="badge"><img src="../../../content/img/covid/ic_mini.png" alt="iconoCOVID"> Covid-19</span>'; ***REMOVED***
                        if (info[i].codigoContrato) { fila += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; ***REMOVED*** else { fila += '                      Pendiente emisión código contratación  ' ***REMOVED***
                        var moneda = '';//'L';
                        if (info[i].monedaContrato.toString()) {
                            if (info[i].monedaContrato.toString() == 'USD') {
                                moneda = '';// '$';
                        ***REMOVED***
                    ***REMOVED***
                        fila += '                    </a>'
                            + '                </h4>'
                            + '            </div>'
                            + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                            + '                <div class="panel-body">'
                            + '                    <div class="row border-b">'
                            + '                        <div class="col-md-6">'
                            + '                            <span class="small"> RAZON SOCIAL</span>'
                            + '                            <span class="amount_adj">' + info[i].contratista.toString() + '</span>'
                            + '                        </div>'
                            //+ '                        <div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipodocumento.toString() + '</span></div>'
                            + '                        <div class="col-md-3"><span class="small"> Número de documento</span><span class="amount_adj">' + info[i].codigoProveedor.toString() + '</span></div>'
                            + '                    </div>'
                            + '                    <div class="row border-b">'
                            + '                        <div class="col-xs-8 col-md-3"><span class="small"> PRESUPUESTO</span><span class="amount_adj">' + moneda + ' ' + (info[i].valorPlaneado * 1).formatMoney(2, '.', ',').toString() + ' </span></div>'
                            + '                        <div class="col-xs-8 col-md-3"><span class="small"> VALOR ADJUDICADO</span><span class="amount_adj">' + moneda + ' ' + (info[i].valorAdjudicado * 1).formatMoney(2, '.', ',').toString() + ' </span></div>'
                            + '                        <div class="col-xs-8 col-md-3"><span class="small"> MONTO</span><span class="amount_adj">' + moneda + ' ' + (info[i].valorContratado * 1).formatMoney(2, '.', ',').toString() + ' </span></div>'
                            + '                        <div class="col-xs-4 col-md-3"><span class="small"> MONEDA</span><span class="amount_adj">' + info[i].monedaContrato + '</span></div>' //DOP 
                            + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                        if (info[i].fechaInicioContrato) { fila += ' Fecha de INICIO CONTRATO'; ***REMOVED***
                        fila += '</span><span class="amount_adj">';
                        if (info[i].fechaInicioContrato) { fila += info[i].fechaInicioContrato.toString().substr(0, 10); ***REMOVED***

                        fila += ' </span></div>'
                            + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                        if (info[i].fechaFinContrato) { fila += 'Fecha de FIN CONTRATO'; ***REMOVED***
                        fila += '</span><span class="amount_adj"> ';
                        if (info[i].fechaFinContrato) { fila += info[i].fechaFinContrato.toString().substr(0, 10); ***REMOVED***

                        fila += ' </span></div>'
                            + '                    </div>';


                        if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
                            fila += '                    <div class="row border-b">'
                                + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                            if (info[i].ofertaPeriodoDuracion) { fila += info[i].ofertaPeriodoDuracion.toString(); ***REMOVED***

                            fila += '                   Días</span></div>';

                            fila += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                            if (info[i].fechaPublicacion !== null && info[i].fechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                fila += info[i].fechaPublicacion.toString().substr(0, 10) + '</span></div>';
                        ***REMOVED***
                            else {
                                fila += '</span></div>';
                        ***REMOVED***

                            fila += '                    </div>';

                    ***REMOVED***

                        fila += '                    '
                            + '                </div>'
                            + '               <div class="panel-footer" style="text-align:center;">';
                        if (info[i].docURL) {
                            fila += '                    <div class="btn btn-outlined"><a href="' + info[i].docURL.toString() + '" target="_blank"> Conozca mas de este proceso <span class="glyphicon glyphicon-arrow-right"></span></a></div>';
                    ***REMOVED***
                        if (info[i].codigoContrato) {
                           // fila += '                    <a href="../../../contratista/contratoprofile/?CodigoContrato=' + info[i].CodigoContrato.toString() + '" class="btn btn-primary btn-primary btn-participe"><span class="glyphicon glyphicon-comment"></span> Hacer comentario al contrato</a>';
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
                    dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
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




