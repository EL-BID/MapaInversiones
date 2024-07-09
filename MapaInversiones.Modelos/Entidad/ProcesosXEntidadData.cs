using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class ProcesosXEntidadData
    {
         public string Bpin { get; set; } // varchar(40)
         public string NombreProyecto { get; set; } // varchar(max)
         public string Codigoproceso { get; set; } // varchar(40)
         public string Descripcion { get; set; } // varchar(500)
         public string Caratula { get; set; } // varchar(250)
         public string EstadoProceso { get; set; } // varchar(100)
         public decimal? MontoEstimado { get; set; } // numeric(38, 6)
         public string Modalidad { get; set; } // varchar(100)
         public string Url { get; set; } // varchar(250)
    }
}
