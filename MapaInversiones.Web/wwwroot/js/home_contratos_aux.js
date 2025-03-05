var objPerContratos = JSON.parse(document.body.getAttribute('data-resourcesPerContratos_' + $("#top_contratos_periodos option:selected").val()));
var objPerProcesos = JSON.parse(document.body.getAttribute('data-resourcesPerProcesos_' + $("#top_contratos_periodos option:selected").val()));
var limite_tooltip = 100;
var cantXPagina = 10;
var findata = 0;
var inidata = 0;
var procesos = [];
var paginaActual = 1;
loadTreeMapGraph("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");

configuraBtnVolver();
getEntidad($("#top_contratos_periodos option:selected").val());

function getEntidad(annio) {
    //debugger;
    var filtros = {
        annio: annio
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/ServiciosContratos/GetEntidadesHomeContratos/",
        cache: false,
        data: filtros,
        success: function (data) {

            var items_result = data.unidadCompras;
            var select = "";
            var entidad = "";
            for (var i = 0; i < items_result.length; i++) {
                if (i == 0) { entidad = items_result[i].entidad.toString(); }
                select = select + '<option value="' + items_result[i].entidad.toString() + '">' + items_result[i].entidad.toString() + '</option>';
            }

            $('#sltEntidad').html(select).fadeIn();
            if (items_result.length > 0) {
                GetProcesosEntidad(annio, entidad);

            } else {
                $("#divListadoEntidad").html("");
                var fila = '<div class="contractBox" >'
                    + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados</span></div>'
                    + '</div>';

                $("#divListadoEntidad").html(fila);
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

function GetProcesosEntidad(annio, entidad) {
    procesos = [];
    $("#divListadoInstituciones").html("");
    $("#divPagFichas").html("");
    $("#divListadoInstituciones").html("<div id='search-loading'><p><i class='fa fa-spinner fa-spin'></i> Buscando...</p></div>");
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosContratos/GetProcesosEntidadesHomeContratos",
        type: "GET",
        data: {
            annio: annio,
            entidad: entidad
        }
    }).done(function (data) {
        $("#divListadoInstituciones").html("");
        procesos = data.unidadCompras;
        inidata = ((paginaActual - 1) * cantXPagina);
        findata = (paginaActual * cantXPagina) - 1;
        var institucionesPorPagina = jQuery.grep(procesos, function (n, i) {
            return (i >= inidata && i <= findata);
        });

        GetListadoProcesos(institucionesPorPagina);
        dibujarPagNumeradas(paginaActual);
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}


function GetListadoProcesos(institucionesPorPagina) {

    $("#divListadoEntidad").html("");

    var html_list = '<div class="card-entidades-group">';
    for (var i = 0; i < institucionesPorPagina.length; i++) {

        html_list += '<div id="institucion_' + i.toString() + '" class="card d-flex">';
        html_list += '<div class="headEnt">';
        html_list += '<div class="data1 mainDataEntidad"><span class="labelTit">Código del proceso: <strong></strong></span>';
        html_list += '<span class="td1">' + institucionesPorPagina[i]['codigoProceso'] + ' </span>';
        html_list += '</div>';
        html_list += '<div class="data1"><span class="labelTit">Año </span><span class="td1"> ' + institucionesPorPagina[i]['annio'].toString() + ' </span ></div > ';
        html_list += '<div class="data1"><span class="labelTit">Valor </span><span class="td1">$ ' + institucionesPorPagina[i]['valorProceso'].formatMoney(2, ',', '.').toString() + ' </span></div>';
        html_list += '<div class="data1"><span class="labelTit">Contratos </span><span class="td1"> ' + institucionesPorPagina[i]['nroContratos'].toString() + ' </span ></div > ';
        html_list += '<div class="data1"><span class="labelTit">Valor contratos</span><span class="td1">$ ' + institucionesPorPagina[i]['valorContratado'].formatMoney(2, ',', '.').toString() + ' </span></div>';
        html_list += '</div>';
        html_list += '<div class="btn-action">';
        html_list += '<div class="btnPerfil">';
        html_list += '<a target="_blank" href="/Contratos?annio=' + $("#top_contratos_periodos option:selected").val() +'&codproceso=' + institucionesPorPagina[i]['codigoProceso'] + '" class="text-small"><i class="material-icons md-18">arrow_forward</i><br /> <span>VER PROCESO</span></a>';
        html_list += '</div>';
        html_list += '</div>';
        html_list += '</div>';

    }
    html_list += '</div>';
    $("#divListadoEntidad").html(html_list);
    dibujarPagNumeradas(1);
}

//paginador

function dibujarPagNumeradas(paginaActual) {
    var totalNumber = procesos.length;
    var totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;

    if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
        totalPages = totalPages + 1;
    }
    var pagActual = parseInt(paginaActual);

    var totalNumerosPaginador = 10;
    $("#divPagFichas").html("");

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

    $("#divPagFichas").html(pagEnlace);

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
        paginaActual = $(this).attr("data-page");
        $("#divListadoEntidad").empty();
        inidata = ((paginaActual - 1) * cantXPagina);
        findata = (paginaActual * cantXPagina) - 1;
        var institucionesPorPagina = jQuery.grep(procesos, function (n, i) {
            return (i >= inidata && i <= findata);
        });
        if (institucionesPorPagina.length > 1) {
            institucionesPorPagina = institucionesPorPagina.sort((a, b) => {
                if (a.vlrTotalProyectoFuenteRegalias > b.vlrTotalProyectoFuenteRegalias) return -1;
                if (a.vlrTotalProyectoFuenteRegalias < b.vlrTotalProyectoFuenteRegalias) return 1;
                return 0;
            });
        }
        GetListadoProcesos(institucionesPorPagina);
        dibujarPagNumeradas(paginaActual);
    });

}




function configuraBtnVolver() {
    $('#btnVolver').click(function () {
        loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
    });
    $('#btnVolverContr').click(function () {
        loadTreeMapGraph("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
    });
}

function assignColor(indice) {
    var color_aux = "#ECEFF1";
    var colores_default = [
        "#7790c1",
        "#9ecbd0",
        "#d1b873",
        "#80a8c2",
        "#4ba8e7",
        "#a677c1",
        "#29B6F6",
        "#E0E0E0",
        "#C5CAE9",
        "#00ACC1",
        "#BDBDBD",
        "#40C4FF",
        "#7790c1",
        "#9ecbd0",
        "#d1b873",
        "#80a8c2",
        "#4ba8e7",
        "#a677c1",
        "#29B6F6",
        "#E0E0E0",
        "#C5CAE9",
        "#00ACC1",
        "#BDBDBD",
        "#40C4FF"

    ];
    if (indice < colores_default.length) {
        color_aux = colores_default[indice];
    }
    return color_aux;
}


function loadTreeMapGraph(divContenedor, objData, agrupador, nivel, origen) {
    var titulo = "Otros con participación";
    var textoExpandir = "Clic para expandir";
    var limitePorc = 0.03;

    if (nivel == 0) {
        limitePorc = 0;
        titulo = "";
    }

    $(".btnback").hide();
    $("#" + divContenedor).empty();

    if (objData != undefined && objData != null) {
        var total = 0;
        for (var i = 0; i < objData.length; i++) {
            objData[i].rawValue = parseFloat(objData[i].rawValue);
            total += objData[i].rawValue;
        }
        var distintos = objData.map(item => item.labelGroup)
            .filter((value, index, self) => self.indexOf(value) === index);
        if (nivel == 1) {
            distintos = objData.map(item => item.label_inf)
                .filter((value, index, self) => self.indexOf(value) === index);
        }

        var grafica = new d3plus.Treemap()
            .select("#" + divContenedor)
            .shapeConfig({
                label: (d) => {
                    var auxiliar = "";
                    var porc = (((d.rawValue / total) * 100)).formatMoney(1, ',', '.').toString();
                    if (nivel == 0) {
                        auxiliar = d["labelGroup"];

                    } else if (nivel == 1) {
                        var vec_orig = d["label_inf"].toString().split(",");

                        if (vec_orig.length > 1) {
                            auxiliar = "Otros";
                        } else {
                            auxiliar = d["label_inf"]
                        }


                    }
                    return [auxiliar, porc + "%"];
                },
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
                }
                , fill: function (d, index) {
                    var color_aux = "#ECEFF1";
                    color_aux = assignColor(index);
                    return color_aux;

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
                threshold: limitePorc,
                data: objData,
                groupBy: agrupador,
                height: 400,
                tooltipConfig: {
                    title: function (d) {
                        var current = grafica.depth();
                        var auxiliar = "";
                        var cad = "";
                        var aux_grupo = "";
                        if (nivel == 0) {
                            //entidad
                            aux_grupo = d["labelGroup"];
                            if (aux_grupo.length > limite_tooltip) {
                                aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                            }
                            cad = aux_grupo;

                        } else {
                            //articulo
                            if (origen == "btn") {
                                aux_grupo = d["labelGroup"];
                                if (aux_grupo.length > limite_tooltip) {
                                    aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                                }
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                                }
                                cad = "<p style='float:right'>" + aux_grupo + "</p><br />" + auxiliar;
                            } else {
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                                }
                                cad = auxiliar;
                            }


                        }


                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["rawValue"] / 1;
                            var cad = "";
                            cad += "<span>" + "$ " + valor.formatMoney(1, ',', '.').toString() + "</span></br>";
                            return cad;
                        }]
                    ],
                    footer: function (d) {
                        if (nivel == 0) {
                            textoExpandir = "Clic para expandir";
                        } else {
                            textoExpandir = "";
                        }
                        return textoExpandir;
                    }

                },
                yConfig: {
                    title: "",
                }
            })
            .sum("rawValue")
            .depth(0)
            .legend(false)
            .on("click.shape", function (d) {
                if (d["labelGroup"] != undefined && d["labelGroup"] != null) {
                    if (nivel == 0) {

                            var data_pagina = jQuery.grep(objPerContratos, function (n, i) {
                                return (n.labelGroup == d["labelGroup"].toString()); // vec_orig[0]);
                            });
                            loadTreeMapGraph("divGraphRecursosObj", data_pagina, ["label_inf"], 1, "btn");
                            $(".btnback").show();
                      
                    }
                }

            })
            .render();
    }

}


function loadTreeMapGraphProc(divContenedor, objData, agrupador, nivel, origen) {
    var titulo = "Otros";
    var textoExpandir = "Clic para expandir";
    var limitePorc = 0.03;

    if (nivel == 0) {
        limitePorc = 0;
        titulo = "";
    }

    $(".btnback").hide();
    $("#" + divContenedor).empty();

    if (objData != undefined && objData != null) {
        var total = 0;
        for (var i = 0; i < objData.length; i++) {
            objData[i].rawValue = parseFloat(objData[i].rawValue);
            total += objData[i].rawValue;
        }
        var distintos = objData.map(item => item.labelGroup)
            .filter((value, index, self) => self.indexOf(value) === index);
        if (nivel == 1) {
            distintos = objData.map(item => item.label_inf)
                .filter((value, index, self) => self.indexOf(value) === index);
        }

        var grafica = new d3plus.Treemap()
            .select("#" + divContenedor)
            .shapeConfig({
                label: (d) => {
                    var auxiliar = "";
                    var porc = (((d.rawValue / total) * 100)).formatMoney(1, ',', '.').toString();
                    if (nivel == 0) {
                        auxiliar = d["labelGroup"];

                    } else if (nivel == 1) {
                        var vec_orig = d["label_inf"].toString().split(",");

                        if (vec_orig.length > 1) {
                            auxiliar = "Otros";
                        } else {
                            auxiliar = d["label_inf"]
                        }


                    }
                    return [auxiliar, porc + "%"];
                },
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
                }
                , fill: function (d, index) {
                    var color_aux = "#ECEFF1";
                    color_aux = assignColor(index);
                    return color_aux;

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
                threshold: limitePorc,
                data: objData,
                groupBy: agrupador,
                height: 400,
                tooltipConfig: {
                    title: function (d) {
                        var current = grafica.depth();
                        var auxiliar = "";
                        var cad = "";
                        var aux_grupo = "";
                        if (nivel == 0) {
                            //entidad
                            aux_grupo = d["labelGroup"];
                            if (aux_grupo.length > limite_tooltip) {
                                aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                            }
                            cad = aux_grupo;

                        } else {
                            //articulo
                            if (origen == "btn") {
                                aux_grupo = d["labelGroup"];
                                if (aux_grupo.length > limite_tooltip) {
                                    aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                                }
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                                }
                                cad = "<p style='float:right'>" + aux_grupo + "</p><br />" + auxiliar;
                            } else {
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                                }
                                cad = auxiliar;
                            }

                        }


                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["rawValue"] / 1;
                            var cad = "";
                            cad += "<span>" + "$ " + valor.formatMoney(1, ',', '.').toString() + "</span></br>";
                            return cad;
                        }]
                    ],
                    footer: function (d) {
                        if (nivel == 0) {
                            textoExpandir = "Clic para expandir";
                        } else {
                            textoExpandir = "";
                        }
                        return textoExpandir;
                    }

                },
                yConfig: {
                    title: "",
                }
            })
            .sum("rawValue")
            .depth(0)
            .legend(false)
            .on("click.shape", function (d) {
                if (d["labelGroup"] != undefined && d["labelGroup"] != null) {
                    if (nivel == 0) {
                            var data_pagina = jQuery.grep(objPerProcesos, function (n, i) {
                                return (n.labelGroup == d["labelGroup"].toString());// vec_orig[0]);
                            });
                            loadTreeMapGraphProc("divGraphRecursosProcesos", data_pagina, ["label_inf"], 1, "btn");
                            $(".btnback").show();
                       
                    }
                }

            })
            .render();
    }

}




$('#enlace_contratos').click(function () {
    window.location.href = "/Contratos?annio=" + $("#top_contratos_periodos option:selected").val();
})

$('#enlace_procesos').click(function () {
    window.location.href = "/Contratos?annio=" + $("#top_contratos_periodos option:selected").val();
})


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

$("#sltEntidad").change(function () {
    GetProcesosEntidad($("#top_contratos_periodos option:selected").val(), $("#sltEntidad option:selected").val());
   
});

$("#top_contratos_periodos").change(function () {
    $("#divAnioCarga").css("display", "");
    objPerContratos = JSON.parse(document.body.getAttribute('data-resourcesPerContratos_' + $("#top_contratos_periodos option:selected").val()));
    objPerProcesos = JSON.parse(document.body.getAttribute('data-resourcesPerProcesos_' + $("#top_contratos_periodos option:selected").val()));
    objEncabezado = JSON.parse(document.body.getAttribute('data-resourcesEncabezado_' + $("#top_contratos_periodos option:selected").val()));
    getEntidad($("#top_contratos_periodos option:selected").val());
    if (objEncabezado) {
        loadTreeMapGraph("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
        loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
        $("#numProcesos").html(objEncabezado.numProcesos);
        $("#valProcesos").html(objEncabezado.valorProcesos);
        $("#numContratos").html(objEncabezado.numContratos);
        $("#valContratos").html(objEncabezado.valorContratos);
        $("#divAnioCarga").css("display", "none");
    }
    else {
        var nombreprocesos = 'data-resourcesPerContratos_' + $("#top_contratos_periodos option:selected").val();
        var nombrecontratos = 'data-resourcesPerProcesos_' + $("#top_contratos_periodos option:selected").val();
        var nombreencabezado = 'data-resourcesEncabezado_' + $("#top_contratos_periodos option:selected").val();
        var filtros = {
            annio: $("#top_contratos_periodos option:selected").val()
        };
        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "api/ServiciosContratos/GetEncabezadoHomeContratos/",
            cache: false,
            data: filtros,
            success: function (result) {
                if (result.status == true) {
                    objPerContratos = result.infoRecursosContratos;
                    objPerProcesos = result.infoRecursosProcesos;
                    objEncabezado = { "numProcesos": result.resumenDatosContratos.numProcesos.formatMoney(0, ',', '.').toString(), "valorProcesos": "$ " + ((result.resumenDatosContratos.valorProcesos * 1) / 1000000).formatMoney(2, ',', '.').toString() + " millones", "numContratos": result.resumenDatosContratos.numContratos.formatMoney(0, ',', '.').toString(), "valorContratos": "$ " +((result.resumenDatosContratos.valorContratos * 1) / 1000000).formatMoney(2, ',', '.').toString() + " millones"  }
                    $("body").attr(nombreprocesos, JSON.stringify(objPerProcesos));
                    $("body").attr(nombrecontratos, JSON.stringify(objPerContratos));
                    $("body").attr(nombreencabezado, JSON.stringify( objEncabezado));
                   // $("body").data(nombreprocesos, result.infoRecursosProcesos);
                    loadTreeMapGraph("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
                    loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
                    $("#numProcesos").html(objEncabezado.numProcesos);
                    $("#valProcesos").html(objEncabezado.valorProcesos);
                    $("#numContratos").html(objEncabezado.numContratos);
                    $("#valContratos").html(objEncabezado.valorContratos);

                    $("#divAnioCarga").css("display", "none");
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
});