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

            int? maxyear = null;

            if (modelo.CodigoProceso == null)
            {
                maxyear = (from contr in _connection.VwContratosConsolidados
                           where( contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                  && contr.ValorContratado != null && contr.CodigoOrigenInformacion==0
                           orderby contr.Anio descending
                           select contr.Anio).First();

            }
            else {

                maxyear = (from contr in _connection.VwContratosDetalles
                           where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                  && contr.ValorContratado != null
                                  && contr.CodigoProceso.Trim().Contains(modelo.CodigoProceso)
                                   && contr.CodigoOrigenInformacion == 0
                           orderby contr.AnioUltimaActualizacion descending
                           select contr.AnioUltimaActualizacion).First();


            }

            modelo.Consolidados = (from contr in _connection.VwContratosConsolidados
                                   where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                   && contr.ValorContratado != null
                                   && contr.Anio== maxyear
                                   orderby contr.Anio descending
                                   group contr by new { contr.MonedaContrato, contr.CodigoOrigenInformacion, contr.OrigenInformacion } into datos
                                   select new ContratosConsolidado
                                   {
                                       OrigenInformacion = datos.Key.OrigenInformacion,
                                       CodigoOrigenInformacion = (int)datos.Key.CodigoOrigenInformacion,
                                       MonedaContrato = datos.Key.MonedaContrato,
                                       ValorContratado = datos.Sum(x => x.ValorContratado),
                                       NroContratos = datos.Sum(x => x.NroContratos),
                                   }).Distinct().ToList();


            modelo.selectCon = (from contr in _connection.VwContratosDetalles
                      where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                    && contr.ValorContratado != null
                      group contr by new { contr.CodigoOrigenInformacion, contr.OrigenInformacion } into datos
                      select new ContratosConsolidado
                      {
                          OrigenInformacion = datos.Key.OrigenInformacion,
                          CodigoOrigenInformacion = datos.Key.CodigoOrigenInformacion

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

                           }).Distinct().ToList();

            modelo.Consolidados = new List<ContratosConsolidado>();

            //foreach (var contratis in modelo.Data)
            //{
            //    modelo.Consolidados.Add(new ContratosConsolidado { NroContratos = contratis.NumContratos, OrigenInformacion = contratis.OrigenInformacion, CodigoOrigenInformacion = contratis.CodigoOrigenInformacion });

            //}

            modelo.Consolidados = modelo.Data
            .GroupBy(x => new { x.OrigenInformacion, x.CodigoOrigenInformacion })
            .Select(g => new ContratosConsolidado
            {
                OrigenInformacion = g.Key.OrigenInformacion,
                CodigoOrigenInformacion = g.Key.CodigoOrigenInformacion,
                NroContratos = g.Sum(x => x.NumContratos)
            })
            .ToList();
            modelo.Consolidados.Add(new ContratosConsolidado { NroContratos = modelo.Data.Sum(l => l.NumContratos), OrigenInformacion = "Todos", CodigoOrigenInformacion = -1 });
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

            //modelo.OrigenInformacion = (from contr in _connection.VwContratosPerfilContratistas
            //                            where contr.Numerodocumento == _contratista.ToString() && contr.OrigenInformacion !=null && contr.ValorTotalContratos != null
            //                            select contr.OrigenInformacion).Distinct().ToList();
                                        
            return View(modelo);
        }

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

            if (monedaQ.Count > 0) { query.Moneda = monedaQ[0]; } else { query.Moneda = null; }
            if (procesoQ.Count > 0) { query.CodigoProceso = procesoQ[0]; } else { query.CodigoProceso = null; }
            if (contratoQ.Count > 0) { query.CodigoContrato = contratoQ[0]; } else { query.CodigoContrato = null; }

            modelo.Query = new List<Modelos.Contratos.Contrato>();
            modelo.Query.Add(query);

            return View(modelo);
        }

    }
}
