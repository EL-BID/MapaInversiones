using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class itemLineaPresupuestal
    {
        public string nombre { get; set; }
        public decimal? aprobado { get; set; }
        public decimal? vigente { get; set; }
        public decimal ejecutado { get; set; }

        public decimal porcentaje { get; set; }
    }
}
