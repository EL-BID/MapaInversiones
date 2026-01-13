using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Entidad;


namespace PlataformaTransparencia.Negocios.Entidad
{
    public interface IEntidadBLL
    {
        
        public List<infograficoPrograma> GetProgramasByEntidad(int annio, string codEntidad);

        public List<infograficoActividad> GetActividadByPrograma(int annio, string codEntidad, int codPrograma);

        //public infograficoEntidad GetGastoByPrograma(int annio, int codEntidad, int codPrograma, string estado, string proceso);

        public List<InfoConsolidadoPresupuesto> ObtenerRecursosPerGrupos(int annio, int codEntidad);

        public List<string> GetAnniosPorEntidad(string codEntidad);
        public DatosEntidadAnio GetDatosEntidadPorAnnio(string anioEntidad, string codEntidad);

        public ModelEntidadData GetEntidadData(string codEntidad);

        public ModelContratosXEntidadData ObtenerInformacionContratosXEntidadPorFiltros(ContratosFiltros filtros);

        public itemGenInversion ObtenerRecursosPerTipo(int annio, string codEntidad, string tipo, string programa);

        public List<InfoConsolidadoPresupuesto> GetRecursosPorfinalidad(int annio, string codEntidad);

        public List<InfoConsolidadoPresupuesto> GetDistribucionGastoEntidad(int annio, string codEntidad);

        public List<ContratosXEntidadData> ObtenerProveedor(string Proveedor, string CodigoInstitucion);

        public List<InfoConsolidadoPresupuesto> GetProcesosPorTipo(int annio, string codEntidad);

        public List<ProcesosXEntidadData> GetProcesosPorAnio(int annio, string codEntidad);

    }
}
