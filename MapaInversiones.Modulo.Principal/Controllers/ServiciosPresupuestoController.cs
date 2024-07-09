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
    }

    [HttpGet("GetConsolidadoPeriodos")]
    public ModelPresupuestoData GetConsolidadoPeriodos(int anyo)
    {
      Decimal total = 0;
      ModelPresupuestoData objReturn = new ModelPresupuestoData();
      try
      {
        objReturn.InfoConsolidado = consolidadoPresupuesto.GetConsolidadoPeriodos(anyo);
        objReturn.TotalPresupuesto = total;
        objReturn.Status = true;
        return objReturn;
      }
      catch (Exception exception)
      {
        objReturn.Status = false;
        objReturn.Message = "Error: " + exception.Message;
        return objReturn;
      }
    }

        [HttpGet("GetRecursosPerfinalidad")]
        public ModelPresupuestoData GetRecursosPerfinalidad(int anyo)
        {
            List<itemNiveles> objGrupo = new List<itemNiveles>();
            List<InfoConsolidadoPresupuesto> info = new List<InfoConsolidadoPresupuesto>();
            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                info = consolidadoPresupuesto.GetRecursosPerfinalidad(anyo);
                objReturn.InfoRecursos = info;
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }

        [HttpGet("ObtenerSectoresPerNombre")]
        public ModelPresupuestoData ObtenerSectoresPerNombre(int anyo)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try
            {
                Presupuesto.sectores = consolidadoPresupuesto.ObtenerSectoresPerNombre(anyo);
                Presupuesto.Status = true;
                return Presupuesto;
            }
            catch (Exception exception)
            {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
            }
        }


        [HttpGet("ObtDistribucionBySectorFuentes")]
        public ModelPresupuestoData ObtDistribucionBySectorFuentes(int anyo, string opcion,string tipo)

        {

            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                List<InfograficoFuentes_Nivel_1> info = consolidadoPresupuesto.ObtDistribucionBySectorFuentes(anyo, opcion,tipo);
                decimal totalPresupuesto = info.Sum(item => item.presupuesto);
                decimal totalEjecutado = info.Sum(item => item.avance);
                objReturn.distribucionItemsByFuente = info;
                objReturn.TotalPresupuesto = totalPresupuesto;
                objReturn.TotalEjecutado = totalEjecutado;
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }

        [HttpGet("ObtenerOrganismosPerNombre")]
        public ModelPresupuestoData ObtenerOrganismosPerNombre(int anyo)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try
            {
                Presupuesto.organismos = consolidadoPresupuesto.ObtenerOrganismosPerNombre(anyo);
                Presupuesto.Status = true;
                return Presupuesto;
            }
            catch (Exception exception)
            {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
            }
        }


        [HttpGet("GetInfograficoPerEntidad")]
        public ModelPresupuestoData GetInfograficoPerEntidad(int annio, string id,string tipo)
        {
            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                objReturn.InfograficoPerEntidad = consolidadoPresupuesto.GetInfograficoPerEntidad(annio, id,tipo);
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }

        [HttpGet("BarChartEntidades")]
        public ModelPresupuestoData BarChartEntidades(int anyo, string filtro)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            List<string> filtro_aux_sec = new List<string>();
            try
            {
                if (filtro != null && filtro != "")
                {
                    var cadList = filtro.Split('|')
                    .Select(m => { return m; })
                    .Where(m => m != "")
                    .Distinct().ToList();
                    filtro_aux_sec = cadList;
                }
                Presupuesto.InfoRecursos = consolidadoPresupuesto.ObtenerGastoEntidades(anyo, filtro_aux_sec);
                Presupuesto.Status = true;
                return Presupuesto;
            }
            catch (Exception exception)
            {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
            }
        }

        [HttpGet("ObtenerEntidadesPerNombre")]
        public ModelPresupuestoData ObtenerEntidadesPerNombre(int anyo)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try
            {
                Presupuesto.entidades = consolidadoPresupuesto.ObtenerEntidadesPerNombre(anyo);
                Presupuesto.Status = true;
                return Presupuesto;
            }
            catch (Exception exception)
            {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
            }
        }

        [HttpGet("BarChartTiempoEntidades")]
        public ModelPresupuestoData BarChartTiempoEntidades(int anyo, string filtro)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            List<string> filtro_aux_sec = new List<string>();
            try
            {
                if (filtro != null && filtro != "")
                {
                    var cadList = filtro.Split('|')
                    .Select(m => { return m; })
                    .Where(m => m != "")
                    .Distinct().ToList();
                    filtro_aux_sec = cadList;
                }
                Presupuesto.InfoRecursos = consolidadoPresupuesto.ObtenerGastoPerTiempoEntidades(anyo, filtro_aux_sec);
                Presupuesto.Status = true;
                return Presupuesto;
            }
            catch (Exception exception)
            {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
            }
        }

        [HttpGet("GetInfograficoPerProyecto")]
        public ModelPresupuestoData GetInfograficoPerProyecto(int annio, string id)
        {
            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                objReturn.proyectosInv = consolidadoPresupuesto.GetInfograficoPerProyecto(annio, id);
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }
    }
}
