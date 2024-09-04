using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Emergencia
{
    public class ModelHomeEmergencias : RespuestaContratoBase
    {
        public ModelContratistaData resumenDatosContratos { get; set; }
        public List<InfoRecursosEmergenciaPerObjeto> InfoRecursosContratos { get; set; }
        public List<InfoRecursosEmergenciaPerObjeto> InfoRecursosProcesos { get; set; }
        public int TipoEmergencia { get; set; }
    }
}
