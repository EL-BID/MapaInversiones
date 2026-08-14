namespace PlataformaTransparencia.Modelos.Emprestitos
{
  public class EntidadFinanciadora
  {
    public string Id { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Icono { get; set; } = string.Empty;
    public double Monto { get; set; }
    public double PorcentajeEjecucionPresupuestal { get; set; }
    public string Plazo { get; set; } = string.Empty;
    public string FechaContrato { get; set; }
    public string PeriodoDeGracia { get; set; }
    public int ProyectosFinanciar { get; set; }
    public string TasaInteres { get; set; }
    public string UrlContrato { get; set; }

    }
}
