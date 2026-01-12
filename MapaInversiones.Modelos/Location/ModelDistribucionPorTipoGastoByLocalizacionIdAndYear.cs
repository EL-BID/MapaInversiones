using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Location
{
  public class ModelDistribucionPorTipoGastoByLocalizacionIdAndYear
  {
    public List<InfoParticipacionSector> Data { get; set; }
    public string FechaCorte { get; set; }
    public string FuenteDatos { get; set; }
  }
}
