var contratos_anyo_data = undefined;
var contratos_valor_data = undefined;
var contratos_tipo_local = undefined;
var contratos_tipo_regional = undefined;
var contratos_tipo_all = undefined;

var contratistaData = JSON.parse($('#secInfoContratos').attr('data-contratista'));
var ruc_contratista = null;

if (contratistaData != null && contratistaData != undefined && contratistaData.length > 0) {
    ruc_contratista = contratistaData[0].contratista_id;
}

var done_graficas = 0;
var cant_graficas = 5;
var cant_contratos = 20;
var scrol = 0;


inicializaDatos();

function inicializaDatos() {


    getAnnio();


}


function getGraficasAll() {
    if (ruc_contratista != undefined && ruc_contratista != null && ruc_contratista != "") {
        getInfoGraficaContratosPerAnyo();
        getInfoGraficaValorContratosPerAnyo();
    }

}

function configuraEnlaceContratista() {
    //$(".enlace_contratista").click(function () {
    //    var ruc = $(this).attr('data-parameter');
    //    var dataValue = $(this).attr('data-parameter'),
    //        dataType = $(this).attr('data-type').toLowerCase();
    //    document.cookie = "ruc=" + ruc + ";path=/;";
    //    var url = "/contratista?" + dataType + "=" + dataValue;
    //    window.location.href = url;

    //});


}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getInfoGraficaContratosPerAnyo() {
    var params_usu = { "Contratista": ruc_contratista};
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
            } else {
                $("#secCantidadContrato").css("display", "none");
                $("#divContenedorContratosCantidad").css("display", "none");
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

function getInfoGraficaValorContratosPerAnyo() {
    var params_usu = { "Contratista": ruc_contratista };
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
            } else {
                $("#secValorContrato").css("display", "none");
                $("#divContenedorContratosValor").css("display", "none");
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
                } else if (d === "Click to Expand") {
                    traduc_aux = "Clic para Expandir";
                } else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
                }
                else if (d === "Click to Hide") {
                        traduc_aux = "Clic para Ocultar";
                }
                else if (d === "Shift+Click to Highlight") {
                    traduc_aux = "Mayús + clic para resaltar";
                }
                else {
                    traduc_aux = d;
                }
                return traduc_aux;
            })
            .config({
                data: objData,
                groupBy: "labelGroup",
                x: "label",
                y: "rawValue",
                shapeConfig: {
                    label: false,

                },
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"];
                    },
                    tbody: [
                        [function (d) { return d["rawValue"].formatMoney(0, '.', ',').toString()+" contratos"}]
                    ]
                },
                yConfig: {
                    title: " ",
                    scale: "pow",
                },
                xConfig: {
                    fontsize: "2px",
                    size: "2px"
                },
               // legend: false
            })
            .barPadding(0)
            .groupPadding(50)
            .colorScale(["#4DE0E3", "#3899CD"])
            .height(400)
            .render();
    }
}

function loadBarChartDinero(objData, divContenedor) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.BarChart()
            .select("#" + divContenedor)
            .translate(function (d) {
                var traduc_aux = (d.toString());
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
                } else if (d === "Click to Expand") {
                    traduc_aux = "Clic para Expandir";
                } else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
                }
                else if (d === "Click to Hide") {
                    traduc_aux = "Clic para Ocultar";
                }
                else if (d === "Shift+Click to Highlight") {
                    traduc_aux = "Mayús + clic para resaltar";
                }
                else {
                    traduc_aux = d;
                }
                return traduc_aux;
            })
            .config({
                data: objData,
                groupBy: "labelGroup",
                x: "label",
                y: "rawValue",
                shapeConfig: {
                    label: false,
                },
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"];
                    },
                    tbody: [
                        [function (d) { return "RD$ " + (d["rawValue"]).formatMoney(2, '.', ',').toString() + " " }]
                    ]
                },
                yConfig: {
                    maxSize: "100px",
                    title: [],
                    scale: "pow",
                    tickFormat: function (d) {
                        return (d.formatMoney(0, '.', ',').toString()) + " ";
                    }
                },
                xConfig: {
                    fontsize: "2px",
                    size: "2px"
                },
                // legend: false
            })
            .barPadding(0)
            .groupPadding(50)
            // .stacked(true)
            .colorScale(["#4DE0E3", "#3899CD"])
            .height(400)
            .render();
    }
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


function getAnnio() {
    //debugger;
    var params_usu = { "Contratista": ruc_contratista };
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
                }

            }

            $('#top_contratos_periodos').html(select).fadeIn();
            if (items_result.length > 0) {
                getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(), 1, cant_contratos);
                getGraficasAll();
            } else {
                $("#srcContratos").html("");
                var fila = '<div class="contractBox" >'
                    + '<div class="contractNumber"><span class="text-bold">No se encuentran resultados con los filtros solicitados</span></div>'
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
        $("#top_contratos_periodos").val(0);
        $("#top_origen_informacion").val("");
        deshabilita(true);
        getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(), 1, cant_contratos);
    }
});

$("#btn-buscar").click(function () {
    if (!disableClick) {
        deshabilita(true);
        getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(), 1, cant_contratos);
        //getGraficasAll();
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

        getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(), pagina_actual, cant_por_pag);
    });

}
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
//    }
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
//        }
//    }

//    $('#page_right,#page_left').bind('click', function () {
//        d3.select("#divProyectos").empty();
//        pagina_actual = $(this).attr("data-page");
//        getContratos($("#top_contratos_periodos option:selected").val(), ruc_contratista, $("#top_origen_informacion option:selected").val(),pagina_actual, cant_por_pag);
//    });

//}

//function getContratos(annio, ruc, origen, pagina, registros) {


//    var filtros = {
//        Annio: annio,
//        NumeroPagina: pagina,
//        RegistrosPorPagina: registros,
//        NombreEntidad: null,
//        NombreProceso: null,
//        Estado: null,
//        Moneda: null,
//        NombreContratista: null,
//        CodigoProveedor: ruc,
//        OrigenInformacion: origen

//    };
//    $.ajax({
//        type: 'GET',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        url: 'api/ServiciosContratos/Contratista/',
//        cache: false,
//        data: filtros,
//        success: function (result) {
//            if (result.status == true) {
//                if (result.cantidadTotalRegistros > 0) {
//                    var info = result.data;
//                    var proceso = "";
//                    var data = "";
//                    var fila = "";
//                    var inicioLuis = '<div class="contractBox">';
//                    var finLuis = '</div>';
//                    var inicio = "";
//                    var fin = "";
//                    var origen = "";
//                    var stilo = "";
//                    var urlProceso = "";
//                    $("#srcContratos").html("");
//                    for (var i = 0; i < info.length; i++) {
//                        if (proceso != info[i].codigoProceso.toString() || origen != info[i].origenInformacion.toString()) {

//                            if (i > 0) //Cambio de proceso
//                            {
//                                data += inicioLuis + inicio + fila + finLuis + fin;

//                                    data += '<div class="row text-center">'
//                                        + '<div class="col-xs-12 col-md-12"><a href="' + urlProceso + '" target="_blank" class="btn btn-outlined"><i class="material-icons md-22">launch</i> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
//                                        + '</div></div>' + finLuis;

//                                fila = "";
//                                inicio = "";
//                                fin = "";
//                            }
//                            if (info[i].docURL) {
//                                urlProceso = info[i].docURL;
//                            }


//                            if (info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")) { stilo = "contractONCAE" } else { stilo = "contractSEFIN" }
//                            inicio = '<div class="contractNumber"><span class="">Código proceso: </span> <span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>'
//                                + ' <div class="wrap-head-process">'
//                                + '     <div class="cotractName '+stilo+'">'
//                                + '         <div class="row">'
//                                + '             <div class="col-xs-12 col-md-12">'
//                                + '                 <span class="small"> PROCESO</span><div class="clearfix"></div>'
//                                + '                 <span class="h4">' + info[i].descripcionProceso.toString() + '</span>'
//                                + '             </div>'
//                                + '         </div>'
//                                + '     </div>';
//                            inicio += '<div class="contractData">';


//                            if (info[i].unidadCompra) {
//                                inicio += ''
//                                    + '         <div class="row border-b">'
//                                    + '             <div class="col-xs-12 col-md-12"><span class="txt_small">Descripción del proceso</span><span class="amount_adj">';
//                                inicio += info[i].unidadCompra.toString();
//                                inicio += '</span></div>'
//                                    + '         </div>';
//                            }

//                            //if (info[i].origenInformacion) {
//                            //    inicio += ''
//                            //        + '         <div class="row border-b">'
//                            //        + '             <div class="col-xs-12 col-md-12"><span class="txt_small">Fuente de Datos</span><span class="amount_adj">';
//                            //    inicio += info[i].origenInformacion.toString().toUpperCase().replace("ONCAE - CATALOGO ELECTRÓNICO", "ONCAE - CATÁLOGO ELECTRÓNICO");
//                            //    inicio += '</span></div>'
//                            //        + '         </div>';
//                            //}


//                            if (info[i].estadoProceso) {
//                                inicio += ''
//                                    + '         <div class="row border-b">'
//                                    + '             <div class="col-xs-6 col-md-4"><span class="txt_small">Estado del proceso</span><span class="amount_adj">';
//                                inicio += info[i].estadoProceso.toString();
//                                inicio += '</span></div>'
//                                    + '             <div class="col-xs-6 col-md-4"><span class="txt_small">Monto Estimado</span><span class="amount_adj">' + (info[i].valorPlaneado * 1).formatMoney(2, '.', ',').toString() + '</span></div>' //
//                                    + '             <div class="col-xs-6 col-md-4"><span class="txt_small">Moneda</span><span class="amount_adj">' + info[i].monedaContrato + '</span></div>' // L
//                                    + '         </div>';
//                            }

//                            if (info[i].fechaIncioPublicacionProceso) {
//                                inicio += ''
//                                    + '         <div class="row border-b">'
//                                    + '             <div class="col-xs-6 col-md-4"><span class="txt_small">Fecha de inicio</span><span class="amount_adj">';
//                                inicio += info[i].fechaIncioPublicacionProceso.toString().substr(0, 10);
//                                inicio += '</span></div>'
//                                    + '             <div class="col-xs-6 col-md-4"><span class="txt_small">Fecha de Recepción</span><span class="amount_adj">' + info[i].fechaInicioRecepcionOfertas.toString().substr(0, 10) + '</span></div>' //
//                                    + '             <div class="col-xs-6 col-md-4"><span class="txt_small">Fecha estimada de adjudicación</span><span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span></div>' // L
//                                    + '         </div>';
//                            }

//                            inicio += '     </div>'
//                                + ' </div>'
//                                + ' <div class="related-contracts">'
//                                + '     <span class="h4">Contratos de ' + info[i].origenInformacion.toString().toUpperCase().split(' ')[info[i].origenInformacion.toString().toUpperCase().split(' ').length-1] + ' asociados a este proceso:</span>'
//                                + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
//                            proceso = info[i].codigoProceso.toString();
//                            origen = info[i].origenInformacion.toString();

//                        }
//                        // if (info[i].CodigoContrato){
//                        fila += '<div class="panel panel-default">'
//                            + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
//                            + '                <h4 class="panel-title">'
//                            + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';
//                       // if (info[i].COVID19 === 1 || info[i].COVID19 === 2) { fila += '                        <span class="badge"><img src="../../../content/img/covid/ic_mini.png" alt="iconoCOVID"> Covid-19</span>'; }
//                        if (info[i].codigoContrato) { fila += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; } else { fila += '                      Pendiente emisión código contratación  ' }
//                        var moneda = 'RD$';//'L';
//                        if (info[i].monedaContrato.toString()) {
//                            if (info[i].monedaContrato.toString() == 'USD') {
//                                moneda = '';// '$';
//                            }
//                        }
//                        fila += '                    </a>'
//                            + '                </h4>'
//                            + '            </div>'
//                            + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
//                            + '                <div class="panel-body">'
//                            + '                    <div class="row border-b">'
//                            + '                        <div class="col-md-6">'
//                            + '                            <span class="small"> RAZON SOCIAL</span>'
//                            + '                            <span class="amount_adj">' + info[i].contratista.toString() + '</span>'
//                            + '                        </div>'
//                            + '                        <div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipoCodigoProveedor.toString() + '</span></div>'
//                            + '                        <div class="col-md-3"><span class="small"> NÚMERO DE DOCUMENTO</span><span class="amount_adj">' + info[i].codigoProveedor.toString() + '</span></div>'
//                            + '                    </div>'
//                            + '                    <div class="row border-b">'
//                            //+ '                        <div class="col-xs-8 col-md-3"><span class="small"> PRESUPUESTO</span><span class="amount_adj">' + moneda + ' ' + (info[i].valorPlaneado * 1).formatMoney(2, '.', ',').toString() + ' </span></div>'
//                            + '                        <div class="col-xs-6 col-md-4"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj">' + moneda + ' ' + (info[i].valorContratado   * 1).formatMoney(2, '.', ',').toString() + ' </span></div>'
//                            //+ '                        <div class="col-xs-8 col-md-3"><span class="small"> MONTO</span><span class="amount_adj">' + moneda + ' ' + (info[i].valorAdjudicado * 1).formatMoney(2, '.', ',').toString() + ' </span></div>'
//                            + '                        <div class="col-xs-6 col-md-4"><span class="small"> MONEDA</span><span class="amount_adj">' + info[i].monedaContrato + '</span></div>' //DOP

//                            + '                    </div>'
//                            + '                    <div class="row border-b">'
//                            + '                        <div class="col-xs-3 col-md-3"><span class="small">';
//                            if (info[i].fechaInicioContrato) { fila += ' FECHA DE INICIO CONTRATO'; }
//                            fila += '</span><span class="amount_adj">';
//                            if (info[i].fechaInicioContrato) { fila += info[i].fechaInicioContrato.toString().substr(0, 10); }

//                            fila += ' </span></div>'
//                                + '                        <div class="col-xs-3 col-md-3"><span class="small">';
//                            if (info[i].fechaFinContrato) { fila += 'FECHA DE FIN CONTRATO'; }
//                            fila += '</span><span class="amount_adj"> ';
//                            if (info[i].fechaFinContrato) { fila += info[i].fechaFinContrato.toString().substr(0, 10); }

//                            fila += ' </span></div>'
//                                + '                        <div class="col-xs-3 col-md-3"><span class="small">';
//                            if (info[i].fechaInicioEjecucionContrato) { fila += 'FECHA DE INICIO EJECUCIÓN'; }
//                                fila += '</span><span class="amount_adj"> ';
//                            if (info[i].fechaInicioEjecucionContrato) { fila += info[i].fechaInicioEjecucionContrato.toString().substr(0, 10); }

//                                fila += ' </span></div>'
//                                    + '                        <div class="col-xs-3 col-md-3"><span class="small">';
//                            if (info[i].fechaFinEjecucionContrato) { fila += 'FECHA DE FIN EJECUCIÓN'; }
//                                fila += '</span><span class="amount_adj"> ';
//                            if (info[i].fechaFinEjecucionContrato) { fila += info[i].fechaFinEjecucionContrato.toString().substr(0, 10); }

//                            fila += ' </span></div>'

//                            + '                    </div>';


//                        if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
//                            fila += '                    <div class="row border-b">'
//                                + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

//                            if (info[i].ofertaPeriodoDuracion) { fila += info[i].ofertaPeriodoDuracion.toString(); }

//                            fila += '                   Días</span></div>';

//                            fila += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

//                            if (info[i].fechaPublicacion !== null && info[i].fechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
//                                fila += info[i].fechaPublicacion.toString().substr(0, 10) + '</span></div>';
//                            }
//                            else {
//                                fila += '</span></div>';
//                            }

//                            fila += '                    </div>';

//                        }

//                        fila += '                    '
//                            + '                </div>'
//                            + '               <div class="panel-footer">';

//                        if (info[i].codigoContrato) {
//                            fila += '                    <a href="../../contrato?codcontrato=' + info[i].codigoContrato.toString() + '" class="btn btn-primary btn-participe"><i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>';
//                        }
//                        fila += '       </div>'
//                            + '            </div>'
//                            + '        </div>';
//                        //+ '  </div>';
//                    }
//                    data += inicioLuis + inicio + fila + '</div></div>';
//                    data += '<div class="row text-center">'
//                        + '<div class="col-xs-12 col-md-12"><a href="' + urlProceso + '" target="_blank" class="btn btn-outlined"><i class="material-icons md-22">launch</i> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
//                        + '</div></div>' + finLuis;



//                    $("#srcContratos").html(data);
//                    if (scrol >= 1) {
//                        $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
//                    } else { scrol = scrol + 1; }
//                    dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
//                    configuraEnlaceContratista();
//                }
//                else {
//                    $("#srcContratos").html("");
//                    var fila = '<div class="contractBox" >'
//                        + '<div class="contractNumber"><span class="text-bold">No se encuentran resultados con los filtros solicitados</span></div>'
//                        + '</div>';
//                    $("#srcContratos").html(fila);
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


//function getContratos(annio, ruc, origen, pagina, registros) {

//    var filtros = {
//        Annio: annio,
//        NumeroPagina: pagina,
//        RegistrosPorPagina: registros,
//        NombreEntidad: null,
//        NombreProceso: null,
//        Estado: null,
//        Moneda: null,
//        NombreContratista: null,
//        CodigoProveedor: ruc,
//        OrigenInformacion: origen
//    };

//    $.ajax({
//        type: 'GET',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        url: 'api/ServiciosContratos/Contratista/',
//        cache: false,
//        data: filtros,
//        success: function (result) {

//            if (result.status == true) {

//                if (result.cantidadTotalRegistros > 0) {

//                    var info = result.data;
//                    var proceso = "";
//                    var origen = "";
//                    var data = "";
//                    var fila = "";
//                    var inicio = "";
//                    var fin = "</div></div>";
//                    var urlProceso = "";
//                    var stilo = "";

//                    var inicioLuis = '<div class="contractBox">';
//                    var finLuis = '</div>';

//                    $("#srcContratos").html("");

//                    for (var i = 0; i < info.length; i++) {

//                        // NUEVO PROCESO
//                        if (proceso != info[i].codigoProceso.toString() ||
//                            origen != info[i].origenInformacion.toString()) {

//                            if (i > 0) {

//                                // ✔ Botón para el proceso anterior
//                                var botonProceso = "";
//                                if (urlProceso && urlProceso.trim() !== "") {
//                                    botonProceso =
//                                        '<div class="row text-center">' +
//                                        '<div class="col-xs-12 col-md-12">' +
//                                        '<a href="' + urlProceso + '" target="_blank" class="btn btn-outlined">' +
//                                        '<i class="material-icons md-22">launch</i>' +
//                                        '<span class="txt_small">Conozca más de este proceso</span>' +
//                                        '</a>' +
//                                        '</div></div>';
//                                }

//                                // ✔ Cierre del recuadro del proceso anterior
//                                data += inicioLuis + inicio + fila + fin + botonProceso + finLuis;

//                                fila = "";
//                                inicio = "";
//                            }

//                            // ID PARA ACCORDION
//                            var accordion_id = "accordion_" +
//                                info[i].codigoProceso.toString() + "_" +
//                                info[i].origenInformacion.toString().replace(/\s+/g, "_");

//                            proceso = info[i].codigoProceso.toString();
//                            origen = info[i].origenInformacion.toString();
//                            urlProceso = info[i].docURL ? info[i].docURL : "";

//                            stilo = origen.toUpperCase().includes("ONCAE") ?
//                                "contractONCAE" : "contractSEFIN";

//                            inicio =
//                                '<div class="contractNumber">' +
//                                '<span>Código proceso: </span>' +
//                                '<span class="text-bold">' + info[i].codigoProceso + '</span>' +
//                                '</div>' +

//                                '<div class="wrap-head-process">' +
//                                '<div class="cotractName ' + stilo + '">' +
//                                '<div class="row"><div class="col-xs-12 col-md-12">' +
//                                '<span class="small"> PROCESO</span><div class="clearfix"></div>' +
//                                '<span class="h4">' + info[i].descripcionProceso + '</span>' +
//                                '</div></div></div>' +
//                                '<div class="contractData">';

//                            inicio +=
//                                '<div class="row border-b">' +
//                                '<div class="col-xs-12 col-md-12">' +
//                                '<span class="txt_small">Descripción del proceso</span>' +
//                                '<span class="amount_adj">' + (info[i].unidadCompra || "") + '</span>' +
//                                '</div></div>';

//                            inicio +=
//                                '<div class="row border-b">' +
//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Estado del proceso</span>' +
//                                '<span class="amount_adj">' + (info[i].estadoProceso || "") + '</span>' +
//                                '</div>' +

//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Monto Estimado</span>' +
//                                '<span class="amount_adj">' +
//                                ((info[i].valorPlaneado * 1) || 0).formatMoney(2, ".", ",") +
//                                '</span>' +
//                                '</div>' +

//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Moneda</span>' +
//                                '<span class="amount_adj">' + (info[i].monedaContrato || "") + '</span>' +
//                                '</div></div>';

//                            inicio +=
//                                '<div class="row border-b">' +
//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Fecha de inicio</span>' +
//                                '<span class="amount_adj">' + ((info[i].fechaIncioPublicacionProceso || "").toString().substr(0, 10)) + '</span>' +
//                                '</div>' +

//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Fecha de Recepción</span>' +
//                                '<span class="amount_adj">' + ((info[i].fechaInicioRecepcionOfertas || "").toString().substr(0, 10)) + '</span>' +
//                                '</div>' +

//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Fecha estimada de adjudicación</span>' +
//                                '<span class="amount_adj">' + ((info[i].fechaEstimadaAdjudicacion || "").toString().substr(0, 10)) + '</span>' +
//                                '</div></div>';

//                            inicio +=
//                                '</div></div>' +
//                                '<div class="related-contracts">' +
//                                '<span class="h4">Contratos de ' +
//                                origen.toUpperCase().split(" ").pop() +
//                                ' asociados a este proceso:</span>' +
//                                '<div class="panel-group" id="' + accordion_id + '" role="tablist" aria-multiselectable="true">';
//                        }

//                        fila +=
//                            '<div class="panel panel-default">' +
//                            '<div class="panel-heading" role="tab" id="heading' + i + '">' +
//                            '<h4 class="panel-title">' +
//                            '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#' + accordion_id +
//                            '" href="#collapse' + i + '">' +
//                            (info[i].codigoContrato ? 'Código de contratación: ' + info[i].codigoContrato :
//                                'Pendiente emisión código contratación') +
//                            '</a>' +
//                            '</h4></div>' +

//                            '<div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel">' +
//                            '<div class="panel-body">' +

//                            '<div class="row border-b">' +
//                            '<div class="col-md-6"><span class="small"> RAZON SOCIAL</span>' +
//                            '<span class="amount_adj">' + info[i].contratista + '</span></div>' +
//                            '<div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span>' +
//                            '<span class="amount_adj">' + info[i].tipoCodigoProveedor + '</span></div>' +
//                            '<div class="col-md-3"><span class="small"> NÚMERO DE DOCUMENTO</span>' +
//                            '<span class="amount_adj">' + info[i].codigoProveedor + '</span></div>' +
//                            '</div>' +

//                            '<div class="row border-b">' +
//                            '<div class="col-xs-6 col-md-4"><span class="small"> VALOR CONTRATADO</span>' +
//                            '<span class="amount_adj">' +
//                            info[i].monedaContrato + ' ' +
//                            (info[i].valorContratado * 1).formatMoney(2, ".", ",") +
//                            '</span></div>' +

//                            '<div class="col-xs-6 col-md-4"><span class="small"> MONEDA</span>' +
//                            '<span class="amount_adj">' + info[i].monedaContrato + '</span></div>' +
//                            '</div>' +

//                            '</div>' +

//                            '<div class="panel-footer">';

//                        if (info[i].codigoContrato) {
//                            fila +=
//                                '<a href="../../contrato?codcontrato=' + info[i].codigoContrato +
//                                '" class="btn btn-primary btn-participe">' +
//                                '<i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>';
//                        }

//                        fila += '</div></div></div>';
//                    }

//                    // ✔ ÚLTIMO PROCESO (AGREGAR BOTÓN)
//                    var botonProceso = "";
//                    if (urlProceso && urlProceso.trim() !== "") {
//                        botonProceso =
//                            '<div class="row text-center">' +
//                            '<div class="col-xs-12 col-md-12">' +
//                            '<a href="' + urlProceso + '" target="_blank" class="btn btn-outlined">' +
//                            '<i class="material-icons md-22">launch</i>' +
//                            '<span class="txt_small">Conozca más de este proceso</span>' +
//                            '</a>' +
//                            '</div></div>';
//                    }

//                    // Cerrar último proceso
//                    data += inicioLuis + inicio + fila + fin + botonProceso + finLuis;

//                    $("#srcContratos").html(data);
//                    // scroll y paginación - sin tocar llamadas externas
//                    if (typeof scrol !== "undefined" && scrol >= 1) {
//                        $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
//                    } else if (typeof scrol !== "undefined") {
//                        scrol = scrol + 1;
//                    }

//                    dibujaPaginacionContrato(
//                        pagina, result.cantidadTotalRegistros,
//                        Math.ceil(result.cantidadTotalRegistros / registros),
//                        registros
//                    );

//                    configuraEnlaceContratista();

//                } else {
//                    $("#srcContratos").html(
//                        '<div class="contractBox"><div class="contractNumber">' +
//                        '<span class="text-bold">No se encuentran resultados con los filtros solicitados</span>' +
//                        '</div></div>');
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


//function getContratos(annio, ruc, origen, pagina, registros) {

//    var filtros = {
//        Annio: annio,
//        NumeroPagina: pagina,
//        RegistrosPorPagina: registros,
//        NombreEntidad: null,
//        NombreProceso: null,
//        Estado: null,
//        Moneda: null,
//        NombreContratista: null,
//        CodigoProveedor: ruc,
//        OrigenInformacion: origen
//    };

//    $.ajax({
//        type: 'GET',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        url: 'api/ServiciosContratos/Contratista/',
//        cache: false,
//        data: filtros,
//        success: function (result) {

//            if (result.status == true) {

//                if (result.cantidadTotalRegistros > 0) {

//                    var info = result.data;
//                    var proceso = "";
//                    var origen = "";
//                    var data = "";
//                    var fila = "";
//                    var inicio = "";
//                    var fin = "</div></div>";
//                    var urlProceso = "";
//                    var stilo = "";

//                    var inicioLuis = '<div class="contractBox">';
//                    var finLuis = '</div>';

//                    $("#srcContratos").html("");

//                    for (var i = 0; i < info.length; i++) {

//                        // NUEVO PROCESO
//                        if (proceso != info[i].codigoProceso.toString() ||
//                            origen != info[i].origenInformacion.toString()) {

//                            if (i > 0) {

//                                // ✔ Botón para el proceso anterior
//                                var botonProceso = "";
//                                if (urlProceso && urlProceso.trim() !== "") {
//                                    botonProceso =
//                                        '<div class="row text-center">' +
//                                        '<div class="col-xs-12 col-md-12">' +
//                                        '<a href="' + urlProceso + '" target="_blank" class="btn btn-outlined">' +
//                                        '<i class="material-icons md-22">launch</i>' +
//                                        '<span class="txt_small">Conozca más de este proceso</span>' +
//                                        '</a>' +
//                                        '</div></div>';
//                                }

//                                // ✔ Cierre del recuadro del proceso anterior
//                                data += inicioLuis + inicio + fila + fin + botonProceso + finLuis;

//                                fila = "";
//                                inicio = "";
//                            }

//                            // ID PARA ACCORDION
//                            var accordion_id = "accordion_" +
//                                info[i].codigoProceso.toString() + "_" +
//                                info[i].origenInformacion.toString().replace(/\s+/g, "_");

//                            proceso = info[i].codigoProceso.toString();
//                            origen = info[i].origenInformacion.toString();
//                            urlProceso = info[i].docURL ? info[i].docURL : "";

//                            stilo = origen.toUpperCase().includes("ONCAE") ?
//                                "contractONCAE" : "contractSEFIN";

//                            inicio =
//                                '<div class="contractNumber">' +
//                                '<span>Código proceso: </span>' +
//                                '<span class="text-bold">' + info[i].codigoProceso + '</span>' +
//                                '</div>' +

//                                '<div class="wrap-head-process">' +
//                                '<div class="cotractName ' + stilo + '">' +
//                                '<div class="row"><div class="col-xs-12 col-md-12">' +
//                                '<span class="small"> PROCESO</span><div class="clearfix"></div>' +
//                                '<span class="h4">' + info[i].descripcionProceso + '</span>' +
//                                '</div></div></div>' +
//                                '<div class="contractData">';

//                            inicio +=
//                                '<div class="row border-b">' +
//                                '<div class="col-xs-12 col-md-12">' +
//                                '<span class="txt_small">Descripción del proceso</span>' +
//                                '<span class="amount_adj">' + (info[i].unidadCompra || "") + '</span>' +
//                                '</div></div>';

//                            inicio +=
//                                '<div class="row border-b">' +
//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Estado del proceso</span>' +
//                                '<span class="amount_adj">' + (info[i].estadoProceso || "") + '</span>' +
//                                '</div>' +

//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Monto Estimado</span>' +
//                                '<span class="amount_adj">' +
//                                ((info[i].valorPlaneado * 1) || 0).formatMoney(2, ".", ",") +
//                                '</span>' +
//                                '</div>' +

//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Moneda</span>' +
//                                '<span class="amount_adj">' + (info[i].monedaContrato || "") + '</span>' +
//                                '</div></div>';

//                            inicio +=
//                                '<div class="row border-b">' +
//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Fecha de inicio</span>' +
//                                '<span class="amount_adj">' + ((info[i].fechaIncioPublicacionProceso || "").toString().substr(0, 10)) + '</span>' +
//                                '</div>' +

//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Fecha de Recepción</span>' +
//                                '<span class="amount_adj">' + ((info[i].fechaInicioRecepcionOfertas || "").toString().substr(0, 10)) + '</span>' +
//                                '</div>' +

//                                '<div class="col-xs-6 col-md-4">' +
//                                '<span class="txt_small">Fecha estimada de adjudicación</span>' +
//                                '<span class="amount_adj">' + ((info[i].fechaEstimadaAdjudicacion || "").toString().substr(0, 10)) + '</span>' +
//                                '</div></div>';

//                            inicio +=
//                                '</div></div>' +
//                                '<div class="related-contracts">' +
//                                '<span class="h4">Contratos de ' +
//                                origen.toUpperCase().split(" ").pop() +
//                                ' asociados a este proceso:</span>' +
//                                '<div class="panel-group" id="' + accordion_id + '" role="tablist" aria-multiselectable="true">';
//                        }

//                        fila +=
//                            '<div class="panel panel-default">' +
//                            '<div class="panel-heading" role="tab" id="heading' + i + '">' +
//                            '<h4 class="panel-title">' +
//                            '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#' + accordion_id +
//                            '" href="#collapse' + i + '">' +
//                            (info[i].codigoContrato ? 'Código de contratación: ' + info[i].codigoContrato :
//                                'Pendiente emisión código contratación') +
//                            '</a>' +
//                            '</h4></div>' +

//                            '<div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel">' +
//                            '<div class="panel-body">' +

//                            '<div class="row border-b">' +
//                            '<div class="col-md-6"><span class="small"> RAZON SOCIAL</span>' +
//                            '<span class="amount_adj">' + info[i].contratista + '</span></div>' +
//                            '<div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span>' +
//                            '<span class="amount_adj">' + info[i].tipoCodigoProveedor + '</span></div>' +
//                            '<div class="col-md-3"><span class="small"> NÚMERO DE DOCUMENTO</span>' +
//                            '<span class="amount_adj">' + info[i].codigoProveedor + '</span></div>' +
//                            '</div>' +

//                            '<div class="row border-b">' +
//                            '<div class="col-xs-6 col-md-4"><span class="small"> VALOR CONTRATADO</span>' +
//                            '<span class="amount_adj">' +
//                            info[i].monedaContrato + ' ' +
//                            (info[i].valorContratado * 1).formatMoney(2, ".", ",") +
//                            '</span></div>' +

//                            '<div class="col-xs-6 col-md-4"><span class="small"> MONEDA</span>' +
//                            '<span class="amount_adj">' + info[i].monedaContrato + '</span></div>' +
//                            '</div>' +

//                            '</div>' +

//                            '<div class="panel-footer">';

//                        if (info[i].codigoContrato) {
//                            fila +=
//                                '<a href="../../contrato?codcontrato=' + info[i].codigoContrato +
//                                '" class="btn btn-primary btn-participe">' +
//                                '<i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>';
//                        }

//                        fila += '</div></div></div>';
//                    }

//                    // ✔ ÚLTIMO PROCESO (AGREGAR BOTÓN)
//                    var botonProceso = "";
//                    if (urlProceso && urlProceso.trim() !== "") {
//                        botonProceso =
//                            '<div class="row text-center">' +
//                            '<div class="col-xs-12 col-md-12">' +
//                            '<a href="' + urlProceso + '" target="_blank" class="btn btn-outlined">' +
//                            '<i class="material-icons md-22">launch</i>' +
//                            '<span class="txt_small">Conozca más de este proceso</span>' +
//                            '</a>' +
//                            '</div></div>';
//                    }

//                    // Cerrar último proceso
//                    data += inicioLuis + inicio + fila + fin + botonProceso + finLuis;

//                    $("#srcContratos").html(data);
//                    // scroll y paginación - sin tocar llamadas externas
//                    if (typeof scrol !== "undefined" && scrol >= 1) {
//                        $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
//                    } else if (typeof scrol !== "undefined") {
//                        scrol = scrol + 1;
//                    }

//                    dibujaPaginacionContrato(
//                        pagina, result.cantidadTotalRegistros,
//                        Math.ceil(result.cantidadTotalRegistros / registros),
//                        registros
//                    );

//                    configuraEnlaceContratista();

//                } else {
//                    $("#srcContratos").html(
//                        '<div class="contractBox"><div class="contractNumber">' +
//                        '<span class="text-bold">No se encuentran resultados con los filtros solicitados</span>' +
//                        '</div></div>');
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




// ----------------------
// 🔵 HELPERS
// ----------------------
function fechita(v) {
    return (v || "").toString().substr(0, 10);
}

function buildBotonProceso(urlProceso) {
    if (!urlProceso || urlProceso.trim() === "") return "";
    return (
        '<div class="row text-center">' +
        '<div class="col-xs-12 col-md-12">' +
        '<a href="' + urlProceso + '" target="_blank" class="btn btn-outlined">' +
        '<i class="material-icons md-22">launch</i>' +
        '<span class="txt_small">Conozca más de este proceso</span>' +
        '</a>' +
        '</div></div>'
    );
}

function buildProcesoHeader(item, origenUpper, stilo) {

    var html =
        '<div class="contractNumber">' +
        '<span>Código proceso: </span>' +
        '<span class="text-bold">' + item.codigoProceso + '</span>' +
        '</div>' +

        '<div class="wrap-head-process">' +
        '<div class="cotractName ' + stilo + '">' +
        '<div class="row"><div class="col-xs-12 col-md-12">' +
        '<span class="small"> PROCESO</span><div class="clearfix"></div>' +
        '<span class="h4">' + item.descripcionProceso + '</span>' +
        '</div></div></div>' +
        '<div class="contractData">';

    html +=
        '<div class="row border-b">' +
        '<div class="col-xs-12 col-md-12">' +
        '<span class="txt_small">Descripción del proceso</span>' +
        '<span class="amount_adj">' + (item.unidadCompra || "") + '</span>' +
        '</div></div>';

    html +=
        '<div class="row border-b">' +
        '<div class="col-xs-6 col-md-4">' +
        '<span class="txt_small">Estado del proceso</span>' +
        '<span class="amount_adj">' + (item.estadoProceso || "") + '</span>' +
        '</div>' +

        '<div class="col-xs-6 col-md-4">' +
        '<span class="txt_small">Monto Estimado</span>' +
        '<span class="amount_adj">' +
        ((item.valorPlaneado * 1) || 0).formatMoney(2, ".", ",") +
        '</span>' +
        '</div>' +

        '<div class="col-xs-6 col-md-4">' +
        '<span class="txt_small">Moneda</span>' +
        '<span class="amount_adj">' + (item.monedaContrato || "") + '</span>' +
        '</div></div>';

    html +=
        '<div class="row border-b">' +
        '<div class="col-xs-6 col-md-4">' +
        '<span class="txt_small">Fecha de inicio</span>' +
        '<span class="amount_adj">' + fechita(item.fechaIncioPublicacionProceso) + '</span>' +
        '</div>' +

        '<div class="col-xs-6 col-md-4">' +
        '<span class="txt_small">Fecha de Recepción</span>' +
        '<span class="amount_adj">' + fechita(item.fechaInicioRecepcionOfertas) + '</span>' +
        '</div>' +

        '<div class="col-xs-6 col-md-4">' +
        '<span class="txt_small">Fecha estimada de adjudicación</span>' +
        '<span class="amount_adj">' + fechita(item.fechaEstimadaAdjudicacion) + '</span>' +
        '</div></div>';

    html +=
        '</div></div>' +
        '<div class="related-contracts">' +
        '<span class="h4">Contratos de ' +
        origenUpper.split(" ").pop() +
        ' asociados a este proceso:</span>';

    return html;
}

function buildContrato(item, accordionId, i) {

    return (
        '<div class="panel panel-default">' +
        '<div class="panel-heading" role="tab" id="heading' + i + '">' +
        '<h4 class="panel-title">' +
        '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#' + accordionId +
        '" href="#collapse' + i + '">' +
        (item.codigoContrato ? 'Código de contratación: ' + item.codigoContrato :
            'Pendiente emisión código contratación') +
        '</a>' +
        '</h4></div>' +

        '<div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel">' +
        '<div class="panel-body">' +

        '<div class="row border-b">' +
        '<div class="col-md-6"><span class="small"> RAZON SOCIAL</span>' +
        '<span class="amount_adj">' + item.contratista + '</span></div>' +
        '<div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span>' +
        '<span class="amount_adj">' + item.tipoCodigoProveedor + '</span></div>' +
        '<div class="col-md-3"><span class="small"> NÚMERO DE DOCUMENTO</span>' +
        '<span class="amount_adj">' + item.codigoProveedor + '</span></div>' +
        '</div>' +

        '<div class="row border-b">' +
        '<div class="col-xs-6 col-md-4"><span class="small"> VALOR CONTRATADO</span>' +
        '<span class="amount_adj">' +
        item.monedaContrato + ' ' +
        (item.valorContratado * 1).formatMoney(2, ".", ",") +
        '</span></div>' +

        '<div class="col-xs-6 col-md-4"><span class="small"> MONEDA</span>' +
        '<span class="amount_adj">' + item.monedaContrato + '</span></div>' +
        '</div>' +

        '</div>' +
        '<div class="panel-footer">' +
        (item.codigoContrato ?
            '<a href="../../contrato?codcontrato=' + item.codigoContrato +
            '" class="btn btn-primary btn-participe">' +
            '<i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>' :
            '') +
        '</div></div></div>'
    );
}

//
// ----------------------------------------------------------------------
// 🔵 FUNCIÓN PRINCIPAL (OPTIMIZADA, SIN CAMBIAR NADA)
// ----------------------------------------------------------------------
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
    };

    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'api/ServiciosContratos/Contratista/',
        cache: false,
        data: filtros,
        success: function (result) {

            if (result.status === true) {

                if (result.cantidadTotalRegistros > 0) {

                    var info = result.data;
                    var proceso = "";
                    var origenV = "";
                    var data = "";
                    var fila = "";
                    var inicio = "";
                    var fin = "</div></div>";
                    var urlProceso = "";

                    var inicioLuis = '<div class="contractBox">';
                    var finLuis = '</div>';

                    $("#srcContratos").html("");

                    // Accordion global para todos los contratos
                    var accordionId = "accordion_global";

                    for (var i = 0; i < info.length; i++) {

                        var item = info[i];

                        // NUEVO PROCESO
                        if (proceso !== item.codigoProceso.toString() ||
                            origenV !== item.origenInformacion.toString()) {

                            if (i > 0) {
                                data += inicioLuis + inicio + fila + fin + buildBotonProceso(urlProceso) + finLuis;
                                fila = "";
                                inicio = "";
                            }

                            proceso = item.codigoProceso.toString();
                            origenV = item.origenInformacion.toString();
                            urlProceso = item.docURL ? item.docURL : "";

                            var origenUpper = origenV.toUpperCase();
                            var stilo = origenUpper.includes("ONCAE") ? "contractONCAE" : "contractSEFIN";

                            inicio =
                                buildProcesoHeader(item, origenUpper, stilo) +
                                '<div class="panel-group" id="' + accordionId + '" role="tablist" aria-multiselectable="true">';
                        }

                        fila += buildContrato(item, accordionId, i);
                    }

                    // Último proceso
                    data += inicioLuis + inicio + fila + fin + buildBotonProceso(urlProceso) + finLuis;

                    // Insertamos todo el HTML
                    $("#srcContratos").html(data);

                    // Inicializamos los collapse para que Bootstrap los reconozca
                    $('#accordion_global .panel-collapse').collapse({
                        toggle: false
                    });

                    // Garantizamos que solo un panel esté abierto a la vez
                    $(document).off('show.bs.collapse', '#accordion_global .panel-collapse'); // removemos handlers previos
                    $(document).on('show.bs.collapse', '#accordion_global .panel-collapse', function () {
                        $('#accordion_global .panel-collapse').not(this).collapse('hide');
                    });

                    // scroll
                    if (typeof scrol !== "undefined" && scrol >= 1) {
                        $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
                    } else if (typeof scrol !== "undefined") {
                        scrol = scrol + 1;
                    }

                    // paginación
                    dibujaPaginacionContrato(
                        pagina, result.cantidadTotalRegistros,
                        Math.ceil(result.cantidadTotalRegistros / registros),
                        registros
                    );

                    configuraEnlaceContratista();

                } else {
                    $("#srcContratos").html(
                        '<div class="contractBox"><div class="contractNumber">' +
                        '<span class="text-bold">No se encuentran resultados con los filtros solicitados</span>' +
                        '</div></div>');
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






