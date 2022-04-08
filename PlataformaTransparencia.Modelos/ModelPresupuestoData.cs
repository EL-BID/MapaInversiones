using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Plan;

namespace PlataformaTransparencia.Modelos
{
  public class ModelPresupuestoData : RespuestaContratoBase
  {
        public List<PresupuestoXSectorMinHacienda> Presupuesto { get; set; }
        public List<InfoPresupuesto> InfoGrafica { get; set; }
    }
}
