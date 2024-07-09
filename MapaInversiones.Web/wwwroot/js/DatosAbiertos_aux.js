inicializaDatos();

function inicializaDatos() {

    cargarfuentesdatos();
***REMOVED***

function cargarfuentesdatos() {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosDatosAbiertos/ObtenerFuentesDatos",
        cache: false,
        data: false,
        success: function (result) {
            if (result.status == true) {
                var info = result.fuentesRecursos;
                var numproyectos = 0;
                var aportado = 0;
                var htmldivfuente = '';
                var numeroorganismosmostrar = 3;
                if (info != null) {
                    for (var i = 0; i < info.length; i++) {
                        var classdivfuente = "fuente" + info[i].idFuente;
                        numproyectos += info[i].numeroProyectos;
                        aportado += info[i].valorVigente;
                        var htmldivfuente = '';
                            htmldivfuente += '<div class="fuentes-data">';
                            htmldivfuente += '<div class="source-fuente" ><span class="">Fuente de datos:</span><span class="text-bold">' + info[i].nombreFuente + '</span></div>';
                        htmldivfuente += '<div class="source-fuente"><span class="">Última actualización:</span><span class="text-bold">' + info[i].fechaActualizacionFuente.toString().substr(0, 10) + '</span></div>';
                        htmldivfuente += '</div>';

                        $("." + classdivfuente).html(htmldivfuente);


                ***REMOVED***
                    
            ***REMOVED***

        ***REMOVED*** else {
                bootbox.alert("Error: " + result.Message, function () {

            ***REMOVED***);
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

function cargaannos(setdatos,datos,elemsel,elemdic,elemultimaact,elemfuente) {
    var results = [];
    var searchField = "DisplayText";
    var searchVal = datos;
    var selectannos = "";
    for (var i = 0; i < setdatos.ContentItems.length; i++) {
        if (setdatos.ContentItems[i][searchField] == searchVal) {
            var datosannos = setdatos.ContentItems[i]["BagPart"];
            for (var j = 0; j < datosannos.ContentItems.length; j++) {
                var anno = datosannos.ContentItems[j].LinkDatosAbiertos.Anno.Text;
                var urlcvs = datosannos.ContentItems[j].LinkDatosAbiertos.EnlaceCVS.Url;
                var urlxls = datosannos.ContentItems[j].LinkDatosAbiertos.EnlaceXLS.Url;
                if (j == 0) {
                    selectannos += '<option selected value="' + anno + '" urlcvs="' + urlcvs + '" urlxls="' + urlxls + '" >' + anno + '</option>';
            ***REMOVED*** else {
                    selectannos += '<option value="' + anno + '" urlcvs="' + urlcvs + '" urlxls="' + urlxls + '" >' + anno + '</option>';
            ***REMOVED***
                $("#" + elemsel).html(selectannos);
        ***REMOVED***
            document.getElementById(elemdic).href = setdatos.ContentItems[i].DescargaDatosAbiertos.UrlBotonDiccionario.Url;
            $("#" + elemultimaact).text(setdatos.ContentItems[i].DescargaDatosAbiertos.Ultimaactualizacion.Text);
            $("#" + elemfuente).text(setdatos.ContentItems[i].DescargaDatosAbiertos.Fuente.Text);
            
    ***REMOVED***
***REMOVED***
***REMOVED***

function descargar(sel, rad) {
    var valrad = $('input[name="' + rad + '"]:checked').val();
    var url = "";
    if (valrad == 'CVS') {
        url = $("#" + sel + " option:selected").attr("urlcvs");
***REMOVED*** else if (valrad == 'XLS') {
        url = $("#" + sel + " option:selected").attr("urlxls");
***REMOVED***
    if ((url == undefined) || (url == "") || (url == null) || (url == "null")) {
        alert('No existe set de datos en el formato seleccionado');

***REMOVED***
    else {
        window.location.href = url;
***REMOVED***
***REMOVED***

$("#datoscontratos").on("change", function () {
    var datos = $("#datoscontratos option:selected").val()
    cargaannos(datoscontrato, datos, 'annocontratos', 'idDicContratos', 'idUltimaActContratos', 'FuenteContratos');
***REMOVED***);
