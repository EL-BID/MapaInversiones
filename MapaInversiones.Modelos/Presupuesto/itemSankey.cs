using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public  class itemSankey
    {
        public string idNivel_1 { get; set; }
        public string nomNivel_1 { get; set; }

        public string idNivel_2 { get; set; }

        public string nomNivel_2 { get; set; }

        public string idNivel_3 { get; set; }

        public string nomNivel_3 { get; set; }

        public string idNivel_4 { get; set; }

        public string nomNivel_4 { get; set; }

        public decimal? Avance { get; set; }

        public decimal? Presupuesto { get; set; }
    }
}
