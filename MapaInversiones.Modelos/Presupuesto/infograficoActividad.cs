using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class infograficoActividad
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public double avance { get; set;  }
        public infograficoActividad()
        {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            avance = 0;


        }

    }
}
