using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class itemClasificacion
    {
        public string idNivel_1 { get; set; }
        public string nomNivel_1 { get; set; }

        public string idNivel_2 { get; set; }

        public string nomNivel_2 { get; set; }

        public double? Vigente { get; set; }
        public double? Ejecutado { get; set; }

        public double? ValorComprometido { get; set; }

        public double? ValorGiros { get; set; }

    }
}
