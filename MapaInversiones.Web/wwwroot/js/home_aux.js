var fuentesporAnnios = JSON.parse(document.body.getAttribute('data-fuentesporAnnios'));
var sector_ideas_globales = [];
var anyo_actual = $("#anioPresupuesto option:selected").val();
$("#lblAnyoBannerSec").text(anyo_actual);
///-------------------------------------------------------
loadFuentesporAnnios();

ObtenerGraphBySectorPerGroup(anyo_actual);

function loadProyectosPrioritarios(resultados) {
    var limite = 60;
    $("#divNoEncontradoEjec").hide();
    $("#divNoExistenEjec").hide();
    if (resultados.length > 0) {
        for (var i = 0; i < resultados.length; i++) {
            var valor_aux = parseFloat(resultados[i].approvedTotalMoney);
            var nombre_aux = resultados[i].NombreProyecto.toString();
            if (nombre_aux.length > limite) {
                nombre_aux = nombre_aux.substr(0, limite) + "...";
            }

            var div_proy = d3.select("#divContenedorFichas")
            var div_ficha = div_proy.append("div")
            div_ficha.attr("class", "project-col project-col-carusel")
            var div_card = div_ficha.append("div").attr("class", "project-card")
            var div_borde = div_card.append("div").attr("class", "card h-100 shadow border-0")
            div_borde.append("div").attr("class", "img-card").attr("style", "background: url('/img/TTpic_01_MD.jpg')")
            div_borde.append("div").attr("class", "labelCategory").text(resultados[i].NombreSector)
            var div_caption = div_borde.append("div").attr("class", "caption")
            var div_enlace = div_caption.append("a").attr("href", "../../perfilProyecto/" + resultados[i].IdProyecto)
            div_enlace.append("h3").text(nombre_aux)
            if (resultados[i].approvedTotalMoney > 1000000) {
                div_enlace.append("div").attr("class", "amount").append("span").attr("class", "bigNumber").text('$ ' + formatMoney(valor_aux / 1000000, 2, ".", ",").toString() + ' Millones');
            } else {
                div_enlace.append("div").attr("class", "amount").append("span").attr("class", "bigNumber").text('$ ' + formatMoney(valor_aux / 1, 2, ".", ",").toString());

            }

            div_card.append("div").attr("class", "clearfix")
            var div_porcentaje = div_card.append("div").attr("class", "percentage")
            div_porcentaje.append("div").attr("class", "completed").attr("style", "width:" + resultados[i].porcentajeGastado + "%")
            var div_indicador = div_porcentaje.append("div").attr("class", "indicatorValues")
            div_indicador.append("span").attr("class", "startPoint").html(resultados[i].MesInicioProyecto + "<br/>" + resultados[i].AnioInicioProyecto)
            div_indicador.append("span").attr("class", "endPoint").html(resultados[i].MesFinProyecto + "<br/>" + resultados[i].AnioFinProyecto)
            div_indicador.append("span").attr("class", "middlePoint text-center").html(resultados[i].porcentajeGastado + " %" + "<br/>" + "Gastado")
            div_card.append("div").attr("class", "clearfix")

            var div_detalles = div_card.append("div").attr("class", "row detailedLinks")

            var div_photo = div_detalles.append("div").attr("class", "col-6")
            var enlace_photo = div_photo.append("a").attr("href", "../projectprofile/" + resultados[i].IdProyecto)
            enlace_photo.append("span").attr("class", "material-icons").text("photo_library")
            enlace_photo.append("span").attr("class", "text-ic").text("(" + resultados[i].cantidadFotos + ")")

            var div_question = div_detalles.append("div").attr("class", "col-6")
            var enlace_question = div_question.append("a").attr("href", "../projectprofile/" + resultados[i].IdProyecto)
            enlace_question.append("span").attr("class", "material-icons").text("question_answer")
            enlace_question.append("span").attr("class", "text-ic").text("(" + resultados[i].Comentarios + ")")

        }
    }
    else {
        //no existen proyectos en ejecucion
        $("#divNoExistenEjec").show();

    }


}

function ObtenerGraphBySectorPerGroup(anyo_actual) {
    $("#divGraphRecursosObj").empty();
    $("#divContadores").empty();
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosHome/ObtenerProyectosPorSectorGroupHome",
        cache: false,
        data: {anyo:anyo_actual},
        success: function (result) {
            if (result.status == true) {
                var data = result.projectsPerSectorGroup;
                if (data != null) {
                    
                    const sum_sectores = groupAndSum(data, ['ordenGroup', 'idSector', 'labelGroup', 'url_imagen'], ['rawValue']);
                    const sum_ordenado = sum_sectores.sort(function (a, b) {
                        if (a.ordenGroup !== b.ordenGroup) {
                            return a.ordenGroup - b.ordenGroup;
                        }
                        return b.rawValue - a.rawValue;
                    });
                    sector_ideas_globales = data;

                    getGraphPorSectorByObrasTab(sum_ordenado, "divContentSectores");
                    ///-------------------------------------------------------------------
                    ///TOP SECTORES BANNER
                    const sum_all = groupAndSum(data, ['label', 'url_imagen','orden'], ['rawValue']);
                    var filter_sec = $(sum_all).filter(function () {
                        return this.orden ===1;
                    });
                    var prioritarios_sec = filter_sec.sort((a, b) => b.rawValue - a.rawValue);
                    if (prioritarios_sec.length >= 3) {
                        var topSectores = prioritarios_sec.slice(0, 3);
                        loadSectoresBanner(topSectores);
                    }
                    ///-----------------------------------------------------------------------
                    
                }

            } else {
                bootbox.alert("Error: " + result.Message, function () {

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


function filtrarSector(data, sector) {
    var filtrados = jQuery.grep(data, function (n, i) {
        return (n.labelGroup == sector.toString().toUpperCase());
    });
    return filtrados;
}

function getGraphPorSectorByObrasTab(objSectores, divContenedor) {
    var str_aux = '';
    var cont = 0;
    var max_fila = 4;
    var total_tab = 0;
    str_aux += '<div class="row">';



    for (var i = 0; i < objSectores.length; i++) {
        var idSector = objSectores[i].idSector;
        var valor = objSectores[i].rawValue/1000000;
        
        total_tab += objSectores[i].rawValue;

        var fondo = "/img/otros-mas.svg";
        if (objSectores[i].url_imagen != null) {
            fondo = objSectores[i].url_imagen;
        }

        if (idSector == 0 || cont < 7) {
            str_aux += '<div id="div_' + + i.toString() + '" class="col-lg-3 mb-3" location_id="' + objSectores[i].labelGroup + '" location_cant="' + objSectores[i].rawValue + '">';
            str_aux += '<div class="card h-100 shadow border-0 card-entidad">';
            str_aux += '<div class="card-body CTASectores">';
            str_aux += '<div class="icon-sectores">';
            str_aux += '<img src = "' + fondo + '" alt = "icono' + objSectores[i].labelGroup + '">';
            str_aux += '</div>';
            str_aux += '<div class="card-content-container">';
            str_aux += '<span class="crdtitle-entidad">' + objSectores[i].labelGroup + '</span>';
            str_aux += '<div class="card-subtitle-container">';
            str_aux += '<span class="SbtPresupuesto">Presupuesto vigente</span><br/>';
            str_aux += '<span class="SbtBigNumber">$ ' + formatMoney(valor, 2, ".", ",") + ' Millones' + '</span>';
            str_aux += '</div>';
            str_aux += '<a href="/PerfilSector?id=' + idSector + '">';
            str_aux += '<div class="btn btn-outlined">';
            str_aux += '<span>Ver sector &nbsp;<i class="material-icons md-28">navigate_next</i> ';
            str_aux += '</span>';
            str_aux += '</div>';
            str_aux += '</a>';
            str_aux += '</div>';
            str_aux += '</div>';
            str_aux += '</div>';
            str_aux += '</div>';

        }


        cont += 1;

    }
    str_aux += '</div>';

    $("#" + divContenedor).html(str_aux);
    $("#" + divContenedor).attr("total", total_tab);
    $(".category_sector").bind('mouseover onmouseover', function (e) {
        var porcentaje = 0;
        var total_sector = 0;
        var total_all = 0;
        $(".sector_tooltip").remove();

        if ($(this).parent().length > 0) {
            total_all = $(this).parent().attr("total");
        }

        var sel_sector = $(this).attr("location_id");
        var tipo_tab = $(this).attr("tipo");


        var id = $(this).attr("id");
        var str_estados = "";
        var estados_aux = "";
        var total_tab = 0;

        var data_filter = [];
        data_filter = $.grep(sector_ideas_globales, function (element, index) {
            return element.labelGroup == sel_sector;
        });




        if (data_filter != null) {
            //agrupar y sumar
            const suma = groupAndSum(data_filter, ['orden', 'label', 'alias'], ['rawValue']).sort((a, b) => Number(a.orden) - Number(b.orden));

            $(suma).each(function (element, index) {
                total_sector += this.rawValue;
                var cad_estado = this.alias;

                estados_aux += '<span class="label_tooltipSec">' + cad_estado + '</span>';
                estados_aux += '<span class="label_tooltipSecNumber">' + this.rawValue.toString() + '</span>';
                if (element < suma.length - 1) {
                    estados_aux += '<hr class="linea_tooltipSec"></hr>';
                }

            });

            porcentaje = ((total_sector / total_all) * 100).toFixed(2);

        }

        var elm = $(this);
        var id = elm.attr("id");
        var xPos = (e.pageX - elm.offset().left) + 10;
        var yPos = (e.pageY - elm.offset().top) + 10;

        xPos = 50;
        yPos = 50;

        var estilo = "position:absolute;z-index:1;opacity:1;width: 200px;height:auto;min-height:100px;top:" + yPos + "px;left:" + xPos + "px;";
        var htmlpop = '<span class="sector_tooltip_grupo">' + sel_sector + '</span><span class="sector_tooltip_percent">' + porcentaje.toString() + '% </span>';

        htmlpop += '<div class="estados_tooltip_body">' + estados_aux + '</div> ';




        // create a tooltip
        if ($("#" + id).length > 0) {
            var tooltip = d3.select("#" + id)
                .append("div")
                .attr("class", "sector_tooltip")
                .attr("style", "position:absolute;opacity:1;width: 0px;height:0px;top:0px;left:0px;")
                .append("div")
                .attr("class", "sector_tooltip_body")
                .attr("style", estilo)
                .html(htmlpop)
        }




    });

    $("#divContentSectores").bind('mouseout', function (e) {
        setTimeout(
            function () {
                //do something special
                $(".sector_tooltip").remove();
            }, 2000);
    });
}

function loadSectoresBanner(result) {
 var str_cad = "";
    if (result != null) {
        for (var i = 0; i < result.length; i++) {
            var valor = result[i].rawValue / 1000000;
            str_cad += '<div class="col-lg-3">';
            str_cad += '<div class="card shadow card-sector h-100">';
            str_cad += '<div class="CTASectores">';
            str_cad += '<div class="icon-sectores"><img src="' + result[i].url_imagen + '" alt="icono relacionado" /></div>';
            str_cad += '<div class="card-content-container">';
            str_cad += '<span class="crdtitle-entidad">' + result[i].label + '</span>';
            str_cad += '<div class="card-subtitle-container "><span class="SbtPresupuesto">Presupuesto vigente</span><br><span class="SbtBigNumber">$ ' + formatMoney(valor,0,".",",") + ' Millones</span></div>';
            str_cad += '<a href="/PresupuestoGeneral?sector=undefined#RecPerSector">';
            str_cad += '<div class="btn btn-link"><span>Ver sector &nbsp;<i class="material-icons md-28">navigate_next</i> </span></div>';
            str_cad += '</a>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
        }
        $("#bannerSectoresGasto").html(str_cad)
    }
    

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

$("#anioPresupuesto").on("change", function (event) {
    anyo_actual = this.value;
    loadFuentesporAnnios();

    
});

function loadFuentesporAnnios() {
        if (fuentesporAnnios.length > 0) {
        var annio_aux = $("#anioPresupuesto").val();
        var tabfuentes = '';
        var valor_aux = 0;
        var flagprimero = 0;
        tabfuentes += ' <ul class="tabs-nav">';

        for (var i = 0; i < fuentesporAnnios.length; i++) {
            if (fuentesporAnnios[i].Anio.toString() == annio_aux) {
                valor_aux += parseFloat(fuentesporAnnios[i].ValorVigente);
                if (flagprimero == 0) {
                    tabfuentes += ' <li id="' + annio_aux + '-' + fuentesporAnnios[i].CodigoFuente + '" class="enlace_nivel_administracion active">';
                }
                else { 
                    tabfuentes += ' <li id="' + annio_aux + '-' + fuentesporAnnios[i].CodigoFuente + '" class="enlace_nivel_administracion">';
                }
                tabfuentes += '<div class="goal-number"></div>';
                tabfuentes += '<div class="goal-name"><div class="h4">' + fuentesporAnnios[i].Fuente + '</div></div>';
                tabfuentes += '</li >';
                flagprimero++;
            }
        }
        tabfuentes += ' </ul>';
        $("#tabsfuentes").html(tabfuentes);
        cargardatosorganismos(fuentesporAnnios[0].CodigoFuente);
        $("#valorvigente").html('$ ' + formatMoney(valor_aux / 1000000, 0, ".", ",").toString() + ' Millones');

        ///graficoDonaPerFuentes
         getGraphDonaFuentesPerAnyo(annio_aux);
        ///---------------------------------------------

        $('.enlace_nivel_administracion').on('click', function () {
            $('.enlace_nivel_administracion').each(function (i, obj) {
                $(obj).removeClass("active");
            });
            $(this).addClass("active");
            var id = this.id;
            var cod = id.split("-");
            cargardatosorganismos(cod[1]);
        });
    }
   
}

function getGraphDonaFuentesPerAnyo(anyo) {
    $("#divGraphDonaPerFuentes").empty();
    var filter_obj = $(fuentesporAnnios).filter(function () {
        return this.Anio === parseInt(anyo);
    });

    if (filter_obj != null) {
        const width = 600;
        const height = 400;
        const radius = Math.min(width, height) / 2;

        d3.select("#divGraphDonaPerFuentes")
            .append("g")
            .attr("transform", "translate(100,100)");

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
            .value((d) => d.ValorVigente)
            .sortValues((a, b) => a < b ? 1 : -1);

        var data = angleGen(filter_obj);

        var arcGen = d3.arc()
            .innerRadius(50)
            .outerRadius(90);

        d3.select("#divGraphDonaPerFuentes g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("d", arcGen)
            .attr("fill", (d, i) => colorScale(i))
            .attr("stroke", "gray")
            .attr("stroke-width", 1);




    }

}

function cargardatosorganismos(idfuente) {
    var annio_aux = $("#anioPresupuesto").val();
    var filtros = {
        Annio: annio_aux,
        idfuente: idfuente
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosHome/ObtenerOrganismosPorFuente",
        cache: false,
        data: filtros,
        success: function (result) {
            if (result.status == true) {
                var info = result.organismosFinanciadores;
                if (result.consolidadoOrganismoFinanciador != null && result.consolidadoOrganismoFinanciador != undefined) {
                    $("#numorganismos").html(result.consolidadoOrganismoFinanciador.totalFinanciadores);
                    $("#numproyectos").html(result.consolidadoOrganismoFinanciador.totalProyectosFinanciados);
                    $("#numaportado").html('$ ' + formatMoney(result.consolidadoOrganismoFinanciador.totalAportado, 0, ".", ",").toString() + ' Millones');
                }

                var htmldivorganismos = '';
                var numeroorganismosmostrar = 3;
                if (info != null) {
                    for (var i = 0; i < info.length; i++) {

                        if (i < numeroorganismosmostrar) { 
                            htmldivorganismos += '<div class="col-lg-4 mb-4">';
                            htmldivorganismos += '    <div class="card h-100 shadow border-0 card-entidad">';
                            htmldivorganismos += '        <div class="card-body CTASectores">';
                            htmldivorganismos += '            <div class="card-title-container">';
                            htmldivorganismos += '                <span class="h4">';
                            htmldivorganismos += info[i].organismoFinanciador;
                            htmldivorganismos += '                </span>';
                            htmldivorganismos += '            </div>';
                            htmldivorganismos += '            <div class="wrap-content-fuente">';
                            htmldivorganismos += '                <div class="icon-sectores">';
                            htmldivorganismos += '                    <img class="img-fluid" src="img/ic-entidad.svg" alt="icono decorativo relacionado al organismo financiador" />';
                            htmldivorganismos += '                </div>';
                            htmldivorganismos += '                <div class="card-subtitle-container">';
                            htmldivorganismos += '                    <span class="SbtBigNumber">' + info[i].numeroProyectos +'</span>';
                            htmldivorganismos += '                    <span class="SbtPresupuesto">Proyectos Financiados</span>';
                            htmldivorganismos += '                    <span class="SbtBigNumber"> $ ' + formatMoney(info[i].valorVigente / 1000000, 0, ".", ",").toString() +'Millones </span>';
                            htmldivorganismos += '                    <span class="SbtPresupuesto">Monto total financiado</span>';
                            htmldivorganismos += '                    <a href="/FinancialOrganizationDetail?id=' + info[i].codigoOrganismoFinanciador + '&anio=' + annio_aux +'">';
                            htmldivorganismos += '                        <div class="btn btn-link"><span>Ver organismo financiador &nbsp;<i class="material-icons md-28">navigate_next</i> </span></div>';
                            htmldivorganismos += '                    </a>';
                            htmldivorganismos += '                </div>';
                            htmldivorganismos += '            </div>';
                            htmldivorganismos += '        </div>';
                            htmldivorganismos += '        </div>';
                            htmldivorganismos += '    </div>';
                        }
                    }


                    $("#divorganismos").html(htmldivorganismos);
                }

            } else {
                bootbox.alert("Error: " + result.Message, function () {

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