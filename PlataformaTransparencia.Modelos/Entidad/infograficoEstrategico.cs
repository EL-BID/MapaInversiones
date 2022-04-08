using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoEstrategico
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public List<infograficoEspecifico> Detalles { get; set; }


        public infograficoEstrategico() {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            Detalles = new List<infograficoEspecifico>();

        }

    }
}
