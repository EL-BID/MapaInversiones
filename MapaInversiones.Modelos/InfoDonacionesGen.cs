namespace PlataformaTransparencia.Modelos
{
  public class InfoDonacionesGen
  {
    public string TotalBeneficiarios { get; set; } = "0";
    public string TotalDonantes { get; set; } = "0";
    public string TotalEntregas { get; set; } = "0";

    public InfoDonacionesGen()
    {
      TotalBeneficiarios = "0";
      TotalDonantes = "0";
      TotalEntregas = "0";
    }
  }
}
