using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.OrganismoFinanciador
{
  public class ModelDetalleFinanciador
  {
    public List<int> Anios { get; set; } = new();
    public string Nombre = string.Empty;
    public int Codigo;
    public int AnioSelected { get; set; }
  }
}
