using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modulo.Principal.Controllers.Contratos;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Sectores
{
    public class SectoresController : Controller
    {


        private readonly ILogger<SectoresController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly ISectorBLL _cargasector;


        public SectoresController(ILogger<SectoresController> logger, TransparenciaDB connection, ISectorBLL cargasector)
        {
            _logger = logger;
            _connection = connection;
            _cargasector = cargasector;

        }
        public IActionResult PerfilSectores(string id)
        {
            ModelLocationData locationData = new ModelLocationData();
            locationData = _cargasector.ObtenerDatosLocalizacionSector(id);
            return View(locationData);
        }
    }
}
