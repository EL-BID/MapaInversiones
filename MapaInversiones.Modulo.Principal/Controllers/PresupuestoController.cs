using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Presupuesto;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class PresupuestoController : Controller
  {

    private readonly ILogger<PresupuestoController> _logger;
    private readonly TransparenciaDB _connection;
    private static IConfiguration Configuration;


    public PresupuestoController(ILogger<PresupuestoController> logger, TransparenciaDB connection, IConfiguration configuration)
    {
      _logger = logger;
      _connection = connection;
      Configuration = configuration;

        }

    public IActionResult Index()
    {
      return View();
    }

    public ActionResult ProcesoPresupuesto()
    {
      ViewData["ruta"] = "Presupuesto";
      return View();
    }

        
    public ActionResult PresupuestoInversionPublica()
    {
        return View();
    }

    public IActionResult PresupuestoGeneral()
    {
            
            ModelPresupuestoData modelo = new ModelPresupuestoData();
            //int anyo_actual = DateTime.Now.Year;  //deshabilitado 6 ene 2023
            int anyo_actual = Convert.ToInt32(Configuration["AnyoActualParameter"]); ;
            int limite = anyo_actual - 3;

            List<int> periodos = new List<int>();

            for (int i = anyo_actual; i >= limite; i = i - 1)
            {
                periodos.Add(i);
            }
            modelo.periodos = periodos;


            //VersionesPresupuesto
            modelo.versiones = (from pre in _connection.VwPresupuestoVersiones
                                where pre.AnioPresupuesto==anyo_actual
                            orderby pre.NombreVersion descending
                            select new itemVersiones
                            {
                                CodigoVersion = pre.CodigoVersion,
                                NombreVersion=pre.NombreVersion
                            }).Distinct().ToList();


            modelo.funciones = (from pre in _connection.VwPresupuesto
                                where pre.Periodo == anyo_actual
                                orderby pre.Funcion
                                select new InformationGraphics
                                {
                                    label=pre.Funcion
                                 }).Distinct().ToList();

            ViewData["ruta"] = "Presupuesto";
        return View(modelo);
    }

        public ActionResult ElaboraPresupuesto()
        {
            return View();
        }
    }
}
