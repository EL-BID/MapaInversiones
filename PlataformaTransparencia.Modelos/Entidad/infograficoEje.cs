using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoEje
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public List<infograficoEstrategico> Detalles { get; set; }


        public infograficoEje()
        {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            Detalles = new List<infograficoEstrategico>();
        }
    }
}
