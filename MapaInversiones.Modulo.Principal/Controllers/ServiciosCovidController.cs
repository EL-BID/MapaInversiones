
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
  //[ApiController]
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

    //[HttpPost]
    //[ActionName("ObtDistribucionPresupuestalArticulos")]
    //public ModelCovidFuentesData ObtDistribucionPresupuestalArticulos()
    //{
    //  ModelCovidFuentesData objReturn = new ModelCovidFuentesData();
    //  try
    //  {
    //    objReturn.distribucionItem = ConsolidadosCovidBLL.ObtDistribucionPresupuestalByFuente();
    //    objReturn.Status = true;
    //    return objReturn;
    //  }
    //  catch (Exception exception)
    //  {
    //    objReturn.Status = false;
    //    objReturn.Message = "Error: " + exception.Message;
    //    return objReturn;
    //  }
    //}


    //[HttpPost]
    //[ActionName("ObtDistribucionPresupuestalPorTipoEmergencia")]
    //public ModelCovidFuentesData ObtDistribucionPresupuestalPorTipoEmergencia()
    //{
    //  ModelCovidFuentesData objReturn = new ModelCovidFuentesData();
    //  try
    //  {
    //    objReturn.distribucionItem = ConsolidadosCovidBLL.ObtDistribucionPresupuestalPorTipoEmergencia(2);
    //    objReturn.Status = true;
    //    return objReturn;
    //  }
    //  catch (Exception exception)
    //  {
    //    objReturn.Status = false;
    //    objReturn.Message = "Error: " + exception.Message;
    //    return objReturn;
    //  }
    //}

    [HttpGet("ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia")]
    public ModelCovidFuentesData ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia()
    {
      ModelCovidFuentesData objReturn = new();
      try
      {
        if (!int.TryParse(Request.Query["typeEmergencyId"], out int tipoEmergencia)) tipoEmergencia = 3;
        EmergenciaBLL emergenciaBll = new(_connection);
        objReturn.distribucionEmergencia = emergenciaBll.ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia(tipoEmergencia);
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

    //[HttpPost]
    //[ActionName("ObtDistribucionPresupuestalGeneralPorTipoEmergencia")]
    //public ModelCovidFuentesData ObtDistribucionPresupuestalGeneralPorTipoEmergencia()
    //{
    //  ModelCovidFuentesData objReturn = new ModelCovidFuentesData();
    //  try
    //  {
    //    objReturn.distribucionItem = ConsolidadosCovidBLL.ObtDistribucionPresupuestalPorTipoEmergencia(1);
    //    objReturn.Status = true;
    //    return objReturn;
    //  }
    //  catch (Exception exception)
    //  {
    //    objReturn.Status = false;
    //    objReturn.Message = "Error: " + exception.Message;
    //    return objReturn;
    //  }
    //}

    //[HttpPost]
    //[ActionName("GetConsolidadoPresuAsignadoPorEntidadAnio")]
    //public List<InfoGraficoItemPrograma> GetConsolidadoPresuAsignadoPorEntidadAnio()
    //{
    //  List<InfoGraficoItemPrograma> objReturn = new List<InfoGraficoItemPrograma>();
    //  try
    //  {
    //    ConsolidadosGestionBLL consolidados = new ConsolidadosGestionBLL();
    //    objReturn = consolidados.ObtenerPresupuestoGeneralAsignadoPorEntidad();//anio
    //    return objReturn;
    //  }
    //  catch (Exception)
    //  {
    //    return objReturn;
    //  }
    //}

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