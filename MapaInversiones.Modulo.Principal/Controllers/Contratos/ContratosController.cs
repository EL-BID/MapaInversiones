using DataModels;
using LinqToDB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Emergencia;
using PlataformaTransparencia.Negocios.Project;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        //Data.resumenDatosContratos= ObtenerDatosContratos(0, Data.annios[0]);
        //Data.InfoRecursosContratos = ObtenerRecursosPerContratos(0, Data.annios[0]);
        //Data.InfoRecursosProcesos = ObtenerRecursosPerProcesos(0, Data.annios[0]);
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
                                      && contr.ValorContratado != null //&& contr.CodigoOrigenInformacion == 0
                               orderby contr.Anio descending
                               select contr.Anio).First();

                }
                else {

                    maxyear = (from contr in _connection.VwContratosDetalles
                               where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                      && contr.ValorContratado != null
                                      && contr.CodigoProceso.Trim().Contains(modelo.CodigoProceso)
                                       //&& contr.CodigoOrigenInformacion == 0
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
                                       //CodigoOrigenInformacion = (int)datos.Key.CodigoOrigenInformacion,
                                       MonedaContrato = datos.Key.MonedaContrato,
                                       ValorContratado = (double)datos.Sum(x => x.ValorContratado),
                                       NroContratos = datos.Sum(x => x.NroContratos),
                                   }).Distinct().ToList();



            modelo.Moneda = (moneda == DBNull.Value ? null: moneda.ToString());
            modelo.MaxYear = maxyear.ToString();
            modelo.Entidad = entidad;
            ViewData["ruta"] = "Contratos";
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

            ViewData["ruta"] = "Contratos";
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
            ViewData["ruta"] = "Contratos";
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
            var objReturn = new PlataformaTransparencia.Modelos.ModelContratistaData();

            // -----------------------------------------------
            // 1) Contratos agrupados por entidad (UNA consulta SQL)
            // -----------------------------------------------
            var contratosByEntidad = _connection.VwConsolidadoContratacions
                .Where(x => x.Anio == annio)
                .GroupBy(x => x.Entidad)
                .Select(g => new
                {
                    Entidad = g.Key,
                    ValorContratos = g.Sum(x => x.ValorContratado),
                    NumContratos = g.Sum(x => x.NroContratos)
                })
                .ToDictionary(x => x.Entidad, x => x);
            // ← optimización clave: acceso O(1)

            if (contratosByEntidad.Count > 0)
            {
                objReturn.numContratos = contratosByEntidad.Values.Sum(x => x.NumContratos);
                objReturn.valorContratos = contratosByEntidad.Values.Sum(x => x.ValorContratos);
            }


            //var algo = _connection.VwConsolidadoContratacions
            //   .Where(x => x.Anio == annio)
            //   .GroupBy(x => x.Entidad)
            //   .Select(g => new
            //   {
            //       Entidad = g.Key,
            //       ValorContratos = g.Sum(x => x.ValorContratado),
            //       NumContratos = g.Sum(x => x.NroContratos)
            //   });

            // -----------------------------------------------
            // 2) Procesos por entidad (SEGUNDA consulta SQL)
            // -----------------------------------------------
            objReturn.listUnidadCompra = _connection.VwConsolidadoProcesosContratacions
                .Where(x => x.ValorProceso != null && x.Anio == annio)
                .Select(info => new UnidadCompras
                {
                    Entidad = info.Entidad,
                    MonedaContrato = info.MonedaProceso,
                    ValorContratado = 0,
                    MonedaProceso = info.MonedaProceso,
                    NroContratos = 0,
                    ValorProceso = (double)info.ValorProceso!,
                    NroProcesos = info.NroProcesos,
                    Annio = info.Anio
                })
                .ToList();

    //       var aglo2 = _connection.VwConsolidadoProcesosContratacions
    //.Where(x => x.ValorProceso != null && x.Anio == annio)
    //.Select(info => new UnidadCompras
    //{
    //    Entidad = info.Entidad,
    //    MonedaContrato = info.MonedaProceso,
    //    ValorContratado = 0,
    //    MonedaProceso = info.MonedaProceso,
    //    NroContratos = 0,
    //    ValorProceso = (double)info.ValorProceso!,
    //    NroProcesos = info.NroProcesos,
    //    Annio = info.Anio
    //});


            // -----------------------------------------------
            // 3) MATCH DIRECTO usando Diccionario O(1)
            // -----------------------------------------------
            foreach (var u in objReturn.listUnidadCompra)
            {
                if (u.Entidad != null && contratosByEntidad.TryGetValue(u.Entidad, out var c))
                {
                    u.NroContratos = c.NumContratos;
                    u.ValorContratado = c.ValorContratos;
                }
            }

            // -----------------------------------------------
            // 4) Totales finales
            // -----------------------------------------------
            objReturn.numProcesos = objReturn.listUnidadCompra.Sum(a => a.NroProcesos);
            objReturn.valorProcesos = (decimal?)objReturn.listUnidadCompra.Sum(a => a.ValorProceso);

            return objReturn;
        }

        private List<InfoRecursosContratosPerObjeto> ObtenerRecursosPerContratos(int origen, int? annio)
        {
        //    var aglo = _connection.VwConsolidadoContratacions
        //        .Where(info => info.Anio == annio)
        //        .GroupBy(info => new { info.Entidad, info.EstadoContrato })
        //        .Select(g => new InfoRecursosContratosPerObjeto
        //        {
        //            labelGroup = g.Key.Entidad,
        //            label = g.Key.EstadoContrato,
        //            label_inf = g.Key.EstadoContrato,
        //            rawValue = g.Sum(z => z.ValorContratado) ?? 0,
        //            rawValueInt = g.Sum(z => z.NroContratos) ?? 0
        //        })
        //        .OrderBy(x => x.labelGroup)
        //        .ThenBy(x => x.label_inf);

            return _connection.VwConsolidadoContratacions
                .Where(info => info.Anio == annio)
                .GroupBy(info => new { info.Entidad, info.EstadoContrato })
                .Select(g => new InfoRecursosContratosPerObjeto
                {
                    labelGroup = g.Key.Entidad,
                    label = g.Key.EstadoContrato,
                    label_inf = g.Key.EstadoContrato,
                    rawValue = g.Sum(z => z.ValorContratado) ?? 0,
                    rawValueInt = g.Sum(z => z.NroContratos) ?? 0
                })
                .OrderBy(x => x.labelGroup)
                .ThenBy(x => x.label_inf)
                .ToList();

        }

        private List<InfoRecursosContratosPerObjeto> ObtenerRecursosPerProcesos(int origen, int? annio)
        {

            //var algo = _connection.VwConsolidadoProcesosContratacions
            //        .Where(info => info.Anio == annio)
            //        .GroupBy(info => new { info.Entidad, info.EstadoProceso })
            //        .Select(g => new InfoRecursosContratosPerObjeto
            //        {
            //            labelGroup = g.Key.Entidad,
            //            label = g.Key.EstadoProceso,
            //            label_inf = g.Key.EstadoProceso,

            //            rawValue = g.Sum(z => z.ValorProceso ?? 0),         // <-- seguro ante null
            //            rawValueInt = g.Sum(z => z.NroProcesos ?? 0)        // <-- seguro ante null
            //        })
            //        .OrderBy(x => x.labelGroup)
            //        .ThenBy(x => x.label_inf);

            return _connection.VwConsolidadoProcesosContratacions
                    .Where(info => info.Anio == annio)
                    .GroupBy(info => new { info.Entidad, info.EstadoProceso })
                    .Select(g => new InfoRecursosContratosPerObjeto
                    {
                        labelGroup = g.Key.Entidad,
                        label = g.Key.EstadoProceso,
                        label_inf = g.Key.EstadoProceso,

                        rawValue = g.Sum(z => z.ValorProceso ?? 0),         // <-- seguro ante null
                        rawValueInt = g.Sum(z => z.NroProcesos ?? 0)        // <-- seguro ante null
                    })
                    .OrderBy(x => x.labelGroup)
                    .ThenBy(x => x.label_inf)
                    .ToList();
        }


        private List<int?> ObtenerAnnios(int origen)
        {
            List<int?> annios = new List<int?>();

            annios = _connection.Contratos
               .Where(x => x.FechaInicioEjecucionContrato != null || x.FechaInicioContrato != null)
               .Select(x => x.AnioContrato)
               .Distinct()
               .OrderByDescending(x => x)
               .ToList();
            return annios;

        }

    }
}
