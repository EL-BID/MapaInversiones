using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    /// <summary>
    /// Clase que permite generar la dependencia entre Entidades
    /// territoriales
    /// </summary>
    public class DependsOn
    {
        /// <summary>
        /// Tipo de entidad, puede ser region, department o municipally
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// id de la entidad territorial de mayor rango
        /// </summary>
        public string id { get; set; }
    }
}
