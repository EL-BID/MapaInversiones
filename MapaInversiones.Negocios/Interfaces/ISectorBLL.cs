using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Modelos;
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


    }
}
