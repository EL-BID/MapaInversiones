using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class UnidadCompras
    {
        public string Entidad { get; set; }
        public string MonedaContrato { get; set; }
        public Nullable<decimal> ValorContratado { get; set; }
        public Nullable<int> NroContratos { get; set; }
        public string MonedaProceso { get; set; }
        public Nullable<double> ValorProceso { get; set; }
        public Nullable<int> NroProcesos { get; set; }
    }
}
