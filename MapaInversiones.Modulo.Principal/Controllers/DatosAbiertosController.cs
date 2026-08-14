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

        //public IActionResult GetFuenteDeLosRecursos()
        //{
        //    ModelDatosAbiertosData modelo = new ModelDatosAbiertosData();
        //    var _sector = Request.Query["sector"];
        //    using (var DataModel = new TransparenciaDB())
        //    {

        //        var grupos = (from pre in _connection.FuenteDeLosRecursos
        //                      join ct in _connection.CatalogoTiempos on pre.Periodo.ToString() equals ct.Periodo
        //                      group ct by ct.Año into g
        //                      select new Period
        //                      {
        //                          id = g.Key,
        //                          name = g.Key.ToString()
        //                      }).Distinct().OrderByDescending(x => x.id).ToList();
        //        modelo.periodos = grupos;

        //    }
        //    modelo.Sector = _sector;
        //    ViewData["ruta"] = "Presupuesto";
        //    return View(modelo);
        //}


    }
}
