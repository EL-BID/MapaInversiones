using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace PlataformaTransparencia.Modelos
{
    public abstract class RespuestaContratoBase
    {
        /// <summary>
        /// Status 
        /// False si no.
        /// </summary>
        [JsonProperty(PropertyName = "status")]
        public bool Status { get; set; }
        /// <summary>
        /// Mensaje de error en caso que se genere y la consulta retorne
        /// Falso
        /// </summary>
        [JsonProperty(PropertyName = "message")]
        public string Message { get; set; }
    }
}
