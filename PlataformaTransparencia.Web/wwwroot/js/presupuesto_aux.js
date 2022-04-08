
inicializaDatos();

function inicializaDatos() {
    // señala en todos los botones de las graficas el que debe ir por defecto
    if ($('#todosSectores').hasClass("bg-noactive")) { $('#todosSectores').removeClass("bg-noactive"); $('#todosSectores').addClass("bg-active"); $("#todosEntidades").removeClass("bg-active"); $("#todosEntidades").addClass("bg-noactive"); ***REMOVED***
    if ($('#topSectoresG').hasClass("bg-noactive")) { $('#topSectoresG').removeClass("bg-noactive"); $('#topSectoresG').addClass("bg-active"); $("#todosSectoresG").removeClass("bg-active"); $("#todosSectoresG").addClass("bg-noactive"); ***REMOVED***
    if ($('#topSectoresPSAA').hasClass("bg-noactive")) { $('#topSectoresPSAA').removeClass("bg-noactive"); $('#topSectoresPSAA').addClass("bg-active"); $("#todosSectoresPSAA").removeClass("bg-active"); $("#todosSectoresPSAA").addClass("bg-noactive"); ***REMOVED***
   // if ($('#ultimos5APT').hasClass("bg-noactive")) { $('#ultimos5APT').removeClass("bg-noactive"); $('#ultimos5APT').addClass("bg-active"); $("#annioPT").removeClass("bg-active"); $("#annioPT").addClass("bg-noactive"); ***REMOVED***
    if ($('#topGruposG').hasClass("bg-noactive")) { $('#topGruposG').removeClass("bg-noactive"); $('#topGruposG').addClass("bg-active"); $("#todosGruposG").removeClass("bg-active"); $("#todosGruposG").addClass("bg-noactive"); ***REMOVED***
    $('#annioPT').hide();
    //Treemap primera grafica Distribucion del presupuesto
    GetTreeMap(1, $("#annioPresupuesto option:selected").val());
    // Avance por sectores
    GetGastoSectores(0, $("#annioPresupuesto option:selected").val());
    //Presupuesto solicitado vs aprobado
    GetComboVersiones($("#annioPresupuesto option:selected").val());
    //Avance presupuestal en el tiempo
    GetDatosGastoPresupuestalTiempo(0, $("#annioPresupuesto option:selected").val());
    //Totales primera grafica
    GetDatosSectores($("#annioPresupuesto option:selected").val());
    //Grupo de gasto
    GetGrupoDeGasto(0, $("#annioPresupuesto option:selected").val());

    // devuelve los estilos de los combos a su valor por defecto
    $("#clasePrograma").prop("disabled", true);
    $("#clasePrograma").val("");
    $("#selectClasePrograma").prop("class", "selectDis");
    $("#entidad").prop("disabled", true);
    $("#entidad").val("");
    $("#selectEntidad").prop("class", "selectDis");
    $("#proyectoActividad").val("");
    $("#proyectoActividad").hide();
    $("#selectProyectoActividad").prop("class", "selectDis");
    //Treemap del final
    GetComboClasificacion($("#annioPresupuesto option:selected").val());
    //ENlaces piede pagina
    GetEntidadesPlanNacional()

    GetComboEntidadOG($("#annioPresupuesto option:selected").val());
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
            //htmlList = htmlList + "<li class='list-group-item'><a href=" + '/BusquedaResultados?SearchString=' + GenerarNombreEntidad(data[i].nombre) + ">" + "<span>" + data[i].nombre + "</span><i class='material-icons md-18'>chevron_right</i></a></li>";
            htmlList = htmlList + "<li class='list-group-item'><a href=" + '/PerfilEntidad?codEntidad=' + data[i].codEntidad + ">" + "<span>" + data[i].nombre + "</span><i class='material-icons md-18'>chevron_right</i></a></li>";
    ***REMOVED***
        if (data.length > 0)
            htmlList = htmlList + "<li class='list-group-item'><a href='/BusquedaResultados?Type=Entidad'>" + "<span>Ver todos</span><i class='material-icons md-18'>chevron_right</i></a></li>";
        entidadPlanNacional.innerHTML = htmlList;
***REMOVED***).fail(function (handleError) {
        // Some function
        console.log(handleError);
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

function GetTreeMap(consulta, annio) {
    var param = "consulta=" + consulta + "&annio=" + annio;
    //var params = {
    //  consulta: counsulta
    //***REMOVED***;
    var data = $("#Distribucion").data("c" + consulta + "_" + annio);
    $("#Distribucion").attr("consulta", consulta);
    if (data) {
        //var datos = data.infoGrafica
        loadRecursosPorObjeto(data, "divGraphTreePresupuesto", "presupuesto");
***REMOVED*** else {
        $.ajax({
            url: "api/serviciospresupuesto/TreeMapSectores/",
            type: "GET",
            data: param,

    ***REMOVED***).done(function (data) {

            loadRecursosPorObjeto(data.infoGrafica, "divGraphTreePresupuesto", "presupuesto");
            //console.log("GetTreeMap");
            //console.log(data);JSON.stringify(my_object)

            $("#Distribucion").attr("data-c" + consulta + "_" + annio, JSON.stringify(data.infoGrafica));
            
            //alert($("#divGraphTreePresupuesto").attr("c" +consulta + "" + annio));
    ***REMOVED***).fail(function (handleError) {
            // Some function
            console.log(handleError);
    ***REMOVED***);
        
***REMOVED***
***REMOVED***

function GetDatosSectores(annio) {
var param = "annio=" + annio;
//var params = {
//  consulta: counsulta
//***REMOVED***;
$.ajax({
    url: "api/serviciospresupuesto/DatosSectores/",
    type: "GET",
    data: param,

***REMOVED***).done(function (data) {

   // $('#totalPresupuesto').html(data.infoGrafica);
    $("#totalPresupuesto").html("Total Presupuesto " + $("#annioPresupuesto option:selected").val());
    $("#totalPresupuestoValue").html("₲ " + ((data.infoGrafica[0]["totalGasto"] * 1) / 1000000).formatMoney(0, ',', '.').toString() + " Millones");
    $("#totalPresupuestoProgramas").html("PRESUPUESTO TOTAL ₲ " + ((data.infoGrafica[0]["totalGasto"] * 1) / 1000000).formatMoney(0, ',', '.').toString() + " Millones");
    $("#annioPresupuestoText").html("" + $("#annioPresupuesto option:selected").val());
    //console.log("Objetivos");
    //console.log(data);


***REMOVED***).fail(function (handleError) {
    // Some function
    console.log(handleError);
***REMOVED***);
***REMOVED***

function GetGastoSectores(consulta, annio) {
    var param = "consulta=" + consulta + "&annio=" + annio;
    //var params = {
    //  consulta: counsulta
    //***REMOVED***;
    $.ajax({
        url: "api/serviciospresupuesto/BarChartSectores/",
        type: "GET",
        data: param,

***REMOVED***).done(function (data) {

        //$('#totalPresupuesto').html(data.infoGrafica);

        loadBarChartSectores(data.infoGrafica,"divGraphBarChartGastoSectores");
        //console.log("GetGastoSectores");
        //console.log(data);


***REMOVED***).fail(function (handleError) {
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***

function GetDatosGastoPresupuestalSolicitadoVAprobado(consulta, annio, version1, version2) {
    var param = "consulta=" + consulta + "&annio=" + annio + "&version1=" + version1 + "&version2=" + version2;
    //var params = {
    //  consulta: counsulta
    //***REMOVED***;
    $.ajax({
        url: "api/serviciospresupuesto/LinePlotPresupuestoSolicitadoAprobado/",
        type: "GET",
        data: param,

***REMOVED***).done(function (data) {

        //$('#totalPresupuesto').html(data.infoGrafica);
        loadAreaSolicitadoVAprobado(data.infoGrafica, "divGraphBarChartPresupuestoSolicitadoVAprobado");

        //console.log("GetDatosGastoPresupuestalSolicitadoVAprobado");
        //console.log(data);


***REMOVED***).fail(function (handleError) {
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***

function GetDatosGastoPresupuestalTiempo(consulta,annio) {
    var param = "consulta=" + consulta + "&annio=" + annio;
    //var params = {
    //  consulta: counsulta
    //***REMOVED***;
    $.ajax({
        url: "api/serviciospresupuesto/LinePlotGastoPresupuestalTiempo/",
        type: "GET",
        data: param,

***REMOVED***).done(function (data) {

        //$('#totalPresupuesto').html(data.infoGrafica);
        loadLinePlotGastoTiempo(data.infoGrafica, "divGraphBarLinePlotPresupuestoTiempo");

        //console.log("Objetivos");
        //console.log(data);


***REMOVED***).fail(function (handleError) {
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***


function GetGrupoDeGasto(consulta, annio) {
    var param = "consulta=" + consulta + "&annio=" + annio;
    //var params = {
    //  consulta: counsulta
    //***REMOVED***;
    $.ajax({
        url: "api/serviciospresupuesto/LinePlotGrupoDeGasto/",
        type: "GET",
        data: param,

***REMOVED***).done(function (data) {

        //$('#totalPresupuesto').html(data.infoGrafica);

        loadBarChartGrupoDeGasto(data.infoGrafica, "divGraphGrupoGasto");
        //console.log("GetGrupoDeGasto");
        //console.log(data);


***REMOVED***).fail(function (handleError) {
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***


//function GetDatosGastoPresupuestalTiempo(annio) {
//    var param = "annio=" + annio;
//    //var params = {
//    //  consulta: counsulta
//    //***REMOVED***;
//    $.ajax({
//        url: "api/serviciospresupuesto/ComboNiveles/",
//        type: "GET",
//        data: param,

//***REMOVED***).done(function (data) {

//        //$('#totalPresupuesto').html(data.infoGrafica);
//        loadLinePlotGastoTiempo(data.infoGrafica, "divGraphBarLinePlotPresupuestoTiempo");

//        console.log("Objetivos");
//        console.log(data);


//***REMOVED***).fail(function (handleError) {
//        // Some function

//***REMOVED***);
//***REMOVED***

function GetComboVersiones(annio) {
    var param = "annio=" + annio;
    //var params = {
    //  consulta: counsulta
    //***REMOVED***;
    //if ($('#clasificacion').attr('data-' + annio, items_result)) {
    //***REMOVED***
    //    else { 
    $.ajax({
        url: "api/serviciospresupuesto/ComboVersiones/",
        type: "GET",
        data: param,

***REMOVED***).done(function (data) {


        var items_result = data.infoGrafica;
        var select = "";
        for (var i = 0; i < items_result.length; i++) {
            select = select + '<option value="' + items_result[i].version.toString() + '">' + items_result[i].nombreVersion.toString() + '</option>';
    ***REMOVED***
        $('#version1').html(select).fadeIn();
        $('#version2').html(select).fadeIn();

        if (items_result.length > 1) {
            $("version2 :nth-child(2)").prop('selected', true);
    ***REMOVED***

        $('#version1').attr('consulta', 0);
        GetDatosGastoPresupuestalSolicitadoVAprobado(0, $("#annioPresupuesto option:selected").val(), $("#version1 option:selected").val(), $("#version2 option:selected").val());


***REMOVED***).fail(function (handleError) {
        // Some function
        alert("Error GetComboVersiones");
        console.log(handleError);
***REMOVED***);
    /****REMOVED****/
***REMOVED***


/***********************GRAFICA DE DISTRIBUCION EN PROGRAMAS*****************************************/
function GetComboClasificacion(annio) {
    var param = "annio=" + annio;
    $("#clasePrograma").prop("disabled", true);
    $("#clasePrograma").val("");
    $("#selectClasePrograma").prop("class", "selectDis");
    $("#entidad").prop("disabled", true);
    $("#entidad").val("");
    $("#selectEntidad").prop("class", "selectDis");
    $("#proyectoActividad").val("");
    $("#selectProyectoActividad").prop("class", "selectDis");
    $("#btnVolver").hide();
    $("#clasificacion").prop("disabled", true);
   // $("#selectProyectoActividad").hide();
    
    var data = $('#clasificacion').data(annio);
    if (data) {
        var select = "";
        select = select + '<option value="">Todas las Clasificaciones</option>';
        for (var i = 0; i < data.length; i++) {
            select = select + '<option value="' + data[i].clasificacion.toString() + '">' + data[i].clasificacion.toString() + '</option>';
    ***REMOVED***
        $('#clasificacion').html(select).fadeIn();
        $('#DistribucionProgramas').attr('nivel', 1);
        treeMapCombos(data, "treeMapCombos", "clasificacion", "totalClasificacion");
        $("#clasificacion").prop("disabled", false);
***REMOVED***
        else { 
        $.ajax({
            url: "api/serviciospresupuesto/ComboClasificacion/",
            type: "GET",
            data: param,

    ***REMOVED***).done(function (data) {

            //$('#totalPresupuesto').html(data.infoGrafica);
            //loadLinePlotGastoTiempo(data.infoGrafica, "divGraphBarLinePlotPresupuestoTiempo");
            var items_result = data.infoGrafica;
            var select = "";
            select = select + '<option value="">Todas las Clasificaciones</option>';
            for (var i = 0; i < items_result.length; i++) {
                select = select + '<option value="' + items_result[i].clasificacion.toString() + '">' + items_result[i].clasificacion.toString() + '</option>';
        ***REMOVED***
            $('#clasificacion').html(select).fadeIn();
            $('#clasificacion').attr("data-" + $.trim(annio) , JSON.stringify(items_result));
            $('#DistribucionProgramas').attr('nivel', 1);
            
            //console.log("Objetivos");
           /* console.log(items_result);*/
            treeMapCombos(items_result, "treeMapCombos", "clasificacion", "totalClasificacion");
            $("#clasificacion").prop("disabled", false);
    ***REMOVED***).fail(function (handleError) {
            // Some function
            alert("Error GetComboClasificacion");
            console.log(handleError);
    ***REMOVED***);
***REMOVED***
***REMOVED***

function GetComboEntidad(annio, clasificacion) {
    var param = "annio=" + annio + "&clasificacion=" + clasificacion;
    $("#btnVolver").show();
    if (clasificacion == "") {

        $("#entidad").prop("disabled", true);
        $("#entidad").val("");
        $("#selectEntidad").prop("class", "selectDis");
        //$("#dropdown").prop("disabled", true);
        //$("#mySelect").val("");
        //$("#dropdown").prop("disabled", true);
        //$("#mySelect").val("");
***REMOVED***
    else {

        //var params = {
        //  consulta: counsulta
        //***REMOVED***;
        //if ($('#clasificacion').attr('data-' + annio, items_result)) {
        //***REMOVED***
        //    else { 
        $.ajax({
            url: "api/serviciospresupuesto/ComboEntidad/",
            type: "GET",
            data: param,

    ***REMOVED***).done(function (data) {

            //$('#totalPresupuesto').html(data.infoGrafica);
            //loadLinePlotGastoTiempo(data.infoGrafica, "divGraphBarLinePlotPresupuestoTiempo");
            var items_result = data.infoGrafica;
            var select = "";
            select = select + '<option value="">Todas las Entidades</option>';
            for (var i = 0; i < items_result.length; i++) {
                select = select + '<option value="' + items_result[i].entidad.toString() + '">' + items_result[i].entidad.toString() + '</option>';
        ***REMOVED***

            $('#entidad').html(select).fadeIn();
            $('#entidad').attr('data-' + $.trim(annio) + '-' + $.trim(clasificacion).replace(/ /g, '_'), JSON.stringify(items_result));
            //console.log("Objetivos");
            /*           console.log(items_result);*/
            $("#entidad").prop("disabled", false);
            $("#selectEntidad").prop("class", "selectBlue");
            $('#DistribucionProgramas').attr('nivel', 2);
            //$("#clasePrograma").val("");
            treeMapCombos(items_result, "treeMapCombos", "entidad", "totalEntidad");
    ***REMOVED***).fail(function (handleError) {
            // Some function
            alert("Error GetComboEntidad");
            console.log(handleError);
    ***REMOVED***);
        /****REMOVED****/

***REMOVED***
***REMOVED***


function GetComboClasePrograma(annio, clasificacion, entidad) {
    var param = "annio=" + annio + "&clasificacion=" + clasificacion + "&clasePrograma=" + clasePrograma + "&entidad=" + entidad;
    
    if (clasePrograma == "") {

        $("#clasePrograma").prop("disabled", true);
        $("#clasePrograma").val("");
        $("#selectClasePrograma").prop("class", "selectDis");

***REMOVED***
    else {

        //var params = {
        //  consulta: counsulta
        //***REMOVED***;
        //if ($('#clasificacion').attr('data-' + annio, items_result)) {
        //***REMOVED***
        //    else { 
        $.ajax({
            url: "api/serviciospresupuesto/ComboClasePrograma/",
            type: "GET",
            data: param,

    ***REMOVED***).done(function (data) {

            //$('#totalPresupuesto').html(data.infoGrafica);
            //loadLinePlotGastoTiempo(data.infoGrafica, "divGraphBarLinePlotPresupuestoTiempo");
            var items_result = data.infoGrafica;
            var select = "";
            select = select + '<option value="">Todas las Clases de Programa</option>';
            for (var i = 0; i < items_result.length; i++) {
                select = select + '<option value="' + items_result[i].clasePrograma.toString() + '">' + items_result[i].clasePrograma.toString() + '</option>';
        ***REMOVED***
            $('#clasePrograma').html(select).fadeIn();
            $('#clasePrograma').attr('data-' + annio + '-' + $.trim(clasificacion).replace(/ /g, '_') + '-' + $.trim(entidad).replace(/ /g, '_'), JSON.stringify(items_result));
            //console.log("Objetivos");
            //console.log(items_result);
            $("#clasePrograma").prop("disabled", false);
            $("#selectClasePrograma").prop("class", "selectBlue");
            $('#DistribucionProgramas').attr('nivel', 3);
            //$("#clasePrograma").val("");
            treeMapCombos(items_result, "treeMapCombos", "clasePrograma", "totalClasePrograma");
    ***REMOVED***).fail(function (handleError) {
            // Some function
            alert("Error GetComboClasePrograma");
            console.log(handleError);
    ***REMOVED***);
        /****REMOVED****/

***REMOVED***
***REMOVED***

function GetComboProyectoActividad(annio, clasificacion, entidad, clasePrograma) {
    var param = "annio=" + annio + "&clasificacion=" + clasificacion + "&clasePrograma=" + clasePrograma + "&entidad=" + entidad;
    if (entidad == "") {

        //$("#proyectoActividad").prop("disabled", true);
        //$("#proyectoActividad").val("");
        $("#selectProyectoActividad").prop("class", "selectDis");
        //$("#dropdown").prop("disabled", true);
        //$("#mySelect").val("");
        //$("#dropdown").prop("disabled", true);
        //$("#mySelect").val("");
***REMOVED***
    else {

        //var params = {
        //  consulta: counsulta
        //***REMOVED***;
        //if ($('#clasificacion').attr('data-' + annio, items_result)) {
        //***REMOVED***
        //    else { 
        $.ajax({
            url: "api/serviciospresupuesto/ComboProyectoActividad/",
            type: "GET",
            data: param,

    ***REMOVED***).done(function (data) {

 
            var items_result = data.infoGrafica;
            //var select = "";
            //select = select + '<option value="">Todos los Proyecto Actividad</option>';
            //for (var i = 0; i < items_result.length; i++) {
            //    select = select + '<option value="' + items_result[i].proyectoActividad.toString() + '">' + items_result[i].proyectoActividad.toString() + '</option>';
            //***REMOVED***
            //$('#proyectoActividad').html(select).fadeIn();
            //$('#proyectoActividad').hide();

            $('#proyectoActividad').attr('data-' + annio + '-' + $.trim(clasificacion).replace(/ /g, '_') + '-' + $.trim(clasePrograma).replace(/ /g, '_') + '-' + $.trim(entidad).replace(/ /g, '_'), JSON.stringify(items_result));


            //$("#proyectoActividad").prop("disabled", false);
            $("#selectProyectoActividad").prop("class", "selectBlue");
            $('#DistribucionProgramas').attr('nivel', 4);
            treeMapCombos(items_result, "treeMapCombos", "proyectoActividad", "totalProyectoActividad");
            //$("#clasePrograma").val("");

    ***REMOVED***).fail(function (handleError) {
            // Some function
            alert("Error selectProyectoActividad");
            console.log(handleError);
    ***REMOVED***);
        /****REMOVED****/

***REMOVED***
***REMOVED***

function elegirChange(nivel, consulta) {
    //alert(nivel + "  " + consulta);
    if (nivel == 1) {
        
        GetComboClasificacion($("#annioPresupuesto option:selected").val());
***REMOVED***
    if (nivel == 2) {
        $("#clasificacion").val(consulta);
        changeClasificacion(consulta)
***REMOVED***
    if (nivel == 3) {
        $("#entidad").val(consulta);
        changeEntidad(consulta)  
***REMOVED***
    if (nivel == 4) {
        $("#clasePrograma").val(consulta);
        changeClasePrograma(consulta)
***REMOVED***
***REMOVED***

function changeClasificacion(consulta) {

    $("#clasePrograma").prop("disabled", true);
    $("#clasePrograma").val("");
    $("#selectClasePrograma").prop("class", "selectDis");
    $("#entidad").prop("disabled", true);
    $("#entidad").val("");
    $("#selectEntidad").prop("class", "selectDis");
    $("#proyectoActividad").val("");
    $("#selectProyectoActividad").prop("class", "selectDis");
    
    GetComboEntidad($("#annioPresupuesto option:selected").val(), consulta); //consulta es el valor actual del combo
***REMOVED***

function changeEntidad(consulta) {
    $("#clasePrograma").prop("disabled", true);
    $("#clasePrograma").val("");
/*    $("#clasePrograma").prop("class", "selectDis");*/
    $("#proyectoActividad").prop("disabled", true);
    $("#proyectoActividad").val("");
    $("#selectProyectoActividad").prop("class", "selectDis");
    GetComboClasePrograma($("#annioPresupuesto option:selected").val(), $("#clasificacion option:selected").val(), consulta);   
***REMOVED***

function changeClasePrograma(consulta) {

   
    /*$("#proyectoActividad").val("");*/
    $("#selectProyectoActividad").prop("class", "selectDis");
    GetComboProyectoActividad($("#annioPresupuesto option:selected").val(), $("#clasificacion option:selected").val(), $("#entidad option:selected").val(), consulta);
***REMOVED***



function treeMapCombos(objData, divContenedor, label, value) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.Treemap()
            .select("#" + divContenedor)
            .data(objData)
            .groupBy([label, "label", "label_inf", "label_nivel4"])
            .on("click", function (d) {
               // alert(d[label] + " has been clicked!");
                elegirChange($('#DistribucionProgramas').attr('nivel')*1 + 1, d[label])
        ***REMOVED***)
            .shapeConfig({

                labelConfig: {
                    //fontFamily: "serif",
                    fontMax: 100,
                    align: "center",
                    size: 14,
                    transform: "capitalize"
            ***REMOVED***
        ***REMOVED***)

            .config({
                tooltipConfig: {
                    title: function (d) {
                        return d[label];
                  ***REMOVED***
                    tbody: [
                        ["Total",function (d) { return "₲ " + ((d[value] * 1) / 1000000).formatMoney(0, ',', '.').toString() + " Millones" ***REMOVED***],
                       // ["Versión Presupuesto", function (d) { return d["version"] ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: "",
            ***REMOVED***
        ***REMOVED***)
            .sum(value)
            //.depth(0)
            .legend(false)
            .color(label)
            .colorScale(["#2D506A", "#236B81", "#265C87", "#468ABF"])
            //.width(600)
            //.height(400)
            .render();
***REMOVED***
***REMOVED***

/***********************END GRAFICA DE DISTRIBUCION EN PROGRAMAS*****************************************/


function loadRecursosPorObjeto(objData, divContenedor, tipo_desglose) {
    $("#" + divContenedor).empty();
    $("#btnVolverDP").hide();
    
    if (objData != undefined && objData != null) {
        new d3plus.Treemap()
            .select("#" + divContenedor)
            .data(objData)
            .groupBy(["labelGroup"])
            .on("click", function (d) {
                var data = $("#Distribucion").data("c" + $("#Distribucion").attr("consulta") + "_" + $("#annioPresupuesto option:selected").val());
                var searchField = "labelGroup";
                var searchVal = d["labelGroup"];
                var results = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i][searchField] == searchVal) {
                        results.push(data[i]);
                ***REMOVED***
            ***REMOVED***
                loadRecursosPorObjeto2(results, divContenedor,"")
        ***REMOVED***)
            .shapeConfig({

                labelConfig: {
                    //fontFamily: "serif",
                    fontMax: 100,
                    align: "center",
                    size: 14,
                    transform: "capitalize"
            ***REMOVED***
        ***REMOVED***)

            .config({
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"];
                  ***REMOVED***
                    tbody: [
                        [function (d) { return "₲ " + d["rawValue"].formatMoney(0, ',', '.').toString() + " Millones" ***REMOVED***],
                        ["<i>Click para expandir</i>"]
                    ]
              ***REMOVED***
                yConfig: {
                    title:  "",
            ***REMOVED***
        ***REMOVED***)
            .sum("rawValue")
            //.depth(0)
            .legend(false)
            .color("labelGroup")
            .colorScale(["#2D506A", "#236B81", "#265C87", "#468ABF"])
            //.width(600)
            //.height(400)
            .render();
***REMOVED***
***REMOVED***

function loadRecursosPorObjeto2(objData, divContenedor, tipo_desglose) {
    $("#" + divContenedor).empty();
    $("#btnVolverDP").show();
    if (objData != undefined && objData != null) {
        new d3plus.Treemap()
            .select("#" + divContenedor)
            .data(objData)
            .groupBy(["label"]) //groupBy(["labelGroup", "label", "label_inf", "label_nivel4"])
            
            .shapeConfig({

                labelConfig: {
                   // fontFamily: "serif",
                    fontMax: 100,
                    align: "center",
                    size: 14,
                    transform: "capitalize"
            ***REMOVED***
        ***REMOVED***)

            .config({
                tooltipConfig: {
                    title: function (d) {
                        return d["label"];
                  ***REMOVED***
                    tbody: [
                        ["", function (d) { return d["labelGroup"] ***REMOVED***],
                        ['', function (d) { return "₲ " + d["rawValue"].formatMoney(0, ',', '.').toString() + " Millones" ***REMOVED***]
                       
                    ]
              ***REMOVED***
                yConfig: {
                    title: "",
            ***REMOVED***
        ***REMOVED***)
            .sum("rawValue")
            //.depth(0)
            .legend(false)
            //.color("labelGroup")
            //.colorScale(["#2D506A", "#236B81", "#265C87", "#468ABF"])
            //.width(600)
            //.height(419)
            
            .render();
***REMOVED***
***REMOVED***

function loadBarChartSectores(objData, divContenedor) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.BarChart()
            .select("#" + divContenedor)
            //.data(data)
            .config({
                data: objData,
                groupBy: "labelGroup",
                x: "label",
                y: "rawValue",
                shapeConfig: {
                    //label: false,
                    labelConfig: {
                        fontMin: 4,
                        fontMax: 8
                ***REMOVED***
                    
              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        return " ";//d["labelGroup"];
                  ***REMOVED***
                    tbody: [
                        [function (d) { return "₲ " + d["rawValue"].formatMoney(0, ',', '.').toString() + " Millones" ***REMOVED***]
                        //["₲", function (d) { return d["rawValue"].formatMoney(0, ',', '.').toString() ***REMOVED***]
                        //["Total", function (d) { return d["Number of Food Stores"] ***REMOVED***],
                        //["Year", function (d) { return d.year ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: " ",
                    //ticks: [],
                    scale: "pow",
                    tickFormat: function (d) {
                        return (d/1000000) + " B";
                ***REMOVED***
              ***REMOVED***
                xConfig: {
                    fontsize: "2px",
                    size:"2px"
              ***REMOVED***
                legend: false
        ***REMOVED***)
            .barPadding(0)
            .groupPadding(12)
           // .stacked(true)
            .colorScale(["#2D506A", "#236B81", "#265C87", "#468ABF"])
            //.height(400)
            .render();
***REMOVED***
***REMOVED***

function loadAreaSolicitadoVAprobado(objData, divContenedor) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.BarChart()
            .select("#" + divContenedor)
            .config({
                data: objData,
                groupBy: "labelGroup",
                x: "label",
                y: "rawValue",
                shapeConfig: {
                    //label: false,
                    labelConfig: {
                        fontMin: 4,
                        fontMax: 8
                ***REMOVED***

              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"];
                  ***REMOVED***
                    tbody: [
                        [function (d) { return "₲ " + d["rawValue"].formatMoney(0, ',', '.').toString() + " Millones" ***REMOVED***]
                    ]
              ***REMOVED***
                //lineMarkers: true,
                //lineMarkerConfig: {
                //    r: 3
                //***REMOVED***,
                yConfig: {
                    maxSize: "100px",
                    title: [],
                    scale: "pow",
                    tickFormat: function (d) {
                        return (d / 1000000) + " B";
                ***REMOVED***
              ***REMOVED***
                xConfig: {
                    fontsize: "2px",
                    size: "2px"
              ***REMOVED***
                 legend: false
        ***REMOVED***)
            .barPadding(0)
            .groupPadding(12)
            //.colorScale(["#2D506A", "#236B81", "#265C87", "#468ABF"])
            //.height(400)
            .render();
***REMOVED***
***REMOVED***

function loadLinePlotGastoTiempo(objData, divContenedor) {
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
                y: "rawValue",
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"];
                  ***REMOVED***
                    tbody: [
                        ["% del Presupuesto",function (d) { return d["rawValue"].formatMoney(2, ',', '.').toString() + " %" ***REMOVED***]
                        //["₲", function (d) { return d["rawValue"].formatMoney(0, ',', '.').toString() ***REMOVED***]
                    ]
              ***REMOVED***
                lineMarkers: true,
                lineMarkerConfig: {
                    r: 3
              ***REMOVED***
                yConfig: {
                    title: "Distribución Interanual del Avance por Sectores.",
                    //scale: "sqrt"
                    tickFormat: function (d) {
                        return d + "%";
                ***REMOVED***
              ***REMOVED***
               // lineLabels: true
                legend: false
        ***REMOVED***)
            //.height(400)
            .render();
***REMOVED***
***REMOVED***

function loadBarChartGrupoDeGasto(objData, divContenedor) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.BarChart()
            .select("#" + divContenedor)
            //.data(data)
            .config({
                data: objData,
                groupBy: "annio",
                x: "labelGroup",
                y: "totalPresupuesto",
                /*discrete:"x",*/
                shapeConfig: {
                   // label: false,
              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"] + " "+d["annio"];
                  ***REMOVED***
                    tbody: [
                      //  ["Año",function (d) { return "" + d["label"] + "" ***REMOVED***],
                       // [function (d) { return "Año " + d["annio"] + "" ***REMOVED***],
                        [function (d) { return "₲ " + d["totalPresupuesto"].formatMoney(0, ',', '.').toString() + " Millones" ***REMOVED***],
                        [function (d) { return "Variación contra el año anterior " + d["rawValue"].formatMoney(2, ',', '.').toString() + " %" ***REMOVED***]
                        
                        //["Total", function (d) { return d["Number of Food Stores"] ***REMOVED***],
                        //["Year", function (d) { return d.year ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: [],
                    //ticks: [],
                    scale: "pow",
                    tickFormat: function (d) {
                        return (d / 1000000) + " B";
                ***REMOVED***
              ***REMOVED***
                //xConfig: {
                //    fontsize: "2px",
                //    size: "2px"
                //***REMOVED***,
                 legend: false
        ***REMOVED***)
            .barPadding(0)
            .groupPadding(12)
            // .stacked(true)
            .colorScale(["#2D506A", "#236B81", "#265C87", "#468ABF"])
            //.height(400)
            .render();
***REMOVED***
***REMOVED***



/***********************GRAFICA DE DISTRIBUCION objeto de gasto*****************************************/

function treeMapCombosOG(objData, divContenedor, label, value) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.Treemap()
            .select("#" + divContenedor)
            .data(objData)
            .groupBy([label, "label", "label_inf", "label_nivel4"])
            .on("click", function (d) {
                // alert(d[label] + " has been clicked!");
                elegirChangeOG($('#DistribucionObjetoGasto').attr('nivel') * 1 + 1, d[label])
        ***REMOVED***)
            .shapeConfig({

                labelConfig: {
                   // fontFamily: "serif",
                    fontMax: 100,
                    align: "center",
                    size: 14,
                    transform: "capitalize"
            ***REMOVED***
        ***REMOVED***)

            .config({
                tooltipConfig: {
                    title: function (d) {
                        return d[label];
                  ***REMOVED***
                    tbody: [
                        ["Total", function (d) { return "₲ " + ((d[value] * 1) / 1000000).formatMoney(0, ',', '.').toString() + " Millones" ***REMOVED***],
                        // ["Versión Presupuesto", function (d) { return d["version"] ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: "",
            ***REMOVED***
        ***REMOVED***)
            .sum(value)
            //.depth(0)
            .legend(false)
            .color(label)
            //.colorScale(["#2D506A", "#236B81", "#265C87", "#468ABF"])
            //.width(600)
            //.height(400)
            .render();
***REMOVED***
***REMOVED***

function GetComboEntidadOG(annio) {
    var param = "annio=" + annio;

    $("#proyectoActividadOG").val("");
    $("#selectProyectoActividadOG").prop("class", "selectDis");
    $("#btnVolverOG").hide();
    $("#objetoGasto").prop("disabled", true);
    $("#objetoGasto").val("");
    $("#selectObjetoGasto").prop("class", "selectDis");
    $("#entidadOG").prop("disabled", true);
   

    var data = $('#entidadOG').data(annio);
    $("#btnVolverOG").hide();
    var select = "";
    var data = $('#entidadOG').data('OG' + annio)
    if (data) {
           
            select = select + '<option value="">Todas las Entidades</option>';
            for (var i = 0; i < data.length; i++) {
                select = select + '<option value="' + data[i].entidad.toString() + '">' + data[i].entidad.toString() + '</option>';
        ***REMOVED***

            $('#entidadOG').html(select).fadeIn();
            $("#entidadOG").prop("disabled", false);
            $("#selectEntidadOG").prop("class", "selectBlue");
            $('#DistribucionObjetoGasto').attr('nivel', 1);

            treeMapCombosOG(items_result, "treeMapCombosOG", "entidad", "totalEntidad");
    ***REMOVED***
        else { 
            $.ajax({
                url: "api/serviciospresupuesto/ComboEntidadOG/",
                type: "GET",
                data: param,

        ***REMOVED***).done(function (data) {

                //$('#totalPresupuesto').html(data.infoGrafica);
                //loadLinePlotGastoTiempo(data.infoGrafica, "divGraphBarLinePlotPresupuestoTiempo");
                var items_result = data.infoGrafica;
                
                select = select + '<option value="">Todas las Entidades</option>';
                for (var i = 0; i < items_result.length; i++) {
                    select = select + '<option value="' + items_result[i].entidad.toString() + '">' + items_result[i].entidad.toString() + '</option>';
            ***REMOVED***

                $('#entidadOG').html(select).fadeIn();
                $('#entidadOG').attr('data-OG' + $.trim(annio) , JSON.stringify(items_result));

                $("#entidadOG").prop("disabled", false);
                $("#selectEntidadOG").prop("class", "selectBlue");
                $('#DistribucionObjetoGasto').attr('nivel', 1);

                treeMapCombosOG(items_result, "treeMapCombosOG", "entidad", "totalEntidad");
        ***REMOVED***).fail(function (handleError) {
                // Some function
                alert("Error GetComboEntidadG");
                console.log(handleError);
        ***REMOVED***);
    ***REMOVED***

***REMOVED***

function GetComboProyectoActividadOG(annio,  entidad) {
    var param = "annio=" + annio + "&entidad=" + entidad;
    $("#btnVolverOG").show();
    if (entidad == "") {

        $("#proyectoActividadOG").prop("disabled", true);
        $("#proyectoActividadOG").val("");
        $("#selectProyectoActividadOG").prop("class", "selectDis");

***REMOVED***
    else {

        var select = "";
        var data = $('#clasificacion').data('OG' + annio + '-' + $.trim(entidad).replace(/ /g, '_'))
        if (data) {
            select = select + '<option value="">Todos los Proyectos/Actividades</option>';
            for (var i = 0; i < data.length; i++) {
                select = select + '<option value="' + data[i].proyectoActividad.toString() + '">' + data[i].proyectoActividad.toString() + '</option>';
        ***REMOVED***
            $('#proyectoActividadOG').html(select).fadeIn();
            $("#selectProyectoActividadOG").prop("class", "selectBlue");
            $('#DistribucionObjetoGasto').attr('nivel', 2);
            treeMapCombosOG(items_result, "treeMapCombosOG", "proyectoActividad", "totalProyectoActividad");
    ***REMOVED***
            else { 
            $.ajax({
                url: "api/serviciospresupuesto/ComboProyectoActividadOG/",
                type: "GET",
                data: param,

        ***REMOVED***).done(function (data) {


                var items_result = data.infoGrafica;
               
                select = select + '<option value="">Todos los Proyectos/Actividades</option>';
                for (var i = 0; i < items_result.length; i++) {
                    select = select + '<option value="' + items_result[i].proyectoActividad.toString() + '">' + items_result[i].proyectoActividad.toString() + '</option>';
            ***REMOVED***
                $('#proyectoActividadOG').html(select).fadeIn();
               

                $('#proyectoActividadOG').attr('data-OG' + annio + '-' + $.trim(entidad).replace(/ /g, '_'), JSON.stringify(items_result));


                //$("#proyectoActividad").prop("disabled", false);
                $("#selectProyectoActividadOG").prop("class", "selectBlue");
                $('#DistribucionObjetoGasto').attr('nivel', 2);
                treeMapCombosOG(items_result, "treeMapCombosOG", "proyectoActividad", "totalProyectoActividad");
                //$("#clasePrograma").val("");

        ***REMOVED***).fail(function (handleError) {
                // Some function
                alert("Error selectProyectoActividadOG");
                console.log(handleError);
        ***REMOVED***);
    ***REMOVED***

***REMOVED***
***REMOVED***

function GetComboObjetoGasto(annio, entidad, proyectoActividad) {
    var param = "annio=" + annio + "&entidad=" + entidad + "&proyectoActividad=" + proyectoActividad;
    if (proyectoActividad == "") {

        //$("#proyectoActividad").prop("disabled", true);
        //$("#proyectoActividad").val("");
        $("#selectObjetoGasto").prop("class", "selectDis");

***REMOVED***
    else {

        var data = $('#objetoGasto').data('OG'+annio +  '-' + $.trim(entidad).replace(/ /g, '_') + '-' + $.trim(proyectoActividad).replace(/ /g, '_'));
        if (data) {
            $("#selectObjetoGasto").prop("class", "selectBlue");
            $('#DistribucionObjetoGasto').attr('nivel', 3);
            treeMapCombosOG(data, "treeMapCombosOG", "labelGroup", "totalPresupuesto");
    ***REMOVED***
        //    else { 
        $.ajax({
            url: "api/serviciospresupuesto/ComboObjetoGasto/",
            type: "GET",
            data: param,

    ***REMOVED***).done(function (data) {


            var items_result = data.infoGrafica;


            $('#ObjetoGasto').attr('data-OG' + annio +  '-' + $.trim(entidad).replace(/ /g, '_') + '-' + $.trim(proyectoActividad).replace(/ /g, '_'), JSON.stringify(items_result));


            //$("#proyectoActividad").prop("disabled", false);
            $("#selectObjetoGasto").prop("class", "selectBlue");
            $('#DistribucionObjetoGasto').attr('nivel', 3);
            treeMapCombosOG(items_result, "treeMapCombosOG", "labelGroup", "totalPresupuesto");
            //$("#clasePrograma").val("");

    ***REMOVED***).fail(function (handleError) {
            // Some function
            alert("Error GetComboObjetoGasto");
            console.log(handleError);
    ***REMOVED***);
        /****REMOVED****/

***REMOVED***
***REMOVED***

function elegirChangeOG(nivel, consulta) {
    //alert(nivel + "  " + consulta);
    if (nivel == 1) {

        GetComboEntidadOG($("#annioPresupuesto option:selected").val());
***REMOVED***
    if (nivel == 2) {

        $("#entidadOG").val(consulta);
        changeEntidadOG(consulta)
***REMOVED***
    if (nivel == 3) {
        $("#proyectoActividadOG").val(consulta);
        changeProyectoActividadOG(consulta)
***REMOVED***
***REMOVED***

function changeEntidadOG(consulta) {
    $("#proyectoActividad").prop("disabled", true);
    $("#proyectoActividad").val("");
    $("#selectProyectoActividad").prop("class", "selectDis");
    $("#selectObjetoGasto").prop("class", "selectDis");
    GetComboProyectoActividadOG($("#annioPresupuesto option:selected").val(),consulta);
***REMOVED***

function changeProyectoActividadOG(consulta) {

    $("#selectObjetoGasto").prop("class", "selectDis");
    GetComboObjetoGasto($("#annioPresupuesto option:selected").val(), $("#entidadOG option:selected").val(), consulta);
***REMOVED***

$(document).ready(function () {
    ///Eventos enlaces grafica Distribucion del gasto treemap
    $('#topSectores').click(function () {

        GetTreeMap($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);
    $('#todosSectores').click(function () {
        if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#todosEntidades").removeClass("bg-active"); $("#todosEntidades").addClass("bg-noactive"); ***REMOVED***
        GetTreeMap($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);
    $('#todosEntidades').click(function () {
        if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#todosSectores").removeClass("bg-active"); $("#todosSectores").addClass("bg-noactive"); ***REMOVED***
        GetTreeMap($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);

    $('#btnVolverDP').click(function () {
        GetTreeMap($("#Distribucion").attr("consulta"), $("#annioPresupuesto option:selected").val());
***REMOVED***);

    // Eventos enlaces grafica 2
    $('#topSectoresG').click(function () {
        if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#todosSectoresG").removeClass("bg-active"); $("#todosSectoresG").addClass("bg-noactive"); ***REMOVED***
        GetGastoSectores($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);
    $('#todosSectoresG').click(function () {
        if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#topSectoresG").removeClass("bg-active"); $("#topSectoresG").addClass("bg-noactive"); ***REMOVED***
        GetGastoSectores($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);

    // Eventos enlaces grafica 3
    $('#topSectoresPSAA').click(function () {
        //alert($(this).attr("id"));
        if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#todosSectoresPSAA").removeClass("bg-active"); $("#todosSectoresPSAA").addClass("bg-noactive"); ***REMOVED***
        $('#version1').attr('consulta', $(this).attr("cons"));
        GetDatosGastoPresupuestalSolicitadoVAprobado($(this).attr("cons"), $("#annioPresupuesto option:selected").val(), $("#version1 option:selected").val(), $("#version2 option:selected").val());
***REMOVED***);
    $('#todosSectoresPSAA').click(function () {
        //alert($("#todosSectoresPSA").hasClass("bg-noactive"));
       
        if ($(this).hasClass("bg-noactive")) { 
            $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#topSectoresPSAA").removeClass("bg-active"); $("#topSectoresPSAA").addClass("bg-noactive");
    ***REMOVED***
        $('#version1').attr('consulta', $(this).attr("cons"));
        GetDatosGastoPresupuestalSolicitadoVAprobado($(this).attr("cons"), $("#annioPresupuesto option:selected").val(), $("#version1 option:selected").val(), $("#version2 option:selected").val());
***REMOVED***);

    // Eventos enlaces grafica 3
    $('#ultimos5APT').click(function () {
      //  if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#annioPT").removeClass("bg-active"); $("#annioPT").addClass("bg-noactive"); ***REMOVED***
        GetDatosGastoPresupuestalTiempo($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);
    $('#annioPT').click(function () {
        if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#ultimos5APT").removeClass("bg-active"); $("#ultimos5APT").addClass("bg-noactive"); ***REMOVED***
        GetDatosGastoPresupuestalTiempo($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);


    // Eventos enlaces grafica grupo de gasto
    $('#topGruposG').click(function () {
        if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#todosGruposG").removeClass("bg-active"); $("#todosGruposG").addClass("bg-noactive"); ***REMOVED***
        GetGrupoDeGasto($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);
    $('#todosGruposG').click(function () {
        if ($(this).hasClass("bg-noactive")) { $(this).removeClass("bg-noactive"); $(this).addClass("bg-active"); $("#topGruposG").removeClass("bg-active"); $("#topGruposG").addClass("bg-noactive"); ***REMOVED***
        GetGrupoDeGasto($(this).attr("cons"), $("#annioPresupuesto option:selected").val());
***REMOVED***);


    $("#clasificacion").on("change", function (event) {
        if ($(this).val() == "") {
            elegirChange(1,"");
    ***REMOVED***
        else {
            elegirChange(2, $(this).val());//changeClasificacion($(this).val());
    ***REMOVED***
***REMOVED***);

    $("#entidad").on("change", function (event) {
        /*      alert($("#selectClasePrograma option:selected").val());*/
        // changeEntidad($(this).val());
        if ($(this).val() == "") {
            elegirChange(2, $("#clasificacion option:selected").val());
    ***REMOVED***
        else {
            elegirChange(3, $(this).val());//changeClasificacion($(this).val());
    ***REMOVED***
***REMOVED***);

    $("#clasePrograma").on("change", function (event) {
    /*      alert($("#selectClasePrograma option:selected").val());*/
       // changeClasePrograma($(this).val());

        if ($(this).val() == "") {
            elegirChange(3, $("#entidad option:selected").val());
    ***REMOVED***
        else {
            elegirChange(4, $(this).val());//changeClasificacion($(this).val());
    ***REMOVED***
***REMOVED***);




    $("#annioPresupuesto").on("change", function (event) {
        inicializaDatos();
***REMOVED***);

    $("#version1").on("change", function (event) {
        //alert($("#version1 option:selected").val());
        GetDatosGastoPresupuestalSolicitadoVAprobado($('#version1').attr('consulta'), $("#annioPresupuesto option:selected").val(), $("#version1 option:selected").val(), $("#version2 option:selected").val());
***REMOVED***);

    $("#version2").on("change", function (event) {
        GetDatosGastoPresupuestalSolicitadoVAprobado($('#version1').attr('consulta'), $("#annioPresupuesto option:selected").val(), $("#version1 option:selected").val(), $("#version2 option:selected").val());
***REMOVED***);
    

    $('#btnVolver').click(function () {
        nivel = $('#DistribucionProgramas').attr('nivel')*1-1
        if (nivel == 1) {
            elegirChange(1, "");
    ***REMOVED***
        if (nivel == 2) {
            elegirChange(2, $("#clasificacion option:selected").val());
    ***REMOVED***
        if (nivel == 3) {
            elegirChange(3, $("#entidad option:selected").val());
    ***REMOVED***
        //if (nivel == 4) {
        //    elegirChange(1, "");
        //***REMOVED***
***REMOVED***);

    $('#btnLimpiar').click(function () {
       
            elegirChange(1, "");
       
***REMOVED***);



    $("#entidadOG").on("change", function (event) {
        if ($(this).val() == "") {
            elegirChangeOG(1, "");
    ***REMOVED***
        else {
            elegirChangeOG(2, $(this).val());//changeClasificacion($(this).val());
    ***REMOVED***
***REMOVED***);

    $("#proyectoActividadOG").on("change", function (event) {
        /*      alert($("#selectClasePrograma option:selected").val());*/
        // changeEntidad($(this).val());
        if ($(this).val() == "") {
            elegirChangeOG(2, $("#entidadOG option:selected").val());
    ***REMOVED***
        else {
            elegirChangeOG(3, $(this).val());//changeClasificacion($(this).val());
    ***REMOVED***
***REMOVED***);

    $('#btnVolverOG').click(function () {
        nivel = $('#DistribucionObjetoGasto').attr('nivel') * 1 - 1
        if (nivel == 1) {
            elegirChangeOG(1, "");
    ***REMOVED***
        if (nivel == 2) {
            elegirChangeOG(2, $("#entidadOG option:selected").val());
    ***REMOVED***

***REMOVED***);

    $('#btnLimpiarOG').click(function () {

        elegirChangeOG(1, "");

***REMOVED***);

***REMOVED***);

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
