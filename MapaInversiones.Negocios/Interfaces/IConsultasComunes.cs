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
        /// <summary>
        /// Retorna proyectos que pasan los filtros pero NO tienen georreferenciación exacta
        /// (no aparecen en Georreferenciacion). Cada proyecto trae Geography poblada con el
        /// centroide de su Comuna/Corregimiento asignado y IsApproximate=true.
        /// </summary>
        /// <param name="filtros">Mismos filtros usados en ObtenerInfoProyectos3.</param>
        /// <param name="idsExcluidos">Ids de proyectos que ya se resolvieron con geo exacta y no deben duplicarse.</param>
        public List<InfoProyectos> ObtenerInfoProyectosAproximados(FiltroBusquedaProyecto filtros, List<int> idsExcluidos);
        public List<InfoProyectos> ObtenerProyectosConsistentes_new(FiltroBusquedaProyecto filtros, int limite);
        public List<InfoProyectos> ObtenerProyectosConsistentesPorSectores(List<string> sectores, FiltroBusquedaProyecto filtros, int limite);
        public Task<RespuestaPoligonoTerritorial> ObtenerPoligonosDepartamentosAsync();
        public Task<RespuestaPoligonoTerritorial> ObtenerPoligonosMunicipiosAsync();
        public Task<RespuestaPoligonoTerritorial> ObtenerPoligonosRegionesAsync();
        public Task<List<InfoProyectos>> ObtenerProyectosNacionales(int id_sector);
        public Task<ProyectoPdf> ObtenerDataProyectoPdfAsync(int idProyecto);
  }
}