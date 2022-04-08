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
      //ModelPlanData modelo = new ModelPlanData();
      ////List<EjeEstrategico> listEje = new List<EjeEstrategico>();
      //modelo.EjesEstrategicos = (from ejes in _connection.EjeEstrategicoes
      //                           where ejes.PlanId == 9
      //                           select new EjeEstrategico {
      //                             Nombre = ejes.Nombre,
      //                             Descripcion = ejes.Descripcion,
      //                             Id = ejes.Id
      //                           }).ToList();
      //ViewData["EjesEstrategicos"] = modelo.EjesEstrategicos;
      //modelo.Ejes = listEje;
      //return View(modelo);
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
