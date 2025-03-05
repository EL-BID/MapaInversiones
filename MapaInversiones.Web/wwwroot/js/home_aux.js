var sector_ideas_globales = [];
var anyo_actual = $("#anioPresupuesto").val();
$("#lblAnyoBannerSec").text(anyo_actual);
var graficaDibujada = false;
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
            if (parentStyles.display !== "none" && parentStyles.visibility !== "hidden")
            {
               

                if (myData != undefined && myData != null) {

                    const containerWidth = container.getBoundingClientRect().width;
                    const containerHeight = containerWidth * 1.2;  // Por ejemplo, 60% del ancho

                    new d3plus.Donut()
                        .select("#" + divContenedor)
                        .config({
                            data: myData,
                            groupBy: "label",
                            label: d => formatoDecimales(d["porcentaje"], 1, ',', '.').toString() + "%",
                            padAngle: 0.01,
                            legend: true,
                            legendPosition: function () {
                                return this._width > this._height ? "bottom" : "bottom";
                            },
                            value: "valorVigente",
                            color: (d, i) => assignColorPaleta(i),
                            width: containerWidth,
                            height: Math.min(containerHeight, 450),
                            tooltipConfig: {
                                title: function (d) {
                                    return d["label"];
                                },
                                tbody: [
                                    [function (d) {

                                        var cad_aux = "L " + formatoDecimales(["valorVigente"] / 1000000, 1, ',', '.').toString() + " millones";
                                        if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                                            cad_aux = formatoDecimales(d["valorVigente"] / 1000000, 1, ',', '.').toString() + " millones" + " <strong>(" + formatoDecimales(d["porcentaje"], 1, ',', '.').toString() + " %)</strong>";
                                        }
                                        return cad_aux;

                                    }]
                                ]
                            }
                            , legendConfig: {
                                label(d, i) {
                                    return d["label"];
                                },

                            },
                            //cache: true
                        })
                        .legendTooltip({ footer: "" })
                        .on({ "click.legend": () => { } })
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

function formatoDecimales(n, c, d, t) {
    //var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

}

function assignColorPaleta(indice) {
    var color_aux = "#CCCCCC";
    var col_sel = color_aux;
    var colores_default = ["#8B3CB8","#459F7D", "F19D5B", "#E3CF85", "#E99FD4", "#99A7CC", "#97CFAE", "#BCD7CE", "#F19996"];
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
        var icono = objData[j]["label"].toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace(/\s+/g, '-')

        html += '<div class="col-xl-4">';
        html += '<div class="card-info">';
        html += '<a href="/PerfilSector?id=' + objData[j]["codigoSector"] +'" target="_blank">';
        html += '<div class="wrap-icon"><img src="/img/' + icono + '.svg" alt="icono sectores" /></div>';
        html += '<div class="card-info-content">';
        html += '<span class="h5">' + objData[j]["label"] + '</span>';
        html += '<span class="number-data">$' + formatoDecimales(objData[j]["valorVigente"] / 1000000, 1, ",", ".").toString()  +' millones</span>                                                           ';
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
                    createBubbleChart("divQuienInvirtio", data);
                    loadEntidades("cardQuienInvirtio", data);

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
            html += '<div class="col-xl-4"> ';
            html += '<div class="card-info">';
            html += '<a href="/PerfilEntidad?codEntidad=' + objData[j]["codigoInstitucion"] + '" target="_blank">';
            html += '<div class="card-info-content">';
            html += '<span class="h5">' + objData[j]["label"] + '</span>';
            html += '<span class="number-data">$' + formatoDecimales(objData[j]["valorVigente"] / 1000000, 1, ",", ".").toString() + ' millones</span>';
            html += '<small>Presupuesto vigente</small>';
            html += '</div>';
            html += '</a>';
            html += '</div>';
            html += '</div>';
        }
    }
    
    $("#" + divContenedor).html(html);


}

/*Crea un gráfico de burbujas en el contenedor especificado.*/
function createBubbleChart(contenedorId, data) {
    const contenedor = document.getElementById(contenedorId);
    const colores_default = [
        "#459F81", "#C6C95E", "#7DC95E",
        "#C9598C", "#C159CB", "#5983CB",
        "#59C9C9", "#59C982", "#7DC95E"
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
                    $ ${formatoDecimales(d.data.valorVigente / 1000000, 1, ",", ".")} millones
                    (${d.data.porcentaje ? formatoDecimales(d.data.porcentaje, 1, ",", ".") : '0'}%)
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
                .text(`${d.data.porcentaje ? formatoDecimales(d.data.porcentaje, 1, ",", ".") : '0'}%`);
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




