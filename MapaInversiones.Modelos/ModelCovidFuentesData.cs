using PlataformaTransparencia.Modelos.Presupuesto;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos
{
  public class ModelCovidFuentesData : RespuestaContratoBase
  {
    public List<InfograficoFuentes_Nivel_1> distribucionItem = new();

    public List<InfograficoFuentes_Nivel_1> distribucionEmergencia = new();

  }
}
