using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class TotalProceso
    {
        public string EstadoProceso { get; set; }
        public string MonedaProceso { get; set; }
        public Nullable<double> ValorProceso { get; set; }
        public Nullable<int> NroProcesos { get; set; }
        public Nullable<double> ValorProcesoCancelados { get; set; }
        public Nullable<int> NroProcesosCancelados { get; set; }
    }
}
