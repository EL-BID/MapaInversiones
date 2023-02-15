using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class infograficoEntidad
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public double avance { get; set; }

        public double porcentaje { get; set; }

        public List<infograficoActividad> Detalles { get; set; }

        public infograficoEntidad()
        {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            avance = 0;
            porcentaje = 0;
            Detalles = new List<infograficoActividad>();

        }
    }
}
