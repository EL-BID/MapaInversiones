using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using System.Collections.Generic;



namespace PlataformaTransparencia.Modelos
{
  public class ModelPresupuestoEmergenciaData : RespuestaContratoBase
  {
    public string NombreEmergencia { get; set; ***REMOVED***
    public string TipoEmergencia { get; set; ***REMOVED***
    public string FechaActualizacionHacienda { get; set; ***REMOVED***
    public string FechaActualizacionContratos { get; set; ***REMOVED***
    public string FechaCorteFuenteHacienda { get; set; ***REMOVED***
    public string FechaCorteFuenteContratos { get; set; ***REMOVED***
    public string FechaCorteFuenteProyectos { get; set; ***REMOVED***
    public string FechaCorteGastosIncentivos { get; set; ***REMOVED***
    /// <summary>
    /// El valor del dinero recaudado en la historia.
    /// </summary>
    public decimal CollectedMoney { get; set; ***REMOVED***
    /// <summary>
    /// El valor del dinero aprobado en la historia
    /// </summary>
    public decimal ApprovedMoney { get; set; ***REMOVED***
    /// <summary>
    /// El número de proyectos aprobados en la historia
    /// </summary>
    public int ApprovedProjects { get; set; ***REMOVED***
    /// <summary>
    /// El valor del dinero aprobado incluyendo otras fuentes no regalías
    /// </summary>
    public decimal ApprovedMoneyTotal { get; set; ***REMOVED***
    /// <summary>
    /// Arreglo con los periodos TO DO revisar como se cargan.
    /// </summary>
    [Newtonsoft.Json.JsonProperty("periods")]
    public List<Period> Periods
    {
      get { return periods; ***REMOVED***
      set { periods = value; ***REMOVED***
***REMOVED***
    private List<Period> periods = new();

    public class Data
    {
      public string texto { get; set; ***REMOVED***
***REMOVED***


    public string CadenaBuscador { get; set; ***REMOVED***

    /// <summary>
    /// Arreglo con objetos representando el grafico de proyectos por sector en toda la historia. 
    /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
    /// </summary>
    public List<InfoProjectPerSector> ProjectsPerSector
    {
      get { return projectsPerSector; ***REMOVED***
      set { projectsPerSector = value; ***REMOVED***
***REMOVED***
    private List<InfoProjectPerSector> projectsPerSector = new();


    /// <summary>
    /// Listado de proyectos a cargar en el inicio
    /// </summary>
    public List<InfoProyectos> ProyectosAprobados
    {
      get { return proyectosAprobados; ***REMOVED***
      set { proyectosAprobados = value; ***REMOVED***
***REMOVED***
    private List<InfoProyectos> proyectosAprobados = new();

    public List<InfoProyectos> ProyectosNacionales
    {
      get { return proyectosNacionales; ***REMOVED***
      set { proyectosNacionales = value; ***REMOVED***
***REMOVED***
    private List<InfoProyectos> proyectosNacionales = new();


    /// <summary>
    /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
    /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
    /// </summary>
    public List<InfoResourcesPerSector> ResourcesPerSector
    {
      get { return resourcesPerSector; ***REMOVED***
      set { resourcesPerSector = value; ***REMOVED***
***REMOVED***
    private List<InfoResourcesPerSector> resourcesPerSector = new();

    /// <summary>
    /// Arreglo con objetos conteniendo los tips a mostrar en datos consolidados de toda la historia
    /// </summary>
    public List<Fact> Facts
    {
      get { return facts; ***REMOVED***
      set { facts = value; ***REMOVED***
***REMOVED***
    private List<Fact> facts = new();

    /// <summary>
    /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
    /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%
    /// </summary>
    public List<InfoResourcesPerRegion> ResourcesPerRegion
    {
      get { return resourcesPerRegion; ***REMOVED***
      set { resourcesPerRegion = value; ***REMOVED***
***REMOVED***
    private List<InfoResourcesPerRegion> resourcesPerRegion = new();

    /// <summary>
    /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
    /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
    /// </summary>
    public List<InfoResourcesPerDepartment> ResourcesPerDepartment
    {
      get { return resourcesPerDepartment; ***REMOVED***
      set { resourcesPerDepartment = value; ***REMOVED***
***REMOVED***
    private List<InfoResourcesPerDepartment> resourcesPerDepartment = new();


    /// <summary>
    /// Arreglo con hasta 3 de las más próximas sesiones de OCADs TODO REVISAR.
    /// </summary>
    public List<object> Agenda
    {
      get { return agenda; ***REMOVED***
      set { agenda = value; ***REMOVED***
***REMOVED***
    private List<object> agenda = new();

    /// <summary>
    /// Es un arreglo de objetos para armar el mapa. 
    /// </summary>
    public List<ConsolidatedDepartmentProjects> DepartmentProjectData
    {
      get { return departmentProjectData; ***REMOVED***
      set { departmentProjectData = value; ***REMOVED***
***REMOVED***
    private List<ConsolidatedDepartmentProjects> departmentProjectData = new();


    public List<ProyectoConsolidadoPorMunicipio> MunicipioProjectData
    {
      get { return municipioProjectData; ***REMOVED***
      set { municipioProjectData = value; ***REMOVED***
***REMOVED***
    private List<ProyectoConsolidadoPorMunicipio> municipioProjectData = new();

    public List<InfoProyectos> ProyectoProjectData
    {
      get { return proyectoProjectData; ***REMOVED***
      set { proyectoProjectData = value; ***REMOVED***
***REMOVED***
    private List<InfoProyectos> proyectoProjectData = new();


    /// <summary>
    /// Es un arreglo de objetos para armar el mapa. 
    /// </summary>
    public List<ConsolidateRegionsProjects> RegionProjectData
    {
      get { return regionProjectData; ***REMOVED***
      set { regionProjectData = value; ***REMOVED***
***REMOVED***
    private List<ConsolidateRegionsProjects> regionProjectData = new();

    /// <summary>
    /// Propiedad de dodne se saca la fuete de la informacion 
    /// para la pagina.
    /// </summary>
    public DataCommonSections DataCommonSections
    {
      get { return dataCommonSections; ***REMOVED***
      set { dataCommonSections = value; ***REMOVED***
***REMOVED***
    private DataCommonSections dataCommonSections = new();

    /// <summary>
    /// grafica recursos x objeto gasto en ficha covid - presupuestado
    /// </summary>
    public List<InfoRecursosEmergenciaPerObjeto> RecursosPerObjeto
    {
      get { return recursosPerObjeto; ***REMOVED***
      set { recursosPerObjeto = value; ***REMOVED***
***REMOVED***
    private List<InfoRecursosEmergenciaPerObjeto> recursosPerObjeto = new();

    /// <summary>
    /// grafica recursos x objeto gasto en ficha covid  - ejecutado
    /// </summary>
    public List<InfoRecursosEmergenciaPerObjeto> RecursosPerObjetoAvance
    {
      get { return recursosPerObjetoAvance; ***REMOVED***
      set { recursosPerObjetoAvance = value; ***REMOVED***
***REMOVED***
    private List<InfoRecursosEmergenciaPerObjeto> recursosPerObjetoAvance = new();


    /// <summary>
    /// Tabla recursos de la administración central
    /// </summary>
    public List<InfoGraficoItemPrograma> RecursosAdministracionCentral
    {
      get { return recursosAdministracionCentral; ***REMOVED***
      set { recursosAdministracionCentral = value; ***REMOVED***
***REMOVED***
    private List<InfoGraficoItemPrograma> recursosAdministracionCentral = new();


    /// <summary>
    /// Tabla recursos de la administración descentralizado
    /// </summary>
    public List<InfoGraficoItemPrograma> RecursosAdministracionDescentralizado
    {
      get { return recursosAdministracionDescentralizado; ***REMOVED***
      set { recursosAdministracionDescentralizado = value; ***REMOVED***
***REMOVED***
    private List<InfoGraficoItemPrograma> recursosAdministracionDescentralizado = new();


    public List<InfoGraficoItemPrograma> DetallePerObjetoGasto
    {
      get { return detallegasto; ***REMOVED***
      set { detallegasto = value; ***REMOVED***
***REMOVED***
    private List<InfoGraficoItemPrograma> detallegasto = new();

    public InfoDonacionesGen DonacionesConsolidado
    {
      get { return donacionesConsolidado; ***REMOVED***
      set { donacionesConsolidado = value; ***REMOVED***
***REMOVED***
    private InfoDonacionesGen donacionesConsolidado = new();


    public decimal GastoTotalDevengado { get; set; ***REMOVED***

    public ModelContratistaData ResumenDatosContratos { get; set; ***REMOVED***
    public string FechaActualizacionGastosIncentivos { get; set; ***REMOVED***
    public List<InfoRecursosEmergenciaPerObjeto> InfoRecursosContratos { get; set; ***REMOVED*** = new ();
  ***REMOVED***
***REMOVED***
