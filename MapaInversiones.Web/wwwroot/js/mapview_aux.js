
InicializaDatos();


function InicializaDatos() {

    GetProyectosNacionales();
}


function GetProyectosNacionales() {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosProyectos/GetProyectosNacional",
        cache: false,
        success: function (result) {
            var datos = result;
            if (datos.length > 0) {
                loadProyectosPrioritarios(datos);
                $("#cantidaddist").val(datos[0].value); //cantidad de registros
                dibujaPaginacionProyectos(1, Math.ceil($("#cantidaddist").val() / 8), 10);
            }
            else {
                $("#divNoEncontradoEjec").show();
                $("#divPagDist").hide();
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
function dibujaPaginacionProyectos(actual, totalPag, cant_por_linea) {
    var pag_actual = parseInt(actual);
    pagina_actual = pag_actual;
    $("#divPagDist").empty();
    $("#divPagDist").show();
    var divPag = d3.select("#divPagDist");

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
        var pag_enlace = divPag.append("a")
            .attr("id", "page_left")
            .attr("role", "button")
            .attr("class", "material-icons md-24")
            .attr("data-page", inicio - cant_por_linea)
        pag_enlace.append("span")
            .attr("class", "")
            .text("chevron_left ")
    }



    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            var pag_enlace = divPag.append("span")
                .attr("class", "pag_actual")
                .attr("data-page", i)
            pag_enlace.append("text")
                .text(i)
        } else {
            var pag_enlace = divPag.append("a")
                .attr("class", "page_left")
                .attr("role", "button")
                .attr("data-page", i)
            pag_enlace.append("span")
                .attr("class", "glyphicon")
            pag_enlace.append("text")
                .attr("class", "paginacion")
                .text(i)

        }


    }

    if (pag_actual < totalPag) {
        //(totalPag - pag_actual) > cant_por_linea
        if (fin < totalPag) {
            var pag_enlace_der = divPag.append("a")
                .attr("id", "page_right")
                .attr("role", "button")
                .attr("class", "material-icons md-24")
                .attr("data-page", fin + 1)
            pag_enlace_der.append("span")
                .attr("class", "")
                .text("chevron_right")

        }
    }

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
        pagina_actual = $(this).attr("data-page");
        GetProyectosNacionalesFiltro($("#sorty").val(), pagina_actual);
    });

}


function filterChanged() {
    var filtro = $("#sorty").val();
    if (filtro != "") {
        GetProyectosNacionalesFiltro(filtro, 1);
    }
}

function GetProyectosNacionalesFiltro(camp, pagina) {
        var filtros = {
        campo: camp,
        pagina: pagina,
        cantidad : 8
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosProyectos/GetProyectosNacionalFiltro",
        cache: false,
        data: filtros,
        success: function (result) {
            var datos = result;
            if (datos.length > 0) {
                loadProyectosPrioritarios(datos);
                dibujaPaginacionProyectos(pagina, Math.ceil($("#cantidaddist").val() / 8), 10);
            }
            else {
                $("#divNoEncontradoEjec").show();
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

function makeCellHtml(resultados) {
    var limite = 60;
    var str_cad = "";
    var cad_valor = "";
    for (var i = 0; i < resultados.length; i++) {
        var nombre_aux = resultados[i].nombreProyecto.toString();
        if (nombre_aux.length > limite) {
            nombre_aux = nombre_aux.substr(0, limite) + "...";
        }

        str_cad += '<div class="project-col project-col-carusel">';
        str_cad += '<div class="project-card">';
        str_cad += '<div class="card h-100 shadow border-0">';
        str_cad += '<div class="img-card" style="background: url(\'../img/default_SM.jpg\')">';
        str_cad += '</div>';
        str_cad += '<div class="labelCategory">' + resultados[i].nombreSector + '</div>';
        str_cad += '<div class="caption">';
        str_cad += '<a href="../projectprofile/' + resultados[i].idProyecto + '">';
        str_cad += '<h3>' + nombre_aux + '</h3>';

        if (resultados[i].approvedTotalMoney > 1000000) {
            cad_valor = "$ " + (convertirMillones(resultados[i].approvedTotalMoney)*1).formatMoney(0, '.', ',').toString()  + " Millones";
        } else {
            cad_valor = "$ " + (resultados[i].approvedTotalMoney*1).formatMoney(0, '.', ',').toString() ;
        }
        str_cad += '<div class="amount"><span class="bigNumber">' + cad_valor + '</span></div>';
        str_cad += '</a>';
        str_cad += '</div>';
        str_cad += '</div>';
        str_cad += '<div class="clearfix"></div>';
        str_cad += '<div class="percentage">';
        str_cad += '<div class="completed" style="width:' + resultados[i].porcentajeGastado + '%"></div>';
        str_cad += '<div class="indicatorValues">';
        str_cad += '<span class="startPoint">' + resultados[i].mesInicioProyecto + '<br/>' + resultados[i].anioInicioProyecto + '</span>';
        str_cad += '<span class="endPoint">' + resultados[i].mesFinProyecto + '<br/>' + resultados[i].anioFinProyecto + '</span>';
        str_cad += '<span class="middlePoint text-center">' + resultados[i].porcentajeGastado + '%' + '<br/>' + 'Gastado</span>';
        str_cad += '</div>';
        str_cad += '</div>';
        str_cad += '<div class="clearfix"></div>';
        str_cad += '<div class="row detailedLinks">';
        str_cad += '<div class="col-6">';
        str_cad += '<a href="' + '../projectprofile/' + resultados[i].idProyecto + '">';
        str_cad += '<span class="material-icons">photo_library</span>';
        str_cad += '<span class="text-ic">' + '(' + resultados[i].cantidadFotos + ')</span>';
        str_cad += '</a>';
        str_cad += '</div>';
        str_cad += '<div class="col-6">';
        str_cad += '<a href="' + '../projectprofile/' + resultados[i].idProyecto + '">';
        str_cad += '<span class="material-icons">question_answer</span>';
        str_cad += '<span class="text-ic">' + '(' + resultados[i].comentarios + ')</span>';
        str_cad += '</a>';
        str_cad += '</div>';
        str_cad += '</div>';
        str_cad += '</div>';
        str_cad += '</div>';
    }
    return str_cad;
}


function convertirMillones(num) {
    return num > 999999 ? (num / 1000000).toFixed(0) : num

}



function loadProyectosPrioritarios(resultados) {
    $("#divNoEncontradoEjec").hide();
    $("#divNoExistenEjec").hide();
    $("#divContenedorFichas").show();
    if (resultados.length > 0) {
        
        var $cellElems = $(makeCellHtml(resultados));
        $("#divContenedorFichas").html($cellElems);
    }
    else {
        //no existen proyectos en ejecucion
        $("#divContenedorFichas").hide();
        $("#divNoExistenEjec").show();

    }


}