using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Interfaces;
using System;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Sectores
{
    [ApiController]
    [Route("api/ServiciosSectores")]
    public class ServiciosSectoresController : Controller
    {
        private readonly ILogger<ServiciosSectoresController> _logger;
        private readonly ISectorBLL _cargasector;
        public ServiciosSectoresController(ILogger<ServiciosSectoresController> logger,ISectorBLL cargasector)
        {
            _logger = logger;
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

        [HttpGet("GetConsolidadoPeriodosPresupuesto")]
        public ModelLocationData GetConsolidadoPeriodosPresupuesto(string idSector, int anio)
        {
            ModelLocationData objReturn = new() { Status = true };
            try
            {
                objReturn = _cargasector.GetConsolidadoPeriodosSector(idSector, anio);
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }

        [HttpGet("GetConsolidadoGastosSector")]
        public ModelLocationData GetConsolidadoGastosSector(string idSector, int anio)
        {
            ModelLocationData objReturn = new() { Status = true };
            try
            {
                objReturn.GastoSector = _cargasector.GetConsolidadoGastosSector(idSector, anio);
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }

        [HttpGet("GetODSInversion")]
        public ModelLocationData GetODSInversion(string idSector)
        {
            ModelLocationData objReturn = new() { Status = true };
            try
            {
                objReturn = _cargasector.GetODSInversion(idSector);
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }

        [HttpGet("GetODSDesarrollo")]
        public ModelLocationData GetODSDesarrollo(string idSector)
        {
            ModelLocationData objReturn = new() { Status = true };
            try
            {
                objReturn = _cargasector.GetODSDesarrollo(idSector);
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }

        [HttpGet("GetConsolidadoODSInversion")]
        public ModelLocationData GetConsolidadoODSInversion(string idSector, int pagina, int tamanopagina, string ods, string entidad)
        {
            ModelLocationData objReturn = new() { Status = true };
            try
            {
                objReturn = _cargasector.GetConsolidadoODSInversion(idSector, pagina, tamanopagina,  ods, entidad);
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }

        [HttpGet("GetConsolidadoODSDesarrollo")]
        public ModelLocationData GetConsolidadoODSDesarrollo(string idSector, int pagina, int tamanopagina, string ods, string entidad)
        {
            ModelLocationData objReturn = new() { Status = true };
            try
            {
                objReturn = _cargasector.GetConsolidadoODSDesarrollo(idSector,  pagina,  tamanopagina, ods, entidad);
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }

        [HttpGet("GetProyectosPotSector")]
        public ModelLocationData GetProyectosPotSector(string idSector)
        {
            ModelLocationData objReturn = new ModelLocationData();
            try
            {
                objReturn = _cargasector.GetProyectosPotSector(idSector);
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }

        }

    }
}
