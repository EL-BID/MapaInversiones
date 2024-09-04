using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Modelos.Comunes;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    public class CorreoController : Controller
    {
        private readonly IConfiguration Configuration;

        public CorreoController( IConfiguration configuration)
        {
            Configuration = configuration;
        }
        
        public IActionResult Index()
        {
            return View();
        }
        
        public ModeloRespuestaCorreo EnviarCorreoHtml(string destinatario, string cuerpo_mensaje, string asunto)
        {
            ModeloRespuestaCorreo objReturn = new ModeloRespuestaCorreo();
            objReturn = CorreoUtilidad.envCorreoNet(cuerpo_mensaje, destinatario, null, null, asunto, Configuration);
            return objReturn;

        }
    }
}
