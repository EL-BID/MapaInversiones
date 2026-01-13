using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using System.Collections.Generic;

//namespace MapaInversiones.Negocios.Entidades.Models SGR.MapaRegalias.Negocios.Entidades

namespace PlataformaTransparencia.Modelos
{
  public class ModelPresupuestoEmergenciaData : RespuestaContratoBase
  {
    public string NombreEmergencia { get; set; }
    public string TipoEmergencia { get; set; }
    public string FechaActualizacionHacienda { get; set; }
    public string FechaActualizacionContratos { get; set; }
    public string FechaCorteFuenteHacienda { get; set; }
    public string FechaCorteFuenteContratos { get; set; }
    public string FechaCorteFuenteProyectos { get; set; }
    public string FechaCorteGastosIncentivos { get; set; }
    /// <summary>
    /// El valor del dinero recaudado en la historia.
    /// </summary>
    public decimal CollectedMoney { get; set; }
    /// <summary>
    /// El valor del dinero aprobado en la historia
    /// </summary>
    public decimal ApprovedMoney { get; set; }
    /// <summary>
    /// El número de proyectos aprobados en la historia
    /// </summary>
    public int ApprovedProjects { get; set; }
    /// <summary>
    /// El valor del dinero aprobado incluyendo otras fuentes no regalías
    /// </summary>
    public decimal ApprovedMoneyTotal { get; set; }
    /// <summary>
    /// Arreglo con los periodos TO DO revisar como se cargan.
    /// </summary>
    [Newtonsoft.Json.JsonProperty("periods")]
    public List<Period> Periods
    {
      get { return periods; }
      set { periods = value; }
    }
    private List<Period> periods = new();

    public class Data
    {
      public string texto { get; set; }
    }


    public string CadenaBuscador { get; set; }

    /// <summary>
    /// Arreglo con objetos representando el grafico de proyectos por sector en toda la historia. 
    /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
    /// </summary>
    public List<InfoProjectPerSector> ProjectsPerSector
    {
      get { return projectsPerSector; }
      set { projectsPerSector = value; }
    }
    private List<InfoProjectPerSector> projectsPerSector = new();


    /// <summary>
    /// Listado de proyectos a cargar en el inicio
    /// </summary>
    public List<InfoProyectos> ProyectosAprobados
    {
      get { return proyectosAprobados; }
      set { proyectosAprobados = value; }
    }
    private List<InfoProyectos> proyectosAprobados = new();

    public List<InfoProyectos> ProyectosNacionales
    {
      get { return proyectosNacionales; }
      set { proyectosNacionales = value; }
    }
    private List<InfoProyectos> proyectosNacionales = new();


    /// <summary>
    /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
    /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
    /// </summary>
    public List<InfoResourcesPerSector> ResourcesPerSector
    {
      get { return resourcesPerSector; }
      set { resourcesPerSector = value; }
    }
    private List<InfoResourcesPerSector> resourcesPerSector = new();

    /// <summary>
    /// Arreglo con objetos conteniendo los tips a mostrar en datos consolidados de toda la historia
    /// </summary>
    public List<Fact> Facts
    {
      get { return facts; }
      set { facts = value; }
    }
    private List<Fact> facts = new();

    /// <summary>
    /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
    /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%
    /// </summary>
    public List<InfoResourcesPerRegion> ResourcesPerRegion
    {
      get { return resourcesPerRegion; }
      set { resourcesPerRegion = value; }
    }
    private List<InfoResourcesPerRegion> resourcesPerRegion = new();

    /// <summary>
    /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
    /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
    /// </summary>
    public List<InfoResourcesPerDepartment> ResourcesPerDepartment
    {
      get { return resourcesPerDepartment; }
      set { resourcesPerDepartment = value; }
    }
    private List<InfoResourcesPerDepartment> resourcesPerDepartment = new();


    /// <summary>
    /// Arreglo con hasta 3 de las más próximas sesiones de OCADs TODO REVISAR.
    /// </summary>
    public List<object> Agenda
    {
      get { return agenda; }
      set { agenda = value; }
    }
    private List<object> agenda = new();

    /// <summary>
    /// Es un arreglo de objetos para armar el mapa. 
    /// </summary>
    public List<ConsolidatedDepartmentProjects> DepartmentProjectData
    {
      get { return departmentProjectData; }
      set { departmentProjectData = value; }
    }
    private List<ConsolidatedDepartmentProjects> departmentProjectData = new();


    public List<ProyectoConsolidadoPorMunicipio> MunicipioProjectData
    {
      get { return municipioProjectData; }
      set { municipioProjectData = value; }
    }
    private List<ProyectoConsolidadoPorMunicipio> municipioProjectData = new();

    public List<InfoProyectos> ProyectoProjectData
    {
      get { return proyectoProjectData; }
      set { proyectoProjectData = value; }
    }
    private List<InfoProyectos> proyectoProjectData = new();


    /// <summary>
    /// Es un arreglo de objetos para armar el mapa. 
    /// </summary>
    public List<ConsolidateRegionsProjects> RegionProjectData
    {
      get { return regionProjectData; }
      set { regionProjectData = value; }
    }
    private List<ConsolidateRegionsProjects> regionProjectData = new();

    /// <summary>
    /// Propiedad de dodne se saca la fuete de la informacion 
    /// para la pagina.
    /// </summary>
    public DataCommonSections DataCommonSections
    {
      get { return dataCommonSections; }
      set { dataCommonSections = value; }
    }
    private DataCommonSections dataCommonSections = new();

    /// <summary>
    /// grafica recursos x objeto gasto en ficha covid - presupuestado
    /// </summary>
    public List<InfoRecursosEmergenciaPerObjeto> RecursosPerObjeto
    {
      get { return recursosPerObjeto; }
      set { recursosPerObjeto = value; }
    }
    private List<InfoRecursosEmergenciaPerObjeto> recursosPerObjeto = new();

    /// <summary>
    /// grafica recursos x objeto gasto en ficha covid  - ejecutado
    /// </summary>
    public List<InfoRecursosEmergenciaPerObjeto> RecursosPerObjetoAvance
    {
      get { return recursosPerObjetoAvance; }
      set { recursosPerObjetoAvance = value; }
    }
    private List<InfoRecursosEmergenciaPerObjeto> recursosPerObjetoAvance = new();


    /// <summary>
    /// Tabla recursos de la administración central
    /// </summary>
    public List<InfoGraficoItemPrograma> RecursosAdministracionCentral
    {
      get { return recursosAdministracionCentral; }
      set { recursosAdministracionCentral = value; }
    }
    private List<InfoGraficoItemPrograma> recursosAdministracionCentral = new();


    /// <summary>
    /// Tabla recursos de la administración descentralizado
    /// </summary>
    public List<InfoGraficoItemPrograma> RecursosAdministracionDescentralizado
    {
      get { return recursosAdministracionDescentralizado; }
      set { recursosAdministracionDescentralizado = value; }
    }
    private List<InfoGraficoItemPrograma> recursosAdministracionDescentralizado = new();


    public List<InfoGraficoItemPrograma> DetallePerObjetoGasto
    {
      get { return detallegasto; }
      set { detallegasto = value; }
    }
    private List<InfoGraficoItemPrograma> detallegasto = new();

    public InfoDonacionesGen DonacionesConsolidado
    {
      get { return donacionesConsolidado; }
      set { donacionesConsolidado = value; }
    }
    private InfoDonacionesGen donacionesConsolidado = new();


    public decimal GastoTotalDevengado { get; set; }

    public ModelContratistaData ResumenDatosContratos { get; set; }
    public string FechaActualizacionGastosIncentivos { get; set; }
    public List<InfoRecursosEmergenciaPerObjeto> InfoRecursosContratos { get; set; } = new ();
  }
}
