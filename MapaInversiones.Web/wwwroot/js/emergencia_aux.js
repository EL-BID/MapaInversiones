var objPerContratos = JSON.parse(document.body.getAttribute('data-resourcesPerContratos'));
var objPerProcesos = JSON.parse(document.body.getAttribute('data-resourcesPerProcesos'));
var limite_tooltip = 100;

loadTreeMapGraphProc("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
configuraSelectDesglose();
configuraBtnVolver();

function configuraSelectDesglose() {
    $('.selDesglose').on('change', function () {
        var funciones = "";
        $(".selDesglose option:selected").each(function () {
            funciones += $(this).val() + ",";
    ***REMOVED***);
        funciones = funciones.replace(/,\s*$/, "");
        getArticulosGraphic(funciones);
***REMOVED***);

    $('.selDesgloseProc').on('change', function () {
        var funciones = "";
        $(".selDesgloseProc option:selected").each(function () {
            funciones += $(this).val() + ",";
    ***REMOVED***);
        funciones = funciones.replace(/,\s*$/, "");
        getArticulosGraphicProc(funciones);
***REMOVED***);

***REMOVED***

function configuraBtnVolver() {
    $('#btnVolver').click(function () {
        loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
***REMOVED***);
    $('#btnVolverContr').click(function () {
        loadTreeMapGraphProc("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
***REMOVED***);
***REMOVED***

function getArticulosGraphic(opcion) {
    switch (opcion) {
        case "entidad":
            loadTreeMapGraphProc("divGraphRecursosObj", objPerContratos, ["labelGroup", "label_inf"], 0, "");
            break;
        case "articulo":
            loadTreeMapGraphProc("divGraphRecursosObj", objPerContratos, ["label_inf"], 1, "");
            break;
        default:
        // code block
***REMOVED***
***REMOVED***

function getArticulosGraphicProc(opcion) {
    switch (opcion) {
        case "entidad":
            loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["labelGroup", "label_inf"], 0, "");
            break;
        case "articulo":
            loadTreeMapGraphProc("divGraphRecursosProcesos", objPerProcesos, ["label_inf"], 1, "");
            break;
        default:
        // code block
***REMOVED***

***REMOVED***

function assignColor(indice) {
    var color_aux = "#ECEFF1";
    var colores_default = [
        "#7790c1",
        "#9ecbd0",
        "#d1b873",
        "#80a8c2",
        "#4ba8e7",
        "#a677c1",
        "#29B6F6",
        "#E0E0E0",
        "#C5CAE9",
        "#00ACC1",
        "#BDBDBD",
        "#40C4FF",
        "#7790c1",
        "#9ecbd0",
        "#d1b873",
        "#80a8c2",
        "#4ba8e7",
        "#a677c1",
        "#29B6F6",
        "#E0E0E0",
        "#C5CAE9",
        "#00ACC1",
        "#BDBDBD",
        "#40C4FF"

    ];
    if (indice < colores_default.length) {
        color_aux = colores_default[indice];
***REMOVED***
    return color_aux;
***REMOVED***


function loadTreeMapGraphProc(divContenedor, objData, agrupador, nivel, origen) {
    var titulo = "Otros";
    var textoExpandir = "Clic para expandir";
    var limitePorc = 0.03;

    if (nivel == 0) {
        limitePorc = 0;
        titulo = "";
***REMOVED***

    $(".btnback").hide();
    $("#" + divContenedor).empty();

    if (objData != undefined && objData != null) {
        var total = 0;
        for (var i = 0; i < objData.length; i++) {
            objData[i].rawValue = parseFloat(objData[i].rawValue);
            total += objData[i].rawValue;
    ***REMOVED***
        var distintos = objData.map(item => item.labelGroup)
            .filter((value, index, self) => self.indexOf(value) === index);
        if (nivel == 1) {
            distintos = objData.map(item => item.label_inf)
                .filter((value, index, self) => self.indexOf(value) === index);
    ***REMOVED***

        var grafica = new d3plus.Treemap()
            .select("#" + divContenedor)
            .shapeConfig({
                label: (d) => {
                    var auxiliar = "";
                    var porc = (((d.rawValue / total) * 100)).formatMoney(1, '.', ',').toString();
                    if (nivel == 0) {
                        auxiliar = d["labelGroup"];

                ***REMOVED*** else if (nivel == 1) {
                        var vec_orig = d["label_inf"].toString().split(",");

                        if (vec_orig.length > 1) {
                            auxiliar = "Otros";
                    ***REMOVED*** else {
                            auxiliar = d["label_inf"]
                    ***REMOVED***


                ***REMOVED***
                    return [auxiliar, porc + "%"];
              ***REMOVED***
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
            ***REMOVED***
                , fill: function (d, index) {
                    var color_aux = "#ECEFF1";
                    color_aux = assignColor(index);
                    return color_aux;

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
                threshold: limitePorc,
                data: objData,
                groupBy: agrupador,
                height: 400,
                tooltipConfig: {
                    title: function (d) {
                        var current = grafica.depth();
                        var auxiliar = "";
                        var cad = "";
                        var aux_grupo = "";
                        if (nivel == 0) {
                            //entidad
                            aux_grupo = d["labelGroup"];
                            if (aux_grupo.length > limite_tooltip) {
                                aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                        ***REMOVED***
                            cad = aux_grupo;

                    ***REMOVED*** else {
                            //articulo
                            if (origen == "btn") {
                                aux_grupo = d["labelGroup"];
                                if (aux_grupo.length > limite_tooltip) {
                                    aux_grupo = aux_grupo.substring(0, limite_tooltip) + "...";
                            ***REMOVED***
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                            ***REMOVED***
                                cad = "<p style='float:right'>" + aux_grupo + "</p><br />" + auxiliar;
                        ***REMOVED*** else {
                                auxiliar = d["label_inf"];
                                if (auxiliar.length > limite_tooltip) {
                                    auxiliar = auxiliar.substring(0, limite_tooltip) + "...";
                            ***REMOVED***
                                cad = auxiliar;
                        ***REMOVED***

                    ***REMOVED***


                        return cad;
                  ***REMOVED***
                    tbody: [
                        [function (d) {
                            var valor = d["rawValue"] / 1;
                            var cad = "";
                            cad += "<span>" + "$ " + valor.formatMoney(1, '.', ',').toString() + "</span></br>";
                            return cad;
                    ***REMOVED***]
                    ],
                    footer: function (d) {
                        if (nivel == 0) {
                            textoExpandir = "Clic para expandir";
                    ***REMOVED*** else {
                            textoExpandir = "";
                    ***REMOVED***
                        return textoExpandir;
                ***REMOVED***

              ***REMOVED***
                yConfig: {
                    title: "",
            ***REMOVED***
        ***REMOVED***)
            .sum("rawValue")
            .depth(0)
            .legend(false)
            .on("click.shape", function (d) {
                if (d["labelGroup"] != undefined && d["labelGroup"] != null) {
                    if (nivel == 0) {
                            var data_pagina = jQuery.grep(objPerProcesos, function (n, i) {
                                return (n.labelGroup == d["labelGroup"].toString());// vec_orig[0]);
                        ***REMOVED***);
                            loadTreeMapGraphProc("divGraphRecursosProcesos", data_pagina, ["label_inf"], 1, "btn");
                            $(".btnback").show();
                       
                ***REMOVED***
            ***REMOVED***

        ***REMOVED***)
            .render();
***REMOVED***

***REMOVED***




$('#enlace_contratos').click(function () {
    window.location.href = "/ContratosEmergencia?emergencia=" + $('#tipoemergencia').val();//?entidad=" + $(this).attr('data-entidad');
***REMOVED***)

$('#enlace_procesos').click(function () {
    window.location.href = "/ContratosEmergencia?emergencia=" + $('#tipoemergencia').val();
***REMOVED***)

$('#enlace_presupuesto_emergencia').click(function () {
    window.location.href = "/EmergenciaPresupuesto?emergencia=" + $('#tipoemergencia').val();
***REMOVED***)


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