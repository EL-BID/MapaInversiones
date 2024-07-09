using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Emergencia;
using PlataformaTransparencia.Modulo.Principal.Controllers.Contratos;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Interfaces;
using System.Collections.Specialized;
using System;


namespace PlataformaTransparencia.Modulo.Principal.Controllers.Emergencia
{
    public class PresupuestoGeneralEmergenciasController : Controller
    {

        private readonly ILogger<PresupuestoGeneralEmergenciasController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly IPresupuestoEmergenciaBLL _cargaemergencia;


        public PresupuestoGeneralEmergenciasController(ILogger<PresupuestoGeneralEmergenciasController> logger, TransparenciaDB connection, IPresupuestoEmergenciaBLL cargaemergencia)
        {
            _logger = logger;
            _connection = connection;
            _cargaemergencia = cargaemergencia;
        }

        public IActionResult Index()
        {
            return View();
        }

        public ActionResult PresupuestoGeneralEmergencia()
        {
            ModelPresupuestoGeneralEmergenciaData Data = new ModelPresupuestoGeneralEmergenciaData();
            Data = _cargaemergencia.ObtenerDatosPresupuestoGeneralEmergencias();
            return View("../Emergencias/PresupuestoGeneralEmergencia", Data);
        }

      

    }

}
