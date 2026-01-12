var globales = [];
var globales_gasto = [];
var globales_entidad = [];
let grafica_entidades;
let grafica_gasto;
var longitud_tooltip = 120;
var texto_moneda = "Billones de pesos";
var global_selector = [];
var anyo_actual;
//-----------------------------


const etiquetasInstituciones = [
    { tipo: 'general', etiqueta_bd:'Presupuesto Anual', etiqueta_instituciones: 'secretarías, departamentos y unidades de la Alcaldía ', etiqueta_select:'secretarías, departamentos y/o unidades de la Alcaldía'},
    { tipo: 'empresas', etiqueta_bd:'Presupuesto de Empresas', etiqueta_instituciones: 'las empresas ', etiqueta_select:'empresas'  },
    { tipo: 'fondos', etiqueta_bd:'Presupuesto de los Fondos de Desarrollo Local', etiqueta_instituciones: 'los fondos de desarrollo local ', etiqueta_select: 'fondos de desarrollo local'}
];

//----------------------
inicializaDatos();
//----------------------

function inicializaDatos() {
    $("#btnAtras").hide();
    

    //Listener
    cargarSectionDefault();

    //Consolidados
    anyo_actual = $("#annioPresupuesto option:selected").val();
    $(".lblAnyoSelected").html(anyo_actual);
    getConsolidadoPeriodosNew(anyo_actual);

    var $activo = $('.tabs-nav li.active');
    var tipo_tab = $activo.find('.goal-name').attr('tipo');
    const etiqueta_selector = etiquetasInstituciones.find(e => e.tipo === tipo_tab)?.etiqueta_select ?? '';
    $(".lblEtiquetaEntidad").text(etiqueta_selector);

    //Configuraciones
    configuraSelectPeriodo();
    configTabCambio();

    //GraficosTreemap
    GetRecursosPerPlan(anyo_actual);

    GetRecursosPerInstitucion(anyo_actual);



    //GraficoBarras
    ObtenerEntidadesPeriodo(anyo_actual);
    GetGastoEntidadesGraphic();
}

function cargarSectionDefault() {
    if (window.location.search.includes('type=') && !$('body').hasClass('scroll-realizado')) {
        var section = $('#type_section').val();
        var contenedor = "";

        if (section == "entidad") {
            contenedor = "RecursosPerByInstitucion";
        }

        if (contenedor) {
            //Overlay simple
            $('body').append(`
                <div id="scroll-overlay" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    z-index: 9999;
                "></div>
            `);

            var $treemap = $('#divGraphPerPlan');

            if ($treemap.length > 0) {
                // Scroll instantáneo (invisible bajo el overlay)
                $treemap[0].scrollIntoView({ behavior: 'auto' });

                // Esperar carga treemap
                $(document).one('GraficoCargado', function () {
                    setTimeout(function () {
                        var $destino = $('#' + contenedor);

                        if ($destino.length > 0) {
                            // Scroll al destino (invisible)
                            $destino[0].scrollIntoView({ behavior: 'auto' });

                            //Remover overlay con fade suave
                            $('#scroll-overlay').fadeOut(100, function () {
                                $(this).remove();
                            });

                            $('body').addClass('scroll-realizado');
                        }
                    }, 100);
                });
            } else {
                $('#scroll-overlay').remove();
            }
        }
    }
}

function configTabCambio() {
    $('.tabs-nav').on('click', 'li.enlace_nivel_administracion', function () {
       
        var $li = $(this);
        var tipo_tab = $li.find('.goal-name').attr('tipo');
       

        const etiqueta_selector = etiquetasInstituciones.find(e => e.tipo === tipo_tab)?.etiqueta_select ?? '';
        $(".lblEtiquetaEntidad").text(etiqueta_selector);

        if (tipo_tab == "empresas") {
            $("#divDisposicionFinal").show();
        } else {
            $("#divDisposicionFinal").hide();
        }

        //actualiza treemap x Sectores
        if (globales.length > 0) {
            GraphRecursosPerPlan(globales);
        }

        //actualiza treemap x instituciones
        if (globales_entidad.length > 0) {
            GraphPerInstitucion(globales_entidad);
        }

        //actualiza select entidades
        
        if (global_selector.length > 0) {
            drawSelectorEntidades(global_selector);
            GetGastoEntidadesGraphic();
            //GetGastoEntidadesTiempoGraphic();
        }
        


        
    });
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
        //GetGastoEntidadesTiempoGraphic();
        
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
        
        console.log("Error ajax " + xhr.status + "_" + thrownError);
    });

}

function recargarTabs(result, anyo_actual) {
    result.forEach(function (item) {
       
        var t = item.tipoGasto;   // "general" | "empresas" | "fondos"
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
        "#e6e6e6", // gris claro
        "#c4e5ee", // azul claro
        "#fcd96c", // amarillo
        "#3e5174", // azul oscuro
        "#ea5670", // rosa/rojo
        "#999999", // gris medio
        "#1c717f", // azul verdoso oscuro
        "#64b5e2", // azul medio
        "#7fcbdc", // azul claro verdoso
        "#e7753d"  // naranja
    ];

    var colores_suaves = [
        "#f0f0f0", // soft gris claro
        "#d9eff5", // soft azul claro
        "#fde394", // soft amarillo
        "#5c6b8a", // soft azul oscuro
        "#ee7b8f", // soft rosa/rojo
        "#b3b3b3", // soft gris medio
        "#4a8b95", // soft azul verdoso oscuro
        "#8ac5e8", // soft azul medio
        "#9dd4e0", // soft azul claro verdoso
        "#ec9566"  // soft naranja
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
    var vieneConParametro = window.location.search.includes('type=entidad');
    var section = $('#type_section').val();


    $("#divGraphPerPlan").empty();

    if (!objData) return;

    const $activo = $('.tabs-nav li.active');
    const tipo_tab = ($activo.find('.goal-name').attr('tipo') || "").toLowerCase();
    const isFondos = tipo_tab === "fondos";

    if (!isFondos) {
        $("#divContenedorPerPlan").show();
        // filtrar
        const data_filter = objData.filter(it => (it.tipoGasto || "").toLowerCase() === tipo_tab);

        // % por niveles
        const { data: dataConPorcentajes } = calcularPorcentajesContextuales(
            data_filter,
            ["labelGroup", "label"],
            "rawValueDouble"
        );

        // colores
        const keysUnicas = [...new Set(data_filter.map(it => isFondos ? it.labelGroup : it.labelGroup))].sort();
        const colorMapping = {};
        keysUnicas.forEach((k, i) => colorMapping[k] = assignColorWithSoftVariations(i));

        // groupBy dinámico
        const groupKeys = isFondos ? ["labelGroup"] : ["labelGroup", "label"];
        const nivel_aux = isFondos ? 0 : 0;


        grafica_gasto = new d3plus.Treemap()
            .select("#divGraphPerPlan")
            .translate(d => (d === "Back" || d === "back") ? "Atrás" :
                d === "Click to Expand" ? "Clic para expandir" :
                    d === "No Data Available" ? "Información No Disponible" : d)
            .config({
                data: dataConPorcentajes,
                groupBy: groupKeys,
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

            .depth(nivel_aux)
            .legend(false)
            .render(function () {

                $(document).trigger("GraficoCargado");
            });
    } else {

        $("#divContenedorPerPlan").hide();

        $(document).trigger("GraficoCargado");

    }

    
    
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

    const $activo = $('.tabs-nav li.active');
    const tipo_tab = ($activo.find('.goal-name').attr('tipo') || "").toLowerCase();
    const isFondos = tipo_tab === "fondos";
    //---------------------------------------
    const etiqueta_tab = etiquetasInstituciones.find(e => e.tipo === tipo_tab)?.etiqueta_instituciones ?? '';
    $("#lblTipoInstitucion").text(etiqueta_tab);
    //-----------------------------------------------
    // filtrar
    const data_filter = objData.filter(it => (it.tipoGasto || "").toLowerCase() === tipo_tab);

    // % por niveles
    const { data: dataConPorcentajes } = calcularPorcentajesContextuales(
        data_filter,
        ["label","label_inf"],
        "rawValueDouble"
    );
    
    // groupBy dinámico
    const groupKeys = ["label","label_inf"];
    const nivel_aux = 0;


    grafica_entidades = new d3plus.Treemap()
        .select("#divGraphPerInstitucion")
        .translate(d => (d === "Back" || d === "back") ? "Atrás" :
            d === "Click to Expand" ? "Clic para expandir" :
                d === "No Data Available" ? "Información No Disponible" : d)
        .config({
            data: dataConPorcentajes,
            groupBy: ["label","label_inf"],
            height: 500,
            tooltipConfig: {
                title: function (d) {

                    const depth_aux = (typeof grafica_entidades?.depth === "function") ? grafica_entidades.depth() : 0;
                    var longitud_tooltip = 80;
                    var cad = '';
                    switch (depth_aux) {
                        case 0:
                            cad = d.label;
                            break;
                        case 1:
                            cad = d.label_inf;
                            break;
                        
                        default:
                            cad = d.label;
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
                const texto = (nivel === 1 ? d?.label_inf : d?.label) ?? "";
                const porc_aux = (nivel === 0 ? d?.porcentajeNivel0 : (d?.porcentajeNivel1 ?? d?.porcentajeNivel0)) ?? 0;
                return [String(texto), `${shared.formatoDecimales(porc_aux)}%`];
            }
        })
        .sum("rawValueDouble")

        .depth(nivel_aux)
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

    //filtrar x tab
    const tipo_tab = ($('.tabs-nav li.active .goal-name').attr('tipo') || "").toLowerCase();
    //const data_filter = (objData || []).filter(it => (it.labelGroup || "").toLowerCase() === tipo_tab);
    //if (!data_filter.length) return;

    const data_filter = (objData ?? [])
        .filter(it => (it.labelGroup || "").toLowerCase() === tipo_tab)
        .sort((a, b) =>
            (a.label_inf ?? "").localeCompare(b.label_inf ?? "", "es", {
                sensitivity: "base", // ignora acentos y mayúsculas
                numeric: true        
            })
        );

    if (!data_filter.length) return;




    const maximo = 5;
    let html_aux = "";

    let opciones = '<option value="">Seleccione</option>';
    for (let i = 0; i < data_filter.length; i++) {
        const id = data_filter[i].label;      
        const nom = data_filter[i].label_inf; 
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
        //GetGastoEntidadesTiempoGraphic("btn");
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
    $("#topEntidadesG").text(cont ? "Comparativo" : "Top de entidades por presupuesto vigente");

    const filtro = entidades.join("|");
    

    GetGastoEntidades(anyo_actual, filtro);
}


function GetGastoEntidades(annio, filtro) {
    $("#divGraphBarChartGastoEntidades").empty();
    var tipo_dato = "top";

    //filtrar x tab
    var $activo = $('.tabs-nav li.active');
    var tipo_tab = $activo.find('.goal-name').attr('tipo');
    //---------------
    const encontrado = etiquetasInstituciones.find(e => e.tipo === tipo_tab);
    const etiquetaBD = encontrado ? encontrado.etiqueta_bd : '';
    //---------------


    $.ajax({
        url: "api/ServiciosPresupuestoNew/BarChartEntidades/",
        type: "GET",
        data: {
            anyo: annio,
            filtro: filtro,
            tipoGasto: etiquetaBD
        }

    }).done(function (data) {
        var result = data;
        var result = data.infoRecursos;
        //$("#divGraphBarChartGastoEntidades").empty();

        loadBarChartEntidades(result, "divGraphBarChartGastoEntidades");

    }).fail(function (handleError) {

    });
}

//*------FUNCIONES FORMATEO ESCALAS GRAFICAS D3PLUS 2.0 ------ */
function resolveUnitMB(dataArray) {
    //umbral mínimo para una unidad legible
    const UMBRAL_MINIMO = 1; 

    const UNITS = {
        pesos: { label: "Pesos", factor: 1 },
        millones: { label: "Millones de pesos", factor: 1e6 },
        milesMillones: { label: "Miles de millones de pesos", factor: 1e9 },
        billones: { label: "Billones de pesos", factor: 1e12 }
    };

    const valores = dataArray.filter(v => v > 0);
    if (!valores.length) return UNITS.millones;

    const maxRaw = Math.max(...valores);
    const minRaw = Math.min(...valores);

    const order = ["billones","milesMillones","millones", "pesos"];
    for (const k of order) {
        const u = UNITS[k];
        const maxInUnit = maxRaw / u.factor;
        const minInUnit = minRaw / u.factor;

        if (maxInUnit >= 1 && maxInUnit < 10000 && minInUnit >= UMBRAL_MINIMO) {
            return u;
        }
    }

    return UNITS.millones;
}
function resolveUnitMBOld(maxRaw) {
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
    const data = (objData || []).map(d => ({ ...d, rawValue: +d.rawValue }));

    d3.select("#" + divContenedor).selectAll("*").remove();
    if (!data.length) return;

    //*unidad automáticamente*/
    //const maxRaw = d3.max(data, d => +d.rawValue) || 1;
    //const unit = resolveUnitMB(maxRaw);

    const unit = resolveUnitMB(data.map(d => d.rawValue));

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
                tickFormat: (d) => {
                    const maxLineLength = 40;
                    const maxTotalLength = 80;

                    // Si es muy corto, dejarlo igual
                    if (d.length <= maxLineLength) return d;

                    // Si es muy largo, truncar primero
                    let text = d.length > maxTotalLength ? d.substring(0, maxTotalLength) + "..." : d;

                    // Partir en la mitad aproximada en un espacio
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
                    const fmtDinamico = new Intl.NumberFormat("es-CO", {
                        maximumFractionDigits: decimales,
                        minimumFractionDigits: 0
                    });
                    return fmtDinamico.format(valorEnUnidad);
                },
                fill: d => assignColorBarrasAvance(d.labelGroup),
                Bar: {
                    height: 20  // ← Aumentado de 15 a 20
                }
            },
            tooltip: false
        })
        .barPadding(barPadding)
        .groupPadding(20)
        .render();
}

//--------------------------------------------
function assignColorBarrasAvance(indice) {
    if (indice && typeof indice === 'string' && indice.trim().length > 0) {
        switch (indice.trim().toUpperCase()) {
            case "GIRADO":
                return "#4CAF50";
            case "COMPROMETIDO":
                return "#FF9800";
            case "VIGENTE":
                return "#607D8B";
            default:
                return "#666666";
        }
    }
    return "#666666";
}


function GetGastoEntidadesTiempoGraphic(origen) {
    const entidades = $("#divContenedorEntidadesPag .selectEntidad option:selected")
        .map(function () { return this.value; })  // IDs/códigos
        .get()
        .filter(Boolean);

    const cont = entidades.length;
    $("#topEntidadesPag").text(cont ? "Comparativo" : "Top entidades");

    const filtro = entidades.join("|");
    
       
    GetGastoTiempoEntidades(anyo_actual, filtro);


}

function GetGastoTiempoEntidades(annio, filtro) {
    var tipo_dato = "top";
    //filtrar x tab
    var $activo = $('.tabs-nav li.active');
    var tipo_tab = $activo.find('.goal-name').attr('tipo');

    //---------------
    const encontrado = etiquetasInstituciones.find(e => e.tipo === tipo_tab);
    const etiquetaBD = encontrado ? encontrado.etiqueta_bd : '';
    //---------------


    $.ajax({
        url: "api/ServiciosPresupuestoNew/BarChartTiempoEntidades/",
        type: "GET",
        data: {
            anyo: annio,
            filtro: filtro,
            tipoGasto: etiquetaBD

        }

    }).done(function (data) {
        var result = data.infoRecursos;

        $("#grafico_lineas").empty();
        LoadLineEntidadesPerTiempo(result, "grafico_lineas");

    }).fail(function (handleError) {

    });
}

function LoadLineEntidadesPerTiempo(objData, divContenedor) {
    const data = (objData || []).map(d => ({ ...d, rawValue: +d.rawValue }));

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
        }
       
    };

    new d3plus.LinePlot()
        .translate(d => (d === "Back" || d === "back") ? "Atrás" :
            d === "Click to Hide" ? "Clic para ocultar esta entidad" :
                d === "Click to Show" ? "Clic para ocultar esta entidad" :
                d === "Shift+Click to Highlight" ? "Usar Shift+clic para resaltar solo esta entidad":
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



