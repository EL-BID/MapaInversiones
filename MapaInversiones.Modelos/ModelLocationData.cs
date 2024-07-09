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
        public string sectorPrincipal { get; set; }
        public string nomLocation { get; set; }
        public string descLocation { get; set; }
        //public string costoPromedio { get; set; }
        //public string duracionPromedio { get; set; }
        //public string cantProyectos { get; set; }

        /// <summary>
        /// id identificador 
        /// </summary>
        public string location_id { get; set; }
        /// <summary>
        /// tipo: DEPARTAMENTO/MUNICIPIO
        /// </summary>
        public string tipo { get; set; }
        public string parent_nombre { get; set; }
        public string parent_id { get; set; }
        public string parent_tipo { get; set; }

        public class cad_filtro
        {
            public string name { get; set; }
            public string parameter { get; set; }
            public string item_name { get; set; }
            public string item_value { get; set; }
        }
        /// <summary>
        /// Listado de proyectos a cargar en el inicio
        /// </summary>
        public List<InfoProyectos> ProyectosAprobados {
            get { return proyectosAprobados; }
            set { proyectosAprobados = value; }
        }
        private List<InfoProyectos> proyectosAprobados = new List<InfoProyectos>();


        public List<InfoProyectos> ProyectosEjecucion {
            get { return proyectosEjecucion; }
            set { proyectosEjecucion = value; }
        }
        private List<InfoProyectos> proyectosEjecucion = new List<InfoProyectos>();


        /// <summary>
        /// Listado de filtros
        /// </summary>
        public List<cad_filtro> Filtros {
            get { return filtros; }
            set { filtros = value; }
        }

        private List<cad_filtro> filtros = new List<cad_filtro>();

        /// <summary>
        /// Arreglo con objetos representando el grafico de proyectos por estado
        /// </summary>
        public List<InfoProjectsPerEstado> ProjectsPerEstado {
            get { return projectsPerEstado; }
            set { projectsPerEstado = value; }
        }
        private List<InfoProjectsPerEstado> projectsPerEstado = new List<InfoProjectsPerEstado>();

        /// <summary>
        /// Arreglo con objetos representando el grafico de proyectos por sector 
        /// </summary>
        public List<InfoProjectPerSector> ProjectsPerSectorGroup {
            get { return projectsPerSectorGroup; }
            set { projectsPerSectorGroup = value; }
        }
        private List<InfoProjectPerSector> projectsPerSectorGroup = new List<InfoProjectPerSector>();

        /// <summary>
        /// Proyecto Ejecutado más recientemente
        /// </summary>
        public InfoProyectoGen ProjectoRecienteEjec {
            get { return projectoRecienteEjec; }
            set { projectoRecienteEjec = value; }
        }

        private InfoProyectoGen projectoRecienteEjec = new InfoProyectoGen();
        /// <summary>
        /// informacion general
        /// </summary>
        public Modelos.Location.InfoLocationGen Encabezado {
            get { return encabezado; }
            set { encabezado = value; }
        }
        public InfoLocationSectorGen EncabezadoSector {
            get { return encabezadosector; }
            set { encabezadosector = value; }
        }

        private Modelos.Location.InfoLocationGen encabezado = new Modelos.Location.InfoLocationGen();
        private InfoLocationSectorGen encabezadosector = new InfoLocationSectorGen();
        private string costoProyectosDpto;
        public string CostoProyectosDpto {
            get { return costoProyectosDpto; }
            set { costoProyectosDpto = value; }
        }

        public class TableSectores
        {
            public string nombre { get; set; }
            public string valor { get; set; }
        }

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



        public List<InfoEntidadesConsolida> Entidades { get; set; }

        public List<InfoRecAsignadosPlan> RecursosPerObjeto { get; set; }

        public List<InfoRecAsignadosPlan> RecursosAsignados { get; set; }

        public List<InformationGraphics> RecursosBySector { get; set; }
        public List<Fact> Facts {
            get { return facts; }
            set { facts = value; }
        }
        private List<Fact> facts = new List<Fact>();


        public List<InfoLocationSectorGen> Datossectores
        {
            get { return datossectores; }
            set { datossectores = value; }
        }
        private List<InfoLocationSectorGen> datossectores = new List<InfoLocationSectorGen>();

        public List<string> Anios { get; set; }

    }

}
