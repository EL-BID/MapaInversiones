var objPresupuestoGeneralPerAnio = JSON.parse(document.body.getAttribute('data-presupuestoGeneralPerAnio'));
var objPresupuestoEjecutadoPorEmergencias = JSON.parse(document.body.getAttribute('data-presupuestoEjecutadoPorEmergencias'));

//--------------------------------------------------------
var cantXPagina = 10;
var findata = 0;
var inidata = 0;
var paginaActual = 1;
var presupuestoEjecutado = 0;

var porc_agrup_emergencia = 5; // Agrupa nodos n3 que representen < 5% de su padre n2
var etiqueta_otros_emergencia = "OTROS";

var anyo_actual = $("#filtro_anio_pres_general").val();
//------------------------------------------------------


inicializaDatos();


function anioChanged() {
    anyo_actual = $("#filtro_anio_pres_general").val();
    obtenerPresupuestoGeneralPerAnio(anyo_actual);
    obtenerPresupuestoEjecutadoPorEmergencia(anyo_actual);
    obtenerPresupuestoAsignadoPorEntidadYAnio(anyo_actual);
    obtenerGraficoSankey();
}
function inicializaDatos() {
    anioChanged();
    
}


// ========================================================================
// FUNCIONES DE AGRUPAMIENTO PARA EMERGENCIA
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

function groupAndSumWithCounts(arr, groupKeys, sumKeys) {
    return Object.values(
        arr.reduce((acc, curr) => {
            const group = groupKeys.map(k => curr[k]).join('-');
            acc[group] = acc[group] || Object.fromEntries(
                groupKeys.map(k => [k, curr[k]])
                    .concat(sumKeys.map(k => [k, 0]))
                    .concat([['count', 0]]));
            sumKeys.forEach(k => acc[group][k] += curr[k]);
            acc[group]['count']++;
            return acc;
        }, {})
    );
}

function concatenarIds(linksArray, sourceValue) {
    var ids = [];
    linksArray.forEach(function (link) {
        if (link.source === sourceValue && link.id) {
            ids.push(link.id);
        }
    });
    return ids.join('*');
}


function loadData(cb, datos) {
    cb(datos)
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

function graphSankey(datos) {


    d3.select("#sankey_basic").selectAll("*").remove();

    var units = "millones";

    var sizeAux = recalcularSize(datos);
    var margin = sizeAux.margin;
    var width = sizeAux.width;
    var height = sizeAux.height;

    var format = function (d) {
        return "RD$ " + formatMoney(d, 2, '.', ',') + " " + units;
    },
        color = d3.scale.category20();

    // Append the svg canvas to the page
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
            .nodePadding(10)
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
                

        // Add in the links
        link.selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .transition().duration(750)
            .attr("d", path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            });

        // Add the link titles (tooltips)
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

        // Add in the nodes
        var node = nodes.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        // Add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) {
                return Math.max(3, d.dy);
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

        // Add in the title for the nodes (labels)
        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; })
            .attr("dy", ".2em")
            .style("font-size", "10px")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .html(function (d) {
                var longitud = 60;
                var new_cad = "";

                // Valida d.name existe
                if (!d || !d.name) {
                    return "";
                }

                vec_nodo = d.name.split("|");

                if (vec_nodo && vec_nodo.length > 1) {
                    var cad_aux = vec_nodo[1];

                    //nombres largos a 60 caracteres
                    if (cad_aux && cad_aux.length > longitud) {
                        new_cad = cad_aux.substring(0, longitud) + "...";
                    } else {
                        new_cad = cad_aux || "";
                    }
                } else {
                    new_cad = d.name || "";
                }

                return new_cad;

            })
            .filter(function (d) { return d.x < width / 4; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        sankey.relayout();
    }
}

function obtenerPresupuestoEjecutadoPorEmergencia(anio) {
    var $carousel = $('.carouselData').flickity({
        initialIndex: 1,
        pageDots: false,
        groupCells: true,
        contain: true,
        prevNextButtons: false,
        freeScroll: true,
        wrapAround: false
    });
    var $cellElements = $carousel.flickity('getCellElements');
    $carousel.flickity('remove', $cellElements);
    var presupuestoEjecutadoPorEmergencia = objPresupuestoEjecutadoPorEmergencias.filter(x => x.anio == anio);

    if (presupuestoEjecutadoPorEmergencia != undefined && presupuestoEjecutadoPorEmergencia.length > 0) {

        for (var i = 0; i < presupuestoEjecutadoPorEmergencia.length; i++) {
            var item = presupuestoEjecutadoPorEmergencia[i];

            let emergenciaCarrusel = `
                <div class='carousel-cell col-lg-3' style='height:200px;'>
                    <div class='card'>
                        <div class='card-header'>${item.nombre}</div>
                            <div class='card-body d-flex' style='flex-direction: column;'>
                                 <div>
                                    <span class="label">
                                        Monto total ejecutado
                                    </span>
                                    <span class="bigNumber">
                                       RD$ ${parseFloat(item.presupuestoEjecutado).toLocaleString('es-DO')} millones
                                    </span>
                                 </div>
                            </div>
            `;

            if (item.enlace == "") {
                emergenciaCarrusel += `
                    </div>
                </div>
                `;
            } else {
                emergenciaCarrusel += `
                        <div class='card-footer'>
                            <a class='btn btn-outlined' href='${item.enlace}'>
                                Más información <span class='glyphicon glyphicon-arrow-right'></span>
                            </a>
                        </div>
                    </div>
                </div>
                `;
            }

            var $cellElems = $(emergenciaCarrusel);
            $carousel.flickity('append', $cellElems);
            $carousel.flickity('resize');
        }
    } else {

        if (presupuestoEjecutado == undefined || presupuestoEjecutado == 0) {

            let emergenciaOtrosCarrusel = `
                <div class='carousel-cell' style='height:200px;'>
                    Sin datos de ejecución para el año seleccionado
                </div>
            `;
            var $cellElems = $(emergenciaOtrosCarrusel);
            $carousel.flickity('append', $cellElems);
            $carousel.flickity('resize');

        } else {
            let emergenciaOtrosCarrusel = `
                <div class='carousel-cell col-lg-3'>
                    <div class='card'>
                        <div class='card-header'>Otras</div>
                        <div class='card-body d-flex' style='flex-direction: column;'>
                            <div>
                                <span class="label">
                                    Monto total ejecutado
                                </span>
                                <span class="bigNumber">
                                   RD$ ${parseFloat(item.presupuestoEjecutado).toLocaleString('es-DO')} millones
                                </span>
                             </div>


                        </div>
                    </div>
                </div>
            `;

            var $cellElems = $(emergenciaOtrosCarrusel);
            $carousel.flickity('append', $cellElems);
            $carousel.flickity('resize');
        }
    }
}
function obtenerPresupuestoGeneralPerAnio(anio) {
    let presupuestoAnio = objPresupuestoGeneralPerAnio.filter(x => x.anio == anio);
    if (presupuestoAnio != undefined && presupuestoAnio.length > 0) {
       
        $("#presupuestoAsignadoPorAnio").text("RD$ " +
            parseFloat(presupuestoAnio[0].presupuestoAsignado.replace(',', '.')).toLocaleString('es-DO', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + " millones");

        $("#presupuestoEjecutadoPorAnio").text("RD$ " +
            parseFloat(presupuestoAnio[0].presupuestoEjecutado.replace(',', '.')).toLocaleString('es-DO', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + " millones");

        $("#porcentajeEjecutadoPorAnio").text(
            parseFloat(presupuestoAnio[0].porcentajeAvance.replace(',', '.')).toLocaleString('es-DO', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + "%");
    }
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

function obtenerGraficoSankey() {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "/api/ServiciosEmergencias/ObtDistribucionPresupuestalGeneralPorTipoEmergencia",
        type: 'GET',
        data: {
            anyo: anyo_actual
        },
        success: function (result) {
            if (result.status == true) {
              
                var data = result.distribucionItem;
                if (data.length > 0) {

                    var datos = obtMatrizData(data,1,3);
                    $("#sankey_basic").html("");
                    graphSankey(datos);                    
                }

            } else {
                alert("Error: " + result.message, function () {

                });
            }

        },
        error: function (response) {
            alert("Error " + response.responseText);
        },
        failure: function (response) {
            alert("Error " + response.responseText);
        }
    });

}


//FUNCION PARA PINTAR PRESUPUESTO ASIGNADO POR ENTIDAD DEPENDIENDO DEL AÑO
function obtenerPresupuestoAsignadoPorEntidadYAnio(anio) {
    $("#anioPresupuestoEjecutadoEmergencias").text(anio);
    $("#anioPresupuestoEntidad").text(anio);
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosEmergencias/GetConsolidadoPresuAsignadoPorEntidadAnio",
        //data: {
        //    anyo: anio
        //},
        cache: false,
        success: function (data) {
            var data = data.filter(x => x.anio.toString() == $("#filtro_anio_pres_general").val());
            var i_aux = 0;
            var j_aux = 0;
            var k_aux = 0;
            var total_avance = 0;
            var total_presupuesto = 0;
            var html_str = '<div class="panel-group accordion" role="tablist" aria-multiselectable="true">';
            for (var i = 0; i < data.length; i++) {
                var nomCollapse = "collapseOne_" + i_aux.toString() + "_" + j_aux.toString();
                var nomHeading = "headingOne_" + i_aux.toString() + "_" + j_aux.toString();
                total_avance += data[i].total_avance;
                total_presupuesto += data[i].total_presupuesto;
                html_str += '<div class="panel panel-default">';
                html_str += '<div class="panel-heading" role="tab" id="' + nomHeading + '">';
                html_str += '<div class="panel-title">';
                html_str += '<a role="button" id="a_' + data[i].idItem + '" class="prueba_enlace" item="' + data[i].idItem + '" data-toggle="collapse" data-parent="#accordion" href="#' + nomCollapse + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                html_str += '<div class="head">';
                html_str += '<div class="mainData">';
                html_str += '<span class="labelTit">Institución</span>';
                html_str += '<span class="td1">' + data[i].nombre + '</span>';
                html_str += '</div>';
                html_str += '<div class="data2">';
                html_str += '<span class="labelTit">Presupuestado</span>';
                html_str += '<span class="td1">RD$ ' + formatMoney((data[i].total_presupuesto / 1000000), 2, '.', ',') + ' Millones</span>';
                html_str += '</div>';
                html_str += '<div class="data2">';
                html_str += '<span class="labelTit">Ejecutado</span>';
                html_str += '<span class="td1">RD$ ' + formatMoney((data[i].total_avance / 1000000), 2, '.', ',') + ' Millones</span>';
                html_str += '</div>';
                html_str += '<div class="data2">';
                html_str += '<span class="labelTit">Cumplimiento</span>';
                html_str += '<span class="td1">' + formatMoney(data[i].porcentajeCumplimiento, 2, '.', ',') + ' %</span>';
                html_str += '</div>';
                html_str += '</div>';
                html_str += '</a>';
                html_str += '</div>';
                html_str += '</div>';
                //nivel 2
                html_str += '<div id="' + nomCollapse + '" class="panel-collapse collapse nivel1" role="tabpanel" aria-labelTitledby="' + nomHeading + '" item="' + data[i].nombre.toUpperCase() + '">';
                //console.log("data.NomItem", data[i].NomItem);
                //console.log("data.Detalles", data[i].Detalles);
                html_str += '<div class="panel-body">';
                for (var j = 0; j < data[i].detalles.length; j++) {
                    //console.log("data.Detalles a ver", JSON.stringify(data.Detalles[i]['Detalles'], null, 2));
                    var nomNivel2 = "accordion_l2_" + i_aux.toString() + "_" + j_aux.toString();
                    var headNivel2 = "headLevel2_" + i_aux.toString() + "_" + j_aux.toString();
                    var panelHijo2 = "c2_" + j_aux.toString() + "_" + k_aux.toString();
                    var nomHeadLevel3 = "headLevel3_" + j_aux.toString() + "_" + k_aux.toString();
                    html_str += '<div class="panel-group nivel22" id="' + nomNivel2 + '" role="tablist" aria-multiselectable="true">';
                    html_str += '<div class="panel panel-default">';
                    html_str += '<div class="panel-heading" role="tab" id="' + headNivel2 + '">';
                    html_str += '<div class="panel-title">';
                    html_str += '<a role="button" data-toggle="collapse" data-parent="#' + nomNivel2 + '" href="#' + panelHijo2 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                    html_str += '<div class="head">';
                    html_str += '<div class="data2 mainData">';
                    html_str += '<span class="labelTit">Unidad ejecutora</span>';
                    html_str += '<span class="td1p">' + data[i].detalles[j]['nomCapitulo'] + '</span>';
                    //console.log("data.detalles[i]['NomCapitulo']", data[i].Detalles[j]['NomCapitulo']);
                    html_str += '</div>';
                    html_str += '<div class="data2">';
                    html_str += '<span class="labelTit">Presupuestado</span>';
                    html_str += '<span class="td1p">RD$ ' + formatMoney((data[i].detalles[j]['presupuesto'] / 1000000), 2, '.', ',') + ' Millones</span>';
                    html_str += '</div>';
                    html_str += '<div class="data2">';
                    html_str += '<span class="labelTit">Ejecutado</span>';
                    html_str += '<span class="td1p">RD$ ' + formatMoney((data[i].detalles[j]['avance'] / 1000000), 2, '.', ',') + ' Millones</span>';
                    html_str += '</div>';
                    html_str += '<div class="data2">';
                    html_str += '<span class="labelTit">Cumplimiento</span>';
                    html_str += '<span class="td1p">' + formatMoney(data[i].detalles[j]['porcentajeCumplimiento'], 2, '.', ',') + ' %</span>';
                    html_str += '</div>';
                    html_str += '</div>';
                    html_str += '</a>';
                    html_str += '</div>';
                    html_str += '</div>';
                    //nivel 3
                    html_str += ' <div id="' + panelHijo2 + '" class="panel-collapse collapse level3 nivel2" role="tabpanel" aria-labelledby="' + nomHeadLevel3 + '" entidad="' + data[i].detalles[j]['nomCapitulo'].toUpperCase() + '">';
                    html_str += '<div class="panel-body">';
                    //console.log("data[i].Detalles[j].Detalles", data[i].Detalles[j].Detalles);
                    for (var k = 0; k < data[i].detalles[j].detalles.length; k++) {
                        var nomNivel3 = "accordion_l3_" + j_aux.toString() + "_" + k_aux.toString();
                        //var nomCnivel3 = "c3_" + j_aux.toString() + "_" + k_aux.toString();
                        html_str += '<div class="panel-group nivel33" id="' + nomNivel3 + '" role="tablist" aria-multiselectable="true">';
                        html_str += '<div class="panel panel-default">';
                        html_str += '<div class="panel-heading" role="tab" id="' + nomHeadLevel3 + '">';
                        html_str += '<div class="panel-title">';
                        html_str += '<a role="button" data-toggle="collapse" data-parent="#' + nomNivel3 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                        html_str += '<div class="head">';
                        html_str += '<div class="data2 mainData">';
                        html_str += '<span class="labelTit">Programa</span>';
                        html_str += '<span class="td1p">' + data[i].detalles[j].detalles[k]['nomConcepto'] + '</span>';
                        html_str += '</div>';
                        html_str += '<div class="data2">';
                        html_str += '<span class="labelTit">Presupuestado</span>';
                        html_str += '<span class="td1p">RD$ ' + formatMoney((data[i].detalles[j].detalles[k]['presupuesto'] / 1000000), 2, '.', ',') + ' Millones</span>';
                        html_str += '</div>';
                        html_str += '<div class="data2">';
                        html_str += '<span class="labelTit">Ejecutado</span>';
                        html_str += '<span class="td1p">RD$ ' + formatMoney((data[i].detalles[j].detalles[k]['avance'] / 1000000), 2, '.', ',') + ' Millones</span>';
                        html_str += '</div>';
                        html_str += '<div class="data2">';
                        html_str += '<span class="labelTit">Cumplimiento</span>';
                        html_str += '<span class="td1p">RD$ ' + formatMoney(data[i].detalles[j].detalles[k]['porcentajeCumplimiento'], 2, '.', ',') + ' %</span>';
                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</a>';
                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</div>';
                        k_aux++;
                    }
                    html_str += '</div>';
                    html_str += '</div>';
                    html_str += '</div>';
                    html_str += '</div>';
                    j_aux++;
                }
                html_str += '</div>';
                html_str += '</div>';
                html_str += '</div>';
                i_aux++;
            }
            html_str += '<div id="divTotales" class="summUp">';
            html_str += '<div class="panel-title">';
            html_str += '<div class="head">';
            html_str += '<div class="mainData">';
            html_str += '<span class="labelTit">&nbsp;</span>';
            html_str += '<span class="td1">Totales</span>';
            html_str += '</div>';
            html_str += '<div class="data2">';
            html_str += '<span class="labelTit">Presupuestado</span>';
            html_str += '<span class="td1">RD$' + formatMoney((total_presupuesto / 1000000), 2, '.', ',') + ' Millones</span>';
            html_str += '</div>';
            html_str += '<div class="data2">';
            html_str += '<span class="labelTit">Ejecutado</span>';
            html_str += '<span class="td1">RD$' + formatMoney((total_avance / 1000000), 2, '.', ',') + ' Millones</span>';
            html_str += '</div>';

            html_str += '<div class="data2">';
            html_str += '<span class="labelTit">Cumplimiento</span>';
            if (total_presupuesto == 0) html_str += '<span class="td1">' + 0.00 + ' %</span>';
            else html_str += '<span class="td1">' + formatMoney((total_avance * 100 / total_presupuesto), 2, '.', ',') + ' %</span>';
            html_str += '</div>';
            html_str += '</div>';
            html_str += '</div>';
            html_str += '</div>';
            html_str += '<div id="divPagFichas">';
            html_str += '</div>';
            html_str += "</div>";
            $("#divPresupuestoGeneralAsignadoPorEntidad").html(html_str);
        },
        error: function (response) {
            alert(response.responseText);
        },
        failure: function (response) {
            alert(response.responseText);
        }
    });
}
function formatMoney(number, c, d, t) {
    var n = number,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    
    return s + (j ? i.substring(0, j) + t : "") + i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}