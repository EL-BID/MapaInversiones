using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ArticulosContrato
    {
        public string DescripcionSubclase { get; set; }
        public string DescripcionArticulo { get; set; }
        public Nullable<int> Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal MontoTotal { get; set; }
        public Nullable<decimal> ImpuestoTotal { get; set; }
        public Nullable<decimal> Descuento { get; set; }
    }
}
