var anio = $("#anios_organismo_financiador option:selected").val();
var codigoFuente = '60';
var actualPage = 1;
var totalByPage = 10;
var finishData = 0;
var initData = 0;
inicializarDatos();
function inicializarDatos() {
    obtenerOrganismoFinanciador(anio, codigoFuente);
}
function organismoFinanciadorSelected(codigoFuenteSeleccionado) {
    codigoFuente = codigoFuenteSeleccionado;
    obtenerOrganismoFinanciador(anio, codigoFuente);
}
function anioSeleccionado(sel) {
    anio = sel.options[sel.selectedIndex].text;
    obtenerOrganismoFinanciador(anio, codigoFuente);
}
function obtenerOrganismoFinanciador(anio, codigoFuente) {
    $("#divDatosConsolidado").empty();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: "api/ServiciosOrganismoFinanciador/GetOrganismosFinanciadoresPorAnioAndCodigoFuente",
        type: "GET",
        data: {
            anio: anio,
            codigofuente: codigoFuente
        }
    }).done(function (data) {
        //console.log("data", data);
        $("#totalFinanciadores").empty();
        $("#totalFinanciadores").html(data.totalFinanciadores);
        $("#totalProyectosFinanciados").empty();
        $("#totalProyectosFinanciados").html(data.totalProyectosFinanciados);
        $("#totalAportado").empty();
        $("#totalAportado").html("RD " + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(data.totalAportado) + " M");
        let dataTable = "";
        $("#divPaginator").empty();

        for (var i = 0; i < data.financiadores.length; i++){
            dataTable = dataTable + '<div class="card-entidades-group">' +
                '<div class="card d-flex">'+
                    '<div class="headEnt">' +
                        '<div class="data1 mainDataEntidad">' +
                            '<span class="td1">' + data.financiadores[i].nombre + '</span>' + 
                        '</div>' +
                        '<div class="data1">' +
                            '<span class="labelTit">Monto financiado</span>' +
                            '<span class="td1">RD ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(data.financiadores[i].montoFinanciado)+' M</span>' +
                        '</div>' +
                        '<div class="data1b">' +
                            '<span class="labelTit">Proyectos financiados</span>' +
                            '<span class="td1">' + data.financiadores[i].proyectosFinanciados +'</span>' + 
                        '</div>' +
                        '<div class="data1b">' +
                            '<span class="labelTit">Finalizados</span>' +
                            '<span class="td1">' + data.financiadores[i].proyectosFinalizados +'</span>' +
                        '</div>' +
                        '<div class="data1b">' +
                            '<span class="labelTit">En reevaluación</span>' +
                            '<span class="td1">' + data.financiadores[i].proyectosEnReevaluacion+'</span>' +
                        '</div>' +
                        '<div class="data1b">' +
                            '<span class="labelTit">Paralizados</span>'+
                            '<span class="td1">' + data.financiadores[i].proyectosParalizados+'</span>'+
                        '</div>' +
                    '</div>'+
                    '<div class="btn-action">' +
                        '<div class="btnPerfil">' +
                            '<a target="_blank" href="FinancialOrganizationDetail?id=' + data.financiadores[i].codigoOrganismo + '&anio=' + anio +'" class="text-small"><i class="material-icons md-18">arrow_forward</i><br> <span>Ver organismo</span></a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '</div >';
        }
        $("#table_financiadores").empty();
        $("#table_financiadores").html(dataTable);
}).fail(function (xhr, ajaxOptions, thrownError) {
    alert("Error " + xhr.status + "_" + thrownError);
});
}