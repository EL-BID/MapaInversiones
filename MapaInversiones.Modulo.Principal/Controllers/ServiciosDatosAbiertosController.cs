using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Home;
using SolrNet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    [ApiController]
    [Route("api/serviciosdatosabiertos")]
    public class ServiciosDatosAbiertosController: Controller 
    {

        private readonly ILogger<ServiciosHomeController> _logger;
        private readonly TransparenciaDB _connection;
        private ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> _solr;
        private IDatosAbiertosBLL datosAbiertos;

        public ServiciosDatosAbiertosController(ILogger<ServiciosHomeController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> solr, IDatosAbiertosBLL DatosAbiertosNewBLL)
        {
            _logger = logger;
            _connection = connection;
            _solr = solr;
            datosAbiertos = DatosAbiertosNewBLL;

        }

        [HttpGet("ObtenerFuentesDatos")]
        public ModelDatosAbiertosData ObtenerFuentesDatos()
        {
            ModelDatosAbiertosData objReturn = new ModelDatosAbiertosData();
            try
            {
                objReturn.FuentesRecursos = datosAbiertos.ObtenerFuentesDatosAbiertos();
                objReturn.Status = true;

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
