using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Presupuesto;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Emergencia
{
  public class ModelPresupuestoGeneralEmergenciaData : RespuestaContratoBase
  {
    public List<int> Anios { get; set; } = new();
    public List<InfoGraficoItemPrograma> PresupuestoAsignadoPorEntidad { get; set; } = new();
    public List<InfoPresupuestoEjecutadoPorEmergencia> PresupuestoEjecutadoPorEmergencias { get; set; } = new();
    public List<InfoPresupuestoGeneralPorAnio> PresupuestoGeneralPorAnios { get; set; } = new();
  }
}
