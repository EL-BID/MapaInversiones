using PlataformaTransparencia.Modelos.Proyectos;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Location
{
  public class LocationProfileDetailData : RespuestaContratoBase
  {
    public LocationProfileGeneralInformation GeneralInformacion { get; set; }
    public List<LocationProfileChild> LocationChilds { get; set; } = new List<LocationProfileChild>();
    public List<LocationProfileChild> LocationsRelated { get; set; } = new List<LocationProfileChild>();
    public List<InfoProyectos> ProjectsByLocation { get; set; } = new List<InfoProyectos>();
    public List<InfoProjectPerSector> ProjectsBySector { get; set; } = new List<InfoProjectPerSector>();
    public List<InfoProjectPerSector> ProjectsByFunctionalGroup { get; set; } = new List<InfoProjectPerSector>();
    public List<InfoProyectos> ProjectsByFunctional { get; set; } = new List<InfoProyectos>();
    public List<TotalProjectByState> TotalProjectsByState { get; set; } = new List<TotalProjectByState>();
    //public List<InfoProyectos> ProjectsByVillage { get; set; } = new List<InfoProyectos>();
  }

  public class TotalProjectByState
  {
    public string StateName { get; set; }
    public int TotalProjects { get; set; }
  }

  public class LocationProfileGeneralInformation
  {
    //public int TotalNewsProjects { get; set; }
    //public int TotalContinuityProjects { get; set; }
    public string UrlImage { get; set; }
    public bool IsChildLocationEnable { get; set; } = false;
    public string ChildLocationName { get; set; } = string.Empty;
    public string ParentLocationName { get; set; } = string.Empty;
  }

  public class LocationProfileChild
  {
    public string Id { get; set; }
    public string Name { get; set; }
    public int TotalProjects { get; set; }
  }

  //public class LocationProfileProjects
  //{
  //  public string Id { get; set; }
  //  public string Name { get; set; }
  //  public string SnipCode { get; set; }
  //  public string Sector { get; set; }
  //  public decimal EstimatedInitialCost { get; set; }
  //  public decimal ExecutionValue { get; set; }
  //}
 }
