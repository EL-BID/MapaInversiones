using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios.Interfaces;
using PlataformaTransparencia.Negocios.Presupuesto;
using SolrNet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  [Route("api/ServiciosPresupuestoNew")]
  public class ServiciosPresupuestoController : Controller
  {
    private readonly ILogger<ServiciosPresupuestoController> _logger;
    private readonly TransparenciaDB _connection;
    private ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> _solr;
    private IPresupuestoBLL consolidadoPresupuesto;


    public ServiciosPresupuestoController(ILogger<ServiciosPresupuestoController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> solr, IPresupuestoBLL presupuestoNewBLL)
    {
      _logger = logger;
      _connection = connection;
      _solr = solr;
      consolidadoPresupuesto = presupuestoNewBLL;
***REMOVED***

    [HttpGet("GetRecursosPerNivel")]
    public ModelPresupuestoData GetRecursosPerNivel(int anyo)
    {
      Double total_aprobado = 0;
      Double total_vigente = 0;
      Double total_ejecutado = 0;
      List<itemNiveles> objGrupo = new List<itemNiveles>();
      int total_entidades = 0;


      List<InfoConsolidadoPresupuesto> info = new List<InfoConsolidadoPresupuesto>();
      ModelPresupuestoData objReturn = new ModelPresupuestoData();
      try
      {
        info = consolidadoPresupuesto.ObtenerRecursosPerNivel(anyo);
        if (info != null)
        {
          total_vigente = info.Sum(item => item.vigente);
          total_aprobado = info.Sum(item => item.aprobado);
          total_ejecutado = info.Sum(item => item.ejecutado);

          objGrupo = (from t in info
                      group t by new { t.labelGroup ***REMOVED***
                 into grp
                      select new itemNiveles
                      {
                        labelGroup = grp.Key.labelGroup,
                        cantidad = grp.Count()
                  ***REMOVED***).ToList();

          total_entidades = (from t in info
                             group t by new { t.label ***REMOVED***
                 ).ToList().Count();

          objReturn.ConsolidadoNiveles = objGrupo;
          objReturn.totalCantidades = total_entidades;


    ***REMOVED***

        objReturn.TotalPresupuesto = total_vigente;
        objReturn.TotalAprobado = total_aprobado;
        objReturn.TotalEjecutado = total_ejecutado;
        objReturn.InfoRecursos = info;
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
  ***REMOVED***
***REMOVED***


    [HttpGet("GetRecursosPerOrganismo")]
    public ModelPresupuestoData GetRecursosPerOrganismo(int anyo)
    {
      Double total = 0;
      ModelPresupuestoData objReturn = new ModelPresupuestoData();
      try
      {
        objReturn.InfoRecursos = consolidadoPresupuesto.ObtenerRecursosPerOrganismo(anyo);
        objReturn.TotalPresupuesto = total;
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
  ***REMOVED***
***REMOVED***

    [HttpGet("GetConsolidadoPeriodos")]
    public ModelPresupuestoData GetConsolidadoPeriodos(int anyo)
    {
      Double total = 0;
      ModelPresupuestoData objReturn = new ModelPresupuestoData();
      try
      {
        objReturn.InfoConsolidado = consolidadoPresupuesto.GetConsolidadoPeriodos(anyo);
        objReturn.TotalPresupuesto = total;
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
  ***REMOVED***
***REMOVED***

    [HttpGet("ObtenerInfoPerGrupoDeGasto")]
    public ModelPresupuestoData ObtenerInfoPerGrupoDeGasto(string filtro_periodos, int anyo, string filtro_gasto)
    {
      List<int> filtro_aux = new List<int>();
      List<String> filtro_aux_gasto = new List<String>();
      ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
      try
      {
        if (filtro_periodos != null && filtro_periodos != "")
        {
          int mos = 0;
          var intList = filtro_periodos.Split(',')
          .Select(m => { int.TryParse(m, out mos); return mos; ***REMOVED***)
          .Where(m => m != 0)
          .ToList();
          filtro_aux = intList;
    ***REMOVED***
        else
        {
          filtro_aux.Add(anyo);
    ***REMOVED***

        if (filtro_gasto != null && filtro_gasto != "")
        {
          var cadList = filtro_gasto.Split(',')
         .Select(m => { return m; ***REMOVED***)
         .Where(m => m != "")
         .Distinct().ToList();
          filtro_aux_gasto = cadList;
    ***REMOVED***

        Presupuesto.InfoRecursos = consolidadoPresupuesto.ObtenerInfoPerGrupoDeGasto(filtro_aux, anyo, filtro_aux_gasto);
        Presupuesto.Status = true;
        return Presupuesto;
  ***REMOVED***
      catch (Exception exception)
      {
        Presupuesto.Status = false;
        Presupuesto.Message = "Error: " + exception.Message;
        Presupuesto = null;
        return Presupuesto;
  ***REMOVED***
***REMOVED***


    [HttpGet("GetEntidadesPlanNacional")]
    public List<InfoEntidad> GetEntidadesPlanNacional()
    {
      List<InfoEntidad> objReturn = new List<InfoEntidad>();
      try
      {
        objReturn = consolidadoPresupuesto.ObtenerEntidadesPlanNacional();
        return objReturn;
  ***REMOVED***
      catch (Exception)
      {
        return objReturn;
  ***REMOVED***
***REMOVED***

    [HttpGet("GetEntidadesPlanNacionalNoAlcaldias")]
    public List<InfoEntidad> GetEntidadesPlanNacionalNoAlcaldias()
    {
      List<InfoEntidad> objReturn = new List<InfoEntidad>();
      try
      {
        objReturn = consolidadoPresupuesto.ObtenerEntidadesPlanNacionalNoAlcaldias();
        return objReturn;
  ***REMOVED***
      catch (Exception)
      {
        return objReturn;
  ***REMOVED***
***REMOVED***

    [HttpGet("GetInfograficoGasto")]
    public ModelPresupuestoData GetInfograficoGasto(int annio)
    {
      ModelPresupuestoData objReturn = new ModelPresupuestoData();
      try
      {
        objReturn.InfograficoPerGasto = consolidadoPresupuesto.GetInfograficoPerGasto(annio);
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
  ***REMOVED***
***REMOVED***


    [HttpGet("GetInfograficoPerEntidad")]
    public ModelPresupuestoData GetInfograficoPerEntidad(int annio)
    {
      ModelPresupuestoData objReturn = new ModelPresupuestoData();
      try
      {
        objReturn.InfograficoPerGasto = consolidadoPresupuesto.GetInfograficoPerEntidad(annio);
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
  ***REMOVED***
***REMOVED***


    [HttpGet("getVersionesPerAnyo")]
    public ModelPresupuestoData getVersionesPerAnyo(int anyo)
    {
      ModelPresupuestoData objReturn = new ModelPresupuestoData();
      try
      {
        objReturn.versiones = (from pre in _connection.VwPresupuestoVersiones
                               where pre.AnioPresupuesto == anyo
                               orderby pre.NombreVersion descending
                               select new itemVersiones
                               {
                                 CodigoVersion = pre.CodigoVersion,
                                 NombreVersion = pre.NombreVersion
                           ***REMOVED***).Distinct().ToList();
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
  ***REMOVED***

***REMOVED***



    [HttpGet("GetComparativePerVersiones")]
    public ModelPresupuestoData GetComparativePerVersiones(string filtro, int anyo)
    {
      List<int> filtro_aux = new List<int>();
      ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
      try
      {
        if (filtro != null && filtro != "")
        {
          int mos = 0;
          var intList = filtro.Split(',')
          .Select(m => { int.TryParse(m, out mos); return mos; ***REMOVED***)
          .Where(m => m != 0)
          .ToList();
          filtro_aux = intList;
    ***REMOVED***
        else
        {
          filtro_aux.Add(anyo);
    ***REMOVED***

        Presupuesto.InfoGrafica = consolidadoPresupuesto.GetComparativePerVersiones(filtro_aux, anyo);
        Presupuesto.Status = true;
        return Presupuesto;
  ***REMOVED***
      catch (Exception exception)
      {
        Presupuesto.Status = false;
        Presupuesto.Message = "Error: " + exception.Message;
        Presupuesto = null;
        return Presupuesto;
  ***REMOVED***
***REMOVED***

    [HttpGet("ObtenerInfoPerFuncionesGob")]
    public ModelPresupuestoData ObtenerInfoPerFuncionesGob(string filtro_periodos, int anyo, string filtro_func)
    {
      List<int> filtro_aux = new List<int>();
      List<string> filtro_aux_func = new List<string>();
      ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
      try
      {
        if (filtro_periodos != null && filtro_periodos != "")
        {
          int mos = 0;
          var intList = filtro_periodos.Split(',')
          .Select(m => { int.TryParse(m, out mos); return mos; ***REMOVED***)
          .Where(m => m != 0)
          .ToList();
          filtro_aux = intList;
    ***REMOVED***
        else
        {
          filtro_aux.Add(anyo);
    ***REMOVED***

        if (filtro_func != null && filtro_func != "")
        {
          var cadList = filtro_func.Split(',')
         .Select(m => { return m; ***REMOVED***)
         .Where(m => m != "")
         .Distinct().ToList();
          filtro_aux_func = cadList;
    ***REMOVED***


        Presupuesto.InfoRecursos = consolidadoPresupuesto.ObtenerInfoPerFuncionesGob(filtro_aux, anyo, filtro_aux_func);
        Presupuesto.Status = true;
        return Presupuesto;
  ***REMOVED***
      catch (Exception exception)
      {
        Presupuesto.Status = false;
        Presupuesto.Message = "Error: " + exception.Message;
        Presupuesto = null;
        return Presupuesto;
  ***REMOVED***
***REMOVED***


    [HttpGet("ObtenerFuncionesPerNombre")]
    public ModelPresupuestoData ObtenerFuncionesPerNombre(string filtro, int anyo)
    {
      ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
      try
      {
        Presupuesto.funciones = consolidadoPresupuesto.ObtenerFuncionesPerNombre(filtro, anyo);
        Presupuesto.Status = true;
        return Presupuesto;
  ***REMOVED***
      catch (Exception exception)
      {
        Presupuesto.Status = false;
        Presupuesto.Message = "Error: " + exception.Message;
        Presupuesto = null;
        return Presupuesto;
  ***REMOVED***
***REMOVED***

    [HttpGet("ObtenerGrupoGastoPerNombre")]
    public ModelPresupuestoData ObtenerGrupoGastoPerNombre(int anyo)
    {
      ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
      try
      {
        Presupuesto.gruposGasto = consolidadoPresupuesto.ObtenerGrupoGastoPerNombre(anyo);
        Presupuesto.Status = true;
        return Presupuesto;
  ***REMOVED***
      catch (Exception exception)
      {
        Presupuesto.Status = false;
        Presupuesto.Message = "Error: " + exception.Message;
        Presupuesto = null;
        return Presupuesto;
  ***REMOVED***
***REMOVED***


  ***REMOVED***
***REMOVED***
