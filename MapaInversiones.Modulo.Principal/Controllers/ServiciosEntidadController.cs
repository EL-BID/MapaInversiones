using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Entidad;
using SolrNet;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  [Route("api/serviciosentidad")]
  public class ServiciosEntidadController : Controller
  {
    private readonly ILogger<ServiciosPlanController> _logger;
    private readonly TransparenciaDB _connection;
    private ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> _solr;
    private IEntidadBLL consolidadosEntidades;
        public ServiciosEntidadController(ILogger<ServiciosPlanController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.Proyectos.Proyecto> solr,IEntidadBLL entidadesbll)
    {
      _logger = logger;
      _connection = connection;
      _solr = solr;
      consolidadosEntidades = entidadesbll;

***REMOVED***


    [HttpGet("GetDatosEntidadPorAnnio")]
    public DatosEntidadAnio GetConsolidadoProgramasXCodEntidadAnio(string anio, string codEntidad)
    {
            DatosEntidadAnio objReturn = new DatosEntidadAnio();
      try {
        EntidadContract entidad = new EntidadContract(_connection);
        return entidad.GetDatosEntidadPorAnnio(anio, codEntidad);
  ***REMOVED***
      catch (Exception exception) {

  ***REMOVED***
      return objReturn;
***REMOVED***

        [HttpGet("GetProgramasByEntidad")]
        public ModelEntidadData GetProgramasByEntidad(int annio, int codEntidad)
        {
            ModelEntidadData objReturn = new ModelEntidadData();
            try
            {
                objReturn.infoProgramas = consolidadosEntidades.GetProgramasByEntidad(annio,codEntidad);
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

        [HttpGet("GetActividadesByPrograma")]
        public ModelEntidadData GetActividadesByPrograma(int annio, string codEntidad, int codPrograma)
        {
            ModelEntidadData objReturn = new ModelEntidadData();
            try
            {
                objReturn.infograficoActividad = consolidadosEntidades.GetActividadByPrograma(annio, codEntidad, codPrograma);
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

        [HttpGet("GetGastoByPrograma")]
        public ModelEntidadData GetGastoByPrograma(int annio, int codEntidad, int codPrograma,string estado, string proceso)
        {
            ModelEntidadData objReturn = new ModelEntidadData();
            try
            {
                objReturn.infograficoEntidad = consolidadosEntidades.GetGastoByPrograma(annio, codEntidad, codPrograma,estado,proceso);
                
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

        [HttpGet("GetRecursosPerGrupos")]
        public ModelPresupuestoData GetRecursosPerGrupos(int anyo, int codEntidad)
        {
            Double total = 0;
            List<InfoConsolidadoPresupuesto> info = new List<InfoConsolidadoPresupuesto>();
            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                info = consolidadosEntidades.ObtenerRecursosPerGrupos(anyo, codEntidad);
                if (info != null)
                {
                    foreach (InfoConsolidadoPresupuesto element in info)
                    {
                        total += element.rawValueDouble;
                ***REMOVED***
            ***REMOVED***

                objReturn.TotalPresupuesto = total;
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


***REMOVED***
***REMOVED***
