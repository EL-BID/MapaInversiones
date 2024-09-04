using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoProcesos
    {
        public string Id { get; set; }
        public string Nombre { get; set; }


        public string Estado { get; set; }

        public string UrlProceso { get; set; }

        public double presupuesto { get; set; }

        public List<infograficoContratos> Detalles { get; set; }

        public infograficoProcesos()
        {
            Id = "";
            Nombre = "";
            Estado = "";
            presupuesto = 0;
            Detalles = new List<infograficoContratos>();


        }
    }
}
