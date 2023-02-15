/// <reference path="app/network/urlsMap.js" />
var projectPerfil = JSON.parse(document.body.getAttribute('data-profile'));
var anyo_actual = (new Date).getFullYear();
var avance_fisico = (parseFloat(projectPerfil[0].avance_fisico.replace(",", ".")) / 100).toFixed(4);
var avance_financiero = (parseFloat(projectPerfil[0].avance_financiero.replace(",",".")) / 100).toFixed(4);
var data_fisico = [{ "year": anyo_actual, "name": "Avance fisico", "value": avance_fisico, "group": "fisico" ***REMOVED***];
var data_financiero = [{ "year": anyo_actual, "name": "Avance financiero", "value": avance_financiero, "group": "financiero" ***REMOVED***];
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";

var cant_contratos = 5;
var scrol = 0;


require([
    'app/network/Services',
    'app/network/urlsMap',
    'comunes'
],
	function (
        Services,
        urlsMap,
        comunes
	) {
	
	    InicializaDatos();
	    make_viz("divGraphAvanceFisico", data_fisico, "Avance Físico", "#005951","");
	    make_viz("divGraphAvanceFinanciero", data_financiero, "Avance Financiero", "#e25126" , "");
	   

	    function InicializaDatos() {
	        //usuario en session
	        iniUsuarioLog();
	        //add funciones login
	        $("#txtEmailLog").val("");
	        $("#txtClaveLog").val("");
	        $("#divCloseSesion").hide();


	        //****GET INFO CONTRATACION ****//

	        getAnnio();
	        //********************************


	        $("#btnNuevaCuenta").click(function() {
	            $("#divUsuarioLog").slideUp(100, function() {
	                $("#divCuentaNueva").slideDown(function () {
	                    limpiarCamposUsuario("login");
	            ***REMOVED***);
	        ***REMOVED***);
	    ***REMOVED***);

	        $("#btnAddCuentaUsu").click(function() {
	            AddNuevaCuentaUsuario();
	    ***REMOVED***);

	        $("#btnIngresarUsuLog").click(function () {
	            validaLoginUsu();
	    ***REMOVED***);

	       

	        $("#btnEnlaceOlvidoClave").click(function () {
	            $("#divUsuarioLog").slideUp(100, function () {
	                $("#divOlvidoClave").slideDown(function () {
	                    limpiarCamposUsuario("clave");
	            ***REMOVED***);
	        ***REMOVED***);

	    ***REMOVED***);

	        $("#btnEnviaCodigoClave").click(function () {
	            //valida correo
                var correo_usu = $("#txtEmailReset").val();
                if (comunes.validaEmail(correo_usu.toLowerCase())) {
	                
	                var params_usu = { "email": correo_usu ***REMOVED***;
	                $.ajax({
	                    type: 'POST',
	                    contentType: "application/json; charset=utf-8",
	                    dataType: "json",
	                    url: "/api/Participacion/ValidaEmail",
	                    cache: false,
	                    data: JSON.stringify(params_usu),
	                    success: function (result) {
	                        if (result.status == true) {
	                            //usuario, se ha enviado correo con codigo
	                            $("#txtEmailVerifica").val(correo_usu);
	                            $("#divOlvidoClave").slideUp(100, function () {
	                                $("#divConfirmaCodigo").slideDown(function () {
	                                    limpiarCamposUsuario("clave");
	                            ***REMOVED***);
	                        ***REMOVED***);


	                    ***REMOVED*** else {
	                            bootbox.alert("Error: " + result.message, function () {

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

	        ***REMOVED*** else {
	                bootbox.alert("Email inválido");

	        ***REMOVED***




	    ***REMOVED***);

	        $("#btnVerificaCodigoClave").click(function () {
	            var params_usu = { "email": $("#txtEmailVerifica").val(), "cod_verifica": $("#txtCodigoVerifica").val()***REMOVED***;
	            $.ajax({
	                type: 'POST',
	                contentType: "application/json; charset=utf-8",
	                dataType: "json",
	                url: "/api/Participacion/ValidaCodigo",
	                cache: false,
	                data: JSON.stringify(params_usu),
	                success: function (result) {
	                    if (result.status == true) {
	                        //usuario, se ha enviado correo con codigo
	                        $("#hdIdUsuario").val(result.id_usuario);
	                        $("#divConfirmaCodigo").slideUp(100, function () {
	                            $("#divResetPassword").slideDown(function () {
	                                limpiarCamposUsuario("clave");
	                        ***REMOVED***);
	                    ***REMOVED***);
	                ***REMOVED*** else {
	                        $("#hdIdUsuario").val("");
	                        bootbox.alert("Error: " + result.message, function () {

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

	    ***REMOVED***);


	        $("#btnCambiarClaveOlvido").click(function () {
	            //valida campos obligatorios
	            var formularioOK = validaCamposOblig("divResetPassword");

	            if (formularioOK == false) {
	                if (camposReq != "") {
	                    bootbox.alert("Faltan campos obligatorios");
	            ***REMOVED***
	        ***REMOVED*** else {
	                //validarClave
	                if ($("#txtPassword_re").val() != $("#txtPassword_re_2").val()) {
	                    bootbox.alert("Confirmación nueva clave incorrecta");
	            ***REMOVED*** else {
	                    var clave_usu = $("#txtPassword_re").val();
	                    if (validaClaveUsu(clave_usu) == false) {
	                        bootbox.alert("Formato de clave incorrecto: Debe tener 8 dígitos al menos,contener números y al menos una letra mayúscula");
	                ***REMOVED*** else {
	                        if ($("#hdIdUsuario").val() != "") {
	                            var params_usu = {
	                                IdUsuario: $("#hdIdUsuario").val(),
	                                hash_clave: clave_usu,
	                        ***REMOVED***;
	                            //add nuevo registro
	                            $.ajax({
	                                type: 'POST',
	                                contentType: "application/json; charset=utf-8",
	                                dataType: "json",
	                                url: "/api/Participacion/updClaveUsuario",
	                                cache: false,
	                                data: JSON.stringify(params_usu),
	                                success: function (result) {
	                                    if (result.status == true) {
	                                        bootbox.alert("Nueva clave guardada exitosamente", function () {
	                                            $("#divResetPassword").slideUp(100, function () {
	                                                $("#divUsuarioLog").slideDown(function () {
	                                                    limpiarCamposUsuario("all");
	                                            ***REMOVED***);
	                                        ***REMOVED***);
	                                    ***REMOVED***);

	                                ***REMOVED*** else {
	                                        bootbox.alert("@Error: " + result.message);
	                                ***REMOVED***

	                              ***REMOVED***
	                                error: function (response) {
	                                    bootbox.alert(response.responseText);
	                              ***REMOVED***
	                                failure: function (response) {
	                                    bootbox.alert(response.responseText);
	                            ***REMOVED***
	                        ***REMOVED***);
	                    ***REMOVED*** else {
	                            bootbox.alert("Código no verificado");
	                    ***REMOVED***

	                ***REMOVED***
	            ***REMOVED***
	        ***REMOVED***

	    ***REMOVED***);

	        $("#btnGuardarComent").click(function () {
	            //valida campos obligatorios
	            $("#btnGuardarComent").hide();
	            var formularioOK = validaCamposOblig("divPregParticipacion");

	            if (formularioOK == false) {
	                if (camposReq != "") {
	                    bootbox.alert("Faltan campos obligatorios");
	            ***REMOVED***
	        ***REMOVED*** else {
	                var formularioOK = true;
	                var camposReq = "";
	                $(".alert-danger").hide();
	                var id_usuario = $("#hdIdUsuario").val();
	                var id_departamento = $("#filtro_AreaInfluencia li.selected").attr("id_depa");
	                var id_municipio = $("#filtro_AreaInfluencia li.selected").attr("id_munic");
	                var id_tipo = $("#filtro_TipoCometario li.selected").attr("id_tipo");
	                var text_coment = $("#txtcomentario").val();
	                var ch_anonimo = $("#anonimo").prop('checked');
	                var id_proyecto = projectPerfil[0].id_project;

	                if (id_tipo == "" || id_tipo == undefined) {
	                    formularioOK = false;
	                    bootbox.alert("Seleccione un tipo de comentario");
	            ***REMOVED***
	                else if (id_departamento == "" || id_municipio == "" || id_departamento == undefined || id_municipio == undefined) {
	                    formularioOK = false;
	                    bootbox.alert("Seleccione un municipio");
	            ***REMOVED***
	                else if (text_coment == "") {
	                    formularioOK = false;
	                    bootbox.alert("Ingrese un comentario");
	            ***REMOVED***


	                if (formularioOK == true) {
	                    $("#divPregParticipacion").html(loader_proy);

	                    var params_com = {
	                        IdUsuario: id_usuario,
	                        id_departamento: id_departamento,
	                        id_municipio: id_municipio,
	                        IdTipoComentario: id_tipo,
	                        IdProyecto: id_proyecto,
	                        ComentarioOriginal: text_coment,
	                        Anonimo: ch_anonimo,
	                        IdEstado: 1,
	                        IdTipoRespuesta: 1,
	                        ComentarioRelacionado: null,
	                        UsuarioComenta: 0,
	                        IdAsociacion: 1,
	                        IdPrograma: null
	                ***REMOVED***;
	                    //add nuevo registro
	                    $.ajax({
	                        type: 'POST',
	                        contentType: "application/json; charset=utf-8",
	                        dataType: "json",
	                        url: "/api/Participacion/insComentario",
	                        cache: false,
	                        data: JSON.stringify(params_com),
	                        success: function (result) {
	                            if (result.status == true) {
	                                //COMENTARIOS GUARDADOS EXITOSAMENTE
	                                $("#divPregParticipacion").slideUp(100, function () {
	                                    $("#divCloseSesion").show();
	                                    var nom_usu = $("#hdNomUsuario").val();
	                                    $("#txtMsgConfirmaEnvio").text("Muchas Gracias " + nom_usu);
	                                    $("#divConfirmaEnvio").slideDown(function () {
	                                        if (projectPerfil[0].id_project != undefined) {
	                                            GetEstadisticas(projectPerfil[0].id_project);
	                                            GetComentarios(projectPerfil[0].id_project);
	                                    ***REMOVED***
	                                ***REMOVED***);
	                            ***REMOVED***);

	                        ***REMOVED*** else {
	                                bootbox.alert("@Error: " + result.message);
	                                $("#divPregParticipacion").slideUp(100, function () {
	                                    $("#divCloseSesion").show();
	                                    
	                            ***REMOVED***);
	                        ***REMOVED***

	                      ***REMOVED***
	                        error: function (response) {
	                            bootbox.alert(response.responseText);
	                            $("#divPregParticipacion").slideUp(100, function () {
	                                $("#divCloseSesion").show();

	                        ***REMOVED***);
	                      ***REMOVED***
	                        failure: function (response) {
	                            bootbox.alert(response.responseText);
	                            $("#divPregParticipacion").slideUp(100, function () {
	                                $("#divCloseSesion").show();

	                        ***REMOVED***);
	                    ***REMOVED***
	                ***REMOVED***);
	            ***REMOVED***
	        ***REMOVED***
	            $("#btnGuardarComent").show();
	    ***REMOVED***);

	        $(".btnMegusta").click(function() {
	            var tipoFoto = ($(this).attr('tipofoto'));
	            var idFoto = ($(this).attr('idfoto'));
	            guardarMeGusta('M', tipoFoto, idFoto);
	    ***REMOVED***);

	        $(".btnNoMegusta").click(function() {
	            var tipoFoto = ($(this).attr('tipofoto'));
	            var idFoto = ($(this).attr('idfoto'));
	            guardarMeGusta('N', tipoFoto, idFoto);
	    ***REMOVED***);

	        $("#enlace_cierre").click(function() {
	            cerrarSesionUsu();
	    ***REMOVED***);



	        configurarEnlaceLocation();

	        $("#btnSubirFoto_AUX").click(function () {
	            if ($("#hdIdUsuario").val() != "") {
                        $("#btnSubirFoto").trigger("click");

	        ***REMOVED*** else {

	                //$("#txtEmailLog").focus();
	                //bootbox.alert("Acción válida para usuarios registrados.<a role=\"button\" href=\"#s5\" >Ingrese con sus datos<a>");
	                bootbox.confirm({
	                    message: "Acción válida sólo para usuarios registrados",
	                    buttons: {
	                        confirm: {
	                            label: 'Ingresar',
	                            className: 'btn btn-primary active'
	                      ***REMOVED***
	                        cancel: {
	                            label: 'Cancelar',
	                            className: 'objHidden'
	                    ***REMOVED***
	                  ***REMOVED***
	                    callback: function (result) {
	                        if (result == true) {
                                document.location.href = "#s5";
	                            setTimeout(function () {
	                                $('#txtEmailLog').focus();
	                          ***REMOVED*** 10);
	                    ***REMOVED***
	                            
                                

	                ***REMOVED***
	            ***REMOVED***);
	       ***REMOVED***

	***REMOVED***);

	        $("#btnSigVerifica").click(function () {
	            var url = "/projectprofile/" + projectPerfil[0].id_project + "#s5";
	            window.location.href = url;

	    ***REMOVED***);


	        //filtro fuentes financiacion
	        configuraFiltro_Periodos();
	        //filtro componentes
	        configuraFiltro_Componentes();
	        $("#divDetActividades").hide();
	        

	        if ($('#filtro_periodo li').length > 1) {
	            var pos = $('#filtro_periodo li').length - 1;
	            $("#filtro_periodo li:eq(" + pos +")").trigger("onclick");
	    ***REMOVED***
	        if ($('#filtro_Componente li').length > 1) {
	            $('#filtro_Componente li:eq(1)').trigger("onclick");
	    ***REMOVED***

	        if (projectPerfil[0].id_project != undefined) {
	            //cargarComentarios(projectPerfil[0].id_project);
	            //GetComentariosConsolidado(projectPerfil[0].id_project);
	            GetComentarios(projectPerfil[0].id_project);

	            
	    ***REMOVED***


	***REMOVED***

	    function configuraFiltro_Periodos() {
	        if ($("#filtro_periodo").length > 0) {
	            $('#filtro_periodo li').bind('click onclick', function () {
	                var val_Sel = $(this).attr("id");
	                $(this).attr("class", "selected");
	                $("#sel_periodo").html($(this).html());
	                $("#selhd_periodo").val(val_Sel);

	                if ($.trim(val_Sel) != "" && val_Sel != undefined) {
	                    var id_proyecto = projectPerfil[0].id_project;
	                    GetFuentesByPeriodo(id_proyecto, val_Sel);

	            ***REMOVED*** else {
	                    //opcion vacia
	                    $("#divDetFuentes").children().remove();
	            ***REMOVED***

	        ***REMOVED***);
	    ***REMOVED***
	***REMOVED***

	    function configuraFiltro_Componentes() {
	        if ($("#filtro_Componente").length > 0) {
	            $('#filtro_Componente li').bind('click onclick', function () {
	                var val_Sel = $(this).attr("codigo");
	                $(this).attr("class", "selected");
	                $("#sel_componente").html($(this).html());
	                $("#selhd_componente").val(val_Sel);
	                if ($.trim(val_Sel) != "" && val_Sel != undefined) {
	                    var id_proyecto = projectPerfil[0].id_project;
	                    GetActividadesByComponente(id_proyecto, val_Sel);
	            ***REMOVED*** else {
	                    //opcion vacia
	                    $("#divDetActividades").children().remove();
	                    $("#divDetActividades").hide();
	            ***REMOVED***

	        ***REMOVED***);
	    ***REMOVED***
	***REMOVED***

	    function GetFuentesByPeriodo(id_proyecto, id_periodo) {
	        $("#divDetFuentes").children().remove();
	        var colores = ["#1a237e", "#283593", "#3949ab", "#5c6bc0", "#7986cb", "#64b5f6", "#5864dd"];
	        var url = '/api/serviciosproyectos/GetFuentesPeriodo';
	        var param = "IdProyecto=" + id_proyecto + "&IdPeriodo=" + id_periodo;
	        Services.projectsList(url + "?" + param)
            .done(function (result) {
                var items_result = result.fuentesFinanciacion;
                if (items_result.length > 0) {
                    for (var i = 0; i < items_result.length; i++) {
                        var residuo_aux = i % colores.length;
                        var color = colores[residuo_aux];
                        //add options
                        var nom_div = "graf_fuente_" + i.toString();
                        var titulo_aux = "";
                        var div_fuente = d3.select("#divDetFuentes").append("div")
                        .attr("id", "fuente_" + i.toString())
                        .attr("class", "stageBox")
                        div_fuente.append("h4").text(items_result[i].Nombre)
                        var div_aux = div_fuente.append("div")
                        .attr("class", "dataGraph clearfix")
                        //.attr("style", "width:650px;height:auto;")
                        div_aux.append("span")
                       .attr("class", "badge pull-left")
                       .text("PRESUPUESTADO: " + "L" + comunes.separar_miles(comunes.convertirMillones(items_result[i].ValorPresupuesto.toString())) + " Millones")
                        div_aux.append("span")
                       .attr("class", "badge pull-right")
                        .text("EJECUTADO: " + "L " + comunes.separar_miles(comunes.convertirMillones(items_result[i].ValorEjecutado.toString())) + " Millones")
                        div_fuente.append("div")
                        .attr("id", "graf_fuente_" + i.toString())
                        .attr("class", "boxcolor")
                        if ($(nom_div.length > 0)) {
                            var porcentaje = (parseFloat(items_result[i].Porcentaje) / 100).toFixed(4);
                            var data_financiero = [{ "year": anyo_actual, "name": items_result[i].Nombre, "value": porcentaje ***REMOVED***];
                            make_viz_fuentes(nom_div, data_financiero, titulo_aux, color, "Avance");
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED*** else {
                    $("#divDetFuentes").children().remove();
            ***REMOVED***
        ***REMOVED***);
	***REMOVED***

	    function make_viz_fuentes(div_contenedor, data_contenido, titulo, color, etiqueta) {
	        //var obj_data = JSON.stringify(data_contenido);
	        var visualization = d3plus.viz()
             .container("#" + div_contenedor)
             .data({ "value": data_contenido, ***REMOVED***)
             .type("bar")
             .id("name")
             .color({
                 "scale": [color]
         ***REMOVED***)
             .font({ "family": "inherit", "size": 14 ***REMOVED***)
             .tooltip({ "value": false ***REMOVED***)
             .background("rgba(255, 255, 255, 0)")
             .text({ "value": "value" ***REMOVED***)
             .format({
                 "text": function (text, key) {
                     if (text === "value") {
                         return "% Ejecutado"
                 ***REMOVED***
                     else {
                         //var formatted = d3plus.number.format(text, key);
                         var formatted = text;
                         if (isNaN(formatted) == false) {
                             return (formatted * 100).toFixed(1) + " %";
                     ***REMOVED*** else {
                             return text;
                     ***REMOVED***
                 ***REMOVED***
             ***REMOVED***
         ***REMOVED***)
               .title(
                    {
                        "value": titulo,
                        //"padding": 2,
                        "font": { "size": 14, "family": "inherit", "align": "left" ***REMOVED***
                ***REMOVED***
                    )
                .height({ "small": 70, "value": 80 ***REMOVED***)
                .axes({
                    "background": { "color": "rgba(255,255,255,0)", "ticks": true, "stroke": { "width": 2, "color": color ***REMOVED*** ***REMOVED***,
                    "font": { "family": "inherit" ***REMOVED***,
                    "label": true
            ***REMOVED***)
                .x(
                    {
                        "stacked": false,
                        "value": "value",
                        "axis": { "padding": "10px", "color": "#1a237e", "border-color": color ***REMOVED***,
                        "ticks": { "color": "#CCCCCC", "labels": [0, 0.2, 0.4, 0.6, 0.8, 1] ***REMOVED***,
                        "stacked": false,
                        "lines": { "color": "#E14C21" ***REMOVED***,
                        "scale": "share",
                        "padding": 1,
                        "grid": false,
                        "label": {
                            "value": false,
                            //"padding": 10,
                            "font": { "family": "inherit", "weight": "bold", "size": 14 ***REMOVED***
                    ***REMOVED***
                ***REMOVED***)
                    .y(
                    {
                        "scale": "discrete",
                        "value": "year",
                        "ticks": { "color": "rgba(255,255,255,0)", "labels": false ***REMOVED***,
                        "lines": { "color": "#E14C21", "width": 60 ***REMOVED***,
                        "axis": { "padding": "1px", "color": "rgba(255,255,255,0)", "label": false ***REMOVED***,
                        "grid": false,
                        "label": {
                            "value": false,
                            //"padding": 10,
                            "font": { "family": "inherit", "weight": "bold", "size": 14, "color": "rgba(255,255,255,0)" ***REMOVED***
                    ***REMOVED***

                ***REMOVED***)
                //.time({ "value": "year", "fixed":true***REMOVED***)
                .resize(true)
                .draw()
	***REMOVED***

	    function GetActividadesByComponente(id_proyecto, id_componente) {
	        $("#divDetActividades").hide();
	        $("#divDetActividades").children().remove();
	        var url = '/api/serviciosproyectos/GetActividadesComponentes';
	        var param = "IdProyecto=" + id_proyecto + "&codComponente=" + id_componente;
	        Services.projectsList(url + "?" + param)
            .done(function (result) {
                var items_result = result.componentes;



                if (items_result.length > 0) {
                    for (var i = 0; i < items_result.length; i++) {
                        //add options
                        var divLista = d3.select("#divDetActividades").append("div")
                        .attr("class", "list-item")
                        divLista.append("span")
                        .attr("class", "badge")
                        .text(items_result[i].Codigo.toString())
                        divLista.append("span")
                        .text(" " + items_result[i].Nombre.toString())
                        $("#divDetActividades").show();
                ***REMOVED***
            ***REMOVED*** else {
                    $("#divDetActividades").children().remove();
                    $("#divDetActividades").hide();

            ***REMOVED***
        ***REMOVED***);
	***REMOVED***


	    function validaClaveUsu(cadena) {
	        //que tenga mayusculas, numeros,de 8 digitos al menos
	        var clave = new RegExp(/^(?=(?:.*\d){1***REMOVED***)(?=(?:.*[A-Z]){1***REMOVED***)\S{8,***REMOVED***$/);
	        valida = clave.test(cadena);
	        return valida;
	***REMOVED***

	    function validaCamposOblig(contenedor) {
	        var formularioOK = true;
	        var camposReq = "";
	        $(".alert-danger").hide();
	        $('.required', $("#" + contenedor )).each(function (i, e) {
	            var id_txt = $(e).attr("for");
	            if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
	                camposReq += "[" + id_txt + "]";
	                $("#error_" + id_txt).show();
	                formularioOK = false;
	        ***REMOVED*** else {
	                $("#error_" + id_txt).hide();
	        ***REMOVED***
	    ***REMOVED***);
	        return formularioOK;
	***REMOVED***



	    function iniUsuarioLog() {
	        $("#hdIdUsuario").val(projectPerfil[0].idUsuParticipa);
	        $("#hdNomUsuario").val(projectPerfil[0].nomUsuParticipa);
	        if ($("#hdIdUsuario").val() != "") {
	            //habilita funcion subir fotos
	            //$("#divFotoUsuario").css("visibility","visible");
	            $("#divUsuarioLog").slideUp(100, function () {
	                $("#divNomUsuarioLog").text("Hola, " + $("#hdNomUsuario").val());
	                 $("#divCloseSesion").show();
	                 $("#divPregParticipacion").css("visibility", "visible");
	                $("#divPregParticipacion").attr("class", "objVisible");
	                //ObtPregParticipacion();
	        ***REMOVED***);

	    ***REMOVED*** else {
                    //$("#divFotoUsuario").css("visibility", "collapse");
	       ***REMOVED***
	***REMOVED***

	    function GetEstadisticas(id) {
	        var params_usu = { "IdProyecto": id ***REMOVED***;
	        $.ajax({
	            type: 'GET',
	            contentType: "application/json; charset=utf-8",
	            dataType: "json",
	            url: "/api/Participacion/GetEstadisticas",
	            cache: false,
	            data: params_usu,
	            success: function (result) {
	                if (result.status == true) {
	                    //USUARIO EXISTE
	                    var objEtd = result.estadisticasProy;
	                     $("#spMeGusta").text("Me Gusta (" + objEtd.cantMegusta + ")");
	                     $("#spComentarios").text("Comentarios (" + objEtd.cantComentarios + ")");

	            ***REMOVED*** else {
	                    bootbox.alert("Error: " + result.message, function () {

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


	    function configurarEnlaceLocation() {

	        $('.enlace_ficha').each(function (i, e) {
	            $(e).bind('click', function () {
	                var cad_aux = "prueba";
	                var enlace_url = "../../localizacion/LocationProfile#/";
	                var anyo = (new Date).getFullYear() - 1;
	                var location_id = $(this).attr("location_id");
	                document.cookie = "location_id=" + location_id + ";path=/;";
	                var tipo = $(this).attr("tipo");
	                //&municipio=0000&departamento=00&periods=2016&sector=2
	                if (tipo == "departamento") {
	                    //departamento
	                    enlace_url += "?" + "departamento=" + location_id
	            ***REMOVED*** else {
	                    //municipio
	                    enlace_url += "?" + "municipio=" + location_id
	            ***REMOVED***
	                //enlace_url += "&aux=" + Math.random();
	                //enlace_url = "../localizacion/EnlaceLocation?dataType=" + tipo + "&dataValue=" + location_id + "&aux=" + Math.random();
	                //-----------------------------------
	                $(this).attr('href', enlace_url);
	                //location.href = enlace_url;
	        ***REMOVED***);
	    ***REMOVED***)
	***REMOVED***


	    function VerificaCuentaUsuarioNew() {
	        //valida campos obligatorios
	        var formularioOK = true;
	        var camposReq = "";
	        $(".alert-danger").hide();
	        $('.required', $('#divInfoUsuario')).each(function (i, e) {
	            var id_txt = $(e).attr("for");
	            if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
	                camposReq += "[" + id_txt + "]";
	                $("#error_" + id_txt).show();
	                formularioOK = false;
	        ***REMOVED*** else {
	                $("#error_" + id_txt).hide();
	        ***REMOVED***
	    ***REMOVED***);

	        if (formularioOK == false) {
	            if (camposReq != "") {
	                bootbox.alert("Faltan campos obligatorios");
	        ***REMOVED***
	    ***REMOVED*** else {
	            //validarCorreo
	            if ($("#txtPassword").val() != $("#txtPassword_2").val()) {
	                bootbox.alert("Confirmación Password incorrecta");
	        ***REMOVED*** else {
	                var clave_usu = $("#txtPassword").val();
	                if (validaClaveUsu(clave_usu) == false) {
	                    bootbox.alert("Formato de clave incorrecto: Debe tener 8 dígitos al menos,contener números y al menos una letra mayúscula");
	            ***REMOVED*** else {
	                    //validarCorreo
	                    var correo_usu = $("#txtEmail").val();
	                    if (comunes.validaEmail(correo_usu.toLowerCase())) {
	                        //validar edad
	                        if (comunes.validaEnteroMayorCero($("#txtEdad").val())) {
	                            var params_usu = {
	                                Nombre: $("#txtNombre").val(),
	                                email: $("#txtEmail").val(),
	                                hash_clave: $("#txtPassword").val(),
	                                Edad: $("#txtEdad").val(),
	                                IdGenero: $("#filtro_Genero li.selected").attr("id_gen"),
	                                IdRol: $("#filtro_Rol li.selected").attr("id_rol"),
	                                IdMedio: $("#filtro_Medios li.selected").attr("id_medio")
	                        ***REMOVED***;
	                            //add nuevo registro
	                            $.ajax({
	                                type: 'POST',
	                                contentType: "application/json; charset=utf-8",
	                                dataType: "json",
	                                url: "/api/Participacion/AddUsuarios",
	                                cache: false,
	                                data: JSON.stringify(params_usu),
	                                success: function (result) {
	                                    if (result.status == true) {
	                                        bootbox.alert("Usuario Registrado Exitosamente", function () {
	                                            $("#divCuentaNueva").slideUp(100, function () {
	                                                $("#divUsuarioLog").slideDown(function () {
	                                                    limpiarCamposUsuario();
	                                            ***REMOVED***);
	                                        ***REMOVED***);
	                                    ***REMOVED***);

	                                ***REMOVED*** else {
	                                        bootbox.alert("@Error: " + result.message);
	                                ***REMOVED***

	                              ***REMOVED***
	                                error: function (response) {
	                                    alert(response.responseText);
	                              ***REMOVED***
	                                failure: function (response) {
	                                    alert(response.responseText);
	                            ***REMOVED***
	                        ***REMOVED***);

	                    ***REMOVED*** else {
	                            bootbox.alert("Edad inválida");

	                    ***REMOVED***
	                ***REMOVED*** else {
	                        bootbox.alert("Email inválido");
	                ***REMOVED***

	            ***REMOVED***


	        ***REMOVED***
	    ***REMOVED***


	***REMOVED***


	    function AddNuevaCuentaUsuario() {
	        //valida campos obligatorios
	        var formularioOK = true;
	        var camposReq = "";
	        $(".alert-danger").hide();
	        $('.required', $('#divInfoUsuario')).each(function (i, e) {
	            var id_txt = $(e).attr("for");
	            var tipo = $("#" + id_txt).prop('type').toLowerCase();
	            if (tipo == "text" || tipo=="password") {
	                if($("#" + id_txt).val() == ""){
	                    camposReq += "[" + id_txt + "]";
	                    $("#error_" + id_txt).show();
	                    formularioOK = false;
	            ***REMOVED***else{
	                    $("#error_" + id_txt).hide();
	            ***REMOVED***
	        ***REMOVED***else{
	                if ($('#' + id_txt + ' li.selected').attr('id')=="0") {
	                    camposReq += "[" + id_txt + "]";
	                    $("#error_" + id_txt).show();
	                    formularioOK = false;
	            ***REMOVED*** else {
	                    $("#error_" + id_txt).hide();
	            ***REMOVED***
	            
	        ***REMOVED***
 	            
	    ***REMOVED***);

	        if (formularioOK == false) {
	            if (camposReq != "") {
	                bootbox.alert("Faltan campos obligatorios");
	        ***REMOVED***
	    ***REMOVED*** else {
	            //validarCorreo
	            if ($("#txtPassword").val() != $("#txtPassword_2").val()) {
	                bootbox.alert("Confirmación Password incorrecta");
	        ***REMOVED*** else {
	                var clave_usu = $("#txtPassword").val();
	                if (validaClaveUsu(clave_usu) == false) {
	                    bootbox.alert("Formato de clave incorrecto: Debe tener 8 dígitos al menos,contener números y al menos una letra mayúscula");
	            ***REMOVED*** else {
	                    //validarCorreo
	                    var correo_usu = $("#txtEmail").val();
	                    if (comunes.validaEmail(correo_usu.toLowerCase())) {
	                        //validar edad
	                        if (comunes.validaEnteroMayorCero($("#txtEdad").val())) {
	                            var params_usu = {
	                                Nombre: $("#txtNombre").val(),
	                                email: $("#txtEmail").val(),
	                                hash_clave: $("#txtPassword").val(),
	                                Edad: $("#txtEdad").val(),
	                                IdGenero: $("#filtro_Genero li.selected").attr("id_gen"),
	                                IdRol: $("#filtro_Rol li.selected").attr("id_rol"),
	                                IdMedio: $("#filtro_Medios li.selected").attr("id_medio"),
	                                IdProyRel: projectPerfil[0].id_project
	                        ***REMOVED***;
	                            //add nuevo registro
	                            $.ajax({
	                                type: 'POST',
	                                contentType: "application/json; charset=utf-8",
	                                dataType: "json",
	                                url: "/api/Participacion/AddUsuarios",
	                                cache: false,
	                                data: JSON.stringify(params_usu),
	                                success: function (result) {
	                                    if (result.status == true) {
	                                        bootbox.alert("Su cuenta ha sido creada. Hemos enviado a su correo electrónico un link de verificación para activarla.", function () {
	                                            $("#divCuentaNueva").slideUp(100, function () {
	                                                $("#divUsuarioLog").slideDown(function () {
	                                                    limpiarCamposUsuario();
	                                            ***REMOVED***);
	                                        ***REMOVED***);
	                                    ***REMOVED***);

	                                ***REMOVED*** else {
	                                        bootbox.alert("@Error: " + result.message);
	                                ***REMOVED***

	                              ***REMOVED***
	                                error: function (response) {
	                                    alert(response.responseText);
	                              ***REMOVED***
	                                failure: function (response) {
	                                    alert(response.responseText);
	                            ***REMOVED***
	                        ***REMOVED***);

	                    ***REMOVED*** else {
	                            bootbox.alert("Edad inválida");

	                    ***REMOVED***
	                ***REMOVED*** else {
	                        bootbox.alert("Email inválido");
	                ***REMOVED***

	            ***REMOVED***


	        ***REMOVED***
	    ***REMOVED***
	***REMOVED***

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
	        ***REMOVED***);

	    ***REMOVED*** else if (opc == "clave") {
                $("#txtPassword_re").val("");
	            $("#txtPassword_re_2").val("");
                $("#txtCodigoVerifica").val("");
                $("#txtEmailReset").val("");
                //txtEmailVerifica
                //hdIdUsuario


	    ***REMOVED*** else if (opc == "all") {
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
	        ***REMOVED***);

	    ***REMOVED***
            
            

	       

	        
	***REMOVED***


	   	    function cerrarSesionUsu() {
	        $.ajax({
	            type: 'POST',
	            contentType: "application/json; charset=utf-8",
	            dataType: "json",
	            url: "/api/Participacion/CerrarSession",
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
	                ***REMOVED***);


	            ***REMOVED*** else {
	                    bootbox.alert("@Error: " + result.message);
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
	        ***REMOVED*** else {
	                $("#error_" + id_txt).hide();
	        ***REMOVED***
	    ***REMOVED***);

	        if (formularioOK == false) {
	            if (camposReq != "") {
	                bootbox.alert("Faltan campos obligatorios");
	        ***REMOVED***
	    ***REMOVED*** else {
                //validarCorreo
	                var correo_usu = $("#txtEmailLog").val();
	                if (comunes.validaEmail(correo_usu.toLowerCase())) {
	                    var params_usu = {
	                        email: $("#txtEmailLog").val(),
	                        hash_clave: $("#txtClaveLog").val()
	                ***REMOVED***;
	                    //add nuevo registro
	                    $.ajax({
	                        type: 'POST',
	                        contentType: "application/json; charset=utf-8",
	                        dataType: "json",
	                        url: "/api/Participacion/ValidaLogin",
	                        cache: false,
	                        data: JSON.stringify(params_usu ),
	                        success: function (result) {
	                            if (result.status == true) {
	                                //USUARIO EXISTE
	                                $("#divNomUsuarioLog").text("Hola, " + result.usuarios.Nombre);
	                                $("#hdNomUsuario").val(result.usuarios.Nombre);
	                                $("#hdIdUsuario").val(result.usuarios.IdUsuario);
	                                //$("#divFotoUsuario").css("visibility", "visible");
	                                $("#divUsuarioLog").slideUp(100, function () {
	                                    $("#divCloseSesion").show();
	                                    $("#divPregParticipacion").attr("class", "objVisible");
                                            //ObtPregParticipacion();
	                            ***REMOVED***);


	                        ***REMOVED*** else {
	                                bootbox.alert("Error: " + result.message, function () {
                    
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

	            ***REMOVED*** else {
	                    bootbox.alert("Email inválido");
	            ***REMOVED***
	    ***REMOVED***
	***REMOVED***

	    function ObtPregParticipacion() {
	        if (projectPerfil[0].id_project != undefined) {
	            var id_proyecto = projectPerfil[0].id_project;
	            var id_status = projectPerfil[0].idStatus;
	            var url = '/api/Participacion/GetPreguntasProy';
	            var param = "IdProyecto=" + id_proyecto + "&IdEstado=" + id_status;
	            Services.projectsList(url + "?" + param)
                .done(function (result) {
                    var items_result = result.preguntasProy;
                    if (items_result.length > 0) {
                        var id_preg_aux = 0;
                        var id_preg = 0;
                        for (var i = 0; i < items_result.length; i++) {
                          id_preg = items_result[i].IdPregunta;
                          if (id_preg != id_preg_aux) {
                              //incluir div de error
                                var dPregunta=d3.select("#divDetPreguntas").append("div")
                                .attr("class", "form-group preg_part")
                                .attr("id", "preg_" + items_result[i].IdPregunta)
                                .attr("id_preg", items_result[i].IdPregunta)
                                var divencabezado = dPregunta.append("div")
                                .attr("class", "preg")
                                 divencabezado.append("span")
                                .attr("class", "h3 required")
                                .text(items_result[i].TextoPregunta)
                                 dPregunta.append("div")
                                .attr("class", "opt_part")
                                .attr("id", "opt_" + items_result[i].IdPregunta)
                                 dPregunta.append("div")
                                .attr("class", "alert-danger")
                                .attr("id", "error_q_" + items_result[i].IdPregunta)
                                .attr("style", "display:none")
                                .append("br");
                                 dPregunta.append("span")
                                 .text("¿Desea enviar un comentario al responsable del proyecto?")
                                 var divtxt = dPregunta.append("div")
                                 .attr("class", "txtAbierto")
                                 divtxt.append("input")
                                  .attr("type","text")
                              .attr("id", "txtp_" + items_result[i].IdPregunta);
                                id_preg_aux = items_result[i].IdPregunta;
                        ***REMOVED***
                            //carga opciones respuesta
                            if ($("#preg_" + id_preg_aux).length > 0) {
                                var div_preg_usu=d3.select("#opt_" + id_preg_aux).append("div")
                                .attr("class", "radio")
                                div_etiqueta=div_preg_usu.append("label")
                                div_etiqueta.append("input")
                                .attr("type", "radio")
                                .attr("name", "opc_" + items_result[i].IdPregunta)
                                .attr("idopc", items_result[i].IdOpcionRespuesta)
                                .attr("idpreg", items_result[i].IdPregunta)
                                div_etiqueta.append("text").text(items_result[i].Etiqueta)
                        ***REMOVED***
                            
                    ***REMOVED***
                        //botonera
                        var divBotonera=d3.select("#divDetPreguntas")
                        .append("div")
                        .attr("class", "form-group text-center")
                        divBotonera.append("button")
                        .attr("type", "button")
                        .attr("class", "btn btn-primary btn-lg")
                        .text("ENVIAR")
                        .attr("id","btnGuardarComentarios")
                        divBotonera.append("br")
                        divBotonera.append("br")

                        if (("#btnGuardarComentarios").length>0){
                            $("#btnGuardarComentarios").click(function () {
                                AddXMLComentarios(id_proyecto);

                        ***REMOVED***);

                    ***REMOVED***
                        
                ***REMOVED***

            ***REMOVED***);
	    ***REMOVED***

	***REMOVED***


	    function AddXMLComentarios(id_proyecto) {

	        var xml_respuesta = generarXML(id_proyecto);
	        if (xml_respuesta != "") {
                $.ajax({
	                        type: 'POST',
	                        contentType: "text/xml",
	                        url: "/api/Participacion/AddXMLComentarios",
	                        data: xml_respuesta,
	                        success: function (result) {
	                            if (result.status == true) {
	                                //COMENTARIOS GUARDADOS EXITOSAMENTE
		                                $("#divPregParticipacion").slideUp(100, function () {
	                                    $("#divCloseSesion").show();
	                                    var nom_usu = $("#hdNomUsuario").val();
	                                    $("#txtMsgConfirmaEnvio").text("Muchas Gracias " + nom_usu);
	                                    $("#divConfirmaEnvio").slideDown(function () {
	                                        if (projectPerfil[0].id_project != undefined) {
	                                            //cargarComentarios(projectPerfil[0].id_project);
	                                            GetComentariosConsolidado(projectPerfil[0].id_project);
                                                GetEstadisticas(projectPerfil[0].id_project);

	                                    ***REMOVED***
	                                ***REMOVED***);
	                            ***REMOVED***);


	                        ***REMOVED*** else {
	                                bootbox.alert("@Error: " + result.message);
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

	    function generarXML(id_proyecto) {
	        var xml_respuesta = "";
	        var formularioOK = true;
            var camposReq = "";
	        $(".alert-danger").hide();
	        var id_usuario = $("#hdIdUsuario").val();
	        var id_departamento = $("#filtro_AreaInfluencia li.selected").attr("id_depa");
	        var id_municipio = $("#filtro_AreaInfluencia li.selected").attr("id_munic");
       
	        $('.preg_part', $('#divDetPreguntas')).each(function (i, e) {
	            var id_pregunta = $(e).attr("id_preg");
	            var cant_select = $('input[name=' + 'opc_' + id_pregunta + ']:checked').length;
	            if (cant_select <= 0) {
	                $("#error_q_" + id_pregunta).html("Debe seleccionar una de las opciones");
	                $("#error_q_" + id_pregunta).show();
	                formularioOK = false;
	                camposReq += "[" + $(e).attr("id") + "]";
	        ***REMOVED***
	    ***REMOVED***);

	        if (formularioOK == false) {
	            if (camposReq != "") {
	                bootbox.alert("Faltan campos obligatorios");
	        ***REMOVED***

	    ***REMOVED*** else {
	            if (id_departamento == "" || id_municipio == "" || id_departamento==undefined || id_municipio==undefined) {
	                formularioOK = false;
	                bootbox.alert("Seleccione un municipio");
	        ***REMOVED***
	    ***REMOVED***
	        if (formularioOK == true) {
	            xml_respuesta += "<root>";
	            $('.preg_part', $('#divDetPreguntas')).each(function (i, e) {
	                var id_pregunta = $(e).attr("id_preg");
	                var obj = $('input[name=' + 'opc_' + id_pregunta + ']:checked');
	                var txt_resp = $('input[id=' + 'txtp_' + id_pregunta + ']').val();

	                xml_respuesta += "<respuesta>"
	                xml_respuesta += "<id_usuario>" + id_usuario + "</id_usuario>";
	                xml_respuesta += "<id_pregunta>" + obj.attr("idpreg") + "</id_pregunta>";
	                xml_respuesta += "<id_opcion>" + obj.attr("idopc") + "</id_opcion>";
	                xml_respuesta += "<id_proyecto>" + id_proyecto + "</id_proyecto>";
	                xml_respuesta += "<id_departamento>" + id_departamento + "</id_departamento>";
	                xml_respuesta += "<id_municipio>" + id_municipio + "</id_municipio>";
	                xml_respuesta += "<respuesta_cuestionario>" + txt_resp + "</respuesta_cuestionario>";
	                xml_respuesta += "</respuesta>";
	        ***REMOVED***);
	            xml_respuesta += "</root>";
	    ***REMOVED*** else {
	            xml_respuesta = "";
	    ***REMOVED***
	        return xml_respuesta;

	***REMOVED***

	    

     function make_viz(div_contenedor, data_contenido, titulo,color,etiqueta) {
         var visualization = d3plus.viz()
         .container("#" + div_contenedor)
         .data({ "value": data_contenido, ***REMOVED***)
         .type("bar")
         .id("name")
         .color({
             "scale": [color]
     ***REMOVED***)
         .font({ "family": "inherit" , "size" : 14 ***REMOVED***)
         .tooltip({ "value": false ***REMOVED***)
         .background("rgba(255, 255, 255, 0)")
         .text({ "value": "value" ***REMOVED***)
         .format({
                "text": function (text, key) {
                    if (text === "value") {
                        return "% Ejecutado"
                ***REMOVED***
                    else {
                        //var formatted = d3plus.number.format(text, key);
                        var formatted = text;
                        if (isNaN(formatted)==false) {
                            return (formatted * 100).toFixed(2) + " %";
                    ***REMOVED*** else {
                            return text;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
     ***REMOVED***)
           .title(
                {
                    "value": titulo,
                    "padding": 10,
                    "font": {"size" : 20***REMOVED***
            ***REMOVED***
                )
            .height({ "small": 170, "value": 180 ***REMOVED***)
            .axes({
                "background": { "color": "rgba(255,255,255,0)", "ticks": true, "stroke": { "width": 2, "color": color ***REMOVED*** ***REMOVED***,
                "font": { "family": "inherit" ***REMOVED***,
                "label": true
        ***REMOVED***)
            .x(
                {
                    "stacked": false,
                    "value": "value",
                    "axis": { "padding": "10px", "color": "#005951", "border-color": "#bc102a" ***REMOVED***,
                    "ticks": { "color": "#CCCCCC", "labels": [0, 0.2, 0.4, 0.6, 0.8, 1] ***REMOVED***,
                    "stacked": false,
                    "lines": { "color": "#E14C21" ***REMOVED***,
                    "scale": "share",
                    "padding": 0.1,
                    "grid": false,
                    "label": {
                        "value": etiqueta,
                        "padding": 10,
                        "font": {"family" : "inherit" , "weight" : "bold" , "size" :14 ***REMOVED***
                ***REMOVED***
            ***REMOVED***)
                .y(
                {
                    "scale": "discrete",
                    "value": "year",
                    "ticks": { "color": "rgba(255,255,255,0)", "labels": false ***REMOVED***,
                    "lines": { "color": "#E14C21", "width": 100 ***REMOVED***,
                    "axis": { "padding": "10px", "color": "#005951", "label": false ***REMOVED***,
                    "grid": false,
                    "label": {
                        "value": false,
                        "padding": 10,
                        "font": { "family": "inherit", "weight": "bold", "size": 14, "color": "rgba(255,255,255,0)" ***REMOVED***
                ***REMOVED***

            ***REMOVED***)
            //.time("year")
            .resize(true)
            .draw()
	***REMOVED***

	    function pad(n, length) {
	        var n = n.toString();
	        while (n.length < length)
	            n = "0" + n;
	        return n;
	***REMOVED***


	    function cargarComentarios(id) {
	        if ($("#content-1").length > 0) {
	            $("#content-1").remove();
	    ***REMOVED***
	        var url = '/api/Participacion/GetComentarios';
	        var param = "IdProyecto=" + id;
	        Services.projectsList(url + "?" + param)
            .done(function (result) {
                var items_result = result.comentarios;
                $("#txtNumComentarios").text("Comentarios Recientes (" + items_result.length + ")");
                if ($("#content-1").length <= 0) {
                     d3.select("#divComentarios")
                    .append("div")
                    .attr("id", "content-1")
                    .attr("class", "content mCustomScrollbar")
                    .attr("data-mcs-theme", "minimal")
            ***REMOVED***
                
                if (items_result.length > 0) {
                    var id_usuario_aux = 0;
                    var id_usuario = 0;
                    for (var i = 0; i < items_result.length; i++) {
                        id_usuario = items_result[i].IdUsuario;
                        if (id_usuario != id_usuario_aux) {
                            
                            var d = new Date(items_result[i].fecha);
                            var fecha_aux = pad(d.getDate(),2) + "/" + pad(parseInt((d.getMonth())+1),2) + "/" + d.getFullYear();
                                if ($("#content-1").length > 0) {
                                    var div_comment=d3.select("#content-1").append("div")
                                     .attr("class", "boxComent")
                                    var div_col=div_comment.append("div")
                                    .attr("class", "col-md-3")
                                    var div_autor = div_col.append("div")
                                    .attr("class", "autorContent")
                                    div_autor.append("div")
                                    .attr("class", "imgAutor")
                                    .append("span")
                                    .attr("class", "glyphicon glyphicon-user")
                                    div_autor.append("div")
                                    .attr("class", "autor")
                                    .append("text").text(" " + items_result[i].nom_usuario)
                                    var div_fecha=div_autor.append("div")
                                    .attr("class", "dateCom")
                                    div_fecha.append("span")
                                    .attr("class", "glyphicon glyphicon-calendar")
                                    div_fecha.append("text").text(" " + fecha_aux)
                                    div_comment.append("div")
                                    .attr("class", "col-md-9")
                                    .append("div")
                                    .attr("class", "wrapCom")
                                    .attr("id", "com_usu_" + items_result[i].IdUsuario)
                                    id_usuario_aux = items_result[i].IdUsuario;
                                ***REMOVED***
                            ***REMOVED***
                        //carga comentarios
                            if ($("#com_usu_" + id_usuario_aux).length > 0) {
                                var div_com_usu = d3.select("#com_usu_" + id_usuario_aux)
                                .append("div")
                                .attr("class", "comentType")
                                div_com_usu.append("span")
                                .attr("class", "h3")
                                .text(items_result[i].textoPregunta)
                                div_com_usu.append("p")
                                .attr("class", "userComent")
                                .text(items_result[i].respUsuario)
                        ***REMOVED***
                        
                  ***REMOVED***
              ***REMOVED***

        ***REMOVED***);
	***REMOVED***

	    
	    function GetComentariosConsolidado(id) {
	        if ($("#content-2").length > 0) {
	            $("#content-2").remove();
	    ***REMOVED***
	        var url = '/api/Participacion/GetComentariosConsolidado';
	        var param = "IdProyecto=" + id;
	        Services.projectsList(url + "?" + param)
            .done(function (result) {
                var items_result = result.comentariosConsolidado;
                if ($("#content-2").length <= 0) {
                    d3.select("#divComentarios")
                   .append("div")
                   .attr("id", "content-2")
                   .attr("class", "content mCustomScrollbar")
                   .attr("data-mcs-theme", "minimal")
            ***REMOVED***
                //------si se usa d3plus-----------------------
                //for (var i = 0; i < items_result.length; i++) {
                //        items_result[i].PorcentajeRespuesta = parseFloat(items_result[i].PorcentajeRespuesta);
                //***REMOVED***
                  // var visualization = d3plus.viz()
                  //.container("#divGraphComentarios")
                  //.data(items_result)
                  //.type("bar")
                  //.id("PorcentajeRespuesta")
                  // .x("PorcentajeRespuesta")
                  //.y({ "scale": "discrete","value":"EtiquetaOpcion" ***REMOVED***)
                //.draw()
                //---------------------------------------------
                var cant_comentarios = 0;
                if (items_result.length > 0) {
                    var id_preg_aux = 0;
                    var id_preg = 0;
                    var cont_resp = 0;

                    for (var i = 0; i < items_result.length; i++) {
                       
                        id_preg = items_result[i].IdPregunta;
                        if (id_preg != id_preg_aux) {
                            if ($("#content-2").length > 0) {
                                var div_commenta = d3.select("#content-2")
                                var div_comment = div_commenta.append("div")
                                .attr("class", "col-md-12")
                                .attr("style", "margin:25px border-top: 1px solid rgba(0,0,0,0);")
                                div_commenta.append("hr")
                                .attr("style", "margin-bottom:-5; border-top: 1px solid rgba(0,0,0,0.2);width:90%;")
                                //.attr("class", "")
                                var div_preg = div_comment.append("div")
                                .attr("id", "com_preg_" + items_result[i].IdPregunta)
                                .attr("class", "col-md-4")
                                .attr("style", "padding:10px; background-color:#EAEAEA; margin-top:15px; margin-bottom:15px;")

                                //.attr("class", "")
                                var div_texto = div_preg.append("div")
                                //.attr("class", "")
                                .append("text").text(" " + items_result[i].TextoPregunta.toString())
                                //-------para separacion 
                                div_separa = div_preg.append("div")
                                .attr("style", "padding-top: 10px; margin: 10px 0px; border-top: 1px solid #ccc; width: 100%; overflow: hidden; display: block")

                                //.attr("class", "")
                                var div_total=div_preg.append("div")
                                .append("text").text("Cantidad de Respuestas " + items_result[i].TotalRespuesta.toString())
                                id_preg_aux = items_result[i].IdPregunta;
                                cant_comentarios += items_result[i].TotalRespuesta;
                                var div_resp = div_comment.append("div")
                                .attr("id", "com_resp_" + items_result[i].IdPregunta)
                                .attr("class", "col-md-8")
                                .attr("style", "margin-top:15px;  margin-bottom:15px;")
                                cont_resp = 0;
                                //.attr("style", "background-color:white; margin-top:15px;  margin-bottom:15px;")

                        ***REMOVED***
                    ***REMOVED***
                        //carga comentarios
                        if ($("#com_preg_" + id_preg_aux).length > 0) {
                            //color de la barra
                            cont_resp++;
                            switch (cont_resp){
                                case 1: var colorb = "#85B200"; break;
                                case 2: var colorb = "#FFC926"; break;
                                case 3: var colorb = "#D90000"; break;
                                default: var colorb = "#2B5A86"; break;
                        ***REMOVED***

                            var div_com_usu = d3.select("#com_resp_" + id_preg_aux)
                            div_com_usu.append("div")
                            //.attr("class", "")
                            .text(items_result[i].EtiquetaOpcion.toString() + " " + items_result[i].PorcentajeRespuesta.toString() + " %")
                            div_com_usu.append("div")
                            //.attr("class", "")
                            .attr("style", "border-color:" + colorb + "; border-width: 1px; border-style:solid; width:100%;")
                            .append("div")
                            .attr("style", "background-color:" + colorb + "; height: 10px; width: " + items_result[i].PorcentajeRespuesta.toString() + "%;")

                    ***REMOVED***

                ***REMOVED***
                    $("#txtNumComentarios").text("Comentarios Recientes (" + cant_comentarios + ")");
            ***REMOVED***

	    ***REMOVED***);

	***REMOVED***
	   
	    

	    function AddnuevoUsuario() {
	        var formularioOK = true;
	        var camposReq = "";
	        $(".alert-danger").hide();
	        $('.required', $('#divInfoUsuario')).each(function (i, e) {
	            var id_txt = $(e).attr("for");
	            if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
	                camposReq += "[" + id_txt + "]";
	                $("#error_" + id_txt).show();
	                formularioOK = false;
	        ***REMOVED*** else {
	                $("#error_" + id_txt).hide();
	        ***REMOVED***
	    ***REMOVED***);

	        if (formularioOK == false) {
	            if (camposReq != "") {
	                bootbox.alert("Faltan campos obligatorios");
	        ***REMOVED***
	    ***REMOVED*** else {
	            //validarCorreo
	            if (validaEmail($('#txtEmail').val())) {
	                var patron = /^\d*$/;
	                if ($("#txtCelular").val().search(patron)) {
	                    bootbox.alert("Número de celular inválido");
	            ***REMOVED*** else {
	                    //guarda registro en bd
	                    var params = {
	                        nombre: $("#txtNombre").val(),
	                        email: $("#txtEmail").val(),
	                        celular: $("#txtCelular").val(),
	                        id_perfil: $("#ddlPerfil option:selected").val()
	                ***REMOVED***;

	                    ajaxPost('Views/Usuarios/crearUsuarios_ajax', params, null, function (r) {
	                        var errRes = r.split("<||>")[0];
	                        var mensRes = r.split("<||>")[1];
	                        if (r.indexOf("<||>") != -1) {
	                            if (errRes == '0') {
	                                bootbox.alert('Usuario creado exitosamente. Se enviaron instrucciones de verificación al correo registrado', function () {
	                                    resetearCampos("divInfoUsuario");
	                            ***REMOVED***);
	                        ***REMOVED*** else {
	                                bootbox.alert("@Error: " + mensRes);
	                        ***REMOVED***
	                    ***REMOVED***
	                  ***REMOVED*** function (r) {
	                        bootbox.alert(r.responseText);
	                ***REMOVED***);
	            ***REMOVED***
	        ***REMOVED*** else {
	                bootbox.alert("Correo electrónico inválido");
	        ***REMOVED***

	    ***REMOVED***

	***REMOVED***

         function guardarMeGusta(mg,tipoFoto,id) {
             //valida campos obligatorios
             var megusta = false;
             var nomegusta = false;
             var idFoto = '';
             var idFotoUsuario = '';
             if (mg == 'M')
             { megusta = true***REMOVED***
             else if (mg == 'N')
             { nomegusta = true ***REMOVED***
             else { bootbox.alert("Error"); ***REMOVED***
             if (tipoFoto == 'P')
             { idFoto = id; ***REMOVED***
             else if (tipoFoto == 'U')
             { idFotoUsuario = id; ***REMOVED***
             else { bootbox.alert("Error"); ***REMOVED***

	        var formularioOK = true;
	        var camposReq = "";
	        $(".alert-danger").hide();


	        if (formularioOK == false) {
	            if (camposReq != "") {
	                bootbox.alert("Faltan campos obligatorios");
	        ***REMOVED***
	    ***REMOVED*** else {
	            if ($("#hdIdUsuario").val()!=0) {
	                    var params_mg = {
	                        IdUsuario: $("#hdIdUsuario").val(),
	                        IdFoto: idFoto,
	                        IdFotoUsuario:idFotoUsuario,
	                        Megusta: megusta,
	                        NoMegusta: nomegusta,
	                        IdProyecto: projectPerfil[0].id_project,

	                ***REMOVED***;
	                    //add nuevo registro
	                    $.ajax({
	                        type: 'POST',
	                        contentType: "application/json; charset=utf-8",
	                        dataType: "json",
	                        url: "/api/Participacion/GuardaMeGusta",
	                        cache: false,
	                        data: JSON.stringify(params_mg),
	                        success: function (result) {
	                            if (result.status == true) {
	                               //ya no me gusta
	                                bootbox.alert("Su opinión ha sido guardada", function () {
	                                    if (projectPerfil[0].id_project != undefined) {
	                                        GetEstadisticas(projectPerfil[0].id_project);
	                                ***REMOVED***
	                            ***REMOVED***);

	                        ***REMOVED*** else {
	                                bootbox.alert("@Error: "  + result.message);
	                        ***REMOVED***
	                      ***REMOVED***
	                        error: function (response) {
	                            alert(response.responseText);
	                      ***REMOVED***
	                        failure: function (response) {
	                            alert(response.responseText);
	                    ***REMOVED***
	                ***REMOVED***);

	            ***REMOVED*** else {
	                //bootbox.alert("Ingrese con su usuario");
	                    bootbox.confirm({
	                        message: "Acción válida sólo para usuarios registrados",
	                        buttons: {
	                            confirm: {
	                                label: 'Ingresar',
	                                className: 'btn btn-primary active'
	                          ***REMOVED***
	                            cancel: {
	                                label: 'Cancelar',
	                                className: 'objHidden'
	                        ***REMOVED***
	                      ***REMOVED***
	                        callback: function (result) {
	                            if (result == true) {
                                    document.location.href = "#s5";
	                                setTimeout(function () {
	                                    $('#txtEmailLog').focus();
	                              ***REMOVED*** 10);
	                        ***REMOVED***
	                            
	                    ***REMOVED***
	                ***REMOVED***);
	            ***REMOVED***
	    ***REMOVED***
     ***REMOVED***


         function GetComentarios(id) {
             if ($("#content-2").length > 0) {
                 $("#content-2").remove();
         ***REMOVED***
             var url = '/api/Participacion/GetComentarios';
             var param = "IdProyecto=" + id;
             Services.projectsList(url + "?" + param)
                 .done(function (result) {
                     var items_result = result.itemcomentario;
                     if ($("#content-2").length <= 0) {
                         d3.select("#divComentarios")
                             .append("div")
                             .attr("id", "content-2")
                             .attr("class", "content mCustomScrollbar")
                             .attr("data-mcs-theme", "minimal")
                 ***REMOVED***

                     var cont_resp = 0;

                     if (items_result.length > 0) {
                         var id_padre = 0;
                         var id_preg = 0;


                         for (var i = 0; i < items_result.length; i++) {

                             id_padre = items_result[i].ComentarioRelacionado;
                             if ($("#content-2").length > 0) {

                                 var d = new Date(items_result[i].fechaCreacion);
                                 var fecha_aux = pad(d.getDate(), 2) + "/" + pad(parseInt((d.getMonth()) + 1), 2) + "/" + d.getFullYear();
                                 var nombre = "";
                                 if (items_result[i].Anonimo == false) {
                                     nombre = items_result[i].nom_usuario.toString();
                             ***REMOVED***
                                 else {
                                     nombre = " Anónimo";
                             ***REMOVED***
                                 var textocomentario = "";
                                 if (items_result[i].ComentarioOriginal) {
                                     textocomentario = items_result[i].ComentarioOriginal.toString();
                             ***REMOVED***
                                 if (id_padre == null) {
                                     cont_resp = cont_resp + 1;
                                     var div_commenta = d3.select("#content-2")
                                     var div_comment = div_commenta.append("div")
                                         .attr("class", "Comment")
                                     var dividcomm = "divPadre" + items_result[i].IdComentario;
                                     var div_coment = div_comment.append("div")
                                         .attr("class", "User_comment")
                                     var usr_pic = div_coment.append("div")
                                         .attr("class", "Pic_user")
                                         .append("img")
                                         .attr("src", "/content/img/User_profile.jpg")
                                     var usr_poster = div_coment.append("div")
                                         .attr("class", "Post_user")
                                     var usr_name = usr_poster.append("div")
                                         .attr("class", "Post_name")
                                         .append("text").text(" " + nombre + ": ")
                                     var usr_txt = usr_poster.append("div")
                                         .attr("class", "Post_txt")
                                         .append("text").text(" " + textocomentario)
                                     var usr_date = usr_poster.append("div")
                                         .attr("class", "Post_date")
                                         .append("text").text("Fecha de Publicación: " + fecha_aux)
                                     var divhijo = div_comment.append("div")
                                         .attr("id", dividcomm)
                             ***REMOVED***
                                 else {
                                     var dividcomm = "#divPadre" + id_padre;
                                     var div_res = d3.select(dividcomm)
                                     var div_gov = div_res.append("div")
                                         .attr("class", "Gov_comment")
                                     var usr_pic = div_gov.append("div")
                                         .attr("class", "Pic_user")
                                         .append("img")
                                         .attr("src", "/content/img/PCM_profile.jpg")
                                     var usr_poster = div_gov.append("div")
                                         .attr("class", "Post_user")
                                     var usr_txt = usr_poster.append("div")
                                         .attr("class", "Post_txt")
                                         .append("text").text(" " + textocomentario)
                                     var usr_date = usr_poster.append("div")
                                         .attr("class", "Post_date")
                                         .append("text").text("Fecha de Publicación: " + fecha_aux)
                             ***REMOVED***


                         ***REMOVED***

                     ***REMOVED***
                 ***REMOVED***
                     $("#txtNumComentarios").text(" " + cont_resp + "  ");

             ***REMOVED***);

     ***REMOVED***






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


         function getAnnio() {
             // alert(projectPerfil[0].id_project);
             var params_usu = { "idproyecto" : projectPerfil[0].id_project***REMOVED***;
             $.ajax({
                 type: 'GET',
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 url: '/api/serviciosContratistas/GetAnniosContratosByProyecto',
                 cache: false,
                 data: params_usu,
                 success: function (data) {
                     deshabilita(true);
                     var items_result = data.Detalles;
                     var annios = [];
                     var select = "";
                     for (var i = 0; i < items_result.length; i++) {

                         if (!annios.includes(items_result[i].valor.toString())) {
                             annios.push(items_result[i].valor.toString());
                             select = select + '<option value="' + items_result[i].valor.toString() + '">' + items_result[i].valor.toString() + '</option>';
                     ***REMOVED***

                 ***REMOVED***

                     $('#top_contratista_periodos').html(select).fadeIn();
                     if (items_result.length > 0) {

                         $("#top_contratista_periodos").val(items_result[items_result.length - 1].valor.toString());
                         $("#top_contratista_periodos").attr("default", items_result[items_result.length - 1].valor.toString());

                         getContratos($("#top_contratista_periodos option:selected").text(), "", 1, cant_contratos, projectPerfil[0].id_project, "");

                 ***REMOVED*** else {

                         var fila = '<div class="contractBox" >'
                           + '<div class="defaultMessage"><span class="text-bold">No se encuentran resultados con los filtros solicitados</span></div>'
                           + '</div>';

                         $("#srcContratos").html($("#srcContratos").html() + fila);
                 ***REMOVED***

               ***REMOVED***
                 error: function (response) {
                     //alert(response.responseText);
               ***REMOVED***
                 failure: function (response) {
                     //alert(response.responseText);
             ***REMOVED***
         ***REMOVED***);

     ***REMOVED***





         function getContratos(annio, ruc, pagina, registros, idproyecto, nombreContratista) {
             //alert(ruc + '      ' + nombreContratista);
             if (ruc === "") { ruc = null ***REMOVED***
             if (nombreContratista === "") { nombreContratista = null ***REMOVED***
             $("#top_contratista_periodos").attr("cantidadTotal", 0);
             var filtros = {
                 Annio: annio,
                 RUC: ruc,
                 NumeroPagina: pagina,
                 RegistrosPorPagina: registros,
                 IdProyecto: idproyecto,
                 NombreContratista: nombreContratista,
                 COVID19:null

         ***REMOVED***;
             $.ajax({
                 type: 'POST',
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 url: '/api/serviciosContratistas/GetInformacionContratosPorFiltros',
                 cache: false,
                 data: JSON.stringify(filtros),
                 success: function (result) {
                     if (result.status == true) {
                         //alert(result.CantidadTotalRegistros);
                         if (result.CantidadTotalRegistros > 0) {

                             //alert(JSON.stringify(result.listInformacion));
                             var info = result.listInformacion;
                             var proceso = "";
                             var referencia = "";
                             var adjudicacion = "";
                             var invitados = "";
                             var data = "";
                             var fila = "";
                             var inicioLuis = '<div class="contractBox">';
                             var finLuis = '</div>';
                             var inicio = "";
                             var fin = "";
                             $("#srcContratos").html("");
                             for (var i = 0; i < info.length ; i++) {
                                 if (proceso != info[i].CodigoProceso.toString()) {
                                     if (i > 0) //Cambio de proceso
                                     {
                                         //fin = '<div class="row text-center">'
                                         //    + '<div class="col-xs-12 col-md-12"><a href="' + referencia + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                         //    + '</div></div>';
                                         data += inicioLuis + inicio + fila + finLuis + fin + '</div></div>' + finLuis;
                                         fila = "";
                                         inicio = "";
                                         fin = "";
                                 ***REMOVED***
                                     referencia = info[i].DocURL.toString();
                                     adjudicacion = info[i].UrlResumenAdjudicacion;
                                     invitados = info[i].UrlInvitados;
                                     inicio = '<div class="contractNumber"><span class="">Código proceso: </span> <span class="text-bold">' + info[i].CodigoProceso.toString() + '</span></div>'
                                         + ' <div class="wrap-head-process">'
                                         + '     <div class="cotractName">'
                                         + '         <div class="row">'
                                         + '             <div class="col-xs-12 col-md-12">'
                                         + '                 <span class="small">PROCESO</span><div class="clearfix"></div>'
                                         + '                 <span class="h4">' + info[i].DescripcionProceso.toString() + '</span>'
                                         + '             </div>'
                                         + '         </div>'
                                         + '     </div>'
                                         + '     <div class="cotractName">'
                                         + '         <div class="row">'
                                         + '             <div class="col-xs-8 col-md-8">'
                                         + '                 <span class="small"> INSTITUCIÓN</span><div class="clearfix"></div>'
                                         + '                 <span class="h4">' + info[i].UnidadCompra.toString() + '</span>'
                                         + '             </div>'
                                         + '         </div>'
                                         + '     </div>';
                                     
                                         inicio += '<div class="contractData">';
                                         if (info[i].CategoriaContratacion || info[i].MetodoContratacion) {
                                             inicio += ''
                                             + '		<div class="row border-b">'
                                             + '			<div class="col-xs-6 col-md-8">';
                                             if (info[i].CategoriaContratacion) {
                                                 inicio += '	<span class="txt_small">Categoria</span>'
                                                      + '	<span class="amount_adj">' + info[i].CategoriaContratacion.toString() + '</span>';
                                         ***REMOVED***
                                             inicio += '</div>	<div class="col-xs-6 col-md-4">';
                                             if (info[i].MetodoContratacion) {
                                                 clasece = "";
                                                 imgg = "";
                                                 if (info[i].MetodoContratacion.toString() === "Contratación por Excepción") { clasece = "cemark"; imgg = '<img src="/content/img/covid/ic_CEorange.svg"  alt="CAUSAL EXCEPCIÓN">'; ***REMOVED***
                                                 inicio += '				   <span class="txt_small">Tipo de Procedimiento</span>'
                                                 + '				   <span class="amount_adj ' + clasece + '">' + imgg + ' ' + info[i].MetodoContratacion.toString() + ' </span>';
                                         ***REMOVED***
                                             inicio += '</div></div>'
                                             + '';


                                     ***REMOVED***

                                     inicio += ''
                                         + '         <div class="row border-b">'
                                         + '             <div class="col-xs-12 col-md-4"><span class="txt_small">Estado</span><span class="amount_adj">';
                                         if (info[i].EstadoProceso) { inicio += info[i].EstadoProceso.toString(); ***REMOVED***
                                         inicio += '</span></div>'
                                         + '             <div class="col-xs-6 col-md-4"><span class="txt_small"></span><span class="amount_adj"></span></div>' //RD ' + (info[i].MontoEstimadoProceso * 1).formatMoney(2, '.', ',').toString() + '
                                         + '             <div class="col-xs-6 col-md-2"><span class="txt_small"></span><span class="amount_adj"></span></div>' //DOP
                                         + '         </div>';

                                         //if (info[i].COVID19 === 1 || info[i].COVID19 === 2) {
                                         //    inicio += ''
                                         //    + '		<div class="row border-b">'
                                         //    + '			<div class="col-xs-12 col-md-12">'
                                         //    + '				<span class="txt_small">Causal Excepción</span>'
                                         //    + '				<span class="amount_adj">Urgencia Impostergable o Razones Técnicas: </span><span class="amount_text">La Urgencia debe ser cierta, concreta, objetiva e inmediata y esperar el resultado de la licitación podría ocasionar un grave perjuicio a los intereses públicos o Cuando en el mercado existe un solo oferente capaz de satisfacer en forma adecuada las necesidades de la institución convocante. (Inciso g) del Artículo 33 de la Ley N° 2051/03)</span>'
                                         //    + '			    </div>'
                                         //    + '			</div>';
                                         //    + '';
                                         //***REMOVED***


                                        if (adjudicacion && invitados) {
                                            inicio += ''
                                                 + '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-2"><div class="btn btn-outlined"><a href="' + info[i].UrlResumenAdjudicacion.toString() + '" target="_blank"> Ver adjudicación <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><div class="btn btn-outlined"><a href="' + info[i].UrlInvitados.toString() + '" target="_blank"> Ver invitados <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-12 col-md-5"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        if (!adjudicacion && invitados) {
                                            inicio += ''
                                                 + '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-2"><div class="btn btn-outlined"><a href="' + info[i].UrlInvitados.toString() + '" target="_blank"> Ver invitados <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '             <div class="col-xs-12 col-md-5"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        if (adjudicacion && !invitados) {
                                            inicio += ''
                                                 + '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-2"><div class="btn btn-outlined"><a href="' + info[i].UrlResumenAdjudicacion.toString() + '" target="_blank"> Ver adjudicación <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '             <div class="col-xs-12 col-md-5"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        inicio += ''
                                         + '     </div>'
                                         + ' </div>'
                                         + ' <div class="related-contracts">'
                                         + '     <span class="h4">Contratos <span class="frResaltado">firmados</span> asociados a este proceso:</span>'
                                         + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                                     proceso = info[i].CodigoProceso.toString();
                             ***REMOVED***
                                 fila += '<div class="panel panel-default">'
                                     + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                     + '                <h4 class="panel-title">'
                                     + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';
                                     if (info[i].COVID19 === 1 || info[i].COVID19 === 2) { fila += '                        <span class="badge"><img src="../../content/img/covid/ic_mini.png" alt="iconoCOVID"> Covid-19</span>'; ***REMOVED***
                                     fila +='                        Código contrato:  ' + info[i].CodigoContrato.toString() + ''
                                     + '                    </a>'
                                     + '                </h4>'
                                     + '            </div>'
                                     + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                                     + '                <div class="panel-body">'
                                     + '                    <div class="row border-b">'
                                     + '                        <div class="col-xs-12 col-md-12"><span class="small">CONTRATO</span><span class="amount_adj">RD ' + info[i].DescripcionContrato.toString() + ' </span></div>'
                                     + '                    </div>'
                                     + '                    <div class="row border-b">'
                                     + '                        <div class="col-md-6">'
                                     + '                            <span class="small"> RAZON SOCIAL</span>'
                                     + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].numerodocumento.toString() + '"><span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span>' + info[i].Contratista.toString() + '</span></a>'
                                     + '                        </div>'
                                     + '                        <div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipodocumento.toString() + '</span></div>'
                                     + '                        <div class="col-md-3"><span class="small"> Número de documento</span><span class="amount_adj">' + info[i].numerodocumento.toString() + '</span></div>'
                                     + '                    </div>'
                                     + '                    <div class="row border-b">'
                                     + '                        <div class="col-xs-8 col-md-3"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj">' + ((info[i].ValorContrato * 1)/1000000).formatMoney(0, ',', '.').toString() + ' Millones</span></div>' //RD ' + (info[i].MontoContratadoTotalContrato * 1).formatMoney(2, '.', ',').toString() + ' 
                                     + '                        <div class="col-xs-4 col-md-3"><span class="small"> MONEDA</span><span class="amount_adj">L</span></div>' //DOP 
                                     + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                                     if (info[i].FechaInicioContrato) { fila += ' Fecha de INICIO CONTRATO'; ***REMOVED***
                                     fila += '</span><span class="amount_adj">';
                                     if (info[i].FechaInicioContrato) { fila += info[i].FechaInicioContrato.toString().substr(0, 10); ***REMOVED***

                                     fila += ' </span></div>'
                                     + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                                     if (info[i].FechaFinContrato) { fila += 'Fecha de FIN CONTRATO'; ***REMOVED***
                                     fila += '</span><span class="amount_adj"> ';
                                     if (info[i].FechaFinContrato) { fila += info[i].FechaFinContrato.toString().substr(0, 10); ***REMOVED***

                                     fila += ' </span></div>'
                                     + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';
                                     if (info[i].OfertaPeriodoDuracion) { fila += info[i].OfertaPeriodoDuracion.toString(); ***REMOVED***

                                     fila += ' Días</span></div>';

                                 fila += '                        <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                                 if (info[i].FechaPublicacion !== null && info[i].FechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                     fila += info[i].FechaPublicacion.toString().substr(0, 10) + '</span></div>';
                             ***REMOVED***
                                 else {
                                     fila += '&nbsp;</span></div>';
                             ***REMOVED***

                                 fila += '                    </div>'
                                     + '                </div>'
                                     + '               <div class="panel-footer" style="align:center">'
                                     + '                    <div class="btn btn-outlined"><a href="' + info[i].DocURL.toString() + '" target="_blank"> Ver más de este contrato <span class="glyphicon glyphicon-arrow-right"></span></a></div>'
                                     + '                    <a href="../../contratista/contratoprofile/?CodigoContrato=' + info[i].CodigoContrato.toString() + '" class="btn btn-primary btn-primary btn-participe"><span class="glyphicon glyphicon-comment"></span> Hacer comentario al contrato</a>'
                                     + '                 </div>'
                                     + '            </div>'
                                     + '        </div>';
                                 //+ '  </div>';
                         ***REMOVED***
                             data += inicioLuis + inicio + fila +  '</div></div>' + finLuis;

                             //data += '<div class="row text-center">'
                             //        + '<div class="col-xs-12 col-md-12"><a href="' + referencia + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                             //        + '</div></div>' + finLuis;

                             $("#srcContratos").html(data);

                             if (scrol >= 1) {
                                 $('html, body').animate({ scrollTop: $('#srcContratos').offset().top ***REMOVED***, 2000);
                         ***REMOVED*** else { scrol = scrol + 1; ***REMOVED***


                             dibujaPaginacionContrato(pagina, result.CantidadTotalRegistros, Math.ceil(result.CantidadTotalRegistros / registros), registros);
                             configuraEnlaceContratista();
                     ***REMOVED***
                         else {
                             $("#srcContratos").html("");
                             var fila = '<div class="contractBox" >'
                               + '<div class="contractNumber"><span class="text-bold">No se encuentran resultados con los filtros solicitados</span></div>'
                               + '</div>';

                             $("#srcContratos").html(fila);

                     ***REMOVED***

                 ***REMOVED*** else {
                         alert("Message: " + result.message);
                 ***REMOVED***
                     deshabilita(false);
               ***REMOVED***
                 error: function (response) {
                     deshabilita(false);
                     alert("Response: " + response.responseText);
               ***REMOVED***
                 failure: function (response) {
                     deshabilita(false);
                     alert("Response F: " + response.responseText);
             ***REMOVED***
         ***REMOVED***);

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

         $("#btnLimpiar").click(function () {
             if (!disableClick) {
                 $("#top_contratista_periodos").val($("#top_contratista_periodos").attr("default"));
                 deshabilita(true);
                 getContratos($("#top_contratista_periodos option:selected").text(), "", 1, cant_contratos, projectPerfil[0].id_project, "");
         ***REMOVED***
     ***REMOVED***);

         $("#btn-buscar").click(function () {
             if (!disableClick) {
                 deshabilita(true);
                 ///alert($("#top_contratista_periodos option:selected").text())
                 getContratos($("#top_contratista_periodos option:selected").text(), "", 1, cant_contratos, projectPerfil[0].id_project, "");

         ***REMOVED***

     ***REMOVED***);


         function dibujaPaginacionContrato(actual, total, totalPag, cant_por_pag) {
             var pag_actual = parseInt(actual);
             pagina_actual = pag_actual;
             var pagesHTML = '';
             $("#divPagContratos").empty();
             var divPag = d3.select("#divPagContratos")
             if (pag_actual > 1 && total >= cant_por_pag) {
                 var pag_enlace = divPag.append("a")
                 .attr("id", "page_left")
                 .attr("class", "pull-left")
                 .attr("data-page", pag_actual - 1)
                 pag_enlace.append("span")
                 .attr("class", "glyphicon glyphicon-arrow-left")
                 pag_enlace.append("text")
                 .text(" Anterior")
         ***REMOVED***
             divPag.append("span")
             .attr("class", "totalpages")
             .text("Página " + actual + " de " + totalPag)

             if (pag_actual < totalPag) {
                 if ((total - (pag_actual * cant_por_pag)) > 0) {
                     var pag_enlace_der = divPag.append("a")
                     .attr("id", "page_right")
                     .attr("class", "pull-right")
                     .attr("data-page", pag_actual + 1)
                     .text("Próximo ")
                     pag_enlace_der.append("span")
                     .attr("class", "glyphicon glyphicon-arrow-right")
             ***REMOVED***
         ***REMOVED***

             $('#page_right,#page_left').bind('click', function () {
                 d3.select("#divProyectos").empty();
                 pagina_actual = $(this).attr("data-page");
                 getContratos($("#top_contratista_periodos option:selected").text(), $("#top_contratista_ruc").val(), pagina_actual, cant_por_pag, projectPerfil[0].id_project, $("#contratista").val());
         ***REMOVED***);

     ***REMOVED***

         function configuraEnlaceContratista() {
             $(".enlace_contratista").click(function () {
                 var ruc = $(this).attr('data-parameter');
                 var dataValue = $(this).attr('data-parameter'),
                     dataType = $(this).attr('data-type').toLowerCase();
                 document.cookie = "ruc=" + ruc + ";path=/;";
                 var url = "/contratista/contratistaprofile/proyectos/?" + dataType + "=" + dataValue;
                 window.location.href = url;

         ***REMOVED***);

     ***REMOVED***
	***REMOVED***
)

