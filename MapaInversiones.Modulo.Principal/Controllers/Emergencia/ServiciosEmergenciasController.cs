using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios.Interfaces;
using System;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Emergencia
{
  [ApiController]
  [Route("api/[controller]")]
  public class ServiciosEmergenciasController : Controller
  {
    private readonly ILogger<ServiciosEmergenciasController> _logger;
    private readonly TransparenciaDB _connection;
    private readonly IEmergenciaBLL _cargaemergencia;
    private readonly IPresupuestoEmergenciaBLL _cargapresupuestoemergencia;
    public ServiciosEmergenciasController(ILogger<ServiciosEmergenciasController> logger, TransparenciaDB connection, IEmergenciaBLL cargaemergencia, IPresupuestoEmergenciaBLL cargapresupuestoemergencia)
    {
      _logger = logger;
      _connection = connection;
      _cargaemergencia = cargaemergencia;
      _cargapresupuestoemergencia = cargapresupuestoemergencia;

***REMOVED***

    [HttpGet("GetInformacionContratosEmergenciaPorFiltros")]
    public ModelContratosData GetInformacionContratosEmergenciaPorFiltros(int NumeroPagina, int RegistrosPorPagina, string NombreEntidad, string NombreProceso, string Estado, int? TipoEmergencia)
    {

      ModelContratosData objReturn = new();
      ContratosFiltros filtros = new ContratosFiltros
      {
        Estado = Estado,
        NombreEntidad = NombreEntidad,
        NombreProceso = NombreProceso,
        NumeroPagina = NumeroPagina,
        RegistrosPorPagina = RegistrosPorPagina,
        OrigenInformacion = TipoEmergencia.ToString()
  ***REMOVED***;

      try
      {
        var valores = _cargaemergencia.ObtenerInformacionContratosEmergeciasPorFiltros(filtros);
        objReturn = valores;
        objReturn.Status = true;
        return objReturn;
  ***REMOVED***
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.InnerException;
        return objReturn;
  ***REMOVED***
***REMOVED***


        [HttpGet("GetEntidadContratosEmergenciaPorNombre")]
        public ModelNombreEntidad GetEntidadContratosEmergenciaPorNombre(string NombreEntidad, int? TipoEmergencia)
        {
            ContratosFiltros filtros = new ContratosFiltros
            {
                
                NombreEntidad = NombreEntidad,
                OrigenInformacion = TipoEmergencia.ToString()
        ***REMOVED***;


            ModelNombreEntidad objReturn = new ModelNombreEntidad();
            try
            {
                var valores = _cargaemergencia.ObtenerEntidadGestionContratosPorNombre(filtros);
                objReturn.Nombre = valores;
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


        [HttpGet("GetInformacionProcesosCanceladosEmergenciaPorFiltros")]
        public ModelInformacionContratos GetInformacionProcesosCanceladosEmergenciaPorFiltros(int NumeroPagina, int RegistrosPorPagina, string NombreEntidad, string NombreProceso, int? TipoEmergencia)
        {
           
            ContratosFiltros filtros = new ContratosFiltros
            {
            
                NombreEntidad = NombreEntidad,
                NombreProceso = NombreProceso,
                NumeroPagina = NumeroPagina,
                RegistrosPorPagina = RegistrosPorPagina,
                OrigenInformacion = TipoEmergencia.ToString()
        ***REMOVED***;
            ModelInformacionContratos objReturn = new ModelInformacionContratos();
            try
            {
                var valores = _cargaemergencia.ObtenerInformacionProcesosCanceladosEmergenciaPorFiltros(filtros);
                objReturn = valores;
                objReturn.Status = true;
                return objReturn;
        ***REMOVED***
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.InnerException;
                return objReturn;
        ***REMOVED***
    ***REMOVED***


        [HttpGet("ObtDistribucionPresupuestalGeneralPorTipoEmergencia")]
        public ModelCovidFuentesData ObtDistribucionPresupuestalGeneralPorTipoEmergencia()
        {
            ModelCovidFuentesData objReturn = new ModelCovidFuentesData();
            try
            {
                objReturn.distribucionItem = _cargapresupuestoemergencia.ObtDistribucionPresupuestalPorTipoEmergencia(null);
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


       
        [HttpGet("GetConsolidadoPresuAsignadoPorEntidadAnio")]
        public List<InfoGraficoItemPrograma> GetConsolidadoPresuAsignadoPorEntidadAnio()
        {
            List<InfoGraficoItemPrograma> objReturn = new List<InfoGraficoItemPrograma>();
            try
            {
                objReturn = _cargapresupuestoemergencia.ObtenerPresupuestoGeneralAsignadoPorEntidad();//anio
                return objReturn;
        ***REMOVED***
            catch (Exception)
            {
                return objReturn;
        ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED***
