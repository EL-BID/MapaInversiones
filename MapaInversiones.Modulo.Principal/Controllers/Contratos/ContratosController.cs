using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos.Contratos;

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

    }

    public IActionResult Index()
    {
      return View();
    }
    public IActionResult Contratos()
    {
       ModelContratosConsolidados modelo = new ModelContratosConsolidados();

            var monedaQ = Request.Query["moneda"];
            var procesoQ = Request.Query["codproceso"];
            object moneda = "";
            if (monedaQ.Count > 0) { moneda = monedaQ[0]; } else { moneda = DBNull.Value; }
            if (procesoQ.Count > 0) { modelo.CodigoProceso = procesoQ[0]; } else { modelo.CodigoProceso = null; }
            //modelo.Consolidados = (from contr in _connection.VwContratosConsolidados
            //                       where contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value
            //                       group contr by new { contr.EstadoContrato, contr.MonedaContrato } into datos
            //                       select new ContratosConsolidado
            //                       {
            //                           EstadoContrato=datos.Key.EstadoContrato,
            //                           MonedaContrato = datos.Key.MonedaContrato,
            //                           ValorContratado = datos.Sum(x=>x.ValorContratado),
            //                           NroContratos = datos.Sum(x => x.NroContratos),
            //                       }).Distinct().ToList();

            int? maxyear = null;

            if (modelo.CodigoProceso == null)
            {
                maxyear = (from contr in _connection.VwContratosConsolidados
                           where( contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                  && contr.ValorContratado != null
                           orderby contr.Anio descending
                           select contr.Anio).First();

            }
            else {

                maxyear = (from contr in _connection.VwContratosDetalles
                           where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                  && contr.ValorContratado != null
                                  && contr.CodigoProceso.Trim().Contains(modelo.CodigoProceso)
                           orderby contr.AnioUltimaActualizacion descending
                           select contr.AnioUltimaActualizacion).First();


            }

            modelo.Consolidados = (from contr in _connection.VwContratosConsolidados
                                   where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                   && contr.ValorContratado != null
                                   && contr.Anio== maxyear
                                   orderby contr.Anio descending
                                   group contr by new { contr.MonedaContrato, contr.OrigenInformacion } into datos
                                   select new ContratosConsolidado
                                   {
                                       OrigenInformacion = datos.Key.OrigenInformacion,
                                       MonedaContrato = datos.Key.MonedaContrato,
                                       ValorContratado = datos.Sum(x => x.ValorContratado),
                                       NroContratos = datos.Sum(x => x.NroContratos),
                                   }).Distinct().ToList();
            //select new ContratosConsolidado
            //{
            //    OrigenInformacion = contr.OrigenInformacion,
            //    MonedaContrato = contr.MonedaContrato,
            //    ValorContratado = contr.ValorContratado,
            //    NroContratos = contr.NroContratos,
            //}).Distinct().ToList();

            //var Consolidados = (from contr in _connection.VwContratosConsolidados
            //                    where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
            //                       && contr.ValorContratado != null
            //                       && contr.Anio == maxyear
            //                    select new ContratosConsolidado
            //                    {
            //                        OrigenInformacion = contr.OrigenInformacion,
            //                        MonedaContrato = contr.MonedaContrato,
            //                        ValorContratado = contr.ValorContratado,
            //                        NroContratos = contr.NroContratos,
            //                    }).Distinct();



            modelo.selectCon = (from contr in _connection.VwContratosDetalles
                      where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                    && contr.ValorContratado != null
                      group contr by new { contr.OrigenInformacion } into datos
                      select new ContratosConsolidado
                      {
                          OrigenInformacion = datos.Key.OrigenInformacion

                      }).Distinct().ToList();



            modelo.Moneda = (moneda == DBNull.Value ? null: moneda.ToString());
            modelo.MaxYear = maxyear.ToString();
            return View(modelo);
    }

        public IActionResult Contratista()
        {
            ModelContratistaData modelo = new ModelContratistaData();

            var _contratista = Request.Query["contratista"];

            modelo.Data = (from contr in _connection.VwContratosPerfilContratistas
                           where contr.Identificador == _contratista.ToString() && contr.ValorTotalContratos != null
                           select new ContratistaData
                           {
                               Contratista = contr.Contratista,
                               Identificador = contr.Identificador,
                               ValorTotalContratos = contr.ValorTotalContratos,
                               NumContratos = contr.NumContratos,
                               NumProcesos = contr.NumProcesos,
                               MonedaContrato = contr.MonedaContrato,
                               OrigenInformacion= contr.OrigenInformacion

                           }).Distinct().ToList();


            //var dat = (from contr in _connection.VwContratosPerfilContratistas
            //           where contr.Identificador == _contratista.ToString()
            //           select new ContratistaData
            //           {
            //               Contratista = contr.Contratista,
            //               Identificador = contr.Identificador,
            //               ValorTotalContratos = contr.ValorTotalContratos,
            //               NumContratos = contr.NumContratos,
            //               NumProcesos = contr.NumProcesos,
            //               MonedaContrato = contr.MonedaContrato,
            //               OrigenInformacion = contr.OrigenInformacion

            //           }).Distinct();
            modelo.Contratista = _contratista;

            modelo.OrigenInformacion = (from contr in _connection.VwContratosPerfilContratistas
                                        where contr.Identificador == _contratista.ToString() && contr.OrigenInformacion !=null && contr.ValorTotalContratos != null
                                        select contr.OrigenInformacion).Distinct().ToList();
                                        
            return View(modelo);
        }


    }
}
