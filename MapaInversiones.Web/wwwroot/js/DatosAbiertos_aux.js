var datoscontrato = JSON.parse($("#boxcontrato").attr('data-contratos'));
var datospresupuesto = JSON.parse($("#boxpresupuesto").attr('data-presupuesto'));

inicializaDatos();

function inicializaDatos() {
    var datos = $("#datoscontratos option:selected").val()
    cargaannos(datoscontrato, datos, 'annocontratos', 'idDicContratos', 'idUltimaActContratos', 'FuenteContratos');
    var datos2 = $("#datospresupuesto option:selected").val()
    cargaannos(datospresupuesto, datos2, 'annopresupuesto', 'idDicPresupuesto', 'idUltimaActPresupuesto', 'FuentePresupuesto');
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
        //bootbox.alert({
        //    message: 'No existe set de datos en el formato seleccionado',
        //    buttons: {
        //        ok: {
        //            label: 'Aceptar'
        //    ***REMOVED***
        //***REMOVED***
        //***REMOVED***);
***REMOVED***
    else {
        window.location.href = url;
***REMOVED***
***REMOVED***

$("#datoscontratos").on("change", function () {
    var datos = $("#datoscontratos option:selected").val()
    cargaannos(datoscontrato, datos, 'annocontratos', 'idDicContratos', 'idUltimaActContratos', 'FuenteContratos');
***REMOVED***);
