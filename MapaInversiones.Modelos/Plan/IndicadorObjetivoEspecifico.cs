using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Plan
{
  public class IndicadorObjetivoEspecifico
  {
    public int IdIndicador { get; set; }
    public string Nombre { get; set; }
    public string AnioBase { get; set; }
    public double? ValorAnioBase { get; set; }
    public string UnidadEscala { get; set; }
    public double? Meta2023 { get; set; }
    public double? Meta2030 { get; set; }
    public double? Avance { get; set; }
  }
}
