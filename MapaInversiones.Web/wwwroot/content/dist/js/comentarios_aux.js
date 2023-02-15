/// <reference path="app/network/urlsMap.js" />
var projectPerfil = JSON.parse(document.body.getAttribute('data-profile'));
var anyo_actual = (new Date).getFullYear();
var logoresponde = "";
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";


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

        function maskPosition(element, noLoader) {
            var maskElem = $('<div class="mask"><div class="bg"></div>' +
                (!noLoader ? '<div class="icon"></div>' : '<div class="icon"></div>') + '<div>'),
                position = element.offset(),
                Wmask = element[0].offsetWidth,
                Hmask = element[0].offsetHeight;

            maskElem.appendTo(document.body)
            maskElem.css({ 'width': Wmask, 'height': Hmask, 'left': position.left, 'top': position.top ***REMOVED***)
            element.data('mask', maskElem)
    ***REMOVED***

        function InicializaDatos() {
            $("#divDetComent").attr("estado", "");
            $("#divDetComent").attr("asoc", "");
            $("#divDetComent").attr("tcoment", "");
            inicializaFiltrosComent();
            configuraFiltros();
            var estado = $("#filterbyEstado").find(".btn-select-input").attr("value");
            var asociacion = $("#filterbyAsoc").find(".btn-select-input").attr("value");
            var tipocomentario = $("#filterbyTipo").find(".btn-select-input").attr("value");
            $("#divDetComent").html("");
            $("#divDetComent").html(loader_proy);
            ObtenerComentarios(estado, asociacion, tipocomentario, 1);
	***REMOVED***


        function inicializaFiltrosComent() {
            var obj_estado = $("#filtro_estados li:eq(0)");
            var obj_estado_valor = obj_estado.attr("value");
            var obj_estado_texto = obj_estado.text();
            $("#filterbyEstado").find(".btn-select-input").val(obj_estado_valor);
            $("#filterbyEstado").find(".btn-select-value").html(obj_estado_texto);
            var obj_asoc = $("#filtro_asociacion li:eq(0)");
            var obj_asoc_valor = obj_asoc.attr("value");
            var obj_asoc_texto = obj_asoc.text();
            $("#filterbyAsoc").find(".btn-select-input").val(obj_asoc_valor);
            $("#filterbyAsoc").find(".btn-select-value").html(obj_asoc_texto);
            var obj_tcoment = $("#filtro_tcomentario li:eq(0)");
            var obj_tcoment_valor = obj_tcoment.attr("value");
            var obj_tcoment_texto = obj_tcoment.text();
            $("#filterbyTipo").find(".btn-select-input").val(obj_tcoment_valor);
            $("#filterbyTipo").find(".btn-select-value").html(obj_tcoment_texto);
    ***REMOVED***

        function configuraFiltros() {
            $('#filtro_estados li').bind('click onclick', function () {
                var val_Sel = $(this).attr("value");
                var opc_asoc = $("#divDetComent").attr("asoc");
                var opc_tcoment = $("#divDetComent").attr("tcoment");
                if (val_Sel+"" != "") {
                    $("#divDetComent").html("");
                    $("#divDetComent").html(loader_proy);
                    ObtenerComentarios(val_Sel, opc_asoc,opc_tcoment, 1);
            ***REMOVED*** else {
                    $("#divDetComent").attr("estado", "");
            ***REMOVED***

        ***REMOVED***);

            $('#filtro_asociacion li').bind('click onclick', function () {
                var val_sel = $(this).attr("value");
                var opc_estado = $("#divDetComent").attr("estado");
                var opc_tcoment = $("#divDetComent").attr("tcoment");

                if (val_sel + "" != "") {
                    $("#divDetComent").html("");
                    $("#divDetComent").html(loader_proy);
                    ObtenerComentarios(opc_estado, val_sel, opc_tcoment, 1);
            ***REMOVED*** else {
                    $("#divdetcoment").attr("asoc", "");
            ***REMOVED***

        ***REMOVED***);
            $('#filtro_tcomentario li').bind('click onclick', function () {
                var val_Sel = $(this).attr("value");
                var opc_estado = $("#divDetComent").attr("estado");
                var opc_asoc = $("#divDetComent").attr("asoc");
                if (val_Sel + "" != "") {
                    $("#divDetComent").html("");
                    $("#divDetComent").html(loader_proy);
                    ObtenerComentarios(opc_estado, opc_asoc, val_Sel, 1);
            ***REMOVED*** else {
                    $("#divDetComent").attr("val_Sel", "");
            ***REMOVED***

        ***REMOVED***);


            $('#Nofilter').bind('click onclick', function () {
                inicializaFiltrosComent();
                var estado = $("#filterbyEstado").find(".btn-select-input").attr("value");
                var asociacion = $("#filterbyAsoc").find(".btn-select-input").attr("value");
                var tipocomentario = $("#filterbyTipo").find(".btn-select-input").attr("value");
                $("#divDetComent").html("");
                $("#divDetComent").html(loader_proy);
                ObtenerComentarios(estado, asociacion, tipocomentario, 1);

        ***REMOVED***);

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
	                        $("#divCloseSesion").hide();
	                        $("#divFotos").hide();
                            $("#divComentarios").hide();
                            $("#secEncabezado").hide();
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


	    function validaSesionUsu() {
	        var params_usu = {
	            IdUsuario: $("#hdIdUsuario").val(),
	            valida_rol: 'S'
	    ***REMOVED***;
	        //add nuevo registro
	        $.ajax({
	            type: 'POST',
	            contentType: "application/json; charset=utf-8",
	            dataType: "json",
	            url: "/api/Participacion/ValidaSessionUsu",
	            cache: false,
	            data: JSON.stringify(params_usu),
	            success: function (result) {
	                if (result.status == true) {
	                    //USUARIO CON CREDENCIALES VALIDAS DE ADMON LOGUEADO
	                    $("#divNomUsuarioLog").text("Hola " + result.usuarios.Nombre);
                        $("#hdNomUsuario").val(result.usuarios.Nombre);

                        /*------------------------*/
                           inicializaFiltrosFotos();
                           var estado = $("#filterbyFoto").find(".btn-select-input").attr("value");
                           ObtenerImgAprobar(estado, 1);
                        /*------------------------*/

                        ObtenerComentariosCant();
                        ObtenerImgAprobCant();

	                    $("#s0").hide();
	                    $("#divCloseSesion").show();
	                    $("#divFotos").show();
	                    $("#divComentarios").hide();
                        $("#secEncabezado").show();


	            ***REMOVED*** else {
	                    bootbox.alert("@Error: " + result.message, function () {
	                        cerrarSesionUsu();
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
	            if (comunes.validaEmail($('#txtEmailLog').val().toLowerCase())) {
	                    var params_usu = {
	                        email: $("#txtEmailLog").val(),
	                        hash_clave: $("#txtClaveLog").val(),
                            valida_rol: 'S'
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
	                                $("#divNomUsuarioLog").text("Hola " + result.usuarios.Nombre);
	                                $("#hdNomUsuario").val(result.usuarios.Nombre);
	                                $("#hdIdUsuario").val(result.usuarios.IdUsuario);

                                    /*------------------------*/
                                        inicializaFiltrosFotos();
                                        var estado = $("#filterbyFoto").find(".btn-select-input").attr("value");
                                        ObtenerImgAprobar(estado, 1);
                                    /*------------------------*/
                                        ObtenerImgAprobCant();
                                        ObtenerComentariosCant();
                                    
                                    $("#s0").slideUp(100, function () {
                                        $("#secEncabezado").show();
	                                    $("#divCloseSesion").show();
	                                    $("#divFotos").show();
	                                    //$("#divComentarios").show();
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
	                    bootbox.alert("Email inválido");
	            ***REMOVED***
	    ***REMOVED***
	***REMOVED***


        function dibujarPagNumeradasComent(actual, total, totalPag) {
            
            var pag_actual = parseInt(actual);
            var pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 6;
            var cant_por_linea = 10;
            $("#divPaginacionComent").html("");
            $("#divPaginacionComent").show();
            var divPag = d3.select("#divPaginacionComent")

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


            if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
                var pag_enlace = divPag.append("a")
                    .attr("id", "page_left")
                    .attr("class", "pull-left")
                    .attr("data-page", inicio - cant_por_linea)
                pag_enlace.append("span")
                    .attr("class", "glyphicon glyphicon-arrow-left")
                pag_enlace.append("text")
                    .text(" Anterior")
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
                if ((totalPag - pag_actual) > cant_por_linea) {
                    var pag_enlace_der = divPag.append("a")
                        .attr("id", "page_right")
                        .attr("class", "")
                        .attr("data-page", fin + 1)
                        .text("Próximo ")
                    pag_enlace_der.append("span")
                        .attr("class", "glyphicon glyphicon-arrow-right")

            ***REMOVED***
        ***REMOVED***

            $('#page_right,#page_left,.page_left').bind('click', function () {
                pagina_actual = $(this).attr("data-page");
                var estado = $("#divDetComent").attr("estado");
                var asociacion = $("#divDetComent").attr("asoc");
                $("#divDetComent").html("");
                $("#divDetComent").html(loader_proy);
                var tipocomentario = $("#divDetComent").attr("tcoment");
                ObtenerComentarios(estado, asociacion, tipocomentario, pagina_actual);
        ***REMOVED***);

    ***REMOVED***


	    function pad(n, length) {
	        var n = n.toString();
	        while (n.length < length)
	            n = "0" + n;
	        return n;
	***REMOVED***

        function ObtenerComentariosCant() {
            var url = "/api/Participacion/GetCometAprobarCant";
            Services.projectsList(url)
                .done(function (data) {
                    var totalComentAprob = data.totalNumber;
                    $("#lblCantComentarios").text("(" + totalComentAprob + ")");
            ***REMOVED***);

    ***REMOVED***
        
        function ObtenerTipologiasComentario(idcomentario) {
            if ($("#tipologia_old_" + idcomentario).length > 0) {
                $("#tipologia_old_" + idcomentario).val("");
                $("#tipologia_old_" + idcomentario).remove();
        ***REMOVED***
            
            var param = "idcomentario=" + idcomentario;
            var url = "/api/Participacion/GetTipologiaComentario";
            Services.projectsList(url + "?" + param)
                .done(function (data) {
                    $("#divTipologiaComentario").show(); 
                    //---------------------------------------------
                    var div_com = d3.select("#divTipologiaComentario")
                    $("#divTipologiaComentario").html("");
                    if (data.itemcomentario.length > 0) {
                        $("#divMensaje2").hide();
                        
                        var div_content = div_com.append("div")
                        div_content.attr("class", "borderbox-Coments")
                        div_content.attr("id", "divPost_" + idcomentario)
                        let tipologia_old = [];
                        for (var cont = 0; cont < data.itemcomentario.length; cont++) {
                            var IdTipologia = data.itemcomentario[cont].IdTipologia;
                            var Tipologia = data.itemcomentario[cont].Tipologia;
                            var Relacion = data.itemcomentario[cont].Relacion;
                            
                                var div_fila = div_content.append("div")
                                    .attr("class", "row")
                                var div_col = div_fila.append("div")
                                    .attr("class", "col-md-12")
                                var div_info = div_col.append("div")
                                    .attr("class", "Post_txt")

                                var check_tipo=div_info.append("input")
                                check_tipo.attr("type", "checkbox")
                                check_tipo.attr("class", "form-check-input")
                                check_tipo.attr("name", "chk_topolog_" + idcomentario)
                                check_tipo.attr("value", IdTipologia)
                                if (Relacion == 1) {
                                    //div_info.append("span").attr("class", "text-bold").text("SI-")
                                    check_tipo.attr("checked", "true");
                                    tipologia_old.push(IdTipologia);
                            ***REMOVED*** 

                                div_info.append("span").attr("class", "text-bold").text(Tipologia)

                               
                    ***REMOVED***

                        
                        var jsonObj = tipologia_old.join(',');
                          var tipo_input=div_content.append("input")
                            tipo_input.attr("type", "hidden")
                            tipo_input.attr("id", "tipologia_old_" + idcomentario)
                            tipo_input.attr("value", jsonObj)

                       
                ***REMOVED***
                    else 
                    {
                        $("#divTipologiaComentario").html("No hay tipos de comentario asociados en la base de datos");
                ***REMOVED***          

            ***REMOVED***);
        ***REMOVED***



        function ObtenerComentarios(estado, asociacion, tipocomentario, pagina) {
            var param = "page=" + pagina + "&estado=" + estado + "&asociacion=" + asociacion + "&tipocomentario=" + tipocomentario;
            var url = "/api/Participacion/GetCometPublicar";
	        Services.projectsList(url + "?" + param)
                .done(function (data) {
                    $("#divDetComent").attr("estado", estado);
                    $("#divDetComent").attr("asoc", asociacion);
                    $("#divDetComent").attr("tcoment", tipocomentario);
                    var totalComentpublicar = data.totalNumber;
                    if (totalComentpublicar == 1) { $("#lblCantComentarios").text("" + totalComentpublicar + " COMENTARIO"); ***REMOVED*** else { $("#lblCantComentarios").text("" + totalComentpublicar + " COMENTARIOS"); ***REMOVED***
                    var totalPag = data.totalPages;
                    $("#divComentarios").show(); 
                //---------------------------------------------
                var div_com = d3.select("#divDetComent")
                $("#divDetComent").show();
                $("#divDetComent").html("");
                if (data.itemcomentario.length > 0) {
                    $("#divMensaje2").hide();

                    for (var cont = 0; cont < data.itemcomentario.length; cont++) {
                        var id_comentario = data.itemcomentario[cont].IdComentario;
                        var id_padre = data.itemcomentario[cont].ComentarioRelacionado;
                        var d = new Date(data.itemcomentario[cont].fechaCreacion);
                        var fecha_actual = new Date();
                        var fecha_aux = pad(d.getDate(), 2) + "/" + pad(parseInt((d.getMonth()) + 1), 2) + "/" + d.getFullYear();
                        var difM = fecha_actual - d; // diferencia en milisegundos
                        var dif_dias = Math.trunc((difM / (1000 * 60 * 60 * 24))); // diferencia en dias
                        var idtextarea = "txtModera" + data.itemcomentario[cont].IdComentario;
                        var idtextareaR = "txtRespuesta" + data.itemcomentario[cont].IdComentario;
                        var encabezado = "";
                        var encabezado_aux = "";
                        var entidad_aux = "";
                        var entidad = "";
                        var municipio = "-";
                        if (data.itemcomentario[cont].nom_municipio != null) {
                            municipio = data.itemcomentario[cont].nom_municipio + " - " + data.itemcomentario[cont].nom_departamento;
                    ***REMOVED***
                        var respuesta_aux = "Respuesta:";
                        if (data.itemcomentario[cont].nom_municipio != null) {
                            encabezado = data.itemcomentario[cont].nom_municipio + " - ";
                    ***REMOVED***
                        
                        if (data.itemcomentario[cont].IdAsociacion == 3) {
                            entidad_aux = "CONTRATO";
                            encabezado_aux = "Contrato";
                            encabezado = data.itemcomentario[cont].CodigoContrato;
                            logoresponde = "/content/img/PCM_Haciendapy.jpg";


                    ***REMOVED*** else if (data.itemcomentario[cont].IdAsociacion == 2) {
                            entidad_aux = "PROGRAMA";
                            encabezado_aux = "Programa";
                            encabezado = data.itemcomentario[cont].NombrePrograma;
                            logoresponde = "/content/img/PCM_Haciendapy.jpg";


                    ***REMOVED*** else {
                            var nombreproy = data.itemcomentario[cont].NombreProyecto;
                            if (nombreproy != null) {
                                entidad_aux = "PROYECTO";
                                encabezado_aux = "Proyecto";
                                encabezado = nombreproy.toString();
                                logoresponde = "/content/img/PCM_profile.jpg";

                        ***REMOVED***
                    ***REMOVED***
                        var textocomentario = "";
                        if (data.itemcomentario[cont].ComentarioOriginal) {
                            textocomentario = data.itemcomentario[cont].ComentarioOriginal.toString();
                    ***REMOVED***
                        if (id_padre == null) {
                            var div_content = div_com.append("div")
                                .attr("class", "borderbox-Coments")
                            var div_fila = div_content.append("div")
                                .attr("class", "row")
                            var div_col = div_fila.append("div")
                                .attr("class", "col-md-12")
                            var div_info = div_col.append("div")
                                .attr("class", "Post_txt")

                            if (entidad_aux.toUpperCase() == "PROYECTO") {
                                div_info.append("a")
                                    .attr("href", "../../projectprofile/" + data.itemcomentario[cont].IdProyecto)
                                    .attr("target", "_blank")
                                    .append("span")
                                    .attr("class", "text-bold")
                                    .text(encabezado_aux)
                                
                                .append("p")
                                    .text(encabezado)
                        ***REMOVED***
                            
                            if (entidad_aux.toUpperCase() == "PROGRAMA") {
                                div_info.append("a")
                                .attr("href", "../../covid/PerfilPrograma/?programa_id=" + data.itemcomentario[cont].IdPrograma)
                                .attr("target", "_blank")
                                .append("span").attr("class", "text-bold").text(encabezado_aux)

                                .append("p").text(encabezado)
                        ***REMOVED***

                            if (entidad_aux.toUpperCase() == "CONTRATO") {
                                div_info.append("a")
                                .attr("href", "../../contratista/contratoprofile/?CodigoContrato=" + data.itemcomentario[cont].CodigoContrato)
                                .attr("target", "_blank")
                                .append("span").attr("class", "text-bold").text(encabezado_aux)

                                .append("p").text(encabezado)
                        ***REMOVED***

                            var nombremostrar = data.itemcomentario[cont].nom_usuario.toString();
                            var emailmostrar = data.itemcomentario[cont].email_usuario.toString();
                            if (data.itemcomentario[cont].Anonimo) {
                                nombremostrar = "Anónimo"
                                emailmostrar = "Anónimo"
                        ***REMOVED***
                            var div_fila_aux = div_info.append("div")
                                .attr("class", "row")
                            var div_col1 = div_fila_aux.append("div")
                                .attr("class", "col-xs-4 col-md-4")
                            div_col1.append("span").attr("class", "text-bold").text("Fecha de Comentario:")
                            div_col1.append("p").text(fecha_aux + " ")
                                .append("span").attr("class", "badge").text("Hace " + dif_dias.toString() + " días")
                            var div_col2 = div_fila_aux.append("div")
                                .attr("class", "col-xs-4 col-md-4")
                            div_col2.append("span").attr("class", "text-bold").text("Desde donde escribe:")
                            div_col2.append("p").text(municipio)
                            var div_col3 = div_fila_aux.append("div")
                                .attr("class", "col-xs-4 col-md-4")
                            div_col3.append("span").attr("class", "text-bold").text("Estado:")
                            div_col3.append("p").text(data.itemcomentario[cont].NombreEstado.toString())
                            //var div_fila_aux3 = div_info.append("div")
                            //    .attr("class", "row")
                            //var div_col31 = div_fila_aux3.append("div")
                            //    .attr("class", "col-xs-6 col-md-4")
                            //div_col31.append("span").attr("class", "text-bold").text("Nombre del Usuario:")
                            //div_col31.append("p").text(nombremostrar)
                            //var div_col32 = div_fila_aux3.append("div")
                            //    .attr("class", "col-xs-6 col-md-4")
                            //div_col32.append("span").attr("class", "text-bold").text("Correo electrónico:")
                            //div_col32.append("p").text(emailmostrar)
                            //var div_col33 = div_fila_aux3.append("div")
                            //    .attr("class", "col-xs-6 col-md-4")
                            //div_col33.append("span").attr("class", "text-bold").text("Género del Usuario:")
                            //div_col33.append("p").text(data.itemcomentario[cont].genero_usuario)

                            var div_fila_aux2 = div_info.append("div")
                                .attr("class", "row")
                            var div_col23 = div_fila_aux2.append("div")
                                .attr("class", "col-xs-6 col-md-4")
                            div_col23.append("span").attr("class", "text-bold").text("Rol del Usuario:")
                            div_col23.append("p").text(data.itemcomentario[cont].rol_usuario)

                            var div_col21 = div_fila_aux2.append("div")
                                .attr("class", "col-xs-6 col-md-4")
                            div_col21.append("span").attr("class", "text-bold").text("Tipo de Comentario:")
                            div_col21.append("p").text(data.itemcomentario[cont].NombreTipoComentario)
                               
                            


                            var div_fila2 = div_content.append("div")
                                .attr("class", "row")
                            
                            var div_col4 = div_fila2.append("div")
                                .attr("class", "col-md-12")
                            .append("span")
                                .attr("class", "text-bold")
                                .text("Comentario")
                            var div_coment = div_col4.append("div")
                                .attr("class", "User_comment")
                            var usr_poster = div_coment.append("div")
                                .attr("class", "Post_user")
                            var usr_txt = usr_poster.append("div")
                                .attr("class", "Post_txt")
                                .append("p").text(" " + textocomentario)
                            var div_resp_ant=div_coment.append("div")
                                .attr("class", "respuestas_ant")
                                .attr("id", "divPadre_" + id_comentario)

                    ***REMOVED***
                        else {
                           
                            var dividcomm = "#divPadre_" + id_padre;
                            var div_res = d3.select(dividcomm)
                            div_res.append("span")
                                .attr("class", "text-bold")
                                .text("Respuestas")
                                var div_gov = div_res.append("div")
                                    .attr("class", "Gov_comment")
                                var usr_pic = div_gov.append("div")
                                    .attr("class", "Pic_user")
                                    .append("img")
                                    .attr("src", logoresponde)
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
                    
                    dibujarPagNumeradasComent(pagina, totalComentpublicar, totalPag);

            ***REMOVED*** else {
                    $("#divPaginacionComent").html("");
                    $("#divPaginacionComent").hide();
                    $("#divMensaje2").show();
                    $("#divDetComent").show();

            ***REMOVED***

        ***REMOVED***);
	***REMOVED***



	***REMOVED***
)



