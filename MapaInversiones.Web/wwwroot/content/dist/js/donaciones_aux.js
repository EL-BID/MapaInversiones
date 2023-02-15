var anyo = (new Date).getFullYear() - 1;
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";

require([
    'comunes'
],
    function (
        comunes
    ) {

        if (location.pathname.indexOf('DistribucionDonaciones') !== -1) {
            
            $("#btnBuscarProdEntidad").click(function (event) {
                pintarProductosBeneficiarioDonacion();
        ***REMOVED***);
            $("#btnLimpiarBusqueda").click(function (event) {
                $("#distribuc_beneficiario").val("");
                $("#accordionBeneficiarios").empty();
                obtBeneficiariosDistribucionByPag(1);
        ***REMOVED***);

            obtBeneficiariosDistribucionByPag(1);

    ***REMOVED***

        if (location.pathname.indexOf('PerfilDonaciones') !== -1) {
                inicializaDatos();
    ***REMOVED***
        

        function inicializaDatos() {
            pintarProductosByPagina(1);
            configEnlaces();
    ***REMOVED***

        function configEnlaces() {
            $("#enlaceDistribucionDonacion").click(function (event) {
                debugger
                var id = $("#numDonacion").text().trim();
                var enlace_url = "../DistribucionDonaciones?id=" + id + "&orig=per";
                location.href = enlace_url;
        ***REMOVED***);

    ***REMOVED***

        function pintarProductosByPagina(pagina) {
            var id = $("#numDonacion").text().trim();
            $("#listaContenedor").empty();
            $("#divPagFichas").empty();
            $("#listaContenedor").html(loader_proy);
            var url = '/api/ServiciosCovid/ObtenerProductosDonacion';
            var param = "page=" + pagina + "&id=" + id;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerProductosDonacion",
                cache: false,
                data: param,
                success: function (result) {
                    if (result.status == true) {
                        var data = result.donacion.DetalleProductos;
                        $("#listaContenedor").empty();
                        var div_proy = d3.select("#divProyectos")
                        if (data.length > 0) {

                            $("#listaContenedor").attr("total_pages", result.totalPages);
                            $("#listaContenedor").attr("total_number", result.totalNumber);
                            $("#listaContenedor").attr("pag_actual", pagina)

                            for (var i = 0; i < data.length; i++) {
                                var cantidad = data[i].cantidad;
                                var cant_aux = "0";
                                if (cantidad != undefined) {
                                    cant_aux = cantidad.toString();
                            ***REMOVED***
                                var fila = d3.select("#listaContenedor")
                                    .append("tr")
                                fila.append("td")
                                    .attr("class", "rowprod")
                                    .text(data[i].nom_producto);
                                fila.append("td")
                                    .attr("class", "rowinfo")
                                    .text(comunes.separar_miles(cant_aux));
                        ***REMOVED***
                            //construir paginacion
                            dibujaPagProductos(pagina, result.donacion.totalNumber, result.donacion.totalPages);


                    ***REMOVED*** else {
                            //No hay datos
                            d3.select("#divPagFichas").empty();
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


        function dibujaPagProductos(actual, total, totalPag) {
            $("#tableProductosDonados").attr("page", actual);
            $("#tableProductosDonados").attr("totalNumber", total);
            $("#tableProductosDonados").attr("totalPages", totalPag);

            var pag_actual = parseInt(actual);
            var pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 20;
            var cant_por_linea = 20;
            $("#divPagFichas").html("");
            var divPag = d3.select("#divPagFichas")
            //divPag.append("text")
            //.text("Pág: ")

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
                pintarProductosByPagina(pagina_actual);
        ***REMOVED***);


    ***REMOVED***


        function obtBeneficiariosDistribucionByPag(pagina) {
            var id = $("#numDonacion").text().trim();
            $("#accordionBeneficiarios").empty();
            $("#divPagFichas").empty();
            $("#divContenedorPag").show();
            $("#accordionBeneficiarios").html(loader_proy);
            var url = '/api/ServiciosCovid/ObtenerDistribucionDonacion';
            var param = "page=" + pagina + "&id=" + id;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerDistribucionDonacion",
                cache: false,
                data: param,
                success: function (result) {
                    if (result.status == true) {
                        var data = result.donacion.DetalleProductos;
                        $("#accordionBeneficiarios").empty();
                        var div_proy = d3.select("#divProyectos")
                        if (data.length > 0) {
                            fichaDistribucion(data);
                            dibujaPagDistribucionDonacion(pagina, result.donacion.totalNumber, result.donacion.totalPages);
                    ***REMOVED*** else {
                            //No hay datos
                            $("#divPagFichas").empty();
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


        function fichaDistribucion(data) {
            var nom_contenedor = "#accordionBeneficiarios";
            var contenedor = d3.select(nom_contenedor);
            var entidad = "";
            var j = 0;
            for (var i = 0; i < data.length; i++) {
                var entidad_aux = data[i].beneficiario;
               
                if (entidad != entidad_aux) {
                    j = j + 1;
                    var fila = contenedor.append("div")
                        .attr("class", "card z-depth-0 bordered")
                    var header = fila.append("div")
                        .attr("class", "card-header")
                        .attr("id", "headingOne_" + i.toString())
                    var titulo = header.append("h5")
                        .attr("class","mb-0 Dona")
                    var btn_titulo = titulo.append("button")
                        .attr("class", "btn btn-link")
                        .attr("type", "button")
                        .attr("data-toggle", "collapse")
                        .attr("data-target", "#collapseOne_" + i.toString())
                        .attr("aria-expanded", true)
                        .attr("aria-controls", "collapseOne_" + i.toString())
                    btn_titulo.append("span")
                        .attr("class", "TitDona")
                        .text(data[i].beneficiario)
                    var cuerpo = fila.append("div")
                        .attr("id", "collapseOne_" + i.toString())
                        .attr("class", "collapse")
                        .attr("aria-labelledby", "headingOne_" + i.toString())
                        .attr("data-parent", nom_contenedor)
                    var card = cuerpo.append("div")
                        .attr("class", "card-body")
                    var responsiva=card.append("div")
                        .attr("class","table-responsive")
                    var tabla = responsiva.append("table")
                        .attr("id", "tablePreview_" + i.toString())
                        .attr("class", "table table-striped table-hover table-sm")
                    var tabla_head = tabla.append("thead")
                    var enc_tabla_head = tabla_head.append("tr")
                    enc_tabla_head.append("th")
                        .attr("class", "Tbgray")
                        .text("Producto donado")
                    enc_tabla_head.append("th")
                        .attr("class", "Tbgray text-center")
                        .text("Cantidad Entregada")
                    enc_tabla_head.append("th")
                        .attr("class", "Tbgray text-center")
                        .text("Fecha entrega")
                    var cuerpo_tabla = tabla.append("tbody")
                        .attr("id", "tbody_" + j.toString())
                    entidad = entidad_aux;

                   
            ***REMOVED***

                var d = data[i].fecha_entrega.toString().split(" ");
                var datestring = d[0];

                if ($("#" + "tbody_" + j.toString()).length > 0) {
                    var cuerpo_tabla = d3.select("#" + "tbody_" + j.toString())
                    var fila_tabla = cuerpo_tabla.append("tr")
                    fila_tabla.append("td")
                    .attr("class", "rowprod")
                    .text(data[i].nom_producto)
                    fila_tabla.append("td")
                        .attr("class", "rowinfo")
                        .text(comunes.separar_miles(data[i].cantidad.toString()))
                    fila_tabla.append("td")
                        .attr("class", "rowinfo")
                        .text(datestring)
            ***REMOVED***
                

                
        ***REMOVED***

    ***REMOVED***


        function dibujaPagDistribucionDonacion(actual, total, totalPag) {
            $("#accordionBeneficiarios").attr("page", actual);
            $("#accordionBeneficiarios").attr("totalNumber", total);
            $("#accordionBeneficiarios").attr("totalPages", totalPag);

            var pag_actual = parseInt(actual);
            var pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 20;
            var cant_por_linea = 20;
            $("#divPagFichas").html("");
            var divPag = d3.select("#divPagFichas")
            //divPag.append("text")
            //.text("Pág: ")

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
                obtBeneficiariosDistribucionByPag(pagina_actual);
        ***REMOVED***);


    ***REMOVED***

        function pintarProductosBeneficiarioDonacion() {
            var id = $("#numDonacion").text().trim();
            var entidad = $("#distribuc_beneficiario").val().trim();
            $("#accordionBeneficiarios").empty();
            $("#divPagFichas").empty();
            $("#divContenedorPag").hide();
            $("#accordionBeneficiarios").html(loader_proy);
            var url = '/api/ServiciosCovid/ObtenerProductosDonacion';
            var consulta = {
                id: id,
                texto: entidad
        ***REMOVED***;
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerDistribucionByBeneficiario",
                cache: false,
                data: JSON.stringify(consulta),
                success: function (result) {
                    if (result.status == true) {
                        var data = result.donacion.DetalleProductos;
                        $("#accordionBeneficiarios").empty();
                        var div_proy = d3.select("#divProyectos")
                        if (data.length > 0) {
                            fichaDistribucion(data);

                    ***REMOVED*** else {
                            //No hay datos
                            $("#divContenedorPag").hide();
                            $("#divPagFichas").empty();
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
    
***REMOVED***)