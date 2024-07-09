using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Negocios.Project;
using ModelContratistaData = PlataformaTransparencia.Modelos.Contratos.ModelContratistaData;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Contratos
{
  public class ContratosController : Controller
  {

    private readonly ILogger<ContratosController> _logger;
    private readonly TransparenciaDB _connection;



    public ContratosController(ILogger<ContratosController> logger, TransparenciaDB connection)
    {
      _logger = logger;
      _connection = connection;

***REMOVED***

    public IActionResult Index()
    {
      return View();
***REMOVED***
    public IActionResult Contratos()
    {
       ModelContratosConsolidados modelo = new ModelContratosConsolidados();

            var monedaQ = Request.Query["moneda"];
            var procesoQ = Request.Query["codproceso"];
            object moneda = "";
            if (monedaQ.Count > 0) { moneda = monedaQ[0]; ***REMOVED*** else { moneda = DBNull.Value; ***REMOVED***
            if (procesoQ.Count > 0) { modelo.CodigoProceso = procesoQ[0]; ***REMOVED*** else { modelo.CodigoProceso = null; ***REMOVED***

            int? maxyear = null;

            if (modelo.CodigoProceso == null)
            {
                maxyear = (from contr in _connection.VwContratosConsolidados
                           where( contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                  && contr.ValorContratado != null && contr.CodigoOrigenInformacion==0
                           orderby contr.Anio descending
                           select contr.Anio).First();

        ***REMOVED***
            else {

                maxyear = (from contr in _connection.VwContratosDetalles
                           where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                  && contr.ValorContratado != null
                                  && contr.CodigoProceso.Trim().Contains(modelo.CodigoProceso)
                                   && contr.CodigoOrigenInformacion == 0
                           orderby contr.AnioUltimaActualizacion descending
                           select contr.AnioUltimaActualizacion).First();


        ***REMOVED***

            modelo.Consolidados = (from contr in _connection.VwContratosConsolidados
                                   where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                   && contr.ValorContratado != null
                                   && contr.Anio== maxyear
                                   orderby contr.Anio descending
                                   group contr by new { contr.MonedaContrato, contr.CodigoOrigenInformacion, contr.OrigenInformacion ***REMOVED*** into datos
                                   select new ContratosConsolidado
                                   {
                                       OrigenInformacion = datos.Key.OrigenInformacion,
                                       CodigoOrigenInformacion = (int)datos.Key.CodigoOrigenInformacion,
                                       MonedaContrato = datos.Key.MonedaContrato,
                                       ValorContratado = datos.Sum(x => x.ValorContratado),
                                       NroContratos = datos.Sum(x => x.NroContratos),
                               ***REMOVED***).Distinct().ToList();


            modelo.selectCon = (from contr in _connection.VwContratosDetalles
                      where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                    && contr.ValorContratado != null
                      group contr by new { contr.CodigoOrigenInformacion, contr.OrigenInformacion ***REMOVED*** into datos
                      select new ContratosConsolidado
                      {
                          OrigenInformacion = datos.Key.OrigenInformacion,
                          CodigoOrigenInformacion = datos.Key.CodigoOrigenInformacion

                  ***REMOVED***).Distinct().ToList();



            modelo.Moneda = (moneda == DBNull.Value ? null: moneda.ToString());
            modelo.MaxYear = maxyear.ToString();
            return View(modelo);
***REMOVED***

        public IActionResult Contratista()
        {
            ModelContratistaData modelo = new ModelContratistaData();

            var _contratista = Request.Query["contratista"];

            modelo.Data = (from contr in _connection.VwContratosPerfilContratistas
                           where contr.Numerodocumento == _contratista.ToString() && contr.ValorTotalContratos != null
                           select new ContratistaData
                           {
                               Contratista = contr.Contratista,
                               Numerodocumento = contr.Numerodocumento,
                               Tipodocumento = contr.Tipodocumento,
                               ValorTotalContratos = contr.ValorTotalContratos,
                               NumContratos = contr.NumContratos,
                               NumProcesos = contr.NumProcesos,
                               MonedaContrato = contr.MonedaContrato,
                               OrigenInformacion= contr.OrigenInformacion,
                               CodigoOrigenInformacion=contr.CodigoOrigenInformacion

                       ***REMOVED***).Distinct().ToList();

            modelo.Consolidados = new List<ContratosConsolidado>();
            modelo.Consolidados.Add(new ContratosConsolidado { NroContratos = modelo.Data.Sum(l => l.NumContratos) , OrigenInformacion = "Todos", CodigoOrigenInformacion = -1 ***REMOVED***);
            foreach (var contratis in modelo.Data)
            {
                modelo.Consolidados.Add(new ContratosConsolidado { NroContratos = contratis.NumContratos, OrigenInformacion = contratis.OrigenInformacion, CodigoOrigenInformacion = contratis.CodigoOrigenInformacion ***REMOVED***);

        ***REMOVED***

         
            modelo.Contratista = _contratista;

           
            return View(modelo);
    ***REMOVED***

        public IActionResult Contrato()
        {
            ModelContrato modelo = new ModelContrato();
            ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

            var monedaQ = Request.Query["moneda"];
            var procesoQ = Request.Query["codproceso"];
            var contratoQ = Request.Query["codcontrato"];
            string id_usuario_aux;
            string nom_usuario_aux;
            id_usuario_aux = HttpContext.Session.GetString("IdUsuario");
            nom_usuario_aux = HttpContext.Session.GetString("NomUsuario");
            modelo.id_usu_participa = id_usuario_aux;
            modelo.nom_usu_participa = nom_usuario_aux;
            modelo.rol_participacion = part.ObtenerRolesProyAsync();
            modelo.genero_participacion = part.ObtenerGenerosProyAsync();
            modelo.medios_participacion = part.ObtenerMotivosProyAsync();
            modelo.tipo_comentario = part.ObtenerTipoComentarioAsync(3);
            Modelos.Contratos.Contrato query = new Modelos.Contratos.Contrato(); 

            if (monedaQ.Count > 0) { query.Moneda = monedaQ[0]; ***REMOVED*** else { query.Moneda = null; ***REMOVED***
            if (procesoQ.Count > 0) { query.CodigoProceso = procesoQ[0]; ***REMOVED*** else { query.CodigoProceso = null; ***REMOVED***
            if (contratoQ.Count > 0) { query.CodigoContrato = contratoQ[0]; ***REMOVED*** else { query.CodigoContrato = null; ***REMOVED***

            modelo.Query = new List<Modelos.Contratos.Contrato>();
            modelo.Query.Add(query);

            return View(modelo);
    ***REMOVED***

***REMOVED***
***REMOVED***
