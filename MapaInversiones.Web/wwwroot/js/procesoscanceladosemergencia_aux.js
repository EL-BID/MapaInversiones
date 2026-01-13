var done_graficas = 0;
var cant_graficas = 3;
var cant_contratos = 3;
var scrol = 0;

/*var procesoaData = JSON.parse(document.body.getAttribute('data-proceso'))[0].codigoProceso;*/
var tipoemergencia = JSON.parse(document.body.getAttribute('data-tipoEmergencia'))[0].tipoEmergencia;
var unidadcompra = JSON.parse(document.body.getAttribute('data-unidadcompra'))[0].unidadcompra;
//alert(procesoaData);
inicializaDatos();

function inicializaDatos() {

    if (unidadcompra) {

        $("#entidadProcesoG").val(unidadcompra).data('search');
        $("#entidadProcesoG").visible = false;
        $("#grpentidad").css("display", "none");
    }

    //if (procesoaData) {
    //    getContratos(1, cant_contratos, procesoaData, $('#entidadProcesoG').val(), $('#proceso').val(), tipoemergencia);
    //}
    //else {
        getContratos(1, cant_contratos, "", $('#entidadProcesoG').val(), $('#proceso').val(), tipoemergencia);
 /*   }*/

}


function configuraEnlaceContratista() {
    $(".enlace_contratista").click(function () {
        var ruc = $(this).attr('data-parameter');
        var dataValue = $(this).attr('data-parameter'),
            dataType = $(this).attr('data-type').toLowerCase();
        document.cookie = "ruc=" + ruc + ";path=/;";
        var url = "/contratista/contratistaprofile?" + dataType + "=" + dataValue;
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
        if (!unidadcompra) { $("#entidadProcesoG").val(""); }
        $("#proceso").val("");
        deshabilita(true);
        getContratos(1, cant_contratos, "", $("#entidadProcesoG").val(), "", tipoemergencia);
    }
});

$("#btn-buscar").click(function () {
    if (!disableClick) {
        deshabilita(true);//procesoaData
        getContratos(1, cant_contratos,"" , $('#entidadProcesoG').val(), $('#proceso').val(), tipoemergencia);

    }

});


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

        getContratos(pagina_actual, cant_contratos, "", $('#entidadProcesoG').val(), $('#proceso').val(), tipoemergencia);
    });

}

function getContratos(pagina, registros, codigo, entidad, proceso, tipoemergencia) {


    var filtros = {
        NumeroPagina: pagina,
        RegistrosPorPagina: registros,
        NombreEntidad: entidad,
        NombreProceso: proceso,
        CodigoProceso: codigo,
        TipoEmergencia: tipoemergencia

    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/serviciosEmergencias/GetInformacionProcesosCanceladosEmergenciaPorFiltros",
        cache: false,
        data: filtros,
        success: function (result) {
            if (result.status == true) {
                if (result.cantidadTotalRegistros > 0) {
                    var info = result.listInformacion;
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
                    var estado = "";
                    var cuentaentrada = 0;
                    $("#srcContratos").html("");
                    for (var i = 0; i < info.length; i++) {
                        if (i > 0 && entidad == info[i].unidadCompra.toString() && proceso != info[i].codigoProceso.toString()) {
                            fila += '</div>' + referencia + '';
                            filaconfirma = "";
                            estado = "";
                            cuentaentrada = 0;

                        }
                        if (entidad != info[i].unidadCompra.toString()) {
                            if (i > 0) //Cambio de entidad
                            {
                                data += inicioLuis + inicio + fila + '</div>' + referencia + finLuis;
                                fila = "";
                                filaconfirma = "";
                                estado = "";
                                filasinfirma = "";
                                inicio = "";
                                fin = "";
                                cuentaentrada = 0;
                            }

                            inicio = '<div class="cotractName"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Entidad</span><div class="clearfix"></div>'
                                + '                 <span class="h4">' + info[i].unidadCompra.toString() + '</span>'
                                + ' </div></div></div>';
                            entidad = info[i].unidadCompra.toString();
                        }

                        //adjudicacion = info[i].UrlResumenAdjudicacion;
                        //invitados = info[i].UrlInvitados;

                        if (proceso != info[i].codigoProceso.toString()) {

                            fila += '<div class="processName">'
                                + '		<div class="row">'
                                + '			<div class="col-xs-12 col-md-12">'
                                + '				<span class="small">PROCESO</span><div class="clearfix"></div>'
                                + '				<span class="h4">' + info[i].descripcion.toString() + '</span>  </div>         </div> '
                                + '	</div>'
                                + '<div class="contractNumberRP"><span class="">Código proceso: </span>'
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
                                + '			<div class="col-xs-6 col-md-4"><span class="txt_small">Monto Estimado<span class="amount_adj">RD$ ' + (info[i].MontoEstimadoProceso * 1).formatMoney(2, '.', ',').toString() + '</span></div>'
                                + '			    <div class="col-xs-6 col-md-2">'
                                + '				   <span class="txt_small">Moneda</span>'
                                + '				   <span class="amount_adj">DOP</span>'
                                + '			    </div>'
                                + '			</div>';


                            fila += ''
                                + '		<div class="row border-b">';
                            if (info[i].fechaPublicacion) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Inicio</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaPublicacion.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }
                            if (info[i].fechaFinRecepcionOfertas) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Recepción</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaFinRecepcionOfertas.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }
                            if (info[i].fechaEstimadaAdjudicacion) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }

                            fila += '</div>'
                                + '	';


                            fila += ''
                                + '		<div class="row border-b">';
                            if (info[i].motivoCancelacion) {
                                fila += ''
                                    + '			<div class="col-lg-12">'
                                    + '		    <span class="txt_small">Motivo de cancelación</span>'
                                    + '         <p>' + info[i].motivoCancelacion + '</p>'
                                    + '			    </div>';
                            }
                            fila += '</div>'
                                + '	';


                            fila += '</div>'
                                + '<div class="clearfix"></div>';


                            proceso = info[i].codigoProceso.toString();


                            referencia = '<div class="row text-center related-contracts">'
                                + '<div class="col-xs-12 col-md-12"><a href="' + info[i].url.toString() + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                + '</div>';

                        }


                    }


                    data += inicioLuis + inicio + fila + '</div>' + referencia + finLuis;


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
    })
}