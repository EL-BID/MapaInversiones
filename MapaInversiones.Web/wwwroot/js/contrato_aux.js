
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

    const DEFAULT_ENTIDAD = "Sin datos";

    function safe(v, def = "") { return (v == null ? def : v); }
    function fmtMoney(v) { return (v == null || v === "") ? "" : Number(v).formatMoney(2, ".", ","); }
    function shortDate(v) { return v && v.substr ? v.substr(0, 10) : ""; }

    $.ajax({
        type: "GET",
        url: "api/ServiciosContratos/Contrato",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        cache: false,
        data: {
            Annio: 0,
            NumeroPagina: 1,
            RegistrosPorPagina: 1,
            NombreEntidad: null,
            NombreProceso: proceso,
            Estado: null,
            Moneda: moneda,
            NombreContratista: null,
            OrigenInformacion: null,
            CodigoContrato: contrato
        },
        success: function (result) {

            if (!result.status) {
                alert("Message: " + result.message);
                return;
            }

        

            if (result.cantidadTotalRegistros === 0) {
                $("#srcContratos").html(`
                    <div class="contractBox">
                        <div class="contractNumberRP">
                            <span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span>
                        </div>
                    </div>
                `);
                return;
            } else {

                if (result.data[0].docURL) {
                    $("#mas_proceso").attr("href", result.data.docuURL);
                } else {
                    $("#mas_proceso").hide();
                }

            }

            let info = result.data;
            let data = "";
            let inicioEntidad = "";
            let bloqueProcesos = "";
            let bloqueContratos = "";
            let entidadActual = "";
            let procesoActual = "";

            $("#srcContratos").empty();

            for (let i = 0; i < info.length; i++) {

                const item = info[i];

                // Si la entidad es null → usar texto configurado
                const comprador = item.comprador == null || item.comprador.trim?.() === ""
                    ? DEFAULT_ENTIDAD
                    : item.comprador;

                const codProceso = safe(item.codigoProceso);

                // Cambio de entidad
                if (entidadActual !== comprador) {

                    if (i > 0) {
                        data += `
                            <div class="contractBox">
                                ${inicioEntidad}
                                ${bloqueProcesos}
                                ${bloqueContratos}
                            </div>
                        `;
                    }

                    entidadActual = comprador;
                    procesoActual = "";
                    bloqueProcesos = "";
                    bloqueContratos = "";

                    const estilo = safe(item.origenInformacion).toUpperCase().includes("ONCAE")
                        ? "contractONCAE"
                        : "contractSEFIN";

                    inicioEntidad = `
                        <div class="cotractName ${estilo}">
                            <div class="row">
                                <div class="col-xs-12 col-md-12">
                                    <span class="small">Entidad</span>
                                    <div class="clearfix"></div>
                                    <span class="h4">${comprador}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }

                // Cambio de proceso
                if (procesoActual !== codProceso) {

                    procesoActual = codProceso;
                    $("#srcProceso").html("Proceso: " + safe(item.descripcionProceso));

                    // Valor siempre debe existir como título, pero el dato puede estar vacío
                    const estadoTexto = safe(item.estadoProceso, "");

                    bloqueProcesos += `
                        <div class="contractNumberRP">
                            <span class="">Código proceso: </span>
                            <span class="text-bold">${codProceso}</span>
                        </div>
                        <div class="wrap-head-process">
                            <div class="contractData">

                                <div class="row border-b">
                                    <div class="col-xs-12 col-md-4">
                                        <span class="txt_small">Estado del proceso</span>
                                        <span class="amount_adj">${estadoTexto}</span>
                                    </div>

                                    <div class="col-xs-6 col-md-4">
                                        <span class="txt_small">Monto Estimado</span>
                                        <span class="amount_adj">${fmtMoney(item.valorPlaneado)}</span>
                                    </div>

                                    <div class="col-xs-6 col-md-2">
                                        <span class="txt_small">Moneda</span>
                                        <span class="amount_adj">${safe(item.monedaContrato)}</span>
                                    </div>
                                </div>

                                <div class="row border-b">
                                    ${item.fechaIncioPublicacionProceso ? `
                                        <div class="col-xs-12 col-md-4">
                                            <span class="txt_small">Fecha de Inicio</span>
                                            <span class="amount_adj">${shortDate(item.fechaIncioPublicacionProceso)}</span>
                                        </div>
                                    ` : ""}

                                    ${item.fechaInicioRecepcionOfertas ? `
                                        <div class="col-xs-12 col-md-4">
                                            <span class="txt_small">Fecha de Recepción</span>
                                            <span class="amount_adj">${shortDate(item.fechaInicioRecepcionOfertas)}</span>
                                        </div>
                                    ` : ""}

                                    ${item.fechaEstimadaAdjudicacion ? `
                                        <div class="col-xs-12 col-md-4">
                                            <span class="txt_small">Fecha estimada de adjudicación</span>
                                            <span class="amount_adj">${shortDate(item.fechaEstimadaAdjudicacion)}</span>
                                        </div>
                                    ` : ""}
                                </div>

                            </div>
                        </div>

                        <div class="related-contracts">
                            <span class="h4">Contratos de ${safe(item.origenInformacion)} asociados a este proceso:</span>
                            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                    `;
                }

                bloqueContratos += `
                    <div class="panel panel-default">
                        <div class="panel-heading" role="tab" id="heading${i}">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#accordion" href="#collapse${i}">
                                    ${item.codigoContrato
                        ? `Código de contratación: ${item.codigoContrato}`
                        : `Pendiente emisión código contratación`}
                                </a>
                            </h4>
                        </div>

                        <div id="collapse${i}" class="panel-collapse collapse in">
                            <div class="panel-body">

                                ${item.descripcionContrato ? `
                                    <div class="row border-b">
                                        <div class="col-md-12">
                                            <span class="small">CONTRATO</span>
                                            <span class="amount_adj">${item.descripcionContrato}</span>
                                        </div>
                                    </div>
                                ` : ""}

                                <div class="row border-b">
                                    <div class="col-md-4">
                                        <span class="small">RAZÓN SOCIAL</span>
                                        <a class="enlace_contratista" data-type="CONTRATISTA" 
                                           data-parameter="${safe(item.codigoProveedor)}">
                                            <span class="amount_adj">
                                                <span class="glyphicon glyphicon-share-alt"></span>
                                                ${safe(item.contratista)}
                                            </span>
                                        </a>
                                    </div>

                                    <div class="col-md-4">
                                        <span class="small">TIPO DE DOCUMENTO</span>
                                        <span class="amount_adj">${safe(item.tipoCodigoProveedor)}</span>
                                    </div>

                                    <div class="col-md-4">
                                        <span class="small">NÚMERO DE DOCUMENTO</span>
                                        <span class="amount_adj">${safe(item.codigoProveedor)}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                `;
            }

            data += `
                <div class="contractBox">
                    ${inicioEntidad}
                    ${bloqueProcesos}
                    ${bloqueContratos}
                </div>
            `;

            $("#srcContratos").html(data);
            configuraEnlaceContratista();
        },

        error: r => alert(r.responseText)
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
                            + '    <td>RD$ ' + result.listArticulos[i].precioUnitario.formatMoney(0, '.', ',').toString() + '</td> '
                            + '    <td>RD$ ' + result.listArticulos[i].impuestoTotal.formatMoney(0, '.', ',').toString() + '</td> '
                            + '    <td>RD$ ' + result.listArticulos[i].descuento.formatMoney(0, '.', ',').toString() + '</td> '
                            + '    <td>RD$ ' + result.listArticulos[i].montoTotal.formatMoney(0, '.', ',').toString() + '</td> '
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
