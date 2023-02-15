using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class itemAprobar
    {
        public int IdFotoUsuario { get; set; }
        public string Aprobadopor { get; set; }
        public bool Aprobado { get; set; }
        public bool Eliminado { get; set; }
        public int IdUsuario { get; set; }
        public int IdProyecto { get; set; }
        public string textoJustifica { get; set; }
    }
}
