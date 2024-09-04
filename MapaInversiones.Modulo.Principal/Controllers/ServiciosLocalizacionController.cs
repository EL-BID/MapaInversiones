using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Modelos.Location;
using PlataformaTransparencia.Negocios.Location;
using System;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  [Route("api/ServiciosLocationProfile")]
  public class ServiciosLocalizacionController : Controller
  {

    private ILocationBLL locationProfileBLL;
    private readonly ILogger<ServiciosLocalizacionController> _logger;
    public ServiciosLocalizacionController(ILogger<ServiciosLocalizacionController> logger, ILocationBLL locationBLL)
    {
      _logger = logger;
      locationProfileBLL = locationBLL;
    }

    
    [HttpGet("GetDetailLocationProfileByLocationIdAndTypeLocation")]
    public LocationProfileDetailData GetDetailLocationProfileByLocationIdAndTypeLocation(string locationId, string typeLocation, string jurisdictionId)
    {
      LocationProfileDetailData objReturn = new();
      try
      {
        objReturn = locationProfileBLL.GetDetailLocationProfileByLocationIdAndTypeLocation(locationId, typeLocation, jurisdictionId);
        return objReturn;
      }
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }
    }
  }
}
