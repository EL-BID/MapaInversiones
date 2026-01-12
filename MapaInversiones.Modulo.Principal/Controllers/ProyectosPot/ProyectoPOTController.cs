using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Negocios.Project;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using PlataformaTransparencia.Negocios.Proyectos;
using Bet.Extensions.Wkhtmltopdf;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Negocios.Interfaces;
using PlataformaTransparencia.Modelos.Reportes;
using System.Collections.Generic;
using PlataformaTransparencia.Modelos.Proyectos;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.ProyectosPot
{
    public class ProyectoPotController : Controller
    {
        private readonly ILogger<ProyectoController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly IConfiguration _configuration;
        private readonly IConsultasComunes _consultasComunes;


        public ProyectoPotController(IConsultasComunes consultasComunes, IConfiguration configuration, IPdfGenerator pdfGenerator, ILogger<ProyectoController> logger, TransparenciaDB connection)
        {
            _logger = logger;
            _connection = connection;
            _configuration = configuration;
            _consultasComunes = consultasComunes;
        }

        [HttpGet("PerfilProyectoPot/{id}")]
        public IActionResult PerfilProyectoPot(int id)
        {
            if (id == 0)
            {
                return BadRequest("El Id del proyecto no puede ser cero.");
            }

            string id_usuario_aux;
            string nom_usuario_aux;
            id_usuario_aux = HttpContext.Session.GetString("IdUsuario");
            nom_usuario_aux = HttpContext.Session.GetString("NomUsuario");
            ProjectProfileContract proyectoContract = new(id, _connection, id_usuario_aux, nom_usuario_aux);

            proyectoContract.FillPOT();

            return View(proyectoContract.ModelProjectProfile);
        }

    }
}
