window.addEventListener('load', function () {
    var tabEnlace = $('#tabEnlace').val(); 
    var liTarget = null;

    if (tabEnlace === "1") {
        liTarget = $('#tab_empresario');
    } else if (tabEnlace === "2") {
        liTarget = $('#tab_veedor');
    }

    if (liTarget && liTarget.length) {
        setTimeout(function () {
            liTarget.trigger("click");
        }, 100); 
    }
});




