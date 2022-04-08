var globales = [];

GetRecursosPorObjeto();


GetEjesEstrategicos();
GetEntidadesPlanNacional();


var dataEjesEstrategicos;
var objetivos;
function inicializaDatos() {
  $("#NombreEje").text("Eje 1:" + $(".btn-section").attr('nomb'));
  $("#DescripcionEje").text($(".btn-section").attr('desc'));
  valores = [6, 6, 4, 3, 2, 2, 1];
  cuantoGasto(valores);
  serie1 = [36.1, 37.3, 36.8, 49.7, 44.0, 41.3, 38.6, 43.7, 41.2, 37.9, 35.1, 34.7, 32.4, 26.9, 23.9, 24.5, 28.6];
  serie2 = [18.8, 17.7, 16.7, 24.4, 21.2, 18.3, 16.5, 23.7, 23.2, 19.0, 18.8, 19.4, 18.0, 13.8, 10.2, 10.1, 9.3];
  Evolution(serie1, serie2);
  $(".btn-section").click(function () {
    $("#NombreEje").text("Eje " + $(this).attr('eje') + ": " + $(this).attr('nomb'));
    $("#DescripcionEje").text($(this).attr('desc'));
    valores = [Math.random() * (8 - 1) + 1, Math.random() * (8 - 1) + 1, Math.random() * (8 - 1) + 1, Math.random() * (8 - 1) + 1, Math.random() * (8 - 1) + 1, Math.random() * (8 - 1) + 1, Math.random() * (8 - 1) + 1];
    cuantoGasto(valores);
    serie1 = [Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50), Math.random() * (50)];
    serie2 = [Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25), Math.random() * (25)];
    Evolution(serie1, serie2);
  ***REMOVED***);
***REMOVED***
function GetEntidadesPlanNacional() {
  $.ajax({
    url: "api/serviciosplan/GetEntidadesPlanNacional",
    type: "GET",
    data: null,

  ***REMOVED***).done(function (data) {
    var entidadPlanNacional = document.getElementById("entidadesPlanNacional");
    var htmlList = '';
    for (var i = 0; i < data.length; i++) {
      htmlList = htmlList + "<li class='list-group-item'><a href=" + '/PerfilEntidad?codEntidad=' + data[i].codEntidad + ">" + "<span>" + data[i].nombre + "</span><i class='material-icons md-18'>chevron_right</i></a></li>";
***REMOVED***
    if (data.length > 0)
      htmlList = htmlList + "<li class='list-group-item'><a href='/BusquedaResultados?Type=Entidad'>" + "<span>Ver todos</span><i class='material-icons md-18'>chevron_right</i></a></li>";
    entidadPlanNacional.innerHTML = htmlList;
  ***REMOVED***).fail(function (handleError) {
  
  ***REMOVED***);
***REMOVED***

function GenerarNombreEntidad(nombreEntidad) {
  var nombresEntidad = nombreEntidad.split(' ');
  var rta = "";
  for (var j = 0; j < nombresEntidad.length; j++) {
    if (j == 0) rta = nombresEntidad[j];
    else rta = rta + "+" + nombresEntidad[j];
  ***REMOVED***
  return rta;
***REMOVED***

function GetEjesEstrategicos() {
  $.ajax({
    url: "api/serviciosplan/GetEjesEstrategicos",
    type: "GET",
    data: null,

  ***REMOVED***).done(function (data) {
    dataEjesEstrategicos = data;
    if (dataEjesEstrategicos.ejesEstrategicos.length > 0) {
      var select = document.getElementsByName("ejesEstrategicos")[0];
      for (var i = 0; i < dataEjesEstrategicos.ejesEstrategicos.length; i++) {
        var option = document.createElement("option");
        option.text = dataEjesEstrategicos.ejesEstrategicos[i].nombre;
        option.value = dataEjesEstrategicos.ejesEstrategicos[i].id
        select.add(option);
  ***REMOVED***

      var tituloEje = document.getElementById("tituloEje");
      tituloEje.innerHTML = dataEjesEstrategicos.ejesEstrategicos[0].nombre;

      var descripcionEje = document.getElementById("descripcionEje");
      descripcionEje.innerHTML = dataEjesEstrategicos.ejesEstrategicos[0].descripcion;

      GetImagenEje(1);
      GetObjetivosPorEjeEstrategico(dataEjesEstrategicos.ejesEstrategicos[0].id);
***REMOVED***
  ***REMOVED***).fail(function (handleError) {
    // Some function

  ***REMOVED***);
***REMOVED***

function seleccionoEje(sel) {
  //console.log("Entré al select");
  var idEje = sel.options[sel.selectedIndex].value;
  var tituloEje = document.getElementById("tituloEje");
  tituloEje.innerHTML = sel.options[sel.selectedIndex].text;
  GetImagenEje(idEje);
  if (dataEjesEstrategicos != undefined) {
    for (var i = 0; i < dataEjesEstrategicos.ejesEstrategicos.length; i++) {
      if (dataEjesEstrategicos.ejesEstrategicos[i].nombre == tituloEje.innerHTML) {
        var descripcionEje = document.getElementById("descripcionEje");
        descripcionEje.innerHTML = dataEjesEstrategicos.ejesEstrategicos[i].descripcion;
  ***REMOVED***
***REMOVED***
  ***REMOVED***
  GetObjetivosPorEjeEstrategico(idEje);
***REMOVED***
function GetImagenEje(idEje) {
  var recuadroImagenEje = document.getElementById("recuadroImagenEje");
  var rutaImagenEje = document.getElementById("imagenEje");
  if (idEje == 1) {
    rutaImagenEje.src = "../img/ax-1_white.svg";
    recuadroImagenEje.setAttribute("class", "icon-eje ax1 h-100");
  ***REMOVED***
  else if (idEje == 2) {
    rutaImagenEje.src = "../img/ax-2_white.svg";
   
    recuadroImagenEje.setAttribute("class", "icon-eje ax2 h-100");
  ***REMOVED***
  else if (idEje == 3) {
    rutaImagenEje.src = "../img/ax-3_white.svg";
    recuadroImagenEje.setAttribute("class", "icon-eje ax3 h-100");
  ***REMOVED***
  else {
    rutaImagenEje.src = "../img/ax-4_white.svg";
    recuadroImagenEje.setAttribute("class", "icon-eje ax4 h-100");
  ***REMOVED***
  rutaImagenEje.setAttribute("class", "h-75");
  rutaImagenEje.setAttribute("alt", "Eje " + idEje);

***REMOVED***
function GetObjetivosPorEjeEstrategico(idEje) {
  var param = "idEje=" + idEje;
  $.ajax({
    url: "api/serviciosplan/GetObjetivosGeneralesXEjeEstrategico/",
    type: "GET",
    data: param,

  ***REMOVED***).done(function (data) {
    objetivos = data;
    if (data != undefined && data.objetivosPorEjeEstrategico != undefined && data.objetivosPorEjeEstrategico.length > 0) {
      var totalObjetivosEstrategicosPorEje = document.getElementById("totalObjEstrategicosPorEje");
      totalObjetivosEstrategicosPorEje.innerHTML = data.objetivosPorEjeEstrategico.length;

      var tabObjetivosEstrategicosPorEje = document.getElementById("tabObjetivos");
      tabObjetivosEstrategicosPorEje.innerHTML = "";
      for (var i = 0; i < data.objetivosPorEjeEstrategico.length; i++) {
        var idTabObjetivo = "liobjetivo" + (i + 1);
        if (i == 0) {
          tabObjetivosEstrategicosPorEje.innerHTML =
            '<li class="active" ' + 'id=' + idTabObjetivo + ' onclick=ObtenerObjetivosEspecificos(' + (i + 1) + ',' + idEje + ')>' +
            '<div class="goal-number">' + '</div>' +
            '<div class="goal-name">' +
            '<div class="h4">' + data.objetivosPorEjeEstrategico[i].nombre + '</div>' +
            '</div>' +
            '</li>';
    ***REMOVED***
        else {
          tabObjetivosEstrategicosPorEje.innerHTML = tabObjetivosEstrategicosPorEje.innerHTML +
            '<li' + ' id=' + idTabObjetivo + ' onclick=ObtenerObjetivosEspecificos(' + (i + 1) + ',' + idEje + ')>' +
            '<div class="goal-number">' + '</div>' +
            '<div class="goal-name">' +
            '<div class="h4">' + data.objetivosPorEjeEstrategico[i].nombre + '</div>' +
            '</div>' +
            '</li>';
    ***REMOVED***
  ***REMOVED***

      GetContenidoPestania(1, idEje);
***REMOVED***
  ***REMOVED***).fail(function (handleError) {
    // Some function
  ***REMOVED***);
***REMOVED***

function ActivarPestania(w) {
  if (objetivos !== undefined && objetivos !== null) {
    for (var i = 0; i < objetivos.objetivosPorEjeEstrategico.length; i++) {
      let liObjetivo = "liobjetivo" + (i + 1);
      var tabObjetivos = document.getElementById(liObjetivo);
      if ((i + 1) == w) {
        tabObjetivos.classList.add("active");
  ***REMOVED***
      else
        tabObjetivos.classList.remove("active");
***REMOVED***
  ***REMOVED***
***REMOVED***

function GetContenidoPestania(w, idEje) {
  var contenttabObjetivosEstrategicosPorEje = document.getElementById("contentTabObjetivos");
  contenttabObjetivosEstrategicosPorEje.innerHTML = "";
  contenttabObjetivosEstrategicosPorEje.innerHTML =
    '<div class="wrap-cabecero">' +
      '<div class="row mb-3">' +
  '<div class="col-lg-12">' +//'<div class="col-lg-7">' para mostrar alineado con objetivos
          '<div class="h5 mb-4">Descripción</div>' +
          '<p>' + objetivos.objetivosPorEjeEstrategico[w - 1].descripcion + '</p>' +
        '</div>' +
        //'<div class="col-lg-5">' +
        //  '<div class="h5 mb-4">Alineado a objetivos ODS</div>' +
        //  '<div id="liAlineadosOds" class="tags-ODS">' +
        //  '</div>' +
        //'</div>' +
      '</div>' +
    '</div>' +
   '<section class="section main-Content">' +
    '<div class="container">' +
    '<div class="row">' +
    '<div class="col-lg-12">' +
    '<div class="section-heading">' +
    '<h4>Objetivos específicos (<span>' + objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico.length + '</span>)</h4>' +
    '</div>' +
    '<div id="listadoObjetivos" class="Ochart">' +

    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</section>';
  //var liOdsAlineado = document.getElementById("liAlineadosOds");
  //for (var i = 0; i < objetivos.objetivosPorEjeEstrategico[w - 1].ods.length; i++) {
  //  liOdsAlineado.innerHTML = liOdsAlineado.innerHTML + '<span class="badge rounded-pill Outlinetag text-dark">' + objetivos.objetivosPorEjeEstrategico[w - 1].ods[i].codOds + '.' + objetivos.objetivosPorEjeEstrategico[w - 1].ods[i].nombre + '</span>';
  //***REMOVED***

  var listaObjEspecificos = document.getElementById("listadoObjetivos");
  listaObjEspecificos.innerHTML = "";
  var encabezadoObjetivo = '<ul class="accordion-list">';
  var piePaginaObjetivo = '</ul>';
  var cuerpoObjetivo = '';
 
  if (objetivos.objetivosPorEjeEstrategico !== undefined && objetivos.objetivosPorEjeEstrategico !== null && objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico.length > 0) {
    for (var i = 0; i < objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico.length; i++) {
          var liObjEspecifico = 'liobjEspecificosPorObjGeneral' + idEje + '_' + objetivos.objetivosPorEjeEstrategico[w - 1].id + '_' + objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico[i].id;
          var idObjEspecifico = 'objEspecificosPorObjGeneral' + idEje + '_' + objetivos.objetivosPorEjeEstrategico[w - 1].id + '_' + objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico[i].id ;
          var idCuerpoObjetivoEspecifico = 'bodyobjEspecificoPorObjGeneral' + idEje + '_' + objetivos.objetivosPorEjeEstrategico[w - 1].id + '_' + objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico[i].id;
          cuerpoObjetivo = cuerpoObjetivo +
            "<li id=" + liObjEspecifico + " class='accordion-item'>" +
              "<div id=" + idObjEspecifico + " class='accordion-trigger' onclick=GetIndicadoresXIdObjetivoEspecifico(" + idEje + "," + objetivos.objetivosPorEjeEstrategico[w - 1].id + "," + objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico[i].id + ")  >" +
                "<span class='number-indicator'>" + objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico[i].codigo + "</span>" +
                "<span class='name-indicator'>" + objetivos.objetivosPorEjeEstrategico[w - 1].objetivoEspecifico[i].nombre + "</span>" +
              "</div>" +
              "<div id=" + idCuerpoObjetivoEspecifico + " class='accordion-content content'>" +
              "</div>" +
            "</li>";
***REMOVED***
    listaObjEspecificos.innerHTML = encabezadoObjetivo + cuerpoObjetivo + piePaginaObjetivo;
  ***REMOVED***

  
***REMOVED***


function ObtenerObjetivosEspecificos(w, idEje) {
  ActivarPestania(w);
  GetContenidoPestania(w, idEje);
***REMOVED***



function GetIndicadoresXIdObjetivoEspecifico(idEje, idObjetivoEstrategico, idObjetivoEspecifico) {
  $.ajax({
    url: "api/serviciosplan/GetIndicadoresXIdObjetivoEspecifico/",
    type: "GET",
    data: {
      idEje: idEje,
      idObjetivoEstrategico: idObjetivoEstrategico,
      idObjetivoEspecifico: idObjetivoEspecifico
  ***REMOVED***

  ***REMOVED***).done(function (data) {
    var indicadoresXObjEspecifico = document.getElementById('bodyobjEspecificoPorObjGeneral' + idEje + '_' + idObjetivoEstrategico + '_' + idObjetivoEspecifico);
    indicadoresXObjEspecifico.innerHTML = "";

    if (data != null && data.length > 0) {
      var nuevoIndicador = '';
      
      var cabeceraNuevoIndicador = '<div class="card card-indicator">';
      var piePaginaNuevoIndicador = '</div>';
      for (var j = 0; j < data.length; j++) {
        var cuerpoNuevoIndicador = '';
        var avance = "";
        var meta2023 = "";
        var meta2030 = "";
        var unidadEscalamedicion = "";
        var anioBase = "";
        var valorAnioBase = "";
        if (data[j].avance != null || data[j].avance != undefined) avance = ConvertirNumeroNotacionPais('es-PY', data[j].avance,2);
        if (data[j].meta2023 != null || data[j].meta2023 != undefined) meta2023 = data[j].meta2023.toString();
        if (data[j].meta2030 != null || data[j].meta2030 != undefined) meta2030 = ConvertirNumeroNotacionPais('es-PY', data[j].meta2030, 2);  //data[j].meta2030.formatDecimal(2, ',', '.').toString();
        if (data[j].unidadEscala != null || data[j].unidadEscala != undefined) unidadEscalamedicion = data[j].unidadEscala;
        if (data[j].anioBase != null || data[j].anioBase != undefined) anioBase = data[j].anioBase;
        if (data[j].valorAnioBase != null || data[j].valorAnioBase != undefined) valorAnioBase = ConvertirNumeroNotacionPais('es-PY', data[j].valorAnioBase, 2);// data[j].valorAnioBase.formatDecimal(2, ',', '.').toString();
        if (meta2023 == "" && avance == 0) avance = "";
        var unidadMedidaGrafica = ObtenerCodigoUnidadGrafica(unidadEscalamedicion);
        
        cuerpoNuevoIndicador = '<div class="card-title" id="indicador_' + data[j].idIndicador + '">' +
                                '<div class="row">' +
                                  '<div class="col-lg-10"><div class="h6">' + data[j].nombre + '</div></div>' +
                                  '<div class="col-lg-2"></div>' +
                                '</div>' +
                              '</div>' +
                              '<div class="card-body">' +
                                  '<div class="row data-indicadores mb-4">' +
                                      '<div class="col-6 col-lg-2">' +
                                        '<small>Unidad de medida</small>' +
                                        '<span class="text-xl">' + unidadEscalamedicion + '</span>' +
                                      '</div>' +
                                      '<div class="col-6 col-lg-2">' +
                                        '<small>Año base</small>' +
                                        '<span class="text-xl">' + anioBase + '</span>' +
                                      '</div>' +
                                      '<div class="col-6 col-lg-2">' +
                                        '<small>Valor año base</small>' +
                                        '<span class="text-xl">' + valorAnioBase + '</span>' +
                                      '</div>' +
                                      '<div class="col-6 col-lg-2">' +
                                        '<small>Año del avance</small>' +
                                        '<span class="text-xl">' + meta2023 + '</span>' +
                                      '</div>' +
                                      '<div class="col-6 col-lg-2">' +
                                      '<small>Avance</small>' +
                                      '<span class="text-xl">' + avance + '</span>' +
                                      '</div>' +
                                      '<div class="col-6 col-lg-2">' +
                                        '<small>Meta 2030</small>' +
                                        '<span class="text-xl">' + meta2030 + '</span>' +
                                       '</div>' +
                                    '</div>' +
                                    '<div class="row" id="verGraph_' + data[j].idIndicador +'">' +
          '<div class="col-12 text-center">' +
          '<div class="btn btn-small btn-cards"' + ' onclick=ObtenerGraficaAvance(' + data[j].idIndicador + ',' + unidadMedidaGrafica + ')>' +
                                            'Ver gráfico' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div id="divGraphAvance_' + data[j].idIndicador + '"></div>' +
                                    '<div class="row"  style="none" id="ocultarGraph_' + data[j].idIndicador +'">' +
                                        '<div class="col-12 text-center">' +
                                            '<div class="btn btn-small btn-cards" onclick=OcultarGraficaAvance(' + data[j].idIndicador + ')>' +
                                                'Ocultar gráfico' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';
                            

        nuevoIndicador = nuevoIndicador + cabeceraNuevoIndicador + cuerpoNuevoIndicador + piePaginaNuevoIndicador;
  ***REMOVED***
      indicadoresXObjEspecifico.innerHTML = nuevoIndicador;
        for (var j = 0; j < data.length; j++) {
            $("#" + "ocultarGraph_" + data[j].idIndicador).hide();
    ***REMOVED***
***REMOVED***
    else {
      indicadoresXObjEspecifico.innerHTML = "No hay indicadores para mostrar.";
***REMOVED***

    
    var liObjEspecifico = document.getElementById('liobjEspecificosPorObjGeneral' + idEje + '_' + idObjetivoEstrategico + '_' + idObjetivoEspecifico);
    if (liObjEspecifico.getAttribute("class") == "accordion-item") {
      liObjEspecifico.setAttribute("class", "accordion-item active");
      indicadoresXObjEspecifico.style.display = "block";
***REMOVED***
    else {
      liObjEspecifico.setAttribute("class", "accordion-item");
      indicadoresXObjEspecifico.style.display = "none";
***REMOVED***


   

  ***REMOVED***).fail(function (handleError) {
    // Some function

  ***REMOVED***);
***REMOVED***

function ObtenerCodigoUnidadGrafica(unidadEscalaGrafica) {
  if (unidadEscalaGrafica == "%") return "00";
  else if (unidadEscalaGrafica == "Índice") return "01";
  else if (unidadEscalaGrafica == "Q") return "02";
  else if (unidadEscalaGrafica == "Tasa") return "03";
  else if (unidadEscalaGrafica == "Razón") return "04";
  else if (unidadEscalaGrafica == "Kva/año") return "05";
  else if (unidadEscalaGrafica == "Horas") return "06";
  else if (unidadEscalaGrafica == "Años") return "07";
  else return "";
***REMOVED***

function ObtenerUnidadGrafica(codigoEscalaGrafica) {
  if (codigoEscalaGrafica == "00") return "%";
  else if (codigoEscalaGrafica == "01") return "Índice";
  else if (codigoEscalaGrafica == "02") return "Q";
  else if (codigoEscalaGrafica == "03") return "Tasa";
  else if (codigoEscalaGrafica == "04") return "Razón";
  else if (codigoEscalaGrafica == "05") return "Kva/año";
  else if (codigoEscalaGrafica == "06") return "Horas";
  else if (codigoEscalaGrafica == "07") return "Años";
  else return "";
***REMOVED***

function ObtenerGraficaAvance(idIndicador, unidadEscalamedicion) {
  unidadEscalamedicion = ObtenerUnidadGrafica(unidadEscalamedicion);
  //if (unidadEscalamedicion == "00") unidadEscalamedicion = "%";
  //if (unidadEscalamedicion == "Índice") unidadEscalamedicion = "";
  //if (unidadEscalamedicion == "Q") unidadEscalamedicion = "";
  //if (unidadEscalamedicion == "Tasa") unidadEscalamedicion = "";
  //if (unidadEscalamedicion == "Razón") unidadEscalamedicion = "";
  $.ajax({
    contentType: "application/json; charset=utf-8",
    type: "GET",
    url: "api/servicioshome/GetHistoricoAvanceIndicador",
    data: {
      idIndicador: idIndicador,
***REMOVED***
  ***REMOVED***).done(function (data) {

    //console.log(data);

      if (data.avancesIndicador != null) {
          $("#" + "verGraph_" + idIndicador).hide();
        $("#" + "ocultarGraph_" + idIndicador).show();
        loadLinePlotAvanceAnio(data.avancesIndicador, "divGraphAvance_" + idIndicador, unidadEscalamedicion);
***REMOVED***

  ***REMOVED***).fail(function (handleError) {
    // Some function

  ***REMOVED***);
***REMOVED***

function OcultarGraficaAvance(idIndicador) {
    $("#" + "divGraphAvance_" + idIndicador).empty();
    $("#" + "verGraph_" + idIndicador).show();
    $("#" + "ocultarGraph_" + idIndicador).hide();
***REMOVED***

function loadLinePlotAvanceAnio(objData, divContenedor, unidadMedida) {
  $("#" + divContenedor).empty();
  if (objData != undefined && objData != null) {
    new d3plus.LinePlot()
      .select("#" + divContenedor)
      .shapeConfig({
        Line: {
          strokeWidth: 3,
          curve: "catmullRom"
    ***REMOVED***
  ***REMOVED***)
      .config({

        data: objData,
        groupBy: "labelGroup",
        x: "label",
        y: "rawValueDouble",
        tooltipConfig: {
          title: function (d) {
            return d["labelGroup"];
        ***REMOVED***
          tbody: [
            ["Avance [" + unidadMedida + "]", function (d) { return ConvertirNumeroNotacionPais('es-PY', d["rawValueDouble"], 2) ***REMOVED***] //d["rawValueDouble"].formatMoney(2, '.', ',').toString()
          ]
      ***REMOVED***
        lineMarkers: true,
        lineMarkerConfig: {
          r: 3
      ***REMOVED***
        yConfig: {
          title: "Avance [" + unidadMedida+"]",
          //scale: "sqrt"
          tickFormat: function (d) {
            return ConvertirNumeroNotacionPais('es-PY', d, 2);
      ***REMOVED***
      ***REMOVED***
        // lineLabels: true
        legend: false
  ***REMOVED***)
      //.height(400)
      .render();
  ***REMOVED***
***REMOVED***

//listado entidades que aportan al objetivo
function getEntidadesXIdObjetivoEspecifico(idEje, idObjetivoEspecifico) {
    var id = 0;
    var id_eje = 0;
    if (idObjetivoEspecifico != undefined && idObjetivoEspecifico != "") {
        id = parseInt(idObjetivoEspecifico);
***REMOVED***
    if (idEje != undefined && idEje != "") {
        id_eje = parseInt(idEje);
***REMOVED***
    $("#divRecAporteByEntidad").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        type: "GET",
        url: "api/servicioshome/GetConsolidadoEntidadesByObjEspecifico",
        data: {

            id_eje: id_eje,
            id: id,
    ***REMOVED***
***REMOVED***).done(function (data) {

        if (data.entidades != null) {
            var str_entidad = "";
            for (var i = 0; i < data.entidades.length; i++) {
                str_entidad += '<span class="lblEntidadesAportantes">' + data.entidades[i].labelGroup + '</span></br>';
        ***REMOVED***
            $("#divRecAporteByEntidad").html(str_entidad);
    ***REMOVED***

***REMOVED***).fail(function (handleError) {
        // Some function

***REMOVED***);

***REMOVED***	 

//-------------------------------------
//graficoTreemapRecursosxNiveles
function assignColor(idEje) {
    var colores_default = ["#b1861b", "#24539f", "#c8703c", "#429670"];
    var colores = [{ id: 1, color: "#b1861b" ***REMOVED***, { id: 2, color: "#24539f" ***REMOVED***, { id: 3, color: "#c8703c" ***REMOVED***, { id: 4, color: "#429670" ***REMOVED***];
    var filtered = colores.filter(function (elem) {
        //return false for the element that matches both the name and the id
        return (elem.id == idEje)
***REMOVED***);
    if (filtered.length > 0) {
        return filtered[0].color;
***REMOVED*** else {
        return "#d6d6d6";
***REMOVED*** 

***REMOVED***


function GetRecursosPorObjeto() {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/servicioshome/GetRecursosPerPlan",
        type: "GET"

***REMOVED***).done(function (data) {
        if (data.recursosPerObjeto != null) {
            globales = data.recursosPerObjeto;

            //filtro ejes-----
            var ejes_estrategicos = getFiltrosPerObjeto(globales, "ejes");
            createFiltersEjes(ejes_estrategicos);
            //----------------
            $("#divGraphRecursosObj").empty();
            loadRecursosPorObjeto(data.recursosPerObjeto,1);
           
    ***REMOVED***


***REMOVED***).fail(function (handleError) {
        // Some function

***REMOVED***);
***REMOVED***


$('#btnLimpiar').click(function () {

    limpiarFiltrosGrafico();
***REMOVED***);

function limpiarFiltrosGrafico() {
    $("#filter_ejes").val("");

    $("#filter_obj_estrateg").val("");
    $("#filter_obj_estrateg").prop("disabled", true);

    $("#filter_obj_especific").val("");
    $("#filter_obj_especific").prop("disabled", true);

    $("#filter_entidades").val("");
    $("#filter_entidades").prop("disabled", true);

    $("#selectEstrategicos").prop("class", "selectDis");
    $("#selectEspecificos").prop("class", "selectDis");
    $("#selectEntidades").prop("class", "selectDis");
    $("#selectEjes").prop("class", "selectBlue");


    $("#btnback").hide();

    //----------------
    var data = globales;
    $("#divGraphRecursosObj").empty();
    loadRecursosPorObjeto(data, 1);

***REMOVED***

function createFiltersEjes(data) {
    var select = "";
    select = select + '<option value="">Todos los ejes</option>';
    for (var i = 0; i < data.length; i++) {
        select = select + '<option value="' + data[i] + '">' + data[i] + '</option>';
***REMOVED***
    $('#filter_ejes').html(select).fadeIn();
    $("#filter_ejes").prop("disabled", false);
    $("#filter_obj_estrateg").prop("disabled", true);
    $("#filter_obj_especific").prop("disabled", true);
    $("#filter_entidades").prop("disabled", true);

***REMOVED***

function filtrarEstrategByNull() {
    var eje = $("#filter_ejes").val();

    $("#filter_obj_especific").val("");
    $("#filter_obj_especific").prop("disabled", true);

    $("#filter_entidades").val("");
    $("#filter_entidades").prop("disabled", true);


    $("#selectEspecificos").prop("class", "selectDis");
    $("#selectEntidades").prop("class", "selectDis");


    if (eje == "") {
        var data = globales;
        $("#divGraphRecursosObj").empty();
        loadRecursosPorObjeto(data, 1);

***REMOVED*** else {
        var data = filtrarByNivel1(globales, eje);
        $("#divGraphRecursosObj").empty();
        loadRecursosPorObjeto(data, 2);

***REMOVED***


***REMOVED***
function filtrarEspecificoByNull() {
    var eje = $("#filter_ejes").val();
    var obj_estrateg = $("#filter_obj_estrateg").val();


    $("#filter_entidades").val("");
    $("#filter_entidades").prop("disabled", true);

    $("#selectEntidades").prop("class", "selectDis");

    if (obj_estrateg == "") {
        if (eje == "") {
            var data = globales;
            $("#divGraphRecursosObj").empty();
            loadRecursosPorObjeto(data, 1);

    ***REMOVED*** else {
            var data = filtrarByNivel1(globales, eje);
            $("#divGraphRecursosObj").empty();
            loadRecursosPorObjeto(data, 2);

    ***REMOVED***



***REMOVED*** else {
        var data = filtrarByNivel2(globales, eje, obj_estrateg);
        $("#divGraphRecursosObj").empty();
        loadRecursosPorObjeto(data, 3);

***REMOVED***

***REMOVED***

function filtrarEntidadesByNull() {
    var eje = $("#filter_ejes").val();
    var obj_estrateg = $("#filter_obj_estrateg").val();
    var obj_especific = $("#filter_obj_especific").val();

    if (obj_especific != "") {
        var data = filtrarByNivel3(globales, eje, obj_estrateg, obj_especific);
        $("#divGraphRecursosObj").empty();
        loadRecursosPorObjeto(data, 4);
***REMOVED*** else {
        //filtrar x obj estrategico
        if (obj_estrateg == "") {
            if (eje == "") {
                var data = globales;
                $("#divGraphRecursosObj").empty();
                loadRecursosPorObjeto(data, 1);

        ***REMOVED*** else {
                var data = filtrarByNivel1(globales, eje);
                $("#divGraphRecursosObj").empty();
                loadRecursosPorObjeto(data, 2);

        ***REMOVED***
    ***REMOVED*** else {
            var data = filtrarByNivel2(globales, eje, obj_estrateg);
            $("#divGraphRecursosObj").empty();
            loadRecursosPorObjeto(data, 3);

    ***REMOVED***

***REMOVED***

***REMOVED***

$("#filter_ejes").on("change", function (event) {
    var selected = $(this).val();
    if (selected == "") {
        $("#filter_obj_estrateg").val("");
        $("#filter_obj_estrateg").prop("disabled", true);

        $("#filter_obj_especific").val("");    
        $("#filter_obj_especific").prop("disabled", true);

        $("#filter_entidades").val("");
        $("#filter_entidades").prop("disabled", true);


        $("#selectEstrategicos").prop("class", "selectDis");
        $("#selectEspecificos").prop("class", "selectDis");
        $("#selectEntidades").prop("class", "selectDis");


        //carga toda la data
        var data = globales;
        $("#divGraphRecursosObj").empty();
        loadRecursosPorObjeto(data, 1);

        $("#btnback").hide();
***REMOVED***
    else {
        var data = filtrarByNivel1(globales, selected);
        $("#divGraphRecursosObj").empty();
        //loadRecursosPorObjetoByNivel1(data);
        loadRecursosPorObjeto(data, 2);
        createFiltroEstrategico(data);

        //get data filtrada
        $("#btnback").show();
        $(".d3plus-viz-back").hide();
        

***REMOVED***
***REMOVED***);


$('#btnback').click(function () {
    $(".d3plus-viz-back").hide();
    var eje = $("#filter_ejes").val();
    var obj_estrateg = $("#filter_obj_estrateg").val();
    var obj_especifico = $("#filter_obj_especific").val();
    var entidades = $("#filter_entidades").val();
    if (obj_estrateg == "" && obj_especifico == "" && entidades == "") {
        limpiarFiltrosGrafico();
***REMOVED***

    if (eje != "" && obj_estrateg != "" && obj_especifico == "" && entidades == "") {
        filtrarEstrategByNull();
        $("#filter_obj_estrateg").val("");
***REMOVED***

    if (eje != "" && obj_estrateg != "" && obj_especifico != "" && entidades == "") {
        filtrarEspecificoByNull();
        $("#filter_obj_especific").val("");
***REMOVED***

    if (eje != "" && obj_estrateg != "" && obj_especifico != "" && entidades != "") {
        filtrarEntidadesByNull();
        $("#filter_entidades").val("");
***REMOVED***

***REMOVED***);


$("#filter_obj_estrateg").on("change", function (event) {
    var selected = $(this).val();
    var eje = $("#filter_ejes").val();
    if (selected == "") {
        filtrarEstrategByNull();
***REMOVED***
    else {
        //filtrar data
        var data = filtrarByNivel2(globales, eje, selected);

        $("#divGraphRecursosObj").empty();

        loadRecursosPorObjeto(data,3);
        createFiltroEspecifico(data);

        $("#btnback").show();
        $(".d3plus-viz-back").hide();

***REMOVED***
***REMOVED***);

$("#filter_obj_especific").on("change", function (event) {
    var selected = $(this).val();
    var eje = $("#filter_ejes").val();
    var obj_estrateg = $("#filter_obj_estrateg").val();


    if (selected == "") {
        filtrarEspecificoByNull();
***REMOVED***
    else {
        var data = filtrarByNivel3(globales, eje, obj_estrateg, selected);

        $("#divGraphRecursosObj").empty();
        loadRecursosPorObjeto(data, 4);

        createFiltroEntidad(data);

        $("#btnback").show();
        $(".d3plus-viz-back").hide();
***REMOVED***
***REMOVED***);

$("#filter_entidades").on("change", function (event) {
    var selected = $(this).val();
    var eje = $("#filter_ejes").val();
    var obj_estrateg = $("#filter_obj_estrateg").val();
    var obj_especific = $("#filter_obj_especific").val();

    if (selected == "") {
        filtrarEntidadesByNull();
***REMOVED***
    else {

        var data = filtrarByNivel4(globales,eje, obj_estrateg, obj_especific, selected);
        $("#divGraphRecursosObj").empty();
        loadRecursosPorObjeto(data, 4);

        $("#btnback").show();
        $(".d3plus-viz-back").hide();
***REMOVED***
***REMOVED***);

function createFiltroEstrategico(data) {

    var obj_estrategicos = getFiltrosPerObjeto(data, "estrategicos");

    var select = "";
    select = select + '<option value="">Todos los objetivos</option>';
    for (var i = 0; i < obj_estrategicos.length; i++) {
        select = select + '<option value="' + obj_estrategicos[i] + '">' + obj_estrategicos[i] + '</option>';
***REMOVED***
    $('#filter_obj_estrateg').html(select).fadeIn();
    $("#selectEstrategicos").prop("class", "selectBlue");
    $("#filter_obj_estrateg").prop("disabled", false);

***REMOVED***

function createFiltroEspecifico(data) {
    $("#filter_obj_estrateg").prop("disabled", false);
    $("#selectEstrategicos").prop("class", "selectBlue");
    var objetivos = getFiltrosPerObjeto(data, "especificos");

    var select = "";
    select = select + '<option value="">Todos los objetivos</option>';
    for (var i = 0; i < objetivos.length; i++) {
        select = select + '<option value="' + objetivos[i] + '">' + objetivos[i] + '</option>';
***REMOVED***
    $('#filter_obj_especific').html(select).fadeIn();
    $("#selectEspecificos").prop("class", "selectBlue");
    $("#filter_obj_especific").prop("disabled", false);

***REMOVED***

function createFiltroEntidad(data) {
    $("#filter_entidades").prop("disabled", false);
    $("#selectEntidades").prop("class", "selectBlue");
    var entidades = getFiltrosPerObjeto(data, "entidades");

    var select = "";
    select = select + '<option value="">Todas las entidades</option>';
    for (var i = 0; i < entidades.length; i++) {
        select = select + '<option value="' + entidades[i] + '">' + entidades[i] + '</option>';
***REMOVED***
    $('#filter_entidades').html(select).fadeIn();
    $("#filter_entidades").prop("disabled", false);

***REMOVED***

function filtrarByNivel1(data, eje) {
    var filtrados = jQuery.grep(data, function (n, i) {
        return (n.labelGroup.toUpperCase() == eje.toString().toUpperCase());
***REMOVED***);
    return filtrados;
***REMOVED***

function filtrarByNivel2(data, eje, estrategico) {
    var filtrados = jQuery.grep(data, function (n, i) {
        return (n.labelGroup.toUpperCase() == eje.toString().toUpperCase() && n.label.toUpperCase() == estrategico.toString().toUpperCase());
***REMOVED***);
    return filtrados;
***REMOVED***

function filtrarByNivel3(data, eje, estrategico,especifico) {
    var filtrados = jQuery.grep(data, function (n, i) {
        return (n.labelGroup.toUpperCase() == eje.toString().toUpperCase()
            && n.label.toUpperCase() == estrategico.toString().toUpperCase()
            && n.label_inf.toUpperCase() == especifico.toString().toUpperCase()
        );
***REMOVED***);
    return filtrados;

***REMOVED***

function filtrarByNivel4(data, eje, estrategico, especifico,entidad) {
    var filtrados = jQuery.grep(data, function (n, i) {
        return (n.labelGroup.toUpperCase() == eje.toString().toUpperCase()
            && n.label.toUpperCase() == estrategico.toString().toUpperCase()
            && n.label_inf.toUpperCase() == especifico.toString().toUpperCase()
            && n.label_nivel4.toUpperCase() == entidad.toString().toUpperCase()
        );
***REMOVED***);
    return filtrados;

***REMOVED***


function getFiltrosPerObjeto(data, variable) {
    var filtrados = data;
    switch (variable) {
        case "ejes":
            filtrados = $.unique(data.map(function (d) { return d.labelGroup; ***REMOVED***));
            break;
        case "estrategicos":
            filtrados = $.unique(data.map(function (d) { return d.label; ***REMOVED***));
            break;
        case "especificos":
            filtrados = $.unique(data.map(function (d) { return d.label_inf; ***REMOVED***));
            break;
        case "entidades":
            filtrados = $.unique(data.map(function (d) { return d.label_nivel4; ***REMOVED***));
            break;
        default:
            filtrados = $.unique(data.map(function (d) { return d.labelGroup; ***REMOVED***));
            break;
***REMOVED***
    
    return filtrados;
***REMOVED***

function loadRecursosPorObjeto(objData,nivel) {
    if (objData != undefined && objData != null) {
        var grafica = new d3plus.Treemap()
            .select("#divGraphRecursosObj")
            .data(objData)
            .groupBy(["rawValue_asoc", "labelGroup", "label", "label_inf", "label_nivel4"])
            .shapeConfig({
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
            ***REMOVED***
                ,fill: function (d, index) {
                    return assignColor(d.rawValue_asoc);
            ***REMOVED***
        ***REMOVED***)
            .on("click", function (d) {
                $("#btnback").hide();
                $(".d3plus-viz-back").hide();
                var current = grafica.depth();
                var selected = "";
                $("#divGraphRecursosObj").attr("nivel", current.toString());
                console.log("nivel " + nivel + " || depth" + current);
                

                if (current == 2) {
                    selected = d.labelGroup;
                    $("#filter_ejes").val(selected);

                    var data = filtrarByNivel1(globales, selected);
                    createFiltroEstrategico(data);
                  
                     $("#btnback").show();

            ***REMOVED*** else if (current == 3) {
                    selected = d.label;
                    $("#filter_obj_estrateg").val(selected);
                    var eje = $("#filter_ejes").val();

                    var data = filtrarByNivel2(globales, eje, selected);
                    createFiltroEspecifico(data);
                    
                    $("#btnback").show();
                    
            ***REMOVED*** else if (current == 4) {
                    
                    var eje = $("#filter_ejes").val();
                    var obj_estrateg = $("#filter_obj_estrateg").val();
                    var obj_especific = $("#filter_obj_especific").val();

                    if (obj_especific == "") {
                        //clic sobre obj especifico
                        selected = d.label_inf;
                        $("#filter_obj_especific").val(selected);
                        var data = filtrarByNivel3(globales, eje, obj_estrateg, selected);
                        createFiltroEntidad(data);
                ***REMOVED*** else {
                        //clic sobre entidad
                        selected = d.label_nivel4;
                        var data = filtrarByNivel3(globales, eje, obj_estrateg, obj_especific);
                        createFiltroEntidad(data);
                        $("#filter_entidades").val(selected);
                        var data_grafico = filtrarByNivel4(globales, eje, obj_estrateg, obj_especific, selected);
                        $("#divGraphRecursosObj").empty();
                        loadRecursosPorObjeto(data_grafico, 4);

                       
 
                ***REMOVED***

                    $("#btnback").show();

            ***REMOVED***else {
                    selected = "";
            ***REMOVED***

                $(".d3plus-viz-back").click(function () {
                    
                    var depth_aux = grafica.depth();
                    console.log("btn_atras|| nivel " + nivel + " || depth" + depth_aux);
                    $("#divGraphRecursosObj").attr("nivel", depth_aux.toString());
                    var val_ejes = $("#filter_ejes").val();
                    var val_obj_estrategicos = $("#filter_obj_estrateg").val();
                    var val_obj_especificos = $("#filter_obj_especific").val();


                    if (depth_aux == nivel) {
                        $("#divGraphRecursosObj").empty();
                        if (val_ejes != "") {
                            limpiarFiltrosGrafico();
                    ***REMOVED***
                        else {
                            loadRecursosPorObjeto(globales, 1);
                    ***REMOVED***
                ***REMOVED*** 
                    if (depth_aux == 2) {
                        $("#filter_obj_estrateg").val("");
                        filtrarEstrategByNull();
                        $("#btnback").show();
                ***REMOVED***
                    if (depth_aux == 3) {
                        $("#filter_obj_especific").val("");
                        filtrarEspecificoByNull();
                        $("#btnback").show();
                ***REMOVED***
            ***REMOVED***);




        ***REMOVED***)
            .translate(function (d) {
                var traduc_aux = d;
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
            ***REMOVED*** else if (d === "Click to Expand") {
                    traduc_aux = "Clic para Expandir";
            ***REMOVED*** else {
                    traduc_aux = d;
            ***REMOVED***
                return traduc_aux;
        ***REMOVED***)
            .config({
                tooltipConfig: {
                    title: function (d) {
                        var depth_aux = grafica.depth();
                        var longitud = 80;
                        var cad = d.labelGroup;
                        switch (depth_aux) {
                            case 1:
                                cad = "Eje " + " " + d.labelGroup;
                                break;
                            case 2:
                                cad = d.label;
                                break;
                            case 3:
                                cad = d.label_inf;
                                break;
                            case 4:
                                cad = d.label_nivel4;
                                break;
                            default:
                                cad = d.labelGroup;
                    ***REMOVED***

                        return cad;
                  ***REMOVED***
                    tbody: [
                        [function (d) {
                            var valor = d["rawValueDouble"] / 1000000;
                            var cad = "";
                            if (Array.isArray(d.label)) {
                                cad += "<span>Objetivos Estratégicos (" + d.label.length + ")</span></br>";
                        ***REMOVED***
                            if (Array.isArray(d.label_inf)) {
                                cad += "<span>Objetivos Específicos (" + d.label_inf.length + ")</span></br>";
                        ***REMOVED***
                            if (Array.isArray(d.label_nivel4)) {
                                cad += "<span>Entidades que aportan (" + d.label_nivel4.length + ")</span></br>";
                        ***REMOVED***
                            cad += "<span>Recursos asignados PGN 2022 " + "₲ " + valor.formatMoney(0, ',', '.').toString() + " Millones" + "</span></br>";
                            cad += "<span>Recursos ejecutados 0%</span>";
                            return cad;
                    ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: "",
            ***REMOVED***
        ***REMOVED***)
            .sum("rawValueDouble")
            .depth(nivel)
            .legend(false)
            .render();
       
***REMOVED***
    
***REMOVED***





function recortarNombre(nombre, longitud) {
    var aux = nombre;
    if (nombre != undefined && nombre != null) {
        if (nombre.length > longitud) {
            aux = nombre.substr(0, longitud) + "...";
    ***REMOVED***
***REMOVED***

    return aux;
***REMOVED***
//-------------------------------------------------
Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
***REMOVED***;

Number.prototype.formatDecimal = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
***REMOVED***;

function ConvertirNumeroNotacionPais (localCulture, n, d) {
  //  var locales = [
  //  'es-PY',	  // Paraguay
  //   //undefined, // Your own browser
  //];
  var opts = { minimumFractionDigits: d ***REMOVED***;
  return n.toLocaleString(localCulture, opts);
***REMOVED***;
