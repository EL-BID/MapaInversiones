using System.Collections.Generic;
using System.Threading.Tasks;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Modelos.Reportes;

namespace PlataformaTransparencia.Negocios.Interfaces
{
    public interface IConsultasComunes
    {
        public List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> ObtenerProyectosConsistentes2(FiltroBusquedaProyecto filtros);
        public List<InfoProyectos> ObtenerProyectosConsistentesMapListMode(FiltroBusquedaProyecto filtros, ref int page);
        public List<Infrastructura.DataModels.Proyecto> ObtenerProyectosConsistentes(FiltroBusquedaProyecto filtros);
        public Task<List<object>> ObtenerFiltrosGeograficosAsync();
        public string ObtenerKeyPorEstadoFiltro(FiltroBusquedaProyecto filtros, bool incluirOffset = false);
        public IEnumerable<InfoProyectos> ObtenerInfoProyectos3(FiltroBusquedaProyecto filtros);
        public List<InfoProyectos> ObtenerProyectosConsistentes_new(FiltroBusquedaProyecto filtros, int limite);
        public List<InfoProyectos> ObtenerProyectosConsistentesPorSectores(List<string> sectores, FiltroBusquedaProyecto filtros, int limite);
        public Task<RespuestaPoligonoTerritorial> ObtenerPoligonosDepartamentosAsync();
        public Task<RespuestaPoligonoTerritorial> ObtenerPoligonosMunicipiosAsync();
        public Task<RespuestaPoligonoTerritorial> ObtenerPoligonosRegionesAsync();
        public Task<List<InfoProyectos>> ObtenerProyectosNacionales(int id_sector);
        public Task<ProyectoPdf> ObtenerDataProyectoPdfAsync(int idProyecto);
  }
}