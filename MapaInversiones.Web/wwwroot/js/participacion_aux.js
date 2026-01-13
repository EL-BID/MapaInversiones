var PerfilUsuario = JSON.parse(document.body.getAttribute('data-profile'));

InicializaDatos();

function InicializaDatos() {
    //usuario en session
    iniUsuarioLog();
    //add funciones login
    $("#txtEmailLog").val("");
    $("#txtClaveLog").val("");
    $("#divCloseSesion").hide();


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
        if (validaEmail(correo_usu)) {

            var params_usu = { "email": correo_usu };
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/ValidaEmail",
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




    });

    $("#btnVerificaCodigoClave").click(function () {
        var params_usu = { "email": $("#txtEmailVerifica").val(), "cod_verifica": $("#txtCodigoVerifica").val() };
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/api/ServiciosParticipacion/ValidaCodigo",
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
                    if (result.message == null || result.message == undefined) {
                        bootbox.alert("Error: " + "Fallo la verificación", function () {

                        });
                    } else {
                        bootbox.alert("Error: " + result.message, function () {

                        });
                    }

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
                    bootbox.alert("Formato de clave incorrecto: La clave debe tener al menos 8 carácteres, entre ellos, una letra mayúscula y un número");
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
                            url: "/api/ServiciosParticipacion/updClaveUsuario",
                            cache: false,
                            data: JSON.stringify(params_usu),
                            success: function (result) {
                                if (result.status == true) {
                                    bootbox.alert("Nuevo password almacenado", function () {
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
                        bootbox.alert("Codigo no verificado");
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
                bootbox.alert("Campos requeridos");
            }
        } else {
            var formularioOK = true;
            var camposReq = "";
            $(".alert-danger").hide();
            var id_usuario = $("#hdIdUsuario").val();
            var id_departamento = $('#filtro_AreaInfluencia option:selected').attr("id_depa");
            var id_tipo = $("#filtro_TipoCometario option:selected").attr("id_tipo");
            var text_coment = $("#txtcomentario").val();
            var ch_anonimo = $("#anonimo").prop('checked');
  //          var id_proyecto = projectPerfil[0].id_project;
            var CodigoContrato = $("#contrato").val();

            if (id_tipo == "" || id_tipo == undefined) {
                formularioOK = false;
                bootbox.alert("Seleccione un tipo de comentario");
            }
            else if (text_coment == "") {
                formularioOK = false;
                bootbox.alert("Ingresar un comentario");
            }

            if (formularioOK == true) {
                var params_com = {
                    IdUsuario: id_usuario,
                    id_departamento: id_departamento,
                    id_municipio: null,
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
                    url: "/api/ServiciosParticipacion/insComentario",
                    cache: false,
                    data: JSON.stringify(params_com),
                    success: function (result) {
                        if (result.status == true) {
                            //COMENTARIOS GUARDADOS EXITOSAMENTE
                            $("#divPregParticipacion").slideUp(100, function () {
                                $("#divCloseSesion").show();
                                var nom_usu = $("#hdNomUsuario").val();
                                $("#txtMsgConfirmaEnvio").text("Gracias " + nom_usu);
                                $("#divConfirmaEnvio").slideDown(function () {
                                    if ($("#contrato").val() != undefined) {
                                        GetComentarios($("#contrato").val());
                                    }
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
            }
        }
        $("#btnGuardarComent").show();

    });
    $(".btnMegusta").click(function () {
        var tipoFoto = ($(this).attr('tipofoto'));
        var idFoto = ($(this).attr('idfoto'));
        guardarMeGusta('M', tipoFoto, idFoto);
    });

    $(".btnNoMegusta").click(function () {
        var tipoFoto = ($(this).attr('tipofoto'));
        var idFoto = ($(this).attr('idfoto'));
        guardarMeGusta('N', tipoFoto, idFoto);
    });

    $("#enlace_cierre").click(function () {
        cerrarSesionUsu();
    });

    if ($("#contrato").val() != undefined) {
        GetComentarios($("#contrato").val());
    }

}

function iniUsuarioLog() {
    $("#hdIdUsuario").val(PerfilUsuario[0].idUsuParticipa);
    $("#hdNomUsuario").val(PerfilUsuario[0].nomUsuParticipa);
    if ($("#hdIdUsuario").val() != "") {
        //$("#divFotoUsuario").css("visibility","visible");
        $("#divUsuarioLog").slideUp(100, function () {
            $("#divNomUsuarioLog").text("Hi, " + $("#hdNomUsuario").val());
            $("#divCloseSesion").show();
            $("#divPregParticipacion").css("visibility", "visible");
            $("#divPregParticipacion").attr("class", "objVisible");
        });

    } else {
        //$("#divFotoUsuario").css("visibility", "collapse");
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
                bootbox.alert("Formato de clave incorrecto: La clave debe tener al menos 8 carácteres, entre ellos, una letra mayúscula y un número");
            } else {
                //validarCorreo
                if (validaEmail($('#txtEmail').val())) {
                    //validar edad
                    if (validaEnteroMayorCero($("#txtEdad").val())) {
                        var params_usu = {
                            Nombre: $("#txtNombre").val(),
                            email: $("#txtEmail").val(),
                            hash_clave: $("#txtPassword").val(),
                            Edad: $("#txtEdad").val(),
                            IdGenero: $("#filtro_Genero option:selected").attr("id_gen"),
                            IdRol: $("#filtro_Rol option:selected").attr("id_rol"),
                            IdMedio: $("#filtro_Medios option:selected").attr("id_medio"),
                            CodigoContrato: $("#contrato").val()
                        };
                        //add nuevo registro
                        $.ajax({
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            url: "/api/ServiciosParticipacion/AddUsuarios",
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

function validaClaveUsu(cadena) {
    //que tenga mayusculas, numeros,de 8 digitos al menos
    var clave = new RegExp(/^(?=(?:.*\d){1})(?=(?:.*[A-Z]){1})\S{8,}$/);
    valida = clave.test(cadena);
    return valida;
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
        if (validaEmail($('#txtEmailLog').val())) {
            var params_usu = {
                email: $("#txtEmailLog").val(),
                hash_clave: $("#txtClaveLog").val(),
                valida_rol: 'n'
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
                        $("#divNomUsuarioLog").text("Hola, " + result.usuarios.nombre);
                        $("#hdNomUsuario").val(result.usuarios.nombre);
                        $("#hdIdUsuario").val(result.usuarios.idUsuario);
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


function GetComentarios(id) {
    if ($("#content-2").length > 0) {
        $("#content-2").remove();
    }
    var param = "CodigoContrato=" + id;
    $.ajax({
        url: "/api/ServiciosParticipacion/GetComentarios",
        type: "GET",
        data: param,

    }).done(function (result) {
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

                id_padre = items_result[i].comentarioRelacionado;
                if ($("#content-2").length > 0) {

                    var d = new Date(items_result[i].fechaCreacion);
                    var fecha_aux = pad(d.getDate(), 2) + "/" + pad(parseInt((d.getMonth()) + 1), 2) + "/" + d.getFullYear();
                    var nombre = "";
                    if (items_result[i].anonimo == false) {
                        nombre = items_result[i].nom_usuario.toString();
                    }
                    else {
                        nombre = " Anónimo";
                    }
                    if (id_padre == null) {
                        cont_resp = cont_resp + 1;
                        var div_commenta = d3.select("#content-2")
                        var div_comment = div_commenta.append("div")
                            .attr("class", "Comment")
                        var dividcomm = "divPadre" + items_result[i].idComentario;
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
                            .append("text").text(" " + items_result[i].comentarioOriginal.toString())
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
                            .attr("src", "/content/img/PCM_profile.jpg")
                        var usr_poster = div_gov.append("div")
                            .attr("class", "Post_user")
                        var usr_txt = usr_poster.append("div")
                            .attr("class", "Post_txt")
                            .append("text").text(" " + items_result[i].comentarioOriginal.toString())
                        var usr_date = usr_poster.append("div")
                            .attr("class", "Post_date")
                            .append("text").text("Fecha de Publicación: " + fecha_aux)
                    }


                }

            }
        }
        $("#txtNumComentarios").text("(" + cont_resp + ") ");

    });

}
