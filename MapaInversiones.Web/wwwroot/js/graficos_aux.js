loadBarChartGraph("divGraphBarras");
loadDonaGraph("divGraphDona");
loadTreeMapGraph("divTreemap");


function loadDonaGraph(divContenedor) {
    var myData = [
        { "labelGroup": "Empresa Nacional de Energía Eléctrica", "rawValue": (5823840893 / 1000000), "porcentaje": 24.7, "color": "#639CBF" ***REMOVED***,
        { "labelGroup": "Secretaría de Infraestructura y Transporte", "rawValue": (3871722058 / 1000000), "porcentaje": 16.4, "color": "#78B8BF"***REMOVED***,
        { "labelGroup": "Red Solidaria", "rawValue": (3833179985 / 1000000), "porcentaje": 16.2, "color": "#A65D5D"***REMOVED***,
        { "labelGroup": "Secretaría de Agricultura y Ganadería", "rawValue": (1860950990 / 1000000), "porcentaje": 7.9, "color": "#4C5959"***REMOVED***,
        { "labelGroup": "Secretaría de Salud", "rawValue": (1843312136 / 1000000), "porcentaje": 7.8, "color": "#3185A3"***REMOVED***,
        { "labelGroup": "Fondo Hondureño de Inversión Social", "rawValue": (1493673469 / 1000000), "porcentaje": 6.3, "color": "#56B4D6"***REMOVED***,
        { "labelGroup": "Secretaría de Recursos Naturales y Ambiente (MI AMBIENTE+)", "rawValue": (725000000 / 1000000), "porcentaje": 3.1, "color": "#56D6B2" ***REMOVED***,
        { "labelGroup": "Secretaría de Educación", "rawValue": (483855487 / 1000000), "porcentaje": 2.1, "color": "#4FBCE3"***REMOVED***,
        { "labelGroup": "Empresa Hondureña de Telecomunicaciones (HONDUTEL)", "rawValue": (400000000 / 1000000), "porcentaje": 1.7, "color": "#9BDDCA" ***REMOVED***,
        { "labelGroup": "Registro Nacional de las Personas", "rawValue": (400000000 / 1000000), "porcentaje": 1.7, "color": "#41A387"***REMOVED***,
        { "labelGroup": "Otras instituciones", "rawValue": (2878355040 / 1000000), "porcentaje": 12.2, "color": "#5A6A70" ***REMOVED***
    ];

    new d3plus.Donut()
        .select("#divGraphDona")

        .config({
            data: myData,
            groupBy: "labelGroup",
            label: d => d["porcentaje"] + "%",
            height: 665,
            //innerRadius: 50,
            padAngle: 0.01,
            legend: true,
            legendPosition: function () {
                return this._width > this._height ? "right" : "bottom";
          ***REMOVED***
            value: "rawValue",
            color: "color",
            tooltipConfig: {
                title: function (d) {
                    return d["labelGroup"];
              ***REMOVED***
                tbody: [
                    [function (d) {

                        var cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones";
                        if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                            cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones" + " <strong>(" + d["porcentaje"].formatMoney(1, '.', ',').toString() + " %)</strong>";
                    ***REMOVED***
                        return cad_aux;

                ***REMOVED***]
                ]
        ***REMOVED***
            ,legendConfig: {
                label(d, i) {
                    return d["labelGroup"];
              ***REMOVED***
            
        ***REMOVED***
    ***REMOVED***)
        .legendTooltip({ footer: "" ***REMOVED***)
        .on({ "click.legend": () => { ***REMOVED*** ***REMOVED***)
        .render();

***REMOVED***

function formatoDecimales(n,c,d,t) {
    //var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
      var s = n < 0 ? "-" : "",
      var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
      var j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

***REMOVED***

function loadBarChartGraph(divContenedor) {
    var objData = [
        { "periodo": 2023, "x": 1, "labelGroup": "Energia", "rawValue": (5823840893 / 1000000), "porcentaje": 24.66 ***REMOVED***,
        { "periodo": 2023, "x": 2, "labelGroup": "Carreteras", "rawValue": (3871722058 / 1000000), "porcentaje": 16.39 ***REMOVED***,
        { "periodo": 2023, "x": 3, "labelGroup": "Protección Social", "rawValue": (3735148184 / 1000000), "porcentaje": 15.81 ***REMOVED***,
        { "periodo": 2023, "x": 4, "labelGroup": "Salud", "rawValue": (2210133891 / 1000000), "porcentaje": 9.35 ***REMOVED***,
        { "periodo": 2023, "x": 5, "labelGroup": "Seguridad Alimentaria", "rawValue": (1692074080 / 1000000), "porcentaje": 7.16 ***REMOVED***,
        { "periodo": 2023, "x": 6, "labelGroup": "Forestal", "rawValue": (1120971903 / 1000000), "porcentaje": 4.74 ***REMOVED***,
        { "periodo": 2023, "x": 7, "labelGroup": "Educación", "rawValue": (1096085635 / 1000000), "porcentaje": 4.64 ***REMOVED***,
        { "periodo": 2023, "x": 8, "labelGroup": "Fortalecimiento Institucional", "rawValue": (1014570349 / 1000000), "porcentaje": 4.29 ***REMOVED***,
        { "periodo": 2023, "x": 9, "labelGroup": "Agua y Saneamiento", "rawValue": (857828749 / 1000000), "porcentaje": 3.63 ***REMOVED***,
        { "periodo": 2023, "x": 10, "labelGroup": "Otras Inversiones  por Definir", "rawValue": (695034722 / 1000000), "porcentaje": 2.94 ***REMOVED***,
        { "periodo": 2023, "x": 11, "labelGroup": "Transporte y Obras Públicas", "rawValue": (496119660 / 1000000), "porcentaje": 2.10 ***REMOVED***,
        { "periodo": 2023, "x": 12, "labelGroup": "Inversión Social", "rawValue": (400000000 / 1000000), "porcentaje": 1.69 ***REMOVED***,
        { "periodo": 2023, "x": 13, "labelGroup": "Telecomunicaciones", "rawValue": (400000000 / 1000000), "porcentaje": 1.69 ***REMOVED***,
        { "periodo": 2023, "x": 14, "labelGroup": "Seguridad", "rawValue": (200359934 / 1000000), "porcentaje": 0.84 ***REMOVED***


    ];


    var distintos = objData.map(item => item.periodo)
        .filter((value, index, self) => self.indexOf(value) === index);

    $("#" + divContenedor).empty();
    if (objData != undefined && objData != null) {
        var ordenado = objData.sort(function (a, b) {
            if (a.rawValue > b.rawValue)
                return -1;
            if (a.rawValue < b.rawValue)
                return 1;
            return 0;
    ***REMOVED***);

        new d3plus.BarChart()
            .select("#" + divContenedor)
            .translate(function (d) {
                var traduc_aux = d;
                if (d === "Back" || d === "back") {
                    traduc_aux = "Atrás";
            ***REMOVED*** else if (d === "Click to Expand") {
                    traduc_aux = "Clic para Expandir";
            ***REMOVED*** else if (d === "No Data Available") {
                    traduc_aux = "Información No Disponible";
            ***REMOVED*** else {
                    traduc_aux = d;
            ***REMOVED***
                return traduc_aux;
        ***REMOVED***)
            .config({
                data: ordenado,
                groupBy: "labelGroup",
                label: function (d) {
                    return formatoDecimales(d["rawValue"],1, '.', ',');
              ***REMOVED***
                legendPosition: 'bottom',
                height: 700,
                x: "rawValue",
                y: "labelGroup",
                discrete: 'y',
                shapeConfig: {
                    fill: function (d, index) {
                        var val_aux = 0;
                        if (d.periodo != undefined && d.periodo != null && d.periodo != "") {
                            val_aux = parseInt(d.periodo);
                    ***REMOVED***
                        var index = distintos.indexOf(val_aux);
                        return assignColorBarrasFunc(index);

                  ***REMOVED***
                    labelConfig: {
                        fontFamily: "'Montserrat', sans-serif",
                        align: "center",
                        size: 6,
                        transform: "capitalize",
                        fontMin: 4,
                        fontMax: 8,
                        
                ***REMOVED***
              ***REMOVED***
                tooltipConfig: {
                    title: function (d) {
                        return d["labelGroup"] + " " + d["periodo"];
                  ***REMOVED***
                    tbody: [
                        [function (d) {

                            var cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones";
                            if (d["porcentaje"] != undefined && d["porcentaje"] != null) {
                                cad_aux = "L " + d["rawValue"].formatMoney(1, '.', ',').toString() + " Millones" + " <strong>(" + d["porcentaje"].formatMoney(1, '.', ',').toString() + " %)</strong>";
                        ***REMOVED***
                            return cad_aux;

                    ***REMOVED***]
                    ]
              ***REMOVED***
                xConfig: {
                    title: "Millones de Lempiras",
                    scale: "pow",
                    ticks:false,
                    //tickFormat: function (d) {
                    //    return " ";
                    //***REMOVED***
              ***REMOVED***
                yConfig: {
                    title: "Sectores",
                    fontsize: "2px",
                    size: "2px"
              ***REMOVED***
                legend: false
        ***REMOVED***)
            .barPadding(0)
            .groupPadding(12)
            .render();
***REMOVED***


***REMOVED***

function assignColorPaleta(indice) {
    var color_aux = "#CCCCCC";
    var col_sel = color_aux;
    var colores_default = ["#639CBF", "#78B8BF", "#A65D5D", "#4C5959", "#78B8BF", "#56B4D6", "#56D6B2", "#4FBCE3", "#9BDDCA", "#41A387", "#5A6A70", "#3185A3",
    "#387CA6", "#96D2D9", "#F2E8C9", "#728EA6", "#BACDD9", "#F2E4DC", "#B0C1D9", "#88A5BF", "#D9BFA9", "#F29863", "#F2C1AE", "#BF9C99"];
    if (indice < colores_default.length) {
        col_sel = colores_default[indice];
***REMOVED***
    return col_sel;
***REMOVED***

function assignColor(indice) {
    var colores_default = ["#57BEC3","#7CBAC9", "#FBC99A", , "#F7B6A7"];
    return colores_default[indice];
***REMOVED***

function assignColorBarrasFunc(item) {
    var colores_default = ['#78B8BF','#639CBF', '#78B8BF"', '#4C5959','#56B4D6'];
    return colores_default[item];

***REMOVED***

function groupAndSum(arr, groupKeys, sumKeys) {
    return Object.values(
        arr.reduce((acc, curr) => {
            const group = groupKeys.map(k => curr[k]).join('-');
            acc[group] = acc[group] || Object.fromEntries(
                groupKeys.map(k => [k, curr[k]]).concat(sumKeys.map(k => [k, 0])));
            sumKeys.forEach(k => acc[group][k] += curr[k]);
            return acc;

      ***REMOVED*** {***REMOVED***)
    );
***REMOVED***
function loadTreeMapGraph(divContenedor) {
    var objData = [
        { "parent": "1", "labelGroup": "FRANCISCO MORAZÁN", "rawValueDouble": 6975159483.28242, "porcentaje": 0, "poblacion": 1508906 ,"proyectos":64***REMOVED***,
        { "parent": "1", "labelGroup": "CORTES", "rawValueDouble": 4550203434.1961, "porcentaje": 0, "poblacion": 1562394, "proyectos": 36***REMOVED***,
        { "parent": "1", "labelGroup": "OLANCHO", "rawValueDouble": 3283792459.15149, "porcentaje": 0, "poblacion": 520761, "proyectos": 48***REMOVED***,
        { "parent": "1", "labelGroup": "EL PARAÍSO", "rawValueDouble": 1507550795.57777, "porcentaje": 0, "poblacion": 444507, "proyectos":26***REMOVED***,
        { "parent": "1", "labelGroup": "SANTA BÁRBARA", "rawValueDouble": 1202912672.38918, "porcentaje": 0, "poblacion": 421337, "proyectos":23 ***REMOVED***,
        { "parent": "2", "labelGroup": "YORO", "rawValueDouble": 866660195.56485, "porcentaje": 0, "poblacion": 570595, "proyectos":28 ***REMOVED***,
        { "parent": "2", "labelGroup": "COPÁN", "rawValueDouble": 929441188.610502, "porcentaje": 0, "poblacion": 371057, "proyectos":33***REMOVED***,
        { "parent": "2", "labelGroup": "INTIBUCÁ", "rawValueDouble": 667194655.627341, "porcentaje": 0, "poblacion": 232553, "proyectos":24***REMOVED***,
        { "parent": "2", "labelGroup": "COMAYAGUA", "rawValueDouble": 617494713.268798, "porcentaje": 0, "poblacion": 493466, "proyectos":30***REMOVED***,
        { "parent": "2", "labelGroup": "OCOTEPEQUE", "rawValueDouble": 503299439.070441, "porcentaje": 0, "poblacion": 146430, "proyectos":25***REMOVED***,
        { "parent": "3", "labelGroup": "COLÓN", "rawValueDouble": 381778402.055055, "porcentaje": 0, "poblacion": 309926, "proyectos":15***REMOVED***,
        { "parent": "3", "labelGroup": "LEMPIRA", "rawValueDouble": 356721847.739591, "porcentaje": 0, "poblacion": 321179, "proyectos":19***REMOVED***,
        { "parent": "3", "labelGroup": "VALLE", "rawValueDouble": 329545713.713244, "porcentaje": 0, "poblacion": 174511, "proyectos":20 ***REMOVED***,
        { "parent": "3", "labelGroup": "CHOLUTECA", "rawValueDouble": 460148377.438564, "porcentaje": 0, "poblacion": 437618, "proyectos":27***REMOVED***,
        { "parent": "3", "labelGroup": "ATLÁNTIDA", "rawValueDouble": 248574764.457373, "porcentaje": 0, "poblacion": 436252, "proyectos":22***REMOVED***,
        { "parent": "3", "labelGroup": "LA PAZ", "rawValueDouble": 473343359.854955, "porcentaje": 0, "poblacion": 198926, "proyectos":24***REMOVED***,
        { "parent": "3", "labelGroup": "ISLAS DE LA BAHÍA", "rawValueDouble": 141956474.116752, "porcentaje": 0, "poblacion": 62557, "proyectos":11 ***REMOVED***,
        { "parent": "3", "labelGroup": "GRACIAS A DIOS", "rawValueDouble": 118112081.864668, "porcentaje": 0, "poblacion": 90795, "proyectos":13***REMOVED***
    ];

    var distintos = objData.map(item => item.parent)
        .filter((value, index, self) => self.indexOf(value) === index);

    var sumaTotal = objData.reduce(function (_this, val) {
        return _this + val.rawValueDouble
  ***REMOVED*** 0);

    $.each(objData, function (key, item) {
        //console.log(item.com);
        var porc_aux = (item.rawValueDouble / sumaTotal) * 100;
        item.porcentaje = porc_aux;
***REMOVED***);

    if (objData != undefined && objData != null) {
        var grafica = new d3plus.Treemap()
            .select("#" + divContenedor)
            .shapeConfig({
                label: (d) => {
                    auxiliar = [d.labelGroup, formatoDecimales(d["porcentaje"], 1, '.', ',') + "%"];
                    return auxiliar;
              ***REMOVED***
                labelConfig: {
                    fontFamily: "'Montserrat', sans-serif",
                    align: "center",
                    size: 6,
                    transform: "capitalize"
              ***REMOVED*** fill: function (d, index) {
                    //var index = distintos.indexOf(d["parent"]); 
                    return assignColorPaleta(index);

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
                data: objData,
                groupBy: ["parent","labelGroup"],
                height: 500,
                tooltipConfig: {
                    title: function (d) {
                         return d.labelGroup;
                  ***REMOVED***
                    tbody: [
                        [function (d) {
                            var valor = d["rawValueDouble"] / 1000000;
                            var cantPoblacion = d["poblacion"];
                            var cantProy = d["proyectos"];
                            var cad = "";
                            cad += "<span style='float:left;'>Monto total de la inversión&nbsp;</span><strong style='float:right;'>" + " L " + valor.formatMoney(1, '.', ',').toString() + " Millones" + "</strong></br>";
                            cad += "<span style='float:left;'>Cantidad de proyectos&nbsp;</span><strong style='float:right;'>" + cantProy.formatMoney(0, '.', ',').toString() + "</strong></br>";
                            cad += "<span style='float:left;'>Población&nbsp;</span><strong style='float:right;'>" + cantPoblacion.formatMoney(0, '.', ',').toString() + "</strong>";
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
            .render();
***REMOVED***

***REMOVED***


Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
       var s = n < 0 ? "-" : "",
       var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
       var j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3***REMOVED***)(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
***REMOVED***;