        var done_graficas = 0;
        var cant_graficas = 5;
        var cant_contratos = 20;
        var scrol = 0;


        inicializaDatos();

        function inicializaDatos() {


            getAnnio($("#moneda").val());

    ***REMOVED***


        function configuraEnlaceContratista() {
            $(".enlace_contratista").click(function () {
                var ruc = $(this).attr('data-parameter');
                var dataValue = $(this).attr('data-parameter'),
                    dataType = $(this).attr('data-type').toLowerCase();
                document.cookie = "ruc=" + ruc + ";path=/;";
                var url = "/contratista?" + dataType + "=" + dataValue;
                window.open(url, '_blank');

        ***REMOVED***);


    ***REMOVED***

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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


function getAnnio(moneda, nombreProceso = null) {
            //debugger;
            var filtros = {
                Moneda: moneda,
                NombreProceso: nombreProceso
        ***REMOVED***;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "api/ServiciosContratos/GetAnniosContratos/",
                cache: false,
                data: filtros,
                success: function (data) {
                    deshabilita(true);

                    var items_result = data.detalles;
                    var annios = [];
                    var select = "";
                    for (var i = 0; i < items_result.length; i++) {

                        if (!annios.includes(items_result[i].valor.toString())) {
                            annios.push(items_result[i].valor.toString());
                            select = select + '<option value="' + items_result[i].valor.toString() + '">' + items_result[i].valor.toString() + '</option>';
                    ***REMOVED***

                ***REMOVED***

                    $('#top_contratos_periodos').html(select).fadeIn();
                    if (items_result.length > 0) {
                        $("#top_contratos_periodos").val($('#maxyear').val());
                        getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, $("#top_origen_informacion option:selected").val(), "", $('#proceso').val(), $("#moneda").val());

                ***REMOVED*** else {
                        $("#srcContratos").html("");
                        var fila = '<div class="contractBox" >'
                          + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
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

                $("#top_origen_informacion").val("");
                $("#entidad").val("");
                $("#proceso").val("");
                deshabilita(true);
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, $("#top_origen_informacion option:selected").val(), "", "",$("#moneda").val());
        ***REMOVED***
    ***REMOVED***);

        $("#btn-buscar").click(function () {
            if (!disableClick) {
                deshabilita(true);
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, $("#top_origen_informacion option:selected").val(), $('#entidad').val(), $('#proceso').val(),$("#moneda").val());
                getGraficasAll();
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
                d3.select("#divProyectos").empty();
                pagina_actual = $(this).attr("data-page");

                getContratos($("#top_contratos_periodos option:selected").val(), pagina_actual, cant_por_pag, $("#top_origen_informacion option:selected").val(), $('#entidad').val(), $('#proceso').val());
        ***REMOVED***);

    ***REMOVED***

        function getContratos(annio, pagina, registros, origen, entidad, proceso, moneda) {

            var filtros = {
                Annio: annio,
                NumeroPagina: pagina,
                RegistrosPorPagina: registros,
                NombreEntidad: entidad,
                NombreProceso: proceso,
                Estado: null,
                Moneda: moneda,
                NombreContratista: null,
                OrigenInformacion: 0,
                CodigoContrato: null
        ***REMOVED***;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "api/ServiciosContratos/Contrato/",
                cache: false,
                data: filtros,
                success: function (result) {
                    if (result.status == true) {
                        if (result.cantidadTotalRegistros > 0) {
                            var info = result.data;
                            var proceso = "";
                            var entidad = "";
                            var filaproceso = "";
                            var referencia = "";
                            var data = "";
                            var fila = "";
                            var filaconfirma = "";
                            var inicioLuis = '<div class="contractBox">';
                            var finLuis = '</div>';
                            var inicio = "";
                            var fin = "";
                            $("#srcContratos").html("");
                            for (var i = 0; i < info.length; i++) {
                                if (i > 0 && entidad == info[i].comprador.toString() && proceso != info[i].codigoProceso.toString()) {
                                    fila += filaconfirma + '</div>' + referencia + '</div>';
                                    filaconfirma = "";

                            ***REMOVED***
                                if (entidad != info[i].comprador.toString()) {
                                    if (i > 0) //Cambio de entidad
                                    {
                                        data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;
                                        fila = "";
                                        filaconfirma = "";
                                        filasinfirma = "";
                                        inicio = "";
                                        fin = "";
                                ***REMOVED***
                                    if (info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")) { stilo = "contractONCAE" ***REMOVED*** else { stilo = "contractSEFIN" ***REMOVED***
                                    inicio = '<div class="cotractName ' + stilo+'"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Entidad</span><div class="clearfix"></div>'
                                        + '                 <span class="h4">' + info[i].comprador.toString() + '</span>'
                                        + ' </div></div></div>';
                                    entidad = info[i].comprador.toString();
                            ***REMOVED***

                                if (proceso != info[i].codigoProceso.toString()) {
                                    

                                    fila += '<div class="contractNumberRP"><span class="">Código proceso: </span>'
                                        + '	<span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>'
                                        + '<div class="contractNumberRP"><span class="">Proceso: </span>'
                                        + '	<span class="text-bold">' + info[i].descripcionProceso.toString() + '</span></div>'
							            + '<div class="wrap-head-process">';
                                    fila += '<div class="contractData">';

                                    fila += ''
							            + '		<div class="row border-b">'
							            + '			<div class="col-xs-12 col-md-4">'
							            + '				<span class="txt_small">Estado del proceso</span>'
							            + '				<span class="amount_adj">';
                                    if (info[i].estadoProceso) { fila += info[i].estadoProceso.toString(); ***REMOVED***
                                    fila += '</span></div>'
                                        + '			<div class="col-xs-6 col-md-4"><span class="txt_small">Monto Estimado</span> <span class="amount_adj"> ' + (info[i].valorPlaneado * 1).formatMoney(2, '.', ',').toString() + ' </span></div>'
                                        + '			    <div class="col-xs-6 col-md-2">'
                                        + '				   <span class="txt_small">Moneda</span>'
                                        + '				   <span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span>'
                                        + '			    </div>'
                                        + '			</div>';


                                    fila += ''
                                        + '		<div class="row border-b">';
                                    if (info[i].fechaIncioPublicacionProceso) {
                                        fila += ''
                                        + '			<div class="col-xs-12 col-md-4">'
                                        + '		    <span class="txt_small">Fecha de Inicio</span>'
                                            + '         <span class="amount_adj">' + info[i].fechaIncioPublicacionProceso.toString().substr(0, 10) + '</span>'
                                        + '			    </div>';
                                ***REMOVED***
                                    if (info[i].fechaInicioRecepcionOfertas) {
                                        fila += ''
                                        + '			<div class="col-xs-12 col-md-4">'
                                        + '		    <span class="txt_small">Fecha de Recepción</span>'
                                            + '         <span class="amount_adj">' + info[i].fechaInicioRecepcionOfertas.toString().substr(0, 10) + '</span>'
                                        + '			    </div>';
                                ***REMOVED***
                                    if (info[i].fechaEstimadaAdjudicacion) {
                                        fila += ''
                                        + '			<div class="col-xs-12 col-md-4">'
                                        + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
                                            + '         <span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span>'
                                        + '			    </div>';
                                ***REMOVED***

                                    fila += '	</div>'
                                    + '	</div>';

                                    fila += '</div>'
                                           + '<div class="clearfix"></div>';
                                    filaconfirma += ' <div class="related-contracts">'
                                        + '     <span class="h4">Contratos de ' + info[i].origenInformacion+' asociados a este proceso:</span>'
                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                                    proceso = info[i].codigoProceso.toString();


                                    referencia = '<div class="row text-center">'
                                        + '<div class="col-xs-12 col-md-12"><a href="' + info[i].docURL.toString() + '" target="_blank" class="btn btn-outlined"><i class="material-icons md-22">launch</i> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                    + '</div>';

                            ***REMOVED***


                                filaconfirma += '<div class="panel panel-default">'
                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                    + '                <h4 class="panel-title">'
                                    + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

                                if (info[i].codigoContrato) { filaconfirma += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; ***REMOVED*** else { filaconfirma += '                      Pendiente emisión código contratación  ' ***REMOVED***

                                filaconfirma += '     </a>'
                                    + '                </h4>'
                                    + '            </div>'
                                    + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                                    + '                <div class="panel-body">';
                                if (info[i].descripcionContrato) {
                                    filaconfirma += '          <div class="row border-b">'
                                        + '                        <div class="col-md-12"><span class="small"> CONTRATO</span><span class="amount_adj">' + info[i].descripcionContrato.toString() + '</span></div>'
                                        + '                    </div>';
                            ***REMOVED***
                                var moneda = '$'; //'L';
                                if (info[i].monedaContrato.toString()) {
                                    if (info[i].monedaContrato.toString() == 'USD') {
                                        moneda = '';// '$';
                                ***REMOVED***
                            ***REMOVED***
                                filaconfirma +=  '        <div class="row border-b">'
                                   + '                        <div class="col-md-4">'
                                   + '                            <span class="small"> RAZÓN SOCIAL<span>'
                                    + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].codigoProveedor.toString() + '"><span class="amount_adj"><i class="material-icons md-22">shortcut</i> ' + info[i].contratista.toString() + '</span></a>'
                                   + '                        </div>'
                                    + '                        <div class="col-md-4"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipoCodigoProveedor.toString() + '</span></div>'
                                    + '                        <div class="col-md-4"><span class="small"> NÚMERO DE DOCUMENTO</span><span class="amount_adj">' + info[i].codigoProveedor.toString() + '</span></div>'
                                    + '                    </div>'
                                   + '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-6 col-md-6"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj"> ' + moneda + ' ' + (info[i].valorContratado * 1).formatMoney(2, '.', ',').toString() + '</span></div>'
                                    + '                        <div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span></div>'
                                   + '                    </div>'


                                filaconfirma += '                    <div class="row border-b">';

                                if (info[i].fechaInicioContrato && info[i].fechaInicioContrato.toString().substr(0, 10) !== "1900-01-01") {
                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">FECHA DE INICIO CONTRATO</span>'
                                    + '                                                                     <span class="amount_adj">'
                                    + info[i].fechaInicioContrato.toString().substr(0, 10)
                                    + '                                                                      </span></div>';
                            ***REMOVED***
                                if (info[i].fechaFinContrato && info[i].fechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                    + 'FECHA DE FIN CONTRATO'
                                    + '</span><span class="amount_adj">'
                                        + info[i].fechaFinContrato.toString().substr(0, 10)
                                    + '        </span></div>';
                            ***REMOVED***

                                if (info[i].fechaInicioEjecucionContrato && info[i].fechaInicioEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                    + 'Fecha de INICIO EJECUCIÓN'
                                    + '</span><span class="amount_adj">'
                                        + info[i].fechaInicioEjecucionContrato.toString().substr(0, 10)
                                    + '        </span></div>';
                            ***REMOVED***
                                if (info[i].fechaFinEjecucionContrato && info[i].fechaFinEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                    + 'Fecha de FIN EJECUCIÓN'
                                    + '</span><span class="amount_adj">'
                                        + info[i].fechaFinEjecucionContrato.toString().substr(0, 10)
                                    + '        </span></div>';
                            ***REMOVED***

                                filaconfirma += '                    </div>';

                                if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
                                    filaconfirma += '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                                    if (info[i].ofertaPeriodoDuracion) { filaconfirma += info[i].ofertaPeriodoDuracion.toString(); ***REMOVED***

                                    filaconfirma += '                   Días</span></div>';

                                    filaconfirma += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                                    if (info[i].fechaPublicacion !== null && info[i].fechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                        filaconfirma += info[i].fechaPublicacion.toString().substr(0, 10) + '</span></div>';
                                ***REMOVED***
                                    else {
                                        filaconfirma += '</span></div>';
                                ***REMOVED***

                                    filaconfirma += '                    </div>';

                            ***REMOVED***

                                filaconfirma += '                </div>'
                                + '               <div class="panel-footer" style="align:center">';

                                if (info[i].codigoContrato) {
                                    filaconfirma += '                    <a href="../../contrato?codcontrato=' + info[i].codigoContrato.toString() + '" class="btn btn-primary btn-participe"><i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>';
                            ***REMOVED***
                                filaconfirma += '                 </div>'
                                + '            </div>'
                                + '        </div>';
                                
                        ***REMOVED***


                            data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;


                            $("#srcContratos").html(data);
                            if (scrol >= 1) {
                                $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top ***REMOVED***, 2000);
                        ***REMOVED*** else { scrol = scrol + 1; ***REMOVED***

                            dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
                            configuraEnlaceContratista();
                    ***REMOVED***
                        else {
                            $("#divPagContratos").empty();
                            $("#srcContratos").html("");
                            var fila = '<div class="contractBox" >'
                                + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
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




//autocompletar en contratos
$("#entidad").on("keyup", function (event) {
    if (event.keyCode == 9 || event.keyCode == 13) {
        event.preventDefault();
***REMOVED*** else {
        if (event.keyCode == 8) {
            if ($(this).val().length <= 1) {
                $(this).val("");

        ***REMOVED***
    ***REMOVED***
***REMOVED***
***REMOVED***).autocomplete({
    source: function (request, response) {
        var filtros = {
            Comprador: request.term
    ***REMOVED***;
        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/ServiciosContratos/GetCompradorByNombre/",
            cache: false,
            data: filtros,
            success: function (data) {
                var datos = data;

                if (datos == null || datos.contratosPerAnyo.length <= 0) {
                    $("#divNoEncontrado").show();
                    $("#ui-id-1").hide();
            ***REMOVED*** else {
                    $("#divNoEncontrado").hide();
                    response($.map(datos.contratosPerAnyo, function (item) {
                        return {
                            label: item.label,
                            value: item.label
                    ***REMOVED***;

                ***REMOVED***
                    ));

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
    delay: 300,
    minLength: 1,
    select: function (event, ui) {

***REMOVED***
***REMOVED***).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).val("");
        $("#divNoEncontrado").hide();
***REMOVED***

***REMOVED***);

$("#top_contratos_periodos").change(function () {

    var filtros = {
        Annio: $("#top_contratos_periodos option:selected").val(),
        Moneda: $("#moneda").val(),
***REMOVED***;
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/ServiciosContratos/GetContratosEntidad/",
        cache: false,
        data: filtros,
        success: function (result) {
            if (result.status == true) {

                existeOncae = 0;
                existeSefin = 0;
                $('#dataONCAE').empty();
                $('#dataSEFIN').empty();
                for (var i = 0; i < result.consolidados.length; i++) {

                    if (result.consolidados[i].origenInformacion.toUpperCase().includes('ONCAE')) {
                            if (existeOncae == 0) { $('#resultONCAE').empty(); existeOncae += 1; ***REMOVED***
                            var html = '<div class="col-md-4">'
                                + '<div class="h6">' + result.consolidados[i].origenInformacion.replace("Oncae - ", "").replace("ONCAE - ", "").replace("Catalogo Electrónico","Catálogo Electrónico") + '</div>'
                            + '    <div class="h4">' + (result.consolidados[i].nroContratos * 1).formatMoney(0, '.', ',').toString() + '</div>'
                                + '    <div class="h6">Valor</div>'
                                + '    <div class="h4">' + result.consolidados[i].monedaContrato + ' ' + (result.consolidados[i].valorContratado * 1 / 1000000).formatMoney(1, '.', ',').toString() + ' Millones' + '</div>'
                                + '</div>';
                            $('#dataONCAE').append(html);
                    ***REMOVED***

                    if (result.consolidados[i].origenInformacion.toUpperCase().includes('SEFIN')) {
                            if (existeSefin == 0) { $('#resultSEFIN').empty(); existeSefin += 1; ***REMOVED***
                            var html = ''
                                + '<div class="h6">' + result.consolidados[i].origenInformacion.toUpperCase() + '</div>'
                            + '    <div class="h4">' + (result.consolidados[i].nroContratos).formatMoney(0, '.', ',').toString() + '</div>'
                                + '    <div class="h6">Valor</div>'
                                + '    <div class="h4">' + result.consolidados[i].monedaContrato + ' ' + (result.consolidados[i].valorContratado * 1 / 1000000).formatMoney(1, '.', ',').toString() + ' Millones' + '</div>'
                                + ''
                            $('#dataSEFIN').append(html);
                    ***REMOVED***
            ***REMOVED***
                scrol = 0;
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, $("#top_origen_informacion option:selected").val(), $('#entidad').val(), $('#proceso').val());

        ***REMOVED***

      ***REMOVED***
        error: function (response) {
            alert(response.responseText);
      ***REMOVED***
        failure: function (response) {
            alert(response.responseText);
    ***REMOVED***
***REMOVED***);
***REMOVED***);


