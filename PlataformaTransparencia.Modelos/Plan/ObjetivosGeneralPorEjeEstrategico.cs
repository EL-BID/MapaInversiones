using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Plan
{
  public class ObjetivosGeneralPorEjeEstrategico
  {
    public int Id { get; set; } // int
    public string Nombre { get; set; } // varchar(max)
    public string Descripcion { get; set; } // varchar(max)
    public List<ObjetivoEspecifico> ObjetivoEspecifico { get; set; }
    public List<AlineacionOds> Ods { get; set; }
  }
  public class AlineacionOds
  {
    public int? CodOds { get; set; }
    public string Nombre { get; set; }
  }
}
