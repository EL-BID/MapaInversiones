using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modulo.Principal.Controllers.Emergencia;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class PresupuestoEmergenciaController : Controller
  {
    private readonly TransparenciaDB _connection;


    public PresupuestoEmergenciaController(TransparenciaDB connection)
    {
      _connection = connection;
    }

    /// <summary>
    /// Devuelve la información del presupuesto dado un tipo de emergencia
    /// </summary>
    /// <param name="emergencia">Corresponde al tipo de emergencia a consultar</param>
    /// <returns>Información del presupuesto de la emergencia consultada</returns>
    public ActionResult EmergenciaPresupuesto(string emergencia)
    {
      _ = int.TryParse(emergencia, out int tipoDeEmergenciaId);
      
      HomePresupuestoEmergenciaContract homeContract = new(_connection);
      homeContract.Fill(tipoDeEmergenciaId);
      if (homeContract.HomePresupuestoEmergenciaModel != null)
      {
        
        homeContract.HomePresupuestoEmergenciaModel.TipoEmergencia = tipoDeEmergenciaId.ToString();
      }

      
      return View(homeContract.HomePresupuestoEmergenciaModel);
    }

  }
}
