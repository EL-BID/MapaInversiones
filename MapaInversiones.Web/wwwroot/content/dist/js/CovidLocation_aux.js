var anyo_actual = (new Date).getFullYear();
var cant_contratos = 5;

require([
    'app/network/Services',
    'app/network/urlsMap',
    'comunes'
],
	function (
        Services,
        urlsMap,
        comunes
	) {

InicializaDatos();
	   

function InicializaDatos() {

    //****GET INFO CONTRATACION ****//

    getAnnio();
    //********************************
    configurarEnlaceLocation();

***REMOVED***

	    function configurarEnlaceLocation() {

	        $('.enlace_location').each(function (i, e) {
	            $(e).bind('click', function () {
	                var enlace_url = "../../localizacion/LocationProfile#/";
	                var anyo = (new Date).getFullYear() - 1;
	                var location_id = $(this).attr("location_id");
	                document.cookie = "location_id=" + location_id + ";path=/;";
	                var tipo = $(this).attr("tipo");
	                //&municipio=0000&departamento=00&periods=2016&sector=2
	                if (tipo == "departamento") {
	                    //departamento
	                    enlace_url += "?" + "departamento=" + location_id
	            ***REMOVED***
	                else if (tipo == "sector") {
	                    //sector
	                    enlace_url += "?" + "sector=" + location_id
	            ***REMOVED***
	                else {
	                    //municipio
	                    enlace_url += "?" + "municipio=" + location_id
	            ***REMOVED***
	            
	                //-----------------------------------
	                $(this).attr('href', enlace_url);
	            
	        ***REMOVED***);
	    ***REMOVED***);
	***REMOVED***


	    function getAnnio() {
	        //AND DATOS QUEMADOS

	        Services.contratista.getAnnioContratosProyecto("idproyecto=20")
                .done(function (data) {
                    deshabilita(true);
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

                        //AND DATOS QUEMADOS
                        getContratos($("#top_contratista_periodos option:selected").text(), "", 1, cant_contratos, 20, "");

                ***REMOVED*** else {

                        var fila = '<div class="contractBox" >'
                          + '<div class="defaultMessage"><span class="text-bold">No se encuentran resultados con los filtros solicitados</span></div>'
                          + '</div>';

                        $("#srcContratos").html($("#srcContratos").html() + fila);
                ***REMOVED***

            ***REMOVED***);

	***REMOVED***





	    function getContratos(annio, ruc, pagina, registros, idproyecto, nombreContratista) {
	        //alert(ruc + '      ' + nombreContratista);
	        if (ruc === "") { ruc = null ***REMOVED***
	        if (nombreContratista === "") { nombreContratista = null ***REMOVED***
	        $("#top_contratista_periodos").attr("cantidadTotal", 0);
	        var filtros = {
	            Annio: annio,
	            RUC: ruc,
	            NumeroPagina: pagina,
	            RegistrosPorPagina: registros,
                //AND DATOS QUEMADOS
	            IdProyecto: 20,
	            NombreContratista: nombreContratista

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
	                    //alert(result.CantidadTotalRegistros);
	                    if (result.CantidadTotalRegistros > 0) {

	                        //alert(JSON.stringify(result.listInformacion));
	                        var info = result.listInformacion;
	                        var proceso = "";
	                        var referencia = "";
	                        var data = "";
	                        var fila = "";
	                        var inicioLuis = '<div class="contractBox">';
	                        var finLuis = '</div>';
	                        var inicio = "";
	                        var fin = "";
	                        $("#srcContratos").html("");
	                        for (var i = 0; i < info.length ; i++) {
	                            if (proceso != info[i].CodigoProceso.toString()) {
	                                if (i > 0) //Cambio de proceso
	                                {
	                                    fin = '<div class="row text-center">'
                                            + '<div class="col-xs-12 col-md-12"><a href="' + referencia + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                            + '</div></div>';
	                                    data += inicioLuis + inicio + fila + finLuis + fin + finLuis;
	                                    fila = "";
	                                    inicio = "";
	                                    fin = "";
	                            ***REMOVED***
	                                referencia = info[i].DocURL.toString();
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
                                        + '                 <span class="small"> UNIDAD DE COMPRA</span><div class="clearfix"></div>'
                                        + '                 <span class="h4">' + info[i].UnidadCompra.toString() + '</span>'
                                        + '             </div>'
                                        + '         </div>'
                                        + '     </div>'
                                        + '     <div class="contractData">'
                                        + '         <div class="row border-b">'
                                        + '             <div class="col-xs-12 col-md-4"><span class="txt_small">Estado</span><span class="amount_adj">' + info[i].EstadoProceso.toString() + '</span></div>'
                                        + '             <div class="col-xs-6 col-md-4"><span class="txt_small">Monto Estimado</span><span class="amount_adj"></span></div>' //RD ' + (info[i].MontoEstimadoProceso * 1).formatMoney(2, '.', ',').toString() + '
                                        + '             <div class="col-xs-6 col-md-2"><span class="txt_small">Moneda</span><span class="amount_adj">L</span></div>' //DOP
                                        + '         </div>'
                                        + '         <div class="row border-b">'
                                        + '             <div class="col-xs-4 col-md-4"><span class="txt_small">Fecha de inicio de publicación </span><span class="amount_adj">' + info[i].FCH_INICIO_PUBLICACION.toString().substr(0, 10) + '</span></div>'
                                        + '             <div class="col-xs-4 col-md-4"><span class="txt_small">Fecha de Finalización de publicación</span><span class="amount_adj"> ' + info[i].FCH_FIN_PUBLICACION.toString().substr(0, 10) + '</span></div>'
                                        + '             <div class="col-xs-4 col-md-4"><span class="txt_small">Fecha estimada de adjudicación </span><span class="amount_adj">' + info[i].FCH_ESTIMADA_ADJUDICACION.toString().substr(0, 10) + '</span></div>'
                                        + '         </div>'
                                        + '     </div>'
                                        + ' </div>'
                                        + ' <div class="related-contracts">'
                                        + '     <span class="h4">Contratos asociados a este proceso:</span>'
                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
	                                proceso = info[i].CodigoProceso.toString();
	                        ***REMOVED***
	                            fila += '<div class="panel panel-default">'
                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                    + '                <h4 class="panel-title">'
                                    + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">'
                                    + '                        Código contrato:  ' + info[i].CodigoContrato.toString() + ''
                                    + '                    </a>'
                                    + '                </h4>'
                                    + '            </div>'
                                    + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                                    + '                <div class="panel-body">'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-12 col-md-12"><span class="small">CONTRATO</span><span class="amount_adj">RD ' + info[i].DescripcionContrato.toString() + ' </span></div>'
                                    + '                    </div>'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-md-6">'
                                    + '                            <span class="small"> RAZON SOCIAL</span>'
                                    + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].numerodocumento.toString() + '"><span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span>' + info[i].Contratista.toString() + '</span></a>'
                                    + '                        </div>'
                                    + '                        <div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipodocumento.toString() + '</span></div>'
                                    + '                        <div class="col-md-3"><span class="small"> Número de documento</span><span class="amount_adj">' + info[i].numerodocumento.toString() + '</span></div>'
                                    + '                    </div>'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-8 col-md-8"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj"></span></div>' //RD ' + (info[i].MontoContratadoTotalContrato * 1).formatMoney(2, '.', ',').toString() + ' 
                                    + '                        <div class="col-xs-4 col-md-4"><span class="small"> MONEDA</span><span class="amount_adj">L</span></div>' //DOP 
                                    + '                    </div>'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small"> Fecha de inicio CONTRATO</span><span class="amount_adj">' + info[i].OfertaPeriodoFechaInicio.toString().substr(0, 10) + '</span></div>'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIN CONTRATO</span><span class="amount_adj"> ' + info[i].OfertaPeriodoFechaFin.toString().substr(0, 10) + '</span></div>'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">' + info[i].OfertaPeriodoDuracion.toString() + ' Días</span></div>';

	                            fila += '                        <div class="col-xs-6 col-md-3"><span class="small"> Fecha DE LICITACION</span><span class="amount_adj">';

	                            if (info[i].FechaLicitacion !== null && info[i].FechaLicitacion.toString().substr(0, 10) !== "1900-01-01") {
	                                fila += info[i].FechaLicitacion.toString().substr(0, 10) + '</span></div>';
	                        ***REMOVED***
	                            else {
	                                fila += '&nbsp;</span></div>';
	                        ***REMOVED***

	                            fila += '                    </div>'
                                    + '                </div>'
                                    + '            </div>'
                                    + '        </div>';
	                            //+ '  </div>';
	                    ***REMOVED***
	                        data += inicioLuis + inicio + fila + finLuis;
	                        data += '<div class="row text-center">'
                                    + '<div class="col-xs-12 col-md-12"><a href="' + referencia + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                    + '</div></div>' + finLuis;
	                        $("#srcContratos").html(data);
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
	                alert("Response: " + response.responseText);
	          ***REMOVED***
	            failure: function (response) {
	                deshabilita(false);
	                alert("Response F: " + response.responseText);
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
	            getContratos($("#top_contratista_periodos option:selected").text(), "", 1, cant_contratos, projectPerfil[0].id_project, "");
	    ***REMOVED***
	***REMOVED***);

	    $("#btn-buscar").click(function () {
	        if (!disableClick) {
	            deshabilita(true);
	            ///alert($("#top_contratista_periodos option:selected").text())
	            getContratos($("#top_contratista_periodos option:selected").text(), "", 1, cant_contratos, projectPerfil[0].id_project, "");

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
	            //AND DATOS QUEMADOS

	            getContratos($("#top_contratista_periodos option:selected").text(), $("#top_contratista_ruc").val(), pagina_actual, cant_por_pag, 20, $("#contratista").val());
	    ***REMOVED***);

	***REMOVED***

	    function configuraEnlaceContratista() {
	        $(".enlace_contratista").click(function () {
	            var ruc = $(this).attr('data-parameter');
	            var dataValue = $(this).attr('data-parameter'),
                    dataType = $(this).attr('data-type').toLowerCase();
	            document.cookie = "ruc=" + ruc + ";path=/;";
	            var url = "/contratista/contratistaprofile/proyectos/?" + dataType + "=" + dataValue;
	            window.location.href = url;

	    ***REMOVED***);

	***REMOVED***
	***REMOVED***
)
