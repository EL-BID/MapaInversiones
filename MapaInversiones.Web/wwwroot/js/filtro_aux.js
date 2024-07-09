//autocompletar en funciones
$("#entidad").on("keyup", function (event) {
    if (event.keyCode == 9 || event.keyCode == 13) {
        event.preventDefault();
    } else {
        if (event.keyCode == 8) {
            if ($(this).val().length <= 1) {
                $(this).val("");

            }
        }
    }
}).autocomplete({
    source: function (request, response) {
        var filtros = {
            filtro: request.term,
            anyo: 2022
        };
        $.ajax({
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/ServiciosPresupuestoNew/ObtenerFuncionesPerNombre/",
            cache: false,
            data: filtros,
            success: function (data) {
                var datos = data;

                if (datos == null || datos.funciones.length <= 0) {
                    $("#divNoEncontrado").show();
                    $("#ui-id-1").hide();
                } else {
                    $("#divNoEncontrado").hide();
                    response($.map(datos.funciones, function (item) {

                        return {
                            label: item.label,
                            value: item.label
                        };

                    }
                    ));

                }
            },
            error: function (response) {
                alert(response.responseText);
            },
            failure: function (response) {
                alert(response.responseText);
            }
        });
    },
    delay: 300,
    minLength: 1,
    select: function (event, ui) {

    }
}).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).val("");
        $("#divNoEncontrado").hide();
    }

});