using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class InfograficoFuentes_Nivel_4
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public decimal presupuesto { get; set; }
        public decimal avance { get; set; }

        public InfograficoFuentes_Nivel_4(string id, string nombre)
        {
            Id = id;
            Nombre = nombre;
            presupuesto = 0;
            avance = 0;

        }
    }
}
