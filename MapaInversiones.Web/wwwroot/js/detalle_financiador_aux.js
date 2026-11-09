var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
var anio = $("#anios_financiador option:selected").val();
var codigoFinanciador = $("#codigo_financiador").text().trim();

var paginaActual = 1;
var totalPorPagina = 10;
var finData = 0;
var inicioData = 0;
var proyectos;

//---sankey------------
var global_sankey = [];
var global_agrupado = [];
var global_otros = [];
var global_ini = [];
var miga_pan = "";
$("#btnAtras").hide();
var global_tab = "";
var porc_agrup_organismos = 50;
var etiqueta_nivel3_organismos = "OTROS PROYECTOS";
inicializarDatos();
function inicializarDatos() {
    obtenerPerfilPorAnioFinanciador();    
}
function anioSeleccionadoFinanciador(sel) {
    anio = sel.options[sel.selectedIndex].text;
    obtenerPerfilPorAnioFinanciador();
}
function obtenerPerfilPorAnioFinanciador() {
    console.log("Anio", anio);
    console.log("CodigoFinanciador", codigoFinanciador);
    console.log("Entré a obtenerDatosPerOrganismos desde obtenerPerfilPorAnioFinanciador");

    obtenerDatosPerOrganismos(anio, codigoFinanciador, 'organismo');
    obtenerDetalleFinanciador(anio, codigoFinanciador);
    obtenerGraficoTreeMapProyectosFinanciadosPorFinanciadorAnio(anio, codigoFinanciador);
    
    obtenerProyectosPorFinanciadorAnio(anio, codigoFinanciador);
}
function obtenerDetalleFinanciador(anio, codigoFinanciador) {
    $("#divDatosConsolidado").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosOrganismoFinanciador/ObtenerOrganismosFinanciadoresPorAnioAndCodigoFinanciador",
        type: "GET",
        data: {
            anio: anio,
            codigoFinanciador: codigoFinanciador
        }
    }).done(function (data) {
        obtenerInformacionMontoFinanciado(data);
        obtenerInformacionEstadoProyectos(data);
       }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });
}
function obtenerInformacionMontoFinanciado(data) {
    var html = '<div class="col-lg-8 mb-4">' +
        '<div class="card h-100 shadow border-0 card-entidad">' +
        '<div class="card-body">' +
        '<div class="row justify-content-center">' +
        '<div class="col-lg-6">' +
        '<div class="wrap-desc-entidad d-flex">' +
        '<div class="ic-wrap"><img src="../img/svg-icons/ICO-Org-008.svg" alt="Monto"></div>' +
        '<div class="desc-data">' +
        '<div class="executeV"><strong>Monto total financiado</strong></div>' +
        '<div id="montoTotalFinanciado" class="organismoN">RD' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(data.montoFinanciado) + 'M</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-lg-6">' +
        '<span class="executeV mb-4"><strong>Distribución del monto</strong></span>' +
        '<div class="wrap-desc-entidad d-flex">';
    for (var i = 0; i < data.montosPorFuenteFinanciacion.length; i++)
    {
        var fuente = data.montosPorFuenteFinanciacion[i].fuente.toUpperCase().replace('DONACION', 'DONACIÓN').replace('CREDITO', 'CRÉDITO');
        html = html + '<div class="desc-data-valor">' + '<div class="executeValor">' + fuente
            + '</div>'
            + '<div class="organismoFuente">RD' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(data.montosPorFuenteFinanciacion[i].vigente) + 'M</div>'
            + '</div>';
    }
    html = html + '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    html = html + '<div class="col-lg-4 mb-4">' +
        '<div class="card h-100 shadow border-0 card-entidad">' +
        '<div class="card-body">' +
        '<div class="wrap-desc-entidad d-flex">' +
        '<div class="ic-wrap">' +
        '<img src="../img/svg-icons/FINANCIADOS.svg" alt="FINANCIADOS">' +
        '</div>' +
        '<div class="desc-data">' +
        '<div class="executeV"><strong>Proyectos financiados</strong></div>' +
        '<div class="organismoN">' + data.proyectosFinanciados + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';

    $("#detalleMontoProyectosOrganismoFinanciador").empty();
    $("#detalleMontoProyectosOrganismoFinanciador").html(html);
}
function obtenerInformacionEstadoProyectos(data) {

    var html = "";
    for (var i = 0; i < data.estados.length; i++) {
        html = html + '<div class="col-lg-2 mb-4">'
            + '<div class="card h-100 shadow border-0 card-entidad">'
            + '<div class="card-body">'
            + '<div class="desc-data text-center">'
            + '<div class="executeV"><strong>' + data.estados[i].nombre + '</strong></div>'
            + '<div class="organismoN">' + data.estados[i].valor + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
    }
    $("#detalleEstadoProyectosOrganismoFinanciador").empty();
    $("#detalleEstadoProyectosOrganismoFinanciador").html(html);
}
function obtenerEstadoProyecto(inicio, fin, estados) {
    var fichaEstado = '';
    for (var i = inicio; i <= fin; i++) {
        fichaEstado = fichaEstado + '<div class="col-lg-6 mb-3">' +
            '<div class="card h-100 shadow border-0 card-entidad">' +
            '<div class="card-body">' +
            '<div class="wrap-desc-entidad d-flex">' +
            '<div class="ic-wrap">' +
            '<img src="../img/svg-icons/' + estados[i].nombre + '.svg" alt="' + estados[i].nombre+ '" />' +
            '</div>' +
            '<div class="desc-data">' +
            '<div class="organismoN">' + estados[i].valor+'</div>' +
            '<div class="organismoData">' + estados[i].nombre +'</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div >';
    }
    return fichaEstado;
}
function obtenerGraficoTreeMapProyectosFinanciadosPorFinanciadorAnio(anyo, codigoFinanciador) {
    $("#divGraphSectorPorFinanciadorAnio").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosOrganismoFinanciador/ObtenerRecursosGraficoTreeMapSectoresPorCodigoFinanciadorAnio",
        type: "GET",
        data: {
            anyo: anyo,
            codigoFinanciador: codigoFinanciador,
        }
    }).done(function (data) {
        if (data.infoRecursos != null) {
            globales = data.infoRecursos;
            generarGraficoProyectosFinanciadosPorSectores(globales);
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });
}
function generarGraficoProyectosFinanciadosPorSectores(objData) {
    $("#divGraphSectorPorFinanciadorAnio").empty();
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
            .select("#divGraphSectorPorFinanciadorAnio")
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
                data: data_filter,
                groupBy: ["labelGroup"],//, "label"
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

                        }
                        if (cad.length > longitud_tooltip) {
                            cad = cad.substr(0, longitud_tooltip) + "...";
                        }
                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["rawValueDouble"];
                            var cad = "";
                            cad += "<span>Proyectos asociados: " + valor.toString() + "</span></br>";
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
function obtenerProyectosPorFinanciadorAnio(anio, codigoFinanciador) {
    $("#table_proyectos_financiador_annio").empty();
    $("#lst_proyectos_financiador").html("Listados proyectos financiados por este organismo según hacienda año " + anio); 
    $("#divPaginator").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosOrganismoFinanciador/ObtenerProyectosPorCodigoFinanciadorAnio",
        type: "GET",
        data: {
            anio: anio,
            codigoFinanciador: codigoFinanciador
        }
    }).done(function (data) {
        //console.log(data);
        proyectos = data.proyectos;
        generarDivTablaDeProyectos();
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });
}
function generarDivTablaDeProyectos() {
    if (proyectos != null && proyectos.length > 0) {
        inicioData = ((paginaActual - 1) * totalPorPagina);
        finData = (paginaActual * totalPorPagina) - 1;
        proyectosPorPagina = jQuery.grep(proyectos, function (n, i) {
            return (i >= inicioData && i <= finData);
        });
        if (proyectosPorPagina.length > 0) {
            generarDivTablaProyectosPorPagina(proyectosPorPagina);
            dibujarPaginator(paginaActual, proyectos.length);
        }
    }
}
function generarDivTablaProyectosPorPagina(proyectosPorPagina) {
    var divListadoProyectos = ''; 
    proyectosPorPagina.forEach(x => { divListadoProyectos = divListadoProyectos + generarDivProyecto(x); });
    $("#table_proyectos_financiador_annio").html(divListadoProyectos);
}
function generarDivProyecto(proyecto) {
    if (proyecto.id != 0) {
        let divProyecto = '<div class="card-entidades-group">' +
            '<div class="card d-flex">' +
            '<div class="headEnt">' +
            '<div class="data1 mainDataEntidad">' +
            '<span class="td1">' + proyecto.nombre + '</span>' +
            '</div>' +
            '<div class="data1b">' +
            '<span class="labelTit">Monto financiado</span>' +
            '<span class="td1">RD ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(proyecto.vigente) + ' M</span>' +
            '</div>' +
            '<div class="data1b">' +
            '<span class="labelTit">Monto ejecutado</span>' +
            '<span class="td1">RD ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(proyecto.ejecutado) + ' M</span>' +
            '</div>' +
            '<div class="data1b">' +
            '<span class="labelTit">Avance financiero</span>' +
            '<span class="td1">' + proyecto.avanceFinancieroOrganismo + '%</span>' +
            '</div>' +
            '<div class="data1b">' +
            '<span class="labelTit">Estado</span>' +
            '<span class="td1">' + proyecto.estado + '</span>' +
            '</div>' +
            '<div class="btn-action">' +
            '<div class="btnPerfil">' +
            '<a target="_blank" href="../projectprofile/' + proyecto.id + '" class="text-small"><i class="material-icons md-18">arrow_forward</i><br> <span>Ver proyecto</span></a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div >';
        return divProyecto;
    }
    else {
        let divProyecto = '<div class="card-entidades-group">' +
            '<div class="card d-flex">' +
            '<div class="headEnt">' +
            '<div class="data1 mainDataEntidad">' +
            '<span class="td1">' + proyecto.nombre + '</span>' +
            '</div>' +
            '<div class="data1b">' +
            '<span class="labelTit">Monto financiado</span>' +
            '<span class="td1">RD ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(proyecto.vigente) + ' M</span>' +
            '</div>' +
            '<div class="data1b">' +
            '<span class="labelTit">Monto ejecutado</span>' +
            '<span class="td1">RD ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(proyecto.ejecutado) + ' M</span>' +
            '</div>' +
            '<div class="data1b">' +
            '<span class="labelTit">Avance financiero</span>' +
            '<span class="td1">' + proyecto.avanceFinancieroOrganismo + '%</span>' +
            '</div>' +
            '<div class="data1b">' +
            '<span class="labelTit">Estado</span>' +
            '<span class="td1">' + proyecto.estado + '</span>' +
            '</div>' +
            '<div class="btn-action">' +
            '<div class="btnPerfil">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div >';
        return divProyecto;
    }
}
function dibujarPaginator(paginaActual, totalRegistros) {
    var totalPaginas = (totalRegistros > totalPorPagina) ? ((totalRegistros - (totalRegistros % totalPorPagina)) / totalPorPagina) : 1;
    if ((totalRegistros >= totalPorPagina) && ((totalRegistros % totalPorPagina) > 0)) totalPaginas = totalPaginas + 1;
    var paginaActual = parseInt(paginaActual);
    $("#divPaginator").html("");
    var pagEnlace = "";
    var quotient = Math.floor(paginaActual / totalPorPagina);
    var residuo = paginaActual % totalPorPagina;
    var inicio = 1;
    if (residuo == 0) {
        inicio = (paginaActual - totalPorPagina) + 1;
    } else {
        inicio = (quotient * totalPorPagina) + 1;
    }
    var fin = inicio + (totalPaginas - 1);
    if (totalPaginas < totalPorPagina) {
        fin = totalPaginas;
    }
    if (fin > totalPaginas) {
        fin = totalPaginas;
    }
    if (paginaActual > totalPorPagina && totalPaginas >= totalPorPagina) {
        pagEnlace += '<a id="page_left" role="button" class="material-icons md-24" data-page="' + (inicio - totalPorPagina) + '"><span class="">chevron_left</span></a>';
    }
    for (var i = inicio; i <= fin; i++) {
        if (i == paginaActual) {
            pagEnlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
        } else {
            pagEnlace += '<a class="page_left" role="button" data-page="' + i + '">';
            pagEnlace += '<span class="glyphicon"></span>';
            pagEnlace += '<text class="paginacion">' + i + '</text>';
            pagEnlace += '</a>';
        }
    }
    if (paginaActual < totalPaginas) {
        if (fin < totalPaginas) {
            pagEnlace += '<a id="page_right" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
        }
    }
    $("#divPaginator").html(pagEnlace);
    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
        paginaActual = $(this).attr("data-page");
        $("#table_proyectos_financiador_annio").empty();
        inicioData = ((paginaActual - 1) * totalPorPagina);
        finData = (paginaActual * totalPorPagina) - 1;
        var proyectosPorPagina = jQuery.grep(proyectos, function (n, i) {
            return (i >= inicioData && i <= finData);
        });
        if (proyectosPorPagina.length > 0) {
            generarDivTablaProyectosPorPagina(proyectosPorPagina);
            dibujarPaginator(paginaActual, proyectos.length);
        }
    });
}
//Gráfica sankey
function obtenerDatosPerOrganismos(anyo, opcion, tipo) {
    global_tab = "organismo";
    global_sankey = [];
    miga_pan = "";

    $("#sankey_basic").html(loader_proy);
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/ObtDistribucionBySectorFuentes",
        type: "GET",
        data: {
            anyo: anyo,
            opcion: opcion,
            tipo: tipo
        },
        success: function (result) {
            if (result.status == true) {
                var data = result.distribucionItemsByFuente;
                var total_vigente = result.totalPresupuesto;
                var total_ejecutado = result.totalEjecutado;
                if (data.length > 0) {
                    var datos_all = obtMatrizData(data, 3, 3);
                    global_sankey = datos_all;
                    //----------------------------------------------
                    var filterAgrupados = agruparNodos(datos_all);
                    global_agrupado = filterAgrupados;
                    var tipoVista = $('input[name="tipoVistaSankey"]:checked').val();
                    if (tipoVista == "extendida") {
                        global_ini =
                        {
                            "links": global_sankey.links_nivel,
                            "nodes": global_sankey.nodes_nivel,
                            "cant_nodos": global_sankey.cant_nodos_nivel
                        };
                    } else {
                        global_ini =
                        {
                            "links": global_agrupado.links,
                            "nodes": global_agrupado.nodes,
                            "cant_nodos": global_agrupado.cant

                        };
                    }
                    if (total_vigente != null) {
                        if (total_vigente > 0) {
                            var porcentaje = ((total_ejecutado / total_vigente) * 100).toFixed(2);
                        }

                        $("#totalSankeyPerOrganismo").html("$ " + formatMoney(total_vigente / 1, 2, '.', ',').toString() + " Millones");
                        $("#PorcEjecPerOrganismo").html(porcentaje.toString() + "%");
                    }
                    $("#sankey_basic").html("");
                    graphSankey(global_ini);
                    configSelectVistaSankey();
                } else {
                    $("#sankey_basic").html("");
                    $(".wrap_sankey").hide();
                }
            } else {
                alert("Error: " + result.message, function () {
                    $("#sankey_basic").html("");
                    $(".wrap_sankey").hide();
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
function obtMatrizData(data, nivel_inicial, nivel_detalle) {
    var cant_nodos_1 = 0;
    var cant_nodos_2 = 0;
    var cant_nodos_3 = 0;
    var cant_nodos_4 = 0;
    var cant_nodos_all = 0;
    var cant_nodos_nivel = 0;
    var obj_nodos = [];
    var obj_links = [];
    var obj_links_ini = [];
    var obj_nodos_nivel = [];
    var obj_links_nivel = [];
    $.each(data, function (key, value) {
        //NomNivel1
        var test = false;
        var obj_aux = { name: value.nombre };
        var nom_Nivel1 = value.nombre;
        var id_Nivel1 = value.id;
        if (nivel_detalle >= 1) {
            obj_nodos.push(obj_aux);
        }
        if (nivel_inicial >= 1) {
            obj_nodos_nivel.push(obj_aux);
        }
        cant_nodos_1 += 1;
        $.each(value.detalles, function (key, value) {
            //NomNivel2
            var nom_Nivel2 = value.nombre;
            var valor_Nivel2 = (value.presupuesto / 1);
            var id_Nivel2 = value.id;
            test = obj_nodos.some(item => item.name === value.nombre);
            if (test == false) {
                obj_aux = { name: value.nombre, id: value.id };
                if (nivel_detalle >= 2) {
                    obj_nodos.push(obj_aux);
                }

                if (nivel_inicial >= 2) {
                    obj_nodos_nivel.push(obj_aux);
                }
                cant_nodos_2 += 1;
            }
            if (nivel_detalle >= 2) {
                var objIndex = obj_links.findIndex((obj => obj.target == nom_Nivel2 && obj.source == nom_Nivel1));
                if (objIndex > -1) {
                    obj_links[objIndex].value = obj_links[objIndex].value + valor_Nivel2;
                } else {
                    var obj_links_aux = { source: nom_Nivel1, target: nom_Nivel2, value: valor_Nivel2 }
                    obj_links.push(obj_links_aux);
                }
            }
            if (nivel_inicial >= 2) {
                var objIndex_nivel = obj_links_nivel.findIndex((obj => obj.target == nom_Nivel2 && obj.source == nom_Nivel1));
                if (objIndex_nivel > -1) {
                    obj_links_nivel[objIndex_nivel].value = obj_links_ini[objIndex_nivel].value + valor_Nivel2;
                } else {
                    var obj_links_aux_nivel = { source: nom_Nivel1, target: nom_Nivel2, value: valor_Nivel2 }
                    obj_links_nivel.push(obj_links_aux_nivel);
                }
            }
            $.each(value.detalles, function (key, value) {
                //NomNivel3
                var nom_Nivel3 = value.nombre;
                var id_Nivel3 = value.id;
                var valor_Nivel3 = (value.presupuesto / 1);
                test = obj_nodos.some(item => item.name === value.nombre);
                if (test == false) {
                    obj_aux = { name: value.nombre, id: value.id };
                    if (nivel_detalle >= 3) {
                        obj_nodos.push(obj_aux);
                    }
                    if (nivel_inicial >= 3) {
                        obj_nodos_nivel.push(obj_aux);
                    }
                    cant_nodos_3 += 1;
                }
                if (nivel_detalle >= 3) {
                    var objIndex = obj_links.findIndex((obj => obj.target == nom_Nivel3 && obj.source == nom_Nivel2));
                    if (objIndex > -1) {
                        obj_links[objIndex].value = obj_links[objIndex].value + valor_Nivel3;
                    } else {
                        var obj_links_aux = { rama: nom_Nivel1, source: nom_Nivel2, target: nom_Nivel3, value: valor_Nivel3 }
                        obj_links.push(obj_links_aux);
                    }
                }
                if (nivel_inicial >= 3) {
                    var objIndex_nivel = obj_links_nivel.findIndex((obj => obj.target == nom_Nivel3 && obj.source == nom_Nivel2));
                    if (objIndex_nivel > -1) {
                        obj_links_nivel[objIndex_nivel].value = obj_links_nivel[objIndex_nivel].value + valor_Nivel3;
                    } else {
                        var obj_links_aux = { rama: nom_Nivel1, source: nom_Nivel2, target: nom_Nivel3, value: valor_Nivel3 }
                        obj_links_nivel.push(obj_links_aux);
                    }
                }
                $.each(value.detalles, function (key, value) {
                    //NomNivel4 -->Objeto gasto detalle
                    var nom_Nivel4 = value.nombre;
                    var valor_Nivel4 = (value.presupuesto / 1);
                    var id_Nivel4 = value.id;
                    test = obj_nodos.some(item => item.name === value.nombre);
                    if (test == false) {
                        obj_aux = { name: value.nombre, id: value.id };
                        if (nivel_detalle >= 4) {
                            obj_nodos.push(obj_aux);
                        }

                        if (nivel_inicial >= 4) {
                            obj_nodos_nivel.push(obj_aux);

                        }
                        cant_nodos_4 += 1;
                    }
                    if (nivel_detalle >= 4) {
                        var objIndex = obj_links.findIndex((obj => obj.target == nom_Nivel4 && obj.source == nom_Nivel3));
                        if (objIndex > -1) {
                            obj_links[objIndex].value = obj_links[objIndex].value + valor_Nivel4;
                        } else {
                            obj_links_aux = { rama: nom_Nivel2, source: nom_Nivel3, target: nom_Nivel4, value: valor_Nivel4 }
                            obj_links.push(obj_links_aux);
                        }
                    }
                    if (nivel_inicial >= 4) {
                        var objIndex_nivel = obj_links_nivel.findIndex((obj => obj.target == nom_Nivel4 && obj.source == nom_Nivel3));
                        if (objIndex_nivel > -1) {
                            obj_links_nivel[objIndex_nivel].value = obj_links_nivel[objIndex_nivel].value + valor_Nivel4;
                        } else {
                            var obj_links_aux = { rama: nom_Nivel2, source: nom_Nivel3, target: nom_Nivel4, value: valor_Nivel4 }
                            obj_links_nivel.push(obj_links_aux);
                        }
                    }
                });
            });
        });
    });
    cant_nodos_all = cant_nodos_1;
    if (cant_nodos_2 > cant_nodos_all) {
        cant_nodos_all = cant_nodos_2;
    }
    if (cant_nodos_3 > cant_nodos_all) {
        cant_nodos_all = cant_nodos_3;
    }
    if (cant_nodos_4 > cant_nodos_all) {
        cant_nodos_all = cant_nodos_4;
    }
    cant_nodos_nivel = cant_nodos_1;
    if (nivel_inicial >= 2) {
        if (cant_nodos_2 > cant_nodos_nivel) {
            cant_nodos_nivel = cant_nodos_2;
        }
    }
    if (nivel_inicial >= 3) {
        if (cant_nodos_3 > cant_nodos_nivel) {
            cant_nodos_nivel = cant_nodos_3;
        }
    }
    var datos_final =
    {
        "links": obj_links,
        "nodes": obj_nodos,
        "nodes_nivel": obj_nodos_nivel,
        "links_nivel": obj_links_nivel,
        "cant_nodos_all": cant_nodos_all,
        "cant_nodos_nivel": cant_nodos_nivel
    };
    return datos_final;
}
function agruparNodos(objData) {
    var flagAgrupador_n1 = false;
    var flagAgrupador_n2 = false;
    var flagAgrupador_n3 = false;
    var flagAgrupador_n4 = false;
    var valAgrupador_n2 = 0;
    var valAgrupador_n1 = 0;
    var valAgrupador_n3 = 0;
    var valAgrupador_n4 = 0;
    var obj_aux = { "links": [], "nodes": [] };
    var obj_otros_aux = { "links": [], "nodes": [] };
    var obj_otros_n2_aux = { "links": [], "nodes": [] };
    var obj_otros_n3_aux = { "links": [], "nodes": [] };
    var obj_otros_n4_aux = { "links": [], "nodes": [] };
    var cantElemAdd = 0;
    var numAgrupador = 0;
    var cant = 0;
    var cant_aux = 0;
    //---------------------------
    var porc_agrupamiento = 0;
    var etiqueta_nivel_agrupado = "OTROS";
    if (global_tab == "sector") {
        porc_agrupamiento = porc_agrup_sectores;
        etiqueta_nivel_agrupado = etiqueta_nivel_3_sectores;
    } else {
        porc_agrupamiento = porc_agrup_organismos;
        etiqueta_nivel_agrupado = etiqueta_nivel3_organismos;
    }
    var nodeRows = objData.links.sort(function (a, b) {
        var sourceA = a.source.toLowerCase();
        var sourceB = b.source.toLowerCase();
        if (sourceA < sourceB) {
            return -1;
        }
        if (sourceA > sourceB) {
            return 1;
        }
        return 0;
    });
    ///n3-----------------------------------------------------------------------
    if (global_tab == "organismo") {
        var contAgrupados = 0;
        var filtrados_n3 = $.grep(nodeRows, function (obj) {
            return obj.target.split('|')[0] === 'n3';
        });
        const suma_grupo_n3 = groupAndSum(filtrados_n3, ['source'], ['value']).sort((a, b) => Number(a.target) - Number(b.target));
        //----------------------------------------------------------------------
        nodeRows.forEach(function (row) {
            var nivel = row.target.split('|')[0];
            var origen = row.source;
            var destino = row.target;
            var valor = row.value;
            var padre = row.rama;
            var valor_grupo = $.grep(suma_grupo_n3, function (obj) {
                return obj.source === origen;
            });
            var mayorValor = filtrados_n3.reduce(function (max, elemento) {
                if (elemento.source === origen && elemento.value > max) {
                    return elemento.value;
                } else {
                    return max;
                }
            }, -Infinity);
            var porc = 0;
            if (nivel == "n3") {
                if (mayorValor > 0) {
                    //porc = Math.round((valor / valor_grupo[0].value) * 100, 0);
                    porc = Math.round((valor / mayorValor) * 100, 0);
                }
                if (porc >= porc_agrup_organismos) {
                    var obj_links_aux = { rama: padre, source: origen, target: destino, value: valor }
                    obj_aux.links.push(obj_links_aux);
                    var test_origen = obj_aux.nodes.some(item => item.name === origen);
                    if (test_origen == false) {
                        var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                            return obj.name === origen;
                        });
                        obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                        cant_aux += 1;
                    }
                    var test_destino = obj_aux.nodes.some(item => item.name === destino);
                    if (test_destino == false) {
                        var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                            return obj.name === destino;
                        });
                        obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                        cant_aux += 1;
                    }
                } else {
                    ///--------------------------                  
                    flagAgrupador_n3 = true;
                    valAgrupador_n3 += row.value;
                    var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                        return obj.name === destino;
                    });
                    var otros_links_aux = { rama: padre, source: origen, target: destino, value: valor, id: nodo_espejo[0].id }
                    obj_otros_n3_aux.links.push(otros_links_aux);
                }
            } else {
                var obj_links_aux = { rama: padre, source: origen, target: destino, value: valor }
                obj_aux.links.push(obj_links_aux);
                var test_origen = obj_aux.nodes.some(item => item.name === origen);
                if (test_origen == false) {
                    var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                        return obj.name === origen;
                    });
                    obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                    cant_aux += 1;
                }
                var test_destino = obj_aux.nodes.some(item => item.name === destino);
                if (test_destino == false) {
                    var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                        return obj.name === destino;
                    });
                    obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                    cant_aux += 1;
                }
            }
        });
        if (flagAgrupador_n3 == true) {
            const suma_otros_n3 = groupAndSumWithCounts(obj_otros_n3_aux.links, ['source'], ['value']);
            var g1 = 0;
            suma_otros_n3.forEach(function (row) {
                var origen = row.source;
                var destino = row.target;
                var new_destino = "";
                var valor = row.value;
                var conteoGrupo = row.count;
                if (conteoGrupo > 1) {
                    var idsConcatenados = concatenarIds(obj_otros_n3_aux.links, origen);
                    new_destino = "n3|" + etiqueta_nivel_agrupado + "|" + g1;
                    var obj_links_aux = { source: origen, target: new_destino, value: valor }
                    obj_aux.links.push(obj_links_aux);
                    var test_destino = obj_aux.nodes.some(item => item.name === new_destino);
                    if (test_destino == false) {
                        obj_aux.nodes.push({ name: new_destino, id: idsConcatenados });
                        cant_aux += 1;
                    }
                } else {
                    ///1 solo elemento incumple el criterio
                    var link_espejo = $.grep(obj_otros_n3_aux.links, function (obj) {
                        return obj.source === origen;
                    });
                    if (link_espejo.length > 0) {
                        obj_aux.links.push(link_espejo[0]);
                        var test_origen = obj_aux.nodes.some(item => item.name === origen);
                        if (test_origen == false) {
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === origen;
                            });
                            obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                            cant_aux += 1;
                        }
                        var test_destino = obj_aux.nodes.some(item => item.name === link_espejo[0].target);
                        if (test_destino == false) {
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === link_espejo[0].target;
                            });
                            obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                            cant_aux += 1;
                        }
                    }
                }
                g1 += 1;
                //-----------------------------
            })
        }
    } else {
        //tab_sectores
        var filtrados_n4 = $.grep(nodeRows, function (obj) {
            return obj.target.split('|')[0] === 'n4';
        });
        const suma_grupo_n4 = groupAndSum(filtrados_n4, ['source'], ['value']).sort((a, b) => Number(a.target) - Number(b.target));
        //----------------------------------------------------------------------
        nodeRows.forEach(function (row) {
            var nivel = row.target.split('|')[0];
            var origen = row.source;
            var destino = row.target;
            var valor = row.value;
            var valor_grupo = $.grep(suma_grupo_n4, function (obj) {
                return obj.source === origen;
            });
            var mayorValor = filtrados_n4.reduce(function (max, elemento) {
                if (elemento.source === origen && elemento.value > max) {
                    return elemento.value;
                } else {
                    return max;
                }
            }, -Infinity);
            var porc = 0;
            if (nivel == "n4") {
                if (mayorValor > 0) {
                    porc = Math.round((valor / mayorValor) * 100, 0);
                }
                if (porc >= porc_agrup_sectores) {
                    var obj_links_aux = { source: origen, target: destino, value: valor }
                    obj_aux.links.push(obj_links_aux);
                    var test_origen = obj_aux.nodes.some(item => item.name === origen);
                    if (test_origen == false) {
                        var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                            return obj.name === origen;
                        });
                        obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                        cant_aux += 1;
                    }
                    var test_destino = obj_aux.nodes.some(item => item.name === destino);
                    if (test_destino == false) {
                        var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                            return obj.name === destino;
                        });
                        obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                        cant_aux += 1;
                    }
                } else {
                    ///--------------------------
                    flagAgrupador_n4 = true;
                    valAgrupador_n4 += row.value;
                    var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                        return obj.name === destino;
                    });
                    var otros_links_aux = { source: origen, target: destino, value: valor, id: nodo_espejo[0].id }
                    obj_otros_n4_aux.links.push(otros_links_aux);
                }
            } else {
                var obj_links_aux = { source: origen, target: destino, value: valor }
                obj_aux.links.push(obj_links_aux);
                var test_origen = obj_aux.nodes.some(item => item.name === origen);
                if (test_origen == false) {
                    var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                        return obj.name === origen;
                    });
                    obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                    cant_aux += 1;
                }
                var test_destino = obj_aux.nodes.some(item => item.name === destino);
                if (test_destino == false) {
                    var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                        return obj.name === destino;
                    });
                    obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                    cant_aux += 1;
                }
            }
        });
        if (flagAgrupador_n4 == true) {
            const suma_otros_n4 = groupAndSumWithCounts(obj_otros_n4_aux.links, ['source'], ['value']);
            var g1 = 0;
            suma_otros_n4.forEach(function (row) {
                var origen = row.source;
                var destino = row.target;
                var new_destino = "";
                var valor = row.value;
                var conteoGrupo = row.count;
                if (conteoGrupo > 1) {
                    var idsConcatenados = concatenarIds(obj_otros_n4_aux.links, origen);
                    new_destino = "n4|" + etiqueta_nivel_agrupado + "|" + g1;
                    var obj_links_aux = { source: origen, target: new_destino, value: valor }
                    obj_aux.links.push(obj_links_aux);

                    var test_destino = obj_aux.nodes.some(item => item.name === new_destino);
                    if (test_destino == false) {
                        obj_aux.nodes.push({ name: new_destino, id: idsConcatenados });
                        cant_aux += 1;
                    }
                } else {
                    ///1 solo elemento incumple el criterio
                    var link_espejo = $.grep(obj_otros_n4_aux.links, function (obj) {
                        return obj.source === origen;
                    });
                    if (link_espejo.length > 0) {
                        obj_aux.links.push(link_espejo[0]);
                        var test_origen = obj_aux.nodes.some(item => item.name === origen);
                        if (test_origen == false) {
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === origen;
                            });
                            obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                            cant_aux += 1;
                        }
                        var test_destino = obj_aux.nodes.some(item => item.name === link_espejo[0].target);
                        if (test_destino == false) {
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === link_espejo[0].target;
                            });
                            obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                            cant_aux += 1;
                        }
                    }
                }
                g1 += 1;
                //-----------------------------
            })
        }
    }
    var dataNew_agrupados =
    {
        "links": obj_aux.links,
        "nodes": obj_aux.nodes,
        "cant_nodos": cant_aux

    };
    return dataNew_agrupados;
}
function groupAndSum(arr, groupKeys, sumKeys) {
    return Object.values(
        arr.reduce((acc, curr) => {
            const group = groupKeys.map(k => curr[k]).join('-');
            acc[group] = acc[group] || Object.fromEntries(
                groupKeys.map(k => [k, curr[k]]).concat(sumKeys.map(k => [k, 0])));
            sumKeys.forEach(k => acc[group][k] += curr[k]);
            return acc;

        }, {})
    );
}
function groupAndCount(arr, groupKeys) {
    return Object.values(
        arr.reduce((acc, curr) => {
            const group = groupKeys.map(k => curr[k]).join('-');
            acc[group] = acc[group] || Object.fromEntries(
                groupKeys.map(k => [k, curr[k]])); // Quitamos 'count' aquí
            acc[group]['count'] = (acc[group]['count'] || 0) + 1; // Incrementamos 'count' en lugar de asignar 1
            return acc;
        }, {})
    );
}
function groupAndSumWithCounts(arr, groupKeys, sumKeys) {
    return Object.values(
        arr.reduce((acc, curr) => {
            const group = groupKeys.map(k => curr[k]).join('-');
            acc[group] = acc[group] || Object.fromEntries(
                groupKeys.map(k => [k, curr[k]]) // Mantenemos las claves de agrupación sin inicializar en 0
                    .concat(sumKeys.map(k => [k, 0])) // Inicializamos las claves de sumKeys en 0
                    .concat([['count', 0]])); // Añadimos una clave 'count' para contar los elementos por grupo
            sumKeys.forEach(k => acc[group][k] += curr[k]); // Sumamos los valores por grupo
            acc[group]['count']++; // Incrementamos el contador de elementos por grupo
            return acc;
        }, {})
    );
}
function concatenarIds(linksArray, sourceValue) {
    var idsConcatenados = "";
    linksArray.forEach(function (link) {
        if (link.source === sourceValue) {
            if (link.id != undefined && link.id != "") {
                idsConcatenados += link.id + "*";
            }
        }
    });
    idsConcatenados = idsConcatenados.slice(0, -1);
    return idsConcatenados;
}
function configSelectVistaSankey() {
    $('input[name="tipoVistaSankey"]').change(function () {
        getGraficoPerTipoVista();
    });
}
function getGraficoPerTipoVista() {
    var tipoVista = $('input[name="tipoVistaSankey"]:checked').val();
    if (tipoVista == "extendida") {
        global_ini =
        {
            "links": global_sankey.links_nivel,
            "nodes": global_sankey.nodes_nivel,
            "cant_nodos": global_sankey.cant_nodos_nivel

        };
    } else {

        global_ini =
        {
            "links": global_agrupado.links,
            "nodes": global_agrupado.nodes,
            "cant_nodos": global_agrupado.cant

        };
    }
    ///--------cargue de datos
    $("#sankey_basic").html("");
    graphSankey(global_ini);
}
function graphSankey(datos) {
    $("#btnAtras").hide();
    $(".wrap_sankey").show();
    var units = "millones";
    var sizeAux = recalcularSize(datos);
    var margin = sizeAux.margin;
    var width = sizeAux.width;
    var height = sizeAux.height;
    var format = function (d) {
        return "RD $ " + formatMoney(d, 2, '.', ',') + " " + units;
    },
        color = d3.scale.category20();
    // append the svg canvas to the page
    var svg = d3.select("#sankey_basic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    draw(datos);
    // Set the sankey diagram properties
    function draw(obj_info) {
        var link = svg.append("g");
        var nodes = svg.append("g");
        var path;
        var sizeAux = recalcularSize(obj_info);
        var margin = sizeAux.margin;
        var width = sizeAux.width;
        var height = sizeAux.height;
        var sankey = d3.sankey()
            .nodeWidth(30)
            .nodePadding(25)
            .size([width, height]);
        path = sankey.link();
        var graph = obj_info;
        var nodeMap = {};
        graph.nodes.forEach(function (x) {
            nodeMap[x.name] = x;
        });
        graph.links = graph.links.map(function (x) {
            return {
                source: nodeMap[x.source],
                target: nodeMap[x.target],
                value: x.value
            }
        });
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);
        sankey.relayout();
        // add in the links
        link.selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .transition().duration(750)
            .attr("d", path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })

        // add the link titles
        link.selectAll(".link").append("title")
            .text(function (d) {
                var vec_origen = d.source.name.split("|");
                var vec_destino = d.target.name.split("|");
                var origen = d.source.name;
                var destino = d.target.name;
                if (vec_origen.length > 0) {
                    origen = vec_origen[1];
                }
                if (vec_destino.length > 0) {
                    destino = vec_destino[1];
                }
                var cadena_aux = origen + " --> " + destino + "\n" + format(d.value);
                return cadena_aux;
            });
        sankey.relayout();
        // add in the nodes
        var node = nodes.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", function (d) {
                var prueba = d;
                if (d3.event.defaultPrevented) return;
                var selection = d.name;
                var vecSelect = d.name.split("|");
                var vec_Origen = d.targetLinks;
                if (vecSelect[0] == "n1") {
                    var filteredData = $.grep(global_sankey.links, function (element) {
                        return element.source === selection;
                    });
                    if (filteredData.length > 0) {
                        update(d);
                    }
                } else if (vecSelect[0] == "n3") {
                    if (global_tab == "organismo") {
                        //proyectos de inversion--navega hacia el perfil de proy
                        var idProy = d.id;

                        if (idProy != undefined) {
                            if (idProy != "") {
                                var vecProy = idProy.split("*");
                                if (vecProy.length > 1) {
                                    var idProyBuscador = idProy.replace(/\*/g, ',');
                                    var enlace_url = "../../BusquedaResultados?Id=" + idProyBuscador;
                                    window.open(enlace_url, "_blank");
                                } else {
                                    var enlace_url = "../../perfilProyecto/" + idProy;
                                    window.open(enlace_url, "_blank");
                                }
                            }
                        }
                    } else {
                        var filteredData = $.grep(global_sankey.links, function (element) {
                            return element.source === selection;
                        });
                        if (filteredData.length > 0) {
                            update(d);
                        }
                    }
                } else if (vecSelect[0] == "n4") {
                    if (global_tab == "sector") {
                        //proyectos de inversion--navega hacia el perfil
                        var idProy = d.id;
                        if (idProy != undefined) {
                            if (idProy != "") {
                                var vecProy = idProy.split("*");
                                if (vecProy.length > 1) {
                                    var idProyBuscador = idProy.replace(/\*/g, ',');
                                    var enlace_url = "../../BusquedaResultados?Id=" + idProyBuscador;
                                    window.open(enlace_url, "_blank");
                                } else {
                                    var enlace_url = "../../perfilProyecto/" + idProy;
                                    window.open(enlace_url, "_blank");
                                }
                            }
                        }
                    } else {
                        var idProy = d.id;

                        var filteredData = $.grep(global_sankey.links, function (element) {
                            return element.source === selection;
                        });
                        if (filteredData.length > 0) {
                            update(d);
                        }
                    }

                } else {

                    var filteredData = $.grep(global_sankey.links, function (element) {
                        return element.source === selection;
                    });
                    if (filteredData.length > 0) {
                        update(d);
                    }
                }
            })
        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) {

                if (d.dy < 3) {
                    return 3;
                } else {
                    return d.dy;
                }
            })
            .attr("width", function (d) {
                return sankey.nodeWidth();
            })
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);

            })
            .append("title")
            .text(function (d) {
                vec_nodo = d.name.split("|");
                var texto_nodo = d.name;
                if (vec_nodo.length > 0) {
                    texto_nodo = vec_nodo[1];
                }
                return texto_nodo + "\n" + format(d.value);
            });

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; })
            .attr("dy", ".2em")
            .style("font-size", "10px")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .html(function (d) {
                var x = d3.select(this).attr("x");
                var y = d3.select(this).attr("dy");
                var longitud = 60;
                vec_nodo = d.name.split("|");
                var texto_nodo = d.name;
                if (vec_nodo.length > 0) {
                    var cad_aux = vec_nodo[1];
                    var tipo = vec_nodo[0];
                    var new_cad = "";
                    if (cad_aux.length > longitud) {
                        new_cad = cad_aux.substring(0, longitud) + "...";
                    } else {
                        new_cad = cad_aux;
                    }
                }
                var t = "<tspan>" + new_cad + "</tspan>";
                return new_cad;
            })
            .filter(function (d) { return d.x < width / 4; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");
        sankey.relayout();
    }
    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this).attr("transform",
            "translate(" + (
                d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
            ) + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
        sankey.relayout();
        link.attr("d", path);
    }

    function obtenerHijosYnietosConMismaRama(source, data, nivel) {
        var resultado = [];
        // Función recursiva para obtener los hijos y nietos del nodo source
        function obtenerHijosYnietosRecursivo(nodo) {
            var hijos = data.filter(function (item) {
                var vecOrigen = item.source.split("|");
                if (vecOrigen.length > 0) {
                    if (vecOrigen[0] != "n1") {
                        return item.source === nodo.target && item.rama === source; // Filtrar por mismo valor de rama
                    } else {
                        return item.source === nodo.target
                    }
                }
            });
            hijos.forEach(function (hijo) {
                // Agregar el hijo actual al resultado
                resultado.push(hijo);
                if (!hijo.target.startsWith(nivel)) {
                    // Llamar recursivamente para obtener los nietos del hijo actual
                    obtenerHijosYnietosRecursivo(hijo);
                }
            });
        }
        // Buscar los hijos y nietos del nodo source
        obtenerHijosYnietosRecursivo({ target: source, rama: source.rama }); // Pasar el valor de rama del nodo inicial
        return resultado;
    }

    function obtenerHijosYnietos(source, data, nivel) {
        var filtrados = data.filter(function (item) {
            return item.source === source;
        });
        var resultado = [];
        filtrados.forEach(function (filtrado) {
            resultado.push(filtrado);
            if (!filtrado.target.startsWith(nivel)) {
                resultado = resultado.concat(obtenerHijosYnietos(filtrado.target, data, nivel));
            }
        });
        return resultado;
    }

    function update(d) {
        //miga_pan = "";
        var numAgrupador = 5;
        var cantElemAdd = 0;
        var flagAgrupador = false;
        var flagAgrupador_n3 = false;
        var flagAgrupador_n4 = false;
        var valAgrupador = 0;
        var valAgrupador_n3 = 0;
        var valAgrupador_n4 = 0;
        var selection = d.name;
        var vecSelect = selection.split("|");
        var cant_padres = d.targetLinks.length;
        var cant_hijos = d.sourceLinks.length;
        var cant = global_ini.cant_nodos;
        var cant_aux = 0;
        var opcion = 3;
        //------------------------------------------------
        var obj_otros_n3_aux = { "links": [], "nodes": [] };
        var obj_otros_n4_aux = { "links": [], "nodes": [] };
        var porc_agrupamiento = 0;
        var etiqueta_nivel_agrupado = "OTROS";
        if (global_tab == "sector") {
            porc_agrupamiento = porc_agrup_sectores;
            etiqueta_nivel_agrupado = etiqueta_nivel_3_sectores;
        } else {
            porc_agrupamiento = porc_agrup_organismos;
            etiqueta_nivel_agrupado = etiqueta_nivel3_organismos;
        }
        //-----------------------------------------------

        if (selection != null && selection != "") {
            var obj_aux = { "links": [], "nodes": [] };
            var test_miga = miga_pan.includes(selection);
            if (test_miga == false) {
                miga_pan += selection + "*";
            }

            const regex = /\*+$/g;
            const result = miga_pan.replace(regex, '');
            if (opcion == 3) {
                cant = 0;


                if (vecSelect[0] == "n1") {
                    var filteredData = obtenerHijosYnietosConMismaRama(selection, global_sankey.links, "n4|");
                    filteredData.forEach(function (row) {
                        var nivel = row.target.split('|')[0];
                        var origen = row.source;
                        var destino = row.target;
                        var valor = row.value;
                        var obj_links_aux = { source: origen, target: destino, value: valor }
                        obj_aux.links.push(obj_links_aux);
                        var test_origen = obj_aux.nodes.some(item => item.name === origen);
                        if (test_origen == false) {
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === origen;
                            });
                            obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                            cant_aux += 1;
                        }
                        var test_destino = obj_aux.nodes.some(item => item.name === destino);
                        if (test_destino == false) {
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === destino;
                            });
                            obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                            cant_aux += 1;
                        }
                    });

                } else if (vecSelect[0] == "n3") {
                    //ultimo nivel
                    var vecMiga = result.split("*");
                    if (vecMiga.length > 0) {
                        vecMiga.forEach(function (item) {
                            var obj_miga = item;
                            if (obj_miga.split("|")[0] == "n2") {
                                var filteredData = $.grep(global_sankey.links, function (element) {
                                    return element.target === selection && element.source === item;
                                });
                                if (global_tab == "organismo") {
                                    //va a proyectos
                                    const suma_grupo_n3 = groupAndSum(filteredData, ['source'], ['value']).sort((a, b) => Number(a.target) - Number(b.target));
                                    //----------------------------------------------------------------------
                                    filteredData.forEach(function (row) {
                                        var nivel = row.target.split('|')[0];
                                        var origen = row.source;
                                        var destino = row.target;
                                        var valor = row.value;
                                        var valor_grupo = $.grep(suma_grupo_n3, function (obj) {
                                            return obj.source === origen;
                                        });
                                        var mayorValor = filteredData.reduce(function (max, elemento) {
                                            if (elemento.source === origen && elemento.value > max) {
                                                return elemento.value;
                                            } else {
                                                return max;
                                            }
                                        }, -Infinity);
                                        var porc = 0;
                                        if (mayorValor > 0) {

                                            porc = Math.round((valor / mayorValor) * 100, 0);
                                        }
                                        if (porc >= porc_agrup_organismos) {
                                            var obj_links_aux = { source: origen, target: destino, value: valor }
                                            obj_aux.links.push(obj_links_aux);
                                            var test_origen = obj_aux.nodes.some(item => item.name === origen);
                                            if (test_origen == false) {
                                                var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                    return obj.name === origen;
                                                });
                                                obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                                                cant_aux += 1;
                                            }
                                            var test_destino = obj_aux.nodes.some(item => item.name === destino);
                                            if (test_destino == false) {
                                                var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                    return obj.name === destino;
                                                });
                                                obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                                                cant_aux += 1;
                                            }
                                        } else {
                                            ///--------------------------
                                            flagAgrupador_n3 = true;
                                            valAgrupador_n3 += row.value;
                                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                return obj.name === destino;
                                            });
                                            var otros_links_aux = { source: origen, target: destino, value: valor, id: nodo_espejo[0].id }
                                            obj_otros_n3_aux.links.push(otros_links_aux);
                                        }
                                    });
                                    if (flagAgrupador_n3 == true) {
                                        const suma_otros_n3 = groupAndSumWithCounts(obj_otros_n3_aux.links, ['source'], ['value']);
                                        var g1 = 0;
                                        suma_otros_n3.forEach(function (row) {
                                            var origen = row.source;
                                            var destino = row.target;
                                            var new_destino = "";
                                            var valor = row.value;
                                            var conteoGrupo = row.count;
                                            if (conteoGrupo > 1) {
                                                var idsConcatenados = concatenarIds(obj_otros_n3_aux.links, origen);
                                                new_destino = "n3|" + etiqueta_nivel_agrupado + "|" + g1;
                                                var obj_links_aux = { source: origen, target: new_destino, value: valor }
                                                obj_aux.links.push(obj_links_aux);
                                                var test_destino = obj_aux.nodes.some(item => item.name === new_destino);
                                                if (test_destino == false) {
                                                    obj_aux.nodes.push({ name: new_destino, id: idsConcatenados });
                                                    cant_aux += 1;
                                                }
                                            } else {
                                                ///1 solo elemento incumple el criterio
                                                var link_espejo = $.grep(obj_otros_n3_aux.links, function (obj) {
                                                    return obj.source === origen;
                                                });
                                                if (link_espejo.length > 0) {
                                                    obj_aux.links.push(link_espejo[0]);
                                                    var test_origen = obj_aux.nodes.some(item => item.name === origen);
                                                    if (test_origen == false) {
                                                        var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                            return obj.name === origen;
                                                        });
                                                        obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                                                        cant_aux += 1;
                                                    }
                                                    var test_destino = obj_aux.nodes.some(item => item.name === link_espejo[0].target);
                                                    if (test_destino == false) {
                                                        var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                            return obj.name === link_espejo[0].target;
                                                        });
                                                        obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                                                        cant_aux += 1;
                                                    }
                                                }
                                            }
                                            g1 += 1;
                                            //-----------------------------
                                        })
                                    }
                                }
                            } else {
                                //clic en 3 nivel directamente sin haber pasado antes x nivel 2 --> va a detalle de 4 nivel
                                var nodeRows = global_sankey.links.filter(a => a.source == selection);
                                const suma_grupo_n4 = groupAndSum(nodeRows, ['source'], ['value']).sort((a, b) => Number(a.target) - Number(b.target));
                                //----------------------------------------------------------------------
                                nodeRows.forEach(function (row) {
                                    var nivel_destino = row.target.split('|')[0];
                                    var origen = row.source;
                                    var destino = row.target;
                                    var valor = row.value;
                                    var valor_grupo = $.grep(suma_grupo_n4, function (obj) {
                                        return obj.source === origen;
                                    });
                                    var mayorValor = nodeRows.reduce(function (max, elemento) {
                                        if (elemento.source === origen && elemento.value > max) {
                                            return elemento.value;
                                        } else {
                                            return max;
                                        }
                                    }, -Infinity);
                                    var porc = 0;
                                    if (nivel_destino == "n4") {
                                        //proyectos de inversion
                                        if (mayorValor > 0) {

                                            porc = Math.round((valor / mayorValor) * 100, 0);
                                        }
                                        if (porc >= porc_agrup_sectores) {
                                            var obj_links_aux = { source: origen, target: destino, value: valor }
                                            obj_aux.links.push(obj_links_aux);
                                            var test_origen = obj_aux.nodes.some(item => item.name === origen);
                                            if (test_origen == false) {
                                                var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                    return obj.name === origen;
                                                });
                                                obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                                                cant_aux += 1;
                                            }
                                            var test_destino = obj_aux.nodes.some(item => item.name === destino);
                                            if (test_destino == false) {
                                                var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                    return obj.name === destino;
                                                });
                                                obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                                                cant_aux += 1;
                                            }
                                        } else {
                                            ///--------------------------
                                            flagAgrupador_n4 = true;
                                            valAgrupador_n4 += row.value;
                                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                return obj.name === destino;
                                            });
                                            var otros_links_aux = { source: origen, target: destino, value: valor, id: nodo_espejo[0].id }
                                            obj_otros_n4_aux.links.push(otros_links_aux);
                                        }
                                    }
                                });
                                if (flagAgrupador_n4 == true) {
                                    const suma_otros_n4 = groupAndSumWithCounts(obj_otros_n4_aux.links, ['source'], ['value']);
                                    var g1 = 0;
                                    suma_otros_n4.forEach(function (row) {
                                        var origen = row.source;
                                        var destino = row.target;
                                        var new_destino = "";
                                        var valor = row.value;
                                        var conteoGrupo = row.count;
                                        if (conteoGrupo > 1) {
                                            var idsConcatenados = concatenarIds(obj_otros_n4_aux.links, origen);
                                            new_destino = "n4|" + etiqueta_nivel_agrupado + "|" + g1;
                                            var obj_links_aux = { source: origen, target: new_destino, value: valor }
                                            obj_aux.links.push(obj_links_aux);
                                            var test_destino = obj_aux.nodes.some(item => item.name === new_destino);
                                            if (test_destino == false) {
                                                obj_aux.nodes.push({ name: new_destino, id: idsConcatenados });
                                                cant_aux += 1;
                                            }
                                        } else {
                                            ///1 solo elemento incumple el criterio
                                            var link_espejo = $.grep(obj_otros_n4_aux.links, function (obj) {
                                                return obj.source === origen;
                                            });
                                            if (link_espejo.length > 0) {
                                                obj_aux.links.push(link_espejo[0]);
                                                var test_origen = obj_aux.nodes.some(item => item.name === origen);
                                                if (test_origen == false) {
                                                    var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                        return obj.name === origen;
                                                    });
                                                    obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                                                    cant_aux += 1;
                                                }
                                                var test_destino = obj_aux.nodes.some(item => item.name === link_espejo[0].target);
                                                if (test_destino == false) {
                                                    var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                                        return obj.name === link_espejo[0].target;
                                                    });
                                                    obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                                                    cant_aux += 1;
                                                }
                                            }
                                        }
                                        g1 += 1;
                                        //-----------------------------
                                    })
                                }
                            }
                        })
                    }
                } else if (vecSelect[0] != "n4") {
                    var nodeRows = [];
                    var vecMiga = result.split("*");
                    if (vecMiga.length > 1) {
                        nodeRows = $.grep(global_sankey.links, function (element) {
                            return element.rama === vecMiga[0] && element.source === selection;
                        });
                    } else {
                        nodeRows = $.grep(global_sankey.links, function (element) {
                            return element.source === selection;
                        });
                    }
                    if (nodeRows.length > 0) {
                        nodeRows.forEach(function (row) {
                            var origen = row.source;
                            var destino = row.target;
                            var valor = row.value;
                            var test_links = obj_aux.links.some(item => item.source === origen && item.target === destino);
                            if (test_links == false) {
                                var obj_links_aux = { source: origen, target: destino, value: valor }
                                obj_aux.links.push(obj_links_aux);
                            }
                            var test_origen = obj_aux.nodes.some(item => item.name === origen);
                            if (test_origen == false) {
                                var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                    return obj.name === origen;
                                });
                                obj_aux.nodes.push({ name: origen, id: nodo_espejo[0].id });
                                cant_aux += 1;
                            }
                            var test_destino = obj_aux.nodes.some(item => item.name === destino);
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === destino;
                            });
                            if (test_destino == false) {
                                obj_aux.nodes.push({ name: destino, id: nodo_espejo[0].id });
                                cant_aux += 1;
                            }
                        });
                    }
                } else {
                    var filteredData = obtenerHijosYnietosConMismaRama(selection, global_sankey.links, "n3|");
                    filteredData.forEach(function (row) {
                        var nivel = row.target.split('|')[0];
                        var origen = row.source;
                        var destino = row.target;
                        var valor = row.value;
                        var obj_links_aux = { source: origen, target: destino, value: valor }
                        obj_aux.links.push(obj_links_aux);
                        var test_origen = obj_aux.nodes.some(item => item.name === origen);
                        if (test_origen == false) {
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === origen;
                            });
                            obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                            cant_aux += 1;
                        }
                        var test_destino = obj_aux.nodes.some(item => item.name === destino);
                        if (test_destino == false) {
                            var nodo_espejo = $.grep(global_sankey.nodes, function (obj) {
                                return obj.name === destino;
                            });
                            obj_aux.nodes.push({ name: nodo_espejo[0].name, id: nodo_espejo[0].id });
                            cant_aux += 1;
                        }
                    });
                }
                if (cant_aux > cant) {
                    cant = cant_aux;
                }
                var dataNew =
                {
                    "links": obj_aux.links,
                    "nodes": obj_aux.nodes,
                    "cant_nodos": cant
                };
                global_ini = dataNew;
                $("#sankey_basic").empty();
                graphSankey(dataNew);
                $("#btnAtras").click(function () {
                    $("#sankey_basic").empty();
                    miga_pan = "";
                    getGraficoPerTipoVista();
                })
                $("#btnAtras").show();
            } else {
                if (cant_hijos == 0) {
                    var nodeRows = global_sankey.links.filter(a => a.source == selection);
                    if (nodeRows.length > 0) {
                        var obj_aux = { "links": [], "nodes": [] };
                        obj_aux =
                        {
                            "links": global_sankey.links_nivel,
                            "nodes": global_sankey.nodes_nivel,

                        };
                        nodeRows.forEach(function (row) {
                            var origen = row.source;
                            var destino = row.target;
                            var valor = row.value;
                            var obj_links_aux = { source: origen, target: destino, value: valor }
                            obj_aux.links.push(obj_links_aux);
                            var test_origen = obj_aux.nodes.some(item => item.name === origen);
                            if (test_origen == false) {
                                obj_aux.nodes.push({ name: origen });
                                cant_aux += 1;
                            }
                            var test_destino = obj_aux.nodes.some(item => item.name === destino);
                            if (test_destino == false) {
                                obj_aux.nodes.push({ name: destino });
                                cant_aux += 1;
                            }
                        });
                        if (cant_aux > cant) {
                            cant = cant_aux;
                        }
                        var dataNew =
                        {
                            "links": obj_aux.links,
                            "nodes": obj_aux.nodes,
                            "cant_nodos": cant

                        };
                        global_ini = dataNew;
                        $("#sankey_basic").empty();
                        graphSankey(dataNew);
                    }
                }
                else {
                    miga_pan = "";
                    $("#sankey_basic").empty();
                    var obj_aux =
                    {
                        "links": global_sankey.links_nivel,
                        "nodes": global_sankey.nodes_nivel,
                        "cant_nodos": cant
                    };
                    graphSankey(obj_aux);
                }
            }
        }
    }
    //------------------------------------
}
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
function recalcularSize(datos) {
    var height_aux = 0;
    var width_aux = 1050;
    var units = "millones";
    var cant_elementos = 8;
    var factor_multiplicador = 25;
    if (datos != undefined && datos != null) {
        var cant_aux = datos.cant_nodos;
        if (cant_aux != undefined) {
            if (parseInt(cant_aux) < cant_elementos) {
                factor_multiplicador = 20;
            } else {
                cant_elementos = cant_aux;
            }
        } else {
            cant_elementos = (datos.nodes.length / 1);
        }
    }
    let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;
    if ($(window).innerWidth() <= width || isMobile) {
        width_aux = 1050;
    } else {
        width_aux = $(".container").innerWidth();
    }
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = width_aux - 20 - margin.left - margin.right,
        height = ((cant_elementos) * factor_multiplicador) - margin.top - margin.bottom;
    return alturas = { "margin": margin, width: width, height: height };
}


