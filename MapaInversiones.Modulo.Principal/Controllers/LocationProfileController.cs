using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modulo.Principal.Controllers.Entidad;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    public class LocationProfileController : Controller
  {
    private readonly ILogger<EntidadController> _logger;
    private readonly TransparenciaDB _connection;
    private readonly IGestorTitulos _gestorTitulos;
    private readonly IConfiguration _configuration;

    public LocationProfileController(IConfiguration configuration,ILogger<EntidadController> logger, TransparenciaDB connection, IGestorTitulos gestorTitulos)
    {
      _logger = logger;
      _connection = connection;
      _gestorTitulos = gestorTitulos;
      _configuration = configuration;
    }

    public IActionResult Location()
    {
      //var horaInicio = DateTime.UtcNow;
      ViewBag.TitulosHome = _gestorTitulos;
      var type = Request.Query.ContainsKey("type") ? Request.Query["type"].ToString() : string.Empty;
      var id = Request.Query.ContainsKey("id") ? Request.Query["id"].ToString() : string.Empty;
      if (type == string.Empty && id == string.Empty && Request.Path.HasValue && Request.Path.Value != string.Empty)
      {
        string[] path = Request.Path.Value.Split('&', '=');
        if (path.Length == 5)
        {
          type = path[2];
          id = path[4];
        }
      }
      LocationContract locationContract = new(_configuration) { HeaderLocationModel= new() { Locations=new() } };
      locationContract.Fill(id.ToString(), type);
      return View(locationContract.HeaderLocationModel);
      
    }
  }
}
