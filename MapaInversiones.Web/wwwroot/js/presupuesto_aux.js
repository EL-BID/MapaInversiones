var globales = [];
var globales_gasto = [];
var globales_entidad = [];
let grafica_entidades;
let grafica_gasto;
var longitud_tooltip = 120;
var texto_moneda = "Billones de pesos";
//-----------------------------

$("#btnAtras").hide();

var global_selector = [];

//----------------------

var anyo_actual = $("#annioPresupuesto option:selected").val();
inicializaDatos();
configuraSelectPeriodo();

//-------------------------------------------------
GetRecursosPerPlan(anyo_actual);
GetRecursosPerInstitucion(anyo_actual);
//--------------------------------------------------
ObtenerEntidadesPeriodo(anyo_actual);
GetGastoEntidadesGraphic();
GetGastoEntidadesTiempoGraphic();
//--------------------------------------------------
function inicializaDatos() {

    anyo_actual = $("#annioPresupuesto option:selected").val()
    $(".lblAnyoSelected").html(anyo_actual);
    getConsolidadoPeriodosNew(anyo_actual);


}


function configuraSelectPeriodo() {
    $('#annioPresupuesto').on('change', function () {

        anyo_actual = this.value;
        $("#annioPresupuestoText").html("" + anyo_actual);
        //------------------------------------------------
        getConsolidadoPeriodosNew(anyo_actual);
        GetRecursosPerPlan(anyo_actual);
        GetRecursosPerInstitucion(anyo_actual);

        ObtenerEntidadesPeriodo(anyo_actual);
        GetGastoEntidadesGraphic();
        GetGastoEntidadesTiempoGraphic();

    })

}

function getConsolidadoPeriodosNew(anyo_actual) {

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
            recargarTabs(result, anyo_actual);
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function recargarTabs(result, anyo_actual) {
    result.forEach(function (item) {

        var t = item.tipoGasto;   // "general"
        var vigente = Number(item.vigente);
        var comprometido = Number(item.valorComprometido);
        var giros = Number(item.valorGiros);

        var pctComprometido = (comprometido / vigente * 100).toFixed(1);
        var pctGiros = (giros / vigente * 100).toFixed(1);

        $('.valor-vigente[tipo="' + t + '"]')
            .text("$ " + shared.formatoMoneda(vigente));
        $('.valor-comprometido[tipo="' + t + '"]')
            .text("$ " + shared.formatoMoneda(comprometido));
        $('.valor-girado[tipo="' + t + '"]')
            .text("$ " + shared.formatoMoneda(giros));
        $('.porcentaje-comprometido[tipo="' + t + '"]')
            .text(shared.formatoDecimales(pctComprometido) + '%');
        $('.porcentaje-girado[tipo="' + t + '"]')
            .text(shared.formatoDecimales(pctGiros) + '%');
        $('.completed.comprometido[tipo="' + t + '"]')
            .css('width', pctComprometido + '%');
        $('.completed.girado[tipo="' + t + '"]')
            .css('width', pctGiros + '%');
    });
    $('.lblAnyoSelected').text(anyo_actual);
    //$('.lblEtiquetaMoneda').text(etiqueta_moneda);
}

/**
 * Calcula los porcentajes de participación por nivel jerárquico treemap.
 * 
 * @param {Array} data - datos base
 * @param {Array} groupBy - Array de agrupación jerárquica 1 o 2 niveles . Ej: ['clasificacion'] o ['clasificacion', 'detalleClasificacion']
 * @param {String} sumField - Campo a sumar
 * @returns {Object} - Datos con porcentajes calculados máximo 2 niveles
 */
const calcularPorcentajesContextuales = (data, groupBy, sumField) => {
    const total = data.reduce((sum, item) => sum + (+item[sumField] || 0), 0);

    if (groupBy.length === 1) {
        const padre = groupBy[0];
        data.forEach(item => {
            item.porcentajeNivel0 = total > 0 ? (item[sumField] * 100 / total) : 0;
        });
        return { data };
    }

    const padre = groupBy[0];

    const grupos = data.reduce((acc, item) => {
        const key = item[padre];
        if (!acc[key]) acc[key] = { items: [], total: 0 };
        acc[key].items.push(item);
        acc[key].total += +item[sumField] || 0;
        return acc;
    }, {});

    Object.values(grupos).forEach(grupo => {
        grupo.items.forEach(item => {
            item.porcentajeNivel0 = total > 0 ? (item[sumField] * 100 / total) : 0;
            item.porcentajeNivel1 = grupo.total > 0 ? (item[sumField] * 100 / grupo.total) : 0;
        });
    });

    return { data };
};



function GetRecursosPerPlan(anyo) {
    $("#divGraphPerFuncion").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/GetRecursosPerPlan",
        type: "GET",
        data: {
            anyo: anyo
        }
    }).done(function (data) {
        if (data.infoRecursos != null) {
            globales = data.infoRecursos;
            GraphRecursosPerPlan(globales);
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });




}

function assignColorWithSoftVariations(index) {
    var colores_originales = [
        "#f8f4f3", // gris claro
        "#c4e5ee", //celeste
        "#7ECF97", // verde esmeralda suave (cálido)"
        "#fcd96c", //amarillo 
        "#C9D36A", // Educación — oliva claro templado
        "#459F81", // verde-azulado medio
        "#6AA8A0", // teal medio
        "#5983CB", // azul medio
        "#A9D6C6", // menta/sage
        "#7DC95E", // verde vivo medio
    ];


     var colores_suaves = [
        "#F2F3F1", // gris más cálido y claro
        "#D7ECF5", // celeste claro
        "#A9D6C6", // verde esmeralda pastel
        "#FCEEB5", // amarillo pastel
        "#DCE5AD", // oliva claro desaturado
        "#78B59E", // verde-azulado más claro
        "#9BC5BF", // teal pastel
        "#B7C7E6", // azul lavanda
        "#DCEFE9", // menta/sage claro
        "#B9E7A8"  // verde vivo → más claro
    ];

    
    

    if (index < colores_originales.length) {
        return colores_originales[index] + "FF"; // 100% opacidad
    } else if (index < 20) {
        return colores_suaves[index - 10] + "FF"; // 100% opacidad
    } else {
        // Para elementos adicionales revisar opacidad
        var baseIndex = (index - 20) % 20;
        var ciclo = Math.floor((index - 20) / 20);
        var opacidades = ["CC", "99", "66", "33"]; // 80%, 60%, 40%, 20%
        if (baseIndex < 10) {
            return colores_originales[baseIndex] + opacidades[ciclo % 4];
        } else {
            return colores_suaves[baseIndex - 10] + opacidades[ciclo % 4];
        }
    }
}


function GraphRecursosPerPlan(objData) {
    $("#divGraphPerPlan").empty();

    if (!objData) return;
    // % por niveles
    const { data: dataConPorcentajes } = calcularPorcentajesContextuales(
        objData,
        ["labelGroup", "label"],
        "rawValueDouble"
    );


    grafica_gasto = new d3plus.Treemap()
        .select("#divGraphPerPlan")
        .translate(d => (d === "Back" || d === "back") ? "Atrás" :
            d === "Click to Expand" ? "Clic para expandir" :
                d === "No Data Available" ? "Información No Disponible" : d)
        .config({
            data: dataConPorcentajes,
            groupBy: ["labelGroup", "label"],
            height: 500,
           
            
            tooltipConfig: {
                title: function (d) {

                    const depth_aux = (typeof grafica_gasto?.depth === "function") ? grafica_gasto.depth() : 0;
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
                        cad = cad.slice(0, longitud_tooltip) + "...";
                    }

                    return cad;
                },
                tbody: [[d => {
                    const valor = d.rawValueDouble / 1;
                    return `<span>Presupuesto Vigente $ ${shared.formatoMoneda(valor)}</span></br>`;
                }]]
            },
            yConfig: { title: "" }
        })
        .shapeConfig({
            labelConfig: {
                fontFamily: "'Montserrat', sans-serif",
                align: "center",
                size: 6,
                transform: "capitalize"
            },
            fill: function (d, i) {
                
                return assignColorWithSoftVariations(i);
            },
            label: (d) => {
                const nivel = (typeof grafica_gasto?.depth === "function") ? grafica_gasto.depth() : 0;
                const texto = (nivel === 1 ? d?.label : d?.labelGroup) ?? "";
                const porc_aux = (nivel === 0 ? d?.porcentajeNivel0 : (d?.porcentajeNivel1 ?? d?.porcentajeNivel0)) ?? 0;
                return [String(texto), `${shared.formatoDecimales(porc_aux)}%`];
            }
        })
        .sum("rawValueDouble")
        .depth(0)
        .legend(false)
        .render();
}


function GetRecursosPerInstitucion(anyo) {
    $("#divGraphPerInstitucion").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/GetRecursosPerInstitucion",
        type: "GET",
        data: {
            anyo: anyo
        }
    }).done(function (data) {
        if (data.infoRecursos != null) {
            globales_entidad = data.infoRecursos;
            GraphPerInstitucion(globales_entidad);
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });




}

function GraphPerInstitucion(objData) {
    $("#divGraphPerInstitucion").empty();

    if (!objData) return;

    //---------------------------------------
    const etiqueta_tab = "entidades";
    $("#lblTipoInstitucion").text(etiqueta_tab);
    //-----------------------------------------------

    // % por niveles
    const { data: dataConPorcentajes } = calcularPorcentajesContextuales(
        objData,
        ["labelGroup"],
        "rawValueDouble"
    );

    grafica_entidades = new d3plus.Treemap()
        .select("#divGraphPerInstitucion")
        .translate(d => (d === "Back" || d === "back") ? "Atrás" :
            d === "Click to Expand" ? "Clic para expandir" :
                d === "No Data Available" ? "Información No Disponible" : d)
        .config({
            data: dataConPorcentajes,
            groupBy: ["labelGroup"],
            height: 500,
            tooltipConfig: {
                title: function (d) {

                    const depth_aux = (typeof grafica_entidades?.depth === "function") ? grafica_entidades.depth() : 0;
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
                        cad = cad.slice(0, longitud_tooltip) + "...";
                    }

                    return cad;
                },
                tbody: [[d => {
                    const valor = d.rawValueDouble / 1;
                    return `<span>Presupuesto Vigente $ ${shared.formatoMoneda(valor)}</span></br>`;
                }]]
            },
            yConfig: { title: "" }
        })
        .shapeConfig({
            labelConfig: {
                fontFamily: "'Montserrat', sans-serif",
                align: "center",
                size: 6,
                transform: "capitalize"
            },
            fill: function (d, i) {
                return assignColorWithSoftVariations(i);
            },
            label: (d) => {
                const nivel = (typeof grafica_entidades?.depth === "function") ? grafica_entidades.depth() : 0;
                const texto = (nivel === 1 ? d?.label : d?.labelGroup) ?? "";
                const porc_aux = (nivel === 0 ? d?.porcentajeNivel0 : (d?.porcentajeNivel1 ?? d?.porcentajeNivel0)) ?? 0;
                return [String(texto), `${shared.formatoDecimales(porc_aux)}%`];
            }
        })
        .sum("rawValueDouble")
        .depth(0)
        .legend(false)
        .render();
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
        global_selector = result;
        drawSelectorEntidades(global_selector);

    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function drawSelectorEntidades(objData) {
    $("#divContenedorEntidades, #divContenedorEntidadesPag").empty();
    data_filter = objData;
 
    if (!data_filter.length) return;  

    const maximo = 5;
    let html_aux = "";

    let opciones = '<option value="">Seleccione</option>';
    for (let i = 0; i < data_filter.length; i++) {
        const id = data_filter[i].label.trim();
        const nom = data_filter[i].label_inf.trim();
        opciones += '<option value="' + id + '">' + nom + '</option>';

    }

    const N = Math.min(maximo, data_filter.length);
    for (let j = 0; j < N; j++) {
        html_aux +=
            '<div class="form-group">' +
            '<div class="form-group subtitle">' +
            '<label style="color:black;float:left;">Seleccionar entidad</label>' +
            '<select class="form-select selectEntidad" aria-label="Seleccione:">' +
            opciones +
            '</select>' +
            '</div>' +
            '</div>';
    }


    $("#divContenedorEntidades").html(html_aux);
    getEntidadesIni();
    configuraSelectEntidades();

    $("#divContenedorEntidadesPag").html(html_aux);
    configuraSelectEntidadesGasto();

}

function configuraSelectEntidadesGasto() {
    $('#divContenedorEntidadesPag .selectEntidad').on('change', function () {
        GetGastoEntidadesTiempoGraphic("btn");
    });

}

function getEntidadesIni() {
    $(".selectEntidad").each(function () {

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
    const entidades = $("#divContenedorEntidades .selectEntidad option:selected")
        .map(function () { return this.value; })  // IDs/códigos
        .get()
        .filter(Boolean);

    const cont = entidades.length;
    $("#topEntidadesG").text(cont ? "Comparativo" : "Top");

    const filtro = entidades.join("|");


    GetGastoEntidades(anyo_actual, filtro);
}


function GetGastoEntidades(annio, filtro) {
    $("#divGraphBarChartGastoEntidades").empty();
    var tipo_dato = "top";
    //---------------
    $.ajax({
        url: "api/ServiciosPresupuestoNew/BarChartEntidades/",
        type: "GET",
        data: {
            anyo: annio,
            filtro: filtro
            
        }

    }).done(function (data) {
        var result = data.infoRecursos;
        loadBarChartEntidades(result, "divGraphBarChartGastoEntidades");

    }).fail(function (handleError) {

    });
}

//*------FUNCIONES FORMATEO ESCALAS GRAFICAS D3PLUS 2.0 ------ */
function resolveUnitMB(maxRaw) {
    const UNITS = {
        pesos: { label: "Pesos", factor: 1 },
        millones: { label: "Millones de pesos", factor: 1e6 },
        billones: { label: "Billones de pesos", factor: 1e12 }
    };

    const order = ["billones", "millones", "pesos"];
    for (const k of order) {
        const u = UNITS[k];
        const v = maxRaw / u.factor;
        if (v >= 1 && v < 1000) return u;
    }
    return UNITS.millones;
}

////Función para decidir rotación del eje 
function decideRotation(containerEl, maxValue, unit, {
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

    //si el valor máximo formateado es largo, rotar
    const fmt = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
    const maxLabel = fmt.format(maxValue);

    if (maxLabel.length > 5) return 90;

    //espacio disponible vs necesario
    const estimatedLabelWidth = maxLabel.length * 8; // aprox 8px por caracter
    const availableGap = (W * innerFrac) / 5; // aprox 5-6 ticks

    return (estimatedLabelWidth + minGap > availableGap) ? 90 : 0;
}
//* ---------FIN FORMATEO ESCALAS-------- */
function loadBarChartEntidades(objData, divContenedor, tipo) {
    

    const data = (objData || []).map(d => ({
        ...d,
        rawValue: +d.rawValue,
        label: (d.label || "").trim(),           // Agregar esta línea
        labelGroup: (d.labelGroup || "").trim()  // Agregar esta línea
    }));

    d3.select("#" + divContenedor).selectAll("*").remove();
    if (!data.length) return;     

    //unidad automáticamente
    const maxRaw = d3.max(data, d => +d.rawValue) || 1;
    const unit = resolveUnitMB(maxRaw);

    // Dominio 
    const maxValue = d3.max(data, d => +d.rawValue / unit.factor) || 1;
    let roundedMax;

    //Separación de ticks
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
    const fmt = new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0
    });

    const chart = new d3plus.BarChart()
        .select("#" + divContenedor)
        .config({
            data,
            groupBy: ["label", "labelGroup"],
            type: "bar",
            // Convertir a unidad apropiada
            x: d => +d.rawValue / unit.factor,
            y: "label",
            discrete: "y",

            xConfig: {
                scale: "linear",
                nice: true,  // d3plus ticks
                tickFormat: v => fmt.format(v),
                labelRotation: rotation,
                title: unit.label,
                domain: [0, roundedMax]
            },

            yConfig: {
                title: "",
                orient: "left"              
                
            },

            shapeConfig: {
                label: false,
                fill: d => assignColorBarrasAvance(d.labelGroup)
            },

            tooltipConfig: {
                title: d => "Presupuesto " + d.labelGroup,
                tbody: [[d => {
                    const base = "$ " + shared.formatoMoneda(d.rawValue);
                    return (d.porcentaje != null) ? `${base} (${d.porcentaje}% )` : base;
                }]]
            },

            legend: false
        })
        .barPadding(0)
        .groupPadding(10)
        .render();
}

//--------------------------------------------

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
    const entidades = $("#divContenedorEntidadesPag .selectEntidad option:selected")
        .map(function () { return this.value; })  // IDs/códigos
        .get()
        .filter(Boolean);

    const cont = entidades.length;
    $("#topEntidadesPag").text(cont ? "Comparativo" : "Top");

    const filtro = entidades.join("|");


    GetGastoTiempoEntidades(anyo_actual, filtro);


}

function GetGastoTiempoEntidades(annio, filtro) {

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

    });
}

function LoadLineEntidadesPerTiempo(objData, divContenedor) {
    

    const data = (objData || []).map(d => ({
        ...d,
        rawValue: +d.rawValue,
        label: (d.label || "").trim(),           // Agregar esta línea
        labelGroup: (d.labelGroup || "").trim()  // Agregar esta línea
    }));

    if (!data.length) return;

    //unidad basándose valor máximo
    const maxRaw = d3.max(data, d => +d.rawValue) || 1;
    const unit = resolveUnitMB(maxRaw);

    //dominio redondeado hacia arriba para el eje Y
    const maxValue = maxRaw / unit.factor;
    let roundedMax;

    //Separación de ticks
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


    // Formato eje Y
    const fmt = new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0
    });

    var configuracion = {
        height: 600,
        data: data,
        groupBy: "labelGroup",
        lineLabels: false,
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
                ["Pagado:", function (d) { return "$ " + shared.formatoMoneda(d["rawValue"]) }]
            ]
        },
        lineMarkers: true,
        lineMarkerConfig: {
            fill: "blue",
            r: 3
        },
        x: "label",
        y: d => +d.rawValue / unit.factor, // Convertir a unidad apropiada
        yConfig: {
            title: unit.label, // Título dinámico
            domain: [0, roundedMax], // Dominio controlado
            tickFormat: v => fmt.format(v) // Formateo de etiquetas
        },
        xConfig: {
            title: "Meses",
            tickFormat: function (value) {
                var cad_mes = getNomMes(value);
                return cad_mes;
            }
        },
        legend: true

    };

    new d3plus.LinePlot()
        .translate(d => (d === "Back" || d === "back") ? "Atrás" :
            d === "Click to Hide" ? "Clic para ocultar esta entidad" :
                d === "Click to Show" ? "Clic para ocultar esta entidad" :
                    d === "Shift+Click to Highlight" ? "Usar Shift+clic para resaltar solo esta entidad" :
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
