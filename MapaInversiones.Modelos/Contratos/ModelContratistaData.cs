using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ModelContratistaData : RespuestaContratoBase
    {
        public List<ContratistaData> Data { get; set; }
        public string  Contratista { get; set; }
        public List<string> OrigenInformacion { get; set; }
        public List<ContratosConsolidado> Consolidados { get; set; }

    }
}
