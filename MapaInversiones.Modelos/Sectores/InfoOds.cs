using PlataformaTransparencia.Modelos.Comunes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;
using System.Diagnostics.CodeAnalysis;

namespace PlataformaTransparencia.Modelos.Proyectos
{
  public class InfoOds
    {
        public int? ODSId { get; set; } // int
        public string ODSNombre { get; set; } // varchar(100)

        public int? TotalProyectos { get; set; } // int
    }
}

