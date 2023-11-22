var cant_contratos = 5;
getAnnios();
inicializaDatos();
var pestaniaSeleccionada = 1;
var scrol = 0;
var pagina_Actual = 0;
var globales = [];
function seleccionoAnio(sel) {
    var anioEntidad = sel.options[sel.selectedIndex].text;
    GetDatosPorAnnio(anioEntidad);
    getProgramasByEntidad(anioEntidad);
    $("#lblValorAsignacionPrograma").html("");
    $("#loadingAsignacion").hide();
    $("#lblEncabezadoListadoGrupos").hide();
    scrol = 0;
    //--------------------------------
    GetRecursosPorGrupo(anioEntidad);
    //----------------------------------
    getContratos($("#annioEntidad option:selected").val(), 1, cant_contratos, $("#top_contratos_estados option:selected").val(), $("#entidad").val(), $('#procesoo').val(), $("#top_origen_informacion option:selected").val());
***REMOVED***


function inicializaDatos() {
    $("#divSectionONCAE").hide();

    var selectAnio = document.getElementById("annioEntidad");
    var anioEntidad = selectAnio.options[selectAnio.selectedIndex].text;
    $("#lblValorAsignacionPrograma").html("");
    $("#loadingAsignacion").hide();
    $("#lblEncabezadoListadoGrupos").hide();

    GetDatosPorAnnio(anioEntidad);
    getProgramasByEntidad(anioEntidad);
    //--------------------------------
    GetRecursosPorGrupo(anioEntidad);
    //----------------------------------
    configuraSelectTabContratos();
    scrol = 0;
    getContratos($("#annioEntidad option:selected").val(), 1, cant_contratos, $("#top_contratos_estados option:selected").val(), $("#entidad").val(), $('#procesoo').val(), $("#top_origen_informacion option:selected").val());
***REMOVED***

function configuraSelectTabContratos() {
    $('.enlace_tipo_contrato').on('click', function () {
        var tipo = this.id;
        if (tipo == "liSEFIN") {
            $("#divSectionONCAE").hide();
            $("#divSectionSefin").show();
    ***REMOVED*** else {
            $("#divSectionONCAE").show();
            $("#divSectionSefin").hide();
    ***REMOVED***
***REMOVED***);


***REMOVED***

function GetDatosPorAnnio(anio) {
    var codigoEntidad = $("#codigoEntidadId").val();
    var anioEntidad = anio;
    var moneda = 'L ';
  $.ajax({
      url: "api/serviciosentidad/GetDatosEntidadPorAnnio/",
    type: "GET",
    data: {
      anio: anioEntidad,
      codEntidad: codigoEntidad
  ***REMOVED***

  ***REMOVED***).done(function (data) {

      var existeOncae = 0;
      var existeSefin = 0;
      for (var i = 0; i < data.dataContratos.length; i++) {

          if (data.dataContratos[i].origenInformacion.toUpperCase().includes('ONCAE')) {
              if (existeOncae == 0) { $('#dataONCAE').empty(); existeOncae +=1;***REMOVED***
              var html = '<div class="col-md-4">'
                  + '<div class="h6">' + data.dataContratos[i].origenInformacion.replace("Oncae - ", "").replace("ONCAE - ", "").replace("Catalogo Electrónico", "Catálogo Electrónico") + '</div>'
                  + '    <div class="h4">' + (data.dataContratos[i].numContratos).formatMoney(0, '.', ',').toString()  + '</div>'
                  + '    <div class="h6">Valor</div>'
                  + '    <div class="h4">' + data.dataContratos[i].monedaContrato + ' ' + (data.dataContratos[i].valorTotalContratos * 1 / 1000000).formatMoney(1, '.', ',').toString() + ' Millones' + '</div>'
                  + '</div>';
              $('#dataONCAE').append(html);
      ***REMOVED***

          if (data.dataContratos[i].origenInformacion.toUpperCase().includes('SEFIN')) {
              if (existeSefin == 0) { $('#dataSEFIN').empty(); existeSefin += 1; ***REMOVED***
              var html = ''
                  + '<div class="h6">' + data.dataContratos[i].origenInformacion.toUpperCase() + ' - Órdenes de Pago</div>'
                  + '    <div class="h4">' + (data.dataContratos[i].numContratos).formatMoney(0, '.', ',').toString() + '</div>'
                  + '    <div class="h6">Valor</div>'
                  + '    <div class="h4">' + data.dataContratos[i].monedaContrato + ' ' + (data.dataContratos[i].valorTotalContratos * 1 / 1000000).formatMoney(1, '.', ',').toString() + ' Millones' + '</div>'
                  + ''
              $('#dataSEFIN').append(html);
      ***REMOVED***
  ***REMOVED***
    
      var PresupuestoInicial = document.getElementById("PresupuestoInicial");
      if (data.presupuestoInicial == null) { PresupuestoInicial.innerHTML = '- -';***REMOVED***
      else {
        PresupuestoInicial.innerHTML = moneda + (data.presupuestoInicial/1000000).formatMoney(1, '.', ',').toString() + ' Millones';
  ***REMOVED***
      var PresupuestoVigente = document.getElementById("PresupuestoVigente");
      if (data.presupuestoVigente == null) { PresupuestoVigente.innerHTML = '- -'; ***REMOVED***
      else {
          PresupuestoVigente.innerHTML = moneda + (data.presupuestoVigente /1000000).formatMoney(1, '.', ',').toString() + ' Millones';
  ***REMOVED***
      var PresupuestoEjecutado = document.getElementById("PresupuestoEjecutado");
      if (data.presupuestoEjecutado == null) { PresupuestoEjecutado.innerHTML = '- -'; ***REMOVED***
      else {
          PresupuestoEjecutado.innerHTML = moneda + (data.presupuestoEjecutado /1000000).formatMoney(1, '.', ',').toString() + ' Millones';
  ***REMOVED***

  ***REMOVED***).fail(function (handleError) {
    // Some function

  ***REMOVED***);

***REMOVED***

function getAnnios() {
    var actual = new Date().getFullYear();  
    var limite = actual - 3;
    var select = "";
    for (var i = actual; i >= limite; i--) {
        if (i == actual) {
            select += '<option value="' + i.toString() + '" selected>' + i.toString() + '</option>';
    ***REMOVED*** else {
            select += '<option value="' + i.toString() + '">' + i.toString() + '</option>';
    ***REMOVED***
       
***REMOVED***

    $("#annioEntidad").html(select);
***REMOVED***

var disableClick = false;
function deshabilita(des) {
    disableClick = des;
    if (des) {
        $("#btn-buscar").prop("disabled", des);
        $('#btnLimpiar').attr("disabled", "disabled")
***REMOVED*** else {
        $("#btn-buscar").prop("disabled", des);
        $('#btnLimpiar').removeAttr("disabled")
***REMOVED***
***REMOVED***


function GetRecursosPorGrupo(anyo) {
    var codigoEntidad = $("#codigoEntidadId").val();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/serviciosentidad/GetRecursosPerGrupos",
        type: "GET",
        data: {
            anyo: anyo,
            codEntidad: codigoEntidad
    ***REMOVED***
***REMOVED***).done(function (data) {
        if (data.infoRecursos != null) {
            globales = data.infoRecursos;
            $("#divGraphRecursosObj").empty();
            $("#totalPresupuestoValue").html("L " + ((data.totalPresupuesto) / 1000000).formatMoney(1, '.', ',').toString() + " Millones");
            loadRecursosPorObjetoNivel(data.infoRecursos, 0);
    ***REMOVED***
***REMOVED***).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);

***REMOVED***

function loadRecursosPorObjetoNivel(objData, nivel) {
    if (objData != undefined && objData != null) {

        var distintos = objData.map(item => item.labelGroup)
            .filter((value, index, self) => self.indexOf(value) === index);
        var grafica = new d3plus.Treemap()
            .select("#divGraphRecursosObj")

            .shapeConfig({
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
            ***REMOVED***
                , fill: function (d, index) {

                    var index = distintos.indexOf(d.labelGroup);
                    return assignColor(index);

            ***REMOVED***
        ***REMOVED***)
            .on("click", function (d) {
                var current = grafica.depth();
                $(".d3plus-viz-back").click(function () {
                    var depth_aux = grafica.depth();
                    console.log("btn_atras|| nivel " + nivel + " || depth" + depth_aux);
                    $("#divGraphRecursosObj").attr("nivel", depth_aux.toString());
                    if (depth_aux == nivel) {
                        $("#divGraphRecursosObj").empty();
                        loadRecursosPorObjetoNivel(globales, 0);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***)
            .translate(function (d) {
                var traduc_aux = d;
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
            ***REMOVED*** else if (d === "Click to Expand") {
                    traduc_aux = "Clic para Expandir";
            ***REMOVED*** else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
            ***REMOVED*** else {
                    traduc_aux = d;
            ***REMOVED***
                return traduc_aux;
        ***REMOVED***)
            .config({
                data: objData,
                groupBy: ["labelGroup", "label"],
                tooltipConfig: {
                    title: function (d) {
                        var depth_aux = grafica.depth();
                        var longitud = 80;
                        var cad = d.labelGroup;
                        switch (depth_aux) {
                            case 1:
                                cad = "Objeto de Gasto: " + d.label;
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
                            cad += "<span>Recursos asignados " + "L " + valor.formatMoney(1, '.', ',').toString() + " Millones" + "</span></br>";
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

//graficoTreemapRecursosxNiveles
function assignColor(indice) {
    var colores_default = ['#89CFE0', '#276D7E', '#FDD36A', '#FBC99A', '#F7B6A7', '#57BEC3','#ED6A60', '#F6B5C4', '#42B073', '#89CFE0', '#276D7E', '#FDD36A'];
    return colores_default[indice];
***REMOVED***

function getProgramasByEntidad(annio) {
    var codigoEntidad = $("#codigoEntidadId").val();
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            url: "api/serviciosentidad/GetProgramasByEntidad",
            type: "GET",
            data: {
                annio: annio,
                codEntidad: codigoEntidad
        ***REMOVED***

    ***REMOVED***).done(function (data) {
            var result = data.infoProgramas;
            pintaProgramas(result);
            
    ***REMOVED***).fail(function (handleError) {
            // Some function
            console.log(handleError);
    ***REMOVED***);


***REMOVED***

function pintaProgramas(data) {
    if (data.length > 0) {
        var str_cad = "";
        str_cad += '<div class="row">';
        str_cad += '<div class="col-md-12">';
        str_cad += '<div class="ProgramCards">';
        str_cad += '<div class="card h-100">';
        str_cad += '<p>Seleccione un Programa</p>';
        str_cad += '<div class="content-select">';
        str_cad += '<select id="selectProgramas">';
        for (var i = 0; i < data.length; i++) {
            str_cad += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
    ***REMOVED***
        str_cad += '</select>';
        str_cad += '<i></i>';
        str_cad += '</div>';
        str_cad += '</div>';
        str_cad += '</div>';
        str_cad += '</div>';
        str_cad += '</div>';
        $("#divProgramas").html(str_cad);

        configuraSelectProgramas();

        if ($("#selectProgramas").length > 0) {
            $('#selectProgramas').removeAttr('selected').find('option:first').prop('selected', true).trigger('change');
            
    ***REMOVED***
        

***REMOVED***
***REMOVED***

function configuraSelectProgramas() {
    $('#selectProgramas').on('change', function () {
        var prog_actual = this.value;
        consultaInfograficoPerPrograma(prog_actual,true);
***REMOVED***);

***REMOVED***

function consultaInfograficoPerPrograma(prog_actual,bandera) {
    $("#loadingAsignacion").hide();
    $("#lblEncabezadoListadoGrupos").hide();

    var codigoEntidad = $("#codigoEntidadId").val();
    var selectAnio = document.getElementById("annioEntidad");
    var selectEstado = document.getElementById("top_contratos_estados");


    var anioEntidad = $("#annioEntidad option:selected").val();
    var estadoSel = $("#top_contratos_estados option:selected").val();

    var descProceso = $("#proceso").val();
    var programaSel = prog_actual;
    

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/serviciosentidad/GetGastoByPrograma",
        type: "GET",
        data: {
            annio: anioEntidad,
            codEntidad: codigoEntidad,
            codPrograma: programaSel,
            estado: estadoSel,
            proceso: descProceso
    ***REMOVED***

***REMOVED***).done(function (data) {
        var result = data.infograficoEntidad;
        if (result.infoGasto != null && result.infoGasto != undefined) {

            getEstructuraInfografico(result.infoGasto,bandera);
            closeListado();
            
    ***REMOVED***
        
        deshabilita(false);

***REMOVED***).fail(function (handleError) {
        // Some function
        deshabilita(false);
        console.log(handleError);
***REMOVED***);


***REMOVED***

$("#btnLimpiar").click(function () {
    if (!disableClick) {
        $('#top_contratos_estados').removeAttr('selected').find('option:first').prop('selected', true).trigger('change');
        $("#proceso").val("");
        deshabilita(true);
        var prog_actual = $("#selectProgramas option:selected").val();
        consultaInfograficoPerPrograma(prog_actual,true);
***REMOVED***
***REMOVED***);

   $("#btn-buscar").click(function () {
        if (!disableClick) {
            deshabilita(true);
            var prog_actual = $("#selectProgramas option:selected").val();
            consultaInfograficoPerPrograma(prog_actual,false);
    ***REMOVED***

***REMOVED***);


function monedaSimbolo(codigo) {
    var moneda = [];
    moneda["USD"] = "USD$";
    moneda["HND"] = "L";

    return moneda[codigo];
***REMOVED***


function configuraEnlaceContratista() {
    $(".enlace_contratista").click(function () {
        var ruc = $(this).attr('data-parameter');
        var dataValue = $(this).attr('data-parameter'),
            dataType = $(this).attr('data-type').toLowerCase();
        document.cookie = "ruc=" + ruc + ";path=/;";
        var url = "/contratista?" + dataType + "=" + dataValue;
        window.location.href = url;

***REMOVED***);


***REMOVED***

function getEstructuraInfografico(datos,bandera) {
    var i_aux = 0;
    var j_aux = 0;
    var k_aux = 0;
    //var l = 0;
    var total_avance = 0;
    var total_presupuesto = 0;
    var periodo_aux = 0;
    var valor_asignacion_programa = 0;
    var valor_ejecutado_programa = 0;

    var html_str = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
    for (var i = 0; i < datos.length; i++) {
        valor_asignacion_programa += datos[i].presupuesto;
        valor_ejecutado_programa += datos[i].ejecutado;
        var valor_asignacion = datos[i].presupuesto/1;
        var valor_ejecutado = datos[i].ejecutado/1;
        var porcentaje_gasto = ((valor_ejecutado / valor_asignacion) * 100).formatMoney(1, '.', ',').toString() + " %";

        var nomCollapse = "collapseOne_" + i_aux.toString() + "_" + j_aux.toString();
        var nomHeading = "headingOne_" + i_aux.toString() + "_" + j_aux.toString();
        total_avance += datos[i].avance;
        total_presupuesto += datos[i].presupuesto;
        var actividad_nom = datos[i].nombre;
        var vlr_asignado_gasto = monedaSimbolo("HND") + ' ' + (valor_asignacion / 1000000).formatMoney(1, '.', ',').toString() + ' Millones';
        var vlr_ejecutado_gasto = monedaSimbolo("HND") + ' ' + (valor_ejecutado / 1000000).formatMoney(1, '.', ',').toString() + ' Millones';

        if (actividad_nom.split("|").length > 0) {
            actividad_nom = actividad_nom.split("|")[1];
    ***REMOVED***
        if (datos[i].detalles != null) {
            if (datos[i].detalles.length > 0) {
                html_str += '<div class="panel panel-default">';
        ***REMOVED*** else {
                html_str += '<div class="panel panel-default ">';
        ***REMOVED***
            
    ***REMOVED*** else {
            html_str += '<div class="panel panel-default ">';
    ***REMOVED***
        
            html_str += '<div class="panel-heading" role="tab" id="' + nomHeading + '">';
                html_str += '<div class="panel-title">';
                    html_str += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + nomCollapse + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                    html_str += '<div class="head">';
                    //--------------------------------------------------------
                    html_str += '<div class="cotractName">';
                    html_str += '<div class="row">';
                    html_str += '<div class="col-xs-2 col-md-2">';
                    html_str += '<span class="small"></span>';
                    html_str += '<div class="clearfix"></div>';
                    html_str += '<span class="h4">' + actividad_nom  +'</span>';
                    html_str += '</div>';
                    //-----------------------------
                    html_str += '<div class="col-xs-3 col-md-3">';
                    html_str += '<span class="small">Presupuesto Vigente</span>';
                    html_str += '<div class="clearfix"></div>';
                    html_str += '<span class="h4">' + vlr_asignado_gasto + '</span>';
                    html_str += '</div>';
                    //------------------------------
                    html_str += '<div class="col-xs-3 col-md-3">';
                    html_str += '<span class="small">Presupuesto Ejecutado</span>';
                    html_str += '<div class="clearfix"></div>';
                    html_str += '<span class="h4">' + vlr_ejecutado_gasto + '</span>';
                    html_str += '</div>';
                    //-----------------------------
                    html_str += '<div class="col-xs-2 col-md-2">';
                    html_str += '<span class="small">% Ejecución</span>';
                    html_str += '<div class="clearfix"></div>';
                    html_str += '<span class="h4">' + porcentaje_gasto + '</span>';
                    html_str += '</div>';

                    ///----------------------------------

                   html_str += '<div class="col-xs-2 col-md-2">';
                    if (datos[i].detalles.length > 0) {
                        //------------------
                        html_str += '<h6 class="btnPerfil badge bg-light text-dark"><i class="material-icons md-18">info_outline</i> Ver Detalle</h6>';
                        //------------------
                ***REMOVED***
                    html_str += '</div>';

                    //-----------------------------
                    html_str += '</div>';
       
                    html_str += '</div>';
                    //--------------------------------------------------

        

                    html_str += '</div >';
                    html_str += '</a>';  
                html_str += '</div>';
            html_str += '</div>';

        html_str += '<div id = "' + nomCollapse + '" class="panel-collapse collapse nivel1" role = "tabpanel" aria - labelTitledby="' + nomHeading + '" actividad = "' + datos[i].nombre.toUpperCase() + '" >';
        html_str += '<div class="panel-body">';

        //NIVEL 2
        var vec_proceso = datos[i].detalles;
        for (var j = 0; j < vec_proceso.length; j++) {
            var nomNivel2 = "accordion_l2_" + i_aux.toString() + "_" + j_aux.toString();
            var headNivel2 = "headLevel2_" + i_aux.toString() + "_" + j_aux.toString();
            var panelHijo2 = "c2_" + j_aux.toString() + "_" + k_aux.toString();
            var nomHeadLevel3 = "headLevel3_" + j_aux.toString() + "_" + k_aux.toString();
            var proceso_nom = vec_proceso[j].nombre;
            var UrlProceso = vec_proceso[j].urlProceso;

            var estado_contratos_proceso = $("#top_contratos_estados option:selected").val();

            var proceso_id = vec_proceso[j].id;
            if (proceso_nom.split("|").length > 0) {
                proceso_nom = proceso_nom.split("|")[1];
        ***REMOVED***
            var proceso_estado = vec_proceso[j].estado;
            var proceso_valor = "-";
            proceso_valor = monedaSimbolo("HND") + ' ' + (vec_proceso[j].presupuesto).formatMoney(1, '.', ',').toString();

            //if (vec_proceso[j].presupuesto/1000000 < 1) {
            //    proceso_valor = monedaSimbolo("HND") + ' ' + (vec_proceso[j].presupuesto).formatMoney(0, '.', ',').toString();
            //***REMOVED*** else {
            //    proceso_valor = monedaSimbolo("HND") + ' ' + (vec_proceso[j].presupuesto / 1000000).formatMoney(2, '.', ',').toString() + ' Millones';
            //***REMOVED***


            html_str += '<div class="panel-group nivel22" id="' + nomNivel2 + '" role="tablist" aria-multiselectable="true">';
            html_str += '<div class="panel panel-default">';
            //heading
            html_str += '<div class="panel-heading" role="tab" id="' + headNivel2 + '">';
            html_str += '<div class="panel-title">';
            html_str += '<a role = "button" data-toggle="collapse" data-parent="#' + nomNivel2 + '" href = "#' + panelHijo2 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
            html_str += '<div class="head">';
            html_str += '<div class="">';
            html_str += '<span class="labelTit">Proceso: ' + proceso_id + '</span>';
            html_str += '<span class="">' + proceso_nom + '</span>';
            html_str += '</div>';

            html_str += '</div>';
            html_str += '</a>';
            html_str += '</div>';
            html_str += '</div>';
            //body
            html_str += '<div id="' + panelHijo2 + '" class="panel-collapse collapse level3 nivel2" role="tabpanel" aria-labelledby="' + nomHeadLevel3 + '" proceso="' + vec_proceso[j].nombre.toUpperCase() + '">';
            html_str += '<div class="panel-body">';
            //< !--NIVEL 3-- >
            var vec_contratos = vec_proceso[j].detalles;
            for (var k = 0; k < vec_contratos.length; k++) {

                var contrato_nom = vec_contratos[k].nombre;
                var contrato_id = vec_contratos[k].id;
                var monedaContrato = vec_contratos[k].moneda;
                
                var valorPlaneado = (vec_contratos[k].valor_planeado / 1);
                var valorAdjudicado = (vec_contratos[k].valor_adjudicado/1);
                var valorContratado = (vec_contratos[k].valor_contratado/1);
                var contratista = (vec_contratos[k].contratista);
                var codProveedor = (vec_contratos[k].proveedor);

                var valor_adjudicado_aux = monedaSimbolo("HND") + ' ' + (valorAdjudicado).formatMoney(1, '.', ',').toString();

                if (contrato_nom.split("|").length > 0) {
                    contrato_nom = contrato_nom.split("|")[1];
            ***REMOVED***

                var nomNivel3 = "accordion_l3_" + j_aux.toString() + "_" + k_aux.toString();
                var nomCnivel3 = "c3_" + j_aux.toString() + "_" + k_aux.toString();

                html_str += '<div class="panel-group nivel33" id="' + nomNivel3 + '" role="tablist" aria-multiselectable="true">';
                html_str += '<div class="panel panel-default">';
                html_str += '<div class="panel-body">';
                html_str += '<div class="wrap-head-process">';
                html_str += '<div class="contractData">';
                html_str += '<div class="row border-b">';
                html_str += '<div class="col-xs-12 col-md-4">';
                html_str += '<span class="txt_small">';
                html_str += 'ESTADO';
                html_str += '</span>';
                html_str += '<span class="amount_adj">' + proceso_estado;
                html_str += '</span>';
                html_str += '</div>';
                html_str += '<div class="col-xs-12 col-md-4">';
                html_str += '<span class="txt_small"> VALOR ADJUDICADO';
                html_str += '</span>';
                html_str += '<span class="amount_adj">' + valor_adjudicado_aux;
                html_str += '</span>';
                html_str += '</div>';
                html_str += '</div>';
                html_str += '<div class="row border-b">';
                html_str += '</div>';
                html_str += '</div>';
                html_str += '</div>';
                html_str += '<div class="clearfix">';
                html_str += '</div>';
                //if (estado_contratos_proceso != "" && estado_contratos_proceso != undefined) {
                //    html_str += '<span class="h6">Contratos asociados a este proceso' + '(' + estado_contratos_proceso + ')</span>';
                //***REMOVED*** else {
                //    html_str += '<span class="h6">Contratos asociados a este proceso</span>';
                //***REMOVED***
                var filaconfirma = "";
                var referencia = "";

                filaconfirma += '<div class="related-contracts">';
                filaconfirma += '<span class="h4">Órdenes de pago y Contratos asociados a este proceso:</span>';
                filaconfirma += '<div class="panel-group" id="accordionContratos_"' + i + '_' + j + '_' + k + '" role="tablist" aria-multiselectable="true">';
                filaconfirma += '<div class="panel panel-default">';
                filaconfirma += '<div class="panel-heading" role="tab" id="headingOne' + i + '_' + j + '_' + k + '">';
                filaconfirma += '<h4 class="panel-title">';
                filaconfirma += '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordionContratos_"' + i + '_' + j + '_' + k + '" href="#collapseContrato_' + i + '_' + j + '_' + k + '" aria-expanded="false" aria-controls="collapseContrato_' + i + '_' + j + '_' + k + '">';
                if (contrato_nom)
                    {
                        filaconfirma += 'Código de contratación: ' + contrato_nom + '';
                ***REMOVED*** else {
                        filaconfirma += 'Pendiente emisión código contratación';
                ***REMOVED***

                filaconfirma += '</a>';
                filaconfirma += '</h4>';
                filaconfirma += '</div>';
                filaconfirma += '<div id="collapseContrato_' + i + '_' + j + '_' + k + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_' + i + '_' + j + '_' + k + '" aria-expanded="false" style="height: 0px;">';
                filaconfirma += '<div class="panel-body">';
                if (contrato_nom) {
                    //filaconfirma += '<div class="row border-b">';
                    //filaconfirma += '<div class="col-md-12"><span class="small"> CONTRATO</span><span class="amount_adj">' + contrato_nom + '</span></div>';
                    //filaconfirma += '</div>';
            ***REMOVED***
                var moneda = 'L';
                if (monedaContrato != "" && monedaContrato != undefined) {
                    if (monedaContrato.toUpperCase() == 'USD') {
                        moneda = '$';
                ***REMOVED***
            ***REMOVED***
                filaconfirma += '<div class="row border-b">';
                filaconfirma += '<div class="col-md-6">';
                filaconfirma += '<span class="small"> Código Proveedor </span>';
                filaconfirma += '<a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + codProveedor + '">';
                filaconfirma += '<span class="amount_adj">';
                filaconfirma += '<span class="glyphicon glyphicon-share-alt" ></span > ' + codProveedor + '</span >';
                filaconfirma += '</a>';
                filaconfirma += '</div>';
                filaconfirma += '<div class="col-md-6"><span class="small"> Contratista</span><span class="amount_adj"> ' + contratista + '</span></div>';
                filaconfirma += '</div>';
                filaconfirma += '<div class="row border-b">';
                filaconfirma += '<div class="col-xs-6 col-md-6"><span class="small"> VALOR PLANEADO</span><span class="amount_adj">'+  (valorPlaneado * 1).formatMoney(1, '.', ',').toString() + '</span></div>';
                filaconfirma += '<div class="col-xs-6 col-md-6"><span class="small"> VALOR ADJUDICADO</span><span class="amount_adj">' +  (valorAdjudicado * 1).formatMoney(1, '.', ',').toString() + '</span></div>';
                filaconfirma += '</div>';
                filaconfirma += '<div class="row border-b">';
                filaconfirma += '<div class="col-xs-6 col-md-6">';
                filaconfirma += '<span class="small" > VALOR CONTRATADO</span >';
                filaconfirma += '<span class="amount_adj" > ' + (valorContratado * 1).formatMoney(1, '.', ', ').toString() + '</span >';
                filaconfirma += '</div>';
                filaconfirma += '<div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj">' + monedaContrato + '</span>';
                filaconfirma += '</div>';
                filaconfirma += '</div>';
                filaconfirma += '<div class="row border-b">';
                filaconfirma += '</div>';
                filaconfirma += '</div>';
                filaconfirma += '<div class="panel-footer" style="align:center">';
                filaconfirma += '</div>';
                filaconfirma += '</div>';
                filaconfirma += '</div>';
                filaconfirma += '</div>';


                filaconfirma += '<div class="row text-center">';
                filaconfirma += '<div class="col-xs-12 col-md-12">';
                filaconfirma += '<a href = "' + UrlProceso + '" target = "_blank" class="btn btn-primary" >';
                filaconfirma += '<span class="glyphicon glyphicon-plus" ></span > <span class="txt_small">Conozca más de este proceso</span>';
                filaconfirma += '</a>';
                filaconfirma += '</div>';
                filaconfirma += '</div>';
                filaconfirma += '</div>';
                html_str = html_str + filaconfirma;

                html_str += '</div>';

                html_str += '</div>';
                html_str += '</div>';
                k_aux = k_aux + 1;

        ***REMOVED***

            html_str += '</div>';
            html_str += '</div>';

            html_str += '</div>';

            html_str += '</div>';
            j_aux = j_aux + 1;

    ***REMOVED***

        html_str += '</div>';
        html_str += '</div>';

        html_str += '</div>';

        i_aux = i_aux + 1;

***REMOVED***
    html_str += "</div>";
    $("#divListado").html(html_str);
   

    if (bandera) {
        var texto_asignacion = '<span class="">' + monedaSimbolo("HND") + ' ' + (valor_asignacion_programa / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
        var texto_ejecutado = '<span class="">' + monedaSimbolo("HND") + ' ' + (valor_ejecutado_programa / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
        var porcentaje_programa = ((valor_ejecutado_programa / valor_asignacion_programa) * 100).formatMoney(1, '.', ',').toString() + "%";
        var str_programa = '<div class="row">';
        str_programa += '<div class="presini col-md-4">';
        str_programa += '<span class="h5">Presupuesto Vigente</span>';
        str_programa += '<div class="clearfix"></div>';
        str_programa += '<span class="h2">' + texto_asignacion + '</span>';
        str_programa += '</div>';
        str_programa += '<div class="presvig col-md-4">';
        str_programa += '<span class="h5">Presupuesto Ejecutado</span>';
        str_programa += '<div class="clearfix"></div>';
        str_programa += '<span class="h2">' + texto_ejecutado + '</span>';
        str_programa += '</div>';
        str_programa += '<div class="presexc col-md-4">';
        str_programa += '<span class="h5">Porcentaje de Ejecución</span>';
        str_programa += '<div class="clearfix"></div>';
        str_programa += '<span class="h2">' + porcentaje_programa + '</span>';
        str_programa += '</div>';
        str_programa += '</div>';
        $("#lblValorAsignacionPrograma").html(str_programa);
***REMOVED***
        
    
    
    $("#loadingAsignacion").show();
    $("#lblEncabezadoListadoGrupos").show();
    configuraEnlaceContratista();
***REMOVED***



function closeListado() {
    $('#accordion .collapse').removeClass("in");
***REMOVED***

function seteaListado() {
    $('#accordion .collapse').removeClass("in");
    $("#divListadoRecursosObje").show();
    //seleccionar tab abierto
    var lstNiveles = $("#migapanlistado").val();
    var arrayNiv = lstNiveles.split(",");
    var nom_nivel = "";
    var longitud = arrayNiv.length;

    if (longitud > 0) {

        for (var i = 0; i < longitud; i++) {
            nom_nivel = arrayNiv[i].toUpperCase();
            switch (i) {
                case 0:
                    var id = $(".nivel1[actividad='" + nom_nivel + "']").attr("id");
                    var obj = $("#" + id);
                    if (obj.length > 0) {
                        obj.addClass("in");
                ***REMOVED***
                    break;
                case 1:
                    var id = $(".nivel2[proceso='" + nom_nivel + "']").attr("id");
                    var obj = $("#" + id);
                    if (obj.length > 0) {
                        obj.addClass("in");
                ***REMOVED***

                    break;
                case 2:
                    var id = $(".nivel3[contrato='" + nom_nivel + "']").attr("id");
                    var obj = $("#" + id);
                    if (obj.length > 0) {
                        obj.addClass("in");
                ***REMOVED***
                    break;
                default:
                    $('#accordion .collapse').removeClass("in");
                // code block
                //$('#accordion .collapse').removeClass("in");
        ***REMOVED***

    ***REMOVED***



***REMOVED*** else {
        $('#accordion .collapse').removeClass("in");
***REMOVED***


***REMOVED***

Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
   var s = n < 0 ? "-" : "",
   var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
   var j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
***REMOVED***;


function getContratos(annio, pagina, registros, estado, entidad, proceso, origen) {
    var ori = "ONCAE";
    if (origen.toUpperCase().includes('ONCAE')) {
        ori = origen;
***REMOVED***
    var filtros = {
        Annio: annio,
        NumeroPagina: pagina,
        RegistrosPorPagina: registros,
        NombreEntidad: null,
        NombreProceso: proceso,
        Estado: estado,
        Moneda: null,
        NombreContratista: null,
        OrigenInformacion: ori,
        CodigoComprador: entidad
***REMOVED***;
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/ServiciosContratos/Contrato/",
        cache: false,
        data: filtros,
        success: function (result) {
            if (result.status == true) {
                if (result.cantidadTotalRegistros > 0) {
                    var info = result.data;
                    var proceso = "";
                    var entidad = "";
                    var filasinfirma = "";
                    var referencia = "";
                    var data = "";
                    var fila = "";
                    var filaconfirma = "";
                    var inicioLuis = '<div class="contractBox">';
                    var finLuis = '</div>';
                    var inicio = "";
                    var fin = "";
                    var stilo = "";
                    $("#srcContratos").html("");
                    for (var i = 0; i < info.length; i++) {
                        if (i > 0 && entidad == info[i].comprador.toString() && proceso != info[i].codigoProceso.toString()) {
                            fila += filaconfirma + '</div>' + referencia + '</div>';
                            filaconfirma = "";

                    ***REMOVED***
                        if (entidad != info[i].comprador.toString()) {
                            if (i > 0) //Cambio de entidad
                            {
                                data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;
                                fila = "";
                                filaconfirma = "";
                                filasinfirma = "";
                                inicio = "";
                                fin = "";
                        ***REMOVED***
                            if (info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")) { stilo = "contractONCAE" ***REMOVED*** else { stilo = "contractSEFIN" ***REMOVED***
                            inicio = '<div class="cotractName ' + stilo +'" ><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Comprador</span><div class="clearfix"></div>'
                                + '                 <span class="h4">' + info[i].comprador.toString() + '</span>'
                                + ' </div></div></div>';
                            entidad = info[i].comprador.toString();
                    ***REMOVED***

                        if (proceso != info[i].codigoProceso.toString()) {
                            fila += '<div class="processName">'
                                + '		<div class="row">'
                                + '			<div class="col-xs-12 col-md-6">'
                                + '				<span class="small">Origen de los fondos</span><div class="clearfix"></div>'
                                + '				<span class="h4">' + info[i].origenFondos.toString() + '</span>  </div>'
                                + '			<div class="col-xs-12 col-md-6">'
                                + '				<span class="small">Fuente de Datos</span><div class="clearfix"></div>'
                                + '				<span class="h4">' + info[i].origenInformacion.toString().toUpperCase() + '</span>  </div> '
                                + '      </div> '
                                + '	</div>'
                                + '<div class="contractNumberRP"><span class="">Código proceso: </span>'
                                + '	<span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>'
                                + '<div class="contractNumberRP"><span class="">Proceso: </span>'
                                + '	<span class="text-bold">' + info[i].descripcionProceso.toString() + '</span></div>'
                                + '<div class="wrap-head-process">';
                            fila += '<div class="contractData">';

                            fila += ''
                                + '		<div class="row border-b">'
                                + '			<div class="col-xs-12 col-md-4">'
                                + '				<span class="txt_small">Estado del proceso</span>'
                                + '				<span class="amount_adj">';
                            if (info[i].estadoProceso) { fila += info[i].estadoProceso.toString(); ***REMOVED***
                            fila += '</span></div>'
                                + '			<div class="col-xs-6 col-md-4"><span class="txt_small"></div>'/*   Monto Estimado<span class="amount_adj"> NA </span>*/
                                + '			    <div class="col-xs-6 col-md-2">'
                                + '				   <span class="txt_small">Moneda</span>'
                                + '				   <span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span>'
                                + '			    </div>'
                                + '			</div>';


                            fila += ''
                                + '		<div class="row border-b">';
                            if (info[i].FCH_INICIO_PUBLICACION) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Inicio</span>'
                                    + '         <span class="amount_adj">' + info[i].FCH_INICIO_PUBLICACION.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                        ***REMOVED***
                            if (info[i].FCH_INICIO_RECEP_OFERTAS) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Recepción</span>'
                                    + '         <span class="amount_adj">' + info[i].FCH_INICIO_RECEP_OFERTAS.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                        ***REMOVED***
                            if (info[i].FCH_ESTIMADA_ADJUDICACION) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
                                    + '         <span class="amount_adj">' + info[i].FCH_ESTIMADA_ADJUDICACION.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                        ***REMOVED***

                            fila += '	</div>'
                                + '	</div>';

                            fila += '</div>'
                                + '<div class="clearfix"></div>';
                            filaconfirma += ' <div class="related-contracts">'
                                + '     <span class="h4">Órdenes de pago y Contratos asociados a este proceso:</span>'
                                + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                            proceso = info[i].codigoProceso.toString();


                            referencia = '<div class="row text-center">'
                                + '<div class="col-xs-12 col-md-12"><a href="' + info[i].docURL.toString() + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                + '</div>';

                    ***REMOVED***


                        filaconfirma += '<div class="panel panel-default">'
                            + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                            + '                <h4 class="panel-title">'
                            + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

                        if (info[i].codigoContrato) { filaconfirma += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; ***REMOVED*** else { filaconfirma += '                      Pendiente emisión código contratación  ' ***REMOVED***

                        filaconfirma += '     </a>'
                            + '                </h4>'
                            + '            </div>'
                            + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                            + '                <div class="panel-body">';
                        if (info[i].descripcionContrato) {
                            filaconfirma += '          <div class="row border-b">'
                                + '                        <div class="col-md-12"><span class="small"> CONTRATO</span><span class="amount_adj">' + info[i].descripcionContrato.toString() + '</span></div>'
                                + '                    </div>';
                    ***REMOVED***
                        var moneda = ''; //'L';
                        if (info[i].monedaContrato.toString()) {
                            if (info[i].monedaContrato.toString() == 'USD') {
                                moneda = '';// '$';
                        ***REMOVED***
                    ***REMOVED***
                        filaconfirma += '        <div class="row border-b">'
                            + '                        <div class="col-md-6">'
                            + '                            <span class="small"> Código Proveedor </span>'
                            + '                            <span class="amount_adj">' + info[i].codigoProveedor.toString() + '</span>'
                            + '                        </div>'
                            + '                        <div class="col-md-6"><span class="small"> Contratista</span><a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].codigoProveedor.toString() + '"><span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span> ' + info[i].contratista.toString() + '</span></a></div>'
                            + '                    </div>'
                            + '                    <div class="row border-b">'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> PRESUPUESTO</span><span class="amount_adj"> ' + moneda + ' ' + (info[i].valorPlaneado * 1).formatMoney(1, '.', ',').toString() + ' </span></div>'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> VALOR ADJUDICADO</span><span class="amount_adj"> ' + moneda + ' ' + (info[i].valorAdjudicado * 1).formatMoney(1, '.', ',').toString() + ' </span></div>'
                            + '                    </div>'
                            + '                    <div class="row border-b">'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> MONTO</span><span class="amount_adj"> ' + moneda + ' ' + (info[i].valorContratado * 1).formatMoney(1, '.', ',').toString() + ' </span></div>'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj">' + info[i].monedaContrato.toString() + '</span></div>' //DOP 
                            + '                    </div>';

                        filaconfirma += '                    <div class="row border-b">';

                        if (info[i].fechaInicioContrato && info[i].fechaInicioContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">Fecha de INICIO CONTRATO</span>'
                                + '                                                                     <span class="amount_adj">'
                                + info[i].fechaInicioContrato.toString().substr(0, 10)
                                + '                                                                      </span></div>';
                    ***REMOVED***
                        if (info[i].fechaFinContrato && info[i].fechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de FIN CONTRATO'
                                + '</span><span class="amount_adj">'
                                + info[i].fechaFinContrato.toString().substr(0, 10)
                                + '        </span></div>';
                    ***REMOVED***

                        if (info[i].fecha_inicio_ejecucion_contrato && info[i].fecha_inicio_ejecucion_contrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de INICIO EJECUCIÓN'
                                + '</span><span class="amount_adj">'
                                + info[i].fecha_inicio_ejecucion_contrato.toString().substr(0, 10)
                                + '        </span></div>';
                    ***REMOVED***
                        if (info[i].fecha_fin_ejecucion_contrato && info[i].fecha_fin_ejecucion_contrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de FIN EJECUCIÓN'
                                + '</span><span class="amount_adj">'
                                + info[i].fecha_fin_ejecucion_contrato.toString().substr(0, 10)
                                + '        </span></div>';
                    ***REMOVED***

                        filaconfirma += '                    </div>';

                        if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
                            filaconfirma += '                    <div class="row border-b">'
                                + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                            if (info[i].ofertaPeriodoDuracion) { filaconfirma += info[i].ofertaPeriodoDuracion.toString(); ***REMOVED***

                            filaconfirma += '                   Días</span></div>';

                            filaconfirma += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                            if (info[i].fechaPublicacion !== null && info[i].fechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                filaconfirma += info[i].fechaPublicacion.toString().substr(0, 10) + '</span></div>';
                        ***REMOVED***
                            else {
                                filaconfirma += '</span></div>';
                        ***REMOVED***

                            filaconfirma += '                    </div>';

                    ***REMOVED***

                        filaconfirma += '                </div>'
                            + '               <div class="panel-footer" style="align:center">';

                        if (info[i].codigoContrato) {
                            //  filaconfirma += '                    <a href="../../contratista/contratoprofile/?CodigoContrato=' + info[i].codigoContrato.toString() + '" class="btn btn-primary btn-primary btn-participe"><span class="glyphicon glyphicon-comment"></span> Hacer comentario al contrato</a>';
                    ***REMOVED***
                        filaconfirma += '                 </div>'
                            + '            </div>'
                            + '        </div>';
                        //+ '  </div>';
                ***REMOVED***


                    data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;


                    $("#srcContratos").html(data);
                    if (scrol >= 1) {
                        $('html, body').animate({ scrollTop: $('#divSectionONCAE').offset().top ***REMOVED***, 2000);
                ***REMOVED*** else { scrol = scrol + 1; ***REMOVED***

                    dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
                    configuraEnlaceContratista();
            ***REMOVED***
                else {
                    $("#divPagContratos").empty();
                    $("#srcContratos").html("");
                    var fila = '<div class="contractBox" >'
                        + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                        + '</div>';
                    $("#srcContratos").html(fila);
            ***REMOVED***
        ***REMOVED*** else {
                alert("Message: " + result.message);
        ***REMOVED***
            deshabilitaO(false);
      ***REMOVED***
        error: function (response) {
            deshabilitaO(false);
            alert(response.responseText);
      ***REMOVED***
        failure: function (response) {
            deshabilitaO(false);
            alert(response.responseText);
    ***REMOVED***
***REMOVED***);

***REMOVED***
var disableClickO = false;
function deshabilitaO(des) {
    disableClickO = des;
    if (des) {
        $("#btnBuscarO").prop("disabled", des);
        $('#btnLimpiarO').attr("disabled", "disabled")
***REMOVED*** else {
        $("#btnBuscarO").prop("disabled", des);
        $('#btnLimpiarO').removeAttr("disabled")
***REMOVED***
***REMOVED***
$("#btnLimpiarO").click(function () {
    if (!disableClick) {
        $("#top_contratos_estados_o").val("");
        $("#procesoo").val("");
        deshabilitaO(true);
        getContratos($("#annioEntidad option:selected").val(), 1, cant_contratos, $("#top_contratos_estados option:selected").val(), $("#entidad").val(), "", $("#top_origen_informacion option:selected").val());
***REMOVED***
***REMOVED***);

$("#btnBuscarO").click(function () {
    if (!disableClick) {
        deshabilitaO(true);
        getContratos($("#annioEntidad option:selected").val(), 1, cant_contratos, $("#top_contratos_estados option:selected").val(), $("#entidad").val(), $('#procesoo').val(), $("#top_origen_informacion option:selected").val());
***REMOVED***

***REMOVED***);
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
***REMOVED*** else {
        inicio = (cociente * cant_por_linea) + 1;
***REMOVED***

    var fin = inicio + (cant_por_linea - 1);
    if (totalPag < cant_por_linea) {
        fin = totalPag;
***REMOVED***
    if (fin > totalPag) {
        fin = totalPag;
***REMOVED***


    if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
        var pag_enlace = divPag.append("a")
            .attr("id", "page_left")
            .attr("role", "button")
            .attr("class", "material-icons md-24")
            .attr("data-page", inicio - cant_por_linea)
        pag_enlace.append("span")
            .attr("class", "")
            .text("chevron_left ")
***REMOVED***



    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            var pag_enlace = divPag.append("span")
                .attr("class", "pag_actual")
                .attr("data-page", i)
            pag_enlace.append("text")
                .text(i)
    ***REMOVED*** else {
            var pag_enlace = divPag.append("a")
                //.attr("id", "page_left")
                .attr("class", "page_left")
                .attr("role", "button")
                .attr("data-page", i)
            pag_enlace.append("span")
                .attr("class", "glyphicon")
            pag_enlace.append("text")
                .attr("class", "paginacion")
                .text(i)

    ***REMOVED***


***REMOVED***

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
    ***REMOVED***
***REMOVED***

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {

        deshabilita(true);
        //$('#divPagContratos').attr('disabled', 'disabled');
        d3.select("#divProyectos").empty();
        pagina_actual = $(this).attr("data-page");
        getContratos($("#annioEntidad option:selected").val(), pagina_actual, cant_contratos, $("#top_contratos_estados option:selected").val(), $("#entidad").val(), $('#procesoo').val(), $("#top_origen_informacion option:selected").val());
***REMOVED***);

***REMOVED***
