using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
  public class InformationGraphics
  {
    /// <summary>
    /// Descripcion del item que se va a sacar
    /// </summary>
    ///<remarks>Por ejemplo Nombre sector, Nombre recurso</remarks>
    ///
    public string labelGroup { get; set; ***REMOVED***
    public string label { get; set; ***REMOVED***
    public string label_inf { get; set; ***REMOVED***
    public string label_nivel4 { get; set; ***REMOVED***
    /// <summary>
    /// Porcentaje del item.
    /// </summary>
    public string value { get; set; ***REMOVED***
    /// <summary>
    /// Número de registros del item que se va a sacar
    /// </summary>
    public decimal rawValue { get; set; ***REMOVED***
    public decimal rawValue_asoc { get; set; ***REMOVED***
    public double rawValueDouble { get; set; ***REMOVED***
    public int rawValueInt { get; set; ***REMOVED***
    public decimal porcentaje { get; set; ***REMOVED***
  ***REMOVED***

  public class InfoRecursosEmergenciaPerObjeto : InformationGraphics
  {
    public string Anio { get; set; ***REMOVED*** = string.Empty;
  ***REMOVED***

  public class InfoPresupuesto : InformationGraphics
  {
    public decimal? totalGasto { get; set; ***REMOVED***
    public decimal? totalPresupuesto { get; set; ***REMOVED***
    public decimal? totalMH { get; set; ***REMOVED***
    public decimal? totalClasificacion { get; set; ***REMOVED***
    public decimal? totalClasePrograma { get; set; ***REMOVED***
    public decimal? totalEntidad { get; set; ***REMOVED***
    public decimal? totalProyectoActividad { get; set; ***REMOVED***
    public int annio { get; set; ***REMOVED***
    public string trimestre { get; set; ***REMOVED***
    public string clasificacion { get; set; ***REMOVED***
    public string entidad { get; set; ***REMOVED***
    public string clasePrograma { get; set; ***REMOVED***
    public string proyectoActividad { get; set; ***REMOVED***
    public int version { get; set; ***REMOVED***
    public string nombreVersion { get; set; ***REMOVED***


  ***REMOVED***

  public class InfoRecAsignadosPlan : InformationGraphics
  {
    public int? periodo { get; set; ***REMOVED***
  ***REMOVED***

  public class InfoEntidadesConsolida : InformationGraphics
  {
    public string id { get; set; ***REMOVED***

    public decimal asignado { get; set; ***REMOVED***

    public decimal avance { get; set; ***REMOVED***

    public double aporteObjetivo { get; set; ***REMOVED***
  ***REMOVED***

  public class InfoProjectPerSector : InformationGraphics
  {
    public string url_imagen { get; set; ***REMOVED***
    public int orden { get; set; ***REMOVED***
    public string alias { get; set; ***REMOVED***
    public int ordenGroup { get; set; ***REMOVED***

    public int idSector { get; set; ***REMOVED***
  ***REMOVED***
  public class InfoResourcesPerDepartment : InformationGraphics
  {
  ***REMOVED***
  public class InfoResourcesPerRegion : InformationGraphics
  {
  ***REMOVED***
  public class InfoResourcesPerSector : InformationGraphics
  {
  ***REMOVED***
  public class InfoProjectsPerEstado : InformationGraphics
  {

  ***REMOVED***
  public class projectsCarteraTrans : InformationGraphics
  {
  ***REMOVED***
  public class InfoTransferPerSector : InformationGraphics
  {
  ***REMOVED***
  public class InfoContratosPerAnyo : InformationGraphics
  {

  ***REMOVED***

  public class InfoSubsidiosPerDpto : InformationGraphics
  {

  ***REMOVED***

  public class InfoRecursosBonificacionesPerEmpleo : InformationGraphics
  {

  ***REMOVED***

  public class InfoFarmaciasPerGroup : InformationGraphics { ***REMOVED***

  public class InfoRecAsignadosPresupuesto : InformationGraphics
  {
    public int? periodo { get; set; ***REMOVED***

  ***REMOVED***

  public class InfoConsolidadoPresupuesto : InformationGraphics
  {
    public int periodo { get; set; ***REMOVED***
    public double? vigente { get; set; ***REMOVED***
    public double? aprobado { get; set; ***REMOVED***

    public double? ejecutado { get; set; ***REMOVED***

    public int Id { get; set; ***REMOVED***

    public string TipoGasto { get; set; ***REMOVED***

    public float? pagos { get; set; ***REMOVED***


***REMOVED***


    public class InfoPerSector : InformationGraphics
    {
        public int idSector { get; set; ***REMOVED***
        public string url_imagen { get; set; ***REMOVED***
        public int orden { get; set; ***REMOVED***
        public string alias { get; set; ***REMOVED***
        public int ordenGroup { get; set; ***REMOVED***
***REMOVED***
***REMOVED***
