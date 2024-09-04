using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos
{
    public class infoFuentesRecursos
    {
        public int IdFuente { get; set; } // int
        public string NombreFuente { get; set; } // nvarchar(150)
        public string Descripcion { get; set; } // nvarchar(500)
        public DateTime FechaActualizacionFuente { get; set; } // datetime
       
    }
}
