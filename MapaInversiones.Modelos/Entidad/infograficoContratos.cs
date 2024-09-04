using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoContratos
    {
        public string Id { get; set; }

        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public string moneda { get; set; }

        public string proveedor { get; set; }

        public string contratista { get; set; }

        public double valor_planeado { get; set; }

        public double valor_adjudicado { get; set; }

        
        public double valor_contratado { get; set; }

    }
}
