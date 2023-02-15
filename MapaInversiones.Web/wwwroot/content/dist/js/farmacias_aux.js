var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";

require([
    'comunes',
    'app/network/Services',
    'app/network/urlsMap'
],
    function (
        comunes,
        Services,
        urlsMap
    ) {

        GetSubsidiosPerFarmacias();
        //ObtSubsidiosPerPeriodo(2021);
        ObtDatosDefault();

        function ObtDatosDefault() {
            
            var id_anyos = $("#filtro_anyos li:eq(0)").attr("id");
           
            var val_Sel_anyos = "";
            if (id_anyos != undefined) {
                val_Sel_anyos = id_anyos;
                var obj = $("#filtro_anyos li:eq(0)")
                $(obj).attr("class", "selected");
                $("#sel_anyos").html(obj.html());
                $("#selhd_anyos").val(val_Sel_anyos);
                ObtSubsidiosPerPeriodo(id_anyos);

            }

        }

        function GetSubsidiosPerFarmacias() {
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerTopFarmaciasGroup",
                cache: false,
                data: null,
                success: function (data) {
                    //var objJsonData = JSON.parse(data);
                    if (data.FarmaciasTop != null) {
                        if (data.FarmaciasTop.length > 0) {
                            if (data.farmaciaPrincipal != undefined) {
                                $("#txtFarmaciaPrincipal").text(data.farmaciaPrincipal);
                            }

                            $("#divTextoExplicativo").show();
                            $("#divTextoNoEncontrado").hide();
                            loadGraphSubsidiosPerFarmacias("graphic", data.FarmaciasTop, "Farmacias", "* Valor en millones de L");
                           

                        } else {
                            $("#divTextoExplicativo").hide();
                            $("#divTextoNoEncontrado").show();

                        }
                    } else {
                        $("#divTextoExplicativo").hide();

                        $("#divTextoNoEncontrado").show();
                    }
                },
                error: function (response) {
                    //alert(response.responseText);
                },
                failure: function (response) {
                    //alert(response.responseText);
                }
            });

        }

        function loadGraphSubsidiosPerFarmacias(div_contenedor, data_contenido, titulo, etiqueta) {
            if (data_contenido != undefined && data_contenido != null) {
                for (var i = 0; i < data_contenido.length; i++) {
                    //data_contenido[i].value = parseFloat(data_contenido[i].value);
                    data_contenido[i].rawValue = parseFloat(data_contenido[i].rawValue);
                }
                var visualization = d3plus.viz()
                    .container("#" + div_contenedor)
                    .data(data_contenido)
                    .type("bar")
                    .id("label")
                    .legend(false)
                    .tooltip({ "value": true })
                    .order({
                        "value": "rawValue",
                        "sort": "asc"
                    })
                    .format({
                        "text": function (text, params) {
                            if (text == "rawValue") {
                                return "Valor";
                            } else if (text == "labelGroup") {
                                return "Farmacia";
                            }
                            else if (text == "label") {
                                return "Farmacia";
                            }
                            else if (text == "share") {
                                return "Participación";
                            }
                            else if (text == "including") {
                                return "Incluye";
                            }
                            else {
                                return d3plus.string.title(text, params);
                            }
                        }
                        , "number": function (number, params) {
                            //return number; // No formatting
                            var formatted = d3plus.number.format(number, params);
                            if (params.key === "rawValue") {
                                //return "L " + numberWithCommas(parseFloat(Math.round(number / 1000000)).toFixed(0)) + " M";
                                return numberWithCommas(parseFloat(Math.round(number / 1000000)).toFixed(0));
                            }
                            else if (params.key === "value") {
                                return numberWithCommas(parseFloat(Math.round(number / 1000000)).toFixed(0));
                                
                            }
                            else if (params.key === "share") {
                                return d3.round(number, 2) + " %";
                            }
                            else {
                                return formatted;
                                
                            }
                        }
                    })
                    .background("rgba(255, 255, 255, 0)")
                    .text({ "value": "label" })
                    //.height({ "small": 170, "value": 180 })
                    .axes({
                        "background": { "color": "rgba(255,255,255,0)", "ticks": true, "stroke": { "width": 0, "color": "#fff" } },
                        "font": { "family": "inherit" },
                        "label": false
                    })
                    .x(
                        {
                            "stacked": false,
                            "value": "rawValue",
                            "axis": { "padding": "10px", "color": "#000000", "border-color": "#000000" },
                            "lines": { "color": "#000000" },
                            "padding": 0.1,
                            "grid": false,
                            "label": {
                                "value": etiqueta,
                                "padding": 10,
                                "font": { "family": "inherit", "weight": "bold", "size": 14 }
                            }
                        })
                    .y(
                        {
                            "scale": "discrete",
                            "value": "label",
                            "ticks": { "color": "rgba(255,255,255,0)", "labels": false },
                            "lines": false,
                            "axis": { "padding": "10px", "color": "#000000", "label": false },
                            "grid": false,
                            "label": {
                                "value": true,
                                "padding": 5,
                                "font": { "family": "inherit", "size": 14, "color": "rgba(255,255,255,0)" }
                            }
                        })
                    .color("labelGroup")
                    .color({
                        "scale": ["#fc8464", "#1cc4ac", "#75f0c4", "#8c8c8c", "#e8eae9", "#18c3c4", "#2d6494", "#fcd4a4", "#33455d", "#1c94bc", "#8c95a0", "#747c8c", "#4c7ca4", "#63d1d4", "#fc947c", "#e2cec8", "#c3dadb", "#ade8e5", "#61788b"],
                        //, "#75f0c4", "#8c8c8c", "#e8eae9", "#18c3c4", "#2d6494", "#fcd4a4", "#33455d", "#1c94bc", "#8c95a0", "#747c8c", "#4c7ca4", "#63d1d4", "#fc947c", "#e2cec8", "#c3dadb", "#ade8e5", "#61788b"
                    })
                    //.time("year")
                    .draw()
            }
        }

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return parts.join(".");
        }


        function barraHorizontal(data_contenido) {
            var data = data_contenido;

            //sort bars based on value
            //data = data.sort(function (a, b) {
            //    return d3.ascending(a.rawValue, b.rawValue);
            //})

            //set up svg using margin conventions - we'll need plenty of room on the left for labels
            var margin = {
                top: 15,
                right: 25,
                bottom: 15,
                left: 60
            };

            ///var colors = d3.scale.category20().range([]);
            var colors = d3.scale.ordinal().range(["#fc8464", "#1cc4ac", "#75f0c4", "#8c8c8c", "#e8eae9", "#18c3c4", "#2d6494", "#fcd4a4", "#33455d", "#1c94bc", "#8c95a0", "#747c8c", "#4c7ca4", "#63d1d4", "#fc947c", "#e2cec8", "#c3dadb", "#ade8e5", "#61788b"]);

            var width = 800 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var svg = d3.select("#graphic").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var x = d3.scale.linear()
                .range([0, width])
                .domain([0, d3.max(data, function (d) {
                    return d.rawValue;// d.rawValueDouble
                })]);

            var ticks = x.ticks(),
                lastTick = ticks[ticks.length - 1],
                newLastTick = lastTick + (ticks[1] - ticks[0]);
            if (lastTick < x.domain()[1]) {
                ticks.push(newLastTick);
            }
            x.domain([x.domain()[0], newLastTick]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .tickSize([- 5])
                //.tickFormat(d => (d).toFixed(0))
                .tickFormat(
                    d => (d / 1000000).toFixed(0)
                )
                .orient("bottom");

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], .1)
                .domain(data.map(function (d) {
                    return d.labelGroup;
                }));


            //make y axis to show bar names
            var yAxis = d3.svg.axis()
                .scale(y)
                //no tick marks
                .tickSize(0)
                .tickFormat("")
                .orient("left");

            var gy = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            var bars = svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("g")




            //append rects
            bars.append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.labelGroup);
                })
                .attr("height", y.rangeBand())
                .attr("x", 0)
                .attr("width", function (d) {
                    return x(d.rawValue);//rawValueDouble
                })
                .attr("fill", function (d, i) { return colors(i) });

            bars.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "3.5em")
                .attr("font", "inherit")
                .text("Farmacias");


            //add a value label to the right of each bar
            bars.append("text")
                .attr("class", "label")
                //y position of the label is halfway down the bar
                .attr("y", function (d) {
                    return y(d.labelGroup) + y.rangeBand() / 2 + 4;
                })
                .text(function (d) {
                    return ""
                })
                //x position is 3 pixels to the right of the bar
                .attr("x", function (d) {
                    var longitud = d.labelGroup.toString().length;
                    var aux = x(newLastTick) - x(d.rawValue); //rawValueDouble
                    var resto = (width - (aux));
                    if ((longitud * 11) > aux) {
                        return (x(newLastTick) - (longitud * 11));
                        //return aux;
                    } else {
                        return x(d.rawValue) + 3; //rawValueDouble
                    }
                })
                .text(function (d) {
                    return d.labelGroup;
                });

            ///////////////////////
            // Tooltips
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip");

            bars.on("mouseover", function (d) {
                var valor_aux = d['rawValue']; //rawValueDouble
                if (valor_aux != undefined) {
                   
                        valor_aux = (d['rawValue'] / 1000000);//rawValueDouble
                        valor_aux = (valor_aux).formatMoney(0, ',', '.');
                }
                tooltip.html("<span style='color:#5AB642;font-weight:bold;'>" + d['labelGroup'] + "</span><br>" + "Valor en Millones de L " + valor_aux)
                    .style("visibility", "visible");
                 

            })
                .on("mousemove", function (d) {
                    tooltip.style("top", event.pageY - (tooltip[0][0].clientHeight + 5) + "px")
                        .style("left", event.pageX - (tooltip[0][0].clientWidth / 2) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.style("visibility", "hidden");
                });



        }

        function barra_vertical(div_contenedor, data_contenido) {
            var visualization = d3plus.viz()
                .container("#" + div_contenedor)
                .data({ "value": data_contenido, })
                .type("bar")
                .id("rawValue")
                .color({
                    "scale": ["#00876c", "#549e77", "#b0cb9b", "#d9e1b5", "#f4daa7", "#449ee2", "#93b4cc", "#2d5a79", "#4eb7f0", "#e79365", "#e06b55", "#de425b"],
                })
                .font({ "family": "inherit", "size": 12 })
                .background("rgba(255, 255, 255, 0)")
                //.text({ "value": "rawValue" })
                .axes({
                    "background": { "color": "rgba(255,255,255,0)", "ticks": true, "stroke": { "width": 1, "color": "#d6d6d6" } },
                    "font": { "family": "inherit" },
                    "label": true
                })
                .x({
                    "value": "rawValue_asoc",
                    "axis": { "padding": "10px", "color": "#d6d6d6", "border-color": "#d6d6d6" },
                    "grid": false,
                    "label": {
                        "value": "* Valores en millones de L",
                        "padding": 10,
                        "font": { "family": "inherit", "weight": "bold", "size": 12 }
                    }
                })
                .y(
                    {
                        "value": "rawValue",
                        "ticks": { "color": "rgba(255,255,255,0)", "labels": true },
                        "lines": { "color": "#d6d6d6", "width": 100 },
                        "axis": { "padding": "10px", "color": "#d6d6d6", "label": true },
                        "grid": true,
                        "label": {
                            "value": true,
                            "padding": 5,
                            "font": { "family": "inherit", "weight": "bold", "size": 12, "color": "rgba(255,255,255,0)" }
                        }
                    })
                .height({ "small": 300, "value": 350 })
                .format({
                    "locale": "es_ES",
                    "number": function (number, params) {
                        var formatted = d3plus.number.format(number, params);
                        if (params.key === "rawValue") {
                            var valor = number;
                            if (valor != undefined) {
                                valor = (valor / 1000000).formatMoney(0, '.', '.');
                            }
                            return valor;
                        }
                        else if (params.key === "rawValue_asocDouble") {
                            var valor = number;
                            if (valor != undefined) {
                                valor = (valor).formatMoney(0, '.', '.');
                            }
                            return valor;
                        }
                        else if (params.key === "value") {
                            var valor = number;
                            if (valor != undefined) {
                                valor = (valor / 1000000).formatMoney(0, '.', '.');
                            }

                            return "Valor total millones L " + valor.toString()

                        }
                        else if (params.key === "share") {
                            return d3.round(number, 2) + " %";
                        }
                        else if (params.key == "rawValue_asoc") {
                            return getAbreviaturaMesGraph(number);
                        }
                        else {
                            return formatted;
                        }
                    },
                    "text": function (text, params) {
                        if (params.key == "rawValue_asoc") {
                            if (text != "") {
                                return getAbreviaturaMesGraph(parseInt(text));
                            } else {
                                return text ;
                            }

                        } else {
                            if (text == "label") {
                                return "Mes";
                            } else if (text == "rawValue") {
                                return "Valor";
                            }
                            else if (text == "rawValue_asocDouble") {
                                return "Contratados";
                            }
                            else if (text == "share") {
                                return "Participación";
                            }
                            else if (text == "including") {
                                return "Incluye";
                            }
                            else if (text === "value") {
                                var valor = text;
                                if (text != undefined) {
                                    valor = (valor / 1000000).formatMoney(0, '.', '.');
                                }
                                return "L " + valor.toString() + " Millones";
                            }
                            else if (text == "rawValue_asoc") {
                                return "Mes";
                            }
                            else {
                                return " ";
                            }
                        }



                    }
                })
                .tooltip({ value: "rawValue_asoc" })
                .draw()
        }

        function getAbreviaturaMesGraph(codigo) {
            var nombre = "";
            switch (codigo) {
                case 1:
                    nombre = "ENE";
                    break;
                case 2:
                    nombre = "FEB";
                    break;
                case 3:
                    nombre = "MAR";
                    break;
                case 4:
                    nombre = "ABR";
                    break;
                case 5:
                    nombre = "MAY";
                    break;
                case 6:
                    nombre = "JUN";
                    break;
                case 7:
                    nombre = "JUL";
                    break;
                case 8:
                    nombre = "AGO";
                    break;
                case 9:
                    nombre = "SEP";
                    break;
                case 10:
                    nombre = "OCT";
                    break;
                case 11:
                    nombre = "NOV";
                    break;
                case 1:
                    nombre = "DIC";
                    break;
                default:
                    nombre = codigo.toString();
            }
            return nombre;

        }


        function ObtSubsidiosPerPeriodo(periodo) {
            var param = "periodo=" + periodo;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerFarmaciasPerAnio",
                cache: false,
                data: param,
                success: function (result) {
                    var datos = result.FarmaciasPeriodo;
                    $("#divGraphFarmaciasPeriodo").html("");
                    if (result.status == true) {
                        if (datos != null) {
                            barra_vertical("divGraphFarmaciasPeriodo", datos);
                        }

                    } else {
                        bootbox.alert("Error: " + result.message, function () {

                        });
                    }

                },
                error: function (response) {
                    bootbox.alert(response.responseText);
                },
                failure: function (response) {
                    bootbox.alert(response.responseText);
                }
            });

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

    }
);