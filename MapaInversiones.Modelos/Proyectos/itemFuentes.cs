using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class itemFuentes
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public decimal Porcentaje { get; set; }
        public decimal ValorPresupuesto { get; set; }
        public decimal ValorEjecutado { get; set; }
    }
}
