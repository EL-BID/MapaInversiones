using System;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Location;

namespace PlataformaTransparencia.Negocios.BLL.Contracts
{
  public class LocationContract : RespuestaContratoBase
  {
    public ModelHeaderLocalitacionProfileData HeaderLocationModel { get; set; }
    private IConfiguration _configuration;
    public LocationContract(IConfiguration configuration)
    {
      _configuration = configuration;
      HeaderLocationModel = new();
    }

    public void Fill(string locationId, string type)
    {
      try
      {
        HeaderLocationModel = new LocationBLL(_configuration).GetHeaderLocationProfile(locationId, type);
        Status = true;
      }
      catch (Exception)
      {
        Status = false;
        Message = "Lo sentimos, ha ocurrido un error.";
      }
    }
  }
}
