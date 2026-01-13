using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Entidad;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Entidad
{
    public class EntidadController : Controller
    {

        private readonly ILogger<EntidadController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly IEntidadBLL _cargaentidad;


        public EntidadController(ILogger<EntidadController> logger, TransparenciaDB connection, IEntidadBLL cargaentidad)
        {
            _logger = logger;
            _connection = connection;
            _cargaentidad = cargaentidad;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult perfilEntidad(string codEntidad)
        {
            ModelEntidadData entidadData = _cargaentidad.GetEntidadData(codEntidad);
            return View(entidadData);
        }

        public IActionResult EntidadesGeneral()
        {
            //EntidadContract entidad = new EntidadContract(_connection);
            //string nombreEntidad = entidad.ObtenerNombreEntidad(codEntidad);
            //entidad.Fill(nombreEntidad, codEntidad);
            //ViewBag.dataSource = entidad.ObtFuenteDatos();
            return View();
        }

    }
}
