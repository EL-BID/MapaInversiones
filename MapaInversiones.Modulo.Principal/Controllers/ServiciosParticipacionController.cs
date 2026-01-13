using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Project;
using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Drawing.Imaging;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    [Route("api/ServiciosParticipacion")]
    public class ServiciosParticipacionController : Controller
    {
        
        private readonly ILogger<ServiciosParticipacionController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly IHttpContextAccessor _context;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration Configuration;

        public ServiciosParticipacionController(ILogger<ServiciosParticipacionController> logger, TransparenciaDB connection, IHttpContextAccessor context, IWebHostEnvironment hostingEnvironment, IConfiguration configuration)
        {
            _connection = connection;

            _logger = logger;
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            Configuration = configuration;

        }


        [HttpPost("AddUsuarios")]
        [IgnoreAntiforgeryTokenAttribute]
        public object AddUsuarios([FromBody] itemUsuarios params_usu)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            int id_proy = params_usu.IdProyRel;
            int id_prog = params_usu.IdProgRel;
            string contrato = params_usu.CodigoContrato;
            string hash_new = SHA256Encripta(params_usu.hash_clave);
            string outTxt = part.RegistroNuevoUsuario(params_usu.Nombre, params_usu.email, hash_new, params_usu.Edad, params_usu.IdGenero, params_usu.IdRol, params_usu.IdMedio);
            string[] separador = new string[] { "<||>" };
            var result = outTxt.Split(separador, StringSplitOptions.None);

            if (result[0].Equals("0"))
            {
                string id_usuario = result[1];
                string cod_verif = SHA256Encripta(id_usuario);
                //actualiza codigo de verificacion
                string outCod = part.updCodigoVerifica(Convert.ToInt32(id_usuario), cod_verif);
                var result_Cod = outCod.Split(separador, StringSplitOptions.None);
                if (result_Cod[0].Equals("0"))
                {
                    //envio correo para verificacion de la cuenta
                    string mensajeCorreo = ObtHtmlVerificacionCuenta(id_usuario, id_proy, id_prog, contrato);
                    CorreoController instanciaControladorCorreo = new CorreoController(Configuration);
                    ModeloRespuestaCorreo rptaCorreo = instanciaControladorCorreo.EnviarCorreoHtml(params_usu.email, mensajeCorreo, "Verificar Correo MapaInversiones");
                    objReturn.Status = rptaCorreo.Status;
                    objReturn.Message = rptaCorreo.Message;
                }
                else
                {
                    objReturn.Status = false;
                    objReturn.Message = result[1];
                }
            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = result[1];
            }
            return objReturn;
        }


        [HttpGet("GetComentarios")]
        public ModelDataParticipacion ObtenerComentarios()
        {
            //leemos el querystring. lo convertimos a un diccionario.

            ModelDataParticipacion objReturn = new ModelDataParticipacion();

            Dictionary<string, Microsoft.Extensions.Primitives.StringValues> parameters = Request.Query.ToDictionary(x => x.Key, x => x.Value, StringComparer.OrdinalIgnoreCase);
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            if (parameters.Keys.Contains<string>("IdProyecto"))
            {
                if (!string.IsNullOrEmpty(parameters["IdProyecto"]))
                {
                    var itemcomentario = part.ObtenerComentariosProyAsync(Int32.Parse(parameters["IdProyecto"]));
                    objReturn.itemcomentario = itemcomentario;
                    objReturn.Status = true;
                }

            }
            else if (parameters.Keys.Contains<string>("CodigoContrato"))
            {
                if (!string.IsNullOrEmpty(parameters["CodigoContrato"]))
                {
                    var itemcomentario = part.ObtenerComentariosContAsync(parameters["CodigoContrato"]);
                    objReturn.itemcomentario = itemcomentario;
                    objReturn.Status = true;
                }

            }
            else
            {

                objReturn.Status = false;
                objReturn.Message = "Error: Identificación de proyecto nula";
            }

            return objReturn;
        }


        [HttpGet("GetTipologiaComentario")]
        public object GetTipologiaComentario(int idcomentario)
        {
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            objReturn = part.ObtenerTipologiasComentariosAsync(idcomentario);
            objReturn.Status = true;

            return objReturn;
        }

        [HttpGet("GetCometAprobarCant")]
        public object GetCometAprobarCant()
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            List<itemcomentario> source = new List<itemcomentario>();
            var cantComentarios = part.ObtenerComentariosAproCant();
            objReturn.itemcomentario = null;
            objReturn.Status = true;
            objReturn.totalNumber = cantComentarios;
            return objReturn;
        }


        [HttpGet("GetCometAprobar")]
        public object GetCometAprobar(int page, int estado)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            objReturn = part.ObtenerComentariosAproAsync(page, estado);
            objReturn.Status = true;

            return objReturn;
        }


        [HttpPost("ValidaLogin")]
        [IgnoreAntiforgeryTokenAttribute]
        public object ValidaLogin([FromBody] itemUsuarios params_usu)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            string hash_new = SHA256Encripta(params_usu.hash_clave);
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            objReturn.usuarios = part.ValidaLogin(params_usu.email, hash_new, params_usu.valida_rol);
            int validacredencial = 0;
            string[] separador = new string[] { "<||>" };
            if (objReturn.usuarios != null)
            {
                if (objReturn.usuarios.IdUsuario > 0)
                {
                    objReturn.Status = true;
                    HttpContext.Session.SetString("IdUsuario", objReturn.usuarios.IdUsuario.ToString());
                    HttpContext.Session.SetString("NomUsuario", objReturn.usuarios.Nombre);
                }
                else
                {
                    validacredencial = 1;
                }
            }
            else
            {
                validacredencial = 1;
            }
            if (validacredencial == 1)
            {
                objReturn.usuarios = part.validaCreado(params_usu.email, hash_new);
                if (objReturn.usuarios != null)
                {
                    if (objReturn.usuarios.IdUsuario > 0)
                    {
                        //enviar correo nuevamente
                        string id_usuario = objReturn.usuarios.IdUsuario.ToString();
                        string cod_verif = SHA256Encripta(id_usuario);
                        //envio correo para verificacion de la cuenta
                        string mensajeCorreo = ObtHtmlVerificacionCuenta(id_usuario, params_usu.IdProyRel, params_usu.IdProgRel, params_usu.CodigoContrato);
                        CorreoController instanciaControladorCorreo = new CorreoController(Configuration);
                        ModeloRespuestaCorreo rptaCorreo = instanciaControladorCorreo.EnviarCorreoHtml(params_usu.email, mensajeCorreo, "VERIFICACIÓN CUENTA - Participación Ciudadana");
                        objReturn.Status = false;
                        objReturn.Message = "El usuario no ha sido validado, por favor verifique el correo enviado";

                    }
                    else
                    {

                        objReturn.Status = false;
                        objReturn.Message = "Credenciales inválidas";
                    }
                }
                else
                {
                    objReturn.Status = false;
                    objReturn.Message = "Credenciales inválidas";
                }
            }

            return objReturn;

        }

        [HttpPost("ValidaSessionUsu")]
        [IgnoreAntiforgeryTokenAttribute]
        public object ValidaSessionUsu([FromBody] itemUsuarios params_usu)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            objReturn.usuarios = part.ValidaSessionUsu(params_usu.IdUsuario, params_usu.valida_rol);
            if (objReturn.usuarios != null)
            {
                if (objReturn.usuarios.IdUsuario > 0)
                {
                    objReturn.Status = true;
                }
                else
                {
                    objReturn.Status = false;
                    objReturn.Message = "Invalid Credentials";
                }
            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = "Invalid Credentials";
            }
            return objReturn;
        }

        public string obtUrlLocal()
        {
            string urlRedir = "";
            urlRedir = "https://" + _context.HttpContext.Request.Host.Value;
            return urlRedir;
        }
        private string ObtHtmlVerificacionCuenta(string id_usuario, int id_proyecto, int id_programa, string CodigoContrato)
        {
            string url_local = obtUrlLocal();
            string key = "";
            key += SHA256Encripta(id_usuario) + "_p_" + id_proyecto.ToString() + "_p_" + id_programa.ToString() + "_p_" + CodigoContrato;
            //key += SHA256Encripta(id_usuario) + "_p_" + id_proyecto.ToString();
            string path_aux = Path.Combine(_hostingEnvironment.WebRootPath, "content", "img", "logoMIV.png");
            //string path = HttpContext.Current.Server.MapPath(@"../../content/img/logoMIV.png"); // my logo is placed in images folder
            //LinkedResource logo = new LinkedResource(path_aux);
            //logo.ContentId = "companylogo";

            string mensaje = "";
            mensaje += "<html>";
            mensaje += "<head>";
            mensaje += "<title>MapaInversiones República Dominicana- Notificaciones</title>";
            mensaje += "<style>a{color:#0D3B59; text-decoration:underline}";
            mensaje += "h1, h2, h3, h4{ font-weight:normal; color:#2e528d;}";
            mensaje += "</style>";
            mensaje += "</head>";
            mensaje += "<body style=\"background-color:#fff; font-family:'Arial', Helvetica, sans-serif; margin:0; padding:0\">";
            mensaje += "<div style=\"background:#ffffff; width:700px; color:#0D284B; margin:0 auto\">";
            mensaje += "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
            mensaje += "<tbody><tr><td style=\"text-align:center;height:80px; padding-left:15px; border-bottom:3px solid #ccc; \"><a href=\"\" title=\"\"><img src=\"" + url_local + "/content/img/logoMIV.jpg\" title=\"Mapa Inversiones República Dominicana\" width=\"280px\"/></a></td>";
            mensaje += "</tr>";
            mensaje += "<tr><td><div style=\"width:100%; margin:0 auto; text-align:center\">";
            mensaje += "<table width=\"100%\" style=\"text-align:left\">";
            mensaje += "<tr><td colspan=\"2\"><h2 style=\"text-align:center; font-size:40px; font-weight:bold; margin-top:10px; margin-bottom:0px\">Verifica tu Cuenta</h2></td></tr>";
            mensaje += "<tr>";
            mensaje += "<td valign=\"bottom\"><img src=\"" + url_local + "/content/img/icono.jpg\" alt=\"Icono de Notificacion MapaInversiones República Dominicana\" width=\"250px\"/></td>";
            mensaje += "<td style=\"padding-left:25px\">";
            mensaje += "<p>Te has Registrado en MapaInversiones República Dominicana, para participar debes validar tu correo</p>";
            mensaje += "<p style=\"text-align:left; margin:50px auto\"><a href=\"" + url_local + "/VerificaCuenta/" + key + "\" style=\"background-color:#2e528d; color:#fff; padding:15px 25px;\">Verificar Cuenta</a></p>";
            mensaje += "<table style=\"width:100%; text-align:center; border:1px solid #ccc; padding:5px; font-style:italic; font-size:12px\">";
            mensaje += "<tr><td><img src=\"" + url_local + "/content/img/iconoReminder.jpg\" style=\"float:left; margin-bottom:5px; display:block; width:50px\"/></td>";
            mensaje += "<td><p style=\"text-align:left\"> Recuerda, las opiniones publicadas en MapaInversiones República Dominicana pueden ser anónimas </p></td>";
            mensaje += "</tr>";
            mensaje += "</table>";
            mensaje += "</td>";
            mensaje += "</tr>";
            mensaje += "</table>";
            mensaje += "</div></td></tr>";
            mensaje += "<tr><td style=\"text-align:center; padding:40px 0px\">";
            mensaje += "<img src=\"" + url_local + "/content/img/footer.jpg\"/> </td></tr>";
            mensaje += "</tbody></table>";
            mensaje += "</div>";
            mensaje += "<table style=\"width:700px; margin:0 auto; font-size:11px;\"><tr><td style=\"text-align:center\">";
            mensaje += "TODOS LOS DERECHOS RESERVADOS</td></tr></table>";
            mensaje += "</body>";
            mensaje += "</html>";


            return mensaje;

        }


        [HttpPost("insComentario")]
        [IgnoreAntiforgeryTokenAttribute]
        public object insComentario([FromBody] itemcomentario params_com)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            string outTxt = part.GuardarComentario(params_com.IdUsuario, params_com.IdProyecto, params_com.IdAsociacion, params_com.IdTipoComentario, params_com.ComentarioOriginal, params_com.Anonimo, params_com.IdEstado, params_com.ComentarioRelacionado, params_com.id_departamento, params_com.id_municipio, params_com.CodigoContrato, params_com.TipoSubsidio);
            string[] separador = new string[] { "<||>" };
            var idUsuario = HttpContext.Session.GetString("IdUsuario");
            var result = outTxt.Split(separador, StringSplitOptions.None);
            if (result[0].Equals("0"))
            {

                objReturn.Status = true;
                //notificar respuestas al usuario del comentario
                if (params_com.UsuarioComenta != 0)
                {
                    //Actualiza el estado del padre
                    Admin admin = new Admin(_connection);
                    outTxt = admin.ActualizaComent(Convert.ToInt32(params_com.ComentarioRelacionado), Convert.ToInt32(params_com.IdEstadoRelacionado), "");
                    separador = new string[] { "<||>" };
                    result = outTxt.Split(separador, StringSplitOptions.None);

                    if (result[0].Equals("0"))
                    {
                        itemUsuarios infoUsuario = part.ValidaSessionUsu(params_com.UsuarioComenta, "N");
                        if (!string.IsNullOrEmpty(infoUsuario.email))
                        {
                            string mensajeCorreo = ObtHtmlCorreoComent("Notificaciones", "Respuesta a comentario", "Tu opinión tiene una respuesta.", params_com.IdProyecto, 1, null, null, "S", "N");

                            CorreoController instanciaControladorCorreo = new CorreoController(Configuration);
                            ModeloRespuestaCorreo rptaCorreo = instanciaControladorCorreo.EnviarCorreoHtml(infoUsuario.email, mensajeCorreo, "Participación Ciudadana");
                            objReturn.Status = rptaCorreo.Status;
                            objReturn.Message = rptaCorreo.Message;
                        }
                    }
                    else
                    {
                        objReturn.Status = false;
                        objReturn.Message = result[1];
                    }
                }
                else
                {
                    //Notificar administradores sobre nuevo comentario
                    string destinatarios = part.ObtenerCorreosAprobadores();

                    if (!string.IsNullOrEmpty(destinatarios))
                    {
                        string mensajeCorreo = ObtHtmlCorreoComent("Notificaciones", "Nuevo comentario", "Hay un nuevo comentario por aprobar en MapaInversiones.", params_com.IdProyecto, 1, null, null, "N", "S");

                        CorreoController instanciaControladorCorreo = new CorreoController(Configuration);
                        ModeloRespuestaCorreo rptaCorreo = instanciaControladorCorreo.EnviarCorreoHtml(destinatarios, mensajeCorreo, "Participación Ciudadana");
                        objReturn.Status = rptaCorreo.Status;
                        objReturn.Message = rptaCorreo.Message;
                    }
                }
            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = result[1];
            }
            return objReturn;
        }

        private string ObtHtmlCorreoComent(string titulo, string saludo, string txtmensaje, int? idproyecto, int? IdAsociacion, int? IdPrograma, string CodigoContrato, string mensajeanonimo, string urladmin)
        {
            string url_local = obtUrlLocal();
            string urlproyecto = "";
            if (IdAsociacion == 3)
            {
                urlproyecto = url_local + "/contrato?codcontrato=" + CodigoContrato;
            }
            
            else if (IdAsociacion == 1)
            {
                urlproyecto = url_local + "/PerfilProyecto/" + idproyecto;
            }
            string urlaprobar = url_local + "/aprobar/";
            string mensaje = "";
            mensaje += "<html>";
            mensaje += "<head>";
            mensaje += "<title>MapaInversiones República Dominicana - ";
            mensaje += titulo;
            mensaje += "</title>";
            mensaje += "<style>a{color:#0D3B59; text-decoration:underline}";
            mensaje += "h1, h2, h3, h4{ font-weight:normal; color:#2e528d;}";
            mensaje += "</style>";
            mensaje += "</head>";
            mensaje += "<body style=\"background-color:#fff; font-family:'Arial', Helvetica, sans-serif; margin:0; padding:0\">";
            mensaje += "<div style=\"background:#ffffff; width:700px; color:#0D284B; margin:0 auto\">";
            mensaje += "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
            mensaje += "<tbody><tr><td style=\"text-align:center;height:80px; padding-left:15px; border-bottom:1px solid #ccc; \"><a href=\"" + url_local + "\" title=\"\"><img src=\"" + url_local + "/content/img/logoMIV.jpg\" title=\"MapaInversiones República Dominicana\" width=\"280px\"/></a></td>";
            mensaje += "</tr>";
            mensaje += "<tr><td><div style=\"width:100%; margin:0 auto; text-align:center\">";
            mensaje += "<table width=\"100%\" style=\"text-align:left\">";
            mensaje += "<tr><td colspan=\"2\"><h2 style=\"text-align:center; font-size:40px; font-weight:bold; margin-top:40px; margin-bottom:40px\">";
            mensaje += saludo;
            mensaje += "</h2></td></tr>";
            mensaje += "<tr>";
            mensaje += "<td><img src=\"" + url_local + "/content/img/icono2.jpg\" alt=\"Icono de Notificación MapaInversiones República Dominicana\" width=\"250px\"/></td>";
            mensaje += "<td style=\"padding-left:25px\">";
            mensaje += "<p>";
            mensaje += txtmensaje;
            mensaje += "</p>";
            if (urladmin == "S")
            {
                mensaje += "<p> <a href =\"" + urlaprobar + "\" style=\"color:#241588!important\">Ir a aprobar</a></p>";
            }
            if (idproyecto != 0 && idproyecto != null)
            {
                mensaje += "<p> <a href =\"" + urlproyecto + "\" style=\"color:#241588!important\">Ver proyecto</a></p>";
            }
            if (IdPrograma != 0 && IdPrograma != null)
            {
                mensaje += "<p> <a href =\"" + urlproyecto + "\" style=\"color:#241588!important\">Ver programa</a></p>";
            }
            if (CodigoContrato != "" && CodigoContrato != null)
            {
                mensaje += "<p> <a href =\"" + urlproyecto + "\" style=\"color:#241588!important\">Ver Contrato</a></p>";
            }
            if (mensajeanonimo == "S")
            {
                mensaje += "<table style=\"width:100%; margin:15px auto; text-align:center; border:1px solid #ccc; padding:5px; font-style:italic; font-size:12px\">";
                mensaje += "<tr><td><img src=\"" + url_local + "/content/img/iconoReminder.jpg\" style=\"float:left; margin-bottom:15px; display:block; width:50px\"/></td>";
                mensaje += "<td><p style=\"text-align:left\"> Se informa que los comentarios de su participación antes de ser publicados son validados por MapaInversiones República Dominicana. Si desea, su opinión puede ser anónima. </p></td>";
                mensaje += "</tr>";
                mensaje += "</table>";
            }
            mensaje += "</td>";
            mensaje += "</tr>";
            mensaje += "</table>";
            mensaje += "</div></td></tr>";
            mensaje += "<tr><td style=\"text-align:center; \" colspan=\"2\">";
            mensaje += "<img src=\"" + url_local + "/content/img/footer.jpg\"/></td></tr>";
            mensaje += "</tbody></table>";
            mensaje += "</div>";
            mensaje += "<table style=\"width:700px; margin:0 auto; font-size:11px\"><tbody><tr><td style=\"text-align:center\"><br />TODOS LOS DERECHOS RESERVADOS</td></tr></tbody></table>";
            mensaje += "</body>";
            mensaje += "</html>";

            return mensaje;
        }

        [HttpPost("CerrarSession")]
        [IgnoreAntiforgeryTokenAttribute]
        public object CerrarSession()
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();

            objReturn.Status = true;
            HttpContext.Session.SetString("IdUsuario", "");
            HttpContext.Session.SetString("NomUsuario", "");

            objReturn.Message = "Sesión cerrada";
            return objReturn;
        }


        [HttpPost("GuardaMeGusta")]
        [IgnoreAntiforgeryTokenAttribute]
        public object GuardaMeGusta([FromBody] itemMeGusta params_mg)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            string outTxt = part.GuardaMeGusta(params_mg.IdUsuario, params_mg.IdFoto, params_mg.IdFotoUsuario, params_mg.MeGusta, params_mg.NoMeGusta, params_mg.IdProyecto);
            string[] separador = new string[] { "<||>" };
            var idUsuario = HttpContext.Session.GetString("IdUsuario");
            var result = outTxt.Split(separador, StringSplitOptions.None);
            if (result[0].Equals("0"))
            {
                objReturn.Status = true;
            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = result[1];
            }
            return objReturn;
        }

        [HttpPost("ValidaEmail")]
        [IgnoreAntiforgeryTokenAttribute]
        public object ValidaEmail([FromBody] itemUsuarios params_usu)
        {
            string hash_verifica = "";
            string hash_codigo = "";
            string id_usuario = "";
            ModeloRespuestaCorreo objReturn = new ModeloRespuestaCorreo();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            itemUsuarios infoUsuario = new itemUsuarios();
            infoUsuario = part.validaEmail(params_usu.email);

            if (infoUsuario != null)
            {
                //usuario existe y se encuentra activo, 
                id_usuario = infoUsuario.IdUsuario.ToString();
                //hash_verifica = infoUsuario.cod_verifica;
                Random rnd = new Random();
                int cont = rnd.Next(1000, 1000001);
                string cod_aux = SHA256Encripta(cont.ToString());

                string outCod = part.updCodigoVerifica(infoUsuario.IdUsuario, cod_aux);
                string[] separador = new string[] { "<||>" };
                var result = outCod.Split(separador, StringSplitOptions.None);
                if (result[0].Equals("0"))
                {
                    //actualizacion cod realizada
                    hash_verifica = cod_aux;
                    if (!string.IsNullOrEmpty(hash_verifica))
                    {
                        hash_codigo = hash_verifica.Substring(0, 6);
                        //envio correo con codigo verificacion
                        objReturn = notificaCodigoOlvido(hash_codigo, params_usu.email);

                    }
                    else
                    {
                        objReturn.Status = false;
                        objReturn.Message = "Error en consulta: código de verificacion no generado";

                    }
                }
                else
                {
                    objReturn.Status = false;
                    objReturn.Message = "Error en consulta: código de verificacion no generado";

                }

                objReturn.id_usuario = id_usuario;

            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = "No existe un usuario activo para el correo digitado";

            }

            return objReturn;

        }

        private ModeloRespuestaCorreo notificaCodigoOlvido(string codigo_verifica, string email)
        {
            ModeloRespuestaCorreo objReturn = new ModeloRespuestaCorreo();
            string mensaje = "";
            string url_local = obtUrlLocal();
            if (!string.IsNullOrEmpty(email))
            {

                mensaje += "<html>";
                mensaje += "<head>";
                mensaje += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />";
                mensaje += "<title>MapaInversiones República Dominicana - Notificaciones</title>";
                mensaje += "<style>a{color:#0D3B59; text-decoration:underline}";
                mensaje += "h1, h2, h3, h4{ font-weight:normal; color:#2e528d;}";
                mensaje += "</style>";
                mensaje += "</head>";
                mensaje += "<body style=\"background-color:#fff; font-family:'Arial', Helvetica, sans-serif; border-top:2px; margin:0; padding:0\">";
                mensaje += "<div style=\"background:#ffffff; width:700px; color:#0D284B; margin:0 auto\">";
                mensaje += "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
                mensaje += "<tbody><tr><td style=\"text-align:center;height:80px; padding-left:15px; border-bottom:1px solid #ccc; \"><a href=\"" + url_local + "\" title=\"\"><img src=\"" + url_local + "/content/img/logoMIV.jpg\" title=\"Logo MapaInversiones República Dominicana\" width=\"280px\"/></a></td>";
                mensaje += "</tr>";
                mensaje += "<tr><td><div style=\"width:90%; margin:0 auto; text-align:center\">";
                mensaje += "<table width=\"100%\" style=\"text-align:left\">";
                mensaje += "<tbody><tr><td colspan=\"2\"><h2 style=\"text-align:center; font-size:40px; font-weight:bold; margin-bottom:40px; margin-top:40px\">Restablecimiento de Clave</h2></td></tr>";
                mensaje += "<tr>";
                mensaje += "<td valign=\"bottom\"><img src=\"" + url_local + "/content/img/icono3.jpg\" alt=\"Icono de Notificacion MapaInversiones República Dominicana\" width=\"250px\"/></td>";
                mensaje += "<td style=\"padding-left:25px\">";
                mensaje += "<p>MapaInversiones República Dominicana le informa que su solicitud de restablecimiento de clave ha sido iniciada</p>";
                mensaje += "<p>Por favor ingrese el siguiente código en el sitio web para continuar en el proceso</p>";
                mensaje += "<div style=\"background-color:#fff; color:#0D3B59; font-weight:bold; font-size:30px; text-align:center; padding:15px\">" + codigo_verifica + "</div>";
                mensaje += "<p style=\"text-align:center\">Gracias por usar nuestros servicios</p>";
                mensaje += "</td>";
                mensaje += "</tr>";
                mensaje += "</tbody></table>";
                mensaje += "</div></td></tr>";
                mensaje += "<tr><td style=\"text-align:center; padding:40px 0px\">";
                mensaje += "<a href=\"" + url_local + "\"><img src=\"" + url_local + "/content/img/footer.jpg\"/></a> </td></tr>";
                mensaje += "</tbody></table>";
                mensaje += "</div>";
                mensaje += "<table style=\"width:700px; margin:0 auto; font-size:11px\"><tbody><tr><td style=\"text-align:center\">TODOS LOS DERECHOS RESERVADOS</td></tr></tbody></table>";
                mensaje += "</body>";
                mensaje += "</html>";
                CorreoController instanciaControladorCorreo = new CorreoController(Configuration);
                objReturn = instanciaControladorCorreo.EnviarCorreoHtml(email, mensaje, "Código de verificación");
            }
            else
            {
                objReturn.Message = "Email destino inválido";
                objReturn.Status = false;
            }

            return objReturn;

        }

        [HttpPost("ValidaCodigo")]
        [IgnoreAntiforgeryTokenAttribute]
        public object ValidaCodigo([FromBody] itemUsuarios params_usu)
        {
            string hash_verifica = "";
            string hash_codigo = "";
            string id_usuario = "";
            ModeloRespuestaCorreo objReturn = new ModeloRespuestaCorreo();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            itemUsuarios infoUsuario = new itemUsuarios();
            infoUsuario = part.validaEmail(params_usu.email);

            if (infoUsuario != null)
            {
                //usuario existe y se encuentra activo, 
                id_usuario = infoUsuario.IdUsuario.ToString();
                hash_verifica = infoUsuario.cod_verifica;
                hash_codigo = hash_verifica.Substring(0, 6);
                if (hash_codigo.Equals(params_usu.cod_verifica))
                {
                    objReturn.Status = true;
                    objReturn.Message = "";
                    objReturn.id_usuario = id_usuario;
                }


            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = "No existe un usuario activo para el correo digitado";

            }

            return objReturn;

        }


        public string SHA256Encripta(string input)
        {
            SHA256CryptoServiceProvider provider = new SHA256CryptoServiceProvider();

            byte[] inputBytes = System.Text.Encoding.UTF8.GetBytes(input);
            byte[] hashedBytes = provider.ComputeHash(inputBytes);

            StringBuilder output = new StringBuilder();

            for (int i = 0; i < hashedBytes.Length; i++)
                output.Append(hashedBytes[i].ToString("x2").ToLower());

            return output.ToString();
        }

        [HttpPost("updClaveUsuario")]
        [IgnoreAntiforgeryTokenAttribute]
        public object updClaveUsuario([FromBody] itemUsuarios params_usu)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            string hash_new = SHA256Encripta(params_usu.hash_clave);
            string outTxt = part.updClaveUsuario(params_usu.IdUsuario, hash_new);
            string[] separador = new string[] { "<||>" };
            var result = outTxt.Split(separador, StringSplitOptions.None);

            if (result[0].Equals("0"))
            {
                objReturn.Status = true;
                objReturn.Message = "Clave modificada exitosamente";
            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = result[1];
            }

            return objReturn;


        }


        public object NotificaNuevaFoto(int idproyecto)
        {
            //Notificar administradores sobre nueva foto
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            string destinatarios = part.ObtenerCorreosAprobadores();
            if (!string.IsNullOrEmpty(destinatarios))
            {
                string mensajeCorreo = ObtHtmlCorreoComent("Notificaciones", "Nueva Foto", "Hay una nueva foto por aprobar en MapaInversiones.", idproyecto, 1, null, null, "N", "S");
                CorreoController instanciaControladorCorreo = new CorreoController(Configuration);
                ModeloRespuestaCorreo rptaCorreo = instanciaControladorCorreo.EnviarCorreoHtml(destinatarios, mensajeCorreo, "Participación Ciudadana");
                objReturn.Status = rptaCorreo.Status;
                objReturn.Message = rptaCorreo.Message;
            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = "No hay administradores para reportar";
            }
            return objReturn;
        }

        [HttpGet("GuardarAprobado")]
        public object GuardarAprobado(int IdFotoUsuario, string Aprobadopor, bool Aprobado, bool Eliminado, int IdUsuario, int IdProyecto, string textoJustifica )
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            Admin admin = new Admin(_connection);
            string outTxt = admin.ActualizaFoto(IdFotoUsuario, Aprobadopor, Aprobado, Eliminado, textoJustifica);
            string[] separador = new string[] { "<||>" };
            var result = outTxt.Split(separador, StringSplitOptions.None);
            if (result[0].Equals("0"))
            {
                objReturn.Status = true;
                //enviar correo al usuario
                itemUsuarios infoUsuario = part.ValidaSessionUsu(IdUsuario, "N");
                if (!string.IsNullOrEmpty(infoUsuario.email))
                {
                    string mensajeCorreo = "";
                    if (Aprobado == true)
                    {
                        mensajeCorreo = ObtHtmlCorreoComent("Notificaciones", "Gracias por Participar", "Tu foto ha sido publicada.", IdProyecto, 1, null, null, "N", "N");
                    }
                    if (Aprobado == false)
                    {
                        string nopublicado = "";
                        nopublicado += "Tu foto no ha sido aprobada para su publicación debido a que no cumple con los términos y condiciones de participación ciudadana.</p>";
                        nopublicado += "<p>Te invitamos a revisar los términos y condiciones.</p>";
                        nopublicado += "<p>Mensaje del administrador:</p>";
                        nopublicado += "<p>" + textoJustifica;
                        mensajeCorreo = ObtHtmlCorreoComent("Notificaciones", "Gracias por Participar", nopublicado, IdProyecto, 1, null, null, "N", "N");
                    }
                    CorreoController instanciaControladorCorreo = new CorreoController(Configuration);
                    ModeloRespuestaCorreo rptaCorreo = instanciaControladorCorreo.EnviarCorreoHtml(infoUsuario.email, mensajeCorreo, "Participación Ciudadana");
                    objReturn.Status = rptaCorreo.Status;
                    objReturn.Message = rptaCorreo.Message;
                }
                else
                {
                    objReturn.Status = false;
                    objReturn.Message = "Error al guardar comentarios";
                }
            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = result[1];
            }

            return objReturn;

        }

        [HttpPost("GetEstadosComentario")]
        [IgnoreAntiforgeryTokenAttribute]
        public object GetEstadosComentario()
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            List<filtrosParticipacion> estados = part.ObtenerEstadosComentarioAsync();
            objReturn.filtrosEstado = estados;
            objReturn.Status = true;
            return objReturn;
        }

        [HttpPost("GetAsociacionComentario")]
        [IgnoreAntiforgeryTokenAttribute]

        public object GetAsociacionComentario()
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            List<filtrosParticipacion> info = part.ObtenerAsociacionComentarioAsync();
            objReturn.filtrosAsociacion = info;
            objReturn.Status = true;
            return objReturn;
        }

        [HttpPost("ActualizarTipologiaComent")]
        [IgnoreAntiforgeryTokenAttribute]
        public object ActualizarTipologiaComent(TipologiaComentario cad_tipologia)
        {

            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            TipologiaComentario reg = new TipologiaComentario();
            //eliminar tipologias anteriores
            //consulta si existen tipologias

            string outTxt = part.deleteTipologiaComent(cad_tipologia.idComentario);
            string[] separador = new string[] { "<||>" };
            var result = outTxt.Split(separador, StringSplitOptions.None);
            if (result[0].Equals("0"))
            {
                //insertar nueva tipologia
                if (!string.IsNullOrEmpty(cad_tipologia.idTipologiaStr))
                {
                    outTxt = part.insertarTipologiaComent(cad_tipologia.idComentario, cad_tipologia.idTipologiaStr);
                    result = outTxt.Split(separador, StringSplitOptions.None);
                    if (result[0].Equals("0"))
                    {
                        objReturn.Status = true;
                    }
                    else
                    {
                        objReturn.Status = false;
                        objReturn.Message = result[1];
                    }
                }
                else
                {
                    objReturn.Status = true;
                }
            }
            else
            {
                objReturn.Status = false;
                objReturn.Message = result[1];
            }
            return objReturn;
        }


        [HttpPost("SubirArchivo")]
        [IgnoreAntiforgeryTokenAttribute]
        public object SubirArchivo([FromBody] ItemSubirImagen params_img)
        {
            string mensaje = string.Empty;
            string id_usuario_aux = "";
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
            try
            {
                if (HttpContext.Session.GetString("IdUsuario") != null)
                {
                    id_usuario_aux = HttpContext.Session.GetString("IdUsuario");
                }
                if (params_img != null && params_img.UploadedImage != null && params_img.UploadedImage.Length > 0 && int.TryParse(id_usuario_aux, out int idUsuario))
                {
                    var stream = new MemoryStream(params_img.UploadedImage);
                    System.Drawing.Image img = Image.FromStream(stream);
                    if (img != null)
                    {
                        Random aleatorio = new Random();
                        var fileName = params_img.ProjectImage + "_" + id_usuario_aux + "_" + DateTime.Now.Year + "_" + DateTime.Now.Month + "_" + DateTime.Now.Day + "_" + DateTime.Now.Hour + "_" + DateTime.Now.Minute + DateTime.Now.Second + "_" + DateTime.Now.Millisecond + "-" + aleatorio.Next(0, 1000);
                        ImageFormat frmt;
                        #region Defino el formato de la imagen
                        if (ImageFormat.Png.Equals(img.RawFormat))
                        {
                            fileName += ".png";
                            frmt = ImageFormat.Png;
                        }
                        else if (ImageFormat.Bmp.Equals(img.RawFormat))
                        {
                            fileName += ".bmp";
                            frmt = ImageFormat.Bmp;
                        }
                        else if (ImageFormat.Emf.Equals(img.RawFormat))
                        {
                            fileName += ".emf";
                            frmt = ImageFormat.Emf;
                        }
                        else if (ImageFormat.Exif.Equals(img.RawFormat))
                        {
                            fileName += ".exif";
                            frmt = ImageFormat.Exif;
                        }
                        else if (ImageFormat.Gif.Equals(img.RawFormat))
                        {
                            fileName += ".gif";
                            frmt = ImageFormat.Gif;
                        }
                        else if (ImageFormat.Icon.Equals(img.RawFormat))
                        {
                            fileName += ".icon";
                            frmt = ImageFormat.Icon;
                        }
                        else if (ImageFormat.Jpeg.Equals(img.RawFormat))
                        {
                            fileName += ".jpeg";
                            frmt = ImageFormat.Jpeg;
                        }
                        else if (ImageFormat.MemoryBmp.Equals(img.RawFormat))
                        {
                            fileName += ".memoryBmp";
                            frmt = ImageFormat.MemoryBmp;
                        }
                        else if (ImageFormat.Tiff.Equals(img.RawFormat))
                        {
                            fileName += ".tiff";
                            frmt = ImageFormat.Tiff;
                        }
                        else if (ImageFormat.Wmf.Equals(img.RawFormat))
                        {
                            fileName += ".wmf";
                            frmt = ImageFormat.Wmf;
                        }
                        else
                        {
                            frmt = null;
                        }
                        #endregion  Defino el formato de la imagen
                        if (frmt != null)
                        {
                            //string path = AppDomain.CurrentDomain.BaseDirectory + "Images";
                            string path = Environment.CurrentDirectory + "\\wwwroot\\Images\\";
                            string pathBd = "/Images";
                            if (!Directory.Exists(path))
                            {
                                Directory.CreateDirectory(path);
                            }
                            path += fileName;
                            img.Save(path, frmt);
                            if (int.TryParse(params_img.ProjectImage, out int idProyecto))
                            {
                                string[] datosMunDep = params_img.LocationImage.Split('-');
                                if (datosMunDep.Length > 1)
                                {
                                    string salidaIngresoRegisto = part.RegistrarNuevaFotoUsuario(params_img.DescripcionImage, pathBd + "/" + fileName, datosMunDep[1], datosMunDep[0], idProyecto, idUsuario);
                                    if (salidaIngresoRegisto == "0<||>")
                                    {
                                        try
                                        {
                                            string ancho_new = Configuration.GetValue<string>("sizeFotosUsuario");
                                            if (!string.IsNullOrEmpty(ancho_new))
                                            {
                                                CambiarTamanoImagen(Convert.ToInt16(ancho_new), stream, path);
                                                mensaje = "0<||>El archivo se guardó exitosamente, su foto será visualizada una vez el administrador valide los datos";
                                            }
                                            else
                                            {
                                                mensaje = "-1<||>El archivo NO se guardó exitosamente,falta configuracion de tamaño máximo ";
                                            }

                                        }
                                        catch (Exception ex)
                                        {
                                            mensaje = "-1<||>El archivo NO se guardó exitosamente, se presentó un problema con la imagen puede ser el tipo de imagen o el tamaño de esta.\nDetalles del error\n" + ex.Message;
                                        }
                                    }
                                    else mensaje = "-1<||>No fue posible almacenar el registro de la foto en la base de datos";
                                }
                                else mensaje = "-1<||>No fue posible capturar la ubicación donde se va a reportar la foto";
                            }
                            //}
                        }
                    }
                }
                else
                {
                    mensaje = "-1<||>No hay archivos para guardar";
                }

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
            objReturn.Status = true;
            objReturn.Message = mensaje;
            return objReturn;
        }


        /// <summary>
        /// Ejemplo copiado de internet. 
        /// Fuente: https://forums.asp.net/t/1576697.aspx?File+Upload+and+resize+image+with+MVC+
        /// </summary>
        /// <param name="imageSize"></param>
        /// <param name="filePath"></param>
        /// <param name="outputPath"></param>
        private void CambiarTamanoImagen(int imageSize, Stream filePath, string outputPath)
        {
            var image = System.Drawing.Image.FromStream(filePath);
            int thumbnailSize = imageSize;
            int newWidth, newHeight;
            if (image.Width > image.Height)
            {
                newWidth = thumbnailSize;
                newHeight = image.Height * thumbnailSize / image.Width;
            }
            else
            {
                newWidth = image.Width * thumbnailSize / image.Height;
                newHeight = thumbnailSize;
            }
            var thumbnailBitmap = new Bitmap(newWidth, newHeight);
            var thumbnailGraph = Graphics.FromImage(thumbnailBitmap);
            thumbnailGraph.CompositingQuality = CompositingQuality.HighQuality;
            thumbnailGraph.SmoothingMode = SmoothingMode.HighQuality;
            thumbnailGraph.InterpolationMode = InterpolationMode.HighQualityBicubic;
            var imageRectangle = new System.Drawing.Rectangle(0, 0, newWidth, newHeight);
            thumbnailGraph.DrawImage(image, imageRectangle);
            thumbnailBitmap.Save(outputPath, image.RawFormat);
            thumbnailGraph.Dispose();
            thumbnailBitmap.Dispose();
            image.Dispose();
        }


    }
}
