

prueba3();

function prueba3() {
    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    var labelr = radius + 30;

    d3.select("#divGraphDonaPerFuentes")
        .append("g")
        .attr("transform", "translate(100,100)");

    var input = [
        { name: "CRÉDITO INTERNO", size: "10", color:"#4040b0" },
        { name: "DONACION EXTERNA", size: "9", color:"#06a7d6" },
        { name: "FONDO GENERAL", size: "5", color: "#f8fb54" },
        { name: "CREDITO EXTERNO", size: "3", color: "#ff8975" },
        { name: "FONDOS CON DESTINO ESPECÍFICO", size: "2", color: "#ff0024" }
    ];

    const colores = ["#4040b0", "#06a7d6", "#f8fb54", "#ff8975", "#ff0024"];

    const colorScale = d3.scaleOrdinal()
        .domain(d3.range(colores.length)) // Dominio basado en la longitud del array de colores
        .range(colores); // Rango de colores

    const angulo = d3.scaleLinear()
        .domain([0, 180]) // Limita el ángulo de 0 a 180 grados
        .range([0, Math.PI * 2]); // Convierte el rango a radianes

    var angleGen = d3.pie()
        .startAngle(angulo(-45))
        .endAngle(angulo(45))
        .padAngle(.05)
        .value((d) => d.size)
        .sortValues((a, b) => a < b ? 1 : -1);

    var data = angleGen(input);


    var arcGen = d3.arc()
        .innerRadius(50)
        .outerRadius(90);

    const labelRadius = arcGen.outerRadius()() * 0.8;
    const arcLabel = d3.arc()
        .innerRadius(labelRadius)
        .outerRadius(labelRadius);


    d3.select("#divGraphDonaPerFuentes g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", arcGen)
        .attr("fill", (d, i) => colorScale(i))
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

    const textEl = d3.select("#divGraphDonaPerFuentes")
        .selectAll("newText")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function (d) {
            return d3.pointRadial((d.startAngle + d.endAngle - 0.1) / 2, (50 + 90) / 2)[0];
        })
        .attr("y", d => d3.pointRadial((d.startAngle + d.endAngle -0.1 )/2, (50 + 90) / 2)[1])
        .attr("text-anchor", d => {

            return "middle";
        })
        .text(d => "T")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("transform", "translate(100,100)")
        

   

}




function prueba() {
    var data = [
        { label: 'A', value: 10 },
        { label: 'B', value: 15 },
        { label: 'C', value: 8 }
        
    ];

    var width_aux = 400;
    var height_aux = 300; //this is the double because are showing just the half of the pie
    var radius = Math.min(width_aux, height_aux) / 2;

    var donut = new d3plus.Donut()
        .select("#grafico")
        .config({
            data: data,
            groupBy: "label",
            height: height_aux,
            width: width_aux,
            innerRadius: 50,
            outerRadius:-10,
            legend: false,
            value: "value",
            startAngle: Math.PI / 4,
            endAngle:7 * Math.PI / 4,
            padAngle:.05

        })
        .render();

}

function loadDonaGraph(divContenedor) {
    var myData = [
        { "labelGroup": "Empresa Nacional de Energía Eléctrica", "rawValue": (5823840893 / 1000000), "porcentaje": 24.7, "color": "#639CBF" },
        { "labelGroup": "Secretaría de Infraestructura y Transporte", "rawValue": (3871722058 / 1000000), "porcentaje": 16.4, "color": "#78B8BF"},
        { "labelGroup": "Red Solidaria", "rawValue": (3833179985 / 1000000), "porcentaje": 16.2, "color": "#A65D5D"},
        { "labelGroup": "Secretaría de Agricultura y Ganadería", "rawValue": (1860950990 / 1000000), "porcentaje": 7.9, "color": "#4C5959"},
        { "labelGroup": "Secretaría de Salud", "rawValue": (1843312136 / 1000000), "porcentaje": 7.8, "color": "#3185A3"},
        { "labelGroup": "Fondo Hondureño de Inversión Social", "rawValue": (1493673469 / 1000000), "porcentaje": 6.3, "color": "#56B4D6"},
        { "labelGroup": "Secretaría de Recursos Naturales y Ambiente (MI AMBIENTE+)", "rawValue": (725000000 / 1000000), "porcentaje": 3.1, "color": "#56D6B2" },
        { "labelGroup": "Secretaría de Educación", "rawValue": (483855487 / 1000000), "porcentaje": 2.1, "color": "#4FBCE3"},
        { "labelGroup": "Empresa Hondureña de Telecomunicaciones (HONDUTEL)", "rawValue": (400000000 / 1000000), "porcentaje": 1.7, "color": "#9BDDCA" },
        { "labelGroup": "Registro Nacional de las Personas", "rawValue": (400000000 / 1000000), "porcentaje": 1.7, "color": "#41A387"},
        { "labelGroup": "Otras instituciones", "rawValue": (2878355040 / 1000000), "porcentaje": 12.2, "color": "#5A6A70" }
    ];

    new d3plus.Donut()
        .select("#divGraphDona")

        .config({
            data: myData,
            groupBy: "labelGroup",
            label: d => d["porcentaje"] + "%",
            height: 665,
            padAngle: 0.01,
            legend: true,
            legendPosition: function () {
                return this._width > this._height ? "right" : "bottom";
            },
            value: "rawValue",
            color: function (d,index) {
                return assignColorPaleta(index);
            },
            tooltipConfig: {
                title: function (d) {
                    return d["labelGroup"];
                },
                tbody: [
                    [function (d) {

                        var cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones";
                        if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                            cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones" + " <strong>(" + d["porcentaje"].formatMoney(1, '.', ',').toString() + " %)</strong>";
                        }
                        return cad_aux;

                    }]
                ]
            }
            ,legendConfig: {
                label(d, i) {
                    return d["labelGroup"];
                },
            
            }
        })
        .legendTooltip({ footer: "" })
        .on({ "click.legend": () => { } })
        .render();

}

function formatoDecimales(n,c,d,t) {
    //var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

}

function loadBarChartGraph(divContenedor) {
    var objData = [
        { "periodo": 2023, "x": 1, "labelGroup": "Energia", "rawValue": (5823840893 / 1000000), "porcentaje": 24.66 },
        { "periodo": 2023, "x": 2, "labelGroup": "Carreteras", "rawValue": (3871722058 / 1000000), "porcentaje": 16.39 },
        { "periodo": 2023, "x": 3, "labelGroup": "Protección Social", "rawValue": (3735148184 / 1000000), "porcentaje": 15.81 },
        { "periodo": 2023, "x": 4, "labelGroup": "Salud", "rawValue": (2210133891 / 1000000), "porcentaje": 9.35 },
        { "periodo": 2023, "x": 5, "labelGroup": "Seguridad Alimentaria", "rawValue": (1692074080 / 1000000), "porcentaje": 7.16 },
        { "periodo": 2023, "x": 6, "labelGroup": "Forestal", "rawValue": (1120971903 / 1000000), "porcentaje": 4.74 },
        { "periodo": 2023, "x": 7, "labelGroup": "Educación", "rawValue": (1096085635 / 1000000), "porcentaje": 4.64 },
        { "periodo": 2023, "x": 8, "labelGroup": "Fortalecimiento Institucional", "rawValue": (1014570349 / 1000000), "porcentaje": 4.29 },
        { "periodo": 2023, "x": 9, "labelGroup": "Agua y Saneamiento", "rawValue": (857828749 / 1000000), "porcentaje": 3.63 },
        { "periodo": 2023, "x": 10, "labelGroup": "Otras Inversiones  por Definir", "rawValue": (695034722 / 1000000), "porcentaje": 2.94 },
        { "periodo": 2023, "x": 11, "labelGroup": "Transporte y Obras Públicas", "rawValue": (496119660 / 1000000), "porcentaje": 2.10 },
        { "periodo": 2023, "x": 12, "labelGroup": "Inversión Social", "rawValue": (400000000 / 1000000), "porcentaje": 1.69 },
        { "periodo": 2023, "x": 13, "labelGroup": "Telecomunicaciones", "rawValue": (400000000 / 1000000), "porcentaje": 1.69 },
        { "periodo": 2023, "x": 14, "labelGroup": "Seguridad", "rawValue": (200359934 / 1000000), "porcentaje": 0.84 }


    ];


    var distintos = objData.map(item => item.periodo)
        .filter((value, index, self) => self.indexOf(value) === index);

    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        var ordenado = objData.sort(function (a, b) {
            if (a.rawValue > b.rawValue)
                return -1;
            if (a.rawValue < b.rawValue)
                return 1;
            return 0;
        });

        new d3plus.BarChart()
            .select("#" + divContenedor)
            .translate(function (d) {
                var traduc_aux = d;
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
                } else if (d === "Click to Expand") {
                    traduc_aux = "Clic para Expandir";
                } else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
                } else {
                    traduc_aux = d;
                }
                return traduc_aux;
            })
            .config({
                data: ordenado,
                groupBy: "labelGroup",
                label: function (d) {
                    return formatoDecimales(d["rawValue"],1, '.', ',');
                },
                legendPosition: 'bottom',
                height: 700,
                x: "rawValue",
                y: "labelGroup",
                discrete: 'y',
                shapeConfig: {
                    fill: function (d, index) {
                        var val_aux = 0;
                        if (d.periodo != undefined && d.periodo != null && d.periodo != "") {
                            val_aux = parseInt(d.periodo);
                        }
                        var index = distintos.indexOf(val_aux);
                        return assignColorBarrasFunc(index);

                    },
                    labelConfig: {
                        fontFamily: "'Montserrat', sans-serif",
                        align: "center",
                        size: 6,
                        transform: "capitalize",
                        fontMin: 4,
                        fontMax: 8,
                        
                    }
                },
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"] + " " + d["periodo"];
                    },
                    tbody: [
                        [function (d) {

                            var cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones";
                            if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                                cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones" + " <strong>(" + d["porcentaje"].formatMoney(1, '.', ',').toString() + " %)</strong>";
                            }
                            return cad_aux;

                        }]
                    ]
                },
                xConfig: {
                    title: "Millones de Lempiras",
                    scale: "pow",
                    ticks:false,

                },
                yConfig: {
                    title: "Sectores",
                    fontsize: "2px",
                    size: "2px"
                },
                legend: false
            })
            .barPadding(0)
            .groupPadding(12)
            .render();
    }


}

function assignColorPaleta(indice) {
    var color_aux = "#CCCCCC";
    var col_sel = color_aux;
    var colores_default = ['#78B8BF', '#639CBF', '#78B8BF"', '#4C5959', '#56B4D6'];
    if (indice < colores_default.length) {
        col_sel = colores_default[indice];
    }
    return col_sel;
}

function assignColor(indice) {
    var colores_default = ["#57BEC3","#7CBAC9", "#FBC99A", , "#F7B6A7"];
    return colores_default[indice];
}

function assignColorBarrasFunc(item) {
    var colores_default = ['#78B8BF','#639CBF', '#78B8BF"', '#4C5959','#56B4D6'];
    return colores_default[item];

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
function loadTreeMapGraph(divContenedor) {
    var objData = [
        { "parent": "1", "labelGroup": "FRANCISCO MORAZÁN", "rawValueDouble": 6975159483.28242, "porcentaje": 0, "poblacion": 1508906 ,"proyectos":64},
        { "parent": "1", "labelGroup": "CORTES", "rawValueDouble": 4550203434.1961, "porcentaje": 0, "poblacion": 1562394, "proyectos": 36},
        { "parent": "1", "labelGroup": "OLANCHO", "rawValueDouble": 3283792459.15149, "porcentaje": 0, "poblacion": 520761, "proyectos": 48},
        { "parent": "1", "labelGroup": "EL PARAÍSO", "rawValueDouble": 1507550795.57777, "porcentaje": 0, "poblacion": 444507, "proyectos":26},
        { "parent": "1", "labelGroup": "SANTA BÁRBARA", "rawValueDouble": 1202912672.38918, "porcentaje": 0, "poblacion": 421337, "proyectos":23 },
        { "parent": "2", "labelGroup": "YORO", "rawValueDouble": 866660195.56485, "porcentaje": 0, "poblacion": 570595, "proyectos":28 },
        { "parent": "2", "labelGroup": "COPÁN", "rawValueDouble": 929441188.610502, "porcentaje": 0, "poblacion": 371057, "proyectos":33},
        { "parent": "2", "labelGroup": "INTIBUCÁ", "rawValueDouble": 667194655.627341, "porcentaje": 0, "poblacion": 232553, "proyectos":24},
        { "parent": "2", "labelGroup": "COMAYAGUA", "rawValueDouble": 617494713.268798, "porcentaje": 0, "poblacion": 493466, "proyectos":30},
        { "parent": "2", "labelGroup": "OCOTEPEQUE", "rawValueDouble": 503299439.070441, "porcentaje": 0, "poblacion": 146430, "proyectos":25},
        { "parent": "3", "labelGroup": "COLÓN", "rawValueDouble": 381778402.055055, "porcentaje": 0, "poblacion": 309926, "proyectos":15},
        { "parent": "3", "labelGroup": "LEMPIRA", "rawValueDouble": 356721847.739591, "porcentaje": 0, "poblacion": 321179, "proyectos":19},
        { "parent": "3", "labelGroup": "VALLE", "rawValueDouble": 329545713.713244, "porcentaje": 0, "poblacion": 174511, "proyectos":20 },
        { "parent": "3", "labelGroup": "CHOLUTECA", "rawValueDouble": 460148377.438564, "porcentaje": 0, "poblacion": 437618, "proyectos":27},
        { "parent": "3", "labelGroup": "ATLÁNTIDA", "rawValueDouble": 248574764.457373, "porcentaje": 0, "poblacion": 436252, "proyectos":22},
        { "parent": "3", "labelGroup": "LA PAZ", "rawValueDouble": 473343359.854955, "porcentaje": 0, "poblacion": 198926, "proyectos":24},
        { "parent": "3", "labelGroup": "ISLAS DE LA BAHÍA", "rawValueDouble": 141956474.116752, "porcentaje": 0, "poblacion": 62557, "proyectos":11 },
        { "parent": "3", "labelGroup": "GRACIAS A DIOS", "rawValueDouble": 118112081.864668, "porcentaje": 0, "poblacion": 90795, "proyectos":13}
    ];

    var distintos = objData.map(item => item.parent)
        .filter((value, index, self) => self.indexOf(value) === index);

    var sumaTotal = objData.reduce(function (_this, val) {
        return _this + val.rawValueDouble
    }, 0);

    $.each(objData, function (key, item) {

        var porc_aux = (item.rawValueDouble / sumaTotal) * 100;
        item.porcentaje = porc_aux;
    });

    if (objData != undefined && objData != null) {
        var grafica = new d3plus.Treemap()
            .select("#" + divContenedor)
            .shapeConfig({
                label: (d) => {
                    auxiliar = [d.labelGroup, formatoDecimales(d["porcentaje"], 1, '.', ',') + "%"];
                    return auxiliar;
                },
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
                }, fill: function (d, index) {
                    return assignColorPaleta(index);

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
                data: objData,
                groupBy: ["parent","labelGroup"],
                height: 500,
                tooltipConfig: {
                    title: function (d) {
                         return d.labelGroup;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["rawValueDouble"] / 1000000;
                            var cantPoblacion = d["poblacion"];
                            var cantProy = d["proyectos"];
                            var cad = "";
                            cad += "<span style='float:left;'>Monto total de la inversión&nbsp;</span><strong style='float:right;'>" + " L " + valor.formatMoney(1, '.', ',').toString() + " Millones" + "</strong></br>";
                            cad += "<span style='float:left;'>Cantidad de proyectos&nbsp;</span><strong style='float:right;'>" + cantProy.formatMoney(0, '.', ',').toString() + "</strong></br>";
                            cad += "<span style='float:left;'>Población&nbsp;</span><strong style='float:right;'>" + cantPoblacion.formatMoney(0, '.', ',').toString() + "</strong>";
                            return cad;
                        }]
                    ]
                },
                yConfig: {
                    title: "",
                }
            })
            .sum("rawValueDouble")
            .depth(1)
            .legend(false)
            .render();
    }

}


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