using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class ModelContratosXEntidadData : RespuestaContratoBase
    {
        public long CantidadTotalRegistros { get; set; }
        public List<ContratosXEntidadData> Data { get; set; }

    }
}
