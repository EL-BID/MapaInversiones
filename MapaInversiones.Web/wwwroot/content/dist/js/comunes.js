var logs = [];
define(function (require) {
    
    function cortarTexto(texto, numMaxCaract){
        if (texto.length <  numMaxCaract){
            textoCortado = texto;
        }else{
            textoCortado = texto.substr(0, numMaxCaract);
            ultimoEspacio = texto.lastIndexOf(" ");
 
            if (ultimoEspacio >-1){
                textoCortado = textoCortado.substr(0, ultimoEspacio);
                textoCortado += '...';
            }else {
                textoCortado += '...';
            }
        }
 
        return textoCortado;
    }
    function loadFichaUnica(resultados, div_contenedor, div_padre, func_fin) {
        if ($("#" + div_padre).length > 0) {
            var nombreProyectoAjustado = resultados.NombreProyecto;
            var minus_proy = "";

            if (nombreProyectoAjustado != undefined && nombreProyectoAjustado != null) {
                if (nombreProyectoAjustado.length >= 1) {
                    minus_proy += nombreProyectoAjustado.substring(0, 1);
                    minus_proy += nombreProyectoAjustado.substring(1, nombreProyectoAjustado.length).toLowerCase();
                }
                else {
                    minus_proy = nombreProyectoAjustado;
                }
            }

            if (minus_proy.length > 110) {
                minus_proy = minus_proy.substring(0, 110) + "...";
            } 

             var aux_div_col = d3.select("#" + div_contenedor)
                 .append("div")
                 .attr("class", "thumbnail type3")
                aux_div_col.append("div")
                .attr("class", "img-responsive")
                .attr("style", "background:url('" + resultados.UrlImagen + "') no-repeat")
                aux_div_col.append("div")
               .attr("class", "labelCategory").text(resultados.NombreSector)
                var aux_div_proy_celda = aux_div_col.append("div")
                .attr("class", "caption")
                var aux_div_proy_celda_int = aux_div_proy_celda.append("div")
                .attr("class", "amount")
                aux_div_proy_celda_int.append("span")
                .attr("class", "bigNumber").text("RD" + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits:0 }).format(resultados.approvedTotalMoney))
                aux_div_proy_celda.append("a")
                //.attr("href", "")
                .attr("href", "../Proyecto/PerfilProyecto/" + resultados.IdProyecto)
                    .append("h4").text(minus_proy)
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
                //var aux_div_col_int = aux_div_proy_links.append("div").attr("class", "col-md-12")
                //var aux_a13 = aux_div_col_int.append("a").attr("href", "../Proyecto/PerfilProyecto/" + resultados.IdProyecto)
                //var aux_a14 = aux_a13.append("span").attr("class", "Iconcarrusel")
                //var aux_a15 = aux_a14.append("img").attr("src", "../content/img/icons/iconLike.svg").html('&nbsp;')
                //aux_a14.append("text").text("Me gusta")
                //aux_a14.append("span").attr("class", "badge pull-right").text(resultados.Megusta)

                var aux_div_col_int2 = aux_div_proy_links.append("div").attr("class", "col-xs-6 col-md-6")
                var aux_a23 = aux_div_col_int2.append("a").attr("href", "../Proyecto/PerfilProyecto/" + resultados.IdProyecto)
                var aux_a24 = aux_a23.append("span").attr("class", "Iconcarrusel")
                var aux_a25 = aux_a24.append("img").attr("src", "../content/img/icons/iconChat.svg").html('&nbsp;')
                /*aux_a24.append("text").text("Comentarios")*/
                aux_a24.append("span").attr("class", "badge").text(resultados.Comentarios)

            var aux_div_col_int3 = aux_div_proy_links.append("div").attr("class", "col-xs-6 col-md-6")
                var aux_a3 = aux_div_col_int3.append("a").attr("href", "../Proyecto/PerfilProyecto/" + resultados.IdProyecto)
                var aux_a4 = aux_a3.append("span").attr("class", "Iconcarrusel")
                var aux_a5 = aux_a4.append("img").attr("src", "../content/img/icons/iconPictureC.svg").html('&nbsp;')
                /*aux_a4.append("text").text("Fotos")*/
                aux_a4.append("span").attr("class", "badge").text(resultados.cantidadFotos)
        }
        if (jQuery.isFunction(func_fin)) {
            func_fin();
        }
    }
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
                .attr("class", "bigNumber").text("RD" + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(resultados.approvedTotalMoney)) //separar_miles(convertirMillones(resultados.approvedTotalMoney))
            aux_div_proy_celda.append("a")
                //.attr("href", "")
                .attr("href", "../Proyecto/PerfilProyecto/" + resultados.IdProyecto)
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

            var aux_div_col_int = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a13 = aux_div_col_int.append("a").attr("href", "../Proyecto/PerfilProyecto/" + resultados.IdProyecto)
            var aux_a14 = aux_a13.append("span").attr("class", "Iconcarrusel")
            var aux_a15 = aux_a14.append("img").attr("src", "../content/img/icons/iconLike.svg").html('&nbsp;')
            aux_a14.append("text").text("Me gusta")
            aux_a14.append("span").attr("class", "badge pull-right").text(resultados.Megusta)

            var aux_div_col_int2 = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a23 = aux_div_col_int2.append("a").attr("href", "../Proyecto/PerfilProyecto/" + resultados.IdProyecto)
            var aux_a24 = aux_a23.append("span").attr("class", "Iconcarrusel")
            var aux_a25 = aux_a24.append("img").attr("src", "../content/img/icons/IconChat.svg").html('&nbsp;')
            aux_a24.append("text").text("Comentarios")
            aux_a24.append("span").attr("class", "badge pull-right").text(resultados.Comentarios)

            var aux_div_col_int3 = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a3 = aux_div_col_int3.append("a").attr("href", "../Proyecto/PerfilProyecto/" + resultados.IdProyecto)
            var aux_a4 = aux_a3.append("span").attr("class", "Iconcarrusel")
            var aux_a5 = aux_a4.append("img").attr("src", "../content/img/icons/IconPictureC.svg").html('&nbsp;')
            aux_a4.append("text").text("Fotos")
            aux_a4.append("span").attr("class", "badge pull-right").text(resultados.cantidadFotos)
        }
        if (jQuery.isFunction(func_fin)) {
            func_fin();
        }
    }


    function loadFicha(resultados,div_contenedor,div_padre,func_fin) {
        var contador = parseInt(resultados.length);
        var cont_aux = 0;
        if ($("#" + div_padre).length > 0) {
            if ($("#" + div_contenedor).length > 0) {
            var div_aux_fila = d3.select("#" + div_contenedor)
            } else {
            var div_aux_fila = d3.select("#" + div_padre).append("div")
                                .attr("class", "flexContainer")
                                .attr("id", div_contenedor.toString())
            }
            for (i = 0; i < contador; i++) {
                var nom_ficha = "ficha_" + i.toString();
                div_aux_fila.append("div")
                .attr("class", "flex-item")
                .attr("id",nom_ficha)
                loadFichaUnica(resultados[i], nom_ficha, div_padre, func_fin);
            }
        }
        if (jQuery.isFunction(func_fin)) {
            func_fin();
        }

    }

    function fichaOrdenamiento(obj_div,nom_obj,etiqueta,label_filtros) {
        var div_col = d3.select("#" + obj_div.toString())
        if (etiqueta == true) {
            div_col.append("label")
            .text("Ordenar Por")
        }
        var valfilter = "Ordenar por";
        //if (label_filtros != null || label_filtros != undefined)  {
        //    //valfilter = label_filtros[0];
        //}
        var afilter = div_col.append("a")
        .attr("class", "btn btn-select btn-select-light mivCustom")
        afilter.append("input")
        .attr("type", "hidden")
        .attr("class", "btn-select-input")
        afilter.append("span")
        .attr("class", "btn-select-value")
        .text(valfilter)
        afilter.append("span")
        .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
        var ul_select = afilter.append("ul")
            .attr("id", nom_obj.toString())
        if (etiqueta == false) {
            ul_select.append("li").text("Ordenar por:").attr("id","")
        }
        
        if (label_filtros == null || label_filtros == undefined) {
            ul_select.append("li").text("Monto").attr("id", "monto");
            ul_select.append("li").text("Fecha").attr("id", "fecha");
            ul_select.append("li").text("Progreso").attr("id", "progreso");
        } else {
            
            $.each(label_filtros, function (index, value) {
                ul_select.append("li").text(value).attr("id", value);
            });
        }
       
    }

    
    function convertirMillones(num) {
            return num > 999999 ? (num / 1000000).toFixed(0) : num
        
    }

    function quitardecimal(num) {
        if (num != undefined) {
            if (isNaN(num)) {
                var num = num.toString().split(',');
                return num[0]
            }
            else {
                //var num = num.toFixed(0);
                return num;
            }
        }
        
    }

    function separar_miles(num) {
        var num_aux = num;
        if (num != "0" && num != undefined) {
            try {
                num_aux = num.toString().replace(/\./g, '');
                if (!isNaN(num_aux)) {
                    num_aux = num_aux.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                    num_aux = num_aux.split('').reverse().join('').replace(/^[\.]/, '');
                }
            }
            catch (error) {
                console.error("funcion separar_miles: " + error);
            }
        } 
        return num_aux;
    }




    function log(message) {
        logs.push(message);
    }

    function encodeRFC5987ValueChars(str) {
        return encodeURIComponent(str).replace(/['()]/g, escape).replace(/\*/g, '%2A').replace(/%(?:7C|60|5E)/g, unescape);
    }

    //validación de correo electrónico
    function validaEmail(cadena) {
        if (cadena.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
            return true;
        } else {
            return false;
        }
    }

    function validaEnteroMayorCero(cadena) {
        if (cadena.match(/^[1-9]+[0-9]*$/)) {
            return true;
        } else {
            return false;
        }
    }

    function filtroProgramasSubsidiosAutoSelected(obj_div, nom_obj, etiqueta, label_filtros, value) {
        var div_col = d3.select("#" + obj_div.toString())
        if (etiqueta == true) {
            div_col.append("label")
                .text("Programa")
                .attr("class", "objHidden")
        }
        var anio = "Programa:";
        if (label_filtros != null && label_filtros != undefined) {
            anio = label_filtros[value].value;
        }
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
        } else {

            $.each(label_filtros, function (index, value) {
                ul_select.append("li").attr("id", value.value).text(value.value);
            });
        }

    }

    return {
        load_filtro_orden: fichaOrdenamiento,
        load_ficha: loadFicha,
        load_ficha_unica: loadFichaUnica,
        load_ficha_unica_sector: loadFichaUnicaSector,
        load_filtro_programas_auto_select: filtroProgramasSubsidiosAutoSelected,
        writeLog: log,
        logs: logs,
        validaEmail: validaEmail,
        encodeStr: encodeRFC5987ValueChars,
        validaEnteroMayorCero: validaEnteroMayorCero,
        separar_miles: separar_miles,
        convertirMillones:convertirMillones
    };


});