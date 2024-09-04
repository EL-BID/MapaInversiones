using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Home
{
    public class InfoFuentesporAnnio
    {
        public int Anio { get; set; }
        public int CodigoFuente { get; set; }
        public string Fuente { get; set; }
        public double ValorVigente { get; set; }
        public double ValorAprobado { get; set; }
        public double Porcentaje { get; set; }
    }

}
