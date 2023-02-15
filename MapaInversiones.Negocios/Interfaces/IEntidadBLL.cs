using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;


namespace PlataformaTransparencia.Negocios.Entidad
{
    public interface IEntidadBLL
    {
        
        public List<infograficoPrograma> GetProgramasByEntidad(int annio, int codEntidad);

        public List<infograficoActividad> GetActividadByPrograma(int annio, string codEntidad, int codPrograma);

        public infograficoEntidad GetGastoByPrograma(int annio, int codEntidad, int codPrograma, string estado, string proceso);

        public List<InfoConsolidadoPresupuesto> ObtenerRecursosPerGrupos(int annio, int codEntidad);

***REMOVED***
***REMOVED***
