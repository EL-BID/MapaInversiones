GetProyectoById();

//alert("holaaaa");

function GetProyectoById() {
    $.ajax({
        url: "/api/servicioshome/GetAllAsync",
        type: "GET",
        data: null,

***REMOVED***).done(function (data) {
        // Some function
        alert("hecho");
***REMOVED***).fail(function (handleError) {
        // Some function
        alert("fail");
***REMOVED***);
***REMOVED***


