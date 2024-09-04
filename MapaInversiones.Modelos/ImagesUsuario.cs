using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class ImagesUsuario
    {
        /// <summary>
        /// Descripcion de la imagen
        /// </summary>
        public string description { get; set; }
        /// <summary>
        /// Url para el thumbnail.
        /// </summary>
        public string thumbnail { get; set; }
        /// <summary>
        /// Url para la imagen grande.
        /// </summary>
        public string large { get; set; }
        /// <summary>
        /// Identificador de la foto.
        /// </summary>
        public int idFoto { get; set; }
        /// <summary>
        /// Fecha de ingreso de la foto.
        /// </summary>
        /// 
        public Nullable<System.DateTime> fechaFoto { get; set; }
        public string idDepartamento { get; set; }
        public string idMunicipio { get; set; }

        public String nombreDepartamento { get; set; }
        public String nombreMunicipio { get; set; }
        public String nombreProyecto { get; set; }
        public String nombreUsuario { get; set; }
        public int idProyecto { get; set; }
        public int idUsuario { get; set; }


    }
}
