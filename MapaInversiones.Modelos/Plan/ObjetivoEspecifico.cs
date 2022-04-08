using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Plan
{
  public class ObjetivoEspecifico
  {
    public int Id { get; set; } // int
    public string Nombre { get; set; } // varchar(max)

    public string Codigo { get; set; } // varchar(max)
    //public double Avance { get; set; }
  }
}
