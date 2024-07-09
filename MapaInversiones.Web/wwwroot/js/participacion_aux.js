var PerfilUsuario = JSON.parse(document.body.getAttribute('data-profile'));

InicializaDatos();

function InicializaDatos() {
    //usuario en session
    iniUsuarioLog();
    //add funciones login
    $("#txtEmailLog").val("");
    $("#txtClaveLog").val("");
    $("#divCloseSesion").hide();


    $("#btnNuevaCuenta").click(function () {
        $("#divUsuarioLog").slideUp(100, function () {
            $("#divCuentaNueva").slideDown(function () {
                limpiarCamposUsuario("login");
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***);

    $("#btnAddCuentaUsu").click(function () {
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
        if (validaEmail(correo_usu)) {

            var params_usu = { "email": correo_usu ***REMOVED***;
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
        var params_usu = { "email": $("#txtEmailVerifica").val(), "cod_verifica": $("#txtCodigoVerifica").val() ***REMOVED***;
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
                    ***REMOVED***);
                ***REMOVED***);
            ***REMOVED*** else {
                    $("#hdIdUsuario").val("");
                    if (result.message == null || result.message == undefined) {
                        bootbox.alert("Error: " + "Fallo la verificación", function () {

                    ***REMOVED***);
                ***REMOVED*** else {
                        bootbox.alert("Error: " + result.message, function () {

                    ***REMOVED***);
                ***REMOVED***

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
                    bootbox.alert("Formato de clave incorrecto: La clave debe tener al menos 8 carácteres, entre ellos, una letra mayúscula y un número");
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
                            url: "/api/ServiciosParticipacion/updClaveUsuario",
                            cache: false,
                            data: JSON.stringify(params_usu),
                            success: function (result) {
                                if (result.status == true) {
                                    bootbox.alert("Nuevo password almacenado", function () {
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
                        bootbox.alert("Codigo no verificado");
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
                bootbox.alert("Campos requeridos");
        ***REMOVED***
    ***REMOVED*** else {
            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();
            var id_usuario = $("#hdIdUsuario").val();
            var id_departamento = $('#filtro_AreaInfluencia option:selected').attr("id_depa");
            var id_tipo = $("#filtro_TipoCometario option:selected").attr("id_tipo");
            var text_coment = $("#txtcomentario").val();
            var ch_anonimo = $("#anonimo").prop('checked');

            var CodigoContrato = $("#contrato").val();

            if (id_tipo == "" || id_tipo == undefined) {
                formularioOK = false;
                bootbox.alert("Seleccione un tipo de comentario");
        ***REMOVED***
            else if (text_coment == "") {
                formularioOK = false;
                bootbox.alert("Ingresar un comentario");
        ***REMOVED***

            if (formularioOK == true) {
                var params_com = {
                    IdUsuario: id_usuario,
                    id_departamento: id_departamento,
                    id_municipio: null,
                    IdTipoComentario: id_tipo,
                    IdProyecto: null,
                    ComentarioOriginal: text_coment,
                    Anonimo: ch_anonimo,
                    IdEstado: 1,
                    IdTipoRespuesta: 1,
                    ComentarioRelacionado: null,
                    UsuarioComenta: 0,
                    IdAsociacion: 3,
                    CodigoContrato: CodigoContrato
            ***REMOVED***;
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
                                    if ($("#contrato").val() != undefined) {
                                        GetComentarios($("#contrato").val());
                                ***REMOVED***
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
        ***REMOVED***
    ***REMOVED***
        $("#btnGuardarComent").show();

***REMOVED***);
    $(".btnMegusta").click(function () {
        var tipoFoto = ($(this).attr('tipofoto'));
        var idFoto = ($(this).attr('idfoto'));
        guardarMeGusta('M', tipoFoto, idFoto);
***REMOVED***);

    $(".btnNoMegusta").click(function () {
        var tipoFoto = ($(this).attr('tipofoto'));
        var idFoto = ($(this).attr('idfoto'));
        guardarMeGusta('N', tipoFoto, idFoto);
***REMOVED***);

    $("#enlace_cierre").click(function () {
        cerrarSesionUsu();
***REMOVED***);

    if ($("#contrato").val() != undefined) {
        GetComentarios($("#contrato").val());
***REMOVED***

***REMOVED***

function iniUsuarioLog() {
    $("#hdIdUsuario").val(PerfilUsuario[0].idUsuParticipa);
    $("#hdNomUsuario").val(PerfilUsuario[0].nomUsuParticipa);
    if ($("#hdIdUsuario").val() != "") {

        $("#divUsuarioLog").slideUp(100, function () {
            $("#divNomUsuarioLog").text("Hi, " + $("#hdNomUsuario").val());
            $("#divCloseSesion").show();
            $("#divPregParticipacion").css("visibility", "visible");
            $("#divPregParticipacion").attr("class", "objVisible");
    ***REMOVED***);

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
        ***REMOVED*** else {
                $("#error_" + id_txt).hide();
        ***REMOVED***
    ***REMOVED*** else {
            if ($('#' + id_txt + ' li.selected').attr('id') == "0") {
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
                bootbox.alert("Formato de clave incorrecto: La clave debe tener al menos 8 carácteres, entre ellos, una letra mayúscula y un número");
        ***REMOVED*** else {
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
                            CodigoContrato: $("#contrato").val()
                    ***REMOVED***;
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

function validaClaveUsu(cadena) {
    //que tenga mayusculas, numeros,de 8 digitos al menos
    var clave = new RegExp(/^(?=(?:.*\d){1***REMOVED***)(?=(?:.*[A-Z]){1***REMOVED***)\S{8,***REMOVED***$/);
    valida = clave.test(cadena);
    return valida;
***REMOVED***

//Comunes

//validación de correo electrónico
function validaEmail(cadena) {
    if (cadena.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3***REMOVED***)$/)) {
        return true;
***REMOVED*** else {
        return false;
***REMOVED***
***REMOVED***
function validaEnteroMayorCero(cadena) {
    if (cadena.match(/^[1-9]+[0-9]*$/)) {
        return true;
***REMOVED*** else {
        return false;
***REMOVED***
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
        if (validaEmail($('#txtEmailLog').val())) {
            var params_usu = {
                email: $("#txtEmailLog").val(),
                hash_clave: $("#txtClaveLog").val(),
                valida_rol: 'n'
        ***REMOVED***;
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
    ***REMOVED*** else {
            $("#error_" + id_txt).hide();
    ***REMOVED***
***REMOVED***);
    return formularioOK;
***REMOVED***


function GetComentarios(id) {
    if ($("#content-2").length > 0) {
        $("#content-2").remove();
***REMOVED***
    var param = "CodigoContrato=" + id;
    $.ajax({
        url: "/api/ServiciosParticipacion/GetComentarios",
        type: "GET",
        data: param,

***REMOVED***).done(function (result) {
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

                id_padre = items_result[i].comentarioRelacionado;
                if ($("#content-2").length > 0) {

                    var d = new Date(items_result[i].fechaCreacion);
                    var fecha_aux = pad(d.getDate(), 2) + "/" + pad(parseInt((d.getMonth()) + 1), 2) + "/" + d.getFullYear();
                    var nombre = "";
                    if (items_result[i].anonimo == false) {
                        nombre = items_result[i].nom_usuario.toString();
                ***REMOVED***
                    else {
                        nombre = " Anónimo";
                ***REMOVED***
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
                            .append("text").text(" " + items_result[i].comentarioOriginal.toString())
                        var usr_date = usr_poster.append("div")
                            .attr("class", "Post_date")
                            .append("text").text("Fecha de Publicación: " + fecha_aux)
                ***REMOVED***


            ***REMOVED***

        ***REMOVED***
    ***REMOVED***
        $("#txtNumComentarios").text("(" + cont_resp + ") ");

***REMOVED***);

***REMOVED***
