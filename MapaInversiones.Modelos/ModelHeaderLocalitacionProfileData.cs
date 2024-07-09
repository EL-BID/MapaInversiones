using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos
{
  public class ModelHeaderLocalitacionProfileData: RespuestaContratoBase
  {
    #region Header Data
    public string Name { get; set; } = string.Empty;
    public int NumberProjects { get; set; }
    /// <summary>
    /// Duración promedio de todos los proyectos de la localización
    /// </summary>
    public double AverageDurationProjects { get; set; }
    /// <summary>
    /// Costo promedio de todos los proyectos de la localización
    /// </summary>
    public decimal AverageCostProjects { get; set; }
    public string LocationId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsProvince { get; set; }
    public string UrlImage { get; set; }
    public List<itemFilters> Locations { get; set; }= new();
    //public List<itemFilters> LocationsRelated { get; set; }
    #endregion Header Data
  }
}
