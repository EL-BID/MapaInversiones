var global_programas = [];
var global_proyectos = [];
var global_detalle = [];
var global_pot = [];
var global_x_localidad = [];
const cantXPagina = 6;
const cantXPagPot = 4; 
const cant_por_linea = 10;
let grafica;

var anyo_actual = $("#annioPresupuesto option:selected").val();
var codEntidad = $("#codigoIdentidad").val();
inicializaDatos();
configuraSelectPeriodo();
configTabCambio();

//-------------------------------------------------

//-------------------------------------------------
function inicializaDatos() {
    anyo_actual = $("#annioPresupuesto option:selected").val();

    $(".lblAnyoSelected").html(anyo_actual);
    getConsolidadoPeriodos(anyo_actual, codEntidad);
    GetProyectosPot();
   
}

function configuraSelectPeriodo() {
    $('#annioPresupuesto').on('change', function () {
        anyo_actual = this.value;
        $("#annioPresupuestoText").html("" + anyo_actual);
        //------------------------------------------------
        getConsolidadoPeriodos(anyo_actual, codEntidad);
        GetProgramasPerEntidad(anyo_actual);
    })

}

function quitarTildes(str = "") {
    return str
        .normalize("NFD")                 // separa letras y tildes
        .replace(/[\u0300-\u036f]/g, "")  // elimina las marcas de acento
        .replace(/ñ/g, "n").replace(/Ñ/g, "N"); // opcional: normaliza ñ
}


function configTabCambio() {
    $('.tabs-nav').on('click', 'li.enlace_finalidad', function () {
        var $tab = $(this);
        $tab.siblings('.enlace_finalidad').removeClass('active');
        $tab.addClass('active');
        //--------------
        /* HABILITAR TEXTO EXPLICATIVO SEGUN TAB */

        const $activo = $('.tabs-nav li.active');
        const tipo_tab = $activo.find('.goal-name').attr('tipo');

        const $contenedor = $('#divTextosProgramas');
        $contenedor.find('.texto_tab')
            .prop('hidden', true)
            .filter((_, el) => $(el).data('tipo') === tipo_tab)
            .prop('hidden', false);

        //---------------
        GraphRecursosPerClasificacion(global_programas);
        renderSelectProgramas(global_programas);
        
        
        
    });
}

function configuraSelectLocalidad() {
    $('#selectLocalidades')
        .off('change')
        .on('change', function () {

            let pagina_actual = 1;
            let id_selected = this.value;

            if (id_selected == "" || id_selected == "Todos") {
                //Delete proyectos duplicados
                let proyectosUnicos = Array.from(
                    new Map(global_pot.map(item => [item.id, item])).values()
                );
                global_x_localidad = proyectosUnicos;
            } else {
                //filtrar
                global_x_localidad = $.grep(global_pot, item => item.idLocalidad == id_selected);
            }

            let ini_data = ((pagina_actual - 1) * cantXPagPot);
            let fin_data = (pagina_actual * cantXPagPot) - 1;
            let data_pagina = $.grep(global_x_localidad, (n, i) => i >= ini_data && i <= fin_data);
            showProyectosPot(data_pagina, 1);
        });
}


function getConsolidadoPeriodos(anyo_actual,codEntidad) {

    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosEntidad/GetConsolidadoPeriodos",
        type: "GET",
        data: {
            anyo: anyo_actual,
            codEntidad: codEntidad
        }
    }).done(function (data) {
        var result = data.infoConsolidado;
       
        var str_cad = "";
        if (result != null) {
            initTabsFinalidad(result, anyo_actual, function () {
                GetProgramasPerEntidad(anyo_actual);
                
                
            });
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
    });

}



function initTabsFinalidad(result, anyo_actual,callback) {
    var item = result; 

    var vigente = Number(item.vigente);
    var comprometido = Number(item.valorComprometido);
    var giros = Number(item.valorGiros);
    var pctComprometido = (comprometido / vigente * 100).toFixed(1);
    var pctGiros = (giros / vigente * 100).toFixed(1);
    var list_finalidades = item.finalidades;

    $('.valor-vigente')
        .text("$ " + shared.formatoMoneda(vigente));
    $('.valor-comprometido')
        .text("$ " + shared.formatoMoneda(comprometido));
    $('.valor-girado')
        .text("$ " + shared.formatoMoneda(giros));
    $('.porcentaje-comprometido')
        .text(shared.formatoDecimales(pctComprometido) + '%');
    $('.porcentaje-girado')
        .text(shared.formatoDecimales(pctGiros) + '%');
    $('.completed.comprometido')
        .css('width', pctComprometido + '%');
    $('.completed.girado')
        .css('width', pctGiros + '%');

    $('.lblAnyoSelected').text(anyo_actual);

    //Add finalidades tabs to DOM
    var str_cad = '';
    list_finalidades.forEach(function (finalidad, index) {
        var claseActive = (index === 0) ? ' active' : '';
        str_cad += '<li class="enlace_finalidad' + claseActive + '">';
        str_cad += '<div class="goal-name h5" tipo="' + finalidad.codigo + '">' + finalidad.nombre + '</div>';
        str_cad += '</li>';
    });
    $("#tabs_contenedor").html(str_cad);

    /* HABILITAR TEXTO EXPLICATIVO SEGUN TAB */

    const $activo = $('.tabs-nav li.active');
    const tipo_tab = $activo.find('.goal-name').attr('tipo');

    const $contenedor = $('#divTextosProgramas');
    $contenedor.find('.texto_tab')
        .prop('hidden', true)
        .filter((_, el) => $(el).data('tipo') === tipo_tab)
        .prop('hidden', false);

    //---------------

    if (typeof callback === "function") {
        callback();
    } 
}


function GetProgramasPerEntidad(annio) {
    var codEntidad = $("#codigoIdentidad").val();
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/ServiciosEntidad/GetClasificacionesByEntidad",
        type: "GET",
        data: {
            annio: annio,
            codEntidad: codEntidad
        }
    }).done(function (data) {
        var result = data.infoProgramas;
        global_programas = result;
        renderSelectProgramas(result);
        GraphRecursosPerClasificacion(result);
        

    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });

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

function GraphRecursosPerClasificacion(objData) {
    $("#divGraphPerTab").empty();
    var titulo = "Otros";
    var textoExpandir = "Clic para expandir";
    var limitePorc = 0.03;
    var data_filter = [];
    if (objData != undefined && objData != null) {

        // Filtrar datos por tab
        const $activo = $('.tabs-nav li.active');
        const tipo_tab = $activo.find('.goal-name').attr('tipo');
        data_filter = objData.filter(item => item.codFinalidad === tipo_tab);

        //calculo % por niveles
        const { data: dataConPorcentajes } = calcularPorcentajesContextuales(
            data_filter,
            ["clasificacion", "detalleClasificacion"],
            "vigente"
        );
      

        var paleta = {
            colores: [
                "#e6e6e6",
                "#c4e5ee",
                "#fcd96c",
                "#3e5174",
                "#ea5670",
                "#999999",
                "#1c717f",
                "#64b5e2",
                "#7fcbdc",
                "#e7753d"
            ]
        };

        function colorPorPosicion(posicion) {
            return paleta.colores[posicion % paleta.colores.length];
        }

        var distintos = data_filter.map(item => item.clasificacion)
            .filter((value, index, self) => self.indexOf(value) === index);

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
                groupBy: ["clasificacion", "detalleClasificacion"],
                height: 500,
                tooltipConfig: {
                    title: function (d) {
                        
                        const depth_aux = (typeof grafica?.depth === "function") ? grafica.depth() : 0;
                        var longitud_tooltip = 80;
                        var cad = '';
                        switch (depth_aux) {
                            case 0:
                                cad = d.clasificacion;
                                break;
                            case 1:
                                cad = d.detalleClasificacion;
                                break;
                            default:
                                cad = d.clasificacion;
                        }
                        if (cad.length > longitud_tooltip) {
                            cad = cad.slice(0, longitud_tooltip) + "...";
                        }

                        return cad;
                    },
                    tbody: [
                        [function (d) {
                            var valor = d["vigente"];
                            var cad = "";
                            cad += "<span>Presupuesto vigente " + "$ " + shared.formatoMoneda(valor) + "</span></br>";
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
                fill: function (d, i) {
                    return colorPorPosicion(i);
                },
                label: (d) => {
                    const nivel = (typeof grafica?.depth === "function") ? grafica.depth() : 0;
                    var texto = (nivel === 1 ? d["detalleClasificacion"] : d["clasificacion"]);
                    let porcentaje_aux;
                    if (nivel === 0) {
                        porcentaje_aux = d["porcentajeNivel0"];
                    } else {
                        porcentaje_aux = d["porcentajeNivel1"] ?? d["porcentajeNivel0"];
                    }
                    return [texto, `${shared.formatoDecimales(porcentaje_aux)}%`];
                }
            })
            .sum("vigente")
            .depth(0)
            .legend(false)
            .render();
    }

}


function GetProyectosPerClasificacion(annio, callback) {
    var codEntidad = $("#codigoIdentidad").val();
    // Filtrar datos por tab
    const $activo = $('.tabs-nav li.active');
    const tipo_tab = $activo.find('.goal-name').attr('tipo');

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/ServiciosEntidad/GetProyectosInvByClasificacion",
        type: "GET",
        data: {
            annio: annio,
            codEntidad: codEntidad,
            codFinalidad: tipo_tab
        }
    }).done(function (data) {
        var result = data.detalleProyectos;
        global_proyectos = result;



        if (typeof callback === 'function') {
            callback();
        }

    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });

}

function renderSelectProgramas(objData) {
    $("#divProgramas").empty();
    $("#divInversion").empty();

    let data_filter = [];

    if (objData != null && objData.length > 0) {
        // Filtrar datos por tab
        const $activo = $('.tabs-nav li.active');
        const tipo_tab = $activo.find('.goal-name').attr('tipo');

        
        data_filter = objData.filter(item => item.codFinalidad === tipo_tab);

        const key = d =>
            `${String(d.codClasificacion).trim()}|${String(d.clasificacion ?? '').trim().toLowerCase()}`;

       

        const unicos = Array.from(
            new Map(
                data_filter
                    .filter(d => d.codClasificacion != null && d.clasificacion) // descarta vacíos
                    .map(d => [key(d), d]) // clave compuesta -> objeto
            ).values()
        );

        unicos.sort((a, b) =>
            String(a.clasificacion).localeCompare(String(b.clasificacion), 'es', { sensitivity: 'base' })
        );

        //---------------------------
        const opciones = unicos.map(item =>
            `<option value="${item.codClasificacion}">${item.clasificacion}</option>`
        ).join('');
        //---------------------------
        const html_cad = `
            <div class="row">
                <div class="col-md-12">
                    <div class="ProgramCards">
                        <div class="card h-100">
                            <p>Seleccione una clasificación</p>
                            <div class="content-select">
                                <select id="selectProgramas">
                                    ${opciones}
                                </select>
                                <i></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $("#divProgramas").html(html_cad);
        if ($('#selectProgramas option').length > 0) {
            GetProyectosPerClasificacion(anyo_actual, function () {
                configuraSelectProgramas();
                iniProgramaXDefecto();
            });
        }


        
    }
}

function configuraSelectProgramas() {
    $('#selectProgramas')
        .off('change') // ← limpia cualquier evento anterior
        .on('change', function () {
        global_detalle = [];
        $("#divListado").empty();
        $("#divPagFichas").empty();
        var prog_actual = this.value;
        var filter_prog = $.grep(global_programas, function (elemento) {
            return elemento.codClasificacion === prog_actual;
        });
        if (filter_prog != null) {
            setValoresXPrograma(filter_prog);
            global_detalle = obtenerProyPerPrograma(prog_actual);
            var pagina_actual = 1;
            var ini_data = ((pagina_actual - 1) * cantXPagina);
            var fin_data = (pagina_actual * cantXPagina) - 1;
            var data_pagina = arr = jQuery.grep(global_detalle, function (n, i) {
                return (i >= ini_data && i <= fin_data);
            });

            showListadoProyectos(data_pagina,1);

        }
       
    });

}

function iniProgramaXDefecto() {
    if ($('#selectProgramas').children('option').length > 0) {
        $('#selectProgramas').val($('#selectProgramas option:first').val());
        $('#selectProgramas').trigger('change');
    }

}

function setValoresXPrograma(data) {

    const texto_vigente = "$ " + shared.formatoMoneda(Number(data[0].vigente));
    const texto_comprometido = "$ " + shared.formatoMoneda(Number(data[0].valorComprometido));
    const texto_girado = "$ " + shared.formatoMoneda(Number(data[0].valorGiros));

    const html_cad = `
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="row">
                    <div class="presini col-md-4">
                        <span class="h5">Presupuesto vigente</span>
                        <div class="clearfix"></div>
                        <span class="h3">${texto_vigente}</span>
                    </div>
                    
                    <div class="presini col-md-4">
                        <span class="h5">Presupuesto comprometido</span>
                        <div class="clearfix"></div>
                        <span class="h3">${texto_comprometido}</span>
                    </div>
                    
                    <div class="presexc col-md-4">
                        <span class="h5">Presupuesto girado</span>
                        <div class="clearfix"></div>
                        <span class="h3">${texto_girado}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    $("#lblValorAsignacionPrograma").html(html_cad);


    
}





function obtenerProyPerPrograma(item) {
    const padre = global_proyectos.find(p => p.id === item);
    if (padre) {
        return padre.detalles;
    } else {
        return [];
    }

}

function showListadoProyectos(datos, pagina) {

    $('#divListado').empty();
    $("#divContentProyectosInv").show();

    let html_aux = '';

    if (datos && datos.length > 0) {
        datos.forEach(function (proyecto) {
            var [idProyecto, bpin] = proyecto.id.split("|");

        html_aux += `
            <div class="card d-flex cardborder" data-bpin="${proyecto.id}">
                <div class="headEnt">
                    <div class="data1 mainDataEntidad3">
                        <span class="labelTit">Código BPIN: ${bpin}</span>
                        <span class="td1">${proyecto.nombre}</span>
                    </div>
                    <div class="data1">
                        <span class="labelTit">Presupuesto vigente</span>
                        <span class="td1">${shared.formatoMoneda(proyecto.vigente)}</span>
                    </div>
                    <div class="data1">
                        <span class="labelTit">Presupuesto comprometido</span>
                        <span class="td1">${shared.formatoMoneda(proyecto.valorComprometido)}</span>
                    </div>
                    <div class="data1">
                        <span class="labelTit">Presupuesto girado</span>
                        <span class="td1">${shared.formatoMoneda(proyecto.valorGiros)}</span>
                    </div>
                </div>
                <div class="btn-action">
                    <div class="btnPerfil">
                        <a class="text-small enlace_proy" href="/PerfilProyecto/${idProyecto}" target="_blank">
                            <i class="material-icons md-18">arrow_forward</i><br />
                            <span>Ver perfil</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        });


        $("#divListado").html(html_aux);
        
        var totalNumber = global_detalle.length;
        var totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;
        if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
            totalPages = totalPages + 1;
        }
        dibujarPagNumeradas(pagina, totalNumber, totalPages);

    }
    else {

        const $activo = $('.tabs-nav li.active');
        const tipo_tab = $activo.find('.goal-name').attr('tipo');
        let texto_tab = $activo.find('.goal-name').text().trim().toLowerCase();
        texto_tab = quitarTildes(texto_tab);

        //console.log(tipo_tab + "-->" + texto_tab);

        if (tipo_tab == "O23" || texto_tab == "inversion") {
            html_aux = `
                <div class="alert alert-warning d-flex justify-content-center" role="alert">
                    No se encontraron proyectos de inversión relacionados
                </div>
            `;
            $("#divListado").html(html_aux);
            $("#divContentProyectosInv").show();

        } else {
            $("#divContentProyectosInv").hide();

        }

    }
   
    
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


function GetProyectosPot() {
    $("#divProyectosPot").empty();
    var codEntidad = $("#codigoIdentidad").val();

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/ServiciosEntidad/GetProyectosPotPerEntidad",
        type: "GET",
        data: {
            codEntidad: codEntidad
        }
    }).done(function (data) {
            var result = data.proyectosPot;
            if (result?.length > 0)
            {
                global_pot = result;

                ////----cargue select localidades
                renderSelectLocalidades(global_pot);
                $("#divFiltroLocalidad").show();
                ////-------------------------------
                ////cargue fichas proy pot
                
                let id_selected = $('#selectLocalidades').val();

                if (id_selected == "" || id_selected == "Todos" || !id_selected) {
                    // Filtrar duplicados
                    let mapProyectos = new Map();
                    result.forEach(item => {
                        if (!mapProyectos.has(item.id)) {
                            mapProyectos.set(item.id, item);
                        }
                    });
                    global_x_localidad = Array.from(mapProyectos.values());
                } else {
                    //localidad especifica
                    global_x_localidad = result;
                }

                var pagina_actual = 1;
                var ini_data = ((pagina_actual - 1) * cantXPagPot);
                var fin_data = (pagina_actual * cantXPagPot) - 1;
                var data_pagina = arr = jQuery.grep(global_x_localidad, function (n, i) {
                    return (i >= ini_data && i <= fin_data);
                });
                showProyectosPot(data_pagina, 1);
                ////---------------------------------
           
        } else {
            ////Mensaje no registros
            $("#divFiltroLocalidad").hide();
            html_aux = `
             <div class="alert alert-warning d-flex justify-content-center" role="alert">
                No se encontraron proyectos pot relacionados
            </div>
        `;
            $("#divProyectosPot").html(html_aux);
        }

       

    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });

}

function renderSelectLocalidades(datos) {
    let localidadesMap = Array.from(
        new Map(datos.map(item => [item.idLocalidad, item.localidad]))
    ).sort((a, b) => a[1].localeCompare(b[1], 'es', { sensitivity: 'base' }));



    let $select = $("#selectLocalidades");
    $select.empty();
    $select.append('<option value="">Todos</option>');

    localidadesMap.forEach(([id, nombre]) => {
        $select.append(`<option value="${id}">${nombre}</option>`);
    });

    configuraSelectLocalidad();
}


function showProyectosPot(datos,pagina) {
    let html_aux = '';
    $('#divProyectosPot').empty();
        
        for (var j = 0; j < datos.length; j++) {
            const proyecto = datos[j];
            html_aux += `
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body-pry">
                            <div class="cardimg-city">
                                <img alt="imagen representativa del proyecto" src="../img/ciudad1.png" />
                            </div>
                            <div class="cardcont-city">
                                <a href="/PerfilProyectoPot/${proyecto.id}" target="_blank" class="item-link">
                                    <div class="project-title py-4">
                                        <h3>${proyecto.nombre}</h3>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <!-- Ícono de ubicación -->
                                        <div class="me-2">
                                            <i class="material-icons">view_comfy_alt</i>
                                        </div>
                                        <!-- Texto con separadores -->
                                        <div class="small text-muted">
                                            <span>Tipo de proyecto: ${proyecto.tipo}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

       
        
   

    
    $('#divProyectosPot').html(html_aux);



    var totalNumber = global_x_localidad.length;
    var totalPages = (totalNumber > cantXPagPot) ? ((totalNumber - (totalNumber % cantXPagPot)) / cantXPagPot) : 1;
    if ((totalNumber >= cantXPagPot) && ((totalNumber % cantXPagPot) > 0)) {
        totalPages = totalPages + 1;
    }

    dibujarPaginasPot(pagina, totalNumber, totalPages);
}
        
function dibujarPaginasPot(actual, total, totalPag, contenedor = "#divPagPot", contenedorListado = "#divProyectosPot") {
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
        var ini_data = ((pagina_actual - 1) * cantXPagPot);
        var fin_data = (pagina_actual * cantXPagPot) - 1;
        var data_pagina = jQuery.grep(global_x_localidad, function (n, i) {
            return (i >= ini_data && i <= fin_data);
        });
        $(contenedorListado).empty();
        showProyectosPot(data_pagina,pagina_actual);
    });
}


