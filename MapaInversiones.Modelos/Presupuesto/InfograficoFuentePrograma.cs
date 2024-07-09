using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class InfograficoFuentePrograma
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public decimal presupuesto { get; set; }
        public decimal avance { get; set; }
        public decimal total_presupuesto { get; set; }
        public decimal total_avance { get; set; }
        public List<InfograficoOrganismo> Detalles { get; set; }

        public InfograficoFuentePrograma(string id, string nombre)
        {
            Id = id;
            Nombre = nombre;
            Detalles = new List<InfograficoOrganismo>();
            presupuesto = 0;
            avance = 0;
        }

    }
}
