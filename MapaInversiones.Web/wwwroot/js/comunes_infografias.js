function GetEntidadesPresupuesto() {
    $.ajax({
        url: "api/ServiciosPresupuestoNew/GetEntidadesPlanNacional",
        type: "GET",
        data: null,

    }).done(function (data) {
        var entidadPlanNacional = document.getElementById("entidadesPlanNacional");
        var htmlList = '';
        for (var i = 0; i < data.length; i++) {
            htmlList = htmlList + "<li class='list-group-item'><a href=" + '/PerfilEntidad?codEntidad=' + data[i].codEntidad + ">" + "<span>" + data[i].nombre + "</span><i class='material-icons md-18'>chevron_right</i></a></li>";
        }
        if (data.length > 0)
            htmlList = htmlList + "<li class='list-group-item'><a href='/BusquedaResultados?Type=Entidad'>" + "<span>Ver todos</span><i class='material-icons md-18'>chevron_right</i></a></li>";
        entidadPlanNacional.innerHTML = htmlList;
    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });
}