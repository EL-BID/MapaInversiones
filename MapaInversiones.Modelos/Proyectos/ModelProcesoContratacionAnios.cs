using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class ModelProcesoContratacionAnios : RespuestaContratoBase
    {
        public List<AnioProcesoContratacion> Detalles { get; set; }
    }
}
