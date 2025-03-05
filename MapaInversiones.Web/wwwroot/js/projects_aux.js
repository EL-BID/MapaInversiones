var anyo_actual = (new Date).getFullYear();
var projectPerfil = JSON.parse(document.body.getAttribute('data-profile'));
var avance_financiero = (parseFloat(projectPerfil[0].avance_financiero.replace(",", ".")) *100).toFixed(2);
var cant_contratos = 5;
var scrol = 0;

var proyectos_eje = JSON.parse(document.body.getAttribute('data-proyectoProjectData'));

InicializaDatosProyectos();

//    graficarAvance("divGraphAvanceFinanciero", avance_financiero);
    //

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
	//usuario en session
	iniUsuarioLog();
	//add funciones login
	$("#txtEmailLog").val("");
	$("#txtClaveLog").val("");
	$("#divCloseSesion").hide();

    configuraFiltro_Periodos();
    configuraFiltro_Componentes();

    if ($("#filtro_periodo") != null) {
        if ($("filtro_periodo").children() != null) {
            $('#filtro_periodo').val("");
            $('#filtro_periodo option:eq(0)').prop('selected', true);
            var val_Sel = $('#filtro_periodo option:eq(0)').val();
            if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                var id_proyecto = projectPerfil[0].id_project;
                GetFuentesByPeriodo(id_proyecto, val_Sel);
            }
        }
        
    }
    
    if ($("#filtro_Componente") != null) {
        if ($("filtro_Componente").children() != null) {
            var val_Sel = $('#filtro_Componente option:eq(0)').val();
            if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                var id_proyecto = projectPerfil[0].id_project;
                GetActividadesByComponente(id_proyecto, val_Sel);
            }
        }

    }

    if ($("#selectGrupActores") != null) {
        if ($("selectGrupActores").children() != null) {
            $('#selectGrupActores').val("");
            $('#selectGrupActores option:eq(0)').prop('selected', true);
            var val_Sel = $('#selectGrupActores option:eq(0)').val();
            if ($.trim(val_Sel) != "" && val_Sel != undefined) {
                GetActoresByCat(val_Sel);
            }
        }

    }

    getAnnio(projectPerfil[0].id_project);

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
    $("#btnSubirFoto_AUX").click(function () {
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
        var url = "/projectprofile/" + projectPerfil[0].id_project + "#s5";
        window.location.href = url;

    });


    loadProyectosEjecucion(proyectos_eje);
}

function loadProyectosEjecucion(resultados) {
    var limite = 60;
    $("#divNoEncontradoEjec").hide();
    $("#divNoExistenEjec").hide();
    if (resultados.length > 0) {
        for (var i = 0; i < resultados.length; i++) {
            var valor_aux = parseFloat(resultados[i].approvedTotalMoney);
            var nombre_aux = resultados[i].NombreProyecto.toString();
            if (nombre_aux.length > limite) {
                nombre_aux = nombre_aux.substr(0, limite) + "...";
            }

            var div_proy = d3.select("#divContenedorFichas")
            var div_ficha = div_proy.append("div")
            div_ficha.attr("class", "project-col project-col-carusel")
            var div_card = div_ficha.append("div").attr("class", "project-card")
            var div_borde = div_card.append("div").attr("class", "card h-100 shadow border-0")
            div_borde.append("div").attr("class", "img-card").attr("style", "background: url('/img/default_SM.jpg')")
            div_borde.append("div").attr("class", "labelCategory").text(resultados[i].NombreSector)
            var div_caption = div_borde.append("div").attr("class", "caption")
            var div_enlace = div_caption.append("a").attr("href", "../../perfilProyecto/" + resultados[i].IdProyecto).attr("target", "_blank");
            //var div_enlace = div_caption.append("a").attr("target", "_blank")
            div_enlace.append("h3").text(nombre_aux)
            if (resultados[i].approvedTotalMoney > 1000000) {
                div_enlace.append("div").attr("class", "amount").append("span").attr("class", "bigNumber").text('$ ' + separar_milesv2(valor_aux / 1000000, 2, '.', ',').toString() + ' Millones');
            } else {
                div_enlace.append("div").attr("class", "amount").append("span").attr("class", "bigNumber").text('$ ' + separar_milesv2(valor_aux / 1, 2, '.', ',').toString() + ' Millones');

            }

            div_card.append("div").attr("class", "clearfix")
            var div_porcentaje = div_card.append("div").attr("class", "percentage")
            div_porcentaje.append("div").attr("class", "completed").attr("style", "width:" + resultados[i].porcentajeGastado + "%")
            var div_indicador = div_porcentaje.append("div").attr("class", "indicatorValues")
            div_indicador.append("span").attr("class", "startPoint").html(resultados[i].MesInicioProyecto + "<br/>" + resultados[i].AnioInicioProyecto)
            div_indicador.append("span").attr("class", "endPoint").html(resultados[i].MesFinProyecto + "<br/>" + resultados[i].AnioFinProyecto)
            div_indicador.append("span").attr("class", "middlePoint text-center").html(resultados[i].porcentajeGastado + " %" + "<br/>" + "gastado")
            div_card.append("div").attr("class", "clearfix")

            var div_detalles = div_card.append("div").attr("class", "row detailedLinks")

            var div_photo = div_detalles.append("div").attr("class", "col-6")
            var enlace_photo = div_photo.append("a").attr("href", "../projectprofile/" + resultados[i].IdProyecto)
            enlace_photo.append("span").attr("class", "material-icons").text("photo_library")
            enlace_photo.append("span").attr("class", "text-ic").text("(" + resultados[i].cantidadFotos + ")")

            var div_question = div_detalles.append("div").attr("class", "col-6")
            var enlace_question = div_question.append("a").attr("href", "../projectprofile/" + resultados[i].IdProyecto)
            enlace_question.append("span").attr("class", "material-icons").text("question_answer")
            enlace_question.append("span").attr("class", "text-ic").text("(" + resultados[i].Comentarios + ")")

        }
    }
    else {
        //no existen proyectos en ejecucion
        $("#divNoExistenEjec").show();

    }


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

function graficarAvance(divContenedor,value) {
    new d3plus.BarChart()
        .select("#" + divContenedor)
        .config({
            backgroundConfig: {
                "strokeWidth": 1,
                "stroke": "#e25126",
                "fill": "transparent",
            },
            font:{ "family": "inherit", "size": 14 },
            data: [ 
                
                {
                    id: 'proy',
                    x: 1,
                    y: value
                }
            ],
            height: 170,
            title: "",
            titleConfig: {
                "ariaHidden": true,
                "fontSize": 22,
                "padding": 10,
                "resize": false,
                "weight":600,
                "textAnchor": "middle"
            },
            colorScale: 'id',
            colorScaleConfig: {
                color: [
                    '#e25126',
                ]
            },
            discrete: 'y',
            groupBy: 'id',
            stacked: true,
            tooltip: false,
             label: d => `${(d['y'])}%`,

             x: 'y',
            xConfig: {
                title: false,
                tickFormat: d => `${d}%`,
                ticks: [],
                labels: [0, 20, 40, 60, 80, 100],
                color: "#666",
                grid: false
             },
             xDomain: [
                0,
                100
            ],
            y: 'x',
            yConfig: {
                tickFormat: d => `${d}%`,

                title: false,
                ticks: []
              }
            }
        )
        .legend(false)
        .render();
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

function GetActividadesByComponente(id_proyecto, id_componente) {

    $("#divDetActividades").empty();
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "../api/serviciosproyectos/GetActividadesComponentes",
        type: "GET",
        data: {
            IdProyecto: id_proyecto,
            codComponente: id_componente
        }

    }).done(function (data) {

        console.log("data", data);
        var items_result = data.componentes;
        if (items_result.length > 0) {
            for (var i = 0; i < items_result.length; i++) {
                //add options
                var divLista = d3.select("#divDetActividades").append("div")
                    .attr("class", "list-item")
                divLista.append("span")
                    .attr("class", "badge")
                    .text(items_result[i].codigo.toString())
                divLista.append("span")
                    .text(" " + items_result[i].nombre.toString())
                $("#divDetActividades").show();
            }
        } else {

            $("#divDetActividades").empty();
            $("#divDetActividades").hide();

        }



    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });






    
}



function GetFuentesByPeriodo(id_proyecto, id_periodo) {
    var colores = ["#1a237e", "#283593", "#3949ab", "#5c6bc0", "#7986cb", "#64b5f6", "#5864dd"];
    var param = "IdProyecto=" + id_proyecto + "&IdPeriodo=" + id_periodo;
    $("#divDetFuentes").children().remove();
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: "../api/serviciosproyectos/GetFuentesPeriodo",
        type: "GET",
        data: {
            IdProyecto: id_proyecto,
            IdPeriodo:id_periodo
        }

    }).done(function (data) {
        var items_result = data.fuentesFinanciacion;
        if (items_result.length > 0) {
            for (var i = 0; i < items_result.length; i++) {
                var val_presupuestado = parseFloat(items_result[i].valorPresupuesto);
                var val_ejecutado = parseFloat(items_result[i].valorEjecutado);
                var cad_presupuestado = "";
                var cad_ejecutado = "";

                if (val_presupuestado > 999999) {
                    cad_presupuestado = (val_presupuestado / 1000000).formatMoney(1, ',', '.').toString();
                    cad_presupuestado += " Millones";
                } else {
                    cad_presupuestado = (val_presupuestado).formatMoney(1, ',', '.').toString();
                }
                if (val_ejecutado > 999999) {
                    cad_ejecutado = (val_ejecutado / 1000000).formatMoney(1, ',', '.').toString();
                    cad_ejecutado += " Millones";
                } else {
                    cad_ejecutado = (val_ejecutado).formatMoney(1, ',', '.').toString();
                }

                var residuo_aux = i % colores.length;
                var color = colores[residuo_aux];
                //add options
                var nom_div = "graf_fuente_" + i.toString();
                var titulo_aux = "Avance";
                var div_fuente = d3.select("#divDetFuentes").append("div")
                    .attr("id", "fuente_" + i.toString())
                    .attr("class", "stageBox")
                div_fuente.append("h5").text(items_result[i].nombre)
                var div_aux = div_fuente.append("div")
                    .attr("class", "dataGraph clearfix")
                //.attr("style", "width:650px;height:auto;")
                div_aux.append("span")
                    .attr("class", "badge pull-left")
                    .text("PRESUPUESTADO: " + "$ " + cad_presupuestado)
                div_aux.append("span")
                    .attr("class", "badge pull-right")
                    .text("EJECUTADO: " + "$ " + cad_ejecutado)
                div_fuente.append("div")
                    .attr("id", nom_div)
                    .attr("class", "boxcolor")
                const x = document.getElementById(nom_div);
                   if (x!=null) {
                       var porcentaje = (parseFloat(items_result[i].porcentaje) / 1).toFixed(2);
                       graficarAvance(nom_div, porcentaje);
                }
            }
        }
    }).fail(function (handleError) {
        // Some function
        console.log(handleError);
    });
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

function getAnnio(IdProyecto) {
    //debugger;
    var filtros = {
        IdProyecto: IdProyecto
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "../api/serviciosproyectos/GetAnniosProcesoContratacion",
        cache: false,
        data: filtros,
        success: function (data) {
            deshabilita(true);

            var items_result = data.detalles;
            if (items_result == null) return;
            var annios = [];
            var select = "";
            var semestre = "";

            $('#top_origen_informacion').attr("data-detalles", JSON.stringify(data.detalles));
            
            for (var i = items_result.length-1; i >= 0; i--) {

                if (!annios.includes(items_result[i].anio.toString())) {
                    annios.push(items_result[i].anio.toString());
                    select = select + '<option value="' + items_result[i].anio.toString() + '">' + items_result[i].anio.toString() + '</option>';
                }

            }
            
            $('#top_origen_informacion').html(select).fadeIn();
            if (items_result.length > 0) {
                //getSemestre(data.detalles);
                getProcesosContratacion($("#top_origen_informacion option:selected").val(), 1, cant_contratos, IdProyecto, $("#proceso").val());
                
            } else {
                $("#srcContratos").html("");
                var fila = '<div class="contractBox" >'
                    + '<div class="cotractName contractONCAE"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
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

function getSemestre(detalles) {

    var items_result = detalles;
    var select = "";
    var semestre = ["Primero", "Segundo"];

    for (var i = 0; i < items_result.length; i++) {

        if (items_result[i].anio.toString() === $("#top_origen_informacion option:selected").val()) {
            select = select + '<option value="' + items_result[i].semestre.toString() + '">' + semestre[items_result[i].semestre*1-1] + '</option>';
        }

    }
    $('#top_origen_semestre').html(select);
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
        $("#top_contratos_periodos").val(0);
        $("#top_contratos_estados").val("");
        $("#entidad").val("");
        $("#proceso").val("");
        deshabilita(true);
        getProcesosContratacion($("#top_origen_informacion option:selected").val(), 1, cant_contratos, projectPerfil[0].id_project, $("#proceso").val());
    }
});

$("#btn-buscar").click(function () {
    if (!disableClick) {
        deshabilita(true);
        getProcesosContratacion($("#top_origen_informacion option:selected").val(), 1, cant_contratos, projectPerfil[0].id_project, $("#proceso").val() );
    }

});

function getProcesosContratacion(annio, pagina, registros,idproyecto, proceso) {

    var filtros = {
        Annio: annio,
        Semestre: null,
        IdProyecto: idproyecto,
        NumeroPagina: pagina,
        RegistrosPorPagina: registros,
        NombreProceso: proceso,
    };
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "../api/serviciosproyectos/ProcesosContratacion",
        cache: false,
        data: filtros,
        success: function (result) {
            if (result.status == true) {
                if (result.cantidadTotalRegistros > 0) {
                    var info = result.data;
                    var proceso = "";
                    var entidad = "";
                    var filaproceso = "";
                    var referencia = "";
                    var data = "";
                    var fila = "";
                    var filaconfirma = "";
                    var inicioLuis = '<div class="contractBox">';
                    var finLuis = '</div>';
                    var inicio = "";
                    var fin = "";
                    $("#srcContratos").html("");
                    for (var i = 0; i < info.length; i++) {
                        if (i > 0 && entidad == info[i].comprador.toString() && proceso != info[i].codigoProceso.toString()) {
                            fila += filaconfirma + '</div>' + referencia + '</div>';
                            filaconfirma = "";

                        }
                        if (entidad != info[i].comprador.toString()) {
                            if (i > 0) //Cambio de entidad
                            {
                                data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;
                                fila = "";
                                filaconfirma = "";
                                filasinfirma = "";
                                inicio = "";
                                fin = "";
                            }
                            if (info[i].origenInformacion.toString().toUpperCase().includes("ONCAE")) { stilo = "contractONCAE" } else { stilo = "contractSEFIN" }
                            inicio = '<div class="cotractName ' + stilo + '"><div class="row"><div class="col-xs-12 col-md-12"><span class="small">Entidad</span><div class="clearfix"></div>'
                                + '                 <span class="h4">' + info[i].comprador.toString() + '</span>'
                                + ' </div></div></div>';
                            entidad = info[i].comprador.toString();
                        }

                        if (proceso != info[i].codigoProceso.toString()) {

                            fila += '<div class="contractNumberRP"><span class="">Código proceso: </span>'
                                + '	<span class="text-bold">' + info[i].codigoProceso.toString() + '</span></div>';
                                
                            if(info[i].descripcionProceso) {
                                    fila += '<div class="contractNumberRP"><span class="">Proceso: </span>';
                                    fila += '	<span class="text-bold">' + info[i].descripcionProceso.toString() + '</span></div>';
                            }
                            fila += '<div class="wrap-head-process">';
                            fila += '<div class="contractData">';

                            fila += ''
                                + '		<div class="row border-b">'
                                + '			<div class="col-xs-12 col-md-4">'
                                + '				<span class="txt_small">Estado del proceso</span>'
                                + '				<span class="amount_adj">';
                            if (info[i].estadoProceso) { fila += info[i].estadoProceso.toString(); }
                            fila += '</span></div>'
                                + '			<div class="col-xs-6 col-md-4"><span class="txt_small">Monto Estimado</span> <span class="amount_adj"> ' + separar_milesv2((info[i].valorPlaneado * 1), 2, '.', ',') + ' </span></div>'
                                + '			    <div class="col-xs-6 col-md-2">'
                                + '				   <span class="txt_small">Moneda</span>'
                                + '				   <span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span>'
                                + '			    </div>'
                                + '			</div>';


                            fila += ''
                                + '		<div class="row border-b">';
                            if (info[i].fechaIncioPublicacionProceso) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Inicio</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaIncioPublicacionProceso.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }
                            if (info[i].fechaInicioRecepcionOfertas) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha de Recepción</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaInicioRecepcionOfertas.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }
                            if (info[i].fechaEstimadaAdjudicacion) {
                                fila += ''
                                    + '			<div class="col-xs-12 col-md-4">'
                                    + '		    <span class="txt_small">Fecha estimada de adjudicación</span>'
                                    + '         <span class="amount_adj">' + info[i].fechaEstimadaAdjudicacion.toString().substr(0, 10) + '</span>'
                                    + '			    </div>';
                            }

                            fila += '	</div>'
                                + '	</div>';

                            fila += '</div>'
                                + '<div class="clearfix"></div>';
                            filaconfirma += ' <div class="related-contracts">'
                                + '     <span class="h4">Contrato(s) u órden(es) de compra:</span>'//Contratos de ' + info[i].origenInformacion + ' asociados a este proceso
                                + '     <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
                            proceso = info[i].codigoProceso.toString();


                            if (info[i].docURL) {
                                referencia = '<div class="row text-center">'
                                    + '<div class="col-xs-12 col-md-12"><a href="' + info[i].docURL.toString() + '" target="_blank" class="btn btn-outlined"><i class="material-icons md-22">launch</i> <span class="txt_small">Conozca mas de este proceso</span></a></div>'
                                    + '</div>';
                            }
                            

                        }


                        filaconfirma += '<div class="panel panel-default">'
                            + '            <div class="panel-heading" role="tab" id="headingOne' + i + '">'
                            + '                <h4 class="panel-title">'
                            + '                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">';

                        if (info[i].codigoContrato) { filaconfirma += '                        Código de contratación:  ' + info[i].codigoContrato.toString() + ''; } else { filaconfirma += '                      Pendiente emisión código contratación  ' }

                        filaconfirma += '     </a>'
                            + '                </h4>'
                            + '            </div>'
                            + '            <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '" aria-expanded="false" style="height: 0px;">'
                            + '                <div class="panel-body">';
                        if (info[i].descripcionContrato) {
                            filaconfirma += '          <div class="row border-b">'
                                + '                        <div class="col-md-12"><span class="small"> CONTRATO U ORDEN DE COMPRA</span><span class="amount_adj">' + info[i].descripcionContrato.toString() + '</span></div>'
                                + '                    </div>';
                        }
                        var moneda = '$';
                        if (info[i].monedaContrato.toString()) {
                            if (info[i].monedaContrato.toString() == 'USD') {
                                moneda = '$';
                            }
                        }
                        filaconfirma += '        <div class="row border-b">'
                            + '                        <div class="col-md-4">'
                            + '                            <span class="small"> RAZÓN SOCIAL<span>'
                            + '                            <a role="button" class="enlace_contratista" data-type="CONTRATISTA" data-parameter="' + info[i].codigoProveedor.toString() + '"><span class="amount_adj"><i class="material-icons md-22">shortcut</i> ' + info[i].contratista.toString() + '</span></a>'
                            + '                        </div>'
                            + '                        <div class="col-md-4"><span class="small"> TIPO DE DOCUMENTO</span><span class="amount_adj">' + info[i].tipoCodigoProveedor.toString() + '</span></div>'
                            + '                        <div class="col-md-4"><span class="small"> NÚMERO DE DOCUMENTO</span><span class="amount_adj">' + info[i].codigoProveedor.toString() + '</span></div>'
                            + '                    </div>'
                            + '                    <div class="row border-b">'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> VALOR CONTRATADO</span><span class="amount_adj"> ' + moneda + ' ' + separar_milesv2((info[i].valorContratado * 1), 2, '.', ',') + '</span></div>'
                            + '                        <div class="col-xs-6 col-md-6"><span class="small"> MONEDA</span><span class="amount_adj"> ' + info[i].monedaContrato.toString() + ' </span></div>'
                            + '                    </div>'
 

                        filaconfirma += '                    <div class="row border-b">';

                        if (info[i].fechaInicioContrato && info[i].fechaInicioContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">FECHA DE INICIO CONTRATO</span>'
                                + '                                                                     <span class="amount_adj">'
                                + info[i].fechaInicioContrato.toString().substr(0, 10)
                                + '                                                                      </span></div>';
                        }
                        if (info[i].fechaFinContrato && info[i].fechaFinContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'FECHA DE FIN CONTRATO'
                                + '</span><span class="amount_adj">'
                                + info[i].fechaFinContrato.toString().substr(0, 10)
                                + '        </span></div>';
                        }

                        if (info[i].fechaInicioEjecucionContrato && info[i].fechaInicioEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de INICIO EJECUCIÓN'
                                + '</span><span class="amount_adj">'
                                + info[i].fechaInicioEjecucionContrato.toString().substr(0, 10)
                                + '        </span></div>';
                        }
                        if (info[i].fechaFinEjecucionContrato && info[i].fechaFinEjecucionContrato.toString().substr(0, 10) !== "1900-01-01") {
                            filaconfirma += '                        <div class="col-xs-6 col-md-3"><span class="small">'
                                + 'Fecha de FIN EJECUCIÓN'
                                + '</span><span class="amount_adj">'
                                + info[i].fechaFinEjecucionContrato.toString().substr(0, 10)
                                + '        </span></div>';
                        }

                        filaconfirma += '                    </div>';

                        if (info[i].ofertaPeriodoDuracion || info[i].fechaPublicacion) {
                            filaconfirma += '                    <div class="row border-b">'
                                + '                        <div class="col-xs-6 col-md-3"><span class="small"> Duración </span><span class="amount_adj">';

                            if (info[i].ofertaPeriodoDuracion) { filaconfirma += info[i].ofertaPeriodoDuracion.toString(); }

                            filaconfirma += '                   Días</span></div>';

                            filaconfirma += '                  <div class="col-xs-6 col-md-3"><span class="small"> Fecha de FIRMA CONTRATO</span><span class="amount_adj">';

                            if (info[i].fechaPublicacion !== null && info[i].fechaPublicacion.toString().substr(0, 10) !== "1900-01-01") {
                                filaconfirma += info[i].fechaPublicacion.toString().substr(0, 10) + '</span></div>';
                            }
                            else {
                                filaconfirma += '</span></div>';
                            }

                            filaconfirma += '                    </div>';

                        }

                        filaconfirma += '                </div>'
                            + '               <div class="panel-footer" style="align:center">';

                        if (info[i].codigoContrato) {
                            filaconfirma += '                    <a href="../../contrato?codcontrato=' + info[i].codigoContrato.toString() + '" class="btn btn-primary btn-participe"><i class="material-icons md-22">add_comment</i> Hacer comentario al contrato</a>';
                        }
                        filaconfirma += '                 </div>'
                            + '            </div>'
                            + '        </div>';
                        //+ '  </div>';
                    }


                    data += inicioLuis + inicio + fila + filaconfirma + '</div></div>' + referencia + finLuis;


                    $("#srcContratos").html(data);
                    if (scrol >= 1) {
                        $('html, body').animate({ scrollTop: $('#srcContratos').offset().top }, 2000);
                    } else { scrol = scrol + 1; }

                    dibujaPaginacionContrato(pagina, result.cantidadTotalRegistros, Math.ceil(result.cantidadTotalRegistros / registros), registros);
                    configuraEnlaceContratista();
                }
                else {
                    $("#divPagContratos").empty();
                    $("#srcContratos").html("");
                    var fila = '<div class="contractBox" >'
                        + '<div class="contractNumberRP"><span class="text-bold NoResultC">No se encuentran resultados con los filtros solicitados</span></div>'
                        + '</div>';
                    $("#srcContratos").html(fila);
                }
            } else {
                alert("Message: " + result.message);
            }
            deshabilita(false);
        },
        error: function (response) {
            deshabilita(false);
            alert(response.responseText);
        },
        failure: function (response) {
            deshabilita(false);
            alert(response.responseText);
        }
    });

}



$("#top_origen_informacion").change(function () {
    var datos = $('#top_origen_informacion').data("detalles");
    getSemestre(datos);

});




function iniUsuarioLog() {
    $("#hdIdUsuario").val(projectPerfil[0].idUsuParticipa);
    $("#hdNomUsuario").val(projectPerfil[0].nomUsuParticipa);
    if ($("#hdIdUsuario").val() != "") {

        $("#divUsuarioLog").slideUp(100, function () {
            $("#divNomUsuarioLog").text("Hi, " + $("#hdNomUsuario").val());
            $("#divCloseSesion").show();
            $("#divPregParticipacion").css("visibility", "visible");
            $("#divPregParticipacion").attr("class", "objVisible");
        });

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