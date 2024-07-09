using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Interfaces;
using System;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Sectores
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosSectoresController : Controller
    {
        private readonly ILogger<ServiciosSectoresController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly ISectorBLL _cargasector;
        public ServiciosSectoresController(ILogger<ServiciosSectoresController> logger, TransparenciaDB connection, ISectorBLL cargasector)
        {
            _logger = logger;
            _connection = connection;
            _cargasector = cargasector;
        }

        [HttpGet("ConsolidadoProyectosAnioEstado")]
        public ModelLocationData ConsolidadoProyectosAnioEstado(string idSector, string idDepto, string? anio, string? estado)
        {
            ModelLocationData objReturn = new() { Status=true };
            try
            {
                objReturn = _cargasector.ObtenerProyectosAnioEstado(idSector, idDepto, anio, estado); 
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }


        [HttpGet("GetAniosProyectos")]
        public ModelLocationData GetAniosProyectos(string idSector, string idDepto)
        {
            ModelLocationData objReturn = new() { Status=true };
            try
            {
                objReturn = _cargasector.ObtenerProyectosAnios(idSector, idDepto);
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }

        [HttpGet("GetAniosProyectosPerfilSector")]
        public ModelLocationData GetAniosProyectosPerfilSector(string idSector, string idDepto)
        {
            ModelLocationData objReturn = new() { Status = true };
            try
            {
                objReturn = _cargasector.ObtenerProyectosAniosPerfilSector(idSector,idDepto);
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }

    }
}
