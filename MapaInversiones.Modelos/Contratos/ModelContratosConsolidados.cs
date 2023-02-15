using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ModelContratosConsolidados : RespuestaContratoBase
    {
        public List<ContratosConsolidado> Consolidados { get; set; }
        public string? Moneda { get; set; }
        public string? CodigoProceso { get; set; }

        public string? MaxYear { get; set; }

        public List<ContratosConsolidado> selectCon { get; set; }
    }
}
