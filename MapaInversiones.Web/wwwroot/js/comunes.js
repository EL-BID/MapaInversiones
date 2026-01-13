var logs = [];
define(function (require) {

    function cortarTexto(texto, numMaxCaract) {
        if (texto.length < numMaxCaract) {
            textoCortado = texto;
        } else {
            textoCortado = texto.substr(0, numMaxCaract);
            ultimoEspacio = texto.lastIndexOf(" ");

            if (ultimoEspacio > -1) {
                textoCortado = textoCortado.substr(0, ultimoEspacio);
                textoCortado += '...';
            } else {
                textoCortado += '...';
            }
        }

        return textoCortado;
    }
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
                //.attr("class", "bigNumber").text("TT" + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits:0 }).format(resultados.approvedTotalMoney))
                .attr("class", "bigNumber").text("TT$ " + convertirMillones(resultados.approvedTotalMoney) + " Million")
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
                .html(resultados.porcentajeGastado + "% <br/> gastado ")
            var aux_div_proy_clear2 = aux_div_col.append("div")
                .attr("class", "clearfix")
            var aux_div_proy_links = aux_div_col.append("div")
                .attr("class", "row detailedLinks")
            var aux_div_col_int = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a13 = aux_div_col_int.append("a").attr("href", "../projectprofile/" + resultados.IdProyecto)
            var aux_a14 = aux_a13.append("span").attr("class", "Iconcarrusel")
            var aux_a15 = aux_a14.append("img").attr("src", "../content/img/icons/iconLike.svg").html('&nbsp;')
            aux_a14.append("text").text("Like")
            aux_a14.append("span").attr("class", "badge pull-right").text(resultados.Megusta)

            var aux_div_col_int2 = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a23 = aux_div_col_int2.append("a").attr("href", "../projectprofile/" + resultados.IdProyecto)
            var aux_a24 = aux_a23.append("span").attr("class", "Iconcarrusel")
            var aux_a25 = aux_a24.append("img").attr("src", "../content/img/icons/IconChat.svg").html('&nbsp;')
            aux_a24.append("text").text("Comments")
            aux_a24.append("span").attr("class", "badge pull-right").text(resultados.Comentarios)

            var aux_div_col_int3 = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a3 = aux_div_col_int3.append("a").attr("href", "../projectprofile/" + resultados.IdProyecto)
            var aux_a4 = aux_a3.append("span").attr("class", "Iconcarrusel")
            var aux_a5 = aux_a4.append("img").attr("src", "../content/img/icons/IconPictureC.svg").html('&nbsp;')
            aux_a4.append("text").text("Photos")
            aux_a4.append("span").attr("class", "badge pull-right").text(resultados.cantidadFotos)
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
                //.attr("class", "bigNumber").text("TT" + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(resultados.approvedTotalMoney)) //separar_miles(convertirMillones(resultados.approvedTotalMoney))
                .attr("class", "bigNumber").text("TT$ " + convertirMillones(resultados.approvedTotalMoney) + " Million")
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
                .html(resultados.porcentajeGastado + "% <br/> gastado ")
            var aux_div_proy_clear2 = aux_div_col.append("div")
                .attr("class", "clearfix")
            var aux_div_proy_links = aux_div_col.append("div")
                .attr("class", "row detailedLinks")

            var aux_div_col_int = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a13 = aux_div_col_int.append("a").attr("href", "../projectprofile/" + resultados.IdProyecto)
            var aux_a14 = aux_a13.append("span").attr("class", "Iconcarrusel")
            var aux_a15 = aux_a14.append("img").attr("src", "../content/img/icons/iconLike.svg").html('&nbsp;')
            aux_a14.append("text").text("Like")
            aux_a14.append("span").attr("class", "badge pull-right").text(resultados.Megusta)

            var aux_div_col_int2 = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a23 = aux_div_col_int2.append("a").attr("href", "../projectprofile/" + resultados.IdProyecto)
            var aux_a24 = aux_a23.append("span").attr("class", "Iconcarrusel")
            var aux_a25 = aux_a24.append("img").attr("src", "../content/img/icons/IconChat.svg").html('&nbsp;')
            aux_a24.append("text").text("Comments")
            aux_a24.append("span").attr("class", "badge pull-right").text(resultados.Comentarios)

            var aux_div_col_int3 = aux_div_proy_links.append("div").attr("class", "col-md-12")
            var aux_a3 = aux_div_col_int3.append("a").attr("href", "../projectprofile/" + resultados.IdProyecto)
            var aux_a4 = aux_a3.append("span").attr("class", "Iconcarrusel")
            var aux_a5 = aux_a4.append("img").attr("src", "../content/img/icons/IconPictureC.svg").html('&nbsp;')
            aux_a4.append("text").text("Photos")
            aux_a4.append("span").attr("class", "badge pull-right").text(resultados.cantidadFotos)
        }
        if (jQuery.isFunction(func_fin)) {
            func_fin();
        }
    }


    function loadFicha(resultados, div_contenedor, div_padre, func_fin) {
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
                    .attr("id", nom_ficha)
                loadFichaUnica(resultados[i], nom_ficha, div_padre, func_fin);
            }
        }
        if (jQuery.isFunction(func_fin)) {
            func_fin();
        }

    }

    function fichaOrdenamiento(obj_div, nom_obj, etiqueta, label_filtros) {
        var div_col = d3.select("#" + obj_div.toString())
        if (etiqueta == true) {
            div_col.append("label")
                .text("Sort by")
                .attr("class", "objHidden")
        }

        var afilter = div_col.append("a")
            .attr("class", "btn btn-select btn-select-light mivCustom")
        afilter.append("input")
            .attr("type", "hidden")
            .attr("class", "btn-select-input")
        afilter.append("span")
            .attr("class", "btn-select-value")
            .text("Sort by:")
        afilter.append("span")
            .attr("class", "btn-select-arrow glyphicon glyphicon-chevron-down")
        var ul_select = afilter.append("ul")
            .attr("id", nom_obj.toString())
        ul_select.append("li").text("Sort by:")
        if (label_filtros == null || label_filtros == undefined) {
            ul_select.append("li").text("Amount")
                .attr("id", nom_obj + "_monto")
            ul_select.append("li").text("Date")
                .attr("id", nom_obj + "_fecha")
            ul_select.append("li").text("Progress")
                .attr("id", nom_obj + "_progreso")
        } else {

            $.each(label_filtros, function (index, value) {
                ul_select.append("li").text(value)
                    .attr("id", nom_obj + "_" + value);
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
                console.error("function separar_miles: " + error);
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

    return {
        load_filtro_orden: fichaOrdenamiento,
        load_ficha: loadFicha,
        load_ficha_unica: loadFichaUnica,
        load_ficha_unica_sector: loadFichaUnicaSector,
        writeLog: log,
        logs: logs,
        validaEmail: validaEmail,
        encodeStr: encodeRFC5987ValueChars,
        validaEnteroMayorCero: validaEnteroMayorCero,
        separar_miles: separar_miles,
        convertirMillones: convertirMillones
    };


});