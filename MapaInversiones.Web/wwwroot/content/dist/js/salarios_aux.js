var anyo = (new Date).getFullYear() - 1;
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";

require([
    'comunes'
],
    function (
        comunes
    ) {

        
        inicializaDatos();
       
        
        
        function inicializaDatos() {

            //---habilita tab salarios
            $("#divArtSalarios").attr("class", "activo");
            $("#divTabBonifica").attr("class", "");
            $("#divArtBonifica").hide();
            $("#divArtSalarios").show();
            //-------------------------
            ObtenerSalariosConsolidado();

            ObtDatosDefault();
            configuraFiltro();
            configurarEnlaceTabs();


    ***REMOVED***

        function ObtDatosDefault() {
            var id = $("#filtro_entidades li:eq(0)").attr("id");
            if (id != undefined) {
                var val_Sel = id;
                var obj = $("#filtro_entidades li:eq(0)")
                $("#titSalariosActividades").html("Salarios pagados por actividad en " + obj.html());//+ " </br>Año 2020"
                $(obj).attr("class", "selected");
                $("#sel_entidades").html(obj.html());
                $("#selhd_entidades").val(val_Sel);

                if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                    ObtenerSalariosXEntidad(val_Sel);

            ***REMOVED***

        ***REMOVED***

    ***REMOVED***


        function configuraFiltro() {
            
            $("#filtro_entidades li").click(function () {
                var val_Sel = $(this).attr("id");
                $("#titSalariosActividades").html("Salarios pagados por actividad en " + this.innerHTML);//+ " </br>Año 2020"
                $(this).attr("class", "selected");
                $("#sel_entidades").html($(this).html());
                $("#selhd_entidades").val(val_Sel);
              
                if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                    ObtenerSalariosXEntidad(val_Sel);

            ***REMOVED***

        ***REMOVED***);

            $('#filtro_mes li').click(function () {
                    var val_Sel = $(this).attr("id");
                    $(this).attr("class", "selected");
                    $("#sel_mes").html($(this).html());
                    $("#selhd_mes").val(val_Sel);
                    if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                        $("#divListadoActividades").children().remove();
                        var idEntidad = $("#selhd_entidades").val();
                        if (idEntidad != "" && idEntidad != undefined) {
                            ObtenerSalariosXActividad(id, 1, val_Sel)
                    ***REMOVED***
                       

                ***REMOVED***

            ***REMOVED***);


    ***REMOVED***

        function configurarEnlaceTabs() {
            $('#divTabSalarios').each(function (i, e) {
                $(e).bind('click', function () {
                    $("#divArtSalarios").attr("class", "activo");
                    $("#divTabBonifica").attr("class", "");
                    $("#divArtBonifica").hide();
                    $("#divArtSalarios").show();
                    $("#graphDona33").empty();
                    $("#divConvenciones").empty();
                    ObtenerSalariosConsolidado();
                    ObtDatosDefault();
                    
            ***REMOVED***);
        ***REMOVED***);
            $('#divTabBonifica').each(function (i, e) {
                $(e).bind('click', function () {
                    $("#divTabBonifica").attr("class", "activo");
                    $("#divTabSalarios").attr("class", "");
                    $("#divArtSalarios").hide();
                    $("#divArtBonifica").show();
                    $("#graphDonaBonifica").empty();
                    $("#divConvencionesBonifica").empty();
                    ObtDataBonificaciones();
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***

        function ObtDataBonificaciones() {
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerDetalleBonificaciones",
                cache: false,
                data: null,
                success: function (result) {
                    if (result.status == true) {
                        if (result.bonificacionesEmpleados.length > 0) {
                            var dataset_dona = obtMatrizDataBonifica(result.bonificacionesEmpleados);
                            getDonaResponsive("graphDonaBonifica", dataset_dona,"bonifica");
                            getConvenciones(dataset_dona, "divConvencionesBonifica");
                    ***REMOVED***



                ***REMOVED*** else {
                        bootbox.alert("Error: " + result.message, function () {

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
        
        function obtMatrizDataBonifica(data) {

            var cant_nodos_fin = 0;
            var obj_nodos = [];
            var obj_links = [];
            var i = 0;
            var cad_aux = "";
            var colors = ["#2d5a79", "#4eb7f0", "#e06b55", "#de425b", "#549e77", "#b0cb9b", "#449ee2", "#93b4cc", "#d6d6d6", "#e3e4c5"];
            $.each(data, function (key, value) {
                var obj_aux = { name: value.label, total: value.rawValue, percent: value.porcentaje, total_asoc: value.rawValue_asoc, color: colors[i] ***REMOVED***;
                obj_nodos.push(obj_aux);
                i += 1;

        ***REMOVED***);

            return obj_nodos;

    ***REMOVED***


        function ObtenerSalariosConsolidado() {
            var vigencia = document.body.getAttribute('data_anyo_sal');
            var param = "anyo=" + vigencia;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerConsolidadoSalarios",
                cache: false,
                data: param,
                success: function (result) {
                    if (result.status == true) {
                        //barra_Horizontal_new("divGraphSalariosConsolidada", result.EntidadesGobierno);
                        var dataset=obtMatrizData(result.EntidadesGobierno);
                        getDonaResponsive("graphDona33", dataset);
                        getConvenciones(dataset,"divConvenciones");
                       
                ***REMOVED*** else { 
                         bootbox.alert("Error: " + result.message, function () {

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

        function obtMatrizData(data) {
            var dataset_33 = [
                { name: 'Mercado internacional', total: 1000, percent: 62.50, color: "#1F78B4" ***REMOVED***,
                { name: 'BID-5028/OC', total: 160, percent: 10.00, color: "#33A02C" ***REMOVED***,
                { name: 'BID-5029/KI-PR', total: 50, percent: 3.13, color: "#B2DF8A" ***REMOVED***,
                { name: 'BIRF', total: 20, percent: 1.25, color: "#A6CEE3" ***REMOVED***,
                { name: 'Endeudamiento en gestión', total: 370, percent: 23.12, color: "#FB9A99" ***REMOVED***
            ];


                //CodigoEntidad = salario.CodigoEntidad,
                //NombreEntidad = salario.NombreEntidad,
                //Valor = salario.Valor,
                //porcentaje = Math.Round((salario.Valor / total) * 100, 2)

            var cant_nodos_fin = 0;
            var obj_nodos = [];
            var obj_links = [];
            var i = 0;
            var cad_aux = "";
            var colors = ["#2d5a79", "#4eb7f0", "#e06b55", "#de425b", "#549e77", "#b0cb9b", "#449ee2", "#93b4cc"];
            $.each(data, function (key, value) {
                var obj_aux = { name: value.NombreEntidad, total: value.Valor, percent: value.porcentaje, color: colors[i] ***REMOVED***;
                obj_nodos.push(obj_aux);
                i += 1;

        ***REMOVED***);

           

            return obj_nodos;

    ***REMOVED***

        function getConvenciones(data, nom_contenedor) {
            $.each(data, function (key, value) {
                var contenedor = d3.select("#" + nom_contenedor);
                var entidad = "";
                var j = 0;
                var box = contenedor.append("div")
                    .attr("class", "card cardSalarios")
                var header=box.append("div")
                    .attr("class", "card-header")
                var color=header.append("div")
                    .attr("class", "col-xs-2 col-md-2")
                color.append("span")
                    .attr("class", "colorbox-demo c1")
                    .attr("style","background-color:" + value.color)
                var etiqueta = header.append("div")
                    .attr("class", "col-xs-10 col-md-10 col-lg-10")
                    .append("span")
                    .attr("class", "h4")
                    .text(value.name)
        ***REMOVED***);

    ***REMOVED***

        function ObtenerSalariosXEntidad(id) {
            var param = "id=" + id;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerSalariosXEntidadAnio",
                cache: false,
                data: param,
                success: function (result) {
                    var datos = result.InfoEntidad;
                    $("#divGraphSalariosEntidad").html("");
                    if (result.status == true) {
                        if (datos.SalariosXPeriodo != null) {
                            barra_vertical("divGraphSalariosEntidad", datos.SalariosXPeriodo);
                            var mes = $("#selhd_mes").val();
                            ObtenerSalariosXActividad(id,1,mes);
                    ***REMOVED***
                       
                ***REMOVED*** else {
                        bootbox.alert("Error: " + result.message, function () {

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

        function ObtenerSalariosXActividad(id, page, mes) {
            $("#divListadoActividades").empty();
            $("#divPagFichas").empty();
            var consulta = {
                id: id,
                pagina: page,
                texto: mes
        ***REMOVED***;
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerInfoSalariosByActividades",
                cache: false,
                data: JSON.stringify(consulta),
                success: function (result) {
                      var datos = result.InfoEntidad;
                    if (result.status == true) {
                        if (datos.SalariosXActividad != null) {
                            $("#divListadoActividades").empty();
                            $("#divPagFichas").empty();
                            if (datos.SalariosXActividad.length > 0) {
                                fichaActividad(datos.SalariosXActividad);
                                dibujarPaginacionActividades(datos.pagesNumber, datos.totalNumber, datos.totalPages, id);
                        ***REMOVED***
                            else {
                                $("#divListadoActividades").append("span").text("No existen datos relacionados");
                        ***REMOVED***

                    ***REMOVED***

                ***REMOVED*** else {
                        bootbox.alert("Error: " + result.message, function () {

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


        function fichaActividad(data) {
            var nom_contenedor = "#divListadoActividades";
            var contenedor = d3.select(nom_contenedor);
            var entidad = "";
            var j = 0;
            for (var i = 0; i < data.length; i++) {
                var valor = (data[i].rawValue).formatMoney(0, '.', '.');
                var box=contenedor.append("div")
                .attr("class", "activityBox")
                var head = box.append("div")
                .attr("class","head")
                var label_nombre=head.append("div")
                .attr("class", "mainData")
                label_nombre.append("span")
                .attr("class", "td1")
                .text(data[i].labelGroup)
                 var label_mes=head.append("div")
                    .attr("class", "data1")
                label_mes.append("span")
                    .attr("class", "labelTit")
                    .text("Mes")
                label_mes.append("span")
                    .attr("class", "td1")
                    .text(getAbreviaturaMes(data[i].rawValue_asoc))
                var label_salario = head.append("div")
                    .attr("class", "data1")
                label_salario.append("span")
                    .attr("class", "labelTit")
                    .text("Salario")
                label_salario.append("span")
                    .attr("class", "td1")
                    .text("L " + valor.toString() +  " M")
        ***REMOVED***

    ***REMOVED***

        function getNombreMes(nom) {
            var nombre = "";
            switch (nom) {
                case "ENE":
                    nombre = "Enero";
                    break;
                case "FEB":
                    nombre="Febrero"
                    break;
                case "MAR":
                    nombre = "Marzo";
                    break;
                case "ABR":
                    nombre = "Abril"
                    break;
                case "MAY":
                    nombre = "Mayo"
                    break;
                case "JUN":
                    nombre = "Junio"
                    break;
                case "JUL":
                    nombre = "Julio";
                    break;
                case "AGO":
                    nombre = "Agosto"
                    break;
                case "SEP":
                    nombre = "Septiembre";
                    break;
                case "OCT":
                    nombre = "Octubre"
                    break; 
                case "NOV":
                    nombre = "Noviembre"
                    break;
                case "DIC":
                    nombre = "Diciembre"
                    break;
                default:
                    nombre = nom;
        ***REMOVED***
            return nombre;

    ***REMOVED***

        function getAbreviaturaMes(codigo) {
            var nombre = "";
            switch (codigo) {
                case 1:
                    nombre = "Enero";
                    break;
                case 2:
                    nombre = "Febrero";
                    break;
                case 3:
                    nombre = "Marzo";
                    break;
                case 4:
                    nombre = "Abril";
                    break;
                case 5:
                    nombre = "Mayo";
                    break;
                case 6:
                    nombre = "Junio";
                    break;
                case 7:
                    nombre = "Julio";
                    break;
                case 8:
                    nombre = "Agosto";
                    break;
                case 9:
                    nombre = "Septiembre";
                    break;
                case 10:
                    nombre = "Octubre";
                    break;
                case 11:
                    nombre = "Noviembre";
                    break;
                case 1:
                    nombre = "Diciembre";
                    break;
                default:
                    nombre = codigo.toString();
        ***REMOVED***
            return nombre;

    ***REMOVED***

        function getAbreviaturaMesGraph(codigo) {
            var nombre = "";
            switch (codigo) {
                case 1:
                    nombre = "ENE";
                    break;
                case 2:
                    nombre = "FEB";
                    break;
                case 3:
                    nombre = "MAR";
                    break;
                case 4:
                    nombre = "ABR";
                    break;
                case 5:
                    nombre = "MAY";
                    break;
                case 6:
                    nombre = "JUN";
                    break;
                case 7:
                    nombre = "JUL";
                    break;
                case 8:
                    nombre = "AGO";
                    break;
                case 9:
                    nombre = "SEP";
                    break;
                case 10:
                    nombre = "OCT";
                    break;
                case 11:
                    nombre = "NOV";
                    break;
                case 1:
                    nombre = "DIC";
                    break;
                default:
                    nombre = codigo.toString();
        ***REMOVED***
            return nombre;

    ***REMOVED***

        function dibujarPaginacionActividades(actual, total, totalPag,id) {
            $("#divListadoActividades").attr("page", actual);
            $("#divListadoActividades").attr("totalNumber", total);
            $("#divListadoActividades").attr("totalPages", totalPag);

            var pag_actual = parseInt(actual);
            var pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 20;
            var cant_por_linea = 20;
            $("#divPagFichas").html("");
            var divPag = d3.select("#divPagFichas")

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

            $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
                //d3.select("#divProyectos").empty();
                pagina_actual = $(this).attr("data-page");
                var mes = $("#selhd_mes").val();
                ObtenerSalariosXActividad(id,pagina_actual,mes);
        ***REMOVED***);


    ***REMOVED***

        function barra_vertical(div_contenedor, data_contenido) {
            var visualization = d3plus.viz()
                .container("#" + div_contenedor)
                .data({ "value": data_contenido, ***REMOVED***)
                .type("bar")
                .id("label")
                .color({
                    "scale": ["#00876c", "#549e77", "#b0cb9b", "#d9e1b5", "#f4daa7", "#449ee2", "#93b4cc", "#2d5a79", "#4eb7f0", "#e79365", "#e06b55", "#de425b"],
            ***REMOVED***)
                .font({ "family": "inherit", "size": 12 ***REMOVED***)
                .background("rgba(255, 255, 255, 0)")
                //.text({ "value": "rawValue" ***REMOVED***)
                .axes({
                    "background": { "color": "rgba(255,255,255,0)", "ticks": true, "stroke": { "width": 1, "color":"#d6d6d6" ***REMOVED*** ***REMOVED***,
                    "font": { "family": "inherit" ***REMOVED***,
                    "label": true
            ***REMOVED***)
                .x({
                    "value": "label",
                    "axis": { "padding": "10px", "color": "#d6d6d6", "border-color": "#d6d6d6" ***REMOVED***,
                    "grid": false,
                    "label": {
                        "value": false,
                        "padding": 10,
                        "font": { "family": "inherit", "weight": "bold", "size": 12 ***REMOVED***
                ***REMOVED***
            ***REMOVED***)
                .y(
                    {
                    "value": "rawValue",
                    "ticks": { "color": "rgba(255,255,255,0)", "labels": true ***REMOVED***,
                    "lines": { "color": "#d6d6d6", "width": 100 ***REMOVED***,
                    "axis": { "padding": "10px", "color": "#d6d6d6", "label": true ***REMOVED***,
                    "grid": true,
                    "label": {
                        "value": true,
                        "padding": 5,
                        "font": { "family": "inherit", "weight": "bold", "size": 12, "color": "rgba(255,255,255,0)" ***REMOVED***
                ***REMOVED***
                ***REMOVED***)
                .height({ "small": 300, "value": 350 ***REMOVED***)
                .format({
                    "locale": "es_ES",
                    "number": function (number, params) {
                        var formatted = d3plus.number.format(number, params);
                        if (params.key === "rawValue") {
                            var valor = number;
                            if (valor != undefined) {
                                valor = (valor).formatMoney(0, '.', '.');
                        ***REMOVED***
                            //return "L " + valor.toString() + " Millones";
                            return valor + " M";
                    ***REMOVED***
                        if (params.key === "value") {
                            var valor = number;
                            if (valor != undefined) {
                                valor = (valor).formatMoney(0, '.', '.');
                        ***REMOVED***
                            return "L " + valor.toString() + " Millones";
                            //return number + " M";
                    ***REMOVED***
                        if (params.key === "share") {
                            return d3.round(number, 2) + " %";
                    ***REMOVED***
                        else {
                            return formatted;
                    ***REMOVED***
                  ***REMOVED***
                    "text": function (text, params) {
                        if (params.key == "label") {
                            if (text != "") {
                                return getAbreviaturaMesGraph(parseInt(text));
                        ***REMOVED*** else {
                                return text;
                        ***REMOVED***
                            
                    ***REMOVED*** else {
                            if (text == "label") {
                                return "Mes";
                        ***REMOVED*** else if (text == "rawValue") {
                                return "Valor L ";
                        ***REMOVED***
                            else if (text == "share") {
                                return "Participación";
                        ***REMOVED***
                            else if (text == "including") {
                                return "Incluye";
                        ***REMOVED***
                            else if (text === "value") {
                                var valor = text;
                                if (text != undefined) {
                                    valor = (valor).formatMoney(0, '.', '.');
                            ***REMOVED***
                                return "L " + valor.toString() + " Millones";
                                //return number + " M";
                        ***REMOVED***
                            else {
                                return d3plus.string.title(text, params);
                        ***REMOVED***
                    ***REMOVED***


                       
                ***REMOVED***
            ***REMOVED***)
                //.tooltip({ value: "rawValue" ***REMOVED***)
                .draw()

    ***REMOVED***

        function barra_vertical_old(div_contenedor, data_contenido, titulo, color) {
            var nAngle = 0;
            var myData = data_contenido;

            var minimo = 0;
            var maximo = 0;

            if (myData.length > 0) {
                maximo = d3.max(myData, function (d) { return d.rawValue; ***REMOVED***);
                minimo = d3.min(myData, function (d) { return d.rawValue; ***REMOVED***);
        ***REMOVED***

            var long_max = maximo.toString().length;

            var svg = d3.select("#" + div_contenedor),
                margin = { top: 20, right: 20, bottom: 40, left: 75 ***REMOVED***;


            var bounds = svg.node().getBoundingClientRect(),
                width = bounds.width - margin.left - margin.right,
                height = (bounds.height) - margin.top - margin.bottom;

            var x_legend = true;
            var x_pos_texto = 20;

            let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;

            if (isMobile) {
                x_legend = false;
        ***REMOVED***


            var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("display", "none")
                .style("background", "#FFF")
                .style("border", "1px solid #6F257F")
                .style("width", "auto")
                .style("padding", "5px")
                //.text("Monto");

            var x = d3.scale.ordinal()
                .domain(myData.map(function (d) { return d.label; ***REMOVED***))
                .rangeRoundBands([0, width], 0.1, 0.1)


            var y = d3.scale.linear()
                .domain([0, d3.max(myData, function (d) { return d.rawValue; ***REMOVED***)])
                .range([0, height])

            var colours = d3.scaleOrdinal()
                .range(["#00876c", "#549e77", "#b0cb9b", "#d9e1b5", "#f4daa7", "#449ee2", "#93b4cc", "#2d5a79", "#4eb7f0", "#e79365", "#e06b55","#de425b"]);

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");

            x.domain(myData.map(function (d) { return d.label; ***REMOVED***));
            y.domain([0, d3.max(myData, function (d) { return d.rawValue; ***REMOVED***)]);



            if (x_legend) {
                g.append("g")
                    .attr("class", "axis")
                    .attr("class", "ejeGris")
                    .style("font", "12px sans-serif")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));
        ***REMOVED*** else {
                x_pos_texto = 15;
                g.append("g")
                    .attr("class", "axis")
                    .attr("class", "ejeGris")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .style("font", "12px sans-serif")
                    .attr("transform", "rotate(-65)");
        ***REMOVED***

            g.append("g")
                .attr("class", "axis")
                .attr("class", "ejeGris")
                .style("font", "12px sans-serif")
               
                .call(d3.axisLeft(y).ticks(5).tickFormat(function (d) {
                    return d + " M";
                    //if (minimo > 1000000) {
                    //    return parseInt(d / 1000000) + " M";
                    //***REMOVED***
                    //else {
                    //    return d;
                    //***REMOVED***

            ***REMOVED***).tickSizeInner([-width]))


            g.selectAll(".bar")
                .data(myData)
                .enter().append("rect")
                .attr("x", function (d) { return x(d.label); ***REMOVED***)
                .attr("y", function (d) { return y(d.rawValue); ***REMOVED***)
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.rawValue); ***REMOVED***)
                .attr("fill", function (d) {
                    return colours(d.label);
            ***REMOVED***)

                .on("mouseover", function (d) {
                    var valor = d.rawValue;
                    if (d.rawValue != undefined) {
                        valor = (d.rawValue).formatMoney(0, '.', '.');
                ***REMOVED***
                    tooltip.html("L " + valor.toString() + " Millones");
                    return tooltip.style("display", "");
            ***REMOVED***)
                .on("mousemove", function () {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            ***REMOVED***)
                .on("mouseout", function () {
                    return tooltip.style("display", "none");
            ***REMOVED***);

            g.selectAll(".bar")
                .data(myData)
                //.enter().append("text")
                //.attr("transform", function (d, i) {
                //    var alto_barra = height - y(d.rawValue);
                //    var cant_restar = d.rawValue.toString().length * 8.7;
                //    if (alto_barra >= (height - cant_restar)) {
                //        return "translate(" + (x(d.label) + x_pos_texto) + "," + (y(d.rawValue) + cant_restar) + ") rotate(-90)";

                //***REMOVED*** else {
                //        return "translate(" + (x(d.label) + x_pos_texto) + "," + (y(d.rawValue) - 5) + ") rotate(-90)";
                //***REMOVED***

                //***REMOVED***)

                .attr("font-size", "12px")
                .style("font-weight", "bold")
                .attr("text-anchor", "left")
                .text(function (d) {
                    var valor = d.rawValue;
                    if (d.rawValue != undefined) {
                        valor = (d.rawValue).formatMoney(0, '.', '.');
                        return valor;
                ***REMOVED***
            ***REMOVED***)
                .style("fill", "#000");

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


        function barra_Horizontal_new(div_contenedor, data_contenido) {
            var data = data_contenido;
            var x_pos_texto = 20;
            var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("display", "none")
                .style("background", "#FFF")
                .style("border", "1px solid #6F257F")
                .style("width", "auto")
                .style("padding", "5px");


            var margin = { top: 20, right: 20, bottom: 30, left: 290 ***REMOVED***,
                width = 1200 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;



            var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.1);

            var x = d3.scaleLinear()
                .range([0, width]);

            var colours = d3.scaleOrdinal()
                .range(["#2d5a79", "#4eb7f0", "#e06b55", "#de425b", "#549e77", "#b0cb9b", "#449ee2", "#93b4cc"]);

            var svg = d3.select("#" + div_contenedor).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // Scale the range of the data in the domains
            x.domain([0, d3.max(data, function (d) { return d.Valor; ***REMOVED***)])
            y.domain(data.map(function (d) { return d.NombreEntidad; ***REMOVED***));

            // append the rectangles for the bar chart
            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("width", function (d) { return x(d.Valor); ***REMOVED***)
                .attr("y", function (d) { return y(d.NombreEntidad); ***REMOVED***)
                .attr("height", y.bandwidth())
                .attr("fill", function (d) {
                    return colours(d.NombreEntidad);
            ***REMOVED***)
                .on("mouseover", function (d) {
                    var valor = d.Valor;
                    if (d.Valor != undefined) {
                        valor = (d.Valor).formatMoney(0, '.', '.');
                ***REMOVED***
                    tooltip.html("L " + valor.toString() + " Millones");
                    return tooltip.style("display", "");
            ***REMOVED***)
                .on("mousemove", function () {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            ***REMOVED***)
                .on("mouseout", function () {
                    return tooltip.style("display", "none");
            ***REMOVED***);

            svg.selectAll(".bar")
                .data(data)
                .enter().append("text")
                .attr("transform", function (d, i) {
                    var alto_barra = height - y(d.Valor);
                    var cant_restar = d.Valor.toString().length * 8.7;
                    if (alto_barra >= (height - cant_restar)) {
                        return "translate(" + (x(d.NombreEntidad) + x_pos_texto) + "," + (y(d.Valor) + cant_restar) + ") rotate(-90)";

                ***REMOVED*** else {
                        return "translate(" + (x(d.NombreEntidad) + x_pos_texto) + "," + (y(d.Valor) - 5) + ") rotate(-90)";
                ***REMOVED***

            ***REMOVED***)
                .attr("font-size", "12px")
                .style("font-weight", "bold")
                .attr("text-anchor", "left")
                .text(function (d) {
                    var valor = d.Valor;
                    if (d.Valor != undefined) {
                        valor = (d.Valor).formatMoney(0, '.', '.');
                        return valor;
                ***REMOVED***
            ***REMOVED***)
                .style("fill", "#000");




            // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // add the y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

    ***REMOVED***





        function getDonaResponsive(contenedor, dataset,opcion) {
            var x_legend = true;
            var width = 600;
            var height = 400;
            var donutWidth = 70;
            var height_pie = 400;

            var div = d3.select("body").append("div").attr("class", "toolTip");

            let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;

            if ($(window).innerWidth() <= width || isMobile) {
                x_legend = false;
                width = $(window).innerWidth();
                donutWidth = 60;
        ***REMOVED***

            var radius = Math.min(width, height) / 2;

            var enterClockwise = {
                startAngle: 0,
                endAngle: 0
        ***REMOVED***;

            var enterAntiClockwise = {
                startAngle: 1.1 * Math.PI,
                endAngle: 3.1 * Math.PI
        ***REMOVED***;

            var svg = d3.select('#' + contenedor).append('svg')
                .attr("width", '100%')
                .attr("height", '100%')
                .attr('viewBox', (-width / 2) + ' ' + (-height / 2) + ' ' + width + ' ' + height)
                .attr('preserveAspectRatio', 'xMinYMin')

            var arc = d3.svg.arc()
                .innerRadius(radius - donutWidth)
                .outerRadius(radius);

            var pie = d3.layout.pie()
                .value(function (d) { return d.total; ***REMOVED***)
                .sort(null);


            var g = svg.selectAll(".arc")
                .data(pie(dataset))
                .enter()
                .append("g")
                .attr("class", "arc");

            var path = g.append("path")
                .style("fill", function (d) {
                    return (d.data.color);

            ***REMOVED***)
                .attr("d", arc(enterAntiClockwise))
                .each(function (d) {
                    this._current = {
                        data: d.data,
                        value: function (d) { return d.total; ***REMOVED***,
                        startAngle: enterAntiClockwise.startAngle,
                        endAngle: enterAntiClockwise.endAngle
                ***REMOVED***
            ***REMOVED***)
                .transition()
                .duration(500)
                .attrTween("d", arcTween);

            g.append("text")
                .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; ***REMOVED***)
                .attr("dy", ".35em")
                .transition()
                .delay(1000)
                .text(function (d) {
                    //return Math.round(d.data.total, 0);
                    var valor = d.data.total;
                    if (d.data.total != undefined) {
                        valor =  (d.data.total).formatMoney(0, '.', '.');
                ***REMOVED***
                    return valor;

            ***REMOVED***);

            d3.selectAll("path").on("mousemove", function (d) {
                div.style("left", d3.event.pageX + 10 + "px");
                div.style("top", d3.event.pageY - 25 + "px");
                div.style("display", "inline-block");
                if (opcion != "bonifica") {
                    div.html((d.data.name) + "<br>" + (d.data.percent) + "%");
            ***REMOVED*** else {
                    var monto_aux = "L " + (d.data.total_asoc/1000000).formatMoney(0, '.', '.') + " Millones";
                    div.html((d.data.name) + "<br>" + monto_aux + "<br>" + (d.data.percent) + "%");
            ***REMOVED***
                
        ***REMOVED***);

            d3.selectAll("path").on("mouseout", function (d) {
                div.style("display", "none");
        ***REMOVED***);


            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function (t) {
                    return arc(i(t));
            ***REMOVED***;
        ***REMOVED***
            function arcTweenOut(a) {
                var i = d3.interpolate(this._current, { startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0 ***REMOVED***);
                this._current = i(0);
                return function (t) {
                    return arc(i(t));
            ***REMOVED***;
        ***REMOVED***


            function type(d) {
                d.total = +d.total;
                return d;
        ***REMOVED***


    ***REMOVED***



        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3***REMOVED***)+(?!\d))/g, ".");
            return parts.join(".");
    ***REMOVED***


***REMOVED***)


