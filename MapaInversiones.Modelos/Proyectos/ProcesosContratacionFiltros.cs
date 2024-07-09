using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class ProcesosContratacionFiltros
    {
        public int Annio { get; set; } // int
        public int Semestre { get; set; } // int
        public int IdProyecto { get; set; } // int
        public int? NumeroPagina { get; set; }
        public int? RegistrosPorPagina { get; set; }
        public string? NombreProceso { get; set; }
    }
}
