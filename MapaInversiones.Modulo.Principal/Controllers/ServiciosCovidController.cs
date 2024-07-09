
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Emergencia;
using PlataformaTransparencia.Negocios.PlanNacional;
using SolrNet;
using System;


namespace PlataformaTransparencia.Modulo.Principal.Controllers
{

  [Route("api/servicioscovid")]
  public class ServiciosCovidController : Controller
  {
    public class consulta
    {
      public string id { get; set; ***REMOVED***
      public string texto { get; set; ***REMOVED***
      public int pagina { get; set; ***REMOVED***
***REMOVED***

    private readonly TransparenciaDB _connection;

    public ServiciosCovidController(TransparenciaDB connection)
    {
      _connection = connection;
***REMOVED***

    [HttpGet("ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia")]
    public ModelCovidFuentesData ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia()
    {
      ModelCovidFuentesData objReturn = new();
      try
      {
        if (!int.TryParse(Request.Query["typeEmergencyId"], out int tipoEmergencia)) tipoEmergencia = 3;
        EmergenciaBLL emergenciaBll = new(_connection);
        objReturn.distribucionItem = emergenciaBll.ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia(tipoEmergencia);
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
  ***REMOVED***
***REMOVED***

  

    [HttpGet("ObtConsolidadoRecursosCovid")]
    public ModelCovidRecursosTotalData ObtConsolidadoRecursosCovid()
    {
      ModelCovidRecursosTotalData objReturn = new();
      try
      {
        EmergenciaBLL emergenciaBll = new (_connection);
        var valores = emergenciaBll.ObtenerConsolidadoRecursosCovid();
        objReturn.distribucionItem = valores;
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
  ***REMOVED***
***REMOVED***



  ***REMOVED***
***REMOVED***