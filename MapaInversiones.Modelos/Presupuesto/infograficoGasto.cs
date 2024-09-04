using PlataformaTransparencia.Modelos.Entidad;
using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class infograficoGasto
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public double avance { get; set; }

        public double porcentaje { get; set; }

        public List<infograficoEntidad> Detalles { get; set; }

        public infograficoGasto()
        {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            avance = 0;
            Detalles = new List<infograficoEntidad>();
        }
    }
}
