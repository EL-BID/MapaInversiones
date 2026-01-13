using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Entidad;
//using PlataformaTransparencia.Modelos.OrganismoFinanciador;
using PlataformaTransparencia.Modelos.Presupuesto;
using System.Collections.Generic;

namespace PlataformaTransparencia.Negocios.Interfaces
{
  public interface IPresupuestoBLL
  {
    public InfoConsolidadoPresupuesto GetConsolidadoPeriodos(int anyo);

    public List<InfoConsolidadoPresupuesto> GetRecursosPerfinalidad(int annio);

    public List<InfoPerSector> ObtenerSectoresPerNombre(int anyo);

    public List<InfograficoFuentes_Nivel_1> ObtDistribucionBySectorFuentes(int annio, string opcion, string tipo);

    public List<itemGenerico> ObtenerOrganismosPerNombre(int anyo);

    public List<infograficoEntidadPerPresup> GetInfograficoPerEntidad(int annio, string id, string tipo);

    public List<InfoConsolidadoPresupuesto> ObtenerGastoEntidades(int anyo, List<string> filtro_sec);

    public List<InformationGraphics> ObtenerEntidadesPerNombre(int anyo);

    public List<InfoConsolidadoPresupuesto> ObtenerGastoPerTiempoEntidades(int anyo, List<string> filtro_sec);

    public List<itemGenPresupuesto> GetInfograficoPerProyecto(int annio, string id);



  }
}
