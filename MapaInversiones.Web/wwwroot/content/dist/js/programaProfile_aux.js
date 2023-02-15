var proyectos_ini = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));
var programa_data = JSON.parse(document.body.getAttribute('data-programa'));
var PerfilUsuario = JSON.parse(document.body.getAttribute('data-profile'));

var anyo = (new Date).getFullYear() - 1;
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
var total_number = 0;
var total_pages = 0;
var lbl_filtros = ["Sector", "Monto", "Fecha"];
var cant_contratos = 5;

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

        var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
        var proyectos_eje = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));
        var locationData = JSON.parse(document.body.getAttribute('data-location'));

        inicializaDatos();

        AgregarFiltros();
        comunes.load_filtro_orden("divFiltrosFichaOrdena", "filterByEjecucion", true);

        /////---listado proyectos ejecucion
        loadProyectosEjecucion(proyectos_eje);
        configuraFiltrosEje();

        function inicializaDatos() {
            $("#divNoExistenEjec").hide();
            //imagen background
            var imageURL = locationData[0].imageXL;
            //imageURL = "../../content/img/location/prueba_location_4.jpg";
            if (imageURL != "") {
                $(".s0-section").css("background", "url('" + imageURL + "') no-repeat top left");
                $(".s0-section").css("color", "#FFF");
        ***REMOVED*** else {
                $(".s0-section").css("background", "url('" + "../../content/img/location/location-image.jpg" + "') no-repeat top left");
                $(".s0-section").css("color", "#FFF");

        ***REMOVED***
            getAnnio();

            //Participacion ciudadana
            iniUsuarioLog();
            //add funciones login
            $("#txtEmailLog").val("");
            $("#txtClaveLog").val("");
            $("#divCloseSesion").hide();

            if (programa_data[0].programa_id != undefined) {
                GetComentarios(programa_data[0].programa_id);
        ***REMOVED***

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
                var params_usu = { "email": $("#txtEmailVerifica").val(), "cod_verifica": $("#txtCodigoVerifica").val() ***REMOVED***;
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
                    var id_programa = programa_data[0].programa_id;

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
                            IdProyecto: null,
                            ComentarioOriginal: text_coment,
                            Anonimo: ch_anonimo,
                            IdEstado: 1,
                            IdTipoRespuesta: 1,
                            ComentarioRelacionado: null,
                            UsuarioComenta: 0,
                            IdAsociacion: 2,
                            IdPrograma: id_programa
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
                                            if (programa_data[0].programa_id != undefined) {
                                                GetComentarios(programa_data[0].programa_id);

                                        ***REMOVED***
                                    ***REMOVED***);
                                ***REMOVED***);

                            ***REMOVED*** else {
                                    bootbox.alert("@Error: " + result.message);
                                    $("#divPregParticipacion").slideUp(100, function () {
                                        $("#divCloseSesion").show();
                                        //var nom_usu = $("#hdNomUsuario").val();
                                        //$("#txtMsgConfirmaEnvio").text("Algo salió mal...");
                                        //$("#divConfirmaEnvio").slideDown(function () {
                                        //    if (programa_data[0].programa_id != undefined) {
                                        //        GetComentarios(programa_data[0].programa_id);

                                        //***REMOVED***
                                        //***REMOVED***);
                                ***REMOVED***);
                            ***REMOVED***

                          ***REMOVED***
                            error: function (response) {
                                bootbox.alert(response.responseText);
                                if (programa_data[0].programa_id != undefined) {
                                    GetComentarios(programa_data[0].programa_id);
                            ***REMOVED***
                          ***REMOVED***
                            failure: function (response) {
                                bootbox.alert(response.responseText);
                                if (programa_data[0].programa_id != undefined) {
                                    GetComentarios(programa_data[0].programa_id);

                            ***REMOVED***
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
            //debugger;
            var params_usu = { "idprograma": programa_data[0].programa_id ***REMOVED***;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/serviciosContratistas/GetAnniosContratosByPrograma",
                cache: false,
                data: params_usu,
                success: function (data) {
                    $(".link_external.ce").show();
                    deshabilita(true);
                    //alert(JSON.stringify(data));

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
                        getContratos($("#top_contratista_periodos option:selected").text(), 1, cant_contratos,  programa_data[0].programa_id);
   
                ***REMOVED*** else {
                        $(".link_external.ce").hide();
                        $("#srcContratos").html("");
                        var fila = '<div class="contractBox" >'
                          + '<div class="contractNumber"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                          + '</div>';

                        $("#srcContratos").html(fila);
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







        function getContratos(annio, pagina, registros,  idprograma) {
            //alert(ruc + '      ' + nombreContratista);
         
            $("#top_contratista_periodos").attr("cantidadTotal", 0);
            var filtros = {
                Annio: annio,
                RUC: null,
                NumeroPagina: pagina,
                RegistrosPorPagina: registros,
                IdProyecto: null,
                NombreContratista: null,
                IdPrograma: idprograma,
                COVID19: 1

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
                            $(".link_external.ce").show();
                            //alert(JSON.stringify(result.listInformacion));
                            var info = result.listInformacion;
                            var proceso = "";
                            var referencia = "";
                            var data = "";
                            var fila = "";
                            var adjudicacion = "";
                            var invitados = "";
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
                                        + '         </div>'

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
                                            
                                            inicio += '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-3"><div class="btn btn-outlined"><a href="' + info[i].UrlResumenAdjudicacion.toString() + '" target="_blank"> Ver adjudicación <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><div class="btn btn-outlined"><a href="' + info[i].UrlInvitados.toString() + '" target="_blank"> Ver invitados <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        if (!adjudicacion && invitados) {
                                            
                                            inicio += '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-3"><div class="btn btn-outlined"><a href="' + info[i].UrlInvitados.toString() + '" target="_blank"> Ver invitados <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        if (adjudicacion && !invitados) {
                                           
                                            inicio += '         <div class="row border-b">'
                                                 + '             <div class="col-xs-6 col-md-3"><div class="btn btn-outlined"><a href="' + info[i].UrlResumenAdjudicacion.toString() + '" target="_blank"> Ver adjudicación <span class="glyphicon glyphicon-arrow-right"></span></a></div></div>'
                                                 + '             <div class="col-xs-6 col-md-3"><span class="txt_small"></span><span class="amount_adj"></span></div>'
                                                 + '         </div>';
                                    ***REMOVED***
                                        inicio += '     </div>'
                                        + ' </div>'
                                        + ' <div class="related-contracts">'
                                        + '     <span class="h4">Contratos asociados a este proceso:</span>'
                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                                    proceso = info[i].CodigoProceso.toString();
                            ***REMOVED***

                                fila += '<div class="panel panel-default">'
                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                    + '                <h4 class="panel-title">'
                                    + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';
                                    if (info[i].COVID19 === 1 || info[i].COVID19 === 2) { fila += '                        <span class="badge"><img src="../../content/img/covid/ic_mini.png" alt="iconoCOVID"> Covid-19</span>'; ***REMOVED***
                                    if (info[i].CodigoContrato) { fila += '                        Código de contratación:  ' + info[i].CodigoContrato.toString() + ''; ***REMOVED*** else { fila += '                      Pendiente emisión código contratación  ' ***REMOVED***
                                    fila += '                    </a>'
                                    + '                </h4>'
                                    + '            </div>'
                                    + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                                    + '                <div class="panel-body">'
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
                                    + '                    </div>';


                                    if (info[i].OfertaPeriodoDuracion || info[i].FechaPublicacion) {
                                        fila += '                    <div class="row border-b">'
                                        + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                                        if (info[i].OfertaPeriodoDuracion) { fila += info[i].OfertaPeriodoDuracion.toString(); ***REMOVED***

                                        fila += '                   Días</span></div>';

                                        fila += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                                        if (info[i].FechaPublicacion !== null && info[i].FechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                            fila += info[i].FechaPublicacion.toString().substr(0, 10) + '</span></div>';
                                    ***REMOVED***
                                        else {
                                            fila += '</span></div>';
                                    ***REMOVED***

                                        fila += '                    </div>';

                                ***REMOVED***

                                    fila += '                   '
                                    + '                </div>'
                                    + '               <div class="panel-footer" style="align:center">';
                                    if (info[i].DocURL) {
                                        fila += '                    <div class="btn btn-outlined"><a href="' + info[i].DocURL.toString() + '" target="_blank"> Ver más de este contrato <span class="glyphicon glyphicon-arrow-right"></span></a></div>';
                                ***REMOVED***
                                    if (info[i].CodigoContrato) {
                                        fila += '                    <a href="../../contratista/contratoprofile/?CodigoContrato=' + info[i].CodigoContrato.toString() + '" class="btn btn-primary btn-primary btn-participe"><span class="glyphicon glyphicon-comment"></span> Hacer comentario al contrato</a>';
                                ***REMOVED***
                                    fila += '       </div>'
                                    + '            </div>'
                                    + '        </div>';
                                //+ '  </div>';
                        ***REMOVED***
                            data += inicioLuis + inicio + fila + '</div></div>' + finLuis;

                            //data += '<div class="row text-center">'
                            //        + '<div class="col-xs-12 col-md-12"><a href="' + referencia + '" target="_blank" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                            //        + '</div></div>' + finLuis;

                            $("#srcContratos").html(data);
                            dibujaPaginacionContrato(pagina, result.CantidadTotalRegistros, Math.ceil(result.CantidadTotalRegistros / registros), registros);
                            configuraEnlaceContratista();
                    ***REMOVED***
                        else {
                            $(".link_external.ce").hide();
                            $("#srcContratos").html("");
                            var fila = '<div class="contractBox" >'
                              + '<div class="contractNumber"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
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
                getContratos($("#top_contratista_periodos option:selected").text(), 1, cant_contratos, programa_data[0].programa_id);
               
        ***REMOVED***
    ***REMOVED***);

        $("#btn-buscar").click(function () {
            if (!disableClick) {
                deshabilita(true);
                ///alert($("#top_contratista_periodos option:selected").text())
                getContratos($("#top_contratista_periodos option:selected").text(), 1, cant_contratos, programa_data[0].programa_id);
               
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
                getContratos($("#top_contratista_periodos option:selected").text(), pagina_actual, cant_por_pag, programa_data[0].programa_id);
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

        function loadProyectosEjecucion(resultados) {
            $("#divNoEncontradoEjec").hide();
            $("#divNoExistenEjec").hide();
            if (resultados.length > 0) {
                var div_proy = d3.select("#divContenedorFichas")
                div_proy.append("div")
                    .attr("class", "row")
                    .append("div")
                    .attr("class", "col-md-12")
                    .append("div")
                    .attr("id", "Carousel")
                    .attr("class", "carousel slide")
                    .append("div")
                    .attr("id", "divContenidoFichas")
                    .attr("class", "carousel-inner")

                if ($("#divContenedorFichas").length > 0) {
                    var cont_aux = 0;
                    var nom_fila = "divFilaProy_" + cont_aux.toString()
                    var clase_active = "item";
                    for (var i = 0; i < resultados.length; i++) {
                        if (i == 0) {
                            clase_active = "item active";
                    ***REMOVED*** else {
                            clase_active = "item";
                    ***REMOVED***
                        var modulo = (i % 4);
                        if (modulo == 0) {
                            nom_fila = "divFilaProy_" + cont_aux.toString()
                            var nom_col = "ficha_" + i.toString();
                            var div_proy_item = d3.select("#divContenidoFichas")
                                .append("div")
                                .attr("class", clase_active)
                            var div_fila = div_proy_item.append("div")
                                .attr("id", nom_fila)
                                .attr("class", "row-fluid")
                            div_fila.append("div")
                                .attr("id", nom_col)
                                .attr("class", "col-md-3")
                            comunes.load_ficha_unica(resultados[i], nom_col, nom_fila);
                            cont_aux += 1;
                    ***REMOVED*** else {
                            var nom_col = "ficha_" + i.toString();
                            if ($("#" + nom_fila).length > 0) {
                                d3.select("#" + nom_fila)
                                    .append("div")
                                    .attr("class", "col-md-3")
                                    .attr("id", nom_col)
                                comunes.load_ficha_unica(resultados[i], nom_col, nom_fila);
                        ***REMOVED***
                    ***REMOVED***

                ***REMOVED***
            ***REMOVED***

                //add data-slide
                var divSlide = d3.select("#Carousel")
                divSlide.append("a")
                    .attr("data-slide", "prev")
                    .attr("href", "#Carousel")
                    .attr("class", "left carousel-control")
                    .append("span")
                    .attr("class", "glyphicon glyphicon-chevron-left")
                divSlide.append("a")
                    .attr("data-slide", "next")
                    .attr("href", "#Carousel")
                    .attr("class", "right carousel-control")
                    .append("span")
                    .attr("class", "glyphicon glyphicon-chevron-right")
        ***REMOVED*** else {
                //no existen proyectos en ejecucion
                $("#divNoExistenEjec").show();
        ***REMOVED***
    ***REMOVED***



       


        function configuraFiltrosEje() {
            if ($("#filterByEjecucion").length > 0) {
                $('#filterByEjecucion li').bind('click onclick', function () {
                    var objJson = proyectos_eje;
                    var sorted = objJson;
                    var val_Sel = $(this).text().toUpperCase();
                    var opc_sector = $("#filterEjecSector").find("li.selected").attr("id");
                    var objFiltered = objJson;

                    if (opc_sector > 0) {
                        objFiltered = $.grep(objJson, function (h) {
                            return h.IdSector == opc_sector
                    ***REMOVED***);
                ***REMOVED***


                    if (val_Sel != "") {
                        if (val_Sel == "MONTO") {
                            sorted = $(objFiltered).sort(ordenaMontoDesc);
                            var div_proyectos = d3.select("#divContenidoFichas");
                            div_proyectos.html("");
                            loadProyectosEjecucion(sorted);
                    ***REMOVED***
                        else if (val_Sel == "PROGRESO") {
                            sorted = $(objFiltered).sort(ordenaProgresoDesc);
                            var div_proyectos = d3.select("#divContenidoFichas");
                            div_proyectos.html("");
                            loadProyectosEjecucion(sorted);

                    ***REMOVED*** else {
                            //fecha
                            sorted = $(objFiltered).sort(ordenaFechaIniDesc);
                            var div_proyectos = d3.select("#divContenidoFichas");
                            div_proyectos.html("");
                            loadProyectosEjecucion(sorted);
                    ***REMOVED***

                ***REMOVED*** else {
                        //opcion vacia
                        loadProyectosEjecucion(sorted);
                ***REMOVED***

            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***

   
        
        function AgregarFiltros() {
            var filters = Services.filters.forProjects().done(function (result) {
                var items_result = result.filters;

                for (var i = 0; i < items_result.length; i++) {
                    if (items_result[i].parameter == "estado") {
                        for (var j = 0; j < items_result[i].items.length; j++) {
                            addFiltro("filters_groups_etapa", "filterByEtapa", items_result[i].items[j].name, items_result[i].items[j].value);
                    ***REMOVED***
                ***REMOVED***
                    else if (items_result[i].parameter == "sector") {
                        for (var j = 0; j < items_result[i].items.length; j++) {
                            addFiltro("filters_groups_sector", "filterBySector", items_result[i].items[j].name, items_result[i].items[j].value);
                            addFiltro("divFiltrosFichaSector", "filterEjecSector", items_result[i].items[j].name, items_result[i].items[j].value);
                    ***REMOVED***
                ***REMOVED***
                    else if (items_result[i].parameter == "departamento") {
                        for (var j = 0; j < items_result[i].items.length; j++) {
                            addFiltro("filters_groups_departamento", "filterByDepartamento", items_result[i].items[j].name, items_result[i].items[j].value);
                            addFiltro("divFiltrosFichaDepartamento", "filterEjecDepartamento", items_result[i].items[j].name, items_result[i].items[j].value);
                            addFiltro("divFiltrosFichaDepartamentoSector", "filterEjecDepartamentoSector", items_result[i].items[j].name, items_result[i].items[j].value);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
                $('#filterByEtapa li,#filterBySector li,#filterByDepartamento li').bind('click onclick', function (e) {
                    var val_Sel = $(this).attr("id");
                    if (val_Sel != "" && val_Sel != "0") {
                        var target = $(e.target);
                        target.addClass("selected").siblings().removeClass("selected");
                ***REMOVED***
            ***REMOVED***);

                $('#filterEjecSector li').bind('click onclick', function () {
                    $("#divNoEncontradoEjec").hide();
                    var val_Sel = $(this).attr("id");
                    var objFiltered = [];
                    if (val_Sel != "") {
                        var objJson = proyectos_eje;
                        var opc_filtro = $("#filterByEjecucion").find("li.selected").text().trim().toUpperCase();
                        if (val_Sel > 0) {
                            objFiltered = $.grep(objJson, function (h) {
                                return h.IdSector == val_Sel
                        ***REMOVED***);

                    ***REMOVED*** else {
                            objFiltered = objJson;
                    ***REMOVED***

                        var div_proyectos = d3.select("#divContenidoFichas");
                        div_proyectos.html("");
                        if (objFiltered.length > 0) {
                            if (opc_filtro != "") {
                                switch (opc_filtro) {
                                    case "MONTO":
                                        sorted = $(objFiltered).sort(ordenaMontoDesc);
                                        break;
                                    case "PROGRESO":
                                        sorted = $(objFiltered).sort(ordenaProgresoDesc);
                                        break;
                                    default:
                                        sorted = $(objFiltered).sort(ordenaFechaIniDesc);

                            ***REMOVED***
                                loadProyectosEjecucion(sorted);
                        ***REMOVED*** else {
                                loadProyectosEjecucion(objFiltered);
                        ***REMOVED***

                    ***REMOVED***
                        else {
                            $("#divNoEncontradoEjec").show();
                    ***REMOVED***

                ***REMOVED***
            ***REMOVED***);

                $('#filterEjecDepartamento li').bind('click onclick', function () {
                    $("#divNoEncontradoEjec").hide();
                    var val_Sel = $(this).attr("id");
                    if (val_Sel != "") {
                        var objJson = proyectos_eje;
                        var objFiltered = $.grep(objJson, function (h) {
                            return h.IdDepartamento == val_Sel
                    ***REMOVED***);
                        var div_proyectos = d3.select("#divContenidoFichas");
                        div_proyectos.html("");
                        if (objFiltered.length > 0) {
                            loadProyectosEjecucion(objFiltered);
                    ***REMOVED***
                        else {

                            $("#divNoEncontradoEjec").show();
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
                $('#filterEjecDepartamentoSector li').bind('click onclick', function () {
                    $("#divNoEncontradoEjec").hide();
                    var val_Sel = $(this).attr("id");
                    if (val_Sel != "") {
                        var objJson = proyectos_eje;
                        var objFiltered = $.grep(objJson, function (h) {
                            return h.IdDepartamento == val_Sel
                    ***REMOVED***);
                        var div_proyectos = d3.select("#divContenidoFichas");
                        div_proyectos.html("");
                        if (objFiltered.length > 0) {
                            loadProyectosEjecucionSectores(objFiltered);
                    ***REMOVED***
                        else {

                            $("#divNoEncontradoEjec").show();
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);

        ***REMOVED***);

    ***REMOVED***





        function addFiltro(obj_div, obj_etiqueta, opc, valor) {
            if ($("#" + obj_etiqueta).length == 0) {

                if (obj_etiqueta == "filterByEtapa") {
                    var div_col = d3.select("#" + obj_div)
                    div_col.append("label")
                        .text("Etapa")
                    var afilter = div_col.append("a")
                        .attr("class", "btn btn-select btn-select-light mivCustom")
                    afilter.append("input")
                        .attr("type", "hidden")
                        .attr("class", "btn-select-input")
                    afilter.append("span")
                        .attr("class", "btn-select-value")
                        .text("Todas")
                    afilter.append("span")
                        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
                    var ul_select = afilter.append("ul")
                        .attr("id", obj_etiqueta)
                    ul_select.append("li").text(opc)
                        .attr("id", valor)

            ***REMOVED*** else if (obj_etiqueta == "filterBySector") {
                    var div_col = d3.select("#" + obj_div)
                    div_col.append("label")
                        .text("Sector")
                    var afilter = div_col.append("a")
                        .attr("class", "btn btn-select btn-select-light mivCustom")
                    afilter.append("input")
                        .attr("type", "hidden")
                        .attr("class", "btn-select-input")
                    afilter.append("span")
                        .attr("class", "btn-select-value")
                        .text("Todos")
                    afilter.append("span")
                        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
                    var ul_select = afilter.append("ul")
                        .attr("id", obj_etiqueta)
                    ul_select.append("li").text(opc)
                        .attr("id", valor)
            ***REMOVED*** else if (obj_etiqueta == "filterByDepartamento") {
                    var div_col = d3.select("#" + obj_div)
                    div_col.append("label")
                        .text("Departamento")
                    var afilter = div_col.append("a")
                        .attr("class", "btn btn-select btn-select-light mivCustom")
                    afilter.append("input")
                        .attr("type", "hidden")
                        .attr("class", "btn-select-input")
                    afilter.append("span")
                        .attr("class", "btn-select-value")
                        .text("Todos")
                    afilter.append("span")
                        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
                    var ul_select = afilter.append("ul")
                        .attr("id", obj_etiqueta)
                    ul_select.append("li").text(opc)
                        .attr("id", valor)
            ***REMOVED*** else if (obj_etiqueta == "filterEjecSector") {

                    var div_col = d3.select("#" + obj_div)
                    div_col.append("label")
                        .text("Sector")
                    var afilter = div_col.append("a")
                        .attr("class", "btn btn-select btn-select-light mivCustom")
                    afilter.append("input")
                        .attr("type", "hidden")
                        .attr("class", "btn-select-input")
                        .attr("id", "enlace_filtro_sector")
                    afilter.append("span")
                        .attr("class", "btn-select-value")
                        .text("Todos")
                    afilter.append("span")
                        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")

                    var ul_select = afilter.append("ul")
                        .attr("id", obj_etiqueta)
                    ul_select.append("li").text("Todos")
                        .attr("id", "0")
                    ul_select.append("li").text(opc)
                        .attr("id", valor)

            ***REMOVED*** else if (obj_etiqueta == "filterEjecDepartamento") {
                    var div_col = d3.select("#" + obj_div)
                    div_col.append("label")
                        .text("Departamento")
                    var afilter = div_col.append("a")
                        .attr("class", "btn btn-select btn-select-light mivCustom")
                    afilter.append("input")
                        .attr("type", "hidden")
                        .attr("class", "btn-select-input")
                    afilter.append("span")
                        .attr("class", "btn-select-value")
                        .text("Todos")
                    afilter.append("span")
                        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
                    var ul_select = afilter.append("ul")
                        .attr("id", obj_etiqueta)
                    ul_select.append("li").text(opc)
                        .attr("id", valor)
            ***REMOVED***
        ***REMOVED*** else {
                var ul_select = d3.select("#" + obj_etiqueta)
                ul_select.append("li").text(opc)
                    .attr("id", valor)
        ***REMOVED***

    ***REMOVED***


        function dibujaPaginacion(actual, total, totalPag) {
            var pag_actual = parseInt(actual);
            pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 5;
            $("#divPaginacion").html("");
            var divPag = d3.select("#divPaginacion")
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
                //$("#divListadoProyectos").html("");
                d3.select("#divListadoProyectos").selectAll("a").remove()
                pagina_actual = $(this).attr("data-page");
                cargarProyectos(pagina_actual);
        ***REMOVED***);


    ***REMOVED***

        function dibujarFichasProyecto() {
            comunes.loadFicha(projects, "proyContenedor", "divFiltrosFichaOrdena")
    ***REMOVED***


        jQuery.fn.sort = function () {
            return this.pushStack([].sort.apply(this, arguments), []);
    ***REMOVED***;

        function ordenaMonto(a, b) {
            if (parseFloat(a.approvedTotalMoney) == parseFloat(b.approvedTotalMoney)) {
                return 0;
        ***REMOVED***
            return parseFloat(a.approvedTotalMoney) > parseFloat(b.approvedTotalMoney) ? 1 : -1;
    ***REMOVED***
        function ordenaMontoDesc(a, b) {
            return ordenaMonto(a, b) * -1;
    ***REMOVED***;

        function ordenaProgreso(a, b) {
            if (parseFloat(a.porcentajeGastado) == parseFloat(b.porcentajeGastado)) {
                return 0;
        ***REMOVED***
            return parseFloat(a.porcentajeGastado) > parseFloat(b.porcentajeGastado) ? 1 : -1;
    ***REMOVED***

        function ordenaProgresoDesc(a, b) {
            return ordenaProgreso(a, b) * -1;

    ***REMOVED***;

        function ordenaFechaIni(a, b) {
            return a.FechaInicioProyecto > b.FechaInicioProyecto ? 1 : -1;
    ***REMOVED***

        function ordenaFechaIniDesc(a, b) {
            return ordenaFechaIni(a, b) * -1;
    ***REMOVED***

        //para aplicar binding agregar function location(){***REMOVED*** al inicio
        //ko.applyBindings(new location(), $('#projects-list-view')[0]);

        return {
            //load_filtro_sector: AgregarFiltros

    ***REMOVED***;
       

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


        function iniUsuarioLog() {
            $("#hdIdUsuario").val(PerfilUsuario[0].idUsuParticipa);
            $("#hdNomUsuario").val(PerfilUsuario[0].nomUsuParticipa);
            if ($("#hdIdUsuario").val() != "") {
                //habilita funcion subir fotos
                //$("#divFotoUsuario").css("visibility","visible");
                $("#divUsuarioLog").slideUp(100, function () {
                    $("#divNomUsuarioLog").text("Hola, " + $("#hdNomUsuario").val());
                    $("#divCloseSesion").show();
                    $("#divPregParticipacion").css("visibility", "visible");
                    $("#divPregParticipacion").attr("class", "objVisible");
            ***REMOVED***);

        ***REMOVED*** else {
                //$("#divFotoUsuario").css("visibility", "collapse");
        ***REMOVED***
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
                                    IdProgRel: programa_data[0].programa_id
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
                        data: JSON.stringify(params_usu),
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

        function GetComentarios(id) {
            if ($("#content-2").length > 0) {
                $("#content-2").remove();
        ***REMOVED***
            var url = '/api/Participacion/GetComentariosPrograma';
            var param = "IdPrograma=" + id;
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
                                        .attr("src", "/img/User_profile.jpg")
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
                                        .attr("src", "/content/img/PCM_Haciendapy.jpg")
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

        function pad(n, length) {
            var n = n.toString();
            while (n.length < length)
                n = "0" + n;
            return n;
    ***REMOVED***

***REMOVED***

)