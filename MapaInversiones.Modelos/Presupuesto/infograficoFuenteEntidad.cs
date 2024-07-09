using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Entidad;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class infograficoFuenteEntidad
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public double avance { get; set; }

        public double porcentaje { get; set; }

        public List<InfoGraficoItemPrograma> Detalles { get; set; }

        public infograficoFuenteEntidad()
        {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            avance = 0;
            porcentaje = 0;
            Detalles = new List<InfoGraficoItemPrograma>();

        }
    }
}
