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

    public ActionResult prueba()
    {
        return View();
    }

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
                             }).Distinct().OrderByDescending(x => x.id).ToList();
                modelo.periodos = grupos;

            }
            modelo.Sector = _sector;

            ViewData["ruta"] = "Presupuesto";
            return View(modelo);


           
    }

    ///// <summary>
    ///// Devuelve la información del presupuesto dado un tipo de emergencia
    ///// </summary>
    ///// <param name="tipoEmergenciaId">Corresponde al tipo de emergencia a consultar</param>
    ///// <returns>Información del presupuesto de la emergencia consultada</returns>
    //public IActionResult PresupuestoEmergencia(string emergencia)
    //{
    //  _ = int.TryParse(emergencia, out int tipoDeEmergenciaId);
    //  //var horaInicio = DateTime.UtcNow;
    //  //ViewBag.TitulosHome = GestorTitulos.instance;
    //  //List<InformationSource> fuenteDatos = WebSite.ConsultarValoresFuenteDeLosDatos(tipoDeEmergenciaId).dataSource;
    //  //ViewBag.dataSource = fuenteDatos;
    //  //ViewBag.Beta = Alertas.ObtenerEstadoAlerta("VersionBeta");
    //  //ViewBag.PopupGeneral = Alertas.ObtenerEstadoAlerta("PopupGeneral");
    //  //ViewBag.ProyectoDesactualizado = Alertas.ObtenerEstadoAlerta("ProyectosDesactualizados");
    //  //ViewBag.FranjaRojaPruebas = Alertas.ObtenerEstadoAlerta("FranjaRojaPruebas");
    //  //ViewBag.WarningHome = Alertas.ObtenerEstadoAlerta("WarningHome");
    //  //ViewBag.ContadorVisitas = ContadorVisitas.Instancia;
    //  //if (Alertas.ObtenerEstadoAlerta("MostrarAlertaIE8") == true)
    //  //{
    //  //  ViewBag.MostrarAlertaIE8 = (Request.Browser.Browser.ToString().Equals("InternetExplorer") && Session["MostrarAlertaIE8"] == null) || (Request.Browser.Browser.ToString().Equals("IE") && Session["MostrarAlertaIE8"] == null);
    //  //  if (ViewBag.MostrarAlertaIE8)
    //  //    Session["MostrarAlertaIE8"] = true;
    //  //}
    //  HomePresupuestoEmergenciaContract homeContract = new(_connection);
    //  homeContract.Fill(tipoDeEmergenciaId);
    //  if (homeContract.HomePresupuestoEmergenciaModel != null)
    //  {
    //    //homeContract.HomePresupuestoEmergenciaModel.NombreEmergencia = GestorTitulos.instance.BuscarTituloPorLlave("Emergencia_Busqueda_searchBox" + emergencia);
    //    homeContract.HomePresupuestoEmergenciaModel.TipoEmergencia = tipoDeEmergenciaId.ToString();
    //  }

    //  //if (fuenteDatos != null && fuenteDatos.Count > 0)
    //  //{
    //  //  var fechaMinisterioHacienda = (from fuenteDato in fuenteDatos
    //  //                                 orderby fuenteDato.FechaCorteData descending
    //  //                                 where fuenteDato.source.ToUpper() == "MINISTERIO DE HACIENDA" && fuenteDato.data.ToUpper() == "PROGRAMAS RELACIONADOS CON EL COVID"
    //  //                                 select fuenteDato.FechaCorteData).FirstOrDefault();

    //  //  var fechaFuenteCorteHacienda = (from fuenteDato in fuenteDatos
    //  //                                  orderby fuenteDato.FechaCorteData descending
    //  //                                  where fuenteDato.source.ToUpper() == "MINISTERIO DE HACIENDA" && fuenteDato.data.ToUpper() == "PROGRAMAS RELACIONADOS CON EL COVID" && fuenteDato.FechaCorteFuente.HasValue
    //  //                                  select fuenteDato.FechaCorteFuente.Value).FirstOrDefault();

    //  //  var fechaContrataciones = (from fuenteDato in fuenteDatos
    //  //                             orderby fuenteDato.FechaCorteData descending
    //  //                             where fuenteDato.source.ToUpper() == "DIRECCIÓN GENERAL DE CONTRATACIONES PÚBLICAS" && fuenteDato.data.ToUpper() == "CONTRATOS RELACIONADOS CON EL COVID"
    //  //                             select fuenteDato.FechaCorteData).FirstOrDefault();

    //  //  var fechaFuenteCorteContrataciones = (from fuenteDato in fuenteDatos //Gastos Devengados Relacionados con el Covid
    //  //                                        orderby fuenteDato.FechaCorteData descending
    //  //                                        where fuenteDato.source.ToUpper() == "DIRECCIÓN GENERAL DE CONTRATACIONES PÚBLICAS" && fuenteDato.data.ToUpper() == "CONTRATOS RELACIONADOS CON EL COVID" && fuenteDato.FechaCorteFuente.HasValue
    //  //                                        select fuenteDato.FechaCorteFuente.Value).FirstOrDefault();

    //  //  var fechaFuenteCorteGastosDevengados = (from fuenteDato in fuenteDatos
    //  //                                          orderby fuenteDato.FechaCorteData descending
    //  //                                          where fuenteDato.source.ToUpper() == "MINISTERIO DE HACIENDA" && fuenteDato.data.ToUpper() == "GASTOS DEVENGADOS RELACIONADOS CON EL COVID" && fuenteDato.FechaCorteFuente.HasValue
    //  //                                          select fuenteDato.FechaCorteFuente.Value).FirstOrDefault();

    //  //  var fechaGastosDevengados = (from fuenteDato in fuenteDatos
    //  //                               orderby fuenteDato.FechaCorteData descending
    //  //                               where fuenteDato.source.ToUpper() == "MINISTERIO DE HACIENDA" && fuenteDato.data.ToUpper() == "GASTOS DEVENGADOS RELACIONADOS CON EL COVID"
    //  //                               select fuenteDato.FechaCorteData).FirstOrDefault();

    //  //  var fecha_aux = (from fuenteDato in fuenteDatos
    //  //                   where fuenteDato.id == 4 || fuenteDato.id == 5 || fuenteDato.id == 6 || fuenteDato.id == 7
    //  //                   select fuenteDato.FechaCorteData);
    //  //  if (fecha_aux.Any())
    //  //  {
    //  //    ViewBag.fecha_corte_Programas = fecha_aux.Max();
    //  //  }
    //  //  homeContract.HomePresupuestoEmergenciaModel.FechaActualizacionContratos = fechaContrataciones != null ? fechaContrataciones.ToShortDateString() : string.Empty;
    //  //  homeContract.HomePresupuestoEmergenciaModel.FechaCorteFuenteContratos = fechaFuenteCorteContrataciones != null ? fechaFuenteCorteContrataciones.ToShortDateString() : string.Empty;

    //  //  homeContract.HomePresupuestoEmergenciaModel.FechaActualizacionHacienda = fechaMinisterioHacienda != null ? fechaMinisterioHacienda.ToShortDateString() : string.Empty;
    //  //  homeContract.HomePresupuestoEmergenciaModel.FechaCorteFuenteHacienda = fechaFuenteCorteHacienda != null ? fechaFuenteCorteHacienda.ToShortDateString() : string.Empty;

    //  //  homeContract.HomePresupuestoEmergenciaModel.FechaCorteGastosIncentivos = fechaFuenteCorteGastosDevengados != null ? fechaFuenteCorteGastosDevengados.ToShortDateString() : string.Empty;
    //  //  homeContract.HomePresupuestoEmergenciaModel.FechaActualizacionGastosIncentivos = fechaGastosDevengados != null ? fechaGastosDevengados.ToShortDateString() : string.Empty;
    //  //}
    //  return View(homeContract.HomePresupuestoEmergenciaModel);
    //}

    public ActionResult ElaboraPresupuesto()
    {
      return View();
    }
  }
}
