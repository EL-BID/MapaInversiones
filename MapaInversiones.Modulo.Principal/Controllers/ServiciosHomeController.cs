using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataModels;
//using AngleSharp.Dom.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Entidad;
using PlataformaTransparencia.Negocios.Home;
using PlataformaTransparencia.Negocios.Interfaces;
using SolrNet;
using SolrNet.Commands.Parameters;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  [Route("api/servicioshome")]

  public class ServiciosHomeController : Controller
  {
    
        private readonly ILogger<ServiciosHomeController> _logger;
        private readonly TransparenciaDB _connection;
        private ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> _solr;
        private IHomeBLL consolidadosHome;
        private IFinanciadorBLL _financiadorBLL;

        public ServiciosHomeController(ILogger<ServiciosHomeController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> solr, IHomeBLL consolidadosHomeBLL, IFinanciadorBLL financiadorBLL)
        {
            _logger = logger;
            _connection = connection;
            _solr = solr;
            consolidadosHome = consolidadosHomeBLL;
            _financiadorBLL = financiadorBLL;

        }


        [HttpGet("ObtenerPorcentajeParticipacionSector")]
        public ModelHomeData ObtenerPorcentajeParticipacionSector(string Annio)
        {
            ModelHomeData objReturn = new();
            try
            {
                objReturn.ParticipacionSector = consolidadosHome.ObtenerPorcentajeParticipacionSector(Annio);
                objReturn.Status = true;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
            }
            return objReturn;
        }



        [HttpGet("ObtenerPorcentajeParticipacionEntidad")]
        public ModelHomeData ObtenerPorcentajeParticipacionEntidad(string Annio)
        {
            ModelHomeData objReturn = new();
            try
            {
                objReturn.ParticipacionEntidad = consolidadosHome.ObtenerPorcentajeParticipacionEntidad(Annio);
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

