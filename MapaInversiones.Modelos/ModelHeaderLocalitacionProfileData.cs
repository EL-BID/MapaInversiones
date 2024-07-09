using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos
{
  public class ModelHeaderLocalitacionProfileData: RespuestaContratoBase
  {
    #region Header Data
    public string Name { get; set; ***REMOVED*** = string.Empty;
    public int NumberProjects { get; set; ***REMOVED***
    /// <summary>
    /// Duración promedio de todos los proyectos de la localización
    /// </summary>
    public double AverageDurationProjects { get; set; ***REMOVED***
    /// <summary>
    /// Costo promedio de todos los proyectos de la localización
    /// </summary>
    public decimal AverageCostProjects { get; set; ***REMOVED***
    public string LocationId { get; set; ***REMOVED*** = string.Empty;
    public string Type { get; set; ***REMOVED*** = string.Empty;
    public bool IsProvince { get; set; ***REMOVED***
    public string UrlImage { get; set; ***REMOVED***
    public List<itemFilters> Locations { get; set; ***REMOVED***= new();
    //public List<itemFilters> LocationsRelated { get; set; ***REMOVED***
    #endregion Header Data
  ***REMOVED***
***REMOVED***
