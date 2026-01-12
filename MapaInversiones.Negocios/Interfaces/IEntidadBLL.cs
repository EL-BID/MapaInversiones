using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Presupuesto;
using System;
using System.Collections.Generic;
using System.Text;


namespace PlataformaTransparencia.Negocios.Entidad
{
    public interface IEntidadBLL
    {
        public InfoConsolidadoEntidad GetConsolidadoPeriodos(int anyo, string codEntidad);

        public List<infograficoPrograma> GetClasificacionesByEntidad(int annio, string codEntidad);

        public List<infografico_Nivel_1> GetProyectosInvByClasificacion(int annio, string CodEntidad, string codFinalidad);

        public List<itemProyectosPot> GetProyectosPotPerEntidad(string codEntidad);




    }
}
