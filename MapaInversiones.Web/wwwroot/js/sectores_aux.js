
var cantXPagina = 5;
const cantXPagPot = 4; 

var paginaActual = 1;
const cant_por_linea = 10;
var global_pot = [];
var global_x_localidad = [];


getConsolidadoPeriodosPresupuesto($("#idSector").val(), $("#annioPresupuesto option:selected").val());
getConsolidadoGastosSector($("#idSector").val(), $("#annioPresupuesto option:selected").val());
GetODSInversion();
GetODSDesarrollo();
GetProyectosPotSector();



function formatMoney(number, c, d, t) {
    var n = number,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}



function getConsolidadoPeriodosPresupuesto(idSector, anyo_actual) {

    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosSectores/GetConsolidadoPeriodosPresupuesto",
        type: "GET",
        data: {
            idSector: idSector,
            anio: anyo_actual
        }
    }).done(function (data) {
        var result = data.participacionSector;
        var str_cad = "";
        if (result != null) {
            recargarPresupuesto(result, anyo_actual);
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}
function getConsolidadoGastosSector(idSector, anyo_actual) {

    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosSectores/GetConsolidadoGastosSector",
        type: "GET",
        data: {
            idSector: idSector,
            anio: anyo_actual
        }
    }).done(function (data) {
        var result = data.gastoSector;
        var str_cad = "";
        if (result != null) {
            GraphGastoSector(result);
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

$("#annioPresupuesto").change(function () {
    getConsolidadoPeriodosPresupuesto($("#idSector").val(), $("#annioPresupuesto option:selected").val());
    getConsolidadoGastosSector($("#idSector").val(), $("#annioPresupuesto option:selected").val());
});

function GraphGastoSector(objData) {
    $("#divGraphGastoSector").empty();
    if (objData != undefined && objData != null) {
        //filtrar datos x tab
        for (var i = 0; i < objData.length; i++) {
            objData[i].rawValueDouble = parseFloat(objData[i].rawValueDouble);
        }

        var paleta = {
            colores: [
                "#e6e6e6",
                "#c4e5ee",
                "#fcd96c",
                "#3e5174",
                "#ea5670",
                "#999999",
                "#1c717f",
                "#64b5e2",
                "#7fcbdc",
                "#e7753d"
            ]
        };

        function colorPorPosicion(posicion) {
            return paleta.colores[posicion % paleta.colores.length];
        }

        grafica = new d3plus.Treemap()
            .select("#divGraphGastoSector")
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
                data: objData,
                groupBy: ["labelGroup", "label"],
                height: 500,
                sum: "rawValueDouble",              // Valor agregado
                depth: 0,                           // Empieza con un nivel, permite clic para expandir
                legend: false,
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
                            var valor = d["rawValueDouble"] / 1;
                            var cad = "";
                            cad += "<span>" + "$ " + shared.formatoMoneda(valor) + "</span></br>";
                            return cad;
                        }]
                    ]
                },
                yConfig: {
                    title: "",
                }
            })
            .shapeConfig({
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
                },
                fill: function (d, i) {
                    return colorPorPosicion(i);
                }
            })
            .render();
    }

}

function GetODSInversion() {
    proyectos = [];
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosSectores/GetODSInversion",
        type: "GET",
        data: {
            idSector: $("#idSector").val(),
        }
    }).done(function (data) {
        if (data.infoOds) {
            var select = "";
            var select2 = "";
            var ods = "";

            $('#cantidadinversion').html(data.approvedProjects.toString() + " Proyectos");
            $('#proyInversion').val(data.approvedProjects)
            select = select + '<option selected value="">Todos</option>';
            select2 = select2 + '<option selected value="">Todas</option>';
            for (var i = 0; i < data.infoOds.length; i++) {

                select = select + '<option value="' + data.infoOds[i].odsId.toString() + '">' + data.infoOds[i].odsNombre.toString() + '</option>';
                ods = ods +' <div class="col-lg-2 city-ods">                             '
                    + '         <img alt="icono de objetivos de desarrollo sostenible" src="../\img/\imgsector/\icn_ODS' + data.infoOds[i].odsId.toString() + '.png" />'                      
                    + ' </div>                                             ';
            }

            for (var i = 0; i < data.infoEntidades.length; i++) {

                select2 = select2 + '<option value="' + data.infoEntidades[i].id.toString() + '">' + data.infoEntidades[i].nombre.toString() + '</option>';
  
            }

            $('#odsinversion').html(ods);
            $('#sortyinversion').html(select);
            $('#sortyinversionentidad').html(select2);
            

            GetListadoODSInversion(1, cantXPagina, "", "");
        }
    }
    ).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function GetListadoODSInversion(pagina,tamanopagina,ods, entidad) {
    proyectos = [];
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosSectores/GetConsolidadoODSInversion",
        type: "GET",
        data: {
            idSector: $("#idSector").val(),
            pagina: pagina,
            tamanopagina: tamanopagina,
            ods: ods,
            entidad: entidad

        }
    }).done(function (data) {
        if (data.infoConsolidadoProyectosInversions) {

            var list = "";

            for (var i = 0; i < data.infoConsolidadoProyectosInversions.length; i++) {

                list = list + '<div class="card d-flex cardborder">                                                                                '
                    + '    <div class="headEnt">                                                                                           '
                    + '        <div class="data1 mainDataEntidad3">                                                                        '
                    + '                <span class="labelTit">Código BPIN: ' + data.infoConsolidadoProyectosInversions[i].codigoProyecto+'</span>                                                  '
                    + '                <span class="td1">' + data.infoConsolidadoProyectosInversions[i].nombreProyecto +'</span>                                '
                    + '        </div>                                                                                                      '
                    + '        <div class="data1">                                                                                         '
                    + '                <span class="labelTit">                                                                             '
                    + '                    Valor programado                                                                             '
                    + '                </span>                                                                                             '
                    + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalProgramado, 1,1) +'</span>                                                                  '
                    + '        </div>                                                                                                      '
                    + '        <div class="data1">                                                                                         '
                    + '                <span class="labelTit">                                                                             '
                    + '                    Valor comprometido                                                                        '
                    + '                </span>                                                                                             '
                    + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalComprommetido, 1,1) +'</span>                                                                   '
                    + '        </div>                                                                                                      '
                    + '        <div class="data1">                                                                                         '
                    + '                <span class="labelTit">                                                                             '
                    + '                    Valor girado                                                                              '
                    + '                </span>                                                                                             '
                    + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalGirado, 1, 1) +'</span>                                                                   '
                    + '        </div>                                                                                                      '
                    + '    </div>                                                                                                          '
                    + '    <div class="btn-action">                                                                                        '
                    + '        <div class="btnPerfil">                                                                                     '
                    + '            <a class="text-small" target="_blank" href="/PerfilProyecto/' + data.infoConsolidadoProyectosInversions[i].idProyecto+'"><i class="material-icons md-18">arrow_forward</i><br /><span>Ver perfil</span></a>'
                    + '                                                                                                                    '
                    + '        </div>                                                                                                      '
                    + '    </div>                                                                                                          '
                    + '</div>';                                
            }

            $('#listinversion').html(list);

            dibujarPagNumeradasInversion(pagina, data.approvedProjects);

        }
    }
    ).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function dibujarPagNumeradasInversion(paginaActual, totalProy) {
    const totalProyectos = totalProy;
    const totalPages = Math.ceil(totalProyectos / cantXPagina);
    const pagActual = parseInt(paginaActual);
    const totalNumerosPaginador = 10;

    const inicio = Math.floor((pagActual - 1) / totalNumerosPaginador) * totalNumerosPaginador + 1;
    let fin = Math.min(inicio + totalNumerosPaginador - 1, totalPages);

    let pagEnlace = "";

    if (inicio > 1) {
        pagEnlace += `<a id="page_left" role="button" class="material-icons md-24" data-page="${inicio - totalNumerosPaginador}">
                        <span>chevron_left</span>
                      </a>`;
    }

    for (let i = inicio; i <= fin; i++) {
        if (i === pagActual) {
            pagEnlace += `<span class="pag_actual" data-page="${i}"><text>${i}</text></span>`;
        } else {
            pagEnlace += `<a class="page_left" role="button" data-page="${i}">
                            <span class="glyphicon"></span>
                            <text class="paginacion">${i}</text>
                          </a>`;
        }
    }

    if (fin < totalPages) {
        pagEnlace += `<a id="page_right" role="button" class="material-icons md-24" data-page="${fin + 1}">
                        <span>chevron_right</span>
                      </a>`;
    }

    $("#divPagDistInversion").html(pagEnlace);

    $('#page_right, #page_left, .page_left, .page_right').off('click').on('click', function () {
        const nuevaPagina = parseInt($(this).attr("data-page"));

        $("#listinversion").empty();
        GetListadoODSInversion(nuevaPagina, cantXPagina, $("#sortyinversion option:selected").val(), $("#sortyinversionentidad option:selected").val());
        dibujarPagNumeradasInversion(nuevaPagina);
    });


}

$("#sortyinversion").change(function () { GetListadoODSInversion(1, cantXPagina, $("#sortyinversion option:selected").val(), $("#sortyinversionentidad option:selected").val()); });
$("#sortyinversionentidad").change(function () { GetListadoODSInversion(1, cantXPagina, $("#sortyinversion option:selected").val(), $("#sortyinversionentidad option:selected").val()); });
function GetODSDesarrollo() {
    proyectos = [];
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosSectores/GetODSDesarrollo",
        type: "GET",
        data: {
            idSector: $("#idSector").val(),
        }
    }).done(function (data) {
        if (data.infoOds) {
            var select = "";
            var select2 = "";
            var ods = "";

            $('#cantidaddesarrollo').html(data.approvedProjects.toString() + " Proyectos").fadeIn();
            $('#proyDesarrollo').val(data.approvedProjects)
            select = select + '<option selected value="">Todos</option>';
            select2 = select2 + '<option selected value="">Todos</option>';
            for (var i = 0; i < data.infoOds.length; i++) {

                select = select + '<option value="' + data.infoOds[i].odsId.toString() + '">' + data.infoOds[i].odsNombre.toString() + '</option>';
                ods = ods + ' <div class="col-lg-2 city-ods">                             '
                    + '         <img src="../\img/\imgsector/\icn_ODS' + data.infoOds[i].odsId.toString() + '.png" />'
                    + '       </div>                                             ';
            }

            for (var i = 0; i < data.infoEntidades.length; i++) {

                select2 = select2 + '<option value="' + data.infoEntidades[i].id.toString() + '">' + data.infoEntidades[i].nombre.toString() + '</option>';

            }

        


            $('#odsdesarrollo').html(ods);
            $('#sortydesarrollo').html(select);
            $('#sortydesarrolloentidad').html(select2);

            GetListadoODSDesarrollo(1, cantXPagina, "", "");
        }
    }
    ).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function GetListadoODSDesarrollo(pagina, tamanopagina, ods, entidad) {
    proyectos = [];
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosSectores/GetConsolidadoODSDesarrollo",
        type: "GET",
        data: {
            idSector: $("#idSector").val(),
            pagina: pagina,
            tamanopagina: tamanopagina,
            ods: ods,
            entidad: entidad

        }
    }).done(function (data) {
        if (data.infoConsolidadoProyectosInversions) {
            var list = "";

            for (var i = 0; i < data.infoConsolidadoProyectosInversions.length; i++) {

                list = list + '<div class="card d-flex cardborder">                                                                                '
                    + '    <div class="headEnt">                                                                                           '
                    + '        <div class="data1 mainDataEntidad3">                                                                        '
                    + '                <span class="labelTit">Código SEGPLAN: ' + data.infoConsolidadoProyectosInversions[i].codigoProyecto + '</span>                                                  '
                    + '                <span class="td1">' + data.infoConsolidadoProyectosInversions[i].nombreProyecto + '</span>                                '
                    + '        </div>                                                                                                      '
                    + '        <div class="data1">                                                                                         '
                    + '                <span class="labelTit">                                                                             '
                    + '                    Valor programado                                                                             '
                    + '                </span>                                                                                             '
                    + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalProgramado, 1, 1) + '</span>                                                                  '
                    + '        </div>                                                                                                      '
                    + '        <div class="data1">                                                                                         '
                    + '                <span class="labelTit">                                                                             '
                    + '                    Valor comprometido                                                                        '
                    + '                </span>                                                                                             '
                    + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalComprommetido, 1, 1) + '</span>                                                                   '
                    + '        </div>                                                                                                      '
                    + '        <div class="data1">                                                                                         '
                    + '                <span class="labelTit">                                                                             '
                    + '                    Valor girado                                                                              '
                    + '                </span>                                                                                             '
                    + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalGirado, 1, 1) + '</span>                                                                   '
                    + '        </div>                                                                                                      '
                    + '    </div>                                                                                                          '
                    + '    <div class="btn-action">                                                                                        '
                    + '        <div class="btnPerfil">                                                                                     '
                    + '            <a class="text-small" target="_blank" href="/PerfilProyecto/' + data.infoConsolidadoProyectosInversions[i].idProyecto + '"><i class="material-icons md-18">arrow_forward</i><br /><span>Ver perfil</span></a>'
                    + '                                                                                                                    '
                    + '        </div>                                                                                                      '
                    + '    </div>                                                                                                          '
                    + '</div>';
            }

            $('#listdesarrollo').html(list);

            dibujarPagNumeradasDesarrollo(pagina, data.approvedProjects);

        }
    }
    ).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function dibujarPagNumeradasDesarrollo(paginaActual, totalProy) {
    const totalProyectos = totalProy;
    const totalPages = Math.ceil(totalProyectos / cantXPagina);
    const pagActual = parseInt(paginaActual);
    const totalNumerosPaginador = 10;

    const inicio = Math.floor((pagActual - 1) / totalNumerosPaginador) * totalNumerosPaginador + 1;
    let fin = Math.min(inicio + totalNumerosPaginador - 1, totalPages);

    let pagEnlace = "";

    if (inicio > 1) {
        pagEnlace += `<a id="page_left_desarrollo" role="button" class="material-icons md-24" data-page="${inicio - totalNumerosPaginador}">
                        <span>chevron_left</span>
                      </a>`;
    }

    for (let i = inicio; i <= fin; i++) {
        if (i === pagActual) {
            pagEnlace += `<span class="pag_actual" data-page="${i}"><text>${i}</text></span>`;
        } else {
            pagEnlace += `<a class="page_left_desarrollo" role="button" data-page="${i}">
                            <span class="glyphicon"></span>
                            <text class="paginacion">${i}</text>
                          </a>`;
        }
    }

    if (fin < totalPages) {
        pagEnlace += `<a id="page_right_desarrollo" role="button" class="material-icons md-24" data-page="${fin + 1}">
                        <span>chevron_right</span>
                      </a>`;
    }

    $("#divPagDistDesarrollo").html(pagEnlace);

    $('#page_right_desarrollo, #page_left_desarrollo, .page_left_desarrollo, .page_right_desarrollo').off('click').on('click', function () {
        const nuevaPagina = parseInt($(this).attr("data-page"));

        $("#listdesarrollo").empty();
        GetListadoODSDesarrollo(nuevaPagina, cantXPagina, $("#sortydesarrollo option:selected").val(), $("#sortydesarrolloentidad option:selected").val());
        dibujarPagNumeradasDesarrollo(nuevaPagina);
    });


}

$("#sortydesarrollo").change(function () { GetListadoODSDesarrollo(1, cantXPagina, $("#sortydesarrollo option:selected").val(), $("#sortydesarrolloentidad option:selected").val()); }); 
$("#sortydesarrollo").change(function () { GetListadoODSDesarrollo(1, cantXPagina, $("#sortydesarrollo option:selected").val(), $("#sortydesarrolloentidad option:selected").val()); }); 

//function GetRecursosPorNivelYAnio(annio, estado) {
//    proyectos = [];
//    $("#divListadoInstituciones").html("");
//    $("#divPagFichas").html("");
//    $("#divListadoInstituciones").html("<div id='search-loading'><p><i class='fa fa-spinner fa-spin'></i> Buscando...</p></div>");
//    $.ajax({
//        contentType: "application/json; charset=utf-8",
//        url: "api/ServiciosSectores/ConsolidadoProyectosAnioEstado",
//        type: "GET",
//        data: {
//            anio: annio,
//            estado: estado,
//            idSector: $("#idSector").val(),
//            idDepto: $("#idDepto").val() 
//        }
//    }).done(function (data) {
//        $("#divListadoInstituciones").html("");
//        proyectos = data.proyectosAprobados;
//        inidata = ((paginaActual - 1) * cantXPagina);
//        findata = (paginaActual * cantXPagina) - 1;
//        var institucionesPorPagina = jQuery.grep(proyectos, function (n, i) {
//            return (i >= inidata && i <= findata);
//        });
//        if (institucionesPorPagina.length > 1) {
//            institucionesPorPagina = institucionesPorPagina.sort((a, b) => {
//                if (a.vlrTotalProyectoFuenteRegalias > b.vlrTotalProyectoFuenteRegalias) return -1;
//                if (a.vlrTotalProyectoFuenteRegalias < b.vlrTotalProyectoFuenteRegalias) return 1;
//                return 0;
//            });
//        }
//        GetListadoProyectos(institucionesPorPagina);
//        dibujarPagNumeradas(paginaActual);
//    }).fail(function (xhr, ajaxOptions, thrownError) {
//        alert("Error " + xhr.status + "_" + thrownError);
//    });

//}


//function GetListadoProyectos(institucionesPorPagina) {

//    $("#divListadoInstituciones").html("");
//    //console.log("Total instituciones por página:", institucionesPorPagina.length);
//    var html_list = '<div class="card-entidades-group">';
//    for (var i = 0; i < institucionesPorPagina.length; i++) {

//        html_list += '<div id="institucion_' + i.toString() + '" class="card d-flex">';
//        html_list += '<div class="headEnt">';
//        html_list += '<div class="data1 mainDataEntidad" style="min-width: 60% !important;max-width:60% !important;"><span class="labelTit">Código BPIN: <strong>' + institucionesPorPagina[i]['codigoSnip'] +'</strong></span>';
//        html_list += '<span class="td1">' + institucionesPorPagina[i]['nombreProyecto'] + ' </span>';
//        html_list += '</div>';
//        html_list += '<div class="data1"><span class="labelTit">Presupuesto asignado acumulado</span><span class="td1">$ ' + institucionesPorPagina[i]['vlrTotalProyectoFuenteRegalias'].formatMoney(2, '.', ',').toString() + ' </span ></div > ';
//        html_list += '<div class="data1"><span class="labelTit">Valor ejecutado</span><span class="td1">$ ' + institucionesPorPagina[i]['vlrTotalProyectoTodasLasFuentes'].formatMoney(2, '.', ',').toString() + ' </span></div>';
//        html_list += '</div>';
//        html_list += '<div class="btn-action">';
//        html_list += '<div class="btnPerfil">';
//        html_list += '<a target="_blank" href="/perfilProyecto/' + institucionesPorPagina[i]['idProyecto'] + '" class="text-small"><i class="material-icons md-18">arrow_forward</i><br /> <span>VER PROYECTO</span></a>';
//        html_list += '</div>';
//        html_list += '</div>';
//        html_list += '</div>';

//    }
//    html_list += '</div>';
//    $("#divListadoInstituciones").html(html_list);
//    dibujarPagNumeradas(1);
//}

//paginador



//function loadProyectosEjecucion(resultados) {
//    var limite = 60;
//    $("#divNoEncontradoEjec").hide();
//    $("#divNoExistenEjec").hide();
//    if (resultados.length > 0) {
//        for (var i = 0; i < resultados.length; i++) {
//            var valor_aux = parseFloat(resultados[i].approvedTotalMoney);
//            var nombre_aux = resultados[i].NombreProyecto.toString();
//            if (nombre_aux.length > limite) {
//                nombre_aux = nombre_aux.substr(0, limite) + "...";
//            }

//            var div_proy = d3.select("#divContenedorFichas")
//            var div_ficha = div_proy.append("div")
//            div_ficha.attr("class", "project-col project-col-carusel")
//            var div_card = div_ficha.append("div").attr("class", "project-card")
//            var div_borde = div_card.append("div").attr("class", "card h-100 shadow border-0")
//            div_borde.append("div").attr("class", "img-card").attr("style", "background: url('/img/default_SM.jpg')")
//            div_borde.append("div").attr("class", "labelCategory").text(resultados[i].NombreSector)
//            var div_caption = div_borde.append("div").attr("class", "caption")
//            var div_enlace = div_caption.append("a").attr("href", "../../perfilProyecto/" + resultados[i].IdProyecto).attr("target", "_blank");
//            //var div_enlace = div_caption.append("a").attr("target", "_blank")
//            div_enlace.append("h3").text(nombre_aux)
//            if (resultados[i].approvedTotalMoney > 1000000) {
//                div_enlace.append("div").attr("class", "amount").append("span").attr("class", "bigNumber").text('$ ' + formatMoney(valor_aux / 1000000, 2, ".", ",").toString() + ' Millones');
//            } else {
//                div_enlace.append("div").attr("class", "amount").append("span").attr("class", "bigNumber").text('$ ' + formatMoney(valor_aux / 1, 2, ".", ",").toString() + ' Millones');

//            }

//            div_card.append("div").attr("class", "clearfix")
//            var div_porcentaje = div_card.append("div").attr("class", "percentage")
//            div_porcentaje.append("div").attr("class", "completed").attr("style", "width:" + resultados[i].porcentajeGastado + "%")
//            var div_indicador = div_porcentaje.append("div").attr("class", "indicatorValues")
//            div_indicador.append("span").attr("class", "startPoint").html(resultados[i].MesInicioProyecto + "<br/>" + resultados[i].AnioInicioProyecto)
//            div_indicador.append("span").attr("class", "endPoint").html(resultados[i].MesFinProyecto + "<br/>" + resultados[i].AnioFinProyecto)
//            div_indicador.append("span").attr("class", "middlePoint text-center").html(resultados[i].porcentajeGastado + " %" + "<br/>" + "gastado")
//            div_card.append("div").attr("class", "clearfix")

//            var div_detalles = div_card.append("div").attr("class", "row detailedLinks")

//            var div_photo = div_detalles.append("div").attr("class", "col-6")
//            var enlace_photo = div_photo.append("a").attr("href", "../PerfilProyecto/" + resultados[i].IdProyecto)
//            enlace_photo.append("span").attr("class", "material-icons").text("photo_library")
//            enlace_photo.append("span").attr("class", "text-ic").text("(" + resultados[i].cantidadFotos + ")")

//            var div_question = div_detalles.append("div").attr("class", "col-6")
//            var enlace_question = div_question.append("a").attr("href", "../PerfilProyecto/" + resultados[i].IdProyecto)
//            enlace_question.append("span").attr("class", "material-icons").text("question_answer")
//            enlace_question.append("span").attr("class", "text-ic").text("(" + resultados[i].Comentarios + ")")

//        }
//    }
//    else {
//        //no existen proyectos en ejecucion
//        $("#divNoExistenEjec").show();

//    }


//}

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

function quitardecimal(num) {
    if (num != undefined) {
        if (isNaN(num)) {
            var num = num.toString().split(',');
            return num[0]
        }
        else {
            //var num = num.toFixed(0);
            return num;
        }
    }

}

//$('#anioProyecto').on('change', function () {
//    datosInicial(this.value, $("#estadoProyecto").val());
//});


//$('#estadoProyecto').on('change', function () {
//    datosInicial($("#anioProyecto").val() ,this.value);
//});




function recargarPresupuesto(result, anyo_actual) {
   

    var vigente = Number(result.valorVigente);
    var comprometido = Number(result.valorComprometido);
    var giros = Number(result.valorGiros);

        var pctComprometido = (comprometido / vigente * 100).toFixed(1);
        var pctGiros = (giros / vigente * 100).toFixed(1);

        $('.valor-vigente[tipo="general"]')
            .text("$ " + shared.formatoMoneda(vigente));
        $('.valor-comprometido[tipo="general"]')
            .text("$ " + shared.formatoMoneda(comprometido));
        $('.valor-girado[tipo="general"]')
            .text("$ " + shared.formatoMoneda(giros));
        $('.porcentaje-comprometido[tipo="general"]')
            .text(shared.formatoDecimales(pctComprometido) + '%');
        $('.porcentaje-girado[tipo="general"]')
            .text(shared.formatoDecimales(pctGiros) + '%');
        $('.completed.comprometido[tipo="general"]')
            .css('width', pctComprometido + '%');
        $('.completed.girado[tipo="general"]')
            .css('width', pctGiros + '%');
    
    $('.lblAnyoSelected').text(anyo_actual);

}




function GetProyectosPotSector() {

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/ServiciosSectores/GetProyectosPotSector",
        type: "GET",
        data: {
            idSector: $("#idSector").val()
        }
    }).done(function (data) {
        var result = data.proyectosAprobados;
        global_pot = result;
        global_x_localidad = result;  //trae todos los proy en cargue inicial

        ////----cargue select localidades
        renderSelectLocalidades(global_pot);

        ////-------------------------------
        ////cargue fichas proy pot 
        var pagina_actual = 1;
        var ini_data = ((pagina_actual - 1) * cantXPagPot);
        var fin_data = (pagina_actual * cantXPagPot) - 1;
        var data_pagina = arr = jQuery.grep(global_x_localidad, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });

        showProyectosPot(data_pagina, 1);
        ////---------------------------------

    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });

}

function renderSelectLocalidades(datos) {
    let localidadesMap = Array.from(
        new Map(datos.map(item => [item.idDepartamento, item.nombreDepartamento]))
    ).sort((a, b) => a[1].localeCompare(b[1], 'es', { sensitivity: 'base' }));



    let $select = $("#selectLocalidades");
    $select.empty();
    $select.append('<option value="">Todos</option>');

    localidadesMap.forEach(([id, nombre]) => {
        $select.append(`<option value="${id}">${nombre}</option>`);
    });

    configuraSelectLocalidad();
}

function configuraSelectLocalidad() {
    $('#selectLocalidades')
        .off('change') // Elimina manejadores previos
        .on('change', function () {

            let pagina_actual = 1;

            let id_selected = this.value;
            if (id_selected == "") {
                global_x_localidad = global_pot;
            } else {
                global_x_localidad = id_selected
                    ? $.grep(global_pot, item => item.idDepartamento == id_selected)
                    : global_pot;
            }

            console.log("localidad-->" + id_selected + "-->" + global_x_localidad.length);

            let ini_data = ((pagina_actual - 1) * cantXPagPot);
            let fin_data = (pagina_actual * cantXPagPot) - 1;

            let data_pagina = $.grep(global_x_localidad, (n, i) => i >= ini_data && i <= fin_data);

            showProyectosPot(data_pagina, 1);
        });
}
function showProyectosPot(datos, pagina) {
    let html_aux = '';
    const itemsPorPag = 4;
    $('#divProyectosPot').empty();

    for (var i = 0; i < datos.length; i += itemsPorPag) {

        for (var j = i; j < i + itemsPorPag && j < datos.length; j++) {
            const proyecto = datos[j];
            html_aux += `
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body-pry">
                            <div class="cardimg-city">
                                <img alt="imagen representativa del proyecto" src="../img/ciudad1.png" />
                            </div>
                            <div class="cardcont-city">
                                <a href="/PerfilProyectoPot/${proyecto.idProyecto}" class="item-link" target="_blank" rel="noopener noreferrer">
                                    <div class="project-title py-4">
                                        <h3>${proyecto.nombreProyecto}</h3>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <!-- Ícono de ubicación -->
                                        <div class="me-2">
                                            <i class="material-icons">view_comfy_alt</i>
                                        </div>
                                        <!-- Texto con separadores -->
                                        <div class="small text-muted">
                                            <span>Tipo de proyecto: ${proyecto.tipoProyecto}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Cerrar fila

    }


    $('#divProyectosPot').html(html_aux);



    var totalNumber = global_x_localidad.length;
    var totalPages = (totalNumber > cantXPagPot) ? ((totalNumber - (totalNumber % cantXPagPot)) / cantXPagPot) : 1;
    if ((totalNumber >= cantXPagPot) && ((totalNumber % cantXPagPot) > 0)) {
        totalPages = totalPages + 1;
    }

    dibujarPaginasPot(pagina, totalNumber, totalPages);
}

function dibujarPaginasPot(actual, total, totalPag, contenedor = "#divPagPot", contenedorListado = "#divProyectosPot") {
    $(contenedor).empty();

    var pag_actual = parseInt(actual);  // Página actual al cargar
    var pagina_actual = pag_actual;     // Página seleccionada por el usuario (puede cambiar con clic)
    var pagesHTML = '';

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
        pag_enlace += '<a id="page_left_pot" role="button" class="material-icons md-24" data-page="' + (inicio - cant_por_linea) + '"><span class="">chevron_left</span></a>';
    }

    for (var i = inicio; i <= fin; i++) {
        if (i == pag_actual) {
            // Estructura para página actual
            pag_enlace += '<span class="pag_actual" data-page="' + i + '">';
            pag_enlace += '<text>' + i + '</text>';
            pag_enlace += '</span>';
        } else {
            // Estructura para páginas clickeables
            pag_enlace += '<a class="page_left_pot" role="button" data-page="' + i + '">';
            pag_enlace += '<span class="glyphicon"></span>';
            pag_enlace += '<text class="paginacion">' + i + '</text>';
            pag_enlace += '</a>';
        }
    }

    if (pag_actual < totalPag) {
        if (fin < totalPag) {
            pag_enlace += '<a id="page_right_pot" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
        }
    }

    $(contenedor).html(pag_enlace);

    $('#page_righ_pott, #page_left_pot, .page_left_pot').on('click', function () {
        pagina_actual = $(this).attr("data-page");
        var ini_data = ((pagina_actual - 1) * cantXPagPot);
        var fin_data = (pagina_actual * cantXPagPot) - 1;
        var data_pagina = jQuery.grep(global_x_localidad, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        $(contenedorListado).empty();
        showProyectosPot(data_pagina, pagina_actual);
    });
}


