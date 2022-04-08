using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Negocios.Entidad;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class EntidadController : Controller
  {

    private readonly ILogger<EntidadController> _logger;
    private readonly TransparenciaDB _connection;



    public EntidadController(ILogger<EntidadController> logger, TransparenciaDB connection)
    {
      _logger = logger;
      _connection = connection;

***REMOVED***

    public IActionResult Index()
    {
      return View();
***REMOVED***
    public IActionResult perfilEntidad(string codEntidad)
    {
      EntidadContract entidad = new EntidadContract(_connection);
      string nombreEntidad= entidad.ObtenerNombreEntidad(codEntidad);
      entidad.Fill(nombreEntidad,codEntidad);
      return View(entidad);
***REMOVED***
  ***REMOVED***
***REMOVED***
