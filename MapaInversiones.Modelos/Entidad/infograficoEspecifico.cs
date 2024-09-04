using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoEspecifico
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }


        public infograficoEspecifico() {
            Id = "";
            Nombre = "";
            presupuesto = 0;
        }
    }
}
