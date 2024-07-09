using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ModelInformacionContratos : RespuestaContratoBase
    {
        public long CantidadTotalRegistros { get; set; }

        public List<InformacionContratos> listInformacion;

        public ModelInformacionContratos()
        {

            CantidadTotalRegistros = 0;
            listInformacion = new List<InformacionContratos>();
        }
    
    }
}
