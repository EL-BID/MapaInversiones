using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ModelNombreEntidad : RespuestaContratoBase
    {
        public List<string> Nombre { get; set; }
    }
}
