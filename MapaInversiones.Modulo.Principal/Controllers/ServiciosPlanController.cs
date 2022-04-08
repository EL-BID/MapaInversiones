using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Negocios.Home;
using PlataformaTransparencia.Negocios.PlanNacional;
using PlataformaTransparencia.Negocios.Entidad;
using SolrNet;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  [Route("api/serviciosplan")]
  public class ServiciosPlanController : Controller
  {
    private readonly ILogger<ServiciosPlanController> _logger;
    private readonly TransparenciaDB _connection;
    private ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> _solr;

    public ServiciosPlanController(ILogger<ServiciosPlanController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> solr)
    {
          _logger = logger;
          _connection = connection;
          _solr = solr;

        }


    [HttpGet("GetEjesEstrategicos")]
    public ModelPlanData GetEjesEstrategicos()
    {
      ModelPlanData objReturn = new ModelPlanData();
      try 
      {
        objReturn.EjesEstrategicos = (from ejes in _connection.VinculacionIndicadoresPNDXEntidadesStps0
                                      where ejes.CodEjeEstrategico.HasValue
                                      select new EjeEstrategico {
                                        Nombre = "Eje " + ejes.CodEjeEstrategico.Value + ": " + ejes.NombreEjeEstrategico,
                                        Descripcion = ejes.DescripcionEjeEstrategico,
                                        Id = ejes.CodEjeEstrategico.Value
                                      }).Distinct().OrderBy(x=>x.Nombre).ToList();
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


    [HttpGet("GetObjetivosGeneralesXEjeEstrategico")]
    public ModelPlanData GetObjetivosGeneralesXEjeEstrategico(string idEje)
    {
      ModelPlanData objReturn = new ModelPlanData();
      try {
        var aux = new PlanNacionalBLL(_connection);
        int idEjeEstrategico = Convert.ToInt32(idEje);
        objReturn.ObjetivosPorEjeEstrategico = aux.ObtenerObjetivosPorEjeEstrategico(idEjeEstrategico);
        objReturn.Status = true;
        return objReturn;
      }
      catch (Exception exception) {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }
    }


    [HttpGet("GetEntidadesPlanNacional")]
    public List<InfoEntidad> GetEntidadesPlanNacional()
    {
      List<InfoEntidad> objReturn = new List<InfoEntidad>();
      try {
        var aux = new PlanNacionalBLL(_connection);
        objReturn = aux.ObtenerEntidadesPlanNacional();
        return objReturn;
      }
      catch (Exception) {
        return objReturn;
      }
    }

    [HttpGet("GetIndicadoresXIdObjetivoEspecifico")]
    public List<IndicadorObjetivoEspecifico> GetIndicadoresXIdObjetivoEspecifico(string idEje, string idObjetivoEstrategico, string idObjetivoEspecifico)
    {
      List<IndicadorObjetivoEspecifico> objReturn = new List<IndicadorObjetivoEspecifico>();
      try {
        var aux = new PlanNacionalBLL(_connection);
        if (int.TryParse(idEje, out int idEjeEstrategico) && int.TryParse(idObjetivoEstrategico, out int idObjEstrategico) && int.TryParse(idObjetivoEspecifico, out int idObjEspecifico)) {
          objReturn = aux.ObtenerIndicadoresXIdObjetivoEspecifico(idEjeEstrategico, idObjEstrategico, idObjEspecifico);
        }
        return objReturn;
      }
      catch (Exception) {
        return objReturn;
      }
    }



    }
}
