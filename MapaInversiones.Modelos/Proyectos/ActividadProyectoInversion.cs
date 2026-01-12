using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Proyectos
{
  public class ActividadProyectoInversion
  {
    public string Nombre { get; set; } = string.Empty;
    public decimal AvanceFinancieroProgramado { get; set; }
    public decimal AvanceFinancieroComprometido { get; set; }
    public decimal AvanceFinancieroGirado { get; set; }
    public decimal AvanceFisicoMagnitudProgramada { get; set; }
    public decimal AvanceFisicoPorcentajeMagnitudComprometida { get; set; }
    public decimal AvanceFisicoMagnitudEntregada { get; set; }
    public decimal AvanceFisicoPorcentajeMagnitudEntregada { get; set; }
    public List<DetalleActividadProyectoInversion> Detalle { get; set; } = [];
  }
}
