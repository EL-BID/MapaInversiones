using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class DatosAbiertosController : Controller
  {
    public IActionResult DatosAbiertos()
    {
      ViewData["ruta"] = "Datos abiertos";
      return View();
    }
  }
}
