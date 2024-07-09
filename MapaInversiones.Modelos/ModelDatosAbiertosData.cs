using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos 
{
    public class ModelDatosAbiertosData : RespuestaContratoBase
    {
        public List<infoFuentesRecursos> FuentesRecursos { get; set; }
    }
}
