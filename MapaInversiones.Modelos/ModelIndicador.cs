using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos
{
  public class ModelIndicador:RespuestaContratoBase
  {
    public List<ModelAvanceIndicador> AvancesIndicador { get; set; }
  }
}
