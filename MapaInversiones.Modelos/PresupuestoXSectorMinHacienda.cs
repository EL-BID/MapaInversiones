using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class PresupuestoXSectorMinHacienda
    {

            public string IdNegocioProyecto { get; set; } // varchar(23)
            public string IdNegocioProducto { get; set; } // varchar(27)
            public int AnioPresupuesto { get; set; } // int
            public string Nivel { get; set; } // varchar(60)
            public string NombreEntidad { get; set; } // varchar(60)
            public string Sectores { get; set; } // varchar(150)
            public string Clasificacion { get; set; } // varchar(30)
            public string NombrePrograma { get; set; } // nvarchar(60)
            public string NombreSubPrograma { get; set; } // nvarchar(60)
            public string NombreProyectoActividad { get; set; } // nvarchar(60)
            public string NombreProducto { get; set; } // nvarchar(100)
            public int? CodigoVersion { get; set; } // int
            public string NombreVersion { get; set; } // varchar(60)
            public decimal? Meta { get; set; } // numeric(28, 2)
            public decimal? Presupuesto { get; set; } // numeric(28, 2)
            public decimal? Avance { get; set; } // numeric(28, 2)

    }
}
