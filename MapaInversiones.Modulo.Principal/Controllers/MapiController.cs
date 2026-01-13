using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    public  class MapiController:Controller
    {
        public IActionResult Mapi()
        {
            return View("~/Views/Mapi.cshtml");
        }

    }

    
}
