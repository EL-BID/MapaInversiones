using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ContratistaData
    {
        public string Contratista { get; set; } // varchar(250)
        public string  Identificador       { get; set; } // varchar(50)
        public string Tipodocumento { get; set; } // varchar(32)
        public string Numerodocumento { get; set; } // varchar(100)
        public decimal? ValorTotalContratos { get; set; } // float
        public int?    NumContratos        { get; set; } // int
        public int?    NumProcesos         { get; set; } // int
        public string  MonedaContrato      { get; set; } // varchar(10)
        public string OrigenInformacion { get; set; } // varchar(20)
        public int CodigoOrigenInformacion { get; set; } // int
    }
}
