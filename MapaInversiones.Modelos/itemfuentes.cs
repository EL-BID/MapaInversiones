using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class itemfuentes
    {
        public int IdProyecto { get; set; }
        public int IdFuenteFinanciacion { get; set; }
        public string FuenteFinanciacion { get; set; }
        public int IdOrganismoFinanciador { get; set; }
        public string OrganismoFinanciador { get; set; }
        public decimal ValorVigente { get; set; }
        public decimal ValorEjecutado { get; set; }
    }
}
