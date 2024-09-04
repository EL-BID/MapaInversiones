using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Negocios.Interfaces;
using PlataformaTransparencia.Negocios.Proyectos;
using PlataformaTransparencia.Negocios.RepositorioConsultas;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    [Route("api/filtrostotales")]
    public class FiltrosTotalesController : Controller
    {
        private readonly IConsultasComunes _consultascomunes;
        private readonly IBusquedasProyectosBLL BusquedasProyectosBLL;

        public FiltrosTotalesController(IConsultasComunes Consultascomunes, IBusquedasProyectosBLL busquedasProyectosBLL)
        {
            _consultascomunes = Consultascomunes;
            BusquedasProyectosBLL = busquedasProyectosBLL;
        }

        [HttpGet("GetFiltros")]
        public async Task<object> GetFiltros()
        {
            var horaInicio = DateTime.UtcNow;
            var geograficos = await _consultascomunes.ObtenerFiltrosGeograficosAsync();
            var proyectos = await BusquedasProyectosBLL.ObtenerFiltrosEspecificosParaProyectosAsync();
            Debug.Print("API Filtros - Metodo ObtenerFiltrosEspecificosParaProyectos ejecutó en {0} ms", (horaInicio - DateTime.UtcNow).Milliseconds);
            horaInicio = DateTime.Now;
            horaInicio = DateTime.Now;

            var filtros = new List<object>();
            filtros.AddRange(geograficos);
            filtros.AddRange(proyectos);

            var modeloRespuesta = new
            {
                filters = filtros,
                status = true,
                message = default(string)
            };
            return modeloRespuesta;
        }

    }
}
