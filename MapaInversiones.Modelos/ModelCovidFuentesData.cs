using PlataformaTransparencia.Modelos.Presupuesto;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos
{
  public class ModelCovidFuentesData : RespuestaContratoBase
  {
    public List<InfograficoFuentePrograma> distribucionItem = new();
  }
}
