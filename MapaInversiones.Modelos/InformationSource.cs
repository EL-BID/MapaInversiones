using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class InformationSource
    {
        public int id { get; set; }
        /// <summary>
        /// Nombre de la seccion.
        /// </summary>
        public string data { get; set; }
        /// <summary>
        /// Fuente de los datos.
        /// </summary>
        public string source { get; set; }
        /// <summary>
        /// fecha y hora de actualizacion.
        /// </summary>
        public DateTime lastUpdate { get; set; }

        public DateTime FechaCorteData { get; set; }
    }
}
