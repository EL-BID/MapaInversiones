using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Plan
{
  public class InfoEntidad
  {
    public string CodEntidad { get; set; }
    public int Id { get; set; }
    public string Nombre { get; set; }
    public decimal TotalEjecutado { get; set; }
  }
}
