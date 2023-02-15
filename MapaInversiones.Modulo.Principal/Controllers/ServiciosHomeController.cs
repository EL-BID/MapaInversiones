using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AngleSharp.Dom.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Entidad;
using PlataformaTransparencia.Negocios.Home;
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
    private IConsolidadosNacionalesBLL consolidadosNacionales;
    private IEntidadBLL consolidadosEntidades;

    public ServiciosHomeController(ILogger<ServiciosHomeController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> solr, IConsolidadosNacionalesBLL consolidadosNacionalesBLL, IEntidadBLL entidadesbll)
    {
      _logger = logger;
      _connection = connection;
      _solr = solr;
      consolidadosNacionales = consolidadosNacionalesBLL;
      consolidadosEntidades = entidadesbll;

***REMOVED***



    ///ejemplo llamado get varios parametros
    //[HttpGet("obtCiudades/{city***REMOVED***/{country***REMOVED***")]
    //public string obtCiudades(string city, string country)
    //{
    //    return "obtCiudades";
    //***REMOVED***

    //[HttpGet("obtPais/{continente***REMOVED***")]
    //public string obtPais(string continente)
    //{
    //    return "obtPais";
    //***REMOVED***
  ***REMOVED***

***REMOVED***

