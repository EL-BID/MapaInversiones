using LinqToDB;
using LinqToDB.Mapping;
using Microsoft.EntityFrameworkCore;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Emergencia;
using SolrNet.Commands.Parameters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Negocios.Contratos
{
   public class ContratosBLL
    {
        private readonly TransparenciaDB _connection;

        public ContratosBLL(TransparenciaDB connection)
        {
            _connection = connection;
            _connection.CommandTimeout = 180;
        }


        public ModelContratosAnios ObtenerAnniosContratos(string Moneda,string NombreProcesoo)
        {
            ModelContratosAnios _objreturn = new ModelContratosAnios();
            String Monedac = null;
            String NombreProceso = null;
            if (NombreProcesoo != null && NombreProcesoo.Trim() != "") { NombreProceso = NombreProcesoo; }
            if (Moneda != null && Moneda.Trim() != "") { Monedac = Moneda; }
            _objreturn.Detalles = (from cont in _connection.VwContratosConsolidados //VwContratosDetalles
                                   where (cont.MonedaContrato.Contains(Moneda) || Moneda == null)
                                   // &&(cont.CodigoProceso.TrimStart().Contains(NombreProceso) || cont.DescripcionProceso.Contains(NombreProceso) || NombreProceso == null)
                                   group cont by cont.Anio into g
                                    orderby g.Key.Value descending
                                    select new AnioContrato
                                    {
                                    valor= g.Key.Value
                                    }).ToList(); //.Distinct()


            return _objreturn;
        }

        public ModelContratosAnios ObtenerAnniosContratistas(string Contratista)
        {
            ModelContratosAnios _objreturn = new ModelContratosAnios();

            _objreturn.Detalles = (from cont in _connection.VwContratosDetalles
                                   where (cont.CodigoProveedor.Contains(Contratista) || Contratista == null) && cont.ValorContratado != null
                                   group cont by cont.AnioUltimaActualizacion into g
                                   orderby g.Key.Value descending
                                   select new AnioContrato
                                   {
                                       valor = g.Key.Value
                                   }).Distinct().ToList();
            var algo = (from cont in _connection.VwContratosDetalles
                        where (cont.CodigoProveedor.Contains(Contratista) || Contratista == null) && cont.ValorContratado != null
                        group cont by cont.AnioUltimaActualizacion into g
                        orderby g.Key.Value descending
                        select new AnioContrato
                        {
                            valor = g.Key.Value
                        }).Distinct();
            return _objreturn;
        }

        //public ModelContratosData ObtenerInformacionContratosPorFiltros(ContratosFiltros filtros)
        //{
        //    var _objreturn = new ModelContratosData();

        //    // Preparar variables filtradas
        //    string NombreProceso = string.IsNullOrWhiteSpace(filtros.NombreProceso) ? null : filtros.NombreProceso;
        //    string NombreEntidad = string.IsNullOrWhiteSpace(filtros.NombreEntidad) ? null : filtros.NombreEntidad;
        //    string CodigoProveedor = string.IsNullOrWhiteSpace(filtros.CodigoProveedor) ? null : filtros.CodigoProveedor;
        //    string CodigoContrato = string.IsNullOrWhiteSpace(filtros.CodigoContrato) ? null : filtros.CodigoContrato;
        //    string CodigoComprador = string.IsNullOrWhiteSpace(filtros.CodigoComprador) ? null : filtros.CodigoComprador;
        //    string Estado = string.IsNullOrWhiteSpace(filtros.Estado) ? null : filtros.Estado;
        //    string Moneda = string.IsNullOrWhiteSpace(filtros.Moneda) ? null : filtros.Moneda;
        //    int? OrigenInformacion = string.IsNullOrWhiteSpace(filtros.OrigenInformacion) ? null : int.Parse(filtros.OrigenInformacion);
        //    int? Annio = filtros.Annio > 0 ? filtros.Annio : (int?)null;

        //    try
        //    {
        //        // Construir query base
        //        var query = _connection.VwContratosDetalles.AsQueryable();

        //        if (Annio != null)
        //            query = query.Where(c => c.AnioUltimaActualizacion == Annio);

        //        if (!string.IsNullOrEmpty(NombreEntidad))
        //            query = query.Where(c => c.Comprador.Contains(NombreEntidad));

        //        if (!string.IsNullOrEmpty(Estado))
        //            query = query.Where(c => c.EstadoProceso.Contains(Estado));

        //        if (!string.IsNullOrEmpty(NombreProceso))
        //            query = query.Where(c => c.DescripcionProceso.Contains(NombreProceso) ||
        //                                     c.CodigoProceso.TrimStart() == NombreProceso);

        //        if (!string.IsNullOrEmpty(CodigoProveedor))
        //            query = query.Where(c => c.CodigoProveedor == CodigoProveedor);

        //        if (!string.IsNullOrEmpty(CodigoContrato))
        //            query = query.Where(c => c.CodigoContrato == CodigoContrato);

        //        if (!string.IsNullOrEmpty(CodigoComprador))
        //            query = query.Where(c => c.CodigoComprador == CodigoComprador);

        //        if (OrigenInformacion != null)
        //            query = query.Where(c => c.CodigoOrigenInformacion == OrigenInformacion);

        //        query = query.Where(c => c.ValorContratado != null);

        //        // Calcular DenseRank solo una vez
        //        var rankedQuery = from cont in query
        //                          let NUMBER = Sql.Ext.DenseRank()
        //                              .Over()
        //                              .OrderBy(cont.Comprador)
        //                              .ThenBy(cont.CodigoProceso)
        //                              .ThenBy(cont.OrigenInformacion)
        //                              .ToValue()
        //                          select new { Cont = cont, NUMBER };

        //        // Total de registros (máximo NUMBER)
        //        _objreturn.CantidadTotalRegistros = rankedQuery
        //            .Select(x => x.NUMBER)
        //            .DefaultIfEmpty(0)
        //            .Max();

        //        // Paginación
        //        int skipFrom = (filtros.NumeroPagina - 1) * filtros.RegistrosPorPagina;
        //        int skipTo = filtros.NumeroPagina * filtros.RegistrosPorPagina;

        //        _objreturn.Data = rankedQuery
        //            .Where(x => x.NUMBER > skipFrom && x.NUMBER <= skipTo)
        //            .Select(x => new ContratosData
        //            {
        //                AnioUltimaActualizacion = x.Cont.AnioUltimaActualizacion,
        //                DescripcionProceso = x.Cont.DescripcionProceso,
        //                EstadoProceso = x.Cont.EstadoProceso,
        //                CodigoContrato = x.Cont.CodigoContrato,
        //                CodigoProceso = x.Cont.CodigoProceso,
        //                CodigoProveedor = x.Cont.CodigoProveedor,
        //                TipoCodigoProveedor = x.Cont.TipoCodigoProveedor,
        //                Contratista = x.Cont.Contratista,
        //                ValorPlaneado = (double)x.Cont.ValorPlaneado,
        //                ValorAdjudicado = x.Cont.ValorAdjudicado,
        //                ValorContratado = (double)x.Cont.ValorContratado,
        //                MonedaContrato = x.Cont.MonedaContrato,
        //                UrlContrato = x.Cont.UrlContrato.ToString(),
        //                CodigoComprador = x.Cont.CodigoComprador,
        //                Comprador = x.Cont.Comprador,
        //                EntidadOrigenFondos = x.Cont.EntidadOrigenFondos.ToString(),
        //                OrigenFondos = x.Cont.OrigenFondos.ToString(),
        //                DocURL = x.Cont.DocURL,
        //                OrigenInformacion = x.Cont.OrigenInformacion,
        //                FechaInicioContrato = x.Cont.FechaInicioContrato,
        //                FechaFinContrato = x.Cont.FechaFinContrato,
        //                FechaInicioEjecucionContrato = x.Cont.FechaInicioEjecucionContrato,
        //                FechaFinEjecucionContrato = x.Cont.FechaFinEjecucionContrato,
        //                FechaEstimadaAdjudicacion = x.Cont.FechaEstimadaAdjudicacion,
        //                FechaIncioPublicacionProceso = x.Cont.FechaIncioPublicacionProceso,
        //                FechaInicioRecepcionOfertas = x.Cont.FechaInicioRecepcionOfertas,
        //                DescripcionContrato = x.Cont.DescripcionContrato
        //            })
        //            .ToList();
        //    }
        //    catch
        //    {
        //        _objreturn.CantidadTotalRegistros = 0;
        //        _objreturn.Data = new List<ContratosData>();
        //    }

        //    return _objreturn;
        //}

        public ModelContratosData ObtenerInformacionContratosPorFiltros(ContratosFiltros filtros)
        {
            var _objreturn = new ModelContratosData();

            // Variables de filtros con limpieza
            string NombreProceso = string.IsNullOrWhiteSpace(filtros.NombreProceso) ? null : filtros.NombreProceso;
            string NombreEntidad = string.IsNullOrWhiteSpace(filtros.NombreEntidad) ? null : filtros.NombreEntidad;
            string CodigoProveedor = string.IsNullOrWhiteSpace(filtros.CodigoProveedor) ? null : filtros.CodigoProveedor;
            string CodigoContrato = string.IsNullOrWhiteSpace(filtros.CodigoContrato) ? null : filtros.CodigoContrato;
            string CodigoComprador = string.IsNullOrWhiteSpace(filtros.CodigoComprador) ? null : filtros.CodigoComprador;
            string Estado = string.IsNullOrWhiteSpace(filtros.Estado) ? null : filtros.Estado;
            string Moneda = string.IsNullOrWhiteSpace(filtros.Moneda) ? null : filtros.Moneda;
            int? OrigenInformacion = string.IsNullOrWhiteSpace(filtros.OrigenInformacion) ? null : int.Parse(filtros.OrigenInformacion);
            int? Annio = filtros.Annio > 0 ? filtros.Annio : (int?)null;

            try
            {
                var query =
                 _connection.VwContratosDetalles
                 .Where(c => c.ValorContratado != null);

                // --- Filtros dinámicos optimizados ---
                if (Annio != null)
                    query = query.Where(c => c.AnioUltimaActualizacion == Annio);

                // 🔥 AJUSTE IMPORTANTE: evitar LIKE "%%" cuando viene vacío
                if (!string.IsNullOrWhiteSpace(NombreEntidad))
                    query = query.Where(c => Sql.Like(c.Comprador, "%" + NombreEntidad + "%"));

                if (Estado != null)
                    query = query.Where(c => Sql.Like(c.EstadoProceso, "%" + Estado + "%"));

                if (NombreProceso != null)
                    query = query.Where(c =>
                        Sql.Like(c.DescripcionProceso, "%" + NombreProceso + "%") ||
                        c.CodigoProceso == NombreProceso);

                if (CodigoProveedor != null)
                    query = query.Where(c => c.CodigoProveedor == CodigoProveedor);

                if (CodigoContrato != null)
                    query = query.Where(c => c.CodigoContrato == CodigoContrato);

                if (CodigoComprador != null)
                    query = query.Where(c => c.CodigoComprador == CodigoComprador);

                if (OrigenInformacion != null)
                    query = query.Where(c => c.CodigoOrigenInformacion == OrigenInformacion);

                // --- Proyección reducida antes del ranking (OPTIMIZA PLAN MUCHÍSIMO) ---
                var baseQuery =
                    query.Select(c => new
                    {
                        c.AnioUltimaActualizacion,
                        c.DescripcionProceso,
                        c.EstadoProceso,
                        c.CodigoContrato,
                        c.CodigoProceso,
                        c.CodigoProveedor,
                        c.TipoCodigoProveedor,
                        c.Contratista,
                        c.ValorPlaneado,
                        c.ValorAdjudicado,
                        c.ValorContratado,
                        c.MonedaContrato,
                        c.UrlContrato,
                        c.CodigoComprador,
                        c.Comprador,
                        c.EntidadOrigenFondos,
                        c.OrigenFondos,
                        c.DocURL,
                        c.OrigenInformacion,
                        c.FechaInicioContrato,
                        c.FechaFinContrato,
                        c.FechaInicioEjecucionContrato,
                        c.FechaFinEjecucionContrato,
                        c.FechaEstimadaAdjudicacion,
                        c.FechaIncioPublicacionProceso,
                        c.FechaInicioRecepcionOfertas,
                        c.DescripcionContrato
                    });

                // --- DenseRank en una sola subquery ---
                var ranked =
                    from t in baseQuery
                    let RankNum = Sql.Ext.DenseRank()
                        .Over()
                        .OrderBy(t.Comprador)
                        .ThenBy(t.CodigoProceso)
                        .ThenBy(t.OrigenInformacion)
                        .ToValue()
                    select new { t, RankNum };

                // --- Total optimizado ---
                _objreturn.CantidadTotalRegistros =
                    ranked.Select(x => x.RankNum).Max();

                // --- Paginación SQL (mucho más eficiente) ---
                int startRank = (filtros.NumeroPagina - 1) * filtros.RegistrosPorPagina;
                int endRank = filtros.NumeroPagina * filtros.RegistrosPorPagina;

              

                _objreturn.Data =
                    ranked
                        .Where(x => x.RankNum > startRank && x.RankNum <= endRank)
                        .OrderBy(x => x.t.Comprador)
                        .ThenBy(x => x.t.CodigoProceso)
                        .ThenBy(x => x.t.OrigenInformacion)
                        .Select(x => new ContratosData
                        {
                            AnioUltimaActualizacion = x.t.AnioUltimaActualizacion,
                            DescripcionProceso = x.t.DescripcionProceso,
                            EstadoProceso = x.t.EstadoProceso,
                            CodigoContrato = x.t.CodigoContrato,
                            CodigoProceso = x.t.CodigoProceso,
                            CodigoProveedor = x.t.CodigoProveedor,
                            TipoCodigoProveedor = x.t.TipoCodigoProveedor,
                            Contratista = x.t.Contratista,
                            ValorPlaneado = (double)x.t.ValorPlaneado,
                            ValorAdjudicado = x.t.ValorAdjudicado,
                            ValorContratado = (double)x.t.ValorContratado,
                            MonedaContrato = x.t.MonedaContrato,
                            UrlContrato = x.t.UrlContrato.ToString(),
                            CodigoComprador = x.t.CodigoComprador,
                            Comprador = x.t.Comprador,
                            EntidadOrigenFondos = x.t.EntidadOrigenFondos.ToString(),
                            OrigenFondos = x.t.OrigenFondos.ToString(),
                            DocURL = x.t.DocURL,
                            OrigenInformacion = x.t.OrigenInformacion,
                            FechaInicioContrato = x.t.FechaInicioContrato,
                            FechaFinContrato = x.t.FechaFinContrato,
                            FechaInicioEjecucionContrato = x.t.FechaInicioEjecucionContrato,
                            FechaFinEjecucionContrato = x.t.FechaFinEjecucionContrato,
                            FechaEstimadaAdjudicacion = x.t.FechaEstimadaAdjudicacion,
                            FechaIncioPublicacionProceso = x.t.FechaIncioPublicacionProceso,
                            FechaInicioRecepcionOfertas = x.t.FechaInicioRecepcionOfertas,
                            DescripcionContrato = x.t.DescripcionContrato
                        })
                        .ToList();
            }
            catch
            {
                _objreturn.CantidadTotalRegistros = 0;
                _objreturn.Data = new List<ContratosData>();
            }

            return _objreturn;
        }



        public ModelContratosData ObtenerInformacionContratistaPorFiltros(ContratosFiltros filtros)
        {
            ModelContratosData _objreturn = new ModelContratosData();
            String NombreProceso = null;
            String NombreEntidad = null;
            String CodigoProveedor = null;
            String Estado = null;
            String Moneda = null;
            String OrigenInformacion = null;
            int? Annio = null;

            if (filtros.NombreProceso != null && filtros.NombreProceso.Trim() != "") { NombreProceso = filtros.NombreProceso; }
            if (filtros.NombreEntidad != null && filtros.NombreEntidad.Trim() != "") { NombreEntidad = filtros.NombreEntidad; }
            if (filtros.CodigoProveedor != null && filtros.CodigoProveedor.Trim() != "") { CodigoProveedor = filtros.CodigoProveedor; }
            if (filtros.Estado != null && filtros.Estado.Trim() != "") { Estado = filtros.Estado; }
            if (filtros.Moneda != null && filtros.Moneda.Trim() != "") { Moneda = filtros.Moneda; }
            if (filtros.OrigenInformacion != null && filtros.OrigenInformacion.Trim() != "") { OrigenInformacion = filtros.OrigenInformacion; }
            if (filtros.Annio > 0) { Annio = filtros.Annio; }

            try
            {
                _objreturn.CantidadTotalRegistros = (from cont in _connection.VwContratosDetalles
                                                     where (cont.AnioUltimaActualizacion == Annio || Annio == null)
                                                       && (cont.MonedaContrato.Contains(Moneda) || Moneda == null)
                                                       && (cont.Comprador.Contains(NombreEntidad) || NombreEntidad == null)
                                                       && (cont.EstadoProceso.Contains(Estado) || Estado == null)
                                                       && (cont.CodigoProceso.TrimStart().Contains(NombreProceso) || cont.DescripcionProceso.Contains(NombreProceso) || NombreProceso == null)
                                                       && (cont.CodigoProveedor == CodigoProveedor || CodigoProveedor == null)
                                                       && (cont.OrigenInformacion.Contains(OrigenInformacion) || OrigenInformacion == null)
                                                       && cont.ValorContratado != null
                                                     let NUMBER = Sql.Ext.DenseRank().Over().OrderBy(cont.Comprador).ThenBy(cont.CodigoProceso).ThenBy(cont.OrigenInformacion).ToValue()
                                                     orderby NUMBER descending
                                                     select NUMBER
                                       ).First();
            }
            catch {

                _objreturn.CantidadTotalRegistros = 0;
            }

         

            _objreturn.Data = (from cont in _connection.VwContratosDetalles
                               where
                               (cont.AnioUltimaActualizacion == Annio || Annio == null)
                               && (cont.MonedaContrato.Contains(Moneda) || Moneda == null)
                               && (cont.Comprador.Contains(NombreEntidad) || NombreEntidad == null)
                               && (cont.EstadoProceso.Contains(Estado) || Estado == null)
                               && (cont.CodigoProceso.TrimStart().Contains(NombreProceso) || cont.DescripcionProceso.Contains(NombreProceso) || NombreProceso == null)
                               && (cont.CodigoProveedor == CodigoProveedor || CodigoProveedor == null)
                               && (cont.OrigenInformacion.Contains(OrigenInformacion) || OrigenInformacion == null)
                               && cont.ValorContratado != null
                               let NUMBER = Sql.Ext.DenseRank().Over().OrderBy(cont.Comprador).ThenBy(cont.CodigoProceso).ThenBy(cont.OrigenInformacion).ToValue()
                               where
                               NUMBER > ((filtros.NumeroPagina - 1) * filtros.RegistrosPorPagina)
                               && NUMBER <= (filtros.NumeroPagina * filtros.RegistrosPorPagina)
                               select new ContratosData
                               {
                                   AnioUltimaActualizacion = cont.AnioUltimaActualizacion,
                                   DescripcionProceso = cont.DescripcionProceso,
                                   EstadoProceso = cont.EstadoProceso,
                                   CodigoContrato = cont.CodigoContrato,
                                   CodigoProceso = cont.CodigoProceso,
                                   CodigoProveedor = cont.CodigoProveedor,
                                   TipoCodigoProveedor =cont.TipoCodigoProveedor,
                                   Contratista = cont.Contratista,
                                   ValorPlaneado = (double)cont.ValorPlaneado,
                                   ValorAdjudicado = cont.ValorAdjudicado,
                                   ValorContratado = (double)cont.ValorContratado,
                                   MonedaContrato = cont.MonedaContrato,
                                   UrlContrato = cont.UrlContrato.ToString(),
                                   CodigoComprador = cont.CodigoComprador,
                                   Comprador = cont.Comprador,
                                   EntidadOrigenFondos = cont.EntidadOrigenFondos.ToString(),
                                   OrigenFondos = cont.OrigenFondos.ToString(),
                                   DocURL = cont.DocURL,
                                   OrigenInformacion=cont.OrigenInformacion,
                                   FechaEstimadaAdjudicacion=cont.FechaEstimadaAdjudicacion,
                                   FechaIncioPublicacionProceso=cont.FechaIncioPublicacionProceso,
                                   FechaInicioRecepcionOfertas=cont.FechaInicioRecepcionOfertas,
                                   FechaFinContrato=cont.FechaFinContrato,
                                   FechaFinEjecucionContrato=cont.FechaFinEjecucionContrato,
                                   FechaInicioContrato=cont.FechaInicioContrato,
                                   FechaInicioEjecucionContrato=cont.FechaInicioEjecucionContrato

                               }
                             ).ToList();
            return _objreturn;
        }

        public  List<InfoContratosPerAnyo> ObtenerContratosPerAnyo(string Contratista)
        {
            List<InfoContratosPerAnyo> _objreturn = new List<InfoContratosPerAnyo>();

            _objreturn = (from cont in _connection.VwContratosPerfilContratistaXAnios
                          where (cont.Numerodocumento.Contains(Contratista) || Contratista == null) && cont.ValorContratado != null
                                   select new InfoContratosPerAnyo
                                   {
                                       labelGroup = cont.OrigenInformacion.ToUpper(),
                                       label = cont.Anio.ToString(),
                                       rawValue = (decimal)(cont.NroContratos * 1),
                                       value = cont.NroContratos.ToString()
                                   
                                   }).OrderBy(x => x.label).ToList();

            return _objreturn;

        }

        public List<InfoContratosPerAnyo> ObtenerValorContratosPerAnyo(string Contratista)
        {
            List<InfoContratosPerAnyo> _objreturn = new List<InfoContratosPerAnyo>();

            _objreturn = (from cont in _connection.VwContratosPerfilContratistaXAnios
                          where (cont.Numerodocumento.Contains(Contratista) || Contratista == null) && cont.ValorContratado != null
                          select new InfoContratosPerAnyo
                          {
                              labelGroup = cont.OrigenInformacion.ToUpper(),
                              label = cont.Anio.ToString(),
                              rawValue = (decimal)cont.ValorContratado,
                              value = cont.ValorContratado.ToString()
                          }).OrderBy(x => x.label).ToList();

            return _objreturn;

        }

        public List<InfoContratosPerAnyo> ObtenerComprador(string Comprador)
        {
            List<InfoContratosPerAnyo> _objreturn = new List<InfoContratosPerAnyo>();

            _objreturn = (from cont in _connection.VwContratosDetalles
                          where (cont.Comprador.Contains(Comprador))
                          group cont by cont.Comprador into g
                          select new InfoContratosPerAnyo
                          {
                              label = g.Key
                          }).Distinct().ToList();

            return _objreturn;

        }


        public List<ContratosConsolidado> ObtenerConsolidado(int annio, string moneda=null)
        {
            List<ContratosConsolidado> _objreturn = new List<ContratosConsolidado>();


 
            _objreturn = (from contr in _connection.VwContratosConsolidados
                                   where (contr.MonedaContrato == moneda || moneda == null)
                                   && contr.ValorContratado != null
                                   && contr.Anio == annio
                                   orderby contr.Anio descending
                                    group contr by new { contr.MonedaContrato, contr.CodigoOrigenInformacion, contr.OrigenInformacion } into datos
                          select new ContratosConsolidado
                                   {
                                       OrigenInformacion = datos.Key.OrigenInformacion,
                                       CodigoOrigenInformacion = (int)datos.Key.CodigoOrigenInformacion,
                                       MonedaContrato = datos.Key.MonedaContrato,
                                       ValorContratado = (double?)datos.Sum(x => x.ValorContratado),
                                       NroContratos = datos.Sum(x => x.NroContratos),
                                   }).Distinct().ToList();

            return _objreturn;


        }

        public ModelArticulosContrato ObtenerArticulosContrato(string CodigoContrato)
        {
            ModelArticulosContrato objreturn = new ModelArticulosContrato();

                objreturn.listArticulos = (from info in _connection.VwDetalleContratacionArticulosEmergencias
                                           where info.CodigoContrato == CodigoContrato
                                           select new ArticulosContrato
                                           {
                                               DescripcionSubclase = info.DescripcionSubclase,
                                               DescripcionArticulo = info.DescripcionArticulo,
                                               Cantidad = info.Cantidad,
                                               PrecioUnitario = info.PrecioUnitario,
                                               MontoTotal = info.MontoTotal,
                                               ImpuestoTotal = info.ImpuestoTotal,
                                               Descuento = info.Descuento

                                           }).Distinct().ToList();

           

            return objreturn;
        }


        public List<UnidadCompras> ObtenerEntidadesHomeContratos(int annio)
        {
            List<UnidadCompras> objreturn = new List<UnidadCompras>();

            objreturn = (from info in _connection.VwContratosXProcesosEntidads
                                       where info.AnioProceso == annio
                                       group info by new { info.UnidadCompra } into datos
                         select new UnidadCompras
                                       {
                                           Entidad=datos.Key.UnidadCompra

                                       }).Distinct().ToList();



            return objreturn;
        }

        public List<UnidadCompras> ObtenerEntidadesContratosAutoCompletar(string entidad)
        {
            List<UnidadCompras> objreturn = new List<UnidadCompras>();

            objreturn = (from info in _connection.VwContratosXProcesosEntidads
                         where Sql.Like(info.UnidadCompra, "%" + entidad + "%")
                         group info by new { info.UnidadCompra } into datos
                         select new UnidadCompras
                         {
                             Entidad = datos.Key.UnidadCompra
                         })
                        .ToList();

            return objreturn;
        }

        //public List<UnidadCompras> ObtenerProcesosEntidadesHomeContratos(int annio, string entidad)
        //{
        //    List<UnidadCompras> objreturn = new List<UnidadCompras>();

        //    objreturn = (from info in _connection.VwContratosXProcesosEntidads
        //                     where  info.UnidadCompra.Contains(entidad)  && info.AnioProceso == annio
        //                     orderby info.ValorProceso descending 
        //                 select new UnidadCompras
        //                 {
        //                     Entidad = info.UnidadCompra,
        //                     NroContratos=info.CantidadContratos,
        //                     ValorContratado = info.ValorContratos,
        //                     ValorProceso= (double)info.ValorProceso,
        //                     CodigoProceso= info.CodigoProceso,
        //                     Annio=info.AnioProceso

        //                 }).Distinct().ToList();

        //    return objreturn;
        //}

        public int ContarProcesosEntidadesHomeContratos(int annio, string entidad)
        {
            var query = _connection.VwContratosXProcesosEntidads
                .Where(info => info.UnidadCompra.Contains(entidad)
                               && info.AnioProceso == annio)
                .Select(info => new
                {
                    info.UnidadCompra,
                    info.CantidadContratos,
                    info.ValorContratos,
                    info.ValorProceso,
                    info.CodigoProceso,
                    info.AnioProceso
                })
                .Distinct();

            return query.Count();
        }
        public List<UnidadCompras> ObtenerProcesosEntidadesHomeContratos(
            int annio,
            string entidad,
            int numeroPagina,
            int registrosPorPagina)
        {
            List<UnidadCompras> objreturn = new List<UnidadCompras>();

            if (numeroPagina <= 0) numeroPagina = 1;
            if (registrosPorPagina <= 0) registrosPorPagina = 10;

            var query = (from info in _connection.VwContratosXProcesosEntidads
                         where info.UnidadCompra.Contains(entidad)
                               && info.AnioProceso == annio
                         orderby info.ValorProceso descending
                         select new UnidadCompras
                         {
                             Entidad = info.UnidadCompra,
                             NroContratos = info.CantidadContratos,
                             ValorContratado = info.ValorContratos,
                             ValorProceso = (double)info.ValorProceso,
                             CodigoProceso = info.CodigoProceso,
                             Annio = info.AnioProceso
                         })
                         .Distinct();

            objreturn = query
                .Skip((numeroPagina - 1) * registrosPorPagina)
                .Take(registrosPorPagina)
                .ToList();

            return objreturn;
        }

        public ModelHomeContratos ObtenerEncabezadoHomeContratos(int origen, int annio)
        {
            ModelHomeContratos objreturn = new ModelHomeContratos();
            objreturn.resumenDatosContratos = ObtenerDatosContratos(origen, annio);
            objreturn.InfoRecursosContratos = ObtenerRecursosPerContratos(origen, annio);
            objreturn.InfoRecursosProcesos = ObtenerRecursosPerProcesos(origen, annio);
            return objreturn;
        }

        private PlataformaTransparencia.Modelos.ModelContratistaData ObtenerDatosContratos(int origen, int? annio)
        {
            var objReturn = new PlataformaTransparencia.Modelos.ModelContratistaData();

            // ============================
            //  1. SUMA TOTAL DE CONTRATOS POR ENTIDAD
            // ============================
            var contratosTotales = _connection.VwConsolidadoContratacions
                .AsNoTracking()
                .Where(x => x.Anio == annio)
                .GroupBy(x => 1) // agrupamos todo para obtener un solo resultado
                .Select(g => new
                {
                    NumContratos = g.Sum(z => z.NroContratos),
                    ValorContratos = g.Sum(z => z.ValorContratado)
                })
                .FirstOrDefault();

            objReturn.numContratos = contratosTotales?.NumContratos ?? 0;
            objReturn.valorContratos = contratosTotales?.ValorContratos ?? 0;

            // ============================
            //  2. SUMA TOTAL DE PROCESOS
            // ============================
            var procesosTotales = _connection.VwConsolidadoProcesosContratacions
                .AsNoTracking()
                .Where(x => x.Anio == annio && x.ValorProceso.HasValue)
                .GroupBy(x => 1)
                .Select(g => new
                {
                    NumProcesos = g.Sum(z => z.NroProcesos),
                    ValorProcesos = g.Sum(z => z.ValorProceso)
                })
                .FirstOrDefault();

            objReturn.numProcesos = procesosTotales?.NumProcesos ?? 0;
            objReturn.valorProcesos = (decimal?)(procesosTotales?.ValorProcesos ?? 0);

            // ============================
            //  3. LIMPIEZA
            // ============================
            objReturn.listUnidadCompra = null;
            objReturn.listContratista = null;

            return objReturn;
        }


        //private PlataformaTransparencia.Modelos.ModelContratistaData ObtenerDatosContratos(int origen, int? annio)
        //{
        //    var objReturn = new PlataformaTransparencia.Modelos.ModelContratistaData();

        //    // ============================
        //    //  1. CONTRATOS POR ENTIDAD
        //    // ============================
        //    var contratosByEntidad = _connection.VwConsolidadoContratacions
        //        .AsNoTracking()
        //        .Where(x => x.Anio == annio)
        //        .GroupBy(x => x.Entidad)
        //        .Select(g => new
        //        {
        //            Entidad = g.Key,
        //            NumContratos = g.Sum(z => z.NroContratos),
        //            ValorContratos = g.Sum(z => z.ValorContratado)
        //        })
        //        .ToList();

        //    // Diccionario para O(1) acceso
        //    var dictContratos = contratosByEntidad.ToDictionary(
        //        x => x.Entidad,
        //        x => new { x.NumContratos, x.ValorContratos }
        //    );

        //    // Sumamos totales una sola vez
        //    objReturn.numContratos = contratosByEntidad.Sum(x => x.NumContratos);
        //    objReturn.valorContratos = contratosByEntidad.Sum(x => x.ValorContratos);

        //    // ============================
        //    //  2. UNIDADES DE COMPRA
        //    // ============================
        //    var unidades = _connection.VwConsolidadoProcesosContratacions
        //        .AsNoTracking()
        //        .Where(x => x.ValorProceso.HasValue && x.Anio == annio)
        //        .Select(x => new
        //        {
        //            x.Entidad,
        //            x.MonedaProceso,
        //            ValorProceso = (double)x.ValorProceso,
        //            x.NroProcesos,
        //            x.Anio
        //        })
        //        .ToList()
        //        .Select(p =>
        //        {
        //            dictContratos.TryGetValue(p.Entidad, out var v);
        //            return new UnidadCompras
        //            {
        //                Entidad = p.Entidad,
        //                MonedaContrato = p.MonedaProceso,
        //                MonedaProceso = p.MonedaProceso,
        //                ValorProceso = p.ValorProceso,
        //                NroProcesos = p.NroProcesos,
        //                Annio = p.Anio,
        //                ValorContratado = v?.ValorContratos ?? 0,
        //                NroContratos = v?.NumContratos ?? 0
        //            };
        //        })
        //        .ToList();

        //    objReturn.listUnidadCompra = unidades;

        //    // ============================
        //    //  3. SUMAS FINALES
        //    // ============================
        //    objReturn.numProcesos = unidades.Sum(a => a.NroProcesos);
        //    objReturn.valorProcesos = (decimal?)unidades.Sum(a => a.ValorProceso);

        //    // ============================
        //    //  4. LIMPIEZA
        //    // ============================
        //    objReturn.listUnidadCompra = null;
        //    //if (objReturn.listContratista.Count > 0)
        //    //    objReturn.listContratista = null;

        //    return objReturn;
        //}



        //private PlataformaTransparencia.Modelos.ModelContratistaData ObtenerDatosContratos(int origen, int? annio)
        //{
        //    PlataformaTransparencia.Modelos.ModelContratistaData objReturn = new PlataformaTransparencia.Modelos.ModelContratistaData();


        //    var contratosByEntidad = (from consolidadoContrato in _connection.VwConsolidadoContratacions
        //                              where consolidadoContrato.Anio == annio //consolidadoContrato.Origen.HasValue && consolidadoContrato.Origen == origen && 
        //                              group consolidadoContrato by new { consolidadoContrato.Entidad } into g
        //                              select new
        //                              {
        //                                  g.Key.Entidad,
        //                                  ValorContratos = g.Sum(x => x.ValorContratado),
        //                                  NumContratos = g.Sum(x => x.NroContratos)
        //                              }).ToList();
        //    if (contratosByEntidad.Count > 0)
        //    {
        //        objReturn.numContratos = contratosByEntidad.Sum(x => x.NumContratos);
        //        objReturn.valorContratos = contratosByEntidad.Sum(a => a.ValorContratos);
        //    }

        //    objReturn.listUnidadCompra = (from info in _connection.VwConsolidadoProcesosContratacions
        //                                  where info.ValorProceso.HasValue && info.Anio == annio //info.Origen.HasValue && info.Origen == origen && 
        //                                  //group info by new { info.Entidad, info.MonedaProceso } into g
        //                                  select new UnidadCompras
        //                                  {
        //                                      Entidad = info.Entidad,
        //                                      MonedaContrato = info.MonedaProceso,
        //                                      ValorContratado = 0,
        //                                      MonedaProceso = info.MonedaProceso,
        //                                      NroContratos = 0,
        //                                      ValorProceso = (double)info.ValorProceso,
        //                                      NroProcesos = info.NroProcesos,
        //                                      Annio = info.Anio
        //                                  }).ToList();
        //    if (objReturn.listUnidadCompra.Count > 0 && contratosByEntidad.Count > 0)
        //    {
        //        for (int i = 0; i < objReturn.listUnidadCompra.Count; i++)
        //        {
        //            var contratoEntidad = contratosByEntidad.Where(x => x.Entidad.Contains(objReturn.listUnidadCompra[i].Entidad));
        //            if (contratoEntidad != null)
        //            {
        //                for (int j = 0; j < contratoEntidad.Count(); j++)
        //                {
        //                    objReturn.listUnidadCompra[i].NroContratos += contratoEntidad.ElementAt(j).NumContratos;
        //                    objReturn.listUnidadCompra[i].ValorContratado += contratoEntidad.ElementAt(j).ValorContratos;
        //                }
        //            }
        //        }
        //    }

        //    objReturn.listContratista = (from contratista in _connection.VwContratosPerfilContratistaXAnios
        //                                 where  contratista.ValorContratado.HasValue && contratista.Anio == annio //contratista.CodigoOrigenInformacion == origen &&
        //                                 select new Modelos.Contratos.Contratista
        //                                 {
        //                                     nombre = contratista.Proveedor,
        //                                     ruc = contratista.Numerodocumento,
        //                                     tipodocumento = contratista.Tipodocumento,
        //                                     ValorTotalContratos = contratista.ValorContratado,
        //                                     NumContratos = contratista.NroContratos,
        //                                     OrigenInformacion = contratista.OrigenInformacion
        //                                 }
        //                                ).ToList();


        //    objReturn.numProcesos = objReturn.listUnidadCompra.Sum(a => a.NroProcesos);
        //    objReturn.valorProcesos = (decimal?)objReturn.listUnidadCompra.Sum(a => a.ValorProceso);
        //    objReturn.listUnidadCompra = null;//objReturn.listUnidadCompra.OrderByDescending(a => a.ValorContratado).Take(5).ToList();

        //    if (objReturn.listContratista.Count > 0) objReturn.listContratista = null;// objReturn.listContratista.OrderByDescending(x => x.ValorTotalContratos).Take(5).ToList();
        //    return objReturn;
        //}

        private List<InfoRecursosContratosPerObjeto> ObtenerRecursosPerContratos(int origen, int? annio)
        {
            List<InfoRecursosContratosPerObjeto> objReturn = new List<InfoRecursosContratosPerObjeto>();

            var RecursosPerObjetoQuery = (from info in _connection.VwConsolidadoContratacions
                                          where  info.Anio == annio //info.Origen == origen &&
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
                                          where  info.Anio == annio //info.Origen == origen &&
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

    }
}
