var PerfilUsuario = JSON.parse(document.body.getAttribute('data-profile'));
var contrato_data = JSON.parse(document.body.getAttribute('data-contrato'));

var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";

require([
    'app/network/Services',
    'app/network/urlsMap',
    'comunes'
],
    function (
        Services,
        urlsMap,
        comunes
    ) {


        inicializaDatos();

        function inicializaDatos() {

            getContrato();
            //Participacion ciudadana
            iniUsuarioLog();
            //add funciones login
            $("#txtEmailLog").val("");
            $("#txtClaveLog").val("");
            $("#divCloseSesion").hide();

            if (contrato_data[0].CodigoContrato != undefined) {
                GetComentarios(contrato_data[0].CodigoContrato);
            }

            $("#btnNuevaCuenta").click(function () {
                $("#divUsuarioLog").slideUp(100, function () {
                    $("#divCuentaNueva").slideDown(function () {
                        limpiarCamposUsuario("login");
                    });
                });
            });

            $("#btnAddCuentaUsu").click(function () {
                AddNuevaCuentaUsuario();
            });

            $("#btnIngresarUsuLog").click(function () {
                validaLoginUsu();
            });



            $("#btnEnlaceOlvidoClave").click(function () {
                $("#divUsuarioLog").slideUp(100, function () {
                    $("#divOlvidoClave").slideDown(function () {
                        limpiarCamposUsuario("clave");
                    });
                });

            });

            $("#btnEnviaCodigoClave").click(function () {
                //valida correo
                var correo_usu = $("#txtEmailReset").val();
                if (comunes.validaEmail(correo_usu.toLowerCase())) {

                    var params_usu = { "email": correo_usu };
                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: "/api/Participacion/ValidaEmail",
                        cache: false,
                        data: JSON.stringify(params_usu),
                        success: function (result) {
                            if (result.status == true) {
                                //usuario, se ha enviado correo con codigo
                                $("#txtEmailVerifica").val(correo_usu);
                                $("#divOlvidoClave").slideUp(100, function () {
                                    $("#divConfirmaCodigo").slideDown(function () {
                                        limpiarCamposUsuario("clave");
                                    });
                                });


                            } else {
                                bootbox.alert("Error: " + result.message, function () {
                                    $("#divOlvidoClave").slideUp(100, function () {
                                        $("#divUsuarioLog").slideDown(function () {
                                            limpiarCamposUsuario();
                                        });
                                    });
                                });
                            }

                        },
                        error: function (response) {
                            alert(response.responseText);
                            $("#divOlvidoClave").slideUp(100, function () {
                                $("#divUsuarioLog").slideDown(function () {
                                    limpiarCamposUsuario();
                                });
                            });
                        },
                        failure: function (response) {
                            alert(response.responseText);
                            $("#divOlvidoClave").slideUp(100, function () {
                                $("#divUsuarioLog").slideDown(function () {
                                    limpiarCamposUsuario();
                                });
                            });
                        }
                    });

                } else {
                    bootbox.alert("Email inválido");

                }




            });

            $("#btnVerificaCodigoClave").click(function () {
                var params_usu = { "email": $("#txtEmailVerifica").val(), "cod_verifica": $("#txtCodigoVerifica").val() };
                $.ajax({
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "/api/Participacion/ValidaCodigo",
                    cache: false,
                    data: JSON.stringify(params_usu),
                    success: function (result) {
                        if (result.status == true) {
                            //usuario, se ha enviado correo con codigo
                            $("#hdIdUsuario").val(result.id_usuario);
                            $("#divConfirmaCodigo").slideUp(100, function () {
                                $("#divResetPassword").slideDown(function () {
                                    limpiarCamposUsuario("clave");
                                });
                            });
                        } else {
                            $("#hdIdUsuario").val("");
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

            });


            $("#btnCambiarClaveOlvido").click(function () {
                //valida campos obligatorios
                var formularioOK = validaCamposOblig("divResetPassword");

                if (formularioOK == false) {
                    if (camposReq != "") {
                        bootbox.alert("Faltan campos obligatorios");
                    }
                } else {
                    //validarClave
                    if ($("#txtPassword_re").val() != $("#txtPassword_re_2").val()) {
                        bootbox.alert("Confirmación nueva clave incorrecta");
                    } else {
                        var clave_usu = $("#txtPassword_re").val();
                        if (validaClaveUsu(clave_usu) == false) {
                            bootbox.alert("Formato de clave incorrecto: Debe tener 8 dígitos al menos,contener números y al menos una letra mayúscula");
                        } else {
                            if ($("#hdIdUsuario").val() != "") {
                                var params_usu = {
                                    IdUsuario: $("#hdIdUsuario").val(),
                                    hash_clave: clave_usu,
                                };
                                //add nuevo registro
                                $.ajax({
                                    type: 'POST',
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    url: "/api/Participacion/updClaveUsuario",
                                    cache: false,
                                    data: JSON.stringify(params_usu),
                                    success: function (result) {
                                        if (result.status == true) {
                                            bootbox.alert("Nueva clave guardada exitosamente", function () {
                                                $("#divResetPassword").slideUp(100, function () {
                                                    $("#divUsuarioLog").slideDown(function () {
                                                        limpiarCamposUsuario("all");
                                                    });
                                                });
                                            });

                                        } else {
                                            bootbox.alert("@Error: " + result.message);
                                        }

                                    },
                                    error: function (response) {
                                        bootbox.alert(response.responseText);
                                    },
                                    failure: function (response) {
                                        bootbox.alert(response.responseText);
                                    }
                                });
                            } else {
                                bootbox.alert("Código no verificado");
                            }

                        }
                    }
                }

            });

            $("#btnGuardarComent").click(function () {
                //valida campos obligatorios
                $("#btnGuardarComent").hide();
                var formularioOK = validaCamposOblig("divPregParticipacion");

                if (formularioOK == false) {
                    if (camposReq != "") {
                        bootbox.alert("Faltan campos obligatorios");
                    }
                } else {
                    var formularioOK = true;
                    var camposReq = "";
                    $(".alert-danger").hide();
                    var id_usuario = $("#hdIdUsuario").val();
                    var id_departamento = $("#filtro_AreaInfluencia li.selected").attr("id_depa");
                    var id_municipio = $("#filtro_AreaInfluencia li.selected").attr("id_munic");
                    var id_tipo = $("#filtro_TipoCometario li.selected").attr("id_tipo");
                    var text_coment = $("#txtcomentario").val();
                    var ch_anonimo = $("#anonimo").prop('checked');
                    var CodigoContrato = contrato_data[0].CodigoContrato;

                    if (id_tipo == "" || id_tipo == undefined) {
                        formularioOK = false;
                        bootbox.alert("Seleccione un tipo de comentario");
                    }
                    else if (id_departamento == "" || id_municipio == "" || id_departamento == undefined || id_municipio == undefined) {
                        formularioOK = false;
                        bootbox.alert("Seleccione un municipio");
                    } 
                    else if (text_coment == "") {
                        formularioOK = false;
                        bootbox.alert("Ingrese un comentario");
                    }
                    

                    if (formularioOK == true) {
                        $("#divPregParticipacion").html(loader_proy);

                        var params_com = {
                            IdUsuario: id_usuario,
                            id_departamento: id_departamento,
                            id_municipio: id_municipio,
                            IdTipoComentario: id_tipo,
                            IdProyecto: null,
                            ComentarioOriginal: text_coment,
                            Anonimo: ch_anonimo,
                            IdEstado: 1,
                            IdTipoRespuesta: 1,
                            ComentarioRelacionado: null,
                            UsuarioComenta: 0,
                            IdAsociacion: 3,
                            CodigoContrato: CodigoContrato
                        };
                        //add nuevo registro
                        $.ajax({
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            url: "/api/Participacion/insComentario",
                            cache: false,
                            data: JSON.stringify(params_com),
                            success: function (result) {
                                if (result.status == true) {
                                    //COMENTARIOS GUARDADOS EXITOSAMENTE
                                    $("#divPregParticipacion").slideUp(100, function () {
                                        $("#divCloseSesion").show();
                                        var nom_usu = $("#hdNomUsuario").val();
                                        $("#txtMsgConfirmaEnvio").text("Muchas Gracias " + nom_usu);
                                        $("#divConfirmaEnvio").slideDown(function () {
                                            if (contrato_data[0].CodigoContrato != undefined) {
                                                GetComentarios(contrato_data[0].CodigoContrato);

                                            }
                                        });
                                    });

                                } else {
                                    bootbox.alert("@Error: " + result.message);
                                    $("#divPregParticipacion").slideUp(100, function () {
                                        $("#divCloseSesion").show();
                                        
                                    });
                                }

                            },
                            error: function (response) {
                                bootbox.alert(response.responseText);
                                $("#divPregParticipacion").slideUp(100, function () {
                                    $("#divCloseSesion").show();

                                });
                                if (contrato_data[0].CodigoContrato != undefined) {
                                    GetComentarios(contrato_data[0].CodigoContrato);

                                }
                            },
                            failure: function (response) {
                                bootbox.alert(response.responseText);
                                $("#divPregParticipacion").slideUp(100, function () {
                                    $("#divCloseSesion").show();

                                });
                                if (contrato_data[0].CodigoContrato != undefined) {
                                    GetComentarios(contrato_data[0].CodigoContrato);

                                }
                            }
                        });
                    }
                }
                $("#btnGuardarComent").show();
            });

            $("#enlace_cierre").click(function () {
                cerrarSesionUsu();
            });

        }


        function configuraEnlaceContratista() {
            $(".enlace_contratista").click(function () {
                var ruc = $(this).attr('data-parameter');
                var dataValue = $(this).attr('data-parameter'),
                    dataType = $(this).attr('data-type').toLowerCase();
                document.cookie = "ruc=" + ruc + ";path=/;";
                var url = "/contratista/contratistaprofile/proyectos/?" + dataType + "=" + dataValue;
                window.location.href = url;

            });

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



        function getContrato() {         
            var filtros = {
               
                CodigoContrato: contrato_data[0].CodigoContrato

            };
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: '/api/serviciosContratistas/GetInfoContrato',
                cache: false,
                data: JSON.stringify(filtros),
                success: function (result) {
                    if (result.status == true) {
                        if (result.listInformacion.length > 0) {
                            $(".link_external.ce").show();
                            //alert(JSON.stringify(result.listInformacion));
                            var info = result.listInformacion;
                            var proceso = "";
                            var referencia = "";
                            var data = "";
                            var fila = "";
                            var adjudicacion = "";
                            var invitados = "";
                            var inicioLuis = '<div class="contractBox">';
                            var finLuis = '</div>';
                            var inicio = "";
                            var fin = "";
                            var divproceso = "";
                            $("#srcContratos").html("");
                            $("#srcProceso").html("");
                            for (var i = 0; i < info.length ; i++) {
                                if (proceso != info[i].CodigoProceso.toString()) {
                                    if (i > 0) //Cambio de proceso
                                    {
                                        
                                        data += inicioLuis + inicio + fila + finLuis + fin + '</div></div>' + finLuis;
                                        fila = "";
                                        inicio = "";
                                        fin = "";
                                    }
                                    referencia = info[i].DocURL.toString();
                                    adjudicacion = info[i].UrlResumenAdjudicacion;
                                    invitados = info[i].UrlInvitados;
                                    divproceso = '<p class="text-center CodProceso">PROCESO: ' + info[i].DescripcionProceso.toString() + '</p>'
                                    inicio = ' <div class="wrap-head-process">'
                                        + '     <div class="cotractName">'
                                        + '         <div class="row">'
                                        + '             <div class="col-xs-12 col-md-12">'
                                        + '                 <span class="small">CÓDIGO</span><div class="clearfix"></div>'
                                        + '                 <span class="h4">' + info[i].CodigoProceso.toString() + '</span>'
                                        + '             </div>'
                                        + '         </div>'
                                        + '     </div>'
                                        + '     <div class="cotractName">'
                                        + '         <div class="row">'
                                        + '             <div class="col-xs-8 col-md-8">'
                                        + '                 <span class="small"> INSTITUCIÓN</span><div class="clearfix"></div>'
                                        + '                 <span class="h4">' + info[i].UnidadCompra.toString() + '</span>'
                                        + '             </div>'
                                        + '         </div>'
                                        + '     </div>';
                                        inicio += '<div class="contractData">';
                                        if (info[i].CategoriaContratacion || info[i].MetodoContratacion) {
                                            inicio += ''
							                + '		<div class="row border-b">'
							                + '			<div class="col-xs-6 col-md-8">';
                                            if (info[i].CategoriaContratacion) {
                                                inicio += '	<span class="txt_small">Categoria</span>'
							                         + '	<span class="amount_adj">' + info[i].CategoriaContratacion.toString() + '</span>';
                                            }
                                            inicio += '</div>	<div class="col-xs-6 col-md-4">';
                                            if (info[i].MetodoContratacion) {
                                                clasece = "";
                                                imgg = "";
                                                if (info[i].MetodoContratacion.toString() === "Contratación por Excepción") { clasece = "cemark"; imgg = '<img src="/content/img/covid/ic_CEorange.svg"  alt="CAUSAL EXCEPCIÓN">'; }
                                                inicio += '				   <span class="txt_small">Tipo de Procedimiento</span>'
                                                + '				   <span class="amount_adj ' + clasece + '">' + imgg + ' ' + info[i].MetodoContratacion.toString() + ' </span>';
                                            }
                                            inicio += '</div></div>'
                                            + '';
                                        }

                                        inicio += ''
                                        + '         <div class="row border-b">'
                                        + '             <div class="col-xs-12 col-md-4"><span class="txt_small">Estado</span><span class="amount_adj">';
                                        if (info[i].EstadoProceso) { inicio += info[i].EstadoProceso.toString(); }
                                        inicio += '</span></div>'
                                        + '             <div class="col-xs-6 col-md-4"><span class="txt_small"></span><span class="amount_adj"></span></div>' //RD ' + (info[i].MontoEstimadoProceso * 1).formatMoney(2, '.', ',').toString() + '
                                        + '             <div class="col-xs-6 col-md-2"><span class="txt_small"></span><span class="amount_adj"></span></div>' //DOP
                                        + '         </div>'

                                        
                                        if (adjudicacion) {
                                            $("#enlaceadjudica").attr("href", info[i].UrlResumenAdjudicacion.toString())
                                        }
                                        else{
                                            $("#enlaceadjudica").hide();

                                        }
                                        if (invitados) {
                                            $("#enlaceinvitados").attr("href", info[i].UrlInvitados.toString())
                                        }
                                        else{
                                            $("#enlaceinvitados").hide();
                                        }
                                           
                                        inicio += '     </div>'
                                        + ' </div>'
                                        + ' <div class="related-contracts">'
                                        + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                                    proceso = info[i].CodigoProceso.toString();
                                }

                                fila += '<div class="panel panel-default">'
                                    + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                                    + '                <h4 class="panel-title">'
                                    + '                    <a class="" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';
                                    if (info[i].COVID19 === 1 || info[i].COVID19 === 2) { fila += '                        <span class="badge"><img src="../../content/img/covid/ic_mini.png" alt="iconoCOVID"> Covid-19</span>'; }
                                    fila +='                        Código contrato:  ' + info[i].CodigoContrato + ''
                                    + '                    </a>'
                                    + '                </h4>'
                                    + '            </div>'
                                    //+ '            <div id="collapse' + i + '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                                    + '            <div>'
                                    + '                <div class="panel-body">'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-12 col-md-12"><span class="small">CONTRATO</span><span class="amount_adj">RD ' + info[i].DescripcionContrato.toString() + ' </span></div>'
                                    + '                    </div>'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-md-6">'
                                    + '                            <span class="small"> RAZON SOCIAL</span>'
                                    + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].numerodocumento.toString() + '"><span class="amount_adj"><span class="glyphicon glyphicon-share-alt"></span>' + info[i].Contratista.toString() + '</span></a>'
                                    + '                        </div>'
                                    + '                        <div class="col-md-3"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipodocumento.toString() + '</span></div>'
                                    + '                        <div class="col-md-3"><span class="small"> Número de documento</span><span class="amount_adj">' + info[i].numerodocumento.toString() + '</span></div>'
                                    + '                    </div>'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-8 col-md-3"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj">' + ((info[i].ValorContrato * 1)/1000000).formatMoney(0, ',', '.').toString() + ' Millones</span></div>' //RD ' + (info[i].MontoContratadoTotalContrato * 1).formatMoney(2, '.', ',').toString() + ' 
                                    + '                        <div class="col-xs-4 col-md-3"><span class="small"> MONEDA</span><span class="amount_adj">L</span></div>' //DOP 
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                                    if (info[i].FechaInicioContrato) { fila += ' Fecha de INICIO CONTRATO'; }
                                    fila += '</span><span class="amount_adj">';
                                    if (info[i].FechaInicioContrato) { fila += info[i].FechaInicioContrato.toString().substr(0, 10); }

                                    fila += ' </span></div>'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small">';
                                    if (info[i].FechaFinContrato) { fila += 'Fecha de FIN CONTRATO'; }
                                    fila += '</span><span class="amount_adj"> ';
                                    if (info[i].FechaFinContrato) { fila += info[i].FechaFinContrato.toString().substr(0, 10); }

                                    fila += ' </span></div>'
                                    + '                    </div>'
                                    + '                    <div class="row border-b">'
                                    + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';
                                    if (info[i].OfertaPeriodoDuracion) { fila += info[i].OfertaPeriodoDuracion.toString(); }

                                    fila += ' Días</span></div>';

                                fila += '                        <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                                if (info[i].FechaPublicacion !== null && info[i].FechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                    fila += info[i].FechaPublicacion.toString().substr(0, 10) + '</span></div>';
                                }
                                else {
                                    fila += '&nbsp;</span></div>';
                                }

                                fila += '                    </div>'
                                    + '                </div>'
                                    + '               <div class="panel-footer" style="align:center">'
                                    + '                    <div class="btn btn-outlined"><a href="' + info[i].DocURL.toString() + '" target="_blank"> Ver más de este contrato <span class="glyphicon glyphicon-arrow-right"></span></a></div>'
                                    + '                 </div>'
                                    + '            </div>'
                                    + '        </div>';
                                //+ '  </div>';
                            }
                            data += inicioLuis + inicio + fila + '</div></div>' + finLuis;
                            
                            $("#srcProceso").html(divproceso);
                            $("#srcContratos").html(data);
                            configuraEnlaceContratista();
                        }
                        else {
                            $(".link_external.ce").hide();
                            $("#srcContratos").html("");
                            var fila = '<div class="contractBox" >'
                              + '<div class="contractNumber"><span class="text-bold NoResultC">No se encuentra información del contrato</span></div>'
                              + '</div>';

                            $("#srcContratos").html(fila);
                           
                        }

                    } else {
                        alert("Message: " + result.message);
                    }
                },
                error: function (response) {
                    alert("Response: " + response.responseText);
                },
                failure: function (response) {
                    alert("Response F: " + response.responseText);
                }
            });

        }


        function validaClaveUsu(cadena) {
            //que tenga mayusculas, numeros,de 8 digitos al menos
            var clave = new RegExp(/^(?=(?:.*\d){1})(?=(?:.*[A-Z]){1})\S{8,}$/);
            valida = clave.test(cadena);
            return valida;
        }
        function validaCamposOblig(contenedor) {
            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();
            $('.required', $("#" + contenedor)).each(function (i, e) {
                var id_txt = $(e).attr("for");
                if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
                    camposReq += "[" + id_txt + "]";
                    $("#error_" + id_txt).show();
                    formularioOK = false;
                } else {
                    $("#error_" + id_txt).hide();
                }
            });
            return formularioOK;
        }


        function iniUsuarioLog() {
            $("#hdIdUsuario").val(PerfilUsuario[0].idUsuParticipa);
            $("#hdNomUsuario").val(PerfilUsuario[0].nomUsuParticipa);
            if ($("#hdIdUsuario").val() != "") {
                //habilita funcion subir fotos
                //$("#divFotoUsuario").css("visibility","visible");
                $("#divUsuarioLog").slideUp(100, function () {
                    $("#divNomUsuarioLog").text("Hola, " + $("#hdNomUsuario").val());
                    $("#divCloseSesion").show();
                    $("#divPregParticipacion").css("visibility", "visible");
                    $("#divPregParticipacion").attr("class", "objVisible");
                });

            } else {
                //$("#divFotoUsuario").css("visibility", "collapse");
            }
        }

        function VerificaCuentaUsuarioNew() {
            //valida campos obligatorios
            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();
            $('.required', $('#divInfoUsuario')).each(function (i, e) {
                var id_txt = $(e).attr("for");
                if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
                    camposReq += "[" + id_txt + "]";
                    $("#error_" + id_txt).show();
                    formularioOK = false;
                } else {
                    $("#error_" + id_txt).hide();
                }
            });

            if (formularioOK == false) {
                if (camposReq != "") {
                    bootbox.alert("Faltan campos obligatorios");
                }
            } else {
                //validarCorreo
                if ($("#txtPassword").val() != $("#txtPassword_2").val()) {
                    bootbox.alert("Confirmación Password incorrecta");
                } else {
                    var clave_usu = $("#txtPassword").val();
                    if (validaClaveUsu(clave_usu) == false) {
                        bootbox.alert("Formato de clave incorrecto: Debe tener 8 dígitos al menos,contener números y al menos una letra mayúscula");
                    } else {
                        //validarCorreo
                        var correo_usu = $("#txtEmail").val();
                        if (comunes.validaEmail(correo_usu.toLowerCase())) {
                            //validar edad
                            if (comunes.validaEnteroMayorCero($("#txtEdad").val())) {
                                var params_usu = {
                                    Nombre: $("#txtNombre").val(),
                                    email: $("#txtEmail").val(),
                                    hash_clave: $("#txtPassword").val(),
                                    Edad: $("#txtEdad").val(),
                                    IdGenero: $("#filtro_Genero li.selected").attr("id_gen"),
                                    IdRol: $("#filtro_Rol li.selected").attr("id_rol"),
                                    IdMedio: $("#filtro_Medios li.selected").attr("id_medio")
                                };
                                //add nuevo registro
                                $.ajax({
                                    type: 'POST',
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    url: "/api/Participacion/AddUsuarios",
                                    cache: false,
                                    data: JSON.stringify(params_usu),
                                    success: function (result) {
                                        if (result.status == true) {
                                            bootbox.alert("Usuario Registrado Exitosamente", function () {
                                                $("#divCuentaNueva").slideUp(100, function () {
                                                    $("#divUsuarioLog").slideDown(function () {
                                                        limpiarCamposUsuario();
                                                    });
                                                });
                                            });

                                        } else {
                                            bootbox.alert("@Error: " + result.message);
                                        }

                                    },
                                    error: function (response) {
                                        alert(response.responseText);
                                    },
                                    failure: function (response) {
                                        alert(response.responseText);
                                    }
                                });

                            } else {
                                bootbox.alert("Edad inválida");

                            }
                        } else {
                            bootbox.alert("Email inválido");
                        }

                    }


                }
            }


        }


        function AddNuevaCuentaUsuario() {
            //valida campos obligatorios
            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();
            $('.required', $('#divInfoUsuario')).each(function (i, e) {
                var id_txt = $(e).attr("for");
                var tipo = $("#" + id_txt).prop('type').toLowerCase();
                if (tipo == "text" || tipo == "password") {
                    if ($("#" + id_txt).val() == "") {
                        camposReq += "[" + id_txt + "]";
                        $("#error_" + id_txt).show();
                        formularioOK = false;
                    } else {
                        $("#error_" + id_txt).hide();
                    }
                } else {
                    if ($('#' + id_txt + ' li.selected').attr('id') == "0") {
                        camposReq += "[" + id_txt + "]";
                        $("#error_" + id_txt).show();
                        formularioOK = false;
                    } else {
                        $("#error_" + id_txt).hide();
                    }

                }

            });

            if (formularioOK == false) {
                if (camposReq != "") {
                    bootbox.alert("Faltan campos obligatorios");
                }
            } else {
                //validarCorreo
                if ($("#txtPassword").val() != $("#txtPassword_2").val()) {
                    bootbox.alert("Confirmación Password incorrecta");
                } else {
                    var clave_usu = $("#txtPassword").val();
                    if (validaClaveUsu(clave_usu) == false) {
                        bootbox.alert("Formato de clave incorrecto: Debe tener 8 dígitos al menos,contener números y al menos una letra mayúscula");
                    } else {
                        //validarCorreo
                            var correo_usu = $("#txtEmail").val();
                            if (comunes.validaEmail(correo_usu.toLowerCase())) {
                            //validar edad
                            if (comunes.validaEnteroMayorCero($("#txtEdad").val())) {
                                var params_usu = {
                                    Nombre: $("#txtNombre").val(),
                                    email: $("#txtEmail").val(),
                                    hash_clave: $("#txtPassword").val(),
                                    Edad: $("#txtEdad").val(),
                                    IdGenero: $("#filtro_Genero li.selected").attr("id_gen"),
                                    IdRol: $("#filtro_Rol li.selected").attr("id_rol"),
                                    IdMedio: $("#filtro_Medios li.selected").attr("id_medio"),
                                    CodigoContrato: contrato_data[0].CodigoContrato
                                };
                                $("#divCuentaNueva").html(loader_proy);

                                //add nuevo registro
                                $.ajax({
                                    type: 'POST',
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    url: "/api/Participacion/AddUsuarios",
                                    cache: false,
                                    data: JSON.stringify(params_usu),
                                    success: function (result) {
                                        if (result.status == true) {
                                            bootbox.alert("Su cuenta ha sido creada. Hemos enviado a su correo electrónico un link de verificación para activarla.", function () {
                                                $("#divCuentaNueva").slideUp(100, function () {
                                                    $("#divUsuarioLog").slideDown(function () {
                                                        limpiarCamposUsuario();
                                                    });
                                                });
                                            });

                                        } else {
                                            bootbox.alert("@Error: " + result.message);
                                            $("#divCuentaNueva").slideUp(100, function () {
                                                $("#divUsuarioLog").slideDown(function () {
                                                    limpiarCamposUsuario();
                                                });
                                            });
                                        }

                                    },
                                    error: function (response) {
                                        alert(response.responseText);
                                        $("#divCuentaNueva").slideUp(100, function () {
                                            $("#divUsuarioLog").slideDown(function () {
                                                limpiarCamposUsuario();
                                            });
                                        });
                                    },
                                    failure: function (response) {
                                        alert(response.responseText);
                                        $("#divCuentaNueva").slideUp(100, function () {
                                            $("#divUsuarioLog").slideDown(function () {
                                                limpiarCamposUsuario();
                                            });
                                        });
                                    }
                                });

                            } else {
                                bootbox.alert("Edad inválida");

                            }
                        } else {
                            bootbox.alert("Email inválido");
                        }

                    }


                }
            }
        }

        function limpiarCamposUsuario(opc) {
            if (opc == "login") {
                $("#txtEmailLog").val("");
                $("#txtClaveLog").val("");
                $("#txtNombre").val("");
                $("#txtEdad").val("");
                $("#txtEmail").val("");
                $("#txtPassword").val("");
                $("#txtPassword_2").val("");
                $("#hdIdUsuario").val("");
                $('.btn-select-value').each(function (i, e) {
                    $(e).html($(e).attr("etiqueta"));
                });

            } else if (opc == "clave") {
                $("#txtPassword_re").val("");
                $("#txtPassword_re_2").val("");
                $("#txtCodigoVerifica").val("");
                $("#txtEmailReset").val("");
                //txtEmailVerifica
                //hdIdUsuario


            } else if (opc == "all") {
                $("#txtEmailLog").val("");
                $("#txtClaveLog").val("");
                $("#txtNombre").val("");
                $("#txtEdad").val("");
                $("#txtEmail").val("");
                $("#txtPassword").val("");
                $("#txtPassword_2").val("");
                $("#hdIdUsuario").val("");
                $("#txtPassword_re").val("");
                $("#txtPassword_re_2").val("");
                $("#txtCodigoVerifica").val("");
                $("#txtEmailReset").val("");
                $("#txtEmailVerifica").val("");
                $('.btn-select-value').each(function (i, e) {
                    $(e).html($(e).attr("etiqueta"));
                });

            }






        }


        function cerrarSesionUsu() {
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/Participacion/CerrarSession",
                cache: false,
                data: null,
                success: function (result) {
                    if (result.status == true) {
                        //USUARIO EXISTE
                        $("#divNomUsuarioLog").text("");
                        $("#hdNomUsuario").val("");
                        $("#hdIdUsuario").val("");
                        $("#divUsuarioLog").slideDown(100, function () {
                            $("#divCloseSesion").show();
                            $("#divPregParticipacion").attr("class", "objHidden");
                            location.reload();
                        });


                    } else {
                        bootbox.alert("@Error: " + result.message);
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

        function validaLoginUsu() {
            //valida campos obligatorios
            $("#divCloseSesion").hide();
            $("#hdNomUsuario").val("");
            $("#hdIdUsuario").val("");
            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();
            $('.required', $('#divDatosLogin')).each(function (i, e) {
                var id_txt = $(e).attr("for");
                if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
                    camposReq += "[" + id_txt + "]";
                    $("#error_" + id_txt).show();
                    formularioOK = false;
                } else {
                    $("#error_" + id_txt).hide();
                }
            });

            if (formularioOK == false) {
                if (camposReq != "") {
                    bootbox.alert("Faltan campos obligatorios");
                }
            } else {
                //validarCorreo
                    var correo_usu = $("#txtEmailLog").val();
                    if (comunes.validaEmail(correo_usu.toLowerCase())) {
                    var params_usu = {
                        email: $("#txtEmailLog").val(),
                        hash_clave: $("#txtClaveLog").val()
                    };
                    //add nuevo registro
                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: "/api/Participacion/ValidaLogin",
                        cache: false,
                        data: JSON.stringify(params_usu),
                        success: function (result) {
                            if (result.status == true) {
                                //USUARIO EXISTE
                                $("#divNomUsuarioLog").text("Hola, " + result.usuarios.Nombre);
                                $("#hdNomUsuario").val(result.usuarios.Nombre);
                                $("#hdIdUsuario").val(result.usuarios.IdUsuario);
                                //$("#divFotoUsuario").css("visibility", "visible");
                                $("#divUsuarioLog").slideUp(100, function () {
                                    $("#divCloseSesion").show();
                                    $("#divPregParticipacion").attr("class", "objVisible");
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

                } else {
                    bootbox.alert("Email inválido");
                }
            }
        }

        function AddnuevoUsuario() {
            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();
            $('.required', $('#divInfoUsuario')).each(function (i, e) {
                var id_txt = $(e).attr("for");
                if ($("#" + id_txt).val() == "" || $('#' + id_txt + ' option:selected').val() == "0") {
                    camposReq += "[" + id_txt + "]";
                    $("#error_" + id_txt).show();
                    formularioOK = false;
                } else {
                    $("#error_" + id_txt).hide();
                }
            });

            if (formularioOK == false) {
                if (camposReq != "") {
                    bootbox.alert("Faltan campos obligatorios");
                }
            } else {
                //validarCorreo
                if (validaEmail($('#txtEmail').val())) {
                    var patron = /^\d*$/;
                    if ($("#txtCelular").val().search(patron)) {
                        bootbox.alert("Número de celular inválido");
                    } else {
                        //guarda registro en bd
                        var params = {
                            nombre: $("#txtNombre").val(),
                            email: $("#txtEmail").val(),
                            celular: $("#txtCelular").val(),
                            id_perfil: $("#ddlPerfil option:selected").val()
                        };

                        ajaxPost('Views/Usuarios/crearUsuarios_ajax', params, null, function (r) {
                            var errRes = r.split("<||>")[0];
                            var mensRes = r.split("<||>")[1];
                            if (r.indexOf("<||>") != -1) {
                                if (errRes == '0') {
                                    bootbox.alert('Usuario creado exitosamente. Se enviaron instrucciones de verificación al correo registrado', function () {
                                        resetearCampos("divInfoUsuario");
                                    });
                                } else {
                                    bootbox.alert("@Error: " + mensRes);
                                }
                            }
                        }, function (r) {
                            bootbox.alert(r.responseText);
                        });
                    }
                } else {
                    bootbox.alert("Correo electrónico inválido");
                }

            }

        }

        function GetComentarios(id) {
            if ($("#content-2").length > 0) {
                $("#content-2").remove();
            }
            var url = '/api/Participacion/GetComentariosContrato';
            var param = "CodigoContrato=" + id;
            Services.projectsList(url + "?" + param)
                .done(function (result) {
                    var items_result = result.itemcomentario;
                    if ($("#content-2").length <= 0) {
                        d3.select("#divComentarios")
                            .append("div")
                            .attr("id", "content-2")
                            .attr("class", "content mCustomScrollbar")
                            .attr("data-mcs-theme", "minimal")
                    }

                    var cont_resp = 0;

                    if (items_result.length > 0) {
                        var id_padre = 0;
                        var id_preg = 0;


                        for (var i = 0; i < items_result.length; i++) {

                            id_padre = items_result[i].ComentarioRelacionado;
                            if ($("#content-2").length > 0) {

                                var d = new Date(items_result[i].fechaCreacion);
                                var fecha_aux = pad(d.getDate(), 2) + "/" + pad(parseInt((d.getMonth()) + 1), 2) + "/" + d.getFullYear();
                                var nombre = "";
                                if (items_result[i].Anonimo == false) {
                                    nombre = items_result[i].nom_usuario.toString();
                                }
                                else {
                                    nombre = " Anónimo";
                                }
                                var textocomentario = "";
                                if (items_result[i].ComentarioOriginal) {
                                    textocomentario = items_result[i].ComentarioOriginal.toString();
                                }
                                if (id_padre == null) {
                                    cont_resp = cont_resp + 1;
                                    var div_commenta = d3.select("#content-2")
                                    var div_comment = div_commenta.append("div")
                                        .attr("class", "Comment")
                                    var dividcomm = "divPadre" + items_result[i].IdComentario;
                                    var div_coment = div_comment.append("div")
                                        .attr("class", "User_comment")
                                    var usr_pic = div_coment.append("div")
                                        .attr("class", "Pic_user")
                                        .append("img")
                                        .attr("src", "/img/User_profile.jpg")
                                    var usr_poster = div_coment.append("div")
                                        .attr("class", "Post_user")
                                    var usr_name = usr_poster.append("div")
                                        .attr("class", "Post_name")
                                        .append("text").text(" " + nombre + ": ")
                                    var usr_txt = usr_poster.append("div")
                                        .attr("class", "Post_txt")
                                        .append("text").text(" " + textocomentario)
                                    var usr_date = usr_poster.append("div")
                                        .attr("class", "Post_date")
                                        .append("text").text("Fecha de Publicación: " + fecha_aux)
                                    var divhijo = div_comment.append("div")
                                        .attr("id", dividcomm)
                                }
                                else {
                                    var dividcomm = "#divPadre" + id_padre;
                                    var div_res = d3.select(dividcomm)
                                    var div_gov = div_res.append("div")
                                        .attr("class", "Gov_comment")
                                    var usr_pic = div_gov.append("div")
                                        .attr("class", "Pic_user")
                                        .append("img")
                                        .attr("src", "/content/img/PCM_Haciendapy.jpg")
                                    var usr_poster = div_gov.append("div")
                                        .attr("class", "Post_user")
                                    var usr_txt = usr_poster.append("div")
                                        .attr("class", "Post_txt")
                                        .append("text").text(" " + textocomentario)
                                    var usr_date = usr_poster.append("div")
                                        .attr("class", "Post_date")
                                        .append("text").text("Fecha de Publicación: " + fecha_aux)
                                }


                            }

                        }
                    }
                    $("#txtNumComentarios").text(" " + cont_resp + "  ");

                });

        }

        function pad(n, length) {
            var n = n.toString();
            while (n.length < length)
                n = "0" + n;
            return n;
        }


    }

)