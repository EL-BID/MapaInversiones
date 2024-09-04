using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace PlataformaTransparencia.Modulo.Noticias.Controllers
{
    public class NoticiasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [Route("Noticia/{id}")]
        public IActionResult Noticia(string id)
        {
            var noticia = new Modelos.NoticiaModel() { Id = id };
            return View(noticia);
        }
    }

}
