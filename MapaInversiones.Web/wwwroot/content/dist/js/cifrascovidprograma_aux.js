var dataCifrasCovid;
var dataCifrasCovidConsolidado;
var dataCifrasCovidSubsidios;
var dataCifrasCovidContratos;
var dataCifrasCovidGastosObjeto;
var dataProgramasCovid;
var dataSubsidiosCovid;
var dataContratosCovid;
var dataObjetoGastosCovid;

require([
    'comunes',
    'app/network/Services',
],
    function (
        comunes,
        Services
    ) {
        $("#divInfoSubsidios").hide();
        $("#subsidios_sect").hide();
        $("#li_subsidios").hide();
        loadDataIndicadoresProgramaCovid();
        loadDataSubsidiosCovid();
        loadDataContratosCovid();
        

        function loadDataIndicadoresProgramaCovid() {
            var codigo = getParameterByName('programa_id');
            var param = "CodigoPrograma=" + codigo;
            var datos = [];
            var filtrodatos = "";

            $.ajax({
                type: 'GET',

                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCifrasCovid/GetConsolidadoIndicadoresCovidContratosByPrograma",
                cache: false,
                data: param,
                success: function (result) {
                    if (result.status == true) {
                        var items_result = result.DetalleCovidCifras;
                        dataCifrasCovidConsolidado = items_result;

                        if (dataCifrasCovidConsolidado.length > 0) {
                            ObtenerDatosIndicadores();
                        }
                        else {
                            $("#divValorIndicador").html("L 0 Millones");
                            $("#divAvanceIndicador").html("L 0 Millones");
                            $("#divPorcentajeavance").html("% 0");  
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

        function loadDataSubsidiosCovid() {
            var codigo = getParameterByName('programa_id');
            var param = "CodigoPrograma=" + codigo;
            var datos = [];
            var filtrodatos = "";

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCifrasCovid/GetConsolidadoCifrasCovidSubsidiosByPrograma",
                cache: false,
                data: param,
                success: function (result) {
                    if (result.status == true) {
                        var items_result = result.DetalleCovidCifras;
                        dataCifrasCovidSubsidios = items_result;

                        var items_result_programas = result.ListSubsidios;
                        dataSubsidiosCovid = items_result_programas;

                        for (var i = 0; i < items_result_programas.length; i++) {
                            datos.push({ "value": items_result_programas[i].TipoSubsidio.toString() });
                        }

                        

                        if (datos.length > 0) {
                            
                            comunes.load_filtro_programas_auto_select("divFiltroCovidSubsidios", "filterByCovidSubsidiosGeneral", false, datos, datos.length - 1);
                            comunes.load_filtro_programas_auto_select("DivfilterBySubsidio", "filterBySubsidio", false, datos, datos.length - 1);
                            $("#divInfoSubsidios").show();
                            $("#subsidios_sect").show();
                            $("#li_subsidios").show();
                            if (filtrodatos == "") filtrodatos = datos[datos.length - 1].value;
                                ObtenerDatosSubsidios(filtrodatos);
                                GetSubsidiosData(filtrodatos);
                                

                        } 

                        $('#filterByCovidSubsidiosGeneral li').bind('click onclick', function () {
                            if ($(this).index() >= 0) {
                                var ProgramaSel = $(this)[0].innerText;
                                if (ProgramaSel != "") {
                                    ObtenerDatosSubsidios(ProgramaSel);
                                }
                            }
                        });

                        $('#filterBySubsidio li').bind('click onclick', function () {
                            if ($(this).index() >= 0) {
                                var valSel = $(this)[0].innerText;
                                if (valSel != "") {
                                    GetSubsidiosData(valSel);
                                }
                            }
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
            var codigo = getParameterByName('programa_id');
            var param = "CodigoPrograma=" + codigo;
            var datos = [];
            var filtrodatos = "";

            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosCifrasCovid/GetConsolidadoCifrasCovidContratosByPrograma",
                cache: false,
                data: param,
                success: function (result) {
                    if (result.status == true) {
                        var items_result = result.DetalleCovidCifras;
                        dataCifrasCovidContratos = items_result;

                        if (dataCifrasCovidContratos.length > 0) {
                            ObtenerDatosContratos();
                        }
                        else {
                            $("#divValorContrato").html("L 0 Millones");
                            $("#divTotalContratos").html("0");
                            $("#divValorEjecutado").html("L 0 Millones");
                            $("#divTotalBeneficiarios").html("0");
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
                    $("#divnombresubsidio").html("<span>" + dataCifrasCovidSubsidios[i].TipoSubsidio + "</span>");
                    $("#divvalorsubsidio").html("L" + numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].GastoSubsidio * 100) / 100).toFixed(0)));
                    //$("#divfamiliasbeneficiadas").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].NumeroFamiliasBeneficiadas * 100) / 100).toFixed(0)));
                    $("#diventregadossubsidios").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].cantSubsidiosEntregados)).toFixed(0)));
                    $("#divciudadanosbeneficiados").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].NumeroCiudadanosBeneficiados * 100) / 100).toFixed(0)));
                }
            }
        }

        function ObtenerDatosIndicadores() {

            for (var i = 0; i < dataCifrasCovidConsolidado.length; i++) {
                $("#divValorIndicador").html("L" + numberWithCommas(parseFloat(Math.round(dataCifrasCovidConsolidado[i].universo * 100) / 100).toFixed(0)));
                $("#divAvanceIndicador").html("L" + numberWithCommas(parseFloat(Math.round(dataCifrasCovidConsolidado[i].meta * 100) / 100).toFixed(0)));
                $("#divPorcentajeavance").html("%" + numberWithCommas(parseFloat(Math.round(dataCifrasCovidConsolidado[i].porcentajeAvance * 100) / 100).toFixed(0)));  
            }
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

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function GetSubsidiosData(filtro) {
            for (var i = 0; i < dataCifrasCovidSubsidios.length; i++) {
                if (dataCifrasCovidSubsidios[i].TipoSubsidio == filtro) {
                    var idSubsidio = dataCifrasCovidSubsidios[i].IdSubsidio;
                    var rutaficha = "/Covid/PerfilSubsidio/?subsidio=" + idSubsidio;
                    $("#sub_nombre").html("<span>" + dataCifrasCovidSubsidios[i].TipoSubsidio + "</span>");
                    $("#sub_valor").html("L" + numberWithCommas(convertirMillones(parseFloat(Math.round(dataCifrasCovidSubsidios[i].GastoSubsidio * 100) / 100).toFixed(0))) + tituloMillones(parseFloat(Math.round(dataCifrasCovidSubsidios[i].GastoSubsidio * 100) / 100).toFixed(0)));
                    $("#sub_cantEntregados").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].cantSubsidiosEntregados)).toFixed(0)));
                    $("#lblSubsidiosEntregados").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].cantSubsidiosEntregados)).toFixed(0)));
                    $("#lblSubCiudadanos").html(numberWithCommas(parseFloat(Math.round(dataCifrasCovidSubsidios[i].NumeroCiudadanosBeneficiados * 100) / 100).toFixed(0)));
                    $("#lblSubValorEntregado").html("L" + numberWithCommas(convertirMillones(parseFloat(Math.round(dataCifrasCovidSubsidios[i].GastoSubsidio * 100) / 100).toFixed(0))) + tituloMillones(parseFloat(Math.round(dataCifrasCovidSubsidios[i].GastoSubsidio * 100) / 100).toFixed(0)));
                    $('#enlaceProgramSubsidios').attr('href', rutaficha);
                }
               
                }
        }

        function convertirMillones(num) {
            return num > 999999 ? (num / 1000000).toFixed(0) : num

        }

        function tituloMillones(num) {
            return num > 999999 ? " Millones" : ""
        }

    })