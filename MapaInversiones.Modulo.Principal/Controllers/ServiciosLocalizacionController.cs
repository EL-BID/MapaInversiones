using DocumentFormat.OpenXml.Office2010.ExcelAc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Location;
using PlataformaTransparencia.Negocios.Location;
using System;
using System.Collections.Generic;

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


    [HttpGet("GetBudgetFundsByLocationIdAndYear")]
    public BudgetFundsLocation GetBudgetFundsByLocationIdAndYear(string locationId, int year)
    {
      BudgetFundsLocation objReturn = new();
      try
      {
        objReturn = locationProfileBLL.GetBudgetFundsByLocationIdAndYear(locationId, year);
      }
      catch (Exception)
      {
      }
      return objReturn;
    }


    [HttpGet("GetBudgetConsolidateByLocationIdAndYear")]
    public ModelDistribucionPorTipoGastoByLocalizacionIdAndYear GetBudgetConsolidateByLocationIdAndYear(string locationId, int year)
    {
      ModelDistribucionPorTipoGastoByLocalizacionIdAndYear objReturn = new() {Data=new(), FechaCorte=string.Empty };
      try
      {
        objReturn = locationProfileBLL.GetBudgetConsolidateByLocationIdAndYear(locationId, year);
      }
      catch (Exception)
      {
      }
      return objReturn;
    }


    [HttpGet("GetConsolidatedCostByLocationAndYear")]
    public BudgetFundsLocation GetConsolidatedCostByLocationAndYear(string locationId, int year)
    {
      BudgetFundsLocation objReturn = new();
      try
      {
        objReturn = locationProfileBLL.GetBudgetFundsByLocationIdAndYear(locationId, year);
      }
      catch (Exception)
      {
      }
      return objReturn;
    }

    [HttpGet("GetPotProjectsLocationsByLocationIdAndYear")]
    public ModelLocationProjectPot GetPotProjectsLocationsByLocationIdAndYear(string locationId, string sectorId, int pagina, int tamanoPagina)
    {
      ModelLocationProjectPot objReturn = new() { PotProjects = [] };
      try
      {
        objReturn = locationProfileBLL.GetPotProjectsLocationsByLocationIdAndYear(locationId,sectorId,pagina,tamanoPagina);
      }
      catch (Exception)
      {
      }
      return objReturn;
    }

    [HttpGet("GetODSLocation")]
    public ModelLocationData GetODSLocation(string locationId)
    {
      ModelLocationData objReturn = new() { Status = true };
      try
      {
        objReturn = locationProfileBLL.GetODSLocation(locationId);
      }
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
      }
      return objReturn;
    }


    [HttpGet("GetConsolidadoODSInversionLocalizacion")]
    public ModelLocationData GetConsolidadoODSInversionLocalizacion(string locationId, string idSector, string idEntidad, string destacados, int pagina, int tamanopagina)
    {
      ModelLocationData objReturn = new() { Status = true };
      try
      {
        objReturn = locationProfileBLL.GetConsolidadoODSInversionLocalizacion(locationId,idSector, idEntidad, destacados, pagina, tamanopagina);
      }
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
      }
      return objReturn;
    }

  }
}
