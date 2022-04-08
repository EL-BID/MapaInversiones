using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class CentroayudaController : Controller
  {
    //public IActionResult Index()
    //{
    //  return View();
    //}
    
    public IActionResult Index(int id)
    {
      try {
        ViewData["tab"] = id;
      }
      catch (Exception ex) 
      {
      }
      
      return View();
    }

    public IActionResult Contactanos()
    {
      //return Index();
      return View();
    }
    public IActionResult Acercade()
    {
      return View();
    }

    public IActionResult MarcoLegal()
    {
        return View();
    }

    }
}
