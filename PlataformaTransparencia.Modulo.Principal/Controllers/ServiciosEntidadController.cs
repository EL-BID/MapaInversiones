using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Entidad;
using SolrNet;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  [Route("api/serviciosentidad")]
  public class ServiciosEntidadController : Controller
  {
    private readonly ILogger<ServiciosPlanController> _logger;
    private readonly TransparenciaDB _connection;
    private ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> _solr;
    private IEntidadBLL consolidadosEntidades;
        public ServiciosEntidadController(ILogger<ServiciosPlanController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> solr,IEntidadBLL entidadesbll)
    {
      _logger = logger;
      _connection = connection;
      _solr = solr;
      consolidadosEntidades = entidadesbll;

    }


    [HttpGet("GetConsolidadoProgramasXCodEntidadAnio")]
    public ConsolidadoProgramasEntidad GetConsolidadoProgramasXCodEntidadAnio(string anio, string codEntidad)
    {
      ConsolidadoProgramasEntidad objReturn = new ConsolidadoProgramasEntidad();
      try {
        EntidadContract entidad = new EntidadContract(_connection);
        return entidad.GetConsolidadoProgramasXCodEntidadAnio(anio, codEntidad);
      }
      catch (Exception exception) {

      }
      return objReturn;
    }
    [HttpGet("GetActividadesPlan")]
    public List<ProyectosPerfilEntidad> GetActividadesPlan(string tipoPrograma, string anioEntidad, string codEntidad)
    {
      List<ProyectosPerfilEntidad> objReturn = new List<ProyectosPerfilEntidad>();
      try {
                int.TryParse(anioEntidad, out int anio);
                objReturn= consolidadosEntidades.GetActividadesClasePrograma(tipoPrograma, anio, codEntidad);
      }
      catch (Exception) {

      }
      return objReturn;
    }

    [HttpGet("GetActividadesProgramaSustantivo")]
    public List<ProyectosProgramas> GetActividadesProgramaSustantivo(string tipoPrograma, string anioEntidad, string codEntidad)
    {
      List<ProyectosProgramas> objReturn = new List<ProyectosProgramas>();
      try {

           int.TryParse(anioEntidad, out int anio);
           objReturn = consolidadosEntidades.GetActividadesProgramaSustantivo(tipoPrograma, anio, codEntidad);

      }
      catch (Exception) {

      }
      return objReturn;
    }


    [HttpGet("GetGraficaIndicadores")]
    public List<TableIndicadorGraphics> GetGraficaIndicadores(string codIndicador, string anio, string codEntidad)
    {
      List<TableIndicadorGraphics> objReturn = new List<TableIndicadorGraphics>();
      try {
       
        int.TryParse(codIndicador, out int codigoIndicador);
        int.TryParse(anio, out int annio);
        objReturn=consolidadosEntidades.GetGraficaIndicadores(codigoIndicador, annio, codEntidad);
      }
      catch (Exception) {

      }
      return objReturn;
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

    }
}
