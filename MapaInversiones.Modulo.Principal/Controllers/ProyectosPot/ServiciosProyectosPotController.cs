using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using PlataformaTransparencia.Modelos.Location;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  [Route("api/serviciosproyectospot")]
  public class ServiciosProyectosPotController : Controller
  {
    /// <summary>
    /// Servicio para la busqueda en el mapa. 
    /// </summary>
    /// <returns>Retorna el modelo de busqueda</returns>
    /// 
    private IConsultasComunes ConsultasComunes;
    private readonly IBusquedasProyectosBLL BusquedasProyectosBLL;
    private IConsolidadosNacionalesBLL ConsolidadosNacionales;

    // Methods
    public ServiciosProyectosPotController(IConsultasComunes consultasComunes, IBusquedasProyectosBLL busquedasProyectosBLL, IConsolidadosNacionalesBLL consolidadosNacionales)
    {
      ConsultasComunes = consultasComunes;
      BusquedasProyectosBLL = busquedasProyectosBLL;
      ConsolidadosNacionales = consolidadosNacionales;
    }


    [HttpGet("listadoProyectosInversion")]
    public List<InfoProyectos> listadoProyectosInversion(string idproyectopot)
    {
      return BusquedasProyectosBLL.ObtenerListadoProyectosPry(idproyectopot);
    }


    [HttpGet("listadoproyectospotbyproyectoinversionid")]
    public ModelLocationProjectInv listadoproyectospotbyproyectoinversionid(string idproyectoInversion, string idEstado, int pagina, int tamanoPagina)
    {
      return BusquedasProyectosBLL.ObtenerListadoProyectosPotByProyectoInversionId(idproyectoInversion, idEstado, pagina,tamanoPagina);
    }

    [HttpGet("ListadoProyectosPotPaginadoByProyectoInversionIdEstadoIdHorizonte")]
    public ModelLocationProjectInv ListadoProyectosPotPaginadoByProyectoInversionIdEstadoIdHorizonte(string idproyectoInversion, string idEstado, string horizonte, int pagina, int tamanoPagina)
    {
      return BusquedasProyectosBLL.ObtenerListadoProyectosPotByProyectoInversionIdEstadoHorizonte(idproyectoInversion, idEstado, horizonte, pagina, tamanoPagina);
    }

  }

}
