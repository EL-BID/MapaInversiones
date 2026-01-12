using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Negocios.Interfaces
{
    public interface ISectorBLL
    {
        public ModelLocationData ObtenerDatosLocalizacionSector(string sector_id);
        public ModelLocationData ObtenerProyectosAnioEstado(string sector_id, string idDepto, string? anio, string? estado);
        public ModelLocationData ObtenerProyectosAnios(string sector_id, string departamento_id);
        public ModelLocationData ObtenerProyectosAniosPerfilSector(string sector_id, string departamento_id);
        public ModelLocationData GetConsolidadoPeriodosSector(string sector_id, int anyo);
        public List<InfoParticipacionSector> GetConsolidadoGastosSector(string sector_id, int anyo);
        public ModelLocationData GetConsolidadoODSInversion(string sector_id, int pagina, int tamanopagina, string ods = null, string entidad = null);
        public ModelLocationData GetConsolidadoODSDesarrollo(string sector_id, int pagina, int tamanopagina, string ods=null, string entidad = null);
        public ModelLocationData GetODSInversion(string sector_id);
        public ModelLocationData GetODSDesarrollo(string sector_id);
        public ModelLocationData GetProyectosPotSector(string sector_id);


    }
}
