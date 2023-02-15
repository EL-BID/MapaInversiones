using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Home;
using SolrNet;
using SolrNet.Commands.Parameters;

namespace PlataformaTransparencia.Negocios.Home
{
  public class ConsolidadosNacionalesBLL : IConsolidadosNacionalesBLL
  {
    /// <summary>
    /// Capa de negocio para funciones Home - Page principal
    /// </summary>

    private readonly TransparenciaDB _connection;

    public ConsolidadosNacionalesBLL(TransparenciaDB connection)
    {
      _connection = connection;
***REMOVED***

    public List<RelacionEmisiorReceptor> ObtenerRelacionEntidadObjetivos(string codEntidad)
    {
      var objReturn = new List<RelacionEmisiorReceptor>();
      return objReturn;
***REMOVED***

    public ModelEntidadData ObtenerDatosEntidad(string codEntidad, string nombreEntidad, int anio)
    {
      ModelEntidadData rta = new ModelEntidadData() { CodigoEntidad = codEntidad, NombreEntidad = nombreEntidad, ProyectosHaciendaCentral = new List<ProyectosPerfilEntidad>(), ProyectosHaciendaNoAsignable = new List<ProyectosPerfilEntidad>(), ProyectosHaciendaSustantivo = new List<ProyectosProgramas>(), RelacionEntidadObjetivos = new List<RelacionEmisiorReceptor>() ***REMOVED***;
      var data = (from info in _connection.CatalogoEntidades
                  where info.CodigoInstitucion.ToUpper().Trim() == codEntidad.ToUpper().Trim()
                  select new {
                    info.Mision,
                    info.Vision,
                    info.UrlParticipacionCiudadana
              ***REMOVED***
                 ).ToList();
      if (data.Count > 0) {
        rta.Mision = data.First().Mision == null ? string.Empty : ConvertirTextoMayusculaMinuscula(data.First().Mision);
                rta.Vision = data.First().Vision == null ? string.Empty : ConvertirTextoMayusculaMinuscula(data.First().Vision);
                rta.UrlParticipacionCiudadana = data.First().UrlParticipacionCiudadana == null ? string.Empty : data.First().UrlParticipacionCiudadana;
        ***REMOVED***
            #region Genero el listado de otras entidades
            var otrasEntidades = (from info in _connection.CatalogoEntidades
                                  where info.CodigoInstitucion.ToUpper().Trim() != codEntidad && info.Institucion != null && !info.Institucion.ToUpper().Contains("ALCALD")
                            select new InfoEntidad {
                              CodEntidad = info.CodigoInstitucion,
                              Nombre = info.Institucion,
                        ***REMOVED***
                            ).Distinct().OrderBy(x => x.Nombre).ToList();
      rta.Entidades = new List<InfoEntidad>(otrasEntidades.Count > 6 ? otrasEntidades.OrderBy(x => x.Nombre).Take(6) : otrasEntidades.OrderBy(x => x.Nombre));
            #endregion
            return rta;
***REMOVED***

        public DatosEntidadAnio GetDatosEntidadPorAnnio(int anio, string codEntidad)
        {
            DatosEntidadAnio objReturn = new DatosEntidadAnio();

             var presupuesto = (from info in _connection.VwPresupuesto
                           where info.Periodo == anio && info.CodigoInstitucion.ToString() == codEntidad
                           group info by new
                           {
                               info.CodigoInstitucion,
                               info.Institucion,
                               info.Periodo
                       ***REMOVED*** into g
                           select new DatosEntidadAnio
                           {
                               PresupuestoInicial = ((decimal)g.Sum(x => x.Aprobado.Value)),
                               PresupuestoVigente = ((decimal)g.Sum(x => x.Vigente.Value)),
                               PresupuestoEjecutado = ((decimal)g.Sum(x => x.EjecutadoAcumuladoAlMes.Value))

                       ***REMOVED***
            ).ToList();


            objReturn.DataContratos = (from info in _connection.VwContratosDetalles
                                  where info.AnioUltimaActualizacion == anio
                                  && info.CodigoComprador == codEntidad
                                   && info.ValorContratado != null
                                  group info by new
                                  {
                                      info.CodigoComprador,
                                      info.Comprador,
                                      info.AnioUltimaActualizacion,
                                      info.MonedaContrato,
                                      info.OrigenInformacion
                              ***REMOVED*** into g
                                  select new ContratistaData
                                  {
                                      MonedaContrato=g.Key.MonedaContrato=="HNL"?"L": g.Key.MonedaContrato,
                                      NumContratos = g.Count(),
                                      ValorTotalContratos = ((double)g.Sum(x => x.ValorContratado.Value)),
                                      OrigenInformacion=g.Key.OrigenInformacion

                              ***REMOVED***
                                ).ToList();

                       if (presupuesto.Count > 0) 
            {   objReturn.PresupuestoInicial = presupuesto[0].PresupuestoInicial;
                objReturn.PresupuestoVigente = presupuesto[0].PresupuestoVigente;
                objReturn.PresupuestoEjecutado = presupuesto[0].PresupuestoEjecutado;
        ***REMOVED***

            return objReturn;
    ***REMOVED***




    private string ConvertirTextoMayusculaMinuscula(string texto)
    {
      if (texto == string.Empty) return string.Empty;
      texto = texto.ToLower();
      var primeraLetra = texto.Substring(0, 1);
      texto = texto.Remove(0, 1);
      texto = primeraLetra.ToUpper() + texto;
      return texto;
***REMOVED***


    public string ObtenerNombreEntidad(string codEntidad)
    {
      var entidadSeleccionada = (from info in _connection.CatalogoEntidades
                                 where info.CodigoInstitucion.ToUpper().Trim() == codEntidad.ToUpper().Trim()
                                 select info).FirstOrDefault();

      return entidadSeleccionada == null ? string.Empty : entidadSeleccionada.Institucion;
***REMOVED***

    public  List<ContratosConsolidado>  ObtenerOrigenContratos(string? moneda, string? entidad, string? comprador) {
            List<ContratosConsolidado> modelo = new List<ContratosConsolidado>();

            modelo = (from contr in _connection.VwContratosDetalles
                      where (contr.MonedaContrato == moneda|| moneda == null)
                    && (contr.OrigenInformacion.Contains(entidad) || entidad == null)
                    && (contr.CodigoComprador == comprador || comprador == null)
                    && contr.ValorContratado != null
                      group contr by new { contr.OrigenInformacion ***REMOVED*** into datos
                    select new ContratosConsolidado
                    {
                        OrigenInformacion = datos.Key.OrigenInformacion

                ***REMOVED***).Distinct().ToList();

            return modelo;
***REMOVED***

    public ModelHomeData ObtenerDatosModeloInicio(bool esHome = true)
    {
      ModelHomeData objReturn = new ModelHomeData();
      if (!esHome) {
        return objReturn;
  ***REMOVED***
            object moneda = "";
            moneda = DBNull.Value;
            int? maxyear = null;
            maxyear = (from contr in _connection.VwContratosConsolidados
                       where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                              && contr.ValorContratado != null
                       orderby contr.Anio descending
                       select contr.Anio).First();

           int maxyear_entidades = _connection.VwPresupuesto.Max(x => x.Periodo.Value);
      
      objReturn.MaxAnnioContratos = maxyear.ToString();
      objReturn.Entidades = GetConsolidadoEntidades();
      objReturn.MaxAnnioEntidades = maxyear_entidades.ToString();
      objReturn.Consolidados = GetConsolidadoContratos();

      objReturn.Status = true;

      return objReturn;
***REMOVED***

    /// <summary>
    /// 
    /// </summary>
    /// <param></param>
    /// <returns></returns>
    public List<InfoEntidadesConsolida> GetConsolidadoEntidades()
    {
      //Presupuesto_Vigente_x_Sector_MinHacienda
      var objReturn = new List<InfoEntidadesConsolida>();

        int maxyear = DateTime.Now.Year;
            maxyear = _connection.VwPresupuesto.Max(x => x.Periodo.Value);


            var result = (from info in _connection.VwPresupuesto
                          where info.Periodo==maxyear
                    group info by new {
                      info.CodigoInstitucion,
                      info.Institucion
                ***REMOVED*** into g
                    select new InfoEntidadesConsolida {
                      id = g.Key.CodigoInstitucion.ToString(),
                      labelGroup = g.Key.Institucion,
                      avance = ((decimal)g.Sum(x => x.EjecucionDelMes.Value)),
                      asignado = ((decimal)g.Sum(x => x.Vigente.Value))
                ***REMOVED***
     ).ToList();

      if (result != null) {
        var long_aux = result.Count();
                for (var i = 0; i < long_aux; i++)
                {
                    if (result[i].asignado > 0)
                    {
                        result[i].porcentaje = Math.Round(((decimal)(result[i].avance / result[i].asignado) * 100), 2);
                ***REMOVED***
                   
                    
            ***REMOVED***

                if (long_aux >= 4) {
          objReturn = result.OrderByDescending(x => x.avance).Take(4).ToList();
    ***REMOVED***
        else {
          objReturn = result.OrderByDescending(x => x.avance).Take(long_aux).ToList();
    ***REMOVED***


  ***REMOVED***

      return objReturn;


***REMOVED***

    public List<ContratosConsolidado> GetConsolidadoContratos()
    {
            //ModelContratosConsolidados modelo = new ModelContratosConsolidados();
            var modelocontrato = new List<ContratosConsolidado>();

            object moneda = "";
            moneda = DBNull.Value; 

            int? maxyear = null;
            maxyear = (from contr in _connection.VwContratosConsolidados
                       where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                              && contr.ValorContratado != null
                       orderby contr.Anio descending
                       select contr.Anio).First();
            modelocontrato = (from contr in _connection.VwContratosConsolidados
                                   where (contr.MonedaContrato == moneda.ToString() || moneda == DBNull.Value)
                                   && contr.ValorContratado != null
                                   && contr.Anio == maxyear
                                   orderby contr.Anio descending
                                   group contr by new { contr.MonedaContrato, contr.OrigenInformacion ***REMOVED*** into datos
                                   select new ContratosConsolidado
                                   {
                                       OrigenInformacion = datos.Key.OrigenInformacion,
                                       MonedaContrato = datos.Key.MonedaContrato=="HNL"? "L": datos.Key.MonedaContrato,
                                       ValorContratado = datos.Sum(x => x.ValorContratado),
                                       NroContratos = datos.Sum(x => x.NroContratos),
                               ***REMOVED***).Distinct().ToList();

            return modelocontrato;
 ***REMOVED***

    public List<InformationSource> ObtFuenteDatos()
    {
        List<InformationSource> objReturn = new List<InformationSource>();
            var queryInfo = (from info in _connection.VwFuenteDeLosRescursos
                             where (info.IdFuente == 1 || info.IdFuente == 2 || info.IdFuente == 3)
                             group info by new
                             {
                                 info.IdFuente,
                                 info.NombreFuente
                         ***REMOVED*** into g
                             select new InformationSource
                             {
                                 id = g.Key.IdFuente,
                                 data=g.Key.NombreFuente,
                                 FechaCorteData = g.Max(i => i.FechaCorteInformacion),
                                 lastUpdate = g.Max(i => i.FechaActualizacionPlataforma)
                         ***REMOVED***).ToList();

            objReturn = queryInfo;

            return objReturn;

***REMOVED***



        public List<HierarchyModel> GetSearchHierarchyModel()
    {
      var objResultParamList = (from p in _connection.SearchResultParams
                                select new SearchResultParamModel {
                                  Hierarchy = p.Hierarchy,
                                  Type = p.Type,
                                  Id = p.Id,
                                  Url = p.Url,
                                  Param = p.Param
                            ***REMOVED***).ToList();

      var objReturn = new List<HierarchyModel>();

      foreach (var item in objResultParamList) {
        if (!objReturn.Exists(x => x.Hierarchy.Equals(item.Hierarchy))) {
          objReturn.Add(new HierarchyModel { Hierarchy = item.Hierarchy, ListaTipos = (from p in objResultParamList where p.Hierarchy.Equals(item.Hierarchy) select new TypeModel { Type = p.Type ***REMOVED***).ToList() ***REMOVED***);
    ***REMOVED***
  ***REMOVED***

      return objReturn;
***REMOVED***


  ***REMOVED***
***REMOVED***
