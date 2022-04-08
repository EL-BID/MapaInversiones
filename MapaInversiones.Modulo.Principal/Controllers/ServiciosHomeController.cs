using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AngleSharp.Dom.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Entidad;
using PlataformaTransparencia.Negocios.Home;
using SolrNet;
using SolrNet.Commands.Parameters;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  [Route("api/servicioshome")]

  public class ServiciosHomeController : Controller
  {
    private readonly ILogger<ServiciosHomeController> _logger;
    private readonly TransparenciaDB _connection;
    private ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> _solr;
    private IConsolidadosNacionalesBLL consolidadosNacionales;
    private IEntidadBLL consolidadosEntidades;

    public ServiciosHomeController(ILogger<ServiciosHomeController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> solr, IConsolidadosNacionalesBLL consolidadosNacionalesBLL, IEntidadBLL entidadesbll)
    {
      _logger = logger;
      _connection = connection;
      _solr = solr;
      consolidadosNacionales = consolidadosNacionalesBLL;
      consolidadosEntidades = entidadesbll;

    }


    [HttpGet("GetRegAsignados")]
    public ModelHomeData GetRegAsignados()
    {
      ModelHomeData objReturn = new ModelHomeData();
      try {
        objReturn.RecursosAsignados = consolidadosNacionales.GetRecursosAsigByObjEstrategico(6);
        objReturn.Status = true;
        return objReturn;
      }
      catch (Exception exception) {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }




    }

    [HttpGet("GetRegAsignadosPerSector")]
    public ModelHomeData GetRegAsignadosPerSector()
    {
      ModelHomeData objReturn = new ModelHomeData();
      try {
        objReturn.RecursosBySector = consolidadosNacionales.GetRecursosAsigPerSectoresByObjEstrateg(6);
        objReturn.Status = true;
        return objReturn;
      }
      catch (Exception exception) {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }




    }


    [HttpGet("GetRegAsignadosPerSectorByIdObjetivoEstrategico")]
    public ModelHomeData GetRegAsignadosPerSectorByIdObjetivoEstrategico(string idObjetivoEstrategico)
    {
      ModelHomeData objReturn = new ModelHomeData();
      try {
        if (int.TryParse(idObjetivoEstrategico, out int idObjEstrategico)) {
          objReturn.RecursosBySector = consolidadosNacionales.GetRecursosAsigPerSectoresByObjEstrateg(idObjEstrategico);
          objReturn.Status = true;
        }
        return objReturn;
      }
      catch (Exception exception) {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }
    }


    [HttpGet("GetConsolidadoEntidadesByObjEspecifico")]
    public ModelHomeData GetConsolidadoEntidadesByObjEspecifico(int id_eje, int id)
    {
      ModelHomeData objReturn = new ModelHomeData();
      try {

        objReturn.Entidades = consolidadosNacionales.GetConsolidadoEntidadesByObjEspecifico(id_eje, id);
        objReturn.Status = true;

      }
      catch (Exception exception) {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;

      }

      return objReturn;
    }



    [HttpGet("GetHistoricoAvanceIndicador")]
    public ModelIndicador GetHistoricoAvanceIndicador(string idIndicador)
    {
      ModelIndicador objReturn = new ModelIndicador();
      try {
        var id = Convert.ToInt32(idIndicador);
        objReturn.AvancesIndicador = consolidadosNacionales.GetHistoricoAvanceIndicador(id);
        objReturn.Status = true;

      }
      catch (Exception exception) {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;

      }
      return objReturn;
    }



    [HttpGet("GetRecursosPerPlan")]
    public ModelHomeData GetRecursosPerPlan()
    {
      ModelHomeData objReturn = new ModelHomeData();
      try {
        objReturn.RecursosPerObjeto = consolidadosNacionales.ObtenerRecursosPerPlanGroup();
        objReturn.Status = true;
        return objReturn;
      }
      catch (Exception exception) {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }
    }

    /// <summary>
    /// sankey entidad
    /// </summary>
    /// <param name="codEntidad"></param>
    /// <returns></returns>
    [HttpGet("GetGraficaSankey")]
    public ModelGraficaSankey GetGraficaSankey(string codEntidad)
    {
      ModelGraficaSankey objReturn = new ModelGraficaSankey();
      try {
        objReturn.distribucionObjetivos = consolidadosEntidades.GetGraficaSankey(codEntidad);
        objReturn.Status = true;
        return objReturn;
      }
      catch (Exception exception) {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }

    }


    ///ejemplo llamado get varios parametros
    //[HttpGet("obtCiudades/{city}/{country}")]
    //public string obtCiudades(string city, string country)
    //{
    //    return "obtCiudades";
    //}

    //[HttpGet("obtPais/{continente}")]
    //public string obtPais(string continente)
    //{
    //    return "obtPais";
    //}
  }

}

