using PlataformaTransparencia.Modelos.Proyectos;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Location
{
  public class LocationProfileDetailData : RespuestaContratoBase
  {
    public LocationProfileGeneralInformation GeneralInformacion { get; set; ***REMOVED***
    public List<LocationProfileChild> LocationChilds { get; set; ***REMOVED*** = new List<LocationProfileChild>();
    public List<LocationProfileChild> LocationsRelated { get; set; ***REMOVED*** = new List<LocationProfileChild>();
    public List<InfoProyectos> ProjectsByLocation { get; set; ***REMOVED*** = new List<InfoProyectos>();
    public List<InfoProjectPerSector> ProjectsBySector { get; set; ***REMOVED*** = new List<InfoProjectPerSector>();
    public List<InfoProjectPerSector> ProjectsByFunctionalGroup { get; set; ***REMOVED*** = new List<InfoProjectPerSector>();
    public List<InfoProyectos> ProjectsByFunctional { get; set; ***REMOVED*** = new List<InfoProyectos>();
    public List<TotalProjectByState> TotalProjectsByState { get; set; ***REMOVED*** = new List<TotalProjectByState>();
    //public List<InfoProyectos> ProjectsByVillage { get; set; ***REMOVED*** = new List<InfoProyectos>();
  ***REMOVED***

  public class TotalProjectByState
  {
    public string StateName { get; set; ***REMOVED***
    public int TotalProjects { get; set; ***REMOVED***
  ***REMOVED***

  public class LocationProfileGeneralInformation
  {
    //public int TotalNewsProjects { get; set; ***REMOVED***
    //public int TotalContinuityProjects { get; set; ***REMOVED***
    public string UrlImage { get; set; ***REMOVED***
    public bool IsChildLocationEnable { get; set; ***REMOVED*** = false;
    public string ChildLocationName { get; set; ***REMOVED*** = string.Empty;
    public string ParentLocationName { get; set; ***REMOVED*** = string.Empty;
  ***REMOVED***

  public class LocationProfileChild
  {
    public string Id { get; set; ***REMOVED***
    public string Name { get; set; ***REMOVED***
    public int TotalProjects { get; set; ***REMOVED***
  ***REMOVED***

  //public class LocationProfileProjects
  //{
  //  public string Id { get; set; ***REMOVED***
  //  public string Name { get; set; ***REMOVED***
  //  public string SnipCode { get; set; ***REMOVED***
  //  public string Sector { get; set; ***REMOVED***
  //  public decimal EstimatedInitialCost { get; set; ***REMOVED***
  //  public decimal ExecutionValue { get; set; ***REMOVED***
  //***REMOVED***
 ***REMOVED***
