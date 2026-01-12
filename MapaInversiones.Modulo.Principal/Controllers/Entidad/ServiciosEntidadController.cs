using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios.Contratos;
using PlataformaTransparencia.Negocios.Entidad;
using SolrNet;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Entidad
{
    [Route("api/ServiciosEntidad")]
    public class ServiciosEntidadController : Controller
    {
        private readonly ILogger<ServiciosEntidadController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly IEntidadBLL consolidadosEntidades;

        public ServiciosEntidadController(ILogger<ServiciosEntidadController> logger, TransparenciaDB connection, IEntidadBLL entidadesbll)
        {
            _logger = logger;
            _connection = connection;
            consolidadosEntidades = entidadesbll;
        }


        [HttpGet("GetConsolidadoPeriodos")]
        public ModelEntidadData GetConsolidadoPeriodos(int anyo, string codEntidad)
        {
            var objReturn = new ModelEntidadData();

            try
            {
                objReturn.InfoConsolidado = consolidadosEntidades.GetConsolidadoPeriodos(anyo, codEntidad);
                objReturn.Status = true;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = $"Error: {exception.Message}";
            }

            return objReturn;
        }

        

        [HttpGet("GetClasificacionesByEntidad")]
        public ModelEntidadData GetClasificacionesByEntidad(int annio, string codEntidad)
        {
            ModelEntidadData objReturn = new ModelEntidadData();
            try
            {
                objReturn.InfoProgramas = consolidadosEntidades.GetClasificacionesByEntidad(annio, codEntidad);
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

        [HttpGet("GetProyectosInvByClasificacion")]
        public ModelEntidadData GetProyectosInvByClasificacion(int annio, string codEntidad,string codFinalidad)
        {
            ModelEntidadData objReturn = new ModelEntidadData();
            try
            {
                objReturn.DetalleProyectos = consolidadosEntidades.GetProyectosInvByClasificacion(annio, codEntidad, codFinalidad);
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


        //-------------------------------------------------
        [HttpGet("GetProyectosPotPerEntidad")]
        public ModelEntidadData GetProyectosPotPerEntidad(string codEntidad)
        {
            ModelEntidadData objReturn = new ModelEntidadData();
            try
            {
                objReturn.ProyectosPot = consolidadosEntidades.GetProyectosPotPerEntidad(codEntidad);
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
