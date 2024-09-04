using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
   public class ModelContratosData : RespuestaContratoBase
    {
        public long CantidadTotalRegistros { get; set; }
        public List<ContratosData> Data { get; set; }

        public List<InfoContratosPerAnyo> ContratosPerAnyo { get; set; }

        public List<ContratosConsolidado> Consolidados { get; set; }

    }
}
