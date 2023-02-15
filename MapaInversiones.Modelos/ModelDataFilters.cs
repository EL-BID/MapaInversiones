using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    /// <summary>
    /// Representa el modelo de los filtros, hereda 
    /// de bussinessLogicResult para tomar las propiedades
    /// Status, Message
    /// 3.1 [S1] Filtros de búsqueda de proyectos
    /// </summary>
    public class ModelDataFilters : RespuestaContratoBase
    {
        /// <summary>
        /// Es la lista de los filtros utilizados.
        /// </summary>
        public List<Filter> filters { get; set; }

        public ModelDataFilters()
        {
            filters = new List<Filter>();
        }

    }
}
