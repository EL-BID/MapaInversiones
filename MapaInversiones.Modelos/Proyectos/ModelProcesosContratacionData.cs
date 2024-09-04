using PlataformaTransparencia.Modelos.Contratos;
using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class ModelProcesosContratacionData : RespuestaContratoBase
    {
        public long CantidadTotalRegistros { get; set; }
        public List<ContratosData> Data { get; set; }
    }
}
