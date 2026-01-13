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
    public class EmergenciasController : Controller
    {

        private readonly ILogger<EmergenciasController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly IEmergenciaBLL _cargaemergencia;


        public EmergenciasController(ILogger<EmergenciasController> logger, TransparenciaDB connection, IEmergenciaBLL cargaemergencia)
        {
            _logger = logger;
            _connection = connection;
            _cargaemergencia = cargaemergencia;
        }

        public IActionResult Index()
        {
            return View();
        }

        public ActionResult Emergencia(int emergencia)
        {
            ModelHomeEmergencias Data = new ModelHomeEmergencias();
            Data = _cargaemergencia.ObtenerDatosModeloInicio(emergencia);
            return View(Data);
        }

        public ActionResult ContratosEmergencia(int emergencia, string entidad = null, string proceso = null)
        {

            ModelContratistaData Data = new ModelContratistaData();

            Data = _cargaemergencia.ObtenerDatosContratosEmergencia(emergencia, entidad);
            return View(Data);
           
        }

        public ActionResult ProcesosCanceladosEmergencia(int emergencia, string entidad = null, string proceso = null)
        {

            ModelContratistaData Data = new ModelContratistaData();

            Data = _cargaemergencia.ObtenerDatosProcesosCanceladosEmergencia(emergencia, entidad);
            return View(Data);
            
        }

    }

}
