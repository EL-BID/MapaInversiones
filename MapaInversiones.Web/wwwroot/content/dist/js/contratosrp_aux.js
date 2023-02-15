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

            getContratosCancelados();
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
           
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/serviciosContratistas/GetAnniosContratosRP",
                cache: false,
                success: function (data) {
                    deshabilita(true);
                    //alert(JSON.stringify(data));

                    var items_result = data.Detalles;
                    var annios = [];
                    var select = "";
                    select = select + '<option value="">Todos los años</option>';
                    for (var i = 0; i < items_result.length; i++) {

                        if (!annios.includes(items_result[i].valor.toString())) {
                            annios.push(items_result[i].valor.toString());
                            select = select + '<option value="' + items_result[i].valor.toString() + '">' + items_result[i].valor.toString() + '</option>';
                    ***REMOVED***

                ***REMOVED***

                    $('#top_contratista_periodos').html(select).fadeIn();
                    if (items_result.length > 0) {
                        //$("#top_contratista_periodos").val(items_result[items_result.length - 1].valor.toString());
                        //$("#top_contratista_periodos").attr("default", items_result[items_result.length - 1].valor.toString());
                        getContratos($("#top_contratista_periodos option:selected").text(),  1, cant_contratos);
                ***REMOVED*** else {
                        $("#srcContratos").html("");
                        var fila = '<div class="contractBox" >'
                          + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
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
                $("#entidad").val("");
                $("#proceso").val("");
                deshabilita(true);
                getContratos($("#top_contratista_periodos option:selected").text(), 1, cant_contratos,"","");
        ***REMOVED***
    ***REMOVED***);

        $("#btn-buscar").click(function () {
            if (!disableClick) {
                deshabilita(true);
                getContratos($("#top_contratista_periodos option:selected").text(), 1, cant_contratos, $('#entidad').val(), $('#proceso').val());
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
                getContratos($("#top_contratista_periodos option:selected").text(), pagina_actual, cant_por_pag, $('#entidad').val(), $('#proceso').val());
        ***REMOVED***);

    ***REMOVED***

        function getContratos(annio, pagina, registros, entidad, proceso) {


            var filtros = {
                Annio: annio,
                NumeroPagina: pagina,
                RegistrosPorPagina: registros,
                NombreEntidad: entidad,
                NombreProceso: proceso

        ***REMOVED***;
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/serviciosContratistas/GetInformacionContratosRPPorFiltros",
                cache: false,
                data: JSON.stringify(filtros),
                success: function (result) {
                    if (result.status == true) {
                        if (result.CantidadTotalRegistros > 0) {
                            var info = result.listInformacion;
                            var proceso = "";
                            var entidad = "";
                            var filaproceso = "";
                            var data = "";
                            var fila = "";
                            var filaconfirma = "";
                            var inicioLuis = '<div class="contractBox">';
                            var finLuis = '</div>';
                            var inicio = "";
                            var fin = "";
                            $("#srcContratos").html("");
                            for (var i = 0; i < info.length; i++) {
                                if (i > 0 && entidad == info[i].UnidadCompra.toString() && proceso != info[i].CodigoProceso.toString()) {
                                    fila += filaconfirma + '</div></div>';
                                    filaconfirma = "";
                             ***REMOVED***
                                if (entidad != info[i].UnidadCompra.toString()) {
                                    if (i > 0) //Cambio de entidad
                                    {
                                        data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + finLuis;
                                        fila = "";
                                        filaconfirma = "";
                                        filasinfirma = "";
                                        inicio = "";
                                        fin = "";
                                ***REMOVED***
                                    
                                    inicio = '<div class="cotractName"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Entidad</span><div class="clearfix"></div>'
                                        + '                 <span class="h4">' + info[i].UnidadCompra.toString() + '</span>'
                                        + ' </div></div></div>';
                                    entidad = info[i].UnidadCompra.toString();
                            ***REMOVED***

                                adjudicacion = info[i].UrlResumenAdjudicacion;
                                invitados = info[i].UrlInvitados;

                                if (proceso != info[i].CodigoProceso.toString()) {
  
                                    fila += '<div class="processName">'
							            + '		<div class="row">'
							            + '			<div class="col-xs-12 col-md-12">'
							            + '				<span class="small">PROCESO</span><div class="clearfix"></div>'
							            + '				<span class="h4">' + info[i].DescripcionProceso.toString() + '</span>  </div>         </div> '
							            + '	</div>'
							            + '<div class="contractNumberRP"><span class="">Código proceso: </span>'
							            + '	<span class="text-bold">' + info[i].CodigoProceso.toString() + '</span></div>'
							            + '<div class="wrap-head-process">';
                                    fila += '<div class="contractData">';
                                    if (info[i].CategoriaContratacion || info[i].MetodoContratacion) {
                                        fila += ''
							            + '		<div class="row border-b">'
							            + '			<div class="col-xs-6 col-md-8">';
                                        if (info[i].CategoriaContratacion) {
                                            fila += '	<span class="txt_small">Categoria</span>'
							                     + '	<span class="amount_adj">' + info[i].CategoriaContratacion.toString() + '</span>';
                                    ***REMOVED***
                                        fila += '</div>	<div class="col-xs-6 col-md-4">';
                                        if (info[i].MetodoContratacion) {
                                            clasece = "";
                                            imgg = "";
                                            if (info[i].MetodoContratacion.toString() === "Contratación por Excepción") { clasece = "cemark"; imgg = '<img src="/content/img/covid/ic_CEorange.svg"  alt="CAUSAL EXCEPCIÓN">'; ***REMOVED***
                                            fila += '				   <span class="txt_small">Tipo de Procedimiento</span>'
                                            + '				   <span class="amount_adj ' + clasece + '">' + imgg + ' ' + info[i].MetodoContratacion.toString() + ' </span>';
                                    ***REMOVED***
                                        fila += '</div></div>'
                                        + '	';
                                ***REMOVED***
                                        fila += ''
							            + '		<div class="row border-b">'
							            + '			<div class="col-xs-12 col-md-4">'
							            + '				<span class="txt_small">Estado</span>'
							            + '				<span class="amount_adj">';
                                            if (info[i].EstadoProceso) { fila += info[i].EstadoProceso.toString(); ***REMOVED***
                                            fila += '</span></div>'
							            + '			<div class="col-xs-6 col-md-4"><span class="txt_small"><span class="amount_adj"></span></div>'
							            + '			    <div class="col-xs-6 col-md-2">'
							            + '				   <span class="txt_small"></span>'
							            + '				   <span class="amount_adj"></span>'
							            + '			    </div>'
							            + '			</div>'
							            + '	</div>';


                                            fila += '	<div class="actions-btnContratcs">';
                                            if (adjudicacion && invitados) {
                                                fila += '			<div class="col-xs-6 col-md-4">'
                                                        + '					<div class="btn btn-outlined"><a href="' + info[i].UrlResumenAdjudicacion.toString() + '"" target="_blank"> Ver adjudicación <span class="glyphicon glyphicon-arrow-right"></span></a>'
                                                        + '				</div>'
                                                        + '			</div>'
                                                        + '			<div class="col-xs-6 col-md-4">'
                                                        + '					<div class="btn btn-outlined"><a href="' + info[i].UrlInvitados.toString() + '" target="_blank"> Ver invitados <span class="glyphicon glyphicon-arrow-right"></span></a>'
                                                        + '				</div>'
                                                        + '			</div>';
                                        ***REMOVED***
                                            if (!adjudicacion && invitados) {
                                                fila += '			<div class="col-xs-6 col-md-4">'
                                                        + '					<div class="btn btn-outlined"><a href="' + info[i].UrlResumenAdjudicacion.toString() + '"" target="_blank"> Ver adjudicación <span class="glyphicon glyphicon-arrow-right"></span></a>'
                                                        + '				</div>'
                                                        + '			</div>'
                                                        + '			<div class="col-xs-6 col-md-4">'
                                                        + '			</div>';
                                        ***REMOVED***
                                            if (adjudicacion && !invitados) {
                                                fila += '			<div class="col-xs-6 col-md-4">'
                                                        + '			</div>'
                                                        + '			<div class="col-xs-6 col-md-4">'
                                                        + '					<div class="btn btn-outlined"><a href="' + info[i].UrlInvitados.toString() + '" target="_blank"> Ver invitados <span class="glyphicon glyphicon-arrow-right"></span></a>'
                                                        + '				</div>'
                                                        + '			</div>';
                                        ***REMOVED***

                                            fila += '		</div>'
                                           + '</div>'
                                           + '<div class="clearfix"></div>';
                                    filaconfirma += ' <div class="related-contracts">'
                                        + '     <span class="h4">Contratos asociados a este proceso:</span>'
                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                                     proceso = info[i].CodigoProceso.toString();
                            ***REMOVED***


                                filaconfirma += '<div class="panel panel-default">'
                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                    + '                <h4 class="panel-title">'
                                    + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

                                if (info[i].COVID19 === 2 || info[i].COVID19 === 1) { filaconfirma += '                        <span class="badge"><img src="../../../content/img/covid/ic_mini.png" alt="iconoCOVID"> Covid-19</span>'; ***REMOVED***
                                if (info[i].CodigoContrato) { filaconfirma += '                        Código de contratación:  ' + info[i].CodigoContrato.toString() + ''; ***REMOVED*** else { filaconfirma += '                      Pendiente emisión código contratación  ' ***REMOVED***

                                    filaconfirma += '     </a>'
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

                                    if (info[i].FechaInicioContrato !== null && info[i].FechaInicioContrato.toString().substr(0, 10) !== "1900-01-01") {
                                        filaconfirma += 'Fecha de INICIO CONTRATO';
                                ***REMOVED***
                                    filaconfirma += '</span><span class="amount_adj">';

                                    if (info[i].FechaInicioContrato !== null && info[i].FechaInicioContrato.toString().substr(0, 10) !== "1900-01-01") {
                                        filaconfirma += info[i].FechaInicioContrato.toString().substr(0, 10);
                                ***REMOVED***

                                    filaconfirma += '        </span></div>'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                                    if (info[i].FechaFinContrato !== null && info[i].FechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
                                        filaconfirma += 'Fecha de FIN CONTRATO';
                                ***REMOVED***
                                    filaconfirma += '</span><span class="amount_adj"> ';

                                    if (info[i].FechaFinContrato !== null && info[i].FechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
                                        filaconfirma += info[i].FechaFinContrato.toString().substr(0, 10);
                                ***REMOVED***

                                    filaconfirma += '                 </span></div>'
                                   + '                    </div>';

                                    if (info[i].OfertaPeriodoDuracion || info[i].FechaPublicacion){
                                            filaconfirma += '                    <div class="row border-b">'
                                            + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                                            if (info[i].OfertaPeriodoDuracion) { filaconfirma += info[i].OfertaPeriodoDuracion.toString(); ***REMOVED***

                                            filaconfirma += '                   Días</span></div>';

                                            filaconfirma += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                                            if (info[i].FechaPublicacion !== null && info[i].FechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                                filaconfirma += info[i].FechaPublicacion.toString().substr(0, 10) + '</span></div>';
                                        ***REMOVED***
                                            else {
                                                filaconfirma += '</span></div>';
                                        ***REMOVED***

                                            filaconfirma += '                    </div>';

                                ***REMOVED***

                                    filaconfirma += '                </div>'
                                    + '               <div class="panel-footer" style="align:center">';
                                    if (info[i].DocURL) {
                                        filaconfirma+= '                    <div class="btn btn-outlined"><a href="' + info[i].DocURL.toString() + '" target="_blank"> Ver más de este contrato <span class="glyphicon glyphicon-arrow-right"></span></a></div>';
                                ***REMOVED***
                                    if (info[i].CodigoContrato) {
                                        filaconfirma += '                    <a href="../../contratista/contratoprofile/?CodigoContrato=' + info[i].CodigoContrato.toString() + '" class="btn btn-primary btn-primary btn-participe"><span class="glyphicon glyphicon-comment"></span> Hacer comentario al contrato</a>';
                                ***REMOVED***
                                    filaconfirma += '                 </div>'
                                    + '            </div>'
                                    + '        </div>';
                                //+ '  </div>';
                        ***REMOVED***

                            data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + finLuis;


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



        function getContratosCancelados() {

            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/serviciosContratistas/GetInformacionContratoCancelado",
                cache: false,
                success: function (result) {
                    if (result.status == true) {
                        if (result.listInformacion.length > 0) {
                            var info = result.listInformacion;
                            $("#contratocancelado").html("");
                            data = "";
                            for (var i = 0; i < info.length; i++) {
                                data += '<div class="box-contract">';
                                if (info[i].IdProceso) {
                                    data += '    <div class="row">'
                                        + '        <div class="col-md-12">'
                                        + '            <div class="contract-id">'
                                        + '                <span class="txt_small">ID proceso</span>'
                                        + '                <span class="amount_adj">' + info[i].IdProceso + '</span>'
                                        + '            </div>'
                                        + '        </div>'
                                        + '    </div>'
                            ***REMOVED***
                                data += '    <div class="body-cc">';
                                if (info[i].IdProceso) {
                                    data +='        <div class="row">'
                                        +'            <div class="col-md-12">'
                                        +'                <span class="txt_small">Proveedor</span>'
                                        + '                <span class="amount_adj">' + info[i].Proveedor + '</span>'
                                        +'            </div>'
                                        +'        </div>';
                            ***REMOVED***
                                if (info[i].IdProceso) {
                                    data +='        <div class="row">'
                                        +'            <div class="col-md-12">'
                                        +'                <span class="txt_small">Código proveedor</span>'
                                        + '                <span class="amount_adj">' + info[i].CodigoProveedor + '</span>'
                                        +'            </div>'
                                        +'        </div>';
                             ***REMOVED***
                                 
                                data +='        <div class="row">'
                                if (info[i].IdProceso) {
                                    data +='            <div class="col-md-6">'
                                        +'                <span class="txt_small">Valor</span>'
                                        + '                <span class="amount_adj">' + ((info[i].Valor * 1) / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>'
                                        +'            </div>';
                            ***REMOVED***
                                if (info[i].IdProceso) {
                                    data +='            <div class="col-md-6">'
                                        +'                <span class="txt_small">Fecha de modificación</span>'
                                        + '                <span class="amount_adj">' + info[i].FechaModificacion.toString().substr(0, 10)+ '</span>'
                                        +'            </div>';
                            ***REMOVED***
                                if (info[i].IdProceso) {
                                    data += '            <div class="col-md-12">'
                                        + '                <div class="btn btn-outlined"><a href="' + info[i].urlContrato + '" target="_blank">'
                                        + '				Ver más <span class="glyphicon glyphicon-arrow-right"></span></a>'
                                        + '				</div>'
                                        + '            </div>';
                            ***REMOVED***
                                data += '        </div>'
                                      +'    </div>'
                                      +'</div>';
                        ***REMOVED***

                            $("#contratocancelado").html(data);
                    ***REMOVED*** else {
                            $("#contratocancelado").html("");
                            var fila = '<div class="contractBox" >'
                                + '<div class="row"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                                + '</div>';
                            $("#contratocancelado").html(fila);
                    ***REMOVED***
                        
                ***REMOVED*** else {
                        alert("Message: " + result.message);
                ***REMOVED***
                    deshabilita(false);
              ***REMOVED***
                error: function (response) {
                    alert(response.responseText);
              ***REMOVED***
                failure: function (response) {
                    alert(response.responseText);
            ***REMOVED***
        ***REMOVED***);

    ***REMOVED***
***REMOVED***
);
define("contratosrp_aux", function () { ***REMOVED***);