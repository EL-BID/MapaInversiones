require([
    'comunes',
    'app/network/Services',
    'app/network/urlsMap'
],
    function (
        comunes,
        Services,
        urlsMap
    ) {

        var subsidioData = JSON.parse(document.body.getAttribute('data-subsidio'));
        var idsubsidio = null;

        if (subsidioData != null && subsidioData != undefined && subsidioData.length > 0) {
            idsubsidio = subsidioData[0].IdSubsidio;
    ***REMOVED***

        inicializaDatos();
        var data = [
            { "labelGroup": "ASUNCION", "label": "ASUNCION", "value": 15 ***REMOVED***,
            { "labelGroup": "CONCEPCION", "label": "CONCEPCION", "value": 10 ***REMOVED***,
            { "labelGroup": "SAN PEDRO", "label": "SAN PEDRO", "value": 5 ***REMOVED***,
        ];
        

        function inicializaDatos() {
            $("#divTextoNoEncontrado").hide();
            GetSubsidiosPerDpto();

    ***REMOVED***

        function customFormat(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3***REMOVED***)+(?!\d))/g, ".");
            return parts.join(".");
    ***REMOVED***

        function loadGraphSubsidiosPerDpto(div_contenedor, data_contenido, titulo, etiqueta) {
            if (data_contenido != undefined && data_contenido != null) {
                for (var i = 0; i < data_contenido.length; i++) {
                    data_contenido[i].value = parseFloat(data_contenido[i].value);
                    data_contenido[i].rawValue = parseFloat(data_contenido[i].rawValue);
            ***REMOVED***
                var visualization = d3plus.viz()
                    .container("#" + div_contenedor)
                    .data(data_contenido)
                    .type("bar")
                    .id("label")
                    .legend(false)
                    .tooltip({ "value": true ***REMOVED***)
                    .order({
                        "value": "rawValue",
                        "sort": "asc"
                ***REMOVED***)
                    .format({
                        "text": function (text, params) {
                            if (text == "value") {
                                return "Valor total millones L";
                        ***REMOVED*** else if (text == "labelGroup") {
                                return "Departamento";
                        ***REMOVED***
                            else if (text == "label") {
                                return "Departamento";
                        ***REMOVED***
                            else if (text == "share") {
                                return "Participación";
                        ***REMOVED***
                            else if (text == "including") {
                                return "Incluye";
                        ***REMOVED***
                            else {
                                return d3plus.string.title(text, params);
                        ***REMOVED***
                    ***REMOVED***
                        ,"number": function (number, params) {
                            var formatted = d3plus.number.format(number, params);
                            if (params.key === "rawValue") {
                                return "L " + numberWithCommas(parseFloat(Math.round(number / 1000000)).toFixed(0)) + " M";
                        ***REMOVED***
                            else if (params.key === "rawValue" || params.key === "value") {
                                return numberWithCommas(parseFloat(Math.round(number / 1000000)).toFixed(0));
                        ***REMOVED***
                            else if (params.key === "share") {
                                return d3.round(number, 2) + " %";
                        ***REMOVED***
                            else {
                                return formatted;
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***)
                    .background("rgba(255, 255, 255, 0)")
                    .text({ "value": "label" ***REMOVED***)
                    //.height({ "small": 170, "value": 180 ***REMOVED***)
                    .axes({
                        "background": { "color": "rgba(255,255,255,0)", "ticks": true, "stroke": { "width": 0, "color": "#fff" ***REMOVED*** ***REMOVED***,
                        "font": { "family": "inherit" ***REMOVED***,
                        "label": false
                ***REMOVED***)
                    .x(
                        {
                            "stacked": true,
                            "value": "value",
                            "axis": { "padding": "10px", "color": "#000000", "border-color": "#000000" ***REMOVED***,
                            "lines": { "color": "#000000" ***REMOVED***,
                            "padding": 0.1,
                            "grid": false,
                            "label": {
                                "value": etiqueta,
                                "padding": 10,
                                "font": { "family": "inherit", "weight": "bold", "size": 14 ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***)
                    .y(
                        {
                            "scale": "discrete",
                            "value": "label",
                            "ticks": { "color": "rgba(255,255,255,0)", "labels": false ***REMOVED***,
                            "lines": false,
                            "axis": { "padding": "10px", "color": "#000000", "label": false ***REMOVED***,
                            "grid": false,
                            "label": {
                                "value": false,
                                "padding": 5,
                                "font": { "family": "inherit", "size": 14, "color": "rgba(255,255,255,0)" ***REMOVED***
                        ***REMOVED***
                ***REMOVED***)
                    .color("labelGroup")
                    .color({
                        "scale": ["#fc8464", "#1cc4ac", "#75f0c4", "#8c8c8c", "#e8eae9", "#18c3c4", "#2d6494", "#fcd4a4", "#33455d", "#1c94bc", "#8c95a0", "#747c8c", "#4c7ca4", "#63d1d4", "#fc947c", "#e2cec8", "#c3dadb", "#ade8e5", "#61788b"],
                        //, "#75f0c4", "#8c8c8c", "#e8eae9", "#18c3c4", "#2d6494", "#fcd4a4", "#33455d", "#1c94bc", "#8c95a0", "#747c8c", "#4c7ca4", "#63d1d4", "#fc947c", "#e2cec8", "#c3dadb", "#ade8e5", "#61788b"
                ***REMOVED***)
                    //.time("year")
                    .draw()
        ***REMOVED***
    ***REMOVED***

        function loadGraphSubsidiosPerFaseDpto(div_contenedor, data_contenido, titulo, etiqueta) {
            if (data_contenido != undefined && data_contenido != null) {
                for (var i = 0; i < data_contenido.length; i++) {
                    data_contenido[i].value = parseFloat(data_contenido[i].value);
                    data_contenido[i].rawValue = parseFloat(data_contenido[i].rawValue);
            ***REMOVED***
                var visualization = d3plus.viz()
                    .container("#" + div_contenedor)
                    .data(data_contenido)
                    .type("bar")
                    .id("label")
                    .x({ "stacked": false, "value": "labelGroup" ***REMOVED***)
                    .y("rawValue")
                    .format({
                        "text": function (text, params) {
                            if (text == "value" || text == "rawValue") {
                                return etiqueta; // "Número de beneficiarios";
                        ***REMOVED***
                            else if (text == "labelGroup") {
                                return ""; //return "Departamento";
                        ***REMOVED***
                            else if (text == "label") {
                                return "";//return "Departamento";
                        ***REMOVED***
                            else {
                                return d3plus.string.title(text, params);
                        ***REMOVED***
                    ***REMOVED***
                        , "number": function (number, params) {
                            var formatted = d3plus.number.format(number, params);
                            //if (params.key === "rawValue") {
                            //    return "L " + numberWithCommas(parseFloat(Math.round(number / 1000000)).toFixed(0)) + " M";
                            //***REMOVED***
                            //else if (params.key === "rawValue" || params.key === "value") {
                            //    return numberWithCommas(parseFloat(Math.round(number / 1000000)).toFixed(0));
                            //***REMOVED***
                            //else if (params.key === "share") {
                            //    return d3.round(number, 2) + " %";
                            //***REMOVED***
                            //else {
                            //    return formatted;
                            //***REMOVED***
                            return formatted;
                    ***REMOVED***
                ***REMOVED***
                )
                   .legend({ "value": true ***REMOVED***)
                    .title(
                        {
                            "value": titulo,
                            "padding": 10,
                            "font": { "size": 20 ***REMOVED***
                    ***REMOVED***
                ).color("label")
                    .draw();
                //moveLegend(etiqueta, div_contenedor );
        ***REMOVED***
    ***REMOVED***

        function moveLegend(etiqueta,container) {
            var l = d3.select("#key"),
                c = d3.select("#container");

            // wait for the legend and container to appear
            // if not wait 200 milliseconds and try again
            if (!l.size() || !c.size()) {
                setTimeout(moveLegend, 200);
        ***REMOVED*** else {
                // both now exist
                // move legend to top
                l.transition()
                    .attr("transform", "translate(0,0)");
                
                // move chart down height of legen
                var lh = l.node().getBBox().height;
                //c.attr("transform", "translate(0," + lh + ")");
                c.attr("transform", "translate(" + lh+ "," + lh + ")");
        ***REMOVED***

    ***REMOVED***

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3***REMOVED***)+(?!\d))/g, ".");
            return parts.join(".");
    ***REMOVED***

        function make_viz(div_contenedor, data_contenido, titulo, color, etiqueta) {
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
                    "locale": "es_ES",
                    "number": function (number, params) {
                        var formatted = d3plus.number.format(number, params);
                        if (params.key === "rawValue") {
                            return "L " + numberWithCommas(parseFloat(Math.round(number / 1000000)).toFixed(0)) + " Millones";
                    ***REMOVED***
                        if (params.key === "share") {
                            return d3.round(number, 0) + " %";
                    ***REMOVED***
                        else {
                            return formatted;
                    ***REMOVED***
                  ***REMOVED***
                    "text": function (text, params) {
                        if (text == "rawValue") {
                            return "Ejecutado";
                    ***REMOVED*** else if (text == "labelGroup") {
                            return "Departamento";
                    ***REMOVED***
                        else if (text == "label") {
                            return "Departamento";
                    ***REMOVED*** 
                        else if (text == "share") {
                            return "Participación";
                    ***REMOVED***
                        else if (text == "including") {
                            return "Incluye";
                    ***REMOVED***
                        else {
                            return d3plus.string.title(text, params);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***)
                .title(
                    {
                        "value": titulo,
                        "padding": 10,
                        "font": { "size": 20 ***REMOVED***
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
                            "font": { "family": "inherit", "weight": "bold", "size": 14 ***REMOVED***
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

        function GetSubsidiosPerDpto() {
            $("#divGraphSubsidiosValor").html("");
            $("#divGraphSubsidiosValorCa").css("display", "");
            var params_usu = { "IdSubsidio": idsubsidio ***REMOVED***;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCifrasCovid/ObtenerSubsidiosPorDptoGroup",
                cache: false,
                data: params_usu,
                success: function (data) {
                    //var objJsonData = JSON.parse(data);
                    if (data.DetalleSubsidioDepto != null) {
                        if (data.DetalleSubsidioDepto.length > 0) {

                            var valor_total = "L " + numberWithCommas(parseFloat(Math.round(data.valor_total / 1000000)).toFixed(0)) + " Millones";
                            var cant_total = numberWithCommas(parseFloat(Math.round(data.cantidad_total)).toFixed(0));
                            $("#txtDepartamentoPrincipal").text(data.dpto_principal.toString());
                            //$("#cant_total").text(cant_total.toString());
                            //$("#valor_total").text(valor_total);
                            $("#cant_dptos").text(data.cant_departamentos.toString());


                            if (data.top_list != null) {
                                $("#cant_top").text(data.top_list.length.toString());
                                var txt_aux = "";
                                //Presidente Hayes(nro de subsidios, valor) 
                                $.each(data.top_list, function (i, item) {
                                    var valor_total = "L " + numberWithCommas(parseFloat(Math.round(item.rawValue / 1000000)).toFixed(0)) + " Millones";
                                    var cant_total = numberWithCommas(parseFloat(Math.round(item.rawValue_asoc)).toFixed(0));
                                    txt_aux += "<span class='label_depto'>" + item.labelGroup + "</span> ( " + "<span class='cantidad_depto'>" + cant_total.toString() + "</span>" + " , " + "<span class='valor_depto'>" + valor_total + "</span> " + " ) </br>";
                            ***REMOVED***);
                                $("#top_participacion").html($.parseHTML(txt_aux));
                        ***REMOVED***


                            $("#divTextoExplicativo").show();
                            $("#divTextoNoEncontrado").hide();
                            $("#secMapa").show();
                            if (idsubsidio == "126212") {
                                loadGraphSubsidiosPerFaseDpto("divGraphSubsidiosValor", data.DetalleSubsidioDepto, "Subsidio Pytyvo 1.0", "Número de beneficiarios");
                        ***REMOVED***
                            else if (idsubsidio == "126213") {
                                loadGraphSubsidiosPerFaseDpto("divGraphSubsidiosValor", data.DetalleSubsidioDepto, "Subsidio a Artistas", "Valor entregado en millones de L");
                        ***REMOVED***
                            else if (idsubsidio == "126214") {
                                loadGraphSubsidiosPerFaseDpto("divGraphSubsidiosValor", data.DetalleSubsidioDepto, "Subsidios Pytyvo 2.0 ", "Valor entregado en millones de L");
                        ***REMOVED***
                                
                            else loadGraphSubsidiosPerDpto("divGraphSubsidiosValor", data.DetalleSubsidioDepto, "Subsidios", "Valor entregado en millones de L");
                    ***REMOVED*** else {
                            $("#divTextoExplicativo").hide();
                            $("#divTextoNoEncontrado").show();
                            $("#secMapa").hide();
                    ***REMOVED***
                ***REMOVED*** else {
                        $("#divTextoExplicativo").hide();
                        $("#secMapa").hide();
                        $("#divTextoNoEncontrado").show();
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


        function configuraEnlaceContratista() {
            $(".enlace_contratista").click(function () {
                var ruc = $(this).attr('data-parameter');
                var dataValue = $(this).attr('data-parameter'),
                    dataType = $(this).attr('data-type').toLowerCase();
                document.cookie = "ruc=" + ruc + ";path=/;";
                var url = "/contratista/contratistaprofile?" + dataType + "=" + dataValue;
                window.location.href = url;

        ***REMOVED***);


    ***REMOVED***

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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


        function cambiarTipoTexto(cadena) {
            return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
    ***REMOVED***


 
***REMOVED***
);
define("subsidio_aux", function () { ***REMOVED***);