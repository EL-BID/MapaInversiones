using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ModelContratosAnios : RespuestaContratoBase
    {
        public List<AnioContrato> Detalles { get; set; }
    }
}
