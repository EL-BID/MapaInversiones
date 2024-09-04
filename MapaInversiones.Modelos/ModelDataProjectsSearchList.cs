using Newtonsoft.Json;
using PlataformaTransparencia.Modelos.Comunes;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos
{
    /// <summary>
    /// Representa el modelo para el resultado de la busqueda, hereda 
    /// de bussinessLogicResult para tomar las propiedades
    /// Status, Message
    /// </summary>
    public class ModelDataProjectsSearchList : RespuestaContratoBase
    {
        /// <summary>
        /// El número total de proyectos que cumplen con el criterio.
        /// </summary>
        public int totalNumber { get; set; }

        /// <summary>
        /// Numero total de proyectos encontrados
        /// </summary>
        public int totalProjectsNumber { get; set; }

        /// <summary>
        /// El número total de páginas.
        /// </summary>
        public int totalPages { get; set; }
        /// <summary>
        /// El número de la página retornada.
        /// </summary>
        [JsonProperty("pageNumber")]
        public int pagesNumber { get; set; }
        /// <summary>
        /// Lista con objetos que representan los proyectos que se van a mostrar. 
        /// </summary>
        public List<objectProjectsSearchMap> objects { get; set; }

        public ModelDataProjectsSearchList()
        {
            this.objects = new List<objectProjectsSearchMap>();
        }
        
        
    }
}