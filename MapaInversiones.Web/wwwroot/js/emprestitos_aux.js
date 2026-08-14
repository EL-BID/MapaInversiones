const cantXPagina = 6;
const cant_por_linea = 10;
var global_detalle = [];
//-----------------------------

GetProyectosInv();
//-------------------------------
function GetProyectosInv() {
    
    $("#divListado").empty();
    var codEntidad = $("#codigoPrestamo").val();
    

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/ServiciosEmprestitos/GetProyectosPerCredito",
        type: "GET",
        data: {
            codEntidad: codEntidad
        }
    }).done(function (data) {
        var result = data.proyectos;
        if (result.length > 0) {
            //**Treemap*/
                GraphRecursosPerInversion(result);
            //******************/
            //**Listado proyectos*/
                global_detalle = result;
                var pagina_actual = 1;
                var ini_data = ((pagina_actual - 1) * cantXPagina);
                var fin_data = (pagina_actual * cantXPagina) - 1;
                var data_pagina = arr = jQuery.grep(global_detalle, function (n, i) {
                    return (i >= ini_data && i <= fin_data);
                });

                showListadoProyectos(data_pagina, 1);
            //**Fin Listado proyectos*/
            

        } else {
            ////Mensaje no registros 
            let html_aux = `
             <div class="alert alert-warning d-flex justify-content-center" role="alert">
                No se encontraron proyectos relacionados
            </div>
        `;
            $("#divListado").html(html_aux);
        }


    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });

}

function showListadoProyectos(datos, pagina) {
    const itemsPorPag = 14;
    $('#divListado').empty();
    let html_list;

    if (datos && datos.length > 0) {
        //abre div contenedor
        html_list = `
          <div class="card-entidades-group">
        `;
        for (var i = 0; i < datos.length; i += itemsPorPag) {
            for (var j = i; j < i + itemsPorPag && j < datos.length; j++) {
                const proyecto = datos[j];
                html_list += `
                <div class="card d-flex">
                  <div class="headEnt proy-banco">
                    <div class="mainDataEntidad">
                      <span class="labelTit">Código BPIN: <strong>${proyecto.bpin}</strong></span>
                      <span class="td1">${proyecto.nombre}</span>
                    </div>
                    <div class="data1">
                      <span class="labelTit">Valor asignado en el crédito 2025</span>
                      <span class="td1">$ ${shared.formatoMoneda(proyecto.valorFinanciado, 0)}</span>
                    </div>
                    <div class="data1">
                      <span class="labelTit">Valor incorporado en el presupuesto 2025</span>
                      <span class="td1">$ ${shared.formatoMoneda(proyecto.valorInicial, 0)}</span>
                    </div>
                     <div class="data1">
                      <span class="labelTit">Valor ejecutado</span>
                      <span class="td1">$ ${shared.formatoMoneda(proyecto.valorEjecutado, 0)}</span>
                    </div>
                  </div>
                  <div class="btn-action">
                    <div class="btnPerfil">
                      <a target="_blank" href="/perfilProyecto/${proyecto.id}" class="text-small">
                        <i class="material-icons md-18">arrow_forward</i><br />
                        <span>VER PROYECTO</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }
        }

        // Cerrar el div contenedor
        html_list += `
        </div>
        `;

        $("#divListado").html(html_list);
        var totalNumber = global_detalle.length;
        var totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;
        if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
            totalPages = totalPages + 1;
        }
        dibujarPagNumeradas(pagina, totalNumber, totalPages);

    }
     else {
        html_list = `
            <div class="alert alert-warning d-flex justify-content-center" role="alert">
                No se encontraron proyectos de inversión relacionados
            </div>
        `;
           

        }

    
    $('#divListado').html(html_list);


    
}

function dibujarPagNumeradas(actual, total, totalPag, contenedor = "#divPagFichas", contenedorListado = "#divListado") {
    $(contenedor).empty();

    var pag_actual = parseInt(actual);  // Página actual al cargar
    var pagina_actual = pag_actual;     // Página seleccionada por el usuario (puede cambiar con clic)
    var pagesHTML = '';


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
            // Estructura para página actual
            pag_enlace += '<span class="pag_actual" data-page="' + i + '">';
            pag_enlace += '<text>' + i + '</text>';
            pag_enlace += '</span>';
        } else {
            // Estructura para páginas clickeables
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

    $(contenedor).html(pag_enlace);

    $('#page_right, #page_left, .page_left').on('click', function () {
        pagina_actual = $(this).attr("data-page");
        var ini_data = ((pagina_actual - 1) * cantXPagina);
        var fin_data = (pagina_actual * cantXPagina) - 1;
        var data_pagina = arr = jQuery.grep(global_detalle, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        $(contenedorListado).empty();
        showListadoProyectos(data_pagina, pagina_actual);
    });
}

function assignColorWithSoftVariations(index) {
            var colores_originales = ["#8B3CB0", "#4597FD", "#F19D5B", "#B3CF85", "#B599D4", "#99A7CC", "#97CFAE", "#BCD7CE", "#F19996"];
            var colores_suaves = [
                "#B788D1", //soft morado
                "#7AB4FF", // soft azul
                "#F4B98A", // soft naranja
                "#C8DBA5", // soft verde
                "#D1B5E8", // soft morado claro
                "#B5C3D8", // soft gris azul
                "#B8DBC4", // soft verde agua
                "#D4E5DD", // soft verde claro
                "#F4B5B3"  // soft del rosa
            ];

            if (index < colores_originales.length) {
                return colores_originales[index] + "FF"; // 100% opacidad
            } else if (index < 18) {
                return colores_suaves[index - 9] + "FF"; // 100% opacidad
            } else {
                // Para elementos adicionales revisar opacidad
                var baseIndex = (index - 18) % 18;
                var ciclo = Math.floor((index - 18) / 18);
                var opacidades = ["CC", "99", "66", "33"]; // 80%, 60%, 40%, 20%

                if (baseIndex < 9) {
                    return colores_originales[baseIndex] + opacidades[ciclo % 4];
                } else {
                    return colores_suaves[baseIndex - 9] + opacidades[ciclo % 4];
                }
            }
        }

function GraphRecursosPerInversion(objData) {
    $("#divGraphPerTab").empty();
    var titulo = "Otros";
    var textoExpandir = "Clic para expandir";
    var limitePorc = 0.03;
    var data_filter = [];
    if (objData != undefined && objData != null) {
        data_filter = objData;       
        ///*calculo % por niveles (en este caso 1 nivel)*/
        const { data: dataConPorcentajes } = calcularPorcentajesContextuales(
            data_filter,
            ["nombre"],
            "valorFinanciado"
        );             

        ///*asignacion colores*/
        var colorMapping = {};
        data_filter.forEach((item, index) => {
            colorMapping[item.nombre] = assignColorWithSoftVariations(index);
        });
        
        ///*render grafica*/
        grafica = new d3plus.Treemap()
            .select("#divGraphPerTab")
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
                data: dataConPorcentajes,
                groupBy: ["nombre"],
                height: 500,
                tooltipConfig: {
                    title: function (d) {
                        var longitud_tooltip = 120;
                        var cad= d.nombre;
                               
                        if (cad.length > longitud_tooltip) {
                            cad = cad.slice(0, longitud_tooltip) + "...";
                        }

                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["valorFinanciado"];
                            var cad = "";
                            cad += "<span>Valor negociado con la entidad financiera  <br />" + "$ " + shared.formatoMoneda(valor,0) + "</span></br>";
                            return cad;
                        }]
                    ]
                },
                yConfig: {
                    title: "",
                }
            })

            .shapeConfig({
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
                },                
                label: (d) => {
                   
                    var texto =  d["nombre"];
                    let porcentaje_aux = d["porcentajeNivel0"];
                    return [texto, `${shared.formatoDecimales(porcentaje_aux)}%`];
                }
            })
            .sum("valorFinanciado")
            .color(function (d) {
                return colorMapping[d.nombre] || assignColorWithSoftVariations(0);
            })
            .depth(0)
            .legend(false)
            .render();
    }

}

/**
 * Calcula los porcentajes de participación por nivel jerárquico treemap.
 * 
 * @param {Array} data - datos base
 * @param {Array} groupBy - Array de agrupación jerárquica 1 o 2 niveles . Ej: ['clasificacion'] o ['clasificacion', 'detalleClasificacion']
 * @param {String} sumField - Campo a sumar
 * @returns {Object} - Datos con porcentajes calculados máximo 2 niveles
 */
const calcularPorcentajesContextuales = (data, groupBy, sumField) => {
    const total = data.reduce((sum, item) => sum + (+item[sumField] || 0), 0);

    if (groupBy.length === 1) {
        const padre = groupBy[0];
        data.forEach(item => {
            item.porcentajeNivel0 = total > 0 ? (item[sumField] * 100 / total) : 0;
        });
        return { data };
    }

    const padre = groupBy[0];

    const grupos = data.reduce((acc, item) => {
        const key = item[padre];
        if (!acc[key]) acc[key] = { items: [], total: 0 };
        acc[key].items.push(item);
        acc[key].total += +item[sumField] || 0;
        return acc;
    }, {});

    Object.values(grupos).forEach(grupo => {
        grupo.items.forEach(item => {
            item.porcentajeNivel0 = total > 0 ? (item[sumField] * 100 / total) : 0;
            item.porcentajeNivel1 = grupo.total > 0 ? (item[sumField] * 100 / grupo.total) : 0;
        });
    });

    return { data };
};