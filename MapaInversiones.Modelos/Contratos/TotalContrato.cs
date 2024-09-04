using System;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class TotalContrato
    {
        public string EstadoContrato { get; set; }
        public string MonedaContrato { get; set; }
        public Nullable<decimal> ValorContratado { get; set; }
        public Nullable<int> NroContratos { get; set; }
    }
}
