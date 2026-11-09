using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    public class DatosAbiertosController : Controller
    {

        private readonly ILogger<PresupuestoController> _logger;
        private readonly TransparenciaDB _connection;
      

        public DatosAbiertosController(ILogger<PresupuestoController> logger, TransparenciaDB connection)
        {
            _logger = logger;
            _connection = connection;
        }

        public IActionResult DatosAbiertos()
        {
            ViewData["ruta"] = "Datos abiertos";
            return View();
        }

       

    }
}
