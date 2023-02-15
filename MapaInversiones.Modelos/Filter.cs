using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class Filter
    {
        /// <summary>
        /// Es el nombre del filtro
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// Es el parametro del filtro
        /// </summary>
        public string parameter { get; set; }

        /// <summary>
        /// Indica si el filtro permite multiple seleccion
        /// </summary>
        public bool esMultiple { get; set; }

        /// <summary>
        /// Indica si el filtro permite multiple seleccion
        /// </summary>
        public bool usaServicioAjax { get; set; }

        /// <summary>
        /// Indica si el filtro permite multiple seleccion
        /// </summary>
        public string urlServicioAjax { get; set; }

        /// <summary>
        /// Indica la seccion del aplicativo donde se usa el filtro
        /// </summary>
        public string seccionAplicativo { get; set; }

        /// <summary>
        /// Lista con los valores de los filtros.
        /// Tiene 2 tipos item, item geography.
        /// </summary>
        public List<itemFilters> items { get; set; }

        public Filter()
        {
            items = new List<itemFilters>();
        }

        public Filter(string nombreVisual, string nombreCodigo, string seccionFuncionalAplicativo)
        {
            name = nombreVisual;
            parameter = nombreCodigo;
            seccionAplicativo = seccionFuncionalAplicativo;
            items = new List<itemFilters>();
        }





    }
}
