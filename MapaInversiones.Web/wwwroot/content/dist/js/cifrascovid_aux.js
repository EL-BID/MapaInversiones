
var dataCifrasCovid;
var dataCifrasCovidConsolidado;
var dataCifrasCovidSubsidios;
var dataCifrasCovidContratos;
var dataCifrasCovidGastosObjeto;
var dataProgramasCovid;
var dataSubsidiosCovid;
var dataContratosCovid;
var dataObjetoGastosCovid;
var programaFiltro;
var programaFiltroParticipa;
var subsidioFiltro;

require([
    'comunes',
    'app/network/Services',
],
    function (
        comunes,
        Services
    ) {

        loadDataProgramaCovid();
        loadDataSubsidiosCovid(true);
        loadDataContratosCovid();


        $("#divEnlaceParticipa").on('click', function (e) {
            var url = "/Participa/Comentarios/";
            window.location.href = url;
        });


        $("#divEnlaceSolicita").on('click', function (e) {
            var url = "/Participa/AccesoInformacion/";
            window.location.href = url;
        });


        $("#divEnlaceDeclaraciones").on('click', function (e) {
            var url = "/Covid/Declaraciones/";
            window.location.href = url;
        });

        function loadDataProgramaCovid() {

           
            var datos = [];
            var filtrodatos = "";
            var entidades = [];

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCifrasCovid/GetConsolidadoCifrasCovidPrograma",
                cache: false,

                success: function (result) {
                    if (result.status == true) {
                        var items_result = result.DetalleCovidCifras;
                        dataCifrasCovidConsolidado = items_result;

                        var items_result_programas = result.ListProgramas;
                        dataProgramasCovid = items_result_programas;

                       

                        for (var i = 0; i < items_result.length; i++) {

                            if (!entidades.includes(items_result[i].Entidad.toString())) {
                                entidades.push(items_result[i].Entidad.toString());
                                datos.push({ "value": items_result[i].Entidad.toString() });
                            }
                        }

                        comunes.load_filtro_programas_auto_select("divFiltroCovidProgramas", "filterByCovidProgramasGeneral", false, datos, datos.length - 1);
                        comunes.load_filtro_programas_auto_select("divFiltroCovidProgramasParticipa", "filterByCovidProgramasGeneralParticipa", false, datos, datos.length - 1);

                        if (datos.length > 0) {
                            if (filtrodatos == "") filtrodatos = datos[datos.length - 1].value;
                            ObtenerDatosPrograma(filtrodatos);
                            ObtenerDatosProgramaParticipa(filtrodatos);
                        }

                        $('#filterByCovidProgramasGeneral li').bind('click onclick', function () {
                            if ($(this).index() >= 0) {
                                var ProgramaSel = $(this)[0].innerText;
                                if (ProgramaSel != "") {
                                    ObtenerDatosPrograma(ProgramaSel);
                                }
                            }
                        });

                        $('#filterByCovidProgramasGeneralParticipa li').bind('click onclick', function () {
                            if ($(this).index() >= 0) {
                                var ProgramaSel = $(this)[0].innerText;
                                if (ProgramaSel != "") {
                                    ObtenerDatosProgramaParticipa(ProgramaSel);
                                }
                            }
                        });

                        $("#divEnlacePrograma").on('click', function (e) {
                            var ruc = $(this).attr('data-parameter');
                            document.cookie = "ruc=" + ruc + ";path=/;";
                            var url = "/covid/PerfilPrograma/?programa_id=" + programaFiltro;
                            window.location.href = url;
                        });

                      


                    } else {
                        bootbox.alert("Error: " + result.message, function () {

                        });
                    }

                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });
        }

        function loadDataSubsidiosCovid(consolidado) {
            var datos = [];
            var filtrodatos = "";

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCifrasCovid/GetConsolidadoCifrasCovidSubsidios",
                cache: false,

                success: function (result) {
                    if (result.status == true) {
                        var items_result = result.DetalleCovidCifras;
                        dataCifrasCovidSubsidios = items_result;
                        var items_result_programas = result.ListSubsidios;
                        dataSubsidiosCovid = items_result_programas.sort();

                        var items_result_pro = items_result_programas.sort();
                        for (var i = 0; i < items_result_pro.length; i++) {
                            datos.push({ "value": items_result_pro[i].TipoSubsidio.toString() });
                        }

                        comunes.load_filtro_programas_auto_select("divFiltroCovidSubsidios", "filterByCovidSubsidiosGeneral", false, datos, 0);
                        if (datos.length > 0) {
                            if (filtrodatos == "") filtrodatos = datos[0].value;
                            ObtenerDatosSubsidios(filtrodatos);
                        }
                        $('#filterByCovidSubsidiosGeneral li').bind('click onclick', function () {
                            if ($(this).index() >= 0) {
                                var ProgramaSel = $(this)[0].innerText;
                                if (ProgramaSel != "") {
                                    ObtenerDatosSubsidios(ProgramaSel);
                                }
                            }
                        });

                        $("#divEnlaceSubsidios").on('click', function (e) {
                            var id_subsidio = $(this).attr('data-parameter');
                            var url = "/Covid/PerfilSubsidio/?subsidio=" + subsidioFiltro;
                            if (subsidioFiltro == "126214") url = "/Covid/PerfilSubsidiov2/?subsidio=" + subsidioFiltro;
                            window.location.href = url;
                        });


                    } else {
                        bootbox.alert("Error: " + result.message, function () {

                        });
                    }

                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });
        }

        function loadDataContratosCovid() {
            var datos = [];
            var filtrodatos = "";

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCifrasCovid/GetConsolidadoCifrasCovidContratos",
                cache: false,

                success: function (result) {
                    if (result.status == true) {
                        var items_result = result.DetalleCovidCifras;
                        dataCifrasCovidContratos = items_result;

                        if (dataCifrasCovidContratos.length > 0) {
                            ObtenerDatosContratos();
                        }


                    } else {
                        bootbox.alert("Error: " + result.message, function () {

                        });
                    }

                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });
        }


        function ObtenerDatosSubsidios(filtro) {
            for (var i = 0; i < dataCifrasCovidSubsidios.length; i++) {
                if (dataCifrasCovidSubsidios[i].TipoSubsidio == filtro) {
                    var idSubsidio = dataCifrasCovidSubsidios[i].IdSubsidio;
                    subsidioFiltro = dataCifrasCovidSubsidios[i].IdSubsidio;
                    var rutaficha = "../Covid/PerfilSubsidio/?subsidio=" + idSubsidio;
                    if (dataCifrasCovidSubsidios[i].IdSubsidio == 126214) {
                        rutaficha = "../Covid/PerfilSubsidiov2/?subsidio=" + idSubsidio;
                    } 
                    if (dataCifrasCovidSubsidios[i].IdSubsidio == 234211) {
                        rutaficha = "../Covid/PerfilFarmacias";
                    }
                    
                    
                    $("#divnombresubsidio").html("<span>" + dataCifrasCovidSubsidios[i].TipoSubsidio + "</span>");
                    $("#divvalorsubsidio").html("L " + numberWithCommas(convertirMillones(parseFloat(Math.round(dataCifrasCovidSubsidios[i].GastoSubsidio)).toFixed(0))) + tituloMillones(parseFloat(Math.round(dataCifrasCovidSubsidios[i].GastoSubsidio)).toFixed(0)));
                    $("#diventregadossubsidios").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].cantSubsidiosEntregados)).toFixed(0)));
                    $("#divciudadanosbeneficiados").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].NumeroCiudadanosBeneficiados)).toFixed(0)));
                    $('#enlaceSubsidios').attr('href', rutaficha);
                }
            }
        }

        function ObtenerDatosPrograma(filtro) {
            var PresupuestoProgramas = 0;
            var ValorAvance = 0;
            for (var i = 0; i < dataCifrasCovidConsolidado.length; i++) {
                if (dataCifrasCovidConsolidado[i].Entidad == filtro) {
                    programaFiltro = dataCifrasCovidConsolidado[i].CodigoPrograma;

                    PresupuestoProgramas = PresupuestoProgramas + dataCifrasCovidConsolidado[i].PresupuestoProgramas;
                    ValorAvance = ValorAvance + dataCifrasCovidConsolidado[i].GastoActual;
                    $("#divnombreprograma").html("<span>" + dataCifrasCovidConsolidado[i].Entidad + "</span>");
                    $("#divvalorprograma").html("L" + numberWithCommas(convertirMillones(parseFloat(Math.round(PresupuestoProgramas * 100) / 100).toFixed(0))) + tituloMillones(parseFloat(Math.round(PresupuestoProgramas * 100) / 100).toFixed(0)));
                    $("#divvalorAvance").html("L" + numberWithCommas(convertirMillones(parseFloat(Math.round(ValorAvance * 100) / 100).toFixed(0))) + tituloMillones(parseFloat(Math.round(ValorAvance * 100) / 100).toFixed(0)));

                    //AND SOLO PARA SALUD 
                    //if (programaFiltro=='12828')
                    //{
                    //    $("#Mensajesalud").text("*El avance puede ser reportado posteriormente");
                    //} else
                    //{
                    //    $("#Mensajesalud").text("");
                    //}
                }
            }
        }

        function ObtenerDatosProgramaParticipa(filtro) {
            for (var i = 0; i < dataCifrasCovidConsolidado.length; i++) {
                if (dataCifrasCovidConsolidado[i].Entidad == filtro) {
                    programaFiltroParticipa = dataCifrasCovidConsolidado[i].CodigoPrograma;

                }
            }
        }

        function convertirMillones(num) {
            return num > 999999 ? (num / 1000000).toFixed(0) : num
        }

        function tituloMillones(num) {
            return num > 999999 ? " Millones" : ""
        }

      

        function ObtenerDatosContratos() {

            for (var i = 0; i < dataCifrasCovidContratos.length; i++) {
               
                $("#divValorContrato").html("L" + numberWithCommas(parseFloat(Math.round(dataCifrasCovidContratos[i].ValorContrato * 100) / 100).toFixed(0)));
                $("#divTotalContratos").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidContratos[i].TotalContratos * 100) / 100).toFixed(0)));
                $("#divValorEjecutado").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidContratos[i].ValorEjecutado * 100) / 100).toFixed(0)));
                $("#divTotalBeneficiarios").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidContratos[i].TotalBeneficiarios * 100) / 100).toFixed(0)));
              
            }
        }

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return parts.join(".");
        }

       

    })