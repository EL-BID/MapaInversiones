using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Plan;

namespace PlataformaTransparencia.Modelos
{
  public class ModelPlanData : RespuestaContratoBase
  {
    public List<PlanNacionalEjeObjetivos> ObjetivosEjesEstrategicos { get; set; }
    public List<EjeEstrategico> EjesEstrategicos { get; set; }
    public List<ObjetivosGeneralPorEjeEstrategico> ObjetivosPorEjeEstrategico { get; set; }
  }
}
