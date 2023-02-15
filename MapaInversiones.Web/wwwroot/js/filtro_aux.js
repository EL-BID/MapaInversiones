//autocompletar en funciones
$("#entidad").on("keyup", function (event) {
    if (event.keyCode == 9 || event.keyCode == 13) {
        event.preventDefault();
***REMOVED*** else {
        if (event.keyCode == 8) {
            if ($(this).val().length <= 1) {
                $(this).val("");

        ***REMOVED***
    ***REMOVED***
***REMOVED***
***REMOVED***).autocomplete({
    source: function (request, response) {
        var filtros = {
            filtro: request.term,
            anyo: 2022
    ***REMOVED***;
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
            ***REMOVED*** else {
                    $("#divNoEncontrado").hide();
                    response($.map(datos.funciones, function (item) {
                        //x alert(item);
                        return {
                            label: item.label,
                            value: item.label
                    ***REMOVED***;

                ***REMOVED***
                    ));

            ***REMOVED***
          ***REMOVED***
            error: function (response) {
                alert(response.responseText);
          ***REMOVED***
            failure: function (response) {
                alert(response.responseText);
        ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
    delay: 300,
    minLength: 1,
    select: function (event, ui) {
        //$(this).val(ui.item.Nombre).next().val(ui.item.Id);
        //$("#divResultados").html("");
        //return false;
***REMOVED***
***REMOVED***).bind('blur onblur', function () {
    if ($(this).val() == "") {
        $(this).val("");
        $("#divNoEncontrado").hide();
***REMOVED***

***REMOVED***);