$( function() {
 
    $('.hover-link').click(function () {
        var val_sel = $(this).attr("data-title");
        $("#tipoRefine").html('"' + val_sel+'"');
        $("#ulPaginacion").attr("refine", val_sel);


    });

    $("#ulPaginacion").on("click", "li", function (e) {
        var $target = $(e.target);
        var index = $target.attr("pagina");

      

        if (!isNaN(index)) {
            $target.siblings().removeClass("active");
            $target.addClass("active");
            getListResult(index*1);
            $("#ulPaginacion").attr("actual", ((index <0)? 0:index));
        } else {
            if (index === "ap" && !$target.hasClass("pagination-item-disabled")) {
                getListResult(1 * $("#ulPaginacion").attr("siguiente"), true); // se envia la pagina a la que se quiere ir, booleano para indicar que se debe volver a paginar, cual boton fue el que se seleccionó
            }
            if (index === "bp" && !$target.hasClass("pagination-item-disabled") ) {
                getListResult(1 * $("#ulPaginacion").attr("anterior"), true); // se envia la pagina a la que se quiere ir, booleano para indicar que se debe volver a paginar, cual boton fue el que se seleccionó
            }

            if (index === "fp" && !$target.hasClass("pagination-item-disabled")) {
                getListResult(1 * $("#ulPaginacion").attr("inicial"), true); // se envia la pagina a la que se quiere ir, booleano para indicar que se debe volver a paginar, cual boton fue el que se seleccionó
            }
            if (index === "lp" && !$target.hasClass("pagination-item-disabled")) {
                getListResult(1 * $("#ulPaginacion").attr("final"), true); // se envia la pagina a la que se quiere ir, booleano para indicar que se debe volver a paginar, cual boton fue el que se seleccionó
            }
               
        }


        
    });
});

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}


function pintarPaginacion(totalResultados, pagina) { //total de resultados y pagina en la que inicia la fila a mostrar en la paginacion
    var totalR = totalResultados * 1;


    var rows = $("#ulPaginacion").attr("rows") * 1
    var paginasimp = $("#ulPaginacion").attr("paginasimp") * 1


    var paginasfor = paginasimp; //cantidad de paginas a mostrar en el for de impresion
    var paginas = (Math.ceil(totalR / rows)); // 10 rows por pagina y se calcula cuantas paginas hay en total
    var final = paginas - (paginas % paginasimp); //se calcula la pagina inicial del bloque final en la paginacoin ;

    var siguiente = pagina + 1
    var anterior = pagina - 1;

    var siguienteb = $("#ulPaginacion").attr("siguienteb") * 1;
    var anteriorb = $("#ulPaginacion").attr("anteriorb") * 1;

    if (siguienteb < pagina + 1 && final <= pagina + 1) { siguienteb = final + paginasimp; }
    else if (siguienteb < pagina + 1 && final > pagina + 1) { siguienteb = siguienteb + paginasimp; }
    else if (pagina > 0 && pagina < siguienteb - paginasimp) { siguienteb = siguienteb - paginasimp; }
    else if (pagina == 0) { siguienteb = paginasimp; }
    anteriorb = siguienteb - paginasimp;


    var hasta = ((siguienteb > paginas) ? paginas : siguienteb);


    $("#ulPaginacion").attr("anterior", anterior);
    $("#ulPaginacion").attr("siguiente", siguiente);
    $("#ulPaginacion").attr("anteriorb", anteriorb);
    $("#ulPaginacion").attr("siguienteb", siguienteb);
    $("#ulPaginacion").attr("final", final);

    var activo = false;

    var htmlPaginacion = " <li class='pagination-item-arrow pagination-item-arrow-first " + (pagina < paginasimp ? "pagination-item-disabled" : "pagination-item-enabled") + "  material-icons md-24' pagina='fp'>first_page</li>" +
        "<li class='pagination-item-arrow pagination-item-arrow-prev " + ((anterior < 0) ? "pagination-item-disabled" : "pagination-item-enabled") + " material-icons md-24' pagina = 'bp' > chevron_left</li >";

    for (var g = (siguienteb - paginasimp); g < (hasta); g++) {
        if (g == pagina) { activo = true; } else { activo = false; }
        if (activo) {
            htmlPaginacion += " <li pagina='" + g + "' class='paginacion active'>" + (g * 1 + 1) + "</li>";

        }
        else {
            htmlPaginacion += " <li pagina='" + g + "' class='paginacion'>" + (g * 1 + 1) + "</li>";
            activo = 0;
        }

    }
    htmlPaginacion += " <li class='pagination-item-arrow pagination-item-arrow-next material-icons md-24 " + ((siguiente >= paginas) ? "pagination-item-disabled" : "pagination-item-enabled") + " ' pagina='ap'>chevron_right</li>" +
        " <li class='pagination-item-arrow pagination-item-arrow-last material-icons md-24 " + ((siguienteb >= paginas) ? "pagination-item-disabled" : "pagination-item-enabled") + " ' pagina='lp'>last_page</li>";

    $("#ulPaginacion").html(htmlPaginacion);
}

function getListResult(pagina, repaginar=false ) {

    var val_sel = $("#ulPaginacion").attr("refine");
    var val_input = document.getElementById('page-field-search').value;
    var val_start = pagina * $("#ulPaginacion").attr("rows");
    var val_sort = $("#selectOrden option:selected").val()*1;
    
    var totalResultados = 0;

        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/BusquedaAsync/?SearchString=" + val_input + "&type=" + val_sel + "&start=" + val_start + "&sort=" + val_sort,
            cache: false,

            success: function (data) {
                var Resultados = document.getElementById("SearchResults");
                Resultados.innerHTML = "";
                var htmlResultados = "";
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        htmlResultados += "<div class='card card-info-wide'>" +
                            "<div class='card-body'>" +
                            "<a href='" + data[i].url + "' class='h5' title='" + data[i].nombreProyecto + "'>" + data[i].nombreProyecto + "</a>" +
                            "<div class='card-posted-in card-wide-item'>" +
                            "<span class='card-category' title='" + data[i].sector + "'>" + data[i].sector + "</span>" +
                            "<span class='card-category' title='" + data[i].type + "'> - " + data[i].type + "</span>" +
                            "</div>" +
                            "</div>" +
                            "</div>"
                    }

                }
                Resultados.innerHTML = htmlResultados;
                if (repaginar) {
                    totalResultados = ((data.length > 0) ? data[0].numFound : data.length);
                    pintarPaginacion(totalResultados, pagina);
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

$("#selectOrden").on("change", function (event) {
    getListResult(0,true);
});