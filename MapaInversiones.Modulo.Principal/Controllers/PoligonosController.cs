using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    [Route("api/Poligonos")]
    public class PoligonosController : Controller
    {
        private readonly IConsultasComunes ConsultasComunes;

        // Methods
        public PoligonosController(IConsultasComunes consultasComunes)
        {
            ConsultasComunes = consultasComunes;
        }

        [HttpGet("Departamento")]
        public async Task<RespuestaPoligonoTerritorial> ObtenerDepartamentos()
        {
            var horaInicio = DateTime.UtcNow;
            var deptos = await ConsultasComunes.ObtenerPoligonosDepartamentosAsync();
            Debug.WriteLine("API Poligonos - Metodo ObtenerDepartamentos ejecutó en {0} ms", (horaInicio - DateTime.UtcNow).Milliseconds);
            return deptos;
        }

        [HttpGet("Municipio")]
        public async Task<RespuestaPoligonoTerritorial> ObtenerMunicipios()
        {
            var horaInicio = DateTime.UtcNow;
            var deptos = await ConsultasComunes.ObtenerPoligonosMunicipiosAsync();
            Debug.WriteLine("API Poligonos - Metodo ObtenerMunicipios ejecutó en {0} ms", (horaInicio - DateTime.UtcNow).Milliseconds);
            return deptos;
        }

        [HttpGet("Region")]
        public async Task<RespuestaPoligonoTerritorial> ObtenerRegiones()
        {
            var horaInicio = DateTime.UtcNow;
            var deptos = await ConsultasComunes.ObtenerPoligonosRegionesAsync();
            Debug.WriteLine("API Poligonos - Metodo ObtenerRegiones ejecutó en {0} ms", (horaInicio - DateTime.UtcNow).Milliseconds);
            return deptos;
        }

    }

}
