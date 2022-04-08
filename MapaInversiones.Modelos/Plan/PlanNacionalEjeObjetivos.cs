namespace PlataformaTransparencia.Modelos.Plan
{
  public class PlanNacionalEjeObjetivos
  {
    public int IdEje { get; set; }
    public int CodEje { get; set; }
    public string NombreEje { get; set; }

    public int IdLinea { get; set; }
    public int CodLinea { get; set; }
    public string NombreLinea { get; set; }

    public int IdObjetivo { get; set; }
    public int CodObjetivo { get; set; }
    public string NombreObjetivo { get; set; }

    public int IdObjetivoEspecifico { get; set; }
    public int CodObjetivoEspecifico { get; set; }
    public string NombreObjetivoEspecifico { get; set; }

  }
}
