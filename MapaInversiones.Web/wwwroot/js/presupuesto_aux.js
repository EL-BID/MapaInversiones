var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
var porc_agrup_organismos = 50;
var etiqueta_nivel3_organismos = "OTROS PROYECTOS";
var porc_agrup_sectores = 30;
var etiqueta_nivel_3_sectores = "OTROS PROYECTOS";

//Treemap primera grafica Distribucion del presupuesto
var globales = [];
var globales_gasto = [];
var globales_entidad = [];
var globales_proy = [];
var grafica = null;
var longitud_tooltip = 120;
var global_vigente = 0;
//---sankey------------
var global_sankey = [];
var global_agrupado = [];
var global_otros = [];
var global_ini = [];
var miga_pan = "";
$("#btnAtras").hide();
var global_tab = "";
//----------------------

var cantXPagina = 6;
var anyo_actual = $("#annioPresupuesto option:selected").val();
var idSector = $("#IdSector").val();

///-----------------------------------------------
inicializaDatos();
configuraSelectPeriodo();
//-------------------------------------------------

GetRecursosPorFinalidad(anyo_actual);
//-------------------------------------------------
ObtenerSectoresPeriodo(anyo_actual);
ObtenerOrganismosPeriodo(anyo_actual);
configuraSelectDesglose();
//--------------------------------------------------
ObtenerEntidadesPeriodo(anyo_actual);
GetGastoEntidadesGraphic();
GetGastoEntidadesTiempoGraphic();
//--------------------------------------------------
function inicializaDatos() {

    anyo_actual = $("#annioPresupuesto option:selected").val()
    $("#annioPresupuestoText").html(anyo_actual);
    getConsolidadoPeriodosNew(anyo_actual);

}

function configuraSelectPeriodo() {
    $('#annioPresupuesto').on('change', function () {
        //globales_proy = [];
        //globales_entidad = [];

        anyo_actual = this.value;
        $("#annioPresupuestoText").html("" + anyo_actual);
         //------------------------------------------------
        getConsolidadoPeriodosNew(anyo_actual);
        GetRecursosPorFinalidad(anyo_actual);
        ObtenerSectoresPeriodo(anyo_actual);
        ObtenerOrganismosPeriodo(anyo_actual);
        ObtenerEntidadesPeriodo(anyo_actual);
        GetGastoEntidadesGraphic();
        GetGastoEntidadesTiempoGraphic();

        if (global_tab == "") {
            $(".enlace_tab").first().click();
        } else {
            if (global_tab == "sector") {
                $(".enlace_tab").first().click();
            } else {
                $(".enlace_tab").eq(1).click();
            }
        }
        
        
        /*getSectoresXFuenteIni(anyo_actual);*/
        
    })

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
    $("#sankey_basic").empty();
    graphSankey(global_ini);


}


function configSelectVistaSankey() {
    $('input[name="tipoVistaSankey"]').change(function () {
        //$("#btnAtras").hide();
        getGraficoPerTipoVista();
    });

}

function configuraSelectDesglose() {
    $('.enlace_tab').on('click', function () {
        //globales_proy = [];
        //globales_entidad = [];

        $('.enlace_tab').each(function (i, obj) {
            $(obj).removeClass("active");
        });

        $(this).addClass("active");
        var id = this.id;
        if (id == "tab_perSector") {
           
            $("#divPerOrganismoTab").hide();
            $("#ProyectosListado").hide();
            $("#divPerSectorTab").show();
            $("#divProyectosPerOrganismo").hide();
            //$("#Instituciones").show();
            getSectoresXFuenteIni();
            

        } else {
            ///xOrganismo
            
            $("#divPerOrganismoTab").show();
            $("#divPerSectorTab").hide();
            $("#divInstitucionesPerSector").hide();
           
            $("#divProyectosPerOrganismo").show();
            //$("#Instituciones").hide();
            getOrganismosXFuenteIni();
        }
    });
}

function configuraSankeyTipoVista() {
    $('#sankeyBtnCompacta').on('click', function () {
        var data = global_ini;
        $("#sankey_basic").html("");
        graphSankey(global_ini);
    });

    $('#sankeyBtnExtendida').on('click', function () {

    });

}

function configuraSelectSectorSankey() {

    $('#filter_sector_sankey').on('change', function () {
        var base_sel = $('#filter_sector_sankey option:selected').attr("value");
        //sankey fuentes
        ObtenerDatosPerSectores(anyo_actual, base_sel, "sector");
        //-------------------------------------
    });

}


function configuraSelectOrganismoSankey() {

    $('#filter_organismo_sankey').on('change', function () {
        var base_sel = $('#filter_organismo_sankey option:selected').attr("value");
        //sankey fuentes

        ObtenerDatosPerOrganismos(anyo_actual, base_sel, "organismo");
        //-------------------------------------
    });

}


function getConsolidadoPeriodosNew(anyo_actual) {
    $("#divDatosConsolidado").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/GetConsolidadoPeriodos",
        type: "GET",
        data: {
            anyo: anyo_actual
        }
    }).done(function (data) {
        var result = data.infoConsolidado;
        var str_cad = "";
        if (result != null) {
             getStrBarrasPerPeriodo(result, anyo_actual);
        } else {

            $("#divDatosConsolidado").html("<span class='lblErrorNoData'>Información No Disponible</span>");
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function getStrBarrasPerPeriodo(result, anyo_actual) {
    var total_aprobado = 0;
    var total_ejecutado = 0;
    var total_vigente = 0;
   
    if (result != null) {
            total_aprobado += result.aprobado / 1000000;
            total_ejecutado += result.ejecutado / 1000000;
            total_vigente += result.vigente / 1000000;

        global_vigente = total_vigente;
        $("#lblValorAprobado").text("RD$ " + formatMoney(total_aprobado, 0, '.', ',').toString() + " M");
        $("#lblValorEjecutado").text("RD$ " + formatMoney(total_ejecutado, 0, '.', ',').toString() + " M");
        $("#lblValorVigente").text("RD$ " + formatMoney(total_vigente, 0, '.', ',').toString() + " M");
       

    }

}

function GetRecursosPorFinalidad(anyo) {
    $("#divGraphPerFuncion").empty();
    //finalidad_per_funcion(sector)
        $.ajax({
            contentType: "application/json; charset=utf-8",
            url: "api/ServiciosPresupuestoNew/GetRecursosPerFinalidad",
            type: "GET",
            data: {
                anyo: anyo
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
                //threshold: limitePorc,
                data: data_filter,
                groupBy: ["labelGroup","label"],
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
                            cad += "<span>Presupuesto Vigente " + "RD$ " + formatMoney(valor,0, '.', ',').toString() + " Millones" + "</span></br>";
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

function ObtenerSectoresPeriodo(anyo_actual) {

    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/ObtenerSectoresPerNombre",
        type: "GET",
        data: {
            anyo: anyo_actual
        }
    }).done(function (data) {
        var result = data.sectores;
        var str_cad = "";
        var cad_sector = "";
        if (result != null) {
            var cant_sectores = result.length;
            var maximo = 5;
            if (result.length > 0) {

                for (var i = 0; i < result.length; i++) {

                    cad_sector += '<option value="' + result[i].idSector + '">' + result[i].label + '</option>';
                }

                $("#filter_sector_sankey").html(cad_sector);
                configuraSelectSectorSankey();
                if (global_tab == "sector" || global_tab=="") {
                    getSectoresXFuenteIni(anyo_actual);
                }
                //getSectoresXFuenteIni(anyo_actual);



            }
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function getSectoresXFuenteIni() {
    var val_Sel ="";
    if ($("#filter_sector_sankey").children.length > 0) {
        if (idSector != null && idSector != undefined && idSector != "") {
            val_Sel = idSector;

            const optionsArray = Array.from(document.getElementById("filter_sector_sankey").options);
            const index = optionsArray.findIndex(option => option.value === val_Sel);
            $('#filter_sector_sankey option:eq(' + index + ')').attr("selected", "selected");
            $("#filter_sector_sankey").val(val_Sel);

        } else {
            val_Sel = $("#filter_sector_sankey option:eq(0)").attr("value");
            $("#filter_sector_sankey option:eq(0)").attr("selected", "selected");
            $("#filter_sector_sankey").val(val_Sel);
       }
        
        if (val_Sel != null) {
            
            ObtenerDatosPerSectores(anyo_actual, val_Sel,"sector");

        }

    }
}




function ObtenerOrganismosPeriodo(anyo_actual) {

    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/ObtenerOrganismosPerNombre",
        type: "GET",
        data: {
            anyo: anyo_actual
        }
    }).done(function (data) {
        var result = data.organismos;
        var str_cad = "";
        var cad_aux = "";
        if (result != null) {
            var organismos = result;
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    cad_aux += '<option value="' + result[i].id + '">' + result[i].name + '</option>';
                }

                $("#filter_organismo_sankey").html(cad_aux);

                configuraSelectOrganismoSankey();
                if (global_tab == "organismo") {
                    getOrganismosXFuenteIni(anyo_actual);
                }
                //getOrganismosXFuenteIni(anyo_actual);



            }
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function getOrganismosXFuenteIni() {
    if ($("#filter_organismo_sankey").children.length > 0) {
        var base_sel = $("#filter_organismo_sankey option:eq(0)").attr("value");
        if (base_sel != null) {
            $("#filter_organismo_sankey option:eq(0)").attr("selected", "selected");
            $("#filter_organismo_sankey").val(base_sel);
            ObtenerDatosPerOrganismos(anyo_actual, base_sel, "organismo");

        }

    }
}

function ObtenerDatosPerOrganismos(anyo, opcion, tipo) {
    global_tab = "organismo";
    global_sankey = [];
    
    miga_pan = "";
    $("#divPagFichas").html("");
    $("#divListado_proy").empty();
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

                        $("#totalSankeyPerOrganismo").html("RD$ " + formatMoney(total_vigente / 1, 2, '.', ',').toString() + " Millones");
                        $("#PorcEjecPerOrganismo").html(porcentaje.toString() + "%");
                    }
                    $("#sankey_basic").html("");
                    graphSankey(global_ini);
                    configSelectVistaSankey();
                    ObtenerDatosListadoPerProyectos(anyo_actual);
                    //ObtenerDatosListadoPerEntidad(anyo_actual, "organismo");

                } else {
                    $("#sankey_basic").html("");
                    $("#divInstitucionesPerSector").hide();
                    $(".wrap_sankey").hide();
                }

            } else {
                alert("Error: " + result.message, function () {
                    $("#sankey_basic").html("");
                    $("#divInstitucionesPerSector").hide();
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

    

    var nodeRows=objData.links.sort(function (a, b) {
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
                    var otros_links_aux = {rama:padre, source: origen, target: destino, value: valor, id: nodo_espejo[0].id }
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
                    //porc = Math.round((valor / valor_grupo[0].value) * 100, 0);
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

function concatenarIds(linksArray, sourceValue) {
    var idsConcatenados = "";
    linksArray.forEach(function (link) {
        if (link.source === sourceValue) {
            if (link.id != undefined && link.id!="") {
                idsConcatenados += link.id + "*";
            }
        }
    });

    idsConcatenados = idsConcatenados.slice(0, -1);
    return idsConcatenados;
}

function graphSankey(datos) {

    d3.select("#sankey_basic").selectAll("*").remove();

    $("#btnAtras").hide();
    $(".wrap_sankey").show();
    var units = "millones";

    var sizeAux = recalcularSize(datos);
    var margin = sizeAux.margin;
    var width = sizeAux.width;
    var height = sizeAux.height;

    var format = function (d) {
        return "RD $ " + formatMoney(d,2, '.', ',') + " " + units;
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
        
        // FILTRAR LINKS CON VALOR <= 0
        graph.links = graph.links
            .filter(function (x) {
                var val = parseFloat(x.value);
                // Solo mantener links con valor válido y mayor a 0
                return val && !isNaN(val) && val > 0;
            })
            .map(function (x) {
                return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: parseFloat(x.value)
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
        //.sort(function (a, b) { return b.dy - a.dy; });

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
        //.call(d3.behavior.drag()
        //    .origin(function (d) { return d; })
        //    .on("drag", dragmove)
        //)

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
                        //var regex = new RegExp('.{1,40}', 'g');
                        //var subStrings = cad_aux.match(regex);
                        //subStrings.forEach(function (item) {
                        //    //new_cad += item + "< /br>";
                        //    new_cad += "<tspan>" + item + "</tspan>"
                        //});
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

        //node.transition().duration(1750);
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

    function obtenerHijosYnietosConMismaRama(source, data,nivel) {
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
                resultado = resultado.concat(obtenerHijosYnietos(filtrado.target, data,nivel));
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
                //if (cant_padres > 0) {

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
                                            //porc = Math.round((valor / valor_grupo[0].value) * 100, 0);
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
                                            //porc = Math.round((valor / valor_grupo[0].value) * 100, 0);
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
                //}
                //} else {
                //    miga_pan = "";
                //    $("#btnAtras").hide();
                //    $("#sankey_basic").empty();
                //    var obj_aux =
                //    {
                //        "links": global_sankey.links_nivel,
                //        "nodes": global_sankey.nodes_nivel,
                //        "cant_nodos": global_sankey.cant_nodos_nivel
                //    };
                //    graphSankey(obj_aux);

                //}
                //if (cant_padres <= 0) {
                //    miga_pan = "";
                //    $("#btnAtras").hide();
                //}

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
            cant_elementos = (datos.nodes.length/1);

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


function ObtenerDatosListadoPerEntidad(periodo, tipo) {
    globales_entidad = [];

    $("#divProyectosPerOrganismo").hide();  
    $("#divPagFichas").html("");
    $("#divListado").empty();
    $("#divListado").html(loader_proy);
    $("#divInstitucionesPerSector").show();
    var sectorSel = $("#filter_sector_sankey option:selected").val();
    var organismoSel = $("#filter_organismo_sankey option:selected").val();
    var id = "";
    if (tipo == "sector") {
        id = sectorSel;
    } else {
        id = organismoSel;
    }
    if (periodo != undefined && periodo != "") {
        if (sectorSel != undefined && sectorSel != "") {
            var params_usu = { "annio": periodo, "id": id ,"tipo":tipo};

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosPresupuestoNew/GetInfograficoPerEntidad",
                cache: false,
                data: params_usu,
                success: function (result) {
                    if (result.status == true) {
                        var data = result.infograficoPerEntidad;
                        if (data != null) {
                            if (data.length > 0) {
                                globales_entidad = data;
                                var pagina_actual = 1;
                                var ini_data = ((pagina_actual - 1) * cantXPagina);
                                var fin_data = (pagina_actual * cantXPagina) - 1;
                                var data_pagina = arr = jQuery.grep(globales_entidad, function (n, i) {
                                    return (i >= ini_data && i <= fin_data);
                                });
                                getEstructuraInfograficoPerEntidad(data_pagina, 1);
                            } else {
                                $("#divListado").html("<span class='lblErrorNoData'>Información No Disponible</span>");
                            }
                        } else {
                            $("#divListado").html("<span class='lblErrorNoData'>Información No Disponible</span>");
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

    }

}

function getEstructuraInfograficoPerEntidad(datos, pagina) {
    var i_aux = 0;
    var j_aux = 0;
    var k_aux = 0;
    //var l = 0;
    var total_avance = 0;
    var total_presupuesto = 0;
    var periodo_aux = 0;
    var total_porc_ejecutado = 0;
    
    let html_list = `<div class="card-entidades-group">`;
    
    for (let i = 0; i < datos.length; i++) {
        let porc_ejecutado = 0;
        if (datos[i].presupuesto > 0) {
            if (datos[i].presupuesto > 0) {
                porc_ejecutado = (datos[i].avance / datos[i].presupuesto) * 100;
            }
        }
        
        const nom_institucion = datos[i]['nombre'];
        const cod_institucion = datos[i]['codigo'];
        const presup_aprobado = datos[i]['aprobado'] / 1000000;
        const presup_vigente = datos[i]['presupuesto'] / 1000000;
        const presup_ejecutado = datos[i]['avance'] / 1000000;
        
        html_list += `
            <div id="institucion_${i}" class="card d-flex">
                <div class="headEnt">
                    <div class="data1 mainDataEntidad">
                        <span class="td1">${nom_institucion} </span>
                    </div>
                    <div class="data1">
                        <span class="labelTit">Presupuesto Aprobado</span>
                        <span class="td1">RD$ ${formatMoney(presup_aprobado, 2, '.', ',')} Millones</span>
                    </div>
                    <div class="data1">
                        <span class="labelTit">Presupuesto Vigente</span>
                        <span class="td1">RD$ ${formatMoney(presup_vigente, 2, '.', ',')} Millones</span>
                    </div>
                    <div class="data1">
                        <span class="labelTit">Presupuesto Ejecutado</span>
                        <span class="td1">RD$${formatMoney(presup_ejecutado, 2, '.', ',')} Millones</span>
                    </div>
                    <div class="data1">
                        <span class="labelTit">Porcentaje de Ejecución</span>
                        <span class="td1">${formatMoney(porc_ejecutado, 2, '.', ',')}%</span>
                    </div>
                </div>
                <div class="btn-action">
                    <div class="btnPerfil">
                        <a target="_blank" href="/PerfilEntidad?codEntidad=${datos[i].id}" class="text-small">
                            <i class="material-icons md-18">arrow_forward</i><br /> 
                            <span>Ver institución</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    html_list += `</div>`;
    html_list += `<div id="divPagFichas"></div>`;
    
    $("#divListado").html(html_list);
    
    const totalNumber = globales_entidad.length;
    let totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;
    
    if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
        totalPages = totalPages + 1;
    }
    
    dibujarPagNumeradasPerEntidad(pagina, totalNumber, totalPages);
}

function dibujarPagNumeradasPerEntidad(actual, total, totalPag) {
    var pag_actual = parseInt(actual);
    var pagina_actual = pag_actual;
    var pagesHTML = '';
    var cant_por_pag = 6;
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
        var ini_data = ((pagina_actual - 1) * cantXPagina);
        var fin_data = (pagina_actual * cantXPagina) - 1;
        var data_pagina = arr = jQuery.grep(globales_entidad, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        $("#divListado").empty();
        getEstructuraInfograficoPerEntidad(data_pagina, pagina_actual);
    });

}


function ObtenerDatosListadoPerProyectos(periodo) {
    globales_proy = [];
    //$("#Instituciones").hide();
    $("#divInstitucionesPerSector").hide();
    $("#divPagFichas_proy").html("");
    $("#divListado_proy").empty();
    $("#divListado_proy").html(loader_proy);
    $("#divProyectosPerOrganismo").show();
    
    
    var id_organismo = $("#filter_organismo_sankey option:selected").val();
    
    if (periodo != undefined && periodo != "") {
        if (id_organismo != undefined && id_organismo != "") {
            var params_usu = { "annio": periodo, "id": id_organismo };

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosPresupuestoNew/GetInfograficoPerProyecto",
                cache: false,
                data: params_usu,
                success: function (result) {
                    if (result.status == true) {
                        var data = result.proyectosInv;
                        if (data != null) {
                            if (data.length > 0) {
                                //---------------------------------------
                                    globales_proy = data;
                                //-----------------------------------------
                                    var pagina_actual = 1;
                                    var ini_data = ((pagina_actual - 1) * cantXPagina);
                                    var fin_data = (pagina_actual * cantXPagina) - 1;
                                    var data_pagina = arr = jQuery.grep(globales_proy, function (n, i) {
                                        return (i >= ini_data && i <= fin_data);
                                    });
                                    getEstructuraInfograficoPerProyecto(data_pagina, 1);
                                //--------------------------------------------------------
                                
                            } else {
                                $("#divListado_proy").html("<span class='lblErrorNoData'>Información No Disponible</span>");
                            }
                        } else {
                            $("#divListado_proy").html("<span class='lblErrorNoData'>Información No Disponible</span>");
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

    }
}


function getEstructuraInfograficoPerProyecto(datos, pagina) {
    ///---------------------------------------------
    var i_aux = 0;
    var j_aux = 0;
    var k_aux = 0;
    //var l = 0;
    var total_avance = 0;
    var total_presupuesto = 0;
    var periodo_aux = 0;
    var total_porc_ejecutado = 0;
    ///---------------------------------------------
    let html_list = `<div class="card-entidades-group">`;
    for (let i = 0; i < datos.length; i++) {
        const nombre = datos[i].nombre;
        const idProyecto = parseFloat(datos[i].id);
        html_list += `
            <div id="proy_${i}" class="card d-flex">
                <div class="headEnt">
                    <div class="data1 mainDataEntidad2">
                        <span class="td1">${nombre} </span>
                    </div>
                    <div class="data1b">
                        <span class="labelTit">Monto financiado</span>
                        <span class="td1">RD$${formatMoney(datos[i].vigente, 2, '.', ',')} Millones</span>
                    </div>
                    <div class="data1b">
                        <span class="labelTit">Monto ejecutado</span>
                        <span class="td1">RD$${formatMoney(datos[i].ejecutado, 2, '.', ',')} Millones</span>
                    </div>
                    <div class="data1b">
                        <span class="labelTit">Avance financiero</span>
                        <span class="td1">${datos[i].avanceFinancieroOrganismo}%</span>
                    </div>
                    <div class="data1b">
                        <span class="labelTit">Estado</span>
                        <span class="td1">${datos[i].estado}</span>
                    </div>
                   
                </div>
                <div class="btn-action">
                        <div class="btnPerfil">
                            ${idProyecto > 0 ? `
                                <a target="_blank" href="../projectprofile/${idProyecto}" class="text-small">
                                    <i class="material-icons md-18">arrow_forward</i><br> 
                                    <span>Ver proyecto</span>
                                </a>
                            ` : ''}
                        </div>
                    </div>
            </div>
        `;
    }
    html_list += `</div>`;
    html_list += `<div id="divPagFichas_proy"></div>`;
    $("#divListado_proy").html(html_list);
    const totalNumber = globales_proy.length;
    let totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;
    if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
        totalPages = totalPages + 1;
    }
    dibujarPagNumeradasPerProyectos(pagina, totalNumber, totalPages);
}

    

function dibujarPagNumeradasPerProyectos(actual, total, totalPag) {
    var pag_actual = parseInt(actual);
    var pagina_actual = pag_actual;
    var pagesHTML = '';
    var cant_por_pag = 6;
    var cant_por_linea = 20;
    $("#divPagFichas_proy").html("");
    var divPag = $("#divPagFichas_proy")
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
        pag_enlace += '<a id="page_left_proy" role="button" class="material-icons md-24" data-page="' + (inicio - cant_por_linea) + '"><span class="">chevron_left</span></a>';
    }


    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            pag_enlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
        } else {
            pag_enlace += '<a class="page_left_proy" role="button" data-page="' + i + '">';
            pag_enlace += '<span class="glyphicon"><text class="paginacion">' + i + '</text></span>';
            pag_enlace += '</a>';
        }

    }

    if (pag_actual < totalPag) {
        if (fin < totalPag) {
            pag_enlace += '<a id="page_right_proy" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
        }
    }

    $("#divPagFichas_proy").html(pag_enlace);

    $('#page_right_proy,#page_left_proy,.page_left_proy,.page_right_proy').bind('click', function () {
        pagina_actual = $(this).attr("data-page");
        var ini_data = ((pagina_actual - 1) * cantXPagina);
        var fin_data = (pagina_actual * cantXPagina) - 1;
        var data_pagina = arr = jQuery.grep(globales_proy, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        $("#divListado_proy").empty();
        getEstructuraInfograficoPerProyecto(data_pagina, pagina_actual);
    });

}

///------------SECTORES TAB--------------------------
// Variable global para guardar el AJAX activo
var ajaxSectoresActivo = null;

function ObtenerDatosPerSectores(anyo, opcion, tipo) {
    global_tab = "sector";
    global_sankey = [];
    miga_pan = "";

    // ABORTAR AJAX ANTERIOR SI EXISTE
    if (ajaxSectoresActivo != null) {
        ajaxSectoresActivo.abort();
    }

    $("#sankey_basic").empty().html(loader_proy);

    ajaxSectoresActivo = $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/ObtDistribucionBySectorFuentes",
        type: "GET",
        data: {
            anyo: anyo,
            opcion: opcion,
            tipo: tipo
        },
        success: function (result) {
            ajaxSectoresActivo = null; // Limpiar referencia

            if (result.status == true) {
                var data = result.distribucionItemsByFuente;
                var total_vigente = result.totalPresupuesto;
                var total_ejecutado = result.totalEjecutado;
                if (data.length > 0) {
                    var datos_all = obtMatrizData(data, 3, 4);
                    global_sankey = datos_all;

                    var datos_iniciales = {
                        "links": global_sankey.links_nivel,
                        "nodes": global_sankey.nodes_nivel,
                        "cant_nodos": global_sankey.cant_nodos_nivel
                    };

                    var filterAgrupados = agruparNodos(datos_iniciales);
                    global_agrupado = filterAgrupados;

                    var tipoVista = $('input[name="tipoVistaSankey"]:checked').val();
                    if (tipoVista == "extendida") {
                        global_ini = datos_iniciales;
                    } else {
                        global_ini = {
                            "links": global_agrupado.links,
                            "nodes": global_agrupado.nodes,
                            "cant_nodos": global_agrupado.cant
                        };
                    }

                    if (total_vigente != null) {
                        if (total_vigente > 0) {
                            var porcentaje = ((total_ejecutado / total_vigente) * 100).toFixed(2);
                        }
                        $("#totalSankeyPerSector").text("RD$ " + formatMoney(total_vigente / 1, 2, '.', ',').toString() + " Millones");
                        $("#PorcEjecPerSector").text(porcentaje.toString() + "%");
                    }

                    $("#sankey_basic").empty();
                    graphSankey(global_ini);

                    $("#divInstitucionesPerSector").show();
                    ObtenerDatosListadoPerEntidad(anyo_actual, "sector");
                    configuraSankeyTipoVista();
                } else {
                    $("#sankey_basic").empty();
                }
            } else {
                alert("Error: " + result.message);
                $("#sankey_basic").empty();
            }
        },
        error: function (xhr) {
            ajaxSectoresActivo = null;
            // No mostrar error si fue abortado intencionalmente
            if (xhr.statusText !== 'abort') {
                alert(xhr.responseText);
            }
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
                obj_aux = { name: value.nombre, id:value.id };
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
                //if (nom_Nivel3.length > 80) {
                //    nom_Nivel3 = nom_Nivel3.substring(0, 4) + "...";
                //}

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
                        obj_aux = { name: value.nombre,id: value.id };
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

function ObtenerEntidadesPeriodo(anyo_actual) {

    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/ObtenerEntidadesPerNombre",
        type: "GET",
        data: {
            anyo: anyo_actual,
            filtro: null
        }
    }).done(function (data) {
        var result = data.entidades;
        var str_cad = "";
        var cad_sector = "";
        if (result != null) {
            var cant_sectores = result.length;
            var maximo = 5;
            if (result.length > 0) {
                str_html = "";
                str_cad += '<option value="">Seleccione una institución</option>';
                for (var i = 0; i < result.length; i++) {
                    str_cad += '<option value="' + result[i].label + '">' + result[i].label + '</option>';
                    cad_sector += '<option value="' + result[i].label + '">' + result[i].label + '</option>';
                }
                if (cant_sectores > 0) {
                    for (var j = 0; j < result.length; j++) {
                        if (j < maximo) {
                            var nombre = "entidadesId_" + j.toString();
                            str_html += '<div class="form-group">';
                            str_html += '<div class="form-group subtitle">';
                            str_html += '<label for="' + nombre + '" style="color:black;float:left;">Seleccionar una institución</label>';
                            str_html += '<select class="form-select selectEntidad" aria-label="Seleccione una institución:" id="' + nombre + '">';
                            str_html += str_cad;
                            str_html += '</select>';
                            str_html += '</div>';
                            str_html += '</div>';


                            //$("#funcionesId_" + j.toString()).html(str_cad);
                        }
                    }
                    $("#divContenedorEntidades").html(str_html);
                    getEntidadesIni();
                    configuraSelectEntidades();

                    ////----grafico pagado
                    $("#divContenedorEntidadesPag").html(str_html);
                    configuraSelectEntidadesGasto();
                }


            }
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function configuraSelectEntidadesGasto() {
    $('#divContenedorEntidadesPag .selectEntidad').on('change', function () {
        GetGastoEntidadesTiempoGraphic("btn");
    });

}

function getEntidadesIni() {
    $(".selectEntidad").each(function () {
        //$(this).addClass("foo");
        if ($(this).children.length > 0) {
            var id = $(this).attr("id");
            var str = id + "option:eq(0)";
            $(str).attr("selected", "selected");
        }
    });

}

function configuraSelectEntidades() {
    $('.selectEntidad').on('change', function () {
        GetGastoEntidadesGraphic("btn");
    });

}

function GetGastoEntidadesGraphic(origen) {
    var entidades = "";
    var cont = 0;
    $("#divContenedorEntidades .selectEntidad option:selected").each(function () {

        if ($(this).val() != "") {
            entidades += $(this).val() + "|";
            cont += 1;
        }
    });
    entidades = entidades.replace(/\|([^|]*)$/, '$1');
    if (cont == 0) {
        $("#topEntidadesG").text("Top instituciones");
    } else {
        $("#topEntidadesG").text("Comparativo instituciones");
    }
    GetGastoEntidades(anyo_actual, entidades);
}


function GetGastoEntidades(annio, filtro) {
    $("#divGraphBarChartGastoEntidades").empty();
    var tipo_dato = "top";
    $.ajax({
        url: "api/ServiciosPresupuestoNew/BarChartEntidades/",
        type: "GET",
        data: {
            anyo: annio,
            filtro: filtro
        }

    }).done(function (data) {
        var result = data;
        var result = data.infoRecursos;
        $("#divGraphBarChartGastoEntidades").empty();
        loadBarChartEntidades(result, "divGraphBarChartGastoEntidades");

    }).fail(function (handleError) {
        // Some function
        //console.log(handleError);
    });
}

function loadBarChartEntidadesOld(objData, divContenedor, tipo) {

    var rotacion = "";
    if (tipo == "all") {
        rotacion = "vertical";
    }

    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.BarChart()
            .select("#" + divContenedor)
            .config({
                data: objData,
                groupBy: ["label", "labelGroup"],
                type: "bar",
                x: "rawValue",
                y: "label",
                discrete: 'y',
                //height: 650,
                shapeConfig: {
                    //label: false,
                    labelConfig: {
                        fontMin: 4,
                        fontMax: 8
                    }, fill: function (d, index) {
                        var prueba = d;
                        return assignColorBarrasAvance(d["labelGroup"]);
                    }

                },
                tooltipConfig: {
                    title: function (d) {
                        //return d["label"] + "<br> " + "Presupuesto " + d["labelGroup"];
                        return "Presupuesto " + d["labelGroup"];
                    },
                    tbody: [
                        [function (d) {
                            var cad_aux = "RD$ " + formatMoney(["rawValue"],1, '.', ',').toString() + " Millones";
                            if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                                cad_aux = "RD$ " + formatMoney(d["rawValue"],1, '.', ',').toString() + " Millones";
                            }

                            return cad_aux;
                        }]
                    ]
                },
                yConfig: {
                    title: ""
                },
                xConfig: {
                    fontsize: "2px",
                    size: "2px",
                    labelRotation: rotacion,
                    title: "Millones de pesos dominicanos"
                },
                legend: false
            })
            .barPadding(0)
            .groupPadding(10)
            .render();
    }
}

// ============================================================================
// FUNCIONES OPTIMIZADAS PARA GRÁFICOS DE PRESUPUESTO - REPÚBLICA DOMINICANA
// ============================================================================

/**
 * Determina la unidad óptima (pesos, millones, miles de millones, billones)
 * basándose en el rango de valores (mínimo y máximo)
 * @param {Array<number>} dataArray - Array de valores numéricos crudos
 * @returns {Object} - Objeto con label y factor de la unidad óptima
 */
function resolveUnitMB(dataArray) {
    // Umbral mínimo para considerar una unidad legible
    const UMBRAL_MINIMO = 1;

    const UNITS = {
        pesos: { label: "Pesos dominicanos", factor: 1 },
        millones: { label: "Millones de pesos dominicanos", factor: 1e6 },
        milesMillones: { label: "Miles de millones de pesos dominicanos", factor: 1e9 },
        billones: { label: "Billones de pesos dominicanos", factor: 1e12 }
    };

    // Filtrar valores válidos (mayores a 0)
    const valores = dataArray.filter(v => v > 0);
    if (!valores.length) return UNITS.millones;

    const maxRaw = Math.max(...valores);
    const minRaw = Math.min(...valores);

    // Evaluar cada unidad en orden descendente
    const order = ["billones", "milesMillones", "millones", "pesos"];
    for (const k of order) {
        const u = UNITS[k];
        const maxInUnit = maxRaw / u.factor;
        const minInUnit = minRaw / u.factor;

        // Buscar balance: máximo manejable (< 10,000) y mínimo legible (>= 1)
        if (maxInUnit >= 1 && maxInUnit < 10000 && minInUnit >= UMBRAL_MINIMO) {
            return u;
        }
    }

    return UNITS.millones;
}

/**
 * Decide si las etiquetas del eje X deben rotarse según el ancho del contenedor
 * @param {string|HTMLElement} containerEl - Selector o elemento del contenedor
 * @param {Array} data - Datos del gráfico
 * @param {Object} unit - Unidad seleccionada
 * @param {Object} options - Opciones de configuración
 * @returns {number} - Grados de rotación (0 o 90)
 */
function decideRotation(containerEl, data, unit, {
    minGap = 12,
    innerFrac = 0.75
} = {}) {
    const el = (typeof containerEl === "string")
        ? document.querySelector(containerEl)
        : containerEl;

    const W = el?.getBoundingClientRect().width || 0;
    if (!W) return 0;

    // Rotación automática para contenedores angostos
    if (W < 600) return 90;

    // Si el valor máximo formateado es largo, rotar
    const fmt = new Intl.NumberFormat("es-DO", { maximumFractionDigits: 1 });
    const maxValue = Math.max(...data.map(d => d.rawValue / unit.factor));
    const maxLabel = fmt.format(maxValue);

    if (maxLabel.length > 5) return 90;

    // Espacio disponible vs necesario
    const estimatedLabelWidth = maxLabel.length * 8; // aprox 8px por caracter
    const availableGap = (W * innerFrac) / 5; // aprox 5-6 ticks

    return (estimatedLabelWidth + minGap > availableGap) ? 90 : 0;
}

function loadBarChartEntidades(objData, divContenedor, tipo) {

    const data = (objData || []).map(d => ({ ...d, rawValue: +d.rawValue }));

    d3.select("#" + divContenedor).selectAll("*").remove();
    if (!data.length) return;

    //*unidad automáticamente*/
    const unit = resolveUnitMB(data.map(d => d.rawValue));

    // Dominio 
    const maxValue = d3.max(data, d => +d.rawValue / unit.factor) || 1;
    let roundedMax;

    // Separación de ticks 
    if (maxValue <= 0.5) {
        roundedMax = 1;
    } else if (maxValue <= 1) {
        roundedMax = 2;
    } else if (maxValue <= 2) {
        roundedMax = 4;
    } else if (maxValue <= 3) {
        roundedMax = 5;
    } else if (maxValue <= 5) {
        roundedMax = 8;
    } else if (maxValue <= 8) {
        roundedMax = 10;
    } else if (maxValue <= 10) {
        roundedMax = Math.ceil(maxValue / 2) * 2;
    } else if (maxValue <= 100) {
        roundedMax = Math.ceil(maxValue / 10) * 10;
    } else if (maxValue <= 1000) {
        roundedMax = Math.ceil(maxValue / 50) * 50;
    } else {
        roundedMax = Math.ceil(maxValue / 100) * 100;
    }

    
    const cont = document.querySelector("#" + divContenedor);
    const rotation = decideRotation(cont, data, unit);

    // Formateo etiquetas del eje X (decimales para evitar duplicados)
    const fmt = new Intl.NumberFormat("es-DO", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0
    });

    
    const numEntidades = new Set(data.map(d => d.label)).size;

    
    let barPadding;
    if (numEntidades <= 3) {
        barPadding = 0;  
    } else if (numEntidades <= 4) {
        barPadding = 1;  
    } else {
        barPadding = 3;  
    }

    
    let minHeight;
    if (numEntidades <= 2) {
        minHeight = 300;  
    } else if (numEntidades <= 3) {
        minHeight = 350;  
    } else {
        minHeight = 450;  
    }

    
    const chart = new d3plus.BarChart()
        .select("#" + divContenedor)
        .config({
            data,
            groupBy: ["labelGroup"],
            legend: true,
            legendPosition: "bottom",
            type: "bar",
            height: Math.max(minHeight, data.length * 25),
            x: d => +d.rawValue / unit.factor,
            y: "label",
            discrete: "y",

            xConfig: {
                scale: "linear",
                nice: true,
                tickFormat: v => fmt.format(v),
                labelRotation: rotation,
                title: unit.label, 
                domain: [0, roundedMax]
            },

            yConfig: {
                title: "",
                orient: "left",
                // Partir nombres largos en dos líneas
                tickFormat: (d) => {
                    const maxLineLength = 40;
                    const maxTotalLength = 80;

                    // Si es muy corto, dejarlo igual
                    if (d.length <= maxLineLength) return d;

                    let text = d.length > maxTotalLength ? d.substring(0, maxTotalLength) + "..." : d;

                    const middle = text.length / 2;
                    let splitPoint = text.lastIndexOf(" ", middle + 20);
                    if (splitPoint === -1 || splitPoint < middle - 20) {
                        splitPoint = text.indexOf(" ", middle);
                    }

                    if (splitPoint > 0) {
                        return text.substring(0, splitPoint) + "\n" + text.substring(splitPoint + 1);
                    }
                    return text;
                }
            },

            shapeConfig: {
                 label: (d) => {
                    const valorEnUnidad = d.rawValue / unit.factor;
                    let decimales;
                    if (valorEnUnidad < 0.01) {
                        decimales = 4; // 0.0001
                    } else if (valorEnUnidad < 0.1) {
                        decimales = 3; // 0.001
                    } else if (valorEnUnidad < 1) {
                        decimales = 3; // 0.001
                    } else if (valorEnUnidad < 10) {
                        decimales = 2; // 0.11
                    } else {
                        decimales = 1; // 0.1
                    }
                    const fmtDinamico = new Intl.NumberFormat("es-DO", {
                        maximumFractionDigits: decimales,
                        minimumFractionDigits: 0
                    });
                    return fmtDinamico.format(valorEnUnidad);
                },
                fill: d => assignColorBarrasAvance(d.labelGroup),
                Bar: {
                    height: 20  
                }
            },
            tooltip: false 
        })
        .barPadding(barPadding)
        .groupPadding(20) 
        .render();
}


function assignColorBarrasAvance(indice) {
    var color_aux = "#cccccc";
    if (indice.toUpperCase() == "VIGENTE") {
        color_aux = '#3590cf';
    } else {
        color_aux = '#e78e06';
    }

    return color_aux;

}

function GetGastoEntidadesTiempoGraphic(origen) {
    var cont = 0;
    var entidades = "";
    $("#divContenedorEntidadesPag .selectEntidad option:selected").each(function () {

        if ($(this).val() != "") {
            entidades += $(this).val() + "|";
            cont += 1;
        }
    });

    entidades = entidades.replace(/\|([^|]*)$/, '$1');
    if (origen == "btn") {
        if (cont == 0) {
            $("#topEntidadesPag").text("Top instituciones");
        } else {
            $("#topEntidadesPag").text("Comparativo instituciones");
        }
        GetGastoTiempoEntidades(anyo_actual, entidades);

    } else {
        $("#topEntidadesPag").text("Top instituciones");
        GetGastoTiempoEntidades(anyo_actual, null);
    }

}

function GetGastoTiempoEntidades(annio, filtro) {
    var tipo_dato = "top";
    $.ajax({
        url: "api/ServiciosPresupuestoNew/BarChartTiempoEntidades/",
        type: "GET",
        data: {
            anyo: annio,
            filtro: filtro
        }

    }).done(function (data) {
        var result = data.infoRecursos;

        $("#grafico_lineas").empty();
        LoadLineEntidadesPerTiempo(result, "grafico_lineas");

    }).fail(function (handleError) {
        // Some function
        //console.log(handleError);
    });
}

function LoadLineEntidadesPerTiempo(objData, divContenedor) {
    const data = (objData || []).map(d => ({ ...d, rawValue: +d.rawValue }));

    if (!data.length) return;

    //unidad dinamica
    const unit = resolveUnitMB(data.map(d => d.rawValue));

    //dominio
    const maxValue = d3.max(data, d => +d.rawValue / unit.factor) || 1;
    let roundedMax;

    // Separación de ticks
    if (maxValue <= 0.5) {
        roundedMax = 1;
    } else if (maxValue <= 1) {
        roundedMax = 2;
    } else if (maxValue <= 2) {
        roundedMax = 4;
    } else if (maxValue <= 3) {
        roundedMax = 5;
    } else if (maxValue <= 5) {
        roundedMax = 8;
    } else if (maxValue <= 8) {
        roundedMax = 10;
    } else if (maxValue <= 10) {
        roundedMax = Math.ceil(maxValue / 2) * 2;
    } else if (maxValue <= 100) {
        roundedMax = Math.ceil(maxValue / 10) * 10;
    } else if (maxValue <= 1000) {
        roundedMax = Math.ceil(maxValue / 50) * 50;
    } else {
        roundedMax = Math.ceil(maxValue / 100) * 100;
    }

    // Formateador para eje Y
    const fmt = new Intl.NumberFormat("es-DO", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0
    });

    // Formateador dinámico para tooltips
    const formatTooltip = (rawValue) => {
        const valorEnUnidad = rawValue / unit.factor;
        let decimales;
        if (valorEnUnidad < 0.01) {
            decimales = 4;
        } else if (valorEnUnidad < 0.1) {
            decimales = 3;
        } else if (valorEnUnidad < 1) {
            decimales = 3;
        } else if (valorEnUnidad < 10) {
            decimales = 2;
        } else {
            decimales = 1;
        }
        const fmtDinamico = new Intl.NumberFormat("es-DO", {
            maximumFractionDigits: decimales,
            minimumFractionDigits: 0
        });
        return "RD$ " + fmtDinamico.format(valorEnUnidad) + " " + unit.label;
    };

    var configuracion = {
        height: 600,
        data: data,
        groupBy: "labelGroup",
        lineLabels: false, 
        legend: true, 
        shapeConfig: {
            Line: {
                strokeLinecap: "square",
                strokeWidth: 2,
                type: "line",
                curve: "linear",
                label(d) {
                    return d["labelGroup"];
                }
            }
        },
        tooltipConfig: {
            title: function (d) {
                return d["labelGroup"];
            },
            tbody: [
                ["Pagado:", function (d) {
                    return formatTooltip(d["rawValue"]);
                }]
            ]
        },
        lineMarkers: true,
        lineMarkerConfig: {
            fill: "blue",
            r: 3
        },
        x: "label",
        y: d => +d.rawValue / unit.factor, 
        yConfig: {
            title: unit.label, 
            domain: [0, roundedMax], 
            tickFormat: v => fmt.format(v) 
        },
        xConfig: {
            title: "Meses",
            tickFormat: function (value) {
                var cad_mes = getNomMes(value);
                return cad_mes;
            }
        }
    };

    new d3plus.LinePlot()
        .translate(d => (d === "Back" || d === "back") ? "Atrás" :
            d === "Click to Hide" ? "Clic para ocultar esta institución" :
                d === "Click to Show" ? "Clic para mostrar esta institución" :
                    d === "Shift+Click to Highlight" ? "Usar Shift+clic para resaltar solo esta institución" :
                        d === "No Data Available" ? "Información No Disponible" : d)
        .config(configuracion)
        .select("#" + divContenedor)
        .render();
}


function getNomMes(index) {
    var item = index - 1;
    var nombresMeses = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"
    ];
    var cad_abreviatura = nombresMeses[item];
    return cad_abreviatura;

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
