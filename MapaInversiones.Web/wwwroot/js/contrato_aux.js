
        var scrol = 0;
        inicializaDatos();

        function inicializaDatos() {


            getContratos($("#contrato").val(),null,null);
            getArticulosContrato($("#contrato").val());
        }


        function configuraEnlaceContratista() {
            $(".enlace_contratista").click(function () {
                var ruc = $(this).attr('data-parameter');
                var dataValue = $(this).attr('data-parameter'),
                    dataType = $(this).attr('data-type').toLowerCase();
                document.cookie = "ruc=" + ruc + ";path=/;";
                var url = "/contratista?" + dataType + "=" + dataValue;
                window.location.href = url;

            });


        }

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }



        function cambiarTipoTexto(cadena) {
            return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
        }

        function getContratos(contrato, proceso, moneda) {

            var filtros = {
                Annio: 0,
                NumeroPagina: 1,
                RegistrosPorPagina: 1,
                NombreEntidad: null,
                NombreProceso: proceso,
                Estado: null,
                Moneda: moneda,
                NombreContratista: null,
                OrigenInformacion: null,
                CodigoContrato : contrato
            };
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "api/ServiciosContratos/Contrato",
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
                            var filasinfirma = "";
                            var inicioLuis = '<div class="contractBox">';
                            var finLuis = '</div>';
                            var inicio = "";
                            var fin = "";
                            $("#srcContratos").html("");
                            for (var i = 0; i < info.length; i++) {
                                if (i > 0 && entidad == info[i].comprador.toString() && proceso != info[i].codigoProceso.toString()) {
                                    fila += filaconfirma + '</div>' + referencia + '</div>';
                                    filaconfirma = "";

                                }
                                if (entidad != info[i].comprador.toString()) {
                                    if (i > 0) //Cambio de entidad
                                    {
                                        data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;
                                        fila = "";
                                        filaconfirma = "";
                                        filasinfirma = "";
                                        inicio = "";
                                        fin = "";
                                    }
                                    var stilo = "";
                                    if (info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")) { stilo = "contractONCAE" } else { stilo = "contractSEFIN" }
                                    inicio = '<div class="cotractName ' + stilo+'"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Entidad</span><div class="clearfix"></div>'
                                        + '                 <span class="h4">' + info[i].comprador.toString() + '</span>'
                                        + ' </div></div></div>';
                                    entidad = info[i].comprador.toString();
                                }

                                if (proceso != info[i].codigoProceso.toString()) {
                                    

                                    $('#srcProceso').html('Proceso: ' + info[i].descripcionProceso.toString());
                                    fila += '<div class="contractNumberRP"><span class="">Código proceso: </span>'
                                        + '	<span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>'

							            + '<div class="wrap-head-process">';
                                    fila += '<div class="contractData">';

                                    fila += ''
							            + '		<div class="row border-b">'
							            + '			<div class="col-xs-12 col-md-4">'
							            + '				<span class="txt_small">Estado del proceso</span>'
							            + '				<span class="amount_adj">';
                                    if (info[i].estadoProceso) { fila += info[i].estadoProceso.toString(); }
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
                                    }
                                    if (info[i].fechaInicioRecepcionOfertas) {
                                        fila += ''
                                        + '			<div class="col-xs-12 col-md-4">'
                                        + '		    <span class="txt_small">Fecha de Recepción</span>'
                                            + '         <span class="amount_adj">' + info[i].fechaInicioRecepcionOfertas.toString().substr(0, 10) + '</span>'
                                        + '			    </div>';
                                    }
                                    if (info[i].fechaEstimadaAdjudicacion) {
                                        fila += ''
                                        + '			<div class="col-xs-12 col-md-4">'
                                        + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
                                            + '         <span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span>'
                                        + '			    </div>';
                                    }

                                    fila += '	</div>'
                                    + '	</div>';

                                    fila += '</div>'
                                           + '<div class="clearfix"></div>';
                                    filaconfirma += ' <div class="related-contracts">'
                                        + '     <span class="h4">Contratos de ' + info[i].origenInformacion+' asociados a este proceso:</span>'
                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                                    proceso = info[i].codigoProceso.toString();


                                    $("#enlaceproceso").attr('href', info[i].docURL.toString())

                                }


                                filaconfirma += '<div class="panel panel-default">'
                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                    + '                <h4 class="panel-title">'
                                    + '                    <a class="" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="true" aria-controls="collapse' + i + '">';

                                if (info[i].codigoContrato) { filaconfirma += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; } else { filaconfirma += '                      Pendiente emisión código contratación  ' }

                                filaconfirma += '     </a>'
                                    + '                </h4>'
                                    + '            </div>'
                                    + '            <div id="collapse' + i + '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="true" style="">'
                                    + '                <div class="panel-body">';
                                if (info[i].descripcionContrato) {
                                    filaconfirma += '          <div class="row border-b">'
                                        + '                        <div class="col-md-12"><span class="small"> CONTRATO</span><span class="amount_adj">' + info[i].descripcionContrato.toString() + '</span></div>'
                                        + '                    </div>';
                                }
                                var moneda = '$'; //'L';
                                if (info[i].monedaContrato.toString()) {
                                    if (info[i].monedaContrato.toString() == 'USD') {
                                        moneda = '';// '$';
                                    }
                                }
                                filaconfirma +=  '        <div class="row border-b">'
                                   + '                        <div class="col-md-4">'
                                   + '                            <span class="small"> RAZÓN SOCIAL<span>'
                                    + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].codigoProveedor.toString() + '"><span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span> ' + info[i].contratista.toString() + '</span></a>'
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
                                }
                                if (info[i].fechaFinContrato && info[i].fechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                    + 'FECHA DE FIN CONTRATO'
                                    + '</span><span class="amount_adj">'
                                        + info[i].fechaFinContrato.toString().substr(0, 10)
                                    + '        </span></div>';
                                }

                                if (info[i].fechaInicioEjecucionContrato && info[i].fechaInicioEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                    + 'Fecha de INICIO EJECUCIÓN'
                                    + '</span><span class="amount_adj">'
                                        + info[i].fechaInicioEjecucionContrato.toString().substr(0, 10)
                                    + '        </span></div>';
                                }
                                if (info[i].fechaFinEjecucionContrato && info[i].fechaFinEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                    + 'Fecha de FIN EJECUCIÓN'
                                    + '</span><span class="amount_adj">'
                                        + info[i].fechaFinEjecucionContrato.toString().substr(0, 10)
                                    + '        </span></div>';
                                }

                                filaconfirma += '                    </div>';

                                if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
                                    filaconfirma += '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                                    if (info[i].ofertaPeriodoDuracion) { filaconfirma += info[i].ofertaPeriodoDuracion.toString(); }

                                    filaconfirma += '                   Días</span></div>';

                                    filaconfirma += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                                    if (info[i].fechaPublicacion !== null && info[i].fechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                        filaconfirma += info[i].fechaPublicacion.toString().substr(0, 10) + '</span></div>';
                                    }
                                    else {
                                        filaconfirma += '</span></div>';
                                    }

                                    filaconfirma += '                    </div>';

                                }

                                filaconfirma += '                </div>'
                                + '               <div class="panel-footer" style="align:center">';

                                if (info[i].codigoContrato) {
                                }
                                filaconfirma += '                 </div>'
                                + '            </div>'
                                + '        </div>';
                                //+ '  </div>';
                            }


                            data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;


                            $("#srcContratos").html(data);
                            if (scrol >= 1) {
                                $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
                            } else { scrol = scrol + 1; }

                            configuraEnlaceContratista();
                        }
                        else {
                            $("#divPagContratos").empty();
                            $("#srcContratos").html("");
                            var fila = '<div class="contractBox" >'
                                + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                                + '</div>';
                            $("#srcContratos").html(fila);
                        }
                    } else {
                        alert("Message: " + result.message);
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



function getArticulosContrato(CodigoContrato) {
    var filtros = {

        CodigoContrato: CodigoContrato

    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'api/ServiciosContratos/GetArticulosContrato',
        cache: false,
        data: filtros,
        success: function (result) {
            $("#articulos").html("");
            if (result.status == true) {
                var fila = ""
                if (result.listArticulos.length > 0) {
                    for (var i = 0; i < result.listArticulos.length; i++) {
                        fila += '<tr>                                         '
                            + '    <td>' + result.listArticulos[i].descripcionSubclase + '</td>                   '
                            + '    <td>' + result.listArticulos[i].cantidad.formatMoney(0, '.', ',').toString() + '</td> '
                            + '    <td>' + result.listArticulos[i].descripcionArticulo + '</td>                               '
                            + '    <td>$ ' + result.listArticulos[i].precioUnitario.formatMoney(0, '.', ',').toString() + '</td> '
                            + '    <td>$ ' + result.listArticulos[i].impuestoTotal.formatMoney(0, '.', ',').toString() + '</td> '
                            + '    <td>$ ' + result.listArticulos[i].descuento.formatMoney(0, '.', ',').toString() + '</td> '
                            + '    <td>$ ' + result.listArticulos[i].montoTotal.formatMoney(0, '.', ',').toString() + '</td> '
                            + '</tr>                                        ';
                    }
                }
                else {

                    fila = '<tr>                                         '
                        + '    <td colspan="3">No se encontraron articulos</td>                   '
                        + '</tr> ';
                }
                $("#articulos").html(fila);
            } else {
                alert("Message: " + result.message);
            }
        },
        error: function (response) {
            alert("Response: " + response.responseText);
        },
        failure: function (response) {
            alert("Response F: " + response.responseText);
        }
    });

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
