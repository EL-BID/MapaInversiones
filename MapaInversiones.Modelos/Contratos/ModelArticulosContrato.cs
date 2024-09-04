using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ModelArticulosContrato : RespuestaContratoBase
    {
        public int CantidadTotalRegistros { get; set; }

        public List<ArticulosContrato> listArticulos;

        public ModelArticulosContrato()
        {

            CantidadTotalRegistros = 0;
            listArticulos = new List<ArticulosContrato>();
        }
    }
}
