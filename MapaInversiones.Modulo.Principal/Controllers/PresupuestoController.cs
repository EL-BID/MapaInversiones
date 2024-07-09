using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Comunes;

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

***REMOVED***

    public IActionResult Index()
    {
      return View();
***REMOVED***

    public ActionResult ProcesoPresupuesto()
    {
      ViewData["ruta"] = "Presupuesto";
      return View();
***REMOVED***


    public ActionResult PresupuestoInversionPublica()
    {
      return View();
***REMOVED***

    public ActionResult prueba()
    {
        return View();
***REMOVED***

        public IActionResult PresupuestoGeneral()
    {
            ModelPresupuestoData modelo = new ModelPresupuestoData();
            var _sector = Request.Query["sector"];

            using (var DataModel = new TransparenciaDB())
            {

                var grupos = (from pre in _connection.VwPresupuesto
                             join ct in _connection.CatalogoTiempoes on pre.Periodo.ToString() equals ct.Periodo
                             group ct by ct.Año into g
                             select new Period
                             {
                                id=g.Key,
                                name=g.Key.ToString()
                         ***REMOVED***).Distinct().OrderByDescending(x => x.id).ToList();
                modelo.periodos = grupos;

        ***REMOVED***
            modelo.Sector = _sector;

            ViewData["ruta"] = "Presupuesto";
            return View(modelo);


           
***REMOVED***

  
    public ActionResult ElaboraPresupuesto()
    {
      return View();
***REMOVED***
  ***REMOVED***
***REMOVED***
