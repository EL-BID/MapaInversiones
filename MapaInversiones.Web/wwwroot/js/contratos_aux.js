        var done_graficas = 0;
        var cant_graficas = 5;
        var cant_contratos = 20;
        var scrol = 0;


        inicializaDatos();

        function inicializaDatos() {


            getAnnio($("#moneda").val());

        }


        function configuraEnlaceContratista() {
            $(".enlace_contratista").click(function () {
                var ruc = $(this).attr('data-parameter');
                var dataValue = $(this).attr('data-parameter'),
                    dataType = $(this).attr('data-type').toLowerCase();
                document.cookie = "ruc=" + ruc + ";path=/;";
                var url = "/contratista?" + dataType + "=" + dataValue;
                window.open(url, '_blank');

            });


        }

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }



Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


        function cambiarTipoTexto(cadena) {
            return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
        }


function getAnnio(moneda, nombreProceso = null) {
            //debugger;
            var filtros = {
                Moneda: moneda,
                NombreProceso: nombreProceso
            };
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
                   // select = select + '<option value="0">Todos</option>';
                    for (var i = 0; i < items_result.length; i++) {

                        if (!annios.includes(items_result[i].valor.toString())) {
                            annios.push(items_result[i].valor.toString());
                            select = select + '<option value="' + items_result[i].valor.toString() + '">' + items_result[i].valor.toString() + '</option>';
                        }

                    }

                    $('#top_contratos_periodos').html(select).fadeIn();
                    if (items_result.length > 0) {
                        $("#top_contratos_periodos").val($('#maxyear').val());
                        //$("#top_contratos_periodos").attr("default", items_result[items_result.length - 1].valor.toString());
                        getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, $("#top_origen_informacion option:selected").val(), "", $('#proceso').val(), $("#moneda").val());

                    } else {
                        $("#srcContratos").html("");
                        var fila = '<div class="contractBox" >'
                          + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                          + '</div>';

                        $("#srcContratos").html(fila);
                    }
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });

        }

        var disableClick = false;
        function deshabilita(des) {
            disableClick = des;
            if (des) {
                $("#btn-buscar").prop("disabled", des);
                $('#btnLimpiar').attr("disabled", "disabled")
            } else {
                $("#btn-buscar").prop("disabled", des);
                $('#btnLimpiar').removeAttr("disabled")
            }
        }

        $("#btnLimpiar").click(function () {
            if (!disableClick) {
                //$("#top_contratos_periodos").val(0);
                //$("#top_contratos_estados").val("");
                $("#top_origen_informacion").val("");
                $("#entidad").val("");
                $("#proceso").val("");
                deshabilita(true);
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, $("#top_origen_informacion option:selected").val(), "", "",$("#moneda").val());
            }
        });

        $("#btn-buscar").click(function () {
            if (!disableClick) {
                deshabilita(true);
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, $("#top_origen_informacion option:selected").val(), $('#entidad').val(), $('#proceso').val(),$("#moneda").val());
                getGraficasAll();
            }

        });


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
            } else {
                inicio = (cociente * cant_por_linea) + 1;
            }

            var fin = inicio + (cant_por_linea - 1);
            if (totalPag < cant_por_linea) {
                fin = totalPag;
            }
            if (fin > totalPag) {
                fin = totalPag;
            }


            if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
                var pag_enlace = divPag.append("a")
                    .attr("id", "page_left")
                    .attr("role", "button")
                    .attr("class", "material-icons md-24")
                    .attr("data-page", inicio - cant_por_linea)
                pag_enlace.append("span")
                    .attr("class", "")
                    .text("chevron_left ")
            }



            for (var i = inicio; i <= fin; i++) {

                if (i == pag_actual) {
                    var pag_enlace = divPag.append("span")
                        .attr("class", "pag_actual")
                        .attr("data-page", i)
                    pag_enlace.append("text")
                        .text(i)
                } else {
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

                }


            }

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

                }
            }

            $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
               
                deshabilita(true);
                //$('#divPagContratos').attr('disabled', 'disabled');
                d3.select("#divProyectos").empty();
                pagina_actual = $(this).attr("data-page");

                getContratos($("#top_contratos_periodos option:selected").val(), pagina_actual, cant_por_pag, $("#top_origen_informacion option:selected").val(), $('#entidad').val(), $('#proceso').val());
            });

        }

//        function getContratos(annio, pagina, registros, origen, entidad, proceso, moneda) {

//            var filtros = {
//                Annio: annio,
//                NumeroPagina: pagina,
//                RegistrosPorPagina: registros,
//                NombreEntidad: entidad,
//                NombreProceso: proceso,
//                Estado: null,
//                Moneda: moneda,
//                NombreContratista: null,
//                OrigenInformacion: 0,
//                CodigoContrato: null
//            };
//            $.ajax({
//                type: 'GET',
//                contentType: "application/json; charset=utf-8",
//                dataType: "json",
//                url: "api/ServiciosContratos/Contrato/",
//                cache: false,
//                data: filtros,
//                success: function (result) {
//                    if (result.status == true) {
//                        if (result.cantidadTotalRegistros > 0) {
//                            var info = result.data;
//                            var proceso = "";
//                            var entidad = "";
//                            var filaproceso = "";
//                            var referencia = "";
//                            var data = "";
//                            var fila = "";
//                            var filaconfirma = "";
//                            var inicioLuis = '<div class="contractBox">';
//                            var finLuis = '</div>';
//                            var inicio = "";
//                            var fin = "";
//                            $("#srcContratos").html("");
//                            for (var i = 0; i < info.length; i++) {
//                                var nomComprador = info[i].comprador ? info[i].comprador.toString() : "";
//                                if (i > 0 && entidad == nomComprador && proceso != info[i].codigoProceso.toString()) {
//                                    fila += filaconfirma + '</div>' + referencia + '</div>';
//                                    filaconfirma = "";

//                                }
//                                if (entidad != nomComprador) {
//                                    if (i > 0) //Cambio de entidad
//                                    {
//                                        data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;
//                                        fila = "";
//                                        filaconfirma = "";
//                                        filasinfirma = "";
//                                        inicio = "";
//                                        fin = "";
//                                    }
//                                    if (info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")) { stilo = "contractONCAE" } else { stilo = "contractSEFIN" }
//                                    inicio = '<div class="cotractName ' + stilo+'"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Entidad</span><div class="clearfix"></div>'
//                                        + '                 <span class="h4">' + nomComprador + '</span>'
//                                        + ' </div></div></div>';
//                                    entidad = nomComprador;
//                                }

//                                if (proceso != info[i].codigoProceso.toString()) {

//                                    //fila += '<div class="processName">'
//                                    //    + '		<div class="row">'
//                                    //    + '			<div class="col-xs-12 col-md-6">'
//                                    //    + '				<span class="small">Origen de los fondos</span><div class="clearfix"></div>'
//                                    //    + '				<span class="h4">' + info[i].origenFondos.toString() + '</span>  </div>'
//                                    //    + '			<div class="col-xs-12 col-md-6">'
//                                    //    + '				<span class="small">Fuente de Datos</span><div class="clearfix"></div>'
//                                    //    + '				<span class="h4">' + info[i].origenInformacion.toString().toUpperCase().replace("ONCAE - CATALOGO ELECTRÓNICO", "ONCAE - CATÁLOGO ELECTRÓNICO") + '</span>  </div> '
//                                    //    + '      </div> '
//                                        //+ '	</div>';
//                                    fila += '<div class="contractNumberRP"><span class="">Código proceso: </span>'
//                                        + '	<span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>'
//                                        + '<div class="contractNumberRP"><span class="">Proceso: </span>'
//                                        + '	<span class="text-bold">' + info[i].descripcionProceso.toString() + '</span></div>'
//							            + '<div class="wrap-head-process">';
//                                    fila += '<div class="contractData">';

//                                    fila += ''
//							            + '		<div class="row border-b">'
//							            + '			<div class="col-xs-12 col-md-4">'
//							            + '				<span class="txt_small">Estado del proceso</span>'
//							            + '				<span class="amount_adj">';
//                                    if (info[i].estadoProceso) { fila += info[i].estadoProceso.toString(); }
//                                    fila += '</span></div>'
//                                        + '			<div class="col-xs-6 col-md-4"><span class="txt_small">Monto Estimado</span> <span class="amount_adj"> ' + (info[i].valorPlaneado * 1).formatMoney(2, '.', ',').toString() + ' </span></div>'
//                                        + '			    <div class="col-xs-6 col-md-2">'
//                                        + '				   <span class="txt_small">Moneda</span>'
//                                        + '				   <span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span>'
//                                        + '			    </div>'
//                                        + '			</div>';


//                                    fila += ''
//                                        + '		<div class="row border-b">';
//                                    if (info[i].fechaIncioPublicacionProceso) {
//                                        fila += ''
//                                        + '			<div class="col-xs-12 col-md-4">'
//                                        + '		    <span class="txt_small">Fecha de Inicio</span>'
//                                            + '         <span class="amount_adj">' + info[i].fechaIncioPublicacionProceso.toString().substr(0, 10) + '</span>'
//                                        + '			    </div>';
//                                    }
//                                    if (info[i].fechaInicioRecepcionOfertas) {
//                                        fila += ''
//                                        + '			<div class="col-xs-12 col-md-4">'
//                                        + '		    <span class="txt_small">Fecha de Recepción</span>'
//                                            + '         <span class="amount_adj">' + info[i].fechaInicioRecepcionOfertas.toString().substr(0, 10) + '</span>'
//                                        + '			    </div>';
//                                    }
//                                    if (info[i].fechaEstimadaAdjudicacion) {
//                                        fila += ''
//                                        + '			<div class="col-xs-12 col-md-4">'
//                                        + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
//                                            + '         <span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span>'
//                                        + '			    </div>';
//                                    }

//                                    fila += '	</div>'
//                                    + '	</div>';

//                                    fila += '</div>'
//                                           + '<div class="clearfix"></div>';
//                                    filaconfirma += ' <div class="related-contracts">'
//                                        + '     <span class="h4">Contratos de ' + info[i].origenInformacion+' asociados a este proceso:</span>'
//                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
//                                    proceso = info[i].codigoProceso.toString();

//                                    if (info[i].docURL){
//                                    referencia = '<div class="row text-center">'
//                                        + '<div class="col-xs-12 col-md-12"><a href="' + info[i].docURL.toString() + '" target="_blank" class="btn btn-outlined"><i class="material-icons md-22">launch</i> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
//                                            + '</div>';
//                                    }

//                                }


//                                filaconfirma += '<div class="panel panel-default">'
//                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
//                                    + '                <h4 class="panel-title">'
//                                    + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

//                                if (info[i].codigoContrato) { filaconfirma += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; } else { filaconfirma += '                      Pendiente emisión código contratación  ' }

//                                filaconfirma += '     </a>'
//                                    + '                </h4>'
//                                    + '            </div>'
//                                    + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
//                                    + '                <div class="panel-body">';
//                                if (info[i].descripcionContrato) {
//                                    filaconfirma += '          <div class="row border-b">'
//                                        + '                        <div class="col-md-12"><span class="small"> CONTRATO</span><span class="amount_adj">' + info[i].descripcionContrato.toString() + '</span></div>'
//                                        + '                    </div>';
//                                }
//                                var moneda = 'RD$'; //'L';
//                                if (info[i].monedaContrato.toString()) {
//                                    if (info[i].monedaContrato.toString() == 'USD') {
//                                        moneda = '';// '$';
//                                    }
//                                }
//                                filaconfirma +=  '        <div class="row border-b">'
//                                   + '                        <div class="col-md-4">'
//                                   + '                            <span class="small"> RAZÓN SOCIAL<span>'
//                                    + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].codigoProveedor.toString() + '"><span class="amount_adj"><i class="material-icons md-22">shortcut</i> ' + info[i].contratista.toString() + '</span></a>'
//                                   + '                        </div>'
//                                    + '                        <div class="col-md-4"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipoCodigoProveedor.toString() + '</span></div>'
//                                    + '                        <div class="col-md-4"><span class="small"> NÚMERO DE DOCUMENTO</span><span class="amount_adj">' + info[i].codigoProveedor.toString() + '</span></div>'
//                                    + '                    </div>'
//                                   + '                    <div class="row border-b">'
//                                    + '                        <div class="col-xs-6 col-md-6"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj"> ' + moneda + ' ' + (info[i].valorContratado * 1).formatMoney(2, '.', ',').toString() + '</span></div>'
//                                    + '                        <div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span></div>'
//                                   + '                    </div>'
//                                   //+ '                    <div class="row border-b">'
//                                   //+ '                        <div class="col-xs-6 col-md-6"><span class="small"> MONTO</span><span class="amount_adj"> ' + moneda + ' ' + (info[i].valorContratado * 1).formatMoney(1, '.', ',').toString() + ' </span></div>'
//                                   //+ '                        <div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj">' + info[i].monedaContrato.toString() + '</span></div>' //DOP
//                                   //+ '                    </div>';

//                                filaconfirma += '                    <div class="row border-b">';

//                                if (info[i].fechaInicioContrato && info[i].fechaInicioContrato.toString().substr(0, 10) !== "1900-01-01") {
//                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">FECHA DE INICIO CONTRATO</span>'
//                                    + '                                                                     <span class="amount_adj">'
//                                    + info[i].fechaInicioContrato.toString().substr(0, 10)
//                                    + '                                                                      </span></div>';
//                                }
//                                if (info[i].fechaFinContrato && info[i].fechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
//                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
//                                    + 'FECHA DE FIN CONTRATO'
//                                    + '</span><span class="amount_adj">'
//                                        + info[i].fechaFinContrato.toString().substr(0, 10)
//                                    + '        </span></div>';
//                                }

//                                if (info[i].fechaInicioEjecucionContrato && info[i].fechaInicioEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
//                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
//                                    + 'Fecha de INICIO EJECUCIÓN'
//                                    + '</span><span class="amount_adj">'
//                                        + info[i].fechaInicioEjecucionContrato.toString().substr(0, 10)
//                                    + '        </span></div>';
//                                }
//                                if (info[i].fechaFinEjecucionContrato && info[i].fechaFinEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
//                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
//                                    + 'Fecha de FIN EJECUCIÓN'
//                                    + '</span><span class="amount_adj">'
//                                        + info[i].fechaFinEjecucionContrato.toString().substr(0, 10)
//                                    + '        </span></div>';
//                                }

//                                filaconfirma += '                    </div>';

//                                if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
//                                    filaconfirma += '                    <div class="row border-b">'
//                                    + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

//                                    if (info[i].ofertaPeriodoDuracion) { filaconfirma += info[i].ofertaPeriodoDuracion.toString(); }

//                                    filaconfirma += '                   Días</span></div>';

//                                    filaconfirma += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

//                                    if (info[i].fechaPublicacion !== null && info[i].fechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
//                                        filaconfirma += info[i].fechaPublicacion.toString().substr(0, 10) + '</span></div>';
//                                    }
//                                    else {
//                                        filaconfirma += '</span></div>';
//                                    }

//                                    filaconfirma += '                    </div>';

//                                }

//                                filaconfirma += '                </div>'
//                                + '               <div class="panel-footer" style="align:center">';

//                                if (info[i].codigoContrato) {
//                                    filaconfirma += '                    <a href="../../contrato?codcontrato=' + info[i].codigoContrato.toString() + '" class="btn btn-primary btn-participe"><i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>';
//                                }
//                                filaconfirma += '                 </div>'
//                                + '            </div>'
//                                + '        </div>';
//                                //+ '  </div>';
//                            }


//                            data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;


//                            $("#srcContratos").html(data);
//                            if (scrol >= 1) {
//                                $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
//                            } else { scrol = scrol + 1; }

//                            dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
//                            configuraEnlaceContratista();
//                        }
//                        else {
//                            $("#divPagContratos").empty();
//                            $("#srcContratos").html("");
//                            var fila = '<div class="contractBox" >'
//                                + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
//                                + '</div>';
//                            $("#srcContratos").html(fila);
//                        }
//                    } else {
//                        alert("Message: " + result.message);
//                    }
//                    deshabilita(false);
//                },
//                error: function (response) {
//                    deshabilita(false);
//                    alert(response.responseText);
//                },
//                failure: function (response) {
//                    deshabilita(false);
//                    alert(response.responseText);
//                }
//            });

//        }








//autocompletar en contratos





//function getContratos(annio, pagina, registros, origen, entidad, proceso, moneda) {

//    const SIN_DATOS = "SIN DATOS";

//    var filtros = {
//        Annio: annio,
//        NumeroPagina: pagina,
//        RegistrosPorPagina: registros,
//        NombreEntidad: entidad,
//        NombreProceso: proceso,
//        Estado: null,
//        Moneda: moneda,
//        NombreContratista: null,
//        OrigenInformacion: 0,
//        CodigoContrato: null
//    };

//    $.ajax({
//        type: 'GET',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        url: "api/ServiciosContratos/Contrato/",
//        cache: false,
//        data: filtros,

//        success: function (result) {

//            if (result.status == true) {

//                if (result.cantidadTotalRegistros > 0) {

//                    var info = result.data;

//                    var proceso = "";
//                    var entidadAgrupada = "";
//                    var filaproceso = "";
//                    var referencia = "";
//                    var data = "";
//                    var fila = "";
//                    var filaconfirma = "";
//                    var inicioLuis = '<div class="contractBox">';
//                    var finLuis = '</div>';
//                    var inicio = "";
//                    var fin = "";

//                    $("#srcContratos").html("");

//                    for (var i = 0; i < info.length; i++) {

//                        // --- Ajuste: siempre devolver entidad o SIN_DATOS ---
//                        var nomComprador = info[i].comprador
//                            ? info[i].comprador.toString()
//                            : SIN_DATOS;

//                        // Detectamos cambio de entidad
//                        if (i > 0 && entidadAgrupada == nomComprador && proceso != info[i].codigoProceso.toString()) {
//                            fila += filaconfirma + '</div>' + referencia + '</div>';
//                            filaconfirma = "";
//                        }

//                        if (entidadAgrupada != nomComprador) {

//                            if (i > 0) {
//                                data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;
//                                fila = "";
//                                filaconfirma = "";
//                                filasinfirma = "";
//                                inicio = "";
//                                fin = "";
//                            }

//                            var stilo = info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")
//                                ? "contractONCAE"
//                                : "contractSEFIN";

//                            // --- Ajuste: mantener título aunque buyer sea null ---
//                            inicio = '<div class="cotractName ' + stilo + '"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Entidad</span><div class="clearfix"></div>'
//                                + '<span class="h4">' + nomComprador + '</span>'
//                                + '</div></div></div>';

//                            entidadAgrupada = nomComprador;
//                        }

//                        if (proceso != info[i].codigoProceso.toString()) {

//                            fila +=
//                                '<div class="contractNumberRP"><span class="">Código proceso: </span>'
//                                + '<span class="text-bold">' + info[i].codigoProceso + '</span></div>'
//                                + '<div class="contractNumberRP"><span class="">Proceso: </span>'
//                                + '<span class="text-bold">' + info[i].descripcionProceso + '</span></div>'
//                                + '<div class="wrap-head-process">';

//                            fila += '<div class="contractData">';

//                            fila += '<div class="row border-b">';

//                            // --- Ajuste: si estadoProceso viene vacío, NO mostrar el título ---
//                            if (info[i].estadoProceso) {
//                                fila +=
//                                    '<div class="col-xs-12 col-md-4">'
//                                    + '<span class="txt_small">Estado del proceso</span>'
//                                    + '<span class="amount_adj">' + info[i].estadoProceso + '</span>'
//                                    + '</div>';
//                            } else {
//                                fila +=
//                                    '<div class="col-xs-12 col-md-4">'
//                                    + '<span class="txt_small">&nbsp;</span>'
//                                    + '<span class="amount_adj"></span>'
//                                    + '</div>';
//                            }

//                            fila +=
//                                '<div class="col-xs-6 col-md-4"><span class="txt_small">Monto Estimado</span> '
//                                + '<span class="amount_adj">' + (info[i].valorPlaneado * 1).formatMoney(2, ".", ",") + '</span></div>'
//                                + '<div class="col-xs-6 col-md-2">'
//                                + '<span class="txt_small">Moneda</span>'
//                                + '<span class="amount_adj">' + info[i].monedaContrato + '</span>'
//                                + '</div>'
//                                + '</div>';

//                            fila += '<div class="row border-b">';

//                            if (info[i].fechaIncioPublicacionProceso) {
//                                fila +=
//                                    '<div class="col-xs-12 col-md-4">'
//                                    + '<span class="txt_small">Fecha de Inicio</span>'
//                                    + '<span class="amount_adj">' + info[i].fechaIncioPublicacionProceso.toString().substr(0, 10) + '</span>'
//                                    + '</div>';
//                            }

//                            if (info[i].fechaInicioRecepcionOfertas) {
//                                fila +=
//                                    '<div class="col-xs-12 col-md-4">'
//                                    + '<span class="txt_small">Fecha de Recepción</span>'
//                                    + '<span class="amount_adj">' + info[i].fechaInicioRecepcionOfertas.toString().substr(0, 10) + '</span>'
//                                    + '</div>';
//                            }

//                            if (info[i].fechaEstimadaAdjudicacion) {
//                                fila +=
//                                    '<div class="col-xs-12 col-md-4">'
//                                    + '<span class="txt_small">Fecha estimada de adjudicación</span>'
//                                    + '<span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span>'
//                                    + '</div>';
//                            }

//                            fila += '</div></div></div><div class="clearfix"></div>';

//                            filaconfirma +=
//                                '<div class="related-contracts">'
//                                + '<span class="h4">Contratos de ' + info[i].origenInformacion + ' asociados a este proceso:</span>'
//                                + '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';

//                            proceso = info[i].codigoProceso.toString();

//                            if (info[i].docURL) {
//                                referencia =
//                                    '<div class="row text-center">'
//                                    + '<div class="col-xs-12 col-md-12">'
//                                    + '<a href="' + info[i].docURL + '" target="_blank" class="btn btn-outlined">'
//                                    + '<i class="material-icons md-22">launch</i> <span class="txt_small">Conozca mas de este proceso</span></a>'
//                                    + '</div></div>';
//                            }

//                        }

//                        // === PANEL CONTRATO (sin cambios estructurales) ===
//                        filaconfirma +=
//                            '<div class="panel panel-default">'
//                            + '<div class="panel-heading" role="tab" id="headingOne' + i + '">'
//                            + '<h4 class="panel-title">'
//                            + '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

//                        if (info[i].codigoContrato) {
//                            filaconfirma += ' Código de contratación: ' + info[i].codigoContrato + ' ';
//                        } else {
//                            filaconfirma += ' Pendiente emisión código contratación ';
//                        }

//                        filaconfirma +=
//                            '</a></h4></div>'
//                            + '<div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel">'
//                            + '<div class="panel-body">';

//                        if (info[i].descripcionContrato) {
//                            filaconfirma +=
//                                '<div class="row border-b"><div class="col-md-12">'
//                                + '<span class="small"> CONTRATO</span>'
//                                + '<span class="amount_adj">' + info[i].descripcionContrato + '</span>'
//                                + '</div></div>';
//                        }

//                        // Moneda
//                        var monedaSimbolo = info[i].monedaContrato == "USD" ? "" : "RD$";

//                        filaconfirma +=
//                            '<div class="row border-b">'
//                            + '<div class="col-md-4">'
//                            + '<span class="small"> RAZÓN SOCIAL</span>'
//                            + '<a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].codigoProveedor + '">'
//                            + '<span class="amount_adj"><i class="material-icons md-22">shortcut</i> ' + info[i].contratista + '</span></a>'
//                            + '</div>'
//                            + '<div class="col-md-4"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipoCodigoProveedor + '</span></div>'
//                            + '<div class="col-md-4"><span class="small"> NÚMERO DE DOCUMENTO</span><span class="amount_adj">' + info[i].codigoProveedor + '</span></div>'
//                            + '</div>';

//                        filaconfirma +=
//                            '<div class="row border-b">'
//                            + '<div class="col-xs-6 col-md-6"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj"> '
//                            + monedaSimbolo + ' ' + (info[i].valorContratado * 1).formatMoney(2, ".", ",")
//                            + '</span></div>'
//                            + '<div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj">' + info[i].monedaContrato + '</span></div>'
//                            + '</div>';

//                        // Fechas
//                        filaconfirma += '<div class="row border-b">';

//                        const fechaInicioC = info[i].fechaInicioContrato;
//                        const fechaFinC = info[i].fechaFinContrato;
//                        const fechaInicioE = info[i].fechaInicioEjecucionContrato;
//                        const fechaFinE = info[i].fechaFinEjecucionContrato;

//                        function fechaValida(f) {
//                            return f && f.toString().substr(0, 10) !== "1900-01-01";
//                        }

//                        if (fechaValida(fechaInicioC)) {
//                            filaconfirma += '<div class="col-xs-6 col-md-3"><span class="small">FECHA DE INICIO CONTRATO</span>'
//                                + '<span class="amount_adj">' + fechaInicioC.toString().substr(0, 10) + '</span></div>';
//                        }

//                        if (fechaValida(fechaFinC)) {
//                            filaconfirma += '<div class="col-xs-6 col-md-3"><span class="small">FECHA DE FIN CONTRATO</span>'
//                                + '<span class="amount_adj">' + fechaFinC.toString().substr(0, 10) + '</span></div>';
//                        }

//                        if (fechaValida(fechaInicioE)) {
//                            filaconfirma += '<div class="col-xs-6 col-md-3"><span class="small">Fecha de INICIO EJECUCIÓN</span>'
//                                + '<span class="amount_adj">' + fechaInicioE.toString().substr(0, 10) + '</span></div>';
//                        }

//                        if (fechaValida(fechaFinE)) {
//                            filaconfirma += '<div class="col-xs-6 col-md-3"><span class="small">Fecha de FIN EJECUCIÓN</span>'
//                                + '<span class="amount_adj">' + fechaFinE.toString().substr(0, 10) + '</span></div>';
//                        }

//                        filaconfirma += '</div>';

//                        // Duración + firma
//                        if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
//                            filaconfirma +=
//                                '<div class="row border-b">'
//                                + '<div class="col-xs-6 col-md-3"><span class="small"> Duración </span>'
//                                + '<span class="amount_adj">' + (info[i].ofertaPeriodoDuracion || "") + ' Días</span></div>'
//                                + '<div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span>'
//                                + '<span class="amount_adj">'
//                                + (fechaValida(info[i].fechaPublicacion)
//                                    ? info[i].fechaPublicacion.toString().substr(0, 10)
//                                    : '')
//                                + '</span></div>'
//                                + '</div>';
//                        }

//                        filaconfirma +=
//                            '</div><div class="panel-footer" style="align:center">';

//                        if (info[i].codigoContrato) {
//                            filaconfirma +=
//                                '<a href="../../contrato?codcontrato=' + info[i].codigoContrato
//                                + '" class="btn btn-primary btn-participe"><i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>';
//                        }

//                        filaconfirma += '</div></div></div>';
//                    }

//                    data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;

//                    $("#srcContratos").html(data);

//                    if (scrol >= 1) {
//                        $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
//                    } else { scrol++; }

//                    dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
//                    configuraEnlaceContratista();

//                } else {
//                    $("#divPagContratos").empty();
//                    $("#srcContratos").html(
//                        '<div class="contractBox"><div class="contractNumberRP">'
//                        + '<span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span>'
//                        + '</div></div>'
//                    );
//                }

//            } else {
//                alert("Message: " + result.message);
//            }

//            deshabilita(false);
//        },

//        error: function (response) {
//            deshabilita(false);
//            alert(response.responseText);
//        },

//        failure: function (response) {
//            deshabilita(false);
//            alert(response.responseText);
//        }
//    });
//}

// ---------------- HELPERS GLOBALES ----------------
const SIN_DATOS = "SIN ENTIDAD";
const TEXT_ALWAYS_SIN_DATOS = new Set([
    "comprador",
    "origenInformacion",
    "descripcionProceso",
    "contratista",
    "tipoCodigoProveedor",
    "codigoProveedor",
    "descripcionContrato"
]);

function safeText(key, v) {
    if (v === null || v === undefined || v === "") {
        return TEXT_ALWAYS_SIN_DATOS.has(key) ? SIN_DATOS : "";
    }
    return v.toString();
}

function safeMaybeText(v) {
    return (v === null || v === undefined) ? "" : v.toString();
}

function safeMoney(v) {
    if (v === null || v === undefined || v === "") return "";
    var n = Number(v);
    if (isNaN(n)) return "";
    return (n * 1).formatMoney(2, ".", ",").toString();
}

function safeDate(v) {
    if (!v || !v.toString) return "";
    var s = v.toString().substr(0, 10);
    return (s === "1900-01-01") ? "" : s;
}

function fechaValida(v) {
    return v && v.toString && v.toString().substr(0, 10) !== "1900-01-01";
}

function hashString(str) {
    var h = 0, i = 0, len = str.length;
    while (i < len) { h = ((h << 5) - h) + str.charCodeAt(i++); h |= 0; }
    return h;
}

// ---------------- FUNCION PRINCIPAL ----------------
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
        OrigenInformacion: origen || 0,
        CodigoContrato: null
    };

    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/ServiciosContratos/Contrato/",
        cache: false,
        data: filtros,
        success: function (result) {

            if (!result || result.status !== true) {
                alert("Message: " + (result ? result.message : "Respuesta inválida"));
                deshabilita(false);
                return;
            }

            if (!result.cantidadTotalRegistros || result.cantidadTotalRegistros <= 0) {
                $("#divPagContratos").empty();
                $("#srcContratos").html(
                    '<div class="contractBox"><div class="contractNumberRP">' +
                    '<span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span>' +
                    '</div></div>'
                );
                deshabilita(false);
                return;
            }

            // ---------------- RENDER ----------------
            function renderEntidad(nomCompradorRaw, origenInfoRaw) {
                var estilo = ((origenInfoRaw || "").toString().toUpperCase().indexOf("ONCAE") !== -1) ? "contractONCAE" : "contractSEFIN";
                var nom = safeText("comprador", nomCompradorRaw);
                return `<div class="cotractName ${estilo}">
                            <div class="row">
                              <div class="col-xs-12 col-md-12">
                                <span class="small">Entidad</span>
                                <div class="clearfix"></div>
                                <span class="h4">${nom}</span>
                              </div>
                            </div>
                        </div>`;
            }

            function renderProceso(item) {
                var procCode = safeText("codigoProceso", item.codigoProceso);
                var accId = `accordion_${Math.abs(hashString(procCode || ""))}`; // ID único por proceso

                var estadoVal = (item.estadoProceso ? item.estadoProceso.toString() : "");
                var montoVal = safeMoney(item.valorPlaneado);
                var monedaVal = safeMaybeText(item.monedaContrato);

                var fInicio = safeDate(item.fechaIncioPublicacionProceso);
                var fRecep = safeDate(item.fechaInicioRecepcionOfertas);
                var fEstAdju = safeDate(item.fechaEstimadaAdjudicacion);

                var procesoHtml = `
                    <div class="contractNumberRP"><span>Código proceso: </span><span class="text-bold">${procCode}</span></div>
                    <div class="contractNumberRP"><span>Proceso: </span><span class="text-bold">${safeText("descripcionProceso", item.descripcionProceso)}</span></div>
                    <div class="wrap-head-process">
                      <div class="contractData">
                        <div class="row border-b">
                          <div class="col-xs-12 col-md-4">
                            <span class="txt_small">Estado del proceso</span>
                            <span class="amount_adj">${estadoVal}</span>
                          </div>
                          <div class="col-xs-6 col-md-4">
                            <span class="txt_small">Monto Estimado</span>
                            <span class="amount_adj">${montoVal}</span>
                          </div>
                          <div class="col-xs-6 col-md-2">
                            <span class="txt_small">Moneda</span>
                            <span class="amount_adj">${monedaVal}</span>
                          </div>
                        </div>
                        <div class="row border-b">
                          <div class="col-xs-12 col-md-4">
                            <span class="txt_small">Fecha de Inicio</span>
                            <span class="amount_adj">${fInicio}</span>
                          </div>
                          <div class="col-xs-12 col-md-4">
                            <span class="txt_small">Fecha de Recepción</span>
                            <span class="amount_adj">${fRecep}</span>
                          </div>
                          <div class="col-xs-12 col-md-4">
                            <span class="txt_small">Fecha estimada de adjudicación</span>
                            <span class="amount_adj">${fEstAdju}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="clearfix"></div>
                `;

                return { html: procesoHtml, accordionId: accId };
            }

            function renderContrato(item, index, accordionId) {
                var codigoContr = safeMaybeText(item.codigoContrato);
                var descripcionContr = safeText("descripcionContrato", item.descripcionContrato);
                var contratista = safeText("contratista", item.contratista);
                var tipoDoc = safeText("tipoCodigoProveedor", item.tipoCodigoProveedor);
                var numDoc = safeText("codigoProveedor", item.codigoProveedor);
                var valorContr = safeMoney(item.valorContratado);
                var moneda = safeMaybeText(item.monedaContrato);
                var monedaLbl = (moneda === "USD") ? "" : (moneda ? "RD$" : "");

                var inicioC = fechaValida(item.fechaInicioContrato) ? item.fechaInicioContrato.toString().substr(0, 10) : "";
                var finC = fechaValida(item.fechaFinContrato) ? item.fechaFinContrato.toString().substr(0, 10) : "";
                var inicioE = fechaValida(item.fechaInicioEjecucionContrato) ? item.fechaInicioEjecucionContrato.toString().substr(0, 10) : "";
                var finE = fechaValida(item.fechaFinEjecucionContrato) ? item.fechaFinEjecucionContrato.toString().substr(0, 10) : "";
                var duracion = item.ofertaPeriodoDuracion ? item.ofertaPeriodoDuracion.toString() : "";
                var fechaPublic = fechaValida(item.fechaPublicacion) ? item.fechaPublicacion.toString().substr(0, 10) : "";

                var headingId = `heading_${index}_${accordionId}`;
                var collapseId = `collapse_${index}_${accordionId}`;

                return `
                    <div class="panel panel-default">
                      <div class="panel-heading" role="tab" id="${headingId}">
                        <h4 class="panel-title">
                          <a class="collapsed" role="button" data-toggle="collapse" data-parent="#${accordionId}" href="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                            ${codigoContr ? ('Código de contratación: ' + codigoContr) : 'Pendiente emisión código contratación'}
                          </a>
                        </h4>
                      </div>
                      <div id="${collapseId}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="${headingId}">
                        <div class="panel-body">
                          <div class="row border-b">
                            <div class="col-md-12"><span class="small">CONTRATO</span><span class="amount_adj">${descripcionContr}</span></div>
                          </div>
                          <div class="row border-b">
                            <div class="col-md-4">
                              <span class="small">RAZÓN SOCIAL</span>
                              <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="${safeMaybeText(item.codigoProveedor)}">
                                <span class="amount_adj"><i class="material-icons md-22">shortcut</i> ${contratista}</span>
                              </a>
                            </div>
                            <div class="col-md-4"><span class="small">TIPO DE DOCUMENTO</span><span class="amount_adj">${tipoDoc}</span></div>
                            <div class="col-md-4"><span class="small">NÚMERO DE DOCUMENTO</span><span class="amount_adj">${numDoc}</span></div>
                          </div>
                          <div class="row border-b">
                            <div class="col-xs-6 col-md-6"><span class="small">VALOR CONTRATADO</span>
                              <span class="amount_adj">${valorContr ? (monedaLbl + " " + valorContr).trim() : ""}</span>
                            </div>
                            <div class="col-xs-6 col-md-6"><span class="small">MONEDA</span><span class="amount_adj">${moneda}</span></div>
                          </div>
                          <div class="row border-b">
                            ${inicioC ? `<div class="col-xs-6 col-md-3"><span class="small">FECHA DE INICIO CONTRATO</span><span class="amount_adj">${inicioC}</span></div>` : ""}
                            ${finC ? `<div class="col-xs-6 col-md-3"><span class="small">FECHA DE FIN CONTRATO</span><span class="amount_adj">${finC}</span></div>` : ""}
                            ${inicioE ? `<div class="col-xs-6 col-md-3"><span class="small">Fecha de INICIO EJECUCIÓN</span><span class="amount_adj">${inicioE}</span></div>` : ""}
                            ${finE ? `<div class="col-xs-6 col-md-3"><span class="small">Fecha de FIN EJECUCIÓN</span><span class="amount_adj">${finE}</span></div>` : ""}
                          </div>
                          ${(duracion || fechaPublic) ? `<div class="row border-b">
                            <div class="col-xs-6 col-md-3"><span class="small">Duración</span><span class="amount_adj">${duracion ? (duracion + " Días") : ""}</span></div>
                            <div class="col-xs-6 col-md-3"><span class="small">Fecha de FIRMA CONTRATO</span><span class="amount_adj">${fechaPublic}</span></div>
                          </div>` : ""}
                        </div>
                        <div class="panel-footer" style="align:center">
                          ${codigoContr ? `<a href="../../contrato?codcontrato=${codigoContr}" class="btn btn-primary btn-participe"><i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>` : ""}
                        </div>
                      </div>
                    </div>
                `;
            }

            // ---------------- BUILD PRINCIPAL ----------------
            var info = result.data;
            var data = "";
            var inicioLuis = '<div class="contractBox">';
            var finLuis = '</div>';
            var inicio = "";
            var fila = "";
            var filaconfirma = "";
            var referencia = "";
            var entidadActual = "";
            var procesoActual = "";

            for (var i = 0; i < info.length; i++) {
                var item = info[i];
                var nomComprador = safeText("comprador", item.comprador);
                var origenInfo = safeText("origenInformacion", item.origenInformacion);
                var codigoProceso = item.codigoProceso ? item.codigoProceso.toString() : "";

                if (i > 0 && entidadActual === nomComprador && procesoActual !== codigoProceso) {
                    fila += filaconfirma + '</div>' + (referencia || "") + '</div>';
                    filaconfirma = "";
                }

                if (entidadActual !== nomComprador) {
                    if (i > 0) {
                        data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + (referencia || "") + finLuis;
                        fila = "";
                        filaconfirma = "";
                        inicio = "";
                    }
                    inicio = renderEntidad(nomComprador, item.origenInformacion);
                    entidadActual = nomComprador;
                    procesoActual = ""; // reset proceso al cambiar de entidad
                }

                if (procesoActual !== codigoProceso) {
                    var procRendered = renderProceso(item);
                    fila += procRendered.html;

                    // ID único por proceso
                    var accordionId = procRendered.accordionId;
                    filaconfirma = `<div class="related-contracts">
                                        <span class="h4">Contratos de ${origenInfo} asociados a este proceso:</span>
                                        <div class="panel-group" id="${accordionId}" role="tablist">`;

                    procesoActual = codigoProceso;

                    referencia = item.docURL ? `<div class="row text-center">
                        <div class="col-xs-12 col-md-12">
                            <a href="${item.docURL}" target="_blank" class="btn btn-outlined">
                                <i class="material-icons md-22">launch</i> <span class="txt_small">Conozca más de este proceso</span>
                            </a>
                        </div>
                    </div>` : "";

                    item.__accordionId = accordionId;
                }

                filaconfirma += renderContrato(item, i, item.__accordionId);
            }

            data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + (referencia || "") + finLuis;
            $("#srcContratos").html(data);

            // ----------- CONTROL DE ACORDEONES -----------
            $('#srcContratos .panel-collapse').collapse({ toggle: false });
            $(document).off('show.bs.collapse', '#srcContratos .panel-collapse');
            $(document).on('show.bs.collapse', '#srcContratos .panel-collapse', function () {
                var $this = $(this);
                var parentId = $this.closest('.panel-group').attr('id');
                $('#' + parentId + ' .panel-collapse').not($this).collapse('hide');
            });

            // scroll y paginación
            if (typeof scrol !== "undefined" && scrol >= 1) {
                $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
            } else if (typeof scrol !== "undefined") {
                scrol = scrol + 1;
            }

            dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
            configuraEnlaceContratista();
            deshabilita(false);
        },

        error: function (response) {
            deshabilita(false);
            alert(response.responseText);
        },
        failure: function (response) {
            deshabilita(false);
            alert(response.responseText);
        }
    });
}








$("#entidad").on("keyup", function (event) {
    if (event.keyCode == 9 || event.keyCode == 13) {
        event.preventDefault();
    } else {
        if (event.keyCode == 8) {
            if ($(this).val().length <= 1) {
                $(this).val("");

            }
        }
    }
}).autocomplete({
    source: function (request, response) {
        var filtros = {
            Comprador: request.term,
            Annio: $("#top_contratos_periodos option:selected").val()
        };
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
                } else {
                    $("#divNoEncontrado").hide();
                    response($.map(datos.contratosPerAnyo, function (item) {
                        //x alert(item);
                        return {
                            label: item.label,
                            value: item.label
                        };

                    }
                    ));

                }
            },
            error: function (response) {
                alert(response.responseText);
            },
            failure: function (response) {
                alert(response.responseText);
            }
        });
    },
    delay: 300,
    minLength: 1,
    select: function (event, ui) {
        //$(this).val(ui.item.Nombre).next().val(ui.item.Id);
        //$("#divResultados").html("");
        //return false;
    }
}).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).val("");
        $("#divNoEncontrado").hide();
    }

});

$("#top_contratos_periodos").change(function () {

    var filtros = {
        Annio: $("#top_contratos_periodos option:selected").val(),
        Moneda: $("#moneda").val(),
    };
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
                            if (existeOncae == 0) { $('#resultONCAE').empty(); existeOncae += 1; }
                            var html = '<div class="col-md-4">'
                                + '<div class="h6">' + result.consolidados[i].origenInformacion.replace("Oncae - ", "").replace("ONCAE - ", "").replace("Catalogo Electrónico","Catálogo Electrónico") + '</div>'
                            + '    <div class="h4">' + (result.consolidados[i].nroContratos * 1).formatMoney(0, '.', ',').toString() + '</div>'
                                + '    <div class="h6">Valor</div>'
                                + '    <div class="h4">' + result.consolidados[i].monedaContrato + ' ' + (result.consolidados[i].valorContratado * 1 / 1000000).formatMoney(1, '.', ',').toString() + ' Millones' + '</div>'
                                + '</div>';
                            $('#dataONCAE').append(html);
                        }

                    if (result.consolidados[i].origenInformacion.toUpperCase().includes('SEFIN')) {
                            if (existeSefin == 0) { $('#resultSEFIN').empty(); existeSefin += 1; }
                            var html = ''
                                + '<div class="h6">' + result.consolidados[i].origenInformacion.toUpperCase() + '</div>'
                            + '    <div class="h4">' + (result.consolidados[i].nroContratos).formatMoney(0, '.', ',').toString() + '</div>'
                                + '    <div class="h6">Valor</div>'
                                + '    <div class="h4">' + result.consolidados[i].monedaContrato + ' ' + (result.consolidados[i].valorContratado * 1 / 1000000).formatMoney(1, '.', ',').toString() + ' Millones' + '</div>'
                                + ''
                            $('#dataSEFIN').append(html);
                        }
                }
                scrol = 0;
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, $("#top_origen_informacion option:selected").val(), $('#entidad').val(), $('#proceso').val());

            }

        },
        error: function (response) {
            alert(response.responseText);
        },
        failure: function (response) {
            alert(response.responseText);
        }
    });
});


