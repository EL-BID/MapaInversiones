var anyo = (new Date).getFullYear() - 1;
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";
//var RecursosPerObjetoGroup = JSON.parse(document.body.getAttribute('data-recursosPerObjetoGroup'));
//var RecursosPerObjetoAvanceGroup = JSON.parse(document.body.getAttribute('data-recursosPerObjetoAvanceGroup'));
require([
    'comunes',
    'app/network/Services',
],
    function (
        comunes,
        Services
    ) {
        inicializaDatos();
        
        $("#enlacelistado_og").trigger("click");

        configVerMas();

        function inicializaDatos() {
            $('#accordion .collapse').removeClass("in");
            $("#divListadoRecursosObje").hide();

            //comportamiento resultados buscador
            $(".container,.reset-filters,.filter-results").click(function (event) {
                var obj_focus_clase = event.target.className.toString();
                if (obj_focus_clase.indexOf("search-results") < 0 && obj_focus_clase.indexOf("search-item-t") < 0 && obj_focus_clase.indexOf("search-input") < 0 && obj_focus_clase.indexOf("general-search") < 0) {
                    $("#divResultados").children().remove();
                    $("#divResultados").addClass("objHidden");
            ***REMOVED***
        ***REMOVED***);

            //configuraFiltros graficas
            configuraFiltro_Desglose();
            configuraFiltro_DesgloseIconos();
            configuraFiltro_DesglosePeriodos();
            //------------------------------------- 
            configuraFiltro_Donaciones();
            getContratosRP();

    ***REMOVED***

        function configuraFiltro_DesglosePeriodos() {
            if ($("#filtro_desglose_periodo").length > 0) {
                $('#filtro_desglose_periodo li').bind('click onclick', function () {
                    $('#filtro_desglose_periodo  li.selected').attr("class", "");
                    var val_Sel = $(this).attr("codigo");
                    $(this).attr("class", "selected");
                    $("#sel_desglose_periodo").html($(this).html());
                    $("#selhd_desglose_periodo").val(val_Sel);
                    if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                        var opc = $("#filtro_iconos").attr("opc");

                        if (opc == "listado") {
                            ObtenerDatosListado(val_Sel);

                    ***REMOVED*** else {
                            seteaTreeMap(val_Sel);
                    ***REMOVED***

                ***REMOVED***

            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***



        function configVerMas() {

            $(".more").click(function (e) {
                var idcom = $(this).attr('idcom');
                $(".Post_user[idcom='" + idcom + "']>.complete").toggle();
                //$(".complete").toggle();
                if ($(this).text() == "Ver más...") {
                    $(this).text("Ver menos...");
            ***REMOVED*** else {
                    $(this).text("Ver más...");
            ***REMOVED***
        ***REMOVED***);

            $(".accordion").click(function (e) {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
            ***REMOVED*** else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
            ***REMOVED*** 
        ***REMOVED***);


    ***REMOVED***

        function configuraFiltro_Desglose() {
            if ($("#filtro_desglose").length > 0) {
                $('#filtro_desglose li').bind('click onclick', function () {
                    var periodo = $('#filtro_desglose_periodo  li.selected').attr('codigo');
                    var val_Sel = $(this).attr("codigo");
                    $(this).attr("class", "selected");
                    $("#sel_desglose").html($(this).html());
                    $("#selhd_desglose").val(val_Sel);
                    if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                        $("#divGraphRecursosObj").children().remove();
                        if (val_Sel == "presupuesto") {
                            if (periodo != undefined && periodo != "") {
                                ObtenerDatosPresupuestoPerGrupo(periodo);
                        ***REMOVED***
                    ***REMOVED*** else {
                            if (periodo != undefined && periodo != "") {
                                ObtenerDatosAvancePerGrupo(periodo);
                        ***REMOVED***
                    ***REMOVED***
                        
                ***REMOVED*** 

            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***


        function configuraFiltro_DesgloseIconos() {
            $(".tipo_grafica").click(function (e) {
                var tipo = $(this).attr('codigo');
                $(".tipo_grafica").removeClass("activo");
                $(this).addClass("activo");
                $("#filtro_iconos").attr("opc", tipo);
                var periodo = $('#filtro_desglose_periodo  li.selected').attr('codigo');

                //$(".complete").toggle();
                if (tipo == "listado") {
                    ObtenerDatosListado(periodo);

            ***REMOVED*** else  {
                    seteaTreeMap(periodo);
            ***REMOVED***

        ***REMOVED***);
    ***REMOVED***

        function configuraFiltro_Donaciones() {
            $('#enlaceDonaciones').bind('click onclick', function () {
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
            //alert(ruc + '      ' + nombreContratista);
           
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: '/api/serviciosContratistas/GetInformacionContratosRPCovid',
                cache: false,
                success: function (result) {
                    if (result.status == true) {
                       // $("#cantidadRP").html("");
                        //alert(result.valorContratos);
                        if (result.numContratos > 0) {
                            $("#cantidadRP").html("&nbsp;&nbsp;&nbsp;" + result.numContratos);
                            $("#totalRP").html("L " + numberWithCommas(convertirMillones(parseFloat(Math.round(result.valorContratos * 100) / 100).toFixed(0))) + tituloMillones(parseFloat(Math.round(result.valorContratos * 100) / 100).toFixed(0))); 
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
                                return "L " + numberWithCommas(parseFloat(number / 1000000).toFixed(0)) + " Millones";
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

        function loadListadoRecursosPorObjeto(objData, divContenedor) {
            //cargalistado
            $("#divGraphRecursosObj").append("<div><span>Listado</span></div>")
    ***REMOVED***

        function ObtenerDatosListado(periodo) {
            //var periodo = $('#filtro_desglose_periodo  li.selected').attr('codigo');
            if (periodo != undefined && periodo != "") {
                var params_usu = { "periodo": periodo ***REMOVED***;

                $.ajax({
                    type: 'GET',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "/api/ServiciosCovid/ObtenerDatosInfograficoPeriodo",
                    cache: false,
                    data: params_usu,
                    success: function (result) {
                        if (result.status == true) {
                            var data = result.infograficoData;
                            if (data.length > 0) {
                                getEstructuraInfografico(data);
                                seteaListado();
                               
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

    ***REMOVED***

        function seteaTreeMap(periodo) {
            $("#divGraphRecursosObj").show();
            $("#divListadoRecursosObje").hide();
            $("#divGraphRecursosObj").children().remove();
            //-----------------------------------
            $(".boxCompoDesglose").show();
            $(".boxTituloListado").hide();
            //$("#sankey_basic").empty();
            //-----------------------------------
            //var periodo = $('#filtro_desglose_periodo  li.selected').attr('codigo');
            var desglose = $('#filtro_desglose  li.selected').attr('codigo');

            if (periodo != undefined && periodo != "") {
                if (desglose == "presupuesto") {
                    ObtenerDatosPresupuestoPerGrupo(periodo);
            ***REMOVED*** else {
                    ObtenerDatosAvancePerGrupo(periodo);
            ***REMOVED***

        ***REMOVED***

    ***REMOVED***

        function seteaListado() {
            $('#accordion .collapse').removeClass("in");
            $("#divGraphRecursosObj").hide();
            $("#divListadoRecursosObje").show();
            $(".boxCompoDesglose").hide();
            $(".boxTituloListado").show();
            $("#sankey_basic").empty();
            //seleccionar tab abierto
            var lstNiveles = $("#migapanlistado").val();
            var arrayNiv = lstNiveles.split(",");
            var nom_nivel = "";
            var longitud = arrayNiv.length;

            if (longitud > 0) {

                for (var i = 0; i < longitud; i++) {
                    nom_nivel = arrayNiv[i].toUpperCase();
                    switch (i) {
                        case 0:
                            var id = $(".nivel1[entidad='" + nom_nivel + "']").attr("id");
                            var obj = $("#" + id);
                            if (obj.length > 0) {
                                obj.addClass("in");
                        ***REMOVED***
                            break;
                        case 1:
                            var id = $(".nivel2[programa='" + nom_nivel + "']").attr("id");
                            var obj = $("#" + id);
                            if (obj.length > 0) {
                                obj.addClass("in");
                        ***REMOVED***

                            break;
                        case 2:
                            var id = $(".nivel3[subprograma='" + nom_nivel + "']").attr("id");
                            var obj = $("#" + id);
                            if (obj.length > 0) {
                                obj.addClass("in");
                        ***REMOVED***
                            break;
                        default:
                            $('#accordion .collapse').removeClass("in");
                        // code block
                        //$('#accordion .collapse').removeClass("in");
                ***REMOVED***

            ***REMOVED***



        ***REMOVED*** else {
                $('#accordion .collapse').removeClass("in");
        ***REMOVED***


    ***REMOVED***

        function ObtenerDatosAvancePerGrupo(periodo) {
            var params_usu = { "periodo": periodo ***REMOVED***;

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerAvancePerObjetoGroup",
                cache: false,
                data: params_usu,
                success: function (result) {
                    if (result.status == true) {
                        var data = result.RecursosAvancePerObjetoGroup;
                        if (data.length > 0) {
                            var new_data = data;
                            loadRecursosPorObjeto(new_data, "divGraphRecursosObj", "avance");
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


        function ObtenerDatosPresupuestoPerGrupo(periodo) {
            var params_usu = { "periodo": periodo ***REMOVED***;

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCovid/ObtenerPresupuestoPerObjetoGroup",
                cache: false,
                data: params_usu,
                success: function (result) {
                    if (result.status == true) {
                        var data = result.RecursosPresupuestoPerObjetoGroup;
                        if (data.length > 0) {
                            var new_data = data;
                            loadRecursosPorObjeto(new_data, "divGraphRecursosObj", "presupuesto");
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

        function getEstructuraInfografico(datos) {
            var i_aux = 0;
            var j_aux = 0;
            var k_aux = 0;
            var l_aux = 0;
            var total_avance = 0;
            var total_presupuesto = 0;

            var html_str = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
            for (var i = 0; i < datos.length; i++) {
                var nomCollapse = "collapseOne_" + i_aux.toString() + "_" + j_aux.toString();
                var nomHeading = "headingOne_" + i_aux.toString() + "_" + j_aux.toString();
                total_avance += datos[i].total_avance;
                total_presupuesto += datos[i].total_presupuesto;
                html_str += '<div class="panel panel-default">';
                html_str += '<div class="panel-heading" role="tab" id="' + nomHeading + '">';
                html_str += '<div class="panel-title">';
                html_str += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + nomCollapse + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                html_str += '<div class="head">';
                html_str += '<div class="data1 mainData">';
                html_str += '<span class="labelTit">Item</span>';
                html_str += '<span class="td1">' + datos[i].NomItem + '</span >';
                html_str += '</div>';
                html_str += '<div class="data1">';
                html_str += '<span class="labelTit">Presupuesto</span>';
                if (datos[i].presupuesto / 1000000 < 1) {
                    html_str += '<span class="td1">' + 'L' + ' ' + (datos[i].presupuesto / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
            ***REMOVED*** else {
                    html_str += '<span class="td1">' + 'L' + ' ' + (datos[i].presupuesto / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>';
            ***REMOVED***

                html_str += '</div>';
                html_str += '<div class="data1">';
                html_str += '<span class="labelTit">Avance</span>';
                if (datos[i].avance / 1000000 < 1) {
                    html_str += '<span class="td1">' + 'L' + ' ' + (datos[i].avance / 1000000).formatMoney(1, ',', '.').toString() + ' Millones </span>';
            ***REMOVED*** else {
                    html_str += '<span class="td1">' + 'L' + ' ' + (datos[i].avance / 1000000).formatMoney(0, ',', '.').toString() + ' Millones </span>';
            ***REMOVED***
                html_str += '</div>';
                html_str += '</div >';

                html_str += '</a>';
                html_str += '</div>';
                html_str += '</div>';
                html_str += '<div id = "' + nomCollapse + '" class="panel-collapse collapse nivel1" role = "tabpanel" aria - labelTitledby="' + nomHeading + '" item = "' + datos[i].NomItem.toUpperCase() + '" >';
                html_str += '<div class="panel-body">';
                //NIVEL 2
                var vec_entidad = datos[i].Detalles;
                for (var j = 0; j < vec_entidad.length; j++) {
                    var nomNivel2 = "accordion_l2_" + i_aux.toString() + "_" + j_aux.toString();
                    var headNivel2 = "headLevel2_" + i_aux.toString() + "_" + j_aux.toString();
                    var panelHijo2 = "c2_" + j_aux.toString() + "_" + k_aux.toString();
                    var nomHeadLevel3 = "headLevel3_" + j_aux.toString() + "_" + k_aux.toString();
                    html_str += '<div class="panel-group nivel22" id="' + nomNivel2 + '" role="tablist" aria-multiselectable="true">';
                    html_str += '<div class="panel panel-default">';
                    //heading
                    html_str += '<div class="panel-heading" role="tab" id="' + headNivel2 + '">';
                    html_str += '<h4 class="panel-title">';

                    html_str += '<a role = "button" data-toggle="collapse" data-parent="#' + nomNivel2 + '" href = "#' + panelHijo2 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                    html_str += '<div class="head">';
                    html_str += '<div class="data1 mainData">';
                    html_str += '<span class="labelTit">Institución</span>';
                    html_str += '<span class="td1p">' + vec_entidad[j].NomEntidad + '</span>';
                    html_str += '</div>';
                    html_str += '<div class="data1">';
                    html_str += '<span class="labelTit">Presupuesto</span>';
                    if (vec_entidad[j].presupuesto / 1000000 < 1) {
                        html_str += '<span class="td1p">' + 'L' + ' ' + (vec_entidad[j].presupuesto / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
                ***REMOVED*** else {
                        html_str += '<span class="td1p">' + 'L' + ' ' + (vec_entidad[j].presupuesto / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>';
                ***REMOVED***

                    html_str += '</div>';
                    html_str += '<div class="data1">';
                    html_str += '<span class="labelTit">Avance</span>';
                    if (vec_entidad[j].avance / 1000000 < 1) {
                        html_str += '<span class="td1p">' + 'L' + ' ' + (vec_entidad[j].avance / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
                ***REMOVED*** else {
                        html_str += '<span class="td1p">' + 'L' + ' ' + (vec_entidad[j].avance / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>';
                ***REMOVED***

                    html_str += '</div>';

                    html_str += '</div>';
                    html_str += '</a>';
                    html_str += '</h4>';
                    html_str += '</div>';
                    //body
                    html_str += '<div id="' + panelHijo2 + '" class="panel-collapse collapse level3 nivel2" role="tabpanel" aria-labelledby="' + nomHeadLevel3 + '" entidad="' + vec_entidad[j].NomEntidad.toUpperCase() + '">';
                    html_str += '<div class="panel-body">';
                    //< !--NIVEL 3-- >
                    var vec_actividad = vec_entidad[j].Detalles;
                    for (var k = 0; k < vec_actividad.length; k++) {
                        var nomNivel3 = "accordion_l3_" + j_aux.toString() + "_" + k_aux.toString();
                        var nomCnivel3 = "c3_" + j_aux.toString() + "_" + k_aux.toString();
                        html_str += '<div class="panel-group nivel33" id="' + nomNivel3 + '" role="tablist" aria-multiselectable="true">';
                        html_str += '<div class="panel panel-default">';
                        html_str += '<div class="panel-heading" role="tab" id="' + nomHeadLevel3 + '">';
                        html_str += '<h4 class="panel-title">';
                        html_str += '<a role="button" data-toggle="collapse" data-parent="#' + nomNivel3 + '" href="#' + nomCnivel3 + '" aria-expanded="true" aria-controls="' + nomCollapse + '">';
                        html_str += '<div class="head">';
                        html_str += ' <div class="data1 mainData">';
                        html_str += '<span class="labelTit">Actividad</span>';
                        html_str += '<span class="td1p">' + vec_actividad[k].NomActividad + '</span>';
                        html_str += '</div>';
                        html_str += '<div class="data1">';
                        html_str += '<span class="labelTit">Presupuesto</span>';
                        if (vec_actividad[k].presupuesto / 1000000 < 1) {
                            html_str += '<span class="td1p">' + 'L' + ' ' + (vec_actividad[k].presupuesto / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
                    ***REMOVED*** else {
                            html_str += '<span class="td1p">' + 'L' + ' ' + (vec_actividad[k].presupuesto / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>';
                    ***REMOVED***
                        html_str += '</div>';
                        html_str += '<div class="data1">';
                        html_str += '<span class="labelTit">Avance</span>';
                        if (vec_actividad[k].avance / 1000000 < 1) {
                            html_str += '<span class="td1p">' + 'L' + ' ' + (vec_actividad[k].avance / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
                    ***REMOVED*** else {
                            html_str += '<span class="td1p">' + 'L' + ' ' + (vec_actividad[k].avance / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>';
                    ***REMOVED***

                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</a>';
                        html_str += '</h4>';
                        html_str += '</div>';
                        html_str += '<div id="' + nomCnivel3 + '" class="panel-collapse collapse nivel3" role="tabpanel" aria-labelledby="' + nomHeadLevel3 + '" actividad="' + vec_actividad[k].NomActividad.toUpperCase() + '">';
                        html_str += '<div class="panel-body">';
                        html_str += '<span class="h6">Objeto</span>';
                        html_str += '<ul class="list-group">';
                        var vec_objeto = vec_actividad[k].Detalles;
                        for (var l = 0; l < vec_objeto.length; l++) {
                            html_str += '<li class="list-group-item">';
                            html_str += '<div class="head">';
                            html_str += '<div class="data1 mainData">';
                            html_str += '<span class="td1p">' + vec_objeto[l].nom_recurso + '</span>';
                            html_str += '</div>';
                            html_str += '<div class="data1">';
                            html_str += '<span class="labelTit">Presupuesto</span>';
                            if (vec_objeto[l].presupuesto / 1000000 < 1) {
                                html_str += '<span class="td1p">' + 'L' + ' ' + (vec_objeto[l].presupuesto / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
                        ***REMOVED*** else {
                                html_str += '<span class="td1p">' + 'L' + ' ' + (vec_objeto[l].presupuesto / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>';
                        ***REMOVED***
                            html_str += '</div>';
                            html_str += '<div class="data1">';
                            html_str += '<span class="labelTit">Avance</span>';
                            if (vec_objeto[l].avance / 1000000 < 1) {
                                html_str += '<span class="td1p">' + 'L' + ' ' + (vec_objeto[l].avance / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
                        ***REMOVED*** else {
                                html_str += '<span class="td1p">' + 'L' + ' ' + (vec_objeto[l].avance / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>';
                        ***REMOVED***

                            html_str += '</div>';
                            l_aux = l_aux + 1;

                    ***REMOVED***
                        html_str += '</ul>';
                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</div>';
                        html_str += '</div>';
                        k_aux = k_aux + 1;

                       
                ***REMOVED***
                    html_str += '</div>';
                    html_str += '</div>';
                    html_str += '</div>';
                    html_str += '</div>';

                    j_aux = j_aux + 1;

            ***REMOVED***
                html_str += '</div>';
                html_str += '</div>';
                html_str += '</div>';

                i_aux = i_aux + 1;
        ***REMOVED***
            html_str += '</div>';
            html_str += '<div id="divTotales" class="summUp">';
            html_str += '<div class="panel-title">';
            html_str += '<div class="head">';
            html_str += '<div class="data1 mainData">';
            html_str += '<span class="labelTit">&nbsp;</span>';
            html_str += '<span class="td1">Totales</span>';
            html_str += '</div>';
            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Presupuesto</span>';
            if (total_presupuesto / 1000000 < 1) {
                html_str += '<span class="td1">' + 'L' + ' ' + (total_presupuesto / 1000000).formatMoney(1, ',', '.').toString() + ' Millones</span>';
        ***REMOVED*** else {
                html_str += '<span class="td1">' + 'L' + ' ' + (total_presupuesto / 1000000).formatMoney(0, ',', '.').toString() + ' Millones</span>';
        ***REMOVED***

            
            html_str += '</div>';
            html_str += '<div class="data1">';
            html_str += '<span class="labelTit">Avance</span>';
            if (total_avance / 1000000 < 1) {
                html_str += '<span class="td1">' + 'L' + ' ' + (total_avance / 1000000).formatMoney(1, ',', '.').toString() + 'Millones</span>';
        ***REMOVED*** else {
                html_str += '<span class="td1">' + 'L' + ' ' + (total_avance / 1000000).formatMoney(0, ',', '.').toString() + 'Millones</span>';
        ***REMOVED***

            html_str += '</div>';
            html_str += '</div>';
            html_str += '</div>';
            html_str += '</div>';



            $("#divListado").html(html_str);

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
