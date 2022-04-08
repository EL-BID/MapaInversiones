$("#divGraphRecursosObj").empty();
$("#btnAtrasGrafica").hide();
var globales = [];
GetRecursosPorObjeto();
configuraAtras();
GraficaSankey();
pruebaTreemap();

function pruebaTreemap() {
    var data = [
        { parent: "Group 1", id: "alpha", value: 29 ***REMOVED***,
        { parent: "Group 1", id: "beta", value: 10 ***REMOVED***,
        { parent: "Group 1", id: "gamma", value: 2 ***REMOVED***,
        { parent: "Group 2", id: "delta", value: 29 ***REMOVED***,
        { parent: "Group 2", id: "eta", value: 25 ***REMOVED***
    ];


    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/servicioshome/GetRecursosPerPlan",
        type: "GET"

***REMOVED***).done(function (data) {
        if (data.recursosPerObjeto != null) {
            new d3plus.Treemap()
                .data(data)
                .select("#treemapEjemplo")
                .groupBy(["labelGroup", "label","label_inf"])
                .sum("rawValueDouble")
                .render();
            
    ***REMOVED***


***REMOVED***).fail(function (handleError) {
        // Some function

***REMOVED***);


    

***REMOVED***

$("#btnDescargarPng").click(function () {
    toImage();
    
***REMOVED***);

function toImage() {
    var dom = document.getElementById("divGraphRecursosObj");
    d3plus.saveElement(dom, { filename: "my-chart", type: "png" ***REMOVED***)
***REMOVED***


//function pruebaAjaxGet() {
//    $.ajax({
//        url: "api/servicioshome/obtPais/america",
//        type: "GET"

//***REMOVED***).done(function (data) {
        

//***REMOVED***).fail(function (handleError) {
//        // Some function
        
//***REMOVED***);
//***REMOVED***

//------------------------------------------------------------------------
function GraficaSankey() {
    //var codigoEntidad = document.getElementById("codigoEntidadId").innerHTML;
    var codigoEntidad = "12-1";
    var param = "codEntidad=" + codigoEntidad;
    $.ajax({
        url: "api/servicioshome/GetGraficaSankey",
        type: "GET",
        data: {
            codEntidad: codigoEntidad
    ***REMOVED***
***REMOVED***).done(function (result) {
        if (result.status == true) {
            var data = result.distribucionObjetivos;
            if (data.length > 0) {
                var datos = obtMatrizData(data);
                $("#sankey_basic").html("");
                graphSankeyPloty(datos);
                $("#sankey_basic_old").html("");
                graphSankey("sankey_basic_old", datos);

        ***REMOVED***

    ***REMOVED*** else {
            bootbox.alert("Error: " + result.message, function () {

        ***REMOVED***);
    ***REMOVED***
        

***REMOVED***).fail(function (handleError) {
        //alert("error");
***REMOVED***);
***REMOVED***



function graphSankey(contenedor, datos) {

    var height_aux = 0;
    var width_aux = 1100;
    var units = "millones";
    var cant_elementos = 5;
    if (datos != undefined && datos != null) {
        if (datos.cant_nodos_fin.cant > 10) {
            cant_elementos = datos.cant_nodos_fin.cant;
    ***REMOVED***
        
***REMOVED***

    let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;


    if ($(window).innerWidth() <= width_aux || isMobile) {
        width_aux = 1100;
***REMOVED*** else {
        width_aux = $(".container").innerWidth();
***REMOVED***


    var margin = { top: 10, right: 10, bottom: 10, left: 10 ***REMOVED***,
        width = width_aux - 20 - margin.left - margin.right,
        height = ((cant_elementos) * 25) - margin.top - margin.bottom;


    var format = function (d) {
        return "";
        //return "₡ " + (d).formatMoney(0, '.', '.') + " " + units;
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
        .nodeWidth(25)
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
            .layout(632);

        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
                //return 20;
        ***REMOVED***)
            .sort(function (a, b) { return b.dy - a.dy; ***REMOVED***);

        // add the link titles
        link.append("title")
            .text(function (d) {
                var destino_aux = d.target.name;
                var origen_aux = d.source.name;
                var vec_destino = d.target.name.split("|");
                var vec_origen = d.source.name.split("|");
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
                var vec_aux = nombre.split("|");
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
            .html(function (d) {
                var nombre = d.name;
                var vec_aux = nombre.split("|");
                if (vec_aux.length > 0) {
                    nombre = vec_aux[1];
            ***REMOVED***

                var long = nombre.length;
                var bandera = false;
                var long_aux = "";
                if (long > 50) {
                    long_aux = 50;
                    bandera = true;
            ***REMOVED*** else {
                    long_aux = long;
            ***REMOVED***


                var nombre_aux = nombre.substring(0, long_aux);
                if (bandera == true) {
                    nombre_aux = nombre_aux + "...";
            ***REMOVED***

                return nombre_aux;

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

function graphSankeyPloty(datos) {
    var height_aux = 0;
    var width_aux = 1100;
    var cant_elementos = 5;
    if (datos != undefined && datos != null) {
        if (datos.cant_nodos_fin.cant > 10) {
            cant_elementos = datos.cant_nodos_fin.cant;
    ***REMOVED***
***REMOVED***

    let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;


    if ($(window).innerWidth() <= width_aux || isMobile) {
        width_aux = 1100;
***REMOVED*** else {
        width_aux = $(".container").innerWidth();
***REMOVED***

    var margin = { top: 10, right: 10, bottom: 10, left: 10 ***REMOVED***,
        width = width_aux - 20 - margin.left - margin.right,
        height = ((cant_elementos) * 35) - margin.top - margin.bottom;


    var vec_labels = [];
    var vec_source = [];
    var vec_target = [];
    var vec_valores = [];

    var nodos = datos.nodes;

    $.each(datos.nodes, function (index, value) {
        var nombre = value.name;
        var vec_aux = nombre.split("|");
        if (vec_aux.length > 0) {
            nombre = vec_aux[1];
    ***REMOVED***

        var long = nombre.length;
        var bandera = false;
        var long_aux = "";
        if (long > 50) {
            long_aux = 50;
            bandera = true;
    ***REMOVED*** else {
            long_aux = long;
    ***REMOVED***


        var nombre_aux = nombre.substring(0, long_aux);
        if (bandera == true) {
            nombre_aux = nombre_aux + "...";
    ***REMOVED***

        vec_labels.push(nombre_aux);
***REMOVED***);

    $.each(datos.links, function (index, value) {
        const filtered_source = nodos.filter(x =>
            x.name == value.source
        );
        if (filtered_source.length > 0) {
            vec_source.push(filtered_source[0].posicion);
    ***REMOVED***

        const filtered_target = nodos.filter(x =>
            x.name == value.target
        );

        if (filtered_target.length > 0) {
            vec_target.push(filtered_target[0].posicion);
    ***REMOVED***
        vec_valores.push(value.value.toFixed(0));

***REMOVED***);

    var data = {
        type: "sankey",
        domain: {
            x: [0, 1],
            y: [0, 1]
      ***REMOVED***
        orientation: "h",
        node: {
            pad: 15,
            thickness: 15,
            line: {
                color: "black",
                width: 0.5
          ***REMOVED***
            label: vec_labels,
            hoverinfo: "all",
            hovertemplate: "%{label***REMOVED***",
      ***REMOVED***

        link: {
            source: vec_source,
            target: vec_target,
            value: vec_valores,
            hovertemplate: "%{source.label***REMOVED***-->%{target.label***REMOVED***",
            hoverlabel: {
                bgcolor: "#ffffff"
          ***REMOVED***
            color: "#d9d9d9",

    ***REMOVED***
***REMOVED***

    var data = [data]

    var layout = {
        width: width,
        height: height,
        hoverlabel: {
            bgcolor: "#ffffff"
      ***REMOVED***
        font: {
            size: 10
    ***REMOVED***
***REMOVED***

    const config = {
        displayModeBar: false, // this is the line that hides the bar.
***REMOVED***;

    Plotly.react('sankey_basic', data, layout, config);

***REMOVED***

function obtMatrizData(data) {
    var cant_nodos_1 = 0;
    var cant_nodos_2 = 0;
    var cant_nodos_3 = 0;
    var cant_nodos_fin = 0;
    var obj_nodos = [];
    var obj_links = [];
    var indexLink = -1;
    $.each(data, function (key, value) {
        //Eje
        indexLink+=1;
        cant_nodos_1 += 1;
        var test = false;
        var obj_aux = { posicion: indexLink, name: value.nombre ***REMOVED***;
        var nomEje = value.nombre;
        obj_nodos.push(obj_aux);
        $.each(value.detalles, function (key, value) {
            //Estrategicos
            cant_nodos_2 += 1;
            
            var nomEstrategico= value.nombre;
            var valor_estrategico = (value.presupuesto / 1000000);

            test = obj_nodos.some(item => item.name === nomEstrategico);
            if (test == false) {
                indexLink += 1;
                obj_aux = { posicion: indexLink, name: nomEstrategico ***REMOVED***;
                obj_nodos.push(obj_aux);
        ***REMOVED***

            var objIndex = obj_links.findIndex((obj => obj.target == nomEstrategico && obj.source == nomEje));
            if (objIndex > -1) {
                obj_links[objIndex].value = obj_links[objIndex].value + valor_estrategico;
        ***REMOVED*** else {
                var obj_links_aux = { source: nomEje, target: nomEstrategico, value: valor_estrategico ***REMOVED***
                obj_links.push(obj_links_aux);
        ***REMOVED***


            $.each(value.detalles, function (key, value) {
                cant_nodos_3 += 1;
                //ObjEspecificos
                cant_nodos_fin += 1;
                var nomEspecifico = value.nombre;
                var valor_especifico = (value.presupuesto / 1000000);
                test = obj_nodos.some(item => item.name === nomEspecifico);
                if (test == false) {
                    indexLink += 1;
                    obj_aux = { posicion: indexLink, name: nomEspecifico ***REMOVED***;
                    obj_nodos.push(obj_aux);
            ***REMOVED***

                var objIndex = obj_links.findIndex((obj => obj.target == nomEspecifico && obj.source == nomEstrategico));
                if (objIndex > -1) {
                    obj_links[objIndex].value = obj_links[objIndex].value + valor_especifico;
            ***REMOVED*** else {
                    obj_links_aux = { source: nomEstrategico, target: nomEspecifico, value: valor_especifico ***REMOVED***
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



//----------------------------------------------------------------
function GetRecursosPorObjeto() {
    $(".d3plus-viz-back").hide();
    $("#divGraphRecursosObj").children().remove();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/servicioshome/GetRecursosPerPlan",
        type: "GET"

***REMOVED***).done(function (data) {
        if (data.recursosPerObjeto != null) {
            globales = data.recursosPerObjeto;
            var agrupador = ["rawValue_asoc","labelGroup", "label", "label_inf"];
            loadRecursosPorObjeto(data.recursosPerObjeto, "divGraphRecursosObj", agrupador,0);
    ***REMOVED***
       

***REMOVED***).fail(function (handleError) {
        // Some function
        
***REMOVED***);
***REMOVED***


function filtrarLabel(data, nivel_ant) {
    var filtrados = data;
    var labelGroup = $("#divGraphRecursosObj").attr("labelGroup");
    var label = $("#divGraphRecursosObj").attr("label");
    var label_inf = $("#divGraphRecursosObj").attr("label_inf");

    if (nivel_ant == 1) {
        if (labelGroup != null) {
            filtrados = jQuery.grep(data, function (n, i) {
                return (n.labelGroup == labelGroup.toString());
        ***REMOVED***);
    ***REMOVED***

***REMOVED*** else if (nivel_ant == 0) {
        return data;
***REMOVED***
   
    return filtrados;
***REMOVED***


function loadRecursosPorObjeto(objData, divContenedor, agrupador,profundidad) {
    $("#divGraphRecursosObj").empty();

    if (profundidad >= 1) {
        $("#btnAtrasGrafica").show();
***REMOVED*** else {
        $("#btnAtrasGrafica").hide();
***REMOVED***
   
    if (objData != undefined && objData != null) {
        var grupos = globales.map(item => item.rawValue_asoc)
            .filter((value, index, self) => self.indexOf(value) === index);

        var grafica = new d3plus.Treemap()
            .select("#" + divContenedor)
            .data(objData)
            .groupBy(agrupador)
            .shapeConfig({
                labelConfig: {
                    fontFamily: "sans-serif",
                    align: "center",
                    size: 10,
                    transform: "capitalize"
            ***REMOVED***
                ,fill: function (d,index) {
                    var pos = grupos.indexOf(d.rawValue_asoc);
                    return assignColor(d.rawValue_asoc,pos);
           ***REMOVED***
                   
        ***REMOVED***)
            .on("click", function (d) {
                //niveles visibles 0,1,2
                $(".d3plus-viz-back").hide();
                
                if (d.labelGroup != "") {
                    $("#divGraphRecursosObj").attr("labelGroup", d.labelGroup);
                    if (Array.isArray(d.label) == true) {
                        //hizoclic nivel 0 para ir al nivel 1
                        $("#divGraphRecursosObj").attr("nivel", 1);
                        $("#divGraphRecursosObj").attr("nivel_ant", 0);
                ***REMOVED*** else {
                        //hizo clic estando en nivel 1
                        $("#divGraphRecursosObj").attr("label", d.label);
                        if (Array.isArray(d.label_inf)) {
                            //para ir a nivel 2
                            $("#divGraphRecursosObj").attr("nivel", 2);
                            $("#divGraphRecursosObj").attr("nivel_ant", 1);
                    ***REMOVED*** else {
                            //se encuentra en nivel 2 no va a ningun otro nivel 
                            $("#divGraphRecursosObj").attr("label_inf", d.label_inf);
                            $("#divGraphRecursosObj").attr("nivel", 2);
                            $("#divGraphRecursosObj").attr("nivel_ant", 1);

                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
                var nivel_actual = $("#divGraphRecursosObj").attr("nivel");
                if (nivel_actual >= 1) {
                    $("#btnAtrasGrafica").show();
            ***REMOVED*** else {
                    $("#btnAtrasGrafica").hide();
            ***REMOVED***

        ***REMOVED***)
            .layoutPadding(2)
            .config({
                tooltipConfig: {
                    title: function (d) {
                        var longitud = 80;
                        var cad = recortarNombre(d.labelGroup,longitud);
                        if (Array.isArray(d.label)) {
                            cad = recortarNombre(d.labelGroup, longitud);
                    ***REMOVED*** else {
                            cad = d.label;
                            if (Array.isArray(d.label_inf)) {
                                cad = recortarNombre(d.label, longitud);
                        ***REMOVED*** else {
                                cad = d.label_inf;
                                if (Array.isArray(d.label_nivel4)) {
                                    cad = recortarNombre(d.label_inf, longitud);
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                        
                       
                        return cad;
                        //return "";
                  ***REMOVED***
                    tbody: [
                        [function (d) {
                            var valor = d["rawValueDouble"] / 1000000;
                            var cad = "";
                            if (Array.isArray(d.label)) {
                                cad += "<span>Obj Estratégicos (" + d.label.length + ")</span></br>";
                        ***REMOVED***
                            if (Array.isArray(d.label_inf)) {
                                cad += "<span>Obj Específicos (" + d.label_inf.length + ")</span></br>";
                        ***REMOVED***
                            if (Array.isArray(d.label_nivel4)) {
                                cad += "<span>Entidades que aportan (" + d.label_nivel4.length + ")</span></br>";
                        ***REMOVED***
                            cad += "<span>Recursos asig. " + "₲ " + valor.formatMoney(0, ',', '.').toString() + " Millones" + "</span></br>";
                            return cad;
                    ***REMOVED***]
                    ]
              ***REMOVED***
                yConfig: {
                    title: "",
            ***REMOVED***
        ***REMOVED***)
            .sum("rawValueDouble")
            .depth(1)
            .legend(false)
            .color("labelGroup")
            .render();

            


***REMOVED***
    
***REMOVED***

function configuraAtras() {
    $("#btnAtrasGrafica").bind('click', function () {
        var nivel_ant = $("#divGraphRecursosObj").attr("nivel_ant");
        var profundidad = parseInt(nivel_ant);
        var agrupador = ["labelGroup", "label", "label_inf"];


        if (profundidad == 0) {
            //regresa a nivel 0 labelGroup
            agrupador = ["labelGroup", "label", "label_inf"];
            $("#divGraphRecursosObj").attr("label", "");
            $("#divGraphRecursosObj").attr("labelGroup", "");
            $("#divGraphRecursosObj").attr("label_inf", "");

            $("#divGraphRecursosObj").attr("nivel", 0);
            $("#divGraphRecursosObj").attr("nivel_ant", 0);

    ***REMOVED*** else if (profundidad == 1) {
            //regresa a nivel 1 Label
            agrupador = ["label"];
            $("#divGraphRecursosObj").attr("label_inf", "");
            $("#divGraphRecursosObj").attr("label", "");

            $("#divGraphRecursosObj").attr("nivel_ant", 0);
            $("#divGraphRecursosObj").attr("nivel", 1);

    ***REMOVED*** else {
            $("#divGraphRecursosObj").attr("label_inf", "");
            agrupador = ["labelGroup", "label", "label_inf"];

            $("#divGraphRecursosObj").attr("nivel_ant", 1);
            $("#divGraphRecursosObj").attr("nivel", 2);
    ***REMOVED***
        

        var datos_aux = filtrarLabel(globales, profundidad);

        $("#divGraphRecursosObj").attr("nivel_ant", profundidad - 1);
        loadRecursosPorObjeto(datos_aux, "divGraphRecursosObj", agrupador, profundidad);

***REMOVED***);
***REMOVED***

function recortarNombre(nombre,longitud) {
    var aux = nombre;
    if (nombre != undefined && nombre != null) {
        if (nombre.length > longitud) {
            aux = nombre.substr(0, longitud) + "...";
        ***REMOVED***
***REMOVED***
    
    return aux;
***REMOVED***

function assignColor(idEje,pos) {
    var colores_default = ["#b1861b", "#24539f", "#c8703c", "#429670"];
    var colores = [{ id: 1, color: "#b1861b" ***REMOVED***, { id: 2, color: "#24539f" ***REMOVED***, { id: 3, color: "#c8703c" ***REMOVED***, { id: 4, color: "#429670" ***REMOVED***];
    var filtered = colores.filter(id => id == idEje);
    if (filtered.length > 0) {
        return filtered[0].color;
***REMOVED*** else {
        return colores_default[pos];
***REMOVED***
    
***REMOVED***
//----------------------------------------------------------
function GetRecursosAsignados() {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/servicioshome/GetRegAsignados",
        type: "GET"

***REMOVED***).done(function (data) {
        var aux = data;
        if (data.recursosAsignados != null) {
            graphRecursosAsigLinePlot(data.recursosAsignados,"divRecursosAsignados");
    ***REMOVED***

***REMOVED***).fail(function (handleError) {
        // Some function

***REMOVED***);
***REMOVED***



function graphRecursosAsigLinePlot(datacontenido, divContenedor) {
    var myData = [
        { labelGroup: "Desarrollo sostenible", label: "meta", periodo: 2019, rawValue: 1000, porcentaje: -1 ***REMOVED***,
        { labelGroup: "Desarrollo sostenible", label: "meta", periodo: 2020, rawValue: 5000 , porcentaje: -1***REMOVED***,
        { labelGroup: "Desarrollo sostenible", label: "meta", periodo: 2021, rawValue: 3800 ,  porcentaje:-1 ***REMOVED***,
        { labelGroup: "Desarrollo sostenible", label: "avance", periodo: 2019, rawValue: 800, porcentaje: 30 ***REMOVED***,
        { labelGroup: "Desarrollo sostenible", label: "avance", periodo: 2020, rawValue: 3200 , porcentaje: 30 ***REMOVED***,
        { labelGroup: "Desarrollo sostenible", label: "avance", periodo: 2021, rawValue: 3000 , porcentaje: 40 ***REMOVED***
        
    ];


    new d3plus.LinePlot()
        .select("#" + divContenedor)
        .config({
            data: datacontenido,
            groupBy: "label",
            lineMarkers: true,
            lineMarkerConfig: {
                r: 6
          ***REMOVED***
            x: "periodo",
            y: "rawValue",
            yConfig: {
                title: "% PGN",
                titleConfig: {
                    fontColor: "green"
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***)
        .tooltipConfig({
            body: function (d) {
                var table = "<table class='tooltip-table'>";
                var cad_aux = "Valor";
                var valor = d.rawValue + "M";
                if (d.label == "META") {
                    cad_aux = "Meta";
            ***REMOVED*** else {
                    cad_aux = "Avance";
            ***REMOVED***
                if (d.porcentaje > 0) {
                    valor += " (" + d.porcentaje + "%)";
            ***REMOVED***
                table += "<tr><td class='title'>" + cad_aux + ":</td > <td class='data'>" + valor + "</td></tr > ";
               
                table += "</table>";
                return table;
          ***REMOVED***
            footer: function (d) {
                return "";
          ***REMOVED***
            title: function (d) {
                var txt = d.labelGroup;
                return txt;
        ***REMOVED***
    ***REMOVED***)
        .render();
***REMOVED***


function getGraficoBarrasSectores() {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/servicioshome/GetRegAsignadosPerSector",
        type: "GET"

***REMOVED***).done(function (data) {
        var aux = data;
        if (data.recursosBySector != null) {
            graficoBarrasSector(data.recursosBySector, "divRecursosAsignadosPerSector");
    ***REMOVED***

***REMOVED***).fail(function (handleError) {
        // Some function

***REMOVED***);


***REMOVED***


function graficoBarrasSector(dataContenido,divContenedor) {
    var data = [
        { id: "alpha", x: 4, y: 7 ***REMOVED***,
        { id: "alpha", x: 5, y: 25 ***REMOVED***,
        { id: "alpha", x: 6, y: 13 ***REMOVED***,
        { id: "alpha", x: 7, y: 9 ***REMOVED***,
        { id: "beta", x: 4, y: 17 ***REMOVED***,
        { id: "beta", x: 5, y: 8 ***REMOVED***,
        { id: "beta", x: 6, y: 13 ***REMOVED***,
        { id: "beta", x: 7, y: 10 ***REMOVED***,
        { id: "gamma", x: 4, y: 5 ***REMOVED***,
        { id: "gamma", x: 5, y: 0 ***REMOVED***,
        { id: "gamma", x: 6, y: 10 ***REMOVED***,
        { id: "gamma", x: 7, y: 9 ***REMOVED***
    ];

    new d3plus.BarChart()
        .data(data)
        .barPadding(0)
        .groupPadding(40)
        .render();

    new d3plus.BarChart()
        .select("#" + divContenedor)
        .config({
            data: dataContenido,
            groupBy: "labelGroup",
            x: "label",
            y: "rawValue",
            legend: false
    ***REMOVED***)
        .barPadding(0)
        .groupPadding(40)
        .render();
***REMOVED***



function loadRecursosPorObjetoOld(objData, divContenedor, tipo_desglose) {
    if (objData != undefined && objData != null) {
        for (var i = 0; i < objData.length; i++) {
            objData[i].value = parseFloat(objData[i].value);
            objData[i].rawValue = parseFloat(objData[i].rawValue);

    ***REMOVED***
        var visualization = d3plus.viz()
            .container("#" + divContenedor)
            .data({
                "value": objData,
                "stroke": { "width": 5 ***REMOVED***,
                "opacity": 0.9
        ***REMOVED***)

            .type({ "value": "tree_map", "mode": "sqarify" ***REMOVED***)
            .id({ "value": ["labelGroup", "label", "label_inf", "label_nivel4"], "grouping": true ***REMOVED***)
            .depth(0)
            .size("rawValue")
            .font({ "family": "inherit", "align": "center", "size": 14, "transform": "capitalize" ***REMOVED***)
            .legend(false)
            .title({
                "value": "",
                "padding": 5,
                "total": {
                    "font": {
                        "size": 16
                  ***REMOVED***
                    "value": true
              ***REMOVED***
                "sub": {
                    "padding": 5,
                    "font": {
                        "size": 14
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***)
            .format({
                "locale": "es_ES",
                "number": function (number, params) {
                    var formatted = d3plus.number.format(number, params);
                    if (params.key === "rawValue") {
                        return "₲ " + numberWithCommas(parseFloat(number / 1000000).toFixed(0)) + " Millones";
                ***REMOVED***
                    if (params.key === "share") {
                        return d3.round(number, 2) + " %";
                ***REMOVED***
                    else {
                        return formatted;
                ***REMOVED***
              ***REMOVED***
                "text": function (text, params) {
                    if (text == "rawValue") {
                        if (tipo_desglose == "presupuesto") {
                            return "Presupuesto";
                    ***REMOVED*** else {
                            return "Avance";
                    ***REMOVED***

                ***REMOVED*** else if (text == "labelGroup") {
                        return "Item";
                ***REMOVED***
                    else if (text == "label") {
                        return "Entidad";
                ***REMOVED*** else if (text == "label_inf") {
                        return "Actividad";
                ***REMOVED***
                    else if (text == "label_nivel4") {
                        return "Objeto Gasto";
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
            .background("#fafafa")
            .labels({
                "align": "center", "valign": "top", "padding": 15, "font":
                {
                    "family": "inherit", "size": 10, "weight": "bold", "transform": "capitalize"
              ***REMOVED*** "resize": true
        ***REMOVED***)
            .tooltip(["labelGroup"])
            .color("labelGroup")
            .color({
                "scale": ["#2D506A", "#236B81", "#265C87", "#468ABF"],
        ***REMOVED***)
            .height({ "max": 419, "small": 200, "secondary": 100, "value": 419 ***REMOVED***)

            .resize(true)
            .draw()
***REMOVED***


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
