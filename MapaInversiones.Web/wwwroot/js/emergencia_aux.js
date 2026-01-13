var objPerContratos = JSON.parse(document.body.getAttribute('data-resourcesPerContratos'));
var objPerProcesos = JSON.parse(document.body.getAttribute('data-resourcesPerProcesos'));
var limite_tooltip = 100;

loadTreeMapGraph("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
configuraSelectDesglose();
configuraBtnVolver();

function configuraSelectDesglose() {
    $('.selDesglose').on('change', function () {
        var funciones = "";
        $(".selDesglose option:selected").each(function () {
            funciones += $(this).val() + ",";
        });
        funciones = funciones.replace(/,\s*$/, "");
        getArticulosGraphic(funciones);
    });

    $('.selDesgloseProc').on('change', function () {
        var funciones = "";
        $(".selDesgloseProc option:selected").each(function () {
            funciones += $(this).val() + ",";
        });
        funciones = funciones.replace(/,\s*$/, "");
        getArticulosGraphicProc(funciones);
    });

}

function configuraBtnVolver() {
    $('#btnVolver').click(function () {
        loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
    });
    $('#btnVolverContr').click(function () {
        loadTreeMapGraph("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
    });
}

function getArticulosGraphic(opcion) {
    switch (opcion) {
        case "entidad":
            loadTreeMapGraph("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
            break;
        case "articulo":
            loadTreeMapGraph("divGraphRecursosObj", objPerContratos, ["label_inf"], 1, "");
            break;
        default:
        // code block
    }
}

function getArticulosGraphicProc(opcion) {
    switch (opcion) {
        case "entidad":
            //console.log("Datos procesos entidad:", JSON.stringify(objPerProcesos, null, 2));
            loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
            break;
        case "articulo":
            loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["label_inf"], 1, "");
            break;
        default:
        // code block
    }

}

function assignColor(indice) {
    var color_aux = "#ECEFF1";
    var colores_default = [
        "#7790c1",
        "#9ecbd0",
        "#d1b873",
        "#80a8c2",
        "#4ba8e7",
        "#a677c1",
        "#29B6F6",
        "#E0E0E0",
        "#C5CAE9",
        "#00ACC1",
        "#BDBDBD",
        "#40C4FF",
        "#7790c1",
        "#9ecbd0",
        "#d1b873",
        "#80a8c2",
        "#4ba8e7",
        "#a677c1",
        "#29B6F6",
        "#E0E0E0",
        "#C5CAE9",
        "#00ACC1",
        "#BDBDBD",
        "#40C4FF"

    ];
    if (indice < colores_default.length) {
        color_aux = colores_default[indice];
    }
    return color_aux;
}


function loadTreeMapGraph(divContenedor, objData, agrupador, nivel, origen) {
    var titulo = "Otros con participación";
    var textoExpandir = "Clic para expandir";
    var limitePorc = 0.03;

    if (nivel == 0) {
        limitePorc = 0;
        titulo = "";
    }

    $(".btnback").hide();
    $("#" + divContenedor).empty();

    if (objData != undefined && objData != null) {
        var total = 0;
        for (var i = 0; i < objData.length; i++) {
            objData[i].rawValue = parseFloat(objData[i].rawValue);
            total += objData[i].rawValue;
        }
        var distintos = objData.map(item => item.labelGroup)
            .filter((value, index, self) => self.indexOf(value) === index);
        if (nivel == 1) {
            distintos = objData.map(item => item.label_inf)
                .filter((value, index, self) => self.indexOf(value) === index);
        }

        var grafica = new d3plus.Treemap()
            .select("#" + divContenedor)
            .shapeConfig({
                label: (d) => {
                    var auxiliar = "";
                    var porc = (((d.rawValue / total) * 100)).formatMoney(1, '.', ',').toString();
                    if (nivel == 0) {
                        auxiliar = d["labelGroup"];

                    } else if (nivel == 1) {
                        var vec_orig = d["label_inf"].toString().split(",");

                        if (vec_orig.length > 1) {
                            auxiliar = "Otros";
                        } else {
                            auxiliar = d["label_inf"]
                        }


                    }
                    return [auxiliar, porc + "%"];
                },
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
                }
                , fill: function (d, index) {
                    var color_aux = "#ECEFF1";
                    color_aux = assignColor(index);
                    return color_aux;

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
                threshold: limitePorc,
                //thresholdName: titulo,
                data: objData,
                groupBy: agrupador,
                height: 400,
                tooltipConfig: {
                    title: function (d) {
                        var current = grafica.depth();
                        var auxiliar = "";
                        var cad = "";
                        var aux_grupo = "";
                        if (nivel == 0) {
                            //entidad
                            aux_grupo = d["labelGroup"];
                            if (aux_grupo.length > limite_tooltip) {
                                aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                            }
                            cad = aux_grupo;

                        } else {
                            //articulo
                            if (origen == "btn") {
                                aux_grupo = d["labelGroup"];
                                if (aux_grupo.length > limite_tooltip) {
                                    aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                                }
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                                }
                                cad = "<p style='float:right'>" + aux_grupo + "</p><br />" + auxiliar;
                            } else {
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                                }
                                cad = auxiliar;
                            }


                        }


                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["rawValue"] / 1;
                            var cad = "";
                            cad += "<span>" + "RD$ " + valor.formatMoney(1, '.', ',').toString() + "</span></br>";
                            return cad;
                        }]
                    ],
                    footer: function (d) {
                        if (nivel == 0) {
                            textoExpandir = "Clic para expandir";
                        } else {
                            textoExpandir = "";
                        }
                        return textoExpandir;
                    }

                },
                yConfig: {
                    title: "",
                }
            })
            .sum("rawValue")
            .depth(0)
            .legend(false)
            .on("click.shape", function (d) {
                if (d["labelGroup"] != undefined && d["labelGroup"] != null) {
                    if (nivel == 0) {
                        //var vec_orig = d["labelGroup"].toString().split(",");
                        //if (vec_orig.length == 1) {
                            var data_pagina = jQuery.grep(objPerContratos, function (n, i) {
                                return (n.labelGroup == d["labelGroup"].toString()); // vec_orig[0]);
                            });
                            //loadTreeMapGraphProc("divGraphRecursosProcesos", data_pagina, ["label_inf"], 1, "btn");
                            loadTreeMapGraph("divGraphRecursosObj", data_pagina, ["label_inf"], 1, "btn");
                            $(".btnback").show();
                        //} else {
                        //    var vec_orig = d["labelGroup"].toString().split(",");
                        //    var objReturn = [];
                        //    for (var i = 0; i < vec_orig.length; i++) {
                        //        var actual = vec_orig[i];
                        //        var data_pagina = jQuery.grep(objPerContratos, function (n, i) {
                        //            return (n.labelGroup == actual);
                        //        });
                        //        if (data_pagina != null) {
                        //            if (data_pagina.length > 0) {
                        //                for (var k = 0; k < data_pagina.length; k++) {
                        //                    objReturn.push(data_pagina[k]);
                        //                }
                        //            }
                        //        }
                        //    }

                        //    //loadTreeMapGraphProc("divGraphRecursosProcesos", objReturn, ["label_inf"], 1, "btn");
                        //    loadTreeMapGraph("divGraphRecursosObj", objReturn, ["label_inf"], 1, "btn");
                        //    $(".btnback").show();

                        //}
                    }
                }

            })
            .render();
    }

}


function loadTreeMapGraphProc(divContenedor, objData, agrupador, nivel, origen) {
    var titulo = "Otros";
    var textoExpandir = "Clic para expandir";
    var limitePorc = 0.03;

    if (nivel == 0) {
        limitePorc = 0;
        titulo = "";
    }

    $(".btnback").hide();
    $("#" + divContenedor).empty();

    if (objData != undefined && objData != null) {
        var total = 0;
        for (var i = 0; i < objData.length; i++) {
            objData[i].rawValue = parseFloat(objData[i].rawValue);
            total += objData[i].rawValue;
        }
        var distintos = objData.map(item => item.labelGroup)
            .filter((value, index, self) => self.indexOf(value) === index);
        if (nivel == 1) {
            distintos = objData.map(item => item.label_inf)
                .filter((value, index, self) => self.indexOf(value) === index);
        }

        var grafica = new d3plus.Treemap()
            .select("#" + divContenedor)
            .shapeConfig({
                label: (d) => {
                    var auxiliar = "";
                    var porc = (((d.rawValue / total) * 100)).formatMoney(1, '.', ',').toString();
                    if (nivel == 0) {
                        auxiliar = d["labelGroup"];

                    } else if (nivel == 1) {
                        var vec_orig = d["label_inf"].toString().split(",");

                        if (vec_orig.length > 1) {
                            auxiliar = "Otros";
                        } else {
                            auxiliar = d["label_inf"]
                        }


                    }
                    return [auxiliar, porc + "%"];
                },
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
                }
                , fill: function (d, index) {
                    var color_aux = "#ECEFF1";
                    color_aux = assignColor(index);
                    return color_aux;

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
                threshold: limitePorc,
                data: objData,
                groupBy: agrupador,
                height: 400,
                tooltipConfig: {
                    title: function (d) {
                        var current = grafica.depth();
                        var auxiliar = "";
                        var cad = "";
                        var aux_grupo = "";
                        if (nivel == 0) {
                            //entidad
                            aux_grupo = d["labelGroup"];
                            if (aux_grupo.length > limite_tooltip) {
                                aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                            }
                            cad = aux_grupo;

                        } else {
                            //articulo
                            if (origen == "btn") {
                                aux_grupo = d["labelGroup"];
                                if (aux_grupo.length > limite_tooltip) {
                                    aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                                }
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                                }
                                cad = "<p style='float:right'>" + aux_grupo + "</p><br />" + auxiliar;
                            } else {
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                                }
                                cad = auxiliar;
                            }

                        }


                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["rawValue"] / 1;
                            var cad = "";
                            cad += "<span>" + "RD$ " + valor.formatMoney(1, '.', ',').toString() + "</span></br>";
                            return cad;
                        }]
                    ],
                    footer: function (d) {
                        if (nivel == 0) {
                            textoExpandir = "Clic para expandir";
                        } else {
                            textoExpandir = "";
                        }
                        return textoExpandir;
                    }

                },
                yConfig: {
                    title: "",
                }
            })
            .sum("rawValue")
            .depth(0)
            .legend(false)
            .on("click.shape", function (d) {
                if (d["labelGroup"] != undefined && d["labelGroup"] != null) {
                    if (nivel == 0) {
                        //var vec_orig = d["labelGroup"].toString().split(",");
                        //if (vec_orig.length == 1) {
                            var data_pagina = jQuery.grep(objPerProcesos, function (n, i) {
                                return (n.labelGroup == d["labelGroup"].toString());// vec_orig[0]);
                            });
                            loadTreeMapGraphProc("divGraphRecursosProcesos", data_pagina, ["label_inf"], 1, "btn");
                            $(".btnback").show();
                        //} else {
                        //    var vec_orig = d["labelGroup"].toString().split(",");
                        //    var objReturn = [];
                        //    for (var i = 0; i < vec_orig.length; i++) {
                        //        var actual = vec_orig[i];
                        //        var data_pagina = jQuery.grep(objPerProcesos, function (n, i) {
                        //            return (n.labelGroup == actual);
                        //        });
                        //        if (data_pagina != null) {
                        //            if (data_pagina.length > 0) {
                        //                for (var k = 0; k < data_pagina.length; k++) {
                        //                    objReturn.push(data_pagina[k]);
                        //                }
                        //            }
                        //        }
                        //    }

                        //    loadTreeMapGraphProc("divGraphRecursosProcesos", objReturn, ["label_inf"], 1, "btn");
                        //    $(".btnback").show();

                        //}
                    }
                }

            })
            .render();
    }

}




$('#enlace_contratos').click(function () {
    window.location.href = "/ContratosEmergencia?emergencia=" + $('#tipoemergencia').val();//?entidad=" + $(this).attr('data-entidad');
})

$('#enlace_procesos').click(function () {
    window.location.href = "/ContratosEmergencia?emergencia=" + $('#tipoemergencia').val();
})

$('#enlace_presupuesto_emergencia').click(function () {
    console.log("tipoemergencia")
    console.log("tipoemergencia", $('#tipoemergencia').val());
    window.location.href = "/EmergenciaPresupuesto?emergencia=" + $('#tipoemergencia').val();
})


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