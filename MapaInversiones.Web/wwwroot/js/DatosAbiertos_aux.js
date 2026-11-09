inicializaDatosAbiertos();

function inicializaDatosAbiertos() {
    //cargarfuentesdatos();
    cargarfuentesdatos2();
}

function cargarfuentesdatos2() {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosDatosAbiertos/ObtenerFuentesDatos",
        cache: false,
        data: false,
        success: function (result) {
            if (result.status == true) {
                var info = result.fuentesRecursos;               
                var htmldivfuente = '';
                if (info != null) {
                    var htmldivfuente = '';
                    for (var i = 0; i < info.length; i++) {
                        htmldivfuente += '<div class="columna fuentes_content">';
                        htmldivfuente += '<h3>' + info[i].nombreFuente + '</h3>';
                        htmldivfuente += '<p class="fuente_act">Última actualización<br>' + info[i].fechaActualizacionFuente.toString().substr(0, 10) + '</p>';
                        htmldivfuente += '<p class="fuente_corte">Corte de los datos<br>' + info[i].fechaCorteFuente.toString().substr(0, 10) + '</p>';
                        htmldivfuente += '<p class="fuente_desc">Fuente:<br><span class="semibold">' + info[i].descripcion + '</span></p>';
                        htmldivfuente += '</div>';
                    }
                    $("#datosAbiertosFooter").html(htmldivfuente);
                }
            } else {
                bootbox.alert("Error: " + result.Message, function () {

                });
            }
        },
        error: function (response) {
            bootbox.alert(response.responseText);
        },
        failure: function (response) {
            bootbox.alert(response.responseText);
        }
    });
}

function cargarfuentesdatos() {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosDatosAbiertos/ObtenerFuentesDatos",
        cache: false,
        data: false,
        success: function (result) {
            if (result.status == true) {
                var info = result.fuentesRecursos;
                var numproyectos = 0;
                var aportado = 0;
                var htmldivfuente = '';
                var numeroorganismosmostrar = 3;
                if (info != null) {
                    for (var i = 0; i < info.length; i++) {
                        var classdivfuente = "fuente" + info[i].idFuente;
                        numproyectos += info[i].numeroProyectos;
                        aportado += info[i].valorVigente;
                        var htmldivfuente = '';
                            htmldivfuente += '<div class="fuentes-data">';
                            htmldivfuente += '<div class="source-fuente" ><span class="">Fuente de datos:</span><span class="text-bold">' + info[i].nombreFuente + '</span></div>';
                        htmldivfuente += '<div class="source-fuente"><span class="">Última actualización:</span><span class="text-bold">' + info[i].fechaActualizacionFuente.toString().substr(0, 10) + '</span></div>';
                        htmldivfuente += '</div>';

                        $("." + classdivfuente).html(htmldivfuente);


                    }
                    
                }

            } else {
                bootbox.alert("Error: " + result.Message, function () {

                });
            }

        },
        error: function (response) {
            bootbox.alert(response.responseText);
        },
        failure: function (response) {
            bootbox.alert(response.responseText);
        }
    });
}

function cargaannos(setdatos,datos,elemsel,elemdic,elemultimaact,elemfuente) {
    var results = [];
    var searchField = "DisplayText";
    var searchVal = datos;
    var selectannos = "";
    for (var i = 0; i < setdatos.ContentItems.length; i++) {
        if (setdatos.ContentItems[i][searchField] == searchVal) {
            var datosannos = setdatos.ContentItems[i]["BagPart"];
            for (var j = 0; j < datosannos.ContentItems.length; j++) {
                var anno = datosannos.ContentItems[j].LinkDatosAbiertos.Anno.Text;
                var urlcvs = datosannos.ContentItems[j].LinkDatosAbiertos.EnlaceCVS.Url;
                var urlxls = datosannos.ContentItems[j].LinkDatosAbiertos.EnlaceXLS.Url;
                if (j == 0) {
                    selectannos += '<option selected value="' + anno + '" urlcvs="' + urlcvs + '" urlxls="' + urlxls + '" >' + anno + '</option>';
                } else {
                    selectannos += '<option value="' + anno + '" urlcvs="' + urlcvs + '" urlxls="' + urlxls + '" >' + anno + '</option>';
                }
                $("#" + elemsel).html(selectannos);
            }
            document.getElementById(elemdic).href = setdatos.ContentItems[i].DescargaDatosAbiertos.UrlBotonDiccionario.Url;
            $("#" + elemultimaact).text(setdatos.ContentItems[i].DescargaDatosAbiertos.Ultimaactualizacion.Text);
            $("#" + elemfuente).text(setdatos.ContentItems[i].DescargaDatosAbiertos.Fuente.Text);
            
        }
    }
}

function descargar(sel, rad) {
    var valrad = $('input[name="' + rad + '"]:checked').val();
    var url = "";
    if (valrad == 'CVS') {
        url = $("#" + sel + " option:selected").attr("urlcvs");
    } else if (valrad == 'XLS') {
        url = $("#" + sel + " option:selected").attr("urlxls");
    }
    if ((url == undefined) || (url == "") || (url == null) || (url == "null")) {
        alert('No existe set de datos en el formato seleccionado');

    }
    else {
        window.location.href = url;
    }
}

$("#datoscontratos").on("change", function () {
    var datos = $("#datoscontratos option:selected").val()
    cargaannos(datoscontrato, datos, 'annocontratos', 'idDicContratos', 'idUltimaActContratos', 'FuenteContratos');
});
