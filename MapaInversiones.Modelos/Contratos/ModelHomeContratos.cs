using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Emergencia
{
    public class ModelHomeContratos : RespuestaContratoBase
    {
        public ModelContratistaData resumenDatosContratos { get; set; }
        public List<InfoRecursosContratosPerObjeto> InfoRecursosContratos { get; set; }
        public List<InfoRecursosContratosPerObjeto> InfoRecursosProcesos { get; set; }
        public List<int?> annios { get; set; }
    }
}
