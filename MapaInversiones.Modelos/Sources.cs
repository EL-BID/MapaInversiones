using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class Sources
    {
        /// <summary>
        /// Son lad fuentes de financiacion.
        /// </summary>
        public Sources()
        {

        }
        /// <summary>
        /// Año a cargar.
        /// </summary>
        public int year { get; set; }
        /// <summary>
        /// Lista con los años a cargar.
        /// </summary>
        public List<SourcesPerYear> sourcesperyear { get; set; }
    }
}
