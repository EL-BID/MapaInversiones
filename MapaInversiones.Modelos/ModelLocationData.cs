using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Location;
using PlataformaTransparencia.Modelos.Proyectos;

namespace PlataformaTransparencia.Modelos
{
    public class ModelLocationData : RespuestaContratoBase
    {
        /// <summary>
        /// Datos encabezado
        /// </summary>
        public string sectorPrincipal { get; set; ***REMOVED***
        public string nomLocation { get; set; ***REMOVED***
        public string descLocation { get; set; ***REMOVED***
        //public string costoPromedio { get; set; ***REMOVED***
        //public string duracionPromedio { get; set; ***REMOVED***
        //public string cantProyectos { get; set; ***REMOVED***

        /// <summary>
        /// id identificador 
        /// </summary>
        public string location_id { get; set; ***REMOVED***
        /// <summary>
        /// tipo: DEPARTAMENTO/MUNICIPIO
        /// </summary>
        public string tipo { get; set; ***REMOVED***
        public string parent_nombre { get; set; ***REMOVED***
        public string parent_id { get; set; ***REMOVED***
        public string parent_tipo { get; set; ***REMOVED***

        public class cad_filtro
        {
            public string name { get; set; ***REMOVED***
            public string parameter { get; set; ***REMOVED***
            public string item_name { get; set; ***REMOVED***
            public string item_value { get; set; ***REMOVED***
    ***REMOVED***
        /// <summary>
        /// Listado de proyectos a cargar en el inicio
        /// </summary>
        public List<InfoProyectos> ProyectosAprobados {
            get { return proyectosAprobados; ***REMOVED***
            set { proyectosAprobados = value; ***REMOVED***
    ***REMOVED***
        private List<InfoProyectos> proyectosAprobados = new List<InfoProyectos>();


        public List<InfoProyectos> ProyectosEjecucion {
            get { return proyectosEjecucion; ***REMOVED***
            set { proyectosEjecucion = value; ***REMOVED***
    ***REMOVED***
        private List<InfoProyectos> proyectosEjecucion = new List<InfoProyectos>();


        /// <summary>
        /// Listado de filtros
        /// </summary>
        public List<cad_filtro> Filtros {
            get { return filtros; ***REMOVED***
            set { filtros = value; ***REMOVED***
    ***REMOVED***

        private List<cad_filtro> filtros = new List<cad_filtro>();

        /// <summary>
        /// Arreglo con objetos representando el grafico de proyectos por estado
        /// </summary>
        public List<InfoProjectsPerEstado> ProjectsPerEstado {
            get { return projectsPerEstado; ***REMOVED***
            set { projectsPerEstado = value; ***REMOVED***
    ***REMOVED***
        private List<InfoProjectsPerEstado> projectsPerEstado = new List<InfoProjectsPerEstado>();

        /// <summary>
        /// Arreglo con objetos representando el grafico de proyectos por sector 
        /// </summary>
        public List<InfoProjectPerSector> ProjectsPerSectorGroup {
            get { return projectsPerSectorGroup; ***REMOVED***
            set { projectsPerSectorGroup = value; ***REMOVED***
    ***REMOVED***
        private List<InfoProjectPerSector> projectsPerSectorGroup = new List<InfoProjectPerSector>();

        /// <summary>
        /// Proyecto Ejecutado más recientemente
        /// </summary>
        public InfoProyectoGen ProjectoRecienteEjec {
            get { return projectoRecienteEjec; ***REMOVED***
            set { projectoRecienteEjec = value; ***REMOVED***
    ***REMOVED***

        private InfoProyectoGen projectoRecienteEjec = new InfoProyectoGen();
        /// <summary>
        /// informacion general
        /// </summary>
        public Modelos.Location.InfoLocationGen Encabezado {
            get { return encabezado; ***REMOVED***
            set { encabezado = value; ***REMOVED***
    ***REMOVED***
        public InfoLocationSectorGen EncabezadoSector {
            get { return encabezadosector; ***REMOVED***
            set { encabezadosector = value; ***REMOVED***
    ***REMOVED***

        private Modelos.Location.InfoLocationGen encabezado = new Modelos.Location.InfoLocationGen();
        private InfoLocationSectorGen encabezadosector = new InfoLocationSectorGen();
        private string costoProyectosDpto;
        public string CostoProyectosDpto {
            get { return costoProyectosDpto; ***REMOVED***
            set { costoProyectosDpto = value; ***REMOVED***
    ***REMOVED***

        public class TableSectores
        {
            public string nombre { get; set; ***REMOVED***
            public string valor { get; set; ***REMOVED***
    ***REMOVED***

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



        public List<InfoEntidadesConsolida> Entidades { get; set; ***REMOVED***

        public List<InfoRecAsignadosPlan> RecursosPerObjeto { get; set; ***REMOVED***

        public List<InfoRecAsignadosPlan> RecursosAsignados { get; set; ***REMOVED***

        public List<InformationGraphics> RecursosBySector { get; set; ***REMOVED***
        public List<Fact> Facts {
            get { return facts; ***REMOVED***
            set { facts = value; ***REMOVED***
    ***REMOVED***
        private List<Fact> facts = new List<Fact>();


***REMOVED***

***REMOVED***
