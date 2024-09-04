using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class itemGenPresupuesto
    {
        public string id { get; set; }
        public string nombre { get; set; }
        public decimal? aprobado { get; set; }
        public decimal? vigente { get; set; }
        public decimal ejecutado { get; set; }

        public decimal comprometido { get; set; }

        public decimal porcentaje { get; set; }

        public string url { get; set; }

        public string recurso { get; set; }

        public double? avance_fisico { get; set; }

        public double? avance_financiero { get; set; }
        public double? AvanceFinancieroOrganismo { get; set; }

        public List<itemLineaPresupuestal> detalleLineas { get; set; }

        public string estado { get; set; } = string.Empty;

        public itemGenPresupuesto()
        {
            id = "";
            nombre = "";
            aprobado = 0;
            vigente = 0;
            ejecutado = 0;
            porcentaje = 0;
            avance_fisico = 0;
            avance_financiero = 0;
            recurso = "";
            url = "";
            detalleLineas = new List<itemLineaPresupuestal>();
            estado=string.Empty;
        }
    }
}
