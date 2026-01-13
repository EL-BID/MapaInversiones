using System.Collections.Generic;
using System.Threading.Tasks;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Proyectos;

namespace PlataformaTransparencia.Negocios.Interfaces
{
  public interface IBusquedasProyectosBLL
  {
    public List<objectProjectsSearchMap> ObtenerPinesDeProyectosPorFiltro(FiltroBusquedaProyecto filtro, out decimal totalDineroAprobado, out int totalNumeroProyectosAprobados, out decimal totalDineroAprobadoOtrasFuentes);
    public List<objectProjectsSearchMap> ObtenerListadoDeProyectos(FiltroBusquedaProyecto filtro, out decimal valorTotalTodasFuentes, ref int page);
    public List<objectProjectsSearchMap> ObtenerInfograficos(FiltroBusquedaProyecto filtro, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias);
    public Task<List<object>> ObtenerFiltrosEspecificosParaProyectosAsync();
    public List<itemFuentes> GetFuentesByPeriodo(int id_proy, int idPeriodo);
    public List<ComponentesProy> GetActividadesByComponente(int id_proy, string cod_componente);
    public int ObtenerFotosUsuariosParaAprobarCant();
    public ModelDataProyecto ObtenerFotosUsuariosPerEstados(int estado, int page);
    public Task<List<ImagesUsuario>> ObtenerFotosUsuariosParaAprobarAsync();
    //public List<Item> ObtenerAniosFuentesFinanciacionPorProyecto(int id);
    public ModelProcesoContratacionAnios ObtenerAnniosProcesoContratacion(int? IdProyecto);
    public ModelProcesosContratacionData ObtenerInformacionProcesosContratacionPorFiltros(ProcesosContratacionFiltros filtro);

  }
}