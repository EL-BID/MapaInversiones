using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ContratistaData
    {
        public string Contratista { get; set; } // varchar(250)
        public string  Identificador       { get; set; } // varchar(50)
        public double? ValorTotalContratos { get; set; } // float
        public int?    NumContratos        { get; set; } // int
        public int?    NumProcesos         { get; set; } // int
        public string  MonedaContrato      { get; set; } // varchar(10)
        public string OrigenInformacion { get; set; } // varchar(20)
    }
}
