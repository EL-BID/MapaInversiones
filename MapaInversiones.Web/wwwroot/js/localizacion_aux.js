var typeProjectList = 'projectsBySector';
var dataLocation;
var projectsByFiltersEntity;
var actualPage = 1;
var totalByPage = 10;
var finishData = 0;
var initData = 0;
var global_x_localidad = [];
const cantXPagina = 6;
const cantXPagPot = 4;
const cant_por_linea = 10;
var locationId = $("#locationId").val();
var year = $("#annioPresupuestoLocation option:selected").val();
var sectorSelected = "";
var sectorPotSelected = "";
var entidadSelected = "";
var destacadosSelected = "";
var totalProjectsLocation = 0;
var totalProjectsPotLocation = 0;

$('#annioPresupuestoLocation').on('change', function (e) {
  e.preventDefault(); // Previene el comportamiento predeterminado si es necesario
  year = $(this).val(); // Obtiene el valor del elemento seleccionado
  getConsolidadoLocalizacionPeriodosPresupuesto();
})

//#region Presupuesto fondos de desarrollo local
getConsolidadoLocalizacionPeriodosPresupuesto();
function getConsolidadoLocalizacionPeriodosPresupuesto() {
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "../api/ServiciosLocationProfile/GetBudgetFundsByLocationIdAndYear",
    type: "GET",
    data: {
      locationId: locationId,
      year: year
    }
  }).done(function (data) {
    var vigente = Number(data.vigente);
    var comprometido = Number(data.comprometido);
    var disponible = Number(data.disponible);
    var pctGiros = Number(data.ejecucionDisponible);
    var pctComprometido = Number(data.ejecucionComprometida);
    $('.valor-vigente[tipo="general"]').text("$ " + shared.formatoMoneda(vigente));
    $('.valor-girado[tipo="general"]').text("$ " + shared.formatoMoneda(disponible));
    $('.valor-comprometido[tipo="general"]').text("$ " + shared.formatoMoneda(comprometido));
    $('.porcentaje-girado[tipo="general"]').text(shared.formatoDecimales(pctGiros) + '%');
    $('.porcentaje-comprometido[tipo="general"]').text(shared.formatoDecimales(pctComprometido) + '%');
    $('.completed.comprometido[tipo="general"]').css('width', pctComprometido + '%');
    $('.completed.girado[tipo="general"]').css('width', pctGiros + '%');
    $('#distribucionTipoGastoAnio').html(year);
    getDistribucionPorTipoGastoByLocalizacionIdAndYear();
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error " + xhr.status + "_" + thrownError);
  });
}
//#endregion Presupuesto fondos de desarrollo local

//#region Componente distribución por tipo de gasto
getDistribucionPorTipoGastoByLocalizacionIdAndYear();
function getDistribucionPorTipoGastoByLocalizacionIdAndYear() {
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "../api/ServiciosLocationProfile/GetBudgetConsolidateByLocationIdAndYear",
    type: "GET",
    data: {
      locationId: locationId,
      year: year,
    }
  }).done(function (data) {
    //console.log("data consolidada", data);
    graphGastoLocalizacion(data);
    getFechaCorte(data.fechaCorte, data.fuenteDatos);
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error w " + xhr.status + "_" + thrownError);
  });
}
function getFechaCorte(fechaCorte, fuenteDatos) {
  //console.log("fuenteDatos", fuenteDatos);
  $('#fechaCorteGastoLocalizacion').empty();
  if (fechaCorte != undefined && fechaCorte != null)
    $('#fechaCorteGastoLocalizacion').html("<b>Fuente de los datos: </b>" + fuenteDatos + "<br><b>Fecha de corte: </b>" + fechaCorte);
}
function graphGastoLocalizacion(objData) {
  $("#divGraphGastoLocalizacion").empty();
  if (objData != undefined && objData != null) {
    //filtrar datos x tab
    for (var i = 0; i < objData.data.length; i++) {
      objData.data[i].rawValueDouble = parseFloat(objData.data[i].rawValueDouble);
    }

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

    grafica = new d3plus.Treemap()
      .select("#divGraphGastoLocalizacion")
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
        data: objData.data,
        groupBy: ["labelGroup", "label"],
        height: 500,
        sum: "rawValueDouble",              // Valor agregado
        depth: 0,                           // Empieza con un nivel, permite clic para expandir
        legend: false,
        tooltipConfig: {
          title: function (d) {
            var depth_aux = grafica.depth();
            var longitud_tooltip = 80;
            var cad = '';
            switch (depth_aux) {
              case 0:
                cad = d.labelGroup;
                break;
              case 1:
                cad = d.label;
                break;
              default:
                cad = d.labelGroup;
            }
            if (cad.length > longitud_tooltip) {
              cad = cad.substr(0, longitud_tooltip) + "...";
            }
            return cad;
          },
          tbody: [
            [function (d) {
              var valor = d["rawValueDouble"] / 1;
              var cad = "";
              cad += "<span>" + "$ " + shared.formatoMoneda(valor) + "</span></br>";
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
        }
      })
      .render();
  }

}
//#endregion Componente distribución por tipo de gasto

//#region Inversión en la localidad
getODSByLocationId();
function getODSByLocationId() {
  proyectos = [];
  totalProjectsLocation = 0;
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "../api/ServiciosLocationProfile/GetODSLocation",
    type: "GET",
    data: {
      locationId: locationId,
    }
  }).done(function (data) {
    var selectSectores = "";
    var selectEntidades = "";
    var selectDestacados = "";
    var ods = "";
    totalProjectsLocation = data.approvedProjects;
    $('#cantidadProyectosLocalizacion').html(data.approvedProjects.toString() + " Proyectos");
    selectSectores = selectSectores + '<option selected value="">Todos</option>';
    selectEntidades = selectEntidades + '<option selected value="">Todos</option>';
    selectDestacados = selectDestacados + '<option selected value="">Todos</option>';
    for (var i = 0; i < data.infoSectores.length; i++) {
      selectSectores = selectSectores + '<option value="' + data.infoSectores[i].id.toString() + '">' + data.infoSectores[i].nombre.toString() + '</option>';
    }
    for (var i = 0; i < data.infoEntidades.length; i++) {
      selectEntidades = selectEntidades + '<option value="' + data.infoEntidades[i].id.toString() + '">' + data.infoEntidades[i].nombre.toString() + '</option>';
    }
    for (var i = 0; i < data.infoDestacados.length; i++) {
      selectDestacados = selectDestacados + '<option value="' + data.infoDestacados[i].id.toString() + '">' + data.infoDestacados[i].nombre.toString() + '</option>';
    }
    $('#odsDesarrolloLoc').html(ods);
    $('#selectSectorLocalidades').html(selectSectores);
    $('#selectSectorProyectosPOT').html(selectSectores);
    $('#selectEntidadLocalidades').html(selectEntidades);
    $('#selectDestacadosLocalidades').html(selectDestacados);
    GetListadoODSInversionLocalizacion(1, cantXPagina);
  }
  ).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error " + xhr.status + "_" + thrownError);
  });
}
function GetListadoODSInversionLocalizacion(pagina, tamanopagina) {
  proyectos = [];
  sectorSelected = $("#selectSectorLocalidades option:selected").val();
  entidadSelected = $("#selectEntidadLocalidades option:selected").val();
  destacadosSelected = $("#selectDestacadosLocalidades option:selected").val();
  //console.log("sectorSelected", sectorSelected);
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "../api/ServiciosLocationProfile/GetConsolidadoODSInversionLocalizacion",
    type: "GET",
    data: {
      locationId: locationId,
      idSector: sectorSelected,
      idEntidad: entidadSelected,
      destacados: destacadosSelected,
      pagina: pagina,
      tamanopagina: tamanopagina
    }
  }).done(function (data) {
    //console.log("data inv", data);
    if (data.infoConsolidadoProyectosInversions) {
      var list = "";
      totalProjectsLocation = data.approvedProjects;
      if (data.infoConsolidadoProyectosInversions.length == 0) list = "<p><b>No hay datos para mostrar.</b></p>";
      else {
        for (var i = 0; i < data.infoConsolidadoProyectosInversions.length; i++) {
          list = list + '<div class="card d-flex cardborder">                                                                                '
            + '    <div class="headEnt">                                                                                           '
            + '        <div class="data1 mainDataEntidad4">                                                                        '
            + '                <span class="labelTit">Código SEGPLAN: ' + data.infoConsolidadoProyectosInversions[i].codigoProyecto + '</span>                                                  '
            + '                <span class="td1">' + data.infoConsolidadoProyectosInversions[i].nombreProyecto + '</span>                                '
            + '        </div>                                                                                                      '
            + '        <div class="data1c">                                                                                         '
            + '                <span class="labelTit">                                                                             '
            + '                    Valor programado                                                                             '
            + '                </span>                                                                                             '
            + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalProgramado, 1, 1) + '</span>                                                                  '
            + '        </div>                                                                                                      '
            + '        <div class="data1c">                                                                                         '
            + '                <span class="labelTit">                                                                             '
            + '                    Valor comprometido                                                                             '
            + '                </span>                                                                                             '
            + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalComprommetido, 1, 1) + '</span>                                                                  '
            + '        </div>                                                                                                      '
            + '        <div class="data1c">                                                                                         '
            + '                <span class="labelTit">                                                                             '
            + '                    % avance comprometido                                                                        '
            + '                </span>                                                                                             '
            + '            <span class="td1">' + shared.formatoDecimales(data.infoConsolidadoProyectosInversions[i].porcentajeComprometido, 3)  + '%</span>                                                                   '
            + '        </div>                                                                                                      '
            + '        <div class="data1c">                                                                                         '
            + '                <span class="labelTit">                                                                             '
            + '                    Valor girado                                                                              '
            + '                </span>                                                                                             '
            + '            <span class="td1">$ ' + shared.formatoMoneda(data.infoConsolidadoProyectosInversions[i].vlrTotalGirado, 1, 1) + '</span>                                                                   '
            + '        </div>                                                                                                      '
            + '        <div class="data1c">                                                                                         '
            + '                <span class="labelTit">                                                                             '
            + '                    % avance girado                                                                              '
            + '                </span>                                                                                             '
            + '            <span class="td1">' + shared.formatoDecimales(data.infoConsolidadoProyectosInversions[i].porcentajeGirado, 3)  + '%</span>                                                                   '
            + '        </div>                                                                                                      '
            + '    </div>                                                                                                          '
            + '    <div class="btn-action">                                                                                        '
            + '        <div class="btnPerfil">                                                                                     '
            + '            <a class="text-small" target="_blank" href="/PerfilProyecto/' + data.infoConsolidadoProyectosInversions[i].idProyecto + '"><i class="material-icons md-18">arrow_forward</i><br /><span>Ver perfil</span></a>'
            + '        </div>                                                                                                      '
            + '    </div>                                                                                                          '
            + '</div>';
        }
      }
      $('#listdesarrolloLocalizacion').html(list);
      dibujarPagNumeradasInversion(pagina, totalProjectsLocation);
    }
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error " + xhr.status + "_" + thrownError);
  });
}
function dibujarPagNumeradasInversion(paginaActual, totalProy) {
  const totalProyectos = totalProy;
  const totalPages = Math.ceil(totalProyectos / cantXPagina);
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
  $("#divPagDistDesarrolloLoc").html(pagEnlace);
  $('#page_right, #page_left, .page_left, .page_right').off('click').on('click', function () {
    const nuevaPagina = parseInt($(this).attr("data-page"));

    $("#listdesarrolloLocalizacion").empty();
    GetListadoODSInversionLocalizacion(nuevaPagina, cantXPagina);
    dibujarPagNumeradasInversion(nuevaPagina, totalProjectsLocation);
  });
}
$('#selectSectorLocalidades').on('change', function (e) {
  GetListadoODSInversionLocalizacion(1, cantXPagina);
});
$('#selectEntidadLocalidades').on('change', function (e) {
  GetListadoODSInversionLocalizacion(1, cantXPagina);
});
$('#selectDestacadosLocalidades').on('change', function (e) {
  GetListadoODSInversionLocalizacion(1, cantXPagina);
});
//#endregion Inversión en la localidad

//#region Proyectos POT
getProyectosPotPerLocalidadId(1,cantXPagPot);
function getProyectosPotPerLocalidadId(paginaPot, tamanopaginaPot) {
  sectorPotSelected = $("#selectSectorProyectosPOT option:selected").val();
  totalProjectsPotLocation = 0;
  $.ajax({
    contentType: 'application/json; charset=utf-8',
    url: "../api/ServiciosLocationProfile/GetPotProjectsLocationsByLocationIdAndYear",
    type: "GET",
    data: {
      locationId: locationId,
      sectorId: sectorPotSelected,
      pagina: paginaPot,
      tamanoPagina: tamanopaginaPot
    }
  }).done(function (data) {
    totalProjectsPotLocation = data.totalProjects;
    showProyectosPot(data.potProjects, 1);
    //---------------------------------

  }).fail(function (handleError) {
    // Some function
    //console.log(handleError);
  });
}
function showProyectosPot(datos, pagina) {
  let html_aux = '';
  if (datos.length == 0) html_aux = "<p><b>No hay datos para mostrar.</b></p>";
  else {
    for (var i = 0; i < datos.length; i += cantXPagPot) {
      for (var j = i; j < i + cantXPagPot && j < datos.length; j++) {
        const proyecto = datos[j];
        html_aux += `
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body-pry">
                            <div class="cardimg-city">
                                <img alt="imagen representativa del proyecto" src="../img/ciudad1.png" />
                            </div>
                            <div class="cardcont-city">
                                <a  data-parameter="${proyecto.id}"  target="_blank"  href="/PerfilProyectoPot/${proyecto.id}" class="item-link">
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
      // Cerrar fila
    }
  }
  $('#divProyectosPotLoc').html(html_aux);
  dibujarPaginasPot(pagina);
}

function dibujarPaginasPot(paginaActual) {
  const totalPages = Math.ceil(totalProjectsPotLocation / cantXPagina);
  const pagActual = parseInt(paginaActual);
  const totalNumerosPaginador = 4;

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
  $("#divPagPotLoc").html(pagEnlace);
  //$('#divPagPotLoc, #page_right, #page_left, .page_left, .page_right').off('click').on('click', function () {
  //  console.log("Clic paginador Pot", $(this).attr("data-page"));
  //  //const nuevaPagina = parseInt($(this).attr("data-page"));
  //  //$("#divProyectosPotLoc").empty();
  //  //getProyectosPotPerLocalidadId(nuevaPagina, cantXPagPot);
  //});
  $('#divPagPotLoc').off('click', 'a, span').on('click', 'a, span', function () {
    //const page = $(this).data('page');
    //console.log("Clic paginador Pot", page);
    const nuevaPagina = parseInt($(this).data('page'));
    $("#divProyectosPotLoc").empty();
    getProyectosPotPerLocalidadId(nuevaPagina, cantXPagPot);
  });
}
$('#selectSectorProyectosPOT').on('change', function (e) {
  $("#divProyectosPotLoc").empty();
  $("#divPagPotLoc").empty();
  getProyectosPotPerLocalidadId(1, cantXPagPot);
});
//#endregion Proyectos POT
getConsolidadoGastosPorLocalizacionAnio($("#locationId").val(), $("#annioPresupuestoLocation option:selected").val());

getInformationByTypeLocationAndLocationIdAndYearAndJurisdiction();





function getInformationByTypeLocationAndLocationIdAndYearAndJurisdiction() {
  var jurisdictionId = $("#jurisdiction").val() == undefined ? "0" : $("#jurisdiction").val();
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "../api/ServiciosLocationProfile/GetDetailLocationProfileByLocationIdAndTypeLocation",
    type: "GET",
    data: {
      locationId: $("#locationId").val(),
      typeLocation: $("#typeLocationId").val(),
      jurisdictionId: jurisdictionId
    }
  }).done(function (data) {

    dataLocation = data;
    //console.log("data sector",data);
    //$("#s0").empty();
    ////var geneInfoProjByState = '<div class="container"> <div class="section-heading heading-left"><h2>Información general</h2></div><div class="row py-2 contadores">';
    ////if (data != undefined && data.totalProjectsByState != null) {
    ////    data.totalProjectsByState.forEach(x => {
    ////        geneInfoProjByState = geneInfoProjByState + getDivGeneralInformacionCard("card h-100 shadow card-entidad b1", x.stateName, x.totalProjects);
    ////    });
    ////}
    ////$("#s0").append(geneInfoProjByState);
    //$("#s2").empty();

    //if (data.generalInformacion != undefined) {
    //    if (data.generalInformacion.isChildLocationEnable) {
    //        $("#linkDistrict").show();
    //        var locationChilds = '<div class="container">' + getDivNameLocationChild(data.generalInformacion.childLocationName);
    //        locationChilds = locationChilds + '<div class="row">';
    //        locationChilds = locationChilds + getDivImageLocationChild(data.generalInformacion.urlImage, $("#typeLocation").text());
    //        locationChilds = locationChilds + getDivChildLocations(data.locationChilds);
    //        locationChilds = locationChilds + '</div></div>';
    //        $("#s2").append(locationChilds);
    //    }
    //    $("#provinceByDistrict").append(data.generalInformacion.parentLocationName);
    //}
    //$("#s3").empty();

    //if (data.locationsRelated) {
    //    $("#linkMoreDistrict").show();
    //    var locationRelated = '<div class="container">' + getDivNameLocationRelated(data.generalInformacion.parentLocationName);
    //    locationRelated = locationRelated + '<div class="row">';
    //    locationRelated = locationRelated + getDivChildLocationsRelated(data.locationsRelated);
    //    locationRelated = locationRelated + '</div></div>';
    //    $("#s3").append(locationRelated);
    //}

    getDivGraphProySector(data.projectsBySector, data.projectsByLocation);
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error w " + xhr.status + "_" + thrownError);
  });
}









function getConsolidadoGastosPorLocalizacionAnio(locationId, year) {
  $.ajax({
    contentType: "application/json; charset=utf-8",
    url: "../api/ServiciosLocationProfile/GetConsolidatedCostByLocationAndYear",
    type: "GET",
    data: {
      locationId: locationId,
      year: year
    }
  }).done(function (data) {
    var result = data.gastoSector;
    var str_cad = "";
    if (result != null) {
      graphGastoPorLocalizacionAnio(result);
    }
  }).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error " + xhr.status + "_" + thrownError);
  });
}

function graphGastoPorLocalizacionAnio(objData) {
  $("#divGraphGastoLocalizacion").empty();
  if (objData != undefined && objData != null) {
    //filtrar datos x tab
    for (var i = 0; i < objData.length; i++) {
      objData[i].rawValueDouble = parseFloat(objData[i].rawValueDouble);
    }

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

    grafica = new d3plus.Treemap()
      .select("#divGraphGastoLocalizacion")
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
        groupBy: ["labelGroup", "label"],
        height: 500,
        sum: "rawValueDouble",              // Valor agregado
        depth: 0,                           // Empieza con un nivel, permite clic para expandir
        legend: false,
        tooltipConfig: {
          title: function (d) {
            var depth_aux = grafica.depth();
            var longitud_tooltip = 80;
            var cad = '';
            switch (depth_aux) {
              case 0:
                cad = d.labelGroup;
                break;
              case 1:
                cad = d.label;
                break;
              default:
                cad = d.labelGroup;
            }
            if (cad.length > longitud_tooltip) {
              cad = cad.substr(0, longitud_tooltip) + "...";
            }
            return cad;
          },
          tbody: [
            [function (d) {
              var valor = d["rawValueDouble"] / 1;
              var cad = "";
              cad += "<span>" + "$ " + shared.formatoMoneda(valor) + "</span></br>";
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
        }
      })
      .render();
  }
}




tabProjectSelected();
function tabProjectSelected() {
  $('.link_project_by_type').on('click', function () {
    typeProjectList = this.id;
    if (typeProjectList == "projectsBySector") {
      getDivGraphProySector(dataLocation.projectsBySector, dataLocation.projectsByLocation);
      $("#projectsByFuntionalGroup").removeClass('link_project_by_type active');
      $("#projectsByFuntionalGroup").addClass('link_project_by_type');
      $("#projectsBySector").removeClass('link_project_by_type');
      $("#projectsBySector").addClass('link_project_by_type active');
    }
    else {
      getDivGraphFunctionalGroup(dataLocation.projectsByFunctionalGroup, dataLocation.projectsByFunctional);
      $("#projectsBySector").removeClass('link_project_by_type active');
      $("#projectsBySector").addClass('link_project_by_type');
      $("#projectsByFuntionalGroup").removeClass('link_project_by_type');
      $("#projectsByFuntionalGroup").addClass('link_project_by_type active');
    }
  });
}
function clearDivLocationProfile() {
  $("#divListadoProyectos").empty();
  $("#typeProjectTitle").empty();
  $("#divGraphProy").empty();
  $("#linkDistrict").show();
}
function getDivGeneralInformacionCard(styleCard, titleCard, totalRegister) {
  let divGeneInfoProjState = '<div class="col-xs-4 col-sm-4 col-md-6 col-lg-3 mb-3">';
  divGeneInfoProjState = divGeneInfoProjState + '<div class="' + styleCard + '"> <div class="card-body"> <div class="wrap-desc-entidad"><div class="h5">';
  divGeneInfoProjState = divGeneInfoProjState + titleCard + '</div> <div class="h1">';
  divGeneInfoProjState = divGeneInfoProjState + totalRegister + '</div></div></div></div></div>';
  return divGeneInfoProjState;
}
function getDivTableProjectsByFunctionalGroup(functional, projectsByFunctional) {
  $("#divListadoProyectos").empty();
  $("#typeProjectTitle").empty();
  if (projectsByFunctional != null && projectsByFunctional.length > 0) {
    var entity = $("#entitiesProject").val();
    $("#typeProjectTitle").html('Obras para el grupo <span>' + functional + '</span>');
    let existProject = false;
    projectsByFiltersEntity = projectsByFunctional.filter(x => x.grupoFuncional == functional && x.entidadEjecutora == entity);
    if (projectsByFiltersEntity.length > 0) {
      initData = ((actualPage - 1) * totalByPage);
      finishData = (actualPage * totalByPage) - 1;
      var projectsByPage = jQuery.grep(projectsByFiltersEntity, function (n, i) {
        return (i >= initData && i <= finishData);
      });
      if (projectsByPage.length > 0) {
        existProject = true;
        $("#divPaginator").show();
        getDivTableProjectsByFilters(projectsByPage);
        drawPaginator(actualPage, projectsByFiltersEntity.length);
      }
    }
    if (!existProject) {
      $("#divPaginator").hide();
      var divProjectList = "No hay obras para el grupo funcional <b>" + functional + " </b>estado <i>" + status.toLowerCase() + " </i>";//año de ejecución <b>" + year + "</b>";
      $("#divListadoProyectos").html(divProjectList);
    }
  }
}
function getDivTableProjectsByFilters(projectsByPage) {
  var divProjectList = '<div class="card-entidades-group">';
  projectsByPage.forEach(x => { divProjectList = divProjectList + getDivProject(x); });
  divProjectList = divProjectList + '</div>';
  $("#divListadoProyectos").html(divProjectList);
}
function drawPaginator(actualPage, totalRegister) {
  var totalPages = (totalRegister > totalByPage) ? ((totalRegister - (totalRegister % totalByPage)) / totalByPage) : 1;
  if ((totalRegister >= totalByPage) && ((totalRegister % totalByPage) > 0)) totalPages = totalPages + 1;
  var actualPag = parseInt(actualPage);
  $("#divPaginator").html("");
  var pagEnlace = "";
  var quotient = Math.floor(actualPag / totalByPage);
  var residue = actualPag % totalByPage;
  var init = 1;
  if (residue == 0) {
    init = (actualPag - totalByPage) + 1;
  } else {
    init = (quotient * totalByPage) + 1;
  }
  var finish = init + (totalPages - 1);
  if (totalPages < totalByPage) {
    finish = totalPages;
  }
  if (finish > totalPages) {
    finish = totalPages;
  }
  if (actualPag > totalByPage && totalPages >= totalByPage) {
    pagEnlace += '<a id="page_left" role="button" class="material-icons md-24" data-page="' + (init - totalByPage) + '"><span class="">chevron_left</span></a>';
  }
  for (var i = init; i <= finish; i++) {
    if (i == actualPag) {
      pagEnlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
    } else {
      pagEnlace += '<a class="page_left" role="button" data-page="' + i + '">';
      pagEnlace += '<span class="glyphicon"></span>';
      pagEnlace += '<text class="paginacion">' + i + '</text>';
      pagEnlace += '</a>';
    }
  }
  if (actualPag < totalPages) {
    if (finish < totalPages) {
      pagEnlace += '<a id="page_right" role="button" class="material-icons md-24" data-page="' + (finish + 1) + '"><span class="">chevron_right</span></a>';
    }
  }
  $("#divPaginator").html(pagEnlace);
  $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
    actualPage = $(this).attr("data-page");
    $("#divListadoProyectos").empty();
    initData = ((actualPage - 1) * totalByPage);
    finishData = (actualPage * totalByPage) - 1;
    var projectsByPage = jQuery.grep(projectsByFiltersEntity, function (n, i) {
      return (i >= initData && i <= finishData);
    });
    if (projectsByPage.length > 0) {
      getDivTableProjectsByFilters(projectsByPage);
      drawPaginator(actualPage, projectsByFiltersEntity.length);
    }
  });
}
function getDivTableProjectsBySector(sector, projectsByLocation) {
  $("#divListadoProyectos").empty();
  $("#typeProjectTitle").empty();
  if (projectsByLocation != null && projectsByLocation.length > 0) {
    var entity = $("#entitiesProject").val();
    $("#typeProjectTitle").html('Obras sector <span>' + sector + '</span>');
    let existProject = false;
    projectsByFiltersEntity = projectsByLocation.filter(x => x.nombreSector == sector && x.entidadEjecutora == entity);
    if (projectsByFiltersEntity.length > 0) {
      initData = ((actualPage - 1) * totalByPage);
      finishData = (actualPage * totalByPage) - 1;
      var projectsByPage = jQuery.grep(projectsByFiltersEntity, function (n, i) {
        return (i >= initData && i <= finishData);
      });
      if (projectsByPage.length > 0) {
        existProject = true;
        $("#divPaginator").show();
        getDivTableProjectsByFilters(projectsByPage);
        drawPaginator(actualPage, projectsByFiltersEntity.length);
      }
    }
    if (!existProject) {
      $("#divPaginator").hide();
      divProjectList = "No hay obras para el sector <b>" + sector + " </b>estado <i>" + status.toLowerCase() + " </i>";//año de ejecución <b>" + year + "</b>";
      $("#divListadoProyectos").html(divProjectList);
    }
  }
}
function getDivProject(project) {
  //console.log("project", project);
  //console.log("project.periodos", project.periodos.length);
  let year = project.periodos != null && project.periodos.length > 0 ? project.periodos[project.periodos.length - 1].id : 1984;//(new Date()).getFullYear();
  //console.log("year", year);
  let divProject = '<div id="proj_' + project.idProyecto + '" class="card d-flex">';
  divProject = divProject + '<div class="headEnt"><div class="data1 mainDataProyecto"><span class="small">Código BPIN: </span><span class="small text-bold">' + project.codigoSnip + '</span><br/>';
  divProject = divProject + '<span class="small">Localidad: </span><span class="small text-bold">' + project.nombreMunicipio + '</span><br/>';
  divProject = divProject + '<span class="td1">' + project.nombreProyecto + '</span>';
  divProject = divProject + '</div>';
  divProject = divProject + '<div class="data1"><span class="labelTit">Presupuesto acumulado desde (' + year + ')</span><span class="td1 blueT">$' + formatMoney(project.vlrTotalProyectoTodasLasFuentes, 0, ',', '.') + '</span></div>';
  divProject = divProject + '</div>';
  divProject = divProject + '<div class="btn-action">';
  divProject = divProject + '<div class="btnPerfil"><a target="_blank" rel="noopener" href="/PerfilProyecto/' + project.idProyecto + '" class="text-small"><i class="material-icons md-18">arrow_forward</i><br> <span>Ver proyecto</span></a></div>';
  divProject = divProject + '</div></div>';
  return divProject;
}

function getDivGraphProySector(projectsBySector, projectsByLocation) {

  $("#divGraphProy").empty();
  /*$("#divListadoProyectos").empty();*/
  //$("#showMessageGraph").hide();
  //$("#yearLabel").show();
  //$("#yearProject").show();
  //$("#stateLabel").show();
  //$("#statusProject").show();
  ////$("#typeProjectTitle").empty();
  ////$("#entitiesProject").empty();
  //$("#sectorSelected").val('');
  //$("#functionalGroupSelected").val('');

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
    if (posicion < paleta.colores.length) {
      return paleta.colores[posicion];
    } else {
      // Si hay más posiciones que colores, elige uno aleatorio
      var index = Math.floor(Math.random() * paleta.colores.length);
      return paleta.colores[index];
    }
  }

  //console.log("projectsBySector", projectsBySector);

  if (projectsBySector != undefined && projectsBySector != null) {
    for (var i = 0; i < projectsBySector.length; i++) {
      projectsBySector[i].value = parseFloat(projectsBySector[i].value);
      projectsBySector[i].rawValue = parseFloat(projectsBySector[i].rawValue);
    }
    if (projectsBySector.length > 0) {

      //graficoTreemap-----
      var visualization = new d3plus.Treemap()
        .select("#divGraphProy")
        .shapeConfig({
          labelConfig: {
            fontFamily: "'Montserrat', sans-serif",
            align: "center",
            size: 6,
            transform: "capitalize"
          },
          fill: function (d, i) {
            return colorPorPosicion(i);
          }
        })
        .config({
          data: projectsBySector,
          groupBy: ["label"],
          height: 419,
          tooltipConfig: {
            title: function (d) { return d.label; },

            tbody: [
              [function (d) {
                return "Estado: " + (d.labelGroup || "");
              }]
            ]
          },
          yConfig: {
            title: "",
          }
        })
        .sum("rawValue")
        .depth(1)
        .legend(true)
        .legendPosition("bottom")
        .on("click", function (d) {
          //$("#sectorSelected").val(d.label);
          //getYearsAndStatusProjectsBySector(d.label, projectsByLocation);
        })
        .render();

      //-------------------

      //var sectorGreaterParticipation = getSectorGreaterParticipation(projectsBySector);
      //if (sectorGreaterParticipation != '') {
      //    $("#sectorSelected").val(sectorGreaterParticipation);
      //    $("#functionalGroupSelected").val('');
      //    getYearsAndStatusProjectsBySector(sectorGreaterParticipation, projectsByLocation);
      //}
    }
    else {
      //$("#showMessageGraph").show();
      //$("#yearLabel").hide();
      //$("#yearProject").hide();
      //$("#stateLabel").hide();
      //$("#statusProject").hide();
      //$("#entitiesProject").hide();
    }
  }
  else {
    //$("#showMessageGraph").show();
    //$("#yearLabel").hide();
    //$("#yearProject").hide();
    //$("#stateLabel").hide();
    //$("#statusProject").hide();
    //$("#entitiesProject").hide();
  };
}

function colorPorPosicion(posicion) {
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
  return paleta.colores[posicion % paleta.colores.length];
}

function getYearsAndStatusProjectsBySector(sector, projectsByLocation) {
  if (projectsByLocation != null && projectsByLocation.length > 0) {
    $("#entitiesProject").empty();
    let entities = [];
    for (var i = 0; i < projectsByLocation.length; i++) {
      if (projectsByLocation[i].nombreSector == sector) {
        entities.push(projectsByLocation[i].entidadEjecutora);
      }
    }
    if (entities.length > 0) {
      entities = entities.map(x => x).filter((value, index, self) => self.indexOf(value) === index);
      entities.sort();
      entities.forEach(x => $("#entitiesProject").append('<option value="' + x + '">' + x + '</option>'));
    }
    if (entities.length > 0) {
      $("#typeProjectTitle").html('Obras sector <span>' + sector + '</span>');
      getDivTableProjectsBySector(sector, projectsByLocation);
    }
  }
}
function getSectorGreaterParticipation(projectsBySector) {
  if (projectsBySector == undefined || projectsBySector.length == 0) return '';
  var sectors = projectsBySector.map(item => item.label).filter((value, index, self) => self.indexOf(value) === index);
  let maxSector = 0;
  let rta = '';
  for (var i = 0; i < sectors.length; i++) {
    var projectsInSector = projectsBySector.filter(x => x.label == sectors[i]);
    let totalProjectsInSector = 0;
    projectsInSector.forEach(x => { totalProjectsInSector = totalProjectsInSector + x.rawValue })
    if (totalProjectsInSector > maxSector) {
      rta = sectors[i];
      maxSector = totalProjectsInSector;
    }
  }
  return rta;
}
function getFuntionalGreaterParticipation(projectsByFuntional) {
  if (projectsByFuntional == undefined || projectsByFuntional.length == 0) return '';
  var functionals = projectsByFuntional.map(item => item.label).filter((value, index, self) => self.indexOf(value) === index);
  let maxFuntional = 0;
  let rta = '';
  for (var i = 0; i < functionals.length; i++) {
    let totalProjectsInFuntional = projectsByFuntional.filter(x => x.label == functionals[i]).length;
    if (totalProjectsInFuntional > maxFuntional) {
      rta = functionals[i];
      maxFuntional = totalProjectsInFuntional;
    }
  }
  return rta;
}
function getDivGraphFunctionalGroup(projectsByFuntional, projectsByFuntionalGroup) {
  $("#divGraphProy").empty();
  $("#divListadoProyectos").empty();
  $("#showMessageGraph").hide();
  $("#typeProjectTitle").empty();
  $("#entitiesProject").empty();
  $("#sectorSelected").val('');
  $("#functionalGroupSelected").val('');
  if (projectsByFuntional != undefined && projectsByFuntional != null) {
    for (var i = 0; i < projectsByFuntional.length; i++) {
      projectsByFuntional[i].value = parseFloat(projectsByFuntional[i].value);
      projectsByFuntional[i].rawValue = parseFloat(projectsByFuntional[i].rawValue);
    }
    if (projectsByFuntional.length > 0) {
      var visualization = d3plus.viz()
        .container("#divGraphProy")
        .data(projectsByFuntional)
        .type({ "value": "tree_map", "mode": "squarify" })
        .id({ "value": ["labelGroup", "label"], "grouping": true })
        .depth(1)
        .size("rawValue")
        .font({ "family": "inherit" })
        .format({
          "text": function (text, params) {
            if (text == "rawValue") {
              return "Obras";
            } else if (text == "label") {
              return "Funcionalidad";
            } else if (text == "labelgroup") {
              return "Funcionalidad";
            } else if (text == "share") {
              return "Participación";
            } else {
              return d3plus.string.title(text, params);
            }
          }
        })
        .background("rgba(255,255,255,0)")
        .labels({ "align": "left", "valign": "top", "font": { "family": "inherit", "size": 14, "weight": "bold" }, "resize": true })
        .tooltip(["label"])   // list the keys to show in tooltip "labelGroup",
        .color("label")
        .color({
          "scale": ["#2F4556", "#FF3637", "#31655E", "#00C9B1", "#DD1A8B", "#DD4E29", "#D3A034", "#FFB886", "#FFF190", "#80AFE6", "#73323D", "##5B73DD"],
        })
        .height({ "max": 419, "small": 200, "secondary": 100, "value": 419 })
        .legend({
          "align": "middle",
          "size": [50, 80],
          "labels": true,
          "value": true,
          "filters": false,
          "data": true
          , "order": {
            "sort": "desc",
            "value": "size"
          }
        })
        .resize(true)
        .mouse({
          "move": true,
          "click": function (node, viz) {
            getYearsAndStatusProjectsByFuntionalGroup(node.label, projectsByFuntionalGroup);
          }
        }).draw();
      var funtionalGreaterParticipation = getFuntionalGreaterParticipation(projectsByFuntional);
      if (funtionalGreaterParticipation != '') {
        $("#sectorSelected").val('');
        $("#functionalGroupSelected").val(funtionalGreaterParticipation);
        getYearsAndStatusProjectsByFuntionalGroup(funtionalGreaterParticipation, projectsByFuntionalGroup);
      }

    }
    else {
      $("#showMessageGraph").show();
    }
  }
  else {
    $("#showMessageGraph").show();
  }
}
function getYearsAndStatusProjectsByFuntionalGroup(functional, projectsByFuntionalGroup) {
  //console.log("projectsByFuntionalGroup", projectsByFuntionalGroup);
  if (projectsByFuntionalGroup != null && projectsByFuntionalGroup.length > 0) {
    //$("#yearProject").empty();
    //$("#statusProject").empty();
    $("#entitiesProject").empty();
    //let years = [];
    //let status = [];
    let entities = [];
    for (var i = 0; i < projectsByFuntionalGroup.length; i++) {
      if (projectsByFuntionalGroup[i].grupoFuncional == functional) {

        entities.push(projectsByFuntionalGroup[i].entidadEjecutora);
      }
    }

    if (entities.length > 0) {
      entities = entities.map(x => x).filter((value, index, self) => self.indexOf(value) === index);
      entities.sort();
      entities.forEach(x => $("#entitiesProject").append('<option value="' + x + '">' + x + '</option>'));
    }

    $("#functionalGroupSelected").val(functional);
    if (entities.length > 0) {
      $("#typeProjectTitle").html('Obras grupo funcional <span>' + functional + '</span>');
      getDivTableProjectsByFunctionalGroup(functional, projectsByFuntionalGroup);
    }

  }
}
function getDivChildLocations(locationChilds) {
  let divChildLocations = '<div class="col-lg-6"> <div class="links-container">';
  for (var i = 0; i < locationChilds.length; i++) {
    divChildLocations = divChildLocations + '<div class="card blue-card link-location">';
    divChildLocations = divChildLocations + '<a href="/Location/&type=municipio&id=' + locationChilds[i].id + '"><span class="location-name">' + locationChilds[i].name + '</span>';
    divChildLocations = divChildLocations + '<span class="location-num-proy">(' + locationChilds[i].totalProjects + ')</span>';
    divChildLocations = divChildLocations + '<i class="material-icons md-24">arrow_forward_ios</i></a></div>';
  }
  divChildLocations = divChildLocations + "</div>";
  return divChildLocations;
}
function getDivChildLocationsRelated(locationsRelated) {
  let divChildLocationsRelated = '<div class="col-lg-12"> <div class="links-container">';
  for (var i = 0; i < locationsRelated.length; i++) {
    divChildLocationsRelated = divChildLocationsRelated + '<div class="card blue-card link-location">';
    divChildLocationsRelated = divChildLocationsRelated + '<a href="/Location/&type=municipio&id=' + locationsRelated[i].id + '"><span class="location-name">' + locationsRelated[i].name + '(' + locationsRelated[i].totalProjects + ')' + '</span>';
    divChildLocationsRelated = divChildLocationsRelated + '<i class="material-icons md-24">arrow_forward_ios</i></a></div>';
  }
  divChildLocationsRelated = divChildLocationsRelated + "</div>";
  return divChildLocationsRelated;
}
function getDivImageLocationChild(urlImageLocation, typeLocation) {
  return '<div class="col-lg-6"><img class="img-fluid py-3" src="' + urlImageLocation + '" alt="' + typeLocation + '"/></div>';
}
function getDivNameLocationChild(locationChildName) {
  return '<div class="section-heading heading-left"><h2>' + locationChildName + '</h2></div>';
}
function getDivNameLocationRelated(locationChildNameRelated) {
  return '<div class="section-heading heading-left"><h2>Sigue explorando</h2><p class="section-subheading">Otros municipios en ' + locationChildNameRelated + '</p2></div>';
}
//function jurisdictionChanged() {
//    if ($.trim($("#jurisdiction option:selected").text()) == "TODOS") $("#jurisdictionName").hide();
//    else {
//        $("#jurisdictionName").show();
//        $("#jurisdictionName").empty();
//    }
//    getInformationByTypeLocationAndLocationIdAndYearAndJurisdiction();
//}

function entitiesProjectChanged() {
  if ($("#functionalGroupSelected").val() != '') getDivTableProjectsByFunctionalGroup($("#functionalGroupSelected").val(), dataLocation.projectsByFunctional);
  else if ($("#sectorSelected").val() != '') getDivTableProjectsBySector($("#sectorSelected").val(), dataLocation.projectsByLocation);
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