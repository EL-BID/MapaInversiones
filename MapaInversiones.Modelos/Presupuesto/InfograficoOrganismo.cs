using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class InfograficoOrganismo
    {
        public string Id{ get; set; }
        public string Nombre { get; set; }
        public decimal presupuesto { get; set; }
        public decimal avance { get; set; }
        public List<InfoGraficoItemPrograma> Detalles { get; set; }

        public InfograficoOrganismo(string id, string nombre)
        {
            Id = id;
            Nombre = nombre;
            Detalles = new List<InfoGraficoItemPrograma>();
            presupuesto = 0;
            avance = 0;

        }
    }
}
