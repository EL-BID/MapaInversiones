using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class ModelProjectProfile
    {
        public ModelProjectProfile()
        {
            projectInformation = new Project();
            Metrics = new List<MetricperYear>();
            Sources = new List<Sources>();
            Images = new List<Images>();
            FotosU = new List<ImagesUsuario>();
            OtherProjects = new List<Modelos.Project>();
            rol_participacion = new List<RolParticipa>();
            genero_participacion = new List<GenerosParticipacion>();
            medios_participacion = new List<MediosParticipacion>();
            tipo_comentario = new List<TiposComentario>();
            avanceFisicoFasePreInversion = new List<ModeloAvanceFinancieroPorComponenteProducto>();
            avanceFisicoFaseInversion = new List<ModeloAvanceFinancieroPorComponenteProducto>();
            periodos_fuentes = new List<Period>();
            componentes_proy = new List<ComponentesProy>();
            actores_proy = new List<itemActores>();
            entregables = new List<itemEntregable>();
    ***REMOVED***
        /// <summary>
        /// Es el id del proyecto. 
        /// </summary>
        public int idproject { get; set; ***REMOVED***

        public string urlAuditoriaVisible { get; set; ***REMOVED***

        public string urlReporteEmpalme { get; set; ***REMOVED***

        private Project projectInformation;
        /// <summary>
        /// Es la informacion del proyecto.
        /// </summary>
        public Project ProjectInformation {
            get { return projectInformation; ***REMOVED***
            set { projectInformation = value; ***REMOVED***
    ***REMOVED***

        /// <summary>
        /// El avance del proyecto de 0 a 100
        /// </summary>
        public decimal Progress { get; set; ***REMOVED***
        /// <summary>
        /// Las metricas del proyecto.
        /// </summary>
        public decimal Financial_progress { get; set; ***REMOVED***
        public List<MetricperYear> Metrics { get; set; ***REMOVED***
        /// <summary>
        /// Las fuentes de financiacion
        /// </summary>
        public List<Sources> Sources { get; set; ***REMOVED***
        /// <summary>
        /// La galería de imagenes
        /// </summary>
        public List<Images> Images { get; set; ***REMOVED***
        /// <summary>
        /// Hasta cuatro proyectos del mismo OCAD, del mismo sector idealmente si no cualquier sector.
        ///<remarks>Llamar un metodo de negocio y cargar solo el nombre y la localizacion por ocads</remarks>
        /// </summary>
        public List<Modelos.Project> OtherProjects { get; set; ***REMOVED***
        /// <summary>
        /// Propiedad de dodne se saca la fuete de la informacion 
        /// para la pagina.
        /// </summary>
        public DataCommonSections DataCommonSections {
            get { return dataCommonSections; ***REMOVED***
            set { dataCommonSections = value; ***REMOVED***
    ***REMOVED***

        public string ControlCiudadano { get; set; ***REMOVED***

        //Galeria de fotos de usuarios
        public List<ImagesUsuario> FotosU { get; set; ***REMOVED***

        private DataCommonSections dataCommonSections = new DataCommonSections();

        public string id_usu_participa { get; set; ***REMOVED***
        public string nom_usu_participa { get; set; ***REMOVED***
        public List<RolParticipa> rol_participacion { get; set; ***REMOVED***
        public List<GenerosParticipacion> genero_participacion { get; set; ***REMOVED***
        public List<MediosParticipacion> medios_participacion { get; set; ***REMOVED***

        public List<TiposComentario> tipo_comentario { get; set; ***REMOVED***

        public string error_msg { get; set; ***REMOVED***

        public List<ModeloAvanceFinancieroPorComponenteProducto> avanceFisicoFasePreInversion { get; set; ***REMOVED***
        public List<ModeloAvanceFinancieroPorComponenteProducto> avanceFisicoFaseInversion { get; set; ***REMOVED***

        public List<Period> periodos_fuentes { get; set; ***REMOVED***

        public List<ComponentesProy> componentes_proy { get; set; ***REMOVED***

        public List<itemActores> actores_proy { get; set; ***REMOVED***
        public List<itemEntregable> entregables { get; set; ***REMOVED***
***REMOVED***
***REMOVED***
