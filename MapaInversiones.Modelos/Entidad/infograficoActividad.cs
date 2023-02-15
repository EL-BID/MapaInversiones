using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoActividad
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public List<infograficoProcesos> Detalles { get; set;  }

        public infograficoActividad()
        {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            Detalles = new List<infograficoProcesos>();


        }
    }
}
