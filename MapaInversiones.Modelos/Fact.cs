using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class Fact
    {
        /// <summary>
        /// HTML a Mostrar TODO: Revisar para que deje inyectar html.
        /// </summary>
        //[AllowHtml]
        public string phrase { get; set; }
        /// <summary>
        /// Url del Icono que se desea mostrar.
        /// </summary>
        public string icon { get; set; }
        /// <summary>
        /// Título de la sección
        /// </summary>
        public string title { get; set; }

        public string subTipo { get; set; }


    }
}
