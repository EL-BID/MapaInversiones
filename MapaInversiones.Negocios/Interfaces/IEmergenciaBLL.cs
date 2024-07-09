using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Emergencia;
using ModelContratistaData = PlataformaTransparencia.Modelos.ModelContratistaData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PlataformaTransparencia.Modelos.Presupuesto;

namespace PlataformaTransparencia.Negocios.Interfaces
{
    public interface IEmergenciaBLL
    {
        public ModelHomeEmergencias ObtenerDatosModeloInicio(int tipoEmergencia);
        public ModelContratistaData ObtenerDatosContratosEmergencia(int tipoEmergencia, string Entidad = null);
        public ModelContratosData ObtenerInformacionContratosEmergeciasPorFiltros(ContratosFiltros filtros);

        public List<string> ObtenerEntidadGestionContratosPorNombre(ContratosFiltros filtro);

        public ModelContratistaData ObtenerDatosProcesosCanceladosEmergencia(int tipoEmergencia, string Entidad = null);
        public ModelInformacionContratos ObtenerInformacionProcesosCanceladosEmergenciaPorFiltros(ContratosFiltros filtros);

        

    }
}
