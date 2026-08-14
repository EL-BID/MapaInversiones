using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Emprestitos
{
    public class itemProyecto
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Bpin { get; set; }

        public decimal? ValorInicial { get; set; }
        public decimal? ValorEjecutado { get; set; }

        public decimal? ValorFinanciado { get; set; }

        

    }
}
