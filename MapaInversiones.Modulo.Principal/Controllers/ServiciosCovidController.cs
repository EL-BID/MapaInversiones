
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
      public string id { get; set; }
      public string texto { get; set; }
      public int pagina { get; set; }
    }

    private readonly TransparenciaDB _connection;

    public ServiciosCovidController(TransparenciaDB connection)
    {
      _connection = connection;
    }

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
      }
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }
    }

  

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
      }
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }
    }



  }
}