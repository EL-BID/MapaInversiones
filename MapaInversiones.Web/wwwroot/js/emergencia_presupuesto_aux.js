var anyo = (new Date).getFullYear() - 1;
var recursosPerObjetoAvanceGroup = JSON.parse(document.body.getAttribute('data-recursosPerObjetoAvanceGroup'));
var objPerContratos = JSON.parse(document.body.getAttribute('data-resourcesPerContratos'));
var tipoEmergencia = JSON.parse(document.body.getAttribute('data-tipoEmergencia'));
$("#divListadoRecursosObjeEnteNoCentral").hide();

inicializaDatos();
$("#enlacesankey_og").trigger("click");
configVerMas();
function inicializaDatos() {
    $('#accordion .collapse').removeClass("in");
    $("#divListadoRecursosObje").hide();
    $("#iconList").attr("class", "txt-bold icRD_blue");
    $("#iconTree").attr("class", "txt-bold icGrap_blue");
    $("#iconSankey").attr("class", "txt-bold icSankey");
    //comportamiento resultados buscador
    $(".container,.reset-filters,.filter-results").on('click',function (event) {
        var obj_focus_clase = event.target.className.toString();
        if (obj_focus_clase.indexOf("search-results") < 0 && obj_focus_clase.indexOf("search-item-t") < 0 && obj_focus_clase.indexOf("search-input") < 0 && obj_focus_clase.indexOf("general-search") < 0) {
            $("#divResultados").children().remove();
            $("#divResultados").addClass("objHidden");
    ***REMOVED***
***REMOVED***);
    configuraFiltro_DesgloseIconos();
    configuraFiltro_Donaciones();
    configuraEnlacesParticipa();
    ObtConsolidadoRecursos();
    
***REMOVED***
function configuraEnlacesParticipa() {
    $("#divEnlaceParticipaCon").on('click', function (e) {
        var url = "/Participa/Comentarios/";
        window.location.href = url;
***REMOVED***);
    $("#divEnlaceParticipaPro").on('click', function (e) {
        var url = "/Participa/programasayuda/";
        window.location.href = url;
***REMOVED***);
    $("#divEnlaceSolicita").on('click', function (e) {
        var url = "/Participa/AccesoInformacion/";
        window.location.href = url;
***REMOVED***);
    $("#divEnlaceDeclaraciones").on('click', function (e) {
        var url = "/Covid/Declaraciones/";
        window.location.href = url;
***REMOVED***);
***REMOVED***
function ObtConsolidadoRecursos() {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: null,
        url: "/api/ServiciosCovid/ObtConsolidadoRecursosCovid",
        cache: false,
        success: function (result) {
            if (result.status == true) {
                var data = result.distribucionItem;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var nombre_aux = data[i].nomItem.toUpperCase();
                        var id_aux = data[i].idItem;
                        var valor = "RD $ " + formatMoney(parseFloat(data[i].total_valor / 1000000),0, ".", ",") + tituloMillones(parseFloat(data[i].total_valor).toFixed(0));
                        var cant_ben = formatMoney(parseFloat(data[i].total_beneficiarios),0, ".", ",");
                        var aux_div = d3.select("#" + "divConsolidaRecursosData")
                            .append("div")
                            .attr("class", "card")
                        var aux_fila = aux_div.append("div")
                            .attr("class", "row")
                        var aux_encabezado = aux_fila.append("div")
                            .attr("class", "col-md-4 c-inline-item-head")
                        var aux_nombre = aux_encabezado.append("div")
                            .attr("class", "ic_tit")
                        if (nombre_aux == "CONTRATOS") {
                            aux_nombre.append("img")
                                .attr("src", "/content/img/covid/ic_contratos.svg")
                                .attr("alt", "Consultar " + data[i].nomItem)
                    ***REMOVED*** else if (nombre_aux == "OTROS GASTOS") {
                            aux_nombre.append("img")
                                .attr("src", "/content/img/covid/ic_otrosGastos.svg")
                                .attr("alt", "Consultar " + data[i].nomItem)
                    ***REMOVED*** else {
                            aux_nombre.append("img")
                                .attr("src", "/content/img/covid/ic_postulacion.svg")
                                .attr("alt", "Consultar " + data[i].nomItem)
                    ***REMOVED***
                        aux_encabezado.append("span")
                            .attr("class", "h4")
                            .text(data[i].nomItem)
                        if (data[i].label_nombre != "") {
                            aux_encabezado.append("span")
                                .attr("class", "txt-small")
                                .text(data[i].label_nombre)
                    ***REMOVED***
                        if (nombre_aux == "FASE TURISMO") {
                            aux_encabezado.append("span")
                                .attr("class", "badge badge-pill badge-success")
                                .text("NUEVO")
                    ***REMOVED***
                        var aux_valor = aux_fila.append("div")
                            .attr("class", "col-md-3 c-inline-item")
                        aux_valor.append("div").attr("class", "txt-small").text(data[i].label_valor)
                        aux_valor.append("span").attr("class", "bigNumber").text(valor)

                        var aux_ben = aux_fila.append("div")
                            .attr("class", "col-md-2 c-inline-item")
                        aux_ben.append("div").attr("class", "txt-small").text(data[i].label_beneficiarios)
                        if (data[i].total_beneficiarios > 0) {
                            aux_ben.append("span").attr("class", "bigNumber").text(cant_ben)
                    ***REMOVED*** else {
                            aux_ben.append("span").attr("class", "bigNumber").text(" ")
                    ***REMOVED***

                        var rutaficha = obtRutaEnlace(nombre_aux, data[i].IdItem);
                        var externo = data[i].externo;
                        var enlace = aux_fila.append("div")
                            .attr("class", "col-md-3 c-inline-item")
                        var aux_btn = enlace.append("div")
                            .attr("class", "cta-wrapper")
                        var btn_enlace = aux_btn.append("a")
                            .attr("id", "btn_" + data[i].IdItem)
                            .attr("codigo", id_aux)

                        if (externo == false) {
                            tipoenlace = "_self";
                    ***REMOVED*** else {
                            tipoenlace = "_blank";
                    ***REMOVED***
                        if (rutaficha != "") {
                            btn_enlace.attr('href', rutaficha);
                            btn_enlace.attr("target", tipoenlace);
                            btn_enlace.attr("tipo", "")
                            btn_enlace.attr("class", "btn btn-outlined")
                    ***REMOVED*** else {
                            btn_enlace.attr('href', "#a_" + id_aux);
                            btn_enlace.attr("tipo", "AC")
                            btn_enlace.attr("class", "btn btn-outlined enlace_prog")
                    ***REMOVED***
                        btn_enlace.append("div")
                        btn_enlace.text(data[i].label_boton + " ")
                        btn_enlace.append("span").attr("class", "glyphicon glyphicon-circle-arrow-right")
                ***REMOVED***
                    configEnlaceOtros();
            ***REMOVED***

        ***REMOVED*** else {
                alert("Error1: " + result.message, function () {

            ***REMOVED***);
        ***REMOVED***
      ***REMOVED***
        error: function (response) {
            alert("Error2: " + response.responseText);
      ***REMOVED***
        failure: function (response) {
            alert("Error3: " + response.responseText);
    ***REMOVED***
***REMOVED***);

***REMOVED***



function configEnlaceOtros() {
    $(".enlace_prog").on('click', function () {
        $('#accordion .collapse').removeClass("in");
        $("#enlacelistado_og").trigger("click");

        $("#migapanlistado").val("");

        var tipo_enlace = $(this).attr("tipo")
        var id_item = $(this).attr("codigo");
        if (tipo_enlace == "AC") {
            var obj_dom = $("a[data-toggle='collapse'][ item='" + id_item + "']").attr("id");
            const el = document.getElementById(obj_dom);
            el.click();
    ***REMOVED***

***REMOVED***);

***REMOVED***

function obtRutaEnlace(filtro, idSubsidio) {
    var rutaficha = "";
    switch (filtro) {
        case "FASE":
            rutaficha = "../Covid/PerfilSubsidio/?subsidio=" + idSubsidio;
            break;
        case "QUÉDATE EN CASA" || "QUEDATE EN CASA":
            rutaficha = "https://www.quedateencasa.gob.do/";
            break;
        case "PATI":
            rutaficha = "https://programas-beneficios.hacienda.gob.do/principal";
            break;
        case "INCENTIVOS":
            rutaficha = "";
            break;
        case "CONTRATOS":
            rutaficha = "/contratista/contratoscovid";
            break;
        case "FASE TURISMO":
            rutaficha = "../Covid/PerfilSubsidio/?subsidio=" + idSubsidio;

            break;
        default:
            rutaficha = "";

***REMOVED***
    return rutaficha;
***REMOVED***
function configVerMas() {

    $(".more").on('click', function () {
        var idcom = $(this).attr('idcom');
        $(".Post_user[idcom='" + idcom + "']>.complete").toggle();
        //$(".complete").toggle();
        if ($(this).text() == "Ver más...") {
            $(this).text("Ver menos...");
    ***REMOVED*** else {
            $(this).text("Ver más...");
    ***REMOVED***
***REMOVED***);



    $(".accordion").on('click', function () {

        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
    ***REMOVED*** else {
            panel.style.maxHeight = panel.scrollHeight + "px";
    ***REMOVED***
***REMOVED***);
***REMOVED***
function configuraFiltro_DesgloseIconos() {
    $(".tipo_grafica").on('click', function () {
        var tipo = $(this).attr('codigo');
        $(".tipo_grafica").removeClass("activo");
        $(this).addClass("activo");
        $("#divListadoRecursosObje").show();
 
        if (tipo == "listado") {
            $("#iconSankey").attr("class", "txt-bold icSankey_blue");
            $("#iconTree").attr("class", "txt-bold icGrap_blue");
            $("#iconList").attr("class", "txt-bold icRD");

            $('#accordion .collapse').removeClass("in");
            $("#divGraphRecursosObj").hide();
            $("#divListadoRecursosObje").show();
            $(".boxCompoDesglose").hide();
            $(".boxTituloListado").show();
            $("#sankey_basic").empty();

            var lstNiveles = $("#migapanlistado").val();
            var arrayNiv = lstNiveles.split(",");
            var nom_nivel = "";
            var longitud = arrayNiv.length;
            if (longitud > 0) {

                for (var i = 0; i < longitud; i++) {
                    nom_nivel = arrayNiv[i].toUpperCase();
                    switch (i) {
                        case 0:
                            var id = $(".nivel1[item='" + nom_nivel + "']").attr("id");
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
    
                ***REMOVED***

            ***REMOVED***
        ***REMOVED*** else {
                $('#accordion .collapse').removeClass("in");
        ***REMOVED***
    ***REMOVED*** else if (tipo == "grafica") {
            $("#iconSankey").attr("class", "txt-bold icSankey_blue");
            $("#iconList").attr("class", "txt-bold icRD_blue");
            $("#iconTree").attr("class", "txt-bold icGraph");

            $("#divGraphRecursosObj").show();
            $("#divListadoRecursosObje").hide();
            $("#divGraphRecursosObj").children().remove();
            loadRecursosPorObjeto(recursosPerObjetoAvanceGroup, "divGraphRecursosObj", "avance");
            $(".boxCompoDesglose").show();
            $(".boxTituloListado").hide();
            $("#sankey_basic").empty();
    ***REMOVED*** else if (tipo == "gastoAdminCentral") {
            $("#divListadoRecursosObje").hide();
            $("#divListadoRecursosObjeEnteNoCentral").hide();
            $("#divListadoRecursosObjeEnte").show();
            

    ***REMOVED***
        else if (tipo == "gastoDescentralizado") {
            $("#divListadoRecursosObjeEnte").hide();
            $("#divListadoRecursosObjeEnteNoCentral").show();
            $("#divListadoRecursosAdminNoCentral").show();
            $("#divListadoRecursosObje").hide();
           
    ***REMOVED***
        else {

            //sankey
            $("#iconList").attr("class", "txt-bold icRD_blue");
            $("#iconTree").attr("class", "txt-bold icGrap_blue");
            $("#iconSankey").attr("class", "txt-bold icSankey");

            $("#divGraphRecursosObj").hide();
            $("#divListadoRecursosObje").hide();
            $("#divGraphRecursosObj").children().remove();

            $(".boxTituloListado").hide();
            $("#sankey_basic").empty();
            ObtenerDatosArticulo(tipoEmergencia);
    ***REMOVED***
***REMOVED***);
    $(".tipo_presupuesto").on('click',function (e) {
        var codigo = $(this).attr('codigo');
        $(".tipo_presupuesto").removeClass("activo");
        $(this).addClass("activo");
        $("#divListadoRecursosObje").show();

        if (codigo == "gastoAdminCentral") {
            $("#divListadoRecursosObje").hide();
            $("#divListadoRecursosObjeEnteNoCentral").hide();
            $("#divListadoRecursosObjeEnte").show();
    ***REMOVED***
        else if (codigo == "gastoDescentralizado") {
            $("#divListadoRecursosObjeEnte").hide();
            $("#divListadoRecursosObjeEnteNoCentral").show();
            $("#divListadoRecursosObje").hide();

    ***REMOVED***

***REMOVED***);
***REMOVED***
function configuraFiltro_Donaciones() {
    $('#enlaceDonaciones').on('click', function () {
        var val_Sel = $('#filtro_donaciones li.selected').attr('codigo');
        if ($.trim(val_Sel) != "" && val_Sel != undefined) {
            if (val_Sel == "donadores") {
                var enlace_url = "../covid/PerfilDonador";
                location.href = enlace_url;
        ***REMOVED*** else {
                var enlace_url = "../covid/PerfilBeneficiario";
                location.href = enlace_url;
        ***REMOVED***
    ***REMOVED***
***REMOVED***);

***REMOVED***
function ObtenerDatosArticulo(tipoEmergencia) {

    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: {
            typeEmergencyId: tipoEmergencia
      ***REMOVED***

        url: "/api/ServiciosCovid/ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia/",// + tipoEmergencia,
        cache: false,
        success: function (result) {
            if (result.status == true) {
                var data = result.distribucionItem;
                if (data.length > 0) {
                    var datos = obtMatrizData(data);
                    $("#sankey_basic").html("");
                    graphSankey("sankey_basic", datos);
                    loadRecursosPorObjeto(objPerContratos, "divGraphRecursosArticulos", "avance");  
            ***REMOVED***

        ***REMOVED*** else {
                alert("Error4: " + result.message, function () {

            ***REMOVED***);
        ***REMOVED***

      ***REMOVED***
        error: function (response) {
            alert("Error5: " +response.responseText);
      ***REMOVED***
        failure: function (response) {
            alert("Error6: " +response.responseText);
    ***REMOVED***
***REMOVED***);

***REMOVED***
function graphSankey(contenedor, datos) {
    var height_aux = 0;
    var width_aux = 1100;
    var units = "millones";
    var cant_elementos = 10;

    let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;
    if ($(window).innerWidth() <= width_aux || isMobile) {
        width_aux = 1100;
***REMOVED*** else {
        width_aux = $(".container").innerWidth();
***REMOVED***

    var margin = { top: 10, right: 10, bottom: 10, left: 10 ***REMOVED***,
        width = width_aux - 20 - margin.left - margin.right,
        height = ((cant_elementos) * 50) - margin.top - margin.bottom;
    var format = function (d) {
        return "RD $ " + formatMoney((d),0, '.', ',') + " " + units;
  ***REMOVED***
    color = d3.scale.category20();
    // append the svg canvas to the page
    var svg = d3.select("#" + contenedor).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(30)
        .nodePadding(20)
        .size([width, height]);
    var path = sankey.link();
    loadData(function (graph) {
        // contents of the function passed to d3.json                   
        var nodeMap = {***REMOVED***;
        graph.nodes.forEach(function (x) { nodeMap[x.name] = x; ***REMOVED***);
        graph.links = graph.links.map(function (x) {
            return {
                source: nodeMap[x.source],
                target: nodeMap[x.target],
                value: x.value
        ***REMOVED***;
    ***REMOVED***);
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);
        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
                //return 10;
        ***REMOVED***)
            .sort(function (a, b) { return b.dy - a.dy; ***REMOVED***);
        // add the link titles
        link.append("title")
            .text(function (d) {
                var destino_aux = d.target.name;
                var origen_aux = d.source.name;
                var vec_destino = d.target.name.split("_");
                var vec_origen = d.source.name.split("_");
                if (vec_destino.length > 0) {
                    destino_aux = vec_destino[1];
            ***REMOVED***
                if (vec_origen.length > 0) {
                    origen_aux = vec_origen[1];
            ***REMOVED***
                return origen_aux + " → " +
                    destino_aux + "\n" + format(d.value);
        ***REMOVED***);
        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
        ***REMOVED***)
            .call(d3.behavior.drag()
                .origin(function (d) { return d; ***REMOVED***)
                .on("dragstart", function () {
                    this.parentNode.appendChild(this);
            ***REMOVED***)
                .on("drag", dragmove));
        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) { return d.dy; ***REMOVED***)
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
        ***REMOVED***)
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
        ***REMOVED***)
            .append("title")
            .text(function (d) {
                var nombre = d.name;
                var vec_aux = nombre.split("_");
                if (vec_aux.length > 0) {
                    nombre = vec_aux[1];
            ***REMOVED***
                return nombre + "\n" + format(d.value);
        ***REMOVED***);
        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; ***REMOVED***)
            .attr("dy", ".2em")
            .style("font-size", "10px")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) {
                var nombre = d.name;
                var vec_aux = nombre.split("_");
                if (vec_aux.length > 0) {
                    nombre = vec_aux[1];
            ***REMOVED***

                return nombre;
        ***REMOVED***)
            .filter(function (d) { return d.x < width / 2; ***REMOVED***)
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + (
                    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                ) + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);
    ***REMOVED***
  ***REMOVED*** datos);
***REMOVED***
function loadData(cb, datos) {
    cb(datos)
***REMOVED***
function obtMatrizData(data) {
    var cant_nodos_1 = 0;
    var cant_nodos_2 = 0;
    var cant_nodos_3 = 0;
    var cant_nodos_fin = 0;
    var obj_nodos = [];
    var obj_links = [];
    $.each(data, function (key, value) {
        cant_nodos_1 += 1;
        var test = false;
        var obj_aux = { name: value.nombre ***REMOVED***;
        var nomFuente = value.nombre;
        obj_nodos.push(obj_aux);
        $.each(value.detalles, function (key, value) {
            cant_nodos_2 += 1;
            var nomOrganismo = value.nombre;
            var valor_organismo = (value.avance / 1000000);

            //NomOrganismo
            test = obj_nodos.some(item => item.name === value.nombre);
            if (test == false) {
                obj_aux = { name: value.nombre ***REMOVED***;
                obj_nodos.push(obj_aux);
        ***REMOVED***
            var objIndex = obj_links.findIndex((obj => obj.target == nomOrganismo && obj.source == nomFuente));
            if (objIndex > -1) {
                obj_links[objIndex].value = obj_links[objIndex].value + valor_organismo;
        ***REMOVED*** else {
                var obj_links_aux = { source: nomFuente, target: nomOrganismo, value: valor_organismo ***REMOVED***
                obj_links.push(obj_links_aux);
        ***REMOVED***

            $.each(value.detalles, function (key, value) {
                //NomPrograma
                cant_nodos_3 += 1;
                var nomPrograma = value.nombre;
                var valor_programa = (value.avance / 1000000);
                test = obj_nodos.some(item => item.name === value.nombre);
                if (test == false) {
                    obj_aux = { name: value.nombre ***REMOVED***;
                    obj_nodos.push(obj_aux);
            ***REMOVED***
                var objIndex = obj_links.findIndex((obj => obj.target == nomPrograma && obj.source == nomOrganismo));
                if (objIndex > -1) {
                    obj_links[objIndex].value = obj_links[objIndex].value + valor_programa;
            ***REMOVED*** else {
                    var obj_links_aux = { source: nomOrganismo, target: nomPrograma, value: valor_programa ***REMOVED***
                    obj_links.push(obj_links_aux);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***);
    cant_nodos_fin = cant_nodos_1;
    if (cant_nodos_2 > cant_nodos_1) {
        cant_nodos_fin = cant_nodos_2;
***REMOVED***
    if (cant_nodos_3 > cant_nodos_2) {
        cant_nodos_fin = cant_nodos_3;
***REMOVED***
    var datos_final =
    {
        "links": obj_links,
        "nodes": obj_nodos,
        "cant_nodos_fin": {
            cant: cant_nodos_fin
    ***REMOVED***
***REMOVED***;

    return datos_final;
***REMOVED***
function separar_miles(num) {
    var num_aux = num;
    if (num != "0" && num != undefined) {
        num_aux = num.replace(/\./g, '');
        if (!isNaN(num_aux)) {
            num_aux = num_aux.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3***REMOVED***)/g, '$1.');
            num_aux = num_aux.split('').reverse().join('').replace(/^[\.]/, '');
    ***REMOVED***
***REMOVED***
    return num_aux;
***REMOVED***
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3***REMOVED***)+(?!\d))/g, ".");
    return parts.join(".");
***REMOVED***
function getContratosRP() {

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/api/serviciosContratistas/GetInformacionContratosRPCovid',
        cache: false,
        success: function (result) {
            if (result.status == true) {

                if (result.numContratos > 0) {
                    $("#cantidadRP").html("&nbsp;&nbsp;&nbsp;" + result.numContratos);
                    $("#totalRP").html("RD $ " + formatMoney(parseFloat(result.valorContratos / 1000000),0, ".", ",") + tituloMillones(parseFloat(result.valorContratos / 1000000).toFixed(0)));
            ***REMOVED***
        ***REMOVED*** else {
                alert("Message: " + result.message);
        ***REMOVED***
      ***REMOVED***
        error: function (response) {

            alert("Response: " + response.responseText);
      ***REMOVED***
        failure: function (response) {

            alert("Response F: " + response.responseText);
    ***REMOVED***
***REMOVED***);
***REMOVED***
function convertirMillones(num) {
    return num > 999999 ? (num / 1000000).toFixed(0) : num

***REMOVED***
function tituloMillones(num) {
    return num > 999999 ? " Millones" : ""
***REMOVED***
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3***REMOVED***)+(?!\d))/g, ".");
    return parts.join(".");
***REMOVED***
function MaysPrimera(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
***REMOVED***
function loadRecursosPorObjeto(objData, divContenedor, tipo_desglose) {
    $("#" + divContenedor).empty();
    var textoExpandir = "Clic para expandir";
    var data_filter = [];
    if (objData != undefined && objData != null) {
        data_filter = objData;

        for (var i = 0; i < data_filter.length; i++) {
            data_filter[i].labelGroup = data_filter[i].labelGroup.replace(",", " ");
            data_filter[i].label = data_filter[i].label.replace(",", " ");
            data_filter[i].label_inf = data_filter[i].label_inf.replace(",", " ");
            data_filter[i].label_nivel4 = data_filter[i].label_nivel4.replace(",", " ");

            data_filter[i].rawValue = parseFloat(data_filter[i].rawValue);

    ***REMOVED***

        var paleta = {
            colores: [
                "#e6e6e6",
                "#c4e5ee",
                "#fcd96c",
                "#3e5174",
                "#ea5670",
                "#999999",
                "#1c717f",
                "#64b5e2",
                "#7fcbdc",
                "#e7753d"
            ]
    ***REMOVED***;

        function colorPorPosicion(posicion) {
            return paleta.colores[posicion % paleta.colores.length];
    ***REMOVED***

        grafica = new d3plus.Treemap()
            .select("#" + divContenedor)

            .shapeConfig({
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
              ***REMOVED***
                fill: function (d, i) {
                    return colorPorPosicion(i);
            ***REMOVED***
        ***REMOVED***)
            .translate(function (d) {
                var traduc_aux = d;
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
            ***REMOVED*** else if (d === "Click to Expand") {
                    traduc_aux = "Clic para expandir";
            ***REMOVED*** else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
            ***REMOVED*** else {
                    traduc_aux = d;
            ***REMOVED***
                return traduc_aux;
        ***REMOVED***)
            .config({

                data: data_filter,
                groupBy: ["labelGroup", "label", "label_inf", "label_nivel4"],
                height: 500,
                tooltipConfig: {
                    title: function (d) {
                        var depth_aux = grafica.depth();
                        var longitud_tooltip = 80;
                        var cad = '';
                        switch (depth_aux) {
                            case 0:
                                cad = d.labelGroup;
                                break;
                            case 1:
                                cad = d.label;
                                break;
                            case 2:
                                cad = d.label_inf;
                            case 3:
                                cad = d.label_nivel4;
                            default:
                                cad = d.labelGroup;
                    ***REMOVED***

                        return cad;
                  ***REMOVED***
                    tbody: [
                        [function (d) {
                            var valor = d["rawValue"] / 1000000;
                            var cad = "";
                            cad += "<span>Gastos devengados " + "$ " + formatMoney(valor, 0, '.', ',').toString() + " Millones" + "</span></br>";
                            return cad;
                    ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: "",
            ***REMOVED***
        ***REMOVED***)
            .sum("rawValue")
            .depth(0)
            .legend(false)
            .render();
***REMOVED***





***REMOVED***
function loadListadoRecursosPorObjeto(objData, divContenedor) {
    
    $("#divGraphRecursosObj").append("<div><span>Listado</span></div>")
***REMOVED***
function getContratosCovid() {

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/api/serviciosContratistas/GetInformacionContratosCovidHome',
        cache: false,
        success: function (result) {
            if (result.status == true) {

                if (result.NumContratosActivos > 0) {
                    $("#cantidadRP").html("&nbsp;&nbsp;&nbsp;" + result.NumContratosActivos);
                    $("#totalRP").html("RD $ " + formatMoney(parseFloat(result.ValorTotalContratosActivos / 1000000),0, ".", ",") + tituloMillones(parseFloat(result.ValorTotalContratosActivos).toFixed(0)));
            ***REMOVED***

        ***REMOVED*** else {
                alert("Message: " + result.message);
        ***REMOVED***
      ***REMOVED***
        error: function (response) {

            alert("Response: " + response.responseText);
      ***REMOVED***
        failure: function (response) {

            alert("Response F: " + response.responseText);
    ***REMOVED***
***REMOVED***);

***REMOVED***


function formatMoney(number, c, d, t) {
    var n = number,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
***REMOVED***
function seteaListado() {
    $('#accordion .collapse').removeClass("in");
    $("#divGraphRecursosObj").hide();
    $("#divListadoRecursosObje").show();
    $(".boxCompoDesglose").hide();
    $(".boxTituloListado").show();
    $("#sankey_basic").empty();
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

        ***REMOVED***

    ***REMOVED***



***REMOVED*** else {
        $('#accordion .collapse').removeClass("in");
***REMOVED***


***REMOVED***


