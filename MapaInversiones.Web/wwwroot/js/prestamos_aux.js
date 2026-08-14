var data_creditos = JSON.parse(document.body.getAttribute('data-creditos'));
var totalDisponible1= 395000000;   //(395 billones = 395.000.000 millones)
var totalDisponible = 3500000;   //(3,5 billones = 3500000 millones)
//---------------------------- 

 loadDonaGraph("divGraphDona", data_creditos);

//*---------------------------------- */
function assignColorPaleta(indice) {
    var color_aux = "#CCCCCC";

    var colores_default = [
        "#4889CF", // Azul
        "#FDC700", // amarillo
        "#B7DEA4", // verde pastel
        "#9DB1B9", // lavanda
        "#F5B8C4", // rosado suave
        "#A1D6E2", // azul pastel
        "#F2E29F", // amarillo vainilla
        "#D1B3B0"  // lila claro
    ];    

    return colores_default[indice % colores_default.length] || color_aux;
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
    var totalCreditos = 0;
    for (var i = 0; i < myData.length; i++) {
        totalCreditos += myData[i].Monto;
    }

    //**----------------------------------- */
    //* Habilitar si se requiere mostrar el faltante x asignar */
    var restantePorPrestar = totalDisponible - totalCreditos;

    myData.push({
        Monto: restantePorPrestar,
        IdEntidadFinanciera: 0

    });
    //**----------FIN------------------------- */

    function drawDona(divContenedor, myData) {

        const colorMap = {};
        myData.forEach((d, index) => {
            const id = Number(d.IdEntidadFinanciera);
            
            colorMap[id] = (id === 0)
                ? "#EEEEEE"                      // fijo para restante gris
                : assignColorPaleta(index);      // los demás por posición
        });

        const total_asig = myData.reduce((sum, d) => sum + d.Monto, 0);

        $("#" + divContenedor).empty();
        const container = document.getElementById(divContenedor);
        if (myData != undefined && myData != null) {

            const containerWidth = container.getBoundingClientRect().width;
            const containerHeight = containerWidth * 0.6;

            new d3plus.Donut()
                .select("#" + divContenedor)
                .config({
                    data: myData,
                    groupBy: "IdEntidadFinanciera",
                    padAngle: 0.01,
                    legend: true,
                    //label: function () { return ""; },
                    label: function (d) {
                        const percentage = shared.formatoDecimales(((d.Monto / totalDisponible) * 100),1);
                        return `${percentage}%`;
                    },
                    legendPosition: function () {
                        return this._width > this._height ? "bottom" : "bottom";
                    },
                    value: "Monto",
                    color: (d) => {
                        //console.log('Color para ID:', d.IdEntidadFinanciera, 'Color:', colorMap[d.IdEntidadFinanciera]); // Para debug
                        return colorMap[d.IdEntidadFinanciera];
                    },
                    width: containerWidth,
                    height: Math.min(containerHeight, 350),
                    tooltipConfig: {
                        title: function (d) {
                            const id = +(`${d.IdEntidadFinanciera}`.trim());
                            return id === 0 ? "Por aprobar" : `Crédito ${id}`;
                        },
                        tbody: [
                            [function (d) {
                                const id = +(`${d.IdEntidadFinanciera}`.trim());
                                var cad_aux = id === 0 ? shared.formatoMoneda(d["Monto"], 2, 1) :shared.formatoMoneda(d["Monto"], 0, 1);
                                return cad_aux;
                            }]
                        ]
                    },
                    legendConfig: {
                        label(d, i) {
                            const id = +(`${d.IdEntidadFinanciera}`.trim());  
                            return id === 0 ? "Por aprobar" : `Crédito ${id}`;
                        },
                    }
                })
                .legendTooltip({ footer: "" })
                .on({ "click.legend": () => { } })
                .render();

            drawCenterText(divContenedor, '$3,5 billones', 'Cupo total');        
            //drawCenterText(divContenedor, shared.formatoMoneda(totalCreditos,0,1), 'Total Créditos');

            //background circulos cajitas
            $('.c-graph').each(function (index) {
                const idEntidad = $(this).data("identidad");
                $(this).css('background-color', colorMap[idEntidad]);
            });
        }
    }

    function drawCenterText(containerId, texto, subtitulo) {
        const container = document.getElementById(containerId);

        // Quita texto previo si existe
        const oldText = container.querySelector('.donut-center-text');
        if (oldText) oldText.remove();

        // Crea un div centrado
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('donut-center-text');
        centerDiv.innerHTML = `<strong style="font-size:18px;">${texto}</strong><br><span style="font-size:14px;">${subtitulo}</span>`;

        // Posicionamiento centrado absoluto
        centerDiv.style.position = 'absolute';
        centerDiv.style.top = '50%';
        centerDiv.style.left = '50%';
        centerDiv.style.transform = 'translate(-50%, -50%)';
        centerDiv.style.textAlign = 'center';
        centerDiv.style.pointerEvents = 'none';
        centerDiv.style.zIndex = '0';

        // Asegura que el contenedor sea relative
        container.style.position = 'relative';
        container.appendChild(centerDiv);
    }

    drawDona(divContenedor, myData);

    window.addEventListener("resize", debounce(() => {
        drawDona(divContenedor, myData);
    }, 300));
}



