using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Emprestitos;
using PlataformaTransparencia.Negocios.Interfaces;
using SolrNet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    [Route("api/ServiciosEmprestitos")]
    public class ServiciosEmprestitosController:Controller
    {

        private readonly ILogger<ServiciosEmprestitosController> _logger;
        private readonly TransparenciaDB _connection;
        private IEmprestitosBLL consolidadosEmprestitosBLL;


        public ServiciosEmprestitosController(ILogger<ServiciosEmprestitosController> logger, TransparenciaDB connection, IEmprestitosBLL emprestitosBLL)
        {
            _logger = logger;
            _connection = connection;
            consolidadosEmprestitosBLL = emprestitosBLL;
        }

        [HttpGet("GetProyectosPerCredito")]
        public ModelEmprestitoData GetProyectosPerCredito(string codEntidad)
        {
            ModelEmprestitoData objReturn = new ModelEmprestitoData();
            try
            {
                objReturn.Proyectos = consolidadosEmprestitosBLL.GetProyectosPerCredito(codEntidad);
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
