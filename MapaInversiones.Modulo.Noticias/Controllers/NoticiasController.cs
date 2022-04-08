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
    ***REMOVED***

        [Route("Noticia/{id***REMOVED***")]
        public IActionResult Noticia(string id)
        {
            var noticia = new Modelos.NoticiaModel() { Id = id ***REMOVED***;
            return View(noticia);
    ***REMOVED***
***REMOVED***

***REMOVED***
