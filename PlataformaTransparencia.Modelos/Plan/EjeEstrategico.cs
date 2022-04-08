using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Plan
{
   public class EjeEstrategico
    {
        public int? Id { get; set; } // int
        public string Nombre { get; set; } // varchar(max)
        public string Descripcion { get; set; } // varchar(max)
        public int? Version { get; set; } // int
        public int? Anho { get; set; } // int
        public string Borrado { get; set; } // varchar(5)
        public DateTime? FechaActualizacion { get; set; } // datetime2(6)
        public DateTime? FechaInsercion { get; set; } // datetime2(6)
        public string UsuarioResponsable { get; set; } // varchar(max)
        public int? PlanId { get; set; } // int
    }
}
