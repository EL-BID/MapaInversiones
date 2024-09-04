using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class itemEntregable
    {
        public int IdEntregable { get; set; } // int
        public int IdProyecto { get; set; } // int
        public string EntregableColumn { get; set; } // varchar(600)
        public double? Cantidad { get; set; } // float
        public string IdUnidadMedida { get; set; } // nvarchar(20)
        public string NombreUnidadMedida { get; set; } // nvarchar(20)


    }
}


