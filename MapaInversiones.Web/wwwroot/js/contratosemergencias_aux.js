    var contratistaData = JSON.parse(document.body.getAttribute('data-contratista'));
    var ruc_contratista = null;
    //var unidadcompra = JSON.parse(document.body.getAttribute('data-unidadcompra'))[0].unidadcompra;
    //var tipoemergencia = JSON.parse(document.body.getAttribute('data-tipoEmergencia'))[0].tipoEmergencia;

        const data = document.getElementById("data-body");
        console.log(data.dataset.unidadcompra);
        console.log(data.dataset.tipoemergencia);
        var unidadcompra = data.dataset.unidadcompra;
        var tipoemergencia = data.dataset.tipoemergencia;

    if (contratistaData != null && contratistaData != undefined && contratistaData.length > 0) {
        ruc_contratista = contratistaData[0].contratista_id;
    }
    //if (tipoemergencia === "") {
    //    tipoemergencia = null;
    //}
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
            //alert($("#entidadfiona").val())
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



    function dibujaPaginacionContrato(actual, total, totalPag, cant_por_pag) {
        var pag_actual = parseInt(actual);
        pagina_actual = pag_actual;
        var pagesHTML = '';
        //var cant_por_pag = 6;
        var cant_por_linea = 10;
        //$("#divPagContratos").prop("disabled", false); 
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

    const filtros = {
        NumeroPagina: pagina,
        RegistrosPorPagina: registros,
        NombreEntidad: entidad,
        NombreProceso: proceso,
        Estado: estado,
        TipoEmergencia: tipoemergencia
    };

    $.ajax({
        type: 'GET',
        url: "/api/serviciosEmergencias/GetInformacionContratosEmergenciaPorFiltros/",
        data: filtros,
        dataType: "json",
        cache: false,

        success: function (result) {

            if (!result.status) {
                alert("Message: " + result.message);
                deshabilita(false);
                return;
            }

            if (result.cantidadTotalRegistros == 0) {
                $("#srcContratos").html(`
                    <div class="contractBox">
                        <div class="contractNumberRP">
                            <span class="text-bold NoResultC">
                                No se encuentran resultados con los filtros solicitados
                            </span>
                        </div>
                    </div>
                `);
                $("#divPagContratos").html("");
                deshabilita(false);
                return;
            }

            const info = result.data;
            let htmlFinal = "";
            let htmlProceso = "";
            let htmlContratos = "";
            let procesoActual = "";
            let estadoActual = "";
            let contadorEstado = 0;

            const inicioLuis = '<div class="contractBox ges-contract">';
            const finLuis = '</div>';

            const htmlHeaderProceso = (item) => `
                <div class="contractNumberRP">
                    <div class="wrap-numberC">
                        <span>Código proceso: </span>
                        <span class="text-bold">${item.codigoProceso}</span>
                    </div>
                </div>

                <div class="processName">
                    <div class="row">
                        <div class="col-xs-12 col-md-12">
                            <span class="small">PROCESO</span>
                            <div class="clearfix"></div>
                            <span class="h3">${item.descripcionProceso}</span>
                        </div>
                    </div>
                </div>

                <div class="wrap-head-process">
                    <div class="contractData">
                        <div class="row border-b">
                            <div class="col-xs-12 col-md-3">
                                <span class="txt_small">Unidad de Compra</span>
                                <span class="amount_adj">${item.unidadCompra || ""}</span>
                            </div>
                            <div class="col-xs-12 col-md-3">
                                <span class="txt_small">Estado del proceso</span>
                                <span class="amount_adj">${item.estadoProceso || ""}</span>
                            </div>
                            <div class="col-xs-6 col-md-3">
                                <span class="txt_small">Monto Estimado</span>
                                <span class="amount_adj">RD$ ${(item.MontoEstimadoProceso * 1).formatMoney(2, '.', ',')}</span>
                            </div>
                            <div class="col-xs-6 col-md-3">
                                <span class="txt_small">Moneda</span>
                                <span class="amount_adj">DOP</span>
                            </div>
                        </div>

                        <div class="row border-b">
                            ${item.fechaIncioPublicacionProceso ? `
                                <div class="col-xs-12 col-md-3">
                                    <span class="txt_small">Fecha de Publicación</span>
                                    <span class="amount_adj">${item.fechaIncioPublicacionProceso.substr(0, 10)}</span>
                                </div>` : ""}

                            ${item.fechaInicioRecepcionOfertas ? `
                                <div class="col-xs-12 col-md-3">
                                    <span class="txt_small">Fecha de Recepción</span>
                                    <span class="amount_adj">${item.fechaInicioRecepcionOfertas.substr(0, 10)}</span>
                                </div>` : ""}

                            ${item.fechaEstimadaAdjudicacion ? `
                                <div class="col-xs-12 col-md-3">
                                    <span class="txt_small">Fecha estimada de adjudicación</span>
                                    <span class="amount_adj">${item.fechaEstimadaAdjudicacion.substr(0, 10)}</span>
                                </div>` : ""}
                        </div>
                    </div>
                </div>

                <div class="clearfix"></div>
            `;

            const htmlFooterProceso = (url) => `
                <div class="wrap-btn p15">
                    <a href="${url}" target="_blank" class="btn btn-primary btn-outlined">
                        <span class="glyphicon glyphicon-new-window"></span> 
                        <span class="txt_small">Conozca mas de este proceso</span>
                    </a>
                </div>
            `;

            const iniciarBloqueContratos = (estado) => `
                <div class="related-contracts">
                    <span class="h4">Contratos en estado 
                        <span class="estcont" style="color:#e14d20;">${estado}</span> 
                        asociados a este proceso:
                    </span>
                    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            `;

            const htmlDetalleContrato = (item, i) => `
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="heading${i}">
                        <h4 class="panel-title">
                            <a class="collapsed" data-toggle="collapse" data-parent="#accordion"
                               href="#collapse${i}" aria-expanded="false">
                                ${item.codigoOrigenInformacion === 1 || item.codigoOrigenInformacion === 2
                    ? `<span class="badge"><img src="../img/ic-mini-contract.svg"> FIONA</span>`
                    : item.codigoOrigenInformacion === 3
                        ? `<span class="badge"><img src="../../../content/img/ic-mini-lluvia.svg"> LLUVIAS</span>`
                        : ""
                }
                                ${item.codigoContrato
                    ? `Código de contratación: ${item.codigoContrato}`
                    : `Pendiente emisión código contratación`
                }
                            </a>
                        </h4>
                    </div>

                    <div id="collapse${i}" class="panel-collapse collapse">
                        <div class="panel-body">

                            <div class="row border-b">
                                <div class="col-md-12">
                                    <span class="small">CONTRATO</span>
                                    <span class="amount_adj">${item.descripcionContrato}</span>
                                </div>
                            </div>

                            <div class="row border-b">
                                <div class="col-md-6">
                                    <span class="small">RAZÓN SOCIAL</span>
                                    <a class="enlace_contratista" data-type="CONTRATISTA" data-parameter="${item.codigoProveedor}">
                                        <span class="amount_adj">
                                            <span class="glyphicon glyphicon-share-alt"></span>
                                            ${item.contratista}
                                        </span>
                                    </a>
                                </div>
                            </div>

                            <div class="row border-b">
                                <div class="col-md-3">
                                    <span class="small">TIPO DE DOCUMENTO</span>
                                    <span class="amount_adj">${item.tipoCodigoProveedor}</span>
                                    ${item.tipodocumento === "DO-RPE" || item.tipodocumento === "RPE"
                    ? `<span class="tipoDocumento">Registro de Proveedores del Estado</span>`
                    : ""
                }
                                </div>

                                <div class="col-md-3">
                                    <span class="small">NÚMERO DE DOCUMENTO</span>
                                    <span class="amount_adj">${item.codigoProveedor}</span>
                                </div>

                                <div class="col-xs-8 col-md-3">
                                    <span class="small">VALOR CONTRATADO</span>
                                    <span class="amount_adj">
                                        RD$ ${(item.valorContratado * 1).formatMoney(2, '.', ',')}
                                    </span>
                                </div>

                                <div class="col-xs-4 col-md-3">
                                    <span class="small">MONEDA</span>
                                    <span class="amount_adj">DOP</span>
                                </div>
                            </div>

                        </div>

                        <div class="panel-footer">
                            ${item.codigoContrato
                ? `<a href="../../contrato?codcontrato=${item.codigoContrato}" class="btn btn-primary btn-participe">
                                        <span class="glyphicon glyphicon-comment"></span> 
                                        Más detalles del contrato
                                   </a>`
                    : ""
                }
                        </div>
                    </div>
                </div>
            `;

            // ---------------------
            // 🔄 RECORRER RESULTADOS
            // ---------------------

            info.forEach((item, i) => {

                // Nuevo proceso ⇒ cerrar el anterior
                if (procesoActual !== item.codigoProceso) {

                    if (htmlProceso !== "") {
                        htmlFinal += `${inicioLuis}${htmlProceso}${htmlContratos}</div></div>${htmlFooterProceso(item.docURL)}${finLuis}`;
                    }

                    htmlProceso = htmlHeaderProceso(item);
                    htmlContratos = "";
                    procesoActual = item.codigoProceso;
                    estadoActual = "";
                    contadorEstado = 0;
                }

                // Nuevo estado dentro del mismo proceso
                if (item.codigoContrato && item.estadoContrato !== estadoActual) {
                    if (contadorEstado > 0) htmlContratos += "</div></div>";
                    htmlContratos += iniciarBloqueContratos(item.estadoContrato);
                    estadoActual = item.estadoContrato;
                    contadorEstado++;
                }

                // Detalle de contrato
                if (item.codigoContrato) {
                    htmlContratos += htmlDetalleContrato(item, i);
                }
            });

            // Cerrar último proceso
            htmlFinal += `${inicioLuis}${htmlProceso}${htmlContratos}</div></div>${htmlFooterProceso(info[info.length - 1].docURL)}${finLuis}`;

            // Render
            $("#srcContratos").html(htmlFinal);

            // Scroll + paginación
            if (scrol >= 1) {
                $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 1500);
            } else scrol++;

            dibujaPaginacionContrato(
                pagina,
                result.cantidadTotalRegistros,
                Math.ceil(result.cantidadTotalRegistros / registros),
                registros
            );

            configuraEnlaceContratista();
            deshabilita(false);
        },

        error: function (response) {
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
                        //x alert(item);
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
        //$(this).val(ui.item.Nombre).next().val(ui.item.Id);
        //$("#divResultados").html("");
        //return false;
    }
}).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).val("");
        $("#divNoEncontradoFiona").hide();
    }

});
