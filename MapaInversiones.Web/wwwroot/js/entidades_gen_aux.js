getAnnios();
var anyo_actual = $("#annioEntidad option:selected").val();
var globales = [];
var globales_tab = [];
var cantXPagina = 6;
inicializaDatos();


GetRecursosPorNivel(anyo_actual);

function inicializaDatos() {
    configuraSelectPeriodo();
    
}


function getAnnios() {
    var actual = new Date().getFullYear();
    var limite = actual - 3;
    var select = "";
    for (var i = actual; i >= limite; i--) {
        if (i == actual) {
            select += '<option value="' + i.toString() + '" selected>' + i.toString() + '</option>';
        } else {
            select += '<option value="' + i.toString() + '">' + i.toString() + '</option>';
        }

    }

    $("#annioEntidad").html(select);
}

function configuraSelectPeriodo() {
    $('#annioEntidad').on('change', function () {
        anyo_actual = this.value;
        $("#divListado").empty();
        GetRecursosPorNivel(anyo_actual);
    })

}


function configuraFiltro_DesgloseIconos() {
    $(".tipo_grafica").click(function (e) {
        var tipo = $(this).attr('param');
        $(".tipo_grafica").removeClass("activo");
        $(this).addClass("activo");
        $("#filtro_iconos").attr("opc", tipo);
        getDataTab(tipo);
        

    });
}

function getDataTab(nom_tab) {
    if (nom_tab != "") {
        var filtrados = $.grep(globales, function (n, i) {
            return n.labelGroup === nom_tab;
        });
        globales_tab = filtrados;
        var pagina_actual = 1;
        var ini_data = ((pagina_actual - 1) * cantXPagina);
        var fin_data = (pagina_actual * cantXPagina) - 1;
        var data_pagina = arr = jQuery.grep(globales_tab, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        getEstructuraInfograficoPerEntidad(data_pagina, pagina_actual);

    }

}

function GetRecursosPorNivel(anyo) {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/GetRecursosPerNivel",
        type: "GET",
        data: {
            anyo: anyo
        }
    }).done(function (data) {
        if (data.infoRecursos != null) {
            globales = data.infoRecursos;
            var textoVigente = "L " + ((data.totalPresupuesto) / 1000000).formatMoney(1, '.', ',').toString() + " Millones";

            var nom_tab_1 = "";

            $("#divListado").empty();
            $("#PresupuestoAprobado").html("L " + ((data.totalAprobado) / 1000000).formatMoney(1, '.', ',').toString() + " Millones");
            $("#PresupuestoEjecutado").html("L " + ((data.totalEjecutado) / 1000000).formatMoney(1, '.', ',').toString() + " Millones");
            $("#PresupuestoVigente").html(textoVigente);
            

            var distintos = data.consolidadoNiveles;
            var totalEntidades = data.totalCantidades;

            var str_cad = "Para el periodo <strong>" + anyo + "</strong> se asignó un presupuesto de <strong>" + textoVigente + "</strong> a un total de <strong>" + totalEntidades + "</strong> instituciones.</br>" ;

            var str_html = "";
            for (var i = 0; i < distintos.length; i++) {
                str_cad += "<strong>" + distintos[i]["cantidad"] + "</strong> en <strong>" + distintos[i]["labelGroup"] + "</strong>, ";
                if (i == 0) {
                    str_html += '<a id="enlacelistado_gasto_' + i + '" role="button" class="tipo_grafica btn activo" param="' + distintos[i]["labelGroup"] + '">';
                    str_html += '<span class="txt-bold">' + distintos[i]["labelGroup"] + '</span>';
                    str_html += '</a>';
                    nom_tab_1 = distintos[0]["labelGroup"];
                    
                } else {
                    str_html += '<a id="enlacelistado_gasto_' + i + '" role="button" class="tipo_grafica btn" param="' + distintos[i]["labelGroup"] + '">';
                    str_html += '<span class="txt-bold">' + distintos[i]["labelGroup"] + '</span>';
                    str_html += '</a>';
                }
            }

            str_cad = str_cad.replace(/,\s*$/, "");
            $("#filtro_iconos").html(str_html);
            $("#divTextoTabs").html(str_cad);


            configuraFiltro_DesgloseIconos();

            if (nom_tab_1 != "") {
                getDataTab(nom_tab_1);
            }
           
            
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}

function getEstructuraInfograficoPerEntidad(datos, pagina) {
    var i_aux = 0;
    var j_aux = 0;
    var k_aux = 0;
    //var l = 0;
    var total_avance = 0;
    var total_presupuesto = 0;
    var total_aprobado = 0;
    var total_porc_ejecutado = 0;

    total_avance = globales_tab.reduce((sum, currentValue) => {
        return sum + currentValue.ejecutado;
    }, 0);

    total_presupuesto = globales_tab.reduce((sum, currentValue) => {
        return sum + currentValue.vigente;
    }, 0);

    total_aprobado = globales_tab.reduce((sum, currentValue) => {
        return sum + currentValue.aprobado;
    }, 0);
    total_porc_ejecutado = total_presupuesto == 0 ? 0 : total_avance * 100 / total_presupuesto;


    var html_str = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
    for (var i = 0; i < datos.length; i++) {
        var nomCollapse = "collapseOne_" + i_aux.toString() + "_" + j_aux.toString();
        var nomHeading = "headingOne_" + i_aux.toString() + "_" + j_aux.toString();

        var entidad_nom = datos[i].label;
        var porc_ejecutado = 0;
        if (datos[i].vigente > 0) {
            porc_ejecutado = (datos[i].ejecutado / datos[i].vigente) * 100;
        }


        html_str += '<div class="panel panel-default">';
        html_str += '<div class="panel-heading d-flex" role="tab" id="' + nomHeading + '">';
        html_str += '<div class="panel-title w-88">';
        html_str += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + nomCollapse + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
        html_str += '<div class="headEnt">';
        html_str += '<div class="data1 mainDataEntidad">';
        html_str += '<span class="labelTit">Institución</span>';
        html_str += '<span class="td1">' + entidad_nom + '</span>';
        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Presupuesto Aprobado</span>';
        if (datos[i].aprobado / 1000000 > 1) {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].aprobado / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
        } else {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].aprobado / 1).formatMoney(0, '.', ',').toString() + ' </span>';
        }

        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Presupuesto Vigente</span>';
        if (datos[i].vigente / 1000000 > 1) {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].vigente / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
        } else {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].vigente / 1).formatMoney(0, '.', ',').toString() + ' </span>';
        }

        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Ejecutado</span>';
        if (datos[i].ejecutado / 1000000 > 1) {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].ejecutado / 1000000).formatMoney(1, '.', ',').toString() + ' Millones </span>';
        } else {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].ejecutado / 1).formatMoney(0, '.', ',').toString() + '  </span>';
        }

        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">% Ejecución</span>';
        html_str += '<span class="td1">' + porc_ejecutado.formatMoney(1, '.', ',').toString() + '</span>';
        html_str += '</div>';

        html_str += '</div >';
        html_str += '</a>';
        html_str += '</div>';
        html_str += '<span class="btnPerfil badge bg-light text-dark"><a target="_blank" href="/PerfilEntidad?codEntidad=' + datos[i].id + '">Ver Detalle <i class="material-icons md-18">chevron_right</i></a></span>';
        html_str += '</div>';

        html_str += '</div>';

        i_aux = i_aux + 1;

    }
    html_str += "</div>";

    ///----------------
    html_str += '<div id="divPagFichas"></div>';
    ///----------------

    html_str += '<div id="divTotales" class="summUp">';
    html_str += '<div class="panel-title">';
    html_str += '<div class="head">';
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">&nbsp;</span>';
    html_str += '<span class="td1">Totales Generales</span>';
    html_str += '</div>';
    html_str += '<div class="data1">';
    //--------------------------------
    html_str += '<span class="labelTit">Presupuesto Aprobado</span>';
    if (total_aprobado / 1000000 > 1) {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_aprobado / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
    } else {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_aprobado / 1).formatMoney(0, '.', ',').toString() + '</span>';
    }
    html_str += '</div>';

    //--------------------------------
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">Presupuesto Vigente</span>';
    if (total_presupuesto / 1000000 > 1) {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
    } else {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_presupuesto / 1).formatMoney(0, '.', ',').toString() + '</span>';
    }
    html_str += '</div>';
    //--------------------------
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">Ejecutado</span>';
    if (total_avance / 1000000 > 1) {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
    } else {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_avance / 1).formatMoney(0, '.', ',').toString() + '</span>';
    }
    html_str += '</div>';
    //--------------------------
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">% Ejecución</span>';
    html_str += '<span class="td1">' + total_porc_ejecutado.formatMoney(1, '.', ',').toString()  + ' % </span>';
        
    html_str += '</div>';
    //------------------------
    html_str += '</div>';
    html_str += '</div>';
    html_str += '</div>';


    $("#divListado").html(html_str);
    var totalNumber = globales_tab.length;
    var totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;
    if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
        totalPages = totalPages + 1;
    }
    dibujarPagNumeradas(pagina, totalNumber, totalPages);

}

function dibujarPagNumeradas(actual, total, totalPag) {
    var pag_actual = parseInt(actual);
    var pagina_actual = pag_actual;
    var pagesHTML = '';
    var cant_por_pag = 6;
    var cant_por_linea = 10;
    $("#divPagFichas").html("");
    var divPag = $("#divPagFichas")
    var pag_enlace = "";

    var cociente = Math.floor(pag_actual / cant_por_linea);
    var residuo = pag_actual % cant_por_linea;
    var inicio = 1;
    if (residuo == 0) {
        inicio = (pag_actual - cant_por_linea) + 1;
    } else {
        inicio = (cociente * cant_por_linea) + 1;
    }

    var fin = inicio + (cant_por_linea - 1);
    if (totalPag < cant_por_linea) {
        fin = totalPag;
    }
    if (fin > totalPag) {
        fin = totalPag;
    }
    if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
        pag_enlace += '<a id="page_left" role="button" class="material-icons md-24" data-page="' + (inicio - cant_por_linea) + '"><span class="">chevron_left</span></a>';
    }


    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            pag_enlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
        } else {
            pag_enlace += '<a class="page_left" role="button" data-page="' + i + '">';
            pag_enlace += '<span class="glyphicon"></span>';
            pag_enlace += '<text class="paginacion">' + i + '</text>';
            pag_enlace += '</a>';
        }

    }

    if (pag_actual < totalPag) {
        if (fin < totalPag) {
            pag_enlace += '<a id="page_right" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
        }
    }

    $("#divPagFichas").html(pag_enlace);

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
        pagina_actual = $(this).attr("data-page");
        var ini_data = ((pagina_actual - 1) * cantXPagina);
        var fin_data = (pagina_actual * cantXPagina) - 1;
        var data_pagina = arr = jQuery.grep(globales_tab, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        $("#divListado").empty();
        getEstructuraInfograficoPerEntidad(data_pagina, pagina_actual);
    });

}


function monedaSimbolo(codigo) {
    var moneda = [];
    moneda["USD"] = "USD$";
    moneda["HND"] = "B/.";

    return moneda[codigo];
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