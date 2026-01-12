        var done_graficas = 0;
        var cant_graficas = 5;
        var cant_contratos = 5;
        var scrol = 0;
        var unidadcompra = JSON.parse(document.body.getAttribute('data-unidadcompra'))[0].unidadcompra;

        inicializaDatos();

        function inicializaDatos() {

            if (unidadcompra) {

                $("#entidad").val(unidadcompra).data('search');

            }
            getAnnio($("#moneda").val());

        }




        function configuraEnlaceContratista() {
            $(".enlace_contratista").click(function () {
                var ruc = $(this).attr('data-parameter');
                var dataValue = $(this).attr('data-parameter'),
                    dataType = $(this).attr('data-type').toLowerCase();
                document.cookie = "ruc=" + ruc + ";path=/;";
                var url = "/contratista?" + dataType + "=" + dataValue;
                window.open(url, '_blank');

            });


        }

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }



        Number.prototype.formatMoney = function (c, d, t) {
            var n = this,
                c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d == undefined ? "." : d,
                t = t == undefined ? "," : t,
                s = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        };


        function cambiarTipoTexto(cadena) {
            return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
        }


function getAnnio(moneda, nombreProceso = null) {
            //debugger;
            var filtros = {
                Moneda: moneda,
                NombreProceso: nombreProceso
            };
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "api/ServiciosContratos/GetAnniosContratos/",
                cache: false,
                data: filtros,
                success: function (data) {
                    deshabilita(true);

                    var items_result = data.detalles;
                    var annios = [];
                    var select = "";
                    for (var i = 0; i < items_result.length; i++) {

                        if (!annios.includes(items_result[i].valor.toString())) {
                            annios.push(items_result[i].valor.toString());
                            select = select + '<option value="' + items_result[i].valor.toString() + '">' + items_result[i].valor.toString() + '</option>';
                        }

                    }

                    $('#top_contratos_periodos').html(select).fadeIn();
                    if (items_result.length > 0) {
                        $("#top_contratos_periodos").val($('#maxyear').val());
                        getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, 0, unidadcompra, $('#proceso').val(), $("#moneda").val());

                    } else {
                        $("#srcContratos").html("");
                        var fila = '<div class="contractBox" >'
                          + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                          + '</div>';

                        $("#srcContratos").html(fila);
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

        var disableClick = false;
        function deshabilita(des) {
            disableClick = des;
            if (des) {
                $("#btn-buscar").prop("disabled", des);
                $('#btnLimpiar').attr("disabled", "disabled")
            } else {
                $("#btn-buscar").prop("disabled", des);
                $('#btnLimpiar').removeAttr("disabled")
            }
        }

        $("#btnLimpiar").click(function () {
            if (!disableClick) {

                $("#top_origen_informacion").val("");
                $("#entidad").val("");
                $("#proceso").val("");
                if (!unidadcompra) { $("#entidadfiona").val(""); }
                deshabilita(true);
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, 0, "", "",$("#moneda").val());
            }
        });

        $("#btn-buscar").click(function () {
            if (!disableClick) {
                deshabilita(true);
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, 0, $('#entidad').val(), $('#proceso').val(),$("#moneda").val());
                getGraficasAll();
            }

        });


   function dibujaPaginacionContrato(actual, total, totalPag, cant_por_pag) {
            var pag_actual = parseInt(actual);
            pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_linea = 10;

            deshabilita(false);
            $("#divPagContratos").empty();

       var divPag = d3.select("#divPagContratos");

            var cociente = Math.floor(pag_actual / cant_por_linea);
            var residuo = pag_actual % cant_por_linea;
            var inicio = 1;
            if (residuo == 0) {
                inicio = (pag_actual - cant_por_linea) + 1;
            } else {
                inicio = (cociente * cant_por_linea) + 1;
            }

            var fin = inicio + (cant_por_linea - 1);
            if (totalPag < cant_por_linea) {
                fin = totalPag;
            }
            if (fin > totalPag) {
                fin = totalPag;
            }


            if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
                var pag_enlace = divPag.append("a")
                    .attr("id", "page_left")
                    .attr("role", "button")
                    .attr("class", "material-icons md-24")
                    .attr("data-page", inicio - cant_por_linea)
                pag_enlace.append("span")
                    .attr("class", "")
                    .text("chevron_left ")
            }



            for (var i = inicio; i <= fin; i++) {

                if (i == pag_actual) {
                    var pag_enlace = divPag.append("span")
                        .attr("class", "pag_actual")
                        .attr("data-page", i)
                    pag_enlace.append("text")
                        .text(i)
                } else {
                    var pag_enlace = divPag.append("a")
                        .attr("class", "page_left")
                        .attr("role", "button")
                        .attr("data-page", i)
                    pag_enlace.append("span")
                        .attr("class", "glyphicon")
                    pag_enlace.append("text")
                        .attr("class", "paginacion")
                        .text(i)

                }


            }

            if (pag_actual < totalPag) {
                //(totalPag - pag_actual) > cant_por_linea
                if (fin < totalPag) {
                    var pag_enlace_der = divPag.append("a")
                        .attr("id", "page_right")
                        .attr("role", "button")
                        .attr("class", "material-icons md-24")
                        .attr("data-page", fin + 1)
                    pag_enlace_der.append("span")
                        .attr("class", "")
                        .text("chevron_right")

                }
            }

            $('#page_right,#page_left,.page_left,.page_right').bind('click', function () {
               
                deshabilita(true);
                d3.select("#divProyectos").empty();
                pagina_actual = $(this).attr("data-page");

                getContratos($("#top_contratos_periodos option:selected").val(), pagina_actual, cant_por_pag, 0, $('#entidad').val(), $('#proceso').val());
            });

        }


function handleAccordionClick(e) {
    const trigger = e.target.closest('.accordion-trigger');
    if (!trigger) return;

    const item = trigger.closest('.accordion-item');
    const allItems = item.parentElement.querySelectorAll('.accordion-item');

    // Cerrar otros
    allItems.forEach(i => {
        if (i !== item) {
            i.classList.remove('active');
            const c = i.querySelector('.accordion-content');
            if (c) c.style.display = 'none';
        }
    });

    // Toggle actual
    item.classList.toggle('active');
    const content = item.querySelector('.accordion-content');
    content.style.display = item.classList.contains('active') ? 'block' : 'none';
}

// Garantiza que solo exista un único listener
function inicializarAcordeon() {
    document.removeEventListener('click', handleAccordionClick);
    document.addEventListener('click', handleAccordionClick);
}

function getContratos(annio, pagina, registros, origen, entidad, proceso, moneda) {

    const filtros = {
        Annio: annio,
        NumeroPagina: pagina,
        RegistrosPorPagina: registros,
        NombreEntidad: entidad,
        NombreProceso: proceso,
        Estado: null,
        Moneda: moneda,
        NombreContratista: null,
        OrigenInformacion: 0,
        CodigoContrato: null
    };

    const formatDate = date => date && date.substr(0, 10) !== "1900-01-01" ? date.substr(0, 10) : "";
    const money = num => (num * 1).formatMoney ? (num * 1).formatMoney(2, ',', '.') : new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2 }).format(Number(num));

    const buildEntidadHeader = (item) => {
        const stilo = String(item.origenInformacion || '').toUpperCase().includes("ONCAE") ? "contractONCAE" : "contractSEFIN";
        return `
            <div class="cotractName ${stilo}">
                <div class="row">
                    <div class="col-xs-12 col-md-12">
                        <span class="small">Entidad</span>
                        <div class="clearfix"></div>
                        <h2>${item.entidad || item.comprador || ''}</h2>
                    </div>
                </div>
            </div>
        `;
    };

    const buildProcesoHeader = (item) => `
        <div class="contractNumberRP proceso-code"><span>Código proceso: </span><span class="text-bold">${item.proceso || ''}</span></div>
        ${item.descripcionProceso ? `<div class="contractNumberRP"><span class="h4">Proceso: </span><br><span class="text-bold">${item.descripcionProceso}</span></div>` : ''}
        <div class="wrap-head-process">
            <div class="contractData">
                <div class="row border-b">
                    <div class="col-xs-12 col-md-4">
                        <span class="txt_small">Estado del proceso</span>
                        <span class="amount_adj">${item.estadoProceso || ""}</span>
                    </div>
                    <div class="col-xs-6 col-md-4">
                        <span class="txt_small">Monto Estimado</span>
                        <span class="amount_adj">${money(item.valorPlaneado || 0)}</span>
                    </div>
                    <div class="col-xs-6 col-md-2">
                        <span class="txt_small">Moneda</span>
                        <span class="amount_adj">${item.monedaContrato || ""}</span>
                    </div>
                </div>
                <div class="row border-b">
                    ${item.fechaIncioPublicacionProceso ? `<div class="col-xs-12 col-md-4"><span class="txt_small">Fecha de Inicio</span><span class="amount_adj">${formatDate(item.fechaIncioPublicacionProceso)}</span></div>` : ""}
                    ${item.fechaInicioRecepcionOfertas ? `<div class="col-xs-12 col-md-4"><span class="txt_small">Fecha de Recepción</span><span class="amount_adj">${formatDate(item.fechaInicioRecepcionOfertas)}</span></div>` : ""}
                    ${item.fechaEstimadaAdjudicacion ? `<div class="col-xs-12 col-md-4"><span class="txt_small">Fecha estimada de adjudicación</span><span class="amount_adj">${formatDate(item.fechaEstimadaAdjudicacion)}</span></div>` : ""}
                </div>
            </div>
        </div>
    `;

    const buildAccordionItem = (item, idx) => {
        const triggerText = item.codigoContrato ? `Código de contratación:  ${item.codigoContrato}` : 'Pendiente emisión código contratación';
        return `
            <div class="accordion-item section-bg3">
                <div class="accordion-trigger">${triggerText}</div>
                <div class="accordion-content content">
                    <div class="card">
                        <div class="card-body">
                            ${item.descripcionContrato ? `
                                <div class="row border-b">
                                    <div class="col-md-12">
                                        <span class="small"> CONTRATO U ORDEN DE COMPRA</span>
                                        <span class="amount_adj">${item.descripcionContrato}</span>
                                    </div>
                                </div>` : ''}
                            <div class="row border-b">
                                <div class="col-md-4">
                                    <span class="small">RAZÓN SOCIAL</span>
                                    <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="${item.codigoProveedor || ''}">
                                        <span class="amount_adj"><i class="material-icons md-22">shortcut</i> ${item.contratista || ''}</span>
                                    </a>
                                </div>
                                <div class="col-md-4">
                                    <span class="small"> TIPO DE DOCUMENTO</span>
                                    <span class="amount_adj">${item.tipoCodigoProveedor || ''}</span>
                                </div>
                                <div class="col-md-4">
                                    <span class="small"> NÚMERO DE DOCUMENTO</span>
                                    <span class="amount_adj">${item.codigoProveedor || ''}</span>
                                </div>
                            </div>

                            <div class="row border-b">
                                <div class="col-xs-6 col-md-6">
                                    <span class="small"> VALOR CONTRATADO</span>
                                    <span class="amount_adj">${item.monedaContrato === 'USD' ? '' : '$'} ${money(item.valorContratado || 0)}</span>
                                </div>
                                <div class="col-xs-6 col-md-6">
                                    <span class="small"> MONEDA</span>
                                    <span class="amount_adj">${item.monedaContrato || ''}</span>
                                </div>
                            </div>

                            <div class="row border-b">
                                ${item.fechaInicioContrato ? `<div class="col-xs-6 col-md-3"><span class="small">FECHA DE INICIO CONTRATO</span><span class="amount_adj">${formatDate(item.fechaInicioContrato)}</span></div>` : ''}
                                ${item.fechaFinContrato ? `<div class="col-xs-6 col-md-3"><span class="small">FECHA DE FIN CONTRATO</span><span class="amount_adj">${formatDate(item.fechaFinContrato)}</span></div>` : ''}
                                ${item.fechaInicioEjecucionContrato ? `<div class="col-xs-6 col-md-3"><span class="small">Fecha de INICIO EJECUCIÓN</span><span class="amount_adj">${formatDate(item.fechaInicioEjecucionContrato)}</span></div>` : ''}
                                ${item.fechaFinEjecucionContrato ? `<div class="col-xs-6 col-md-3"><span class="small">Fecha de FIN EJECUCIÓN</span><span class="amount_adj">${formatDate(item.fechaFinEjecucionContrato)}</span></div>` : ''}
                            </div>
                        </div>
                        <div class="card-footer">
                            ${item.codigoContrato ? `<a href="../../contrato?codcontrato=${item.codigoContrato}" class="btn btn-primary btn-participe"><i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    const buildReferencia = (docURL) =>
        docURL
            ? `<div class="row px-3"><div class="col-xs-12 col-md-12"><a href="${docURL}" target="_blank" class="btn btn-outlined"><span class="txt_small">Conoce más de este proceso</span><i class="material-icons md-22">launch</i></a></div></div>`
            : "";


    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/ServiciosContratos/Contrato/",
        cache: false,
        data: filtros,

        success: function (result) {

            if (!result.status) {
                alert("Message: " + result.message);
                deshabilita(false);
                return;
            }

            const { cantidadTotalRegistros, data: info } = result;

            if (cantidadTotalRegistros === 0) {
                $("#divPagContratos").empty();
                $("#srcContratos").html(`
                    <div class="contractBox">
                        <div class="contractNumberRP">
                            <span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span>
                        </div>
                    </div>
                `);
                deshabilita(false);
                return;
            }

            // ------------------------------------------------------------------------
            //  NUEVA AGRUPACIÓN ✔ ENTIDAD → PROCESOS → CONTRATOS
            // ------------------------------------------------------------------------
            const entidades = {};

            info.forEach(item => {
                const comprador = item.comprador || "";
                const proceso = item.codigoProceso || "";

                if (!entidades[comprador]) {
                    entidades[comprador] = {
                        entidad: comprador,
                        origenInformacion: item.origenInformacion,
                        procesos: {}
                    };
                }

                if (!entidades[comprador].procesos[proceso]) {
                    entidades[comprador].procesos[proceso] = {
                        proceso: proceso,
                        descripcionProceso: item.descripcionProceso,
                        estadoProceso: item.estadoProceso,
                        valorPlaneado: item.valorPlaneado,
                        monedaContrato: item.monedaContrato,
                        fechaIncioPublicacionProceso: item.fechaIncioPublicacionProceso,
                        fechaInicioRecepcionOfertas: item.fechaInicioRecepcionOfertas,
                        fechaEstimadaAdjudicacion: item.fechaEstimadaAdjudicacion,
                        docURL: item.docURL,
                        contratos: []
                    };
                }

                entidades[comprador].procesos[proceso].contratos.push(item);
            });

            // ------------------------------------------------------------------------
            //  GENERAR HTML POR ENTIDAD
            // ------------------------------------------------------------------------
            const cards = [];

            Object.values(entidades).forEach(ent => {
                let entidadHtml = `
                    <div class="card">
                        <div class="card-body">
                            ${buildEntidadHeader(ent)}
                `;

                Object.values(ent.procesos).forEach(proc => {

                    entidadHtml += buildProcesoHeader(proc);

                    entidadHtml += `
                        <div class="related-contracts py-3">
                            <h3 class="h5">Contrato(s) u órden(es) de compra :</h3>
                            <div class="accordion-list">
                    `;

                    proc.contratos.forEach((contrato, idx) => {
                        entidadHtml += buildAccordionItem(contrato, idx);
                    });

                    entidadHtml += `
                            </div>
                        </div>
                    `;

                    entidadHtml += buildReferencia(proc.docURL);
                });

                entidadHtml += `</div></div>`; // cierre card-body + card
                cards.push(entidadHtml);
            });

            // Render final
            $("#srcContratos").html(cards.join(""));
            inicializarAcordeon();

            // Scroll, eventos y paginación quedan sin cambios
            if (scrol >= 1) {
                $('html, body').animate({ scrollTop: $('#secInfoContratos').offset().top }, 2000);
            } else scrol++;

            //document.addEventListener('click', function (e) {
            //    if (e.target.classList.contains('accordion-trigger')) {
            //        const item = e.target.parentElement;
            //        const allItems = document.querySelectorAll('.accordion-item');

            //        allItems.forEach(i => {
            //            if (i !== item) {
            //                i.classList.remove('active');
            //                i.querySelector('.accordion-content').style.display = 'none';
            //            }
            //        });

            //        item.classList.toggle('active');
            //        const content = item.querySelector('.accordion-content');
            //        content.style.display =
            //            item.classList.contains('active') ? 'block' : 'none';
            //    }
            //});

            dibujaPaginacionContrato(
                pagina,
                cantidadTotalRegistros,
                Math.ceil(cantidadTotalRegistros / registros),
                registros
            );

            configuraEnlaceContratista();
            deshabilita(false);
        },

        error: function (response) {
            deshabilita(false);
            alert(response.responseText);
        }
    });
}







////autocompletar en contratos
//$("#entidad").on("keyup", function (event) {
//    if (event.keyCode == 9 || event.keyCode == 13) {
//        event.preventDefault();
//    } else {
//        if (event.keyCode == 8) {
//            if ($(this).val().length <= 1) {
//                $(this).val("");

//            }
//        }
//    }
//}).autocomplete({
//    source: function (request, response) {
//        var filtros = {
//            Comprador: request.term
//        };
//        $.ajax({
//            type: 'GET',
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            url: "/api/ServiciosContratos/GetCompradorByNombre/",
//            cache: false,
//            data: filtros,
//            success: function (data) {
//                var datos = data;

//                if (datos == null || datos.contratosPerAnyo.length <= 0) {
//                    $("#divNoEncontrado").show();
//                    $("#ui-id-1").hide();
//                } else {
//                    $("#divNoEncontrado").hide();
//                    response($.map(datos.contratosPerAnyo, function (item) {
//                        return {
//                            label: item.label,
//                            value: item.label
//                        };

//                    }
//                    ));

//                }
//            },
//            error: function (response) {
//                alert(response.responseText);
//            },
//            failure: function (response) {
//                alert(response.responseText);
//            }
//        });
//    },
//    delay: 300,
//    minLength: 1,
//    select: function (event, ui) {

//    }
//}).bind('blur onblur', function () {
//    if ($(this).val() == "") {
//        $(this).val("");
//        $("#divNoEncontrado").hide();
//    }

//});

$("#top_contratos_periodos").change(function () {

    var filtros = {
        Annio: $("#top_contratos_periodos option:selected").val(),
        Moneda: $("#moneda").val(),
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "api/ServiciosContratos/GetContratosEntidad/",
        cache: false,
        data: filtros,
        success: function (result) {
            if (result.status == true) {

                existeOncae = 0;
                existeSefin = 0;
                $('#dataONCAE').empty();
                $('#dataSEFIN').empty();
                for (var i = 0; i < result.consolidados.length; i++) {

                    if (result.consolidados[i].origenInformacion.toUpperCase().includes('ONCAE')) {
                            if (existeOncae == 0) { $('#resultONCAE').empty(); existeOncae += 1; }
                            var html = '<div class="col-md-4">'
                                + '<div class="h6">' + result.consolidados[i].origenInformacion.replace("Oncae - ", "").replace("ONCAE - ", "").replace("Catalogo Electrónico","Catálogo Electrónico") + '</div>'
                            + '    <div class="h4">' + (result.consolidados[i].nroContratos * 1).formatMoney(0, '.', ',').toString() + '</div>'
                                + '    <div class="h6">Valor</div>'
                                + '    <div class="h4">' + result.consolidados[i].monedaContrato + ' ' + (result.consolidados[i].valorContratado * 1 / 1000000).formatMoney(1, '.', ',').toString() + ' Millones' + '</div>'
                                + '</div>';
                            $('#dataONCAE').append(html);
                        }

                    if (result.consolidados[i].origenInformacion.toUpperCase().includes('SEFIN')) {
                            if (existeSefin == 0) { $('#resultSEFIN').empty(); existeSefin += 1; }
                            var html = ''
                                + '<div class="h6">' + result.consolidados[i].origenInformacion.toUpperCase() + '</div>'
                            + '    <div class="h4">' + (result.consolidados[i].nroContratos).formatMoney(0, '.', ',').toString() + '</div>'
                                + '    <div class="h6">Valor</div>'
                                + '    <div class="h4">' + result.consolidados[i].monedaContrato + ' ' + (result.consolidados[i].valorContratado * 1 / 1000000).formatMoney(1, '.', ',').toString() + ' Millones' + '</div>'
                                + ''
                            $('#dataSEFIN').append(html);
                        }
                }
                scrol = 0;
                getContratos($("#top_contratos_periodos option:selected").val(), 1, cant_contratos, 0, $('#entidad').val(), $('#proceso').val());

            }

        },
        error: function (response) {
            alert(response.responseText);
        },
        failure: function (response) {
            alert(response.responseText);
        }
    });
});








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
            entidad: request.term
        };

        $.ajax({
            type: 'GET',
            dataType: "json",
            url: "api/ServiciosContratos/GetEntidadesContratosAutoCompletar/",
            data: filtros,
            success: function (data) {
                var datos = data;

                if (!datos || datos.unidadCompras.length === 0) {
                    $("#divNoEncontrado").show();
                    response([]);
                } else {
                    $("#divNoEncontrado").hide();
                    response($.map(datos.unidadCompras, function (item) {
                        return {
                            label: item.entidad,
                            value: item.entidad
                        };
                    }));
                }
            }
        });
    },
    delay: 300,
    minLength: 1
});

//// ===============================
//// BOTÓN DE COMBO (mostrar toda la lista)
//// ===============================
//$("#combo-btn-entidad").on("click", function () {
//    $("#entidad").val("");
//    $("#entidad").autocomplete("search", "");
//});


