var idProyecto = $('#hdIdProyecto').val();
var projectPerfil = JSON.parse(document.body.getAttribute('data-profile-inv'));
var anio = 2025;
var anioEjecucionPresupuestal = 2025;
var metaId = "";
var actividadId = "";
var estadoId = "";
var tipoHorizonteId = "0";
var selectActividades = "";
var cantXPagina = 5;
var totalProjectsPotLocation = 1;
var cant_contratos = 5;
var scrol = 0;
//#region Información General
var selectElement = document.getElementById('filtro_periodo_info_general');
if (selectElement && selectElement.options.length > 0) {
  selectElement.selectedIndex = 0; // Selecciona el primer elemento
  anio = selectElement.options[0].value; // Obtén el valor del primer elemento
  getInformacionGeneralPorProyectoAnio(anio, idProyecto);
}
iniUsuarioLog();
getAnnio(idProyecto);
function getInformacionGeneralPorProyectoAnio(anio, idProyecto) {
  $('#presupuestoVigenteInfoGeneral').html("");
  $('#presupuestoEjecutadoInfoGeneral').html("");
  $('#presupuestoObligadoInfoGeneral').html("");
  $('#divGraphAvanceFinancieroInfoGeneral').html("");
  $('#divGraphAvanceFisicoInfoGeneral').html("");
  $('#info_general_annio').html(anio)
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "/api/serviciosproyectos/GetInformacionGeneralProyectoPorAnioPresupuestal",
    type: "GET",
    data: {
      idProyecto: idProyecto,
      anio: anio
    }
  }).done(function (data) {
    //console.log("data InformacionGeneralProyectoPorAnioPresupuestal", data);
    if (data != null && data != undefined) {
      $('#presupuestoProgramadoInfoGeneral').html('$ ' + shared.formatoMoneda(data.propuestoAsignadoVigencia, 2, 1));
      $('#presupuestoComprometido').html('$ ' + shared.formatoMoneda(data.propuestoObligado, 2, 1));
      $('#presupuestoGirado').html('$ ' + shared.formatoMoneda(data.propuestoEjecutado, 2, 1));
      graficarBarra("divGraphAvanceFinancieroInfoGeneral", data.ejecucionFinanciera);
    }
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error projec profile:" + xhr.status + "_" + thrownError);
  });
}
function graficarBarra(divContenedor, value) {
  // Limpiar contenedor
  d3.select("#" + divContenedor).selectAll("*").remove();
  const svg = d3.select("#" + divContenedor)
    .append("svg")
    .attr("width", 800)
    .attr("height", 100);
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 10, right: 20, bottom: 30, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const axisOffset = 8; // separación visual del eje respecto al marco
  // Escala X de 0 a 100%
  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, innerWidth]);
  // Grupo contenedor
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  // Marco alrededor de toda el área de la gráfica
  g.append("rect")
    .attr("class", "frame")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", innerWidth)
    .attr("height", innerHeight);
  // Barra
  g.append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", innerHeight / 4)
    .attr("height", innerHeight / 2)
    .attr("width", xScale(value));
  // Texto centrado dentro de la barra
  g.append("text")
    .attr("class", "label")
    .attr("x", xScale(value) / 2)
    .attr("y", innerHeight / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(d3.format(".1f")(value) + "%");
  // Eje X (debajo del marco)
  g.append("g")
    .attr("transform", `translate(0, ${innerHeight + axisOffset})`)
    .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => d + "%"));
}
$('#filtro_periodo_info_general').on('change', function (e) {
  e.preventDefault(); // Previene el comportamiento predeterminado si es necesario
  anio = $(this).val(); // Obtiene el valor del elemento seleccionado
  getInformacionGeneralPorProyectoAnio(anio, idProyecto);
});
//#endregion Información General
//#region Avance por metas y actividades
var selectMetaProducto = document.getElementById('selectMetaProducto');
if (selectMetaProducto && selectMetaProducto.options.length > 0) {
  selectMetaProducto.selectedIndex = 0; // Selecciona el primer elemento
  metaId = selectMetaProducto.options[0].value; // Obtén el valor del primer elemento
  getActividadesPorProyectoMeta();
}
$('#selectMetaProducto').on('change', function (e) {
  e.preventDefault(); // Previene el comportamiento predeterminado si es necesario
  metaId = $(this).val(); // Obtiene el valor del elemento seleccionado
  $('#selectActividadMetaProducto').empty();
  selectActividades = "";
  getActividadesPorProyectoMeta();
});
function getActividadesPorProyectoMeta() {
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "/api/serviciosproyectos/GetActividadesPorProyectoMeta",
    type: "GET",
    data: {
      idProyecto: idProyecto,
      meta: metaId
    }
  }).done(function (data) {
    if (data != null && data != undefined) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          selectActividades = selectActividades + '<option value="' + data[i].id.toString() + '">' + data[i].nombre.toString() + '</option>';
        }
        $('#selectActividadMetaProducto').html(selectActividades);
        $('#selectActividadMetaProducto').trigger('change');
      }
      else $('#selectActividadMetaProducto').html("<p><b>No hay actividades para mostrar</b></p>");
    }
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error projec profile:" + xhr.status + "_" + thrownError);
  });
}
function getActividadesPorProyectoMetaActividad() {
  $('#nombreActividad').empty();
  $('#avanceFinancieroPrograma').empty();
  $('#avanceFinancieroComprometido').empty();
  $('#avanceFinancieroGirado').empty();
  $('#avanceFisicoMagnitudProgramada').empty();
  $('#avanceFisicoMagnitudEntregada').empty();

  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "/api/serviciosproyectos/GetActividadesPorProyectoMetaActividad",
    type: "GET",
    data: {
      idProyecto: idProyecto,
      meta: metaId,
      actividad: actividadId
    }
  }).done(function (data) {
    if (data != null && data != undefined) {
      $('#nombreActividad').html(data.nombre);
      $('#avanceFinancieroPrograma').html('$ ' + shared.formatoMoneda(data.avanceFinancieroProgramado, 2, 1));
      $('#avanceFinancieroComprometido').html('$ ' + shared.formatoMoneda(data.avanceFinancieroComprometido, 2, 0));
      $('#avanceFinancieroGirado').html('$ ' + shared.formatoMoneda(data.avanceFinancieroGirado, 2, 0));
      $('#avanceFisicoMagnitudProgramada').html(data.avanceFisicoMagnitudProgramada);
      $('#avanceFisicoMagnitudEntregada').html(data.avanceFisicoMagnitudEntregada);
      //console.log("detalle tabla", data.detalle );
      getDetalleActividadesPorProyectoMetaActividad(data.detalle);

      drawDona("#graphDonaMagnitudComprometido", data.avanceFisicoPorcentajeMagnitudComprometida);
      drawDona("#graphDonaMagnitudEntregado", data.avanceFisicoPorcentajeMagnitudEntregada);
    }
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error projec profile:" + xhr.status + "_" + thrownError);
  });
}
function getDetalleActividadesPorProyectoMetaActividad(data) {
  let htmlEjecucion = '';
  let htmlEncabezadoTabla = '';
  let htmlBody = '';
  $('#detalleActividadTable').empty();
  if (data == null || data == undefined || data.length == 0) htmlEjecucion = 'No hay datos para mostrar.';
  if (data != null && data != undefined) {
    htmlEncabezadoTabla =
      '<thead>' +
      '<tr>' +
      '<th>Año</th>' +
      '<th colspan="4" class="text-center">Avance Financiero</th>' +
      '<th class="tablew"></th>' +
      '<th colspan="3" class="text-center">Avance Físico</th>' +
      '</tr>' +
      '<tr>' +
      '<th class="tablew"></th>' +
      '<th class="tableblue">Programado</th>' +
      '<th class="tableblue">Comprometido</th>' +
      '<th class="tableblue">Girado</th>' +
      '<th class="tableblue">%</th>' +
      '<th class="tablew"></th>' +
      '<th class="tablegreen">Programado</th>' +
      '<th class="tablegreen">Comprometido</th>' +
      '<th class="tablegreen">%</th>' +
      '</tr>' +
      '</thead>';

    for (var i = 0; i < data.length; i++) {
      htmlBody = htmlBody +
        '<tr>'+
          '<td class="tablefont">'+ data[i].anio + '</td>'+
          '<td class="tableblue">' + '$ ' + shared.formatoMoneda(data[i].avanceFinancieroProgramado, 2, 1) +'</td>'+
          '<td class="tableblue">' + '$ ' + shared.formatoMoneda(data[i].avanceFinancieroComprometido, 2, 1) + '</td>' +
          '<td class="tableblue">' + '$ ' + shared.formatoMoneda(data[i].avanceFinancieroGirado, 2, 1) + '</td>' +
        '<td class="tableblue">' + shared.formatoDecimales(data[i].avanceFinancieroPorcentaje,1) + '</td>' +
          '<td class="tablew"></td>'+
          '<td class="tablegreen">' + data[i].avanceFisicoMagnitudProgramada + '</td>' +
          '<td class="tablegreen">' + data[i].avanceFisicoMagnitudComprometida + '</td>' +
        '<td class="tablegreen">' + shared.formatoDecimales(data[i].avanceFisicoPorcentajeMagnitudComprometida,1) + '</td>' +
        '</tr>';
    }
    htmlEjecucion = '<table class="custom-table">' + htmlEncabezadoTabla + htmlBody + '</tbody></table>';
    $('#detalleActividadTable').html(htmlEjecucion);
  }
}
$('#selectActividadMetaProducto').on('change', function (e) {
  e.preventDefault(); // Previene el comportamiento predeterminado si es necesario
  actividadId = $(this).val(); // Obtiene el valor del elemento seleccionado
  getActividadesPorProyectoMetaActividad();
});
function drawDona(selector, porcentaje, colorActivo = "#4AAEE8") {
  $(selector).empty();
  var porc_calculo = "";
  porc_calculo = shared.formatoDecimales(porcentaje * 100, 1).toString() + "%";
  const colorInactivo = "#E6E6E6";
  const totalSegmentos = 20;
  // Tamaño lógico del gráfico
  const outerRadius = 45;
  const innerRadius = 33;
  const viewSize = 120;
  const data = Array.from({ length: totalSegmentos }, (_, i) =>
    i < porcentaje * totalSegmentos ? 1 : 0
  );
  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
  const pie = d3.pie()
    .value(1)
    .sort(null);
  const svg = d3.select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${viewSize} ${viewSize}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "50%")
    .style("height", "auto");
  const g = svg.append("g")
    .attr("transform", `translate(${viewSize / 2}, ${viewSize / 2})`);
  g.selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("d", arc)
    .attr("fill", (d, i) =>
      i < porcentaje * totalSegmentos ? colorActivo : colorInactivo
    )
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .attr("pointer-events", "none");
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("fill", "#1a5ea0")
    .text(porc_calculo);
}

//#endregion Avance por metas y actividades
//#region Ejecución presupuestal por clasificación de fondo
var selectElementEjecucionPresupuestalPorFondo = document.getElementById('filtro_ejecucion_presupuestal_por_fondo');
if (selectElementEjecucionPresupuestalPorFondo && selectElementEjecucionPresupuestalPorFondo.options.length > 0) {
  selectElementEjecucionPresupuestalPorFondo.selectedIndex = 0; // Selecciona el primer elemento
  anioEjecucionPresupuestal = selectElement.options[0].value; // Obtén el valor del primer elemento
  getInformacionPresupuestalPorFondoPorProyectoAnio();
}
else {
  $('#sctejecucionfinanciera').hide();
}
function getInformacionPresupuestalPorFondoPorProyectoAnio() {
  $('#ejecucion_presupuestal_fondo').html("");
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "/api/serviciosproyectos/GetInformacionPresupuestalProyectoAnioPorClasificacionDeFondo",
    type: "GET",
    data: {
      idProyecto: idProyecto,
      anio: anioEjecucionPresupuestal
    }
  }).done(function (data) {
    let htmlEjecucion = '';
    if (data == null || data == undefined || data.length == 0) htmlEjecucion = 'No hay datos para mostrar.';
    if (data != null && data != undefined) {
      let datoencontrado = [];
      let porcentaje = [];
      let posicion = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].presupuestoObligado>=0) {
          datoencontrado[posicion] = i;
          porcentaje[posicion] = data[i].porcentaje;
          posicion = posicion + 1;
          htmlEjecucion = htmlEjecucion +
            '<div class="wrap-fuenteFinance">' +
            '<div class="row">' +
            '<div class="col-xs-12 col-lg-12 headSource">' +
            '<span class="small">Clasificación fondo:</span>' +
            '<span class="h4">' + data[i].clasificacionFondo + '</span>' +
            '</div>' +
            '<div class="col-lg-8 d-flex cont-data-fin">' +
            '<div class="rounded-box d-flex">' +
            '<span class="small">Presupuesto programado:</span>' +
            '<span class="text-bold">$' + shared.formatoMoneda(data[i].presupuestoAsignado, 2, 1) + '</span>' +
            '</div>' +
            '<div class="rounded-box d-flex">' +
            '<span class="small">Presupuesto girado:</span>' +
            '<span class="text-bold">$' + shared.formatoMoneda(data[i].presupuestoObligado, 2, 1) + '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="clearfix"></div>' +
            '<div class="contendor-grafica-avance" id="divInfoPresupuestoFondo_' + i + '">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        }
      }
      $('#ejecucion_presupuestal_fondo').html(htmlEjecucion);
      for (var i = 0; i < datoencontrado.length; i++) {
        graficarBarra("divInfoPresupuestoFondo_" + datoencontrado[i], porcentaje[i]);
      }
    }
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error projec profile:" + xhr.status + "_" + thrownError);
  });
}

$('#filtro_ejecucion_presupuestal_por_fondo').on('change', function (e) {
  e.preventDefault(); // Previene el comportamiento predeterminado si es necesario
  anioEjecucionPresupuestal = $(this).val(); // Obtiene el valor del elemento seleccionado
  getInformacionPresupuestalPorFondoPorProyectoAnio();
});
//#endregion Ejecución presupuestal por clasificación de fondo
//#region Listado de proyectos POT asociados
var tipoProyecto = $('#hdTipoProyecto').val().toUpperCase();;
$('#sectionProyectosPot').hide();
if (tipoProyecto == "PROYECTO INVERSIÓN" || tipoProyecto == "PROYECTO DE INVERSIÓN" || tipoProyecto == "PROYECTO INVERSION" || tipoProyecto == "PROYECTO DE INVERSION") {
  $('#sectionProyectosPot').show();
  var selectEstadoProyectosPot = document.getElementById('estadoProyectosPOT');
  if (selectEstadoProyectosPot && selectEstadoProyectosPot.options.length > 0) {
    selectEstadoProyectosPot.selectedIndex = 0; // Selecciona el primer elemento
    estadoId = selectEstadoProyectosPot.options[0].value; // Obtén el valor del primer elemento
    loadProyectosPoTPorIdProyectoIdEstado(1, cantXPagina);
  }
  function loadProyectosPoTPorIdProyectoIdEstado(paginaPot, tamanopaginaPot) {
    var filtros = {
      idproyectoInversion: idProyecto,
      idEstado: estadoId,
      horizonte: tipoHorizonteId,
      pagina: paginaPot,
      tamanoPagina: tamanopaginaPot
    };
    $.ajax({
      type: 'GET',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      url: "../api/serviciosproyectospot/ListadoProyectosPotPaginadoByProyectoInversionIdEstadoIdHorizonte",
      cache: false,
      data: filtros,
      success: function (data) {
        //console.log("data proyectosPot", data);
        var items_result = data.invProjects;
        totalProjectsPotLocation = data.totalProjects;
        var select = "";
        $("#listproyectosPot").empty();
        if (items_result.length == 0) select = "<p>No hay datos para mostrar.</p>";
        for (var i = items_result.length - 1; i >= 0; i--) {
          select +=
            '<div class="card d-flex cardborder">' +
            '    <div class="headEnt">' +
            '        <div class="data1 mainDataEntidad3">' +
            '            <span class="labelTit">Nombre</span>' +
            '            <span class="td1">' + items_result[i].nombreProyecto.toString() + '</span>' +
            '        </div>' +
            '        <div class="data1">' +
            '            <span class="labelTit">Tipo de Proyecto</span>' +
            '            <span class="td1">' + items_result[i].tipoProyecto.toString() + '</span>' +
            '        </div>' +
            '        <div class="data1">' +
            '            <span class="labelTit">Horizonte POT</span>' +
            '            <span class="td1">' + items_result[i].horizontePot.toString() + '</span>' +
            '        </div>' +
            '        <div class="data1">' +
            '            <span class="labelTit">Estado proyecto</span>' +
            '            <span class="td1">' + items_result[i].estado.toString() + '</span>' +
            '        </div>' +
            '    </div>' +
            '    <div class="btn-action">' +
            '        <div class="btnPerfil">' +
            '            <a class="enlace-proyecto text-small"  data-parameter="' + items_result[i].idProyecto.toString() + '" target="_blank" href="/PerfilProyectoPot/' + items_result[i].idProyecto.toString() + '"><i class="material-icons md-18">arrow_forward</i><br /><span>Ver perfil</span></a>' +
            '        </div>' +
            '    </div>' +
            '</div>';
        }
        $("#listproyectosPot").html(select);
        dibujarPaginasProyectosPot(paginaPot);
      },
      error: function (response) {
        alert(response.responseText);
      },
      failure: function (response) {
        alert(response.responseText);
      }
    });
  }
  function dibujarPaginasProyectosPot(paginaActual) {
    const totalPages = Math.ceil(totalProjectsPotLocation / cantXPagina);
    const pagActual = parseInt(paginaActual);
    const totalNumerosPaginador = 10;

    const inicio = Math.floor((pagActual - 1) / totalNumerosPaginador) * totalNumerosPaginador + 1;
    let fin = Math.min(inicio + totalNumerosPaginador - 1, totalPages);

    let pagEnlace = "";

    if (inicio > 1) {
      pagEnlace += `<a id="page_left" role="button" class="material-icons md-24" data-page="${inicio - totalNumerosPaginador}">
                        <span>chevron_left</span>
                      </a>`;
    }

    for (let i = inicio; i <= fin; i++) {
      if (i === pagActual) {
        pagEnlace += `<span class="pag_actual" data-page="${i}"><text>${i}</text></span>`;
      } else {
        pagEnlace += `<a class="page_left" role="button" data-page="${i}">
                            <span class="glyphicon"></span>
                            <text class="paginacion">${i}</text>
                          </a>`;
      }
    }
    if (fin < totalPages) {
      pagEnlace += `<a id="page_right" role="button" class="material-icons md-24" data-page="${fin + 1}">
                        <span>chevron_right</span>
                      </a>`;
    }
    $("#divPagProyectosPot").html(pagEnlace);
    $('#divPagProyectosPot').off('click', 'a, span').on('click', 'a, span', function () {
      //const page = $(this).data('page');
      //console.log("Clic paginador Pot", page);
      const nuevaPagina = parseInt($(this).data('page'));
      $("#divPagProyectosPot").empty();
      loadProyectosPoTPorIdProyectoIdEstado(nuevaPagina, cantXPagina);
    });
  }
  $('#estadoProyectosPOT').on('change', function (e) {
    e.preventDefault(); // Previene el comportamiento predeterminado si es necesario
    estadoId = $(this).val(); // Obtiene el valor del elemento seleccionado
    loadProyectosPoTPorIdProyectoIdEstado(1, cantXPagina);
  });
  $('#tiposHorizontesPOT').on('change', function (e) {
    e.preventDefault(); // Previene el comportamiento predeterminado si es necesario
    tipoHorizonteId = $(this).val(); // Obtiene el valor del elemento seleccionado
    loadProyectosPoTPorIdProyectoIdEstado(1, cantXPagina);
  });
}

//#endregion Listado de proyectos POT asociados
//#region Fotos cargadas por los ciudadanos
//$('#btnUploadFile').on('click', function () {
//  var data = new FormData();
//  var maxFileSize = 1048576; // 1MB ->  1024 * 1024
//  var files = $("#fileUpload").get(0).files;
//  var idProyecto = $('#hdIdProyecto').val();
//  //console.log("Entro por clic:");
//  // Add the uploaded image content to the form data collection
//  if (files.length > 0) {
//    if (files[0].size < maxFileSize) {
//      //                  console.log(files[0]);
//      var reader = new FileReader();
//      const fileByteArray = [];
//      reader.readAsArrayBuffer(files[0]);
//      reader.onloadend = (evt) => {
//        if (evt.target.readyState === FileReader.DONE) {
//          const arrayBuffer = evt.target.result,
//            array = new Uint8Array(arrayBuffer);
//          for (const a of array) {
//            fileByteArray.push(a);
//          }
//          var params_img = {
//            UploadedImage: fileByteArray,
//            DescripcionImage: $('#tbDescripcion').val(),
//            LocationImage: $('#filtro_AreaFotoUsuUpload option:selected').val(),
//            ProjectImageInv: idProyecto
//          };
//          $.ajax({
//            type: 'POST',
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            url: "/api/ServiciosParticipacion/SubirArchivo",
//            cache: false,
//            data: JSON.stringify(params_img),
//            success: function (result) {
//              //separa error y mensaje
//              var cad_result = result.message.split("<||>");
//              if (cad_result.length > 1) {
//                var cod_error = cad_result[0];
//                var mensaje_error = cad_result[1];
//                if (cod_error == "0") {
//                  bootbox.alert(mensaje_error, function () {
//                    $('select,input[type=text],input[type=radio],textarea', $('#divDatosModal')).each(function (i, e) {
//                      $(e).val("");
//                    });
//                    $("#btnCloseFotos").trigger("click");
//                  });
//                } else {
//                  bootbox.alert(mensaje_error);
//                }
//              } else {
//                bootbox.alert(result);
//              }
//            },
//            error: function (response) {
//              bootbox.alert('Error: ' + response.responseText);
//            },
//            failure: function (response) {
//              bootbox.alert('Fallo: ' + response.responseText);
//            }
//          });

//        }
//      }
//    }
//    else {
//      var tamanoArchivo = Math.round(files[0].size / maxFileSize);
//      bootbox.alert('Lo sentimos, el archivo tiene un tamaño de ' + tamanoArchivo + ' MB y supera el máximo tamaño permitido que es de 1MB.\nPor favor, modifique la imagen disminuyendo el tamaño del archivo antes de subirlo al sistema.');
//    }
//  }
//  else bootbox.alert('No existe archivo para subir.');
//});
$('.enlace_img').on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  var id = $(this).attr("data-src");
  $('#img-modal-oficial').attr("src", id);
  var des = $(this).attr("descrip");
  //$('#des-oficial').html(des);
  $('#FotoModalOficial').modal('show');
});
$('.enlace_img_ciudadanos').on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  var id = $(this).attr("data-src");
  $('#img-modal-ciudadano').attr("src", id);
  var des = $(this).attr("descrip");
  //$('#des-oficial').html(des);
  $('#FotoModalCiudadano').modal('show');
});
//#endregion Fotos cargadas por los ciudadanos




////////////////************************************Participacin y contratos**********************/
function separar_milesv2(num, decimales = 2, separadorMiles = '.', separadorDecimales = ',') {
    if (isNaN(num) || num === null || num === undefined) return "";

    try {
        let num_aux = parseFloat(num).toFixed(decimales); // Redondear a los decimales especificados
        let partes = num_aux.split("."); // Separar parte entera y decimal

        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles); // Agregar separador de miles

        return partes.join(separadorDecimales); // Unir con separador de decimales especificado
    } catch (error) {
        console.error("function separar_miles: ", error);
        return "";
    }
}

function convertirMillones(num) {
    return num > 999999 ? (num / 1000000).toFixed(0) : num

}

function getAnnio(IdProyecto) {
    //debugger;
    var filtros = {
        IdProyecto: IdProyecto
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "../api/serviciosproyectos/GetAnniosProcesoContratacion",
        cache: false,
        data: filtros,
        success: function (data) {
            deshabilita(true);

            var items_result = data.detalles;
            if (items_result == null) return;
            var annios = [];
            var select = "";
            var semestre = "";

            $('#top_origen_informacion').attr("data-detalles", JSON.stringify(data.detalles));

            for (var i = items_result.length-1; i >= 0; i--) {

                if (!annios.includes(items_result[i].anio.toString())) {
                    annios.push(items_result[i].anio.toString());
                    select = select + '<option value="' + items_result[i].anio.toString() + '">' + items_result[i].anio.toString() + '</option>';
                }

            }

            $('#top_origen_informacion').html(select).fadeIn();
            if (items_result.length > 0) {
                //getSemestre(data.detalles);
                getProcesosContratacion($("#top_origen_informacion option:selected").val(), 1, cant_contratos, IdProyecto, $("#proceso").val());

            } else {
                $("#srcContratos").html("");
                var fila = '<div class="contractBox" >'
                    + '<div class="cotractName contractONCAE"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                    + '</div>';

                $("#srcContratos").html(fila);
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

function getSemestre(detalles) {

    var items_result = detalles;
    var select = "";
    var semestre = ["Primero", "Segundo"];

    for (var i = 0; i < items_result.length; i++) {

        if (items_result[i].anio.toString() === $("#top_origen_informacion option:selected").val()) {
            select = select + '<option value="' + items_result[i].semestre.toString() + '">' + semestre[items_result[i].semestre*1-1] + '</option>';
        }

    }
    $('#top_origen_semestre').html(select);
}

var disableClick = false;
function deshabilita(des) {
    disableClick = des;
    if (des) {
        $("#btn-buscar").prop("disabled", des);
        $('#btnLimpiar').attr("disabled", "disabled")
    } else {
        $("#btn-buscar").prop("disabled", des);
        $('#btnLimpiar').removeAttr("disabled")
    }
}

$("#btnLimpiar").click(function () {
    if (!disableClick) {
        $("#top_contratos_periodos").val(0);
        $("#top_contratos_estados").val("");
        $("#entidad").val("");
        $("#proceso").val("");
        deshabilita(true);
        getProcesosContratacion($("#top_origen_informacion option:selected").val(), 1, cant_contratos, idProyecto, $("#proceso").val());
    }
});

$("#btn-buscar").click(function () {
    if (!disableClick) {
        deshabilita(true);
        getProcesosContratacion($("#top_origen_informacion option:selected").val(), 1, cant_contratos, idProyecto, $("#proceso").val() );
    }

});

function getProcesosContratacion(annio, pagina, registros,idproyecto, proceso) {

    var filtros = {
        Annio: annio,
        Semestre: null,
        IdProyecto: idproyecto,
        NumeroPagina: pagina,
        RegistrosPorPagina: registros,
        NombreProceso: proceso,
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "../api/serviciosproyectos/ProcesosContratacion",
        cache: false,
        data: filtros,
        success: function (result) {
            if (result.status == true) {
                if (result.cantidadTotalRegistros > 0) {
                    var info = result.data;
                    var proceso = "";
                    var entidad = "";
                    var filaproceso = "";
                    var referencia = "";
                    var data = "";
                    var fila = "";
                    var filaconfirma = "";
                    var inicioLuis = '<div class="contractBox">';
                    var finLuis = '</div>';
                    var inicio = "";
                    var fin = "";
                    $("#srcContratos").html("");
                    for (var i = 0; i < info.length; i++) {
                        if (i > 0 && entidad == info[i].comprador.toString() && proceso != info[i].codigoProceso.toString()) {
                            fila += filaconfirma + '</div>' + referencia + '</div>';
                            filaconfirma = "";

                        }
                        if (entidad != info[i].comprador.toString()) {
                            if (i > 0) //Cambio de entidad
                            {
                                data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;
                                fila = "";
                                filaconfirma = "";
                                filasinfirma = "";
                                inicio = "";
                                fin = "";
                            }
                            if (info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")) { stilo = "contractONCAE" } else { stilo = "contractSEFIN" }
                            inicio = '<div class="cotractName ' + stilo + '"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Entidad</span><div class="clearfix"></div>'
                                + '                 <span class="h4">' + info[i].comprador.toString() + '</span>'
                                + ' </div></div></div>';
                            entidad = info[i].comprador.toString();
                        }

                        if (proceso != info[i].codigoProceso.toString()) {

                            fila += '<div class="contractNumberRP"><span class="">Código proceso: </span>'
                                + '	<span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>';

                            if(info[i].descripcionProceso) {
                                    fila += '<div class="contractNumberRP"><span class="">Proceso: </span>';
                                    fila += '	<span class="text-bold">' + info[i].descripcionProceso.toString() + '</span></div>';
                            }
                            fila += '<div class="wrap-head-process">';
                            fila += '<div class="contractData">';

                            fila += ''
                                + '		<div class="row border-b">'
                                + '			<div class="col-xs-12 col-md-4">'
                                + '				<span class="txt_small">Estado del proceso</span>'
                                + '				<span class="amount_adj">';
                            if (info[i].estadoProceso) { fila += info[i].estadoProceso.toString(); }
                            fila += '</span></div>'
                                + '			<div class="col-xs-6 col-md-4"><span class="txt_small">Monto Estimado</span> <span class="amount_adj"> ' + separar_milesv2((info[i].valorPlaneado * 1), 2, '.', ',') + ' </span></div>'
                                + '			    <div class="col-xs-6 col-md-2">'
                                + '				   <span class="txt_small">Moneda</span>'
                                + '				   <span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span>'
                                + '			    </div>'
                                + '			</div>';


                            fila += ''
                                + '		<div class="row border-b">';
                            if (info[i].fechaIncioPublicacionProceso) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Inicio</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaIncioPublicacionProceso.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }
                            if (info[i].fechaInicioRecepcionOfertas) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Recepción</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaInicioRecepcionOfertas.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }
                            if (info[i].fechaEstimadaAdjudicacion) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }

                            fila += '	</div>'
                                + '	</div>';

                            fila += '</div>'
                                + '<div class="clearfix"></div>';
                            filaconfirma += ' <div class="related-contracts">'
                                + '     <span class="h4">Contrato(s) u órden(es) de compra:</span>'//Contratos de ' + info[i].origenInformacion + ' asociados a este proceso
                                + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                            proceso = info[i].codigoProceso.toString();


                            if (info[i].docURL) {
                                referencia = '<div class="row text-center">'
                                    + '<div class="col-xs-12 col-md-12"><a href="' + info[i].docURL.toString() + '" target="_blank" class="btn btn-outlined"><i class="material-icons md-22">launch</i> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                    + '</div>';
                            }


                        }


                        filaconfirma += '<div class="panel panel-default">'
                            + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                            + '                <h4 class="panel-title">'
                            + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

                        if (info[i].codigoContrato) { filaconfirma += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; } else { filaconfirma += '                      Pendiente emisión código contratación  ' }

                        filaconfirma += '     </a>'
                            + '                </h4>'
                            + '            </div>'
                            + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                            + '                <div class="panel-body">';
                        if (info[i].descripcionContrato) {
                            filaconfirma += '          <div class="row border-b">'
                                + '                        <div class="col-md-12"><span class="small"> CONTRATO U ORDEN DE COMPRA</span><span class="amount_adj">' + info[i].descripcionContrato.toString() + '</span></div>'
                                + '                    </div>';
                        }
                        var moneda = '$';
                        if (info[i].monedaContrato.toString()) {
                            if (info[i].monedaContrato.toString() == 'USD') {
                                moneda = '$';
                            }
                        }
                        filaconfirma += '        <div class="row border-b">'
                            + '                        <div class="col-md-4">'
                            + '                            <span class="small"> RAZÓN SOCIAL<span>'
                            + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].codigoProveedor.toString() + '"><span class="amount_adj"><i class="material-icons md-22">shortcut</i> ' + info[i].contratista.toString() + '</span></a>'
                            + '                        </div>'
                            + '                        <div class="col-md-4"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipoCodigoProveedor.toString() + '</span></div>'
                            + '                        <div class="col-md-4"><span class="small"> NÚMERO DE DOCUMENTO</span><span class="amount_adj">' + info[i].codigoProveedor.toString() + '</span></div>'
                            + '                    </div>'
                            + '                    <div class="row border-b">'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj"> ' + moneda + ' ' + separar_milesv2((info[i].valorContratado * 1), 2, '.', ',') + '</span></div>'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span></div>'
                            + '                    </div>'


                        filaconfirma += '                    <div class="row border-b">';

                        if (info[i].fechaInicioContrato && info[i].fechaInicioContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">FECHA DE INICIO CONTRATO</span>'
                                + '                                                                     <span class="amount_adj">'
                                + info[i].fechaInicioContrato.toString().substr(0, 10)
                                + '                                                                      </span></div>';
                        }
                        if (info[i].fechaFinContrato && info[i].fechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'FECHA DE FIN CONTRATO'
                                + '</span><span class="amount_adj">'
                                + info[i].fechaFinContrato.toString().substr(0, 10)
                                + '        </span></div>';
                        }

                        if (info[i].fechaInicioEjecucionContrato && info[i].fechaInicioEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de INICIO EJECUCIÓN'
                                + '</span><span class="amount_adj">'
                                + info[i].fechaInicioEjecucionContrato.toString().substr(0, 10)
                                + '        </span></div>';
                        }
                        if (info[i].fechaFinEjecucionContrato && info[i].fechaFinEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de FIN EJECUCIÓN'
                                + '</span><span class="amount_adj">'
                                + info[i].fechaFinEjecucionContrato.toString().substr(0, 10)
                                + '        </span></div>';
                        }

                        filaconfirma += '                    </div>';

                        if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
                            filaconfirma += '                    <div class="row border-b">'
                                + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                            if (info[i].ofertaPeriodoDuracion) { filaconfirma += info[i].ofertaPeriodoDuracion.toString(); }

                            filaconfirma += '                   Días</span></div>';

                            filaconfirma += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                            if (info[i].fechaPublicacion !== null && info[i].fechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                filaconfirma += info[i].fechaPublicacion.toString().substr(0, 10) + '</span></div>';
                            }
                            else {
                                filaconfirma += '</span></div>';
                            }

                            filaconfirma += '                    </div>';

                        }

                        filaconfirma += '                </div>'
                            + '               <div class="panel-footer" style="align:center">';

                        if (info[i].codigoContrato) {
                            filaconfirma += '                    <a href="../../contrato?codcontrato=' + info[i].codigoContrato.toString() + '" class="btn btn-primary btn-participe"><i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>';
                        }
                        filaconfirma += '                 </div>'
                            + '            </div>'
                            + '        </div>';
                        //+ '  </div>';
                    }


                    data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;


                    $("#srcContratos").html(data);
                    if (scrol >= 1) {
                        $('html, body').animate({ scrollTop: $('#srcContratos').offset().top }, 2000);
                    } else { scrol = scrol + 1; }

                    dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
                    configuraEnlaceContratista();
                }
                else {
                    $("#divPagContratos").empty();
                    $("#srcContratos").html("");
                    var fila = '<div class="contractBox" >'
                        + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                        + '</div>';
                    $("#srcContratos").html(fila);
                }
            } else {
                alert("Message: " + result.message);
            }
            deshabilita(false);
        },
        error: function (response) {
            deshabilita(false);
            alert(response.responseText);
        },
        failure: function (response) {
            deshabilita(false);
            alert(response.responseText);
        }
    });

}

$("#top_origen_informacion").change(function () {
    var datos = $('#top_origen_informacion').data("detalles");
    getSemestre(datos);

});

function iniUsuarioLog() {
    $("#hdIdUsuario").val(projectPerfil[0].idUsuParticipa);
    $("#hdNomUsuario").val(projectPerfil[0].nomUsuParticipa);
    if ($("#hdIdUsuario").val() != "") {

        $("#divUsuarioLog").slideUp(100, function () {
            //$("#divNomUsuarioLog").text("Hola, " + $("#hdNomUsuario").val());
            $("#divCloseSesion").show();
            $("#divPregParticipacion").css("visibility", "visible");
            $("#divPregParticipacion").attr("class", "objVisible");
        });

    }
}
function configurarEnlaceLocation() {

    $('.enlace_ficha').each(function (i, e) {
        $(e).bind('click', function () {
            var enlace_url = "../../Location/";
            var location_id = $(this).attr("location_id");
            document.cookie = "location_id=" + location_id + ";path=/;";
            var tipo = $(this).attr("tipo");
            var tipo_aux = tipo;
            if (tipo.toUpperCase() == "REGION" || tipo.toUpperCase() == "DEPARTAMENTO") {
                tipo_aux = "region";
            }
            else if (tipo.toUpperCase() == "COUNTY" || tipo.toUpperCase() == "MUNICIPIO") {
                tipo_aux = "county";
            }

            enlace_url += "?" + "type=" + tipo_aux + "&id=" + location_id


            //-----------------------------------
            $(this).attr('href', enlace_url);

        });
    })
}
function GetComentarios(id) {
    if ($("#content-2").length > 0) {
        $("#content-2").remove();
    }
    var param = "IdProyecto=" + id;
    $.ajax({
        url: "/api/ServiciosParticipacion/GetComentarios",
        type: "GET",
        data: param,

    }).done(function (result) {
        var items_result = result.itemcomentario;
        if ($("#content-2").length <= 0) {
            d3.select("#divComentarios")
                .append("div")
                .attr("id", "content-2")
                .attr("class", "content mCustomScrollbar")
                .attr("data-mcs-theme", "minimal")
        }

        var cont_resp = 0;

        if (items_result.length > 0) {
            var id_padre = 0;
            var id_preg = 0;


            for (var i = 0; i < items_result.length; i++) {

                id_padre = items_result[i].comentarioRelacionado;
                if ($("#content-2").length > 0) {

                    const d = new Date(items_result[i].fechaCreacion);
                    const fecha_aux = new Intl.DateTimeFormat('es-ES').format(d);
                    var nombre = "";
                    if (items_result[i].anonimo == false) {
                        nombre = items_result[i].nom_usuario.toString();
                    }
                    else {
                        nombre = " Anónimo";
                    }
                    if (id_padre == null) {
                        cont_resp = cont_resp + 1;
                        var div_commenta = d3.select("#content-2")
                        var div_comment = div_commenta.append("div")
                            .attr("class", "Comment")
                        var dividcomm = "divPadre" + items_result[i].idComentario;
                        var div_coment = div_comment.append("div")
                            .attr("class", "User_comment")
                        var usr_pic = div_coment.append("div")
                            .attr("class", "Pic_user")
                            .append("img")
                            .attr("src", "/img/User_profile.jpg")
                        var usr_poster = div_coment.append("div")
                            .attr("class", "Post_user")
                        var usr_name = usr_poster.append("div")
                            .attr("class", "Post_name")
                            .append("text").text(" " + nombre + ": ")
                        var usr_txt = usr_poster.append("div")
                            .attr("class", "Post_txt")
                            .append("text").text(" " + items_result[i].comentarioOriginal.toString())
                        var usr_date = usr_poster.append("div")
                            .attr("class", "Post_date")
                            .append("text").text("Fecha de Publicación: " + fecha_aux)
                        var divhijo = div_comment.append("div")
                            .attr("id", dividcomm)
                    }
                    else {
                        var dividcomm = "#divPadre" + id_padre;
                        var div_res = d3.select(dividcomm)
                        var div_gov = div_res.append("div")
                            .attr("class", "Gov_comment")
                        var usr_pic = div_gov.append("div")
                            .attr("class", "Pic_user")
                            .append("img")
                            .attr("src", "/img/PCM_profile.jpg")
                        var usr_poster = div_gov.append("div")
                            .attr("class", "Post_user")
                        var usr_txt = usr_poster.append("div")
                            .attr("class", "Post_txt")
                            .append("text").text(" " + items_result[i].comentarioOriginal.toString())
                        var usr_date = usr_poster.append("div")
                            .attr("class", "Post_date")
                            .append("text").text("Fecha de Publicación: " + fecha_aux)
                    }


                }

            }
        }
        $("#txtNumComentarios").text("(" + cont_resp + ") ");

    });

}
function limpiarCamposUsuario(opc) {
    if (opc == "login") {
        $("#txtEmailLog").val("");
        $("#txtClaveLog").val("");
        $("#txtNombre").val("");
        $("#txtEdad").val("");
        $("#txtEmail").val("");
        $("#txtPassword").val("");
        $("#txtPassword_2").val("");
        $("#hdIdUsuario").val("");
        $('.btn-select-value').each(function (i, e) {
            $(e).html($(e).attr("etiqueta"));
        });

    } else if (opc == "clave") {
        $("#txtPassword_re").val("");
        $("#txtPassword_re_2").val("");
        $("#txtCodigoVerifica").val("");
        $("#txtEmailReset").val("");

    } else if (opc == "all") {
        $("#txtEmailLog").val("");
        $("#txtClaveLog").val("");
        $("#txtNombre").val("");
        $("#txtEdad").val("");
        $("#txtEmail").val("");
        $("#txtPassword").val("");
        $("#txtPassword_2").val("");
        $("#hdIdUsuario").val("");
        $("#txtPassword_re").val("");
        $("#txtPassword_re_2").val("");
        $("#txtCodigoVerifica").val("");
        $("#txtEmailReset").val("");
        $("#txtEmailVerifica").val("");
        $('.btn-select-value').each(function (i, e) {
            $(e).html($(e).attr("etiqueta"));
        });
    }
}
function AddNuevaCuentaUsuario() {
    //valida campos obligatorios
    var formularioOK = true;
    var camposReq = "";
    $(".alert-danger").hide();
    $('.required', $('#divInfoUsuario')).each(function (i, e) {
        var id_txt = $(e).attr("for");
        var tipo = $("#" + id_txt).prop('type').toLowerCase();
        if (tipo == "text" || tipo == "password") {
            if ($("#" + id_txt).val() == "") {
                camposReq += "[" + id_txt + "]";
                $("#error_" + id_txt).show();
                formularioOK = false;
            } else {
                $("#error_" + id_txt).hide();
            }
        } else {
            if ($('#' + id_txt + ' li.selected').attr('id') == "0") {
                camposReq += "[" + id_txt + "]";
                $("#error_" + id_txt).show();
                formularioOK = false;
            } else {
                $("#error_" + id_txt).hide();
            }

        }

    });

    if (formularioOK == false) {
        if (camposReq != "") {
            bootbox.alert("Faltan campos obligatorios");
        }
    } else {
        //validarCorreo
        if ($("#txtPassword").val() != $("#txtPassword_2").val()) {
            bootbox.alert("Confirmación Password incorrecta");
        } else {
            var clave_usu = $("#txtPassword").val();
            if (validaClaveUsu(clave_usu) == false) {
                bootbox.alert("Formato de clave incorrecto: La clave debe tener al menos 8 carácteres, entre ellos, una letra mayúscula y un número");
            } else {
                //validarCorreo
                if (validaEmail($('#txtEmail').val())) {
                    //validar edad
                    if (validaEnteroMayorCero($("#txtEdad").val())) {
                        var params_usu = {
                            Nombre: $("#txtNombre").val(),
                            email: $("#txtEmail").val(),
                            hash_clave: $("#txtPassword").val(),
                            Edad: $("#txtEdad").val(),
                            IdGenero: $("#filtro_Genero option:selected").attr("id_gen"),
                            IdRol: $("#filtro_Rol option:selected").attr("id_rol"),
                            IdMedio: $("#filtro_Medios option:selected").attr("id_medio"),
                            IdProyRel: idProyecto
                        };
                        //add nuevo registro
                        $.ajax({
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            url: "/api/ServiciosParticipacion/AddUsuarios",
                            cache: false,
                            data: JSON.stringify(params_usu),
                            success: function (result) {
                                if (result.status == true) {
                                    bootbox.alert("Su cuenta ha sido creada. Hemos enviado a su correo electrónico un link de verificación para activarla.", function () {
                                        $("#divCuentaNueva").slideUp(100, function () {
                                            $("#divUsuarioLog").slideDown(function () {
                                                limpiarCamposUsuario();
                                            });
                                        });
                                    });

                                } else {
                                    bootbox.alert("@Error: " + result.message);
                                }

                            },
                            error: function (response) {
                                alert(response.responseText);
                            },
                            failure: function (response) {
                                alert(response.responseText);
                            }
                        });

                    } else {
                        bootbox.alert("Edad inválida");

                    }
                } else {
                    bootbox.alert("Email inválido");
                }

            }


        }
    }
}
function validaClaveUsu(cadena) {
    //que tenga mayusculas, numeros,de 8 digitos al menos
    var clave = new RegExp(/^(?=(?:.*\d){1})(?=(?:.*[A-Z]){1})\S{8,}$/);
    valida = clave.test(cadena);
    return valida;
}
//Comunes
//validación de correo electrónico
function validaEmail(cadena) {
    if (cadena.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
        return true;
    } else {
        return false;
    }
}
function validaEnteroMayorCero(cadena) {
    if (cadena.match(/^[1-9]+[0-9]*$/)) {
        return true;
    } else {
        return false;
    }
}
function validaLoginUsu() {
    //valida campos obligatorios
    $("#divCloseSesion").hide();
    $("#hdNomUsuario").val("");
    $("#hdIdUsuario").val("");
    var formularioOK = true;
    var camposReq = "";
    $(".alert-danger").hide();
    $('.required', $('#divDatosLogin')).each(function (i, e) {
        var id_txt = $(e).attr("for");
        if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
            camposReq += "[" + id_txt + "]";
            $("#error_" + id_txt).show();
            formularioOK = false;
        } else {
            $("#error_" + id_txt).hide();
        }
    });

    if (formularioOK == false) {
        if (camposReq != "") {
            bootbox.alert("Faltan campos obligatorios");
        }
    } else {
        //validarCorreo
        if (validaEmail($('#txtEmailLog').val())) {
            var params_usu = {
                email: $("#txtEmailLog").val(),
                hash_clave: $("#txtClaveLog").val(),
                valida_rol: 'n'
            };
            //add nuevo registro
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/ValidaLogin",
                cache: false,
                data: JSON.stringify(params_usu),
                success: function (result) {
                    if (result.status == true) {
                        //USUARIO EXISTE
                        $("#divNomUsuarioLog").text("Hola, " + result.usuarios.nombre);
                        $("#hdNomUsuario").val(result.usuarios.nombre);
                        $("#hdIdUsuario").val(result.usuarios.idUsuario);

                        $("#divUsuarioLog").slideUp(100, function () {
                            $("#divCloseSesion").show();
                            $("#divPregParticipacion").attr("class", "objVisible");

                        });


                    } else {
                        bootbox.alert("Error: " + result.message, function () {

                        });
                    }

                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });

        } else {
            bootbox.alert("Email inválido");
        }
    }
}
function cerrarSesionUsu() {
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosParticipacion/CerrarSession",
        cache: false,
        data: null,
        success: function (result) {
            if (result.status == true) {
                //USUARIO EXISTE
                $("#divNomUsuarioLog").text("");
                $("#hdNomUsuario").val("");
                $("#hdIdUsuario").val("");
                $("#divUsuarioLog").slideDown(100, function () {
                    $("#divCloseSesion").show();
                    $("#divPregParticipacion").attr("class", "objHidden");
                    location.reload();
                });
            } else {
                bootbox.alert("@Error: " + result.message);
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
function guardarMeGusta(mg, tipoFoto, id) {
    //valida campos obligatorios
    var megusta = false;
    var nomegusta = false;
    var idFoto = '';
    var idFotoUsuario = '';
    if (mg == 'M') { megusta = true }
    else if (mg == 'N') { nomegusta = true }
    else { bootbox.alert("Error"); }
    if (tipoFoto == 'P') { idFoto = id; }
    else if (tipoFoto == 'U') { idFotoUsuario = id; }
    else { bootbox.alert("Error"); }

    var formularioOK = true;
    var camposReq = "";
    $(".alert-danger").hide();


    if (formularioOK == false) {
        if (camposReq != "") {
            bootbox.alert("Faltan campos obligatorios");
        }
    } else {
        if ($("#hdIdUsuario").val() != 0) {
            var params_mg = {
                IdUsuario: $("#hdIdUsuario").val(),
                IdFoto: idFoto,
                IdFotoUsuario: idFotoUsuario,
                Megusta: megusta,
                NoMegusta: nomegusta,
                IdProyecto: projectPerfil[0].id_project,

            };
            //add nuevo registro
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/GuardaMeGusta",
                cache: false,
                data: JSON.stringify(params_mg),
                success: function (result) {
                    if (result.status == true) {
                        //ya no me gusta
                        bootbox.alert("Su opinión ha sido guardada", function () {
                            if (projectPerfil[0].id_project != undefined) {

                            }
                        });

                    } else {
                        bootbox.alert("@Error: " + result.message);
                    }
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });

        } else {

            bootbox.confirm({
                message: "Acción válida sólo para usuarios registrados",
                buttons: {
                    confirm: {
                        label: 'Ingresar',
                        className: 'btn btn-primary active'
                    },
                    cancel: {
                        label: 'Cancelar',
                        className: 'objHidden'
                    }
                },
                callback: function (result) {
                    if (result == true) {
                        document.location.href = "#s5";
                        setTimeout(function () {
                            $('#txtEmailLog').focus();
                        }, 10);
                    }

                }
            });
        }
    }
}
function validaCamposOblig(contenedor) {
    var formularioOK = true;
    var camposReq = "";
    $(".alert-danger").hide();
    $('.required', $("#" + contenedor)).each(function (i, e) {
        var id_txt = $(e).attr("for");
        if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
            camposReq += "[" + id_txt + "]";
            $("#error_" + id_txt).show();
            formularioOK = false;
        } else {
            $("#error_" + id_txt).hide();
        }
    });
    return formularioOK;
}
function dibujaPaginacionContrato(actual, total, totalPag, cant_por_pag) {
    var pag_actual = parseInt(actual);
    pagina_actual = pag_actual;
    var pagesHTML = '';
    var cant_por_linea = 10;

    deshabilita(false);
    $("#divPagContratos").empty();

    var divPag = d3.select("#divPagContratos");

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

        deshabilita(true);

        d3.select("#divProyectos").empty();
        pagina_actual = $(this).attr("data-page");

        getProcesosContratacion($("#top_origen_informacion option:selected").val(), pagina_actual, cant_contratos, projectPerfil[0].id_project, $("#proceso").val());
    });

}
function configuraEnlaceContratista() {
    $(".enlace_contratista").click(function () {
        var ruc = $(this).attr('data-parameter');
        var dataValue = $(this).attr('data-parameter'),
            dataType = $(this).attr('data-type').toLowerCase();
        document.cookie = "ruc=" + ruc + ";path=/;";
        var url = "/contratista?" + dataType + "=" + dataValue;
        window.open(url, '_blank');

    });
}

    //$("#btnNuevaCuenta").click(function () {
    //    $("#divUsuarioLog").slideUp(100, function () {
    //        $("#divCuentaNueva").slideDown(function () {
    //            limpiarCamposUsuario("login");
    //        });
    //    });
    //});

    $("#btnAddCuentaUsu").click(function () {
        AddNuevaCuentaUsuario();
    });

    //$("#btnIngresarUsuLog").click(function () {
    //    validaLoginUsu();
    //});



    $("#btnEnlaceOlvidoClave").click(function () {
        $("#divUsuarioLog").slideUp(100, function () {
            $("#divOlvidoClave").slideDown(function () {
                limpiarCamposUsuario("clave");
            });
        });

    });

    $("#btnEnviaCodigoClave").click(function () {
        //valida correo
        var correo_usu = $("#txtEmailReset").val();
        if (validaEmail(correo_usu)) {

            var params_usu = { "email": correo_usu };
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/ValidaEmail",
                cache: false,
                data: JSON.stringify(params_usu),
                success: function (result) {
                    if (result.status == true) {
                        //usuario, se ha enviado correo con codigo
                        $("#txtEmailVerifica").val(correo_usu);
                        $("#divOlvidoClave").slideUp(100, function () {
                            $("#divConfirmaCodigo").slideDown(function () {
                                limpiarCamposUsuario("clave");
                            });
                        });


                    } else {
                        bootbox.alert("Error: " + result.message, function () {

                        });
                    }

                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });

        } else {
            bootbox.alert("Email inválido");

        }




    });

    $("#btnVerificaCodigoClave").click(function () {
        var params_usu = { "email": $("#txtEmailVerifica").val(), "cod_verifica": $("#txtCodigoVerifica").val() };
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/ServiciosParticipacion/ValidaCodigo",
            cache: false,
            data: JSON.stringify(params_usu),
            success: function (result) {
                if (result.status == true) {
                    //usuario, se ha enviado correo con codigo
                    $("#hdIdUsuario").val(result.id_usuario);
                    $("#divConfirmaCodigo").slideUp(100, function () {
                        $("#divResetPassword").slideDown(function () {
                            limpiarCamposUsuario("clave");
                        });
                    });
                } else {
                    $("#hdIdUsuario").val("");
                    if (result.message == null || result.message == undefined) {
                        bootbox.alert("Error: " + "Fallo la verificación", function () {

                        });
                    } else {
                        bootbox.alert("Error: " + result.message, function () {

                        });
                    }

                }

            },
            error: function (response) {
                alert(response.responseText);
            },
            failure: function (response) {
                alert(response.responseText);
            }
        });

    });


    $("#btnCambiarClaveOlvido").click(function () {
        //valida campos obligatorios
        var formularioOK = validaCamposOblig("divResetPassword");

        if (formularioOK == false) {
            if (camposReq != "") {
                bootbox.alert("Faltan campos obligatorios");
            }
        } else {
            //validarClave
            if ($("#txtPassword_re").val() != $("#txtPassword_re_2").val()) {
                bootbox.alert("Confirmación nueva clave incorrecta");
            } else {
                var clave_usu = $("#txtPassword_re").val();
                if (validaClaveUsu(clave_usu) == false) {
                    bootbox.alert("Formato de clave incorrecto: La clave debe tener al menos 8 carácteres, entre ellos, una letra mayúscula y un número");
                } else {
                    if ($("#hdIdUsuario").val() != "") {
                        var params_usu = {
                            IdUsuario: $("#hdIdUsuario").val(),
                            hash_clave: clave_usu,
                        };
                        //add nuevo registro
                        $.ajax({
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            url: "/api/ServiciosParticipacion/updClaveUsuario",
                            cache: false,
                            data: JSON.stringify(params_usu),
                            success: function (result) {
                                if (result.status == true) {
                                    bootbox.alert("Nuevo password almacenado", function () {
                                        $("#divResetPassword").slideUp(100, function () {
                                            $("#divUsuarioLog").slideDown(function () {
                                                limpiarCamposUsuario("all");
                                            });
                                        });
                                    });

                                } else {
                                    bootbox.alert("@Error: " + result.message);
                                }

                            },
                            error: function (response) {
                                bootbox.alert(response.responseText);
                            },
                            failure: function (response) {
                                bootbox.alert(response.responseText);
                            }
                        });
                    } else {
                        bootbox.alert("Codigo no verificado");
                    }

                }
            }
        }

    });

$("#btnGuardarComent").click(function () {
    //validar sesion
    const token = localStorage.getItem('access_token');
    if (!isTokenValid(token)) {
        alert("Sesión Finalizada por Tiempo");
        cerrarSesion();
        $("#divNomUsuarioLog").text("");
        $("#hdNomUsuario").val("");
        $("#hdIdUsuario").val("");
        $("#divUsuarioLog").slideDown(100, function () {
            $("#divCloseSesion").show();
            $("#divPregParticipacion").attr("class", "objHidden");
            //location.reload();
        });
        return;
    }
        //valida campos obligatorios
        $("#btnGuardarComent").hide();
        var formularioOK = validaCamposOblig("divPregParticipacion");

        if (formularioOK == false) {
            if (camposReq != "") {
                bootbox.alert("Campos requeridos");
            }
        } else {
            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();
            var id_usuario = $("#hdIdUsuario").val();
           // var id_departamento = $('#filtro_AreaInfluencia option:selected').attr("id_depa");
            var id_tipo = $("#filtro_TipoCometario option:selected").attr("id_tipo");
            var text_coment = $("#txtcomentario").val();
            var ch_anonimo = $("#anonimo").prop('checked');
            var id_proyecto = projectPerfil[0].id_project;

            if (id_tipo == "" || id_tipo == undefined) {
                formularioOK = false;
                bootbox.alert("Seleccione un tipo de comentario");
            }
            //else if (id_departamento == "" || id_departamento == undefined) {
            //    formularioOK = false;
            //    bootbox.alert("Seleccione una entidad territorial");
            //}
            else if (text_coment == "") {
                formularioOK = false;
                bootbox.alert("Ingresar un comentario");
            }

            if (formularioOK == true) {
                var params_com = {
                    IdUsuario: id_usuario,
                    id_departamento: null, // id_departamento,
                    id_municipio: null,
                    IdTipoComentario: id_tipo,
                    IdProyecto: id_proyecto,
                    ComentarioOriginal: text_coment,
                    Anonimo: ch_anonimo,
                    IdEstado: 1,
                    IdAsociacion: 5,
                    IdTipoRespuesta: 1,
                    ComentarioRelacionado: null,
                    UsuarioComenta: 0
                };
                //add nuevo registro
                $.ajax({
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "/api/ServiciosParticipacion/insComentario",
                    cache: false,
                    data: JSON.stringify(params_com),
                    success: function (result) {
                        if (result.status == true) {
                            //COMENTARIOS GUARDADOS EXITOSAMENTE
                            $("#divPregParticipacion").slideUp(100, function () {
                                $("#divCloseSesion").show();
                                var nom_usu = $("#hdNomUsuario").val();
                                $("#txtMsgConfirmaEnvio").text("Gracias " + nom_usu);
                                $("#divConfirmaEnvio").slideDown(function () {
                                    if (projectPerfil[0].id_project != undefined) {
                                        GetComentarios(projectPerfil[0].id_project);
                                    }
                                });
                            });

                        } else {
                            bootbox.alert("@Error: " + result.message);
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
        }
        $("#btnGuardarComent").show();

    });
    $(".btnMegusta").click(function () {
        var tipoFoto = ($(this).attr('tipofoto'));
        var idFoto = ($(this).attr('idfoto'));
        guardarMeGusta('M', tipoFoto, idFoto);
    });

    $(".btnNoMegusta").click(function () {
        var tipoFoto = ($(this).attr('tipofoto'));
        var idFoto = ($(this).attr('idfoto'));
        guardarMeGusta('N', tipoFoto, idFoto);
    });

    $("#enlace_cierre").click(function () {
        cerrarSesionUsu();
    });

    configurarEnlaceLocation();
    $("#btnSubirFoto_AUX").on("click", function () {
            if ($("#hdIdUsuario").val() != "") {
                $("#btnSubirFoto").trigger("click");

        } else {

            bootbox.confirm({
                message: "Acción válida para usuarios registrados",
                buttons: {
                    confirm: {
                        label: 'Ingresar',
                        className: 'btn btn-primary active'
                    },
                    cancel: {
                        label: 'Cancelar',
                        className: 'objHidden'
                    }
                },
                callback: function (result) {
                    if (result == true) {
                        document.location.href = "#s5";
                        setTimeout(function () {
                            $('#txtEmailLog').focus();
                        }, 10);
                    }



                }
            });
        }

    });

    if (projectPerfil[0].id_project != undefined) {
        GetComentarios(projectPerfil[0].id_project);
    }

    $("#btnSigVerifica").click(function () {
        var url = "/PerfilProyecto/" + projectPerfil[0].id_project + "#s5";
        window.location.href = url;

    });


