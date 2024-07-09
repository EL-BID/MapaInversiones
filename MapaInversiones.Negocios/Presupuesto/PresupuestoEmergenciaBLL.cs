using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Emergencia;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PlataformaTransparencia.Negocios.Presupuesto
{
    public class PresupuestoEmergenciaBLL : IPresupuestoEmergenciaBLL
    {
        private readonly TransparenciaDB _connection;
        private List<Infrastructura.DataModels.Proyecto> lstProyectosConsistentes;
        private List<EnteTerritorial> lstDepartamentosIni;
        private List<EnteTerritorial> lstMunicipiosIni;
        private List<InfoProyectos> lstProyectosAprobados;
        private List<InfoProyectos> lstProyectosAll;
        private List<InfoProyectos> lstProyNacionales;

        public PresupuestoEmergenciaBLL(TransparenciaDB connection)
        {
            _connection = connection;
            lstProyectosConsistentes = new();
            lstDepartamentosIni = new();
            lstMunicipiosIni = new();
            lstProyectosAprobados = new();
            lstProyectosAll = new();
            lstProyNacionales = new();
    ***REMOVED***

        /// <summary>
        /// Constructor que Genera los datos a partir de las consultas
        /// para su uso posterior
        /// </summary>
        public ModelHomeGestionData ObtenerDatosModeloInicio(bool esHome = true)
        {
            ModelHomeGestionData objReturn = new();
            if (!esHome) return objReturn;
            #region DATOSCONTRATOS
            ///RECUADRO CONSOLIDADOS NEW VERSION
            objReturn.resumenDatosContratos = ObtenerDatosContratos();
            objReturn.InfoRecursosContratos = ObtenerRecursosPerContratosGroup();
            objReturn.InfoRecursosProcesos = ObtenerRecursosPerProcesosGroup();
            #endregion
            objReturn.Status = true;
            return objReturn;
    ***REMOVED***

        public ModelHomeGestionData ObtenerDatosModeloInicio(int tipoEmergencia)
        {
            ModelHomeGestionData objReturn = new()
            {
                #region DATOSCONTRATOS
                ///RECUADRO CONSOLIDADOS NEW VERSION
                resumenDatosContratos = ObtenerDatosContratosPorTipoEmergencia(tipoEmergencia),
                InfoRecursosContratos = ObtenerRecursosPerContratosPorTipoEmergencia(tipoEmergencia),
                InfoRecursosProcesos = ObtenerRecursosPerProcesosPorTipoEmergencia(tipoEmergencia),
                #endregion
                Status = true
        ***REMOVED***;
            return objReturn;
    ***REMOVED***

        public ModelPresupuestoGeneralEmergenciaData ObtenerDatosPresupuestoGeneralEmergencias()
        {
            ModelPresupuestoGeneralEmergenciaData objReturn = new()
            {
                Anios = ObtenerAniosPresupuestoGeneralEmergencias(),
                PresupuestoGeneralPorAnios = ObtenerPresupuestoGeneralEmergenciasPorAnios(),
                PresupuestoEjecutadoPorEmergencias = ObtenerPresupuestoGeneralEjecutadoPorEmergencias(),

        ***REMOVED***;
            return objReturn;
    ***REMOVED***
        public List<InfoGraficoItemPrograma> ObtenerPresupuestoGeneralAsignadoPorEntidad()
        {
            List<InfoGraficoItemPrograma> objReturn = new();

            List<InfoTablaExpandible> datos = (from info in _connection.GastoXProgramasEmergencias
                                               where info.IdOrigen == 99999 && info.PeriodoImputacion != null  //&&info.PERIODO_IMPUTACION==anio
                                               group info by new { info.NomCapitulo, info.NomUe, info.NomProgramaAsistencia, info.PeriodoImputacion ***REMOVED*** into g
                                               select new InfoTablaExpandible
                                               {
                                                   Anio = g.Key.PeriodoImputacion, //Año
                                                   Nivel1 = g.Key.NomCapitulo, //Nivel 1
                                                   Nivel2 = g.Key.NomUe, //Nivel 2
                                                   Nivel3 = g.Key.NomProgramaAsistencia, //Nivel 3
                                                   ValorGastado = g.Sum(x => x.VlrGasto ?? 0),
                                                   ValorEjecutado = g.Sum(x => x.VlrEjecutado ?? 0)
                                           ***REMOVED***).ToList();
            if (datos.Count == 0) return objReturn;
            var datosNivel1 = (from dato in datos
                               group dato by new { dato.Nivel1, dato.Anio ***REMOVED*** into g
                               select new
                               {
                                   g.Key.Anio,
                                   g.Key.Nivel1,
                                   ValorGastado = g.Sum(x => x.ValorGastado),
                                   ValorEjecutado = g.Sum(x => x.ValorEjecutado)
                           ***REMOVED***).ToList();
            for (int i = 0; i < datosNivel1.Count; i++)
            {
                var datoNivel1 = datosNivel1[i];
                decimal ejecutadoNivel1 = Convert.ToDecimal(datoNivel1.ValorEjecutado);
                InfoGraficoItemPrograma itemNivel1 = new InfoGraficoItemPrograma(i.ToString(), datoNivel1.Nivel1) { Anio = datoNivel1.Anio, total_presupuesto = datoNivel1.ValorGastado, total_avance = ejecutadoNivel1, porcentajeCumplimiento = datoNivel1.ValorGastado == 0 ? 0 : ejecutadoNivel1 * 100 / datoNivel1.ValorGastado ***REMOVED***;
                var datosNivel2 = (from dato in datos
                                   where dato.Nivel1 == datoNivel1.Nivel1 && dato.Anio == datoNivel1.Anio
                                   group dato by new { dato.Nivel2, dato.Anio ***REMOVED*** into g
                                   select new
                                   {
                                       g.Key.Anio,
                                       g.Key.Nivel2,
                                       ValorGastado = g.Sum(x => x.ValorGastado),
                                       ValorEjecutado = g.Sum(x => x.ValorEjecutado)
                               ***REMOVED***).ToList();
                for (int j = 0; j < datosNivel2.Count; j++)
                {
                    var datoNivel2 = datosNivel2[j];
                    decimal ejecutadoNivel2 = Convert.ToDecimal(datoNivel2.ValorEjecutado);
                    InfograficoCapitulo itemNivel2 = new InfograficoCapitulo(j.ToString(), datoNivel2.Nivel2) { Anio = datoNivel2.Anio, presupuesto = datoNivel2.ValorGastado, avance = ejecutadoNivel2, porcentajeCumplimiento = datoNivel2.ValorGastado == 0 ? 0 : ejecutadoNivel2 * 100 / datoNivel2.ValorGastado ***REMOVED***;
                    var datosNivel3 = (from dato in datos
                                       where dato.Nivel1 == datoNivel1.Nivel1 && dato.Nivel2 == datoNivel2.Nivel2 && dato.Anio == datoNivel2.Anio
                                       group dato by new { dato.Nivel3, dato.Anio ***REMOVED*** into g
                                       select new
                                       {
                                           g.Key.Anio,
                                           g.Key.Nivel3,
                                           ValorGastado = g.Sum(x => x.ValorGastado),
                                           ValorEjecutado = g.Sum(x => x.ValorEjecutado)
                                   ***REMOVED***).ToList();
                    for (int k = 0; k < datosNivel3.Count; k++)
                    {
                        var datoNivel3 = datosNivel3[k];
                        decimal ejecutadoNivel3 = Convert.ToDecimal(datoNivel3.ValorEjecutado);
                        itemNivel2.Detalles.Add(new InfograficoConcepto(k.ToString(), datoNivel3.Nivel3) { Anio = datoNivel3.Anio, presupuesto = datoNivel3.ValorGastado, avance = ejecutadoNivel3, porcentajeCumplimiento = datoNivel3.ValorGastado == 0 ? 0 : ejecutadoNivel3 * 100 / datoNivel3.ValorGastado ***REMOVED***);
                ***REMOVED***
                    itemNivel1.Detalles.Add(itemNivel2);
            ***REMOVED***
                objReturn.Add(itemNivel1);
        ***REMOVED***

            return objReturn;
    ***REMOVED***

        public List<InfoPresupuestoEjecutadoPorEmergencia> ObtenerPresupuestoGeneralEjecutadoPorEmergencias()
        {
            List<InfoPresupuestoEjecutadoPorEmergencia> objReturn = new List<InfoPresupuestoEjecutadoPorEmergencia>();
            List<InfoPresupuestoGeneralPorAnio> presupuestoGeneralEmergenciasPorAnio = ObtenerPresupuestoGeneralEmergenciasPorAnios();

            var detalleEmergenciasNoCovidPorPeriodo = (from item in _connection.GastoXProgramasEmergencias
                                                       join origen in _connection.OrigenDatos on item.IdOrigen.Value equals origen.IdOrigen
                                                       where origen.IdOrigen != 99999 && origen.IdOrigen != 1
                                                       group item by new { item.PeriodoImputacion, origen.Descripcion ***REMOVED*** into g
                                                       select new
                                                       {
                                                           Anio = g.Key.PeriodoImputacion,
                                                           Origen = g.Key.Descripcion,
                                                           Ejecutado = g.Sum(x => x.VlrEjecutado ?? 0)
                                                   ***REMOVED***).Distinct().ToList();
            var consolidadoEmergenciasNoCovidPorAnio = (from detalleEmergenciaNoCovidPorPeriodo in detalleEmergenciasNoCovidPorPeriodo
                                                        group detalleEmergenciaNoCovidPorPeriodo by new { detalleEmergenciaNoCovidPorPeriodo.Anio ***REMOVED*** into g
                                                        select new
                                                        {
                                                            g.Key.Anio,
                                                            Ejecutado = g.Sum(x => x.Ejecutado)
                                                    ***REMOVED***).ToList();

            var otrasEmergenciasPorAnio = (from presupuestoGeneralEmergenciaPorAnio in presupuestoGeneralEmergenciasPorAnio
                                           join consolidadoEmergenciaNoCovidPorAnio in consolidadoEmergenciasNoCovidPorAnio on presupuestoGeneralEmergenciaPorAnio.Anio.ToString() equals consolidadoEmergenciaNoCovidPorAnio.Anio
                                           select new
                                           {
                                               presupuestoGeneralEmergenciaPorAnio.Anio,
                                               PresupuestoEjecutado = presupuestoGeneralEmergenciaPorAnio.PresupuestoEjecutado - Convert.ToDouble(consolidadoEmergenciaNoCovidPorAnio.Ejecutado / 1000000.0)
                                       ***REMOVED***).ToList();

            foreach (var detalleEmergencia in detalleEmergenciasNoCovidPorPeriodo)
            {
                string ano = detalleEmergencia == null || detalleEmergencia.Anio == null ? string.Empty : detalleEmergencia.Anio.ToString();
                if (ano != string.Empty)
                {
                    if (int.TryParse(ano, out int anio))
                    {
                        objReturn.Add(new InfoPresupuestoEjecutadoPorEmergencia { Anio = anio, Nombre = detalleEmergencia.Origen, PresupuestoEjecutado = Math.Round(Convert.ToDouble(detalleEmergencia.Ejecutado / 1000000.0), 2), Enlace = detalleEmergencia.Origen.ToUpper() == "LLUVIAS" ? string.Empty : ObtenerEnlacePorTipoEmergencia(detalleEmergencia.Origen) ***REMOVED***);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            foreach (var otraEmergencia in otrasEmergenciasPorAnio)
            {
                objReturn.Add(new InfoPresupuestoEjecutadoPorEmergencia { Anio = otraEmergencia.Anio, Nombre = "Otras", PresupuestoEjecutado = Math.Round(otraEmergencia.PresupuestoEjecutado, 2), Enlace = string.Empty ***REMOVED***);
        ***REMOVED***

            if (objReturn.Count > 0) objReturn = new List<InfoPresupuestoEjecutadoPorEmergencia>(objReturn.OrderByDescending(x => x.Anio));
            return objReturn;
    ***REMOVED***

        private static string ObtenerEnlacePorTipoEmergencia(string tipoEmergencia)
        {
            switch (tipoEmergencia)
            {
                case "Lluvias":
                    return "LLuvias";
                case "Huracán Fiona":
                    return "Emergencia";
                case "Lluvias 2023":
                    return "Emergencia?emergencia=5";
        ***REMOVED***
            return string.Empty;
    ***REMOVED***
        private List<InfoPresupuestoGeneralPorAnio> ObtenerPresupuestoGeneralEmergenciasPorAnios()
        {
            List<InfoPresupuestoGeneralPorAnio> objReturn = new();

            var consolidadoPorPeriodo = (from item in _connection.GastoXProgramasEmergencias
                                         where item.IdOrigen.HasValue && item.IdOrigen == 99999
                                         group item by new { item.PeriodoImputacion ***REMOVED*** into g
                                         select new
                                         {
                                             Anio = g.Key.PeriodoImputacion,
                                             Ejecutado = g.Sum(x => x.VlrEjecutado ?? 0.0),
                                             Presupuestado = g.Sum(x => x.VlrGasto ?? 0)
                                     ***REMOVED***).Distinct().ToList();
            foreach (var consolidado in consolidadoPorPeriodo)
            {
                string ano = consolidado == null || consolidado.Anio == null ? string.Empty : consolidado.Anio.ToString();
                if (ano != string.Empty)
                {
                    if (int.TryParse(ano, out int anio))
                        objReturn.Add(new InfoPresupuestoGeneralPorAnio { Anio = anio, PresupuestoAsignado = Math.Round(Convert.ToDouble(consolidado.Presupuestado / 1000000), 2), PresupuestoEjecutado = Math.Round(consolidado.Ejecutado / 1000000.0, 2), PorcentajeAvance = consolidado.Presupuestado == 0 ? 0.0 : Math.Round(consolidado.Ejecutado * 100 / Convert.ToDouble(consolidado.Presupuestado), 2) ***REMOVED***);
            ***REMOVED***
        ***REMOVED***

            if (objReturn.Count > 0) objReturn = new List<InfoPresupuestoGeneralPorAnio>(objReturn.OrderByDescending(x => x.Anio));
            return objReturn;
    ***REMOVED***
        private List<int> ObtenerAniosPresupuestoGeneralEmergencias()
        {
            List<int> objReturn = new();

            var periodosImputacion = (from item in _connection.GastoXProgramasEmergencias
                                      where item.IdOrigen.HasValue && item.IdOrigen == 99999
                                      select new
                                      {
                                          Anio = item.PeriodoImputacion
                                  ***REMOVED***).Distinct().ToList();
            foreach (var periodoImputacion in periodosImputacion)
            {
                if (periodoImputacion != null)
                {
                    if (int.TryParse(periodoImputacion.Anio.ToString(), out int anio))
                        objReturn.Add(anio);
            ***REMOVED***
        ***REMOVED***

            if (objReturn.Count > 1) objReturn = new List<int>(objReturn.OrderByDescending(x => x));
            return objReturn;
    ***REMOVED***

        public ModelContratistaData ObtenerDatosContratos(string entidad = null)
        {
            ModelContratistaData objReturn = new();
        
            objReturn.numContratos = objReturn.listUnidadCompra.Sum(a => a.NroContratos);
            objReturn.valorContratos = objReturn.listUnidadCompra.Sum(a => a.ValorContratado);
            objReturn.numProcesos = objReturn.listUnidadCompra.Sum(a => a.NroProcesos);
            objReturn.valorProcesos = (decimal?)objReturn.listUnidadCompra.Sum(a => a.ValorProceso);

            objReturn.listUnidadCompra = objReturn.listUnidadCompra.OrderByDescending(a => a.ValorContratado).Take(4).ToList();
            return objReturn;

    ***REMOVED***

        public ModelContratistaData ObtenerDatosContratosPorTipoEmergencia(int tipoEmergencia)
        {
            ModelContratistaData objReturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                var contratosByEntidad = (from consolidadoContrato in DataModel.VwConsolidadoContratacionEmergencias
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
                objReturn.listUnidadCompra = (from info in DataModel.VwConsolidadoProcesosContratacionEmergencias
                                              where info.Origen.HasValue && info.Origen == tipoEmergencia && info.ValorProceso.HasValue
                                              group info by new { info.Entidad, info.MonedaProceso ***REMOVED*** into g
                                              select new Modelos.Contratos.UnidadCompras
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
                objReturn.listContratista = (from contratista in DataModel.VwContratosPerfilContratistas
                                             where contratista.OrigenInformacion == tipoEmergencia.ToString() && contratista.ValorTotalContratos.HasValue
                                             select new Modelos.Contratos.Contratista
                                             {
                                                 nombre = contratista.Contratista,
                                                 ruc = contratista.Numerodocumento,
                                                 tipodocumento = contratista.Tipodocumento,
                                                 ValorTotalContratos = contratista.ValorTotalContratos,
                                                 NumContratos = contratista.NumContratos,
                                                 NumProcesos = contratista.NumProcesos,
                                                 EsCovid = contratista.OrigenInformacion
                                         ***REMOVED***
                                            ).ToList();
                if (DataModel.GastoXProgramasEmergencias.Where(x => x.IdOrigen.HasValue && x.IdOrigen.Value == tipoEmergencia && x.VlrGasto.HasValue).Count() > 0)
                    objReturn.valorEjecutado = Convert.ToDecimal(DataModel.GastoXProgramasEmergencias.Where(x => x.IdOrigen.HasValue && x.IdOrigen.Value == tipoEmergencia && x.VlrEjecutado.HasValue).Sum(x => x.VlrEjecutado.Value));
        ***REMOVED***
            objReturn.numProcesos = objReturn.listUnidadCompra.Sum(a => a.NroProcesos);
            objReturn.valorProcesos = (decimal?)objReturn.listUnidadCompra.Sum(a => a.ValorProceso);
            objReturn.listUnidadCompra = objReturn.listUnidadCompra.OrderByDescending(a => a.ValorContratado).ToList();//Take(4).

            if (objReturn.listContratista.Count > 0) objReturn.listContratista = objReturn.listContratista.OrderByDescending(x => x.ValorTotalContratos).ToList();
            return objReturn;
    ***REMOVED***

        /// <summary>
        /// Constructor que Genera los datos a partir de las consultas
        /// para su uso posterior
        /// </summary>
        public ModelPresupuestoEmergenciaData ObtenerDatosModeloInicioPorTipoEmergencia(int tipoEmergencia)
        {
            ModelPresupuestoEmergenciaData objReturn = new();
            #region DATOSCONTRATOS
            ///RECUADRO CONSOLIDADOS NEW VERSION
            Home.HomeBLL objDatosConsolidados = new(_connection);
            objReturn.ResumenDatosContratos = objDatosConsolidados.ObtenerDatosContratosGestion(tipoEmergencia);
            #endregion
            #region RECXOBJETOGASTO
            objReturn.RecursosPerObjetoAvance = ObtenerRecursosPorOrganismoFinanciadorPorTipoEmergencia(tipoEmergencia);
            objReturn.DetallePerObjetoGasto = ObtenerInfoGraficoGastoPorTipoEmergencia(tipoEmergencia);
            objReturn.InfoRecursosContratos = ObtenerRecursosPerContratosPorTipoEmergencia(tipoEmergencia);
            objReturn.RecursosAdministracionCentral = ObtenerRecursosEmergenciaPorTipoAdministracion(tipoEmergencia, "Administración central");
            objReturn.RecursosAdministracionDescentralizado = ObtenerRecursosEmergenciaPorTipoAdministracion(tipoEmergencia, "Descentralizado");
            objReturn.NombreEmergencia = ObtenerNombreEmergenciaPorTipoEmergencia(tipoEmergencia);
            #endregion
            objReturn.Status = true;
            return objReturn;
    ***REMOVED***

        private string ObtenerNombreEmergenciaPorTipoEmergencia(int tipoEmergencia)
        {
            string rta = string.Empty;
            using (var DataModel = new TransparenciaDB())
            {
                string origen=  DataModel.OrigenDatos.Where(x => x.IdOrigen == tipoEmergencia).Select(x => x.Descripcion).FirstOrDefault();
                if (origen != null) return origen ?? string.Empty;
        ***REMOVED***
            return rta;
    ***REMOVED***

        private static List<InfoGraficoItemPrograma> ObtenerRecursosEmergenciaPorTipoAdministracion(int tipoEmergencia, string tipoAdministracion)
        {
            List<InfoGraficoItemPrograma> objReturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                List<InfoTablaExpandible> datos = new();
                switch (tipoAdministracion.ToUpper().Trim())
                {
                    case "ADMINISTRACIÓN CENTRAL":
                        datos = (from info in DataModel.GastoXProgramasEmergencias
                                 where info.IdOrigen == tipoEmergencia && info.DesSeccion.ToUpper().Trim() == "ADMINISTRACIÓN CENTRAL"
                                 group info by new { info.NomCapitulo, info.NomUe, info.DesCcpCuenta ***REMOVED*** into g
                                 select new InfoTablaExpandible
                                 {
                                     Nivel1 = g.Key.NomCapitulo, //Nivel 1
                                     Nivel2 = g.Key.NomUe, //Nivel 2
                                     Nivel3 = g.Key.DesCcpCuenta, //Nivel 3
                                     ValorGastado = g.Sum(x => x.VlrGasto ?? 0),
                                     ValorEjecutado = g.Sum(x => x.VlrEjecutado ?? 0)
                             ***REMOVED***).ToList();
                        break;
                    default:
                        datos = (from info in DataModel.GastoXProgramasEmergencias
                                 where info.IdOrigen == tipoEmergencia && info.DesSeccion.ToUpper().Trim() == "INSTITUCIONES PÚBLICAS DESCENTRALIZADAS Y AUTÓNOMAS NO FINANCIERAS"
                                 group info by new { info.NomCapitulo, info.NomUe, info.DesCcpCuenta ***REMOVED*** into g
                                 select new InfoTablaExpandible
                                 {
                                     Nivel1 = g.Key.NomCapitulo, //Nivel 1
                                     Nivel2 = g.Key.NomUe, //Nivel 2
                                     Nivel3 = g.Key.DesCcpCuenta, //Nivel 3
                                     ValorGastado = g.Sum(x => x.VlrGasto ?? 0),
                                     ValorEjecutado = g.Sum(x => x.VlrEjecutado ?? 0)
                             ***REMOVED***).ToList();
                        break;
            ***REMOVED***
                if (datos.Count == 0) return objReturn;
                var datosNivel1 = (from dato in datos
                                   group dato by dato.Nivel1 into g
                                   select new
                                   {
                                       Nivel1 = g.Key,
                                       ValorGastado = g.Sum(x => x.ValorGastado),
                                       ValorEjecutado = g.Sum(x => x.ValorEjecutado)
                               ***REMOVED***).ToList();
                for (int i = 0; i < datosNivel1.Count; i++)
                {
                    if (datosNivel1[i].ValorEjecutado != 0.0 || datosNivel1[i].ValorGastado != 0)
                    {
                        var datoNivel1 = datosNivel1[i];
                        decimal ejecutadoNivel1 = Convert.ToDecimal(datoNivel1.ValorEjecutado);
                        InfoGraficoItemPrograma itemNivel1 = new(i.ToString(), datoNivel1.Nivel1) { total_presupuesto = datoNivel1.ValorGastado, total_avance = ejecutadoNivel1, porcentajeCumplimiento = datoNivel1.ValorGastado == 0 ? 0 : ejecutadoNivel1 * 100 / datoNivel1.ValorGastado ***REMOVED***;
                        var datosNivel2 = (from dato in datos
                                           where dato.Nivel1 == datoNivel1.Nivel1
                                           group dato by dato.Nivel2 into g
                                           select new
                                           {
                                               Nivel2 = g.Key,
                                               ValorGastado = g.Sum(x => x.ValorGastado),
                                               ValorEjecutado = g.Sum(x => x.ValorEjecutado)
                                       ***REMOVED***).ToList();
                        for (int j = 0; j < datosNivel2.Count; j++)
                        {
                            var datoNivel2 = datosNivel2[j];
                            decimal ejecutadoNivel2 = Convert.ToDecimal(datoNivel2.ValorEjecutado);
                            InfograficoCapitulo itemNivel2 = new(j.ToString(), datoNivel2.Nivel2) { presupuesto = datoNivel2.ValorGastado, avance = ejecutadoNivel2, porcentajeCumplimiento = datoNivel2.ValorGastado == 0 ? 0 : ejecutadoNivel2 * 100 / datoNivel2.ValorGastado ***REMOVED***;
                            var datosNivel3 = (from dato in datos
                                               where dato.Nivel1 == datoNivel1.Nivel1 && dato.Nivel2 == datoNivel2.Nivel2
                                               group dato by dato.Nivel3 into g
                                               select new
                                               {
                                                   Nivel3 = g.Key,
                                                   ValorGastado = g.Sum(x => x.ValorGastado),
                                                   ValorEjecutado = g.Sum(x => x.ValorEjecutado)
                                           ***REMOVED***).ToList();
                            for (int k = 0; k < datosNivel3.Count; k++)
                            {
                                var datoNivel3 = datosNivel3[k];
                                decimal ejecutadoNivel3 = Convert.ToDecimal(datoNivel3.ValorEjecutado);
                                itemNivel2.Detalles.Add(new InfograficoConcepto(k.ToString(), datoNivel3.Nivel3) { presupuesto = datoNivel3.ValorGastado, avance = ejecutadoNivel3, porcentajeCumplimiento = datoNivel3.ValorGastado == 0 ? 0 : ejecutadoNivel3 * 100 / datoNivel3.ValorGastado ***REMOVED***);
                        ***REMOVED***
                            itemNivel1.Detalles.Add(itemNivel2);
                    ***REMOVED***
                        objReturn.Add(itemNivel1);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            return objReturn;
    ***REMOVED***

        public List<InfoGraficoItemPrograma> ObtenerInfoGraficoGastoPorTipoEmergencia(int tipoEmergencia)
        {
            List<InfoGraficoItemPrograma> objReturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                //DataModel.Configuration.AutoDetectChangesEnabled = false;
                List<string> programasEmergencia = (from info in DataModel.GastoXProgramasEmergencias
                                                    where info.IdOrigen == tipoEmergencia
                                                    select info.NomProgramaAsistencia).Distinct().ToList();
                if (programasEmergencia != null && programasEmergencia.Any())
                {
                    var recursos = (from info in DataModel.GastoXProgramasEmergencias
                                    where info.IdOrigen == tipoEmergencia && info.DesSeccion.ToUpper().Trim() != "NO APLICA"
                                    group info by new { info.NomProgramaAsistencia, info.CodCapitulo, info.NomCapitulo, info.CodCcpConcepto, info.DesCcpConcepto, info.CodCcpCuenta, info.DesCcpCuenta ***REMOVED*** into g
                                    select new
                                    {
                                        ItemPrograma = g.Key.NomProgramaAsistencia,
                                        cod_capitulo = g.Key.CodCapitulo,
                                        nom_capitulo = g.Key.NomCapitulo,
                                        codigoConcepto = g.Key.CodCcpConcepto,
                                        NombreConcepto = g.Key.DesCcpConcepto,
                                        CodigoCuentaObjeto = g.Key.CodCcpCuenta,
                                        NombreCuentaObjeto = g.Key.DesCcpCuenta,
                                        AvanceProgramaxObjeto = g.Sum(x => x.VlrEjecutado ?? 0.0)
                                ***REMOVED***).ToList();

                    var recursosNivel1 = (from info in recursos
                                          group info by new { info.ItemPrograma ***REMOVED*** into g
                                          select new
                                          {
                                              NombreNivel1 = g.Key.ItemPrograma,
                                              Avance = g.Sum(x => x.AvanceProgramaxObjeto)
                                      ***REMOVED***).OrderByDescending(x => x.Avance).ToList();

                    if (recursosNivel1.Count > 0)
                    {
                        for (int i = 0; i < recursosNivel1.Count; i++)
                        {
                            if (recursosNivel1[i].Avance > 0.0)
                            {
                                var recursoNivel1 = recursosNivel1[i];
                                InfoGraficoItemPrograma nivel1 = new((i + 1).ToString(), recursoNivel1.NombreNivel1) { avance = Convert.ToDecimal(recursoNivel1.Avance), es_programa = true, Detalles = new(), total_avance = Convert.ToDecimal(recursoNivel1.Avance) ***REMOVED***;
                                var recursosNivel2 = (from info in recursos
                                                      where info.ItemPrograma == recursoNivel1.NombreNivel1
                                                      group info by new { info.nom_capitulo ***REMOVED*** into g
                                                      select new
                                                      {
                                                          NombreNivel2 = g.Key.nom_capitulo,
                                                          Avance = g.Sum(x => x.AvanceProgramaxObjeto)
                                                  ***REMOVED***).ToList();
                                for (int j = 0; j < recursosNivel2.Count; j++)
                                {
                                    var recursoNivel2 = recursosNivel2[j];
                                    InfograficoCapitulo nivel2 = new((j + 1).ToString(), recursoNivel2.NombreNivel2) { avance = Convert.ToDecimal(recursoNivel2.Avance), Detalles = new() ***REMOVED***;
                                    var recursosNivel3 = (from info in recursos
                                                          where info.ItemPrograma == recursoNivel1.NombreNivel1 && info.nom_capitulo == recursoNivel2.NombreNivel2
                                                          group info by new { info.NombreConcepto ***REMOVED*** into g
                                                          select new
                                                          {
                                                              NombreNivel3 = g.Key.NombreConcepto,
                                                              Avance = g.Sum(x => x.AvanceProgramaxObjeto)
                                                      ***REMOVED***).ToList();
                                    for (int k = 0; k < recursosNivel3.Count; k++)
                                    {
                                        var recursoNivel3 = recursosNivel3[k];
                                        InfograficoConcepto nivel3 = new((k + 1).ToString(), recursoNivel3.NombreNivel3) { avance = Convert.ToDecimal(recursoNivel3.Avance), Detalles = new() ***REMOVED***;
                                        var recursosNivel4 = (from info in recursos
                                                              where info.ItemPrograma == recursoNivel1.NombreNivel1 && info.nom_capitulo == recursoNivel2.NombreNivel2 && info.NombreConcepto == recursoNivel3.NombreNivel3
                                                              group info by new { info.NombreCuentaObjeto, info.CodigoCuentaObjeto ***REMOVED*** into g
                                                              select new
                                                              {
                                                                  NombreNivel4 = g.Key.NombreCuentaObjeto,
                                                                  Codigo = g.Key.CodigoCuentaObjeto,
                                                                  Avance = g.Sum(x => x.AvanceProgramaxObjeto)
                                                          ***REMOVED***).ToList();
                                        foreach (var recursoNivel4 in recursosNivel4)
                                            nivel3.Detalles.Add(new InfograficoCuentaGasto(recursoNivel4.Codigo, recursoNivel4.NombreNivel4, 0, Convert.ToDecimal(recursoNivel4.Avance)));
                                        nivel2.Detalles.Add(nivel3);
                                ***REMOVED***
                                    nivel1.Detalles.Add(nivel2);
                            ***REMOVED***
                                objReturn.Add(nivel1);
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            return objReturn;
    ***REMOVED***

        /// <summary>
        /// Datos treemap recursos -Avance
        /// </summary>
        /// <returns></returns>
        public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPorOrganismoFinanciadorPorTipoEmergencia(int tipoEmergencia)
        {
            List<InfoRecursosEmergenciaPerObjeto> objReturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                var RecursosPerObjetoQuery = (from info in DataModel.GastoXProgramasEmergencias
                                              where info.IdOrigen == tipoEmergencia && info.VlrEjecutado.HasValue && info.VlrEjecutado.Value > 0
                                              orderby info.NomProgramaAsistencia, info.NomCapitulo, info.DesCcpConcepto
                                              , info.DesCcpCuenta, info.VlrEjecutado.Value descending
                                              select new InfoRecursosEmergenciaPerObjeto
                                              {
                                                  Anio = info.PeriodoImputacion,
                                                  labelGroup = info.NomProgramaAsistencia == "FASET" ? "FASE TURISMO" : info.NomProgramaAsistencia,
                                                  label = info.NomCapitulo,
                                                  label_inf = info.DesCcpConcepto,
                                                  label_nivel4 = info.DesCcpCuenta,
                                                  //rawValue = Convert.ToDecimal(info.VLR_EJECUTADO),
                                                  rawValueDouble = info.VlrEjecutado.Value,
                                                  value = (info.VlrEjecutado.Value).ToString()
                                          ***REMOVED***).ToList();
                foreach (var recursoPerObjetoQuery in RecursosPerObjetoQuery)
                    recursoPerObjetoQuery.rawValue = Convert.ToDecimal(recursoPerObjetoQuery.rawValueDouble);
                objReturn = RecursosPerObjetoQuery;
        ***REMOVED***

            return objReturn;
    ***REMOVED***

        public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerContratosGroup()
        {
            List<InfoRecursosEmergenciaPerObjeto> objReturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                var RecursosPerObjetoQuery = (from info in DataModel.VwDetalleContratacionArticulosEmergencias
                                              group info by new { info.UnidadCompra, info.Objeto, info.DescripcionSubclase ***REMOVED*** into g
                                              select new InfoRecursosEmergenciaPerObjeto
                                              {
                                                  labelGroup = g.Key.UnidadCompra,
                                                  label = g.Key.Objeto,
                                                  label_inf = g.Key.DescripcionSubclase,
                                                  rawValue = g.Sum(z => z.MontoTotal)
                                          ***REMOVED***).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf).ToList();

                objReturn = RecursosPerObjetoQuery;
        ***REMOVED***
            if (objReturn == null) objReturn = new();
            return objReturn;
    ***REMOVED***

        public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerContratosPorTipoEmergencia(int tipoEmergencia)
        {
            List<InfoRecursosEmergenciaPerObjeto> objReturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                var RecursosPerObjetoQuery = (from info in DataModel.VwDetalleContratacionArticulosEmergencias
                                              where info.Origen == tipoEmergencia
                                              group info by new { info.UnidadCompra, info.Objeto, info.DescripcionSubclase ***REMOVED*** into g
                                              select new InfoRecursosEmergenciaPerObjeto
                                              {
                                                  labelGroup = g.Key.UnidadCompra,
                                                  label = g.Key.Objeto,
                                                  label_inf = g.Key.DescripcionSubclase,
                                                  label_nivel4 = g.Key.DescripcionSubclase,
                                                  rawValue = g.Sum(z => z.MontoTotal),
                                                  rawValueDouble = (double)g.Sum(z => z.MontoTotal),
                                                  value = g.Sum(z => z.MontoTotal).ToString()
                                          ***REMOVED***).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf).ToList();
                objReturn = RecursosPerObjetoQuery;
        ***REMOVED***
            if (objReturn == null) objReturn = new();
            return objReturn;

    ***REMOVED***

        public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerProcesosGroup()
        {
            List<InfoRecursosEmergenciaPerObjeto> objReturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                var RecursosPerObjetoQuery = (from info in DataModel.VwDetalleProcesosArticulosEmergencias
                                              group info by new { info.UnidadCompra, info.ObjetoProceso, info.DescripcionSubclase ***REMOVED*** into g
                                              select new InfoRecursosEmergenciaPerObjeto
                                              {
                                                  labelGroup = g.Key.UnidadCompra,
                                                  label = g.Key.ObjetoProceso,
                                                  label_inf = g.Key.DescripcionSubclase,
                                                  rawValue = g.Sum(z => z.PrecioTotalEstimado.Value)
                                          ***REMOVED***).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf).ToList(); ;

                objReturn = RecursosPerObjetoQuery;
        ***REMOVED***
            return objReturn;
    ***REMOVED***

        public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerProcesosPorTipoEmergencia(int tipoEmergencia)
        {
            List<InfoRecursosEmergenciaPerObjeto> objReturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                var RecursosPerObjetoQuery = (from info in DataModel.VwDetalleProcesosArticulosEmergencias
                                              where info.Origen == tipoEmergencia
                                              group info by new { info.UnidadCompra, info.ObjetoProceso, info.DescripcionSubclase ***REMOVED*** into g
                                              select new InfoRecursosEmergenciaPerObjeto
                                              {
                                                  labelGroup = g.Key.UnidadCompra,
                                                  label = g.Key.ObjetoProceso,
                                                  label_inf = g.Key.DescripcionSubclase,
                                                  rawValue = g.Sum(z => z.PrecioTotalEstimado.Value)
                                          ***REMOVED***).OrderBy(x => x.labelGroup).ThenBy(n => n.label_inf).ToList();
                objReturn = RecursosPerObjetoQuery;
        ***REMOVED***
            return objReturn;
    ***REMOVED***

        private static string GenerarUrl(string nombreParametro, bool eliminarCaracteresEspeciales)
        {
            if (eliminarCaracteresEspeciales)
                return nombreParametro.Replace(" ", "00_00").Replace("/", "0_0").Replace("Á", "1_1").Replace("É", "2_2").Replace("Í", "3_3").Replace("Ó", "4_4").Replace("Ú", "5_5").Replace("á", "1_1").Replace("é", "2_2").Replace("í", "3_3").Replace("ó", "4_4").Replace("ú", "5_5");
            else return nombreParametro.Replace("00_00", " ").Replace("0_0", "/").Replace("1_1", "Á").Replace("2_2", "É").Replace("3_3", "Í").Replace("4_4", "Ó").Replace("5_5", "Ú").Replace("1_1", "á").Replace("2_2", "é").Replace("3_3", "í").Replace("4_4", "ó").Replace("5_5", "ú");
    ***REMOVED***

        public List<InfograficoFuentePrograma> ObtDistribucionPresupuestalPorTipoEmergencia(int? tipoEmergencia)
        {
            List<InfograficoFuentePrograma> objReturn = new List<InfograficoFuentePrograma>();

            var RecursosPerObjetoQuery = (from info in _connection.GastoXProgramasEmergencias  //.VwGastoXProgramasEmergenciaCovid
                                          where info.IdOrigen.HasValue && (info.IdOrigen.Value == tipoEmergencia || tipoEmergencia == null) && info.VlrGasto.HasValue && info.VlrGasto > 0
                                          orderby info.DesFuente, info.DesOrgFinanciador, info.NomProgramaAsistencia, info.NomCapitulo, info.DesCcpConcepto
                                        , info.DesCcpCuenta, info.VlrGasto descending
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
                                              AvanceProgramaxObjeto = (decimal)info.VlrGasto
                                      ***REMOVED***).ToList();

            InfograficoFuentePrograma objFuente = null;
            InfograficoOrganismo objOrganismo = null;
            InfoGraficoItemPrograma objItem = null;
            InfograficoCapitulo objCapitulo = null;
            InfograficoConcepto objConcepto = null;
            InfograficoCuentaGasto objGasto = null;

            foreach (var fila in RecursosPerObjetoQuery)
            {
                objFuente = objReturn.Find(p => p.Nombre == fila.NomFuente.ToUpper());
                if (objFuente == null)
                {
                    objFuente = new InfograficoFuentePrograma("", fila.NomFuente.ToUpper());
                    objFuente.presupuesto += 0;
                    objFuente.avance += (decimal)fila.AvanceProgramaxObjeto;
                    objOrganismo = objFuente.Detalles.Find(p => p.Nombre == fila.NomOrganismo.ToUpper());
                    if (objOrganismo == null)
                    {
                        objOrganismo = new InfograficoOrganismo("", fila.NomOrganismo.ToUpper());
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
                        objOrganismo = new InfograficoOrganismo("", fila.NomOrganismo.ToUpper());
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
***REMOVED***
***REMOVED***
