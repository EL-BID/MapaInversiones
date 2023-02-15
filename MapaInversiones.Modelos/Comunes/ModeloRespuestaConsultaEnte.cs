using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Comunes 
{
    public class ModeloRespuestaConsultaEnte : RespuestaContratoBase
    {
        public List<itemFilters> LstEntes { get; set; }
    }
}
