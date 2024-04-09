var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
inicializaDatos();
//Treemap primera grafica Distribucion del presupuesto
var globales = [];
var globales_org = [];
var globales_gasto = [];
var globales_entidad = [];
var cantXPagina = 6;
var anyo_actual = $("#annioPresupuesto option:selected").val();

if ($("#chk_gasto_" + anyo_actual).length > 0) {
    document.getElementById("chk_gasto_" + anyo_actual).checked = true;
***REMOVED***

if ($("#chk_func_" + anyo_actual).length > 0) {
    document.getElementById("chk_func_" + anyo_actual).checked = true;
***REMOVED***

getConsolidadoPeriodosNew(anyo_actual);
//----------------------------------------
ObtenerFuncionesPeriodo(anyo_actual);
getFuncionesGobiernoGraphic();
//----------------------------------------
getVersionesIniPerAnyo(anyo_actual);
//----------------------------------------
ObtenerGruposGastoPerPeriodo(anyo_actual);
getGrupoGastoGraphic();

//----------------------------------------
GetRecursosPorNivel(anyo_actual);
//----------------------------------------
ObtenerDatosListadoPerGasto(anyo_actual);
//----------------------------------------
//GetEntidadesPresupuesto();
//GetEntidadesPresupuestoNoAlcaldias();


function inicializaDatos() {
    configuraTabRecursos();
    configuraCheckFunciones();
    configuraCheckGasto();
    configuraSelectPeriodo();
    $("#annioPresupuestoText").html("" + $("#annioPresupuesto option:selected").val());
    configuraFiltro_DesgloseIconos();
    configuraSelectVersiones();
    configuraSelectFunciones();
    
***REMOVED***

function getVersionesIni() {
    var base_sel = $("#versionBase option:eq(0)").val();

    if ($("#versionBase").children.length > 0) {
        $("#versionBase option:eq(0)").attr("selected", "selected");
***REMOVED***
    if ($("#versionComparacion").children.length > 1) {
        //$('#versionComparacion option[value=' + base_sel + ']').hide();
        $("#versionComparacion option:eq(1)").attr("selected", "selected");

***REMOVED***
    getDataVersiones();
***REMOVED***


function getFuncionesIni() {
    if ($("#funcionesId").children.length > 0) {
        $("#funcionesId option:eq(0)").attr("selected", "selected");
***REMOVED***
    if ($("#funcionesId_2").children.length > 0) {
        $("#funcionesId_2 option:eq(0)").attr("selected", "selected");

***REMOVED***
    if ($("#funcionesId_3").children.length > 0) {
        $("#funcionesId_3 option:eq(0)").attr("selected", "selected");

***REMOVED***
    if ($("#funcionesId_4").children.length > 0) {
        $("#funcionesId_4 option:eq(0)").attr("selected", "selected");

***REMOVED***
    if ($("#funcionesId_5").children.length > 0) {
        $("#funcionesId_5 option:eq(0)").attr("selected", "selected");

***REMOVED***
    //getFuncionesGobiernoGraphic();
***REMOVED***

function getGruposGastoIni() {
    $(".selectGasto").each(function () {
        //$(this).addClass("foo");
        if ($(this).children.length > 0) {
            var id = $(this).attr("id");
            var str = id + "option:eq(0)";
            $(str).attr("selected", "selected");
    ***REMOVED***
***REMOVED***);

    
***REMOVED***


function configuraSelectFunciones() {
    $('.selectFuncion').on('change', function () {
        getFuncionesGobiernoGraphic("btn");
***REMOVED***);


$('#btnCompararFunc').click(function (e) {
        var cont = 0;
        $(".selectFuncion option:selected").each(function () {
            if ($(this).val() != "") {
                cont += 1;
        ***REMOVED***
    ***REMOVED***);
        if (cont == 0) {
            alert("Debe seleccionar al menos 1 función");
    ***REMOVED*** else {
            getFuncionesGobiernoGraphic("btn");
    ***REMOVED***
        //getFuncionesGobiernoGraphic("btn");
***REMOVED***);
***REMOVED***

function configuraSelectGrupos() {
    $(".selectGasto").on("change", function () {
        getGrupoGastoGraphic("btn");
***REMOVED***);
***REMOVED***


function configuraFiltro_DesgloseIconos() {
    $(".tipo_grafica").click(function (e) {
        $("#divPagFichas").html("");
        var tipo = $(this).attr('codigo');
        $(".tipo_grafica").removeClass("activo");
        $(this).addClass("activo");
        $("#filtro_iconos").attr("opc", tipo);
         if (tipo == "gasto") {
            ObtenerDatosListadoPerGasto(anyo_actual);

    ***REMOVED*** else {
            ObtenerDatosListadoPerEntidad(anyo_actual);
    ***REMOVED***

***REMOVED***);
***REMOVED***


function getFuncionesGobiernoGraphic(origen) {
    var cont = 0;
    var periodos = "";
    $("input:checkbox[class=chk_gasto_func]:checked").each(function () {
        periodos += $(this).val() + ",";
***REMOVED***);
    periodos = periodos.replace(/,\s*$/, "");

    var funciones = "";
    $(".selectFuncion option:selected").each(function () {
        funciones += $(this).val() + ",";
        if ($(this).val() != "") {
            cont += 1;
    ***REMOVED***
***REMOVED***);
    funciones = funciones.replace(/,\s*$/, "");
    if (origen == "btn") {
        if (cont == 0) {
            $("#topGruposFuncionesGob").text("Top Funciones");
    ***REMOVED*** else {
            $("#topGruposFuncionesGob").text("Comparativo Funciones");
    ***REMOVED***
        GetGrupoDeFuncionesGob(periodos, anyo_actual, funciones);

***REMOVED*** else {
        $("#topGruposFuncionesGob").text("Top Funciones");
        GetGrupoDeFuncionesGob(periodos, anyo_actual, null);
***REMOVED***
    

***REMOVED***

function getGrupoGastoGraphic(origen) {
    var cont = 0;
    var periodos = "";
    $("input:checkbox[class=chk_gasto]:checked").each(function () {
        periodos += $(this).val() + ",";
***REMOVED***);
    periodos = periodos.replace(/,\s*$/, "");
    var select_gasto = "";
    $(".selectGasto option:selected").each(function () {
        select_gasto += $(this).val() + ",";
        if ($(this).val() != "") {
            cont += 1;
    ***REMOVED***
***REMOVED***);
    select_gasto = select_gasto.replace(/,\s*$/, "");

    if (origen == "btn") {
        if (cont == 0) {
            $("#topGruposG").text("Top Grupos");
    ***REMOVED*** else {
            $("#topGruposG").text("Comparativo Grupos");
    ***REMOVED***
        GetGrupoDeGasto(periodos, anyo_actual, select_gasto);

***REMOVED*** else {
        $("#topGruposG").text("Top Grupos");
        GetGrupoDeGasto(periodos, anyo_actual, null);
***REMOVED***

    //GetGrupoDeGasto(periodos,anyo_actual,select_gasto);

***REMOVED***

function configuraCheckFunciones() {
    $('.chk_gasto_func').click(function () {
        var cont = 0;
        $(".selectFuncion option:selected").each(function () {
            if ($(this).val() != "") {
                cont += 1;
        ***REMOVED***
    ***REMOVED***);
        if (cont == 0) {
            getFuncionesGobiernoGraphic();
    ***REMOVED*** else {
            getFuncionesGobiernoGraphic("btn");
    ***REMOVED*** 
        //getFuncionesGobiernoGraphic();

***REMOVED***);
***REMOVED***

function configuraCheckGasto() {
    $('.chk_gasto').click(function () {
        var cont = 0;
        $(".selectGasto option:selected").each(function () {
            if ($(this).val() != "") {
                cont += 1;
        ***REMOVED***
    ***REMOVED***);
        if (cont == 0) {
            getGrupoGastoGraphic();
    ***REMOVED*** else {
            getGrupoGastoGraphic("btn");
    ***REMOVED***
***REMOVED***);
***REMOVED***

function configuraSelectPeriodo(){
    $('#annioPresupuesto').on('change', function () {
        anyo_actual = this.value;
        $(".chk_gasto").prop("checked", false);
        $(".chk_gasto_func").prop("checked", false);


        $("#annioPresupuestoText").html("" + anyo_actual);
        if ($("#chk_gasto_" + anyo_actual).length > 0) {
            document.getElementById("chk_gasto_" + anyo_actual).checked = true;
    ***REMOVED***

        if ($("#chk_func_" + anyo_actual).length > 0) {
            document.getElementById("chk_func_" + anyo_actual).checked = true;
    ***REMOVED***


        $("#versionBase").empty();
        $("#versionComparacion").empty();

        getConsolidadoPeriodosNew(anyo_actual);
        $("#divGraphVersiones").empty();
        getVersionesIniPerAnyo(anyo_actual);
        getFuncionesGobiernoGraphic();
        getGrupoGastoGraphic();
        GetRecursosPorNivel(anyo_actual);
        ObtenerDatosListadoPerGasto(anyo_actual);
        ObtenerFuncionesPeriodo(anyo_actual);
        ObtenerGruposGastoPerPeriodo(anyo_actual);

***REMOVED***)

***REMOVED***

function ObtenerFuncionesPeriodo(anyo_actual){
    $("#funcionesId").empty();
    $("#funcionesId_2").empty();
    $("#funcionesId_3").empty();
    $("#funcionesId_4").empty();
    $("#funcionesId_5").empty();
    
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/ObtenerFuncionesPerNombre",
        type: "GET",
        data: {
            anyo: anyo_actual,
            filtro:null
    ***REMOVED***
***REMOVED***).done(function (data) {
        var result = data.funciones;
        var str_cad = "";
        if (result != null) {
            if (result.length > 0) {
                str_cad += '<option value="">Seleccione una función del gobierno</option>';
                for (var i = 0; i < result.length; i++) {
                    str_cad += '<option value="' + result[i].label + '">' + result[i].label + '</option>';
            ***REMOVED***
                $("#funcionesId").html(str_cad);
                $("#funcionesId_2").html(str_cad);
                $("#funcionesId_3").html(str_cad);
                $("#funcionesId_4").html(str_cad);
                $("#funcionesId_5").html(str_cad);
                getFuncionesIni();
                $("#btnCompararFunc").attr("disabled", false);
        ***REMOVED***
    ***REMOVED***
***REMOVED***).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);

***REMOVED***

function ObtenerGruposGastoPerPeriodo(anyo_actual) {
    $("#divGastoCombos").empty();

    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/ObtenerGrupoGastoPerNombre",
        type: "GET",
        data: {
            anyo: anyo_actual,
            filtro: null
    ***REMOVED***
***REMOVED***).done(function (data) {
        var result = data.gruposGasto;
        var str_cad = "";
        if (result != null) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    str_cad += '<div class="form-group">';
                    str_cad += '<div class="form-group subtitle">';
                    if (i == 0) {
                        str_cad += '<label for="funcionesId" style="color:black;float:left;">Seleccionar Grupos de Gasto</label>';

                ***REMOVED***
                    
                    str_cad += '<select class="form-select selectGasto" aria-label="Selecciona un grupo:" id="GrupoId_' + i + '">';
                    for (var j = 0; j < result.length; j++) {
                        if (j == 0) {
                            str_cad += '<option value="">Seleccione un grupo de gasto</option>';
                    ***REMOVED***
                        str_cad += '<option value="' + result[j].label + '">' + result[j].label + '</option>';
                ***REMOVED***
                    str_cad += '</select>';
                    str_cad += '</div>';
                    str_cad += '</div>';
            ***REMOVED***
                $("#divGastoCombos").html(str_cad);
                configuraSelectGrupos();
                getGruposGastoIni();
                
        ***REMOVED***
    ***REMOVED***
***REMOVED***).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);

***REMOVED***

function getVersionesIniPerAnyo(anyo_actual) {
    $("#versionBase").empty();
    $("#versionComparacion").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/getVersionesPerAnyo",
        type: "GET",
        data: {
            anyo: anyo_actual
    ***REMOVED***
***REMOVED***).done(function (data) {
        var result = data.versiones;
        var str_cad = "";
        if (result != null) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) 
                {
                    str_cad += '<option value="' + result[i].codigoVersion + '">' + result[i].nombreVersion + '</option>';
            ***REMOVED***
                $("#versionBase").html(str_cad);
                $("#versionComparacion").html(str_cad);
                getVersionesIni();
                

        ***REMOVED*** 
    ***REMOVED***
***REMOVED***).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);

    
***REMOVED***

function getDataVersiones() {
    var versiones = "";
    $(".selVersiones").each(function () {
        versiones += $(this).val() + ",";
***REMOVED***);
    versiones = versiones.replace(/,\s*$/, "");
    
    GetGrupoDeGastoPerVersiones(versiones, anyo_actual);
***REMOVED***

function configuraSelectVersiones() {
    $('#versionBase,#versionComparacion').bind("change", function (event) {
        getDataVersiones();
***REMOVED***);
***REMOVED***


function getConsolidadoPeriodosNew(anyo_actual) {
    $("#divDatosConsolidado").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/GetConsolidadoPeriodos",
        type: "GET",
        data: {
            anyo: anyo_actual
    ***REMOVED***
***REMOVED***).done(function (data) {
        var result = data.infoConsolidado;
        var str_cad = "";
        if (result != null) {
            if (result.length > 0) {
                getStrBarrasPerPeriodo(result, anyo_actual);
        ***REMOVED*** else {
                $("#divDatosConsolidado").html("<span class='lblErrorNoData'>Información No Disponible</span>");

        ***REMOVED***
            

    ***REMOVED***
***REMOVED***).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);


***REMOVED***

function getStrBarrasPerPeriodo(result, anyo_actual) {
    var cantxfila = 3;
    var bandera = false;
    var k = 0;
    var str_cad = "";
    str_cad += '<div class="row">';
    str_cad += '<div class="col-md-12">';
    str_cad += '<div class="card shadow border-0 card-entidad ">';
    str_cad += '<div class="card-body">';


    for (var i = 0; i < result.length; i++) {
        var residuo = (i - 1) % cantxfila;
        var periodo = result[i].periodo;
        var aprobado = result[i].aprobado;
        var ejecutado = result[i].ejecutado;
        var vigente = result[i].vigente;

        var porcentaje_ejecutado = (Math.round((ejecutado / vigente) * 100, 1)).toString() + "%";
        /*var porcentaje_vigente = (Math.round((vigente / vigente) * 100, 1)).toString() + "%";*/

        if (aprobado != null && aprobado != undefined) {
            aprobado = (aprobado / 1000000).formatMoney(1, '.', ',').toString();
    ***REMOVED***

        if (ejecutado != null && ejecutado != undefined) {
            ejecutado = (ejecutado / 1000000).formatMoney(1, '.', ',').toString();
    ***REMOVED***

        if (vigente != null && vigente != undefined) {
            vigente = (vigente / 1000000).formatMoney(1, '.', ',').toString();
    ***REMOVED***


        if (periodo == anyo_actual) {
            str_cad += '<div class="row">';
            str_cad += '<div class="col-md-8 offset-3 prescontainer">';
            str_cad += '<div class="ico_press">';
            str_cad += '<img src="../img/svg-icons/ico_Lempiras.svg" />';
            str_cad += '</div>';
            str_cad += '<span class="h4">Año ' + result[i].periodo + '</span></br>';
            str_cad += '<span class="h3">Presupuesto aprobado</span></br>';
            str_cad += '<span class="h2">L ' + aprobado + ' Millones</span></br></br>';
            str_cad += '<span class="h4">Presupuesto Vigente</span></br>';
            str_cad += '<span class="h3">L ' + vigente + ' Millones</span></br>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '<div class="row">';
            str_cad += '<div class="col-md-12">';
            str_cad += '<div class="grapbarBorder">';
            //str_cad += '<div class="h5 pgray text-center">Presupuesto Vigente: L ' + vigente + ' Millones  </div>';
            str_cad += '<div class="row">';
            str_cad += '<div class="col-md-3">';
            str_cad += '<span class="h4 pgreen text-center ">Presupuesto Ejecutado</br><strong>L ' + ejecutado + ' Millones</strong></span>';
            str_cad += '</div>';
            str_cad += '<div class="col-md-9">';
            str_cad += '<div class="progesscontainer pgreen">';
            str_cad += '<div class="progress" style="height: 24px;">';
            str_cad += '<div class="bg-proexec" role="progressbar" style="width: ' + porcentaje_ejecutado + ';" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"> ' + porcentaje_ejecutado + '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
            
            

            //str_cad += '<div class="grapbar">';
            //str_cad += '<div class="h6 pgray">Presupuesto Vigente: L ' + vigente + ' Millones</div>';
            //str_cad += '<div class="progesscontainer pgray">';
            //str_cad += '<div class="progress" style="height: 24px;">';
            //str_cad += '<div class="bg-provig" role="progressbar" style="width: ' + porcentaje_vigente + ';" aria-valuemin="0" aria-valuemax="100"></div>';
            //str_cad += '</div>';
            //str_cad += '</div>';
            //str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
            str_cad += '</div>';
    ***REMOVED***
        else {
            
            if (residuo == 0) {
                k = 0;
                str_cad += '<div class="row justify-content-center">';
        ***REMOVED***

            str_cad += '<div class="col-md-4 prescontainer oldpres">';
            str_cad += '<span class="h5 oldpres"><strong>Año ' + result[i].periodo + '</strong></span></br>';
            str_cad += '<span class="h5 oldpres"><strong>Presupuesto aprobado</strong></span></br>';
            str_cad += '<span class="h5 oldpres"><strong>L ' + aprobado + ' Millones</strong></span></br>';

            str_cad += '<div class="grapbar">';
            str_cad += '<span class="h5 pgray"><strong>Presupuesto Vigente</strong></br><strong>L ' + vigente + ' Millones</strong></strong></br></br>';
            str_cad += '<div class="h5 pgreen">Presupuesto Ejecutado</br><strong>L ' + ejecutado + ' Millones</strong></div></br>';
                str_cad += '<div class="progesscontainer pgreen">';
                str_cad += '<div class="progress" style="height: 24px;">';
                str_cad += '<div class="bg-proexec" role="progressbar"  style="width: ' + porcentaje_ejecutado + ';" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"><span class="lblporc"> ' + porcentaje_ejecutado + '</span></div>';
                str_cad += '</div>';
                str_cad += '</div>';

                //tr_cad += '<div class="grapbar">';
                //str_cad += '<div class="progesscontainer pgray">';
                //str_cad += '<div class="progress" style="height: 24px;">';
                //str_cad += '<div class="bg-provig" role="progressbar" style="width: ' + porcentaje_vigente + ';" aria-valuemin="0" aria-valuemax="100"></div>';
                //str_cad += '</div>';
                //str_cad += '</div>';
                //str_cad += '</div>';
                str_cad += '</div>';
                str_cad += '</div>';

                k = k + 1;

            if (k == cantxfila) {
                str_cad += '</div>';
        ***REMOVED***

    ***REMOVED***

        

***REMOVED***

    str_cad += '</div>';
    str_cad += '</div>';
    str_cad += '</div>';
    str_cad += '</div>';
    //str_cad += '</div>';


    $("#divDatosConsolidado").html(str_cad);

***REMOVED***

function getConsolidadoPeriodos(anyo_actual) {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/GetConsolidadoPeriodos",
        type: "GET"
***REMOVED***).done(function (data) {
        var result = data.infoConsolidado;
        var str_cad = "";
        if (result != null) {
            for (var i = 0; i < result.length; i++) {
                var periodo = result[i].periodo;
                var aprobado = result[i].aprobado;
                var ejecutado = result[i].ejecutado;
                var vigente = result[i].vigente;

                var porcentaje_ejecutado = (Math.round((ejecutado / aprobado) * 100, 1)).toString() + "%";
                var porcentaje_vigente = (Math.round((vigente / aprobado) * 100, 1)).toString() + "%";

                if (aprobado != null && aprobado != undefined) {
                    aprobado = (aprobado / 1000000).formatMoney(1, '.', ',').toString();
            ***REMOVED***

                if (ejecutado != null && ejecutado != undefined) {
                    ejecutado = (ejecutado / 1000000).formatMoney(1, '.', ',').toString();
            ***REMOVED***

                if (vigente != null && vigente != undefined) {
                    vigente = (vigente / 1000000).formatMoney(1, '.', ',').toString();
            ***REMOVED***

                if (i == result.length - 1) {
                    str_cad += '<div class="prescontainer">';
            ***REMOVED*** else {
                    str_cad += '<div class="prescontainer-noborder">';
            ***REMOVED***
                
                str_cad += '<div class="col-md-4">';
                if (periodo == anyo_actual) {
                    str_cad += '<div class="h5">Año ' + result[i].periodo + '</div>';
                    str_cad += '<div class="h1">L ' + aprobado + ' Millones</div>';
                    str_cad += '<div class="h4">Presupuesto aprobado</div>';
            ***REMOVED*** else {
                    str_cad += '<div class="h5 oldpres">Año ' + result[i].periodo + '</div>';
                    str_cad += '<div class="h1 oldpres">L ' + aprobado + ' Millones</div>';
                    str_cad += '<div class="h4 oldpres">Presupuesto aprobado</div>';

            ***REMOVED***
                
                str_cad += '</div>';
                str_cad += '<div class="col-md-8">';
                str_cad += '<div class="grapbar">';
                str_cad += '<div class="h6 ">Presupuesto Ejecutado: L ' + ejecutado + ' Millones</div>';
                str_cad += '<div class="progress" style="height: 30px;">';
                str_cad += '<div class="bg-proexec" role="progressbar" style="width: ' + porcentaje_ejecutado   + ';" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>';
                str_cad += '</div>';
                str_cad += '</div>';
                str_cad += '<div class="grapbar">';
                str_cad += '<div class="h6 progvig">Presupuesto Vigente: L ' + vigente + ' Millones</div>';
                str_cad += '<div class="progress" style="height: 30px;">';
                str_cad += '<div class="bg-provig" role="progressbar" style="width: ' + porcentaje_vigente + ';" aria-valuemin="0" aria-valuemax="100"></div>';
                str_cad += '</div>';
                str_cad += '</div>';
                str_cad += '</div>';
                str_cad += '</div>';
        ***REMOVED***

            $("#divDatosConsolidado").html(str_cad);

    ***REMOVED***
***REMOVED***).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);
***REMOVED***

function configuraTabRecursos() {
    $('#todosOrganismo').click(function () {
        if ($(this).hasClass("bg-noactive")) {
            $(this).removeClass("bg-noactive");
            $(this).addClass("bg-active");
            $("#todosNivel").removeClass("bg-active");
            $("#todosNivel").addClass("bg-noactive");
    ***REMOVED***
        globales_org = [];
        GetRecursosPorOrganismo(anyo_actual);
       
***REMOVED***);
    $('#todosNivel').click(function () {
        if ($(this).hasClass("bg-noactive")) {
            $(this).removeClass("bg-noactive");
            $(this).addClass("bg-active");
            $("#todosOrganismo").removeClass("bg-active");
            $("#todosOrganismo").addClass("bg-noactive");
    ***REMOVED***
        globales = [];
        GetRecursosPorNivel(anyo_actual);
***REMOVED***);
***REMOVED***

function GetGrupoDeFuncionesGob(periodos, annio,filtro) {
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/ServiciosPresupuestoNew/ObtenerInfoPerFuncionesGob",
        type: "GET",
        data: {
            filtro_periodos: periodos,
            anyo: annio,
            filtro_func:filtro

    ***REMOVED***

***REMOVED***).done(function (data) {
        var result = data.infoRecursos;
        loadBarChartFuncionesGob(result, "divGraphFuncionesGob");
***REMOVED***).fail(function (handleError) {
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***

function GetGrupoDeGasto(periodos,annio,grupos) {
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/ServiciosPresupuestoNew/ObtenerInfoPerGrupoDeGasto",
        type: "GET",
        data: {
            filtro_periodos: periodos,
            anyo: annio,
            filtro_gasto:grupos
    ***REMOVED***

***REMOVED***).done(function (data) {
        var result = data.infoRecursos;
        loadBarChartGrupoDeGasto(result, "divGraphGrupoGasto");
***REMOVED***).fail(function (handleError) {
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***


function GetRecursosPorNivel(anyo) {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/GetRecursosPerNivel",
        type: "GET",
        data: {
            anyo: anyo
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


function GetRecursosPorOrganismo(anyo) {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosPresupuestoNew/GetRecursosPerOrganismo",
        type: "GET",
        data: {
            anyo: anyo
    ***REMOVED***
***REMOVED***).done(function (data) {
        if (data.infoRecursos != null) {
            globales_org = data.infoRecursos;
            $("#divGraphRecursosObj").empty();
            loadRecursosPorObjetoPerOrganismo(data.infoRecursos, 0);
    ***REMOVED***
***REMOVED***).fail(function (xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + "_" + thrownError);
***REMOVED***);

***REMOVED***

//graficoTreemapRecursosxNiveles
function assignColor(indice) {
    var colores_default = ["#7CBAC9", "#FBC99A", "#57BEC3", "#F7B6A7"];
    return colores_default[indice];
***REMOVED***

function assignColorBarras(item) {
    var colores_default = ['#89CFE0', '#276D7E', '#FDD36A','#FBC99A'];
    return colores_default[item];

***REMOVED***

function assignColorBarrasFunc(item) {
    var colores_default = ['#ED6A60', '#7CBAC9', '#F7B6A7', '#DD89B9'];
    return colores_default[item];

***REMOVED***

function assignColorBarrasVersiones(item) {
    var colores_default = ['#7CBAC9', '#F7B6A7', '#FBC99A', '#ED6A60', '#F6B5C4','#42B073'];
    return colores_default[item];

***REMOVED***

function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
***REMOVED***

function loadRecursosPorObjetoPerOrganismo(objData, nivel) {
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

                    var index_aux = distintos.indexOf(d.labelGroup);
                    return assignColor(index_aux);
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
                        loadRecursosPorObjetoPerOrganismo(globales_org, 0);
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
                                cad = d.labelGroup;
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
                            cad += "<span>Recursos asignados " + "L " + valor.formatMoney(0, '.', ',').toString() + " Millones" + "</span></br>";
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

function loadRecursosPorObjetoNivel(objData, nivel) {
    $("#todosNivel").text("Nivel");
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
                if (current == 1) {
                    $("#todosNivel").text("Entidad");

            ***REMOVED*** else {
                    $("#todosNivel").text("Nivel");
            ***REMOVED***

                $(".d3plus-viz-back").click(function () {
                    var depth_aux = grafica.depth();
                    //console.log("btn_atras|| nivel " + nivel + " || depth" + depth_aux);
                    $("#divGraphRecursosObj").attr("nivel", depth_aux.toString());
                    if (depth_aux == 1) {
                        $("#todosNivel").text("Entidad");

                ***REMOVED*** else {
                        $("#todosNivel").text("Nivel");
                ***REMOVED***

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
                    traduc_aux = "Clic para expandir por Instituciones";
            ***REMOVED*** else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
            ***REMOVED***else {
                    traduc_aux = d;
            ***REMOVED***
                return traduc_aux;
        ***REMOVED***)
            .config({
                data:objData,
                groupBy: ["labelGroup", "label"],
                tooltipConfig: {
                    title: function (d) {
                        var depth_aux = grafica.depth();
                        var longitud = 80;
                        var cad = d.labelGroup;
                        switch (depth_aux) {
                            case 1:
                                cad = "Entidad: " + d.label;
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
                            cad += "<span>Recursos asignados " + "L " + valor.formatMoney(0, '.', ',').toString() + " Millones" + "</span></br>";
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


function loadBarChartFuncionesGob(objData, divContenedor) {
    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
            var distintos = objData.map(item => item.periodo)
            .filter((value, index, self) => self.indexOf(value) === index);

        var ordenado = objData.sort(function (a, b) {
            if (a.periodo > b.periodo)
                return 1;
            if (a.periodo < b.periodo)
                return -1;
            return 0;
    ***REMOVED***);
       

        new d3plus.BarChart()
            .select("#" + divContenedor)
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
                data: ordenado,
                groupBy: "periodo",
                legendPosition: 'bottom',
                x: "labelGroup",
                y: "rawValue",
                shapeConfig: {
                    fill: function (d, index) {
                        var valor_aux = 0;
                        if (d.periodo != null && d.periodo != "") {
                            valor_aux = parseInt(d.periodo);
                    ***REMOVED***

                        var index = distintos.indexOf(valor_aux);
                        return assignColorBarrasFunc(index);

                  ***REMOVED***
                    labelConfig: {
                        fontFamily: "'Montserrat', sans-serif",
                        align: "center",
                        size: 6,
                        transform: "capitalize",
                        fontMin: 4,
                        fontMax: 8
                ***REMOVED***

              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"] + " " + d["periodo"];
                  ***REMOVED***
                    tbody: [
                        [function (d) {
                            var cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones";
                            if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                                cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones" + " <strong>(" + d["porcentaje"].formatMoney(1, '.', ',').toString() + " %)</strong>";
                        ***REMOVED***
                            return cad_aux;

                    ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: "Presupuesto aprobado en Millones de L",
                    //ticks: [],
                    scale: "pow",
                    tickFormat: function (d) {
                        var auxiliar = d.formatMoney(0, '.', ',').toString();
                        return (auxiliar);
                  ***REMOVED***
                    xConfig: {
                        title: "Funciones de gobierno",
                        fontsize: "2px",
                        size: "2px"
                  ***REMOVED***
                    legend: false
            ***REMOVED***
            ***REMOVED***
            )
            .barPadding(0)
            .groupPadding(12)
            .render();
***REMOVED***


***REMOVED***



function loadBarChartGrupoDeGasto(objData, divContenedor) {
    var distintos = objData.map(item => item.periodo)
        .filter((value, index, self) => self.indexOf(value) === index);

    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        var ordenado = objData.sort(function (a, b) {
            if (a.periodo > b.periodo)
                return 1;
            if (a.periodo < b.periodo)
                return -1;
            return 0;
    ***REMOVED***);
        new d3plus.BarChart()
            .select("#" + divContenedor)
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
                data: ordenado,
                groupBy: "periodo",
                legendPosition: 'bottom',
                 x: "labelGroup",
                 y: "rawValue",
                shapeConfig: {
                    fill: function (d, index) {
                        var valor_aux = 0;
                        if (d.periodo != undefined && d.periodo != null && d.periodo != "") {
                            valor_aux = parseInt(d.periodo);
                    ***REMOVED***
                        var index = distintos.indexOf(valor_aux);
                        return assignColorBarras(index);

                  ***REMOVED***
                    labelConfig: {
                        fontFamily: "'Montserrat', sans-serif",
                        align: "center",
                        size: 6,
                        transform: "capitalize",
                        fontMin: 4,
                        fontMax: 8
                ***REMOVED***

              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"] + " " + d["periodo"];
                  ***REMOVED***
                    tbody: [
                        [function (d) {

                            var cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones";
                            if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                                cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones " + "<strong>(" + d["porcentaje"].formatMoney(1, '.', ',').toString() + " %) </strong>";
                        ***REMOVED***
                           
                            return cad_aux;
                    ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: "Presupuesto Ejecutado en Millones de L",
                    //ticks: [],
                    scale: "pow",
                    tickFormat: function (d) {
                        var auxiliar = d.formatMoney(0, '.', ',').toString();
                        return (auxiliar);
                        
                ***REMOVED***
              ***REMOVED***
                xConfig: {
                    title: "Grupo de Gasto",
                    fontsize: "2px",
                    size: "2px"
              ***REMOVED***
                legend: false
        ***REMOVED***)
            .barPadding(0)
            .groupPadding(12)
            .render();
***REMOVED***


***REMOVED***

function GetEntidadesPresupuesto() {
    $.ajax({
        url: "api/ServiciosPresupuestoNew/GetEntidadesPlanNacional",
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
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***

function GetEntidadesPresupuestoNoAlcaldias() {
    $.ajax({
        url: "api/ServiciosPresupuestoNew/GetEntidadesPlanNacionalNoAlcaldias",
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
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***



function ObtenerDatosListadoPerGasto(periodo) {
    $("#divPagFichas").html("");
    $("#divListado").empty();
    $("#divListado").html(loader_proy);
    //var periodo = $('#filtro_desglose_periodo  li.selected').attr('codigo');
    if (periodo != undefined && periodo != "") {
        var params_usu = { "annio": periodo ***REMOVED***;

        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/ServiciosPresupuestoNew/GetInfograficoGasto",
            cache: false,
            data: params_usu,
            success: function (result) {
                if (result.status == true) {
                    var data = result.infograficoPerGasto;
                    if (data != null) {
                        
                        if (data.length > 0) {
                            globales_gasto = data;
                            var pagina_actual = 1;
                            var ini_data = ((pagina_actual - 1) * cantXPagina);
                            var fin_data = (pagina_actual * cantXPagina) - 1;
                            var data_pagina = jQuery.grep(globales_gasto, function (n, i) {
                                return (i >= ini_data && i <= fin_data);
                        ***REMOVED***);
                            var arr = data_pagina;
                            getEstructuraInfografico(data_pagina, pagina_actual);
                    ***REMOVED*** else {
                            $("#divListado").html("<span class='lblErrorNoData'>Información No Disponible</span>");
                    ***REMOVED***
                ***REMOVED*** else {
                        $("#divListado").html("<span class='lblErrorNoData'>Información No Disponible</span>");
                ***REMOVED***
                    

            ***REMOVED*** else {
                    alert("Error: " + result.message, function () {

                ***REMOVED***);
            ***REMOVED***

          ***REMOVED***
            error: function (response) {
                alert(response.responseText);
          ***REMOVED***
            failure: function (response) {
                alert(response.responseText);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

***REMOVED***

function ObtenerDatosListadoPerEntidad(periodo) {
    $("#divPagFichas").html("");
    $("#divListado").empty();
    $("#divListado").html(loader_proy);
    if (periodo != undefined && periodo != "") {
        var params_usu = { "annio": periodo ***REMOVED***;

        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/ServiciosPresupuestoNew/GetInfograficoPerEntidad",
            cache: false,
            data: params_usu,
            success: function (result) {
                if (result.status == true) {
                    var data = result.infograficoPerGasto;
                    if (data != null) {
                        if (data.length > 0) {
                            globales_entidad = data;
                            var pagina_actual = 1;
                            var ini_data = ((pagina_actual - 1) * cantXPagina);
                            var fin_data = (pagina_actual * cantXPagina) - 1;
                            var data_pagina = jQuery.grep(globales_entidad, function (n, i) {
                                return (i >= ini_data && i <= fin_data);
                        ***REMOVED***);
                            var arr = data_pagina;
                            getEstructuraInfograficoPerEntidad(data_pagina,1);
                    ***REMOVED*** else {
                            $("#divListado").html("<span class='lblErrorNoData'>Información No Disponible</span>");
                    ***REMOVED***
                ***REMOVED*** else {
                        $("#divListado").html("<span class='lblErrorNoData'>Información No Disponible</span>");
                ***REMOVED***


            ***REMOVED*** else {
                    alert("Error: " + result.message, function () {

                ***REMOVED***);
            ***REMOVED***

          ***REMOVED***
            error: function (response) {
                alert(response.responseText);
          ***REMOVED***
            failure: function (response) {
                alert(response.responseText);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

***REMOVED***


function seteaListado() {
    $('#accordion .collapse').removeClass("in");
    $("#divGraphRecursosObj").hide();
    $("#divListadoRecursosObje").show();
    $(".boxCompoDesglose").hide();
    $(".boxTituloListado").show();
    $("#sankey_basic").empty();
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
                    var id = $(".nivel1[gasto='" + nom_nivel + "']").attr("id");
                    var obj = $("#" + id);
                    if (obj.length > 0) {
                        obj.addClass("in");
                ***REMOVED***
                    break;
                case 1:
                    var id = $(".nivel2[entidad='" + nom_nivel + "']").attr("id");
                    var obj = $("#" + id);
                    if (obj.length > 0) {
                        obj.addClass("in");
                ***REMOVED***

                    break;
                case 2:
                    var id = $(".nivel3[actividad='" + nom_nivel + "']").attr("id");
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

function monedaSimbolo(codigo) {
    var moneda = [];
    moneda["USD"] = "USD$";
    moneda["HND"] = "L";

    return moneda[codigo];
***REMOVED***

function getEstructuraInfografico(datos, pagina) {
    var i_aux = 0;
    var j_aux = 0;
    var k_aux = 0;
    //var l = 0;
    var total_avance = 0;
    var total_presupuesto = 0;
    var periodo_aux = 0;
    var total_porc_ejecucion = 0;
    var total_porc_ejecutado = 0;

    total_avance = globales_gasto.reduce((sum, currentValue) => {
        return sum + currentValue.avance;
  ***REMOVED*** 0);

    total_presupuesto = globales_gasto.reduce((sum, currentValue) => {
        return sum + currentValue.presupuesto;
  ***REMOVED*** 0);

    total_porc_ejecucion = globales_gasto.reduce((sum, currentValue) => {
        return sum + currentValue.porc_ejecutado;
  ***REMOVED*** 0);

    total_porc_ejecutado = total_presupuesto == 0 ? 0 : total_avance * 100 / total_presupuesto;


    var html_str = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
    for (var i = 0; i < datos.length; i++) {
        if (datos[i].periodos != undefined) {
            if (datos[i].periodos.length > 0) {
                periodo_aux = datos[i].periodos[0];
        ***REMOVED***
    ***REMOVED***
        var nomCollapse = "collapseOne_" + i_aux.toString() + "_" + j_aux.toString();
        var nomHeading = "headingOne_" + i_aux.toString() + "_" + j_aux.toString();
        //total_avance += datos[i].avance;
        //total_presupuesto += datos[i].presupuesto;
        var gasto_nom = datos[i].nombre;
        var porc_ejecutado = 0;
        if (datos[i].presupuesto > 0) {
            porc_ejecutado = (datos[i].avance / datos[i].presupuesto) * 100;
    ***REMOVED***

        if (gasto_nom.split("|").length > 0) {
            gasto_nom = gasto_nom.split("|")[1];
    ***REMOVED***

        html_str += '<div class="panel panel-default ">';
        html_str += '<div class="panel-heading" role="tab" id="' + nomHeading + '">';
        html_str += '<div class="panel-title w-88">';
        html_str += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + nomCollapse + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
        html_str += '<div class="head">';
        html_str += '<div class="data1 mainData">';
        html_str += '<span class="labelTit">Grupo de gasto</span>';
        html_str += '<span class="td1">' + gasto_nom + '</span>';
        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Presupuesto Vigente</span>';
        if (datos[i].presupuesto / 1000000 > 1) {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
    ***REMOVED*** else {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].presupuesto / 1).formatMoney(0, '.', ',').toString() + ' </span>';
    ***REMOVED***

        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Ejecutado</span>';
        if (datos[i].avance / 1000000 > 1) {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones </span>';
    ***REMOVED*** else {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].avance / 1).formatMoney(0, '.', ',').toString() + '  </span>';
    ***REMOVED***

        html_str += '</div>';

        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">% Ejecución</span>';
        html_str += '<span class="td1">' + porc_ejecutado.formatMoney(1, '.', ',').toString() + '</span>';
        html_str += '</div>';
        //------------------
        html_str += '<h6 class="btnPerfil badge bg-light text-dark"><i class="material-icons md-18">info_outline</i> Ver Detalle</h6>';
        //------------------
        html_str += '</div >';

        html_str += '</a>';
        html_str += '</div>';


        html_str += '</div>';

        html_str += '<div id = "' + nomCollapse + '" class="panel-collapse collapse nivel1" role = "tabpanel" aria - labelTitledby="' + nomHeading + '" item = "' + datos[i].nombre.toUpperCase() + '" >';
        html_str += '<div class="panel-body">';

        //NIVEL 2
        var vec_entidad = datos[i].detalles;
        for (var j = 0; j < vec_entidad.length; j++) {
            var nomNivel2 = "accordion_l2_" + i_aux.toString() + "_" + j_aux.toString();
            var headNivel2 = "headLevel2_" + i_aux.toString() + "_" + j_aux.toString();
            var panelHijo2 = "c2_" + j_aux.toString() + "_" + k_aux.toString();
            var nomHeadLevel3 = "headLevel3_" + j_aux.toString() + "_" + k_aux.toString();
            var entidad_nom = vec_entidad[j].nombre;
            if (entidad_nom.split("|").length > 0) {
                entidad_nom = entidad_nom.split("|")[1];
        ***REMOVED***
            var porc_ejecutado = 0;
            if (datos[i].presupuesto > 0) {
                porc_ejecutado = (vec_entidad[j].avance / vec_entidad[j].presupuesto) * 100;
        ***REMOVED***

            html_str += '<div class="panel-group nivel22" id="' + nomNivel2 + '" role="tablist" aria-multiselectable="true">';
            html_str += '<div class="panel panel-default">';
            //heading
            html_str += '<div class="panel-heading" role="tab" id="' + headNivel2 + '">';
            html_str += '<div class="panel-title w-88">';
            html_str += '<a role = "button" data-toggle="collapse" data-parent="#' + nomNivel2 + '" href = "#' + panelHijo2 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
            html_str += '<div class="head">';

            html_str += '<div class="data1 mainData">';
            html_str += '<span class="labelTit">Institución</span>';
            html_str += '<span class="td1p">' + entidad_nom + '</span>';
            html_str += '</div>';

            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Presupuesto Vigente</span>';
            if (vec_entidad[j].presupuesto / 1000000 > 1) {
                html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_entidad[j].presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
        ***REMOVED*** else {
                html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_entidad[j].presupuesto / 1).formatMoney(0, '.', ',').toString() + '</span>';
        ***REMOVED***
            html_str += '</div>';

            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Ejecutado</span>';
            if (vec_entidad[j].avance / 1000000 > 1) {
                html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_entidad[j].avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
        ***REMOVED*** else {
                html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_entidad[j].avance / 1).formatMoney(0, '.', ',').toString() + '</span>';
        ***REMOVED***

            html_str += '</div>';

            html_str += '<div class="data1a">';
            html_str += '<span class="labelTit">% Ejecución</span>';
            html_str += '<span class="">' + porc_ejecutado.formatMoney(1, '.', ',').toString() + '</span>';
            html_str += '</div>';
            html_str += '<h6 class="btnPerfil badge bg-light text-dark"><i class="material-icons md-18">info_outline</i> Ver Detalle</h6>';

            html_str += '</div>';//head
            html_str += '</a>';
            html_str += '</div>';
            html_str += '<span class="btnPerfil badge bg-light text-dark"><a target="_blank" href="/PerfilEntidad?codEntidad=' + vec_entidad[j].id + '">Ir Perfil Institución <i class="material-icons md-18">chevron_right</i></a></span>';
            html_str += '</div>';
            //body
            html_str += '<div id="' + panelHijo2 + '" class="panel-collapse collapse level3 nivel2" role="tabpanel" aria-labelledby="' + nomHeadLevel3 + '" entidad="' + vec_entidad[j].nombre.toUpperCase() + '">';
            html_str += '<div class="panel-body">';
            //< !--NIVEL 3-- >
            var vec_actividad = vec_entidad[j].detalles;
            for (var k = 0; k < vec_actividad.length; k++) {

                var actividad_nom = vec_actividad[k].nombre;

                if (actividad_nom.split("|").length > 0) {
                    actividad_nom = actividad_nom.split("|")[1];
            ***REMOVED***

                var porc_ejecutado = 0;
                if (datos[i].presupuesto > 0) {
                    porc_ejecutado = (vec_actividad[k].avance / vec_actividad[k].presupuesto) * 100;
            ***REMOVED***

                var nomNivel3 = "accordion_l3_" + j_aux.toString() + "_" + k_aux.toString();
                var nomCnivel3 = "c3_" + j_aux.toString() + "_" + k_aux.toString();

                html_str += '<div class="panel-group nivel33" id="' + nomNivel3 + '" role="tablist" aria-multiselectable="true">';
                html_str += '<div class="panel panel-default">';
                html_str += '<div class="panel-body">';
                html_str += '<span class="h6">Actividad</span>';
                html_str += '<ul class="list-group">';
                html_str += '<li class="list-group-item">';
                html_str += '<div class="head">';
                html_str += '<div class="data1 mainData">';
                html_str += '<span class="td1p">' + actividad_nom + '</span>';
                html_str += '</div>';
                html_str += '<div class="data1">';
                html_str += '<span class="labelTit">Presupuesto Vigente</span>';
                if (vec_actividad[k].presupuesto / 1000000 > 1) {
                    html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_actividad[k].presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
            ***REMOVED*** else {
                    html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_actividad[k].presupuesto / 1).formatMoney(0, '.', ',').toString() + '</span>';
            ***REMOVED***

                html_str += '</div>';
                html_str += '<div class="data1">';
                html_str += '<span class="labelTit">Ejecutado</span>';
                if (vec_actividad[k].avance / 1000000 > 1) {
                    html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_actividad[k].avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
            ***REMOVED*** else {
                    html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_actividad[k].avance / 1).formatMoney(0, '.', ',').toString() + '</span>';
            ***REMOVED***
                html_str += '</div>';

                html_str += '<div class="data1">';
                html_str += '<span class="labelTit">% Ejecución</span>';
                html_str += '<span class="">' + porc_ejecutado.formatMoney(1, '.', ',').toString() + '</span>';
                html_str += '</div>';

                html_str += '</div>';
                html_str += '</li>';
                html_str += '</ul>';
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


    ///----------------
    html_str += '<div id="divPagFichas"></div>';
    ///----------------

    html_str += '<div id="divTotales" class="summUp">';
    html_str += '<div class="panel-title">';
    html_str += '<div class="head">';
    html_str += '<div class="data1 mainData">';
    html_str += '<span class="labelTit">&nbsp;</span>';
    html_str += '<span class="td1">Totales Generales</span>';
    html_str += '</div>';
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">Presupuesto Vigente</span>';
    if (total_presupuesto / 1000000 > 1) {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
***REMOVED*** else {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_presupuesto / 1).formatMoney(0, '.', ',').toString() + '</span>';
***REMOVED***

    //html_str += '<span class="td1">' + total_presupuesto / 1000000  + ' Millones</span>';
    html_str += '</div>';
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">Ejecutado</span>';
    if (total_avance / 1000000 > 1) {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
***REMOVED*** else {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_avance / 1).formatMoney(0, '.', ',').toString() + '</span>';
***REMOVED***
    //--------------------------
    html_str += '</div>';    
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">% Ejecución</span>';
    html_str += '<span class="td1">' + total_porc_ejecutado.formatMoney(1, '.', ',').toString() + ' % </span>';
    html_str += '</div>';

    //html_str += '<span class="td1">' + total_avance / 1000000 + 'Millones</span>';
    html_str += '</div>';
    html_str += '</div>';
    html_str += '</div>';
    html_str += '</div>';

    $("#divListado").html(html_str);
    var totalNumber = globales_gasto.length;
    var totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;
    if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
        totalPages = totalPages + 1;
***REMOVED***
    dibujarPagNumeradasPerGasto(pagina, totalNumber, totalPages);

***REMOVED***


function getEstructuraInfograficoPerEntidad(datos,pagina) {
    var i_aux = 0;
    var j_aux = 0;
    var k_aux = 0;
    //var l = 0;
    var total_avance = 0;
    var total_presupuesto = 0;
    var periodo_aux = 0;
    var total_porc_ejecutado = 0;

    total_avance = globales_entidad.reduce((sum, currentValue) => {
        return sum + currentValue.avance;
  ***REMOVED*** 0);

    total_presupuesto = globales_entidad.reduce((sum, currentValue) => {
        return sum + currentValue.presupuesto;
  ***REMOVED*** 0);

    total_porc_ejecutado = total_presupuesto == 0 ? 0 : total_avance * 100 / total_presupuesto;

    var html_str = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
    for (var i = 0; i < datos.length; i++) {
        if (datos[i].periodos != undefined) {
            if (datos[i].periodos.length > 0) {
                periodo_aux = datos[i].periodos[0];
        ***REMOVED***
    ***REMOVED***
        var nomCollapse = "collapseOne_" + i_aux.toString() + "_" + j_aux.toString();
        var nomHeading = "headingOne_" + i_aux.toString() + "_" + j_aux.toString();
        //total_avance += datos[i].avance;
        //total_presupuesto += datos[i].presupuesto;
        var gasto_nom = datos[i].nombre;
        var porc_ejecutado = 0;
        if (datos[i].presupuesto > 0) {
            porc_ejecutado = (datos[i].avance / datos[i].presupuesto) * 100;
    ***REMOVED***

        if (gasto_nom.split("|").length > 0) {
            gasto_nom = gasto_nom.split("|")[1];
    ***REMOVED***

        html_str += '<div class="panel panel-default">';
        html_str += '<div class="panel-heading d-flex" role="tab" id="' + nomHeading + '">';
        html_str += '<div class="panel-title w-88">';
        html_str += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + nomCollapse + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
        html_str += '<div class="headEnt">';
        html_str += '<div class="data1 mainDataEntidad">';
        html_str += '<span class="labelTit">Institución</span>';
        html_str += '<span class="td1">' + gasto_nom + '</span>';
        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Presupuesto Vigente</span>';
        if (datos[i].presupuesto / 1000000 > 1) {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
    ***REMOVED*** else {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].presupuesto / 1).formatMoney(0, '.', ',').toString() + ' </span>';
    ***REMOVED***

        html_str += '</div>';
        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">Ejecutado</span>';
        if (datos[i].avance / 1000000 > 1) {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones </span>';
    ***REMOVED*** else {
            html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (datos[i].avance / 1).formatMoney(0, '.', ',').toString() + '  </span>';
    ***REMOVED***

        html_str += '</div>';

        html_str += '<div class="data1">';
        html_str += '<span class="labelTit">% Ejecución</span>';
        html_str += '<span class="td1">' + porc_ejecutado.formatMoney(1, '.', ',').toString() + '</span>';
        html_str += '</div>';
        //------------------
        html_str += '<h6 class="btnPerfil badge bg-light text-dark"><i class="material-icons md-18">info_outline</i> Ver Detalle</h6>';
        //------------------
        html_str += '</div >';
        html_str += '</a>';
        html_str += '</div>';
        html_str += '<span class="btnPerfil badge bg-light text-dark"><a target="_blank" href="/PerfilEntidad?codEntidad=' + datos[i].id + '">Ir Perfil Institución <i class="material-icons md-18">chevron_right</i></a></span>';
        html_str += '</div>';

        html_str += '<div id = "' + nomCollapse + '" class="panel-collapse collapse nivel1" role = "tabpanel" aria - labelTitledby="' + nomHeading + '" item = "' + datos[i].nombre.toUpperCase() + '" >';
        html_str += '<div class="panel-body">';

        //NIVEL 2
        var vec_entidad = datos[i].detalles;
        for (var j = 0; j < vec_entidad.length; j++) {
            var nomNivel2 = "accordion_l2_" + i_aux.toString() + "_" + j_aux.toString();
            var headNivel2 = "headLevel2_" + i_aux.toString() + "_" + j_aux.toString();
            var panelHijo2 = "c2_" + j_aux.toString() + "_" + k_aux.toString();
            var nomHeadLevel3 = "headLevel3_" + j_aux.toString() + "_" + k_aux.toString();
            var entidad_nom = vec_entidad[j].nombre;
            if (entidad_nom.split("|").length > 0) {
                entidad_nom = entidad_nom.split("|")[1];
        ***REMOVED***
            var porc_ejecutado = 0;
            if (datos[i].presupuesto > 0) {
                porc_ejecutado = (vec_entidad[j].avance / vec_entidad[j].presupuesto) * 100;
        ***REMOVED***

            html_str += '<div class="panel-group nivel22" id="' + nomNivel2 + '" role="tablist" aria-multiselectable="true">';
            html_str += '<div class="panel panel-default">';
            //heading
            html_str += '<div class="panel-heading" role="tab" id="' + headNivel2 + '">';
            html_str += '<div class="panel-title w-90">';
            html_str += '<a role = "button" data-toggle="collapse" data-parent="#' + nomNivel2 + '" href = "#' + panelHijo2 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
            html_str += '<div class="head">';
            html_str += '<div class="data1 mainData">';
            html_str += '<span class="labelTit">Grupo de gasto</span>';
            html_str += '<span class="td1p">' + entidad_nom + '</span>';
            html_str += '</div>';
            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Presupuesto Vigente</span>';
            if (vec_entidad[j].presupuesto / 1000000 > 1) {
                html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_entidad[j].presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
        ***REMOVED*** else {
                html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_entidad[j].presupuesto / 1).formatMoney(0, '.', ',').toString() + '</span>';
        ***REMOVED***

            html_str += '</div>';
            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Ejecutado</span>';
            if (vec_entidad[j].avance / 1000000 > 1) {
                html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_entidad[j].avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
        ***REMOVED*** else {
                html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_entidad[j].avance / 1).formatMoney(0, '.', ',').toString() + '</span>';
        ***REMOVED***

            html_str += '</div>';

            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">% Ejecución</span>';
            html_str += '<span class="">' + porc_ejecutado.formatMoney(1, '.', ',').toString() + '</span>';
            html_str += '</div>';
            //------------------
            html_str += '<h6 class="btnPerfil badge bg-light text-dark"><i class="material-icons md-18">info_outline</i> Ver Detalle</h6>';
        //------------------

            html_str += '</div>';
            html_str += '</a>';
            html_str += '</div>';
            html_str += '</div>';
            //body
            html_str += '<div id="' + panelHijo2 + '" class="panel-collapse collapse level3 nivel2" role="tabpanel" aria-labelledby="' + nomHeadLevel3 + '" entidad="' + vec_entidad[j].nombre.toUpperCase() + '">';
            html_str += '<div class="panel-body">';
            //< !--NIVEL 3-- >
            var vec_actividad = vec_entidad[j].detalles;
            for (var k = 0; k < vec_actividad.length; k++) {

                var actividad_nom = vec_actividad[k].nombre;

                if (actividad_nom.split("|").length > 0) {
                    actividad_nom = actividad_nom.split("|")[1];
            ***REMOVED***

                var porc_ejecutado = 0;
                if (datos[i].presupuesto > 0) {
                    porc_ejecutado = (vec_actividad[k].avance / vec_actividad[k].presupuesto) * 100;
            ***REMOVED***

                var nomNivel3 = "accordion_l3_" + j_aux.toString() + "_" + k_aux.toString();
                var nomCnivel3 = "c3_" + j_aux.toString() + "_" + k_aux.toString();

                html_str += '<div class="panel-group nivel33" id="' + nomNivel3 + '" role="tablist" aria-multiselectable="true">';
                html_str += '<div class="panel panel-default">';
                html_str += '<div class="panel-body">';
                html_str += '<span class="h6">Actividad</span>';
                html_str += '<ul class="list-group">';
                html_str += '<li class="list-group-item">';
                html_str += '<div class="head">';
                html_str += '<div class="data1 mainData">';
                html_str += '<span class="td1p">' + actividad_nom + '</span>';
                html_str += '</div>';
                html_str += '<div class="data1">';
                html_str += '<span class="labelTit">Presupuesto Vigente</span>';
                if (vec_actividad[k].presupuesto / 1000000 > 1) {
                    html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_actividad[k].presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
            ***REMOVED*** else {
                    html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_actividad[k].presupuesto / 1).formatMoney(0, '.', ',').toString() + '</span>';
            ***REMOVED***

                html_str += '</div>';
                html_str += '<div class="data1">';
                html_str += '<span class="labelTit">Ejecutado</span>';
                if (vec_actividad[k].avance / 1000000 > 1) {
                    html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_actividad[k].avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
            ***REMOVED*** else {
                    html_str += '<span class="td1p">' + monedaSimbolo("HND") + ' ' + (vec_actividad[k].avance / 1).formatMoney(0, '.', ',').toString() + '</span>';
            ***REMOVED***
                html_str += '</div>';

                html_str += '<div class="data1">';
                html_str += '<span class="labelTit">% Ejecución</span>';
                html_str += '<span class="">' + porc_ejecutado.formatMoney(1, '.', ',').toString() + '</span>';
                html_str += '</div>';

                html_str += '</div>';
                html_str += '</li>';
                html_str += '</ul>';
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

    ///----------------
    html_str += '<div id="divPagFichas"></div>';
    ///----------------

    html_str += '<div id="divTotales" class="summUp">';
    html_str += '<div class="panel-title">';
    html_str += '<div class="head">';
    html_str += '<div class="data1 mainData">';
    html_str += '<span class="labelTit">&nbsp;</span>';
    html_str += '<span class="td1">Totales Generales</span>';
    html_str += '</div>';
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">Presupuesto Vigente</span>';
    if (total_presupuesto / 1000000 > 1) {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_presupuesto / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
***REMOVED*** else {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_presupuesto / 1).formatMoney(0, '.', ',').toString() + '</span>';
***REMOVED***

    //html_str += '<span class="td1">' + total_presupuesto / 1000000  + ' Millones</span>';
    html_str += '</div>';
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">Ejecutado</span>';
    if (total_avance / 1000000 > 1) {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_avance / 1000000).formatMoney(1, '.', ',').toString() + ' Millones</span>';
***REMOVED*** else {
        html_str += '<span class="td1">' + monedaSimbolo("HND") + ' ' + (total_avance / 1).formatMoney(0, '.', ',').toString() + '</span>';
***REMOVED***
    html_str += '</div>';
    html_str += '<div class="data1">';
    html_str += '<span class="labelTit">% Ejecución</span>';
    html_str += '<span class="td1">' + total_porc_ejecutado.formatMoney(1, '.', ',').toString() + ' % </span>';
    html_str += '</div>';
    //html_str += '<span class="td1">' + total_avance / 1000000 + 'Millones</span>';
    html_str += '</div>';
    html_str += '</div>';
    html_str += '</div>';
    html_str += '</div>';

    $("#divListado").html(html_str);
    var totalNumber = globales_entidad.length;
    var totalPages = (totalNumber > cantXPagina) ? ((totalNumber - (totalNumber % cantXPagina)) / cantXPagina) : 1;
    if ((totalNumber >= cantXPagina) && ((totalNumber % cantXPagina) > 0)) {
        totalPages = totalPages + 1;
***REMOVED***
    dibujarPagNumeradasPerEntidad(pagina, totalNumber, totalPages);

***REMOVED***

function dibujarPagNumeradasPerGasto(actual, total, totalPag) {
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
        pag_enlace += '<a id="page_left_gasto" role="button" class="material-icons md-24" data-page="' + (inicio - cant_por_linea) + '"><span class="">chevron_left</span></a>';
***REMOVED***


    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            pag_enlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
    ***REMOVED*** else {
            pag_enlace += '<a class="page_left_gasto" role="button" data-page="' + i + '">';
            pag_enlace += '<span class="glyphicon"><text class="paginacion">' + i + '</text></span>';
            pag_enlace += '</a>';
    ***REMOVED***

***REMOVED***

    if (pag_actual < totalPag) {
        if (fin < totalPag) {
            pag_enlace += '<a id="page_right_gasto" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
    ***REMOVED***
***REMOVED***

    $("#divPagFichas").html(pag_enlace);

    $('#page_right_gasto,#page_left_gasto,.page_left_gasto,.page_right_gasto').bind('click', function () {
        var pagina_actual = $(this).attr("data-page");
        var ini_data = ((pagina_actual - 1) * cantXPagina);
        var fin_data = (pagina_actual * cantXPagina) - 1;
        var data_pagina = jQuery.grep(globales_gasto, function (n, i) {
            return (i >= ini_data && i <= fin_data);
    ***REMOVED***);
        var arr = data_pagina;
        $("#divListado").empty();
        getEstructuraInfografico(data_pagina, pagina_actual);
***REMOVED***);

***REMOVED***

function dibujarPagNumeradasPerEntidad(actual, total, totalPag) {
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
        pag_enlace += '<a id="page_left" role="button" class="material-icons md-24" data-page="' + (inicio - cant_por_linea) + '"><span class="">chevron_left</span></a>';
***REMOVED***


    for (var i = inicio; i <= fin; i++) {

        if (i == pag_actual) {
            pag_enlace += '<span class="pag_actual" data-page="' + i + '"><text>' + i + '</text></span>';
    ***REMOVED*** else {
            pag_enlace += '<a class="page_left" role="button" data-page="' + i + '">';
            pag_enlace += '<span class="glyphicon"><text class="paginacion">' + i + '</text></span>';
            pag_enlace += '</a>';
    ***REMOVED***

***REMOVED***

    if (pag_actual < totalPag) {
        if (fin < totalPag) {
            pag_enlace += '<a id="page_right" role="button" class="material-icons md-24" data-page="' + (fin + 1) + '"><span class="">chevron_right</span></a>';
    ***REMOVED***
***REMOVED***

    $("#divPagFichas").html(pag_enlace);

    $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
        var pagina_actual = $(this).attr("data-page");
        var ini_data = ((pagina_actual - 1) * cantXPagina);
        var fin_data = (pagina_actual * cantXPagina) - 1;
        var data_pagina = jQuery.grep(globales_entidad, function (n, i) {
            return (i >= ini_data && i <= fin_data);
    ***REMOVED***);
        var arr = data_pagina;
        $("#divListado").empty();
        getEstructuraInfograficoPerEntidad(data_pagina, pagina_actual);
***REMOVED***);

***REMOVED***


function GetGrupoDeGastoPerVersiones(versiones, annio) {
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "api/ServiciosPresupuestoNew/GetComparativePerVersiones",
        type: "GET",
        data: {
            filtro: versiones,
            anyo: annio
    ***REMOVED***

***REMOVED***).done(function (data) {
        var result = data.infoGrafica;
        loadBarChartVersiones(result, "divGraphVersiones");
***REMOVED***).fail(function (handleError) {
        // Some function
        console.log(handleError);
***REMOVED***);
***REMOVED***

function loadBarChartVersiones(objData, divContenedor) {
    var distintos = objData.map(item => item.labelGroup)
        .filter((value, index, self) => self.indexOf(value) === index);

    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        new d3plus.BarChart()
            .select("#" + divContenedor)
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
                groupBy: "labelGroup",
                legendPosition: 'bottom',
                x: "label",
                y: "rawValue",
                shapeConfig: {
                    fill: function (d, index) {
                        var index = distintos.indexOf(d.labelGroup);
                        return assignColorBarrasVersiones(index);
                  ***REMOVED***
                    labelConfig: {
                        fontFamily: "'Montserrat', sans-serif",
                        align: "center",
                        size: 6,
                        transform: "capitalize",
                        fontMin: 4,
                        fontMax: 8
                ***REMOVED***

              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        //return d["labelGroup"] + " " + d["label"];
                  ***REMOVED***
                    tbody: [
                        [function (d) {
                            var cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones";
                            if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                                cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones" + " <strong>(" + d["porcentaje"].formatMoney(1, '.', ',').toString() + " %)</strong>";
                        ***REMOVED***

                            return cad_aux;
                    ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: "Presupuesto en Millones de L",
                    //ticks: [],
                    scale: "pow",
                    tickFormat: function (d) {
                        var auxiliar = d.formatMoney(0, '.', ',').toString();
                        return (auxiliar);
                ***REMOVED***
              ***REMOVED***
                xConfig: {
                    title: "Grupo de Gasto",
                    fontsize: "2px",
                    size: "2px"
              ***REMOVED***
                legend: false
        ***REMOVED***)
            .barPadding(0)
            .groupPadding(12)
            .render();
***REMOVED***


***REMOVED***

Number.prototype.formatMoney = function (c, d, t) {
    var n = this;
    var c = isNaN(c = Math.abs(c)) ? 2 : c;
    var d = d == undefined ? "." : d;
    var t = t == undefined ? "," : t;
    var s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
***REMOVED***;