using System;
using System.Collections.Generic;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Home;
using PlataformaTransparencia.Modelos.OrganismoFinanciador;
using PlataformaTransparencia.Modelos.Proyectos;

namespace PlataformaTransparencia.Modelos
{
    public class ModelHomeData : RespuestaContratoBase
    {
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
        public List<Period> Periods {
            get { return periods; }
            set { periods = value; }
        }
        private List<Period> periods = new List<Period>();

        public class Data
        {
            public string texto { get; set; }
        }


        public string cadenaBuscador { get; set; }

        /// <summary>
        /// Arreglo con objetos representando el grafico de proyectos por sector en toda la historia. 
        /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
        /// </summary>
        public List<InfoProjectPerSector> ProjectsPerSector {
            get { return projectsPerSector; }
            set { projectsPerSector = value; }
        }
        private List<InfoProjectPerSector> projectsPerSector = new List<InfoProjectPerSector>();


        /// <summary>
        /// Listado de proyectos a cargar en el inicio
        /// </summary>
        public List<InfoProyectos> ProyectosAprobados {
            get { return proyectosAprobados; }
            set { proyectosAprobados = value; }
        }
        private List<InfoProyectos> proyectosAprobados = new List<InfoProyectos>();

        public List<InfoProyectos> ProyectosNacionales {
            get { return proyectosNacionales; }
            set { proyectosNacionales = value; }
        }
        private List<InfoProyectos> proyectosNacionales = new List<InfoProyectos>();


        /// <summary>
        /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
        /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
        /// </summary>
        public List<InfoResourcesPerSector> ResourcesPerSector {
            get { return resourcesPerSector; }
            set { resourcesPerSector = value; }
        }
        private List<InfoResourcesPerSector> resourcesPerSector = new List<InfoResourcesPerSector>();

        /// <summary>
        /// Arreglo con objetos conteniendo los tips a mostrar en datos consolidados de toda la historia
        /// </summary>
        public List<Fact> Facts {
            get { return facts; }
            set { facts = value; }
        }
        private List<Fact> facts = new List<Fact>();

        /// <summary>
        /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
        /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%
        /// </summary>
        public List<InfoResourcesPerRegion> ResourcesPerRegion {
            get { return resourcesPerRegion; }
            set { resourcesPerRegion = value; }
        }
        private List<InfoResourcesPerRegion> resourcesPerRegion = new List<InfoResourcesPerRegion>();

        /// <summary>
        /// Arreglo con objetos representando el grafico de recursos por sector en toda la historia. 
        /// Dentro de los objetos rawValue representa el alto de las barras, siendo 100 el valor más alto disponible y 0 el 0%.
        /// </summary>
        public List<InfoResourcesPerDepartment> ResourcesPerDepartment {
            get { return resourcesPerDepartment; }
            set { resourcesPerDepartment = value; }
        }
        private List<InfoResourcesPerDepartment> resourcesPerDepartment = new List<InfoResourcesPerDepartment>();


        /// <summary>
        /// Arreglo con hasta 3 de las más próximas sesiones de OCADs TODO REVISAR.
        /// </summary>
        public List<Object> Agenda {
            get { return agenda; }
            set { agenda = value; }
        }
        private List<Object> agenda = new List<object>();

        /// <summary>
        /// Es un arreglo de objetos para armar el mapa. 
        /// </summary>
        public List<ConsolidatedDepartmentProjects> DepartmentProjectData {
            get { return departmentProjectData; }
            set { departmentProjectData = value; }
        }
        private List<ConsolidatedDepartmentProjects> departmentProjectData = new List<ConsolidatedDepartmentProjects>();


        public List<ProyectoConsolidadoPorMunicipio> MunicipioProjectData {
            get { return municipioProjectData; }
            set { municipioProjectData = value; }
        }
        private List<ProyectoConsolidadoPorMunicipio> municipioProjectData = new List<ProyectoConsolidadoPorMunicipio>();

        public List<InfoProyectos> ProyectoProjectData {
            get { return proyectoProjectData; }
            set { proyectoProjectData = value; }
        }
        private List<InfoProyectos> proyectoProjectData = new List<InfoProyectos>();


        /// <summary>
        /// Es un arreglo de objetos para armar el mapa. 
        /// </summary>
        public List<ConsolidateRegionsProjects> RegionProjectData {
            get { return regionProjectData; }
            set { regionProjectData = value; }
        }
        private List<ConsolidateRegionsProjects> regionProjectData = new List<ConsolidateRegionsProjects>();

        /// <summary>
        /// Propiedad de dodne se saca la fuete de la informacion 
        /// para la pagina.
        /// </summary>
        public DataCommonSections DataCommonSections {
            get { return dataCommonSections; }
            set { dataCommonSections = value; }
        }
        private DataCommonSections dataCommonSections = new DataCommonSections();


        public List<InfoProyectos> priorityProjects { get; set; }
        public List<InfoEntidadesConsolida> Entidades { get; set; }

        public List<InfoRecAsignadosPresupuesto> RecursosPerObjeto { get; set; }

        public List<InfoRecAsignadosPlan> RecursosAsignados { get; set; }

        public List<InformationGraphics> RecursosBySector { get; set; }

        public List<ContratosConsolidado> Consolidados { get; set; }

        public string MaxAnnioContratos { get; set; }

        public string MaxAnnioEntidades { get; set; }

        public int maxAnnioPresupuesto { get; set; }

        /// <summary>
        /// Arreglo con objetos representando el grafico de proyectos por sector - obras
        /// </summary>
        public List<InfoProjectPerSector> ProjectsPerSectorGroup
        {
            get { return projectsPerSectorGroup; }
            set { projectsPerSectorGroup = value; }
        }
        private List<InfoProjectPerSector> projectsPerSectorGroup = new List<InfoProjectPerSector>();


        public itemConteoProjects countOngoingProjects { get;set; }

        public InfoPresupuestoEncabezado valPresupuestoEncabezado { get; set; }

        public List<string> aniospresupuesto = new List<string>();

        public List<InfoFuentesporAnnio> fuentesporAnnios = new List<InfoFuentesporAnnio>();

        public InfoPresupuestoEncabezado contprocesoscontratos { get; set; }

        public List<InfoOrganismosFinan> OrganismosFinanciadores = new List<InfoOrganismosFinan>();

        public ModelDataConsolidadoFinanciador ConsolidadoOrganismoFinanciador { get; set; } = new();
    }
}
