using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class ProcesosContratacionData
    {
        public string IdOrdenCompraProyecto { get; set; } // varchar(100)
        public int Annio { get; set; } // int
        public int Semestre { get; set; } // int
        public int IdProyecto { get; set; } // int
        public string Convenio { get; set; } // varchar(max)
        public string Tipoproceso { get; set; } // varchar(max)
        public string Obra { get; set; } // varchar(max)
        public string Fuente { get; set; } // varchar(max)
        public double? Monto { get; set; } // float
        public DateTime FechaUltimaModificacion { get; set; } // datetime
        public int ConsecutivoCarga { get; set; } // int
        public string ModificadoPor { get; set; } // varchar(30)
    }
}
