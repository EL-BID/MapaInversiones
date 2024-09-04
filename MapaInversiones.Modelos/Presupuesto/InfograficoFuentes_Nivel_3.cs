using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class InfograficoFuentes_Nivel_3
    {
        public string Id { get; set; }

        public string Nombre { get; set; }
        public decimal presupuesto { get; set; }
        public decimal avance { get; set; }

        public List<InfograficoFuentes_Nivel_4> Detalles { get; set; }

        public InfograficoFuentes_Nivel_3(string id, string nombre)
        {
            Id = id;
            Nombre = nombre;
            Detalles = new List<InfograficoFuentes_Nivel_4>();
            presupuesto = 0;
            avance = 0;

        }
    }
}
