using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Home
{
    public class InfoOrganismosFinan
    {
        public int Anio { get; set; }
        public int CodigoOrganismoFinanciador { get; set; }
        public string OrganismoFinanciador { get; set; }
        public double ValorVigente { get; set; }
        public double ValorAprobado { get; set; }
        public double NumeroProyectos { get; set; }
    }
}
