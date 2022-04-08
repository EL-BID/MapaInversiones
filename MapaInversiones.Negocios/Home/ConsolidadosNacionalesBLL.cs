using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
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
                  where info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim()
                  select new {
                    info.Mision,
                    info.Vision
              ***REMOVED***
                 ).ToList();
      if (data.Count > 0) {
        rta.Mision = data.First().Mision == null ? string.Empty : ConvertirTextoMayusculaMinuscula(data.First().Mision);
        rta.Vision = data.First().Vision == null ? string.Empty : ConvertirTextoMayusculaMinuscula(data.First().Vision);
  ***REMOVED***
      #region Genero el listado de otras entidades
      var otrasEntidades = (from info in _connection.CatalogoEntidades
                            where info.CodNivelEntidad.ToUpper().Trim() != codEntidad
                            select new InfoEntidad {
                              CodEntidad = info.CodNivelEntidad,
                              Nombre = info.NombreEntidad,
                        ***REMOVED***
                            ).Distinct().OrderBy(x => x.Nombre).ToList();
      rta.Entidades = new List<InfoEntidad>(otrasEntidades.Count > 6 ? otrasEntidades.OrderBy(x => x.Nombre).Take(6) : otrasEntidades.OrderBy(x => x.Nombre));
      #endregion
      return rta;
***REMOVED***




    public ConsolidadoProgramasEntidad GetConsolidadoProgramasXCodEntidadAnio(int anio, string codEntidad)
    {
      ConsolidadoProgramasEntidad objReturn = new ConsolidadoProgramasEntidad();

      var proyectos = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
                       where info.AnioPresupuesto == anio && info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim() //&& info.ClasePrograma.ToUpper().Trim() == "CENTRAL"
                       select new {
                         info.IdNegocioProyecto,
                         info.ClasePrograma
                   ***REMOVED***).Distinct().ToList();
      var varProyectosByClasePrograma = (from proyecto in proyectos
                                         group proyecto by new {
                                           proyecto.ClasePrograma
                                     ***REMOVED*** into proyectoAgrupado
                                         select new {
                                           proyectoAgrupado.Key.ClasePrograma,
                                           Total = proyectoAgrupado.Count()
                                     ***REMOVED***).ToList();

      var proyectosSustantivos = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
                                  where info.AnioPresupuesto == anio && info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim() && (info.ClasePrograma.ToUpper().Trim() == "SUSTANTIVO" || info.ClasePrograma.ToUpper().Trim() == "SUSTANTIVOS")
                                  select new {
                                    info.NombrePrograma
                              ***REMOVED***).Distinct().Count();
      var totalActividadesProgramaCentral = varProyectosByClasePrograma.Where(x => x.ClasePrograma.ToUpper() == "CENTRAL" || x.ClasePrograma.ToUpper() == "CENTRALES").FirstOrDefault();
      var totalProgramasSustantivos = varProyectosByClasePrograma.Where(x => x.ClasePrograma.ToUpper() == "SUSTANTIVOS" || x.ClasePrograma.ToUpper() == "SUSTANTIVO").FirstOrDefault();
      var totalActividadesNoAsignables = varProyectosByClasePrograma.Where(x => x.ClasePrograma.ToUpper() == "NO ASIGNABLE" || x.ClasePrograma.ToUpper() == "NO ASIGNABLES").FirstOrDefault();
      if (totalActividadesNoAsignables != null) objReturn.TotalActividadesProgramasNoAsignables = totalActividadesNoAsignables.Total;
      if (totalProgramasSustantivos != null) objReturn.TotalProgramasSustantivos = proyectosSustantivos;
      if (totalActividadesProgramaCentral != null) objReturn.TotalActividadesProgramaCentral = totalActividadesProgramaCentral.Total;

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

    public ModelGraficaSankey GetGraficaSankey(string codEntidad)
    {
      ModelGraficaSankey objReturn = new ModelGraficaSankey();
      return objReturn;
***REMOVED***

    public string ObtenerNombreEntidad(string codEntidad)
    {
      var entidadSeleccionada = (from info in _connection.CatalogoEntidades
                                 where info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim()
                                 select info).FirstOrDefault();

      return entidadSeleccionada == null ? string.Empty : entidadSeleccionada.NombreEntidad;
***REMOVED***

    public ModelHomeData ObtenerDatosModeloInicio(bool esHome = true)
    {
      ModelHomeData objReturn = new ModelHomeData();
      if (!esHome) {
        return objReturn;
  ***REMOVED***

      objReturn.Entidades = GetConsolidadoEntidades();


      objReturn.Status = true;

      return objReturn;
***REMOVED***


    /// <summary>
    /// Obtiene meta y avance Presupuesto Por Objetivo estratégico
    /// </summary>
    /// <param name="id">idObjEstrategico</param>
    /// <returns></returns>
    public List<InfoRecAsignadosPlan> GetRecursosAsigByObjEstrategico(int id)
    {

      //    var myData = [
      //    { labelGroup: "Desarrollo sostenible", label: "meta", periodo: 2019, meta: 1000, porcentaje: -1 ***REMOVED***,
      //    { labelGroup: "Desarrollo sostenible", label: "meta", periodo: 2020, meta: 5000 , porcentaje: -1***REMOVED***,
      //    { labelGroup: "Desarrollo sostenible", label: "meta", periodo: 2021, meta: 3800 ,  porcentaje: -1 ***REMOVED***,
      //    { labelGroup: "Desarrollo sostenible",label: "avance", periodo: 2019, meta: 800, porcentaje: 30 ***REMOVED***,
      //    { labelGroup: "Desarrollo sostenible", label: "avance" , periodo: 2020, meta: 3200 , porcentaje: 30 ***REMOVED***,
      //    { labelGroup: "Desarrollo sostenible", label: "avance" , periodo: 2021, meta: 3000 , porcentaje: 40 ***REMOVED***

      //];


      var objReturn = new List<InfoRecAsignadosPlan>();
      var result = (from info in _connection.PndXEntidadesPresupuestoStp
                    where info.CodObjetivoEstrategico == id
                    group info by new {
                      info.IdObjetivoEstrategico
                        , info.CodObjetivoEstrategico
                        , info.NombreObjetivoEstrategico
                        , info.DescripcionObjetivoEstrategico
                        , info.Año
                ***REMOVED*** into g
                    select new {
                      nombreObj = g.Key.NombreObjetivoEstrategico,
                      periodo = g.Key.Año.Value,
                      avance = Math.Round((g.Sum(x => x.Ejecutado)).Value / 1000000, 0),
                      meta = Math.Round((g.Sum(x => x.Planificado)).Value / 1000000, 0),
                      porcentaje = Math.Round((g.Sum(x => x.Ejecutado)).Value / (g.Sum(x => x.Planificado)).Value, 2)

                ***REMOVED***
     ).ToList();


      if (result.Count > 0) {
        var aux_meta = result
        .Select(step => new InfoRecAsignadosPlan {
          labelGroup = step.nombreObj,
          label = "META",
          rawValue = step.meta,
          periodo = step.periodo,
          porcentaje = -1
    ***REMOVED***).ToList();

        var aux_avance = result
       .Select(step => new InfoRecAsignadosPlan {
         labelGroup = step.nombreObj,
         label = "AVANCE",
         rawValue = step.avance,
         periodo = step.periodo,
         porcentaje = step.porcentaje,
   ***REMOVED***).ToList();

        objReturn.AddRange(aux_meta);
        objReturn.AddRange(aux_avance);

  ***REMOVED***



      return objReturn;


***REMOVED***

    /// <summary>
    /// valor planificado-ejecutado agrupado por sectores
    /// </summary>
    /// <param name="id">CodObjetivoEstrategico</param>
    /// <returns></returns>
    public List<InformationGraphics> GetRecursosAsigPerSectoresByObjEstrateg(int id)
    {
      var objReturn = new List<InformationGraphics>();

      var result = (from info in _connection.PndXEntidadesPresupuestoStp
                    where info.CodObjetivoEstrategico == id
                    group info by new {
                      info.Sector
                ***REMOVED*** into g
                    select new {
                      sector = g.Key.Sector,
                      meta = (g.Sum(x => x.Planificado)).Value / 1000000,
                      avance = (g.Sum(x => x.Ejecutado)).Value / 1000000

                ***REMOVED***
     ).ToList();


      if (result.Count > 0) {
        var aux_meta = result
        .Select(step => new InfoRecAsignadosPlan {
          labelGroup = "META",
          label = step.sector,
          rawValue = step.meta

    ***REMOVED***).ToList();

        var aux_avance = result
       .Select(step => new InfoRecAsignadosPlan {
         labelGroup = "AVANCE",
         label = step.sector,
         rawValue = step.avance
   ***REMOVED***).ToList();

        objReturn.AddRange(aux_meta);
        objReturn.AddRange(aux_avance);

  ***REMOVED***

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
      var result = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
                    group info by new {
                      info.CodNivelEntidad,
                      info.NombreEntidad
                ***REMOVED*** into g
                    select new InfoEntidadesConsolida {
                      id = g.Key.CodNivelEntidad,
                      labelGroup = g.Key.NombreEntidad,
                      avance = g.Sum(x => x.PresupuestoAvance.Value),
                      asignado = ((decimal)g.Sum(x => x.PresupuestoVigente.Value))
                ***REMOVED***
     ).ToList();

      if (result != null) {
        var long_aux = result.Count();
        for (var i = 0; i < long_aux; i++) {
          result[i].porcentaje = Math.Round(((decimal)(result[i].avance / result[i].asignado) * 100), 2);
    ***REMOVED***

        if (long_aux >= 4) {
          objReturn = result.OrderByDescending(x => x.porcentaje).Take(4).ToList();
    ***REMOVED***
        else {
          objReturn = result.OrderByDescending(x => x.porcentaje).Take(long_aux).ToList();
    ***REMOVED***


  ***REMOVED***



      return objReturn;


***REMOVED***

    /// <summary>
    /// Obtiene entidades que aportan a un objetivo estrategico especifico
    /// </summary>
    /// <param name="id">cod obj estrategico</param>
    /// <returns></returns>
    public List<InfoEntidadesConsolida> GetConsolidadoEntidadesByObjEspecifico(int id_eje, int id)
    {
      var objReturn = new List<InfoEntidadesConsolida>();
      var result = (from info in _connection.ConsultaVinculacionPNDPresupuestoXEntidadStp
                    where info.CodEjeEstrategico == id_eje && info.CodObjetivoEspecifico == id
                    && info.Entidad != null && info.Entidad != ""
                    group info by new {
                      //info.IdEntidad,
                      info.Entidad
                ***REMOVED*** into g
                    select new InfoEntidadesConsolida {
                      //id=g.Key.IdEntidad,
                      labelGroup = g.Key.Entidad,
                      aporteObjetivo = g.Sum(x => x.AportePresupuestalAlObjetivo.Value)
                ***REMOVED***
      ).ToList();

      var long_aux = result.Count();
      //if (long_aux >= 4) {
      //    objReturn = result.OrderByDescending(x => x.aporteObjetivo).Take(4).ToList();
      //***REMOVED***
      //else {
      //    objReturn = result.OrderByDescending(x => x.aporteObjetivo).Take(long_aux).ToList();
      //***REMOVED***
      objReturn = result.OrderByDescending(x => x.aporteObjetivo).Take(long_aux).ToList();

      return objReturn;


***REMOVED***


    /// <summary>
    /// Datos treemap presupuestado plan nacional
    /// </summary>
    /// <returns></returns>
    public List<InfoRecAsignadosPlan> ObtenerRecursosPerPlanGroup()
    {


      //Vinculacion_IndicadoresPND_Presupuesto_x_Entidades_STP
      List<InfoRecAsignadosPlan> objReturn = new List<InfoRecAsignadosPlan>();
      var RecursosPerObjetoQuery = (from info in _connection.ConsultaVinculacionPNDPresupuestoXEntidadStp
                                    where info.CodEjeEstrategico != null && info.CodObjetivoEstrategico > 0 && info.CodObjetivoEspecifico > 0
                                    && info.CodNivelEntidad.Trim() != "-"
                                    orderby info.CodEjeEstrategico.Value, info.CodObjetivoEstrategico.Value
                                    , info.CodObjetivoEspecifico.Value, info.Entidad ascending
                                    select new InfoRecAsignadosPlan {
                                      labelGroup = info.CodEjeEstrategico.Value.ToString() + "-" + info.NombreEjeEstrategico,
                                      label = info.NombreObjetivoEstrategico,
                                      label_inf = info.NombreObjetivoEspecifico,
                                      label_nivel4 = info.Entidad,
                                      rawValueDouble = info.AportePresupuestalAlObjetivo.HasValue ? info.AportePresupuestalAlObjetivo.Value : 0,
                                      rawValue_asoc = info.CodEjeEstrategico.Value
                                ***REMOVED***).ToList();

      objReturn = RecursosPerObjetoQuery;


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

    public List<ModelAvanceIndicador> GetHistoricoAvanceIndicador(int indicadorId)
    {
      //var objReturn = new List<ModelAvanceIndicador>();
      //objReturn.Add(new ModelAvanceIndicador { label = "2012", rawValueDouble  = 57.7, labelGroup="Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2013", rawValueDouble = 57.7, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2014", rawValueDouble = 57.6, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2015", rawValueDouble = 63.5, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2016", rawValueDouble = 67.0, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2017", rawValueDouble = 70.4, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2018", rawValueDouble = 67.8, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2019", rawValueDouble = 65.8, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2020", rawValueDouble = 55.0, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2021", rawValueDouble = 0.0, labelGroup = "Avance" ***REMOVED***);
      //objReturn.Add(new ModelAvanceIndicador { label = "2022", rawValueDouble = 0.0, labelGroup = "Avance" ***REMOVED***);
      var objReturn = (from info in _connection.HistoricoAvanceIndicadoresPNDStps
                    where info.IdIndicador.HasValue && info.IdIndicador.Value == indicadorId
                    && !string.IsNullOrEmpty(info.ValorAvance)
                    select new ModelAvanceIndicador {
                      label = info.AnioAvance,
                      rawValueDouble = Convert.ToDouble(info.ValorAvance),
                      labelGroup="Avance"
                ***REMOVED***).Distinct().ToList();
      for (int i = 0; i < objReturn.Count; i++) {
        if (objReturn[i].rawValueDouble <= 0.0) {
          objReturn.RemoveAt(i);
          i--;
    ***REMOVED***
  ***REMOVED***
      return objReturn;
***REMOVED***
  ***REMOVED***
***REMOVED***
