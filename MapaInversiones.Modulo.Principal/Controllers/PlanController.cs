using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Plan;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class PlanController : Controller
  {
        private readonly ILogger<PlanController> _logger;
        private readonly TransparenciaDB _connection;



    public PlanController(ILogger<PlanController> logger, TransparenciaDB connection)
    {
        _logger = logger;
        _connection = connection;

    }

    
    public IActionResult Index()
    {
      return View();
    }
    public IActionResult PlanNacional()
    {
      ViewData["ruta"] = "Planificación";
      return View();
    }
    public IActionResult PerfilPrograma()
    {
      return View();
    }

    public IActionResult ProcesoPlanNacional()
    {
      ViewData["ruta"] = "Planificación";
      return View();
    }

        public IActionResult pruebaGrafica()
        {
            return View();
        }
    }
}
