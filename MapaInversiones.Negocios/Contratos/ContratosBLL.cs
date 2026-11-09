using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinqToDB;
using LinqToDB.Mapping;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Emergencia;

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

            return _objreturn;
        }

        public ModelContratosData ObtenerInformacionContratosPorFiltros(ContratosFiltros filtros)
        {
            ModelContratosData _objreturn = new ModelContratosData();
            String NombreProceso = null;
            String NombreEntidad = null;
            String CodigoProveedor = null;
            String Estado = null;
            String Moneda = null;
            int? OrigenInformacion = null;
            String CodigoComprador = null;
            String CodigoContrato = null;
            int? Annio = null;

            if (filtros.NombreProceso != null && filtros.NombreProceso.Trim() != "") { NombreProceso = filtros.NombreProceso; }
            if (filtros.NombreEntidad != null && filtros.NombreEntidad.Trim() != "") { NombreEntidad = filtros.NombreEntidad; }
            if (filtros.CodigoProveedor != null && filtros.CodigoProveedor.Trim() != "") { CodigoProveedor = filtros.CodigoProveedor; }
            if (filtros.CodigoContrato != null && filtros.CodigoContrato.Trim() != "") { CodigoContrato = filtros.CodigoContrato; }
            if (filtros.CodigoComprador != null && filtros.CodigoComprador.Trim() != "") { CodigoComprador = filtros.CodigoComprador; }
            if (filtros.Estado != null && filtros.Estado.Trim() != "") { Estado = filtros.Estado; }
            if (filtros.Moneda != null && filtros.Moneda.Trim() != "") { Moneda = filtros.Moneda; }
            if (filtros.OrigenInformacion != null && filtros.OrigenInformacion.Trim() != "") { OrigenInformacion = int.Parse( filtros.OrigenInformacion); }
            if (filtros.Annio > 0) { Annio = filtros.Annio; }


            try
            {
                _objreturn.CantidadTotalRegistros = (from cont in _connection.VwContratosDetalles
                                                     where (cont.AnioUltimaActualizacion == Annio || Annio == null)
                                                       //&& (cont.MonedaContrato.Contains(Moneda) || Moneda == null)
                                                       && (cont.Comprador.Contains(NombreEntidad) || NombreEntidad == null)
                                                       && (cont.EstadoProceso.Contains(Estado) || Estado == null)
                                                       && (cont.DescripcionProceso.Contains(NombreProceso)
                                                        || cont.CodigoProceso.TrimStart() == NombreProceso || NombreProceso == null)
                                                       && (cont.CodigoProveedor == CodigoProveedor || CodigoProveedor == null)
                                                       && (cont.CodigoContrato == CodigoContrato || CodigoContrato == null)
                                                       && (cont.CodigoComprador == CodigoComprador || CodigoComprador == null)
                                                      // && (cont.CodigoOrigenInformacion==OrigenInformacion || OrigenInformacion == null)
                                                       && cont.ValorContratado != null
                                                       //&& cont.CodigoOrigenInformacion == 0
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
                       // && (cont.MonedaContrato.Contains(Moneda) || Moneda == null)
                        && (cont.Comprador.Contains(NombreEntidad) || NombreEntidad == null)
                        && (cont.EstadoProceso.Contains(Estado) || Estado == null)
                        && (cont.DescripcionProceso.Contains(NombreProceso)
                        || cont.CodigoProceso.TrimStart() == NombreProceso || NombreProceso == null)
                        && (cont.CodigoProveedor == CodigoProveedor || CodigoProveedor == null)
                        && (cont.CodigoContrato == CodigoContrato || CodigoContrato == null)
                        && (cont.CodigoComprador == CodigoComprador || CodigoComprador == null)
                        && (cont.CodigoOrigenInformacion == OrigenInformacion || OrigenInformacion == null)
                        && cont.ValorContratado != null
                         //&& cont.CodigoOrigenInformacion == 0
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
                            TipoCodigoProveedor=cont.TipoCodigoProveedor,
                            Contratista = cont.Contratista,
                            ValorPlaneado = (double)cont.ValorPlaneado,
                            ValorAdjudicado = cont.ValorAdjudicado,
                            ValorContratado = (double)cont.ValorContratado,
                            MonedaContrato = cont.MonedaContrato,
                            UrlContrato = cont.UrlContrato,
                            CodigoComprador = cont.CodigoComprador,
                            Comprador = cont.Comprador,
                            EntidadOrigenFondos = cont.EntidadOrigenFondos,
                            OrigenFondos = cont.OrigenFondos,
                            DocURL = cont.DocURL,
                            OrigenInformacion = cont.OrigenInformacion,
                            FechaInicioContrato = cont.FechaInicioContrato,
                            FechaFinContrato = cont.FechaFinContrato,
                            FechaInicioEjecucionContrato= cont.FechaInicioEjecucionContrato,
                            FechaFinEjecucionContrato = cont.FechaFinEjecucionContrato,
                            FechaEstimadaAdjudicacion= cont.FechaEstimadaAdjudicacion,
                            FechaIncioPublicacionProceso= cont.FechaIncioPublicacionProceso,
                            FechaInicioRecepcionOfertas = cont.FechaInicioRecepcionOfertas,
                            DescripcionContrato = cont.DescripcionContrato
                            
                        }
                             ).ToList();

         
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
                                   UrlContrato = cont.UrlContrato,
                                   CodigoComprador = cont.CodigoComprador,
                                   Comprador = cont.Comprador,
                                   EntidadOrigenFondos = cont.EntidadOrigenFondos,
                                   OrigenFondos = cont.OrigenFondos,
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
                                       ValorContratado = datos.Sum(x => x.ValorContratado),
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

        public List<UnidadCompras> ObtenerProcesosEntidadesHomeContratos(int annio, string entidad)
        {
            List<UnidadCompras> objreturn = new List<UnidadCompras>();

            objreturn = (from info in _connection.VwContratosXProcesosEntidads
                             where  info.UnidadCompra.Contains(entidad)  && info.AnioProceso == annio
                             orderby info.ValorProceso descending 
                         select new UnidadCompras
                         {
                             Entidad = info.UnidadCompra,
                             NroContratos=info.CantidadContratos,
                             ValorContratado = info.ValorContratos,
                             ValorProceso= (double)info.ValorProceso,
                             CodigoProceso= info.CodigoProceso,
                             Annio=info.AnioProceso

                         }).Distinct().ToList();



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
            PlataformaTransparencia.Modelos.ModelContratistaData objReturn = new PlataformaTransparencia.Modelos.ModelContratistaData();


            var contratosByEntidad = (from consolidadoContrato in _connection.VwConsolidadoContratacions
                                      where consolidadoContrato.Anio == annio //consolidadoContrato.Origen.HasValue && consolidadoContrato.Origen == origen && 
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
                                          where info.ValorProceso.HasValue && info.Anio == annio //info.Origen.HasValue && info.Origen == origen && 
                                          //group info by new { info.Entidad, info.MonedaProceso } into g
                                          select new UnidadCompras
                                          {
                                              Entidad = info.Entidad,
                                              MonedaContrato = info.MonedaProceso,
                                              ValorContratado = 0,
                                              MonedaProceso = info.MonedaProceso,
                                              NroContratos = 0,
                                              ValorProceso = (double)info.ValorProceso,
                                              NroProcesos = info.NroProcesos,
                                              Annio = info.Anio
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
                                         where  contratista.ValorContratado.HasValue && contratista.Anio == annio //contratista.CodigoOrigenInformacion == origen &&
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
            objReturn.listUnidadCompra = null;//objReturn.listUnidadCompra.OrderByDescending(a => a.ValorContratado).Take(5).ToList();

            if (objReturn.listContratista.Count > 0) objReturn.listContratista = null;// objReturn.listContratista.OrderByDescending(x => x.ValorTotalContratos).Take(5).ToList();
            return objReturn;
        }

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
