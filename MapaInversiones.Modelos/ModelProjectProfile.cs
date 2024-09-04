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
        }
        /// <summary>
        /// Es el id del proyecto. 
        /// </summary>
        public int idproject { get; set; }

        public string urlAuditoriaVisible { get; set; }

        public string urlReporteEmpalme { get; set; }

        private Project projectInformation;
        /// <summary>
        /// Es la informacion del proyecto.
        /// </summary>
        public Project ProjectInformation {
            get { return projectInformation; }
            set { projectInformation = value; }
        }

        /// <summary>
        /// El avance del proyecto de 0 a 100
        /// </summary>
        public decimal Progress { get; set; }
        /// <summary>
        /// Las metricas del proyecto.
        /// </summary>
        public decimal Financial_progress { get; set; }
        public List<MetricperYear> Metrics { get; set; }
        /// <summary>
        /// Las fuentes de financiacion
        /// </summary>
        public List<Sources> Sources { get; set; }
        /// <summary>
        /// La galería de imagenes
        /// </summary>
        public List<Images> Images { get; set; }
        /// <summary>
        /// Hasta cuatro proyectos del mismo OCAD, del mismo sector idealmente si no cualquier sector.
        ///<remarks>Llamar un metodo de negocio y cargar solo el nombre y la localizacion por ocads</remarks>
        /// </summary>
        public List<Modelos.Project> OtherProjects { get; set; }
        /// <summary>
        /// Propiedad de dodne se saca la fuete de la informacion 
        /// para la pagina.
        /// </summary>
        public DataCommonSections DataCommonSections {
            get { return dataCommonSections; }
            set { dataCommonSections = value; }
        }

        public string ControlCiudadano { get; set; }

        //Galeria de fotos de usuarios
        public List<ImagesUsuario> FotosU { get; set; }

        private DataCommonSections dataCommonSections = new DataCommonSections();

        public string id_usu_participa { get; set; }
        public string nom_usu_participa { get; set; }
        public List<RolParticipa> rol_participacion { get; set; }
        public List<GenerosParticipacion> genero_participacion { get; set; }
        public List<MediosParticipacion> medios_participacion { get; set; }

        public List<TiposComentario> tipo_comentario { get; set; }

        public string error_msg { get; set; }

        public List<ModeloAvanceFinancieroPorComponenteProducto> avanceFisicoFasePreInversion { get; set; }
        public List<ModeloAvanceFinancieroPorComponenteProducto> avanceFisicoFaseInversion { get; set; }

        public List<Period> periodos_fuentes { get; set; }

        public List<ComponentesProy> componentes_proy { get; set; }

        public List<itemActores> actores_proy { get; set; }
        public List<itemEntregable> entregables { get; set; }
    }
}
