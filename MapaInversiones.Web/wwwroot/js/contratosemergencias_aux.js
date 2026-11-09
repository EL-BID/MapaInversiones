    var contratistaData = JSON.parse(document.body.getAttribute('data-contratista'));
    var ruc_contratista = null;
    var unidadcompra = JSON.parse(document.body.getAttribute('data-unidadcompra'))[0].unidadcompra;
    var tipoemergencia = JSON.parse(document.body.getAttribute('data-tipoEmergencia'))[0].tipoEmergencia;
    if (contratistaData != null && contratistaData != undefined && contratistaData.length > 0) {
        ruc_contratista = contratistaData[0].contratista_id;
    }

    var cant_contratos = 5;
    var scrol = 0;


    inicializaDatos();

    function inicializaDatos() {

        if (unidadcompra) {

                $("#entidadfiona").val(unidadcompra).data('search');
                $("#entidadfiona").visible = false;
            $("#grpentidad").css("display", "none"); 
        }

        getContratos(1, cant_contratos, "", unidadcompra, $('#proceso').val(), tipoemergencia);

    }


    var disableClick = false;
    function deshabilita(des) {
        disableClick = des;
        if (des) {
            $("#btn-buscar").prop("disabled", des);
            $('#btnLimpiar').attr("disabled", "disabled");
            $("#divPagContratos").addClass("disabledbutton");
        } else {
            $("#btn-buscar").prop("disabled", des);
            $('#btnLimpiar').removeAttr("disabled");
            $("#divPagContratos").removeClass("disabledbutton");
        }
    }

    $("#btnLimpiar").click(function () {
        if (!disableClick) {
            $("#top_contratista_periodos").val($("#top_contratista_periodos").attr("default"));
            if (!unidadcompra) { $("#entidadfiona").val(""); }
            $("#proceso").val("");
            deshabilita(true);
            getContratos(1, cant_contratos, $("#top_contratista_estados option:selected").val(), $('#entidadfiona').val(), "", tipoemergencia);
        }
    });

    $("#btn-buscar").click(function () {
        if (!disableClick) {
            deshabilita(true);
            getContratos(1, cant_contratos, $("#top_contratista_estados option:selected").val(), $('#entidadfiona').val(), $('#proceso').val(), tipoemergencia);

        }

    });

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



    function dibujaPaginacionContrato(actual, total, totalPag, cant_por_pag) {
        var pag_actual = parseInt(actual);
        pagina_actual = pag_actual;
        var pagesHTML = '';
        var cant_por_linea = 10;
        deshabilita(false);
        $("#divPagContratos").empty();

        var divPag = d3.select("#divPagContratos")

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
                .attr("class", "pull-left")
                .attr("data-page", inicio - cant_por_linea)
            pag_enlace.append("span")
                .attr("class", "glyphicon glyphicon-arrow-left")
            pag_enlace.append("text")
                .text(" Anteriores")
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
            if (fin < totalPag) {
                var pag_enlace_der = divPag.append("a")
                    .attr("id", "page_right")
                    .attr("role", "button")
                    .attr("class", "")
                    .attr("data-page", fin + 1)
                    .text("Siguientes ")
                pag_enlace_der.append("span")
                    .attr("class", "glyphicon glyphicon-arrow-right")

            }
        }

        $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {

            deshabilita(true);
            //$('#divPagContratos').attr('disabled', 'disabled');
            d3.select("#divProyectos").empty();
            pagina_actual = $(this).attr("data-page");

            getContratos(pagina_actual, cant_por_pag, $("#top_contratista_estados option:selected").val(), $('#entidadfiona').val(), $('#proceso').val(), tipoemergencia);
        });

    }

    function getContratos(pagina, registros, estado, entidad, proceso, tipoemergencia) {


        var filtros = {
            //Annio: annio,
            NumeroPagina: pagina,
            RegistrosPorPagina: registros,
            NombreEntidad: entidad,
            NombreProceso: proceso,
            Estado: estado,
            TipoEmergencia: tipoemergencia

        };
        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/serviciosEmergencias/GetInformacionContratosEmergenciaPorFiltros/",
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
                        var inicioLuis = '<div class="contractBox ges-contract">';
                        var finLuis = '</div>';
                        var inicio = "";
                        var fin = "";
                        var estado = "";
                        var cuentaentrada = 0;
                        $("#srcContratos").html("");
                        for (var i = 0; i < info.length; i++) {

                            if (proceso != info[i].codigoProceso.toString()) {
                                if (i > 0) //Cambio de entidad
                                {
                                    data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;
                                    fila = "";
                                    filaconfirma = "";
                                    estado = "";
                                    filasinfirma = "";
                                    inicio = "";
                                    fin = "";
                                    cuentaentrada = 0;
                                }

                                entidad = info[i].unidadCompra.toString();
                            }



                            if (proceso != info[i].codigoProceso.toString()) {

                                fila += '<div class="contractNumberRP"><div class="wrap-numberC"><span class="">Código proceso: </span>'
                                    + '	<span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div></div>'
                                    + '<div class="processName">'
                                    + '		<div class="row">'
                                    + '			<div class="col-xs-12 col-md-12">';
                                if (info[i].descripcionProceso) {
                                    fila += '				<span class="small">PROCESO</span><div class="clearfix"></div>'
                                         + '				<span class="h3">' + info[i].descripcionProceso.toString() + '</span>';

                                }

                                fila +='         </div >'
                                    + '      </div > '
                                    + '	</div>'
                                    + '<div class="wrap-head-process">';

                                fila += '<div class="contractData">';

                                fila += ''
                                    + '		<div class="row border-b">'
                                    + '			<div class="col-xs-12 col-md-3">'
                                    + '				<span class="txt_small">Unidad de Compra</span>'
                                    + '				<span class="amount_adj">';
                                if (info[i].unidadCompra) { fila += info[i].unidadCompra.toString(); }
                                fila += '</span></div>'
                                    + '			<div class="col-xs-12 col-md-3">'
                                    + '				<span class="txt_small">Estado del proceso</span>'
                                    + '				<span class="amount_adj">';
                                if (info[i].estadoProceso) { fila += info[i].estadoProceso.toString(); }
                                fila += '</span></div>'
                                    + '			<div class="col-xs-6 col-md-3"><span class="txt_small">Monto Estimado<span class="amount_adj">$ ' + (info[i].MontoEstimadoProceso * 1).formatMoney(2, '.', ',').toString() + '</span></div>'
                                    + '			    <div class="col-xs-6 col-md-3">'
                                    + '				   <span class="txt_small">Moneda</span>'
                                    + '				   <span class="amount_adj">DOP</span>'
                                    + '			    </div>'
                                    + '			</div>';


                                fila += ''
                                    + '		<div class="row border-b">';
                                if (info[i].fechaIncioPublicacionProceso) {
                                    fila += ''
                                        + '			<div class="col-xs-12 col-md-3">'
                                        + '		    <span class="txt_small">Fecha de Publicación</span>'
                                        + '         <span class="amount_adj">' + info[i].fechaIncioPublicacionProceso.toString().substr(0, 10) + '</span>'
                                        + '			    </div>';
                                }
                                if (info[i].fechaInicioRecepcionOfertas) {
                                    fila += ''
                                        + '			<div class="col-xs-12 col-md-3">'
                                        + '		    <span class="txt_small">Fecha de Recepción</span>'
                                        + '         <span class="amount_adj">' + info[i].fechaInicioRecepcionOfertas.toString().substr(0, 10) + '</span>'
                                        + '			    </div>';
                                }
                                if (info[i].fechaEstimadaAdjudicacion) {
                                    fila += ''
                                        + '			<div class="col-xs-12 col-md-3">'
                                        + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
                                        + '         <span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span>'
                                        + '			    </div>';
                                }

                                fila += '	</div>'
                                    + '	</div>';

                                fila += '</div>'
                                    + '<div class="clearfix"></div>';

                                proceso = info[i].codigoProceso.toString();

                                if (info[i].docURL) {
                                    referencia = '<div class="wrap-btn p15">'
                                        + '  <a href="' + info[i].docURL.toString() + '" target="_blank" class="btn btn-primary btn-outlined">'
                                        + '     <span class="glyphicon glyphicon-new-window"></span> <span class="txt_small">Conozca mas de este proceso</span>'
                                        + ' </a>'
                                        + '</div>';
                                }

                            }
                            if (info[i].codigoContrato) {
                                if (info[i].estadoContrato && estado != info[i].estadoContrato.toString() && proceso == info[i].codigoProceso.toString()) {
                                    if (cuentaentrada > 0) {
                                        filaconfirma += '</div></div>';
                                    }

                                    filaconfirma += ' <div class="related-contracts">'
                                        + '     <span class="h4" wfd-id="830">Contratos en estado <span class="estcont" style="COLOR: #e14d20;">' + info[i].estadoContrato.toString() + '</span> asociados a este proceso:</span>'
                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';


                                    cuentaentrada = cuentaentrada + 1;
                                    estado = info[i].estadoContrato.toString();
                                }


                                filaconfirma += '<div class="panel panel-default">'
                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                    + '                <h4 class="panel-title">'
                                    + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

                                if (info[i].codigoOrigenInformacion === 2 || info[i].codigoOrigenInformacion === 1) { filaconfirma += '                        <span class="badge"><img src="../img/ic-mini-contract.svg" alt="icono contrato"> HURACAN</span>'; }
                                if (info[i].codigoOrigenInformacion === 3) { filaconfirma += '                        <span class="badge"><img src="../../../content/img/ic-mini-lluvia.svg" alt="icono contrato"> LLUVIAS</span>'; }
                                if (info[i].codigoContrato) { filaconfirma += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; } else { filaconfirma += '                      Pendiente emisión código contratación  ' }

                                filaconfirma += '     </a>'
                                    + '                </h4>'
                                    + '            </div>'
                                    + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                                    + '                <div class="panel-body">'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-md-12"><span class="small"> CONTRATO</span><span class="amount_adj">' + info[i].descripcionContrato.toString() + '</span></div>'
                                    + '                    </div>'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-md-6">'
                                    + '                            <span class="small"> RAZÓN SOCIAL</span>'
                                    + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].codigoProveedor.toString() + '"><span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span>' + info[i].contratista.toString() + '</span></a>'
                                    + '                        </div>'
                                    + '                    </div>'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipoCodigoProveedor.toString() + '</span>';
                                if (info[i].tipodocumento && (info[i].tipodocumento == "DO-RPE" || info[i].tipodocumento == "RPE")) { filaconfirma += '<span class="tipoDocumento">Registro de Proveedores del Estado</span>'; }
                                filaconfirma += '</div>'
                                    + '                        <div class="col-md-3"><span class="small"> NÚMERO DE DOCUMENTO</span><span class="amount_adj">' + info[i].codigoProveedor.toString() + '</span></div>'
                                    + '                        <div class="col-xs-8 col-md-3"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj">$ ' + (info[i].valorContratado * 1).formatMoney(2, '.', ',').toString() + ' </span></div>' //$ ' + (info[i].MontoContratadoTotalContrato * 1).formatMoney(2, '.', ',').toString() + ' 
                                    + '                        <div class="col-xs-4 col-md-3"><span class="small"> MONEDA</span><span class="amount_adj">DOP</span></div>' //DOP 
                                    + '                    </div>';

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
                                        + 'FECHA DE INICIO EJECUCIÓN'
                                        + '</span><span class="amount_adj">'
                                        + info[i].fechaInicioEjecucionContrato.toString().substr(0, 10)
                                        + '        </span></div>';
                                }
                                if (info[i].fechaFinEjecucionContrato && info[i].fechaFinEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                                    filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                        + 'FECHA DE FIN EJECUCIÓN'
                                        + '</span><span class="amount_adj">'
                                        + info[i].fechaFinEjecucionContrato.toString().substr(0, 10)
                                        + '        </span></div>';
                                }

                                filaconfirma += '                    </div>';

                                if (info[i].fechaIncioPublicacionProceso) {
                                    filaconfirma += '                    <div class="row border-b">'


                                    filaconfirma += '                  <div class="col-xs-6 col-md-3"><span class="small"> FECHA DE FIRMA CONTRATO</span><span class="amount_adj">';

                                    if (info[i].fechaIncioPublicacionProceso !== null && info[i].fechaIncioPublicacionProceso.toString().substr(0, 10) !== "1900-01-01") {
                                        filaconfirma += info[i].fechaIncioPublicacionProceso.toString().substr(0, 10) + '</span></div>';
                                    }
                                    else {
                                        filaconfirma += '</span></div>';
                                    }

                                    filaconfirma += '                    </div>';

                                }


                                filaconfirma += '                </div>'
                                    + '               <div class="panel-footer" style="align:center">';

                                if (info[i].codigoContrato) {
                                    filaconfirma += '                    <a href="../../contrato/?CodigoContrato=' + info[i].codigoContrato.toString() + '" class="btn btn-primary btn-primary btn-participe"><span class="glyphicon glyphicon-comment"></span> Más detalles del contrato </a>';
                                }
                                filaconfirma += '                 </div>'
                                    + '            </div>'
                                    + '        </div>';
                            }
                            else {


                                if (cuentaentrada > 0) {
                                    filaconfirma += '</div></div>';
                                }

                                filaconfirma += ' <div class="related-contracts">'
                                    + '     <span class="h4" wfd-id="830"></span>'
                                    + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';


                                cuentaentrada = cuentaentrada + 1;

                            }

                        }


                        data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;


                        $("#srcContratos").html(data);
                        if (scrol >= 1) {
                            $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 1500);
                        } else { scrol = scrol + 1; }

                        dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
                        configuraEnlaceContratista();
                    }
                    else {
                        $("#srcContratos").html("");
                        var fila = '<div class="contractBox" >'
                            + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                            + '</div>';

                        $("#divPagContratos").html("");
                        $("#srcContratos").html(fila);
                    }
                } else {
                    alert("Message: " + result.message);
                }
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



$("#entidadfiona").on("keyup", function (event) {
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
            NombreEntidad: request.term
            ,
            TipoEmergencia: tipoemergencia
            
        };
        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/serviciosEmergencias/GetEntidadContratosEmergenciaPorNombre",
            cache: false,
            data: filtros,
            success: function (data) {
                var datos = data;

                if (datos == null || datos.nombre.length <= 0) {
                    $("#divNoEncontradoFiona").show();
                    $("#ui-id-1").hide();
                } else {
                    $("#divNoEncontradoFiona").hide();
                    response($.map(datos.nombre, function (item) {
                        return {
                            label: item,
                            value: item
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
    minLength: 3,
    select: function (event, ui) {

    }
}).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).val("");
        $("#divNoEncontradoFiona").hide();
    }

});
