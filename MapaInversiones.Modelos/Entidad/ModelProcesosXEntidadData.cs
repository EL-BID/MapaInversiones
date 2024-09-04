using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class ModelProcesosXEntidadData : RespuestaContratoBase
    {
        public long CantidadTotalRegistros { get; set; }
        public List<ProcesosXEntidadData> Data { get; set; }

    }
}
