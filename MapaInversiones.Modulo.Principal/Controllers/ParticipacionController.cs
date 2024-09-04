using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Project;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
   
    public class ParticipacionController : Controller
    {
        private readonly TransparenciaDB _connection;

        public ParticipacionController(TransparenciaDB connection)
        {
            _connection = connection;
        }
        public ActionResult ParticipacionCiudadana()
        {
            ViewData["ruta"] = "ParticipacionCiudadana";
            return View();
        }


        public IActionResult Aprobar()
        {
            string id_usuario_aux = "";
            string nom_usuario_aux = "";
            id_usuario_aux = HttpContext.Session.GetString("IdUsuario");
            nom_usuario_aux = HttpContext.Session.GetString("NomUsuario");

            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            var filtroEstado = new List<filtrosParticipacion>();
            filtroEstado = part.ObtenerEstadosComentarioAsync();
            var tipoComentario = part.ObtenerTipoComentarioAsync(1);
            var infoAsociacion = part.ObtenerAsociacionComentarioAsync();

            var modeloRespuesta = new ModelDataParticipacion()
            {
                id_usu_participa = id_usuario_aux,
                nom_usu_participa = nom_usuario_aux,
                filtrosEstado = filtroEstado,
                filtrosAsociacion = infoAsociacion,
                tipo_comentario = tipoComentario
            };
            return View(modeloRespuesta);
        }


        public IActionResult VerificaCuenta(string id)
        {
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            //activacion de usuario
            string[] separador = new string[] { "_" };
            var result = id.Split(separador, StringSplitOptions.None);
            string hash_cod = result[0];
            string id_proyecto = result[2];

            var modeloRespuesta = new ModelProjectProfile();
            itemUsuarios infoUsuario = part.validaUsuarioByHash(hash_cod);

            if (infoUsuario != null)
            {
                //usuario existe y se encuentra creado, 
                string outTxt = part.updEstadoUsuario(infoUsuario.IdUsuario, "ACTIVO");
                string[] separador_aux = new string[] { "<||>" };
                var result_aux = outTxt.Split(separador_aux, StringSplitOptions.None);
                if (result_aux[0].Equals("0"))
                {
                    modeloRespuesta.id_usu_participa = infoUsuario.IdUsuario.ToString();
                    modeloRespuesta.nom_usu_participa = infoUsuario.Nombre;
                    modeloRespuesta.error_msg = "OK";
                    modeloRespuesta.idproject = Convert.ToInt32(id_proyecto);
                }
                else
                {
                    modeloRespuesta.error_msg = result_aux[1];
                }
            }
            else
            {
                modeloRespuesta.error_msg = "Error: Usuario no encontrado";
            }
            return View(modeloRespuesta);
        }

    }
}
