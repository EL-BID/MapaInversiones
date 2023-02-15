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
            configurarEnlaceTabs();
            ObtenerDatosArticulo(33);
            $("#divArt33").show();
            $("#divArt35").hide();
            pintardonas();

    ***REMOVED***

        function configurarEnlaceTabs() {
            $('#divTab33').each(function (i, e) {
                $(e).bind('click', function () {
                    $("#divTab33").attr("class", "activo");
                    $("#divTab35").attr("class", "");
                    $("#divArt35").hide();
                    $("#divArt33").show();
                    ObtenerDatosArticulo(33);
            ***REMOVED***);
        ***REMOVED***);
            $('#divTab35').each(function (i, e) {
                $(e).bind('click', function () {
                    $("#divTab35").attr("class", "activo");
                    $("#divTab33").attr("class", "");
                    $("#divArt33").hide();
                    $("#divArt35").show();
                    ObtenerDatosArticulo(35);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
        function ObtenerDatosArticulo(id) {
            var url = '/api/ServiciosCovid/ObtenerProductosDonacion';
            var consulta = {
                id: id
        ***REMOVED***;
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtDistribucionPresupuestalArticulos",
                cache: false,
                data: JSON.stringify(consulta),
                success: function (result) {
                    if (result.status == true) {
                        var data = result.distribucionItem;
                        if (data.length > 0) {
                            var datos = obtMatrizData(data);
                            $("#sankey_basic").html("");
                            graphSankey("sankey_basic",datos);
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


        function graphSankey(contenedor, datos) {
            var height_aux = 0;
            var width_aux = 1100;
            var units = "millones";
            var cant_elementos = 10;
            if (datos != undefined && datos != null) {
                cant_elementos = datos.cant_nodos_fin.cant;
        ***REMOVED***

            let isMobile = window.matchMedia("only screen and (max-width: 765px)").matches;

            if ($(window).innerWidth() <= width || isMobile) {
                width_aux = 1100;

        ***REMOVED*** else {
                width_aux = $(".container").innerWidth();
        ***REMOVED***

             
            //console.log(width_aux);

            var margin = { top: 10, right: 10, bottom: 10, left: 10 ***REMOVED***,
                width = width_aux - 20 - margin.left - margin.right,
                height = ((cant_elementos)* 25) - margin.top - margin.bottom;

            var format = function (d) {
                    return "L " + (d).formatMoney(0, '.', '.') + " " + units;
                    //return "L " + (d);
              ***REMOVED***
                color = d3.scale.category20();
           
              //color = d3.scale.ordinal()
            //.range(["#fb9a99", "#1f78b4", "#a6cee3", "#b2df8a", "#33a02c","#fbbdbc"]);

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
                        //return 20;
                ***REMOVED***)
                    .sort(function (a, b) { return b.dy - a.dy; ***REMOVED***);

                // add the link titles
                link.append("title")
                    .text(function (d) {
                            return d.source.name + " → " +
                            d.target.name + "\n" + format(d.value);
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
                        return d.name + "\n" + format(d.value);
                ***REMOVED***);

                // add in the title for the nodes
                node.append("text")
                    .attr("x", -6)
                    .attr("y", function (d) { return d.dy / 2; ***REMOVED***)
                    .attr("dy", ".2em")
                    .style("font-size", "10px")
                    .attr("text-anchor", "end")
                    .attr("transform", null)
                    .text(function (d) { return d.name; ***REMOVED***)
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

          ***REMOVED***datos);

    ***REMOVED***




        function loadData(cb,datos) {
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
                //NomItem
                cant_nodos_1 += 1;
                var test = false;
                var obj_aux = { name: value.NomItem ***REMOVED***;
                var nomItem = value.NomItem;
                obj_nodos.push(obj_aux);
                $.each(value.Detalles, function (key, value) {
                    cant_nodos_2 += 1;
                    var nomEntidad = value.NomEntidad;
                    var valor_entidad = (value.presupuesto/1000000);
                    //NomEntidad
                    test = obj_nodos.some(item => item.name === value.NomEntidad);
                    if (test == false) {
                        obj_aux = { name: value.NomEntidad ***REMOVED***;
                        obj_nodos.push(obj_aux);
                ***REMOVED***

                    var objIndex = obj_links.findIndex((obj => obj.target == nomEntidad && obj.source == nomItem));
                    if (objIndex > -1) {
                        obj_links[objIndex].value = obj_links[objIndex].value + valor_entidad;
                ***REMOVED*** else {
                        var obj_links_aux = { source: nomItem, target: nomEntidad, value: valor_entidad ***REMOVED***
                        obj_links.push(obj_links_aux);
                ***REMOVED***

                   
                    $.each(value.Detalles, function (key, value) {
                        cant_nodos_3 += 1;
                        //NomActividad
                        cant_nodos_fin += 1;
                        var nomActividad = value.NomActividad;
                        var valor_act = (value.presupuesto / 1000000);
                        test = obj_nodos.some(item => item.name === value.NomActividad);
                        if (test == false) {
                            obj_aux = { name: value.NomActividad ***REMOVED***;
                            obj_nodos.push(obj_aux);
                    ***REMOVED***

                        var objIndex = obj_links.findIndex((obj => obj.target == nomActividad && obj.source == nomEntidad));
                        if (objIndex > -1) {
                            obj_links[objIndex].value = obj_links[objIndex].value + valor_act;
                    ***REMOVED*** else {
                            obj_links_aux = { source: nomEntidad, target: nomActividad, value: valor_act ***REMOVED***
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

        function pintardonas()
        {
            
            var dataset_33 = [
                { name: 'Mercado internacional', total: 1000, percent: 62.50, color: "#1F78B4" ***REMOVED***,
                { name: 'BID-5028/OC', total: 160, percent: 10.00, color: "#33A02C" ***REMOVED***,
                { name: 'BID-5029/KI-PR', total: 50, percent: 3.13, color: "#B2DF8A" ***REMOVED***,
                { name: 'BIRF', total: 20, percent: 1.25, color:"#A6CEE3" ***REMOVED***,
                { name: 'Mercado nacional de bonos', total: 120, percent: 7.5, color: "#FB9A99" ***REMOVED***,
                { name: 'CAF', total: 250, percent: 15.62, color: "#f7bd86" ***REMOVED***
            ];

            var dataset_35 = [
                { name: 'BIRF-9064-PY', total: 100, percent: 25.64, color:"#1F78B4" ***REMOVED***,
                { name: 'BID', total: 90, percent: 23.07, color:"#33A02C" ***REMOVED***,
                { name: 'BIRF-9059-PY', total: 200, percent: 51.29, color:"#B2DF8A" ***REMOVED***
            ];

            getDonaResponsive("graphDona33", dataset_33);
            getDonaResponsive("graphDona35", dataset_35);


    ***REMOVED***

        

        function getDonav3(contenedor, dataset) {
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

            if (x_legend == false) {
                var cant_elem = dataset.length;
                //height_pie = height-100;
        ***REMOVED***
            
            var radius = Math.min(width, height) / 2;

            //var color = d3.scale.ordinal()
            //.range(["#fb9a99", "#1f78b4", "#a6cee3", "#b2df8a", "#33a02c","#fbbdbc"]);

            var arc = d3.svg.arc()
                .innerRadius(radius - donutWidth)
                .outerRadius(radius);

            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(1.1 * Math.PI)
                .endAngle(3.1 * Math.PI)
                .value(function (d) { return d.total; ***REMOVED***);

            var svg = d3.select("#" + contenedor).append("svg")
                .attr("width", width)
                .attr("height", height_pie)
                .append("g")
                //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                .attr('transform', 'translate(' + ((width / 2) - donutWidth) + ',' + (height / 2) + ')');


            var g = svg.selectAll(".arc")
                .data(pie(dataset))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .style("fill", function (d) {
                    return (d.data.color);

            ***REMOVED***)
                .transition().delay(function (d, i) {
                    return i * 500;
            ***REMOVED***).duration(500)
                .attrTween('d', function (d) {
                    var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                    return function (t) {
                        d.endAngle = i(t);
                        return arc(d)
                ***REMOVED***
            ***REMOVED***);
            g.append("text")
                .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; ***REMOVED***)
                .attr("dy", ".35em")
                .transition()
                .delay(1000)
                .text(function (d) { return d.data.total; ***REMOVED***);

            d3.selectAll("path").on("mousemove", function (d) {
                div.style("left", d3.event.pageX + 10 + "px");
                div.style("top", d3.event.pageY - 25 + "px");
                div.style("display", "inline-block");
                div.html((d.data.name) + "<br>" + (d.data.percent) + "%");
        ***REMOVED***);

            d3.selectAll("path").on("mouseout", function (d) {
                div.style("display", "none");
        ***REMOVED***);


            //d3.select("body").transition().style("background-color", "#d3d3d3");
            function type(d) {
                d.total = +d.total;
                return d;
        ***REMOVED***


    ***REMOVED***

        function getDonaResponsive(contenedor, dataset) {
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

            var path=g.append("path")
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
                .text(function (d) { return d.data.total; ***REMOVED***);

            d3.selectAll("path").on("mousemove", function (d) {
                div.style("left", d3.event.pageX + 10 + "px");
                div.style("top", d3.event.pageY - 25 + "px");
                div.style("display", "inline-block");
                div.html((d.data.name) + "<br>" + (d.data.percent) + "%");
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
 ***REMOVED***)


           