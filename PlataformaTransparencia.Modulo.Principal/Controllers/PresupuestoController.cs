using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class PresupuestoController : Controller
  {

    private readonly ILogger<PlanController> _logger;
    private readonly TransparenciaDB _connection;



    public PresupuestoController(ILogger<PlanController> logger, TransparenciaDB connection)
    {
      _logger = logger;
      _connection = connection;

***REMOVED***

    public IActionResult Index()
    {
      return View();
***REMOVED***
    public IActionResult PresupuestoGeneral()
    {
      ModelPresupuestoData modelo = new ModelPresupuestoData();
      modelo.Presupuesto = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                            orderby pre.AnioPresupuesto descending
                            select new PresupuestoXSectorMinHacienda {
                              AnioPresupuesto = pre.AnioPresupuesto
                        ***REMOVED***).Distinct().ToList();
      ViewData["ruta"] = "Presupuesto";
      return View(modelo);
***REMOVED***


    public ActionResult ProcesoPresupuesto()
    {
      ViewData["ruta"] = "Presupuesto";
      return View();
***REMOVED***


  ***REMOVED***
***REMOVED***
