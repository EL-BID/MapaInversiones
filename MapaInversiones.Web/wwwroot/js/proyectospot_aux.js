var anyo_actual = (new Date).getFullYear();
var projectPerfil = JSON.parse(document.body.getAttribute('data-profile'));
InicializaDatosProyectos();
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


function InicializaDatosProyectos() {
    // inicio participacion
	//usuario en session
	iniUsuarioLog();
	//add funciones login
	$("#txtEmailLog").val("");
	$("#txtClaveLog").val("");
	$("#divCloseSesion").hide();

    //$("#btnNuevaCuenta").click(function () {
    //    $("#divUsuarioLog").slideUp(100, function () {
    //        $("#divCuentaNueva").slideDown(function () {
    //            limpiarCamposUsuario("login");
    //        });
    //    });
    //});

    $("#btnAddCuentaUsu").click(function () {
        AddNuevaCuentaUsuario();
    });

    //$("#btnIngresarUsuLog").click(function () {
    //    //validaLoginUsu();
    //    validaLoginGAB();
    //});



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
        //validar sesion
        const token = localStorage.getItem('access_token');
        if (!isTokenValid(token)) {
            alert("Sesión Finalizada por Tiempo");
            cerrarSesion();
            $("#divNomUsuarioLog").text("");
            $("#hdNomUsuario").val("");
            $("#hdIdUsuario").val("");
            $("#divUsuarioLog").slideDown(100, function () {
                $("#divCloseSesion").show();
                $("#divPregParticipacion").attr("class", "objHidden");
                //location.reload();
            });
            return;
        }
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
            var id_proyecto = projectPerfil[0].id_project;

            if (id_tipo == "" || id_tipo == undefined) {
                formularioOK = false;
                bootbox.alert("Seleccione un tipo de comentario");
            }
            else if (id_departamento == "" || id_departamento == undefined) {
                formularioOK = false;
                bootbox.alert("Seleccione una entidad territorial");
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
                    IdProyecto: id_proyecto,
                    ComentarioOriginal: text_coment,
                    Anonimo: ch_anonimo,
                    IdEstado: 1,
                    IdAsociacion: 1,
                    IdTipoRespuesta: 1,
                    ComentarioRelacionado: null,
                    UsuarioComenta: 0
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
                                    if (projectPerfil[0].id_project != undefined) {
                                        GetComentarios(projectPerfil[0].id_project);
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



    configurarEnlaceLocation();
    $("#btnSubirFoto_AUX").on("click", function () {
            if ($("#hdIdUsuario").val() != "") {
                $("#btnSubirFoto").trigger("click");

        } else {

            bootbox.confirm({
                message: "Acción válida para usuarios registrados",
                buttons: {
                    confirm: {
                        label: 'Ingresar',
                        className: 'btn btn-primary active'
                    },
                    cancel: {
                        label: 'Cancelar',
                        className: 'objHidden'
                    }
                },
                callback: function (result) {
                    if (result == true) {
                        document.location.href = "#s5";
                        setTimeout(function () {
                            $('#txtEmailLog').focus();
                        }, 10);
                    }



                }
            });
        }

    });

    if (projectPerfil[0].id_project != undefined) {
        GetComentarios(projectPerfil[0].id_project);
    }

    $("#btnSigVerifica").click(function () {
        var url = "/PerfilProyecto/" + projectPerfil[0].id_project + "#s5";
        window.location.href = url;

    });

    // fin participacion ciudadana

    loadProyectosPry($("#hdIdProyecto").val());

    $(".enlace-proyecto text-small").click(function () {
        var idproyecto = $(this).attr('data-parameter');
        document.cookie = "idproyecto=" + idproyecto + ";path=/;";
        var url = "/PerfilProyecto/" + idproyecto;
        window.open(url, '_blank');

    });

}

function loadProyectosPry(IdProyecto) {
  
    var filtros = {
        idproyectopot: IdProyecto
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "../api/serviciosproyectospot/listadoProyectosInversion",
        cache: false,
        data: filtros,
        success: function (data) {

            var items_result = data;
            var select = "";

            for (var i = items_result.length - 1; i >= 0; i--) {


               select = select                 
                +'<div class="card d-flex cardborder">                                                                                '
                    + '    <div class="headEnt">                                                                                           '
                    + '        <div class="data1 mainDataEntidad2">                                                                        '
                    + '            <span class="labelTit">Código BPIN: ' + items_result[i].codigoSnip+'</span>                                                                 '
                   + '            <span class="td1">' + items_result[i].nombreProyecto.toString() +'</span>                                                                        '
                    + '        </div>                                                                                                      '
                    + '        <div class="data1">                                                                                         '
                    + '            <span class="labelTit">Sector</span>                                                               '
                   + '            <span class="td1">' + items_result[i].nombreSector.toString() +'</span>                                                                  '
                    + '        </div>                                                                                                      '
                    + '        <div class="data1">                                                                                         '
                    + '            <span class="labelTit">Entidad</span>                                                               '
                   + '            <span class="td1">' + items_result[i].entidadEjecutora.toString() +'</span>                                                                   '
                    + '        </div>                                                                                                      '
                    + '    </div>                                                                                                          '
                    + '    <div class="btn-action">                                                                                        '
                    + '        <div class="btnPerfil">                                                                                     '
                   + '            <a class="enlace-proyecto text-small"  data-parameter="' + items_result[i].idProyecto.toString() + '" target="_blank" href="/PerfilProyecto/' + items_result[i].idProyecto.toString() +'" ><i class="material-icons md-18">arrow_forward</i><br /><span>Ver perfil</span></a>'
                    + '                                                                                                                    '
                    + '        </div>                                                                                                      '
                    + '    </div>                                                                                                          '
                    + '</div>                                                                                                              ';
            }

            $("#listproyectos").html(select);

        },
        error: function (response) {
            alert(response.responseText);
        },
        failure: function (response) {
            alert(response.responseText);
        }
    });

}


function GetActoresByCat(idCat) {
    $("#listActPerGrupo").empty();
    var data_filter = $.grep(actoresGlobal, function (element, index) {
        return element.idCategoria == idCat;
    });
    var str_cad = '<ul class="listDetail" id="lstDetActores">';
    for (var i = 0; i < data_filter.length; i++) {
        str_cad += '<li class="data-list">';
        str_cad += '<span class="text-desc">' + data_filter[i].nomActor + '</span>';
        str_cad += '</li>';
    }
    str_cad += '</ul>';
    $("#listActPerGrupo").html(str_cad);


}

function configuraFiltro_Periodos() {
    if ($("#filtro_periodo").length > 0) {
        $('#filtro_periodo').on('change', function () {
            var val_Sel = $(this).val();
            $(this).attr("class", "selected");
            if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                var id_proyecto = projectPerfil[0].id_project;
                GetFuentesByPeriodo(id_proyecto, val_Sel);

            } else {
                //opcion vacia
                $("#divDetFuentes").children().remove();
            }
        });

       
    }
}

function configuraFiltro_Componentes() {
    if ($("#filtro_Componente").length > 0) {
        $('#filtro_Componente').on('change', function () {
            var val_Sel = $(this).val();
            $(this).attr("class", "selected");
            if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                var id_proyecto = projectPerfil[0].id_project;
                GetActividadesByComponente(id_proyecto, val_Sel);
            } else {
                //opcion vacia
                $("#divDetActividades").children().remove();
                $("#divDetActividades").hide();
            }

        });
    }
}


function separar_milesv2(num, decimales = 2, separadorMiles = '.', separadorDecimales = ',') {
    if (isNaN(num) || num === null || num === undefined) return "";

    try {
        let num_aux = parseFloat(num).toFixed(decimales); // Redondear a los decimales especificados
        let partes = num_aux.split("."); // Separar parte entera y decimal

        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles); // Agregar separador de miles

        return partes.join(separadorDecimales); // Unir con separador de decimales especificado
    } catch (error) {
        console.error("function separar_miles: ", error);
        return "";
    }
}

function convertirMillones(num) {
    return num > 999999 ? (num / 1000000).toFixed(0) : num

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



function iniUsuarioLog() {
    $("#hdIdUsuario").val(projectPerfil[0].idUsuParticipa);
    $("#hdNomUsuario").val(projectPerfil[0].nomUsuParticipa);
    if ($("#hdIdUsuario").val() != "") {

        $("#divUsuarioLog").slideUp(100, function () {
            //$("#divNomUsuarioLog").text("Hi, " + $("#hdNomUsuario").val());
            $("#divCloseSesion").show();
            $("#divPregParticipacion").css("visibility", "visible");
            $("#divPregParticipacion").attr("class", "objVisible");
        });

    }
}


function GetComentarios(id) {
    if ($("#content-2").length > 0) {
        $("#content-2").remove();
    }
    var param = "IdProyecto=" + id;
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

                    const d = new Date(items_result[i].fechaCreacion);
                    const fecha_aux = new Intl.DateTimeFormat('es-ES').format(d);
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
                            .attr("src", "/img/PCM_profile.jpg")
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
                            IdProyRel: projectPerfil[0].id_project
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

function configurarEnlaceLocation() {

    $('.enlace_ficha').each(function (i, e) {
        $(e).bind('click', function () {
            var enlace_url = "../../Location/";
            var location_id = $(this).attr("location_id");
            document.cookie = "location_id=" + location_id + ";path=/;";
            var tipo = $(this).attr("tipo");
            var tipo_aux = tipo;
            if (tipo.toUpperCase() == "REGION" || tipo.toUpperCase() == "DEPARTAMENTO") {
                tipo_aux = "region";
            }
            else if (tipo.toUpperCase() == "COUNTY" || tipo.toUpperCase() == "MUNICIPIO") {
                tipo_aux = "county";
            }

            enlace_url += "?" + "type=" + tipo_aux + "&id=" + location_id


            //-----------------------------------
            $(this).attr('href', enlace_url);

        });
    })
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

function validaLoginGAB() {
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
                hash_clave: $("#txtClaveLog").val()
            };
            //add nuevo registro
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/loginGAB",
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

function guardarMeGusta(mg, tipoFoto, id) {
    //valida campos obligatorios
    var megusta = false;
    var nomegusta = false;
    var idFoto = '';
    var idFotoUsuario = '';
    if (mg == 'M') { megusta = true }
    else if (mg == 'N') { nomegusta = true }
    else { bootbox.alert("Error"); }
    if (tipoFoto == 'P') { idFoto = id; }
    else if (tipoFoto == 'U') { idFotoUsuario = id; }
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
            var params_mg = {
                IdUsuario: $("#hdIdUsuario").val(),
                IdFoto: idFoto,
                IdFotoUsuario: idFotoUsuario,
                Megusta: megusta,
                NoMegusta: nomegusta,
                IdProyecto: projectPerfil[0].id_project,

            };
            //add nuevo registro
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/api/ServiciosParticipacion/GuardaMeGusta",
                cache: false,
                data: JSON.stringify(params_mg),
                success: function (result) {
                    if (result.status == true) {
                        //ya no me gusta
                        bootbox.alert("Su opinión ha sido guardada", function () {
                            if (projectPerfil[0].id_project != undefined) {

                            }
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

            bootbox.confirm({
                message: "Acción válida sólo para usuarios registrados",
                buttons: {
                    confirm: {
                        label: 'Ingresar',
                        className: 'btn btn-primary active'
                    },
                    cancel: {
                        label: 'Cancelar',
                        className: 'objHidden'
                    }
                },
                callback: function (result) {
                    if (result == true) {
                        document.location.href = "#s5";
                        setTimeout(function () {
                            $('#txtEmailLog').focus();
                        }, 10);
                    }

                }
            });
        }
    }
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

        getProcesosContratacion($("#top_origen_informacion option:selected").val(), pagina_actual, cant_contratos, projectPerfil[0].id_project, $("#proceso").val());
    });

}



