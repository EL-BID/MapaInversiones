GetProyectoById();

//alert("holaaaa");

function GetProyectoById() {
    $.ajax({
        url: "/api/servicioshome/GetAllAsync",
        type: "GET",
        data: null,

    }).done(function (data) {
        // Some function
        alert("hecho");
    }).fail(function (handleError) {
        // Some function
        alert("fail");
    });
}


