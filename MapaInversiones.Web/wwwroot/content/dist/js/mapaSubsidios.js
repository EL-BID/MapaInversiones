var map;
var infobox;
var infoboxTemplate;
var datosPolygon = [];
var datosPoint = [];
var subsidios_localizacion;
var subsidios_points;

function loadMapScenario() {
   
   // Microsoft.Maps.Location(-23.058257, -57.672484)
    var map = new Microsoft.Maps.Map(document.getElementById('map-div'), {
        center: new Microsoft.Maps.Location(-24.19262453846349, -58.63972167968749),
        credentials: 'Apwt9Qe5hfw-HjZ-yMqofEVWtwyAdIfAvFg6B-pmoa_7zI08a0EAx5vwjT5miN0M',
        zoom: 7,
        showMapTypeSelector: false,
        showLocateMeButton: false
***REMOVED***);

    infoboxTemplate = '<div class="customInfobox"><div class="title">{title***REMOVED***</div>{description***REMOVED***</div>';

    var center = map.getCenter();
    infobox = new Microsoft.Maps.Infobox(
        center,
        { title: 'Subsidios', description: 'Paraguay', visible: false ***REMOVED***
    );
    infobox.setMap(map);

    var codigo = getParameterByName('subsidio');
    var param = "IdSubsidio=" + codigo;

    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosCifrasCovid/GetSubsidiosByLocalización",
        cache: false,
        data: param,
        success: function (result) {
            if (result.status == true) {
                subsidios_points = result.DetalleSubsidios;
                subsidios_localizacion = result.Detallelocalizacion;
               
                for (var i = 0; i < subsidios_localizacion.length; i++) {
                    datosPolygon.push(subsidios_localizacion[i].Geojson.toString());
            ***REMOVED***

                /*** subsidios_points en este arreglo esta la info de los subsidios de la vista de anyela
                 * para cuando vayas a pintar el popoup  ***/

                console.log(subsidios_points.length);
                for (var i = 0; i < subsidios_points.length; i++) {
                    datosPoint.push({
                        "Latitude": subsidios_points[i].Latitud.toString()
                        ,"Longitude": subsidios_points[i].Longitud.toString()
                        ,"IdDepartamento": subsidios_points[i].IdDepartamento.toString()
                ***REMOVED***);
            ***REMOVED***

                Microsoft.Maps.loadModule('Microsoft.Maps.GeoJson', function () {
                    for (var i = 0; i < datosPolygon.length; i++) {
                        var shape = Microsoft.Maps.GeoJson.read(datosPolygon[i], {
                            polygonOptions: {
                                fillColor: 'rgba(218, 210, 181,1)',
                                strokeColor: 'rgba(166, 151, 124,1)',
                                strokeThickness: 1
                        ***REMOVED***
                            
                    ***REMOVED***);
                        map.entities.push(shape);                    
                ***REMOVED***
            ***REMOVED***);
                for (var i = 0; i < datosPoint.length; i++) {
                    var loc = new Microsoft.Maps.Location(parseFloat(datosPoint[i].Latitude), parseFloat(datosPoint[i].Longitude));
                    var pin = new Microsoft.Maps.Pushpin(loc, {
                       // text: 'H',
                        icon: '/content/img/pin.png',
                        anchor: new Microsoft.Maps.Point(12, 39)
                ***REMOVED***);
                    pin.Metadata = datosPoint[i];
                    map.entities.push(pin);
                    Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);
            ***REMOVED***


                Microsoft.Maps.Events.addHandler(map, 'click', function (e) {
                    hideInfoboxes();
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

   
***REMOVED***

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
***REMOVED***

function pushpinClicked(e) {
    if (e.target.Metadata) {
        var result = $.grep(subsidios_points, function (element, index) {
            return (element.IdDepartamento === e.target.Metadata.IdDepartamento);
    ***REMOVED***);
        if (result.length > 0) {
            var rutaficha = "";
            var valor_subsidio = "L " + numberWithCommas(parseFloat(Math.round(result[0].ValorSubsidio/1000000)).toFixed(0)) + " Millones";
            var cantidad = numberWithCommas(parseFloat(Math.round(result[0].CantidadSubsidio)).toFixed(0));
            var title = '';
            var formato = '';
            var formato = '<div class="bingmap-infobox-info">' +
                '<h3 class="title">' + result[0].NombreDepartamento + '</h3>' +
                '<p class="label">Valor acumulado</p>' +
                '<p style="text-align: left;color: #2f9cc1;">' + valor_subsidio + '</p>' +
                '<p class="label">Cantidad subsidios</p> ' +
                '<p style="text-align: left;color: #2f9cc1;">' + cantidad + '</p>' 
                
                '</div>';


            infobox.setOptions({
                location: e.target.getLocation(),
                htmlContent: infoboxTemplate.replace('{title***REMOVED***', title).replace('{description***REMOVED***', formato),
                visible: true
        ***REMOVED***);
    ***REMOVED***



***REMOVED***
***REMOVED***

function hideInfoboxes() {

    $(".bingmap-infobox-info").css('display', 'none');

***REMOVED***

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3***REMOVED***)+(?!\d))/g, ".");
    return parts.join(".");
***REMOVED***

