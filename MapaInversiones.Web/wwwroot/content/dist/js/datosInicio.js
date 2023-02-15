
var departments = JSON.parse(document.body.getAttribute('data-deparmentProjectData'));
var municipios = JSON.parse(document.body.getAttribute('data-municipioProjectData'));
var proyectos_ini = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));

var arrayMunicipalities = { length: 0 ***REMOVED***;
var arrayDepartments = { length: 0 ***REMOVED***;
var arrayRegions = { length: 0 ***REMOVED***;


//DIBUJANDO DEPARTAMENTOS
d3.select("#divDepartamentos")
    .append("h2")
    .attr("class", "headSection")
    .append("a")
    .attr("role", "button")
     .append("span")
     .text("DEPARTAMENTOS (" + departments.length + ")")

for (i = 0; i < departments.length; i++) {
    var aux_div = d3.select("#divDepartamentos")
    .append("div")
    .attr("class", "thumbnail")
    aux_div.append("img")
    .attr("class", "img-responsive")
    .attr("src", "../content/img/img1.jpg")
    .attr("alt", departments[i].nombre)
    var aux_div_2 = aux_div.append("div")
    .attr("class", "caption")
    .append("a")
    .attr("href", "")
    .attr("role", "button")
    .append("h3")
    .attr("class", "text-center")
    .text(departments[i].nombre)

***REMOVED***

//DIBUJANDO MUNICIPIOS
d3.select("#divMunicipios")
    .append("h2")
    .attr("class", "headSection")
    .append("a")
    .attr("role", "button")
    .append("span")
    .text("MUNICIPIOS (" + municipios.length + ")")


for (i = 0; i < municipios.length; i++) {
    var aux_div = d3.select("#divMunicipios")
    .append("div")
    .attr("class", "thumbnail")
    aux_div.append("img")
    .attr("class", "img-responsive")
    .attr("src", "../content/img/img1.jpg")
    .attr("alt", municipios[i].nombre)
    var aux_div_2 = aux_div.append("div")
    .attr("class", "caption")
    .append("a")
    .attr("href", "")
    .attr("role", "button")
    .append("h3")
    .attr("class", "text-center")
    .text(municipios[i].nombre)

***REMOVED***


//data-proyectoProjectData='[@foreach (var sector in @Model.ProyectosAprobados)
//{<text> {"id": "@sector.IdProyecto","nombre": "@sector.NombreProyecto","cantidad_fotos": @sector.cantidadFotos, "valor_presupuesto": @sector.approvedTotalMoney.ToString("N0").Replace(".", string.Empty),"municipio" : "@sector.NombreMunicipio" , "url_imagen" : "@sector.UrlImagen" , "sector": "@sector.NombreSector"***REMOVED***@if (sector != @Model.ProyectosAprobados.Last())
//{<text>,</text>***REMOVED***</text>***REMOVED***]'

//DIBUJANDO PROYECTOS
pintarProyecto(proyectos_ini, "");



function convertirMillones(num) {
    return num > 999999 ? (num / 1000000).toFixed(0) : num
***REMOVED***

function quitardecimal(num) {
    if (isNaN(num)) {
        var num = num.toString().split(',');
        return num[0]
***REMOVED***
    else {
        var num = num.toFixed(0);
        return num;
***REMOVED***
***REMOVED***

function separar_miles(num) {
    var num = num.replace(/\./g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3***REMOVED***)/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
***REMOVED***
    return num;

***REMOVED***

function pintarProyecto(resultados, opcion) {
    //DIBUJANDO PROYECTOS
    var div_proyectos = d3.select("#divProyectos")
    if (opcion == "" || opcion == null) {
        var div_fila = d3.select("#divProyectos")
       .append("div")
       .append("h2")
       .attr("class", "headSection")
       .append("div")
       .attr("class", "row")
        div_fila.append("div")
       .append("div")
       .attr("class", "col-md-8")
       .append("a")
       .attr("href", "")
       .attr("role", "button")
       //.attr("style","color:#FFFFFF;")
       .append("span")
       .text("PROYECTOS (" + resultados.length + ")")
        var div_col = div_fila.append("div")
        .attr("class", "col-md-4")
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
        .attr("id", "filterBy")
        ul_select.append("li").text("Ordenar por:")
        ul_select.append("li").text("Monto")
        ul_select.append("li").text("Fecha")
        ul_select.append("li").text("Progreso")

        //var div_col = div_fila.append("div")
        //.attr("class", "col-md-4")
        //div_col.append("label")
        //.attr("class", "hidden")
        //.attr("for", "filterBy")
        //.text("Mostrar por:")
        //var select_opc = div_col.append("select")
        //.attr("class", "select form-control basic")
        //.attr("id", "filterBy")
        //select_opc.append("option").text("Mostrar por:")
        //select_opc.append("option").text("Monto")
        //select_opc.append("option").text("Fecha")
        //select_opc.append("option").text("Progreso")

***REMOVED***

    var contador = parseInt(resultados.length);
    var cont_aux = 0;
    if ($("#divProyectos").length > 0) {
        if ($("#proyContenedor").length > 0) {
            var div_aux_fila = d3.select("#proyContenedor")
    ***REMOVED*** else {
            var div_aux_fila = d3.select("#divProyectos").append("div")
                            .attr("class", "flexContainer")
                            .attr("id", "proyContenedor")
    ***REMOVED***
        for (i = 0; i < contador; i++) {
            var div_aux_col_ext = div_aux_fila.append("div")
            .attr("class", "flex-item")
            var aux_div_col = div_aux_col_ext.append("div")
            .attr("class", "thumbnail type3")
            aux_div_col.append("img")
           .attr("class", "img-responsive")
           .attr("src", "../content/img/img1.jpg")
           .attr("alt", resultados[i].municipio)
            aux_div_col.append("div")
            //.attr("class", "labelCategory").text(resultados[cont_aux].sector + " [ " + resultados[cont_aux].FechaInicioProyecto.toString().substring(0,10) + " ] ")
            .attr("class", "labelCategory").text(resultados[cont_aux].sector)
            var aux_div_proy_celda = aux_div_col.append("div")
            .attr("class", "caption")
            var aux_div_proy_celda_int = aux_div_proy_celda.append("div")
            .attr("class", "amount")
            aux_div_proy_celda_int.append("span")
            //.attr("class", "bigNumber").text(proyectos_ini[cont_aux].valor_presupuesto + " PYG")
            .attr("class", "bigNumber").text(separar_miles(convertirMillones(resultados[cont_aux].valor_presupuesto)) + "M PYG")
            //aux_div_proy_celda_int.append("small").text(proyectos_ini[cont_aux].porcentaje_gastado.replace(".", ",") + "% Gastado")
            aux_div_proy_celda.append("a")
            .attr("href", "")
            //.append("h4").text(proyectos_ini[cont_aux].municipio)
            .append("h4").text(resultados[cont_aux].nombre)
            var aux_div_proy_clear = aux_div_col.append("div")
            .attr("class", "clearfix")
            var aux_div_proy_porc2 = aux_div_col.append("div")
            .attr("class", "percentage")
            var aux_div_proy_porc3 = aux_div_proy_porc2.append("div")
            .attr("class", "completed")
            //.attr("style", "width:30%")
            .attr("style", "width:" + quitardecimal(resultados[cont_aux].porcentaje_gastado) + "%")
            var aux_div_proy_porc4 = aux_div_proy_porc2.append("div")
            .attr("class", "indicatorValues")
            aux_div_proy_porc4.append("span")
            .attr("class", "startPoint")
            .html(resultados[cont_aux].MesInicioProyecto + "<br/>" + resultados[cont_aux].AnioInicioProyecto)
            aux_div_proy_porc4.append("span")
            .attr("class", "endPoint")
            .html(resultados[cont_aux].MesFinProyecto + "<br/>" + resultados[cont_aux].AnioFinProyecto)
            aux_div_proy_porc4.append("span")
            .attr("class", "middlePoint text-center")
            .html(resultados[cont_aux].porcentaje_gastado + "% <br/> Gastado ")
            var aux_div_proy_clear2 = aux_div_col.append("div")
            .attr("class", "clearfix")
            var aux_div_proy_links = aux_div_col.append("div")
            .attr("class", "row detailedLinks")
            var aux_div_col_int = aux_div_proy_links.append("div")
            .attr("class", "col-md-12")
            var aux_a = aux_div_col_int.append("a")
            .attr("href", "")
            var aud_span = aux_a.append("span")
            .attr("class", "glyphicon glyphicon-thumbs-up")
            aux_a.append("text")
            .text("Me gusta")
            aux_a.append("span")
            .attr("class", "badge pull-right")
            .text("2")
            var aux_div_col_int2 = aux_div_proy_links.append("div")
            .attr("class", "col-md-12")
            var aux_a2 = aux_div_col_int2.append("a")
            .attr("href", "")
            aux_a2.append("span")
            .attr("class", "glyphicon glyphicon-comment")
            aux_a2.append("text")
           .text("Comentarios")
            aux_a2.append("span")
            .attr("class", "badge pull-right")
            .text("2")
            var aux_div_col_int3 = aux_div_proy_links.append("div")
            .attr("class", "col-md-12")
            var aux_a3 = aux_div_col_int3.append("a")
            .attr("href", "")
            aux_a3.append("span")
            .attr("class", "glyphicon glyphicon-camera")
            aux_a3.append("text")
            .text("Fotos")
            aux_a3.append("span")
            .attr("class", "badge pull-right")
            .text(resultados[cont_aux].cantidad_fotos)

            cont_aux += 1;
    ***REMOVED***


***REMOVED***


***REMOVED***

//filterBy
$('#filterBy li').bind('click onclick', function () {
    var val_Sel = $(this).text().toUpperCase();
    if (val_Sel != "") {
        var objJson = proyectos_ini;
        var sorted = objJson;
        if (val_Sel == "MONTO") {
            sorted = $(objJson).sort(ordenaMontoDesc);
            if ($("#proyContenedor").length > 0) {
                var div_proyectos = d3.select("#proyContenedor");
                div_proyectos.html("");
                pintarProyecto(sorted, 1);
        ***REMOVED***


    ***REMOVED***
        else if (val_Sel == "PROGRESO") {
            sorted = $(objJson).sort(ordenaProgresoDesc);
            var div_proyectos = d3.select("#proyContenedor");
            div_proyectos.html("");
            pintarProyecto(sorted, 2);

    ***REMOVED*** else {
            //fecha
            sorted = $(objJson).sort(ordenaFechaIniDesc);
            var div_proyectos = d3.select("#proyContenedor");
            div_proyectos.html("");
            pintarProyecto(sorted, 3);

    ***REMOVED***


***REMOVED*** else {
        //opcion vacia

***REMOVED***

***REMOVED***);

jQuery.fn.sort = function () {
    return this.pushStack([].sort.apply(this, arguments), []);
***REMOVED***;

function ordenaMonto(a, b) {
    if (parseFloat(a.valor_presupuesto) == parseFloat(b.valor_presupuesto)) {
        return 0;
***REMOVED***
    return parseFloat(a.valor_presupuesto) > parseFloat(b.valor_presupuesto) ? 1 : -1;
***REMOVED***;
function ordenaMontoDesc(a, b) {
    return ordenaMonto(a, b) * -1;
***REMOVED***;

function ordenaProgreso(a, b) {
    if (parseFloat(a.porcentaje_gastado) == parseFloat(b.porcentaje_gastado)) {
        return 0;
***REMOVED***
    return parseFloat(a.porcentaje_gastado) > parseFloat(b.porcentaje_gastado) ? 1 : -1;
***REMOVED***;

function ordenaProgresoDesc(a, b) {
    return ordenaProgreso(a, b) * -1;

***REMOVED***;

function ordenaFechaIni(a, b) {
    return a.FechaInicioProyecto > b.FechaInicioProyecto ? 1 : -1;
***REMOVED***

function ordenaFechaIniDesc(a, b) {
    return ordenaFechaIni(a, b) * -1;
***REMOVED***