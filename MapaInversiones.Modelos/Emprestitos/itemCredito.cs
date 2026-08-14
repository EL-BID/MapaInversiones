using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Emprestitos
{
    public class itemCredito
    {
        public string Nombre { get; set; }

        public string IdEntidadFinanciera { get; set; }
        public string EntidadFinanciera { get; set; }

        public string IconoEntidadFinanciera { get; set; }

        public double Monto { get; set; }

        public string Plazo { get; set; }

        public int NumeroProyectos { get; set; }

        public string PeriodoGracia { get; set; }


        public string TasaInteres { get; set; }


        public double PorcentajeEjecucion { get; set; }

        public string  FechaContrato { get; set; }

        public string UrlContrato { get; set; }
    }
}
