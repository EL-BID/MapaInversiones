using System;

namespace PlataformaTransparencia.Modelos
{
  public class infoFuentesRecursos
  {
    public int IdFuente { get; set; } // int
    public string NombreFuente { get; set; } // nvarchar(150)
    public string Descripcion { get; set; } // nvarchar(500)
    public DateTime FechaActualizacionFuente { get; set; } // datetime
    public string FechaActualizacion { get; set; } // datetime
  }
}
