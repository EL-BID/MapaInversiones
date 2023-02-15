using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Modelos.Proyectos;

namespace PlataformaTransparencia.Modelos
{
    public class ModelHomeData : RespuestaContratoBase
    {
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
        public List<Period> Periods {
            get { return periods; ***REMOVED***
            set { periods = value; ***REMOVED***
    ***REMOVED***
        private List<Period> periods = new List<Period>();

        public class Data
        {
            public string texto { get; set; ***REMOVED***
    ***REMOVED***


        public string cadenaBuscador { get; set; ***REMOVED***

        /// <summary>
        /// Arreglo con objetos representando el grafico de proyectos por sector en toda la historia. 
        /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
        /// </summary>
        public List<InfoProjectPerSector> ProjectsPerSector {
            get { return projectsPerSector; ***REMOVED***
            set { projectsPerSector = value; ***REMOVED***
    ***REMOVED***
        private List<InfoProjectPerSector> projectsPerSector = new List<InfoProjectPerSector>();


        /// <summary>
        /// Listado de proyectos a cargar en el inicio
        /// </summary>
        public List<InfoProyectos> ProyectosAprobados {
            get { return proyectosAprobados; ***REMOVED***
            set { proyectosAprobados = value; ***REMOVED***
    ***REMOVED***
        private List<InfoProyectos> proyectosAprobados = new List<InfoProyectos>();

        public List<InfoProyectos> ProyectosNacionales {
            get { return proyectosNacionales; ***REMOVED***
            set { proyectosNacionales = value; ***REMOVED***
    ***REMOVED***
        private List<InfoProyectos> proyectosNacionales = new List<InfoProyectos>();


        /// <summary>
        /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
        /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
        /// </summary>
        public List<InfoResourcesPerSector> ResourcesPerSector {
            get { return resourcesPerSector; ***REMOVED***
            set { resourcesPerSector = value; ***REMOVED***
    ***REMOVED***
        private List<InfoResourcesPerSector> resourcesPerSector = new List<InfoResourcesPerSector>();

        /// <summary>
        /// Arreglo con objetos conteniendo los tips a mostrar en datos consolidados de toda la historia
        /// </summary>
        public List<Fact> Facts {
            get { return facts; ***REMOVED***
            set { facts = value; ***REMOVED***
    ***REMOVED***
        private List<Fact> facts = new List<Fact>();

        /// <summary>
        /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
        /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%
        /// </summary>
        public List<InfoResourcesPerRegion> ResourcesPerRegion {
            get { return resourcesPerRegion; ***REMOVED***
            set { resourcesPerRegion = value; ***REMOVED***
    ***REMOVED***
        private List<InfoResourcesPerRegion> resourcesPerRegion = new List<InfoResourcesPerRegion>();

        /// <summary>
        /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
        /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
        /// </summary>
        public List<InfoResourcesPerDepartment> ResourcesPerDepartment {
            get { return resourcesPerDepartment; ***REMOVED***
            set { resourcesPerDepartment = value; ***REMOVED***
    ***REMOVED***
        private List<InfoResourcesPerDepartment> resourcesPerDepartment = new List<InfoResourcesPerDepartment>();


        /// <summary>
        /// Arreglo con hasta 3 de las más próximas sesiones de OCADs TODO REVISAR.
        /// </summary>
        public List<Object> Agenda {
            get { return agenda; ***REMOVED***
            set { agenda = value; ***REMOVED***
    ***REMOVED***
        private List<Object> agenda = new List<object>();

        /// <summary>
        /// Es un arreglo de objetos para armar el mapa. 
        /// </summary>
        public List<ConsolidatedDepartmentProjects> DepartmentProjectData {
            get { return departmentProjectData; ***REMOVED***
            set { departmentProjectData = value; ***REMOVED***
    ***REMOVED***
        private List<ConsolidatedDepartmentProjects> departmentProjectData = new List<ConsolidatedDepartmentProjects>();


        public List<ProyectoConsolidadoPorMunicipio> MunicipioProjectData {
            get { return municipioProjectData; ***REMOVED***
            set { municipioProjectData = value; ***REMOVED***
    ***REMOVED***
        private List<ProyectoConsolidadoPorMunicipio> municipioProjectData = new List<ProyectoConsolidadoPorMunicipio>();

        public List<InfoProyectos> ProyectoProjectData {
            get { return proyectoProjectData; ***REMOVED***
            set { proyectoProjectData = value; ***REMOVED***
    ***REMOVED***
        private List<InfoProyectos> proyectoProjectData = new List<InfoProyectos>();


        /// <summary>
        /// Es un arreglo de objetos para armar el mapa. 
        /// </summary>
        public List<ConsolidateRegionsProjects> RegionProjectData {
            get { return regionProjectData; ***REMOVED***
            set { regionProjectData = value; ***REMOVED***
    ***REMOVED***
        private List<ConsolidateRegionsProjects> regionProjectData = new List<ConsolidateRegionsProjects>();

        /// <summary>
        /// Propiedad de dodne se saca la fuete de la informacion 
        /// para la pagina.
        /// </summary>
        public DataCommonSections DataCommonSections {
            get { return dataCommonSections; ***REMOVED***
            set { dataCommonSections = value; ***REMOVED***
    ***REMOVED***
        private DataCommonSections dataCommonSections = new DataCommonSections();


        public List<InfoProyectos> priorityProjects { get; set; ***REMOVED***
        public List<InfoEntidadesConsolida> Entidades { get; set; ***REMOVED***

        public List<InfoRecAsignadosPlan> RecursosPerObjeto { get; set; ***REMOVED***

        public List<InfoRecAsignadosPlan> RecursosAsignados { get; set; ***REMOVED***

        public List<InformationGraphics> RecursosBySector { get; set; ***REMOVED***

        public List<ContratosConsolidado> Consolidados { get; set; ***REMOVED***

        public string MaxAnnioContratos { get; set; ***REMOVED***

        public string MaxAnnioEntidades { get; set; ***REMOVED***

***REMOVED***
***REMOVED***
