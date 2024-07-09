using PlataformaTransparencia.Modelos.Entidad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public  class infograficoEntidadPerPresup
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double? presupuesto { get; set; }

        public double? avance { get; set; }

        public double? aprobado { get; set; }

        public double porcentaje { get; set; }

        public List<infograficoActividad> Detalles { get; set; }

        public infograficoEntidadPerPresup()
        {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            avance = 0;
            aprobado = 0;
            porcentaje = 0;
            Detalles = new List<infograficoActividad>();

        }
    }
}
