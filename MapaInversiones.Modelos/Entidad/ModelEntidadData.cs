using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Modelos.Presupuesto;
using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class ModelEntidadData : RespuestaContratoBase
    {
        public string Nombre { get; set; }
        public string Codigo { get; set; }

        public string UrlImagen { get; set; }

        public List<Period> periodos { get; set; }

        public InfoConsolidadoEntidad InfoConsolidado { get; set; }

        public List<infograficoPrograma> InfoProgramas { get; set; }

        public List<infografico_Nivel_1> DetalleProyectos { get; set; }

        public List<itemProyectosPot> ProyectosPot { get; set; }

    }

}
