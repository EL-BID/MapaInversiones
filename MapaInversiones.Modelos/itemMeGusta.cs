using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class itemMeGusta
    {
        public int IdMegusta { get; set; }
        public int IdUsuario { get; set; }
        public int? IdFoto { get; set; }
        public int? IdFotoUsuario { get; set; }
        public bool MeGusta { get; set; }
        public bool NoMeGusta { get; set; }
        public int IdProyecto { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
    }
}
