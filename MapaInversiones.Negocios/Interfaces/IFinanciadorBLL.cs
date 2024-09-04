using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.OrganismoFinanciador;
using PlataformaTransparencia.Modelos.Presupuesto;
using System.Collections.Generic;

namespace PlataformaTransparencia.Negocios.Interfaces
{
    public interface IFinanciadorBLL
    {
        public List<int> ObtenerAniosVistaPresupuesto();
        public List<int> ObtenerAniosVistaPresupuestoPorCodigoFinanciador(int id);
        public string ObtenerNombreOrganismoPorCodigoFinanciador(int id);
        public ModelDataConsolidadoFinanciador ObtenerConsolidadoOrganismosFinanciadoresPorAnioAndCodigoFuente(int anio, int codigoFuente);
        public List<ModelDataFinanciador> ObtenerOrganismosFinanciadoresPorAnioAndCodigoFuente(int anio, int codigoFuente);
        public ModelDataFinanciador ObtenerDataFinanciadorPorAnioAndCodigoFinanciador(int anio, int codigoOrganismoFinanciador);
        public List<InfograficoFuentes_Nivel_1> ObtenerDataGraficoSankeyPorAnioCodigoFinanciadorSector(int annio, int codigoOrganismoFinanciador, int sectorId);
        public List<itemGenPresupuesto> ObtenerDataProyectosPorAnioCodigoFinanciador(int annio, int codigoOrganismoFinanciador);
        public List<InfoConsolidadoPresupuesto> ObtenerRecursosGraficoTreeMapSectoresPorCodigoFinanciadorAnio(int annio, int codigoFinanciador);
    }
}
