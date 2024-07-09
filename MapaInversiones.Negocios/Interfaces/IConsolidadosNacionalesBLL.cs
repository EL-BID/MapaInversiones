using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using System.Collections.Generic;

namespace PlataformaTransparencia.Negocios.Interfaces
{
    public interface IConsolidadosNacionalesBLL
    {
        List<InfoProyectos> GetProyectosNacionales();
        List<InfoProyectos> GetProyectosNacionalesfiltro(string campo);
        List<InfoProjectPerSector> ObtenerCostoProyectosPorDepartamentoDadoSector(string sectorId);
        ModelContratistaData ObtenerDatosContratista(string ruc);
        ModelContratistaData ObtenerDatosContratos();
        ModelLocationData ObtenerDatosLocalizacionInicio(string location_id);
        ModelLocationData ObtenerDatosLocalizacionSector(string sector_id);
        ModelHomeData ObtenerDatosModeloInicio(bool esHome = true);
        Modelos.Location.InfoLocationGen ObtenerInfoLocation(FiltroBusquedaProyecto filtros);
        InfoLocationSectorGen ObtenerInfoLocationSectores(string sector);
        List<InfoProjectsPerEstado> ObtenerProyectosEstadoPorSector(string sectorId);
        List<InfoProjectPerSector> ObtenerProyectosPorDepartamentoDadoSector(string sectorId, List<Departamento> lstDepartamentos);
        List<InfoProjectsPerEstado> ObtenerProyectosPorEstado(FiltroBusquedaProyecto filtros);
        List<InfoProjectsPerEstado> ObtenerProyectosPorEstadoSector(FiltroBusquedaProyecto filtros);
        List<InfoProjectPerSector> ObtenerProyectosPorSector(List<DataModels.Proyecto> listProyectos);
        List<InfoProjectPerSector> ObtenerProyectosPorSectorGroup(FiltroBusquedaProyecto filtros);
        List<InfoResourcesPerDepartment> ObtenerRecursosPorDepartamento(List<DataModels.Proyecto> listProyectos);
        List<InfoResourcesPerRegion> ObtenerRecursosPorRegion(List<DataModels.Proyecto> listProyectos);
        List<InfoResourcesPerSector> ObtenerRecursosPorSector(List<DataModels.Proyecto> listProyectos);
    }
}