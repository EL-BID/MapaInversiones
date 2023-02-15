﻿var logs = [];
define(function (require) {
    
    function cortarTexto(texto, numMaxCaract){
        if (texto.length <  numMaxCaract){
            textoCortado = texto;
    ***REMOVED***else{
            textoCortado = texto.substr(0, numMaxCaract);
            ultimoEspacio = texto.lastIndexOf(" ");
 
            if (ultimoEspacio >-1){
                textoCortado = textoCortado.substr(0, ultimoEspacio);
                textoCortado += '...';
        ***REMOVED***else {
                textoCortado += '...';
        ***REMOVED***
    ***REMOVED***
 
        return textoCortado;
***REMOVED***
    function loadFichaUnica(resultados, div_contenedor, div_padre, func_fin) {
        if ($("#" + div_padre).length > 0) {
             var aux_div_col = d3.select("#" + div_contenedor)
                 .append("div")
                 .attr("class", "thumbnail type3")
                aux_div_col.append("img")
               .attr("class", "img-responsive")
               //.attr("src", "../content/img/img1.jpg")
               .attr("src", resultados.UrlImagen)
               .attr("alt", resultados.NombreMunicipio)
                aux_div_col.append("div")
               .attr("class", "labelCategory").text(resultados.NombreSector)
                var aux_div_proy_celda = aux_div_col.append("div")
                .attr("class", "caption")
                var aux_div_proy_celda_int = aux_div_proy_celda.append("div")
                .attr("class", "amount")
                aux_div_proy_celda_int.append("span")
                .attr("class", "bigNumber").text("L " + separar_miles(convertirMillones(resultados.approvedTotalMoney)) + "Millones")
                aux_div_proy_celda.append("a")
                //.attr("href", "")
                .attr("href", "../projectprofile/" + resultados.IdProyecto)
                .append("h4").text(resultados.NombreProyecto)
                var aux_div_proy_clear = aux_div_col.append("div")
                .attr("class", "clearfix")
                var aux_div_proy_porc2 = aux_div_col.append("div")
                .attr("class", "percentage")
                var aux_div_proy_porc3 = aux_div_proy_porc2.append("div")
                .attr("class", "completed")
                //.attr("style", "width:30%")
                .attr("style", "width:" + quitardecimal(resultados.porcentajeGastado) + "%")
                var aux_div_proy_porc4 = aux_div_proy_porc2.append("div")
                .attr("class", "indicatorValues")
                aux_div_proy_porc4.append("span")
                .attr("class", "startPoint")
                .html(resultados.MesInicioProyecto + "<br/>" + resultados.AnioInicioProyecto)
                aux_div_proy_porc4.append("span")
                .attr("class", "endPoint")
                .html(resultados.MesFinProyecto + "<br/>" + resultados.AnioFinProyecto)
                aux_div_proy_porc4.append("span")
                .attr("class", "middlePoint text-center")
                .html(resultados.porcentajeGastado + "% <br/> Gastado ")
                var aux_div_proy_clear2 = aux_div_col.append("div")
                .attr("class", "clearfix")
                var aux_div_proy_links = aux_div_col.append("div")
                .attr("class", "row detailedLinks")
                var aux_div_col_int = aux_div_proy_links.append("div")
                .attr("class", "col-md-12")
                var aux_a = aux_div_col_int.append("a")
                //.attr("href", "")
                .attr("href", "../projectprofile/" + resultados.IdProyecto)
                var aud_span = aux_a.append("span")
                .attr("class", "glyphicon glyphicon-thumbs-up")
                .html('&nbsp;')
                aux_a.append("text")
                .text("Me gusta")
                aux_a.append("span")
                .attr("class", "badge pull-right")
                .text(resultados.Megusta)
                var aux_div_col_int2 = aux_div_proy_links.append("div")
                .attr("class", "col-md-12")
                var aux_a2 = aux_div_col_int2.append("a")
                //.attr("href", "")
                  .attr("href", "../projectprofile/" + resultados.IdProyecto)
                aux_a2.append("span")
                .attr("class", "glyphicon glyphicon-comment")
                .html('&nbsp;')
                aux_a2.append("text")
               .text("Comentarios")
                aux_a2.append("span")
                .attr("class", "badge pull-right")
                .text(resultados.Comentarios)
                var aux_div_col_int3 = aux_div_proy_links.append("div")
                .attr("class", "col-md-12")
                var aux_a3 = aux_div_col_int3.append("a")
                //.attr("href", "")
                  .attr("href", "../projectprofile/" + resultados.IdProyecto)
                aux_a3.append("span")
                .attr("class", "glyphicon glyphicon-camera")
                .html('&nbsp;')
                aux_a3.append("text")
                .text("Fotos")
                aux_a3.append("span")
                .attr("class", "badge pull-right")
                .text(resultados.cantidadFotos)
    ***REMOVED***
        if (jQuery.isFunction(func_fin)) {
            func_fin();
    ***REMOVED***
***REMOVED***
    function loadFichaUnicaSector(resultados, div_contenedor, div_padre, func_fin) {
        if ($("#" + div_padre).length > 0) {
            var aux_div_col = d3.select("#" + div_contenedor)
                .append("div")
                .attr("class", "thumbnail type3")
            aux_div_col.append("img")
                .attr("class", "img-responsive")
                //.attr("src", "../content/img/img1.jpg")
                .attr("src", resultados.UrlImagen)
                .attr("alt", resultados.NombreMunicipio)
            aux_div_col.append("div")
                .attr("class", "labelCategory").text(resultados.NombreMunicipio)
            var aux_div_proy_celda = aux_div_col.append("div")
                .attr("class", "caption")
            var aux_div_proy_celda_int = aux_div_proy_celda.append("div")
                .attr("class", "amount")
            aux_div_proy_celda_int.append("span")
                .attr("class", "bigNumber").text("L " + separar_miles(convertirMillones(resultados.approvedTotalMoney)) + "Millones")
            aux_div_proy_celda.append("a")
                //.attr("href", "")
                .attr("href", "../projectprofile/" + resultados.IdProyecto)
                .append("h4").text(resultados.NombreProyecto)
            var aux_div_proy_clear = aux_div_col.append("div")
                .attr("class", "clearfix")
            var aux_div_proy_porc2 = aux_div_col.append("div")
                .attr("class", "percentage")
            var aux_div_proy_porc3 = aux_div_proy_porc2.append("div")
                .attr("class", "completed")
                //.attr("style", "width:30%")
                .attr("style", "width:" + quitardecimal(resultados.porcentajeGastado) + "%")
            var aux_div_proy_porc4 = aux_div_proy_porc2.append("div")
                .attr("class", "indicatorValues")
            aux_div_proy_porc4.append("span")
                .attr("class", "startPoint")
                .html(resultados.MesInicioProyecto + "<br/>" + resultados.AnioInicioProyecto)
            aux_div_proy_porc4.append("span")
                .attr("class", "endPoint")
                .html(resultados.MesFinProyecto + "<br/>" + resultados.AnioFinProyecto)
            aux_div_proy_porc4.append("span")
                .attr("class", "middlePoint text-center")
                .html(resultados.porcentajeGastado + "% <br/> Gastado ")
            var aux_div_proy_clear2 = aux_div_col.append("div")
                .attr("class", "clearfix")
            var aux_div_proy_links = aux_div_col.append("div")
                .attr("class", "row detailedLinks")
            var aux_div_col_int = aux_div_proy_links.append("div")
                .attr("class", "col-md-12")
            var aux_a = aux_div_col_int.append("a")
                //.attr("href", "")
                .attr("href", "../projectprofile/" + resultados.IdProyecto)
            var aud_span = aux_a.append("span")
                .attr("class", "glyphicon glyphicon-thumbs-up")
                .html('&nbsp;')
            aux_a.append("text")
                .text("Me gusta")
            aux_a.append("span")
                .attr("class", "badge pull-right")
                .text(resultados.Megusta)
            var aux_div_col_int2 = aux_div_proy_links.append("div")
                .attr("class", "col-md-12")
            var aux_a2 = aux_div_col_int2.append("a")
                //.attr("href", "")
                .attr("href", "../projectprofile/" + resultados.IdProyecto)
            aux_a2.append("span")
                .attr("class", "glyphicon glyphicon-comment")
                .html('&nbsp;')
            aux_a2.append("text")
                .text("Comentarios")
            aux_a2.append("span")
                .attr("class", "badge pull-right")
                .text(resultados.Comentarios)
            var aux_div_col_int3 = aux_div_proy_links.append("div")
                .attr("class", "col-md-12")
            var aux_a3 = aux_div_col_int3.append("a")
                //.attr("href", "")
                .attr("href", "../projectprofile/" + resultados.IdProyecto)
            aux_a3.append("span")
                .attr("class", "glyphicon glyphicon-camera")
                .html('&nbsp;')
            aux_a3.append("text")
                .text("Fotos")
            aux_a3.append("span")
                .attr("class", "badge pull-right")
                .text(resultados.cantidadFotos)
    ***REMOVED***
        if (jQuery.isFunction(func_fin)) {
            func_fin();
    ***REMOVED***
***REMOVED***


    function loadFicha(resultados,div_contenedor,div_padre,func_fin) {
        var contador = parseInt(resultados.length);
        var cont_aux = 0;
        if ($("#" + div_padre).length > 0) {
            if ($("#" + div_contenedor).length > 0) {
            var div_aux_fila = d3.select("#" + div_contenedor)
        ***REMOVED*** else {
            var div_aux_fila = d3.select("#" + div_padre).append("div")
                                .attr("class", "flexContainer")
                                .attr("id", div_contenedor.toString())
        ***REMOVED***
            for (i = 0; i < contador; i++) {
                var nom_ficha = "ficha_" + i.toString();
                div_aux_fila.append("div")
                .attr("class", "flex-item")
                .attr("id",nom_ficha)
                loadFichaUnica(resultados[i], nom_ficha, div_padre, func_fin);
        ***REMOVED***
    ***REMOVED***
        if (jQuery.isFunction(func_fin)) {
            func_fin();
    ***REMOVED***

***REMOVED***

    function fichaOrdenamiento(obj_div, nom_obj, etiqueta, label_filtros) {
        var div_col = d3.select("#" + obj_div.toString())
        if (etiqueta == true) {
            div_col.append("label")
                .text("Ordenar por:")
                .attr("class", "objHidden")
    ***REMOVED***

        var afilter = div_col.append("a")
            .attr("class", "btn btn-select btn-select-light mivCustom")
        afilter.append("input")
            .attr("type", "hidden")
            .attr("class", "btn-select-input")
        afilter.append("span")
            .attr("class", "btn-select-value")
            .text("Ordenar por:")
        afilter.append("span")
            .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
        var ul_select = afilter.append("ul")
            .attr("id", nom_obj.toString())
        ul_select.append("li").text("Ordenar por:")
        if (label_filtros == null || label_filtros == undefined) {
            ul_select.append("li").text("Monto")
                .attr("id", nom_obj + "_monto")
            ul_select.append("li").text("Fecha")
                .attr("id", nom_obj + "_fecha")
            ul_select.append("li").text("Progreso")
                .attr("id", nom_obj + "_progreso")
    ***REMOVED*** else {

            $.each(label_filtros, function (index, value) {
                ul_select.append("li").text(value)
                    .attr("id", nom_obj + "_" + value);
        ***REMOVED***);
    ***REMOVED***

***REMOVED***


    function filtroProgramasAutoSelected(obj_div, nom_obj, etiqueta, label_filtros, value) {
        var div_col = d3.select("#" + obj_div.toString())
        if (etiqueta == true) {
            div_col.append("label")
                .text("Anio")
                .attr("class", "objHidden")
    ***REMOVED***
        var anio = "Año:";
        if (label_filtros != null && label_filtros != undefined) {
            anio = label_filtros[value].value;
    ***REMOVED***
        var afilter = div_col.append("a")
            .attr("class", "btn btn-select btn-select-light mivCustom")
        afilter.append("input")
            .attr("type", "hidden")
            .attr("class", "btn-select-input")
        afilter.append("span")
            .attr("class", "btn-select-value")
            .text(anio)
        afilter.append("span")
            .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
        var ul_select = afilter.append("ul")
            .attr("id", nom_obj.toString())
        //ul_select.append("li").text("Seleccione:")
        if (label_filtros == null || label_filtros == undefined) {
            ul_select.append("li").text("2018")
            ul_select.append("li").text("2019")
    ***REMOVED*** else {

            $.each(label_filtros, function (index, value) {
                ul_select.append("li").attr("id", value.value).text(value.value);
        ***REMOVED***);
    ***REMOVED***

***REMOVED***

    function convertirMillones(num) {
            return num > 999999 ? (num / 1000000).toFixed(0) : num
        
***REMOVED***

    function quitardecimal(num) {
        if (num != undefined) {
            if (isNaN(num)) {
                var num = num.toString().split(',');
                return num[0]
        ***REMOVED***
            else {
                var num = num.toFixed(0);
                return num;
        ***REMOVED***
    ***REMOVED***
        
***REMOVED***

    function separar_miles(num) {
        var num_aux = num;
        if (num != "0" && num!=undefined) {
            num_aux = num.replace(/\./g, '');
            if (!isNaN(num_aux)) {
                num_aux = num_aux.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3***REMOVED***)/g, '$1.');
                num_aux = num_aux.split('').reverse().join('').replace(/^[\.]/, '');
        ***REMOVED***
    ***REMOVED*** 
        
        return num_aux;

***REMOVED***




    function log(message) {
        logs.push(message);
***REMOVED***

    function encodeRFC5987ValueChars(str) {
        return encodeURIComponent(str).replace(/['()]/g, escape).replace(/\*/g, '%2A').replace(/%(?:7C|60|5E)/g, unescape);
***REMOVED***

    //validación de correo electrónico
    function validaEmail(cadena) {
        if (cadena.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3***REMOVED***)$/)) {
            return true;
    ***REMOVED*** else {
            return false;
    ***REMOVED***
***REMOVED***

    function validaEnteroMayorCero(cadena) {
        if (cadena.match(/^[1-9]+[0-9]*$/)) {
            return true;
    ***REMOVED*** else {
            return false;
    ***REMOVED***
***REMOVED***



    return {
        load_filtro_orden: fichaOrdenamiento,
        load_filtro_programas_auto_select: filtroProgramasAutoSelected,
        load_ficha: loadFicha,
        load_ficha_unica: loadFichaUnica,
        load_ficha_unica_sector: loadFichaUnicaSector,
        writeLog: log,
        logs: logs,
        validaEmail: validaEmail,
        encodeStr: encodeRFC5987ValueChars,
        validaEnteroMayorCero: validaEnteroMayorCero,
        separar_miles: separar_miles,
        convertirMillones:convertirMillones
***REMOVED***;


***REMOVED***);