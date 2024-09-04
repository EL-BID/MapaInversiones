using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ContratosConsolidado
    {

		public int? Anio { get; set; } // int
		public string EstadoContrato { get; set; } // varchar(250)
		public string MonedaContrato { get; set; } // varchar(5)
		public double? ValorContratado { get; set; } // bigint
		public int? NroContratos { get; set; } // int
        public string OrigenInformacion { get; set; } // varchar(20)
        public int CodigoOrigenInformacion { get; set; } // int

    }
}
