using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class itemUsuarios
    {
        public string valida_rol { get; set; }
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string email { get; set; }
        public string hash_clave { get; set; }
        public string FacebookID { get; set; }
        public string Estado { get; set; }
        public Nullable<System.DateTime> FCambioPwd { get; set; }
        public string cod_verifica { get; set; }
        public Nullable<System.DateTime> FechaCreacion { get; set; }
        public Nullable<int> Edad { get; set; }
        public Nullable<int> IdRol { get; set; }
        public Nullable<int> IdGenero { get; set; }
        public Nullable<int> IdMedio { get; set; }
        public int IdProyRel { get; set; }
        public int IdProgRel { get; set; }
        public string CodigoContrato { get; set; }

    }

}
