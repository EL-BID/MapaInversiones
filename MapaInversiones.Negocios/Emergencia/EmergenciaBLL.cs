using DataModels;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Emergencia;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Negocios.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ModelContratistaData = PlataformaTransparencia.Modelos.ModelContratistaData;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using System.Data.Entity.Core.Objects;
using LinqToDB.Common;
using LinqToDB;
using PlataformaTransparencia.Modelos.Presupuesto;
using SolrNet;
using static LinqToDB.Reflection.Methods.LinqToDB;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;

namespace PlataformaTransparencia.Negocios.Emergencia
{
    public class EmergenciaBLL : IEmergenciaBLL
    {
        private readonly TransparenciaDB _connection;

        public EmergenciaBLL(TransparenciaDB connection)
        {
            _connection = connection;
            _connection.CommandTimeout = 180;
    ***REMOVED***

        public ModelHomeEmergencias ObtenerDatosModeloInicio(int tipoEmergencia)
        {
            ModelHomeEmergencias objReturn = new ModelHomeEmergencias();

            #region DATOSCONTRATOS
            ///RECUADRO CONSOLIDADOS NEW VERSION
            objReturn.resumenDatosContratos = ObtenerDatosContratosPorTipoEmergencia(tipoEmergencia);
            objReturn.InfoRecursosContratos = ObtenerRecursosPerContratosPorTipoEmergencia(tipoEmergencia);
            objReturn.InfoRecursosProcesos = ObtenerRecursosPerProcesosPorTipoEmergencia(tipoEmergencia);
            #endregion

            objReturn.Status = true;
            objReturn.TipoEmergencia = tipoEmergencia;
            return objReturn;
    ***REMOVED***

        private ModelContratistaData ObtenerDatosContratosPorTipoEmergencia(int tipoEmergencia)
        {
            ModelContratistaData objReturn = new ModelContratistaData();

            var contratosByEntidad = (from consolidadoContrato in _connection.VwConsolidadoContratacionEmergencias
                                      where consolidadoContrato.Origen.HasValue && consolidadoContrato.Origen == tipoEmergencia
                                      group consolidadoContrato by new { consolidadoContrato.Entidad ***REMOVED*** into g
                                      select new
                                      {
                                          g.Key.Entidad,
                                          ValorContratos = g.Sum(x => x.ValorContratado),
                                          NumContratos = g.Sum(x => x.NroContratos)
                                  ***REMOVED***).ToList();
            if (contratosByEntidad.Count > 0)
            {
                objReturn.numContratos = contratosByEntidad.Sum(x => x.NumContratos);
                objReturn.valorContratos = contratosByEntidad.Sum(a => a.ValorContratos);
        ***REMOVED***
            objReturn.listUnidadCompra = (from info in _connection.VwConsolidadoProcesosContratacionEmergencias
                                          where info.Origen.HasValue && info.Origen == tipoEmergencia && info.ValorProceso.HasValue
                                          group info by new { info.Entidad, info.MonedaProceso ***REMOVED*** into g
                                          select new UnidadCompras
                                          {
                                              Entidad = g.Key.Entidad,
                                              MonedaContrato = g.Key.MonedaProceso,
                                              ValorContratado = 0,
                                              MonedaProceso = g.Key.MonedaProceso,
                                              NroContratos = 0,
                                              ValorProceso = g.Sum(x => (double?)x.ValorProceso),
                                              NroProcesos = g.Sum(x => x.NroProcesos)
                                      ***REMOVED***).ToList();
            if (objReturn.listUnidadCompra.Count > 0 && contratosByEntidad.Count > 0)
            {
                for (int i = 0; i < objReturn.listUnidadCompra.Count; i++)
                {
                    var contratoEntidad = contratosByEntidad.Where(x => x.Entidad == objReturn.listUnidadCompra[i].Entidad).FirstOrDefault();
                    if (contratoEntidad != null)
                    {
                        objReturn.listUnidadCompra[i].NroContratos = contratoEntidad.NumContratos;
                        objReturn.listUnidadCompra[i].ValorContratado = contratoEntidad.ValorContratos;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            objReturn.listContratista = (from contratista in _connection.VwContratosPerfilContratistas
                                         where contratista.CodigoOrigenInformacion == tipoEmergencia && contratista.ValorTotalContratos.HasValue
                                         select new Modelos.Contratos.Contratista
                                         {
                                             nombre = contratista.Contratista,
                                             ruc = contratista.Numerodocumento,
                                             tipodocumento = contratista.Tipodocumento,
                                             ValorTotalContratos = contratista.ValorTotalContratos,
                                             NumContratos = contratista.NumContratos,
                                             NumProcesos = contratista.NumProcesos,
                                             OrigenInformacion = contratista.OrigenInformacion
                                     ***REMOVED***
                                        ).ToList();
            if (_connection.GastoXProgramasEmergencias.Where(x => x.IdOrigen.HasValue && x.IdOrigen.Value == tipoEmergencia && x.VlrGasto.HasValue).Count() > 0)
                objReturn.valorEjecutado = Convert.ToDecimal(_connection.GastoXProgramasEmergencias.Where(x => x.IdOrigen.HasValue && x.IdOrigen.Value == tipoEmergencia && x.VlrEjecutado.HasValue).Sum(x => x.VlrEjecutado.Value));

            objReturn.numProcesos = objReturn.listUnidadCompra.Sum(a => a.NroProcesos);
            objReturn.valorProcesos = (decimal?)objReturn.listUnidadCompra.Sum(a => a.ValorProceso);
            objReturn.listUnidadCompra = objReturn.listUnidadCompra.OrderByDescending(a => a.ValorContratado).ToList();//Take(4).

            if (objReturn.listContratista.Count > 0) objReturn.listContratista = objReturn.listContratista.OrderByDescending(x => x.ValorTotalContratos).ToList();
            return objReturn;
    ***REMOVED***

        private List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerContratosPorTipoEmergencia(int tipoEmergencia)
        {
            List<InfoRecursosEmergenciaPerObjeto> objReturn = new List<InfoRecursosEmergenciaPerObjeto>();

            var RecursosPerObjetoQuery = (from info in _connection.VwDetalleContratacionArticulosEmergencias
                                          where info.Origen == tipoEmergencia
                                          //where info.EstadoContrato.ToUpper().Equals("ACTIVO") || info.EstadoContrato.ToUpper().Equals("EN EDICIÓN")
                                          group info by new { info.UnidadCompra, info.Objeto, info.DescripcionSubclase ***REMOVED*** into g
                                          select new InfoRecursosEmergenciaPerObjeto
                                          {
                                              labelGroup = g.Key.UnidadCompra,
                                              label = g.Key.Objeto,
                                              label_inf = g.Key.DescripcionSubclase,
                                              rawValue = (decimal)g.Sum(z => z.MontoTotal)
                                      ***REMOVED***).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf).ToList();

            objReturn = RecursosPerObjetoQuery;
            if (objReturn == null) objReturn = new List<InfoRecursosEmergenciaPerObjeto>();
            return objReturn;

    ***REMOVED***

        private List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerProcesosPorTipoEmergencia(int tipoEmergencia)
        {
            List<InfoRecursosEmergenciaPerObjeto> objReturn = new List<InfoRecursosEmergenciaPerObjeto>();

            var RecursosPerObjetoQuery = (from info in _connection.VwDetalleProcesosArticulosEmergencias
                                          where info.Origen == tipoEmergencia
                                          group info by new { info.UnidadCompra, info.ObjetoProceso, info.DescripcionSubclase ***REMOVED*** into g
                                          select new InfoRecursosEmergenciaPerObjeto
                                          {
                                              labelGroup = g.Key.UnidadCompra,
                                              label = g.Key.ObjetoProceso,
                                              label_inf = g.Key.DescripcionSubclase,
                                              rawValue = g.Sum(z => z.PrecioTotalEstimado.Value)
                                      ***REMOVED***).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf).ToList();


            var RecursosPerObjetoQuerysq = (from info in _connection.VwDetalleProcesosArticulosEmergencias
                                          where info.Origen == tipoEmergencia
                                          group info by new { info.UnidadCompra, info.ObjetoProceso, info.DescripcionSubclase ***REMOVED*** into g
                                          select new InfoRecursosEmergenciaPerObjeto
                                          {
                                              labelGroup = g.Key.UnidadCompra,
                                              label = g.Key.ObjetoProceso,
                                              label_inf = g.Key.DescripcionSubclase,
                                              rawValue = g.Sum(z => z.PrecioTotalEstimado.Value)
                                      ***REMOVED***).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf);
            objReturn = RecursosPerObjetoQuery;

            return objReturn;
    ***REMOVED***





        public ModelContratistaData ObtenerDatosContratosEmergencia(int tipoEmergencia, string Entidad = null)
        {
            ModelContratistaData objReturn = new ModelContratistaData();
            int? numProcesosCancelados = 0;
            decimal? valProcesosCancelados = 0;

            objReturn.listTotalContratos = ObtenerEncabezadoContratosEmergencias(tipoEmergencia, Entidad);

            objReturn.listTotalProcesos = ObtenerEncabezadoProcesosContratosEmergencias(out numProcesosCancelados, out valProcesosCancelados, tipoEmergencia, Entidad);

            objReturn.numProcesosCancelados = numProcesosCancelados;
            objReturn.valProcesosCancelados = valProcesosCancelados;

            objReturn.numContratos = objReturn.listTotalContratos.Sum(a => a.NroContratos);
            objReturn.valorContratos = objReturn.listTotalContratos.Sum(a => a.ValorContratado);
            objReturn.numProcesos = objReturn.listTotalProcesos.Sum(a => a.NroProcesos);
            objReturn.valorProcesos = (decimal?)objReturn.listTotalProcesos.Sum(a => a.ValorProceso);

            objReturn.listEstadosContratos = ObtenerEstadosContratosEmergencias(tipoEmergencia);
            objReturn.tipoEmergencia = tipoEmergencia;
            objReturn.nombreUnidadCompra = Entidad;
            return objReturn;
    ***REMOVED***


        private List<TotalContrato> ObtenerEncabezadoContratosEmergencias(int? tipoEmergencia, string Entidad = null)
        {
            List<TotalContrato> objreturn = new List<TotalContrato>();


            objreturn = (from info in _connection.VwConsolidadoContratacionEmergencias
                         where info.Origen == tipoEmergencia && (info.Entidad.Contains(Entidad) || Entidad.IsNullOrEmpty())
                         group info by new { info.EstadoContrato, info.MonedaContrato ***REMOVED*** into g
                         orderby g.Sum(x => x.ValorContratado)
                         orderby g.Sum(x => x.NroContratos)
                         select new TotalContrato
                         {
                             MonedaContrato = g.Key.MonedaContrato,
                             EstadoContrato = g.Key.EstadoContrato,
                             ValorContratado = g.Sum(x => x.ValorContratado),
                             NroContratos = g.Sum(x => x.NroContratos)
                     ***REMOVED***).OrderBy(x => x.EstadoContrato).ToList();

            var RecursosPerObjetoQuery = (from info in _connection.VwConsolidadoContratacionEmergencias
                                          where info.Origen == tipoEmergencia && (info.Entidad.Contains(Entidad) || Entidad.IsNullOrEmpty())
                                          group info by new { info.EstadoContrato, info.MonedaContrato ***REMOVED*** into g
                                          orderby g.Sum(x => x.ValorContratado)
                                          orderby g.Sum(x => x.NroContratos)
                                          select new TotalContrato
                                          {
                                              MonedaContrato = g.Key.MonedaContrato,
                                              EstadoContrato = g.Key.EstadoContrato,
                                              ValorContratado = g.Sum(x => x.ValorContratado),
                                              NroContratos = g.Sum(x => x.NroContratos)
                                      ***REMOVED***).OrderBy(x => x.EstadoContrato);

            return objreturn;

    ***REMOVED***

        private List<TotalProceso> ObtenerEncabezadoProcesosContratosEmergencias(out int? numProcesosCancelados, out decimal? valProcesosCancelados, int? tipoEmergencia, string Entidad = null)
        {
            List<TotalProceso> objreturn = new List<TotalProceso>();




            objreturn = (from info in _connection.VwConsolidadoProcesosContratacionEmergencias
                         where info.Origen == tipoEmergencia && (info.Entidad.Contains(Entidad) || Entidad.IsNullOrEmpty())
                         group info by new { info.EstadoProceso, info.MonedaProceso, info.EstadoProcesoOrden ***REMOVED*** into g
                         orderby g.Sum(x => x.ValorProceso)
                         orderby g.Sum(x => x.NroProcesos)
                         select new TotalProceso
                         {
                             MonedaProceso = g.Key.MonedaProceso,
                             EstadoProceso = g.Key.EstadoProceso,
                             ValorProceso = (double)g.Sum(x => x.ValorProceso),
                             NroProcesos = g.Sum(x => x.NroProcesos)
                     ***REMOVED***
                                          ).OrderBy(x => x.EstadoProceso).ToList();


            numProcesosCancelados = (from info in _connection.VwTotalProcesosSinContratoEmergencias
                                          where info.Origen == tipoEmergencia && (info.Entidad.Contains(Entidad) || Entidad.IsNullOrEmpty())
                                          select info.NroProcesos).Sum();

            valProcesosCancelados = (from info in _connection.VwTotalProcesosSinContratoEmergencias
                                     where info.Origen == tipoEmergencia && (info.Entidad.Contains(Entidad) || Entidad.IsNullOrEmpty())
                                     select info.ValorProcesos).Sum();





            return objreturn;

    ***REMOVED***

        private List<ContratosEstado> ObtenerEstadosContratosEmergencias(int? tipoEmergencia)
        {
            List<ContratosEstado> objreturn = new();

            objreturn = (from info in _connection.VwConsolidadoContratacionEmergencias
                         where info.Origen == tipoEmergencia
                         group info by new { info.EstadoContrato ***REMOVED*** into g
                         select new ContratosEstado
                         {
                             Nombre = g.Key.EstadoContrato,
                             EstadoContrato = g.Key.EstadoContrato
                     ***REMOVED***).ToList();


            return objreturn;
    ***REMOVED***

        public ModelContratosData ObtenerInformacionContratosEmergeciasPorFiltros(ContratosFiltros filtros)
        {
            ModelContratosData _objreturn = new ModelContratosData();
            string NombreProceso = null;
            string NombreEntidad = null;
            string Estado = null;
            int? TipoEmergencia = null;

            if (filtros.NombreProceso != null && filtros.NombreProceso.Trim() != "") { NombreProceso = filtros.NombreProceso; ***REMOVED***
            if (filtros.NombreEntidad != null && filtros.NombreEntidad.Trim() != "") { NombreEntidad = filtros.NombreEntidad; ***REMOVED***
            if (filtros.Estado != null && filtros.Estado.Trim() != "") { Estado = filtros.Estado; ***REMOVED***
            if (filtros.OrigenInformacion != null && filtros.OrigenInformacion.Trim() != "") { TipoEmergencia = int.Parse(filtros.OrigenInformacion); ***REMOVED***
            try
            {

                _objreturn.CantidadTotalRegistros = (
                                                     from cont in _connection.VwDetalleContratacionEmergencias
                                                     join he in _connection.VwDetalleContratacionArticulosEmergencias
                                                   on cont.Codigocontrato equals he.CodigoContrato
                                                     where
                                                        (cont.UnidadCompra.Contains(NombreEntidad) || NombreEntidad == null)
                                                       && (cont.EstadoContrato.Contains(Estado) || Estado == null)
                                                       && (cont.DescripcionProceso.Contains(NombreProceso)
                                                        || he.CodigoProceso.TrimStart() == NombreProceso || NombreProceso == null)
                                                       && cont.Valorcontratado != null
                                                       && (cont.CodigoOrigenInformacion== TipoEmergencia || TipoEmergencia == null)
                                                     let NUMBER = Sql.Ext.DenseRank().Over().OrderBy(cont.UnidadCompra).ThenBy(cont.Codigoproceso).ThenBy(cont.CodigoOrigenInformacion).ToValue()
                                                     orderby NUMBER descending
                                                     select NUMBER
                               ).First();
        ***REMOVED***
            catch
            {
                _objreturn.CantidadTotalRegistros = 0;
        ***REMOVED***



            _objreturn.Data = (from cont in _connection.VwDetalleContratacionEmergencias
                               join he in _connection.VwDetalleContratacionArticulosEmergencias
                              on cont.Codigocontrato equals he.CodigoContrato into lj
                               from lp in lj.DefaultIfEmpty()
                               where

                                (cont.UnidadCompra.Contains(NombreEntidad) || NombreEntidad == null)
                               && (cont.EstadoContrato.Contains(Estado) || Estado == null)
                               && (cont.DescripcionProceso.Contains(NombreProceso)
                               || cont.Codigoproceso.TrimStart() == NombreProceso || NombreProceso == null)
                               && cont.Valorcontratado != null
                               && (cont.CodigoOrigenInformacion == TipoEmergencia || TipoEmergencia == null)
                               let NUMBER = Sql.Ext.DenseRank().Over().OrderBy(cont.UnidadCompra).ThenBy(cont.Codigoproceso).ThenBy(cont.CodigoOrigenInformacion).ToValue()
                               where
                               NUMBER > ((filtros.NumeroPagina - 1) * filtros.RegistrosPorPagina)
                               && NUMBER <= (filtros.NumeroPagina * filtros.RegistrosPorPagina)
                               select new ContratosData
                               {
                                   AnioUltimaActualizacion = cont.Anio,
                                   DescripcionProceso = cont.DescripcionProceso,
                                   EstadoProceso = cont.EstadoProceso,
                                   CodigoContrato = cont.Codigocontrato,
                                   CodigoProceso = cont.Codigoproceso,
                                   Contratista = cont.Razonsocial,
                                   ValorContratado = (double)cont.Valorcontratado,
                                   MonedaContrato = cont.MonedaContrato,
                                   UrlContrato = cont.URL,
                                   DocURL = cont.URLProceso,
                                   CodigoOrigenInformacion = (int)cont.CodigoOrigenInformacion,
                                   FechaInicioContrato = cont.FechaInicioContrato,
                                   FechaFinContrato = cont.FechaFinContrato,
                                   FechaInicioEjecucionContrato = cont.FechaInicioEjecucionContrato,
                                   FechaFinEjecucionContrato = cont.FechaFinEjecucionContrato,
                                   FechaEstimadaAdjudicacion = cont.FchEstimadaAdjudicacion,
                                   FechaIncioPublicacionProceso = cont.FchInicioPublicacion,
                                   FechaInicioRecepcionOfertas = cont.FchInicioRecepOfertas,
                                   DescripcionContrato = cont.DescripcionContrato,
                                   UnidadCompra = cont.UnidadCompra,
                                   TipoCodigoProveedor = cont.Tipodocumento,
                                   CodigoProveedor = cont.Numerodocumento,
                                   EstadoContrato = cont.EstadoContrato



                           ***REMOVED***
                             ).Distinct().ToList();

            return _objreturn;
    ***REMOVED***

        public List<string> ObtenerEntidadGestionContratosPorNombre(ContratosFiltros filtro)
        {
            List<string> objreturn = new List<string>();

            string NombreEntidad = null;
            int? OrigenInformacion = null;
            if (filtro.NombreEntidad != null && filtro.NombreEntidad.Trim() != "") { NombreEntidad = filtro.NombreEntidad; ***REMOVED***
            if (filtro.OrigenInformacion != null && filtro.OrigenInformacion.Trim() != "") { OrigenInformacion = int.Parse(filtro.OrigenInformacion); ***REMOVED***
            objreturn = (from cont in _connection.VwDetalleContratacionEmergencias
                         where
                          (cont.UnidadCompra.Contains(NombreEntidad) || NombreEntidad == null)
                         && cont.CodigoOrigenInformacion == OrigenInformacion
                         select cont.UnidadCompra
                         ).Distinct().ToList();



            return objreturn;
    ***REMOVED***


        public List<InfograficoFuentePrograma> ObtDistribucionPresupuestalEjecutadoPorTipoEmergencia(int tipoEmergencia)
        {
            List<InfograficoFuentePrograma> objReturn = new();
            var recursosPerObjetoQuery = (from info in _connection.GastoXProgramasEmergencias  //.VwGastoXProgramasEmergenciaCovid
                                          where info.IdOrigen.HasValue && info.IdOrigen.Value == tipoEmergencia && info.VlrEjecutado.HasValue
                                          orderby info.DesFuente, info.DesOrgFinanciador, info.NomProgramaAsistencia, info.NomCapitulo, info.DesCcpConcepto
                                        , info.DesCcpCuenta, info.VlrEjecutado descending
                                          select new
                                          {
                                              NomFuente = "fue_" + info.DesFuente,
                                              NomOrganismo = "org_" + info.DesOrgFinanciador,
                                              ItemPrograma = info.NomProgramaAsistencia == "FASET" ? "prog_FASE TURISMO" : "prog_" + info.NomProgramaAsistencia,
                                              cod_capitulo = info.CodCapitulo,
                                              nom_capitulo = info.NomCapitulo,
                                              codigoConcepto = info.CodCcpConcepto,
                                              NombreConcepto = info.DesCcpConcepto,
                                              CodigoCuentaObjeto = info.CodCcpCuenta,
                                              NombreCuentaObjeto = info.DesCcpCuenta,
                                              AvanceProgramaxObjeto = info.VlrEjecutado
                                      ***REMOVED***).ToList();
            InfograficoFuentePrograma objFuente = null;
            InfograficoOrganismo objOrganismo = null;
            InfoGraficoItemPrograma objItem = null;
            InfograficoCapitulo objCapitulo = null;
            InfograficoConcepto objConcepto = null;
            InfograficoCuentaGasto objGasto = null;

            foreach (var fila in recursosPerObjetoQuery)
            {
                objFuente = objReturn.Find(p => p.Nombre == fila.NomFuente.ToUpper());
                if (objFuente == null)
                {
                    objFuente = new InfograficoFuentePrograma(string.Empty, fila.NomFuente.ToUpper());
                    objFuente.presupuesto += 0;
                    objFuente.avance += (decimal)fila.AvanceProgramaxObjeto;
                    objOrganismo = objFuente.Detalles.Find(p => p.Nombre == fila.NomOrganismo.ToUpper());
                    if (objOrganismo == null)
                    {
                        objOrganismo = new InfograficoOrganismo(string.Empty, fila.NomOrganismo.ToUpper());
                        objOrganismo.presupuesto += 0;
                        objOrganismo.avance += (decimal)fila.AvanceProgramaxObjeto;
                        objItem = objOrganismo.Detalles.Find(p => p.NomItem == fila.ItemPrograma.ToUpper());
                        if (objItem == null) //3 detalle del infografico
                        {
                            objItem = new InfoGraficoItemPrograma("0", fila.ItemPrograma.ToUpper());
                            objItem.presupuesto += 0;
                            objItem.avance += (decimal)fila.AvanceProgramaxObjeto;
                            objCapitulo = objItem.Detalles.Find(p => p.NomCapitulo == fila.nom_capitulo.ToUpper());
                            if (objCapitulo == null)
                            {
                                objCapitulo = new InfograficoCapitulo(fila.cod_capitulo.ToString(), fila.nom_capitulo);
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {

                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                                objItem.Detalles.Add(objCapitulo);
                        ***REMOVED***
                            else
                            {
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                            objOrganismo.Detalles.Add(objItem);
                    ***REMOVED***
                        else
                        {
                            objItem.presupuesto += 0;
                            objItem.avance += (decimal)fila.AvanceProgramaxObjeto;
                            objCapitulo = objItem.Detalles.Find(p => p.NomCapitulo == fila.nom_capitulo.ToUpper());
                            if (objCapitulo == null)
                            {
                                objCapitulo = new InfograficoCapitulo(fila.cod_capitulo.ToString(), fila.nom_capitulo);
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                                objItem.Detalles.Add(objCapitulo);
                        ***REMOVED***
                            else
                            {
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {

                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                        objFuente.Detalles.Add(objOrganismo);
                ***REMOVED***
                    else
                    {
                        objOrganismo.presupuesto += 0;
                        objOrganismo.avance += (decimal)fila.AvanceProgramaxObjeto;
                        objItem = objOrganismo.Detalles.Find(p => p.NomItem == fila.ItemPrograma.ToUpper());
                        if (objItem == null) //3 detalle del infografico
                        {
                            objItem = new InfoGraficoItemPrograma("0", fila.ItemPrograma.ToUpper());
                            objItem.presupuesto += 0;
                            objItem.avance += (decimal)fila.AvanceProgramaxObjeto;
                            objCapitulo = objItem.Detalles.Find(p => p.NomCapitulo == fila.nom_capitulo.ToUpper());
                            if (objCapitulo == null)
                            {
                                objCapitulo = new InfograficoCapitulo(fila.cod_capitulo.ToString(), fila.nom_capitulo);
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                                objItem.Detalles.Add(objCapitulo);
                        ***REMOVED***
                            else
                            {
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                            objOrganismo.Detalles.Add(objItem);
                    ***REMOVED***
                        else
                        {
                            objItem.presupuesto += 0;
                            objItem.avance += (decimal)fila.AvanceProgramaxObjeto;
                            objCapitulo = objItem.Detalles.Find(p => p.NomCapitulo == fila.nom_capitulo.ToUpper());
                            if (objCapitulo == null)
                            {
                                objCapitulo = new InfograficoCapitulo(fila.cod_capitulo.ToString(), fila.nom_capitulo);
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());

                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                                objItem.Detalles.Add(objCapitulo);
                        ***REMOVED***
                            else
                            {
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {

                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
                    objReturn.Add(objFuente);
            ***REMOVED***
                else
                {
                    objFuente.presupuesto += 0;
                    objFuente.avance += (decimal)fila.AvanceProgramaxObjeto;
                    objOrganismo = objFuente.Detalles.Find(p => p.Nombre == fila.NomOrganismo.ToUpper());
                    if (objOrganismo == null)
                    {
                        objOrganismo = new InfograficoOrganismo(string.Empty, fila.NomOrganismo.ToUpper());
                        objOrganismo.presupuesto += 0;
                        objOrganismo.avance += (decimal)fila.AvanceProgramaxObjeto;
                        objItem = objOrganismo.Detalles.Find(p => p.NomItem == fila.ItemPrograma.ToUpper());
                        if (objItem == null) //3 detalle del infografico
                        {
                            objItem = new InfoGraficoItemPrograma("0", fila.ItemPrograma.ToUpper());
                            objItem.presupuesto += 0;
                            objItem.avance += (decimal)fila.AvanceProgramaxObjeto;
                            objCapitulo = objItem.Detalles.Find(p => p.NomCapitulo == fila.nom_capitulo.ToUpper());
                            if (objCapitulo == null)
                            {
                                objCapitulo = new InfograficoCapitulo(fila.cod_capitulo.ToString(), fila.nom_capitulo);
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                                objItem.Detalles.Add(objCapitulo);
                        ***REMOVED***
                            else
                            {
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                            objOrganismo.Detalles.Add(objItem);
                    ***REMOVED***
                        else
                        {
                            objItem.presupuesto += 0;
                            objItem.avance += (decimal)fila.AvanceProgramaxObjeto;
                            objCapitulo = objItem.Detalles.Find(p => p.NomCapitulo == fila.nom_capitulo.ToUpper());
                            if (objCapitulo == null)
                            {
                                objCapitulo = new InfograficoCapitulo(fila.cod_capitulo.ToString(), fila.nom_capitulo);
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                                objItem.Detalles.Add(objCapitulo);
                        ***REMOVED***
                            else
                            {
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                        objFuente.Detalles.Add(objOrganismo);
                ***REMOVED***
                    else
                    {
                        objOrganismo.presupuesto += 0;
                        objOrganismo.avance += (decimal)fila.AvanceProgramaxObjeto;
                        objItem = objOrganismo.Detalles.Find(p => p.NomItem == fila.ItemPrograma.ToUpper());
                        if (objItem == null) //3 detalle del infografico
                        {
                            objItem = new InfoGraficoItemPrograma("0", fila.ItemPrograma.ToUpper());
                            objItem.presupuesto += 0;
                            objItem.avance += (decimal)fila.AvanceProgramaxObjeto;
                            objCapitulo = objItem.Detalles.Find(p => p.NomCapitulo == fila.nom_capitulo.ToUpper());
                            if (objCapitulo == null)
                            {
                                objCapitulo = new InfograficoCapitulo(fila.cod_capitulo.ToString(), fila.nom_capitulo);
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                                objItem.Detalles.Add(objCapitulo);
                        ***REMOVED***
                            else
                            {
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                            objOrganismo.Detalles.Add(objItem);
                    ***REMOVED***
                        else
                        {
                            objItem.presupuesto += 0;
                            objItem.avance += (decimal)fila.AvanceProgramaxObjeto;
                            objCapitulo = objItem.Detalles.Find(p => p.NomCapitulo == fila.nom_capitulo.ToUpper());
                            if (objCapitulo == null)
                            {
                                objCapitulo = new InfograficoCapitulo(fila.cod_capitulo.ToString(), fila.nom_capitulo);
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {
                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                                objItem.Detalles.Add(objCapitulo);
                        ***REMOVED***
                            else
                            {
                                objCapitulo.presupuesto += 0;
                                objCapitulo.avance += (decimal)fila.AvanceProgramaxObjeto;
                                objConcepto = objCapitulo.Detalles.Find(p => p.NomConcepto == fila.NombreConcepto.ToUpper());
                                if (objConcepto == null)
                                {
                                    objConcepto = new InfograficoConcepto(fila.codigoConcepto.ToString(), fila.NombreConcepto);
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {

                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                                    objCapitulo.Detalles.Add(objConcepto);
                            ***REMOVED***
                                else
                                {
                                    objConcepto.presupuesto += 0;
                                    objConcepto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                    objGasto = objConcepto.Detalles.Find(p => p.nom_cuenta == fila.NombreCuentaObjeto.ToUpper());
                                    if (objGasto == null)
                                    {

                                        objGasto = new InfograficoCuentaGasto(fila.CodigoCuentaObjeto.ToString(), fila.NombreCuentaObjeto.ToUpper(), 0, (decimal)fila.AvanceProgramaxObjeto);
                                        objConcepto.Detalles.Add(objGasto);
                                ***REMOVED***
                                    else
                                    {
                                        objGasto.presupuesto += 0;
                                        objGasto.avance += (decimal)fila.AvanceProgramaxObjeto;
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            //***REMOVED***
            ///ordena primer nivel
            var result = objReturn.OrderByDescending(x => x.avance).ToList();
            foreach (var item_entidad in result)
            {
                //ordena nivel entidad
                item_entidad.Detalles = item_entidad.Detalles.OrderByDescending(x => x.avance).ToList();
                foreach (var item_actividad in item_entidad.Detalles)
                {
                    //ordena nivel actividad
                    item_actividad.Detalles = item_actividad.Detalles.OrderByDescending(x => x.avance).ToList();
                    foreach (var item_gasto in item_actividad.Detalles)
                    {
                        item_gasto.Detalles = item_gasto.Detalles.OrderByDescending(x => x.avance).ToList();
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            return result;
    ***REMOVED***


        /// <summary>
        /// Obtiene datos consolidados programas Home - Ficha Covid
        /// </summary>
        /// <returns></returns>
        public List<InfoConsolidadoRecursos> ObtenerConsolidadoRecursosCovid()
        {
            List<InfoConsolidadoRecursos> objReturn = new();
            List<InfoConsolidadoRecursos> objReturn_aux = new();
            var objContrato = new InfoConsolidadoRecursos();

            var ordenIni = new itemPrograma[]
                {
                  new itemPrograma{ orden=5, nombre ="QUÉDATE EN CASA", estado=true,externo=true, label_nombre="Programa de ayuda", label_valor="Total ayudas entregadas",label_beneficiarios="Beneficiarios",label_boton="Consultar estatus"***REMOVED***,
                  new itemPrograma{ orden=2, nombre ="FASE", estado=true,externo=false, label_nombre="Fondo de Asistencia al Empleado",label_valor="Total ayudas entregadas",label_beneficiarios="Beneficiarios",label_boton="Ver distribución"***REMOVED***,
                  new itemPrograma{ orden=3, nombre ="FASE TURISMO", estado=true,externo=false, label_nombre="",label_valor="Total ayudas entregadas",label_beneficiarios="Beneficiarios",label_boton="Ver distribución"***REMOVED***,
                  new itemPrograma{ orden=1, nombre ="PATI", estado=true , externo=true,label_nombre="Programa de Asistencia al Trabajador Independiente",label_valor="Total ayudas entregadas",label_beneficiarios="Beneficiarios",label_boton="Consultar estatus"***REMOVED***,
                  new itemPrograma{ orden=6, nombre ="INCENTIVOS", estado=false,externo=false, label_nombre="",label_valor="Valor total",label_beneficiarios="Beneficiarios",label_boton="Ver distribución"***REMOVED***,
                  new itemPrograma{ orden=7, nombre ="OTROS GASTOS", estado=false , externo=false,label_nombre="",label_valor="Valor total",label_beneficiarios="",label_boton="Ver distribución"***REMOVED***,
                  new itemPrograma{ orden=4, nombre ="QUEDATE EN CASA", estado=true, externo=true,label_nombre="Programa de ayuda", label_valor="Total ayudas entregadas",label_beneficiarios="Beneficiarios",label_boton="Consultar estatus"***REMOVED***,
            ***REMOVED***;

            //using (var DataModel = new TransparenciaDB())
            //{
            ObjectParameter numContratosActivosParameter = new("TOTALREGISTROSACTIVOS", 0);
            ObjectParameter valContratosActivosParameter = new("VALORCONTRATOSACTIVOS", 0);
            ObjectParameter numContratosCanceladosParameter = new("TOTALREGISTROSCANCELADOS", 0);
            ObjectParameter valContratosCanceladosParameter = new("VALORCONTRATOSCANCELADOS", 0);
            ObjectParameter numContratosPendientesParameter = new("TOTALREGISTROSPENDIENTES", 0);
            ObjectParameter valContratosPendientesParameter = new("VALORCONTRATOSPENDIENTES", 0);
            ObjectParameter numContratosTerminadosParameter = new("TOTALREGISTROSTERMINADOS", 0);
            ObjectParameter valContratosTerminadosParameter = new("VALORCONTRATOSTERMINADOS", 0);
            ObjectParameter numProcesosCanceladosParameter = new("TOTALPROCESOSCANCELADOS", 0);
            ObjectParameter valProcesosCanceladosParameter = new("VALORPROCESOSCANCELADOS", 0);

            var NumContratosActivos = int.Parse(numContratosActivosParameter.Value.ToString());
            var ValorTotalContratosActivos = long.Parse(valContratosActivosParameter.Value.ToString());
            objContrato.es_programa = false;
            objContrato.IdItem = 0;
            objContrato.orden = 0;
            objContrato.NomItem = "CONTRATOS";
            objContrato.label_nombre = "";
            objContrato.label_beneficiarios = "Contratos activos";
            objContrato.label_boton = "Ver contratos activos";
            objContrato.label_valor = "Total contratos activos";
            objContrato.total_beneficiarios = NumContratosActivos;
            objContrato.total_valor = ValorTotalContratosActivos;

            var RecursosPerObjetoQuery = (from cifras in _connection.VwSubsidiosEmergenciaConsolidadoes
                                          where cifras.NumeroBeneficarios.HasValue && cifras.Valor.HasValue
                                          select new InfoConsolidadoRecursos
                                          {
                                              IdItem = cifras.Id,
                                              NomItem = cifras.Origen,
                                              total_beneficiarios = cifras.NumeroBeneficarios.Value,
                                              total_valor = cifras.Valor.Value,
                                      ***REMOVED***).ToList();

            foreach (var fila in RecursosPerObjetoQuery)
            {
                var foundItem = ordenIni.SingleOrDefault(item => item.nombre.ToUpper() == fila.NomItem.ToUpper());
                if (foundItem != null)
                {
                    fila.es_programa = foundItem.estado;
                    fila.label_beneficiarios = foundItem.label_beneficiarios;
                    fila.label_nombre = foundItem.label_nombre;
                    fila.label_boton = foundItem.label_boton;
                    fila.label_valor = foundItem.label_valor;
                    fila.orden = foundItem.orden;
                    fila.externo = foundItem.externo;
            ***REMOVED***
        ***REMOVED***
            objReturn_aux = RecursosPerObjetoQuery;
            objReturn_aux.Add(objContrato);
            objReturn = objReturn_aux.OrderBy(x => x.orden).ToList();
            //***REMOVED***
            return objReturn;
    ***REMOVED***


        public ModelContratistaData ObtenerDatosProcesosCanceladosEmergencia(int tipoEmergencia, string Entidad = null)
        {
            ModelContratistaData objReturn = new ModelContratistaData();
            objReturn.nombreUnidadCompra= Entidad;
            objReturn.tipoEmergencia = tipoEmergencia;
            return objReturn;
    ***REMOVED***


        public ModelInformacionContratos ObtenerInformacionProcesosCanceladosEmergenciaPorFiltros(ContratosFiltros filtros)
        {
            ModelInformacionContratos _objreturn = new ModelInformacionContratos();
            String NombreProceso = null;
            String NombreEntidad = null;
            String NombreContratista = null;
            String CodigoProceso = null;
            int? Annio = null;
            int? TipoEmergencia = null;

            if (filtros.NombreProceso != null && filtros.NombreProceso.Trim() != "") { NombreProceso = filtros.NombreProceso; ***REMOVED***
            if (filtros.NombreEntidad != null && filtros.NombreEntidad.Trim() != "") { NombreEntidad = filtros.NombreEntidad; ***REMOVED***
            if (filtros.NombreContratista != null && filtros.NombreContratista.Trim() != "") { NombreContratista = filtros.NombreContratista; ***REMOVED***
            if (filtros.CodigoProceso != null && filtros.CodigoProceso.Trim() != "") { CodigoProceso = filtros.CodigoProceso; ***REMOVED***
            if (filtros.Annio != 0) { Annio = filtros.Annio; ***REMOVED***
            if (filtros.OrigenInformacion != null && filtros.OrigenInformacion.Trim() != "") { TipoEmergencia = int.Parse(filtros.OrigenInformacion); ***REMOVED***


            try
            {
                _objreturn.CantidadTotalRegistros = (
                                                     from cont in _connection.VwProcesosCanceladosEmergencias
                                                     where
                                                        (cont.UnidadCompra.Contains(NombreEntidad) || NombreEntidad == null)
                                                       && (cont.Descripcion.Contains(NombreProceso)
                                                        || cont.CodigoProceso.TrimStart() == NombreProceso || NombreProceso == null)
                                                       && (cont.Origen == TipoEmergencia || TipoEmergencia == null)
                                                     let NUMBER = Sql.Ext.DenseRank().Over().OrderBy(cont.UnidadCompra).ThenBy(cont.CodigoProceso).ThenBy(cont.Origen).ToValue()
                                                     orderby NUMBER descending
                                                     select NUMBER
                               ).First();
        ***REMOVED***
            catch
            {
                _objreturn.CantidadTotalRegistros = 0;
        ***REMOVED***




            _objreturn.listInformacion = (from cont in _connection.VwProcesosCanceladosEmergencias
                                          where
                                (cont.UnidadCompra.Contains(NombreEntidad) || NombreEntidad == null)
                               && (cont.Descripcion.Contains(NombreProceso)
                               || cont.CodigoProceso.TrimStart() == NombreProceso || NombreProceso == null)
                               && (cont.Origen == TipoEmergencia || TipoEmergencia == null)
                               let NUMBER = Sql.Ext.DenseRank().Over().OrderBy(cont.UnidadCompra).ThenBy(cont.CodigoProceso).ThenBy(cont.Origen).ToValue()
                               where
                               NUMBER > ((filtros.NumeroPagina - 1) * filtros.RegistrosPorPagina)
                               && NUMBER <= (filtros.NumeroPagina * filtros.RegistrosPorPagina)
                               select new InformacionContratos
                               {
                                   CodigoUnidadCompra = cont.CodigoUnidadCompra,
                                   UnidadCompra = cont.UnidadCompra,
                                   CodigoProceso = cont.CodigoProceso,
                                   CodigoModalidad = cont.CodigoModalidad,
                                   Modalidad = cont.Modalidad,
                                   TipoExcepcion = cont.TipoExcepcion,
                                   Caratula = cont.Caratula,
                                   Descripcion = cont.Descripcion,
                                   EstadoProceso = cont.EstadoProceso,
                                   FaseProceso = cont.FaseProceso,
                                   Moneda = cont.Moneda,
                                   MontoEstimado = cont.MontoEstimado,
                                   FechaPublicacion = cont.FechaPublicacion,
                                   FechaEnmienda = cont.FechaEnmienda,
                                   FechaFinRecepcionOfertas = cont.FechaFinRecepcionOfertas,
                                   FechaAperturaOfertas = cont.FechaAperturaOfertas,
                                   FechaEstimadaAdjudicacion = cont.FechaEstimadaAdjudicacion,
                                   FechaSuscripcion = cont.FechaSuscripcion,
                                   DirigidoMipymes = cont.DirigidoMipymes,
                                   DirigidoMipymesMujeres = cont.DirigidoMipymesMujeres,
                                   ProcesoLotificado = cont.ProcesoLotificado,
                                   AdquisicionPlaneada = cont.AdquisicionPlaneada,
                                   ObjetoProceso = cont.ObjetoProceso,
                                   SubobjetoProceso = cont.SubobjetoProceso,
                                   Url = cont.Url,
                                   MotivoCancelacion = cont.MotivoCancelacion,
                                   Origen = cont.Origen
                           ***REMOVED***
                             ).Distinct().ToList();


            return _objreturn;
    ***REMOVED***

        

***REMOVED***
***REMOVED***
