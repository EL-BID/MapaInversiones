var cant_contratos = 5;

inicializaDatos();
var pestaniaSeleccionada = 1;
var scrol = 0;
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
var cantXPaginaInv = 6;
var cantXPagina = 10;
var globales_gasto = [];
var globales_lineas = [];
var globales_otras_lineas = [];
var proyectos = [];
var findata = 0;
var inidata = 0;
var paginaActual = 1;
function seleccionoAnio(sel) {
    scrol = 0;
    inicializaDatos();
    GetDatosPorAnnio(sel);
}

function inicializaDatos() {
    

    var selectAnio = document.getElementById("annioEntidad");
    var anioEntidad = selectAnio.options[selectAnio.selectedIndex].text;
    configuraSelectTabContratos("analisis");
    //---------------------------------- Analisis
    GetRecursosPorFinalidad(anioEntidad);
    getDataByFuncion(anioEntidad);
    getProcesosByFuncion(anioEntidad);
    //----------------------------------
    
    getProgramasByEntidad(anioEntidad);
    getContratos(1, cant_contratos, $("#entidad").val(), $('#proceso').val());

    GetRecursosPorNivelYAnio(anioEntidad);

}

function configuraSelectTabContratos(tipo) {

    $(".enlace_tipo_contrato").removeClass("active");
    $("#analisis").addClass("active");
        if (tipo == "analisis") {
            $("#divListadoContratos").hide();
            $("#divProcesosSection").hide();
            $("#divInversionSection").hide();
            $("#divAnalisis").show();
        }
        if (tipo == "inversion") {
            $("#divListadoContratos").hide();
            $("#divProcesosSection").hide();
            $("#divAnalisis").hide();
            $("#divInversionSection").show();
        }
        if (tipo == "procesos") {
            $("#divListadoContratos").hide();
            $("#divAnalisis").hide();
            $("#divInversionSection").hide();
            $("#divProcesosSection").show();
        }
        if (tipo == "contratos") {
            $("#divAnalisis").hide();
            $("#divProcesosSection").hide();
            $("#divInversionSection").hide();
            $("#divListadoContratos").show();
        }
   
}

$('.enlace_tipo_contrato').on('click', function () {
    var tipo = this.id;
    configuraSelectTabContratos(tipo);
});

function GetDatosPorAnnio(anio) {
    var codigoEntidad = $("#codigoEntidadId").val();
    var anioEntidad = anio;
  $.ajax({
      url: "api/serviciosentidad/GetPresupuestoByAnnio/",
    type: "GET",
    data: {
      anio: anioEntidad,
      codEntidad: codigoEntidad
    },

  }).done(function (data) {

      var html = "";
      if (data.presupuestoVigenteAnnioDisplay) { 
          html += '<div class="col-lg-4 mb-3">                                                                                                                              '
          + '    <div class="card h-100 shadow border-0 card-entidad b1">                                                                                                 '
          + '        <div class="card-body">                                                                                                                           '
          + '            <div class="wrap-desc-entidad">                                                                                                               '
          + '                <div class="h5">Presupuesto Vigente</div>                                                                                                 '
          + '                <div class="h1" id="PresupuestoVigente">$ ' + ((data.presupuestoVigenteAnnioDisplay *1)/1000000).formatMoney(2, ',', '.').toString().trim() +' millones </div>   '
          + '            </div>                                                                                                                                        '
          + '        </div>                                                                                                                                            '
          + '    </div>                                                                                                                                                '
          + '</div>                                                                                                                                                   ';
      }
      if (data.presupuestoEjecutadoAnnioDisplay) { 
          html +='<div class="col-lg-4 mb-3 ">                                                                                                                               '
          + '    <div class="card h-100 shadow border-0 card-entidad b2">                                                                                                 '
          + '        <div class="card-body">                                                                                                                           '
          + '            <div class="wrap-desc-entidad">                                                                                                               '
          + '                <div class="h5">Presupuesto Ejecutado</div>                                                                                               '
          + '                <div class="h1" id="PresupuestoEjecutado">$ ' + ((data.presupuestoEjecutadoAnnioDisplay * 1) / 1000000).formatMoney(2, ',', '.').toString().trim() +' millones</div>'
          + '            </div>                                                                                                                                        '
          + '        </div>                                                                                                                                            '
          + '    </div>                                                                                                                                                '
              + '</div>                                                                                                                                                    ';
      }
      if (data.porcEjecutadoAnnioDisplay) {
          html += '<div class="col-lg-4 mb-3">                                                                                                                               '
              + '    <div class="card h-100 shadow border-0 card-entidad b3">                                                                                                 '
              + '        <div class="card-body">                                                                                                                           '
              + '            <div class="wrap-desc-entidad">                                                                                                               '
              + '                <div class="h5">% Ejecutado</div>                                                                                                         '
              + '                <div class="h1" id="PorcEjecutado">$ ' + ((data.porcEjecutadoAnnioDisplay * 1)).formatMoney(2, ',', '.').toString().trim() +' %</div>                              '
              + '            </div>                                                                                                                                        '
              + '        </div>                                                                                                                                            '
              + '    </div>                                                                                                                                                '
          '</div>                                                                                                                                                     ';
      }

      if (html != "") {
          $("#divResumen").html(html);
      } else {
          html += '<div class="col-lg-3 mb-3">                                                                                                                               '
              + '    <div class="card h-100 shadow border-0 card-entidad">                                                                                                 '
              + '        <div class="card-body">                                                                                                                           '
              + '            <div class="wrap-desc-entidad">                                                                                                               '
              + '                <div class="h5">NO se han encontrado datos para el año seleccionado</div>                                                                                                         '
              + '                <div class="h1" id="">$ 000</div>                              '
              + '            </div>                                                                                                                                        '
              + '        </div>                                                                                                                                            '
              + '    </div>                                                                                                                                                '
              + '</div>';
      }

  }).fail(function (handleError) {
    // Some function
      alert("Error al traer los datos de la Entidad");
  });

}




function monedaSimbolo(codigo) {
    var moneda = [];
    moneda["USD"] = "USD$";
    moneda["RD"] = "$";

    return moneda[codigo];
}

//////////////CONTRATOS//////////////////////////

function getContratos(pagina, registros, entidad, proceso, proyecto) {

    var filtros = {
        Annio: $("#annioEntidad option:selected").val(),
        NumeroPagina: pagina,
        RegistrosPorPagina: registros,
        NombreEntidad: entidad,
        NombreProceso: proceso,
        IdProyecto: proyecto,
        Estado: null,
        Moneda: null,
        NombreContratista: null,
        CodigoComprador: $("#codigoEntidadId").val()
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/serviciosentidad/ContratoXEntidad/",
        cache: false,
        data: filtros,
        success: function (result) {
            if (scrol >= 1) {
                $('html, body').animate({ scrollTop: $('#trazabilidad').offset().top }, 2000);
            } else { scrol = scrol + 1; }
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
                        if (i > 0 && proceso != info[i].codigoProceso.toString()) { 
                            fila += filaconfirma + '</div>' + referencia + '</div>';
                            filaconfirma = "";

                        }
                        if (entidad != info[i].documentoproveedor.toString()) {
                            if (i > 0) //Cambio de entidad
                            {
                                data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + finLuis;
                                fila = "";
                                filaconfirma = "";
                                filasinfirma = "";
                                inicio = "";
                                fin = "";
                            }
                            inicio = '<div class="cotractName contract"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Proveedor</span><div class="clearfix"></div>'
                                + '                 <span class="h4">' + info[i].proveedor.toString() + '</span>'
                                + ' </div></div></div>';
                            entidad = info[i].documentoproveedor.toString();
                        }

                        if (proceso != info[i].codigoProceso.toString()) {

                            fila += '<div class="processName">'
                                + '		<div class="row">'
                                + '			<div class="col-xs-12 col-md-6">'
                                + '				<span class="small">Tipo Documento</span><div class="clearfix"></div>'
                                + '				<span class="h4">' + info[i].tipodocproveedor.toString() + '</span>  </div>'
                                + '			<div class="col-xs-12 col-md-6">'
                                + '				<span class="small">Documento</span><div class="clearfix"></div>'
                                + '				<span class="h4">' + info[i].documentoproveedor.toString().toUpperCase() + '</span>  </div> '
                                + '      </div> '
                                + '	</div>'
                                + '<div class="contractNumberRP"><span class="">Más Información del Proveedor: </span>'
                                + '	<span class="text-bold"><a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].documentoproveedor.toString() + '"><span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span> ' + info[i].proveedor.toString() + '</span></a></span></div>' //info[i].codigoProceso.toString()
                                + '<div class="contractNumberRP"><span class="">Proceso: </span>'
                                + '	<span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>' //info[i].descripcionProceso.toString()
                                + '<div class="wrap-head-process">';
                            fila += '<div class="contractData">';



                            fila += ''
                                + '		<div class="row border-b">';
                            if (info[i].FCH_INICIO_PUBLICACION) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Inicio</span>'
                                    + '         <span class="amount_adj">' + info[i].FCH_INICIO_PUBLICACION.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }
                            if (info[i].FCH_INICIO_RECEP_OFERTAS) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Recepción</span>'
                                    + '         <span class="amount_adj">' + info[i].FCH_INICIO_RECEP_OFERTAS.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }
                            if (info[i].FCH_ESTIMADA_ADJUDICACION) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
                                    + '         <span class="amount_adj">' + info[i].FCH_ESTIMADA_ADJUDICACION.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }

                            fila += '	</div>'
                                + '	</div>';

                            fila += '</div>'
                                + '<div class="clearfix"></div>';
                            filaconfirma += ' <div class="related-contracts">'
                                + '     <span class="h4">Órdenes de pago y Contratos asociados según proceso:</span>'
                                + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                            proceso = info[i].urlproceso.toString();


                            referencia = '<div class="row text-center">'
                                + '<div class="col-xs-12 col-md-12"><a href="' + info[i].urlproceso.toString() + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                + '</div>';

                        }


                        filaconfirma += '<div class="panel panel-default">'
                            + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                            + '                <h4 class="panel-title">'
                            + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

                        if (info[i].referenciacontrato) { filaconfirma += '                        Código de contratación:  ' + info[i].referenciacontrato.toString() + ''; } else { filaconfirma += '                      Pendiente emisión código contratación  ' }

                        filaconfirma += '     </a>'
                            + '                </h4>'
                            + '            </div>'
                            + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                            + '                <div class="panel-body">';
                        if (info[i].descripcionContrato) {
                            filaconfirma += '          <div class="row border-b">'
                                + '                        <div class="col-md-12"><span class="small"> CONTRATO</span><span class="amount_adj">' + info[i].descripcionContrato.toString() + '</span></div>'
                                + '                    </div>';
                        }
                        var moneda = '';
                        if (info[i].monedaContrato) {
                            if (info[i].monedaContrato.toString() == 'USD') {
                                moneda = '$';
                            }
                        } else { moneda = '$'; }
                        filaconfirma += '        <div class="row border-b">'
                            + '                        <div class="col-md-12">'
                            + '                            <span class="small"> Objeto del Contrato </span>'
                            + '                            <span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span>' + info[i].objetodelcontrato.toString() + '</span>'
                            + '                        </div>'
                            + '                    </div>'
                            + '                    <div class="row border-b">'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> Estado </span><span class="amount_adj"> ' + info[i].estadocontrato.toString() + ' </span></div>' // ' + (info[i].valorPlaneado * 1).formatMoney(1, '.', ',').toString() + '
                            + '                    </div>'
                            + '                    <div class="row border-b">'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> Valor Contrato</span><span class="amount_adj"> ' + moneda + ' ' + (info[i].valorcontrato * 1).formatMoney(1, '.', ',').toString() + ' </span></div>'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj">RD</span></div>' //DOP //' + info[i].monedaContrato.toString() + '
                            + '                    </div>';

                        filaconfirma += '                    <div class="row border-b">';

                        if (info[i].fechaInicioContrato && info[i].fechaInicioContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">Fecha de INICIO CONTRATO</span>'
                                + '                                                                     <span class="amount_adj">'
                                + info[i].fechaInicioContrato.toString().substr(0, 10)
                                + '                                                                      </span></div>';
                        }
                        if (info[i].fechaFinContrato && info[i].fechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de FIN CONTRATO'
                                + '</span><span class="amount_adj">'
                                + info[i].fechaFinContrato.toString().substr(0, 10)
                                + '        </span></div>';
                        }

                        if (info[i].fecha_inicio_ejecucion_contrato && info[i].fecha_inicio_ejecucion_contrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de INICIO EJECUCIÓN'
                                + '</span><span class="amount_adj">'
                                + info[i].fecha_inicio_ejecucion_contrato.toString().substr(0, 10)
                                + '        </span></div>';
                        }
                        if (info[i].fecha_fin_ejecucion_contrato && info[i].fecha_fin_ejecucion_contrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de FIN EJECUCIÓN'
                                + '</span><span class="amount_adj">'
                                + info[i].fecha_fin_ejecucion_contrato.toString().substr(0, 10)
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

                    }


                    data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;


                    $("#srcContratos").html(data);
                   

                    configuraEnlaceContratista();
                    if (Math.ceil(result.cantidadTotalRegistros / registros) > 1) {
                        dibujarPagNumeradasPerContratos(pagina, Math.ceil(result.cantidadTotalRegistros / registros));
                    }
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



function dibujarPagNumeradasPerContratos(actual, totalPag) {
    var pag_actual = parseInt(actual);
    var cant_por_linea = 10;
    $("#divPagContratos").html("");
    var pag_enlace = "";
    
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
        pag_enlace += '<a id="page_left_c" role="button" class="material-icons md-24" data-page_C="' + (inicio - cant_por_linea) + '"><span class="">chevron_left</span></a>';
    }


    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            pag_enlace += '<span class="pag_actual" data-page_c="' + i + '"><text>' + i + '</text></span>';
        } else {
            pag_enlace += '<a class="page_left_c" role="button" data-page_c="' + i + '">';
            pag_enlace += '<span class="glyphicon"><text class="paginacion">' + i + '</text></span>';
            pag_enlace += '</a>';
        }

    }

    if (pag_actual < totalPag) {
        if (fin < totalPag) {
            pag_enlace += '<a id="page_right_c" role="button" class="material-icons md-24" data-page_c="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
        }
    }

    $("#divPagContratos").html(pag_enlace);

    $('#page_right_c,#page_left_c,.page_left_c,.page_right_c').bind('click', function () {
        pagina_actual = $(this).attr("data-page_c");
        getContratos(pagina_actual, cant_contratos, $("#entidad").val(), $('#proceso').val());
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

function clickbotoncontratosasoc(id) {
    $("#divOtrasLineas").empty();

    var nombreenlace = ".enlacecontratosasoc" + id;
    idproyecto = $(nombreenlace).attr("data-parameter");
    $("#spanfiltrado").html("Filtrado por BPIN " + idproyecto);
    $("#spanfiltrado").removeAttr("hidden");
    $(".enlace_tipo_contrato").removeClass("active");
    $("#contratos").addClass("active");

    $("#divInversionSection").hide();
    $("#divListadoContratos").show().delay(800);


    getContratos(1, cant_contratos, $("#entidad").val(), $('#proceso').val(), idproyecto);

}

$("#btnLimpiar").click(function () {
    if (!disableClick) {
        $("#spanfiltrado").attr("hidden", "hidden");
        $("#top_contratos_periodos").val(0);
        $("#top_origen_informacion").val("");
        $("#entidad").val("");
        $("#proceso").val("");
        deshabilita(true);
        getContratos(1, cant_contratos, $("#entidad").val(), $('#proceso').val());
    }
});

$("#btn-buscar").click(function () {
    if (!disableClick) {
        deshabilita(true);
        getContratos(1, cant_contratos, $("#entidad").val(), $('#proceso').val());
    }

});

//autocompletar en contratos
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
            proveedor: request.term,
            institucion: $("#codigoEntidadId").val()
        };
        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/ServiciosEntidad/GetProveedorByNombre/",
            cache: false,
            data: filtros,
            success: function (data) {
                var datos = data;

                if (datos == null || datos.data.length <= 0) {
                    $("#divNoEncontrado").show();
                    $("#ui-id-1").hide();
                } else {
                    $("#divNoEncontrado").hide();
                    response($.map(datos.data, function (item) {

                        return {
                            label: item.proveedor,
                            value: item.documentoproveedor
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

    }
}).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).val("");
        $("#divNoEncontrado").hide();
    }

});


/////////////////////INVERSION////////////////////

function getProgramasByEntidad(annio) {
    var codigoEntidad = $("#codigoEntidadId").val();
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/serviciosentidad/GetProgramasByEntidad",
        type: "GET",
        data: {
            annio: annio,
            codEntidad: codigoEntidad
        }
    }).done(function (data) {
        var result = data.infoProgramas;
        global_programas = result;
        pintaProgramas(result);

    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });

}

function iniProgramaXDefecto() {
    if ($('#selectProgramas').children('option').length > 0) {
        $('#selectProgramas').val($('#selectProgramas option:first').val());
        $('#selectProgramas').trigger('change');
    }

}

function pintaProgramas(data) {
    $("#divProgramas").empty();
    $("#divInversion").empty();
    if (data != null) {
        if (data.length > 0) {
            var str_cad = "";
            str_cad += '<div class="row">';
            str_cad += '<div class="col-md-12">';
            str_cad += '<div class="ProgramCards">';
            str_cad += '<div class="card h-100">';
            str_cad += '<p>Seleccione un Programa</p>';
            str_cad += '<div class="content-select">';
            str_cad += '<select id="selectProgramas">';
            for (var i = 0; i < data.length; i++) {
                str_cad += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
            }
            str_cad += '</select>';
            str_cad += '<i></i>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
            $("#divProgramas").html(str_cad);
            if ($('#selectProgramas').children('option').length > 0) {
                configuraSelectProgramas();
                iniProgramaXDefecto();
            }

        }
    }

}
function configuraSelectProgramas() {
    $('#selectProgramas').on('change', function () {
        var prog_actual = this.value;
        var filter_prog = $.grep(global_programas, function (elemento) {
            return elemento.id*1 === prog_actual*1;
        });
        if (filter_prog != null) {
            setValoresXPrograma(filter_prog);
        }

        consultaInfograficoPerPrograma(prog_actual);
    });

}
function setValoresXPrograma(data) {
    var valor_vigente = data[0].presupuesto;
    var valor_ejecutado = data[0].ejecutado;
    var valor_aprobado = data[0].aprobado;
    //--------------------------------------------------------------------

    var texto_aprobado = '<span class="">' + monedaSimbolo("RD") + ' ' + (valor_aprobado / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
    var texto_vigente = '<span class="">' + monedaSimbolo("RD") + ' ' + (valor_vigente / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
    var texto_ejecutado = '<span class="">' + monedaSimbolo("RD") + ' ' + (valor_ejecutado / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';

    var porcentaje_programa = 0;
    if (valor_vigente > 0) {
        porcentaje_programa = ((valor_ejecutado / valor_vigente) * 100).formatMoney(1, ',', '.').toString() + "%";
    }

    //-----------------------------------------------------------
    var str_programa = '<div class="row justify-content-center">';  //inicio row



    str_programa += '<div class="col-md-10">';
    str_programa += '<div class="row">';

    str_programa += '<div class="presini col-md-4">';
    str_programa += '<span class="h5">Presupuesto Vigente</span>';
    str_programa += '<div class="clearfix"></div>';
    str_programa += '<span class="h2">' + texto_vigente + '</span>';
    str_programa += '</div>';
    //----------------------------------------------------
    str_programa += '<div class="presini col-md-4">';
    str_programa += '<span class="h5">Presupuesto Ejecutado</span>';
    str_programa += '<div class="clearfix"></div>';
    str_programa += '<span class="h2">' + texto_ejecutado + '</span>';
    str_programa += '</div>';

    //----------------------------------------------------
    str_programa += '<div class="presexc col-md-3">';
    str_programa += '<span class="h5">Porcentaje de Ejecución</span>';
    str_programa += '<div class="clearfix"></div>';
    str_programa += '<span class="h2">' + porcentaje_programa + '</span>';
    str_programa += '</div>';
    //----------------------------------------------------- 
    str_programa += '</div>';
    str_programa += '</div>';

    str_programa += '</div>';  //fin row
    $("#lblValorAsignacionPrograma").html(str_programa);

}
function consultaInfograficoPerPrograma(prog_actual) {


    var codigoEntidad = $("#codigoEntidadId").val();
    var selectAnio = document.getElementById("annioEntidad");

    var anioEntidad = $("#annioEntidad option:selected").val();


    var descProceso = $("#proceso").val();
    var programaSel = prog_actual;


    GetDatosByTipo($("#annioEntidad option:selected").val(), "inversion", prog_actual)

}




function GetDatosByTipo(anyo, tipo, programa)
{
    var tipo_aux = "";
    if (tipo != null && tipo != undefined) {
        tipo_aux = tipo.toString().toUpperCase();
    }
    $("#divPagFichas").html("");
    $("#divInversion").empty();
    $("#divInversion").html(loader_proy);
    var codigoEntidad = $("#codigoEntidadId").val();
    var moneda = '$ ';
    $.ajax({
        url: "api/ServiciosEntidad/GetGastoByTipo",
        type: "GET",
        data: {
            anyo: anyo,
            codEntidad: codigoEntidad,
            tipo: tipo,
            programa : programa
        },

    }).done(function (data) {
        var resultado = data.detalleTipo;
        proyectos = resultado.proyInv;
        var otras_lineas = resultado.otrasLineas;
        var gen_tipo = resultado.genericoTipo;
        var pagina_actual = 1;
        if (resultado != null) {
            if (tipo_aux != "INVERSION" && tipo_aux != "INVERSIÓN") {
                globales_gasto = gen_tipo;
                if (gen_tipo != null) {
                    var ini_data = ((pagina_actual - 1) * cantXPagina);
                    var fin_data = (pagina_actual * cantXPagina) - 1;
                    var data_pagina = arr = jQuery.grep(globales_gasto, function (n, i) {
                        return (i >= ini_data && i <= fin_data);
                    });
                    getEstructuraInfograficoPerTipo(data_pagina, 1);

                } else {
                    $("#divInversion").html("<span class='lblErrorNoData'>Información No Disponible</span>");
                }



            } else {
                if (proyectos == null && otras_lineas == null) {
                    $("#divInversion").html("<span class='lblErrorNoData'>Información No Disponible</span>");

                } else {
                    if (proyectos != null) {
                        globales_gasto = proyectos;

                        var ini_data = ((pagina_actual - 1) * cantXPaginaInv);
                        var fin_data = (pagina_actual * cantXPaginaInv) - 1;
                        var data_pagina = arr = jQuery.grep(globales_gasto, function (n, i) {
                            return (i >= ini_data && i <= fin_data);
                        });
                        getEstructuraInfograficoNew(data_pagina, 1);

                    }
                    if (otras_lineas != null) {
                        globales_lineas = otras_lineas;
                        var ini_data_lineas = ((pagina_actual - 1) * cantXPaginaInv);
                        var fin_data_lineas = (pagina_actual * cantXPaginaInv) - 1;
                        var data_pagina_lineas = arr = jQuery.grep(globales_lineas, function (n, i) {
                            return (i >= ini_data && i <= fin_data);
                        });
                        getEstructuraInfograficoPerLineas(data_pagina_lineas, 1);
                    }

                }



            }
        } else {
            $("#divInversion").html("<span class='lblErrorNoData'>Información No Disponible</span>");
        }






    }).fail(function (handleError) {
        // Some function

    });

}


function getEstructuraInfograficoNew(datos, pagina) {
    var i_aux = 0;
    var j_aux = 0;
    var k_aux = 0;
    //var l = 0;
    var html_str = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
    for (var i = 0; i < datos.length; i++) {
        var nomCollapse = "collapseOne_" + i_aux.toString() + "_" + j_aux.toString();
        var nomHeading = "headingOne_" + i_aux.toString() + "_" + j_aux.toString();

        var nombre = datos[i]['nombre'];
        var codigo = datos[i]['id'];
        var avance_fisico = datos[i]['avance_fisico'];
        var avance_financiero = datos[i]['avance_financiero'];
        var url_proy = datos[i].url;
        var lineas_vec = datos[i].detalleLineas;
        var valor_proyecto = datos[i].comprometido;

        html_str += '<div class="panel panel-default ">';
        html_str += '<div class="panel-heading" role="tab" id="' + nomHeading + '">';
        html_str += '<div class="panel-title d-flex">';
        html_str += '<a class="w-90" role="button" data-toggle="collapse" data-parent="#accordion" href="#' + nomCollapse + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
        html_str += '<div class="head">';
        html_str += '<div class="data0 mainData">';
        html_str += '<div class="badge badge-outlined"><span class="labelTit">CÓDIGO BPIN: ' + '<strong>' + codigo + '</strong></span></div></br>';
        html_str += '<span class="td1">' + nombre + '</span>';
        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Valor Proyecto</span>';
        html_str += '<span class="td1">$ ' + (valor_proyecto*1/1000000).formatMoney(2, ',', '.').toString() + ' Millones</span>';
        html_str += '</div>';

        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Avance Financiero</span>';
        html_str += '<span class="td1">' + avance_financiero.formatMoney(2, ',', '.').toString() + '%</span>';
        html_str += '</div>';



        html_str += '<div class="actions-links">';
        html_str += '<span class="badge badge-pill badge-primary">Ver líneas presupuestales</span>';
        html_str += '</div>';



        html_str += '</div>';

        html_str += '</a>';

        html_str += '<div class="actions-links">';
        html_str += '<a target="_blank" href="' + url_proy + '" class="text - small">';
        html_str += '<span class="badge badge-pill badge-primary"> Ver Perfil del Proyecto</span>';
        html_str += '</a>';
        html_str += '</div>';

        html_str += '</div>';


        html_str += '</div>';

        html_str += '<div id = "' + nomCollapse + '" class="panel-collapse collapse nivel1" role = "tabpanel" aria - labelTitledby="' + nomHeading + '" item = "' + datos[i].nombre.toUpperCase() + '" >';
        html_str += '<div class="panel-body">';

        //NIVEL 2

        for (var j = 0; j < lineas_vec.length; j++) {
            var nomNivel2 = "accordion_l2_" + i_aux.toString() + "_" + j_aux.toString();
            var headNivel2 = "headLevel2_" + i_aux.toString() + "_" + j_aux.toString();
            var panelHijo2 = "c2_" + j_aux.toString() + "_" + k_aux.toString();
            var nomHeadLevel3 = "headLevel3_" + j_aux.toString() + "_" + k_aux.toString();
            var nombre = lineas_vec[j].nombre;
            var presup_aprobado = lineas_vec[j]['aprobado'] / 1;
            var presup_vigente = lineas_vec[j]['vigente'] / 1;
            var presup_ejecutado = lineas_vec[j]['ejecutado'] / 1;
            var porc_ejecutado = lineas_vec[j]['porcentaje'] * 100;


            html_str += '<div class="panel-group nivel22" id="' + nomNivel2 + '" role="tablist" aria-multiselectable="true">';
            html_str += '<div class="panel panel-default">';
            //heading
            html_str += '<div class="panel-heading" role="tab" id="' + headNivel2 + '">';
            html_str += '<div class="panel-title w-88">';
            html_str += '<a role = "button" data-toggle="collapse" data-parent="#' + nomNivel2 + '" href = "#' + panelHijo2 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';

            html_str += '<div class="head">';
            html_str += '<div class="data1 mainData">';
            html_str += '<span class="labelTit">Objeto de gasto</span>';
            html_str += '<span class="td1p">' + nombre + '</span>';
            html_str += '</div>';

            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Presupuesto Aprobado</span>';
            html_str += '<span class="td1p">' + '$' + ' ' + presup_aprobado.formatMoney(1, ',', '.').toString() + ' Millones</span>';
            html_str += '</div>';

            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Presupuesto Vigente</span>';
            html_str += '<span class="td1p">' + '$' + ' ' + presup_vigente.formatMoney(0, ',', '.').toString() + ' Millones</span>';
            html_str += '</div>';

            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Ejecución Acumulada</span>';
            html_str += '<span class="td1p">' + '$' + ' ' + presup_ejecutado.formatMoney(0, ',', '.').toString() + ' Millones</span>';
            html_str += '</div>';


            html_str += '<div class="data1a">';
            html_str += '<span class="labelTit">% Ejecución</span>';
            html_str += '<span class="">' + porc_ejecutado.formatMoney(1, ',', '.').toString() + '%</span>';
            html_str += '</div>';

            html_str += '</div>';//head
            html_str += '</a>';

            html_str += '</div>';
            html_str += '</div>';
            //body
            html_str += '</div>';

            html_str += '</div>';
            j_aux = j_aux + 1;

        }

        ///----------------------------------BOTONES
        html_str += '<div class="row align-items-center">';
        html_str += '</div>';
        html_str += '</div>';

        html_str += '<div class="col-md-12 text-center">';
        html_str += '<div class="actions-links">';
        html_str += '<a class="enlacecontratosasoc' + i + '" onclick="clickbotoncontratosasoc(' + i + ')" data-parameter="' + codigo + '" class="text - small">';
        html_str += '<span class="badge badge-pill badge-primary"> Ver Contratos Asociados</span >';
        html_str += '</a>';
        html_str += '</div>';
        html_str += '</div>';
        html_str += '</div>';  ///fin row
        ///---------------------------------------FIN BOTONES


        html_str += '</div>';
        html_str += '</div>';

        html_str += '</div>';

        i_aux = i_aux + 1;

    }
    html_str += "</div>";


    ///----------------
    html_str += '<div id="divPagFichas"></div>';

    $("#divInversion").html(html_str);
    var totalNumber = globales_gasto.length;
    var totalPages = (totalNumber > cantXPaginaInv) ? ((totalNumber - (totalNumber % cantXPaginaInv)) / cantXPaginaInv) : 1;
    if ((totalNumber >= cantXPaginaInv) && ((totalNumber % cantXPaginaInv) > 0)) {
        totalPages = totalPages + 1;
    }
    if (totalPages > 1) {
        dibujarPagNumeradasPerTipoInv(pagina, totalNumber, totalPages);
    }


}

function dibujarPagNumeradasPerTipoInv(actual, total, totalPag) {
    var pag_actual = parseInt(actual);
    var pagina_actual = pag_actual;
    var pagesHTML = '';
    var cant_por_linea = 10;
    $("#divPagFichas").html("");
    var divPag = $("#divPagFichas")
    var pag_enlace = "";

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
        pag_enlace += '<a id="page_left" role="button" class="material-icons md-24" data-page="' + (inicio - cant_por_linea) + '"><span class="">chevron_left</span></a>';
    }


    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            pag_enlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
        } else {
            pag_enlace += '<a class="page_left" role="button" data-page="' + i + '">';
            pag_enlace += '<span class="glyphicon"><text class="paginacion">' + i + '</text></span>';
            pag_enlace += '</a>';
        }

    }

    if (pag_actual < totalPag) {
        if (fin < totalPag) {
            pag_enlace += '<a id="page_right" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
        }
    }

    $("#divPagFichas").html(pag_enlace);

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
        pagina_actual = $(this).attr("data-page");
        var ini_data = ((pagina_actual - 1) * cantXPaginaInv);
        var fin_data = (pagina_actual * cantXPaginaInv) - 1;
        var data_pagina = arr = jQuery.grep(globales_gasto, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        $("#divInversion").empty();
        getEstructuraInfograficoNew(data_pagina, pagina_actual);
    });

}


function getEstructuraInfograficoPerLineas(datos_lineas, pagina) {
    if (datos_lineas.length > 0) {
        var str_lineas = '<div class="card-entidades-group">';
        str_lineas += '<div class="wrap-lineas">';
        str_lineas += '<div class="col-lg-12 text-center py-2">';
        str_lineas += '<div class="h6 lineasbk">Otras líneas presupuestales';
        str_lineas += '</div>';
        str_lineas += '</div>';
        ///------------------------
        str_lineas += '<div class="row">';
        ///----------lineas
        ///----------lineas
        for (var j = 0; j < datos_lineas.length; j++) {
            var nombre = datos_lineas[j]['nombre'];
            var presup_aprobado = datos_lineas[j]['aprobado'] / 1;
            var presup_vigente = datos_lineas[j]['vigente'] / 1;
            var presup_ejecutado = datos_lineas[j]['ejecutado'] / 1;
            var porc_ejecutado = datos_lineas[j]['porcentaje'] * 100;


            str_lineas += '<div class="line0">';
            str_lineas += '<div class="card-entidades-obj">';
            str_lineas += '<div class="card d-flex">';
            str_lineas += '<div class="headEnt">';
            str_lineas += '<div class="data1 mainDataEntidad">';
            str_lineas += '<span class="labelTit">Objeto de Gasto</span>';
            str_lineas += '<span class="td1obj">' + nombre + '</span>';
            str_lineas += '</div>';
            str_lineas += '<div class="data1">';
            str_lineas += '<span class="labelTit">Presupuesto Aprobado</span>';
            str_lineas += '<span class="td1">$ ' + presup_aprobado.formatMoney(2, '.', ', ').toString() + ' Millones</span>';
            str_lineas += '</div>';
            str_lineas += '<div class="data1">';
            str_lineas += '<span class="labelTit">Presupuesto Vigente</span>';
            str_lineas += '<span class="td1">$ ' + presup_vigente.formatMoney(2, '.', ', ').toString() + ' Millones</span>';
            str_lineas += '</div>';
            str_lineas += '<div class="data1">';
            str_lineas += '<span class="labelTit">Ejecución Acumulada</span>';
            str_lineas += '<span class="td1">$ ' + presup_ejecutado.formatMoney(2, '.', ', ').toString() + ' Millones</span>';
            str_lineas += '</div>';
            str_lineas += '<div class="data1">';
            str_lineas += '<span class="labelTit">Porcentaje de ejecución</span>';
            str_lineas += '<span class="td1">' + porc_ejecutado.toFixed(2).toString() + '%</span>';
            str_lineas += '</div>';
            str_lineas += '</div>';
            str_lineas += '</div>';
            str_lineas += '</div>';
            str_lineas += '</div>';


        }
        str_lineas += '</div>';  ///FIN ROW
        str_lineas += '</div>';  ///FIN wrap-lineas
        str_lineas += '</div>';   ///fin card-entidades-group

        str_lineas += '<div id="divPagFichasLineas"></div>';
        $("#divOtrasLineas").html(str_lineas);
        //paginacion otras lineas
        var totalNumber = globales_lineas.length;
        var totalPages = (totalNumber > cantXPaginaInv) ? ((totalNumber - (totalNumber % cantXPaginaInv)) / cantXPaginaInv) : 1;
        if ((totalNumber >= cantXPaginaInv) && ((totalNumber % cantXPaginaInv) > 0)) {
            totalPages = totalPages + 1;
        }
        if (totalPages > 1) {
            dibujarPagNumeradasPerLineas(pagina, totalNumber, totalPages);
        }

    }

}

function dibujarPagNumeradasPerLineas(actual, total, totalPag) {
    var pag_actual = parseInt(actual);
    var pagina_actual = pag_actual;
    var pagesHTML = '';
    var cant_por_linea = 10;
    $("#divPagFichasLineas").html("");
    var divPag = $("#divPagFichasLineas")
    var pag_enlace = "";

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
        pag_enlace += '<a id="page_left_lineas" role="button" class="material-icons md-24" data-page="' + (inicio - cant_por_linea) + '"><span class="">chevron_left</span></a>';
    }


    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            pag_enlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
        } else {
            pag_enlace += '<a class="page_left_lineas" role="button" data-page="' + i + '">';
            pag_enlace += '<span class="glyphicon"><text class="paginacion">' + i + '</text></span>';
            pag_enlace += '</a>';
        }

    }

    if (pag_actual < totalPag) {
        if (fin < totalPag) {
            pag_enlace += '<a id="page_right_lineas" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
        }
    }

    $("#divPagFichasLineas").html(pag_enlace);

    $('#page_right_lineas,#page_left_lineas,.page_left_lineas,.page_right_lineas').bind('click', function () {
        pagina_actual = $(this).attr("data-page");
        var ini_data = ((pagina_actual - 1) * cantXPaginaInv);
        var fin_data = (pagina_actual * cantXPaginaInv) - 1;
        var data_pagina = arr = jQuery.grep(globales_lineas, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        $("#divOtrasLineas").empty();
        getEstructuraInfograficoPerLineas(data_pagina, pagina_actual);
    });

}



//////////////////////// ANALISIS /////////////////////////////////////



function GetRecursosPorFinalidad(anyo) {
    $("#divGraphPerFuncion").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/serviciosentidad/GetRecursosPorFinalidad",
        type: "GET",
        data: {
            anyo: anyo,
            codEntidad: $("#codigoEntidadId").val()
        }
    }).done(function (data) {
        if (data.infoRecursos != null) {
            globales = data.infoRecursos;
            loadRecursosPerFinalidad(globales);
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });




}

function assignColorPaleta(indice) {
    var color_aux = "#CCCCCC";
    var col_sel = color_aux;
    var colores_default = ["#639CBF", "#78B8BF", "#A65D5D", "#4C5959", "#56B4D6", "#56D6B2", "#4FBCE3", "#9BDDCA", "#41A387", "#5A6A70", "#3185A3",
        "#387CA6", "#96D2D9", "#F2E8C9", "#728EA6", "#BACDD9", "#F2E4DC", "#B0C1D9", "#88A5BF", "#D9BFA9", "#F29863", "#F2C1AE", "#BF9C99"];
    if (indice < colores_default.length) {
        col_sel = colores_default[indice];
    }
    return col_sel;
}
function loadRecursosPerFinalidad(objData) {
    $("#divGraphPerFuncion").empty();
    var titulo = "Otros";
    var textoExpandir = "Clic para expandir";
    var limitePorc = 0.03;
    var data_filter = [];
    if (objData != undefined && objData != null) {
        data_filter = objData;

        var sumaTotal = data_filter.reduce(function (acumulador, elemento) {
            return acumulador + elemento.rawValueDouble;
        }, 0);
        for (var i = 0; i < data_filter.length; i++) {
            data_filter[i].labelGroup = data_filter[i].labelGroup.replace(",", " ");
            data_filter[i].label = data_filter[i].label.replace(",", " ");

            data_filter[i].rawValueDouble = parseFloat(data_filter[i].rawValueDouble);
            data_filter[i].porcentaje = (((data_filter[i].rawValueDouble / sumaTotal) * 100)).toFixed(2);
        }

     
        var distintos = objData.map(item => item.labelGroup)
            .filter((value, index, self) => self.indexOf(value) === index);

        grafica = new d3plus.Treemap()
            .select("#divGraphPerFuncion")

            .shapeConfig({
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
                },
                 fill: function (d, index) {
                    return assignColorPaleta(index);

                }
            })
            .translate(function (d) {
                var traduc_aux = d;
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
                } else if (d === "Click to Expand") {
                    traduc_aux = "Clic para expandir";
                } else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
                } else {
                    traduc_aux = d;
                }
                return traduc_aux;
            })
            .config({
                //threshold: limitePorc,
                data: data_filter,
                groupBy: ["labelGroup", "label"],
                height: 500,
                tooltipConfig: {
                    title: function (d) {
                        var depth_aux = grafica.depth();
                        var longitud_tooltip = 80;
                        var cad = '';
                        switch (depth_aux) {
                            case 0:
                                cad = d.labelGroup;
                                break;
                            case 1:
                                cad = d.label;
                                break;
                            default:
                                cad = d.labelGroup;
                        }
                        if (cad.length > longitud_tooltip) {
                            cad = cad.substr(0, longitud_tooltip) + "...";
                        }
                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["rawValueDouble"] / 1000000;
                            var cad = "";
                            cad += "<span>Presupuesto Vigente " + "$ " + valor.formatMoney( 0, '.', ',').toString() + " Millones" + "</span></br>";
                            return cad;
                        }]
                    ]
                },
                yConfig: {
                    title: "",
                }
            })
            .sum("rawValueDouble")
            .depth(0)
            .legend(false)
            .render();
    }

}


function assignColorPaletaD(indice) {
    var color_aux = "#CCCCCC";
    var col_sel = color_aux;
    var colores_default = ["#639CBF", "#78B8BF", "#A65D5D", "#4C5959", "#56B4D6", "#56D6B2", "#4FBCE3", "#9BDDCA", "#41A387", "#5A6A70", "#3185A3",
        "#387CA6", "#96D2D9", "#F2E8C9", "#728EA6", "#BACDD9", "#F2E4DC", "#B0C1D9", "#88A5BF", "#D9BFA9", "#F29863", "#FAC1AE", "#BF9C09",
        "#56BFD6", "#5ED6B2", "#4FBC03", "#9B0DCA"];
    if (indice < colores_default.length) {
        col_sel = colores_default[indice];
    }
    return col_sel;
}

function loadDonaGraph(myData,divContenedor) {

    $("#" + divContenedor).html("");
    new d3plus.Donut()
        .select("#" + divContenedor)

        .config({
            data: myData,
            groupBy: "labelGroup",
            label: d => (d["porcentaje"]*1).formatMoney(2, ',', '.')+ "%",

            height: 665,
            //innerRadius: 50,
            padAngle: 0.01,
            legend: false,
            legendPosition: function () {
                return this._width > this._height ? "right" : "bottom";
            },
            value: "rawValue",
            color: function (d, index) {
                return assignColorPaletaD(index);
            },
            tooltipConfig: {
                title: function (d) {
                    return d["labelGroup"];
                },
                tbody: [
                    [function (d) {

                        var cad_aux = "$ " + d["rawValue"].formatMoney(1, ',', '.').toString() + " ";
                        if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                            cad_aux = "$ " + d["rawValue"].formatMoney(1, ',', '.').toString() + " " + " <strong>(" + d["porcentaje"].formatMoney(1, '.', ',').toString() + " %)</strong>";
                        }
                        return cad_aux;

                    }]
                ]
            }
            , legendConfig: {
                label(d, i) {
                    return d["labelGroup"];
                },

            }
        })
        .legendTooltip({ footer: "" })
        .on({ "click.legend": () => { } })
        .render();

}

function loadConsolidaGastoEntidad(data, div) {
    var txt_aux = "";

    for (var i = 0; i < data.length; i++) {
        txt_aux += "<div class='box' style='background:linear-gradient(to right, " + assignColorPaletaD(i) +" 20px, #f2f2f2 0) !important;'>"
            + "<div class='h3'>$ " + (data[i].rawValue*1).formatMoney(1, ',', '.').toString() + "</div>"
            + "<div class='desc-item-expenditure'>" + data[i].labelGroup + "</div>"
            + "<div class='wrap-expenditure-link'></div>"
            + "</div>";
    }

    $("#" + div).html(txt_aux);



}
function getDataByFuncion(annio) {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/ServiciosEntidad/GetDistribucionGastoEntidad",
        cache: false,
        data: {
            annio: annio,
        codEntidad: $("#codigoEntidadId").val()
        },
        success: function (result) {
            if (result.status == true) {
                var data = result.listInfoConsolidado;
                if (data != null) {
                    loadDonaGraph(data, "divGraphPerGrupoGasto");
                    loadConsolidaGastoEntidad(data, "divTxtGrupoGasto");
                }
            } else {
                alert("Error: " + result.message, function () {

                });
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




function getProcesosByFuncion(annio) {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/ServiciosEntidad/GetProcesosPorTipo",
        cache: false,
        data: {
            anyo: annio,
            codEntidad: $("#codigoEntidadId").val()
        },
        success: function (result) {
            if (result.status == true) {
                var data = result.infoRecursos;
                if (data != null) {
                    horizontalBar(data, "divGraphProcesos");
                }
            } else {
                alert("Error: " + result.message, function () {

                });
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
function horizontalBar(data, div) {
    $("#" + div).html("");
    //sort bars based on value
    data = data.sort(function (a, b) {
        return d3.ascending(a.rawValueDouble, b.rawValueDouble);
    })

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 5,
        right: 40,
        bottom: 15,
        left: 80
    };
    ancho = $(document).width() - ($(document).width()/3);
    var width = ancho - margin.left - margin.right,
        height = (ancho /2) - margin.top - margin.bottom;

    var svg = d3.select("#" + div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.rawValueDouble;
        })]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1)
        .domain(data.map(function (d) {
            return d.labelGroup.trim();
        }));

    //make y axis to show bar names
    var yAxis = d3.svg.axis()
        .scale(y)
        //no tick marks
        .tickSize(0)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll(".tick text")
        .call(wrap, 75)
        .attr("transform", "translate(-2,-30)")

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.labelGroup);
        })
        .attr("height", y.rangeBand()-20)
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.rawValueDouble);
        });

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.labelGroup) + y.rangeBand() / 2 -10;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.rawValueDouble) + 3;
        })
        .text(function (d) {
            return d.rawValueDouble;
        });

}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
        while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(" "))
            if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
            }
        }
    })
}


////////////////////////////////////////// Procesos ////////////////////////////////////////////////////
function GetRecursosPorNivelYAnio(anio) {
    procesos = [];
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosEntidad/GetProcesosPorAnio",
        type: "GET",
        data: {
            anio: anio,
            codEntidad: $("#codigoEntidadId").val()
        }
    }).done(function (data) {

        procesos = data.data;
        inidata = ((paginaActual - 1) * cantXPagina);
        findata = (paginaActual * cantXPagina) - 1;

        var institucionesPorPagina = jQuery.grep(procesos, function (n, i) {
            return (i >= inidata && i <= findata);
        });
        GetListadoInstituciones(institucionesPorPagina);
        dibujarPagNumeradas(paginaActual);
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}


function GetListadoInstituciones(institucionesPorPagina) {

    $("#divProcesos").html("");
    var html_list = '<div class="card-entidades-group">';
    for (var i = 0; i < institucionesPorPagina.length; i++) {

        html_list += '<div id="proceso_' + i.toString() + '" class="card d-flex">';
        html_list += '<div class="headEnt">';
        html_list += '<div class="data1 mainDataEntidad2"><span class="labelTit">Código Proceso: <strong>' + institucionesPorPagina[i]['codigoproceso'] + '</strong></span>';
        html_list += '<span class="td1">' + institucionesPorPagina[i]['descripcion'] + ' </span>';
        html_list += '</div>';
        html_list += '<div class="data1"><span class="labelTit">Estado del Proceso</span><span class="td1">' + institucionesPorPagina[i]['estadoProceso'].toString() + ' </span ></div > ';
        html_list += '<div class="data1"><span class="labelTit">Modalidad</span><span class="td1">' + institucionesPorPagina[i]['modalidad'].toString() + ' </span></div>';
        html_list += '<div class="data1"><span class="labelTit">Monto estimado</span><span class="td1">$ ' + institucionesPorPagina[i]['montoEstimado'].formatMoney(2, '.', ',').toString() + ' </span></div>';
        html_list += '</div>';
        html_list += '<div class="btn-action">';
        html_list += '<div class="btnPerfil">';
        html_list += '<a target="_blank" href="' + institucionesPorPagina[i]['url'] + '" class="text-small"><i class="material-icons md-18">arrow_forward</i><br /> <span>VER PROCESO</span></a>';
        html_list += '</div>';
        html_list += '</div>';
        html_list += '</div>';

    }
    html_list += '</div>';
    $("#divProcesos").html(html_list);

    dibujarPagNumeradas(1);
}

//paginador

function dibujarPagNumeradas(paginaActual) {
    var totalNumber = proyectos.length;
    var totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;

    if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
        totalPages = totalPages + 1;
    }
    var pagActual = parseInt(paginaActual);

    var totalNumerosPaginador = 10;
    $("#divPagFichasPro").html("");

    var pagEnlace = "";

    var cociente = Math.floor(pagActual / totalNumerosPaginador);
    var residuo = pagActual % totalNumerosPaginador;
    var inicio = 1;
    if (residuo == 0) {
        inicio = (pagActual - totalNumerosPaginador) + 1;
    } else {
        inicio = (cociente * totalNumerosPaginador) + 1;
    }

    var fin = inicio + (totalNumerosPaginador - 1);
    if (totalPages < totalNumerosPaginador) {
        fin = totalPages;
    }
    if (fin > totalPages) {
        fin = totalPages;
    }
    if (pagActual > totalNumerosPaginador && totalPages >= totalNumerosPaginador) {
        pagEnlace += '<a id="page_left" role="button" class="material-icons md-24" data-page="' + (inicio - totalNumerosPaginador) + '"><span class="">chevron_left</span></a>';
    }

    for (var i = inicio; i <= fin; i++) {
        if (i == pagActual) {
            pagEnlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
        } else {
            pagEnlace += '<a class="page_left" role="button" data-page="' + i + '">';
            pagEnlace += '<span class="glyphicon"></span>';
            pagEnlace += '<text class="paginacion">' + i + '</text>';
            pagEnlace += '</a>';
        }

    }

    if (pagActual < totalPages) {
        if (fin < totalPages) {
            pagEnlace += '<a id="page_right" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
        }
    }

    $("#divPagFichasPro").html(pagEnlace);

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
        paginaActual = $(this).attr("data-page");

        $("#divProcesos").empty();
        inidata = ((paginaActual - 1) * cantXPagina);
        findata = (paginaActual * cantXPagina) - 1;

        var institucionesPorPagina = jQuery.grep(proyectos, function (n, i) {
            return (i >= inidata && i <= findata);
        });

        GetListadoInstituciones(institucionesPorPagina);
        dibujarPagNumeradas(paginaActual);
    });

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