var anyo = (new Date).getFullYear() - 1;
//var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
var recursosPerObjetoAvanceGroup = JSON.parse(document.body.getAttribute('data-recursosPerObjetoAvanceGroup'));
var objPerContratos = JSON.parse(document.body.getAttribute('data-resourcesPerContratos'));
var tipoEmergencia = JSON.parse(document.body.getAttribute('data-tipoEmergencia'));
$("#divListadoRecursosObjeEnteNoCentral").hide();

inicializaDatos();
$("#enlacesankey_og").trigger("click");
configVerMas();
function inicializaDatos() {
    $('#accordion .collapse').removeClass("in");
    $("#divListadoRecursosObje").hide();
    $("#iconList").attr("class", "txt-bold icRD_blue");
    $("#iconTree").attr("class", "txt-bold icGrap_blue");
    $("#iconSankey").attr("class", "txt-bold icSankey");
    //comportamiento resultados buscador
    $(".container,.reset-filters,.filter-results").on('click',function (event) {
        var obj_focus_clase = event.target.className.toString();
        if (obj_focus_clase.indexOf("search-results") < 0 && obj_focus_clase.indexOf("search-item-t") < 0 && obj_focus_clase.indexOf("search-input") < 0 && obj_focus_clase.indexOf("general-search") < 0) {
            $("#divResultados").children().remove();
            $("#divResultados").addClass("objHidden");
        }
    });
    configuraFiltro_DesgloseIconos();
    configuraFiltro_Donaciones();
    configuraEnlacesParticipa();
    ObtConsolidadoRecursos();
    
}
function configuraEnlacesParticipa() {
    $("#divEnlaceParticipaCon").on('click', function (e) {
        var url = "/Participa/Comentarios/";
        window.location.href = url;
    });
    $("#divEnlaceParticipaPro").on('click', function (e) {
        var url = "/Participa/programasayuda/";
        window.location.href = url;
    });
    $("#divEnlaceSolicita").on('click', function (e) {
        var url = "/Participa/AccesoInformacion/";
        window.location.href = url;
    });
    $("#divEnlaceDeclaraciones").on('click', function (e) {
        var url = "/Covid/Declaraciones/";
        window.location.href = url;
    });
}
function ObtConsolidadoRecursos() {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: null,
        url: "/api/ServiciosCovid/ObtConsolidadoRecursosCovid",
        cache: false,
        success: function (result) {
            if (result.status == true) {
                var data = result.distribucionItem;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var nombre_aux = data[i].nomItem.toUpperCase();
                        var id_aux = data[i].idItem;
                        var valor = "RD $ " + formatMoney(parseFloat(data[i].total_valor / 1000000),0, ".", ",") + tituloMillones(parseFloat(data[i].total_valor).toFixed(0));
                        var cant_ben = formatMoney(parseFloat(data[i].total_beneficiarios),0, ".", ",");
                        var aux_div = d3.select("#" + "divConsolidaRecursosData")
                            .append("div")
                            .attr("class", "card")
                        var aux_fila = aux_div.append("div")
                            .attr("class", "row")
                        var aux_encabezado = aux_fila.append("div")
                            .attr("class", "col-md-4 c-inline-item-head")
                        var aux_nombre = aux_encabezado.append("div")
                            .attr("class", "ic_tit")
                        if (nombre_aux == "CONTRATOS") {
                            aux_nombre.append("img")
                                .attr("src", "/content/img/covid/ic_contratos.svg")
                                .attr("alt", "Consultar " + data[i].nomItem)
                        } else if (nombre_aux == "OTROS GASTOS") {
                            aux_nombre.append("img")
                                .attr("src", "/content/img/covid/ic_otrosGastos.svg")
                                .attr("alt", "Consultar " + data[i].nomItem)
                        } else {
                            aux_nombre.append("img")
                                .attr("src", "/content/img/covid/ic_postulacion.svg")
                                .attr("alt", "Consultar " + data[i].nomItem)
                        }
                        aux_encabezado.append("span")
                            .attr("class", "h4")
                            .text(data[i].nomItem)
                        if (data[i].label_nombre != "") {
                            aux_encabezado.append("span")
                                .attr("class", "txt-small")
                                .text(data[i].label_nombre)
                        }
                        if (nombre_aux == "FASE TURISMO") {
                            aux_encabezado.append("span")
                                .attr("class", "badge badge-pill badge-success")
                                .text("NUEVO")
                        }
                        var aux_valor = aux_fila.append("div")
                            .attr("class", "col-md-3 c-inline-item")
                        aux_valor.append("div").attr("class", "txt-small").text(data[i].label_valor)
                        aux_valor.append("span").attr("class", "bigNumber").text(valor)

                        var aux_ben = aux_fila.append("div")
                            .attr("class", "col-md-2 c-inline-item")
                        aux_ben.append("div").attr("class", "txt-small").text(data[i].label_beneficiarios)
                        if (data[i].total_beneficiarios > 0) {
                            aux_ben.append("span").attr("class", "bigNumber").text(cant_ben)
                        } else {
                            aux_ben.append("span").attr("class", "bigNumber").text(" ")
                        }

                        var rutaficha = obtRutaEnlace(nombre_aux, data[i].IdItem);
                        var externo = data[i].externo;
                        var enlace = aux_fila.append("div")
                            .attr("class", "col-md-3 c-inline-item")
                        var aux_btn = enlace.append("div")
                            .attr("class", "cta-wrapper")
                        var btn_enlace = aux_btn.append("a")
                            .attr("id", "btn_" + data[i].IdItem)
                            .attr("codigo", id_aux)

                        if (externo == false) {
                            tipoenlace = "_self";
                        } else {
                            tipoenlace = "_blank";
                        }
                        if (rutaficha != "") {
                            btn_enlace.attr('href', rutaficha);
                            btn_enlace.attr("target", tipoenlace);
                            btn_enlace.attr("tipo", "")
                            btn_enlace.attr("class", "btn btn-outlined")
                        } else {
                            btn_enlace.attr('href', "#a_" + id_aux);
                            btn_enlace.attr("tipo", "AC")
                            btn_enlace.attr("class", "btn btn-outlined enlace_prog")
                        }
                        btn_enlace.append("div")
                        btn_enlace.text(data[i].label_boton + " ")
                        btn_enlace.append("span").attr("class", "glyphicon glyphicon-circle-arrow-right")
                    }
                    configEnlaceOtros();
                }

            } else {
                alert("Error1: " + result.message, function () {

                });
            }
        },
        error: function (response) {
            alert("Error2: " + response.responseText);
        },
        failure: function (response) {
            alert("Error3: " + response.responseText);
        }
    });

}



function configEnlaceOtros() {
    $(".enlace_prog").on('click', function () {
        $('#accordion .collapse').removeClass("in");
        $("#enlacelistado_og").trigger("click");
        //$("#divListadoRecursosObje").show();
        $("#migapanlistado").val("");

        var tipo_enlace = $(this).attr("tipo")
        var id_item = $(this).attr("codigo");
        if (tipo_enlace == "AC") {
            var obj_dom = $("a[data-toggle='collapse'][ item='" + id_item + "']").attr("id");
            const el = document.getElementById(obj_dom);
            el.click();
        }

    });

}

function obtRutaEnlace(filtro, idSubsidio) {
    var rutaficha = "";
    switch (filtro) {
        case "FASE":
            rutaficha = "../Covid/PerfilSubsidio/?subsidio=" + idSubsidio;
            break;
        case "QUÉDATE EN CASA" || "QUEDATE EN CASA":
            rutaficha = "https://www.quedateencasa.gob.do/";
            break;
        case "PATI":
            rutaficha = "https://programas-beneficios.hacienda.gob.do/principal";
            break;
        case "INCENTIVOS":
            rutaficha = "";
            break;
        case "CONTRATOS":
            rutaficha = "/contratista/contratoscovid";
            break;
        case "FASE TURISMO":
            rutaficha = "../Covid/PerfilSubsidio/?subsidio=" + idSubsidio;
            //rutaficha = "https://programas-beneficios.hacienda.gob.do/principal";
            break;
        default:
            rutaficha = "";

    }
    return rutaficha;
}
function configVerMas() {

    $(".more").on('click', function () {
        var idcom = $(this).attr('idcom');
        $(".Post_user[idcom='" + idcom + "']>.complete").toggle();
        //$(".complete").toggle();
        if ($(this).text() == "Ver más...") {
            $(this).text("Ver menos...");
        } else {
            $(this).text("Ver más...");
        }
    });



    $(".accordion").on('click', function () {

        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
function configuraFiltro_DesgloseIconos() {
    $(".tipo_grafica").on('click', function () {
        $(".wrap_sankey").hide();
        var tipo = $(this).attr('codigo');
        $(".tipo_grafica").removeClass("activo");
        $(this).addClass("activo");
        $("#divListadoRecursosObje").show();
 
        if (tipo == "listado") {
            $("#iconSankey").attr("class", "txt-bold icSankey_blue");
            $("#iconTree").attr("class", "txt-bold icGrap_blue");
            $("#iconList").attr("class", "txt-bold icRD");

            $('#accordion .collapse').removeClass("in");
            $("#divGraphRecursosObj").hide();
            $("#divListadoRecursosObje").show();
            $(".boxCompoDesglose").hide();
            $(".boxTituloListado").show();
            $("#sankey_basic").empty();
            //seleccionar tab abierto
            var lstNiveles = $("#migapanlistado").val();
            var arrayNiv = lstNiveles.split(",");
            var nom_nivel = "";
            var longitud = arrayNiv.length;
            if (longitud > 0) {

                for (var i = 0; i < longitud; i++) {
                    nom_nivel = arrayNiv[i].toUpperCase();
                    switch (i) {
                        case 0:
                            var id = $(".nivel1[item='" + nom_nivel + "']").attr("id");
                            var obj = $("#" + id);
                            if (obj.length > 0) {
                                obj.addClass("in");
                            }
                            break;
                        case 1:
                            var id = $(".nivel2[entidad='" + nom_nivel + "']").attr("id");
                            var obj = $("#" + id);
                            if (obj.length > 0) {
                                obj.addClass("in");
                            }

                            break;
                        case 2:
                            var id = $(".nivel3[actividad='" + nom_nivel + "']").attr("id");
                            var obj = $("#" + id);
                            if (obj.length > 0) {
                                obj.addClass("in");
                            }
                            break;
                        default:
                            $('#accordion .collapse').removeClass("in");
                        // code block
    
                    }

                }
            } else {
                $('#accordion .collapse').removeClass("in");
            }
        } else if (tipo == "grafica") {
            $("#iconSankey").attr("class", "txt-bold icSankey_blue");
            $("#iconList").attr("class", "txt-bold icRD_blue");
            $("#iconTree").attr("class", "txt-bold icGraph");

            $("#divGraphRecursosObj").show();
            $("#divListadoRecursosObje").hide();
            $("#divGraphRecursosObj").children().remove();
            loadRecursosPorObjeto(recursosPerObjetoAvanceGroup, "divGraphRecursosObj", "avance");
            $(".boxCompoDesglose").show();
            $(".boxTituloListado").hide();
            $("#sankey_basic").empty();
        } else if (tipo == "gastoAdminCentral") {
            $("#divListadoRecursosObje").hide();
            $("#divListadoRecursosObjeEnteNoCentral").hide();
            $("#divListadoRecursosObjeEnte").show();
            

        }
        else if (tipo == "gastoDescentralizado") {
            $("#divListadoRecursosObjeEnte").hide();
            $("#divListadoRecursosObjeEnteNoCentral").show();
            $("#divListadoRecursosAdminNoCentral").show();
            $("#divListadoRecursosObje").hide();
           
        }
        else {

            //sankey
            $(".wrap_sankey").show();
            $("#iconList").attr("class", "txt-bold icRD_blue");
            $("#iconTree").attr("class", "txt-bold icGrap_blue");
            $("#iconSankey").attr("class", "txt-bold icSankey");

            $("#divGraphRecursosObj").hide();
            $("#divListadoRecursosObje").hide();
            $("#divGraphRecursosObj").children().remove();
            //$(".boxCompoDesglose").show();
            $(".boxTituloListado").hide();
            $("#sankey_basic").empty();
            ObtenerDatosArticulo(tipoEmergencia);
        }
    });
    $(".tipo_presupuesto").on('click',function (e) {
        var codigo = $(this).attr('codigo');
        $(".tipo_presupuesto").removeClass("activo");
        $(this).addClass("activo");
        $("#divListadoRecursosObje").show();

        if (codigo == "gastoAdminCentral") {
            $("#divListadoRecursosObje").hide();
            $("#divListadoRecursosObjeEnteNoCentral").hide();
            $("#divListadoRecursosObjeEnte").show();
        }
        else if (codigo == "gastoDescentralizado") {
            $("#divListadoRecursosObjeEnte").hide();
            $("#divListadoRecursosObjeEnteNoCentral").show();
            $("#divListadoRecursosObje").hide();
            //$("#divListadoRecursosObjeEnte").empty();
        }

    });
}
function configuraFiltro_Donaciones() {
    $('#enlaceDonaciones').on('click', function () {
        var val_Sel = $('#filtro_donaciones li.selected').attr('codigo');
        if ($.trim(val_Sel) != "" && val_Sel != undefined) {
            if (val_Sel == "donadores") {
                var enlace_url = "../covid/PerfilDonador";
                location.href = enlace_url;
            } else {
                var enlace_url = "../covid/PerfilBeneficiario";
                location.href = enlace_url;
            }
        }
    });

}
function ObtenerDatosArticulo(tipoEmergencia) {
   
    //var params_com = {
    //    tipoEmergencia: tipoEmergencia
    //};
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: {
            typeEmergencyId: tipoEmergencia
        },
       //JSON.stringify({ data: tipoEmergencia }),
        url: "/api/ServiciosCovid/ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia/",// + tipoEmergencia,
        cache: false,
        success: function (result) {
            if (result.status == true) {
                var data = result.distribucionEmergencia;
                if (data.length > 0) {
                    var datos = obtMatrizData(data, 1, 3);
                    $("#sankey_basic").html("");
                    graphSankey(datos);  
                    
                    loadRecursosPorObjeto(objPerContratos, "divGraphRecursosArticulos", "avance");  
                }

            } else {
                alert("Error4: " + result.message, function () {

                });
            }

        },
        error: function (response) {
            alert("Error5: " +response.responseText);
        },
        failure: function (response) {
            alert("Error6: " +response.responseText);
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


function separar_miles(num) {
    var num_aux = num;
    if (num != "0" && num != undefined) {
        num_aux = num.replace(/\./g, '');
        if (!isNaN(num_aux)) {
            num_aux = num_aux.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num_aux = num_aux.split('').reverse().join('').replace(/^[\.]/, '');
        }
    }
    return num_aux;
}
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}
function getContratosRP() {
    //alert(ruc + '      ' + nombreContratista);
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/api/serviciosContratistas/GetInformacionContratosRPCovid',
        cache: false,
        success: function (result) {
            if (result.status == true) {
                // $("#cantidadRP").html("");
                //alert(result.valorContratos);
                if (result.numContratos > 0) {
                    $("#cantidadRP").html("&nbsp;&nbsp;&nbsp;" + result.numContratos);
                    $("#totalRP").html("RD $ " + formatMoney(parseFloat(result.valorContratos / 1000000),0, ".", ",") + tituloMillones(parseFloat(result.valorContratos / 1000000).toFixed(0)));
                }
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
function convertirMillones(num) {
    return num > 999999 ? (num / 1000000).toFixed(0) : num

}
function tituloMillones(num) {
    return num > 999999 ? " Millones" : ""
}
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}
function MaysPrimera(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function loadRecursosPorObjeto(objData, divContenedor, tipo_desglose) {
    $("#" + divContenedor).empty();
    var textoExpandir = "Clic para expandir";
    var data_filter = [];
    if (objData != undefined && objData != null) {
        data_filter = objData;

        //var sumaTotal = data_filter.reduce(function (acumulador, elemento) {
        //    return acumulador + elemento.rawValue;
        //}, 0);
        for (var i = 0; i < data_filter.length; i++) {
            data_filter[i].labelGroup = data_filter[i].labelGroup.replace(",", " ");
            data_filter[i].label = data_filter[i].label.replace(",", " ");
            data_filter[i].label_inf = data_filter[i].label_inf.replace(",", " ");
            data_filter[i].label_nivel4 = data_filter[i].label_nivel4.replace(",", " ");

            data_filter[i].rawValue = parseFloat(data_filter[i].rawValue);
            //data_filter[i].porcentaje = (((data_filter[i].rawValue / sumaTotal) * 100)).toFixed(2);
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
            .select("#" + divContenedor)

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
                groupBy: ["labelGroup", "label", "label_inf", "label_nivel4"],
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
                            case 2:
                                cad = d.label_inf;
                            case 3:
                                cad = d.label_nivel4;
                            default:
                                cad = d.labelGroup;
                        }
                        //if (cad.length > longitud_tooltip) {
                        //    cad = cad.substr(0, longitud_tooltip) + "...";
                        //}
                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["rawValue"] / 1000000;
                            var cad = "";
                            cad += "<span>Gastos devengados " + "RD$ " + formatMoney(valor, 0, '.', ',').toString() + " Millones" + "</span></br>";
                            return cad;
                        }]
                    ]
                },
                yConfig: {
                    title: "",
                }
            })
            .sum("rawValue")
            .depth(0)
            .legend(false)
          
            .render();
    }





}
function loadListadoRecursosPorObjeto(objData, divContenedor) {
    //cargalistado
    $("#divGraphRecursosObj").append("<div><span>Listado</span></div>")
}
function getContratosCovid() {

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/api/serviciosContratistas/GetInformacionContratosCovidHome',
        cache: false,
        success: function (result) {
            if (result.status == true) {
                // $("#cantidadRP").html("");
                //alert(result.valorContratos);
                if (result.NumContratosActivos > 0) {
                    $("#cantidadRP").html("&nbsp;&nbsp;&nbsp;" + result.NumContratosActivos);
                    $("#totalRP").html("RD $ " + formatMoney(parseFloat(result.ValorTotalContratosActivos / 1000000),0, ".", ",") + tituloMillones(parseFloat(result.ValorTotalContratosActivos).toFixed(0)));
                }

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
function seteaListado() {
    $('#accordion .collapse').removeClass("in");
    $("#divGraphRecursosObj").hide();
    $("#divListadoRecursosObje").show();
    $(".boxCompoDesglose").hide();
    $(".boxTituloListado").show();
    $("#sankey_basic").empty();
    //seleccionar tab abierto
    var lstNiveles = $("#migapanlistado").val();
    var arrayNiv = lstNiveles.split(",");
    var nom_nivel = "";
    var longitud = arrayNiv.length;

    if (longitud > 0) {

        for (var i = 0; i < longitud; i++) {
            nom_nivel = arrayNiv[i].toUpperCase();
            switch (i) {
                case 0:
                    var id = $(".nivel1[gasto='" + nom_nivel + "']").attr("id");
                    var obj = $("#" + id);
                    if (obj.length > 0) {
                        obj.addClass("in");
                    }
                    break;
                case 1:
                    var id = $(".nivel2[entidad='" + nom_nivel + "']").attr("id");
                    var obj = $("#" + id);
                    if (obj.length > 0) {
                        obj.addClass("in");
                    }

                    break;
                case 2:
                    var id = $(".nivel3[actividad='" + nom_nivel + "']").attr("id");
                    var obj = $("#" + id);
                    if (obj.length > 0) {
                        obj.addClass("in");
                    }
                    break;
                default:
                    $('#accordion .collapse').removeClass("in");
                // code block
                //$('#accordion .collapse').removeClass("in");
            }

        }



    } else {
        $('#accordion .collapse').removeClass("in");
    }


}


