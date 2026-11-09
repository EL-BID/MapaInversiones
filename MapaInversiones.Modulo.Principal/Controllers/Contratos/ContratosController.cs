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
using PlataformaTransparencia.Modelos.Emergencia;
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

    public IActionResult HomeContratos()
    {
        ModelHomeContratos Data = new ModelHomeContratos();
        Data.annios = ObtenerAnnios(0);
        Data.resumenDatosContratos= ObtenerDatosContratos(0, Data.annios[0]);
        Data.InfoRecursosContratos = ObtenerRecursosPerContratos(0, Data.annios[0]);
        Data.InfoRecursosProcesos = ObtenerRecursosPerProcesos(0, Data.annios[0]);
        return View(Data);
    }

    public IActionResult Contratos(string entidad = null)
    {
       ModelContratosConsolidados modelo = new ModelContratosConsolidados();

            var monedaQ = Request.Query["moneda"];
            var procesoQ = Request.Query["codproceso"];
            var annioQ = Request.Query["annio"];
            object moneda = "";
            object annio = "";
            if (monedaQ.Count > 0) { moneda = monedaQ[0]; } else { moneda = DBNull.Value; }
            if (annioQ.Count > 0) { annio = annioQ[0]; } else { annio = DBNull.Value; }
            if (procesoQ.Count > 0) { modelo.CodigoProceso = procesoQ[0]; } else { modelo.CodigoProceso = null; }

            int? maxyear = null;

            if (annio == null || annio.ToString()==""){
                if (modelo.CodigoProceso == null)
                {
                    maxyear = (from contr in _connection.VwContratosConsolidados
                               where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                      && contr.ValorContratado != null && contr.CodigoOrigenInformacion == 0
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
            }
            else { maxyear = int.Parse(annio.ToString()); }
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
            modelo.Entidad = entidad;
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
            modelo.Consolidados.Add(new ContratosConsolidado { NroContratos = modelo.Data.Sum(l => l.NumContratos) , OrigenInformacion = "Todos", CodigoOrigenInformacion = -1 });
            foreach (var contratis in modelo.Data)
            {
                modelo.Consolidados.Add(new ContratosConsolidado { NroContratos = contratis.NumContratos, OrigenInformacion = contratis.OrigenInformacion, CodigoOrigenInformacion = contratis.CodigoOrigenInformacion });

            }

         
            modelo.Contratista = _contratista;

           
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

       
        public IActionResult MonitoreoCiudadano()
        {
            ModelContratosConsolidados modelo = new ModelContratosConsolidados();
            var type = Request.Query.ContainsKey("type") ? Request.Query["type"].ToString() : string.Empty;
            modelo.tab_enlace = type;
            return PartialView(modelo);
        }



        private PlataformaTransparencia.Modelos.ModelContratistaData ObtenerDatosContratos(int origen, int? annio)
        {
            PlataformaTransparencia.Modelos.ModelContratistaData objReturn = new PlataformaTransparencia.Modelos.ModelContratistaData();

            var contratosByEntidad = (from consolidadoContrato in _connection.VwConsolidadoContratacions
                                      where consolidadoContrato.Origen.HasValue && consolidadoContrato.Origen == origen && consolidadoContrato.Anio==annio
                                      group consolidadoContrato by new { consolidadoContrato.Entidad } into g
                                      select new
                                      {
                                          g.Key.Entidad,
                                          ValorContratos = g.Sum(x => x.ValorContratado),
                                          NumContratos = g.Sum(x => x.NroContratos)
                                      }).ToList();
            if (contratosByEntidad.Count > 0)
            {
                objReturn.numContratos = contratosByEntidad.Sum(x => x.NumContratos);
                objReturn.valorContratos = contratosByEntidad.Sum(a => a.ValorContratos);
            }

            objReturn.listUnidadCompra = (from info in _connection.VwConsolidadoProcesosContratacions
                                          where info.Origen.HasValue && info.Origen == origen && info.ValorProceso.HasValue  && info.Anio == annio
                                         
                                          select new UnidadCompras
                                          {
                                              Entidad = info.Entidad,
                                              MonedaContrato = info.MonedaProceso,
                                              ValorContratado = 0,
                                              MonedaProceso = info.MonedaProceso,
                                              NroContratos = 0,
                                              ValorProceso = (double)info.ValorProceso,
                                              NroProcesos = info.NroProcesos,
                                              Annio=info.Anio
                                          }).ToList();
            if (objReturn.listUnidadCompra.Count > 0 && contratosByEntidad.Count > 0)
            {
                for (int i = 0; i < objReturn.listUnidadCompra.Count; i++)
                {
                    var contratoEntidad = contratosByEntidad.Where(x => x.Entidad.Contains(objReturn.listUnidadCompra[i].Entidad));
                    if (contratoEntidad != null)
                    {
                        for (int j = 0; j < contratoEntidad.Count(); j++)
                        {
                            objReturn.listUnidadCompra[i].NroContratos += contratoEntidad.ElementAt(j).NumContratos;
                            objReturn.listUnidadCompra[i].ValorContratado += contratoEntidad.ElementAt(j).ValorContratos;
                        }
                    }
                }
            }

            objReturn.listContratista = (from contratista in _connection.VwContratosPerfilContratistaXAnios
                                         where contratista.CodigoOrigenInformacion == origen && contratista.ValorContratado.HasValue && contratista.Anio==annio
                                         select new Modelos.Contratos.Contratista
                                         {
                                             nombre = contratista.Proveedor,
                                             ruc = contratista.Numerodocumento,
                                             tipodocumento = contratista.Tipodocumento,
                                             ValorTotalContratos = contratista.ValorContratado,
                                             NumContratos = contratista.NroContratos,
                                             OrigenInformacion = contratista.OrigenInformacion
                                         }
                                        ).ToList();


            objReturn.numProcesos = objReturn.listUnidadCompra.Sum(a => a.NroProcesos);
            objReturn.valorProcesos = (decimal?)objReturn.listUnidadCompra.Sum(a => a.ValorProceso);
            objReturn.listUnidadCompra = objReturn.listUnidadCompra.OrderByDescending(a => a.ValorContratado).Take(5).ToList();

            if (objReturn.listContratista.Count > 0) objReturn.listContratista = objReturn.listContratista.OrderByDescending(x => x.ValorTotalContratos).Take(5).ToList();
            return objReturn;
        }

        private List<InfoRecursosContratosPerObjeto> ObtenerRecursosPerContratos(int origen, int? annio)
        {
            List<InfoRecursosContratosPerObjeto> objReturn = new List<InfoRecursosContratosPerObjeto>();

            var RecursosPerObjetoQuery = (from info in _connection.VwConsolidadoContratacions
                                          where info.Origen == origen && info.Anio == annio
                                          group info by new { info.Entidad, info.EstadoContrato } into g
                                          select new InfoRecursosContratosPerObjeto
                                          {
                                              labelGroup = g.Key.Entidad,
                                              label = g.Key.EstadoContrato,
                                              label_inf = g.Key.EstadoContrato,
                                              rawValue = (decimal)g.Sum(z => z.ValorContratado),
                                              rawValueInt = (int)g.Sum(z => z.NroContratos)
                                          }).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf).ToList();

            objReturn = RecursosPerObjetoQuery;
            return objReturn;

        }

        private List<InfoRecursosContratosPerObjeto> ObtenerRecursosPerProcesos(int origen, int? annio)
        {
            List<InfoRecursosContratosPerObjeto> objReturn = new List<InfoRecursosContratosPerObjeto>();

            var RecursosPerObjetoQuery = (from info in _connection.VwConsolidadoProcesosContratacions
                                          where info.Origen == origen && info.Anio==annio
                                          group info by new { info.Entidad, info.EstadoProceso } into g
                                          select new InfoRecursosContratosPerObjeto
                                          {
                                              labelGroup = g.Key.Entidad,
                                              label = g.Key.EstadoProceso,
                                              label_inf = g.Key.EstadoProceso,
                                              rawValue = g.Sum(z => z.ValorProceso.Value),
                                              rawValueInt = (int)g.Sum(z => z.NroProcesos)
                                          }).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf).ToList();


            objReturn = RecursosPerObjetoQuery;

            return objReturn;
        }


        private List<int?> ObtenerAnnios(int origen)
        {
            List<int?> annios = new List<int?>();

            annios = (from info in _connection.VwConsolidadoContratacions
                      where info.Origen == origen
                      group info by  info.Anio into g
                      orderby g.Key descending
                      select g.Key
                      ).ToList();


            return annios;
        }

    }
}
