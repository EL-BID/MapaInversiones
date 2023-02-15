using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Modelos.Presupuesto;

namespace PlataformaTransparencia.Modelos
{
    public class ModelPresupuestoData : RespuestaContratoBase
    {
        public List<PresupuestoXSectorMinHacienda> Presupuesto { get; set; }
        public List<InfoPresupuesto> InfoGrafica { get; set; }

        public List<InfoConsolidadoPresupuesto> InfoRecursos { get; set; }

        public double TotalPresupuesto { get; set; }

        public double TotalAprobado { get; set; }

        public double TotalEjecutado { get; set; }

        public List<InfoConsolidadoPresupuesto> InfoConsolidado { get; set; }

        public List<infograficoGasto> InfograficoPerGasto { get; set; }

        public List<int> periodos { get; set; }

        public List<itemVersiones> versiones { get; set; }

        public List<InformationGraphics> funciones { get; set; }

        public int totalCantidades { get; set; }

        public List<itemNiveles> ConsolidadoNiveles { get; set; }

        public List<InformationGraphics> gruposGasto { get; set; }




    }
}
