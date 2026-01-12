using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoPrograma
    {
        public string codFinalidad { get; set; }
        public string CodClasificacion { get; set; }
        public string Clasificacion { get; set; }
        public string CodDetalleClasificacion { get; set; }
        public string DetalleClasificacion { get; set; }

        public double Vigente { get; set; }
        public double Ejecutado { get; set; }

        public double ValorComprometido { get; set; }

        public double ValorGiros { get; set; }

       


    }
}
