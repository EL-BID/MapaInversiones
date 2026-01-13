var projectPerfil = JSON.parse(document.body.getAttribute('data-profile'));
var anyo_actual = (new Date).getFullYear();
var logoresponde = "";
var loader_proy = "<div class=\"MIVloader\">&nbsp;</div>";


        InicializaDatos();

        function maskPosition(element, noLoader) {
            var maskElem = $('<div class="mask"><div class="bg"></div>' +
                (!noLoader ? '<div class="icon"></div>' : '<div class="icon"></div>') + '<div>'),
                position = element.offset(),
                Wmask = element[0].offsetWidth,
                Hmask = element[0].offsetHeight;

            maskElem.appendTo(document.body)
            maskElem.css({ 'width': Wmask, 'height': Hmask, 'left': position.left, 'top': position.top })
            element.data('mask', maskElem)
        }

        function InicializaDatos() {
            $("#secEncabezado").hide();
            $("#divFotos").hide();
            $("#divComentarios").hide();
            $("#divCloseSesion").hide();
            $("#divDetComent").attr("estado", "");
            $("#divDetComent").attr("asoc", "");
            $("#divDetImg").attr("estado", "");

            //usuario en session
            $("#hdIdUsuario").val(projectPerfil[0].idUsuParticipa);
            $("#hdNomUsuario").val(projectPerfil[0].nomUsuParticipa);
            if ($("#hdIdUsuario").val() != "") {
                validaSesionUsu($("#hdIdUsuario").val());
            } else {
                $("#divNomUsuarioLog").text("");
                $("#hdNomUsuario").val("");
                $("#hdIdUsuario").val("");
                $("#divUsuarioLog").slideDown(100, function () {
                    $("#divCloseSesion").hide();
                    $("#divFotos").hide();
                    $("#divComentarios").hide();
                });

            }
            //add funciones login
            $("#txtEmailLog").val("");
            $("#txtClaveLog").val("");
            $("#divCloseSesion").hide();


            $("#btnIngresarUsuLog").click(function () {
                validaLoginUsu();
            });


            $("#enlace_cierre").click(function () {
                cerrarSesionUsu();

            });

            $("#btnAccionDenegar").click(function () {
                var tipo = $("#justificaModal").attr("data-type");
                var obj_param = $("#justificaModal").attr("data-parameter");

                if (tipo == "comentario") {
                    var idcoment = $("#" + obj_param).attr('idcoment');
                    var idusuario = $("#" + obj_param).attr('idusuario');
                    var IdProyecto = $("#" + obj_param).attr('idproyecto');
                    var idasociacion = ($("#" + obj_param).attr('idasociacion'));
                    var idprograma = ($("#" + obj_param).attr('idprograma'));
                    var codigoContrato = ($("#" + obj_param).attr('codigoContrato'));
                    var textoJustifica = $("#txtJustificacion").val();
                    UpdateComentario('4', idcoment, idusuario, IdProyecto, idasociacion, idprograma, codigoContrato, textoJustifica);
                }
                if (tipo == "foto") {
                    var tipoFoto = $("#" + obj_param).attr('tipofoto');
                    var idFoto = $("#" + obj_param).attr('idfoto');
                    var IdProyecto = $("#" + obj_param).attr('idproyecto');
                    var idusuario = $("#" + obj_param).attr('idusuario');
                    var textoJustifica = $("#txtJustificacion").val();
                    guardarAprobado('E', tipoFoto, idFoto, IdProyecto, idusuario, textoJustifica);
                }
                $('#justificaModal').modal('hide');

            });


            $("#recategorizarModalGuardar").click(function () {
                var obj_param = $("#recategorizarModal").attr("data-parameter");
                var idcoment = $("#" + obj_param).attr('idcoment');
                var id_tipo = $("#filtro_TipoCometario li.selected").attr("id_tipo");
                if (id_tipo == "" || id_tipo == undefined) {
                    formularioOK = false;
                    bootbox.alert("Seleccione un tipo de comentario");
                }
                else {
                    CambiaTipoComentario(idcoment, id_tipo);
                }
            });


            configurarEnlaceTabs();
            configuraFiltros();
            configBtnTipologia();

        }




        function inicializaFiltrosFotos() {
            var obj = $("#filtro_estados_foto option:eq(0)");
            var obj_valor = obj.attr("value");
            var obj_texto = obj.text();
            $("#filtro_estados_foto").find(".btn-select-input").val(obj_valor);
            $("#filtro_estados_foto").find(".btn-select-value").html(obj_texto);
        }

        function inicializaFiltrosComent() {
            var obj_estado = $("#filtro_estados option:eq(0)");
            var obj_estado_valor = obj_estado.attr("value");
            var obj_estado_texto = obj_estado.text();
            $("#filtro_estados").find(".btn-select-input").val(obj_estado_valor);
            $("#filtro_estados").find(".btn-select-value").html(obj_estado_texto);
            var obj_asoc = $("#filtro_asociacion option:eq(0)");
            var obj_asoc_valor = obj_asoc.attr("value");
            var obj_asoc_texto = obj_asoc.text();
            $("#filtro_asociacion").find(".btn-select-input").val(obj_asoc_valor);
            $("#filtro_asociacion").find(".btn-select-value").html(obj_asoc_texto);
        }

        function configurarEnlaceTabs() {
            $('.enlace_comentarios').each(function (i, e) {
                $(e).bind('click', function () {
                    $("#divTabComent").attr("class", "TabAct");
                    $("#divTabFotos").attr("class", "TabBen");
                    $("#divFotos").hide();
                    inicializaFiltrosComent();
                    var estado = $("#filtro_estados option:selected").val();
                    var asociacion = $("#filtro_asociacion option:selected").val();
                    $("#divDetComent").html("");
                    $("#divDetComent").html(loader_proy);
                    ObtenerComentarios(estado, asociacion, 1);
                    ObtenerComentariosCant();
                    ObtenerImgAprobCant();
                });
            });

            $('.enlace_fotos').each(function (i, e) {
                $(e).bind('click', function () {
                    $("#divTabFotos").attr("class", "TabAct");
                    $("#divTabComent").attr("class", "TabBen");
                    $("#divComentarios").hide();
                    inicializaFiltrosFotos();
                    var estado = $("#filtro_estados_foto option:selected").val();
                    ObtenerImgAprobar(estado, 1);
                    ObtenerComentariosCant();
                    ObtenerImgAprobCant();
                });
            });

        }

        function configuraFiltros() {
            $('#filtro_estados').on('change', function () {
                var val_Sel = this.value;
                var opc_asoc = $("#divDetComent").attr("asoc");
                if (val_Sel != "") {
                    $("#divDetComent").html("");
                    $("#divDetComent").html(loader_proy);
                    ObtenerComentarios(val_Sel, opc_asoc, 1);
                } else {
                    $("#divDetComent").attr("estado", "");
                }

            });

            $('#filtro_asociacion').on('change', function () {
                var val_sel = this.value;
                var opc_estado = $("#divDetComent").attr("estado");
                if (val_sel != "") {
                    $("#divDetComent").html("");
                    $("#divDetComent").html(loader_proy);
                    ObtenerComentarios(opc_estado, val_sel, 1);
                } else {
                    $("#divdetcoment").attr("asoc", "");
                }

            });

            $('#filtro_estados_foto').on('change', function () {
                var val_Sel = this.value;
                if (val_Sel != "") {
                    ObtenerImgAprobar(val_Sel, 1);
                } else {
                    //opcion vacia
                    //ObtenerImgAprobar(1, 1);
                    $("#divDetImg").attr("estado", "");
                }

            });

        }


        function configuraBtn(idfoto) {

            $("#btnAprueba" + idfoto).click(function () {
                var tipoFoto = ($(this).attr('tipofoto'));
                var idFoto = ($(this).attr('idfoto'));
                var IdProyecto = ($(this).attr('idproyecto'));
                var idusuario = ($(this).attr('idusuario'));
                var textoJustifica = "";
                guardarAprobado('A', tipoFoto, idFoto, IdProyecto, idusuario, textoJustifica);
            });


            $("#btnElimina" + idfoto).click(function () {

                var obj_aux = this.id;
                openModalDenegar("foto", obj_aux);

            });

        }

        function configuraBtns(id) {

            $("#btnPublicar" + id).click(function () {
                var idcoment = ($(this).attr('idcoment'));
                var idusuario = ($(this).attr('idusuario'));
                var IdProyecto = ($(this).attr('idproyecto'));
                var idasociacion = ($(this).attr('idasociacion'));
                var idprograma = ($(this).attr('idprograma'));
                var codigoContrato = ($(this).attr('codigoContrato'));
                var textoJustifica = "";
                UpdateComentario('3', idcoment, idusuario, IdProyecto, idasociacion, idprograma, codigoContrato, textoJustifica);
            });

            $("#btnRecategorizar" + id).click(function () {
                var obj_aux = this.id;
                openModalCambiarTipoComentario(obj_aux);
            });


            $("#btnTipologia" + id).click(function () {
                ObtenerTipologiasComentario(id);
                openModalTipologia(id);
            });

            $("#btnEliminaC" + id).click(function () {
                var obj_aux = this.id;
                openModalDenegar("comentario", obj_aux);
            });

            $("#btnRespuesta" + id).click(function () {
                $("#btnRespuesta" + id).hide();

                var idcoment = ($(this).attr('idcoment'));
                var idproyecto = ($(this).attr('idproyecto'));
                var idusuario = ($(this).attr('idusuario'));
                var idasociacion = ($(this).attr('idasociacion'));
                var idprograma = ($(this).attr('idprograma'));
                var codigoContrato = ($(this).attr('codigoContrato'));

                var tiporespuestaaux = "optionsRadiostxtRespuesta" + idcoment;
                var tiporespuesta = $("input:radio[name='" + tiporespuestaaux + "']:checked").val();
                GuardaRepuesta(idcoment, idproyecto, idprograma, idusuario, idasociacion, codigoContrato, tiporespuesta);
            });
        }

        function configBtnTipologia() {
            $("#topoModalGuardar").click(function () {
                var idcoment = $("#topoModal").attr("data-parameter");
                var tipo_old = $("#tipologia_old_" + idcoment).val();
                var vec_old = [];
                if (tipo_old != "" && tipo_old != undefined) {
                    vec_old = tipo_old.split(',');
                }
                var valoresCheck = [];

                $("input[type=checkbox]:checked").each(function () {
                    valoresCheck.push(this.value);
                });

                if (arraysEqual(vec_old, valoresCheck) == false) {
                    //son diferentes
                    //guardar valores
                    if (vec_old.length > 0) {
                        var tipologias_aux = valoresCheck.join(',');
                        CambiaTipologiaComentario(idcoment, tipologias_aux);
                    } else {
                        if (valoresCheck.length > 0) {
                            var tipologias_aux = valoresCheck.join(',');
                            CambiaTipologiaComentario(idcoment, tipologias_aux);
                        } else {
                            bootbox.alert({
                                message: 'Debe seleccionar al menos un tipo de comentario',
                                buttons: {
                                    ok: {
                                        label: 'Aceptar'
                                    }
                                }
                            });
                        }
                    }

                } else {
                    bootbox.alert({
                        message: 'No existe cambio en los tipos de comentarios asociados',
                        buttons: {
                            ok: {
                                label: 'Aceptar'
                            }
                        }
                    });

                }

            });

        }

        function arraysEqual(_arr1, _arr2) {

            if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length)
                return false;

            var arr1 = _arr1.concat().sort();
            var arr2 = _arr2.concat().sort();

            for (var i = 0; i < arr1.length; i++) {

                if (arr1[i] !== arr2[i])
                    return false;

            }

            return true;

        }

        function openModalCambiarTipoComentario(obj) {
            var texto = "";
            var titulo = "";
            texto = "Puede cambiar el tipo de comentario seleccionado por el usuario";
            titulo = "Cambiar Tipo de Comentario";
            $("#recategorizarModal").attr("data-parameter", obj);

            $("#recategorizarModalLabel").text(titulo);
            $("#recategorizarModaltextoGuia").text(texto);

            jQuery.noConflict();
            $('#recategorizarModal').modal('show');
            $("#recategorizarModal").on('hide.bs.modal', function () {
                $("#recategorizarModal").attr("data-type", "");
                $("#recategorizarModal").attr("data-parameter", "");
            });
        }

        function openModalTipologia(obj) {
            var texto = "";
            var titulo = "";
            texto = "Puede cambiar los tipos de comentarios asociados";
            titulo = "Tipos del Comentario";
            $("#topoModal").attr("data-parameter", obj);

            $("#topoModalLabel").text(titulo);
            $("#topoModaltextoGuia").text(texto);

            jQuery.noConflict();
            $('#topoModal').modal('show');
            $("#topoModal").on('hide.bs.modal', function () {
                $("#topoModal").attr("data-type", "");
                $("#topoModal").attr("data-parameter", "");
            });
        }


        function openModalDenegar(opcion, obj) {
            //no aprobar foto/ no publicar comentario
            var texto = "";
            var titulo = "";
            if (opcion == "comentario") {
                texto = "Describa el motivo por la cual no aprueba la publicación del comentario. Recuerde que éste será enviado a quién comentó.";
                titulo = "NO PUBLICAR";
                $("#justificaModal").attr("data-type", "comentario");
                $("#justificaModal").attr("data-parameter", obj);
            } else if (opcion == "foto") {
                texto = "Describa el motivo por la cual no aprueba la fotografía. Recuerde que éste será enviado a quién la subió.";
                titulo = "NO APROBAR";
                $("#justificaModal").attr("data-type", "foto");
                $("#justificaModal").attr("data-parameter", obj);
            } else {
                texto = "";
                titulo = "";
                $("#justificaModal").attr("data-type", "");
                $("#justificaModal").attr("data-parameter", "");
            }
            $("#modalJustificaLabel").text(titulo);
            $("#textoGuia").text(texto);

            event.preventDefault();
            jQuery.noConflict();
            $('#justificaModal').modal('show');
            $("#justificaModal").on('hide.bs.modal', function () {
                $("#justificaModal").attr("data-type", "");
                $("#justificaModal").attr("data-parameter", "");
            });


        }

        function cerrarSesionUsu() {
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/CerrarSession",
                cache: false,
                data: null,
                success: function (result) {
                    if (result.status == true) {
                        //USUARIO EXISTE
                        $("#divNomUsuarioLog").text("");
                        $("#hdNomUsuario").val("");
                        $("#hdIdUsuario").val("");
                        $("#divUsuarioLog").slideDown(100, function () {
                            $("#divCloseSesion").hide();
                            $("#divFotos").hide();
                            $("#divComentarios").hide();
                            $("#secEncabezado").hide();
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


        function validaSesionUsu() {
            var params_usu = {
                IdUsuario: $("#hdIdUsuario").val(),
                valida_rol: 'S'
            };
            //add nuevo registro
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/ValidaSessionUsu",
                cache: false,
                data: JSON.stringify(params_usu),
                success: function (result) {
                    if (result.status == true) {
                        //USUARIO CON CREDENCIALES VALIDAS DE ADMON LOGUEADO
                        $("#divNomUsuarioLog").text("Hola " + result.usuarios.nombre);
                        $("#hdNomUsuario").val(result.usuarios.nombre);

                        /*------------------------*/
                        inicializaFiltrosFotos();
                        var estado = $("#filtro_estados_foto option:selected").val();
                        ObtenerImgAprobar(estado, 1);
                        /*------------------------*/

                        ObtenerComentariosCant();
                        ObtenerImgAprobCant();

                        $("#s0").hide();
                        $("#divCloseSesion").show();
                        $("#divFotos").show();
                        $("#divComentarios").hide();
                        $("#secEncabezado").show();


                    } else {
                        bootbox.alert("@Error: " + result.message, function () {
                            cerrarSesionUsu();
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
                if (validaEmail($('#txtEmailLog').val().toLowerCase())) {
                    var params_usu = {
                        email: $("#txtEmailLog").val(),
                        hash_clave: $("#txtClaveLog").val(),
                        valida_rol: 'S'
                    };
                    //add nuevo registro
                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: "/api/ServiciosParticipacion/ValidaLogin",
                        cache: false,
                        data: JSON.stringify(params_usu),
                        success: function (result) {
                            if (result.status == true) {
                                //USUARIO EXISTE
                                $("#divNomUsuarioLog").text("Hola " + result.usuarios.nombre);
                                $("#hdNomUsuario").val(result.usuarios.nombre);
                                $("#hdIdUsuario").val(result.usuarios.idUsuario);

                                /*------------------------*/
                                inicializaFiltrosFotos();
                                var estado = $("#filtro_estados_foto option:selected").val();
                                ObtenerImgAprobar(estado, 1);
                                /*------------------------*/
                                ObtenerImgAprobCant();
                                ObtenerComentariosCant();

                                $("#s0").slideUp(100, function () {
                                    $("#secEncabezado").show();
                                    $("#divCloseSesion").show();
                                    $("#divFotos").show();
                                    //$("#divComentarios").show();
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
                    bootbox.alert("Email inválido");
                }
            }
        }






        function guardarAprobado(ax, tipoFoto, id, idproyecto, idusuario, textoJustifica) {
            //valida campos obligatorios
            var aprobado = false;
            var eliminado = false;
            var idFoto = '';
            var idFotoUsuario = '';
            if (ax == 'A') { aprobado = true }
            else if (ax == 'E') { eliminado = true }
            else { bootbox.alert("Error"); }
            if (tipoFoto == 'U') { idFotoUsuario = id; }
            else { bootbox.alert("Error"); }

            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();


            if (formularioOK == false) {
                if (camposReq != "") {
                    bootbox.alert("Faltan campos obligatorios");
                }
            } else {
                if ($("#hdIdUsuario").val() != 0) {
                    var params_foto = {
                        Aprobadopor: $("#hdIdUsuario").val(),
                        IdFotoUsuario: idFotoUsuario,
                        Aprobado: aprobado,
                        Eliminado: eliminado,
                        IdProyecto: idproyecto,
                        IdUsuario: idusuario,
                        textoJustifica: textoJustifica
                    };
                    //add nuevo registro
                    $.ajax({
                        type: 'GET',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: "/api/ServiciosParticipacion/GuardarAprobado",
                        cache: false,
                        data: params_foto,
                        success: function (result) {
                            if (result.status == true) {
                                bootbox.alert("Registro actualizado", function () {
                                    ObtenerImgAprobar(1, 1);
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
                    bootbox.alert("Ingrese con su usuario");
                }
            }
        }

        function UpdateComentario(estado, idcomentario, IdUsuario, IdProyecto, idsociacion, idprograma, codigoContrato, textoJustifica) {
            //valida campos obligatorios
            var idFotoUsuario = '';
            $("#divDetComent").html("");
            $("#divDetComent").html(loader_proy);

            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();


            if (formularioOK == false) {
                if (camposReq != "") {
                    bootbox.alert("Faltan campos obligatorios");
                }
            } else {
                if ($("#hdIdUsuario").val() != 0) {
                    var params_comen = {
                        IdComentario: idcomentario,
                        IdEstado: estado,
                        IdUsuario: IdUsuario,
                        IdProyecto: IdProyecto,
                        IdAsociacion: idsociacion,
                        IdPrograma: idprograma,
                        codigoContrato: codigoContrato,
                        textoJustifica: textoJustifica

                    };
                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: "/api/ServiciosParticipacion/PublicarComentario",
                        cache: false,
                        data: JSON.stringify(params_comen),
                        success: function (result) {
                            if (result.status == true) {
                                bootbox.alert("Registro actualizado", function () {
                                    var estado = $("#divDetComent").attr("estado");
                                    var asociacion = $("#divDetComent").attr("asoc");
                                    ObtenerComentarios(estado, asociacion, 1);
                                });

                            } else {
                                bootbox.alert("@Error: " + result.message);
                                var estado = $("#divDetComent").attr("estado");
                                var asociacion = $("#divDetComent").attr("asoc");
                                ObtenerComentarios(estado, asociacion, 1);
                            }

                        },
                        error: function (response) {
                            alert(response.responseText);
                            var estado = $("#divDetComent").attr("estado");
                            var asociacion = $("#divDetComent").attr("asoc");
                            ObtenerComentarios(estado, asociacion, 1);
                        },
                        failure: function (response) {
                            alert(response.responseText);
                            var estado = $("#divDetComent").attr("estado");
                            var asociacion = $("#divDetComent").attr("asoc");
                            ObtenerComentarios(estado, asociacion, 1);
                        }
                    });

                } else {
                    bootbox.alert("Ingrese con su usuario");
                }
            }
        }

        function CambiaTipoComentario(idcomentario, idtipocomentario) {
            $("#divDetComent").html("");
            $("#divDetComent").html(loader_proy);
            var params_comen = {
                IdComentario: idcomentario,
                IdTipoComentario: idtipocomentario
            };
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/CambiaTComentario",
                cache: false,
                data: JSON.stringify(params_comen),
                success: function (result) {
                    if (result.status == true) {
                        bootbox.alert("Registro actualizado", function () {
                            var estado = $("#divDetComent").attr("estado");
                            var asociacion = $("#divDetComent").attr("asoc");
                            ObtenerComentarios(estado, asociacion, 1);
                            $('#recategorizarModal').modal('hide');

                        });

                    } else {
                        bootbox.alert("@Error: " + result.message);
                        var estado = $("#divDetComent").attr("estado");
                        var asociacion = $("#divDetComent").attr("asoc");
                        ObtenerComentarios(estado, asociacion, 1);
                    }

                },
                error: function (response) {
                    alert(response.responseText);
                    var estado = $("#divDetComent").attr("estado");
                    var asociacion = $("#divDetComent").attr("asoc");
                    ObtenerComentarios(estado, asociacion, 1);
                },
                failure: function (response) {
                    alert(response.responseText);
                    var estado = $("#divDetComent").attr("estado");
                    var asociacion = $("#divDetComent").attr("asoc");
                    ObtenerComentarios(estado, asociacion, 1);
                }
            });
        }

        function GuardaRepuesta(idcomentario, idproyecto, idprograma, IdUsuariocomenta, Idasociacion, codigoContrato, tiporespuesta) {
            var text_coment = '';
            var nombrecampo = "#txtRespuesta" + idcomentario

            var text_coment = $(nombrecampo).val();
            $("#divDetComent").html("");
            $("#divDetComent").html(loader_proy);
            var formularioOK = true;

            var IdEstadoRelacionado = 0;
            if (tiporespuesta == "option1") {
                IdEstadoRelacionado = 5;
            }
            else if (tiporespuesta == "option2") {
                IdEstadoRelacionado = 6;
            }
            else {
                bootbox.alert("La respuesta debe ser parcial o final");
            }
            if (text_coment == "") {
                bootbox.alert("Faltan campos obligatorios");
            } else {
                if ($("#hdIdUsuario").val() != 0) {
                    var params_comen = {
                        IdUsuario: $("#hdIdUsuario").val(),
                        ComentarioRelacionado: idcomentario,
                        IdEstado: 3,
                        IdEstadoRelacionado: IdEstadoRelacionado,
                        IdTipoRespuesta: 2,
                        IdTipoComentario: 1,
                        IdProyecto: idproyecto,
                        ComentarioOriginal: text_coment,
                        UsuarioComenta: IdUsuariocomenta,
                        Idasociacion: Idasociacion,
                        IdPrograma: idprograma,
                        codigoContrato: codigoContrato


                    };
                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: "/api/ServiciosParticipacion/insComentario",
                        cache: false,
                        data: JSON.stringify(params_comen),
                        success: function (result) {
                            if (result.status == true) {
                                bootbox.alert("Registro creado", function () {
                                    var estado = $("#divDetComent").attr("estado");
                                    var asociacion = $("#divDetComent").attr("asoc");
                                    ObtenerComentarios(estado, asociacion, 1);
                                });

                            } else {
                                bootbox.alert("@Error: " + result.message);
                                var estado = $("#divDetComent").attr("estado");
                                var asociacion = $("#divDetComent").attr("asoc");
                                ObtenerComentarios(estado, asociacion, 1);
                            }

                        },
                        error: function (response) {
                            alert(response.responseText);
                            var estado = $("#divDetComent").attr("estado");
                            var asociacion = $("#divDetComent").attr("asoc");
                            ObtenerComentarios(estado, asociacion, 1);
                        },
                        failure: function (response) {
                            alert(response.responseText);
                            var estado = $("#divDetComent").attr("estado");
                            var asociacion = $("#divDetComent").attr("asoc");
                            ObtenerComentarios(estado, asociacion, 1);
                        }
                    });

                } else {
                    bootbox.alert("Ingrese con su usuario");
                }
            }
        }

function ObtenerImgAprobar(estado, pagina) {
    var param = {
        "page": pagina,
        "estado": estado,
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/api/ServiciosProyectos/GetFotosEstados",
        cache: false,
        data: param,
        success: function (data) {
            $("#divDetImg").attr("estado", estado);
            $("#divFotos").show();
            var totalImagAprob = data.totalNumber;
            //$("#lblCantFotos").text("(" + totalImagAprob + ")");
            var div_proy = d3.select("#divDetImg")
            $("#divDetImg").show();
            $("#divDetImg").html("");
            if (data.fotosU.length > 0) {
                $("#divMensaje").hide();
                var cont = 0;
                for (var i = 0; i < 4; i++) {
                    var div_fila = div_proy.append("div")
                        .attr("class", "row")
                    for (var j = 0; j < 4; j++) {
                        if (cont < data.fotosU.length) {
                            var div_col = div_fila.append("div")
                                .attr("class", "col-md-3 boxImg")
                            div_col.append("div")
                                .attr("class", "thumbnail type4")
                                .append("img")
                                .attr("class", "img-responsive")
                                .attr("src", data.fotosU[cont].thumbnail)
                                .attr("alt", data.fotosU[cont].description)
                            var div_cat = div_col.append("div")
                                .attr("class", "labelCategory")
                            div_cat.append("div")
                                .attr("class", "col-md-2")
                                .append("span")
                                .attr("class", "material-icons")
                                .text("check_circle_outline")
                            div_cat.append("div")
                                .attr("class", "col-md-10")
                                .append("span")
                                .attr("class", "")
                                .text("- SUBIDO EL " + data.fotosU[cont].fechaFoto)
                            var div_thumbnail = div_col.append("div")
                                .attr("class", "dataThumbnail")
                            div_thumbnail.append("div")
                                .text("Descripción: " + data.fotosU[cont].description)
                            div_thumbnail.append("div")
                                .text("Proyecto: " + data.fotosU[cont].nombreProyecto + " en " + data.fotosU[cont].nombreMunicipio)
                            div_thumbnail.append("div")
                                .text("Usuario: " + data.fotosU[cont].nombreUsuario)
                            var div_det = div_col.append("div")
                                .attr("class", "detailedLinks")
                            if (estado == 1) {
                                var div_det1 = div_det.append("div")
                                    .attr("class", "col-md-6 text-center")
                                var div_det2 = div_det1.append("div")
                                    .attr("class", "btnAprueba")
                                    .attr("id", "btnAprueba" + data.fotosU[cont].idFoto)
                                    .attr("role", "button")
                                    .attr("tipofoto", "U")
                                    .attr("idfoto", data.fotosU[cont].idFoto)
                                    .attr("idproyecto", data.fotosU[cont].idProyecto)
                                    .attr("idusuario", data.fotosU[cont].idUsuario)
                                div_det2.append("span")
                                    .attr("class", "material-icons")
                                    .text("check_circle_outline")
                                div_det2.append("p")
                                    .text("Aprobar")
                            }
                            if (estado != 3) {
                                var div_det3 = div_det.append("div")
                                    .attr("class", "col-md-6 text-center")
                                var div_det4 = div_det3.append("div")
                                    .attr("class", "btnElimina")
                                    .attr("id", "btnElimina" + data.fotosU[cont].idFoto)
                                    .attr("role", "button")
                                    .attr("tipofoto", "U")
                                    .attr("idfoto", data.fotosU[cont].idFoto)
                                    .attr("idproyecto", data.fotosU[cont].idProyecto)
                                    .attr("idusuario", data.fotosU[cont].idUsuario)
                                div_det4.append("span")
                                    .attr("class", "glyphicon glyphicon-remove")
                                div_det4.append("p")
                                    .text("No Aprobar")
                            }
                            configuraBtn(data.fotosU[cont].idFoto);

                        }
                        cont += 1;
                    }
                }

                dibujarPagNumeradasFotos(pagina, data.totalNumber, data.totalPages);

            } else {
                $("#divPaginacion").html("");
                $("#divPaginacion").hide();
                $("#divMensaje").show();
                $("#divDetImg").hide();

            }
            //if ($('#divFotos').data('mask'))
            //    $('#divFotos').data('mask').fadeOut(function () {
            //        $(this).remove();

            //    });
        }
    });
}

        function dibujarPag(actual, total, totalPag) {
            var pag_actual = parseInt(actual);
            pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 16;
            $("#divPaginacion").html("");
            var divPag = d3.select("#divPaginacion")
            divPag.append("text")
                .text("Pág: ")
            for (var i = 1; i <= totalPag; i++) {
                if (i == actual) {
                    var pag_enlace = divPag.append("span")
                        .attr("class", "pag_actual")
                        .attr("data-page", i)
                    pag_enlace.append("text")
                        .text(i)
                } else {
                    var pag_enlace = divPag.append("a")
                        //.attr("id", "page_left")
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

            $('.page_left').bind('click', function () {
                pagina_actual = $(this).attr("data-page");
                ObtenerImgAprobar("", pagina_actual);
            });

        }

        function dibujarPagNumeradasFotos(actual, total, totalPag) {

            var pag_actual = parseInt(actual);
            var pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 6;
            var cant_por_linea = 10;
            $("#divPaginacion").html("");
            $("#divPaginacion").show();
            var divPag = d3.select("#divPaginacion")

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


            if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
                var pag_enlace = divPag.append("a")
                    .attr("id", "page_left")
                    .attr("class", "pull-left")
                    .attr("data-page", inicio - cant_por_linea)
                pag_enlace.append("span")
                    .attr("class", "glyphicon glyphicon-arrow-left")
                pag_enlace.append("text")
                    .text(" Anterior")
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
                        //.attr("id", "page_left")
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
                if ((totalPag - pag_actual) > cant_por_linea) {
                    var pag_enlace_der = divPag.append("a")
                        .attr("id", "page_right")
                        .attr("class", "")
                        .attr("data-page", fin + 1)
                        .text("Próximo ")
                    pag_enlace_der.append("span")
                        .attr("class", "glyphicon glyphicon-arrow-right")

                }
            }

            $('#page_right,#page_left,.page_left').bind('click', function () {
                pagina_actual = $(this).attr("data-page");
                var estado = $("#divDetImg").attr("estado");
                ObtenerImgAprobar(estado, pagina_actual);
            });

        }


        function dibujarPagNumeradasComent(actual, total, totalPag) {

            var pag_actual = parseInt(actual);
            var pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 6;
            var cant_por_linea = 10;
            $("#divPaginacionComent").html("");
            $("#divPaginacionComent").show();
            var divPag = d3.select("#divPaginacionComent")

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


            if (pag_actual > cant_por_linea && totalPag >= cant_por_linea) {
                var pag_enlace = divPag.append("a")
                    .attr("id", "page_left")
                    .attr("class", "pull-left")
                    .attr("data-page", inicio - cant_por_linea)
                pag_enlace.append("span")
                    .attr("class", "glyphicon glyphicon-arrow-left")
                pag_enlace.append("text")
                    .text(" Anterior")
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
                        //.attr("id", "page_left")
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
                if ((totalPag - pag_actual) > cant_por_linea) {
                    var pag_enlace_der = divPag.append("a")
                        .attr("id", "page_right")
                        .attr("class", "")
                        .attr("data-page", fin + 1)
                        .text("Próximo ")
                    pag_enlace_der.append("span")
                        .attr("class", "glyphicon glyphicon-arrow-right")

                }
            }

            $('#page_right,#page_left,.page_left').bind('click', function () {
                pagina_actual = $(this).attr("data-page");
                var estado = $("#divDetComent").attr("estado");
                var asociacion = $("#divDetComent").attr("asoc");
                $("#divDetComent").html("");
                $("#divDetComent").html(loader_proy);
                ObtenerComentarios(estado, asociacion, pagina_actual);
            });

        }



        function dibujaPaginacion(actual, total, totalPag) {
            var pag_actual = parseInt(actual);
            pagina_actual = pag_actual;
            var pagesHTML = '';
            var cant_por_pag = 2;
            $("#divPaginacion").html("");
            var divPag = d3.select("#divPaginacion")
            if (pag_actual > 1 && total >= cant_por_pag) {
                var pag_enlace = divPag.append("a")
                    .attr("id", "page_left")
                    .attr("class", "pull-left")
                    .attr("data-page", pag_actual - 1)
                pag_enlace.append("span")
                    .attr("class", "glyphicon glyphicon-arrow-left")
                pag_enlace.append("text")
                    .text(" Anterior")
            }
            divPag.append("span")
                .attr("class", "totalpages")
                .text("Página " + actual + " de " + totalPag)

            if (pag_actual < totalPag) {
                if ((total - (pag_actual * cant_por_pag)) > 0) {
                    var pag_enlace_der = divPag.append("a")
                        .attr("id", "page_right")
                        .attr("class", "pull-right")
                        .attr("data-page", pag_actual + 1)
                        .text("Próximo ")
                    pag_enlace_der.append("span")
                        .attr("class", "glyphicon glyphicon-arrow-right")

                }
            }

            $('#page_right,#page_left').bind('click', function () {
                d3.select("#divDetImg").html("");
                pagina_actual = $(this).attr("data-page");
                ObtenerImgAprobar("", pagina_actual);
            });


        }


        function pad(n, length) {
            var n = n.toString();
            while (n.length < length)
                n = "0" + n;
            return n;
        }

function ObtenerComentariosCant() {
    $.ajax({
        url: "/api/ServiciosParticipacion/GetCometAprobarCant",
        type: "GET",

    }).done(function (data) {
        var totalComentAprob = data.totalNumber;
        $("#lblCantComentarios").text("(" + totalComentAprob + ")");
    });

}


function ObtenerImgAprobCant() {
    $.ajax({
        url: "/api/ServiciosProyectos/GetFotosAprobarCant",
        type: "GET",

    }).done(function (data) {
        var totalImagAprob = data.totalNumber;
        $("#lblCantFotos").text("(" + totalImagAprob + ")");
    });

}


        function ObtenerTipologiasComentario(idcomentario) {
            if ($("#tipologia_old_" + idcomentario).length > 0) {
                $("#tipologia_old_" + idcomentario).val("");
                $("#tipologia_old_" + idcomentario).remove();
            }

            $.ajax({
                contentType: "application/json; charset=utf-8",
                url: "/api/ServiciosParticipacion/GetTipologiaComentario",
                type: "GET",
                data: {
                    idcomentario: idcomentario
                }
            }).done(function (data) {
                $("#divTipologiaComentario").show();
                    //---------------------------------------------
                    var div_com = d3.select("#divTipologiaComentario")
                    $("#divTipologiaComentario").html("");
                    if (data.itemcomentario.length > 0) {
                        $("#divMensaje2").hide();

                        var div_content = div_com.append("div")
                        div_content.attr("class", "borderbox-Coments")
                        div_content.attr("id", "divPost_" + idcomentario)
                        let tipologia_old = [];
                        for (var cont = 0; cont < data.itemcomentario.length; cont++) {
                            var IdTipologia = data.itemcomentario[cont].idTipologia;
                            var Tipologia = data.itemcomentario[cont].tipologia;
                            var Relacion = data.itemcomentario[cont].relacion;

                            var div_fila = div_content.append("div")
                                .attr("class", "row")
                            var div_col = div_fila.append("div")
                                .attr("class", "col-md-12")
                            var div_info = div_col.append("div")
                                .attr("class", "Post_txt")

                            var check_tipo = div_info.append("input")
                            check_tipo.attr("type", "checkbox")
                            check_tipo.attr("class", "form-check-input")
                            check_tipo.attr("name", "chk_topolog_" + idcomentario)
                            check_tipo.attr("value", IdTipologia)
                            if (Relacion == 1) {
                                //div_info.append("span").attr("class", "text-bold").text("SI-")
                                check_tipo.attr("checked", "true");
                                tipologia_old.push(IdTipologia);
                            }

                            div_info.append("span").attr("class", "text-bold").text(Tipologia)


                        }


                        var jsonObj = tipologia_old.join(',');
                        var tipo_input = div_content.append("input")
                        tipo_input.attr("type", "hidden")
                        tipo_input.attr("id", "tipologia_old_" + idcomentario)
                        tipo_input.attr("value", jsonObj)


                    }
                    else {
                        $("#divTipologiaComentario").html("No hay tipos de comentario asociados en la base de datos");
                    }

                });
        }



        function ObtenerComentarios(estado, asociacion, pagina) {
            tipocomentario = 0;
                    var param = {
                        "page": pagina,
                        "estado": estado,
                        "asociacion": asociacion,
                        "tipocomentario": tipocomentario
                    };
                    $.ajax({
                        type: 'GET',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: "/api/ServiciosParticipacion/GetCometAprobar",
                        cache: false,
                        data: param,
                        success: function (data) {


                    $("#divDetComent").attr("estado", estado);
                    $("#divDetComent").attr("asoc", asociacion);

                    var totalComentAprob = data.totalNumber;
                    var totalPag = data.totalPages;
                    $("#divComentarios").show();
                    //---------------------------------------------
                    var div_com = d3.select("#divDetComent")
                    $("#divDetComent").show();
                    $("#divDetComent").html("");
                    if (data.itemcomentario.length > 0) {
                        $("#divMensaje2").hide();

                        for (var cont = 0; cont < data.itemcomentario.length; cont++) {
                            var id_comentario = data.itemcomentario[cont].idComentario;
                            var id_padre = data.itemcomentario[cont].comentarioRelacionado;
                            var d = new Date(data.itemcomentario[cont].fechaCreacion);
                            var fecha_actual = new Date();
                            var fecha_aux = pad(d.getDate(), 2) + "/" + pad(parseInt((d.getMonth()) + 1), 2) + "/" + d.getFullYear();
                            var difM = fecha_actual - d; // diferencia en milisegundos
                            var dif_dias = Math.trunc((difM / (1000 * 60 * 60 * 24))); // diferencia en dias
                            var idtextarea = "txtModera" + data.itemcomentario[cont].idComentario;
                            var idtextareaR = "txtRespuesta" + data.itemcomentario[cont].idComentario;
                            var encabezado = "";
                            var encabezado_aux = "";
                            var entidad_aux = "";
                            var entidad = "";
                            var municipio = "-";
                            if (data.itemcomentario[cont].nom_municipio != null) {
                                municipio = data.itemcomentario[cont].nom_municipio + " - " + data.itemcomentario[cont].nom_departamento;
                            }
                            var respuesta_aux = "Respuesta:";
                            if (data.itemcomentario[cont].nom_municipio != null) {
                                encabezado = data.itemcomentario[cont].nom_municipio + " - ";
                            }

                            if (data.itemcomentario[cont].idAsociacion == 3) {
                                entidad_aux = "CONTRATO";
                                encabezado_aux = "Contrato";
                                encabezado = data.itemcomentario[cont].codigoContrato;
                                logoresponde = "/content/img/PCM_Haciendapy.jpg";

                            } else if (data.itemcomentario[cont].idAsociacion == 2) {
                                entidad_aux = "PROGRAMA";
                                encabezado_aux = "Programa";
                                encabezado = data.itemcomentario[cont].nombrePrograma;
                                logoresponde = "/content/img/PCM_Haciendapy.jpg";

                            } else {
                                var nombreproy = data.itemcomentario[cont].nombreProyecto;
                                if (nombreproy != null) {
                                    entidad_aux = "PROYECTO";
                                    encabezado_aux = "Proyecto";
                                    encabezado = nombreproy.toString();
                                    logoresponde = "/content/img/PCM_profile.jpg";
                                }
                            }
                            var textocomentario = "";
                            if (data.itemcomentario[cont].comentarioOriginal) {
                                textocomentario = data.itemcomentario[cont].comentarioOriginal.toString();
                            }
                            if (id_padre == null) {
                                var div_content = div_com.append("div")
                                    .attr("class", "borderbox-Coments")
                                var div_fila = div_content.append("div")
                                    .attr("class", "row")
                                var div_col = div_fila.append("div")
                                    .attr("class", "col-md-12")
                                var div_info = div_col.append("div")
                                    .attr("class", "Post_txt")

                                if (entidad_aux.toUpperCase() == "PROYECTO") {
                                    div_info.append("a")
                                        .attr("href", "../../projectprofile/" + data.itemcomentario[cont].idProyecto)
                                        .attr("target", "_blank")
                                        .append("span")
                                        .attr("class", "text-bold")
                                        .text(encabezado_aux)

                                        .append("p")
                                        .text(encabezado)
                                }

                                if (entidad_aux.toUpperCase() == "PROGRAMA") {
                                    div_info.append("a")
                                        .attr("href", "../../covid/PerfilPrograma/?programa_id=" + data.itemcomentario[cont].idPrograma)
                                        .attr("target", "_blank")
                                        .append("span").attr("class", "text-bold").text(encabezado_aux)

                                        .append("p").text(encabezado)
                                }

                                if (entidad_aux.toUpperCase() == "CONTRATO") {
                                    div_info.append("a")
                                        .attr("href", "../../contratista/contratoprofile/?CodigoContrato=" + data.itemcomentario[cont].codigoContrato)
                                        .attr("target", "_blank")
                                        .append("span").attr("class", "text-bold").text(encabezado_aux)

                                        .append("p").text(encabezado)
                                }

                                var nombremostrar = "";
                                var emailmostrar = "";
                                
                                if (data.itemcomentario[cont].email_usuario != undefined) {
                                    emailmostrar = data.itemcomentario[cont].email_usuario.toString();
                                }
                                if (data.itemcomentario[cont].nom_usuario != undefined) {
                                    nombremostrar = data.itemcomentario[cont].nom_usuario.toString();
                                }

                                if (data.itemcomentario[cont].anonimo) {
                                    nombremostrar = "Anónimo"
                                    emailmostrar = "Anónimo"
                                }
                                var div_fila_aux = div_info.append("div")
                                    .attr("class", "row")
                                var div_col1 = div_fila_aux.append("div")
                                    .attr("class", "col-xs-4 col-md-4")
                                div_col1.append("span").attr("class", "text-bold").text("Fecha de Comentario:")
                                div_col1.append("p").text(fecha_aux + " ")
                                    .append("span").attr("class", "badge").text("Hace " + dif_dias.toString() + " días")
                                var div_col2 = div_fila_aux.append("div")
                                    .attr("class", "col-xs-4 col-md-4")
                                div_col2.append("span").attr("class", "text-bold").text("Desde donde escribe:")
                                div_col2.append("p").text(municipio)
                                var div_col3 = div_fila_aux.append("div")
                                    .attr("class", "col-xs-4 col-md-4")
                                div_col3.append("span").attr("class", "text-bold").text("Estado:")
                                div_col3.append("p").text(data.itemcomentario[cont].nombreEstado.toString())
                                var div_fila_aux3 = div_info.append("div")
                                    .attr("class", "row")
                                var div_col31 = div_fila_aux3.append("div")
                                    .attr("class", "col-xs-6 col-md-4")
                                div_col31.append("span").attr("class", "text-bold").text("Nombre del Usuario:")
                                div_col31.append("p").text(nombremostrar)
                                var div_col32 = div_fila_aux3.append("div")
                                    .attr("class", "col-xs-6 col-md-4")
                                div_col32.append("span").attr("class", "text-bold").text("Correo electrónico:")
                                div_col32.append("p").text(emailmostrar)
                                var div_col33 = div_fila_aux3.append("div")
                                    .attr("class", "col-xs-6 col-md-4")
                                div_col33.append("span").attr("class", "text-bold").text("Género del Usuario:")
                                div_col33.append("p").text(data.itemcomentario[cont].genero_usuario)

                                var div_fila_aux2 = div_info.append("div")
                                    .attr("class", "row")
                                var div_col23 = div_fila_aux2.append("div")
                                    .attr("class", "col-xs-6 col-md-4")
                                div_col23.append("span").attr("class", "text-bold").text("Rol del Usuario:")
                                div_col23.append("p").text(data.itemcomentario[cont].rol_usuario)

                                var div_col21 = div_fila_aux2.append("div")
                                    .attr("class", "col-xs-6 col-md-4")
                                div_col21.append("span").attr("class", "text-bold").text("Tipo de Comentario:")
                                div_col21.append("p").text(data.itemcomentario[cont].nombreTipoComentario)
                                    .append("a").attr("class", "btn btn-link ")
                                    .attr("idcoment", data.itemcomentario[cont].idComentario)
                                    .attr("idTipoComentario", data.itemcomentario[cont].idTipoComentario)
                                    .attr("id", "btnRecategorizar" + data.itemcomentario[cont].idTipoComentario)
                                    .attr("role", "button")
                                    .text("Recategorizar")
                                var div_col22 = div_fila_aux2.append("div")
                                    .attr("class", "col-xs-6 col-md-4")
                                div_col22.append("span").attr("class", "text-bold").text("Tipología:")
                                div_col22.append("p").append("a").attr("class", "btn btn-link")
                                    .attr("idcoment", data.itemcomentario[cont].idComentario)
                                    .attr("id", "btnTipologia" + data.itemcomentario[cont].idComentario)
                                    .attr("role", "button")
                                    .text("Asignar Tipo de comentario")


                                var div_fila2 = div_content.append("div")
                                    .attr("class", "row")
                                var div_col4 = div_fila2.append("div")
                                    .attr("class", "col-md-12")
                                var div_coment = div_col4.append("div")
                                    .attr("class", "User_comment")
                                var usr_poster = div_coment.append("div")
                                    .attr("class", "Post_user")
                                var usr_txt = usr_poster.append("div")
                                    .attr("class", "Post_txt")
                                    .append("p").text(" " + textocomentario)
                                var div_resp_ant = div_coment.append("div")
                                    .attr("class", "respuestas_ant")
                                    .attr("id", "divPadre_" + id_comentario)

                            }
                            else {

                                var dividcomm = "#divPadre_" + id_padre;
                                var div_res = d3.select(dividcomm)
                                div_res.append("span")
                                    .attr("class", "text-bold")
                                    .text("Respuestas anteriores")
                                var div_gov = div_res.append("div")
                                    .attr("class", "Gov_comment")
                                var usr_pic = div_gov.append("div")
                                    .attr("class", "Pic_user")
                                    .append("img")
                                    .attr("src", logoresponde)
                                var usr_poster = div_gov.append("div")
                                    .attr("class", "Post_user")
                                var usr_txt = usr_poster.append("div")
                                    .attr("class", "Post_txt")
                                    .append("text").text(" " + textocomentario)
                                var usr_date = usr_poster.append("div")
                                    .attr("class", "Post_date")
                                    .append("text").text("Fecha de Publicación: " + fecha_aux)
                            }


                            if (id_padre == null) {
                                var div_btn = div_col4.append("div")
                                if (data.itemcomentario[cont].idEstado == 1) {
                                    var div_det2 = div_btn.append("div")
                                        .attr("class", "btnPublicar btn btn-default")
                                        .attr("id", "btnPublicar" + data.itemcomentario[cont].idComentario)
                                        .attr("role", "button")
                                        .attr("idcoment", data.itemcomentario[cont].idComentario)
                                        .attr("idusuario", data.itemcomentario[cont].idUsuario)
                                        .attr("idproyecto", data.itemcomentario[cont].idProyecto)
                                        .attr("idasociacion", data.itemcomentario[cont].idAsociacion)
                                        .attr("idprograma", data.itemcomentario[cont].idPrograma)
                                        .attr("codigoContrato", data.itemcomentario[cont].codigoContrato)
                                    div_det2.append("span")
                                        .attr("class", "glyphicon glyphicon-ok")
                                    div_det2.append("p")
                                        .text("Publicar")
                                }
                                if (data.itemcomentario[cont].idEstado != 4) {
                                    var div_det1 = div_btn.append("div")
                                        .attr("class", "btnEliminaC btn btn-default")
                                        .attr("id", "btnEliminaC" + data.itemcomentario[cont].idComentario)
                                        .attr("role", "button")
                                        .attr("idcoment", data.itemcomentario[cont].idComentario)
                                        .attr("idusuario", data.itemcomentario[cont].idUsuario)
                                        .attr("idproyecto", data.itemcomentario[cont].idProyecto)
                                        .attr("idasociacion", data.itemcomentario[cont].idAsociacion)
                                        .attr("idprograma", data.itemcomentario[cont].idPrograma)
                                        .attr("codigoContrato", data.itemcomentario[cont].codigoContrato)

                                    div_det1.append("span")
                                        .attr("class", "glyphicon glyphicon-remove")
                                    div_det1.append("p")
                                        .text("No Publicar")

                                    //Respuesta

                                    if (data.itemcomentario[cont].idEstado != 4) {
                                        if (data.itemcomentario[cont].idEstado >= 5) {
                                            respuesta_aux = "Ampliar Respuesta:"
                                        }
                                    }
                                    var div_fila3 = div_content.append("div")
                                        .attr("class", "row")
                                    var div_col5 = div_fila3.append("div")
                                        .attr("class", "col-md-12")
                                    var div_respuesta = div_col5.append("div")
                                        .attr("class", "User_comment mt25")
                                    var div_col4 = div_respuesta.append("div")
                                    div_col4.append("span").attr("class", "text-bold").text(respuesta_aux)
                                    var texto_rpta = div_col4.append("div")
                                        .append("textarea")
                                        .attr("id", idtextareaR)
                                        .attr("rows", "4")
                                        .attr("class", "form-control")
                                    var tipobox = div_respuesta.append("div")
                                        .attr("class", "tipoBox")
                                    var labelbox1 = tipobox.append("div")
                                        .attr("class", "radio dis_Inline")
                                    var label1 = labelbox1.append("label")
                                    label1.append("input").attr("type", "radio").attr("name", "optionsRadios" + idtextareaR)
                                        .attr("id", "option1" + idtextareaR).attr("value", "option1").attr("checked", "true")
                                    label1.append("p").text("Respuesta parcial")
                                    var labelbox2 = tipobox.append("div")
                                        .attr("class", "radio dis_Inline")
                                    var label2 = labelbox2.append("label")
                                    label2.append("input").attr("type", "radio").attr("name", "optionsRadios" + idtextareaR)
                                        .attr("id", "option2" + idtextareaR).attr("value", "option2")
                                    label2.append("p").text("Respuesta final")

                                    var div_btn_contenedor = div_col5.append("div")
                                    var div_btn = div_btn_contenedor.append("div")
                                        .attr("class", "btnRespuesta btn btn-default")
                                        .attr("id", "btnRespuesta" + data.itemcomentario[cont].idComentario)
                                        .attr("role", "button")
                                        .attr("idcoment", data.itemcomentario[cont].idComentario)
                                        .attr("idproyecto", data.itemcomentario[cont].idProyecto)
                                        .attr("idusuario", data.itemcomentario[cont].idUsuario)
                                        .attr("idasociacion", data.itemcomentario[cont].idAsociacion)
                                        .attr("idprograma", data.itemcomentario[cont].idPrograma)
                                        .attr("codigoContrato", data.itemcomentario[cont].codigoContrato)

                                    div_btn.append("i")
                                        .attr("class", "material-icons md-18")
                                    div_btn.append("p")
                                        .text("Publicar Respuesta")
                                }
                            }

                            configuraBtns(data.itemcomentario[cont].idComentario);
                        }

                        dibujarPagNumeradasComent(pagina, totalComentAprob, totalPag);

                    } else {
                        $("#divPaginacionComent").html("");
                        $("#divPaginacionComent").hide();
                        $("#divMensaje2").show();
                        $("#divDetComent").show();

                    }

                    //if ($('#divComentarios').data('mask'))
                    //    $('#divComentarios').data('mask').fadeOut(function () {
                    //        $(this).remove();

                    //    });

                        }
                });
        }

        function CambiaTipologiaComentario(idcomentario, tipologia) {
            var params_comen = {
                idComentario: idcomentario,
                idTipologiaStr: tipologia
            };
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/ActualizarTipologiaComent",
                cache: false,
                data: JSON.stringify(params_comen),
                success: function (result) {
                    if (result.status == true) {
                        bootbox.alert({
                            message: 'Registro actualizado',
                            buttons: {
                                ok: {
                                    label: 'Aceptar'
                                }
                            },
                            callback: function () {
                                $('#topoModal').modal('hide');
                            }
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
        }


//Comunes

//validación de correo electrónico
function validaEmail(cadena) {
    if (cadena.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
        return true;
    } else {
        return false;
    }
}

function validaEnteroMayorCero(cadena) {
    if (cadena.match(/^[1-9]+[0-9]*$/)) {
        return true;
    } else {
        return false;
    }
}



