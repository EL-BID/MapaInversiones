var sector_ideas_globales = [];
var anyo_actual = $("#anioPresupuesto").val();
$("#lblAnyoBannerSec").text(anyo_actual);
var graficaDibujada = false;
var data_vigencia = JSON.parse(document.body.getAttribute('data-vigencia'));
var porcentaje = 0.2;
var factor_moneda = 1000000000000;
var etiqueta_moneda = "billones";
var texto_moneda = "Billones de pesos";
var globales_entidad = [];

var porc_giros = (data_vigencia[0].ValGiros / data_vigencia[0].Presupuesto);
var porc_comprometido = (data_vigencia[0].ValComprometido / data_vigencia[0].Presupuesto);

drawDonaVigencia("#graphDonaComprometido", porc_comprometido);       
drawDonaVigencia("#graphDonaGiros", porc_giros, "#9FCC95"); 
///-------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    configRedirectMonitoreo();
    ObtenerPorcentajeParticipacionSector(anyo_actual);
    ObtenerPorcentajeParticipacionEntidad(anyo_actual);
});
///--------------------------------------------------------
function configRedirectMonitoreo() {
    $(document).on('click', '.enlace_monitoreo', function (e) {
        e.preventDefault();
        var parametro_aux = $(this).attr("parametro");
        var url = "/MonitoreoCiudadano?type=" + parametro_aux; // Verifica que la URL sea correcta
        window.open(url, "_blank");
    });
}

function drawDonaVigencia(selector, porcentaje, colorActivo = "#4AAEE8") {
    var porc_calculo = "";
    porc_calculo = shared.formatoDecimales(porcentaje*100, 1).toString() + "%";

    const colorInactivo = "#E6E6E6";
    const totalSegmentos = 20;

    // Tamaño lógico del gráfico
    const outerRadius = 45;
    const innerRadius = 33;
    const viewSize = 120;

    const data = Array.from({ length: totalSegmentos }, (_, i) =>
        i < porcentaje * totalSegmentos ? 1 : 0
    );

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    const pie = d3.pie()
        .value(1)
        .sort(null);

    const svg = d3.select(selector)
        .append("svg")
        .attr("viewBox", `0 0 ${viewSize} ${viewSize}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "50%")
        .style("height", "auto");

    const g = svg.append("g")
        .attr("transform", `translate(${viewSize / 2}, ${viewSize / 2})`);

    g.selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arc)
        .attr("fill", (d, i) =>
            i < porcentaje * totalSegmentos ? colorActivo : colorInactivo
        )
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("pointer-events", "none");

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#1a5ea0")
        .text(porc_calculo);
}



function ObtenerPorcentajeParticipacionSector(anyo_actual) {
    $("#divEnQueInvirtieron").empty();
    $("#cardEnQueInvirtieron").empty();
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosHome/ObtenerPorcentajeParticipacionSector",
        cache: false,
        data: { Annio: anyo_actual },
        success: function (result) {
            if (result.status == true) {
                var data = result.participacionSector;
                if (data != null) {
                    loadDonaGraph("divEnQueInvirtieron", data);
                    loadSectores("cardEnQueInvirtieron", data);

                }

            } else {
                alert("Error: " + result.Message);
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

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

function loadDonaGraph(divContenedor, myData) {
    function drawDona(divContenedor, myData) {
        $("#" + divContenedor).empty();
        const container = document.getElementById(divContenedor);
        var parentCarousel = container.closest('.carousel');
        if (parentCarousel) {
            var parentStyles = window.getComputedStyle(parentCarousel);
            if (parentStyles.display !== "none" && parentStyles.visibility !== "hidden") {
                if (myData != undefined && myData != null) {
                    const containerWidth = container.getBoundingClientRect().width;
                    const containerHeight = containerWidth * 1.2;

                    //Comparacion
                    const cmp = (a, b) =>
                        (a.orden - b.orden) || d3.descending(a.porcentaje, b.porcentaje);

                    //pre orden y asignacion de color x dato
                    const sortedData = myData.slice().sort(cmp).map((item, index) => ({
                        ...item,
                        color: assignColorPaleta(index)
                    }));
                    new d3plus.Donut()
                        .select("#" + divContenedor)
                        .config({
                            data: sortedData,
                            groupBy: "label",
                            label: d => shared.formatoDecimales(d["porcentaje"], 1, ',', '.').toString() + "%",
                            padAngle: 0.01,
                            sort: (a, b) => 0,  //mantener el orden origen
                            legend: true,
                            legendPosition: "bottom",
                            value: "valorVigente",
                            //color: (d, i) => assignColorPaleta(i),  // asignacion x indice
                            color: d => d.color, 
                            width: containerWidth,
                            height: Math.min(containerHeight, 400),
                            tooltipConfig: {
                                title: function (d) {
                                    return d["label"];
                                },
                                tbody: [
                                    [function (d) {
                                        var cad_aux = shared.formatoMoneda(d["valorVigente"], 1);
                                        if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                                            cad_aux = shared.formatoMoneda(d["valorVigente"], 1) + " <strong>(" + shared.formatoDecimales(d["porcentaje"], 1, ',', '.').toString() + " %)</strong>";
                                        }
                                        return cad_aux;
                                    }]
                                ]
                            },
                            legendConfig: {
                                label(d, i) {
                                    return d["label"];
                                },
                                data: sortedData,  //forzar orden en la leyenda
                                
                            }
                        })
                        .legendTooltip({ footer: "" })
                        .on({ "click.legend": () => { } })
                        .detectVisible(false) 
                        .duration(0)
                        .render();
                }
            }
        }
    }

    function updateDona() {
        // Solo se renderiza si el contenedor es visible y la gráfica aún no se ha dibujado.
        if (!graficaDibujada && $("#" + divContenedor).is(":visible")) {
            drawDona(divContenedor, myData);
            graficaDibujada = true;
        }
    }

    // Intento inicial de renderizar
    //updateDona();

    /// Listener para redibujar la gráfica cuando se haga visible la diapositiva en el carrusel.
    $('.carousel').on('settle.flickity', function () {
        // Si la diapositiva activa contiene el contenedor y la gráfica aún no se ha dibujado.
        var $activeSlide = $(this).find('.is-selected');
        if ($activeSlide.find('#' + divContenedor).length > 0) {
            updateDona();
        }
    });

    // Cada vez que se redimensiona la ventana, usa debounce para evitar llamadas múltiples.
    window.addEventListener("resize", debounce(() => {
        drawDona(divContenedor, myData);
    }, 300));

    


}

function assignColorPaleta(indice) {
    var color_aux = "#CCCCCC";
    var col_sel = color_aux;
    var colores_default = ["#8B3CB8", "#459F7D", "#F19D5B", "#E3CF85", "#E99FD4", "#99A7CC", "#97CFAE", "#BCD7CE", "#F19996"];
    if (indice < colores_default.length) {
        col_sel = colores_default[indice];
    }
    return col_sel;
}



function loadSectores(divContenedor, objData) {
    var limite = 3;
    var html = "";
    if (objData.length < 3) {
        limite = objData.length;
    }

    for (var j = 0; j < limite; j++) {
        var label_aux = objData[j]["label"];
        var icono = objData[j]["iconoSector"];       

        html += '<div class="col-xl-4">';
        html += '<div class="card-info">';
        if (parseInt(objData[j]["codigoSector"])> 0) {
            html += '<a href="/PerfilSector?id=' + objData[j]["codigoSector"] + '" target="_blank">';
        }        
        html += '<div class="wrap-icon"><img src="/img/' + icono + '" alt="icono sectores" /></div>';
        html += '<div class="card-info-content">';
        html += '<span class="h5">' + objData[j]["label"] + '</span>';
        html += '<span class="number-data">$' + shared.formatoMoneda(objData[j]["valorVigente"],1)  +'</span>                                                           ';
        html += '<small>Presupuesto vigente</small>';
        html += '</div>';
        html += '</a>';
        html += '</div>';
        html += '</div>';
    }

    $("#" + divContenedor).html(html);                                                                                            


}
function ObtenerPorcentajeParticipacionEntidad(anyo_actual) {
    $("#divQuienInvirtio").empty();
    $("#cardQuienInvirtio").empty();
    
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosHome/ObtenerPorcentajeParticipacionEntidad",
        cache: false,
        data: { Annio: anyo_actual },
        success: function (result) {
            if (result.status == true) {
                var data = result.participacionEntidad;
                if (data != null) {
                  
                    globales_entidad = data;
                    if (globales_entidad.length > 0) {
                        loadBarChartEntidades(globales_entidad, "divQuienInvirtio");
                        loadEntidades("cardQuienInvirtio", data);
                    }
                    

                }

            } else {
                alert("Error: " + result.Message);
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


function loadEntidades(divContenedor, objData) {
    var limite = 3;
    var cont = limite;
    var html = "";
    if (objData != undefined && objData != null) {
        if (objData.length < limite) {
            cont = objData.length;
        }

        for (var j = 0; j < cont; j++) {
            const codigo_ent = (objData[j]?.codigoInstitucion ?? "").toString().trim(); 
            html += '<div class="col-xl-4"> ';
            html += '<div class="card-info">';

            if (codigo_ent !== "00") {
                html += '<a href="/PerfilEntidad?codEntidad=' + objData[j]["codigoInstitucion"] + '" target="_blank">';
            }            
            html += '<div class="card-info-content">';
            html += '<span class="h5">' + objData[j]["label"] + '</span>';
            html += '<span class="number-data">$' + shared.formatoMoneda(objData[j]["valorVigente"],1) + '</span>';
            html += '<small>Presupuesto vigente</small>';
            html += '</div>';
            html += '</a>';
            html += '</div>';
            html += '</div>';
        }
    }
    
    $("#" + divContenedor).html(html);


}

var paleta =  [
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
];

var palette = [
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
];

function colorPorPosicion(posicion) {
    return paleta[posicion % paleta.length];
}

// ───────── Funciones barchat d3 version 7.0 ─────────
function truncateText(text, maxWidth, textElem) {
    let t = text;
    textElem.textContent = t;
    while (textElem.getComputedTextLength() > maxWidth && t.length > 0) {
        t = t.slice(0, -1);
        textElem.textContent = t + "…";
    }
}
function rgb(hex) {
    const n = Number(`0x${hex.slice(1)}`);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function isDark(hex) {
    const { r, g, b } = rgb(hex);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140;   // luminancia
}

function drawHorizontalBarChart(selector, data) {
    /* 1. datos ordenados */
    const arr = [...data].sort((a, b) => b.valorVigente - a.valorVigente);

    /* 2. escena */
    const cont = d3.select(selector).style('overflow', 'hidden');
    cont.selectAll('*').remove();

    const fullW = parseInt(cont.style('width'));
    const m = { t: 20, r: 10, b: 30, l: 10 };
    const bw = 34;                       // alto de barra
    const h = bw * arr.length;
    const w = fullW - m.l - m.r;

    const svg = cont.append('svg')
        .attr('viewBox', [0, 0, fullW, h + m.t + m.b])
        .attr('preserveAspectRatio', 'xMinYMin meet');

    const g = svg.append('g')
        .attr('transform', `translate(${m.l},${m.t})`);

    /* 3. escalas */
    const x = d3.scaleLinear()
        .domain([0, d3.max(arr, d => d.valorVigente)]).nice()
        .range([0, w]);

    const y = d3.scaleBand()
        .domain(arr.map(d => d.label))
        .range([0, h])
        .padding(0.15);

    /* 4. ejes */
    g.append('g')
        .call(d3.axisLeft(y).tickSize(0).tickFormat(''))
        .call(g => g.select('.domain').remove());

    g.append('g')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x)
            .ticks(6)
            .tickFormat(d => (d / 1e12).toFixed(1) + 'T')
            .tickSizeOuter(0))
        .call(g => g.select('.domain').remove());

    /* 5. barras */
    g.selectAll('rect.bar')
        .data(arr)
        .join('rect')
        .attr('class', 'bar')
        .attr('y', d => y(d.label))
        .attr('height', y.bandwidth())
        .attr('x', 0)
        .attr('width', d => x(d.valorVigente))
        .attr('fill', (d, i) => palette[i % palette.length]);

    /* 6. etiquetas al estilo D3plus */
    const pad = 6;                               // margen interior
    g.selectAll('text.lbl')
        .data(arr)
        .join('text')
        .attr('class', 'lbl')
        .attr('y', d => y(d.label) + y.bandwidth() / 2 + 5)
        .attr('font-weight', 600)
        .attr('font-size', '13px')
        .each(function (d, i) {
            const node = d3.select(this);
            const fill = palette[i % palette.length];
            const barW = x(d.valorVigente);

            node.text(d.label);                    // texto completo
            const textW = this.getComputedTextLength();

            if (barW >= textW + pad * 2) {             // ■ cabe dentro
                node
                    .attr('x', barW - pad)             // pegado al borde derecho
                    .attr('text-anchor', 'end')
                    .attr('fill', isDark(fill) ? 'white' : '#444');
            } else {                                 // ▢ fuera, a la derecha
                node
                    .attr('x', barW + pad)
                    .attr('text-anchor', 'start')
                    .attr('fill', '#444');
            }
        });
}


//------------------------------------------------------------
/*
* Función para formatear Ticks 
* parámetros:(valor,maximo valor, sufijo all: nombre largo, cantidad decimales)
*/
function formatearTicksPresupuesto(value, maxValue, tipoSufijo, decimales) {
    let sufijo;
    const esBillones = maxValue >= 1_000_000_000_000;
    const divisor = esBillones ? 1_000_000_000_000 : 1_000_000;
    
    if (tipoSufijo === "all") {
        sufijo = esBillones ? " billones" : " millones";
    } else {
        sufijo = esBillones ? " B" : " M";
    }
    const scaled = value / divisor;
    return shared.formatoDecimales(scaled, decimales, ".", ",") + sufijo;
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

///generacion grafico barras horizontales lib d3plus versión 2.0
function loadBarChartEntidades(objData, divContenedor, tipo) {

    const data = (objData || []).map(d => ({ ...d, valorVigente: +d.valorVigente }));

    d3.select("#" + divContenedor).selectAll("*").remove();

    if (!data.length) {
        $("#" + divContenedor).html('<p>No hay datos disponibles para mostrar</p>');
        return;
    }

    const cont = document.querySelector("#" + divContenedor);
    var minHeight = 350;
   

    var contHeight = $("#" + divContenedor).innerHeight();
    var contWidth = $("#" + divContenedor).innerWidth();

    if (contHeight < minHeight) {
        contHeight = minHeight;
    }
    
    /*Escala Generica */
    //unidad automáticamente
    const maxRaw = d3.max(data, d => +d.valorVigente) || 1;
    const unit = resolveUnitMB(maxRaw);

    // Dominio 
    const maxValue = d3.max(data, d => +d.valorVigente / unit.factor) || 1;
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

   

    const rotation = decideRotation(cont, data, unit);

    // Formateo etiquetas del eje X (decimales para evitar duplicados)
    const fmt = new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0
    });

    try {

        const chart = new d3plus.BarChart()
            .select("#" + divContenedor)
            .config({
                data,
                groupBy: ["label"],
                type: "bar",
                // Convertir a unidad apropiada
                x: d => +d.valorVigente / unit.factor,
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
                    orient: "left",
                    tickFormat: () => "",
                    tickSize: 0,
                    stroke: "none" 
                },
                shapeConfig:{
                labelConfig: { fontMin: 8, fontMax: 12 },
                fill: (d, i) => colorPorPosicion(i) || "#CCCCCC",
                label: d => `${d.label} (${shared.formatoDecimales(d.porcentaje, 1, ",", ".")}%)`
                },
                tooltipConfig:{
                    title: d => d.label,
                    tbody: [
                        ["Presupuesto vigente", d => "$" + shared.formatoMoneda(d.valorVigente, 1)]
                    ]
                },
                legend: false
            })            
            .ySort((a, b) => a.valorVigente - b.valorVigente) 
            .barPadding(10)
            .groupPadding(5)
            .width(contWidth)
            .height(contHeight)
            .detectVisible(false)
            .duration(0)            
            .render();


    } catch (error) {
        console.error('Error detallado Barchat:', error);
       
       
    }
}


$(window).on("resize", function () {
    loadBarChartEntidades(globales_entidad, "divQuienInvirtio","all");
    
});

/*Crea un gráfico de burbujas en el contenedor especificado.*/
function createBubbleChart(contenedorId, data) {
    const contenedor = document.getElementById(contenedorId);
    const colores_default_old = [
        "#459F81", "#C6C95E", "#7DC95E",
        "#C9598C", "#C159CB", "#5983CB",
        "#59C9C9", "#59C982", "#7DC95E"
    ];

    const colores_default = [
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
    ];

    let width = contenedor.clientWidth;
    let height = Math.min(width*1.2, 450);

    const tooltip = d3.select(contenedor)
        .append("div")
        .attr("class", "bubble-chart-tooltip");

    const svg = d3.select(contenedor)
        .append("svg")
        .attr("class", "bubble-chart-svg")
        .attr("width", width)
        .attr("height", height);

    function formatNumber(value) {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value);
    }

    function getTextColor(bgColor) {
        const rgb = d3.color(bgColor).rgb();  // Convierte a formato RGB
        // Calcula la luminancia (según la percepción humana del color)
        const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
        // Si la luminancia es alta, usa texto negro; si es baja, texto blanco
        return luminance > 150 ? "#555555" : "#fff";
    }

    function renderChart() {
        svg.selectAll("g").remove();

        const pack = d3.pack()
            .size([width, height])
            .padding(10);

        const root = d3.hierarchy({ children: data })
            .sum(d => d.porcentaje);

        const nodes = pack(root).leaves();

        // Calcula la caja delimitadora de todos los nodos
        const minX = d3.min(nodes, d => d.x - d.r);
        const maxX = d3.max(nodes, d => d.x + d.r);
        const minY = d3.min(nodes, d => d.y - d.r);
        const maxY = d3.max(nodes, d => d.y + d.r);

        // Calcula el offset para centrar el pack en el SVG
        const offsetX = (width - (maxX - minX)) / 2 - minX;
        const offsetY = (height - (maxY - minY)) / 2 - minY;

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.label))
            .range(colores_default);

        // Aplica el offset al grupo que contendrá cada burbuja
        const bubbles = svg.selectAll(".bubble-chart-bubble")
            .data(nodes)
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x + offsetX}, ${d.y + offsetY})`);

        bubbles.append("circle")
            .attr("class", "bubble-chart-bubble")
            .attr("r", d => d.r)
            .style("fill", d => color(d.data.label))
            .style("stroke", "#fff")
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("stroke", d3.color(color(d.data.label)).darker(1))
                    .attr("stroke-width", 4)
                    .attr("r", d.r * 1.1);

                tooltip.style("visibility", "visible")
                    .html(`
                    <strong>${d.data.label}</strong><br>
                    $ ${shared.formatoDecimales(d.data.valorVigente / 1000000, 1, ",", ".")} millones
                    (${d.data.porcentaje ? shared.formatoDecimales(d.data.porcentaje, 1, ",", ".") : '0'}%)
                `);
            })
            .on("mousemove", function (event) {
                const containerRect = contenedor.getBoundingClientRect();
                const tooltipRect = tooltip.node().getBoundingClientRect();

                let left = event.clientX - containerRect.left + 10;
                let top = event.clientY - containerRect.top + 10;

                if (left + tooltipRect.width > containerRect.width) {
                    left = containerRect.width - tooltipRect.width - 10;
                }
                if (left < 0) left = 10;

                if (top + tooltipRect.height > containerRect.height) {
                    top = containerRect.height - tooltipRect.height - 10;
                }
                if (top < 0) top = 10;

                tooltip.style("top", `${top}px`).style("left", `${left}px`);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1)
                    .attr("r", d => d.r);

                tooltip.style("visibility", "hidden");
            });

        function wrapText(text, radius) {
            const maxWidth = radius * 1.6;
            const approxCharWidth = 6;
            const maxCharsPerLine = Math.floor(maxWidth / approxCharWidth);
            const words = text.split(/\s+/);
            const lines = [];
            let line = "";

            words.forEach(word => {
                const testLine = line ? `${line} ${word}` : word;
                if (testLine.length <= maxCharsPerLine) {
                    line = testLine;
                } else {
                    lines.push(line);
                    line = word;
                }
            });

            if (line) lines.push(line);

            const maxLines = Math.floor(radius / 8);
            if (lines.length > maxLines) {
                lines.splice(maxLines - 1, lines.length - maxLines, `${lines[maxLines - 1].slice(0, maxCharsPerLine - 3)}...`);
            }

            return lines;
        }

        // Agrega el texto y (porcentaje) centrado en cada burbuja
        // Dentro del bucle de creación de burbujas:
        bubbles.each(function (d) {
            const bubbleColor = color(d.data.label);        // Color de la burbuja
            const textColor = getTextColor(bubbleColor);    // Color de texto calculado

            const lines = wrapText(d.data.label, d.r);      // Ajusta el texto a la burbuja
            //const fontSize = Math.max(d.r * 0.3, 10);       // Tamaño proporcional
            const fontSize = Math.max(Math.min((2 * d.r) / (lines.length + 1), 12), 8);
            const lineSpacingFactor = 1.2;                  // Separación entre líneas

            // Texto del label (nombre de la entidad)
            d3.select(this)
                .selectAll("text.label")
                .data(lines)
                .enter()
                .append("text")
                .attr("class", "bubble-chart-text label")
                //.attr("y", (_, i) => (i - (lines.length - 1) / 2) * (fontSize * lineSpacingFactor))
                .attr("y", (_, i) => (i - (lines.length - 1) / 2) * (fontSize + 2) - fontSize / 2)
                .attr("text-anchor", "middle")
                .style("font-size", `${fontSize}px`)
                .style("fill", textColor)
                .text(line => line);

            // Texto del porcentaje
            d3.select(this)
                .append("text")
                .attr("class", "bubble-chart-text percentage")
                .attr("y", (lines.length * (fontSize + 2)) / 2)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .style("font-size", `${fontSize-2}px`)
                .style("fill", textColor)                   // ← Aplica color calculado
                .text(`${d.data.porcentaje ? shared.formatoDecimales(d.data.porcentaje, 1, ",", ".") : '0'}%`);
        });




    }



    renderChart();

    window.addEventListener("resize", () => {
        width = contenedor.clientWidth;
        height = Math.min(width*1.2, 450),
        svg.attr("width", width).attr("height", height);
        renderChart();
    });
}




